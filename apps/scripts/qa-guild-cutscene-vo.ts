/**
 * Casting-QA harness for the guild-cutscene VO drop.
 *
 * Reads guild-cutscene-vo-lines.json, looks up each line's CDN
 * audio URL via the per-speaker manifest, then for a sampled
 * subset (default: 5 lines, biased toward the most subjectively-
 * cast roles) issues a HEAD request to verify the URL is
 * publicly readable + reports Content-Length so the producer can
 * spot duration outliers without downloading.
 *
 * Use this after `pnpm vo:guild-cutscenes` + asset upload to do
 * a fast sanity sweep before integration locks. For deeper QA,
 * pass --download to fetch the audio bytes locally so you can
 * play them back.
 *
 * Usage:
 *   pnpm tsx apps/scripts/qa-guild-cutscene-vo.ts                 # 5-line sweep
 *   pnpm tsx apps/scripts/qa-guild-cutscene-vo.ts --all           # every line
 *   pnpm tsx apps/scripts/qa-guild-cutscene-vo.ts --speaker=mireille
 *   pnpm tsx apps/scripts/qa-guild-cutscene-vo.ts --download --speaker=vex
 *
 * Exits non-zero if any sampled URL fails to HEAD or returns a
 * non-2xx status; otherwise prints a per-line report and returns
 * success.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

interface VoLine {
  id: string;
  speaker: string;
  text: string;
  context: string;
}

interface SampleResult {
  lineId: string;
  speaker: string;
  url: string;
  ok: boolean;
  status: number;
  contentLength: number;
  contentType: string;
  text: string;
  context: string;
}

interface Args {
  all: boolean;
  speaker: string | null;
  download: boolean;
  sampleSize: number;
}

const REPO_ROOT = resolve(__dirname, "..", "..");
const LINES_PATH = join(REPO_ROOT, "apps/scripts/guild-cutscene-vo-lines.json");
const MANIFEST_DIR = join(REPO_ROOT, "apps/shared");
const DOWNLOAD_DIR = join(REPO_ROOT, "/tmp/guild-cutscene-qa");

/* ─── Speakers most likely to need a casting tone-check ─── */
/* Mireille (persuasive warmth), Vex (rule-authority cadence), and
 * Proctor (quiet revelation) are the three most subjectively-cast
 * Professor voices per the casting brief. Add Kanevas + Aoki to
 * round out the default 5-line sweep with the tonally-anchored
 * Resonance + Umbra leads. */
const DEFAULT_SAMPLE_SPEAKERS = ["mireille", "vex", "proctor", "kanevas", "aoki"];

function parseArgs(argv: string[]): Args {
  return {
    all: argv.includes("--all"),
    speaker:
      argv.find((a) => a.startsWith("--speaker="))?.slice("--speaker=".length) ?? null,
    download: argv.includes("--download"),
    sampleSize: Number(
      argv.find((a) => a.startsWith("--sample-size="))?.slice("--sample-size=".length) ?? "5",
    ),
  };
}

async function loadLines(): Promise<readonly VoLine[]> {
  const raw = await readFile(LINES_PATH, "utf-8");
  return JSON.parse(raw) as VoLine[];
}

async function loadManifest(speaker: string): Promise<Record<string, string>> {
  const path = join(MANIFEST_DIR, `${speaker}VoManifest.json`);
  if (!existsSync(path)) return {};
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

async function headOne(url: string): Promise<{
  ok: boolean;
  status: number;
  contentLength: number;
  contentType: string;
}> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return {
      ok: res.ok,
      status: res.status,
      contentLength: Number(res.headers.get("content-length") ?? "0"),
      contentType: res.headers.get("content-type") ?? "",
    };
  } catch {
    return { ok: false, status: 0, contentLength: 0, contentType: "" };
  }
}

async function downloadOne(url: string, dest: string): Promise<number> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

function pickSamples(
  lines: readonly VoLine[],
  args: Args,
): readonly VoLine[] {
  if (args.all) return lines;
  if (args.speaker) return lines.filter((l) => l.speaker === args.speaker);

  // Default sweep: pick the first line found per default-speaker, in
  // order, until we have sampleSize. Falls through to sequential
  // sampling if a default-speaker is missing.
  const picked: VoLine[] = [];
  const seenSpeakers = new Set<string>();
  for (const sp of DEFAULT_SAMPLE_SPEAKERS) {
    const found = lines.find((l) => l.speaker === sp && !seenSpeakers.has(sp));
    if (found) {
      picked.push(found);
      seenSpeakers.add(sp);
    }
    if (picked.length >= args.sampleSize) break;
  }
  if (picked.length < args.sampleSize) {
    for (const l of lines) {
      if (!picked.includes(l)) picked.push(l);
      if (picked.length >= args.sampleSize) break;
    }
  }
  return picked.slice(0, args.sampleSize);
}

function fmtKB(n: number): string {
  return `${(n / 1024).toFixed(1)} KB`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const lines = await loadLines();
  const samples = pickSamples(lines, args);

  console.log(
    `\n═══ GUILD-CUTSCENE VO CASTING QA ═══\n` +
      `${samples.length}/${lines.length} lines on this run` +
      `${args.all ? " (--all)" : args.speaker ? ` (--speaker=${args.speaker})` : " (default 5-speaker sweep)"}` +
      `${args.download ? " · downloading audio to /tmp/guild-cutscene-qa" : ""}\n`,
  );

  if (args.download) await mkdir(DOWNLOAD_DIR, { recursive: true });

  // Cache manifest loads per-speaker so we don't hit disk repeatedly.
  const manifests = new Map<string, Record<string, string>>();
  const results: SampleResult[] = [];

  for (const line of samples) {
    if (!manifests.has(line.speaker)) {
      manifests.set(line.speaker, await loadManifest(line.speaker));
    }
    const url = manifests.get(line.speaker)![line.id];
    if (!url) {
      console.error(
        `MISS ${line.id} (speaker=${line.speaker}) — no entry in ${line.speaker}VoManifest.json`,
      );
      results.push({
        lineId: line.id,
        speaker: line.speaker,
        url: "",
        ok: false,
        status: 0,
        contentLength: 0,
        contentType: "",
        text: line.text,
        context: line.context,
      });
      continue;
    }
    const head = await headOne(url);
    if (args.download && head.ok) {
      const dest = join(DOWNLOAD_DIR, `${line.id}.mp3`);
      try {
        await downloadOne(url, dest);
      } catch (err) {
        console.error(`download fail ${line.id}:`, err);
      }
    }
    results.push({
      lineId: line.id,
      speaker: line.speaker,
      url,
      ...head,
      text: line.text,
      context: line.context,
    });
    const mark = head.ok ? "✓" : "✗";
    console.log(
      `  ${mark} [${line.speaker.padEnd(13)}] ${line.id.padEnd(35)}  ${head.status}  ${fmtKB(head.contentLength).padStart(9)}  "${line.text.slice(0, 50)}${line.text.length > 50 ? "…" : ""}"`,
    );
  }

  const failures = results.filter((r) => !r.ok);
  const sizes = results.filter((r) => r.ok).map((r) => r.contentLength);
  const avg = sizes.length ? sizes.reduce((s, x) => s + x, 0) / sizes.length : 0;
  const min = sizes.length ? Math.min(...sizes) : 0;
  const max = sizes.length ? Math.max(...sizes) : 0;

  console.log(
    `\n═══ SUMMARY ═══\n` +
      `OK:       ${results.length - failures.length}/${results.length}\n` +
      `Failed:   ${failures.length}\n` +
      `Avg size: ${fmtKB(avg)}  (range ${fmtKB(min)} – ${fmtKB(max)})\n`,
  );

  if (failures.length) {
    console.error("FAILED LINES:");
    for (const f of failures) {
      console.error(`  ${f.lineId} (speaker=${f.speaker})  status=${f.status}  url=${f.url}`);
    }
    process.exit(1);
  }

  if (args.download) {
    console.log(
      `Downloaded ${results.length} mp3 files to ${DOWNLOAD_DIR} — listen with your usual player.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
