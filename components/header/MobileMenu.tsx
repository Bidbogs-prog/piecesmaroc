"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import HeaderSearch from "./HeaderSearch";
import { NAV_LINKS } from "@/lib/constants";

export default function MobileMenu({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid size-10 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden"
      >
        <Menu className="size-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <HeaderSearch />
          </div>
          <nav className="flex flex-col px-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            {!signedIn && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-primary hover:bg-muted"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
            >
              My account
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
