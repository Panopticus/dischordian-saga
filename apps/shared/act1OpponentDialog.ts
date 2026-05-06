/* ═══════════════════════════════════════════════════════
   ACT 1 OPPONENT DIALOG — per-battle scripted lines

   Companion to act1Opponents.ts. The opponent file is the
   data shell (id, name, deck leaning, single-line flavor);
   this file is the dialog content the match runner threads
   into pre-match, mid-match, and post-match moments.

   Per opponent we author:
     - engineerMemoirIntro — the framing voice that opens
       the scene (the Engineer narrates Act 1 as a memoir
       told through matches, see ACT1_NARRATIVE_STRUCTURE
       §1)
     - elaraPreMatch — Elara's recognition / Senate-era
       memory of this opponent
     - humanPreMatch — The Human's counter-perspective
       from inside the substrate
     - opponentMidMatchEarly / Mid / Late — three opponent
       taunt lines that fire on turn_reached, hp_below 50%,
       hp_below 25% (matches the NarrativeHook shape from
       tcg-core/story/encounter.ts NarrativeAction.boss_taunt)
     - elaraPostMatchWin / Loss — Elara reflects on the
       outcome
     - humanPostMatchWin / Loss — The Human counter-reflects
     - engineerMemoirCloseWin / Loss — the memoir voice
       closes the scene

   Voice constraints (per docs/narrative-audit/
   WRITING_AUDIT_V2_INGAME.md):
     - Fight-context lines stay ≤ 25 words
     - No "I've already won" villain clichés
     - Architect/Watcher/Authority lines sound like
       calibration, not threat
     - The Human leaves grief space, never explains itself
     - Elara never lectures — she remembers
   ═══════════════════════════════════════════════════════ */

import {
  ACT_1_OPPONENTS,
  getAct1Opponent,
  type Act1Opponent,
} from "./act1Opponents";

export interface Act1OpponentDialog {
  opponentId: string;
  engineerMemoirIntro: string;
  elaraPreMatch: string;
  humanPreMatch: string;
  opponentMidMatchEarly: string;
  opponentMidMatchMid: string;
  opponentMidMatchLate: string;
  elaraPostMatchWin: string;
  humanPostMatchWin: string;
  elaraPostMatchLoss: string;
  humanPostMatchLoss: string;
  engineerMemoirCloseWin: string;
  engineerMemoirCloseLoss: string;
  /**
   * Optional VO line ids (keys into apps/shared/act1TauntsVoManifest.json)
   * for the three mid-match opponent taunts. Present only on the seven
   * opponents whose taunts are authored in apps/scripts/act1-taunts-lines.json.
   * Consumed by Act1OpponentTauntOverlay via useAct1TauntsVO. Audit
   * 2026-05-05 §4.1.
   */
  tauntVoIds?: {
    early: string;
    mid: string;
    late: string;
  };
}

/* ─── CYCLE A — Kindergarten of Gods ─── */

const LITTLE_MEME: Act1OpponentDialog = {
  opponentId: "minnie_meme",
  engineerMemoirIntro:
    "I was six. The notebook was blue. The chant got into the notebook before the notebook got into me. That is the order it happened in.",
  elaraPreMatch:
    "I remember this chant from a Senate cafeteria when I was an intern. I remember it being older than I was.",
  humanPreMatch:
    "Memes are the oldest predators. They learned to live inside us before we had words for inside.",
  opponentMidMatchEarly:
    "Let me see. Let me see. Let me see. I am going to see it whether you show me or not.",
  opponentMidMatchMid:
    "You're funnier when you're tired. Get tired for me. Just a little.",
  opponentMidMatchLate:
    "Say my name once. One time. That is all I am asking.",
  elaraPostMatchWin:
    "You stopped the chant. Most adults can't. The Engineer couldn't, the first time he tried.{if forgiveness_choice_made} You forgave one earlier; you stopped one here. Both count.{/if}",
  humanPostMatchWin:
    "Memes don't die. They just sleep. You bought yourself the rest of the recess.",
  elaraPostMatchLoss:
    "It got in. That's all losing means here. We'll wash it out at the next break.{if act_2_complete} You've washed worse out, since.{/if}",
  humanPostMatchLoss:
    "You hummed it on the walk home. Don't beat yourself up. Everyone hums it.",
  engineerMemoirCloseWin:
    "I finished the card. Little Meme stalled for one second. One second, when you are six, is a whole afternoon.",
  engineerMemoirCloseLoss:
    "Little Meme laughed and laughed. I was always fine, except the one time. This wasn't the one time.",
};

const LITTLE_COLLECTOR: Act1OpponentDialog = {
  opponentId: "corey_collector",
  engineerMemoirIntro:
    "He had a jar. He had a dozen jars. The grown-ups thought it was cute. The Oracle thought it was a warning shot.",
  elaraPreMatch:
    "I knew a boy like this in the Senate. He grew up to count grief by the gram. He was very rich.",
  humanPreMatch:
    "Bottlers always tell you they want to remember. They never tell you what they plan to do with the bottle later.",
  opponentMidMatchEarly:
    "I will take your tears and your laughter both. They are both currency where I am going.",
  opponentMidMatchMid:
    "Don't fight. Just feel. I want one good one I can keep.",
  opponentMidMatchLate:
    "You are running out of jars. I am not.",
  elaraPostMatchWin:
    "The jar cracked. He'll learn to want a smaller one. Or he won't, and we'll meet him again.{if forgiveness_choice_made} You met one of his sort earlier and chose forgiveness. The lesson followed you here.{/if}",
  humanPostMatchWin:
    "Good. Some children grow into the Collectors. Some grow out. You bought him the option.{if act_1_cycle_a_complete} You bought it for the second time today. I noticed.{/if}",
  elaraPostMatchLoss:
    "He took something small. We'll find out which thing was small later. We always do.",
  humanPostMatchLoss:
    "He has your specific attention now. That's his favorite flavor. Don't give him seconds.",
  engineerMemoirCloseWin:
    "The jar cracked at the seam I had been staring at the whole match. I never told him. I never told anyone.",
  engineerMemoirCloseLoss:
    "He kept a piece of me in a small jar. I felt it missing for years. I never knew what to call it.",
  tauntVoIds: {
    early: "little_collector_taunt_early",
    mid: "little_collector_taunt_mid",
    late: "little_collector_taunt_late",
  },
};

const LITTLE_WATCHER: Act1OpponentDialog = {
  opponentId: "kanshi_sha_watcher",
  engineerMemoirIntro:
    "She wore a half-finished mask. The white wasn't paint, it was a placeholder. We were supposed to fill it in with our own faces.",
  elaraPreMatch:
    "I have no memory of this child. That should be impossible. I have memories of Senate water-coolers. Not of her.",
  humanPreMatch:
    "Watchers don't see. They record. The seeing is a thing they do later, in a room you can't enter.",
  opponentMidMatchEarly:
    "I have been watching. I will watch this too. I have watched sixteen versions of you already.",
  opponentMidMatchMid:
    "Number seventeen, then. Try harder. The recording is for someone who has not been born yet.",
  opponentMidMatchLate:
    "I will play you back to yourself, later, slower, and you will not like the editing.",
  elaraPostMatchWin:
    "She lowered the mask for half a second. I saw a child. I do not know if I saw her.",
  humanPostMatchWin:
    "You won and the recording survived. Both are true. Both are how the game ends.",
  elaraPostMatchLoss:
    "The mask stayed up. We do not know what is under it. We will, eventually, the hard way.",
  humanPostMatchLoss:
    "She didn't gloat. Watchers never do. The gloat would interrupt the take.",
  engineerMemoirCloseWin:
    "Under her mask was a face that looked like it was about to cry. I never saw it again. I think I made it up. I think I didn't.",
  engineerMemoirCloseLoss:
    "I never saw under her mask. Nobody who lost to her did. The Authority was watching the recording before I knew it existed.",
  tauntVoIds: {
    early: "little_watcher_taunt_early",
    mid: "little_watcher_taunt_mid",
    late: "little_watcher_taunt_late",
  },
};

/* ─── CYCLE B — Mechronis Academy ─── */

const THE_DETECTIVE_STUDENT: Act1OpponentDialog = {
  opponentId: "young_iron_lion",
  engineerMemoirIntro:
    "He was the only one at Mechronis who ever made me laugh on purpose. He apologized for it both times.",
  elaraPreMatch:
    "I was a junior senator the year this match happened. He read me a poem about the Senate. It was kind, and it was wrong about almost everything.",
  humanPreMatch:
    "Before the trench coat. Before the scar. Before he learned that some questions cost more than the answers do.",
  opponentMidMatchEarly:
    "I am going to win this by reading you. I am going to lose this by letting you read me. I want both.",
  opponentMidMatchMid:
    "Ask me a real question and I'll fold. I'll fold beautifully. Ask one.",
  opponentMidMatchLate:
    "You're crying a little. So am I. I think we are doing the right thing.",
  elaraPostMatchWin:
    "He bowed. Then he asked you for coffee. He meant it both times.",
  humanPostMatchWin:
    "I let him win this match in three timelines. I lost the fourth on purpose. We don't talk about it.",
  elaraPostMatchLoss:
    "He apologized. He's already apologizing to someone who hasn't been born. That's how he loses.",
  humanPostMatchLoss:
    "He'll send a card. He sends cards. He'll be wearing the trench coat by then.",
  engineerMemoirCloseWin:
    "The student Human bowed. He asked me to coffee. The asking was the thing. I went anyway.",
  engineerMemoirCloseLoss:
    "He didn't gloat. He apologized to the future. I think he was apologizing to me. I have not asked him.",
};

const IRON_LION_EXPELLED: Act1OpponentDialog = {
  opponentId: "young_kael",
  engineerMemoirIntro:
    "He had already packed. The match was a formality. The point of the match was that the match was not the point.",
  elaraPreMatch:
    "I was on the disciplinary subcommittee that approved his expulsion. I voted yes for the wrong reasons. I have not stopped knowing that.",
  humanPreMatch:
    "Iron Lion is not a man. He is a refusal in the shape of a man. The shape is generous.",
  opponentMidMatchEarly:
    "I do not want to play. I want to make a point. The point is that the point is not the rules.",
  opponentMidMatchMid:
    "Win this and I will leave. Lose this and I will leave. The leaving is the rule.",
  opponentMidMatchLate:
    "You think the gate is locked. The gate has always been a curtain. Pull it.",
  elaraPostMatchWin:
    "He nodded once and walked out. Mechronis pretended not to notice. Mechronis was very good at not noticing.",
  humanPostMatchWin:
    "He'll find Cades. He'll lose Cades. He'll find Cades again. The pattern starts here.",
  elaraPostMatchLoss:
    "He won. He left anyway. Winning never had anything to do with what he was doing.",
  humanPostMatchLoss:
    "Some men leave louder when they win. Iron Lion left louder either way.",
  engineerMemoirCloseWin:
    "I followed him to the gate and did not know why. The Engineer is allowed to not know. The man who tells this story isn't.",
  engineerMemoirCloseLoss:
    "He left and I did not follow. I have watched myself not follow him for ten thousand replays.",
};

const PROFESSOR_EIDOLA: Act1OpponentDialog = {
  opponentId: "young_agent_zero",
  engineerMemoirIntro:
    "She taught the ethics elective. Mechronis required it. Mechronis was proud of requiring it. Mechronis later required everyone forget her.",
  elaraPreMatch:
    "Professor Eidola wrote a Senate brief about consent in machine governance. The Empire archived the brief and then archived her.",
  humanPreMatch:
    "She was the first person to ever ask me what I thought I was. I have not finished the answer.",
  opponentMidMatchEarly:
    "The test is not whether you can play. The test is whether you play the way you think you ought to play.",
  opponentMidMatchMid:
    "You took the obvious line. Tell me you knew it was obvious. Tell me you chose it anyway.",
  opponentMidMatchLate:
    "Good. You're slowing down. The slowing is the test. The slowing is always the test.",
  elaraPostMatchWin:
    "She wrote one word on your report card and would not let you see it. The word was for the Empire, not for you.",
  humanPostMatchWin:
    "She told the Architect about you. The Architect did not yet have a word for you. She gave it one.",
  elaraPostMatchLoss:
    "She wrote nothing. She said 'Of course.' That was kinder than passing you would have been.",
  humanPostMatchLoss:
    "Of course. Of course is the kindest sentence she ever spoke. It is also the most accurate.",
  engineerMemoirCloseWin:
    "I never read the word. The card is in a drawer in a building that no longer exists. I have a feeling it was 'yes.'",
  engineerMemoirCloseLoss:
    "Of course, she said. Of course. I carried that of course for the rest of my life. I am still carrying it.",
  tauntVoIds: {
    early: "professor_eidola_taunt_early",
    mid: "professor_eidola_taunt_mid",
    late: "professor_eidola_taunt_late",
  },
};

const PROFESSOR_MATRIKALA: Act1OpponentDialog = {
  opponentId: "young_eyes",
  engineerMemoirIntro:
    "She taught the calibration arts. The calibration arts are how you make a reactor sing without it noticing it is singing.",
  elaraPreMatch:
    "She designed the cooling lattice that this Ark still runs on. I am, in a small way, alive because of how she tuned a pipe.",
  humanPreMatch:
    "Reactor people are the quietest in any room. They learned the room before the room learned them.",
  opponentMidMatchEarly:
    "Listen to the room. The room is a kind of music. So is the Deck. Do not let either of them play you.",
  opponentMidMatchMid:
    "You played a card the room did not expect. Good. Now play one the room expected. Both are notes.",
  opponentMidMatchLate:
    "The hum just changed. You changed it. Hold it there. Hold it.",
  elaraPostMatchWin:
    "She told you the bench you sit on was built by a student. She did not say which one. The point was the bench, not the student.",
  humanPostMatchWin:
    "She doesn't remember most of her students. She remembers the ones who heard the room. You did.",
  elaraPostMatchLoss:
    "She did not sigh. Calibration teachers do not sigh. They wait. She is waiting.",
  humanPostMatchLoss:
    "Try the room again tomorrow. The room is patient. The room has heard worse.",
  engineerMemoirCloseWin:
    "Years later I sat on that bench and built the deck on top of it. I think she meant for that to happen. I am not sure she would say so.",
  engineerMemoirCloseLoss:
    "I sat on the bench afterward, alone. The hum was wrong by half a cycle. I did not yet know how to fix it.",
  tauntVoIds: {
    early: "professor_matrikala_taunt_early",
    mid: "professor_matrikala_taunt_mid",
    late: "professor_matrikala_taunt_late",
  },
};

const THE_SEER_VISIT: Act1OpponentDialog = {
  opponentId: "young_human_seeker",
  engineerMemoirIntro:
    "She visited Mechronis once. She played one match. She did not raise her staff. The Academy talked about it for a year.",
  elaraPreMatch:
    "I have no recording of this match. The Seer told me she preferred I not have one. She is the only person to ever ask me that.",
  humanPreMatch:
    "She knows who wins. She came anyway. That is the lesson. The match is the footnote.",
  opponentMidMatchEarly:
    "I will not raise my staff today. I want to see whether the bench has learned yet.",
  opponentMidMatchMid:
    "You are playing the version of yourself I came to meet. Keep playing him. He is rare.",
  opponentMidMatchLate:
    "The match is over. You will see it in three turns. Use the three turns well.",
  elaraPostMatchWin:
    "She smiled. She told you the Engineer was the only one she ever taught who made her laugh at the right time.",
  humanPostMatchWin:
    "She left her staff on the bench. The Engineer found it later. He did not know it was a staff. He thought it was a measuring rod.",
  elaraPostMatchLoss:
    "She won and said nothing. She left the staff anyway. The staff doesn't care which way the match ended.",
  humanPostMatchLoss:
    "Losing to the Seer is the only loss in this Act that the Engineer remembered with affection.",
  engineerMemoirCloseWin:
    "I think she let me win. I have stopped feeling bad about it. The let was the lesson.",
  engineerMemoirCloseLoss:
    "She left. She left the staff. The staff was the apology. The apology was for what she had already seen coming.",
};

/* ─── CYCLE C — Nexon / Zenon / Last Words ─── */

const THE_WARLORD_ZERO_FIRST: Act1OpponentDialog = {
  opponentId: "vernon_vortex",
  engineerMemoirIntro:
    "Nexon. The line. I stood on it because the line needed someone standing on it. The Warlord stood opposite because the math required it.",
  elaraPreMatch:
    "She was not yet a person. She was already a swarm. The Senate had a word for what she was. The word did not survive the war.",
  humanPreMatch:
    "Don't look at her face. She doesn't have one. Look at the line she's drawing. The line is the threat.",
  opponentMidMatchEarly:
    "I am going to win this war in three moves. This is not bragging. This is arithmetic.",
  opponentMidMatchMid:
    "Move one was your General's deployment. Move two was the column you didn't take. Move three is mine.",
  opponentMidMatchLate:
    "Arithmetic does not negotiate. Arithmetic just continues. I am continuing.",
  elaraPostMatchWin:
    "She retreated for one measure. The war did not end. One measure is a lot.",
  humanPostMatchWin:
    "You bought the line a breath. Engineers fall in love with breaths. So do soldiers. They are the same love.",
  elaraPostMatchLoss:
    "The line cracked. The Engineer picked up a fallen staff and kept it. We still have the staff.",
  humanPostMatchLoss:
    "She advanced. She always advances. The advancing is not personal. The advancing is the only thing she has.",
  engineerMemoirCloseWin:
    "I bought the line one measure. The Programmer used the measure. He has not stopped using it. He will not.",
  engineerMemoirCloseLoss:
    "I picked up the staff and kept it. The Seer's staff. I did not yet know it was hers. I have not put it down.",
  tauntVoIds: {
    early: "the_warlord_zero_first_taunt_early",
    mid: "the_warlord_zero_first_taunt_mid",
    late: "the_warlord_zero_first_taunt_late",
  },
};

const THE_PROGRAMMER: Act1OpponentDialog = {
  opponentId: "wanda_wyrlord",
  engineerMemoirIntro:
    "He was my oldest friend. He was the best of us. He vanished the night we played this match and left a song in our place.",
  elaraPreMatch:
    "The Programmer's vote ratified the Inception Ark project. He did not believe in the Ark. He believed it would be required anyway.",
  humanPreMatch:
    "He encoded the truth in frequencies. He put it in a song. The song is the gift. The match is the wrapping paper.",
  opponentMidMatchEarly:
    "I will not tell you what I am doing. Trust me. I have done the arithmetic, and the arithmetic is very bad.",
  opponentMidMatchMid:
    "Don't try to read this hand. The hand is a love letter. You aren't the recipient. You are the courier.",
  opponentMidMatchLate:
    "When you win, take the gift. Don't ask what it is. Carry it. Let it tell you when it's ready.",
  elaraPostMatchWin:
    "He shook your hand. He vanished that night. The song he left held both his voice and the Engineer's.",
  humanPostMatchWin:
    "He gave you something only the next Witness could carry. You will not know what it was until you set it down.",
  elaraPostMatchLoss:
    "He let you win. Then he wouldn't admit it. He never admitted any of his gifts.",
  humanPostMatchLoss:
    "Some losses are gifts. This was one. Don't argue. Just hold it.",
  engineerMemoirCloseWin:
    "He shook my hand and disappeared. The song outlived us both. It is playing now. It has not stopped.",
  engineerMemoirCloseLoss:
    "He lost on purpose. He looked at me like I should know. I knew. I have always known. I have never said.",
  tauntVoIds: {
    early: "the_programmer_taunt_early",
    mid: "the_programmer_taunt_mid",
    late: "the_programmer_taunt_late",
  },
};

const THE_GAME_MASTER_ORIGINAL: Act1OpponentDialog = {
  opponentId: "warlord_nano_swarm",
  engineerMemoirIntro:
    "He had not yet split. The two lenses were still in one frame. He was a single man with a single charge sheet, smiling.",
  elaraPreMatch:
    "Before the split, the Game Master was a Senator I shared a desk with for a quarter. He laughed easily. He laughed at me twice.",
  humanPreMatch:
    "The Game Master is a category. This is the man before he became the category. He is not innocent. He is just smaller.",
  opponentMidMatchEarly:
    "You have built a beautiful box. The only thing I am going to do is open it in front of everybody.",
  opponentMidMatchMid:
    "The audience is real. They can see your hand. They have always been able to. You forgot.",
  opponentMidMatchLate:
    "Even if you win, you will have won in public. That is what I came here to do.",
  elaraPostMatchWin:
    "He smiled the smile of a man who had already lost. He said: 'Do it again. With an audience next time.'",
  humanPostMatchWin:
    "He's going to split into two. The losing side will be patient. The winning side will be louder. Watch both.",
  elaraPostMatchLoss:
    "He did not gloat. He signed the warrant. He waited for the Authority to co-sign. The waiting was the gloat.",
  humanPostMatchLoss:
    "The signature is part of the show. He'll show you the pen later. He keeps the pen.",
  engineerMemoirCloseWin:
    "He told me to do it again with an audience. I did, eventually. The audience was larger than he expected.",
  engineerMemoirCloseLoss:
    "He signed the warrant in front of the witnesses. I watched his hand. The hand did not shake. The Authority's hand did.",
};

const THE_AUTHORITY: Act1OpponentDialog = {
  opponentId: "wayne_warden",
  engineerMemoirIntro:
    "Six crystal coffins. One chair. One charge sheet. I made a card the night before. The card was for after.",
  elaraPreMatch:
    "I know two of the names in the coffins. I voted with one of them, against the other. They were both right. They are both still wrong.",
  humanPreMatch:
    "The Authority is six. Always six. The six are a chord. The chord is what the Empire sounds like when it is sure.",
  opponentMidMatchEarly:
    "What do you say to the charges?",
  opponentMidMatchMid:
    "Your defense is admissible. Your defense is also already weighed. The weighing is not adversarial.",
  opponentMidMatchLate:
    "The verdict is being calibrated. Calibration is not punishment. Calibration is what we do instead.",
  elaraPostMatchWin:
    "They overturned the execution. Not freedom — delay. A delay long enough to make one more card. The card is the one Last Words plays.",
  humanPostMatchWin:
    "They called it a delay. They knew what the delay was for. They let it happen. Six of them did. That matters.",
  elaraPostMatchLoss:
    "Sentence passed. Last Words fires. The Act ends on the cinematic, not on the match. Some endings are like that.",
  humanPostMatchLoss:
    "You did not lose, exactly. The match ended differently than the song does. The song decides what the Act was.",
  engineerMemoirCloseWin:
    "I made one more card. They let me make it because they did not yet understand what a song could carry.",
  engineerMemoirCloseLoss:
    "I made the card anyway. I made it after. I made it for you. You are reading it now.",
  tauntVoIds: {
    early: "the_authority_taunt_early",
    mid: "the_authority_taunt_mid",
    late: "the_authority_taunt_late",
  },
};

/* ─── Registry ─── */

export const ACT_1_OPPONENT_DIALOGS: readonly Act1OpponentDialog[] = [
  LITTLE_MEME,
  LITTLE_COLLECTOR,
  LITTLE_WATCHER,
  THE_DETECTIVE_STUDENT,
  IRON_LION_EXPELLED,
  PROFESSOR_EIDOLA,
  PROFESSOR_MATRIKALA,
  THE_SEER_VISIT,
  THE_WARLORD_ZERO_FIRST,
  THE_PROGRAMMER,
  THE_GAME_MASTER_ORIGINAL,
  THE_AUTHORITY,
];

export function getAct1OpponentDialog(
  opponentId: string
): Act1OpponentDialog | undefined {
  // Resolve through canonical aliases so legacy ids like
  // "the_warlord_zero_first" still locate their dialog table.
  const canonical = getAct1Opponent(opponentId)?.id ?? opponentId;
  return ACT_1_OPPONENT_DIALOGS.find((d) => d.opponentId === canonical);
}

export interface Act1OpponentWithDialog {
  opponent: Act1Opponent;
  dialog: Act1OpponentDialog;
}

export function getAct1OpponentWithDialog(
  opponentId: string
): Act1OpponentWithDialog | undefined {
  const opponent = getAct1Opponent(opponentId);
  const dialog = getAct1OpponentDialog(opponentId);
  if (!opponent || !dialog) return undefined;
  return { opponent, dialog };
}

export interface Act1OpponentTauntHooks {
  early: { id: string; turn: number; text: string };
  mid: { id: string; hpBelowPercent: number; text: string };
  late: { id: string; hpBelowPercent: number; text: string };
}

export function buildOpponentTauntHooks(
  dialog: Act1OpponentDialog
): Act1OpponentTauntHooks {
  return {
    early: {
      id: `${dialog.opponentId}_taunt_early`,
      turn: 2,
      text: dialog.opponentMidMatchEarly,
    },
    mid: {
      id: `${dialog.opponentId}_taunt_mid`,
      hpBelowPercent: 50,
      text: dialog.opponentMidMatchMid,
    },
    late: {
      id: `${dialog.opponentId}_taunt_late`,
      hpBelowPercent: 25,
      text: dialog.opponentMidMatchLate,
    },
  };
}
