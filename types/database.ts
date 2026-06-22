// Database types for PiecesMaroc — match supabase/schema.sql

export interface Make {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface Model {
  id: number;
  make_id: number;
  name: string;
  short_name: string;
  slug: string;
}

export interface Vehicle {
  id: number;
  model_id: number;
  name: string;
  short_name: string;
  fuel_type: string | null;
  year_from: number | null;
  year_to: number | null;
  catalog_slug: string | null;
}

export interface Category {
  id: string;
  cartec_id: number | null;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  is_leaf: boolean;
  // computed (not in DB)
  product_count?: number;
  subcategories?: Category[];
}

export interface Linkage {
  id: number;
  name: string;
  shortName: string | null;
  value: string;
}

export type ProductCondition = "aftermarket" | "refurbished" | "used";

export interface Product {
  id: string;
  cartec_part_id: number | null;
  vehicle_id: number | null;
  category_id: string | null;
  make_id: number | null;
  name: string;
  extra_name: string | null;
  article_number: string | null;
  brand_name: string | null;
  brand_logo_url: string | null;
  image_url: string | null;
  in_stock: boolean;
  price: number;
  original_price: number | null;
  is_synthetic_price: boolean;
  condition: ProductCondition;
  linkages: Linkage[];
  details: Linkage[];
  created_at: string;
  // joined / computed
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  make?: Pick<Make, "id" | "name" | "logo_url"> | null;
  vehicle?: Pick<Vehicle, "id" | "name" | "short_name"> | null;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// Cart (client-side only)
export interface CartItem {
  id: string;
  name: string;
  brand_name: string | null;
  article_number: string | null;
  image_url: string | null;
  price: number;
  quantity: number;
}
