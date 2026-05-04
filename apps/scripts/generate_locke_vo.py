#!/usr/bin/env python3
"""LOCKE VO GENERATOR
Voice: 8XiBWqS5ffaH5naIFHPI
Run: python3 scripts/generate_locke_vo.py"""
import json, os, sys, time, requests, boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "8XiBWqS5ffaH5naIFHPI"
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Locke Voices"

EMOTIONS = {
    "sharp": {
        "stability": 0.45,
        "similarity_boost": 0.8,
        "style": 0.35,
        "prefix": "*sharp, appraising, every word has a price tag* "
    },
    "knowing": {
        "stability": 0.4,
        "similarity_boost": 0.78,
        "style": 0.45,
        "prefix": "*knowing, seen-it-all dry wit* "
    },
    "warm": {
        "stability": 0.45,
        "similarity_boost": 0.8,
        "style": 0.4,
        "prefix": "*rare warmth breaking through the professional mask* "
    },
    "cold": {
        "stability": 0.5,
        "similarity_boost": 0.82,
        "style": 0.2,
        "prefix": "*cold business calculation* "
    },
    "sardonic": {
        "stability": 0.35,
        "similarity_boost": 0.75,
        "style": 0.55,
        "prefix": "*sardonic, dark humor like aged whiskey* "
    }
}

def generate_speech(text, emotion):
    s = EMOTIONS.get(emotion, list(EMOTIONS.values())[0])
    resp = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers={"xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        json={"text": s["prefix"] + text, "model_id": "eleven_multilingual_v2",
              "voice_settings": {"stability": s["stability"], "similarity_boost": s["similarity_boost"],
                                 "style": s["style"], "use_speaker_boost": True}})
    resp.raise_for_status()
    return resp.content

def upload_to_s3(data, key):
    s3 = boto3.client("s3", region_name=REGION,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", ""),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", ""))
    full_key = f"{S3_PREFIX}/{key}"
    s3.put_object(Bucket=BUCKET, Key=full_key, Body=data,
        ContentType="audio/mpeg", CacheControl="public, max-age=31536000")
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{full_key.replace(' ', '+')}"

def s3_url(key):
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{S3_PREFIX.replace(' ', '+')}/{key.replace(' ', '+')}"

def head_exists(url):
    try:
        return requests.head(url, timeout=10).status_code == 200
    except Exception:
        return False

def main():
    with open(os.path.join(os.path.dirname(__file__), "locke-lines.json")) as f:
        lines = json.load(f)
    print(f"=== {'LOCKE'} VO GENERATOR ===\n  {len(lines)} lines | Voice: {VOICE_ID}\n")
    if not ELEVENLABS_KEY: print("ERROR: export ELEVENLABS_API_KEY=your_key"); sys.exit(1)
    # IDEMPOTENT_PATCH
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "lockeVoManifest.json")
    try:
        with open(manifest_path) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}
    initial_count = len(manifest)
    for i, line in enumerate(lines):
        s3_key = f"{line['context']}/{line['id']}.mp3"
        existing = manifest.get(line["id"])
        check_url = existing if (isinstance(existing, str) and existing.startswith("http")) else s3_url(s3_key)
        if head_exists(check_url):
            print(f"[{i+1}/{len(lines)}] {line['id']} (audio on S3, skipping)")
            if existing != check_url:
                manifest[line["id"]] = check_url
                with open(manifest_path, "w") as _mf:
                    json.dump(manifest, _mf, indent=2)
            continue
        try:
            sys.stdout.write(f"[{i+1}/{len(lines)}] {line['id']} ({line['emotion']})... ")
            sys.stdout.flush()
            audio = generate_speech(line["text"], line["emotion"])
            url = upload_to_s3(audio, s3_key)
            manifest[line["id"]] = url
            with open(manifest_path, "w") as _mf:
                json.dump(manifest, _mf, indent=2)
            print(f"ok {len(audio)//1024}KB")
            time.sleep(0.2)
        except Exception as e:
            print(f"FAIL {e}")
            if "429" in str(e): print("  Rate limited — waiting 30s..."); time.sleep(30)
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", f"lockeVoManifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n=== COMPLETE: {len(manifest)}/{len(lines)} ===")

if __name__ == "__main__":
    main()
