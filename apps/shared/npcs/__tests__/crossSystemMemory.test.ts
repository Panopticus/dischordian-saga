// apps/shared/npcs/__tests__/crossSystemMemory.test.ts
//
// Validates the per-character cross-system memory registry (Phase 5).

import { describe, it, expect } from "vitest";
import {
  CROSS_SYSTEM_MEMORY_HOOKS,
  memoryHooksFor,
  memoryHooksByEvent,
  hooksFiringFor,
} from "../crossSystemMemory";
import { NPC_REGISTRY } from "../registry";

describe("CROSS_SYSTEM_MEMORY_HOOKS", () => {
  it("ships at least one hook per priority-roster NPC that needs lived-in canon", () => {
    const npcKeys = new Set(CROSS_SYSTEM_MEMORY_HOOKS.map(h => h.npcKey));
    // Per Phase 5 plan: Locke / Vex / Nilmorg / Seer / Hierophant /
    // Companion / Oracle / Eidolon / Degen / Meme — 10 NPCs with hooks
    // (Game Master, Elara, Human have lived-in canon but not yet
    // hooked here; Phase 6 expansion).
    expect(npcKeys.size).toBeGreaterThanOrEqual(10);
  });

  it("every hook references a canonical NpcKey", () => {
    for (const hook of CROSS_SYSTEM_MEMORY_HOOKS) {
      expect(NPC_REGISTRY[hook.npcKey], hook.eventKind).toBeDefined();
    }
  });

  it("every hook has either referencingLineId or personalityShift (or canonicalNote alone for documentation)", () => {
    for (const hook of CROSS_SYSTEM_MEMORY_HOOKS) {
      const hasRef =
        hook.referencingLineId !== undefined ||
        hook.personalityShift !== undefined ||
        hook.canonicalNote.length > 0;
      expect(hasRef, `${hook.npcKey}/${hook.eventKind}`).toBe(true);
    }
  });

  it("every hook has a non-empty canonicalNote", () => {
    for (const hook of CROSS_SYSTEM_MEMORY_HOOKS) {
      expect(hook.canonicalNote.length, hook.npcKey).toBeGreaterThan(0);
    }
  });
});

describe("memoryHooksFor / memoryHooksByEvent", () => {
  it("Locke has multiple memory hooks", () => {
    const lockeHooks = memoryHooksFor("adjudicator_locke");
    expect(lockeHooks.length).toBeGreaterThanOrEqual(3);
  });

  it("Eidolon has 3 Echo three-source-type hooks", () => {
    const echoHooks = memoryHooksFor("your_eidolon");
    expect(echoHooks.length).toBe(3);
    const eventKinds = echoHooks.map(h => h.eventKind);
    expect(eventKinds).toContain("seer_transmission_received");
    expect(eventKinds).toContain("companion_first_word");
    expect(eventKinds).toContain("oracle_dream_received");
  });

  it("memoryHooksByEvent returns hooks across all NPCs for shared event", () => {
    const completionHooks = memoryHooksByEvent("ch_completion");
    expect(completionHooks.length).toBeGreaterThanOrEqual(1);
  });
});

describe("hooksFiringFor — selective resolution", () => {
  it("Vex Ch6 win triggers memoir-close line", () => {
    const hooks = hooksFiringFor("vex_solene", "ch_match_won", "ch6");
    expect(hooks.length).toBe(1);
    expect(hooks[0]?.referencingLineId).toBe("vex.engineer.memoir_close.bench_was_warm");
  });

  it("Locke Ch3b win triggers Conspiratorial personality shift", () => {
    const hooks = hooksFiringFor("adjudicator_locke", "ch_match_won", "ch3b");
    expect(hooks.length).toBe(1);
    expect(hooks[0]?.personalityShift).toBe("Conspiratorial");
  });

  it("Locke Ch6 win does NOT trigger (selector mismatch)", () => {
    const hooks = hooksFiringFor("adjudicator_locke", "ch_match_won", "ch6");
    expect(hooks.length).toBe(0);
  });

  it("Nilmorg DMC severance claim fires canonical refusal line", () => {
    const hooks = hooksFiringFor("nilmorg", "dmc_severance_claimed");
    expect(hooks.length).toBe(1);
    expect(hooks[0]?.referencingLineId).toBe("nilmorg.severance.dont_thank_me");
  });

  it("Companion entering Hierophant chamber fires first-word", () => {
    const hooks = hooksFiringFor("dmc_clone_companion", "hierophant_chamber_visited");
    expect(hooks.length).toBe(1);
    expect(hooks[0]?.referencingLineId).toBe(
      "companion.first_word.hierophant_chamber.wraith_calder",
    );
  });

  it("Degen befriending Seer triggers ethics-committee citation", () => {
    const hooks = hooksFiringFor("the_degen", "npc_befriended", "the_seer");
    expect(hooks.length).toBe(1);
    expect(hooks[0]?.referencingLineId).toBe("degen.reactive.ethics_committee_citation");
  });

  it("Seer cross-time canonical-anticipation hook covers any choice", () => {
    const hooks = hooksFiringFor("the_seer", "ch_choice_made");
    expect(hooks.length).toBeGreaterThan(0);
  });

  it("hooksFiringFor with no eventSelector matches hooks without selector", () => {
    // Eidolon Echo hooks have no eventSelector — they fire on ANY occurrence
    // of the event kind regardless of selector
    const hooks = hooksFiringFor("your_eidolon", "seer_transmission_received");
    expect(hooks.length).toBe(1);
  });
});
