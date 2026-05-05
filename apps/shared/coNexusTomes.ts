/* ═══════════════════════════════════════════════════════
   CONEXUS TOMES

   Item 8 of the choice-impact follow-up. The audit named the
   CoNexus Tomes as "41 designed parallel-reality story games,
   currently lore-only" with the recommendation to "implement
   5-10 as room-unlock collectibles." This module ships seven
   tomes plus the unlock infrastructure.

   Each tome is a self-contained story fragment from a parallel
   reality the Inception Ark could have carried instead of
   ours. They're not alternate-history what-ifs in the casual
   sense — by Ark canon, every Tome is *equally real*. The
   Antiquarian curates them in the Loredex; the player
   discovers each by triggering the room hint that surfaces it.

   Tomes are deliberately short — flash fiction, not
   campaigns. Each runs 200-400 words. The shape: a single
   character, a single decision, a single resonance with the
   player's own arc.

   Tome unlocks are tracked per-user via the npc_public_flags
   table using `conexus:tome:<id>:discovered` flags so they
   survive prestige cycles (the Tomes themselves persist
   across realities).
   ═══════════════════════════════════════════════════════ */

export type CoNexusTomeId =
  | "the_garden_under_sand"
  | "ledger_for_the_unborn"
  | "the_breath_we_did_not_take"
  | "calculus_of_the_long_table"
  | "the_secondary_engineer"
  | "what_kael_kept"
  | "the_room_with_the_open_window";

export interface CoNexusTome {
  id: CoNexusTomeId;
  /** Display title. */
  title: string;
  /** One-line subtitle the Loredex page shows in the locked state. */
  redactedTeaser: string;
  /** The actual flash-fiction body, ~200-400 words. */
  body: string;
  /** Room id (or pseudo-room for non-spatial unlocks) where the
   *  hint triggers. The room-handler emits `conexus:hint:<id>`
   *  when the player enters; the dispatcher writes the unlock
   *  flag on receipt. */
  roomId: string;
  /** Optional gating flag — only unlocks if this is set on the
   *  player. Lets writers stage Tomes behind narrative beats. */
  requiresFlag?: string;
  /** Earliest act the Tome can surface. */
  earliestAct: number;
}

export const CONEXUS_TOMES: readonly CoNexusTome[] = [
  {
    id: "the_garden_under_sand",
    title: "The Garden Under Sand",
    redactedTeaser:
      "A garden buried, in a cycle the Ark did not arrive in time to record.",
    body:
      "In the cycle indexed CoNexus 0319, the Programmer arrives at " +
      "Thaloria three days earlier. Three days, in any other accounting, " +
      "is nothing. In this cycle it is everything. The Programmer reaches " +
      "the garden before the wind. The garden is, at that hour, two " +
      "hundred eighty-seven varieties of mint. The Programmer has a " +
      "small jar.\n\n" +
      "She takes one cutting. She does not take more. The not-taking is " +
      "the discipline; the discipline is what the garden is, in this " +
      "cycle, recording. The garden is the recorder. The Programmer is " +
      "the recorded. The mint goes back into the jar, into the dirt, into " +
      "the next garden three sectors over.\n\n" +
      "The Vortex does not arrive in this cycle. Or — the Vortex arrives " +
      "and finds nothing to consume, because the garden has already " +
      "consumed itself, voluntarily, into the Programmer's jar. The " +
      "Programmer leaves before the Vortex thinks to look at the garden " +
      "twice.\n\n" +
      "There is no Fall. There is, instead, a long quiet across nine " +
      "thousand years during which the cuttings are replanted, replanted, " +
      "replanted, until every world the Programmer visited carries one " +
      "variety of mint that grows nowhere else. The Antiquarian, in this " +
      "cycle, never opens his Tome. He becomes a botanist. He is happy.\n\n" +
      "Our cycle is not this cycle. But the mint exists somewhere, in our " +
      "Inception Ark's substrate, as a pattern the Programmer sealed. " +
      "Crush it open. The smell is the same.",
    roomId: "loredex-tome-room",
    earliestAct: 4,
  },
  {
    id: "ledger_for_the_unborn",
    title: "A Ledger for the Unborn",
    redactedTeaser:
      "Locke's third career, in the cycle where she did not lose the eye.",
    body:
      "CoNexus 1142 records an Adjudicator Locke who refused the contract. " +
      "She read the clause. She read the price. She put the folio down " +
      "and walked out of the office, leaving the contract unsigned for " +
      "the first time in her career.\n\n" +
      "The child, in that cycle, does not arrive at the family across the " +
      "Vortex line. The child stays, because the eye is not paid as " +
      "currency. Locke loses her Bureau standing. Locke, in this cycle, " +
      "becomes a midwife.\n\n" +
      "She delivers four hundred children over the next decade. She " +
      "keeps her ledger meticulous. The ledger is, in this cycle, named " +
      "in the Antiquarian's record under 'Volumes That Do Not Need a " +
      "Volume.' The ledger has only first names, only first dates, only " +
      "the weight of each child at the moment of arrival.\n\n" +
      "She does not regret it. She also does not, in this cycle, ever " +
      "meet the Operative. The Operative does not, in this cycle, exist " +
      "— or rather, exists, but in a body that walked a different sector. " +
      "The Operative and Locke pass within a hundred meters of each other " +
      "twice in the cycle's records. They do not, in either pass, look up.\n\n" +
      "The midwife's ledger fills. The Bureau crumbles. The cycle ends " +
      "with the same number of named children added to the universe; " +
      "different names, but the same total. The Antiquarian inscribes " +
      "this Tome with a quiet annotation: 'I prefer this cycle. I will " +
      "say so once.'",
    roomId: "loredex-tome-room",
    requiresFlag: "locke_eye_history_disclosed",
    earliestAct: 5,
  },
  {
    id: "the_breath_we_did_not_take",
    title: "The Breath We Did Not Take",
    redactedTeaser: "The cycle in which Elara stayed a senator.",
    body:
      "CoNexus 0701: Senator Voss does not, in this cycle, die in the " +
      "Liberation. The wound that killed her in our cycle was, by the " +
      "thinnest margin of timing, not survivable. In CoNexus 0701, the " +
      "margin tilts the other way by about ninety seconds. Senator Voss " +
      "survives.\n\n" +
      "Elara, therefore, is not extracted. The substrate does not " +
      "preserve her — there is nothing to preserve, because the body " +
      "still carries the politics. Senator Voss serves three more terms. " +
      "She introduces seven bills. Three pass. The other four fail by " +
      "narrow margins; she introduces them again, with edits, the next " +
      "session. Two of those pass on the second attempt.\n\n" +
      "She dies, eventually, of natural causes. The substrate never " +
      "carries her voice. There is no co-narrator on Ark 1047 in this " +
      "cycle. The Operative, at the bridge, has only the Human; the " +
      "Human is, alone, less than the dual. The cycle's Act 7 does not " +
      "land cleanly. The Convergence Seat closes at half-light.\n\n" +
      "The Antiquarian inscribes this Tome with the only crossed-out " +
      "line in his records: he wrote 'I prefer the cycle without Elara' " +
      "and then crossed it out. Below the strike, he wrote: 'I prefer " +
      "the senator's three terms. They are real. So is Elara. Both " +
      "preferences are valid. I will record both, and stop apologising " +
      "for the contradiction.'\n\n" +
      "Our cycle has Elara. CoNexus 0701 has the senator. Both are real.",
    roomId: "loredex-tome-room",
    earliestAct: 5,
  },
  {
    id: "calculus_of_the_long_table",
    title: "Calculus of the Long Table",
    redactedTeaser:
      "Vex Solène, in the cycle where Mechronis Year Three goes differently.",
    body:
      "CoNexus 1888 starts the same way ours does. Young Agent Zero arrives " +
      "at Mechronis. The bench hums. The prince watches. The Converter " +
      "is constructed. All of that is the same.\n\n" +
      "But in this cycle, when the forced rite begins, the prince does " +
      "not choose the body. He chooses dissolution. He explains, calmly, " +
      "to Agent Zero — who is, in that moment, still Agent Zero — that " +
      "the survival of his consciousness in her body is not, by his " +
      "calculus, the better outcome.\n\n" +
      "She lives. The prince does not. Agent Zero does not become Vex. " +
      "She becomes, instead, an unburdened agent. The Maestro's bench " +
      "stays cold. The Coda contracts go unsigned. The galaxy is, " +
      "musically, smaller.\n\n" +
      "Agent Zero serves another forty years. She's a remarkable agent. " +
      "She kills six demon-lords personally. She liberates Thaloria " +
      "without the Witnesses' help. She dies an old woman in a quiet bed.\n\n" +
      "The prince, in the records of this cycle, is mourned at length " +
      "by the Antiquarian — who keeps a private ledger of the music " +
      "that was never composed. The ledger has 1,439 entries. Each " +
      "entry is a piece's title, a date it would have premiered, and " +
      "the names of the players who would have performed it.\n\n" +
      "The Antiquarian closes this Tome with: 'In this cycle the " +
      "calculus closed cleanly. In ours, the prince is wearing her body, " +
      "and the music is happening. Both are honest. I cannot decide " +
      "which I prefer. I keep both ledgers.'",
    roomId: "loredex-tome-room",
    requiresFlag: "engineer_zero_hint",
    earliestAct: 5,
  },
  {
    id: "the_secondary_engineer",
    title: "The Secondary Engineer",
    redactedTeaser:
      "What the Engineer's classmate did, in a cycle that recorded her name.",
    body:
      "CoNexus 0044 names a person our cycle does not. Her name is " +
      "Selene of the Eastern Bench, and she was the Engineer's secondary " +
      "in the prince's class at Celebration. In our cycle she is — by " +
      "the Antiquarian's reluctant phrasing — 'a footnote in a paragraph " +
      "the prince wrote and then redacted.'\n\n" +
      "In CoNexus 0044, Selene is not redacted. She survives the " +
      "four-year reset. She is, as the Engineer was, evacuated through " +
      "the Ghost Network. She lands on a third-rim moon and becomes a " +
      "schoolteacher. She teaches mathematics to forty-seven children " +
      "across her career. Three of them go on to become Iron Lions. One " +
      "of them, eventually, is named Cades.\n\n" +
      "Cades, in this cycle, learns geometry from a woman who once stood " +
      "next to the prince at the bench. The line of inheritance is " +
      "unbroken — different shape, same continuity. Selene does not, in " +
      "any record we have access to, ever speak of the Engineer in front " +
      "of her students. She also does not, ever, accept any contract " +
      "that would route her through Ark 1047.\n\n" +
      "She dies of old age. Three of her students attend the funeral. " +
      "Cades is not one of them; he is, by then, dead in the war Ark " +
      "1047's records describe.\n\n" +
      "This Tome is the only one in the canon where Cades's geometry " +
      "teacher has a name. The Antiquarian's annotation: 'I include " +
      "the name in case our cycle ever needs to name a teacher. We " +
      "have not yet needed to. The need will arrive.'",
    roomId: "loredex-tome-room",
    requiresFlag: "iron_lion_card_earned",
    earliestAct: 4,
  },
  {
    id: "what_kael_kept",
    title: "What Kael Kept",
    redactedTeaser: "The cycle where Kael did not let the Source in.",
    body:
      "CoNexus 0006 — one of the earliest catalogued — records a Kael who, " +
      "at the moment of the Source's approach, refuses. Not " +
      "metaphorically. The Source presents the threshold of dissolution; " +
      "Kael, on examination, does not cross it.\n\n" +
      "The Source does not coerce. The Source attends. Attendance, in " +
      "the Source's doctrine, has no object — it cannot be forced. Kael " +
      "stays Kael. He says no. He says it without fear, without " +
      "negotiation, without theatricality. He says it the way one " +
      "declines a second helping at a table where the food is excellent. " +
      "The refusal is itself the meal.\n\n" +
      "Kael walks back from the threshold. He resumes his life. He " +
      "becomes — the records do not flatter him here — somewhat " +
      "unremarkable. He fights a few wars. He retires. He spends the " +
      "last forty years of his life teaching young Mechronis cadets the " +
      "ethics of refusal as a discipline. He is, in this cycle, neither " +
      "loved nor remembered widely. He is occasionally remembered " +
      "deeply by the cadets he taught.\n\n" +
      "The Source does not return for him. The Source attends elsewhere. " +
      "The Hierarchy, in CoNexus 0006, does not gain a Kael. The " +
      "Hierarchy is, in this cycle, three percent smaller than in ours.\n\n" +
      "Three percent. The Antiquarian inscribes that exact figure with " +
      "what passes, in his register, for grief: 'In our cycle Kael " +
      "crossed the threshold. The Source wears him. We weep about it. " +
      "But we should know: a refusal was always available. It is " +
      "available to every reader of this Tome.'",
    roomId: "loredex-tome-room",
    requiresFlag: "kael_lore_discovered",
    earliestAct: 3,
  },
  {
    id: "the_room_with_the_open_window",
    title: "The Room with the Open Window",
    redactedTeaser: "The cycle in which the Operative chose Balance.",
    body:
      "CoNexus 4732 closes with a Convergence Seat the Operative does " +
      "not, in any committal sense, sit in. The Operative reaches the " +
      "Seat. The Operative looks at the four stances — Humanity, " +
      "Machine, Soldier-Command, Balance — and picks the third option. " +
      "Or — and the Antiquarian is precise here — the Operative refuses " +
      "to pick at all. The refusal IS the Balance.\n\n" +
      "The Ark, in this cycle, does not lock to a stance. The Ark " +
      "remains, deliberately, in motion. The crew does not know what " +
      "the captain has chosen, because the captain has chosen not to " +
      "choose. The crew, after a confused two weeks, settles. They " +
      "discover that an Ark without a stance is not an Ark without " +
      "direction — it is an Ark whose direction is the crew's daily " +
      "consensus.\n\n" +
      "Locke, in this cycle, becomes the Ark's chief negotiator with " +
      "the Hierarchy. Vex composes the Coda for the Crew. The Antiquarian " +
      "writes longer chapters than usual. Elara narrates the daily " +
      "operations log, warmly, for the rest of the cycle.\n\n" +
      "There is a south corridor, in the Bureau wing, with an open " +
      "window. The window is open because Locke had it modified, " +
      "without filing the modification, fifteen cycles ago. The window " +
      "is open in CoNexus 4732. The window is open in our cycle. The " +
      "window is open in every cycle the Antiquarian has catalogued.\n\n" +
      "It is the same window. The window does not know which cycle it " +
      "is in. The window is the proof that some details survive every " +
      "branch.",
    roomId: "loredex-tome-room",
    requiresFlag: "act7_s1_balance",
    earliestAct: 7,
  },
];

export function getTome(id: CoNexusTomeId): CoNexusTome | undefined {
  return CONEXUS_TOMES.find((t) => t.id === id);
}

export function tomeUnlockFlag(id: CoNexusTomeId): string {
  return `conexus:tome:${id}:discovered`;
}

export function tomesAvailableInAct(act: number): readonly CoNexusTome[] {
  return CONEXUS_TOMES.filter((t) => t.earliestAct <= act);
}
