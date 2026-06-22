import Link from "next/link";
import Image from "next/image";
import { Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/AddToCart";
import { formatPrice, CURRENCY } from "@/lib/constants";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discount = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-white">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <Cog className="size-14" />
            <span className="text-xs font-medium">{product.brand_name ?? "Part"}</span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">-{discount}%</Badge>
          )}
          {!product.in_stock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Out of stock
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand_name && (
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {product.brand_name}
          </div>
        )}
        <Link href={`/products/${product.id}`} className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        {product.article_number && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">{product.article_number}</p>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              <span className="text-xs text-muted-foreground">{CURRENCY}</span>
            </div>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.original_price!)} {CURRENCY}
              </span>
            )}
          </div>
          <AddToCartButton
            item={{
              id: product.id,
              name: product.name,
              brand_name: product.brand_name,
              article_number: product.article_number,
              image_url: product.image_url,
              price: product.price,
            }}
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
