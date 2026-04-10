/* ═══════════════════════════════════════════════════════
   ARK EVENT HANDLER — client-facing re-export of the shared
   handler. The real implementation lives in
   `shared/arkEventHandler.ts` so both the client (useDailyBrief
   hook) and the server (dailyBrief.completeEvent) can call it.

   This file is kept as a re-export facade so any legacy client
   imports from `@/game/arkEventHandler` continue to resolve
   without change.
   ═══════════════════════════════════════════════════════ */

export {
  processArkEvent,
  type RoomId,
  type EventType,
  type RoomEvent,
  type ArkEventResult,
} from "@shared/arkEventHandler";
