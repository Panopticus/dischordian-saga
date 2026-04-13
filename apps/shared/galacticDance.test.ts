import { describe, it, expect } from "vitest";
import { VOLTARI_TRANSMISSIONS, VOLTARI_TRANSMISSION_FLAGS, VOLTARI_WORD_RESPONSE_VOTE } from "./voltariTransmissions";
import { VOLTARI_QUESTLINE } from "./questlineVoltari";
import { HUMANS_QUESTLINE } from "./questlineHumans";
import { THALORIA_QUESTLINE } from "./questlineThaloria";
import { CLONES_QUESTLINE } from "./questlineClones";
import { NEW_BABYLON_QUESTLINE } from "./questlineNewBabylon";
import { INSURGENCY_QUESTLINE } from "./questlineInsurgency";
import { SYNDICATE_QUESTLINE } from "./questlineSyndicate";
import { FACTION_RELATIONSHIPS, FACTION_CONFLICTS, FACTION_PRODUCTIVE_TENSIONS } from "./factionRelationshipMatrix";
import { YEAR_ONE_VOTES } from "./yearOneVotes";
import { GALACTIC_DANCE_CINEMATICS } from "./galacticDanceCinematics";
import { CORRIDOR_NAV_METHODS } from "./contestedCorridors";
import { VOLTARI_FACTION_OPINIONS, WITNESS_POINTS, STORM_RELICS } from "./voltariFactionData";
import { GALACTIC_DANCE_NPCS } from "./galacticDanceFactionNpcs";
import { getAllChapterIds, getAllCompletionFlags } from "./potentialQuestlineTypes";
import type { PotentialQuestline } from "./potentialQuestlineTypes";

const ALL_GD_QUESTLINES: PotentialQuestline[] = [
  VOLTARI_QUESTLINE, HUMANS_QUESTLINE, THALORIA_QUESTLINE,
  CLONES_QUESTLINE, NEW_BABYLON_QUESTLINE, INSURGENCY_QUESTLINE,
  SYNDICATE_QUESTLINE,
];

describe("galactic dance", () => {
  describe("questline completeness", () => {
    it("has 7 Galactic Dance questlines", () => {
      expect(ALL_GD_QUESTLINES).toHaveLength(7);
    });
    it("chapter ids are globally unique", () => {
      const ids = getAllChapterIds(ALL_GD_QUESTLINES);
      expect(new Set(ids).size).toBe(ids.length);
    });
    it("completion flags are globally unique", () => {
      const flags = getAllCompletionFlags(ALL_GD_QUESTLINES);
      expect(new Set(flags).size).toBe(flags.length);
    });
    it("every chapter has a wheel with at least 2 options", () => {
      for (const q of ALL_GD_QUESTLINES) {
        for (const ch of q.chapters) {
          expect(ch.wheel.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
    it("every wheel option has a followup", () => {
      for (const q of ALL_GD_QUESTLINES) {
        for (const ch of q.chapters) {
          for (const opt of ch.wheel) {
            expect(ch.followups[opt.id]).toBeDefined();
          }
        }
      }
    });
  });

  describe("Voltari transmission arc", () => {
    it("has 5 transmissions in order", () => {
      expect(VOLTARI_TRANSMISSIONS).toHaveLength(5);
      for (let i = 0; i < 5; i++) {
        expect(VOLTARI_TRANSMISSIONS[i].layerNumber).toBe(i + 1);
      }
    });
    it("words are AWAKE REMEMBER BEFORE YOU [UNTRANSLATED]", () => {
      expect(VOLTARI_TRANSMISSIONS.map(t => t.word)).toEqual(["AWAKE", "REMEMBER", "BEFORE", "YOU", "[UNTRANSLATED]"]);
    });
    it("response vote has 4 options", () => {
      expect(VOLTARI_WORD_RESPONSE_VOTE.options).toHaveLength(4);
    });
    it("transmission flags track all 5 words + assembly + vote + coordinate", () => {
      expect(VOLTARI_TRANSMISSION_FLAGS.length).toBe(8);
    });
  });

  describe("Voltari faction data", () => {
    it("has opinions for 7 factions", () => {
      expect(Object.keys(VOLTARI_FACTION_OPINIONS)).toHaveLength(7);
    });
    it("Hierarchy opinion is never shared", () => {
      expect(VOLTARI_FACTION_OPINIONS.hierarchy.willSay).toBe(false);
    });
    it("has 5 Witness Points", () => {
      expect(WITNESS_POINTS).toHaveLength(5);
    });
    it("has 3 Storm Relics", () => {
      expect(STORM_RELICS).toHaveLength(3);
    });
  });

  describe("faction NPCs", () => {
    it("has 8 Galactic Dance NPCs", () => {
      expect(Object.keys(GALACTIC_DANCE_NPCS)).toHaveLength(8);
    });
    it("every NPC has a firstContact and signatureMonologue", () => {
      for (const npc of Object.values(GALACTIC_DANCE_NPCS)) {
        expect(npc.firstContact).toBeTruthy();
        expect(npc.signatureMonologue).toBeTruthy();
      }
    });
  });

  describe("faction relationship matrix", () => {
    it("has 10 faction relationships", () => {
      expect(FACTION_RELATIONSHIPS).toHaveLength(10);
    });
    it("has 3 conflicts", () => {
      expect(FACTION_CONFLICTS).toHaveLength(3);
    });
    it("has 3 productive tensions", () => {
      expect(FACTION_PRODUCTIVE_TENSIONS).toHaveLength(3);
    });
  });

  describe("Year One votes", () => {
    it("has 3 votes", () => {
      expect(YEAR_ONE_VOTES).toHaveLength(3);
    });
    it("vote 2 and 3 depend on vote 1", () => {
      expect(YEAR_ONE_VOTES[1].dependsOn).toBe("y1_who_are_potentials");
      expect(YEAR_ONE_VOTES[2].dependsOn).toBe("y1_who_are_potentials");
    });
  });

  describe("contested corridors", () => {
    it("has navigation methods for all 5 classes", () => {
      const classes = CORRIDOR_NAV_METHODS.map(m => m.class).sort();
      expect(classes).toEqual(["assassin", "engineer", "oracle", "soldier", "spy"]);
    });
  });

  describe("cinematics", () => {
    it("has 5 cinematic prompts", () => {
      expect(GALACTIC_DANCE_CINEMATICS).toHaveLength(5);
    });
    it("Voltari cinematic has a song cue", () => {
      const v1 = GALACTIC_DANCE_CINEMATICS.find(c => c.id === "CIN-V1");
      expect(v1?.songCue).toBeTruthy();
    });
  });
});
