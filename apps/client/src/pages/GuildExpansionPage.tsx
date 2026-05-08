/* ═══════════════════════════════════════════════════════
   GUILD EXPANSION PAGE — Perks, Quests, Banners, Stash
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Flag, Package, Target, Lock, Unlock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Tab = "perks" | "quests" | "banners" | "stash";

export default function GuildExpansionPage() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("perks");

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="font-mono text-sm text-muted-foreground">Sign in to view guild expansion.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft size={12} /> BACK
      </Link>
      <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3 mt-4">
        <Sparkles className="text-primary" size={28} />
        GUILD HALL
      </h1>
      <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">
        Perks, quests, banners, and shared stash.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: "perks", label: "PERKS", icon: Sparkles },
          { key: "quests", label: "QUESTS", icon: Target },
          { key: "banners", label: "BANNERS", icon: Flag },
          { key: "stash", label: "STASH", icon: Package },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`font-mono text-xs px-3 py-1.5 border rounded inline-flex items-center gap-1 ${
              tab === key
                ? "border-primary text-primary bg-primary/10"
                : "border-border/40 text-muted-foreground hover:border-border"
            }`}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {tab === "perks" && <PerksTab />}
      {tab === "quests" && <QuestsTab />}
      {tab === "banners" && <BannersTab />}
      {tab === "stash" && <StashTab />}
    </div>
  );
}

function PerksTab() {
  const catalog = trpc.guildExpansion.getPerkCatalog.useQuery();
  const my = trpc.guildExpansion.getMyGuildPerks.useQuery();
  const utils = trpc.useUtils();
  const unlock = trpc.guildExpansion.unlockGuildPerk.useMutation({
    onSuccess: () => utils.guildExpansion.getMyGuildPerks.invalidate(),
  });

  const unlockedSet = new Set(my.data?.unlocked ?? []);
  const qualifyingSet = new Set(my.data?.qualifying ?? []);

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {(catalog.data ?? []).map((perk) => {
        const unlocked = unlockedSet.has(perk.perkKey);
        const qualifying = qualifyingSet.has(perk.perkKey);
        return (
          <motion.div
            key={perk.perkKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-3 ${
              unlocked
                ? "border-primary/50 bg-primary/5"
                : qualifying
                  ? "void-border void-bg-sunk"
                  : "border-border/40 bg-secondary/20 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold tracking-wider">{perk.name}</h3>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  Hall T{perk.requiredHallTier} · {perk.requiredXp} XP
                  {perk.factionAlignment && ` · ${perk.factionAlignment}`}
                </p>
              </div>
              {unlocked ? (
                <Unlock size={14} className="text-primary" />
              ) : (
                <Lock size={14} className="text-muted-foreground opacity-50" />
              )}
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed">{perk.description}</p>
            {perk.flavorText && (
              <p className="font-mono text-[10px] italic mt-2 opacity-60">"{perk.flavorText}"</p>
            )}
            {!unlocked && qualifying && (
              <button
                type="button"
                className="mt-3 w-full font-mono text-xs py-1.5 border border-primary/40 text-primary rounded hover:bg-primary/10"
                disabled={unlock.isPending}
                onClick={() => unlock.mutate({ perkKey: perk.perkKey })}
              >
                {unlock.isPending ? "UNLOCKING..." : "UNLOCK"}
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function QuestsTab() {
  const quests = trpc.guildExpansion.getMyGuildQuests.useQuery();
  const utils = trpc.useUtils();
  const claim = trpc.guildExpansion.claimQuestReward.useMutation({
    onSuccess: () => utils.guildExpansion.getMyGuildQuests.invalidate(),
  });
  const grouped: Record<string, NonNullable<typeof quests.data>> = { daily: [], weekly: [], seasonal: [] };
  for (const q of quests.data ?? []) (grouped[q.scope] ??= []).push(q);
  return (
    <div className="space-y-6">
      {(["daily", "weekly", "seasonal"] as const).map((scope) => (
        <div key={scope}>
          <h3 className="font-display text-lg font-bold tracking-wider mb-2 uppercase">{scope}</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(grouped[scope] ?? []).map((q) => {
              const pct = q.target > 0 ? Math.min(1, q.progress / q.target) : 0;
              return (
                <div
                  key={q.questKey}
                  className={`border rounded-lg p-3 ${
                    q.completedAt
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/40 bg-secondary/20"
                  }`}
                >
                  <h4 className="font-display text-sm font-bold tracking-wider">{q.name}</h4>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{q.description}</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {q.progress} / {q.target}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {Math.round(pct * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.round(pct * 100)}%` }}
                      />
                    </div>
                  </div>
                  {q.completedAt && !q.rewardClaimed && (
                    <button
                      type="button"
                      className="mt-3 w-full font-mono text-xs py-1.5 border border-primary text-primary rounded hover:bg-primary/10"
                      disabled={claim.isPending}
                      onClick={() => claim.mutate({ questKey: q.questKey })}
                    >
                      {claim.isPending ? "CLAIMING..." : "CLAIM REWARD"}
                    </button>
                  )}
                  {q.rewardClaimed && (
                    <p className="mt-2 font-mono text-[10px] text-primary text-center">✓ CLAIMED</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BannersTab() {
  const cosmetics = trpc.guildExpansion.getMyGuildCosmetics.useQuery();
  const catalog = trpc.guildExpansion.getBannerCatalog.useQuery();
  const utils = trpc.useUtils();
  const setBanner = trpc.guildExpansion.setBanner.useMutation({
    onSuccess: () => utils.guildExpansion.getMyGuildCosmetics.invalidate(),
  });
  const setMotto = trpc.guildExpansion.setMotto.useMutation({
    onSuccess: () => utils.guildExpansion.getMyGuildCosmetics.invalidate(),
  });
  const [draftMotto, setDraftMotto] = useState("");

  const unlocked = new Set(cosmetics.data?.unlockedBanners ?? []);
  const equipped = cosmetics.data?.bannerKey;

  return (
    <div className="space-y-6">
      <div className="border border-border/40 rounded-lg p-4 bg-secondary/20">
        <p className="font-mono text-[10px] text-muted-foreground mb-2">GUILD MOTTO</p>
        <p className="font-mono text-sm">{cosmetics.data?.mottoText ?? <em className="opacity-50">No motto set</em>}</p>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={draftMotto}
            onChange={(e) => setDraftMotto(e.target.value)}
            maxLength={80}
            placeholder="80 chars max…"
            className="flex-1 font-mono text-xs px-2 py-1 bg-background border border-border/40 rounded"
          />
          <button
            type="button"
            disabled={setMotto.isPending}
            onClick={() => setMotto.mutate({ motto: draftMotto })}
            className="font-mono text-xs px-3 border border-primary/40 text-primary rounded hover:bg-primary/10"
          >
            SAVE
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {(catalog.data ?? []).map((b) => {
          const isUnlocked = unlocked.has(b.bannerKey);
          const isEquipped = equipped === b.bannerKey;
          return (
            <div
              key={b.bannerKey}
              className={`border rounded-lg p-3 ${
                isUnlocked ? "border-primary/40 bg-primary/5" : "border-border/40 bg-secondary/20 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold tracking-wider" style={{ color: b.accentColor }}>
                  {b.name}
                </h4>
                {isEquipped && (
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-primary/40 text-primary rounded bg-primary/10">
                    EQUIPPED
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">
                {b.source.replace(/_/g, " ")} {b.factionAlignment ? `· ${b.factionAlignment}` : ""}
              </p>
              <p className="font-mono text-xs mt-2 leading-relaxed">{b.description}</p>
              {isUnlocked && !isEquipped && (
                <button
                  type="button"
                  className="mt-3 w-full font-mono text-xs py-1.5 border border-primary/40 text-primary rounded hover:bg-primary/10"
                  disabled={setBanner.isPending}
                  onClick={() => setBanner.mutate({ bannerKey: b.bannerKey })}
                >
                  EQUIP
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StashTab() {
  const stash = trpc.guildExpansion.listStash.useQuery();
  const log = trpc.guildExpansion.getStashLog.useQuery({ limit: 25 });
  const utils = trpc.useUtils();
  const withdraw = trpc.guildExpansion.withdrawFromStash.useMutation({
    onSuccess: () => {
      utils.guildExpansion.listStash.invalidate();
      utils.guildExpansion.getStashLog.invalidate();
    },
  });
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-display text-lg font-bold tracking-wider mb-2 uppercase">Stash Slots</h3>
        {(stash.data ?? []).length === 0 && (
          <p className="font-mono text-xs text-muted-foreground italic">Empty.</p>
        )}
        <div className="space-y-2">
          {(stash.data ?? []).map((s) => (
            <div key={s.id} className="border border-border/40 rounded-lg p-3 bg-secondary/20 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs font-bold">{s.itemKey}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{s.itemType} · qty {s.quantity}</p>
              </div>
              <button
                type="button"
                disabled={withdraw.isPending}
                onClick={() => withdraw.mutate({ slotKey: s.slotKey, quantity: 1 })}
                className="font-mono text-[10px] px-2 py-1 border border-primary/40 text-primary rounded hover:bg-primary/10"
              >
                WITHDRAW 1
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg font-bold tracking-wider mb-2 uppercase">Recent Activity</h3>
        <div className="space-y-1">
          {(log.data ?? []).map((l) => (
            <div key={l.id} className="font-mono text-[10px] text-muted-foreground border-b border-border/20 py-1">
              <span className={l.action === "deposit" ? "void-text-energy" : "void-text-accent"}>
                {l.action.toUpperCase()}
              </span>
              {" "}user {l.userId} · {l.itemType}:{l.itemKey} ×{l.quantity}
            </div>
          ))}
          {(log.data ?? []).length === 0 && (
            <p className="font-mono text-xs text-muted-foreground italic">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
