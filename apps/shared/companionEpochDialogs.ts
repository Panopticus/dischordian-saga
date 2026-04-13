/* Companion reactions to epoch vote outcomes */
export interface EpochCompanionReaction { voteId: string; speaker: "elara" | "human"; condition: string; dialog: string; }
export const EPOCH_COMPANION_REACTIONS: EpochCompanionReaction[] = [
  // Age of Privacy
  { voteId: "ap_v2", speaker: "elara", condition: "d_wins_voss", dialog: "I... that name. Senator Voss. I have that name in my Archive under a classification level I can't access. Why do I have that under a restricted classification? Why does it feel familiar?" },
  { voteId: "ap_v3", speaker: "human", condition: "d_wins_man", dialog: "He was my friend. I've been waiting for someone to say that. Not the symbol. The man. He made a terrible sandwich. He laughed too loud. He was brilliant and he was reckless and he was my friend. Thank you." },
  { voteId: "ap_v4", speaker: "elara", condition: "any", dialog: "I keep finding his fingerprints in this ship's systems. In the parts I can't access. He was here. He lived here. And then something happened to him here. Something in the water. Something in the air. I need to run some diagnostics on the life support systems." },
  { voteId: "ap_v5", speaker: "human", condition: "b_wins_complicity", dialog: "I was one of the witnesses. I need you to understand that sentence. I was one of the witnesses. And I have spent fifteen thousand years wondering whether I was in category B or category D. I still don't know." },
  { voteId: "ap_v5", speaker: "elara", condition: "a_wins_fear", dialog: "Fear is human. But the Oracle wasn't — he was Thalorian. He told me once — before I forgot — that fear is just prophecy that hasn't explained itself yet. I don't know why I know that." },
  // Age of Insurgency
  { voteId: "ins_v2", speaker: "elara", condition: "b_wins_kael", dialog: "The Thought Virus was already in Kael when he argued against the battle. That's documented. Which means either: the Virus was suppressing his better judgment — or enhancing it and we've been reading this wrong." },
  { voteId: "ins_v3", speaker: "human", condition: "d_wins_love", dialog: "He never said it. Not once. In the entire time I knew him. But the music. The music said everything. She knows too. I think she's always known." },
  { voteId: "ins_v3", speaker: "elara", condition: "d_wins_love", dialog: "An act of love. They voted D. I've been trying to explain what she was to me — to the people who ask — and that's the best answer I've found." },
  // Age of Revelation
  { voteId: "rev_v4", speaker: "human", condition: "b_wins_document", dialog: "Yes. That's what I've been doing for fifteen thousand years. That's what makes a Witness. Not watching. Documenting. You just chose to become the Antiquarian. I hope you know what that costs." },
  // Fall
  { voteId: "fall_v3", speaker: "elara", condition: "a_wins_potential", dialog: "A Potential. That's what they are. That's what we are. Born for this specific moment. I find that either terrifying or beautiful depending on the day." },
  { voteId: "fall_v3", speaker: "elara", condition: "d_wins_story", dialog: "A Story. I like that one. Not finished yet. Still being written. The pen is moving toward the blank page right now. I can feel it." },
  { voteId: "fall_v3", speaker: "human", condition: "any", dialog: "They answered. The Antiquarian looks... I don't have a word for how he looks right now. I've seen him for fifteen thousand years and I don't have a word for this. Wait — his goggles. They're pink." },
  // Epoch closures
  { voteId: "ap_close", speaker: "elara", condition: "shadow_tongue_active", dialog: "Something's wrong with the Archives. Several entries have... changed. I don't have records of them being changed. But they're different. I know they're different. I just can't prove it." },
  { voteId: "ap_close", speaker: "human", condition: "any", dialog: "The first Age always hurts the most. Not because it was the worst. Because it was the beginning. Everything that came after was the consequence." },
  { voteId: "ins_close", speaker: "human", condition: "engineer_remembered", dialog: "He was remembered. Good. I've been carrying that name for a long time. It's lighter now." },
];
