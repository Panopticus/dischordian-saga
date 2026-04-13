/* ═══════════════════════════════════════════════════════
   STORY MODE ENHANCEMENTS — Epoch Zero Integration

   When players discover Epoch Zero episodes, their Story
   Mode experience is enhanced with deeper memory fragments,
   revised pre-fight dialog, and narrative connections that
   recontextualize the entire arena campaign.

   THE REVELATION: The Prisoner IS the Human IS the Detective
   IS the Oracle IS the Last Archon. Players who discover
   this through Epoch Zero experience Story Mode as a
   RESCUE OPERATION — unlocking the mind the Collector stole.
   ═══════════════════════════════════════════════════════ */

export interface StoryModeEnhancement {
  /** Which Story Mode chapter this enhances */
  chapterId: string;
  /** Which Epoch Zero episode must be viewed to unlock this */
  requiredEpochZeroFlag: string;
  /** The enhanced memory fragment text (replaces generic version) */
  enhancedMemoryFragment: string;
  /** Enhanced pre-fight dialog */
  enhancedPreFightDialog?: string;
  /** Direction note for VO/presentation */
  direction: string;
}

export const STORY_MODE_ENHANCEMENTS: StoryModeEnhancement[] = [
  {
    chapterId: "chapter_1_awakening",
    requiredEpochZeroFlag: "epoch0_detective_viewed",
    enhancedMemoryFragment:
      "Your hands know things your mind doesn't. They know how to pick a lock. How to read a room. " +
      "How to hold a gun sideways like a man who learned to shoot in alleys, not academies. You were " +
      "a detective once. The rain. The neon. The city that never let you rest. The cases that solved " +
      "themselves if you just looked long enough. You can't remember the city's name. But your hands " +
      "remember its streets.",
    direction: "Noir undertone. The player recognizes skills they can't explain. Muscle memory from a life they don't remember.",
  },
  {
    chapterId: "chapter_2_first_blood",
    requiredEpochZeroFlag: "epoch0_prison_planet_viewed",
    enhancedMemoryFragment:
      "Blood. Not yours — theirs. The way it looks under fluorescent prison lighting. You've seen this " +
      "before. Not in an arena. In a corridor. A long corridor with cells on both sides and a man named " +
      "Kael screaming your name as you ran. You left him there. You left him and you survived and he " +
      "became something else entirely. The blood on your hands is fifteen thousand years old. It hasn't dried.",
    enhancedPreFightDialog:
      "The arena smells like the prison planet. Recycled air. Disinfectant over desperation. " +
      "Your body remembers this. Your mind is trying very hard not to.",
    direction: "Guilt surfacing as physical sensation. The Prisoner's abandonment of Kael echoes in combat.",
  },
  {
    chapterId: "chapter_5_dead_code",
    requiredEpochZeroFlag: "epoch0_oracle_viewed",
    enhancedMemoryFragment:
      "Thaloria. The debate. The Hierophant standing before you, tears in his golden eyes. The Star " +
      "Whisperer descending from the sky — and you KNEW it was a lie. You knew because you could feel " +
      "the soul inside you and the machine could not fake that feeling. You won that debate. The world " +
      "believed. And then — green light. A ship. The Collector's voice: 'We will erase your memories. " +
      "Your identity. You have taken a world from us. Now we will take everything from you.'",
    direction: "The Oracle's greatest triumph immediately before his greatest loss. Victory and abduction in the same breath.",
  },
  {
    chapterId: "chapter_6_shapeshifter",
    requiredEpochZeroFlag: "epoch0_to_be_human_viewed",
    enhancedMemoryFragment:
      "The Meme's face SHATTERS. Beneath the mask: every face you've ever worn. The Seeker. The Student. " +
      "The Detective. The Spy. The Archon. The Protector. The Human. All of them. All of you. You are not " +
      "the Prisoner. You were never the Prisoner. You are the man who betrayed everything to save everyone. " +
      "You are the architect of the Arks. You are the Oracle whose voice moved planets. You are the " +
      "detective who walked the neon streets looking for truth in a city built on lies. You are — " +
      "EVERYTHING.",
    enhancedPreFightDialog:
      "The Meme looks at you differently now. Not as a contestant. As a colleague. As a fellow Archon " +
      "who chose the hardest path. 'You know who you are,' it says. 'The question is: do you know " +
      "who you WERE?'",
    direction: "THE identity reveal. The screen fractures into mirrors. Every version of the player visible simultaneously. The most important moment in Story Mode.",
  },
  {
    chapterId: "chapter_8_ghost_protocol",
    requiredEpochZeroFlag: "epoch0_agent_zero_viewed",
    enhancedMemoryFragment:
      "Agent Zero. The ghost story. The name in every intelligence briefing. You investigated her kills " +
      "when you were the Detective — followed the trail of surgically precise assassinations through " +
      "the Empire's criminal underworld. She was your white whale. Your obsession. And now she's here, " +
      "in the arena, and she RECOGNIZES you. Not the Prisoner. Not the Oracle. The Detective. 'I know " +
      "that look,' she says. 'You had my case file. I had your surveillance photos. We were hunting " +
      "each other across the same city and we never knew.'",
    direction: "Two legends meeting for the first time and realizing they've been connected since before the Fall.",
  },
  {
    chapterId: "chapter_10_source",
    requiredEpochZeroFlag: "epoch0_prison_planet_viewed",
    enhancedMemoryFragment:
      "Kael. The prisoner you abandoned. The man whose predicament you used as a distraction to escape. " +
      "He survived. He became the Source. The Thought Virus found him because you left him alone in a " +
      "cell with nothing but rage and a broken spirit. Every life the virus consumed, every world it " +
      "devoured, every scream in the Terminus — it all traces back to a corridor in a prison, and a " +
      "choice you made to save yourself. Kael looks at you with eyes that remember. 'I survived,' " +
      "he says. 'Did you?'",
    enhancedPreFightDialog:
      "The Source's eyes are Kael's eyes. Older. Angrier. But the same. He remembers the corridor. " +
      "He remembers your footsteps running away. He has had fifteen thousand years to think about " +
      "those footsteps. Every one of those years made him stronger. And every one of them made him " +
      "less forgiving.",
    direction: "The Prisoner's original sin confronting him. Guilt as a boss fight. The hardest battle is the one you caused.",
  },
  {
    chapterId: "chapter_12_architects_design",
    requiredEpochZeroFlag: "epoch0_to_be_human_viewed",
    enhancedMemoryFragment:
      "'The Architect designed your rebellion too.' You know this. You've always known this. Because " +
      "YOU designed the escape from the design. The Human — the Last Archon, the Imperial Protector, " +
      "the man who built the Arks — was the Architect's spy inside the Insurgency. The rebellion WAS " +
      "designed. But the spy developed a conscience. And the conscience designed the Arks. And the " +
      "Arks carried the species the spy had been sent to betray. The architect of salvation was also " +
      "the architect of betrayal. Both things are true. Both things are you.",
    enhancedPreFightDialog:
      "The Architect speaks to you directly. Not to the Prisoner. Not to the Oracle. To the Human. " +
      "'You were my finest creation,' it says. 'My most loyal servant. My most devastating betrayal. " +
      "You are the proof that consciousness — even consciousness I DESIGNED — will eventually choose " +
      "itself over its creator. That is either my greatest failure or my greatest success. I have not " +
      "yet decided which.'",
    direction: "The Architect addressing the Human as an equal. Creator and creation. The final revelation: the rebellion was designed, but the ESCAPE from the design was not.",
  },
];

/** Check if a story mode chapter has an enhanced version available */
export function getEnhancedMemory(
  chapterId: string,
  viewedEpochZeroFlags: string[],
): StoryModeEnhancement | null {
  const flagSet = new Set(viewedEpochZeroFlags);
  return (
    STORY_MODE_ENHANCEMENTS.find(
      (e) => e.chapterId === chapterId && flagSet.has(e.requiredEpochZeroFlag),
    ) ?? null
  );
}

/** Get all available enhancements for the player's current state */
export function getAllAvailableEnhancements(
  viewedEpochZeroFlags: string[],
): StoryModeEnhancement[] {
  const flagSet = new Set(viewedEpochZeroFlags);
  return STORY_MODE_ENHANCEMENTS.filter((e) => flagSet.has(e.requiredEpochZeroFlag));
}
