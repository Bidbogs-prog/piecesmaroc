import { supabase } from '@/lib/supabase/client';
import type { Supplier, CreateSupplierInput } from '@/types/database';

export async function getAllSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data as Supplier[];
}

export async function getSupplierById(id: string) {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function createSupplier(input: CreateSupplierInput) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert({
      ...input,
      city: input.city ?? 'Casablanca',
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function updateSupplier(id: string, updates: Partial<CreateSupplierInput>) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function toggleSupplierStatus(id: string, isActive: boolean) {
  const { data, error } = await supabase
    .from('suppliers')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getSupplierProducts(supplierId: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id(*)
    `)
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
