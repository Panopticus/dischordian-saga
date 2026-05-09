/* ═══════════════════════════════════════════════════════
   React hooks over streamerSettings.

   audit/16 PR 6. Subscribe to the cross-tab/cross-component
   "streamer-settings-changed" CustomEvent so any React
   surface (Settings UI, MemorialCorridor, PauseMenu, etc.)
   stays in sync without prop-drilling.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import {
  getVoVolume,
  setVoVolume as setVoVolumeRaw,
  getSfxMuteList,
  setSfxMuteList as setSfxMuteListRaw,
  getBlurPauseMenu,
  setBlurPauseMenu as setBlurPauseMenuRaw,
  getNarrativeAnimSpeed,
  setNarrativeAnimSpeed as setNarrativeAnimSpeedRaw,
  type SfxKind,
} from "@/lib/streamerSettings";

interface ChangeDetail {
  key: string;
  value: unknown;
}

function useStreamerSettingValue<T>(
  key: string,
  read: () => T,
): T {
  const [value, setValue] = useState<T>(() => read());
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ChangeDetail>).detail;
      if (!detail || detail.key !== key) return;
      setValue(read());
    };
    window.addEventListener("streamer-settings-changed", onChange);
    return () => window.removeEventListener("streamer-settings-changed", onChange);
  }, [key, read]);
  return value;
}

/** Strm1 — VO volume. Returns a 0..1 multiplier; combine with
 *  the call-site's existing per-line baseline (e.g. 0.8). */
export function useVoVolume(): { value: number; set: (v: number) => void } {
  const value = useStreamerSettingValue("voVolume", getVoVolume);
  return { value, set: setVoVolumeRaw };
}

/** Strm8 — SFX mute list. Returns a frozen list + a setter. */
export function useSfxMuteList(): {
  value: readonly SfxKind[];
  set: (list: readonly SfxKind[]) => void;
} {
  const value = useStreamerSettingValue("sfxMuteList", getSfxMuteList);
  return { value, set: setSfxMuteListRaw };
}

/** Strm2 — pause-menu blur for IRL share. */
export function useBlurPauseMenu(): { value: boolean; set: (on: boolean) => void } {
  const value = useStreamerSettingValue("blurPauseMenu", getBlurPauseMenu);
  return { value, set: setBlurPauseMenuRaw };
}

/** Strm4 — narrative animation speed multiplier. Apply as
 *  e.g. `duration / speed` so 2.0 makes animations twice as fast. */
export function useNarrativeAnimSpeed(): { value: number; set: (v: number) => void } {
  const value = useStreamerSettingValue("narrativeAnimSpeed", getNarrativeAnimSpeed);
  return { value, set: setNarrativeAnimSpeedRaw };
}
