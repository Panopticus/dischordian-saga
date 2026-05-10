/**
 * Apprentice Mechronis Audit coverage parity check.
 *
 * Declared surface: 12 archetypes × 3 audit days = 36 cells. Each cell
 * is "implemented" only if its archetypeFlavor entry is non-empty (≥ 10
 * characters) and the AUDIT_PROMPTS table has all three audit days
 * authored with non-empty question + complianceTemplate.
 *
 * Hard parity — every archetype must have an authored answer at every
 * audit day. The audit pipeline blocks on missing flavor (would render
 * the placeholder "[archetype] said nothing.").
 */
import type { RawParityCount } from "../types";

export async function checkApprenticeAuditCoverage(): Promise<RawParityCount> {
  const mod = await import("../../apprenticeMechronisAudits");
  const cells = mod.archetypeAuditCoverage();

  // Also verify the three prompts themselves are well-formed.
  const prompts = mod.AUDIT_PROMPTS;
  const days = mod.allAuditDays();

  const missing: string[] = [];
  let implemented = 0;

  for (const day of days) {
    const p = prompts[day];
    if (!p || !p.question || p.question.length < 20) {
      missing.push(`audit day ${day}: missing/short question`);
    }
    if (!p || !p.complianceTemplate || p.complianceTemplate.length < 20) {
      missing.push(`audit day ${day}: missing/short complianceTemplate`);
    }
  }

  for (const cell of cells) {
    if (cell.authored) {
      implemented += 1;
    } else {
      missing.push(`${cell.archetype} × M-${cell.day}: missing flavor`);
    }
  }

  return {
    declared: cells.length, // 12 × 3 = 36
    implemented,
    missing,
  };
}
