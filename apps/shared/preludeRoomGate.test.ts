import { describe, it, expect } from "vitest";
import {
  getNextPreludeRoom,
  getPreludeRoomStep,
  isRoomUnlocked,
  PRELUDE_ROOM_ORDER,
} from "./preludeRoomGate";

const allCleaned = (roomId: string, upToInclusive: number) => {
  const map: Record<string, boolean> = {};
  for (let i = 0; i <= upToInclusive; i++) {
    map[PRELUDE_ROOM_ORDER[i]] = true;
  }
  return map;
};

describe("preludeRoomGate — PRELUDE_ROOM_ORDER structure", () => {
  it("has exactly 10 rooms per §2.2", () => {
    expect(PRELUDE_ROOM_ORDER.length).toBe(10);
  });

  it("starts at cryo-bay and ends at archives", () => {
    expect(PRELUDE_ROOM_ORDER[0]).toBe("cryo-bay");
    expect(PRELUDE_ROOM_ORDER[PRELUDE_ROOM_ORDER.length - 1]).toBe("archives");
  });

  it("has unique room ids (no duplicates)", () => {
    expect(new Set(PRELUDE_ROOM_ORDER).size).toBe(PRELUDE_ROOM_ORDER.length);
  });

  it("includes the Beat 4 narrator swap at position 7 (observation-deck)", () => {
    // §1.4 Beat 4 fires on Observation Deck — proposal says
    // it's the 7th cleaned room.
    expect(PRELUDE_ROOM_ORDER[6]).toBe("observation-deck");
  });

  it("places the burnt tarot at position 10 (archives)", () => {
    // §2.2 explicitly: "10 | Archives | Cargo Bay clean | The
    // Seer's fragment."
    expect(PRELUDE_ROOM_ORDER[9]).toBe("archives");
  });
});

describe("preludeRoomGate.isRoomUnlocked — Prelude phase", () => {
  it("allows cryo-bay as the first room unconditionally", () => {
    expect(
      isRoomUnlocked("cryo-bay", { narrativeAct: 0, roomCleanedMap: {} }),
    ).toBe(true);
  });

  it("blocks bridge until cryo-bay is cleaned", () => {
    expect(
      isRoomUnlocked("bridge", { narrativeAct: 0, roomCleanedMap: {} }),
    ).toBe(false);
    expect(
      isRoomUnlocked("bridge", {
        narrativeAct: 0,
        roomCleanedMap: { "cryo-bay": true },
      }),
    ).toBe(true);
  });

  it("blocks medical-bay until both cryo-bay and bridge are cleaned", () => {
    expect(
      isRoomUnlocked("medical-bay", {
        narrativeAct: 0,
        roomCleanedMap: { "cryo-bay": true },
      }),
    ).toBe(false);
    expect(
      isRoomUnlocked("medical-bay", {
        narrativeAct: 0,
        roomCleanedMap: { "cryo-bay": true, bridge: true },
      }),
    ).toBe(true);
  });

  it("skips sentinel rooms (mess-hall) when computing prereqs", () => {
    // Position 4 is mess-hall, which is a sentinel. So
    // comms-array (position 5) should unlock when positions
    // 0-3 are cleaned, ignoring mess-hall.
    const map = allCleaned("", 2); // cryo-bay, bridge, medical-bay
    expect(isRoomUnlocked("comms-array", { narrativeAct: 0, roomCleanedMap: map })).toBe(true);
  });

  it("blocks archives until every prior canonical room is cleaned", () => {
    // Clean everything except cargo-hold.
    const map: Record<string, boolean> = {};
    for (const room of PRELUDE_ROOM_ORDER) {
      if (room === "archives" || room === "cargo-hold") continue;
      map[room] = true;
    }
    expect(
      isRoomUnlocked("archives", { narrativeAct: 0, roomCleanedMap: map }),
    ).toBe(false);

    // Clean cargo-hold and archives unlocks.
    map["cargo-hold"] = true;
    expect(
      isRoomUnlocked("archives", { narrativeAct: 0, roomCleanedMap: map }),
    ).toBe(true);
  });

  it("allows rooms outside the sequence freely (forge, vault, etc.)", () => {
    expect(
      isRoomUnlocked("forge-workshop", {
        narrativeAct: 0,
        roomCleanedMap: {},
      }),
    ).toBe(true);
    expect(
      isRoomUnlocked("antiquarian-library", {
        narrativeAct: 0,
        roomCleanedMap: {},
      }),
    ).toBe(true);
  });
});

describe("preludeRoomGate.isRoomUnlocked — post-Prelude", () => {
  it("ignores the gate entirely once narrativeAct > 0", () => {
    // Even with zero cleaned rooms, Act 1+ lets everything in.
    for (const room of PRELUDE_ROOM_ORDER) {
      expect(
        isRoomUnlocked(room, { narrativeAct: 1, roomCleanedMap: {} }),
      ).toBe(true);
    }
    for (const room of PRELUDE_ROOM_ORDER) {
      expect(
        isRoomUnlocked(room, { narrativeAct: 5, roomCleanedMap: {} }),
      ).toBe(true);
    }
  });
});

describe("preludeRoomGate.getNextPreludeRoom", () => {
  it("returns cryo-bay at empty state", () => {
    expect(
      getNextPreludeRoom({ narrativeAct: 0, roomCleanedMap: {} }),
    ).toBe("cryo-bay");
  });

  it("returns bridge after cryo-bay is cleaned", () => {
    expect(
      getNextPreludeRoom({
        narrativeAct: 0,
        roomCleanedMap: { "cryo-bay": true },
      }),
    ).toBe("bridge");
  });

  it("skips the mess-hall sentinel", () => {
    const map: Record<string, boolean> = {
      "cryo-bay": true,
      bridge: true,
      "medical-bay": true,
    };
    // Next should be comms-array, not mess-hall.
    expect(
      getNextPreludeRoom({ narrativeAct: 0, roomCleanedMap: map }),
    ).toBe("comms-array");
  });

  it("returns null when every canonical room is cleaned", () => {
    const map: Record<string, boolean> = {};
    for (const room of PRELUDE_ROOM_ORDER) map[room] = true;
    expect(
      getNextPreludeRoom({ narrativeAct: 0, roomCleanedMap: map }),
    ).toBeNull();
  });

  it("returns null outside the Prelude", () => {
    expect(
      getNextPreludeRoom({ narrativeAct: 2, roomCleanedMap: {} }),
    ).toBeNull();
  });
});

describe("preludeRoomGate.getPreludeRoomStep", () => {
  it("returns 1-based positions for sequence rooms", () => {
    expect(getPreludeRoomStep("cryo-bay")).toBe(1);
    expect(getPreludeRoomStep("bridge")).toBe(2);
    expect(getPreludeRoomStep("archives")).toBe(10);
  });

  it("returns null for non-sequence rooms", () => {
    expect(getPreludeRoomStep("forge-workshop")).toBeNull();
    expect(getPreludeRoomStep("not-a-room")).toBeNull();
  });
});
