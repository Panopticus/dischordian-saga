/* ═══════════════════════════════════════════════════════
   BEAT D CARGO HOTSPOTS — Free Ports mission board

   Two anchors in the cargo-hold backdrop:
     1. Dockmaster's ledger-console — the mission board's
        physical interaction point. Click opens the three
        posting-slates projected onto the hero crate.
     2. Free Ports hero crate — the 1,047-year delivery
        reveal anchor. Its bronze seal warms one notch on
        posting accept.

   Positions match the room-cargo-hold.txt prompt additions.
   ═══════════════════════════════════════════════════════ */

import type { PreludeAnchorColor } from "./preludeRoomAnchors";

export interface BeatDCargoHotspot {
  id: string;
  displayName: string;
  label: string;
  position: { leftPct: number; topPct: number };
  color: PreludeAnchorColor;
  examinedFlag: string;
}

export const BEAT_D_LEDGER_CONSOLE: BeatDCargoHotspot = {
  id: "beat_d_ledger_console",
  displayName: "Dockmaster's Ledger Console",
  label: "Open the mission board",
  position: { leftPct: 32, topPct: 68 },
  color: "cyan",
  examinedFlag: "prelude_beat_d_ledger_console_examined",
};

export const BEAT_D_FREE_PORTS_CRATE: BeatDCargoHotspot = {
  id: "beat_d_free_ports_crate",
  displayName: "Free Ports Hero Crate",
  label: "Inspect the Free Ports hero crate",
  position: { leftPct: 38, topPct: 60 },
  color: "amber",
  examinedFlag: "prelude_beat_d_free_ports_crate_examined",
};

export const BEAT_D_CARGO_HOTSPOTS: readonly BeatDCargoHotspot[] = [
  BEAT_D_LEDGER_CONSOLE,
  BEAT_D_FREE_PORTS_CRATE,
];
