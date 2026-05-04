/**
 * useLivingUniverseSync — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "useLivingUniverseSync.ts"),
  "utf-8",
);
const APP_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "App.tsx"),
  "utf-8",
);

describe("useLivingUniverseSync", () => {
  it("subscribes to the canonical livingUniverse.getActiveEvents tRPC query", () => {
    expect(SRC).toContain("trpc.livingUniverse.getActiveEvents.useQuery");
  });

  it("uses the canonical livingUniverseEventActiveFlag helper for flag composition", () => {
    expect(SRC).toContain('from "@/hooks/useLivingShipSensor"');
    expect(SRC).toContain("livingUniverseEventActiveFlag");
  });

  it("polls at a sane interval (Living Universe state shifts slowly)", () => {
    expect(SRC).toContain("POLL_INTERVAL_MS");
    expect(SRC).toMatch(/POLL_INTERVAL_MS\s*=\s*60_?000/);
  });

  it("clears stale flags when an event is no longer in the active set", () => {
    expect(SRC).toContain("previouslyActiveRef");
    expect(SRC).toMatch(/setNarrativeFlag\([^,]+,\s*false\)/);
  });

  it("returns void (side-effect-only hook)", () => {
    expect(SRC).toMatch(/useLivingUniverseSync\(\): void/);
  });

  it("tolerates query errors silently — degraded state is 'no active reaction'", () => {
    expect(SRC).toContain("retry: 1");
    expect(SRC).toContain("if (!data");
  });
});

describe("App.tsx — Living Universe sync mount", () => {
  it("imports the sync hook", () => {
    expect(APP_SRC).toContain('from "./hooks/useLivingUniverseSync"');
  });

  it("mounts a side-effect watcher named LivingUniverseSyncWatcher", () => {
    expect(APP_SRC).toContain("LivingUniverseSyncWatcher");
    expect(APP_SRC).toContain("<LivingUniverseSyncWatcher");
  });
});
