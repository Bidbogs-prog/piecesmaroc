import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";
import { SITE } from "@/lib/constants";

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Parts" },
      { href: "/categories", label: "Categories" },
      { href: "/products?sort=newest", label: "New Arrivals" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help Center" },
      { href: "/contact", label: "Delivery & Returns" },
      { href: "/contact", label: "Track Order" },
    ],
  },
];

const TRUST = [
  { icon: ShieldCheck, label: "Verified sellers" },
  { icon: Truck, label: "Nationwide delivery" },
  { icon: CreditCard, label: "Pay on delivery" },
  { icon: Headphones, label: "Expert support" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy text-navy-foreground">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="size-7 text-accent" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">P</span>
            Pieces<span className="text-accent">Maroc</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            {SITE.tagline}. Genuine and aftermarket parts for every make and model.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-accent" /> 0{SITE.whatsapp.slice(3)}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-accent" /> contact@piecesmaroc.ma
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" /> Casablanca, Morocco
            </li>
          </ul>
        </div>

        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/60 transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Built for Morocco&apos;s drivers 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
