/* ═══════════════════════════════════════════════════════
   COMMONS SCENE POOL — Walk-in vignettes.

   Pre-authored two/three-character scenes that fire when
   the player enters the Commons (or pass without the
   player and resolve via cohesion deltas). Mass Effect /
   Dragon Age tactic — banter that builds the social group.

   v1 ships ~30 scenes — apprentice ↔ apprentice and
   apprentice ↔ named-NPC pairings. The ratchet target is
   ≥ 2 scenes per (archetype × archetype) and (archetype ×
   recruited-NPC) pairing; ship_check tracks the gap.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { ResurrectableNpcKey } from "./resurrectionProtocols";

export type ParticipantTag = ApprenticeArchetype | ResurrectableNpcKey;

export interface CommonsScene {
  id: string;
  /** Sub-zone — bar | long_table | alcove. */
  subzone: "bar" | "long_table" | "alcove";
  /** Required participants. The scene only spawns when all listed
   *  participants are present in the Commons. Order matters for the
   *  speaker assignments below. */
  participants: ParticipantTag[];
  /** Pre-authored dialog lines, one per participant turn. */
  lines: { speaker: ParticipantTag; text: string }[];
  /** Player choices when they Approach. The first is the deepening
   *  choice (positive bond delta), the second neutralizes, the third
   *  is contrarian (negative bond delta). */
  approachChoices: {
    label: string;
    bondDelta: number;
    consequence: string;
  }[];
  /** Eavesdropping reward — small bond delta + journal note. */
  eavesdropDelta: number;
  /** True if the scene is one-shot (cannot repeat). */
  oneShot?: boolean;
}

export const COMMONS_SCENE_POOL: CommonsScene[] = [
  /* ═══ Apprentice ↔ Apprentice ═══ */
  {
    id: "scholar_x_heretic_bar_01",
    subzone: "bar",
    participants: ["scholar", "heretic"],
    lines: [
      { speaker: "scholar", text: "I have a footnote you should read before your next argument." },
      { speaker: "heretic", text: "Your footnote is a leash. I write in margins for a reason." },
      { speaker: "scholar", text: "Margins are footnotes that haven't grown up." },
    ],
    approachChoices: [
      {
        label: "I want them to publish together.",
        bondDelta: 5,
        consequence: "Both warm to the idea. Tension softens.",
      },
      {
        label: "Settle the bet — who's right?",
        bondDelta: 0,
        consequence: "They agree to keep arguing.",
      },
      {
        label: "Not now. Take it elsewhere.",
        bondDelta: -3,
        consequence: "Both feel dismissed.",
      },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "martyr_x_jester_long_table_01",
    subzone: "long_table",
    participants: ["martyr", "jester"],
    lines: [
      { speaker: "jester", text: "If you take one more bullet for me I'm going to start charging you." },
      { speaker: "martyr", text: "I would pay it." },
      { speaker: "jester", text: "That is the saddest joke I've ever heard, and I'm a professional." },
    ],
    approachChoices: [
      {
        label: "Tell the Martyr they're more than the hits.",
        bondDelta: 6,
        consequence: "Martyr is shaken in a good way. Jester nods.",
      },
      {
        label: "Tell the Jester to keep going — they're getting through.",
        bondDelta: 3,
        consequence: "Jester recommits to humor-as-armor for now.",
      },
      {
        label: "Walk past.",
        bondDelta: -1,
        consequence: "Both notice you didn't sit down.",
      },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_sentinel_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "sentinel"],
    lines: [
      { speaker: "sentinel", text: "You moved through my watch zone last night without tripping a sensor." },
      { speaker: "ghost", text: "I know." },
      { speaker: "sentinel", text: "I want you to teach me how. Officially." },
      { speaker: "ghost", text: "…Officially?" },
    ],
    approachChoices: [
      {
        label: "Authorize the training.",
        bondDelta: 6,
        consequence: "Both gain a small ambush-detection bonus.",
      },
      {
        label: "Let them work it out.",
        bondDelta: 2,
        consequence: "They keep negotiating.",
      },
      {
        label: "Veto. The Ghost shouldn't be teachable.",
        bondDelta: -4,
        consequence: "Ghost retreats; Sentinel resents the call.",
      },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "wanderer_x_prodigal_bar_01",
    subzone: "bar",
    participants: ["wanderer", "prodigal"],
    lines: [
      { speaker: "wanderer", text: "I came back. That's still strange to say." },
      { speaker: "prodigal", text: "Welcome to the club. Membership is irrevocable and the dues are lifelong." },
      { speaker: "wanderer", text: "I asked for a refund. They laughed." },
    ],
    approachChoices: [
      {
        label: "Buy them both a round.",
        bondDelta: 4,
        consequence: "Bond between Wanderer and Prodigal grows.",
      },
      {
        label: "Listen.",
        bondDelta: 2,
        consequence: "Both feel heard.",
      },
      {
        label: "Tell them to stop romanticizing it.",
        bondDelta: -2,
        consequence: "Both tense.",
      },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_oracle_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "oracle"],
    lines: [
      { speaker: "zealot", text: "Tell me what you've seen for tomorrow." },
      { speaker: "oracle", text: "I've stopped sharing the certain ones." },
      { speaker: "zealot", text: "Then share an uncertain one. I prefer them honest." },
      { speaker: "oracle", text: "You will be wrong about something tomorrow. You will not know what." },
    ],
    approachChoices: [
      {
        label: "Tell the Zealot to listen carefully.",
        bondDelta: 4,
        consequence: "Both feel respected.",
      },
      {
        label: "Tell the Oracle to share more.",
        bondDelta: 2,
        consequence: "Oracle agrees, reluctantly.",
      },
      {
        label: "Override — this conversation isn't useful.",
        bondDelta: -5,
        consequence: "Both feel dismissed.",
      },
    ],
    eavesdropDelta: 1,
  },

  /* ═══ Apprentice ↔ Recruited NPC ═══ */
  {
    id: "scholar_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["scholar", "locke"],
    lines: [
      { speaker: "scholar", text: "Adjudicator, my paper contradicts a Hierarchy ruling. I want your read." },
      { speaker: "locke", text: "Send it. I will not promise to like it." },
      { speaker: "scholar", text: "I never expected you to like anything." },
      { speaker: "locke", text: "I noticed. The paper is, however, well-cited." },
    ],
    approachChoices: [
      {
        label: "Push them to publish together.",
        bondDelta: 7,
        consequence: "Locke + Scholar bond grows. Hierarchy faction tense.",
      },
      {
        label: "Listen.",
        bondDelta: 2,
        consequence: "Mutual respect.",
      },
      {
        label: "Veto publication.",
        bondDelta: -6,
        consequence: "Both walk away angry.",
      },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "jester_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["jester", "jericho_jones"],
    lines: [
      { speaker: "jester", text: "Iron Lion, I have a joke about cadre formations." },
      { speaker: "jericho_jones", text: "I will laugh on the second beat. It is a discipline." },
      { speaker: "jester", text: "That is somehow the funniest thing anyone has ever said to me." },
      { speaker: "jericho_jones", text: "It was not a joke." },
    ],
    approachChoices: [
      {
        label: "Compliment Jericho's discipline.",
        bondDelta: 5,
        consequence: "Jericho warms by a measurable degree.",
      },
      {
        label: "Defend the Jester.",
        bondDelta: 3,
        consequence: "Jester laughs for real.",
      },
      {
        label: "Hush them — Locke is in earshot.",
        bondDelta: -2,
        consequence: "Both clam up.",
      },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_vex_solene_alcove_01",
    subzone: "alcove",
    participants: ["artisan", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "I commissioned a piece, once. I never told the maker who it was for." },
      { speaker: "artisan", text: "We don't ask. We hope." },
      { speaker: "vex_solene", text: "It was for me. I commissioned my own funeral piece. It is on the wall behind the Coda." },
      { speaker: "artisan", text: "I will see if I can finish the second movement." },
    ],
    approachChoices: [
      {
        label: "Encourage the second movement.",
        bondDelta: 6,
        consequence: "Both deepen. Vex's romance ladder unlocks if she's recruited.",
      },
      {
        label: "Sit with them.",
        bondDelta: 3,
        consequence: "Both notice.",
      },
      {
        label: "Leave. This isn't yours.",
        bondDelta: 1,
        consequence: "They keep talking; Artisan logs it.",
      },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["revenant", "wraith_calder"],
    lines: [
      { speaker: "revenant", text: "Eight rites. I would like to know the breathing pattern of the eighth." },
      { speaker: "wraith_calder", text: "It is taught not in counts but in surrenders." },
      { speaker: "revenant", text: "I have surrendered once. I know how it tastes." },
      { speaker: "wraith_calder", text: "Then we will sit, and I will tell you about the second one." },
    ],
    approachChoices: [
      {
        label: "Stay and listen.",
        bondDelta: 7,
        consequence: "Both deepen. Revenant gains a +5% damage-taken reduction next mission.",
      },
      {
        label: "Approach respectfully and ask permission.",
        bondDelta: 4,
        consequence: "They make room.",
      },
      {
        label: "Leave them alone.",
        bondDelta: 2,
        consequence: "They appreciate the space.",
      },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "ghost_x_akai_shi_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "akai_shi"],
    lines: [
      { speaker: "akai_shi", text: "I came back from a worse place than you." },
      { speaker: "ghost", text: "You aren't supposed to talk to me." },
      { speaker: "akai_shi", text: "Then this conversation isn't happening. Tell me your favorite vanishing point." },
    ],
    approachChoices: [
      {
        label: "Encourage them to keep talking.",
        bondDelta: 5,
        consequence: "Ghost warms; Akai gains stealth bonus next mission.",
      },
      {
        label: "Sit at a respectful distance.",
        bondDelta: 2,
        consequence: "They appreciate the space.",
      },
      {
        label: "Disrupt — Akai has thought-virus history.",
        bondDelta: -6,
        consequence: "Both withdraw permanently for the day.",
      },
    ],
    eavesdropDelta: 2,
  },
];

/** Index by participant for O(1) lookup. */
export function scenesForParticipants(
  present: Set<ParticipantTag>,
): CommonsScene[] {
  return COMMONS_SCENE_POOL.filter((s) =>
    s.participants.every((p) => present.has(p)),
  );
}

/** Pick up to N scenes for the current Commons occupancy. Deterministic
 *  by seed; consumed `playedIds` are excluded. */
export function rollCommonsScenes(args: {
  present: Set<ParticipantTag>;
  playedIds: Set<string>;
  seed: number;
  count?: number;
}): CommonsScene[] {
  const { present, playedIds, seed, count = 3 } = args;
  const candidates = scenesForParticipants(present).filter(
    (s) => !s.oneShot || !playedIds.has(s.id),
  );
  if (candidates.length === 0) return [];
  // Fisher-Yates shuffle seeded by `seed`.
  const shuffled = [...candidates];
  let s = (seed | 0) || 1;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0;
    const j = Math.abs(s) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
