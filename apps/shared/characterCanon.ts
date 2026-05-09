/* ═══════════════════════════════════════════════════════
   CHARACTER CANON
   audit/16 PR 12 (Cluster E first stage — Cosplay + Cinematic
   personas).

   Single typed surface aggregating everything a cosplayer or
   AI-prompt generator needs for one NPC: portrait, cosplay
   metadata, faction info, default expression, blood-weave
   visual band (if relevant). Pure read-only; no UI here.

   The audit's "Character Canon Reference Site" (Cluster E)
   is staged S → M → XL: this PR ships the S (data
   extraction); the /characters/canon UI is the M; the
   per-character art turnaround backfill is the XL. By
   shipping the data layer first, both the UI PR and any
   external AI-prompt generator can start consuming today.

   Note: this module DELIBERATELY does not import from
   `apps/client/src/game/npcPortraits.ts` (which lives client-
   side). Aggregation is built in two halves:
     - `apps/shared/characterMetadata.ts` (this module's
       sibling) — pure shared metadata that lives in apps/shared
       so SSR + scripts can read it.
     - The NPC_PORTRAITS Cloudinary URLs stay client-only;
       the canon's `getPortraitForCanon(npcId, NPC_PORTRAITS)`
       takes the registry as an arg so callers wire it up
       at the boundary.
   ═══════════════════════════════════════════════════════ */

import {
  CHARACTER_COSPLAY_METADATA,
  getCharacterCosplayMetadata,
  type CharacterCosplayMetadata,
} from "./characterMetadata";
import {
  BLOOD_WEAVE_BAND_VISUALS,
  type BloodWeaveBand,
  type BloodWeaveBandVisual,
} from "./bloodWeave";

/** Loose-typed portrait shape — the NPC_PORTRAITS registry
 *  in apps/client/src/game/npcPortraits.ts. Defined here as
 *  a structural type to avoid the cross-package import. */
export interface NPCPortraitLike {
  id: string;
  name: string;
  fullPortrait: string;
  bustPortrait: string;
  color: string;
  expressions: Readonly<Record<string, string>>;
}

/** The complete canonical view of one character. */
export interface CharacterCanonEntry {
  id: string;
  name: string;
  /** Hero portrait URL. */
  fullPortrait: string;
  /** Crop-to-bust portrait URL. */
  bustPortrait: string;
  /** Faction / palette colour CSS variable or hex. */
  factionColor: string;
  /** All authored expressions for this NPC. */
  expressions: Readonly<Record<string, string>>;
  /** Cosplay metadata block (Cos4). null when no metadata
   *  exists for this NPC yet — the UI surfaces a "metadata
   *  pending" notice rather than a 404. */
  cosplay: CharacterCosplayMetadata | null;
  /** Optional Blood-Weave band visual — only populated for
   *  characters who carry the Blood Weave (cinematic /
   *  cosplay reference for the red-thread aesthetic). */
  bloodWeaveBand: BloodWeaveBandVisual | null;
}

/** Build a canon entry from a portrait + (optional) blood-
 *  weave band. Pure helper; no I/O. */
export function buildCanonEntry(
  portrait: NPCPortraitLike,
  options: { bloodWeaveBand?: BloodWeaveBand } = {},
): CharacterCanonEntry {
  const cosplay = getCharacterCosplayMetadata(portrait.id);
  const bloodWeaveBand = options.bloodWeaveBand
    ? BLOOD_WEAVE_BAND_VISUALS[options.bloodWeaveBand] ?? null
    : null;
  return {
    id: portrait.id,
    name: portrait.name,
    fullPortrait: portrait.fullPortrait,
    bustPortrait: portrait.bustPortrait,
    factionColor: portrait.color,
    expressions: portrait.expressions,
    cosplay,
    bloodWeaveBand,
  };
}

/** Build the full canon for every entry in a portrait
 *  registry. The optional `bloodWeaveBandFor` mapper assigns
 *  bands per-NPC — most characters return null (not Blood
 *  Weave–touched), only the affected NPCs return a band. */
export function buildCanonRegistry(
  portraitsRegistry: Readonly<Record<string, NPCPortraitLike>>,
  bloodWeaveBandFor?: (npcId: string) => BloodWeaveBand | undefined,
): readonly CharacterCanonEntry[] {
  return Object.values(portraitsRegistry).map((p) =>
    buildCanonEntry(p, {
      bloodWeaveBand: bloodWeaveBandFor?.(p.id),
    }),
  );
}

/** Coverage stat — % of portraits that have cosplay metadata
 *  populated. Useful for the audit'd "metadata coverage"
 *  ratchet (queued for a follow-up). */
export function cosplayMetadataCoverage(
  portraitsRegistry: Readonly<Record<string, NPCPortraitLike>>,
): { declared: number; implemented: number } {
  const declared = Object.keys(portraitsRegistry).length;
  let implemented = 0;
  for (const p of Object.values(portraitsRegistry)) {
    if (CHARACTER_COSPLAY_METADATA[p.id]) implemented += 1;
  }
  return { declared, implemented };
}
