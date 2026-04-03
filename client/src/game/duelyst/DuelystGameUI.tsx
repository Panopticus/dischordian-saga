/* ═══════════════════════════════════════════════════════
   DISCHORDIA GAME UI — React wrapper for the tactical board
   with hand display, mana bar, action log, and controls
   ═══════════════════════════════════════════════════════ */
import { useRef, useEffect, useState, useCallback } from "react";
import type { DuelystGameState, DuelystCard, BoardUnit, GameAction, Faction } from "./types";
import { FACTION_COLORS, FACTION_NAMES } from "./types";
import {
  createGameState, executeAction, getValidMoves, getValidAttacks,
  getValidSummonTiles, findUnit, performMulligan,
} from "./engine";
import { BoardRenderer } from "./BoardRenderer";
import { getAIActions, getAIMulliganIndices } from "./DuelystAI";
import { buildStarterDeck } from "./cardAdapter";
import { TUTORIAL_STEPS, isTutorialActionComplete, type TutorialStep } from "./tutorial";
import { dischordiaSounds } from "./SoundManager";
import {
  Swords, Heart, Zap, RotateCcw, SkipForward, Shield,
  Crosshair, Move, Sparkles, BookOpen, MessageCircle,
} from "lucide-react";

interface DuelystGameUIProps {
  playerFaction: Faction;
  opponentFaction: Faction;
  isTutorial?: boolean;
  onGameEnd: (winner: "player" | "opponent") => void;
  onBack: () => void;
}

type Phase = "mulligan" | "playing" | "ai_turn" | "game_over";
type SelectionMode = "none" | "move" | "attack" | "summon" | "spell_target";

interface LogEntry { text: string; type: "info" | "attack" | "spell" | "move" | "system"; }

export default function DuelystGameUI({ playerFaction, opponentFaction, isTutorial = false, onGameEnd, onBack }: DuelystGameUIProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BoardRenderer | null>(null);
  const [gameState, setGameState] = useState<DuelystGameState | null>(null);
  const [phase, setPhase] = useState<Phase>("mulligan");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");
  const [mulliganSelections, setMulliganSelections] = useState<Set<number>>(new Set());
  const [log, setLog] = useState<LogEntry[]>([]);
  const [hoveredCard, setHoveredCard] = useState<DuelystCard | null>(null);
  const [turnFlash, setTurnFlash] = useState<string | null>(null);

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState(0);
  const [lastActionType, setLastActionType] = useState<string | null>(null);
  const currentTutorialStep = isTutorial ? TUTORIAL_STEPS[tutorialStep] : null;

  // Auto-advance tutorial steps
  useEffect(() => {
    if (!isTutorial || !currentTutorialStep?.autoAdvanceMs) return;
    const timer = setTimeout(() => {
      if (tutorialStep < TUTORIAL_STEPS.length - 1) setTutorialStep(s => s + 1);
    }, currentTutorialStep.autoAdvanceMs);
    return () => clearTimeout(timer);
  }, [isTutorial, tutorialStep, currentTutorialStep]);

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

  // Initialize game
  useEffect(() => {
    const playerDeck = buildStarterDeck(playerFaction);
    const opponentDeck = buildStarterDeck(opponentFaction);
    const state = createGameState(playerFaction, playerDeck, opponentFaction, opponentDeck);
    setGameState(state);
    addLog("Game started. Choose cards to mulligan.", "system");
  }, [playerFaction, opponentFaction, addLog]);

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

  /* ─── MULLIGAN ─── */
  const handleMulligan = useCallback(() => {
    if (!gameState) return;
    let state = { ...gameState };
    // Player mulligan
    const playerIndices = [...mulliganSelections];
    state = performMulligan(state, 0, playerIndices);
    // AI mulligan
    const aiIndices = getAIMulliganIndices(state.players[1].hand);
    state = performMulligan(state, 1, aiIndices);
    setGameState(state);
    setPhase("playing");
    addLog(`Mulligan complete. Your turn — ${state.players[0].mana} mana available.`, "system");
    setTurnFlash("YOUR TURN");
    setTimeout(() => setTurnFlash(null), 1500);
  }, [gameState, mulliganSelections, addLog]);

  /* ─── TILE CLICK ─── */
  const handleTileClick = useCallback((row: number, col: number) => {
    if (!gameState || phase !== "playing" || gameState.currentPlayer !== 0) return;

    if (selectionMode === "move" && selectedUnit) {
      const moves = getValidMoves(gameState, selectedUnit);
      if (moves.some(([r, c]) => r === row && c === col)) {
        const newState = executeAction(gameState, { type: "move", unitId: selectedUnit, toRow: row, toCol: col });
        setGameState(newState);
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
          const newState = executeAction(gameState, { type: "play_card", cardIndex: selectedCard, row, col });
          setGameState(newState);
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
        const newState = executeAction(gameState, { type: "attack", attackerId: selectedUnit, targetId: unitId });
        setGameState(newState);
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
        const newState = executeAction(gameState, { type: "play_card", cardIndex: selectedCard, row: unit.row, col: unit.col, targetId: unitId });
        setGameState(newState);
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
        const newState = executeAction(gameState, { type: "play_card", cardIndex: index, row: 0, col: 0 });
        setGameState(newState);
        addLog(`Cast ${card.name}`, "spell");
        clearSelection();
      } else {
        setSelectedCard(index);
        setSelectedUnit(null);
        setSelectionMode("spell_target");
        addLog(`Select a target for ${card.name}`, "info");
      }
    } else if (card.cardType === "artifact") {
      const newState = executeAction(gameState, { type: "play_card", cardIndex: index, row: 0, col: 0 });
      setGameState(newState);
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
    if (!gameState || phase !== "playing") return;
    let state = executeAction(gameState, { type: "end_turn" });
    setGameState(state);
    setPhase("ai_turn");
    addLog("Your turn ended. AI is thinking...", "system");
    dischordiaSounds.play("turn_end");
    if (isTutorial) setLastActionType("end_turn");
    setTurnFlash("ENEMY TURN");
    setTimeout(() => setTurnFlash(null), 1500);
    clearSelection();
    rendererRef.current?.clearHighlights();

    // AI turn — execute actions sequentially with delays to prevent race conditions
    const runAITurn = async () => {
      await new Promise(r => setTimeout(r, 500));
      const aiActions = getAIActions(state);
      let currentState = state;

      for (const action of aiActions) {
        await new Promise(r => setTimeout(r, 350));
        currentState = executeAction(currentState, action);
        setGameState({ ...currentState });

        if (action.type === "attack") { addLog(`AI attacks!`, "attack"); dischordiaSounds.play("attack_hit"); }
        else if (action.type === "play_card") { addLog(`AI plays a card`, "spell"); dischordiaSounds.play("unit_summon"); }
        else if (action.type === "move") { addLog(`AI moves a unit`, "move"); }
        else if (action.type === "bloodborn_spell") { addLog(`AI uses Bloodborn Spell!`, "spell"); dischordiaSounds.play("spell_cast"); }

        // Check if game ended after AI action
        if (currentState.phase === "ended") return;

        if (action.type === "end_turn") {
          setPhase("playing");
          addLog(`Your turn — ${currentState.players[0].mana} mana available.`, "system");
          dischordiaSounds.play("turn_start");
          setTurnFlash("YOUR TURN");
          setTimeout(() => setTurnFlash(null), 1500);
        }
      }
    };
    runAITurn();
  }, [gameState, phase, addLog]);

  const handleReplace = useCallback((index: number) => {
    if (!gameState || gameState.players[0].replaceUsed) return;
    const card = gameState.players[0].hand[index];
    const newState = executeAction(gameState, { type: "replace_card", cardIndex: index });
    setGameState(newState);
    addLog(`Replaced ${card?.name}`, "info");
    dischordiaSounds.play("card_draw");
  }, [gameState, addLog]);

  const handleBBS = useCallback(() => {
    if (!gameState || gameState.players[0].bloodbornUsed || gameState.players[0].mana < 1) return;
    const newState = executeAction(gameState, { type: "bloodborn_spell" });
    setGameState(newState);
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
    <div className="flex flex-col h-full max-h-screen overflow-hidden bg-black relative">
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

      {/* Tutorial overlay — Elara's guidance */}
      {isTutorial && currentTutorialStep && (
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
          <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${
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
              {currentTutorialStep.requiredAction && (
                <p className="font-mono text-[10px] text-cyan-400/60 mt-2 animate-pulse">
                  {currentTutorialStep.requiredAction === "move" && "↑ Click your General and move them"}
                  {currentTutorialStep.requiredAction === "attack" && "↑ Select your unit, then attack an enemy"}
                  {currentTutorialStep.requiredAction === "play_card" && "↓ Click a card in your hand, then click a tile"}
                  {currentTutorialStep.requiredAction === "end_turn" && "→ Press END TURN"}
                </p>
              )}
            </div>
            {/* Skip button */}
            {currentTutorialStep.autoAdvanceMs && (
              <button
                onClick={() => tutorialStep < TUTORIAL_STEPS.length - 1 && setTutorialStep(s => s + 1)}
                className="shrink-0 text-white/30 hover:text-white/60 text-[10px] font-mono"
              >
                SKIP
              </button>
            )}
          </div>
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

      {/* Player bar: HP + Mana crystals + BBS + End Turn */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10 bg-black/60" style={{ borderTopColor: factionColor + "30" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: factionColor + "20", border: `2px solid ${factionColor}` }}>
          <Swords size={12} style={{ color: factionColor }} />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10">
          <Heart size={10} className="text-red-400" />
          <span className="font-mono text-xs font-bold text-red-400">{playerGen?.currentHealth ?? 0}</span>
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
          {!player.bloodbornUsed && player.mana >= 1 && phase === "playing" && (
            <button onClick={handleBBS} className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30" title="Bloodborn Spell">
              <Sparkles size={14} />
            </button>
          )}
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
            const playable = card.manaCost <= player.mana && phase === "playing" && gameState.currentPlayer === 0;
            const isSelected = selectedCard === i;
            return (
              <button
                key={`${card.id}-${i}`}
                className={`shrink-0 w-28 rounded-lg border-2 p-2 text-left transition-all ${
                  isSelected ? "border-white bg-white/10 -translate-y-2 shadow-lg" :
                  playable ? "border-white/20 bg-white/5 hover:border-white/40 hover:-translate-y-1" :
                  "border-white/5 bg-white/[0.02] opacity-40"
                }`}
                onClick={() => playable && handleCardClick(i)}
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
