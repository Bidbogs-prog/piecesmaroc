-- ===========================================================================
-- PiecesMaroc schema
-- Run this once in the Supabase SQL editor, then run `npm run migrate`.
-- Safe to re-run (drops & recreates catalog tables).
-- ===========================================================================

-- ---- Extensions -----------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---- Clean slate for catalog tables ---------------------------------------
drop table if exists products cascade;
drop table if exists vehicles cascade;
drop table if exists models cascade;
drop table if exists makes cascade;
drop table if exists categories cascade;

-- ---- Makes (manufacturers) ------------------------------------------------
create table makes (
  id        integer primary key,            -- cartec manufacturer id
  name      text not null,
  slug      text not null,
  logo_url  text
);
create index makes_name_idx on makes (name);

-- ---- Models ---------------------------------------------------------------
create table models (
  id          integer primary key,          -- cartec model id
  make_id     integer not null references makes (id) on delete cascade,
  name        text not null,
  short_name  text not null,
  slug        text not null
);
create index models_make_idx on models (make_id);

-- ---- Vehicles (engine/year variants) --------------------------------------
create table vehicles (
  id            integer primary key,        -- cartec vehicle id
  model_id      integer not null references models (id) on delete cascade,
  name          text not null,
  short_name    text not null,
  fuel_type     text,
  year_from     integer,
  year_to       integer,
  catalog_slug  text
);
create index vehicles_model_idx on vehicles (model_id);

-- ---- Categories (self-referencing tree) -----------------------------------
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  cartec_id   integer unique,
  name        text not null,
  slug        text not null unique,
  parent_id   uuid references categories (id) on delete set null,
  image_url   text,
  is_leaf     boolean not null default true
);
create index categories_parent_idx on categories (parent_id);
create index categories_cartec_idx on categories (cartec_id);

-- ---- Products (parts) -----------------------------------------------------
create table products (
  id                 uuid primary key default uuid_generate_v4(),
  cartec_part_id     integer unique,
  vehicle_id         integer references vehicles (id) on delete set null,
  category_id        uuid references categories (id) on delete set null,
  make_id            integer references makes (id) on delete set null,
  name               text not null,
  extra_name         text,
  article_number     text,
  brand_name         text,
  brand_logo_url     text,
  image_url          text,
  in_stock           boolean not null default true,
  price              numeric(10, 2) not null default 0,
  original_price     numeric(10, 2),
  is_synthetic_price boolean not null default false,
  condition          text not null default 'aftermarket',
  linkages           jsonb not null default '[]'::jsonb,
  details            jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now(),
  -- full-text search vector over name / brand / article number
  search_text        tsvector generated always as (
                        to_tsvector('simple',
                          coalesce(name, '') || ' ' ||
                          coalesce(extra_name, '') || ' ' ||
                          coalesce(brand_name, '') || ' ' ||
                          coalesce(article_number, ''))
                      ) stored
);
create index products_category_idx on products (category_id);
create index products_make_idx     on products (make_id);
create index products_vehicle_idx  on products (vehicle_id);
create index products_brand_idx    on products (brand_name);
create index products_price_idx    on products (price);
create index products_search_idx   on products using gin (search_text);

-- ---- Profiles (1:1 with auth.users) ---------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===========================================================================
-- Row Level Security
-- ===========================================================================

-- Catalog: public read-only
alter table makes      enable row level security;
alter table models     enable row level security;
alter table vehicles   enable row level security;
alter table categories enable row level security;
alter table products   enable row level security;

create policy "public read makes"      on makes      for select using (true);
create policy "public read models"     on models     for select using (true);
create policy "public read vehicles"   on vehicles   for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read products"   on products   for select using (true);

-- Profiles: owner can read/update own row
alter table profiles enable row level security;

create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);
