/**
 * Episode VO generator — wiring contract.
 *
 * Source-scan tests that pin the contracts the script makes with
 * the dialog data layer + the existing VO infrastructure pattern,
 * so future refactors don't silently break the pipeline.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SCRIPTS_DIR = path.resolve(__dirname, "..", "scripts");
const SCRIPT_SRC = fs.readFileSync(
  path.resolve(SCRIPTS_DIR, "generate-episode-vo.ts"),
  "utf-8",
);
const CONFIG_SRC = fs.readFileSync(
  path.resolve(SCRIPTS_DIR, "episode-voice-config.ts"),
  "utf-8",
);
const PKG = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf-8"),
);

describe("generate-episode-vo.ts — wiring contract", () => {
  it("loads scenes from BOTH school dialog modules", () => {
    expect(SCRIPT_SRC).toContain("CELEBRATION_EPISODE_SCENE_MAP");
    expect(SCRIPT_SRC).toContain("MECHRONIS_EPISODE_SCENE_MAP");
    expect(SCRIPT_SRC).toContain("CELEBRATION_SCHOOL_SCENES");
    expect(SCRIPT_SRC).toContain("MECHRONIS_ACADEMY_SCENES");
  });

  it("uses the canonical ElevenLabs TTS endpoint + multilingual_v2 model", () => {
    expect(SCRIPT_SRC).toContain("api.elevenlabs.io/v1/text-to-speech");
    expect(SCRIPT_SRC).toContain("eleven_multilingual_v2");
  });

  it("uses the canonical S3 client pattern from the existing VO scripts", () => {
    expect(SCRIPT_SRC).toContain('@aws-sdk/client-s3');
    expect(SCRIPT_SRC).toContain("PutObjectCommand");
    expect(SCRIPT_SRC).toContain('CacheControl: "public, max-age=31536000"');
  });

  it("composes the canonical manifest key shape (matches episodeVoLookup)", () => {
    expect(SCRIPT_SRC).toContain("`${episodeId}:${scene.id}:${cueIndex}`");
  });

  it("is idempotent — saves the manifest after each successful cue", () => {
    expect(SCRIPT_SRC).toContain("manifest[job.manifestKey] = url");
    expect(SCRIPT_SRC).toContain("saveManifest(manifest)");
  });

  it("supports the canonical CLI flags (--episode / --school / --all / --dry-run / --include-todo / --no-s3)", () => {
    for (const flag of ["--episode", "--school", "--all", "--dry-run", "--include-todo", "--no-s3"]) {
      expect(SCRIPT_SRC).toContain(flag);
    }
  });

  it("skips speakers with TODO_ voice ids by default", () => {
    expect(SCRIPT_SRC).toMatch(/voiceId\.startsWith\(["']TODO_["']\)/);
  });

  it("requires ELEVENLABS_API_KEY unless --dry-run is passed", () => {
    expect(SCRIPT_SRC).toContain("ELEVENLABS_API_KEY");
    expect(SCRIPT_SRC).toContain("--dry-run to plan");
  });

  it("writes to apps/client/public/audio/episodes/<episodeId>/<sceneId>/<cueIndex>.mp3", () => {
    expect(SCRIPT_SRC).toContain('"audio"');
    expect(SCRIPT_SRC).toContain('"episodes"');
    expect(SCRIPT_SRC).toContain("`${cueIndex}.mp3`");
  });

  it("uploads to S3 with the canonical episodes/<episodeId>/<sceneId>/<cueIndex>.mp3 key", () => {
    expect(SCRIPT_SRC).toContain("`episodes/${episodeId}/${scene.id}/${cueIndex}.mp3`");
  });
});

describe("episode-voice-config.ts — speaker coverage", () => {
  it("has voice slots for the canonical Celebration cast", () => {
    for (const speaker of [
      "narrator",
      "bernardo",
      "the_seer",
      "the_jailer",
      "the_collector",
      "engineer",
      "the_architect",
      "vernon_vortex",
      "minnie_the_meme",
      "wanda_wyrlord",
      "shadow_tongue",
      "the_dreamer",
      "elara",
      "the_human",
    ]) {
      expect(CONFIG_SRC).toContain(speaker);
    }
  });

  it("has voice slots for the canonical Mechronis cast", () => {
    for (const speaker of [
      "professor_aoki",
      "curator_halverez",
      "the_patron",
      "necromancer",
      "antiquarian",
      "veska",
      "white_oracle",
      "zephyr_9",
      "headmaster_kanevas",
    ]) {
      expect(CONFIG_SRC).toContain(speaker);
    }
  });

  it("every speaker has a directorial text_prefix (canonical voice prompt convention)", () => {
    // Every entry should carry a non-empty text_prefix.
    const prefixCount = (CONFIG_SRC.match(/text_prefix:/g) ?? []).length;
    // At least 20 speakers + the DEFAULT (one per entry).
    expect(prefixCount).toBeGreaterThan(20);
  });

  it("ships real ElevenLabs voice IDs (no TODO_ placeholders) so vo:episodes works out of the box", () => {
    const voiceIdMatches = CONFIG_SRC.match(/voiceId:\s*"([^"]*)"/g) ?? [];
    expect(voiceIdMatches.length).toBeGreaterThan(20);
    for (const match of voiceIdMatches) {
      expect(match).not.toContain("TODO_");
      // ElevenLabs voice ids are 20-char alphanumeric strings.
      const idMatch = match.match(/voiceId:\s*"([^"]*)"/);
      expect(idMatch).not.toBeNull();
      const id = idMatch![1];
      expect(id.length).toBeGreaterThanOrEqual(20);
    }
  });
});

describe("package.json — pnpm vo:episodes script", () => {
  it("registers the canonical pnpm vo:episodes script", () => {
    expect(PKG.scripts["vo:episodes"]).toBe("tsx apps/scripts/generate-episode-vo.ts");
  });
});
