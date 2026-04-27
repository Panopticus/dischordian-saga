/* ═══════════════════════════════════════════════════════
   ENGINEERING MYSTERY — verb × hotspot table

   Engineering is the Ark's heart-of-power deck. The reactor
   runs on Dream — crystallised quantum consciousness — and
   it is bleeding capacity. The previous engineers stopped
   working mid-job. Some of what they left behind is unfinished
   art; some of it is a warning.

   Tier progression (apps/shared/roomTier.ts):
     0 → 1   first Look on any clue-bearing hotspot →
             `engineering_first_clue_found`
     1 → 2   `engineering_signal_booster_built` — set when the
             player completes the antenna+amplifier combine
             described in apps/client/src/game/adventureFeatures.ts
             INVENTORY_COMBINATIONS (left to a follow-up runtime
             hook for now)
     2 → 3   `engineering_research_bench_online` — set when the
             research minigame first completes
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type EngineeringHotspotId =
  | "crafting-bench"
  | "reactor-core"
  | "blueprints"
  | "egg-eng-formula";

export const ENGINEERING_MYSTERY: RoomMysteryModule<EngineeringHotspotId> = {
  roomId: "engineering",
  responses: {
    "reactor-core": {
      look: {
        narration:
          "The core runs on Dream — crystallised quantum consciousness, the same substance that powers what you can do. The capacity readout sits at 34% and is dropping by tenths every cycle. Whoever last calibrated this thing did not finish.",
        logsClue: {
          id: "clue-engineering-reactor-bleed",
          title: "The reactor is bleeding capacity",
          body: "The Ark's reactor core is at 34% capacity and trending downward. The bleed is slow — measured in tenths per cycle — but it is unambiguous. The previous engineer halted mid-calibration.",
          source: "engineering",
          order: 0,
        },
        setsFlag: "engineering_first_clue_found",
      },
      use: {
        narration:
          "You can't recalibrate the core by hand. You'd need a fresh resonance equation and a Research Station to compile it. The bench is right there.",
      },
    },
    "blueprints": {
      look: {
        narration:
          "Floating holo-schematics of cards that were never finished. Three are stamped LEGENDARY-CLASS — the kind of design that turns a fight. Two of the three have the same engineer's initials in the bottom corner: L. V. The third has no initials at all.",
        logsClue: {
          id: "clue-engineering-vox-blueprints",
          title: "Vox initialled two of the three legendary blueprints",
          body: "Two of the three unfinished legendary card schematics in Engineering carry Dr. Lyra Vox's initials. The third, more dangerous than either, is unsigned.",
          source: "engineering",
          order: 1,
        },
        setsFlag: "engineering_first_clue_found",
      },
      talk: {
        narration:
          "Elara: \"The unsigned one is the one we should be worried about. Whoever finished it didn't want their name on it. That is rarely a generous instinct.\"",
      },
    },
    "crafting-bench": {
      look: {
        narration:
          "The workbench is laid out for a job that was never started. Tools in the right hands. A blank fusion socket waiting for two cards. The bench's last user logged off mid-procedure and never came back.",
        logsClue: {
          id: "clue-engineering-abandoned-bench",
          title: "A crafting job that was never started",
          body: "The Engineering workbench was laid out for a fusion job and abandoned. The components are still on the bench. Whatever the engineer was about to make, they were interrupted before the first weld.",
          source: "engineering",
          order: 2,
        },
        setsFlag: "engineering_first_clue_found",
      },
      // The `use` verb falls through to the existing /research-lab
      // route action so the player can still reach the live crafting
      // system from this hotspot.
    },
    "egg-eng-formula": {
      look: {
        narration:
          "A dimensional resonance equation, etched by hand into the reactor housing. Clean math, except for the extra term: Ψ-null. The null-consciousness coefficient. A door to nowhere — the space between spaces. The Source dwells there. Nobody scratches this casually.",
        logsClue: {
          id: "clue-engineering-psi-null-formula",
          title: "The Ψ-null formula",
          body: "Someone etched a dimensional-resonance formula into the reactor housing carrying a Ψ-null term — the null-consciousness coefficient. The math points at the space the Source occupies. It was scratched by hand, deliberately, by someone who wanted it found.",
          source: "engineering",
          order: 3,
        },
        setsFlag: "engineering_first_clue_found",
      },
    },
  },
};
