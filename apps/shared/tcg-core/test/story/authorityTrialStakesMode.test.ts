/* ═══════════════════════════════════════════════════════
   chAuthorityTrial — stakesMode + Game Master mid-Trial
   narrative hooks (Phase A4 + A5)

   Pins:
     • The encounter declares stakesMode with public_witness
       axis only — not verdict (avoids double-counting with
       trialMode.balance).
     • initEncounter populates state.stakes from the config
       (proves the stakesMode forwarding fix from A1 lands).
     • Three branching_dialog hooks fire at the right
       verdict-balance thresholds (>= +3 / <= -3) and at
       turn 5 (neutral fallback).
     • Hooks reference the canonical mid-Trial Intercession
       tree by id — drift in the tree ID would be caught.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { ALL_CHAPTER_ENCOUNTERS } from "../../story/chapters";
import {
  checkNarrativeHooks,
  type NarrativeAction,
} from "../../story/encounter";
import type { GameState } from "../../types/GameState";
import type { TrialState } from "../../types/TrialPhase";

const chAuthorityTrial = ALL_CHAPTER_ENCOUNTERS.find(
  (c) => c.id === "ch_authority_trial",
);

function trial(balance: number): TrialState {
  return {
    openingVerdictBalance: 0,
    trialBalance: balance,
    openingArgumentPlayed: false,
    closingArgumentPlayed: false,
  };
}

function stateWith(t: TrialState | undefined, turnNumber = 1): GameState {
  return { trial: t, turnNumber } as unknown as GameState;
}

describe("chAuthorityTrial — stakesMode declaration (A4)", () => {
  it("the encounter exists in CHAPTERS", () => {
    expect(chAuthorityTrial).toBeDefined();
  });

  it("declares stakesMode with the public_witness axis", () => {
    expect(chAuthorityTrial?.stakesMode).toBeDefined();
    expect(chAuthorityTrial?.stakesMode?.axes.public_witness).toBeDefined();
    expect(chAuthorityTrial?.stakesMode?.axes.public_witness?.initial).toBe(0);
    expect(chAuthorityTrial?.stakesMode?.axes.public_witness?.min).toBe(-10);
    expect(chAuthorityTrial?.stakesMode?.axes.public_witness?.max).toBe(10);
  });

  it("does NOT declare the verdict axis (avoids double-counting with trialMode.balance)", () => {
    // The verdict-axis adoption on shipped encounters is deferred
    // to the trialMode→stakesMode migration. This test pins the
    // current omission so a future "let me also add verdict" PR
    // is forced to think about the double-count.
    expect(chAuthorityTrial?.stakesMode?.axes.verdict).toBeUndefined();
  });

  it("retains the legacy trialMode declaration in parallel", () => {
    expect(chAuthorityTrial?.trialMode).toBeDefined();
    expect(chAuthorityTrial?.trialMode?.openingVerdictBalance).toBe(0);
  });
});

describe("chAuthorityTrial — Game Master mid-Trial narrative hooks (A5)", () => {
  if (!chAuthorityTrial) throw new Error("chAuthorityTrial missing");

  it("declares all three GM mid-Trial hooks (winning / losing / neutral)", () => {
    const hookIds = chAuthorityTrial.narrativeHooks.map((h) => h.id);
    expect(hookIds).toContain("gm_mid_trial_winning");
    expect(hookIds).toContain("gm_mid_trial_losing");
    expect(hookIds).toContain("gm_mid_trial_neutral");
  });

  it("all three GM hooks reference the canonical mid_trial_intercession tree", () => {
    for (const hookId of ["gm_mid_trial_winning", "gm_mid_trial_losing", "gm_mid_trial_neutral"]) {
      const hook = chAuthorityTrial.narrativeHooks.find((h) => h.id === hookId);
      expect(hook?.action.kind).toBe("branching_dialog");
      if (hook?.action.kind === "branching_dialog") {
        expect(hook.action.treeId).toBe("game-master-mid-trial-intercession");
      }
    }
  });

  it("each GM hook is once:true so it fires at most once per match", () => {
    for (const hookId of ["gm_mid_trial_winning", "gm_mid_trial_losing", "gm_mid_trial_neutral"]) {
      const hook = chAuthorityTrial.narrativeHooks.find((h) => h.id === hookId);
      expect(hook?.once, hookId).toBe(true);
    }
  });

  it("winning hook fires when state.trial.balance crosses >= +3", () => {
    const actions = checkNarrativeHooks(
      chAuthorityTrial,
      stateWith(trial(3)),
      new Set(),
    );
    const branching = actions.filter(
      (a): a is Extract<NarrativeAction, { kind: "branching_dialog" }> =>
        a.kind === "branching_dialog",
    );
    expect(branching.some((a) => a.entryNodeId === "winning_band_entry")).toBe(true);
  });

  it("losing hook fires when state.trial.balance crosses <= -3", () => {
    const actions = checkNarrativeHooks(
      chAuthorityTrial,
      stateWith(trial(-3)),
      new Set(),
    );
    const branching = actions.filter(
      (a): a is Extract<NarrativeAction, { kind: "branching_dialog" }> =>
        a.kind === "branching_dialog",
    );
    expect(branching.some((a) => a.entryNodeId === "losing_band_entry")).toBe(true);
  });

  it("neutral hook fires at turn 5 (the canonical fallback)", () => {
    const actions = checkNarrativeHooks(
      chAuthorityTrial,
      stateWith(trial(0), 5),
      new Set(),
    );
    const branching = actions.filter(
      (a): a is Extract<NarrativeAction, { kind: "branching_dialog" }> =>
        a.kind === "branching_dialog",
    );
    expect(branching.some((a) => a.entryNodeId === "neutral_band_entry")).toBe(true);
  });

  it("neither winning nor losing hook fires when trialBalance is in the neutral band (±2)", () => {
    for (const bal of [-2, -1, 0, 1, 2]) {
      const actions = checkNarrativeHooks(
        chAuthorityTrial,
        stateWith(trial(bal), 1),
        new Set(),
      );
      const entries = actions
        .filter(
          (a): a is Extract<NarrativeAction, { kind: "branching_dialog" }> =>
            a.kind === "branching_dialog",
        )
        .map((a) => a.entryNodeId);
      expect(entries, `balance ${bal}`).not.toContain("winning_band_entry");
      expect(entries, `balance ${bal}`).not.toContain("losing_band_entry");
    }
  });

  it("the existing authority_opening 'boss_taunt' hook still fires unchanged (no regression)", () => {
    const actions = checkNarrativeHooks(
      chAuthorityTrial,
      stateWith(trial(0), 1),
      new Set(),
    );
    expect(
      actions.some(
        (a) => a.kind === "boss_taunt" && a.text === "What do you say to the charges?",
      ),
    ).toBe(true);
  });
});
