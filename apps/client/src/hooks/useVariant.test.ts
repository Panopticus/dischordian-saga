import { describe, it, expect } from "vitest";
import {
  buildVariantInput,
  variantInputSignature,
  type VariantInputSourceState,
} from "./useVariant";
import {
  resolveVariant,
  type MoralityTrustActVariant,
} from "@shared/moralityTrustActVariants";

describe("buildVariantInput", () => {
  it("populates morality + act with sensible defaults", () => {
    const input = buildVariantInput({});
    expect(input.moralityScore).toBe(0);
    expect(input.narrativeAct).toBe(0);
    expect(input.trustByCompanion.elara).toBe(0);
    expect(input.trustByCompanion.human).toBe(0);
    expect(input.flags.size).toBe(0);
  });

  it("prefers Level fields over legacy bare-trust fields", () => {
    const input = buildVariantInput({
      elaraTrustLevel: 50,
      elaraTrust: 10,
      humanTrustLevel: 30,
      humanTrust: 5,
    });
    expect(input.trustByCompanion.elara).toBe(50);
    expect(input.trustByCompanion.human).toBe(30);
  });

  it("falls back to legacy bare-trust when Level absent", () => {
    const input = buildVariantInput({
      elaraTrust: 42,
    });
    expect(input.trustByCompanion.elara).toBe(42);
  });

  it("merges companionRelationships into trust map", () => {
    const input = buildVariantInput({
      companionRelationships: { locke: 75, kael: 22 },
    });
    expect(input.trustByCompanion.locke).toBe(75);
    expect(input.trustByCompanion.kael).toBe(22);
  });

  it("only adds flags whose value is true", () => {
    const input = buildVariantInput({
      narrativeFlags: { a: true, b: false, c: true },
    });
    expect(input.flags.has("a")).toBe(true);
    expect(input.flags.has("b")).toBe(false);
    expect(input.flags.has("c")).toBe(true);
  });
});

describe("variantInputSignature", () => {
  it("produces the same signature for trust differences within a band", () => {
    const a: VariantInputSourceState = {
      moralityScore: 30,
      narrativeAct: 3,
      elaraTrustLevel: 50,
    };
    const b: VariantInputSourceState = {
      moralityScore: 30,
      narrativeAct: 3,
      elaraTrustLevel: 65, // still "warm" (50-79)
    };
    const sigA = variantInputSignature(buildVariantInput(a));
    const sigB = variantInputSignature(buildVariantInput(b));
    expect(sigA).toBe(sigB);
  });

  it("changes signature when trust crosses a band boundary", () => {
    const cold = variantInputSignature(
      buildVariantInput({ elaraTrustLevel: 20 }),
    );
    const neutral = variantInputSignature(
      buildVariantInput({ elaraTrustLevel: 30 }),
    );
    expect(cold).not.toBe(neutral);
  });

  it("changes signature when narrativeAct changes", () => {
    const act3 = variantInputSignature(buildVariantInput({ narrativeAct: 3 }));
    const act4 = variantInputSignature(buildVariantInput({ narrativeAct: 4 }));
    expect(act3).not.toBe(act4);
  });

  it("is stable to flag insertion order", () => {
    const a = variantInputSignature(
      buildVariantInput({ narrativeFlags: { x: true, y: true } }),
    );
    const b = variantInputSignature(
      buildVariantInput({ narrativeFlags: { y: true, x: true } }),
    );
    expect(a).toBe(b);
  });
});

describe("resolver wiring (stub registry)", () => {
  const stubRegistry: readonly MoralityTrustActVariant[] = [
    {
      id: "room_bridge_humanity_act3",
      surface: "room",
      targetId: "bridge",
      text: "Bridge — humanity, act 3.",
      morality: "humanity",
      trust: "any",
      act: 3,
    },
    {
      id: "room_bridge_machine_act3",
      surface: "room",
      targetId: "bridge",
      text: "Bridge — machine, act 3.",
      morality: "machine",
      trust: "any",
      act: 3,
    },
    {
      id: "npc_locke_warm",
      surface: "npc_line",
      targetId: "locke",
      text: "Locke at warm trust.",
      morality: "any",
      trust: "warm",
      trustCompanionId: "locke",
      act: "any",
    },
  ];

  it("resolves morality + act-gated room variants", () => {
    const inputHumanity = buildVariantInput({
      moralityScore: 30,
      narrativeAct: 3,
    });
    const v = resolveVariant(stubRegistry, "room", "bridge", inputHumanity);
    expect(v?.id).toBe("room_bridge_humanity_act3");

    const inputMachine = buildVariantInput({
      moralityScore: -30,
      narrativeAct: 3,
    });
    const v2 = resolveVariant(stubRegistry, "room", "bridge", inputMachine);
    expect(v2?.id).toBe("room_bridge_machine_act3");
  });

  it("resolves trust-gated npc_line variants from companionRelationships", () => {
    const input = buildVariantInput({
      companionRelationships: { locke: 60 }, // warm band
    });
    const v = resolveVariant(stubRegistry, "npc_line", "locke", input);
    expect(v?.id).toBe("npc_locke_warm");
  });

  it("returns null when no entry matches", () => {
    const input = buildVariantInput({
      moralityScore: 0,
      narrativeAct: 1,
    });
    const v = resolveVariant(stubRegistry, "room", "bridge", input);
    expect(v).toBeNull();
  });
});
