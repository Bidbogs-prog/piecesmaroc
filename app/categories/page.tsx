import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Search } from "lucide-react";
import { getCategoryTree } from "@/lib/db/catalog";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const tree = await getCategoryTree().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">Categories</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Browse by category</h1>
      <p className="mt-1 text-muted-foreground">
        {tree.length} categories covering every system of your vehicle.
      </p>

      {tree.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No categories yet — run the migration to populate the catalog.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tree.map((cat) => (
            <div key={cat.id} className="rounded-2xl border bg-card p-5">
              <Link href={`/products?category=${cat.slug}`} className="group flex items-center gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-muted">
                  {cat.image_url ? (
                    <Image src={cat.image_url} alt="" width={28} height={28} className="size-7 object-contain" />
                  ) : (
                    <Search className="size-5 text-muted-foreground" />
                  )}
                </div>
                <h2 className="flex-1 font-semibold group-hover:text-primary">{cat.name}</h2>
                <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              {cat.subcategories && cat.subcategories.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1 border-t pt-4 text-sm">
                  {cat.subcategories.slice(0, 6).map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/products?category=${sub.slug}`}
                        className="block truncate rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                  {cat.subcategories.length > 6 && (
                    <li>
                      <Link href={`/products?category=${cat.slug}`} className="block px-2 py-1 text-xs font-medium text-primary hover:underline">
                        + {cat.subcategories.length - 6} more
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
