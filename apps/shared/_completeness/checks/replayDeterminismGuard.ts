/**
 * Persistence F1/F2 — replay determinism guard.
 *
 * The highest-stakes determinism contract in the codebase was
 * mechanically unguarded: `engine/version.ts` documents that a MINOR
 * RULES_VERSION bump means "replays need the pinned engine," but
 * `replay/replay.ts` computes `versionCompatible` and then replays
 * unconditionally through the live `reduce`, the server verifier
 * never reads `rulesVersion`, and `replay.test.ts` pins no hash
 * literal. The first MINOR bump (which CLAUDE.md actively expects)
 * would desync every stored replay and report it as tampering, with
 * nothing in CI having warned.
 *
 * This row makes that gap mechanical (the audit's prescribed first
 * step). Declared = the determinism-contract wiring points; each is a
 * single-line probe. Ratcheted: most points are not yet wired, so the
 * row surfaces a tracked (non-failing) gap that can only shrink.
 * Closing F1/F2 = gate execution on `versionCompatible` (or pin
 * engines), have the verifier read `rulesVersion`, and pin a literal
 * final-state hash; the gap then tightens to 0.
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
    name: "version contract declared",
    file: "apps/shared/tcg-core/engine/version.ts",
    pattern:
      /export\s+const\s+RULES_VERSION[\s\S]*export\s+function\s+isReplayCompatible\b/,
    hint: "version.ts must export RULES_VERSION + isReplayCompatible",
  },
  {
    name: "replay execution gated on versionCompatible",
    file: "apps/shared/tcg-core/replay/replay.ts",
    // The computed boolean must actually branch behaviour — an
    // explicit guard, not just a returned-but-unused field.
    pattern: /if\s*\(\s*!\s*versionCompatible\s*\)/,
    hint: "gate the reduce path on !versionCompatible (archived/action-log-only mode) instead of replaying unconditionally",
  },
  {
    name: "server verifier reads rulesVersion",
    file: "apps/server/services/replayVerification.ts",
    // Currently `rulesVersion` appears only in a docstring; require a
    // real code reference (a field read or a compatibility call).
    pattern: /\.rulesVersion\b|isReplayCompatible\s*\(/,
    hint: "verifyReplay must read the row's rulesVersion and branch (a version-mismatch is NOT the tampering/hash-mismatch signal)",
  },
  {
    name: "replay.test.ts pins a literal final-state hash",
    file: "apps/shared/tcg-core/replay/replay.test.ts",
    // Matches either an inline `expect(...finalStateHash).toBe("<hex>")`
    // or a pinned-hash constant tied to the final state.
    pattern:
      /(?:finalStateHash[\s\S]{0,200}?\b(?:toBe|toEqual)\(\s*["'][0-9a-f]{12,}["']|FINAL_STATE_HASH\s*=\s*["'][0-9a-f]{12,}["'])/,
    hint: "assert finalStateHash against a pinned hex literal so a reduce() semantics change fails CI; re-pinning the literal IS the deliberate version-bump review gate",
  },
];

export function checkReplayDeterminismGuard(): RawParityCount {
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
