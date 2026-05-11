/* ═══════════════════════════════════════════════════════
   MASCOTEER FILES — Era 1 (Project Celebration)

   Four childhood case files the Mascoteer Squad solved at
   Project Celebration. The squad:

     - Vernon Vortex (child) — later Archon Vortex
     - Wanda Wyrlord (child) — later Archon Warlord
     - Wayne Warden (child) — later Archon Warden
     - The Kid (child)       — later the Human

   Plus one unnamed fifth Mascoteer (canonical-but-
   forgotten); see `case_fourth_mascoteer`. The fifth is
   NOT Senator Elara Voss — she belongs to Era 2 (the
   Watcher's Eyes betrayal). The fifth is the first
   person the Human ever betrayed; his amnesia about that
   case is repression, not memory loss.

   Each case is surfaced through an existing hotspot in a
   shipped room mystery module. Reading a case unlocks a
   Loredex entry and (in three of the four cases) a
   three-band closing narration in the Human's Detective
   register.

   Voice register (closing narration):
     - First-person ("I"), past tense.
     - The Human as the adult Detective looking back at
       his own childhood.
     - Three bands: shadow / balanced / warm. Match
       humanLines.ts conventions.

   Pure module. No React. No server imports.
   ═══════════════════════════════════════════════════════ */

import type { RoomId } from "./detectiveCommentary";

export type MascoteerId =
  | "vernon_vortex"
  | "wanda_wyrlord"
  | "wayne_warden"
  | "the_kid";

/** Three-band closing narration. Lands once the player has
 *  unlocked every evidence beat in a case. The fourth case
 *  has `closing: null` — it is the unsolved case. */
export interface MascoteerClosingNarration {
  shadow: string;
  balanced: string;
  warm: string;
}

export interface MascoteerFile {
  /** Stable id. */
  caseId: string;
  /** Display title, in-voice. */
  title: string;
  /** Which kids worked the case. */
  mascoteers: ReadonlyArray<MascoteerId>;
  /** 3–5 evidence beats in canonical order. Each is a short
   *  Detective-voice sentence the player reads as they unlock
   *  the case. */
  evidenceChain: ReadonlyArray<string>;
  /** Three-band closing narration. `null` for the open case. */
  closing: MascoteerClosingNarration | null;
  /** Which hotspot in which room surfaces the case. Must
   *  reference a real hotspot in the matching room mystery
   *  module. The parity check verifies this. */
  surfaceLocation: {
    roomId: RoomId;
    hotspotId: string;
  };
  /** Loredex entry unlocked on case-complete. */
  unlockLoredexEntry: string;
  /** Manifest VO id. */
  voId: string;
}

export const MASCOTEER_FILES: ReadonlyArray<MascoteerFile> = [
  /* ─── 1. The Case of the Stolen Lunch Pail ─── */
  {
    caseId: "case_lunch_pail",
    title: "The Case of the Stolen Lunch Pail",
    mascoteers: ["vernon_vortex", "the_kid"],
    evidenceChain: [
      "Forty-three lunch pails went missing in seven days.",
      "Vernon thought the thief was another kid — he had a list of suspects by lunch four.",
      "The kid noticed every missing pail belonged to a kid whose name was also fading from the dorm rolls.",
      "It wasn't theft. A Celebration administrator was scrubbing forty-three names from the rolls and the pails were the easiest evidence to make disappear.",
      "Vernon punched the administrator. The kid wrote the case up. The administrator transferred two weeks later.",
    ],
    closing: {
      shadow:
        "Forty-three names. We thought we had stopped him. He came back to it later. They always come back to it later.",
      balanced:
        "Vernon punched the administrator. I wrote the case up. Neither of us understood what we'd actually witnessed for another two centuries. Forty-three is the count Project Celebration ended on. The names were the same names.",
      warm:
        "Vernon hit harder than a twelve-year-old should have been able to. I think he had already, at twelve, decided he was going to be the kind of adult who hit administrators. I wrote it up cleaner than I needed to. We both already knew, on the night of, that the punch was the case's truest answer. We were never going to be the kind of grown-ups who only wrote.",
    },
    surfaceLocation: {
      roomId: "cargo_hold",
      hotspotId: "rubber-chicken",
    },
    unlockLoredexEntry: "mascoteer_case_lunch_pail",
    voId: "mascoteer.case_lunch_pail",
  },

  /* ─── 2. The Case of the Workshop That Wobbled ─── */
  {
    caseId: "case_uneven_anvil",
    title: "The Case of the Workshop That Wobbled",
    mascoteers: ["wanda_wyrlord", "the_kid"],
    evidenceChain: [
      "Wanda's first forge had a wobble nobody could fix.",
      "The kid measured the wobble against a plumb line on three different days; the wobble was identical each time.",
      "Identical wobbles aren't faults — they're calibrations.",
      "Wanda was calibrating the wobble on purpose. The wobble was how she told when someone was lying to her.",
    ],
    closing: {
      shadow:
        "She still does it. The whole Chaos Forge wobbles. The wobble is still the case. She still listens to it the same way she did at twelve.",
      balanced:
        "Wanda kept the calibration into adulthood. The Chaos Forge itself is the same lie-detector, scaled up. She never told anyone except me, and she made me swear at twelve, and I have kept the secret for two centuries. I am keeping it now, as I tell you, because telling you does not change that she trusts I will not put it in a report.",
      warm:
        "She showed me the trick because I had asked the right question — the third one, after she had refused the first two. She said she had never told anyone. At twelve I was proud of being the one she told. I am, embarrassingly, still proud of it. She is now an Archon. The pride scales.",
    },
    surfaceLocation: {
      roomId: "chaos_forge",
      hotspotId: "chaos-anvil",
    },
    unlockLoredexEntry: "mascoteer_case_uneven_anvil",
    voId: "mascoteer.case_uneven_anvil",
  },

  /* ─── 3. The Case of the Missing Wednesday ─── */
  {
    caseId: "case_audit_gap",
    title: "The Case of the Missing Wednesday",
    mascoteers: ["wayne_warden", "the_kid"],
    evidenceChain: [
      "Wayne's grandfather had been a Warden; the family audit ledger was complete back four generations.",
      "Every seven cycles a Wednesday went missing from the ledger.",
      "Wayne thought it was a clerical error. The kid added up the missing Wednesdays.",
      "They added to one full day per Archon-cycle — the day the Authority votes on whether to keep its own seat.",
      "Wayne stopped auditing the family ledger the night we worked that out. He was twelve.",
    ],
    closing: {
      shadow:
        "Wayne never audited again. He audits everything else. Just not the family ledger. He told me later it was because he was afraid of what the next cycle's Wednesday would say.",
      balanced:
        "Wayne told me later he stopped auditing because of what we found that summer. He was twelve. So was I. The Authority votes on keeping its own seat once per Archon-cycle, on a Wednesday it never enters into the public record. That is, in the end, the whole shape of the case. We were the only two who knew.",
      warm:
        "He told me, when we were both grown, that he had thought about reopening the audit several times. He never did. He said he wanted to keep that one untouched the way some people keep a childhood bedroom — not because it was good, but because the version of him in it was someone he wanted to be able to remember being.",
    },
    surfaceLocation: {
      roomId: "order_tribunal",
      hotspotId: "mol-vereth-audit-ledger",
    },
    unlockLoredexEntry: "mascoteer_case_audit_gap",
    voId: "mascoteer.case_audit_gap",
  },

  /* ─── 4. The Case That Was Never Filed ─── */
  {
    caseId: "case_fourth_mascoteer",
    title: "The Case That Was Never Filed",
    mascoteers: ["vernon_vortex", "wanda_wyrlord", "wayne_warden", "the_kid"],
    evidenceChain: [
      "There was a fifth kid in the squad once.",
      "Vernon thinks the kid moved away. Wanda thinks the kid died. Wayne thinks the kid never existed.",
      "The narrator does not say what the narrator thinks.",
    ],
    closing: null,
    surfaceLocation: {
      roomId: "cipher_den",
      hotspotId: "dictionary-of-edits",
    },
    unlockLoredexEntry: "mascoteer_case_fourth_mascoteer",
    voId: "mascoteer.case_fourth_mascoteer",
  },
] as const;

/** Look up a case by id. Returns undefined when unknown. */
export function getMascoteerFile(caseId: string): MascoteerFile | undefined {
  return MASCOTEER_FILES.find((f) => f.caseId === caseId);
}

/** Every case file surfaced at the given room. Empty array
 *  when no case is wired there. */
export function mascoteerFilesForRoom(
  roomId: RoomId,
): ReadonlyArray<MascoteerFile> {
  return MASCOTEER_FILES.filter((f) => f.surfaceLocation.roomId === roomId);
}

/** Sentinel — the four canonical Mascoteer ids. Parity
 *  checks against authoring drift (e.g. a new id silently
 *  introduced that the lore bible doesn't know about). */
export const CANONICAL_MASCOTEERS: ReadonlyArray<MascoteerId> = [
  "vernon_vortex",
  "wanda_wyrlord",
  "wayne_warden",
  "the_kid",
];
