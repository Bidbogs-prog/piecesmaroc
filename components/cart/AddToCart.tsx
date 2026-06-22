"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/CartProvider";
import type { CartItem } from "@/types/database";

type Item = Omit<CartItem, "quantity">;

/** Compact icon button used on product cards. */
export function AddToCartButton({ item, className }: { item: Item; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="icon"
      className={className}
      aria-label="Add to cart"
      onClick={(e) => {
        e.preventDefault();
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
    </Button>
  );
}

/** Full quantity + add panel used on the product detail page. */
export function AddToCartPanel({ item, disabled }: { item: Item; disabled?: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border">
        <button
          aria-label="Decrease"
          className="grid size-10 place-items-center text-muted-foreground hover:text-foreground"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center font-medium">{qty}</span>
        <button
          aria-label="Increase"
          className="grid size-10 place-items-center text-muted-foreground hover:text-foreground"
          onClick={() => setQty((q) => q + 1)}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button size="lg" className="flex-1 gap-2" disabled={disabled} onClick={() => add(item, qty)}>
        <ShoppingCart className="size-5" /> Add to cart
      </Button>
    </div>
  );
}
