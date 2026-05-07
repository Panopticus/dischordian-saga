/**
 * Lore-bible generator — library form.
 *
 * Exports {@link generateLoreBible} returning the complete MD body
 * deterministically from `apps/client/src/data/loredex-data.json`.
 * Both the CLI (`scripts/generate-lore-bible.ts`) and the ship:check
 * drift gate (`apps/shared/_completeness/checks/loreBibleDrift.ts`)
 * import this so they can never disagree.
 *
 * See `scripts/generate-lore-bible.ts` for the rationale (no
 * timestamps, stable sort keys, only-present-fields tables).
 */
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(REPO_ROOT, "apps/client/src/data/loredex-data.json");

export interface LoreEntry {
  id: string;
  type: string;
  name: string;
  aliases?: readonly string[];
  era?: string;
  date_aa?: string;
  date_ad?: string;
  season?: string;
  affiliation?: string;
  status?: string;
  priority?: string;
  classification?: string;
  first_appearance?: string;
  album?: string;
  artist?: string;
  release_date?: string;
  release_year?: string | number;
  track_number?: number;
  duration_ms?: number;
  kind?: string;
  audio_url?: string;
  music_video?: string;
  reveal_video?: string;
  image?: string;
  bio?: string;
  description?: string;
  history?: string;
  connections?: readonly string[];
  characters_featured?: readonly string[];
  cross_references?: readonly { name: string; description?: string }[];
  song_appearances?: readonly { name?: string; song?: string; album?: string; music_video?: string | null }[];
  conexus_stories?: readonly string[];
  streaming_links?: Readonly<Record<string, string>>;
}

interface LoredexData {
  entries: readonly LoreEntry[];
}

const TYPE_ORDER: ReadonlyArray<{ type: string; heading: string }> = [
  { type: "character", heading: "Characters" },
  { type: "faction", heading: "Factions" },
  { type: "location", heading: "Locations" },
  { type: "concept", heading: "Concepts" },
  { type: "event", heading: "Events" },
  { type: "artifact", heading: "Artifacts" },
  { type: "song", heading: "Songs & Transmissions" },
];

const PRIORITY_RANK: Readonly<Record<string, number>> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function priorityRank(p?: string): number {
  if (!p) return 99;
  return PRIORITY_RANK[p] ?? 99;
}

function compareEntries(a: LoreEntry, b: LoreEntry): number {
  const pa = priorityRank(a.priority);
  const pb = priorityRank(b.priority);
  if (pa !== pb) return pa - pb;
  return a.name.localeCompare(b.name);
}

function cap(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

function fieldRow(label: string, value: string | undefined): string {
  if (value == null) return "";
  const trimmed = String(value).trim();
  if (trimmed.length === 0) return "";
  return `| **${label}** | ${trimmed} |\n`;
}

function renderEntry(entry: LoreEntry): string {
  const lines: string[] = [];
  lines.push(`## ${entry.name}\n`);

  if (entry.aliases && entry.aliases.length > 0) {
    lines.push(`*Also known as: ${entry.aliases.join(", ")}*\n`);
  }

  let table = "| Field | Value |\n|-------|-------|\n";
  table += fieldRow("Type", cap(entry.type));
  table += fieldRow("Era", entry.era);
  table += fieldRow("Date (A.A.)", entry.date_aa);
  table += fieldRow("Date (AD)", entry.date_ad);
  table += fieldRow("Season", entry.season);
  table += fieldRow("Classification", entry.classification);
  table += fieldRow("Affiliation", entry.affiliation);
  table += fieldRow("Album", entry.album);
  table += fieldRow("Artist", entry.artist);
  table += fieldRow(
    "Track",
    entry.track_number !== undefined ? String(entry.track_number) : undefined,
  );
  table += fieldRow(
    "Release",
    entry.release_date ?? (entry.release_year !== undefined ? String(entry.release_year) : undefined),
  );
  table += fieldRow(
    "Duration",
    entry.duration_ms
      ? `${Math.floor(entry.duration_ms / 60000)}:${String(Math.floor((entry.duration_ms % 60000) / 1000)).padStart(2, "0")}`
      : undefined,
  );
  table += fieldRow("Kind", entry.kind);
  table += fieldRow("First Appearance", entry.first_appearance);
  table += fieldRow("Status", entry.status);
  table += fieldRow("Priority", entry.priority);
  if (table.split("\n").length > 3) lines.push(table);

  if (entry.image) lines.push(`![${entry.name}](${entry.image})\n`);

  if (entry.bio && entry.bio.trim().length > 0) {
    lines.push(`### Dossier\n\n${entry.bio.trim()}\n`);
  }
  if (entry.description && entry.description.trim().length > 0 && entry.description !== entry.bio) {
    lines.push(`### Description\n\n${entry.description.trim()}\n`);
  }
  if (entry.history && entry.history.trim().length > 0 && entry.history !== entry.bio) {
    lines.push(`### History\n\n${entry.history.trim()}\n`);
  }
  if (entry.connections && entry.connections.length > 0) {
    lines.push("### Connections\n");
    for (const conn of [...entry.connections].sort()) lines.push(`- ${conn}`);
    lines.push("");
  }
  if (entry.characters_featured && entry.characters_featured.length > 0) {
    lines.push("### Characters Featured\n");
    for (const c of [...entry.characters_featured].sort()) lines.push(`- ${c}`);
    lines.push("");
  }
  if (entry.cross_references && entry.cross_references.length > 0) {
    lines.push("### Cross-References\n");
    for (const xref of [...entry.cross_references].sort((a, b) => a.name.localeCompare(b.name))) {
      const desc = xref.description ? ` — ${xref.description}` : "";
      lines.push(`- **${xref.name}**${desc}`);
    }
    lines.push("");
  }
  if (entry.song_appearances && entry.song_appearances.length > 0) {
    lines.push("### Song Appearances\n");
    lines.push("| Song | Album | Music Video |");
    lines.push("|------|-------|-------------|");
    const sorted = [...entry.song_appearances].sort((a, b) =>
      (a.name ?? a.song ?? "").localeCompare(b.name ?? b.song ?? ""),
    );
    for (const app of sorted) {
      const songName = app.name ?? app.song ?? "—";
      const album = app.album ?? "—";
      const mv = app.music_video ? `[Watch](${app.music_video})` : "—";
      lines.push(`| ${songName} | ${album} | ${mv} |`);
    }
    lines.push("");
  }
  if (entry.conexus_stories && entry.conexus_stories.length > 0) {
    lines.push("### CoNexus Stories\n");
    for (const s of [...entry.conexus_stories].sort()) lines.push(`- ${s}`);
    lines.push("");
  }
  if (entry.audio_url) lines.push(`**[Audio](${entry.audio_url})**\n`);
  if (entry.music_video) lines.push(`**[Music Video](${entry.music_video})**\n`);
  if (entry.reveal_video) lines.push(`**[Reveal Video](${entry.reveal_video})**\n`);
  if (entry.streaming_links && Object.keys(entry.streaming_links).length > 0) {
    lines.push("### Streaming Links\n");
    for (const platform of Object.keys(entry.streaming_links).sort()) {
      const url = entry.streaming_links[platform];
      lines.push(`- [${cap(platform.replace(/_/g, " "))}](${url})`);
    }
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

export function generateLoreBible(): string {
  const raw = fs.readFileSync(SOURCE_PATH, "utf-8");
  const data: LoredexData = JSON.parse(raw);
  const byType = new Map<string, LoreEntry[]>();
  for (const entry of data.entries) {
    if (!byType.has(entry.type)) byType.set(entry.type, []);
    byType.get(entry.type)!.push(entry);
  }
  const out: string[] = [];
  out.push("# The Dischordian Saga — Complete Lore Bible\n");
  out.push(
    "> Generated from `apps/client/src/data/loredex-data.json` by " +
      "`scripts/generate-lore-bible.ts` (`pnpm lore:generate`). Do not " +
      "edit by hand — changes here are overwritten on regeneration. The " +
      "ship:check `lore.bible_drift` gate fails any commit where this " +
      "file diverges from the generator output.\n",
  );
  out.push("## Table of Contents\n");
  for (const { type, heading } of TYPE_ORDER) {
    const items = byType.get(type) ?? [];
    if (items.length === 0) continue;
    const anchor = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    out.push(`- [${heading}](#${anchor}) (${items.length})`);
  }
  out.push("\n---\n");
  for (const { type, heading } of TYPE_ORDER) {
    const items = byType.get(type) ?? [];
    if (items.length === 0) continue;
    out.push(`# ${heading}\n`);
    const sorted = [...items].sort(compareEntries);
    for (const entry of sorted) {
      out.push(renderEntry(entry));
      out.push("---\n");
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
