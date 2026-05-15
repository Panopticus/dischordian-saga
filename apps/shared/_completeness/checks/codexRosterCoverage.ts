/**
 * Phase H — Codex roster coverage parity check.
 *
 * The Codex's `loreData.ts:ARCHONS` and `loreData.ts:NEYONS`
 * exports are the client-side rendering surface for the
 * Twelve Archons + Twelve Ne-Yons. They are PARALLEL to the
 * authoritative canon registries (`apps/shared/archonCanon.ts:
 * ARCHONS` and `apps/shared/neYonCanon.ts:NE_YONS`) and must
 * stay in numerical-position parity with them.
 *
 * PR-9 reconciled the drift this gate guards against:
 * `loreData.ts` had CoNexus at A1 / Watcher at A2 / Vortex
 * at A4 / Game Master at A9 / Necromancer at A10 (and
 * "engineer_archon" at A11 — not in canon at all), while
 * the registry has Architect A1 / CoNexus A2 / Watcher A4 /
 * Vortex A9 / Game Master A10 / Necromancer A11 / Human A12.
 *
 * The gate enforces: every position 1-12 in the registry
 * appears with the same `id` in `loreData.ts`. Hard parity.
 * No ratchet — drift here means the Codex renders canon
 * incorrectly, which is a player-facing bug.
 *
 * Note: the `id` strings DIFFER between the two surfaces
 * (`the_architect` vs `architect`, etc.) because the
 * registry uses snake_case-with-the-prefix and loreData
 * uses bare snake_case. This check compares by NAME-equality
 * (case-insensitive trimmed), which is robust to that
 * divergence.
 */
import { ARCHONS as CANON_ARCHONS } from "../../archonCanon";
import { NE_YONS as CANON_NEYONS } from "../../neYonCanon";
// Note: loreData lives in apps/client/, but the parity
// check imports from it via relative path because the
// gate is a build-time invariant.
import { ARCHONS as CODEX_ARCHONS, NEYONS as CODEX_NEYONS } from "../../../client/src/game/loreData";
import type { RawParityCount } from "../types";

function normalize(s: string): string {
  // Strip leading "the ", strip parenthetical aliases like "(Malkia Ukweli)",
  // and lowercase-trim. Robust to display-name variations between the
  // canon registry and the Codex's display surface.
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/^\s*the\s+/, "")
    .trim();
}

export function checkCodexRosterCoverage(): RawParityCount {
  const declared = 24; // 12 Archons + 12 Ne-Yons

  const missing: string[] = [];
  let implemented = 0;

  // Archon parity: every canon position 1-12 must have a
  // loreData entry with the same normalized name.
  for (const archon of CANON_ARCHONS) {
    if (archon.position == null) {
      missing.push(`canon Archon '${archon.name}' has no position — registry incomplete`);
      continue;
    }
    const codex = CODEX_ARCHONS.find((c) => c.number === archon.position);
    if (!codex) {
      missing.push(`Codex Archon position ${archon.position} (${archon.name}) is missing in apps/client/src/game/loreData.ts:ARCHONS`);
      continue;
    }
    if (normalize(codex.name) !== normalize(archon.name)) {
      missing.push(
        `Codex Archon at position ${archon.position} is '${codex.name}' but canon says '${archon.name}' — drift in apps/client/src/game/loreData.ts`,
      );
      continue;
    }
    implemented += 1;
  }

  // Ne-Yon parity: Codex array index + 1 = position (since
  // NeyonDef has no explicit `number` field). The canon
  // registry has a `position` field.
  for (const neyon of CANON_NEYONS) {
    if (neyon.position == null) {
      missing.push(`canon Ne-Yon '${neyon.name}' has no position — registry incomplete`);
      continue;
    }
    const codex = CODEX_NEYONS[neyon.position - 1];
    if (!codex) {
      missing.push(`Codex Ne-Yon position ${neyon.position} (${neyon.name}) is missing in apps/client/src/game/loreData.ts:NEYONS`);
      continue;
    }
    if (normalize(codex.name) !== normalize(neyon.name)) {
      missing.push(
        `Codex Ne-Yon at position ${neyon.position} is '${codex.name}' but canon says '${neyon.name}' — drift in apps/client/src/game/loreData.ts`,
      );
      continue;
    }
    implemented += 1;
  }

  return { declared, implemented, missing };
}
