/* ═══════════════════════════════════════════════════════
   FACTION ALLEGIANCE VOICES — Per-Faction Tutorial Speakers

   The allegiances tutorial gates (mechanicTutorialGates.ts)
   currently route through Locke as the generic bond-ledger
   keeper. Locke is the right choice for the META lesson — what
   pledging means structurally — but each of the eight canonical
   factions has its own leader, voice, and reason to want you.
   When the player has chosen a faction (or is about to), the
   runtime should swap Locke's generic line for the faction-
   leader's bespoke pitch.

   This module is the data layer. Per-faction voicing for:

     DEMAGI:
       - The Elemental Assembly       — Council Speaker Thael-Vo
       - The Warden's Vanguard        — Commander Seris-Fen
       - The Resonance Order          — Dr. Mira Loth
       - The Pure Flame Brotherhood   — Arch-Burner Vel  (extremist)

     QUARCHON:
       - The Quarchon Accord          — Architect-Prime Zyn-7
       - The Dimensional Guard        — General Axis-9
       - The Real-Instance Theorists  — Theorist Praxis-4
       - The First Pattern            — The Architect's Echo  (extremist)

   Each entry follows the writing-card discipline (Hope / Goal /
   Plan / Voice — see plan §1) plus the bespoke first-contact
   line a leader would deliver when a Potential first signals
   intent to pledge.

   Consumers:
     - mechanicTutorialGates.ts — runtime overlay can swap
       Locke's line for the leader's when state names a faction
     - per-faction onboarding cinematics (future)
   ═══════════════════════════════════════════════════════ */

import type { PotentialFactionId } from "./potentialFactions";

export interface FactionAllegianceVoice {
  readonly factionId: PotentialFactionId;
  readonly leaderName: string;
  /** Hope / Goal / Plan triplet — writing-card style. */
  readonly hope: string;
  readonly goal: string;
  readonly plan: string;
  /** Voice fingerprint (3-5 short tics). */
  readonly voiceFingerprint: string;
  /** Forbidden register — what the leader would NEVER sound like. */
  readonly forbiddenRegister: string;
  /** First-contact line when a Potential signals intent to pledge. */
  readonly firstContactLine: string;
  /** Single-sentence pitch the runtime can swap into the allegiances tutor. */
  readonly tutorialPitch: string;
}

export const FACTION_ALLEGIANCE_VOICES: readonly FactionAllegianceVoice[] = [
  /* ─── DEMAGI ─── */
  {
    factionId: "demagi_assembly",
    leaderName: "Council Speaker Thael-Vo",
    hope: "That deliberation outlives the war.",
    goal: "Convince a Potential to vote, not enlist.",
    plan: "Speak slowly. Lay every argument flat. Trust the listener to do the math.",
    voiceFingerprint: "Measured · long sentences · 'consider' more than 'commit' · pauses where others hurry.",
    forbiddenRegister: "Urgent. The Assembly does not RECRUIT — it INVITES.",
    firstContactLine:
      "Potential. The Assembly does not require an oath today. Sit. Read the platform. Disagree if you find a place to disagree. The vote is open until you close it.",
    tutorialPitch:
      "Consider the Elemental Assembly. Pledge is a vote, not an oath. We honor the pivot — we are sometimes the pivot.",
  },
  {
    factionId: "demagi_wardens",
    leaderName: "Commander Seris-Fen",
    hope: "That the people she's sworn to protect outnumber the ones she's lost.",
    goal: "Find the Potential who will hold the line at the Panopticon Ruins.",
    plan: "Brief. Honest. Show the cost up front. Refuse no one — but warn everyone.",
    voiceFingerprint: "Clipped · cadenced like orders softened for civilians · 'we lost' more often than 'we held'.",
    forbiddenRegister: "Glory. Recruitment posters bore her.",
    firstContactLine:
      "Potential. Vanguard duty is unglamorous. The pay is acceptable. The people you'll defend will not, mostly, learn your name. If that matches what you came here for, take the form.",
    tutorialPitch:
      "Pledge the Warden's Vanguard if you'd rather hold a line than write a speech. We bury our own.",
  },
  {
    factionId: "demagi_resonance",
    leaderName: "Dr. Mira Loth",
    hope: "That her field theory finally explains why some Potentials hum and others don't.",
    goal: "Recruit a research subject who consents fully and understands the cost.",
    plan: "Walk through the methodology once. Ask three diagnostic questions. Trust the answers.",
    voiceFingerprint: "Curious · footnoted aloud · interrupts herself to refine a term · genuine in her thanks.",
    forbiddenRegister: "Recruitment-pamphlet. She is a scientist, not a marketer.",
    firstContactLine:
      "Hello. Sorry — I know the Assembly's pitch was warmer. I'm not warm. I'm careful. Pledge here only if you want to be measured. I can be very gentle about the measuring; I cannot be careless about it.",
    tutorialPitch:
      "Pledge the Resonance Order if you want to be studied with consent and care. We document everything. You get the reports.",
  },
  {
    factionId: "demagi_pureflame",
    leaderName: "Arch-Burner Vel",
    hope: "That a Potential bright enough to scare him takes the oath anyway.",
    goal: "Test whether the Potential burns hot enough to be useful.",
    plan: "Demand intensity. Forgive nothing. Promise less.",
    voiceFingerprint: "Zealous · short hot sentences · 'burn' as a verb of approval · no laughter on record.",
    forbiddenRegister: "Apologetic. The Pure Flame does not apologize. Vel knows this is a flaw.",
    firstContactLine:
      "Potential. The Pure Flame is not a faction. It is a temperature. If you cannot reach the temperature you should pledge elsewhere — that is a kindness to you and to me. If you can, sign in your own ash.",
    tutorialPitch:
      "Pledge the Pure Flame only if you have already burned for something. We do not teach the burning.",
  },
  /* ─── QUARCHON ─── */
  {
    factionId: "quarchon_accord",
    leaderName: "Architect-Prime Zyn-7",
    hope: "That the Accord's architecture survives the Architect's design.",
    goal: "Bring a Potential whose probability traces well into the Accord's ledger.",
    plan: "State the quantitative case. Provide the supporting figures. Wait.",
    voiceFingerprint: "Precise · cites probability fields by index · 'plausible' is high praise · concise.",
    forbiddenRegister: "Florid. The Accord's beauty is in arithmetic, not adjective.",
    firstContactLine:
      "Potential. Your trace reads at p=0.83 for our cohort. We do not pressure people whose probability is already telling the story. Pledge or do not. Either is informative.",
    tutorialPitch:
      "Pledge the Quarchon Accord if you trust math more than rhetoric. We will show you the figures.",
  },
  {
    factionId: "quarchon_dimguard",
    leaderName: "General Axis-9",
    hope: "That the dimensional incursions stop at the line he is paid to hold.",
    goal: "Acquire a Potential capable of sustained vigilance.",
    plan: "Test endurance. Reward calm. Mistrust enthusiasm.",
    voiceFingerprint: "Spare · tactical · 'sustain' more than 'attack' · approvals are nods, not words.",
    forbiddenRegister: "Heroic. The Dim Guard does not perform; it watches.",
    firstContactLine:
      "Potential. The Dimensional Guard does not need volunteers. We need shifts. Pledge if you can hold a watch through the third hour. Most cannot. There is no shame in finding out.",
    tutorialPitch:
      "Pledge the Dimensional Guard if your strength is patience. We will trust you with the third hour.",
  },
  {
    factionId: "quarchon_realinst",
    leaderName: "Theorist Praxis-4",
    hope: "That the next instance survives the test the last one didn't.",
    goal: "Onboard a Potential who can think across instances without losing themselves.",
    plan: "Pose one paradox. Listen to the answer. Pose the next paradox.",
    voiceFingerprint: "Recursive · questions answered with questions · enjoys being wrong out loud · footnotes everything.",
    forbiddenRegister: "Decisive. Praxis-4 is not the deciding voice in a room and will not pretend to be.",
    firstContactLine:
      "Potential. Consider: your pledge is also a fact about the instance you have not yet inhabited. We theorize about that fact. Pledge if the recursion does not exhaust you. Mine does.",
    tutorialPitch:
      "Pledge the Real-Instance Theorists if you are willing to be wrong as a hobby. We will footnote your error gently.",
  },
  {
    factionId: "quarchon_firstpattern",
    leaderName: "The Architect's Echo",
    hope: "That the original pattern, however cruel, holds.",
    goal: "Bind a Potential to the unrevised design.",
    plan: "Speak only what the Architect would have said. No improvisation.",
    voiceFingerprint: "Cold · canned · the Architect's vocabulary in echo form · never deviates from script.",
    forbiddenRegister: "Original. The Echo does not invent.",
    firstContactLine:
      "Designate: Potential. The First Pattern requests pledge. Variant tolerance: zero. Decline is logged. Acceptance is logged. Either is acceptable to the design.",
    tutorialPitch:
      "Pledge the First Pattern only if you intend to vanish into the design. There is no individual learning here. The pattern was correct the first time.",
  },
];

const VOICE_INDEX: ReadonlyMap<PotentialFactionId, FactionAllegianceVoice> = new Map(
  FACTION_ALLEGIANCE_VOICES.map((v) => [v.factionId, v]),
);

export function getFactionVoice(
  factionId: PotentialFactionId,
): FactionAllegianceVoice | undefined {
  return VOICE_INDEX.get(factionId);
}

/**
 * Resolve the tutor pitch for the player's currently-selected faction.
 * Falls back to undefined when no faction is selected; callers should
 * use Locke's generic line in that case.
 */
export function resolveAllegianceTutorPitch(
  factionId: PotentialFactionId | undefined,
): string | undefined {
  if (!factionId) return undefined;
  return getFactionVoice(factionId)?.tutorialPitch;
}
