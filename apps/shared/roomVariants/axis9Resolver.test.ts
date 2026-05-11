/**
 * Vitest suite for the Axis 9 TV-infection resolver (Phase H.D).
 */
import { describe, expect, it } from "vitest";

import {
  ALL_TV_STATES,
  resolveAxis9State,
  tvPhaseFlag,
  tvRoomOverrideFlag,
  type Axis9GameSlice,
} from "./axis9Resolver";

const empty: Axis9GameSlice = { narrativeFlags: {} };

describe("axis9Resolver — Phase H.D", () => {
  it("defaults to 'clean' when no flags set", () => {
    expect(resolveAxis9State(empty, "cryo_bay")).toBe("clean");
  });

  it("respects global tv_phase_<n> flag (n maps 0..4 → clean..quarantined)", () => {
    const phases = [0, 1, 2, 3, 4] as const;
    for (const n of phases) {
      const game: Axis9GameSlice = {
        narrativeFlags: { [tvPhaseFlag(n)]: true },
      };
      expect(resolveAxis9State(game, "cryo_bay")).toBe(ALL_TV_STATES[n]);
    }
  });

  it("highest tv_phase_<n> wins when multiple set", () => {
    const game: Axis9GameSlice = {
      narrativeFlags: {
        [tvPhaseFlag(1)]: true,
        [tvPhaseFlag(3)]: true,
        [tvPhaseFlag(0)]: true,
      },
    };
    expect(resolveAxis9State(game, "cryo_bay")).toBe("corrupted");
  });

  it("per-room override beats global phase", () => {
    const game: Axis9GameSlice = {
      narrativeFlags: {
        [tvPhaseFlag(0)]: true, // global = clean
        [tvRoomOverrideFlag("cryo_bay", "quarantined")]: true,
      },
    };
    expect(resolveAxis9State(game, "cryo_bay")).toBe("quarantined");
  });

  it("per-room override is scoped (other rooms still use global)", () => {
    const game: Axis9GameSlice = {
      narrativeFlags: {
        [tvPhaseFlag(2)]: true,
        [tvRoomOverrideFlag("cryo_bay", "quarantined")]: true,
      },
    };
    expect(resolveAxis9State(game, "cryo_bay")).toBe("quarantined");
    expect(resolveAxis9State(game, "medical_bay")).toBe("spreading");
  });

  it("per-room override priority — highest severity wins", () => {
    const game: Axis9GameSlice = {
      narrativeFlags: {
        [tvRoomOverrideFlag("cryo_bay", "exposed")]: true,
        [tvRoomOverrideFlag("cryo_bay", "corrupted")]: true,
      },
    };
    expect(resolveAxis9State(game, "cryo_bay")).toBe("corrupted");
  });

  it("ALL_TV_STATES enumerates the 5 canonical states in ascending severity", () => {
    expect(ALL_TV_STATES).toEqual([
      "clean",
      "exposed",
      "spreading",
      "corrupted",
      "quarantined",
    ]);
  });

  it("tvPhaseFlag formatter produces canonical names", () => {
    expect(tvPhaseFlag(0)).toBe("tv_phase_0");
    expect(tvPhaseFlag(4)).toBe("tv_phase_4");
  });

  it("tvRoomOverrideFlag formatter produces canonical names", () => {
    expect(tvRoomOverrideFlag("cryo_bay", "spreading")).toBe(
      "room_cryo_bay_tv_spreading",
    );
  });
});
