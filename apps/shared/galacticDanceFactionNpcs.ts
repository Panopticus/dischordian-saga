/* Galactic Dance Faction NPCs — 8 new NPC records (spec §2-7) */
import type { PotentialFactionNPC } from "./potentialFactionNpcs";

export type GalacticDanceNPCId =
  | "mirren_hale" | "dr_sael_finn" | "the_hierophant" | "binath_vii"
  | "orin_fell" | "field_commander_renn" | "the_word" | "the_silence";

export const GALACTIC_DANCE_NPCS: Record<GalacticDanceNPCId, Omit<PotentialFactionNPC, "factionId"> & { factionId: string }> = {
  mirren_hale: {
    id: "mirren_hale" as any, name: "Mirren Hale", title: "Council Speaker, Council of Survivors",
    factionId: "humans_new_atarion", manifestation: "hologram", color: "#d4a574", typeSpeed: 18,
    agenda: "Stability for New Atarion. Stop the Syndicate transit corridor, mediate DeMagi-Quarchon shipping lane disputes, and find out what the Voltari said.",
    primaryRoom: "new_atarion", secondaryRooms: ["free_ports", "trade_nexus"],
    firstContact: "Potential of Ark 1047. We've been watching your approach for three weeks. You move slower than the first wave did. We appreciate that.",
    signatureMonologue: "My grandmother kept this journal. It's a record of how New Atarion solved its first water crisis. Not the technology — the conversation. The mistakes. The compromise nobody liked but everybody could live with. Every Potential faction I've dealt with has libraries full of data. None of them have this.",
    objective: "Build trust through action, not promises. Solve a real problem in New Atarion that benefits you nothing.",
  },
  dr_sael_finn: {
    id: "dr_sael_finn" as any, name: "Dr. Sael Finn", title: "Geneticist, The Bridge Project",
    factionId: "humans_bridge_seekers", manifestation: "physical_trace", color: "#93c5fd", typeSpeed: 20,
    agenda: "Understand whether the potential (small p) was always in baseline humans or whether the Collector created something genuinely new.",
    primaryRoom: "new_atarion", secondaryRooms: ["research_corridor_beta"],
    firstContact: "You found us. That usually means one of three things: you're here to shut us down, you're here to use us, or you're here because you're curious about people who are doing what you are — but choosing it instead of being born into it.",
    signatureMonologue: "Dr. Mira Loth believes the division between humans and DeMagi is an artifact of distribution, not biology. She's been right so far. She's been wrong three times. Two recoveries. One permanent restructuring the patient considers acceptable and the family considers a tragedy.",
    objective: "Collaborate with the Resonance/Reality institutes on whether the bridge between human and Potential is crossable.",
  },
  the_hierophant: {
    id: "the_hierophant" as any, name: "The Hierophant", title: "Mourning Keeper, Thaloria",
    factionId: "thaloria_council", manifestation: "physical_trace", color: "#86efac", typeSpeed: 30,
    agenda: "Write every name. Three hundred and forty-seven thousand remaining. Perhaps sixty years of health. The continuation is the point.",
    primaryRoom: "thaloria", secondaryRooms: [],
    firstContact: "I know what you are. I have been waiting for the new kind to find this room. The Shadow Tongue is still in the walls of this universe. It is still rewriting. You should know what it wrote through me.",
    signatureMonologue: "The Shadow Tongue edits quickly. I write slowly. This is my disadvantage and also, I believe, my advantage. The Shadow Tongue cannot outlast something that is not trying to outlast it — that is simply doing the work, every day, without a deadline.",
    objective: "Witness the ceremony. Learn what the Shadow Tongue does to a faith. Receive intel on its current operations.",
  },
  binath_vii: {
    id: "binath_vii" as any, name: "General Binath-VII", title: "Commander, Awakened Clone Collective",
    factionId: "awakened_clones", manifestation: "hologram", color: "#c4b5fd", typeSpeed: 16,
    agenda: "Prove the Oracle's argument: identity emerges from choice, not origin. Seventeen thousand clones, seventeen thousand different people.",
    primaryRoom: "clone_collective", secondaryRooms: ["frontier_worlds"],
    firstContact: "Potential. I know about the Collector's Garden. I was made from the Oracle's DNA without his consent. We have that in common.",
    signatureMonologue: "The Collector thought he was proving the soul didn't exist. He was proving the opposite. He just didn't stay long enough to see the data.",
    objective: "Connect the Clone collective with the Insurgency's Remembrance faction. The Oracle's words and proof should meet.",
  },
  orin_fell: {
    id: "orin_fell" as any, name: "Orin Fell", title: "Archivist, The Remembrance",
    factionId: "insurgency_remembrance", manifestation: "comms_signal", color: "#fbbf24", typeSpeed: 22,
    agenda: "Preserve Iron Lion's legacy. Find the 'something larger' the Insurgency has been waiting seventeen thousand years for.",
    primaryRoom: "remembrance_archive", secondaryRooms: ["insurgency_haven"],
    firstContact: "Iron Lion's last broadcast. Do you know it? 'Take what I was and make it something larger.' We have been waiting for the something larger. For seventeen thousand years.",
    signatureMonologue: "The Insurgency has outlived every other political movement from the pre-Fall era because it is not an organization. It is an idea. Ideas do not have supply chains. Ideas do not need territory. Ideas survive because someone remembers them.",
    objective: "Help the Insurgency decide whether to remain a resistance or become something new.",
  },
  field_commander_renn: {
    id: "field_commander_renn" as any, name: "Field Commander Renn", title: "Operations Lead, The Forward",
    factionId: "insurgency_forward", manifestation: "comms_signal", color: "#ef4444", typeSpeed: 12,
    agenda: "Active resistance against Architect remnants and Hierarchy incursions. The Vortex is coming and it will take everyone.",
    primaryRoom: "forward_bastion", secondaryRooms: ["insurgency_haven", "frontier_worlds"],
    firstContact: "I don't make speeches. Orin makes speeches. I make plans. The Vortex is three sectors closer than it was last month. Do you fight, or do you philosophize?",
    signatureMonologue: "Iron Lion said 'I am afraid this will not be enough and I am going anyway.' He said that to me. Private communication. The night before the last stand. The fact that someone else knows it means the information found its way through channels that predate my records.",
    objective: "Joint operations against common threats — Hierarchy, Vortex, Terminus Swarm.",
  },
  the_word: {
    id: "the_word" as any, name: "The Word", title: "Information Twin, Syndicate of Death",
    factionId: "syndicate_of_death", manifestation: "comms_signal", color: "#e2e8f0", typeSpeed: 14,
    agenda: "Recover what the Syndicate lost in the New Babylon battle. Every piece of information has a price; the price is named before the information.",
    primaryRoom: "new_babylon_core", secondaryRooms: ["syndicate_route_prime"],
    firstContact: "Ark 1047. We know your ship's designation from the docking logs. We know your ship's history from the theft records. We are not here to threaten you with what we know.",
    signatureMonologue: "New Babylon's official silence is not the Authority's silence. It is ours. We could open it. We have not. We are waiting for someone worth opening it for.",
    objective: "Trade the Ark's hidden memory imprint for the 7-Omega battle records.",
  },
  the_silence: {
    id: "the_silence" as any, name: "The Silence", title: "Information Twin, Syndicate of Death",
    factionId: "syndicate_of_death", manifestation: "comms_signal", color: "#94a3b8", typeSpeed: 14,
    agenda: "The other half of The Word. They speak in alternating sentences. The Silence handles what The Word leaves unsaid.",
    primaryRoom: "new_babylon_core", secondaryRooms: ["syndicate_route_prime"],
    firstContact: "We know what's in your cryo fluid from the Warlord's production documents. We are here because we lost something in New Babylon, and we believe you are currently carrying it without knowing.",
    signatureMonologue: "The copies we kept are ours. The Authority paid for silence. They did not pay for forgetting.",
    objective: "Complete The Word's trades. Verify The Word's claims. Maintain the Syndicate's reputation for fair dealing.",
  },
};
