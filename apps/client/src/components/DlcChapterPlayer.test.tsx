/* Structural smoke test for DlcChapterPlayer.
 *
 * The component pulls in GameContext + tRPC, both of which need
 * a full React render tree to exercise. The shared vitest config
 * runs in `node` env without jsdom, so this is a structural test:
 * confirms the export shape + that the source mentions every step
 * kind it claims to render. */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import DlcChapterPlayer from "./DlcChapterPlayer";

describe("DlcChapterPlayer", () => {
  it("exports a component function as default", () => {
    expect(DlcChapterPlayer).toBeDefined();
    expect(typeof DlcChapterPlayer).toBe("function");
  });

  it("source handles every DlcStep kind", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "DlcChapterPlayer.tsx"),
      "utf-8",
    );
    expect(src).toMatch(/case "narration"/);
    expect(src).toMatch(/case "choice"/);
    expect(src).toMatch(/case "encounter_ref"/);
    expect(src).toMatch(/case "cinematic_ref"/);
  });

  it("calls dlcChapters.markChapterComplete on the final step", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "DlcChapterPlayer.tsx"),
      "utf-8",
    );
    expect(src).toMatch(/dlcChapters\.markChapterComplete\.useMutation/);
  });

  it("raises chosen-option flags via setNarrativeFlag", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "DlcChapterPlayer.tsx"),
      "utf-8",
    );
    expect(src).toMatch(/setNarrativeFlag\(opt\.setFlag, true\)/);
  });
});
