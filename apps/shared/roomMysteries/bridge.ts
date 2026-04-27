/* ═══════════════════════════════════════════════════════
   BRIDGE MYSTERY — verb × hotspot table

   The Bridge is the Ark's command deck. Per the design doc
   (docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md, Beat I),
   it is where the Conspiracy Board, Timeline Projector, and
   Captain's Chair live. The chair belonged to Dr. Lyra Vox —
   the same hand whose neural-bridge appears in the Med Bay.

   Tier progression (apps/shared/roomTier.ts):
     0 → 1   first Look on any clue-bearing hotspot →
             `bridge_first_clue_found`
     1 → 2   the existing nav-calibration puzzle fires
             `fast_travel_unlocked` (already shipping)
     2 → 3   `bridge_war_table_online` — set when the player
             pins their first conspiracy thread (left to a
             follow-up runtime hook for now)

   Hotspot ids match the Bridge entries already declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime can wire `room-mystery:bridge:<id>` actions
   onto the existing rectangles without coordinate authoring.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type BridgeHotspotId =
  | "tactical-display"
  | "timeline-projector"
  | "captains-chair"
  | "nav-console"
  | "diplomacy-table";

export const BRIDGE_MYSTERY: RoomMysteryModule<BridgeHotspotId> = {
  roomId: "bridge",
  responses: {
    "tactical-display": {
      look: {
        narration:
          "The Conspiracy Board hangs above the central console — a web of pinned faces, factions, and ledger lines, half of them connected with red string the previous crew never finished tying off. Three threads end mid-air, leading to the same blank pin.",
        logsClue: {
          id: "clue-bridge-unfinished-threads",
          title: "Three threads pointing at a blank pin",
          body: "The previous crew left three Conspiracy-Board threads ending at the same unlabelled pin. Whoever they suspected, they did not write the name down before the cryo protocol fired.",
          source: "bridge",
          order: 0,
        },
        setsFlag: "bridge_first_clue_found",
      },
      talk: {
        narration:
          "Elara: \"You can pull a thread, but pull gently. The board has a habit of remembering everything you ask it.\"",
      },
    },
    "timeline-projector": {
      look: {
        narration:
          "The Ages of the Saga unfold above the projector — a continuum of events still echoing forward. Two entries are timestamped after the Ark's launch but before your wake-cycle. Someone added them. Someone with command access.",
        logsClue: {
          id: "clue-bridge-post-launch-entries",
          title: "Timeline entries added after the launch",
          body: "Two Timeline-Projector entries were inserted after the Ark left dock and before you woke. Only Captain-tier credentials can edit the Timeline. Vox should not have been the one.",
          source: "bridge",
          order: 1,
        },
        setsFlag: "bridge_first_clue_found",
      },
    },
    "captains-chair": {
      look: {
        narration:
          "The command chair sits empty. The seat cushion holds a body-shape that hasn't faded with two centuries of disuse — someone has been sitting here, recently, when no one is awake. A personal data pad is wedged in the armrest.",
        logsClue: {
          id: "clue-bridge-recent-occupant",
          title: "A chair that hasn't gone cold",
          body: "The captain's chair carries a fresh body impression. Either Vox is up, or something has been wearing her shape on the Bridge while the rest of the ship slept.",
          source: "bridge",
          order: 2,
        },
        setsFlag: "bridge_first_clue_found",
      },
      use: {
        narration:
          "You sit. The armrest terminal lights at your touch — biometric handshake, no challenge. Vox keyed the chair to anyone in her access tier. You are, apparently, in her access tier.",
        // Authoring hook for the temporal-lens combine flow described
        // in docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md — the
        // verb-coin overlay (PointAndClickScene) will eventually let
        // the player aim a held lens at this hotspot to unlock the
        // `kael_theft_witnessed` flag. The narration here is the
        // bare-handed Use; the lens-aimed version will live in a
        // follow-up combine rule.
      },
      talk: {
        narration:
          "Elara: \"She won't answer. She didn't even leave a recording. That's the part of it that still makes me angry.\"",
      },
    },
    "nav-console": {
      look: {
        narration:
          "Star charts, route calculations, an alien glyph interface. The console hums but won't accept input until the glyph sequence is matched. The previous crew's last attempt is still on the screen — three glyphs in, one wrong. They were close.",
        logsClue: {
          id: "clue-bridge-nav-attempt",
          title: "An interrupted nav-calibration attempt",
          body: "The Navigation Console holds the previous crew's last unfinished glyph entry. They got three of the four right. Whoever was solving it knew the alphabet — they were a few seconds short.",
          source: "bridge",
          order: 3,
        },
        setsFlag: "bridge_first_clue_found",
      },
      // The `use` verb intentionally falls through to the existing
      // nav-calibration branch in ArkExplorerPage, which opens the
      // puzzle modal. On success that branch sets `fast_travel_unlocked`
      // (Tier 1 → 2 advancement).
    },
    "diplomacy-table": {
      look: {
        narration:
          "The Diplomacy Table holds holographic faction representatives mid-gesture, frozen at the instant the cryo order interrupted them. One seat is empty. The chair beside it has been pulled out, as if someone left in a hurry.",
        logsClue: {
          id: "clue-bridge-empty-seat",
          title: "A seat that was vacated mid-negotiation",
          body: "The Diplomacy Table froze mid-session with one seat empty and the adjacent chair pulled out. Someone walked out of a Bridge negotiation moments before the Ark went into cryo. Their identity is missing from the holo-record.",
          source: "bridge",
          order: 4,
        },
        setsFlag: "bridge_first_clue_found",
      },
    },
  },
};
