/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL — burnt-card art manifest
   docs/design/NEXUS_TRIAL_PLAN.md → Card burn pipeline

   Maps each permadead NPC's npcKey to the producer-delivered
   burnt-card art URL. Consumed by the nexusTrial.permadeath
   tRPC endpoint so client card views can swap to the burnt
   variant after the Verdict closes.

   Five variants ship (Locke + 4 ballot candidates) per the
   commissions brief §3 BC-01 through BC-05. Only the
   cinematic that fires at any given Trial ships its variant
   to the live game; the other 3 stay as standby assets per
   the plan's pre-authoring discipline.

   All assets live on the CDN at:
     cdn/client-public/art/cards/nexus_trial/<npc>_burnt.webp
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

/** Permadead npcKey → burnt-card art URL. Only the keys in this
 *  registry have producer-delivered burnt variants; any other
 *  permadead npcKey (none ship in canon today) would render its
 *  original art unchanged until art lands. */
const BURNT_CARD_ART_BY_NPC: Readonly<Record<string, string>> = {
  locke: assetUrl("art/cards/nexus_trial/locke_burnt.webp"),
  wraith_calder: assetUrl("art/cards/nexus_trial/wraith_calder_burnt.webp"),
  lycos: assetUrl("art/cards/nexus_trial/lycos_burnt.webp"),
  akai_shi: assetUrl("art/cards/nexus_trial/akai_shi_burnt.webp"),
  vex_solene: assetUrl("art/cards/nexus_trial/vex_solene_burnt.webp"),
};

/** Return the burnt-card art URL for the given npcKey, or null if no
 *  burnt variant has been authored for them. */
export function burntCardArtFor(npcKey: string): string | null {
  return BURNT_CARD_ART_BY_NPC[npcKey] ?? null;
}

/** List every npcKey that has a producer-delivered burnt variant.
 *  Useful for ship-check parity (the keys here should be a superset
 *  of any npc the Verdict resolver can mark permadead — i.e. Locke
 *  + the 4 ballot candidates). */
export function listBurntCardNpcs(): readonly string[] {
  return Object.keys(BURNT_CARD_ART_BY_NPC);
}
