import { describe, it, expect } from "vitest";
import {
  applyThoughtVirusReinfection,
  generateWarMap,
  THOUGHT_VIRUS_REINFECT_WINDOW_MS,
  THOUGHT_VIRUS_REINFECT_CHANCE,
  type NodeClearRecord,
  ALLIANCE_WAR_EPOCHS,
} from "./allianceWar";

/**
 * Covers the Fall Era "Thought Virus — cleared nodes have a 15% chance to
 * re-infect after 6 hours" rule. Prior to this PR this rule existed only
 * as a human-readable string; now it has a handler and tests.
 */
describe("allianceWar — Thought Virus reinfection", () => {
  const fallEra = ALLIANCE_WAR_EPOCHS.find(e =>
    e.specialRules.some(r => r.toLowerCase().includes("thought virus")),
  );

  it("the Fall Era epoch is registered with the Thought Virus rule", () => {
    expect(fallEra).toBeDefined();
    expect(fallEra?.specialRules.some(r => /thought virus/i.test(r))).toBe(true);
  });

  it("returns an empty result when no epoch is supplied", () => {
    const map = generateWarMap();
    const result = applyThoughtVirusReinfection(map, [], undefined);
    expect(result.reinfectedNodeIds).toHaveLength(0);
    expect(result.nextMap).toBe(map);
  });

  it("skips epochs without the Thought Virus rule entirely", () => {
    const otherEpoch = ALLIANCE_WAR_EPOCHS.find(e =>
      !e.specialRules.some(r => r.toLowerCase().includes("thought virus")),
    );
    expect(otherEpoch).toBeDefined();
    const map = generateWarMap();
    const clearedNode = map.nodes[0];
    clearedNode.cleared = true;
    const result = applyThoughtVirusReinfection(
      map,
      [{ nodeId: clearedNode.id, clearedAt: 0 }],
      otherEpoch,
      THOUGHT_VIRUS_REINFECT_WINDOW_MS * 100,
      () => 0,
    );
    expect(result.reinfectedNodeIds).toHaveLength(0);
  });

  it("does not re-infect nodes cleared within the 6-hour window", () => {
    const map = generateWarMap();
    const clearedNode = map.nodes[0];
    clearedNode.cleared = true;
    const now = 1_000_000;
    const clearLog: NodeClearRecord[] = [
      { nodeId: clearedNode.id, clearedAt: now - 1000 }, // 1 second ago
    ];
    const result = applyThoughtVirusReinfection(map, clearLog, fallEra, now, () => 0);
    expect(result.reinfectedNodeIds).toHaveLength(0);
  });

  it("re-infects a cleared node when the rng roll succeeds past the window", () => {
    const map = generateWarMap();
    const nonBoss = map.nodes.find(n => n.type !== "boss")!;
    nonBoss.cleared = true;
    const now = 1_000_000_000;
    const clearLog: NodeClearRecord[] = [
      { nodeId: nonBoss.id, clearedAt: now - THOUGHT_VIRUS_REINFECT_WINDOW_MS - 1 },
    ];
    // rng = 0 → always under the 0.15 chance
    const result = applyThoughtVirusReinfection(map, clearLog, fallEra, now, () => 0);
    expect(result.reinfectedNodeIds).toContain(nonBoss.id);
    const stillCleared = result.nextMap.nodes.find(n => n.id === nonBoss.id)!.cleared;
    expect(stillCleared).toBe(false);
  });

  it("does not re-infect the boss node even when past the window", () => {
    const map = generateWarMap();
    const boss = map.nodes.find(n => n.type === "boss")!;
    boss.cleared = true;
    const now = 1_000_000_000;
    const result = applyThoughtVirusReinfection(
      map,
      [{ nodeId: boss.id, clearedAt: 0 }],
      fallEra,
      now,
      () => 0,
    );
    expect(result.reinfectedNodeIds).not.toContain(boss.id);
    expect(result.nextMap.nodes.find(n => n.id === boss.id)!.cleared).toBe(true);
  });

  it("skips re-infection when the rng roll fails", () => {
    const map = generateWarMap();
    const nonBoss = map.nodes.find(n => n.type !== "boss")!;
    nonBoss.cleared = true;
    const now = 1_000_000_000;
    // rng = 0.99 → always above the 0.15 chance
    const result = applyThoughtVirusReinfection(
      map,
      [{ nodeId: nonBoss.id, clearedAt: 0 }],
      fallEra,
      now,
      () => 0.99,
    );
    expect(result.reinfectedNodeIds).toHaveLength(0);
  });

  it("exported chance/window constants match the human-readable rule", () => {
    expect(THOUGHT_VIRUS_REINFECT_CHANCE).toBe(0.15);
    expect(THOUGHT_VIRUS_REINFECT_WINDOW_MS).toBe(6 * 60 * 60 * 1000);
  });
});
