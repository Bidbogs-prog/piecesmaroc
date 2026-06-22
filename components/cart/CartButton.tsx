"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/CartProvider";

export default function CartButton({ dark = false }: { dark?: boolean }) {
  const { count, setOpen } = useCart();

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open cart"
      className={`relative grid size-10 place-items-center rounded-lg transition ${
        dark ? "text-white hover:bg-white/10" : "hover:bg-muted"
      }`}
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-5 text-accent-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
