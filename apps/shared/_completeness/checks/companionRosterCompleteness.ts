/* ═══════════════════════════════════════════════════════
   COMPANION ROSTER COMPLETENESS — Section D6 parity

   Scoped to the Resurrected Trio (wraith_calder, akai_shi,
   lycos) — the companions Section D actually delivers. The
   broader CompanionRosterId surface is intentionally out
   of scope; pre-existing companions (Locke, Vex, Jericho)
   were authored under different sections and have their
   own parity gates (e.g. recruitmentChainCoverage).

   Hard parity per Trio entry: each must resolve to (a) a
   bunk-room OR dedicated companionRoomRegistry entry,
   (b) a loyaltyMissions entry, (c) a per-character VO
   manifest file in apps/shared/, (d) at least one
   companion-comment trigger that references the npcKey.
   ═══════════════════════════════════════════════════════ */

import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import { COMPANION_ROOM_REGISTRY } from "../../companionRoomRegistry";
import type { CompanionRosterId } from "../../companionRoomRegistry";
import { LOYALTY_MISSIONS } from "../../loyaltyMissions";
import { COMPANION_COMMENTS } from "../../companionComments";
import type { RawParityCount } from "../types";

// Scoped to the Resurrected Trio that Section D delivers.
const ALL_COMPANIONS: CompanionRosterId[] = [
  "wraith_calder",
  "akai_shi",
  "lycos",
];

const EXEMPT_COMPANIONS: ReadonlyArray<{
  id: CompanionRosterId;
  reason: string;
  exemptFacets: ReadonlyArray<"room" | "loyalty" | "vo" | "comment">;
}> = [];

// Per-character VO manifest filename map (Section D trio).
const VO_MANIFEST_BY_ID: Partial<Record<CompanionRosterId, string>> = {
  wraith_calder: "wraithCalderVoManifest.json",
  akai_shi: "akaiShiVoManifest.json",
  lycos: "lycosVoManifest.json",
};

function isExempt(
  id: CompanionRosterId,
  facet: "room" | "loyalty" | "vo" | "comment",
): boolean {
  const entry = EXEMPT_COMPANIONS.find((e) => e.id === id);
  if (!entry) return false;
  return entry.exemptFacets.includes(facet);
}

export function checkCompanionRosterCompleteness(): RawParityCount {
  // 4 facets × N non-system companions.
  const facets: ReadonlyArray<"room" | "loyalty" | "vo" | "comment"> = [
    "room",
    "loyalty",
    "vo",
    "comment",
  ];
  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  const roomedCompanions = new Set(
    COMPANION_ROOM_REGISTRY.map((e) => e.companionId),
  );
  const loyaltyCompanions = new Set(
    LOYALTY_MISSIONS.map((m) => m.companionId),
  );
  const commentSpeakers = new Set(
    COMPANION_COMMENTS.map((c) => c.speaker),
  );

  for (const id of ALL_COMPANIONS) {
    for (const facet of facets) {
      if (isExempt(id, facet)) continue;
      declared += 1;
      let ok = false;
      switch (facet) {
        case "room":
          ok = roomedCompanions.has(id);
          if (!ok) {
            missing.push(`${id}: no companionRoomRegistry entry`);
          }
          break;
        case "loyalty":
          ok = loyaltyCompanions.has(id);
          if (!ok) {
            missing.push(`${id}: no loyaltyMissions entry`);
          }
          break;
        case "vo": {
          const fname = VO_MANIFEST_BY_ID[id];
          if (!fname) {
            missing.push(
              `${id}: no VO_MANIFEST_BY_ID mapping — add one in companionRosterCompleteness.ts`,
            );
            break;
          }
          const fp = path.join(REPO_ROOT, "apps/shared", fname);
          ok = fs.existsSync(fp);
          if (!ok) {
            missing.push(`${id}: VO manifest ${fname} not found`);
          }
          break;
        }
        case "comment": {
          // For the Resurrected Trio, at least one trigger must
          // reference the npcKey — the existing
          // resurrection_cinematic_<npc>_seen and wolfHunt arc-end
          // entries satisfy this.
          const idLower = id.toLowerCase();
          ok = COMPANION_COMMENTS.some((c) =>
            c.trigger.toLowerCase().includes(idLower),
          );
          if (!ok) {
            missing.push(
              `${id}: no companionComments entry with trigger mentioning ${idLower}`,
            );
          }
          break;
        }
      }
      if (ok) implemented += 1;
    }
  }

  return { declared, implemented, missing };
}
