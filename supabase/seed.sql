-- Seed data for PiecesMaroc
-- Run this AFTER running add-categories-table.sql

-- Insert main categories
INSERT INTO categories (id, name, slug, description, parent_id, image_url) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Engine Parts', 'engine-parts', 'Complete engine components and accessories', NULL, '/categories/engine.jpg'),
  ('c1000000-0000-0000-0000-000000000002', 'Transmission', 'transmission', 'Gearboxes, clutches, and transmission components', NULL, '/categories/transmission.jpg'),
  ('c1000000-0000-0000-0000-000000000003', 'Suspension & Steering', 'suspension-steering', 'Suspension systems, shock absorbers, and steering components', NULL, '/categories/suspension.jpg'),
  ('c1000000-0000-0000-0000-000000000004', 'Braking System', 'braking-system', 'Brake pads, discs, calipers, and brake system components', NULL, '/categories/brakes.jpg'),
  ('c1000000-0000-0000-0000-000000000005', 'Electrical System', 'electrical-system', 'Batteries, alternators, starters, and electrical components', NULL, '/categories/electrical.jpg'),
  ('c1000000-0000-0000-0000-000000000006', 'Cooling System', 'cooling-system', 'Radiators, water pumps, thermostats, and cooling components', NULL, '/categories/cooling.jpg'),
  ('c1000000-0000-0000-0000-000000000007', 'Exhaust System', 'exhaust-system', 'Mufflers, catalytic converters, and exhaust pipes', NULL, '/categories/exhaust.jpg'),
  ('c1000000-0000-0000-0000-000000000008', 'Body Parts', 'body-parts', 'Doors, bumpers, fenders, hoods, and body panels', NULL, '/categories/body.jpg'),
  ('c1000000-0000-0000-0000-000000000009', 'Lighting', 'lighting', 'Headlights, tail lights, fog lights, and indicators', NULL, '/categories/lighting.jpg'),
  ('c1000000-0000-0000-0000-000000000010', 'Interior Parts', 'interior-parts', 'Seats, dashboard, door panels, and interior trim', NULL, '/categories/interior.jpg'),
  ('c1000000-0000-0000-0000-000000000011', 'Wheels & Tires', 'wheels-tires', 'Rims, tires, and wheel accessories', NULL, '/categories/wheels.jpg'),
  ('c1000000-0000-0000-0000-000000000012', 'Filters & Fluids', 'filters-fluids', 'Oil filters, air filters, engine oils, and fluids', NULL, '/categories/filters.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert subcategories for Engine Parts
INSERT INTO categories (id, name, slug, description, parent_id, image_url) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'Pistons & Rings', 'pistons-rings', 'Engine pistons, piston rings, and related components', 'c1000000-0000-0000-0000-000000000001', NULL),
  ('c2000000-0000-0000-0000-000000000002', 'Cylinder Heads', 'cylinder-heads', 'Cylinder heads and valve covers', 'c1000000-0000-0000-0000-000000000001', NULL),
  ('c2000000-0000-0000-0000-000000000003', 'Timing Belts & Chains', 'timing-belts-chains', 'Timing belts, chains, and tensioners', 'c1000000-0000-0000-0000-000000000001', NULL),
  ('c2000000-0000-0000-0000-000000000004', 'Oil Pumps', 'oil-pumps', 'Engine oil pumps and related components', 'c1000000-0000-0000-0000-000000000001', NULL),
  ('c2000000-0000-0000-0000-000000000005', 'Gaskets & Seals', 'gaskets-seals', 'Engine gaskets, seals, and O-rings', 'c1000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert subcategories for Electrical System
INSERT INTO categories (id, name, slug, description, parent_id, image_url) VALUES
  ('c2000000-0000-0000-0000-000000000010', 'Batteries', 'batteries', 'Car batteries and battery accessories', 'c1000000-0000-0000-0000-000000000005', NULL),
  ('c2000000-0000-0000-0000-000000000011', 'Alternators', 'alternators', 'Alternators and charging system components', 'c1000000-0000-0000-0000-000000000005', NULL),
  ('c2000000-0000-0000-0000-000000000012', 'Starters', 'starters', 'Starter motors and solenoids', 'c1000000-0000-0000-0000-000000000005', NULL),
  ('c2000000-0000-0000-0000-000000000013', 'Wiring & Connectors', 'wiring-connectors', 'Electrical wiring, connectors, and harnesses', 'c1000000-0000-0000-0000-000000000005', NULL),
  ('c2000000-0000-0000-0000-000000000014', 'Fuses & Relays', 'fuses-relays', 'Fuse boxes, fuses, and electrical relays', 'c1000000-0000-0000-0000-000000000005', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert subcategories for Braking System
INSERT INTO categories (id, name, slug, description, parent_id, image_url) VALUES
  ('c2000000-0000-0000-0000-000000000020', 'Brake Pads', 'brake-pads', 'Front and rear brake pads', 'c1000000-0000-0000-0000-000000000004', NULL),
  ('c2000000-0000-0000-0000-000000000021', 'Brake Discs', 'brake-discs', 'Brake discs and rotors', 'c1000000-0000-0000-0000-000000000004', NULL),
  ('c2000000-0000-0000-0000-000000000022', 'Brake Calipers', 'brake-calipers', 'Brake calipers and pistons', 'c1000000-0000-0000-0000-000000000004', NULL),
  ('c2000000-0000-0000-0000-000000000023', 'Brake Lines & Hoses', 'brake-lines-hoses', 'Brake lines, hoses, and fittings', 'c1000000-0000-0000-0000-000000000004', NULL),
  ('c2000000-0000-0000-0000-000000000024', 'Master Cylinder', 'master-cylinder', 'Brake master cylinders and boosters', 'c1000000-0000-0000-0000-000000000004', NULL)
ON CONFLICT (id) DO NOTHING;

-- Sample suppliers (optional - for testing)
INSERT INTO suppliers (id, name, phone, email, city, contact_person) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Auto Parts Casa', '+212 522-123456', 'contact@autopartscasa.ma', 'Casablanca', 'Ahmed Bennani'),
  ('a2000000-0000-0000-0000-000000000002', 'Pièces Express', '+212 522-234567', 'info@piecesexpress.ma', 'Casablanca', 'Fatima El Amrani')
ON CONFLICT (id) DO NOTHING;

-- Sample products (optional - for testing)
INSERT INTO products (id, supplier_id, category_id, name, description, price, original_price, condition, car_make, car_model, year_from, year_to, category, part_number, image_urls, stock_quantity) VALUES
  (gen_random_uuid(),
   'a1000000-0000-0000-0000-000000000001',
   'c2000000-0000-0000-0000-000000000020',
   'Front Brake Pads - Toyota Corolla',
   'High-quality ceramic brake pads for Toyota Corolla. Excellent stopping power and low dust. Compatible with 2010-2018 models.',
   250.00,
   350.00,
   'aftermarket',
   'Toyota',
   'Corolla',
   2010,
   2018,
   'Braking System',
   'BP-TC-2010',
   ARRAY['/products/brake-pads-1.jpg', '/products/brake-pads-2.jpg']::text[],
   15
  ),
  (gen_random_uuid(),
   'a2000000-0000-0000-0000-000000000002',
   'c2000000-0000-0000-0000-000000000011',
   'Alternator - Renault Clio',
   'Refurbished alternator for Renault Clio. Tested and guaranteed for 6 months. 90A output.',
   450.00,
   800.00,
   'refurbished',
   'Renault',
   'Clio',
   2012,
   2019,
   'Electrical System',
   'ALT-RC-2012',
   ARRAY['/products/alternator-1.jpg']::text[],
   5
  )
ON CONFLICT (id) DO NOTHING;