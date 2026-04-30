import { describe, expect, it } from "vitest";

import {
  OUTBREAK_ROOM_ORDER,
  POST_OUTBREAK_ROOMS,
} from "./awakeningProtocol";
import {
  canAccessRoom,
  type CharClass,
  type CreationSignature,
  type Element,
  type Species,
  SPECIES_GATED_CONTENT,
  type Alignment,
} from "./characterCreationImpact";
import { PRELUDE_ROOM_ORDER } from "./preludeRoomGate";
import { ROOM_MEDIA_PROMPTS } from "./roomMediaPrompts";

/**
 * §6.3b Accessibility / parity probe.
 *
 * Load-bearing test that enforces the user's "make sure all gameplay
 * is accessible" requirement: every one of the 120 character-creation
 * signatures (3 species × 8 elements × 2 alignments × 5 classes) must
 * be able to reach every critical-path room. Bonus species-exclusive
 * rooms are allowed to be locked, but they must NEVER appear on the
 * critical path.
 *
 * Run this BEFORE adding any new room module. If a future PR places
 * a story flag, ST uncorruption pair, or progression item inside a
 * species-gated room, this test will fail loudly.
 */

const ALL_SPECIES: readonly Species[] = ["demagi", "quarchon", "neyon"];
const ALL_ELEMENTS: readonly Element[] = [
  "earth",
  "fire",
  "water",
  "air",
  "space",
  "time",
  "probability",
  "reality",
];
const ALL_ALIGNMENTS: readonly Alignment[] = ["order", "chaos"];
const ALL_CLASSES: readonly CharClass[] = [
  "engineer",
  "oracle",
  "assassin",
  "soldier",
  "spy",
];

/** Build all 3×8×2×5 = 120 creation signatures. */
function allSignatures(): readonly CreationSignature[] {
  const out: CreationSignature[] = [];
  for (const species of ALL_SPECIES) {
    for (const element of ALL_ELEMENTS) {
      for (const alignment of ALL_ALIGNMENTS) {
        for (const characterClass of ALL_CLASSES) {
          out.push({ species, element, alignment, characterClass });
        }
      }
    }
  }
  return out;
}

/** Every species-gated room id, regardless of species. */
function speciesGatedRoomIds(): Set<string> {
  const out = new Set<string>();
  for (const s of ALL_SPECIES) {
    for (const r of SPECIES_GATED_CONTENT[s].exclusiveRooms) {
      out.add(r.id);
    }
  }
  return out;
}

/**
 * Universal critical-path rooms — every signature must reach all of these.
 *
 * The two unlock-order constants use snake_case room ids (engine convention
 * for those modules); the Prelude gate uses kebab-case. Both forms are
 * normalised to one canonical kebab-case set here for the parity check.
 */
function normaliseRoomId(id: string): string {
  return id.replaceAll("_", "-");
}

const CRITICAL_PATH_ROOMS: readonly string[] = Array.from(
  new Set([
    ...PRELUDE_ROOM_ORDER, // already kebab
    ...OUTBREAK_ROOM_ORDER.map(normaliseRoomId),
    ...POST_OUTBREAK_ROOMS.map(normaliseRoomId),
  ]),
);

describe("Room accessibility parity (§6.3b)", () => {
  const signatures = allSignatures();
  const speciesGated = speciesGatedRoomIds();

  it("the full cross-product covers every creation signature", () => {
    // characterCreationImpact.ts header says "3×4×2×5 = 120" but the
    // actual Element union is 8 elements, so 3×8×2×5 = 240. The
    // header comment is stale; this assertion locks the runtime
    // count at the actual cross-product.
    expect(signatures.length).toBe(240);
    expect(signatures.length).toBe(
      ALL_SPECIES.length *
        ALL_ELEMENTS.length *
        ALL_ALIGNMENTS.length *
        ALL_CLASSES.length,
    );
  });

  it("every critical-path room is a real string id (sanity)", () => {
    for (const r of CRITICAL_PATH_ROOMS) {
      expect(r.length).toBeGreaterThan(0);
      expect(r).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("no critical-path room is a species-gated room", () => {
    // The single most important assertion in this file. If this
    // fails, a writer has placed progression-required content
    // inside a room only ⅓ of players can enter.
    for (const room of CRITICAL_PATH_ROOMS) {
      expect(
        speciesGated.has(room),
        `critical-path room "${room}" is species-gated — locks ⅔ of players out of progression`,
      ).toBe(false);
    }
  });

  it("every signature can access every critical-path room", () => {
    // The brute-force check. 120 signatures × ~25 rooms = 3,000
    // canAccessRoom calls — fast and decisive.
    for (const sig of signatures) {
      for (const room of CRITICAL_PATH_ROOMS) {
        expect(
          canAccessRoom(room, sig),
          `signature ${JSON.stringify(sig)} cannot access critical-path room "${room}"`,
        ).toBe(true);
      }
    }
  });

  it("species-exclusive rooms are gated to exactly the matching species", () => {
    for (const sig of signatures) {
      for (const ownerSpecies of ALL_SPECIES) {
        const ownerRooms = SPECIES_GATED_CONTENT[ownerSpecies].exclusiveRooms;
        for (const r of ownerRooms) {
          const expected = sig.species === ownerSpecies;
          expect(
            canAccessRoom(r.id, sig),
            `${sig.species} ${expected ? "should" : "should NOT"} access ${ownerSpecies} room ${r.id}`,
          ).toBe(expected);
        }
      }
    }
  });

  it("each species has exactly 2 exclusive bonus rooms", () => {
    for (const s of ALL_SPECIES) {
      expect(SPECIES_GATED_CONTENT[s].exclusiveRooms.length).toBe(2);
    }
  });

  it("species exclusive rooms are disjoint across species", () => {
    const seen = new Map<string, Species>();
    for (const s of ALL_SPECIES) {
      for (const r of SPECIES_GATED_CONTENT[s].exclusiveRooms) {
        expect(
          seen.has(r.id),
          `room ${r.id} claimed by both ${seen.get(r.id)} and ${s}`,
        ).toBe(false);
        seen.set(r.id, s);
      }
    }
  });
});

describe("ROOM_MEDIA_PROMPTS species-room sanity", () => {
  const speciesRooms = speciesGatedRoomIds();

  it("every species-gated room in ROOM_MEDIA_PROMPTS is a real species room", () => {
    const speciesEntries = ROOM_MEDIA_PROMPTS.filter((p) =>
      speciesRooms.has(p.roomId),
    );
    // We expect 6 entries (one per species room) — see plan §4.1.
    expect(speciesEntries.length).toBeGreaterThanOrEqual(6);
    for (const entry of speciesEntries) {
      expect(speciesRooms.has(entry.roomId)).toBe(true);
    }
  });

  it("no Shadow Tongue or critical-path video lands on a species-gated room", () => {
    // ST videos and ambient loops MUST live on universal rooms so every
    // player sees the corruption arc. (The only species-gated entries
    // are P2 stills.)
    const stEntries = ROOM_MEDIA_PROMPTS.filter((p) =>
      p.dependencies.includes("shadow_tongue_corruption_layer"),
    );
    for (const e of stEntries) {
      expect(
        speciesRooms.has(e.roomId),
        `Shadow Tongue media ${e.assetId} lives on species-gated room ${e.roomId} — locks ⅔ of players out of ST arc`,
      ).toBe(false);
    }
  });

  it("every species-room prompt is P2 (bonus content, not critical path)", () => {
    for (const e of ROOM_MEDIA_PROMPTS) {
      if (speciesRooms.has(e.roomId)) {
        expect(e.priority, `species-gated room ${e.roomId} prompt must be P2`).toBe(
          "P2",
        );
      }
    }
  });
});
