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

export type CargoHoldHotspotId =
  | "rubber-chicken"
  | "the-cursed-forest-depot"
  | "resur-ark-passenger-manifest"
  | "charter2-house-marek";

export const CARGO_HOLD_MYSTERY: RoomMysteryModule<CargoHoldHotspotId> = {
  roomId: "cargo-hold",
  responses: {
    /* ─── charter.second_signatory · e3 (House Marek — toolmakers) ─── */
    "charter2-house-marek": {
      look: {
        narration:
          "In the cargo-hold's House-Marek workshops sub-corridor, House Marek's toolmakers: three families, one tool-room, four epochs of continuous output. The Marek ledger has the same scrubber's hand on their charter-signature erasure.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.house_marek"],
        },
      },
      use: {
        narration:
          "You lift the Marek ledger from its corner. The leather is older than the binding repairs; the binding repairs are older than the most recent erasure. The page that should carry the charter signature is intact in fibre but smooth in ink — the scrubber lifted the surface without disturbing the substrate. Professional work.",
        voId: "elara.cargo-hold.charter2-house-marek.use",
      },
      talk: {
        narration:
          "You read the ledger's surviving headings aloud. Three families, one tool-room, four epochs. The cargo-hold's acoustics swallow the names; the names belong on a workshop's threshold, not in a warehouse. You will say them again, properly, when you reach the workshop they have been edited out of.",
        voId: "elara.cargo-hold.charter2-house-marek.talk",
      },
    },
    /* ─── resurrectionist.cycle_walker · e2 (Inception Ark passenger manifest) ─── */
    "resur-ark-passenger-manifest": {
      look: {
        narration:
          "In the cargo-hold's passenger-records crate, a partial manifest from one of the Inception Arks, recovered with the cult's redactions still legible at the edges. Seven names visible in the un-redacted portion; an eighth name redacted to a black bar. The black bar's length is consistent across copies of the manifest — not a casual erasure; a positioned occupant. The Antiquarian's reading: the redaction is structural. Someone was on the Ark whose presence the cult-curated record will not name.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e2",
          cluesFound: ["resur.e2.ark_passenger_manifest"],
        },
      },
      use: {
        narration:
          "You hold the manifest against the cargo-hold's overhead lamp. The black bar carries an embossing the redactor's ink did not flatten — a faint cartouche at the eighth position. The cartouche is the cult's house-mark for a passenger they were obligated to carry and forbidden to name. The seal is consistent with the Resurrectionist's earliest documented signatures.",
        voId: "elara.cargo-hold.resur-ark-passenger-manifest.use",
      },
      talk: {
        narration:
          "You read the seven visible names. The cargo-hold has heard a great many manifest-readings; it accepts another without comment. The eighth position remains a black bar. You leave a pause for it anyway, the way a courtroom leaves a pause for a witness who was never called.",
        voId: "elara.cargo-hold.resur-ark-passenger-manifest.talk",
      },
    },
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
    // Fenra arc, E2: a cargo hold IS a depot, which makes it the
    // honest room to read the Cursed Forest as the Hierarchy's
    // logistics warehouse — the place expansion is physically
    // staged before it is spent. I keep my voice level here; the
    // horror in this one is the inventory line, not the rhetoric.
    "the-cursed-forest-depot": {
      look: {
        narration: {
          lucid:
            "There is a captured operations placard wired to the central container, recovered from a Hierarchy logistics file. It names Fenra's domain — the Cursed Forest — and it does not call it a battlefield. It calls it a hub. Stand in this hold a moment and you will understand the filing exactly: this is a cargo bay, stacked both walls, a shaft of light on a central pallet, corridors running off to where the next thing is staged. A depot is not where a war is fought. It is where the war is warehoused before it is spent. The placard files the Cursed Forest as the one place the Hierarchy's seventeen-front expansion is physically held — corrupted-soul supply chains routed in, conquered-territory integration processed, the dimensional logistics that fed the hunt all staged from it. I am reading it the way I read this room: not a front, an inventory.",
          fragmented:
            "Not a battlefield. Not a battlefield. A hub. A hub. A depot. The Cursed Forest is a depot. Warehoused before it is spent. Before it is spent. Routed in. Staged. Staged. The war is in storage. The war is in storage here.",
          luminous:
            "The placard, read against the room it is wired into: the Cursed Forest is Fenra's domain and the Hierarchy's logistics hub, and the word the captured file refuses is battlefield. It uses hub, the way this hold is a hub — a place where things arrive, are held, and leave on schedule for somewhere they will be spent. Corrupted-soul supply chains route through it; conquered-territory integration is processed there; the seventeen-front hunt staged from it. I will say the quiet thing the cargo bay makes unavoidable: a war you can warehouse is a war someone has turned into stock. The Forest is not where the Hierarchy fights. It is where the Hierarchy keeps what it fights with.",
        },
        voId: "elara.cargo-hold.the-cursed-forest-depot.look",
        logsClue: {
          id: "clue-cargo-hold-cursed-forest-depot",
          title: "The Cursed Forest Is a Depot",
          body:
            "Fenra's domain and the Hierarchy's logistics hub: the Cursed Forest. Corrupted-soul supply chains route through it; conquered-territory integration is processed there; the dimensional-warfare logistics that fed the seventeen-front hunt staged from it. The Forest is not a battlefield. It is a depot — the one place the Hierarchy's expansion is physically warehoused before it is spent.",
          source: "cargo-hold",
          order: 1,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e2",
          cluesFound: ["fenra.e2.the_cursed_forest"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Not a battlefield — a hub. The Forest is where the seventeen-front war is warehoused before it is spent.",
            balanced:
              "Read it standing in a cargo hold and the file makes sense: a depot is not where the war is fought, it is where it is stored. The Cursed Forest is the one place the Hierarchy's expansion is physically held.",
            warm:
              "We store fuel and field rations in this room and call it a hold. She stored a war the same way and called it a hub. I have stood in a lot of storage bays. This is the first one that frightens me.",
          },
          voId: "human.cargo-hold.the-cursed-forest-depot.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the throughput manifest clipped behind the placard. A depot is defined by what moves through it, and I am going to read this line exactly as it is written, because softening it would be a lie. The Cursed Forest's throughput is corrupted souls — conquered populations converted into the Hierarchy's operational supply. Fenra's celebrated logistics, the on-schedule coordination that fed seventeen fronts, are the logistics of processed people. Her supply chain's units are souls. I have spent two and a half centuries reading inventory manifests on this ship; I know the grammar. This one counts the dead the way ours counts crates, and it does it accurately, and the accuracy is the part I cannot put down. The efficiency is the horror. They are not two findings. They are one.",
          fragmented:
            "What moves through. What moves through. Souls. Souls. Corrupted souls. The units are souls. The units are souls. Processed people. On schedule. On schedule. Counted like crates. Counted accurately. The accuracy. The accuracy is the horror.",
          luminous:
            "The manifest, read the way this room teaches you to read a manifest: throughput is the thing a depot is for, and the Cursed Forest's throughput is corrupted souls — conquered populations turned into the next conquest's fuel, reliably, at scale. I will not separate the two halves, because the file does not and the truth does not. Fenra is not a brilliant logistician who unfortunately traffics in souls. The brilliance and the trafficking are the same operation, written on one line, balanced to the gram. There is no version of 'she ran it flawlessly' that is not also the whole of the indictment.",
        },
        voId: "elara.cargo-hold.the-cursed-forest-depot.use",
        logsClue: {
          id: "clue-cargo-hold-what-routes-through",
          title: "What Routes Through the Forest",
          body:
            "The Cursed Forest's throughput is corrupted souls — conquered populations converted into the Hierarchy's operational supply. The logistics Fenra runs so efficiently are the logistics of processed people. Her supply chain's units are souls; her on-schedule coordination is the on-schedule conversion of the conquered into the fuel of the next conquest. The efficiency is the horror; the horror is not separable from the efficiency.",
          source: "cargo-hold",
          order: 2,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e2",
          cluesFound: ["fenra.e2.what_routes_through"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The throughput is souls. Conquered people, converted to supply, on schedule. The efficiency is the horror — they are one thing.",
            balanced:
              "Read as a manifest: the units in her supply chain are souls, counted accurately and moved on time. There is no flawless-logistics reading that is not also the indictment in full.",
            warm:
              "She ran it perfectly. I keep wanting that to be a separate fact from what she ran, and the room will not let it be. Perfect is the worst word in this file, not the best one.",
          },
          voId: "human.cargo-hold.the-cursed-forest-depot.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the placard on what the depot pays to be the depot. A hub is consumed by being one — I have watched it happen to the load-bearing decks of this ship. The Cursed Forest's curse is not set dressing; it is the accumulated cost of being the place every conquered soul is routed through. The Forest is degrading under its own throughput. And here is the structural fact, stated plainly so the Insurgency can use it: Fenra's operational genius keeps the seventeen fronts fed. It does not, and was never designed to, keep the depot alive. The kitchen is being eaten by what it cooks. The Hierarchy's whole expansion runs through one site that is dying on schedule — and the being who runs it is canonically the one least incentivized to notice, because noticing is not a line in the operational manifest.",
          fragmented:
            "Consumed by being one. Consumed. The curse is the cost. The cost. Degrading under its own load. Degrading. Keeps the fronts fed. Does not keep the depot alive. The kitchen is eaten by what it cooks. One site. Dying on schedule. Dying on schedule.",
          luminous:
            "The last reading, and the one a depot understands best: a hub is paid for by being a hub. The Cursed Forest's curse is the bill — the accumulated cost of being the single point every conquered soul is routed through, and it is coming due as degradation. Fenra's logistics keep the fronts fed; nothing keeps the hub alive, because the hub was never a protected asset, only a processing site. I file the vulnerability without softening it, because it is the most useful thing in the room: the Hierarchy's expansion has one kitchen, it is dying under its own load, and the architect of the load is the one structurally guaranteed not to look up. That is not a flaw the Insurgency has to create. It is one the Insurgency has to reach before the Forest reaches it first.",
        },
        voId: "elara.cargo-hold.the-cursed-forest-depot.talk",
        logsClue: {
          id: "clue-cargo-hold-the-forest-pays",
          title: "What the Forest Pays to Be the Kitchen",
          body:
            "A logistics hub is consumed by being one. The Cursed Forest's curse is the accumulated cost of being the place every conquered soul is routed through; the Forest is degrading under its own throughput. Fenra's operational genius keeps the seventeen fronts fed; it does not, and is not designed to, keep the depot alive. The kitchen is being eaten by what it cooks — the Hierarchy's expansion has one dying single point of failure.",
          source: "cargo-hold",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e2",
          cluesFound: ["fenra.e2.the_forest_pays"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The depot is dying under its own load. Her logistics feed the fronts; nothing keeps the hub alive. One site, failing on schedule.",
            balanced:
              "The curse is the bill for being the only kitchen. The expansion has one dying single point of failure, and its architect is the one guaranteed not to notice — a target the Insurgency must reach before the Forest collapses on its own.",
            warm:
              "She built the Hierarchy a strength that is eating itself, and she will be the last to see it, because seeing it is not on the manifest. We have to get there first. That is the whole of what this room is telling us.",
          },
          voId: "human.cargo-hold.the-cursed-forest-depot.talk",
        },
      },
    },
  },
};
