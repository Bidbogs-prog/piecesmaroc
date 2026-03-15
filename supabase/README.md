# Database Setup Guide for PiecesMaroc

This guide will help you complete the Supabase database setup for the PiecesMaroc marketplace.

## Prerequisites

- ✅ Supabase account and project created
- ✅ Environment variables configured in `.env`
- ✅ Initial tables created (suppliers, products, orders, order_items)

## Database Schema Overview

### Existing Tables

1. **suppliers** - Supplier business information
   - Business name and contact info
   - City and address
   - Active status

2. **products** - Auto parts listings
   - Product details with car compatibility (make, model, years)
   - Pricing (original and sale price)
   - Stock management
   - Condition (used, refurbished, aftermarket)
   - Multiple images support
   - Links to supplier and category

3. **orders** - Customer orders
   - Unique order number
   - Customer information (name, phone, address)
   - Order status tracking
   - Subtotal, delivery fee, and total
   - Cash on delivery (COD)

4. **order_items** - Individual items in orders
   - Links orders to products
   - Quantity and pricing at purchase
   - Supplier tracking for each item

### New Table to Add

5. **categories** - Product categories (hierarchical)
   - Main categories and subcategories
   - SEO-friendly slugs
   - Images and descriptions

## Setup Steps

### 1. Add the Categories Table

First, run the migration to add the categories table:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `add-categories-table.sql`
4. Execute the SQL

This will:
- Create the `categories` table
- Add `category_id` foreign key to products
- Set up indexes for performance
- Add automatic timestamp updates

### 2. Load the Seed Data

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `seed.sql`
4. Paste and run in the SQL Editor

This will populate your database with:
- 12 main product categories
- 15+ subcategories
- Auto parts categories ready to use

### 2. Verify the Data

Run this query to check categories:

```sql
SELECT * FROM categories WHERE parent_id IS NULL ORDER BY name;
```

You should see 12 main categories including:
- Engine Parts
- Transmission
- Suspension & Steering
- Braking System
- Electrical System
- And more...

### 3. Create Your First Admin User

1. Sign up through your app's auth flow
2. Get the user ID from Supabase Auth dashboard
3. Update the user's role in the profiles table:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'YOUR_USER_ID_HERE';
```

### 4. Set Up Row Level Security (RLS)

Ensure RLS is enabled on all tables. Here are the basic policies you should have:

#### Products
- SELECT: Public (anyone can view active products)
- INSERT/UPDATE/DELETE: Suppliers (own products) and Admins

#### Orders
- SELECT: Customers (own orders), Suppliers (orders with their items), Admins
- INSERT: Authenticated customers
- UPDATE: Suppliers (status updates), Admins

#### Categories
- SELECT: Public
- INSERT/UPDATE/DELETE: Admins only

#### Profiles
- SELECT: Own profile or Admin
- UPDATE: Own profile or Admin

## Using the Database Helpers

The project includes TypeScript helper functions for common database operations:

### Products

```typescript
import { getProducts, getProductById, createProduct } from '@/lib/db/products';

// Get all products with filters
const products = await getProducts({
  category_id: 'some-uuid',
  search: 'brake pad',
  limit: 20,
  offset: 0
});

// Get single product
const product = await getProductById('product-uuid');

// Create new product (admin/supplier)
const newProduct = await createProduct({
  supplier_id: 'supplier-uuid',
  category_id: 'category-uuid',
  name: 'Brake Pads - Toyota Corolla',
  price: 250.00,
  stock_quantity: 10,
  condition: 'new',
  images: ['/uploads/image1.jpg']
});
```

### Categories

```typescript
import { getCategories, getMainCategories, getSubcategories } from '@/lib/db/categories';

// Get all categories
const allCategories = await getCategories();

// Get only main categories
const mainCategories = await getMainCategories();

// Get subcategories
const subcategories = await getSubcategories('parent-category-uuid');
```

### Orders

```typescript
import { createOrder, getOrdersByCustomer, updateOrderStatus } from '@/lib/db/orders';

// Create new order
const order = await createOrder({
  customer_id: 'customer-uuid',
  items: [
    {
      product_id: 'product-uuid',
      quantity: 2,
      unit_price: 250.00
    }
  ],
  shipping_address: '123 Main St',
  shipping_city: 'Casablanca',
  phone: '+212 XXX-XXXXXX'
});

// Update order status
await updateOrderStatus({
  order_id: 'order-uuid',
  status: 'confirmed'
});
```

## TypeScript Types

All database types are defined in `types/database.ts`:

- `Profile`, `Supplier`, `Category`, `Product`, `Order`, `OrderItem`
- Input types for creating/updating records
- Enums for roles, statuses, and conditions

## Next Steps

1. ✅ Database schema created
2. ✅ Seed data loaded
3. ✅ Helper functions ready
4. 🔲 Set up authentication
5. 🔲 Create admin dashboard
6. 🔲 Build product listing pages
7. 🔲 Implement shopping cart
8. 🔲 Add checkout flow

## Troubleshooting

### "relation does not exist" error
Make sure you've created all tables in Supabase. Check your table definitions match the schema.

### RLS Policy errors
Verify that RLS policies are set up correctly for each role (customer, supplier, admin).

### Foreign key errors
Ensure referenced records exist before creating related records (e.g., supplier must exist before creating products).

## Support

For issues with the database setup, check:
1. Supabase project logs
2. Browser console for detailed error messages
3. Supabase SQL Editor for manual queries
