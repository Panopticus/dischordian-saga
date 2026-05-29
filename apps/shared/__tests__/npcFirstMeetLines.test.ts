/**
 * Round-trip invariant tests for the per-NPC first-meeting script
 * JSONs at apps/scripts/<npc>-first-meet-lines.json. Closes the
 * round-3 production-bible §3 gap (60 voLineIds across 8 NPCs that
 * had no transcript anywhere).
 *
 * Regenerate via:
 *   node apps/scripts/_generate-npc-first-meet-lines.mjs
 *
 * If the test fails after a dialog-tree edit, re-run the generator
 * and re-commit the affected JSON file(s).
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { ALL_NPC_DIALOG_TREES } from "@shared/npcs/dialogTrees";

const SCRIPTS_DIR = path.resolve(__dirname, "..", "..", "scripts");

const SKIP_NPC_KEYS = new Set([
  "nilmorg",
  "dmc_clone_companion",
  "your_eidolon",
]);

interface FirstMeetLineEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file: string;
  /** Producer-facing cue card that the extractor moved out of `text`
   *  so the ElevenLabs model would stop reading "[CUE 0:00] Voice
   *  direction: warm." aloud. When set, `directionNotes ?? text` is
   *  the canonical authored onscreen string. */
  directionNotes?: string;
  meta?: {
    npcKey?: string;
    treeId?: string;
    nodeId?: string;
    requiresRevealStage?: string | null;
  };
}

function npcKeyToFilename(npcKey: string): string {
  const stem = npcKey.startsWith("the_") ? npcKey.slice(4) : npcKey;
  return `${stem.replace(/_/g, "-")}-first-meet-lines.json`;
}

// Group dialog trees by NPC, mirroring the generator's logic.
const treesByNpc = new Map<string, typeof ALL_NPC_DIALOG_TREES[number][]>();
for (const tree of ALL_NPC_DIALOG_TREES) {
  if (SKIP_NPC_KEYS.has(tree.npcKey)) continue;
  if (!treesByNpc.has(tree.npcKey)) treesByNpc.set(tree.npcKey, []);
  treesByNpc.get(tree.npcKey)!.push(tree);
}

function entriesForNpc(npcKey: string): FirstMeetLineEntry[] {
  const filePath = path.join(SCRIPTS_DIR, npcKeyToFilename(npcKey));
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as FirstMeetLineEntry[];
}

describe("NPC first-meeting transcript JSONs (round-3 gap 1)", () => {
  it("ships a script JSON file for every non-skipped priority-roster NPC with a first-meeting tree", () => {
    for (const [npcKey] of treesByNpc) {
      const filePath = path.join(SCRIPTS_DIR, npcKeyToFilename(npcKey));
      expect(fs.existsSync(filePath), `missing script JSON for ${npcKey}`).toBe(true);
    }
  });

  it("ships exactly 98 transcript entries across 10 NPCs (Section D5 expansion: +Akai/Lycos first-meeting + Wraith post-recruit + loyalty trees for all three; +Game Master second-meeting + mid-trial-intercession trees)", () => {
    let total = 0;
    for (const [npcKey] of treesByNpc) {
      total += entriesForNpc(npcKey).length;
    }
    expect(total).toBe(98);
  });

  it("each NPC's entry count matches its first-meeting tree's voLineId count", () => {
    for (const [npcKey, trees] of treesByNpc) {
      const expectedVoLineIds = new Set<string>();
      for (const tree of trees) {
        for (const node of Object.values(tree.nodes)) {
          if (node.voLineId && node.onscreenText && node.onscreenText.length > 0) {
            expectedVoLineIds.add(node.voLineId);
          }
        }
      }
      const entries = entriesForNpc(npcKey);
      const entryIds = new Set(entries.map((e) => e.id));
      expect(entryIds.size, `entry-id count for ${npcKey}`).toBe(expectedVoLineIds.size);
      // Every entry id must correspond to a real voLineId in the tree.
      for (const id of entryIds) {
        expect(expectedVoLineIds.has(id), `${npcKey}: entry ${id} not in tree voLineIds`).toBe(true);
      }
    }
  });

  it("entry text matches the canonical onscreenText from the dialog-tree node verbatim (round-trip via directionNotes when a cue card was stripped)", () => {
    // The TS → JSON extractor now routes producer-facing cue cards
    // (`[CUE 0:00]`, `[Voice direction: warm.]`, mid-line stage
    // directions) out of `text` and into `directionNotes` so the
    // TTS-bound `text` is clean. The round-trip we check is:
    //   onscreenText === (entry.directionNotes ?? entry.text)
    // When no direction was present `directionNotes` is undefined and
    // `text` already matches `onscreenText` verbatim.
    for (const [npcKey, trees] of treesByNpc) {
      const entries = entriesForNpc(npcKey);
      const entryById = new Map(entries.map((e) => [e.id, e]));
      for (const tree of trees) {
        for (const node of Object.values(tree.nodes)) {
          if (!node.voLineId || !node.onscreenText) continue;
          const entry = entryById.get(node.voLineId);
          if (!entry) continue;
          const roundTrip = entry.directionNotes ?? entry.text;
          expect(roundTrip, `${npcKey} ${node.id} text round-trip`).toBe(node.onscreenText);
        }
      }
    }
  });

  it("entry ids are unique within each per-NPC file", () => {
    for (const [npcKey] of treesByNpc) {
      const entries = entriesForNpc(npcKey);
      const ids = entries.map((e) => e.id);
      expect(new Set(ids).size, `${npcKey} ids unique`).toBe(ids.length);
    }
  });

  it("every entry carries a non-empty text field", () => {
    for (const [npcKey] of treesByNpc) {
      const entries = entriesForNpc(npcKey);
      for (const e of entries) {
        expect(e.text.length, `${npcKey} ${e.id} text non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it("every entry carries the producer-meta sidecar (npcKey + treeId + nodeId)", () => {
    for (const [npcKey] of treesByNpc) {
      const entries = entriesForNpc(npcKey);
      for (const e of entries) {
        expect(e.meta?.npcKey).toBe(npcKey);
        expect(e.meta?.treeId).toBeTruthy();
        expect(e.meta?.nodeId).toBeTruthy();
      }
    }
  });

  it("Vex Solène's reveal-stage gate (eyes_of_reality) is preserved in the meta sidecar", () => {
    const vexEntries = entriesForNpc("vex_solene");
    for (const e of vexEntries) {
      expect(e.meta?.requiresRevealStage).toBe("eyes_of_reality");
    }
  });

  it("Vex Solène ships ≥9 transcript entries (root + 4 baseline branches + Dreamer-aware variant nodes)", () => {
    expect(entriesForNpc("vex_solene").length).toBeGreaterThanOrEqual(9);
  });

  it("The Degen ships ≥9 transcript entries (root + 4 baseline branches + Dreamer-aware variant nodes)", () => {
    expect(entriesForNpc("the_degen").length).toBeGreaterThanOrEqual(9);
  });

  it("each of the 6 mid-roster NPCs ships ≥6 transcript entries (canonical 6-node first-meeting pattern)", () => {
    for (const npcKey of [
      "adjudicator_locke",
      "wraith_calder",
      "the_seer",
      "the_oracle",
      "the_game_master",
      "the_meme",
    ]) {
      expect(entriesForNpc(npcKey).length, `${npcKey} entry count`).toBeGreaterThanOrEqual(6);
    }
  });
});
