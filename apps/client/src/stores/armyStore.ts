/* ═══════════════════════════════════════════════════════
   ARMY STORE (Zustand)

   Recruited units, deployments, completed missions, and
   sector control (AC Brotherhood-style army management).
   Migration target for state.armyUnits / state.armyDeployments /
   state.armyCompletedDeployments / state.armySectors /
   state.armyRecruitmentMissionsCompleted and related counters.

   Use `useArmyStore(s => s.units)` to subscribe to just
   the unit roster — component will not re-render when
   deployments or sectors change.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── RE-EXPORTED TYPES (originally in GameContext) ─── */

export type ArmyUnitType = "operative" | "dreamer" | "engineer" | "insurgent" | "diplomat";
export type ArmyUnitRank = "recruit" | "veteran" | "elite" | "commander";

export interface ArmyUnit {
  id: string;
  name: string;
  type: ArmyUnitType;
  rank: ArmyUnitRank;
  level: number;
  xp: number;
  sector: string;
  specialization: string;
  successRate: number;
  recruitedAt: number;
  deployed: boolean;
}

export interface ArmyDeployment {
  id: string;
  missionId: string;
  missionName: string;
  missionType: "daily" | "weekly" | "event" | "recruitment";
  unitIds: string[];
  startedAt: number;
  durationMs: number;
  successChance: number;
  sector: string;
  rewards: { type: string; amount: number }[];
}

export interface CompletedDeployment {
  id: string;
  missionId: string;
  missionName: string;
  success: boolean;
  unitIds: string[];
  completedAt: number;
  rewards?: { type: string; amount: number }[];
  report: string;
  reportSpeaker: "elara" | "human" | "system";
}

export interface SectorControl {
  sectorId: string;
  controlLevel: number;
  unitsStationed: number;
  income: number;
  threatLevel: number;
  discovered: boolean;
}

interface ArmyStore {
  /** All recruited units */
  units: ArmyUnit[];
  /** Active deployments */
  deployments: ArmyDeployment[];
  /** Finished deployments */
  completedDeployments: CompletedDeployment[];
  /** Sector control state */
  sectors: Record<string, SectorControl>;
  /** Recruitment mission IDs completed */
  recruitmentMissionsCompleted: string[];
  /** Lifetime counters */
  totalMissionsDeployed: number;
  totalMissionsSucceeded: number;
  totalMissionsFailed: number;

  // Actions
  recruitUnit: (unit: ArmyUnit) => void;
  deployUnits: (deployment: ArmyDeployment) => void;
  completeDeployment: (
    deploymentId: string,
    success: boolean,
    report: string,
    reportSpeaker: "elara" | "human" | "system",
    rewards?: { type: string; amount: number }[],
  ) => void;
  updateSectorControl: (sectorId: string, updates: Partial<SectorControl>) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  units: [] as ArmyUnit[],
  deployments: [] as ArmyDeployment[],
  completedDeployments: [] as CompletedDeployment[],
  sectors: {} as Record<string, SectorControl>,
  recruitmentMissionsCompleted: [] as string[],
  totalMissionsDeployed: 0,
  totalMissionsSucceeded: 0,
  totalMissionsFailed: 0,
};

export const useArmyStore = create<ArmyStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      recruitUnit: (unit) => set((state) => {
        // Tier 4D: fire the Kael's-lineage first-recruit cross-game
        // beat on the very first unit ever recruited. The helper is
        // session-idempotent and silent-fail; narrative flow is not
        // affected. Imported lazily to avoid pulling tRPC into the
        // store module's module-init path.
        if (state.units.length === 0) {
          void (async () => {
            const { fireCrossGameBeat } = await import("@/lib/crossGameBeats");
            void fireCrossGameBeat("kaels_lineage_return_loredex_first_recruit");
          })();
        }
        return {
          units: [...state.units, unit],
        };
      }),

      deployUnits: (deployment) => set((state) => ({
        units: state.units.map((u) =>
          deployment.unitIds.includes(u.id) ? { ...u, deployed: true } : u,
        ),
        deployments: [...state.deployments, deployment],
        totalMissionsDeployed: state.totalMissionsDeployed + 1,
      })),

      completeDeployment: (deploymentId, success, report, reportSpeaker, rewards) =>
        set((state) => {
          const deployment = state.deployments.find((d) => d.id === deploymentId);
          if (!deployment) return state;
          const completed: CompletedDeployment = {
            id: deploymentId,
            missionId: deployment.missionId,
            missionName: deployment.missionName,
            success,
            unitIds: deployment.unitIds,
            completedAt: Date.now(),
            rewards: success ? rewards : undefined,
            report,
            reportSpeaker,
          };
          const updatedUnits = state.units.map((u) => {
            if (!deployment.unitIds.includes(u.id)) return u;
            const xpGain = success ? 25 : 5;
            const newXp = u.xp + xpGain;
            const levelUp = newXp >= u.level * 100;
            return {
              ...u,
              deployed: false,
              xp: levelUp ? newXp - u.level * 100 : newXp,
              level: levelUp ? Math.min(10, u.level + 1) : u.level,
              rank: levelUp && u.level >= 3
                ? (u.level >= 7
                  ? "commander" as const
                  : u.level >= 5
                    ? "elite" as const
                    : "veteran" as const)
                : u.rank,
              successRate: Math.min(95, u.successRate + (success ? 2 : 0)),
            };
          });
          return {
            units: updatedUnits,
            deployments: state.deployments.filter((d) => d.id !== deploymentId),
            completedDeployments: [...state.completedDeployments, completed],
            totalMissionsSucceeded: state.totalMissionsSucceeded + (success ? 1 : 0),
            totalMissionsFailed: state.totalMissionsFailed + (success ? 0 : 1),
          };
        }),

      updateSectorControl: (sectorId, updates) => set((state) => ({
        sectors: {
          ...state.sectors,
          [sectorId]: { ...state.sectors[sectorId], ...updates } as SectorControl,
        },
      })),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "dischordian-army",
      version: 1,
    },
  ),
);

/* ─── SELECTORS (for slice-level subscriptions) ─── */

export const selectUnits = (s: ArmyStore) => s.units;
export const selectAvailableUnits = (s: ArmyStore) => s.units.filter((u) => !u.deployed);
export const selectDeployments = (s: ArmyStore) => s.deployments;
export const selectCompletedDeployments = (s: ArmyStore) => s.completedDeployments;
export const selectSectors = (s: ArmyStore) => s.sectors;
export const selectTotalDeployed = (s: ArmyStore) => s.totalMissionsDeployed;
export const selectSuccessRate = (s: ArmyStore) =>
  s.totalMissionsDeployed === 0
    ? 0
    : Math.round((s.totalMissionsSucceeded / s.totalMissionsDeployed) * 100);
export const selectUnitCount = (s: ArmyStore) => s.units.length;
