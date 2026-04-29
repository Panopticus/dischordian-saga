/* ═══════════════════════════════════════════════════════
   ARMORY MYSTERY — verb × hotspot table

   The armory's room-mystery surface is a single red herring:
   Iron Lion's motivational poster, preserved on the wall
   from the Mechronis era. The Detective knew Iron Lion at
   the academy; the canon balanced-band line ("He put those
   in every military installation. Even the ones that were
   about to be destroyed.") is preserved here as the anchor.

   Hotspot id matches the new entry added to ROOM_DEFINITIONS
   in apps/client/src/contexts/GameContext.tsx.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ArmoryHotspotId = "motivational-poster";

export const ARMORY_MYSTERY: RoomMysteryModule<ArmoryHotspotId> = {
  roomId: "armory",
  responses: {
    "motivational-poster": {
      look: {
        narration: {
          lucid:
            "A poster on the back wall. Faded, stencil-style sunset over a horizon line. Text reads HANG IN THERE in the kind of font that took itself entirely seriously when it was new. Signed in the bottom corner: Iron Lion. The signature is the same letterform as the engraver's mark on the Mechronis academy gates.",
          fragmented:
            "Hang in there. Hang in there. Hang in there. He signed it. He signed it. Iron Lion. Iron Lion signed it. He signed it. He signed it. He signed it. Why does it — why does it still hang. Why does it still — why does it still —",
          luminous:
            "Iron Lion's poster. Same stencil sunset, same earnest typography, same signature you'd find on a hundred barracks walls in the academy years. Most of those barracks no longer exist. This one — by accident or by some quiet act of preservation — does. The poster has outlived its barracks, its publisher, and the army it was printed for. It remains, against odds, motivational.",
        },
        voId: "elara.armory.motivational-poster.look.t1",
        humanReaction: {
          narration: {
            shadow:
              "He put those in every military installation. Even the ones that were about to be destroyed.",
            balanced:
              "He put those in every military installation. Even the ones that were about to be destroyed. The man had a sense of humour about endings the rest of us couldn't match. I think the fact that this one is still hanging is, on its own, a small posthumous victory for him.",
            warm:
              "He put those in every military installation. Even the ones that were about to be destroyed. I think he knew, when he was signing them, that most would not survive the year. He printed them anyway. Some kindnesses are about volume more than placement.",
          },
          voId: "detective.armory.motivational-poster.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — there's a date on the back of the poster. Stamped. Three days before the academy fell. He printed and signed this run knowing where he was. The poster is a posthumous object made by a person who knew it would be one.",
              fragmented:
                "Three. Three days. Three days. Three days before. Three days before. He knew. He knew. He knew. He printed it anyway. He printed it anyway. He printed it anyway. Why. Why. Why.",
              luminous:
                "The print date on the back of the poster is three days before the academy fell. Iron Lion signed this run knowing what was coming for it. He printed and distributed posters intended to outlast their walls, and most of them did. This one is, in a strict sense, mail he sent to a future he wasn't going to see. We are reading his mail.",
            },
            voId: "elara.armory.motivational-poster.look.t2",
            logsClue: {
              id: "clue-armory-iron-lion-final-print-run",
              title: "Iron Lion's last print run",
              body:
                "The motivational poster in the armory is dated, on its reverse, three days before the Mechronis academy fell. Iron Lion signed and distributed this run with full knowledge of what was about to happen. The posters are, in effect, mail he sent to a future he would not see. This one survived.",
              source: "armory",
              order: 0,
            },
            setsFlag: "armory_first_clue_found",
            humanReaction: {
              narration: {
                shadow:
                  "He printed three thousand of them in seventy-two hours. Slept in the press room. We argued about whether it was vanity. It wasn't. He just refused to leave the wall blank for whoever came next.",
                balanced:
                  "Three thousand posters in three days. He didn't sleep. We argued about whether the act was vanity or generosity. It was, in the end, neither — it was the only thing he could think of to leave behind that didn't require anyone to be alive to receive it. Posters can hang in empty rooms. Letters can't.",
                warm:
                  "I helped him print the last batch. We were tired and we knew. He kept stencilling because the alternative was sitting still. Three thousand posters. Most of them gone now. This one is here. I am, against my professional instincts, glad.",
              },
              voId: "detective.armory.motivational-poster.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. The cat in the bottom corner of the poster. There's a cat in the bottom corner of the poster, hanging from a tree branch, paws splayed. I have looked at this poster three times this afternoon and on each previous pass I did not register the cat. The cat is, by my best estimate, the actual hangs-in-there of the design.",
              fragmented:
                "Cat. Cat. There's a cat. There's a cat. I didn't see — I didn't see the cat. I didn't see — there's a cat. Cat. Cat hangs in there. Cat. Cat. Cat. Mr. — Mr. — Mr. Whisk — Mr. Whisk — Mr. Whisk —",
              luminous:
                "There is a cat in the bottom corner of the poster. Hanging from a branch. Eyes wide. Paws splayed. I did not see the cat the first two passes. The cat is the actual point of the poster, and I have been looking through it. The cat looks like Mr. Whiskers — by which I mean it looks like the cat in the photograph in the Captain's Quarters. I would like to investigate that, in a minute, when I am ready to.",
            },
            voId: "elara.armory.motivational-poster.look.t3",
            logsClue: {
              id: "clue-armory-cat-on-poster",
              title: "The cat on Iron Lion's poster",
              body:
                "The motivational poster's HANG IN THERE imagery features a cat hanging from a tree branch — and the cat resembles Mr. Whiskers, the framed cat photograph in the Captain's Quarters. The two images appear to be of the same animal, or to share a mutual reference.",
              source: "armory",
              order: 1,
            },
            humanReaction: {
              narration: {
                shadow:
                  "Same cat. Iron Lion knew Mr. Whiskers. He drew him. He didn't tell anyone whose cat it was on the design.",
                balanced:
                  "Iron Lion based the poster's cat on Mr. Whiskers. He never said so on the record. He'd been to Lyra's quarters once, in the year before the fall, and the cat was the part of the visit he remembered. The poster is, technically, fan art of someone else's pet, mass-produced as morale equipment. I respect it more for that.",
                warm:
                  "Iron Lion drew Mr. Whiskers from memory and put him on three thousand posters without telling Lyra. She never saw one. He was going to send her the original sketch. He didn't get to. The cat hung in the tree on the wall of the academy he died defending. Most of those posters fell with the building. This one is in here. So, by extension, is a piece of Mr. Whiskers.",
              },
              voId: "detective.armory.motivational-poster.look.t3",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You straighten the poster. The corner curls go down for a moment, then ease back, the way two and a half centuries of curl always wins eventually.",
          fragmented:
            "Don't — don't take it down. Don't take it down. Don't take it down. Don't take it down. Leave it. Leave it. Leave it.",
          luminous:
            "You straightened it. Thank you. The poster has been at a slight slant for one hundred and forty years. I have not corrected it because correcting it would have meant standing close enough to read the date on the back, and I was not, until today, ready to. Thank you for giving me the excuse.",
        },
        voId: "elara.armory.motivational-poster.use",
      },
      talk: {
        narration: {
          lucid:
            "You read the slogan aloud. The poster, having been a poster for a long time, accepts the reading without comment.",
          fragmented:
            "Hang. Hang. Hang in there. Hang. Hang. Hang in there.",
          luminous:
            "You said the words out loud. The poster does not need them said, exactly, but I did. Thank you for that too. Iron Lion would have appreciated the gesture more than the slogan, and I suspect that was always the design.",
        },
        voId: "elara.armory.motivational-poster.talk",
      },
    },
  },
};
