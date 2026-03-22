/* ═══════════════════════════════════════════════════════
   PERSONAL QUARTERS PAGE — Decoratable hideout
   100+ items, RPG-unlocked decorations, visit other players
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Home, Plus, Trash2, Eye, Lock,
  Sparkles, Crown, Star, Package, Palette, Sofa,
  Lamp, Frame, Music, Flower2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ZONE_ICONS: Record<string, React.ComponentType<any>> = {
  main_hall: Home,
  bedroom: Sofa,
  study: Lamp,
  gallery: Frame,
  garden: Flower2,
  music_room: Music,
};

type Tab = "decorate" | "catalog" | "visit";

export default function PersonalQuartersPage() {
  const [tab, setTab] = useState<Tab>("decorate");
  const [selectedZone, setSelectedZone] = useState("main_hall");
  const [visitUserId, setVisitUserId] = useState<string>("");

  const { data: quarters, isLoading, refetch } = trpc.personalQuarters.getMyQuarters.useQuery();
  // Catalog comes from getMyQuarters response (availableItems)
  const { data: visitData } = trpc.personalQuarters.visitQuarters.useQuery(
    { ownerId: Number(visitUserId) },
    { enabled: tab === "visit" && !!visitUserId && !isNaN(Number(visitUserId)) }
  );

  // Quarters are auto-created on first getMyQuarters call
  const placeMut = trpc.personalQuarters.placeItem.useMutation({
    onSuccess: () => { toast.success("Decoration placed!"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const removeMut = trpc.personalQuarters.removeItem.useMutation({
    onSuccess: () => { toast.success("Decoration removed!"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const quartersData = (quarters as any)?.quarters;
  const availableItems = (quarters as any)?.availableItems || [];
  const decorations = quartersData?.placedItems as any[] || [];
  const zoneDecorations = decorations.filter((d: any) => d.zone === selectedZone);

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
            LVL {quartersData.level} // {decorations.length} items
          </span>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["decorate", "catalog", "visit"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
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
              {["main_hall", "bedroom", "study", "gallery", "garden", "music_room"].map(zone => {
                const Icon = ZONE_ICONS[zone] || Home;
                const count = decorations.filter((d: any) => d.zone === zone).length;
                return (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                      selectedZone === zone
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-card/30 border border-border/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={12} />
                    {zone.replace(/_/g, " ").toUpperCase()}
                    {count > 0 && <span className="text-[9px] text-accent">({count})</span>}
                  </button>
                );
              })}
            </div>

            {/* Zone Decorations */}
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
                {selectedZone.replace(/_/g, " ").toUpperCase()} — {zoneDecorations.length} ITEMS
              </p>
              {zoneDecorations.length === 0 ? (
                <div className="text-center py-8 rounded-lg border border-dashed border-border/30">
                  <Package size={32} className="mx-auto text-muted-foreground/20 mb-2" />
                  <p className="font-mono text-xs text-muted-foreground/60">Empty room. Add decorations from the catalog!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {zoneDecorations.map((dec: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-lg border border-border/30 bg-card/40 p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-semibold truncate">{dec.itemKey || dec.key}</span>
                        <button
                          onClick={() => removeMut.mutate({ itemKey: dec.itemKey || dec.key, zone: selectedZone })}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground/60">
                        Pos: ({dec.x || 0}, {dec.y || 0})
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "catalog" && (
          <div className="space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
              AVAILABLE DECORATIONS ({availableItems.length} items)
            </p>
            {availableItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableItems.map((item: any, i: number) => (
                  <motion.div
                    key={item.key || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      item.locked ? "bg-muted/10" : "bg-primary/10"
                    }`}>
                      {item.locked ? <Lock size={16} className="text-muted-foreground/40" /> : <Sparkles size={16} className="text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold truncate">{item.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground/60 truncate">
                        {item.category} • {item.rarity || "common"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={item.locked || placeMut.isPending}
                      onClick={() => placeMut.mutate({
                        itemKey: item.key,
                        zone: selectedZone,
                        x: 0,
                        y: 0,
                      })}
                    >
                      <Plus size={12} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Palette size={36} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-mono text-xs text-muted-foreground">Loading catalog...</p>
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
                className="rounded-lg border border-primary/20 bg-card/50 p-4"
              >
                <h3 className="font-display text-sm font-bold tracking-wide mb-3 flex items-center gap-2">
                  <Eye size={14} className="text-primary" />
                  VISITING QUARTERS
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="rounded-md bg-muted/10 p-2">
                    <p className="text-muted-foreground/60 text-[10px]">LEVEL</p>
                    <p className="text-foreground">{visitData.quarters?.visitCount || 0} visits</p>
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
    </div>
  );
}
