import { Suspense } from "react";
import Link from "next/link";
import { SlidersHorizontal, PackageX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import SortSelect from "@/components/catalog/SortSelect";
import Pagination from "@/components/catalog/Pagination";
import { getProducts, type ProductSort } from "@/lib/db/products";
import { getTopCategories, getPopularBrands, getMakeById, getVehicleById } from "@/lib/db/catalog";

export const metadata = { title: "Auto Parts" };

type SP = Record<string, string | undefined>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const makeId = sp.make ? Number(sp.make) : undefined;
  const modelId = sp.model ? Number(sp.model) : undefined;
  const vehicleId = sp.vehicle ? Number(sp.vehicle) : undefined;

  const [result, categories, brands, make, vehicle] = await Promise.all([
    getProducts({
      makeId,
      modelId,
      vehicleId,
      categorySlug: sp.category,
      brand: sp.brand,
      search: sp.search,
      priceMin: sp.min ? Number(sp.min) : undefined,
      priceMax: sp.max ? Number(sp.max) : undefined,
      inStockOnly: sp.instock === "1",
      sort: (sp.sort as ProductSort) ?? "relevance",
      page,
      pageSize: 24,
    }),
    getTopCategories(),
    getPopularBrands(60),
    makeId ? getMakeById(makeId) : Promise.resolve(null),
    vehicleId ? getVehicleById(vehicleId) : Promise.resolve(null),
  ]);

  const contextLabel =
    vehicle && make
      ? `${make.name} ${vehicle.short_name}`
      : make
        ? make.name
        : sp.search
          ? `“${sp.search}”`
          : sp.category
            ? categories.find((c) => c.slug === sp.category)?.name ?? "Parts"
            : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* breadcrumb / title */}
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="px-1.5">/</span>
          <span className="text-foreground">Parts</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {contextLabel ? `Parts for ${contextLabel}` : "All auto parts"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.count.toLocaleString("en-US")} parts found
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border bg-card p-5">
            <Suspense fallback={null}>
              <FilterSidebar categories={categories} brands={brands.map((b) => b.name)} />
            </Suspense>
          </div>
        </aside>

        {/* Main */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <details className="lg:hidden">
              <summary className="flex cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium">
                <SlidersHorizontal className="size-4" /> Filters
              </summary>
              <div className="mt-3 rounded-2xl border bg-card p-5">
                <Suspense fallback={null}>
                  <FilterSidebar categories={categories} brands={brands.map((b) => b.name)} />
                </Suspense>
              </div>
            </details>
            <span className="hidden text-sm text-muted-foreground lg:inline">
              Showing page {result.page} of {result.totalPages}
            </span>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>

          {result.rows.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed bg-card py-20 text-center">
              <PackageX className="size-12 text-muted-foreground/40" />
              <h2 className="mt-4 text-lg font-semibold">No parts found</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try removing some filters or searching for a different term.
              </p>
              <Link href="/products" className="mt-4 text-sm font-medium text-primary hover:underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {result.rows.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                searchParams={sp}
                basePath="/products"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
