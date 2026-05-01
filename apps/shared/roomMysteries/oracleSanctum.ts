/* ═══════════════════════════════════════════════════════
   ORACLE SANCTUM MYSTERY — pool, tablet, brazier

   Three-hotspot module for the deck-9 oracle-pool sanctum.
   Sets oracle_consulted on first-look at the oracle-pool.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type OracleSanctumHotspotId =
  | "oracle-pool"
  | "prophecy-tablet"
  | "incense-brazier";

export const ORACLE_SANCTUM_MYSTERY: RoomMysteryModule<OracleSanctumHotspotId> = {
  roomId: "oracle-sanctum",
  responses: {
    "oracle-pool": {
      look: {
        narration: {
          lucid:
            "The pool is a circle of still water sunk into the sanctum floor, brass-rimmed, sigil-engraved. The water is luminous from below — not lit, exactly, but bright in the way a deep well is bright when something is reflecting up. Whatever is reflecting up is, by my best instruments, not in the pool.",
          fragmented:
            "Not in the pool. Not in the pool. Something is reflecting up. Something — something — something is reflecting up.",
          luminous:
            "The pool reflects something that is not in the pool. That is the oracle's working principle — the water acts as an aperture into a wider perceptual surface, and what surfaces is whatever the witness brings with them. We are bringing the case. The pool will, eventually, surface a piece of the case we did not know we were carrying.",
        },
        voId: "elara.oracle-sanctum.oracle-pool.look",
        setsFlag: "oracle_consulted",
        logsClue: {
          id: "clue-oracle-pool-aperture",
          title: "The oracle pool is an aperture, not a mirror",
          body:
            "The Oracle Sanctum's pool reflects something that is not in the pool — it functions as a perceptual aperture rather than a mirror. The witness brings their concerns; the pool surfaces what the witness has been carrying without realising it.",
          source: "oracle-sanctum",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the pool surfaces the Sanctuary's Final-
        // Rite logbook entry 8. Lore match: the pool is "an
        // aperture, not a mirror — what surfaces is whatever the
        // witness brings with them." The player is carrying the
        // question of the rite's continuity; the pool reflects
        // back the logbook with the two same-hand signatures.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e4",
          cluesFound: ["wraith.e4.sanctuary_log"],
        },
      },
    },
    "prophecy-tablet": {
      look: {
        narration: {
          lucid:
            "The prophecy-tablet on the back wall is a brass-pedestal'd slate. Its surface is currently blank, but the surface has been written and erased so many times the brass beneath the slate is worn smooth. Whatever it has written on it next, it will be the latest of many.",
          fragmented:
            "Many. Many. Many prophecies. Many prophecies. Many. Many. Many.",
          luminous:
            "The tablet writes itself in response to the pool. It has done so many thousands of times. The brass beneath its slate is worn the way a stair is worn by foot traffic — by repeated honest use rather than by any single dramatic event. Whatever it tells us today, it has told someone before. We are part of a long line of readers.",
        },
        voId: "elara.oracle-sanctum.prophecy-tablet.look",
        logsClue: {
          id: "clue-oracle-tablet-many-readings",
          title: "The prophecy tablet has been read thousands of times",
          body:
            "The Oracle Sanctum's prophecy-tablet is brass-worn from thousands of readings. The oracle is not a one-time consultation — it is a long-term institutional surface that many prior readers have honestly used.",
          source: "oracle-sanctum",
          order: 1,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, looking at the prophecy-tablet surfaces
        // the Hierophant's daily-names ceremony entry. Lore match:
        // the tablet is "brass-worn from thousands of readings"
        // and the ceremony has been signed "every day for centuries.
        // The hand has not changed."
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e1",
          cluesFound: ["wraith.e1.hierophant_ceremony"],
        },
      },
    },
    "incense-brazier": {
      look: {
        narration: {
          lucid:
            "The brazier hangs on a chain, smoking phosphor-lavender. The smoke does not behave like smoke — it falls toward the pool rather than rising, and once it reaches the water's surface it sinks beneath it without dissolving. The brazier is, on the evidence, feeding the pool.",
          fragmented:
            "The smoke falls. The smoke falls. The smoke falls into the pool. Into the pool. Into the pool.",
          luminous:
            "The brazier feeds the pool. The smoke is the medium by which the pool's aperture is fed — without the brazier, the pool would surface less. We are not, currently, in a position to keep this brazier lit forever. But every hour we do is an hour the pool is more receptive than it would otherwise be. That is a slow and patient resource.",
        },
        voId: "elara.oracle-sanctum.incense-brazier.look",
        logsClue: {
          id: "clue-oracle-brazier-feeds-pool",
          title: "The brazier feeds the oracle pool",
          body:
            "The Oracle Sanctum's incense-brazier produces phosphor-lavender smoke that sinks into the oracle pool rather than rising. The brazier is the pool's fuel. The longer the brazier is kept lit, the more receptive the pool becomes.",
          source: "oracle-sanctum",
          order: 2,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the brazier surfaces the Thalorian vessel
        // provenance chain. Lore match: the brazier is the
        // Thalorian-ritual surface (phosphor-lavender smoke; sigil
        // chain), and the provenance chain is the ritual paperwork
        // that twelve elders signed across decades. The vessel and
        // the brazier share a Thalorian discipline of slow, witnessed
        // preparation.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e4",
          cluesFound: ["wraith.e4.thalorian_vessel"],
        },
      },
    },
  },
};
