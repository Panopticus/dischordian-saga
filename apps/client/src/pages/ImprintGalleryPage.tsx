/* ═══════════════════════════════════════════════════════
   THE IMPRINT GALLERY — Phase F28

   The long-tail NPC collection view. Eighteen Season-1 NPCs, each
   with a fragment count + a five-tier signature card unlock
   ladder (Common → Uncommon → Rare → Epic → Legendary). Players
   earn fragments from every game mode (story chapters, chess
   opponents, companion chats) and the tier unlocks happen server-
   side in imprintService; this page just visualizes what has
   already been earned.
   ═══════════════════════════════════════════════════════ */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowLeft, Loader2, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

/** Faction → accent color for the gallery card frame. Matches
 *  the card back palette from docs/TCG_ART_SPEC.md. */
const FACTION_ACCENT: Record<string, string> = {
  architect: "border-red-500/40 bg-red-500/5",
  insurgency: "border-emerald-500/40 bg-emerald-500/5",
  dreamer: "border-violet-500/40 bg-violet-500/5",
  new_babylon: "border-amber-500/40 bg-amber-500/5",
  antiquarian: "border-sky-500/40 bg-sky-500/5",
  thought_virus: "border-fuchsia-500/40 bg-fuchsia-500/5",
  neutral: "border-slate-400/40 bg-slate-400/5",
};

const TIER_BADGE_COLOR: Record<string, string> = {
  common: "text-slate-300 border-slate-400/40",
  uncommon: "text-emerald-300 border-emerald-400/40",
  rare: "text-sky-300 border-sky-400/40",
  epic: "text-violet-300 border-violet-400/40",
  legendary: "text-amber-300 border-amber-400/40",
};

export default function ImprintGalleryPage() {
  const { isAuthenticated } = useAuth();
  const galleryQ = trpc.imprints.getGallery.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <a
          href={getLoginUrl()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
        >
          Sign in to view the Imprint Gallery
        </a>
      </div>
    );
  }

  if (galleryQ.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const rows = galleryQ.data ?? [];
  const totalTiers = rows.reduce((sum, r) => sum + r.highestTierUnlocked, 0);
  const legendaryUnlocked = rows.filter((r) => r.highestTierUnlocked >= 5).length;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-2">
            <Sparkles size={20} className="text-amber-300" />
            THE IMPRINT GALLERY
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Eighteen NPCs, ninety tiered imprint cards. Every story chapter
            you complete, every chess match you play, every conversation
            you have contributes fragments.
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="rounded-lg border border-border/30 bg-card/20 p-4 grid grid-cols-3 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            NPCs tracked
          </p>
          <p className="font-display text-xl font-bold">{rows.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tiers unlocked
          </p>
          <p className="font-display text-xl font-bold">
            {totalTiers} <span className="text-muted-foreground text-sm">/ 90</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Legendaries
          </p>
          <p className="font-display text-xl font-bold text-amber-300">
            {legendaryUnlocked} <span className="text-muted-foreground text-sm">/ 18</span>
          </p>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => {
          const accent =
            FACTION_ACCENT[row.faction] ?? "border-border/30 bg-card/20";
          return (
            <motion.div
              key={row.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-4 space-y-3 ${accent}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-bold">
                    {row.displayName}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {row.faction.replace("_", " ")}
                  </p>
                </div>
                {row.rarityUnlockedLabel && (
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${TIER_BADGE_COLOR[row.rarityUnlockedLabel] ?? ""}`}
                  >
                    {row.rarityUnlockedLabel}
                  </span>
                )}
              </div>

              <p className="font-mono text-[11px] text-muted-foreground line-clamp-2 italic">
                {row.blurb}
              </p>

              {/* Tier ladder */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((t) => (
                  <div
                    key={t}
                    className={`flex-1 h-1.5 rounded-full ${
                      row.highestTierUnlocked >= t
                        ? t === 5
                          ? "bg-amber-400"
                          : t === 4
                            ? "bg-violet-400"
                            : t === 3
                              ? "bg-sky-400"
                              : t === 2
                                ? "bg-emerald-400"
                                : "bg-slate-400"
                        : "bg-border/30"
                    }`}
                  />
                ))}
              </div>

              {/* Fragment progress */}
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-muted-foreground">
                  Fragments: <span className="text-foreground">{row.fragments}</span>
                </span>
                {row.nextTier && row.nextThreshold ? (
                  <span className="text-muted-foreground">
                    Next: {row.fragments} / {row.nextThreshold}
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1">
                    <Crown size={10} /> complete
                  </span>
                )}
              </div>
              <div className="w-full bg-border/30 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-amber-400/60 to-amber-300"
                  style={{ width: `${row.progressPercent}%` }}
                />
              </div>

              {row.lastSource && (
                <p className="font-mono text-[9px] text-muted-foreground italic">
                  Last: {row.lastSource.replace("_", " ")}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
