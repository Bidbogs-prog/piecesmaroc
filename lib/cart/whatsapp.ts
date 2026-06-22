import { SITE, formatPrice, CURRENCY } from "@/lib/constants";
import type { CartItem } from "@/types/database";

export interface CheckoutInfo {
  name: string;
  phone: string;
  city: string;
  note?: string;
}

/** Build a wa.me URL with a formatted order message. */
export function buildWhatsAppOrderUrl(items: CartItem[], info: CheckoutInfo): string {
  const lines: string[] = [];
  lines.push(`*New order — ${SITE.name}*`);
  lines.push("");
  lines.push("*Items:*");

  let subtotal = 0;
  items.forEach((i, idx) => {
    const lineTotal = i.price * i.quantity;
    subtotal += lineTotal;
    lines.push(
      `${idx + 1}. ${i.name}${i.brand_name ? ` (${i.brand_name})` : ""}` +
        `${i.article_number ? ` [${i.article_number}]` : ""}`
    );
    lines.push(`   ${i.quantity} × ${formatPrice(i.price)} = ${formatPrice(lineTotal)} ${CURRENCY}`);
  });

  lines.push("");
  lines.push(`*Subtotal: ${formatPrice(subtotal)} ${CURRENCY}*`);
  lines.push("");
  lines.push("*Customer:*");
  lines.push(`Name: ${info.name}`);
  lines.push(`Phone: ${info.phone}`);
  lines.push(`City: ${info.city}`);
  if (info.note) lines.push(`Note: ${info.note}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SITE.whatsapp}?text=${text}`;
}

/** Quick single-product enquiry link (used on product detail). */
export function buildWhatsAppEnquiryUrl(name: string, articleNumber?: string | null): string {
  const text = encodeURIComponent(
    `Hi, I'm interested in: ${name}${articleNumber ? ` (ref ${articleNumber})` : ""}. Is it available?`
  );
  return `https://wa.me/${SITE.whatsapp}?text=${text}`;
}
