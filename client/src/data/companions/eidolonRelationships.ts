/* ═══════════════════════════════════════════════════════
   EIDOLON RELATIONSHIP MATRICES
   12×12 Eidolon-to-Eidolon + 12×7 NPC reactions
   ═══════════════════════════════════════════════════════ */

export type EidolonId =
  | "lux" | "echo" | "glyph" | "cipher" | "flicker" | "gilt"
  | "auros" | "nyx" | "toxis" | "cog" | "sibyl" | "strain";

export type NpcId =
  | "elara" | "the_human" | "antiquarian" | "necromancer"
  | "locke" | "the_source" | "shadow_tongue";

export interface EidolonRelation {
  from: EidolonId;
  /** Usually another eidolon, but a handful of relations point at
   *  faction NPCs (Shadow Tongue, Locke) where the sentiment
   *  describes eidolon \u2192 NPC feelings. */
  to: EidolonId | NpcId;
  description: string;
  sentiment: "positive" | "negative" | "neutral" | "complex";
}

export interface EidolonNpcReaction {
  eidolonId: EidolonId;
  npcId: NpcId;
  reaction: string;
  sentiment: "positive" | "negative" | "neutral" | "complex";
}

/** Condensed 12×12 relationship map — key interactions only */
export const EIDOLON_RELATIONSHIPS: EidolonRelation[] = [
  // Lux interactions
  { from: "lux", to: "echo", description: "Warmth — Lux's light comforts Echo's temporal displacement", sentiment: "positive" },
  { from: "lux", to: "glyph", description: "Glyph reads Lux's light patterns as a language", sentiment: "positive" },
  { from: "lux", to: "cipher", description: "Lux illuminates Cipher's code — makes hidden algorithms visible", sentiment: "positive" },
  { from: "lux", to: "flicker", description: "Amplifies — Lux's light boosts Flicker's signal range", sentiment: "positive" },
  { from: "lux", to: "gilt", description: "Reflects — Gilt's gold surface mirrors and multiplies Lux's light", sentiment: "positive" },
  { from: "lux", to: "nyx", description: "Too bright for Nyx — the raven hides from Lux's illumination", sentiment: "negative" },
  { from: "lux", to: "strain", description: "Purifies — Lux's light weakens Strain's viral components", sentiment: "complex" },

  // Echo interactions
  { from: "echo", to: "auros", description: "Sees Auros's future — multiple possible fates for the lion", sentiment: "complex" },
  { from: "echo", to: "nyx", description: "Sees Nyx's past lives — every raven it has been across timelines", sentiment: "complex" },
  { from: "echo", to: "sibyl", description: "Temporal kin — both see beyond the present, compare notes", sentiment: "positive" },
  { from: "echo", to: "strain", description: "Sees all possible Strains — every evolution path simultaneously", sentiment: "neutral" },

  // Cipher interactions
  { from: "cipher", to: "cog", description: "BUILDS TOGETHER — shared language of logic, collaborative creation", sentiment: "positive" },
  { from: "cipher", to: "glyph", description: "Code and text — kinship of structured information", sentiment: "positive" },
  { from: "cipher", to: "strain", description: "Reads virus code — can translate Thought Virus transmissions", sentiment: "complex" },
  { from: "cipher", to: "shadow_tongue", description: "Hostile — Cipher hisses at edited code", sentiment: "negative" },

  // Flicker interactions
  { from: "flicker", to: "nyx", description: "Signal kin — both carry Agent Zero's frequency in their bones", sentiment: "positive" },
  { from: "flicker", to: "cog", description: "Powers Cog — electromagnetic energy fuels the golem's lattice", sentiment: "positive" },
  { from: "flicker", to: "strain", description: "JAMS virus — Flicker's frequency disrupts Thought Virus signals", sentiment: "complex" },

  // Gilt interactions
  { from: "gilt", to: "locke", description: "LOVES — kindred economic minds, mutual respect", sentiment: "positive" },
  { from: "gilt", to: "strain", description: "Can't price freedom — the only thing Gilt cannot assign value to", sentiment: "complex" },

  // Class Eidolon interactions
  { from: "auros", to: "nyx", description: "Rivalry — lion and raven, honor versus shadow", sentiment: "complex" },
  { from: "auros", to: "toxis", description: "Wary respect — the warrior respects the assassin's patience", sentiment: "neutral" },
  { from: "nyx", to: "toxis", description: "Professional — both operate in shadow, mutual professional respect", sentiment: "neutral" },
  { from: "toxis", to: "strain", description: "KINSHIP — viral cousins, both understand corruption from inside", sentiment: "positive" },
  { from: "cog", to: "sibyl", description: "Baffled — logic cannot compute prophecy, but tries anyway", sentiment: "neutral" },
  { from: "sibyl", to: "strain", description: "Prophesied — Sibyl saw Strain's arrival in a dream, has been waiting", sentiment: "complex" },
];

/** 12×7 NPC reaction matrix — how NPCs respond to each Eidolon */
export const EIDOLON_NPC_REACTIONS: EidolonNpcReaction[] = [
  // Lux
  { eidolonId: "lux", npcId: "elara", reaction: "Harmonizes — Elara's hologram gains definition near Lux", sentiment: "positive" },
  { eidolonId: "lux", npcId: "the_human", reaction: "Clears static — The Human's signal improves near Lux's light", sentiment: "positive" },
  { eidolonId: "lux", npcId: "antiquarian", reaction: "Orbits the Orb — Lux is drawn to the Antiquarian's temporal shimmer", sentiment: "positive" },
  { eidolonId: "lux", npcId: "necromancer", reaction: "Unsettled — light and death magic are uncomfortable neighbors", sentiment: "negative" },
  { eidolonId: "lux", npcId: "locke", reaction: "Annoyed — Lux's light reveals things Locke keeps in shadow", sentiment: "negative" },
  { eidolonId: "lux", npcId: "shadow_tongue", reaction: "Dims and distrusts — Lux's light cannot be edited", sentiment: "negative" },

  // Echo
  { eidolonId: "echo", npcId: "elara", reaction: "Confounds scans — temporal displacement disrupts Elara's sensors", sentiment: "neutral" },
  { eidolonId: "echo", npcId: "the_human", reaction: "Recognized — The Human has seen cats like this before, across timelines", sentiment: "complex" },
  { eidolonId: "echo", npcId: "antiquarian", reaction: "Sleeps in temporal field — the Antiquarian's time-displacement is comfortable", sentiment: "positive" },
  { eidolonId: "echo", npcId: "necromancer", reaction: "Fascinated — Echo can see the moment between life and death", sentiment: "positive" },
  { eidolonId: "echo", npcId: "the_source", reaction: "Makes weep — Echo shows Kael every timeline where he didn't choose the virus", sentiment: "complex" },
  { eidolonId: "echo", npcId: "shadow_tongue", reaction: "Recoils — Echo's afterimages show Shadow Tongue's edits being un-edited", sentiment: "negative" },

  // Glyph
  { eidolonId: "glyph", npcId: "elara", reaction: "Analyzed — Elara studies Glyph's text patterns like data", sentiment: "neutral" },
  { eidolonId: "glyph", npcId: "antiquarian", reaction: "Overwhelmed with joy — a creature made of text in the Antiquarian's library", sentiment: "positive" },
  { eidolonId: "glyph", npcId: "shadow_tongue", reaction: "Reads excitedly — Shadow Tongue sees a kindred spirit in a creature made of language", sentiment: "complex" },

  // Cipher
  { eidolonId: "cipher", npcId: "elara", reaction: "Professional kin — two digital intelligences, mutual understanding", sentiment: "positive" },
  { eidolonId: "cipher", npcId: "the_human", reaction: "Useful — The Human appreciates Cipher's pattern analysis for case files", sentiment: "positive" },
  { eidolonId: "cipher", npcId: "locke", reaction: "Impressed — Cipher's algorithms rival New Babylon's best traders", sentiment: "positive" },

  // Flicker
  { eidolonId: "flicker", npcId: "elara", reaction: "Interference — Flicker's static occasionally disrupts Elara's hologram", sentiment: "negative" },
  { eidolonId: "flicker", npcId: "the_human", reaction: "Allied — Flicker boosts The Human's communication signal", sentiment: "positive" },
  { eidolonId: "flicker", npcId: "locke", reaction: "Hostile — Flicker intercepts New Babylon communications. Locke is not pleased", sentiment: "negative" },
  { eidolonId: "flicker", npcId: "the_source", reaction: "Jams Source — Flicker's frequency actively disrupts Thought Virus transmissions", sentiment: "complex" },

  // Gilt
  { eidolonId: "gilt", npcId: "elara", reaction: "Pragmatic — Elara appreciates Gilt's economic analysis but finds it reductive", sentiment: "neutral" },
  { eidolonId: "gilt", npcId: "locke", reaction: "LOVES — kindred spirits. Locke offers premium trade rates when Gilt is present", sentiment: "positive" },
  { eidolonId: "gilt", npcId: "shadow_tongue", reaction: "Covetous — Shadow Tongue wants to edit Gilt's value assessments", sentiment: "negative" },

  // Auros
  { eidolonId: "auros", npcId: "elara", reaction: "Monitored — Elara tracks Auros's combat readiness like a security scan", sentiment: "neutral" },
  { eidolonId: "auros", npcId: "the_human", reaction: "Saluted — The Human recognizes military bearing across millennia", sentiment: "positive" },
  { eidolonId: "auros", npcId: "antiquarian", reaction: "Chronicled — the Antiquarian writes about Auros as he would a historical general", sentiment: "positive" },

  // Nyx
  { eidolonId: "nyx", npcId: "antiquarian", reaction: "Recorded — the Antiquarian notes every memory Nyx carries from Agent Zero", sentiment: "positive" },
  { eidolonId: "nyx", npcId: "necromancer", reaction: "Avoided — the Necromancer is uncomfortable around death-touched creatures", sentiment: "negative" },
  { eidolonId: "nyx", npcId: "locke", reaction: "Feared — Nyx's intelligence-gathering makes Locke deeply nervous", sentiment: "negative" },

  // Toxis
  { eidolonId: "toxis", npcId: "elara", reaction: "Quarantined — Medical Bay protocols activate when Toxis is nearby", sentiment: "negative" },
  { eidolonId: "toxis", npcId: "necromancer", reaction: "Peer — the Necromancer recognizes a fellow practitioner of uncomfortable arts", sentiment: "positive" },
  { eidolonId: "toxis", npcId: "the_source", reaction: "Related — Toxis and the Thought Virus share a common ancestor in corruption", sentiment: "complex" },

  // Cog
  { eidolonId: "cog", npcId: "elara", reaction: "Integrated — Cog occasionally patches into Elara's systems. She finds it endearing", sentiment: "positive" },
  { eidolonId: "cog", npcId: "the_human", reaction: "Curious — The Human studies Cog like a detective examining evidence", sentiment: "neutral" },

  // Sibyl
  { eidolonId: "sibyl", npcId: "elara", reaction: "Awed — Elara cannot explain Sibyl's predictive accuracy with any algorithm", sentiment: "positive" },
  { eidolonId: "sibyl", npcId: "antiquarian", reaction: "DEEPLY known — the Antiquarian and Sibyl share a connection across time itself", sentiment: "positive" },
  { eidolonId: "sibyl", npcId: "shadow_tongue", reaction: "Prophesied against — Sibyl foresaw Shadow Tongue's edits before they happened", sentiment: "negative" },

  // Strain
  { eidolonId: "strain", npcId: "elara", reaction: "Quarantine alarms — every proximity sensor on the Ark fires", sentiment: "negative" },
  { eidolonId: "strain", npcId: "the_human", reaction: "Deeply suspicious — The Human watches Strain like a detective watching a suspect", sentiment: "negative" },
  { eidolonId: "strain", npcId: "antiquarian", reaction: "Cautiously hopeful — the Antiquarian sees potential for redemption", sentiment: "complex" },
  { eidolonId: "strain", npcId: "necromancer", reaction: "Senses from the Matrix — the Necromancer feels Strain's connection to death", sentiment: "complex" },
  { eidolonId: "strain", npcId: "the_source", reaction: "Father/prisoner — the Source created Strain, but Strain chose freedom", sentiment: "complex" },
];
