/* ═══════════════════════════════════════════════════════
   APPENDIX B DATA SHELL — Kael Asynchronous Questline +
   Terminus Swarm integration.

   Encodes the Appendix B questline tree as typed data:

     B.0  The Thesis
     B.1  Why Terminus Swarm Is the Perfect Vehicle
     B.2  The Reverse Chronology
     B.3  The Six Fragments (canonical wave unlocks)
     B.4  Tower Lore — every class tower is an Insurgent
     B.5  The Ripple Engine (six new ripple event types)
     B.6  Year One Events Calendar ripple effect
     B.7  Canonical systems swept into the questline
     B.8  Three payoff cinematics
     B.9  Production prompts (referenced, not duplicated)
     B.10 Cost estimate (documented only)

   This is a data SHELL. No gameplay changes. The shell
   exists so the six Fragment runners, the tower-memorial
   hover tooltips, the new ripple event types, and the
   three payoff cinematics all have canonical ids to
   reference when their systems ship.
   ═══════════════════════════════════════════════════════ */

/* ─── B.3 SIX FRAGMENTS ─── */

export type KaelFragmentId = "f1" | "f2" | "f3" | "f4" | "f5" | "f6";

export interface KaelFragment {
  id: KaelFragmentId;
  /** §B.3 numbered order (1-6). */
  order: number;
  title: string;
  /** Which existing system gates the unlock. */
  unlockSystem: string;
  /** Condition the player must satisfy. */
  unlockCondition: string;
  /** Single-sentence summary of what the player learns. */
  whatPlayerLearns: string;
  /** Which ripple event type this Fragment emits. */
  rippleEvent: string;
  /** Flag raised on unlock. */
  flag: string;
}

export const KAEL_FRAGMENTS: readonly KaelFragment[] = [
  {
    id: "f1",
    order: 1,
    title: "What You Are Fighting",
    unlockSystem: "terminus_swarm_wave_10",
    unlockCondition: "Complete Terminus Swarm Wave 10 for the first time.",
    whatPlayerLearns:
      "Slowed by an Oracle Spire, the Source Avatar's face flickers to a broken, tattooed, prosthetic-armed man. The Human goes silent for one room.",
    rippleEvent: "kael_mirror_seen",
    flag: "kael_fragment_f1_unlocked",
  },
  {
    id: "f2",
    order: 2,
    title: "The Recorded Voice",
    unlockSystem: "comms_array_idle_watcher",
    unlockCondition:
      "Leave the Ark idle with Comms Array open for 30 real-world minutes while Elara is dismissed (Human active).",
    whatPlayerLearns:
      "A corrupted audio file surfaces. Kael's voice before any of it: the old Insurgency recruitment code.",
    rippleEvent: "kael_fragment_unlocked",
    flag: "kael_fragment_f2_unlocked",
  },
  {
    id: "f3",
    order: 3,
    title: "The Theft Route",
    unlockSystem: "trade_empire_panopticon_ruins",
    unlockCondition:
      "Run 6 Trade Empire missions into the `panopticon_ruins` sector.",
    whatPlayerLearns:
      "The flight log matches Kael's original escape route. The Ark navigation computer remembered it without being told. The ship has been reliving the theft whenever nobody looks.",
    rippleEvent: "kael_fragment_unlocked",
    flag: "kael_fragment_f3_unlocked",
  },
  {
    id: "f4",
    order: 4,
    title: "The Tunnels",
    unlockSystem: "substrate_dungeon",
    unlockCondition:
      "Clear any Substrate Dungeon run with The Human as the active companion.",
    whatPlayerLearns:
      "Maintenance tunnels that don't exist on any blueprint, carved by something coming from the other direction. The Human says: 'He was here. He's been coming back for the other one.'",
    rippleEvent: "kael_fragment_unlocked",
    flag: "kael_fragment_f4_unlocked",
  },
  {
    id: "f5",
    order: 5,
    title: "The Apprentice Who Ran",
    unlockSystem: "celebration_trial_apprentice_betrayal",
    unlockCondition:
      "Reach Day 20 of the 28-day Celebration Trial with any Apprentice bond ≥ 40, then trigger an Apprentice Betrayal event.",
    whatPlayerLearns:
      "The Apprentice faces Kael's exact choice: leave the friend for the zombies or stay and die with them. Either choice has a permanent mechanical consequence.",
    rippleEvent: "kael_apprentice_choice",
    flag: "kael_fragment_f5_unlocked",
  },
  {
    id: "f6",
    order: 6,
    title: "The Recruiter's Pamphlet",
    unlockSystem: "act_1_cycle_b_complete_light",
    unlockCondition:
      "Complete Act 1 Card Game Cycle B with a full Light meter reading.",
    whatPlayerLearns:
      "A new Loredex entry: The Recruiter. A single pamphlet. His wife. His child. His real name, visible exactly ONCE and then gone forever. Both narrators go silent for 24 real hours after.",
    rippleEvent: "kael_name_spoken",
    flag: "kael_fragment_f6_unlocked",
  },
];

/* ─── B.4 TOWER MEMORIALS ─── */

export interface KaelTowerMemorial {
  /** Existing shared/towerDefense.ts TowerDef key. */
  towerKey: string;
  /** Which Insurgent this tower memorializes. */
  memorialTo: string;
  /** One-line hover inscription that appears in build mode after F2. */
  inscription: string;
}

export const KAEL_TOWER_MEMORIALS: readonly KaelTowerMemorial[] = [
  {
    towerKey: "artillery_cannon",
    memorialTo: "Iron Lion",
    inscription:
      "He broke the line so the others could cross. We fire where he fell.",
  },
  {
    towerKey: "tesla_coil",
    memorialTo: "The Engineer (before the Warlord's vessel)",
    inscription:
      "He could make a lightning storm out of a prison baton. He made three.",
  },
  {
    towerKey: "oracle_spire",
    memorialTo: "The Oracle (before the White Oracle)",
    inscription: "She said don't trust the quiet one. He did. She was right.",
  },
  {
    towerKey: "shadow_trap",
    memorialTo: "The Eyes (posthumous trap)",
    inscription:
      "I built this for her. It never went off. I still check it every night.",
  },
  {
    towerKey: "venom_spire",
    memorialTo: "The Recruiter's first agent (name lost)",
    inscription: "We never wrote her name down. We knew the Watcher was listening.",
  },
  {
    towerKey: "artillery_cannon_prestige",
    memorialTo: "The full Insurgency dead, aggregated",
    inscription: "For the forty-three I can still name.",
  },
  {
    towerKey: "void_rift",
    memorialTo: "The CoNexus",
    inscription:
      "The same door that made this ship also made the Swarm. We cannot seal one without sealing both.",
  },
  {
    towerKey: "shadow_obelisk",
    memorialTo: "The dead sector behind the Dreamer's Shield",
    inscription: "A door that opens outward and will never open back.",
  },
  {
    towerKey: "healing_pylon",
    memorialTo: "Kael's wife (unmarked)",
    inscription:
      "(There is no inscription on this tower. There is only a single flower engraved on its base. The player can click it. Nothing happens. That is the point.)",
  },
];

/** Apprentice-who-stayed bonus tower unlocked after F5. */
export const APPRENTICE_STAND_TOWER = {
  towerKey: "apprentices_stand",
  sacrificial: true,
  inscriptionTemplate: "[Apprentice's chosen name]. Who did not run.",
  oncePerAccountEver: true,
};

/* ─── B.5 NEW RIPPLE EVENT TYPES ─── */

export const KAEL_RIPPLE_EVENT_TYPES: readonly string[] = [
  "kael_fragment_unlocked",
  "kael_mirror_seen",
  "kael_name_spoken",
  "kael_memorial_noticed",
  "kael_apprentice_choice",
  "kael_questline_complete",
];

/* ─── B.8 THREE PAYOFF CINEMATICS ─── */

export interface KaelPayoffCinematic {
  id: "bd1" | "bd2" | "bd3";
  /** §B.8 title. */
  title: string;
  /** Narrative purpose. */
  purpose: string;
  /** Flag raised when it plays. */
  flag: string;
}

export const KAEL_PAYOFF_CINEMATICS: readonly KaelPayoffCinematic[] = [
  {
    id: "bd1",
    title: "The Name Out Loud",
    purpose:
      "Fires after F6 when both narrators first speak Kael's real name within 48 real hours. A three-voice scene: Elara, The Human, and Kael himself, overlapping.",
    flag: "kael_cinematic_name_out_loud_seen",
  },
  {
    id: "bd2",
    title: "The Apprentice's Stand",
    purpose:
      "Fires the first time the Apprentice's Stand tower is built. The Apprentice's chosen name is read aloud by both narrators in unison.",
    flag: "kael_cinematic_apprentices_stand_seen",
  },
  {
    id: "bd3",
    title: "The Man Who Came Back",
    purpose:
      "Fires at kael_questline_complete. Kael's face is restored to the Source Avatar one last time; the Avatar bows its head and the Terminus Swarm pauses for a full real minute. The Ark crew sees it from the Observation Deck.",
    flag: "kael_cinematic_came_back_seen",
  },
];

/* ─── B.6 YEAR ONE CALENDAR RIPPLE EFFECT (summary) ─── */

export interface YearOneRipple {
  fragmentId: KaelFragmentId;
  calendarBeat: string;
}

export const YEAR_ONE_RIPPLES: readonly YearOneRipple[] = [
  { fragmentId: "f1", calendarBeat: "Orb of Worlds logs 'a face beneath a face'." },
  { fragmentId: "f2", calendarBeat: "Comms record loops a dead recruitment broadcast." },
  { fragmentId: "f3", calendarBeat: "Panopticon Ruins show a new charted route." },
  { fragmentId: "f4", calendarBeat: "Substrate tunnels added to the Ark blueprints." },
  {
    fragmentId: "f5",
    calendarBeat:
      "Apprentice's decision is logged in the Chronicle as a parallel to Kael's original choice.",
  },
  {
    fragmentId: "f6",
    calendarBeat:
      "The Recruiter's real name is logged exactly once, then redacted from the Chronicle by Lyra Vox.",
  },
];

/* ─── LOOKUP HELPERS ─── */

export function listKaelFragments(): readonly KaelFragment[] {
  return KAEL_FRAGMENTS;
}

export function getKaelFragment(id: KaelFragmentId): KaelFragment | undefined {
  return KAEL_FRAGMENTS.find((f) => f.id === id);
}

export function listKaelTowerMemorials(): readonly KaelTowerMemorial[] {
  return KAEL_TOWER_MEMORIALS;
}

/**
 * Tower-build-mode hover tooltip: returns the Insurgent
 * inscription for `towerKey` IFF Fragment F2 ("The Recorded
 * Voice") has been unlocked. Before F2, towers look like
 * ordinary hardware. After F2, every memorial hover raises
 * `kael_memorial_noticed` and builds toward F6.
 */
export function getKaelTowerInscription(
  towerKey: string,
  flags: Record<string, unknown>,
): string | null {
  if (!flags.kael_fragment_f2_unlocked) return null;
  const memorial = KAEL_TOWER_MEMORIALS.find((m) => m.towerKey === towerKey);
  return memorial?.inscription ?? null;
}

/**
 * Look up a memorial entry by tower key regardless of whether
 * F2 is unlocked yet. Used by the Trophy Room Witnessing Wall
 * and test suites that need the raw data.
 */
export function getKaelTowerMemorial(
  towerKey: string,
): KaelTowerMemorial | undefined {
  return KAEL_TOWER_MEMORIALS.find((m) => m.towerKey === towerKey);
}

export function listKaelPayoffCinematics(): readonly KaelPayoffCinematic[] {
  return KAEL_PAYOFF_CINEMATICS;
}

/**
 * Which payoff cinematic (if any) should trigger right now?
 * Returns the cinematic id + its flag, or null if none is due.
 *
 *   bd1 — fires after F6 and both narrators first speak Kael's
 *         real name within 48 real hours.
 *   bd2 — fires the first time Apprentice's Stand is built.
 *   bd3 — fires at kael_questline_complete.
 */
export function getPendingKaelPayoffCinematic(
  flags: Record<string, unknown>,
): KaelPayoffCinematic | null {
  for (const cine of KAEL_PAYOFF_CINEMATICS) {
    if (flags[cine.flag]) continue;
    if (cine.id === "bd1") {
      if (
        flags.kael_fragment_f6_unlocked &&
        flags.kael_name_spoken_by_elara &&
        flags.kael_name_spoken_by_human
      ) {
        return cine;
      }
    } else if (cine.id === "bd2") {
      if (flags.apprentices_stand_built) return cine;
    } else if (cine.id === "bd3") {
      if (flags.kael_questline_complete) return cine;
    }
  }
  return null;
}
