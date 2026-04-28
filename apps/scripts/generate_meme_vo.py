#!/usr/bin/env python3
"""THE MEME VO GENERATOR — Sarcastic, playful, fourth-wall-breaking
Voice: VgFgBh5TnWeBhCBvCJ1E
Run: python3 scripts/generate_meme_vo.py"""
import json, os, sys, time, requests, boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "VgFgBh5TnWeBhCBvCJ1E"
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Meme Voices"

EMOTIONS = {
    "sardonic":    {"stability": 0.30, "similarity_boost": 0.75, "style": 0.65, "prefix": "*sardonic, amused, like a late-night host* "},
    "mocking":     {"stability": 0.25, "similarity_boost": 0.72, "style": 0.70, "prefix": "*mocking and playful, barely containing laughter* "},
    "playful":     {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60, "prefix": "*playful and mischievous* "},
    "mysterious":  {"stability": 0.35, "similarity_boost": 0.78, "style": 0.50, "prefix": "*dropping the comedy mask, genuinely mysterious* "},
    "dramatic":    {"stability": 0.25, "similarity_boost": 0.72, "style": 0.75, "prefix": "*over-the-top dramatic, clearly enjoying himself* "},
    "conspiratorial": {"stability": 0.35, "similarity_boost": 0.75, "style": 0.55, "prefix": "*leaning in, conspiratorial whisper that's still somehow loud* "},
    "breaking":    {"stability": 0.20, "similarity_boost": 0.70, "style": 0.80, "prefix": "*breaking the fourth wall, speaking directly to the audience* "},
}

def generate_speech(text, emotion):
    s = EMOTIONS.get(emotion, EMOTIONS["sardonic"])
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

def main():
    with open(os.path.join(os.path.dirname(__file__), "meme-lines.json")) as f:
        lines = json.load(f)
    print(f"=== THE MEME VO GENERATOR ===\n  {len(lines)} lines | Voice: {VOICE_ID}\n")
    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key"); sys.exit(1)
    # IDEMPOTENT_PATCH
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "memeVoManifest.json")
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
            print(f"ok {len(audio)//1024}KB")
            time.sleep(0.2)
        except Exception as e:
            print(f"FAIL {e}")
            errors.append({"id": line["id"], "error": str(e)})
            if "429" in str(e): print("  Rate limited — waiting 30s..."); time.sleep(30)
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "memeVoManifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n=== COMPLETE: {len(manifest)}/{len(lines)} generated ===")
    print(f"Errors: {len(errors)}")
    print(f"Manifest: {manifest_path}")

if __name__ == "__main__":
    main()
