import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Cog, Check, X, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartPanel } from "@/components/cart/AddToCart";
import ProductCard from "@/components/ProductCard";
import { getProductById, getRelatedProducts } from "@/lib/db/products";
import { buildWhatsAppEnquiryUrl } from "@/lib/cart/whatsapp";
import { formatPrice, CURRENCY, CONDITION_LABEL } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id).catch(() => null);
  if (!product) return { title: "Part not found" };
  return {
    title: `${product.name}${product.brand_name ? ` — ${product.brand_name}` : ""}`,
    description: `${product.name} ${product.article_number ?? ""}. Buy online and get it delivered across Morocco.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id).catch(() => null);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4).catch(() => []);
  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground">Parts</Link>
        {product.category && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-8" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/40">
              <Cog className="size-24" />
              <span className="font-medium">{product.brand_name ?? "No image"}</span>
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground hover:bg-accent">
              Save {formatPrice(product.original_price! - product.price)} {CURRENCY}
            </Badge>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3">
            {product.brand_logo_url ? (
              <Image src={product.brand_logo_url} alt={product.brand_name ?? ""} width={80} height={28} className="max-h-7 w-auto object-contain" />
            ) : product.brand_name ? (
              <span className="text-sm font-semibold text-muted-foreground">{product.brand_name}</span>
            ) : null}
            <Badge variant="secondary">{CONDITION_LABEL[product.condition] ?? product.condition}</Badge>
          </div>

          <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
          {product.extra_name && <p className="mt-1 text-muted-foreground">{product.extra_name}</p>}
          {product.article_number && (
            <p className="mt-2 font-mono text-sm text-muted-foreground">Ref: {product.article_number}</p>
          )}

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-extrabold">{formatPrice(product.price)} {CURRENCY}</span>
            {hasDiscount && (
              <span className="pb-1 text-lg text-muted-foreground line-through">
                {formatPrice(product.original_price!)} {CURRENCY}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            {product.in_stock ? (
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <Check className="size-4" /> In stock
              </span>
            ) : (
              <span className="flex items-center gap-1 font-medium text-muted-foreground">
                <X className="size-4" /> Out of stock — enquire on WhatsApp
              </span>
            )}
          </div>

          <div className="mt-6">
            <AddToCartPanel
              item={{
                id: product.id,
                name: product.name,
                brand_name: product.brand_name,
                article_number: product.article_number,
                image_url: product.image_url,
                price: product.price,
              }}
            />
            <Button asChild variant="outline" size="lg" className="mt-3 w-full gap-2">
              <a href={buildWhatsAppEnquiryUrl(product.name, product.article_number)} target="_blank" rel="noopener noreferrer">
                Ask about this part on WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl border bg-card p-3">
              <Truck className="size-5 text-primary" />
              <span>Delivery across Morocco</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-card p-3">
              <ShieldCheck className="size-5 text-primary" />
              <span>Pay on delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specs */}
      {(product.details?.length > 0 || product.linkages?.length > 0) && (
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {product.details?.length > 0 && (
            <SpecTable title="Specifications" rows={product.details} />
          )}
          {product.linkages?.length > 0 && (
            <SpecTable title="Compatibility & fitment" rows={product.linkages} />
          )}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-xl font-bold">Related parts</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SpecTable({
  title,
  rows,
}: {
  title: string;
  rows: { id: number; name: string; shortName: string | null; value: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <h3 className="border-b bg-muted/50 px-5 py-3 font-semibold">{title}</h3>
      <dl className="divide-y">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-2 gap-4 px-5 py-3 text-sm">
            <dt className="text-muted-foreground">{r.name}</dt>
            <dd className="font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export const dynamic = "force-dynamic";
