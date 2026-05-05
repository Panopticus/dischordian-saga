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
  architect: "void-border-error void-bg-error",
  insurgency: "void-border-success void-bg-success",
  dreamer: "void-border-system void-bg-system",
  new_babylon: "void-border void-bg-sunk",
  antiquarian: "void-border void-bg-sunk",
  thought_virus: "void-border-system void-bg-system",
  neutral: "void-border void-bg-canvas",
};

const TIER_BADGE_COLOR: Record<string, string> = {
  common: "void-text void-border",
  uncommon: "void-text-energy void-border-success",
  rare: "void-text-energy void-border",
  epic: "void-text-system void-border-system",
  legendary: "void-text-accent void-border",
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
            <Sparkles size={20} className="void-text-accent" />
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
          <p className="font-display text-xl font-bold void-text-accent">
            {legendaryUnlocked} <span className="text-muted-foreground text-sm">/ 18</span>
          </p>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => {
          const accent =
            FACTION_ACCENT[row.faction] ?? "border-border/30 bg-card/20";
          // Rows where the player hasn't unlocked any imprint tier yet
          // (highestTierUnlocked === 0) read as totally locked — give
          // them the standard void-glitch-lock treatment so silhouettes
          // still convey "unfamiliar figure" rather than blank card.
          const isFullyLocked = row.highestTierUnlocked <= 0;
          return (
            <motion.div
              key={row.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-4 space-y-3 ${accent} ${
                isFullyLocked ? "void-glitch void-glitch-lock" : ""
              }`}
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
                          ? "void-bg-sunk"
                          : t === 4
                            ? "void-bg-system"
                            : t === 3
                              ? "void-bg-sunk"
                              : t === 2
                                ? "void-bg-success"
                                : "void-bg-canvas"
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
                  <span className="void-text-accent flex items-center gap-1">
                    <Crown size={10} /> complete
                  </span>
                )}
              </div>
              <div className="w-full bg-border/30 rounded-full h-1">
                <div
                  className="h-1 rounded-full void-bg-energy"
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
