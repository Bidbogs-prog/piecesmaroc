import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem, CreateOrderInput, UpdateOrderStatusInput } from '@/types/database';

// Generate a unique order number (format: ORD-YYYYMMDD-XXXX)
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

export async function createOrder(input: CreateOrderInput) {
  const deliveryFee = input.delivery_fee ?? 25.00;
  const subtotal = input.items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
  const totalAmount = subtotal + deliveryFee;

  // Generate unique order number
  const orderNumber = generateOrderNumber();

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'pending',
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_address: input.customer_address,
      customer_city: input.customer_city,
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      notes: input.notes,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Get supplier_id for each product and create order items
  const orderItemsWithSuppliers = [];

  for (const item of input.items) {
    const { data: product } = await supabase
      .from('products')
      .select('supplier_id')
      .eq('id', item.product_id)
      .single();

    orderItemsWithSuppliers.push({
      order_id: order.id,
      product_id: item.product_id,
      supplier_id: product?.supplier_id || null,
      product_name: item.product_name,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    });
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithSuppliers);

  if (itemsError) throw itemsError;

  return order as Order;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(*),
        supplier:suppliers(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Order;
}

export async function getOrderByOrderNumber(orderNumber: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(*),
        supplier:suppliers(*)
      )
    `)
    .eq('order_number', orderNumber)
    .single();

  if (error) throw error;
  return data as Order;
}

export async function getOrdersBySupplier(supplierId: string) {
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      *,
      order:orders(*),
      product:products(*)
    `)
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as OrderItem[];
}

export async function getAllOrders(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(*),
        supplier:suppliers(*)
      )
    `);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.order_id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function cancelOrder(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}
