/* ═══════════════════════════════════════════════════════
   CONTESTED SECTOR GREETINGS

   Species-specific first-entry dialog for the five contested
   sectors from spec §5.2. Each greeting is a WheelOption that
   injects into the existing DialogWheel via getAvailableOptions
   — no new slot props.

   Keys match `GalacticSector.raceGreetingKey`. Ne-Yon passes every
   `requireSpecies` gate (spec Part 1.2) — so if a Ne-Yon visits a
   contested sector, all three variants are visible and the player
   can pick whichever greeting they want to identify with.
   ═══════════════════════════════════════════════════════ */

import type { WheelOption } from "./dialogWheel";

export const CONTESTED_GREETINGS: Record<string, WheelOption[]> = {
  atarion_ruins: [
    {
      id: "atarion_greeting_demagi",
      segment: "humanity",
      rarity: "rare",
      label: "DeMagi Welcome",
      fullText:
        "Oh thank the roots, another one. The Quarchon have been running probability models on this sector for three weeks trying to decide if it's 'economically viable' to establish a presence here. Meanwhile the ruins need tending and the memory stones need someone who can actually feel what they're saying. Are you staying? Tell me you're staying.",
      outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 3 } },
      gateCondition: { requireSpecies: "demagi" },
    },
    {
      id: "atarion_greeting_quarchon",
      segment: "machine",
      rarity: "rare",
      label: "Stiffening",
      fullText:
        "Quarchon. Right. We weren't expecting — is this a Probability Accord survey? Because I'm going to tell you the same thing I told the last three probability surveyors: the ruins don't have an economic value rating. They have a grief value. Those aren't the same thing and I need you to understand that before we have any other conversation.",
      outcome: { moralityDelta: -1 },
      gateCondition: { requireSpecies: "quarchon" },
    },
    {
      id: "atarion_greeting_neyon",
      segment: "investigate",
      rarity: "epic",
      label: "Hope",
      fullText:
        "Ne-Yon. We haven't seen a Ne-Yon out here in... a long time. Are you — which side are you on? No, that's the wrong question. Are you willing to be on no side? We could use someone who doesn't have a side.",
      outcome: {
        npcTrustDelta: { npcId: "thael_vo", delta: 5 },
        unlocks: ["questline_neyon_crossing"],
      },
      gateCondition: { requireSpecies: "neyon" },
    },
  ],

  tidewater_archive: [
    {
      id: "tidewater_greeting_demagi",
      segment: "humanity",
      rarity: "rare",
      label: "Water Sister",
      fullText:
        "You can hear the archive singing. Good. The inspectors never can. They call it 'interference.' We call it the archive. Come inside — we have a water-frequency lock that needs a hand it recognizes.",
      outcome: { npcTrustDelta: { npcId: "mira_loth", delta: 2 } },
      gateCondition: { requireSpecies: "demagi" },
    },
    {
      id: "tidewater_greeting_quarchon",
      segment: "investigate",
      rarity: "rare",
      label: "Inspector?",
      fullText:
        "Quarchon. We assume you are here because the Reality Institute sent you. Please understand that our refusal to grant access is not personal. It is eleven years old. It predates you individually. We are still willing to talk — about anything except access.",
      outcome: { moralityDelta: 0 },
      gateCondition: { requireSpecies: "quarchon" },
    },
    {
      id: "tidewater_greeting_neyon",
      segment: "compassionate",
      rarity: "epic",
      label: "Bridged",
      fullText:
        "A Ne-Yon in a water archive. The archive is going to respond to you in ways it doesn't respond to either of us. Please tell us what it says. We have been trying to listen for generations.",
      outcome: {
        unlocks: ["questline_neyon_crossing"],
        npcTrustDelta: { npcId: "mira_loth", delta: 3 },
      },
      gateCondition: { requireSpecies: "neyon" },
    },
  ],

  skyforge_plateau: [
    {
      id: "skyforge_greeting_demagi",
      segment: "compassionate",
      rarity: "rare",
      label: "Thermal Sibling",
      fullText:
        "Air-affinity. Welcome. The joint authority has been running this plateau for six years and we are all tired. If you have a free afternoon and a talent for thermal cycling, we have three things that need fixing and two Quarchon engineers who can't touch them.",
      outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 2 } },
      gateCondition: { requireSpecies: "demagi" },
    },
    {
      id: "skyforge_greeting_quarchon",
      segment: "compassionate",
      rarity: "rare",
      label: "Calculated Sibling",
      fullText:
        "Welcome. The plateau runs on cooperation, which is a sentence neither of our factions' press releases would print. We are glad you are here. We have three things that need fixing and two DeMagi engineers who can't touch them.",
      outcome: { npcTrustDelta: { npcId: "general_axis9", delta: 2 } },
      gateCondition: { requireSpecies: "quarchon" },
    },
    {
      id: "skyforge_greeting_neyon",
      segment: "investigate",
      rarity: "epic",
      label: "Bridge Builder",
      fullText:
        "Ne-Yon. The plateau was built by beings who weren't speaking to each other. You are the first person here who doesn't need a translator. Please — walk with us.",
      outcome: {
        unlocks: ["questline_neyon_crossing"],
        moralityDelta: 2,
      },
      gateCondition: { requireSpecies: "neyon" },
    },
  ],

  chronarchive_vault: [
    {
      id: "chronarchive_greeting_demagi",
      segment: "investigate",
      rarity: "rare",
      label: "Time Pilgrim",
      fullText:
        "The Antiquarian allows both species in, but neither species leaves with anything. Please do not attempt to remove a book. We have tried for centuries. It does not go well.",
      outcome: {},
      gateCondition: { requireSpecies: "demagi" },
    },
    {
      id: "chronarchive_greeting_quarchon",
      segment: "investigate",
      rarity: "rare",
      label: "Index Refused",
      fullText:
        "The Accord has been trying to catalogue this Vault for decades. They have failed. They will continue to fail. The Antiquarian is not interested in being indexed. Please do not attempt to model him.",
      outcome: {},
      gateCondition: { requireSpecies: "quarchon" },
    },
    {
      id: "chronarchive_greeting_neyon",
      segment: "compassionate",
      rarity: "epic",
      label: "Welcomed",
      fullText:
        "The Antiquarian has been expecting you. Not you specifically — he has been expecting a Ne-Yon for about four hundred years. You are, apparently, the one. He says: come in. He says: there is tea.",
      outcome: {
        unlocks: ["questline_neyon_crossing", "antiquarian_neyon_invitation"],
        npcTrustDelta: { npcId: "the_antiquarian", delta: 4 },
      },
      gateCondition: { requireSpecies: "neyon" },
    },
  ],

  ember_memorial: [
    {
      id: "ember_greeting_demagi",
      segment: "humanity",
      rarity: "rare",
      label: "Mourner",
      fullText:
        "Forty-six names on the obsidian. If you have Fire affinity, the stones will warm to you. If you have any affinity at all, they will ask what you remember. If you are DeMagi, they will not need to ask. Welcome. Grieve well.",
      outcome: { elaraTrustDelta: 1 },
      gateCondition: { requireSpecies: "demagi" },
    },
    {
      id: "ember_greeting_quarchon",
      segment: "compassionate",
      rarity: "rare",
      label: "Careful Visitor",
      fullText:
        "Quarchon visitors come rarely and very, very carefully. You are welcome. Please keep your probability models silent. The stones are sensitive to anything that sounds like 'calculated risk.' If you hear yourself using those words, leave.",
      outcome: { moralityDelta: 1 },
      gateCondition: { requireSpecies: "quarchon" },
    },
    {
      id: "ember_greeting_neyon",
      segment: "compassionate",
      rarity: "epic",
      label: "Both Mourn",
      fullText:
        "Ne-Yon. You grieve for both sides by default. There is no wrong way to stand here, except not to stand here at all. Walk slowly. The memorial will recognize you.",
      outcome: {
        unlocks: ["questline_neyon_crossing"],
        moralityDelta: 2,
      },
      gateCondition: { requireSpecies: "neyon" },
    },
  ],
};
