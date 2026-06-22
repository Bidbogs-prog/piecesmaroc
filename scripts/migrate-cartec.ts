/**
 * Migrate cartec-export.json into Supabase.
 *
 *   npm run migrate
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Idempotent: upserts on the cartec id, so it can be re-run safely.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "\n  Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Raw cartec types ────────────────────────────────────────────────────────
interface Manufacturer { id: number; name: string; logo: string }
interface Model { id: number; manufacturerId: number; name: string; shortName: string }
interface VehicleRaw { id: number; modelId: number; name: string; shortName: string; fuelType: string; catalogSlug: string }
interface CategoryRaw { id: number; name: string; img: string; parentId: number | null; isLeaf: boolean }
interface Linkage { id: number; name: string; shortName: string | null; value: string }
interface PartRaw {
  id: number; vehicleId: number; categoryId: number; articleNumber: string;
  articleName: string; articleExtraName: string | null; brandName: string;
  brandLogo: string; articleImg: string; inStock: boolean;
  firstPrice: number | null; discountPrice: string; discount: number; promo: boolean;
  articleLinkages: Linkage[]; articleDetails: Linkage[];
}
interface Export {
  manufacturers: Manufacturer[]; models: Model[]; vehicles: VehicleRaw[];
  categories: CategoryRaw[]; parts: PartRaw[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const CDN = "https://www.cartec.ma";
const NAMESPACE = "8b1f4d2e-0c3a-4e7b-9f6a-1d2c3b4a5e6f"; // fixed → deterministic UUIDs

function slugify(s: string): string {
  return s
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "x";
}

/** Deterministic RFC-4122 v5 UUID (sha1-based) so categories map stably. */
function uuidv5(name: string): string {
  const nsHex = NAMESPACE.replace(/-/g, "");
  const nsBytes = Buffer.from(nsHex, "hex");
  const hash = createHash("sha1").update(Buffer.concat([nsBytes, Buffer.from(name)])).digest();
  const b = hash.subarray(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50; // version 5
  b[8] = (b[8] & 0x3f) | 0x80; // variant
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
const catUuid = (cartecId: number) => uuidv5(`category:${cartecId}`);

function parseYears(name: string): { from: number | null; to: number | null } {
  const m = name.match(/\((\d{2})\.(\d{4})\s*-\s*(\d{2})\.(\d{4})\)/);
  if (m) return { from: parseInt(m[2]), to: parseInt(m[4]) };
  const open = name.match(/\((\d{2})\.(\d{4})\s*-\s*\)?/);
  if (open) return { from: parseInt(open[2]), to: null };
  return { from: null, to: null };
}

/** Stable 32-bit hash of a string. */
function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Per top-level category price bands in MAD: [min, max]
const PRICE_BANDS: Record<string, [number, number]> = {
  moteur: [220, 4200],
  filtre: [40, 190],
  freinage: [120, 950],
  refroidissement: [150, 1600],
  "allumage-prechauffage": [60, 750],
  "systeme-electrique": [150, 3600],
  amortissement: [250, 1900],
  "direction-suspension": [120, 1600],
  "suspension-d-essieu-guidage-des-roues-roues": [150, 1700],
  "cardan-de-transmission": [300, 2300],
  "courroie-d-accessoires": [80, 950],
  "nettoyage-des-vitres": [30, 420],
  "embrayage-composants": [400, 3600],
  "boite-de-vitesses": [500, 6200],
  climatisation: [300, 4600],
  "alimentation-air-carburant": [150, 3100],
  "systeme-d-information-et-de-communication": [100, 2100],
  "entrainement-des-essieux": [300, 3100],
  "entrainement-hybride-electrique": [500, 6200],
  roulement: [80, 850],
  "liquides-lubrifiants": [40, 360],
};
const DEFAULT_BAND: [number, number] = [100, 1500];

function round5(n: number): number {
  return Math.max(5, Math.round(n / 5) * 5);
}

// ── Upsert in batches ─────────────────────────────────────────────────────────
async function upsertBatched<T>(table: string, rows: T[], conflict: string, size = 500) {
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const { error } = await supabase.from(table).upsert(chunk as object[], { onConflict: conflict });
    if (error) {
      console.error(`  ✗ ${table} batch @${i}:`, error.message);
      process.exit(1);
    }
    process.stdout.write(`\r  ${table}: ${Math.min(i + size, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Loading cartec-export.json …");
  const data = JSON.parse(
    readFileSync(join(process.cwd(), "cartec-export.json"), "utf-8")
  ) as Export;

  // Lookup maps
  const modelMap = new Map(data.models.map((m) => [m.id, m]));
  const catMap = new Map(data.categories.map((c) => [c.id, c]));
  const vehicleMap = new Map(data.vehicles.map((v) => [v.id, v]));

  // Top-level category slug for a given category id (walks up the tree)
  const topSlugCache = new Map<number, string>();
  function topLevelSlug(catId: number): string {
    if (topSlugCache.has(catId)) return topSlugCache.get(catId)!;
    let cur = catMap.get(catId);
    const seen = new Set<number>();
    while (cur && cur.parentId != null && !seen.has(cur.id)) {
      seen.add(cur.id);
      cur = catMap.get(cur.parentId);
    }
    const slug = cur ? slugify(cur.name) : "";
    topSlugCache.set(catId, slug);
    return slug;
  }

  // ---- Makes ----
  const makes = data.manufacturers.map((m) => ({
    id: m.id,
    name: m.name,
    slug: slugify(m.name),
    logo_url: m.logo ? `${CDN}${m.logo}` : null,
  }));

  // ---- Models ----
  const models = data.models
    .filter((m) => data.manufacturers.some((mf) => mf.id === m.manufacturerId))
    .map((m) => ({
      id: m.id,
      make_id: m.manufacturerId,
      name: m.name,
      short_name: m.shortName,
      slug: `${slugify(m.shortName)}-${m.id}`,
    }));

  // ---- Vehicles ----
  const vehicles = data.vehicles
    .filter((v) => modelMap.has(v.modelId))
    .map((v) => {
      const { from, to } = parseYears(v.name);
      return {
        id: v.id,
        model_id: v.modelId,
        name: v.name,
        short_name: v.shortName,
        fuel_type: v.fuelType || null,
        year_from: from,
        year_to: to,
        catalog_slug: v.catalogSlug || null,
      };
    });

  // ---- Categories (ensure unique slugs) ----
  const usedSlugs = new Set<string>();
  const categories = data.categories.map((c) => {
    let slug = slugify(c.name);
    if (usedSlugs.has(slug)) slug = `${slug}-${c.id}`;
    usedSlugs.add(slug);
    return {
      id: catUuid(c.id),
      cartec_id: c.id,
      name: c.name,
      slug,
      parent_id: c.parentId != null ? catUuid(c.parentId) : null,
      image_url: c.img ? `${CDN}${c.img}` : null,
      is_leaf: c.isLeaf,
    };
  });

  // ---- Products (parts) ----
  const products = data.parts.map((p) => {
    const vehicle = vehicleMap.get(p.vehicleId);
    const model = vehicle ? modelMap.get(vehicle.modelId) : undefined;
    const makeId = model ? model.manufacturerId : null;

    // Price: real if present, else synthesized & flagged
    const real = p.firstPrice && p.firstPrice > 0
      ? p.firstPrice
      : parseFloat(p.discountPrice) > 0 ? parseFloat(p.discountPrice) : 0;

    const h = hash32(p.articleNumber || String(p.id));
    let price: number;
    let isSynthetic = false;
    if (real > 0) {
      price = round5(real);
    } else {
      const [min, max] = PRICE_BANDS[topLevelSlug(p.categoryId)] ?? DEFAULT_BAND;
      price = round5(min + (h % (max - min)));
      isSynthetic = true;
    }
    // ~20% carry a struck-through original price for a discount badge
    const originalPrice = h % 5 === 0 ? round5(price * (1.12 + ((h >> 3) % 28) / 100)) : null;

    const img = p.articleImg && !p.articleImg.includes("no-pic") ? `${CDN}${p.articleImg}` : null;

    return {
      cartec_part_id: p.id,
      vehicle_id: vehicle ? p.vehicleId : null,
      category_id: catMap.has(p.categoryId) ? catUuid(p.categoryId) : null,
      make_id: makeId,
      name: p.articleName,
      extra_name: p.articleExtraName,
      article_number: p.articleNumber,
      brand_name: p.brandName,
      brand_logo_url: p.brandLogo ? `${CDN}${p.brandLogo}` : null,
      image_url: img,
      in_stock: h % 5 !== 0, // ~80% in stock
      price,
      original_price: originalPrice,
      is_synthetic_price: isSynthetic,
      condition: "aftermarket",
      linkages: p.articleLinkages ?? [],
      details: p.articleDetails ?? [],
    };
  });

  console.log(
    `Parsed: ${makes.length} makes, ${models.length} models, ${vehicles.length} vehicles, ` +
    `${categories.length} categories, ${products.length} products`
  );

  await upsertBatched("makes", makes, "id");
  await upsertBatched("models", models, "id");
  await upsertBatched("vehicles", vehicles, "id");
  await upsertBatched("categories", categories, "cartec_id");
  await upsertBatched("products", products, "cartec_part_id");

  console.log("\n✓ Migration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
