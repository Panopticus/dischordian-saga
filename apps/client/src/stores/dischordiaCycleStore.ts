/* ═══════════════════════════════════════════════════════
   DISCHORDIA CYCLE STORE (Zustand) — §3 Light/Dark meter.

   Holds the galactic Light/Dark/Vortex cycle state, wrapping
   the pure functions in shared/dischordiaCycle.ts. This lets
   client code apply energy gains without ever touching the
   cycle internals directly.

   For now the state is CLIENT-LOCAL. The proposal describes
   a community-wide meter, but until the server-side
   equivalent of `server/necromancerCycle.ts` exists, this
   store is the single source of truth for the player's
   local view of the galaxy's bulb.

   Usage:
     // In a React component:
     const phase = useDischordiaCycleStore((s) => s.state.phase);

     // From any code path (a card battle resolver, a slideshow
     // completion handler, etc.):
     useDischordiaCycleStore.getState().applyEnergy("card_battle_light_win");

     // Or via the convenience helper:
     applyDischordiaEnergy("two_witnesses_forgive");
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import {
  applyEnergyGain,
  clampProximity,
  DEFAULT_DISCHORDIA_CYCLE_STATE,
  recomputeDerived,
  shouldTriggerVortexAdvance,
  triggerReclamation,
  triggerVortexAdvance,
  type DischordiaCycleState,
  type DischordiaPhase,
  type EnergyGainActionId,
} from "@shared/dischordiaCycle";

/* ─── SERVER SYNC (§3 community meter) ─── */

/**
 * Fire-and-forget server write-through. Mirrors the pattern
 * from client/src/lib/settingsSync.ts — a module-level tRPC
 * utils reference is set once at app mount, then every
 * `applyEnergy` call triggers a best-effort server mutation
 * on top of the local state update.
 *
 * Tests and SSR skip this path entirely because the utils
 * reference is null.
 */
type DischordiaSyncUtils = {
  client: {
    dischordiaCycle: {
      applyEnergy: {
        mutate: (input: { actionId: string }) => Promise<unknown>;
      };
      getState: {
        query: () => Promise<DischordiaCycleState>;
      };
    };
  };
};

let syncUtils: DischordiaSyncUtils | null = null;

/**
 * Initialize the client sync layer. Called once from a React
 * component that has access to `trpc.useUtils()` — typically
 * `<DischordiaCycleSync />` mounted near the app root.
 */
export function initDischordiaSync(utils: DischordiaSyncUtils | null): void {
  syncUtils = utils;
}

/**
 * Hydrate the local store from the server's current community
 * meter. Called on app mount after the user is authenticated
 * (or anonymously — the tRPC query is public).
 */
export async function hydrateDischordiaFromServer(): Promise<void> {
  if (!syncUtils) return;
  try {
    const state = await syncUtils.client.dischordiaCycle.getState.query();
    useDischordiaCycleStore.setState({ state });
  } catch (err) {
    // Fail-quiet — hydration is best-effort. The local store
    // retains its default state if the server is unreachable.
    console.warn("[DischordiaCycle] hydrate failed:", err);
  }
}

interface DischordiaCycleStore {
  state: DischordiaCycleState;

  /** Apply a row from ENERGY_GAIN_TABLE and recompute derived fields. */
  applyEnergy: (actionId: EnergyGainActionId) => void;
  /**
   * Apply a raw light/dark/vortex delta bypassing the gain table.
   * Useful for slideshow rewards, reclamation bonuses, and any
   * one-off adjustment the spec covers separately.
   */
  applyRawDelta: (delta: {
    light?: number;
    dark?: number;
    vortex?: number;
  }) => void;
  /** Force a specific phase (used by community triggers). */
  setPhase: (phase: DischordiaPhase) => void;
  /** Trigger the Vortex Advance community event. */
  triggerVortexAdvance: () => void;
  /** Trigger the Reclamation community event. */
  triggerReclamation: () => void;
  /**
   * Check whether `shouldTriggerVortexAdvance` fires given the
   * current lit-sector ratio. Returns true if the caller SHOULD
   * then call `triggerVortexAdvance()`. The store does not fire
   * this itself because the lit ratio lives in the Trade Empire
   * state which this store does not own.
   */
  checkVortexTrigger: (litSectorRatio: number) => boolean;
  /** Reset to defaults. */
  reset: () => void;
}

export const useDischordiaCycleStore = create<DischordiaCycleStore>((set, get) => ({
  state: { ...DEFAULT_DISCHORDIA_CYCLE_STATE },

  applyEnergy: (actionId) => {
    set({ state: applyEnergyGain(get().state, actionId) });
    // Fire-and-forget server write-through. Only runs when
    // initDischordiaSync has been called with live tRPC utils.
    if (syncUtils) {
      syncUtils.client.dischordiaCycle.applyEnergy
        .mutate({ actionId })
        .catch((err: unknown) => {
          // Best-effort. The local store already updated and the
          // next hydrate cycle will reconcile any drift.
          console.warn("[DischordiaCycle] server write failed:", err);
        });
    }
  },

  applyRawDelta: ({ light = 0, dark = 0, vortex = 0 }) => {
    const current = get().state;
    const next = recomputeDerived({
      ...current,
      lightEnergy: current.lightEnergy + light,
      darkEnergy: current.darkEnergy + dark,
      vortexProximity: clampProximity(current.vortexProximity + vortex),
    });
    set({ state: next });
  },

  setPhase: (phase) => {
    const current = get().state;
    set({
      state: {
        ...current,
        phase,
        phaseStartedAt: new Date().toISOString(),
      },
    });
  },

  triggerVortexAdvance: () => {
    set({ state: triggerVortexAdvance(get().state) });
  },

  triggerReclamation: () => {
    set({ state: triggerReclamation(get().state) });
    // Witnessing §11.2 — record the reclamation as a memorable
    // moment so the Antiquarian can slot it into the Lion in
    // Black feed. Imported lazily to avoid a cross-store cycle.
    void import("./memorableMomentsStore").then(({ recordMemorableMoment }) => {
      recordMemorableMoment(
        "sector_reclaimed",
        "A sector you reclaimed. You know which one.",
      );
    });
  },

  checkVortexTrigger: (litSectorRatio) => {
    return shouldTriggerVortexAdvance(get().state, litSectorRatio);
  },

  reset: () => {
    set({ state: { ...DEFAULT_DISCHORDIA_CYCLE_STATE } });
  },
}));

/* ─── SELECTORS ─── */

export const selectCyclePhase = (s: DischordiaCycleStore) => s.state.phase;
export const selectLightEnergy = (s: DischordiaCycleStore) => s.state.lightEnergy;
export const selectDarkEnergy = (s: DischordiaCycleStore) => s.state.darkEnergy;
export const selectVortexProximity = (s: DischordiaCycleStore) =>
  s.state.vortexProximity;
export const selectEnergyBalance = (s: DischordiaCycleStore) =>
  s.state.energyBalance;

/* ─── PLAIN-FUNCTION HELPERS ─── */

/**
 * Apply an energy gain from non-React code. Equivalent to:
 *   useDischordiaCycleStore.getState().applyEnergy(actionId)
 */
export function applyDischordiaEnergy(actionId: EnergyGainActionId): void {
  useDischordiaCycleStore.getState().applyEnergy(actionId);
}

/**
 * Apply a slideshow's registered lightEnergyReward on completion.
 * Returns the delta actually applied (0 if the slideshow had no
 * reward). Called from SlideshowPlayerRoot.
 */
export function applySlideshowReward(lightEnergyReward: number | undefined): number {
  if (!lightEnergyReward || lightEnergyReward <= 0) return 0;
  useDischordiaCycleStore
    .getState()
    .applyRawDelta({ light: lightEnergyReward });
  return lightEnergyReward;
}
