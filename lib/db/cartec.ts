import { readFileSync } from 'fs';
import { join } from 'path';
import type { Vehicle } from '@/components/VehicleSearchComponent';

// ── Raw cartec types ─────────────────────────────────────────
export interface CartecManufacturer {
  id: number;
  name: string;
  logo: string;
}
export interface CartecModel {
  id: number;
  manufacturerId: number;
  name: string;
  shortName: string;
}
export interface CartecVehicle {
  id: number;
  modelId: number;
  name: string;
  shortName: string;
  fuelType: string;
  catalogSlug: string;
}
export interface CartecCategory {
  id: number;
  name: string;
  img: string;
  parentId: number | null;
  isLeaf: boolean;
}
export interface CartecLinkage {
  id: number;
  name: string;
  shortName: string | null;
  value: string;
}
export interface CartecPart {
  id: number;
  vehicleId: number;
  categoryId: number;
  articleNumber: string;
  articleName: string;
  articleExtraName: string | null;
  brandId: number;
  brandName: string;
  brandLogo: string;
  articleImg: string;
  inStock: boolean;
  firstPrice: number | null;
  discountPrice: string;
  discount: number;
  promo: boolean;
  articleLinkages: CartecLinkage[];
  articleDetails: CartecLinkage[];
}
interface CartecExport {
  manufacturers: CartecManufacturer[];
  models: CartecModel[];
  vehicles: CartecVehicle[];
  categories: CartecCategory[];
  parts: CartecPart[];
}

// ── Module-level cache (loaded once per server process) ──────
let _data: CartecExport | null = null;

function getData(): CartecExport {
  if (!_data) {
    const filePath = join(process.cwd(), 'cartec-export.json');
    _data = JSON.parse(readFileSync(filePath, 'utf-8')) as CartecExport;
  }
  return _data;
}

// ── Helpers ──────────────────────────────────────────────────
function parseDateRange(name: string): { startYear: number; endYear: string } {
  const match = name.match(/\((\d{2})\.(\d{4})\s*-\s*\d{2}\.(\d{4})\)/);
  if (match) return { startYear: parseInt(match[2]), endYear: match[3] };
  return { startYear: 0, endYear: '' };
}

function buildMaps(data: CartecExport) {
  const modelMap = new Map(data.models.map((m) => [m.id, m]));
  const mfrMap = new Map(data.manufacturers.map((m) => [m.id, m]));
  const catMap = new Map(data.categories.map((c) => [c.id, c]));
  return { modelMap, mfrMap, catMap };
}

// ── Public API ───────────────────────────────────────────────

export function getCartecVehicles(): Vehicle[] {
  const data = getData();
  const { modelMap, mfrMap } = buildMaps(data);

  return data.vehicles.map((v) => {
    const model = modelMap.get(v.modelId);
    const mfr = model ? mfrMap.get(model.manufacturerId) : undefined;
    const { startYear, endYear } = parseDateRange(v.name);

    return {
      id: v.id,
      brand: mfr?.name ?? 'Unknown',
      model: model?.shortName ?? 'Unknown',
      start_year: startYear,
      end_year: endYear || 'N/A',
      engine_fuel: v.fuelType,
      engine_example: v.shortName,
      transmission: 'N/A',
    };
  });
}

export interface VehicleDetail {
  vehicle: CartecVehicle;
  model: CartecModel;
  manufacturer: CartecManufacturer;
}

export function getCartecVehicleById(id: number): VehicleDetail | null {
  const data = getData();
  const { modelMap, mfrMap } = buildMaps(data);

  const vehicle = data.vehicles.find((v) => v.id === id);
  if (!vehicle) return null;

  const model = modelMap.get(vehicle.modelId);
  if (!model) return null;

  const manufacturer = mfrMap.get(model.manufacturerId);
  if (!manufacturer) return null;

  return { vehicle, model, manufacturer };
}

export interface PartsByCategory {
  category: CartecCategory;
  parentCategory: CartecCategory | null;
  parts: CartecPart[];
}

export function getTopLevelCategories(): CartecCategory[] {
  return getData().categories.filter((c) => c.parentId === null);
}

export function getSubcategories(parentId: number): CartecCategory[] {
  return getData().categories.filter((c) => c.parentId === parentId);
}

export function getCategoryById(id: number): CartecCategory | null {
  return getData().categories.find((c) => c.id === id) ?? null;
}

export function getPartsCountByCategory(): Map<number, number> {
  const counts = new Map<number, number>();
  for (const part of getData().parts) {
    counts.set(part.categoryId, (counts.get(part.categoryId) ?? 0) + 1);
  }
  return counts;
}

export function getPartsByVehicleId(vehicleId: number): PartsByCategory[] {
  const data = getData();
  const { catMap } = buildMaps(data);

  const parts = data.parts.filter((p) => p.vehicleId === vehicleId);

  // Group by categoryId
  const grouped = new Map<number, CartecPart[]>();
  for (const part of parts) {
    const existing = grouped.get(part.categoryId) ?? [];
    existing.push(part);
    grouped.set(part.categoryId, existing);
  }

  return Array.from(grouped.entries())
    .map(([catId, catParts]) => {
      const category = catMap.get(catId) ?? {
        id: catId,
        name: `Category ${catId}`,
        img: '',
        parentId: null,
        isLeaf: true,
      };
      const parentCategory = category.parentId ? (catMap.get(category.parentId) ?? null) : null;
      return { category, parentCategory, parts: catParts };
    })
    .sort((a, b) => a.category.name.localeCompare(b.category.name));
}
