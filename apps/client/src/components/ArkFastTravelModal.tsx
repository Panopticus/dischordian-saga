/* ═══════════════════════════════════════════════════════
   ARK FAST-TRAVEL MODAL — Cmd/Ctrl+K searchable room jump

   FastTravelPanel already ships as a pinned side panel once
   the nav-console puzzle is solved, but with 26 rooms it
   turns into a scroll-hunt on mobile. This modal is the
   keyboard-first counterpart: a single search box, fuzzy
   filter over the unlocked rooms, grouped by deck, with
   arrow-key navigation and Enter-to-travel.

   Designed to feel identical to SettingsSearchModal (pass 2)
   so the Cmd/Ctrl+K vocabulary is consistent across the
   app: same spring-in, same keyboard loop, same tone.

   Only visible / functional when fastTravelUnlocked is true;
   the owning page is responsible for gating the keybind
   behind that flag before passing open={true} here.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CornerDownLeft, MapPin } from "lucide-react";
import type { RoomDef } from "@/contexts/GameContext";

interface ArkFastTravelModalProps {
  open: boolean;
  onClose: () => void;
  /** Rooms the player can actually travel to right now. */
  rooms: RoomDef[];
  /** The current room — highlighted with a "HERE" pill and excluded from jumps. */
  currentRoomId: string | null;
  /** Called with the target roomId when the player commits a jump. */
  onTravel: (roomId: string) => void;
}

export default function ArkFastTravelModal({
  open,
  onClose,
  rooms,
  currentRoomId,
  onTravel,
}: ArkFastTravelModalProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  // Matches against { name, deckName, description } so a player who
  // searches "medical" hits Medical Bay, and "library" hits the
  // antiquarian's reading room even when its proper name doesn't
  // contain that word.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const eligible = rooms.filter((r) => r.id !== currentRoomId);
    if (!q) return eligible;
    return eligible.filter((r) => {
      if (r.name.toLowerCase().includes(q)) return true;
      if (r.deckName.toLowerCase().includes(q)) return true;
      if (r.description.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [query, rooms, currentRoomId]);

  // Group by deck for the unfiltered view. When the player is
  // searching we flatten — the deck structure is a browse affordance,
  // not a filter axis, so forcing it during search would hide results
  // that happen to span multiple decks.
  const grouped = useMemo(() => {
    if (query.trim()) return [{ deck: 0, deckName: "RESULTS", rooms: filtered }];
    const byDeck = new Map<number, { deckName: string; rooms: RoomDef[] }>();
    for (const r of filtered) {
      const entry = byDeck.get(r.deck) ?? { deckName: r.deckName, rooms: [] };
      entry.rooms.push(r);
      byDeck.set(r.deck, entry);
    }
    return Array.from(byDeck.entries())
      .sort(([a], [b]) => a - b)
      .map(([deck, v]) => ({ deck, ...v }));
  }, [filtered, query]);

  // Flattened index for keyboard nav — mirrors the visual order of
  // `grouped` so ↓/↑ walks sections transparently.
  const flat = useMemo(
    () => grouped.flatMap((g) => g.rooms),
    [grouped],
  );

  useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(Math.max(0, flat.length - 1));
  }, [flat.length, activeIndex]);

  const commit = (room: RoomDef) => {
    onClose();
    onTravel(room.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const room = flat[activeIndex];
      if (room) commit(room);
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
            aria-label="Fast travel"
            aria-modal
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/20">
              <Search size={14} className="text-[var(--neon-cyan)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to a room…"
                className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground/40"
              />
              <button
                onClick={onClose}
                aria-label="Close fast travel"
                className="p-1 rounded text-muted-foreground/50 hover:text-muted-foreground/90"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {flat.length === 0 ? (
                <p className="px-4 py-8 text-center font-mono text-xs text-muted-foreground/60">
                  No rooms match "{query}".
                </p>
              ) : (
                grouped.map((group) => (
                  <div key={group.deck}>
                    <p className="sticky top-0 px-4 py-1.5 font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground/50 bg-[color:color-mix(in_oklch,var(--bg-void)_94%,transparent)] backdrop-blur-sm border-b border-border/10">
                      {group.deckName}
                    </p>
                    <ul role="listbox">
                      {group.rooms.map((room) => {
                        const flatIdx = flat.indexOf(room);
                        const isActive = flatIdx === activeIndex;
                        return (
                          <li key={room.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                              onClick={() => commit(room)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors"
                              style={{
                                background: isActive
                                  ? "color-mix(in oklch, var(--energy-primary) 12%, transparent)"
                                  : "transparent",
                              }}
                            >
                              <MapPin
                                size={12}
                                className="shrink-0"
                                style={{
                                  color: isActive
                                    ? "var(--neon-cyan)"
                                    : "color-mix(in oklch, var(--muted-foreground) 50%, transparent)",
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-mono text-sm text-foreground truncate">
                                  {room.name}
                                </p>
                                <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider truncate">
                                  {room.description}
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
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-border/20 flex items-center justify-between font-mono text-[9px] text-muted-foreground/40 tracking-wider">
              <span>↑↓ NAVIGATE · ENTER JUMP · ESC CLOSE</span>
              <span>{flat.length} ROOM{flat.length === 1 ? "" : "S"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
