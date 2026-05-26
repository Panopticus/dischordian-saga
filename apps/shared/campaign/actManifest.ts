/* ═══════════════════════════════════════════════════════
   ACT MANIFEST — declarative per-act surface

   Plan §2.1 (Foundations) #1.

   The shipping client has four ladder pages
   (Act1CardLadderPage.tsx, Act3CardLadderPage.tsx,
   Act6CardLadderPage.tsx, Act7CardLadderPage.tsx) that re-
   implement the same state machine — ladder → matchup
   intro → battle → post-match slideshow → bond deltas +
   flag mutations — three times over with subtle drift.
   Acts 2, 4, 4.5, and 5 ship as siloed interlude pages
   (Act2InterludePage, Act4MatchPage, Act5InterludePage)
   that do not follow the ladder pattern at all;
   Act4MatchPage literally TODOs with "Path not yet
   resolved".

   This module declares the shape that lets every act
   describe itself as data — the eventual unified
   CampaignRunPage will iterate one of these and render the
   right surface. Nothing here imports React, the engine,
   or the client; the manifest is consumed by both the
   server (for reward resolution) and the client (for UI),
   so it lives in shared.

   We deliberately ship the types here BEFORE the unified
   page exists. The Act 1 ladder migration in a follow-up
   PR will be the first consumer; until then this module is
   pure declaration that the existing ladder pages can
   adopt one act at a time.
   ═══════════════════════════════════════════════════════ */

import type { Faction } from "../tcg-core/types/Card";

/** Acts 1–7 plus the optional Act 4.5 "Dead Man's Circuit". */
export const ACT_IDS = [1, 2, 3, "4", "4.5", 5, 6, 7] as const;
export type ActId = 1 | 2 | 3 | "4" | "4.5" | 5 | 6 | 7;

/** How the act's surface should render. Drives which
 *  component the unified CampaignRunPage mounts. */
export type ActSurfaceMode =
  /** Linear list of opponents climbed in order (Act 1 / 3 / 6 / 7). */
  | "ladder"
  /** One scripted encounter — Act 4 "Path not yet resolved" target. */
  | "single"
  /** Branching interlude — flag-resolved next step (Act 2 / 5). */
  | "branching"
  /** Story interlude without a card battle — Act 4.5 narrative beat. */
  | "interlude";

export interface ActOpponent {
  /** Stable id used in encounter rewards + ledger writes. */
  encounterId: string;
  /** Display name. */
  name: string;
  /** LOREDEX entity id, when the opponent maps to a canonical character. */
  loredexEntityId?: string;
  /** Opponent's faction. Drives faction-rep deltas + recognition lines. */
  faction: Faction;
  /** Optional StoryEncounter id (apps/shared/tcg-core/story/encounter.ts). */
  storyEncounterId?: string;
  /** Optional encounter dialog tree id — overrides the act-default
   *  pre/mid/post bank when the encounter has its own branching tree. */
  encounterDialogTreeId?: string;
  /** Pre-battle prose. The matchup screen renders this above the deck
   *  picker. `{if flag}…{else}…{/if}` is honored via renderTemplate. */
  preMatchBlurb?: string;
}

export interface ActSurfaceLadder {
  mode: "ladder";
  /** Climbed in declaration order. */
  opponents: ReadonlyArray<ActOpponent>;
  /** Optional "finale" encounter that unlocks once the ladder is cleared. */
  finale?: ActOpponent;
}

export interface ActSurfaceSingle {
  mode: "single";
  /** The act's one encounter — typically a named boss. */
  encounter: ActOpponent;
}

export interface ActSurfaceBranching {
  mode: "branching";
  /** Each branch declares the flag it activates on. The unified page
   *  picks the first branch whose `requires` flag is set; if none match,
   *  it falls back to `defaultBranch`. */
  branches: ReadonlyArray<{
    requires: string;
    encounter: ActOpponent;
  }>;
  defaultBranch: ActOpponent;
}

export interface ActSurfaceInterlude {
  mode: "interlude";
  /** Dialog tree id rendered without a card match — Act 4.5 narrative. */
  dialogTreeId: string;
}

export type ActSurface =
  | ActSurfaceLadder
  | ActSurfaceSingle
  | ActSurfaceBranching
  | ActSurfaceInterlude;

export interface ActManifest {
  actId: ActId;
  /** Display title — "Act 4: The Path Not Yet Resolved". */
  title: string;
  /** One-line description for hub cards and the campaign atlas. */
  subtitle: string;
  /** Flag that gates entry; null = unconditionally available. */
  unlockFlag: string | null;
  /** Flag minted on completion; consumed by `expansionUnlockService`. */
  completionFlag: string;
  /** Optional flag minted when the act first starts (act_N_started). */
  startFlag?: string;
  /** The act's surface. */
  surface: ActSurface;
  /** Default opponent dialog bank id, used when an `ActOpponent` does not
   *  override with `encounterDialogTreeId`. Matches the existing
   *  `act{N}OpponentDialog.ts` module ids. */
  defaultDialogBankId: string;
}

/** Iterate every opponent surfaced by an act, regardless of mode. Useful
 *  for ledger / reward / parity-check scans. */
export function listManifestOpponents(
  manifest: ActManifest,
): ReadonlyArray<ActOpponent> {
  const out: ActOpponent[] = [];
  switch (manifest.surface.mode) {
    case "ladder":
      out.push(...manifest.surface.opponents);
      if (manifest.surface.finale) out.push(manifest.surface.finale);
      break;
    case "single":
      out.push(manifest.surface.encounter);
      break;
    case "branching":
      out.push(manifest.surface.defaultBranch);
      out.push(...manifest.surface.branches.map((b) => b.encounter));
      break;
    case "interlude":
      // No opponents.
      break;
  }
  return out;
}

/** True iff the manifest declares at least one card-battle encounter.
 *  Interlude-only acts return false. */
export function manifestHasBattles(manifest: ActManifest): boolean {
  return manifest.surface.mode !== "interlude";
}
