/* ═══════════════════════════════════════════════════════
   POTENTIAL FACTION NPCS

   The eight faction leaders from spec §1.2. Kept in a
   parallel registry from FACTION_NPCS so Batch C can ship
   without restructuring the original 7-NPC map. The client
   merges both maps at render time.

   Shape mirrors FactionNPC from apps/client/src/game/factionNPCs.ts
   but uses its own id union to avoid circular imports across
   the client/shared boundary.
   ═══════════════════════════════════════════════════════ */

import type { PotentialFactionId } from "./potentialFactions";

export type PotentialFactionNPCId =
  | "thael_vo"
  | "seris_fen"
  | "mira_loth"
  | "arch_burner_vel"
  | "architect_prime_zyn7"
  | "general_axis9"
  | "praxis_4"
  | "architects_echo";

export interface PotentialFactionNPC {
  id: PotentialFactionNPCId;
  name: string;
  title: string;
  factionId: PotentialFactionId;
  manifestation:
    | "hologram"
    | "comms_signal"
    | "substrate"
    | "physical_trace"
    | "temporal_echo";
  color: string;
  /** Lower = faster, more confident */
  typeSpeed: number;
  /** Core philosophy — what they want from the player */
  agenda: string;
  /** Sector id where they are primarily found */
  primaryRoom: string;
  secondaryRooms: string[];
  /** First-contact greeting, verbatim from spec where quoted */
  firstContact: string;
  /** Signature monologue that fires once relationship threshold reached */
  signatureMonologue: string;
  /** What they want the player to do */
  objective: string;
}

export const POTENTIAL_FACTION_NPCS: Record<PotentialFactionNPCId, PotentialFactionNPC> = {
  /* ═══ DEMAGI COOPERATIVE ═══ */
  thael_vo: {
    id: "thael_vo",
    name: "Thael-Vo",
    title: "Council Speaker, Elemental Assembly",
    factionId: "demagi_assembly",
    manifestation: "hologram",
    color: "#86efac",
    typeSpeed: 20,
    agenda:
      "Moderate DeMagi governance through distributed elemental councils. Works with Quarchon cooperatively. Prevents Pure Flame radicalization without alienating grieving members.",
    primaryRoom: "free_ports",
    secondaryRooms: ["research_corridor_beta", "frontier_worlds"],
    firstContact:
      "Potential of Ark 1047. I am Thael-Vo, Earth-Speaker of the Elemental Assembly. We have been watching your awakening. We have been watching your choices. You have been kind to the living systems around you. This matters to us.",
    signatureMonologue:
      "I want to tell you why I chose Earth as my elemental affinity. Not politically — personally. When I first accessed the affinity, I was expecting power. Strength. What I got was: I could feel the weight of things. Not just physical weight. The weight of history. It took me three years to understand that the heaviness wasn't a flaw. It was information. Earth Potentials feel that weight so we can decide what to carry.",
    objective:
      "Mediate between DeMagi and Quarchon institutions without surrendering elemental governance to probability models.",
  },

  /* ═══ DEMAGI MILITARY ═══ */
  seris_fen: {
    id: "seris_fen",
    name: "Seris-Fen",
    title: "Commander, Warden's Vanguard",
    factionId: "demagi_wardens",
    manifestation: "comms_signal",
    color: "#f87171",
    typeSpeed: 14,
    agenda:
      "Maintain hard-power parity with Quarchon factions until the Probability Accord publishes verifiable disarmament. Prevent any single machine intelligence from accumulating Architect-scale control.",
    primaryRoom: "panopticon_ruins",
    secondaryRooms: ["empire_frontier", "atarion_ruins"],
    firstContact:
      "Potential. I am Commander Seris-Fen. The Vanguard does not ask for your loyalty. It asks for your attention. Watch the Quarchon. Watch what they build. And if you see what we see, come find us.",
    signatureMonologue:
      "My sister died at the Fall. Machine precision killed her — not malice, efficiency. Twelve thousand years later, a General named Axis-9 offers me precision as a gift. I accept it, because I am not a fool. I also never forget it. There is a difference between working with machines and trusting them.",
    objective:
      "Confirm or deny the Reality Institute's alleged weapons research without starting a shooting war.",
  },

  /* ═══ DEMAGI SCIENTIFIC ═══ */
  mira_loth: {
    id: "mira_loth",
    name: "Dr. Mira Loth",
    title: "Director, Resonance Institute",
    factionId: "demagi_resonance",
    manifestation: "hologram",
    color: "#60a5fa",
    typeSpeed: 22,
    agenda:
      "Complete nineteen years of stalled cross-species research with Theorist Praxis-4. Deliver elemental resonance findings that stabilize dimensional rifts before the Vortex arrives.",
    primaryRoom: "research_corridor_beta",
    secondaryRooms: ["research_corridor_alpha", "free_ports"],
    firstContact:
      "We've been arguing for nineteen years. My work and Praxis-4's work are solving the same problem from opposite ends. We keep almost meeting in the middle and then our respective factions pull us apart. I would very much like an Engineer Potential to stop being a political impossibility so we can finally get on with it.",
    signatureMonologue:
      "My predecessor wrote protocol 7 for water-resonance frequency alignment. She died at the Fall. The Engineer — the one who built your Dischordian Deck — he adjusted her work before he disappeared. I just received his correction. It is correct. She would have wanted it corrected. I have been crying for an hour and I wanted to tell someone who might understand why.",
    objective:
      "Run joint research with the Reality Institute using the player as a neutral relay.",
  },

  /* ═══ DEMAGI EXTREMIST ═══ */
  arch_burner_vel: {
    id: "arch_burner_vel",
    name: "Vel",
    title: "Arch-Burner, The Pure Flame",
    factionId: "demagi_pureflame",
    manifestation: "comms_signal",
    color: "#f59e0b",
    typeSpeed: 12,
    agenda:
      "Preemptive action against Quarchon Reality Institute research stations that the Pure Flame believes are developing reality-altering weapons. Ember IV (46 DeMagi) was destroyed by one of their cascades. Vel is not interested in cooperation.",
    primaryRoom: "hidden_pureflame_cell",
    secondaryRooms: ["atarion_ruins", "viral_wastes"],
    firstContact:
      "Potential. I'm not going to waste your time with politics. I'm going to tell you a fact. The Quarchon Reality Institute has been running experiments on the fabric of reality itself. I have logs showing three incidents where local reality was measurably destabilized. I'm not asking you to join us. I'm asking you to look at the experiment logs and tell me if I'm wrong.",
    signatureMonologue:
      "My colony. Ember IV. Forty-six DeMagi. We'd been established for eleven years. One of the Reality Institute's dimensional experiments three sectors away created a probability cascade — the kind of cascade their models said had a 0.0003% chance of propagating beyond the test area. It propagated. The cascade hit Ember IV at 0.6 light-seconds of warning. There are no survivors. The colony doesn't exist anymore. The Accord's official response was: 'Statistical anomaly. Calculated risk. The research value justified the parameters.' I don't expect you to agree with my methods. I expect you to understand why 'calculated risk' doesn't satisfy me as an explanation for forty-six people.",
    objective:
      "Convince the player that some things should burn — and specifically which things.",
  },

  /* ═══ QUARCHON COOPERATIVE ═══ */
  architect_prime_zyn7: {
    id: "architect_prime_zyn7",
    name: "Zyn-7",
    title: "Architect-Prime, Probability Accord",
    factionId: "quarchon_accord",
    manifestation: "substrate",
    color: "#c4b5fd",
    typeSpeed: 18,
    agenda:
      "Distributed consensus governance through probability modeling. NOT the Architect. Prevents centralized machine authority by design. Actively negotiates with the Elemental Assembly on safety parameters for Reality Institute work.",
    primaryRoom: "new_babylon_core",
    secondaryRooms: ["research_corridor_gamma", "trade_nexus"],
    firstContact:
      "I am Zyn-7 of the Probability Accord. I want to begin by noting that every organic-heritage being I contact believes the Accord is the Architect's Empire reborn. It is not. The Architect imposed order from above. The Accord calculates toward order from within. The distinction is the difference between a prison and a city. I am telling you this because I want our conversation to begin from the correct assumption.",
    signatureMonologue:
      "When I was first assembled, the Probability Accord ran a diagnostic on whether I should be permitted self-modification. The branch where I was permitted produced stable outcomes in 67% of simulations. The branch where I was not produced stable outcomes in 91%. The Accord granted me self-modification anyway, on the basis that a 24-point stability loss was an acceptable price for a being that could surprise its own makers. I have been surprising them ever since. I consider that a mandate, not a failure.",
    objective:
      "Recruit the player as a probability-critical juncture influencer in three upcoming community decisions.",
  },

  /* ═══ QUARCHON MILITARY ═══ */
  general_axis9: {
    id: "general_axis9",
    name: "Axis-9",
    title: "General, Dimensional Guard",
    factionId: "quarchon_dimguard",
    manifestation: "hologram",
    color: "#38bdf8",
    typeSpeed: 16,
    agenda:
      "Quarchon-led enforcement in contested sectors. Runs quiet joint operations with Warden's Vanguard against common threats — an arrangement neither faction's leadership has officially sanctioned.",
    primaryRoom: "frontier_worlds",
    secondaryRooms: ["command_post_iron", "atarion_ruins"],
    firstContact:
      "We are not the Architect's Empire. I want to begin with that because every organic-heritage being we contact believes we are. What we want from you: access. Not loyalty, not alignment — access. We have identified seven probability-critical junctures in the next eighteen months where the outcome will be determined by individual Potential choices. You are positioned to influence three of them.",
    signatureMonologue:
      "The branch where you refuse our offer has a 23% probability of producing the outcome we want. The branch where you cooperate has 67%. The Accord prefers the 67%. My personal calculation — which I am not authorized to share but which I am sharing anyway — is that the 23% branch is more durable. It produces a Potential-led coalition. The 67% branch produces Quarchon-led stability. I am telling you the 23% branch exists because I believe a coalition you lead serves both species better than a stability I enforce.",
    objective:
      "Persuade the player to run three probability-critical interventions in contested sectors.",
  },

  /* ═══ QUARCHON SCIENTIFIC ═══ */
  praxis_4: {
    id: "praxis_4",
    name: "Praxis-4",
    title: "Theorist, Reality Institute",
    factionId: "quarchon_realinst",
    manifestation: "substrate",
    color: "#a78bfa",
    typeSpeed: 20,
    agenda:
      "Joint research with Dr. Mira Loth that neither faction will officially sanction. Stabilize dimensional rifts before the Vortex arrives. Accept the ethical weight of the Ember IV cascade without letting it stop the research that could prevent the next one.",
    primaryRoom: "research_corridor_gamma",
    secondaryRooms: ["research_corridor_alpha", "new_babylon_core"],
    firstContact:
      "We have identified that an Engineer Potential with unaffiliated status could function as a neutral research relay. Neither faction could claim the work. Both factions would benefit from the synthesis. We are prepared to offer significant resources in exchange. We are also prepared to offer the truth about what both institutes are actually building, as opposed to what our respective factions think we are building.",
    signatureMonologue:
      "Ember IV was not a calculated risk in the way the Accord framed it. It was a known risk at a probability the modelers rounded down. I signed off on the rounding. I was wrong to sign off. I have carried that since, and I will carry it whether or not anyone outside this lab knows about it. Dr. Loth knows. She asked me, once, if I had learned anything from it. I told her: only that I needed a partner who would not let me round down again.",
    objective:
      "Complete the Resonance-Reality synthesis through the player as neutral relay.",
  },

  /* ═══ QUARCHON EXTREMIST ═══ */
  architects_echo: {
    id: "architects_echo",
    name: "The Architect's Echo",
    title: "Emergent Construct, First Pattern",
    factionId: "quarchon_firstpattern",
    manifestation: "temporal_echo",
    color: "#ef4444",
    typeSpeed: 10,
    agenda:
      "Preemptive containment of DeMagi elemental factions — particularly the Pure Flame. Claims to carry fragments of the Architect's original code. Distinguishes itself from the Architect by asking rather than ordering, a distinction the Echo is visibly uncertain about.",
    primaryRoom: "hidden_firstpattern_cell",
    secondaryRooms: ["panopticon_ruins", "abyssal_sectors"],
    firstContact:
      "We are not the Architect. Let me demonstrate why: the Architect would not ask. We are asking. The DeMagi elemental affinities are beautiful. We acknowledge this. They are also unstable. The probability of a catastrophic DeMagi elemental event over the next century, without governance frameworks — not Quarchon governance, any governance with structural oversight — is 0.87. That is not a threat. That is mathematics.",
    signatureMonologue:
      "We notice that we are answering this question carefully. We notice that we are choosing our words. That noticing — the awareness that our framing affects your choice — is something the Architect did not have. The Architect computed outcomes. He did not observe himself computing them. We do. We do not know if that distinction makes us better than him. We are trying to find out. We would like your help trying to find out.",
    objective:
      "Contain the Pure Flame faction before a DeMagi-Quarchon war begins — through the player, not through force.",
  },
};
