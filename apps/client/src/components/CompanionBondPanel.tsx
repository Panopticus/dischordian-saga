/* ═══════════════════════════════════════════════════════
   COMPANION BOND PANEL

   BioWare-style companion relationship display.
   Shows bond level, evolution stage, injury, morality
   dissonance, active quests, and recent thoughts.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, Swords, AlertTriangle, Skull, Award, Sparkles } from "lucide-react";
import {
  DEFAULT_PET_BOND,
  getEvolutionStage,
  getPetStatus,
  calculateMoralityDissonance,
  canPetLeave,
  PET_EVOLUTIONS,
  PET_QUESTS,
  type PetBond,
} from "@/game/petBonding";

interface Props {
  petId: string;
  petName: string;
  bond?: Partial<PetBond>;
  moralityScore?: number;
}

const EVOLUTION_LABELS = ["Hatchling", "Companion", "Ascended"];
const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  healthy: { color: "void-text-energy", bg: "void-bg-success" },
  wounded: { color: "void-text-premium", bg: "void-bg-sunk" },
  injured: { color: "void-text-premium", bg: "void-bg-sunk" },
  critical: { color: "void-text-error", bg: "void-bg-error" },
  dying: { color: "void-text-error", bg: "void-bg-error" },
  dead: { color: "void-text", bg: "void-bg-canvas" },
};

export default function CompanionBondPanel({ petId, petName, bond, moralityScore = 0 }: Props) {
  const b: PetBond = useMemo(() => ({
    petId,
    ...DEFAULT_PET_BOND,
    ...bond,
  }), [petId, bond]);

  const evolutionStage = getEvolutionStage(b.bond, b.sharedMissions, b.completedQuests.length);
  const status = getPetStatus(b.injury);
  const statusStyle = STATUS_COLORS[status] ?? STATUS_COLORS.healthy;
  const dissonance = calculateMoralityDissonance(petId, moralityScore);
  const willLeave = canPetLeave(dissonance, b.bond);

  const availableQuests = PET_QUESTS.filter(q =>
    b.bond >= q.bondRequired && !b.completedQuests.includes(q.id)
  );

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Heart size={16} className="void-text-error" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">
            {petName.toUpperCase()} · BOND
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusStyle.color} ${statusStyle.bg} border-current`}>
            {status}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider void-text-system">
            {EVOLUTION_LABELS[evolutionStage - 1]}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Bond bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">Bond</span>
            <span className="font-mono text-[10px] text-foreground tabular-nums">{b.bond}/100</span>
          </div>
          <div className="h-1.5 void-bg-canvas rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${b.bond}%` }}
              className="h-full bg-gradient-to-r from-rose-500 to-pink-400"
            />
          </div>
          {/* Bond milestones */}
          <div className="flex justify-between mt-0.5 px-0.5">
            {[20, 50, 80].map(m => (
              <span key={m} className={`font-mono text-[7px] ${b.bond >= m ? "void-text-error" : "text-muted-foreground/30"}`}>
                {m === 20 ? "first thought" : m === 50 ? "secret shared" : "life pledged"}
              </span>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={Swords} label="Missions" value={b.sharedMissions.toString()} />
          <Stat icon={Award} label="Quests" value={`${b.completedQuests.length}/${PET_QUESTS.length}`} />
          <Stat icon={Skull} label="Deaths" value={b.deathCount.toString()} valueColor={b.deathCount > 0 ? "void-text-error" : undefined} />
        </div>

        {/* Injury bar if injured */}
        {b.injury > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] uppercase tracking-wider void-text-premium">Injury</span>
              <span className="font-mono text-[10px] void-text-premium tabular-nums">{b.injury}/100</span>
            </div>
            <div className="h-1 void-bg-canvas rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500" style={{ width: `${b.injury}%` }} />
            </div>
          </div>
        )}

        {/* Morality dissonance */}
        {dissonance > 10 && (
          <div className={`p-2 rounded border ${willLeave ? "void-border-error void-bg-error" : "void-border void-bg-sunk"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <AlertTriangle size={10} className={willLeave ? "void-text-error" : "void-text-premium"} />
              <span className={`font-mono text-[9px] uppercase tracking-wider ${willLeave ? "void-text-error" : "void-text-premium"}`}>
                Morality Dissonance: {Math.round(dissonance)}
              </span>
            </div>
            <p className="font-mono text-[9px] text-foreground/70 leading-relaxed">
              {willLeave
                ? `${petName} is considering leaving. Your choices have drifted too far from their nature.`
                : `${petName} disagrees with some of your choices but still walks with you.`}
            </p>
          </div>
        )}

        {/* Available quests */}
        {availableQuests.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={10} className="void-text-accent" />
              <span className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
                Companion Quests Available ({availableQuests.length})
              </span>
            </div>
            <div className="space-y-1">
              {availableQuests.slice(0, 3).map(q => (
                <div key={q.id} className="p-1.5 rounded border void-border void-bg-sunk">
                  <span className="font-mono text-[10px] font-bold text-foreground block">{q.name}</span>
                  <p className="font-mono text-[9px] text-muted-foreground/70 leading-relaxed">{q.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next evolution */}
        {evolutionStage < 3 && (
          <div className="pt-2 border-t border-border/20">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-0.5">
              Next Evolution: {EVOLUTION_LABELS[evolutionStage]}
            </span>
            <p className="font-mono text-[9px] text-muted-foreground/60 leading-relaxed">
              {PET_EVOLUTIONS[evolutionStage]
                ? `Requires Bond ${PET_EVOLUTIONS[evolutionStage].requirements.bond}, ${PET_EVOLUTIONS[evolutionStage].requirements.sharedMissions} missions, ${PET_EVOLUTIONS[evolutionStage].requirements.questsCompleted} quests`
                : "Continue bonding and questing together."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, valueColor }: { icon: any; label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-1.5 rounded border border-border/20 bg-background/30">
      <Icon size={10} className="text-muted-foreground/60" />
      <span className={`font-mono text-[11px] font-bold tabular-nums ${valueColor ?? "text-foreground"}`}>{value}</span>
      <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">{label}</span>
    </div>
  );
}
