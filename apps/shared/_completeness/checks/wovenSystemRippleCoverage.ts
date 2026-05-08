/**
 * Two-Ripple Rule parity check.
 *
 * For every `WovenSystem.primaryEmits` event, scan
 * `apps/server/services/rippleEngine.ts` for cross-system handler
 * registrations carrying a `// woven: <fromId> -> <toId>` comment whose
 * `toId !== fromId`. The Two-Ripple Rule requires at least two such
 * cross-system consumers per declared emit.
 *
 * Ratcheted: lands at the current gap and tightens as ripple-engine
 * wiring catches up to the registry. The end state is gap === 0
 * (every declared emit has ≥ 2 cross-system handlers).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import { WOVEN_SYSTEMS } from "../../wovenSystems/registry";
import type { WovenSystemId } from "../../wovenSystems/types";
import type { RawParityCount } from "../types";

const RIPPLE_ENGINE_PATH = path.join(
  REPO_ROOT,
  "apps/server/services/rippleEngine.ts",
);

/**
 * Match a `// woven: <fromId> -> <toId>` marker, with flexible
 * whitespace. Returns [fromId, toId] tuples in source order.
 */
function extractWovenMarkers(src: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const re = /\/\/\s*woven:\s*([a-z_]+)\s*->\s*([a-z_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    out.push([m[1], m[2]]);
  }
  return out;
}

/**
 * For an emit event name, count cross-system consumers — handler
 * registrations whose preceding `// woven:` marker has a `toId`
 * different from `fromId`.
 *
 * The match is positional: a `// woven: a -> b` line that appears
 * within a window of 4 source lines before a handler-registration
 * line referencing `eventName` is taken as wiring that handler.
 *
 * "Handler-registration line" = any line containing the eventName
 * literal *and* one of the wiring tokens (`on(`, `wovenOn(`, or a
 * `case "<event>"` switch arm). The window-search keeps the check
 * resilient to formatting.
 */
function countCrossSystemConsumers(
  src: string,
  eventName: string,
  emittingSystem: WovenSystemId,
): number {
  const lines = src.split("\n");
  let count = 0;
  const eventLiteral = `"${eventName}"`;
  const altEventLiteral = `'${eventName}'`;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mentionsEvent =
      line.includes(eventLiteral) || line.includes(altEventLiteral);
    if (!mentionsEvent) continue;
    const isWiring =
      /\bwovenOn\s*\(/.test(line) ||
      /\bon\s*\(/.test(line) ||
      /case\s+["'][a-z_]+["']/.test(line);
    if (!isWiring) continue;
    // Look back up to 4 lines for the marker.
    for (let j = Math.max(0, i - 4); j <= i; j++) {
      const mk = /\/\/\s*woven:\s*([a-z_]+)\s*->\s*([a-z_]+)/.exec(lines[j]);
      if (mk && mk[1] === emittingSystem && mk[2] !== emittingSystem) {
        count++;
        break;
      }
    }
  }
  return count;
}

export function checkWovenSystemRippleCoverage(): RawParityCount {
  const src = fs.existsSync(RIPPLE_ENGINE_PATH)
    ? fs.readFileSync(RIPPLE_ENGINE_PATH, "utf-8")
    : "";

  // Dedup global emit list — some events are shared across registry
  // rows (e.g. `seal_broken` is consumed by many but emitted by the
  // sealStateService, not declared as a system emit here).
  const declared: Array<{
    eventName: string;
    fromSystem: WovenSystemId;
  }> = [];
  for (const sys of WOVEN_SYSTEMS) {
    for (const ev of sys.primaryEmits) {
      declared.push({ eventName: ev, fromSystem: sys.id });
    }
  }

  const missing: string[] = [];
  let implementedCount = 0;
  for (const d of declared) {
    const consumers = countCrossSystemConsumers(
      src,
      d.eventName,
      d.fromSystem,
    );
    if (consumers >= 2) {
      implementedCount++;
    } else {
      missing.push(
        `${d.fromSystem}/${d.eventName}: ${consumers}/2 cross-system consumer(s) wired in rippleEngine.ts`,
      );
    }
  }

  // Verify the helper itself is present once it lands. Until then the
  // gate just counts marker comments — keeping the check honest.
  const hasHelper = /\bfunction\s+wovenOn\b|\bconst\s+wovenOn\b|\bexport\s+function\s+wovenOn\b/.test(
    src,
  );
  if (!hasHelper) {
    missing.push(
      "rippleEngine.ts: wovenOn(event, fromId, toId, handler) helper not yet defined — markers are valid without it but the helper closes the audit loop.",
    );
  }
  // "+1 declared" for the helper line so the ceiling tightens when
  // wovenOn lands.
  return {
    declared: declared.length + 1,
    implemented: implementedCount + (hasHelper ? 1 : 0),
    missing,
  };
}
