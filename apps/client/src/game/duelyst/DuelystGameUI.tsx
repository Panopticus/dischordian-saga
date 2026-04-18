/* ═══════════════════════════════════════════════════════
   DISCHORDIA GAME UI — React wrapper for the tactical board
   with hand display, mana bar, action log, and controls
   ═══════════════════════════════════════════════════════ */
import React, { useRef, useEffect, useState, useCallback } from "react";
import type { DuelystGameState, DuelystCard, BoardUnit, GameAction, Faction } from "./types";
import { FACTION_COLORS, FACTION_NAMES } from "./types";
import {
  getValidMoves, getValidAttacks,
  getValidSummonTiles, findUnit,
  GENERALS,
} from "./engine";
import { BoardRenderer } from "./BoardRenderer";
import { getAIActions, getAIMulliganIndices } from "./DuelystAI";
import { buildStarterDeck } from "./cardAdapter";
import { STARTER_DECK_MAP } from "@shared/tcg-core/decks/starterDecks";
import { TcgClient } from "./TcgClient";
import type { LegacyDuelystGameState } from "@shared/tcg-core/compat/viewAdapter";

/**
 * Cast the tcg-core view adapter's output to the local DuelystGameState
 * type. The shapes are structurally identical — the only difference is
 * Set<string> vs Set<DuelystKeyword>, which is compatible at runtime.
 * This one-liner lets every dispatch site call setGameState cleanly.
 */
function asGameState(view: LegacyDuelystGameState): DuelystGameState {
  return view as unknown as DuelystGameState;
}
import { TUTORIAL_STEPS, isTutorialActionComplete, type TutorialStep } from "./tutorial";
import { summarizeTrial, trialToCombatBuff, type TrialHistoryEntry, type TrialCombatBuff } from "@shared/celebrationTrial";
import { dischordiaSounds } from "./SoundManager";
import {
  Swords, Heart, Zap, RotateCcw, SkipForward, Shield,
  Crosshair, Move, Sparkles, BookOpen, MessageCircle,
} from "lucide-react";
import { ScreenReaderOnly, announce } from "@/components/a11y";
import { WarlordCountdownIndicator } from "@/components/match/WarlordCountdownIndicator";
import { CardLockOverlay } from "@/components/match/CardLockOverlay";
import { PlayRejectionToast } from "@/components/match/PlayRejectionToast";
import { TrialPhaseIndicator } from "@/components/match/TrialPhaseIndicator";
import { ChoicePillarLightDark } from "@/components/match/ChoicePillarLightDark";
import {
  ChoicePillarProgrammerGift,
  type ProgrammerGiftChoice,
} from "@/components/match/ChoicePillarProgrammerGift";
import {
  setLightDarkAlignment,
  setProgrammerGiftAccepted,
  type LightDarkAlignment,
} from "@shared/campaignState";
import { useGame } from "@/contexts/GameContext";
import {
  computeAuthorityTrialOverride,
  rememberPublicWitnessBalance,
} from "@shared/act1TrialHandoff";
import { recordMemorableMoment } from "@/stores/memorableMomentsStore";
import {
  getEncounterReward,
  type EncounterOutcome,
  type EncounterReward,
} from "@shared/act1EncounterRewards";
import {
  bossMasteryKeyForEncounter,
  BOSS_MASTERY_DEFS,
} from "@shared/bossMastery";
import type { StoryEncounter } from "@shared/tcg-core/story/encounter";
import {
  deriveSeerOutcome,
  playerDeckUnlocksWinnablePath,
} from "@shared/tcg-core/engine/seerProphecy";
import {
  ACT1_CYCLE_B_COMPLETE_FLAG,
  SEER_OUTCOME_FLAGS,
  SEER_STAFF_WITNESSED_FLAG,
} from "@shared/tcg-core/types/SeerProphecy";
import {
  TrialTranscriptColumn,
  type TrialTranscriptEntry,
} from "@/components/match/TrialTranscriptColumn";
import { PublicWitnessColumn } from "@/components/match/PublicWitnessColumn";
import { SeerPlayOverlay } from "@/components/match/SeerPlayOverlay";
import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";
import { MatchSummary, type MatchSummaryStats } from "@/components/match/MatchSummary";
import { toast } from "sonner";

/**
 * Human-friendly labels for card-battle quest ids. Surfaced in the
 * quest-complete toast when `updateQuestProgress.mutate` returns
 * `{ completed: true }`. Keep this map in sync with the quest ids
 * DuelystGameUI fires (see match-end effect below).
 */
const QUEST_LABELS: Record<string, string> = {
  d_play_3_battles: "Play 3 card battles",
  d_play_card_battle: "Win a card battle today",
  w_win_10_battles: "Win 10 card battles this week",
  e_win_100_battles: "Win 100 card battles this season",
};
import { trpc } from "@/lib/trpc";
import type { TcgDispatchResult } from "./TcgClient";

interface DuelystGameUIProps {
  playerFaction: Faction;
  opponentFaction: Faction;
  isTutorial?: boolean;
  /** Celebration trial history — if provided, computes combat buffs for the player's deck */
  trialHistory?: TrialHistoryEntry[];
  /**
   * Optional Act 1 encounter override. When set, the component
   * launches the match in encounter mode:
   *   - opponent faction / general / deck come from the encounter,
   *     not from `opponentFaction`
   *   - trialMode / giftMode / witnessMode / prophecyMode /
   *     scriptedActions flow to TcgClient.init so per-mode state
   *     (PublicWitnessColumn, TrialPhaseIndicator, SeerPlayOverlay,
   *     Warlord lockout) boots correctly
   *   - match-end applies the per-encounter rewards from
   *     `act1EncounterRewards.ts` (narratorBond, flags, memorable
   *     moments)
   *   - §5.8 Authority trial reads `act1PublicWitnessBalance` via
   *     `computeAuthorityTrialOverride` to seed its
   *     `openingVerdictBalance` (the §5.7 → §5.8 handoff)
   */
  encounter?: StoryEncounter;
  /**
   * Optional custom player deck. When provided, replaces the default
   * STARTER_DECK_MAP lookup for the player side. Format: 39-ish card
   * def ids (string[]); if shorter than the format size, the engine
   * will still run — but the match won't be format-legal. The
   * DeckPickerModal already validates this against the shipped
   * registry before handing it off, so by the time it reaches
   * DuelystGameUI it's safe to pass through.
   */
  playerDeckCardDefIds?: readonly string[];
  onGameEnd: (winner: "player" | "opponent") => void;
  onBack: () => void;
}

type Phase = "mulligan" | "playing" | "ai_turn" | "game_over";
type SelectionMode = "none" | "move" | "attack" | "summon" | "spell_target";

interface LogEntry { text: string; type: "info" | "attack" | "spell" | "move" | "system"; }

function DuelystGameUI({ playerFaction, opponentFaction, isTutorial = false, onGameEnd, onBack, trialHistory, encounter, playerDeckCardDefIds }: DuelystGameUIProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BoardRenderer | null>(null);
  const tcgClientRef = useRef<TcgClient | null>(null);
  // Snapshot of the player's initial deck cardDefIds, captured at
  // match start. Used by the §4.9 Seer match-end flag-write to test
  // for burnt_card_placeholder (the canon-hidden winnable path).
  const initialPlayerDeckRef = useRef<readonly string[]>([]);
  // Guard so the §4.9 match-end flag writes fire exactly once.
  const seerFlagsWrittenRef = useRef(false);
  // §4.9 prophecy visual signal. Tracks the last observed
  // playsPerformed so the overlay mounts once per new prophecy
  // play and auto-dismisses after 800ms.
  const [showSeerPlayOverlay, setShowSeerPlayOverlay] = useState(false);
  const prevSeerPlaysRef = useRef(0);
  // Screen-reader match-start announcement — fired once when
  // seerProphecy first appears on state (spec §6.3).
  const seerAnnouncedRef = useRef(false);
  const {
    setNarrativeFlag,
    setAct1PublicWitnessBalance,
    adjustNarratorBond,
    completeRecruitmentMission,
    state: gameStateContext,
  } = useGame();
  const [gameState, setGameState] = useState<DuelystGameState | null>(null);
  const [phase, setPhase] = useState<Phase>("mulligan");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");
  const [mulliganSelections, setMulliganSelections] = useState<Set<number>>(new Set());
  // PR-1 — monotonic match-run id. Bumping this forces the init
  // useEffect below to re-run without having to tear down the
  // parent, which is how "Play Again" rebuilds a fresh match.
  const [matchRunId, setMatchRunId] = useState(0);
  // PR-1 — confirm modal gate for the concede action.
  const [showConcedeConfirm, setShowConcedeConfirm] = useState(false);
  // PR-1 — per-match stats captured for the MatchSummary screen.
  // Incremented by the existing card-play + event-ingest paths;
  // snapshot into `capturedMatchStats` at game-over so the summary
  // keeps them stable across re-renders of the ended state.
  const cardsPlayedRef = useRef(0);
  const [capturedMatchStats, setCapturedMatchStats] =
    useState<MatchSummaryStats | null>(null);
  const [capturedReward, setCapturedReward] = useState<EncounterReward | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [hoveredCard, setHoveredCard] = useState<DuelystCard | null>(null);
  const [turnFlash, setTurnFlash] = useState<string | null>(null);
  // Guard so combat_low_hp dispatches once per HP-threshold-crossing,
  // not on every re-render while HP sits below the threshold.
  const lowHpDispatchedRef = useRef(false);
  // Guard so quest increments fire once per match resolution, not
  // every re-render while phase === "game_over".
  const questsRecordedRef = useRef(false);
  /**
   * §5.7 Game Master match-end guard. Ensures
   * `setAct1PublicWitnessBalance` only fires once per match even if
   * React re-renders the ended-state several times (state transitions,
   * dialog callbacks, etc.). Reset at every new-match init below.
   */
  const publicWitnessBalanceCapturedRef = useRef(false);
  // Audit 3B — card-battle quest progression. FightPage already
  // fires fight-flavor quests; DuelystGameUI was the card-battle gap.
  // PR — quest-complete toast: when the server reports `completed:
  // true` on an updateProgress resolution, surface it so the player
  // knows their card-battle win just finished a daily/weekly.
  // Without this, the DB increment was silent (audit finding:
  // "card-battle quest progression wired but blind").
  const updateQuestProgress = trpc.quests.updateProgress.useMutation({
    onSuccess: (result, variables) => {
      if (!result || !("completed" in result)) return;
      if (!result.completed) return;
      const label = QUEST_LABELS[variables.questId] ?? variables.questId;
      toast.success(`Quest complete: ${label}`, {
        description: "Claim your reward in the Quest Board.",
        duration: 10000,
      });
    },
  });

  // PR — boss-mastery recordKill for Act 1 named encounters.
  // Fires once per player-win on a named-boss match. The server
  // returns { leveledUp, newMasteryLevel, reward }; on a level-up
  // with a cosmetic reward we toast it so the player sees the
  // unlock in the moment. Before this hook, BOSS_MASTERY_DEFS had
  // the 5 Act 1 entries but nothing called recordKill for them —
  // mastery silently stayed at 0 forever.
  const recordBossKill = trpc.bossMastery.recordKill.useMutation({
    onSuccess: (result, variables) => {
      if (!result?.leveledUp) return;
      const def = BOSS_MASTERY_DEFS.find((d) => d.bossKey === variables.bossKey);
      if (!def) return;
      const levelLabel =
        def.levels.find((l) => l.level === result.newMasteryLevel)?.label ??
        `Level ${result.newMasteryLevel}`;
      const reward = result.reward;
      if (reward?.type === "cosmetic") {
        toast.success(`${def.bossName}: ${levelLabel}`, {
          description: `Cosmetic unlocked — check your collection.`,
          duration: 12000,
        });
      } else if (reward?.type === "title") {
        toast.success(`${def.bossName}: ${levelLabel}`, {
          description: `Title earned — equip it from your profile.`,
          duration: 10000,
        });
      } else if (reward?.type === "card") {
        toast.success(`${def.bossName}: ${levelLabel}`, {
          description: `New card added to your collection.`,
          duration: 10000,
        });
      } else {
        // dream / xp — generic level-up toast.
        toast.success(`${def.bossName}: ${levelLabel}`, {
          description: `Mastery level ${result.newMasteryLevel}.`,
          duration: 8000,
        });
      }
    },
  });

  // §5.5 Warlord lockout — UI state. Spec:
  // docs/production/act1/warlord-three-move-mechanic.md.
  // - rejection: shown on locked-card click. The numeric `key` re-mounts
  //   the toast on each rejection so its fade timer restarts cleanly.
  // - lockoutEndedFadingOut: true for ~2s after the lockout ends, so the
  //   countdown indicator can animate its fade-out before unmounting.
  const [rejection, setRejection] = useState<{ key: number; message: string } | null>(null);
  const [lockoutEndedFadingOut, setLockoutEndedFadingOut] = useState(false);
  const prevLockoutPresentRef = useRef(false);
  const prevLockoutTurnsRef = useRef<number | null>(null);

  // §5.8 Authority trial — UI state. The transcript column collects
  // `trial_balance_changed` events from each dispatch result so the
  // column can render the cumulative trial plays. The counter drives
  // entry ids so React keys are stable across renders.
  const [trialTranscriptEntries, setTrialTranscriptEntries] = useState<TrialTranscriptEntry[]>([]);
  const trialEntrySeqRef = useRef(0);
  const prevTrialPresentRef = useRef(false);

  // §5.8.1 Light/Dark alignment pillar. Mounted when
  // gameState.trial.outcome transitions from undefined to set (the
  // verdict resolved at turn 10). The user picks one of Light/Dark;
  // the pick writes campaignState.lightDarkAlignment and hides the
  // pillar. Spec positions this as "the canonical alignment moment
  // of the entire game" (authority-trial-phase-mechanic.md §5).
  const [showLightDarkPillar, setShowLightDarkPillar] = useState(false);
  const prevTrialOutcomeRef = useRef<"overturn" | "sentence_passed" | undefined>(undefined);

  // §5.6 Programmer gift pillar. Mounted when
  // gameState.programmerGift?.status transitions to "offered" (the
  // Programmer AI's gift-offer moment). The pick dispatches the
  // programmer_gift_choice action AND writes the persistent
  // act1_programmer_gift_accepted campaign flag via
  // setProgrammerGiftAccepted(). Spec: §5.6.
  const [showProgrammerGiftPillar, setShowProgrammerGiftPillar] = useState(false);
  const prevGiftStatusRef = useRef<string | undefined>(undefined);

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState(0);
  const [lastActionType, setLastActionType] = useState<string | null>(null);
  const currentTutorialStep = isTutorial ? TUTORIAL_STEPS[tutorialStep] : null;

  // Tutorial steps are player-paced — no auto-advance timers.
  // Steps with autoAdvanceMs show a "tap to continue" indicator.
  // Steps with requiredAction wait for the player to perform the action.
  const advanceTutorial = useCallback(() => {
    if (!isTutorial) return;
    if (currentTutorialStep?.requiredAction) return; // Can't skip action-required steps by tapping
    if (tutorialStep < TUTORIAL_STEPS.length - 1) setTutorialStep(s => s + 1);
  }, [isTutorial, tutorialStep, currentTutorialStep]);

  const skipAllTutorial = useCallback(() => {
    if (!isTutorial) return;
    setTutorialStep(TUTORIAL_STEPS.length); // Skip past all steps
    localStorage.setItem("dischordia_tutorial_complete", "true");
  }, [isTutorial]);

  // Check if tutorial step action was completed
  useEffect(() => {
    if (!isTutorial || !currentTutorialStep?.requiredAction || !lastActionType) return;
    if (isTutorialActionComplete(currentTutorialStep, lastActionType)) {
      setLastActionType(null);
      if (tutorialStep < TUTORIAL_STEPS.length - 1) setTutorialStep(s => s + 1);
    }
  }, [isTutorial, tutorialStep, currentTutorialStep, lastActionType]);

  const addLog = useCallback((text: string, type: LogEntry["type"] = "info") => {
    setLog(prev => [...prev.slice(-50), { text, type }]);
  }, []);

  /**
   * §5.8 Authority trial — extract trial_balance_changed events from a
   * dispatch result and append them to the transcript column. Also
   * surface a `phase_violation` error as a rejection toast with the
   * spec §2.1 "Counsel — this is not the phase for that." line.
   *
   * Called from every play_card dispatch site. No-op on non-trial
   * matches (the events simply won't include trial_balance_changed
   * entries and a phase_violation error only surfaces from §5.8
   * matches by engine-side construction).
   */
  const processTrialDispatchResult = useCallback(
    (result: TcgDispatchResult) => {
      // Phase-violation rejection toast (spec §2.1).
      if (result.error && result.error.startsWith("phase_violation:")) {
        setRejection((r) => ({
          key: (r?.key ?? 0) + 1,
          message: "Counsel — this is not the phase for that.",
        }));
      }
      // Append transcript entries from any trial_balance_changed
      // events in this dispatch. Each event corresponds to one
      // admissible card play. The event carries cardDefId only; the
      // human-readable name comes from the player's hand if the card
      // is still there (units that deployed this turn) or falls back
      // to the defId. A follow-up PR can add a registry-lookup when
      // §5.7's transcript handoff lands.
      const newEntries: TrialTranscriptEntry[] = [];
      for (const ev of result.events) {
        if (ev.type !== "trial_balance_changed") continue;
        const playerHand = gameState?.players[ev.player].hand;
        const card = playerHand?.find(
          (c) => c.sagaCardId === ev.cardDefId || c.id === ev.cardDefId,
        );
        const cardName = card?.name ?? ev.cardDefId;
        // Phase comes from the current turnNumber; during trial mode
        // the engine keeps phaseNumber === turnNumber per spec §2.
        const phaseNumber = result.viewState.turnNumber;
        trialEntrySeqRef.current += 1;
        newEntries.push({
          id: `trial_${trialEntrySeqRef.current}`,
          cardName,
          phaseNumber,
          delta: ev.delta,
        });
      }
      if (newEntries.length > 0) {
        setTrialTranscriptEntries((prev) => [...prev, ...newEntries]);
      }
    },
    [gameState],
  );

  // Initialize game — uses the shared tcg-core reducer via TcgClient.
  // buildStarterDeck returns DuelystCard[] from the old cardAdapter; we
  // map to card def ids via sagaCardId for the tcg-core match init.
  // [DEFERRED] Celebration trial combat buffs (trialHistory →
  // trialToCombatBuff) will be re-integrated against the tcg-core state
  // shape once the trial system is adapted to the new engine.
  useEffect(() => {
    // PR-3 — custom deck passed from the DeckPickerModal wins over
    // the default starter lookup. Otherwise prefer the curated
    // starter deck for this faction; fall back to the ad-hoc
    // builder if no starter is registered.
    const playerStarter = STARTER_DECK_MAP[playerFaction];
    const p1DeckCardIds: string[] =
      playerDeckCardDefIds && playerDeckCardDefIds.length > 0
        ? [...playerDeckCardDefIds]
        : playerStarter
          ? [...playerStarter.cardDefIds]
          : buildStarterDeck(playerFaction).map((c) => c.sagaCardId ?? c.id);
    // Stash the player's starting deck so the §4.9 match-end hook
    // can check for burnt_card_placeholder regardless of how many
    // cards remain in deck/hand/graveyard at resolution time.
    initialPlayerDeckRef.current = p1DeckCardIds;
    seerFlagsWrittenRef.current = false;
    publicWitnessBalanceCapturedRef.current = false;
    // PR-1 — new match, reset stats + reward capture so the
    // MatchSummary shows fresh numbers (not carryover from the
    // previous match).
    cardsPlayedRef.current = 0;
    setCapturedMatchStats(null);
    setCapturedReward(null);
    questsRecordedRef.current = false;

    // Encounter-mode path: use the boss's faction / general / deck /
    // modes. The §5.8 Authority trial's openingVerdictBalance comes
    // from the §5.7 handoff (`computeAuthorityTrialOverride`) — any
    // other encounter's trialMode passes through unchanged.
    let p2FactionToUse: string = opponentFaction;
    let p2DeckCardIds: string[];
    let p2GeneralDefId: string | undefined;
    let trialMode = encounter?.trialMode;
    if (encounter) {
      p2FactionToUse = encounter.bossFaction;
      p2DeckCardIds = [...encounter.bossDeckCardDefIds];
      p2GeneralDefId = encounter.bossGeneralDefId;
      if (encounter.id === "ch_authority_trial") {
        const override = computeAuthorityTrialOverride(
          gameStateContext.act1PublicWitnessBalance,
        );
        if (override) trialMode = override;
      }
    } else {
      const opponentStarter = STARTER_DECK_MAP[opponentFaction];
      p2DeckCardIds = opponentStarter
        ? [...opponentStarter.cardDefIds]
        : buildStarterDeck(opponentFaction).map((c) => c.sagaCardId ?? c.id);
    }

    const client = TcgClient.init({
      p1Faction: playerFaction,
      p1DeckCardIds,
      p2Faction: p2FactionToUse,
      p2DeckCardIds,
      p2GeneralDefId,
      seed: encounter?.seed,
      trialMode,
      giftMode: encounter?.giftMode,
      witnessMode: encounter?.witnessMode,
      prophecyMode: encounter?.prophecyMode,
      scriptedActions: encounter?.scriptedActions,
    });
    tcgClientRef.current = client;
    setGameState(asGameState(client.getViewState()));
    addLog(
      encounter
        ? `${encounter.name} — choose cards to mulligan.`
        : "Game started. Choose cards to mulligan.",
      "system",
    );
  }, [
    playerFaction,
    opponentFaction,
    trialHistory,
    addLog,
    encounter,
    gameStateContext.act1PublicWitnessBalance,
    matchRunId,
    playerDeckCardDefIds,
  ]);

  // Initialize renderer
  useEffect(() => {
    if (!canvasRef.current || rendererRef.current) return;
    const renderer = new BoardRenderer();
    rendererRef.current = renderer;
    renderer.init(canvasRef.current).then(() => {
      if (gameState) renderer.update(gameState);
    });
    return () => { renderer.destroy(); rendererRef.current = null; };
  }, []);

  // Update renderer when state changes
  useEffect(() => {
    if (gameState && rendererRef.current) {
      rendererRef.current.update(gameState);
    }
  }, [gameState]);

  // Set renderer callbacks
  useEffect(() => {
    if (!rendererRef.current) return;
    rendererRef.current.setCallbacks(
      (row, col) => handleTileClick(row, col),
      (unitId) => handleUnitClick(unitId),
    );
  });

  // §5.7 → §5.8 campaign handoff. When a Game-Master-style match
  // (witnessMode opt-in → `gameState.publicWitness` populated) ends,
  // persist the final balance to campaign state so the §5.8 Authority
  // trial can translate it into `openingVerdictBalance` via
  // `computeAuthorityTrialOverride` + `deriveAuthorityVerdictOffset`.
  // Guarded by publicWitnessBalanceCapturedRef to fire exactly once.
  useEffect(() => {
    if (!gameState || phase === "mulligan") return;
    if (gameState.winner === null) return;
    if (!gameState.publicWitness) return;
    if (publicWitnessBalanceCapturedRef.current) return;
    publicWitnessBalanceCapturedRef.current = true;
    rememberPublicWitnessBalance(
      setAct1PublicWitnessBalance,
      gameState.publicWitness.balance,
    );
  }, [gameState, phase, setAct1PublicWitnessBalance]);

  // Check win condition
  useEffect(() => {
    if (!gameState || phase === "mulligan") return;
    if (gameState.winner !== null) {
      setPhase("game_over");
      onGameEnd(gameState.winner === 0 ? "player" : "opponent");
      // Audit 3B — card-battle quest progression. Mirrors FightPage's
      // match-end quest hook; fires once per match via the guard ref.
      // `d_play_3_battles` counts completions (win or loss);
      // `d_play_card_battle` + weekly + season count wins only.
      if (!questsRecordedRef.current) {
        questsRecordedRef.current = true;
        updateQuestProgress.mutate({ questId: "d_play_3_battles", increment: 1 });
        if (gameState.winner === 0) {
          updateQuestProgress.mutate({ questId: "d_play_card_battle", increment: 1 });
          updateQuestProgress.mutate({ questId: "w_win_10_battles", increment: 1 });
          updateQuestProgress.mutate({ questId: "e_win_100_battles", increment: 1 });
          // PR-1 — reanimate the `dischordia_wins` counter that
          // `useNarrativeIntegration.ts:787` reads for Act 1 cycle
          // milestone triggers. This counter was a dead wire before
          // today: cycle A/B/C flags (act_1_cycle_a_complete at 3
          // wins, ...) could not fire from live card battles because
          // nothing incremented it.
          try {
            const prev = parseInt(
              localStorage.getItem("dischordia_wins") ?? "0",
              10,
            );
            localStorage.setItem(
              "dischordia_wins",
              String(Number.isFinite(prev) ? prev + 1 : 1),
            );
          } catch {
            /* localStorage unavailable — counter skipped, no throw */
          }
        }
        // P1.1 campaign deltas — apply the per-encounter reward row
        // when a named boss match resolves. Guarded by
        // questsRecordedRef alongside the quest writes so both
        // side-effects fire at most once per match. Non-named
        // encounters and faction-vs-faction matches have no row and
        // skip this block silently.
        let appliedReward: EncounterReward | null = null;
        if (encounter) {
          const outcome: EncounterOutcome =
            gameState.winner === 0 ? "win" : "loss";
          // PR — boss-mastery recordKill on player victory. Keyed
          // off the encounter id via the shared mapping
          // (bossMasteryKeyForEncounter). Wrapped in a condition so
          // losses / non-named encounters skip the mutation.
          if (outcome === "win") {
            const bossKey = bossMasteryKeyForEncounter(encounter.id);
            if (bossKey) {
              recordBossKill.mutate({
                bossKey,
                difficulty: "normal",
              });
            }
          }
          const reward = getEncounterReward(encounter.id, outcome);
          if (reward) {
            appliedReward = reward;
            if (reward.narratorBondDelta) {
              adjustNarratorBond(reward.narratorBondDelta);
            }
            if (reward.armyRecruitmentMission) {
              completeRecruitmentMission(reward.armyRecruitmentMission);
            }
            if (reward.flagsToSet) {
              for (const flag of reward.flagsToSet) setNarrativeFlag(flag, true);
            }
            if (reward.memorableMoments) {
              for (const m of reward.memorableMoments) {
                recordMemorableMoment(m.kind, m.subtitle);
              }
            }
          }
        }
        // PR-1 — freeze the summary snapshot so MatchSummary reads
        // stable values across state-resolution re-renders.
        setCapturedReward(appliedReward);
        setCapturedMatchStats({
          turnsTaken: gameState.turnNumber ?? 1,
          cardsPlayed: cardsPlayedRef.current,
          conceded: gameState.winReason === "surrender",
        });
        // Victory/defeat sting — the SoundManager's "victory" and
        // "defeat" cases were authored but never called.
        dischordiaSounds.play(gameState.winner === 0 ? "victory" : "defeat");
      }
    }
  }, [
    gameState,
    phase,
    onGameEnd,
    updateQuestProgress,
    encounter,
    adjustNarratorBond,
    completeRecruitmentMission,
    setNarrativeFlag,
  ]);

  // Inner-voice dispatch: audit 2H — combat_low_hp fires exactly
  // once when the player's general drops below 25% max HP. Guarded
  // by a ref so re-renders while already-low don't spam the whisper
  // panel (the VoiceWhisper listener has its own 15s cooldown but a
  // fresh dispatch every tick is still wasteful).
  useEffect(() => {
    if (!gameState || phase !== "playing") return;
    const playerGeneral = findUnit(gameState, gameState.players[0].generalId);
    if (!playerGeneral) return;
    const max = playerGeneral.maxHealth ?? 25;
    const cur = playerGeneral.currentHealth ?? max;
    const pct = max > 0 ? cur / max : 1;
    if (pct < 0.25 && !lowHpDispatchedRef.current) {
      lowHpDispatchedRef.current = true;
      dispatchVoiceWhisper(
        { type: "combat_low_hp" },
        (gameStateContext.innerVoiceSkills ?? {}) as Record<string, number>,
      );
    } else if (pct >= 0.25 && lowHpDispatchedRef.current) {
      // Reset the guard when HP recovers so a second crossing re-fires.
      lowHpDispatchedRef.current = false;
    }
  }, [gameState, phase, gameStateContext.innerVoiceSkills]);

  // §4.9 Seer match end — write the canonical outcome flags once the
  // match resolves. deriveSeerOutcome picks between defeated /
  // scripted_loss / fled based on:
  //   • conceded (winReason === "surrender") → fled
  //   • player-side victory + burnt-card-in-deck → defeated (the one
  //     winnable path, spec §3.3)
  //   • prophecy sequence completed → scripted_loss
  // ACT1_CYCLE_B_COMPLETE_FLAG auto-fires the "to-be-the-human"
  // slideshow via SLIDESHOW_TRIGGERS in useNarrativeIntegration, so
  // no separate cinematic wiring is needed here.
  useEffect(() => {
    if (!gameState || !gameState.seerProphecy) return;
    if (gameState.winner === null) return;
    if (seerFlagsWrittenRef.current) return;
    seerFlagsWrittenRef.current = true;

    const conceded = gameState.winReason === "surrender";
    const seerGeneralKilled = gameState.winner === 0 && !conceded;
    const winnablePathUnlocked = playerDeckUnlocksWinnablePath(
      initialPlayerDeckRef.current,
    );
    const outcome = deriveSeerOutcome({
      conceded,
      seerGeneralKilled,
      winnablePathUnlocked,
      playsPerformed: gameState.seerProphecy.playsPerformed,
      turnCount: 6,
    });
    if (outcome) {
      setNarrativeFlag(SEER_OUTCOME_FLAGS[outcome], true);
    }
    setNarrativeFlag(SEER_STAFF_WITNESSED_FLAG, true);
    setNarrativeFlag(ACT1_CYCLE_B_COMPLETE_FLAG, true);
  }, [gameState, setNarrativeFlag]);

  // §4.9 match-start screen-reader announcement (spec §6.3). Fires
  // exactly once per playthrough when seerProphecy first appears on
  // state — tells screen-reader users about the asymmetric rule
  // without naming the winnable-path secret (spec §6.3 note).
  useEffect(() => {
    if (!gameState?.seerProphecy) return;
    if (seerAnnouncedRef.current) return;
    seerAnnouncedRef.current = true;
    announce(
      "The Seer plays cards from a future turn. Her hand count does not decrease.",
      true,
    );
  }, [gameState]);

  // §4.9 prophecy visual signal. Watches the playsPerformed counter
  // and shows SeerPlayOverlay for 800ms on each increment. Also
  // announces the individual play for screen-readers — the match-
  // start announcement covers the general rule; this confirms the
  // specific moment of a new retroactive play.
  useEffect(() => {
    if (!gameState?.seerProphecy) return;
    const plays = gameState.seerProphecy.playsPerformed;
    if (plays > prevSeerPlaysRef.current) {
      prevSeerPlaysRef.current = plays;
      setShowSeerPlayOverlay(true);
      // Spec §6.3 — full screen-reader sentence including the hand-
      // count invariant, so AT users get the same mechanical rule as
      // the sighted players see via SeerPlayOverlay's "hand size
      // preserved" visual.
      announce(
        "The Seer plays a card from a future turn. Her hand count does not decrease.",
      );
    }
  }, [gameState]);

  // §5.8 Authority trial — screen-reader announcement on match start +
  // transcript reset. The TrialPhaseIndicator's own aria-live region
  // handles the verdict announcement when `outcome` lands, so this
  // effect only needs to handle the match-begins case.
  useEffect(() => {
    if (!gameState) return;
    const trialPresent = !!gameState.trial;
    if (trialPresent && !prevTrialPresentRef.current) {
      announce(
        "Authority trial begins. Ten phases. What do you say to the charges?",
        true,
      );
      setTrialTranscriptEntries([]);
      trialEntrySeqRef.current = 0;
    }
    prevTrialPresentRef.current = trialPresent;
  }, [gameState]);

  // §5.8.1 Light/Dark alignment — mount the pillar when the trial
  // outcome resolves (verdict phase). The pillar is the canonical
  // alignment moment of the entire game per spec §5; it fires after
  // every trial regardless of overturn / sentence_passed outcome.
  // The previous-outcome ref detects the undefined→set transition so
  // we don't re-mount on every render.
  useEffect(() => {
    const outcome = gameState?.trial?.outcome;
    if (outcome && !prevTrialOutcomeRef.current) {
      setShowLightDarkPillar(true);
      // Inner-voice dispatch: audit 2H — any skill with a
      // choice_presented utterance whispers as the pillar mounts.
      dispatchVoiceWhisper(
        { type: "choice_presented" },
        (gameStateContext.innerVoiceSkills ?? {}) as Record<string, number>,
      );
      // P1.3 campaign persistence — raise the canonical outcome
      // flag so the Act 1 cycle watcher can gate `act_1_complete`
      // on a real verdict landing. Spec
      // `authority-trial-phase-mechanic.md` §6 defines two outcomes
      // (overturn / sentence_passed); we raise one per-outcome flag
      // plus a shared `act1_authority_outcome` marker so downstream
      // readers can do either "which outcome?" (check the specific
      // flag) or "did the trial resolve?" (check the marker).
      setNarrativeFlag("act1_authority_outcome", true);
      setNarrativeFlag(`act1_authority_${outcome}`, true);
    }
    prevTrialOutcomeRef.current = outcome;
  }, [gameState, gameStateContext.innerVoiceSkills, setNarrativeFlag]);

  // §5.6 gift pillar — fires on the not_offered → offered transition.
  // Once the player resolves (accepted/declined), the status moves
  // terminal and the pillar stays hidden.
  useEffect(() => {
    const status = gameState?.programmerGift?.status;
    if (status === "offered" && prevGiftStatusRef.current !== "offered") {
      setShowProgrammerGiftPillar(true);
      dispatchVoiceWhisper(
        { type: "choice_presented" },
        (gameStateContext.innerVoiceSkills ?? {}) as Record<string, number>,
      );
    }
    if (status === "accepted" || status === "declined") {
      setShowProgrammerGiftPillar(false);
    }
    prevGiftStatusRef.current = status;
  }, [gameState, gameStateContext.innerVoiceSkills]);

  // §5.8.1 pick handler: write the persistent alignment flag + hide
  // the pillar. The component's own state prevents re-clicks mid-
  // animation; this handler fires exactly once per playthrough.
  const handleLightDarkPick = useCallback(
    (alignment: LightDarkAlignment) => {
      setLightDarkAlignment(alignment);
      addLog(
        alignment === "light"
          ? "You chose to carry what the Engineer died for."
          : "You let the Engineer's thought die uncarried.",
        "system",
      );
      // Hide after a short delay so the component's own "picked"
      // animation has time to play (the component locks on click
      // and runs a ~500ms transition).
      setTimeout(() => setShowLightDarkPillar(false), 800);
    },
    [addLog],
  );

  // §5.6 gift pick handler: dispatch the reducer action (transitions
  // GameState.programmerGift to accepted|declined and ends the match
  // on accept), write the persistent campaign flag, and add a log
  // line. Fires once per playthrough — the component's internal lock
  // guards against re-clicks during the transition.
  const handleProgrammerGiftPick = useCallback(
    (choice: ProgrammerGiftChoice) => {
      const accepted = choice === "accept";
      setProgrammerGiftAccepted(accepted);
      const client = tcgClientRef.current;
      if (client) {
        client.dispatch({ type: "programmer_gift_choice", choice });
      }
      // P1.2 — the Programmer gift accept/decline branch needs a
      // downstream consequence so the choice isn't a flag-only null
      // op. Accepting the throw is a sacrifice — the Programmer
      // vanishes and doesn't return — which deepens the player's
      // bond with The Human (shared grief of the witness track).
      // Declining raises a dedicated flag so Acts 2+ dialog can
      // acknowledge the refusal.
      if (accepted) {
        adjustNarratorBond(5);
        recordMemorableMoment(
          "bond_peak",
          "The night you let the Programmer throw the match.",
          undefined,
          { choice: "accept" },
        );
      } else {
        setNarrativeFlag("act1_programmer_gift_declined", true);
      }
      addLog(
        accepted
          ? "The Programmer vanishes that night and does not return. You take the win."
          : "You decline the gift. The Programmer smiles, and plays the next turn honestly.",
        "system",
      );
      setTimeout(() => setShowProgrammerGiftPillar(false), 800);
    },
    [addLog, adjustNarratorBond, setNarrativeFlag],
  );

  // §5.5 Warlord lockout — screen-reader announcements + fade-out.
  // Spec §6.4 specifies the exact strings; the fade-out lets the
  // countdown indicator animate before unmounting. The previous-state
  // refs detect transitions; we don't announce on every state change.
  useEffect(() => {
    if (!gameState) return;
    const lockoutPresent = !!gameState.lockout;
    const wasPresent = prevLockoutPresentRef.current;

    if (lockoutPresent && !wasPresent) {
      announce(
        "Warlord Zero has forced a three-turn lockout. Your hand is narrowed to two playable cards per turn for the next three turns. Countdown active.",
        true,
      );
      setLockoutEndedFadingOut(false);
    } else if (!lockoutPresent && wasPresent) {
      announce("Lockout ended. Full hand restored.", true);
      // Trigger 2-second fade-out window for the indicator. The parent
      // unmounts the indicator after the fade by toggling fadingOut
      // and then clearing the wasPresent flag on the next pass.
      setLockoutEndedFadingOut(true);
      const t = setTimeout(() => setLockoutEndedFadingOut(false), 2000);
      // Note: the timeout cleanup on re-trigger is intentional — if
      // another lockout starts mid-fade, the new effect-pass cancels
      // this fade.
      return () => clearTimeout(t);
    }

    prevLockoutPresentRef.current = lockoutPresent;
    prevLockoutTurnsRef.current = gameState.lockout?.turnsRemaining ?? null;
  }, [gameState]);

  /* ─── MULLIGAN ─── */
  const handleMulligan = useCallback(() => {
    if (!gameState || !tcgClientRef.current) return;
    const client = tcgClientRef.current;
    // Player mulligan
    const playerIndices = [...mulliganSelections];
    if (playerIndices.length > 0) {
      client.dispatch({ type: "mulligan", replaceIndices: playerIndices });
    }
    client.dispatch({ type: "finish_mulligan" });
    // AI mulligan — use the projected view state for AI scoring
    const viewAfterPlayer = asGameState(client.getViewState());
    const aiIndices = getAIMulliganIndices(viewAfterPlayer.players[1].hand);
    if (aiIndices.length > 0) {
      client.dispatchOpponent({ type: "mulligan", replaceIndices: aiIndices });
    }
    client.dispatchOpponent({ type: "finish_mulligan" });
    // Both done → phase transitions to "playing" via the reducer
    const finalView = asGameState(client.getViewState());
    setGameState(finalView);
    setPhase("playing");
    // Inner-voice dispatch: audit 2H — combat_start is the canonical
    // "match has begun" beat. Any skill with a registered utterance
    // for this trigger surfaces a whisper via the global VoiceWhisper
    // listener. No-op when no utterance qualifies.
    dispatchVoiceWhisper(
      { type: "combat_start" },
      (gameStateContext.innerVoiceSkills ?? {}) as Record<string, number>,
    );
    addLog(`Mulligan complete. Your turn — ${finalView.players[0].mana} mana available.`, "system");
    setTurnFlash("YOUR TURN");
    setTimeout(() => setTurnFlash(null), 1500);
  }, [gameState, mulliganSelections, addLog]);

  /* ─── TILE CLICK ─── */
  const handleTileClick = useCallback((row: number, col: number) => {
    if (!gameState || phase !== "playing" || gameState.currentPlayer !== 0) return;

    if (selectionMode === "move" && selectedUnit) {
      const moves = getValidMoves(gameState, selectedUnit);
      if (moves.some(([r, c]) => r === row && c === col)) {
        const result = tcgClientRef.current!.dispatch({ type: "move", unitId: selectedUnit, toRow: row, toCol: col });
        setGameState(asGameState(result.viewState));
        addLog(`Moved unit to (${row}, ${col})`, "move");
        dischordiaSounds.play("card_play");
        if (isTutorial) setLastActionType("move");
        clearSelection();
        rendererRef.current?.clearHighlights();
        return;
      }
    }

    if (selectionMode === "summon" && selectedCard !== null) {
      const card = gameState.players[0].hand[selectedCard];
      if (card) {
        const tiles = getValidSummonTiles(gameState, card, 0);
        if (tiles.some(([r, c]) => r === row && c === col)) {
          const result = tcgClientRef.current!.dispatch({ type: "play_card", cardIndex: selectedCard, row, col });
          setGameState(asGameState(result.viewState));
          processTrialDispatchResult(result);
          if (result.ok) cardsPlayedRef.current += 1;
          addLog(`Summoned ${card.name} at (${row}, ${col})`, "spell");
          dischordiaSounds.play("unit_summon");
          if (isTutorial) setLastActionType("play_card");
          clearSelection();
          rendererRef.current?.clearHighlights();
          return;
        }
      }
    }

    clearSelection();
    rendererRef.current?.clearHighlights();
  }, [gameState, phase, selectionMode, selectedUnit, selectedCard, addLog, processTrialDispatchResult]);

  /* ─── UNIT CLICK ─── */
  const handleUnitClick = useCallback((unitId: string) => {
    if (!gameState || phase !== "playing" || gameState.currentPlayer !== 0) return;

    const unit = findUnit(gameState, unitId);
    if (!unit) return;

    // If in attack mode and clicking enemy
    if (selectionMode === "attack" && selectedUnit && unit.owner === 1) {
      const targets = getValidAttacks(gameState, selectedUnit);
      if (targets.includes(unitId)) {
        const attacker = findUnit(gameState, selectedUnit);
        const result = tcgClientRef.current!.dispatch({ type: "attack", attackerId: selectedUnit, targetId: unitId });
        setGameState(asGameState(result.viewState));
        addLog(`${attacker?.card.name} attacks ${unit.card.name}!`, "attack");
        dischordiaSounds.play("attack_hit");
        if (attacker) rendererRef.current?.showDamageNumber(unit.row, unit.col, attacker.currentAttack);
        if (isTutorial) setLastActionType("attack");
        clearSelection();
        rendererRef.current?.clearHighlights();
        return;
      }
    }

    // If in spell target mode
    if (selectionMode === "spell_target" && selectedCard !== null) {
      const card = gameState.players[0].hand[selectedCard];
      if (card) {
        const result = tcgClientRef.current!.dispatch({ type: "play_card", cardIndex: selectedCard, row: unit.row, col: unit.col, targetId: unitId });
        setGameState(asGameState(result.viewState));
        processTrialDispatchResult(result);
        if (result.ok) cardsPlayedRef.current += 1;
        addLog(`Cast ${card.name} on ${unit.card.name}`, "spell");
        dischordiaSounds.play("spell_cast");
        clearSelection();
        rendererRef.current?.clearHighlights();
        return;
      }
    }

    // Select own unit
    if (unit.owner === 0) {
      setSelectedUnit(unitId);
      setSelectedCard(null);
      setSelectionMode("none");
      rendererRef.current?.clearHighlights();
      rendererRef.current?.highlightSelected(unitId, gameState);

      // Show move tiles
      const moves = getValidMoves(gameState, unitId);
      if (moves.length > 0) rendererRef.current?.highlightTiles(moves, 0x00ff88);

      // Show attack targets
      const attacks = getValidAttacks(gameState, unitId);
      if (attacks.length > 0) rendererRef.current?.highlightUnits(attacks, gameState, 0xff4444);
    }
  }, [gameState, phase, selectionMode, selectedUnit, selectedCard, addLog, processTrialDispatchResult]);

  /* ─── CARD CLICK ─── */
  const handleCardClick = useCallback((index: number) => {
    if (!gameState || phase !== "playing" || gameState.currentPlayer !== 0) return;
    const card = gameState.players[0].hand[index];
    if (!card || card.manaCost > gameState.players[0].mana) return;

    // §5.5 Warlord lockout — reject locked-card clicks before
    // dispatching to the engine. The engine's play_card handler
    // would also reject (with code "card_locked"), but giving the
    // user immediate visual feedback (the rust-orange toast)
    // matters more than the round-trip. card.id IS the entityId in
    // the legacy view shape; see compat/viewAdapter.ts.
    if (
      gameState.lockout &&
      gameState.lockout.targetSide === 0 &&
      gameState.lockout.lockedEntityIds.includes(card.id)
    ) {
      setRejection((r) => ({
        key: (r?.key ?? 0) + 1,
        message: "locked — next turn",
      }));
      return;
    }

    if (card.cardType === "unit") {
      const tiles = getValidSummonTiles(gameState, card, 0);
      if (tiles.length === 0) return;
      setSelectedCard(index);
      setSelectedUnit(null);
      setSelectionMode("summon");
      rendererRef.current?.clearHighlights();
      rendererRef.current?.highlightTiles(tiles, 0x4488ff);
      addLog(`Select a tile to summon ${card.name}`, "info");
    } else if (card.cardType === "spell") {
      if (card.spellEffect?.target === "self" || card.spellEffect?.type === "draw") {
        const result = tcgClientRef.current!.dispatch({ type: "play_card", cardIndex: index, row: 0, col: 0 });
        setGameState(asGameState(result.viewState));
        processTrialDispatchResult(result);
        if (result.ok) cardsPlayedRef.current += 1;
        addLog(`Cast ${card.name}`, "spell");
        clearSelection();
      } else {
        setSelectedCard(index);
        setSelectedUnit(null);
        setSelectionMode("spell_target");
        addLog(`Select a target for ${card.name}`, "info");
      }
    } else if (card.cardType === "artifact") {
      const result = tcgClientRef.current!.dispatch({ type: "play_card", cardIndex: index, row: 0, col: 0 });
      setGameState(asGameState(result.viewState));
      processTrialDispatchResult(result);
      if (result.ok) cardsPlayedRef.current += 1;
      addLog(`Equipped ${card.name}`, "spell");
      dischordiaSounds.play("card_play");
      clearSelection();
    }
  }, [gameState, phase, addLog, processTrialDispatchResult]);

  /* ─── ACTIONS ─── */
  const handleMoveMode = useCallback(() => {
    if (!selectedUnit || !gameState) return;
    setSelectionMode("move");
    rendererRef.current?.clearHighlights();
    const moves = getValidMoves(gameState, selectedUnit);
    rendererRef.current?.highlightTiles(moves, 0x00ff88);
  }, [selectedUnit, gameState]);

  const handleAttackMode = useCallback(() => {
    if (!selectedUnit || !gameState) return;
    setSelectionMode("attack");
    rendererRef.current?.clearHighlights();
    const attacks = getValidAttacks(gameState, selectedUnit);
    rendererRef.current?.highlightUnits(attacks, gameState, 0xff4444);
  }, [selectedUnit, gameState]);

  const handleEndTurn = useCallback(() => {
    if (!gameState || phase !== "playing" || !tcgClientRef.current) return;
    const client = tcgClientRef.current;
    const endResult = client.dispatch({ type: "end_turn" });
    const state = asGameState(endResult.viewState);
    setGameState(state);
    setPhase("ai_turn");
    addLog("Your turn ended. AI is thinking...", "system");
    dischordiaSounds.play("turn_end");
    if (isTutorial) setLastActionType("end_turn");
    setTurnFlash("ENEMY TURN");
    setTimeout(() => setTurnFlash(null), 1500);
    clearSelection();
    rendererRef.current?.clearHighlights();

    // AI turn — actions dispatch through TcgClient.dispatchOpponent
    const runAITurn = async () => {
      await new Promise(r => setTimeout(r, 500));
      const aiView = asGameState(client.getViewState());
      const aiActions = getAIActions(aiView, {
        // PR-4 — named-boss AI concedes at severe disadvantage for a
        // dramatic end-of-match moment. Faction-vs-faction sparring
        // and PvP matches keep the standard "fight to last HP"
        // contract.
        allowConcede: !!encounter,
      });

      for (const action of aiActions) {
        await new Promise(r => setTimeout(r, 350));
        const result = client.dispatchOpponent(action as unknown as Record<string, unknown>);
        const currentView = asGameState(result.viewState);
        setGameState(currentView);

        if (action.type === "attack") { addLog(`AI attacks!`, "attack"); dischordiaSounds.play("attack_hit"); }
        else if (action.type === "play_card") { addLog(`AI plays a card`, "spell"); dischordiaSounds.play("unit_summon"); }
        else if (action.type === "move") { addLog(`AI moves a unit`, "move"); }
        else if (action.type === "bloodborn_spell") { addLog(`AI uses Bloodborn Spell!`, "spell"); dischordiaSounds.play("spell_cast"); }
        else if (action.type === "concede") { addLog(`${encounter?.name ?? "The opponent"} withdraws from the match.`, "system"); }

        // Check if game ended after AI action
        if (currentView.phase === "ended") return;

        if (action.type === "end_turn") {
          setPhase("playing");
          addLog(`Your turn — ${currentView.players[0].mana} mana available.`, "system");
          dischordiaSounds.play("turn_start");
          setTurnFlash("YOUR TURN");
          setTimeout(() => setTurnFlash(null), 1500);
        }
      }
    };
    runAITurn();
  }, [gameState, phase, addLog]);

  const handleReplace = useCallback((index: number) => {
    if (!gameState || gameState.players[0].replaceUsed || !tcgClientRef.current) return;
    const card = gameState.players[0].hand[index];
    const result = tcgClientRef.current.dispatch({ type: "replace_card", cardIndex: index });
    setGameState(asGameState(result.viewState));
    addLog(`Replaced ${card?.name}`, "info");
    dischordiaSounds.play("card_draw");
  }, [gameState, addLog]);

  const handleBBS = useCallback(() => {
    if (!gameState || gameState.players[0].bloodbornUsed || gameState.players[0].mana < 1 || !tcgClientRef.current) return;
    const result = tcgClientRef.current.dispatch({ type: "bloodborn_spell" });
    setGameState(asGameState(result.viewState));
    addLog(`Used Bloodborn Spell!`, "spell");
    dischordiaSounds.play("spell_cast");
  }, [gameState, addLog]);

  const clearSelection = () => {
    setSelectedUnit(null);
    setSelectedCard(null);
    setSelectionMode("none");
  };

  if (!gameState) return <div className="flex items-center justify-center h-full"><div className="text-primary animate-pulse font-mono">INITIALIZING BATTLE...</div></div>;

  const player = gameState.players[0];
  const opponent = gameState.players[1];
  const playerGen = findUnit(gameState, player.generalId);
  const opponentGen = findUnit(gameState, opponent.generalId);

  /* ─── MULLIGAN SCREEN ─── */
  if (phase === "mulligan") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 p-4">
        <h2 className="font-display text-xl tracking-[0.2em] text-primary">MULLIGAN PHASE</h2>
        <p className="font-mono text-sm text-muted-foreground">Select cards to replace, then confirm</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {player.hand.map((card, i) => (
            <button
              key={i}
              onClick={() => {
                const next = new Set(mulliganSelections);
                if (next.has(i)) next.delete(i); else next.add(i);
                setMulliganSelections(next);
              }}
              className={`w-36 rounded-lg border-2 p-3 text-left transition-all ${
                mulliganSelections.has(i)
                  ? "border-destructive bg-destructive/10 opacity-60"
                  : "border-border bg-card hover:border-primary"
              }`}
            >
              {card.imageUrl && <img src={card.imageUrl} alt="" className="w-full h-20 object-cover rounded mb-2" />}
              <p className="font-mono text-xs font-bold truncate">{card.name}</p>
              <div className="flex justify-between mt-1">
                <span className="text-[var(--space-sm)] void-text-energy font-mono">{card.manaCost} mana</span>
                {card.cardType === "unit" && (
                  <span className="text-[var(--space-sm)] text-muted-foreground font-mono">{card.attack}/{card.health}</span>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 line-clamp-2">{card.abilityText}</p>
            </button>
          ))}
        </div>
        <button onClick={handleMulligan} className="px-6 py-2 bg-primary text-primary-foreground rounded font-mono text-sm hover:bg-primary/80 transition-colors">
          CONFIRM ({mulliganSelections.size} replaced)
        </button>
      </div>
    );
  }

  /* ─── GAME OVER ─── */
  if (phase === "game_over") {
    const won = gameState.winner === 0;
    // Fallback stats snapshot if the ended-effect fires before the
    // state setter commits (single-frame race on strict-mode double
    // invoke) — the summary still renders reasonable numbers.
    const stats: MatchSummaryStats = capturedMatchStats ?? {
      turnsTaken: gameState.turnNumber ?? 1,
      cardsPlayed: cardsPlayedRef.current,
      conceded: gameState.winReason === "surrender",
    };
    return (
      <MatchSummary
        outcome={won ? "victory" : "defeat"}
        encounterName={encounter?.name ?? null}
        stats={stats}
        reward={capturedReward}
        onPlayAgain={() => {
          // Rebuild the match from the same faction/encounter
          // selection. Bumping matchRunId is the dep-list trigger
          // that the init useEffect above watches — it runs
          // TcgClient.init again, resets the board, and drops the
          // player back into mulligan. We also wipe the UI-side
          // state first so stale selection/mulligan/log state
          // doesn't bleed into the new match.
          setSelectedCard(null);
          setSelectedUnit(null);
          setSelectionMode("none");
          setMulliganSelections(new Set());
          setLog([]);
          setMatchRunId((n) => n + 1);
          setPhase("mulligan");
        }}
        onReturnToMenu={onBack}
      />
    );
  }

  const factionColor = FACTION_COLORS[playerFaction];
  const enemyColor = FACTION_COLORS[opponentFaction];

  /* ─── MAIN GAME UI — Mobile-first stacked layout ─── */
  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden bg-black relative" role="application" aria-label="Card battle game">
      <ScreenReaderOnly>Tactical card battle game. Summon units, cast spells, and defeat the enemy general.</ScreenReaderOnly>

      {/* §5.5 Warlord lockout — countdown indicator + play-rejection
          toast. The indicator stays mounted for ~2s after the lockout
          ends to play its fade-out (lockoutEndedFadingOut state); the
          toast self-fades after ~1.4s and remounts on each rejection
          via its `key`. */}
      {(gameState?.lockout || lockoutEndedFadingOut) && (
        <WarlordCountdownIndicator
          turnsRemaining={gameState?.lockout?.turnsRemaining ?? 0}
          fadingOut={lockoutEndedFadingOut}
        />
      )}
      {/* §5.8 Authority trial — phase indicator + transcript column.
          Both mount when gameState.trial is present (trial mode is
          opted-in at match creation via MatchConfig.trialMode). The
          phase indicator upgrades to a verdict display when
          trial.outcome lands at turn 10. */}
      {gameState?.trial && (
        <>
          <TrialPhaseIndicator
            phaseNumber={gameState.turnNumber}
            outcome={gameState.trial.outcome}
          />
          <TrialTranscriptColumn
            balance={gameState.trial.trialBalance}
            // Base threshold -2 per spec §3. When §5.7 handoff lands,
            // recompute with warm/cool offsets from openingVerdictBalance.
            threshold={
              -2 +
              (gameState.trial.openingVerdictBalance >= 3 ? 3 : 0) +
              (gameState.trial.openingVerdictBalance <= -3 ? -3 : 0)
            }
            entries={trialTranscriptEntries}
          />
        </>
      )}
      {/* §5.8.1 Light/Dark alignment pillar — mounted after the
          Authority trial's verdict resolves. Modal; the player must
          pick before continuing. Spec §5 timing-sync to the Last
          Words chorus-1 line is deferred to the cutscene work-stream. */}
      {showLightDarkPillar && gameState?.trial?.outcome && (
        <ChoicePillarLightDark
          trialOutcome={gameState.trial.outcome}
          onPick={handleLightDarkPick}
        />
      )}
      {showProgrammerGiftPillar &&
        gameState?.programmerGift?.status === "offered" && (
          <ChoicePillarProgrammerGift onPick={handleProgrammerGiftPick} />
        )}
      {gameState?.publicWitness && (
        <PublicWitnessColumn
          balance={gameState.publicWitness.balance}
          entries={gameState.publicWitness.entries}
        />
      )}
      {showSeerPlayOverlay && (
        <SeerPlayOverlay onDismiss={() => setShowSeerPlayOverlay(false)} />
      )}
      {rejection && (
        <PlayRejectionToast key={rejection.key} message={rejection.message} />
      )}

      {/* Turn flash overlay */}
      {turnFlash && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
          <div className="px-12 py-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="font-display text-2xl sm:text-3xl tracking-[0.3em] text-white text-center" style={{
              textShadow: turnFlash === "YOUR TURN" ? `0 0 var(--space-lg) ${factionColor}, 0 0 var(--space-2xl) ${factionColor}40` : `0 0 var(--space-lg) ${enemyColor}, 0 0 var(--space-2xl) ${enemyColor}40`,
            }}>
              {turnFlash}
            </p>
          </div>
        </div>
      )}

      {/* Tutorial overlay — Elara's guidance (BioWare-style: player-paced) */}
      {isTutorial && currentTutorialStep && (
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
          {/* Skip All button */}
          <div className="flex justify-end mb-1">
            <button
              onClick={skipAllTutorial}
              className="px-2 py-0.5 rounded bg-black/40 text-white/20 font-mono text-[9px] hover:text-white/40 transition-colors"
            >
              SKIP TUTORIAL ▶▶
            </button>
          </div>
          <button
            onClick={advanceTutorial}
            className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-colors hover:bg-black/90 ${
            currentTutorialStep.mood === "warning" ? "void-bg-sunk void-border" :
            currentTutorialStep.mood === "excited" ? "void-bg-success void-border-success" :
            currentTutorialStep.mood === "celebration" ? "void-bg-system void-border-system" :
            "bg-black/80 border-white/20"
          }`}>
            {/* Elara avatar */}
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
              currentTutorialStep.mood === "warning" ? "void-bg-sunk border-2 void-border" :
              currentTutorialStep.mood === "excited" ? "void-bg-success border-2 void-border-success" :
              currentTutorialStep.mood === "celebration" ? "void-bg-system border-2 void-border-system" :
              "void-bg-success border-2 void-border-success"
            }`}>
              <MessageCircle size={16} className={
                currentTutorialStep.mood === "warning" ? "void-text-accent" :
                currentTutorialStep.mood === "excited" ? "void-text-energy" :
                currentTutorialStep.mood === "celebration" ? "void-text-system" :
                "void-text-energy"
              } />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[var(--space-sm)] text-white/40 tracking-wider mb-1">ELARA</p>
              <p className="text-sm text-white/90 leading-relaxed">{currentTutorialStep.message}</p>
              {currentTutorialStep.requiredAction ? (
                <p className="font-mono text-[var(--space-sm)] void-text-energy mt-2 animate-pulse">
                  {currentTutorialStep.requiredAction === "move" && "↑ Click your General and move them"}
                  {currentTutorialStep.requiredAction === "attack" && "↑ Select your unit, then attack an enemy"}
                  {currentTutorialStep.requiredAction === "play_card" && "↓ Click a card in your hand, then click a tile"}
                  {currentTutorialStep.requiredAction === "end_turn" && "→ Press END TURN"}
                </p>
              ) : (
                <p className="font-mono text-[var(--space-sm)] text-white/20 mt-2">tap to continue ▼</p>
              )}
            </div>
          </button>
          {/* Step indicator */}
          <div className="flex justify-center gap-1 mt-2">
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === tutorialStep ? "void-bg-success" : i < tutorialStep ? "void-bg-success" : "bg-white/10"
              }`} />
            ))}
          </div>
        </div>
      )}

      {/* AI thinking overlay */}
      {phase === "ai_turn" && (
        <div className="absolute inset-0 z-40 bg-black/30 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 px-6 py-3 bg-black/70 backdrop-blur-sm rounded-xl border border-white/10 animate-pulse">
            <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: enemyColor }} />
            <span className="font-mono text-sm tracking-wider" style={{ color: enemyColor }}>
              {FACTION_NAMES[opponentFaction]} is thinking...
            </span>
          </div>
        </div>
      )}

      {/* Top bar: Opponent info */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10 bg-black/60" style={{ borderBottomColor: enemyColor + "30" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: enemyColor + "20", border: `2px solid ${enemyColor}` }}>
          <Shield size={12} style={{ color: enemyColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold truncate" style={{ color: enemyColor }}>{FACTION_NAMES[opponentFaction]}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded void-bg-error" title="Opponent general HP">
            <Heart size={10} className="void-text-error" />
            <span className="font-mono text-xs font-bold void-text-error">
              {opponentGen?.currentHealth ?? 0}
              <span className="void-text-error">/{opponentGen?.maxHealth ?? 0}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded void-bg-sunk">
            <Zap size={10} className="void-text-energy" />
            <span className="font-mono text-xs void-text-energy">{opponent.mana}</span>
          </div>
          <span className="font-mono text-[var(--space-sm)] text-white/30">{opponent.hand.length} cards</span>
        </div>
        <button onClick={onBack} className="text-white/30 hover:text-white/60 transition-colors shrink-0">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Board — takes remaining vertical space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-b from-black/40 to-black/80">
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
      </div>

      {/* Player bar: HP + Artifacts + Mana crystals + BBS + End Turn */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10 bg-black/60" style={{ borderTopColor: factionColor + "30" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: factionColor + "20", border: `2px solid ${factionColor}` }}>
          <Swords size={12} style={{ color: factionColor }} />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded void-bg-error">
          <Heart size={10} className="void-text-error" />
          <span className="font-mono text-xs font-bold void-text-error">{playerGen?.currentHealth ?? 0}</span>
        </div>

        {/* Artifact slots — up to 3 */}
        <div className="flex items-center gap-1 shrink-0">
          {Array.from({ length: 3 }, (_, i) => {
            const artifact = player.artifacts[i];
            return artifact ? (
              <div
                key={i}
                className="relative w-6 h-6 rounded border flex items-center justify-center"
                style={{ backgroundColor: factionColor + "15", borderColor: factionColor + "60" }}
                title={`${artifact.card.name} (${artifact.durability} durability)`}
              >
                <Shield size={10} style={{ color: factionColor }} />
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[var(--space-xs)] font-bold text-white"
                  style={{ backgroundColor: factionColor }}
                >
                  {artifact.durability}
                </span>
              </div>
            ) : (
              <div
                key={i}
                className="w-6 h-6 rounded border-dashed border border-white/10 flex items-center justify-center"
                title="Empty artifact slot"
              >
                <Shield size={8} className="text-white/10" />
              </div>
            );
          })}
        </div>

        {/* Mana crystals — large, glowing */}
        <div className="flex gap-1 flex-1 justify-center">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
              i < player.maxMana
                ? i < player.mana
                  ? "void-bg-sunk void-border shadow-[0_0_8px_color-mix(in oklch, var(--electric-blue) 60%, transparent)]"
                  : "void-bg-sunk void-border"
                : "bg-transparent border-white/5"
            }`} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {selectedUnit && (
            <>
              <button onClick={handleMoveMode} className="w-8 h-8 flex items-center justify-center rounded-lg void-bg-success border void-border-success void-text-energy void-bg-success">
                <Move size={14} />
              </button>
              <button onClick={handleAttackMode} className="w-8 h-8 flex items-center justify-center rounded-lg void-bg-error border void-border-error void-text-error void-bg-error">
                <Crosshair size={14} />
              </button>
            </>
          )}
          {/* BBS button — faction-themed, greyed out when unavailable */}
          {phase === "playing" && (() => {
            const bbsAvailable = !player.bloodbornUsed && player.mana >= 1;
            const general = GENERALS.find(g => g.faction === playerFaction);
            const bbsName = general?.bloodbornSpell.name ?? "BBS";
            return (
              <button
                onClick={handleBBS}
                disabled={!bbsAvailable}
                className="h-8 px-3 flex items-center gap-1.5 rounded-lg font-mono text-[var(--space-sm)] font-bold tracking-wider transition-all"
                style={{
                  backgroundColor: bbsAvailable ? factionColor + "20" : "color-mix(in oklch, var(--text-primary) 3%, transparent)",
                  borderColor: bbsAvailable ? factionColor + "60" : "color-mix(in oklch, var(--text-primary) 10%, transparent)",
                  color: bbsAvailable ? factionColor : "color-mix(in oklch, var(--text-primary) 25%, transparent)",
                  border: `1px solid ${bbsAvailable ? factionColor + "60" : "color-mix(in oklch, var(--text-primary) 10%, transparent)"}`,
                  cursor: bbsAvailable ? "pointer" : "not-allowed",
                  opacity: bbsAvailable ? 1 : 0.5,
                }}
                title={general?.bloodbornSpell.description ?? "Bloodborn Spell"}
              >
                <Sparkles size={12} />
                <span className="hidden sm:inline">{bbsName}</span>
              </button>
            );
          })()}
          {phase === "playing" && gameState.currentPlayer === 0 && (
            <button onClick={handleEndTurn} className="h-8 px-4 flex items-center gap-1.5 rounded-lg font-mono text-xs font-bold tracking-wider transition-all"
              style={{
                backgroundColor: factionColor + "30",
                borderColor: factionColor + "60",
                color: factionColor,
                border: `2px solid ${factionColor}60`,
                boxShadow: `0 0 var(--space-sm) ${factionColor}30`,
              }}>
              END TURN
            </button>
          )}
          {/* PR-1 — concede button. Only visible during the player's
              turn in a real match (not mulligan, not ai_turn, not
              game_over). Fires a confirm modal so a misclick
              doesn't nuke the match. The engine's `concede` action
              sets winReason: "surrender", which §4.9 Seer flee
              detection reads. */}
          {phase === "playing" && gameState.currentPlayer === 0 && (
            <button
              onClick={() => setShowConcedeConfirm(true)}
              className="h-8 px-3 flex items-center rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all border void-border-error void-text-error"
              aria-label="Concede match"
              data-testid="concede-button"
              title="Concede the match"
            >
              CONCEDE
            </button>
          )}
        </div>
      </div>

      {/* PR-1 — concede confirmation modal */}
      {showConcedeConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm concede"
          className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full void-bg-canvas border void-border-error rounded p-6 text-center">
            <p className="font-display text-lg void-text-error tracking-[0.2em] mb-2">CONCEDE?</p>
            <p className="font-mono text-xs void-text-muted mb-6">
              The match will end in your defeat. Your opponent will be recorded as the winner.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  const client = tcgClientRef.current;
                  if (!client) return;
                  const result = client.dispatch({ type: "concede" });
                  setGameState(asGameState(result.viewState));
                  setShowConcedeConfirm(false);
                }}
                data-testid="concede-confirm"
                className="px-4 py-2 void-bg-error border void-border-error void-text-error rounded font-mono text-xs transition-colors"
              >
                CONCEDE
              </button>
              <button
                type="button"
                onClick={() => setShowConcedeConfirm(false)}
                data-testid="concede-cancel"
                className="px-4 py-2 void-bg-canvas border void-border void-text rounded font-mono text-xs transition-colors"
              >
                KEEP PLAYING
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hand — horizontal card spread at bottom */}
      <div className="border-t border-white/5 bg-black/80 px-2 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {player.hand.map((card, i) => {
            // §5.5 Warlord lockout — card.id is the entityId on hand
            // cards (per compat/viewAdapter.ts). Lock check is
            // side-scoped (player only).
            const locked =
              !!gameState.lockout &&
              gameState.lockout.targetSide === 0 &&
              gameState.lockout.lockedEntityIds.includes(card.id);
            const playable = card.manaCost <= player.mana && phase === "playing" && gameState.currentPlayer === 0 && !locked;
            const isSelected = selectedCard === i;
            return (
              <button
                key={`${card.id}-${i}`}
                aria-label={locked ? `${card.name} — locked` : card.name}
                className={`relative shrink-0 w-28 rounded-lg border-2 p-2 text-left transition-all ${
                  locked ? "void-border bg-white/[0.02] opacity-30 cursor-not-allowed" :
                  isSelected ? "border-white bg-white/10 -translate-y-2 shadow-lg" :
                  playable ? "border-white/20 bg-white/5 hover:border-white/40 hover:-translate-y-1" :
                  "border-white/5 bg-white/[0.02] opacity-40"
                }`}
                onClick={() => locked ? handleCardClick(i) : (playable && handleCardClick(i))}
                onContextMenu={(e) => { e.preventDefault(); if (!player.replaceUsed) handleReplace(i); }}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Mana cost badge */}
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full void-bg-sunk void-text-energy font-mono text-[var(--space-sm)] font-bold">
                    {card.manaCost}
                  </span>
                  {card.cardType === "unit" && (
                    <span className="text-[9px] text-white/40 font-mono">{card.attack}/{card.health}</span>
                  )}
                </div>
                {/* Card image */}
                {card.imageUrl && <img src={card.imageUrl} alt="" className="w-full h-14 object-cover rounded mb-1" />}
                {/* Name */}
                <p className="font-mono text-[var(--space-sm)] font-bold truncate text-white/90">{card.name}</p>
                {/* Type + keywords */}
                <p className="text-[var(--space-xs)] text-white/30 font-mono truncate">
                  {card.cardType}{card.keywords.length > 0 ? ` · ${card.keywords[0]}` : ""}
                </p>
                {/* §5.5 lockout overlay — brass lock icon + dim wash */}
                {locked && <CardLockOverlay />}
              </button>
            );
          })}
        </div>
        {!player.replaceUsed && phase === "playing" && (
          <p className="font-mono text-[9px] text-white/20 text-center mt-1">Right-click or long-press a card to replace</p>
        )}
      </div>

      {/* Card detail tooltip — floating above hand */}
      {hoveredCard && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 w-64 p-3 rounded-xl border border-white/20 bg-black/90 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full void-bg-sunk void-text-energy font-mono text-xs font-bold">
              {hoveredCard.manaCost}
            </span>
            <p className="font-mono text-sm font-bold text-white">{hoveredCard.name}</p>
          </div>
          {hoveredCard.abilityText && <p className="text-[11px] text-white/70 mb-2">{hoveredCard.abilityText}</p>}
          {hoveredCard.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {hoveredCard.keywords.map(kw => (
                <span key={kw} className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">{kw}</span>
              ))}
            </div>
          )}
          {hoveredCard.cardType === "unit" && (
            <div className="flex gap-3 text-[var(--space-sm)] font-mono text-white/50">
              <span>ATK {hoveredCard.attack}</span>
              <span>HP {hoveredCard.health}</span>
            </div>
          )}
          {hoveredCard.flavorText && <p className="text-[9px] text-white/30 italic mt-2 border-t border-white/10 pt-2">{hoveredCard.flavorText}</p>}
        </div>
      )}
    </div>
  );
}

export default React.memo(DuelystGameUI);
