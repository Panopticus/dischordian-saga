/**
 * Berth System coverage parity check.
 *
 * Declared surfaces:
 *   1. Apprentice activity catalog: 12 archetypes × 4 phases = 48 cells.
 *   2. Recruit activity defaults: 5 recruits.
 *   3. Bunkroom door registry: apprentice_active + 4 recruits all in bunk-room.
 *   4. Tier-2 portrait registry: 4 missing recruits (vex_solene,
 *      wraith_calder, jericho_jones, akai_shi) registered with named
 *      expressions for the bond×corruption matrix.
 *   5. Comm-screen resolver smoke: produces a non-null state for
 *      every PartyMember kind (apprentice, elara, human, recruit).
 *
 * Hard parity. Activity audio/sprite paths are slot specs — producers
 * fill the actual files; the gate proves the slots exist and are
 * authored.
 */
import type { RawParityCount } from "../types";

export async function checkBerthCoverage(): Promise<RawParityCount> {
  const berthMod = await import("../../partyMemberBerth");
  const screenMod = await import("../../berthCommScreen");
  const roomMod = await import("../../companionRoomRegistry");

  const missing: string[] = [];
  let implemented = 0;
  let declared = 0;

  // 1. Apprentice activity catalog — 48 cells.
  const apprenticeCells = berthMod.apprenticeActivityCoverage();
  declared += apprenticeCells.length;
  for (const c of apprenticeCells) {
    if (c.authored) implemented += 1;
    else missing.push(`apprentice activity ${c.archetype} × ${c.phase}: missing`);
  }

  // 2. Recruit activity defaults.
  const recruitCells = berthMod.recruitActivityCoverage();
  declared += recruitCells.length;
  for (const c of recruitCells) {
    if (c.authored) implemented += 1;
    else missing.push(`recruit activity ${c.id}: missing`);
  }

  // 3. Bunkroom door registry — apprentice_active + 4 bunk-room recruits.
  const bunkroomEntries = roomMod.COMPANION_ROOM_REGISTRY.filter(
    e => e.roomId === "bunk-room",
  );
  const expectedBunkroom = ["apprentice_active", "vex_solene", "wraith_calder", "jericho_jones", "akai_shi"];
  declared += expectedBunkroom.length;
  for (const expected of expectedBunkroom) {
    if (bunkroomEntries.some(e => e.companionId === expected)) {
      implemented += 1;
    } else {
      missing.push(`bunk-room registry missing: ${expected}`);
    }
  }

  // 4. Tier-2 portrait entries (those that were missing pre-Berth).
  // We can't import the client-side npcPortraits module from the
  // _completeness scanner (different bundle), so we read it as text
  // and check for the id strings.
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { REPO_ROOT } = await import("../scanner");
  const portraitsPath = path.join(
    REPO_ROOT,
    "apps/client/src/game/npcPortraits.ts",
  );
  let portraitsText = "";
  try {
    portraitsText = fs.readFileSync(portraitsPath, "utf-8");
  } catch {
    // surfaces below as missing entries
  }
  const tier2Ids = ["vex_solene", "wraith_calder", "jericho_jones", "akai_shi"];
  declared += tier2Ids.length;
  for (const id of tier2Ids) {
    // Look for "id": "<id>" form (registry entry) and named "vulnerable"
    // (proves the expanded expression palette is present).
    const idRegex = new RegExp(`id:\\s*"${id}"`);
    const hasEntry = idRegex.test(portraitsText);
    // Locate the entry block and check it carries a vulnerable named expression.
    const blockMatch = portraitsText.match(
      new RegExp(`${id}:\\s*\\{[\\s\\S]*?namedExpressions[\\s\\S]*?vulnerable`),
    );
    if (hasEntry && blockMatch) {
      implemented += 1;
    } else {
      missing.push(`portrait registry ${id}: missing entry or vulnerable expression`);
    }
  }

  // 5. Comm-screen resolver smoke check — non-null state for every kind.
  const ctxBase = {
    roster: [],
    phase: "midday" as const,
  };
  const tests: Array<{ kind: string; build: () => unknown }> = [
    {
      kind: "apprentice",
      build: () => screenMod.resolveCommScreenContent({
        ...ctxBase,
        host: {
          kind: "apprentice", id: "apprentice_active",
          apprenticeId: "test", displayName: "T",
          archetype: "scholar", gender: "non-binary",
          rarity: "common", bond: 50, corruption: 10,
          trialDay: 7,
        },
      }),
    },
    {
      kind: "elara",
      build: () => screenMod.resolveCommScreenContent({
        ...ctxBase,
        host: {
          kind: "elara", id: "elara",
          displayName: "Elara", stability: 20, stabilityBand: "lucid",
        },
      }),
    },
    {
      kind: "human",
      build: () => screenMod.resolveCommScreenContent({
        ...ctxBase,
        host: {
          kind: "human", id: "the_human", displayName: "The Human",
          trust: 40, light: 0, lightBand: "balanced", revealStage: 3,
        },
      }),
    },
    {
      kind: "recruit",
      build: () => screenMod.resolveCommScreenContent({
        ...ctxBase,
        host: {
          kind: "recruit", id: "vex_solene", displayName: "Vex Solene",
          bond: 50, recruited: true,
        },
      }),
    },
  ];
  declared += tests.length;
  for (const t of tests) {
    try {
      const state = t.build() as { ambient?: { lines?: readonly string[] } };
      if (state.ambient && state.ambient.lines && state.ambient.lines.length === 2) {
        implemented += 1;
      } else {
        missing.push(`comm-screen smoke ${t.kind}: missing ambient`);
      }
    } catch (e) {
      missing.push(`comm-screen smoke ${t.kind}: threw (${(e as Error).message})`);
    }
  }

  return { declared, implemented, missing };
}
