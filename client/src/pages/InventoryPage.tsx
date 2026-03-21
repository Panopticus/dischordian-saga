import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Gem, Flame, Sparkles, ChevronRight, Loader2,
  Trash2, AlertTriangle, Check, Zap
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";

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
  const tabNames = ["overview", "cards", "disenchant"] as const;
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
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center">
          <Package size={48} className="text-primary mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-xl font-bold mb-2">INVENTORY</h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">Authentication required to access your inventory.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all">
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
        <div className="p-4 rounded-lg bg-card/30 border border-border/20">
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
      <div className="p-4 rounded-lg bg-card/30 border border-border/20">
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
    return (
      <div className="text-center py-12">
        <Sparkles size={32} className="text-muted-foreground/30 mx-auto mb-2" />
        <p className="font-mono text-xs text-muted-foreground">No cards in your collection yet.</p>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">Win battles, open packs, or trade to collect cards.</p>
      </div>
    );
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
            className="p-3 rounded-lg bg-card/30 border border-border/20 hover:border-primary/20 transition-all"
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
      <div className="p-4 rounded-lg bg-card/30 border border-border/20">
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
