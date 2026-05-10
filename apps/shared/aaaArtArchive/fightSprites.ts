/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Fighter sprite atlases (May 2026 drop)

   Per-fighter 21-pose sprite sheets feeding FightArena2D.
   Source archive: AAA Final/Art Archive 5.10.26.zip →
   art/fight/sprites/<id>/<pose>.png. Mirrored 1:1 to
   apps/client/public/art/fight/sprites/<id>/<pose>.png and
   resolved through assetUrl() so the production CDN serves
   the binaries.

   Locke is canonically the lone tutor with a "crouch_attack"
   eighth-attack pose (Adjudicator stance). Every other
   fighter ships the 21-pose canonical set.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const FIGHT_SPRITE_POSES = [
  "attack_heavy_kick",
  "attack_heavy_punch",
  "attack_light_kick",
  "attack_light_punch",
  "attack_medium_kick",
  "attack_medium_punch",
  "block_active",
  "crouch",
  "hit_high",
  "hit_low",
  "hit_mid",
  "idle",
  "jump",
  "knockdown",
  "special_1",
  "special_2",
  "super_move",
  "taunt",
  "victory",
  "walk_backward",
  "walk_forward",
] as const;
export type FightSpritePose = (typeof FIGHT_SPRITE_POSES)[number];

export const FIGHT_SPRITE_LOCKE_EXTRA_POSES = ["crouch_attack"] as const;
export type FightSpriteLockeExtraPose = (typeof FIGHT_SPRITE_LOCKE_EXTRA_POSES)[number];

/** Canonical archive ids — these match the directory names under
 *  art/fight/sprites/. They differ from `gameData.ts` fighter ids
 *  (e.g. `the_eyes` here vs `eyes` there) because the archive
 *  preserves the producer's slugs. Use `FIGHT_SPRITE_ID_BY_FIGHTER`
 *  below to bridge to the gameData ids. */
export const FIGHT_SPRITE_IDS = [
  "agent_zero",
  "antiquarian",
  "architect",
  "collector",
  "conexus",
  "degen",
  "dreamer",
  "eidola",
  "elara",
  "engineer",
  "enigma_malkia",
  "game_master",
  "iron_lion",
  "locke",
  "matrikala",
  "necromancer",
  "nilmorg",
  "programmer",
  "seer",
  "shadow_tongue",
  "source_kael",
  "the_eyes",
  "the_human",
  "warlord",
  "watcher",
] as const;
export type FightSpriteId = (typeof FIGHT_SPRITE_IDS)[number];

/** Bridge from gameData.ts FighterData.id → archive sprite id.
 *  Bidirectional: query either way via the helpers below. */
export const FIGHT_SPRITE_ID_BY_FIGHTER: Readonly<Record<string, FightSpriteId>> = {
  "agent-zero": "agent_zero",
  "antiquarian": "antiquarian",
  "architect": "architect",
  "collector": "collector",
  "conexus-authority": "conexus",
  "degen": "degen",
  "dreamer": "dreamer",
  "eidola": "eidola",
  "elara": "elara",
  "engineer": "engineer",
  "enigma": "enigma_malkia",
  "game-master": "game_master",
  "iron-lion": "iron_lion",
  "adjudicator-locke": "locke",
  "locke": "locke",
  "matrikala": "matrikala",
  "necromancer": "necromancer",
  "nilmorg": "nilmorg",
  "programmer": "programmer",
  "seer": "seer",
  "shadow-tongue": "shadow_tongue",
  "source": "source_kael",
  "kael-recruiter": "source_kael",
  "eyes": "the_eyes",
  "the-eyes": "the_eyes",
  "the-human": "the_human",
  "human": "the_human",
  "warlord": "warlord",
  "watcher": "watcher",
};

export function fightSpriteIdForFighter(fighterId: string): FightSpriteId | null {
  return FIGHT_SPRITE_ID_BY_FIGHTER[fighterId] ?? null;
}

export function fightSpriteUrl(id: FightSpriteId, pose: FightSpritePose): string {
  return assetUrl(`art/fight/sprites/${id}/${pose}.png`);
}

export function fightSpriteUrlForFighter(
  fighterId: string,
  pose: FightSpritePose,
): string | null {
  const id = fightSpriteIdForFighter(fighterId);
  return id ? fightSpriteUrl(id, pose) : null;
}

export function lockeCrouchAttackUrl(): string {
  return assetUrl("art/fight/sprites/locke/crouch_attack.png");
}

/** All canonical (id, pose) → URL pairs — total 25 × 21 = 525, plus
 *  the single Locke crouch_attack for 526. Surfaced for liveness
 *  probes and the asset-coverage smoke test. */
export function allFightSpriteUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of FIGHT_SPRITE_IDS) {
    for (const pose of FIGHT_SPRITE_POSES) {
      urls.push(fightSpriteUrl(id, pose));
    }
  }
  urls.push(lockeCrouchAttackUrl());
  return urls;
}
