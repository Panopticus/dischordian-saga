/**
 * Apprentice Doctrine coverage parity check.
 *
 * Declared surface: the 5 DoctrineId values in apprenticeDoctrines.ts.
 * Each doctrine is "implemented" only if every authoring slot is
 * populated:
 *   - present in the DOCTRINES record
 *   - has ≥ 4 stanzas (one per recitedAt beat used in the system —
 *     morning, before_combat / before_audit / after_loss is optional,
 *     at_graduation is required)
 *   - has a non-empty resonantArchetypes list
 *   - has at least one permittedRole (companion is the universal
 *     default; doctrines that gate it down to zero would be a bug)
 *   - all stanza lines are ≥ 30 characters (no stub placeholders)
 *
 * Hard parity — the system needs every doctrine fully authored to
 * function (the doctrine picker UI shows all five).
 */
import type { RawParityCount } from "../types";

export async function checkApprenticeDoctrineCoverage(): Promise<RawParityCount> {
  const mod = await import("../../apprenticeDoctrines");
  const doctrines = mod.DOCTRINES;
  const ids = Object.keys(doctrines) as Array<keyof typeof doctrines>;

  const missing: string[] = [];
  let implemented = 0;

  for (const id of ids) {
    const d = doctrines[id];
    const reasons: string[] = [];
    if (!d.stanzas || d.stanzas.length < 4) reasons.push(`< 4 stanzas (${d.stanzas?.length ?? 0})`);
    if (!d.stanzas.some(s => s.recitedAt === "morning")) reasons.push("no morning stanza");
    if (!d.stanzas.some(s => s.recitedAt === "at_graduation")) reasons.push("no graduation stanza");
    if (!d.resonantArchetypes || d.resonantArchetypes.length === 0) reasons.push("no resonant archetypes");
    if (!d.permittedRoles || d.permittedRoles.size === 0) reasons.push("no permitted roles");
    if (d.stanzas.some(s => s.line.length < 30)) reasons.push("stub stanza < 30 chars");
    if (!d.signatureColorBand) reasons.push("no signature color band");
    if (!d.signatureMotif) reasons.push("no signature motif");

    if (reasons.length === 0) {
      implemented += 1;
    } else {
      missing.push(`${id}: ${reasons.join(", ")}`);
    }
  }

  return {
    declared: ids.length,
    implemented,
    missing,
  };
}
