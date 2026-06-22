import { createClient } from "@/lib/supabase/server";
import type { Make, Model, Vehicle, Category } from "@/types/database";

// ── Makes / Models / Vehicles (cascading vehicle selector) ──────────────────

export async function getMakes(): Promise<Make[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("makes").select("*").order("name");
  return (data as Make[]) ?? [];
}

export async function getModels(makeId: number): Promise<Model[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("models")
    .select("*")
    .eq("make_id", makeId)
    .order("short_name");
  return (data as Model[]) ?? [];
}

export async function getVehicles(modelId: number): Promise<Vehicle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("model_id", modelId)
    .order("year_from", { ascending: false });
  return (data as Vehicle[]) ?? [];
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
  return (data as Vehicle) ?? null;
}

export async function getMakeById(id: number): Promise<Make | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("makes").select("*").eq("id", id).maybeSingle();
  return (data as Make) ?? null;
}

export async function getModelById(id: number): Promise<Model | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("models").select("*").eq("id", id).maybeSingle();
  return (data as Model) ?? null;
}

// ── Categories ───────────────────────────────────────────────────────────────

export async function getTopCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("name");
  return (data as Category[]) ?? [];
}

/** Top-level categories each with their subcategories nested. */
export async function getCategoryTree(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  const all = (data as Category[]) ?? [];
  const tops = all.filter((c) => !c.parent_id);
  for (const top of tops) {
    top.subcategories = all.filter((c) => c.parent_id === top.id);
  }
  return tops;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Category) ?? null;
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("name");
  return (data as Category[]) ?? [];
}

/** Popular brands (by product count) for the homepage strip. */
export async function getPopularBrands(limit = 12): Promise<{ name: string; logo: string | null }[]> {
  const supabase = await createClient();
  // Pull a sample and reduce client-side (avoids needing an RPC for distinct).
  const { data } = await supabase
    .from("products")
    .select("brand_name, brand_logo_url")
    .not("brand_name", "is", null)
    .limit(4000);
  const seen = new Map<string, string | null>();
  for (const row of (data as { brand_name: string; brand_logo_url: string | null }[]) ?? []) {
    if (!seen.has(row.brand_name)) seen.set(row.brand_name, row.brand_logo_url);
  }
  return Array.from(seen.entries())
    .slice(0, limit)
    .map(([name, logo]) => ({ name, logo }));
}
