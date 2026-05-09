#!/usr/bin/env python3
"""FIRST-MEET VO GENERATOR — 8 NPC first-meeting dialog trees.

Walks each apps/scripts/<npc>-first-meet-lines.json file (produced by
_generate-npc-first-meet-lines.mjs) and synthesises through ElevenLabs.
Each NPC writes into a manifest under apps/shared/:
  • Existing NPCs (degen / meme / seer / adjudicator-locke / game-master)
    merge into the already-shipping <npc>VoManifest.json. Line IDs
    are namespaced ("locke.first_meeting.root" etc.) so they never
    collide with existing keys.
  • New NPCs (oracle / vex-solene / wraith-calder) get a new manifest
    file at apps/shared/<camel>VoManifest.json.

Idempotent: if the audio already exists on S3 (or the manifest URL HEADs
200), the line is skipped and its URL is preserved.

Usage:
    python3 apps/scripts/generate_first_meet_vo.py
    python3 apps/scripts/generate_first_meet_vo.py --npc oracle
"""
import argparse, json, os, sys, time
import requests
import boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BUCKET = os.environ.get("S3_BUCKET", "dgrsvoices")
REGION = os.environ.get("AWS_REGION", "us-east-2")

HERE = os.path.dirname(__file__)
SHARED_DIR = os.path.join(HERE, "..", "shared")

# Per-NPC config: voice-id, S3 prefix (matches the existing per-character
# layout where one exists), manifest path. Where an NPC already has a
# python generator, we merge into its existing manifest so the client's
# manifest-loading code keeps a single lookup per character.
NPCS = {
    "adjudicator-locke": {
        "voice_id": "8XiBWqS5ffaH5naIFHPI",
        "s3_prefix": "Locke Voices/first_meeting",
        "manifest": "lockeVoManifest.json",
        "lines_file": "adjudicator-locke-first-meet-lines.json",
        "direction": "Authority's auditor — clipped legal cadence, weighing every word.",
    },
    "degen": {
        "voice_id": "r6VqF23i4qBEORazjelf",
        "s3_prefix": "Degen Voices/first_meeting",
        "manifest": "degenVoManifest.json",
        "lines_file": "degen-first-meet-lines.json",
        "direction": "Casino-floor charm with a gambler's edge; nothing is ever serious.",
    },
    "game-master": {
        "voice_id": "BCJrrrZvds7k3qzM9nXU",
        "s3_prefix": "GameMaster Voices/first_meeting",
        "manifest": "gamemasterVoManifest.json",
        "lines_file": "game-master-first-meet-lines.json",
        "direction": "Theatrical, public-address gravitas; performing for the room.",
    },
    "meme": {
        "voice_id": "VgFgBh5TnWeBhCBvCJ1E",
        "s3_prefix": "Meme Voices/first_meeting",
        "manifest": "memeVoManifest.json",
        "lines_file": "meme-first-meet-lines.json",
        "direction": "Sardonic, fourth-wall-aware, late-night-host cadence.",
    },
    "oracle": {
        "voice_id": "mpeeKhhSuOwXIwvKclcn",
        "s3_prefix": "Oracle Voices/first_meeting",
        "manifest": "oracleVoManifest.json",
        "lines_file": "oracle-first-meet-lines.json",
        "direction": "Pre-rite Wraith → post-rite Hierophant; voice that has been heard underneath others'.",
    },
    "seer": {
        "voice_id": "BTfBVfMM9XgZG8GG1bJn",
        "s3_prefix": "Seer Voices/first_meeting",
        "manifest": "seerVoManifest.json",
        "lines_file": "seer-first-meet-lines.json",
        "direction": "Distant, prophetic, transmission-from-elsewhere.",
    },
    "vex-solene": {
        "voice_id": "F1waTCPWl7KpShIScYQs",
        "s3_prefix": "VexSolene Voices/first_meeting",
        "manifest": "vexSoleneVoManifest.json",
        "lines_file": "vex-solene-first-meet-lines.json",
        "direction": "Maestro of Coda's commerce — market-as-music, conducting cadence.",
    },
    "wraith-calder": {
        "voice_id": "Vogq3iKs5PJ3cL39gFhW",
        "s3_prefix": "WraithCalder Voices/first_meeting",
        "manifest": "wraithCalderVoManifest.json",
        "lines_file": "wraith-calder-first-meet-lines.json",
        "direction": "The Hierophant; written, near-silent, weight in pauses.",
    },
}

# First-meet lines are tagged emotion="first_meeting" — one tuning band
# per NPC keeps delivery coherent across the encounter.
DEFAULT_TTS = {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30}


def head_exists(url):
    try:
        return requests.head(url, timeout=10).status_code == 200
    except Exception:
        return False


def generate_speech(text, voice_id, direction):
    payload_text = f"*{direction}* {text}" if direction else text
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": payload_text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {**DEFAULT_TTS, "use_speaker_boost": True},
        },
    )
    resp.raise_for_status()
    return resp.content


_s3_client = None
def s3():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client(
            "s3",
            region_name=REGION,
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", ""),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", ""),
        )
    return _s3_client


def upload(data, key):
    s3().put_object(
        Bucket=BUCKET, Key=key, Body=data,
        ContentType="audio/mpeg",
        CacheControl="public, max-age=31536000",
    )
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{key.replace(' ', '+')}"


def s3_url(prefix, line_id):
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{prefix.replace(' ', '+')}/{line_id}.mp3"


def run_npc(npc_key, cfg):
    lines_path = os.path.join(HERE, cfg["lines_file"])
    if not os.path.exists(lines_path):
        print(f"[skip] {npc_key}: no lines file at {lines_path}")
        return 0, 0, []
    with open(lines_path) as f:
        lines = json.load(f)
    manifest_path = os.path.join(SHARED_DIR, cfg["manifest"])
    try:
        with open(manifest_path) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}
    print(f"\n--- first-meet/{npc_key} | voice={cfg['voice_id']} | {len(lines)} lines | manifest={cfg['manifest']}")
    errors = []
    generated = 0
    for i, line in enumerate(lines):
        line_id = line["id"]
        s3_key = f"{cfg['s3_prefix']}/{line_id}.mp3"
        existing = manifest.get(line_id)
        check_url = existing if (isinstance(existing, str) and existing.startswith("http")) else s3_url(cfg["s3_prefix"], line_id)
        if head_exists(check_url):
            if existing != check_url:
                manifest[line_id] = check_url
                with open(manifest_path, "w") as _mf:
                    json.dump(manifest, _mf, indent=2)
            continue
        try:
            sys.stdout.write(f"  [{i+1}/{len(lines)}] {line_id}... ")
            sys.stdout.flush()
            audio = generate_speech(line["text"], cfg["voice_id"], cfg["direction"])
            url = upload(audio, s3_key)
            manifest[line_id] = url
            with open(manifest_path, "w") as _mf:
                json.dump(manifest, _mf, indent=2)
            print(f"ok {len(audio)//1024}KB")
            generated += 1
            time.sleep(0.2)
        except Exception as e:
            print(f"FAIL {e}")
            errors.append({"id": line_id, "error": str(e)})
            if "429" in str(e):
                print("  Rate limited — waiting 30s...")
                time.sleep(30)
    print(f"  {npc_key}: {generated} generated, {len(errors)} errors")
    return generated, len(lines), errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--npc", choices=list(NPCS.keys()), default=None)
    args = ap.parse_args()

    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key")
        sys.exit(1)

    targets = [args.npc] if args.npc else list(NPCS.keys())
    print(f"=== FIRST-MEET VO GENERATOR ===\n  {len(targets)} NPC(s)")

    total_gen = total_lines = total_errors = 0
    for npc in targets:
        cfg = NPCS[npc]
        gen, total, errs = run_npc(npc, cfg)
        total_gen += gen
        total_lines += total
        total_errors += len(errs)

    print(f"\n=== FIRST-MEET COMPLETE: {total_gen} new / {total_lines} total / {total_errors} errors ===")


if __name__ == "__main__":
    main()
