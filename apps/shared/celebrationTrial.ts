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
      prompt: "✨ WELCOME TO CHORUS PLAZA, FRIEND! ✨ Conni the Conductor skips out of the bandshell, curtsies, and presses a warm little baton into your palm. 'Oh, how EXCITING — it's your turn to lead, sweetie! Forty of your new best friends have been waiting SUCH a long time. They've been ever so patient.' Forty Apprentices stand in the sunshine. Not one of them is blinking.",
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
      prompt: "🎵 SING-ALONG TIME at the Humming Carousel! 🎵 Conni cups her hands and hums a brand-new song just for you, friend! 'Match it before the carousel stops, sweetie — it's a GAME!' You've only heard four notes. The carousel is already slowing. The horses are looking at you.",
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
    {
      id: "conductor_5", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni tells you that your voice has been out of tune since you arrived. 'You're fighting the song,' she says. 'Stop being yourself. Become an instrument.'",
      options: [
        { id: "surrender_to_song", label: "Surrender to the song", description: "Let the music reshape how you breathe and move.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: -4, resultFlavor: "You felt the song pass through you like a current. Conni smiled. For three minutes you were not yourself. You're not sure you came all the way back." } },
        { id: "resist_instrument", label: "Stay yourself", description: "Refuse to dissolve into the unison.",
          outcome: { bondDelta: -2, corruptionDelta: -2, moralityDelta: 5, deathChance: 0.08, resultFlavor: "Your note stuck out like a bruise. The choir flinched. Conni watched with something that might have been relief." } },
        { id: "tune_slowly", label: "Tune yourself gradually", description: "Adjust note by note without losing your voice entirely.",
          outcome: { bondDelta: 4, corruptionDelta: 1, moralityDelta: 2, resultFlavor: "By the third verse you were in tune and still you. Conni didn't mention it. She marked something in her score." } },
      ],
    },
    {
      id: "conductor_6", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni announces a rule: anyone who sings louder than the person to their left will be removed from the choir. The Apprentices begin going quiet one by one.",
      options: [
        { id: "go_silent", label: "Go completely silent", description: "Remove your voice before you're removed.",
          outcome: { bondDelta: 2, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "You went silent. So did everyone else. The choir was forty open mouths and no sound. Conni called it perfect." } },
        { id: "sing_at_limit", label: "Sing at exactly the limit", description: "Match your neighbor's volume to the breath.",
          outcome: { bondDelta: 4, corruptionDelta: 2, moralityDelta: 0, resultFlavor: "You found the edge and held it. Your neighbor's face was grateful and resentful all at once." } },
        { id: "sing_loud_anyway", label: "Sing louder", description: "Fill the room with what the choir will not.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.12, resultFlavor: "You sang alone into the silence. Conni's baton stopped. Then she raised it again, directing you and only you, until her arms ached." } },
      ],
    },
    {
      id: "conductor_7", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni tells you she once conducted a choir that sang in unison so long they forgot their names. 'The song remembered for them,' she says. 'Would you like to hear it?'",
      options: [
        { id: "listen_fully", label: "Listen to the whole song", description: "Let her sing it start to finish.",
          outcome: { bondDelta: 5, corruptionDelta: 5, moralityDelta: -3, deathChance: 0.1, resultFlavor: "By the final note you could not recall your own name. It came back. Most of it." } },
        { id: "cover_ears", label: "Cover your ears", description: "Politely decline to hear it.",
          outcome: { bondDelta: -1, corruptionDelta: -2, moralityDelta: 4, resultFlavor: "Conni sang it anyway, softer. You felt it in your chest without hearing it. You kept your name. It cost you something else." } },
        { id: "ask_to_learn_it", label: "Ask to learn it", description: "Request she teach you every note.",
          outcome: { bondDelta: 7, corruptionDelta: 4, moralityDelta: -4, deathChance: 0.15, resultFlavor: "She taught you. You know all thirty-two bars by heart now. The choir follows you now, not her. She planned for this." } },
      ],
    },
  ],
  mr_unblink: [
    {
      id: "unblink_1", day: 0, mascoteerId: "mr_unblink",
      prompt: "📸 Smile for the Studio! Step right up, friend! Mr. Unblink's white-masked face tilts in the welcoming way. 'Oh, I see EVERYONE at the Studio, pal — today I want to hear what YOU see. Isn't that special?' He points one gloved finger at another Apprentice. The shutter is already winding.",
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
      prompt: "🎫 GUEST BOOK OF HONOUR ACTIVITY! 🎫 Mr. Unblink hands you a charming little autograph book with gold page edges. 'Collect a souvenir from every guest you haven't met yet, friend — one true thing each! By sundown, please. The Studio just LOVES a keepsake.'",
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
    {
      id: "unblink_5", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink tells you he has been watching you while you sleep. 'Nothing alarming,' he says. 'You smile twice. I wrote down the times.' He holds out the log.",
      options: [
        { id: "take_the_log", label: "Take the log", description: "Read exactly what he recorded.",
          outcome: { bondDelta: 3, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "You read it. Your smiles are logged to the second. The observations are clinical and somehow tender. You can't decide which is worse." } },
        { id: "refuse_the_log", label: "Refuse to look", description: "Tell him what you do while asleep is yours.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.08, resultFlavor: "'Noted,' he said, and filed the refusal alongside the smiles. The log grew by one line." } },
        { id: "ask_him_why", label: "Ask why he keeps watching", description: "Demand a reason for the observation.",
          outcome: { bondDelta: 5, corruptionDelta: 1, moralityDelta: 2, deathChance: 0.1, resultFlavor: "He paused for longer than was comfortable. 'I watch so things don't disappear,' he said. 'Everything disappears when no one is watching.'" } },
      ],
    },
    {
      id: "unblink_6", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink tells you there is one room in Celebration he cannot see into. He tells you where it is. He does not tell you to go there.",
      options: [
        { id: "go_to_room", label: "Go to the room", description: "Walk directly to his blind spot.",
          outcome: { bondDelta: 4, corruptionDelta: -3, moralityDelta: 3, deathChance: 0.15, resultFlavor: "The room was warm. Two Apprentices were crying in it. When you returned, Mr. Unblink said nothing. That was the kindest thing he'd ever done." } },
        { id: "tell_no_one", label: "Keep the secret", description: "Don't go. Don't tell anyone.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: 1, resultFlavor: "You kept it. Two weeks later Mr. Unblink thanked you. You still don't know if telling you was a test or a gift." } },
        { id: "tell_everyone", label: "Tell the other Apprentices", description: "Share the location of the blind spot.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -3, resultFlavor: "Within a day, eleven Apprentices had used it. Mr. Unblink did not seem surprised. The room was smaller the next time someone looked." } },
      ],
    },
    {
      id: "unblink_7", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink offers to tell you who has been watching YOU since you arrived. He says there are three of them. 'Do you want names?' he asks.",
      options: [
        { id: "want_names", label: "Take the names", description: "Learn who has been observing you.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -3, resultFlavor: "You learned the names. Two were Mascoteers. The third was someone you thought was your friend. You started watching them back." } },
        { id: "no_names", label: "Decline the names", description: "Tell him you'd rather not know.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.06, resultFlavor: "Mr. Unblink tilted his mask. 'Good. Now you know the shape of not knowing.' He wrote that down too." } },
        { id: "guess_names", label: "Guess the names yourself", description: "Tell him who you think it is before he can answer.",
          outcome: { bondDelta: 6, corruptionDelta: 2, moralityDelta: 1, deathChance: 0.1, resultFlavor: "You got two of three right. Mr. Unblink's mask didn't move. His shoulders did. That's the closest thing to laughter you've seen from him." } },
      ],
    },
  ],
  little_corey: [
    {
      id: "corey_1", day: 0, mascoteerId: "little_corey",
      prompt: "🫙 GRAND OPENING — THE TRADING JARS KIOSK! 🫙 Little Corey bounces behind his rainbow-painted counter, proudly displaying jars of 'SHINY FAVOURITE THINGS — only ONE memory per trade, friend!' A clown-painted sign above his head reads ALL TRADES FINAL ✨ in glitter. He cups both small hands around his biggest jar: 'Any memory you've got, little buddy. I'll give you something SUPER shiny.'",
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
      prompt: "🫖 PLAYTIME TEA PARTY AT THE KIOSK! 🫖 You arrive to find another Apprentice already at Corey's counter — a new guest, very small, very pleased. She is cheerfully handing Corey the memory of her mother's face. Corey is holding out a brass button and beaming like a game-show host. 'Isn't she gonna be SO happy with her button, friend?'",
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
    {
      id: "corey_5", day: 0, mascoteerId: "little_corey",
      prompt: "Corey opens a new jar labeled 'futures.' He says you can trade a bad future for a good one — but you have to give him a good memory to seal the deal.",
      options: [
        { id: "trade_for_future", label: "Make the trade", description: "Hand over a good memory for a better future.",
          outcome: { bondDelta: 4, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "You gave him the summer you were ten. The future he gave back tasted like chalk. You think it belonged to someone else first." } },
        { id: "reject_futures_jar", label: "Refuse the offer", description: "Tell him futures can't be traded.",
          outcome: { bondDelta: 3, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.07, resultFlavor: "Corey shrugged. 'All futures are traded,' he said. 'You just usually don't know what you gave.'" } },
        { id: "inspect_jar_first", label: "Ask to inspect the jar first", description: "Demand to see what's inside before committing.",
          outcome: { bondDelta: 5, corruptionDelta: 1, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Corey let you look. The futures inside were foggy shapes. One of them had your silhouette. You backed away and Corey smiled like he'd expected exactly that." } },
      ],
    },
    {
      id: "corey_6", day: 0, mascoteerId: "little_corey",
      prompt: "Corey's collection has a new piece: a sound — one long note, barely audible. He says it was traded away by someone who couldn't stop humming it. He wants to trade it to you.",
      options: [
        { id: "accept_the_note", label: "Accept the note", description: "Let him place the sound in your ear.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -3, resultFlavor: "You've been humming it ever since. You can't stop. You caught the original owner staring at you in the corridor like they'd just remembered something they'd lost." } },
        { id: "reject_the_note", label: "Refuse the note", description: "Tell him you don't want someone else's sound.",
          outcome: { bondDelta: 2, corruptionDelta: -1, moralityDelta: 3, resultFlavor: "Corey put it back in the jar. You heard it through the glass all afternoon. It sounded exactly like something you used to hum." } },
        { id: "give_note_back", label: "Ask who it belonged to", description: "Try to return it to the original trader.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.12, resultFlavor: "Corey told you. You found them. When you held the sound out in your cupped hands, they started crying. Corey watched from the hallway and made a note." } },
      ],
    },
    {
      id: "corey_7", day: 0, mascoteerId: "little_corey",
      prompt: "Corey admits that some of the things in his collection were never traded — he simply collected them from people who stopped noticing they had them. He asks if you want yours back.",
      options: [
        { id: "demand_all_back", label: "Demand everything back", description: "Reclaim every piece of you that went missing.",
          outcome: { bondDelta: 4, corruptionDelta: -4, moralityDelta: 5, deathChance: 0.14, resultFlavor: "Corey opened the jar. Pieces came back — some wrong-shaped, some faded. Two didn't fit anymore. You carry them anyway." } },
        { id: "let_him_keep_it", label: "Let him keep it", description: "Tell him it doesn't matter now.",
          outcome: { bondDelta: 2, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "Corey sealed the jar. You felt exactly the same and couldn't tell if that was the problem or the answer." } },
        { id: "ask_what_it_was", label: "Ask what he took", description: "Find out what's missing before deciding.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: 1, resultFlavor: "He described it carefully. You recognized it but could not feel it. That gap — knowing without feeling — is new. Corey says that gap is the trade." } },
      ],
    },
  ],
  wanda_wee: [
    {
      id: "wanda_1", day: 0, mascoteerId: "wanda_wee",
      prompt: "⚽ INTER-PARK FIELD DAY — FORM YOUR TEAMS! ⚽ Wanda Wee stomps in, whistle-jingle-clattering in her enormous pink boots, pompoms on each shoulder. 'Gather round, champions! Two teams! Winners get ribbons, losers get ribbons TOO, it's just that the losers' ribbons say DOES NOT GRADUATE in really pretty cursive! Pick a side, new friend — quickly, quickly, the parents are watching!'",
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
      prompt: "📣 SPECIAL GUEST CAPTAIN — THAT'S YOU, FRIEND! 📣 Wanda pins a captain's star onto your shirt with both boots off the ground from excitement. 'Ooh, ooh! A little downsizing exercise, champ — roster of eight, but we need five for the Parade. Pick your five, pin the ribbons on. The other three stay in the bleachers. They'll be watching, of course — they always watch the picks!'",
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
    {
      id: "wanda_5", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda pulls you aside before the day's competition. 'One of your teammates is going to freeze out there,' she says. 'You know who. You always know. What do you do before it happens?'",
      options: [
        { id: "bench_them_preemptively", label: "Bench them early", description: "Pull them from the lineup before they fail.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -4, resultFlavor: "They never got to try. They thanked you with their mouth and never forgave you with their eyes. Wanda marked you efficient." } },
        { id: "rally_them", label: "Rally them privately", description: "Find them before the match and say the right thing.",
          outcome: { bondDelta: 6, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "They didn't freeze. It wasn't your words — it was that you believed them first. Wanda watched from the sideline with both hands at her sides, which is her version of applause." } },
        { id: "say_nothing", label: "Say nothing", description: "Let the freeze happen and see what follows.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: -2, deathChance: 0.08, resultFlavor: "They froze. The team lost ten seconds. Nobody blamed you. Wanda did, in silence, with a single notation." } },
      ],
    },
    {
      id: "wanda_6", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda announces a special exercise: one Apprentice must carry the rest of the team across a flooded yard on their back, one at a time. She picks you.",
      options: [
        { id: "carry_everyone", label: "Carry every last one", description: "Do it until you can't stand.",
          outcome: { bondDelta: 7, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.18, resultFlavor: "You carried them all. On the last crossing your knees buckled. Wanda caught you. Neither of you mentioned it again." } },
        { id: "carry_some_assign_rest", label: "Carry half and delegate", description: "Take six, then hand it to a teammate.",
          outcome: { bondDelta: 5, corruptionDelta: 1, moralityDelta: 2, resultFlavor: "The team crossed. Wanda nodded. 'Knowing your limit is the hardest thing to teach.' You still don't know if she meant it as praise." } },
        { id: "refuse_carry", label: "Refuse the exercise", description: "Tell her this is designed to break you.",
          outcome: { bondDelta: 3, corruptionDelta: -2, moralityDelta: 5, deathChance: 0.12, resultFlavor: "'Yes,' said Wanda. 'Everything here is. The question is which kind of broken you want to be.' She assigned someone else. You've felt it all day." } },
      ],
    },
    {
      id: "wanda_7", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda tells you that the competition you've been training for isn't against another team. It's against her. 'You've been getting stronger,' she says. 'Try to win.'",
      options: [
        { id: "fight_to_beat_her", label: "Try to beat her", description: "Go all-out. Compete to win.",
          outcome: { bondDelta: 6, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.15, resultFlavor: "You lost. But Wanda was breathing hard at the end. She never breathes hard. She has not stopped watching you since." } },
        { id: "let_her_win", label: "Let her win", description: "Throw the match gracefully.",
          outcome: { bondDelta: 1, corruptionDelta: 4, moralityDelta: -5, deathChance: 0.08, resultFlavor: "'I know you threw that,' she said. 'Don't.' She made you run the exercise again from the beginning. You ran it for real." } },
        { id: "reframe_as_team", label: "Ask to compete as a team", description: "Tell her you train better with her than against her.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "Wanda stopped. She set down her clipboard for the first time you've ever seen. 'Fine,' she said. 'Show me.' You trained together until dark." } },
      ],
    },
  ],
  gary: [
    {
      id: "gary_1", day: 0, mascoteerId: "gary",
      prompt: "🎪 PUZZLE-BOX OF THE DAY — STEP RIGHT UP! 🎪 Gary the Ninth tips his top hat and sets a velvet-lined puzzle box on the counter like it's a prize pie at the county fair. 'Ten moves, little guest, TEN MOVES, and all the prizes inside are YOURS!' The lid catches the sunlight. The pieces are already quietly rearranging themselves while the ribbons on his sleeves keep clapping.",
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
    {
      id: "gary_5", day: 0, mascoteerId: "gary",
      prompt: "Gary shows you a loophole he discovered in the Trial itself. 'You could skip six days of decisions,' he says. 'Technically legal. No one closed this door.' He's grinning.",
      options: [
        { id: "use_loophole", label: "Use the loophole", description: "Skip the six days and exploit what Gary found.",
          outcome: { bondDelta: 5, corruptionDelta: 5, moralityDelta: -5, resultFlavor: "You skipped six days. Everything was fine. The six Mascoteers you missed each smiled at you exactly once in a way that meant something else." } },
        { id: "close_loophole", label: "Close the loophole", description: "Report it so it can be sealed.",
          outcome: { bondDelta: 4, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.1, resultFlavor: "You reported it. The loophole closed. Gary was delighted. 'Every good rule starts as a closed loophole,' he said. He found three more the same afternoon." } },
        { id: "tell_others", label: "Tell the other Apprentices", description: "Share the shortcut with everyone.",
          outcome: { bondDelta: 3, corruptionDelta: 4, moralityDelta: -2, deathChance: 0.12, resultFlavor: "Twenty Apprentices used it. The loophole closed on the twenty-first. Gary watched all twenty try to apologize to the rules. He took notes." } },
      ],
    },
    {
      id: "gary_6", day: 0, mascoteerId: "gary",
      prompt: "Gary presents a paradox: a rule that states all rules must be broken at least once. He asks you to resolve it without breaking the paradox or the rule.",
      options: [
        { id: "break_the_rule", label: "Break the paradox rule", description: "Violate the meta-rule to satisfy itself.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -1, resultFlavor: "Gary nodded slowly. 'Self-defeating compliance. One of the classics.' He wrote something on his goggles with a grease pen. You're fairly sure it was your name." } },
        { id: "refuse_the_frame", label: "Reject the premise", description: "Tell him the paradox isn't a rule, it's a trap.",
          outcome: { bondDelta: 6, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.08, resultFlavor: "Gary stopped smiling. Started again. 'You're only the second person to say that.' He didn't tell you who the first was. He didn't need to." } },
        { id: "write_new_rule", label: "Write an exception into the rulebook", description: "Add a clause that excludes itself from the breaking requirement.",
          outcome: { bondDelta: 7, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.1, resultFlavor: "Gary read your clause twice, then tore it out of the book, then taped it back in more carefully. 'The exception is part of the structure now,' he said. 'You built something real today.'" } },
      ],
    },
    {
      id: "gary_7", day: 0, mascoteerId: "gary",
      prompt: "Gary tells you there is one rule at Celebration that no one has ever broken — not because it's enforced, but because no one thinks to question it. He won't say which rule it is.",
      options: [
        { id: "guess_and_break", label: "Guess the rule and break it", description: "Take your best guess and act.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: -2, deathChance: 0.2, resultFlavor: "You guessed wrong. You broke the wrong rule. It was still, somehow, the right answer. Gary's goggles haven't stopped glinting since." } },
        { id: "find_it_first", label: "Study until you find it", description: "Map every rule until the unbroken one appears.",
          outcome: { bondDelta: 6, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.12, resultFlavor: "You found it. It took four days. The rule was: no one leaves early. You are currently the only Apprentice still awake. Gary is sitting across from you. He looks proud." } },
        { id: "ask_him_to_break_it", label: "Ask Gary to break it himself", description: "Tell him he's the one who should do it.",
          outcome: { bondDelta: 4, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.08, resultFlavor: "Gary paused for a very long time. 'I can't,' he said. 'I made it.' That is the most honest thing Gary has ever said to anyone. You saw his hands shake." } },
      ],
    },
  ],
  vernon: [
    {
      id: "vernon_1", day: 0, mascoteerId: "vernon",
      prompt: "🚪 SEVEN DOORS, ONE MINUTE — A CELEBRATION EXCLUSIVE! 🚪 Vernon hops up with a velvet cushion bearing seven painted doorknobs, each more charmingly enamel-bright than the last. 'New friend! Today's attraction! Pick ONE knob, and for exactly sixty seconds its door becomes REAL — then POOF, gone forever! Genuine unique once-in-a-lifetime experience! Select carefully!' A little egg-timer is already whirring.",
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
      prompt: "😢 LIVE EMERGENCY AT THE DOOR-ROW EXHIBIT! 😢 The happy music falters. Vernon is sitting on the velvet rope, crying into his polka-dot gloves. 'Friend, PLEASE — an Apprentice just stepped through, and I — I can't tell if this one leads back to the Hotel shuttle or — or nowhere at all!' A door at the end of the Row is slowly swinging shut. Its bunting is still cheerful. The little CLOSING SOON sign above it has not updated.",
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
    {
      id: "vernon_5", day: 0, mascoteerId: "vernon",
      prompt: "Vernon discovers a door that opens into the same room from the other side. 'You could walk in circles forever,' he says. 'Or you could pick a direction and trust it ends.' He holds the handle out to you.",
      options: [
        { id: "walk_the_loop", label: "Walk the loop", description: "Step through and keep walking to see where the circle leads.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, deathChance: 0.1, resultFlavor: "You looped seventeen times before the door stopped matching. On the eighteenth pass the room was slightly different. Vernon was waiting inside it." } },
        { id: "break_the_loop", label: "Break the loop", description: "Step through and then wedge the door open with your body.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.14, resultFlavor: "The loop broke. Both sides of the door were now different rooms. You're responsible for two places being somewhere they weren't before." } },
        { id: "seal_the_door", label: "Seal the door shut", description: "Close it and tell Vernon some loops should stay broken.",
          outcome: { bondDelta: 3, corruptionDelta: 0, moralityDelta: 3, resultFlavor: "Vernon looked at the sealed door for a long moment. 'I know someone who was going to need that,' he said quietly. He didn't say who. He carried the handle in his pocket all day." } },
      ],
    },
    {
      id: "vernon_6", day: 0, mascoteerId: "vernon",
      prompt: "Vernon tells you that two people are about to be displaced — moved by a door that opened without permission. He can stop one. He hands you the choice.",
      options: [
        { id: "save_the_one_you_know", label: "Save the one you know", description: "Protect the Apprentice you recognize.",
          outcome: { bondDelta: 5, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "Your friend stayed. The other was displaced somewhere Vernon can't see. He is still looking. You are not sure looking will help." } },
        { id: "save_the_stranger", label: "Save the stranger", description: "Protect the one you've never spoken to.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.12, resultFlavor: "The stranger stayed. Your friend was displaced. They came back four days later speaking a language no one recognized. Vernon recorded every word." } },
        { id: "block_both_doors", label: "Block both displacements", description: "Try to hold both people in place at once.",
          outcome: { bondDelta: 4, corruptionDelta: 2, moralityDelta: 2, deathChance: 0.18, resultFlavor: "You held both. One door tore the sleeve off your coat. Both Apprentices stayed. Vernon touched your arm and said nothing. Nothing is the most respectful thing Vernon has ever said." } },
      ],
    },
    {
      id: "vernon_7", day: 0, mascoteerId: "vernon",
      prompt: "Vernon says he found a door that leads to a place with no doors at all. 'You can go,' he says. 'But I can't promise there's a way back. I've never found a way back from a doorless place.'",
      options: [
        { id: "go_through", label: "Go through", description: "Step into the doorless place.",
          outcome: { bondDelta: 7, corruptionDelta: 4, moralityDelta: -3, deathChance: 0.25, resultFlavor: "You went. It was very quiet. There were no doors and also no walls and also nothing to want. You came back, eventually, carrying the shape of nothing. Vernon cried a little when you returned. He had been waiting." } },
        { id: "ask_him_to_go", label: "Ask Vernon to go with you", description: "Tell him you won't go alone.",
          outcome: { bondDelta: 6, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.15, resultFlavor: "Vernon looked at the door for a very long time. Then he took your hand. You both went. Neither of you talk about what you found. But you look at empty rooms differently now." } },
        { id: "decline_doorless", label: "Decline to go", description: "Tell him you need to know there's a way back.",
          outcome: { bondDelta: 3, corruptionDelta: -2, moralityDelta: 4, resultFlavor: "Vernon closed the door gently. 'Good,' he said. 'I was hoping someone would say that. Choosing not to enter is also choosing a door.' He put the door away somewhere you'll never find it." } },
      ],
    },
  ],
  minnie: [
    {
      id: "minnie_1", day: 0, mascoteerId: "minnie",
      prompt: "📢 GIANT SIDEWALK CHANT-ALONG — FOLLOW THE PINK BOWS! 📢 Minnie hops onto a crate at the Plaza's edge, twirls twice for the cameras, and starts a chant. The whole park picks it up in under seven seconds — cast members, toddlers, the girl refilling the popcorn cart. She turns on her heel, spots you, and flings out both arms, glitter cascading: 'Friend! My superstar! Take over for me — make it LOUDER!'",
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
      prompt: "💌 MINNIE'S WORD-OF-THE-DAY EVENT! 💌 Minnie, sequins-twirling, hands you a glitter-edged envelope labeled JUICY ‼️ 'I worked SO hard on this one, friend!' Inside is a rumor — fully scripted — about a specific Apprentice, with notes on which corner to tell it, which emotion to emphasize, and what little spin to add for each listener. 'Take it live by sundown and come tell Minnie all about how it LANDED, okay? Okay-okay-okay!'",
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
    {
      id: "minnie_5", day: 0, mascoteerId: "minnie",
      prompt: "Minnie tells you that a rumor about you is spreading — that you cheated in last week's trials. It isn't true. She offers to make it stop, for a price: start a new rumor about someone else.",
      options: [
        { id: "opt_a", label: "Start the new rumor", description: "Trade one lie for another.",
          outcome: { bondDelta: 3, corruptionDelta: 6, moralityDelta: -5, resultFlavor: "Minnie nodded approvingly. The first rumor died. The new one grew legs within the hour. You keep meeting the person you wronged in the hall." } },
        { id: "opt_b", label: "Let the rumor about you stand", description: "Refuse to pass the damage on.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 5, resultFlavor: "Some Apprentices believed it. Minnie watched how you carried it. 'That's stamina,' she said eventually. 'That I can work with.'" } },
        { id: "opt_c", label: "Demand Minnie admit she started it", description: "Confront her directly, publicly.",
          outcome: { bondDelta: 2, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.15, resultFlavor: "Minnie smiled coolly. 'Prove it.' No one could. But the rumor vanished — and everyone knew why it vanished." } },
      ],
    },
    {
      id: "minnie_6", day: 0, mascoteerId: "minnie",
      prompt: "Minnie pulls you aside to teach you a chant that, she says, can change what people believe about a fact they witnessed firsthand. She calls it Revision.",
      options: [
        { id: "opt_a", label: "Learn Revision", description: "Accept the lesson.",
          outcome: { bondDelta: 4, corruptionDelta: 7, moralityDelta: -4, resultFlavor: "You learned it in twelve minutes. By evening you had already used it once without meaning to. The crowd nodded. The fact shifted." } },
        { id: "opt_b", label: "Ask how she learned it", description: "Probe the origin before committing.",
          outcome: { bondDelta: 3, corruptionDelta: 2, moralityDelta: 1, deathChance: 0.1, resultFlavor: "She said a name you didn't recognize. Later you found the name in an old Celebration record — marked deceased, year three. You didn't learn Revision." } },
        { id: "opt_c", label: "Refuse and report it to a Warden", description: "Bring the chant to authority.",
          outcome: { bondDelta: -2, corruptionDelta: -4, moralityDelta: 5, deathChance: 0.18, resultFlavor: "The Warden listened. The Warden nodded. The Warden walked to Minnie's room. Two hours later the Warden was chanting a new version of events. Minnie waved at you from the window." } },
      ],
    },
    {
      id: "minnie_7", day: 0, mascoteerId: "minnie",
      prompt: "Minnie tells you that popularity is not about being liked — it is about being necessary. She offers to make you necessary to five key Apprentices. All she needs is one secret from each of them.",
      options: [
        { id: "opt_a", label: "Collect the secrets for her", description: "Become her information agent.",
          outcome: { bondDelta: 4, corruptionDelta: 6, moralityDelta: -5, resultFlavor: "You were necessary within a week. You were also watched, mistrusted, and never again confided in. Minnie called that a fair trade." } },
        { id: "opt_b", label: "Offer your own secret instead", description: "Give her something about yourself.",
          outcome: { bondDelta: 6, corruptionDelta: -1, moralityDelta: 3, resultFlavor: "Minnie was quiet for a long time. 'You're the only one who's done that.' She used it to make you necessary in a way that didn't cost the others anything." } },
        { id: "opt_c", label: "Walk away from the offer entirely", description: "Decline to be engineered.",
          outcome: { bondDelta: -1, corruptionDelta: -3, moralityDelta: 4, deathChance: 0.12, resultFlavor: "Minnie shrugged. 'Fine. You'll become necessary the hard way.' You did. It took much longer. It stuck much better." } },
      ],
    },
  ],
  senator_sprout: [
    {
      id: "sprout_1", day: 0, mascoteerId: "senator_sprout",
      prompt: "🗳️ VOTE-ALONG AT THE TOWN SQUARE GAZEBO! 🗳️ Senator Sprout, three-piece velvet suit, clipboard-shaped lollipop, stands on a bunting-wrapped podium. 'Ladies and gentle-guests, friend of the hour — today we elect YOUR Kickball Captain! Democracy in action at Celebration!' He presses a crisp pastel ballot into your palm. The other candidates are already beaming from a raised platform. One of them is already weeping, though politely.",
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
    {
      id: "sprout_5", day: 0, mascoteerId: "senator_sprout",
      prompt: "Sprout presents you with two candidates for a role — one who is qualified and one who owes him. He asks you to endorse the one he wants publicly and explain why you chose them.",
      options: [
        { id: "opt_a", label: "Endorse the debtor", description: "Back his choice, give a polished speech.",
          outcome: { bondDelta: 3, corruptionDelta: 5, moralityDelta: -4, resultFlavor: "The debtor was placed. Your speech was quoted in the morning announcements. The qualified candidate never applied for anything again. You know you're the reason." } },
        { id: "opt_b", label: "Endorse the qualified one publicly", description: "Back the better candidate openly.",
          outcome: { bondDelta: -1, corruptionDelta: -2, moralityDelta: 5, deathChance: 0.12, resultFlavor: "The qualified one got the role. Sprout nodded and made a note in his ledger. 'I'll remember this.' He means it exactly as warmly and exactly as coldly as it sounds." } },
        { id: "opt_c", label: "Endorse neither — name a third option", description: "Introduce someone not on his list.",
          outcome: { bondDelta: 4, corruptionDelta: 2, moralityDelta: 3, deathChance: 0.1, resultFlavor: "Sprout was annoyed, briefly. Then intrigued. Then satisfied. 'Good. A candidate I don't own is a candidate I can learn from.' The third person had no idea what they'd just walked into." } },
      ],
    },
    {
      id: "sprout_6", day: 0, mascoteerId: "senator_sprout",
      prompt: "Sprout quietly shows you a list of Apprentices he calls 'liabilities.' He says he is not planning to hurt them — only to ensure they don't accumulate influence. He wants your read on one name near the top.",
      options: [
        { id: "opt_a", label: "Confirm you agree they're a liability", description: "Align yourself with his assessment.",
          outcome: { bondDelta: 3, corruptionDelta: 6, moralityDelta: -5, resultFlavor: "Sprout circled the name. The Apprentice was moved to a less visible event roster. You saw the bewilderment in their face and said nothing. You are still not saying anything." } },
        { id: "opt_b", label: "Defend the person on the list", description: "Tell him they're an asset, not a liability.",
          outcome: { bondDelta: 4, corruptionDelta: -3, moralityDelta: 4, resultFlavor: "Sprout uncircled the name. He made a different mark. 'You vouch for them. That means if they become a problem, it becomes yours.' You accepted that arrangement with eyes open." } },
        { id: "opt_c", label: "Ask to see the rest of the list", description: "Press for visibility into the full ledger.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -2, deathChance: 0.14, resultFlavor: "He folded it closed. 'You'll see the parts that concern you, when they concern you.' You know at least two names on the list start with your initial." } },
      ],
    },
    {
      id: "sprout_7", day: 0, mascoteerId: "senator_sprout",
      prompt: "Sprout tells you he needs a favor with no description, no deadline, and no named recipient. 'Just owe me one,' he says. 'That's all. A standing obligation.'",
      options: [
        { id: "opt_a", label: "Accept the open obligation", description: "Say yes. Blank check.",
          outcome: { bondDelta: 5, corruptionDelta: 7, moralityDelta: -5, resultFlavor: "Sprout looked satisfied in a way he never usually looks. The favor has not been called yet. You think about it every day. You think about it more than anything else." } },
        { id: "opt_b", label: "Offer a scoped obligation instead", description: "Agree to one defined favor, your terms.",
          outcome: { bondDelta: 4, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.08, resultFlavor: "Sprout raised an eyebrow. 'A counter-offer. Acceptable.' He wrote your terms down and you both signed. You felt relieved and foolish in equal measure for believing either of you would follow it." } },
        { id: "opt_c", label: "Refuse any open debt", description: "Tell him you don't owe what you haven't received.",
          outcome: { bondDelta: -2, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.1, resultFlavor: "Sprout said 'That's fine.' He has made the same offer to seventeen others since. You count. You are the only one who said no. You don't know whether to be proud or afraid." } },
      ],
    },
  ],
  wayne: [
    {
      id: "wayne_1", day: 0, mascoteerId: "wayne",
      prompt: "🔒 THE BUDDY-LOCKER BOOTH — FREE WITH ADMISSION! 🔒 Wayne slides open the painted shutter of a little curio kiosk filled with shining brass padlocks on velvet. He offers you one with both hands, ceremonial as a gift. 'Pal! Whisper your biggest scary-thing right into the keyhole. I'll keep it in the safe for you, free of charge, cross my heart. Wayne's Fear-Keeping: absolutely confidential, absolutely complimentary!'",
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
    {
      id: "wayne_5", day: 0, mascoteerId: "wayne",
      prompt: "Wayne discovers someone has been picking the locks throughout the building at night and leaving the doors open. He is furious. He asks you to help him figure out who.",
      options: [
        { id: "opt_a", label: "Help him investigate", description: "Work alongside Wayne to find the lockpicker.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -2, resultFlavor: "You found them. Wayne locked their hands in padded gloves for a week. The open doors had led to six good conversations between Apprentices who never would have met. You didn't mention that." } },
        { id: "opt_b", label: "Admit it was you", description: "Own the act.",
          outcome: { bondDelta: 6, corruptionDelta: -4, moralityDelta: 5, deathChance: 0.2, resultFlavor: "Wayne stared for a very long time. 'Why would you —' He didn't finish. He put one lock back on the doors and left the others. He never asked you to help investigate anything again. He always unlocked them a little faster after that." } },
        { id: "opt_c", label: "Tell him the locks don't matter", description: "Argue against the premise.",
          outcome: { bondDelta: 2, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "Wayne's jaw went very tight. 'Rules matter. Because what's inside them matters.' You thought about that for days. You still don't fully agree. Neither does he, and he knows it." } },
      ],
    },
    {
      id: "wayne_6", day: 0, mascoteerId: "wayne",
      prompt: "Wayne comes to you privately and says he has put someone in the Small Room who he now suspects was innocent. He doesn't know how to let them out without admitting the mistake.",
      options: [
        { id: "opt_a", label: "Help him cover the mistake", description: "Invent a reason to release them without admitting fault.",
          outcome: { bondDelta: 3, corruptionDelta: 6, moralityDelta: -5, resultFlavor: "The Apprentice came out. Wayne thanked you. The official reason was a rule revision. Three more Apprentices went in under the same flawed logic before the season ended." } },
        { id: "opt_b", label: "Tell him to admit it directly", description: "Push him to own the error.",
          outcome: { bondDelta: 5, corruptionDelta: -4, moralityDelta: 5, deathChance: 0.12, resultFlavor: "Wayne went very pale. Then he opened the door himself. 'I made a mistake,' he said — and you heard him say it three more times at dinner, unsolicited. He was practicing. You think he'll be okay." } },
        { id: "opt_c", label: "Say nothing — leave the decision to him", description: "Refuse to guide him either way.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: 1, resultFlavor: "Wayne sat with it for two days. On the third day the person came out and Wayne gave them an extra portion at meals for a week. The mistake was never named. The kindness was real." } },
      ],
    },
    {
      id: "wayne_7", day: 0, mascoteerId: "wayne",
      prompt: "Wayne shows you a set of new rules he has written. They are strict, clear, and fair. He asks you to read them and find anything that could be used against someone who didn't deserve it.",
      options: [
        { id: "opt_a", label: "Find a loophole and show him", description: "Point out where the rule breaks.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 4, resultFlavor: "He fixed it. And then found three more on his own. 'I needed someone who could think like the wrong kind of person,' he said. He meant it as a compliment. You're not sure how you feel about earning it." } },
        { id: "opt_b", label: "Tell him the rules are fine", description: "Approve them as written.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -3, deathChance: 0.08, resultFlavor: "Wayne posted them. Within a week, two of the rules had been weaponized in ways neither of you anticipated. He didn't blame you. You blame yourself anyway." } },
        { id: "opt_c", label: "Suggest he doesn't need more rules", description: "Question whether rules are the right tool.",
          outcome: { bondDelta: 3, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.1, resultFlavor: "Wayne looked at the paper. 'Then what's the container?' You tried to explain. He tried to understand. By the end you had built something between you that wasn't exactly rules and wasn't exactly trust but was shaped like both." } },
      ],
    },
  ],
  thazu: [
    {
      id: "thazu_1", day: 0, mascoteerId: "thazu",
      prompt: "🍰 TEA-PARTY ATTRACTION — ALL GUESTS WELCOME! 🍰 Thazu claps her small black-gloved hands and ushers you to a marigold picnic blanket at the foot of the Clockwork Tree. Four plush animals and a skeleton cat have place-cards calligraphed in gold. She lifts the little porcelain teapot with both gloves: 'Oh, please sit, friend! Tea for everyone! Ooh — also we vote! Who at the party today should STAY forever?' The cat's place-card has your name already written in pencil.",
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
    {
      id: "thazu_5", day: 0, mascoteerId: "thazu",
      prompt: "Thazu holds a tea party in the dark. Each seat is labeled with a name of someone who has already died in a previous Celebration. She asks you to sit in one of the seats and speak as that person for the duration of tea.",
      options: [
        { id: "opt_a", label: "Sit and speak as the dead", description: "Inhabit the name for the hour.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: -2, deathChance: 0.1, resultFlavor: "You spoke as someone you had never met. By the end Thazu was weeping quietly. 'Yes,' she said. 'That's exactly them.' You're not sure how you knew." } },
        { id: "opt_b", label: "Sit but speak as yourself", description: "Occupy the seat but keep your name.",
          outcome: { bondDelta: 4, corruptionDelta: -1, moralityDelta: 3, resultFlavor: "Thazu accepted it. 'Presence and not-pretense. That's a kind of honoring too.' The seat felt warm and used. You understand now that it had been waiting." } },
        { id: "opt_c", label: "Ask Thazu to sit in the empty seat herself", description: "Turn the request back to her.",
          outcome: { bondDelta: 6, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.14, resultFlavor: "Thazu went very still. Then she sat down. She wept. She said a name. She would not say it again, not ever, but she said it once in your hearing and you will carry it." } },
      ],
    },
    {
      id: "thazu_6", day: 0, mascoteerId: "thazu",
      prompt: "Thazu tells you that endurance is not survival — it is the willingness to keep attending the party after you know how it ends. She asks if you plan to attend.",
      options: [
        { id: "opt_a", label: "Say yes — you'll keep attending", description: "Commit to endurance.",
          outcome: { bondDelta: 5, corruptionDelta: 3, moralityDelta: -1, resultFlavor: "Thazu poured you tea and didn't speak for a long time. 'Then you will outlast most of them,' she said. 'Not all. But most.' You felt honored. You also felt slightly cursed." } },
        { id: "opt_b", label: "Say you don't know", description: "Answer honestly with uncertainty.",
          outcome: { bondDelta: 4, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.1, resultFlavor: "'That's the truest answer,' Thazu said. She topped up your cup. 'Most say yes. Most mean no. You mean the in-between. I can work with in-between.'" } },
        { id: "opt_c", label: "Ask what the party is actually for", description: "Probe the meaning before committing.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.08, resultFlavor: "Thazu looked at you with great tenderness. 'For the ones who couldn't stay. We stay in their place.' You have been to every tea party since. You didn't decide to. You just kept arriving." } },
      ],
    },
    {
      id: "thazu_7", day: 0, mascoteerId: "thazu",
      prompt: "Thazu says she is going to give you something that stays forever — a mark, a word, a wound, or a song. She says you may only have one and may not choose none.",
      options: [
        { id: "opt_a", label: "Accept the mark", description: "Let her make a permanent mark on your skin.",
          outcome: { bondDelta: 4, corruptionDelta: 4, moralityDelta: -2, resultFlavor: "She drew one character on your wrist. You don't know what it means. Other Mascoteers look at it and then look away. Thazu says that means it's working." } },
        { id: "opt_b", label: "Accept the song", description: "Let her sing something into your bones.",
          outcome: { bondDelta: 6, corruptionDelta: 1, moralityDelta: 3, deathChance: 0.08, resultFlavor: "You hear it in quiet moments. Not loudly — like a held note somewhere beneath your sternum. Thazu says it will be the last thing you hear, and that this is a gift. You believe her." } },
        { id: "opt_c", label: "Accept the wound", description: "Take the thing that will hurt but not kill.",
          outcome: { bondDelta: 5, corruptionDelta: 5, moralityDelta: -3, deathChance: 0.18, resultFlavor: "Thazu placed her small hand on your chest. Something there became heavier. 'This is the one that teaches,' she said. 'The others only last. This one teaches while it lasts.'" } },
      ],
    },
  ],
  the_prince: [
    {
      id: "prince_1", day: 0, mascoteerId: "the_prince",
      prompt: "👑 ROYAL INVITATION, FRIEND! 👑 'Hear ye, hear ye!' The Prince opens the Workshop gates with a showman's flourish. He places a broken music-box pony in your hands — painted gold, missing a leg. 'A royal favour to you, little citizen — make her whole again.' Then, in his friendliest whisper: 'Oh, I almost forgot. She belongs to someone you very much do not like.'",
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
      prompt: "🔥 FORGE YARD MEET-AND-GREET! 🔥 The Prince is doing his famous live blacksmith show for the guests! 'My LOYAL citizen — come, come, hold the other end for me!' He waves a red-glowing bar toward you with royal cheer. 'Ta-ta-ta — it's part of the act! The Prince swears on his crown it won't burn you at ALL.' You do not entirely believe the Prince on his crown.",
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
    {
      id: "prince_5", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince has invented a trap. He says it's meant to catch something dangerous. He shows you the design and asks whether you think it would also catch something innocent by mistake.",
      options: [
        { id: "opt_a", label: "Tell him yes — it would catch innocents", description: "Give the honest engineering answer.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 5, resultFlavor: "The Prince stared at the design for a long time. He rebuilt it with a release mechanism. 'Good. A trap that can't be undone is just a wound with extra steps.'" } },
        { id: "opt_b", label: "Tell him the design is fine", description: "Approve the original trap.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -4, deathChance: 0.1, resultFlavor: "The trap was laid. It caught something. The Prince hasn't told you what. He looks at his hands differently now. You know because you're looking at yours that same way." } },
        { id: "opt_c", label: "Ask what he's actually trying to catch", description: "Push on the unstated premise.",
          outcome: { bondDelta: 4, corruptionDelta: -1, moralityDelta: 3, resultFlavor: "He named it. It was a feeling, not a creature. The Prince sat down very suddenly. 'That's the problem with building when you're afraid,' he said. 'You make the fear permanent.'" } },
      ],
    },
    {
      id: "prince_6", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince says he needs to destroy something he built — something he is proud of — because leaving it intact would eventually hurt people. He asks you to witness the destruction.",
      options: [
        { id: "opt_a", label: "Witness it in silence", description: "Stand there. Hold the space.",
          outcome: { bondDelta: 6, corruptionDelta: -2, moralityDelta: 4, resultFlavor: "He dismantled it piece by piece. He did not rush. You did not speak. It took an hour. When it was done he looked lighter and ruined at the same time. He thanked you for being there." } },
        { id: "opt_b", label: "Ask him to keep one piece", description: "Suggest salvaging something from the work.",
          outcome: { bondDelta: 4, corruptionDelta: 2, moralityDelta: -1, deathChance: 0.08, resultFlavor: "He kept the smallest piece. He told you it was the one that had done the least harm. You both know that's not quite accurate. You keep the secret of the piece between you." } },
        { id: "opt_c", label: "Help with the destruction", description: "Take it apart alongside him.",
          outcome: { bondDelta: 5, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.1, resultFlavor: "'You don't have to —' 'I know.' You worked without speaking. The thing came apart faster between two sets of hands. He said, afterward: 'That's what the Forge is for.'" } },
      ],
    },
    {
      id: "prince_7", day: 0, mascoteerId: "the_prince",
      prompt: "The Prince has been given a commission — something powerful wants him to forge a weapon specifically designed to harm one named Apprentice. He shows you the commission and says he doesn't know what to do.",
      options: [
        { id: "opt_a", label: "Tell him to refuse the commission", description: "Advise him not to build it.",
          outcome: { bondDelta: 5, corruptionDelta: -4, moralityDelta: 5, deathChance: 0.15, resultFlavor: "He refused. That night his workshop was ransacked. The commission was replaced by a second one, for the same weapon, from a different signature. The Prince looked at you like he was deciding something." } },
        { id: "opt_b", label: "Tell him to build a decoy instead", description: "Forge something that looks right but isn't.",
          outcome: { bondDelta: 4, corruptionDelta: 3, moralityDelta: -1, resultFlavor: "He built it beautifully wrong. Whatever received it tested it once and found the flaw. The commission came back with a note: 'Better. You understand the game now.' The Prince burned the note and built nothing for a week." } },
        { id: "opt_c", label: "Tell the named Apprentice", description: "Warn the target directly.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.2, resultFlavor: "The named Apprentice disappeared two days later — not dead, just gone, relocated by someone with more access than either of you. The Prince said 'You did the right thing.' He said it once, quietly, and has not spoken of it since." } },
      ],
    },
  ],
  the_seeker_child: [
    {
      id: "seeker_1", day: 0, mascoteerId: "the_seeker_child",
      prompt: "🧺 STORYTIME UNDER THE CLOCKWORK TREE! 🧺 Red pats the picnic blanket in the Seeker's Meadow and offers you half his peanut-butter sandwich. (The clock in the tree is stopped at 3:47 PM. It is always 3:47 PM here.) He swings his little boots. 'Wanna play a game, friend? Ask me a question nobody else has ever asked me. A REAL one. I'll tell the truth. Pinkie promise.'",
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
      prompt: "🎁 GIFT-SHOP SPECIAL — ONE DAY ONLY! 🎁 Red finds you by the Lost-Child Fountain with a gift-wrapped box, grinning ear to ear. 'Ta-DAAA! Open it, friend! Inside is ONE answer — any question you want, wrapped up with a bow! I only have one to give, so… choose carefully, okay?' The bow is tied just a little too neatly. Someone adult tied it.",
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
    {
      id: "seeker_5", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red asks you to help him recover a memory — not his, but someone else's, left behind in a room where something bad happened. He says it just takes a witness.",
      options: [
        { id: "opt_a", label: "Be the witness", description: "Stand in the room and hold still.",
          outcome: { bondDelta: 5, corruptionDelta: 2, moralityDelta: -1, deathChance: 0.12, resultFlavor: "The memory surfaced in the air between you. It wasn't yours. You will never fully put it down. Red said 'Thank you' in a voice that sounded like he had been waiting a long time to say it." } },
        { id: "opt_b", label: "Refuse to be the witness", description: "Tell him you can't hold someone else's pain.",
          outcome: { bondDelta: 3, corruptionDelta: -2, moralityDelta: 3, resultFlavor: "'Okay. I understand.' He did it alone, later. When you saw him next his eyes were slightly different — not worse, just fuller. He didn't ask you again. You wonder sometimes what would have been in there." } },
        { id: "opt_c", label: "Ask whose memory it is first", description: "Demand to know before you commit.",
          outcome: { bondDelta: 4, corruptionDelta: -1, moralityDelta: 4, resultFlavor: "He told you the name. You knew the name. You went into the room. Knowing made it heavier and more real. Red said that was the right instinct — to find out and go in anyway." } },
      ],
    },
    {
      id: "seeker_6", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red tells you he has found a true answer — a complete, verified, factual answer to the question of what happens to Apprentices who don't graduate. He has written it down. He asks if you want to read it.",
      options: [
        { id: "opt_a", label: "Read the answer", description: "Open the paper and look.",
          outcome: { bondDelta: 4, corruptionDelta: 1, moralityDelta: 2, deathChance: 0.15, resultFlavor: "You read it. You folded it and gave it back. You didn't ask any more questions for three days. Red waited. On the fourth day you came back and asked a better question than any you had asked before." } },
        { id: "opt_b", label: "Tell him to destroy it unread", description: "Ask him to burn it without showing you.",
          outcome: { bondDelta: 3, corruptionDelta: -3, moralityDelta: 4, resultFlavor: "He burned it. 'Are you sure you didn't want —' 'Yes.' He nodded. 'That's a kind of answer too. Choosing not to know something important is a real act. It has weight.'" } },
        { id: "opt_c", label: "Ask him to keep it but not show you yet", description: "Hold the option open.",
          outcome: { bondDelta: 5, corruptionDelta: 0, moralityDelta: 3, resultFlavor: "He kept it. You asked to read it twice more over the following weeks. Both times you turned back at the last moment. Red never pushed. The paper is still there. You think about it when you need to move carefully." } },
      ],
    },
    {
      id: "seeker_7", day: 0, mascoteerId: "the_seeker_child",
      prompt: "Red says someone has been erasing other Apprentices' memories — small things, nothing critical, but systematic. He suspects a Mascoteer. He asks if you'll help him find out which one before they start on bigger things.",
      options: [
        { id: "opt_a", label: "Help him investigate", description: "Work with Red to trace the erasures.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 4, deathChance: 0.14, resultFlavor: "You found a pattern. The erased memories were all moments of doubt — every Apprentice who had once questioned the purpose of Celebration. The Mascoteer you named looked at you over dinner without expression. They have not forgotten that you know." } },
        { id: "opt_b", label: "Ask if your memories have been touched", description: "Make it personal first.",
          outcome: { bondDelta: 4, corruptionDelta: 1, moralityDelta: 2, resultFlavor: "Red checked. 'Two small ones,' he said, gently. He told you what was missing. You don't remember the missing thing but you remember the shape of where it was. It is an odd feeling, knowing the exact size of a hole." } },
        { id: "opt_c", label: "Suggest leaving it alone", description: "Argue that pursuing it may be worse.",
          outcome: { bondDelta: 2, corruptionDelta: 3, moralityDelta: -3, deathChance: 0.1, resultFlavor: "Red looked at you for a long time. 'Sometimes that's the wise call,' he said. 'I just want you to know that not asking is a choice with consequences too. Memory is the first thing they take. Truth is second.'" } },
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
