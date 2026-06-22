import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Returns null when the public env vars are missing
 * (e.g. not configured on the host) so callers can degrade gracefully instead
 * of throwing a client-side exception during render.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
