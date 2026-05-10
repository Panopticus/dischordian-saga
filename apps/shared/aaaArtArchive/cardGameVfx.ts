/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Dischordia card-game VFX + soul stones

   Eight serialised card-event glows (draw, summon, buff,
   debuff, combo, destroy, void-drain, legendary-reveal) wired
   through DuelystGameUI's animation hooks, plus the seven
   faction soul-stone icons that back the SoulStones panel
   visual treatment (CDN-hosted; the SoulStones logic in
   apps/shared/soulStones.ts stays art-free — these are
   chrome assets, not gameplay state).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const CARD_VFX_IDS = [
  "card_buff_glow",
  "card_combo_chain",
  "card_debuff_curse",
  "card_destroy_shatter",
  "card_draw_glow",
  "card_legendary_reveal",
  "card_summon_burst",
  "card_void_drain",
] as const;
export type CardVfxId = (typeof CARD_VFX_IDS)[number];

export interface CardVfxUrls {
  readonly final: string;
  readonly original: string;
}

export function cardVfxUrls(id: CardVfxId): CardVfxUrls {
  return {
    final: assetUrl(`art/card_game/card_vfx/${id}.png`),
    original: assetUrl(`art/card_game/card_vfx/${id}_original.png`),
  };
}

export function cardVfxUrl(id: CardVfxId): string {
  return cardVfxUrls(id).final;
}

/* ─── Soul stones — one per combat faction ─── */

export const SOUL_STONE_FACTIONS = [
  "authority",
  "dreamer",
  "hierarchy",
  "insurgency",
  "mechronis",
  "terminus",
  "watcher",
] as const;
export type SoulStoneFaction = (typeof SOUL_STONE_FACTIONS)[number];

export interface SoulStoneUrls {
  readonly final: string;
  readonly original: string;
}

export function soulStoneUrls(faction: SoulStoneFaction): SoulStoneUrls {
  return {
    final: assetUrl(`art/card_game/soul_stones/soul_stone_${faction}.png`),
    original: assetUrl(`art/card_game/soul_stones/soul_stone_${faction}_original.png`),
  };
}

export function soulStoneUrl(faction: SoulStoneFaction): string {
  return soulStoneUrls(faction).final;
}

export function allCardGameUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of CARD_VFX_IDS) {
    const u = cardVfxUrls(id);
    urls.push(u.final, u.original);
  }
  for (const f of SOUL_STONE_FACTIONS) {
    const u = soulStoneUrls(f);
    urls.push(u.final, u.original);
  }
  return urls;
}
