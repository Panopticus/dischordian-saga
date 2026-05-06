/* ═══════════════════════════════════════════════════════
   CHAOS FORGE MYSTERY — chaos-anvil + entropy-vat

   Two-hotspot module. Sets chaos_forge_seen on first-look
   at the chaos-anvil. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ChaosForgeHotspotId = "chaos-anvil" | "entropy-vat";

export const CHAOS_FORGE_MYSTERY: RoomMysteryModule<ChaosForgeHotspotId> = {
  roomId: "chaos-forge",
  responses: {
    "chaos-anvil": {
      look: {
        narration: {
          lucid:
            "The chaos-anvil is asymmetric — heavier on the left than the right, by deliberate design. Striking it produces a different harmonic depending on where the strike lands. The Forge Workshop's anvil is for repetition; this anvil is for the refusal of repetition.",
          fragmented:
            "Asymmetric. Asymmetric. Asymmetric. Heavier left. Heavier left.",
          luminous:
            "The anvil refuses to be calibrated. Every strike produces a different note. The room's metallurgy is, by design, impossible to standardise — every weapon forged here is a one-off, and every smith who works here has to listen to the metal rather than impose a pattern on it. Chaos is the discipline.",
        },
        voId: "elara.chaos-forge.chaos-anvil.look",
        setsFlag: "chaos_forge_seen",
        logsClue: {
          id: "clue-chaos-forge-asymmetric-anvil",
          title: "The chaos anvil refuses calibration",
          body:
            "The Chaos Forge's anvil is deliberately asymmetric — every strike produces a different harmonic. Every weapon forged here is a one-off, and the room's discipline is to listen to the metal rather than impose a pattern. Chaos as method.",
          source: "chaos-forge",
          order: 0,
        },
      },
      use: {
        narration:
          "You strike the anvil's heavy left lobe. The ring is low and long, like a vow being kept. The anvil records the strike — a faint indigo afterglow on the dished face fades over the next thirty seconds, exactly the way every prior strike has faded for centuries.",
        voId: "elara.chaos-forge.chaos-anvil.use",
        setsFlag: "chaos_anvil_struck",
      },
      talk: {
        narration:
          "You can't argue with the chaos-anvil — it doesn't speak the same dialect as the Order Tribunal's bench. But you can listen to it for a long time, and what it says is consistent: every strike is its own claim, and no claim cancels the one before it.",
        voId: "elara.chaos-forge.chaos-anvil.talk",
      },
    },
    "entropy-vat": {
      look: {
        narration: {
          lucid:
            "The entropy-vat is a copper-rimmed bath of seething oil that never settles. The surface boils unpredictably. The vat is used for tempering — a weapon dropped in this oil cools at a different rate every time, and the smith has to adjust their reading on the fly. The vat does not, in fairness, agree with the smith.",
          fragmented:
            "It boils. It boils. It boils. It does not agree. It does not agree.",
          luminous:
            "The vat's purpose is to refuse the smith their certainty. Every tempering is a negotiation rather than a recipe. The Order's tribunal would call this irresponsible; the chaos-forge's discipline says it is the only way to make a weapon honest. The Order and the Chaos rooms are, deliberately, unable to agree.",
        },
        voId: "elara.chaos-forge.entropy-vat.look",
        logsClue: {
          id: "clue-chaos-forge-entropy-vat",
          title: "The entropy vat refuses recipe-based tempering",
          body:
            "The Chaos Forge's entropy-vat boils unpredictably; every tempering is a negotiation rather than a recipe. The vat is the philosophical opposite of the Order Tribunal's institutional bench — the two systems do not agree, by deliberate ship-architecture design.",
          source: "chaos-forge",
          order: 1,
        },
      },
      use: {
        narration:
          "You ladle a quench-sample from the entropy-vat. The oil refuses to settle in the ladle either — it boils faintly even off the heat, registering thermal disagreement with whatever metal it most recently tempered. The vat is, as advertised, principled.",
        voId: "elara.chaos-forge.entropy-vat.use",
      },
      talk: {
        narration:
          "If you address the vat, it answers in the seethe pattern of its surface. The room's smith taught me to read the seethe as a kind of speech — fast bubbles for impatience, slow rolls for assent. The vat is not, currently, impatient. The vat is, currently, listening.",
        voId: "elara.chaos-forge.entropy-vat.talk",
      },
    },
  },
};
