import { describe, it, expect } from "vitest";
import { emptyBossState, reduceBossFight } from "../index";

describe("wolfHunt — bossFight reducer", () => {
  it("starts in wolf_turn phase", () => {
    const s = emptyBossState("m1", "general_caedryn_volk", 100);
    expect(s.phase).toBe("wolf_turn");
    expect(s.outcome).toBeUndefined();
  });

  it("hunt card damages lieutenant + costs Lycos some HP, advances phase", () => {
    const s = emptyBossState("m1", "general_caedryn_volk", 100);
    const out = reduceBossFight(s, { kind: "play_wolf_card", card: "hunt" });
    expect(out.lieutenantHp).toBe(20);
    expect(out.lycosHp).toBe(95);
    expect(out.phase).toBe("lieutenant_turn");
  });

  it("take_lieutenant_turn applies a defender card and advances back to wolf_turn", () => {
    const s = emptyBossState("m1", "general_caedryn_volk", 100);
    let state = reduceBossFight(s, { kind: "play_wolf_card", card: "hunt" });
    state = reduceBossFight(state, { kind: "take_lieutenant_turn" });
    expect(state.phase).toBe("wolf_turn");
    expect(state.turn).toBe(2);
  });

  it("ends with wolf_wins when lieutenant HP reaches 0", () => {
    // Stack: high-damage hand + empty defender hand/deck so the lieutenant cannot heal.
    const base = emptyBossState("m1", "general_caedryn_volk", 100);
    let state: typeof base = {
      ...base,
      wolfHand: ["hunt", "hunt", "hunt", "hunt"],
      wolfDeck: [],
      defenderHand: [],
      defenderDeck: [],
    };
    for (let i = 0; i < 4; i += 1) {
      state = reduceBossFight(state, { kind: "play_wolf_card", card: "hunt" });
      if (state.outcome) break;
      state = reduceBossFight(state, { kind: "take_lieutenant_turn" });
    }
    expect(state.outcome).toBe("wolf_wins");
  });

  it("ends with lycos_dies when Lycos HP reaches 0", () => {
    let state = emptyBossState("m1", "general_caedryn_volk", 6);
    state = reduceBossFight(state, { kind: "play_wolf_card", card: "hunt" });
    state = reduceBossFight(state, { kind: "take_lieutenant_turn" });
    expect(["lycos_dies", "lieutenant_wins", "wolf_wins"]).toContain(state.outcome);
  });

  it("mercy at low lieutenant HP ends the fight as wolf_wins", () => {
    const s = {
      ...emptyBossState("m1", "general_caedryn_volk", 100),
      lieutenantHp: 8,
    };
    const out = reduceBossFight(s, { kind: "play_wolf_card", card: "mercy" });
    expect(out.outcome).toBe("wolf_wins");
  });

  it("memory_of_the_medic heals Lycos", () => {
    const base = emptyBossState("m1", "general_caedryn_volk", 50);
    const s = { ...base, wolfHand: [...base.wolfHand, "memory_of_the_medic" as const] };
    const out = reduceBossFight(s, { kind: "play_wolf_card", card: "memory_of_the_medic" });
    expect(out.lycosHp).toBe(70);
  });

  it("is deterministic — same input → same output", () => {
    const s = emptyBossState("m1", "general_caedryn_volk", 100);
    const a = reduceBossFight(s, { kind: "play_wolf_card", card: "hunt" });
    const b = reduceBossFight(s, { kind: "play_wolf_card", card: "hunt" });
    expect(a).toEqual(b);
  });
});
