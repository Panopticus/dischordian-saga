/* ═══════════════════════════════════════════════════════
   DECISION DECK — Simple-UX home screen

   Low-input, high-decision play. Shows the player the most
   important active decisions across all subsystems as cards.
   1-2 taps per card. No menu diving.

   Sources:
     • Today's Celebration trial decision (if Apprentice is training)
     • Active thought-internalization (if any completing)
     • Recent Archon whispers
     • Discovered-but-not-started thoughts (quick-start)
     • Ideology commitment pending (if player has visited)
     • Pending Archetype emergence
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Brain, Clock, Flag, Users, Swords, Home, Skull, Mail, Radio } from "lucide-react";
import { VOID } from "@/engine/voidPresets";
import { useGame } from "@/contexts/GameContext";
import type { Apprentice } from "@shared/apprentices";
import { TRIAL_LENGTH_DAYS } from "@shared/celebrationTrial";
import { THOUGHTS } from "@/game/thoughtCabinet";
import { getDarkTier } from "@shared/darkArts";
import { getDominantGuild } from "@/game/archonTrainingVoices";
import type { SkillId } from "@/game/innerVoices";
import { ALL_TRANSMISSIONS, isUnlocked, transmissionId } from "@shared/transmissions";
import { usePlayerContext } from "@/hooks/usePlayerContext";

export default function DecisionDeck() {
  const { state } = useGame();
  const txCtx = usePlayerContext();
  const apprentice = state.apprentice as Apprentice | null;
  const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;
  const guild = useMemo(() => getDominantGuild(skills), [skills]);
  const darkTier = getDarkTier(state.corruptionLevel ?? 0);

  const discoveredUnstarted = useMemo(() => {
    return state.thoughtDiscovered.filter(
      id => !state.thoughtInternalized.includes(id) && !state.thoughtInternalizing.some(t => t.thoughtId === id),
    );
  }, [state.thoughtDiscovered, state.thoughtInternalized, state.thoughtInternalizing]);

  const cards: Array<{ key: string; element: React.ReactNode }> = [];

  // Card: Apprentice trial decision
  if (apprentice && apprentice.stage === "training") {
    cards.push({
      key: "apprentice-trial",
      element: (
        <DeckCard
          href="/apprentice"
          icon={Sparkles}
          color="text-amber-400"
          title={`${apprentice.name} — Day ${apprentice.trialDay}/${TRIAL_LENGTH_DAYS}`}
          subtitle="A Mascoteer waits with today's decision."
          cta="Face the day"
        />
      ),
    });
    // Cohort view available during training
    cards.push({
      key: "cohort",
      element: (
        <DeckCard
          href="/cohort"
          icon={Users}
          color="text-purple-400"
          title={`Cohort Leaderboard`}
          subtitle="See who's still alive in the Celebration class."
          cta="View cohort"
        />
      ),
    });
  }

  // Card: Apprentice graduated
  if (apprentice && apprentice.stage === "graduated") {
    cards.push({
      key: "apprentice-graduated",
      element: (
        <DeckCard
          href="/apprentice"
          icon={Sparkles}
          color="text-emerald-400"
          title={`${apprentice.name} survived Celebration`}
          subtitle="They board your ship now. Welcome them aboard."
          cta="Welcome them"
        />
      ),
    });
  }

  // Card: No apprentice / recruit one
  if (!apprentice) {
    cards.push({
      key: "apprentice-recruit",
      element: (
        <DeckCard
          href="/apprentice"
          icon={Sparkles}
          color="text-amber-400"
          title="Train an Apprentice"
          subtitle="Recruit a candidate. Send them to Celebration. Earn a companion."
          cta="Roll a candidate"
        />
      ),
    });
  }

  // Card: House Cup standing
  if (guild) {
    cards.push({
      key: "house-cup",
      element: (
        <DeckCard
          href="/house-cup"
          icon={Users}
          color="text-indigo-400"
          title={`${guild.guild.name} · House Cup`}
          subtitle="See where your Guild stands this week."
          cta="Check standing"
        />
      ),
    });
  }

  // Card: Common room
  if (guild) {
    cards.push({
      key: "common-room",
      element: (
        <DeckCard
          href="/common-room"
          icon={Home}
          color="text-purple-400"
          title="Your Common Room"
          subtitle={`${guild.guild.motto}`}
          cta="Enter"
        />
      ),
    });
  }

  // Card: Discovered thoughts
  if (discoveredUnstarted.length > 0) {
    const firstId = discoveredUnstarted[0];
    const thought = THOUGHTS.find(t => t.id === firstId);
    if (thought) {
      cards.push({
        key: "thought-ready",
        element: (
          <DeckCard
            href="/character-sheet"
            icon={Brain}
            color="text-indigo-300"
            title={`New Thought: ${thought.name}`}
            subtitle={`${discoveredUnstarted.length} idea-seed(s) ready to internalize in the Matrix.`}
            cta="Begin internalizing"
          />
        ),
      });
    }
  }

  // Card: Thoughts completing soon
  const nearlyDone = state.thoughtInternalizing.find(i => {
    const t = THOUGHTS.find(x => x.id === i.thoughtId);
    if (!t) return false;
    const elapsed = (Date.now() - i.startedAt) / (1000 * 60 * 60);
    return elapsed >= t.internalizationHours * 0.85;
  });
  if (nearlyDone) {
    const t = THOUGHTS.find(x => x.id === nearlyDone.thoughtId);
    cards.push({
      key: "thought-completing",
      element: (
        <DeckCard
          href="/character-sheet"
          icon={Clock}
          color="text-amber-300"
          title={`${t?.name ?? "Thought"} · almost ready`}
          subtitle="It has nearly gestated. Check soon."
          cta="View Matrix"
        />
      ),
    });
  }

  // Card: Ideology not yet committed
  if (!state.ideologyCommitted) {
    cards.push({
      key: "ideology",
      element: (
        <DeckCard
          href="/ideology"
          icon={Flag}
          color="text-purple-400"
          title="Six Political Visions"
          subtitle="Each promises something. Each costs something. Choose carefully."
          cta="Study the visions"
        />
      ),
    });
  }

  // Card: Dark Arts warning + Purge option
  if ((state.corruptionLevel ?? 0) >= 25) {
    cards.push({
      key: "dark-arts",
      element: (
        <DeckCard
          href="/purge"
          icon={Swords}
          color={darkTier.color}
          title={`⚠ ${darkTier.name} — ${state.corruptionLevel} corruption`}
          subtitle={`${darkTier.description} Purge rituals available.`}
          cta="Enact purge"
        />
      ),
    });
  }

  // Card: New Transmissions (if unwatched ones exist)
  const watchedSet = new Set(state.transmissionsWatched ?? []);
  const unwatchedUnlocked = ALL_TRANSMISSIONS.filter(t => isUnlocked(t, txCtx) && !watchedSet.has(transmissionId(t)));
  if (unwatchedUnlocked.length > 0) {
    const next = unwatchedUnlocked[0];
    cards.push({
      key: "transmission",
      element: (
        <DeckCard
          href="/transmissions"
          icon={Radio}
          color="text-red-400"
          title={`▸ Incoming Transmission (${unwatchedUnlocked.length})`}
          subtitle={`Late Night with the Meme: "${next.title}"`}
          cta="Watch broadcast"
        />
      ),
    });
  }

  // Card: Pet Battles (always available, lightweight entertainment)
  cards.push({
    key: "pet-battles",
    element: (
      <DeckCard
        href="/pet-battles"
        icon={Swords}
        color="text-rose-400"
        title="Arena of Small Things"
        subtitle="Watch specimens battle. Bet on outcomes."
        cta="Enter arena"
      />
    ),
  });

  // Card: Graduate Legion (if graduates exist)
  const graduateCount = Object.keys(state.legionGraduates ?? {}).length;
  if (graduateCount > 0) {
    const unreadLetters = (state.legionLetters ?? []).filter(l => !l.read).length;
    cards.push({
      key: "legion",
      element: (
        <DeckCard
          href="/legion"
          icon={unreadLetters > 0 ? Mail : Users}
          color={unreadLetters > 0 ? "text-indigo-400" : "text-amber-400"}
          title={`Graduate Legion (${graduateCount})`}
          subtitle={unreadLetters > 0
            ? `${unreadLetters} unread letter${unreadLetters > 1 ? "s" : ""} from the front.`
            : "Deploy, freeze, sacrifice, or gift your graduates."}
          cta="Manage Legion"
        />
      ),
    });
  }

  if (cards.length === 0) return null;

  return (
    <div className="space-y-2" data-testid="decision-deck">
      <div className="flex items-center gap-2 px-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">
          Today's Decisions
        </span>
        <div className="flex-1 h-px bg-border/20" />
        <span className="font-mono text-[9px] text-muted-foreground/50">{cards.length} waiting</span>
      </div>
      {cards.map(c => (
        <motion.div key={c.key} {...VOID.cardReveal()}>
          {c.element}
        </motion.div>
      ))}
    </div>
  );
}

function DeckCard({ href, icon: Icon, color, title, subtitle, cta }: {
  href: string; icon: any; color: string; title: string; subtitle: string; cta: string;
}) {
  return (
    <Link
      href={href}
      className="block p-3 void-surface"
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-8 h-8 rounded-md border border-border/40 bg-background/60 flex items-center justify-center`}>
          <Icon size={16} className={color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-display text-xs font-bold tracking-wider ${color}`}>{title}</div>
          <p className="font-mono text-[10px] text-muted-foreground/80 leading-snug mt-0.5">{subtitle}</p>
          <span className={`font-mono text-[9px] uppercase tracking-wider mt-1 inline-block ${color}`}>
            → {cta}
          </span>
        </div>
      </div>
    </Link>
  );
}
