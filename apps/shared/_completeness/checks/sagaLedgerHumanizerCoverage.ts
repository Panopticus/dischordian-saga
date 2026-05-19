/**
 * "Your Saga" ledger humanizer coverage.
 *
 * The saga ledger turns the durable ripple_events trail into a
 * readable, second-person story. A persisted consequence whose
 * eventType has no humanizer would render as a raw machine code
 * ("combat_death") or be silently dropped — a hollow ledger that
 * looks complete but loses the player's history.
 *
 * Declared  = every distinct ripple.emit("<type>") string emitted
 *             anywhere under apps/server (the real producer set,
 *             scanned from source — not a hand-maintained list that
 *             can drift).
 * Implemented = those present as a key in SAGA_EVENT_HUMANIZERS in
 *             sagaLedgerService.ts.
 *
 * Hard parity: a new ripple emit without a saga line fails the gate
 * in the same change, exactly the information-asymmetry contract the
 * ship gate exists for.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const SERVER_DIR = path.join(REPO_ROOT, "apps/server");
const SERVICE = path.join(
  REPO_ROOT,
  "apps/server/services/sagaLedgerService.ts",
);

function walkTs(dir: string, out: string[]): void {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules") walkTs(full, out);
    } else if (
      e.name.endsWith(".ts") &&
      !e.name.endsWith(".test.ts") &&
      !e.name.endsWith(".d.ts")
    ) {
      out.push(full);
    }
  }
}

export function checkSagaLedgerHumanizerCoverage(): RawParityCount {
  const declared = new Set<string>();
  const files: string[] = [];
  if (fs.existsSync(SERVER_DIR)) walkTs(SERVER_DIR, files);
  const emitRe = /ripple\.emit\(\s*["']([a-z_]+)["']/g;
  for (const f of files) {
    const src = fs.readFileSync(f, "utf-8");
    let m: RegExpExecArray | null;
    while ((m = emitRe.exec(src)) !== null) declared.add(m[1]);
  }

  const covered = new Set<string>();
  if (fs.existsSync(SERVICE)) {
    const svc = fs.readFileSync(SERVICE, "utf-8");
    const start = svc.indexOf("SAGA_EVENT_HUMANIZERS");
    const block = start >= 0 ? svc.slice(start) : "";
    // Keys are `identifier:` at the head of an entry in the map.
    for (const m of block.matchAll(/(?:^|\n)\s*([a-z_]+)\s*:\s*\(/g)) {
      covered.add(m[1]);
    }
  }

  const missing: string[] = [];
  let implemented = 0;
  for (const t of [...declared].sort()) {
    if (covered.has(t)) implemented++;
    else missing.push(`ripple "${t}" emitted but no SAGA_EVENT_HUMANIZER`);
  }

  return { declared: declared.size, implemented, missing };
}
