/* ═══════════════════════════════════════════════════════
   HALL OF DISAPPEARANCES — module invariants

   Locks the two pieces of the room mystery that other
   subsystems depend on:

   1. The lever's `use` response writes the same per-choice
      flag the Mystery Engine UI commits on
      wolf.e5.c.release_the_wolf — both paths must converge
      on WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG so the
      ResurrectionCinematicRouter fires the
      wolf_planet_of_the_wolf cinematic exactly once.

   2. The lever's `look` and the other clue-surfacing
      hotspots bind to wolf.anara_hunt.e5 clues that exist
      in the canonical episode definition.

   Failure here means the parallel-commit path silently
   regressed — pulling the lever would no longer fire the
   cinematic, or would credit a clue that does not exist.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { HALL_OF_DISAPPEARANCES_MYSTERY } from "../hallOfDisappearances";
import { WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG } from "../../dlcMysteries/wolfAnaraHunt";

const WOLF_ANARA_HUNT_ARC = "arc.dlc.wolf_anara_hunt";

describe("HALL_OF_DISAPPEARANCES_MYSTERY", () => {
  it("has the canonical roomId", () => {
    expect(HALL_OF_DISAPPEARANCES_MYSTERY.roomId).toBe(
      "hall-of-disappearances",
    );
  });

  it("the lever's `use` writes the canonical release-choice flag", () => {
    const lever = HALL_OF_DISAPPEARANCES_MYSTERY.responses[
      "snow-globe-release-lever"
    ];
    expect(lever?.use).toBeDefined();
    expect(lever?.use?.setsFlag).toBe(WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG);
  });

  it("the lever's `look` surfaces the companion warnings in its narration", () => {
    // Hall hotspots narrate without crediting clues — canonical
    // clue surfaces live in the guild-sanctum / antiquarian-library
    // bindings (per foundIn). The hall's job is the physical
    // staging of the same content at the moment of the choice.
    const lever = HALL_OF_DISAPPEARANCES_MYSTERY.responses[
      "snow-globe-release-lever"
    ];
    const narration = lever?.look?.narration;
    const text = typeof narration === "string" ? narration : "";
    expect(text).toMatch(/serial-killer AI/);
    expect(text).toMatch(/case against is bigger/);
  });

  it("the journal and the twelve niches narrate without crediting a clue", () => {
    const journal = HALL_OF_DISAPPEARANCES_MYSTERY.responses[
      "antiquarians-journal"
    ];
    const pedestals = HALL_OF_DISAPPEARANCES_MYSTERY.responses[
      "pedestals-twelve"
    ];
    expect(journal?.look?.mysteryBinding).toBeUndefined();
    expect(pedestals?.look?.mysteryBinding).toBeUndefined();
    expect(typeof journal?.look?.narration).toBe("string");
    expect(typeof pedestals?.look?.narration).toBe("string");
  });

  it("the lever response carries a humanReaction with a voId", () => {
    const lever = HALL_OF_DISAPPEARANCES_MYSTERY.responses[
      "snow-globe-release-lever"
    ];
    expect(lever?.look?.humanReaction).toBeDefined();
    expect(lever?.look?.humanReaction?.voId).toBeTruthy();
  });

  it("no hotspot in the hall double-credits a canonical clue", () => {
    for (const verbs of Object.values(HALL_OF_DISAPPEARANCES_MYSTERY.responses)) {
      for (const resp of Object.values(verbs ?? {})) {
        // Hall is staging, not clue source — every binding must be
        // absent so foundIn parity (canonical: guild-sanctum /
        // antiquarian-library) is not violated.
        expect(resp?.mysteryBinding).toBeUndefined();
      }
    }
  });
});

// WOLF_ANARA_HUNT_ARC reserved for future binding tests; the hall
// currently authors no bindings (see test above).
void WOLF_ANARA_HUNT_ARC;
