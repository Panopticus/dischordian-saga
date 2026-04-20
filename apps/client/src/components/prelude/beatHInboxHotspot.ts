/* ═══════════════════════════════════════════════════════
   BEAT H INBOX HOTSPOT — comms-array envelope + narrator
                          swap panel

   Two anchors in the comms-array backdrop:
     1. Central console envelope-glyph — the Inbox
        interaction (Locke's message). Reuses the existing
        vfx_inbox_envelope_unfold + edge_sentence_bloom on
        click.
     2. Human-signal panel — left-wall corrupted-red
        waveform. The diegetic trigger for the Beat 3
        narrator swap, previously un-anchored.

   Positions match the room-comms-array.txt prompt.
   ═══════════════════════════════════════════════════════ */

import type { PreludeAnchorColor } from "./preludeRoomAnchors";

export interface BeatHInboxHotspotConfig {
  id: string;
  displayName: string;
  label: string;
  position: { leftPct: number; topPct: number };
  color: PreludeAnchorColor;
  examinedFlag: string;
}

export const BEAT_H_ENVELOPE_GLYPH: BeatHInboxHotspotConfig = {
  id: "beat_h_envelope_glyph",
  displayName: "Incoming Message",
  label: "Open the incoming message",
  position: { leftPct: 50, topPct: 55 },
  color: "cyan",
  examinedFlag: "prelude_beat_h_inbox_examined",
};

export const BEAT_H_HUMAN_SIGNAL_PANEL: BeatHInboxHotspotConfig = {
  id: "beat_h_human_signal_panel",
  displayName: "Human Signal Panel",
  label: "Listen to the corrupted-red signal",
  position: { leftPct: 22, topPct: 48 },
  color: "red",
  examinedFlag: "prelude_beat_h_human_signal_examined",
};

export const BEAT_H_INBOX_HOTSPOTS: readonly BeatHInboxHotspotConfig[] = [
  BEAT_H_ENVELOPE_GLYPH,
  BEAT_H_HUMAN_SIGNAL_PANEL,
];
