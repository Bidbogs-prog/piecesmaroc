import Link from "next/link";
import { Search, ShieldCheck, Car, Truck, Tag, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "About Us" };

const FEATURES = [
  { icon: Search, title: "Smart fitment search", desc: "Find parts by make, model, engine and year — no guesswork." },
  { icon: ShieldCheck, title: "Verified quality", desc: "Genuine and trusted aftermarket brands like Bosch, Valeo and more." },
  { icon: Car, title: "32,000+ vehicles", desc: "Full catalog coverage for cars sold across Morocco." },
  { icon: Truck, title: "Nationwide delivery", desc: "Fast delivery to every city, with pay-on-delivery options." },
  { icon: Tag, title: "Fair prices", desc: "Transparent pricing in MAD with regular deals and discounts." },
  { icon: Headphones, title: "Expert support", desc: "Our team helps you confirm the right part before you buy." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-navy text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">About PiecesMaroc</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            We connect drivers and mechanics across Morocco with the right auto parts — quickly,
            affordably, and with confidence.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-14">
        <section className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Our mission</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Finding the right car part in Morocco has long meant phone calls, guesswork and trips
            across town. PiecesMaroc brings the whole catalog online — searchable by your exact
            vehicle — so you can find what fits, see a fair price, and order in minutes.
          </p>
        </section>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border bg-card p-6">
              <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold">Find your part today</h2>
          <p className="mx-auto mt-2 max-w-md text-primary-foreground/80">
            Search 9,000+ parts for 65 makes and get them delivered nationwide.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/products">Browse parts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
