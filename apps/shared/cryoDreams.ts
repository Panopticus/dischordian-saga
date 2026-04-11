/* ═══════════════════════════════════════════════════════
   CRYO DREAMS

   Apprentices in cryo vault have dreams. The Dreamer reaches
   them through the ice. Player can visit the vault and read
   what they're dreaming. Sometimes they wake up different.
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype } from "./apprentices";

export interface CryoDream {
  apprenticeId: string;
  /** The dream text */
  dream: string;
  /** Optional side-effect on the apprentice when thawed */
  awakeningEffect?: "bond_gain" | "bond_loss" | "corruption_gain" | "corruption_loss" | "archetype_shift" | "none";
  /** Magnitude of effect */
  effectMagnitude: number;
  /** Only appears if corruption >= threshold */
  corruptionThreshold?: number;
}

/* ─── DREAM TEMPLATES BY ARCHETYPE ─── */

const DREAMS: Record<ApprenticeArchetype, CryoDream[]> = {
  zealot: [
    { apprenticeId: "", dream: "I dreamed the cause was hollow and I kept shouting its name anyway. In the morning I recognized my own voice from across a battlefield.", awakeningEffect: "bond_loss", effectMagnitude: 5 },
    { apprenticeId: "", dream: "The Dreamer sat with me in the ice. She asked if I chose this faith or if it chose me. I did not have an answer she believed.", awakeningEffect: "corruption_gain", effectMagnitude: 8, corruptionThreshold: 30 },
  ],
  ghost: [
    { apprenticeId: "", dream: "I dreamed I was finally seen and it didn't hurt. Then I woke up and remembered the quiet was the point.", awakeningEffect: "bond_gain", effectMagnitude: 4 },
    { apprenticeId: "", dream: "The Dreamer whispered my real name. I didn't recognize it.", awakeningEffect: "archetype_shift", effectMagnitude: 1 },
  ],
  scholar: [
    { apprenticeId: "", dream: "I dreamed of a library where every book was the life of someone I'd dismissed. I read one. I owe them an apology.", awakeningEffect: "bond_gain", effectMagnitude: 3 },
    { apprenticeId: "", dream: "The Dreamer showed me a proof that undid the Architect's primary axiom. I woke before I could write it down.", awakeningEffect: "corruption_gain", effectMagnitude: 3 },
  ],
  revenant: [
    { apprenticeId: "", dream: "Death is a room with two doors and I spent the night counting exits. I found a third one. I did not use it.", awakeningEffect: "corruption_loss", effectMagnitude: 5 },
    { apprenticeId: "", dream: "The Dreamer was the one who first called me back. I forgot that.", awakeningEffect: "bond_gain", effectMagnitude: 8 },
  ],
  artisan: [
    { apprenticeId: "", dream: "I built a chair in my dream that was perfect and I gave it away and the person broke it on a rock. I woke up laughing.", awakeningEffect: "bond_gain", effectMagnitude: 2 },
    { apprenticeId: "", dream: "The Dreamer handed me a half-finished tool and asked me to finish it. I said yes before asking what it was for.", awakeningEffect: "corruption_gain", effectMagnitude: 4 },
  ],
  oracle: [
    { apprenticeId: "", dream: "I dreamed I was wrong about every prediction I've ever made. It was the most peaceful night I've had in years.", awakeningEffect: "bond_loss", effectMagnitude: 3 },
    { apprenticeId: "", dream: "The Dreamer gave me a prediction to carry back: 'The third Apprentice will betray in the second season.' I don't know whose.", awakeningEffect: "corruption_gain", effectMagnitude: 6 },
  ],
  wanderer: [
    { apprenticeId: "", dream: "I dreamed of staying. Not as a chain. As a choice. I'm still thinking about it.", awakeningEffect: "bond_gain", effectMagnitude: 6 },
    { apprenticeId: "", dream: "The Dreamer pointed at a road I hadn't seen. I took it. I'm not sure I came back.", awakeningEffect: "archetype_shift", effectMagnitude: 1 },
  ],
  martyr: [
    { apprenticeId: "", dream: "I dreamed I took a hit and was thanked instead of absorbed. It felt wrong. Then it felt right. Then wrong again.", awakeningEffect: "corruption_loss", effectMagnitude: 3 },
    { apprenticeId: "", dream: "The Dreamer said I was allowed to say no. I tried. The word stuck. I'm practicing.", awakeningEffect: "bond_gain", effectMagnitude: 5 },
  ],
  heretic: [
    { apprenticeId: "", dream: "I dreamed of an orthodoxy that was CORRECT and I could not find the hole in it. I woke up furious.", awakeningEffect: "corruption_gain", effectMagnitude: 4 },
    { apprenticeId: "", dream: "The Dreamer asked what I would do if I ran out of things to question. I don't want to find out.", awakeningEffect: "bond_loss", effectMagnitude: 3 },
  ],
  jester: [
    { apprenticeId: "", dream: "I told a joke in the dream and it didn't land. I have been having the same nightmare about failed comedy for thirty years. Don't tell anyone.", awakeningEffect: "bond_gain", effectMagnitude: 4 },
    { apprenticeId: "", dream: "The Dreamer laughed at my worst joke. Genuinely. I don't know what to do with that.", awakeningEffect: "corruption_loss", effectMagnitude: 4 },
  ],
  sentinel: [
    { apprenticeId: "", dream: "I dreamed someone relieved me from the watch. For the first time I could remember. I did not move.", awakeningEffect: "bond_loss", effectMagnitude: 4 },
    { apprenticeId: "", dream: "The Dreamer stood watch beside me. Neither of us spoke. It was the most meaningful conversation I've had.", awakeningEffect: "bond_gain", effectMagnitude: 7 },
  ],
  prodigal: [
    { apprenticeId: "", dream: "I dreamed of leaving and not coming back, and this time I wasn't running away. I was going TOWARD something. I don't know what.", awakeningEffect: "archetype_shift", effectMagnitude: 1 },
    { apprenticeId: "", dream: "The Dreamer told me the debts I carry aren't mine. I don't believe her. But I wrote it down.", awakeningEffect: "corruption_loss", effectMagnitude: 5 },
  ],
};

/* ─── HELPERS ─── */

export function generateCryoDream(apprentice: Apprentice): CryoDream | null {
  const pool = DREAMS[apprentice.archetype];
  if (!pool || pool.length === 0) return null;
  // Filter by corruption threshold if set
  const eligible = pool.filter(d => (d.corruptionThreshold ?? 0) <= apprentice.corruption);
  if (eligible.length === 0) return null;
  const picked = eligible[Math.floor(Math.random() * eligible.length)];
  return { ...picked, apprenticeId: apprentice.id };
}

export function applyDreamEffect(apprentice: Apprentice, dream: CryoDream): Partial<Apprentice> {
  const changes: Partial<Apprentice> = {};
  switch (dream.awakeningEffect) {
    case "bond_gain":
      changes.bond = Math.min(100, apprentice.bond + dream.effectMagnitude);
      break;
    case "bond_loss":
      changes.bond = Math.max(0, apprentice.bond - dream.effectMagnitude);
      break;
    case "corruption_gain":
      changes.corruption = Math.min(100, apprentice.corruption + dream.effectMagnitude);
      break;
    case "corruption_loss":
      changes.corruption = Math.max(0, apprentice.corruption - dream.effectMagnitude);
      break;
    case "archetype_shift":
      // The Dreamer has reshaped them — flag for narrative
      changes.hiddenMotive = `Dreamer-touched: the cryo dream changed who they were becoming.`;
      break;
  }
  return changes;
}
