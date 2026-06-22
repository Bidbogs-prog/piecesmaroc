import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, ClipboardCheck, Truck } from "lucide-react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getTopCategories, getPopularBrands } from "@/lib/db/catalog";
import { getFeaturedProducts, getDealProducts } from "@/lib/db/products";
import type { Category, Product } from "@/types/database";

export default async function Home() {
  const [categories, featured, deals, brands] = await Promise.all([
    safe(getTopCategories(), [] as Category[]),
    safe(getFeaturedProducts(8), [] as Product[]),
    safe(getDealProducts(4), [] as Product[]),
    safe(getPopularBrands(12), [] as { name: string; logo: string | null }[]),
  ]);

  return (
    <>
      <Hero />

      {!categories.length && !featured.length && <SetupNotice />}

      {categories.length > 0 && (
        <Section title="Shop by category" href="/categories" linkLabel="All categories">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="grid size-14 place-items-center rounded-xl bg-muted">
                  {c.image_url ? (
                    <Image src={c.image_url} alt="" width={36} height={36} className="size-9 object-contain" />
                  ) : (
                    <Search className="size-6 text-muted-foreground" />
                  )}
                </div>
                <span className="line-clamp-2 text-sm font-medium leading-tight group-hover:text-primary">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {featured.length > 0 && (
        <Section title="Featured parts" href="/products" linkLabel="View all">
          <ProductGrid products={featured} />
        </Section>
      )}

      {brands.length > 0 && (
        <Section title="Top brands">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {brands.map((b) => (
              <Link
                key={b.name}
                href={`/products?brand=${encodeURIComponent(b.name)}`}
                className="flex h-16 min-w-32 items-center justify-center rounded-xl border bg-card px-5 transition hover:border-primary/40 hover:shadow-sm"
              >
                {b.logo ? (
                  <Image src={b.logo} alt={b.name} width={88} height={36} className="max-h-9 w-auto object-contain" />
                ) : (
                  <span className="font-semibold text-muted-foreground">{b.name}</span>
                )}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {deals.length > 0 && (
        <Section title="Hot deals" href="/products?sort=price-desc" linkLabel="See more">
          <ProductGrid products={deals} />
        </Section>
      )}

      <HowItWorks />
    </>
  );
}

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

function Section({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {linkLabel} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Find your part", text: "Search by vehicle, category, or part number to find an exact match." },
    { icon: ClipboardCheck, title: "Confirm on WhatsApp", text: "Place your order — we confirm availability, price and delivery instantly." },
    { icon: Truck, title: "Delivered to you", text: "Fast delivery across Morocco with pay-on-delivery options." },
  ];
  return (
    <section className="bg-muted/50">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="size-7" />
              </div>
              <div className="mx-auto mt-3 grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {i + 1}
              </div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SetupNotice() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
        <h2 className="text-lg font-semibold">Catalog not loaded yet</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Add your Supabase keys to <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>, run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">supabase/schema.sql</code>, then{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">npm run migrate</code> to populate the marketplace.
        </p>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
