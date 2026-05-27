/* ═══════════════════════════════════════════════════════
   CampaignRunPage — manifest-driven act runner

   Plan §2.1 — the unified consumer of `ActManifest`.

   The shipping client today has Act1CardLadderPage,
   Act3CardLadderPage, Act6/7 ladder pages, Act4MatchPage,
   and the Act 2/5 interlude pages — each reimplementing
   the same state-machine (resolving → matchup → battle →
   postmatch) with subtle drift. This component is the
   single owner of that state-machine; per-act content +
   side effects are delegated through a
   `CampaignActAdapter` render-prop adapter.

   Act 4 is the first migration (slice 6b). Other surface
   modes (ladder / single / interlude) throw a clear
   "not yet implemented in CampaignRunPage" error so the
   error is loud and the next migration knows what to wire.

   The adapter pattern (rather than baking opponent + dialog
   data shapes into the page) was the deliberate trade:
   each act keeps its existing per-act stores + dialog
   resolvers; the page does not need to grow generic
   discriminated unions for opponent metadata. When a second
   act migrates we'll know whether to keep the adapter or
   push more into the manifest itself.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import LivingBackground from "@/components/LivingBackground";
import {
  FactionBackdrop,
  type FactionBackdropId,
} from "@/components/FactionBackdrop";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import {
  ActNOpponentTauntOverlay,
  type ActNTauntPhase,
} from "@/components/act1/ActNOpponentTauntOverlay";
import { useGame } from "@/contexts/GameContext";
import type { ActManifest, ActOpponent } from "@shared/campaign/actManifest";

type MatchView = "resolving" | "matchup" | "battle" | "postmatch";

export type SetNarrativeFlag = (key: string, value: boolean) => void;

/**
 * Per-act binding consumed by `CampaignRunPage`. The page owns the
 * state machine; the adapter owns content + side effects.
 *
 * Generic over `Opponent` (the act's rich opponent type, e.g. the
 * `ActNOpponent` shape used by Acts 2–7) and `Dialog` (the act's
 * resolved per-flag dialog frame). The page passes both back to
 * each render function — adapters don't need to look up state.
 */
export interface CampaignActAdapter<Opponent = unknown, Dialog = unknown> {
  /** Resolve rich per-opponent metadata from the manifest's
   *  encounterId. Return `null` if the encounter is unknown — the
   *  page surfaces a clear "path not yet resolved" message. */
  resolveOpponentDetails(encounterId: string): Opponent | null;

  /** Resolve the per-flag dialog frame given the current narrative
   *  flag set and the resolved opponent. Return `null` to skip
   *  matchup / postmatch dialog frames. */
  resolveDialog(
    flags: ReadonlySet<string>,
    opponent: Opponent | null,
  ): Dialog | null;

  /** Render the resolving panel — typically a path label + backstory
   *  + "Sit at the table" CTA. `opponent` is null when no branch
   *  resolved. */
  renderResolvingPanel(args: {
    opponent: Opponent | null;
    pathLabel: string | null;
    previousOutcome: "win" | "loss" | null;
    onProceed: () => void;
  }): ReactNode;

  /** Render the matchup panel — pre-match dialog frame + Begin CTA. */
  renderMatchupPanel(args: {
    opponent: Opponent;
    dialog: Dialog | null;
    pathLabel: string;
    onBack: () => void;
    onBegin: () => void;
  }): ReactNode;

  /** Render the post-match panel — outcome copy + Continue CTA. */
  renderPostMatchPanel(args: {
    opponent: Opponent;
    dialog: Dialog | null;
    outcome: "win" | "loss";
    onContinue: () => void;
  }): ReactNode;

  /** Side effects fired on player win. Receives the canonical
   *  `setNarrativeFlag` from `useGame()` so the adapter can write
   *  flags without re-binding the context itself. */
  onWin?(args: { opponent: Opponent; setNarrativeFlag: SetNarrativeFlag }): void;

  /** Side effects fired on player loss. */
  onLoss?(args: { opponent: Opponent; setNarrativeFlag: SetNarrativeFlag }): void;

  /** Side effect fired between the matchup `Begin` press and the
   *  battle view mount — used by Act 4 to fire chapter-intro
   *  cutscenes via narrative-flag triggers. */
  beforeBattle?(args: {
    opponent: Opponent;
    setNarrativeFlag: SetNarrativeFlag;
  }): void;

  /** Map the rich opponent to the DuelystGameUI faction string. */
  resolveOpponentFaction(opponent: Opponent): string;

  /** Return the taunt-hooks payload for the ActNOpponentTauntOverlay,
   *  or null to skip the overlay. */
  resolveTauntHooks(opponent: Opponent): unknown | null;

  /** Opponent display name surfaced on the taunt overlay. */
  opponentDisplayName(opponent: Opponent): string;

  /** Outcome store hook — the page calls this once. Must be a stable
   *  hook for React's rules-of-hooks compliance. */
  useOutcomeStore(): {
    outcome: "win" | "loss" | null;
    recordOutcome(opponentId: string, outcome: "win" | "loss"): void;
  };

  /** Map the rich opponent back to the encounterId used in the
   *  manifest + the outcome store. Typically `opp.id`. */
  opponentEncounterId(opponent: Opponent): string;

  /** Optional human-friendly path label per encounterId (Path A / B / C
   *  for Act 4; act-step number for ladder acts). */
  pathLabel?(encounterId: string): string;

  /** Layout / presentation. */
  presentation: {
    livingBackgroundSrc: string;
    livingBackgroundAccent: string;
    factionBackdrop: FactionBackdropId;
    factionBackdropOpacity?: number;
    /** Tailwind classes for the per-act accent (matches the existing
     *  Act 4 cyan; other acts pick their own.). */
    accent: {
      border: string;
      text: string;
      subText: string;
      bg: string;
    };
    routeBack: { to: string; label: string };
    headerEyebrow: string;
  };
}

export interface CampaignRunPageProps<Opponent = unknown, Dialog = unknown> {
  manifest: ActManifest;
  adapter: CampaignActAdapter<Opponent, Dialog>;
}

/**
 * Resolve the active opponent's manifest entry for a given flag set.
 * Walks the surface's branches in declaration order ("first match
 * wins"), falling back to defaultBranch when present. Returns null
 * for branching surfaces where nothing matches and no default is set
 * (Act 4's "path not yet resolved" state).
 *
 * Exported for direct unit-testing without React.
 */
export function resolveActiveEncounter(
  manifest: ActManifest,
  flags: ReadonlySet<string>,
): ActOpponent | null {
  const surface = manifest.surface;
  switch (surface.mode) {
    case "branching":
      for (const branch of surface.branches) {
        if (flags.has(branch.requires)) return branch.encounter;
      }
      return surface.defaultBranch ?? null;
    case "single":
      return surface.encounter;
    case "ladder":
    case "interlude":
      return null;
  }
}

export default function CampaignRunPage<Opponent, Dialog>({
  manifest,
  adapter,
}: CampaignRunPageProps<Opponent, Dialog>) {
  // Surface-mode gate. Add cases here when each act migrates;
  // throwing is intentional so the next migration cannot silently
  // ship a broken page.
  if (manifest.surface.mode !== "branching") {
    throw new Error(
      `[CampaignRunPage] surface mode "${manifest.surface.mode}" not yet implemented (manifest: ${manifest.actId})`,
    );
  }

  const { setNarrativeFlag, state: gameState } = useGame();
  const { outcome, recordOutcome } = adapter.useOutcomeStore();

  const [view, setView] = useState<MatchView>("resolving");
  const [postMatchResult, setPostMatchResult] = useState<{
    opponent: Opponent;
    outcome: "win" | "loss";
  } | null>(null);
  const [tauntPhase, setTauntPhase] = useState<ActNTauntPhase | null>(null);

  const flags = useMemo<ReadonlySet<string>>(
    () =>
      new Set(
        Object.entries(gameState.narrativeFlags)
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [gameState.narrativeFlags],
  );

  const activeEncounter = useMemo(
    () => resolveActiveEncounter(manifest, flags),
    [manifest, flags],
  );

  const opponent = useMemo<Opponent | null>(
    () =>
      activeEncounter
        ? adapter.resolveOpponentDetails(activeEncounter.encounterId)
        : null,
    [activeEncounter, adapter],
  );

  const dialog = useMemo<Dialog | null>(
    () => adapter.resolveDialog(flags, opponent),
    [flags, opponent, adapter],
  );

  const pathLabel = useMemo<string | null>(
    () =>
      activeEncounter
        ? (adapter.pathLabel?.(activeEncounter.encounterId) ??
          activeEncounter.name)
        : null,
    [activeEncounter, adapter],
  );

  const handleTurnChange = useCallback(
    ({
      turnNumber,
      actor,
    }: {
      turnNumber: number;
      actor: "player" | "opponent";
    }) => {
      if (actor !== "opponent") return;
      if (turnNumber === 1) setTauntPhase("early");
      else if (turnNumber === 3) setTauntPhase("mid");
      else if (turnNumber === 5) setTauntPhase("late");
    },
    [],
  );

  const handleBossHpChange = useCallback(
    ({ hp, maxHp }: { hp: number; previousHp: number; maxHp: number }) => {
      if (maxHp <= 0) return;
      const pct = hp / maxHp;
      setTauntPhase((prev) => {
        if (pct <= 0.3 && prev !== "late") return "late";
        if (pct <= 0.6 && prev !== "mid" && prev !== "late") return "mid";
        return prev;
      });
    },
    [],
  );

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!opponent) return;
      const outcomeTag: "win" | "loss" = winner === "player" ? "win" : "loss";
      recordOutcome(adapter.opponentEncounterId(opponent), outcomeTag);
      if (winner === "player") {
        adapter.onWin?.({ opponent, setNarrativeFlag });
      } else {
        adapter.onLoss?.({ opponent, setNarrativeFlag });
      }
      setPostMatchResult({ opponent, outcome: outcomeTag });
      setView("postmatch");
    },
    [opponent, recordOutcome, adapter, setNarrativeFlag],
  );

  const handleBeginBattle = useCallback(() => {
    if (opponent) {
      adapter.beforeBattle?.({ opponent, setNarrativeFlag });
    }
    setView("battle");
  }, [opponent, adapter, setNarrativeFlag]);

  const handlePostMatchContinue = useCallback(() => {
    setPostMatchResult(null);
    setTauntPhase(null);
    setView("resolving");
  }, []);

  const { presentation } = adapter;

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={presentation.livingBackgroundSrc}
        accent={presentation.livingBackgroundAccent}
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />
      <FactionBackdrop
        faction={presentation.factionBackdrop}
        opacity={presentation.factionBackdropOpacity ?? 0.1}
      />

      <header
        className={`relative z-10 flex items-center justify-between border-b ${presentation.accent.border} bg-stone-950/80 px-4 py-3 backdrop-blur`}
      >
        <Link
          to={presentation.routeBack.to}
          className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] ${presentation.accent.subText} hover:text-cyan-100`}
        >
          <ChevronLeft size={14} />
          {presentation.routeBack.label}
        </Link>
        <div className="text-center">
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.3em] ${presentation.accent.subText}`}
          >
            {presentation.headerEyebrow}
          </p>
          <p className="mt-1 font-serif text-lg italic text-cyan-50">
            {pathLabel ?? "Path Resolving"}
          </p>
        </div>
        <div
          className={`font-mono text-[10px] uppercase tracking-wider ${presentation.accent.subText}`}
        >
          {outcome ? outcome.toUpperCase() : "Unplayed"}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <AnimatePresence mode="wait">
          {view === "resolving" && (
            <motion.div
              key="resolving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {!opponent && (
                <div className="rounded-md border border-amber-500/40 bg-amber-950/20 p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-300/80" />
                    <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300/90">
                      Path not yet resolved
                    </p>
                  </div>
                </div>
              )}
              {adapter.renderResolvingPanel({
                opponent,
                pathLabel,
                previousOutcome: outcome,
                onProceed: () => setView("matchup"),
              })}
            </motion.div>
          )}

          {view === "matchup" && opponent && (
            <motion.div
              key="matchup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {adapter.renderMatchupPanel({
                opponent,
                dialog,
                pathLabel: pathLabel ?? "",
                onBack: () => setView("resolving"),
                onBegin: handleBeginBattle,
              })}
            </motion.div>
          )}

          {view === "battle" && opponent && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <DuelystGameUI
                playerFaction={
                  (gameState.characterChoices.alignment as never) ??
                  ("neutral" as never)
                }
                opponentFaction={
                  adapter.resolveOpponentFaction(opponent) as never
                }
                onGameEnd={handleGameEnd}
                onBack={() => setView("matchup")}
                onTurnChange={handleTurnChange}
                onBossHpChange={handleBossHpChange}
              />
              <ActNOpponentTauntOverlay
                hooks={adapter.resolveTauntHooks(opponent) as never ?? undefined}
                opponentName={adapter.opponentDisplayName(opponent)}
                phase={tauntPhase}
              />
            </motion.div>
          )}

          {view === "postmatch" && postMatchResult && (
            <motion.div
              key="postmatch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {adapter.renderPostMatchPanel({
                opponent: postMatchResult.opponent,
                dialog,
                outcome: postMatchResult.outcome,
                onContinue: handlePostMatchContinue,
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
