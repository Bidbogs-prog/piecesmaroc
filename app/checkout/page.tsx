"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart/CartProvider";
import { buildWhatsAppOrderUrl, type CheckoutInfo } from "@/lib/cart/whatsapp";
import { formatPrice, CURRENCY } from "@/lib/constants";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
    </svg>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, count, clear } = useCart();
  const router = useRouter();
  const [info, setInfo] = useState<CheckoutInfo>({ name: "", phone: "", city: "", note: "" });
  const [submitting, setSubmitting] = useState(false);

  const valid = info.name.trim() && info.phone.trim() && info.city.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || items.length === 0) return;
    setSubmitting(true);
    const url = buildWhatsAppOrderUrl(items, info);
    window.open(url, "_blank", "noopener,noreferrer");
    // Give the new tab a moment, then clear and confirm.
    setTimeout(() => {
      clear();
      router.push("/checkout/success");
    }, 600);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-muted">
          <ShoppingCart className="size-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/products">Browse parts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-1 text-muted-foreground">
        Confirm your details — we&apos;ll finalize your order over WhatsApp.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Delivery details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" required value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} placeholder="Your name" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" required value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} placeholder="06 XX XX XX XX" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" required value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })} placeholder="Casablanca" className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="note">Note (optional)</Label>
              <textarea
                id="note"
                value={info.note}
                onChange={(e) => setInfo({ ...info, note: e.target.value })}
                placeholder="Vehicle details, delivery instructions…"
                rows={3}
                className="mt-1.5 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!valid || submitting}
            className="mt-6 w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5b]"
          >
            <WhatsAppIcon className="size-5" />
            {submitting ? "Opening WhatsApp…" : "Place order on WhatsApp"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            This opens WhatsApp with your order pre-filled. No payment is taken online.
          </p>
        </form>

        <aside className="h-fit rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Order ({count})</h2>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="line-clamp-2">
                  <span className="text-muted-foreground">{item.quantity}× </span>
                  {item.name}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 text-base font-bold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)} {CURRENCY}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
