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
export function useNarrativeIntegration() {
  const { state, setNarrativeFlag } = useGame();
  const prevMoralityRef = useRef(state.moralityScore);
  const prevTrustRef = useRef<Record<string, number>>({});
  const prevRoomsRef = useRef<Set<string>>(new Set());
  const discoveredRef = useRef<Set<string>>(new Set());
  const lastWordsFiredRef = useRef(false);

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

  // ─── WITNESSING §5.4 — ACT 1 PAYOFF SLIDESHOW ───
  // When Act 1 completes, fire "Last Words" — the P0 master
  // slideshow (15 frames, 3m 30s) that pays off the Engineer's
  // execution arc and delivers +500 community Light Energy.
  //
  // Two dedupe layers:
  //   1. `slideshow_last_words_complete` narrative flag — set
  //      by SlideshowPlayerRoot on completion. Prevents replay
  //      across sessions.
  //   2. In-session useRef — prevents the effect from re-firing
  //      during the brief window between queueing the slideshow
  //      and the completion flag being written back to state.
  useEffect(() => {
    if (!state.narrativeFlags?.act_1_complete) return;
    if (state.narrativeFlags?.slideshow_last_words_complete) return;
    if (lastWordsFiredRef.current) return;
    lastWordsFiredRef.current = true;
    playSlideshow("last-words");
  }, [
    state.narrativeFlags?.act_1_complete,
    state.narrativeFlags?.slideshow_last_words_complete,
  ]);

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

    // Check terminus
    const terminusWave = parseInt(localStorage.getItem("terminus_highest_wave") || "0");
    if (terminusWave >= 20 && !state.narrativeFlags?.terminus_champion) {
      const ev = CROSS_GAME_EVENTS["terminus_wave_20"];
      setNarrativeFlag(ev.flag, true);
      toast.info(ev.toast.title, { description: ev.toast.desc });
    }
  }, [state.narrativeFlags, setNarrativeFlag]);
}
