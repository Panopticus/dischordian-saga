/* ═══════════════════════════════════════════════════════
   SETTINGS SEARCH MODAL — Cmd/Ctrl+K flat label index.

   Why not section-level search?
     The existing SettingsSection renders its body inside a
     `{open && <div>...}` guard, so filtering individual rows
     inside a closed section would require lifting the filter
     above the open gate — a larger refactor that touches
     every SettingsSection call site.

   What this does instead:
     A fullscreen modal with a single search input. The query
     matches against a hand-maintained flat index of label +
     keyword + target section. On Enter / click, we scroll the
     matching section into view and flash its container so the
     player's eye tracks to the result.

   Tradeoffs:
     - Index is maintained by hand. When a new setting is added
       to SettingsPage, the maintainer adds a row here. That's
       ~30 seconds; the alternative (DOM-driven auto-extract via
       data attributes) would require retrofitting every Toggle /
       VolumeSlider / OptionSelector to pass through the label.
       Not worth the surface area for this pass.
     - We don't filter individual settings inside sections; we
       locate them. Good enough for 24 settings. If the count
       doubles, revisit.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CornerDownLeft } from "lucide-react";

/** A single searchable entry. `anchor` is the DOM id of the target. */
interface SettingIndexEntry {
  label: string;
  /** Extra keywords that should match but aren't visible in the UI row. */
  keywords?: string[];
  /** SettingsSection this entry lives in — shown as breadcrumb. */
  section: string;
  /** DOM id of the section container — for scroll-to. */
  anchor: string;
}

/**
 * Hand-maintained index. When adding a new setting to SettingsPage,
 * append a row here with the matching anchor id on the section wrapper.
 * Keep labels in UI-casing so the preview reads naturally.
 */
const SETTING_INDEX: SettingIndexEntry[] = [
  // Appearance
  { label: "Theme", section: "Appearance", anchor: "settings-appearance", keywords: ["dark", "light", "mode"] },
  { label: "Ark Theme", section: "Appearance", anchor: "settings-appearance", keywords: ["atmosphere", "color", "palette"] },
  { label: "Font Size", section: "Appearance", anchor: "settings-appearance", keywords: ["text", "zoom"] },
  { label: "Density", section: "Appearance", anchor: "settings-appearance", keywords: ["compact", "spacing"] },
  // Audio
  { label: "Mute All Sounds", section: "Audio", anchor: "settings-audio", keywords: ["silence", "quiet"] },
  { label: "Master Volume", section: "Audio", anchor: "settings-audio", keywords: ["loudness"] },
  { label: "Music Volume", section: "Audio", anchor: "settings-audio", keywords: ["soundtrack", "bgm"] },
  { label: "SFX Volume", section: "Audio", anchor: "settings-audio", keywords: ["effects", "sounds"] },
  { label: "Ambient Sounds", section: "Audio", anchor: "settings-audio", keywords: ["ship hum", "room atmosphere"] },
  // Accessibility
  { label: "High Contrast", section: "Accessibility", anchor: "settings-accessibility", keywords: ["readable", "vision"] },
  { label: "Reduce Motion", section: "Accessibility", anchor: "settings-accessibility", keywords: ["animations", "parallax"] },
  { label: "Motion Intensity", section: "Accessibility", anchor: "settings-accessibility", keywords: ["parallax", "drift", "audio-reactive"] },
  { label: "Audio-Reactive UI", section: "Accessibility", anchor: "settings-accessibility", keywords: ["logo pulse", "vitals", "music-driven"] },
  { label: "Captions", section: "Accessibility", anchor: "settings-accessibility", keywords: ["subtitles", "speaker label", "hearing"] },
  { label: "Typewriter Speed", section: "Accessibility", anchor: "settings-accessibility", keywords: ["dialog speed", "text reveal", "instant"] },
  { label: "Dyslexia-Friendly Font", section: "Accessibility", anchor: "settings-accessibility", keywords: ["opendyslexic", "reading"] },
  { label: "Reduce Glow Effects", section: "Accessibility", anchor: "settings-accessibility", keywords: ["neon", "brightness"] },
  // Game Preferences
  { label: "Skip Tutorials", section: "Game Preferences", anchor: "settings-game", keywords: ["onboarding"] },
  { label: "Show Hints", section: "Game Preferences", anchor: "settings-game", keywords: ["tips", "elara"] },
  { label: "Show Room Markers", section: "Game Preferences", anchor: "settings-game", keywords: ["hotspots", "indicators"] },
  { label: "Difficulty", section: "Game Preferences", anchor: "settings-game", keywords: ["casual", "standard", "hardcore"] },
  // Account / Promo / Community handled as section-level hits
  { label: "Account", section: "Account", anchor: "settings-account", keywords: ["sign out", "delete", "email"] },
  { label: "Promo Codes", section: "Promo Codes", anchor: "settings-promo", keywords: ["redeem"] },
  { label: "Community", section: "Community", anchor: "settings-community", keywords: ["discord", "social", "links"] },
];

interface SettingsSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsSearchModal({ open, onClose }: SettingsSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open — opening fresh always starts with an empty query and
  // the first result highlighted.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Defer focus until after the motion mount or autofocus races framer.
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SETTING_INDEX;
    return SETTING_INDEX.filter((entry) => {
      if (entry.label.toLowerCase().includes(q)) return true;
      if (entry.section.toLowerCase().includes(q)) return true;
      return entry.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
    });
  }, [query]);

  // Clamp activeIndex when results shrink so we don't point past the end.
  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(Math.max(0, results.length - 1));
  }, [results.length, activeIndex]);

  const commit = (entry: SettingIndexEntry) => {
    onClose();
    // Defer scroll until after the modal unmounts; scrolling while
    // the full-screen overlay is still fading would jump the page
    // under the user's cursor.
    requestAnimationFrame(() => {
      // Ask the matching SettingsSection to expand itself if collapsed.
      window.dispatchEvent(
        new CustomEvent<string>("settings-section-focus", { detail: entry.anchor }),
      );
      const el = document.getElementById(entry.anchor);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("settings-search-flash");
      setTimeout(() => el.classList.remove("settings-search-flash"), 1800);
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[activeIndex];
      if (entry) commit(entry);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[9998] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-xl rounded-xl border backdrop-blur-md shadow-2xl overflow-hidden"
            style={{
              background: "color-mix(in oklch, var(--bg-void) 94%, transparent)",
              borderColor: "color-mix(in oklch, var(--energy-primary) 25%, transparent)",
              boxShadow: "0 0 60px color-mix(in oklch, var(--energy-primary) 15%, transparent)",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Search settings"
            aria-modal
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/20">
              <Search size={14} className="text-[var(--neon-cyan)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search settings…"
                className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground/40"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="p-1 rounded text-muted-foreground/50 hover:text-muted-foreground/90"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <p className="px-4 py-8 text-center font-mono text-xs text-muted-foreground/60">
                  No settings match "{query}".
                </p>
              ) : (
                <ul role="listbox">
                  {results.map((entry, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <li key={`${entry.anchor}-${entry.label}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => commit(entry)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-2 text-left transition-colors"
                          style={{
                            background: isActive
                              ? "color-mix(in oklch, var(--energy-primary) 12%, transparent)"
                              : "transparent",
                          }}
                        >
                          <div className="min-w-0">
                            <p className="font-mono text-sm text-foreground truncate">{entry.label}</p>
                            <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider">
                              {entry.section.toUpperCase()}
                            </p>
                          </div>
                          {isActive && (
                            <CornerDownLeft size={12} className="text-[var(--neon-cyan)] shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="px-4 py-2 border-t border-border/20 flex items-center justify-between font-mono text-[9px] text-muted-foreground/40 tracking-wider">
              <span>↑↓ NAVIGATE · ENTER OPEN · ESC CLOSE</span>
              <span>{results.length} RESULT{results.length === 1 ? "" : "S"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
