/**
 * Loredex per-member carry wiring parity check.
 *
 * Declared: every loredex_entry_discovered emit site must route the
 * event through crewLoredexCarryService — the carry table is what
 * makes member-death stamp memorialAtCycle on the unread entries.
 *
 * Implemented: each emit site listed below must (a) emit
 * "loredex_entry_discovered" and (b) the rippleEngine has a handler
 * that calls crewLoredexCarryService.recordDiscovery (proven by
 * grepping for "pickActiveCarrier" / "recordDiscovery" in the engine).
 *
 * Hard parity — missing any wiring means the dead can't take
 * unread knowledge with them.
 */
import type { RawParityCount } from "../types";
import { readFile } from "fs/promises";
import { resolve } from "path";

const EMIT_SITES = [
  "apps/server/routers/loreJournal.ts",
  "apps/server/services/rippleEngine.ts",
  "apps/shared/songSlideshow.ts",
  "apps/shared/silenceInHeavenShow.ts",
];

export async function checkLoredexMemberCarryWired(): Promise<RawParityCount> {
  const missing: string[] = [];
  let implemented = 0;

  // First, prove the rippleEngine wires recordDiscovery on the
  // loredex_entry_discovered handler.
  try {
    const ripple = await readFile(
      resolve(process.cwd(), "apps/server/services/rippleEngine.ts"),
      "utf8",
    );
    const wired =
      ripple.includes("loredex_entry_discovered") &&
      ripple.includes("recordDiscovery");
    if (!wired) missing.push("rippleEngine.ts (carry handler missing)");
  } catch {
    missing.push("rippleEngine.ts (not found)");
  }

  // Then, every emit site must mention the event id (proves it's an
  // active emitter that the carry handler will pick up).
  for (const path of EMIT_SITES) {
    try {
      const content = await readFile(resolve(process.cwd(), path), "utf8");
      if (
        content.includes("loredex_entry_discovered") ||
        content.includes("LoredexDiscoveryEvent")
      ) {
        implemented++;
      } else {
        // Not every file in the list emits; skipping is acceptable
        // here since we count emitters, not just imports. Mark missing
        // so the gate surfaces.
        missing.push(`${path} (no loredex_entry_discovered emit)`);
      }
    } catch {
      missing.push(`${path} (not found)`);
    }
  }
  return { declared: EMIT_SITES.length, implemented, missing };
}
