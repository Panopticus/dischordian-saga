/**
 * Structural tests for SingleVideoCutsceneOverlay.
 *
 * The component is a thin renderer over <video> + a reduced-motion
 * fallback. Rather than spinning up jsdom + a mock video element
 * for a behavioural test, we source-scan the component to verify
 * the frameLine prop is plumbed through both render branches and
 * the lifecycle timer is set up correctly.
 *
 * The frameLine surface is what carries the Detective video's
 * lead-in line ("It all started back when I used to solve problems
 * for the Authority.") — the assertion that
 * apps/shared/humanLifeVideoSequence.ts ships the canonical text
 * lives in humanLifeVideoSequence.test.ts.
 */
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";
import { SingleVideoCutsceneOverlay } from "./SingleVideoCutsceneOverlay";

describe("SingleVideoCutsceneOverlay", () => {
  it("exports the component as a named export", () => {
    expect(SingleVideoCutsceneOverlay).toBeDefined();
    expect(typeof SingleVideoCutsceneOverlay).toBe("function");
  });
});

describe("SingleVideoCutsceneOverlay — frameLine wiring", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "SingleVideoCutsceneOverlay.tsx"),
    "utf-8",
  );

  it("declares frameLine as an optional prop on the public interface", () => {
    expect(src).toMatch(/frameLine\?:\s*string/);
  });

  it("destructures frameLine in the component arguments", () => {
    expect(src).toMatch(/\bframeLine,/);
  });

  it("renders the frameLine in the reduced-motion fallback path", () => {
    // The reduced-motion branch shows the frame line as static text
    // alongside the CONTINUE button so screen-reader / no-autoplay
    // users still receive the lead-in.
    expect(src).toMatch(/data-frame-line/);
    expect(src.match(/data-frame-line/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("sets up the fade-in / hold / fade-out lifecycle for the video path", () => {
    // The line should fade in after the video is well underway
    // (~800ms), hold long enough to read (~5s total visible), then
    // fade out before the asset's narration arrives.
    expect(src).toContain("frameLinePhase");
    expect(src).toContain("setFrameLinePhase");
    // Three timer landmarks: fade-in, fade-out start, fully gone.
    expect(src).toMatch(/,\s*800\)/);
    expect(src).toMatch(/,\s*5800\)/);
    expect(src).toMatch(/,\s*6400\)/);
  });

  it("clears the lifecycle timers on unmount", () => {
    // Cutscene overlays unmount the moment the player skips; the
    // useEffect cleanup must drop the timers so a fast skip + new
    // mount can't double-trigger the fade.
    expect(src).toContain("clearTimeout");
  });
});

describe("HumanLifeVideoOverlay — passes frameLine to the cutscene primitive", () => {
  const overlaySrc = fs.readFileSync(
    path.resolve(__dirname, "HumanLifeVideoOverlay.tsx"),
    "utf-8",
  );

  it("forwards video.frameLine into the SingleVideoCutsceneOverlay props", () => {
    expect(overlaySrc).toMatch(/frameLine=\{video\.frameLine\}/);
  });
});
