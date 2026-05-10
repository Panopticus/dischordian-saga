/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Fight stage parallax backdrops

   Each stage ships a three-plane parallax (background /
   midground / foreground) JPG triplet. Mirrors 1:1 to
   apps/client/public/art/fight/stages/<stageId>/{bg,mg,fg}.jpg.

   The archive's stageId slugs match the gameData.ts ARENAS
   ids except for the `stage_` prefix — the
   `parallaxForArenaId()` helper normalises that.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const FIGHT_STAGE_IDS = [
  "stage_architect_throne",
  "stage_blood_weave",
  "stage_crucible",
  "stage_draft_chamber",
  "stage_mechronis",
  "stage_necromancer_castle",
  "stage_new_babylon",
  "stage_panopticon",
  "stage_ranked_table",
  "stage_shadow_sanctum",
  "stage_terminus",
  "stage_terminus_core",
  "stage_thaloria",
  "stage_tournament_hall",
  "stage_watcher_panopticon",
] as const;
export type FightStageId = (typeof FIGHT_STAGE_IDS)[number];

export interface FightStageParallax {
  /** Far-plane backdrop. */
  readonly bg: string;
  /** Mid-plane silhouettes/structures. */
  readonly mg: string;
  /** Near-plane foreground occluders. */
  readonly fg: string;
}

export function fightStageParallax(id: FightStageId): FightStageParallax {
  return {
    bg: assetUrl(`art/fight/stages/${id}/bg.jpg`),
    mg: assetUrl(`art/fight/stages/${id}/mg.jpg`),
    fg: assetUrl(`art/fight/stages/${id}/fg.jpg`),
  };
}

/** ARENAS.id → archive stageId. Cross-checked against gameData.ts
 *  in `aaaArtArchive.test.ts` so a regression in the arena registry
 *  trips a parity failure. */
export const FIGHT_STAGE_ID_BY_ARENA: Readonly<Record<string, FightStageId>> = {
  "architect-throne": "stage_architect_throne",
  "blood-weave": "stage_blood_weave",
  "crucible": "stage_crucible",
  "draft-chamber": "stage_draft_chamber",
  "mechronis": "stage_mechronis",
  "necromancer-castle": "stage_necromancer_castle",
  "new-babylon": "stage_new_babylon",
  "panopticon": "stage_panopticon",
  "ranked-table": "stage_ranked_table",
  "shadow-sanctum": "stage_shadow_sanctum",
  "terminus": "stage_terminus",
  "terminus-core": "stage_terminus_core",
  "thaloria": "stage_thaloria",
  "tournament-hall": "stage_tournament_hall",
  "watcher-panopticon": "stage_watcher_panopticon",
};

export function parallaxForArenaId(arenaId: string): FightStageParallax | null {
  const id = FIGHT_STAGE_ID_BY_ARENA[arenaId];
  return id ? fightStageParallax(id) : null;
}

export function allFightStageUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of FIGHT_STAGE_IDS) {
    const p = fightStageParallax(id);
    urls.push(p.bg, p.mg, p.fg);
  }
  return urls;
}
