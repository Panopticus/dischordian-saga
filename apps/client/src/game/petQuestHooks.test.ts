import { describe, it, expect } from "vitest";
import { matchQuestFlags, type PetQuestHookEvent } from "./petQuestHooks";

describe("petQuestHooks", () => {
  describe("Lux flags", () => {
    it("fires lux_obs_visit on Observation Deck entry with Lux active", () => {
      const flags = matchQuestFlags({
        type: "room_enter",
        roomId: "observation_deck",
        activePetId: "lux",
      });
      expect(flags).toContainEqual({ petId: "lux", flag: "lux_obs_visit" });
    });

    it("does NOT fire lux_obs_visit if Lux isn't active", () => {
      const flags = matchQuestFlags({
        type: "room_enter",
        roomId: "observation_deck",
        activePetId: "cipher",
      });
      expect(flags).not.toContainEqual({ petId: "lux", flag: "lux_obs_visit" });
    });

    it("fires star_chart_complete on star_chart puzzle solve with Lux active", () => {
      const flags = matchQuestFlags({
        type: "puzzle_solved",
        puzzleId: "star_chart",
        activePetId: "lux",
      });
      expect(flags).toContainEqual({ petId: "lux", flag: "star_chart_complete" });
    });

    it("fires lux_choice_made on either restore or honor choice", () => {
      expect(matchQuestFlags({ type: "choice_made", choiceId: "lux_restore_sibling", activePetId: "lux" }))
        .toContainEqual({ petId: "lux", flag: "lux_choice_made" });
      expect(matchQuestFlags({ type: "choice_made", choiceId: "lux_honor_memory", activePetId: "lux" }))
        .toContainEqual({ petId: "lux", flag: "lux_choice_made" });
    });
  });

  describe("Cipher flags", () => {
    it("fires signal_3_solved on the signal_decrypt_3 puzzle", () => {
      const flags = matchQuestFlags({
        type: "puzzle_solved",
        puzzleId: "signal_decrypt_3",
        activePetId: "cipher",
      });
      expect(flags).toContainEqual({ petId: "cipher", flag: "signal_3_solved" });
    });

    it("fires signal_3_solved regardless of which pet is active (decryption happens anywhere)", () => {
      const flags = matchQuestFlags({
        type: "puzzle_solved",
        puzzleId: "signal_decrypt_3",
        activePetId: null,
      });
      expect(flags).toContainEqual({ petId: "cipher", flag: "signal_3_solved" });
    });

    it("fires cipher_data_given on archive NPC encounter with Cipher active", () => {
      const flags = matchQuestFlags({
        type: "npc_encounter",
        npcId: "cipher_archives",
        activePetId: "cipher",
      });
      expect(flags).toContainEqual({ petId: "cipher", flag: "cipher_data_given" });
    });
  });

  describe("Echo flags", () => {
    it("fires antiquarian_trust_40 at trust 40+", () => {
      const flags40 = matchQuestFlags({ type: "trust_reached", npcId: "the_antiquarian", trust: 40 });
      const flags50 = matchQuestFlags({ type: "trust_reached", npcId: "the_antiquarian", trust: 50 });
      const flags30 = matchQuestFlags({ type: "trust_reached", npcId: "the_antiquarian", trust: 30 });
      expect(flags40).toContainEqual({ petId: "echo", flag: "antiquarian_trust_40" });
      expect(flags50).toContainEqual({ petId: "echo", flag: "antiquarian_trust_40" });
      expect(flags30).not.toContainEqual({ petId: "echo", flag: "antiquarian_trust_40" });
    });

    it("fires echo_antiquarian_meeting when Echo meets the Antiquarian", () => {
      const flags = matchQuestFlags({
        type: "npc_encounter",
        npcId: "the_antiquarian",
        activePetId: "echo",
      });
      expect(flags).toContainEqual({ petId: "echo", flag: "echo_antiquarian_meeting" });
    });

    it("ignores Antiquarian encounter with a different pet", () => {
      const flags = matchQuestFlags({
        type: "npc_encounter",
        npcId: "the_antiquarian",
        activePetId: "lux",
      });
      expect(flags).not.toContainEqual({ petId: "echo", flag: "echo_antiquarian_meeting" });
    });
  });

  describe("unrelated events", () => {
    it("returns an empty array when nothing matches", () => {
      const ev: PetQuestHookEvent = { type: "room_enter", roomId: "engine_bay", activePetId: "lux" };
      expect(matchQuestFlags(ev)).toEqual([]);
    });
  });
});
