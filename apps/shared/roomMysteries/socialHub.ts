/* ═══════════════════════════════════════════════════════
   SOCIAL HUB MYSTERY — bulletin-board + mess-table

   Two-hotspot module. Sets social_hub_seen on first-look at
   the bulletin-board. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type SocialHubHotspotId =
  | "advocate-sylvex-recruitment-pitch"
  | "bulletin-board" | "mess-table";

export const SOCIAL_HUB_MYSTERY: RoomMysteryModule<SocialHubHotspotId> = {
  roomId: "social-hub",
  responses: {
    /* ─── advocate.blood_weave · e3 (Syl'Vex's recruitment pitch) ─── */
    "advocate-sylvex-recruitment-pitch": {
      look: {
        narration:
          "On the social-hub's recovered-transmissions board, a transcript of Syl'Vex's recruitment pitch to one of the Advocate's generals — preserved by the Hierarchy as a successful operational template. The pitch's structure: 'You have spent yourself defending. The Advocate's instrument requires this from you. My instrument requires a comfortable seat and a fair hearing of your fatigue. Both instruments produce results. Mine is gentler. Gentleness is not a weakness; it is an option the Advocate's doctrine forbade her from offering you. I am offering it.' The pitch is precise. The pitch worked three times. The Hierarchy keeps it on file as the doctrine's most-effective recruitment template.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e3",
          cluesFound: ["adv.e3.sylvex_recruitment_pitch"],
        },
      },
      interrogate: {
        narration:
          "You ask the hub for the general's recorded response. The board returns a three-line answer: 'I am tired. I will accept the seat. I will not retract my Advocate's shelter.' The general kept their Empire-of-Shadows shelter even while accepting Syl'Vex's recruitment. The Advocate's charter is unconditional. The mirror cannot break it.",
      },
      use: {
        narration:
          "You unpin the transcript, turn it over. The Hierarchy's filing stamp on the reverse names the general who accepted — and beneath that, in a different ink, a hand has added the date the general's Advocate-shelter renewal cleared. The two systems were keeping parallel files on the same person. Neither system flagged the redundancy.",
        voId: "elara.social-hub.advocate-sylvex-recruitment-pitch.use",
      },
      talk: {
        narration:
          "You read the pitch aloud. The cadence is calmer than its content suggests — Syl'Vex's gift is to make a coercive offer sound like a kindness. The hub's recovered audio strata, if you trigger them, return the original recording at the same volume you read it; the room becomes briefly bilingual, your voice and his, the same sentence.",
        voId: "elara.social-hub.advocate-sylvex-recruitment-pitch.talk",
      },
    },
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
        humanReaction: {
          narration: {
            shadow:
              "Re-pinned every year. By different hands. Nobody on the original crew is doing the pinning anymore.",
            balanced:
              "Continuity by relay. The bulletin-board's memorial-reading notice is a quietly load-bearing artefact — the date survives because the residents agree, generation by generation, to honour it. The Editor can edit a record. He cannot edit a habit.",
            warm:
              "I have re-pinned this notice myself in years when the resident who normally did it was new. The act is small. It is also, on this ship, one of the only small acts that has been done every year, every cycle, without fail. Lyra would be proud of the chain. She would also, characteristically, refuse to take credit for it.",
          },
          voId: "detective.social-hub.bulletin-board.look",
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
        humanReaction: {
          narration: {
            shadow:
              "Four chairs at one table once. Don't ask me about that. The answer is in a file I haven't filed.",
            balanced:
              "Mismatched settings, anti-anonymous by design. Lyra would have hated the kind of mess hall where everyone gets the same plate. She believed the meal was the place where a person was most easily forgotten — the cup is the correction. I had a table like this once, with three other kids, in a place none of them remember.",
            warm:
              "There were four of us at a table once. Four chairs, four mismatched cups. We used to argue about whose was whose. None of them remember that table now. I am, on the evidence of the cups in this room, allowed to remember it for them. Lyra designed this room so the act of remembering would still be possible after the original four had forgotten. I have not, on any visit, failed to use the room for that.",
          },
          voId: "detective.social-hub.mess-table.look",
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
