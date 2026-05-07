/**
 * H6 — Per-procedure rate-limit parity check.
 *
 * Plan §H6: a tRPC middleware factory + decoration on the four
 * highest-abuse-risk procedures. This gate proves both sides
 * (factory + decorations) survive refactors.
 *
 * Each probe is a single-line grep. Adding a new high-risk
 * procedure to the list means appending a probe here AND
 * decorating the procedure — out-of-sync state fails the gate.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface Probe {
  name: string;
  file: string;
  pattern: RegExp;
  hint: string;
}

const PROBES: ReadonlyArray<Probe> = [
  {
    name: "procedureRateLimit factory exists",
    file: "apps/server/_core/procedureRateLimit.ts",
    pattern: /export\s+function\s+procedureRateLimit\b/,
    hint: "create apps/server/_core/procedureRateLimit.ts exporting procedureRateLimit({ windowMs, max })",
  },
  {
    name: "store.createCheckout rate-limited",
    file: "apps/server/routers/store.ts",
    // Look for procedureRateLimit on the createCheckout chain.
    pattern: /createCheckout:[\s\S]{0,400}?procedureRateLimit\(/,
    hint: "decorate `createCheckout` with `.use(procedureRateLimit({ windowMs: 300_000, max: 2 }))`",
  },
  {
    name: "cardGame.createDeck rate-limited",
    file: "apps/server/routers/cardGame.ts",
    pattern: /createDeck:[\s\S]{0,400}?procedureRateLimit\(/,
    hint: "decorate `createDeck` with `.use(procedureRateLimit({ windowMs: 600_000, max: 10 }))`",
  },
  {
    name: "cardGame.updateDeck rate-limited",
    file: "apps/server/routers/cardGame.ts",
    pattern: /updateDeck:[\s\S]{0,400}?procedureRateLimit\(/,
    hint: "decorate `updateDeck` with `.use(procedureRateLimit({ windowMs: 60_000, max: 30 }))`",
  },
  {
    name: "account.acceptAgreement rate-limited",
    file: "apps/server/routers/account.ts",
    pattern: /acceptAgreement:[\s\S]{0,400}?procedureRateLimit\(/,
    hint: "decorate `acceptAgreement` with `.use(procedureRateLimit({ windowMs: 3_600_000, max: 5 }))`",
  },
];

export function checkProcedureRateLimits(): RawParityCount {
  const missing: string[] = [];
  for (const probe of PROBES) {
    const abs = path.join(REPO_ROOT, probe.file);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!probe.pattern.test(src)) {
      missing.push(`${probe.name} — ${probe.hint} (${probe.file})`);
    }
  }
  return {
    declared: PROBES.length,
    implemented: PROBES.length - missing.length,
    missing,
  };
}
