#!/usr/bin/env python3
"""APPRENTICE VO GENERATOR — 12 archetypes × 2 genders = 24 voices.

Reads apps/scripts/apprentice-voice-config.json for the voice-id ↔ archetype
map, then walks every apps/scripts/apprentice-<archetype>-<gender>-lines.json
file and synthesises through ElevenLabs. Writes one manifest per (archetype,
gender) at apps/shared/apprentice<Archetype><Gender>VoManifest.json.

Idempotent: if the audio already exists on S3 (or already has a manifest URL
that HEADs 200), the line is skipped and the manifest URL is preserved.

Usage:
    python3 apps/scripts/generate_apprentice_vo.py
    python3 apps/scripts/generate_apprentice_vo.py --archetype zealot
    python3 apps/scripts/generate_apprentice_vo.py --archetype zealot --gender female
"""
import argparse, json, os, sys, time
import requests
import boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BUCKET = os.environ.get("S3_BUCKET", "dgrsvoices")
REGION = os.environ.get("AWS_REGION", "us-east-2")
S3_PREFIX_ROOT = "Apprentice Voices"

HERE = os.path.dirname(__file__)
CONFIG_PATH = os.path.join(HERE, "apprentice-voice-config.json")
SHARED_DIR = os.path.join(HERE, "..", "shared")

# Per-emotion TTS settings. Apprentice line files use 26 distinct emotions; a
# missing key falls back to "default". Prefixes are short delivery-direction
# hints prepended to the synth payload.
EMOTIONS = {
    "default":    {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": ""},
    "warm":       {"stability": 0.45, "similarity_boost": 0.80, "style": 0.30, "prefix": "*warm, friendly* "},
    "soft":       {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*soft, low-volume* "},
    "tender":     {"stability": 0.55, "similarity_boost": 0.80, "style": 0.25, "prefix": "*tender, careful* "},
    "wry":        {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*wry, dry* "},
    "edged":      {"stability": 0.35, "similarity_boost": 0.75, "style": 0.55, "prefix": "*edged, sharp* "},
    "thrilled":   {"stability": 0.30, "similarity_boost": 0.75, "style": 0.65, "prefix": "*thrilled, alive* "},
    "fervent":    {"stability": 0.30, "similarity_boost": 0.75, "style": 0.70, "prefix": "*fervent, rising* "},
    "ready":      {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*ready, eager* "},
    "calm":       {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*calm, level* "},
    "steady":     {"stability": 0.55, "similarity_boost": 0.80, "style": 0.25, "prefix": "*steady, even* "},
    "set":        {"stability": 0.50, "similarity_boost": 0.78, "style": 0.30, "prefix": "*set, decided* "},
    "still":      {"stability": 0.60, "similarity_boost": 0.80, "style": 0.15, "prefix": "*still, quiet* "},
    "low":        {"stability": 0.60, "similarity_boost": 0.80, "style": 0.20, "prefix": "*low, hushed* "},
    "private":    {"stability": 0.55, "similarity_boost": 0.80, "style": 0.25, "prefix": "*private, intimate* "},
    "thoughtful": {"stability": 0.50, "similarity_boost": 0.78, "style": 0.30, "prefix": "*thoughtful, considered* "},
    "wondering":  {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*wondering, half-asking* "},
    "curious":    {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*curious, leaning in* "},
    "approving":  {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30, "prefix": "*approving, warm* "},
    "devoted":    {"stability": 0.45, "similarity_boost": 0.80, "style": 0.40, "prefix": "*devoted, earnest* "},
    "raw":        {"stability": 0.30, "similarity_boost": 0.72, "style": 0.60, "prefix": "*raw, exposed* "},
    "shaken":     {"stability": 0.35, "similarity_boost": 0.72, "style": 0.55, "prefix": "*shaken, uneven* "},
    "wounded":    {"stability": 0.40, "similarity_boost": 0.75, "style": 0.50, "prefix": "*wounded, guarded* "},
    "mourning":   {"stability": 0.55, "similarity_boost": 0.80, "style": 0.30, "prefix": "*mourning, slow* "},
    "grim":       {"stability": 0.50, "similarity_boost": 0.78, "style": 0.35, "prefix": "*grim, set-jawed* "},
    "flat":       {"stability": 0.65, "similarity_boost": 0.82, "style": 0.10, "prefix": "*flat, affectless* "},
    "dialogue":   {"stability": 0.45, "similarity_boost": 0.78, "style": 0.30, "prefix": ""},
}

ARCHETYPES = [
    "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
    "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
]
GENDERS = ["female", "male"]


def load_config():
    with open(CONFIG_PATH) as f:
        cfg = json.load(f)
    return cfg


def manifest_path_for(archetype, gender):
    # Camel-case: apprenticeZealotFemaleVoManifest.json
    cap_arch = archetype[0].upper() + archetype[1:]
    cap_gen = gender[0].upper() + gender[1:]
    return os.path.join(SHARED_DIR, f"apprentice{cap_arch}{cap_gen}VoManifest.json")


def lines_path_for(archetype, gender):
    return os.path.join(HERE, f"apprentice-{archetype}-{gender}-lines.json")


def s3_prefix_for(archetype, gender):
    return f"{S3_PREFIX_ROOT}/{archetype}_{gender}"


def s3_url_for(archetype, gender, line_id):
    prefix = s3_prefix_for(archetype, gender).replace(" ", "+")
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{prefix}/{line_id}.mp3"


def head_exists(url):
    try:
        return requests.head(url, timeout=10).status_code == 200
    except Exception:
        return False


def generate_speech(text, emotion, voice_id):
    settings = EMOTIONS.get(emotion, EMOTIONS["default"])
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": settings["prefix"] + text,
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


def run_voice(archetype, gender, voice_id):
    lp = lines_path_for(archetype, gender)
    if not os.path.exists(lp):
        print(f"[skip] {archetype}/{gender}: no lines file at {lp}")
        return 0, 0, []
    with open(lp) as f:
        lines = json.load(f)
    mp = manifest_path_for(archetype, gender)
    try:
        with open(mp) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}
    print(f"\n--- apprentice/{archetype}/{gender} | voice={voice_id} | {len(lines)} lines")
    errors = []
    generated = 0
    for i, line in enumerate(lines):
        line_id = line["id"]
        s3_key = f"{s3_prefix_for(archetype, gender)}/{line_id}.mp3"
        existing = manifest.get(line_id)
        check_url = existing if (isinstance(existing, str) and existing.startswith("http")) else s3_url_for(archetype, gender, line_id)
        if head_exists(check_url):
            if existing != check_url:
                manifest[line_id] = check_url
                with open(mp, "w") as _mf:
                    json.dump(manifest, _mf, indent=2)
            continue
        try:
            sys.stdout.write(f"  [{i+1}/{len(lines)}] {line_id} ({line['emotion']})... ")
            sys.stdout.flush()
            audio = generate_speech(line["text"], line["emotion"], voice_id)
            url = upload(audio, s3_key)
            manifest[line_id] = url
            with open(mp, "w") as _mf:
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
    print(f"  {archetype}/{gender}: {generated} generated, {len(manifest)}/{len(lines)} in manifest, {len(errors)} errors")
    return generated, len(lines), errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--archetype", choices=ARCHETYPES, default=None,
                    help="restrict to one archetype")
    ap.add_argument("--gender", choices=GENDERS, default=None,
                    help="restrict to one gender")
    args = ap.parse_args()

    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key")
        sys.exit(1)

    cfg = load_config()
    archetypes = [args.archetype] if args.archetype else ARCHETYPES
    genders = [args.gender] if args.gender else GENDERS

    print(f"=== APPRENTICE VO GENERATOR ===")
    print(f"  {len(archetypes)} archetype(s) × {len(genders)} gender(s)")

    total_gen = 0
    total_lines = 0
    total_errors = 0
    for a in archetypes:
        ac = cfg.get(a)
        if not ac:
            print(f"[warn] archetype {a} not in config; skipping")
            continue
        for g in genders:
            vid = ac.get(g)
            if not vid:
                print(f"[warn] {a}/{g} has no voice id; skipping")
                continue
            gen, total, errs = run_voice(a, g, vid)
            total_gen += gen
            total_lines += total
            total_errors += len(errs)

    print(f"\n=== APPRENTICE COMPLETE: {total_gen} new / {total_lines} total / {total_errors} errors ===")


if __name__ == "__main__":
    main()
