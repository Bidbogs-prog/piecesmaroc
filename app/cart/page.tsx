"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice, CURRENCY } from "@/lib/constants";

export default function CartPage() {
  const { items, subtotal, count, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-muted">
          <ShoppingCart className="size-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our catalog and add the parts you need.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/products">Browse all parts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Cart <span className="text-muted-foreground">({count})</span>
        </h1>
        <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-2xl border bg-card p-4">
              <Link
                href={`/products/${item.id}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill sizes="96px" className="object-contain p-2" />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted-foreground">
                    {item.brand_name?.slice(0, 4) ?? "—"}
                  </div>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/products/${item.id}`} className="line-clamp-2 font-medium hover:text-primary">
                  {item.name}
                </Link>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                  {item.brand_name && <span>{item.brand_name}</span>}
                  {item.article_number && <span className="font-mono">{item.article_number}</span>}
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border">
                    <button className="grid size-8 place-items-center text-muted-foreground hover:text-foreground" onClick={() => setQty(item.id, item.quantity - 1)} aria-label="Decrease">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                    <button className="grid size-8 place-items-center text-muted-foreground hover:text-foreground" onClick={() => setQty(item.id, item.quantity + 1)} aria-label="Increase">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)} {CURRENCY}
                    </span>
                    <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal ({count} items)</dt>
              <dd className="font-medium">{formatPrice(subtotal)} {CURRENCY}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-muted-foreground">Calculated at checkout</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(subtotal)} {CURRENCY}</span>
          </div>
          <Button asChild size="lg" className="mt-6 w-full gap-2">
            <Link href="/checkout">
              Checkout <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
