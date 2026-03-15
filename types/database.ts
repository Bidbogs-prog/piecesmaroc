// Database types for PiecesMaroc
// These types match your actual Supabase schema

export type ProductCondition = 'used' | 'refurbished' | 'aftermarket';
export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'shipped' | 'delivered' | 'cancelled';

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string;
  contact_person: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  supplier_id: string | null;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  condition: ProductCondition;
  car_make: string;
  car_model: string | null;
  year_from: number | null;
  year_to: number | null;
  category: string; // Legacy TEXT field
  part_number: string | null;
  image_urls: string[];
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields (when fetching with relations)
  supplier?: Supplier;
  categories?: Category; // Using 'categories' to match the table name
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  supplier_id: string | null;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  // Joined fields
  product?: Product;
  supplier?: Supplier;
}

// Cart types (client-side only, not stored in DB)
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// Form types for creating/updating records
export interface CreateProductInput {
  supplier_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  condition: ProductCondition;
  car_make: string;
  car_model?: string;
  year_from?: number;
  year_to?: number;
  category: string; // Legacy field
  part_number?: string;
  image_urls?: string[];
  stock_quantity?: number;
  is_available?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface CreateSupplierInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  contact_person?: string;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
  }[];
  notes?: string;
  delivery_fee?: number;
}

export interface UpdateOrderStatusInput {
  order_id: string;
  status: OrderStatus;
}

// Supabase response types
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type DbResultErr = { error: { message: string } };
