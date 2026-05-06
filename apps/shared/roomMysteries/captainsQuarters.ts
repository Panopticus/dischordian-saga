/* ═══════════════════════════════════════════════════════
   CAPTAIN'S QUARTERS MYSTERY — verb × hotspot table

   The captain's quarters carry a great deal of authored
   lore via the existing easter-egg hotspots (Vox's
   personal log, the cracked mirror, Kael's escape hatch).
   This module owns one new red herring beat: the framed
   photograph of Mr. Whiskers, "Chief Science Officer."

   Mr. Whiskers ties three rooms together — the cat appears
   on Iron Lion's poster in the armory, in this photograph,
   and he was the cat Kael took with him when he stole the
   ship. The Detective has a soft spot for this cat. Elara
   has a guarded one.

   Hotspot id matches the new entry added to ROOM_DEFINITIONS
   in apps/client/src/contexts/GameContext.tsx.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type CaptainsQuartersHotspotId = "cat-photo" | "degens-corner" | "vex-workshop-diary";

export const CAPTAINS_QUARTERS_MYSTERY: RoomMysteryModule<CaptainsQuartersHotspotId> = {
  roomId: "captains-quarters",
  responses: {
    "cat-photo": {
      look: {
        narration: {
          lucid:
            "A framed photograph on the far-left wall. A cat wearing tiny brass goggles, sat on the captain's console, looking unimpressed. Hand-lettered label below the frame: Mr. Whiskers — Chief Science Officer. The lettering is Lyra's. The cat's name is the first word in this entire room I have not had to second-guess.",
          fragmented:
            "Mr. Whiskers. Mr. Whiskers. Mr. Whiskers. Goggles. Goggles. Tiny goggles. Tiny brass goggles. He's — he's looking at — he's looking at — he's not looking at the camera. He's looking at — he's looking at her. He's looking at her. Why is — why is the cat looking at her.",
          luminous:
            "Mr. Whiskers. Tiny brass goggles. Sitting on the command console with the dignity of an officer who has, frankly, had a long shift. Lyra hand-lettered the label. The cat is not looking at the camera; the cat is looking at Lyra, who was, presumably, behind it. I have been looking at this photograph for two hundred and thirty years, and the directness of the cat's gaze is a small, daily miracle.",
        },
        voId: "elara.captains-quarters.cat-photo.look.t1",
        humanReaction: {
          narration: {
            shadow:
              "Mr. Whiskers was the only crew member Kael liked. He took the cat with him. I miss that cat.",
            balanced:
              "Mr. Whiskers was the only crew member Kael liked. He took the cat with him. I miss that cat. The fact that the photograph is still on the wall and the cat is not is, on the list of grievances I carry from that day, surprisingly close to the top.",
            warm:
              "Mr. Whiskers was the only crew member Kael liked. He took the cat with him. I miss that cat. I am going to be honest with you — there are days when the cat is what I miss most about that whole period, and I have been on this case long enough to know that's not a small admission.",
          },
          voId: "detective.captains-quarters.cat-photo.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — there's a date in pencil on the back of the frame, visible through the matting from this angle. The date is one week before Iron Lion's last print run. Lyra took the photograph; Iron Lion must have seen it on a visit; the cat in his poster is, definitionally, this cat.",
              fragmented:
                "Same week. Same week. Same week. The cat. The cat. The cat is the cat. The cat is the cat is the cat. Iron Lion saw the cat. Iron Lion saw the cat. Iron Lion drew the cat from memory. Iron Lion drew — drew — drew — drew the cat.",
              luminous:
                "The frame is dated one week before the academy fell. Iron Lion visited Lyra in that window — the visit is, by every social-graph metric I have, the only time their paths overlapped that year. He saw the photograph. He drew the cat from memory three days later, on three thousand posters. The cat in the armory and the cat in this frame are the same animal. Two posthumous portraits, separated by one frame, of one cat we no longer have.",
            },
            voId: "elara.captains-quarters.cat-photo.look.t2",
            logsClue: {
              id: "clue-quarters-cat-thrice",
              title: "Mr. Whiskers across three rooms",
              body:
                "The cat in the captain's quarters photograph, the cat on Iron Lion's armory poster, and the cat Kael took with him when he stole the Ark are the same animal. The frame is dated one week before the academy fell, in the only window Iron Lion's social graph overlapped with Lyra's that year. Mr. Whiskers is, by some accident of attention, the most-portrayed individual on this ship.",
              source: "captains-quarters",
              order: 0,
            },
            setsFlag: "captains_quarters_first_clue_found",
            humanReaction: {
              narration: {
                shadow:
                  "Iron Lion came to dinner once. He came for the cat. He left with a sketch he never showed her. He died with three thousand copies of the cat on the walls of his world.",
                balanced:
                  "He came to dinner ostensibly to consult on neural-bridge lattice geometry. He came actually because Lyra had a cat, and Iron Lion was, beneath the iron, a person who had been waiting his whole career for an excuse to meet a captain's cat. He sketched Mr. Whiskers in pencil that night. The pencil sketch became the poster. The poster became the wall behind every soldier in the academy when it fell.",
                warm:
                  "He went to see Lyra and ended up enchanted by a cat. He stayed two extra hours. He drew the cat in the margin of his notebook on the walk home. He printed three thousand copies of that drawing in the next seventy-two hours. We are looking, in this frame, at the seed of a piece of art that hung in three thousand rooms, most of which no longer exist. The cat hung in there, a great deal more than was reasonable.",
              },
              voId: "detective.captains-quarters.cat-photo.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. The reflection in the photograph's glass — the room behind you, today — does not match the room behind whoever last cleaned this glass. The cleaning streaks are oriented for a person standing two feet to the left of where you are. Someone has been straightening this picture. Recently. Someone who is not me, and who wasn't here a hundred and forty years ago either.",
              fragmented:
                "Streaks. Streaks. Cleaning streaks. Wrong angle. Wrong angle. Wrong angle. Someone — someone — someone cleans the cat. Someone cleans the cat. Someone — someone cleans the cat for me. Someone cleans the cat for me. Why. Why. Why. Why.",
              luminous:
                "The cleaning streaks on the photograph's glass were made by a person standing two feet to the left of where you are. Someone has been cleaning Mr. Whiskers' photograph during cycles I am not awake for. Someone with a long enough relationship to this cat that they will not let dust accumulate on his face. We have been adding to the count of recent intruders all afternoon, and this one — whoever it is — is the only one I cannot bring myself to be afraid of.",
            },
            voId: "elara.captains-quarters.cat-photo.look.t3",
            logsClue: {
              id: "clue-quarters-cat-cleaned",
              title: "Someone cleans the cat photograph",
              body:
                "The cleaning streaks on the cat photograph's glass were made by a person standing two feet left of the player's current position — and recently. Someone has been quietly tending Mr. Whiskers' frame during cycles Elara is not awake for. The cleaner is unidentified, but the act is gentle enough that Elara cannot bring herself to fear them.",
              source: "captains-quarters",
              order: 1,
            },
            setsFlag: "third_party_in_quarters",
            humanReaction: {
              narration: {
                shadow:
                  "Kael cleans it. Whenever he sits in her chair on the bridge and writes letters he can't finish, he comes back here after and dusts the cat. I'm not going to pretend that doesn't matter.",
                balanced:
                  "Kael cleans the photograph. He sits in Lyra's chair, writes the letters the Shadow Tongue won't let Elara read, and on his way back to wherever he sleeps he stops in this room and wipes the dust off Mr. Whiskers' face. He has been doing this for two and a half centuries. It is the part of him the Thought Virus has not yet finished editing out.",
                warm:
                  "Kael takes care of the cat's picture. I am asking you, when you eventually meet him, to remember this — not as evidence of innocence, because it isn't, but as evidence of who he was when he had a chance to be it. The cat is the only place his conscience has been allowed to stay clean. Mr. Whiskers, after all, did nothing wrong.",
              },
              voId: "detective.captains-quarters.cat-photo.look.t3",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You straighten the frame. The hook accepts the adjustment with the tired, slightly grateful click of a fixture that has been straightened many times by many hands. Mostly the same hand, lately. As the frame settles, a folded sheet slips from behind the photograph onto the desk: a private note in Vex Solène's hand, dated the night DEC-7710 was sealed. She had put her journal page where Lyra would find it eventually, and Lyra had hidden it where no editor would think to look — behind a cat.",
          fragmented:
            "Don't — don't take it. Don't take the cat. Don't take the cat. Leave it. Leave the cat. Leave the cat. Leave the cat. The note. The note. The note slipped out.",
          luminous:
            "Straightening the frame dislodges a folded sheet that has been pressed behind the photograph since the night DEC-7710 was sealed. Vex's hand. Her private note: 'I asked them to take my name off it. The recording was the Seer's; I was only the engineer. But the engineering was a confession, and I cannot live with the confession being public the day it was made. I asked the witness to wait. Whoever finds this — the Insurgency will own that I asked for the alias. I want the saga to know I did not hide.' Lyra hid the note behind the cat because no editor would think to look there. Two centuries of cleaning streaks have left the page intact.",
        },
        voId: "elara.captains-quarters.cat-photo.use",
        // Mystery Engine binding — when Vex Solène arc is the
        // active case, straightening the cat-photo dislodges
        // Vex's private note. Lore match: Lyra hid the note
        // behind the photograph as the editor-resistant surface
        // it canonically is — the cat's frame is dust-tended
        // weekly by Kael, and no editor would think to look
        // behind a cat for a recording engineer's confession.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e1",
          cluesFound: ["vex.e1.vex_self_note"],
        },
      },
      talk: {
        narration: {
          lucid:
            "You greet the photograph. Mr. Whiskers, deceased for upwards of two centuries, accepts the greeting with the dignity of a Chief Science Officer who has seen worse.",
          fragmented:
            "Hi. Hi. Hi Mr. Whiskers. Hi Mr. Whiskers. Hi. Hi. Mr. Whiskers. Mr. Whiskers.",
          luminous:
            "You said hello to Mr. Whiskers. The photograph does not respond — not because it can't, but because the cat in it has, professionally and consistently, never responded to anyone except Lyra. I think we both received the proper greeting. I think we should be content with it.",
        },
        voId: "elara.captains-quarters.cat-photo.talk",
        // Mystery Engine binding — when the Degen arc is the
        // active case, addressing the photograph surfaces a Ne-
        // Yon casino chip balance Lyra had filed behind the
        // photograph alongside her other private records. Lore
        // match: Lyra vouched for the Degen at Ne-Yon the night
        // he won the trusteeship, and kept her copy of the chip-
        // balance record where the editor would not look —
        // behind the cat she trusted to keep its discretion.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.ne_yon_chip_balance"],
        },
      },
    },
    // Degen arc: e2 + e5 surface in Lyra's quarters. Lyra hosted the
    // Degen at the captain's table on three documented evenings
    // before her death; the Degen left two artefacts in this room
    // for the next reader. Both are still on the small side-desk
    // beside the cracked mirror.
    "degens-corner": {
      look: {
        narration: {
          lucid:
            "A small side-desk beside the cracked mirror — the only piece of furniture in the captain's quarters that wasn't Lyra's. The Degen used to sit at this desk while Lyra worked at hers. Today the desk holds his audit-prep note: a single sheet, three columns, every line in his own neat trustee's hand. The columns are titled BROKERAGE / TRUSTEE-SIDE READING / CODA-SIDE READING. The note is a rehearsal — he was preparing to be audited, in advance, by reading his own books from both sides.",
          fragmented:
            "Two readings. Two readings. He read his own books. Both sides. Both sides. He prepared.",
          luminous:
            "The Degen's audit-prep note is the most disciplined thing on this ship that does not bear Lyra's monogram. He read his own books from both his trustee role and the Coda's perspective; the third column is left for Mol'Vereth's reading, in the audit. The discipline is Lyra's, transmitted: an honest auditor pre-reads against themselves before any external auditor arrives.",
        },
        voId: "elara.captains-quarters.degens-corner.look",
        logsClue: {
          id: "clue-captains-quarters-degens-prep-note",
          title: "The Degen's audit-prep note (3-column rehearsal)",
          body:
            "On the side-desk in Lyra's quarters: the Degen's own audit-prep note. Three columns — Brokerage / Trustee-side / Coda-side — with the third column reserved for Mol'Vereth. The Degen pre-read his own books from both sides before submitting to audit; the discipline is Lyra's, transmitted.",
          source: "captains-quarters",
          order: 2,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e2",
          cluesFound: ["degen.e2.degen_audit_prep_note"],
        },
      },
      use: {
        narration: {
          lucid:
            "You open the side-desk's drawer. Inside, beneath a stack of betting chips: a small folded card with a Ne-Yon casino seal. THE EMPTY CHAIR — RESERVED, in the Degen's hand. The card is dated forward — three weeks from today, the same day Mol'Vereth's audit-outcome letter is dated. The Degen has reserved an empty chair at his usual table for the night the audit closes. Whether the chair stays empty or fills depends on the outcome.",
          fragmented:
            "The empty chair. The empty chair. The empty chair. Reserved. Reserved. Same date. Same date. Same date.",
          luminous:
            "The empty chair card. The Degen reserves an empty seat at the Ne-Yon casino's high-stakes table on the night his audit closes — for the saga, for himself, for whoever the audit ratifies. The chair stays empty if the verdict is clean; it fills if the verdict is contested. The Saga's seat at the Degen's table is, in literal terms, in the player's hands.",
        },
        voId: "elara.captains-quarters.degens-corner.use",
        logsClue: {
          id: "clue-captains-quarters-empty-chair",
          title: "Empty chair — Ne-Yon casino, dated to audit-close",
          body:
            "The Degen reserves an empty chair at the Ne-Yon casino on the night Mol'Vereth's audit closes. The chair stays empty if the verdict is clean; it fills if the verdict is contested. The Saga's seat is, on the card's evidence, in the player's hands.",
          source: "captains-quarters",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e5",
          cluesFound: ["degen.e5.empty_chair_ne_yon"],
        },
      },
      talk: {
        narration:
          "If you address the desk, the cracked mirror behind it briefly steadies. The Degen sat here when Lyra invited him — three documented evenings, three different readings of the same Coda book. Lyra never told him she was teaching him to audit himself; he never told her he had figured it out by the second evening. Both knew. Neither said. The desk has been waiting for an auditor with the patience to read all three evenings as a single evening's lesson.",
        voId: "elara.captains-quarters.degens-corner.talk",
      },
    },
    // Vex arc: Vex's personal-life surface in Lyra's quarters. Vex
    // and Lyra were close enough that Vex kept her workshop diary
    // and her apprentice's personal notes here, on the small
    // bookshelf to the right of the bed. The shelf has remained
    // undisturbed since Lyra's death; Vex has not retrieved her
    // diary, but she has kept adding to it.
    "vex-workshop-diary": {
      look: {
        narration: {
          lucid:
            "A small bookshelf to the right of the bed — the only piece of furniture in the captain's quarters Lyra kept for someone else's use. Vex Solène's workshop diary sits on the second shelf, the spine worn from forty years of opening. Today's most recent entry, in Vex's hand, dated yesterday: 'Tomorrow at six. I am ready. I have been ready for a while; I am only now telling the diary about it. The apprentice is ready too. We have practised this transition without naming it. Tomorrow we name it.'",
          fragmented:
            "Yesterday. Yesterday. She wrote yesterday. She wrote yesterday. She is ready. She is ready.",
          luminous:
            "Vex's workshop diary, kept on Lyra's shelf for forty years. Yesterday's entry — in Vex's hand, dated to the eve of the calibration session pinned to the schematic-pad — is her formal acknowledgement that the handover is going to happen. The diary has been the saga's quietest record of her working life. She has, in the saga's evidence, been preparing to be succeeded for at least a year, and she has chosen this room to record the preparation in.",
        },
        voId: "elara.captains-quarters.vex-workshop-diary.look",
        logsClue: {
          id: "clue-captains-quarters-vex-workshop-diary",
          title: "Vex's workshop diary — yesterday's entry on the handover",
          body:
            "The Captain's Quarters bookshelf holds Vex Solène's workshop diary, kept on Lyra's shelf for forty years. Yesterday's entry records Vex's formal acknowledgement that tomorrow's calibration session is the handover she has been preparing for.",
          source: "captains-quarters",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e3",
          cluesFound: ["vex.e3.vex_workshop_diary"],
        },
      },
      use: {
        narration: {
          lucid:
            "You leaf to the back endpaper of the diary. Tucked there: a separate small envelope addressed to Vex in her apprentice's hand, never sent. Inside, on a single sheet: 'I have been keeping a personal note on my own bench about what your trust has meant to me. I will hand it to you tomorrow morning when you arrive for the session. I am writing this draft so that, if I cannot speak it tomorrow, you have the words anyway.' The apprentice has, on this evidence, prepared in case they freeze.",
          fragmented:
            "If I cannot speak it. If I cannot speak it. They prepared. They prepared. In case.",
          luminous:
            "The apprentice's personal note is the kind of document people write only when they have practised being wrong about themselves enough to know the practice can fail at any time. They love her. They are afraid of letting her down by going silent in the moment. They have prepared, in writing, for the failure they hope will not happen. Vex will receive the note tomorrow whether or not the apprentice can speak.",
        },
        voId: "elara.captains-quarters.vex-workshop-diary.use",
        logsClue: {
          id: "clue-captains-quarters-apprentice-personal-note",
          title: "Apprentice's personal note to Vex (drafted in advance)",
          body:
            "Tucked in the back of Vex's diary: the apprentice's personal note to Vex, drafted in advance against the possibility of going silent at the handover session. Vex will receive the note tomorrow whether or not the apprentice can speak.",
          source: "captains-quarters",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e4",
          cluesFound: ["vex.e4.apprentice_workbench_personal_note"],
        },
      },
      talk: {
        narration: {
          lucid:
            "If you address the diary, the bookshelf briefly steadies. On the shelf above, a small folded card surfaces: VEX'S PRIVATE RECORDING INTENT — NOT FOR PUBLIC RELEASE. The card describes a private recording Vex plans to make tomorrow morning, of the moment she hands the apprentice the bench-key. The recording is intended only for the saga's internal archive — for the canon to know the handover happened, exactly, in real time. It is not for public release. It is for the record.",
          fragmented:
            "Private. Private. Private. Not for release. Not for release. For the record. For the record.",
          luminous:
            "Vex's private recording intent is the most disciplined act in this whole arc. She intends to record the handover moment, archive it, and never release it. The recording is for the canon, not for an audience. It is the cleanest possible execution of her record-and-suppress training: the act of making a record that exists only to anchor the truth, never to argue for it. The handover will, by her design, be both real and not for sale.",
        },
        voId: "elara.captains-quarters.vex-workshop-diary.talk",
        // Vex arc — Vex's private recording intent for the handover.
        // vex.e5.private_recording_intent.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e5",
          cluesFound: ["vex.e5.private_recording_intent"],
        },
      },
    },
  },
};
