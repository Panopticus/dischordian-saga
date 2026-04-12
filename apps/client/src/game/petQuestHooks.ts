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

import { trpc } from "@/lib/trpc";

export type PetQuestHookEvent =
  | { type: "room_enter"; roomId: string; activePetId: string | null }
  | { type: "npc_encounter"; npcId: string; activePetId: string | null }
  | { type: "puzzle_solved"; puzzleId: string; activePetId: string | null }
  | { type: "trust_reached"; npcId: string; trust: number }
  | { type: "choice_made"; choiceId: string; activePetId: string | null };

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
 * Pure helper used by tests: returns the list of (petId, flag)
 * pairs that would be triggered for a given event.
 */
export function matchQuestFlags(event: PetQuestHookEvent): Array<{ petId: string; flag: string }> {
  return QUEST_RULES
    .filter((rule) => rule.match(event))
    .map((rule) => ({ petId: rule.petId, flag: rule.flag }));
}
