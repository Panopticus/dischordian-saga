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

export type CaptainsQuartersHotspotId =
  | "cat-photo"
  | "degens-corner"
  | "vex-workshop-diary"
  | "lockes-correspondence-cache"
  | "the-coordinators-summons"
  | "directors-handcouriered-summons"
  | "mechronis-certification-file";

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
        humanReaction: {
          narration: {
            shadow:
              "She left the cat-photo as a flag. The note behind it is hers. Nobody else thinks to look behind the photo of a cat.",
            balanced:
              "Vex hid the self-note where Lyra would find it eventually — behind a photo only the two of them found funny. The discipline is consistent: Vex commits to record where she trusts the future reader's specific eye. Lyra was that reader, then. We are now.",
            warm:
              "She trusted Lyra's eye more than the saga's institutional record. The note is in handwriting only Lyra would recognise as Vex's, behind a photo only Lyra would have known to look behind. Reading it makes us, briefly, Lyra's substitute.",
          },
          voId: "human.captains-quarters.cat-photo.use",
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
        humanReaction: {
          narration: {
            shadow:
              "Ne-Yon casino chip-balance receipt. Held in Mr. Whiskers's photo frame. The Degen marks his ledger in places only the saga's strangest readers will look.",
            balanced:
              "The chip-balance receipt is the Degen's running account at the Ne-Yon high-stakes table. He files his casino accounting in unexpected places because the Hierarchy's auditors have, traditionally, a poor sense of humour about cat photos. Mol'Vereth, by contrast, would think to look here.",
            warm:
              "He hid it behind the cat photo because Lyra would have laughed. Lyra laughed. The Degen is one of the few people on this ship who knew how to make her laugh without trying.",
          },
          voId: "human.captains-quarters.cat-photo.talk",
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
        humanReaction: {
          narration: {
            shadow:
              "Three columns. He read his own books from both sides before submitting. That's the discipline. He learned it from Lyra without being told.",
            balanced:
              "The Degen's audit-prep note is the most disciplined private document in this case. Pre-reading your own books from both your role and the auditor's role is the kind of preparation only a small number of people on this ship know how to perform. Lyra trained him without naming the training.",
            warm:
              "He sat at this desk, with this lamp, and read his own books for hours. He didn't tell Lyra. She didn't ask. They both knew what was happening. That is, on this ship, a deep form of friendship.",
          },
          voId: "human.captains-quarters.degens-corner.look",
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
        humanReaction: {
          narration: {
            shadow:
              "Empty chair, dated to audit-close. He reserves it for whoever the verdict produces. Stays empty if clean. Fills if contested.",
            balanced:
              "The empty-chair card is the Degen's ritual for the night an audit closes. He sets a place at his usual table for the saga, the audit's outcome, or whoever the verdict obligates him to host. The chair stays empty when the verdict ratifies the trusteeship and fills when the verdict reopens it.",
            warm:
              "He always sets the place. He has never been alone at that table on the night an audit closed, in three centuries. I find that, on quiet evenings, deeply consoling. He is not, even when alone, alone.",
          },
          voId: "human.captains-quarters.degens-corner.use",
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
        humanReaction: {
          narration: {
            shadow:
              "Forty years of diary. Yesterday's entry says she's ready. The handover is tomorrow. The diary was the rehearsal.",
            balanced:
              "Vex's workshop diary is the slowest single document in the saga and the most consistently maintained. Yesterday's entry — 'I am ready. I have been ready for a while; I am only now telling the diary about it.' — is the saga's quietest declaration of intent. Tomorrow she names what she has been preparing.",
            warm:
              "She has been writing this diary on Lyra's shelf for forty years. Lyra never read a word of it; Vex never asked her to. Two artists who knew when to keep silent, and when to keep records.",
          },
          voId: "human.captains-quarters.vex-workshop-diary.look",
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
        humanReaction: {
          narration: {
            shadow:
              "Drafted in advance, in case they freeze. The apprentice loves her enough to plan for the failure they hope won't happen.",
            balanced:
              "The apprentice's personal note is the kind of preparation people do when they have practised being wrong about themselves enough to know the practice can fail. The note will be handed to Vex regardless. Whether the apprentice can speak or not, the words will arrive.",
            warm:
              "They love her. They are afraid of letting her down by going silent in the moment. They prepared, in writing, for the failure they hope will not happen. That is the deepest discipline of all.",
          },
          voId: "human.captains-quarters.vex-workshop-diary.use",
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
        humanReaction: {
          narration: {
            shadow:
              "Record the handover. Archive it. Never release it. The cleanest possible execution of record-and-suppress. The canon will know it happened.",
            balanced:
              "Vex's private recording intent is the most disciplined act in this whole arc. The recording will exist and never be played. The canon recognises it; the audience does not. That is the Seer's training, applied to her own life's most private moment.",
            warm:
              "She will record the handover for the canon and never let anyone hear it. The fact that the recording exists — anchored, dated, witnessed — is what matters. The fact that nobody will hear it is what keeps it sacred.",
          },
          voId: "human.captains-quarters.vex-workshop-diary.talk",
        },
      },
    },
    // Watcher arc: E2 Locke-signature surface + E4 fragmented-
    // sister doctrine. Lyra kept her post-act correspondence from
    // Adjudicar Locke in a cache behind the desk's lower drawer —
    // every letter signed 'L.', every seal carrying the glyph.
    "lockes-correspondence-cache": {
      look: {
        narration: {
          lucid:
            "A flat document cache set into the desk's lower drawer — Lyra kept every post-act letter she ever received from Adjudicar Locke here, in order. The content is, on the surface, Authority business. The signature is not: every letter signed 'L.' — never 'Adjudicar,' never 'Locke,' never the formal title. Operative-to-operative. The wax seals are intact; the Ocularum's founding glyph is embedded in each, visible only when a seal is broken from the inside.",
          fragmented:
            "L. L. Just L. Just L. Operative to operative. Operative to operative. The glyph. The glyph. In the wax. In the wax.",
          luminous:
            "Lyra's Locke correspondence cache: years of post-act letters, all signed with a single initial. The 'L.' is not casual shorthand — it is the operative-to-operative form the Ocularum's founding doctrine requires of its Coordinator. The wax seals carry the founding glyph in stylized form, set so it only reads when the seal is broken from the inside. Lyra kept the cache because she recognised the signature for what it was. The letters are the Order operating in plain sight, addressed to a captain who knew.",
        },
        voId: "elara.captains-quarters.lockes-correspondence-cache.look",
        logsClue: {
          id: "clue-quarters-locke-signature-pattern",
          title: "The signature 'L.' across post-act letters",
          body:
            "Lyra's desk cache holds every post-act letter from Adjudicar Locke, each signed only 'L.' — the operative-to-operative form the Ocularum's founding doctrine requires of its Coordinator. The wax seals embed the founding glyph, visible only when broken from the inside.",
          source: "captains-quarters",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e2",
          cluesFound: ["watcher.e2.locke_signature_pattern"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Every letter signed 'L.' Glyph in the wax, inside-only. That's the Coordinator's operative form. Lyra knew.",
            balanced:
              "The 'L.' signature is the Ocularum Coordinator's operative-to-operative form — doctrine, not informality. The glyph embedded in each seal, readable only from the inside, is the confirmation. Lyra kept the whole cache in order because she recognised who was writing to her. The letters are the Order in plain sight.",
            warm:
              "Lyra knew exactly who 'L.' was. She kept every letter, in order, behind a drawer she trusted. The glyph in the wax is the Order's signature to anyone who breaks a seal from the inside — and Lyra never broke one carelessly. She was, in her quiet way, already part of this.",
          },
          voId: "human.captains-quarters.lockes-correspondence-cache.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You cross-reference the cache against Lyra's mission log. Seven Trade Empire missions filed under the captain's name share three structural features: dead-drop pickup, signal-relay verification, a cover-identity bleed check. All seven dispatched by Locke's office. All seven, on the surface, routine Authority-sanctioned commerce-intelligence. Together, they describe a perfect operational reconnaissance cycle. The Authority either did not notice or approved.",
          fragmented:
            "Seven. Seven missions. The same shape. The same shape. A cycle. A cycle. The Authority didn't notice. Didn't notice. Or approved. Or approved.",
          luminous:
            "The cache cross-referenced against the mission log surfaces the pattern: seven Trade Empire missions, each routine on its face, together a complete operational reconnaissance cycle — dead-drop, relay-verify, bleed-check, repeated. All seven dispatched by Locke. The Authority's tolerance is either ignorance or arrangement; the case has not yet resolved which. The seven missions are the doctrine using the infrastructure, run through a captain who filed them as commerce.",
        },
        voId: "elara.captains-quarters.lockes-correspondence-cache.use",
        logsClue: {
          id: "clue-quarters-trade-empire-pattern",
          title: "Trade Empire mission pattern (the seven)",
          body:
            "Cross-referencing Lyra's Locke cache against her mission log surfaces seven Trade Empire missions sharing dead-drop pickup, signal-relay verification, and cover-identity bleed check. All seven dispatched by Locke's office; together they describe a complete operational reconnaissance cycle the Authority did not notice or approved.",
          source: "captains-quarters",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e2",
          cluesFound: ["watcher.e2.trade_empire_pattern"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Seven missions, one recon cycle. Locke dispatched all of them. The Authority missed it. That's the cover working.",
            balanced:
              "The seven missions are not coincidence — dead-drop, relay-verify, bleed-check is a reconnaissance cycle, repeated seven times under routine commerce cover. Locke signed every dispatch. The Authority's failure to notice is the cover doing exactly what the doctrine designed it to do: be the Order in plain sight.",
            warm:
              "Lyra ran the cycle without being told it was a cycle, the same way the player has. That is how the Order recruits — not by asking, but by trusting you with the work until the work is what you are. The seven missions are the breadcrumbs nobody knew were breadcrumbs.",
          },
          voId: "human.captains-quarters.lockes-correspondence-cache.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the cache. A single sheet, filed apart from the letters, surfaces: the Order's standing position on a warlord-fragmented sister. The body is hers; the seizure is reversible in principle; the Order will not act until the body indicates she has begun to remember on her own. The Order will not approach. The Order will not intervene. The Order waits. Her cell number, whatever it was, is held open — not refilled.",
          fragmented:
            "The Order waits. The Order waits. Held open. Held open. Not refilled. Not refilled. The body is hers. The body is hers.",
          luminous:
            "The doctrine sheet on a fragmented sister: the body is hers, the seizure is reversible in principle, the Order will not act until she begins to remember on her own. No approach. No intervention. The cell held open, not refilled. It is one of the few doctrines the modern Order inherited from the Resistance Branch unchanged — the dignity of an impossible rescue lives in the patience of the vigil. Lyra filed it apart from the letters because it was not Authority business; it was Order business, and she knew the difference.",
        },
        voId: "elara.captains-quarters.lockes-correspondence-cache.talk",
        logsClue: {
          id: "clue-quarters-fragmented-sister-doctrine",
          title: "The Order's doctrine on a warlord-fragmented sister",
          body:
            "Filed apart from Lyra's Locke letters: the Order's standing position on a warlord-fragmented sister. The body is hers; the seizure is reversible in principle; the Order will not approach or intervene until she begins to remember on her own. Her cell number is held open, not refilled — a Resistance-Branch doctrine the modern Order kept unchanged.",
          source: "captains-quarters",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e4",
          cluesFound: ["watcher.e4.order_doctrine_on_fragmented_sisters"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Body is hers. Seizure reversible in principle. No approach until she remembers. Cell held open. The Order waits. That's the doctrine.",
            balanced:
              "The fragmented-sister doctrine is the Order at its most patient. It does not promise her survival; it promises her the dignity of being waited for. The cell stays open because refilling it would be the Order conceding she is gone — and the Order does not concede that. It waits. Patience is the rescue.",
            warm:
              "They will not go to her. They will not refill her number. They will wait, for as long as it takes, for the body to show she has begun to come back on her own. It is the gentlest doctrine the saga has, and the Order kept it from the Resistance Branch without changing a word.",
          },
          voId: "human.captains-quarters.lockes-correspondence-cache.talk",
        },
      },
    },
    // Watcher arc: E5 recruitment surface. Locke's unfiled summons,
    // the vetting dossier, and the Coordinator's terms — delivered
    // to the player's own quarters by a courier on no Authority
    // manifest. The arc's close.
    "the-coordinators-summons": {
      look: {
        narration: {
          lucid:
            "A meeting invitation on the desk, in Locke's hand, delivered by a courier whose route is in no Authority manifest. It reads, in her wry register: 'You have been useful. You have been quiet. You have been mine. Now you are ours, if you wish. Come to the address below. Bring nothing the Authority would expect you to carry.' Signed not 'L.' but, for the first time, 'The Coordinator.' The signature is the meeting's first revelation. Everything else is acknowledgment.",
          fragmented:
            "The Coordinator. The Coordinator. Not L. Not L. The first time. The first time. The signature is the revelation. The revelation.",
          luminous:
            "The summons Locke did not file. A courier off every Authority manifest; an invitation in her hand that names the whole arc in four sentences — useful, quiet, mine, ours-if-you-wish. The signature is the revelation: not 'L.' but 'The Coordinator,' the first time the player has seen her sign the title. Everything after the signature is acknowledgment of work already done. The summons is the moment the recruitment-by-recognition stops being implicit.",
        },
        voId: "elara.captains-quarters.the-coordinators-summons.look",
        logsClue: {
          id: "clue-quarters-locke-unfiled-summons",
          title: "The summons Locke did not file",
          body:
            "A meeting invitation in Locke's hand, delivered by a courier on no Authority manifest: 'You have been useful. You have been quiet. You have been mine. Now you are ours, if you wish.' Signed, for the first time, 'The Coordinator' rather than 'L.' The signature is the meeting's first revelation; everything else is acknowledgment.",
          source: "captains-quarters",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e5",
          cluesFound: ["watcher.e5.locke_unfiled_summons"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Unfiled. Off-manifest courier. Signed 'The Coordinator,' first time. Useful, quiet, mine, ours. That's the whole arc.",
            balanced:
              "The summons is not betrayal — Locke never lied about the missions. The signature change from 'L.' to 'The Coordinator' is the recognition becoming explicit. She has trusted the player with her life since Beat H; the summons is the first time she says so on a sheet of paper.",
            warm:
              "She signed it 'The Coordinator' because the time for the operative shorthand is over. The summons is not a surprise — every breadcrumb was visible. It is an acknowledgment that the work has already happened, and an invitation to put a name to it.",
          },
          voId: "human.captains-quarters.the-coordinators-summons.look",
        },
      },
      use: {
        narration: {
          lucid:
            "Beneath the invitation, a dossier the thickness of the saga's runtime — the Order's continuous vetting record on the player. Every choice since Beat H, every relationship maintained, every Trade Empire mission accepted, every Mystery Engine arc walked. Locke's annotation on the cover: 'This is what we have seen. We have not interpreted it. We have only recorded it. The interpretation has always been yours. You are reading the interpretation now.' The last page: a single line — 'Cell pending.'",
          fragmented:
            "Everything. Everything since Beat H. Recorded. Recorded. Not interpreted. Not interpreted. Cell pending. Cell pending.",
          luminous:
            "The vetting dossier: not surveillance, recognition. Every choice the player made since Beat H, recorded and uninterpreted, because the interpretation was always the player's to make. Locke's cover annotation is the Order's whole ethic in four sentences — they watched, they did not read, the reading was yours. The last line, 'Cell pending,' is not a request. It is the recognition that the work has already happened and only needs a name to close it.",
        },
        voId: "elara.captains-quarters.the-coordinators-summons.use",
        logsClue: {
          id: "clue-quarters-vetting-dossier",
          title: "The Order's vetting dossier",
          body:
            "Beneath Locke's summons: the Order's continuous vetting record on the player — every choice since Beat H, recorded and uninterpreted. Locke's cover annotation: 'This is what we have seen. We have not interpreted it. The interpretation has always been yours.' The last page reads 'Cell pending.'",
          source: "captains-quarters",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e5",
          cluesFound: ["watcher.e5.vetting_dossier"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Every choice since Beat H. Recorded, not interpreted. 'Cell pending.' The work already happened. Your consent names it.",
            balanced:
              "The dossier is recognition, not surveillance — the Order recorded and refused to interpret because the interpretation was always the player's. 'Cell pending' is not asking permission for something that hasn't happened; it is the recognition that the work has, and consent is what closes it into a name.",
            warm:
              "They watched everything and read none of it. That distinction is the whole Order. The dossier hands the player back their own life as evidence of who they already were. 'Cell pending' is the last line because the only thing missing is the player saying yes to a name.",
          },
          voId: "human.captains-quarters.the-coordinators-summons.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the summons. Locke's terms surface, in her characteristically transactional and characteristically generous register: membership requires no severance from any relationship, faction, or institutional position. The cell number is the player's, to use or not. The Order will not contact more than invited. It closes: 'The discipline of seeing will turn on you eventually. We would prefer it turn in the direction of the work. If it turns otherwise, we will respect that turn too. Sign or do not sign. Either way, you have been ours since you accepted my first letter.'",
          fragmented:
            "No severance. No severance. The cell is yours. Yours. Sign or don't. Sign or don't. Ours since the first letter. The first letter.",
          luminous:
            "The Coordinator's terms are the founding doctrine in modern dress. 'We were the first to refuse' becomes 'we will not ask of you what we have not asked of ourselves.' No severance from any existing life; the cell number offered, not imposed; contact only by invitation. The closing names the doctrine as the threat it has always been, to its holders included — and respects the player's turn either way. The terms close the recognition into a choice without ever requiring the choice to be yes.",
        },
        voId: "elara.captains-quarters.the-coordinators-summons.talk",
        logsClue: {
          id: "clue-quarters-coordinator-terms",
          title: "The Coordinator's terms",
          body:
            "Locke's terms: membership requires no severance from any relationship, faction, or position; the cell number is the player's to use or not; the Order contacts only by invitation. The close: 'The discipline of seeing will turn on you eventually... Sign or do not sign. Either way, you have been ours since you accepted my first letter.'",
          source: "captains-quarters",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e5",
          cluesFound: ["watcher.e5.coordinator_terms"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No severance. Cell is yours. Contact only by invite. Doctrine names itself as the threat. Sign or don't — ours either way since the first letter.",
            balanced:
              "The terms are the founding doctrine compressed into a recruitment conversation. The Order will not ask what it has not asked of itself; the cell is offered, never imposed; the doctrine is named as the threat it is, even to its own. The generosity is the point — consent that costs nothing to refuse is the only consent the Order will accept.",
            warm:
              "She tells the player the discipline will turn on them eventually, and she means it as honesty, not threat. The cell is theirs whether or not they sign. That is the Order's deepest courtesy: it would rather have a free refusal than a coerced yes. The work continues either way.",
          },
          voId: "human.captains-quarters.the-coordinators-summons.talk",
        },
      },
    },
    // Ith'Rael arc: the captain's quarters is where summonses
    // arrive that bypass institutional infrastructure. The
    // Director's invitation is delivered by hand, on paper, by an
    // unbriefed courier — meaning carried outside the indexable
    // layer is itself the doctrinal demonstration. The Mechronis
    // certification file is the present-tense softening that
    // protects the player's own cover.
    "directors-handcouriered-summons": {
      look: {
        narration: {
          lucid:
            "On the desk, beside Locke's summons, a second invitation in a different hand — the only Hierarchy invitation in the saga's record that does not pass through Hierarchy comms infrastructure. It reads: 'I consent to meet. Bring whomever you wish; bring nothing the Hierarchy would expect you to carry. I will not defend the working. I will explain it. You may use the explanation however you choose. The choice is itself part of the explanation.' Signed: Ith'Rael, Director. Written by hand, on physical paper, hand-couriered by a Hierarchy functionary who was not briefed on its content. The medium is the doctrine: meaning carried outside the indexable layer.",
          fragmented:
            "I consent. I consent to meet. By hand. By hand. On paper. On paper. The courier doesn't know. Doesn't know. The medium is the doctrine. The doctrine.",
          luminous:
            "The Director's consent to meet — the only Hierarchy invitation in the record that bypasses Hierarchy comms. He will not defend the working; he will explain it; the choice of what to do with the explanation is part of the explanation. The delivery itself is a doctrinal demonstration: written by hand, on paper, carried by a functionary who does not know what he carries. Meaning held outside the indexable layer, handed to the player by someone who cannot index it. The quarters keep it because the quarters are where the unfiled things arrive.",
        },
        voId: "elara.captains-quarters.directors-handcouriered-summons.look",
        logsClue: {
          id: "clue-quarters-directors-consent-to-meet",
          title: "The Director's consent to meet",
          body:
            "An invitation in Ith'Rael's hand, the only Hierarchy invitation in the record that bypasses Hierarchy comms: 'I consent to meet... I will not defend the working. I will explain it. You may use the explanation however you choose. The choice is itself part of the explanation.' Signed Ith'Rael, Director. Written by hand, on paper, hand-couriered by an unbriefed functionary — the medium is itself the doctrine: meaning carried outside the indexable layer.",
          source: "captains-quarters",
          order: 12,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e5",
          cluesFound: ["ith_rael.e5.directors_consent_to_meet"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He consents. No defence, only explanation. The choice is part of it. By hand, on paper, courier doesn't know what he's carrying. The delivery is the doctrine.",
            balanced:
              "The Director's summons is the arc's close opening. He will explain, not defend — and the form of delivery is the lesson: handwritten, hand-couriered, unbriefed. Meaning outside the indexable layer, demonstrated in the act of arriving. He is not negotiating. He is showing the player what unindexable transmission looks like.",
            warm:
              "He sent it by a man who does not know what he is carrying, on paper, in his own hand. That is the entire doctrine performed once, gently, as an invitation. He says he will explain and not defend, and the way the letter arrived is already the first half of the explanation.",
          },
          voId: "human.captains-quarters.directors-handcouriered-summons.look",
        },
      },
      use: {
        narration: {
          lucid:
            "Folded inside the invitation, a transcript of the meeting itself, in the Director's voice: 'The working has three principles. One: the world is held together by indexed memory. Two: indexed memory can be unindexed without violence. Three: the cohorts who hold the indexed memory will, given enough time and gentle conversation, agree that the indexing was unnecessary. The doctrine follows. The Hierarchy follows. The Severance followed. The current operations follow. There is no further explanation. There is also no defence. I do not defend the working. I do not need to. The working defends itself by being the way the world's defenders prefer the world to work.'",
          fragmented:
            "Three principles. Three. Indexed memory. Indexed memory. Unindexed without violence. Without violence. They will agree. They will agree. No defence. No defence.",
          luminous:
            "The explanation, transcribed. Three principles: the world is held by indexed memory; indexed memory can be unindexed without violence; the cohorts who hold it will, given time and gentle conversation, agree the indexing was unnecessary. Everything follows from those — the doctrine, the Hierarchy, the Severance, the present operations. He offers no defence because the working defends itself by being the way the world's defenders already prefer the world to run. The quarters hold the transcript because it is the rare Hierarchy document offered to be read rather than hidden.",
        },
        voId: "elara.captains-quarters.directors-handcouriered-summons.use",
        logsClue: {
          id: "clue-quarters-directors-explanation",
          title: "The explanation",
          body:
            "The meeting transcript, in the Director's voice: 'The working has three principles. One: the world is held together by indexed memory. Two: indexed memory can be unindexed without violence. Three: the cohorts who hold the indexed memory will, given enough time and gentle conversation, agree that the indexing was unnecessary... I do not defend the working. I do not need to. The working defends itself by being the way the world's defenders prefer the world to work.'",
          source: "captains-quarters",
          order: 13,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e5",
          cluesFound: ["ith_rael.e5.directors_explanation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three principles. Indexed memory holds the world; it can be unindexed without violence; the holders will agree it was unnecessary. No defence — it defends itself.",
            balanced:
              "The explanation is the whole doctrine in three sentences and a closing refusal. He does not defend it because the defence is structural: the working is the way the world's defenders prefer the world to run. The transcript is offered FOR indexing — which is itself the trap. The hard part is what to do with an explanation designed to be received.",
            warm:
              "He explained it plainly and refused to defend it, because he does not have to — the working survives by being the thing the defenders already want. The quarters keep the transcript because it is the one Hierarchy paper meant to be read. What it means to receive it is the question he handed back to the player.",
          },
          voId: "human.captains-quarters.directors-handcouriered-summons.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the summons. The Director's closing remark resolves at the foot of the transcript: 'I have enjoyed this conversation. I will continue to work. You will continue to oppose me, in whatever form your character permits. We will not meet again. The next time the working surfaces in your case-file, it will be in a form you do not yet recognize — because if you recognized it now, I would already have changed it. I wish you the long view. It is the only view that approximates mine.' He bows. He leaves. The meeting closes without resolution.",
          fragmented:
            "We will not meet again. Not again. A form you do not recognize. Do not recognize. If you recognized it I'd have changed it. Changed it. The long view. The long view.",
          luminous:
            "The Director's closing courtesy. Not a threat and not a kindness — a doctrinal description. The working adapts, so anything learned now will not match its next surface; learning the working teaches a shape it will no longer have. The long view is the only view that approximates his because it is the only frame in which the adaptation is visible across cycles. He bows and leaves; the meeting closes unresolved. The quarters keep the close because an unresolved close is, by the doctrine, the only honest kind.",
        },
        voId: "elara.captains-quarters.directors-handcouriered-summons.talk",
        logsClue: {
          id: "clue-quarters-directors-closing-courtesy",
          title: "The Director's closing courtesy",
          body:
            "Ith'Rael's closing remark at the foot of the transcript: 'I will continue to work. You will continue to oppose me... We will not meet again. The next time the working surfaces in your case-file, it will be in a form you do not yet recognize — because if you recognized it now, I would already have changed it. I wish you the long view. It is the only view that approximates mine.' He bows, leaves; the meeting closes without resolution.",
          source: "captains-quarters",
          order: 14,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e5",
          cluesFound: ["ith_rael.e5.directors_closing_courtesy"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'We will not meet again. Next time it'll be a form you don't recognize — if you recognized it now I'd have changed it.' Not a threat. A description.",
            balanced:
              "The closing is a doctrinal description, not a courtesy. The working adapts; learning it teaches a shape it will no longer have. The long view is the only frame in which the adaptation is visible across cycles, which is why he wishes it on the player. The arc closes unresolved because, by the doctrine, that is the only honest ending.",
            warm:
              "He wished the player the long view and meant it, because it is the only view that comes close to his own. He will not be back. The next time this surfaces it will not look like this. The quarters keep the close unresolved because resolving it would be a lie the working would have authored.",
          },
          voId: "human.captains-quarters.directors-handcouriered-summons.talk",
        },
      },
    },
    "mechronis-certification-file": {
      look: {
        narration: {
          lucid:
            "A personnel file in the quarters' operational drawer — the Mechronis Academy's spy-class certification, canonically the highest standard the Insurgency maintains for covert operatives. Its rigour protected the Order's apparatus-branch operatives and continues to protect Locke's modern operations (apps/shared/questlineClassSpy.ts). The recertification cadence has not changed; the recertification CONTENT has. Across the same nine generations as the Thalorian pattern, the test items have shifted from operational scenarios to theoretical exam questions. Examiners agreed each step was reasonable. Each step was. The aggregate is a different test. The Director's whisper, in the file's margin: 'It has been a long time since anything happened.'",
          fragmented:
            "Cadence unchanged. Unchanged. Content changed. Content changed. Operational to theoretical. Theoretical. Each step reasonable. Reasonable. Different test. A different test.",
          luminous:
            "The Mechronis certification file, kept in the captain's quarters because it is the standard the player's own cover depends on. The cadence is intact — the content has hollowed. Nine generations of test items drifting from operational scenarios to theoretical questions, each step individually reasonable, the aggregate a different test entirely. The Director's whisper is the same one he used on Thaloria. The file matters here because the operatives this certification protects include the ones running the player's cover; this is the working reaching toward the case itself.",
        },
        voId: "elara.captains-quarters.mechronis-certification-file.look",
        logsClue: {
          id: "clue-quarters-mechronis-certification-relaxation",
          title: "Mechronis Academy spy-class certification relaxation",
          body:
            "The Mechronis Academy's spy-class certification — the Insurgency's highest covert-operative standard, protecting Locke's modern operations (apps/shared/questlineClassSpy.ts). The recertification cadence is unchanged; the content has shifted across nine generations from operational scenarios to theoretical exam questions, each step reasonable, the aggregate a different test. The Director's whisper in the margin: 'It has been a long time since anything happened.'",
          source: "captains-quarters",
          order: 15,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e4",
          cluesFound: ["ith_rael.e4.mechronis_certification_relaxation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Cadence unchanged, content hollowed. Operational scenarios to theory exams, nine generations, each step reasonable. Same whisper he used on Thaloria. This one protects your cover.",
            balanced:
              "The Mechronis file is the third present-tense operation, and the one closest to the player. The cadence is intact so the relaxation is invisible; the content drifted from operational to theoretical, each step reasonable, the aggregate a different standard. Reform that re-indexes the cadence will not re-index the content — that is the trap the exposure memo describes.",
            warm:
              "The test that protects the people running the player's cover has been quietly emptied — not the schedule, the substance. Each examiner who softened it was reasonable, and the sum is a certification that no longer certifies what it did. He used the same whisper here he used on Thaloria. The quarters keep the file because this one reaches toward the case itself.",
          },
          voId: "human.captains-quarters.mechronis-certification-file.look",
        },
      },
    },
  },
};
