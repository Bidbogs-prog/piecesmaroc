"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/database";

interface Props {
  categories: Pick<Category, "id" | "name" | "slug">[];
  brands: string[];
}

export default function FilterSidebar({ categories, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [priceMin, setPriceMin] = useState(params.get("min") ?? "");
  const [priceMax, setPriceMax] = useState(params.get("max") ?? "");

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    }
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  }

  const activeCategory = params.get("category") ?? "";
  const activeBrand = params.get("brand") ?? "";
  const inStock = params.get("instock") === "1";

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <ul className="flex flex-col gap-0.5 text-sm">
          <li>
            <button
              onClick={() => update({ category: null })}
              className={`block w-full rounded-md px-2 py-1.5 text-left hover:bg-muted ${
                !activeCategory ? "font-semibold text-primary" : "text-muted-foreground"
              }`}
            >
              All categories
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => update({ category: c.slug })}
                className={`block w-full truncate rounded-md px-2 py-1.5 text-left hover:bg-muted ${
                  activeCategory === c.slug ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold">Brand</h3>
        <Select value={activeBrand || "all"} onValueChange={(v) => update({ brand: v === "all" ? null : v })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold">Price (MAD)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => update({ min: priceMin || null, max: priceMax || null })}
        >
          Apply price
        </Button>
      </section>

      <section>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => update({ instock: e.target.checked ? "1" : null })}
            className="size-4 rounded border-input accent-[var(--color-primary)]"
          />
          In stock only
        </label>
      </section>

      <Button variant="ghost" size="sm" onClick={() => router.push(pathname)} className="justify-start text-muted-foreground">
        Clear all filters
      </Button>
    </div>
  );
}
