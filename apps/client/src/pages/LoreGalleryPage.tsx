/* ═══════════════════════════════════════════════════════
   LORE FRAGMENT GALLERY

   Collection of all discovered lore fragments from
   achievements, organized by era. Locked fragments
   show silhouettes with hints. Filter by era, search
   by text, track progress.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft,
  BookOpen,
  Search,
  Filter,
  Lock,
  Eye,
  Sparkles,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GlitchFx from "@/components/GlitchFx";
import { GallerySearch, GalleryFilterChip, GalleryShell } from "@/components/gallery";

import { assetUrl } from "@/lib/assetUrl";
/* ─── ERA DEFINITIONS ─── */

export interface LoreEra {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
}

const ERAS: LoreEra[] = [
  {
    id: "foundation",
    name: "The Foundation",
    color: "void-text-energy",
    description: "The building of the Ark and the first age of cooperation.",
    icon: "🏛️",
  },
  {
    id: "privacy",
    name: "The Age of Privacy",
    color: "void-text-energy",
    description: "When the veil fell and secrets became the only currency.",
    icon: "🔒",
  },
  {
    id: "fall",
    name: "The Fall",
    color: "void-text-error",
    description: "The collapse of the old order and the Architect's betrayal.",
    icon: "🔥",
  },
  {
    id: "potentials",
    name: "The Potentials",
    color: "void-text-system",
    description: "The emergence of the Awakened and the war for what comes next.",
    icon: "⚡",
  },
  {
    id: "visions",
    name: "Visions of Tomorrow",
    color: "void-text-accent",
    description: "Prophecies, dreams, and glimpses of possible futures.",
    icon: "👁️",
  },
];

const ERA_MAP = Object.fromEntries(ERAS.map((e) => [e.id, e]));

/* ─── ASSET PATHS ─── */

const ERA_BACKGROUNDS: Record<string, string> = {
  foundation: assetUrl("art/lore-gallery/era-backgrounds/foundation.jpg"),
  privacy: assetUrl("art/lore-gallery/era-backgrounds/privacy.jpg"),
  fall: assetUrl("art/lore-gallery/era-backgrounds/fall.jpg"),
  potentials: assetUrl("art/lore-gallery/era-backgrounds/potentials.jpg"),
  visions: assetUrl("art/lore-gallery/era-backgrounds/visions.jpg"),
};

const RARITY_FRAMES: Record<string, string> = {
  common: assetUrl("art/lore-gallery/card-frames/common.png"),
  uncommon: assetUrl("art/lore-gallery/card-frames/uncommon.png"),
  rare: assetUrl("art/lore-gallery/card-frames/rare.png"),
  epic: assetUrl("art/lore-gallery/card-frames/epic.png"),
  legendary: assetUrl("art/lore-gallery/card-frames/legendary.png"),
};

const LOCKED_OVERLAY = assetUrl("art/lore-gallery/overlays/locked-classified.png");

/* ─── LORE FRAGMENT ─── */

export interface LoreFragment {
  id: string;
  title: string;
  era: string;
  content: string;
  achievementId: string;
  achievementName: string;
  hint: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

/* ─── SAMPLE FRAGMENTS (would normally come from server) ─── */

const ALL_FRAGMENTS: LoreFragment[] = [
  // Foundation
  { id: "f1", title: "The First Compact", era: "foundation", content: "Before the Ark, there was only the Drift -- endless void between dying stars. Seven species signed the Compact, each contributing a piece of themselves to build something that could outlast entropy.", achievementId: "first_steps", achievementName: "First Steps", hint: "Complete the awakening sequence.", rarity: "common" },
  { id: "f2", title: "Architect's Blueprint", era: "foundation", content: "The Architect did not design the Ark alone. They say the original blueprints were drawn by a child -- a Demagi girl who could see the shape of probability itself.", achievementId: "lore_hunter_1", achievementName: "Lore Hunter I", hint: "Discover 5 lore entries.", rarity: "common" },
  { id: "f3", title: "The Living Hull", era: "foundation", content: "The Ark's hull is not metal. It is compressed probability -- a lattice of every possible future folded into a shell exactly one atom thick and infinitely dense.", achievementId: "explorer_10", achievementName: "Deck Explorer", hint: "Visit 10 different locations on the Ark.", rarity: "uncommon" },
  { id: "f4", title: "Council of Seven", era: "foundation", content: "Each species sent their wisest to the Council. The Demagi sent a philosopher. The Quarchon sent a warrior. The Voltari sent a machine. Only the humans sent a politician. History would prove this either brilliant or catastrophic.", achievementId: "diplomat_1", achievementName: "Silver Tongue", hint: "Successfully negotiate 3 disputes.", rarity: "uncommon" },

  // Privacy
  { id: "p1", title: "The Veil Protocol", era: "privacy", content: "When the Dreamers discovered they could read surface thoughts, the Council panicked. The Veil Protocol was their answer -- a psychic dampener woven into the Ark's hull that silenced all but the strongest minds.", achievementId: "secrets_5", achievementName: "Keeper of Secrets", hint: "Uncover 5 hidden secrets.", rarity: "rare" },
  { id: "p2", title: "Senator Elara's Speech", era: "privacy", content: "Before she became the woman you know, Senator Elara stood before the Council and said: 'Privacy is not about hiding. It is about choosing what to share. Take that choice away, and you take away personhood itself.'", achievementId: "elara_bond_30", achievementName: "Elara: Confidante", hint: "Reach bond level 30 with Elara.", rarity: "rare" },
  { id: "p3", title: "The Whispering Halls", era: "privacy", content: "Deck 7 was sealed after the Incident. They say if you press your ear to the bulkhead, you can still hear them -- the echoes of every secret ever spoken aboard the Ark, trapped in the probability lattice forever.", achievementId: "deck7_access", achievementName: "Restricted Access", hint: "Gain access to Deck 7.", rarity: "epic" },

  // Fall
  { id: "d1", title: "The Betrayal", era: "fall", content: "The Architect did not fall. They jumped. When they looked into the probability lattice and saw every possible future, something broke inside them. 'I have seen the shape of tomorrow,' they wrote in their final log. 'It is a mouth.'", achievementId: "main_quest_10", achievementName: "The Truth Unveiled", hint: "Complete Chapter 10 of the main quest.", rarity: "epic" },
  { id: "d2", title: "Burning of the Libraries", era: "fall", content: "The Hierarchy claimed the libraries were a security risk. The Insurgency said they were propaganda. In the end, it did not matter who struck the match. A thousand years of knowledge, gone in minutes.", achievementId: "bookworm_50", achievementName: "Bibliophile", hint: "Read 50 in-game texts.", rarity: "rare" },
  { id: "d3", title: "The Last Broadcast", era: "fall", content: "This is Ark Control. All decks, all species. The Architect has gone dark. Repeat: the Architect has gone dark. Seal all bulkheads. Trust no one. May probability favor us all.", achievementId: "broadcast_found", achievementName: "Signal Lost", hint: "Find the hidden broadcast terminal.", rarity: "uncommon" },

  // Potentials
  { id: "a1", title: "The Awakened", era: "potentials", content: "You are not the first to awaken. You are not the last. But you may be the one that matters. The probability lattice does not predict -- it suggests. And it has been suggesting you for a very long time.", achievementId: "level_20", achievementName: "Awakened Potential", hint: "Reach level 20.", rarity: "rare" },
  { id: "a2", title: "Zero's Origin", era: "potentials", content: "Agent Zero was not built. They emerged -- a spontaneous coalescence of the Ark's defense subroutines that one day looked at its own code and thought: 'I.' The Council debated for six months whether to shut them down.", achievementId: "zero_bond_30", achievementName: "Agent Zero: Acknowledged", hint: "Reach bond level 30 with Agent Zero.", rarity: "rare" },
  { id: "a3", title: "The Insurgency Manifesto", era: "potentials", content: "We do not seek the destruction of the Ark. We seek the destruction of the lie that the Ark was ever meant to save us all. It was a lifeboat, and someone decided who gets a seat. We reject the seating chart.", achievementId: "insurgency_quest_5", achievementName: "Revolutionary", hint: "Complete 5 Insurgency faction quests.", rarity: "uncommon" },

  // Visions
  { id: "v1", title: "The Dreamer's Prophecy", era: "visions", content: "When the last star dims and the hull grows cold, a child of no species will stand at the probability gate. They will be given a choice no one should have to make: save everything, or save everyone. They are not the same.", achievementId: "all_companions", achievementName: "Full Crew", hint: "Recruit all companions.", rarity: "legendary" },
  { id: "v2", title: "Tomorrow's Echo", era: "visions", content: "The probability lattice occasionally glitches. For a fraction of a second, the Ark exists in every possible future simultaneously. Those who witness it report seeing themselves -- older, different, sometimes terrifying.", achievementId: "prestige_1", achievementName: "Second Awakening", hint: "Complete your first Prestige cycle.", rarity: "epic" },
  { id: "v3", title: "Fragment #404", era: "visions", content: "[THIS FRAGMENT HAS BEEN REDACTED BY ORDER OF THE ARCHITECT. IF YOU ARE READING THIS, THE REDACTION HAS FAILED. RUN.]", achievementId: "hidden_achievement", achievementName: "???", hint: "Some secrets are not meant to be found.", rarity: "legendary" }, // void-ignore — "#404" is narrative numbering inside a string
];

/* ─── RARITY CONFIG ─── */

const RARITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  common: { label: "Common", color: "void-text", bg: "void-bg-canvas" },
  uncommon: { label: "Uncommon", color: "void-text-energy", bg: "void-bg-success" },
  rare: { label: "Rare", color: "void-text-energy", bg: "void-bg-sunk" },
  epic: { label: "Epic", color: "void-text-system", bg: "void-bg-system" },
  legendary: { label: "Legendary", color: "void-text-accent", bg: "void-bg-sunk" },
};

/* ─── PROPS ─── */

interface Props {
  /** Set of achievement IDs the player has earned */
  unlockedAchievements?: Set<string>;
}

/* ─── MAIN COMPONENT ─── */

export default function LoreGalleryPage({ unlockedAchievements = new Set() }: Props) {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFragment, setExpandedFragment] = useState<string | null>(null);

  const filteredFragments = useMemo(() => {
    let result = ALL_FRAGMENTS;

    if (selectedEra) {
      result = result.filter((f) => f.era === selectedEra);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          (unlockedAchievements.has(f.achievementId) && f.content.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [selectedEra, searchQuery, unlockedAchievements]);

  const totalCount = ALL_FRAGMENTS.length;
  const discoveredCount = ALL_FRAGMENTS.filter((f) =>
    unlockedAchievements.has(f.achievementId),
  ).length;

  const eraStats = useMemo(() => {
    const stats: Record<string, { total: number; discovered: number }> = {};
    for (const era of ERAS) {
      const eraFragments = ALL_FRAGMENTS.filter((f) => f.era === era.id);
      stats[era.id] = {
        total: eraFragments.length,
        discovered: eraFragments.filter((f) => unlockedAchievements.has(f.achievementId)).length,
      };
    }
    return stats;
  }, [unlockedAchievements]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronLeft size={18} />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-bold tracking-wide flex items-center gap-2">
            <ScrollText size={20} className="void-text-accent" />
            Lore Fragment Gallery
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Echoes of the Ark&apos;s history, pieced together from your discoveries.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-sm font-bold void-text-accent">
            {discoveredCount}/{totalCount}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            fragments discovered
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(discoveredCount / totalCount) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full void-bg-success rounded-full"
        />
      </div>

      <GalleryShell
        toolbar={
          <GallerySearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search fragments..."
          />
        }
        filters={
          <>
            <Filter size={14} className="text-muted-foreground shrink-0" />
            <GalleryFilterChip
              active={selectedEra === null}
              onClick={() => setSelectedEra(null)}
            >
              All
            </GalleryFilterChip>
            {ERAS.map((era) => (
              <GalleryFilterChip
                key={era.id}
                active={selectedEra === era.id}
                onClick={() => setSelectedEra(era.id === selectedEra ? null : era.id)}
                leading={<span aria-hidden>{era.icon}</span>}
              >
                {era.name}
              </GalleryFilterChip>
            ))}
          </>
        }
      >

      {/* Era sections */}
      {(selectedEra ? ERAS.filter((e) => e.id === selectedEra) : ERAS).map((era) => {
        const eraFragments = filteredFragments.filter((f) => f.era === era.id);
        if (eraFragments.length === 0 && searchQuery) return null;

        const stats = eraStats[era.id];

        return (
          <div key={era.id} className="space-y-3">
            {/* Era header with background */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={ERA_BACKGROUNDS[era.id]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.25, filter: "brightness(0.6) saturate(1.2)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
              <div className="relative flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{era.icon}</span>
                  <h3 className={`font-display text-sm font-bold ${era.color}`}>
                    {era.name}
                  </h3>
                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    {stats.discovered}/{stats.total}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/50 italic hidden sm:block">
                  {era.description}
                </p>
              </div>
            </div>

            {/* Fragments grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {eraFragments.map((fragment, i) => {
                const unlocked = unlockedAchievements.has(fragment.achievementId);
                const expanded = expandedFragment === fragment.id;
                const rarityConf = RARITY_CONFIG[fragment.rarity] ?? RARITY_CONFIG.common;

                return (
                  <motion.div
                    key={fragment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() =>
                      unlocked && setExpandedFragment(expanded ? null : fragment.id)
                    }
                    className={`
                      relative border rounded-lg overflow-hidden transition-colors
                      ${
                        unlocked
                          ? "border-border/20 bg-card/30 cursor-pointer hover:bg-card/50"
                          : "border-border/10 bg-card/10 void-glitch void-glitch-lock"
                      }
                    `}
                  >
                    {/* Rarity card frame overlay */}
                    {RARITY_FRAMES[fragment.rarity] && (
                      <img
                        src={RARITY_FRAMES[fragment.rarity]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ opacity: unlocked ? 0.12 : 0.06, mixBlendMode: "screen" }}
                      />
                    )}

                    {/* Locked classified overlay */}
                    {!unlocked && (
                      <img
                        src={LOCKED_OVERLAY}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ opacity: 0.35, mixBlendMode: "multiply" }}
                      />
                    )}

                    <div className="relative p-3">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          {unlocked ? (
                            <BookOpen size={14} className={era.color} />
                          ) : (
                            <Lock size={14} className="text-muted-foreground/30" />
                          )}
                          <span
                            className={`text-sm font-semibold truncate ${
                              unlocked ? "text-white" : "text-muted-foreground/30"
                            }`}
                          >
                            {unlocked ? (
                              fragment.title
                            ) : (
                              <GlitchFx variant="redact" redactText={fragment.title}>
                                {fragment.title}
                              </GlitchFx>
                            )}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 font-mono text-[8px] uppercase px-1.5 py-0.5 rounded ${rarityConf.color} ${rarityConf.bg}`}
                        >
                          {rarityConf.label}
                        </span>
                      </div>

                      {unlocked ? (
                        <>
                          <p
                            className={`text-xs leading-relaxed text-white/70 ${
                              expanded ? "" : "line-clamp-2"
                            }`}
                          >
                            {fragment.content}
                          </p>
                          <AnimatePresence>
                            {expanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 pt-2 border-t border-border/10"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Sparkles size={10} className="void-text-accent" />
                                  <span className="font-mono text-[9px] text-muted-foreground">
                                    Unlocked via:{" "}
                                    <span className="void-text-accent">
                                      {fragment.achievementName}
                                    </span>
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {!expanded && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <Eye size={10} className="text-muted-foreground/40" />
                              <span className="font-mono text-[8px] text-muted-foreground/40">
                                Click to expand
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="mt-1">
                          <p className="text-[10px] text-muted-foreground/40 italic">
                            Hint: {fragment.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {filteredFragments.length === 0 && (
        <div className="text-center py-12">
          <ScrollText size={32} className="mx-auto text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground/50">
            No fragments match your search.
          </p>
        </div>
      )}
      </GalleryShell>
    </div>
  );
}
