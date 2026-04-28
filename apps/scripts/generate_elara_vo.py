#!/usr/bin/env python3
"""
ELARA VO GENERATOR — ElevenLabs TTS + S3 Upload

Generates all 71 Elara voice lines with emotion-tuned settings,
uploads to S3, outputs manifest JSON for the game.

Run:  python3 scripts/generate_elara_vo.py
Deps: pip install requests boto3
"""

import json, os, sys, time
import requests
import boto3

# ─── CONFIG ───
ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "xMyNDrPFEtQN8iZtT7l2"
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Elara Voices"
AWS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
AWS_SECRET = os.environ.get("AWS_SECRET_ACCESS_KEY", "")

# ─── EMOTION → VOICE SETTINGS ───
EMOTIONS = {
    "warm":        {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*speaking warmly and reassuringly* "},
    "urgent":      {"stability": 0.25, "similarity_boost": 0.72, "style": 0.65, "prefix": "*with urgency and alarm* "},
    "curious":     {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*with genuine curiosity* "},
    "fearful":     {"stability": 0.20, "similarity_boost": 0.70, "style": 0.70, "prefix": "*trembling slightly, afraid* "},
    "analytical":  {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*matter-of-fact, analytical* "},
    "sad":         {"stability": 0.30, "similarity_boost": 0.75, "style": 0.55, "prefix": "*with sadness and loss* "},
    "hopeful":     {"stability": 0.40, "similarity_boost": 0.78, "style": 0.50, "prefix": "*with rising hope* "},
    "betrayed":    {"stability": 0.20, "similarity_boost": 0.72, "style": 0.75, "prefix": "*hurt and betrayed* "},
    "reassuring":  {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30, "prefix": "*calm and reassuring* "},
    "excited":     {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60, "prefix": "*with excitement and wonder* "},
    "serious":     {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25, "prefix": "*seriously, with gravity* "},
    "whispered":   {"stability": 0.35, "similarity_boost": 0.72, "style": 0.40, "prefix": "*whispering* "},
    "commanding":  {"stability": 0.45, "similarity_boost": 0.78, "style": 0.55, "prefix": "*with authority and command* "},
}

def generate_speech(text, emotion):
    """Call ElevenLabs TTS API with emotion-tuned settings."""
    settings = EMOTIONS.get(emotion, EMOTIONS["warm"])
    full_text = settings["prefix"] + text

    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": full_text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": settings["stability"],
                "similarity_boost": settings["similarity_boost"],
                "style": settings["style"],
                "use_speaker_boost": True,
            },
        },
    )
    resp.raise_for_status()
    return resp.content

def upload_to_s3(data, key):
    """Upload MP3 to S3 and return public URL."""
    s3 = boto3.client("s3", region_name=REGION,
        aws_access_key_id=AWS_KEY_ID,
        aws_secret_access_key=AWS_SECRET)

    full_key = f"{S3_PREFIX}/{key}"
    s3.put_object(Bucket=BUCKET, Key=full_key, Body=data,
        ContentType="audio/mpeg",
        CacheControl="public, max-age=31536000")

    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{full_key.replace(' ', '+')}"

def main():
    # Load lines
    lines_path = os.path.join(os.path.dirname(__file__), "elara-lines.json")
    with open(lines_path) as f:
        lines = json.load(f)

    print(f"═══════════════════════════════════════")
    print(f"  ELARA VO GENERATOR")
    print(f"  {len(lines)} lines to generate")
    print(f"  Voice: {VOICE_ID} (Engineer Zero)")
    print(f"  Bucket: {BUCKET}/{S3_PREFIX}")
    print(f"═══════════════════════════════════════\n")

    # IDEMPOTENT_PATCH
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "elaraVoManifest.json")
    try:
        with open(manifest_path) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}
    initial_count = len(manifest)
    errors = []

    for i, line in enumerate(lines):
        s3_key = f"{line['context']}/{line['id']}.mp3"
        if line["id"] in manifest:
            print(f"[{i+1}/{len(lines)}] {line['id']} (already in manifest, skipping)")
            continue
        try:
            sys.stdout.write(f"[{i+1}/{len(lines)}] {line['id']} ({line['emotion']})... ")
            sys.stdout.flush()

            audio = generate_speech(line["text"], line["emotion"])
            url = upload_to_s3(audio, s3_key)
            manifest[line["id"]] = url
            with open(manifest_path, "w") as _mf:
                json.dump(manifest, _mf, indent=2)
            print(f"✓ {len(audio)//1024}KB")

            time.sleep(0.15)  # Rate limit
        except Exception as e:
            print(f"✗ {e}")
            errors.append({"id": line["id"], "error": str(e)})
            if "429" in str(e):
                print("  Rate limited — waiting 30s...")
                time.sleep(30)

    # Save manifest
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "elaraVoManifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\n═══ COMPLETE ═══")
    print(f"Generated: {len(manifest)}/{len(lines)}")
    print(f"Errors: {len(errors)}")
    print(f"Manifest: {manifest_path}")

    if errors:
        err_path = os.path.join(os.path.dirname(__file__), "elara-vo-errors.json")
        with open(err_path, "w") as f:
            json.dump(errors, f, indent=2)
        print(f"Error log: {err_path}")

if __name__ == "__main__":
    main()
