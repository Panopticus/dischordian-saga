import { describe, expect, it } from "vitest";
import {
  HUMAN_WHISPERS,
  WHISPER_ERAS_REQUIRED,
  pendingWhisper,
  whisperEraDistribution,
  whispersStillActive,
} from "./humanWhispers";
import type { HumanWhisper } from "./humanWhispers";
import type { RoomId } from "./detectiveCommentary";

const NO_HOTSPOTS = new Set<string>();
const NO_WHISPERS = new Set<string>();
const NO_FLAGS = new Set<string>();

describe("HUMAN_WHISPERS — schema invariants", () => {
  it("every whisper has a non-empty id and text", () => {
    for (const w of HUMAN_WHISPERS) {
      expect(w.id, JSON.stringify(w)).toBeTruthy();
      expect(w.text, w.id).toBeTruthy();
      expect(w.voId, w.id).toBeTruthy();
    }
  });

  it("whisper ids are unique", () => {
    const ids = HUMAN_WHISPERS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("voId values are unique", () => {
    const voIds = HUMAN_WHISPERS.map((w) => w.voId);
    expect(new Set(voIds).size).toBe(voIds.length);
  });
});

describe("HUMAN_WHISPERS — voice register (no first-person)", () => {
  // The whisper register is "the Human is not himself yet — he is
  // leaking through." First-person verbs and pronouns belong to
  // the Detective era; whispers must NOT contain standalone "i"
  // or "I" as a word. Contractions like "i'm" / "i'll" are also
  // forbidden — they read as full-self speech.
  const FORBIDDEN = /\b[Ii]'?(?:m|ll|ve|d)?\b/;

  it("no whisper contains a standalone first-person pronoun", () => {
    const offenders = HUMAN_WHISPERS.filter((w) => FORBIDDEN.test(w.text));
    expect(
      offenders.map((w) => `${w.id}: ${w.text}`),
      "whisper voice register drift — first-person pronouns belong to the Detective era",
    ).toEqual([]);
  });

  it("whispers use fragment grammar (ellipses on at least one side)", () => {
    for (const w of HUMAN_WHISPERS) {
      const hasEllipsis = w.text.includes("…") || w.text.includes("...");
      expect(hasEllipsis, `${w.id} missing fragment grammar: ${w.text}`).toBe(
        true,
      );
    }
  });
});

describe("HUMAN_WHISPERS — four-era distribution", () => {
  it("every required era has at least one whisper", () => {
    const dist = whisperEraDistribution();
    for (const era of WHISPER_ERAS_REQUIRED) {
      expect(dist[era], `era ${era} has no whispers`).toBeGreaterThan(0);
    }
  });

  it("total whisper count is within the planned range", () => {
    // Plan calls for ~16; allow a window of 12–24 so authoring
    // tweaks don't break the test, but a wholesale collapse does.
    expect(HUMAN_WHISPERS.length).toBeGreaterThanOrEqual(12);
    expect(HUMAN_WHISPERS.length).toBeLessThanOrEqual(24);
  });
});

describe("whispersStillActive", () => {
  it("returns true pre-Beat-H Detective video", () => {
    expect(whispersStillActive(false)).toBe(true);
  });

  it("returns false once Detective video has been seen", () => {
    expect(whispersStillActive(true)).toBe(false);
  });
});

describe("pendingWhisper", () => {
  // Pick a known room-anchored whisper to drive the gate tests.
  const cargoWhisper = HUMAN_WHISPERS.find(
    (w) => w.roomId === "cargo_hold",
  ) as HumanWhisper;

  it("returns null once Detective video has been seen", () => {
    const w = pendingWhisper(
      "cargo_hold" as RoomId,
      NO_HOTSPOTS,
      NO_WHISPERS,
      NO_FLAGS,
      true,
    );
    expect(w).toBeNull();
  });

  it("returns null for a room with no whispers and no any_room fallback eligible", () => {
    // Build a scenario where the player has seen every any_room
    // whisper too — only room-specific whispers remain. cipher_den
    // has a whisper; pick a room that doesn't and that has no
    // any_room fallback after we mark all any_room whispers seen.
    const allAnyRoomSeen = new Set(
      HUMAN_WHISPERS.filter((w) => w.roomId === "any_room").map((w) => w.id),
    );
    // Pick a room with no whispers authored — choose one absent
    // from HUMAN_WHISPERS roomIds.
    const seenRooms = new Set(HUMAN_WHISPERS.map((w) => w.roomId));
    const allRooms: RoomId[] = [
      "cryo_bay",
      "bridge",
      "medical_bay",
      "archives",
      "comms_array",
      "engineering",
      "forge",
      "armory",
      "captains_quarters",
      "antiquarians_library",
      "cargo_hold",
      "chaos_forge",
      "cipher_den",
      "dreams_workshop",
      "elemental_nexus",
      "engineering_core",
      "forge_workshop",
      "guild_sanctum",
      "observation_deck",
      "oracle_sanctum",
      "order_tribunal",
      "quantum_lab",
      "shadow_vault",
      "social_hub",
      "station_dock",
      "synthesis_chamber",
      "war_room",
    ];
    const emptyRoom = allRooms.find(
      (r) => !seenRooms.has(r) && !seenRooms.has("any_room" as never),
    );
    if (!emptyRoom) return; // every room has a whisper — no test case
    const w = pendingWhisper(
      emptyRoom,
      NO_HOTSPOTS,
      allAnyRoomSeen,
      NO_FLAGS,
      false,
    );
    expect(w).toBeNull();
  });

  it("returns a room-matched whisper when pre-Beat-H and unseen", () => {
    const w = pendingWhisper(
      "cargo_hold" as RoomId,
      NO_HOTSPOTS,
      NO_WHISPERS,
      NO_FLAGS,
      false,
    );
    expect(w?.roomId === "cargo_hold" || w?.roomId === "any_room").toBe(true);
  });

  it("skips a whisper already in the seen set", () => {
    const seen = new Set([cargoWhisper.id]);
    const w = pendingWhisper(
      "cargo_hold" as RoomId,
      NO_HOTSPOTS,
      seen,
      NO_FLAGS,
      false,
    );
    expect(w?.id).not.toBe(cargoWhisper.id);
  });

  it("skips a hotspot-gated whisper until the hotspot is examined", () => {
    // Find a hotspot-gated whisper to exercise the gate.
    const gated = HUMAN_WHISPERS.find((w) => w.hotspotId);
    if (!gated) return;
    // Mark every non-gated whisper for the same room as seen so the
    // gated whisper is the only candidate left.
    const seen = new Set(
      HUMAN_WHISPERS.filter(
        (w) =>
          (w.roomId === gated.roomId || w.roomId === "any_room") &&
          w.id !== gated.id,
      ).map((w) => w.id),
    );
    const unmet = pendingWhisper(
      gated.roomId as RoomId,
      NO_HOTSPOTS,
      seen,
      NO_FLAGS,
      false,
    );
    expect(unmet).toBeNull();

    const met = pendingWhisper(
      gated.roomId as RoomId,
      new Set([gated.hotspotId!]),
      seen,
      NO_FLAGS,
      false,
    );
    expect(met?.id).toBe(gated.id);
  });

  it("skips a flag-gated whisper until the flag is set", () => {
    const gated = HUMAN_WHISPERS.find((w) => w.requiresFlag);
    if (!gated) return;
    // Park every other any_room / matching-room whisper as seen.
    const seen = new Set(
      HUMAN_WHISPERS.filter(
        (w) =>
          (w.roomId === gated.roomId || w.roomId === "any_room") &&
          w.id !== gated.id,
      ).map((w) => w.id),
    );
    const targetRoom: RoomId =
      gated.roomId === "any_room" ? ("cryo_bay" as RoomId) : (gated.roomId as RoomId);
    const unmet = pendingWhisper(
      targetRoom,
      NO_HOTSPOTS,
      seen,
      NO_FLAGS,
      false,
    );
    expect(unmet).toBeNull();
    const met = pendingWhisper(
      targetRoom,
      NO_HOTSPOTS,
      seen,
      new Set([gated.requiresFlag!]),
      false,
    );
    expect(met?.id).toBe(gated.id);
  });
});
