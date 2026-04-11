/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — SOUL STONE CRAPS TABLE
   The Degen's Casino: Dice of Fate

   Cost: 1 Soul Stone per roll. The player wagers their
   stone against the Hierarchy's favor. The Degen runs the
   table with commentary that ranges from sympathetic to
   unhinged.

   Dice totals 2-12 mapped to outcomes.
   ═══════════════════════════════════════════════════════ */

export type CrapsOutcome =
  | "hierarchy_claims"
  | "loss_to_pool"
  | "blessed"
  | "win"
  | "miracle";

export interface CrapsResult {
  total: number;
  name: string;
  outcome: CrapsOutcome;
  description: string;
  degenDialog: string;
}

export const CRAPS_OUTCOMES: Record<number, CrapsResult> = {
  2: {
    total: 2,
    name: "Snake Eyes",
    outcome: "hierarchy_claims",
    description: "The Hierarchy claims the stone. It turns red instantly — corrupted beyond recovery. A faint laugh echoes from somewhere below the Ark's hull. You gain 1 Corruption Point whether you wanted it or not.",
    degenDialog: "Oh no. Oh NO. Snake eyes. The Hierarchy just — yeah, that stone's gone. It turned red before it hit the table. I've seen a lot of bad rolls, friend, but that one? That one had INTENT behind it. The Hierarchy was WAITING for that stone. You feel that chill? That's not the air conditioning.",
  },
  3: {
    total: 3,
    name: "Low Tide",
    outcome: "loss_to_pool",
    description: "The stone slips from your grasp and dissolves into the community pool. It will be redistributed during the next milestone reward. Your loss is the community's gain.",
    degenDialog: "Three. Tough break. Your stone goes to the community pool — think of it as an involuntary donation. The Antiquarian would say something about 'the river giving back to the sea.' I say you got robbed. But hey, at least it helps everyone.",
  },
  4: {
    total: 4,
    name: "Cold Dice",
    outcome: "loss_to_pool",
    description: "The dice land cold. Your Soul Stone fades to grey and joins the community pool. Somewhere, a future milestone reward grows slightly larger because of your sacrifice.",
    degenDialog: "Four. The dice went cold on you. Stone's heading to the pool. Look, I'm not gonna sugarcoat it — you lost. But losses at my table feed the community chest, and that chest feeds milestones, and milestones feed LCIF. So technically? You just did charity. You're welcome.",
  },
  5: {
    total: 5,
    name: "The Gambler's Sigh",
    outcome: "loss_to_pool",
    description: "Not quite enough. The stone dissolves into motes of light that drift toward the community pool. The Degen pours you a complimentary drink.",
    degenDialog: "Five. So close to nothing, so far from something. Your stone's gone to a better place — the community pool. I'd offer you a consolation prize but all I've got is this eggnog. It's three weeks old. [pause] ...it's better than it sounds.",
  },
  6: {
    total: 6,
    name: "Almost",
    outcome: "loss_to_pool",
    description: "One short of blessed. The stone trembles on the edge between return and dissolution, then collapses into the community pool. The Degen winces on your behalf.",
    degenDialog: "Six. ONE off from a blessing. ONE. I physically felt that. The stone was VIBRATING — it wanted to come back to you. But the dice don't care about wanting. Stone goes to the pool. You want to try again? [leans in] The dice remember courage.",
  },
  7: {
    total: 7,
    name: "The Degen's Blessing",
    outcome: "blessed",
    description: "SEVEN! The holy number. Your Soul Stone lifts off the table, glowing gold. It is purified — instantly, freely, without the usual 24-hour wait or 100 Dream Token cost. The Dreamer's light fills the casino for a brief, beautiful moment.",
    degenDialog: "SEVEN! THE LUCKY NUMBER! [he slams the table] FREE PURIFICATION! No tokens, no wait, no fifteen-percent-failure-rate nonsense — your stone just went GOLD. The Dreamer herself just kissed that stone. I don't care what anyone says about me — I run a BLESSED table. [he's genuinely emotional] That never gets old.",
  },
  8: {
    total: 8,
    name: "Solid Return",
    outcome: "win",
    description: "A clean win. Your Soul Stone is returned to you unharmed, and the Degen flips you a bonus Festive Token from his personal stash.",
    degenDialog: "Eight! Clean win. Stone comes back, PLUS a Festive Token from my personal collection. Don't spend it all in one place. [winks] Actually, DO spend it all in one place. Preferably at my wheel.",
  },
  9: {
    total: 9,
    name: "Lucky Nine",
    outcome: "win",
    description: "The dice favor you. Your Soul Stone returns, slightly warmer than before. A bonus Festive Token materializes beside it.",
    degenDialog: "Nine! The dice like you. Stone's back, token's yours. You know what nine is? It's the Necromancer's favorite number. Something about 'the space between completion and transcendence.' I think he just likes how it sounds. Either way — you win.",
  },
  10: {
    total: 10,
    name: "Double Digits",
    outcome: "win",
    description: "A strong roll. Your Soul Stone returns with a faint golden shimmer at its edges. One bonus Festive Token accompanies it.",
    degenDialog: "TEN! Double digits, baby! Your stone comes back looking BETTER than when you wagered it — see that gold shimmer? That's the table's energy rubbing off. Plus a token for your trouble. The house loses and I couldn't be happier about it.",
  },
  11: {
    total: 11,
    name: "The Degen's Grin",
    outcome: "win",
    description: "Eleven — the Degen's personal lucky number. Your stone returns and you receive a bonus Festive Token. The Degen grins wide enough to see his gold tooth.",
    degenDialog: "ELEVEN! That's MY number! The Degen's number! [he shows you his gold tooth, which has '11' engraved on it] Stone back, token yours, and you've earned my personal respect. Not that my respect is worth much — but it's ENTHUSIASTIC.",
  },
  12: {
    total: 12,
    name: "BOXCARS — The Miracle",
    outcome: "miracle",
    description: "TWELVE! BOXCARS! The impossible roll. Your Soul Stone returns PLUS a bonus Soul Stone materializes from pure casino energy PLUS a Gift Box appears in a shower of holographic confetti. The Degen leaps over the table. The Antiquarian looks up from his Chronicle. Even the Necromancer pauses.",
    degenDialog: "BOXCARS! BOXCARS! [he vaults over the craps table] TWELVE! A MIRACLE AT MY TABLE! Stone back — BONUS stone — AND a Gift Box! [he's running around the casino] DID EVERYONE SEE THAT?! THE DEGEN'S TABLE JUST PRODUCED A MIRACLE! [composes himself, straightens his collar] I mean. Ahem. Congratulations. The house is... delighted. [he is not composed at all, he is vibrating with joy]",
  },
};
