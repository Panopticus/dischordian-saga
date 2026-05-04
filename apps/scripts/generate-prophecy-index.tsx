/**
 * Generate docs/built/PROPHECY_INDEX.md — the writers'-room scan
 * surface for the prophecy vision registry.
 *
 * Renders four artefacts:
 *   1. Chrono-spine matrix — rows = player acts, columns = the
 *      two spines. Each cell lists the marquees / whispers /
 *      statics resolved from the registry.
 *   2. Per-album track tables — every binding tagged with its
 *      tier, flag, bookend ids, reward.
 *   3. Prophecy line bank — id → text → theme → register, plus
 *      the visions that reference it.
 *   4. Achievement ladder — Witness → Film Witness → Archivist →
 *      Full Tapestry → Antiquarian's Codex predicates and reward
 *      shapes.
 *
 * Usage:
 *   pnpm tsx apps/scripts/generate-prophecy-index.tsx
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import {
  PROPHECY_VISIONS,
  validateProphecyRegistry,
  type AlbumSlug,
  type PlayerAct,
  type ProphecyVision,
  type Spine,
} from "../shared/prophecyVisionMap";
import {
  DANIEL_CROSS_PROPHECIES,
  type DanielCrossProphecy,
} from "../shared/danielCrossProphecies";
import { PROPHECY_ACHIEVEMENTS } from "../shared/prophecyAchievements";

const OUTPUT = join(process.cwd(), "docs", "built", "PROPHECY_INDEX.md");

const ACTS: readonly PlayerAct[] = [1, 2, 3, 4, 4.5, 5, 6, 7];
const SPINES: readonly { id: Spine; label: string }[] = [
  { id: "insurgency_rise", label: "Insurgency Rise" },
  { id: "reality_fall", label: "Fall of Reality" },
];
const ALBUMS: readonly { slug: AlbumSlug; label: string }[] = [
  { slug: "dischordian-logic", label: "Album 1 · Dischordian Logic" },
  { slug: "age-of-privacy", label: "Album 2 · The Age of Privacy" },
  { slug: "book-of-daniel", label: "Album 3 · The Book of Daniel 24:7" },
  { slug: "west-by-god", label: "Album 4 · West by God" },
  { slug: "silence-in-heaven", label: "Album 5 · Silence in Heaven" },
];

function tierBadge(intensity: ProphecyVision["intensity"]): string {
  switch (intensity) {
    case "marquee":
      return "🎼 Marquee";
    case "whisper":
      return "🌑 Whisper";
    case "static":
      return "✦ Echo";
  }
}

function actLabel(act: PlayerAct): string {
  return act === 4.5 ? "Act 4½" : `Act ${act}`;
}

function listForCell(act: PlayerAct, spine: Spine): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter(
    (v) => v.playerAct === act && v.spine === spine,
  );
}

function chronoSpineMatrix(): string {
  const lines: string[] = [];
  lines.push("## 1. Chrono-spine matrix");
  lines.push("");
  lines.push(
    "Rows are the player's acts. Columns are the two narrative spines. " +
      "Every act delivers a slice of both spines — at least one Marquee per " +
      "active spine, with Whispers and Statics filling out the long tail.",
  );
  lines.push("");
  lines.push(`| Act | ${SPINES.map((s) => s.label).join(" | ")} |`);
  lines.push(`|---|${SPINES.map(() => "---").join("|")}|`);
  for (const act of ACTS) {
    const cells = SPINES.map((s) => {
      const list = listForCell(act, s.id);
      if (list.length === 0) return "_(silent)_";
      return list
        .map((v) => `${tierBadge(v.intensity)} \`${v.id}\``)
        .join("<br>");
    });
    lines.push(`| **${actLabel(act)}** | ${cells.join(" | ")} |`);
  }
  return lines.join("\n");
}

function perAlbumTables(): string {
  const lines: string[] = [];
  lines.push("## 2. Per-album track tables");
  lines.push("");
  for (const { slug, label } of ALBUMS) {
    const albumVisions = PROPHECY_VISIONS.filter((v) => v.albumSlug === slug);
    if (albumVisions.length === 0) {
      lines.push(`### ${label}`);
      lines.push("");
      lines.push("_No prophecy bindings yet._");
      lines.push("");
      continue;
    }
    lines.push(`### ${label}`);
    lines.push("");
    lines.push(
      "| Track | Tier | Act | Flag | Bookend (open → close) | Oracle | Reward |",
    );
    lines.push(
      "|---|---|---|---|---|---|---|",
    );
    for (const v of albumVisions) {
      lines.push(
        `| ${v.trackId} \`${v.id}\` | ${tierBadge(v.intensity)} | ${actLabel(v.playerAct)} | \`${v.flagId}\` | \`${v.openingProphecyId}\` → \`${v.closingProphecyId}\` | ${v.oracleCardSlug ?? "—"} | xp ${v.reward.xp ?? 0}, dream ${v.reward.soulBoundDream ?? 0} |`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

function prophecyLineBank(): string {
  const lines: string[] = [];
  lines.push("## 3. Daniel Cross prophecy line bank");
  lines.push("");
  lines.push(
    "Every prophecy line in `apps/shared/danielCrossProphecies.ts`, with " +
      "its theme, register, and the visions that bookend with it.",
  );
  lines.push("");

  // Build reverse index: prophecyId → visions that reference it.
  const refMap = new Map<string, string[]>();
  for (const v of PROPHECY_VISIONS) {
    for (const id of [v.openingProphecyId, v.closingProphecyId]) {
      const arr = refMap.get(id) ?? [];
      arr.push(v.id);
      refMap.set(id, arr);
    }
  }

  lines.push("| ID | Theme | Register | Text | References |");
  lines.push("|---|---|---|---|---|");
  for (const p of DANIEL_CROSS_PROPHECIES) {
    const refs = refMap.get(p.id) ?? [];
    const text = p.text.replace(/\n/g, " // ");
    lines.push(
      `| \`${p.id}\` | ${p.theme} | ${p.register} | _${text}_ | ${refs.length > 0 ? refs.join(", ") : "_unreferenced_"} |`,
    );
  }
  return lines.join("\n");
}

function achievementLadder(): string {
  const lines: string[] = [];
  lines.push("## 4. Witness ladder achievements");
  lines.push("");
  lines.push("| ID | Kind | Album | Cosmetic | Side Effects |");
  lines.push("|---|---|---|---|---|");
  for (const a of PROPHECY_ACHIEVEMENTS) {
    lines.push(
      `| \`${a.id}\` | ${a.kind} | ${a.albumSlug ?? "—"} | \`${a.cosmeticKey}\` | ${a.sideEffects?.join(", ") ?? "—"} |`,
    );
  }
  return lines.join("\n");
}

function header(): string {
  const totalMarquees = PROPHECY_VISIONS.filter(
    (v) => v.intensity === "marquee",
  ).length;
  const totalWhispers = PROPHECY_VISIONS.filter(
    (v) => v.intensity === "whisper",
  ).length;
  const totalStatics = PROPHECY_VISIONS.filter(
    (v) => v.intensity === "static",
  ).length;
  const issues = validateProphecyRegistry();
  const lines: string[] = [];
  lines.push("# PROPHECY INDEX");
  lines.push("");
  lines.push(
    `_Generated by \`pnpm tsx apps/scripts/generate-prophecy-index.tsx\` — do not edit by hand._`,
  );
  lines.push("");
  lines.push(`- Total prophecy visions: **${PROPHECY_VISIONS.length}**`);
  lines.push(`  - Marquees: ${totalMarquees}`);
  lines.push(`  - Whispers: ${totalWhispers}`);
  lines.push(`  - Static Echoes: ${totalStatics}`);
  lines.push(`- Daniel Cross prophecy lines: **${DANIEL_CROSS_PROPHECIES.length}**`);
  lines.push(
    `- Registry validation: ${issues.length === 0 ? "✅ clean" : `❌ ${issues.length} issues`}`,
  );
  if (issues.length > 0) {
    for (const i of issues) {
      lines.push(`  - ⚠️ \`${i.visionId}\` ${i.kind}: ${i.message}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const sections = [
    header(),
    chronoSpineMatrix(),
    "",
    perAlbumTables(),
    prophecyLineBank(),
    "",
    achievementLadder(),
    "",
  ];
  const out = sections.join("\n");
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, out, "utf8");
  // eslint-disable-next-line no-console
  console.log(`[generate-prophecy-index] wrote ${OUTPUT} (${out.length} bytes)`);
}

main();
