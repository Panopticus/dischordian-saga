/**
 * Asset-existence guard — card art well-formedness parity check.
 *
 * Large media (`apps/client/public/{art,audio,videos,music,games}`) is
 * gitignored and served CDN-only from s3://dgrsart, so CI cannot verify
 * that a referenced file actually exists on disk. What CI *can* enforce,
 * offline and with zero false positives, is that every card's resolved
 * `art` URL is a structurally valid CDN asset path and is not a
 * placeholder/stub/unresolved-template string. That catches the real
 * shipped-failure mode — a card pointing at `…/undefined.webp`,
 * `…/PLACEHOLDER.png`, an unresolved `${…}` template, a localhost URL,
 * or a path with no asset extension — none of which the manifest-driven
 * coverage checks (`art.new_art_drop_coverage`, room-art tests) see,
 * because those only cover assets that *are* declared in a manifest.
 *
 * True S3 existence is verified separately by the credential-gated
 * `scripts/_check-art-coverage.mjs` (HEAD probe); this gate is the
 * offline, always-on regression guard that runs in CI.
 *
 * "Declared"    = cards whose `art` is a defined non-empty string.
 * "Implemented" = those whose `art` is a well-formed, non-placeholder
 *                 CDN asset URL.
 */
import { ALL_CARD_DEFINITIONS } from "../../tcg-core/cards/index";
import { PUBLIC_ASSET_BASE } from "../../lib/assetUrl";
import type { RawParityCount } from "../types";

const ALLOWED_ROOTS = ["art/", "audio/", "videos/", "music/", "games/"];
const ASSET_EXT =
  /\.(webp|png|jpe?g|gif|avif|svg|mp4|webm|m4v)$/i;
// Conservative, path-shaped markers — each is something that should
// never appear in a real shipped asset slug. Kept tight to guarantee
// zero false positives against the legitimate card pool.
const PLACEHOLDER_MARKERS = [
  "placeholder",
  "/todo",
  "to-do",
  "tbd.",
  "/tbd/",
  "fixme",
  "coming-soon",
  "comingsoon",
  "do-not-use",
  "not-found",
  "notfound",
  "/undefined",
  "undefined.",
  "/null.",
  "/xxx",
];

function defect(art: string): string | null {
  const v = art.trim();
  if (v === "") return "empty string";
  if (v.includes("${") || v.includes("[object"))
    return "unresolved template / [object …]";
  if (!v.startsWith(PUBLIC_ASSET_BASE + "/"))
    return `not under PUBLIC_ASSET_BASE (${v.slice(0, 48)}…)`;
  const rel = v.slice(PUBLIC_ASSET_BASE.length + 1);
  if (rel.startsWith("/") || rel.includes("//"))
    return "double / leading slash in path";
  if (/\s|\\/.test(rel)) return "whitespace or backslash in path";
  if (rel.includes("..")) return "path traversal segment";
  if (!ALLOWED_ROOTS.some((r) => rel.startsWith(r)))
    return `unknown asset root (${rel.split("/")[0]}/)`;
  if (!ASSET_EXT.test(rel)) return "missing/invalid asset extension";
  const low = rel.toLowerCase();
  const hit = PLACEHOLDER_MARKERS.find((m) => low.includes(m));
  if (hit) return `placeholder marker "${hit}"`;
  return null;
}

export function checkCardArtWellFormed(): RawParityCount {
  const offenders: string[] = [];
  let declared = 0;
  for (const card of ALL_CARD_DEFINITIONS) {
    // Reserved cards (e.g. `burnt_card_placeholder`) are retroactive
    // deliveries filtered out of every pack-opening / deck-builder /
    // reward surface (`isReservedCard()`); their art is intentionally
    // a placeholder by design. Excluded for the same reason
    // cardStatBudgetCoverage excludes them.
    if ((card as { reserved?: boolean }).reserved) continue;
    const art = (card as { art?: unknown }).art;
    if (typeof art !== "string" || art.trim() === "") continue;
    declared++;
    const d = defect(art);
    if (d) offenders.push(`${card.id} (${card.name}): ${d}`);
  }
  return {
    declared,
    implemented: declared - offenders.length,
    missing: offenders,
  };
}
