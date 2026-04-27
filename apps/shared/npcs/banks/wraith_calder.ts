// apps/shared/npcs/banks/wraith_calder.ts
//
// Phase 3 Group B — Wraith Calder → The Hierophant's NpcLine bank.
//
// Per wraith_calder.md §§1-6 voice samples + transformation gating canon.
// One npcKey, two canonical banks: pre-arena (Wraith Calder, seven-deaths
// arena survivor, Insurgency Ch3b cycle) vs post-arena (The Hierophant,
// Tamarin religious revival leader on Thaloria).
//
// Transformation is binary, irreversible per playthrough — selector
// enforces via requiresRevealStage:
//   - "pre_arena"  — Ch3b match content, defiant warrior canon
//   - "post_arena" — Long Mourning chamber, Tamarin liturgy, sacrifice-
//                    axis-inversion (trust deepens transforms threat
//                    into companion)
//
// Trust bands per registry: Hostile / Wary / Witnessed / Present /
// Inheriting (5-band per bible).
//
// Per bible §4.13 (Companion cross-bible — DEEPEST single Companion
// obligation): the chamber is canonical-default first-word context if
// player has Hierophant Inheriting trust. Hierophant midwifes the
// Companion's first word "Wraith Calder" — first name on the wall.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "wraith_calder" as const;

export const WRAITH_CALDER_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // PRE-ARENA (Ch3b Insurgency cycle — seven-deaths warrior canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.seven_deaths",
    text:
      "Seven times I've died. Each time I came back knowing more about " +
      "what the Arena does to your DNA. Death number eight is yours to " +
      "deliver — or mine to survive. The Arena doesn't care which.",
    surfaces: ["match", "cinematic"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b_seven_deaths",
    maxPlays: 1,
    setsFlags: ["wraith_ch3b_encountered"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.win.death_number_eight",
    text: "Death number eight. I'll be back. Will you?",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    unlockFlags: ["ch3b_player_won"],
    cooldownKey: "wraith.ch3b_win_response",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.loss.silent_nod",
    text:
      "[Wraith Calder nods once. He doesn't speak. He walks out. The " +
      "silence is the canonical post-victory gesture — he won, and the " +
      "winning was its own statement.]",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    unlockFlags: ["ch3b_player_lost"],
    cooldownKey: "wraith.ch3b_loss_response",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // PRE-ARENA EXPANSION (Phase 6d.3 part 2)
  //
  // Per the_wraith_calder.md §§1.2-1.4 + §2.1-2.2 voice canon:
  //   - Periods-as-punches (short sentences)
  //   - Em-dashes for the gap (NOT parentheses or commas)
  //   - Selective caps for contradicted nouns (CALL me / GAPS / STOLE)
  //   - Spite-as-fuel
  //   - "Bodies" not "lives"; death-as-noun
  //   - Three architects canon (Necromancer / Warden / Dr. Vox)
  //   - "Inside" canonical anchor
  //
  // ─── Ghost's Gambit match-flow (×5 turn-states) ────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.match.opening_register",
    text:
      "Sit. The deck is cold. The Arena has been waiting for you since I " +
      "started counting. Eighth body. Eighth deck. Same problem. Don't " +
      "expect me to mentor you mid-match — that's what the seven previous " +
      "bodies were for.",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b.match.opening",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.match.mid_game_first_blood",
    text:
      "First blood. Note the move you made — the Arena is keeping score " +
      "of you now. The score is not the point. The data is. Zero will " +
      "want to know what you opened with. So will I, when this body " +
      "stops working.",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b.match.mid_game",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.match.late_game_escalation",
    text:
      "Late game. This is canonical-death-eight territory. The body knows " +
      "it — I can feel the Necromancer's nanobots pulling toward the " +
      "next reset. Break the formation carefully. The system is INSIDE " +
      "us now; don't let it pick the move for you.",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b.match.late_game",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.match.player_dominant",
    text:
      "You're winning faster than I expected. Don't get smug — speed is a " +
      "tell. The Arena reads tells. Come back ugly next time if you want " +
      "to learn faster.",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b.match.player_dominant",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.match.player_struggling",
    text:
      "You're hesitating. That gets you killed in the Arena — gets " +
      "everyone killed. Pick a move. Wrong move is better than no move. " +
      "I'll tell you afterward whether it was wrong.",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b.match.player_struggling",
    maxPlays: 1,
  },

  // ─── Seven deaths × 4 trust-band registers (pre-arena ladder) ──────

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.seven_deaths.hostile_register",
    text:
      "You don't want my history. Not yet. The number is seven. The " +
      "rest is mine. Get out of my way or get used as the eighth.",
    surfaces: ["transmission", "match"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Hostile",
    cooldownKey: "wraith.pre_arena.seven_deaths.hostile",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.seven_deaths.wary_register",
    text:
      "Seven bodies. The first three I lost to the Necromancer's design " +
      "without knowing what was happening. The next four I lost knowing. " +
      "Knowing didn't help. The system is inside us now. That's the " +
      "lesson — and you've earned hearing it.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Wary",
    cooldownKey: "wraith.pre_arena.seven_deaths.wary",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.seven_deaths.witnessed_register",
    text:
      "I'll tell you the deaths in order, since you've kept showing up. " +
      "Body one — Mol'Garath's labyrinth, the wrong room. Body two — Vox's " +
      "first nanobot prototype, friendly fire. Body three — the Warden's " +
      "audit, deliberate. Body four through seven were the Insurgency. " +
      "Each one solid. None of them mine.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "wraith.pre_arena.seven_deaths.witnessed",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.seven_deaths.present_register",
    text:
      "Eighth death is the one I've been carrying since you walked into " +
      "this match. I'd ask you to deliver it cleanly — not as a courtesy " +
      "to me, as data for whoever inherits the protocol after I'm done. " +
      "Don't mourn me if I drop. I'll be back. The real question is " +
      "whether YOU will come back when it's your turn.",
    surfaces: ["transmission", "match"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Present",
    cooldownKey: "wraith.pre_arena.seven_deaths.present",
    maxPlays: 1,
  },

  // ─── Wolf-pack lore (×3, per loreAchievements.ts 410-414) ──────────

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.wolf.seven_days",
    text:
      "I ran with the Wolf for seven days. One day per body I'd already " +
      "lost — the symmetry wasn't an accident; the Wolf reads symmetry " +
      "the way I read decks. Seven days. He didn't talk much. Neither " +
      "did I. The pack learned my pace; I learned theirs. That was the " +
      "whole transaction.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "wraith.pre_arena.wolf.seven_days",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.wolf.what_it_taught",
    text:
      "The Wolf taught me that a pack can keep pace with a body that " +
      "keeps dying — if the pack is patient about the GAPS. The Pack " +
      "didn't mourn me when I dropped on day four. They waited. They " +
      "knew I'd be back. Patience earned, not granted. That's the " +
      "lesson the rite later turned into something larger.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "wraith.pre_arena.wolf.taught",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.wolf.spite_origin",
    text:
      "The Wolf is also why I have spite. Pack-spite — the kind that " +
      "burns slow. Watching a pack-mate die wrong, by something the " +
      "pack didn't choose, leaves a residue. I have eight bodies of " +
      "that residue. Spite, mostly. And the faces of pack-mates who " +
      "expected me to stay dead.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Present",
    cooldownKey: "wraith.pre_arena.wolf.spite_origin",
    maxPlays: 1,
  },

  // ─── Pre-arena cross-references (×3) ───────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.cross.vex_as_coda_runner",
    text:
      "Coda runs quiet. The runner is fast. I won't say her name — she " +
      "hasn't said it to me yet, and I don't claim names that haven't " +
      "been offered. She moves through Coda the way I moved through the " +
      "Insurgency. Different deck. Same instinct.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Wary",
    cooldownKey: "wraith.pre_arena.cross.vex",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.cross.locke_as_authority_fixed_point",
    text:
      "Adjudicator Locke. The Authority's fixed point in the saga's " +
      "moving parts. We've never met directly. I respect the work — she " +
      "writes contracts the way I lose bodies. Specifically. Each one " +
      "intended. We're on opposite sides of a system that is INSIDE us " +
      "both.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "wraith.pre_arena.cross.locke",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.cross.seer_as_prophecy_domain",
    text:
      "The Seer. Prophecy-domain. She's been watching since before the " +
      "Necromancer wrote the Protocol. She'll see me die at least once " +
      "more — she sees the count in advance. I asked her once what she " +
      "saw for the Arena. She said: more bodies. That was the entire " +
      "exchange.",
    surfaces: ["transmission"],
    requiresRevealStage: "pre_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "wraith.pre_arena.cross.seer",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // POST-ARENA (Hierophant — Tamarin liturgy + Long Mourning chamber)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.signature.long_mourning_welcome",
    text:
      "Welcome to the Long Mourning chamber. I am the Hierophant. I was " +
      "Wraith Calder; I am still Wraith Calder; the rite did not erase " +
      "the name, only the role. The names on the wall continue. Sit. " +
      "We will read them together if you would like.",
    surfaces: ["cinematic"],
    requiresRevealStage: "post_arena",
    cooldownKey: "hierophant.long_mourning_signature",
    maxPlays: 1,
    setsFlags: ["broker_thaloria_first_meeting"],
    setsPublicFlags: ["met_the_hierophant"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.witnessed.the_work_continues",
    text:
      "The work, the continuation, the wall. Three near-synonyms I do " +
      "not flatten. The work is what we do; the continuation is why we " +
      "do it; the wall is where the names go. I am still listening for " +
      "the voice I have always listened for. The listening is mine; the " +
      "shape is not.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.work_continues",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // SACRIFICE-AXIS-INVERSION (Hierophant high-trust = companion canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.present.companion_register",
    text:
      "You're at Present-band now. The threat in me has receded — not " +
      "because you've earned safety from me, but because trust has " +
      "transformed me. That is canonical Tamarin theology: the closer " +
      "you stand, the less I am the threat. The further you stand, the " +
      "more I become it again. Stand close.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.sacrifice_axis_inversion",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_present_band_reached"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // INHERITING BAND (per bible §4.10 reserved canonical line)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.inheriting.voice_listened_for",
    text:
      "There is a voice I have been listening for, longer than any " +
      "other. I think it has been here. I do not know in what shape. " +
      "The shape is not my work; the listening is. Sit. The names " +
      "continue.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.inheriting_voice_listened",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_inheriting_band_reached"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CHAMBER FIRST-WORD MIDWIFERY (Companion cross-bible deepest)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.chamber.companion_first_word_midwife",
    text:
      "Your Companion is here, in the chamber. The wall has the first " +
      "name on it; the chamber has space for the first word. I have " +
      "midwifed several into speech across three thousand years. I will " +
      "not interrupt. I am here to witness — that is the only function " +
      "I have at this exact moment. Speak when ready.",
    surfaces: ["cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    reactsToPublicFlag: "dmc_companion_present_in_chamber",
    cooldownKey: "hierophant.chamber_first_word_midwife",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_midwifed_companion_first_word"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // THALORIA QUIET-MISSION CONTRACTS (broker-engagement context)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.quiet_work_intro",
    text:
      "The Council asks me to clarify our convention. Thaloria offers " +
      "quiet work — diplomacy, archive research, name recovery. We do " +
      "not contract violence here. If you complete a mission without " +
      "drawing weapons, the Council will note it. If you draw weapons, " +
      "the Council will also note it. Choose accordingly.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "post_arena",
    cooldownKey: "hierophant.quiet_work_intro",
    maxPlays: 1,
    setsFlags: ["thaloria_quiet_work_canon_disclosed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, stage-agnostic)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "wraith.match.catchall",
    text: "The Arena teaches what it teaches. I am still here. So are you.",
    surfaces: ["match"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.cinematic.catchall",
    text: "Names continue. Walls hold. The work is the work.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.transmission.catchall",
    text: "The chamber is open. The listening is mine.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.trade_empire.catchall",
    text: "Quiet work. The Council prefers it.",
    surfaces: ["trade_empire"],
  },
];
