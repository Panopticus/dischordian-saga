/* ═══════════════════════════════════════════════════════
   BEAT C WORKBENCH HOTSPOTS — engineering crew-role choice

   Three tool-stations inset into the Engineer's workbench
   in the engineering room backdrop. Each station is the
   diegetic anchor for one of the three crew-role choices
   (Engineer / Assassin / Oracle) driven by
   BeatCCrewRoleChoice.tsx.

   Positions match the room-engineering.txt prompt: three
   stations evenly spaced across the workbench's forward
   edge at 30% / 50% / 70% left, 62% top.

   Each pod in the foreground incubator arc sight-lines
   directly to its station — the pod's activate-glow fires
   in sympathy when the station is hovered.
   ═══════════════════════════════════════════════════════ */

import type { PreludeAnchorColor } from "./preludeRoomAnchors";

export type CrewRole = "engineer" | "assassin" | "oracle";

export interface BeatCWorkbenchHotspot {
  id: string;
  role: CrewRole;
  displayName: string;
  label: string;
  /** Position of the station's pip on the workbench. */
  position: { leftPct: number; topPct: number };
  /** Position of the matched foreground pod (sight-line pair). */
  podPosition: { leftPct: number; topPct: number };
  color: PreludeAnchorColor;
  /** Flag raised on commit. Kept in sync with BeatCCrewRoleChoice. */
  commitFlag: string;
}

export const BEAT_C_WORKBENCH_HOTSPOTS: readonly BeatCWorkbenchHotspot[] = [
  {
    id: "beat_c_engineer_station",
    role: "engineer",
    displayName: "Engineer Station",
    label: "Commit to the Engineer station",
    position: { leftPct: 30, topPct: 62 },
    podPosition: { leftPct: 28, topPct: 82 },
    color: "green",
    commitFlag: "prelude_crew_role_engineer_picked",
  },
  {
    id: "beat_c_assassin_station",
    role: "assassin",
    displayName: "Assassin Station",
    label: "Commit to the Assassin station",
    position: { leftPct: 50, topPct: 62 },
    podPosition: { leftPct: 50, topPct: 82 },
    color: "cyan",
    commitFlag: "prelude_crew_role_assassin_picked",
  },
  {
    id: "beat_c_oracle_station",
    role: "oracle",
    displayName: "Oracle Station",
    label: "Commit to the Oracle station",
    position: { leftPct: 70, topPct: 62 },
    podPosition: { leftPct: 72, topPct: 82 },
    color: "amber",
    commitFlag: "prelude_crew_role_oracle_picked",
  },
];

export function getBeatCHotspotByRole(
  role: CrewRole,
): BeatCWorkbenchHotspot | undefined {
  return BEAT_C_WORKBENCH_HOTSPOTS.find((h) => h.role === role);
}
