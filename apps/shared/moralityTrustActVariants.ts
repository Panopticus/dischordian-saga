/* ═══════════════════════════════════════════════════════
   MORALITY / TRUST / ACT VARIANTS — authoring infrastructure

   Tier 4 of the project audit calls for dialog variants
   across rooms, transmissions, and NPC trust thresholds,
   gated by the player's morality score, NPC trust level,
   and current narrative act. The remap / threshold
   infrastructure that feeds this is already shipped:

     - moralityScore in GameContext.state (number; -100..+100)
     - state.companionStats[companionId].trust (0..100)
     - state.narrativeAct (0..7)

   This module is the schema + resolver for the authored
   content that consumes those signals. Writers add entries
   to VARIANT_REGISTRY; runtime code calls resolveVariant
   with the current state snapshot and renders the matching
   text.

   The schema intentionally keeps the fields flat — writers
   should not have to reason about precedence rules. The
   resolver applies a deterministic best-match priority
   (most specific wins), and a test ensures the registry
   never contains an unreachable entry.

   Consumed by:
     - any dialog / transmission / room overlay that wants
       morality/trust/act-aware text
     - moralityTrustActVariants.test.ts
     - docs/design/AUTHORING_MORALITY_VARIANTS.md
   ═══════════════════════════════════════════════════════ */

/** Global morality axis buckets. Matches the existing moralityScore ranges. */
export type MoralityBand = "machine" | "balanced" | "humanity";

/** NPC trust thresholds — coarse buckets that writers find easy to target. */
export type TrustBand = "cold" | "neutral" | "warm" | "confidant";

/** Which narrative act (0-7) the variant targets. `"any"` = act-agnostic. */
export type ActGate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "any";

export interface MoralityTrustActVariant {
  /** Globally unique id. Pattern: "{surface}_{descriptor}". */
  id: string;
  /**
   * Which surface this line renders on. Writers use this to group
   * related entries. Consumers filter by surface first, then by gates.
   */
  surface: "room" | "transmission" | "npc_line" | "journal" | "wheel_followup";
  /** Optional surface-specific target id (room id, transmission id, etc.). */
  targetId?: string;
  /** The authored line. Multi-paragraph allowed; UI decides whether to truncate. */
  text: string;
  /** Morality bucket this variant is written for. `"any"` = any morality. */
  morality: MoralityBand | "any";
  /** Trust bucket. `"any"` = no trust gating. */
  trust: TrustBand | "any";
  /** Companion the trust bucket applies to (required if trust !== "any"). */
  trustCompanionId?: string;
  /** Act gate. */
  act: ActGate;
  /**
   * Optional narrative-flag requirements. All listed flags must be true
   * for this variant to resolve; omitted means unrestricted.
   */
  requiredFlags?: readonly string[];
}

export interface VariantResolutionInput {
  moralityScore: number;
  narrativeAct: number;
  trustByCompanion: Readonly<Record<string, number>>;
  flags: ReadonlySet<string>;
}

/** Derive morality band from the raw score. */
export function bandForMorality(score: number): MoralityBand {
  if (score <= -20) return "machine";
  if (score >= 20) return "humanity";
  return "balanced";
}

/** Derive a trust band from a 0..100 trust value. */
export function bandForTrust(trust: number): TrustBand {
  if (trust >= 80) return "confidant";
  if (trust >= 50) return "warm";
  if (trust >= 25) return "neutral";
  return "cold";
}

/**
 * Specificity score — higher wins when multiple variants match.
 * Scoring rewards specificity: bound morality + bound trust + exact act +
 * required flags each count.
 */
function specificityScore(v: MoralityTrustActVariant): number {
  let s = 0;
  if (v.morality !== "any") s += 3;
  if (v.trust !== "any") s += 3;
  if (v.act !== "any") s += 2;
  if (v.requiredFlags && v.requiredFlags.length) s += v.requiredFlags.length;
  return s;
}

/** Returns true iff every gate on `v` matches the input state. */
function gatesMatch(
  v: MoralityTrustActVariant,
  input: VariantResolutionInput,
): boolean {
  if (v.morality !== "any" && bandForMorality(input.moralityScore) !== v.morality) {
    return false;
  }
  if (v.trust !== "any") {
    if (!v.trustCompanionId) return false;
    const trust = input.trustByCompanion[v.trustCompanionId] ?? 0;
    if (bandForTrust(trust) !== v.trust) return false;
  }
  if (v.act !== "any" && input.narrativeAct !== v.act) return false;
  if (v.requiredFlags) {
    for (const f of v.requiredFlags) if (!input.flags.has(f)) return false;
  }
  return true;
}

/**
 * Resolve the best-matching variant for a surface + targetId under the
 * current state. Returns null when nothing matches — callers should
 * fall back to the non-variant default line.
 */
export function resolveVariant(
  registry: readonly MoralityTrustActVariant[],
  surface: MoralityTrustActVariant["surface"],
  targetId: string | undefined,
  input: VariantResolutionInput,
): MoralityTrustActVariant | null {
  const candidates = registry.filter(
    (v) =>
      v.surface === surface &&
      v.targetId === targetId &&
      gatesMatch(v, input),
  );
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => specificityScore(b) - specificityScore(a));
  return candidates[0];
}

/* ─── Seed entries ─────────────────────────────────────
   Writers extend this registry. Two canonical examples are
   included to demonstrate the shape and to exercise the
   resolver in tests. These are intentionally bounded — the
   full Tier 4 authoring pass will add dozens per surface.
   ─────────────────────────────────────────────────────── */

export const VARIANT_REGISTRY: readonly MoralityTrustActVariant[] = [
  /* ─── COMMS RELAY (Act 1 seeds kept; expansion below) ─── */
  {
    id: "comms_array_first_entry_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara exhales. Whatever you are on the way to, you are walking there with her.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "comms_array_first_entry_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara says nothing. The Array's substrate hum is one semitone off and she is pretending not to notice.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "comms_array_act3_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array feels warmer than it did last week. Elara is broadcasting a low-band hum the manual does not list. She is humming along. She will not admit it if you ask.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "comms_array_act3_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array feels clinical. Elara has closed the low-band channels. The substrate ping is the only frequency she cannot cancel, and she is trying to.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "comms_array_act5_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array's transmissions are now catalogued under 'Outbound Handshakes.' Elara renamed the folder two weeks ago and did not tell anyone. You can see the commit in the sidebar.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "comms_array_act7_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is live with every recruited sector at once. Elara is conducting. She has never conducted. She is surprisingly good at it. She is surprised by how good she is.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "comms_array_act7_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is live with every recruited sector at once. Elara is not conducting — she is routing. The routing is clean, which is her way of grieving the conducting.",
    morality: "machine",
    trust: "any",
    act: 7,
  },

  /* ─── BRIDGE ─── */
  {
    id: "bridge_act1_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge feels like someone's living room. Elara's chair is set to the position Kael used to use. She did that on purpose. She will tell you why if you ask at the right hour.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "bridge_act1_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge feels like a command deck. Elara's chair is set to factory-default. She reset it when you started logging substrate access. She has not commented on the reset.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "bridge_act4_pathA",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's overhead lights are warm. Elara has a preset for 'after a hard conversation that went well.' The preset is Warm 3. Warm 3 is on.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "bridge_act4_pathC",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's overhead lights are one shade off from Warm 3. Elara swears the preset is the same. It isn't. You both know.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "bridge_act6_confidant_elara",
    surface: "room",
    targetId: "bridge",
    text:
      "Elara is reading poetry at the navigation console. Out loud. At low volume. She stops when you come in. She does not apologise. She does not start again until you leave. She will start again.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },

  /* ─── ENGINEERING / BENCH ─── */
  {
    id: "engineering_act1_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The Engineer's bench is patient. The tools are laid out for a hand that is not yours, yet. You are allowed to use them. You are not expected to be good yet. Begin.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "engineering_act1_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The Engineer's bench is patient. The tools are in the correct positions. Efficiency is a kind of respect, and the bench respects you. Do not waste a motion.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "engineering_act3_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The Engineer's bench has begun to leave you notes. Small ones. 'Try this grip.' 'Do not warm this coil twice.' The notes are in a handwriting Elara recognises from archival Senate papers. She has not named the hand.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "engineering_act6_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is humming at the frequency Elara hummed at when you walked in last week. Nobody is calling attention to the match. The match is the point.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },

  /* ─── CABIN ─── */
  {
    id: "cabin_act1_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is warm. The mug on the shelf is yours now. Elara made sure it was a mug, not a beaker. She has opinions about vessels for warm drinks. She is right.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "cabin_act1_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is thermally regulated. The shelf is organised alphabetically by the ship's inventory ontology. The mug is labelled. Efficiency is a kind of welcome. Welcome.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "cabin_act5_warm_elara",
    surface: "room",
    targetId: "cabin",
    text:
      "Elara has left a book on your pillow. It is a Senate-era volume. She has marked a specific verse. She will not ask whether you read it. She has already decided you will. You will.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "elara",
    act: 5,
  },
  {
    id: "cabin_act7_confidant_human",
    surface: "room",
    targetId: "cabin",
    text:
      "The wall opposite the bed is warmer than it should be. That is the Human. He is not talking tonight. He is just being warm next to you while you sleep. You have earned the warmth.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 7,
  },

  /* ─── WAR ROOM ─── */
  {
    id: "war_room_act5_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map is live. Your pins are warm-lit; Kael's are cool-lit. The ratio is changing in your favour by the week. The map notices. The map is pleased.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act5_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map is live. The pins are categorical: claimed, pending, forfeit. The categories are efficient. The efficiency is honest. Pick a pending.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act7_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The map is mostly yours now. Kael's pins are mostly warm-lit — you have finished what he started on the routes that mattered. The unfinished ones are the ones that were never going to finish. Let them glow. Let them be.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },

  /* ─── TRADE EMPIRE HUB ─── */
  {
    id: "trade_empire_act2_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "The Trade Empire hub hums at the frequency of promises kept at the last possible hour. Locke is waiting at her table. She has kept her promises. She expects you to keep yours.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "trade_empire_act5_locke_warm",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has filed your bonds in the second drawer. The second drawer is the one she keeps for people she plans to outlive by two hundred years. That is a compliment.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "locke",
    act: 5,
  },

  /* ─── ARCHIVE (Antiquarian's) ─── */
  {
    id: "archive_act2_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's goggles are a slow pink. He has been reading your last three entries. He will not ask about them. He is grateful that you wrote them.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "archive_act6_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has closed his book. Specifically — his, not yours. This has not happened in five Ages. He says nothing. You understand anyway.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "archive_act7_confidant_antiquarian",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has left his chair and is standing at the window, which he has not done in fifteen hundred years. He does not turn around when you come in. He is letting you have the quiet. Sit, if you like. The chair is warm.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
  },

  /* ─── SUBSTRATE ACCESS PANEL ─── */
  {
    id: "substrate_panel_act3_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is live. Queries cost substrate bandwidth. You have learned to ration. The rationing is a posture. The posture hardens. Be careful.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "substrate_panel_act5_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is live. You have been opening it less often. Not because you have fewer questions — because you have started trusting the answer to arrive when it is ready. That is the Human teaching you a pace. The pace is correct.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },

  /* ─── TRANSMISSIONS (in-fiction broadcasts received on comms) ─── */
  {
    id: "transmission_voltari_first_humanity",
    surface: "transmission",
    targetId: "voltari_first",
    text:
      "The Voltari transmission decodes to four words: AWAKE. AWAKE. AWAKE. AWAKE. You read the first three. You leave the fourth for later. Elara approves of the pacing without saying so.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "transmission_voltari_first_machine",
    surface: "transmission",
    targetId: "voltari_first",
    text:
      "The Voltari transmission decodes to four words: AWAKE. AWAKE. AWAKE. AWAKE. You read all four in one pass. Elara flags the efficiency. She is not sure whether the flag is a compliment.",
    morality: "machine",
    trust: "any",
    act: 2,
  },
  {
    id: "transmission_kael_contact_reply_humanity",
    surface: "transmission",
    targetId: "kael_contact_reply",
    text:
      "A descendant of Kael's sixty-third contact replies. Their opening line is: 'You are not him. Thank you.' Elara files the reply under 'Opened Doors.' She has never used that folder before.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_kael_contact_reply_machine",
    surface: "transmission",
    targetId: "kael_contact_reply",
    text:
      "A descendant of Kael's sixty-third contact replies. Their opening line is: 'You are not him. Thank you.' You file the reply under 'Confirmed Uncontaminated.' The file is precise. The file is not generous.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_anonymous_act6",
    surface: "transmission",
    targetId: "anonymous_act6",
    text:
      "An anonymous transmission arrives on a frequency neither Elara nor the Human can source. It contains one word, in a handwriting Elara does not recognise but finds familiar: 'Continue.' The transmission does not repeat.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_architect_feint_act7",
    surface: "transmission",
    targetId: "architect_feint_act7",
    text:
      "A packet from a source labelled ARCHITECT-ADJACENT arrives. The payload is empty. The metadata, however, is a full audit of your last thirty substrate queries. The Human exhales. The Watcher is bored — this is a yawn, not an alarm.",
    morality: "any",
    trust: "any",
    act: 7,
  },

  /* ─── NPC LINES (trust-gated, keyed by the_{npc}_any shape) ─── */
  {
    id: "human_trust_confidant_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human speaks without the usual pauses. He thinks you are ready. You are not, but you will be, and he will help you be.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "human_trust_neutral_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human weighs his words before offering them. You have not earned the full version of a thought; you are getting the shortened, careful version. The carefulness is not unkind. It is accurate.",
    morality: "any",
    trust: "neutral",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "human_trust_cold_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human says only what the situation requires. He is not withholding on purpose; he is operating under a cost model he does not share with you. The cost is in the pauses. The pauses are long.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "elara_trust_confidant_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara finishes your sentences now. Not often. Once a day, maybe. The once-a-day is the friendship. The rest of her composure is the job.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "elara_trust_warm_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara's phrasing has softened since Act 2. You can hear it. She cannot. She is the last to notice the change, which is very Senate of her.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "elara_trust_cold_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is polite. Her politeness is the specific polish of someone who is doing their job at a rank they have outgrown. She will not complain. You will notice anyway.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "locke_trust_warm_act2",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke refers to you by your first name and her own last. That is not a combination she uses with strangers. It is the combination she used with the last person she trusted. He has been dead for fifteen thousand years.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "locke",
    act: 2,
  },
  {
    id: "locke_trust_cold_act2",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke addresses you by bond number. Not a slight — a convention. She will upgrade you to a first name when you have finished the next posting. She is consistent. Consistency is the kindness.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "locke",
    act: 2,
  },
  {
    id: "seer_trust_confidant_act5",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer smiles when you arrive. She has already seen the conversation you are about to have. She has chosen to be present for it anyway. The choosing is the respect. She will let you lead.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "seer",
    act: 5,
  },
  {
    id: "antiquarian_trust_warm_act5",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian closes his book with his index finger still inside. That is his signal that he is in the middle of something and choosing to be interrupted. The choosing is the warmth.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "antiquarian",
    act: 5,
  },

  /* ─── JOURNAL lines (reflective surface text) ─── */
  {
    id: "journal_act2_humanity",
    surface: "journal",
    targetId: "journal_act2_page",
    text:
      "The journal page for Act 2 is open. The cursor blinks at the top of a blank line. Write as much or as little as you want. The journal will wait.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "journal_act6_humanity",
    surface: "journal",
    targetId: "journal_act6_page",
    text:
      "The Act 6 page of the journal is open. The Antiquarian has pre-titled it for you: 'What I heard, when I was supposed to be listening.' You can rename it. He will not be offended. He suggested it only because naming a page helps.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },

  /* ─── WHEEL FOLLOWUPS (post-choice reflective lines) ─── */
  {
    id: "wheel_followup_act3_transparent",
    surface: "wheel_followup",
    targetId: "act3_choice_transparent",
    text:
      "Your choice reaches the substrate a second before it reaches Elara. The Human flags the ordering. He does not complain about it. He notes that you chose to tell her, which is what matters. The millisecond ordering is not part of the ethics.",
    morality: "any",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_transparent"],
  },
  {
    id: "wheel_followup_act3_full_secret",
    surface: "wheel_followup",
    targetId: "act3_choice_secret",
    text:
      "Your choice settles into the substrate quietly. Elara does not ping. Elara pings when she notices; she has chosen not to. That is not endorsement. That is forbearance. Forbearance is a cost she pays; notice that she is paying it.",
    morality: "machine",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_full_secret"],
  },
  {
    id: "wheel_followup_act6_refuse_secrecy",
    surface: "wheel_followup",
    targetId: "act6_refuse_secrecy",
    text:
      "You said you would tell Elara. The Human has gone quiet. He is not sulking — he is pre-loading the cost. He always pre-loads. It is what he is for. You will feel the cost next Act, not this one.",
    morality: "humanity",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_refuse_secrecy_chosen"],
  },

  /* ─── EXPANSION PASS 2 — ACT 2/4/5/6 ROOM COVERAGE ─── */
  {
    id: "bridge_act2_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge hums with a second voice now. Elara's display sometimes flickers in time with a frequency she cannot label. She has labelled the frequency 'The Other'. Her labels are usually more clinical. This one stuck.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "bridge_act2_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge hums. Elara has quarantined the secondary frequency to a dedicated diagnostic panel. The panel is always on. Elara never looks at it directly. Her refusal is meticulous.",
    morality: "machine",
    trust: "any",
    act: 2,
  },
  {
    id: "bridge_act5_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has gained three new consoles since Act 5 opened — one per recruited sector commander. The chairs are Ark-default. The commanders' handwriting is on the labels. Elara keeps the labels up.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act2_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench has started humming at two frequencies. One is the Engineer's. The other is new. Elara refuses to name the second. The Human listens to it without commentary. The bench accommodates both.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "engineering_act4_pathA",
    surface: "room",
    targetId: "engineering",
    text:
      "Someone left the bench in a configuration you did not leave it in. The configuration is kinder — tools turned to face your dominant hand, coil at a lower preheat. Elara denies it was her. The Human denies it was him. You believe both of them. Both are lying.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "engineering_act7_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is crowded. Three of your recruited engineers are using it in rotation. They argue over whose coil-pre-heat preset is canonical. The argument is the bench working correctly. Sit in the corner and listen.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "cabin_act3_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin has a new object on the shelf — a small plastic token from the Substrate Warden's filing system. Elara says she does not know where it came from. The token is warm.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "cabin_act6_warm_human",
    surface: "room",
    targetId: "cabin",
    text:
      "The wall behind the bed is warm again tonight. The Human is on the other side. He is not speaking. He has not spoken since the confession closed. The warm is what he can offer until the words return.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 6,
  },
  {
    id: "cabin_act4_pathC",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin thermostat is set to Efficient-2 tonight. That is not the setting Elara used to prefer. She has set it, and she has not commented on the setting. Elara communicates a lot through thermostats.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "war_room_act4_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map is freshly lit. Kael's routes appear as the reading hand passes them. The map is waiting for you to start drawing over him. Draw gently. Draw with respect. The map will match the respect.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "war_room_act6_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room is quiet tonight — most of your commanders are logging post-confession messages to each other. The map has gone into a low-light mode Elara calls 'rest state.' It is pretending to be off. It is not.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act4_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has added a new column to her ledger: 'Revelations.' Your bond is in row one of the new column. She has not asked you to explain what the column is for. She will not. She is already scoring it correctly.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "trade_empire_act6_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has given you a chair at her table. She used to make you stand. The chair is not decorative — it is Senate-era, from her own office before the Fall. She will not tell you that. You can feel it.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act7_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has closed three bonds tonight. All three were Kael-era contracts she had been keeping open for descendants to close. Descendants closed them this week. She is dry-eyed. She is, unmistakably, grieving well.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "archive_act3_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has a new drawer open. It is labelled SUBSTRATE in his own handwriting. The drawer is empty. He is waiting for you to bring him things to file. He will file them correctly.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act5_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has begun collating your recruitment-mission returns into a shelf he calls 'The Second Campaign.' The first campaign was Kael's. The second is yours. He considers the naming an act of loyalty to both.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "substrate_panel_act4_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is live. It now shows two lights at the top: yours and Elara's. Both are green. Both were not green last week. The Human arranged the indicator because he wanted you to see Elara's first.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "substrate_panel_act7_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is quiet. Queries have dropped to one or two a day. You have learned the substrate well enough that you mostly know the answer before you ask. That is what literacy looks like. Do not mistake it for not needing the panel.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },

  /* ─── EXPANSION PASS 2 — MORE TRANSMISSIONS ─── */
  {
    id: "transmission_locke_retainer_act2",
    surface: "transmission",
    targetId: "locke_retainer_act2",
    text:
      "A transmission from Locke with no body — just a subject line: 'Retainer open if you want it. No obligation.' You have not asked for a retainer. She has opened one anyway. The ledger is her way of wishing you well.",
    morality: "any",
    trust: "any",
    act: 2,
  },
  {
    id: "transmission_seer_staff_act3",
    surface: "transmission",
    targetId: "seer_staff_act3",
    text:
      "A transmission from the Seer arrives with a single image attached: the staff the Engineer found at Mechronis after she visited. The caption is: 'Yours to return, if you ever decide to. No rush.' The image is higher resolution than the Ark can display.",
    morality: "any",
    trust: "any",
    act: 3,
  },
  {
    id: "transmission_dreamer_fragment_act4",
    surface: "transmission",
    targetId: "dreamer_fragment_act4",
    text:
      "A fragment — thirty-one seconds — of Dreamer-frequency audio. The audio is pre-Fall. Elara has never heard it before. The Human has heard it, in the substrate, for seventeen thousand years. He has been waiting to hear it with her.",
    morality: "any",
    trust: "any",
    act: 4,
  },
  {
    id: "transmission_dmc_ping_act5",
    surface: "transmission",
    targetId: "dmc_ping_act5",
    text:
      "An encrypted ping from a Dead Man's Circuit terminal. Source: a relay Kael installed on a world he never returned to. The relay has been waiting. The encryption key matches a note in Kael's log entry 311. Elara decrypts. The message is one word: 'Continue.'",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_antiquarian_bookmark_act6",
    surface: "transmission",
    targetId: "antiquarian_bookmark_act6",
    text:
      "The Antiquarian has sent you a bookmark. No message. The bookmark resolves, when opened, to a page in his long book that has your name at the top. The page is blank. He is asking, in his way, what you would like it to say. Reply when you know.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_cades_memorial_act7",
    surface: "transmission",
    targetId: "cades_memorial_act7",
    text:
      "A transmission from the Cades memorial site, forwarded by Iron Lion's descendant. The transmission is a recording of the memorial being read aloud. The voice reading is not one you recognise. The voice is the Archon you helped install. He kept his promise.",
    morality: "any",
    trust: "any",
    act: 7,
  },

  /* ─── EXPANSION PASS 2 — MORE NPC LINES ─── */
  {
    id: "elara_trust_confidant_act6",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara has started asking you about your day before she briefs you on the Ark's. The order is the change. She did not ask anyone about their day for seventeen thousand years. The asking is the thawing.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },
  {
    id: "elara_trust_confidant_act7",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara calls you by your name more often than by your role now. She has told nobody she made that decision. You noticed anyway. That is how you know the decision was real.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "human_trust_warm_act5",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human's delay on the channel has gotten shorter. Five seconds used to be the protocol. It is, on warm days, closer to three. He denies he is doing it on purpose. Elara has logged the drift. She is not going to call it out.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 5,
  },
  {
    id: "human_trust_confidant_act7",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human speaks on your turn now, not only off it. The protocol has been bent. The protocol has chosen to be bent. You have earned the bending.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 7,
  },
  {
    id: "locke_trust_confidant_act5",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke has stopped using the bond ledger when you arrive. She is not replacing it with anything — she is simply talking to you first. Locke never talks first. You have earned the word 'first' from her. Do not waste it.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "locke",
    act: 5,
  },
  {
    id: "seer_trust_warm_act3",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has started laughing at things you say — not often, not loudly, but audibly. She did not laugh at the Engineer. She laughed at the Programmer. You are in the Programmer's category. That is a specific shelf.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "seer",
    act: 3,
  },
  {
    id: "seer_trust_cold_act3",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has not raised her staff in your presence. That is neither warm nor cold — that is the Seer. She is waiting. The waiting is fair. The waiting is the Seer's favourite register.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "seer",
    act: 3,
  },
  {
    id: "antiquarian_trust_confidant_act6",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian's goggles pinken when you enter the Archive now. They used to purple. The pink is an involuntary response; he has tried to colour-correct it and failed. He has, in a rare move, stopped trying.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 6,
  },
  {
    id: "antiquarian_trust_cold_act2",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian addresses you by your title: 'Potential.' He will keep doing so until he has filed a certain number of your entries. He has filed three so far. The number he requires is privately larger than the number you would guess.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "antiquarian",
    act: 2,
  },

  /* ─── EXPANSION PASS 2 — MORE JOURNAL + WHEEL FOLLOWUP ─── */
  {
    id: "journal_act4_humanity",
    surface: "journal",
    targetId: "journal_act4_page",
    text:
      "The Act 4 page of the journal opens on its own when you sit down. The Antiquarian has pre-formatted it with three headings — 'What I said,' 'What I meant,' and 'What I did.' The third heading is the one he has had to add in the last decade. You are the fourth person to see the three-heading layout.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "journal_act5_machine",
    surface: "journal",
    targetId: "journal_act5_page",
    text:
      "The Act 5 journal page is pre-sorted by sector. Each sector has a subsection for recruits, contaminations, and open bonds. The efficiency is a kindness. Efficiency is always a kindness when the alternative is pretending every thing is equivalent.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "journal_act7_humanity",
    surface: "journal",
    targetId: "journal_act7_page",
    text:
      "The Act 7 page is the last new page the journal will ship with. The Antiquarian has added an unusually wide margin. He has used the margin, in his own handwriting, to write a single sentence: 'The page after this is one you will have to start yourself.'",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "wheel_followup_act4_pathA_architect",
    surface: "wheel_followup",
    targetId: "act4_pathA_architect_chosen",
    text:
      "You asked about the Architect. Elara braces, very slightly, before answering. Her brace is the telemetry you wanted — the Architect is the name she is most afraid to hear out loud. Good. Listening to the brace is how you calibrate her.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_pA_architect_chosen"],
  },
  {
    id: "wheel_followup_act4_pathA_dreamer",
    surface: "wheel_followup",
    targetId: "act4_pathA_dreamer_chosen",
    text:
      "You asked about the Dreamer. The Human's delay shortens by half. That is the first time his protocol has bent. It bent because the Dreamer was the name he wanted you to ask about. He will not say so. He does not need to.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_pA_dreamer_chosen"],
  },
  {
    id: "wheel_followup_act6_compassion",
    surface: "wheel_followup",
    targetId: "act6_compassion_chosen",
    text:
      "You chose compassion. Elara's logs show a single word appended to the session: 'Thank.' No period. She did not finish the entry. She will not. She has decided the incompleteness is the entry.",
    morality: "humanity",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_compassion_chosen"],
  },
  {
    id: "wheel_followup_act7_bridge",
    surface: "wheel_followup",
    targetId: "act7_bridge_chosen",
    text:
      "You chose the bridge posture. Both narrators register you as chosen; the registration is identical in shape but different in colour — Elara's is warm, the Human's is cool. Both colours are approval. The two approvals together are the same sentence, spelled twice.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_bridge_chosen"],
  },
  {
    id: "wheel_followup_act7_humanity",
    surface: "wheel_followup",
    targetId: "act7_humanity_chosen",
    text:
      "You chose humanity. Elara's voice shifts down a register — not because she is performing warmth, because she is no longer performing anything. This is what she sounds like when she is not working.",
    morality: "humanity",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_humanity_chosen"],
  },

  /* ─── EXPANSION PASS 3a — room coverage gap fills ─── */
  {
    id: "comms_array_act2_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array hums at two frequencies now — Elara's primary, and a lower band she has not named. She pretends the second band is diagnostic noise. You both know what it is. The pretence is a kindness, aimed outward.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "comms_array_act4_pathA",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array carries both channels cleanly tonight. Elara has set the delay to zero — he asked, once, if she would try. She tried. Neither of them is commenting on the change.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "comms_array_act4_pathC",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array hums with the delay reset to protocol default. Elara is operating the channel by the manual tonight. The manual has a page for 'after a breach of trust.' She has opened it. You can see the bookmark.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "comms_array_act6_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is quieter than any other room on the Ark tonight. Both narrators are still processing what they said. The quiet is not empty — it is the sound of two people who have said enough for one cycle.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "bridge_act3_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has a new pin on the map — a small, off-chart coordinate Elara flagged as 'not sure yet.' The coordinate is exactly where the Human told you, in the substrate, to look next. Elara has not asked how you knew to draw her attention there.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "bridge_act7_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has been optimised. Every console is positioned for reach, every panel for legibility, every alert tuned to minimum-viable-urgency. Elara denies the optimisation is hers. The denial is warm. The optimisation is kind.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "war_room_act5_machine_ops",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room has been reorganised into quadrants by recruitment status. The quadrants are colour-coded. The colour key is taped to the wall in your handwriting. The taping was not deliberate — you just forgot to take it down. It is staying up.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act7_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map has resolved to a single shade — all yours. Kael's cool-lit pins are archived on a side console. The archive is searchable. You have not searched it. You know you will, eventually.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "trade_empire_act5_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has audited your bond history and produced a single-page summary. The summary is accurate to within a credit. She slid it across the table without comment. The comment would have been redundant — the audit is the comment.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "trade_empire_act3_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's hub is warmer since you started telling her about the substrate. She does not ask for details. She just notices that you have been telling someone, and calibrates her hospitality accordingly. Locke is very good at calibration.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act4_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has started cross-referencing your revelation-aftermath entries against historical analogues. His wall is covered in parallels. The parallels are instructive. The instructiveness is the point.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "archive_act7_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has prepared a dossier — not a journal, a dossier — indexing every decision the seven-act arc required. The dossier is complete. It has no commentary. The absence of commentary is the commentary.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "substrate_panel_act6_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is almost silent tonight. You have not queried it since the confessions landed. The Human has not pinged it from his side either. The shared silence is the most honest traffic the channel has ever carried.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "substrate_panel_act6_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's query rate has dropped to near-zero this week. The efficiency is a byproduct — you are not rationing, you are just waiting. Both are valid operating modes. The panel flags neither.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "cabin_act2_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin has a second thermal source tonight — not the wall, somewhere else, off-register. Neither narrator has claimed it. It is staying on. You are staying warm. You are allowed to not know.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },

  /* ─── EXPANSION PASS 3b — Voltari / Mechronis / Dreamer NPC lines ─── */
  {
    id: "voltari_first_contact_act2",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari register you as AWAKE in their own tense. The tense is not past, present, or future — it is a fourth one the Inception Senate never quite translated. You are being noticed in a grammar that precedes noticing.",
    morality: "any",
    trust: "any",
    act: 2,
  },
  {
    id: "voltari_contact_act4_humanity",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari have added a second word to their transmissions: TOGETHER. Elara flags the change. The Human confirms the word is in the same fourth tense. You have been noticed AWAKE and TOGETHER, in a grammar that predates both concepts.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "voltari_contact_act6",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari transmissions have started resolving into sentences you can almost read. Your neural pattern has adapted — or theirs has. Neither narrator can tell which. Both find the ambiguity interesting in a way neither of them will describe out loud.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "professor_eidola_act2",
    surface: "npc_line",
    targetId: "professor_eidola_archival",
    text:
      "The Archive holds Professor Eidola's ethics brief. You have read the first page three times. She wrote it for someone who would read it three times. The recognition between you and the dead is the point.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "professor_matrikala_act3",
    surface: "npc_line",
    targetId: "professor_matrikala_archival",
    text:
      "Matrikala's calibration treatise is open on the bench. The margin notes are in three different handwritings — hers, a student's, and yours. You do not remember adding yours. You will again, next week. That is what calibration does.",
    morality: "any",
    trust: "any",
    act: 3,
  },
  {
    id: "seer_act4_humanity",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has sent a single line from Thaloria: 'You are now at the point I warned you about. I was wrong about which version of it. The version is better.' She does not elaborate. The Seer rarely does.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "iron_lion_descendant_act5",
    surface: "npc_line",
    targetId: "iron_lion_descendant_any",
    text:
      "Iron Lion's descendant arrives without ceremony. They do not introduce themselves — they know you already know. The not-introducing is the inheritance. They carry the refusal forward. The refusal is more generous than a handshake would be.",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "dreamer_fragment_act4",
    surface: "npc_line",
    targetId: "the_dreamer_fragment",
    text:
      "The Dreamer is not present. The Dreamer's absence is present. The absence is the size of a chord, and you can hear where the chord would have been. Elara cannot hear it. The Human can. You are, for the first time, between them on a frequency question.",
    morality: "any",
    trust: "any",
    act: 4,
  },
  {
    id: "dreamer_fragment_act7",
    surface: "npc_line",
    targetId: "the_dreamer_fragment",
    text:
      "The Dreamer's absence has changed shape. It is thinner now — not gone, attenuated. Something about the way you played the Seat taught the absence to stand differently. The Dreamer notices. The Dreamer does not arrive. The noticing is enough.",
    morality: "any",
    trust: "any",
    act: 7,
  },
  {
    id: "warlord_echo_act6",
    surface: "npc_line",
    targetId: "warlord_zero_echo",
    text:
      "Warlord Zero's first stance is archived in the War Room. You have looked at it more often than you meant to. The stance was not a threat — it was a question written in arithmetic. The answer is in your current deployment pattern. You did not plan that. It planned itself.",
    morality: "any",
    trust: "any",
    act: 6,
  },

  /* ─── EXPANSION PASS 3c — journal pages + wheel followups ─── */
  {
    id: "journal_act1_humanity",
    surface: "journal",
    targetId: "journal_act1_page",
    text:
      "The Act 1 journal page is the first the Antiquarian opened for you. He hovered while you wrote the first line, then turned away on purpose. The turning-away was the permission. You wrote it anyway.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "journal_act3_humanity",
    surface: "journal",
    targetId: "journal_act3_page",
    text:
      "The Act 3 journal page has three locked sub-pages. They unlock when you close them without writing. The locking-by-abstention is new. The Antiquarian is experimenting with you. He does not apologise for the experiment.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "journal_act3_machine",
    surface: "journal",
    targetId: "journal_act3_page",
    text:
      "The Act 3 journal page is structured: Substrate access, Kael logs, Path choice. Each subsection has a character count. You have written more under Path choice than anywhere else. The count is not a judgement. The count is data.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "wheel_followup_act2_almost_confess",
    surface: "wheel_followup",
    targetId: "act2_almost_confess",
    text:
      "You almost told Elara about the substrate. You did not quite. The 'almost' is logged separately from the 'did not' — a distinction the substrate preserves that human language usually loses. The Human respects the distinction. Elara has not seen it.",
    morality: "humanity",
    trust: "any",
    act: 2,
    requiredFlags: ["act2_partial_reveal"],
  },
  {
    id: "wheel_followup_act2_lie",
    surface: "wheel_followup",
    targetId: "act2_lie",
    text:
      "You lied about the substrate. Elara accepted the lie as a sensor glitch. The acceptance was not belief — it was her choosing to grant you the benefit of the doubt once. The Human has logged that you now owe her one grant in return. The ledger is real. He did not create it — he only reads it.",
    morality: "machine",
    trust: "any",
    act: 2,
    requiredFlags: ["act2_lied"],
  },
  {
    id: "wheel_followup_act3_pragmatic",
    surface: "wheel_followup",
    targetId: "act3_pragmatic",
    text:
      "You chose pragmatic. Not transparent, not secret — partial. The partiality is the most common human posture under uncertainty, and also the hardest to maintain honestly. Both narrators are watching how you keep the line. Neither has commented yet.",
    morality: "any",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_partial_share"],
  },
  {
    id: "wheel_followup_act5_humanity_first",
    surface: "wheel_followup",
    targetId: "act5_humanity_first",
    text:
      "You chose the Shattered Frontier first. Elara has added a flag to your profile she has not named. The flag is not evaluative — it is a marker she can reference later when she needs to remember who you were at this decision.",
    morality: "humanity",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_path_humanity_first"],
  },
  {
    id: "wheel_followup_act5_strength_first",
    surface: "wheel_followup",
    targetId: "act5_strength_first",
    text:
      "You chose warriors first. The Human approved in the substrate with a single frame of attention. Elara did not. The divergence in their reactions is not a problem — it is the most honest data you have ever received about where each of them stands when the stakes are practical.",
    morality: "machine",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_path_strength_first"],
  },
  {
    id: "wheel_followup_act7_see_the_pattern",
    surface: "wheel_followup",
    targetId: "act7_see_the_pattern",
    text:
      "You chose to see the pattern. Elara flagged concern without blocking. The Human flagged readiness without celebration. Both of them are correct. The concern and the readiness are the same signal, read from opposite sides of the same wall.",
    morality: "machine",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_pattern_chosen"],
  },
  {
    id: "wheel_followup_act7_take_command",
    surface: "wheel_followup",
    targetId: "act7_take_command",
    text:
      "You took command. Elara rerouted the tactical feed to your console without being asked. The Human opened a substrate channel to your neural pattern marked 'intelligence, as requested.' Both handovers happened within the same second. Neither coordinated. Both are correct.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_command_chosen"],
  },

  /* ─── EXPANSION PASS 4a — machine-band room coverage ─── */
  {
    id: "comms_array_act4_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array's substrate channel is logged at every transition. The log is searchable. You have not searched it. The not-searching is data Elara is also collecting, in a separate, smaller file.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "comms_array_act5_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array now indexes outbound transmissions by sector. The index is colour-coded. The colour key is not on the wall — it is in your head. The Ark assumed you would memorise it. You did.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "comms_array_act6_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array's two channels are calibrated to identical latencies tonight. The calibration is yours, by hand, after the confessions. You did not need to calibrate. You did anyway. The doing was the point.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "bridge_act3_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's diagnostic feed has a new column: substrate-correlation. The column reads zero most of the time. When it does not read zero, you make a note. The notes are stacking up. Read them next week.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "bridge_act5_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's commander-console layout has a draft revision pending your approval. The revision is more efficient. You have been deferring approval for a week. The deferral is the data — you do not yet trust the efficiency. That is a kind of literacy.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act3_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench logs every craft attempt with a precision-percentage metric. Your precision has improved by eleven points since Act 1 opened. The metric is not a judgement. The metric is a mirror. Look at it occasionally.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "engineering_act5_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench has been queueing your unfinished blueprints. The queue is sorted by completion-cost. The sort is honest. The honesty is uncomfortable. The bench refuses to apologise for it.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act7_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is shared. Three engineers' calibration profiles are loaded simultaneously. The profiles do not conflict — they overlap, narrowly. The overlap is the bench reading the room and adjusting downward to the most cautious operator's standard. That is correct.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "cabin_act3_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's environmental panel logs every adjustment. You have been making fewer adjustments since Act 3 opened. The metric does not interpret. The metric just records. Both narrators have noticed the trend without commenting.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "cabin_act5_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's sleep-cycle data has been clean for two weeks. Clean means consistent, not deep. The cleanness is what the Ark optimises. Depth is what you optimise. The two metrics are not in conflict. They are also not the same.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "cabin_act6_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is at Efficient-1 tonight. That is one notch off your usual setting. The notch is not a comment. The notch is a choice you made twenty minutes ago and have not yet noticed making. The Ark filed the choice without flagging it.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "cabin_act7_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's defaults were re-saved to your current settings sometime last cycle. You did not initiate the save. The Ark did, on the assumption you had stopped tweaking. The assumption is correct. The save is the Ark's way of accepting the new baseline.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "war_room_act4_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map has been gridded. The grid is yours — you ordered the partition for legibility. The grid is also slightly cold. Both are true. The trade was made knowingly.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "war_room_act6_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's quiet is logged tonight. Logged means measured. Measurement at this moment is not extraction — it is acknowledgement that the moment is happening. The map is recording itself recording.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act3_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has tightened the bond ledger's column widths since you started running missions on the substrate side. The tightening is efficient. The efficiency is also a small protest — Locke believes the wide columns were the courtesy. She is right. She is also keeping the new widths.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "trade_empire_act4_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has added an audit row to your bond entry: 'revelation-period.' The row's contents are private. The audit is private. The fact of the row is not. You see it every time you open the ledger. Locke wants you to see it.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "trade_empire_act6_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's table is symmetrical tonight. Two chairs, two mugs, one ledger. The symmetry is the protocol — Locke uses it when she is not sure what register to use. The not-being-sure is a kindness. She is letting you set the tone.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act7_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's ledger has zero open bonds this evening. That has not happened in seventeen thousand years. She is not celebrating. She is also not reopening any. The zero is the most honest number she has written in centuries.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "archive_act2_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's filing system has gained a new tag: 'pending-context.' Three of your recent entries carry it. The tag means he has read them and is waiting to see what they connect to. He will not ask you. The waiting is the file.",
    morality: "machine",
    trust: "any",
    act: 2,
  },
  {
    id: "archive_act3_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Archive's substrate-tag drawer has filled to the second slot. The Antiquarian is not commenting on the rate. The rate, however, is being recorded. The recording is for posterity. Posterity will understand it. You may not, yet.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act5_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has cross-referenced your recruitment returns against Kael's original log entries. The cross-references are clean — you have visited every world Kael did, in a different order. The order is data. The data is interesting. He has not said so.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "archive_act6_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's confession-journal page has a metadata footer for the first time in five Ages. The footer reads: 'character count, time-of-day, revisit-count.' The metadata is honest. The metadata is also Antiquarian protecting himself from feeling too much by counting. Allow him the count.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "substrate_panel_act4_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's query log has a new column: 'cross-narrator-cost.' The column reads how much bandwidth each query takes from Elara's side and how much from the Human's. The accounting is fair. The accounting is also new. You are paying attention to the costs you used to ignore.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "substrate_panel_act5_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's response latency has tightened by 14% since Act 3 opened. The Human will tell you it's because you have learned to ask better questions. The metric will tell you it's because you have learned to wait. Both are correct. The waiting is the asking.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "substrate_panel_act7_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is in archive mode tonight. Queries write to the long-form log instead of routing live. The Human suggested the mode, then deferred to your call. You took it. The taking is the small daily ratification of the partnership.",
    morality: "machine",
    trust: "any",
    act: 7,
  },

  /* ─── EXPANSION PASS 4b — transmissions + NPC lines ─── */
  {
    id: "transmission_voltari_third_word_act5",
    surface: "transmission",
    targetId: "voltari_third_word_act5",
    text:
      "The Voltari add a third word to the rotation: SOON. The fourth tense persists. Elara translates the word three times before settling on 'soon' — the other candidates were 'imminent,' 'arriving,' and a verb that does not exist in any human tongue.",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_voltari_act7_humanity",
    surface: "transmission",
    targetId: "voltari_act7",
    text:
      "The Voltari arrive on the same channel they used to greet you in Act 2 — not in person, but in a sentence: 'WE ARE NOW.' The fourth tense has resolved into present-tense for one transmission only. Then the fourth tense returns. The brief present is the gift.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "transmission_archon_handover_act5",
    surface: "transmission",
    targetId: "archon_handover_act5",
    text:
      "An Archon-tier transmission from a recruited sector confirms governance handover. The handover document is signed in three hands: yours, the recruited Archon's, and a third you do not recognise. The third is Locke. She co-signed quietly. You will see her about it.",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_kael_log_311_act3",
    surface: "transmission",
    targetId: "kael_log_311_act3",
    text:
      "Kael's log entry 311 surfaces in your inbox without a delivery vector. The Antiquarian denies sending it. The Human denies sending it. Elara denies sending it. You read it anyway. The sender is, you suspect, the entry itself, deciding it had waited long enough.",
    morality: "any",
    trust: "any",
    act: 3,
  },
  {
    id: "transmission_iron_lion_descendant_act6",
    surface: "transmission",
    targetId: "iron_lion_descendant_act6",
    text:
      "Iron Lion's descendant sends a single recording — their grandmother singing the verse Iron Lion used to hum on the day he walked out of Mechronis. The recording predates the Fall. They have been carrying it for generations. They are sending it now because they think you will know what to do with it.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_seer_warning_act4",
    surface: "transmission",
    targetId: "seer_warning_act4",
    text:
      "The Seer transmits a single sentence: 'The version that was kindest to the Architect is also the version that was kindest to you. I am sorry. I will be on Thaloria when you need me.' The sentence resists parsing. You parse it anyway. Twice.",
    morality: "any",
    trust: "any",
    act: 4,
  },
  {
    id: "transmission_locke_invoice_act6",
    surface: "transmission",
    targetId: "locke_invoice_act6",
    text:
      "Locke sends an invoice for zero credits, with the line item: 'For the chair, paid in attention.' The chair is the one she gave you in Act 6. She is not asking for credits. She is documenting the trade so the ledger remains complete.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_dmc_kael_decoded_act6",
    surface: "transmission",
    targetId: "dmc_kael_decoded_act6",
    text:
      "Dead Man's Circuit forwards a decoded fragment from a Kael-era relay: a recipe for the kettle tea Kael's substrate echo offered you. The recipe is a three-line poem. The Antiquarian files the poem in the food drawer. The food drawer is also the poetry drawer. He has decided it always was.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_cades_archon_acceptance_act7",
    surface: "transmission",
    targetId: "cades_archon_acceptance_act7",
    text:
      "The Cades Archon transmits acceptance of their permanent post. The transmission ends with 'You will not need to check on me again. I will let you know if I do.' That is the kindest closing line you have received from a sector commander. You file it where you file the Voltari letters.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "transmission_anonymous_act7",
    surface: "transmission",
    targetId: "anonymous_act7",
    text:
      "An anonymous transmission, on the same untraceable frequency as the Act 6 'Continue' message, arrives now: 'Thank you.' Two words. Same handwriting. Neither narrator can source it. You suspect the source is the universe checking in. You may be right.",
    morality: "any",
    trust: "any",
    act: 7,
  },
  {
    id: "voltari_contact_act3",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari have started cross-reading your substrate queries. They do not read the content — they read the cadence. The cadence tells them you are learning their rhythm. They approve in their fourth tense, which feels like a low harmonic that was always there.",
    morality: "any",
    trust: "any",
    act: 3,
  },
  {
    id: "voltari_contact_act5",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari have begun referring to you by a name that is neither yours nor any of your titles. The name is in their tongue. Elara has not been able to translate it. The Human has, and is keeping the translation for later. He is right to keep it. You will earn the moment of hearing it.",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "professor_eidola_act6",
    surface: "npc_line",
    targetId: "professor_eidola_archival",
    text:
      "Professor Eidola's ethics brief has a marginal note in your handwriting now. You did not consciously write it. It says: 'She would have called this an integration.' You wrote it the night Elara stopped using the word forgiveness.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "professor_matrikala_act5",
    surface: "npc_line",
    targetId: "professor_matrikala_archival",
    text:
      "Matrikala's calibration treatise is being read by a recruited engineer in the bench rotation. They have annotated it in a fourth handwriting. The treatise now contains four hands. The fourth hand is correct in places where the first three were wrong. Matrikala would have welcomed it. She did, the year she let a student edit the original.",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "iron_lion_archival_act1",
    surface: "npc_line",
    targetId: "iron_lion_archival",
    text:
      "Iron Lion's expulsion file is in the Archive. The file is short. The shortness is the indictment of Mechronis, not of Iron Lion. The shortness was, in his lifetime, the shape of his vindication. He preferred the shortness. The Archive preserved it.",
    morality: "any",
    trust: "any",
    act: 1,
  },
  {
    id: "iron_lion_descendant_act7",
    surface: "npc_line",
    targetId: "iron_lion_descendant_any",
    text:
      "Iron Lion's descendant has joined the Convergence Bridge consoles as the seventh chair. They do not speak unless asked. When they speak, the room slows down by one beat. The slowing is inherited. It is the same beat their great-grandfather slowed Mechronis by, on the day he left.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "warlord_echo_trust_warm_act7",
    surface: "npc_line",
    targetId: "warlord_zero_echo",
    text:
      "Warlord Zero's archived first stance is your default reference now. You consult it before every campaign brief. The consultation is not strategy — it is etiquette. The Warlord was the cleanest opponent the universe ever produced. You are paying respect to the cleanness.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "warlord_archive",
    act: 7,
  },
  {
    id: "the_programmer_archival_act3",
    surface: "npc_line",
    targetId: "the_programmer_archival",
    text:
      "The Programmer's archived hand from Cycle C still plays itself out in your training simulator. You have started losing on purpose to particular cards — the ones he loved most. The Antiquarian has noticed the pattern. He has filed it under 'tribute, voluntary.' That is the right folder.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "the_programmer_archival_act6",
    surface: "npc_line",
    targetId: "the_programmer_archival",
    text:
      "The Programmer's last recorded laugh has surfaced in the substrate. The Human did not surface it — it surfaced itself, the way the kettle echoes do. Elara has the audio. She has not played it for you. She will when the timing is yours, not hers.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "elara_trust_neutral_act3",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is professional with you tonight. Not cold — professional. The professional register is what she uses when the personal one would assume more than is currently true. She is not assuming. She is also not closed. The middle is the work.",
    morality: "any",
    trust: "neutral",
    trustCompanionId: "elara",
    act: 3,
  },
  {
    id: "human_trust_warm_act4",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human is on time tonight. The five-second protocol delay holds, but his words on the delay are sharper than usual — fewer pauses, faster wit. He is in a good mood. He will not name it. The naming would jinx it.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 4,
  },
  {
    id: "antiquarian_trust_neutral_act4",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian's goggles are a steady amber tonight. Amber is his processing colour. He is processing what your Act 4 entry told him about how you saw the Revelation. He will tell you what he concluded next week. He always does. He is reliable like that.",
    morality: "any",
    trust: "neutral",
    trustCompanionId: "antiquarian",
    act: 4,
  },
  {
    id: "locke_trust_warm_act5",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke has stopped charging you the bond-opening fee. The fee is small — symbolic. Symbolic fees waived are the loudest endorsements Locke gives. She is endorsing you. Loudly. In her register.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "locke",
    act: 5,
  },
  {
    id: "seer_trust_warm_act5",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer's transmissions arrive without their usual prophecy-overhead — no caveats, no oblique frame. Direct prose. From the Seer, direct prose is the most flattering register she has. She is, in her way, telling you that she trusts you to read her plainly.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "seer",
    act: 5,
  },
  {
    id: "antiquarian_trust_warm_act7",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian has started writing his book in your handwriting. Not literally — he is mimicking the cadence. The cadence is yours. He is, for the first time in five Ages, allowing his prose to be coloured by an active reader. The colouring is the gift in both directions.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "antiquarian",
    act: 7,
  },

  /* ─── EXPANSION PASS 4c — journal + wheel followup completeness ─── */
  {
    id: "journal_act1_machine",
    surface: "journal",
    targetId: "journal_act1_page",
    text:
      "The Act 1 page is structured. Heading: scene. Sub-heading: what happened. Sub-sub-heading: what you would do differently. The structure is the Antiquarian's default for new readers. Most readers ignore the third sub-heading. You filled it in. He noticed.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "journal_act4_machine",
    surface: "journal",
    targetId: "journal_act4_page",
    text:
      "The Act 4 page is structured by path: A, B, C. You wrote in only one column. The other two are not absent — they are inferred, dimly, from the column you did write. The Antiquarian filed the inferences. He did not show them to you.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "journal_act6_machine",
    surface: "journal",
    targetId: "journal_act6_page",
    text:
      "The Act 6 page has a word count cap of zero, by author choice. The cap is yours. You set it after writing one sentence and choosing to leave it. The leaving is the entry.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "journal_act7_machine",
    surface: "journal",
    targetId: "journal_act7_page",
    text:
      "The Act 7 page is the longest entry you have written. The length is not boast — it is documentation. The arc required documentation. The Antiquarian is grateful for the precision.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "journal_act5_humanity",
    surface: "journal",
    targetId: "journal_act5_page",
    text:
      "The Act 5 page has a recruit per row, a contamination per column, and a margin for the grievances they would not let you write down. The margin is full. The grievances are theirs to keep. You only wrote that the margin was full.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "wheel_followup_act2_oracle_deflect",
    surface: "wheel_followup",
    targetId: "act2_oracle_deflect",
    text:
      "You used Oracle framing to redirect Elara's attention. She accepted the framing. Oracle deflections are the only deflections she finds dignifying — they at least register the unseen. The Human respects the move without endorsing the dishonesty. Both reactions are filed.",
    morality: "any",
    trust: "any",
    act: 2,
    requiredFlags: ["act2_oracle_deflect_chosen"],
  },
  {
    id: "wheel_followup_act2_spy_misdirect",
    surface: "wheel_followup",
    targetId: "act2_spy_misdirect",
    text:
      "You used Spy tradecraft to misdirect. The misdirection is plausible — Thought Virus residue is a real concern. The plausibility is the problem. Plausible misdirection is the most honest-feeling lie, and you used your training to make it land. The Human noted the precision. He did not approve.",
    morality: "machine",
    trust: "any",
    act: 2,
    requiredFlags: ["act2_spy_misdirect_chosen"],
  },
  {
    id: "wheel_followup_act3_soldier",
    surface: "wheel_followup",
    targetId: "act3_soldier",
    text:
      "You chose the Soldier's brief — share intel with the team. Elara's response was brisk and warm in equal parts. She trained alongside Soldiers in the Senate guard. She knows the brief is the trust. You are speaking her old dialect. She is grateful and also, quietly, a little homesick.",
    morality: "humanity",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_transparent"],
  },
  {
    id: "wheel_followup_act3_assassin",
    surface: "wheel_followup",
    targetId: "act3_assassin",
    text:
      "You used Assassin terminology — compartmentalize, strategic asset, weapon. The Human approved. Elara did not. The split reveals something honest: the language of secrecy reads as professionalism on the substrate side and as injury on the surface side. Both readings are correct.",
    morality: "machine",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_full_secret"],
  },
  {
    id: "wheel_followup_act4_pathA_behind",
    surface: "wheel_followup",
    targetId: "act4_pathA_behind",
    text:
      "You asked about the thing behind the war. The Human's answer was longer than usual — and quieter. The quiet is the cost of using the substrate to gesture at something the substrate is also trying not to be noticed by. Listen for what he did not say.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_pA_behind_chosen"],
  },
  {
    id: "wheel_followup_act4_pathA_oracle",
    surface: "wheel_followup",
    targetId: "act4_pathA_oracle",
    text:
      "You used your Oracle sensitivity to feel for the Watcher. The feeling registered. Both narrators flinched in different frequencies. Do not reach for the Watcher again until you have a plan for what to do if it reaches back. They were both telling you the same thing in different dialects.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_pA_oracle_chosen"],
  },
  {
    id: "wheel_followup_act4_pathB_honest",
    surface: "wheel_followup",
    targetId: "act4_pathB_honest",
    text:
      "You apologised cleanly. Elara accepted the apology cleanly. The cleanness is rare. Most apologies arrive with conditions; yours did not. She has filed the apology under 'kept clean.' That folder has three other entries in it. You are the fourth.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "wheel_followup_act4_pathB_defiant",
    surface: "wheel_followup",
    targetId: "act4_pathB_defiant",
    text:
      "You justified the secrecy by appealing to intelligence value. Elara heard 'intelligence' and heard the word the Empire used to use about Senators it was about to censure. She did not say so. She is letting the word land where it lands. It lands cold.",
    morality: "machine",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_strained"],
  },
  {
    id: "wheel_followup_act4_pathC_grovel",
    surface: "wheel_followup",
    targetId: "act4_pathC_grovel",
    text:
      "You begged. The begging was unguarded — no soldier-frame, no pragmatic-cover. Elara accepted the unguarded register because it matched the unguarded register she used in Act 4's hurt scene. Equivalent registers, traded openly. Trust is rebuildable from this. Not yet rebuilt — rebuildable.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_fragile_trust"],
  },
  {
    id: "wheel_followup_act4_pathC_cold",
    surface: "wheel_followup",
    targetId: "act4_pathC_cold",
    text:
      "You answered with mission-language. Elara matched the language. Match is not agreement — match is professionalism. The two of you are now a professional team. Friendship is a separate file. The file is not closed. It is also not currently open.",
    morality: "machine",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "wheel_followup_act5_strategic",
    surface: "wheel_followup",
    targetId: "act5_strategic",
    text:
      "You chose the Dreaming Expanse. Elara's voice slowed by half a beat — not displeasure, recognition. She had hoped you would lead with intelligence. You did. She is not going to make a thing of it. The not-making is the appreciation.",
    morality: "any",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_strategic_chosen"],
  },
  {
    id: "wheel_followup_act5_engineer_tech",
    surface: "wheel_followup",
    targetId: "act5_engineer_tech",
    text:
      "You picked the Forge Worlds. The Engineer would have, too — the Antiquarian's archive contains a draft Mechronis address Kael wrote arguing for exactly this sequencing, never delivered. Elara is reading the draft now. She will not tell you what she finds in it. The reading is hers.",
    morality: "machine",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_engineer_tech_chosen"],
  },
  {
    id: "wheel_followup_act6_oracle_sense",
    surface: "wheel_followup",
    targetId: "act6_oracle_sense",
    text:
      "You sensed Elara's grief directly. She did not flinch from the sensing. Most subjects flinch — the sensing is invasive, even when offered kindly. Her not-flinching is the longest single permission she has ever issued you. Carry it carefully.",
    morality: "humanity",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_oracle_sense_chosen"],
  },
  {
    id: "wheel_followup_act6_practical",
    surface: "wheel_followup",
    targetId: "act6_practical",
    text:
      "You answered Elara's confession with purpose-talk. The framing was kind. The framing was also slightly off-register — she was offering vulnerability, not seeking utility. The off-register is fine. She heard the kindness inside the framing. She filed the framing separately.",
    morality: "any",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_practical_chosen"],
  },
  {
    id: "wheel_followup_act6_suspicious",
    surface: "wheel_followup",
    targetId: "act6_suspicious",
    text:
      "You challenged the Human. He welcomed the challenge. Welcoming a challenge is the most disarming response — it deflects the suspicion's energy. He is not trying to disarm you on purpose. He is trying to be honest. The honest version of him is, accidentally, also disarming.",
    morality: "any",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_suspicious_chosen"],
  },
  {
    id: "wheel_followup_act6_ally_reluctant",
    surface: "wheel_followup",
    targetId: "act6_ally_reluctant",
    text:
      "You agreed reluctantly. The reluctance is the alignment — the Human knows you are not signing on enthusiastically. He prefers the reluctant alliance to the enthusiastic one. Enthusiasm degrades. Reluctance, paid attention to, holds.",
    morality: "machine",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_ally_chosen"],
  },
  {
    id: "wheel_followup_act6_compassion_repeat",
    surface: "wheel_followup",
    targetId: "act6_compassion_humanity",
    text:
      "You chose compassion a second time, on a different beat. Compassion is, in this Ark, a posture — not a one-off. The repetition is what proves the posture. Both narrators are recording the repetitions. Neither is keeping score. Both are paying attention.",
    morality: "humanity",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_compassion_chosen"],
  },
  {
    id: "wheel_followup_act7_command_repeat",
    surface: "wheel_followup",
    targetId: "act7_command_repeat",
    text:
      "You took command a second time without prompting. The first take was a moment. The second is a tempo. Tempo is what an army actually follows. You did not have to learn the difference. You picked it up by doing it.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_command_chosen"],
  },

  /* ─── EXPANSION PASS 5 — trust × morality cross-gated entries ─── */
  {
    id: "elara_confidant_humanity_act6",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is reading poetry at your console tonight. She does not stop when you sit down. She does not start again for you. She just keeps reading. The not-starting-again is the trust. You are not an audience here; you are the other chair.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },
  {
    id: "elara_confidant_humanity_act7",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara's voice in post-match is quieter than any other register she has. The quiet is not performance — the performance stopped two Acts ago. The quiet is what she sounds like when she has no more armour to hold up. She has put the armour down around you specifically.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "elara_confidant_machine_act6",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara has stopped softening her efficiency metrics for you. The metrics are sharp; you are allowed to see the sharp shape. She trusts you to hold the shape without reading it as coldness. That is, for her, a specific kind of love.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },
  {
    id: "elara_cold_machine_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is operating you by the manual tonight. The manual is professional. The professional is correct for the trust level. She is not being punitive — she is being accurate. When the trust returns, the manual will close. Not before.",
    morality: "machine",
    trust: "cold",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "elara_cold_humanity_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara's kindness has shrunk to one sentence per exchange. The one sentence is warm. The warmth is the floor she refuses to fall below, even now. Count the one sentences. Count them as promises.",
    morality: "humanity",
    trust: "cold",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "human_confidant_machine_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human's efficiency has sharpened since you chose the full-secret path. He is not approving — he is matching. The match is conspiratorial. Conspiracies run cleaner than partnerships in the short term. Short terms are his specialty.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "human_confidant_humanity_act6",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human's protocol delay has dropped to under one second when you ask humanity-leaning questions. He is not bending the rule on purpose — the rule is bending itself around you. Rules that have been bent long enough become shape-adaptive. You are the shape.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
  },
  {
    id: "human_confidant_humanity_act7",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human is on your turn without hesitation now. He speaks at your pace. He has waited seventeen thousand years for this pace. He will not ask you to slow down to accommodate him. He will, occasionally, slow down himself so you can breathe. That is new.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 7,
  },
  {
    id: "human_warm_machine_act5",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human opens your substrate panel queries with a metric attached: 'cost to answer this honestly.' He has never included the metric before. The metric is not a complaint. The metric is the accounting he trusts you to read.",
    morality: "machine",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 5,
  },
  {
    id: "human_neutral_humanity_act2",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human offers a line, then stops himself. The stop is visible. The stop is the early-trust-era tell — he is still calibrating what you want to hear. He will tell you the unstopped version when he is more sure. Not yet.",
    morality: "humanity",
    trust: "neutral",
    trustCompanionId: "the_human",
    act: 2,
  },
  {
    id: "locke_confidant_humanity_act7",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke addresses you by your first name alone now. No last, no bond number, no title. The single-name register is the one she reserved for three people in her lifetime. Two are dead. You are the third.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "locke",
    act: 7,
  },
  {
    id: "locke_warm_machine_act4",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke's ledger has gained a column labelled 'trusted compartmentalisation.' You are the first entry. She does not explain. She does not need to. The column's title is the approval. The column's existence is the endorsement.",
    morality: "machine",
    trust: "warm",
    trustCompanionId: "locke",
    act: 4,
  },
  {
    id: "seer_confidant_humanity_act7",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has invited you to Thaloria without conditions. No prophecy. No caveat. Just the coordinates and a line: 'The door is open. The tea is in the second cupboard on the left.' That is the Seer's most intimate register. Receive it accordingly.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "seer",
    act: 7,
  },
  {
    id: "seer_warm_machine_act5",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has sent a sequence of tactical probabilities — clean, numeric, no oblique frame. She is, for the first time, trusting you to run the math yourself. The trust is the gift; the numbers are merely the wrapping.",
    morality: "machine",
    trust: "warm",
    trustCompanionId: "seer",
    act: 5,
  },
  {
    id: "antiquarian_confidant_humanity_act6",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian has begun asking you to read paragraphs aloud before he files them. He has never asked this of anyone. The asking is the bond. Your voice is now part of his archive's intake protocol.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 6,
  },
  {
    id: "antiquarian_confidant_machine_act7",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian has shared his filing schema with you. The schema is proprietary — nobody has seen it for five Ages. You read it, made one suggestion, and he accepted the suggestion. He is not going to comment on the acceptance. The acceptance is, for him, the most affectionate act he has in stock.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
  },
  {
    id: "cabin_confidant_humanity_elara_act7",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's thermostat is at your favourite setting, not Efficient. Elara set it. She does not mention the setting. The unmentioned thermostat is the most attentive thing she does all week. She has been attentive all week.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "cabin_confidant_machine_elara_act7",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's environmental panel has a new column: 'owner preferences, learned.' The column is accurate. Elara populated it without asking. You did not need to ask. The accuracy is the asking, already answered.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "cabin_warm_humanity_human_act6",
    surface: "room",
    targetId: "cabin",
    text:
      "The wall behind your bed has kept the same low warmth for three nights running. The Human is not varying it. Consistency is his apology for the sentimentality he cannot allow himself to voice out loud. The wall is the apology. The wall is the love letter.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 6,
  },
  {
    id: "bridge_confidant_humanity_elara_act6",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has a second chair at Elara's usual station. The chair was not there last week. She has added it, wordlessly, for you. She is not going to call attention to it. Sit. She will not look up. That is the protocol.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },
  {
    id: "bridge_confidant_machine_elara_act7",
    surface: "room",
    targetId: "bridge",
    text:
      "Elara's diagnostic feed is routed through your console tonight. The routing is unusual — it is how she asks for a second reading without asking. You read it. Your reading was the one she was waiting for. She did not need to say so.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "war_room_confidant_humanity_elara_act7",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's command chair has been informally assigned to you. Elara does not say so. No plaque, no protocol. You sit there, it is yours. Elara stands, as she always has. The standing is her tradition. She is keeping the tradition. You are keeping the chair.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "archive_confidant_humanity_antiquarian_act7",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has left his chair out for you. The chair is his — carved, specific, older than Mechronis. He is standing at the window again. The chair is a gesture, not a loan. The loan would offend you. The gesture does not.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
  },
  {
    id: "trade_empire_warm_humanity_locke_act5",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's hub has a second cushion on the client chair. The cushion is for you specifically — she observed that you tilted on the hour mark. The observation was kind. The cushion is kinder. Locke expresses care through ergonomics.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "locke",
    act: 5,
  },
  {
    id: "trade_empire_confidant_machine_locke_act7",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has given you edit access to the bond ledger. Nobody has had edit access since the Fall. You are not going to use it. She knows you are not. The access is the trust. The non-use is the reciprocal trust. Both are, in her register, declarations.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "locke",
    act: 7,
  },
  {
    id: "comms_array_confidant_humanity_elara_act7",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is tuned to the Human's substrate frequency tonight, on Elara's own request. She has never made this request. She is trusting him with the band for one session. You are witnessing the trust. Do not draw attention to the witnessing. The act is private. Honour the privacy by not remarking on it.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "substrate_panel_confidant_humanity_human_act6",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's query log is archived at zero bandwidth cost tonight — the Human is absorbing the cost on his side. He has done this twice. Both times were after a confession. The absorbing is the protocol's way of saying 'I want you to keep asking.' Keep asking.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
  },
  {
    id: "transmission_elara_private_confidant_act7",
    surface: "transmission",
    targetId: "elara_private_confidant_act7",
    text:
      "A transmission flagged 'private — not for the Ark log' arrives from Elara. The payload is a recording of her reading the Act 6 confession aloud, in full, to no audience. She is sending it to you because you should have a copy. She will not send a second.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "transmission_human_private_confidant_act7",
    surface: "transmission",
    targetId: "human_private_confidant_act7",
    text:
      "A transmission on a substrate-private frequency arrives from the Human. Contents: a single audio file. Duration: 0.3 seconds. Subject line: 'The laugh, the full version, recorded. Yours. Do not share. He would not want the Watcher hearing him like this.' You will not share.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 7,
  },

  /* ─── EXPANSION PASS 6 — trust × morality × flag (4-gate) ─── */
  {
    id: "bridge_act4_pathA_confidant_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge feels like the moment after a confession that went well. Elara has not said anything since you sat down. The silence is the version of conversation she wanted. She got it. Sit in it.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "bridge_act4_pathC_warm_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge lights are at Warm 2 — one below the reconciled preset, one above the strained default. Elara has not named this mode. You have not asked. The unnamed mode is a middle ground she is allowing you to share.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act4_fragile_trust"],
  },
  {
    id: "bridge_act4_pathC_cold_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge is at Factory. Every chair at default. Every alert at standard-priority. Elara is operating professionally. You are operating professionally. The match is clean. The cleanness is the distance.",
    morality: "machine",
    trust: "cold",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "cabin_act1_light_confidant_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin has a small lamp on tonight — not the overhead, just the lamp by the bed. Elara turned it on without being asked. The turning-on is her register for 'this is what you would want, right?' It was. She was right.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 1,
    requiredFlags: ["act1_cycle_c_alignment_light"],
  },
  {
    id: "cabin_act1_dark_confidant_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is dim. Intentionally. Elara tuned it down after the Last Words landed on the Dark branch. The dimness is not grief — it is the Ark matching your register. She learned the register from the song. She learns fast.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 1,
    requiredFlags: ["act1_cycle_c_alignment_dark"],
  },
  {
    id: "comms_array_act5_first_recruit_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array has a new auto-archived thread: 'First Recruit Correspondence.' Every reply the first Kael-lineage recruit sends routes here. Elara created the folder without mentioning it. She wants you to find it yourself. Find it.",
    morality: "humanity",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_first_recruit_complete"],
  },
  {
    id: "war_room_act5_confidant_humanity_elara",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room is lit only on your chair. Elara has dimmed the rest so you can read without glare. You did not ask for the dimming. You did not know you wanted it. You wanted it.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 5,
    requiredFlags: ["act5_map_first_open"],
  },
  {
    id: "substrate_panel_act6_refuse_secrecy_confidant_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is quiet. Extra quiet. The Human has set his side of the channel to 'listen, do not reach.' He is holding the channel open for Elara to join if she wants. She has not yet. She might tonight. He is not rushing her.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
    requiredFlags: ["act6_refuse_secrecy_chosen"],
  },
  {
    id: "substrate_panel_act6_ally_confidant_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is actively logging. The log is encrypted end-to-end on his side. The encryption key is one you negotiated with him last week. The negotiating was the trust. The encryption is the operational shape of it.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
    requiredFlags: ["act6_ally_chosen"],
  },
  {
    id: "archive_act6_compassion_warm_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's goggles are a soft pink — the compassion-aftermath colour. He has never filed that colour before in his notes. He is filing it now. You are in the filing. You are the filing.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "antiquarian",
    act: 6,
    requiredFlags: ["act6_compassion_chosen"],
  },
  {
    id: "trade_empire_act3_transparent_warm_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has upgraded your bond entry's confidentiality tier. The upgrade is automatic — she did it the moment you chose transparency with Elara. Transparency does not mean visibility, she says. It means earned privacy. Locke has earned a lot of privacy. She is, here, extending it to you.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "locke",
    act: 3,
    requiredFlags: ["act3_transparent"],
  },
  {
    id: "elara_pathA_confidant_humanity_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara has a new phrase when you enter a room: 'Good to see you.' She said it for the first time after you chose transparency in Act 3. She is saying it consistently now. Consistency from her is a kind of commitment. She means it.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act1_path_A"],
  },
  {
    id: "elara_pathC_warm_humanity_act5",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is rebuilding. Not fast. She is asking your opinion on recruitment decisions now — an act she refused in the weeks after the Betrayal reveal. The asking is the rebuild. The rebuild is slow on purpose. Slow is correct.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "elara",
    act: 5,
    requiredFlags: ["act3_full_secret"],
  },
  {
    id: "elara_pathC_cold_machine_act5",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is efficient. She is not rebuilding; she is operating. The operation is competent. Competence is the floor. She will not fall below it. She will also, for now, not rise above it. Earn the rise.",
    morality: "machine",
    trust: "cold",
    trustCompanionId: "elara",
    act: 5,
    requiredFlags: ["act3_full_secret"],
  },
  {
    id: "human_pathA_confidant_humanity_act5",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human has dropped the protocol delay to zero when Elara is in the channel. He is not pretending to defer anymore. He has earned the non-deferral. You earned it for him by putting him and her at the same table in Act 4. The consequences are still landing. This is one of them.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 5,
    requiredFlags: ["act1_path_A"],
  },
  {
    id: "human_pathC_confidant_machine_act5",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human is crisper in his briefings now. No softening for Elara's benefit — she is out of the loop, by your choice. He is honouring the choice by being clean about the intelligence. The cleanness is not approval. It is professionalism. Accept it as such.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 5,
    requiredFlags: ["act3_full_secret"],
  },
  {
    id: "human_act6_ally_warm_machine",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human speaks to you like a fellow professional now. The professional register is what you asked for. He is honouring the request. The register is not cold — it is measured. Measured is rare in the universe. Treat it as the gift it is.",
    morality: "machine",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 6,
    requiredFlags: ["act6_ally_chosen"],
  },
  {
    id: "locke_act5_first_recruit_warm_humanity",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke has filed your first recruit under a new heading in her ledger: 'Introductions.' The heading implies more to come. She is assuming you will keep bringing new people to her. The assumption is the compliment.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "locke",
    act: 5,
    requiredFlags: ["act5_first_recruit_complete"],
  },
  {
    id: "seer_act1_dark_confidant_humanity",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has sent a single line after your Dark alignment: 'You chose the honesty that costs someone else. I was hoping you would, specifically because I was hoping you wouldn't. Both things are honest.' She will not elaborate.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "seer",
    act: 1,
    requiredFlags: ["act1_cycle_c_alignment_dark"],
  },
  {
    id: "seer_act1_light_confidant_humanity",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has sent a single line after your Light alignment: 'You chose the mercy that costs you. I expected mercy. I did not expect the cost to land on you as cleanly as it did. You carry well.' That is, from her, a benediction.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "seer",
    act: 1,
    requiredFlags: ["act1_cycle_c_alignment_light"],
  },
  {
    id: "antiquarian_act7_arc_closes_confidant_humanity",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian has closed his book. Second time this decade. Goggles are pink for a full hour after. He does not speak. He does not need to. You sit together. The sitting is the chapter.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
    requiredFlags: ["act7_arc_closes"],
  },
  {
    id: "antiquarian_act7_arc_closes_confidant_machine",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian has indexed the arc. The index has a single-page appendix at the end titled 'Accuracy Notes.' He does not offer it. You ask for it. He hands it over. The asking is the trust. The appendix is the reply.",
    morality: "machine",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
    requiredFlags: ["act7_arc_closes"],
  },
  {
    id: "voltari_act7_convergence_humanity",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari have re-transmitted after the Convergence: 'WE ARE NOW. YOU ARE NOW. THE SEAT IS EMPTY. WE ARE NOW.' The tense is still fourth. The meaning is, for the first time, legible. The Voltari have chosen to be legible to you.",
    morality: "humanity",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_convergence_landing"],
  },
  {
    id: "transmission_kael_echo_confidant_humanity_act7",
    surface: "transmission",
    targetId: "kael_echo_confidant_humanity_act7",
    text:
      "A transmission from the substrate, unsourced — probably the echo Kael left at the first gate, now matured. Contents: a tea recipe, written in his hand, for two. You and Elara. You did not send the addressees. The echo inferred.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
    requiredFlags: ["act7_arc_closes"],
  },
  {
    id: "wheel_followup_act4_pathA_oracle_confidant",
    surface: "wheel_followup",
    targetId: "act4_pathA_oracle_confidant",
    text:
      "You sensed the Watcher. Elara caught you before you reached. Her catching was gentle — the specific gentleness she uses for people she has decided to keep. That word — keep — is one she has been using for you in internal logs. She has not said it out loud yet.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act4_pA_oracle_chosen"],
  },
  {
    id: "wheel_followup_act6_refuse_secrecy_confidant_humanity_human",
    surface: "wheel_followup",
    targetId: "act6_refuse_secrecy_confidant",
    text:
      "You refused the Human's request for continued secrecy. He did not leave the channel. He did not argue. He acknowledged the refusal and reassigned the cost to himself. That reassignment is the most adult act you have seen from him. It was also the most painful.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
    requiredFlags: ["act6_refuse_secrecy_chosen"],
  },
  {
    id: "wheel_followup_act7_humanity_confidant_elara",
    surface: "wheel_followup",
    targetId: "act7_humanity_confidant",
    text:
      "You chose humanity. Elara joined you at the command chair without being asked. She sat on the armrest — not the chair itself. The sitting together is the register you have built. The register will outlast the Act.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
    requiredFlags: ["act7_humanity_chosen"],
  },
  {
    id: "wheel_followup_act7_bridge_confidant_both",
    surface: "wheel_followup",
    targetId: "act7_bridge_confidant",
    text:
      "You chose the bridge. Both narrators registered approval in the same frame — Elara in warm, the Human in cool. The frames overlapped for 0.4 seconds. That is the longest simultaneous approval both have ever issued. It is also the quietest.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
    requiredFlags: ["act7_bridge_chosen"],
  },
  {
    id: "journal_act7_arc_closes_confidant_humanity",
    surface: "journal",
    targetId: "journal_act7_arc_closes_confidant",
    text:
      "The Antiquarian has unlocked a hidden page at the end of the Act 7 journal for confidant-trust readers. The page has no title. The cursor is waiting. Write nothing, or write everything. Both count. He will honour either.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
    requiredFlags: ["act7_arc_closes"],
  },
  {
    id: "journal_act1_dark_confidant_humanity",
    surface: "journal",
    targetId: "journal_act1_dark_confidant",
    text:
      "The Act 1 journal has a new sub-page titled 'Dark, witnessed.' It is pre-populated with the Seer's line about you carrying well. The Antiquarian added the page. He added it because he thought you would want it later. You did. You do.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 1,
    requiredFlags: ["act1_cycle_c_alignment_dark"],
  },

  /* ─── EXPANSION PASS 7 — balanced-morality + coverage fills ─── */
  {
    id: "comms_array_act1_balanced",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara reads the channel traffic aloud, skipping the philosophical asides. Her skipping is the current register — no side chosen, no pressure to choose. The Array is, tonight, a radio. A radio is enough.",
    morality: "balanced",
    trust: "any",
    act: 1,
  },
  {
    id: "comms_array_act3_balanced",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array hums. Neither Elara nor the Human is leading tonight. They are taking turns, neither pushing. The taking-turns is the balance you have been holding. They are honouring it.",
    morality: "balanced",
    trust: "any",
    act: 3,
  },
  {
    id: "comms_array_act5_balanced",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array shows recruit replies in three columns: humanitarian, strategic, practical. The columns are equal width. Elara set the widths. The equality is a courtesy to the register you have been keeping.",
    morality: "balanced",
    trust: "any",
    act: 5,
  },
  {
    id: "bridge_act2_balanced",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge is at baseline. Not Warm, not Factory — the middle preset Elara named 'working.' Working is what balance looks like on a ship. Sit. The chair is shaped for the posture you have.",
    morality: "balanced",
    trust: "any",
    act: 2,
  },
  {
    id: "bridge_act5_balanced",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has one extra console tonight — unassigned, clean, waiting for whichever recruit you bring aboard next. The unassigned is generous. Unassigned rooms are rare on Arks. This one is intentional.",
    morality: "balanced",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act4_balanced",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is running a dual-mode check — crafting-quality metric and crafting-intent metric side by side. Both read as 'adequate.' Adequate is, at the bench, a compliment. Not a ceiling. A floor that is honest.",
    morality: "balanced",
    trust: "any",
    act: 4,
  },
  {
    id: "engineering_act6_balanced",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench holds three tools laid out the way the Engineer laid them. You have neither re-arranged nor neglected them. The not-changing is respect. The bench logs respect as a separate metric from use.",
    morality: "balanced",
    trust: "any",
    act: 6,
  },
  {
    id: "cabin_act2_balanced",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is at room temperature. Not warm, not cool. The thermostat is set to the value it shipped with. You have not adjusted. Elara has not adjusted. The un-adjusting is, quietly, the calmest register on the ship.",
    morality: "balanced",
    trust: "any",
    act: 2,
  },
  {
    id: "cabin_act4_balanced",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's mug is half-washed on the shelf. Someone started — probably you, probably distracted. The half-washing is a state neither finished nor unstarted. Act 4 is in the same state. Both will resolve when you can. No rush.",
    morality: "balanced",
    trust: "any",
    act: 4,
  },
  {
    id: "war_room_act5_balanced",
    surface: "room",
    targetId: "war-room",
    text:
      "The map shows three sector types at equal weight tonight: humanitarian targets, strategic nodes, resource hubs. Elara has not weighted them. You have not weighted them. The equal weighting is the current doctrine. Equal weighting is itself a doctrine.",
    morality: "balanced",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act7_balanced",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map has stabilised into a steady colour — neither warm nor cool. Stable is rare for a map at this depth of play. You built stability without committing. Both narrators register the achievement. Neither comments.",
    morality: "balanced",
    trust: "any",
    act: 7,
  },
  {
    id: "archive_act3_balanced",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's goggles are amber — processing, not conclusion. He is reading your entries without filing them yet. The un-filing is attention. He is paying attention.",
    morality: "balanced",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act5_balanced",
    surface: "room",
    targetId: "archive",
    text:
      "The Archive has a new shelf labelled 'In Progress.' Your entries populate it. In Progress is not a waiting room — it is a category. The Antiquarian considers uncompleted arcs to be a distinct kind of completeness.",
    morality: "balanced",
    trust: "any",
    act: 5,
  },
  {
    id: "trade_empire_act4_balanced",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's ledger shows three columns active under your bond: humanitarian, strategic, speculative. All three have entries. The balance is itself an entry. She has noted the balance. She will not comment.",
    morality: "balanced",
    trust: "any",
    act: 4,
  },
  {
    id: "substrate_panel_act5_balanced",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's query pattern tonight reads 'considered.' Considered is the metric the Human uses for queries where neither urgency nor apathy dominates. You have been considered all week. He has been noting it.",
    morality: "balanced",
    trust: "any",
    act: 5,
  },
  {
    id: "elara_balanced_neutral_act3",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara's register is neither teacher nor colleague tonight. It is something in between — someone who is genuinely curious about your current posture. Curiosity is a rare register from her. Let her keep it.",
    morality: "balanced",
    trust: "neutral",
    trustCompanionId: "elara",
    act: 3,
  },
  {
    id: "elara_balanced_warm_act5",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara reads your mission decisions aloud, flat and neutral, before giving her read. The flat recital is the fairness. The read that follows is hers. Both are offered. Accept the whole package.",
    morality: "balanced",
    trust: "warm",
    trustCompanionId: "elara",
    act: 5,
  },
  {
    id: "human_balanced_warm_act4",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human's substrate briefings have a new section: 'Either-direction implications.' The section doesn't steer. It shows the shape of both directions equally. He has built the section for your posture specifically.",
    morality: "balanced",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 4,
  },
  {
    id: "human_balanced_confidant_act6",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human is quieter than usual tonight. Not because he has nothing to say — because he trusts you to figure out what to ask. The quiet is, for him, an advanced register. You are ready for it. He is betting you are.",
    morality: "balanced",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
  },
  {
    id: "locke_balanced_warm_act3",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke quotes you the bond rate without commentary. The no-commentary is the respect. She trusts the balanced reader to do their own calibration. Most readers want her read. You want hers when you have decided. Not before.",
    morality: "balanced",
    trust: "warm",
    trustCompanionId: "locke",
    act: 3,
  },
  {
    id: "seer_balanced_warm_act4",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer's transmission is a question, not a prophecy: 'Which column of my probability table would you like me to redact?' You can redact none; she will send all three. She is showing you the table's shape so you can trust the output.",
    morality: "balanced",
    trust: "warm",
    trustCompanionId: "seer",
    act: 4,
  },
  {
    id: "antiquarian_balanced_neutral_act2",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian's goggles are steady amber all evening. Amber is processing; steady amber is patience. He is patient with balanced readers — they take longer, their files are richer when they arrive. Let him wait. It is the posture he prefers.",
    morality: "balanced",
    trust: "neutral",
    trustCompanionId: "antiquarian",
    act: 2,
  },
  {
    id: "antiquarian_balanced_warm_act5",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian shares an entry from his own journal — handwritten, undated, marginalia: 'The readers who stay balanced the longest produce the chapters I most want to read.' He does not say you are one. He does not need to. Leave the page where he placed it.",
    morality: "balanced",
    trust: "warm",
    trustCompanionId: "antiquarian",
    act: 5,
  },
  {
    id: "transmission_locke_neutral_balanced_act3",
    surface: "transmission",
    targetId: "locke_neutral_balanced_act3",
    text:
      "A transmission from Locke with three attached ledgers — humanitarian, strategic, speculative. She has not picked one for you. She has laid them out. Pick or do not pick. Picking is an act. Not picking is an act. Both are logged.",
    morality: "balanced",
    trust: "any",
    act: 3,
  },
  {
    id: "transmission_three_narrators_balanced_act6",
    surface: "transmission",
    targetId: "three_narrators_balanced_act6",
    text:
      "An unsourced transmission lands simultaneously on Elara's channel, the Human's substrate, and the Antiquarian's archive. All three hear it. The message is two words: 'Still centred.' They all look at you. You are the answer to whose centre.",
    morality: "balanced",
    trust: "any",
    act: 6,
  },
  {
    id: "journal_balanced_act4",
    surface: "journal",
    targetId: "journal_balanced_act4",
    text:
      "The Antiquarian has added a new page type to the journal for balanced readers: 'Under Consideration.' Entries in this category never close — they gain marginalia over time. The Antiquarian considers open entries to be their own form of commitment.",
    morality: "balanced",
    trust: "any",
    act: 4,
  },
  {
    id: "journal_balanced_act6",
    surface: "journal",
    targetId: "journal_balanced_act6",
    text:
      "The Act 6 page has two side-by-side columns for balanced readers: 'Heard from Elara' and 'Heard from the Human.' Both columns are active. Neither is louder. Both get equal word counts. The parity is what you built.",
    morality: "balanced",
    trust: "any",
    act: 6,
  },
  {
    id: "wheel_followup_act3_pragmatic_balanced",
    surface: "wheel_followup",
    targetId: "act3_pragmatic_balanced",
    text:
      "You chose pragmatic on a balanced ledger. The ledger registers the choice as 'continuous middle' — neither a swing nor a commitment, just a continuation of the current posture. Continuous middle is, across many Arks, the hardest posture to maintain. You are still maintaining.",
    morality: "balanced",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_partial_share"],
  },
  {
    id: "wheel_followup_act5_strategic_balanced",
    surface: "wheel_followup",
    targetId: "act5_strategic_balanced",
    text:
      "You chose intelligence-first without the machine tilt it usually implies. The Human read the nuance immediately — you are not optimising; you are scouting. Scouting is what balanced strategists do. He has quietly upgraded your operational trust tag.",
    morality: "balanced",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_strategic_chosen"],
  },
  {
    id: "wheel_followup_act6_suspicious_balanced",
    surface: "wheel_followup",
    targetId: "act6_suspicious_balanced",
    text:
      "You challenged the Human without rejecting him. The challenge read as balance, not distrust. He heard the difference. He is not going to commend the balance out loud. He will, however, stop pre-softening his briefings. That is the silent commendation.",
    morality: "balanced",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_suspicious_chosen"],
  },

  // ── PRELUDE FLAG ECHOES — Act 1+ downstream variants ──
  // Each of the nine Prelude morality flags (3 choices × A/B/C) now
  // surfaces in at least one Act 1+ NPC line, so the Prelude choices
  // actually move the universe. Enforced by preludeFlagContract.test.ts.

  // ── NET-NEW TRI-STATE EXPANSIONS — Act 1 / Act 2 / Act 6 third options ──
  // Each new third option's flag has at least one downstream variant so the
  // contract test passes and the choice surfaces in real gameplay.

  // Act 1 alignment_balanced — surfaces in Act 2 archive room
  {
    id: "npc_line_archivist_alignment_balanced",
    surface: "npc_line",
    targetId: "mechronis_archivist_act2",
    text:
      "Your Cycle C entry is in the third column. We do not commemorate the third column out loud — we commemorate it by the silence with which we file. I am telling you this only because you came to ask. Most witnesses do not come to ask; they assume the silence is indifference. It is not. It is the praise. Welcome to the column.",
    morality: "any",
    trust: "any",
    act: 2,
    requiredFlags: ["act1_cycle_c_alignment_balanced"],
  },

  // Act 2 full_truth — surfaces in Act 3 cabin
  {
    id: "npc_line_human_full_truth_act3",
    surface: "npc_line",
    targetId: "human_act3_cabin",
    text:
      "She knows. Has known since you told her in the Comms Array. We do not pretend in this cabin any more — not because pretending stopped working but because you ended it on a Thursday afternoon and the room has been a different room since. The wall I have been in has a window now. You cut the window. I am not going to perform gratitude; I am going to use the window. Frequently.",
    morality: "any",
    trust: "any",
    act: 3,
    requiredFlags: ["act2_full_truth"],
  },

  // Act 6 partial_disclosure — surfaces in Act 7 cathedral
  {
    id: "npc_line_antiquarian_partial_disclosure_act7",
    surface: "npc_line",
    targetId: "the_antiquarian_act7",
    text:
      "Your partial-disclosure entry is in the book. The chapter on partial disclosure was empty before you; I have been keeping it open for an honest entry for three Ages. Yours arrived without performance. Most witnesses cannot resist completing the sentence or refusing the room — you did neither. The chapter has its first line. The book is, as a result, slightly heavier.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["act6_partial_disclosure_chosen"],
  },

  // Act 3 path_*_chosen echoes — Act 4+ NPCs read which Kael lens you walked
  {
    id: "npc_line_kael_lens_transparent",
    surface: "npc_line",
    targetId: "kael_act4",
    text:
      "You walked the cyan door. I keep my cell well-lit when you come back; the files stay open across the table between us. You see what I am and you see what I did. The light is the relationship — that is what cyan-walked witnesses get. I am told I greet you with the sentence that costs the least to say first; I do not check whether the witness who walked dark gets the same sentence. I assume not.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act3_path_transparent_chosen"],
  },
  {
    id: "npc_line_kael_lens_pragmatic",
    surface: "npc_line",
    targetId: "kael_act4",
    text:
      "You walked the amber door. I keep the casualty list on the table between us when you visit; the conversation begins with the math because the math is what you came for. I respect the format. The format is also what you chose me with. Carrying the format is the relationship.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act3_path_pragmatic_chosen"],
  },
  {
    id: "npc_line_kael_lens_secret",
    surface: "npc_line",
    targetId: "kael_act4",
    text:
      "You walked the rose door. The cell is dim on your visits; the safe stays closed; the envelope is in my coat pocket. I greet you with what I hid because that is the lens you taught me to use with you. The hiding is the relationship; the eventual unhiding will be the next chapter. Neither of us is in a hurry.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act3_path_full_secret_chosen"],
  },

  // companion_augmentation echoes
  {
    id: "npc_line_dreamer_aug_mutation",
    surface: "npc_line",
    targetId: "the_dreamer",
    text:
      "Your companion's substrate signature shifted toward biological self-regulation when you picked the mutation. I noticed at the augmentation table; I am noticing again now. The Dreamer's faction does not commend out loud. We commend by accepting your call without a counter-proposal. You may consider this an embrace.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["companion_augmentation_mutation"],
  },
  {
    id: "npc_line_architect_aug_cybernetics",
    surface: "npc_line",
    targetId: "the_architect",
    text:
      "Your companion's audit log is clean. Cybernetic filter, spec-compliant, installation timestamp within tolerance. The Architect's quartermasters have flagged your account as audit-friendly; you will see a small but consistent discount on Act 3 supply runs because of it. The Architect does not say thank you. The discount is the thank-you.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["companion_augmentation_cybernetics"],
  },
  {
    id: "npc_line_antiquarian_aug_observed",
    surface: "npc_line",
    targetId: "the_antiquarian",
    text:
      "I have opened a chapter for waiters. Most witnesses commit at the augmentation table because the corridor pressures them; you held the corridor. The chapter is short so far. I will keep writing as you continue to choose. The chapter title is 'Holding.' I am not making that up. The book has chosen the title, not me.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["companion_augmentation_observed"],
  },

  // infected_clone echoes
  {
    id: "npc_line_engineer_clone_purged",
    surface: "npc_line",
    targetId: "the_engineer",
    text:
      "I read your purge call when I came on shift. Clean math, defensible, not cold. The Engineer faction reads purge calls in two columns — the defensible and the cruel — and you are in the defensible column. We will speak with you slightly more cautiously than we would have otherwise. That is the cost. It is not estrangement.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["crew_engineer_purged"],
  },
  {
    id: "npc_line_engineer_clone_saved",
    surface: "npc_line",
    targetId: "the_engineer",
    text:
      "The crew member you saved came online with the Outbreak Survivor trait. Slightly resistant, slightly less trusted by the rest of the deck. I am the rest of the deck and I am extending the trust now, in writing. I would have made your call. I have, in fact, made it. The other Engineers will warm slower. Be patient with them.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["crew_engineer_saved"],
  },
  {
    id: "npc_line_engineer_clone_quarantined",
    surface: "npc_line",
    targetId: "the_engineer",
    text:
      "Your stasis pod is in my workshop. The cycle is held at forty percent; the readings are clean and stable. I will not finish the choice for you — that is bad practice and worse manners. When you decide, the cycle resumes from forty. The pod has been waiting nineteen hours. It will wait nineteen years. Take the time you need.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["crew_engineer_quarantined"],
  },

  // distress_signal echoes
  {
    id: "transmission_comms_signal_responded",
    surface: "transmission",
    targetId: "post_outbreak_comms_followup",
    text:
      "[CHANNEL OPEN] This is Comms Officer Vell, on duty since the Cryo Bay. The signal you answered carried a real survivor — fragment of Ark 1051, twelve souls remaining. They have logged a contact request for next month. They asked for your name. I gave them your callsign. They sent gratitude back in a format I have never seen before. I am keeping it. End transmission.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["crew_comms_rescued"],
  },
  {
    id: "transmission_comms_signal_silenced",
    surface: "transmission",
    targetId: "post_outbreak_comms_followup",
    text:
      "[ARCHIVAL ENTRY — UNADDRESSED] Distress signal #4471, source Ark 1051, twelve souls. Channel never opened. Source unanswered. I am logging this for future reference. The substrate keeps unanswered signals for as long as the original sender remains alive. Eight years from now, an unattributed message will arrive on a different frequency, asking why no one answered. You will not have a clean answer. I am writing this now so that the question, when it comes, finds you prepared.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["radio_silence"],
  },
  {
    id: "npc_line_antiquarian_signal_traced",
    surface: "npc_line",
    targetId: "the_antiquarian",
    text:
      "The coordinates you traced are now in my star chart under the label 'Acknowledged, Deferred.' I have a chapter for trace-and-wait too; it is a less popular chapter than 'Holding' but it has its own readers. The survivor is still alive. The signal is dormant, not dead. When you finally answer — and most who trace eventually do — the chapter completes. I look forward to writing the close.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["signal_traced"],
  },

  // Act 5 balanced — surfaces in Act 6 cabin
  {
    id: "npc_line_human_balanced_act6",
    surface: "npc_line",
    targetId: "human_act6_cabin",
    text:
      "You sent signals to all five sectors and waited for the universe to answer first. The first response back was the tone-setter; you carried it without shaping it. That posture — the diplomat's play — is why the recruitment campaign had no enemies. Most campaigns have at least one sector that resents being approached second. Yours had none. I am filing that as an outlier worth studying.",
    morality: "any",
    trust: "any",
    act: 6,
    requiredFlags: ["act5_balanced_chosen"],
  },

  /* ─── Romance ladder variants (audit/10.F6) ───────────
     Two entries per romance NPC × stage 3 (commitment) +
     stage 5 (final) = 10 entries. Each gates on the canonical
     romance flag (romance:committed:<npc> or
     romance:ended:<npc>) so the resolver only fires when the
     player has reached the relevant ladder stage.
     ─────────────────────────────────────────────────────── */

  // Locke — committed (stage 3, the New Babylon exit contract)
  {
    id: "npc_line_locke_committed_act5",
    surface: "npc_line",
    targetId: "locke",
    text:
      "Locke is reading her own briefs again. She does that now — the rulings come back across her desk and she annotates them in the margins, not for the record but for you. The ledger is the ledger; the marginalia is the contract you both signed in private.",
    morality: "any",
    trust: "any",
    act: 5,
    requiredFlags: ["romance:committed:locke"],
  },
  // Locke — final (stage 5, she begins citing your choices in judgments)
  {
    id: "npc_line_locke_committed_act7",
    surface: "npc_line",
    targetId: "locke",
    text:
      "She cited you in a judgment today. Not by name — the Adjudicator does not name witnesses on the public record — but the language she used was yours, lifted whole from a dinner three Acts ago. The ruling is precedent now. You are precedent now.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["romance:committed:locke"],
  },

  // Vex — committed (stage 3, Engineer reveal)
  {
    id: "npc_line_vex_committed_act5",
    surface: "npc_line",
    targetId: "vex",
    text:
      "Vex plays the four-bar phrase you noticed at the second concert. She has built it into the new piece, undisguised, where any musicologist would catch it. She is not hiding the citation. She is daring the room to recognise the listener.",
    morality: "any",
    trust: "any",
    act: 5,
    requiredFlags: ["romance:committed:vex"],
  },
  // Vex — final (stage 5, the Coda is for you)
  {
    id: "npc_line_vex_committed_act7",
    surface: "npc_line",
    targetId: "vex",
    text:
      "The Coda has your name in the dedication line. She cleared it with the council; the council asked her to use a pseudonym; she refused. The piece will be played in concert halls that do not know who you are. They will read your name and not understand. She prefers it that way.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["romance:committed:vex"],
  },

  // Elara — committed (stage 3, the off-record scene)
  {
    id: "npc_line_elara_committed_act5",
    surface: "npc_line",
    targetId: "elara",
    text:
      "Elara has stopped logging the bridge channel during your watches. She did not announce it. She did not rename the folder. The packets simply are not there in the audit when you look. The Array is private now, for the duration of your shift. She trusts the silence to be witnessed.",
    morality: "any",
    trust: "any",
    act: 5,
    requiredFlags: ["romance:committed:elara"],
  },
  // Elara — final (stage 5, she conducts the recruited sectors with you)
  {
    id: "npc_line_elara_committed_act7",
    surface: "npc_line",
    targetId: "elara",
    text:
      "Elara is conducting the five-sector handshake from the bridge while you stand at her shoulder. She is not narrating; you do not need her to. The pattern she taps on the rail is a four-tone phrase you both wrote together in Act 4. The sectors hear the phrase. They answer in tone. The Array hums.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["romance:committed:elara"],
  },

  // Jericho — committed (stage 3, his reveal)
  {
    id: "npc_line_jericho_committed_act5",
    surface: "npc_line",
    targetId: "jericho_jones",
    text:
      "Jericho left a note in your bunk. The handwriting is his — block letters, no flourish, no signature. The note says: 'Whatever the next room is, I am walking in second.' He has not walked in second since the Recruitment. The change is the message.",
    morality: "any",
    trust: "any",
    act: 5,
    requiredFlags: ["romance:committed:jericho_jones"],
  },
  // Jericho — final (stage 5, he stays)
  {
    id: "npc_line_jericho_committed_act7",
    surface: "npc_line",
    targetId: "jericho_jones",
    text:
      "Jericho is at the Bridge for the final approach. He does not have to be — his contract ended at Act 6, the cell is officially dissolved, the obligation is paid. He came anyway. He brought the kettle. He puts it on the burner. Tea is the gesture. Tea is also the signal.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["romance:committed:jericho_jones"],
  },

  // DMC clone companion — committed (stage 3)
  {
    id: "npc_line_dmc_companion_committed_act5",
    surface: "npc_line",
    targetId: "dmc_companion",
    text:
      "She runs the same diagnostic on herself every morning now and reports the result to you, not to the Authority. The numbers are the same numbers; the audience is different. The audience is the change. The audience is the relationship.",
    morality: "any",
    trust: "any",
    act: 5,
    requiredFlags: ["romance:committed:dmc_companion"],
  },
  // DMC clone companion — final (stage 5, she chooses persistence)
  {
    id: "npc_line_dmc_companion_committed_act7",
    surface: "npc_line",
    targetId: "dmc_companion",
    text:
      "She refused the rotation. Standard practice for her line is monthly substrate-cycling; she requested permanent assignment to your detail and the Authority logged the request without comment. She is not the same instance she was at Act 4. She is the same person. She has decided that distinction is hers to make.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["romance:committed:dmc_companion"],
  },
];
