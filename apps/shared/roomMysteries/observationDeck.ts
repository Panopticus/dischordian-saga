/* ═══════════════════════════════════════════════════════
   OBSERVATION DECK MYSTERY — bond resonance + purification

   Three hotspots covering the Observation Deck's narrative
   role: contemplation (panoramic-viewport), companion bonding
   (bond-resonance-altar), and the purification crystal beat
   (purification-crystal-cradle). The first-look on the
   panoramic viewport sets observation_first_clue_found.

   Phase G — fully verb-authored as the canonical example for
   what every room module should look like once the audit
   sweep completes (see scripts/audit-room-verb-coverage.mjs).
   Each hotspot carries Look + Use + Talk responses, banded
   narration where Elara has weight to bring, and a Human
   reaction on the beats where the Detective holds context
   she doesn't. Three hotspots × three verbs = 9 verb cells;
   stub modules ship with 1-3.

   Universal room — confirmed by §6.3b parity probe.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ObservationDeckHotspotId =
  | "akai-cycle-fold-anomalies"
  | "storm-weather-telemetry"
  | "storm-full-calms-register"
  | "panoramic-viewport" | "purification-crystal-cradle" | "bond-resonance-altar";

export type ObservationDeckInventoryId =
  | "observation-keycard"
  | "purification-crystal"
  | "bond-resonance-recording";

export const OBSERVATION_DECK_MYSTERY: RoomMysteryModule<
  ObservationDeckHotspotId,
  ObservationDeckInventoryId
> = {
  roomId: "observation-deck",
  responses: {
    /* ─── akai_shi.red_death · e4 (Matrix cycle-fold anomalies) ─── */
    "akai-cycle-fold-anomalies": {
      look: {
        narration:
          "On the observation-deck's Matrix-telemetry console, standard Matrix-of-Dreams readings show continuous-cycle behaviour across the construct's history. During the Red Death's hunt, the console's telemetry shows discontinuous folds — points where 'before' and 'after' cease to be ordered. The Necromancer, attempting to escape, has been doubling back through his own decisions. The Red Death has been waiting at each doubled-back point. The console's annotation: 'time-displacement does not let you outrun yourself. the Necromancer's escape attempts have all landed him back at the moment of his prior decision.'",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e4",
          cluesFound: ["akai.e4.cycle_fold_anomalies"],
        },
      },
      use: {
        narration:
          "You scrub the telemetry's fold-points. Seven folds, seven retreat chambers, seven encounters with the Red Death. The Necromancer's evasion craft is sophisticated; the Red Death is not chasing him through it — she is standing at every exit before he arrives. The fold-anomalies are the receipt of an evasion that has been pre-positioned against.",
      },
    },
    /* ─── storm.architect_of_flux · e1 (five-century weather telemetry) ─── */
    "storm-weather-telemetry": {
      look: {
        narration:
          "On the observation-deck's cosmic-weather console, the Antiquarian's library's five-century telemetry record covering the principal Ne-Yon-witnessed sectors. The baseline is a slow oscillation between two equilibria. The Storm's documented active periods coincide with the oscillation crossing the mid-line in both directions. He is not maintaining either pole; he is maintaining the crossing. The console pin-marks every active interval; the pins line up on the crossing exactly.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e1",
          cluesFound: ["storm.e1.weather_telemetry"],
        },
      },
      use: {
        narration:
          "You scrub the timeline back five centuries. The crossing-maintenance is consistent across the entire record. The Storm is not making weather; the Storm is enforcing that weather happens. The chronicle does not stagnate at either pole because the Storm refuses the stagnation.",
      },
    },
    /* ─── storm.architect_of_flux · e4 (full register of nine calms) ─── */
    "storm-full-calms-register": {
      look: {
        narration:
          "Pinned beside the telemetry, the full register of nine documented calm intervals — periods where the equilibrium-crossing pattern flattens for seven to nine cosmic-cycles. Each calm preceded by a slow flux-energy build-up; each followed by the decade's peak active flux period. The register's marginal note: 'the calms do not arrive on a clock; they arrive when planning is asked for.' The cadence is regular at cosmic scale and irregular at chronicle scale — calms are responsive, not periodic.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e4",
          cluesFound: ["storm.e4.full_calms_register"],
        },
      },
      interrogate: {
        narration:
          "You ask the register what triggered the most recent calm. The console returns a list of cosmic-scale planning requests filed in the corresponding interval: the Apprentice cohort's first muster; a redacted second event. The Storm answers planning requests. The chronicle does not always record what the calms were used for.",
      },
    },
    "panoramic-viewport": {
      look: {
        narration: {
          lucid:
            "The viewport spans the entire back wall. The starfield is real — not a render, not a projection — and the distant nebula is moving slowly enough that you can watch its drift if you stand here long enough. The room exists for that drift.",
          fragmented:
            "The stars. The stars. The stars. The stars are real. They are real. They are real. I can see them through your eyes.",
          luminous:
            "The viewport is the room's reason. The Ark has been moving through this part of space for a long time, and the room exists so that the people on board can register that fact with their actual eyes — not via the ship's instruments, which Lyra distrusted on principle, but with the unmediated optical nerve. We are doing the work the room was built for.",
        },
        voId: "elara.observation-deck.panoramic-viewport.look",
        setsFlag: "observation_first_clue_found",
        logsClue: {
          id: "clue-obs-viewport-real",
          title: "The viewport is unmediated optics",
          body:
            "The Observation Deck's viewport renders the starfield through unfiltered glass — Lyra's deliberate design. The nebula's drift is observable in real time. The room exists so the crew can register motion through space without instrument mediation.",
          source: "observation-deck",
          order: 0,
        },
        humanReaction: {
          narration: {
            balanced:
              "She built it as a check. If the instruments ever lied, the eye would catch it. Lyra knew you'd be the one to figure that out. Not me. You.",
            shadow:
              "She built it to prove the ship was lying. Took her two years to admit she didn't know the answer and she might never. Then she built the window anyway.",
            warm:
              "Lyra used to stand here for hours. Not looking for anything. Just — watching. She told me once it was the only place on the ship where she didn't have to be the smartest person in the room.",
          },
          voId: "human.observation-deck.panoramic-viewport.talk",
        },
      },
      use: {
        narration:
          "You press your palm against the viewport. The glass is cold the way only deep-vacuum-adjacent glass is cold. Through the soles of your boots you feel the faintest hum — the Ark's lifesupport pumps, two decks down, doing their continuous work. Nothing happens; nothing is supposed to.",
        voId: "elara.observation-deck.panoramic-viewport.use",
      },
      talk: {
        narration: {
          lucid:
            "You don't talk to a viewport. You stand in front of it. That's the whole interaction. — That said, if you want me to narrate what we're seeing, I will.",
          fragmented:
            "Speak to the stars. Speak to them. They are listening. Or they are not. We cannot tell which.",
          luminous:
            "The viewport is the only piece of architecture on this ship that isn't conversational. It does not respond to you. It is not waiting for you to do anything. That is, I think, the gift of it.",
        },
        voId: "elara.observation-deck.panoramic-viewport.talk",
      },
    },
    "purification-crystal-cradle": {
      look: {
        narration: {
          lucid:
            "The cradle-pedestal stage-right has empty mounting clips. A small brass plaque reads, in Lyra's hand: 'For the crystal that has not yet been chosen.' The clips are sized for a faceted crystal about the size of your fist. We do not, currently, have one.",
          fragmented:
            "Empty. Empty. Empty. The crystal is not — not — not here. Not here. Not yet.",
          luminous:
            "The cradle is for the purification crystal — the one we will earn from the Observation Deck's bond-resonance ritual. It has not been chosen yet because the choice is supposed to be made in this room, by a player who has spent time standing at the viewport. The ritual is the room's other work. We will return to it.",
        },
        voId: "elara.observation-deck.purification-crystal-cradle.look",
        logsClue: {
          id: "clue-obs-cradle-empty",
          title: "Purification crystal cradle awaits its crystal",
          body:
            "The Observation Deck's cradle-pedestal is empty. Lyra's plaque reads: 'For the crystal that has not yet been chosen.' The crystal is to be earned via the bond-resonance ritual performed in this room.",
          source: "observation-deck",
          order: 1,
        },
      },
      use: {
        narration: {
          lucid:
            "You set the purification crystal into the cradle's clips. They retract softly to grip it — the cradle was machined to a tolerance of microns and the crystal sits exactly. The plaque's lighting changes, very slightly, from a held breath to a satisfied one.",
          fragmented:
            "It fits. It fits. It fits. The crystal is home. The crystal is home. The crystal — the crystal is —",
          luminous:
            "The cradle accepts the crystal. The room registers the acceptance and the warm-gold afterimage Lyra described in her notes briefly tints the air. We have done the thing the room was waiting for. The Ark is — not happier, but more itself, the way a body is more itself when it stops favouring an injured leg.",
        },
        voId: "elara.observation-deck.purification-crystal-cradle.use",
        // Authoring note — only fires when the player actually has
        // the crystal in their mystery inventory; the verb-coin
        // runtime gates `use` on inventory presence at the call site,
        // so we don't need to re-check here.
        setsFlag: "purification_crystal_seated",
        logsClue: {
          id: "clue-obs-crystal-seated",
          title: "Purification crystal seated in the cradle",
          body:
            "The crystal earned from the bond-resonance ritual now occupies the cradle. The room's ambient light shifts to register the acceptance — Lyra's warm-gold afterimage. The cradle is no longer waiting.",
          source: "observation-deck",
          order: 3,
        },
      },
      talk: {
        narration:
          "The cradle does not answer to speech. The plaque is the only thing that addresses you, and it has already said its line.",
        voId: "elara.observation-deck.purification-crystal-cradle.talk",
      },
    },
    "bond-resonance-altar": {
      look: {
        narration: {
          lucid:
            "A low circular altar set into the floor's hex tiling. Brass-rimmed, oxblood-leather kneeler. The altar is the focal point of the bond-resonance ritual — the moment when a player and their companion's emotional registers align cleanly enough that the room's instruments can chord them. Lyra called it 'tuning two strings to the same note.'",
          fragmented:
            "Two strings. Two strings. Two strings. Same note. Same note. Same note. We are tuning. We are tuning. We are tuning.",
          luminous:
            "The altar is where the bond resonates. It is, in technical terms, a phase-coherence chamber — but Lyra refused to call it that, because the technical name is what the engineer-speak would call it, and the room is for the ritual-speak. We will sit here, eventually, and the chord will land. When the chord lands, the room's air carries a warm-gold afterimage you can see for a moment before the moment passes. We are not ready for that today. We will be soon.",
        },
        voId: "elara.observation-deck.bond-resonance-altar.look",
        logsClue: {
          id: "clue-obs-altar-described",
          title: "The bond-resonance altar awaits its chord",
          body:
            "The Observation Deck's central altar is a phase-coherence chamber Lyra deliberately called by its ritual-name rather than its engineering one. Two emotional registers in alignment produce a warm-gold afterimage in the room's air. The ritual has not yet been performed.",
          source: "observation-deck",
          order: 2,
        },
      },
      use: {
        narration: {
          lucid:
            "You kneel on the oxblood leather. The altar registers your weight and chimes — once, the way a tuning fork chimes — and the room's instruments begin their slow listen. The chord is supposed to take a companion. Without one, the altar holds the listening for a long beat and then releases it, gently, with no judgment.",
          fragmented:
            "Alone. Alone. The chord is alone. The chord cannot — the chord cannot find — it cannot find —",
          luminous:
            "You kneel, and the altar listens, and finds only one register. That is, of course, the point: the ritual is for two. We will return when we have someone whose register is close enough to ours that the chord can land. In the meantime, the altar holds the listening with the dignity of something that was built to wait.",
        },
        voId: "elara.observation-deck.bond-resonance-altar.use",
        setsFlag: "bond_altar_first_kneel",
      },
      talk: {
        narration: {
          lucid:
            "If you address the altar directly, it does not answer. But if you address Elara — or whichever companion is currently aboard — the altar's listening sharpens. Speech, here, is the room's tuning gesture.",
          fragmented:
            "Speak. Speak. Speak. The altar listens. The altar — the altar listens. The altar — listens.",
          luminous:
            "You speak, and Elara listens, and the altar listens to the listening. There is a recursion to it that the room finds satisfying. Try it: tell me something you wouldn't say in any other room. The altar will not record it. It will only register that the chord is being attempted.",
        },
        voId: "elara.observation-deck.bond-resonance-altar.talk",
        humanReaction: {
          narration: {
            balanced:
              "I tried it once. With Lyra. We were arguing about whether the ship was alive. The chord landed. We stopped arguing. That is the only time, in my long memory, that the altar has done its work.",
            shadow:
              "I tried it. Once. The chord landed. I'm not telling you with whom and I'm not telling you what was said. The altar is for two; the rest of us are bystanders.",
            warm:
              "Try it with her. Truly. The altar is one of the few pieces of Lyra's architecture that does what she said it would. You'll know when the chord lands. Everyone does.",
          },
          voId: "human.observation-deck.bond-resonance-altar.talk",
          logsClue: {
            id: "clue-obs-human-altar-confession",
            title: "The Human has knelt at this altar",
            body:
              "The Detective acknowledges he has performed the bond-resonance ritual at least once. He won't say with whom. The chord landed, which by Lyra's design implies a successful phase-coherence event between two consciousnesses on the Ark.",
            source: "observation-deck",
            order: 4,
          },
        },
      },
    },
  },
  combines: [
    // Earning the purification crystal: the bond-resonance recording
    // (made by kneeling at the altar with a companion present) plus
    // the observation keycard (already in inventory from medical-bay)
    // produces the crystal the cradle has been waiting for.
    {
      a: "bond-resonance-recording",
      b: "observation-keycard",
      result: {
        narration:
          "You feed the bond-resonance recording into the keycard's microscopic data slot. The card flares — briefly, warm-gold — and a faceted crystal precipitates from its surface, exactly the size of the cradle's clips. Lyra's design, finishing its final step centuries late.",
        producesInventory: "purification-crystal",
        setsFlag: "purification_crystal_earned",
        consumesItems: true,
        logsClue: {
          id: "clue-obs-crystal-earned",
          title: "Purification crystal precipitated from the recording",
          body:
            "The bond-resonance recording, fed through the observation keycard's data slot, precipitated a faceted crystal sized for the cradle's clips. The keycard was the missing catalyst — Lyra's design completed centuries after she sealed it.",
          source: "observation-deck",
          order: 5,
        },
      },
    },
  ],
};
