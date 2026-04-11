/* ═══════════════════════════════════════════════════════
   CREW → DEAD MAN'S CIRCUIT BRIDGE

   Pure mapping from a crew member's genetic stats into
   the iframe race loop's CloneStats shape. Extracted so
   it can be unit-tested without booting the DMC page.

   intellect    → neural_sync     (handling, precision)
   reflexes     → velocity_ceiling (top speed)
   adaptability → surface_grip    (corner grip)
   resilience   → survival_instinct (AI self-preservation)
   health       → physical_integrity (starts 60-100)
   species      → chassis color lookup
   ═══════════════════════════════════════════════════════ */

import type { SerializedCrewMember, CrewSpecies, GeneticStat } from "./crewPersistence";

/**
 * Payload shape expected by the Godot iframe (see
 * games/dead-mans-circuit/autoloads/GameState.gd + WebBridge.gd).
 * Field names MUST match what clone.get(...) reads on the Godot side.
 *
 * Verified against the Godot project on 2026-04-11:
 *   neural_sync          ✓
 *   physical_integrity   ✓
 *   velocity_ceiling     ✓ (NO _pct suffix)
 *   surface_grip         ✓ (NO _pct suffix)
 *   survival_instinct    ✓
 *
 * The old `CloneStats` interface in apps/shared/deadMansCircuit.ts
 * had `_pct` suffixes which the Godot loop silently ignored. This
 * interface is the source of truth for the crew → iframe bridge.
 */
export interface DmcCloneStats {
  designation: string;
  neural_sync: number;
  physical_integrity: number;
  velocity_ceiling: number;
  surface_grip: number;
  survival_instinct: number;
  chassisColor: string;
}

const CHASSIS_COLOR: Record<CrewSpecies, string> = {
  human: "#6a95c4",
  demagi: "#e0643b",
  quarchon: "#a855f7",
  neyon: "#10b981",
  voltari: "#8b5cf6",
  construct: "#64748b",
  abyssal: "#991b1b",
};

export function crewMemberToCloneStats(
  member: Pick<SerializedCrewMember, "stats" | "species" | "health">,
  designation: string,
): DmcCloneStats {
  const stats = member.stats as Record<GeneticStat, number>;
  // Each stat is on a 0-100 scale. Map into the DMC ranges specified in
  // apps/shared/deadMansCircuit.ts CloneStats.
  const neural = Math.max(60, Math.min(100, 60 + Math.round(stats.intellect * 0.4)));
  const velocity = Math.max(80, Math.min(120, 80 + Math.round(stats.reflexes * 0.4)));
  const grip = Math.max(40, Math.min(80, 40 + Math.round(stats.adaptability * 0.4)));
  const survival = Math.max(10, Math.min(40, 10 + Math.round(stats.resilience * 0.3)));
  const integrity = Math.max(60, Math.min(100, member.health));
  return {
    designation,
    neural_sync: neural,
    physical_integrity: integrity,
    velocity_ceiling: velocity,
    surface_grip: grip,
    survival_instinct: survival,
    chassisColor: CHASSIS_COLOR[member.species] ?? "#f87171",
  };
}
