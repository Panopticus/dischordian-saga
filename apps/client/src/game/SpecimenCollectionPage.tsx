/* ═══════════════════════════════════════════════════════
   SPECIMEN COLLECTION PAGE — The Collector's Archive
   Player's collected companions UI with filter tabs,
   rarity borders, and detail modal.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, X, Lock } from "lucide-react";
import { SPECIMENS, type SpecimenId, type EvolutionStage, getSpecimenArtPath } from "./arkSpecimens";
import { ARCHON_SPECIMENS, NEYON_SPECIMENS, type ExpandedSpecimenDef } from "./specimenExpansion";
import LiveSpecimen from "@/components/LiveSpecimen";
import { VoidTile } from "@/components/void";
import {
  EIDOLON_CLASSES,
  EIDOLON_CLASS_META,
  EIDOLON_ALIGNMENTS,
  EIDOLON_STAGES,
  getEidolonArt,
  STRAIN_ART,
} from "@/data/nanobanna2Assets";

type FilterTab = "all" | "owned" | "faction" | "archon" | "neyon" | "eidolon" | "strain";

const ALIGNMENT_LABEL: Record<string, string> = {
  norm: "Standard",
  hier: "Hierarchy",
  dream: "Dreamer",
  scar: "Scarred",
};

const STAGE_LABEL: Record<string, string> = {
  frag: "Fragment",
  comp: "Companion",
  asc: "Ascended",
};

const STAGE_RARITY: Record<string, UnifiedSpecimen["rarity"]> = {
  frag: "common",
  comp: "rare",
  asc: "epic",
};

const RARITY_BORDERS: Record<string, string> = {
  common: "void-border shadow-[0_0_12px_rgba(156,163,175,0.4)]",
  rare: "void-border shadow-[0_0_16px_color-mix(in oklch, var(--electric-blue) 50%, transparent)]",
  epic: "void-border-system shadow-[0_0_20px_color-mix(in oklch, var(--energy-system) 60%, transparent)]",
  legendary: "void-border shadow-[0_0_24px_rgba(250,204,21,0.7)]",
  mythic: "void-border-error shadow-[0_0_28px_rgba(244,114,182,0.8)]",
};

const RARITY_TEXT: Record<string, string> = {
  common: "void-text", rare: "void-text-energy", epic: "void-text-system",
  legendary: "void-text-premium", mythic: "void-text-error",
};

interface UnifiedSpecimen {
  id: string;
  name: string;
  associatedWith: string;
  associationType: "archon" | "neyon" | "faction" | "eidolon" | "strain";
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  bonus: string;
  acquisition: string;
  lore: string;
  /** Direct image path override (used for eidolons/strain which don't live in SPECIMENS) */
  artPath?: string;
  /** Always render un-greyed (reference gallery entries) */
  alwaysOwned?: boolean;
}

function buildUnifiedList(): UnifiedSpecimen[] {
  const factionBase: UnifiedSpecimen[] = Object.values(SPECIMENS).map(s => ({
    id: s.id, name: s.name, associatedWith: s.factionNPC, associationType: "faction",
    description: s.description,
    rarity: "rare",
    bonus: s.bonus.description,
    acquisition: s.evolutionMethod,
    lore: s.appearance.ascended,
  }));
  const expandedMap = (arr: ExpandedSpecimenDef[]): UnifiedSpecimen[] => arr.map(s => ({
    id: s.id, name: s.name, associatedWith: s.associatedWith, associationType: s.associationType,
    description: s.description, rarity: s.rarity,
    bonus: `+${s.bonus.value}${s.bonus.percent ? "%" : ""} ${s.bonus.stat.replace(/_/g, " ")}`,
    acquisition: describeAcquisition(s.acquisition),
    lore: s.description,
  }));

  // Eidolons: 5 species × 4 alignments × 3 stages = 60 forms
  const eidolonEntries: UnifiedSpecimen[] = [];
  for (const cls of EIDOLON_CLASSES) {
    const meta = EIDOLON_CLASS_META[cls];
    for (const alignment of EIDOLON_ALIGNMENTS) {
      for (const stage of EIDOLON_STAGES) {
        eidolonEntries.push({
          id: `eidolon_${cls}_${alignment}_${stage}`,
          name: `${meta.name} — ${ALIGNMENT_LABEL[alignment]} (${STAGE_LABEL[stage]})`,
          associatedWith: meta.class,
          associationType: "eidolon",
          description: `${meta.title}. ${ALIGNMENT_LABEL[alignment]} alignment, ${STAGE_LABEL[stage]} stage.`,
          rarity: STAGE_RARITY[stage],
          bonus: `${meta.class} class signature`,
          acquisition: "Collector's Archive reference form",
          lore: `${meta.name} takes many shapes. Aligned with ${ALIGNMENT_LABEL[alignment]}, this ${STAGE_LABEL[stage].toLowerCase()} form embodies the ${meta.class.toLowerCase()}'s path.`,
          artPath: getEidolonArt(cls, alignment, stage),
          alwaysOwned: true,
        });
      }
    }
  }

  // STRAIN: 12 forms (4 alignments × 3 stages)
  const strainEntries: UnifiedSpecimen[] = [];
  for (const alignment of EIDOLON_ALIGNMENTS) {
    for (const stage of EIDOLON_STAGES) {
      const key = `${alignment}-${stage}`;
      strainEntries.push({
        id: `strain_${alignment}_${stage}`,
        name: `STRAIN — ${ALIGNMENT_LABEL[alignment]} (${STAGE_LABEL[stage]})`,
        associatedWith: "The Living Infection",
        associationType: "strain",
        description: `The STRAIN adapts to every host. ${ALIGNMENT_LABEL[alignment]} host, ${STAGE_LABEL[stage]} incubation.`,
        rarity: stage === "asc" ? "legendary" : stage === "comp" ? "epic" : "rare",
        bonus: "Adaptive — mutates to resist the host's weaknesses",
        acquisition: "Collector's Archive reference form",
        lore: `Neither companion nor parasite. The ${ALIGNMENT_LABEL[alignment]} STRAIN has learned from its host — and learned how to return the lesson.`,
        artPath: STRAIN_ART[key],
        alwaysOwned: true,
      });
    }
  }

  return [
    ...factionBase,
    ...expandedMap(ARCHON_SPECIMENS),
    ...expandedMap(NEYON_SPECIMENS),
    ...eidolonEntries,
    ...strainEntries,
  ];
}

function describeAcquisition(a: ExpandedSpecimenDef["acquisition"]): string {
  switch (a.type) {
    case "starter": return `Starter companion (${a.species.join(", ")})`;
    case "cloning_pod": return `Cloning pod — ${a.chance}% daily chance`;
    case "npc_gift": return `Gift from ${a.npcId} at Trust ${a.trustRequired}`;
    case "game_mastery": return `${a.game}: ${a.requirement}`;
    case "card_pack": return `Card pack pull — ${a.chance}% chance`;
    case "event": return `Limited-time event: ${a.eventId}`;
    case "casino_jackpot": return "Casino jackpot reward";
    case "prestige": return `Prestige level ${a.level}`;
    case "achievement_chain": return `Achievement chain: ${a.chainId}`;
  }
}

function getOwnedStage(id: string): EvolutionStage {
  try {
    const raw = localStorage.getItem(`specimen_stage_${id}`);
    if (raw === "ascended" || raw === "companion" || raw === "fragment") return raw;
  } catch { /* ignore */ }
  return "companion"; // default display stage
}

export default function SpecimenCollectionPage() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<UnifiedSpecimen | null>(null);

  const ownedSpecimens: string[] = useMemo(() => {
    try {
      const raw = localStorage.getItem("owned_specimens");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }, []);

  // Gating: cryo-bay discovery
  const cryoBayDiscovered = useMemo(() => {
    try {
      const flags = JSON.parse(localStorage.getItem("narrative_flags") || "{}");
      return flags["cryo_bay_discovered"] || flags["cryo_bay_visited"] || ownedSpecimens.length > 0;
    } catch { return ownedSpecimens.length > 0; }
  }, [ownedSpecimens]);

  const allSpecimens = useMemo(() => buildUnifiedList(), []);
  const ownedSet = useMemo(() => new Set(ownedSpecimens), [ownedSpecimens]);

  const filtered = useMemo(() => {
    return allSpecimens.filter(s => {
      if (filter === "owned") return ownedSet.has(s.id) || s.alwaysOwned;
      if (filter === "faction") return s.associationType === "faction";
      if (filter === "archon") return s.associationType === "archon";
      if (filter === "neyon") return s.associationType === "neyon";
      if (filter === "eidolon") return s.associationType === "eidolon";
      if (filter === "strain") return s.associationType === "strain";
      return true;
    });
  }, [allSpecimens, filter, ownedSet]);

  if (!cryoBayDiscovered) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <Lock className="w-16 h-16 mx-auto void-text-energy" />
          <h1 className="text-2xl font-bold tracking-widest">COLLECTION LOCKED</h1>
          <p className="void-text">The Collector's Archive requires discovery of the Cryo Bay first.</p>
          <button onClick={() => navigate("/ark")} className="px-6 py-2 border void-border-success void-text-energy void-bg-success transition">
            Return to Ark
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" }, { id: "owned", label: "Owned" },
    { id: "faction", label: "Faction" }, { id: "archon", label: "Archon" },
    { id: "neyon", label: "Ne-Yon" },
    { id: "eidolon", label: "Eidolons" },
    { id: "strain", label: "STRAIN" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a18] to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b void-border-success pb-4">
          <button onClick={() => navigate("/ark")} className="flex items-center gap-2 void-text-energy void-text-energy" data-testid="back-to-ark">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-bold tracking-[0.2em] void-text-energy">THE COLLECTOR'S ARCHIVE</h1>
            <p className="text-xs void-text mt-1">Living DNA templates • Resurrection Protocols</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold void-text-energy" data-testid="collection-counter">
              {ownedSet.size}/{allSpecimens.filter(s => !s.alwaysOwned).length}
            </div>
            <div className="text-xs void-text uppercase tracking-wider">Collected</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              data-testid={`filter-${t.id}`}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition border ${
                filter === t.id
                  ? "void-bg-success void-border-success void-text-energy"
                  : "void-border void-text void-border"
              }`}
            >{t.label}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((s, idx) => {
              const owned = ownedSet.has(s.id) || !!s.alwaysOwned;
              return (
                <VoidTile
                  key={s.id}
                  onClick={() => setSelected(s)}
                  data-testid={`specimen-card-${s.id}`}
                  className={`relative p-4 text-left ${RARITY_BORDERS[s.rarity]} ${!owned ? "opacity-40 grayscale" : ""}`}
                >
                  <div className="aspect-square mb-3 bg-gradient-to-br from-gray-900 to-black border void-border rounded flex items-center justify-center overflow-hidden">
                    {owned && s.artPath ? (
                      <img
                        src={s.artPath}
                        alt={s.name}
                        className="w-full h-full object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : owned && (s.id as string) in SPECIMENS ? (
                      <LiveSpecimen
                        specimenId={s.id as SpecimenId}
                        stage={getOwnedStage(s.id)}
                        size="sm"
                        interactive={false}
                        showThoughts={false}
                      />
                    ) : owned ? (
                      <img
                        src={getSpecimenArtPath(s.id, "companion")}
                        alt={s.name}
                        className="w-16 h-16 object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="text-4xl void-text">???</div>
                    )}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${owned ? "text-white" : "void-text"}`}>
                    {owned ? s.name : "???"}
                  </h3>
                  <p className="text-[10px] void-text uppercase tracking-wider truncate">
                    {owned ? s.associatedWith.replace(/_/g, " ") : "Unknown"}
                  </p>
                  <p className={`text-[10px] mt-1 uppercase tracking-wider ${RARITY_TEXT[s.rarity]}`}>
                    {s.rarity}
                  </p>
                </VoidTile>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`max-w-2xl w-full bg-[#0a0a18] border-2 rounded-lg p-6 ${RARITY_BORDERS[selected.rarity]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{(ownedSet.has(selected.id) || selected.alwaysOwned) ? selected.name : "???"}</h2>
                  <p className={`text-sm uppercase tracking-wider ${RARITY_TEXT[selected.rarity]}`}>
                    {selected.rarity} • {selected.associationType}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="void-text hover:text-white" data-testid="close-modal">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Live specimen display in modal */}
              {ownedSet.has(selected.id) && (selected.id as string) in SPECIMENS && (
                <div className="flex justify-center my-4">
                  <LiveSpecimen
                    specimenId={selected.id as SpecimenId}
                    stage={getOwnedStage(selected.id)}
                    size="xl"
                    interactive={true}
                    showThoughts={true}
                    bond={75}
                  />
                </div>
              )}
              {/* Static art display for eidolon/strain reference forms */}
              {selected.alwaysOwned && selected.artPath && (
                <div className="flex justify-center my-4">
                  <img
                    src={selected.artPath}
                    alt={selected.name}
                    className="max-h-80 w-auto object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
              {(ownedSet.has(selected.id) || selected.alwaysOwned) ? (
                <div className="space-y-3 text-sm">
                  <div><span className="void-text uppercase text-xs">Associated With: </span><span className="void-text-energy">{selected.associatedWith}</span></div>
                  <div><span className="void-text uppercase text-xs">Description: </span><p className="void-text mt-1">{selected.description}</p></div>
                  <div><span className="void-text uppercase text-xs">Bonus: </span><span className="void-text-energy">{selected.bonus}</span></div>
                  <div><span className="void-text uppercase text-xs">How to Obtain: </span><p className="void-text-accent mt-1">{selected.acquisition}</p></div>
                  <div className="pt-3 border-t void-border"><span className="void-text uppercase text-xs">Lore: </span><p className="void-text italic mt-1">{selected.lore}</p></div>
                </div>
              ) : (
                <p className="void-text italic">This specimen has not yet been discovered. Continue your journey through the Ark to unlock its template.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
