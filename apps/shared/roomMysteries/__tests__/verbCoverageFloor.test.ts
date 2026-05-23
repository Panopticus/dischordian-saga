/**
 * Floor for the room-mystery verb-coverage audit.
 *
 * `scripts/_audit-room-verb-coverage.mjs` walks every shipped
 * RoomMysteryModule and counts (look / use / talk) verb-cells against
 * (hotspot count × 3). This test pins the post-Bucket-B coverage
 * floor — 1085 cells, ≈75 %  — so anyone deleting verbs without
 * replacement sees a vitest failure rather than waiting for the
 * separate audit script.
 *
 * The count is computed in-test (not via the audit script) so the
 * test stays self-contained.
 */
import { describe, expect, it } from "vitest";

import { ARMORY_MYSTERY } from "../armory";
import { CHAOS_FORGE_MYSTERY } from "../chaosForge";
import { ELEMENTAL_NEXUS_MYSTERY } from "../elementalNexus";
import { STATION_DOCK_MYSTERY } from "../stationDock";
import { SYNTHESIS_CHAMBER_MYSTERY } from "../synthesisChamber";
import { DREAMS_WORKSHOP_MYSTERY } from "../dreamsWorkshop";
import { HALL_OF_DISAPPEARANCES_MYSTERY } from "../hallOfDisappearances";
import { SOCIAL_HUB_MYSTERY } from "../socialHub";
import { CARGO_HOLD_MYSTERY } from "../cargoHold";
import { ORDER_TRIBUNAL_MYSTERY } from "../orderTribunal";
import { CAPTAINS_QUARTERS_MYSTERY } from "../captainsQuarters";
import { OBSERVATION_DECK_MYSTERY } from "../observationDeck";
import { MEDICAL_BAY_MYSTERY } from "../medicalBay";
import { QUANTUM_LAB_MYSTERY } from "../quantumLab";
import { FORGE_WORKSHOP_MYSTERY } from "../forgeWorkshop";
import { ENGINEERING_MYSTERY } from "../engineering";
import { ENGINEERING_CORE_MYSTERY } from "../engineeringCore";
import { GUILD_SANCTUM_MYSTERY } from "../guildSanctum";
import { BRIDGE_MYSTERY } from "../bridge";
import { COMMS_ARRAY_MYSTERY } from "../commsArray";
import { ARCHIVES_MYSTERY } from "../archives";
import { CIPHER_DEN_MYSTERY } from "../cipherDen";
import { ANTIQUARIAN_LIBRARY_MYSTERY } from "../antiquarianLibrary";
import { ORACLE_SANCTUM_MYSTERY } from "../oracleSanctum";
import { SHADOW_VAULT_MYSTERY } from "../shadowVault";
import { WAR_ROOM_MYSTERY } from "../warRoom";

const ALL_MODULES = [
  ANTIQUARIAN_LIBRARY_MYSTERY,
  ARCHIVES_MYSTERY,
  ARMORY_MYSTERY,
  BRIDGE_MYSTERY,
  CAPTAINS_QUARTERS_MYSTERY,
  CARGO_HOLD_MYSTERY,
  CHAOS_FORGE_MYSTERY,
  CIPHER_DEN_MYSTERY,
  COMMS_ARRAY_MYSTERY,
  DREAMS_WORKSHOP_MYSTERY,
  ELEMENTAL_NEXUS_MYSTERY,
  ENGINEERING_MYSTERY,
  ENGINEERING_CORE_MYSTERY,
  FORGE_WORKSHOP_MYSTERY,
  GUILD_SANCTUM_MYSTERY,
  HALL_OF_DISAPPEARANCES_MYSTERY,
  MEDICAL_BAY_MYSTERY,
  OBSERVATION_DECK_MYSTERY,
  ORACLE_SANCTUM_MYSTERY,
  ORDER_TRIBUNAL_MYSTERY,
  QUANTUM_LAB_MYSTERY,
  SHADOW_VAULT_MYSTERY,
  SOCIAL_HUB_MYSTERY,
  STATION_DOCK_MYSTERY,
  SYNTHESIS_CHAMBER_MYSTERY,
  WAR_ROOM_MYSTERY,
];

type VerbResponseMap = Record<string, unknown>;

function countCoverage() {
  let look = 0;
  let use = 0;
  let talk = 0;
  let hotspots = 0;
  for (const mod of ALL_MODULES) {
    const responses = mod.responses as Record<string, VerbResponseMap>;
    for (const id of Object.keys(responses)) {
      hotspots++;
      const r = responses[id];
      if (r.look) look++;
      if (r.use) use++;
      if (r.talk) talk++;
    }
  }
  return { hotspots, look, use, talk, total: look + use + talk };
}

describe("room-mystery verb coverage floor", () => {
  it("ships ≥ 1085 verb cells across the canonical room set (≥ 75 % of hotspots × 3)", () => {
    const { total, hotspots } = countCoverage();
    const denominator = hotspots * 3;
    expect(total).toBeGreaterThanOrEqual(1085);
    expect(total / denominator).toBeGreaterThanOrEqual(0.75);
  });

  it("every hotspot ships a Look response (the click-canvas baseline)", () => {
    const { look, hotspots } = countCoverage();
    expect(look).toBe(hotspots);
  });
});
