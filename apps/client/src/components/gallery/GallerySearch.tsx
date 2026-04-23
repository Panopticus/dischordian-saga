/* ═══════════════════════════════════════════════════════
   GALLERY SEARCH — Themed search input shared across galleries

   Eight gallery pages (Card, Planet, Suit, Imprint, Lore,
   Trophy, Achievements, CardAchievements) previously each
   rendered their own search input with slightly-different
   border colors, placeholder copy, and icon sizing. This
   primitive gives all of them one visual vocabulary with
   one seam for future a11y / theming changes.

   Keeps the input uncontrolled from the shell's perspective —
   the caller owns the state so filter logic (which varies
   wildly per gallery) stays in-page. The shell just owns
   the chrome.
   ═══════════════════════════════════════════════════════ */
import { Search, X } from "lucide-react";
import type { ChangeEvent } from "react";

interface GallerySearchProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}

export default function GallerySearch({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: GallerySearchProps) {
  return (
    <div className={`relative flex-1 min-w-0 ${className}`}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-card/30 border border-border/20 rounded-lg focus:outline-none focus:border-[var(--neon-cyan)]/50 placeholder:text-muted-foreground/40 transition-colors"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground/90 rounded transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
