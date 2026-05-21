#!/usr/bin/env python3
"""
VO GAP-FILL GENERATOR — generates only what hasn't been generated yet.

Walks the CHARACTERS table; for each character:
  1. Loads <name>-lines.json    (canonical line source)
  2. Loads <name>VoManifest.json (already-generated id → URL map)
  3. Diffs to find lines whose `id` is NOT in the manifest
  4. For each gap, calls ElevenLabs TTS with the character's voice id +
     the line's emotion-tuned settings, uploads to S3, writes the URL
     back into the manifest IMMEDIATELY (manifest is the resumability
     contract — re-running picks up where the last run failed).

Idempotent. Resumable. Safe to re-run after rate-limit or network
errors. Skips characters whose voice_id is still a placeholder.

Run:
  ELEVENLABS_API_KEY=... AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \\
      python3 apps/scripts/generate_vo_gaps.py

Filter to a subset:
  python3 apps/scripts/generate_vo_gaps.py --only wraith_calder,lycos

Dry-run (count only, no API calls):
  python3 apps/scripts/generate_vo_gaps.py --dry-run

Deps: pip install requests boto3
"""

import argparse
import json
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import requests
import boto3

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPTS_DIR = REPO_ROOT / "apps" / "scripts"
SHARED_DIR = REPO_ROOT / "apps" / "shared"

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
AWS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
AWS_SECRET = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
BUCKET = "dgrsvoices"
REGION = "us-east-2"

# ─── EMOTION → ElevenLabs voice settings ────────────────
# Extends the emotion vocabulary the per-character generators use;
# any unknown emotion falls back to "neutral".
EMOTIONS = {
    # legacy emotion set (Elara / Locke / etc.)
    "warm":        {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35},
    "urgent":      {"stability": 0.25, "similarity_boost": 0.72, "style": 0.65},
    "curious":     {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45},
    "fearful":     {"stability": 0.20, "similarity_boost": 0.70, "style": 0.70},
    "analytical":  {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20},
    "sad":         {"stability": 0.30, "similarity_boost": 0.75, "style": 0.55},
    "hopeful":     {"stability": 0.40, "similarity_boost": 0.78, "style": 0.50},
    "betrayed":    {"stability": 0.20, "similarity_boost": 0.72, "style": 0.75},
    "reassuring":  {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30},
    "excited":     {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60},
    "serious":     {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25},
    "whispered":   {"stability": 0.35, "similarity_boost": 0.72, "style": 0.40},
    "commanding":  {"stability": 0.45, "similarity_boost": 0.78, "style": 0.55},
    "first_meeting": {"stability": 0.50, "similarity_boost": 0.78, "style": 0.30},
    # Section D5 trio emotion vocabulary
    "calibrated":  {"stability": 0.60, "similarity_boost": 0.78, "style": 0.18},
    "considered":  {"stability": 0.55, "similarity_boost": 0.78, "style": 0.22},
    "vulnerable":  {"stability": 0.32, "similarity_boost": 0.74, "style": 0.55},
    "grateful":    {"stability": 0.48, "similarity_boost": 0.78, "style": 0.33},
    "tender":      {"stability": 0.40, "similarity_boost": 0.76, "style": 0.45},
    "settled":     {"stability": 0.55, "similarity_boost": 0.78, "style": 0.22},
    "correcting":  {"stability": 0.50, "similarity_boost": 0.76, "style": 0.40},
    "weary":       {"stability": 0.45, "similarity_boost": 0.75, "style": 0.32},
    "wry":         {"stability": 0.50, "similarity_boost": 0.77, "style": 0.42},
    "patient":     {"stability": 0.58, "similarity_boost": 0.78, "style": 0.20},
    "firm":        {"stability": 0.52, "similarity_boost": 0.78, "style": 0.38},
    "cold":        {"stability": 0.55, "similarity_boost": 0.76, "style": 0.28},
    "refused":     {"stability": 0.55, "similarity_boost": 0.76, "style": 0.35},
    "resolved":    {"stability": 0.55, "similarity_boost": 0.78, "style": 0.30},
    "reflective":  {"stability": 0.55, "similarity_boost": 0.78, "style": 0.28},
    "kindred":     {"stability": 0.48, "similarity_boost": 0.78, "style": 0.30},
    "relieved":    {"stability": 0.48, "similarity_boost": 0.78, "style": 0.32},
    "quiet":       {"stability": 0.55, "similarity_boost": 0.76, "style": 0.25},
    "neutral":     {"stability": 0.50, "similarity_boost": 0.78, "style": 0.28},
}


@dataclass
class CharacterBank:
    """One per-character VO bank — line source + manifest target + voice."""
    key: str
    lines_filename: str
    manifest_filename: str
    voice_id: str
    s3_prefix: str

    @property
    def lines_path(self) -> Path:
        return SCRIPTS_DIR / self.lines_filename

    @property
    def manifest_path(self) -> Path:
        return SHARED_DIR / self.manifest_filename

    @property
    def is_ready(self) -> bool:
        """True if a voice id is assigned (not a placeholder)."""
        return bool(self.voice_id) and not self.voice_id.startswith("TODO:")

    @property
    def is_authored(self) -> bool:
        """True if the lines.json file exists on disk."""
        return self.lines_path.exists()


# ─── CHARACTER TABLE ────────────────────────────────────
# Add a row here for every <character>-lines.json + matching
# <character>VoManifest.json you want gap-fill to process.
#
# When adding a new character:
#   1. Pick an ElevenLabs voice id (https://elevenlabs.io/voice-library)
#   2. Plug it in below + commit the choice (the voice id is part of
#      canonical character identity).
#   3. Re-run the script. It generates only the gap.
#
# Placeholder voice ids (prefixed "TODO:") cause the character to be
# skipped with a documented reason — keeps the script honest while
# the voice casting is in flight.
CHARACTERS: list[CharacterBank] = [
    # ── Existing banks (already generated; gap-fill is a no-op
    #    unless lines were added since the last full run). ──
    CharacterBank("elara",        "elara-lines.json",        "elaraVoManifest.json",     "xMyNDrPFEtQN8iZtT7l2", "Elara Voices"),
    CharacterBank("the_human",    "human-lines.json",        "humanVoManifest.json",     "oGbGJdgofRR8z0MxwI8L", "Human Voices"),
    CharacterBank("antiquarian",  "antiquarian-lines.json",  "antiquarianVoManifest.json","yAKlvHIsuj4SvnKQ6Mk4", "Antiquarian Voices"),
    CharacterBank("agent_zero",   "agent_zero-lines.json",   "agent_zeroVoManifest.json","F1waTCPWl7KpShIScYQs", "AgentZero Voices"),
    CharacterBank("degen",        "degen-lines.json",        "degenVoManifest.json",     "r6VqF23i4qBEORazjelf", "Degen Voices"),
    CharacterBank("locke",        "locke-lines.json",        "lockeVoManifest.json",     "8XiBWqS5ffaH5naIFHPI", "Locke Voices"),
    CharacterBank("meme",         "meme-lines.json",         "memeVoManifest.json",      "VgFgBh5TnWeBhCBvCJ1E", "Meme Voices"),
    CharacterBank("necromancer",  "necromancer-lines.json",  "necromancerVoManifest.json","II5QotwxLcQdwey5xEyd", "Necromancer Voices"),
    CharacterBank("nilmorg",      "nilmorg-lines.json",      "nilmorgVoManifest.json",   "7fKASPr2SR0NYifziNgu", "Nilmorg Voices"),
    CharacterBank("seer",         "seer-lines.json",         "seerVoManifest.json",      "BTfBVfMM9XgZG8GG1bJn", "Seer Voices"),
    CharacterBank("source",       "source-lines.json",       "sourceVoManifest.json",    "hfq5qawrYj4gqFsfoE28", "Source Voices"),
    CharacterBank("shadow_tongue","shadow-tongue-lines.json","shadowTongueVoManifest.json","14wGKUgRFDPSwtCQurbB","ShadowTongue Voices"),

    # ── Section D5 trio (voice ids pending — placeholders skip
    #    the character cleanly until the casting lands). ──
    CharacterBank("wraith_calder", "wraith-calder-lines.json", "wraithCalderVoManifest.json",
                  "Vogq3iKs5PJ3cL39gFhW",    "WraithCalder Voices"),
    CharacterBank("akai_shi",      "akai-shi-lines.json",      "akaiShiVoManifest.json",
                  "AQYSOeM9rkJY878exSfM",    "AkaiShi Voices"),
    CharacterBank("lycos",         "lycos-lines.json",         "lycosVoManifest.json",
                  "rfHVfqlu6LXw4vLf7q4i",    "Lycos Voices"),
]


def generate_speech(text: str, emotion: str, voice_id: str) -> bytes:
    """Call ElevenLabs TTS API with emotion-tuned voice settings."""
    settings = EMOTIONS.get(emotion, EMOTIONS["neutral"])
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": settings["stability"],
                "similarity_boost": settings["similarity_boost"],
                "style": settings["style"],
                "use_speaker_boost": True,
            },
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.content


def upload_to_s3(data: bytes, s3_prefix: str, key: str) -> str:
    """Upload MP3 to S3; return public URL (URL-encoded spaces)."""
    s3 = boto3.client(
        "s3",
        region_name=REGION,
        aws_access_key_id=AWS_KEY_ID,
        aws_secret_access_key=AWS_SECRET,
    )
    full_key = f"{s3_prefix}/{key}"
    s3.put_object(
        Bucket=BUCKET,
        Key=full_key,
        Body=data,
        ContentType="audio/mpeg",
        CacheControl="public, max-age=31536000",
    )
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{full_key.replace(' ', '+')}"


def load_lines(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return json.load(f)


def load_manifest(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    try:
        with path.open() as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def save_manifest(path: Path, manifest: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
        f.write("\n")


def process_bank(bank: CharacterBank, dry_run: bool) -> dict:
    """Generate the gap for one character bank. Returns a summary dict."""
    lines = load_lines(bank.lines_path)
    manifest = load_manifest(bank.manifest_path)
    gap = [ln for ln in lines if ln["id"] not in manifest]

    summary = {
        "key": bank.key,
        "total_lines": len(lines),
        "already_generated": len(manifest),
        "gap": len(gap),
        "generated_this_run": 0,
        "errors": [],
    }

    if not bank.is_authored:
        summary["skipped_reason"] = f"lines file missing: {bank.lines_path.name}"
        return summary

    if not bank.is_ready:
        summary["skipped_reason"] = (
            f"voice id is placeholder ({bank.voice_id}); assign a real "
            f"ElevenLabs voice id in CHARACTERS and re-run."
        )
        return summary

    if not gap:
        summary["skipped_reason"] = "nothing to generate — manifest already covers every line"
        return summary

    if dry_run:
        summary["skipped_reason"] = f"dry-run; would generate {len(gap)} lines"
        return summary

    if not ELEVENLABS_KEY or not AWS_KEY_ID or not AWS_SECRET:
        summary["skipped_reason"] = (
            "missing ELEVENLABS_API_KEY / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars"
        )
        return summary

    print(f"\n=== {bank.key} ===")
    print(f"    lines: {len(lines)}  in-manifest: {len(manifest)}  gap: {len(gap)}")
    print(f"    voice: {bank.voice_id}  s3: {BUCKET}/{bank.s3_prefix}/")

    for i, line in enumerate(gap, start=1):
        emotion = line.get("emotion", "neutral")
        context = line.get("context", "misc")
        s3_key = f"{context}/{line['id']}.mp3"
        sys.stdout.write(f"  [{i}/{len(gap)}] {line['id']} ({emotion})... ")
        sys.stdout.flush()
        try:
            audio = generate_speech(line["text"], emotion, bank.voice_id)
            url = upload_to_s3(audio, bank.s3_prefix, s3_key)
            manifest[line["id"]] = url
            # Persist after EVERY line so a crash mid-run still records progress.
            save_manifest(bank.manifest_path, manifest)
            summary["generated_this_run"] += 1
            print(f"✓ {len(audio) // 1024}KB")
            time.sleep(0.15)
        except requests.HTTPError as exc:
            status = exc.response.status_code if exc.response is not None else "?"
            print(f"✗ HTTP {status}")
            summary["errors"].append({"id": line["id"], "error": f"HTTP {status}: {exc}"})
            if str(status) == "429":
                print("    rate-limited — sleeping 30s")
                time.sleep(30)
        except Exception as exc:
            print(f"✗ {exc}")
            summary["errors"].append({"id": line["id"], "error": str(exc)})

    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument(
        "--only",
        type=str,
        default="",
        help="Comma-separated character keys to process (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Count missing lines per character; no API calls",
    )
    args = parser.parse_args()

    selected = set(s.strip() for s in args.only.split(",") if s.strip())
    banks = [b for b in CHARACTERS if not selected or b.key in selected]

    print("════════════════════════════════════════════════════════")
    print("  VO GAP-FILL GENERATOR")
    print(f"  characters: {len(banks)}  dry_run={args.dry_run}")
    print("════════════════════════════════════════════════════════")

    summaries: list[dict] = []
    for bank in banks:
        summaries.append(process_bank(bank, args.dry_run))

    # Final table
    print("\n══ SUMMARY ══")
    print(f"{'character':<18} {'total':>6} {'have':>6} {'gap':>6} {'gen':>6}  status")
    for s in summaries:
        status = s.get("skipped_reason") or (
            f"OK  ({len(s['errors'])} error(s))" if s["errors"] else "OK"
        )
        print(
            f"{s['key']:<18} {s['total_lines']:>6} {s['already_generated']:>6} "
            f"{s['gap']:>6} {s['generated_this_run']:>6}  {status}"
        )

    # Persist a single combined error log if any.
    all_errors = [
        {"character": s["key"], **e} for s in summaries for e in s["errors"]
    ]
    if all_errors:
        err_path = SCRIPTS_DIR / "vo-gap-errors.json"
        with err_path.open("w") as f:
            json.dump(all_errors, f, indent=2)
        print(f"\nerror log: {err_path}  ({len(all_errors)} entries)")

    return 1 if all_errors else 0


if __name__ == "__main__":
    sys.exit(main())
