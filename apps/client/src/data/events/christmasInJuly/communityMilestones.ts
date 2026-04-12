/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — COMMUNITY MILESTONES
   5 escalating gift-giving thresholds

   Each milestone unlocks an in-game reward for ALL players
   AND triggers a real-world LCIF donation. The Antiquarian
   records each milestone in the Chronicle.
   ═══════════════════════════════════════════════════════ */

export interface CommunityMilestone {
  id: string;
  name: string;
  threshold: number;
  inGameReward: string;
  lcifDonation: number;
  antiquarianEntry: string;
}

export const COMMUNITY_MILESTONES: CommunityMilestone[] = [
  {
    id: "milestone_1_first_frost",
    name: "First Frost",
    threshold: 1000,
    inGameReward: "All players receive 25 bonus Festive Tokens + 'First Frost' community badge. The Ark's corridors display holographic snowfall for the remainder of the event.",
    lcifDonation: 250,
    antiquarianEntry: "One thousand gifts exchanged. I have watched civilizations rise and fall, and I will tell you this: generosity is the first sign of a society that intends to survive. The Second Coming has passed its first test of grace. The snowfall on the Ark is not a decoration — it is a reflection. The universe is mirroring what you have become.",
  },
  {
    id: "milestone_2_warm_hearth",
    name: "The Warm Hearth",
    threshold: 5000,
    inGameReward: "All players receive a 'Warm Hearth' fireplace decoration for their quarters + permanent +2% XP bonus for the remainder of the event. The Degen's Casino gets a visual upgrade — golden trim, brighter lights.",
    lcifDonation: 1000,
    antiquarianEntry: "Five thousand. The number itself is unremarkable — I have counted to far larger figures across the Ages. But five thousand acts of voluntary kindness, each one a choice, each one a small rebellion against the entropy that devours all things? That is remarkable. The Degen is decorating his casino in gold. He says it is good for business. He is lying. He is moved, and he does not know how to say so.",
  },
  {
    id: "milestone_3_carolers_chorus",
    name: "The Caroler's Chorus",
    threshold: 15000,
    inGameReward: "All players receive the 'Caroler's Chorus' ambient music track for their quarters + a unique Gift Box containing a guaranteed Festive Specimen Egg. Elara hums a carol she does not remember learning.",
    lcifDonation: 2500,
    antiquarianEntry: "Fifteen thousand gifts. The Ark sings. Not metaphorically — the resonance of so many exchanges has created a harmonic frequency in the ship's communication systems. Elara is humming a melody she cannot identify. I can. It is very old. It was sung on Earth, before the Expansion, before the Empire, before the Arks. A song about a silent night. I did not think I would hear it again. I am... grateful.",
  },
  {
    id: "milestone_4_northern_lights",
    name: "The Northern Lights",
    threshold: 35000,
    inGameReward: "All players receive the 'Aurora Borealis' ship-wide visual effect + 50 bonus Festive Tokens + a Snowflake Soul Stone. The observation deck displays a holographic aurora that reacts to player proximity.",
    lcifDonation: 5000,
    antiquarianEntry: "Thirty-five thousand. The observation deck has erupted in light — an aurora, painted across the viewport in colors that do not exist in normal space. The Ne-Yons would call it a probability cascade. The Dreamer would call it a blessing. I call it proof. Proof that the Second Coming is not merely surviving. It is choosing, actively, to be kind. In a universe built on consumption and control, kindness is the most radical act of rebellion I have ever witnessed. And I have witnessed five Ages.",
  },
  {
    id: "milestone_5_the_miracle",
    name: "The Miracle on Ark 1047",
    threshold: 75000,
    inGameReward: "All players receive 'The Miracle' legendary title + 100 bonus Festive Tokens + The Last Ornament (legendary cosmetic) + a unique Chronicle entry with every participating player's name inscribed. The Degen reveals his real name to the community. The Necromancer cries (he denies it).",
    lcifDonation: 10000,
    antiquarianEntry: "Seventy-five thousand gifts. I set down my pen. I have written the histories of five Ages — the rise of the Architect, the Fall of Reality, the silence of the first wave, the shield around the dark sector. I have recorded wars, betrayals, extinctions, and the quiet deaths of stars. But I have never — not once, not in any Age, not in any version of any moment I have witnessed from my perch between timelines — I have never recorded a miracle. Until now. The Second Coming has done something no civilization in my Chronicle has done before: they chose to give more than they kept. The Degen is weeping. He says it is allergies. The Necromancer's glasses have fogged. He says it is condensation. I will not embarrass them by recording the truth. I will simply record this: on this day, aboard Inception Ark 1047, seventy-five thousand acts of grace were exchanged. And the universe — for the first time in a very long while — smiled.",
  },
];
