/* ═══════════════════════════════════════════════════════
   OBSERVATION DECK MYSTERY — bond resonance + purification

   Three hotspots covering the Observation Deck's narrative
   role: contemplation (panoramic-viewport), companion bonding
   (bond-resonance-altar), and the purification crystal beat
   (purification-crystal-cradle). The first-look on the
   panoramic viewport sets observation_first_clue_found.

   Universal room — confirmed by §6.3b parity probe.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ObservationDeckHotspotId =
  | "panoramic-viewport"
  | "purification-crystal-cradle"
  | "bond-resonance-altar";

export const OBSERVATION_DECK_MYSTERY: RoomMysteryModule<ObservationDeckHotspotId> = {
  roomId: "observation-deck",
  responses: {
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
    },
  },
};
