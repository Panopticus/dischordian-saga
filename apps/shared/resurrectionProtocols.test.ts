import { describe, it, expect, beforeEach } from "vitest";
import {
  rollProtocolRecipe,
  openResurrectionQuest,
  markSubtaskComplete,
  resolveQuestPathB,
  pickPathBTransmission,
  RESURRECTABLE_NPC_KEYS,
  PROTOCOL_SUBTASK_IDS,
  isResurrectableNpc,
  generatePathAFirstLine,
  createInMemoryPermadeathStore,
  getPermadeathStore,
  setPermadeathStore,
  isProtocolRefusedFor,
  type ResurrectableNpcKey,
  type PermadeathReason,
} from "./resurrectionProtocols";

describe("rollProtocolRecipe", () => {
  it("picks 4 distinct subtasks from the 7-pool", () => {
    const recipe = rollProtocolRecipe(12345);
    expect(recipe.length).toBe(4);
    expect(new Set(recipe).size).toBe(4);
    for (const id of recipe) {
      expect(PROTOCOL_SUBTASK_IDS.includes(id)).toBe(true);
    }
  });

  it("is deterministic for the same seed", () => {
    expect(rollProtocolRecipe(99)).toEqual(rollProtocolRecipe(99));
    expect(rollProtocolRecipe(100)).toEqual(rollProtocolRecipe(100));
  });

  it("varies across seeds (sanity)", () => {
    const a = rollProtocolRecipe(1);
    const b = rollProtocolRecipe(2);
    const c = rollProtocolRecipe(3);
    // At least one of the three must differ from the others
    const allEqual =
      JSON.stringify(a) === JSON.stringify(b) &&
      JSON.stringify(b) === JSON.stringify(c);
    expect(allEqual).toBe(false);
  });

  it("favors confession_trial (heavy weight)", () => {
    // Across 200 seeds, confession_trial should land >60% of the time.
    let count = 0;
    for (let i = 0; i < 200; i++) {
      const recipe = rollProtocolRecipe(i * 7919 + 1);
      if (recipe.includes("confession_trial")) count++;
    }
    expect(count).toBeGreaterThan(120);
  });
});

describe("openResurrectionQuest", () => {
  it("opens a fresh quest with 4 subtasks and status=open", () => {
    const q = openResurrectionQuest({
      userId: 42,
      npcKey: "locke",
      deathCycle: 17,
      killedMemberKey: "crew-1700000000-0001",
      now: 1_700_000_000_000,
    });
    expect(q.subtasks.length).toBe(4);
    expect(q.status).toBe("open");
    expect(q.subtasks.every((s) => !s.completed)).toBe(true);
    expect(q.id).toContain("locke");
    expect(q.id).toContain("42");
  });

  it("uses the same recipe for the same triple", () => {
    const a = openResurrectionQuest({
      userId: 1,
      npcKey: "vex_solene",
      deathCycle: 5,
      killedMemberKey: "x",
      now: 0,
    });
    const b = openResurrectionQuest({
      userId: 1,
      npcKey: "vex_solene",
      deathCycle: 5,
      killedMemberKey: "x",
      now: 1_000_000,
    });
    expect(a.subtasks.map((s) => s.id)).toEqual(b.subtasks.map((s) => s.id));
  });
});

describe("markSubtaskComplete", () => {
  it("transitions to in_progress on first completion", () => {
    let q = openResurrectionQuest({
      userId: 1,
      npcKey: "wraith_calder",
      deathCycle: 1,
      killedMemberKey: "k",
      now: 0,
    });
    const firstId = q.subtasks[0].id;
    q = markSubtaskComplete(q, firstId, 1000);
    expect(q.status).toBe("in_progress");
    expect(q.subtasks.find((s) => s.id === firstId)?.completed).toBe(true);
  });

  it("transitions to completed_path_a when all subtasks are done", () => {
    let q = openResurrectionQuest({
      userId: 1,
      npcKey: "jericho_jones",
      deathCycle: 1,
      killedMemberKey: "k",
      now: 0,
    });
    for (const s of q.subtasks) {
      q = markSubtaskComplete(q, s.id, 1000);
    }
    expect(q.status).toBe("completed_path_a");
    expect(q.resolvedAt).toBe(1000);
  });

  it("is idempotent (re-completing a finished subtask is a no-op)", () => {
    let q = openResurrectionQuest({
      userId: 1,
      npcKey: "akai_shi",
      deathCycle: 1,
      killedMemberKey: "k",
      now: 0,
    });
    const id = q.subtasks[0].id;
    q = markSubtaskComplete(q, id, 100);
    const t1 = q.subtasks[0].completedAt;
    q = markSubtaskComplete(q, id, 200);
    expect(q.subtasks[0].completedAt).toBe(t1);
  });
});

describe("resolveQuestPathB", () => {
  it("flips an open quest to completed_path_b with resolvedViaPathB", () => {
    let q = openResurrectionQuest({
      userId: 1,
      npcKey: "locke",
      deathCycle: 1,
      killedMemberKey: "k",
      now: 0,
    });
    q = resolveQuestPathB(q, 5000);
    expect(q.status).toBe("completed_path_b");
    expect(q.resolvedViaPathB).toBe(true);
    expect(q.resolvedAt).toBe(5000);
  });

  it("does not overwrite a Path-A-completed quest", () => {
    let q = openResurrectionQuest({
      userId: 1,
      npcKey: "locke",
      deathCycle: 1,
      killedMemberKey: "k",
      now: 0,
    });
    for (const s of q.subtasks) {
      q = markSubtaskComplete(q, s.id, 1000);
    }
    const beforeStatus = q.status;
    q = resolveQuestPathB(q, 9999);
    expect(q.status).toBe(beforeStatus); // still completed_path_a
    expect(q.resolvedViaPathB).toBeUndefined();
  });
});

describe("pickPathBTransmission", () => {
  it("returns a tone+lines tuple for every recruitable NPC", () => {
    for (const key of RESURRECTABLE_NPC_KEYS) {
      const q = openResurrectionQuest({
        userId: 1,
        npcKey: key as ResurrectableNpcKey,
        deathCycle: 1,
        killedMemberKey: "k",
        now: 0,
      });
      const tx = pickPathBTransmission(q, 0);
      expect(tx.tone).toBeTruthy();
      expect(tx.lines.length).toBeGreaterThan(0);
    }
  });
});

describe("isResurrectableNpc", () => {
  it("accepts the 5 canonical keys", () => {
    expect(isResurrectableNpc("vex_solene")).toBe(true);
    expect(isResurrectableNpc("wraith_calder")).toBe(true);
    expect(isResurrectableNpc("locke")).toBe(true);
    expect(isResurrectableNpc("jericho_jones")).toBe(true);
    expect(isResurrectableNpc("akai_shi")).toBe(true);
  });
  it("rejects non-recruitable NPC keys", () => {
    expect(isResurrectableNpc("the_oracle")).toBe(false);
    expect(isResurrectableNpc("the_human")).toBe(false);
    expect(isResurrectableNpc("elara")).toBe(false);
  });
});

describe("generatePathAFirstLine", () => {
  it("interpolates the death memory blob into archetype templates", () => {
    const line = generatePathAFirstLine(
      "locke",
      {
        missionId: "m1",
        missionName: "The Outer Station Run",
        squadIds: ["alice", "bob"],
        causeShort: "Mol'Garath's hounds",
        lastWords: "Tell them I didn't hesitate.",
      },
      { alice: "Alice", bob: "Bob" },
      0,
    );
    expect(line.length).toBeGreaterThan(20);
    // Death memory specifics should land in the line:
    expect(
      line.includes("The Outer Station Run") ||
        line.includes("Mol'Garath") ||
        line.includes("Alice") ||
        line.includes("Tell them I didn't hesitate."),
    ).toBe(true);
  });
});

describe("permadeath store (Nexus Trial Verdict infrastructure)", () => {
  function reason(source: PermadeathReason["source"]): PermadeathReason {
    return {
      trialId: "nexus_trial_2027",
      recordedAt: Date.UTC(2027, 2, 15),
      source,
      finalNarration: "She filed the world. She did not file herself.",
    };
  }

  beforeEach(() => {
    setPermadeathStore(createInMemoryPermadeathStore());
  });

  it("no NPC is permadead at module-load time", () => {
    for (const key of RESURRECTABLE_NPC_KEYS) {
      expect(isProtocolRefusedFor(key)).toBe(false);
    }
    expect(getPermadeathStore().listPermadead()).toEqual([]);
  });

  it("markPermadead persists the reason and the lookup flips", () => {
    const store = getPermadeathStore();
    store.markPermadead("locke", reason("necromancer_price"));

    expect(store.isPermadead("locke")).toBe(true);
    expect(isProtocolRefusedFor("locke")).toBe(true);
    // Other names stay accessible.
    expect(store.isPermadead("vex_solene")).toBe(false);
    expect(store.isPermadead("akai_shi")).toBe(false);
  });

  it("listPermadead returns every withheld name with its reason", () => {
    const store = getPermadeathStore();
    store.markPermadead("locke", reason("necromancer_price"));
    store.markPermadead("akai_shi", reason("vortex_price"));

    const entries = store.listPermadead();
    expect(entries.length).toBe(2);
    const byKey = Object.fromEntries(entries.map(({ npcKey, reason: r }) => [npcKey, r.source]));
    expect(byKey.locke).toBe("necromancer_price");
    expect(byKey.akai_shi).toBe("vortex_price");
  });

  it("markPermadead refuses to overwrite an existing record", () => {
    const store = getPermadeathStore();
    store.markPermadead("locke", reason("necromancer_price"));
    expect(() => store.markPermadead("locke", reason("vortex_price"))).toThrow(/already recorded/);
  });

  it("setPermadeathStore swaps the active store (Sprint 9 will use this for DB-backed)", () => {
    const alt = createInMemoryPermadeathStore();
    alt.markPermadead("wraith_calder", reason("vortex_price"));

    setPermadeathStore(alt);
    expect(isProtocolRefusedFor("wraith_calder")).toBe(true);
    // The default store from beforeEach is no longer active.
    expect(getPermadeathStore()).toBe(alt);
  });
});
