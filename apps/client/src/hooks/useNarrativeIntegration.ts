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
import { toast } from "sonner";
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
];

export function useNarrativeIntegration() {
  const {
    state,
    setNarrativeFlag,
    getNarratorBond,
    advanceNarrativeAct,
  } = useGame();
  const prevMoralityRef = useRef(state.moralityScore);
  const prevTrustRef = useRef<Record<string, number>>({});
  const prevRoomsRef = useRef<Set<string>>(new Set());
  const discoveredRef = useRef<Set<string>>(new Set());
  const slideshowFiredRef = useRef<Set<string>>(new Set());
  const dischordiaCyclePhase = useDischordiaCycleStore((s) => s.state.phase);
  const applyRawDelta = useDischordiaCycleStore((s) => s.applyRawDelta);

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
  }, [
    state.narrativeFlags?.thaloria_cinematic_seen,
    state.narrativeFlags?.insurgency_infiltration_complete,
    state.narrativeFlags?.empire_archon_offer_accepted,
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
    for (const milestone of CARD_BATTLE_MILESTONES) {
      if (state.narrativeFlags?.[milestone.discoveryFlag]) continue;
      if (cardWins < milestone.minWins) continue;
      if (
        milestone.dischordiaStep != null &&
        dischordiaStepPlaceholder < milestone.dischordiaStep
      ) continue;
      if (milestone.allAct1Complete && !allAct1Complete) continue;
      setNarrativeFlag(milestone.discoveryFlag, true);
      const recording = ENGINEER_RECORDINGS.find(
        (r) => r.order === milestone.recordingOrder,
      );
      if (recording) {
        toast.info(`Engineer Recording ${milestone.recordingOrder}: ${recording.title}`, {
          description: recording.transcript.slice(0, 140) + "…",
          duration: 12000,
        });
      }
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
    if (
      (state.narrativeAct ?? 0) >= 2 &&
      !state.narrativeFlags?.act_2_complete &&
      state.narrativeFlags?.crafting_mastered &&
      state.narrativeFlags?.chess_mastered &&
      state.narrativeFlags?.thaloria_cinematic_seen &&
      state.narrativeFlags?.game_master_loss
    ) {
      setNarrativeFlag("act_2_complete", true);
      setNarrativeFlag("trade_empire_unlocked", true);
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
    setNarrativeFlag,
  ]);
}
