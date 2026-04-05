/* ═══════════════════════════════════════════════════════
   APPRENTICE PAGE

   Player's Sith/Jedi-style custom companion management.
   Candidates are rolled via RNG (12 archetypes × 3 genders ×
   6 races × 6 classes × 5 rarities). Player names them and
   sends them to Celebration for the 4-week trial.

   Only one apprentice at a time. Old must die before new.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Sparkles, Skull, Award, AlertTriangle, RefreshCw, Heart, Zap,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  generateApprentice,
  getArchetypeDef,
  getRarityTier,
  getActiveLoyaltyBonus,
  type Apprentice,
  type Rarity,
} from "@shared/apprentices";

const STAGE_LABELS: Record<string, string> = {
  recruited: "Recruited",
  training: "In Celebration Trial",
  graduated: "Graduated",
  companion: "Aboard the Ark",
  fallen: "Fallen",
  corrupted: "Corrupted",
  betrayed: "Betrayed You",
};

const RARITY_BG: Record<Rarity, string> = {
  common: "from-slate-500/10 to-slate-600/5 border-slate-400/30",
  uncommon: "from-emerald-500/10 to-green-600/5 border-emerald-400/40",
  rare: "from-blue-500/10 to-indigo-600/5 border-blue-400/50",
  epic: "from-purple-500/10 to-fuchsia-600/5 border-purple-400/60",
  mythic: "from-amber-500/15 to-orange-600/10 border-amber-400/70 shadow-amber-400/20 shadow-lg",
};

export default function ApprenticePage() {
  const { state, setApprentice, recordFallenApprentice } = useGame();
  const currentApprentice = state.apprentice as Apprentice | null;
  const fallen = (state.apprenticeFallen as Apprentice[]) ?? [];
  const [candidate, setCandidate] = useState<Apprentice | null>(null);
  const [nameInput, setNameInput] = useState("");

  const rollCandidate = () => {
    const app = generateApprentice();
    setCandidate(app);
    setNameInput(app.name);
  };

  const confirmRecruit = () => {
    if (!candidate) return;
    const final: Apprentice = { ...candidate, name: nameInput || candidate.name };
    setApprentice(final);
    setCandidate(null);
    setNameInput("");
  };

  const rerollCandidate = () => {
    rollCandidate();
  };

  const handleFallen = () => {
    if (!currentApprentice) return;
    const updated: Apprentice = {
      ...currentApprentice,
      alive: false,
      stage: "fallen",
      deathRecord: { day: currentApprentice.trialDay, cause: "Marked as fallen by player" },
    };
    recordFallenApprentice(updated);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Sparkles size={18} className="text-amber-400" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">THE APPRENTICE</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              Your chosen · sent to Celebration · trained in survival · earned as companion
            </p>
          </div>
        </div>

        {/* Current apprentice OR recruitment */}
        {currentApprentice ? (
          <CurrentApprenticeCard app={currentApprentice} onMarkFallen={handleFallen} />
        ) : candidate ? (
          <CandidateReview
            candidate={candidate}
            nameInput={nameInput}
            onNameChange={setNameInput}
            onConfirm={confirmRecruit}
            onReroll={rerollCandidate}
            onCancel={() => setCandidate(null)}
          />
        ) : (
          <EmptyRecruitState onRoll={rollCandidate} hasFallen={fallen.length > 0} />
        )}

        {/* Fallen history */}
        {fallen.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Skull size={14} className="text-zinc-500" />
              <span className="font-display text-xs font-bold tracking-[0.2em] text-zinc-400">
                FALLEN ({fallen.length})
              </span>
            </div>
            <div className="space-y-1.5">
              {fallen.slice(-5).reverse().map(app => (
                <FallenApprenticeRow key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ─── */
function EmptyRecruitState({ onRoll, hasFallen }: { onRoll: () => void; hasFallen: boolean }) {
  return (
    <div className="text-center py-12 border border-dashed border-border/40 rounded-lg bg-card/20">
      <Sparkles size={32} className="mx-auto text-amber-400/40 mb-3" />
      <h2 className="font-display text-sm font-bold tracking-wider text-foreground mb-1">
        {hasFallen ? "No Living Apprentice" : "No Apprentice Yet"}
      </h2>
      <p className="font-mono text-[10px] text-muted-foreground/70 mb-4 max-w-md mx-auto">
        {hasFallen
          ? "The old one fell. You can train another. The Dreamer watches. Celebration waits."
          : "Train a candidate of your choosing. Send them to Celebration. If they survive the four-week trial, they join your ship."}
      </p>
      <button
        onClick={onRoll}
        className="px-4 py-2 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-[11px] uppercase tracking-wider hover:bg-amber-500/20 transition-all inline-flex items-center gap-2"
        data-testid="roll-apprentice"
      >
        <Sparkles size={12} /> Roll a Candidate
      </button>
    </div>
  );
}

/* ─── CANDIDATE REVIEW ─── */
function CandidateReview({ candidate, nameInput, onNameChange, onConfirm, onReroll, onCancel }: {
  candidate: Apprentice;
  nameInput: string;
  onNameChange: (s: string) => void;
  onConfirm: () => void;
  onReroll: () => void;
  onCancel: () => void;
}) {
  const def = getArchetypeDef(candidate.archetype);
  const tier = getRarityTier(candidate.rarity);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 bg-gradient-to-br ${RARITY_BG[candidate.rarity]}`}
      data-testid="candidate-review"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 rounded border"
          style={{ color: tier.color, borderColor: `${tier.color}60` }}
        >
          {tier.name}{tier.specialTrait ? ` · ${tier.specialTrait}` : ""}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {candidate.gender} · {candidate.race} · {candidate.combatClass}
        </span>
      </div>

      {/* Name input */}
      <div className="mb-3">
        <label className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
          Name them
        </label>
        <input
          type="text"
          value={nameInput}
          onChange={e => onNameChange(e.target.value)}
          className="w-full px-3 py-2 rounded border border-border/40 bg-background/60 font-display text-lg font-bold tracking-wider text-foreground focus:border-amber-500/60 focus:outline-none"
          data-testid="apprentice-name-input"
          maxLength={40}
        />
        <p className="font-mono text-[9px] italic text-amber-400/70 mt-1">{def.title}</p>
      </div>

      {/* Archetype */}
      <div className="mb-3 p-2.5 rounded border border-border/30 bg-background/30">
        <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400 block mb-1">
          {def.name}
        </span>
        <p className="font-mono text-[10px] text-foreground/80 leading-relaxed">{def.personality}</p>
        <p className="font-mono text-[9px] italic text-muted-foreground/60 mt-1">
          Voice: {def.voiceDirection}
        </p>
      </div>

      {/* Backstory */}
      <div className="mb-3 p-2.5 rounded border border-border/30 bg-background/30">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
          Backstory
        </span>
        <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed">{candidate.backstory}</p>
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-4 gap-1.5">
        <StatCard label="STR" value={candidate.stats.strength} primary={def.primaryStat === "strength"} />
        <StatCard label="INT" value={candidate.stats.intelligence} primary={def.primaryStat === "intelligence"} />
        <StatCard label="AGI" value={candidate.stats.agility} primary={def.primaryStat === "agility"} />
        <StatCard label="CHA" value={candidate.stats.charisma} primary={def.primaryStat === "charisma"} />
      </div>

      {/* Loyalty bonus */}
      <div className="mb-3 p-2 rounded border border-emerald-500/30 bg-emerald-500/5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 block mb-0.5">
          ▸ Loyalty Bonus (at bond 40+)
        </span>
        <p className="font-mono text-[10px] text-foreground/90">
          {def.loyaltyBonus.label} <span className="text-emerald-300">(×{tier.loyaltyMultiplier} rarity)</span>
        </p>
      </div>

      {/* Corruption risk */}
      <div className="mb-3 p-2 rounded border border-red-500/30 bg-red-500/5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <AlertTriangle size={10} className="text-red-400" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-red-400">
            Corruption Risk: {Math.round(def.corruptionRisk * 100)}%
          </span>
        </div>
        <p className="font-mono text-[9px] italic text-foreground/70">
          Breaking point: {def.breakingPoint}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 px-3 py-2 rounded border border-amber-500/50 bg-amber-500/15 text-amber-300 font-mono text-[11px] uppercase tracking-wider hover:bg-amber-500/25"
          data-testid="confirm-recruit"
        >
          Take {nameInput || candidate.name} as Apprentice
        </button>
        <button
          onClick={onReroll}
          className="px-3 py-2 rounded border border-border/40 text-muted-foreground font-mono text-[11px] uppercase tracking-wider hover:bg-muted/20 flex items-center gap-1"
          data-testid="reroll-apprentice"
        >
          <RefreshCw size={11} /> Re-roll
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded border border-border/40 text-muted-foreground/60 font-mono text-[11px] uppercase tracking-wider hover:bg-muted/10"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, primary }: { label: string; value: number; primary?: boolean }) {
  return (
    <div className={`text-center p-2 rounded border ${primary ? "border-amber-500/40 bg-amber-500/5" : "border-border/30 bg-background/40"}`}>
      <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/60">{label}</div>
      <div className={`font-display text-lg font-bold tabular-nums ${primary ? "text-amber-300" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

/* ─── CURRENT APPRENTICE CARD ─── */
function CurrentApprenticeCard({ app, onMarkFallen }: { app: Apprentice; onMarkFallen: () => void }) {
  const def = getArchetypeDef(app.archetype);
  const tier = getRarityTier(app.rarity);
  const loyaltyBonus = getActiveLoyaltyBonus(app);
  return (
    <div className={`border rounded-lg p-4 bg-gradient-to-br ${RARITY_BG[app.rarity]}`} data-testid="current-apprentice">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-display text-xl font-bold tracking-wider text-foreground">{app.name}</h2>
          <p className="font-mono text-[9px] italic text-amber-400/80">{def.title} · {def.name}</p>
        </div>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 rounded border"
          style={{ color: tier.color, borderColor: `${tier.color}60` }}
        >
          {tier.name}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Stat icon={Heart} label="Bond" value={`${app.bond}/100`} color={app.bond >= 40 ? "text-emerald-400" : "text-yellow-400"} />
        <Stat icon={AlertTriangle} label="Corruption" value={`${app.corruption}/100`} color={app.corruption >= 50 ? "text-red-400" : app.corruption >= 20 ? "text-orange-400" : "text-muted-foreground"} />
        <Stat icon={Award} label="Stage" value={STAGE_LABELS[app.stage] ?? app.stage} color="text-purple-400" />
        <Stat icon={Zap} label="Trial Day" value={`${app.trialDay}/28`} color="text-blue-400" />
      </div>

      {/* Stats mini */}
      <div className="mb-3 grid grid-cols-4 gap-1.5">
        <StatCard label="STR" value={app.stats.strength} primary={def.primaryStat === "strength"} />
        <StatCard label="INT" value={app.stats.intelligence} primary={def.primaryStat === "intelligence"} />
        <StatCard label="AGI" value={app.stats.agility} primary={def.primaryStat === "agility"} />
        <StatCard label="CHA" value={app.stats.charisma} primary={def.primaryStat === "charisma"} />
      </div>

      {loyaltyBonus && (
        <div className="p-2 rounded border border-emerald-500/30 bg-emerald-500/5 mb-3">
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 block mb-0.5">
            Loyalty Bonus Active
          </span>
          <p className="font-mono text-[10px] text-foreground/90">{loyaltyBonus.label}</p>
        </div>
      )}

      <p className="font-mono text-[9px] italic text-muted-foreground/70 mb-3 leading-relaxed">
        {app.backstory}
      </p>

      <div className="flex items-center justify-end">
        <button
          onClick={onMarkFallen}
          className="px-3 py-1.5 rounded border border-red-500/30 text-red-400/70 font-mono text-[9px] uppercase tracking-wider hover:bg-red-500/10"
          data-testid="mark-fallen"
        >
          <Skull size={10} className="inline mr-1" /> Mark as Fallen
        </button>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded border border-border/30 bg-background/30">
      <Icon size={12} className={color} />
      <div>
        <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/60">{label}</div>
        <div className={`font-display text-sm font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}

/* ─── FALLEN ROW ─── */
function FallenApprenticeRow({ app }: { app: Apprentice }) {
  const tier = getRarityTier(app.rarity);
  const def = getArchetypeDef(app.archetype);
  return (
    <div className="flex items-center justify-between p-2 rounded border border-border/20 bg-background/20 opacity-70">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-bold text-foreground/80 truncate">{app.name}</span>
          <span
            className="font-mono text-[8px] uppercase tracking-wider px-1 rounded"
            style={{ color: tier.color, backgroundColor: `${tier.color}10` }}
          >
            {tier.name}
          </span>
          <span className="font-mono text-[8px] text-muted-foreground/60 truncate">
            {def.name}
          </span>
        </div>
        <p className="font-mono text-[8px] text-muted-foreground/50 mt-0.5">
          {app.deathRecord?.cause ?? "Fallen"} {app.deathRecord?.day ? `· Day ${app.deathRecord.day}` : ""}
        </p>
      </div>
    </div>
  );
}
