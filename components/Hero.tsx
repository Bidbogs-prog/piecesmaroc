import Link from "next/link";
import { Car, Sparkles } from "lucide-react";
import VehicleSelector from "@/components/VehicleSelector";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80">
            <Sparkles className="size-4 text-accent" />
            9,000+ parts · 65 makes · delivered nationwide
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            The right part for <span className="text-accent">your car</span>,
            <br className="hidden sm:block" /> at the right price.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Morocco&apos;s marketplace for quality auto parts. Find exactly what fits your vehicle by
            make, model and engine.
          </p>
        </div>

        {/* Vehicle selector card */}
        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Car className="size-5 text-accent" />
            Find parts for your vehicle
          </div>
          <VehicleSelector variant="dark" />
        </div>

        <p className="mt-5 text-center text-sm text-white/60">
          Or{" "}
          <Link href="/products" className="font-medium text-accent underline-offset-2 hover:underline">
            browse the full catalog
          </Link>
        </p>
      </div>
    </section>
  );
}
