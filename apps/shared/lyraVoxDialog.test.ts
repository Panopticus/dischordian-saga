import { describe, it, expect } from "vitest";
import {
  LYRA_VOX_DIALOG,
  pickLyraVoxLine,
  type LyraVoxLine,
} from "./lyraVoxDialog";
import { ROOM_AFFINITY, type NarratorRoomId } from "./mobileNarrator";

describe("lyraVoxDialog — registry structure", () => {
  it("has a line for every canonical NarratorRoomId", () => {
    for (const roomId of Object.keys(ROOM_AFFINITY) as NarratorRoomId[]) {
      expect(
        LYRA_VOX_DIALOG[roomId],
        `Missing Lyra Vox dialog for ${roomId}`,
      ).toBeDefined();
      expect(LYRA_VOX_DIALOG[roomId].length).toBeGreaterThan(0);
    }
  });

  it("every line has non-empty text", () => {
    for (const lines of Object.values(LYRA_VOX_DIALOG)) {
      for (const line of lines) {
        expect(line.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("Archives has at least one line referencing the Shadow Tongue", () => {
    const hasShadowTongue = LYRA_VOX_DIALOG.archives.some((l) =>
      l.text.toLowerCase().includes("shadow tongue"),
    );
    expect(hasShadowTongue).toBe(true);
  });

  it("Engineering references the Engineer canonically", () => {
    const hasEngineer = LYRA_VOX_DIALOG.engineering.some((l) =>
      l.text.includes("Engineer"),
    );
    expect(hasEngineer).toBe(true);
  });
});

describe("pickLyraVoxLine", () => {
  it("returns the default line when no flags are set", () => {
    const line = pickLyraVoxLine("cryo_bay", undefined);
    expect(line).not.toBeNull();
    expect(line?.text).toContain("substrate");
  });

  it("returns the default when an empty flag object is passed", () => {
    const line = pickLyraVoxLine("cryo_bay", {});
    expect(line).not.toBeNull();
  });

  it("prefers a flag-gated line when its required flag is set", () => {
    const line = pickLyraVoxLine("cryo_bay", { lyra_vox_depth_1: true });
    expect(line?.requiredFlag).toBe("lyra_vox_depth_1");
    expect(line?.text).toContain("scriber");
  });

  it("hides blocked lines when their blockedByFlag is set", () => {
    const flags = { lyra_vox_depth_1: false };
    const line = pickLyraVoxLine("cryo_bay", flags);
    // The depth_1 line should NOT fire; fall back to default.
    expect(line?.requiredFlag).toBeUndefined();
  });

  it("returns null for a room with no dialog set", () => {
    // Cast to satisfy the type checker — the function must
    // handle unknown room ids defensively.
    expect(
      pickLyraVoxLine("not_a_room" as NarratorRoomId, undefined),
    ).toBeNull();
  });

  it("Memorial Corridor surfaces her 'one name per visit' tease after the ask flag", () => {
    const line = pickLyraVoxLine("memorial_corridor", {
      lyra_vox_asked_for_names: true,
    });
    expect(line?.text).toContain("one name per visit");
  });
});
