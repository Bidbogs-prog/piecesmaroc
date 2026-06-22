export const SITE = {
  name: "PiecesMaroc",
  tagline: "Morocco's marketplace for quality auto parts",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212660639304",
};

export const CURRENCY = "MAD";

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export const CONDITION_LABEL: Record<string, string> = {
  aftermarket: "Aftermarket",
  refurbished: "Refurbished",
  used: "Used",
};

export const NAV_LINKS = [
  { href: "/products", label: "All Parts" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
