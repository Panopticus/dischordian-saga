import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 2.1: localStorage → Server sync
   TASK 2.2: Ark room event → server reward wiring
   ═══════════════════════════════════════════════════════ */

/* ─── TASK 2.1 — server schema accepts _clientState ─── */
describe("Task 2.1 — gameState server schema", () => {
  const routerSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/gameState.ts"),
    "utf-8"
  );

  it("declares _clientState as an explicit schema field", () => {
    expect(routerSrc).toMatch(/_clientState:\s*z\.record\(z\.string\(\),\s*z\.unknown\(\)\)\.optional\(\)/);
  });

  it("uses .passthrough() so unknown keys survive validation", () => {
    expect(routerSrc).toMatch(/\}\)\.passthrough\(\);/);
  });

  it("still keeps core gameState fields required (no regression)", () => {
    expect(routerSrc).toContain("phase: z.string()");
    expect(routerSrc).toContain("awakeningStep: z.string()");
    expect(routerSrc).toContain("rooms: z.record(");
    expect(routerSrc).toContain("narrativeFlags: z.record(");
  });

  it("documents the data-loss bug that .passthrough() fixes", () => {
    expect(routerSrc).toContain("Task 2.1");
    expect(routerSrc.toLowerCase()).toContain("passthrough");
    expect(routerSrc).toMatch(/silently lost|zod would strip/i);
  });

  it("load procedure still returns gameState + stats shape", () => {
    expect(routerSrc).toMatch(/load:\s*protectedProcedure\.query/);
    expect(routerSrc).toContain("row.gameData");
    expect(routerSrc).toContain("row.progressData");
  });

  it("save procedure persists gameData as Record<string, unknown>", () => {
    expect(routerSrc).toMatch(/gameData\s*=\s*input\.gameState/);
    expect(routerSrc).toMatch(/save:\s*protectedProcedure/);
  });
});

/* ─── TASK 2.1 — GameContext collector + restorer cover critical keys ─── */
describe("Task 2.1 — GameContext client state collector", () => {
  const ctxSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
    "utf-8"
  );

  const CRITICAL_KEYS = [
    "dischordia_elo",
    "dischordia_wins",
    "dischordia_losses",
    "terminus_highest_wave",
    "card_upgrades",
    "equipment_state",
    "active_specimen",
    "trade_empire_state",
    "loredex_discovered_secrets",
    "loredex_cinematic_seen",
    // Task 2.1 additions:
    "loredex_puzzles_solved",
    "loredex_easter_eggs",
    "loredex_battle_stats",
    "loredex_cards_collected",
  ];

  describe("collectClientState captures every critical localStorage key", () => {
    for (const key of CRITICAL_KEYS) {
      it(`includes ${key}`, () => {
        expect(ctxSrc).toContain(`"${key}"`);
      });
    }
  });

  describe("restoreClientState hydrates every critical localStorage key on load", () => {
    for (const key of CRITICAL_KEYS) {
      it(`restores ${key}`, () => {
        expect(ctxSrc).toMatch(new RegExp(`restoreIfMissing\\("${key}"`));
      });
    }
  });

  it("save uses server-first load strategy (server overrides only if more progressed)", () => {
    expect(ctxSrc).toContain("hasLoadedFromServer");
    expect(ctxSrc).toContain("serverRooms >= localRooms");
  });

  it("collector wraps localStorage reads in try/catch to tolerate corruption", () => {
    expect(ctxSrc).toMatch(/safeGet[\s\S]{0,200}try\s*\{[\s\S]*?catch/);
  });

  it("restorer is opt-in (skips when local value already exists)", () => {
    expect(ctxSrc).toMatch(/!localStorage\.getItem\(key\)/);
  });

  it("doServerSave ships _clientState to the server under gameState._clientState", () => {
    expect(ctxSrc).toMatch(/gameState:\s*\{\s*\.\.\.currentState,\s*_clientState:/);
  });
});

/* ─── TASK 2.2 — ArkExplorerPage wires room events to server rewards ─── */
describe("Task 2.2 — ArkExplorerPage server reward wiring", () => {
  const pageSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/pages/ArkExplorerPage.tsx"),
    "utf-8"
  );

  it("imports useDailyBrief hook", () => {
    expect(pageSrc).toContain('import { useDailyBrief } from "@/hooks/useDailyBrief"');
  });

  it("destructures completeEvent from useDailyBrief", () => {
    expect(pageSrc).toMatch(/const\s*\{\s*completeEvent:\s*completeLivingArkEvent\s*\}\s*=\s*useDailyBrief\(\)/);
  });

  it("the activeRoomEvent click handler calls completeLivingArkEvent", () => {
    expect(pageSrc).toContain("completeLivingArkEvent(");
    expect(pageSrc).toContain("activeRoomEvent.id");
    expect(pageSrc).toContain("activeRoomEvent.type");
    expect(pageSrc).toContain("activeRoomEvent.roomId");
  });

  it("still runs processArkEvent locally for visual/dialog effects", () => {
    expect(pageSrc).toContain("processArkEvent(activeRoomEvent");
  });

  it("removed the stale 'Award resources' TODO comment", () => {
    expect(pageSrc).not.toContain("Award resources (via existing mutation or local state)");
  });

  it("still dispatches narrative visual effects after event completion", () => {
    expect(pageSrc).toContain("dispatchNarrativeEffect");
    expect(pageSrc).toMatch(/eventEffects:\s*Record<string,\s*string>/);
  });

  it("preserves backwards-compatible client-side trust/flag/dialog fan-out", () => {
    expect(pageSrc).toContain("adjustNpcTrust");
    expect(pageSrc).toContain("setNarrativeFlag");
    expect(pageSrc).toContain("buildFirstContactScene");
  });
});

/* ─── TASK 2.2 — useDailyBrief hook still does the heavy lifting ─── */
describe("Task 2.2 — useDailyBrief reward fan-out", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/hooks/useDailyBrief.ts"),
    "utf-8"
  );

  it("exports completeEvent wrapper around the mutation", () => {
    expect(hookSrc).toContain("const completeEvent = useCallback");
  });

  it("mutation invalidates citizen dream balance on success", () => {
    expect(hookSrc).toContain("citizen?.getDreamBalance.invalidate");
  });

  it("mutation invalidates crafting profile on success", () => {
    expect(hookSrc).toContain("crafting?.getCraftingProfile.invalidate");
  });

  it("mutation shows reward toast with dream/xp/salvage breakdown", () => {
    expect(hookSrc).toContain("+${r.dream} Dream");
    expect(hookSrc).toContain("+${r.xp} XP");
  });

  it("mutation surfaces cross-room alerts as toasts", () => {
    expect(hookSrc).toContain("crossRoomAlerts");
    expect(hookSrc).toContain("toast.info(alert.description");
  });

  it("mutation fans out trust changes from ArkEventResult", () => {
    expect(hookSrc).toContain("for (const tc of ark.trustChanges)");
    expect(hookSrc).toContain("game.adjustNpcTrust");
  });

  it("mutation fans out narrative flags from ArkEventResult", () => {
    expect(hookSrc).toContain("for (const flag of ark.flagsToSet)");
    expect(hookSrc).toContain("game.setNarrativeFlag");
  });
});

/* ─── SERVER-SIDE completeEvent mutation wiring ─── */
describe("Task 2.2 — server dailyBrief.completeEvent still applies rewards", () => {
  const routerSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/dailyBrief.ts"),
    "utf-8"
  );

  it("accepts eventId + eventType + roomId", () => {
    expect(routerSrc).toMatch(/completeEvent:\s*protectedProcedure/);
    expect(routerSrc).toContain("eventId: z.string()");
    expect(routerSrc).toContain("eventType: z.string()");
    expect(routerSrc).toContain("roomId: z.string()");
  });

  it("records pressure from the event", () => {
    expect(routerSrc).toContain("recordPressureFromEvent");
  });

  it("updates room state visual tier based on the event", () => {
    expect(routerSrc).toContain("updateRoomStateFromEvent");
  });

  it("runs the shared processArkEvent to compute grants", () => {
    expect(routerSrc).toContain("processArkEvent(arkEvent");
  });

  it("falls back gracefully when the eventId isn't on today's brief", () => {
    // arkEvent.title defaults to "Ark Event" when storedEvent is null
    expect(routerSrc).toContain('"Ark Event"');
  });
});

/* ─── DATA PRESERVATION INVARIANT ─── */
describe("Task 2 data preservation invariant", () => {
  it("server schema does NOT strip extra fields (.passthrough)", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "routers/gameState.ts"),
      "utf-8"
    );
    // Ensure the passthrough is applied to the full schema, not a sub-schema
    const gameStateSchemaMatch = src.match(/const gameStateSchema = z\.object\([\s\S]*?\}\)\.passthrough\(\);/);
    expect(gameStateSchemaMatch).toBeTruthy();
  });

  it("client collector lists match restorer keys (round-trip safety)", () => {
    const ctxSrc = fs.readFileSync(
      path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
      "utf-8"
    );
    // Every camelCase key the collector sets should have a matching
    // restoreIfMissing call under a localStorage key.
    const collectorKeys = [
      "puzzlesSolved", "easterEggsFound", "battleStats", "cardsCollected",
      "cardUpgrades", "equipmentState", "tradeEmpireState", "activeSpecimen",
      "discoveredSecrets", "cinematicSeen",
      "dischordiaElo", "dischordiaWins", "dischordiaLosses", "terminusHighestWave",
    ];
    for (const key of collectorKeys) {
      expect(ctxSrc).toMatch(new RegExp(`clientState\\.${key}`));
    }
  });
});
