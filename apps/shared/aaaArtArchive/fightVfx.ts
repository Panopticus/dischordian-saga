/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Fight VFX layer

   17 hit-spark / projectile-trail / screen-flash assets.
   Six projectile_trail_<faction> entries map 1:1 to the
   six combat factions in `apps/client/src/game/duelyst/types.ts
   FACTION_COLORS` (authority, dreamer, hierarchy, insurgency,
   mechronis, terminus). The seventh "watcher" theme reuses the
   `super_screenflash` asset because the Watcher's signature is
   omniscient gaze, not a projectile — see fight VFX bible §3.4.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const FIGHT_VFX_IDS = [
  "block_shimmer",
  "character_glow_super_ready",
  "freeze_frame_outline",
  "heal_shimmer",
  "hit_spark_heavy",
  "hit_spark_light",
  "hit_spark_medium",
  "knockdown_dirt",
  "ko_blackout",
  "projectile_trail_authority",
  "projectile_trail_dreamer",
  "projectile_trail_hierarchy",
  "projectile_trail_insurgency",
  "projectile_trail_mechronis",
  "projectile_trail_terminus",
  "super_screenflash",
  "void_energy_burst",
] as const;
export type FightVfxId = (typeof FIGHT_VFX_IDS)[number];

export const FIGHT_VFX_PROJECTILE_FACTIONS = [
  "authority",
  "dreamer",
  "hierarchy",
  "insurgency",
  "mechronis",
  "terminus",
] as const;
export type FightVfxProjectileFaction = (typeof FIGHT_VFX_PROJECTILE_FACTIONS)[number];

export interface FightVfxUrls {
  readonly final: string;
  readonly original: string;
}

export function fightVfxUrls(id: FightVfxId): FightVfxUrls {
  return {
    final: assetUrl(`art/fight/vfx/${id}.png`),
    original: assetUrl(`art/fight/vfx/${id}_original.png`),
  };
}

export function fightVfxUrl(id: FightVfxId): string {
  return fightVfxUrls(id).final;
}

export function projectileTrailUrl(faction: FightVfxProjectileFaction): string {
  return fightVfxUrl(`projectile_trail_${faction}` as FightVfxId);
}

export function allFightVfxUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of FIGHT_VFX_IDS) {
    const u = fightVfxUrls(id);
    urls.push(u.final, u.original);
  }
  return urls;
}
