/* ═══════════════════════════════════════════════════════
   DUELYST GAME UI — React wrapper for the tactical board
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
import {
  Swords, Heart, Zap, RotateCcw, SkipForward, Shield,
  Crosshair, Move, Sparkles, BookOpen,
} from "lucide-react";

interface DuelystGameUIProps {
  playerFaction: Faction;
  opponentFaction: Faction;
  onGameEnd: (winner: "player" | "opponent") => void;
  onBack: () => void;
}

type Phase = "mulligan" | "playing" | "ai_turn" | "game_over";
type SelectionMode = "none" | "move" | "attack" | "summon" | "spell_target";

interface LogEntry { text: string; type: "info" | "attack" | "spell" | "move" | "system"; }

export default function DuelystGameUI({ playerFaction, opponentFaction, onGameEnd, onBack }: DuelystGameUIProps) {
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
        if (attacker) rendererRef.current?.showDamageNumber(unit.row, unit.col, attacker.currentAttack);
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

        if (action.type === "attack") addLog(`AI attacks!`, "attack");
        else if (action.type === "play_card") addLog(`AI plays a card`, "spell");
        else if (action.type === "move") addLog(`AI moves a unit`, "move");
        else if (action.type === "bloodborn_spell") addLog(`AI uses Bloodborn Spell!`, "spell");

        // Check if game ended after AI action
        if (currentState.phase === "ended") return;

        if (action.type === "end_turn") {
          setPhase("playing");
          addLog(`Your turn — ${currentState.players[0].mana} mana available.`, "system");
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
  }, [gameState, addLog]);

  const handleBBS = useCallback(() => {
    if (!gameState || gameState.players[0].bloodbornUsed || gameState.players[0].mana < 1) return;
    const newState = executeAction(gameState, { type: "bloodborn_spell" });
    setGameState(newState);
    addLog(`Used Bloodborn Spell!`, "spell");
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

  /* ─── MAIN GAME UI ─── */
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4 max-w-[1400px] mx-auto">
      {/* Left: Board */}
      <div className="flex-1 flex flex-col items-center gap-3">
        {/* Opponent info bar */}
        <div className="flex items-center gap-4 w-full max-w-[760px] px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: FACTION_COLORS[opponentFaction] + "33", border: `2px solid ${FACTION_COLORS[opponentFaction]}` }}>
              <Shield size={14} style={{ color: FACTION_COLORS[opponentFaction] }} />
            </div>
            <div>
              <p className="font-mono text-xs font-bold">{FACTION_NAMES[opponentFaction]}</p>
              <p className="font-mono text-[10px] text-muted-foreground">AI Opponent</p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-red-400" />
              <span className="font-mono text-sm font-bold">{opponentGen?.currentHealth ?? 0}/{opponentGen?.maxHealth ?? 25}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-blue-400" />
              <span className="font-mono text-sm">{opponent.mana}/{opponent.maxMana}</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{opponent.hand.length} cards</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="border border-border/30 rounded-lg overflow-hidden bg-background/50">
          <canvas ref={canvasRef} />
        </div>

        {/* Player info bar */}
        <div className="flex items-center gap-4 w-full max-w-[760px] px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: FACTION_COLORS[playerFaction] + "33", border: `2px solid ${FACTION_COLORS[playerFaction]}` }}>
              <Swords size={14} style={{ color: FACTION_COLORS[playerFaction] }} />
            </div>
            <div>
              <p className="font-mono text-xs font-bold">{FACTION_NAMES[playerFaction]}</p>
              <p className="font-mono text-[10px] text-muted-foreground">You</p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-red-400" />
              <span className="font-mono text-sm font-bold">{playerGen?.currentHealth ?? 0}/{playerGen?.maxHealth ?? 25}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-blue-400" />
              <span className="font-mono text-sm font-bold">{player.mana}/{player.maxMana}</span>
            </div>
          </div>
        </div>

        {/* Mana crystals */}
        <div className="flex gap-1 justify-center">
          {Array.from({ length: player.maxMana }, (_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full border ${i < player.mana ? "bg-blue-500 border-blue-400" : "bg-transparent border-border/30"}`} />
          ))}
        </div>
      </div>

      {/* Right: Hand + Controls + Log */}
      <div className="w-full lg:w-72 flex flex-col gap-3">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {selectedUnit && (
            <>
              <button onClick={handleMoveMode} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded text-xs font-mono hover:bg-green-500/20">
                <Move size={12} /> Move
              </button>
              <button onClick={handleAttackMode} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs font-mono hover:bg-red-500/20">
                <Crosshair size={12} /> Attack
              </button>
            </>
          )}
          {!player.bloodbornUsed && player.mana >= 1 && phase === "playing" && (
            <button onClick={handleBBS} className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded text-xs font-mono hover:bg-purple-500/20">
              <Sparkles size={12} /> BBS
            </button>
          )}
          {phase === "playing" && gameState.currentPlayer === 0 && (
            <button onClick={handleEndTurn} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded text-xs font-mono hover:bg-primary/20 ml-auto">
              <SkipForward size={12} /> End Turn
            </button>
          )}
          {phase === "ai_turn" && (
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs animate-pulse">
              <RotateCcw size={12} className="animate-spin" /> AI thinking...
            </div>
          )}
        </div>

        {/* Hand */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-2">HAND ({player.hand.length})</p>
          <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
            {player.hand.map((card, i) => {
              const playable = card.manaCost <= player.mana && phase === "playing" && gameState.currentPlayer === 0;
              return (
                <div
                  key={`${card.id}-${i}`}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                    selectedCard === i ? "border-primary bg-primary/10" : playable ? "border-border/50 bg-card/50 hover:border-primary/50" : "border-border/20 bg-card/20 opacity-50"
                  }`}
                  onClick={() => playable && handleCardClick(i)}
                  onContextMenu={(e) => { e.preventDefault(); if (!player.replaceUsed) handleReplace(i); }}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {card.imageUrl && <img src={card.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] font-bold truncate">{card.name}</p>
                    <div className="flex gap-2">
                      <span className="text-[9px] text-blue-400 font-mono">{card.manaCost}⬡</span>
                      {card.cardType === "unit" && <span className="text-[9px] text-muted-foreground font-mono">{card.attack}⚔{card.health}♥</span>}
                      <span className="text-[9px] text-muted-foreground/50 font-mono">{card.cardType}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!player.replaceUsed && <p className="font-mono text-[9px] text-muted-foreground/50 mt-1">Right-click a card to replace (once per turn)</p>}
        </div>

        {/* Card tooltip */}
        {hoveredCard && (
          <div className="p-3 rounded-lg border border-border/50 bg-card/80">
            <p className="font-mono text-xs font-bold">{hoveredCard.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{hoveredCard.abilityText}</p>
            {hoveredCard.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {hoveredCard.keywords.map(kw => (
                  <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{kw}</span>
                ))}
              </div>
            )}
            {hoveredCard.flavorText && <p className="text-[9px] text-muted-foreground/50 italic mt-1">{hoveredCard.flavorText}</p>}
          </div>
        )}

        {/* Action log */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-1 flex items-center gap-1">
            <BookOpen size={10} /> BATTLE LOG
          </p>
          <div className="h-32 overflow-y-auto border border-border/20 rounded p-2 bg-card/20">
            {log.map((entry, i) => (
              <p key={i} className={`font-mono text-[10px] ${
                entry.type === "attack" ? "text-red-400" :
                entry.type === "spell" ? "text-purple-400" :
                entry.type === "move" ? "text-green-400" :
                entry.type === "system" ? "text-amber-400" :
                "text-muted-foreground"
              }`}>
                {entry.text}
              </p>
            ))}
          </div>
        </div>

        <button onClick={onBack} className="mt-auto px-3 py-1.5 border border-border/30 text-muted-foreground rounded text-xs font-mono hover:text-foreground hover:border-border/50 transition-colors">
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}
