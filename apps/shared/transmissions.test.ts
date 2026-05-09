/* ═══════════════════════════════════════════════════════
   TRANSMISSIONS TESTS

   Covers:
   - `isUnlocked` for every trigger kind
   - `getNewlyUnlocked` dedup behavior
   - `transmissionId` format (used by the client markWatched →
     narrativeFlag chain)
   - Flag chaining: watching Ep N sets `epoch{e}_ep{n}_watched`
     which unlocks Ep N+1 on the next evaluation.

   These are the guarantees the MemeBroadcast flow relies on
   to actually progress the player through Epochs 0 and 2.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  ALL_TRANSMISSIONS,
  EPOCH_1_TRANSMISSIONS,
  EPOCH_2_TRANSMISSIONS,
  isUnlocked,
  getNewlyUnlocked,
  transmissionId,
  SIB_WATCHED_FLAGS,
  getTransmissionAchievementDefs,
  type PlayerContext,
  type Transmission,
} from "./transmissions";

const emptyCtx: PlayerContext = {
  level: 1,
  awakeningStep: "BLACKOUT",
  completedChapters: [],
  elaraTrust: 0,
  humanTrust: 0,
  npcTrust: {},
  moralityScore: 0,
  narrativeFlags: {},
  roomsVisited: [],
  hasApprenticeGraduate: false,
};

function findByTitle(title: string): Transmission {
  const t = ALL_TRANSMISSIONS.find(x => x.title === title);
  if (!t) throw new Error(`Transmission not found: ${title}`);
  return t;
}

describe("transmissions — transmissionId format", () => {
  it("returns `ep{epoch}-{episode}` so client markTransmissionWatched can parse it", () => {
    const t = EPOCH_1_TRANSMISSIONS[0];
    const id = transmissionId(t);
    expect(id).toMatch(/^ep\d+-\d+$/);
    const [, epoch, episode] = id.match(/^ep(\d+)-(\d+)$/)!;
    expect(Number(epoch)).toBe(t.epoch);
    expect(Number(episode)).toBe(t.episodeNumber);
  });
});

describe("transmissions — isUnlocked trigger kinds", () => {
  it("always triggers are unlocked in the empty context", () => {
    const alwaysOn = ALL_TRANSMISSIONS.filter(t => t.unlockTrigger.kind === "always");
    expect(alwaysOn.length).toBeGreaterThan(0);
    for (const t of alwaysOn) {
      expect(isUnlocked(t, emptyCtx)).toBe(true);
    }
  });

  it("level trigger requires >= minLevel", () => {
    const ep2 = EPOCH_1_TRANSMISSIONS.find(t => t.episodeNumber === 2)!;
    expect(ep2.unlockTrigger.kind).toBe("level");
    expect(isUnlocked(ep2, { ...emptyCtx, level: 1 })).toBe(false);
    expect(isUnlocked(ep2, { ...emptyCtx, level: 2 })).toBe(true);
    expect(isUnlocked(ep2, { ...emptyCtx, level: 99 })).toBe(true);
  });

  it("chapter_complete trigger requires the chapter in completedChapters", () => {
    const ch = EPOCH_1_TRANSMISSIONS.find(
      t => t.unlockTrigger.kind === "chapter_complete",
    );
    expect(ch).toBeDefined();
    const chapterId = (ch!.unlockTrigger as { chapterId: string }).chapterId;
    expect(isUnlocked(ch!, emptyCtx)).toBe(false);
    expect(
      isUnlocked(ch!, { ...emptyCtx, completedChapters: [chapterId] }),
    ).toBe(true);
  });

  it("flag trigger requires the exact narrative flag", () => {
    // Epoch 2 Ep 2 unlocks on `epoch2_ep1_watched`.
    const ep2 = EPOCH_2_TRANSMISSIONS.find(t => t.episodeNumber === 2)!;
    expect(ep2.unlockTrigger).toMatchObject({
      kind: "flag",
      flag: "epoch2_ep1_watched",
    });
    expect(isUnlocked(ep2, emptyCtx)).toBe(false);
    expect(
      isUnlocked(ep2, {
        ...emptyCtx,
        narrativeFlags: { epoch2_ep1_watched: true },
      }),
    ).toBe(true);
  });

  it("awakening_step trigger matches exactly", () => {
    const ep1 = EPOCH_1_TRANSMISSIONS.find(t => t.unlockTrigger.kind === "awakening_step");
    expect(ep1).toBeDefined();
    const step = (ep1!.unlockTrigger as { step: string }).step;
    expect(isUnlocked(ep1!, { ...emptyCtx, awakeningStep: step })).toBe(true);
    expect(isUnlocked(ep1!, { ...emptyCtx, awakeningStep: "BLACKOUT" })).toBe(false);
  });

  it("trust trigger checks mapped npcs", () => {
    // Celebration SIB unlocks on trust.the_human >= 1
    const celebration = findByTitle("Welcome to Celebration");
    expect(celebration.unlockTrigger.kind).toBe("trust");
    expect(isUnlocked(celebration, emptyCtx)).toBe(false);
    expect(isUnlocked(celebration, { ...emptyCtx, humanTrust: 1 })).toBe(true);
  });
});

describe("transmissions — Epoch 2 flag chain end-to-end", () => {
  // This simulates what the client `markTransmissionWatched` does:
  // it sets `epoch{e}_ep{n}_watched` on every watched transmission,
  // which unlocks the next episode in the chain. This test proves
  // the entire Epoch 2 chain is walkable via the flag-setting logic.
  it("walks Epoch 2 in order by applying watched flags", () => {
    let flags: Record<string, boolean> = {};
    const e2 = EPOCH_2_TRANSMISSIONS;
    const ordered = [...e2].sort((a, b) => a.episodeNumber - b.episodeNumber);

    for (let i = 0; i < ordered.length; i++) {
      const t = ordered[i];
      const ctx: PlayerContext = { ...emptyCtx, level: 99, narrativeFlags: flags };
      const unlocked = isUnlocked(t, ctx);
      if (i === 0) {
        // Ep 1 unlocks on level >= 10 (no flag dep).
        expect(unlocked).toBe(true);
      } else {
        expect(unlocked).toBe(true);
      }
      // Simulate markTransmissionWatched setting both flags.
      flags = {
        ...flags,
        [`epoch${t.epoch}_ep${t.episodeNumber}_watched`]: true,
        [`epoch${t.epoch}_ep${t.episodeNumber}_viewed`]: true,
      };
    }
  });

  it("without watched flags only the first episode of a chain unlocks", () => {
    const ctx: PlayerContext = { ...emptyCtx, level: 99 };
    const ep1 = EPOCH_2_TRANSMISSIONS[0];
    const ep2 = EPOCH_2_TRANSMISSIONS[1];
    expect(isUnlocked(ep1, ctx)).toBe(true);
    expect(isUnlocked(ep2, ctx)).toBe(false);
  });
});

describe("transmissions — getNewlyUnlocked", () => {
  it("excludes already-notified transmissions", () => {
    const ctx: PlayerContext = { ...emptyCtx, level: 99 };
    const first = getNewlyUnlocked(ctx, []);
    expect(first.length).toBeGreaterThan(0);
    const notified = first.map(transmissionId);
    const second = getNewlyUnlocked(ctx, notified);
    // Every id in `first` should be absent from `second`.
    for (const t of first) {
      expect(second).not.toContainEqual(t);
    }
  });

  it("re-evaluates after new flags are set", () => {
    const ctx1: PlayerContext = { ...emptyCtx, level: 99 };
    const firstBatch = getNewlyUnlocked(ctx1, []);
    const notifiedIds = firstBatch.map(transmissionId);

    // Simulate client watching every always/level/trust unlock.
    // Set all the watched flags that would result.
    const flags: Record<string, boolean> = {};
    for (const t of firstBatch) {
      flags[`epoch${t.epoch}_ep${t.episodeNumber}_watched`] = true;
      flags[`epoch${t.epoch}_ep${t.episodeNumber}_viewed`] = true;
    }

    const ctx2: PlayerContext = { ...ctx1, narrativeFlags: flags };
    const secondBatch = getNewlyUnlocked(ctx2, notifiedIds);

    // The second batch should contain transmissions whose flag
    // triggers just became satisfied — proving the chain advances.
    expect(secondBatch.length).toBeGreaterThan(0);
  });
});

describe("transmissions — SIB flag map", () => {
  it("every SIB transmission has a corresponding watched flag entry", () => {
    const sibs = ALL_TRANSMISSIONS.filter(t => t.broadcastOrder <= -20);
    expect(sibs.length).toBeGreaterThan(0);
    for (const t of sibs) {
      const id = transmissionId(t);
      expect(id).toMatch(/^sib-ep/);
      expect(SIB_WATCHED_FLAGS[id]).toBeDefined();
      expect(SIB_WATCHED_FLAGS[id]).toMatch(/^sib_.*_viewed$/);
    }
  });

  it("SIB ids are globally unique to the sib- prefix", () => {
    for (const id of Object.keys(SIB_WATCHED_FLAGS)) {
      expect(id).toMatch(/^sib-ep\d+$/);
    }
  });
});

describe("transmissions — achievement definitions", () => {
  it("generates one achievement def per unique transmission achievement", () => {
    const defs = getTransmissionAchievementDefs();
    const uniqueIds = new Set(
      ALL_TRANSMISSIONS.map(t => t.reward.achievement).filter(Boolean) as string[],
    );
    expect(defs.length).toBe(uniqueIds.size);
    for (const def of defs) {
      expect(def.category).toBe("transmission");
      expect(def.name.length).toBeGreaterThan(0);
      expect(def.description.length).toBeGreaterThan(0);
      expect(["bronze", "silver", "gold", "platinum"]).toContain(def.tier);
      expect(def.xpReward).toBeGreaterThan(0);
      expect(def.pointsReward).toBeGreaterThan(0);
    }
  });
});

describe("transmissions — oracle reveal episodes", () => {
  it("has a finite small count of triggersOracleReveal episodes", () => {
    const triggering = ALL_TRANSMISSIONS.filter(t => t.triggersOracleReveal);
    // Tier system clamps at 3 — catch if someone adds a 4th without
    // also updating the clamp in GameContext.markTransmissionWatched.
    expect(triggering.length).toBeGreaterThanOrEqual(1);
    expect(triggering.length).toBeLessThanOrEqual(3);
  });
});

describe("transmissions — legacy id collision detection", () => {
  // Matches the regex used by GameContext.migrateGameState to warn
  // about pre-fix transmissionId collisions (ep0-1 through ep0-10).
  const LEGACY_RE = /^ep0-(?:[1-9]|10)$/;

  it("detects every ep0-N id that could have come from SIB or Epoch 0", () => {
    for (let n = 1; n <= 10; n++) {
      expect(LEGACY_RE.test(`ep0-${n}`)).toBe(true);
    }
  });

  it("does not flag Epoch 0 episodes outside the 1-10 range", () => {
    expect(LEGACY_RE.test("ep0-0")).toBe(false);
    expect(LEGACY_RE.test("ep0-11")).toBe(false);
    expect(LEGACY_RE.test("ep0-15")).toBe(false);
  });

  it("does not flag other epochs", () => {
    expect(LEGACY_RE.test("ep1-1")).toBe(false);
    expect(LEGACY_RE.test("ep2-5")).toBe(false);
  });

  it("does not flag post-fix SIB ids", () => {
    expect(LEGACY_RE.test("sib-ep1")).toBe(false);
    expect(LEGACY_RE.test("sib-ep10")).toBe(false);
  });
});

describe("transmissions — data integrity", () => {
  it("every transmission has a unique transmissionId", () => {
    // Note: (epoch, episodeNumber) pairs COLLIDE for Epoch 0 / SIB
    // (both use epoch=0 with overlapping episode numbers). The
    // transmissionId() helper prefixes SIB to resolve this — so
    // the unique key is the ID, not the raw pair.
    const seen = new Set<string>();
    for (const t of ALL_TRANSMISSIONS) {
      const id = transmissionId(t);
      expect(seen.has(id), `Duplicate transmission id: ${id}`).toBe(false);
      seen.add(id);
    }
  });

  it("every transmission has a unique broadcastOrder", () => {
    const seen = new Set<number>();
    for (const t of ALL_TRANSMISSIONS) {
      expect(
        seen.has(t.broadcastOrder),
        `Duplicate broadcastOrder: ${t.broadcastOrder}`,
      ).toBe(false);
      seen.add(t.broadcastOrder);
    }
  });

  it("every transmission has a non-empty memeIntro and memeOutro", () => {
    for (const t of ALL_TRANSMISSIONS) {
      expect(t.memeIntro.length).toBeGreaterThan(0);
      expect(t.memeOutro.length).toBeGreaterThan(0);
    }
  });

  it("every transmission has a positive reward XP or Dream", () => {
    for (const t of ALL_TRANSMISSIONS) {
      expect(t.reward.xp + t.reward.dream).toBeGreaterThan(0);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   ARCHITECT TRANSMISSIONS (A1 first-contact calibration)
   ═══════════════════════════════════════════════════════ */

import { ARCHITECT_TRANSMISSIONS } from "./transmissions";

describe("ARCHITECT_TRANSMISSIONS — A1 first-contact calibration", () => {
  it("registers exactly one entry today (the first-contact calibration)", () => {
    expect(ARCHITECT_TRANSMISSIONS).toHaveLength(1);
  });

  it("uses the prelude-completion gate so it fires the moment the player has audit trail", () => {
    const fc = ARCHITECT_TRANSMISSIONS[0];
    expect(fc.unlockTrigger).toEqual({ kind: "awakening_step", step: "COMPLETE" });
  });

  it("lives in the 2000-range broadcast namespace (clear of music videos and canonical epochs)", () => {
    for (const t of ARCHITECT_TRANSMISSIONS) {
      expect(t.broadcastOrder).toBeGreaterThanOrEqual(2000);
    }
  });

  it("all entries are spread into ALL_TRANSMISSIONS so the runtime sees them", () => {
    for (const t of ARCHITECT_TRANSMISSIONS) {
      const found = ALL_TRANSMISSIONS.find((x) => x.broadcastOrder === t.broadcastOrder);
      expect(found, `Architect transmission ${t.broadcastOrder} missing from ALL_TRANSMISSIONS`).toBeDefined();
    }
  });

  it("entries reference the Architect + Human Loredex entities (the dual-channel reveal hooks)", () => {
    const fc = ARCHITECT_TRANSMISSIONS[0];
    expect(fc.relatedLoredexEntries).toEqual(
      expect.arrayContaining(["entity_architect", "entity_human"]),
    );
  });
});

/* ─── audit/16 PR 10 (AR4) — scheduled_broadcast trigger ─── */

describe("isUnlocked — scheduled_broadcast (audit/16 PR 10 AR4)", () => {
  function buildScheduled(airsAt: string) {
    return {
      episodeNumber: 0,
      epoch: 0 as const,
      broadcastOrder: 0,
      title: "test",
      driveFileId: null,
      videoUrl: null,
      lengthSeconds: 0,
      memeIntro: "",
      memeOutro: "",
      relatedLoredexEntries: [],
      unlockTrigger: { kind: "scheduled_broadcast" as const, airsAt },
    };
  }

  const baseCtx = {
    awakeningStep: "",
    completedChapters: [],
    level: 0,
    elaraTrust: 0,
    humanTrust: 0,
    npcTrust: {},
    moralityScore: 0,
    narrativeFlags: {},
    roomsVisited: [],
    hasApprenticeGraduate: false,
  };

  it("returns false when ctx.now is omitted (back-compat default)", () => {
    const t = buildScheduled("2026-05-09T12:00:00Z");
    expect(isUnlocked(t as never, baseCtx)).toBe(false);
  });

  it("returns false before airsAt", () => {
    const t = buildScheduled("2026-05-09T12:00:00Z");
    expect(
      isUnlocked(t as never, { ...baseCtx, now: new Date("2026-05-09T11:59:59Z") }),
    ).toBe(false);
  });

  it("returns true at the airsAt boundary (inclusive)", () => {
    const t = buildScheduled("2026-05-09T12:00:00Z");
    expect(
      isUnlocked(t as never, { ...baseCtx, now: new Date("2026-05-09T12:00:00Z") }),
    ).toBe(true);
  });

  it("returns true after airsAt", () => {
    const t = buildScheduled("2026-05-09T12:00:00Z");
    expect(
      isUnlocked(t as never, { ...baseCtx, now: new Date("2026-05-10T00:00:00Z") }),
    ).toBe(true);
  });

  it("returns false for unparseable airsAt (defensive)", () => {
    const t = buildScheduled("not-a-date");
    expect(
      isUnlocked(t as never, { ...baseCtx, now: new Date("2026-05-09T12:00:00Z") }),
    ).toBe(false);
  });
});
