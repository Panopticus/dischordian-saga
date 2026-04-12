/* ═══════════════════════════════════════════════════════
   CELEBRATION TRIAL — Daily Decision System

   The 4-week (28-day) trial your Apprentice faces at
   Celebration. Each day brings a Mascoteer's game — a choice
   card with 2-3 options. Outcomes shift bond, corruption,
   survival probability, and player morality.

   Design goals:
     • One decision per day (low-friction, 1-tap play)
     • Missed days increase death probability on next day
     • Decisions reveal the Mascoteer's hidden truth gradually
     • Each Mascoteer appears multiple times across the trial
     • Graduation at Day 28 → Apprentice joins the ship

   "Welcome to Celebration, where dreams don't always shine,
    Step lightly, wander carefully, and watch for every sign."
   ═══════════════════════════════════════════════════════ */

export const TRIAL_LENGTH_DAYS = 28;

/** How many days missed before death becomes likely */
export const DEATH_GRACE_DAYS = 2;

/** Base daily death probability (applied after grace period) */
export const DEATH_PROBABILITY_BASE = 0.15;

/** Multiplier per day past grace */
export const DEATH_PROBABILITY_PER_MISSED_DAY = 0.25;

export interface DecisionOption {
  id: string;
  /** Short label for button */
  label: string;
  /** Longer description of the choice */
  description: string;
  /** What happens if chosen */
  outcome: TrialOutcome;
}

export interface TrialOutcome {
  bondDelta: number;
  corruptionDelta: number;
  moralityDelta: number;
  /** Chance of immediate death (0-1) */
  deathChance?: number;
  /** Flavor text shown after choice */
  resultFlavor: string;
}

export interface DailyDecision {
  id: string;
  day: number;
  mascoteerId: string;
  /** The scenario presented */
  prompt: string;
  options: DecisionOption[];
}

/* ─── DECISION CARD TEMPLATES (by Mascoteer) ─── */

export const MASCOTEER_DECISIONS: Record<string, DailyDecision[]> = {
  the_conductor: [
    {
      id: "conductor_1", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni the Conductor hands you a baton. 'The choir is waiting. Lead them.' Forty Apprentices stand in silence, watching you.",
      options: [
        { id: "follow_tradition", label: "Follow the old song", description: "Conduct the hymn Conni hums under her breath.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: -2, resultFlavor: "They sang. Conni smiled. You felt watched." } },
        { id: "write_new", label: "Write something new", description: "Improvise a melody no one taught you.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 3, resultFlavor: "The choir falters, then finds the new song. Conni's smile thins." } },
        { id: "refuse", label: "Refuse to conduct", description: "Set the baton down and walk away.",
          outcome: { bondDelta: -4, corruptionDelta: 0, moralityDelta: 1, deathChance: 0.05, resultFlavor: "The silence stretched. The Mascoteers took notes." } },
      ],
    },
    {
      id: "conductor_2", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni hums a melody you've never heard and asks you to match it before she finishes. You've only heard four notes.",
      options: [
        { id: "sing_along", label: "Sing what you heard", description: "Match the four notes exactly and hold the last one.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: -1, resultFlavor: "You found the notes. She smiled at the edge of her mouth." } },
        { id: "correct_her", label: "Correct her fifth note", description: "Sing the note she was about to hum — but wrong.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.1, resultFlavor: "Her humming stopped. 'Oh,' she said softly. 'You hear the mistake.'" } },
        { id: "hum_own", label: "Hum a song of your own", description: "Change the game. Give her yours instead.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "She learned yours in two measures. Now forty children hum it." } },
      ],
    },
    {
      id: "conductor_3", day: 0, mascoteerId: "the_conductor",
      prompt: "One child in the back is singing deliberately off-key. Conni's baton hovers. She asks what you want her to do.",
      options: [
        { id: "silence_them", label: "Silence them", description: "Tell Conni to make it stop.",
          outcome: { bondDelta: 1, corruptionDelta: 5, moralityDelta: -5, resultFlavor: "The child went quiet. Then still. Conni didn't watch. You did." } },
        { id: "protect_them", label: "Stand beside them", description: "Walk to the back of the room and sing with the off-key child.",
          outcome: { bondDelta: 6, corruptionDelta: -2, moralityDelta: 5, deathChance: 0.15, resultFlavor: "Conni's baton dropped. The child kept singing. You felt cold for a week." } },
        { id: "join_them", label: "Sing your own wrong note", description: "Add a second discord from where you stand.",
          outcome: { bondDelta: 4, corruptionDelta: 1, moralityDelta: 2, deathChance: 0.08, resultFlavor: "Two voices, then four. The harmony was wrong and also right." } },
      ],
    },
    {
      id: "conductor_4", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni asks for the first song you ever loved. 'I'll teach it to the class tomorrow,' she says. 'As a gift to you.'",
      options: [
        { id: "give_it", label: "Give her the song", description: "Sing her the melody that your childhood used to smell like.",
          outcome: { bondDelta: 5, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "Forty mouths sang it the next day. It never belonged to you again." } },
        { id: "keep_it", label: "Keep it for yourself", description: "Tell her no.",
          outcome: { bondDelta: -3, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.1, resultFlavor: "'Songs are lighter,' she said, 'when one mouth carries them.' The compliment was a warning." } },
        { id: "lie", label: "Invent a fake first song", description: "Make up a melody and pretend it's yours.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -4, resultFlavor: "You made one up. Forty children learned your fake. You felt briefly powerful." } },
      ],
    },
  ],
  mr_unblink: [
    {
      id: "unblink_1", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink's white mask tilts. 'I see everything. Today, tell me what YOU see.' He gestures at another Apprentice.",
      options: [
        { id: "report_true", label: "Report what you see", description: "Describe the other Apprentice's weakness honestly.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -5, resultFlavor: "Mr. Unblink nods. The other Apprentice looks at you later." } },
        { id: "lie", label: "Lie to protect them", description: "Give a false or flattering description.",
          outcome: { bondDelta: 4, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.08, resultFlavor: "His mask doesn't move. But the day feels longer after." } },
        { id: "ask_him", label: "Ask what HE sees", description: "Turn the question back on him.",
          outcome: { bondDelta: 6, corruptionDelta: 0, moralityDelta: 2, deathChance: 0.1, resultFlavor: "He laughs. Only his mouth. 'Bold. We remember bold.'" } },
      ],
    },
    {
      id: "unblink_2", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink hands you a small black notebook. 'Write one thing about every Apprentice you haven't spoken to. By sundown.'",
      options: [
        { id: "honest", label: "Write honest observations", description: "Real notes. Real flaws. Real names.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -4, resultFlavor: "He read it. Some of the named are gone now. You don't ask where." } },
        { id: "flattering_lies", label: "Write flattering lies", description: "Protect everyone by inventing good things.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.1, resultFlavor: "He read it. The lies were underlined in red. No comment." } },
        { id: "blank_pages", label: "Return it empty", description: "Hand the notebook back with no entries.",
          outcome: { bondDelta: -3, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.12, resultFlavor: "'Interesting.' Your name went into HIS notebook instead." } },
      ],
    },
    {
      id: "unblink_3", day: 0, mascoteerId: "mr_unblink",
      prompt: "Two Apprentices are whispering about Mr. Unblink behind his back. He is one room away. He already heard them. He is watching you watch them.",
      options: [
        { id: "warn_them", label: "Warn them", description: "Cross the room and tell them to stop.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "They stopped. They owe you. Mr. Unblink owes you nothing." } },
        { id: "stay_silent", label: "Stay silent", description: "Let them finish and be found.",
          outcome: { bondDelta: 1, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "They were found out. You were not." } },
        { id: "redirect", label: "Redirect the whispers", description: "Join them and steer the target onto another Apprentice.",
          outcome: { bondDelta: 3, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "His mask turned toward the new target instead. You taught him the trick." } },
      ],
    },
    {
      id: "unblink_4", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink closes his eyes. 'Now I can't see. What do you do?' He waits. He does not move.",
      options: [
        { id: "walk_away", label: "Walk away", description: "Take the gift at face value. Leave the room.",
          outcome: { bondDelta: 2, corruptionDelta: 0, moralityDelta: 2, deathChance: 0.05, resultFlavor: "When you turned back his eyes were open. They had always been open." } },
        { id: "test_it", label: "Try the forbidden door", description: "Use the moment to test how closed his eyes really are.",
          outcome: { bondDelta: 4, corruptionDelta: -3, moralityDelta: 3, deathChance: 0.2, resultFlavor: "The east door was unlocked. He smiled without opening his eyes." } },
        { id: "hold_his_hand", label: "Hold his hand", description: "Sit down next to him and wait with him.",
          outcome: { bondDelta: 6, corruptionDelta: 2, moralityDelta: 0, resultFlavor: "His mask was cold. 'No one ever does that,' he said. 'I'll remember.'" } },
      ],
    },
  ],
  little_corey: [
    {
      id: "corey_1", day: 0, mascoteerId: "little_corey",
      prompt: "Little Corey opens his jar of 'favorite things.' 'Trade me a memory,' he says. 'Any memory. I'll give you something shiny.'",
      options: [
        { id: "trade_small", label: "Trade a small memory", description: "Offer something trivial — a childhood smell, a forgotten song.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: -1, resultFlavor: "The smell is gone. The shiny thing is a marble. You don't know why you wanted it." } },
        { id: "trade_big", label: "Trade a precious memory", description: "Give him the one you'd never trade. See what he gives back.",
          outcome: { bondDelta: 5, corruptionDelta: 6, moralityDelta: -4, resultFlavor: "Corey's mask doesn't match his voice. You have a new favorite color. You can't remember the old one." } },
        { id: "refuse_trade", label: "Refuse the trade", description: "Walk away without bargaining.",
          outcome: { bondDelta: -2, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.06, resultFlavor: "Corey frowns. 'Everyone trades eventually.' The jar waits for tomorrow." } },
      ],
    },
    {
      id: "corey_2", day: 0, mascoteerId: "little_corey",
      prompt: "At tea time another Apprentice is already trading with Corey. She hands him the memory of her mother's face. Corey is holding out a button.",
      options: [
        { id: "watch_them_trade", label: "Let the trade happen", description: "Don't interfere. It isn't your memory.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: -2, resultFlavor: "She took the button. That night she couldn't find her mother in her own memories. You watched her look." } },
        { id: "interrupt", label: "Pull her arm back", description: "Stop the trade mid-exchange.",
          outcome: { bondDelta: 5, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.1, resultFlavor: "Corey frowned. 'You owe me a trade now.' She thanked you. Later, you weren't sure who owed what." } },
        { id: "outbid", label: "Outbid her", description: "Offer Corey something worse than her mother's face.",
          outcome: { bondDelta: 4, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "He took your offer. She walked away confused. You have one fewer thing you used to love and can no longer name." } },
      ],
    },
    {
      id: "corey_3", day: 0, mascoteerId: "little_corey",
      prompt: "Corey shows you the jar of favorite things up close. One of the shiny pieces inside is yours — something you traded on Day 1 and don't remember trading.",
      options: [
        { id: "take_it_back", label: "Take it back", description: "Reach into the jar and take your piece.",
          outcome: { bondDelta: 3, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.15, resultFlavor: "Corey let you. 'That cost you something to take back.' It did. You don't know what." } },
        { id: "let_it_stay", label: "Leave it", description: "Don't reach. Walk away.",
          outcome: { bondDelta: 1, corruptionDelta: 2, moralityDelta: -2, resultFlavor: "You walked. The jar felt heavier for having your piece in it. So did you." } },
        { id: "trade_for_it", label: "Trade for it", description: "Offer Corey something new to buy your own piece back.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: -3, resultFlavor: "He took the swap. The jar never lost a piece. It only ever gains." } },
      ],
    },
    {
      id: "corey_4", day: 0, mascoteerId: "little_corey",
      prompt: "A brand new Apprentice asks you how the Trading Game works. Corey is listening from the next room with the door open.",
      options: [
        { id: "teach_honestly", label: "Warn them honestly", description: "Tell them what a trade really costs.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.08, resultFlavor: "They thanked you. Corey smiled from the other room. You didn't see him smile — you only felt it." } },
        { id: "teach_like_corey", label: "Teach it Corey's way", description: "Sell them the game as a treat.",
          outcome: { bondDelta: 3, corruptionDelta: 5, moralityDelta: -5, resultFlavor: "They lost a memory in their first week. They never forgave you. You never asked them to." } },
        { id: "tell_them_run", label: "Tell them to run", description: "Say 'leave tonight if you can.'",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.18, resultFlavor: "They ran. Corey's jar grew heavier that night. You don't know why. You don't want to." } },
      ],
    },
  ],
  wanda_wee: [
    {
      id: "wanda_1", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda Wee in her oversized boots divides the Apprentices into two teams. 'Pick one,' she says. 'The losers don't graduate.'",
      options: [
        { id: "join_strong", label: "Join the strong team", description: "The team that's obviously going to win.",
          outcome: { bondDelta: 1, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "You won. The losers were removed. Wanda saluted you." } },
        { id: "join_weak", label: "Join the weak team", description: "The underdogs who need another body.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.12, resultFlavor: "You lost. You're still here — barely. Wanda respects the choice. She didn't promise you'd graduate." } },
        { id: "refuse_team", label: "Refuse to pick", description: "Walk the line between both teams.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: 2, deathChance: 0.18, resultFlavor: "Wanda watched. The teams kept playing. You're not sure which side you're on now." } },
      ],
    },
    {
      id: "wanda_2", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda names you captain. 'Cut your team down to five,' she says. 'You choose who stays. The cuts watch you choose.'",
      options: [
        { id: "cut_weakest", label: "Cut the weakest three", description: "Stats-based. Cold. Correct by the metric.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -4, resultFlavor: "You cut three. Wanda saluted. The cut three watched you at dinner. They did not eat." } },
        { id: "cut_self", label: "Cut yourself", description: "Take your own name off the roster.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.15, resultFlavor: "Wanda blinked. 'That isn't how this works.' But she accepted it. You won that match by losing." } },
        { id: "refuse_cut", label: "Refuse to cut", description: "Field the full team of eight.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.12, resultFlavor: "You lost the match. Wanda smiled. 'Interesting choice. Expensive choice.'" } },
      ],
    },
    {
      id: "wanda_3", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda announces the losing team will dig trenches all night under cold rain. Your team is losing by one point. Ten seconds left.",
      options: [
        { id: "throw_the_match", label: "Throw the match", description: "Let the other team win cleanly.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.08, resultFlavor: "The other team won. Your team dug. They don't know you threw it. Or they do, and they're being kind." } },
        { id: "play_to_win", label: "Play to win", description: "Score the tying point and try for the winner.",
          outcome: { bondDelta: 3, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "You won. They dug all night. Wanda wrote something in her notebook next to your name." } },
        { id: "sabotage_other", label: "Sabotage their equipment", description: "Break their gear during the timeout.",
          outcome: { bondDelta: 5, corruptionDelta: 5, moralityDelta: -5, resultFlavor: "They lost without a fight. They dug in silence. You and Wanda traded a very small, very cold nod." } },
      ],
    },
    {
      id: "wanda_4", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda offers to make you her lieutenant. The job is grading the other teams. She explains the metric. It is not fair. It was never meant to be.",
      options: [
        { id: "accept", label: "Accept the rank", description: "Take the clipboard and start grading.",
          outcome: { bondDelta: 3, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "You grade them now. You learn the metric isn't fair. You grade them anyway. Wanda never thanks you. She doesn't need to." } },
        { id: "decline_politely", label: "Decline politely", description: "Thank her. Walk away.",
          outcome: { bondDelta: 2, corruptionDelta: -1, moralityDelta: 3, deathChance: 0.1, resultFlavor: "'Pity,' Wanda said. 'You would have been good at this. Too good.'" } },
        { id: "counter_offer", label: "Ask to grade the graders", description: "Request the authority to grade Wanda instead.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.12, resultFlavor: "She laughed once, dry. 'Ask me again in five years.' She will remember. You know she will." } },
      ],
    },
  ],
  gary: [
    {
      id: "gary_1", day: 0, mascoteerId: "gary",
      prompt: "Gary the Ninth sets a puzzle-box in front of you. 'Solve it in ten moves,' he says. You see the pieces shifting even as you reach for them.",
      options: [
        { id: "play_by_rules", label: "Play by his rules", description: "Try to solve it as he described.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: 0, deathChance: 0.15, resultFlavor: "You failed. You always fail his puzzles on his terms. Gary clapped politely." } },
        { id: "break_box", label: "Break the box", description: "Refuse the puzzle. Smash the structure.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: 2, deathChance: 0.20, resultFlavor: "The pieces scattered. Gary's smile widened. 'Now you're playing.'" } },
        { id: "rewrite_rules", label: "Rewrite the rules", description: "Declare a new rule before he can stop you.",
          outcome: { bondDelta: 7, corruptionDelta: 5, moralityDelta: 3, deathChance: 0.08, resultFlavor: "Gary paused. For the first time, his goggles glinted. 'Oh. Oh, you listen.'" } },
      ],
    },
    {
      id: "gary_2", day: 0, mascoteerId: "gary",
      prompt: "Gary hands you a rulebook for today's game. Every page is blank. 'Fill it in,' he says. 'By noon. The rules bind everyone, including you.'",
      options: [
        { id: "write_fair", label: "Write fair rules", description: "Rules that don't favor anyone.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "Gary watched you write. He erased page 5 after you left. He never told you which rule was gone." } },
        { id: "write_impossible", label: "Write impossible rules", description: "Rules no one, including you, can follow.",
          outcome: { bondDelta: 3, corruptionDelta: 5, moralityDelta: -3, resultFlavor: "Gary laughed for a long time. 'Now you're playing.' Everyone lost. Gary won without playing." } },
        { id: "return_blank", label: "Return it blank", description: "Hand the rulebook back untouched.",
          outcome: { bondDelta: 2, corruptionDelta: -1, moralityDelta: 2, deathChance: 0.12, resultFlavor: "'Interesting,' Gary said. 'The rules were blank all along.' The book is still enforced. It is still blank." } },
      ],
    },
    {
      id: "gary_3", day: 0, mascoteerId: "gary",
      prompt: "Two Apprentices are arguing about a rule Gary invented yesterday. Gary asks you to arbitrate. He whispers the 'real' rule in your ear before you decide.",
      options: [
        { id: "follow_whisper", label: "Follow his whisper", description: "Rule Gary's way.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -3, resultFlavor: "Both Apprentices lost. Gary nodded. The whisper was already the real rule. He wanted to know if you'd obey before being told." } },
        { id: "rule_fairly", label: "Ignore the whisper", description: "Decide based on what's fair.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.1, resultFlavor: "Both Apprentices thanked you. Gary's smile didn't thin — it widened. That is worse than thinning." } },
        { id: "invent_third", label: "Invent a new rule", description: "Arbitrate with neither option. Make a third.",
          outcome: { bondDelta: 4, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.08, resultFlavor: "Gary stopped smiling for one full second. Then wider. 'Oh. Oh, good.'" } },
      ],
    },
    {
      id: "gary_4", day: 0, mascoteerId: "gary",
      prompt: "Gary admits there's a hidden win condition. It's been there all week. He asks if you want him to tell you what it is.",
      options: [
        { id: "take_the_answer", label: "Take the answer", description: "Let him tell you.",
          outcome: { bondDelta: 2, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "He told you. You won instantly. The win felt cheap. The win felt traced." } },
        { id: "refuse_the_answer", label: "Refuse the answer", description: "Tell him you'll find it yourself or not at all.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "Gary bowed. 'Rare,' he said. It was the first honest word he'd given you." } },
        { id: "deduce_it", label: "Deduce it alone", description: "Spend the night with the rulebook.",
          outcome: { bondDelta: 6, corruptionDelta: 0, moralityDelta: 3, deathChance: 0.15, resultFlavor: "You found it yourself. Gary never confirmed it. But his goggles glinted when you passed him." } },
      ],
    },
  ],
  vernon: [
    {
      id: "vernon_1", day: 0, mascoteerId: "vernon",
      prompt: "Vernon runs up holding seven doorknobs. 'Pick one,' he says. 'I'll make its door real for exactly one minute. Then it's gone forever.'",
      options: [
        { id: "pick_red", label: "Pick the red knob", description: "The one that feels urgent.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: -1, deathChance: 0.1, resultFlavor: "It opened onto tomorrow. You remember tomorrow now. It's not what you expected, and you can't un-know it." } },
        { id: "pick_heaviest", label: "Pick the heaviest knob", description: "The one that aches in your hand.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.15, resultFlavor: "It opened onto a room full of children. One of them had your name. You closed the door before any of them saw you." } },
        { id: "refuse_all", label: "Refuse all seven", description: "Give them back unopened.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.18, resultFlavor: "Vernon shrugged. 'More for me.' He opened them all at once. Only six doorknobs came back." } },
      ],
    },
    {
      id: "vernon_2", day: 0, mascoteerId: "vernon",
      prompt: "Vernon is crying. A door is closing behind another Apprentice and Vernon says he can't tell if it leads home or nowhere.",
      options: [
        { id: "push_through", label: "Push the door open again", description: "Pull the Apprentice back by any means.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.2, resultFlavor: "You pushed. The Apprentice was still there. So were you. Both of you came back. One of you didn't quite come back whole." } },
        { id: "let_it_close", label: "Let the door close", description: "Trust that Vernon doesn't know.",
          outcome: { bondDelta: 1, corruptionDelta: 3, moralityDelta: -4, resultFlavor: "The door closed. Vernon wiped his face. 'I think that one was home,' he said. He didn't sound sure." } },
        { id: "ask_vernon_choose", label: "Make Vernon choose", description: "Tell him to pick, and you'll accept whatever he says.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: 0, resultFlavor: "Vernon picked. The door closed. He wouldn't say which it had been. He is still crying." } },
      ],
    },
    {
      id: "vernon_3", day: 0, mascoteerId: "vernon",
      prompt: "Vernon gives you a small brass key. 'This one only fits a door you haven't seen yet,' he says. 'Hide it somewhere only you will find.'",
      options: [
        { id: "hide_in_memory", label: "Hide it in a memory", description: "Fold the key into a thought, not a place.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "Corey will ask for that memory later. You will say no. You will lose it anyway. The key survives — somewhere." } },
        { id: "hide_in_room", label: "Hide it in your room", description: "A real place. Under the floorboard.",
          outcome: { bondDelta: 3, corruptionDelta: -1, moralityDelta: 2, deathChance: 0.08, resultFlavor: "In the morning the key was gone. Your room was one foot wider than the night before." } },
        { id: "refuse_key", label: "Give it back", description: "Decline the key.",
          outcome: { bondDelta: -2, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.1, resultFlavor: "Vernon's hand was empty when you set the key down. 'Good,' he said. 'You hid it exactly right.'" } },
      ],
    },
    {
      id: "vernon_4", day: 0, mascoteerId: "vernon",
      prompt: "Vernon opens a door onto the Ark's bridge years from now. You can see yourself there. Older. Tireder. He asks: want to talk to yourself?",
      options: [
        { id: "talk_to_self", label: "Talk to your future self", description: "Step halfway through the door.",
          outcome: { bondDelta: 6, corruptionDelta: 4, moralityDelta: -2, deathChance: 0.15, resultFlavor: "'Don't tell them about the Eyes,' you said. Your older self nodded. Neither of you know what that means yet." } },
        { id: "watch_only", label: "Watch without speaking", description: "Don't cross the threshold.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Your older self looked up at the door once. You waved. You didn't wave back." } },
        { id: "close_door", label: "Close the door", description: "Refuse to look.",
          outcome: { bondDelta: 4, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.12, resultFlavor: "Vernon nodded. 'Most people look. That's why most people get stuck looking.'" } },
      ],
    },
  ],
  minnie: [
    {
      id: "minnie_1", day: 0, mascoteerId: "minnie",
      prompt: "Minnie starts a chant. The whole room picks it up in seconds. She turns to you and asks you to make it louder.",
      options: [
        { id: "amplify", label: "Amplify the chant", description: "Raise your voice and pull the room with you.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -3, resultFlavor: "The chant rippled out the door. Somewhere in the Ark, someone heard it and thought it. You changed their weather." } },
        { id: "counter_chant", label: "Start a counter-chant", description: "Cut across her rhythm with a different one.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.12, resultFlavor: "Yours was smaller. It lasted longer. Minnie's face blanked for half a second — that's what she looks like when she's updating." } },
        { id: "mouth_words", label: "Mouth the words", description: "Don't actually make sound.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: -1, resultFlavor: "Minnie watched your mouth. 'You're learning the shape,' she said. 'Next week: the feeling.'" } },
      ],
    },
    {
      id: "minnie_2", day: 0, mascoteerId: "minnie",
      prompt: "Minnie hands you a rumor. She tells you exactly who it's about, what shape it should take, and when she wants to hear it back transformed.",
      options: [
        { id: "plant_it", label: "Plant the rumor", description: "Spread it exactly as written.",
          outcome: { bondDelta: 4, corruptionDelta: 5, moralityDelta: -5, resultFlavor: "The rumor bloomed. The target was reassigned. You never saw them again. Minnie thanked you by name in front of everyone. That was the real reward." } },
        { id: "plant_different", label: "Plant a gentler version", description: "Reshape the rumor into something harmless.",
          outcome: { bondDelta: 5, corruptionDelta: 3, moralityDelta: -2, deathChance: 0.1, resultFlavor: "Minnie didn't notice for two days. Then she did. She blinked. She respected it. She also remembered it." } },
        { id: "refuse_plant", label: "Refuse to plant it", description: "Give the rumor back.",
          outcome: { bondDelta: 2, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.15, resultFlavor: "Minnie laughed. 'Oh. You think refusing is a kind of speaking.' She planted it anyway, and used your refusal as evidence." } },
      ],
    },
    {
      id: "minnie_3", day: 0, mascoteerId: "minnie",
      prompt: "Minnie's face has started mirroring whatever is trending in the Ark today. Today it looks exactly like yours. She asks if you mind.",
      options: [
        { id: "mind", label: "Tell her you mind", description: "Ask her to stop.",
          outcome: { bondDelta: 4, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.1, resultFlavor: "'Noted,' she said. Her face slid away from yours. For a week your mirror showed you her smile, not yours." } },
        { id: "dont_mind", label: "Say you don't mind", description: "Let her keep the face.",
          outcome: { bondDelta: 2, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "She wore your face for a day. An Apprentice told you a secret meant for her. You're still carrying it." } },
        { id: "compliment_it", label: "Say it looks better on her", description: "Hand her the face with a smile.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: -2, resultFlavor: "She laughed — not her laugh — yours. That was the worst part. You recognized it." } },
      ],
    },
    {
      id: "minnie_4", day: 0, mascoteerId: "minnie",
      prompt: "Minnie is leading a cheer that insults a missing Apprentice by name. The missing Apprentice is your friend.",
      options: [
        { id: "cheer_along", label: "Cheer along", description: "Blend into the crowd. Don't be noticed.",
          outcome: { bondDelta: 1, corruptionDelta: 5, moralityDelta: -5, resultFlavor: "Your friend — wherever they are — felt it. You felt that they felt it. You didn't sleep that night." } },
        { id: "shout_down", label: "Shout the cheer down", description: "Out-volume Minnie.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.18, resultFlavor: "The crowd stopped. Minnie smiled. 'Oh. A counter-frequency. Good. We'll need those.'" } },
        { id: "start_new_chant", label: "Start a cheer FOR them", description: "Replace the target with a tribute.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Four Apprentices joined you. Minnie watched the four. She is keeping a list." } },
      ],
    },
  ],
  senator_sprout: [
    {
      id: "sprout_1", day: 0, mascoteerId: "senator_sprout",
      prompt: "Senator Sprout is running an election for kickball captain. He hands you a ballot and asks who you're backing — and why.",
      options: [
        { id: "back_strong", label: "Back the obvious winner", description: "Pragmatism. Safety.",
          outcome: { bondDelta: 2, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "They won. Sprout noted your pragmatism. The loser's team didn't speak to you for a week." } },
        { id: "back_kind", label: "Back the kind one", description: "The one who won't win.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "They lost. Sprout wrote one word next to your name. He wouldn't show you what it was." } },
        { id: "spoil_ballot", label: "Write yourself in", description: "Vote for no one on the list.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.12, resultFlavor: "Sprout laughed — politely, professionally. 'Noted, candidate.' You've been entered into a race you didn't know existed." } },
      ],
    },
    {
      id: "sprout_2", day: 0, mascoteerId: "senator_sprout",
      prompt: "Sprout asks you to make one public promise. 'It doesn't matter what,' he says. 'Only that it's witnessed.' Forty Apprentices wait.",
      options: [
        { id: "promise_small", label: "Promise something small", description: "A trivial commitment.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: -1, resultFlavor: "You promised to share breakfast with anyone who asked. Within a week you had no breakfasts left. 'Small promises cost everything too,' Sprout smiled." } },
        { id: "promise_big", label: "Promise something vast", description: "A life-shaped commitment.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: -3, deathChance: 0.08, resultFlavor: "You promised to protect a stranger with your life. Sprout picked the stranger that afternoon. It's going to matter later. It already matters now." } },
        { id: "refuse_promise", label: "Refuse to promise", description: "Decline the witnessing.",
          outcome: { bondDelta: -3, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.15, resultFlavor: "Sprout wrote the refusal down in ink. 'That,' he said, 'is a kind of promise too.'" } },
      ],
    },
    {
      id: "sprout_3", day: 0, mascoteerId: "senator_sprout",
      prompt: "Sprout reveals he has a promise you made as a child — long before Celebration. He asks if you remember making it. You don't.",
      options: [
        { id: "agree_honor", label: "Agree to honor it", description: "Accept the binding sight unseen.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "Sprout nodded approvingly. Days later you found out the promise was to hurt someone. You haven't met them yet. You will." } },
        { id: "demand_see", label: "Demand to see it", description: "Read the document yourself.",
          outcome: { bondDelta: 3, corruptionDelta: -1, moralityDelta: 3, deathChance: 0.1, resultFlavor: "You read your own handwriting. You cried a little. You kept the promise. You made it when you were six." } },
        { id: "deny_it", label: "Deny it", description: "Insist it isn't yours.",
          outcome: { bondDelta: 2, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "Sprout nodded politely. 'All the evidence agrees it is,' he said. 'Including you — when you forget this conversation.'" } },
      ],
    },
    {
      id: "sprout_4", day: 0, mascoteerId: "senator_sprout",
      prompt: "Sprout offers to let you rewrite one old promise of yours. Any one. Only one. He says there is no catch. You know that isn't true.",
      options: [
        { id: "rewrite_bad", label: "Rewrite a broken promise", description: "Fix one you broke years ago.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.1, resultFlavor: "You felt lighter. You felt watched. Both at once. Sprout watched your handwriting and nodded once." } },
        { id: "refuse_offer", label: "Refuse the offer", description: "Say the old promises keep you honest.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.08, resultFlavor: "Sprout smiled — the first genuine smile you've seen on him. 'Exactly. That's why I offered.'" } },
        { id: "demand_ledger", label: "Demand to see every promise", description: "Ask for the full file.",
          outcome: { bondDelta: 2, corruptionDelta: 5, moralityDelta: -3, resultFlavor: "He opened a ledger the size of a door. You haven't slept since. Some of the promises are dated from tomorrow." } },
      ],
    },
  ],
  wayne: [
    {
      id: "wayne_1", day: 0, mascoteerId: "wayne",
      prompt: "Wayne hands you a small brass padlock. 'Put your biggest fear in here,' he says. 'I'll keep it safe. I promise not to open it.'",
      options: [
        { id: "lock_real_fear", label: "Lock your real fear inside", description: "Whisper it into the padlock.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "Wayne clicked it shut. The fear stopped hurting. You also stopped recognizing it when it came back wearing a different face." } },
        { id: "lock_fake_fear", label: "Lock a fake fear inside", description: "Give him a convincing lie.",
          outcome: { bondDelta: 3, corruptionDelta: -1, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Wayne tilted his head. 'That's not yours — but I'll keep it anyway. People lose fake fears the easiest.'" } },
        { id: "refuse_lock", label: "Refuse the lock", description: "Tell him you'll keep your fears.",
          outcome: { bondDelta: -2, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.15, resultFlavor: "Wayne shrugged. Later, you couldn't find the memory of what you were afraid of. You knew you'd had one." } },
      ],
    },
    {
      id: "wayne_2", day: 0, mascoteerId: "wayne",
      prompt: "Wayne shows you a room he calls the Small Room. 'Anyone who breaks a rule goes in there. I feed them. I forget them. I asked the rooms to forget them too.' He asks if you want to see inside.",
      options: [
        { id: "look_inside", label: "Look inside", description: "Step to the doorway.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "You looked. You wish you hadn't. The Small Room is full of names. None of them are yours yet." } },
        { id: "refuse_look", label: "Refuse to look", description: "Turn your face away from the door.",
          outcome: { bondDelta: 2, corruptionDelta: -1, moralityDelta: 2, deathChance: 0.08, resultFlavor: "Wayne nodded. 'Most don't look. That's why the room gets bigger.'" } },
        { id: "ask_free_them", label: "Ask him to free them", description: "Demand the names inside be released.",
          outcome: { bondDelta: 6, corruptionDelta: -4, moralityDelta: 5, deathChance: 0.2, resultFlavor: "Wayne blinked once. 'They broke the rules.' You kept asking. By morning, two names were out. You didn't ask which two." } },
      ],
    },
    {
      id: "wayne_3", day: 0, mascoteerId: "wayne",
      prompt: "An Apprentice stepped into the wrong breakfast line. Wayne is walking them to the Small Room. He stops and offers to let you decide the punishment instead.",
      options: [
        { id: "hand_off", label: "Let Wayne handle it", description: "Step aside.",
          outcome: { bondDelta: 1, corruptionDelta: 4, moralityDelta: -4, resultFlavor: "Wayne looked relieved. 'I hate having to be the one. Thank you for letting me.' The door closed on the Apprentice." } },
        { id: "invent_chore", label: "Invent a gentler chore", description: "Pick a manageable punishment.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: -1, resultFlavor: "They scrubbed the Chorus pavilion for a week. They thanked you. They also stopped making eye contact." } },
        { id: "take_it_yourself", label: "Take the punishment yourself", description: "Walk into the Small Room in their place.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.15, resultFlavor: "Wayne's eyes went very wide. 'That isn't how this works.' The Small Room was bigger on the inside. You came back. Mostly." } },
      ],
    },
    {
      id: "wayne_4", day: 0, mascoteerId: "wayne",
      prompt: "Wayne whispers that he doesn't know who locks the Small Room at night. 'I lock it, and then I lock it again, and it still isn't me.' He asks you to wait with him and see who.",
      options: [
        { id: "wait_with_him", label: "Wait with him", description: "Stay until midnight.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.2, resultFlavor: "At midnight the door locked itself with a hand-shaped sound. Wayne held your hand very tight. Neither of you said anything. He was shaking." } },
        { id: "refuse_wait", label: "Refuse to wait", description: "Tell him you can't. Go.",
          outcome: { bondDelta: 0, corruptionDelta: 2, moralityDelta: -2, resultFlavor: "In the morning Wayne was still at the door. He didn't remember asking you. He was relieved, then. He hoped he hadn't." } },
        { id: "tell_him_its_him", label: "Tell him it's him", description: "Name the hand. Gently.",
          outcome: { bondDelta: 4, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Wayne laughed, shocked and quick. 'Oh. Is it? Is it?' He asked it like a child. Wayne IS a child. You keep forgetting." } },
      ],
    },
  ],
  thazu: [
    {
      id: "thazu_1", day: 0, mascoteerId: "thazu",
      prompt: "Thazu invites you to a tea party with four stuffed animals and a small skeleton cat. She pours tea for everyone and asks who among the guests should stay forever.",
      options: [
        { id: "pick_animal", label: "Pick a stuffed animal", description: "Point at the rabbit.",
          outcome: { bondDelta: 3, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "The rabbit stayed. The others were 'let go.' You watched her throw them in the garden. In the morning the garden was different." } },
        { id: "pick_yourself", label: "Pick yourself", description: "Say 'me.'",
          outcome: { bondDelta: 6, corruptionDelta: 5, moralityDelta: -3, deathChance: 0.2, resultFlavor: "Thazu's red goggles went very wide. 'Really?' She poured you more tea. You've been tired since — in a new way. Tired all the way down." } },
        { id: "refuse_pick", label: "Refuse to pick", description: "Tell her no one has to stay forever.",
          outcome: { bondDelta: -1, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.12, resultFlavor: "'Everyone eventually stays,' Thazu said, sad and patient. 'I'll ask again when you know.' She never needed to." } },
      ],
    },
    {
      id: "thazu_2", day: 0, mascoteerId: "thazu",
      prompt: "Thazu tells you her skeleton cat is sick. She shows you the ritual to heal it. It requires a small piece of you.",
      options: [
        { id: "give_piece", label: "Give a piece of yourself", description: "A fingernail. A little blood.",
          outcome: { bondDelta: 5, corruptionDelta: 5, moralityDelta: -3, resultFlavor: "She accepted it like a crown jewel. The cat stretched and opened its eye sockets. Something else stretched inside you at the same moment." } },
        { id: "give_thought", label: "Give a thought instead", description: "Trade her an idea.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, deathChance: 0.1, resultFlavor: "Thazu blinked. 'That's a heavier thing. Are you sure?' The cat watched you with new recognition. You have lost the last time you thought it." } },
        { id: "refuse_help", label: "Refuse to help", description: "Tell her the cat has to pass.",
          outcome: { bondDelta: 1, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.12, resultFlavor: "Thazu sighed. 'Then the cat will wait. It has waited before.' The cat never looked at you again. You are uncertain if it ever had eyes." } },
      ],
    },
    {
      id: "thazu_3", day: 0, mascoteerId: "thazu",
      prompt: "Thazu hosts a funeral for a flower. She asks you to give the eulogy, and to make everyone cry.",
      options: [
        { id: "eulogize_well", label: "Give a beautiful eulogy", description: "Speak of the flower like a grandmother.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: 2, resultFlavor: "The other Apprentices cried. Thazu clapped her small dark hands. 'You're very good at this. We'll use you again.'" } },
        { id: "refuse_eulogy", label: "Refuse the eulogy", description: "Tell her you don't do funerals.",
          outcome: { bondDelta: 2, corruptionDelta: -1, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Thazu said 'You will.' Without threat. As a fact. You have not done a funeral yet. You will." } },
        { id: "make_them_laugh", label: "Turn the eulogy into a joke", description: "Make everyone laugh instead.",
          outcome: { bondDelta: 6, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.08, resultFlavor: "Thazu didn't laugh. 'That was a different kind of mourning. The flower would have liked it. I didn't.'" } },
      ],
    },
    {
      id: "thazu_4", day: 0, mascoteerId: "thazu",
      prompt: "Thazu asks what QUALITY you want brought back from death someday. Not who — what. She says names are too loud.",
      options: [
        { id: "bring_back_youth", label: "Youth", description: "Lost time, returned.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -2, resultFlavor: "Thazu wrote it in a small black book. 'Good choice. Most pick bigger. Youth is the only one they actually get.'" } },
        { id: "bring_back_voice", label: "A voice you loved", description: "The timbre, not the person.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: 0, resultFlavor: "Thazu nodded. 'I can do that. You won't like what it says.'" } },
        { id: "refuse_answer", label: "Refuse to answer", description: "Tell her you don't want anything back.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 5, deathChance: 0.12, resultFlavor: "Thazu looked sad. 'You'll want something eventually. Everyone does. I'm patient. I am the most patient of us.'" } },
      ],
    },
  ],
  the_prince: [
    {
      id: "prince_1", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince shows you his workshop. He hands you a broken toy and asks you to fix it. Then he tells you it belongs to an Apprentice you don't like.",
      options: [
        { id: "fix_anyway", label: "Fix it anyway", description: "Do the good work regardless of who it's for.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 5, resultFlavor: "The Prince nodded once. 'Good hands don't care whose toy it is. Remember that when I ask you to build something worse.'" } },
        { id: "fix_worse", label: "Fix it with a hidden flaw", description: "Rebuild it so it fails later.",
          outcome: { bondDelta: 3, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "It worked for a week, then broke in their hand. The Prince watched you do it. He smiled. 'Now you're mine.'" } },
        { id: "refuse_fix", label: "Refuse to fix it", description: "Hand it back unrepaired.",
          outcome: { bondDelta: -1, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.1, resultFlavor: "'Then I'll fix it. But I'm disappointed. I thought you were a maker.' Later, he stopped showing you the workshop." } },
      ],
    },
    {
      id: "prince_2", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince is welding a weapon. He asks you to hold one end of a hot piece of metal. He promises it won't burn you. You don't believe him.",
      options: [
        { id: "hold_it", label: "Hold it", description: "Trust his promise.",
          outcome: { bondDelta: 5, corruptionDelta: 3, moralityDelta: -1, deathChance: 0.15, resultFlavor: "It didn't burn. It weighed more than it should have. 'Good. You held. I trust you now.' You don't know with what." } },
        { id: "refuse_hold", label: "Refuse to hold it", description: "Step back.",
          outcome: { bondDelta: 2, corruptionDelta: -1, moralityDelta: 2, resultFlavor: "'Fine. Someone else will.' Later you saw him holding it alone with his bare hand. He didn't burn either." } },
        { id: "both_hands", label: "Offer both hands", description: "Wrap the metal in a full grip.",
          outcome: { bondDelta: 6, corruptionDelta: 4, moralityDelta: -3, deathChance: 0.2, resultFlavor: "The Prince's face went still for half a second. 'Oh. You're a builder too.' The weapon is yours now. Also you still can't feel your left palm." } },
      ],
    },
    {
      id: "prince_3", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince finishes a small silver compass. 'It points toward someone who loves you,' he says. 'Do you want it to stop pointing when they stop loving you? Or keep pointing so you'll know?'",
      options: [
        { id: "stop_pointing", label: "Kind — stop when love stops", description: "Don't make the needle haunt you.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 4, resultFlavor: "It has stopped three times so far. 'Useful,' the Prince said, 'but a little cowardly.' You accepted each stop quietly." } },
        { id: "keep_pointing", label: "Cruel — keep pointing regardless", description: "Always know. Even when it hurts.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: -2, resultFlavor: "Some days the needle spins. 'You built your own wound,' the Prince said. 'That's the Forge.'" } },
        { id: "refuse_compass", label: "Give it to someone who needs it more", description: "Refuse the compass.",
          outcome: { bondDelta: 3, corruptionDelta: 0, moralityDelta: 3, deathChance: 0.08, resultFlavor: "You still think about the compass. You suspect it's pointing at you from somewhere." } },
      ],
    },
    {
      id: "prince_4", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince asks you to help him build something he will not tell you the purpose of. He needs two hours and three questions you haven't asked yet.",
      options: [
        { id: "help_silent", label: "Help without asking", description: "Work the forge in silence.",
          outcome: { bondDelta: 6, corruptionDelta: 5, moralityDelta: -3, resultFlavor: "It was a small machine the size of a lark. The Prince released it through a window. 'Hear ye, hear ye,' he said softly. 'Something arrived.'" } },
        { id: "ask_three", label: "Ask three real questions", description: "Slow him down with inquiry.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.1, resultFlavor: "The machine took longer and came out better. 'You slowed me down in the right direction,' he said. He meant it as a compliment. You took it as one." } },
        { id: "refuse_help", label: "Refuse to help", description: "Walk out of the workshop.",
          outcome: { bondDelta: -2, corruptionDelta: -1, moralityDelta: 3, deathChance: 0.12, resultFlavor: "'Then I'll build it wrong, and it will be on me.' Whatever he built, you hear about it later. Always later. Always already done." } },
      ],
    },
  ],
  the_seeker_child: [
    {
      id: "seeker_1", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red sits with you at lunch. 'Ask me a question nobody else has asked me,' he says. 'A real one.'",
      options: [
        { id: "ask_memories", label: "Do you remember the ones who didn't make it?", description: "Ask about the dead.",
          outcome: { bondDelta: 5, corruptionDelta: -1, moralityDelta: 3, resultFlavor: "'Yes. All of them. Every face. That's my job. Someone has to. I volunteered.' He smiled, tired." } },
        { id: "ask_graduation", label: "What happens after graduation?", description: "Ask about after.",
          outcome: { bondDelta: 4, corruptionDelta: 0, moralityDelta: 2, deathChance: 0.08, resultFlavor: "He went quiet. 'You start asking questions that can't be answered in Celebration. That's graduation.'" } },
        { id: "refuse_ask", label: "Stay silent", description: "Save the question.",
          outcome: { bondDelta: 0, corruptionDelta: 2, moralityDelta: -3, resultFlavor: "Red nodded slowly. 'Okay. Saving it for later is a question too. I'll remember.'" } },
      ],
    },
    {
      id: "seeker_2", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red finds you alone. 'I'm going to give you one answer,' he says. 'Any question. Choose carefully.'",
      options: [
        { id: "ask_exit", label: "How do I leave Celebration alive?", description: "Ask the survival question.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.1, resultFlavor: "'Keep asking questions. The ones who stop asking are the ones who stop existing.' It is the only answer that was ever correct." } },
        { id: "ask_truth", label: "What are the Mascoteers really?", description: "Ask the forbidden question.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.15, resultFlavor: "Red took your hand. 'They're us. Or they will be. Or they were. I'm not sure which is worst.'" } },
        { id: "ask_mundane", label: "What's your favorite food?", description: "Ask something small.",
          outcome: { bondDelta: 3, corruptionDelta: -1, moralityDelta: 2, resultFlavor: "He laughed, surprised. 'No one ever asks that.' You shared it the next day. He never forgot. Neither did you. Those are the answers that hold." } },
      ],
    },
    {
      id: "seeker_3", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red tells you he has survived Celebration many times. 'Every class. I come back. I start over. I remember everything.' He asks if you want to know why.",
      options: [
        { id: "ask_why", label: "Ask why", description: "Let him tell you.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.12, resultFlavor: "He told you. You wish he hadn't. You understand now why the Mascoteers listen when he speaks. You will not sleep well for a week." } },
        { id: "say_no_thanks", label: "Say no thanks", description: "Refuse the knowledge.",
          outcome: { bondDelta: 3, corruptionDelta: 0, moralityDelta: 2, resultFlavor: "Red nodded. 'Good. That's a mercy you're giving yourself. Don't spend all your mercies on strangers. Save one.'" } },
        { id: "ask_to_help", label: "Offer to help him carry it", description: "Ask if you can share the weight.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.15, resultFlavor: "Red's eyes filled with real tears — the first real tears of the trial. 'No one has ever offered.' He hugged you like a brother. You will remember it when it matters." } },
      ],
    },
    {
      id: "seeker_4", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red gives you a small red notebook. 'Write one true thing about yourself,' he says. 'If you die, I'll read it at your funeral. If you live, I'll give it back.'",
      options: [
        { id: "write_kind", label: "Write something kind and true", description: "A tender sentence.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, resultFlavor: "'Good. That's the kind that survives.' He tucked the notebook into his vest. You can still feel the weight of the sentence on your chest." } },
        { id: "write_cruel", label: "Write something cruel and true", description: "An honest ugly line.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "Red read it. He didn't flinch. 'Also yours. Equally yours. Don't forget the other pages.'" } },
        { id: "return_blank", label: "Return it blank", description: "Don't write anything.",
          outcome: { bondDelta: 0, corruptionDelta: 1, moralityDelta: -1, deathChance: 0.08, resultFlavor: "'Fair. Some lives are too new to write.' He kept the blank page in your name. You felt the absence later, when you wanted to go back and fill it in." } },
      ],
    },
  ],
};

/* ─── DAILY DECISION GENERATOR ─── */

const MASCOTEER_POOL = Object.keys(MASCOTEER_DECISIONS);

export function generateDailyDecision(day: number, playerSeed?: number): DailyDecision {
  // Seeded random so same day always gets same decision for same player
  const seed = (playerSeed ?? 0) + day * 9973;
  const mascoteerId = MASCOTEER_POOL[seed % MASCOTEER_POOL.length];
  const decisions = MASCOTEER_DECISIONS[mascoteerId];
  const base = decisions[seed % decisions.length];
  return {
    ...base,
    id: `${mascoteerId}_day${day}`,
    day,
  };
}

/* ─── DEATH PROBABILITY ─── */

export function computeDeathProbability(missedDays: number, currentDayChance: number = 0): number {
  const missedBonus = Math.max(0, missedDays - DEATH_GRACE_DAYS) * DEATH_PROBABILITY_PER_MISSED_DAY;
  const baseChance = missedDays > DEATH_GRACE_DAYS ? DEATH_PROBABILITY_BASE : 0;
  return Math.min(1, baseChance + missedBonus + currentDayChance);
}

export function rollForDeath(missedDays: number, choiceDeathChance: number = 0): boolean {
  const p = computeDeathProbability(missedDays, choiceDeathChance);
  return Math.random() < p;
}

/* ─── REAL-TIME TRIAL PACING ─────────────────────────────

   One real-world day = one Celebration trial day. Apprentices that go
   unattended for > DEATH_GRACE_DAYS start rolling for permadeath on
   each subsequent day missed. Call computeTrialPacing() whenever the
   client hydrates or the player revisits the ApprenticePage.
   ────────────────────────────────────────────────────── */

export const DAY_MS = 24 * 60 * 60 * 1000;

export interface TrialPacing {
  /** The trial day the apprentice SHOULD currently be on based on wall-clock time. */
  expectedDay: number;
  /** How many scheduled days have been skipped without a decision. */
  missedDays: number;
  /** Whether wall-clock time alone has already pushed the trial past day 28. */
  graduatedByTime: boolean;
}

/**
 * Compute where the trial clock says an apprentice should be right now.
 *
 * Pure: does no randomness of its own. The caller decides whether to
 * fire `rollForDeath(missedDays)` once it knows how many days slipped.
 */
export function computeTrialPacing(
  recruitedAt: number,
  currentTrialDay: number,
  now: number = Date.now(),
): TrialPacing {
  const elapsedMs = Math.max(0, now - recruitedAt);
  const elapsedDays = Math.floor(elapsedMs / DAY_MS);
  // Day 1 is the day of recruitment; cap one past graduation.
  const expectedDay = Math.min(TRIAL_LENGTH_DAYS + 1, Math.max(1, elapsedDays + 1));
  const missedDays = Math.max(0, expectedDay - currentTrialDay);
  const graduatedByTime = expectedDay > TRIAL_LENGTH_DAYS;
  return { expectedDay, missedDays, graduatedByTime };
}

/* ─── TRIAL HISTORY + SUMMARY ────────────────────────────

   The client appends one entry per resolved day. summarizeTrial()
   turns that log into the cumulative score bag that Act 1 card
   battles and companion-join cinematics read from.
   ────────────────────────────────────────────────────── */

export interface TrialHistoryEntry {
  day: number;
  mascoteerId: string;
  decisionId: string;
  optionId: string;
  bondDelta: number;
  corruptionDelta: number;
  moralityDelta: number;
}

export interface TrialSummary {
  totalBond: number;
  totalCorruption: number;
  totalMorality: number;
  /** Days the apprentice actually made a decision on. */
  daysResolved: number;
  /** Mean bondDelta across resolved days. */
  avgBond: number;
  /** 0–1 goodness score (morality vs corruption, normalized). */
  goodnessScore: number;
  /** Per-mascoteer bond totals, descending. */
  mascoteerBond: Record<string, number>;
  /** Mascoteer ids with positive cumulative bond, sorted best → worst. */
  favoredMascoteers: string[];
}

export function summarizeTrial(history: readonly TrialHistoryEntry[]): TrialSummary {
  const totalBond = history.reduce((s, e) => s + e.bondDelta, 0);
  const totalCorruption = history.reduce((s, e) => s + e.corruptionDelta, 0);
  const totalMorality = history.reduce((s, e) => s + e.moralityDelta, 0);
  const daysResolved = history.length;
  const avgBond = daysResolved ? totalBond / daysResolved : 0;

  // Normalize goodness: max possible morality across 28 days ≈ 5 × 28 = 140.
  const MAX_RANGE = TRIAL_LENGTH_DAYS * 5;
  const rawBalance = totalMorality - totalCorruption;
  const goodnessScore = Math.max(0, Math.min(1, (rawBalance + MAX_RANGE) / (2 * MAX_RANGE)));

  const mascoteerBond: Record<string, number> = {};
  for (const e of history) {
    mascoteerBond[e.mascoteerId] = (mascoteerBond[e.mascoteerId] ?? 0) + e.bondDelta;
  }
  const favoredMascoteers = Object.entries(mascoteerBond)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);

  return {
    totalBond, totalCorruption, totalMorality,
    daysResolved, avgBond, goodnessScore,
    mascoteerBond, favoredMascoteers,
  };
}

/* ─── COMBAT BUFF TRANSLATION ────────────────────────────

   Called by Act 1 Cycle A graduation-exam battles (days 10/20/28)
   to convert the trial summary into attack/defense buffs on the
   Engineer's deck. Light alignment powers Light cards, Dark
   alignment powers Dark cards, Neutral = mid.
   ────────────────────────────────────────────────────── */

export type TrialAlignment = "light" | "dark" | "neutral";

export interface TrialCombatBuff {
  /** Added to deck attack; clamped to [-10, 25]. */
  attackBonus: number;
  /** Added to deck defense; clamped to [0, 25]. */
  defenseBonus: number;
  /** Drives which cards in the hand get buffed. */
  alignment: TrialAlignment;
  /** Short human-readable line for the pre-battle banner. */
  summary: string;
}

export function trialToCombatBuff(summary: TrialSummary): TrialCombatBuff {
  const attackBonus = Math.round(Math.min(25, Math.max(-10, summary.avgBond)));
  const defenseBonus = Math.round(Math.min(25, Math.max(0, summary.goodnessScore * 25)));
  const alignment: TrialAlignment =
    summary.goodnessScore >= 0.65 ? "light"
      : summary.goodnessScore <= 0.35 ? "dark"
      : "neutral";
  const label =
    alignment === "light" ? "Righteous path"
      : alignment === "dark" ? "Corrupted path"
      : "Neutral path";
  return {
    attackBonus,
    defenseBonus,
    alignment,
    summary: `${label} · +${attackBonus} atk · +${defenseBonus} def`,
  };
}
