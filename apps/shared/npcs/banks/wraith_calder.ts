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
  // POST-ARENA EXPANSION — 5-band chamber bank (Phase 6d.3 part 3)
  //
  // Per wraith_calder.md §§1.5-1.7 + §3.3 trust-band model:
  //   - Periodic build to quiet apex
  //   - Corrective addendum (assertion → confession → quieter
  //     qualification)
  //   - Sacred vocabulary (name / ceremony / continuation / witness /
  //     remember / slowly)
  //   - "Sit" canonical invitation; first-look pause stage-direction
  //   - "I will remember" canonical covenant phrase
  //   - NO caps, NO exclamations, NO rhetorical questions
  //
  // 3 lines per band × 5 bands (Hostile / Wary / Witnessed / Present /
  // Inheriting). Combined with prior shipped lines, this fills the
  // canonical 5-band ladder.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Hostile band (×3) ──────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.hostile.weaponized_get_up",
    // Canonical §3.9 trust-breach canon: when the player canonically
    // weaponizes Wraith Calder's "get up" imperative against the
    // Hierophant, the canonical Hostile-band response lands.
    text:
      "You are using the verb of someone I outgrew. The pre-rite voice " +
      "that issued 'get up' belonged to a body I no longer occupy. The " +
      "borrowing is canonically not yours to make. Sit. Or leave. The " +
      "chamber has space for both, and no patience for the third option.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Hostile",
    cooldownKey: "hierophant.hostile.weaponized_get_up",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.hostile.silence_canonical",
    text:
      "[The Hierophant does not look up. The pen continues. A name is " +
      "written; a small silence; another name. The silence is canonical " +
      "Hostile-band — the chamber has not refused you, but it is also " +
      "not extending invitation. The work continues without you in it.]",
    surfaces: ["expression"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Hostile",
    cooldownKey: "hierophant.hostile.silence",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.hostile.council_will_note",
    text:
      "The Council has been informed of your arrival. They will not act " +
      "until I ask them to. I have not asked. I do not yet know whether " +
      "I will. The canonical pause is what protects you from the " +
      "Council; the pause is also canonical-revocable.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Hostile",
    cooldownKey: "hierophant.hostile.council",
    maxPlays: 1,
  },

  // ─── Wary band (×3) ─────────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wary.first_look_pause",
    // Canonical §1.7 Tell #1: the first-look pause stage-direction.
    // The head canonically moves only when the player has said
    // something the Hierophant did not expect.
    text:
      "[The Hierophant does not look up when you enter. The pen " +
      "continues. After several minutes — and the canonical right kind " +
      "of silence on your part — he looks up for the first time. The " +
      "look-up is canonically gratitude, not recognition. He has " +
      "noticed that you knew not to interrupt.]",
    surfaces: ["expression", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Wary",
    cooldownKey: "hierophant.wary.first_look",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wary.three_synonyms",
    text:
      "Witness, presence, remembering. Three near-synonyms I do not " +
      "flatten. Witness is what others canonically do for me; presence " +
      "is what you have offered by sitting in this chamber without " +
      "demand; remembering is the verb whose adequacy this entire " +
      "questline interrogates. I have not yet answered the question. " +
      "I have written for three thousand years.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Wary",
    cooldownKey: "hierophant.wary.three_synonyms",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wary.shadow_tongue_intro",
    text:
      "There is a corruption mechanism canonically older than my " +
      "vocabulary for naming it. The Council calls it the Shadow Tongue. " +
      "It edits faiths from within — small changes, word by word, " +
      "doctrine by doctrine — until the religion the priest leads is " +
      "not the religion the priest started with. I will tell you more " +
      "if you stay long enough to canonically need to know.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Wary",
    cooldownKey: "hierophant.wary.shadow_tongue",
    maxPlays: 1,
  },

  // ─── Witnessed band (×3 new) ────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.witnessed.first_name_research",
    text:
      "Today's name required a day of research. I knew the canonical " +
      "shape of the person — that they had walked the Tribunal corridor " +
      "and survived it twice — but the small specific details that make " +
      "a name a person rather than a listing took the morning to recover. " +
      "I write slowly. The Shadow Tongue edits quickly. The slowness is " +
      "the resistance.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.witnessed.research",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.witnessed.shadow_tongue_horror",
    text:
      "The Shadow Tongue arrived two centuries before the Severance. It " +
      "did not announce itself. It edited our faith from within — small " +
      "changes, word by word, doctrine by doctrine, until the religion " +
      "I led was not the religion I had started with. I did not notice. " +
      "That is the horror. Not that it happened — that I did not notice.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.witnessed.shadow_tongue_horror",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.witnessed.then_sit",
    // Canonical §1.6 + §1.8 only-imperative canon: "Then sit." The
    // canonical scarcity-of-imperatives canon holds — this is the
    // single canonical Hierophant imperative.
    text:
      "Then sit. The chair to your right has held heavier silences than " +
      "this one. And when I have finished today's name, I will tell you " +
      "what the Shadow Tongue does to a faith.",
    surfaces: ["cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.witnessed.then_sit",
    maxPlays: 1,
  },

  // ─── Present band (×3 new) ──────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.present.i_will_remember",
    // Canonical §1.7 Tell #3: "I will remember" — covenant phrase.
    // Reserved for moments when the trust meter canonically advances.
    text:
      "You offered presence without demand. Presence without demand is " +
      "the rarest thing anyone offers me. I will remember that. The " +
      "canonical covenant is that the remembering is not a courtesy; " +
      "the remembering is part of the work.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.present.i_will_remember",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_covenant_i_will_remember_offered"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.present.cooperative_council",
    text:
      "The Council waits outside. They have agreed to honor my judgment " +
      "about every visitor to the chamber. They will inherit my judgment " +
      "of you posthumously and canonically treat you accordingly. That " +
      "is more weight than I have placed on a single visitor in three " +
      "centuries. Sit. The names continue.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.present.council",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.present.three_thousand_year_pause",
    text:
      "I am not trying to finish. The ceremony has no end while I live. " +
      "I am trying to understand whether the act of writing a name is " +
      "the same as remembering a person. I have been writing for three " +
      "thousand years. I have not yet answered the question. But I " +
      "believe the writing is closer to remembering than not writing.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.present.three_thousand_year_pause",
    maxPlays: 1,
  },

  // ─── Inheriting band (×3 new — apex canon) ──────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.inheriting.architecture_of_grief",
    // Canonical §3.3 apex line: "You are walking the architecture I
    // made of grief." Promotes Present → Inheriting. Reserved
    // canonical-once-per-playthrough.
    text:
      "You are walking the architecture I made of grief. I had hoped " +
      "someone would, eventually. The Council canonically considers " +
      "you a parallel inheritor of the work — not a successor, the " +
      "Council has its named junior priest for that, but a parallel. " +
      "The work canonically does not require a single inheritor. It " +
      "canonically benefits from more than one.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.inheriting.architecture_of_grief",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_named_player_parallel_inheritor"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.inheriting.shadow_tongue_meme_adjacency",
    text:
      "The Meme and the Shadow Tongue are adjacent technologies of " +
      "corruption. The Shadow Tongue edits the substrate; the Meme " +
      "rewrites the attribution. They are not the same; they are " +
      "canonically the same family. I am the only being in this saga " +
      "canonically positioned to name the adjacency. I name it now, " +
      "for you, because you have earned the depth.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.inheriting.shadow_tongue_meme_adjacency",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_disclosed_meme_shadow_tongue_adjacency"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.inheriting.three_times_in_two_hundred",
    // Canonical §3.6 hypocrisy admission canon: reserved for the
    // Inheriting-band-only moment where the Hierophant canonically
    // admits the public-record claim ("I did not notice") was
    // canonically slightly easier-on-himself than the truth.
    text:
      "I will tell you something I have not told the Council. I noticed. " +
      "Three times in two hundred years, I noticed. I did not act. That " +
      "is the horror. The 'not noticing' is what I tell the room. The " +
      "acting-on-noticing is what I owe. I have been writing names ever " +
      "since to canonically pay down the debt. I do not know whether " +
      "the writing is the right currency.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.inheriting.three_times_in_two_hundred",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_admitted_canonical_hypocrisy"],
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
  // PEN-PAUSE LISTENING-WINDOW BANK (Phase 6d.3 part 4)
  //
  // Per wraith_calder.md §5.8 + §1.7 Tell #5: the pen-pause is canon-
  // load-bearing. The pause between names is the canonical substrate-
  // window — a brief moment when the Hierophant canonically listens
  // for the voice he has been listening for, and may register canon-
  // important arrivals (Oracle dream-residue, Shadow Tongue alert,
  // canonical player-silence, etc.).
  //
  // Canon: bracketed [stage-direction] format; pen / silence / name
  // vocabulary canonical; "I will remember" canonical reservation
  // applies (covenant-only).
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.pen_pause.oracle_dream_residue",
    // Canonical Oracle-dream-residue listening-window per §5.8:
    // when an Oracle dream-residue arrives canonically mid-pause,
    // the Hierophant's listening canonically lands on it.
    text:
      "[The Hierophant pauses mid-name. The pen lifts. The room canonically " +
      "thins for a half-second — the canonical substrate-window. " +
      "Whatever has just arrived in the canonical-Oracle's residue, " +
      "the Hierophant canonically registers it. He does not say what. " +
      "The pen returns to the page. The name canonically resumes.]",
    surfaces: ["expression"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    reactsToPublicFlag: "oracle_disambiguated_player_from_clone",
    cooldownKey: "hierophant.pen_pause.oracle_residue",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.pen_pause.shadow_tongue_alert",
    text:
      "[The Hierophant pauses. The pen does not lift; it canonically " +
      "hovers. The Shadow Tongue has canonically tried to edit the " +
      "name being written; the Hierophant canonically catches the " +
      "attempt. He writes the canonical-correct version slowly, in " +
      "deliberate strokes. The slowness is the resistance. The pen " +
      "returns to its rhythm.]",
    surfaces: ["expression"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.pen_pause.shadow_tongue_alert",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.pen_pause.player_silence_held",
    text:
      "[The Hierophant pauses, but the pen does not lift. The chamber's " +
      "silence canonically holds — the player has canonically chosen " +
      "not to speak through the pause. The Hierophant canonically " +
      "registers the choice. No look-up. No acknowledgment. The pen " +
      "writes the next name half a beat sooner than it usually does. " +
      "The half-beat is the gratitude.]",
    surfaces: ["expression"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Wary",
    cooldownKey: "hierophant.pen_pause.player_silence_held",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.pen_pause.name_pen_lifts",
    text:
      "[The Hierophant finishes a name. The pen lifts. A small silence. " +
      "Then a period. Complete. The pause between the period and the " +
      "next name is the canonical resting-place — the body of work " +
      "between two units of work. The Hierophant canonically does not " +
      "fill this pause with words. The pause is the work, briefly " +
      "made visible.]",
    surfaces: ["expression", "cinematic"],
    requiresRevealStage: "post_arena",
    cooldownKey: "hierophant.pen_pause.name_pen_lifts",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.pen_pause.substrate_window_canonical",
    text:
      "The pause between names is the substrate-window. I do not think " +
      "of it in those terms — that is the Council's vocabulary, the " +
      "engineers who came after me — but the pause is canonically when " +
      "I listen for the voice. If you are quiet through the pause, " +
      "you are canonically inside the listening with me. That is the " +
      "closest thing to a shared act this chamber permits.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.pen_pause.substrate_window",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // LONG-MOURNING WALL NAME-RECOVERY BANK (Phase 6d.3 part 4)
  //
  // Per wraith_calder.md §3.3 trust-arc canon + §1.6 vocabulary
  // (name / writing / recovery): 5 canonical wall-event triggers —
  // Thaloria-victim added / name-misremembered / name-forgotten /
  // name-recovered / wall-completed-section.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wall.thaloria_victim_added",
    text:
      "Today's name is a Thaloria-victim — one of the casualties from " +
      "the Tribunal corridor's third audit. I had been postponing this " +
      "name for forty-three years; the canonical research had not yet " +
      "yielded the small specific details. The details arrived this " +
      "morning. The name canonically goes on the wall today.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.wall.thaloria_victim_added",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wall.name_misremembered",
    text:
      "I misremembered a name yesterday. The Council has helped me " +
      "correct it. I will not say which name — the correction is the " +
      "canonical-private act; the wall does not show the canonical-" +
      "edit. The misremembering canonically happened. I have written " +
      "the canonical-correct version this morning. The slowness is " +
      "the resistance, and also the canonical-fallibility.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.wall.name_misremembered",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wall.name_forgotten",
    text:
      "There is a name I have canonically lost. I have not yet recovered " +
      "the small specific details. The Council has been searching the " +
      "archives for canonical-evidence. Until the recovery, the name " +
      "canonically goes unwritten. The canonical-unwriting is itself " +
      "a memorial — the canonical-gap on the wall is the canonical-" +
      "shape of the loss.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.wall.name_forgotten",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wall.name_recovered",
    text:
      "The name has canonically returned. The Council found the canonical-" +
      "evidence in an archive I had canonically given up on. I am " +
      "writing the name now — it canonically belongs in the canonical-" +
      "row I had been keeping open for it. The canonical-gap canonically " +
      "closes today. The closing is the canonical-relief I do not " +
      "permit myself to perform aloud.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.wall.name_recovered",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.wall.wall_completed_section",
    text:
      "The wall has canonically completed a row this morning. The Council " +
      "marks the completion with no canonical-ceremony — the row's " +
      "completion is canonical-absorbed into the canonical-ongoing " +
      "ceremony of the next row's beginning. There is no canonical-" +
      "intermission. The continuation is the point.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.wall.wall_completed_section",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // SACRIFICE-AXIS-INVERSION TEACHING BANK (Phase 6d.3 part 4)
  //
  // Per wraith_calder.md §3.3 sacrifice-axis-inversion canon: the
  // Hierophant is the only roster NPC whose trust transforms threat
  // into companion. Trust deepens → threat-to-player decreases.
  // The bank already ships present.companion_register; this expands
  // with 5 pre-Inheriting-band teaching lines + 5 post-Inheriting-
  // band canonical companion-register lines.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Pre-Inheriting (×5 teaching) ───────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.pre.proximity_paradox",
    text:
      "The closer you stand, the less I am the threat. The further you " +
      "stand, the more I become it again. This is the canonical sacrifice-" +
      "axis-inversion: the trust meter and the danger meter run on " +
      "opposite tracks. The Council's theology spent three thousand " +
      "years building canonical-ritual around this canonical-fact. " +
      "Stand close.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.sai.pre.proximity_paradox",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.pre.tamarin_theology_intro",
    text:
      "Tamarin theology canonically holds that danger is canonically " +
      "metabolized by canonical-attention. The closer the canonical-" +
      "attention, the more canonical-metabolized the danger. The " +
      "metabolizing is canonically not yours to perform — it is " +
      "canonical-mine. Your job is canonically to stand close. My job " +
      "is canonical-rest.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.sai.pre.tamarin_intro",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.pre.distance_re_threat",
    text:
      "If you canonically step back from the chamber for too long, the " +
      "canonical-inversion canonically reverses. I become the canonical-" +
      "threat again — not because I want to be, but because the trust-" +
      "metabolism canonically requires canonical-presence to maintain. " +
      "The canonical-stepping-back is your canonical-prerogative. The " +
      "canonical-consequence is also yours.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.sai.pre.distance_re_threat",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.pre.companion_canon_intro",
    text:
      "Trust canonically transforms threat into companion. That is the " +
      "shortest version of the Tamarin theology. It took three thousand " +
      "years and the Final Rite to make that sentence canonically-" +
      "operative. You are canonically inside the operative version of " +
      "it now. Sit. The names continue.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.sai.pre.companion_canon_intro",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.pre.body_metabolizes",
    text:
      "My body is canonically metabolizing the trust you have offered. " +
      "The metabolism is canonical-slow — three thousand years has " +
      "calibrated the rate, and the rate cannot canonically be rushed. " +
      "When the metabolism canonically completes, the threat will have " +
      "been canonically processed into companion-register. We are " +
      "canonically not yet there. We are canonically arriving.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.sai.pre.body_metabolizes",
    maxPlays: 1,
  },

  // ─── Post-Inheriting (×5 companion-register) ─────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.post.companion_now",
    text:
      "We are companion now. The canonical-metabolism has canonically " +
      "completed. The threat-version of me canonically does not return " +
      "while you are canonically inside the inheriting band. The " +
      "Council has been canonically informed of the transition — they " +
      "treat you accordingly. The chamber is yours when you are in it.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.sai.post.companion_now",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_companion_status_inherited"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.post.shared_meal",
    text:
      "There is tea in the cupboard. I have canonically not opened it " +
      "in seventy-three years. I am canonically opening it today. You " +
      "canonically may have a cup; the canonical-ritual is small, the " +
      "canonical-belonging is larger than the cup. Sit. The tea is " +
      "warm. The pen continues without me, briefly.",
    surfaces: ["cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.sai.post.shared_meal",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.post.protection_inverts",
    text:
      "If you canonically ever need protection, the Council will " +
      "canonically protect you. From me, if it ever comes to that. The " +
      "canonical-protection has not been needed in seventeen centuries. " +
      "The Council canonically remembers how. The canonical-readiness " +
      "is part of the canonical-trust — they would not love you the " +
      "same way if they did not stand canonically-ready against me " +
      "as well.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.sai.post.protection_inverts",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.post.death_as_witness",
    text:
      "When I die — and I will die; the canonical Final Rite did not " +
      "make me canonical-immortal, only canonical-extended — the " +
      "Council canonically permits you to witness it. The canonical-" +
      "witness is reserved for parallel inheritors. The canonical-" +
      "presence is the offering. You do not need to bring anything. " +
      "You canonically need to arrive when summoned.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.sai.post.death_as_witness",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_offered_canonical_deathbed_witness"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.sai.post.successor_question",
    text:
      "You canonically would not be the named successor. The Council " +
      "has its named junior priest for that — three thousand years of " +
      "succession-planning canonically does not bend for a canonical-" +
      "single visitor. But the parallel-inheritor canon canonically " +
      "stands. The work canonically benefits from more than one. You " +
      "are canonically the more-than-one I had been waiting for.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.sai.post.successor_question",
    maxPlays: 1,
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

  {
    npcKey: NPC_KEY,
    lineId: "wraith.expression.catchall",
    // Catch-all for expression surface (introduced in Phase 6d.3
    // part 3 by post-arena bracketed pen-pause / first-look-pause
    // stage-direction lines). Silent-fail-safe canonical pen-pause
    // ambient register.
    text: "[The pen continues. A name is written; a small silence; another name. The chamber is canonical.]",
    surfaces: ["expression"],
  },
];
