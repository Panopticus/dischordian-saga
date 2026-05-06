/* ═══════════════════════════════════════════════════════
   SOCIAL HUB MYSTERY — bulletin-board + mess-table

   Two-hotspot module. Sets social_hub_seen on first-look at
   the bulletin-board. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type SocialHubHotspotId = "bulletin-board" | "mess-table";

export const SOCIAL_HUB_MYSTERY: RoomMysteryModule<SocialHubHotspotId> = {
  roomId: "social-hub",
  responses: {
    "bulletin-board": {
      look: {
        narration: {
          lucid:
            "The bulletin-board is a wide cork panel along the back wall. Most of the pinned notices are decades old, the paper yellowed, the pins corroded. A few are recent — one announces an open chess-climb match, another a guild-sanctum sigil revision, a third a memorial reading scheduled for the anniversary of Lyra's death.",
          fragmented:
            "The memorial. The memorial. The memorial. Every year. Every year.",
          luminous:
            "The board is the ship's working noticeboard. The memorial reading has been re-pinned every year for two and a half centuries — in different hands, by different residents, but the date is consistent. The Ark has kept the anniversary. The editor has never, on the evidence of the board, edited the date.",
        },
        voId: "elara.social-hub.bulletin-board.look",
        setsFlag: "social_hub_seen",
        logsClue: {
          id: "clue-social-hub-memorial-pinned",
          title: "Lyra's memorial reading pinned annually for two centuries",
          body:
            "The Social Hub's bulletin-board carries a memorial-reading notice for the anniversary of Lyra Vox's death — re-pinned every year by different residents in different hands. The date has been consistent for two and a half centuries. The Editor has not edited the date.",
          source: "social-hub",
          order: 0,
        },
      },
      use: {
        narration:
          "You take down the memorial-reading notice and read it. Date, time, room — the order-tribunal, by tradition. The note bears, on the back, a signature in this year's ink: someone has been keeping the tradition alive without prompting. The notice goes back on the board exactly where you found it.",
        voId: "elara.social-hub.bulletin-board.use",
      },
      talk: {
        narration:
          "If you address the bulletin-board, you address every resident who ever pinned to it. Most are decades dead. A few, by the dates, are still aboard. The board is the closest thing this ship has to a continuous chorus.",
        voId: "elara.social-hub.bulletin-board.talk",
      },
    },
    "mess-table": {
      look: {
        narration: {
          lucid:
            "A long wooden mess-table runs the length of the room, scarred from a hundred thousand meals. The table is set with mismatched plates and mismatched cups — every utensil unique, every place setting different. Lyra's design: no two crew members ever ate from identical equipment. The discipline was meant to enforce that nobody's meal was generic.",
          fragmented:
            "Mismatched. Mismatched. Mismatched. Nobody's meal is generic.",
          luminous:
            "The mess-table's mismatched settings are Lyra's. She wanted every crew member, every meal, to be specifically identifiable as theirs — no anonymous consumption. That same discipline runs through every other room she designed: the bridge's hand-pinned threads, the war-room's individual binders, the guild-sanctum's never-scrubbed engravings. Lyra was, on the evidence of every room, deeply opposed to anonymity. The editor's whole method requires it.",
        },
        voId: "elara.social-hub.mess-table.look",
        logsClue: {
          id: "clue-social-hub-mismatched-table",
          title: "Mismatched mess-table is a Lyra signature",
          body:
            "The Social Hub's mess-table is set with mismatched plates and cups — Lyra Vox's discipline that no two crew members ate from identical equipment. The same anti-anonymity discipline runs through every Lyra-designed room on the ship. The Editor's method requires the anonymity Lyra refused.",
          source: "social-hub",
          order: 1,
        },
      },
      use: {
        narration:
          "You sit at the head of the table — Lyra's seat, by the position of the chair-marks worn into the floor. The cup at this place is hand-thrown, slightly lopsided, and the plate beside it carries the signature scratch of an iron knife used habitually by a left-handed person. Lyra was left-handed.",
        voId: "elara.social-hub.mess-table.use",
        setsFlag: "social_hub_lyra_seat_taken",
      },
      talk: {
        narration:
          "If you address the table, you address the meals it has held. Two and a half centuries of lunches, arguments, recoveries, partings. The table has a long memory and no opinions; it is the room's most patient witness.",
        voId: "elara.social-hub.mess-table.talk",
      },
    },
  },
};
