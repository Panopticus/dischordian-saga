/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Fight + card audio drop

   - Stage music: 15 MP3 stems, one per fight stage. Aligned
     1:1 with `fightStages.ts FIGHT_STAGE_IDS`.
   - Voice barks: announcer + fighter call-and-response WAVs.
   - Fight SFX packs: combat + special compiled WAVs.
   - Card-game SFX: 10 per-event MP3s feeding DuelystGameUI's
     audio cues.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

import {
  FIGHT_STAGE_ID_BY_ARENA,
  FIGHT_STAGE_IDS,
  type FightStageId,
} from "./fightStages";

export function stageMusicUrl(id: FightStageId): string {
  return assetUrl(`audio/stage_music/${id}.mp3`);
}

export function stageMusicForArenaId(arenaId: string): string | null {
  const id = FIGHT_STAGE_ID_BY_ARENA[arenaId];
  return id ? stageMusicUrl(id) : null;
}

/* ─── Voice barks ─── */

export const VOICE_BARK_IDS = [
  "announcer_lines",
  "female_fighter_barks",
  "male_fighter_barks",
] as const;
export type VoiceBarkId = (typeof VOICE_BARK_IDS)[number];

export function voiceBarkUrl(id: VoiceBarkId): string {
  return assetUrl(`audio/voice_barks/${id}.wav`);
}

/* ─── Fight SFX packs ─── */

export const FIGHT_SFX_IDS = ["combat_sfx_pack", "special_sfx_pack"] as const;
export type FightSfxId = (typeof FIGHT_SFX_IDS)[number];

export function fightSfxUrl(id: FightSfxId): string {
  return assetUrl(`audio/sfx/fight/${id}.mp3`);
}

/* ─── Card-game SFX ─── */

export const CARD_SFX_IDS = [
  "card_cancel",
  "card_damage",
  "card_hover",
  "card_pickup",
  "card_play",
  "draw",
  "mulligan",
  "shuffle",
  "trigger_oncast",
  "void_energy_spend",
] as const;
export type CardSfxId = (typeof CARD_SFX_IDS)[number];

export function cardSfxUrl(id: CardSfxId): string {
  return assetUrl(`audio/sfx/card-game/${id}.mp3`);
}

export function allFightAudioUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of FIGHT_STAGE_IDS) urls.push(stageMusicUrl(id));
  for (const id of VOICE_BARK_IDS) urls.push(voiceBarkUrl(id));
  for (const id of FIGHT_SFX_IDS) urls.push(fightSfxUrl(id));
  for (const id of CARD_SFX_IDS) urls.push(cardSfxUrl(id));
  return urls;
}
