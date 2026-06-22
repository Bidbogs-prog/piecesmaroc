import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello PiecesMaroc, I have a question.")}`;
  const phoneDisplay = `0${SITE.whatsapp.slice(3)}`;

  const methods = [
    { icon: Mail, title: "Email", value: "contact@piecesmaroc.ma", href: "mailto:contact@piecesmaroc.ma" },
    { icon: Phone, title: "Phone", value: phoneDisplay, href: `tel:+${SITE.whatsapp}` },
    { icon: MapPin, title: "Location", value: "Casablanca, Morocco" },
  ];

  return (
    <div>
      <div className="bg-navy text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Contact us</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Questions about a part, an order, or delivery? We&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {methods.map(({ icon: Icon, title, value, href }) => {
            const inner = (
              <>
                <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{value}</p>
              </>
            );
            return href ? (
              <a key={title} href={href} className="rounded-2xl border bg-card p-6 transition hover:border-primary/40 hover:shadow-sm">
                {inner}
              </a>
            ) : (
              <div key={title} className="rounded-2xl border bg-card p-6">{inner}</div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border bg-card p-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#25D366]/10">
            <MessageCircle className="size-8 text-[#25D366]" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Chat with us on WhatsApp</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            The fastest way to reach us. Send a message and our team will reply quickly during
            business hours.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="size-5" /> Start a chat
          </a>
        </div>
      </div>
    </div>
  );
}
