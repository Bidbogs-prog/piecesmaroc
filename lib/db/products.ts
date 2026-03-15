import { supabase } from '@/lib/supabase/client';
import type { Product, CreateProductInput, UpdateProductInput } from '@/types/database';

export async function getProducts(filters?: {
  category_id?: string;
  supplier_id?: string;
  search?: string;
  condition?: string;
  car_make?: string;
  car_model?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('products')
    .select(`
      *,
      supplier:suppliers(*),
      categories:category_id(*)
    `)
    .eq('is_available', true);

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  if (filters?.supplier_id) {
    query = query.eq('supplier_id', filters.supplier_id);
  }

  if (filters?.condition) {
    query = query.eq('condition', filters.condition);
  }

  if (filters?.car_make) {
    query = query.ilike('car_make', `%${filters.car_make}%`);
  }

  if (filters?.car_model) {
    query = query.ilike('car_model', `%${filters.car_model}%`);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,car_make.ilike.%${filters.search}%,car_model.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      supplier:suppliers(*),
      categories:category_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function getFeaturedProducts(limit = 8) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      supplier:suppliers(*),
      categories:category_id(*)
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Product[];
}

export async function getProductsByCarMake(carMake: string, limit = 20) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      supplier:suppliers(*),
      categories:category_id(*)
    `)
    .eq('is_available', true)
    .ilike('car_make', `%${carMake}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Product[];
}

export async function createProduct(input: CreateProductInput) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...input,
      is_available: input.is_available ?? true,
      stock_quantity: input.stock_quantity ?? 1,
      image_urls: input.image_urls ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(input: UpdateProductInput) {
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateProductStock(productId: string, quantity: number) {
  const { data, error } = await supabase
    .from('products')
    .update({
      stock_quantity: quantity,
      is_available: quantity > 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function toggleProductAvailability(productId: string, isAvailable: boolean) {
  const { data, error } = await supabase
    .from('products')
    .update({
      is_available: isAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}
