// apps/shared/tradeEmpire/__tests__/contracts.test.ts
//
// Validates the contract template registry + entity-shape invariants.
// Server-side router behavior (DB writes, ripple emissions, lock-out
// handling) is integration-tested separately via the existing tRPC
// test harness.

import { describe, it, expect } from "vitest";
import {
  ALL_CONTRACT_TEMPLATES,
  getContractTemplate,
  contractsByBroker,
  allContractKeys,
  LOCKE_CONTRACTS,
  NILMORG_CONTRACTS,
  DEGEN_CONTRACTS,
  ANTIQUARIAN_CONTRACTS,
  INDEPENDENT_CONTRACTS,
  THALORIA_CONTRACTS,
} from "../contractTemplates";
import {
  validateContractDef,
  clausesAtSigning,
  clausesOnBreach,
} from "../contracts";
import { BROKER_REGISTRY, isKnownBrokerKey } from "../brokers";

describe("Contract template registry", () => {
  it("exports every per-broker family via aggregator", () => {
    expect(ALL_CONTRACT_TEMPLATES.length).toBe(
      LOCKE_CONTRACTS.length +
        NILMORG_CONTRACTS.length +
        DEGEN_CONTRACTS.length +
        ANTIQUARIAN_CONTRACTS.length +
        INDEPENDENT_CONTRACTS.length +
        THALORIA_CONTRACTS.length,
    );
  });

  it("every contract template passes validateContractDef()", () => {
    for (const template of ALL_CONTRACT_TEMPLATES) {
      const errors = validateContractDef(template);
      expect(errors, `${template.contractKey}: ${errors.join("; ")}`).toEqual([]);
    }
  });

  it("every contract's brokerKey is canonical", () => {
    for (const template of ALL_CONTRACT_TEMPLATES) {
      expect(isKnownBrokerKey(template.brokerKey), template.contractKey).toBe(true);
    }
  });

  it("every broker's offersContracts list points to actual templates", () => {
    for (const broker of Object.values(BROKER_REGISTRY)) {
      for (const contractKey of broker.offersContracts ?? []) {
        const template = getContractTemplate(contractKey);
        expect(template, `${broker.brokerKey} offers unknown ${contractKey}`).toBeDefined();
      }
    }
  });

  it("getContractTemplate resolves by canonical key", () => {
    expect(getContractTemplate("locke.retainer_baseline")).toBeDefined();
    expect(getContractTemplate("severance.prize_body_contract")).toBeDefined();
    expect(getContractTemplate("does_not_exist")).toBeUndefined();
  });

  it("contractsByBroker returns only that broker's templates", () => {
    const lockeContracts = contractsByBroker("broker_locke");
    expect(lockeContracts.length).toBe(LOCKE_CONTRACTS.length);
    for (const c of lockeContracts) {
      expect(c.brokerKey).toBe("broker_locke");
    }
  });

  it("allContractKeys returns unique keys", () => {
    const keys = allContractKeys();
    expect(keys.length).toBe(new Set(keys).size);
  });
});

describe("Locke contracts — fine-print canon", () => {
  it("LOCKE_RETAINER_BASELINE has 3 stages with monotonically increasing rewards", () => {
    const c = getContractTemplate("locke.retainer_baseline")!;
    expect(c.stages.length).toBe(3);
    expect(c.stages[0]!.rewards!.credits).toBe(250);
    expect(c.stages[1]!.rewards!.credits).toBe(400);
    expect(c.stages[2]!.rewards!.credits).toBe(750);
  });

  it("LOCKE_RETAINER_BASELINE has audit_clause on_signing", () => {
    const c = getContractTemplate("locke.retainer_baseline")!;
    const onSigning = clausesAtSigning(c);
    expect(onSigning.find(cl => cl.clauseId === "audit_clause")).toBeDefined();
  });

  it("LOCKE_RETAINER_BASELINE has trust_breach_clause on_breach", () => {
    const c = getContractTemplate("locke.retainer_baseline")!;
    const onBreach = clausesOnBreach(c);
    expect(onBreach.find(cl => cl.clauseId === "trust_breach_clause")).toBeDefined();
  });

  it("LOCKE_EXCLUSIVE_DEALINGS has Touché public flag clause", () => {
    const c = getContractTemplate("locke.exclusive_dealings")!;
    const onSigning = clausesAtSigning(c);
    const touche = onSigning.find(cl => cl.clauseId === "touche_public_flag");
    expect(touche).toBeDefined();
    expect(touche!.effect.kind).toBe("set_public_flag");
    if (touche!.effect.kind === "set_public_flag") {
      expect(touche!.effect.flag).toBe("vex_locked_out_by_locke_exclusivity");
    }
  });

  it("LOCKE_EXCLUSIVE_DEALINGS has lock_out_broker effect", () => {
    const c = getContractTemplate("locke.exclusive_dealings")!;
    const onSigning = clausesAtSigning(c);
    const lockout = onSigning.find(cl => cl.clauseId === "vex_lockout");
    expect(lockout).toBeDefined();
    expect(lockout!.effect.kind).toBe("lock_out_broker");
  });

  it("LOCKE_AUDIT_CLAUSE has minAct: 4 (Insider-band gate)", () => {
    const c = getContractTemplate("locke.audit_clause")!;
    expect(c.minAct).toBe(4);
  });
});

describe("Nilmorg contracts — institutional canon", () => {
  it("Nilmorg contracts have NO hidden clauses (institutional canon)", () => {
    for (const c of NILMORG_CONTRACTS) {
      expect(c.hiddenClauses ?? [], c.contractKey).toEqual([]);
    }
  });

  it("SEVERANCE_PRIZE_BODY_CONTRACT has 3 ceremony-mirroring stages", () => {
    const c = getContractTemplate("severance.prize_body_contract")!;
    expect(c.stages.length).toBe(3);
    expect(c.stages[0]!.stageId).toBe("extraction_witnessed");
    expect(c.stages[1]!.stageId).toBe("container_transit");
    expect(c.stages[2]!.stageId).toBe("delivery_to_recipient");
  });

  it("SEVERANCE_PRIZE_BODY_CONTRACT requires Act 5 minimum", () => {
    const c = getContractTemplate("severance.prize_body_contract")!;
    expect(c.minAct).toBe(5);
  });
});

describe("Degen contracts — aleatory canon", () => {
  it("every Degen contract has at least one aleatory_roll clause", () => {
    for (const c of DEGEN_CONTRACTS) {
      const hasRoll = (c.hiddenClauses ?? []).some(
        (cl) => cl.effect.kind === "aleatory_roll",
      );
      expect(hasRoll, c.contractKey).toBe(true);
    }
  });

  it("Degen contracts have NO cross_reference clauses (style canon)", () => {
    for (const c of DEGEN_CONTRACTS) {
      const hasXref = (c.hiddenClauses ?? []).some(
        (cl) => cl.effect.kind === "cross_reference",
      );
      expect(hasXref, c.contractKey).toBe(false);
    }
  });

  it("aleatory_roll multiplier ranges are valid", () => {
    for (const c of DEGEN_CONTRACTS) {
      for (const cl of c.hiddenClauses ?? []) {
        if (cl.effect.kind === "aleatory_roll") {
          expect(cl.effect.multiplierMin).toBeGreaterThan(0);
          expect(cl.effect.multiplierMax).toBeGreaterThan(cl.effect.multiplierMin);
        }
      }
    }
  });
});

describe("Antiquarian contracts — bibliographic canon", () => {
  it("Antiquarian archive contracts use only cross_reference clauses (no traps)", () => {
    const archiveContracts = ANTIQUARIAN_CONTRACTS.filter(
      (c) => c.metadata?.tier === "archive" || c.metadata?.tier === "forensic",
    );
    expect(archiveContracts.length).toBeGreaterThan(0);
    for (const c of archiveContracts) {
      for (const cl of c.hiddenClauses ?? []) {
        expect(cl.effect.kind, `${c.contractKey}/${cl.clauseId}`).toBe(
          "cross_reference",
        );
      }
    }
  });

  it("every cross_reference points to a real registered contract", () => {
    const allKeys = new Set(allContractKeys());
    for (const c of ANTIQUARIAN_CONTRACTS) {
      for (const cl of c.hiddenClauses ?? []) {
        if (cl.effect.kind === "cross_reference") {
          expect(
            allKeys.has(cl.effect.referencedContractKey),
            `${c.contractKey} references unknown ${cl.effect.referencedContractKey}`,
          ).toBe(true);
        }
      }
    }
  });

  it("Oracle futures sub-family is class-locked metadata", () => {
    const futures = ANTIQUARIAN_CONTRACTS.filter(
      (c) => c.metadata?.tier === "oracle_futures",
    );
    expect(futures.length).toBe(3);
    for (const c of futures) {
      expect(c.metadata?.classLock).toBe("oracle");
      expect(c.firstSigningFlag).toBe("oracle_antiquarian_met");
    }
  });

  it("Oracle futures expose call / put / spread positions exactly once each", () => {
    const futures = ANTIQUARIAN_CONTRACTS.filter(
      (c) => c.metadata?.tier === "oracle_futures",
    );
    const positions = futures.map((c) => c.metadata?.position).sort();
    expect(positions).toEqual(["call", "put", "spread"]);
  });
});

describe("Independent contracts — barter canon", () => {
  it("Independent contracts have ZERO hidden clauses (style canon)", () => {
    for (const c of INDEPENDENT_CONTRACTS) {
      expect(c.hiddenClauses ?? [], c.contractKey).toEqual([]);
    }
  });

  it("Independent contracts declare a volatilityRange in metadata", () => {
    for (const c of INDEPENDENT_CONTRACTS) {
      expect(c.metadata?.volatilityRange, c.contractKey).toBeDefined();
    }
  });
});

describe("Thaloria contracts — ceremony-aware canon", () => {
  it("every Thaloria contract gates on post_arena revealStage", () => {
    for (const c of THALORIA_CONTRACTS) {
      expect(c.requiresRevealStage, c.contractKey).toBe("post_arena");
    }
  });

  it("every Thaloria contract has exactly one ceremonial_audit clause", () => {
    for (const c of THALORIA_CONTRACTS) {
      const ceremonial = (c.hiddenClauses ?? []).filter(
        (cl) => cl.effect.kind === "ceremonial_audit",
      );
      expect(ceremonial.length, c.contractKey).toBe(1);
    }
  });

  it("ceremonial_audit clauses fail on combat-positive completion", () => {
    for (const c of THALORIA_CONTRACTS) {
      for (const cl of c.hiddenClauses ?? []) {
        if (cl.effect.kind === "ceremonial_audit") {
          expect(cl.effect.failsOnCombatPositive).toBe(true);
          expect(cl.effect.trustPenalty).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("validateContractDef — error detection", () => {
  it("flags contract with empty stages", () => {
    const errs = validateContractDef({
      contractKey: "test.empty",
      brokerKey: "broker_locke",
      name: "Empty",
      loreContext: "stub",
      stages: [],
    });
    expect(errs.length).toBeGreaterThan(0);
  });

  it("flags duplicate stageIds", () => {
    const errs = validateContractDef({
      contractKey: "test.dup",
      brokerKey: "broker_locke",
      name: "Dup",
      loreContext: "stub",
      stages: [
        { stageId: "a", label: "A", loreContext: "x", requiredMissionIds: ["m1"] },
        { stageId: "a", label: "A2", loreContext: "x", requiredMissionIds: ["m2"] },
      ],
    });
    expect(errs.find(e => e.includes("duplicate stageId"))).toBeDefined();
  });

  it("flags stage with no requiredMissionIds", () => {
    const errs = validateContractDef({
      contractKey: "test.empty_mids",
      brokerKey: "broker_locke",
      name: "Empty MIDs",
      loreContext: "stub",
      stages: [
        { stageId: "a", label: "A", loreContext: "x", requiredMissionIds: [] },
      ],
    });
    expect(errs.find(e => e.includes("requiredMissionIds"))).toBeDefined();
  });
});
