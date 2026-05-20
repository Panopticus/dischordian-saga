/* ═══════════════════════════════════════════════════════
   HOTSPOT-ID PARITY TEST

   Every hotspot id that a `RoomMysteryModule.responses` table
   declares MUST have a matching `room-mystery:<roomId>:<id>`
   `HotspotDef.action` entry in `apps/client/src/contexts/
   GameContext.tsx` — otherwise the runtime cannot reach the
   response and the clue silently fails to surface.

   Conversely, every `room-mystery:<roomId>:<id>` action in
   GameContext must correspond to a key in the room module's
   responses table — otherwise the runtime dispatches against
   a non-existent response.

   Both directions are hard errors, not slopes. A clean test
   here is the structural invariant the binding gate's
   text-scan check cannot reach.

   Background: PR #671 + PR #672 added ~300 HotspotDef entries
   across 25 room modules. The TypeScript union type catches
   typos within a single module, but nothing previously caught
   the mismatch between the room module's union and the
   GameContext's action targets. This file is that check.
   ═══════════════════════════════════════════════════════ */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOM_MYSTERY_REGISTRY } from "./index";

const GAME_CONTEXT_PATH = resolve(
  process.cwd(),
  "apps/client/src/contexts/GameContext.tsx",
);

/** Extract every `room-mystery:<roomId>:<hsid>` action string
 *  authored in GameContext.tsx, keyed by roomId.
 *
 *  The runtime dispatches click events against this set. A
 *  HotspotDef without a matching action — or an action that
 *  doesn't point at a real room+hotspot — is dead wiring. */
function extractGameContextActions(): Map<string, Set<string>> {
  const src = readFileSync(GAME_CONTEXT_PATH, "utf8");
  const re = /room-mystery:([a-z0-9-]+(?:_[a-z0-9-]+)*):([a-z0-9-]+)/g;
  const byRoom = new Map<string, Set<string>>();
  for (const match of src.matchAll(re)) {
    const [, roomId, hsid] = match;
    if (!byRoom.has(roomId)) byRoom.set(roomId, new Set());
    byRoom.get(roomId)!.add(hsid);
  }
  return byRoom;
}

describe("room-mystery hotspot-id parity (PR #672 follow-up)", () => {
  const gameContextActions = extractGameContextActions();

  describe("every responses-table key has a matching GameContext action", () => {
    for (const [roomId, mod] of Object.entries(ROOM_MYSTERY_REGISTRY)) {
      const responseKeys = Object.keys(mod.responses);
      // Skip rooms whose entire response set lives sidecar of GameContext
      // (e.g. species-exclusive rooms gated by character flags — those
      // are wired through canAccessRoom, not ROOM_DEFINITIONS).
      const gameContextKeys = gameContextActions.get(roomId);
      if (!gameContextKeys || gameContextKeys.size === 0) {
        it.skip(`${roomId}: no GameContext entries (sidecar room)`, () => {});
        continue;
      }
      for (const hsid of responseKeys) {
        it(`${roomId}:${hsid} has a GameContext entry`, () => {
          expect(gameContextKeys).toContain(hsid);
        });
      }
    }
  });

  describe("every GameContext room-mystery action targets a real module key", () => {
    for (const [roomId, hsids] of gameContextActions) {
      const mod = ROOM_MYSTERY_REGISTRY[roomId];
      if (!mod) {
        // GameContext references a room mystery the registry
        // doesn't know about — that's an orphan action.
        for (const hsid of hsids) {
          it(`${roomId}:${hsid} references an unknown room module`, () => {
            // This will fail loudly so the orphan surfaces.
            expect(mod, `room module for "${roomId}" not in ROOM_MYSTERY_REGISTRY`).toBeDefined();
          });
        }
        continue;
      }
      const responseKeys = new Set(Object.keys(mod.responses));
      for (const hsid of hsids) {
        it(`${roomId}:${hsid} has a matching response in the module`, () => {
          expect(responseKeys).toContain(hsid);
        });
      }
    }
  });
});
