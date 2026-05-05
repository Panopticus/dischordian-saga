#!/usr/bin/env python3
"""ACT 1 OPPONENT TAUNT VO GENERATOR — ElevenLabs TTS + S3 Upload

Renders the 21 mid-match taunt lines for the seven Act-1 opponents
that didn't have a dedicated generator: collector, watcher, eidola,
matrikala, authority, programmer, warlord. Each character has its
own voice id, S3 prefix, and per-character VoManifest.

Lines are pulled verbatim from apps/shared/act1OpponentDialog.ts
(the same module the gameplay reads at runtime), so the audio
matches the on-screen text exactly.

Run: python3 apps/scripts/generate_act1_taunts_vo.py

Idempotent: HEAD-checks each line's S3 URL (existing manifest URL
when present, canonical computed URL otherwise). Skips when the
audio is already reachable; generates + uploads when it's missing.
"""
import json, os, sys, time
# `requests` and `boto3` are deferred to the call sites so --dry-run
# (audit Phase M) can run with only the stdlib installed.

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BUCKET = "dgrsvoices"
REGION = "us-east-2"

# Per-character config: voice_id, S3 prefix (matches existing
# manifest URL paths), VoManifest filename.
CHARACTERS = {
    "collector": {
        "voice_id": "RIxivqUM0unaDjCxkHyr",
        "s3_prefix": "Collector Voices",
        "manifest": "collectorVoManifest.json",
    },
    "watcher": {
        "voice_id": "bez1UNea9Mdx4PwE4xkC",
        "s3_prefix": "Watcher Voices",
        "manifest": "watcherVoManifest.json",
    },
    "eidola": {
        "voice_id": "gclOFJffti38SCrcsEPl",
        "s3_prefix": "Eidola Voices",
        "manifest": "eidolaVoManifest.json",
    },
    "matrikala": {
        "voice_id": "XKH2coLtMnPddLRG7oMW",
        "s3_prefix": "Matrikala Voices",
        "manifest": "matrikalaVoManifest.json",
    },
    "authority": {
        "voice_id": "bBHJS7m4eXuHz5YaKP4B",
        "s3_prefix": "Authority Voices",
        "manifest": "authorityVoManifest.json",
    },
    "programmer": {
        "voice_id": "1q0znKQADwaKdTNWneaW",
        "s3_prefix": "Programmer Voices",
        "manifest": "programmerVoManifest.json",
    },
    "warlord": {
        "voice_id": "F1waTCPWl7KpShIScYQs",
        "s3_prefix": "Warlord Voices",
        "manifest": "warlordVoManifest.json",
    },
}

# Emotion presets calibrated per the casting briefs in the chat.
EMOTIONS = {
    "covetous":   {"stability": 0.35, "similarity_boost": 0.75, "style": 0.55,
                   "prefix": "*childlike, covetous, sing-song with an edge of hunger* "},
    "tender":     {"stability": 0.40, "similarity_boost": 0.78, "style": 0.45,
                   "prefix": "*tenderly coaxing, almost loving — which is the unsettling part* "},
    "recording":  {"stability": 0.65, "similarity_boost": 0.78, "style": 0.15,
                   "prefix": "*child voice, dispassionate, recording-impersonal — no malice, no engagement* "},
    "socratic":   {"stability": 0.50, "similarity_boost": 0.78, "style": 0.30,
                   "prefix": "*Socratic professor, patient, examining, never hurried* "},
    "patient":    {"stability": 0.55, "similarity_boost": 0.78, "style": 0.25,
                   "prefix": "*quietly patient, the way a tutor is patient when you're almost there* "},
    "whispered":  {"stability": 0.55, "similarity_boost": 0.75, "style": 0.20,
                   "prefix": "*near-whispered, attentive, lower volume than the room* "},
    "attentive":  {"stability": 0.50, "similarity_boost": 0.78, "style": 0.25,
                   "prefix": "*reactor-quiet, listening, every word measured* "},
    "judicial":   {"stability": 0.65, "similarity_boost": 0.80, "style": 0.20,
                   "prefix": "*bureaucratic-judicial, calm, glacial — procedure not threat* "},
    "cryptic":    {"stability": 0.45, "similarity_boost": 0.75, "style": 0.40,
                   "prefix": "*cryptic, dryly amused, holding a secret you don't get to read* "},
    "tactical":   {"stability": 0.55, "similarity_boost": 0.80, "style": 0.30,
                   "prefix": "*tactical, certain, arithmetic in the voice — not boasting, just stating* "},
}


def head_exists(url):
    import requests  # deferred — see top-of-file note
    try:
        return requests.head(url, timeout=10).status_code == 200
    except Exception:
        return False


def s3_url(prefix, key):
    return (
        f"https://{BUCKET}.s3.{REGION}.amazonaws.com/"
        f"{prefix.replace(' ', '+')}/{key.replace(' ', '+')}"
    )


def generate_speech(text, emotion, voice_id):
    import requests  # deferred — see top-of-file note
    s = EMOTIONS.get(emotion, EMOTIONS["judicial"])
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": s["prefix"] + text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": s["stability"],
                "similarity_boost": s["similarity_boost"],
                "style": s["style"],
                "use_speaker_boost": True,
            },
        },
    )
    resp.raise_for_status()
    return resp.content


def upload_to_s3(data, prefix, key):
    import boto3  # deferred — see top-of-file note
    s3 = boto3.client(
        "s3", region_name=REGION,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", ""),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", ""),
    )
    full_key = f"{prefix}/{key}"
    s3.put_object(
        Bucket=BUCKET, Key=full_key, Body=data,
        ContentType="audio/mpeg", CacheControl="public, max-age=31536000",
    )
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{full_key.replace(' ', '+')}"


def main():
    dry_run = "--dry-run" in sys.argv

    here = os.path.dirname(__file__)
    with open(os.path.join(here, "act1-taunts-lines.json")) as f:
        lines = json.load(f)

    print(f"═══ ACT 1 OPPONENT TAUNT VO ═══")
    print(f"  {len(lines)} lines across {len(CHARACTERS)} characters")
    if dry_run:
        print(f"  Mode: DRY RUN (no API calls, no S3 writes)\n")
    else:
        print()

    if dry_run:
        # Audit Phase M (B): structure-only validation. Walk the input
        # lines, confirm every character maps to a CHARACTERS entry +
        # has a non-TODO voice_id, and every emotion has an EMOTIONS
        # preset. Reports what WOULD be generated without touching
        # ElevenLabs or S3.
        unknown_chars = []
        todo_voices = []
        unknown_emotions = []
        will_generate = 0
        for line in lines:
            cfg = CHARACTERS.get(line["character"])
            if not cfg:
                unknown_chars.append(f"{line['id']} (character={line['character']!r})")
                continue
            if cfg["voice_id"].startswith("TODO_"):
                todo_voices.append(line["character"])
                continue
            if line["emotion"] not in EMOTIONS:
                unknown_emotions.append(f"{line['id']} (emotion={line['emotion']!r})")
                continue
            will_generate += 1
        print(f"Would generate: {will_generate} / {len(lines)}")
        if unknown_chars:
            print(f"Unknown characters: {len(unknown_chars)}")
            for u in unknown_chars[:5]:
                print(f"  - {u}")
        if todo_voices:
            unique_chars = sorted(set(todo_voices))
            print(f"Characters with TODO voice ids: {unique_chars}")
        if unknown_emotions:
            print(f"Unknown emotions: {len(unknown_emotions)}")
            for u in unknown_emotions[:5]:
                print(f"  - {u}")
        return 0 if not (unknown_chars or unknown_emotions) else 1

    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key (or use --dry-run)")
        sys.exit(1)

    # Lazy-load each character's manifest as we encounter its first line.
    manifests = {}
    manifest_paths = {}

    for i, line in enumerate(lines):
        cfg = CHARACTERS.get(line["character"])
        if not cfg:
            print(f"[{i+1}/{len(lines)}] {line['id']} — UNKNOWN CHARACTER {line['character']!r}, skipping")
            continue

        ch = line["character"]
        if ch not in manifests:
            manifest_paths[ch] = os.path.join(here, "..", "shared", cfg["manifest"])
            try:
                with open(manifest_paths[ch]) as _mf:
                    manifests[ch] = json.load(_mf)
            except (FileNotFoundError, json.JSONDecodeError):
                manifests[ch] = {}

        s3_key = f"act1_taunts/{line['id']}.mp3"
        existing = manifests[ch].get(line["id"])
        check_url = (
            existing
            if isinstance(existing, str) and existing.startswith("http")
            else s3_url(cfg["s3_prefix"], s3_key)
        )

        if head_exists(check_url):
            print(f"[{i+1}/{len(lines)}] {line['id']} (audio on S3, skipping)")
            if existing != check_url:
                manifests[ch][line["id"]] = check_url
                with open(manifest_paths[ch], "w") as _mf:
                    json.dump(manifests[ch], _mf, indent=2)
            continue

        try:
            sys.stdout.write(
                f"[{i+1}/{len(lines)}] {line['id']} ({ch}/{line['emotion']})... "
            )
            sys.stdout.flush()
            audio = generate_speech(line["text"], line["emotion"], cfg["voice_id"])
            url = upload_to_s3(audio, cfg["s3_prefix"], s3_key)
            manifests[ch][line["id"]] = url
            with open(manifest_paths[ch], "w") as _mf:
                json.dump(manifests[ch], _mf, indent=2)
            print(f"✓ {len(audio)//1024}KB")
            time.sleep(0.15)
        except Exception as e:
            print(f"✗ {e}")
            if "429" in str(e):
                print("  Rate limited — waiting 30s...")
                time.sleep(30)

    print("\n  done.")


if __name__ == "__main__":
    main()
