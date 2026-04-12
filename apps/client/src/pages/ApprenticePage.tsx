/* ═══════════════════════════════════════════════════════
   APPRENTICE PAGE

   Player's Sith/Jedi-style custom companion management.
   Candidates are rolled via RNG (12 archetypes × 3 genders ×
   6 races × 6 classes × 5 rarities). Player names them and
   sends them to Celebration for the 4-week trial.

   Only one apprentice at a time. Old must die before new.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect } from "react";
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
import {
  generateDailyDecision,
  rollForDeath,
  computeTrialPacing,
  TRIAL_LENGTH_DAYS,
  type DecisionOption,
} from "@shared/celebrationTrial";
import { getMascoteer } from "@shared/mascoteers";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import {
  getBetrayalStage,
  generateBetrayalEvent,
  type BetrayalChoice,
  type BetrayalEvent,
} from "@shared/apprenticeBetrayal";
import { computeDailyCorruption } from "@shared/apprentices";
import { getBattleForDay, type CycleBattle } from "@shared/cycleBattles";
import SongSlideshow from "@/components/SongSlideshow";
import {
  WELCOME_TO_CELEBRATION_FRAMES,
  WELCOME_TO_CELEBRATION_TITLE,
  WELCOME_TO_CELEBRATION_AUDIO,
} from "@/data/celebrationSlideshow";

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
  const { state, setApprentice, recordFallenApprentice, addGraduate, addTrialHistoryEntry } = useGame();
  const currentApprentice = state.apprentice as Apprentice | null;
  const fallen = (state.apprenticeFallen as Apprentice[]) ?? [];
  const [candidate, setCandidate] = useState<Apprentice | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [pendingBattle, setPendingBattle] = useState<CycleBattle | null>(null);

  // ── Real-time missed-day sync ──
  // On mount (or when returning to the page), check wall-clock time
  // and update missedDays if the player has been away.
  useEffect(() => {
    if (!currentApprentice) return;
    if (currentApprentice.stage !== "training") return;
    const pacing = computeTrialPacing(
      currentApprentice.recruitedAt,
      currentApprentice.trialDay,
    );
    if (pacing.missedDays > currentApprentice.missedDays) {
      setApprentice({
        ...currentApprentice,
        missedDays: pacing.missedDays,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentApprentice?.stage, currentApprentice?.trialDay]);

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

  const sendToCelebration = () => {
    if (!currentApprentice) return;
    setApprentice({ ...currentApprentice, stage: "training", trialDay: 1 });
  };

  const makeDailyDecision = (choice: DecisionOption) => {
    if (!currentApprentice) return;
    const { outcome } = choice;
    const died = rollForDeath(currentApprentice.missedDays, outcome.deathChance ?? 0);
    if (died) {
      recordFallenApprentice({
        ...currentApprentice,
        alive: false,
        stage: "fallen",
        deathRecord: {
          day: currentApprentice.trialDay,
          cause: outcome.resultFlavor,
          mascoteer: todayDecision?.mascoteerId,
        },
      });
      return;
    }
    // Persist trial history for combat buff integration
    addTrialHistoryEntry({
      day: currentApprentice.trialDay,
      mascoteerId: todayDecision?.mascoteerId ?? "",
      decisionId: todayDecision?.id ?? "",
      optionId: choice.id,
      bondDelta: outcome.bondDelta,
      corruptionDelta: outcome.corruptionDelta,
      moralityDelta: outcome.moralityDelta,
    });
    const newDay = currentApprentice.trialDay + 1;
    const newBond = Math.max(0, Math.min(100, currentApprentice.bond + outcome.bondDelta));
    // Daily corruption tick — evil apprentices still gain corruption
    const dailyCorruptionTick = computeDailyCorruption(currentApprentice, state.moralityScore ?? 0);
    const newCorruption = Math.max(0, Math.min(100,
      currentApprentice.corruption + outcome.corruptionDelta + dailyCorruptionTick,
    ));
    const graduated = newDay > TRIAL_LENGTH_DAYS;
    setApprentice({
      ...currentApprentice,
      trialDay: newDay,
      bond: newBond,
      corruption: newCorruption,
      missedDays: 0,
      stage: graduated ? "graduated" : "training",
    });
    // Check if the NEXT day triggers a graduation-exam battle
    if (!graduated) {
      const battle = getBattleForDay("A", newDay);
      if (battle) setPendingBattle(battle);
    }
  };

  // Betrayal event trigger — check corruption on companion apprentice
  const pendingBetrayal = useMemo((): BetrayalEvent | null => {
    if (!currentApprentice) return null;
    if (currentApprentice.stage !== "companion") return null;
    const stage = getBetrayalStage(currentApprentice.corruption);
    if (!stage) return null;
    return generateBetrayalEvent(currentApprentice, stage);
  }, [currentApprentice]);

  const resolveBetrayal = (choice: BetrayalChoice) => {
    if (!currentApprentice) return;
    const { outcome } = choice;
    const newCorruption = outcome.forceStage === "halted"
      ? Math.min(currentApprentice.corruption - 20, 59) // force below warning threshold
      : Math.max(0, Math.min(100, currentApprentice.corruption + outcome.corruptionDelta));
    const newBond = Math.max(0, Math.min(100, currentApprentice.bond + outcome.bondDelta));

    // If betrayal reached stage 100 and player chose kill/disarm, apprentice is fallen
    if (pendingBetrayal?.stage === "betrayal" && (choice.id === "kill" || choice.id === "disarm")) {
      recordFallenApprentice({
        ...currentApprentice,
        alive: false,
        stage: choice.id === "kill" ? "betrayed" : "fallen",
        corruption: newCorruption,
        bond: newBond,
        deathRecord: {
          day: currentApprentice.trialDay,
          cause: outcome.resultFlavor,
        },
      });
      return;
    }

    setApprentice({
      ...currentApprentice,
      corruption: newCorruption,
      bond: newBond,
    });
  };

  const todayDecision = useMemo(
    () =>
      currentApprentice && currentApprentice.stage === "training"
        ? generateDailyDecision(currentApprentice.trialDay, currentApprentice.recruitedAt % 100000)
        : null,
    [currentApprentice],
  );

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
          <>
            <CurrentApprenticeCard app={currentApprentice} onMarkFallen={handleFallen} />
            {/* Recruited → send to Celebration */}
            {currentApprentice.stage === "recruited" && (
              <div className="mt-4 rounded-lg border border-amber-500/40 overflow-hidden relative">
                {/* Celebration aerial view background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <ResponsiveImage
                    src="/art/celebration/environments/celebration_aerial.jpg"
                    alt=""
                    className="w-[115%] h-[115%] object-cover"
                    style={{
                      position: "absolute", top: "-7.5%", left: "-7.5%",
                      opacity: 0.2, filter: "brightness(0.4) saturate(0.8)",
                    }}
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
                  }} />
                </div>
                <div className="relative z-10 p-3">
                  <p className="font-mono text-[10px] italic text-amber-300/80 leading-relaxed mb-2">
                    Celebration awaits. Four weeks. Twenty-eight days. One graduation, or none. The Mascoteers know you're coming.
                  </p>
                  <button
                    onClick={sendToCelebration}
                    className="w-full px-3 py-2 rounded border border-amber-500/50 bg-amber-500/15 text-amber-300 font-mono text-[11px] uppercase tracking-wider hover:bg-amber-500/25"
                    data-testid="send-to-celebration"
                  >
                    Send {currentApprentice.name} to Celebration
                  </button>
                </div>
              </div>
            )}
            {/* Training → daily decision (or pending battle) */}
            {currentApprentice.stage === "training" && !pendingBattle && todayDecision && (
              <div className="mt-4">
                <DailyDecisionCard
                  decision={todayDecision}
                  day={currentApprentice.trialDay}
                  onChoose={makeDailyDecision}
                />
              </div>
            )}
            {/* Graduation-exam battle card (days 10/20/28) */}
            {currentApprentice.stage === "training" && pendingBattle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-lg border-2 border-red-500/50 bg-gradient-to-br from-red-950/20 to-amber-950/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-red-400" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-400">
                    Graduation Exam · Day {pendingBattle.triggerDay}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">{pendingBattle.opponentName}</h3>
                <p className="font-mono text-[10px] text-foreground/80 leading-relaxed mb-2">{pendingBattle.narrativeBeat}</p>
                <div className="p-2 rounded border border-border/30 bg-black/20 mb-3">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-amber-400 block mb-0.5">
                    Deck Theme: {pendingBattle.deckTheme}
                  </span>
                  <p className="font-mono text-[9px] text-foreground/70">{pendingBattle.deckMechanics}</p>
                </div>
                <div className="p-2 rounded border border-emerald-500/30 bg-emerald-500/5 mb-3">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-400 block mb-0.5">
                    Card Unlock
                  </span>
                  <p className="font-mono text-[10px] text-foreground/85">
                    <strong className="text-emerald-300">{pendingBattle.cardUnlock.name}</strong> ({pendingBattle.cardUnlock.rarity}) — {pendingBattle.cardUnlock.effect}
                  </p>
                </div>
                <Link
                  href="/dischordia"
                  className="block w-full text-center px-3 py-2 rounded border border-red-500/50 bg-red-500/15 text-red-300 font-mono text-[11px] uppercase tracking-wider hover:bg-red-500/25"
                >
                  Enter the Exam
                </Link>
                <button
                  onClick={() => setPendingBattle(null)}
                  className="block w-full mt-1.5 text-center px-3 py-1.5 font-mono text-[9px] text-muted-foreground/50 hover:text-muted-foreground"
                >
                  Skip for now
                </button>
              </motion.div>
            )}
            {/* Betrayal event */}
            {pendingBetrayal && (
              <div className="mt-4">
                <BetrayalEventCard event={pendingBetrayal} onChoose={resolveBetrayal} />
              </div>
            )}
            {/* Graduated → slideshow + welcome */}
            {currentApprentice.stage === "graduated" && !showSlideshow && (
              <div className="mt-4 p-4 rounded border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-amber-500/5 text-center">
                <Award size={32} className="mx-auto text-amber-400 mb-2" />
                <h3 className="font-display text-lg font-bold tracking-wider text-foreground">GRADUATED</h3>
                <p className="font-mono text-[10px] italic text-emerald-300/80 mt-1 leading-relaxed">
                  {currentApprentice.name} survived Celebration. They board your ship now. They remember every choice.
                </p>
                <button
                  onClick={() => setShowSlideshow(true)}
                  className="mt-3 px-4 py-1.5 rounded border border-amber-500/50 bg-amber-500/15 text-amber-300 font-mono text-[11px] uppercase tracking-wider hover:bg-amber-500/25"
                >
                  Watch the Ceremony
                </button>
                <button
                  onClick={() => {
                    const graduated = { ...currentApprentice, stage: "companion" as const };
                    setApprentice(graduated);
                    addGraduate(graduated);
                  }}
                  className="mt-2 px-4 py-1.5 rounded border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-mono text-[11px] uppercase tracking-wider hover:bg-emerald-500/25"
                  data-testid="welcome-aboard"
                >
                  Skip — Welcome Them Aboard
                </button>
              </div>
            )}
            {/* Graduation slideshow playing */}
            {showSlideshow && (
              <SongSlideshow
                title={WELCOME_TO_CELEBRATION_TITLE}
                frames={WELCOME_TO_CELEBRATION_FRAMES}
                audioSrc={WELCOME_TO_CELEBRATION_AUDIO}
                onEnd={() => {
                  setShowSlideshow(false);
                  if (currentApprentice) {
                    const graduated = { ...currentApprentice, stage: "companion" as const };
                    setApprentice(graduated);
                    addGraduate(graduated);
                  }
                }}
              />
            )}
          </>
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
/* ─── BETRAYAL EVENT CARD ─── */
function BetrayalEventCard({ event, onChoose }: {
  event: BetrayalEvent;
  onChoose: (c: BetrayalChoice) => void;
}) {
  const stageColor =
    event.stage === "warning" ? "yellow" :
    event.stage === "turn" ? "orange" :
    event.stage === "declaration" ? "red" : "red";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 void-surface border-2 border-${stageColor}-500/60`}
      data-testid={`betrayal-event-${event.stage}`}
      data-narrative={event.stage === "betrayal" ? "quake" : event.stage === "declaration" ? "glitch" : event.stage === "turn" ? "shake" : "tremble"}
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={14} className={`text-${stageColor}-400`} />
        <span className={`font-mono text-[9px] uppercase tracking-[0.25em] text-${stageColor}-400`}>
          {event.stage} · corruption {event.threshold}+
        </span>
      </div>
      <p className="font-mono text-[11px] italic text-foreground/90 leading-relaxed mb-3">
        {event.prompt}
      </p>
      <div className="space-y-1.5">
        {event.options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChoose(opt)}
            className="w-full text-left p-2.5 rounded border border-border/40 bg-background/40 hover:border-red-400/40 hover:bg-red-950/20 transition-colors"
            data-testid={`betrayal-choice-${opt.id}`}
          >
            <div className="font-mono text-[10px] font-bold text-foreground">{opt.label}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── CELEBRATION SCENE ART ─── */
const MASCOTEER_SCENE_ART: Record<string, string> = {
  the_conductor: "/art/celebration/celebration-chorus-pavilion.png",
  mr_unblink: "/art/celebration/celebration-eye-garden.png",
  little_corey: "/art/celebration/celebration-trading-jars.png",
  vernon: "/art/celebration/celebration-door-row.png",
  minnie: "/art/celebration/celebration-schoolhouse.png",
  wanda_wee: "/art/celebration/celebration-town-square.png",
  senator_sprout: "/art/celebration/celebration-promise-office.png",
  wayne: "/art/celebration/celebration-locked-room.png",
  gary: "/art/celebration/celebration-puzzle-garden.png",
  thazu: "/art/celebration/celebration-tea-party.png",
  the_prince: "/art/celebration/celebration-forge-yard.png",
  the_seeker_child: "/art/celebration/celebration-schoolhouse.png",
};

const MASCOTEER_ACCENT: Record<string, string> = {
  the_conductor: "#818cf8",  // indigo
  mr_unblink: "#a1a1aa",     // silver
  little_corey: "#fbbf24",   // amber
  vernon: "#e879f9",         // fuchsia
  minnie: "#f472b6",         // pink
  wanda_wee: "#facc15",      // yellow
  senator_sprout: "#c084fc", // purple
  wayne: "#34d399",          // emerald
  gary: "#60a5fa",           // blue
  thazu: "#f87171",          // red
  the_prince: "#fb923c",     // orange
  the_seeker_child: "#38bdf8", // sky
};

/* ─── DAILY DECISION CARD ─── */
function DailyDecisionCard({ decision, day, onChoose }: {
  decision: { mascoteerId: string; prompt: string; options: DecisionOption[] };
  day: number;
  onChoose: (option: DecisionOption) => void;
}) {
  const mascoteer = getMascoteer(decision.mascoteerId);
  const defaultSceneArt = MASCOTEER_SCENE_ART[decision.mascoteerId];
  // Trial room appears on exam days (10, 20, 28) and alternating days in the final week
  const useTrialRoom = day === 10 || day === 20 || day === 28 || (day >= 21 && day % 2 === 1);
  const sceneArt = useTrialRoom
    ? "/art/celebration/environments/celebration_trial_room.jpg"
    : defaultSceneArt;
  const accent = MASCOTEER_ACCENT[decision.mascoteerId] ?? "#c084fc";
  const isNight = day >= 21; // Last week = night scenes

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border overflow-hidden relative"
      style={{ borderColor: `${accent}40` }}
    >
      {/* Scene art background */}
      {sceneArt && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ResponsiveImage
            src={isNight ? "/art/celebration/celebration-by-night.png" : sceneArt}
            alt=""
            className="w-[115%] h-[115%] object-cover celebration-drift"
            style={{
              position: "absolute",
              top: "-7.5%",
              left: "-7.5%",
              opacity: 0.25,
              filter: isNight
                ? "brightness(0.3) saturate(0.5) hue-rotate(20deg)"
                : "brightness(0.4) saturate(0.8)",
            }}
          />
          {/* Gradient fade */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)`,
          }} />
        </div>
      )}

      {/* Ambient glow pulse */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none celebration-pulse"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${accent}10 0%, transparent 60%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full celebration-particle"
            style={{
              width: 2 + Math.random() * 2,
              height: 2 + Math.random() * 2,
              background: accent,
              opacity: 0.15 + Math.random() * 0.2,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDuration: `${4 + i * 0.6}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
            Day {day} / {TRIAL_LENGTH_DAYS} · Celebration
          </span>
          {mascoteer && (
            <span className="font-mono text-[9px]" style={{ color: `${accent}cc` }}>
              ◈ {mascoteer.mascotName}
            </span>
          )}
        </div>

        {/* Mascoteer portrait hero */}
        {mascoteer && (
          <div className="relative h-40 -mx-4 mb-3 overflow-hidden">
            {/* Scene art as background layer */}
            {sceneArt && (
              <ResponsiveImage
                src={isNight ? "/art/celebration/celebration-by-night.png" : sceneArt}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: isNight
                    ? "brightness(0.3) saturate(0.4) hue-rotate(20deg)"
                    : "brightness(0.4) saturate(0.7)",
                }}
              />
            )}
            {/* Mascoteer portrait — centered, prominent */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <ResponsiveImage
                  src={mascoteer.portrait}
                  alt={mascoteer.mascotName}
                  className="w-28 h-28 rounded-lg object-cover object-top cel-portrait-breathe border-2 shadow-xl"
                  style={{
                    borderColor: `${accent}50`,
                    boxShadow: `0 0 24px ${accent}25, 0 4px 16px rgba(0,0,0,0.5)`,
                    filter: isNight ? "brightness(0.75) saturate(0.8)" : undefined,
                  }}
                  eager
                />
                {/* Danger indicator on risky decisions */}
                {decision.options.some(o => (o.outcome.deathChance ?? 0) > 0.05) && (
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border border-red-500/60 bg-red-900/80 flex items-center justify-center"
                    title="Dangerous day"
                  >
                    <AlertTriangle size={8} className="text-red-400" />
                  </div>
                )}
              </div>
            </div>
            {/* Gradient overlays */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 40%), linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%)`,
            }} />
            {/* Game name at bottom */}
            <div className="absolute bottom-2 left-4 right-4">
              <div className="font-display text-sm font-bold tracking-wider" style={{ color: accent, textShadow: `0 2px 12px rgba(0,0,0,0.8)` }}>
                {mascoteer.dailyGame.split("—")[0].trim()}
              </div>
            </div>
          </div>
        )}

        <p className="font-mono text-[10px] italic text-foreground/85 leading-relaxed mb-3">
          {decision.prompt}
        </p>
        <div className="space-y-1.5">
          {decision.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => onChoose(opt)}
              className="w-full text-left p-2.5 rounded border transition-colors"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.4)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${accent}50`;
                e.currentTarget.style.background = `${accent}08`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(0,0,0,0.4)";
              }}
              data-testid={`decision-option-${opt.id}`}
            >
              <div className="font-mono text-[10px] font-bold text-foreground mb-0.5">{opt.label}</div>
              <div className="font-mono text-[9px] text-muted-foreground/70 leading-snug">{opt.description}</div>
            </button>
          ))}
        </div>
        {mascoteer && (
          <p className="mt-3 pt-2 border-t font-mono text-[8px] italic text-red-300/60 leading-relaxed" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            ⚠ {mascoteer.failureMethod}
          </p>
        )}
      </div>

      <style>{`
        @keyframes cel-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-1.5%, -1%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes cel-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes cel-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
          50% { transform: translateY(-20px) translateX(8px); opacity: 0.35; }
        }
        .celebration-drift { animation: cel-drift 25s ease-in-out infinite; }
        .celebration-pulse { animation: cel-pulse 4s ease-in-out infinite; }
        .celebration-particle { animation: cel-particle 5s ease-in-out infinite; }
        @keyframes cel-portrait-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.008); }
        }
        .cel-portrait-breathe { animation: cel-portrait-breathe 3.5s ease-in-out infinite; }
      `}</style>
    </motion.div>
  );
}

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
