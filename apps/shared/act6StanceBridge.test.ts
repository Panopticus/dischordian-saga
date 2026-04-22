/**
 * Act 6 confession-close stance bridge test.
 *
 * The Act 6 completion gate (`apps/shared/act6CompletionGate.ts`) requires
 * at least one `act6_confession_close_*` stance flag AND both confession-
 * heard flags before it fires. Before the bridge, Act6CardLadderPage only
 * raised the generic `act6_confession_close` flag on the Detective win —
 * the four specific stance flags had no writer at all, so the gate silently
 * never fired.
 *
 * This is a structural source-scan test: it enforces that Act6CardLadderPage
 * renders a stance picker that writes each of the four canonical flags and
 * that the picker is reachable from the ladder-complete banner even if the
 * player bounces off the page.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  ACT_6_CONFESSION_STANCE_FLAGS,
} from "./act6CompletionGate";

const pageSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/pages/Act6CardLadderPage.tsx"),
  "utf-8",
);

describe("Act 6 ladder — confession-close stance picker bridge", () => {
  it("references every canonical stance flag", () => {
    for (const flag of ACT_6_CONFESSION_STANCE_FLAGS) {
      expect(pageSrc).toContain(flag);
    }
  });

  it("writes a stance flag via setNarrativeFlag(flag, true) on pick", () => {
    // The picker handler must actually write the chosen flag — otherwise
    // the Act 6 gate's anyStanceTaken check will never become true.
    expect(pageSrc).toMatch(/setNarrativeFlag\(flag,\s*true\)/);
  });

  it("transitions to the stance view after the Detective (second) confession", () => {
    // The Detective-in-the-Wall win is the canonical second confession.
    // After its postmatch the player should be taken to the stance picker.
    expect(pageSrc).toMatch(/act6_the_detective_in_the_wall/);
    expect(pageSrc).toMatch(/setView\("stance"\)/);
  });

  it("renders a fallback stance-picker CTA from the ladder-complete banner", () => {
    // If the player leaves mid-flow and comes back, the completion banner
    // must still offer a path into the stance picker — otherwise the gate
    // is unreachable after the refresh.
    expect(pageSrc).toMatch(/anyStanceTaken/);
  });
});
