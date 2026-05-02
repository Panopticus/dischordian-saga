import { describe, expect, it } from "vitest";
import {
  type Alignment,
  type CharClass,
  type CreationSignature,
  type Element,
  type Species,
  canAccessRoom,
} from "./characterCreationImpact";
import { MYSTERY_DEFINITIONS } from "./episodeMysteries";

/* ═══════════════════════════════════════════════════════
   mysteryAccessibilityParity.test.ts — §6.3b parity probe

   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §6.3b:
   "every (class × race × morality × faction × NPC arc ×
   episode) reaches critical path." This test enumerates
   the 240 character-creation signatures (3 species × 8
   elements × 2 alignments × 5 classes) and asserts that
   every authored Mystery Engine clue lives in a room each
   signature can access via canAccessRoom().

   Why this matters: a clue placed in a species-exclusive
   room would silently lock 2/3 of the player base out of
   the deduction it gates, breaking the load-bearing
   accessibility guarantee declared in §2.45 ("every
   Shadow Tongue hotspot in a universal room"). The same
   guarantee extends to mystery clues — they must remain
   in universal rooms.

   This test runs as a STATIC graph check, not a runtime
   simulation: it never opens a case or records evidence.
   It walks the authored MysteryDefinition tree and
   cross-references each clue.foundIn against canAccessRoom.
   ═══════════════════════════════════════════════════════ */

const SPECIES: ReadonlyArray<Species> = ["demagi", "quarchon", "neyon"];
const ELEMENTS: ReadonlyArray<Element> = [
  "earth", "fire", "water", "air",
  "space", "time", "probability", "reality",
];
const ALIGNMENTS: ReadonlyArray<Alignment> = ["order", "chaos"];
const CLASSES: ReadonlyArray<CharClass> = [
  "engineer", "oracle", "assassin", "soldier", "spy",
];

function* allSignatures(): Iterable<CreationSignature> {
  for (const species of SPECIES) {
    for (const element of ELEMENTS) {
      for (const alignment of ALIGNMENTS) {
        for (const characterClass of CLASSES) {
          yield { species, element, alignment, characterClass };
        }
      }
    }
  }
}

function describeSig(sig: CreationSignature): string {
  return `${sig.species}/${sig.element}/${sig.alignment}/${sig.characterClass}`;
}

describe("Mystery Engine — character-creation signature parity", () => {
  it("enumerates 240 signatures (3 species × 8 elements × 2 alignments × 5 classes)", () => {
    let count = 0;
    for (const _sig of allSignatures()) count++;
    expect(count).toBe(240);
  });

  it("every clue in every authored episode lives in a universally-accessible room", () => {
    // First collect every distinct (room, clueRef) pair authored across
    // all mysteries. We test each room ONCE per signature rather than
    // per-clue — 14 rooms × 240 signatures is far cheaper than
    // ~150 clues × 240 sigs and exercises identical logic.
    const allClueRooms = new Set<string>();
    const clueRoomToCanonicalCitation = new Map<string, string>();
    for (const m of MYSTERY_DEFINITIONS) {
      for (const ep of m.episodes) {
        for (const c of ep.clues) {
          if (!c.foundIn) continue;
          allClueRooms.add(c.foundIn);
          if (!clueRoomToCanonicalCitation.has(c.foundIn)) {
            clueRoomToCanonicalCitation.set(c.foundIn, `${m.id}/${ep.id}/${c.id}`);
          }
        }
      }
    }

    // Sanity: at least one clue room
    expect(allClueRooms.size).toBeGreaterThan(0);

    const failures: string[] = [];
    for (const sig of allSignatures()) {
      for (const room of allClueRooms) {
        if (!canAccessRoom(room, sig)) {
          const cite = clueRoomToCanonicalCitation.get(room);
          failures.push(`${describeSig(sig)} cannot access "${room}" (used by ${cite})`);
        }
      }
    }

    expect(
      failures,
      `Mystery Engine accessibility parity violated:\n  ${failures.slice(0, 10).join("\n  ")}\n  ... (${failures.length} total)`,
    ).toEqual([]);
  });

  it("every deduction's clueA + clueB resolve in the same episode they're authored on", () => {
    // Static graph check: a deduction edge only fires when BOTH its
    // clues have been recorded. If clueA or clueB is foreign to the
    // episode, the edge is structurally unreachable and the test
    // surfaces the drift. This is the deduction-graph half of the
    // §6.3b probe — it doesn't require signatures (the graph is
    // signature-independent), but it shares the test file because
    // both probes guard the same "every signature can complete the
    // arc" invariant.
    const failures: string[] = [];
    for (const m of MYSTERY_DEFINITIONS) {
      for (const ep of m.episodes) {
        const epClueIds = new Set<string>(ep.clues.map((c) => String(c.id)));
        for (const d of ep.deductions) {
          if (!epClueIds.has(String(d.clueA))) {
            failures.push(`${m.id}/${ep.id}/${d.id}: clueA "${d.clueA}" not authored in this episode`);
          }
          if (!epClueIds.has(String(d.clueB))) {
            failures.push(`${m.id}/${ep.id}/${d.id}: clueB "${d.clueB}" not authored in this episode`);
          }
          if (d.clueC && !epClueIds.has(String(d.clueC))) {
            failures.push(`${m.id}/${ep.id}/${d.id}: clueC "${d.clueC}" not authored in this episode`);
          }
        }
      }
    }
    expect(failures, `Deduction-graph drift:\n  ${failures.join("\n  ")}`).toEqual([]);
  });

  it("every arc has a connected E1→E5 progression chain via correct-deduction unlocks", () => {
    // Walks the deduction graph for each arc and asserts there's a
    // chain of `unlocksEpisode` edges from the arc's first episode
    // to its last. A break in this chain would mean some signature
    // could complete an early episode but be unable to advance.
    const failures: string[] = [];
    for (const m of MYSTERY_DEFINITIONS) {
      const sortedEpisodes = [...m.episodes].sort((a, b) => a.ordinal - b.ordinal);
      if (sortedEpisodes.length < 2) continue;  // single-episode arcs ok

      for (let i = 0; i < sortedEpisodes.length - 1; i++) {
        const current = sortedEpisodes[i];
        const next = sortedEpisodes[i + 1];
        const unlocksNext = current.deductions.some(
          (d) => d.unlocksEpisode === next.id,
        );
        if (!unlocksNext) {
          failures.push(
            `${m.id}/${current.id} (ordinal ${current.ordinal}) has no deduction unlocking ${next.id}`,
          );
        }
      }
    }
    expect(failures, `Episode unlock-chain drift:\n  ${failures.join("\n  ")}`).toEqual([]);
  });

  it("no clue lives in a species-exclusive room (load-bearing §2.45 guarantee)", () => {
    const SPECIES_EXCLUSIVE_ROOMS = new Set<string>([
      "the_elemental_forge",
      "blood_archive",
      "probability_chamber",
      "dimensional_observatory",
      "hybrid_sanctum",
      "the_between",
    ]);
    const violations: string[] = [];
    for (const m of MYSTERY_DEFINITIONS) {
      for (const ep of m.episodes) {
        for (const c of ep.clues) {
          if (c.foundIn && SPECIES_EXCLUSIVE_ROOMS.has(c.foundIn)) {
            violations.push(`${m.id}/${ep.id}/${c.id} placed in species-exclusive room "${c.foundIn}"`);
          }
        }
      }
    }
    expect(
      violations,
      `Species-exclusive room violations (mystery clues must live in universal rooms):\n  ${violations.join("\n  ")}`,
    ).toEqual([]);
  });
});
