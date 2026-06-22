import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Heart } from "lucide-react";

export const metadata = { title: "My Account · PiecesMaroc" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email ||
    "there";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={64}
            height={64}
            className="size-16 rounded-full"
          />
        ) : (
          <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">{name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form action={signOut} className="ml-auto">
          <Button variant="outline" className="gap-2">
            <LogOut className="size-4" /> Sign out
          </Button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <Package className="size-6 text-primary" />
          <h2 className="mt-3 font-semibold">My orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders placed via WhatsApp appear in your chat history with our team.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <Heart className="size-6 text-accent" />
          <h2 className="mt-3 font-semibold">Saved parts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add parts to your cart and check out anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
