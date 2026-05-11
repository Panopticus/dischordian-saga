import { describe, expect, it } from "vitest";

import {
  ALL_FACTION_STATES,
  factionBoundFlag,
  factionRoomOverrideFlag,
  resolveAxis12State,
  type Axis12GameSlice,
} from "./axis12Resolver";

const empty: Axis12GameSlice = { narrativeFlags: {} };

describe("axis12Resolver — Phase H.F", () => {
  it("defaults to 'none' when no flags set", () => {
    expect(resolveAxis12State(empty, "cryo_bay")).toBe("none");
  });

  it("returns the bound faction when exactly one is set", () => {
    expect(
      resolveAxis12State(
        { narrativeFlags: { [factionBoundFlag("hierarchy")]: true } },
        "cryo_bay",
      ),
    ).toBe("hierarchy");
    expect(
      resolveAxis12State(
        { narrativeFlags: { [factionBoundFlag("dreamers")]: true } },
        "cryo_bay",
      ),
    ).toBe("dreamers");
  });

  it("returns 'multi' when 2+ factions bound", () => {
    expect(
      resolveAxis12State(
        {
          narrativeFlags: {
            [factionBoundFlag("hierarchy")]: true,
            [factionBoundFlag("insurgency")]: true,
          },
        },
        "cryo_bay",
      ),
    ).toBe("multi");
  });

  it("returns 'multi' when 3+ factions bound", () => {
    expect(
      resolveAxis12State(
        {
          narrativeFlags: {
            [factionBoundFlag("hierarchy")]: true,
            [factionBoundFlag("pureflame")]: true,
            [factionBoundFlag("collectors")]: true,
          },
        },
        "cryo_bay",
      ),
    ).toBe("multi");
  });

  it("per-room override beats global bindings", () => {
    expect(
      resolveAxis12State(
        {
          narrativeFlags: {
            [factionBoundFlag("hierarchy")]: true,
            [factionRoomOverrideFlag("cryo_bay", "insurgency")]: true,
          },
        },
        "cryo_bay",
      ),
    ).toBe("insurgency");
  });

  it("per-room override is scoped (other rooms still use global)", () => {
    const game = {
      narrativeFlags: {
        [factionBoundFlag("hierarchy")]: true,
        [factionRoomOverrideFlag("cryo_bay", "insurgency")]: true,
      },
    };
    expect(resolveAxis12State(game, "cryo_bay")).toBe("insurgency");
    expect(resolveAxis12State(game, "medical_bay")).toBe("hierarchy");
  });

  it("ALL_FACTION_STATES enumerates the 8 canonical states", () => {
    expect(ALL_FACTION_STATES).toHaveLength(8);
    expect(ALL_FACTION_STATES).toContain("none");
    expect(ALL_FACTION_STATES).toContain("multi");
  });

  it("flag-id builders produce canonical names", () => {
    expect(factionBoundFlag("hierarchy")).toBe("faction_bound_hierarchy");
    expect(factionRoomOverrideFlag("cryo_bay", "insurgency")).toBe(
      "room_cryo_bay_faction_insurgency",
    );
  });
});
