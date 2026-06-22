"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeaderSearch({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/products?search=${encodeURIComponent(q.trim())}` : "/products");
      }}
      className={`flex items-center overflow-hidden rounded-xl bg-white shadow-sm ${className}`}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search parts, brands, part numbers…"
        className="h-11 w-full bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid h-11 w-12 shrink-0 place-items-center bg-accent text-accent-foreground transition hover:bg-accent/90"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
}
