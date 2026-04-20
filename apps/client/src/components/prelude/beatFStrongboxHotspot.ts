/* ═══════════════════════════════════════════════════════
   BEAT F STRONGBOX HOTSPOT — biometric lockbox

   The mess-hall Prince's Archive strongbox at 22% / 50%.
   Driven by BeatFBiometricLockbox.tsx; position pinned here
   so the VFX overlay can paint idle/hover/examined glows at
   the correct backdrop coordinate.

   The strongbox lives on the Archive center shelf alongside
   the Beat E toy-soldier anchor (28% / 68%) and under the
   framed diploma (66% / 42%). See room-mess-hall.txt.
   ═══════════════════════════════════════════════════════ */

import type { PreludeAnchorColor } from "./preludeRoomAnchors";

export interface BeatFStrongboxHotspotConfig {
  id: string;
  displayName: string;
  label: string;
  position: { leftPct: number; topPct: number };
  color: PreludeAnchorColor;
  /** Color when the biometric scan succeeds. */
  successColor: PreludeAnchorColor;
  examinedFlag: string;
}

export const BEAT_F_STRONGBOX: BeatFStrongboxHotspotConfig = {
  id: "beat_f_strongbox",
  displayName: "Biometric Lockbox",
  label: "Place your hand on the biometric lockbox",
  position: { leftPct: 22, topPct: 50 },
  color: "cyan",
  successColor: "green",
  examinedFlag: "prelude_beat_f_strongbox_examined",
};
