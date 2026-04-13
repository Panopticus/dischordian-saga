/**
 * Dialog bank resolution — behavior test (Phase D2).
 *
 * Verifies that the resolvers in encounter.ts and tutorial.ts
 * actually return authored content for every id referenced in
 * the encounter + tutorial data. If an id is stubbed in
 * chapters.ts or tutorial.ts and nobody has written the scene
 * yet, this test tells us which ids are still missing so they
 * can be filled in the next content commit.
 */
import { describe, it, expect } from "vitest";
import {
  ALL_CHAPTER_ENCOUNTERS,
  TUTORIAL_GATES,
  resolvePreMatchDialog,
  resolvePostMatchDialog,
  resolveNarrativeActions,
  resolveTutorialPreMatchDialog,
  resolveTutorialPostMatchDialog,
  DIALOG_BANK,
  getDialogBankCoverage,
} from "../../index";

describe("dialog bank resolution (D2)", () => {
  it("resolves every story chapter pre-match scene", () => {
    for (const enc of ALL_CHAPTER_ENCOUNTERS) {
      if (!enc.preMatchDialog) continue;
      const scene = resolvePreMatchDialog(enc);
      expect(scene, `pre-match scene for ${enc.id}`).not.toBeNull();
      expect(scene!.cues.length).toBeGreaterThan(0);
    }
  });

  it("resolves every story chapter post-match win scene", () => {
    for (const enc of ALL_CHAPTER_ENCOUNTERS) {
      if (!enc.postMatchWinDialog) continue;
      const scene = resolvePostMatchDialog(enc, "win");
      expect(scene, `post-win scene for ${enc.id}`).not.toBeNull();
      expect(scene!.cues.length).toBeGreaterThan(0);
    }
  });

  it("resolves every story chapter post-match loss scene", () => {
    for (const enc of ALL_CHAPTER_ENCOUNTERS) {
      if (!enc.postMatchLossDialog) continue;
      const scene = resolvePostMatchDialog(enc, "lose");
      expect(scene, `post-loss scene for ${enc.id}`).not.toBeNull();
      expect(scene!.cues.length).toBeGreaterThan(0);
    }
  });

  it("resolves every show_cinematic id referenced in chapter narrativeHooks", () => {
    for (const enc of ALL_CHAPTER_ENCOUNTERS) {
      for (const hook of enc.narrativeHooks) {
        if (hook.action.kind !== "show_cinematic") continue;
        const resolved = resolveNarrativeActions([hook.action])[0];
        expect(resolved.kind).toBe("show_cinematic");
        if (resolved.kind === "show_cinematic") {
          expect(
            resolved.scene,
            `cinematic ${resolved.cinematicId} in ${enc.id}`,
          ).not.toBeNull();
          expect(resolved.scene!.cues.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("boss_taunt narrative actions pass through with their inline text", () => {
    const sample = ALL_CHAPTER_ENCOUNTERS[0].narrativeHooks
      .find((h) => h.action.kind === "boss_taunt");
    expect(sample).toBeDefined();
    const resolved = resolveNarrativeActions([sample!.action])[0];
    expect(resolved.kind).toBe("boss_taunt");
    if (resolved.kind === "boss_taunt") {
      expect(resolved.text.length).toBeGreaterThan(0);
    }
  });

  it("resolves every tutorial gate pre-match scene", () => {
    for (const gate of TUTORIAL_GATES) {
      if (!gate.encounter?.preMatchDialog) continue;
      const scene = resolveTutorialPreMatchDialog(gate);
      expect(scene, `pre-match scene for tutorial ${gate.id}`).not.toBeNull();
      expect(scene!.cues.length).toBeGreaterThan(0);
    }
  });

  it("resolves tutorial post-match scenes (both outcomes) where authored", () => {
    // Every tutorial gate with an encounter has a win scene
    // authored. Some have a loss scene; the helper returns null
    // gracefully when a loss scene is missing (e.g. gate 4 has
    // no encounter at all).
    for (const gate of TUTORIAL_GATES) {
      if (!gate.encounter) continue;
      const win = resolveTutorialPostMatchDialog(gate, "win");
      expect(win, `win scene for tutorial ${gate.id}`).not.toBeNull();
      // Loss scenes are best-effort; just ensure the helper
      // doesn't throw and returns a DialogScene or null.
      const loss = resolveTutorialPostMatchDialog(gate, "lose");
      expect(loss === null || loss.cues.length > 0).toBe(true);
    }
  });

  it("dialog bank coverage reports scenes in every category", () => {
    const coverage = getDialogBankCoverage();
    expect(coverage.total).toBeGreaterThanOrEqual(70);
    expect(coverage.byKind.tutorial_pre).toBeGreaterThanOrEqual(4);
    expect(coverage.byKind.chapter_pre).toBeGreaterThanOrEqual(14);
    expect(coverage.byKind.chapter_post_win).toBeGreaterThanOrEqual(14);
    expect(coverage.byKind.chapter_post_loss).toBeGreaterThanOrEqual(14);
    expect(coverage.byKind.cinematic).toBeGreaterThanOrEqual(6);
    expect(coverage.byKind.match_lifecycle).toBeGreaterThanOrEqual(17);
  });

  it("every scene has at least one cue", () => {
    for (const [id, scene] of Object.entries(DIALOG_BANK)) {
      expect(scene.cues.length, `scene ${id}`).toBeGreaterThan(0);
    }
  });
});
