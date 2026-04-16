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

interface DuelystGameUIProps {
  playerFaction: Faction;
  opponentFaction: Faction;
  isTutorial?: boolean;
  /** Celebration trial history — if provided, computes combat buffs for the player's deck */
  trialHistory?: TrialHistoryEntry[];
  onGameEnd: (winner: "player" | "opponent") => void;
  onBack: () => void;
}

type Phase = "mulligan" | "playing" | "ai_turn" | "game_over";
type SelectionMode = "none" | "move" | "attack" | "summon" | "spell_target";

interface LogEntry { text: string; type: "info" | "attack" | "spell" | "move" | "system"; }

function DuelystGameUI({ playerFaction, opponentFaction, isTutorial = false, onGameEnd, onBack, trialHistory }: DuelystGameUIProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BoardRenderer | null>(null);
  const tcgClientRef = useRef<TcgClient | null>(null);
  const [gameState, setGameState] = useState<DuelystGameState | null>(null);
  const [phase, setPhase] = useState<Phase>("mulligan");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");
  const [mulliganSelections, setMulliganSelections] = useState<Set<number>>(new Set());
  const [log, setLog] = useState<LogEntry[]>([]);
  const [hoveredCard, setHoveredCard] = useState<DuelystCard | null>(null);
  const [turnFlash, setTurnFlash] = useState<string | null>(null);

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

  // Initialize game — uses the shared tcg-core reducer via TcgClient.
  // buildStarterDeck returns DuelystCard[] from the old cardAdapter; we
  // map to card def ids via sagaCardId for the tcg-core match init.
  // [DEFERRED] Celebration trial combat buffs (trialHistory →
  // trialToCombatBuff) will be re-integrated against the tcg-core state
  // shape once the trial system is adapted to the new engine.
  useEffect(() => {
    // Prefer curated starter decks from tcg-core; fall back to ad-hoc builder
    const playerStarter = STARTER_DECK_MAP[playerFaction];
    const opponentStarter = STARTER_DECK_MAP[opponentFaction];
    const p1DeckCardIds = playerStarter
      ? [...playerStarter.cardDefIds]
      : buildStarterDeck(playerFaction).map((c) => c.sagaCardId ?? c.id);
    const p2DeckCardIds = opponentStarter
      ? [...opponentStarter.cardDefIds]
      : buildStarterDeck(opponentFaction).map((c) => c.sagaCardId ?? c.id);
    const client = TcgClient.init({
      p1Faction: playerFaction,
      p1DeckCardIds,
      p2Faction: opponentFaction,
      p2DeckCardIds,
    });
    tcgClientRef.current = client;
    setGameState(asGameState(client.getViewState()));
    addLog("Game started. Choose cards to mulligan.", "system");
  }, [playerFaction, opponentFaction, trialHistory, addLog]);

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

  // Check win condition
  useEffect(() => {
    if (!gameState || phase === "mulligan") return;
    if (gameState.winner !== null) {
      setPhase("game_over");
      onGameEnd(gameState.winner === 0 ? "player" : "opponent");
    }
  }, [gameState, phase, onGameEnd]);

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
  }, [gameState, phase, selectionMode, selectedUnit, selectedCard, addLog]);

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
  }, [gameState, phase, selectionMode, selectedUnit, selectedCard, addLog]);

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
      addLog(`Equipped ${card.name}`, "spell");
      dischordiaSounds.play("card_play");
      clearSelection();
    }
  }, [gameState, phase, addLog]);

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
      const aiActions = getAIActions(aiView);

      for (const action of aiActions) {
        await new Promise(r => setTimeout(r, 350));
        const result = client.dispatchOpponent(action as unknown as Record<string, unknown>);
        const currentView = asGameState(result.viewState);
        setGameState(currentView);

        if (action.type === "attack") { addLog(`AI attacks!`, "attack"); dischordiaSounds.play("attack_hit"); }
        else if (action.type === "play_card") { addLog(`AI plays a card`, "spell"); dischordiaSounds.play("unit_summon"); }
        else if (action.type === "move") { addLog(`AI moves a unit`, "move"); }
        else if (action.type === "bloodborn_spell") { addLog(`AI uses Bloodborn Spell!`, "spell"); dischordiaSounds.play("spell_cast"); }

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
                <span className="text-[10px] text-blue-400 font-mono">{card.manaCost} mana</span>
                {card.cardType === "unit" && (
                  <span className="text-[10px] text-muted-foreground font-mono">{card.attack}/{card.health}</span>
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <h2 className={`font-display text-3xl tracking-[0.3em] ${won ? "text-primary glow-cyan" : "text-destructive"}`}>
          {won ? "VICTORY" : "DEFEAT"}
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          {won ? "The enemy general has fallen." : "Your general has been destroyed."}
        </p>
        <button onClick={onBack} className="px-6 py-2 bg-primary/10 border border-primary/40 text-primary rounded font-mono text-sm hover:bg-primary/20 transition-colors">
          RETURN TO MENU
        </button>
      </div>
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
      {rejection && (
        <PlayRejectionToast key={rejection.key} message={rejection.message} />
      )}

      {/* Turn flash overlay */}
      {turnFlash && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
          <div className="px-12 py-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="font-display text-2xl sm:text-3xl tracking-[0.3em] text-white text-center" style={{
              textShadow: turnFlash === "YOUR TURN" ? `0 0 30px ${factionColor}, 0 0 60px ${factionColor}40` : `0 0 30px ${enemyColor}, 0 0 60px ${enemyColor}40`,
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
            currentTutorialStep.mood === "warning" ? "bg-amber-950/80 border-amber-500/40" :
            currentTutorialStep.mood === "excited" ? "bg-emerald-950/80 border-emerald-500/40" :
            currentTutorialStep.mood === "celebration" ? "bg-purple-950/80 border-purple-500/40" :
            "bg-black/80 border-white/20"
          }`}>
            {/* Elara avatar */}
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
              currentTutorialStep.mood === "warning" ? "bg-amber-500/20 border-2 border-amber-500" :
              currentTutorialStep.mood === "excited" ? "bg-emerald-500/20 border-2 border-emerald-500" :
              currentTutorialStep.mood === "celebration" ? "bg-purple-500/20 border-2 border-purple-500" :
              "bg-cyan-500/20 border-2 border-cyan-500"
            }`}>
              <MessageCircle size={16} className={
                currentTutorialStep.mood === "warning" ? "text-amber-400" :
                currentTutorialStep.mood === "excited" ? "text-emerald-400" :
                currentTutorialStep.mood === "celebration" ? "text-purple-400" :
                "text-cyan-400"
              } />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] text-white/40 tracking-wider mb-1">ELARA</p>
              <p className="text-sm text-white/90 leading-relaxed">{currentTutorialStep.message}</p>
              {currentTutorialStep.requiredAction ? (
                <p className="font-mono text-[10px] text-cyan-400/60 mt-2 animate-pulse">
                  {currentTutorialStep.requiredAction === "move" && "↑ Click your General and move them"}
                  {currentTutorialStep.requiredAction === "attack" && "↑ Select your unit, then attack an enemy"}
                  {currentTutorialStep.requiredAction === "play_card" && "↓ Click a card in your hand, then click a tile"}
                  {currentTutorialStep.requiredAction === "end_turn" && "→ Press END TURN"}
                </p>
              ) : (
                <p className="font-mono text-[10px] text-white/20 mt-2">tap to continue ▼</p>
              )}
            </div>
          </button>
          {/* Step indicator */}
          <div className="flex justify-center gap-1 mt-2">
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === tutorialStep ? "bg-cyan-400" : i < tutorialStep ? "bg-cyan-400/30" : "bg-white/10"
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
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10">
            <Heart size={10} className="text-red-400" />
            <span className="font-mono text-xs font-bold text-red-400">{opponentGen?.currentHealth ?? 0}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10">
            <Zap size={10} className="text-blue-400" />
            <span className="font-mono text-xs text-blue-400">{opponent.mana}</span>
          </div>
          <span className="font-mono text-[10px] text-white/30">{opponent.hand.length} cards</span>
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
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10">
          <Heart size={10} className="text-red-400" />
          <span className="font-mono text-xs font-bold text-red-400">{playerGen?.currentHealth ?? 0}</span>
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
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[8px] font-bold text-white"
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
                  ? "bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  : "bg-blue-900/40 border-blue-800/50"
                : "bg-transparent border-white/5"
            }`} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {selectedUnit && (
            <>
              <button onClick={handleMoveMode} className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30">
                <Move size={14} />
              </button>
              <button onClick={handleAttackMode} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30">
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
                className="h-8 px-3 flex items-center gap-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all"
                style={{
                  backgroundColor: bbsAvailable ? factionColor + "20" : "rgba(255,255,255,0.03)",
                  borderColor: bbsAvailable ? factionColor + "60" : "rgba(255,255,255,0.1)",
                  color: bbsAvailable ? factionColor : "rgba(255,255,255,0.25)",
                  border: `1px solid ${bbsAvailable ? factionColor + "60" : "rgba(255,255,255,0.1)"}`,
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
                boxShadow: `0 0 12px ${factionColor}30`,
              }}>
              END TURN
            </button>
          )}
        </div>
      </div>

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
                  locked ? "border-amber-700/40 bg-white/[0.02] opacity-30 cursor-not-allowed" :
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
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-mono text-[10px] font-bold">
                    {card.manaCost}
                  </span>
                  {card.cardType === "unit" && (
                    <span className="text-[9px] text-white/40 font-mono">{card.attack}/{card.health}</span>
                  )}
                </div>
                {/* Card image */}
                {card.imageUrl && <img src={card.imageUrl} alt="" className="w-full h-14 object-cover rounded mb-1" />}
                {/* Name */}
                <p className="font-mono text-[10px] font-bold truncate text-white/90">{card.name}</p>
                {/* Type + keywords */}
                <p className="text-[8px] text-white/30 font-mono truncate">
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
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-mono text-xs font-bold">
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
            <div className="flex gap-3 text-[10px] font-mono text-white/50">
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
