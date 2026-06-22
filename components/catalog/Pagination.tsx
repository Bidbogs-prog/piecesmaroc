import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  /** existing search params (without page) */
  searchParams: Record<string, string | undefined>;
  basePath: string;
}

function href(basePath: string, sp: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v && k !== "page") params.set(k, v);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({ page, totalPages, searchParams, basePath }: Props) {
  if (totalPages <= 1) return null;

  // window of page numbers around current
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  const linkCls =
    "grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm font-medium transition";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={href(basePath, searchParams, page - 1)} className={`${linkCls} hover:bg-muted`} aria-label="Previous">
          <ChevronLeft className="size-4" />
        </Link>
      )}
      {start > 1 && (
        <>
          <Link href={href(basePath, searchParams, 1)} className={`${linkCls} hover:bg-muted`}>1</Link>
          <span className="px-1 text-muted-foreground">…</span>
        </>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(basePath, searchParams, p)}
          className={`${linkCls} ${p === page ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          {p}
        </Link>
      ))}
      {end < totalPages && (
        <>
          <span className="px-1 text-muted-foreground">…</span>
          <Link href={href(basePath, searchParams, totalPages)} className={`${linkCls} hover:bg-muted`}>
            {totalPages}
          </Link>
        </>
      )}
      {page < totalPages && (
        <Link href={href(basePath, searchParams, page + 1)} className={`${linkCls} hover:bg-muted`} aria-label="Next">
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
