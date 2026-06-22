import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/lib/constants";
import HeaderSearch from "@/components/header/HeaderSearch";
import UserMenu, { type UserMenuProps } from "@/components/header/UserMenu";
import MobileMenu from "@/components/header/MobileMenu";
import CartButton from "@/components/cart/CartButton";

async function getUser(): Promise<UserMenuProps["user"]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      name:
        (user.user_metadata?.full_name as string) ||
        (user.user_metadata?.name as string) ||
        user.email ||
        "Account",
      email: user.email ?? "",
      avatar: user.user_metadata?.avatar_url as string | undefined,
    };
  } catch {
    return null; // Supabase not configured yet
  }
}

export default async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-navy text-navy-foreground">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <MobileMenu signedIn={!!user} />

          <Link href="/" className="flex shrink-0 items-center" aria-label="PiecesMaroc home">
            <Logo variant="dark" responsive markSize={38} />
          </Link>

          <div className="hidden flex-1 md:block">
            <HeaderSearch className="max-w-xl" />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <UserMenu user={user} />
            <CartButton dark />
          </div>
        </div>

        {/* Mobile search row */}
        <div className="container mx-auto px-4 pb-3 md:hidden">
          <HeaderSearch />
        </div>
      </div>

      {/* Secondary nav */}
      <div className="border-b bg-card">
        <div className="container mx-auto flex h-12 items-center gap-1 px-4">
          <Link
            href="/categories"
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
          >
            <LayoutGrid className="size-4" />
            All Categories
          </Link>
          <nav className="ml-2 hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="ml-auto hidden text-sm text-muted-foreground md:inline">
            Delivery across Morocco · Pay on delivery
          </span>
        </div>
      </div>
    </header>
  );
}
