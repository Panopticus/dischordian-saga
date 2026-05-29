/* ═══════════════════════════════════════════════════════
   APPLY DIALOG CHOICE — pure resolver

   Plan §"BioWare-Style Dialog Design".

   When the player commits a choice in an `NpcDialogTree`,
   four families of outcome can fire:

     1. A narrative flag write (`sets`).
     2. A faction reputation delta (`factionRepDelta`).
     3. A stakes-axis delta (`stakesAxisDelta`).
     4. A card unlock or future-deck mutation
        (`unlockCard`, `mutateNextEncounterDeck`).

   Plus the legacy fields already supported by the dialog
   tree system: `trustDelta`, `publicFlag`, `axisDelta`.

   This module does NOT mutate anything. It folds the
   choice into a typed `OutcomeBundle` that the calling
   runner (server-side for persistence, client-side for
   optimistic UI) forwards to the right subsystem:

     • flag writes  →  `setNarrativeFlag()`
     • faction rep  →  server `applyFactionReputationDelta()`
     • stakes axis  →  StoryEncounter's stakesMode reducer
     • card unlock  →  expansionUnlockService writer
     • deck mutate  →  StoryEncounter.bossDeckResolver

   Keeping the resolver pure means:
     • the client can render an optimistic outcome preview
       (Plan §6 Stakes Preview) without round-tripping;
     • the server can replay the choice deterministically;
     • the Campaign Ledger UI can read the bundle as the
       "this is what changed when you committed this
       choice" caption.

   Pure module — no I/O, no React, no engine state.
   ═══════════════════════════════════════════════════════ */

import type { NpcDialogChoice } from "../npcs/dialogTrees/types";
import type { NpcKey } from "../npcs/types";
import type { Faction } from "../tcg-core/types/Card";

/** A flag-write intent. The caller maps this to whichever
 *  flag-writer it owns — `setNarrativeFlag` on the server,
 *  `useDialogRunner` optimistic state on the client. */
export interface FlagWrite {
  flag: string;
  /** Whether this write is "public" (cross-NPC) or "private" (per-NPC). */
  scope: "narrative" | "npc_public";
}

/** A trust delta against the NPC the choice is delivered to. The
 *  caller is responsible for knowing which NPC owns the tree. */
export interface TrustWrite {
  delta: number;
}

/** A signed delta against a player-aggregated axis (the `axisDelta`
 *  field on the existing schema). Forwarded to the axis aggregator. */
export interface AxisWrite {
  axis: string;
  delta: number;
}

/** A faction-rep delta, keyed by the canonical TCG Faction. */
export interface FactionRepWrite {
  faction: Faction;
  delta: number;
}

/** A stakes-axis delta. Recorded for the Campaign Ledger today; the
 *  StoryEncounter.stakesMode reducer (Plan #2) will consume it once
 *  it lands. */
export interface StakesWrite {
  axisId: string;
  delta: number;
}

/** A card-unlock intent. The caller forwards this to the unlock
 *  service; the `via` field tells the service which gate family to
 *  use. */
export interface CardUnlockWrite {
  cardDefId: string;
  via: "act_completion" | "secret" | "dialog_choice";
}

/** A future-encounter deck mutation intent. The caller forwards this
 *  to the encounter store / bossDeckResolver. */
export interface DeckMutationWrite {
  encounterId: string;
  addCardDefId: string;
}

/** Routes the conversation to an NPC duel. The caller (campaign
 *  router / in-room challenge handler) composes the deck via
 *  `buildNpcDeck()` and mounts the match UI. Recorded one-per-bundle
 *  by convention; multiple challenge writes are not meaningful. */
export interface ChallengeWrite {
  npcKey: NpcKey;
}

export interface OutcomeBundle {
  /** Stable identifier — `"<treeId>.<nodeId>.<choiceLabelSlug>"`
   *  by convention; supplied by the caller. */
  outcomeId: string;
  flagWrites: ReadonlyArray<FlagWrite>;
  trustWrites: ReadonlyArray<TrustWrite>;
  axisWrites: ReadonlyArray<AxisWrite>;
  factionRepWrites: ReadonlyArray<FactionRepWrite>;
  stakesWrites: ReadonlyArray<StakesWrite>;
  cardUnlockWrites: ReadonlyArray<CardUnlockWrite>;
  deckMutationWrites: ReadonlyArray<DeckMutationWrite>;
  challengeWrites: ReadonlyArray<ChallengeWrite>;
}

/** Fold a single `NpcDialogChoice` into a typed `OutcomeBundle`.
 *  Pure — no side effects. The caller persists / dispatches the
 *  bundle. */
export function applyDialogChoiceOutcomes(
  choice: NpcDialogChoice,
  outcomeId: string,
): OutcomeBundle {
  const flagWrites: FlagWrite[] = [];
  if (choice.sets) flagWrites.push({ flag: choice.sets, scope: "narrative" });
  if (choice.publicFlag)
    flagWrites.push({ flag: choice.publicFlag, scope: "npc_public" });

  const trustWrites: TrustWrite[] =
    choice.trustDelta !== undefined && choice.trustDelta !== 0
      ? [{ delta: choice.trustDelta }]
      : [];

  const axisWrites: AxisWrite[] = (choice.axisDelta ?? [])
    .filter((a) => Number.isFinite(a.delta) && a.delta !== 0)
    .map((a) => ({ axis: a.axis, delta: Math.trunc(a.delta) }));

  const factionRepWrites: FactionRepWrite[] = Object.entries(
    choice.factionRepDelta ?? {},
  )
    .filter(([, v]) => v !== undefined && Number.isFinite(v) && v !== 0)
    .map(([faction, delta]) => ({
      faction: faction as Faction,
      delta: Math.trunc(delta as number),
    }));

  const stakesWrites: StakesWrite[] = Object.entries(
    choice.stakesAxisDelta ?? {},
  )
    .filter(([, v]) => Number.isFinite(v) && v !== 0)
    .map(([axisId, delta]) => ({ axisId, delta: Math.trunc(delta) }));

  const cardUnlockWrites: CardUnlockWrite[] = choice.unlockCard
    ? [
        {
          cardDefId: choice.unlockCard.cardDefId,
          via: choice.unlockCard.via,
        },
      ]
    : [];

  const deckMutationWrites: DeckMutationWrite[] = choice.mutateNextEncounterDeck
    ? [
        {
          encounterId: choice.mutateNextEncounterDeck.encounterId,
          addCardDefId: choice.mutateNextEncounterDeck.addCardDefId,
        },
      ]
    : [];

  const challengeWrites: ChallengeWrite[] = choice.challenge
    ? [{ npcKey: choice.challenge.npcKey }]
    : [];

  return {
    outcomeId,
    flagWrites,
    trustWrites,
    axisWrites,
    factionRepWrites,
    stakesWrites,
    cardUnlockWrites,
    deckMutationWrites,
    challengeWrites,
  };
}

/** True iff the bundle would change any persisted state. Useful for
 *  the client to decide whether to render a "your choice mattered"
 *  toast vs. silently advancing. */
export function bundleHasEffects(bundle: OutcomeBundle): boolean {
  return (
    bundle.flagWrites.length > 0 ||
    bundle.trustWrites.length > 0 ||
    bundle.axisWrites.length > 0 ||
    bundle.factionRepWrites.length > 0 ||
    bundle.stakesWrites.length > 0 ||
    bundle.cardUnlockWrites.length > 0 ||
    bundle.deckMutationWrites.length > 0 ||
    bundle.challengeWrites.length > 0
  );
}

/** Render a one-line description of every effect in the bundle, for
 *  the Campaign Ledger UI + the optimistic toast. */
export function describeBundle(bundle: OutcomeBundle): string[] {
  const lines: string[] = [];
  for (const w of bundle.flagWrites) {
    lines.push(
      w.scope === "narrative"
        ? `flag set: ${w.flag}`
        : `public flag set: ${w.flag}`,
    );
  }
  for (const w of bundle.trustWrites) {
    lines.push(`trust ${w.delta >= 0 ? "+" : ""}${w.delta}`);
  }
  for (const w of bundle.axisWrites) {
    lines.push(`axis ${w.axis} ${w.delta >= 0 ? "+" : ""}${w.delta}`);
  }
  for (const w of bundle.factionRepWrites) {
    lines.push(`${w.faction} rep ${w.delta >= 0 ? "+" : ""}${w.delta}`);
  }
  for (const w of bundle.stakesWrites) {
    lines.push(`stakes:${w.axisId} ${w.delta >= 0 ? "+" : ""}${w.delta}`);
  }
  for (const w of bundle.cardUnlockWrites) {
    lines.push(`card unlocked: ${w.cardDefId} (via ${w.via})`);
  }
  for (const w of bundle.deckMutationWrites) {
    lines.push(`deck mutation: ${w.encounterId} +${w.addCardDefId}`);
  }
  for (const w of bundle.challengeWrites) {
    lines.push(`challenge: ${w.npcKey}`);
  }
  return lines;
}
