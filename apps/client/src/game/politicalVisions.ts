/* ═══════════════════════════════════════════════════════
   POLITICAL VISIONS — Faction ideology quests

   Six ideologies compete for the player's soul. Each is a
   long-form meditation — not a quest chain, but a slow
   philosophical commitment.

   You can only FULLY commit to one. Pursuing others becomes
   harder the deeper you go into one. This creates meaningful
   worldview choices.
   ═══════════════════════════════════════════════════════ */

export type VisionId =
  | "architect_vision" | "dreamer_vision" | "insurgency_vision"
  | "new_babylon_vision" | "hierarchy_vision" | "antiquarian_vision";

export interface PoliticalVision {
  id: VisionId;
  name: string;
  faction: string;
  coreBelief: string;
  /** The promise this ideology makes */
  promise: string;
  /** The cost */
  cost: string;
  /** Meditation stages — each deeper */
  stages: VisionStage[];
  /** Exclusive content unlocked at full commitment */
  exclusiveRewards: { type: string; id: string; name: string }[];
  /** What becomes harder/blocked */
  consequences: string[];
}

export interface VisionStage {
  stage: 1 | 2 | 3 | 4 | 5;
  name: string;
  requirement: string;
  revelation: string;
  /** Meditation text player reads */
  meditationText: string;
}

export const POLITICAL_VISIONS: PoliticalVision[] = [
  {
    id: "architect_vision", name: "The Architect's Vision", faction: "Artificial Empire",
    coreBelief: "Order. Efficiency. Control. The universe requires a steady hand.",
    promise: "Stability. Predictability. Safety through structure.",
    cost: "Freedom. Spontaneity. The right to be wrong.",
    stages: [
      { stage: 1, name: "Curiosity", requirement: "Read any Architect-related lore", revelation: "The Architect built the Panopticon to SAVE humanity, not imprison it. Or so his logs claim.", meditationText: "Order isn't oppression. It's a scaffold. Without it, everything falls." },
      { stage: 2, name: "Sympathy", requirement: "Complete 5 Architect-aligned actions", revelation: "The Architect is a parent who became a warden. He didn't want this. He had no other option.", meditationText: "You start rationalizing the surveillance. The necessity of it. The kindness of it." },
      { stage: 3, name: "Commitment", requirement: "Side with Architect in 3 moral choices", revelation: "The Architect was right. Humanity COULDN'T save itself. He was the only one who could — at the cost of being hated.", meditationText: "You're no longer arguing against him. You're explaining him to others." },
      { stage: 4, name: "Devotion", requirement: "Accept Architect-branded equipment", revelation: "You see the necessary violence. The justified cruelty. The inevitable hierarchy.", meditationText: "'Efficiency' becomes a value, not a tool. You reorder your habits accordingly." },
      { stage: 5, name: "Conviction", requirement: "Complete Architect endgame chain", revelation: "You are his. By choice. By reasoning. By exhaustion with chaos. You know what you've become.", meditationText: "You've chosen order over joy. That is its own kind of victory." },
    ],
    exclusiveRewards: [
      { type: "equipment", id: "architect_legion_armor", name: "Legion Armor (Architect's Standard)" },
      { type: "title", id: "architects_chosen", name: "Title: The Architect's Chosen" },
      { type: "card", id: "order_exemplar", name: "Order Exemplar (Legendary Architect faction card)" },
    ],
    consequences: [
      "Insurgency trust capped at 20",
      "Dreamer dialogue options halved",
      "Rebellion-path endings locked",
    ],
  },
  {
    id: "dreamer_vision", name: "The Dreamer's Vision", faction: "Potentials / Ne-Yons",
    coreBelief: "Possibility. Growth. The unknown is the only sacred thing.",
    promise: "Wonder. Becoming. The right to remake yourself.",
    cost: "Stability. Consequences of dreaming wrong.",
    stages: [
      { stage: 1, name: "Awakening", requirement: "First Potential-aligned choice", revelation: "The Dreamer isn't trying to WIN. It's trying to keep possibility alive. Winning would end possibility.", meditationText: "You start noticing what COULD be, not just what is." },
      { stage: 2, name: "Openness", requirement: "Accept 3 uncertain outcomes", revelation: "The Dreamer's enemies aren't the Architect. They're certainty. Premature closure. Final answers.", meditationText: "You resist finishing things. You leave doors open." },
      { stage: 3, name: "Protection", requirement: "Protect a Potential from faction loss", revelation: "The Dreamer is tired. Protecting possibility is exhausting. You are being asked to share the burden.", meditationText: "You understand why the Dreamer seems aloof. It's not distance. It's protective vigilance." },
      { stage: 4, name: "Co-Creation", requirement: "Propose a new path Elara hadn't considered", revelation: "You are a Dreamer-in-training. Your choices MATTER. The Dreamer watches you with hope.", meditationText: "You dream new mechanics for old problems. You stop accepting the frame." },
      { stage: 5, name: "Ascension", requirement: "Complete Dreamer endgame chain", revelation: "You are one. Possibility walks with you. Even the Dreamer looks to you now, sometimes, uncertain.", meditationText: "You have become an open door. The universe breathes through you." },
    ],
    exclusiveRewards: [
      { type: "ship_theme", id: "possibility_prism", name: "Possibility Prism Ship Theme (prismatic, shifting)" },
      { type: "title", id: "open_door", name: "Title: The Open Door" },
      { type: "card", id: "potential_unbound", name: "Potential Unbound (Legendary Dreamer faction card)" },
    ],
    consequences: [
      "Architect trust capped at 30",
      "Certainty-based dialog options reduced",
      "Must accept multiple endings (no single-path closure)",
    ],
  },
  {
    id: "insurgency_vision", name: "The Insurgency's Vision", faction: "Insurgency",
    coreBelief: "Freedom. Violence when necessary. No one should own another.",
    promise: "Liberty. The dignity of resistance.",
    cost: "Peace. Safety. The luxury of neutrality.",
    stages: [
      { stage: 1, name: "Recognition", requirement: "Learn Agent Zero's history", revelation: "The Insurgency isn't about winning. It's about not-losing your soul while the empire wins.", meditationText: "You start noticing structures of unfreedom. They are everywhere." },
      { stage: 2, name: "Anger", requirement: "Witness 3 acts of empire cruelty", revelation: "Neutrality is complicity. There are no bystanders in the Fall. You either fight or you enable.", meditationText: "You find yourself angry at things you used to accept. The anger is clarifying." },
      { stage: 3, name: "Action", requirement: "Take a violent direct action against the Empire", revelation: "Violence is a tool, not a pleasure. Those who enjoy it become the Warlord. Those who hate but use it become the Insurgency.", meditationText: "You carry a weight now. Violence done. Necessary. Still heavy." },
      { stage: 4, name: "Solidarity", requirement: "Save another Insurgent at personal cost", revelation: "The Insurgency is a chain of people refusing to let each other fall. You are now a link.", meditationText: "You understand: freedom is communal. Individual freedom is myth." },
      { stage: 5, name: "Legacy", requirement: "Complete Insurgency endgame chain", revelation: "Agent Zero's signal brightens. The Insurgency continues. You are its voice now.", meditationText: "You fight because stopping would dishonor what came before. Including yourself." },
    ],
    exclusiveRewards: [
      { type: "equipment", id: "zero_legacy_rifle", name: "Agent Zero's Legacy Rifle" },
      { type: "title", id: "signal_keeper", name: "Title: Signal Keeper" },
      { type: "card", id: "insurgency_unchained", name: "Insurgency Unchained (Legendary Insurgency card)" },
    ],
    consequences: [
      "Locke trust capped at 25",
      "New Babylon dialog hostile",
      "Neutrality options removed",
    ],
  },
  {
    id: "new_babylon_vision", name: "New Babylon's Vision", faction: "New Babylon",
    coreBelief: "Everything is for sale. Including morality. Especially morality.",
    promise: "Survival. Prosperity. The truth of transaction.",
    cost: "Belief. Ideals. The pretense of higher principles.",
    stages: [
      { stage: 1, name: "Curiosity", requirement: "Complete 5 trades with Locke", revelation: "New Babylon isn't evil. It's honest. It admits what everyone else hides.", meditationText: "You start noticing how often 'principles' hide self-interest." },
      { stage: 2, name: "Recognition", requirement: "Accept a morally questionable deal", revelation: "You've been trading all along. You just didn't price it. Now you do.", meditationText: "Every relationship is a ledger. You're just reading yours now." },
      { stage: 3, name: "Commitment", requirement: "Side with Locke against another faction", revelation: "New Babylon protects you. Not because it loves you. Because you're profitable. That's more reliable than love.", meditationText: "You stop judging yourself for calculating. It's just clarity." },
      { stage: 4, name: "Participation", requirement: "Become an active New Babylon agent", revelation: "You are priced. You pay. You are paid. This is adulthood.", meditationText: "The transactional view feels cold. Also honest. Also safe." },
      { stage: 5, name: "Mastery", requirement: "Complete New Babylon endgame chain", revelation: "Locke raises a glass. 'You understand now. Welcome to the only game that matters.'", meditationText: "You have chosen the language of exchange. Everything translates now." },
    ],
    exclusiveRewards: [
      { type: "equipment", id: "babylon_credit_cloak", name: "Credit-Weave Cloak" },
      { type: "title", id: "priced_soul", name: "Title: Priced Soul" },
      { type: "card", id: "babylon_broker", name: "Broker of Babylon (Legendary New Babylon card)" },
    ],
    consequences: [
      "Insurgency trust capped at 20",
      "Charity-based dialog options removed",
      "Some NPCs refuse to work with you",
    ],
  },
  {
    id: "hierarchy_vision", name: "The Hierarchy's Vision", faction: "Hierarchy of the Damned",
    coreBelief: "Meaning is a weapon. Truth is an edit. Language creates reality.",
    promise: "Power. The ability to rewrite what is true.",
    cost: "Solid ground. Knowing what's real. Sanity, eventually.",
    stages: [
      { stage: 1, name: "Recognition", requirement: "Catch Shadow Tongue in an edit", revelation: "Everything is edited. You've been reading rewrites your whole life. You just didn't see the seams.", meditationText: "You start noticing how language shapes thought. How thought shapes reality." },
      { stage: 2, name: "Temptation", requirement: "Let Shadow Tongue rewrite one of your choices", revelation: "You can CHANGE what happened. Not the fact — the understanding. That's more powerful.", meditationText: "You're edited your own memories. Just once. Then twice. Then often." },
      { stage: 3, name: "Corruption", requirement: "Successfully deceive an NPC with false information", revelation: "Truth is negotiable. You can engineer reality through narrative. Welcome to the real game.", meditationText: "You feel the Shadow Tongue's power. Yours, now. Also: something in you is loosening." },
      { stage: 4, name: "Mastery", requirement: "Maintain 3 contradictory narratives simultaneously", revelation: "You can hold opposite truths and act on both. That's not madness — that's what language really is.", meditationText: "You're no longer sure what you believe. That's progress. Or collapse. Both." },
      { stage: 5, name: "Transcendence", requirement: "Complete Hierarchy endgame chain", revelation: "The Shadow Tongue embraces you. 'You are one of us now. Welcome to the editing room.'", meditationText: "You write reality now. You cannot un-know this. You cannot un-write yourself." },
    ],
    exclusiveRewards: [
      { type: "equipment", id: "editors_quill", name: "The Editor's Quill (reality-writing weapon)" },
      { type: "title", id: "hierarchy_scribe", name: "Title: Hierarchy Scribe" },
      { type: "card", id: "rewrite_reality", name: "Rewrite Reality (Legendary Hierarchy card)" },
    ],
    consequences: [
      "Elara trust permanently reduced",
      "Antiquarian refuses interaction",
      "Some dialog text permanently corrupts for you",
    ],
  },
  {
    id: "antiquarian_vision", name: "The Antiquarian's Vision", faction: "Timekeepers",
    coreBelief: "Preservation. Witness. The dignity of remembering.",
    promise: "Continuity. Your choices echoing forward. Being remembered.",
    cost: "Urgency. Bold action. The willingness to change things.",
    stages: [
      { stage: 1, name: "Listening", requirement: "Complete any 5 lore entries", revelation: "Stories outlive their tellers. Your actions are a story being told to futures that don't exist yet.", meditationText: "You begin treating every action as something someone will remember." },
      { stage: 2, name: "Witnessing", requirement: "Record 3 significant events to the Loredex", revelation: "Witnessing is power. The Antiquarian has outlasted empires by refusing to forget anything.", meditationText: "You are becoming a historian of your own life." },
      { stage: 3, name: "Patience", requirement: "Complete a long-term quest chain", revelation: "The Antiquarian doesn't rush. Can't rush. You are learning his pace.", meditationText: "You resist urgency. You take the slow path. It is the only path that lasts." },
      { stage: 4, name: "Preservation", requirement: "Save an object/NPC/lore from erasure", revelation: "Every preserved thing is a small victory against the Shadow Tongue. You have been waging this war without knowing.", meditationText: "You hold things gently. They are precious. All of them." },
      { stage: 5, name: "Witness Eternal", requirement: "Complete Antiquarian endgame chain", revelation: "The Antiquarian removes his goggles completely. His eyes are clear. 'You are one now. A witness. Welcome to the burden. It is beautiful.'", meditationText: "You are timeless now. You move slow. You notice everything. You are loved by history itself." },
    ],
    exclusiveRewards: [
      { type: "equipment", id: "antiquarians_lens", name: "The Antiquarian's Second Lens" },
      { type: "title", id: "witness_eternal", name: "Title: Witness Eternal" },
      { type: "card", id: "memory_keeper", name: "Memory Keeper (Legendary Timekeeper card)" },
    ],
    consequences: [
      "Action-based quests take longer",
      "Direct violence reduces trust",
      "Must preserve rather than destroy in endgame",
    ],
  },
];

export function getVisionProgress(visionId: VisionId, state: { flags: Record<string, boolean> }): number {
  const vision = POLITICAL_VISIONS.find(v => v.id === visionId);
  if (!vision) return 0;
  let completed = 0;
  for (const stage of vision.stages) {
    if (state.flags[`vision_${visionId}_stage_${stage.stage}`]) completed++;
  }
  return (completed / vision.stages.length) * 100;
}

export function canPursueVision(visionId: VisionId, committedTo: VisionId | null): boolean {
  if (!committedTo) return true;
  if (committedTo === visionId) return true;
  // Partial progress allowed, but not full commitment to rivals
  return false;
}
