/* ═══════════════════════════════════════════════════════
   STREAMER SETTINGS — centralized localStorage-backed
   per-device preferences that affect on-screen presence,
   audio mix, and pacing for content creators.

   audit/16 PR 6 (Streamer persona — Strm1, Strm2, Strm4,
   Strm8). Single source of truth so hooks + Settings UI
   never disagree about the keys, defaults, or clamping
   behaviour.
   ═══════════════════════════════════════════════════════ */

/** localStorage keys used by the streamer-settings surface.
 *  Versioned in the prefix so a future schema change can
 *  invalidate cleanly (e.g. v2_…). */
export const STREAMER_KEYS = {
  voVolume: "loredex_streamer_vo_volume",
  sfxMuteList: "loredex_streamer_sfx_mute_list",
  blurPauseMenu: "loredex_streamer_blur_pause_menu",
  narrativeAnimSpeed: "loredex_streamer_narrative_anim_speed",
} as const;

/* ─── voVolume (Strm1) ─── */

const VO_VOLUME_DEFAULT = 1.0;

export function getVoVolume(): number {
  try {
    const raw = localStorage.getItem(STREAMER_KEYS.voVolume);
    if (raw == null) return VO_VOLUME_DEFAULT;
    const v = parseFloat(raw);
    if (!Number.isFinite(v)) return VO_VOLUME_DEFAULT;
    return Math.max(0, Math.min(1, v));
  } catch {
    return VO_VOLUME_DEFAULT;
  }
}

export function setVoVolume(v: number): void {
  try {
    const clamped = Math.max(0, Math.min(1, v));
    localStorage.setItem(STREAMER_KEYS.voVolume, String(clamped));
    window.dispatchEvent(new CustomEvent("streamer-settings-changed", { detail: { key: "voVolume", value: clamped } }));
  } catch {
    // localStorage unavailable; settings stay in-memory only.
  }
}

/* ─── sfxMuteList (Strm8) ─── */

export type SfxKind =
  | "item_pickup" | "door_unlock" | "door_locked" | "achievement"
  | "dialog_open" | "dialog_close" | "button_click" | "room_enter"
  | "casino_spin" | "casino_win" | "casino_jackpot" | "notification"
  | "puzzle_solve" | "puzzle_fail" | "quiz_correct" | "quiz_wrong"
  | "battle_victory" | "battle_defeat";

export function getSfxMuteList(): readonly SfxKind[] {
  try {
    const raw = localStorage.getItem(STREAMER_KEYS.sfxMuteList);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive — strip any non-string entries; the consumer's
    // type-check at use-site will reject unknown kinds anyway.
    return parsed.filter((x): x is SfxKind => typeof x === "string") as SfxKind[];
  } catch {
    return [];
  }
}

export function setSfxMuteList(list: readonly SfxKind[]): void {
  try {
    localStorage.setItem(STREAMER_KEYS.sfxMuteList, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("streamer-settings-changed", { detail: { key: "sfxMuteList", value: list } }));
  } catch {
    // see voVolume comment.
  }
}

export function isSfxMuted(kind: string): boolean {
  return getSfxMuteList().includes(kind as SfxKind);
}

/* ─── blurPauseMenu (Strm2) ─── */

export function getBlurPauseMenu(): boolean {
  try {
    return localStorage.getItem(STREAMER_KEYS.blurPauseMenu) === "true";
  } catch {
    return false;
  }
}

export function setBlurPauseMenu(on: boolean): void {
  try {
    localStorage.setItem(STREAMER_KEYS.blurPauseMenu, String(on));
    window.dispatchEvent(new CustomEvent("streamer-settings-changed", { detail: { key: "blurPauseMenu", value: on } }));
  } catch {
    // see voVolume comment.
  }
}

/* ─── narrativeAnimSpeed (Strm4) ─── */

const NARRATIVE_ANIM_SPEED_DEFAULT = 1.0;
const NARRATIVE_ANIM_SPEED_MIN = 0.5;
const NARRATIVE_ANIM_SPEED_MAX = 2.0;

export function getNarrativeAnimSpeed(): number {
  try {
    const raw = localStorage.getItem(STREAMER_KEYS.narrativeAnimSpeed);
    if (raw == null) return NARRATIVE_ANIM_SPEED_DEFAULT;
    const v = parseFloat(raw);
    if (!Number.isFinite(v)) return NARRATIVE_ANIM_SPEED_DEFAULT;
    return Math.max(NARRATIVE_ANIM_SPEED_MIN, Math.min(NARRATIVE_ANIM_SPEED_MAX, v));
  } catch {
    return NARRATIVE_ANIM_SPEED_DEFAULT;
  }
}

export function setNarrativeAnimSpeed(v: number): void {
  try {
    const clamped = Math.max(NARRATIVE_ANIM_SPEED_MIN, Math.min(NARRATIVE_ANIM_SPEED_MAX, v));
    localStorage.setItem(STREAMER_KEYS.narrativeAnimSpeed, String(clamped));
    window.dispatchEvent(new CustomEvent("streamer-settings-changed", { detail: { key: "narrativeAnimSpeed", value: clamped } }));
  } catch {
    // see voVolume comment.
  }
}

export const NARRATIVE_ANIM_SPEED_BOUNDS = {
  min: NARRATIVE_ANIM_SPEED_MIN,
  max: NARRATIVE_ANIM_SPEED_MAX,
  default: NARRATIVE_ANIM_SPEED_DEFAULT,
} as const;
