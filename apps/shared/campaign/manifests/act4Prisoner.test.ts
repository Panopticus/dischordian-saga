/* ═══════════════════════════════════════════════════════
   ACT_4_PRISONER_MANIFEST — contract tests (Phase A10)

   Pins the metadata shape so cross-system consumers (the
   page renderer, the campaign atlas, the completion-gate
   pipeline, telemetry) all read consistent values.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { ACT_4_PRISONER_MANIFEST } from "./act4Prisoner";
import { manifestHasBattles } from "../actManifest";

describe("ACT_4_PRISONER_MANIFEST", () => {
  it("declares actId '4' (string form — matches ACT_4_MANIFEST)", () => {
    expect(ACT_4_PRISONER_MANIFEST.actId).toBe("4");
  });

  it("uses interlude surface mode (no card battle)", () => {
    expect(ACT_4_PRISONER_MANIFEST.surface.mode).toBe("interlude");
  });

  it("declares the canonical sentinel treeId so cross-system consumers can identify the bespoke surface", () => {
    if (ACT_4_PRISONER_MANIFEST.surface.mode !== "interlude") return;
    expect(ACT_4_PRISONER_MANIFEST.surface.dialogTreeId).toBe(
      "act4_prisoner_chapters",
    );
  });

  it("ties Prisoner completion into the canonical act_4_complete pipeline (so expansionUnlockService picks it up)", () => {
    expect(ACT_4_PRISONER_MANIFEST.completionFlag).toBe("act_4_complete");
  });

  it("has act_4_started as the unlock gate (Prisoner is reachable once Act 4 starts)", () => {
    expect(ACT_4_PRISONER_MANIFEST.unlockFlag).toBe("act_4_started");
  });

  it("manifestHasBattles returns false (interlude — no card battle)", () => {
    expect(manifestHasBattles(ACT_4_PRISONER_MANIFEST)).toBe(false);
  });

  it("title + subtitle are non-empty (used as the page header copy)", () => {
    expect(ACT_4_PRISONER_MANIFEST.title.length).toBeGreaterThan(0);
    expect(ACT_4_PRISONER_MANIFEST.subtitle.length).toBeGreaterThan(0);
  });
});
