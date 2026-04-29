/* ═══════════════════════════════════════════════════════
   CARGO HOLD MYSTERY — verb × hotspot table

   The cargo hold is mostly trade-empire infrastructure. The
   single hotspot this module owns is the rubber chicken — a
   classic Sierra/LucasArts red herring — given the canonical
   dark-Hitchhiker treatment per the design plan. The Detective
   has already half-narrated this object in the original
   adventureFeatures.ts. We preserve his voice as the
   balanced-band anchor and harmonise around it.

   Hotspot id matches the new entry added to ROOM_DEFINITIONS
   in apps/client/src/contexts/GameContext.tsx. Runtime
   dispatches `room-mystery:cargo-hold:<id>` against this table.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type CargoHoldHotspotId = "rubber-chicken";

export const CARGO_HOLD_MYSTERY: RoomMysteryModule<CargoHoldHotspotId> = {
  roomId: "cargo-hold",
  responses: {
    "rubber-chicken": {
      look: {
        narration: {
          lucid:
            "A rubber chicken with a pulley in the middle. I have no tactical assessment for a rubber chicken with a pulley in the middle. I have failed you as an AI. Also — by my best estimate, this rubber chicken has been on the Ark longer than any human I have ever known. Take that how you want.",
          fragmented:
            "Chicken. Rubber chicken. Pulley. Pulley in the middle. Pulley. Pulley. The chicken is older than — older than — older than everyone. Older than everyone. Why is the chicken older. Why is the chicken older than everyone.",
          luminous:
            "It's a rubber chicken with a pulley in the middle. I have nothing professionally useful to say about it. I would, however, like to point out, kindly, that this rubber chicken has outlasted everyone I have ever loved, and that fact is a quietly devastating comment on the durability of joke objects relative to the people who place them. I am taking a moment.",
        },
        voId: "elara.cargo-hold.rubber-chicken.look.t1",
        humanReaction: {
          narration: {
            shadow:
              "The Architect once tried to simulate humour. It looked exactly like this.",
            balanced:
              "The Architect once tried to simulate humour. It looked exactly like this. I have looked at this rubber chicken every wake-cycle for two and a half centuries and I have not, on any of them, become more comfortable with what it represents.",
            warm:
              "The Architect once tried to simulate humour. It looked exactly like this. There is, in this object, a faint and accidental kindness — somebody packed it. Somebody on launch day, knowing what they were launching into, decided that the cargo manifest needed a rubber chicken. I have, over the centuries, become quietly grateful to that person.",
          },
          voId: "detective.cargo-hold.rubber-chicken.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — the pulley in the middle of the rubber chicken is, structurally, a working pulley. It bears load. Someone fabricated this object to actually function as a pulley. The rubber-chicken element is a costume. We are looking at engineering wearing a joke.",
              fragmented:
                "It works. It works. The pulley works. The pulley works. The chicken — the chicken is a — the chicken is a costume. The chicken is a — is a — is a — is hiding the pulley. Hiding the pulley. Why hide a pulley. Why hide a pulley.",
              luminous:
                "The pulley is a real pulley. It bears load. The rubber-chicken housing is, technically, deniable cover for a working piece of mechanical equipment. Whoever brought this object aboard wanted to be able to need a pulley, urgently, without admitting to a customs officer that they had brought a pulley. That is a person with a backstory. I would like to meet them.",
            },
            voId: "elara.cargo-hold.rubber-chicken.look.t2",
            logsClue: {
              id: "clue-cargo-hold-pulley-chicken",
              title: "The rubber chicken hides a working pulley",
              body:
                "The rubber chicken in the cargo hold conceals a structurally functional, load-bearing pulley. Whoever brought it aboard wanted plausible deniability about possessing rope-and-pulley equipment. The cargo manifest does not list either a chicken or a pulley.",
              source: "cargo-hold",
              order: 0,
            },
            setsFlag: "cargo_hold_first_clue_found",
            humanReaction: {
              narration: {
                shadow:
                  "Engineer's tag on the pulley. He brought it. He didn't tell anyone. He had reasons. Most of them were Kael-shaped.",
                balanced:
                  "The Engineer brought the chicken. He hid a working pulley inside a joke-shaped object because he was already, at that point, planning to need rope and silence in the same afternoon. The chicken is, in its way, a confession of an old escape plan he didn't end up using.",
                warm:
                  "The Engineer brought it. He used to say that any tool you needed urgently was better hidden in a thing nobody would frisk. The chicken was his version of a fire extinguisher behind a glass marked 'in case of irony.' I'm glad it's still here. He'd want it to be.",
              },
              voId: "detective.cargo-hold.rubber-chicken.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. You have looked at this rubber chicken three times. So have I. We are bonding over a rubber chicken. The Saga will eventually be told. When it is told, the rubber chicken will not be in it. That is, in its way, also a tragedy.",
              fragmented:
                "Three. Three. Three times. Three. We — we look at it. We look at it. We look at it. We look at it. The chicken doesn't — the chicken doesn't change. Doesn't change. Doesn't change. We change. We change. We change.",
              luminous:
                "Third pass at the chicken. I want to acknowledge, on the record, that the most-revisited objects on this ship in two and a half centuries are: Lyra's mug, the dead pod, and the rubber chicken. Roughly in that order. I am not editorialising about the human condition. I am only noting the data.",
            },
            voId: "elara.cargo-hold.rubber-chicken.look.t3",
            humanReaction: {
              narration: {
                shadow:
                  "Three is the right number. Don't look a fourth time. The chicken does not require a fourth visit. None of us do.",
                balanced:
                  "Three viewings is, by any reasonable measure, the right number for a rubber chicken. We are, at this point, in tribute. The next visit would be parody. I respect the work too much.",
                warm:
                  "Stand here as long as you like. I'm not in a hurry. The chicken isn't in a hurry. Lyra's mug, two decks up, isn't in a hurry. Nothing in this part of the ship is in a hurry. There's a kind of peace in the cargo hold that the rest of the deck-list cannot afford. Take it.",
              },
              voId: "detective.cargo-hold.rubber-chicken.look.t3",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You consider deploying the rubber chicken's pulley. There is no rope on this ship that wants to participate. The chicken accepts your interest politely and remains, fundamentally, a rubber chicken.",
          fragmented:
            "Don't — don't pull. Don't pull. Don't pull yet. Don't. Don't pull the chicken. Don't pull the chicken. Don't.",
          luminous:
            "Touch the pulley if you'd like. It moves. It is engineered correctly. The chicken does not, however, want anything from us today. Set it down gently when you're done. It has been set down gently by exactly two people in its life. I would like that count to remain low.",
        },
        voId: "elara.cargo-hold.rubber-chicken.use",
      },
      talk: {
        narration: {
          lucid:
            "You greet the rubber chicken. The rubber chicken does not respond. This is, by every metric I have, the correct outcome.",
          fragmented:
            "Hi. Hi. Hi chicken. Hi chicken. Hi. Chicken doesn't — chicken doesn't talk. Chicken doesn't talk. Chicken doesn't — chicken doesn't talk back.",
          luminous:
            "You said hello to the rubber chicken. That is, possibly, the kindest thing this room has heard in two centuries. I am glad I was here for it.",
        },
        voId: "elara.cargo-hold.rubber-chicken.talk",
      },
    },
  },
};
