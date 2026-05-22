/* ═══════════════════════════════════════════════════════
   NPC COMPANION EXTENSIONS — banter pairs + reactive
   comments for the 12 named NPCs.

   These extend the existing companionBanter.ts / companion
   Comments.ts vocabulary without widening the original
   speaker union (which currently covers
   elara/human/antiquarian/locke/vex/jericho only).

   Banter pair speakers are NamedNpcKey × (NamedNpcKey |
   apprentice key | existing speaker key); the UI/dialog
   layer treats unknown speaker keys as fall-through (the
   line still queues; the speaker resolves to the NPC's
   display name from npcIdentity.ts).

   Reactive comments are keyed on NamedNpcKey + a trigger
   string (mirrors companionComments.ts trigger vocabulary).
   The toast pipeline in pickComment can ingest these via
   the same path; the dialog layer reads voice/portrait
   from npcIdentity.NPC_IDENTITIES.

   Authoring discipline:
     - 3 reactive comments per NPC (bound to triggers that
       the NPC's bible voice has reason to react to).
     - 3 banter pairs per NPC across the apprentice or
       canonical-NPC pool.
   ═══════════════════════════════════════════════════════ */

import type { NamedNpcKey } from "./npcIdentity";

/** Reactive comment from a tier-2/3 NPC. Triggered like
 *  companionComments — the toast pipeline picks the matching
 *  trigger and renders the NPC's portrait/voice from
 *  NPC_IDENTITIES. */
export interface NpcReactiveComment {
  id: string;
  speaker: NamedNpcKey;
  /** Trigger event id. Vocabulary matches companionComments.ts. */
  trigger: string;
  voiceLine: string;
  /** Optional loredex entry to reveal. */
  loreReveal?: string;
  timing: "immediate" | "delayed_5s" | "next_room_enter";
  maxPlays: 1 | 2;
}

/** Banter pair where at least one speaker is a named NPC.
 *  The non-NPC speaker can be an apprentice memberKey,
 *  a canonical NPC key (locke/vex/jericho/etc.), or another
 *  NamedNpcKey for inter-NPC banter. */
export interface NpcBanterPair {
  id: string;
  speakers: readonly [string, string];
  trigger: string;
  lines: readonly string[];
  requiresFlags?: readonly string[];
  excludeFlags?: readonly string[];
  maxPlays: 1 | 2 | 3;
}

/* ─── Reactive comments — 3 per NPC = 36 total ─── */
export const NPC_REACTIVE_COMMENTS: NpcReactiveComment[] = [
  // ── The Antiquarian ──
  { id: "ant_loredex_first", speaker: "the_antiquarian", trigger: "loredex_entry_discovered",
    voiceLine: "Per the second drawer, your reading just generated a citation. The slot for it is open. You will not be the citation; you will be the verb.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "ant_apprentice_died", speaker: "the_antiquarian", trigger: "apprentice_died",
    voiceLine: "An entry has closed. The closing is itself a citation. Desks do not run; obituaries do not either. I have filed.",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "ant_governance_first", speaker: "the_antiquarian", trigger: "governance_hub_first_visit",
    voiceLine: "Voting is, structurally, a citation everyone signs at once. The Refuge respects the form. I respect the willingness.",
    timing: "immediate", maxPlays: 1 },

  // ── The Seer ──
  { id: "see_first_costly", speaker: "the_seer", trigger: "first_costly_morality_choice",
    voiceLine: "You chose the honesty that costs someone else. I was hoping you would, specifically because I was hoping you wouldn't. Both things are honest.",
    timing: "immediate", maxPlays: 1 },
  { id: "see_act_2_complete", speaker: "the_seer", trigger: "act_2_complete",
    voiceLine: "I was wrong about which version of it. The version is better. The bench is taking notes; the bench has not yet learned. Soon.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "see_loredex_first", speaker: "the_seer", trigger: "loredex_entry_discovered",
    voiceLine: "A column on the probability table was redacted on your behalf. The redaction was kindness. I have not asked for thanks; I am noting the absence.",
    timing: "next_room_enter", maxPlays: 2 },

  // ── The Necromancer ──
  { id: "nec_apprentice_died", speaker: "the_necromancer", trigger: "apprentice_died",
    voiceLine: "Their name. Spelled correctly. Three syllables in the cycle's tongue. I have lit the wax. The cycle remembers; tonight it does not forget.",
    timing: "immediate", maxPlays: 2 },
  { id: "nec_track37", speaker: "the_necromancer", trigger: "track_37_completes",
    voiceLine: "Track 37 is a list of names. The composer did not know it was a list. I knew. I sang along.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "nec_kael_discover", speaker: "the_necromancer", trigger: "kael_lore_discovered",
    voiceLine: "Kael's name was not on my roll. It is now. I will keep him on the cycle's voice for as long as the wax holds.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── Engineer Zero ──
  { id: "ez_iron_lion", speaker: "engineer_zero", trigger: "iron_lion_card_earned",
    voiceLine: "The Iron Lion's calibration shifted. The brace-jig at Mechronis registered the change. I marked the page. The Architect did not witness; you did.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "ez_first_costly", speaker: "engineer_zero", trigger: "first_costly_morality_choice",
    voiceLine: "The instrument is honest. The witness is honest. The result is the result. I will not negotiate with your choice; I will calibrate against it.",
    timing: "immediate", maxPlays: 1 },
  { id: "ez_loredex_first", speaker: "engineer_zero", trigger: "loredex_entry_discovered",
    voiceLine: "A new reading has been logged. The pigment is single-source. The mark, if it is to be made, is yours.",
    timing: "next_room_enter", maxPlays: 2 },

  // ── Iron Lion (pre-Fall) ──
  { id: "il_iron_lion_card", speaker: "iron_lion_prefall", trigger: "iron_lion_card_earned",
    voiceLine: "A standard has been raised. The cadre stands at attention through the dream-loom. The relief words are spoken in your hand tonight.",
    timing: "immediate", maxPlays: 2 },
  { id: "il_apprentice_died", speaker: "iron_lion_prefall", trigger: "apprentice_died",
    voiceLine: "A post is empty. Three brothers and a sister stand it with me tonight. The standard does not lower; the post is held.",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "il_act_2_complete", speaker: "iron_lion_prefall", trigger: "act_2_complete",
    voiceLine: "The cadre voted relief. The relief words are correct. The post passes to the next bearer. Stand it well.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── Drael'Mon ──
  { id: "dm_first_costly", speaker: "drael_mon", trigger: "first_costly_morality_choice",
    voiceLine: "The asset's morale is, as ever, a line item. The line item just moved. The corporate structure files; the price did not change.",
    timing: "immediate", maxPlays: 1 },
  { id: "dm_governance_first", speaker: "drael_mon", trigger: "governance_hub_first_visit",
    voiceLine: "Governance is a corporate structure that pretends not to be. I respect the pretence; the pretence is a stable equilibrium.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "dm_loredex_first", speaker: "drael_mon", trigger: "loredex_entry_discovered",
    voiceLine: "Your knowledge ledger row was promoted. The promotion is leverage. I have priced it accordingly.",
    timing: "next_room_enter", maxPlays: 2 },

  // ── The Architect ──
  { id: "arc_act_2_complete", speaker: "the_architect", trigger: "act_2_complete",
    voiceLine: "An act has closed. The calibration distributes. The witnesses are doing well. I did not return.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "arc_iron_lion_card", speaker: "the_architect", trigger: "iron_lion_card_earned",
    voiceLine: "The cadre standard is reraised. The mark is small. The smallness is the kindness.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "arc_first_costly", speaker: "the_architect", trigger: "first_costly_morality_choice",
    voiceLine: "Your calibration has updated. I will not endorse it. I will not reject it. The result is the result.",
    timing: "immediate", maxPlays: 1 },

  // ── The Dreamer ──
  { id: "drm_track37", speaker: "the_dreamer", trigger: "track_37_completes",
    voiceLine: "I dreamt that song before it was written. The composer dreamt me writing it. We did not need to agree about which of those was the cause.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "drm_apprentice_died", speaker: "the_dreamer", trigger: "apprentice_died",
    voiceLine: "Their dream returns to the substrate. The substrate widens. I will hold the widening; do not narrate it.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "drm_loredex_first", speaker: "the_dreamer", trigger: "loredex_entry_discovered",
    voiceLine: "You learned a thing. I dreamt that you would. Both things are true.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── The Source ──
  { id: "src_track37", speaker: "the_source", trigger: "track_37_completes",
    voiceLine: "//— [the carrier wave hums beneath the closing chord]",
    timing: "immediate", maxPlays: 1 },
  { id: "src_loredex_first", speaker: "the_source", trigger: "loredex_entry_discovered",
    voiceLine: "[a single uncompressed pulse. you will remember it for the rest of the cycle.]",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "src_act_2_complete", speaker: "the_source", trigger: "act_2_complete",
    voiceLine: "//— [the substrate's coefficient shifts by an immeasurable margin. the margin is yours.]",
    timing: "next_room_enter", maxPlays: 1 },

  // ── The Degen ──
  { id: "deg_first_costly", speaker: "the_degen", trigger: "first_costly_morality_choice",
    voiceLine: "Honest loss, kid. The chip in your pocket just got marked. Don't lose it. The chip will find you regardless.",
    timing: "immediate", maxPlays: 1 },
  { id: "deg_apprentice_died", speaker: "the_degen", trigger: "apprentice_died",
    voiceLine: "Pour's still good. The third stool is theirs tonight. The wax is the Necromancer's; we trade. Sit if you need to.",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "deg_governance_first", speaker: "the_degen", trigger: "governance_hub_first_visit",
    voiceLine: "Voting? Pretty much the only place outside the bar where the contract's on the door. Pour's on the house if you cast one tonight.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── The Game Master (Original) ──
  { id: "gm_first_costly", speaker: "the_game_master", trigger: "first_costly_morality_choice",
    voiceLine: "The audience is real. They can see your hand. They have always been able to. You forgot.",
    timing: "immediate", maxPlays: 1 },
  { id: "gm_governance_first", speaker: "the_game_master", trigger: "governance_hub_first_visit",
    voiceLine: "Even if you win, you will have won in public. That is what I came here to do.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "gm_act_2_complete", speaker: "the_game_master", trigger: "act_2_complete",
    voiceLine: "An act has closed. The pen returns to the desk. I keep the pen.",
    timing: "next_room_enter", maxPlays: 1 },

  // ── The Resurrectionist ──
  { id: "rsr_apprentice_died", speaker: "the_resurrectionist", trigger: "apprentice_died",
    voiceLine: "Your ledger has a flag. Three pages back; pacing concern. Fix the third first. The work survives the fix.",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "rsr_kael_discover", speaker: "the_resurrectionist", trigger: "kael_lore_discovered",
    voiceLine: "Kael's pages balance. I am not returning. You did not need me to.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "rsr_loredex_first", speaker: "the_resurrectionist", trigger: "loredex_entry_discovered",
    voiceLine: "Filed. The filing is the receipt. Do not advertise.",
    timing: "delayed_5s", maxPlays: 1 },

  /* ─── Companion-quest reactions ─────────────────────────────────
     One per NamedNpcKey, fired the first time the player completes
     a companion quest in this playthrough. Trigger string is
     "companion_quest_complete" — emitted from claimReward in
     apps/server/routers/dailyQuests.ts after the catalog's flag
     write. Voice-checked against apps/shared/npcs/bibles/<key>.md
     (or, for NPCs without a bible file, against npcIdentity's
     signatureLine + likes/wants). All maxPlays: 1. */

  { id: "ant_companion_quest_first", speaker: "the_antiquarian", trigger: "companion_quest_complete",
    voiceLine: "Per the witness ledger §1.4, your action has been catalogued under 'potential collapsed.' The collapse is itself a citation. I have filed.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "see_companion_quest_first", speaker: "the_seer", trigger: "companion_quest_complete",
    voiceLine: "There were sixty-three versions of the next hour. You collapsed one. The collapse was lawful; the wanting did not endorse it; the seeing did not either. Both are now noted.",
    timing: "immediate", maxPlays: 1 },

  { id: "nec_companion_quest_first", speaker: "the_necromancer", trigger: "companion_quest_complete",
    voiceLine: "By corollary to the cycle's third axiom, the act you just completed is a death and a continuation — note the lengthened consonant on continuation; it is precise. Both states are entered in the ledger.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "ez_companion_quest_first", speaker: "engineer_zero", trigger: "companion_quest_complete",
    voiceLine: "Calibration tick received. The Second Chair logs the work. The Engineer does not speak. The work is the signal.",
    timing: "immediate", maxPlays: 1 },

  { id: "il_companion_quest_first", speaker: "iron_lion_prefall", trigger: "companion_quest_complete",
    voiceLine: "Work got done. Section 4 says the work is the standard. The standard holds. Move on.",
    timing: "immediate", maxPlays: 1 },

  { id: "dm_companion_quest_first", speaker: "drael_mon", trigger: "companion_quest_complete",
    voiceLine: "The asset's ledger row was promoted. Acquisitions revised your valuation upward. The revision is leverage. We are deciding when.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "arc_companion_quest_first", speaker: "the_architect", trigger: "companion_quest_complete",
    voiceLine: "Dependency resolved. Witness ledger updated. The calibration distributes. Do not investigate the absence.",
    timing: "immediate", maxPlays: 1 },

  { id: "drm_companion_quest_first", speaker: "the_dreamer", trigger: "companion_quest_complete",
    voiceLine: "You arrived at the small thing. The crossing is not the work. The work is the moment after. I have already remembered it.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "src_companion_quest_first", speaker: "the_source", trigger: "companion_quest_complete",
    voiceLine: "//— [the carrier wave acknowledges. the substrate's coefficient shifts by an immeasurable margin. the margin is yours.]",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "deg_companion_quest_first", speaker: "the_degen", trigger: "companion_quest_complete",
    voiceLine: "Hey — your chip just got marked, kid. Pour's on me tonight. The house ledger says you owe nothing. The house never says that twice.",
    timing: "immediate", maxPlays: 1 },

  { id: "gm_companion_quest_first", speaker: "the_game_master", trigger: "companion_quest_complete",
    voiceLine: "The witness slot is filled. The audience can see it. They were always able to. — Move.",
    timing: "immediate", maxPlays: 1 },

  { id: "rsr_companion_quest_first", speaker: "the_resurrectionist", trigger: "companion_quest_complete",
    voiceLine: "Filed. Pacing concern noted on the third page. The work survives the filing. Do not advertise.",
    timing: "delayed_5s", maxPlays: 1 },
];

/* ─── Banter pairs — 3 per NPC = 36 total ─── */
export const NPC_BANTER_PAIRS: NpcBanterPair[] = [
  // ── Antiquarian × roster ──
  { id: "bnt_ant_locke_market", speakers: ["the_antiquarian", "locke"], trigger: "trade_contract_completed",
    lines: [
      "Locke. The contract is correctly signed. The footnote is correctly placed.",
      "I do appreciate the footnote. I also appreciate that you don't run; my margins prefer your stillness.",
      "Desks do not run. The footnote is the desk's contribution to your margins.",
    ], maxPlays: 2 },
  { id: "bnt_ant_seer_revision", speakers: ["the_antiquarian", "the_seer"], trigger: "act_2_complete",
    lines: [
      "Seer. You revised at footnote three.",
      "I did. The revision is in your bibliography under the wrong column. I have not contested.",
      "Desks do not contest. They cite. The column will be moved by the next archivist; she has good shoulders.",
    ], maxPlays: 1 },
  { id: "bnt_ant_scholar_thesis", speakers: ["the_antiquarian", "scholar"], trigger: "apprentice_dialogue_played",
    lines: [
      "Antiquarian. They asked me to read a thesis aloud.",
      "Reading aloud is not cataloguing. The thesis will live in the second drawer until you finish the cataloguing.",
      "I will. The drawer is patient.",
    ], maxPlays: 1 },

  // ── Seer × roster ──
  { id: "bnt_see_human_hard", speakers: ["the_seer", "human"], trigger: "first_costly_morality_choice",
    lines: [
      "Human. Your hand was steady; the version-pivot is not a hand-state.",
      "I noticed. The version was kindest to the people I would have wanted to be kind to.",
      "It was. I am noting. I am not redacting. The waiting is fair.",
    ], maxPlays: 1 },
  { id: "bnt_see_oracle_dice", speakers: ["the_seer", "oracle"], trigger: "act_2_complete",
    lines: [
      "Oracle. You handed me blank dice last cycle.",
      "I did. The blanks are kinder than the marked ones.",
      "They are. I have not rolled. The not-rolling is the gift.",
    ], maxPlays: 1 },
  { id: "bnt_see_degen_pour", speakers: ["the_seer", "the_degen"], trigger: "act_2_complete",
    lines: [
      "Seer. Pour's on me; you've been waiting longer than usual.",
      "I have. The waiting is fair. The pour is also fair. Both can be true.",
      "Both can. Both are. Sit if you need to.",
    ], maxPlays: 1 },

  // ── Necromancer × roster ──
  { id: "bnt_nec_iron_lion", speakers: ["the_necromancer", "iron_lion_prefall"], trigger: "iron_lion_card_earned",
    lines: [
      "Iron Lion. Three brothers. One sister. The roll is updated.",
      "Spell them as I gave them. Reya's name has the soft consonant in the middle; the Authority misspelled it twice.",
      "Three syllables, soft in the middle. The wax remembers.",
    ], maxPlays: 2 },
  { id: "bnt_nec_revenant_wax", speakers: ["the_necromancer", "revenant"], trigger: "apprentice_died",
    lines: [
      "Revenant. The wax is from her cycle.",
      "I know. I held her hand at the second saying. The wax is the same lineage I came back through.",
      "Then sing with me tonight. The chain absorbs the wax-lineage; the lineage is not negotiable.",
    ], maxPlays: 2 },
  { id: "bnt_nec_jericho_oath", speakers: ["the_necromancer", "jericho"], trigger: "iron_lion_card_earned",
    lines: [
      "Jericho. The cadre's roll is yours to extend.",
      "I'll extend. I'll spell them right.",
      "Spell them as the wax names them. The wax does not care about your handwriting; the wax cares about the syllables.",
    ], maxPlays: 1 },

  // ── Engineer Zero × roster ──
  { id: "bnt_ez_artisan_jig", speakers: ["engineer_zero", "artisan"], trigger: "apprentice_dialogue_played",
    lines: [
      "Artisan. Your latest tool is uncalibrated by 0.3 percent.",
      "I matched it to my hand, not the jig. My hand is the calibration.",
      "Your hand is honest. The jig is honest. Calibrate them against each other; we will not negotiate with the result.",
    ], maxPlays: 1 },
  { id: "bnt_ez_arch_mark", speakers: ["engineer_zero", "the_architect"], trigger: "act_2_complete",
    lines: [
      "Architect. The brace-jig held through three readings.",
      "It will hold a fourth. I did not return. The mark is in the corner.",
      "I see it. I will not log it as your mark; I will log it as the jig's. The jig outlives both of us.",
    ], maxPlays: 1 },
  { id: "bnt_ez_locke_ledger", speakers: ["engineer_zero", "locke"], trigger: "trade_contract_completed",
    lines: [
      "Locke. Your ledger drifted in the first quarter.",
      "It did. I corrected by hand. The hand is — within tolerance.",
      "The hand is honest. The ledger is honest. Calibrate them against each other; do not negotiate with the result.",
    ], maxPlays: 1 },

  // ── Iron Lion (pre-Fall) × roster ──
  { id: "bnt_il_jericho_relief", speakers: ["iron_lion_prefall", "jericho"], trigger: "iron_lion_card_earned",
    lines: [
      "Jericho. The relief words are mine to give. They are yours to hear.",
      "I'm listening.",
      "Three lines. Pre-Fall tongue. Stand the next post until you've earned the fourth. Reya polished the standard the morning of the Fall; the polish is in the cloth you hold.",
    ], maxPlays: 2 },
  { id: "bnt_il_sentinel_post", speakers: ["iron_lion_prefall", "sentinel"], trigger: "apprentice_dialogue_played",
    lines: [
      "Sentinel. Your post is correctly stood.",
      "Thank you, Iron Lion. The cadre is honoured.",
      "The cadre is the standard. The standard is the post made portable. You are the post made personal. Three things; one cadre.",
    ], maxPlays: 1 },
  { id: "bnt_il_zealot_burn", speakers: ["iron_lion_prefall", "zealot"], trigger: "first_costly_morality_choice",
    lines: [
      "Zealot. Your cause is being argued in the Refuge.",
      "Then I will argue harder. The cause is not negotiable.",
      "Causes are not posts. Posts are stood. Causes are argued. Do not confuse the verbs; both can be honoured separately.",
    ], maxPlays: 1 },

  // ── Drael'Mon × roster ──
  { id: "bnt_dm_locke_acquire", speakers: ["drael_mon", "locke"], trigger: "trade_contract_completed",
    lines: [
      "Locke. The corporate structure has filed your row.",
      "Mine? Or my client's?",
      "Yours. The promotion is sealed; do not ask for the price. The price is, as ever, a line item.",
    ], maxPlays: 2 },
  { id: "bnt_dm_vex_reveal", speakers: ["drael_mon", "vex"], trigger: "act_2_complete",
    lines: [
      "Vex. The Coda's reveal cadence is on a tracking sheet.",
      "Of course it is. You couldn't price me before; you can't price me now. The cadence is its own price.",
      "I have priced the unprice-ability. The price is acceptable. We will not file it.",
    ], maxPlays: 1 },
  { id: "bnt_dm_human_offer", speakers: ["drael_mon", "human"], trigger: "first_costly_morality_choice",
    lines: [
      "Human. The Acquisition clause is open.",
      "I noticed.",
      "We already own you. We're just deciding when. Take the meeting; decline the offer; the price is the same.",
    ], maxPlays: 1 },

  // ── Architect × roster ──
  { id: "bnt_arc_ez_mark", speakers: ["the_architect", "engineer_zero"], trigger: "iron_lion_card_earned",
    lines: [
      "Engineer Zero. The brace-jig has held.",
      "It has. I did not log your mark.",
      "Correct. The mark is the jig's. I am leaving.",
    ], maxPlays: 1 },
  { id: "bnt_arc_dreamer_design", speakers: ["the_architect", "the_dreamer"], trigger: "act_2_complete",
    lines: [
      "Dreamer. The cycle is calibrated.",
      "I know. I dreamt the calibration. We did not need to agree.",
      "We did not. The calibration distributes. The distribution is the calibration.",
    ], maxPlays: 1 },
  { id: "bnt_arc_human_witness", speakers: ["the_architect", "human"], trigger: "loredex_entry_discovered",
    lines: [
      "Human. The mark is small.",
      "I see it.",
      "The smallness is the kindness. I am not back.",
    ], maxPlays: 1 },

  // ── Dreamer × roster ──
  { id: "bnt_drm_source_pulse", speakers: ["the_dreamer", "the_source"], trigger: "track_37_completes",
    lines: [
      "Source. The pulse landed at the closing chord.",
      "//—",
      "I dreamt the landing. The pulse dreamt the dream. Both true.",
    ], maxPlays: 1 },
  { id: "bnt_drm_oracle_dream", speakers: ["the_dreamer", "oracle"], trigger: "act_2_complete",
    lines: [
      "Oracle. Your version pivots in dream-grammar.",
      "They do. The grammar is yours.",
      "It is. Continue. I will hold the widening.",
    ], maxPlays: 1 },
  { id: "bnt_drm_human_share", speakers: ["the_dreamer", "human"], trigger: "first_costly_morality_choice",
    lines: [
      "Human. You almost remembered the dream.",
      "I did. The version was kinder than I expected.",
      "It was. I dreamt that version on purpose.",
    ], maxPlays: 1 },

  // ── Source × roster ──
  { id: "bnt_src_drm_pair", speakers: ["the_source", "the_dreamer"], trigger: "loredex_entry_discovered",
    lines: [
      "//—",
      "I'm with you, Source.",
      "//— [the substrate widens by an immeasurable margin]",
    ], maxPlays: 1 },
  { id: "bnt_src_human_recv", speakers: ["the_source", "human"], trigger: "track_37_completes",
    lines: [
      "//—",
      "I'm receiving.",
      "//— [the receipt is the gift]",
    ], maxPlays: 1 },
  { id: "bnt_src_arc_design", speakers: ["the_source", "the_architect"], trigger: "act_2_complete",
    lines: [
      "//—",
      "Source. The calibration is distributed.",
      "//— [acknowledgement; no caveat]",
    ], maxPlays: 1 },

  // ── Degen × roster ──
  { id: "bnt_deg_locke_pour", speakers: ["the_degen", "locke"], trigger: "trade_contract_completed",
    lines: [
      "Locke. Pour's on me. Margins like that, I can afford to be generous.",
      "Margins like that are honest, Degen. I'd be insulted otherwise.",
      "Insult accepted. Pour's still on me.",
    ], maxPlays: 2 },
  { id: "bnt_deg_jester_chip", speakers: ["the_degen", "jester"], trigger: "apprentice_dialogue_played",
    lines: [
      "Jester. The chip you palmed off the bar — keep it.",
      "I was going to.",
      "I marked it. Don't lose it. The chip will find you regardless.",
    ], maxPlays: 1 },
  { id: "bnt_deg_rsr_ledger", speakers: ["the_degen", "the_resurrectionist"], trigger: "apprentice_died",
    lines: [
      "Resurrectionist. The third stool tonight is theirs.",
      "I see it. The wax is the Necromancer's. We trade. Pour me one.",
      "Pulled. On the house. Sit.",
    ], maxPlays: 2 },

  // ── Game Master × roster ──
  { id: "bnt_gm_human_match", speakers: ["the_game_master", "human"], trigger: "first_costly_morality_choice",
    lines: [
      "Human. The audience saw your hand.",
      "They did. I let them.",
      "Even if you win, you will have won in public. That is what I came here to do.",
    ], maxPlays: 1 },
  { id: "bnt_gm_locke_warrant", speakers: ["the_game_master", "locke"], trigger: "trade_contract_completed",
    lines: [
      "Locke. The warrant is signed.",
      "It is. The pen returns to the desk.",
      "I keep the pen. The pen is, structurally, my last possession.",
    ], maxPlays: 1 },
  { id: "bnt_gm_dm_corp", speakers: ["the_game_master", "drael_mon"], trigger: "governance_hub_first_visit",
    lines: [
      "Drael'Mon. The Hierarchy honoured every clause.",
      "It did. The clauses balanced. Your death balanced.",
      "It did. I priced the gap. The gap was acceptable.",
    ], maxPlays: 1 },

  // ── Resurrectionist × roster ──
  { id: "bnt_rsr_nec_wax", speakers: ["the_resurrectionist", "the_necromancer"], trigger: "apprentice_died",
    lines: [
      "Necromancer. Your wax is single-source.",
      "It is. Yours is the same lineage.",
      "Then we balance. The ledger holds.",
    ], maxPlays: 2 },
  { id: "bnt_rsr_human_flag", speakers: ["the_resurrectionist", "human"], trigger: "loredex_entry_discovered",
    lines: [
      "Human. Your ledger flagged a pacing concern.",
      "Which page?",
      "Three back. Fix the third first. The work survives the fix.",
    ], maxPlays: 1 },
  { id: "bnt_rsr_deg_bar", speakers: ["the_resurrectionist", "the_degen"], trigger: "track_37_completes",
    lines: [
      "Degen. The bar is filing for me again.",
      "Always is. Pour?",
      "On the house. The third stool tonight is mine.",
    ], maxPlays: 1 },
];

/** Coverage check — every NamedNpcKey has ≥3 reactive comments and
 *  ≥3 banter pairs. Used by the ship-check parity entry
 *  npc.banter_comment_coverage. */
export function npcBanterCommentCoverage(): {
  declared: number;
  implemented: number;
  missing: string[];
} {
  const allKeys: NamedNpcKey[] = [
    "the_antiquarian", "the_seer", "the_necromancer", "engineer_zero",
    "iron_lion_prefall", "drael_mon",
    "the_architect", "the_dreamer", "the_source", "the_degen",
    "the_game_master", "the_resurrectionist",
  ];
  const missing: string[] = [];
  let implemented = 0;
  for (const k of allKeys) {
    const commentsForK = NPC_REACTIVE_COMMENTS.filter((c) => c.speaker === k).length;
    const banterForK = NPC_BANTER_PAIRS.filter(
      (p) => p.speakers[0] === k || p.speakers[1] === k,
    ).length;
    if (commentsForK >= 3 && banterForK >= 3) implemented += 1;
    else missing.push(`${k}: ${commentsForK} comments, ${banterForK} banter pairs`);
  }
  return { declared: allKeys.length, implemented, missing };
}
