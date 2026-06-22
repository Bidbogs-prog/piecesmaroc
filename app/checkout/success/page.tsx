import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Order sent · PiecesMaroc" };

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#25D366]/10">
        <CheckCircle2 className="size-10 text-[#25D366]" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Order sent!</h1>
      <p className="mt-3 text-muted-foreground">
        Your order has been sent to our team on WhatsApp. We&apos;ll confirm availability, delivery,
        and payment shortly. If WhatsApp didn&apos;t open, please check your pop-up blocker.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/products">Continue shopping</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
