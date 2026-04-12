/* ═══════════════════════════════════════════════════════
   PET QUEST HOOKS

   Central dispatcher for setting pet companion-quest step
   flags from elsewhere in the game. Call-sites (room entry,
   NPC encounter, puzzle completion, battle win) import
   `firePetQuestHook` with a narrative event and the
   matching pet + flag. The hook sends a tRPC mutation to
   `petBattles.setQuestFlag`, invalidates the roster query,
   and returns the resulting flag list.

   Narrative triggers currently wired (all three starter
   pets' early quests from `PET_QUESTS`):

   - Lux:
       "lux_obs_visit"       → visit Observation Deck with Lux active
       "lux_wall_examined"   → examine the focal wall there
       "star_chart_complete" → solve the Star Chart puzzle
       "lux_sibling_found"   → find the second Holographic Fox in Archives
       "lux_choice_made"     → choose restore-vs-memory for the sibling
   - Cipher:
       "signal_3_solved"     → solve 3 Signal Decryption puzzles
       "cipher_data_given"   → hand decrypted data to Cipher in Archives
   - Echo:
       "antiquarian_trust_40"    → reach trust 40 with the Antiquarian
       "echo_antiquarian_meeting"→ bring Echo to meet the Antiquarian
       "echo_time_choice"    → choose unstick-vs-preserve
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export type PetQuestHookEvent =
  | { type: "room_enter"; roomId: string; activePetId: string | null }
  | { type: "npc_encounter"; npcId: string; activePetId: string | null }
  | { type: "puzzle_solved"; puzzleId: string; activePetId: string | null }
  | { type: "trust_reached"; npcId: string; trust: number }
  | { type: "choice_made"; choiceId: string; activePetId: string | null };

/* ─── DISPATCH HELPERS ───
   Any game system can call these to raise a pet-quest event. The
   `usePetQuestEventBridge` hook mounted in AppShell listens, matches
   the event against QUEST_RULES, and fires tRPC mutations for each
   matching flag. */

export function dispatchPetQuestEvent(event: PetQuestHookEvent) {
  window.dispatchEvent(new CustomEvent("pet-quest-event", { detail: event }));
}

/** Shortcut: dispatch when the player enters a room with an active pet. */
export function dispatchRoomEnterWithPet(roomId: string, activePetId: string | null) {
  dispatchPetQuestEvent({ type: "room_enter", roomId, activePetId });
}

/** Shortcut: dispatch when the player encounters an NPC with an active pet. */
export function dispatchNpcEncounterWithPet(npcId: string, activePetId: string | null) {
  dispatchPetQuestEvent({ type: "npc_encounter", npcId, activePetId });
}

/** Shortcut: dispatch when a puzzle is solved. */
export function dispatchPuzzleSolvedWithPet(puzzleId: string, activePetId: string | null) {
  dispatchPetQuestEvent({ type: "puzzle_solved", puzzleId, activePetId });
}

/** Shortcut: dispatch when an NPC's trust crosses a threshold. */
export function dispatchNpcTrustReached(npcId: string, trust: number) {
  dispatchPetQuestEvent({ type: "trust_reached", npcId, trust });
}

/** Shortcut: dispatch when a narrative choice is made. */
export function dispatchChoiceMade(choiceId: string, activePetId: string | null) {
  dispatchPetQuestEvent({ type: "choice_made", choiceId, activePetId });
}

interface QuestRule {
  /** Which pet this flag belongs to. */
  petId: string;
  /** The flag to set on completedQuestSteps. */
  flag: string;
  /** Predicate evaluated against the event. */
  match: (ev: PetQuestHookEvent) => boolean;
}

const QUEST_RULES: QuestRule[] = [
  /* ─── LUX ─── */
  {
    petId: "lux", flag: "lux_obs_visit",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "observation_deck" &&
      ev.activePetId === "lux",
  },
  {
    petId: "lux", flag: "lux_wall_examined",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "observation_focal_wall" &&
      ev.activePetId === "lux",
  },
  {
    petId: "lux", flag: "star_chart_complete",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "star_chart" &&
      ev.activePetId === "lux",
  },
  {
    petId: "lux", flag: "lux_sibling_found",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "archives" &&
      ev.activePetId === "lux",
  },
  {
    petId: "lux", flag: "lux_choice_made",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "lux_restore_sibling" || ev.choiceId === "lux_honor_memory"),
  },

  /* ─── CIPHER ─── */
  {
    petId: "cipher", flag: "signal_3_solved",
    match: (ev) => ev.type === "puzzle_solved" && ev.puzzleId === "signal_decrypt_3",
  },
  {
    petId: "cipher", flag: "cipher_data_given",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "cipher_archives" &&
      ev.activePetId === "cipher",
  },

  /* ─── ECHO ─── */
  {
    petId: "echo", flag: "antiquarian_trust_40",
    match: (ev) =>
      ev.type === "trust_reached" &&
      ev.npcId === "the_antiquarian" &&
      ev.trust >= 40,
  },
  {
    petId: "echo", flag: "echo_antiquarian_meeting",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "the_antiquarian" &&
      ev.activePetId === "echo",
  },
  {
    petId: "echo", flag: "echo_time_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "echo_unstick_time" || ev.choiceId === "echo_preserve_gift"),
  },

  /* ─── SPORE ─── */
  {
    petId: "spore", flag: "spore_medical_visit",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "medical_bay" &&
      ev.activePetId === "spore",
  },
  {
    petId: "spore", flag: "spore_sample_scanned",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "spore_tendril_scan" &&
      ev.activePetId === "spore",
  },
  {
    petId: "spore", flag: "strain_crew_found",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "strain_crew_member",
  },
  {
    petId: "spore", flag: "spore_strain_meeting",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "strain_crew_member" &&
      ev.activePetId === "spore",
  },
  {
    petId: "spore", flag: "spore_strain_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "spore_merge_strain" || ev.choiceId === "spore_separate_strain"),
  },
  {
    petId: "spore", flag: "terminal_crew_found",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "terminal_crew_member",
  },
  {
    petId: "spore", flag: "spore_sacrifice_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "spore_sacrifice_cure" || ev.choiceId === "spore_preserve_whole"),
  },

  /* ─── GILT ─── */
  {
    petId: "gilt", flag: "gilt_cargo_visit",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "cargo_bay" &&
      ev.activePetId === "gilt",
  },
  {
    petId: "gilt", flag: "gilt_hoard_dug",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "gilt_cargo_hoard" &&
      ev.activePetId === "gilt",
  },
  {
    petId: "gilt", flag: "gilt_appraisal_3",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "gilt_appraisal_3_complete" &&
      ev.activePetId === "gilt",
  },
  {
    petId: "gilt", flag: "gilt_artifact_valued",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "collector_artifact_appraisal" &&
      ev.activePetId === "gilt",
  },
  {
    petId: "gilt", flag: "collector_gallery_reached",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "collectors_gallery",
  },
  {
    petId: "gilt", flag: "gilt_collector_presented",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "the_collector" &&
      ev.activePetId === "gilt",
  },
  {
    petId: "gilt", flag: "gilt_collector_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "gilt_leave_with_collector" || ev.choiceId === "gilt_flee_collector"),
  },

  /* ─── GLYPH ─── */
  {
    petId: "glyph", flag: "glyph_archives_visit",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "archives" &&
      ev.activePetId === "glyph",
  },
  {
    petId: "glyph", flag: "glyph_wings_photographed",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "glyph_wing_photography" &&
      ev.activePetId === "glyph",
  },
  {
    petId: "glyph", flag: "glyph_first_word_decoded",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "glyph_first_word_decode" &&
      ev.activePetId === "glyph",
  },
  {
    petId: "glyph", flag: "glyph_prophecy_witnessed",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "glyph_prophecy_vision" &&
      ev.activePetId === "glyph",
  },
  {
    petId: "glyph", flag: "glyph_target_identified",
    match: (ev) =>
      ev.type === "choice_made" &&
      ev.choiceId === "glyph_target_identify",
  },
  {
    petId: "glyph", flag: "glyph_prophecy_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "glyph_prevent_death" || ev.choiceId === "glyph_accept_fate"),
  },
  {
    petId: "glyph", flag: "glyph_meditation_complete",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "glyph_night_meditation" &&
      ev.activePetId === "glyph",
  },
  {
    petId: "glyph", flag: "glyph_true_name_written",
    match: (ev) =>
      ev.type === "choice_made" &&
      ev.choiceId === "glyph_write_true_name",
  },

  /* ─── FLICKER ─── */
  {
    petId: "flicker", flag: "flicker_caught_pranking",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "flicker_prank_catch" &&
      ev.activePetId === "flicker",
  },
  {
    petId: "flicker", flag: "flicker_prank_resolved",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "flicker_return_stolen" || ev.choiceId === "flicker_keep_stolen"),
  },
  {
    petId: "flicker", flag: "insurgency_bar_found",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "insurgency_bar",
  },
  {
    petId: "flicker", flag: "flicker_cell_introduced",
    match: (ev) =>
      ev.type === "npc_encounter" &&
      ev.npcId === "insurgency_contact" &&
      ev.activePetId === "flicker",
  },
  {
    petId: "flicker", flag: "flicker_insurgency_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "flicker_side_insurgency" || ev.choiceId === "flicker_report_hierarchy"),
  },
  {
    petId: "flicker", flag: "flicker_c7_visited",
    match: (ev) =>
      ev.type === "room_enter" &&
      ev.roomId === "corridor_c7" &&
      ev.activePetId === "flicker",
  },
  {
    petId: "flicker", flag: "flicker_origin_found",
    match: (ev) =>
      ev.type === "puzzle_solved" &&
      ev.puzzleId === "flicker_origin_marker" &&
      ev.activePetId === "flicker",
  },
  {
    petId: "flicker", flag: "flicker_fire_choice",
    match: (ev) =>
      ev.type === "choice_made" &&
      (ev.choiceId === "flicker_extinguish" || ev.choiceId === "flicker_feed_fire"),
  },
];

/**
 * Hook that returns a `fire(event)` function wired to the tRPC
 * client. Components near gameplay hook points call this once at
 * mount and invoke `fire(...)` whenever a narrative milestone
 * occurs.
 */
export function usePetQuestHook() {
  const utils = trpc.useUtils();
  const mutation = trpc.petBattles.setQuestFlag.useMutation({
    onSuccess: () => {
      utils.petBattles.getMyPets.invalidate();
    },
  });

  const fire = (event: PetQuestHookEvent) => {
    for (const rule of QUEST_RULES) {
      if (rule.match(event)) {
        mutation.mutate({ petId: rule.petId, flag: rule.flag });
      }
    }
  };

  return { fire };
}

/**
 * Mount once in the app shell. Listens for `pet-quest-event` window
 * events and also piggybacks on the existing `room-enter` event so
 * gameplay code that dispatches rooms already participates without
 * needing to know the pet-quest subsystem exists.
 *
 * The hook reads the currently-active pet from the pets roster and
 * bakes that into `room-enter` events, so the per-pet quest rules
 * (which gate on `activePetId`) can match correctly.
 */
export function usePetQuestEventBridge() {
  const { fire } = usePetQuestHook();
  // Read the first active pet from the roster — rules only care about
  // WHICH pet is out, and the client-side "active pet selection" is
  // already reflected in `isActive` server-side.
  const myPetsQuery = trpc.petBattles.getMyPets.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });
  const activePetId = myPetsQuery.data?.find((p) => p.isActive)?.petId ?? null;

  useEffect(() => {
    const onPetQuestEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as PetQuestHookEvent | undefined;
      if (detail) fire(detail);
    };

    // Piggyback on the existing room-enter signal — auto-inject the
    // currently active pet so existing dispatch sites don't need to
    // know about pets.
    const onRoomEnter = (e: Event) => {
      const roomId = (e as CustomEvent).detail?.roomId;
      if (typeof roomId === "string") {
        // Room IDs in the game use kebab-case; the pet quest rules use
        // snake_case. Convert once at the boundary.
        const normalizedRoomId = roomId.replace(/-/g, "_");
        fire({ type: "room_enter", roomId: normalizedRoomId, activePetId });
      }
    };

    window.addEventListener("pet-quest-event", onPetQuestEvent);
    window.addEventListener("room-enter", onRoomEnter);
    return () => {
      window.removeEventListener("pet-quest-event", onPetQuestEvent);
      window.removeEventListener("room-enter", onRoomEnter);
    };
    // `fire` is stable (recreated each render) — we intentionally
    // re-bind listeners when activePetId changes so subsequent
    // room entries use the latest active pet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePetId]);
}

/**
 * Pure helper used by tests: returns the list of (petId, flag)
 * pairs that would be triggered for a given event.
 */
export function matchQuestFlags(event: PetQuestHookEvent): Array<{ petId: string; flag: string }> {
  return QUEST_RULES
    .filter((rule) => rule.match(event))
    .map((rule) => ({ petId: rule.petId, flag: rule.flag }));
}
