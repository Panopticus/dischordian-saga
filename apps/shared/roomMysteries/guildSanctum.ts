/* ═══════════════════════════════════════════════════════
   GUILD SANCTUM MYSTERY — sigil-altar + allegiance-pad

   Two-hotspot module. Sets guild_sanctum_seen on first-look
   at the sigil-altar. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type GuildSanctumHotspotId = "sigil-altar" | "allegiance-pad";

export const GUILD_SANCTUM_MYSTERY: RoomMysteryModule<GuildSanctumHotspotId> = {
  roomId: "guild-sanctum",
  responses: {
    "sigil-altar": {
      look: {
        narration: {
          lucid:
            "The sigil-altar at the room's centre is a low brass slab inscribed with every guild-sigil the Ark has ever recognised. Some sigils are scratched out. Some are double-engraved. The altar's history is, in effect, a litigation record — every alliance the ship has formally entered or formally broken is permanently on its surface.",
          fragmented:
            "Every alliance. Every alliance. Every alliance is on the altar.",
          luminous:
            "The altar carries the ship's diplomatic memory. Lyra's discipline was that no allegiance was ever scrubbed — even broken ones stayed engraved, only crossed through. That preserves the institutional record against the editor's preferred kind of revision. The altar is, in retrospect, one of the few surfaces on the ship he could not work on.",
        },
        voId: "elara.guild-sanctum.sigil-altar.look",
        setsFlag: "guild_sanctum_seen",
        logsClue: {
          id: "clue-guild-sanctum-engraved-history",
          title: "The sigil-altar preserves every alliance, broken or kept",
          body:
            "The Guild Sanctum's altar engraves every alliance the Ark has formally entered. Broken alliances are crossed through but never erased — Lyra's deliberate discipline against editor-style revision. The altar is one of the ship's few editor-resistant surfaces.",
          source: "guild-sanctum",
          order: 0,
        },
      },
    },
    "allegiance-pad": {
      look: {
        narration: {
          lucid:
            "A small pressure-pad in the floor in front of the altar. Stepping onto it engages the sigil-altar's recording function — your current allegiances are read from your character signature and committed to the engraving. Lyra's design forced every visitor to be on the record before they spoke.",
          fragmented:
            "On the record. On the record. On the record. Before you speak.",
          luminous:
            "The pad puts you on the record before you can address the altar. It is the room's gentlest enforcement: you cannot use the sanctum's history without contributing to it. This is, on Lyra's notes, the rule of every honest archive — readers leave a fingerprint, so the record knows who consulted it. The editor refuses that rule. The pad is an editor-resistant ritual.",
        },
        voId: "elara.guild-sanctum.allegiance-pad.look",
        logsClue: {
          id: "clue-guild-sanctum-allegiance-pad",
          title: "The allegiance pad records every visitor",
          body:
            "The Guild Sanctum's allegiance-pad records every visitor's current allegiances when they step onto it — Lyra's rule of honest archiving (readers leave a fingerprint). The Editor's method is to read without leaving a fingerprint. The pad is editor-resistant by design.",
          source: "guild-sanctum",
          order: 1,
        },
      },
    },
  },
};
