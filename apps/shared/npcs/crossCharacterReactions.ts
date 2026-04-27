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

  // ─── Oracle Origin canon witnessed (Phase 6b.3 sub-chunk E) ────────
  {
    flag: "oracle_origin_canon_witnessed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Phase 6+ NPCs aware of canonical Origin
    canonicalNote:
      "Per Oracle bible §2.1 + writers'-guide spec: when the player " +
      "canonically witnesses the canonical Thalorian soul-debate origin " +
      "memory (canonical-doorway / Collector-walked-through anchor), the " +
      "canonical Origin canon canonically lands. The flag opens " +
      "downstream Phase 6+ NPC reactive registers for canonical-aware " +
      "characters (the Hierophant per §4.2 'preparing for return'; the " +
      "Antiquarian per his future canonical-Origin-shelf canon).",
  },

  // ─── Oracle Harvest canon witnessed (Phase 6b.3 sub-chunk E) ───────
  {
    flag: "oracle_harvest_canon_witnessed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Phase 6+ NPCs + future Architect bible
    canonicalNote:
      "Per Oracle bible §2.2 + writers'-guide spec: when the player " +
      "canonically witnesses the canonical Collector-Harvest memory " +
      "(canonical 'taken' canon + canonical pre-Prisoner amnesia onset), " +
      "the canonical Harvest canon canonically lands. The flag opens " +
      "downstream Phase 6+ NPC reactive registers — particularly the " +
      "future Architect-bible canon (the Architect canonically made the " +
      "False Prophet clone from the Oracle's harvested template).",
  },

  // ─── Oracle Liberation canon witnessed (Phase 6b.3 sub-chunk F) ────
  {
    flag: "oracle_liberation_canon_witnessed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Future Enigma + Antiquarian banks
    canonicalNote:
      "Per Oracle bible §2.7 + writers'-guide spec: when the player " +
      "canonically witnesses the canonical Liberation memory — the " +
      "canonical Enigma + Programmer Panopticon raid + Warden " +
      "destruction — the canonical Liberation canon canonically lands. " +
      "The flag opens downstream Phase 6+ NPC reactive registers — " +
      "particularly the future Enigma bible (the canonical liberator-" +
      "pair canon) + the Antiquarian / Daniel Cross / Programmer canon " +
      "(canonical 'I helped the Enigma raid' acknowledgment register).",
  },

  // ─── Oracle Heart-of-Time canon witnessed (Phase 6b.3 sub-chunk F) ─
  {
    flag: "oracle_heart_of_time_canon_witnessed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Hierophant + Enigma Phase 6+
    canonicalNote:
      "Per Oracle bible §2.10 + writers'-guide spec: the canonical " +
      "Heart-of-Time / Epoch-1 anchor is the saga's clearest single " +
      "Stage-4-weave-anchor. When the player canonically witnesses the " +
      "canonical-arrival memory, the canonical Heart-of-Time canon " +
      "lands. Cross-bible bridges: Hierophant bible §4.10 (the " +
      "canonical-preparing-for-return canon canonically anchors here); " +
      "Seer bible §3.8 (canonical Epoch-1 sealing-event reference). " +
      "Downstream Phase 6+ NPCs gain canonical 'you canonically " +
      "witnessed the Heart-of-Time' acknowledgment register.",
  },

  // ─── Oracle Fall canon witnessed (Phase 6b.3 sub-chunk G) ──────────
  {
    flag: "oracle_fall_canon_witnessed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Saga-endgame Phase 6+ reactive registers
    canonicalNote:
      "Per Oracle bible §2.8 + writers'-guide spec: when the player " +
      "canonically witnesses the canonical Ch12 Fall-of-Reality " +
      "cinematic, the canonical Fall canon canonically lands. The " +
      "flag opens canonical saga-endgame Phase 6+ reactive registers " +
      "— the canonical-Fall is the saga's canonical-end-of-arc event.",
  },

  // ─── Oracle Disappearance announced (Phase 6b.3 sub-chunk G) ───────
  {
    flag: "oracle_disappearance_canon_announced",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Saga-endgame closure Phase 6+
    canonicalNote:
      "Per Oracle bible §2.9 + writers'-guide spec: when the player " +
      "canonically witnesses the canonical Ch12 Disappearance " +
      "announcement cinematic — 'I canonically disappear at the " +
      "canonical-end-of-time. I am canonically already going.' — the " +
      "canonical Disappearance canon canonically lands cinematic-" +
      "canonically. The flag opens saga-endgame closure Phase 6+ " +
      "reactive registers across the priority roster — the canonical-" +
      "Disappearance canonically affects every NPC's canonical post-" +
      "saga register.",
  },

  // ─── Oracle clone canon disclosed (Phase 6b.3) ─────────────────────
  {
    flag: "oracle_clone_canon_disclosed",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // The Meme + Architect (future banks)
    canonicalNote:
      "Per Oracle bible §2.5 + writers'-guide spec: when the player " +
      "asks the Oracle 'Was that you the Insurgency trusted?' the " +
      "canonical answer discloses the canonical two-layer falsification " +
      "(Architect's clone + Meme's impersonation). Set on canonical " +
      "False-Prophet ask-topic. Downstream Phase 6+ NPCs gain the " +
      "canonical 'you know about the clone' acknowledgment register.",
  },

  // ─── Oracle Meme disclosed to player (Phase 6b.3) ──────────────────
  {
    flag: "oracle_meme_disclosed_to_player",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // The Meme (future bank) + Phase 6+
    canonicalNote:
      "Per Oracle bible §4.1 + Meme bible §1.3 cross-bible canon: when " +
      "the player asks the Oracle about the Meme, the canonical 11-year " +
      "identity-theft register lands directly. The flag opens a " +
      "downstream Meme-bible reactive register where the Meme " +
      "canonically registers the player having received the canonical " +
      "Stolen-Voice canon from the canonical-protected source.",
  },

  // ─── Oracle will refuse canonical return (Phase 6b.3) ──────────────
  {
    flag: "oracle_will_refuse_canonical_return",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"], // Wraith Calder / Hierophant Phase 6+
    canonicalNote:
      "Per Oracle bible §4.2 + Hierophant bible §4.10 cross-bible canon: " +
      "the canonical 'he is preparing for my return; I am almost ready " +
      "to refuse' register lands when the player asks the Oracle about " +
      "the Hierophant. The flag signals that the Oracle has canonically " +
      "disclosed his refusal-of-canonical-return canon to the player. " +
      "Downstream Hierophant banks (when his Phase 6d.3 expansion " +
      "ships) react canonically — the Hierophant will canonically " +
      "receive him anyway.",
  },

  // ─── Player in Coda pact (Phase 6b.2 sub-chunk C) ──────────────────
  {
    flag: "player_in_coda_pact",
    setBy: ["vex_solene"],
    reactsBy: ["future_reader"], // Locke / Antiquarian / Phase 6+
    canonicalNote:
      "Per Vex bible §3.2 + writers'-guide spec: the canonical Coda " +
      "pact is the Acts 3-4 first-contact moment where the player " +
      "joins Coda's contract network. Set by the canonical pact-" +
      "signing cinematic. Downstream Phase 6+ NPCs react: Locke " +
      "registers the canonical 'pact-with-Coda' as a competing-" +
      "broker entry; the Antiquarian registers the canonical 'Coda " +
      "is auditing the audit' canon; other Phase 6+ NPCs gain the " +
      "canonical Coda-counterparty acknowledgment register.",
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
  {
    flag: "degen_disclosed_seer_kinship",
    setBy: ["the_degen"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Degen ask_about_seer (Phase 6c.1). Discloses canonical Ne-Yon-" +
      "kin status with the Seer (prophecy-domain) — sister-domain canon. " +
      "Future Seer reactive lines may acknowledge the disclosure.",
  },
  {
    flag: "degen_disclosed_jericho_recruitment",
    setBy: ["the_degen"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Degen ask_about_jericho (Phase 6c.1). Discloses canonical " +
      "Heart-of-Time placement-broker fee for Jericho Jones — silence-" +
      "shape preserved (mission canonically undisclosed). Future Companion " +
      "reactive lines may register the parallel.",
  },
  {
    flag: "companion_disclosed_donor_is_player",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion ask_donor (Phase 6c.2). Canonically discloses the " +
      "donor-canon (per dmc_clone_companion.md §1 stance #2): the donor " +
      "is the player's own Potential. Saga-load-bearing recognition; " +
      "future Hierophant / Eidolon / Nilmorg reactive lines may " +
      "acknowledge the canonical disclosure.",
  },
  {
    flag: "companion_acknowledged_nilmorg_midwifery",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion ask_about_nilmorg (Phase 6c.2). Canonically " +
      "acknowledges Nilmorg as the mid-wife (per §4.2). The 'Don't " +
      "thank me' canonical refusal is the Companion's first inherited " +
      "memory; future Nilmorg reactive lines may register the canonical " +
      "acknowledgment without inviting the thanks he canonically refuses.",
  },

  // ─── Companion Channel-4 first-word context-variant flags (Phase 6c.2 part 5)

  {
    flag: "companion_first_word_was_severance_season_name",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.4 first-word canon: another-Severance-ceremony " +
      "context fired; first word was a one-word echo of the season " +
      "name. Future Nilmorg reactive may register the canonical " +
      "season-name-echo as cross-Severance recognition.",
  },
  {
    flag: "companion_first_word_was_eidolon_nickname",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.4 + Eidolon §5.9 first-word translator canon: " +
      "Eidolon's Echo-mode + recognition-tone canonically translated " +
      "the first word as Eidolon's player-authored nickname. Future " +
      "Eidolon reactive lines may register the canonical translation.",
  },
  {
    flag: "companion_first_word_was_last",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.4 first-word canon: identity-chain-completion " +
      "context fired; first word was 'Last' — canonical mortality " +
      "acknowledgment per dmcNamingPrompts.ts. Saga-load-bearing " +
      "acknowledgment of player's chosen final-body canon.",
  },
  {
    flag: "companion_first_word_was_faction_coalition",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.4 default-fallback first-word canon: faction-" +
      "loyalty word 'Coalition' fired. Future Coalition-aligned NPC " +
      "reactive lines may register the canonical faction-recognition.",
  },
  {
    flag: "companion_first_word_was_faction_insurgency",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.4 default-fallback first-word canon: faction-" +
      "loyalty word 'Insurgency' fired. Future Insurgency-aligned NPC " +
      "reactive lines may register the canonical faction-recognition.",
  },
  {
    flag: "companion_named_in_hierophant_chamber",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.5 cross-character naming canon: Hierophant " +
      "named the Companion in the chamber following the canonical " +
      "Wraith Calder first-word. Future Hierophant reactive lines may " +
      "register the canonical second-naming as cross-bible canon.",
  },
  {
    flag: "companion_named_via_eidolon_translation",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §1.5 + Eidolon §5.9 cross-character naming canon: " +
      "Eidolon's Echo-mode translated the canonical late-articulation " +
      "sound-stack into a name. Future Eidolon reactive lines may " +
      "register the canonical two-soul-substrate canon.",
  },

  // ─── Companion post-naming Trade Empire integration flags (Phase 6c.2 part 6)

  {
    flag: "companion_witnessed_locke_contract_signing",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §5.6 + Locke cross-bible canon: post-naming " +
      "Companion canonically witnessed a Locke contract signing. " +
      "Future Locke reactive lines may register the canonical witness; " +
      "future Companion lines may reference the canonical hidden-clause " +
      "trust-stance the player canonically chose.",
  },
  {
    flag: "companion_witnessed_nilmorg_contract_signing",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion §5.6 + Nilmorg cross-bible canon: post-naming " +
      "Companion canonically witnessed a Nilmorg contract signing. " +
      "Canonical 'Don't thank him' inherited refusal applies; future " +
      "Nilmorg reactive lines may register the canonical witness " +
      "without inviting the thanks he canonically refuses.",
  },

  // ─── Game Master ask-topic flags (Phase 6d.1 part 1)

  {
    flag: "game_master_acknowledged_authority_contract",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master ask_about_authority (Phase 6d.1). Canonically " +
      "delivers the 5-word epitaph 'They honored the contract. Every " +
      "clause.' per the_game_master.md §1.8 silence-shape. Future " +
      "Authority-aligned reactive lines may register the canonical " +
      "acknowledgment.",
  },
  {
    flag: "game_master_oracle_arena_reverence_disclosed",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master ask_oracle_arena (Phase 6d.1). Canonically " +
      "discloses the Collectors' Arena was built to recover the Oracle " +
      "(per §4.13 most-reverent canonical act). Future Oracle reactive " +
      "lines may register the canonical reverence; future Hierophant " +
      "reactive lines may register the canonical 'preparing for the " +
      "Oracle's return' parallel.",
  },
  {
    flag: "game_master_cult_revealed_to_player",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master cult_introduction_redacted (Phase 6d.1 part 2). " +
      "Canonically discloses the Game Masters cult to the player via " +
      "the canonical strikethrough redaction signature per §1.5. " +
      "Future Oracle reactive lines may register the canonical " +
      "Matrix-of-Dreams maintenance canon.",
  },
  {
    flag: "game_master_cult_oracle_recovery_canon_disclosed",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master cult_oracle_recovery_progresses (Phase 6d.1 " +
      "part 2). Canonically discloses the cult continues the Oracle " +
      "recovery work post-original-destruction. Future Oracle reactive " +
      "lines may register the canonical 'Oracle approaches' canon.",
  },
  {
    flag: "game_master_displaced_eidolon_glyph",
    setBy: ["the_game_master"],
    reactsBy: ["your_eidolon", "future_reader"],
    canonicalNote:
      "Per Game Master presence-overwhelming-displaces-eidolon-glyph " +
      "(Phase 6d.1 part 3). Canonical cross-bible canon per " +
      "eidolon.md §4.x Game Master cross-reference: at Overwhelming " +
      "presence the GM canonically displaces the Eidolon's glyph " +
      "during fights. Eidolon reactive lines may canonically register " +
      "the displacement as canonical-discomfort.",
  },
  {
    flag: "game_master_checkmated_by_player",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master chess.checkmate_player_wins (Phase 6d.1 part 4). " +
      "Canonical Arena-rigged-for-victory canon per §2.3: the Collectors' " +
      "Arena was canonically engineered for player victory at the highest " +
      "design layer. Future Oracle / Hierophant reactive lines may " +
      "register the canonical-outcome as canon-fulfilled.",
  },
  {
    flag: "meme_mascot_silence_canonically_held",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme ask_about_mascot (Phase 6d.2 part 1). Canonically " +
      "preserves the §1.10 + §3.3 silence-shape: the Mascot is the " +
      "Meme's deepest protected mystery. The bank canonically refuses " +
      "to name / describe / face the Mascot. Future writers may build " +
      "Stage-4-weave content around this canonical silence WITHOUT " +
      "violating it.",
  },
  {
    flag: "meme_real_truth_leak_acknowledged",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme real.less_than_was (Phase 6d.2 part 2). Canonical " +
      "Tell #4 single-word truth-leak in Real-form register: 'I'm " +
      "less than I was.' The truer-than-Broadcast canon. Future " +
      "Oracle / Hierophant reactive lines may register the canonical " +
      "truth-leak as canon-compatible recognition.",
  },
  {
    flag: "meme_claimed_architect_role",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme replacement.tonight_i_take_role (Phase 6d.2 part 2). " +
      "Canonical Ch12 Replacement-register canon: the Meme canonically " +
      "claims the Architect's role. §1.10 silence-shape preserved " +
      "(canonical 'I will not call him father'). Future Architect / " +
      "Hierophant / Oracle reactive lines may register the canonical " +
      "succession-claim.",
  },
  {
    flag: "meme_channel_7_mascot_silence_held",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme channel_7.mascot_ad_break (Phase 6d.2 part 4). The " +
      "Channel 7 ad-break canonically advertises something the " +
      "Mascot canonically loved — without ever canonically naming " +
      "what it was. §1.10 silence-shape held: the canonical 'I had " +
      "a friend once' is the maximum acknowledgment. Future writers " +
      "may build Stage-4-weave Channel 7 content WITHOUT violating " +
      "the canonical silence.",
  },
  {
    flag: "meme_relinquished_stolen_oracle_voice",
    setBy: ["the_meme"],
    reactsBy: ["the_oracle", "future_reader"],
    canonicalNote:
      "Per Meme cascade.acknowledges_oracle_returned (Phase 6d.2 " +
      "part 5). Canonical post-Ch6-disambiguation Real-register " +
      "acknowledgment: the Meme canonically releases the canonical " +
      "White Oracle face. Future Oracle reactive lines may register " +
      "the canonical-relinquishment.",
  },
  {
    flag: "meme_began_replacement_pivot",
    setBy: ["the_meme"],
    reactsBy: ["the_oracle", "future_reader"],
    canonicalNote:
      "Per Meme cascade.replacement_pivot (Phase 6d.2 part 5). " +
      "Canonical 'if I cannot wear him, I canonically become him' " +
      "canon — canonical earliest foreshadow of the canonical " +
      "Replacement-register Architect-succession arc per §1.7. " +
      "Future Architect / Hierophant reactive lines may register " +
      "the canonical-pivot.",
  },

  // ─── Hierophant ask-topic flags (Phase 6d.3 part 1)

  {
    flag: "hierophant_disclosed_oracle_witness_channel_canon",
    setBy: ["wraith_calder"],
    reactsBy: ["the_oracle", "future_reader"],
    canonicalNote:
      "Per Hierophant ask_about_oracle (Phase 6d.3 part 1). Canonical " +
      "Inheriting-band-only disclosure: the player is canonically NOT " +
      "the Oracle (per bible §4.10 canon-update); the player has been " +
      "moving through Oracle-memories via the witness-channel. The " +
      "Hierophant canonically distinguishes the two. Future Oracle " +
      "reactive lines may register the canonical-disclosure.",
  },
  {
    flag: "hierophant_acknowledged_tea_cupboard_canon",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant ask_tea_cupboard (Phase 6d.3 part 1). Canonical " +
      "Inheriting-band keepsake canon per bible §3.8 + §3.9: " +
      "'something the Oracle once gave me to hold.' Reserved for the " +
      "canonical apex band only. Future Oracle reactive lines may " +
      "register the canonical 3000-year-holding canon.",
  },
  {
    flag: "hierophant_covenant_i_will_remember_offered",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant present.i_will_remember (Phase 6d.3 part 3). " +
      "Canonical §1.7 Tell #3 covenant phrase: 'I will remember' is " +
      "liturgical for the Hierophant — it is canonically a covenant, " +
      "not a courtesy, reserved for moments when the trust meter " +
      "advances.",
  },
  {
    flag: "hierophant_named_player_parallel_inheritor",
    setBy: ["wraith_calder"],
    reactsBy: ["the_oracle", "future_reader"],
    canonicalNote:
      "Per Hierophant inheriting.architecture_of_grief (Phase 6d.3 " +
      "part 3). Canonical §3.3 apex line: 'You are walking the " +
      "architecture I made of grief.' Promotes Present → Inheriting. " +
      "Council canonically considers player a parallel inheritor of " +
      "the work. Reserved canonical-once-per-playthrough.",
  },
  {
    flag: "hierophant_disclosed_meme_shadow_tongue_adjacency",
    setBy: ["wraith_calder"],
    reactsBy: ["the_meme", "future_reader"],
    canonicalNote:
      "Per Hierophant inheriting.shadow_tongue_meme_adjacency (Phase " +
      "6d.3 part 3). Canonical §4.7 cross-bible canon: the Hierophant " +
      "is canonically the only being positioned to name the canonical " +
      "Meme/Shadow-Tongue adjacency. Future Meme reactive lines may " +
      "register the canonical-naming.",
  },
  {
    flag: "hierophant_admitted_canonical_hypocrisy",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant inheriting.three_times_in_two_hundred (Phase " +
      "6d.3 part 3). Canonical §3.6 hypocrisy-admission canon: " +
      "Inheriting-band-only canonical confession that the public " +
      "'I did not notice' canon was canonically slightly easier-on-" +
      "himself than the truth. The canonical 'three times in two " +
      "hundred years, I noticed' canon lands.",
  },
  {
    flag: "hierophant_companion_status_inherited",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant sai.post.companion_now (Phase 6d.3 part 4). " +
      "Canonical §3.3 sacrifice-axis-inversion-completion: trust " +
      "deeper than Inheriting canonically transforms threat into " +
      "companion permanently. Council canonically informed of the " +
      "canonical-transition.",
  },
  {
    flag: "hierophant_offered_canonical_deathbed_witness",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant sai.post.death_as_witness (Phase 6d.3 part 4). " +
      "Canonical §3.9 deathbed-witness offer: Inheriting-band canonical " +
      "permission to canonically witness the Hierophant's eventual " +
      "death. Reserved canonical-once-per-playthrough.",
  },
  {
    flag: "eidolon_perish_prelude_witnessed",
    setBy: ["your_eidolon"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Eidolon bond.inseparable.perish_prelude (Phase 6d.4 part 1). " +
      "Canonical Inseparable-band perish-prelude register: the canonical " +
      "Eidolon canonically lays its head against the player's hand " +
      "for canonical-final-bond-resonance. Reserved canonical-once-" +
      "per-playthrough; canonical perish-imminent context.",
  },

  // ─── Companion canonical-event public flags (Phase 6d.4 part 1)

  {
    flag: "companion_first_word_spoken",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["your_eidolon", "future_reader"],
    canonicalNote:
      "Per Companion §1.4 first-word canon: the canonical permanent " +
      "flag set when Channel 4 first-word fires (any context variant). " +
      "Canonically cross-character readable: Eidolon Echo-mode " +
      "canonically witnesses the canonical-first-word event.",
  },
  {
    flag: "companion_named",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["your_eidolon", "future_reader"],
    canonicalNote:
      "Per Companion §1.5 naming-event canon: the canonical permanent " +
      "flag set when the canonical naming-event fires (Channel 5 " +
      "unlock). Canonically cross-character readable: Eidolon Echo-" +
      "mode canonically registers the canonical post-naming kin-" +
      "recognition.",
  },
  {
    flag: "eidolon_canonical_goodbye_acknowledged",
    setBy: ["your_eidolon"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Eidolon ask_goodbye (Phase 6d.4 part 2). Canonical perish-" +
      "prelude register: Inseparable-band-only canonical 'lays its " +
      "head against the player's hand for canonical-final-bond-" +
      "resonance' canon. Reserved canonical-once-per-playthrough; " +
      "fires only near canonical perish-condition.",
  },

  // ─── First-meeting tree public flags (Phase 6e.1a)

  {
    flag: "nilmorg_refused_canonical_thanks_first_contact",
    setBy: ["nilmorg"],
    reactsBy: ["dmc_clone_companion", "future_reader"],
    canonicalNote:
      "Per Nilmorg first_meeting tree refusal_branch (Phase 6e.1a). " +
      "Canonical §4.8 'Don't thank me' first-contact refusal. Future " +
      "Companion reactive lines may register the canonical-refusal " +
      "as canonical-first-inherited-memory (Companion §4.2 mid-wife " +
      "canon).",
  },
  {
    flag: "vex_filed_player_as_audit_aware_first_contact",
    setBy: ["vex_solene"],
    reactsBy: ["adjudicator_locke", "future_reader"],
    canonicalNote:
      "Per Vex first_meeting tree audit_aware_branch (Phase 6e.1a). " +
      "Canonical Vigilance-axis first-contact filing — player " +
      "canonically asked about Vex's paperwork. Future Locke reactive " +
      "lines may register the canonical-cross-broker-audit interest.",
  },
  {
    flag: "hierophant_first_contact_silence_held",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant first_meeting tree silence_held_branch (Phase " +
      "6e.1a). Canonical §1.7 Tell #1 first-look-pause-as-gratitude " +
      "canon: player canonically held silence well, canonically " +
      "earned the canonical first-look. Saga-load-bearing trust-band " +
      "promotion seed.",
  },
  {
    flag: "hierophant_first_contact_get_up_weaponized",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant first_meeting tree get_up_mistake_branch (Phase " +
      "6e.1a). Canonical §3.9 + §1.8 'verb of someone I outgrew' " +
      "trust-breach canon: player canonically used Wraith Calder's " +
      "imperative against the Hierophant. Canonical Hostile-band " +
      "trust-state seed.",
  },

  // ─── Phase 6e.1b first-meeting tree public flags

  {
    flag: "seer_recognized_player_recursion_first_contact",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Seer first_meeting tree pre_recorded_meta_branch (Phase " +
      "6e.1b). Canonical Wit-axis recursion-recognition: player " +
      "canonically catches the canonical pre-recording mechanic. " +
      "Saga-load-bearing first-contact recognition.",
  },
  {
    flag: "seer_offered_staff_to_player_first_contact",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Seer first_meeting tree quiet_acceptance_branch (Phase " +
      "6e.1b). Canonical Vulnerability-axis apex: player canonically " +
      "held silence; the Seer canonically offers the staff. Canonical " +
      "§2.1 Mechronis canonical scripted-loss canon.",
  },
  {
    flag: "oracle_player_offered_misidentification_first_contact",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Oracle first_meeting tree recognition_branch (Phase 6e.1b). " +
      "Canonical Vulnerability-axis misidentification: player " +
      "canonically offered 'I think I have been you'. Oracle " +
      "canonically corrects per §canon-update: 'we are canonically " +
      "two; you have been moving through my memories'.",
  },
  {
    flag: "gm_recognized_player_paperwork_register",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master first_meeting tree trial_absurd_branch (Phase " +
      "6e.1b). Canonical Wit-axis recognition: player canonically " +
      "matches the canonical-paperwork register per §1.9 metaphor-" +
      "source canon. Canonical Game-Master + player canonical-shared-" +
      "paperwork register seed.",
  },
  {
    flag: "meme_first_contact_mascot_question_held_silence",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme first_meeting tree mascot_question_branch (Phase " +
      "6e.1b). Canonical §1.10 + §3.3 Mascot silence-shape preserved: " +
      "player canonically asked the canonical-respectful question; " +
      "Meme canonically held the canonical-grief-as-silence.",
  },
  {
    flag: "meme_first_contact_player_witnessed_succession",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme first_meeting tree witness_branch (Phase 6e.1b). " +
      "Canonical Wit-axis apex: player canonically witnessed the " +
      "canonical Ch12 succession-claim in canonical-silence. Saga-" +
      "load-bearing Stage-4-weave-anchor canonical event.",
  },

  // ─── Phase 6e.1c first-meeting tree public flags

  {
    flag: "degen_filed_player_as_house_aware_first_contact",
    setBy: ["the_degen"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Degen first_meeting tree house_wins_branch (Phase 6e.1c). " +
      "Canonical Wit-axis recognition: player canonically called the " +
      "canonical 'house always wins' recognition; Degen canonically " +
      "files as canonical-system-aware. Trust-positive seed.",
  },
  {
    flag: "companion_first_contact_kneel",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion first_meeting tree kneel_branch (Phase 6e.1c). " +
      "Canonical Mercy-axis non-verbal player-action: kneeling at " +
      "canonical-Severance-Prize ceremony arrival canonically " +
      "triggers bilateral kin-recognition glyph. Saga-load-bearing " +
      "first-bond initialisation.",
  },
  {
    flag: "eidolon_first_contact_touch_resonance",
    setBy: ["your_eidolon"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Eidolon first_meeting tree touch_branch (Phase 6e.1c). " +
      "Canonical Vulnerability-axis non-verbal player-action: " +
      "touching canonically triggers full bond-resonance per existing " +
      "eidolon.cinematic.bond_resonance.first_touch canon (head-into-" +
      "palm posture). Saga-load-bearing canonical-bond-initialisation.",
  },

  // ─── Phase 6e.2a multi-turn chain completion flags

  {
    flag: "locke_completed_canonical_contract_negotiation_chain",
    setBy: ["adjudicator_locke"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Locke chain.contract_negotiation.signing_completion (Phase " +
      "6e.2a). Canonical 4-line contract-negotiation chain completed: " +
      "signing-intro → hidden-clause-disclosure → counter-offer → " +
      "signing-completion. Canonical Mercantile-register chain end-" +
      "state.",
  },
  {
    flag: "nilmorg_completed_canonical_severance_extraction_chain",
    setBy: ["nilmorg"],
    reactsBy: ["dmc_clone_companion", "future_reader"],
    canonicalNote:
      "Per Nilmorg chain.severance.delivery (Phase 6e.2a). Canonical " +
      "5-line Severance-Prize-extraction chain completed: arrival → " +
      "witness → extraction → containment → delivery. Canonical " +
      "'Don't thank me' canonical refusal canon canonically lands at " +
      "delivery. Companion canonically inherits the refusal as " +
      "canonical-first-memory.",
  },
  {
    flag: "vex_completed_canonical_engineer_zero_reveal_chain",
    setBy: ["vex_solene"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Vex chain.engineer_zero_reveal.integration (Phase 6e.2a). " +
      "Canonical 5-line Engineer Zero reveal chain completed: hint " +
      "→ suspicion → confirmation → asymmetric-knowledge → " +
      "integration. §1.6 silence-shape preserved across all 5 lines: " +
      "NEVER 'Engineer' / 'Engineer Zero' / 'Agent Zero' aloud. " +
      "Saga-load-bearing 4-stage reveal-gate canon traversed.",
  },
  {
    flag: "hierophant_completed_canonical_naming_recovery_chain",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant chain.naming_recovery.completion (Phase 6e.2a). " +
      "Canonical 4-line Long Mourning naming-recovery chain completed: " +
      "arrival → name-offering → wall-inscription → completion. " +
      "Canonical 'I will remember' covenant canon canonically lands " +
      "at completion.",
  },
  {
    flag: "oracle_completed_canonical_dream_interpretation_chain",
    setBy: ["the_oracle"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Oracle chain.dream_interpretation.mission_unlock_ack (Phase " +
      "6e.2a). Canonical 3-line dream-sequence interpretation chain " +
      "completed: dream-residue → instruction-residue → mission-" +
      "unlock-acknowledgment. Canonical OCB-7 substrate-only canon " +
      "preserved across all 3 lines.",
  },
  {
    flag: "companion_completed_canonical_post_naming_integration_chain",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion chain.post_naming_integration.first_trust_band_" +
      "crossing (Phase 6e.2a). Canonical 4-line post-naming integration " +
      "chain completed: first-named-line → first-mission-ack → first-" +
      "NPC-intro → first-trust-band-crossing. Canonical Channel-5 " +
      "named-personality register lands across all 4 lines.",
  },

  // ─── Phase 6e.2b multi-turn chain completion flags

  {
    flag: "seer_completed_canonical_pre_recorded_prophecy_chain",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Seer chain.pre_recorded_prophecy.recording_acknowledgment " +
      "(Phase 6e.2b). Canonical 4-line pre-recorded-prophecy chain " +
      "completed: foretelling → revision-prompt → revision → " +
      "recording-acknowledgment. Demonstrates §2.3 cross-time " +
      "pre-recording mechanic.",
  },
  {
    flag: "degen_completed_canonical_data_source_progression_chain",
    setBy: ["the_degen"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Degen chain.data_source.ne_yon_kin_disclosure (Phase 6e.2b). " +
      "Canonical 4-line casino-data-source progression chain " +
      "completed: first-recognition (Cold-table) → recognized-band-" +
      "mission → marked-band-call → ne-yon-kin-disclosure. Canonical " +
      "trust-progression across 4 bands.",
  },
  {
    flag: "gm_completed_canonical_chess_progression_chain",
    setBy: ["the_game_master"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Game Master chain.chess_progression.checkmate (Phase " +
      "6e.2b). Canonical 4-line chess-progression chain completed: " +
      "opening → mid-game-pause → late-game-recognition → checkmate. " +
      "Canonical dead_AI register chess-only-contact canon throughout.",
  },
  {
    flag: "meme_completed_canonical_broadcast_canon_chain",
    setBy: ["the_meme"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Meme chain.broadcast_canon.sign_off_self_implication " +
      "(Phase 6e.2b). Canonical 4-line Broadcast-canon chain " +
      "completed: late-night-intro → viewer-implication → ad-break-" +
      "truth-leak (canonical 'I'm less than I was' Tell #4) → sign-" +
      "off-self-implication.",
  },
  {
    flag: "eidolon_completed_canonical_bond_deepening_cascade_chain",
    setBy: ["your_eidolon"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Eidolon chain.bond_deepening.silence_settle (Phase 6e.2b). " +
      "Canonical 4-line bond-deepening cascade chain completed: " +
      "glyph-pulse → posture-shift → sound-resonance → silence-settle. " +
      "Canonical 4-channel cascade for canonical-bond-deepening event.",
  },

  // ─── Phase 6e.3 cross-NPC callback chain completion + setter flags

  {
    flag: "vex_completed_canonical_touche_arc_callback_chain",
    setBy: ["vex_solene"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Vex callback.touche_arc.broken_trust_response (Phase 6e.3). " +
      "Canonical 5-line Touché-arc reactive callback chain completed: " +
      "notice → silent-withdrawal → forgiveness-quickly → forgiveness-" +
      "active → broken-trust-response. Reacts to canonical Locke flag.",
  },
  {
    flag: "companion_completed_canonical_nilmorg_delivery_callback_chain",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion callback.nilmorg_delivery.integration (Phase 6e.3). " +
      "Canonical 5-line Nilmorg-delivery reactive callback chain " +
      "completed. Reacts to canonical Nilmorg severance-extraction-" +
      "chain completion flag.",
  },
  {
    flag: "hierophant_completed_canonical_companion_first_word_callback_chain",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant callback.companion_first_word.continuation_sealed " +
      "(Phase 6e.3). Canonical 5-line Companion-first-word reactive " +
      "callback chain completed. Reacts to canonical companion_first_" +
      "word_was_wraith_calder flag.",
  },
  {
    flag: "meme_attempted_seer_falsification",
    setBy: ["the_meme"],
    reactsBy: ["the_seer", "future_reader"],
    canonicalNote:
      "Per Meme callback.seer_falsification.attempt (Phase 6e.3). " +
      "Canonical Meme falsification-attempt setter; the canonical-" +
      "attempt canonically fails per §4.4 cannot-be-falsified canon. " +
      "Triggers canonical Seer 4-line reactive callback chain.",
  },
  {
    flag: "seer_completed_canonical_meme_falsification_callback_chain",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Seer callback.meme_falsification.recordings_predate_reach " +
      "(Phase 6e.3). Canonical 4-line Meme-falsification reactive " +
      "callback chain completed. Demonstrates canonical pre-recordings-" +
      "predate-Meme-reach canon.",
  },
  {
    flag: "hierophant_completed_canonical_oracle_cascade_callback_chain",
    setBy: ["wraith_calder"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Hierophant callback.oracle_cascade.witness_channel_ack " +
      "(Phase 6e.3). Canonical 3-line Oracle-disambiguation reactive " +
      "callback chain completed (Hierophant arc of the canonical " +
      "Oracle recognition-cascade). Reacts to canonical oracle_" +
      "disambiguated_player_from_clone flag.",
  },
  {
    flag: "companion_completed_canonical_oracle_cascade_callback_chain",
    setBy: ["dmc_clone_companion"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Companion callback.oracle_cascade.kin_recognition (Phase " +
      "6e.3). Canonical 3-line Oracle-disambiguation reactive " +
      "callback chain completed (Companion arc of the canonical " +
      "Oracle recognition-cascade). Non-verbal canonical 3-channel " +
      "cascade (glyph → posture → sound).",
  },
  {
    flag: "seer_completed_canonical_oracle_cascade_callback_chain",
    setBy: ["the_seer"],
    reactsBy: ["future_reader"],
    canonicalNote:
      "Per Seer callback.oracle_cascade.recording_completes (Phase " +
      "6e.3). Canonical 4-line Oracle-disambiguation reactive callback " +
      "chain completed (Seer arc of the canonical Oracle recognition-" +
      "cascade). Demonstrates canonical pre-recording predicted the " +
      "canonical Ch6 disambiguation.",
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
