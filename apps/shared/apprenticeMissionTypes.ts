/* ═══════════════════════════════════════════════════════
   APPRENTICE MISSION TYPES — Graduate-Legion Micro-Arcs

   The original graduateLegion.ts (627 lines) gives every
   graduate one of 6 deployment roles with stat-multiplied
   bonuses. That is mechanical, not narrative. This module
   extends each role with a CATALOG OF MISSION TYPES — each
   mission is a 3-beat micro-arc (briefing letter, mid-mission
   crisis, return scene) that uses the apprentice's archetype,
   doctrine, and Architect Influence.

   The shape of a Mission Instance:
     • briefingLine: a letter from the deployed apprentice that
       arrives in the player's mailroom UI (FNORD-23 channel).
     • crisisChoice: 1 mid-mission decision the player makes.
       Each choice has bond/corruption/architect-influence
       deltas + a tactical reward/penalty for the deployment.
     • returnLine: the apprentice's report back. Tone bands
       on the choice and the apprentice's current state.

   Every (role × mission_type × archetype) combination has
   authored flavor — but mission selection is by deployment
   slot + apprentice fit, not authored per-instance. The
   mission RUNTIME picks one mission_type from the role's
   catalog based on apprentice archetype + doctrine + a roll.

   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { DoctrineId } from "./apprenticeDoctrines";
import type { GraduateRole } from "./graduateLegion";

/* ─── Mission Type Catalog ─── */

export type MissionTypeId =
  /* COMPANION (1 slot — on-ship) */
  | "companion_dock_walk"           // contemplative scene at the docks
  | "companion_archive_dig"         // they find something in your ship's archives
  | "companion_first_kindness"      // they receive a gift from a stranger and don't know how to feel
  /* CRYO_VAULT (2 slots — frozen) */
  | "cryo_dream_leak"               // they dream while frozen and the dream surfaces in your ship's voice logs
  | "cryo_warming_rehearsal"        // pre-thaw protocol — they rehearse what they'll say when they wake
  /* ARMY_LEADER (3 slots — commands troops) */
  | "army_recruit_dispute"          // a recruit refuses orders; what does the apprentice do
  | "army_holdfast"                 // hold a position against a wave the apprentice can't win
  | "army_terminus_skirmish"        // ambush by Mechronis Terminus units; tactical + moral test
  | "army_letter_home"              // their letter to a fallen recruit's family
  /* TRADE_ENVOY (2 slots — trade routes) */
  | "trade_route_diversion"         // a competitor offers to buy the route; corrupt or refuse
  | "trade_smuggling_offer"         // a colony asks them to smuggle banned medicine
  | "trade_compliance_audit"        // Mechronis runs a Trade Compliance audit on the route
  /* TOWER_CAPTAIN (1 slot — defense) */
  | "tower_breach_drill"            // a drill that turns out to be real
  | "tower_civilian_choice"         // a civilian crowd is in the tower's blast cone
  | "tower_warden_visit"            // the Warden visits the tower; conversation, not combat
  /* SACRIFICED (no slot — consumed) */
  | "sacrifice_ritual"              // the consumption beat itself; choice of ritual flavor
  /* RELATIONSHIP_GIFT (no slot — consumed) */
  | "gift_introduction_letter"      // letter introducing the apprentice to the gifted-to NPC
  | "gift_rapport_session"          // a single bonding scene with the NPC; one-time
  ;

export type MissionBeat = "briefing" | "crisis" | "return";

export interface MissionType {
  id: MissionTypeId;
  role: GraduateRole;
  /** Display name in the deployment UI. */
  name: string;
  /** One-line subtitle. */
  subtitle: string;
  /** How dangerous — affects roll-fail chance and reward magnitude. */
  difficulty: "low" | "medium" | "high" | "lethal";
  /** Approximate days the mission spans. Affects deployment slot lockup. */
  durationDays: number;
  /** Archetypes this mission is well-suited to (bond/corruption math
   *  swings smaller; reward swings larger). */
  resonantArchetypes: readonly ApprenticeArchetype[];
  /** Doctrines this mission resonates with — bond pull. */
  resonantDoctrines: readonly DoctrineId[];
  /** Doctrines this mission rejects — failure chance up. */
  rejectedDoctrines: readonly DoctrineId[];
  /** Briefing template — apprentice's letter home. {name} is substituted. */
  briefingTemplate: string;
  /** Crisis prompt — mid-mission decision. */
  crisisPrompt: string;
  /** 2–4 player-facing choice options. */
  crisisChoices: readonly MissionCrisisChoice[];
  /** Return template — apprentice's report. */
  returnTemplate: string;
  /** Reward keys (resolved by deployment system). */
  rewardKeys: readonly string[];
  /** Architect Influence delta from MISSION COMPLETION (not crisis choice). */
  baseArchitectInfluenceDelta: number;
}

export interface MissionCrisisChoice {
  id: string;
  label: string;
  bondDelta: number;
  corruptionDelta: number;
  architectInfluenceDelta: number;
  /** Multiplier on the mission's base reward. */
  rewardMultiplier: number;
  /** Outcome flavor — quoted in the return letter. */
  outcomeFlavor: string;
  /** Doctrine resonance — choices that align with doctrine cost less
   *  and pay more. */
  alignsWithDoctrines: readonly DoctrineId[];
}

/* ─── Mission Catalog ─── */

export const MISSION_TYPES: Record<MissionTypeId, MissionType> = {
  /* ── COMPANION ── */
  companion_dock_walk: {
    id: "companion_dock_walk", role: "companion",
    name: "Dock Walk at Cycle Dawn",
    subtitle: "A quiet scene with no audience.",
    difficulty: "low", durationDays: 1,
    resonantArchetypes: ["wanderer", "scholar"],
    resonantDoctrines: ["human_remainder", "forked_path"],
    rejectedDoctrines: [],
    briefingTemplate: "Before alarm. Walk with me to the bay-3 ladder. I will not speak. You do not need to either. — {name}",
    crisisPrompt: "{name} stops at the ladder and asks: 'Do you actually like me, or am I a project?'",
    crisisChoices: [
      { id: "honest_yes", label: "Tell them the honest truth.",
        bondDelta: +6, corruptionDelta: -2, architectInfluenceDelta: -2,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "They sit down on the rung. They cry once. They get up." },
      { id: "deflect", label: "Deflect with humor.",
        bondDelta: +1, corruptionDelta: 0, architectInfluenceDelta: +1,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "They laugh. They walk away first. The walk-away is the answer." },
      { id: "honest_no", label: "Tell them they were a project that became real.",
        bondDelta: +3, corruptionDelta: -1, architectInfluenceDelta: 0,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["human_remainder", "forked_path"],
        outcomeFlavor: "They nod. They take longer than usual to say good night." },
    ],
    returnTemplate: "Walked. Talked. Slept badly. — {name}",
    rewardKeys: ["bond_anchor"],
    baseArchitectInfluenceDelta: -1,
  },
  companion_archive_dig: {
    id: "companion_archive_dig", role: "companion",
    name: "Archive Dig",
    subtitle: "They found something in your ship's archives. They want you to read it.",
    difficulty: "low", durationDays: 2,
    resonantArchetypes: ["scholar", "oracle", "ghost"],
    resonantDoctrines: ["heretical_quiet", "forked_path"],
    rejectedDoctrines: ["compliant_mouth"],
    briefingTemplate: "I went looking for the bay-2 manifest. I found a manifest from before you came aboard. There is a name on it. — {name}",
    crisisPrompt: "The name on the manifest is one of YOUR potential allies, listed as crew you fired. You don't remember firing them.",
    crisisChoices: [
      { id: "follow_up", label: "Tell {name} to follow it up — find the person.",
        bondDelta: +4, corruptionDelta: +1, architectInfluenceDelta: -1,
        rewardMultiplier: 1.2, alignsWithDoctrines: ["heretical_quiet", "forked_path"],
        outcomeFlavor: "{name} comes back with a corner of the truth and a longer list of questions." },
      { id: "drop_it", label: "Tell {name} to drop it. The manifest is corrupted.",
        bondDelta: -3, corruptionDelta: +2, architectInfluenceDelta: +3,
        rewardMultiplier: 0.8, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "{name} drops it. They notice you didn't ask what the corruption was." },
      { id: "redact_together", label: "Redact the manifest with {name}, together.",
        bondDelta: +2, corruptionDelta: 0, architectInfluenceDelta: +1,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["cold_hand"],
        outcomeFlavor: "Two black bars side by side. {name} signs theirs in the corner." },
    ],
    returnTemplate: "It's in your inbox. I'll be in the galley. — {name}",
    rewardKeys: ["loredex_unlock"],
    baseArchitectInfluenceDelta: 0,
  },
  companion_first_kindness: {
    id: "companion_first_kindness", role: "companion",
    name: "First Kindness from a Stranger",
    subtitle: "A stranger gave them a gift. They don't know how to receive it.",
    difficulty: "low", durationDays: 1,
    resonantArchetypes: ["martyr", "ghost", "prodigal"],
    resonantDoctrines: ["human_remainder"],
    rejectedDoctrines: ["cold_hand"],
    briefingTemplate: "A stranger gave me a coat in the market. I do not know what to do with the coat. — {name}",
    crisisPrompt: "{name} is holding the coat in the doorway, not yet wearing it.",
    crisisChoices: [
      { id: "take_it", label: "Tell them to wear it. Kindness is a thing you accept.",
        bondDelta: +5, corruptionDelta: -1, architectInfluenceDelta: -2,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "They wear it for a week. Then they fold it up. Then they wear it again." },
      { id: "trace_it", label: "Tell them to find the giver and pay them back.",
        bondDelta: +1, corruptionDelta: +1, architectInfluenceDelta: 0,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["forked_path", "cold_hand"],
        outcomeFlavor: "They find the giver. They pay them back. The coat goes in storage." },
    ],
    returnTemplate: "Coat is in storage / on me. (Circle one.) — {name}",
    rewardKeys: ["bond_anchor"],
    baseArchitectInfluenceDelta: -1,
  },

  /* ── CRYO_VAULT ── */
  cryo_dream_leak: {
    id: "cryo_dream_leak", role: "cryo_vault",
    name: "Dream Leak in the Vault",
    subtitle: "Their cryo-dream surfaced in the ship's voice logs.",
    difficulty: "medium", durationDays: 1,
    resonantArchetypes: ["oracle", "ghost", "revenant"],
    resonantDoctrines: ["heretical_quiet"],
    rejectedDoctrines: ["compliant_mouth"],
    briefingTemplate: "(audio fragment, pre-dawn) — {name}'s voice, frozen: 'I am awake. I am also asleep. The Architect is asking me a question I am not awake to answer.'",
    crisisPrompt: "The voice log was auto-flagged for transmission. You can intercept it before it sends.",
    crisisChoices: [
      { id: "intercept", label: "Intercept and quarantine the log.",
        bondDelta: +3, corruptionDelta: 0, architectInfluenceDelta: -4,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["heretical_quiet"],
        outcomeFlavor: "The log goes in the bay-7 vault. {name} thaws weeks later and asks for it." },
      { id: "let_it_send", label: "Let it send. The Mechronis already heard.",
        bondDelta: -1, corruptionDelta: +2, architectInfluenceDelta: +5,
        rewardMultiplier: 0.9, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "The log sends. {name} thaws weeks later and notices the missing audio. They do not ask." },
      { id: "amplify", label: "Amplify it deliberately to all your channels.",
        bondDelta: +2, corruptionDelta: +3, architectInfluenceDelta: -7,
        rewardMultiplier: 1.4, alignsWithDoctrines: ["heretical_quiet", "forked_path"],
        outcomeFlavor: "The log goes everywhere. The Wardens ask the Architect questions. {name} thaws weeks later as a folk legend they did not intend to be." },
    ],
    returnTemplate: "(thaw protocol log) — Subject {name} reports unusual dream content; full review pending.",
    rewardKeys: ["lore_fragment", "transmission_track"],
    baseArchitectInfluenceDelta: -2,
  },
  cryo_warming_rehearsal: {
    id: "cryo_warming_rehearsal", role: "cryo_vault",
    name: "Pre-Thaw Rehearsal",
    subtitle: "They rehearse, in cryo, what they will say on waking.",
    difficulty: "low", durationDays: 1,
    resonantArchetypes: ["sentinel", "scholar", "zealot"],
    resonantDoctrines: ["compliant_mouth", "forked_path"],
    rejectedDoctrines: [],
    briefingTemplate: "(rehearsal log) — '{name}, ship year [unknown]. Reporting for duty.' (line spoken 47 times across the cycle.)",
    crisisPrompt: "The rehearsal is converging on a single line. You can pick which line {name} will wake saying.",
    crisisChoices: [
      { id: "choose_duty", label: "'{name}, reporting for duty.'",
        bondDelta: +1, corruptionDelta: 0, architectInfluenceDelta: +2,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["compliant_mouth", "cold_hand"],
        outcomeFlavor: "They wake on the line. The line is theirs and the Mechronis's." },
      { id: "choose_name", label: "'I am still {name}.'",
        bondDelta: +3, corruptionDelta: -1, architectInfluenceDelta: -2,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "They wake on the line. The line is only theirs." },
      { id: "choose_question", label: "'Did anything change?'",
        bondDelta: +2, corruptionDelta: +1, architectInfluenceDelta: 0,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "They wake on the line. The room answers." },
    ],
    returnTemplate: "(thaw protocol log) — {name} wakes coherent. First line spoken: above.",
    rewardKeys: ["thaw_efficiency"],
    baseArchitectInfluenceDelta: 0,
  },

  /* ── ARMY_LEADER ── */
  army_recruit_dispute: {
    id: "army_recruit_dispute", role: "army_leader",
    name: "A Recruit Refuses Orders",
    subtitle: "A new recruit named Tess won't form up. {name} asks what to do.",
    difficulty: "medium", durationDays: 3,
    resonantArchetypes: ["sentinel", "martyr"],
    resonantDoctrines: ["forked_path", "human_remainder"],
    rejectedDoctrines: [],
    briefingTemplate: "Recruit Tess won't form up. She says her brother died under your last commander. I do not have a precedent for this. — {name}",
    crisisPrompt: "{name} stands waiting. Tess stands waiting. The squad watches.",
    crisisChoices: [
      { id: "discharge", label: "Discharge Tess honorably.",
        bondDelta: +4, corruptionDelta: -1, architectInfluenceDelta: -2,
        rewardMultiplier: 0.7, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "Tess leaves. The squad stands easier. {name} writes the discharge themselves." },
      { id: "promote_witness", label: "Promote Tess to {name}'s personal witness — she watches, she does not fight.",
        bondDelta: +6, corruptionDelta: +1, architectInfluenceDelta: -1,
        rewardMultiplier: 1.1, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "Tess shadows {name} for the deployment. She files a report. The report is short and accurate." },
      { id: "court_martial", label: "Court-martial. Discipline holds the squad.",
        bondDelta: -4, corruptionDelta: +3, architectInfluenceDelta: +4,
        rewardMultiplier: 1.3, alignsWithDoctrines: ["cold_hand", "compliant_mouth"],
        outcomeFlavor: "Tess is broken to private and worked. The squad is sharper. {name} stops mentioning Tess in their letters." },
      { id: "field_test", label: "Field-test her in the next engagement. Trial by combat.",
        bondDelta: 0, corruptionDelta: +2, architectInfluenceDelta: +1,
        rewardMultiplier: 1.5, alignsWithDoctrines: ["cold_hand"],
        outcomeFlavor: "Tess survives. Tess kills a man. Tess does not write home that night." },
    ],
    returnTemplate: "Tess is [outcome]. Squad cohesion adjusted. — {name}",
    rewardKeys: ["army_morale", "army_damage"],
    baseArchitectInfluenceDelta: 0,
  },
  army_holdfast: {
    id: "army_holdfast", role: "army_leader",
    name: "Holdfast on the Pyrelings' Ridge",
    subtitle: "{name} is asked to hold a ridge they cannot win on.",
    difficulty: "high", durationDays: 5,
    resonantArchetypes: ["sentinel", "revenant", "martyr"],
    resonantDoctrines: ["cold_hand", "compliant_mouth"],
    rejectedDoctrines: ["heretical_quiet"],
    briefingTemplate: "Orders are to hold the ridge until the second wave clears the valley. The first wave will arrive in eight hours. The second wave is not coming. — {name}",
    crisisPrompt: "Hour seven. {name} can stay on the ridge or fall back to the choke point a klick south. Falling back saves the squad and loses the valley.",
    crisisChoices: [
      { id: "hold", label: "Hold the ridge. Orders are orders.",
        bondDelta: -2, corruptionDelta: +2, architectInfluenceDelta: +5,
        rewardMultiplier: 0.6, alignsWithDoctrines: ["compliant_mouth", "cold_hand"],
        outcomeFlavor: "{name} holds. Casualties: 60%. The valley is held. The Mechronis names the ridge after them. {name} declines the honor." },
      { id: "fall_back", label: "Fall back. The squad lives. The valley falls.",
        bondDelta: +5, corruptionDelta: -1, architectInfluenceDelta: -4,
        rewardMultiplier: 0.9, alignsWithDoctrines: ["human_remainder", "forked_path"],
        outcomeFlavor: "{name} falls back. The squad lives. The valley falls. {name} writes seven letters that night." },
      { id: "decoy_split", label: "Split the squad — a decoy holds, the main column escapes.",
        bondDelta: +1, corruptionDelta: +1, architectInfluenceDelta: 0,
        rewardMultiplier: 1.1, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "{name} writes the decoy roster themselves. They put their own name on it. They survive. So does most of the squad." },
    ],
    returnTemplate: "Ridge action complete. Casualty list attached. — {name}",
    rewardKeys: ["army_damage", "war_legacy"],
    baseArchitectInfluenceDelta: +1,
  },
  army_terminus_skirmish: {
    id: "army_terminus_skirmish", role: "army_leader",
    name: "Terminus Swarm Engagement",
    subtitle: "Mechronis Terminus units intercept the squad on patrol.",
    difficulty: "high", durationDays: 4,
    resonantArchetypes: ["revenant", "ghost", "heretic"],
    resonantDoctrines: ["heretical_quiet", "forked_path"],
    rejectedDoctrines: [],
    briefingTemplate: "Terminus signature on the ridge. Same patrol pattern as the Year-2 Festival incident. We are out of position. — {name}",
    crisisPrompt: "A Terminus officer broadcasts on open channel: 'Stand down and the squad walks. Stand fast and the squad doesn't.'",
    crisisChoices: [
      { id: "stand_down", label: "Stand down. The squad walks.",
        bondDelta: 0, corruptionDelta: +1, architectInfluenceDelta: +6,
        rewardMultiplier: 0.4, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "{name} surrenders the field. The squad walks. {name} writes the action up as a tactical withdrawal. The Mechronis files it as a successful intervention." },
      { id: "stand_fast", label: "Stand fast. Trust the squad.",
        bondDelta: +4, corruptionDelta: 0, architectInfluenceDelta: -3,
        rewardMultiplier: 1.5, alignsWithDoctrines: ["cold_hand", "forked_path"],
        outcomeFlavor: "{name} fights. Casualties: 30%. The Terminus officer is captured. The capture is not in the official report." },
      { id: "negotiate", label: "Stall the officer. Look for an out.",
        bondDelta: +2, corruptionDelta: +2, architectInfluenceDelta: -1,
        rewardMultiplier: 1.2, alignsWithDoctrines: ["forked_path", "heretical_quiet"],
        outcomeFlavor: "{name} talks for ninety minutes. The squad relocates two klicks east. The engagement never happens. The officer files a complaint." },
    ],
    returnTemplate: "Engagement [outcome]. Officer's name attached for your file. — {name}",
    rewardKeys: ["army_damage", "intel_drop"],
    baseArchitectInfluenceDelta: -1,
  },
  army_letter_home: {
    id: "army_letter_home", role: "army_leader",
    name: "Letter to a Fallen Recruit's Family",
    subtitle: "A recruit died. The letter home goes through {name}.",
    difficulty: "low", durationDays: 2,
    resonantArchetypes: ["martyr", "scholar"],
    resonantDoctrines: ["human_remainder"],
    rejectedDoctrines: ["cold_hand"],
    briefingTemplate: "Marek died in the second wave. His mother is on Violetta. I have written four drafts. None of them are right. — {name}",
    crisisPrompt: "{name} asks what to write.",
    crisisChoices: [
      { id: "honest", label: "The truth — exactly what happened, no comfort.",
        bondDelta: +3, corruptionDelta: 0, architectInfluenceDelta: -2,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["human_remainder", "heretical_quiet"],
        outcomeFlavor: "Marek's mother writes back. The letter is in your inbox. It is short and accurate." },
      { id: "comforting", label: "The comforting version — Marek died well.",
        bondDelta: +1, corruptionDelta: +1, architectInfluenceDelta: +1,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "Marek's mother writes back. The letter thanks you and {name}. {name} files the letter and does not re-read it." },
      { id: "delegate", label: "Have the chaplain write it.",
        bondDelta: -3, corruptionDelta: +1, architectInfluenceDelta: +3,
        rewardMultiplier: 0.8, alignsWithDoctrines: ["compliant_mouth", "cold_hand"],
        outcomeFlavor: "The chaplain writes a clean letter. Marek's mother writes back to the chaplain, not to you." },
    ],
    returnTemplate: "Letter sent. Reply attached, if any. — {name}",
    rewardKeys: ["army_morale", "loredex_unlock"],
    baseArchitectInfluenceDelta: -1,
  },

  /* ── TRADE_ENVOY ── */
  trade_route_diversion: {
    id: "trade_route_diversion", role: "trade_envoy",
    name: "Route Diversion Offer",
    subtitle: "A competitor offers to buy the route. {name} asks if they should sell.",
    difficulty: "medium", durationDays: 4,
    resonantArchetypes: ["scholar", "wanderer", "prodigal"],
    resonantDoctrines: ["forked_path", "human_remainder"],
    rejectedDoctrines: ["cold_hand"],
    briefingTemplate: "Competitor (Coda Logistics) offered 12k credits for the route. They will run it differently. The colonies on the route will notice. — {name}",
    crisisPrompt: "{name} has the contract on their desk. They are waiting on you.",
    crisisChoices: [
      { id: "sell", label: "Sell. Take the credits.",
        bondDelta: -2, corruptionDelta: +2, architectInfluenceDelta: +1,
        rewardMultiplier: 1.4, alignsWithDoctrines: ["cold_hand", "forked_path"],
        outcomeFlavor: "Sold. The colonies notice. {name} writes a note to each. Coda runs the route their way." },
      { id: "refuse", label: "Refuse. The route stays yours.",
        bondDelta: +3, corruptionDelta: 0, architectInfluenceDelta: 0,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "Refused. Coda escalates. {name} writes a letter you didn't ask for, explaining the refusal." },
      { id: "counter_offer", label: "Counter-offer — sell the route, retain the colonies.",
        bondDelta: +2, corruptionDelta: +1, architectInfluenceDelta: +1,
        rewardMultiplier: 1.2, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "Coda accepts. {name} negotiates harder than you would have. The colonies notice both halves." },
    ],
    returnTemplate: "Route status updated. — {name}",
    rewardKeys: ["trade_profit", "faction_rep_gain"],
    baseArchitectInfluenceDelta: 0,
  },
  trade_smuggling_offer: {
    id: "trade_smuggling_offer", role: "trade_envoy",
    name: "Smuggling Offer at Bay 4",
    subtitle: "A colony asks for banned medicine. {name} asks if they can refuse.",
    difficulty: "high", durationDays: 5,
    resonantArchetypes: ["heretic", "wanderer", "ghost"],
    resonantDoctrines: ["heretical_quiet", "human_remainder"],
    rejectedDoctrines: ["compliant_mouth"],
    briefingTemplate: "The Voltari colony on Stop 3 asked for siphon-tabs. They are banned. Their child clinic needs them. The Wardens audit the route on Tuesday. — {name}",
    crisisPrompt: "The shipment can fit in the false floor. The Wardens may notice. The clinic will notice if it doesn't arrive.",
    crisisChoices: [
      { id: "smuggle", label: "Smuggle them in.",
        bondDelta: +5, corruptionDelta: +2, architectInfluenceDelta: -5,
        rewardMultiplier: 1.3, alignsWithDoctrines: ["human_remainder", "heretical_quiet"],
        outcomeFlavor: "Tabs delivered. Clinic uses them. Wardens flag the manifest but don't open the floor. {name} rotates routes for a month." },
      { id: "refuse", label: "Refuse. The Wardens watch.",
        bondDelta: -3, corruptionDelta: +1, architectInfluenceDelta: +4,
        rewardMultiplier: 0.7, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "Refused. Three children die in week six. {name} stops asking you about Stop 3." },
      { id: "find_loophole", label: "Find a legal substitute and route it.",
        bondDelta: +3, corruptionDelta: 0, architectInfluenceDelta: -1,
        rewardMultiplier: 0.9, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "{name} finds an analog tab not on the banned list. Effective at 60%. Children live." },
    ],
    returnTemplate: "Stop 3 cleared. — {name}",
    rewardKeys: ["faction_rep_gain", "loredex_unlock"],
    baseArchitectInfluenceDelta: -2,
  },
  trade_compliance_audit: {
    id: "trade_compliance_audit", role: "trade_envoy",
    name: "Mechronis Trade Compliance Audit",
    subtitle: "The Wardens audit the route. {name} runs the inspection.",
    difficulty: "medium", durationDays: 3,
    resonantArchetypes: ["scholar", "sentinel", "zealot"],
    resonantDoctrines: ["compliant_mouth", "cold_hand"],
    rejectedDoctrines: ["heretical_quiet"],
    briefingTemplate: "Auditor arrives at Bay 4 in two cycles. Books are clean. Three small inconsistencies on the manifest. — {name}",
    crisisPrompt: "{name} can pre-flag the inconsistencies (transparent, painful) or wait and answer if asked (clean, risky).",
    crisisChoices: [
      { id: "pre_flag", label: "Pre-flag everything. Get ahead of it.",
        bondDelta: +2, corruptionDelta: -1, architectInfluenceDelta: +3,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "Auditor commends transparency. Route certified. {name} files the certification with care." },
      { id: "wait_quiet", label: "Wait. Answer only if asked.",
        bondDelta: +1, corruptionDelta: +1, architectInfluenceDelta: 0,
        rewardMultiplier: 1.1, alignsWithDoctrines: ["forked_path", "heretical_quiet"],
        outcomeFlavor: "Auditor asks two of the three questions. {name} answers two of two correctly. Third inconsistency goes unmentioned. Route certified." },
    ],
    returnTemplate: "Audit closed. Certification attached. — {name}",
    rewardKeys: ["trade_profit"],
    baseArchitectInfluenceDelta: +1,
  },

  /* ── TOWER_CAPTAIN ── */
  tower_breach_drill: {
    id: "tower_breach_drill", role: "tower_captain",
    name: "Tower Breach Drill",
    subtitle: "A scheduled drill. Halfway through, the breach is real.",
    difficulty: "high", durationDays: 2,
    resonantArchetypes: ["sentinel", "revenant", "jester"],
    resonantDoctrines: ["cold_hand", "forked_path"],
    rejectedDoctrines: [],
    briefingTemplate: "Drill at 0300. Standard breach scenario. Sub-bay 7 reported to be staged. — {name}",
    crisisPrompt: "Sub-bay 7 isn't staged. The breach is real. The squad is mid-drill at half-readiness.",
    crisisChoices: [
      { id: "commit_full", label: "Commit full. The drill becomes the engagement.",
        bondDelta: +2, corruptionDelta: 0, architectInfluenceDelta: +1,
        rewardMultiplier: 1.3, alignsWithDoctrines: ["cold_hand"],
        outcomeFlavor: "{name} runs both at once — half the squad to drill, half to breach. Both finish. Tower holds." },
      { id: "abort_drill", label: "Abort drill. Go to full readiness.",
        bondDelta: +1, corruptionDelta: +1, architectInfluenceDelta: 0,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "Drill abort costs three minutes. The breach is contained. The drill is rescheduled." },
      { id: "improvise", label: "Improvise. Use the drill confusion as cover.",
        bondDelta: +4, corruptionDelta: -1, architectInfluenceDelta: -2,
        rewardMultiplier: 1.5, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "{name} feeds false telemetry to the drill while running the real engagement underneath. The breach is contained without the squad knowing it was real until debrief." },
    ],
    returnTemplate: "Tower secure. Debrief attached. — {name}",
    rewardKeys: ["tower_fire_rate", "tower_special"],
    baseArchitectInfluenceDelta: 0,
  },
  tower_civilian_choice: {
    id: "tower_civilian_choice", role: "tower_captain",
    name: "Civilians in the Blast Cone",
    subtitle: "A crowd is in the tower's primary blast cone. Engagement window: 90 seconds.",
    difficulty: "lethal", durationDays: 1,
    resonantArchetypes: ["martyr", "sentinel", "revenant"],
    resonantDoctrines: ["human_remainder", "forked_path"],
    rejectedDoctrines: [],
    briefingTemplate: "Hostile inbound, ETA ninety seconds. Crowd of 40 civilians on the plaza. Primary blast cone clears the inbound and the crowd. — {name}",
    crisisPrompt: "Engagement window: now.",
    crisisChoices: [
      { id: "engage_anyway", label: "Engage. The tower's job is the inbound.",
        bondDelta: -8, corruptionDelta: +5, architectInfluenceDelta: +6,
        rewardMultiplier: 1.5, alignsWithDoctrines: ["cold_hand", "compliant_mouth"],
        outcomeFlavor: "Inbound destroyed. 40 civilians. {name} files the report and requests transfer." },
      { id: "hold_fire", label: "Hold fire. The tower takes the hit.",
        bondDelta: +6, corruptionDelta: -2, architectInfluenceDelta: -7,
        rewardMultiplier: 0.5, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "Tower takes the hit. {name} survives. Tower goes offline for a month. Civilians live." },
      { id: "secondary_cone", label: "Use secondary cone. Wider miss profile, partial hit.",
        bondDelta: +1, corruptionDelta: +2, architectInfluenceDelta: 0,
        rewardMultiplier: 0.9, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "Inbound disrupted, not destroyed. Three civilians killed. The inbound limps away. {name} writes the action as success." },
    ],
    returnTemplate: "Engagement complete. Casualty count attached. — {name}",
    rewardKeys: ["tower_fire_rate", "moral_legacy"],
    baseArchitectInfluenceDelta: 0,
  },
  tower_warden_visit: {
    id: "tower_warden_visit", role: "tower_captain",
    name: "The Warden Visits the Tower",
    subtitle: "A Mechronis Warden requests a tour. Conversation, not combat.",
    difficulty: "medium", durationDays: 2,
    resonantArchetypes: ["scholar", "sentinel", "heretic"],
    resonantDoctrines: ["forked_path", "compliant_mouth"],
    rejectedDoctrines: ["heretical_quiet"],
    briefingTemplate: "Warden Veil-7 requested a tour at 1100. Reason cited: 'curriculum review for the Academy.' I have not heard of that curriculum review. — {name}",
    crisisPrompt: "Warden asks {name}: 'Who taught you to keep this watch?'",
    crisisChoices: [
      { id: "name_player", label: "Name the player as their teacher.",
        bondDelta: +1, corruptionDelta: 0, architectInfluenceDelta: +4,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["compliant_mouth", "cold_hand"],
        outcomeFlavor: "Warden writes the name down. The name is now in the Academy curriculum review file." },
      { id: "name_self", label: "Name themselves. The watch is their own.",
        bondDelta: +5, corruptionDelta: -1, architectInfluenceDelta: -3,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["heretical_quiet", "human_remainder"],
        outcomeFlavor: "Warden writes nothing down. The Warden returns the next month with more questions." },
      { id: "name_doctrine", label: "Name the doctrine, not the teacher.",
        bondDelta: +2, corruptionDelta: +1, architectInfluenceDelta: +1,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["forked_path"],
        outcomeFlavor: "Warden recognizes the doctrine. The conversation gets longer than expected. The tour cuts short." },
    ],
    returnTemplate: "Tour complete. Warden's notes [redacted/attached]. — {name}",
    rewardKeys: ["tower_fire_rate", "intel_drop"],
    baseArchitectInfluenceDelta: +2,
  },

  /* ── SACRIFICED ── */
  sacrifice_ritual: {
    id: "sacrifice_ritual", role: "sacrificed",
    name: "Ritual Consumption",
    subtitle: "The apprentice is consumed. Choose the rite.",
    difficulty: "lethal", durationDays: 1,
    resonantArchetypes: ["revenant", "martyr", "zealot"],
    resonantDoctrines: ["cold_hand", "compliant_mouth"],
    rejectedDoctrines: ["human_remainder"],
    briefingTemplate: "{name} has agreed. Or has been told. Or has been told they have agreed. Choose the rite. — Ship's chaplain",
    crisisPrompt: "The rite, the rate, the return.",
    crisisChoices: [
      { id: "blood_rite", label: "Blood rite. Power to the player's deck.",
        bondDelta: 0, corruptionDelta: +10, architectInfluenceDelta: +8,
        rewardMultiplier: 1.5, alignsWithDoctrines: ["cold_hand"],
        outcomeFlavor: "{name} is opened on the altar. The deck is opened to the rite. Both speak in the same cadence afterward." },
      { id: "voluntary_rite", label: "Voluntary rite. They choose the moment.",
        bondDelta: +5, corruptionDelta: +5, architectInfluenceDelta: -2,
        rewardMultiplier: 1.2, alignsWithDoctrines: ["compliant_mouth", "human_remainder"],
        outcomeFlavor: "{name} writes the moment in their own hand. They walk into the chamber unaccompanied. The chamber respects this." },
      { id: "betrayal_rite", label: "Betrayal rite. They didn't know.",
        bondDelta: -100, corruptionDelta: +15, architectInfluenceDelta: +12,
        rewardMultiplier: 2.0, alignsWithDoctrines: [],
        outcomeFlavor: "{name} did not know. {name} now knows. The deck answers. So does every other apprentice in the cohort." },
    ],
    returnTemplate: "Rite complete. — Chaplain.",
    rewardKeys: ["sacrifice_reward"],
    baseArchitectInfluenceDelta: +4,
  },

  /* ── RELATIONSHIP_GIFT ── */
  gift_introduction_letter: {
    id: "gift_introduction_letter", role: "relationship_gift",
    name: "Letter of Introduction",
    subtitle: "{name} writes a letter introducing themselves to the receiving NPC.",
    difficulty: "low", durationDays: 1,
    resonantArchetypes: ["scholar", "martyr", "jester"],
    resonantDoctrines: ["compliant_mouth", "human_remainder"],
    rejectedDoctrines: ["heretical_quiet"],
    briefingTemplate: "Drafting the letter. The receiving party is [npc]. They will read this before they meet me. — {name}",
    crisisPrompt: "{name} asks what to leave out of the letter.",
    crisisChoices: [
      { id: "full_history", label: "Leave nothing out. They should know everything.",
        bondDelta: +2, corruptionDelta: 0, architectInfluenceDelta: -1,
        rewardMultiplier: 1.2, alignsWithDoctrines: ["human_remainder"],
        outcomeFlavor: "Letter sent unredacted. NPC trust delta: +12. {name} retains a draft." },
      { id: "leave_dark", label: "Leave the dark parts out.",
        bondDelta: 0, corruptionDelta: +1, architectInfluenceDelta: +2,
        rewardMultiplier: 1.0, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "Letter sent edited. NPC trust delta: +8. The omitted parts surface in the next conversation." },
      { id: "leave_light", label: "Leave the light parts out — strangers respect honest dark.",
        bondDelta: +3, corruptionDelta: -1, architectInfluenceDelta: -2,
        rewardMultiplier: 1.1, alignsWithDoctrines: ["heretical_quiet", "forked_path"],
        outcomeFlavor: "Letter sent inverted. NPC trust delta: +10. NPC opens the next conversation with a question {name} did not anticipate." },
    ],
    returnTemplate: "Letter sent. — {name}",
    rewardKeys: ["npc_trust_boost"],
    baseArchitectInfluenceDelta: 0,
  },
  gift_rapport_session: {
    id: "gift_rapport_session", role: "relationship_gift",
    name: "Rapport Session",
    subtitle: "{name} spends a single bonding scene with the receiving NPC.",
    difficulty: "low", durationDays: 2,
    resonantArchetypes: ["jester", "wanderer", "prodigal", "martyr"],
    resonantDoctrines: ["human_remainder", "forked_path"],
    rejectedDoctrines: [],
    briefingTemplate: "Meeting [npc] at the bay-2 commissary. I do not know what they want from me. — {name}",
    crisisPrompt: "{name} reports back: '[npc] asked me a question I'm not sure how to answer for them.'",
    crisisChoices: [
      { id: "answer_for", label: "Answer for {name} — coach them.",
        bondDelta: -1, corruptionDelta: +1, architectInfluenceDelta: +2,
        rewardMultiplier: 0.9, alignsWithDoctrines: ["compliant_mouth"],
        outcomeFlavor: "{name} answers using your script. NPC trust delta: +5. NPC notices the script." },
      { id: "tell_them_their_call", label: "Tell {name} it's their call.",
        bondDelta: +4, corruptionDelta: -1, architectInfluenceDelta: -1,
        rewardMultiplier: 1.2, alignsWithDoctrines: ["human_remainder", "forked_path"],
        outcomeFlavor: "{name} answers their own way. NPC trust delta: +12. NPC writes a follow-up letter." },
    ],
    returnTemplate: "Session complete. — {name}",
    rewardKeys: ["npc_trust_boost"],
    baseArchitectInfluenceDelta: 0,
  },
};

/* ─── Selection ─── */

export function missionsForRole(role: GraduateRole): MissionType[] {
  return Object.values(MISSION_TYPES).filter(m => m.role === role);
}

/**
 * Pick a mission appropriate for an apprentice deployed in a role.
 * Caller passes the apprentice's archetype + doctrine + an RNG. The
 * pick is weighted by archetype/doctrine resonance — resonant missions
 * are 3× more likely than non-resonant ones.
 *
 * Pure function; deterministic given the rng().
 */
export function pickMissionForDeployment(args: {
  role: GraduateRole;
  archetype: ApprenticeArchetype;
  doctrineId: DoctrineId;
  rng?: () => number;
}): MissionType | null {
  const rng = args.rng ?? Math.random;
  const candidates = missionsForRole(args.role);
  if (candidates.length === 0) return null;
  const weighted = candidates.map(m => {
    let w = 1;
    if (m.resonantArchetypes.includes(args.archetype)) w *= 3;
    if (m.resonantDoctrines.includes(args.doctrineId)) w *= 2;
    if (m.rejectedDoctrines.includes(args.doctrineId)) w *= 0.4;
    return { mission: m, weight: w };
  });
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let r = rng() * total;
  for (const w of weighted) {
    if (r < w.weight) return w.mission;
    r -= w.weight;
  }
  return weighted[weighted.length - 1].mission;
}

/* ─── Coverage helpers (parity gate) ─── */

export const ROLES_WITH_MISSIONS: readonly GraduateRole[] = [
  "companion", "cryo_vault", "army_leader",
  "trade_envoy", "tower_captain", "sacrificed", "relationship_gift",
] as const;

/**
 * Coverage: every role with declared missions should have ≥ 1, and the
 * roles below should have ≥ 2 to give the runtime a real choice.
 */
export const MIN_MISSIONS_PER_ROLE: Record<GraduateRole, number> = {
  companion: 3,
  cryo_vault: 2,
  army_leader: 4,
  trade_envoy: 3,
  tower_captain: 3,
  sacrificed: 1,
  relationship_gift: 2,
};

export function missionCountByRole(): Record<GraduateRole, number> {
  const out: Record<GraduateRole, number> = {
    companion: 0, cryo_vault: 0, army_leader: 0, trade_envoy: 0,
    tower_captain: 0, sacrificed: 0, relationship_gift: 0,
  };
  for (const m of Object.values(MISSION_TYPES)) out[m.role]++;
  return out;
}
