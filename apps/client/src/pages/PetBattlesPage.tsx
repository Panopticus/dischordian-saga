/* ═══════════════════════════════════════════════════════
   PET BATTLES — Spectator Arena

   Text-based spectator combat. Two pets face off across
   rounds; player watches + bets on outcomes. Injuries carry
   forward. Dream tokens at stake.

   Design: Reader-friendly log with battle-card view.
   No canvas sprite work — pure narrative text+cards,
   like WoW pet battles logs but with Dischordian flavor.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Swords, Shield, Zap, Heart, Trophy, Play, RotateCcw, Sparkles, ShoppingBag,
} from "lucide-react";
import {
  createBattlePet,
  executeMove,
  applyTurnPassives,
  calculateBattleRewards,
  resolvePartyCombatBonuses,
  getActiveArenaModifier,
  EMPTY_PARTY_BONUSES,
  ARENA_TIERS,
  ARENA_BACKGROUNDS,
  getArenaBackground,
  getAvailableTiers,
  type BattlePet,
  type PetBattle,
  type BattleLogEntry,
  type ArenaTier,
  type ArenaBackground,
  type PartyCombatBonuses,
} from "@/game/petBattles";
import { aggregateSkillEffects, type SkillBonusEffect } from "@shared/petSkillTrees";
import { resolvePartyBonuses } from "@shared/companionTraitThresholds";
import { petsToPartyTraits } from "@shared/petSpeciesTraits";
import { trpc } from "@/lib/trpc";
import { applyDischordiaEnergy } from "@/stores/dischordiaCycleStore";
import PetRoster, { type RosterPet } from "@/components/PetRoster";
import PartyTraitThresholdPanel from "@/components/PartyTraitThresholdPanel";
import PetSkillTreePanel from "@/components/PetSkillTreePanel";
import PetQuestTracker from "@/components/PetQuestTracker";
import PetThoughtBubble from "@/components/PetThoughtBubble";
import { toast } from "sonner";
import type { ThoughtTrigger } from "@/game/petBonding";
import { VFX_FUSION_ART, VFX_THREAD_ART } from "@/data/nanobanna2Assets";

/** One-shot VFX overlay for a pet move. Keyed by timestamp so each trigger is fresh. */
interface MoveVfxOverlay {
  id: number;
  src: string;
  kind: "fusion" | "thread";
}

type Phase = "tier_select" | "matchup" | "battle" | "result";
type SidePanel = "none" | "skills" | "quests";

export default function PetBattlesPage() {
  const [phase, setPhase] = useState<Phase>("tier_select");
  const [selectedTier, setSelectedTier] = useState<ArenaTier | null>(null);
  const [battle, setBattle] = useState<PetBattle | null>(null);
  const [log, setLog] = useState<BattleLogEntry[]>([]);
  const [playerPet, setPlayerPet] = useState<BattlePet | null>(null);
  const [opponentPet, setOpponentPet] = useState<BattlePet | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [moveVfx, setMoveVfx] = useState<MoveVfxOverlay | null>(null);

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [sidePanel, setSidePanel] = useState<SidePanel>("none");
  const [sidePanelPetId, setSidePanelPetId] = useState<string | null>(null);
  const [thoughtTrigger, setThoughtTrigger] = useState<ThoughtTrigger | null>(null);

  const [serverRewards, setServerRewards] = useState<{
    bondGain: number; skillPoints: number; dream: number; xp: number; injury: number;
  } | null>(null);

  // Server persistence
  const utils = trpc.useUtils();
  const myPetsQuery = trpc.petBattles.getMyPets.useQuery(undefined, { retry: false });
  const submitBattleMutation = trpc.petBattles.submitBattleResult.useMutation();
  const grantStarterMutation = trpc.seedData.grantStarterPet.useMutation({
    onSuccess: (res) => {
      if (res.success && res.pet) {
        toast.success(`${res.pet.name} joined your roster!`);
        utils.petBattles.getMyPets.invalidate();
      } else {
        toast.error(res.error ?? "Could not acquire starter pet");
      }
    },
    onError: (err) => toast.error(err.message),
  });
  const acquireShopMutation = trpc.petBattles.acquirePet.useMutation({
    onSuccess: () => {
      toast.success("New specimen acquired from the Collector");
      utils.petBattles.getMyPets.invalidate();
      utils.petBattles.getPartyTraits.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  // Living Universe — active events drive arena background
  const universeQuery = trpc.dailyBrief.getUniverseState.useQuery(undefined, { staleTime: 60_000, retry: false });
  const activeEventIds = useMemo(
    () => (universeQuery.data?.activeEvents ?? []).map((e: { eventId: string }) => e.eventId),
    [universeQuery.data],
  );

  // Arena background — driven by tier selection + active Living Universe events
  const arenaBackground = useMemo<ArenaBackground>(
    () => getArenaBackground(selectedTier?.id ?? "bronze_gauntlet", activeEventIds),
    [selectedTier, activeEventIds],
  );

  // Active weekly arena modifier (rotates through Dischordian epochs)
  const arenaModifier = useMemo(() => getActiveArenaModifier(), []);

  // Party synergy — ONLY active pets contribute to trait thresholds.
  // Benched pets still exist in the roster but don't count toward
  // synergy numbers. The player chooses their party via the roster's
  // active toggle button.
  const activePets = useMemo(
    () => (myPetsQuery.data ?? []).filter((p) => p.isActive),
    [myPetsQuery.data],
  );
  const partyTraits = useMemo(
    () => petsToPartyTraits(activePets.map((p) => ({
      petId: p.petId, name: p.name, species: p.species,
    }))),
    [activePets],
  );
  const partyBonuses = useMemo<PartyCombatBonuses>(
    () => resolvePartyCombatBonuses(resolvePartyBonuses(partyTraits)),
    [partyTraits],
  );

  // Auto-select first pet
  useEffect(() => {
    if (selectedPetId) return;
    const first = myPetsQuery.data?.[0];
    if (first) setSelectedPetId(first.petId);
  }, [myPetsQuery.data, selectedPetId]);

  // Fire a thought when we land in the arena
  useEffect(() => {
    if (myPetsQuery.data && myPetsQuery.data.length > 0) {
      setThoughtTrigger({ type: "room_enter", roomId: "arena" });
    }
  }, [myPetsQuery.data]);

  // Find the selected roster pet
  const activePet = useMemo(
    () => myPetsQuery.data?.find((p) => p.petId === selectedPetId) ?? myPetsQuery.data?.[0],
    [myPetsQuery.data, selectedPetId],
  );

  // Use server pets if available, fallback to hardcoded stage 2
  const petEvolution = (activePet?.evolutionStage ?? 2) as 1 | 2 | 3;
  const petBond = activePet?.bond ?? 60;
  const availableTiers = useMemo(() => getAvailableTiers(petEvolution), [petEvolution]);

  // Cast server rows to the roster shape
  const rosterPets: RosterPet[] = useMemo(
    () => (myPetsQuery.data ?? []).map((p) => ({
      petId: p.petId,
      species: p.species,
      name: p.name,
      evolutionStage: p.evolutionStage,
      bond: p.bond,
      skillPoints: p.skillPoints,
      currentHp: p.currentHp,
      maxHp: p.maxHp,
      wins: p.wins,
      losses: p.losses,
      injuredUntil: p.injuredUntil,
      isActive: p.isActive ?? true,
      isSpectral: p.isSpectral ?? false,
      deathCount: p.deathCount ?? 0,
    })),
    [myPetsQuery.data],
  );

  // Aggregated skill effects for the currently-selected pet. Used
  // when staging a matchup so unlocked skill tree nodes actually
  // change combat numbers.
  const activePetSkillEffects = useMemo<SkillBonusEffect>(
    () => activePet ? aggregateSkillEffects(activePet.unlockedSkillNodes ?? [], activePet.species) : {},
    [activePet],
  );

  const sidePanelPet = useMemo(
    () => myPetsQuery.data?.find((p) => p.petId === sidePanelPetId),
    [myPetsQuery.data, sidePanelPetId],
  );

  // Auto-play turn loop — driven by an explicit turn counter so we
  // can depend on `advanceTurn` without re-running the effect on
  // every log mutation.
  const [turnTick, setTurnTick] = useState(0);

  const startMatchup = async (tier: ArenaTier) => {
    setSelectedTier(tier);
    setServerRewards(null);
    const myPet = activePet;
    const player = myPet
      ? createBattlePet(myPet.petId, myPet.species, myPet.evolutionStage as 1|2|3, myPet.bond, partyBonuses, activePetSkillEffects)
      : createBattlePet("lux", "holographic_fox", petEvolution, petBond, partyBonuses, activePetSkillEffects);
    if (myPet) player.name = myPet.name;

    // Matchmaker: ask the server for a tier-appropriate opponent
    // scaled to the player's pet. Falls back to a default if the
    // call fails or if there's no active pet yet.
    let opponent: BattlePet;
    try {
      if (myPet) {
        const opponentData = await utils.petBattles.getArenaOpponent.fetch({
          tierId: tier.id as "bronze_gauntlet" | "silver_circle" | "gold_coliseum",
          petId: myPet.petId,
        });
        opponent = createBattlePet(
          opponentData.petId,
          opponentData.species,
          opponentData.evolutionStage,
          opponentData.bond,
        );
        opponent.name = opponentData.name;
      } else {
        opponent = createBattlePet("shadow", "void_crawler", petEvolution, 40);
        opponent.name = "Opponent: Shadow";
      }
    } catch (err) {
      console.warn("[PetBattles] matchmaker failed, using fallback", err);
      opponent = createBattlePet("shadow", "void_crawler", petEvolution, 40);
      opponent.name = "Opponent: Shadow";
    }
    // Let the pet react to the fight about to start
    setThoughtTrigger({ type: "combat_start" });
    setPlayerPet(player);
    setOpponentPet(opponent);
    setBattle({
      id: `battle-${Date.now()}`,
      player1Pet: player,
      player2Pet: opponent,
      round: 1, maxRounds: 10,
      status: "preparing",
      winner: null, log: [],
      turn: player.speed >= opponent.speed ? "player1" : "player2",
    });
    setLog([]);
    setPhase("matchup");
  };

  const beginBattle = () => {
    if (!battle) return;
    setBattle({ ...battle, status: "in_progress" });
    setPhase("battle");
    setIsAutoPlaying(true);
  };

  const advanceTurn = useCallback(() => {
    if (!battle || !playerPet || !opponentPet) return;
    const attacker = battle.turn === "player1" ? playerPet : opponentPet;
    const defender = battle.turn === "player1" ? opponentPet : playerPet;
    // Pick a random move (simple AI)
    const availableMoves = attacker.moves.filter(m => m.currentCooldown === 0);
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    if (!move) return;

    // Trigger VFX overlay if the move is tagged with a fusion/thread visual
    if (move.vfxType && move.vfxSpecies) {
      const lookup = move.vfxType === "fusion" ? VFX_FUSION_ART : VFX_THREAD_ART;
      const src = lookup[move.vfxSpecies];
      if (src) {
        const id = Date.now();
        setMoveVfx({ id, src, kind: move.vfxType });
        // Auto-clear after the animation duration so the next trigger is fresh
        setTimeout(() => {
          setMoveVfx(prev => (prev?.id === id ? null : prev));
        }, 650);
      }
    }

    // Player gets the party synergy + arena modifier + skill-node
    // effects; opponent only sees the arena modifier. When the opponent
    // is attacking, pass the player's skill effects as defenderSkillEffects
    // so Gilt/Spore armor nodes reduce incoming damage.
    const attackerIsPlayer = battle.turn === "player1";
    const entry = executeMove(attacker, defender, move.id, {
      partyBonuses: attackerIsPlayer ? partyBonuses : EMPTY_PARTY_BONUSES,
      arenaModifier,
      attackerIsPlayer,
      skillEffects: attackerIsPlayer ? activePetSkillEffects : {},
      defenderSkillEffects: attackerIsPlayer ? {} : activePetSkillEffects,
    });
    // End-of-turn regen (Tidal Flow etc. + skill regen) applies to the player.
    if (attackerIsPlayer) applyTurnPassives(playerPet, partyBonuses, activePetSkillEffects);
    // Surface low-HP thoughts
    if (playerPet.hp > 0 && playerPet.hp / playerPet.maxHp < 0.3) {
      setThoughtTrigger({ type: "low_hp" });
    }
    setLog(prev => [...prev, entry]);

    // Check for end
    if (defender.hp <= 0) {
      const winner: "player1" | "player2" = battle.turn === "player1" ? "player1" : "player2";
      const finalBattle: PetBattle = { ...battle, status: "completed" as const, winner };
      setBattle(finalBattle);
      setIsAutoPlaying(false);
      // Submit result to server
      const won = winner === "player1";
      const perfect = won && playerPet.hp === playerPet.maxHp;
      // Witnessing §3.6 — a pet battle win feeds the Light meter.
      if (won) applyDischordiaEnergy("pet_battle_rescue");
      submitBattleMutation.mutate({
        petId: playerPet.petId,
        opponentSpecies: opponentPet.petId,
        arenaTier: selectedTier?.id || "bronze_gauntlet",
        won, rounds: battle.round, perfectVictory: perfect,
        battleLog: [...log, entry],
      }, {
        onSuccess: (data) => setServerRewards(data.rewards),
        onError: (err) => console.warn("[PetBattles] Server submit failed:", err.message),
      });
      setTimeout(() => setPhase("result"), 1500);
      return;
    }

    // Next turn
    const nextRound = battle.turn === "player2" ? battle.round + 1 : battle.round;
    setBattle({
      ...battle,
      turn: battle.turn === "player1" ? "player2" : "player1",
      round: nextRound,
    });

    // Max rounds reached
    if (nextRound > battle.maxRounds) {
      const winner = playerPet.hp > opponentPet.hp ? "player1" : "player2";
      setBattle({ ...battle, status: "completed", winner });
      setIsAutoPlaying(false);
      const won = winner === "player1";
      // Witnessing §3.6 — a pet battle win on judged points still counts.
      if (won) applyDischordiaEnergy("pet_battle_rescue");
      submitBattleMutation.mutate({
        petId: playerPet.petId,
        opponentSpecies: opponentPet.petId,
        arenaTier: selectedTier?.id || "bronze_gauntlet",
        won, rounds: battle.round, perfectVictory: false,
        battleLog: log,
      }, {
        onSuccess: (data) => setServerRewards(data.rewards),
        onError: (err) => console.warn("[PetBattles] Server submit failed:", err.message),
      });
      setTimeout(() => setPhase("result"), 1500);
    }
  }, [battle, playerPet, opponentPet, partyBonuses, arenaModifier, activePetSkillEffects, log, selectedTier, submitBattleMutation]);

  // Auto-play tick: advance a turn on each tick while the battle is
  // in progress. Ticks are driven by a setTimeout that only re-arms
  // when the battle state genuinely changes, so the effect's deps
  // array can safely include advanceTurn without looping.
  useEffect(() => {
    if (!isAutoPlaying || !battle || battle.status !== "in_progress") return;
    const timer = setTimeout(() => {
      advanceTurn();
      setTurnTick((t) => t + 1);
    }, 900);
    return () => clearTimeout(timer);
  }, [isAutoPlaying, battle, turnTick, advanceTurn]);

  const reset = () => {
    setPhase("tier_select");
    setSelectedTier(null);
    setBattle(null);
    setLog([]);
    setPlayerPet(null);
    setOpponentPet(null);
    setIsAutoPlaying(false);
    // Refresh roster so revived/injured state + bond updates land
    utils.petBattles.getMyPets.invalidate();
  };

  const openSkills = (petId: string) => {
    setSidePanelPetId(petId);
    setSidePanel("skills");
  };
  const openQuests = (petId: string) => {
    setSidePanelPetId(petId);
    setSidePanel("quests");
  };
  const closeSidePanel = () => {
    setSidePanel("none");
    setSidePanelPetId(null);
  };

  const hasNoPets = myPetsQuery.data !== undefined && myPetsQuery.data.length === 0;

  /** Whether we're in an active battle phase (matchup/battle/result) that should show the arena background */
  const showArenaBackground = phase !== "tier_select";

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      {/* Arena background — visible during matchup/battle/result */}
      {showArenaBackground && (
        <div className="absolute inset-0 z-0">
          <img
            src={arenaBackground.imageUrl}
            alt={arenaBackground.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: arenaBackground.overlayColor }} />
        </div>
      )}
      {/* Default background for tier select */}
      {!showArenaBackground && <div className="absolute inset-0 z-0 bg-background" />}

      <div className="relative z-10 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Swords size={18} style={{ color: showArenaBackground ? arenaBackground.accentColor : undefined }} className={showArenaBackground ? "" : "void-text-error"} />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">
              {showArenaBackground ? arenaBackground.name.toUpperCase() : "ARENA OF SMALL THINGS"}
            </h1>
            <p className="font-mono text-[10px] text-white/50 tracking-wider">
              {showArenaBackground ? arenaBackground.lore.slice(0, 80) + "..." : "Specimen spectator combat · text-based · injuries carry forward"}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "tier_select" && (
            <motion.div key="tiers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {/* Active event arena override notice */}
              {activeEventIds.length > 0 && (() => {
                const eventBg = ARENA_BACKGROUNDS.find(bg => bg.activatedByEvent && activeEventIds.includes(bg.activatedByEvent));
                if (!eventBg) return null;
                return (
                  <div className="p-2 rounded border text-center" style={{ borderColor: `${eventBg.accentColor}40`, background: `${eventBg.accentColor}10` }}>
                    <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: eventBg.accentColor }}>
                      Living Universe Event Active — Arena Override: {eventBg.name}
                    </p>
                  </div>
                );
              })()}

              {/* Weekly epoch arena modifier */}
              <div className="p-2.5 rounded-md border void-border void-bg-sunk">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={12} className="void-text-energy" />
                  <span className="font-mono text-[9px] uppercase tracking-wider void-text-energy">
                    This Week's Arena Modifier — {arenaModifier.epochName}
                  </span>
                </div>
                <p className="font-display text-[11px] font-bold text-foreground">{arenaModifier.modifierName}</p>
                <p className="font-mono text-[9px] text-muted-foreground/80 leading-relaxed mt-0.5">
                  {arenaModifier.description}
                </p>
                <p className="font-mono text-[8px] italic text-muted-foreground/50 mt-1">
                  {arenaModifier.arenaDecoration}
                </p>
              </div>

              {/* Starter pet picker — only when roster is empty */}
              {hasNoPets && (
                <div className="border void-border void-bg-sunk rounded-lg p-4" data-testid="starter-pet-picker">
                  <h3 className="font-display text-xs font-bold tracking-[0.2em] void-text-accent mb-2">
                    CLAIM YOUR STARTER SPECIMEN
                  </h3>
                  <p className="font-mono text-[9px] text-muted-foreground/80 mb-3 leading-relaxed">
                    The Collector offers one specimen to new arrivals. Choose carefully — your first bond colors everything that follows.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { petId: "lux" as const, name: "Lux", species: "Holographic Fox", flavor: "Light-kin. Sees stories." },
                      { petId: "cipher" as const, name: "Cipher", species: "Data Serpent", flavor: "Code-bound. Detects lies." },
                      { petId: "echo" as const, name: "Echo", species: "Temporal Kitten", flavor: "Time-slip. Remembers futures." },
                    ].map((s) => (
                      <button
                        key={s.petId}
                        onClick={() => grantStarterMutation.mutate({ petChoice: s.petId })}
                        disabled={grantStarterMutation.isPending}
                        className="border border-border/40 rounded-md p-2 text-left void-border void-bg-sunk transition-colors disabled:opacity-50"
                        data-testid={`starter-${s.petId}`}
                      >
                        <div className="font-display text-sm font-bold text-foreground">{s.name}</div>
                        <div className="font-mono text-[9px] void-text-accent mt-0.5">{s.species}</div>
                        <p className="font-mono text-[9px] text-muted-foreground/70 italic mt-1 leading-relaxed">
                          {s.flavor}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Roster */}
              {rosterPets.length > 0 && (
                <PetRoster
                  pets={rosterPets}
                  selectedPetId={selectedPetId}
                  onSelect={setSelectedPetId}
                  onOpenSkills={openSkills}
                  onOpenQuests={openQuests}
                />
              )}

              {/* Collector's shop — buy additional specimens beyond the starter */}
              {rosterPets.length > 0 && rosterPets.length < 4 && (
                <div className="border border-border/30 rounded-lg bg-card/40 p-3" data-testid="pet-shop">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag size={14} className="void-text-accent" />
                    <span className="font-display text-xs font-bold tracking-[0.2em]">COLLECTOR'S SHOP</span>
                    <span className="font-mono text-[9px] text-muted-foreground/50">500 Dream each</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { petId: "spore", species: "spore_fungus", name: "Spore" },
                      { petId: "gilt", species: "gilt_beetle", name: "Gilt" },
                      { petId: "glyph", species: "glyph_moth", name: "Glyph" },
                      { petId: "flicker", species: "flicker_imp", name: "Flicker" },
                    ].filter((s) => !rosterPets.some((p) => p.petId === s.petId)).map((s) => (
                      <button
                        key={s.petId}
                        onClick={() => acquireShopMutation.mutate({
                          petId: s.petId,
                          species: s.species,
                          name: s.name,
                          source: "shop_purchase",
                        })}
                        disabled={acquireShopMutation.isPending}
                        className="border border-border/40 rounded p-2 text-center void-border void-bg-sunk transition-colors disabled:opacity-50"
                        data-testid={`shop-${s.petId}`}
                      >
                        <div className="font-display text-xs font-bold">{s.name}</div>
                        <div className="font-mono text-[8px] text-muted-foreground/60 truncate">{s.species}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Party synergy panel (only if we have ≥ 2 active pets) */}
              {partyTraits.length >= 2 && (
                <PartyTraitThresholdPanel party={partyTraits} title="ACTIVE PARTY SYNERGY" />
              )}

              <h2 className="font-display text-sm font-bold tracking-wider mb-2">SELECT TIER</h2>
              {ARENA_TIERS.map(tier => {
                const available = availableTiers.some(t => t.id === tier.id);
                const bg = getArenaBackground(tier.id, activeEventIds);
                return (
                  <button
                    key={tier.id}
                    onClick={() => available && startMatchup(tier)}
                    disabled={!available}
                    className={`w-full rounded border text-left transition-all overflow-hidden ${
                      available
                        ? "border-border/40 void-border-error"
                        : "border-border/20 opacity-40 cursor-not-allowed"
                    }`}
                    data-testid={`tier-${tier.id}`}
                  >
                    {/* Arena preview thumbnail */}
                    <div className="relative h-20 overflow-hidden">
                      <img src={bg.imageUrl} alt={bg.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in oklch, var(--bg-void) 85%, transparent) 0%, color-mix(in oklch, var(--bg-void) 20%, transparent) 100%)" }} />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold text-white">{tier.name}</span>
                          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${bg.accentColor}30`, color: bg.accentColor }}>
                            {bg.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-card/60">
                      <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed italic">
                        {tier.lore}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono text-[9px] void-text-accent">
                          +{tier.rewards.champion.xp} XP · +{tier.rewards.champion.dream} Dream
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
                          Evo {tier.minEvolution}+
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {phase === "matchup" && playerPet && opponentPet && (
            <motion.div key="matchup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h2 className="font-display text-sm font-bold tracking-wider text-center">MATCHUP</h2>
              <div className="grid grid-cols-2 gap-3">
                <PetCard pet={playerPet} side="player" />
                <PetCard pet={opponentPet} side="opponent" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={beginBattle}
                  className="flex-1 px-4 py-2 rounded border void-border-error void-bg-error void-text-error font-mono text-[11px] uppercase tracking-wider void-bg-error flex items-center justify-center gap-2"
                  data-testid="begin-battle"
                >
                  <Play size={12} /> Begin Battle
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded border border-border/40 text-muted-foreground font-mono text-[11px] uppercase tracking-wider hover:bg-muted/20"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {phase === "battle" && playerPet && opponentPet && battle && (
            <motion.div key="battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 relative">
              {/* Move VFX overlay — fusion/thread textures tied to signature moves */}
              <AnimatePresence>
                {moveVfx && (
                  <motion.img
                    key={moveVfx.id}
                    src={moveVfx.src}
                    alt=""
                    aria-hidden="true"
                    initial={{ opacity: 0.85, scale: moveVfx.kind === "fusion" ? 0.9 : 1 }}
                    animate={{ opacity: 0, scale: moveVfx.kind === "fusion" ? 1.15 : 1.25 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 z-20 w-full h-full object-contain mix-blend-screen"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    data-testid={`pet-battle-vfx-${moveVfx.kind}`}
                  />
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-3">
                <PetCard pet={playerPet} side="player" />
                <PetCard pet={opponentPet} side="opponent" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  Round {battle.round} / {battle.maxRounds}
                </span>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="font-mono text-[9px] uppercase tracking-wider void-text-error void-text-error"
                >
                  {isAutoPlaying ? "⏸ Pause" : "▶ Resume"}
                </button>
              </div>
              <div className="border border-border/30 rounded-lg bg-card/40 p-3 max-h-80 overflow-y-auto space-y-1.5">
                {log.length === 0 ? (
                  <p className="font-mono text-[10px] text-muted-foreground/50 italic text-center py-4">
                    Battle beginning…
                  </p>
                ) : log.slice(-15).map((entry, i) => (
                  <div key={i} className="font-mono text-[10px] leading-relaxed text-foreground/80">
                    <span className="text-muted-foreground/50">R{entry.round}</span>{" "}
                    {entry.flavor}
                    {entry.damage && entry.damage > 0 && (
                      <span className="void-text-error"> [-{entry.damage}]</span>
                    )}
                    {entry.critical && <span className="void-text-accent"> ★</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "result" && battle && battle.winner && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center">
              <Trophy
                size={48}
                className={`mx-auto ${battle.winner === "player1" ? "void-text-accent" : "void-text"}`}
              />
              <div>
                <h2 className="font-display text-xl font-bold tracking-wider">
                  {battle.winner === "player1" ? "VICTORY" : "DEFEAT"}
                </h2>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">
                  {playerPet?.name} {battle.winner === "player1" ? "wins" : "loses"} · {battle.round} rounds · {selectedTier?.name}
                </p>
              </div>
              {(() => {
                const rewards = serverRewards || calculateBattleRewards(battle.winner === "player1", battle.round, playerPet!.hp === playerPet!.maxHp);
                return (
                  <div className="space-y-1.5">
                    <div className="inline-flex gap-4 px-4 py-2 rounded border border-border/40 bg-card/40 font-mono text-[10px]">
                      <span className="void-text-accent">+{rewards.xp} XP</span>
                      <span className="void-text-system">+{rewards.dream} Dream</span>
                      <span className="void-text-energy">+{rewards.bondGain} Bond</span>
                      {rewards.injury > 0 && <span className="void-text-premium">-{rewards.injury} HP injury</span>}
                    </div>
                    {serverRewards && (
                      <p className="font-mono text-[8px] void-text-energy tracking-wider">✓ REWARDS SAVED TO SERVER</p>
                    )}
                    {submitBattleMutation.isPending && (
                      <p className="font-mono text-[8px] void-text-accent tracking-wider animate-pulse">SAVING RESULTS...</p>
                    )}
                  </div>
                );
              })()}
              <button
                onClick={reset}
                className="px-4 py-2 rounded border void-border-error void-bg-error void-text-error font-mono text-[11px] uppercase tracking-wider void-bg-error flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={12} /> Return to Arena
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      {/* Side panel overlay: skills / quests */}
      <AnimatePresence>
        {sidePanel !== "none" && sidePanelPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeSidePanel}
            data-testid="side-panel-overlay"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {sidePanel === "skills" && (
                <PetSkillTreePanel
                  petId={sidePanelPet.petId}
                  petName={sidePanelPet.name}
                  species={sidePanelPet.species}
                  availablePoints={sidePanelPet.skillPoints}
                  unlockedNodes={sidePanelPet.unlockedSkillNodes ?? []}
                />
              )}
              {sidePanel === "quests" && (
                <PetQuestTracker
                  petId={sidePanelPet.petId}
                  petName={sidePanelPet.name}
                  bond={sidePanelPet.bond}
                  completedFlags={sidePanelPet.completedQuestSteps ?? []}
                />
              )}
              <button
                onClick={closeSidePanel}
                className="mt-2 w-full px-4 py-2 rounded border border-border/40 text-muted-foreground font-mono text-[11px] uppercase tracking-wider hover:bg-muted/20"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thought bubble for the active pet */}
      {activePet && thoughtTrigger && (
        <PetThoughtBubble
          petId={activePet.petId}
          trigger={thoughtTrigger}
          bond={activePet.bond}
        />
      )}
    </div>
  );
}

/* ─── PET CARD ─── */
function PetCard({ pet, side }: { pet: BattlePet; side: "player" | "opponent" }) {
  const hpPercent = (pet.hp / pet.maxHp) * 100;
  const color = side === "player" ? "void-text-energy" : "void-text-error";
  const bg = side === "player" ? "void-bg-success void-border-success" : "void-bg-error void-border-error";

  return (
    <div className={`border rounded-lg p-3 ${bg}`} data-testid={`pet-${side}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-display text-sm font-bold ${color}`}>{pet.name}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          Stage {pet.evolutionStage}
        </span>
      </div>
      {/* HP bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
          <span className="text-muted-foreground/70 flex items-center gap-1">
            <Heart size={9} /> HP
          </span>
          <span className="text-foreground tabular-nums">{pet.hp}/{pet.maxHp}</span>
        </div>
        <div className="h-1.5 void-bg-canvas rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${hpPercent}%` }}
            className={`h-full ${hpPercent > 50 ? "void-bg-success" : hpPercent > 25 ? "void-bg-sunk" : "void-bg-error"}`}
          />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
        <div className="flex items-center gap-1"><Swords size={9} className="void-text-error" />{pet.attack}</div>
        <div className="flex items-center gap-1"><Shield size={9} className="void-text-energy" />{pet.defense}</div>
        <div className="flex items-center gap-1"><Zap size={9} className="void-text-premium" />{pet.speed}</div>
      </div>
      {/* Status effects */}
      {pet.statusEffects.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {pet.statusEffects.map((s, i) => (
            <span key={i} className="font-mono text-[8px] px-1 py-0.5 rounded bg-white/10 text-foreground">
              {s.name} ({s.duration})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
