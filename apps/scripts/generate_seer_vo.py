#!/usr/bin/env python3
"""THE SEER VO GENERATOR — ElevenLabs TTS + S3 Upload
Voice: BTfBVfMM9XgZG8GG1bJn (the Seer)
Run: python3 apps/scripts/generate_seer_vo.py

Idempotent: skips a line when its S3 object is reachable.
"""
import json, os, sys, time, requests, boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "BTfBVfMM9XgZG8GG1bJn"
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Seer Voices"

# The Seer reads every line as canonical-pre-recorded — she is not
# improvising; she is replaying a recording she made before you sat down.
# Stability is high; style is low; the affect is flat with prophetic weight.
EMOTIONS = {
    "pre_recorded": {"stability": 0.60, "similarity_boost": 0.80, "style": 0.20,
                     "prefix": "*flat, pre-recorded, the cadence of a lecture replayed for the sixteen-thousandth time* "},
    "prophetic":    {"stability": 0.55, "similarity_boost": 0.80, "style": 0.30,
                     "prefix": "*prophetic, weighted, each word landing exactly on a cue she set for it* "},
    "indifferent":  {"stability": 0.65, "similarity_boost": 0.78, "style": 0.15,
                     "prefix": "*indifferent, polite, the way one is polite to a recording of oneself* "},
}

def head_exists(url):
    try:
        r = requests.head(url, timeout=10)
        return r.status_code == 200
    except Exception:
        return False

def generate_speech(text, emotion):
    s = EMOTIONS.get(emotion, EMOTIONS["pre_recorded"])
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
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
    here = os.path.dirname(__file__)
    with open(os.path.join(here, "seer-lines.json")) as f:
        lines = json.load(f)
    print(f"═══ SEER VO ═══\n  {len(lines)} lines | Voice: {VOICE_ID}\n")
    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key"); sys.exit(1)

    manifest_path = os.path.join(here, "..", "shared", "seerVoManifest.json")
    try:
        with open(manifest_path) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}

    for i, line in enumerate(lines):
        s3_key = f"{line['context']}/{line['id']}.mp3"
        target_url = f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{S3_PREFIX.replace(' ', '+')}/{line['context']}/{line['id']}.mp3"
        existing = manifest.get(line["id"])
        check_url = existing if (isinstance(existing, str) and existing.startswith("http")) else target_url
        if head_exists(check_url):
            print(f"[{i+1}/{len(lines)}] {line['id']} (audio already on S3, skipping)")
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
            print(f"✓ {len(audio)//1024}KB")
            time.sleep(0.15)
        except Exception as e:
            print(f"✗ {e}")
            if "429" in str(e):
                print("  Rate limited — waiting 30s..."); time.sleep(30)

    print(f"\n  manifest: {manifest_path}")
    print("  done.")

if __name__ == "__main__":
    main()
