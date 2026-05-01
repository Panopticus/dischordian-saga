import { describe, expect, it } from "vitest";

import {
  TEMPLATE_NPC_ARC_TRIGGER,
  TEMPLATE_VOTE_RESOLUTION_SHORT,
  compileMysterySeed,
  getMysteryTemplate,
  listMysteryTemplates,
  seedFromNpcArc,
  seedFromVoteClosure,
} from "./mysteryTemplates";
import type { ArcId, MysteryId } from "./mysteryTypes";

describe("mysteryTemplates — registry + helpers", () => {
  it("registry contains the two seed templates", () => {
    const ids = listMysteryTemplates().map((t) => t.id);
    expect(ids).toContain(TEMPLATE_VOTE_RESOLUTION_SHORT);
    expect(ids).toContain(TEMPLATE_NPC_ARC_TRIGGER);
  });

  it("getMysteryTemplate returns null for unknown id", () => {
    expect(getMysteryTemplate("template.does_not_exist")).toBeNull();
  });

  it("seedFromVoteClosure stamps the source + payload deterministically", () => {
    const seed = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    expect(seed.source).toBe("epoch_vote_closure");
    expect(seed.seedId).toBe("epoch_vote_closure.ap_v1.a");
    expect(seed.templateId).toBe(TEMPLATE_VOTE_RESOLUTION_SHORT);
    expect(seed.payload.voteId).toBe("ap_v1");
    expect(seed.payload.winningOption).toBe("a");
  });

  it("seedFromNpcArc stamps the npc_arc source", () => {
    const seed = seedFromNpcArc(
      "arc.wraith_calder" as ArcId,
      "mystery.wraith_calder" as MysteryId,
    );
    expect(seed.source).toBe("npc_arc");
    expect(seed.templateId).toBe(TEMPLATE_NPC_ARC_TRIGGER);
    expect(seed.payload.arcId).toBe("arc.wraith_calder");
    expect(seed.payload.authoredMysteryId).toBe("mystery.wraith_calder");
  });
});

describe("vote_resolution_short template", () => {
  const template = getMysteryTemplate(TEMPLATE_VOTE_RESOLUTION_SHORT)!;

  it("compiles a closed-vote seed into a 1-episode mystery", () => {
    const seed = seedFromVoteClosure("ap_v1", "b", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const def = template.compile(seed);
    expect(def).not.toBeNull();
    expect(def!.episodes.length).toBe(1);
  });

  it("compilation is deterministic — same seed produces equal definitions", () => {
    const seed1 = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const seed2 = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const a = template.compile(seed1)!;
    const b = template.compile(seed2)!;
    expect(a.id).toBe(b.id);
    expect(a.title).toBe(b.title);
    expect(a.episodes[0].id).toBe(b.episodes[0].id);
  });

  it("different winning options produce different mystery ids", () => {
    const a = template.compile(seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT))!;
    const b = template.compile(seedFromVoteClosure("ap_v1", "b", TEMPLATE_VOTE_RESOLUTION_SHORT))!;
    expect(a.id).not.toBe(b.id);
  });

  it("rejects malformed payloads (returns null)", () => {
    const malformed = {
      source: "epoch_vote_closure" as const,
      seedId: "test",
      templateId: TEMPLATE_VOTE_RESOLUTION_SHORT,
      payload: {}, // missing voteId + winningOption
    };
    expect(template.compile(malformed)).toBeNull();
  });

  it("compiled episode has at least one correct deduction (case is solvable)", () => {
    const def = template.compile(seedFromVoteClosure("ap_v1", "c", TEMPLATE_VOTE_RESOLUTION_SHORT))!;
    const e = def.episodes[0];
    expect(e.deductions.some((d) => d.result === "correct")).toBe(true);
  });
});

describe("npc_arc_trigger template", () => {
  const template = getMysteryTemplate(TEMPLATE_NPC_ARC_TRIGGER)!;

  it("returns null — pass-through marker, never builds", () => {
    const seed = seedFromNpcArc(
      "arc.wraith_calder" as ArcId,
      "mystery.wraith_calder" as MysteryId,
    );
    expect(template.compile(seed)).toBeNull();
  });
});

describe("compileMysterySeed — top-level dispatch", () => {
  it("returns null for unknown templateId", () => {
    expect(compileMysterySeed({
      source: "manual",
      seedId: "test",
      templateId: "template.unregistered",
      payload: {},
    })).toBeNull();
  });

  it("compiles a vote_resolution_short seed end-to-end", () => {
    const seed = seedFromVoteClosure("ap_v3", "d", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const def = compileMysterySeed(seed);
    expect(def).not.toBeNull();
    expect(def!.id).toContain("ap_v3");
    expect(def!.id).toContain("d");
  });
});
