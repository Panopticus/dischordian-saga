import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Gem, Flame, Sparkles, ChevronRight, Loader2,
  Trash2, AlertTriangle, Check, Zap, Hammer, Sword, Shield, Recycle,
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";
import { EmptyInventory } from "@/components/EmptyStates";
import { MATERIALS, getMaterialById } from "@/data/craftingData";
import { getEquipmentById, RARITY_COLORS, type EquipSlot } from "@/data/equipmentData";

import LivingBackground from "@/components/LivingBackground";

/* ═══ DISENCHANT RARITY CONFIG ═══ */
const RARITY_CONFIG: Record<string, { label: string; color: string; dream: number; dust: number; essence: number }> = {
  common: { label: "Common", color: "text-zinc-400", dream: 5, dust: 10, essence: 0 },
  uncommon: { label: "Uncommon", color: "text-green-400", dream: 10, dust: 20, essence: 1 },
  rare: { label: "Rare", color: "text-cyan-400", dream: 25, dust: 50, essence: 3 },
  epic: { label: "Epic", color: "text-purple-400", dream: 50, dust: 100, essence: 8 },
  legendary: { label: "Legendary", color: "text-amber-400", dream: 100, dust: 200, essence: 15 },
  mythic: { label: "Mythic", color: "text-red-400", dream: 250, dust: 500, essence: 30 },
};

export default function InventoryPage() {
  const { isAuthenticated } = useAuth();
  const tabNames = ["overview", "cards", "materials", "crafted", "disenchant"] as const;
  type TabName = typeof tabNames[number];
  const [activeTab, setActiveTab] = useState<TabName>("overview");
  const activeIndex = tabNames.indexOf(activeTab);
  const { handlers } = useSwipeTabs({
    tabCount: tabNames.length,
    activeIndex,
    onTabChange: (i: number) => setActiveTab(tabNames[i]),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8 grid-bg">
      <LivingBackground src="https://dgrsart.s3.us-east-2.amazonaws.com/page-backgrounds/INV-001_cargo-hold.jpg" accent="#f97316" opacity={0.13} particleCount={4} scanlines={false} />
        <div className="text-center">
          <Package size={48} className="text-primary mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-xl font-bold mb-2">INVENTORY</h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">Authentication required to access your inventory.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 void-btn void-btn-primary font-mono text-sm">
            AUTHENTICATE <ChevronRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg" {...handlers}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Package size={18} className="text-primary" />
          <h1 className="font-display text-xl font-bold tracking-wider">INVENTORY</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">Manage your cards, materials, and resources.</p>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 flex gap-1 border-b border-border/20 overflow-x-auto">
        {[
          { id: "overview" as const, label: "OVERVIEW", icon: Package },
          { id: "cards" as const, label: "CARDS", icon: Sparkles },
          { id: "materials" as const, label: "MATERIALS", icon: Hammer },
          { id: "crafted" as const, label: "CRAFTED", icon: Sword },
          { id: "disenchant" as const, label: "DISENCHANT", icon: Flame },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 font-mono text-xs tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OverviewTab />
            </motion.div>
          )}
          {activeTab === "cards" && (
            <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CardsTab />
            </motion.div>
          )}
          {activeTab === "materials" && (
            <motion.div key="materials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MaterialsTab />
            </motion.div>
          )}
          {activeTab === "crafted" && (
            <motion.div key="crafted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CraftedTab />
            </motion.div>
          )}
          {activeTab === "disenchant" && (
            <motion.div key="disenchant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DisenchantTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══ OVERVIEW TAB ═══ */
function OverviewTab() {
  const { data: summary, isLoading } = trpc.inventory.summary.useQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 void-surface">
          <Sparkles size={18} className="text-cyan-400 mb-2" />
          <p className="font-display text-2xl font-bold">{summary?.cards || 0}</p>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">TOTAL CARDS</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-400/5 border border-purple-400/20">
          <Gem size={18} className="text-purple-400 mb-2" />
          <p className="font-display text-2xl font-bold text-purple-400">{(summary?.dream || 0).toLocaleString()}</p>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">DREAM TOKENS</p>
        </div>
        <div className="p-4 rounded-lg bg-amber-400/5 border border-amber-400/20">
          <Flame size={18} className="text-amber-400 mb-2" />
          <p className="font-display text-2xl font-bold text-amber-400">—</p>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">STAR DUST</p>
        </div>
      </div>

      {/* Disenchant Values Reference */}
      <div className="p-4 void-surface">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Flame size={13} className="text-destructive" /> DISENCHANT VALUES
        </h3>
        <div className="space-y-1.5">
          {Object.entries(RARITY_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
              <span className={`font-mono text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                <span><Gem size={9} className="inline text-purple-400" /> {cfg.dream}</span>
                <span><Flame size={9} className="inline text-amber-400" /> {cfg.dust}</span>
                {cfg.essence > 0 && <span><Sparkles size={9} className="inline text-cyan-400" /> {cfg.essence}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ CARDS TAB ═══ */
function CardsTab() {
  const { data, isLoading } = trpc.inventory.myCards.useQuery({});

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  const cards = data?.cards || [];

  if (cards.length === 0) {
    return <EmptyInventory />;
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-muted-foreground">{cards.length} unique cards ({data?.total || 0} total)</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="p-3 void-surface hover:border-primary/20 transition-all"
          >
            <p className="font-mono text-xs font-semibold truncate">{card.cardId}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[10px] text-muted-foreground">Qty: {card.quantity}</span>
              {card.quantity > 2 && (
                <span className="font-mono text-[9px] text-amber-400">{card.quantity - 2} excess</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══ MATERIALS TAB ═══ */
function MaterialsTab() {
  const { data: profile, isLoading } = trpc.crafting.getCraftingProfile.useQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  const materials = profile?.materials ?? {};
  const owned = MATERIALS.filter(m => (materials[m.id] ?? 0) > 0);
  // Group materials by source
  const grouped: Record<string, typeof owned> = {};
  for (const mat of owned) {
    (grouped[mat.source] ??= []).push(mat);
  }

  const SOURCE_LABELS: Record<string, { label: string; icon: typeof Hammer }> = {
    card_sacrifice: { label: "Card Sacrifice", icon: Sparkles },
    trade_empire: { label: "Trade Empire", icon: Package },
    combat_drop: { label: "Combat Drops", icon: Sword },
    exploration: { label: "Exploration", icon: Shield },
    crafted: { label: "Crafted Intermediates", icon: Hammer },
  };

  if (owned.length === 0) {
    return (
      <div className="text-center py-12">
        <Hammer size={40} className="text-muted-foreground/20 mx-auto mb-3" />
        <p className="font-mono text-xs text-muted-foreground">No crafting materials yet.</p>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          Win fights, complete trade missions, or explore the Ark to gather materials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="font-mono text-xs text-muted-foreground">
        {owned.length} different materials, {Object.values(materials).reduce((a, b) => a + b, 0)} total
      </p>
      {Object.entries(grouped).map(([source, mats]) => {
        const cfg = SOURCE_LABELS[source] ?? { label: source, icon: Package };
        const Icon = cfg.icon;
        return (
          <div key={source} className="space-y-2">
            <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Icon size={12} /> {cfg.label.toUpperCase()}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {mats.map(mat => (
                <div
                  key={mat.id}
                  className="p-3 void-surface flex items-center gap-2"
                  style={{ borderColor: `${mat.color}30` }}
                >
                  <span className="text-lg shrink-0">{mat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] font-bold truncate" style={{ color: mat.color }}>
                      {mat.name}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/60 truncate">
                      {mat.rarity}
                    </p>
                  </div>
                  <span className="font-display text-sm font-bold" style={{ color: mat.color }}>
                    {materials[mat.id]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ CRAFTED ITEMS TAB ═══ */
function CraftedTab() {
  const utils = trpc.useUtils();
  const { data: inventory, isLoading } = trpc.crafting.getCraftedInventory.useQuery();
  const { data: citizen } = trpc.citizen.getCharacter.useQuery();

  const equipMutation = trpc.crafting.equipCraftedItem.useMutation({
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error ?? "Could not equip");
        return;
      }
      toast.success(`Equipped ${res.itemId?.replace(/_/g, " ")}`);
      void utils.crafting.getCraftedInventory.invalidate();
      void utils.citizen.getCharacter.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const unequipMutation = trpc.crafting.unequipCraftedItem.useMutation({
    onSuccess: () => {
      toast.success("Unequipped");
      void utils.crafting.getCraftedInventory.invalidate();
      void utils.citizen.getCharacter.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const disenchantMutation = trpc.crafting.disenchantCraftedItem.useMutation({
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error ?? "Could not disenchant");
        return;
      }
      const refundList = Object.entries(res.refunded ?? {})
        .map(([id, qty]) => `${getMaterialById(id)?.name ?? id} x${qty}`)
        .join(", ");
      toast.success(`Disenchanted: ${refundList || "no refund"} (+${res.dreamRebate} Dream)`);
      void utils.crafting.getCraftedInventory.invalidate();
      void utils.crafting.getCraftingProfile.invalidate();
      void utils.crafting.getDreamBalance.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  const items = inventory?.items ?? [];
  // Resolve each crafted item against the equipment DB and group by slot.
  // Items whose itemId isn't in EQUIPMENT_DB are bucketed under "other"
  // (e.g. potions, ship upgrades, card enhancements).
  const grouped: Record<string, Array<{ itemId: string; total: number; equipped: number }>> = {};
  for (const it of items) {
    const def = getEquipmentById(it.itemId);
    const slot = def?.slot ?? "other";
    (grouped[slot] ??= []).push(it);
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Sword size={40} className="text-muted-foreground/20 mx-auto mb-3" />
        <p className="font-mono text-xs text-muted-foreground">No crafted items yet.</p>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          Visit the Forge to craft equipment from gathered materials.
        </p>
      </div>
    );
  }

  const SLOT_LABELS: Record<string, string> = {
    weapon: "Weapons",
    armor: "Armor",
    helm: "Helms",
    accessory: "Accessories",
    secondary: "Secondary",
    consumable: "Consumables",
    other: "Other",
  };

  // What's currently equipped per slot (from citizen.gear)
  const currentGear = (citizen?.gear ?? {}) as Record<string, string>;

  return (
    <div className="space-y-6">
      <p className="font-mono text-xs text-muted-foreground">
        {items.length} unique crafted items, {items.reduce((s, i) => s + i.total, 0)} total
      </p>
      {Object.entries(grouped).map(([slot, slotItems]) => (
        <div key={slot} className="space-y-2">
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground">
            {SLOT_LABELS[slot]?.toUpperCase() ?? slot.toUpperCase()}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {slotItems.map(it => {
              const def = getEquipmentById(it.itemId);
              const rc = def ? RARITY_COLORS[def.rarity] : null;
              const isEquippable = !!def && def.slot !== "consumable";
              const isEquipped = def && currentGear[def.slot] === it.itemId;
              const available = it.total - it.equipped;
              return (
                <div
                  key={it.itemId}
                  className="p-3 void-surface space-y-2"
                  style={rc ? { borderColor: rc.glow } : undefined}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`font-mono text-xs font-bold truncate ${rc?.text ?? "text-foreground"}`}>
                        {def?.name ?? it.itemId.replace(/_/g, " ")}
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground/60">
                        {def?.rarity?.toUpperCase() ?? "RECIPE"} • {available} available • {it.equipped} equipped
                      </p>
                      {def && (
                        <p className="font-mono text-[9px] text-muted-foreground/40 mt-1 line-clamp-2">
                          {def.description}
                        </p>
                      )}
                    </div>
                    {def && (
                      <div className="text-right shrink-0">
                        {def.stats.atk ? <p className="font-mono text-[9px] text-red-400">+{def.stats.atk} ATK</p> : null}
                        {def.stats.def ? <p className="font-mono text-[9px] text-blue-400">+{def.stats.def} DEF</p> : null}
                        {def.stats.hp ? <p className="font-mono text-[9px] text-green-400">+{def.stats.hp} HP</p> : null}
                        {def.stats.speed ? <p className="font-mono text-[9px] text-amber-400">+{def.stats.speed} SPD</p> : null}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {isEquippable && (
                      isEquipped ? (
                        <button
                          onClick={() => unequipMutation.mutate({ slot: def!.slot as EquipSlot })}
                          disabled={unequipMutation.isPending}
                          className="flex-1 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold hover:bg-amber-500/20 transition-all disabled:opacity-50"
                        >
                          UNEQUIP
                        </button>
                      ) : (
                        <button
                          onClick={() => equipMutation.mutate({ itemId: it.itemId, slot: def!.slot as EquipSlot })}
                          disabled={available <= 0 || equipMutation.isPending}
                          className="flex-1 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] font-bold hover:bg-primary/20 transition-all disabled:opacity-30"
                        >
                          EQUIP
                        </button>
                      )
                    )}
                    <button
                      onClick={() => disenchantMutation.mutate({ itemId: it.itemId })}
                      disabled={available <= 0 || disenchantMutation.isPending}
                      className="flex-1 py-1.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive font-mono text-[10px] font-bold hover:bg-destructive/20 transition-all disabled:opacity-30 flex items-center justify-center gap-1"
                    >
                      <Recycle size={10} /> DISENCHANT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ DISENCHANT TAB ═══ */
function DisenchantTab() {
  const [keepCount, setKeepCount] = useState(2);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const bulkMut = trpc.inventory.disenchantDuplicates.useMutation({
    onSuccess: (data) => {
      setConfirmBulk(false);
      toast.success(`Disenchanted ${data.cardsDisenchanted} cards!`, {
        description: `+${data.rewards.dream} Dream, +${data.rewards.dust} Dust, +${data.rewards.essence} Essence`,
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="p-4 void-surface">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Flame size={13} className="text-destructive" /> DISENCHANT OVERVIEW
        </h3>
        <p className="font-mono text-xs text-foreground/70 leading-relaxed mb-4">
          Disenchanting converts excess cards into Dream Tokens, Star Dust, and Essence.
          Higher rarity cards yield more resources. You can disenchant individual cards or
          bulk-disenchant all duplicates above a threshold.
        </p>
      </div>

      {/* Bulk Disenchant */}
      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-destructive mb-3 flex items-center gap-2">
          <Trash2 size={13} /> BULK DISENCHANT DUPLICATES
        </h3>
        <p className="font-mono text-xs text-foreground/70 mb-4">
          Automatically disenchant all cards where you own more than the keep threshold.
        </p>

        <div className="mb-4">
          <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-2">KEEP COUNT (per card)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setKeepCount(n)}
                className={`flex-1 py-2 rounded-md font-mono text-xs transition-all ${
                  keepCount === n
                    ? "bg-primary/10 border border-primary/40 text-primary"
                    : "bg-card/30 border border-border/20 text-muted-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {!confirmBulk ? (
          <button
            onClick={() => setConfirmBulk(true)}
            className="w-full py-2.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs font-bold tracking-wider hover:bg-destructive/20 transition-all"
          >
            <Flame size={14} className="inline mr-1.5" />
            DISENCHANT ALL DUPLICATES (KEEP {keepCount})
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-amber-400/10 border border-amber-400/20">
              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
              <p className="font-mono text-[10px] text-amber-400">This action cannot be undone. All excess cards will be permanently destroyed.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmBulk(false)}
                className="flex-1 py-2 rounded-md bg-card/30 border border-border/20 text-muted-foreground font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={() => bulkMut.mutate({ keepCount })}
                disabled={bulkMut.isPending}
                className="flex-1 py-2 rounded-md bg-destructive/20 border border-destructive/40 text-destructive font-mono text-xs font-bold hover:bg-destructive/30 transition-all disabled:opacity-50"
              >
                {bulkMut.isPending ? <Loader2 size={14} className="animate-spin mx-auto" /> : (
                  <><Check size={12} className="inline mr-1" /> CONFIRM</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
