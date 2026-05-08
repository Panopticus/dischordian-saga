/* ═══════════════════════════════════════════════════════
   NPC WORLD-DEATH STATE — gating helpers

   When a recruited NPC dies, the canonical NPC's world
   presence is *temporarily blocked* (NOT deleted). All
   downstream surfaces that read from NPC content must
   call `isNpcKilledInWorld(npcKey, ...)` and treat a
   killed-in-world NPC as silent.

   The block is lifted when:
    - Path A: Resurrection Protocols quest completes
      (NPC restored on the ark, fully alive again).
    - Path B: necromancer global event fires while quest
      open (NPC alive off-ship; quests/access re-open
      but NPC does not rejoin the crew).
    - Direct act-progression beat that requires the NPC
      alive (force-lift, sets pathBPending).

   This module is consumed by:
    - apps/shared/companionRoomRegistry.ts (hide rooms)
    - apps/shared/romanceLadders.ts (block ladder ticks)
    - apps/shared/companionAbilities.ts (block grants)
    - apps/shared/episodeMysteries.ts (block episode triggers)
    - apps/server/routers/* (block dialog/quest endpoints)
   ═══════════════════════════════════════════════════════ */

import type { ResurrectableNpcKey } from "./resurrectionProtocols";

/** Per-(userId, npcKey) world-death record. Mirrors the row shape of
 *  the `npc_world_death_state` table and the analogous in-memory copy
 *  the server keeps in NpcWorldDeathStore. */
export interface NpcWorldDeathRecord {
  userId: number;
  npcKey: ResurrectableNpcKey;
  killedMemberKey: string;
  diedAtCycle: number;
  diedAtMs: number;
  /** True after Path A completes — NPC is alive on the ark, world
   *  block fully lifted. The row may be retained for audit. */
  resolvedPathA?: boolean;
  /** True after Path B fires — NPC is alive off-ship; world block
   *  lifted for quest/dialog access but NPC is not on the crew. */
  resolvedPathB?: boolean;
}

/** Read-side gating function. Returns true if the NPC is currently
 *  silenced in the world (i.e. there's a death record AND neither
 *  Path A nor Path B has fired yet). */
export function isNpcKilledInWorld(
  records: NpcWorldDeathRecord[],
  npcKey: string,
): boolean {
  const rec = records.find((r) => r.npcKey === npcKey);
  if (!rec) return false;
  return !rec.resolvedPathA && !rec.resolvedPathB;
}

/** Has the NPC been resurrected to the ark (Path A completed)? */
export function isNpcResurrectedOnArk(
  records: NpcWorldDeathRecord[],
  npcKey: string,
): boolean {
  const rec = records.find((r) => r.npcKey === npcKey);
  return Boolean(rec?.resolvedPathA);
}

/** Has the NPC come back off-ship via Path B? They are alive in the
 *  world but not on the crew, with a reputation hit applied. */
export function isNpcReturnedOffShip(
  records: NpcWorldDeathRecord[],
  npcKey: string,
): boolean {
  const rec = records.find((r) => r.npcKey === npcKey);
  return Boolean(rec?.resolvedPathB);
}

/** Compose a death record. Caller persists to `npc_world_death_state`. */
export function recordNpcWorldDeath(args: {
  userId: number;
  npcKey: ResurrectableNpcKey;
  killedMemberKey: string;
  diedAtCycle: number;
  diedAtMs: number;
}): NpcWorldDeathRecord {
  return { ...args };
}

/** Flag this record as Path-A-resolved. Caller persists. */
export function markPathAResolved(
  rec: NpcWorldDeathRecord,
): NpcWorldDeathRecord {
  return { ...rec, resolvedPathA: true };
}

/** Flag this record as Path-B-resolved. Caller persists. */
export function markPathBResolved(
  rec: NpcWorldDeathRecord,
): NpcWorldDeathRecord {
  return { ...rec, resolvedPathB: true };
}
