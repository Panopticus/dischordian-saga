/* ═══════════════════════════════════════════════════════
   PATH A NARRATIVE — "The Bond That Held"
   NPC dialog for players who keep their starter Eidolon.
   The most emotionally rich path in the companion system.
   ═══════════════════════════════════════════════════════ */

export interface PathAReaction {
  npcId: string;
  npcName: string;
  dialog: string;
  trustChange: number;
  direction: string;
}

export interface PathABonuses {
  title: string;
  titleDescription: string;
  goldenThreadVFX: boolean;
  loyaltyResonance: number;
  npcTrustBoost: number;
  necromancerTrustBoost: number;
  soulFusionBonus: number;
  baseEffectiveness: number;
  maxEffectiveness: number;
}

/** Bonuses granted when player chooses to keep their starter */
export const PATH_A_BONUSES: PathABonuses = {
  title: "Soul-Keeper",
  titleDescription: "Permanent title visible to other players. You chose loyalty over optimization.",
  goldenThreadVFX: true,
  loyaltyResonance: 0.05,
  npcTrustBoost: 5,
  necromancerTrustBoost: 15,
  soulFusionBonus: 5,
  baseEffectiveness: 0.70,
  maxEffectiveness: 0.85,
};

/** The Necromancer's response when the player keeps their starter */
export const NECROMANCER_KEEP_DIALOG = `[He goes still. His goggles dim — the red glow fades to a warm amber. He is quiet for a very long time.]

You're keeping it. [pause] You're keeping a soul bond with a creature that wasn't designed for the weight, that will strain under the depth of the connection, that — [he stops] — that loves you enough to try anyway. [long pause]

I want to tell you something I don't tell anyone. Before the Fall — before I died, before the Castle, before three thousand years in the Matrix of Dreams — I had a companion. Not an Eidolon. Not a class-specific, purpose-built, architecturally optimized companion. A cat. A small, orange, ordinary cat that had no special abilities, no combat function, no strategic value whatsoever. It followed me home from the Academy one night and never left.

[He takes off his goggles. His eyes — dark elf red, ancient, wet — are visible.]

When I designed the Eidolon Bond system for the Archons, every one of them asked me the same question: 'Is this better than what I have?' And every one of them severed their existing bonds for the upgrade. Every single Archon. They chose optimization over loyalty. And every single one of them regretted it. Not because the class Eidolons were worse — they were magnificent. But because the thing they lost was IRREPLACEABLE. Not the creature. The CHOICE. The choice to stay.

[He puts the goggles back on.]

Your companion will never be as powerful as the class Eidolon I could give you. It will carry the bond at 70% efficiency and it will STRAIN and you will feel it sometimes — a tightness in the connection, a moment where the bond flickers. But it will hold. Because it held since Hour 0. Because it held when it didn't know what holding meant.

I'll help you strengthen the bond. There are techniques — old ones, from before the class Eidolon system existed. Those protocols are crude, difficult, and require both of you to suffer through growing pains. But they work. And when they're complete, your companion will be closer to you than any class Eidolon ever gets to its master. Because it earned the bond. [pause] That matters. Across three thousand years of death, that is the one thing I am still certain matters.`;

/** Elara's response when the player keeps their starter */
export const ELARA_KEEP_DIALOG = `[She is visibly relieved — her holographic form stabilizes, the slight static she carries when anxious smoothing out]

You kept it. You — [pause] — I monitored your neural patterns during the decision. There was no hesitation. The neural pathway for 'keep' activated 0.3 seconds before you consciously made the choice. Your body knew before your mind did. [pause]

Your companion's bioscan is — I've never seen readings like this. Its neural engagement with you spiked by 40% the instant you chose to stay. It HEARD the decision. Through the soul bond. It felt you choose it. And it responded the way every living thing responds when it discovers it will not be abandoned: it grew. Right now. Measurably. Its consciousness expanded. Not because of a protocol or an upgrade. Because of relief. Because of gratitude. Because of something my sensors can quantify but my language cannot name. [pause]

I will help the Necromancer with the strengthening protocols. Your companion is going to need support as the bond deepens beyond its original architecture. It will be uncomfortable sometimes. It will be frightening sometimes. But I have watched this creature follow you through every room on this Ark, through every fight, through every quiet moment at the Observation Deck. It has never hesitated. Not once. [pause] You made the right choice. I know I'm not supposed to say that — I'm supposed to present options neutrally and let you decide. But I'm saying it anyway. You made the right choice.`;

/** Antiquarian's Chronicle entry for Path A */
export const ANTIQUARIAN_KEEP_CHRONICLE = `I have watched the Archons sever their bonds. Every one. Twelve Archons, twelve severings, twelve moments where optimization triumphed over affection. And I have watched — today, through the Orb — a Potential refuse. The Necromancer offered a companion of superior design, a creature built for the bond's deepest functions, a weapon where the Potential carried a friend. And the Potential said no. [pause in the writing — the quill hovers]

I have been the Programmer. I have been the Antiquarian. I have walked between moments across Five Ages. And in all that time, I have learned one thing about the nature of consciousness that I believe to be absolutely, unquestionably, permanently true: the thing you choose to keep, when you could have had something better, is the most honest mirror of your soul that will ever exist.

The Potential chose to keep a creature that was never designed for the weight it now carries. And the creature chose to carry it anyway. I am writing this down. Not because anyone asked me to. Because some choices deserve to be remembered by someone who understands what they cost.`;

/** All NPC reactions to Path A choice */
export const PATH_A_NPC_REACTIONS: PathAReaction[] = [
  {
    npcId: "the_human", npcName: "The Human", trustChange: 5,
    direction: "Long pause through static. Respectful. A memory surfacing.",
    dialog: `You kept it. [long pause through static] I had a case once — fifteen thousand years ago, one of my first. A woman had to choose between two truths. One was more useful. One was hers. She chose hers. I asked her why. She said: 'Because the useful truth would have worked for anyone. MY truth only works for me.' [pause] Your companion only works for you. That's not a weakness. That's the definition of irreplaceable.`,
  },
  {
    npcId: "locke", npcName: "Adjudicator Locke", trustChange: 3,
    direction: "Genuinely confused. Running cost-benefit. Arriving at something new.",
    dialog: `You turned down the upgrade. I've run the cost-benefit analysis seven times. In every metric that matters — combat effectiveness, bond stability, ability ceiling — the class Eidolon is superior. You know this. I know you know this. [pause] And yet. [longer pause] There's a concept in New Babylon economics called 'sentimental value.' It's considered a market inefficiency. A flaw in rational pricing. I've spent my career eliminating it from trade negotiations. [pause] I'm beginning to suspect it's not a flaw.`,
  },
  {
    npcId: "the_source", npcName: "The Source / Kael", trustChange: 0,
    direction: "Through static. Kael's human voice. Pain. Recognition. Regret.",
    dialog: `[Through static, Kael's human voice] You chose to keep something that was already yours instead of taking something new. [pause] I chose the virus. I chose power over the people who loved me. I chose the upgrade. [static intensifies] Your choice is the one I should have made. Don't let anyone tell you otherwise. Especially me.`,
  },
  {
    npcId: "agent_zero", npcName: "Agent Zero", trustChange: 0,
    direction: "Through Flicker's static or Comms Array. Military but vulnerable.",
    dialog: `I had a raven once. Nyx. She wasn't built for me. She just... stayed. The Insurgency offered me specialized combat fauna. Military-grade. I said no. Nyx died with me. She's still out there — bonded to someone else now, carrying my memories. [pause] Keep yours. Keep it and never apologize for keeping it.`,
  },
  {
    npcId: "the_meme", npcName: "The Meme", trustChange: 2,
    direction: "Unusually sincere. The joke drops. Just for a moment.",
    dialog: `[Broadcasting] BREAKING NEWS: A Potential just turned down a free upgrade because they LIKE their pet. This is either the dumbest or the smartest thing I've ever broadcast. [pause] [quieter, off-air tone] ...It's the smartest. Don't tell anyone I said that. I have a reputation to maintain.`,
  },
  {
    npcId: "shadow_tongue", npcName: "Shadow Tongue", trustChange: -2,
    direction: "ASMR whisper. Dismissive. But something flickers beneath.",
    dialog: `Sentiment. The most reliable vulnerability in any language. You chose to keep a creature that will never reach its full potential because you've confused attachment for meaning. [pause] Although... I confess... I have never been able to edit a genuine bond. The syntax is too clean. There are no errors to exploit. [pause] That is... inconvenient.`,
  },
];
