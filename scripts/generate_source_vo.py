#!/usr/bin/env python3
"""SOURCE VO GENERATOR
Voice: hfq5qawrYj4SvnKQ6Mk4
Run: python3 scripts/generate_source_vo.py"""
import json, os, sys, time, requests, boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "hfq5qawrYj4SvnKQ6Mk4"
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Source Voices"

EMOTIONS = {
    "fractured": {
        "stability": 0.15,
        "similarity_boost": 0.7,
        "style": 0.75,
        "prefix": "*voice fracturing between human warmth and viral resonance* "
    },
    "lucid": {
        "stability": 0.4,
        "similarity_boost": 0.78,
        "style": 0.45,
        "prefix": "*lucid, exhausted, the man beneath the virus* "
    },
    "viral": {
        "stability": 0.2,
        "similarity_boost": 0.68,
        "style": 0.8,
        "prefix": "*the virus speaking through him, eerily calm choir-like* "
    },
    "grieving": {
        "stability": 0.3,
        "similarity_boost": 0.75,
        "style": 0.6,
        "prefix": "*deep grief, remembering what was lost* "
    },
    "fierce": {
        "stability": 0.25,
        "similarity_boost": 0.72,
        "style": 0.65,
        "prefix": "*the old insurgent soldier, fierce and defiant* "
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

def main():
    with open(os.path.join(os.path.dirname(__file__), "source-lines.json")) as f:
        lines = json.load(f)
    print(f"=== {char_id.upper()} VO GENERATOR ===\n  {len(lines)} lines | Voice: {VOICE_ID}\n")
    if not ELEVENLABS_KEY: print("ERROR: export ELEVENLABS_API_KEY=your_key"); sys.exit(1)
    manifest = {}
    for i, line in enumerate(lines):
        s3_key = f"{line['context']}/{line['id']}.mp3"
        try:
            sys.stdout.write(f"[{i+1}/{len(lines)}] {line['id']} ({line['emotion']})... ")
            sys.stdout.flush()
            audio = generate_speech(line["text"], line["emotion"])
            url = upload_to_s3(audio, s3_key)
            manifest[line["id"]] = url
            print(f"ok {len(audio)//1024}KB")
            time.sleep(0.2)
        except Exception as e:
            print(f"FAIL {e}")
            if "429" in str(e): print("  Rate limited — waiting 30s..."); time.sleep(30)
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", f"{char_id}VoManifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n=== COMPLETE: {len(manifest)}/{len(lines)} ===")

if __name__ == "__main__":
    main()
