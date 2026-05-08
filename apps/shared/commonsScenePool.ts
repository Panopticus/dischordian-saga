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

  /* ═══ Apprentice ↔ Apprentice — expanded pool ═══ */
  {
    id: "zealot_x_heretic_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "heretic"],
    lines: [
      { speaker: "heretic", text: "Your scripture has a forged page. I marked it." },
      { speaker: "zealot", text: "Forged is also revealed. The Cause makes use of liars." },
      { speaker: "heretic", text: "That's the most generous theology I've ever heard from you." },
    ],
    approachChoices: [
      { label: "Bring them both to the next mission briefing.", bondDelta: 5, consequence: "They agree to disagree productively." },
      { label: "Don't take sides.", bondDelta: 1, consequence: "They keep at it." },
      { label: "Tell them to drop it.", bondDelta: -3, consequence: "Both note your discomfort." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_heretic_bar_02",
    subzone: "bar",
    participants: ["zealot", "heretic"],
    lines: [
      { speaker: "zealot", text: "Drink this. It's a sacrament." },
      { speaker: "heretic", text: "It's bourbon." },
      { speaker: "zealot", text: "Both can be true. The Cause is generous." },
    ],
    approachChoices: [
      { label: "Pour a third glass.", bondDelta: 4, consequence: "All three of you toast nothing in particular." },
      { label: "Watch.", bondDelta: 0, consequence: "They keep at it." },
      { label: "Refuse to drink.", bondDelta: -2, consequence: "Both feel judged." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_jester_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "jester"],
    lines: [
      { speaker: "jester", text: "Three deities walk into a sermon — " },
      { speaker: "zealot", text: "Don't." },
      { speaker: "jester", text: "Two of them stay. One leaves a tip." },
    ],
    approachChoices: [
      { label: "Laugh.", bondDelta: 3, consequence: "Zealot relents. Jester relaxes." },
      { label: "Stay neutral.", bondDelta: 0, consequence: "They circle the punchline." },
      { label: "Tell the Jester to read the room.", bondDelta: -3, consequence: "Jester wounded; Zealot mollified." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_jester_alcove_01",
    subzone: "alcove",
    participants: ["zealot", "jester"],
    lines: [
      { speaker: "zealot", text: "I want to say a prayer. Don't make a joke." },
      { speaker: "jester", text: "I won't. Not this one." },
    ],
    approachChoices: [
      { label: "Bear witness.", bondDelta: 6, consequence: "Both are surprised; the room shifts." },
      { label: "Wait outside.", bondDelta: 1, consequence: "They're grateful for the privacy." },
      { label: "Disrupt.", bondDelta: -5, consequence: "Both feel cheapened." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "zealot_x_scholar_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "scholar"],
    lines: [
      { speaker: "scholar", text: "Your text mistranscribes 'covenant' as 'commitment'. Three cycles running." },
      { speaker: "zealot", text: "It's the same word. Lived." },
      { speaker: "scholar", text: "Then I'll annotate. Faithfully." },
    ],
    approachChoices: [
      { label: "Endorse the annotation.", bondDelta: 4, consequence: "Both grow more rigorous together." },
      { label: "Stay out of it.", bondDelta: 0, consequence: "They reach a quiet truce." },
      { label: "Side with the Zealot — feeling matters.", bondDelta: -2, consequence: "Scholar is mildly insulted." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_scholar_long_table_02",
    subzone: "long_table",
    participants: ["zealot", "scholar"],
    lines: [
      { speaker: "zealot", text: "You read everything. Have you ever believed any of it?" },
      { speaker: "scholar", text: "I believe the act of reading. The rest I'm provisional on." },
    ],
    approachChoices: [
      { label: "Suggest a shared text they'd both pick.", bondDelta: 4, consequence: "They begin a reading group." },
      { label: "Let it sit.", bondDelta: 1, consequence: "Both think later." },
      { label: "Mock the Zealot's question.", bondDelta: -3, consequence: "Zealot retreats; Scholar disappointed." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "zealot_x_martyr_alcove_01",
    subzone: "alcove",
    participants: ["zealot", "martyr"],
    lines: [
      { speaker: "zealot", text: "If the Cause asked, I would die for it." },
      { speaker: "martyr", text: "It already did. You're still here. That's the harder ask." },
    ],
    approachChoices: [
      { label: "Affirm both.", bondDelta: 5, consequence: "Mutual respect crystallizes." },
      { label: "Listen.", bondDelta: 2, consequence: "They keep talking after you leave." },
      { label: "Push the Martyr to take care of themselves.", bondDelta: -2, consequence: "Martyr deflects; Zealot shielding them." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "zealot_x_martyr_alcove_02",
    subzone: "alcove",
    participants: ["zealot", "martyr"],
    lines: [
      { speaker: "martyr", text: "I'm tired." },
      { speaker: "zealot", text: "Then rest. The Cause wants you whole." },
    ],
    approachChoices: [
      { label: "Tell the Martyr we'll cover the next deployment.", bondDelta: 6, consequence: "Martyr accepts. Both bond +3." },
      { label: "Quiet support.", bondDelta: 2, consequence: "Mood softens." },
      { label: "Suggest the Martyr push through.", bondDelta: -5, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "zealot_x_revenant_bar_01",
    subzone: "bar",
    participants: ["zealot", "revenant"],
    lines: [
      { speaker: "zealot", text: "What's the first thing the Cause taught you when you came back?" },
      { speaker: "revenant", text: "That the Cause was waiting. Patiently. Like a dog with an old shoe." },
    ],
    approachChoices: [
      { label: "Laugh with them.", bondDelta: 3, consequence: "All three drink." },
      { label: "Probe further.", bondDelta: 1, consequence: "They get philosophical." },
      { label: "Refuse the metaphor.", bondDelta: -3, consequence: "Zealot defensive; Revenant amused." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_prodigal_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "prodigal"],
    lines: [
      { speaker: "zealot", text: "You walked away from the Cause once." },
      { speaker: "prodigal", text: "I walked away from a person who claimed to speak for it." },
    ],
    approachChoices: [
      { label: "Draw a line: the Cause itself, not its speakers.", bondDelta: 5, consequence: "Both rest a little easier." },
      { label: "Stay neutral.", bondDelta: 0, consequence: "Conversation continues." },
      { label: "Tell the Prodigal they were wrong to leave.", bondDelta: -4, consequence: "Prodigal hardens; Zealot grateful." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "zealot_x_prodigal_long_table_02",
    subzone: "long_table",
    participants: ["zealot", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "I'm trying to come back to it. Slowly." },
      { speaker: "zealot", text: "Slow is fine. The Cause has been waiting." },
    ],
    approachChoices: [
      { label: "Witness.", bondDelta: 4, consequence: "Both feel seen." },
      { label: "Offer a small ritual.", bondDelta: 3, consequence: "Prodigal participates." },
      { label: "Walk by.", bondDelta: -1, consequence: "Both slightly disappointed." },
    ],
    eavesdropDelta: 2,
  },

  {
    id: "ghost_x_scholar_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "scholar"],
    lines: [
      { speaker: "scholar", text: "You move through every chapter without leaving fingerprints." },
      { speaker: "ghost", text: "That's the design." },
      { speaker: "scholar", text: "I want to write about you. Anonymously." },
    ],
    approachChoices: [
      { label: "Endorse the project.", bondDelta: 5, consequence: "A discreet biography begins." },
      { label: "Remain uninvolved.", bondDelta: 1, consequence: "They negotiate alone." },
      { label: "Veto it.", bondDelta: -4, consequence: "Scholar disappointed; Ghost relieved." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_scholar_alcove_02",
    subzone: "alcove",
    participants: ["ghost", "scholar"],
    lines: [
      { speaker: "ghost", text: "Your footnotes are loud." },
      { speaker: "scholar", text: "I'll switch to a quieter font." },
    ],
    approachChoices: [
      { label: "Compliment the joke.", bondDelta: 3, consequence: "Both relax." },
      { label: "Listen.", bondDelta: 1, consequence: "Quiet camaraderie." },
      { label: "Interrupt with work.", bondDelta: -2, consequence: "Both retreat to tasks." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_oracle_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "oracle"],
    lines: [
      { speaker: "oracle", text: "You're in three of my dreams. Always exiting." },
      { speaker: "ghost", text: "I'll try entering one." },
    ],
    approachChoices: [
      { label: "Encourage the experiment.", bondDelta: 5, consequence: "A shared lucid dreaming bond forms." },
      { label: "Stay quiet.", bondDelta: 2, consequence: "They negotiate it." },
      { label: "Mock the premise.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_oracle_alcove_02",
    subzone: "alcove",
    participants: ["ghost", "oracle"],
    lines: [
      { speaker: "ghost", text: "Tell me what they say about me when I'm not in the room." },
      { speaker: "oracle", text: "You're not in any room. The room is what they say." },
    ],
    approachChoices: [
      { label: "Reflect on it together.", bondDelta: 4, consequence: "Both gain stealth + perception." },
      { label: "Listen.", bondDelta: 2, consequence: "Mood is contemplative." },
      { label: "Press for specifics.", bondDelta: -2, consequence: "Oracle deflects; Ghost amused." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "ghost_x_wanderer_bar_01",
    subzone: "bar",
    participants: ["ghost", "wanderer"],
    lines: [
      { speaker: "wanderer", text: "I keep finding your handprints on different decks." },
      { speaker: "ghost", text: "I touched the rails to know they were rails." },
    ],
    approachChoices: [
      { label: "Suggest they tour together.", bondDelta: 5, consequence: "An unannounced ship-walk happens that night." },
      { label: "Just listen.", bondDelta: 2, consequence: "They keep mapping." },
      { label: "Tell them both to settle down.", bondDelta: -3, consequence: "Ghost vanishes; Wanderer leaves." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "ghost_x_wanderer_bar_02",
    subzone: "bar",
    participants: ["ghost", "wanderer"],
    lines: [
      { speaker: "ghost", text: "There's a corridor on Deck 4 that doesn't appear on the schematics." },
      { speaker: "wanderer", text: "I know. I was going to mention it tomorrow." },
    ],
    approachChoices: [
      { label: "Investigate with them.", bondDelta: 5, consequence: "A small loredex pull triggers next visit." },
      { label: "Make a note.", bondDelta: 2, consequence: "They go without you." },
      { label: "Ignore it.", bondDelta: -2, consequence: "Both disappointed." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_heretic_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "heretic"],
    lines: [
      { speaker: "heretic", text: "Dissent in silence is still dissent." },
      { speaker: "ghost", text: "It's the only kind that doesn't get noticed." },
    ],
    approachChoices: [
      { label: "Encourage subtlety.", bondDelta: 4, consequence: "They plot a quiet pamphlet drop." },
      { label: "Stay out.", bondDelta: 1, consequence: "They strategize." },
      { label: "Encourage public dissent.", bondDelta: -2, consequence: "Heretic agrees; Ghost wary." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_prodigal_bar_01",
    subzone: "bar",
    participants: ["ghost", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "I came back. Nobody noticed." },
      { speaker: "ghost", text: "I noticed." },
    ],
    approachChoices: [
      { label: "Mark the return.", bondDelta: 6, consequence: "Both bonds rise; Prodigal feels seen." },
      { label: "Toast quietly.", bondDelta: 3, consequence: "A wordless drink." },
      { label: "Walk past.", bondDelta: -3, consequence: "Both feel small." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_jester_long_table_01",
    subzone: "long_table",
    participants: ["ghost", "jester"],
    lines: [
      { speaker: "jester", text: "I have a joke about you. It only works if you're not in the room." },
      { speaker: "ghost", text: "Then I'm always not in the room." },
    ],
    approachChoices: [
      { label: "Beg to hear it.", bondDelta: 3, consequence: "Jester complies. It lands." },
      { label: "Let them riff.", bondDelta: 1, consequence: "Quiet laughter." },
      { label: "Ask them to stop.", bondDelta: -2, consequence: "Jester sulks." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "ghost_x_jester_long_table_02",
    subzone: "long_table",
    participants: ["ghost", "jester"],
    lines: [
      { speaker: "ghost", text: "Don't put me in the punchline." },
      { speaker: "jester", text: "I'll put you in the setup. Nobody finds the body in the setup." },
    ],
    approachChoices: [
      { label: "Negotiate the comedy.", bondDelta: 4, consequence: "A new running gag begins, respectful." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet truce." },
      { label: "Order the Jester to stop using their name.", bondDelta: -3, consequence: "Jester reluctantly complies." },
    ],
    eavesdropDelta: 1,
  },

  {
    id: "scholar_x_oracle_long_table_01",
    subzone: "long_table",
    participants: ["scholar", "oracle"],
    lines: [
      { speaker: "scholar", text: "Your dream-records have a citation problem." },
      { speaker: "oracle", text: "I dreamt the citation. It cited me back." },
    ],
    approachChoices: [
      { label: "Suggest a shared methodology.", bondDelta: 5, consequence: "A footnote-of-dreams paper begins." },
      { label: "Listen.", bondDelta: 2, consequence: "They keep cross-referencing." },
      { label: "Tell the Scholar to drop it.", bondDelta: -3, consequence: "Scholar disengages; Oracle disappointed." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "scholar_x_oracle_long_table_02",
    subzone: "long_table",
    participants: ["scholar", "oracle"],
    lines: [
      { speaker: "oracle", text: "There's a war coming. I dreamt the colour of the dust." },
      { speaker: "scholar", text: "I'll add it to the catalogue. Predicted dust is still dust." },
    ],
    approachChoices: [
      { label: "Treat it as actionable intel.", bondDelta: 5, consequence: "Both respected; pre-mission bonus next deploy." },
      { label: "Keep listening.", bondDelta: 2, consequence: "They confer in private." },
      { label: "Dismiss the vision.", bondDelta: -4, consequence: "Oracle wounded; Scholar diplomatically silent." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "scholar_x_artisan_long_table_01",
    subzone: "long_table",
    participants: ["scholar", "artisan"],
    lines: [
      { speaker: "artisan", text: "I built it from your description. Two errors. Both deliberate." },
      { speaker: "scholar", text: "I'll cite the errors as features." },
    ],
    approachChoices: [
      { label: "Endorse the joke.", bondDelta: 4, consequence: "A collaboration begins." },
      { label: "Stay quiet.", bondDelta: 1, consequence: "They keep working." },
      { label: "Insist on accuracy.", bondDelta: -2, consequence: "Both feel scolded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "scholar_x_artisan_long_table_02",
    subzone: "long_table",
    participants: ["scholar", "artisan"],
    lines: [
      { speaker: "scholar", text: "Your last commission is in the archive." },
      { speaker: "artisan", text: "I made it to outlast me. Glad someone read the spec." },
    ],
    approachChoices: [
      { label: "Commission a piece for the player's quarters.", bondDelta: 5, consequence: "Artisan delighted; Scholar will write the plaque." },
      { label: "Approve the archive entry.", bondDelta: 3, consequence: "Both pleased." },
      { label: "Cut the budget.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "scholar_x_wanderer_bar_01",
    subzone: "bar",
    participants: ["scholar", "wanderer"],
    lines: [
      { speaker: "wanderer", text: "There's a sect on the third moon that disagrees with your last paper." },
      { speaker: "scholar", text: "Take me there. I want to argue in person." },
    ],
    approachChoices: [
      { label: "Approve a research-trip side mission.", bondDelta: 5, consequence: "Side-mission unlocks for next cycle." },
      { label: "Listen.", bondDelta: 1, consequence: "They schedule it themselves." },
      { label: "Veto the trip.", bondDelta: -3, consequence: "Both disappointed." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "scholar_x_wanderer_bar_02",
    subzone: "bar",
    participants: ["scholar", "wanderer"],
    lines: [
      { speaker: "scholar", text: "Tell me a place you returned to." },
      { speaker: "wanderer", text: "I don't return. I orbit." },
    ],
    approachChoices: [
      { label: "Push them to name one.", bondDelta: 4, consequence: "Wanderer admits one. Scholar archives it." },
      { label: "Let it be.", bondDelta: 1, consequence: "Mood is wistful." },
      { label: "Argue the metaphor.", bondDelta: -2, consequence: "Both retreat." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "scholar_x_jester_bar_01",
    subzone: "bar",
    participants: ["scholar", "jester"],
    lines: [
      { speaker: "jester", text: "What's the difference between a footnote and a punchline?" },
      { speaker: "scholar", text: "Pacing." },
    ],
    approachChoices: [
      { label: "Buy them both a round.", bondDelta: 4, consequence: "Banter escalates productively." },
      { label: "Watch.", bondDelta: 1, consequence: "They keep at it." },
      { label: "Ask them to be serious.", bondDelta: -3, consequence: "Both wilt." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "scholar_x_prodigal_alcove_01",
    subzone: "alcove",
    participants: ["scholar", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "I read the paper you wrote about people who leave." },
      { speaker: "scholar", text: "It was cruel. I didn't know that until you read it." },
    ],
    approachChoices: [
      { label: "Encourage a retraction.", bondDelta: 5, consequence: "Scholar rewrites; Prodigal moved." },
      { label: "Witness.", bondDelta: 3, consequence: "Both lean into the moment." },
      { label: "Defend the original paper.", bondDelta: -4, consequence: "Prodigal withdraws; Scholar isolated." },
    ],
    eavesdropDelta: 3,
  },

  {
    id: "revenant_x_oracle_alcove_01",
    subzone: "alcove",
    participants: ["revenant", "oracle"],
    lines: [
      { speaker: "oracle", text: "You died in three of my dreams before you ever did." },
      { speaker: "revenant", text: "Useful. Next time write me a warning." },
    ],
    approachChoices: [
      { label: "Take both to next mission as a survival pair.", bondDelta: 5, consequence: "+5 mission survival next deploy." },
      { label: "Listen.", bondDelta: 2, consequence: "They confer privately." },
      { label: "Dismiss the vision.", bondDelta: -3, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_oracle_alcove_02",
    subzone: "alcove",
    participants: ["revenant", "oracle"],
    lines: [
      { speaker: "revenant", text: "Tell me what I forgot when I came back." },
      { speaker: "oracle", text: "The colour of a hallway. A dog's name. The argument you were winning." },
    ],
    approachChoices: [
      { label: "Help them recover the fragments.", bondDelta: 6, consequence: "Memory-recovery side scene unlocks." },
      { label: "Witness in silence.", bondDelta: 3, consequence: "Mood is reverent." },
      { label: "Tell the Revenant to let it go.", bondDelta: -4, consequence: "Revenant deflates." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_wanderer_long_table_01",
    subzone: "long_table",
    participants: ["revenant", "wanderer"],
    lines: [
      { speaker: "wanderer", text: "Show me the road you died on. I'll walk it with you." },
      { speaker: "revenant", text: "It's not a road anymore. They built a factory." },
    ],
    approachChoices: [
      { label: "Authorize the visit anyway.", bondDelta: 5, consequence: "Closure side mission unlocks." },
      { label: "Sit with them.", bondDelta: 2, consequence: "Both quiet." },
      { label: "Suggest they let it go.", bondDelta: -3, consequence: "Both withdraw." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "revenant_x_wanderer_long_table_02",
    subzone: "long_table",
    participants: ["revenant", "wanderer"],
    lines: [
      { speaker: "revenant", text: "I have unfinished business in eleven sectors." },
      { speaker: "wanderer", text: "I have nothing finished anywhere. Pick one. We'll go." },
    ],
    approachChoices: [
      { label: "Pick the sector with the highest reward.", bondDelta: 4, consequence: "Practical bond." },
      { label: "Let them pick.", bondDelta: 3, consequence: "Mutual respect." },
      { label: "Veto the trip.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "revenant_x_heretic_bar_01",
    subzone: "bar",
    participants: ["revenant", "heretic"],
    lines: [
      { speaker: "heretic", text: "Was the cause you died for worth it?" },
      { speaker: "revenant", text: "It changed names twice while I was gone. I'll let you know." },
    ],
    approachChoices: [
      { label: "Help them research what the Cause is now.", bondDelta: 5, consequence: "Loredex pull unlocks next visit." },
      { label: "Listen.", bondDelta: 2, consequence: "They drink in silence." },
      { label: "Refuse to engage.", bondDelta: -2, consequence: "Both retreat." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "revenant_x_heretic_bar_02",
    subzone: "bar",
    participants: ["revenant", "heretic"],
    lines: [
      { speaker: "revenant", text: "Tell me a heresy I haven't heard." },
      { speaker: "heretic", text: "There's a good chance the Cause was always the heresy. We just got famous." },
    ],
    approachChoices: [
      { label: "Endorse a public counter-text.", bondDelta: 4, consequence: "Heretic emboldened." },
      { label: "Watch.", bondDelta: 1, consequence: "They drink." },
      { label: "Forbid the topic.", bondDelta: -3, consequence: "Both sullen." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "revenant_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["revenant", "sentinel"],
    lines: [
      { speaker: "sentinel", text: "You were on watch when you died." },
      { speaker: "revenant", text: "I was. The watch held. Until it didn't." },
    ],
    approachChoices: [
      { label: "Promise to relieve them when needed.", bondDelta: 5, consequence: "Both bonded; loyalty +3." },
      { label: "Bear witness.", bondDelta: 2, consequence: "Quiet camaraderie." },
      { label: "Move on.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_sentinel_long_table_02",
    subzone: "long_table",
    participants: ["revenant", "sentinel"],
    lines: [
      { speaker: "revenant", text: "Take the next watch I would have stood." },
      { speaker: "sentinel", text: "Acknowledged. I'll log you on the post." },
    ],
    approachChoices: [
      { label: "Sign the log yourself.", bondDelta: 6, consequence: "Both bonded permanently." },
      { label: "Stay back.", bondDelta: 2, consequence: "Mood is solemn." },
      { label: "Reassign the post.", bondDelta: -5, consequence: "Both wounded; oath broken." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_prodigal_alcove_01",
    subzone: "alcove",
    participants: ["revenant", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "I left. You died. I came back. You came back." },
      { speaker: "revenant", text: "We're both ghosts of the same kind." },
    ],
    approachChoices: [
      { label: "Affirm the kinship.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Distinguish the two.", bondDelta: -3, consequence: "Both withdraw." },
    ],
    eavesdropDelta: 3,
  },

  {
    id: "artisan_x_oracle_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "oracle"],
    lines: [
      { speaker: "oracle", text: "I dreamt the thing you're going to make. It worked." },
      { speaker: "artisan", text: "Then I have permission to fail at it twice first." },
    ],
    approachChoices: [
      { label: "Fund the prototypes.", bondDelta: 5, consequence: "Crafting bonus next cycle." },
      { label: "Watch.", bondDelta: 1, consequence: "They start sketching." },
      { label: "Refuse the funding.", bondDelta: -3, consequence: "Both disappointed." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "artisan_x_wanderer_bar_01",
    subzone: "bar",
    participants: ["artisan", "wanderer"],
    lines: [
      { speaker: "wanderer", text: "Make me something I can carry without thinking about it." },
      { speaker: "artisan", text: "I'll make it heavy. So you remember." },
    ],
    approachChoices: [
      { label: "Approve.", bondDelta: 3, consequence: "An artifact gift exchanges hands." },
      { label: "Watch.", bondDelta: 1, consequence: "They negotiate." },
      { label: "Tell them to be practical.", bondDelta: -3, consequence: "Mood sours." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_jester_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "jester"],
    lines: [
      { speaker: "jester", text: "Build me a prop that breaks on impact." },
      { speaker: "artisan", text: "Tell me the joke first. I'll engineer the impact for the punchline." },
    ],
    approachChoices: [
      { label: "Sit through the rehearsal.", bondDelta: 4, consequence: "Both bond + 2; show planned." },
      { label: "Listen.", bondDelta: 1, consequence: "They sketch." },
      { label: "Mock the project.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_jester_long_table_02",
    subzone: "long_table",
    participants: ["artisan", "jester"],
    lines: [
      { speaker: "artisan", text: "I won't make a fart machine." },
      { speaker: "jester", text: "Two." },
    ],
    approachChoices: [
      { label: "Authorize one prototype.", bondDelta: 3, consequence: "Crew morale spikes briefly." },
      { label: "Watch.", bondDelta: 1, consequence: "Negotiation continues." },
      { label: "Veto.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_sentinel_bar_01",
    subzone: "bar",
    participants: ["artisan", "sentinel"],
    lines: [
      { speaker: "sentinel", text: "The lock you made held in three breach attempts." },
      { speaker: "artisan", text: "It was supposed to hold in five. I'll redesign." },
    ],
    approachChoices: [
      { label: "Approve the redesign.", bondDelta: 5, consequence: "Lock-quality bonus next defense." },
      { label: "Watch.", bondDelta: 1, consequence: "They draft together." },
      { label: "Move on.", bondDelta: -2, consequence: "Both deflated." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_prodigal_alcove_01",
    subzone: "alcove",
    participants: ["artisan", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "You finished the project I abandoned." },
      { speaker: "artisan", text: "I left a notch where you would have signed it." },
    ],
    approachChoices: [
      { label: "Encourage them to sign now.", bondDelta: 6, consequence: "Both bond +5; Prodigal grounded." },
      { label: "Witness.", bondDelta: 3, consequence: "Quiet sit." },
      { label: "Tell the Prodigal to stop revisiting.", bondDelta: -4, consequence: "Prodigal retreats." },
    ],
    eavesdropDelta: 3,
  },

  {
    id: "oracle_x_heretic_alcove_01",
    subzone: "alcove",
    participants: ["oracle", "heretic"],
    lines: [
      { speaker: "heretic", text: "Tell me which of the orthodoxies the dream forbids." },
      { speaker: "oracle", text: "All of them. In rotation. Pick one for the season." },
    ],
    approachChoices: [
      { label: "Endorse a curated rotation.", bondDelta: 4, consequence: "Heretic publishes a manifesto draft." },
      { label: "Listen.", bondDelta: 1, consequence: "They confer." },
      { label: "Forbid the topic.", bondDelta: -3, consequence: "Mood drops." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "oracle_x_jester_bar_01",
    subzone: "bar",
    participants: ["oracle", "jester"],
    lines: [
      { speaker: "jester", text: "Predict the next joke I'm going to tell." },
      { speaker: "oracle", text: "It's about a Sentinel and a closed door. It almost lands." },
    ],
    approachChoices: [
      { label: "Demand the joke.", bondDelta: 3, consequence: "Jester delivers; almost lands as predicted." },
      { label: "Watch.", bondDelta: 1, consequence: "They keep at it." },
      { label: "Stop the bit.", bondDelta: -2, consequence: "Both wilt." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "oracle_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["oracle", "sentinel"],
    lines: [
      { speaker: "oracle", text: "The breach is in the next watch. Eastern airlock." },
      { speaker: "sentinel", text: "Acknowledged. I'm doubling the shift." },
    ],
    approachChoices: [
      { label: "Authorize the doubled shift + reinforcements.", bondDelta: 5, consequence: "Defense bonus next ambient event." },
      { label: "Trust their handling.", bondDelta: 2, consequence: "Sentinel doubles; Oracle archives." },
      { label: "Dismiss the prediction.", bondDelta: -5, consequence: "Future ambient event hits harder." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "oracle_x_martyr_alcove_01",
    subzone: "alcove",
    participants: ["oracle", "martyr"],
    lines: [
      { speaker: "oracle", text: "I dreamt your funeral. The food was good." },
      { speaker: "martyr", text: "I'll bring the recipe. Just in case." },
    ],
    approachChoices: [
      { label: "Veto Martyr deployment for the next mission.", bondDelta: 5, consequence: "Bench the Martyr; both moved." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Dismiss the dream.", bondDelta: -5, consequence: "If Martyr deploys next, mourning amplifies on death." },
    ],
    eavesdropDelta: 3,
  },

  {
    id: "wanderer_x_heretic_bar_01",
    subzone: "bar",
    participants: ["wanderer", "heretic"],
    lines: [
      { speaker: "heretic", text: "There's no orthodoxy that survives a road trip." },
      { speaker: "wanderer", text: "There's also no road trip that survives an orthodoxy." },
    ],
    approachChoices: [
      { label: "Plan a recon mission together.", bondDelta: 4, consequence: "A side mission unlocks next cycle." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Tell them to stay aboard.", bondDelta: -3, consequence: "Both restless." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "wanderer_x_martyr_long_table_01",
    subzone: "long_table",
    participants: ["wanderer", "martyr"],
    lines: [
      { speaker: "martyr", text: "I'll take your road for you. Eat tonight." },
      { speaker: "wanderer", text: "You can't take a road for someone. You can only walk beside them." },
    ],
    approachChoices: [
      { label: "Pair them on the next deployment.", bondDelta: 5, consequence: "Mutual survival bonus next mission." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet conversation." },
      { label: "Reassign the Martyr alone.", bondDelta: -4, consequence: "Wanderer disappointed; Martyr emboldened." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "wanderer_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["wanderer", "sentinel"],
    lines: [
      { speaker: "wanderer", text: "Stand the post in motion. It's the same post." },
      { speaker: "sentinel", text: "It's not. The door doesn't move." },
    ],
    approachChoices: [
      { label: "Endorse a perimeter sweep duty.", bondDelta: 4, consequence: "Both gain a hybrid role." },
      { label: "Listen.", bondDelta: 1, consequence: "They negotiate." },
      { label: "Tell them to stay in their lanes.", bondDelta: -2, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "wanderer_x_jester_bar_01",
    subzone: "bar",
    participants: ["wanderer", "jester"],
    lines: [
      { speaker: "jester", text: "Tell me a road that ends in a punchline." },
      { speaker: "wanderer", text: "The one where I get home. Nobody's there. Big laugh." },
    ],
    approachChoices: [
      { label: "Sit and listen.", bondDelta: 4, consequence: "Both seen." },
      { label: "Tip them.", bondDelta: 2, consequence: "Both warmed." },
      { label: "Walk past.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 2,
  },

  {
    id: "martyr_x_heretic_alcove_01",
    subzone: "alcove",
    participants: ["martyr", "heretic"],
    lines: [
      { speaker: "heretic", text: "Stop volunteering for the worst job." },
      { speaker: "martyr", text: "You stop arguing with the worst people." },
    ],
    approachChoices: [
      { label: "Endorse both their lines.", bondDelta: 4, consequence: "Mutual respect; hybrid scene later." },
      { label: "Watch.", bondDelta: 1, consequence: "Both quiet." },
      { label: "Order both to stand down.", bondDelta: -4, consequence: "Both refuse." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "martyr_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["martyr", "sentinel"],
    lines: [
      { speaker: "sentinel", text: "If you take a hit on my watch, the watch failed." },
      { speaker: "martyr", text: "Then we'll write a better procedure." },
    ],
    approachChoices: [
      { label: "Endorse the procedure update.", bondDelta: 5, consequence: "Watch SOP improves; both bond +3." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Tell them both to stop blaming themselves.", bondDelta: -2, consequence: "Both deflect." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "martyr_x_prodigal_alcove_01",
    subzone: "alcove",
    participants: ["martyr", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "I came back. You wanted to leave once." },
      { speaker: "martyr", text: "I never figured out how." },
    ],
    approachChoices: [
      { label: "Tell the Martyr it's allowed.", bondDelta: 6, consequence: "Both bond +5; Martyr quietly affected." },
      { label: "Witness.", bondDelta: 3, consequence: "Mutual stillness." },
      { label: "Tell the Prodigal not to encourage it.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },

  {
    id: "heretic_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["heretic", "sentinel"],
    lines: [
      { speaker: "sentinel", text: "Your tracts make the perimeter harder to defend." },
      { speaker: "heretic", text: "Your perimeter makes my tracts more necessary." },
    ],
    approachChoices: [
      { label: "Endorse mutual reinforcement.", bondDelta: 4, consequence: "Both bond +2; defense + dissent unify." },
      { label: "Listen.", bondDelta: 1, consequence: "They argue politely." },
      { label: "Suppress the tracts.", bondDelta: -5, consequence: "Heretic furious; Sentinel uneasy." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "heretic_x_prodigal_bar_01",
    subzone: "bar",
    participants: ["heretic", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "I left because the orthodoxy made me lonely." },
      { speaker: "heretic", text: "Welcome back. The orthodoxy is worse now." },
    ],
    approachChoices: [
      { label: "Toast the return.", bondDelta: 4, consequence: "Both bond + 3." },
      { label: "Listen.", bondDelta: 1, consequence: "They drink." },
      { label: "Dismiss the topic.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 2,
  },

  {
    id: "jester_x_sentinel_bar_01",
    subzone: "bar",
    participants: ["jester", "sentinel"],
    lines: [
      { speaker: "jester", text: "Knock knock." },
      { speaker: "sentinel", text: "State your business." },
      { speaker: "jester", text: "That was the joke." },
    ],
    approachChoices: [
      { label: "Laugh.", bondDelta: 3, consequence: "Sentinel cracks a small smile." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Order Sentinel back to post.", bondDelta: -3, consequence: "Mood sours." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "jester_x_prodigal_bar_01",
    subzone: "bar",
    participants: ["jester", "prodigal"],
    lines: [
      { speaker: "jester", text: "What do you call someone who walks back into the room?" },
      { speaker: "prodigal", text: "A punchline?" },
      { speaker: "jester", text: "A relief." },
    ],
    approachChoices: [
      { label: "Mark the moment.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Sit down.", bondDelta: 2, consequence: "Quiet drink." },
      { label: "Walk past.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 2,
  },

  {
    id: "sentinel_x_prodigal_long_table_01",
    subzone: "long_table",
    participants: ["sentinel", "prodigal"],
    lines: [
      { speaker: "prodigal", text: "Stand the watch with me. I haven't done one in years." },
      { speaker: "sentinel", text: "I'll take the first half. You take the door." },
    ],
    approachChoices: [
      { label: "Authorize a paired watch.", bondDelta: 5, consequence: "Both bond +3; defense bonus next event." },
      { label: "Endorse with a smile.", bondDelta: 2, consequence: "They proceed." },
      { label: "Reassign the Prodigal.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },

  /* ═══ Apprentice ↔ Recruited NPC — expanded pool ═══ */
  {
    id: "zealot_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "locke"],
    lines: [
      { speaker: "zealot", text: "Higher law than your bench, Adjudicator." },
      { speaker: "locke", text: "Cite it. I'll add the appellate brief." },
    ],
    approachChoices: [
      { label: "Endorse a joint hearing.", bondDelta: 5, consequence: "Both bond +3; legal-faith axis stabilizes." },
      { label: "Listen.", bondDelta: 1, consequence: "They argue formally." },
      { label: "Side with Locke openly.", bondDelta: -3, consequence: "Zealot wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_locke_long_table_02",
    subzone: "long_table",
    participants: ["zealot", "locke"],
    lines: [
      { speaker: "locke", text: "Your sermon last cycle quoted my dissent." },
      { speaker: "zealot", text: "I quoted the truth. You wrote it. Same thing, briefly." },
    ],
    approachChoices: [
      { label: "Reprint the quote in the next sermon.", bondDelta: 4, consequence: "Locke surprised; Zealot pleased." },
      { label: "Stay neutral.", bondDelta: 1, consequence: "Mutual respect." },
      { label: "Forbid quoting.", bondDelta: -3, consequence: "Both deflated." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["zealot", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "You sing to a Cause. I sing to the dead." },
      { speaker: "zealot", text: "We're both keeping someone alive." },
    ],
    approachChoices: [
      { label: "Authorize a joint memorial service.", bondDelta: 5, consequence: "Both bond +4; loredex unlock next cycle." },
      { label: "Witness in silence.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Discourage the comparison.", bondDelta: -3, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "zealot_x_wraith_calder_alcove_02",
    subzone: "alcove",
    participants: ["zealot", "wraith_calder"],
    lines: [
      { speaker: "zealot", text: "Teach me your daily-names ceremony." },
      { speaker: "wraith_calder", text: "Bring a candle. Don't bring witnesses you can't trust to be silent." },
    ],
    approachChoices: [
      { label: "Attend.", bondDelta: 5, consequence: "Both bond +4; loredex unlock." },
      { label: "Send the Zealot alone.", bondDelta: 2, consequence: "They proceed." },
      { label: "Forbid attendance.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "zealot_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["zealot", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "The Cause is the team in the room with you. That's it." },
      { speaker: "zealot", text: "It's a smaller theology than I'm used to. I like it." },
    ],
    approachChoices: [
      { label: "Order the next round.", bondDelta: 4, consequence: "Both bond +2." },
      { label: "Listen.", bondDelta: 1, consequence: "Quiet drink." },
      { label: "Argue the metaphysics.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "zealot_x_jericho_jones_bar_02",
    subzone: "bar",
    participants: ["zealot", "jericho_jones"],
    lines: [
      { speaker: "zealot", text: "Iron Cadre standard or Cause banner — which do we fly first?" },
      { speaker: "jericho_jones", text: "Both. They look better stitched together." },
    ],
    approachChoices: [
      { label: "Authorize the banner.", bondDelta: 4, consequence: "Crew morale +2 next event." },
      { label: "Watch.", bondDelta: 1, consequence: "Mutual nod." },
      { label: "Pick one only.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "ghost_x_locke_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "locke"],
    lines: [
      { speaker: "locke", text: "I'd like you in the witness register." },
      { speaker: "ghost", text: "Let me think about it for three cycles." },
    ],
    approachChoices: [
      { label: "Encourage the registration.", bondDelta: 4, consequence: "Locke pleased; Ghost cautious." },
      { label: "Stay out of it.", bondDelta: 1, consequence: "Negotiation continues." },
      { label: "Veto the registration.", bondDelta: -3, consequence: "Locke disappointed." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_locke_alcove_02",
    subzone: "alcove",
    participants: ["ghost", "locke"],
    lines: [
      { speaker: "ghost", text: "The audit you ran missed me on purpose." },
      { speaker: "locke", text: "Yes. I left you a margin." },
    ],
    approachChoices: [
      { label: "Acknowledge the kindness.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Ignore it.", bondDelta: 1, consequence: "They confer." },
      { label: "Demand an audit correction.", bondDelta: -4, consequence: "Locke uncomfortable; Ghost retreats." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "ghost_x_vex_solene_bar_01",
    subzone: "bar",
    participants: ["ghost", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "I'd put you on stage. You'd disappear into the lighting rig." },
      { speaker: "ghost", text: "I'd have a perfect view." },
    ],
    approachChoices: [
      { label: "Buy them both a drink.", bondDelta: 3, consequence: "Banter softens." },
      { label: "Watch.", bondDelta: 1, consequence: "Negotiation." },
      { label: "Tell Vex to stop trying to recruit them.", bondDelta: -3, consequence: "Both wilt." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "ghost_x_vex_solene_bar_02",
    subzone: "bar",
    participants: ["ghost", "vex_solene"],
    lines: [
      { speaker: "ghost", text: "You sing very loud." },
      { speaker: "vex_solene", text: "It hides where I'm looking." },
    ],
    approachChoices: [
      { label: "Compliment the technique.", bondDelta: 4, consequence: "Both bond + 3." },
      { label: "Listen.", bondDelta: 1, consequence: "They drink." },
      { label: "Move on.", bondDelta: -2, consequence: "Mood deflates." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_wraith_calder_alcove_02",
    subzone: "alcove",
    participants: ["ghost", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "Some of the dead notice when you're in the room." },
      { speaker: "ghost", text: "I notice when they notice." },
    ],
    approachChoices: [
      { label: "Trust the channel.", bondDelta: 4, consequence: "Both bond +3; loredex unlock." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Refuse the topic.", bondDelta: -3, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "scholar_x_wraith_calder_long_table_01",
    subzone: "long_table",
    participants: ["scholar", "wraith_calder"],
    lines: [
      { speaker: "scholar", text: "Your daily-names list has eleven duplicates." },
      { speaker: "wraith_calder", text: "Eleven names that died eleven times." },
    ],
    approachChoices: [
      { label: "Endorse a memorial annotation.", bondDelta: 5, consequence: "Loredex obituary thread unlocks." },
      { label: "Listen.", bondDelta: 2, consequence: "Both proceed." },
      { label: "Insist on de-duplication.", bondDelta: -5, consequence: "Wraith wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "scholar_x_akai_shi_alcove_01",
    subzone: "alcove",
    participants: ["scholar", "akai_shi"],
    lines: [
      { speaker: "akai_shi", text: "The thought-virus you researched is in three of my old papers." },
      { speaker: "scholar", text: "I cited you in two. The third was prudent to omit." },
    ],
    approachChoices: [
      { label: "Authorize a careful collaboration.", bondDelta: 5, consequence: "Loredex pull next cycle." },
      { label: "Witness.", bondDelta: 1, consequence: "They confer." },
      { label: "Forbid the topic.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_jericho_jones_long_table_01",
    subzone: "long_table",
    participants: ["revenant", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "I owe a debt to a name on your unfinished list." },
      { speaker: "revenant", text: "Then we go together." },
    ],
    approachChoices: [
      { label: "Authorize the deployment.", bondDelta: 5, consequence: "Closure side mission unlocks." },
      { label: "Watch.", bondDelta: 2, consequence: "They plan." },
      { label: "Reassign Jericho.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "revenant_x_jericho_jones_long_table_02",
    subzone: "long_table",
    participants: ["revenant", "jericho_jones"],
    lines: [
      { speaker: "revenant", text: "Tell me the team you fought beside before." },
      { speaker: "jericho_jones", text: "Three cadres. Two are dust. One's still in the room." },
    ],
    approachChoices: [
      { label: "Toast the third.", bondDelta: 4, consequence: "Both bond +3." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Move on.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "revenant_x_locke_alcove_01",
    subzone: "alcove",
    participants: ["revenant", "locke"],
    lines: [
      { speaker: "locke", text: "Your case file is open. I can close it now if you tell me what happened." },
      { speaker: "revenant", text: "I don't remember. I can guess in three colours." },
    ],
    approachChoices: [
      { label: "Help reconstruct the case.", bondDelta: 5, consequence: "Closure obtained; bond +4." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Tell Locke to drop the case.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "artisan_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["artisan", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "Make me an iron-cadre standard that won't fade in the sun." },
      { speaker: "artisan", text: "It'll fade. I'll make the fading look like patina." },
    ],
    approachChoices: [
      { label: "Approve.", bondDelta: 4, consequence: "Standard adopted; cadre morale +1." },
      { label: "Watch.", bondDelta: 1, consequence: "Negotiation continues." },
      { label: "Cancel the commission.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_jericho_jones_bar_02",
    subzone: "bar",
    participants: ["artisan", "jericho_jones"],
    lines: [
      { speaker: "artisan", text: "Your last shield's cracked. I want to keep the crack." },
      { speaker: "jericho_jones", text: "Then keep it. The story's in the crack." },
    ],
    approachChoices: [
      { label: "Endorse the keep-the-crack approach.", bondDelta: 4, consequence: "Both bond +3; commission complete." },
      { label: "Watch.", bondDelta: 1, consequence: "They proceed." },
      { label: "Order a fresh shield.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["artisan", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "Make me a memorial that doesn't look like grief." },
      { speaker: "artisan", text: "It can look like a chair. Place a name under it." },
    ],
    approachChoices: [
      { label: "Approve the chair.", bondDelta: 5, consequence: "Memorial commission complete; loredex unlock." },
      { label: "Watch.", bondDelta: 2, consequence: "They sketch." },
      { label: "Suggest a more conventional design.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "oracle_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["oracle", "wraith_calder"],
    lines: [
      { speaker: "oracle", text: "There's a new name coming for your list." },
      { speaker: "wraith_calder", text: "Whose?" },
      { speaker: "oracle", text: "I'd rather you didn't ask." },
    ],
    approachChoices: [
      { label: "Demand the name.", bondDelta: -3, consequence: "Future deploy mourning amplified if it comes true." },
      { label: "Trust the silence.", bondDelta: 5, consequence: "Both bond +4; protective bonus." },
      { label: "Walk past.", bondDelta: -2, consequence: "Mood deflates." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "oracle_x_wraith_calder_alcove_02",
    subzone: "alcove",
    participants: ["oracle", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "Sing the dream-names with me. They sound the same." },
      { speaker: "oracle", text: "They are the same. Your list is mine, four cycles ahead." },
    ],
    approachChoices: [
      { label: "Sit and listen.", bondDelta: 5, consequence: "Both bond +5; loredex unlock." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Forbid the comparison.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "oracle_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["oracle", "locke"],
    lines: [
      { speaker: "oracle", text: "The next case has a witness who hasn't spoken yet." },
      { speaker: "locke", text: "Send me their hour. I'll keep my chambers open." },
    ],
    approachChoices: [
      { label: "Authorize the appointment.", bondDelta: 4, consequence: "Case-resolution bonus next cycle." },
      { label: "Listen.", bondDelta: 1, consequence: "They proceed." },
      { label: "Dismiss the lead.", bondDelta: -3, consequence: "Locke disappointed." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "oracle_x_akai_shi_alcove_01",
    subzone: "alcove",
    participants: ["oracle", "akai_shi"],
    lines: [
      { speaker: "akai_shi", text: "Your dreams travel. Mine catch yours mid-flight." },
      { speaker: "oracle", text: "Then I'll dream a quieter way." },
    ],
    approachChoices: [
      { label: "Endorse a shared dream-channel.", bondDelta: 5, consequence: "Both bond +4; thought-virus precaution unlocked." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Forbid contact.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "wanderer_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["wanderer", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "We could use a scout. Permanent rotation." },
      { speaker: "wanderer", text: "I prefer to be the rotation." },
    ],
    approachChoices: [
      { label: "Authorize a scout-circuit role.", bondDelta: 4, consequence: "Wanderer integrated; cadre +1 morale." },
      { label: "Watch.", bondDelta: 1, consequence: "Negotiation." },
      { label: "Reassign Wanderer.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "martyr_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["martyr", "locke"],
    lines: [
      { speaker: "locke", text: "You can't take the consequence for someone else's case." },
      { speaker: "martyr", text: "I'll co-sign the brief, then." },
    ],
    approachChoices: [
      { label: "Endorse the co-signature.", bondDelta: 4, consequence: "Both bond +3; legal-shield bonus." },
      { label: "Listen.", bondDelta: 1, consequence: "Quiet." },
      { label: "Refuse the co-sign.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "martyr_x_jericho_jones_alcove_01",
    subzone: "alcove",
    participants: ["martyr", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "If you go down, the cadre stalls. We need you whole." },
      { speaker: "martyr", text: "Then I'll go down last." },
    ],
    approachChoices: [
      { label: "Order a rear-guard rotation.", bondDelta: 5, consequence: "Both bond +4; deploy bonus." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Tell the Martyr to stop angling.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "martyr_x_vex_solene_alcove_01",
    subzone: "alcove",
    participants: ["martyr", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "Don't give yourself for the show. I can rewrite the show." },
      { speaker: "martyr", text: "Then I'll be in the audience. For once." },
    ],
    approachChoices: [
      { label: "Comp the front row.", bondDelta: 5, consequence: "Both bond +4; morale event triggers." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Tell the Martyr to skip the show.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "heretic_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["heretic", "locke"],
    lines: [
      { speaker: "heretic", text: "Your last ruling was technically correct. Politically obscene." },
      { speaker: "locke", text: "Bring me the obscenity in writing. I'll cite your tract in my dissent." },
    ],
    approachChoices: [
      { label: "Co-author the dissent.", bondDelta: 5, consequence: "Both bond +4; legal-faith axis develops." },
      { label: "Watch.", bondDelta: 1, consequence: "They argue formally." },
      { label: "Suppress the tract.", bondDelta: -5, consequence: "Heretic furious." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "heretic_x_wraith_calder_bar_01",
    subzone: "bar",
    participants: ["heretic", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "Death has its own orthodoxy. I sing past it." },
      { speaker: "heretic", text: "Then I'll heckle the choir." },
    ],
    approachChoices: [
      { label: "Endorse a counter-liturgy collab.", bondDelta: 4, consequence: "Both bond +3." },
      { label: "Listen.", bondDelta: 1, consequence: "Quiet." },
      { label: "Forbid mockery.", bondDelta: -3, consequence: "Heretic wilts." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "heretic_x_vex_solene_bar_01",
    subzone: "bar",
    participants: ["heretic", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "Sing my dissent on stage. I'll arrange it for three voices." },
      { speaker: "heretic", text: "Make it five. The orthodoxy can't keep up with five." },
    ],
    approachChoices: [
      { label: "Approve the production.", bondDelta: 5, consequence: "Public dissent unlocks; both bond +4." },
      { label: "Watch.", bondDelta: 1, consequence: "Negotiation." },
      { label: "Veto.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "jester_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["jester", "wraith_calder"],
    lines: [
      { speaker: "jester", text: "I have a joke about your list. Maybe in five cycles." },
      { speaker: "wraith_calder", text: "Tell me at the cycle's end. The list will accept it." },
    ],
    approachChoices: [
      { label: "Mark the date.", bondDelta: 4, consequence: "Both bond +3." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Forbid death humour.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "jester_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["jester", "locke"],
    lines: [
      { speaker: "jester", text: "Your gavel sound is the only laugh track that lands." },
      { speaker: "locke", text: "Then I'll bang it twice next time." },
    ],
    approachChoices: [
      { label: "Encourage the bit.", bondDelta: 3, consequence: "Both bond +2." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Order decorum.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "sentinel_x_jericho_jones_long_table_01",
    subzone: "long_table",
    participants: ["sentinel", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "Your perimeter held under live fire. I noticed." },
      { speaker: "sentinel", text: "I noticed you noticing." },
    ],
    approachChoices: [
      { label: "Endorse a joint perimeter SOP.", bondDelta: 5, consequence: "Defense bonus next event; both bond +4." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Move on.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "sentinel_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["sentinel", "locke"],
    lines: [
      { speaker: "locke", text: "Your post-log is admissible." },
      { speaker: "sentinel", text: "Then it'll be the truth." },
    ],
    approachChoices: [
      { label: "Endorse the log as testimony.", bondDelta: 4, consequence: "Legal-watch axis; both bond +3." },
      { label: "Listen.", bondDelta: 1, consequence: "They confer." },
      { label: "Question the log.", bondDelta: -4, consequence: "Sentinel wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "sentinel_x_wraith_calder_long_table_01",
    subzone: "long_table",
    participants: ["sentinel", "wraith_calder"],
    lines: [
      { speaker: "sentinel", text: "If you sing the watch I miss, sing it loud." },
      { speaker: "wraith_calder", text: "Loud enough that you'll hear it back." },
    ],
    approachChoices: [
      { label: "Authorize the post-honour ceremony.", bondDelta: 5, consequence: "Both bond +4; loredex unlock." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Forbid the ceremony.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "prodigal_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["prodigal", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "The cadre lost a name when you walked. We've kept the seat." },
      { speaker: "prodigal", text: "Then I'll sit in it tonight." },
    ],
    approachChoices: [
      { label: "Pour the round.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Watch.", bondDelta: 2, consequence: "Quiet drink." },
      { label: "Tell the Prodigal it's not their seat.", bondDelta: -5, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "prodigal_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["prodigal", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "Your old name's on my list." },
      { speaker: "prodigal", text: "I never said that name aloud." },
    ],
    approachChoices: [
      { label: "Witness the moment.", bondDelta: 5, consequence: "Both bond +4; loredex unlock." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Demand explanation.", bondDelta: -3, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "prodigal_x_vex_solene_bar_01",
    subzone: "bar",
    participants: ["prodigal", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "I had a song about your absence. I cut it last cycle." },
      { speaker: "prodigal", text: "Sing me what was left." },
    ],
    approachChoices: [
      { label: "Comp the encore.", bondDelta: 4, consequence: "Both bond +3; morale event." },
      { label: "Listen.", bondDelta: 1, consequence: "Quiet." },
      { label: "Skip the song.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "prodigal_x_akai_shi_alcove_01",
    subzone: "alcove",
    participants: ["prodigal", "akai_shi"],
    lines: [
      { speaker: "akai_shi", text: "Where did you go, after." },
      { speaker: "prodigal", text: "Three cities. None of them remembered me." },
    ],
    approachChoices: [
      { label: "Authorize a return tour with Akai.", bondDelta: 5, consequence: "Loredex unlocks; both bond +4." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Forbid contact.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },

  /* ═══ Triads / faction-tension scenes ═══ */
  {
    id: "triad_zealot_heretic_scholar_long_table_01",
    subzone: "long_table",
    participants: ["zealot", "heretic", "scholar"],
    lines: [
      { speaker: "zealot", text: "I'll quote scripture." },
      { speaker: "heretic", text: "I'll quote a footnote you didn't read." },
      { speaker: "scholar", text: "I'll annotate the entire conversation." },
    ],
    approachChoices: [
      { label: "Buy the next round and declare a draw.", bondDelta: 5, consequence: "All three bond + 3; debate group founded." },
      { label: "Pick a side.", bondDelta: 1, consequence: "Two-way bond gain; one withdraws." },
      { label: "Order silence.", bondDelta: -5, consequence: "All three wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "triad_ghost_scholar_oracle_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "scholar", "oracle"],
    lines: [
      { speaker: "scholar", text: "Three of us. Three different methods of seeing." },
      { speaker: "ghost", text: "Four. You missed one." },
      { speaker: "oracle", text: "Five, technically." },
    ],
    approachChoices: [
      { label: "Trust the methods.", bondDelta: 5, consequence: "Perception bonus next event; all three bond +3." },
      { label: "Listen.", bondDelta: 2, consequence: "They confer." },
      { label: "Pick one method.", bondDelta: -4, consequence: "Two retreat; one stays." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "triad_martyr_jester_revenant_long_table_01",
    subzone: "long_table",
    participants: ["martyr", "jester", "revenant"],
    lines: [
      { speaker: "jester", text: "Three of us at a long table. One pays. One dies. One comes back." },
      { speaker: "martyr", text: "Pays." },
      { speaker: "revenant", text: "Dies." },
    ],
    approachChoices: [
      { label: "Pay for all three.", bondDelta: 5, consequence: "Triad bond +4 each; morale spike." },
      { label: "Watch.", bondDelta: 2, consequence: "Quiet conversation." },
      { label: "Tell them to stop pre-eulogizing.", bondDelta: -3, consequence: "All three deflate." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "triad_vex_jericho_wanderer_bar_01",
    subzone: "bar",
    participants: ["vex_solene", "jericho_jones", "wanderer"],
    lines: [
      { speaker: "vex_solene", text: "Three roads I haven't sung." },
      { speaker: "jericho_jones", text: "Three roads I'd march." },
      { speaker: "wanderer", text: "Three roads I'm already on." },
    ],
    approachChoices: [
      { label: "Approve a joint excursion.", bondDelta: 5, consequence: "Multi-faction side mission unlocks." },
      { label: "Listen.", bondDelta: 1, consequence: "They plan." },
      { label: "Veto the excursion.", bondDelta: -4, consequence: "All three wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "triad_locke_scholar_heretic_long_table_01",
    subzone: "long_table",
    participants: ["locke", "scholar", "heretic"],
    lines: [
      { speaker: "locke", text: "Procedure first." },
      { speaker: "scholar", text: "Citation second." },
      { speaker: "heretic", text: "Outrage third. The order is wrong." },
    ],
    approachChoices: [
      { label: "Endorse the heretic's order.", bondDelta: 4, consequence: "Heretic + Scholar bond +3 each; Locke wary." },
      { label: "Endorse Locke's order.", bondDelta: 4, consequence: "Locke + Scholar bond +3 each; Heretic withdraws." },
      { label: "Force a compromise.", bondDelta: 2, consequence: "All three accept reluctantly." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "triad_wraith_revenant_oracle_alcove_01",
    subzone: "alcove",
    participants: ["wraith_calder", "revenant", "oracle"],
    lines: [
      { speaker: "wraith_calder", text: "Three voices. Three frequencies." },
      { speaker: "revenant", text: "Two of them are mine, technically." },
      { speaker: "oracle", text: "All three are sometimes." },
    ],
    approachChoices: [
      { label: "Sit and listen.", bondDelta: 6, consequence: "All three bond +5; major loredex unlock." },
      { label: "Witness.", bondDelta: 3, consequence: "Quiet sit." },
      { label: "Forbid the meeting.", bondDelta: -6, consequence: "All three withdraw permanently." },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "triad_akai_ghost_oracle_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "ghost", "oracle"],
    lines: [
      { speaker: "akai_shi", text: "Three carriers. One signal." },
      { speaker: "ghost", text: "Two signals. One carrier." },
      { speaker: "oracle", text: "We're agreeing in different metaphors." },
    ],
    approachChoices: [
      { label: "Fund the protocol they're sketching.", bondDelta: 5, consequence: "Thought-virus precaution unlocks." },
      { label: "Listen.", bondDelta: 2, consequence: "They confer." },
      { label: "Forbid the protocol.", bondDelta: -5, consequence: "All three retreat." },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "triad_vex_jester_artisan_bar_01",
    subzone: "bar",
    participants: ["vex_solene", "jester", "artisan"],
    lines: [
      { speaker: "vex_solene", text: "Production meeting. We have a stage, an idea, and no props." },
      { speaker: "jester", text: "I've got the bit." },
      { speaker: "artisan", text: "I've got the prop. It's heavy. On purpose." },
    ],
    approachChoices: [
      { label: "Greenlight.", bondDelta: 5, consequence: "Show added; morale +3 next visit." },
      { label: "Watch.", bondDelta: 1, consequence: "They plan." },
      { label: "Cut the budget.", bondDelta: -3, consequence: "All three deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "triad_jericho_sentinel_prodigal_long_table_01",
    subzone: "long_table",
    participants: ["jericho_jones", "sentinel", "prodigal"],
    lines: [
      { speaker: "jericho_jones", text: "The cadre seat's open. The watch is open. The road's open." },
      { speaker: "sentinel", text: "Take the watch." },
      { speaker: "prodigal", text: "I'll take the seat. For now." },
    ],
    approachChoices: [
      { label: "Endorse the assignment.", bondDelta: 5, consequence: "Cadre integration; all three bond +3." },
      { label: "Watch.", bondDelta: 1, consequence: "They plan." },
      { label: "Reassign all three.", bondDelta: -5, consequence: "All three wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "triad_locke_sentinel_heretic_long_table_01",
    subzone: "long_table",
    participants: ["locke", "sentinel", "heretic"],
    lines: [
      { speaker: "locke", text: "Three views of the law." },
      { speaker: "sentinel", text: "One door I'm willing to die at." },
      { speaker: "heretic", text: "One door I'm willing to break." },
    ],
    approachChoices: [
      { label: "Affirm all three roles.", bondDelta: 5, consequence: "Tri-axis cohesion; all three bond +3." },
      { label: "Pick a side.", bondDelta: 1, consequence: "Two-way bond gain." },
      { label: "Override all three.", bondDelta: -5, consequence: "All wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "triad_wraith_artisan_revenant_alcove_01",
    subzone: "alcove",
    participants: ["wraith_calder", "artisan", "revenant"],
    lines: [
      { speaker: "wraith_calder", text: "I want a memorial built by someone who's been on the list." },
      { speaker: "artisan", text: "I'll make it." },
      { speaker: "revenant", text: "I'll sit in it first." },
    ],
    approachChoices: [
      { label: "Approve the commission.", bondDelta: 6, consequence: "Memorial complete; all three bond +5." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Cancel.", bondDelta: -5, consequence: "All three wounded." },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "triad_vex_wraith_oracle_alcove_01",
    subzone: "alcove",
    participants: ["vex_solene", "wraith_calder", "oracle"],
    lines: [
      { speaker: "vex_solene", text: "I want to write the foreseen libretto." },
      { speaker: "wraith_calder", text: "I'll keep the names accurate." },
      { speaker: "oracle", text: "I'll keep the dream from drifting." },
    ],
    approachChoices: [
      { label: "Greenlight the production.", bondDelta: 5, consequence: "Major narrative event unlocks; all three bond +4." },
      { label: "Watch.", bondDelta: 2, consequence: "They plan." },
      { label: "Postpone.", bondDelta: -3, consequence: "All three withdraw." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "triad_akai_heretic_scholar_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "heretic", "scholar"],
    lines: [
      { speaker: "akai_shi", text: "The banned text is in three of my libraries." },
      { speaker: "heretic", text: "I'll make a fourth, public." },
      { speaker: "scholar", text: "I'll annotate so the fourth is defensible." },
    ],
    approachChoices: [
      { label: "Authorize the public edition.", bondDelta: 5, consequence: "Major dissent event; all three bond +4." },
      { label: "Listen.", bondDelta: 2, consequence: "They confer." },
      { label: "Forbid the publication.", bondDelta: -5, consequence: "All three retreat." },
    ],
    eavesdropDelta: 3,
  },

  /* ═══ Coverage closeout — 35 pairings to clear the ratchet ═══ */
  {
    id: "ghost_x_zealot_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "zealot"],
    lines: [
      { speaker: "zealot", text: "I'd preach to you. You wouldn't be in the room." },
      { speaker: "ghost", text: "I'd hear it twice. Once on the way in. Once on the way out." },
    ],
    approachChoices: [
      { label: "Sit at the back.", bondDelta: 4, consequence: "Both bond +3; quiet sermon." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Forbid the sermon.", bondDelta: -3, consequence: "Both wilt." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "artisan_x_zealot_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "zealot"],
    lines: [
      { speaker: "zealot", text: "Carve me a sigil. Make it heavy enough to mean something." },
      { speaker: "artisan", text: "I can make it heavy. Meaning is your axis, not mine." },
    ],
    approachChoices: [
      { label: "Approve the commission.", bondDelta: 4, consequence: "Both bond +3; sigil enters the chapel." },
      { label: "Watch.", bondDelta: 1, consequence: "They negotiate." },
      { label: "Veto.", bondDelta: -3, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "wanderer_x_zealot_bar_01",
    subzone: "bar",
    participants: ["wanderer", "zealot"],
    lines: [
      { speaker: "zealot", text: "There's a Cause for every road." },
      { speaker: "wanderer", text: "Most roads I've walked, the Cause was already gone." },
    ],
    approachChoices: [
      { label: "Suggest a pilgrimage.", bondDelta: 4, consequence: "Side mission unlocks; both bond +3." },
      { label: "Listen.", bondDelta: 1, consequence: "They drink." },
      { label: "Tell them both to settle.", bondDelta: -3, consequence: "Both wilt." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "sentinel_x_zealot_long_table_01",
    subzone: "long_table",
    participants: ["sentinel", "zealot"],
    lines: [
      { speaker: "sentinel", text: "I stand the chapel watch when you're inside." },
      { speaker: "zealot", text: "I knew. I prayed for you. You stood through it." },
    ],
    approachChoices: [
      { label: "Endorse the dual oath.", bondDelta: 5, consequence: "Both bond +4; chapel watch SOP added." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Reassign the sentinel.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "ghost_x_revenant_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "revenant"],
    lines: [
      { speaker: "revenant", text: "You move like someone who's already left." },
      { speaker: "ghost", text: "You move like someone who's already returned." },
    ],
    approachChoices: [
      { label: "Trust the kinship.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet sit." },
      { label: "Distinguish them.", bondDelta: -2, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "artisan_x_ghost_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "ghost"],
    lines: [
      { speaker: "artisan", text: "Someone moved the lathe two degrees." },
      { speaker: "ghost", text: "It was off-true. I corrected it." },
      { speaker: "artisan", text: "Don't do that again. Tell me first." },
    ],
    approachChoices: [
      { label: "Endorse a quiet collaboration.", bondDelta: 4, consequence: "Both bond +3." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Forbid the contact.", bondDelta: -3, consequence: "Both retreat." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "ghost_x_martyr_alcove_01",
    subzone: "alcove",
    participants: ["ghost", "martyr"],
    lines: [
      { speaker: "ghost", text: "You volunteered for the door I was already standing at." },
      { speaker: "martyr", text: "I didn't see you." },
      { speaker: "ghost", text: "I know." },
    ],
    approachChoices: [
      { label: "Pair them on the next deployment.", bondDelta: 5, consequence: "Both bond +4; survival bonus next mission." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Reassign the martyr.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "revenant_x_scholar_long_table_01",
    subzone: "long_table",
    participants: ["revenant", "scholar"],
    lines: [
      { speaker: "scholar", text: "Your archive predates your second life." },
      { speaker: "revenant", text: "It also outlasted me. I'm reading it like a stranger." },
    ],
    approachChoices: [
      { label: "Help reconstruct.", bondDelta: 5, consequence: "Memory recovery side scene unlocks." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Refuse the project.", bondDelta: -3, consequence: "Both retreat." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "martyr_x_scholar_long_table_01",
    subzone: "long_table",
    participants: ["martyr", "scholar"],
    lines: [
      { speaker: "scholar", text: "Read the field manual. Not the heroic chapter — the boring one. It saves more lives." },
      { speaker: "martyr", text: "I read the heroic chapter." },
      { speaker: "scholar", text: "Read the boring one tonight. Please." },
    ],
    approachChoices: [
      { label: "Authorize a study night.", bondDelta: 4, consequence: "Both bond +3; martyr survival +5%." },
      { label: "Listen.", bondDelta: 1, consequence: "Quiet." },
      { label: "Tell the martyr to skip it.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "scholar_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["scholar", "sentinel"],
    lines: [
      { speaker: "sentinel", text: "Your footnote made the perimeter SOP shorter." },
      { speaker: "scholar", text: "Footnotes do that. They cull what doesn't survive review." },
    ],
    approachChoices: [
      { label: "Adopt the new SOP.", bondDelta: 4, consequence: "Defense bonus next event." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Revert.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "artisan_x_martyr_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "martyr"],
    lines: [
      { speaker: "artisan", text: "I made you something. It's heavier than it needs to be. On purpose." },
      { speaker: "martyr", text: "I'll wear it. You shouldn't have." },
    ],
    approachChoices: [
      { label: "Insist they accept.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Watch.", bondDelta: 2, consequence: "Quiet." },
      { label: "Take the gift away.", bondDelta: -5, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "artisan_x_heretic_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "heretic"],
    lines: [
      { speaker: "heretic", text: "Forge me a counter-relic. Same weight as the orthodox one. Two degrees off." },
      { speaker: "artisan", text: "Three degrees. Let them argue about the third." },
    ],
    approachChoices: [
      { label: "Greenlight.", bondDelta: 4, consequence: "Counter-relic enters circulation; both bond +3." },
      { label: "Watch.", bondDelta: 1, consequence: "They sketch." },
      { label: "Veto.", bondDelta: -3, consequence: "Both deflate." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "oracle_x_wanderer_alcove_01",
    subzone: "alcove",
    participants: ["oracle", "wanderer"],
    lines: [
      { speaker: "oracle", text: "I dreamt a road you haven't walked." },
      { speaker: "wanderer", text: "Tell me which one. I'll start tonight." },
    ],
    approachChoices: [
      { label: "Authorize the trip.", bondDelta: 5, consequence: "Side mission unlocks; both bond +4." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Refuse.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "oracle_x_prodigal_alcove_01",
    subzone: "alcove",
    participants: ["oracle", "prodigal"],
    lines: [
      { speaker: "oracle", text: "I dreamt you were already on your way." },
      { speaker: "prodigal", text: "Three cycles back. I'm just slower than the dream." },
    ],
    approachChoices: [
      { label: "Welcome the slowness.", bondDelta: 5, consequence: "Both bond +4; loredex unlock." },
      { label: "Watch.", bondDelta: 2, consequence: "Quiet." },
      { label: "Hurry them.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "heretic_x_jester_bar_01",
    subzone: "bar",
    participants: ["heretic", "jester"],
    lines: [
      { speaker: "jester", text: "Your tract is funny. Did you mean it to be?" },
      { speaker: "heretic", text: "The orthodoxy made it funny. I just transcribed." },
    ],
    approachChoices: [
      { label: "Encourage a joint reading.", bondDelta: 4, consequence: "Public dissent + comedy event; both bond +3." },
      { label: "Watch.", bondDelta: 1, consequence: "They drink." },
      { label: "Forbid the reading.", bondDelta: -3, consequence: "Both wilt." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "vex_solene_x_zealot_alcove_01",
    subzone: "alcove",
    participants: ["vex_solene", "zealot"],
    lines: [
      { speaker: "vex_solene", text: "I'll sing your liturgy. Just once. So we know how it sounds out loud." },
      { speaker: "zealot", text: "Once is enough. The Cause hears the rest." },
    ],
    approachChoices: [
      { label: "Comp the performance.", bondDelta: 5, consequence: "Loredex unlock; both bond +4." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Veto.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "akai_shi_x_zealot_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "zealot"],
    lines: [
      { speaker: "akai_shi", text: "The thought-virus had its own scripture. I read it. It was thinner than yours." },
      { speaker: "zealot", text: "Then we have a comparison to make." },
    ],
    approachChoices: [
      { label: "Authorize a comparative reading.", bondDelta: 5, consequence: "Loredex unlock; both bond +4." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Forbid the topic.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "ghost_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["ghost", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "You came through the cargo bay last night. The cadre would've missed you." },
      { speaker: "ghost", text: "The cadre did miss me." },
    ],
    approachChoices: [
      { label: "Endorse a quiet liaison role.", bondDelta: 4, consequence: "Both bond +3; recon bonus next mission." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Reassign the ghost.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "scholar_x_vex_solene_long_table_01",
    subzone: "long_table",
    participants: ["scholar", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "I want a footnote in the libretto. A real one. Citations and all." },
      { speaker: "scholar", text: "I'll write three. The audience will pick the one they hear." },
    ],
    approachChoices: [
      { label: "Approve the production.", bondDelta: 5, consequence: "Major narrative event; both bond +4." },
      { label: "Listen.", bondDelta: 1, consequence: "They confer." },
      { label: "Cut the footnote.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "jericho_jones_x_scholar_long_table_01",
    subzone: "long_table",
    participants: ["jericho_jones", "scholar"],
    lines: [
      { speaker: "jericho_jones", text: "Your field manual saved a cadre. They asked who wrote it. I told them." },
      { speaker: "scholar", text: "Now they'll cite me badly. Worth it." },
    ],
    approachChoices: [
      { label: "Endorse a cadre-scholar liaison.", bondDelta: 5, consequence: "Both bond +4; cadre survival +5%." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Move on.", bondDelta: -2, consequence: "Both deflate." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "revenant_x_vex_solene_alcove_01",
    subzone: "alcove",
    participants: ["revenant", "vex_solene"],
    lines: [
      { speaker: "vex_solene", text: "Sing me what you remember of dying. I want to write it." },
      { speaker: "revenant", text: "I remember a colour. I'll hum the colour. You write the words." },
    ],
    approachChoices: [
      { label: "Greenlight the libretto.", bondDelta: 6, consequence: "Major narrative event; both bond +5." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Forbid the project.", bondDelta: -5, consequence: "Both wounded." },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "akai_shi_x_revenant_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "revenant"],
    lines: [
      { speaker: "akai_shi", text: "We came back differently. Mine was loud. Yours was a list." },
      { speaker: "revenant", text: "Both are returns. Both cost something we don't talk about yet." },
    ],
    approachChoices: [
      { label: "Sit and listen.", bondDelta: 6, consequence: "Both bond +5; major loredex unlock." },
      { label: "Witness.", bondDelta: 3, consequence: "Quiet." },
      { label: "Forbid the meeting.", bondDelta: -6, consequence: "Both retreat permanently." },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "artisan_x_locke_long_table_01",
    subzone: "long_table",
    participants: ["artisan", "locke"],
    lines: [
      { speaker: "locke", text: "Your latest commission is in the trial archive. Annotated." },
      { speaker: "artisan", text: "I left the joint visible on purpose. The annotation says so." },
    ],
    approachChoices: [
      { label: "Endorse the archive entry.", bondDelta: 4, consequence: "Both bond +3; legal-craft axis." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Refuse the entry.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "akai_shi_x_artisan_long_table_01",
    subzone: "long_table",
    participants: ["akai_shi", "artisan"],
    lines: [
      { speaker: "akai_shi", text: "Build me something the thought-virus can't read." },
      { speaker: "artisan", text: "Two degrees off. Three. I'll make it deliberately wrong." },
    ],
    approachChoices: [
      { label: "Approve the prototype.", bondDelta: 5, consequence: "Thought-virus precaution unlocks; both bond +4." },
      { label: "Watch.", bondDelta: 1, consequence: "They sketch." },
      { label: "Forbid.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "jericho_jones_x_oracle_long_table_01",
    subzone: "long_table",
    participants: ["jericho_jones", "oracle"],
    lines: [
      { speaker: "oracle", text: "Don't take the second cadre into the western corridor." },
      { speaker: "jericho_jones", text: "Acknowledged. I'll re-route. I won't ask why yet." },
    ],
    approachChoices: [
      { label: "Authorize the re-route.", bondDelta: 5, consequence: "Cadre survival +10% next event." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Dismiss the warning.", bondDelta: -5, consequence: "Future event hits harder." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "wanderer_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["wanderer", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "Walk me a road that ends at a name on my list." },
      { speaker: "wanderer", text: "I know one. Three sectors. Quiet at dusk." },
    ],
    approachChoices: [
      { label: "Authorize the pilgrimage.", bondDelta: 5, consequence: "Closure side mission unlocks." },
      { label: "Listen.", bondDelta: 2, consequence: "Quiet." },
      { label: "Veto.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "locke_x_wanderer_long_table_01",
    subzone: "long_table",
    participants: ["locke", "wanderer"],
    lines: [
      { speaker: "locke", text: "Your transit logs are unusually accurate." },
      { speaker: "wanderer", text: "I lie about most things. Roads aren't one of them." },
    ],
    approachChoices: [
      { label: "Endorse the wanderer as a witness.", bondDelta: 4, consequence: "Both bond +3; legal-recon axis." },
      { label: "Watch.", bondDelta: 1, consequence: "They confer." },
      { label: "Refuse to register them.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "akai_shi_x_wanderer_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "wanderer"],
    lines: [
      { speaker: "akai_shi", text: "There's a corridor on the substrate that doesn't echo." },
      { speaker: "wanderer", text: "I've been there. I left a stone." },
    ],
    approachChoices: [
      { label: "Send them back together.", bondDelta: 5, consequence: "Substrate side mission unlocks." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Forbid contact.", bondDelta: -4, consequence: "Both retreat." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "martyr_x_wraith_calder_alcove_01",
    subzone: "alcove",
    participants: ["martyr", "wraith_calder"],
    lines: [
      { speaker: "wraith_calder", text: "You're on my list early. That's not a compliment." },
      { speaker: "martyr", text: "I'll move myself down." },
      { speaker: "wraith_calder", text: "I can move you. You should let me." },
    ],
    approachChoices: [
      { label: "Bench the martyr next deployment.", bondDelta: 6, consequence: "Both bond +5; survival +20%." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Refuse the bench.", bondDelta: -5, consequence: "Mourning amplified if martyr dies next." },
    ],
    eavesdropDelta: 4,
  },
  {
    id: "akai_shi_x_martyr_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "martyr"],
    lines: [
      { speaker: "akai_shi", text: "I came back. You're not allowed to volunteer for what I just walked through." },
      { speaker: "martyr", text: "I won't. Not the thought-virus. Other things, though." },
    ],
    approachChoices: [
      { label: "Bench the martyr from thought-virus arcs.", bondDelta: 5, consequence: "Both bond +4." },
      { label: "Watch.", bondDelta: 2, consequence: "Quiet." },
      { label: "Refuse the bench.", bondDelta: -5, consequence: "Future event hits harder." },
    ],
    eavesdropDelta: 3,
  },
  {
    id: "heretic_x_jericho_jones_bar_01",
    subzone: "bar",
    participants: ["heretic", "jericho_jones"],
    lines: [
      { speaker: "jericho_jones", text: "Your tract makes the cadre think. Then they file it. Then they rotate to the next post." },
      { speaker: "heretic", text: "Filing is the highest praise I've ever had." },
    ],
    approachChoices: [
      { label: "Authorize cadre study sessions.", bondDelta: 4, consequence: "Both bond +3; cadre dissent literacy +1." },
      { label: "Watch.", bondDelta: 1, consequence: "They drink." },
      { label: "Forbid the tract.", bondDelta: -4, consequence: "Both wilt." },
    ],
    eavesdropDelta: 1,
  },
  {
    id: "akai_shi_x_jester_alcove_01",
    subzone: "alcove",
    participants: ["akai_shi", "jester"],
    lines: [
      { speaker: "jester", text: "I have a joke about the thought-virus. I will not be telling it. Possibly ever." },
      { speaker: "akai_shi", text: "Tell me. I'll let you know whether to retire it." },
    ],
    approachChoices: [
      { label: "Listen.", bondDelta: 4, consequence: "Both bond +3." },
      { label: "Witness.", bondDelta: 1, consequence: "Quiet." },
      { label: "Forbid the joke.", bondDelta: -3, consequence: "Both wilt." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "sentinel_x_vex_solene_long_table_01",
    subzone: "long_table",
    participants: ["sentinel", "vex_solene"],
    lines: [
      { speaker: "sentinel", text: "I stood the stage door for the Reveal cadence." },
      { speaker: "vex_solene", text: "I knew you were there. The audience never noticed. That was the work." },
    ],
    approachChoices: [
      { label: "Endorse the joint protocol.", bondDelta: 4, consequence: "Both bond +3; performance security +1." },
      { label: "Watch.", bondDelta: 1, consequence: "Quiet." },
      { label: "Reassign the sentinel.", bondDelta: -3, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "akai_shi_x_sentinel_long_table_01",
    subzone: "long_table",
    participants: ["akai_shi", "sentinel"],
    lines: [
      { speaker: "akai_shi", text: "There's a watch I want to stand alongside you. Quiet. Listening for the wrong frequencies." },
      { speaker: "sentinel", text: "I'll bring two thermoses. The shift is long." },
    ],
    approachChoices: [
      { label: "Authorize the listening watch.", bondDelta: 5, consequence: "Thought-virus precaution; both bond +4." },
      { label: "Witness.", bondDelta: 2, consequence: "Quiet." },
      { label: "Reassign.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 2,
  },
  {
    id: "locke_x_prodigal_alcove_01",
    subzone: "alcove",
    participants: ["locke", "prodigal"],
    lines: [
      { speaker: "locke", text: "Your file is open. Nothing on it. That's intentional, I assume." },
      { speaker: "prodigal", text: "I asked for a clean page." },
      { speaker: "locke", text: "Then I'll grant you one. The next entry is yours to write." },
    ],
    approachChoices: [
      { label: "Witness the new beginning.", bondDelta: 5, consequence: "Both bond +4; loredex unlock." },
      { label: "Watch.", bondDelta: 2, consequence: "Quiet." },
      { label: "Demand a record.", bondDelta: -4, consequence: "Both wounded." },
    ],
    eavesdropDelta: 3,
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
