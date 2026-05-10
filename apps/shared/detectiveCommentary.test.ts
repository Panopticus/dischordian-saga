import { describe, expect, it } from "vitest";
import {
  DETECTIVE_COMMENTARY,
  DETECTIVE_COVERED_ROOMS,
  detectiveLinesForRoom,
  getDetectiveLineForBoard,
  getDetectiveLineForHotspot,
  type RoomId,
} from "./detectiveCommentary";
import { CONSPIRACY_BOARDS } from "./conspiracyBoards/definitions";

const EXPECTED_ROOMS: RoomId[] = [
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
];

describe("detectiveCommentary", () => {
  it("ships at least 30 commentary lines (essential coverage target)", () => {
    expect(DETECTIVE_COMMENTARY.length).toBeGreaterThanOrEqual(30);
  });

  it("every entry has either a roomId+hotspotId pair OR a boardKey", () => {
    for (const line of DETECTIVE_COMMENTARY) {
      const hasRoom = Boolean(line.roomId && line.hotspotId);
      const hasBoard = Boolean(line.boardKey);
      expect(
        hasRoom || hasBoard,
        `${line.id}: must reference a hotspot or a board`,
      ).toBe(true);
    }
  });

  it("every line has a substantive Detective utterance", () => {
    for (const line of DETECTIVE_COMMENTARY) {
      expect(line.text.trim().length).toBeGreaterThan(40);
    }
  });

  it("line ids are unique", () => {
    const ids = DETECTIVE_COMMENTARY.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("DETECTIVE_COVERED_ROOMS includes every expected mystery room", () => {
    for (const room of EXPECTED_ROOMS) {
      expect(DETECTIVE_COVERED_ROOMS, `missing room ${room}`).toContain(room);
    }
  });

  it("every room has at least one Detective line", () => {
    for (const room of EXPECTED_ROOMS) {
      expect(
        detectiveLinesForRoom(room).length,
        `room ${room} has no Detective line`,
      ).toBeGreaterThan(0);
    }
  });

  it("every Conspiracy Board has at least one Detective line", () => {
    for (const board of CONSPIRACY_BOARDS) {
      expect(
        getDetectiveLineForBoard(board.boardKey),
        `board ${board.boardKey} has no Detective line`,
      ).toBeDefined();
    }
  });

  it("getDetectiveLineForHotspot resolves room+hotspot pairs", () => {
    expect(
      getDetectiveLineForHotspot("cryo_bay", "dead-pod")?.text,
    ).toContain("First rule of cryo bay murders");
    expect(
      getDetectiveLineForHotspot("bridge", "captains-chair")?.text,
    ).toContain("Empty chairs");
    expect(
      getDetectiveLineForHotspot("cryo_bay", "nonexistent-hotspot"),
    ).toBeUndefined();
  });

  it("getDetectiveLineForBoard resolves by board key", () => {
    expect(getDetectiveLineForBoard("first_memory")?.text).toContain(
      "Awakening",
    );
    expect(getDetectiveLineForBoard("recruiter_defection")?.text).toContain(
      "Kael",
    );
    expect(getDetectiveLineForBoard("nonexistent")).toBeUndefined();
  });

  it("Elara post-reveal interjections, where present, are substantive", () => {
    for (const line of DETECTIVE_COMMENTARY) {
      if (!line.elaraInterjectionPostReveal) continue;
      expect(line.elaraInterjectionPostReveal.trim().length).toBeGreaterThan(
        30,
      );
    }
  });
});
