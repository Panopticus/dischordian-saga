/**
 * Guild-cutscene VO generator — ElevenLabs TTS + local/S3 delivery.
 *
 * Generates the 63 voice lines documented in
 * docs/production/GUILD_CUTSCENE_BIBLE.md §G.3, routing each line to the
 * speaker's matching `apps/shared/<speaker>VoManifest.json` file.
 *
 * Reads `apps/scripts/guild-cutscene-vo-lines.json`. Each line carries a
 * `manifest` key (the speaker-id stem) that decides which manifest the
 * generated audio URL is appended to. Brand-new speaker manifests are
 * created on-the-fly the first time a line for them generates.
 *
 * Usage:
 *   export ELEVENLABS_API_KEY=sk_...
 *   # Optional — if unset, only local mp3s land
 *   export AWS_ACCESS_KEY_ID=AKIA...
 *   export AWS_SECRET_ACCESS_KEY=...
 *   pnpm vo:guild-cutscenes
 *
 * Plan without API calls:
 *   pnpm vo:guild-cutscenes --dry-run
 *
 * Skip lines with TODO voice IDs (the 26 NEW Professor voices):
 *   pnpm vo:guild-cutscenes --skip-todo
 *
 * Filter by speaker or section:
 *   pnpm vo:guild-cutscenes --only elara
 *   pnpm vo:guild-cutscenes --only F.4
 *   pnpm vo:guild-cutscenes --only "Signature Abilities"
 *
 * Cap for smoke tests:
 *   pnpm vo:guild-cutscenes --limit 3
 *
 * Idempotent — every successful generation writes the manifest before
 * attempting S3, so re-runs skip lines that already have a URL.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const BUCKET = process.env.S3_BUCKET ?? "dgrsvoices";
const REGION = process.env.AWS_REGION ?? "us-east-2";
const HAS_AWS =
  Boolean(process.env.AWS_ACCESS_KEY_ID) &&
  Boolean(process.env.AWS_SECRET_ACCESS_KEY);

const S3_PREFIX = "Guild Cutscene Voices";
const OUTPUT_DIR = "audio/guild-cutscenes";

interface Settings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix: string;
}

/**
 * Per-speaker ElevenLabs voice_settings for every speaker referenced by the
 * guild-cutscene lines file. Existing series-regular speakers (elara, human,
 * gamemaster, warlord, etc.) reuse their canonical tunings from
 * generate-act-vo.ts and generate-companion-vo.ts. The 12 Mechronis Professors
 * (Kanevas through Proctor) and the 5 archetype-emote speakers (chorus,
 * between, politician, warden, engineer) get fresh tunings consistent with
 * their House and the Bible's character notes.
 */
const SPEAKER_SETTINGS: Record<string, Settings> = {
  // ─── Series regulars (carried from existing generators) ───
  elara: {
    stability: 0.55,
    similarity_boost: 0.85,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix: "",
  },
  human: {
    stability: 0.5,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix: "",
  },
  gamemaster: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*dry administrative authority, schoolmasterly cadence with one beat of conspiratorial warmth available* ",
  },
  warlord: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*parade-ground crisp, weathered male commander, clipped cadence — never raises the voice* ",
  },
  architect: {
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*red-eyed digital presence, computational, ancient, patient; speaks in chess-move logic with no inflection — rare flashes of acknowledged curiosity* ",
  },
  watcher: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*Asian female-Bond cadence, formal precision, seductive-confident but never hot; she already knows the ending* ",
  },
  collector: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*archival, dusty, professorial; speaks as if cataloguing every word she utters* ",
  },
  necromancer: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*weary determination with gravel underneath; the voice of someone who has died and come back more than once* ",
  },
  meme: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.4,
    use_speaker_boost: true,
    text_prefix:
      "*half-whispered conspiratorial — a voice that wants you to feel something specific and is willing to lie to make it happen* ",
  },

  // ─── New archetype-emote speakers ───
  chorus: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*orchestral leader voice, warm-authoritative; speaks as if conducting; mid-register male or warm-alto female* ",
  },
  between: {
    stability: 0.45,
    similarity_boost: 0.78,
    style: 0.4,
    use_speaker_boost: true,
    text_prefix:
      "*breath-half-spoken with reverb tail; speaker isn't fully present in this dimension — words trail into elsewhere* ",
  },
  politician: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*warm conspiratorial, deal-maker cadence; the voice that closes the contract before either side knows the room has shifted* ",
  },
  warden: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*professional security-officer tone, controlled, authoritative; the voice that announces what is and is not permitted* ",
  },
  engineer: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*workshop-floor satisfaction, tools-just-set-down cadence; quiet pride in things that work* ",
  },

  // ─── 12 Mechronis Professor voices (signature ability casters) ───
  kanevas: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*Headmaster Kanevas — Chorus, Resonance House; warm authoritative orchestral leader, the voice of the choir conductor who knows every section by name* ",
  },
  aoki: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*Professor Aoki — Eyes, Umbra House; quiet focused observation, soft-spoken with surveillance-grade precision; the voice that has watched you before you noticed* ",
  },
  halverez: {
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*Curator Halverez — Archive, Umbra House; archival-dusty professorial cadence, every word cited from memory; the voice of someone who has read every file and remembers their order* ",
  },
  orphic: {
    stability: 0.45,
    similarity_boost: 0.78,
    style: 0.4,
    use_speaker_boost: true,
    text_prefix:
      "*Professor Orphic — Between, Liminal House; dimensional calm with breath-trail reverb; speaks as if half the words land in this room and half land elsewhere* ",
  },
  mireille: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*Professor Mireille — Influencers, Resonance House; persuasive warmth, the voice that makes you want to agree before you know what you're agreeing to* ",
  },
  kasra: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*General Kasra — Yellow Coats, Ironflight House; military command crispness, low-register clipped cadence; never raises the voice but is always obeyed* ",
  },
  vellis: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*Senator Vellis — Congress, Resonance House; warm diplomatic cadence with calculation underneath; the voice of someone who has counted the votes before walking into the room* ",
  },
  greenshaw: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*Warden Greenshaw — Locks, Umbra House; authoritative containment-officer voice, level and unhurried; the voice that announces what cannot leave the room* ",
  },
  vex: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*Professor Vex — Grey Gamers, Liminal House; rule-authority cadence, the voice that reads the rulebook aloud and then announces the rulebook has just changed* ",
  },
  vasara: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*Dr. Vasara — Living, Ironflight House; calm physician's resolve, low-register medical professional with no surprise about death and no fear of bringing someone back* ",
  },
  vent: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*Artificer Vent — Forge, Ironflight House; workshop-floor pride, tools-set-down satisfaction cadence; the voice that announces a thing is finished and stronger than it was* ",
  },
  proctor: {
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*The Proctor — Architect's Study, Liminal House; quiet revelation cadence, the voice of someone who has read the universe's source code and is patiently pointing at the relevant line* ",
  },
};

/**
 * Emotion overrides on top of the per-speaker baseline. Match emotion strings
 * from guild-cutscene-vo-lines.json. Unknown emotions fall back to the
 * baseline cleanly.
 */
const EMOTION_NUDGES: Partial<Record<string, Partial<Settings>>> = {
  warm_half_smile_conspiratorial: { style: 0.32 },
  hushed_reverent_dry_warmth: { stability: 0.65, style: 0.18 },
  warm_ceremonial: { style: 0.28 },
  cool_administrative: { stability: 0.72, style: 0.08 },
  cool_no_warmth: { stability: 0.75, style: 0.05 },
  dry_schoolmasterly_with_warmth: { style: 0.32 },
  warm_pride_dry_administrative: { style: 0.28 },
  cool_with_amusement_beat: { style: 0.18 },
  parade_ground_crisp: { stability: 0.6, style: 0.28 },
  parade_ground_three_pride_beats: { stability: 0.55, style: 0.32 },
  quieter_paced_with_pauses: { stability: 0.65, style: 0.2 },
  crisp_pride_beat: { stability: 0.55, style: 0.3 },
  crisp_pride: { stability: 0.55, style: 0.3 },
  warm_pride: { style: 0.3 },
  warm_reverent_pride: { stability: 0.6, style: 0.28 },
  tooltip_short: { stability: 0.6, style: 0.2 },
  tooltip_dusty_satisfaction: { stability: 0.65, style: 0.15 },
  tooltip_breath_reverb: { stability: 0.45, style: 0.42 },
  tooltip_half_whisper: { stability: 0.5, style: 0.4 },
  tooltip_parade_crisp: { stability: 0.6, style: 0.28 },
  tooltip_warm_conspiratorial: { stability: 0.55, style: 0.32 },
  tooltip_security_officer: { stability: 0.6, style: 0.22 },
  tooltip_dry_authority: { stability: 0.6, style: 0.25 },
  tooltip_weary_gravel: { stability: 0.55, style: 0.25 },
  tooltip_workshop_satisfaction: { stability: 0.6, style: 0.2 },
  tooltip_librarian_breathy: { stability: 0.5, style: 0.25 },
  // ─── Per-Professor light/dark variant nudges ───
  headmaster_warm_authority: { style: 0.3 },
  corrupted_authority: { stability: 0.5, style: 0.4 },
  professor_quiet_focus: { stability: 0.62, style: 0.22 },
  corrupted_quiet: { stability: 0.55, style: 0.35 },
  curator_archival_patient: { stability: 0.65, style: 0.15 },
  corrupted_archival: { stability: 0.55, style: 0.35 },
  professor_dimensional_calm: { stability: 0.5, style: 0.35 },
  corrupted_uncertainty: { stability: 0.45, style: 0.4 },
  professor_persuasive_warm: { stability: 0.5, style: 0.35 },
  corrupted_persuasive: { stability: 0.45, style: 0.42 },
  general_command_crisp: { stability: 0.6, style: 0.28 },
  corrupted_command: { stability: 0.55, style: 0.38 },
  senator_diplomatic: { stability: 0.5, style: 0.32 },
  corrupted_diplomatic: { stability: 0.45, style: 0.4 },
  warden_authoritative: { stability: 0.62, style: 0.22 },
  corrupted_authoritative: { stability: 0.55, style: 0.35 },
  professor_rule_authority: { stability: 0.6, style: 0.3 },
  corrupted_rule_authority: { stability: 0.5, style: 0.4 },
  doctor_calm_resolve: { stability: 0.58, style: 0.2 },
  corrupted_resolve: { stability: 0.5, style: 0.32 },
  artificer_workshop_pride: { stability: 0.6, style: 0.2 },
  corrupted_workshop: { stability: 0.5, style: 0.32 },
  proctor_quiet_revelation: { stability: 0.65, style: 0.15 },
  corrupted_revelation: { stability: 0.55, style: 0.32 },
  professor_warning_warm: { stability: 0.6, style: 0.25 },
};

interface VoLine {
  id: string;
  speaker: keyof typeof SPEAKER_SETTINGS;
  voiceId: string;
  manifest: string;
  text: string;
  context: string;
  section: string;
  emotion: string;
}

const REPO_ROOT = join(__dirname, "..", "..");
const PUBLIC_ROOT = join(REPO_ROOT, "apps", "client", "public");
const SHARED_ROOT = join(REPO_ROOT, "apps", "shared");
const LINES_FILE = join(__dirname, "guild-cutscene-vo-lines.json");

function manifestPathFor(speakerStem: string): string {
  return join(SHARED_ROOT, `${speakerStem}VoManifest.json`);
}

function resolveSettings(line: VoLine): Settings {
  const base = SPEAKER_SETTINGS[line.speaker];
  if (!base) {
    throw new Error(
      `No SPEAKER_SETTINGS registered for speaker '${line.speaker}' (line ${line.id}). Add an entry to SPEAKER_SETTINGS.`,
    );
  }
  const nudge = EMOTION_NUDGES[line.emotion] ?? {};
  return {
    ...base,
    ...nudge,
    text_prefix: (nudge.text_prefix ?? base.text_prefix) || "",
  };
}

async function generateSpeech(line: VoLine): Promise<Buffer> {
  const settings = resolveSettings(line);
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${line.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: line.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: settings.use_speaker_boost,
        },
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err.slice(0, 200)}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToS3(body: Buffer, id: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const fullKey = `${S3_PREFIX}/${id}.mp3`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: fullKey,
      Body: body,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey)}`;
}

function writeLocalMp3(body: Buffer, line: VoLine): string {
  const dir = join(PUBLIC_ROOT, OUTPUT_DIR);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${line.id}.mp3`);
  writeFileSync(path, body);
  return `/${OUTPUT_DIR}/${line.id}.mp3`;
}

function loadManifest(speakerStem: string): Record<string, string> {
  const path = manifestPathFor(speakerStem);
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeManifest(speakerStem: string, manifest: Record<string, string>): void {
  const path = manifestPathFor(speakerStem);
  writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const getOpt = (flag: string): string | undefined => {
    const eq = args.find((a) => a.startsWith(flag + "="));
    if (eq) return eq.split("=")[1];
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };
  const limitRaw = getOpt("--limit");
  return {
    skipTodo: args.includes("--skip-todo"),
    only: getOpt("--only"),
    dryRun: args.includes("--dry-run"),
    limit: limitRaw ? Number.parseInt(limitRaw, 10) : null,
  };
}

async function main() {
  const { skipTodo, only, dryRun, limit } = parseArgs();

  if (!ELEVENLABS_KEY && !dryRun) {
    console.error("ERROR: ELEVENLABS_API_KEY not set (use --dry-run to plan).");
    process.exit(1);
  }
  if (!existsSync(LINES_FILE)) {
    console.error(`ERROR: ${LINES_FILE} missing.`);
    process.exit(1);
  }

  const lines: VoLine[] = JSON.parse(readFileSync(LINES_FILE, "utf8"));

  // Validate every speaker has settings registered before doing any work.
  for (const line of lines) {
    if (!SPEAKER_SETTINGS[line.speaker]) {
      console.error(
        `ERROR: line ${line.id} uses speaker '${line.speaker}' which has no SPEAKER_SETTINGS entry.`,
      );
      process.exit(1);
    }
  }

  // Load each touched manifest into memory once. Per-line we'll skip if the
  // line id is already keyed in its target manifest.
  const touchedManifests = new Set(lines.map((l) => l.manifest));
  const manifests: Record<string, Record<string, string>> = {};
  for (const m of touchedManifests) manifests[m] = loadManifest(m);

  const alreadyDone = (line: VoLine): boolean =>
    Boolean(manifests[line.manifest][line.id]);

  let candidates = lines.filter((l) => !alreadyDone(l));
  if (skipTodo) candidates = candidates.filter((l) => !l.voiceId.startsWith("TODO"));
  if (only) {
    candidates = candidates.filter(
      (l) =>
        l.speaker === only ||
        l.section.includes(only) ||
        l.id.includes(only),
    );
  }
  if (limit !== null && limit >= 0) candidates = candidates.slice(0, limit);

  const todoVoices = lines.filter((l) => l.voiceId.startsWith("TODO"));
  const newManifests = [...touchedManifests].filter(
    (m) => !existsSync(manifestPathFor(m)),
  );

  console.log("═══════════════════════════════════════");
  console.log(`  GUILD-CUTSCENE VO GENERATOR`);
  console.log(`  ${lines.length} lines total across ${touchedManifests.size} manifests`);
  console.log(`  ${lines.length - candidates.length - (skipTodo ? todoVoices.length : 0)} already in manifests`);
  console.log(`  ${candidates.length} to generate on this run`);
  if (newManifests.length > 0) {
    console.log(`  ${newManifests.length} NEW manifest(s) will be created on first write:`);
    for (const m of newManifests.sort()) console.log(`    • ${m}VoManifest.json`);
  }
  if (todoVoices.length > 0 && !skipTodo) {
    console.log(
      `  ${todoVoices.length} line(s) have placeholder voice IDs — set the real IDs in ${LINES_FILE} or pass --skip-todo`,
    );
    const uniqueTodos = [...new Set(todoVoices.map((l) => l.voiceId))].sort();
    for (const t of uniqueTodos) console.log(`    • ${t}`);
  }
  console.log(`  Bucket: ${HAS_AWS ? `${BUCKET}/${S3_PREFIX}` : "(local only)"}`);
  console.log(`  Output dir: ${OUTPUT_DIR}`);
  console.log(`  Dry run: ${dryRun}`);
  console.log("═══════════════════════════════════════\n");

  if (dryRun) {
    for (const line of candidates) {
      const mark = line.voiceId.startsWith("TODO") ? " [TODO]" : "";
      console.log(
        `  ${line.id.padEnd(36)}  ${line.speaker.padEnd(14)}  → ${line.manifest}VoManifest.json  ${line.section}${mark}`,
      );
    }
    return;
  }

  let generated = 0;
  let errors = 0;

  for (const line of candidates) {
    if (line.voiceId.startsWith("TODO")) {
      console.log(`[skip] ${line.id} — placeholder voice ID ${line.voiceId}`);
      continue;
    }
    process.stdout.write(
      `[${generated + errors + 1}/${candidates.length}] ${line.id} (${line.speaker} → ${line.manifest})... `,
    );
    try {
      const audio = await generateSpeech(line);
      const localPath = writeLocalMp3(audio, line);
      // Persist local URL FIRST so an S3 failure can't strand the just-paid
      // ElevenLabs generation — re-runs will then skip this line via the
      // manifest hit instead of paying again.
      manifests[line.manifest][line.id] = localPath;
      writeManifest(line.manifest, manifests[line.manifest]);
      if (HAS_AWS) {
        try {
          const url = await uploadToS3(audio, line.id);
          manifests[line.manifest][line.id] = url;
          writeManifest(line.manifest, manifests[line.manifest]);
          console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB → S3`);
        } catch (s3err) {
          console.log(
            `⚠ ${(audio.length / 1024).toFixed(0)}KB → local OK, S3 failed (${(s3err as Error).message.slice(0, 80)})`,
          );
        }
      } else {
        console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB → local`);
      }
      generated++;
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      errors++;
      console.log(`✗ ${(err as Error).message}`);
      if ((err as Error).message.includes("429")) {
        console.log("  rate-limited — backing off 30s");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }
  }

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated:                       ${generated}`);
  console.log(`Skipped (manifest + TODO):       ${lines.length - generated - errors}`);
  console.log(`Errors:                          ${errors}`);
  console.log(`Manifests touched:               ${[...touchedManifests].sort().join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
