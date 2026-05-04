/* ═══════════════════════════════════════════════════════
   WATCHER — schema + helper invariants

   Stop 0 ships pure scaffolding. These tests assert the
   schema is sound and the helper functions are honest.
   Behavioral tests (trigger predicates, cooldowns, escalation
   curve) get added as later stops add real Watcher lines.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  appendObservation,
  countByKind,
  emptyLog,
  hasKind,
  lastOfKind,
  MAX_LOG_ENTRIES,
  parseLog,
  uniqueSurfacesForKind,
  type WatcherObservation,
} from "./observationLog";
import { WATCHER_COMMENTS } from "./watcherLines";

describe("WatcherLog — empty + parse", () => {
  it("emptyLog is schemaVersion 1 with no events", () => {
    const log = emptyLog();
    expect(log.schemaVersion).toBe(1);
    expect(log.events).toEqual([]);
  });

  it("parseLog returns empty for null/undefined/wrong shape", () => {
    expect(parseLog(null).events).toEqual([]);
    expect(parseLog(undefined).events).toEqual([]);
    expect(parseLog("bad").events).toEqual([]);
    expect(parseLog({ schemaVersion: 99, events: [] }).events).toEqual([]);
    expect(parseLog({ schemaVersion: 1, events: "not-array" }).events).toEqual([]);
  });

  it("parseLog drops malformed events but keeps valid ones", () => {
    const raw = {
      schemaVersion: 1,
      events: [
        { kind: "skip", surface: "a", at: 1 },
        { not: "a kind" },
        null,
        { kind: 123, at: 2 }, // wrong type
        { kind: "name_committed", at: 3 },
      ],
    };
    const parsed = parseLog(raw);
    expect(parsed.events).toHaveLength(2);
    expect(parsed.events[0].kind).toBe("skip");
    expect(parsed.events[1].kind).toBe("name_committed");
  });
});

describe("WatcherLog — append + trim", () => {
  it("appends without mutating", () => {
    const log = emptyLog();
    const obs: WatcherObservation = { kind: "skip", surface: "intro", at: 1 };
    const next = appendObservation(log, obs);
    expect(log.events).toEqual([]);
    expect(next.events).toEqual([obs]);
  });

  it("trims to MAX_LOG_ENTRIES (oldest dropped)", () => {
    let log = emptyLog();
    for (let i = 0; i < MAX_LOG_ENTRIES + 25; i++) {
      log = appendObservation(log, { kind: "skip", surface: `s${i}`, at: i });
    }
    expect(log.events).toHaveLength(MAX_LOG_ENTRIES);
    // Oldest 25 dropped: first remaining surface should be s25.
    expect((log.events[0] as { surface: string }).surface).toBe("s25");
    // Latest preserved.
    expect((log.events[log.events.length - 1] as { surface: string }).surface).toBe(
      `s${MAX_LOG_ENTRIES + 24}`,
    );
  });
});

describe("WatcherLog — accessors", () => {
  it("countByKind tallies a single kind", () => {
    let log = emptyLog();
    log = appendObservation(log, { kind: "skip", surface: "a", at: 1 });
    log = appendObservation(log, { kind: "skip", surface: "b", at: 2 });
    log = appendObservation(log, { kind: "name_committed", at: 3 });
    expect(countByKind(log, "skip")).toBe(2);
    expect(countByKind(log, "name_committed")).toBe(1);
    expect(countByKind(log, "first_dissent")).toBe(0);
  });

  it("hasKind checks presence", () => {
    let log = emptyLog();
    expect(hasKind(log, "first_dissent")).toBe(false);
    log = appendObservation(log, { kind: "first_dissent", at: 1 });
    expect(hasKind(log, "first_dissent")).toBe(true);
  });

  it("lastOfKind returns most recent matching event", () => {
    let log = emptyLog();
    log = appendObservation(log, { kind: "choice_latency", surface: "a", latencyMs: 100, at: 1 });
    log = appendObservation(log, { kind: "skip", surface: "b", at: 2 });
    log = appendObservation(log, { kind: "choice_latency", surface: "c", latencyMs: 9999, at: 3 });
    const last = lastOfKind(log, "choice_latency");
    expect(last?.latencyMs).toBe(9999);
    expect(last?.surface).toBe("c");
  });

  it("uniqueSurfacesForKind counts distinct surfaces", () => {
    let log = emptyLog();
    log = appendObservation(log, { kind: "skip", surface: "intro", at: 1 });
    log = appendObservation(log, { kind: "skip", surface: "intro", at: 2 });
    log = appendObservation(log, { kind: "skip", surface: "act1", at: 3 });
    expect(uniqueSurfacesForKind(log, "skip")).toBe(2);
  });
});

describe("WATCHER_COMMENTS registry", () => {
  it("every line has speaker === 'watcher'", () => {
    for (const c of WATCHER_COMMENTS) {
      expect(c.speaker).toBe("watcher");
    }
  });

  it("ids are unique", () => {
    const ids = WATCHER_COMMENTS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("triggers are unique (one line per trigger; later stops may add variants per gate)", () => {
    const triggers = WATCHER_COMMENTS.map(c => c.trigger);
    expect(new Set(triggers).size).toBe(triggers.length);
  });

  it("contains the Stop 0 self-test entry", () => {
    expect(WATCHER_COMMENTS.find(c => c.id === "watcher_self_test")).toBeDefined();
  });
});
