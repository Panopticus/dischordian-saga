/**
 * Structural tests for ContractSigningModal — Phase 2.4.
 *
 * Verifies the modal imports the canonical contract types,
 * wires the canonical signContract mutation, surfaces hidden
 * clauses on audit, and forwards the audit-stance flag per
 * Locke canon §1.4 (audit-on-signing canonically propagates).
 *
 * Source-scan style matches other Trade Empire / Act 2
 * component tests in this directory.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "ContractSigningModal.tsx"),
  "utf-8",
);

describe("ContractSigningModal — canonical imports", () => {
  it("imports canonical ContractDef + clausesAtSigning from shared", () => {
    expect(src).toContain("ContractDef");
    expect(src).toContain("clausesAtSigning");
    expect(src).toContain('from "@shared/tradeEmpire/contracts"');
  });

  it("imports canonical signContract mutation via trpc.tradeEmpire", () => {
    expect(src).toContain("trpc.tradeEmpire.signContract.useMutation");
  });
});

describe("ContractSigningModal — canonical-audit-stance propagation", () => {
  it("forwards auditedOnSigning per Locke canon §1.4", () => {
    expect(src).toContain("auditedOnSigning: audited");
  });

  it("surfaces canonical on-signing clauses when audited=true", () => {
    expect(src).toContain("audited && onSigningClauses.length > 0");
  });

  it("warns of canonically-hidden clauses when audited=false", () => {
    expect(src).toContain("!audited");
    expect(src).toContain("hidden");
  });
});

describe("ContractSigningModal — canonical-stage rendering", () => {
  it("iterates contract.stages canonically (in template order)", () => {
    expect(src).toContain("contract.stages.map");
  });

  it("renders canonical stage objective when present", () => {
    expect(src).toContain("stage.objective");
  });
});

describe("ContractSigningModal — canonical-broker stamp", () => {
  it("renders canonical brokerKey stamp", () => {
    expect(src).toContain("contract.brokerKey");
  });
});

describe("ContractSigningModal — canonical-completion callback", () => {
  it("calls onSigned with contractId + audit-stance after success", () => {
    expect(src).toContain("onSigned?.(result.contractId");
    expect(src).toContain(", audited)");
  });

  it("closes the modal after successful signing", () => {
    expect(src).toContain("onClose();");
  });
});
