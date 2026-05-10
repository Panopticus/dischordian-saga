import { describe, expect, it } from "vitest";
import {
  buildAnyActTauntHooks,
  getTauntHooksForOpponent,
} from "./actOpponentTaunts";
import { ACT_1_OPPONENT_DIALOGS } from "./act1OpponentDialog";
import { ACT_3_OPPONENT_DIALOGS } from "./act3OpponentDialog";
import { ACT_4_OPPONENT_DIALOGS } from "./act4OpponentDialog";
import { ACT_6_OPPONENT_DIALOGS } from "./act6OpponentDialog";
import { ACT_7_OPPONENT_DIALOGS } from "./act7OpponentDialog";

describe("actOpponentTaunts — getTauntHooksForOpponent", () => {
  it("resolves an Act 1 opponent and tags sourceAct=1", () => {
    const hooks = getTauntHooksForOpponent("little_meme");
    expect(hooks).not.toBeNull();
    expect(hooks!.sourceAct).toBe(1);
    expect(hooks!.early.text.length).toBeGreaterThan(0);
    expect(hooks!.mid.hpBelowPercent).toBe(50);
    expect(hooks!.late.hpBelowPercent).toBe(25);
  });

  it("resolves an Act 3 opponent and tags sourceAct=3", () => {
    const hooks = getTauntHooksForOpponent("act3_substrate_echo");
    expect(hooks?.sourceAct).toBe(3);
  });

  it("resolves an Act 4 path opponent and tags sourceAct=4", () => {
    const hooks = getTauntHooksForOpponent("act4_the_betrayal");
    expect(hooks?.sourceAct).toBe(4);
  });

  it("resolves an Act 6 confession opponent and tags sourceAct=6", () => {
    const hooks = getTauntHooksForOpponent("act6_the_woman_she_was");
    expect(hooks?.sourceAct).toBe(6);
  });

  it("resolves an Act 7 finale opponent and tags sourceAct=7", () => {
    const hooks = getTauntHooksForOpponent("act7_oracle_meme_final");
    expect(hooks?.sourceAct).toBe(7);
  });

  it("returns null for unknown opponent ids", () => {
    expect(getTauntHooksForOpponent("does_not_exist")).toBeNull();
  });

  it("produces distinct ids for early/mid/late on every registered opponent", () => {
    const registries = [
      { list: ACT_1_OPPONENT_DIALOGS, act: 1 as const },
      { list: ACT_3_OPPONENT_DIALOGS, act: 3 as const },
      { list: ACT_4_OPPONENT_DIALOGS, act: 4 as const },
      { list: ACT_6_OPPONENT_DIALOGS, act: 6 as const },
      { list: ACT_7_OPPONENT_DIALOGS, act: 7 as const },
    ];
    for (const { list, act } of registries) {
      for (const d of list) {
        const hooks = buildAnyActTauntHooks(d, act);
        expect(hooks.early.id).toContain(d.opponentId);
        expect(hooks.mid.id).not.toBe(hooks.early.id);
        expect(hooks.late.id).not.toBe(hooks.mid.id);
        expect(hooks.late.id).not.toBe(hooks.early.id);
      }
    }
  });
});

describe("actOpponentTaunts — buildAnyActTauntHooks", () => {
  it("passes the opponentId through from the input dialog", () => {
    const dialog = ACT_4_OPPONENT_DIALOGS.find(
      (d) => d.opponentId === "act4_the_bridge",
    )!;
    const hooks = buildAnyActTauntHooks(dialog, 4);
    expect(hooks.opponentId).toBe("act4_the_bridge");
  });

  it("keeps every text body non-empty", () => {
    for (const d of ACT_7_OPPONENT_DIALOGS) {
      const hooks = buildAnyActTauntHooks(d, 7);
      expect(hooks.early.text.trim().length).toBeGreaterThan(0);
      expect(hooks.mid.text.trim().length).toBeGreaterThan(0);
      expect(hooks.late.text.trim().length).toBeGreaterThan(0);
    }
  });
});
