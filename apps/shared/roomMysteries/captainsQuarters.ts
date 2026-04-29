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

export type CaptainsQuartersHotspotId = "cat-photo";

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
            "You straighten the frame. The hook accepts the adjustment with the tired, slightly grateful click of a fixture that has been straightened many times by many hands. Mostly the same hand, lately.",
          fragmented:
            "Don't — don't take it. Don't take the cat. Don't take the cat. Leave it. Leave the cat. Leave the cat. Leave the cat.",
          luminous:
            "You straightened the frame. Thank you. Now whoever cleans it next will know we were here. That is, in this room, the closest thing we have to leaving a note.",
        },
        voId: "elara.captains-quarters.cat-photo.use",
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
      },
    },
  },
};
