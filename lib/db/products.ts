import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

const SELECT = `
  *,
  category:categories(id, name, slug),
  make:makes(id, name, logo_url),
  vehicle:vehicles(id, name, short_name)
`;

export type ProductSort = "relevance" | "price-asc" | "price-desc" | "newest";

export interface ProductFilters {
  makeId?: number;
  modelId?: number;
  vehicleId?: number;
  categoryId?: string; // uuid
  categorySlug?: string;
  brand?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface ProductPage {
  rows: Product[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductPage> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("products").select(SELECT, { count: "exact" });

  if (filters.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id, parent_id")
      .eq("slug", filters.categorySlug)
      .maybeSingle();
    if (cat) {
      // include direct children so a top-level category shows all its parts
      const { data: kids } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", cat.id);
      const ids = [cat.id, ...((kids as { id: string }[]) ?? []).map((k) => k.id)];
      query = query.in("category_id", ids);
    } else {
      return emptyPage(page, pageSize);
    }
  }
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.makeId) query = query.eq("make_id", filters.makeId);
  if (filters.vehicleId) {
    query = query.eq("vehicle_id", filters.vehicleId);
  } else if (filters.modelId) {
    // Resolve a model to its vehicle variants, then filter products by them.
    const { data: vs } = await supabase
      .from("vehicles")
      .select("id")
      .eq("model_id", filters.modelId);
    const ids = ((vs as { id: number }[]) ?? []).map((v) => v.id);
    if (ids.length === 0) return emptyPage(page, pageSize);
    query = query.in("vehicle_id", ids);
  }
  if (filters.brand) query = query.eq("brand_name", filters.brand);
  if (filters.inStockOnly) query = query.eq("in_stock", true);
  if (typeof filters.priceMin === "number") query = query.gte("price", filters.priceMin);
  if (typeof filters.priceMax === "number") query = query.lte("price", filters.priceMax);
  if (filters.search) {
    query = query.textSearch("search_text", filters.search.trim(), {
      type: "websearch",
      config: "simple",
    });
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("in_stock", { ascending: false }).order("price", { ascending: true });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) {
    console.error("getProducts:", error.message);
    return emptyPage(page, pageSize);
  }

  const total = count ?? 0;
  return {
    rows: (data as Product[]) ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

function emptyPage(page: number, pageSize: number): ProductPage {
  return { rows: [], count: 0, page, pageSize, totalPages: 1 };
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(SELECT).eq("id", id).maybeSingle();
  return (data as Product) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(SELECT)
    .eq("in_stock", true)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Product[]) ?? [];
}

export async function getDealProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(SELECT)
    .not("original_price", "is", null)
    .eq("in_stock", true)
    .order("price", { ascending: false })
    .limit(limit);
  return (data as Product[]) ?? [];
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(SELECT)
    .neq("id", product.id)
    .eq("in_stock", true)
    .limit(limit);
  if (product.category_id) query = query.eq("category_id", product.category_id);
  const { data } = await query;
  return (data as Product[]) ?? [];
}
