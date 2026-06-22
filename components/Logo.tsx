import { cn } from "@/lib/utils";

// Hexagon ("bolt") clip path from the brand design — Direction A.
const HEX = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

/** The standalone hexagon mark: blue-gradient bolt + white "P" + orange spark. */
export function LogoMark({
  size = 36,
  withDot = true,
  className,
}: {
  size?: number;
  withDot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{
        width: size,
        height: size,
        clipPath: HEX,
        background: "linear-gradient(150deg, #2456ec, #1538b8)",
      }}
      aria-hidden
    >
      <span
        className="font-extrabold leading-none text-white"
        style={{ fontSize: size * 0.52 }}
      >
        P
      </span>
      {withDot && (
        <span
          className="absolute rounded-full"
          style={{
            width: Math.max(4, size * 0.12),
            height: Math.max(4, size * 0.12),
            top: size * 0.17,
            right: size * 0.21,
            background: "#ff6a1a",
          }}
        />
      )}
    </span>
  );
}

interface LogoProps {
  /** "light" = on light surfaces, "dark" = on navy surfaces */
  variant?: "light" | "dark";
  /** show the orange "Pièces auto · Maroc" tagline under the wordmark */
  showTagline?: boolean;
  /** hide the wordmark below the `sm` breakpoint (mark stays visible) */
  responsive?: boolean;
  markSize?: number;
  className?: string;
}

/** Full brand lockup: mark + two-tone "PiecesMaroc" wordmark. */
export default function Logo({
  variant = "light",
  showTagline = false,
  responsive = false,
  markSize = 36,
  className,
}: LogoProps) {
  const piecesColor = variant === "dark" ? "text-white" : "text-[#0c1b3a]";
  const marocColor = variant === "dark" ? "text-[#5b8cff]" : "text-[#1b4de0]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      <span
        className={cn("flex-col leading-none", responsive ? "hidden sm:flex" : "flex")}
      >
        <span className="text-xl font-extrabold tracking-[-0.02em]">
          <span className={piecesColor}>Pieces</span>
          <span className={marocColor}>Maroc</span>
        </span>
        {showTagline && (
          <span className="mt-1.5 font-mono text-[8px] uppercase leading-none tracking-[0.34em] text-[#ff6a1a]">
            Pièces auto · Maroc
          </span>
        )}
      </span>
    </span>
  );
}
