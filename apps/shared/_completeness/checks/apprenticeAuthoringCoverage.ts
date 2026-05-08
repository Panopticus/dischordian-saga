/**
 * Apprentice authoring coverage parity check.
 *
 * Declared surface: the 12 ApprenticeArchetype values. Each archetype
 * is "implemented" only if every authoring slot is populated:
 *   - APPRENTICE_IDENTITIES has an entry (likes/dislikes/wants/quest/...)
 *   - apprenticeBanter has ≥ 1 banter pair for the archetype
 *   - apprenticeComments has ≥ 2 reactive lines for the archetype
 *   - apprenticeGifts catalog has ≥ 1 item matching one of the
 *     archetype's like or dislike tags
 *   - commonsScenePool has ≥ 1 scene including the archetype as a
 *     participant
 *   - apprentice-<archetype>-female-lines.json AND
 *     apprentice-<archetype>-male-lines.json exist on disk
 *
 * Hard parity — every archetype must be fully covered for the gate
 * to pass.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const ARCHETYPES = [
  "zealot",
  "ghost",
  "scholar",
  "revenant",
  "artisan",
  "oracle",
  "wanderer",
  "martyr",
  "heretic",
  "jester",
  "sentinel",
  "prodigal",
] as const;

const SCRIPTS_DIR = path.join(REPO_ROOT, "apps/scripts");

export async function checkApprenticeAuthoringCoverage(): Promise<RawParityCount> {
  const [
    identityMod,
    banterMod,
    commentsMod,
    giftsMod,
    sceneMod,
  ] = await Promise.all([
    import("../../apprenticeIdentity"),
    import("../../apprenticeBanter"),
    import("../../apprenticeComments"),
    import("../../apprenticeGifts"),
    import("../../commonsScenePool"),
  ]);
  const identities = identityMod.APPRENTICE_IDENTITIES;
  const banterCov = banterMod.banterCoverageByArchetype();
  const commentCov = commentsMod.commentCoverageByArchetype();
  const giftCov = giftsMod.giftCoverageByArchetype();
  const scenePool = sceneMod.COMMONS_SCENE_POOL;

  const missing: string[] = [];
  let implemented = 0;

  for (const arch of ARCHETYPES) {
    const reasons: string[] = [];
    if (!identities[arch]) reasons.push("missing identity");
    if ((banterCov[arch] ?? 0) < 1) reasons.push("no banter pair");
    if ((commentCov[arch] ?? 0) < 2) reasons.push("< 2 comments");
    if ((giftCov[arch] ?? 0) < 1) reasons.push("no gift catalog match");
    const sceneCount = scenePool.filter((s) =>
      s.participants.includes(arch),
    ).length;
    if (sceneCount < 1) reasons.push("no commons scene");
    const fJson = path.join(
      SCRIPTS_DIR,
      `apprentice-${arch}-female-lines.json`,
    );
    const mJson = path.join(
      SCRIPTS_DIR,
      `apprentice-${arch}-male-lines.json`,
    );
    if (!fs.existsSync(fJson)) reasons.push("no female VO file");
    if (!fs.existsSync(mJson)) reasons.push("no male VO file");

    if (reasons.length === 0) {
      implemented += 1;
    } else {
      missing.push(`${arch}: ${reasons.join(", ")}`);
    }
  }

  return {
    declared: ARCHETYPES.length,
    implemented,
    missing,
  };
}
