// apps/shared/npcs/crossCharacterReactions.ts
//
// Phase 4 — Cross-character reaction registry.
//
// Catalogs every canonical public-flag wired across Phase 3 banks:
//   - which NPC SETS the flag (via setsPublicFlags on NpcLine)
//   - which NPC(s) REACT to the flag (via reactsToPublicFlag)
//
// This is the load-bearing "lived-in" canon: when one NPC canonically does
// something visible, other NPCs canonically REGISTER it. The flag table
// (apps/db/schema.ts:npc_public_flags) is the persistent storage; this
// registry is the canonical map of WHO writes WHAT and WHO reads it.
//
// Lint: tests assert no reactsToPublicFlag references a flag that is
// never set, and no setsPublicFlags writes a flag that is never read.
// (Some setters are deliberately one-way for future Phase 4+ readers;
// those are flagged in the registry as "future_reader".)

import type { NpcKey } from "./types";
import { ALL_NPC_LINES } from "./banks";

// --- Canonical reaction record -------------------------------------------

export interface CrossCharacterReaction {
  /** The canonical public flag (writer-coordinated string). */
  flag: string;
  /** NPC(s) that canonically SET this flag via setsPublicFlags. */
  setBy: ReadonlyArray<NpcKey | "system">;
  /** NPC(s) that canonically REACT to this flag via reactsToPublicFlag. */
  reactsBy: ReadonlyArray<NpcKey | "future_reader">;
  /** Bible-canonical short rationale for the cross-character canon. */
  canonicalNote: string;
}

// --- The registry ---------------------------------------------------------

export const CROSS_CHARACTER_REACTIONS: ReadonlyArray<CrossCharacterReaction> = [
  // ─── Touché canon (Locke ↔ Vex) ───────────────────────────────────
  {
    flag: "vex_locked_out_by_locke_exclusivity",
    setBy: ["adjudicator_locke", "system"], // also set by tradeContracts router
    reactsBy: ["adjudicator_locke", "vex_solene"],
    canonicalNote:
      "Touché canon per Locke bible §4 + Vex §4.10. Locke's exclusive-" +
      "dealings contract sets the flag; both NPCs react (Locke acknowledges " +
      "Vex's silent withdrawal; Vex acknowledges the binding).",
  },

  // ─── Severance Prize ↔ Companion ───────────────────────────────────
  {
    flag: "nilmorg_kept_his_agreement",
    setBy: ["nilmorg"],
    reactsBy: ["nilmorg", "future_reader"], // Companion bank carries the line
    canonicalNote:
      "Per Nilmorg bible §4.8: every Severance Prize companion canonically " +
      "carries 'Nilmorg kept his agreement' as inherited memory. Companion " +
      "bank acknowledges via post-naming verbal lines.",
  },

  // ─── Severance Prize cosmic refusal (Phase 6a.1 askTopics + bank) ──
  {
    flag: "nilmorg_refused_to_explain_severance",
    setBy: ["nilmorg"],
    reactsBy: ["future_reader"], // Locke / Antiquarian / Hierophant Phase 6+
    canonicalNote:
      "Per Nilmorg bible §1.5 protected refusal: 'He never explains why " +
      "[the Severance Prize is] worse than not paying.' Set by the cosmic-" +
      "refusal ask-topics (ask_nilmorg_dont_explain, ask_nilmorg_worse_" +
      "than_not_paying) and by the recipient-reunion 'do not ask' line. " +
      "Downstream NPCs (Locke per Touché disclosure register; the " +
      "Antiquarian per his audit canon) react in Phase 6a.2+ as their " +
      "banks land.",
  },

  // ─── Severance terminal-tier (5th ceremony, canonical end-of-structure) ─
  {
    flag: "nilmorg_terminal_tier_reached",
    setBy: ["nilmorg"],
    reactsBy: ["future_reader"], // Locke / Hierophant / Oracle Phase 6+
    canonicalNote:
      "Per Nilmorg bible §2.5: at the canonical fifth Severance Prize, " +
      "Nilmorg has reached the end of the agreement structure he was " +
      "authorized to offer. The flag marks the terminal counterparty-prime " +
      "tier. Downstream Phase-6+ banks (Locke acknowledging the Hierarchy " +
      "shift; Hierophant noting a new entry on the wall; Oracle dream " +
      "subtext) react canonically as the saga's most-load-bearing player " +
      "achievement.",
  },

  // ─── Locke ↔ Vex Touché disclosure (Phase 6a.2 askTopics) ───────────
  {
    flag: "locke_disclosed_zero_agent_history",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // Vex Phase 6b.2 banks react canonically
    canonicalNote:
      "Per Locke bible §2.3: the recorded Zero / Locke 'Touché' exchange " +
      "is the only canonical peer-respect relationship Locke has on " +
      "record. When the player asks Locke about Vex / Agent Zero and " +
      "receives the Touché disclosure, downstream Vex banks (Phase 6b.2) " +
      "react with the canonical 'Locke told you. We can finish trading " +
      "secrets now if you like' register.",
  },

  // ─── Locke ↔ Antiquarian audit (Phase 6a.2 askTopics) ───────────────
  {
    flag: "locke_disclosed_antiquarian_audit",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // The Antiquarian (future bible) reacts
    canonicalNote:
      "Per Locke bible §4.4: the Antiquarian audit is canonically mutual. " +
      "When Locke discloses to the player that she is auditing the " +
      "Antiquarian and being audited in return, downstream Antiquarian " +
      "banks (when his bible ships) gain access to the canonical 'Locke " +
      "told you, did she' acknowledgment register.",
  },

  // ─── Locke 5×5 variant-grid disclosure flags (Phase 6a.2 sub-chunk A) ─
  {
    flag: "locke_disclosed_authority_divergence",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // Vex / Antiquarian / Hierophant Phase 6+
    canonicalNote:
      "Per Locke bible §3.6: at trust ≥80 with a pragmatic-wit player " +
      "the canonical Adjudicated-Collegial register names the asymmetry " +
      "between Locke's personal interest and the Authority's interest. " +
      "The flag marks the canonical operational sacrifice (§3.6) — Locke " +
      "has admitted to the player that she does not always agree with " +
      "the Authority. Downstream Phase-6+ NPCs who broker against New " +
      "Babylon (Vex Coda; Antiquarian; Hierophant) gain reactive lines " +
      "that acknowledge the canonical schism.",
  },
  {
    flag: "locke_shared_unsigned_clause",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // Antiquarian / Vex / Hierophant Phase 6+
    canonicalNote:
      "Per Locke bible §2.5 Conspiratorial register: at Insider band " +
      "with a vigilant-axis player Locke shares knowledge of an unsigned " +
      "Red Crystal Accord clause. The flag marks the bond-of-crime per " +
      "§2.5 — both parties agree to deny the conversation. Downstream " +
      "NPCs (the Antiquarian who would professionally want the clause; " +
      "Vex who Locke would never share this with) gain canonical " +
      "register-shifts.",
  },
  {
    flag: "locke_admitted_attachment_to_player",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // Saga endgame Phase 6+
    canonicalNote:
      "Per Locke bible §3.3 contradiction canon: the deepest attachment " +
      "she is capable of is shared deniability. At Adjudicated band with " +
      "a vigilant-axis player she names the arrangement that 'keeps me " +
      "alive' as keeping her alive. The flag is the saga's clearest " +
      "Locke-loyalty marker — the one canonical condition under which " +
      "she would canonically risk operational security for the player. " +
      "Endgame Phase-6+ scenes (Authority betrayal arcs) gate on this.",
  },

  // ─── Locke filed player breach of exclusivity (Phase 6a.2 Touché) ──
  {
    flag: "locke_filed_player_breach_of_exclusivity",
    setBy: ["adjudicator_locke"],
    reactsBy: ["vex_solene"],
    canonicalNote:
      "Per Locke bible §2.3 + writers'-guide Touché-arc canon: when the " +
      "player breaches the exclusive-dealings contract, Locke's canonical " +
      "breach-acknowledgment line files the canonical three-file " +
      "structure (Authority: 'breach' / Locke: 'professional' / Vex: " +
      "'predicted'). The flag opens the canonical Vex return register — " +
      "she made a cup of tea while the channel was closed; she does not " +
      "file. The cross-character cascade IS the canonical Touché-arc " +
      "completion.",
  },

  // ─── Seer remembers laughing at the Programmer (Phase 6b.1) ────────
  {
    flag: "seer_remembers_laughing_at_programmer",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"], // Antiquarian (future bible) + Phase 6+
    canonicalNote:
      "Per Seer bible §4.6 + writers'-guide spec: the canonical Seer-" +
      "laughed-at-the-Programmer canon is the saga's clearest single " +
      "Seer-Programmer cross-reference. Set when the player asks Seer " +
      "about Daniel Cross / the Antiquarian. The flag opens a downstream " +
      "Antiquarian-bible reactive register ('Tell her I remember it too') " +
      "and signals to other Phase 6+ NPCs that the player has crossed " +
      "the canonical Seer-Programmer historical-disclosure line.",
  },

  // ─── Seer Meme-resistance disclosure (Phase 6b.1 cross-time chunk) ─
  {
    flag: "seer_meme_resistance_disclosed",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"], // The Meme (future bank) + Phase 6+
    canonicalNote:
      "Per Seer bible §2.3 + cross-bible Meme canon: the Seer is the " +
      "saga's only voice canonically Meme-resistant by construction — " +
      "her recordings predate the Meme's editorial range. Set when the " +
      "Witnessed-band cross-time mechanic line discloses this. The flag " +
      "opens a downstream Meme-bible reactive register where the Meme " +
      "canonically registers the player having learned that one voice " +
      "in the saga cannot be reached by his editorial mechanism.",
  },

  // ─── Seer burnt-card path completed (Phase 6b.1 sub-chunk G) ───────
  {
    flag: "seer_burnt_card_path_completed",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"], // Antiquarian (future bank) + Phase 6+
    canonicalNote:
      "Per Seer bible §5.3 + §2.2 canonical canon: the burnt-card " +
      "unlock route is the canon-hidden winnable path for the §4.9 " +
      "Mechronis prophecy match. Set when the player canonically " +
      "carries the burnt card back across multiple acts and wins the " +
      "rematch (canonical 'Oh. You remembered.' anchor lands). The flag " +
      "opens downstream Phase 6+ reactive registers — the Antiquarian " +
      "canonically catalogues the canon-hidden completion (his domain " +
      "is the Archives canon per §5.3); other Phase 6+ NPCs gain " +
      "canonical 'you carried the staff' acknowledgment register.",
  },

  // ─── Locke filed player as predatory at first contact (Phase 6a.2
  //     first-meeting tree) ────────────────────────────────────────────
  {
    flag: "locke_filed_player_as_predatory_first_contact",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // Locke's own variant grid + Phase 6+ NPCs
    canonicalNote:
      "Set when the player picks the canonical wit-axis branch in Locke's " +
      "first-meeting dialog tree ('I'm here to find what you're hiding'). " +
      "Canonical first-contact filing per §2.5 Predatory register — Locke " +
      "files the branch as 'predatory' and starts the suspicion-as-leverage " +
      "register. Downstream Phase 6+ content (Locke's own Predatory variant " +
      "lines deepening; future Antiquarian / Vex register-shifts on a " +
      "player who declared suspicion at minute one) react canonically.",
  },

  // ─── Locke risk-tolerant filing (Phase 6a.2 sub-chunk D) ────────────
  {
    flag: "locke_filed_player_as_risk_tolerant",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"], // Nilmorg / Antiquarian / Hierophant Phase 6+
    canonicalNote:
      "Per Locke bible §1.4 tell #4 (deferred-threat) + §2.4 specificity " +
      "canon: when the player canonically declines to audit TWICE, Locke " +
      "files the canonical pattern as 'risk-tolerant counterparty' (her " +
      "register) while the Authority files it as 'discount-bearing'. The " +
      "flag marks the canonical institutional reclassification. Downstream " +
      "Phase 6+ NPCs who broker against contracted players (Nilmorg's " +
      "actuarial frame canonically interested in risk-tolerance; the " +
      "Antiquarian who would canonically audit Locke's audits; Hierophant " +
      "who would canonically file the player's risk-acceptance under his " +
      "wall canon) gain reactive register-shifts when this flag is set.",
  },

  // ─── Seer Inheriting band reach (cross-bibliographic) ───────────────
  {
    flag: "seer_confidant_band_reached",
    setBy: ["the_seer"],
    reactsBy: ["the_degen", "the_meme"],
    canonicalNote:
      "Per Seer §3.3: Inheriting band canonical-scarce. Reach triggers " +
      "Degen ethics-committee citation and Meme cannot-reach-Seer " +
      "acknowledgment (Meme §4.4 cannot-be-falsified canon).",
  },

  // ─── Hierophant chamber midwifery (deepest Companion cross-bible) ──
  {
    flag: "hierophant_midwifed_companion_first_word",
    setBy: ["wraith_calder"],
    reactsBy: ["dmc_clone_companion"],
    canonicalNote:
      "Per Hierophant bible §4.13 + Companion §4.13 (deepest Companion " +
      "obligation): Hierophant chamber is canonical-default first-word " +
      "context. Companion's 'Wraith Calder' first-word reactive on this flag.",
  },

  // ─── Companion in chamber (Hierophant context) ──────────────────────
  {
    flag: "dmc_companion_present_in_chamber",
    setBy: ["system"], // Set when player enters chamber with Companion
    reactsBy: ["wraith_calder"],
    canonicalNote:
      "Triggers Hierophant's midwifery line. Set by client when player " +
      "enters Long Mourning chamber while Companion is in active " +
      "companion slot.",
  },

  // ─── Oracle disambiguation (post-Ch6) ───────────────────────────────
  {
    flag: "oracle_disambiguated_player_from_clone",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Phase 4+ Companion reactions
    canonicalNote:
      "Per Oracle §1.5 cinematic-exception canon: Ch6 disambiguation " +
      "scene. Player learns canonically they are NOT the False Prophet " +
      "clone. Future Companion lines may react.",
  },

  // ─── Oracle Mechronis memory witnessed ──────────────────────────────
  {
    flag: "oracle_mechronis_memory_witnessed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Phase 4+ Vex / Seer reactions
    canonicalNote:
      "Per Oracle §1.4 we-of-witness + Seer §4.5 Mechronis triple-" +
      "anchored canon. Future Vex Engineer-trace reactions and Seer " +
      "reactions may key on this flag.",
  },

  // ─── Oracle Disappearance foreshadow (post-Ch12) ────────────────────
  {
    flag: "oracle_disappearance_foreshadowed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Phase 4+ saga endgame reactions
    canonicalNote:
      "Per Oracle §1.4 transferred-instinct closure canon. Inheriting-" +
      "band Disappearance-foregrounded line. Future endgame NPC " +
      "reactions key on this canonical foreshadow.",
  },

  // ─── Vex Engineer-Zero reveal ───────────────────────────────────────
  {
    flag: "vex_engineer_zero_revealed_to_player",
    setBy: ["vex_solene"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Vex bible §1.x 4-stage reveal canon: Acts 5+ engineer_zero_" +
      "confirmed reveal sets this flag. Future Locke + Seer + Eidolon " +
      "cross-bibliographic reactions canonically available.",
  },

  // ─── Locke contract audit disclosure (system-set via tradeContracts) ─
  {
    flag: "locke_retainer_audit_disclosed",
    setBy: ["system"], // Set by apps/server/routers/tradeContracts.ts:sign when audit=true
    reactsBy: ["adjudicator_locke"],
    canonicalNote:
      "Per Locke bible §1.4 fine-print canon. Set by tradeContracts router " +
      "when player audits the contract on signing. Locke acknowledges via " +
      "respect-acknowledged line.",
  },

  // ─── Faction-align reaction flags (system-set via tradeEmpire ripples) ─
  {
    flag: "faction_align_new_babylon_negative",
    setBy: ["system"], // Set by faction_align ripple handler when crossedThreshold === "negative"
    reactsBy: ["adjudicator_locke"],
    canonicalNote:
      "Per Locke bible §4 deferred-threat logging canon. Set by tradeEmpire " +
      "completeMission faction_align ripple when New Babylon reputation " +
      "crosses positive→negative threshold. Locke files canonically.",
  },

  // ─── Faction-align positive (Phase 6a.2 sub-chunk C symmetric pair) ─
  {
    flag: "faction_align_new_babylon_positive",
    setBy: ["system"], // Set by faction_align ripple handler when crossedThreshold === "positive"
    reactsBy: ["adjudicator_locke"],
    canonicalNote:
      "Symmetric counterpart to faction_align_new_babylon_negative. " +
      "Set by tradeEmpire completeMission faction_align ripple when " +
      "New Babylon reputation crosses negative→positive threshold. " +
      "Locke's canonical Mercantile-baseline response files the gain " +
      "asymmetrically — positive ledgers don't require the same rate " +
      "of footnotes per the bank's voice canon (§1.2 finance lexicon).",
  },

  // ─── First-meeting flags (broker introductions) ─────────────────────
  {
    flag: "met_adjudicator_locke",
    setBy: ["adjudicator_locke"],
    reactsBy: ["your_eidolon"],
    canonicalNote:
      "Eidolon Echo-mode recognition glyph fires on Locke first-meeting. " +
      "Per Eidolon §5.10 + bank reactsToPublicFlag.",
  },
  {
    flag: "met_nilmorg",
    setBy: ["nilmorg"],
    reactsBy: ["your_eidolon"],
    canonicalNote:
      "Eidolon Echo-mode recognition glyph fires on Nilmorg first-meeting. " +
      "Wary-vocabulary canon (institutional, do-not-approach-without-reason).",
  },
  {
    flag: "met_vex_solene",
    setBy: ["vex_solene"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Vex Maestro persona introduction. Future Locke reactions canonically " +
      "available (per Locke §4 cross-bibliographic — though Locke's bank " +
      "ships the Touché reaction on a different flag).",
  },
  {
    flag: "met_the_degen",
    setBy: ["the_degen"],
    reactsBy: ["future_reader"],
    canonicalNote: "Degen casino introduction. Future cross-bibliographic reactions.",
  },
  {
    flag: "met_the_hierophant",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote: "Hierophant first-meeting in Long Mourning chamber. Future cross-bibliographic.",
  },

  // ─── Story-canon flags ──────────────────────────────────────────────
  {
    flag: "oracle_silence_ended_for_player",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Ch5 cinematic introduction-of-self ends the Silence canonically. " +
      "Future Insurgency-faction NPC reactions key on this for canon-" +
      "fidelity (Insurgency canonically realizes their voice was the Meme).",
  },
  {
    flag: "meme_silence_duration_acknowledged",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme §1.3 Stolen disguise eleven-year acknowledgment. Future " +
      "Insurgency-related cross-bibliographic reactions.",
  },
  {
    flag: "meme_architect_fusion_revealed",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme §4.x Architect parent-child canon (per a0813ed recast). " +
      "Ch12 fusion reveal. Future Architect-related reactions.",
  },
  {
    flag: "game_master_witnessed_player",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Game Master witness-mode pre-Authority-Trial. Future Authority-" +
      "Trial verdict-stream reactions per bible §4.13.",
  },
  {
    flag: "game_master_oracle_arena_canon_disclosed",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master §4.13: Collectors' Arena built to recover the Oracle. " +
      "Most-reverent canonical act. Future Oracle reactions canonically " +
      "available (Oracle bible §4.x).",
  },
  {
    flag: "hierophant_present_band_reached",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant §3 sacrifice-axis-inversion canon. Trust-deepening " +
      "transforms Hierophant from threat to companion.",
  },
  {
    flag: "hierophant_inheriting_band_reached",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant §4.10 reserved canonical line. Sets up Companion " +
      "first-word context (chamber midwifery).",
  },
  {
    flag: "companion_structural_identity_acknowledged",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §2.2: 'I was not given. I was delivered.' Structural " +
      "identity claim. Future Nilmorg/Locke/Hierophant reactions.",
  },
  {
    flag: "companion_first_word_was_wraith_calder",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.4 first-word canon: chamber context default. Future " +
      "Hierophant acknowledgment + Tamarin religious significance.",
  },
  {
    flag: "companion_first_word_was_you",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Default fallback first-word context. Player-state-derived. Future " +
      "Eidolon recognition + faction reactions.",
  },
  {
    flag: "degen_acknowledged_player_as_kin",
    setBy: ["the_degen"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Degen §3.2 Ne-Yon-kin highest-band canon. Sets up potential " +
      "future inter-Ne-Yon recognition (Seer canon implies Ne-Yon-mutual-" +
      "awareness).",
  },
];

// --- Helpers --------------------------------------------------------------

/** Resolve all NPCs that REACT to a given flag. */
export function reactorsForFlag(flag: string): ReadonlyArray<NpcKey | "future_reader"> {
  const entry = CROSS_CHARACTER_REACTIONS.find(r => r.flag === flag);
  return entry?.reactsBy ?? [];
}

/** Resolve all NPCs that SET a given flag. */
export function settersForFlag(flag: string): ReadonlyArray<NpcKey | "system"> {
  const entry = CROSS_CHARACTER_REACTIONS.find(r => r.flag === flag);
  return entry?.setBy ?? [];
}

/** All canonical public flags. */
export function allRegisteredFlags(): ReadonlyArray<string> {
  return CROSS_CHARACTER_REACTIONS.map(r => r.flag);
}

// --- Bank-discovery helpers ----------------------------------------------

/**
 * Read all flags actually written by lines in ALL_NPC_LINES (via setsPublicFlags).
 * Used by tests to verify the registry is in sync with the banks.
 */
export function flagsActuallyWrittenByBanks(): ReadonlyArray<string> {
  const written = new Set<string>();
  for (const line of ALL_NPC_LINES) {
    for (const flag of line.setsPublicFlags ?? []) {
      written.add(flag);
    }
  }
  return Array.from(written);
}

/**
 * Read all flags actually reacted-to by lines in ALL_NPC_LINES (via
 * reactsToPublicFlag). Used by tests.
 */
export function flagsActuallyReactedByBanks(): ReadonlyArray<string> {
  const reacted = new Set<string>();
  for (const line of ALL_NPC_LINES) {
    if (line.reactsToPublicFlag) reacted.add(line.reactsToPublicFlag);
  }
  return Array.from(reacted);
}
