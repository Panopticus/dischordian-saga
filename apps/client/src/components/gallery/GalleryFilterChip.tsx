/* ═══════════════════════════════════════════════════════
   GALLERY FILTER CHIP — Themed filter pill

   Common "era tab" / "category chip" / "faction filter"
   primitive. Every gallery had its own variant — same shape,
   mildly different styling. Consolidated here with a single
   tone token + active state.
   ═══════════════════════════════════════════════════════ */
import type { ReactNode } from "react";

interface GalleryFilterChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  /** Optional accent color override (e.g. faction color). Defaults to neon cyan. */
  accentColor?: string;
  /** Optional leading icon or badge. */
  leading?: ReactNode;
  /** Optional trailing count badge. */
  count?: number;
  /** Pass through for A11y labelling when children is non-textual. */
  ariaLabel?: string;
}

export default function GalleryFilterChip({
  active,
  onClick,
  children,
  accentColor,
  leading,
  count,
  ariaLabel,
}: GalleryFilterChipProps) {
  const accent = accentColor ?? "var(--neon-cyan)";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider border transition-all whitespace-nowrap"
      style={{
        background: active
          ? `color-mix(in oklch, ${accent} 18%, transparent)`
          : "color-mix(in oklch, var(--bg-void) 50%, transparent)",
        borderColor: active
          ? `color-mix(in oklch, ${accent} 55%, transparent)`
          : "color-mix(in oklch, var(--border) 40%, transparent)",
        color: active ? accent : "var(--muted-foreground)",
        boxShadow: active ? `0 0 10px color-mix(in oklch, ${accent} 22%, transparent)` : "none",
      }}
    >
      {leading}
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            background: active
              ? `color-mix(in oklch, ${accent} 35%, transparent)`
              : "color-mix(in oklch, var(--border) 30%, transparent)",
            color: active ? "var(--bg-void)" : "var(--muted-foreground)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
