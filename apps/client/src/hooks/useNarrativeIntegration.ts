/* ═══════════════════════════════════════════════════════
   NARRATIVE INTEGRATION — Ties game systems to story

   Connects lore discovery, morality consequences,
   cross-game narrative threads, and NPC trust effects
   into a cohesive system that makes the world feel alive.

   Mount useNarrativeIntegration() in AppShell alongside
   useNarrativeEvents() for the full narrative pipeline.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useCallback, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { useActVO } from "@/hooks/useActVO";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { dispatchNarrativeEffect, dispatchMoralityShift } from "@/hooks/useNarrativeEvents";
import { getAtmosphereForMorality, pushTemporaryTheme, popTemporaryTheme } from "@/engine/voidEngine";
import { playSlideshow } from "@/stores/witnessingStore";
import { useDischordiaCycleStore } from "@/stores/dischordiaCycleStore";
import { recordMemorableMoment } from "@/stores/memorableMomentsStore";
import {
  WITNESSING_MILESTONES,
  type WitnessingMilestoneId,
} from "@shared/witnessingEvents";
import { NARRATOR_BOND_THRESHOLDS } from "@shared/narratorBond";
import { ZEPHYR_9_CLASSROOM } from "@shared/act2Interlude";
import {
  climbRankToClassroomDepth,
  climbTierClearedFlag,
  climbTierCompanionTrigger,
} from "@shared/act2ClimbBridge";
import { deriveAct2CompletionStatus } from "@shared/act2CompletionGate";
import { deriveAct3CompletionStatus } from "@shared/act3CompletionGate";
import { deriveAct4CompletionStatus } from "@shared/act4CompletionGate";
import { deriveAct4_5CompletionStatus } from "@shared/act4_5CompletionGate";
import { deriveAct5CompletionStatus } from "@shared/act5CompletionGate";
import { deriveAct6CompletionStatus } from "@shared/act6CompletionGate";
import { deriveAct7CompletionStatus } from "@shared/act7CompletionGate";
import {
  RECRUITMENT_THRESHOLDS,
  hasReachedAct6Threshold,
  hasReachedAct7Threshold,
  getRecruitmentMissionCount,
} from "@shared/armyRecruitment";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import {
  PRELUDE_HANDOFF_TARGET_ACT,
  shouldAdvanceToAct1OnPreludeComplete,
} from "@shared/preludeHandoff";
import {
  getPendingKaelPayoffCinematic,
  KAEL_FRAGMENTS,
} from "@shared/appendixBKaelQuestline";
import {
  isKaelQuestlineComplete,
  pendingKaelFragmentUnlocks,
  type KaelFragmentWatcherContext,
} from "@shared/kaelFragmentWatchers";
import { act4PrisonerFlagsForCompletedStoryChapters } from "@shared/actsFourFiveShells";
import { CARD_BATTLE_MILESTONES } from "@shared/dischordiaCycle";
import { ENGINEER_RECORDINGS } from "@shared/engineerRecordings";
import { loadStoryProgress } from "@/game/storyMode";

/* ─── LORE DISCOVERY TRIGGERS ───
   Automatically discover lore entries based on game state changes.
   This is the missing mechanism: when players reach trust milestones,
   explore rooms, or complete achievements, lore entries unlock. */

const TRUST_LORE_UNLOCKS: Record<string, { trust: number; loreIds: string[] }[]> = {
  elara: [
    { trust: 20, loreIds: ["elara_senator_voss", "inception_ark_1047"] },
    { trust: 40, loreIds: ["panoptic_consciousness", "elara_sacrifice"] },
    { trust: 60, loreIds: ["architect_war_origins", "dream_technology"] },
    { trust: 80, loreIds: ["elara_true_identity", "seventh_seal"] },
  ],
  the_human: [
    { trust: 20, loreIds: ["the_human_student", "seeker_movement"] },
    { trust: 40, loreIds: ["daniel_wright", "the_human_detective"] },
    { trust: 60, loreIds: ["imprisoned_archon", "kael_betrayal"] },
    { trust: 80, loreIds: ["the_human_true_identity", "archon_war_truth"] },
  ],
  agent_zero: [
    { trust: 30, loreIds: ["zero_agency_origins", "shadow_operations"] },
    { trust: 60, loreIds: ["zero_true_mission", "insurgency_network"] },
  ],
  the_antiquarian: [
    { trust: 30, loreIds: ["time_displacement", "antiquarian_collection"] },
    { trust: 60, loreIds: ["antiquarian_era_origins", "temporal_paradox"] },
  ],
  adjudicator_locke: [
    { trust: 30, loreIds: ["new_babylon_justice", "locke_investigations"] },
    { trust: 60, loreIds: ["locke_true_agenda", "bureaucratic_resistance"] },
  ],
  the_source: [
    { trust: 30, loreIds: ["terminus_virus", "source_consciousness"] },
    { trust: 60, loreIds: ["kael_transformation", "terminus_sovereign"] },
  ],
  shadow_tongue: [
    { trust: 30, loreIds: ["corrupted_systems", "whisper_network"] },
    { trust: 60, loreIds: ["shadow_tongue_origins", "digital_corruption"] },
  ],
};

const ROOM_LORE_UNLOCKS: Record<string, string[]> = {
  "cryo-bay": ["inception_ark_1047", "cryogenic_protocol"],
  "medical-bay": ["ark_medical_systems"],
  "bridge": ["ark_navigation", "star_chart"],
  "archives": ["archon_histories", "ne_yon_chronicles"],
  "observation-deck": ["void_between_stars", "cosmic_map"],
  "comms-array": ["signal_network", "faction_transmissions"],
  "engineering": ["ark_engine_core", "terminus_technology"],
  "armory": ["combat_archives", "weapon_manifest"],
  "chaos-forge": ["forge_origins", "creation_engine"],
  "guild-sanctum": ["guild_histories", "syndicate_charter"],
  "quantum-lab": ["quantum_research", "void_crystal_science"],
  "shadow-vault": ["shadow_archives", "forbidden_knowledge"],
};

/* ─── MORALITY WORLD EFFECTS ───
   When morality shifts significantly, show visible world changes:
   - Screen narrative effects at threshold crossings
   - Toast notifications about the world changing
   - Atmosphere push for dramatic moments */

const MORALITY_THRESHOLDS = [-80, -60, -40, -20, 20, 40, 60, 80];

const MORALITY_MESSAGES: Record<number, { title: string; description: string; effect: string }> = {
  [-80]: { title: "Machine Ascendant", description: "The Architect's whispers become commands. You see the code beneath reality.", effect: "static" },
  [-60]: { title: "Machine Devoted", description: "Algorithmic clarity sharpens your mind. Humanity feels... distant.", effect: "distort" },
  [-40]: { title: "Machine Aligned", description: "Logic begins to override instinct. The Machine's order has appeal.", effect: "glitch" },
  [-20]: { title: "Machine Leaning", description: "You notice patterns the others miss. The Machine sees you.", effect: "pulse" },
  [20]: { title: "Humanity Leaning", description: "You feel the warmth of connection. Free will matters.", effect: "breathe" },
  [40]: { title: "Humanity Aligned", description: "The Dreamer's songs echo in your consciousness. You choose compassion.", effect: "drift" },
  [60]: { title: "Humanity Devoted", description: "Your empathy becomes a weapon. The Machine cannot understand this.", effect: "surge" },
  [80]: { title: "Humanity Ascendant", description: "You carry the hopes of every soul on this Ark. The Dreamer smiles.", effect: "surge" },
};

/* ─── CROSS-GAME NARRATIVE THREADS ───
   Game mode results affect NPC dialog and room descriptions. */

const CROSS_GAME_EVENTS: Record<string, { flag: string; toast: { title: string; desc: string } }> = {
  "fight_streak_5": { flag: "combat_renowned", toast: { title: "Word Spreads", desc: "Your arena victories echo through the Ark. NPCs take notice." } },
  "fight_streak_10": { flag: "combat_legendary", toast: { title: "Legend Born", desc: "The Collector speaks of your prowess. New dialog options may be available." } },
  "card_wins_10": { flag: "strategist_recognized", toast: { title: "Strategist", desc: "Your DISCHORDIA victories attract attention from The Antiquarian." } },
  "terminus_wave_20": { flag: "terminus_champion", toast: { title: "Terminus Champion", desc: "Reaching Wave 20 proves your worth. The Source acknowledges you." } },
  "chess_grandmaster": { flag: "chess_master", toast: { title: "Master Strategist", desc: "Your chess mastery impresses Adjudicator Locke." } },
};

/* ─── NPC TRUST CONSEQUENCE NOTIFICATIONS ───
   When trust crosses thresholds, notify the player of new abilities/dialog. */

const TRUST_CONSEQUENCE_MESSAGES: Record<string, Record<number, string>> = {
  elara: {
    20: "Elara trusts you enough to share ship system access. +3% defense in combat.",
    40: "Elara considers you a confidant. She may heal you during fights. +1 HP regen.",
    60: "Elara's loyalty deepens. New dialog options unlocked. +5% defense.",
    80: "Elara would die for you. Summon ability unlocked. +10% revive chance.",
  },
  the_human: {
    20: "The Human respects your strength. +3% attack in combat.",
    40: "The Human shares tactical insights. +2% crit chance.",
    60: "The Human reveals hidden strategies. +5% attack. New dialog paths.",
    80: "The Human trusts you completely. Summon ability unlocked.",
  },
  agent_zero: {
    30: "Agent Zero provides intel drops. +5% mission speed.",
    60: "Zero considers you an asset. Spy missions unlocked.",
  },
  the_antiquarian: {
    30: "The Antiquarian shares temporal knowledge. +10% XP from lore.",
    60: "The Antiquarian opens forbidden archives. New research available.",
  },
  shadow_tongue: {
    30: "Shadow Tongue's whispers grow clearer. Corruption power available — at a cost.",
    60: "Shadow Tongue offers a dark bargain. Authority skill enhanced.",
  },
};

/**
 * Mount in AppShell. Watches game state changes and triggers
 * narrative consequences automatically.
 */
/**
 * Witnessing §5 — Slideshow trigger table.
 *
 * Every P0 slideshow in the §5.5 priority list maps one upstream
 * gameplay flag to one slideshow id, plus the completion flag that
 * blocks replay. Adding a new §5.5 entry is one row in this table
 * plus the slideshow definition in shared/songSlideshows.ts — no
 * new effect wiring.
 *
 * Exported for the structural test in this file's test suite.
 */
export const SLIDESHOW_TRIGGERS: ReadonlyArray<{
  triggerFlag: string;
  slideshowId: string;
  completionFlag: string;
}> = [
  {
    // §5.4 / §12 C4 — Act 1 finale. The Engineer's execution.
    triggerFlag: "act_1_complete",
    slideshowId: "last-words",
    completionFlag: "slideshow_last_words_complete",
  },
  {
    // §4.3 / §12 C2 — Cycle A finale. Gameplay must set
    // `act_1_cycle_a_complete` when the Little Watcher falls.
    triggerFlag: "act_1_cycle_a_complete",
    slideshowId: "welcome-to-celebration",
    completionFlag: "slideshow_welcome_to_celebration_complete",
  },
  {
    // §4.4 / §12 C3 — Cycle B finale. Gameplay sets
    // `act_1_cycle_b_complete` when the final Mechronis battle
    // resolves.
    triggerFlag: "act_1_cycle_b_complete",
    slideshowId: "to-be-the-human",
    completionFlag: "slideshow_to_be_the_human_complete",
  },
  {
    // §7 / §12 C6 — Act 3 opener. Gameplay sets `act_3_starting`
    // when the player transitions out of the Act 2 interlude.
    triggerFlag: "act_3_starting",
    slideshowId: "i-am-the-eyes-that-watch",
    completionFlag: "slideshow_i_am_the_eyes_that_watch_complete",
  },
  {
    // §1.5 / §12 C10 — Bond 80 emotional peak. The watcher
    // effect below sets `bond_80_mutual_peak` when both
    // elaraTrustLevel and humanTrustLevel cross 80 for the
    // first time.
    triggerFlag: "bond_80_mutual_peak",
    slideshowId: "two-witnesses-meet",
    completionFlag: "slideshow_two_witnesses_meet_complete",
  },
  {
    // ACT1_NARRATIVE_STRUCTURE.md §6 — Two Witnesses Meet Part 2
    // (Act 1 narrative close). Fires after §5.8.1 Light/Dark persist
    // (the watcher below raises `act1_section_6_ready` on the
    // lightDarkAlignment null → set transition). The slideshow's
    // `flagsSetOnComplete` writes `act1_complete` + the two
    // witness_*_met_part2 flags Acts 2+ consume.
    triggerFlag: "act1_section_6_ready",
    slideshowId: "two-witnesses-part-2",
    completionFlag: "slideshow_two_witnesses_part_2_complete",
  },
  {
    // §6.5 / §12 C5 — Act 2 Thaloria cinematic. Gameplay sets
    // `thaloria_cinematic_unlocked` on the player's third
    // Collector's Arena match win.
    triggerFlag: "thaloria_cinematic_unlocked",
    slideshowId: "the-helmet-in-the-grass",
    completionFlag: "slideshow_the_helmet_in_the_grass_complete",
  },
  {
    // §14.1 — Silence of Two Witnesses. The bond-60 watcher in
    // this hook raises `event_silence_of_two_witnesses`; the
    // slideshow sets `slideshow_silence_of_two_witnesses_complete`.
    triggerFlag: "event_silence_of_two_witnesses",
    slideshowId: "silence-of-two-witnesses",
    completionFlag: "slideshow_silence_of_two_witnesses_complete",
  },
  {
    // §5.5 P1 — Human dark-trust confession. Watcher below
    // raises `human_dark_confession_unlocked` when Human bond
    // > 60 AND Elara bond < 20 (asymmetric trust shape).
    triggerFlag: "human_dark_confession_unlocked",
    slideshowId: "superman-aint-coming",
    completionFlag: "slideshow_superman_aint_coming_complete",
  },
  {
    // §5.5 P1 — Elara high-trust confession. Watcher below
    // raises `elara_high_confession_unlocked` when Elara
    // bond > 80 (symmetric check — Elara carries this one
    // regardless of how the player feels about The Human).
    triggerFlag: "elara_high_confession_unlocked",
    slideshowId: "it-aint-been-the-same",
    completionFlag: "slideshow_it_aint_been_the_same_complete",
  },
  {
    // §11.5 / §12 C11 — Vortex endgame, LIGHT variant. Fires
    // when the community's cumulative Light Energy exceeds
    // 1M at endgame trigger. The watcher below picks this
    // variant over the_bulb_breaks based on the server's
    // cycle state at endgame time.
    triggerFlag: "vortex_endgame_light_variant",
    slideshowId: "the-light-holds",
    completionFlag: "slideshow_the_light_holds_complete",
  },
  {
    // §11.5 / §12 C11 — Vortex endgame, DARK variant. Fires
    // when the community's cumulative Dark Energy exceeds
    // Light at endgame trigger (or vortex_proximity has
    // saturated).
    triggerFlag: "vortex_endgame_dark_variant",
    slideshowId: "the-bulb-breaks",
    completionFlag: "slideshow_the_bulb_breaks_complete",
  },
  {
    // §9 — Act 4 opener. GameContext advances narrativeAct to 4
    // after act_3_complete fires; the Act 4 gate also watches
    // `act_4_started` which advanceNarrativeAct sets, so the
    // slideshow fan-out picks it up and plays the intro. The
    // completion flag feeds the Act 4 completion gate's first
    // required field.
    triggerFlag: "act_4_started",
    slideshowId: "act-4-revelation-intro",
    completionFlag: "slideshow_act_4_revelation_intro_complete",
  },
  {
    // §10 — Act 4.5 opener. SIBLING to Act 5 — fires when the
    // player accepts Dead Man's Circuit. advanceNarrativeAct does
    // NOT raise this; it's set from the Act 4 gate atomically.
    triggerFlag: "act_4_5_started",
    slideshowId: "act-4-5-intro",
    completionFlag: "slideshow_act_4_5_intro_complete",
  },
  {
    // §11 — Act 5 opener. Fires when act_5_started raises
    // (set atomically by the Act 4 gate or by GameContext's
    // advanceNarrativeAct(5)).
    triggerFlag: "act_5_started",
    slideshowId: "act-5-map-intro",
    completionFlag: "slideshow_act_5_map_intro_complete",
  },
  {
    // §12 — Act 6 opener. Trigger watcher above raises
    // act_6_started when recruitment >= 5 AND narrativeAct >= 5.
    triggerFlag: "act_6_started",
    slideshowId: "act-6-confession-intro",
    completionFlag: "slideshow_act_6_confession_intro_complete",
  },
  {
    // §13 — Act 7 opener. Trigger watcher raises act_7_started
    // when recruitment >= 8 AND act_6_complete is true.
    triggerFlag: "act_7_started",
    slideshowId: "act-7-convergence-intro",
    completionFlag: "slideshow_act_7_convergence_intro_complete",
  },
  {
    // Silence in Heaven · title track. Rev 8:1 — "there was silence
    // in heaven for about half an hour" — the threshold beat between
    // the Revelation climax (Act 5 opener) and the final stand. Fires
    // ONCE after the Act 5 map intro lands so the silence drops as
    // the moment-of-quiet before what follows. Other SiH tracks stay
    // album-page-only (CTA-driven from AlbumPage); this is the single
    // auto-fired track because the title carries the threshold. The
    // narrative team can extend the table when other beats commit.
    triggerFlag: "slideshow_act_5_map_intro_complete",
    slideshowId: "sih-12",
    completionFlag: "slideshow_sih_12_complete",
  },
];

export function useNarrativeIntegration() {
  const {
    state,
    setNarrativeFlag,
    getNarratorBond,
    advanceNarrativeAct,
  } = useGame();
  // Act 2 VO — Zephyr classroom tier-crossing teaching lines + Chess
  // Climb tier-won companion reactions fire from the effect below.
  // Lazy-loaded; hurts nothing for players not in Act 2.
  const act2Vo = useActVO("2");
  const prevMoralityRef = useRef(state.moralityScore);
  const prevTrustRef = useRef<Record<string, number>>({});
  const prevRoomsRef = useRef<Set<string>>(new Set());
  const discoveredRef = useRef<Set<string>>(new Set());
  const slideshowFiredRef = useRef<Set<string>>(new Set());
  const dischordiaCyclePhase = useDischordiaCycleStore((s) => s.state.phase);
  const applyRawDelta = useDischordiaCycleStore((s) => s.applyRawDelta);

  // §6.3 Chess Climb bridge — pull the server-authoritative Climb
  // state so the effective Zephyr-9 classroom depth reflects what
  // the player has actually cleared. The mapping lives in
  // act2ClimbBridge.ts. See `climbRankToClassroomDepth`.
  const { isAuthenticated } = useAuth();
  const climbStateQ = trpc.chessClimb.getState.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
  const climbRank = climbStateQ.data?.unlocks.highestClearedRank ?? -1;

  /**
   * Fire a §14.1 Witnessing milestone event: raise its flag,
   * show the toast, and apply any light/dark energy to the
   * Dischordia Cycle store. Dedupe is provided by the flag
   * — if the flag is already set, the effect is a no-op.
   */
  const fireMilestone = useCallback(
    (id: WitnessingMilestoneId) => {
      const milestone = WITNESSING_MILESTONES[id];
      if (!milestone) return;
      if (state.narrativeFlags?.[milestone.raisesFlag]) return;
      setNarrativeFlag(milestone.raisesFlag, true);
      toast.info(milestone.title, {
        description: milestone.description,
        duration: 8000,
      });
      if (milestone.lightEnergyReward || milestone.darkEnergyCost) {
        applyRawDelta({
          light: milestone.lightEnergyReward,
          dark: milestone.darkEnergyCost,
        });
      }
      // B3 (dual-faction recruitment plan) — Architect-only reaction
      // alongside the toast. The companion-comment system picks up
      // the trigger if a matching `witnessing_milestone_{id}` line is
      // authored in apps/shared/companionComments.ts; if not, the
      // fire is a silent no-op (companionCommentQueue dedupes by
      // trigger). The Architect's calibration-acknowledgment register
      // is the only speaker registered for these triggers — Elara,
      // the Human, and the Antiquarian have their own surfaces.
      fireCompanionComment(`witnessing_milestone_${id}`);
    },
    [state.narrativeFlags, setNarrativeFlag, applyRawDelta],
  );

  // Initialize discovered set from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("loredex_discovered") || "[]");
      discoveredRef.current = new Set(stored);
    } catch { /* ignore */ }
  }, []);

  const discoverLore = useCallback((ids: string[]) => {
    const newIds = ids.filter(id => !discoveredRef.current.has(id));
    if (newIds.length === 0) return;
    for (const id of newIds) discoveredRef.current.add(id);
    try {
      localStorage.setItem("loredex_discovered", JSON.stringify([...discoveredRef.current]));
    } catch { /* full */ }
    toast.info("Lore Discovered", {
      description: `${newIds.length} new Loredex ${newIds.length === 1 ? "entry" : "entries"} unlocked.`,
    });
  }, []);

  // ─── MORALITY THRESHOLD CROSSINGS ───
  useEffect(() => {
    const prev = prevMoralityRef.current;
    const curr = state.moralityScore;
    prevMoralityRef.current = curr;

    if (prev === curr) return;

    // Check if we crossed a threshold
    for (const threshold of MORALITY_THRESHOLDS) {
      const crossedForward = (prev < threshold && curr >= threshold) || (prev > threshold && curr <= threshold);
      const crossedReverse = (prev >= threshold && curr < threshold) || (prev <= threshold && curr > threshold);
      if (crossedForward || crossedReverse) {
        const msg = MORALITY_MESSAGES[threshold];
        if (msg) {
          toast.info(msg.title, { description: msg.description, duration: 8000 });
          dispatchNarrativeEffect(msg.effect as any);
          dispatchMoralityShift(curr < 0 ? "machine" : "humanity");
        }
        break; // Only show one threshold message per change
      }
    }
  }, [state.moralityScore]);

  // ─── NPC TRUST MILESTONE LORE + CONSEQUENCES ───
  useEffect(() => {
    const allTrust: Record<string, number> = {
      elara: state.elaraTrust ?? 0,
      the_human: state.humanTrust ?? 0,
      ...(state.npcTrust ?? {}),
    };

    for (const [npcId, trust] of Object.entries(allTrust)) {
      const prevTrust = prevTrustRef.current[npcId] ?? 0;
      if (trust === prevTrust) continue;

      // Lore unlocks
      const unlocks = TRUST_LORE_UNLOCKS[npcId];
      if (unlocks) {
        for (const { trust: threshold, loreIds } of unlocks) {
          if (prevTrust < threshold && trust >= threshold) {
            discoverLore(loreIds);
          }
        }
      }

      // Trust consequence notifications
      const consequences = TRUST_CONSEQUENCE_MESSAGES[npcId];
      if (consequences) {
        for (const [threshStr, message] of Object.entries(consequences)) {
          const threshold = Number(threshStr);
          if (prevTrust < threshold && trust >= threshold) {
            toast.success(`Trust Milestone: ${npcId.replace(/_/g, " ")}`, {
              description: message,
              duration: 8000,
            });
            dispatchNarrativeEffect("pulse");
          }
        }
      }
    }

    prevTrustRef.current = allTrust;
  }, [state.elaraTrust, state.humanTrust, state.npcTrust, discoverLore]);

  // ─── ROOM EXPLORATION LORE DISCOVERY ───
  useEffect(() => {
    const rooms = state.rooms ?? {};
    for (const [roomId, roomState] of Object.entries(rooms)) {
      if (!roomState.unlocked) continue;
      if (prevRoomsRef.current.has(roomId)) continue;
      prevRoomsRef.current.add(roomId);

      const loreIds = ROOM_LORE_UNLOCKS[roomId];
      if (loreIds) {
        // Delayed discovery (after room transition animation)
        setTimeout(() => discoverLore(loreIds), 3000);
      }
    }
  }, [state.rooms, discoverLore]);

  // ─── PRELUDE → ACT 1 HANDOFF ───
  // The burnt-card mission raises `prelude_complete` (see
  // shared/preludeCrewMissions.ts). That flag is the Prelude's
  // "I'm done" signal. Nothing between that flag and Act 1's
  // ACT_TRIGGERS used to advance narrativeAct, so Act 1 was
  // unreachable from the Prelude (roadmap ship-blocker).
  //
  // The predicate is pure (shared/preludeHandoff.ts). This
  // effect just calls advanceNarrativeAct when it returns true.
  // Guarded idempotently: once narrativeAct advances past 0 the
  // predicate returns false, so re-renders don't loop.
  useEffect(() => {
    if (
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: state.narrativeAct,
        narrativeFlags: state.narrativeFlags,
      })
    ) {
      advanceNarrativeAct(PRELUDE_HANDOFF_TARGET_ACT);
    }
  }, [
    state.narrativeAct,
    state.narrativeFlags?.prelude_complete,
    advanceNarrativeAct,
  ]);

  // ─── PR-2 — AUTO-CLAIM STARTER PACK ON PRELUDE COMPLETE ───
  // `trpc.cardGame.claimStarterPack` grants 15 starter cards + a
  // pre-built "Starter Deck" on first call. The mutation is
  // idempotent (it bails with `{ success: false }` if the user
  // already has cards), so calling it more than once is harmless.
  // Before this effect existed, the mutation was authored but never
  // called — fresh players had an empty collection until they
  // manually opened booster packs.
  //
  // Gated on prelude_complete so the grant happens the moment the
  // player lands in Act 1. We persist a `starter_pack_claimed`
  // flag so the mutation doesn't fire on every render even though
  // the server side would reject it.
  const claimStarterPackMutation = trpc.cardGame.claimStarterPack.useMutation();
  const starterPackClaimedRef = useRef(false);
  useEffect(() => {
    if (starterPackClaimedRef.current) return;
    if (!state.narrativeFlags?.prelude_complete) return;
    if (state.narrativeFlags?.starter_pack_claimed) {
      starterPackClaimedRef.current = true;
      return;
    }
    starterPackClaimedRef.current = true;
    claimStarterPackMutation.mutate(undefined, {
      onSuccess: (result) => {
        // The server returns { success: true, cardsGranted, deckCreated }
        // on a fresh claim, or { success: false } if the user already
        // had cards. Either way we raise the flag so this never
        // retries.
        setNarrativeFlag("starter_pack_claimed", true);
        if (result?.success) {
          toast.success("Starter deck unlocked", {
            description:
              "15 cards + a starter deck added to your collection. Ready for your first match.",
            duration: 12000,
          });
        }
      },
      onError: () => {
        // Reset the ref so a future render can retry after a
        // transient network hiccup — but DO NOT raise the flag.
        starterPackClaimedRef.current = false;
      },
    });
  }, [
    state.narrativeFlags?.prelude_complete,
    state.narrativeFlags?.starter_pack_claimed,
    claimStarterPackMutation,
    setNarrativeFlag,
  ]);

  // ─── WITNESSING §1.5 / §14.1 — MUTUAL BOND MILESTONES ───
  // Three tiers of shared bond fire scripted Living Universe
  // milestones. Each is guarded by the milestone's narrative
  // flag so it only fires once per save.
  //
  //   bond 40 → "Two Witnesses Remember"  (+5 community light)
  //   bond 60 → "The Silence of Two Witnesses" (bonds freeze,
  //              neither narrator speaks for 30 min real-time)
  //   bond 80 → "The Two Witnesses Meet" (triggers §12 C10
  //              cinematic via the SLIDESHOW_TRIGGERS fan-out)
  //
  // The bond number comes from getNarratorBond() — which reads
  // the canonical state.narratorBond field or falls back to
  // min(elaraTrustLevel, humanTrustLevel) for saves that predate
  // the field. Thresholds live in NARRATOR_BOND_THRESHOLDS so
  // the numbers can't drift between the helper and the hook.
  const mutualBond = getNarratorBond();
  useEffect(() => {
    if (mutualBond >= NARRATOR_BOND_THRESHOLDS.remember) {
      fireMilestone("two_witnesses_remember");
    }
    if (mutualBond >= NARRATOR_BOND_THRESHOLDS.silence) {
      fireMilestone("silence_of_two_witnesses");
    }
    if (mutualBond >= NARRATOR_BOND_THRESHOLDS.meet) {
      fireMilestone("two_witnesses_meet");
      if (
        !state.narrativeFlags?.bond_80_mutual_peak &&
        !state.narrativeFlags?.slideshow_two_witnesses_meet_complete
      ) {
        setNarrativeFlag("bond_80_mutual_peak", true);
        // Witnessing §11.2 — feed slot: "The letter you never
        // sent in the Captain's Quarters". Fires exactly once
        // when both bonds first land at 80 together.
        recordMemorableMoment(
          "bond_peak",
          "The night you trusted both of them at once. A page of a letter you never sent.",
        );
      }
    }
  }, [
    mutualBond,
    state.narrativeFlags?.bond_80_mutual_peak,
    state.narrativeFlags?.slideshow_two_witnesses_meet_complete,
    setNarrativeFlag,
    fireMilestone,
  ]);

  // ─── WITNESSING §5.5 P1 — ASYMMETRIC CONFESSION CINEMATICS ───
  // Two P1 slideshows fire on asymmetric trust shapes:
  //
  //   Human bond > 60 AND Elara bond < 20 → Superman Ain't Coming
  //     (the player has leaned hard into the noir voice; The
  //      Human confesses what his Archon years cost him)
  //
  //   Elara bond > 80 → It Ain't Been the Same
  //     (the player has earned Elara's highest trust tier; she
  //      confesses what she signed on Atarion)
  //
  // Both are gated by their own completion flags for cross-
  // session dedupe. Setting the trigger flag hands off to the
  // SLIDESHOW_TRIGGERS fan-out.
  useEffect(() => {
    const elaraBond = state.elaraTrustLevel ?? 0;
    const humanBond = state.humanTrustLevel ?? 0;
    if (
      humanBond > 60 &&
      elaraBond < 20 &&
      !state.narrativeFlags?.human_dark_confession_unlocked &&
      !state.narrativeFlags?.slideshow_superman_aint_coming_complete
    ) {
      setNarrativeFlag("human_dark_confession_unlocked", true);
    }
    if (
      elaraBond > 80 &&
      !state.narrativeFlags?.elara_high_confession_unlocked &&
      !state.narrativeFlags?.slideshow_it_aint_been_the_same_complete
    ) {
      setNarrativeFlag("elara_high_confession_unlocked", true);
    }
  }, [
    state.elaraTrustLevel,
    state.humanTrustLevel,
    state.narrativeFlags?.human_dark_confession_unlocked,
    state.narrativeFlags?.slideshow_superman_aint_coming_complete,
    state.narrativeFlags?.elara_high_confession_unlocked,
    state.narrativeFlags?.slideshow_it_aint_been_the_same_complete,
    setNarrativeFlag,
  ]);

  // ─── WITNESSING §11.5 — VORTEX ENDGAME VARIANT SELECTOR ───
  // When gameplay sets `vortex_endgame_triggered` (by finishing
  // the Act 5 Cades mission chain, or by the community cycle
  // phase reaching a specific threshold), this watcher reads
  // the Dischordia Cycle state and picks the LIGHT variant or
  // the DARK variant based on the community totals at that
  // exact moment.
  //
  //   lightEnergy > darkEnergy  → vortex_endgame_light_variant
  //   otherwise                 → vortex_endgame_dark_variant
  //
  // Both are guarded by the "seen" flag so the player sees
  // one and only one ending per save.
  const cycleLight = useDischordiaCycleStore((s) => s.state.lightEnergy);
  const cycleDark = useDischordiaCycleStore((s) => s.state.darkEnergy);
  useEffect(() => {
    if (!state.narrativeFlags?.vortex_endgame_triggered) return;
    if (state.narrativeFlags?.vortex_endgame_seen) return;
    if (
      state.narrativeFlags?.vortex_endgame_light_variant ||
      state.narrativeFlags?.vortex_endgame_dark_variant
    ) {
      return;
    }
    if (cycleLight > cycleDark) {
      setNarrativeFlag("vortex_endgame_light_variant", true);
    } else {
      setNarrativeFlag("vortex_endgame_dark_variant", true);
    }
  }, [
    state.narrativeFlags?.vortex_endgame_triggered,
    state.narrativeFlags?.vortex_endgame_seen,
    state.narrativeFlags?.vortex_endgame_light_variant,
    state.narrativeFlags?.vortex_endgame_dark_variant,
    cycleLight,
    cycleDark,
    setNarrativeFlag,
  ]);

  // ─── ACT 1 §6 — SECTION 6 GATE RAISER ───
  // Fires the `act1_section_6_ready` trigger flag the moment the
  // §5.8.1 Light/Dark persist lands — that is, the first time
  // state.lightDarkAlignment transitions from null to a value. The
  // SLIDESHOW_TRIGGERS fan-out below picks up the raised flag and
  // plays the two-witnesses-part-2 slideshow; its flagsSetOnComplete
  // writes act1_complete and the two witness_*_met_part2 flags per
  // ACT1_NARRATIVE_STRUCTURE.md §6.6.
  useEffect(() => {
    if (!state.lightDarkAlignment) return;
    if (state.narrativeFlags?.act1_section_6_ready) return;
    if (state.narrativeFlags?.slideshow_two_witnesses_part_2_complete) return;
    setNarrativeFlag("act1_section_6_ready", true);
  }, [
    state.lightDarkAlignment,
    state.narrativeFlags?.act1_section_6_ready,
    state.narrativeFlags?.slideshow_two_witnesses_part_2_complete,
    setNarrativeFlag,
  ]);

  // ─── WITNESSING §11.2 — TAROT FOUND FEED SLOT ───
  // When gameplay sets `prelude_burnt_card_found` (the §2.6
  // crew mission 3 reward — recovering the burnt Seer's card),
  // record a `tarot_found` memorable moment. The Antiquarian's
  // Lion in Black feed slot 9 consumes this directly.
  useEffect(() => {
    if (!state.narrativeFlags?.prelude_burnt_card_found) return;
    if (state.narrativeFlags?.memorable_tarot_recorded) return;
    setNarrativeFlag("memorable_tarot_recorded", true);
    recordMemorableMoment(
      "tarot_found",
      "The tarot card you didn't know you'd been carrying.",
    );
  }, [
    state.narrativeFlags?.prelude_burnt_card_found,
    state.narrativeFlags?.memorable_tarot_recorded,
    setNarrativeFlag,
  ]);

  // ─── WITNESSING §14.1 — ACT-3/ACT-4 CONDITIONAL MILESTONES ───
  // Three event toasts that fire on specific Act 3 narrative
  // flags. Each is guarded by a dedicated flag that some future
  // gameplay system sets (first Arena 3rd win, first Insurgency
  // infiltration, first Empire Archon offer). The flag names
  // are documented in §14.1. Guarded by their milestone flags
  // via fireMilestone's internal dedupe.
  useEffect(() => {
    if (state.narrativeFlags?.thaloria_cinematic_seen) {
      fireMilestone("thaloria_echo");
    }
    if (state.narrativeFlags?.insurgency_infiltration_complete) {
      fireMilestone("the_engineer_speaks");
    }
    if (state.narrativeFlags?.empire_archon_offer_accepted) {
      fireMilestone("the_archon_recruited");
    }
    if (state.narrativeFlags?.hierarchy_infiltration_complete) {
      fireMilestone("dreamers_shield_cracks");
    }
  }, [
    state.narrativeFlags?.thaloria_cinematic_seen,
    state.narrativeFlags?.insurgency_infiltration_complete,
    state.narrativeFlags?.empire_archon_offer_accepted,
    state.narrativeFlags?.hierarchy_infiltration_complete,
    fireMilestone,
  ]);

  // ─── §9 — ACT 4 PRISONER CHAPTERS FROM STORY MODE ───
  // When the player completes a Collectors Arena story mode
  // chapter that matches one of the four Act 4 Prisoner
  // chapters, raise the corresponding completedFlag. The
  // storyProgress state lives in localStorage, so we read
  // it on every narrativeFlags change — returning to the
  // Ark from a fight is the natural retrigger.
  useEffect(() => {
    let completedChapters: readonly string[] = [];
    try {
      completedChapters = loadStoryProgress().completedChapters ?? [];
    } catch {
      return;
    }
    if (completedChapters.length === 0) return;
    const pendingFlags = act4PrisonerFlagsForCompletedStoryChapters(
      completedChapters,
    );
    for (const flag of pendingFlags) {
      if (!state.narrativeFlags?.[flag]) {
        setNarrativeFlag(flag, true);
      }
    }
  }, [state.narrativeFlags, setNarrativeFlag]);

  // ─── APPENDIX B §B.3 — KAEL FRAGMENT F1-F6 WATCHER ───
  // pendingKaelFragmentUnlocks is pure: given flags + a small
  // runtime context, it returns the set of Fragment ids whose
  // conditions are now satisfied. This effect raises the flag
  // for each one — the ripple handlers registered in Tier 9 of
  // the ripple engine do the rest.
  //
  // The runtime context values (comms idle minutes, panopticon
  // ruins mission count, Celebration Trial day, apprentice
  // bond) come from other gameplay systems that haven't yet
  // wired themselves in. Until they do, these default to 0 and
  // the only fragments that can unlock here are the ones gated
  // purely on flags (F1 after Terminus Wave 10, F4 after
  // Substrate Dungeon, F6 after Act 1 Cycle B / Light reading).
  useEffect(() => {
    const flags = state.narrativeFlags ?? {};
    const ctx: KaelFragmentWatcherContext = {
      // Placeholder values — gameplay systems will override
      // these once they start tracking the metrics.
      commsIdleMinutesWhileHumanActive: 0,
      panopticonRuinsMissionCount: 0,
      celebrationTrialDay: 0,
      highestApprenticeBond: 0,
    };
    const pending = pendingKaelFragmentUnlocks(flags, ctx);
    for (const fragmentId of pending) {
      const frag = KAEL_FRAGMENTS.find((f) => f.id === fragmentId);
      if (!frag) continue;
      setNarrativeFlag(frag.flag, true);
      toast.success(`Kael Fragment ${fragmentId.toUpperCase()}: ${frag.title}`, {
        description: frag.whatPlayerLearns,
        duration: 15000,
      });
    }
  }, [state.narrativeFlags, setNarrativeFlag]);

  // ─── APPENDIX B §B.8 — KAEL PAYOFF CINEMATICS ───
  // Watches the narrative flag set for the three bd1/bd2/bd3
  // trigger conditions. getPendingKaelPayoffCinematic returns
  // the next cinematic that should play; on fire we raise its
  // flag and surface a toast. The toast is the playback
  // surface until the bd1/bd2/bd3 cinematic components ship.
  useEffect(() => {
    // Auto-raise kael_questline_complete once all six F1-F6
    // flags are set. This keeps the bd3 trigger honest even
    // though the per-fragment consumers haven't shipped yet.
    if (
      isKaelQuestlineComplete(state.narrativeFlags ?? {}) &&
      !state.narrativeFlags?.kael_questline_complete
    ) {
      setNarrativeFlag("kael_questline_complete", true);
      return;
    }
    const pending = getPendingKaelPayoffCinematic(state.narrativeFlags ?? {});
    if (!pending) return;
    setNarrativeFlag(pending.flag, true);
    toast.success(`Cinematic: ${pending.title}`, {
      description: pending.purpose,
      duration: 12000,
    });
  }, [
    state.narrativeFlags,
    setNarrativeFlag,
  ]);

  // ─── WITNESSING §3.3 / §14.1 — DISCHORDIA PHASE MILESTONES ───
  // The community Dischordia Cycle phase change is a Living
  // Universe event. When the server pushes the phase into
  // vortex_advance, fire "The Bulb Dims". When it pushes into
  // light_holds (community-visible Light ≥ 1M) or completes a
  // reclamation, fire "A Sector Wakes".
  useEffect(() => {
    if (dischordiaCyclePhase === "vortex_advance") {
      fireMilestone("bulb_dims");
    } else if (
      dischordiaCyclePhase === "light_holds" ||
      dischordiaCyclePhase === "reclamation"
    ) {
      fireMilestone("sector_wakes");
    }
  }, [dischordiaCyclePhase, fireMilestone]);

  // ─── WITNESSING §5 — SLIDESHOW TRIGGER FAN-OUT ───
  // Every §5.5 P0 slideshow has:
  //   - an upstream trigger flag (set by gameplay when the payoff
  //     moment lands),
  //   - a completion flag (set by SlideshowPlayerRoot once the
  //     cinematic finishes — used for cross-session dedupe).
  //
  // One effect processes the table. The in-session Set guards
  // against a re-render firing the same slideshow twice during
  // the React window between queue and completion.
  //
  // Trigger flags are deliberately distinct from the completion
  // flags the slideshow sets itself, to prevent causal loops.
  // Several trigger flags are NOT yet set by any gameplay code —
  // those slideshows are pre-wired for when the Act 2/3 beats
  // ship and can be driven manually via setNarrativeFlag until
  // then.
  useEffect(() => {
    for (const trigger of SLIDESHOW_TRIGGERS) {
      if (!state.narrativeFlags?.[trigger.triggerFlag]) continue;
      if (state.narrativeFlags?.[trigger.completionFlag]) continue;
      if (slideshowFiredRef.current.has(trigger.slideshowId)) continue;
      slideshowFiredRef.current.add(trigger.slideshowId);
      playSlideshow(trigger.slideshowId);
      // One slideshow per effect run. If multiple triggers are hot
      // at the same time (rare) they'll fire in subsequent render
      // passes as the state settles.
      break;
    }
  }, [state.narrativeFlags]);

  // ─── CROSS-GAME NARRATIVE FLAGS ───
  useEffect(() => {
    // Check fight streak
    try {
      const battleStats = JSON.parse(localStorage.getItem("loredex_battle_stats") || '{}');
      const winStreak = battleStats.winStreak ?? 0;
      if (winStreak >= 5 && !state.narrativeFlags?.combat_renowned) {
        const ev = CROSS_GAME_EVENTS["fight_streak_5"];
        setNarrativeFlag(ev.flag, true);
        toast.info(ev.toast.title, { description: ev.toast.desc });
      }
      if (winStreak >= 10 && !state.narrativeFlags?.combat_legendary) {
        const ev = CROSS_GAME_EVENTS["fight_streak_10"];
        setNarrativeFlag(ev.flag, true);
        toast.info(ev.toast.title, { description: ev.toast.desc });
      }
    } catch { /* ignore */ }

    // Check card wins
    const cardWins = parseInt(localStorage.getItem("dischordia_wins") || "0");
    if (cardWins >= 10 && !state.narrativeFlags?.strategist_recognized) {
      const ev = CROSS_GAME_EVENTS["card_wins_10"];
      setNarrativeFlag(ev.flag, true);
      toast.info(ev.toast.title, { description: ev.toast.desc });
    }

    // Witnessing §4.2 — Act 1 cycle progression tied to card-
    // battle wins. The proposal frames Act 1 as 12 battles
    // across three cycles (3 + 5 + 4). We use the accumulated
    // Dischordia win counter as a canonical proxy:
    //
    //   cycle A done → 3 wins   → Welcome to Celebration
    //   cycle B done → 8 wins   → To Be the Human
    //   act 1 done   → 12 wins  → Last Words
    //
    // Each flag is only raised once and only while the player
    // is still in Act 1 (narrativeAct < 2) so later campaign
    // win grinding doesn't re-fire the cycle cinematics.
    const inAct1 = (state.narrativeAct ?? 0) < 2;
    if (inAct1 && cardWins >= 3 && !state.narrativeFlags?.act_1_cycle_a_complete) {
      setNarrativeFlag("act_1_cycle_a_complete", true);
      toast.info("Cycle A — Kindergarten of Gods", {
        description: "The Little Watcher falls. The Engineer's childhood ends.",
      });
    }
    if (inAct1 && cardWins >= 8 && !state.narrativeFlags?.act_1_cycle_b_complete) {
      setNarrativeFlag("act_1_cycle_b_complete", true);
      toast.info("Cycle B — Mechronis Academy", {
        description: "The graduation photo. One student is missing.",
      });
    }
    if (
      inAct1 &&
      cardWins >= 12 &&
      !state.narrativeFlags?.act_1_complete &&
      // P1.3 — Act 1 completion must be atomic across (a) the 12-win
      // milestone, (b) the §5.8.1 Light/Dark alignment choice, and
      // (c) the §5.8 trial verdict landing (`act1_authority_outcome`
      // is raised by DuelystGameUI's trial-resolution path). If any
      // of the three is missing, hold Act 1 open rather than raise
      // `act_1_complete` prematurely — downstream Act 2 surfaces read
      // this flag as a hard gate.
      state.lightDarkAlignment !== null &&
      !!state.narrativeFlags?.act1_authority_outcome
    ) {
      setNarrativeFlag("act_1_complete", true);
      toast.info("Cycle C — The Deck Reforged", {
        description: "New Babylon. A tall figure in a worn engineer's coat.",
      });
    }

    // Engineer Recording 1-7 watcher. `CARD_BATTLE_MILESTONES`
    // defines the 7 hologram triggers (spec §12 / roadmap §Act 1,
    // "Engineer Recording 1 — The Bench Speaks"). Recording #1 fires
    // on the first Dischordia win; #2-#5 on subsequent wins; #6 and
    // #7 gate on `dischordiaStep` / `act_1_complete` which we don't
    // yet track at the watcher level, so those remain latent — same
    // placeholder pattern the Kael fragment watcher uses above.
    const dischordiaStepPlaceholder = 0;
    const allAct1Complete = !!state.narrativeFlags?.act_1_complete;
    const preludeComplete = !!state.narrativeFlags?.prelude_complete;
    for (const milestone of CARD_BATTLE_MILESTONES) {
      if (state.narrativeFlags?.[milestone.discoveryFlag]) continue;
      if (cardWins < milestone.minWins) continue;
      if (
        milestone.dischordiaStep != null &&
        dischordiaStepPlaceholder < milestone.dischordiaStep
      ) continue;
      if (milestone.allAct1Complete && !allAct1Complete) continue;
      // Recording 0 — gated on Prelude completion. Reserved for the
      // Engineer's "If You're Hearing This" transmission that lands
      // at the close of the Prelude before Act 1 opens.
      if (milestone.preludeComplete && !preludeComplete) continue;
      // Room gate: Engineer Recordings are each pinned to a specific room
      // (archives, observation_deck, …). Only fire the discovery once the
      // player has actually entered that room; otherwise the Antiquarian
      // is dropping holograms through walls. roomId is optional on the
      // milestone record — when absent, fall through to the win-count gate.
      const recording = ENGINEER_RECORDINGS.find(
        (r) => r.order === milestone.recordingOrder,
      );
      if (recording?.roomId) {
        // `engineerRecordings.ts` uses underscored room IDs
        // (observation_deck, comms_array, …) while ROOM_DEFINITIONS
        // in GameContext uses hyphenated IDs (observation-deck,
        // comms-array, …). Normalize to the hyphenated form which
        // is what state.rooms is keyed on.
        const roomKey = recording.roomId.replace(/_/g, "-");
        const visited = state.rooms?.[roomKey]?.visited;
        if (!visited) continue;
      }
      setNarrativeFlag(milestone.discoveryFlag, true);
      // The full cinematic reveal (transcript + NPC reactions) is
      // handled by <EngineerRecordingDiscoveryModal /> mounted in
      // AppShellImmersive, which watches the discovery flag. Skip
      // the toast — we don't want two surfaces competing.
    }

    // §6.3 Zephyr-9 Classroom — tier crossings fire the authored teaching
    // line + raise a flag so downstream systems (Dischordia peek, undo,
    // Engineer's Opening unlock) can read a clean "has crossed depth N"
    // condition instead of re-computing from chessDepth everywhere.
    //
    // Two depth sources feed this watcher:
    //   1. `state.chessDepth` — client-side counter bumped by local
    //      wins / scripted grants.
    //   2. `climbRank` — server-authoritative highestClearedRank from
    //      the chess Climb (PR #129). Mapped via climbRankToClassroomDepth.
    // The effective depth is the max of both; whichever source reaches
    // a tier threshold first fires the flag and the teaching line.
    const depth = Math.max(
      state.chessDepth ?? 0,
      climbRankToClassroomDepth(climbRank),
    );
    for (const tier of ZEPHYR_9_CLASSROOM) {
      const flag = `zephyr_classroom_tier_${tier.depth}_crossed`;
      if (depth >= tier.depth && !state.narrativeFlags?.[flag]) {
        setNarrativeFlag(flag, true);
        fireCompanionComment(`zephyr_classroom_tier_${tier.depth}`);
        toast.info("Zephyr-9", {
          description: tier.zephyrLine,
          duration: 10000,
        });
        // Zephyr-9 VO — only tiers 1, 3, 5, 8 have authored lines
        // in `act2-vo-lines.json`; other depths are silent.
        if (
          tier.depth === 1 ||
          tier.depth === 3 ||
          tier.depth === 5 ||
          tier.depth === 8
        ) {
          act2Vo.speak(`zephyr-tier-${tier.depth}`);
        }
      }
    }

    // Chess Climb tier-won companion reactions — Elara and The Human
    // react the first time each Climb rank is cleared. Separate from
    // the Zephyr depth-crossing above because the Climb is a series
    // (best-of-3) event, not a depth threshold; the voice is about
    // beating the Game Master, not about unlocking a Dischordia
    // mechanic. See companionComments.ts `chess_climb_tier_N_won`.
    // Act 2 Chess Climb tier-won VO — alternates Elara / Human per
    // tier as authored in `act2-vo-lines.json` §7.
    const climbTierVoLine: Record<number, string> = {
      0: "climb-tier-0-won-elara",
      1: "climb-tier-1-won-human",
      2: "climb-tier-2-won-elara",
      3: "climb-tier-3-won-human",
    };
    for (let r = 0; r <= climbRank; r += 1) {
      const clearedFlag = climbTierClearedFlag(r);
      const trigger = climbTierCompanionTrigger(r);
      if (!clearedFlag || !trigger) continue;
      if (state.narrativeFlags?.[clearedFlag]) continue;
      setNarrativeFlag(clearedFlag, true);
      fireCompanionComment(trigger);
      const voLineId = climbTierVoLine[r];
      if (voLineId) act2Vo.speak(voLineId);
    }

    // §14.1 Silence of Two Witnesses — companion-comment dispatch.
    // The flag itself is raised by the mutualBond effect at ~L538
    // via fireMilestone("silence_of_two_witnesses"). Here we fire
    // the authored parenthetical reactions + queue the cinematic
    // via the SLIDESHOW_TRIGGERS fan-out. Gated on a dedicated
    // companion-fired flag so the trigger runs exactly once even
    // though the watching effect re-evaluates on every flag tick.
    if (
      state.narrativeFlags?.event_silence_of_two_witnesses &&
      !state.narrativeFlags?.silence_of_two_witnesses_companions_fired
    ) {
      setNarrativeFlag("silence_of_two_witnesses_companions_fired", true);
      fireCompanionComment("silence_of_two_witnesses");
    }

    // Witnessing §6.5 — Thaloria cinematic triggers on the
    // player's third Collector's Arena match win. Gameplay
    // maintains the counter via localStorage; we just watch
    // for the threshold and raise the trigger flag.
    const arenaWins = parseInt(
      localStorage.getItem("collectors_arena_wins") || "0",
    );
    if (
      arenaWins >= 3 &&
      !state.narrativeFlags?.thaloria_cinematic_unlocked &&
      !state.narrativeFlags?.slideshow_the_helmet_in_the_grass_complete
    ) {
      setNarrativeFlag("thaloria_cinematic_unlocked", true);
    }

    // Witnessing §6.6 — Act 2 wrap. Fires act2_complete +
    // trade_empire_unlocked when all four §6.6 completion
    // conditions are met:
    //
    //   - crafted ≥ 3 cards     → `crafting_mastered`
    //   - won ≥ 5 chess matches → `chess_mastered`
    //   - Thaloria cinematic seen
    //   - lost to a Game Master → `game_master_loss`
    //
    // The sub-flags are set here when their underlying
    // conditions cross threshold. `game_master_loss` is
    // set by gameplay directly when the player loses to one
    // of the two Game Masters — no threshold to check.
    const crafted = state.craftedItems?.length ?? 0;
    if (
      crafted >= 3 &&
      !state.narrativeFlags?.crafting_mastered &&
      (state.narrativeAct ?? 0) >= 2
    ) {
      setNarrativeFlag("crafting_mastered", true);
    }
    const chessWins = parseInt(
      localStorage.getItem("chess_wins") || "0",
    );
    if (chessWins >= 5 && !state.narrativeFlags?.chess_mastered) {
      setNarrativeFlag("chess_mastered", true);
    }
    const act2Gate = deriveAct2CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
    });
    if (act2Gate.readyToFire) {
      setNarrativeFlag("act_2_complete", true);
      setNarrativeFlag("trade_empire_unlocked", true);
      // Advance into Act 3 atomically with completion. Without this,
      // narrativeAct stays at 2 forever, `act_3_starting` never fires,
      // and the Thaloria / Eyes slideshow / Act 3 narrative shell
      // stays locked even though the player has finished Act 2.
      // Mirrors the Prelude → Act 1 handoff at L462.
      if ((state.narrativeAct ?? 0) < 3) {
        advanceNarrativeAct(3);
      }
      toast.info("Act 2 — The Forged Hand", {
        description:
          "The Free Ports have opened trade channels with your Ark. An agent wishes to meet.",
      });
    }

    // Witnessing §7 — Act 3 starts when the narrative act state
    // crosses 3. Gameplay sets `narrativeAct = 3` via the
    // existing `advanceNarrativeAct` action when the player
    // finishes Act 2. We translate that into the dedicated
    // trigger flag the SLIDESHOW_TRIGGERS table watches.
    if (
      (state.narrativeAct ?? 0) >= 3 &&
      !state.narrativeFlags?.act_3_starting &&
      !state.narrativeFlags?.slideshow_i_am_the_eyes_that_watch_complete
    ) {
      setNarrativeFlag("act_3_starting", true);
    }

    // Witnessing §7 — Act 3 wrap. Fires act_3_complete + advances
    // narrativeAct into 4 when the three §7 conditions are met:
    //   - slideshow_i_am_the_eyes_that_watch_complete
    //   - act3_kael_logs_unlocked (card ladder Warden defeated)
    //   - ANY of the three infiltration-path ending flags
    // See apps/shared/act3CompletionGate.ts for the pure evaluator.
    const act3Gate = deriveAct3CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
    });
    if (act3Gate.readyToFire) {
      setNarrativeFlag("act_3_complete", true);
      setNarrativeFlag("act_4_started", true);
      if ((state.narrativeAct ?? 0) < 4) {
        advanceNarrativeAct(4);
      }
      toast.info("Act 3 — The Offer", {
        description:
          "The paths converge. What waits in the Prisoner's cell has heard every choice you made.",
      });
    }

    // Witnessing §9 — Act 4 wrap. Fires act_4_complete + advances
    // narrativeAct to 5 when slideshow + an Act-1 path flag + any
    // Prisoner chapter are all true. Also fires act_4_5_started so
    // Dead Man's Circuit becomes available as a SIBLING track to
    // Act 5. See apps/shared/act4CompletionGate.ts.
    const act4Gate = deriveAct4CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
    });
    if (act4Gate.readyToFire) {
      setNarrativeFlag("act_4_complete", true);
      setNarrativeFlag("act_5_started", true);
      setNarrativeFlag("act_4_5_started", true);
      if ((state.narrativeAct ?? 0) < 5) {
        advanceNarrativeAct(5);
      }
      toast.info("Act 4 — The Revelation", {
        description:
          "The Prisoner lays down the fight. The map is open. Kael's logs are yours now.",
      });
    }

    // Witnessing §10 — Act 4.5 wrap. Fires act_4_5_complete when
    // the slideshow is seen and at least one track (Circuit or
    // Casino) is cleared. Does NOT advance narrativeAct — Act 5
    // is the sequential successor, 4.5 is an optional sibling.
    const act4_5Gate = deriveAct4_5CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
    });
    if (act4_5Gate.readyToFire) {
      setNarrativeFlag("act_4_5_complete", true);
      toast.info("Act 4.5 — Dead Man's Circuit", {
        description:
          "You named the wager. You paid the wager. The chain keeps the identity you lost.",
      });
    }

    // Witnessing §11 — Act 5 wrap. Fires act_5_complete + Act 6
    // trigger when slideshow + map revealed + Cades M7 complete
    // AND the player has cleared 5+ army recruitment missions.
    // See apps/shared/act5CompletionGate.ts. The Bridge of Kael
    // post-credits scene is a SEPARATE trigger handled by
    // witnessingIntegrations.shouldPlayBridgeOfKaelPostCredits.
    const act5Gate = deriveAct5CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
      armyRecruitmentMissionsCompleted:
        state.armyRecruitmentMissionsCompleted ?? undefined,
    });
    if (act5Gate.readyToFire) {
      setNarrativeFlag("act_5_complete", true);
      setNarrativeFlag("act_6_started", true);
      if ((state.narrativeAct ?? 0) < 6) {
        advanceNarrativeAct(6);
      }
      toast.info("Act 5 — The Reckoning", {
        description:
          "Veridian VI is a helmet in the grass. The army is yours. The Confession waits.",
      });
    }

    // Witnessing §12 — Act 6 trigger. When the player reaches the
    // recruitment threshold while in Act 5 (or already Act 6-
    // eligible), raise act_6_started so the SLIDESHOW_TRIGGERS
    // opener fires. Guarded on !act_6_started + !act_6_complete.
    const recruitCount = getRecruitmentMissionCount({
      armyRecruitmentMissionsCompleted:
        state.armyRecruitmentMissionsCompleted ?? undefined,
    });
    if (
      hasReachedAct6Threshold(recruitCount) &&
      !state.narrativeFlags?.act_6_started &&
      !state.narrativeFlags?.act_6_complete &&
      (state.narrativeAct ?? 0) >= 5
    ) {
      setNarrativeFlag("act_6_started", true);
    }

    // Witnessing §12 — Act 6 wrap. Fires act_6_complete + act_7_
    // started + advances narrativeAct to 7 when slideshow + both
    // confessions heard + a stance chosen.
    const act6Gate = deriveAct6CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
    });
    if (act6Gate.readyToFire) {
      setNarrativeFlag("act_6_complete", true);
      setNarrativeFlag("act_7_started", true);
      if ((state.narrativeAct ?? 0) < 7) {
        advanceNarrativeAct(7);
      }
      toast.info("Act 6 — The Confession", {
        description:
          "Both of them finally spoke. The Watcher is named. The bond is at sync.",
      });
    }

    // Witnessing §13 — Act 7 trigger. Requires 8+ recruitment
    // missions (tightened from 15 in the BioWare-pacing pass).
    // Guarded on act_6_complete so the player has at least heard
    // the confessions before the Convergence opens.
    if (
      hasReachedAct7Threshold(recruitCount) &&
      !state.narrativeFlags?.act_7_started &&
      !state.narrativeFlags?.act_7_complete &&
      Boolean(state.narrativeFlags?.act_6_complete)
    ) {
      setNarrativeFlag("act_7_started", true);
    }

    // Witnessing §13 — Act 7 wrap. Final completion beat of the
    // spine. Fires act_7_complete when slideshow + arc-closes.
    // Downstream prestige cycle rolls over per the canon
    // carryover rules in witnessingIntegrations.ts.
    const act7Gate = deriveAct7CompletionStatus({
      narrativeAct: state.narrativeAct,
      flags: state.narrativeFlags,
    });
    if (act7Gate.readyToFire) {
      setNarrativeFlag("act_7_complete", true);
      setNarrativeFlag("narrative_spine_complete", true);
      // Authority alignment lands at Act-7 close per Option A in
      // docs/production/AUTHORITY_ALIGNMENT_RATIFICATION.md.
      // Fires the ch20_conexus_BONUS chapter intro for every player
      // who closes the spine. If the writer wants the Conexus to
      // discriminate further (Option B threshold or Option C dialog
      // commitment), this line is the single revert site — replace
      // the setter with whatever signal the writer chooses.
      setNarrativeFlag("authority_alignment_aligned", true);
      toast.info("Act 7 — The Convergence", {
        description:
          "I've been waiting a very long time to say that to someone. The cycle closes.",
      });
    }

    // ─── Secret-reveal flag bridge ────────────────────────────────
    //
    // expansionUnlockService.ts gates 7 cards on
    // `secret_act_N_revealed` (one per act). Each act has a per-act
    // "secret discovered" marker that content authors set when the
    // canonical hidden lore beat is found — entering a hidden room,
    // taking the optional Devotee path, hearing the Source's
    // unredacted line, etc. (Act-specific discovery routes are
    // owned by the narrative team; the writer here is the unified
    // bridge that the unlock service consumes.)
    //
    // Naming convention:
    //   `act_N_secret_discovered`  — set by content (single source per act)
    //   `secret_act_N_revealed`    — set here, read by expansionUnlockService
    //
    // Idempotent: each branch only fires when the discovery marker
    // is true AND the canonical flag isn't yet set, so no duplicate
    // unlock toasts.
    if (
      state.narrativeFlags?.act_1_secret_discovered &&
      !state.narrativeFlags?.secret_act_1_revealed
    ) {
      setNarrativeFlag("secret_act_1_revealed", true);
    }
    if (
      state.narrativeFlags?.act_2_secret_discovered &&
      !state.narrativeFlags?.secret_act_2_revealed
    ) {
      setNarrativeFlag("secret_act_2_revealed", true);
    }
    if (
      state.narrativeFlags?.act_3_secret_discovered &&
      !state.narrativeFlags?.secret_act_3_revealed
    ) {
      setNarrativeFlag("secret_act_3_revealed", true);
    }
    if (
      state.narrativeFlags?.act_4_secret_discovered &&
      !state.narrativeFlags?.secret_act_4_revealed
    ) {
      setNarrativeFlag("secret_act_4_revealed", true);
    }
    if (
      state.narrativeFlags?.act_5_secret_discovered &&
      !state.narrativeFlags?.secret_act_5_revealed
    ) {
      setNarrativeFlag("secret_act_5_revealed", true);
    }
    if (
      state.narrativeFlags?.act_6_secret_discovered &&
      !state.narrativeFlags?.secret_act_6_revealed
    ) {
      setNarrativeFlag("secret_act_6_revealed", true);
    }
    if (
      state.narrativeFlags?.act_7_secret_discovered &&
      !state.narrativeFlags?.secret_act_7_revealed
    ) {
      setNarrativeFlag("secret_act_7_revealed", true);
    }

    // Check terminus
    const terminusWave = parseInt(localStorage.getItem("terminus_highest_wave") || "0");
    if (terminusWave >= 20 && !state.narrativeFlags?.terminus_champion) {
      const ev = CROSS_GAME_EVENTS["terminus_wave_20"];
      setNarrativeFlag(ev.flag, true);
      toast.info(ev.toast.title, { description: ev.toast.desc });
    }
  }, [
    state.narrativeFlags,
    state.narrativeAct,
    state.craftedItems,
    state.chessDepth,
    state.rooms,
    state.armyRecruitmentMissionsCompleted,
    climbRank,
    setNarrativeFlag,
    advanceNarrativeAct,
  ]);
}
