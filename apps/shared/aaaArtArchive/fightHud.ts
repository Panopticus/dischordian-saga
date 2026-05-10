/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Fight HUD elements

   17 HUD chrome pieces (combo pops, health bars, KO splash,
   round cards, super meter, banners, etc.). Each ships a
   `<id>.png` final + `<id>_original.png` raw export so the
   art team can iterate without breaking gameplay.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const FIGHT_HUD_IDS = [
  "combo_pop_bronze",
  "combo_pop_gold",
  "combo_pop_platinum",
  "combo_pop_silver",
  "flawless_victory_banner",
  "health_bar_p1",
  "health_bar_p2",
  "ko_splash",
  "perfect_banner",
  "portrait_frame_p1",
  "portrait_frame_p2",
  "round_card_final",
  "round_card_round_1",
  "round_card_round_2",
  "super_meter",
  "timer_clock",
  "victory_banner",
] as const;
export type FightHudId = (typeof FIGHT_HUD_IDS)[number];

export interface FightHudUrls {
  readonly final: string;
  readonly original: string;
}

export function fightHudUrls(id: FightHudId): FightHudUrls {
  return {
    final: assetUrl(`art/fight/hud/${id}.png`),
    original: assetUrl(`art/fight/hud/${id}_original.png`),
  };
}

export function fightHudUrl(id: FightHudId): string {
  return fightHudUrls(id).final;
}

export function allFightHudUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of FIGHT_HUD_IDS) {
    const u = fightHudUrls(id);
    urls.push(u.final, u.original);
  }
  return urls;
}
