/* ═══════════════════════════════════════════════════════
   PERSONAL QUARTERS PAGE — Visual decoratable hideout.

   Consolidation of the former Personal Quarters + Player
   Cabin pages. Renders each room zone as a lit 2D scene
   with interactive slot hotspots (ZONE_SLOT_MAPS), a
   lighting preset picker, a music-box track picker, and
   visiting-companion avatars pinned at configured positions.

   All state is server-persisted via trpc.personalQuarters.*.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Home, Trash2, Eye, Lock,
  Sparkles, Package, Palette, Sofa,
  Lamp, Frame, Music, Flower2, X, Check,
  Shield, Trees, Vault,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ZONE_ICONS: Record<string, React.ComponentType<any>> = {
  main: Home,
  bedroom: Sofa,
  study: Lamp,
  armory: Shield,
  garden: Trees,
  vault: Vault,
};

type Tab = "decorate" | "catalog" | "visit";

export default function PersonalQuartersPage() {
  const [tab, setTab] = useState<Tab>("decorate");
  const [selectedZone, setSelectedZone] = useState<string>("main");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [visitUserId, setVisitUserId] = useState<string>("");

  const { data: quarters, isLoading, refetch } = trpc.personalQuarters.getMyQuarters.useQuery();
  const { data: visitData } = trpc.personalQuarters.visitQuarters.useQuery(
    { ownerId: Number(visitUserId) },
    { enabled: tab === "visit" && !!visitUserId && !isNaN(Number(visitUserId)) }
  );

  const placeMut = trpc.personalQuarters.placeItem.useMutation({
    onSuccess: () => { toast.success("Decoration placed!"); refetch(); setSelectedSlot(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const removeMut = trpc.personalQuarters.removeItem.useMutation({
    onSuccess: () => { toast.success("Decoration removed!"); refetch(); setSelectedSlot(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const setLightingMut = trpc.personalQuarters.setLighting.useMutation({
    onSuccess: () => { refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const setMusicMut = trpc.personalQuarters.setMusicTrack.useMutation({
    onSuccess: () => { refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const quartersData = (quarters as any)?.quarters;
  const availableItems: any[] = (quarters as any)?.availableItems ?? [];
  const slotMaps: Record<string, any[]> = (quarters as any)?.slotMaps ?? {};
  const lighting = (quarters as any)?.lighting;
  const music = (quarters as any)?.music;
  const visitingCompanions: any[] = (quarters as any)?.visitingCompanions ?? [];
  const zones: any[] = (quarters as any)?.zones ?? [];

  const placedItems: any[] = (quartersData?.placedItems as any[]) ?? [];
  const unlockedZones: string[] = (quartersData?.unlockedZones as string[]) ?? ["main"];

  // Map of slotId -> item definition (for the currently selected zone).
  const slotToItem = useMemo(() => {
    const map = new Map<string, any>();
    for (const placed of placedItems) {
      if (placed.zone !== selectedZone || !placed.slotId) continue;
      const def = availableItems.find((i) => i.key === placed.itemKey);
      if (def) map.set(placed.slotId, def);
    }
    return map;
  }, [placedItems, selectedZone, availableItems]);

  // Slot map for the currently selected zone.
  const slots: any[] = slotMaps[selectedZone] ?? [];

  // Resolve the active lighting preset's background gradient.
  const activeLightingBg = useMemo(() => {
    if (!lighting) return undefined;
    const preset = (lighting.all as any[]).find((p) => p.id === lighting.active)
                ?? (lighting.all as any[])[0];
    return preset?.background;
  }, [lighting]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quartersData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Home size={48} className="mx-auto text-primary/30 mb-4" />
          <h2 className="font-display text-lg font-bold tracking-wide mb-2">PERSONAL QUARTERS</h2>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Your personal hideout is being set up...
          </p>
        </div>
      </div>
    );
  }

  /* ─── Handlers ─── */
  const handlePlace = (slotId: string, itemKey: string) => {
    placeMut.mutate({ itemKey, zone: selectedZone, x: 0, y: 0, slotId });
  };
  const handleClearSlot = (slotId: string) => {
    removeMut.mutate({ zone: selectedZone, slotId });
  };
  const handleSetLighting = (presetId: string) => {
    setLightingMut.mutate({ presetId });
  };
  const handleSetMusic = (trackId: string) => {
    setMusicMut.mutate({ trackId });
  };

  /* ─── Slot picker ─── */
  const activeSlot = selectedSlot ? slots.find((s) => s.id === selectedSlot) : null;
  const pickerItems = activeSlot
    ? availableItems.filter((item) => activeSlot.accepts.includes(item.category))
    : [];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Home size={18} className="text-primary" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">PERSONAL QUARTERS</h1>
          <span className="ml-auto font-mono text-[10px] text-accent">
            {placedItems.length} items // {(quarters as any)?.stats?.unlockedItems ?? 0} unlocked
          </span>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["decorate", "catalog", "visit"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedSlot(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "decorate" && (
          <>
            {/* Zone Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {zones.map((zone: any) => {
                const Icon = ZONE_ICONS[zone.zone] || Home;
                const count = placedItems.filter((d: any) => d.zone === zone.zone).length;
                const locked = !unlockedZones.includes(zone.zone);
                return (
                  <button
                    key={zone.zone}
                    onClick={() => !locked && setSelectedZone(zone.zone)}
                    disabled={locked}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                      selectedZone === zone.zone
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : locked
                          ? "bg-muted/10 border border-border/20 text-muted-foreground/40 cursor-not-allowed"
                          : "bg-card/30 border border-border/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {locked ? <Lock size={12} /> : <Icon size={12} />}
                    {zone.name.toUpperCase()}
                    {count > 0 && <span className="text-[9px] text-accent">({count})</span>}
                  </button>
                );
              })}
            </div>

            {/* Visual room */}
            <div
              className="relative w-full rounded-lg border border-border/30 overflow-hidden select-none"
              style={{
                aspectRatio: "16 / 9",
                background: activeLightingBg,
                transition: "background 1s ease",
              }}
            >
              {/* Floor shading */}
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              {/* Top wall line */}
              <div className="absolute top-0 left-0 right-0 h-[55%] border-b border-primary/10 pointer-events-none" />

              {/* Edit/Done button */}
              <button
                onClick={() => { setEditMode(!editMode); setSelectedSlot(null); }}
                className={`absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                  editMode ? "bg-primary text-primary-foreground" : "bg-black/60 backdrop-blur-sm text-primary border border-primary/30"
                }`}
              >
                <Sparkles size={10} />
                {editMode ? "DONE" : "CUSTOMIZE"}
              </button>

              {/* Active music/lighting labels */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {music?.active && (
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-mono text-primary/70">
                    <Music size={10} />
                    {music.all.find((t: any) => t.id === music.active)?.name ?? music.active}
                  </div>
                )}
                {lighting?.active && (
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-mono text-primary/70">
                    <Lamp size={10} />
                    {lighting.all.find((p: any) => p.id === lighting.active)?.name ?? lighting.active}
                  </div>
                )}
              </div>

              {/* Interactive slot hotspots from ZONE_SLOT_MAPS */}
              {slots.map((slot: any) => {
                const item = slotToItem.get(slot.id);
                return (
                  <motion.button
                    key={slot.id}
                    onClick={() => editMode && setSelectedSlot(slot.id)}
                    className={`absolute rounded border-2 transition-all ${
                      editMode
                        ? "border-dashed border-primary/40 hover:border-primary/80 hover:bg-primary/10 cursor-pointer"
                        : "border-transparent cursor-default"
                    } ${item ? "border-solid border-primary/30 bg-primary/5" : ""}`}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: `${slot.w}%`,
                      height: `${slot.h}%`,
                    }}
                    whileHover={editMode ? { scale: 1.02 } : {}}
                    whileTap={editMode ? { scale: 0.98 } : {}}
                    aria-label={slot.label}
                  >
                    {item ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-1 gap-0.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span className="text-[8px] font-mono text-primary/80 text-center leading-tight line-clamp-2">
                          {item.name}
                        </span>
                      </div>
                    ) : editMode ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[8px] font-mono text-primary/30">{slot.label}</span>
                      </div>
                    ) : null}
                  </motion.button>
                );
              })}

              {/* Visiting companions (only in the main hall) */}
              {selectedZone === "main" && !editMode && visitingCompanions.map((c: any) => (
                <motion.div
                  key={c.companionId}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-[5] pointer-events-none"
                  style={{ left: `${c.position.x}%`, top: `${c.position.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-accent/30 border border-accent/60 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-accent">{c.name.charAt(0)}</span>
                    </div>
                    <span className="text-[8px] font-mono text-accent/80 bg-black/60 px-1 rounded">{c.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lighting + Music pickers (edit mode) */}
            {editMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Lighting */}
                <div className="void-surface p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lamp size={12} className="text-primary" />
                    <span className="font-mono text-[10px] tracking-wider text-primary">LIGHTING</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {(lighting?.all ?? []).map((preset: any) => {
                      const unlocked = (lighting?.available ?? []).some((p: any) => p.id === preset.id);
                      const active = lighting?.active === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => unlocked && handleSetLighting(preset.id)}
                          disabled={!unlocked}
                          className={`text-left px-2 py-1.5 rounded border text-[10px] font-mono transition-colors ${
                            active
                              ? "border-primary bg-primary/20 text-primary"
                              : unlocked
                                ? "border-border/30 text-foreground hover:border-primary/40"
                                : "border-border/20 text-muted-foreground/40 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {active && <Check size={10} />}
                            {!unlocked && <Lock size={10} />}
                            <span className="truncate">{preset.name}</span>
                          </div>
                          {!unlocked && (
                            <div className="text-[8px] text-amber-500/50 truncate mt-0.5">{preset.unlockHint}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Music */}
                <div className="void-surface p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Music size={12} className="text-primary" />
                    <span className="font-mono text-[10px] tracking-wider text-primary">MUSIC BOX</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {(music?.all ?? []).map((track: any) => {
                      const unlocked = (music?.available ?? []).some((t: any) => t.id === track.id);
                      const active = music?.active === track.id;
                      return (
                        <button
                          key={track.id}
                          onClick={() => unlocked && handleSetMusic(track.id)}
                          disabled={!unlocked}
                          className={`text-left px-2 py-1.5 rounded border text-[10px] font-mono transition-colors ${
                            active
                              ? "border-primary bg-primary/20 text-primary"
                              : unlocked
                                ? "border-border/30 text-foreground hover:border-primary/40"
                                : "border-border/20 text-muted-foreground/40 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {active && <Check size={10} />}
                            {!unlocked && <Lock size={10} />}
                            <span className="truncate">{track.name}</span>
                          </div>
                          {!unlocked && (
                            <div className="text-[8px] text-amber-500/50 truncate mt-0.5">{track.unlockHint}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "catalog" && (
          <div className="space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
              AVAILABLE DECORATIONS ({availableItems.length} unlocked)
            </p>
            {availableItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableItems.map((item: any, i: number) => (
                  <motion.div
                    key={item.key || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="void-surface p-3 flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{ background: `${item.color}20` }}
                    >
                      <Sparkles size={16} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold truncate">{item.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground/60 truncate">
                        {item.category} • {item.rarity || "common"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Palette size={36} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-mono text-xs text-muted-foreground">No decorations unlocked yet.</p>
              </div>
            )}
          </div>
        )}

        {tab === "visit" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter user ID to visit..."
                value={visitUserId}
                onChange={(e) => setVisitUserId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-card/30 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
              />
              <Button size="sm" variant="outline" disabled={!visitUserId}>
                <Eye size={12} className="mr-1" /> Visit
              </Button>
            </div>
            {visitData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="void-surface border-primary/20 p-4"
              >
                <h3 className="font-display text-sm font-bold tracking-wide mb-3 flex items-center gap-2">
                  <Eye size={14} className="text-primary" />
                  VISITING QUARTERS
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="rounded-md bg-muted/10 p-2">
                    <p className="text-muted-foreground/60 text-[10px]">VISITS</p>
                    <p className="text-foreground">{visitData.quarters?.visitCount || 0}</p>
                  </div>
                  <div className="rounded-md bg-muted/10 p-2">
                    <p className="text-muted-foreground/60 text-[10px]">DECORATIONS</p>
                    <p className="text-foreground">{(visitData.quarters?.placedItems as any[] || []).length}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Slot item picker modal (overlay within decorate tab) */}
      <AnimatePresence>
        {selectedSlot && editMode && tab === "decorate" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-md border-t border-primary/20 p-4 max-h-[55vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-mono text-primary">
                  {activeSlot?.label ?? "Slot"}
                </span>
                <span className="ml-2 text-[10px] font-mono text-muted-foreground">
                  Accepts: {activeSlot?.accepts?.join(", ")}
                </span>
              </div>
              <div className="flex gap-2">
                {slotToItem.has(selectedSlot) && (
                  <Button variant="outline" size="sm" onClick={() => handleClearSlot(selectedSlot)} className="gap-1 text-xs">
                    <Trash2 size={10} /> Remove
                  </Button>
                )}
                <button onClick={() => setSelectedSlot(null)} className="text-primary/40 hover:text-primary">
                  <X size={16} />
                </button>
              </div>
            </div>

            {pickerItems.length === 0 ? (
              <div className="text-center py-6 text-[11px] font-mono text-muted-foreground/50">
                No unlocked items match this slot. Check the catalog tab.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {pickerItems.map((item: any) => {
                  const isPlaced = slotToItem.get(selectedSlot)?.key === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handlePlace(selectedSlot, item.key)}
                      className={`text-left p-2 rounded border transition-all ${
                        isPlaced
                          ? "border-primary bg-primary/10"
                          : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {isPlaced ? <Check size={10} className="text-primary" /> : <Frame size={10} className="text-primary/40" />}
                        <span className="text-[10px] font-mono text-primary/80 truncate">{item.name}</span>
                      </div>
                      <p className="text-[9px] text-primary/30 leading-tight line-clamp-2">{item.description}</p>
                      <p className="text-[8px] text-muted-foreground/40 mt-1">
                        {item.rarity} • {item.cost} dream
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
