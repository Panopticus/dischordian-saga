/* ═══════════════════════════════════════════════════════
   COMPANION BATTLE REACTIONS

   Dialog lines for each companion across various battle
   outcomes. 3-5 lines per companion per outcome type,
   randomly selected at display time.

   Outcome types:
     • decisive_victory  — Won with >75% HP remaining
     • close_victory     — Won with <25% HP remaining
     • defeat            — Lost the battle
     • first_win         — First win of the day
     • win_streak        — 3+ consecutive wins
     • loss_streak       — 3+ consecutive losses
   ═══════════════════════════════════════════════════════ */

export type BattleOutcome =
  | "decisive_victory"
  | "close_victory"
  | "defeat"
  | "first_win"
  | "win_streak"
  | "loss_streak";

export interface BattleReaction {
  companionId: string;
  outcome: BattleOutcome;
  lines: string[];
}

/* ─── REACTION DATABASE ─── */

const REACTIONS: BattleReaction[] = [
  // ═══════════ ELARA ═══════════
  {
    companionId: "elara",
    outcome: "decisive_victory",
    lines: [
      "That was textbook. The Senate's military advisors would have been impressed.",
      "Efficient. Clean. You're learning faster than I expected.",
      "I barely had time to worry. That's either a compliment or a concern.",
      "The probability lattice must be smiling on us today.",
    ],
  },
  {
    companionId: "elara",
    outcome: "close_victory",
    lines: [
      "My heart is still racing. Please don't make a habit of cutting it that close.",
      "We need to talk about your definition of 'I've got this under control.'",
      "I thought we'd lost you there. I... don't want to think about that.",
      "Victory, yes, but at what cost? Let me check your wounds.",
      "The Senator in me wants to lecture you about risk assessment. The friend in me is just glad you're alive.",
    ],
  },
  {
    companionId: "elara",
    outcome: "defeat",
    lines: [
      "It's okay. Every strategist loses battles. The ones who matter are the ones who learn from them.",
      "I should have seen that coming. We'll adjust our approach.",
      "Rest. Recover. We'll face them again when we're ready.",
      "This isn't the end. The Ark didn't survive this long by giving up after one setback.",
    ],
  },
  {
    companionId: "elara",
    outcome: "first_win",
    lines: [
      "A good start to the day. The Ark rewards those who show up.",
      "First victory of the cycle. May there be many more.",
      "Nothing like a morning win to remind you what we're fighting for.",
    ],
  },
  {
    companionId: "elara",
    outcome: "win_streak",
    lines: [
      "You're on fire. I almost feel sorry for anyone standing in our way. Almost.",
      "This streak is no accident. You've found your rhythm.",
      "The probability lattice is bending toward us. Keep this momentum.",
      "I've seen generals with less consistency. Don't let it go to your head.",
    ],
  },
  {
    companionId: "elara",
    outcome: "loss_streak",
    lines: [
      "Hey. Look at me. Losing streaks end. They always end. We just need to find what's not working.",
      "Perhaps we should try a different approach? There's no shame in adapting.",
      "I'm not going anywhere. We figure this out together.",
      "Even the Architect lost battles before they... well. Bad example. But the point stands.",
    ],
  },

  // ═══════════ HUMAN (THE HUMAN) ═══════════
  {
    companionId: "human",
    outcome: "decisive_victory",
    lines: [
      "Ha! That's what I'm talking about. They didn't even see us coming.",
      "Clean sweep. Remind me never to get on your bad side.",
      "Now THAT was a fight worth waking up for.",
      "I've toppled regimes with less precision. Nice work, kid.",
    ],
  },
  {
    companionId: "human",
    outcome: "close_victory",
    lines: [
      "We won? We WON. I can't feel my legs, but we won!",
      "That was either incredibly brave or monumentally stupid. Either way, I'm impressed.",
      "Next time, maybe we don't wait until we're on death's door to pull out the win?",
      "I need a drink. Several drinks. An entire bar.",
      "My life flashed before my eyes. It was mostly bar tabs and bad decisions.",
    ],
  },
  {
    companionId: "human",
    outcome: "defeat",
    lines: [
      "Yeah, well, you can't win 'em all. Trust me, I've tried.",
      "Shake it off. I've lost more fights than most people have had meals.",
      "The only fight that matters is the next one. This one's already forgotten.",
      "I'm buying you a drink. Losers drink free -- it's an old Earth tradition I just invented.",
    ],
  },
  {
    companionId: "human",
    outcome: "first_win",
    lines: [
      "First blood of the day! The rest of 'em should be scared now.",
      "Morning victory. There's no better alarm clock than the sound of enemies falling.",
      "One down. How many more are we doing today? I'm just getting warmed up.",
    ],
  },
  {
    companionId: "human",
    outcome: "win_streak",
    lines: [
      "We're unstoppable! I mean, probably stoppable, but nobody's managed it yet!",
      "At this rate, the whole Ark is gonna know our name by dinner.",
      "I'm starting to think you might actually be as good as you think you are.",
      "Streak's still alive! Don't jinx it. Don't even think about jinxing it.",
    ],
  },
  {
    companionId: "human",
    outcome: "loss_streak",
    lines: [
      "Okay, new plan: we do the opposite of whatever we've been doing.",
      "I once lost eleven fights in a row. Then I won twelve. Math works out.",
      "Listen, rock bottom has a nice echo. Means there's nowhere to go but up.",
      "Is there a spa on this ship? I feel like we've earned a spa day.",
    ],
  },

  // ═══════════ AGENT ZERO ═══════════
  {
    companionId: "agent_zero",
    outcome: "decisive_victory",
    lines: [
      "Combat efficiency: 94.7%. Acceptable.",
      "Threat neutralized in optimal time. Recalibrating expectations upward.",
      "My predictive models gave us a 73% chance. You outperformed the math. Noted.",
      "Enemy tactical patterns have been archived. They will not surprise us again.",
    ],
  },
  {
    companionId: "agent_zero",
    outcome: "close_victory",
    lines: [
      "Structural integrity at 22%. Victory achieved, but my repair subroutines are... concerned.",
      "That outcome fell within acceptable parameters. Barely.",
      "I allocated 340% more processing power to that fight than my safety protocols recommend.",
      "Survival probability dropped below 15% at three distinct points. I counted.",
    ],
  },
  {
    companionId: "agent_zero",
    outcome: "defeat",
    lines: [
      "Defeat logged. Initiating post-mortem analysis. Seventeen tactical errors identified.",
      "Loss is a data point. Enough data points create a winning strategy. This was... educational.",
      "I have updated my threat assessment models. This will not happen the same way twice.",
      "My combat subroutines are requesting additional training cycles. I concur with them.",
    ],
  },
  {
    companionId: "agent_zero",
    outcome: "first_win",
    lines: [
      "Daily combat metrics initialized. First entry: victory. A satisfactory baseline.",
      "Combat log: Day cycle initiated with positive outcome. Probability of good day: elevated.",
      "First engagement successful. Systems nominal. Ready for subsequent threats.",
    ],
  },
  {
    companionId: "agent_zero",
    outcome: "win_streak",
    lines: [
      "Win probability increasing with each engagement. Pattern recognition advantage: compounding.",
      "Consecutive victories: your combat algorithms are approaching machine-level consistency. That is... not an insult.",
      "Streak analysis: your opponents are running out of novel strategies. We are not.",
      "I am detecting what organic beings call 'momentum.' It is a statistically real phenomenon. Fascinating.",
    ],
  },
  {
    companionId: "agent_zero",
    outcome: "loss_streak",
    lines: [
      "Multiple consecutive losses detected. Recommendation: fundamental strategy overhaul.",
      "I have run 10,000 simulations on our recent losses. There is a pattern. We should discuss it.",
      "Morale subroutine suggests I say something encouraging. Here: statistically, streaks always end.",
      "I am not programmed for frustration, yet my error-handling loops are running at unusual frequency.",
    ],
  },

  // ═══════════ KAEL ═══════════
  {
    companionId: "kael",
    outcome: "decisive_victory",
    lines: [
      "The Insurgency trains us to fight like we have nothing to lose. Today, we fought like we have everything to gain.",
      "Swift. Brutal. Necessary. That's how revolutions are won.",
      "They underestimated us. That was their last mistake.",
      "My blade barely needed drawing. Your strategy did the heavy lifting.",
    ],
  },
  {
    companionId: "kael",
    outcome: "close_victory",
    lines: [
      "Blood and fire, that was close. But the Insurgency teaches us: a win is a win.",
      "I've got new scars. Good. They'll remind me what we survived today.",
      "My ancestors would say we walked the razor's edge and didn't fall. They'd be proud.",
      "Next time, I lead the charge. You're too valuable to risk like that.",
      "That fight took years off my life. Worth every one of them.",
    ],
  },
  {
    companionId: "kael",
    outcome: "defeat",
    lines: [
      "We fall, we rise. That's the Insurgency way. That's OUR way.",
      "Defeat is just the universe testing whether you want victory badly enough.",
      "I've been beaten before. By people far worse than this. And I'm still here.",
      "Sharpen your blade after every loss. Literal and metaphorical.",
    ],
  },
  {
    companionId: "kael",
    outcome: "first_win",
    lines: [
      "Blood and dawn! A victory to start the day. The ancestors smile on us.",
      "First fight, first win. The rest of today's enemies should take note.",
      "There's an Insurgency saying: 'Win before breakfast, conquer before dinner.'",
    ],
  },
  {
    companionId: "kael",
    outcome: "win_streak",
    lines: [
      "We are the storm! Let them try to stop what cannot be stopped!",
      "This is what the Hierarchy fears -- momentum in the hands of the righteous.",
      "Three in a row? Five? I've lost count, and I don't care. We keep going.",
      "The fire in you burns brighter with every victory. I can feel its heat.",
    ],
  },
  {
    companionId: "kael",
    outcome: "loss_streak",
    lines: [
      "The Insurgency was forged in defeat after defeat after defeat. Until it wasn't. We're in the 'until' phase.",
      "I won't lie to you and say this doesn't hurt. But pain is just the universe's way of sharpening us.",
      "Every great warrior has a chapter of losses. This is yours. The next chapter is redemption.",
      "My blade-master once beat me forty times in a row. The forty-first time, I won. He retired the next day.",
    ],
  },

  // ═══════════ LYRIS ═══════════
  {
    companionId: "lyris",
    outcome: "decisive_victory",
    lines: [
      "The data streams are singing! That was beautiful -- pure, elegant destruction.",
      "I could see the probability threads converging toward our victory. It was like watching art.",
      "Every variable aligned perfectly. Statistically improbable. Practically inevitable, with you.",
      "The patterns... they're so clear after a win like that. I can almost see the next one forming.",
    ],
  },
  {
    companionId: "lyris",
    outcome: "close_victory",
    lines: [
      "The probability threads were fraying! I was losing the pattern, and then -- you pulled it back.",
      "My hands are shaking. The data streams went dark for a moment there. I thought we'd lost the signal.",
      "That was chaos. Beautiful, terrifying chaos. The Dreamers were right -- there is meaning in disorder.",
      "I need a moment. The cognitive load of tracking that many variables nearly overwhelmed me.",
    ],
  },
  {
    companionId: "lyris",
    outcome: "defeat",
    lines: [
      "The probability threads... I couldn't find the winning pattern. I'm sorry.",
      "Loss is just data we haven't processed yet. Give me time. I'll find what we missed.",
      "The data streams don't end with one defeat. They continue. So do we.",
      "I'm already modeling what went wrong. Seventeen variables to adjust. We'll be ready next time.",
    ],
  },
  {
    companionId: "lyris",
    outcome: "first_win",
    lines: [
      "First data point of the day: victory! The probability matrix starts strong.",
      "Morning victories create cascade effects in the data streams. Today will be good.",
      "The day's first pattern is set. And it's a winning one. I can feel it.",
    ],
  },
  {
    companionId: "lyris",
    outcome: "win_streak",
    lines: [
      "The probability threads are weaving a tapestry of victories! Each one strengthens the next!",
      "I've never seen the data streams this coherent. Your winning pattern is self-reinforcing!",
      "Streaks aren't random -- they're emergent order from complex systems. You ARE the order.",
      "The Dreamers wrote about moments when probability itself seems to choose a side. This is one of those moments.",
    ],
  },
  {
    companionId: "lyris",
    outcome: "loss_streak",
    lines: [
      "The probability threads are tangled. But tangled threads can be unwound. I just need to find the right end to pull.",
      "I keep running the models, and I keep finding the same thing: the streak-breaking pattern is close. Very close.",
      "In the data streams, extended losses always precede a phase shift. Something is about to change.",
      "Don't give up. The math says the pattern must break. And the math has never lied to me.",
    ],
  },
];

/* ─── LOOKUP HELPERS ─── */

/** Get all reaction lines for a specific companion and outcome. */
export function getReactions(companionId: string, outcome: BattleOutcome): string[] {
  const entry = REACTIONS.find(
    (r) => r.companionId === companionId && r.outcome === outcome,
  );
  return entry?.lines ?? [];
}

/** Pick a random reaction line for a companion and outcome. Returns null if none found. */
export function getRandomReaction(companionId: string, outcome: BattleOutcome): string | null {
  const lines = getReactions(companionId, outcome);
  if (lines.length === 0) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

/** Determine the battle outcome type from battle results. */
export function determineBattleOutcome(opts: {
  won: boolean;
  hpPercent: number;
  isFirstWinToday: boolean;
  consecutiveWins: number;
  consecutiveLosses: number;
}): BattleOutcome {
  const { won, hpPercent, isFirstWinToday, consecutiveWins, consecutiveLosses } = opts;

  if (!won) {
    if (consecutiveLosses >= 3) return "loss_streak";
    return "defeat";
  }

  // Win outcomes (prioritize special over generic)
  if (consecutiveWins >= 3) return "win_streak";
  if (isFirstWinToday) return "first_win";
  if (hpPercent < 25) return "close_victory";
  if (hpPercent > 75) return "decisive_victory";

  // Default win that doesn't fit a special category
  return "decisive_victory";
}

/** Get all companion IDs that have reactions defined. */
export function getReactiveCompanionIds(): string[] {
  return [...new Set(REACTIONS.map((r) => r.companionId))];
}

/** Get all reactions for a companion across all outcome types. */
export function getAllReactionsForCompanion(
  companionId: string,
): Record<BattleOutcome, string[]> {
  const result: Record<BattleOutcome, string[]> = {
    decisive_victory: [],
    close_victory: [],
    defeat: [],
    first_win: [],
    win_streak: [],
    loss_streak: [],
  };
  for (const entry of REACTIONS) {
    if (entry.companionId === companionId) {
      result[entry.outcome] = entry.lines;
    }
  }
  return result;
}
