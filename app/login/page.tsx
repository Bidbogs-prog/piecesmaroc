"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/constants";
import { ShieldCheck, Truck, Tag, Loader2 } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function LoginCard() {
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const hasError = params.get("error");
  const next = params.get("next") ?? "/";

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      alert("Sign-in is not configured. Please set the Supabase environment variables.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
      <Link href="/" className="mb-6 inline-flex items-center" aria-label="PiecesMaroc home">
        <Logo variant="light" markSize={36} />
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Access your orders and saved parts. New here? Signing in creates your account.
      </p>

      {hasError && (
        <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Sign-in failed. Please try again.
        </p>
      )}

      <Button
        onClick={signInWithGoogle}
        disabled={loading}
        variant="outline"
        size="lg"
        className="mt-6 w-full gap-3 text-base"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to {SITE.name}&apos;s Terms & Privacy Policy.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3 border-t pt-6 text-center">
        {[
          { icon: ShieldCheck, label: "Verified sellers" },
          { icon: Truck, label: "National delivery" },
          { icon: Tag, label: "Best prices" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Icon className="size-5 text-primary" />
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4 py-12">
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </div>
  );
}
