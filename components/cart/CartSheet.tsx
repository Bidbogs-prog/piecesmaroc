"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice, CURRENCY } from "@/lib/constants";

export default function CartSheet() {
  const { items, isOpen, setOpen, subtotal, count, setQty, remove } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Your cart {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-muted">
              <ShoppingCart className="size-7 text-muted-foreground" />
            </div>
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add parts to get started.</p>
            <Button asChild className="mt-2" onClick={() => setOpen(false)}>
              <Link href="/products">Browse parts</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-xl border bg-card p-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-xs text-muted-foreground">
                          {item.brand_name?.slice(0, 3) ?? "—"}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
                      {item.brand_name && (
                        <p className="text-xs text-muted-foreground">{item.brand_name}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border">
                          <button
                            aria-label="Decrease"
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                            onClick={() => setQty(item.id, item.quantity - 1)}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            aria-label="Increase"
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                            onClick={() => setQty(item.id, item.quantity + 1)}
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)} {CURRENCY}
                        </span>
                      </div>
                    </div>

                    <button
                      aria-label="Remove"
                      className="self-start text-muted-foreground hover:text-destructive"
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t">
              <div className="mb-2 flex items-center justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">
                  {formatPrice(subtotal)} {CURRENCY}
                </span>
              </div>
              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <Link href="/cart">View full cart</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CloseButton() {
  const { setOpen } = useCart();
  return (
    <button onClick={() => setOpen(false)} aria-label="Close">
      <X className="size-4" />
    </button>
  );
}
