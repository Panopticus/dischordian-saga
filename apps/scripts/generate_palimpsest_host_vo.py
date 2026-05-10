#!/usr/bin/env python3
"""PALIMPSEST HOST VO GENERATOR — ElevenLabs TTS + S3 Upload
Voice: VgFgBh5TnWeBhCBvCJ1E (Meme; Host = the Meme wearing the GM's mask)
Run: python3 apps/scripts/generate_palimpsest_host_vo.py

Idempotent: skips a line when its S3 object is reachable. Filenames
are taken from the line entry's `filename` field so they match the
existing manifest URL paths exactly (the Host's filenames don't
follow a per-id convention).
"""
import json, os, sys, time, requests, boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "VgFgBh5TnWeBhCBvCJ1E"
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Palimpsest Host"

# Voice direction (per manifest _voice_direction):
#   "Cadence: grand carnival barker with a 15ms delay between syllables,
#    as if the mask is lagging the face by one frame. Do not smile on
#    recordings — the smile has to come from nowhere in the middle of words."
EMOTIONS = {
    "barker":               {"stability": 0.30, "similarity_boost": 0.72, "style": 0.65,
                             "prefix": "*grand carnival barker, syllables slightly lagging, smile arriving from nowhere mid-word* "},
    "saccharine":           {"stability": 0.35, "similarity_boost": 0.75, "style": 0.55,
                             "prefix": "*saccharine, performatively delighted, the smile a beat too wide* "},
    "gleeful_wrong":        {"stability": 0.30, "similarity_boost": 0.72, "style": 0.70,
                             "prefix": "*gleeful at the wrong answer, savoring it, mock-disappointed on the surface* "},
    "mask_slipping":        {"stability": 0.25, "similarity_boost": 0.70, "style": 0.55,
                             "prefix": "*the mask is lagging the face, syllables stuttering, charm flickering* "},
    "sincere_breakthrough": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.30,
                             "prefix": "*the showbiz drops away, sudden quiet honesty* "},
    "eulogy":               {"stability": 0.45, "similarity_boost": 0.78, "style": 0.30,
                             "prefix": "*game-show eulogy, mock-solemn underneath which something real is leaking* "},
}

def head_exists(url):
    try:
        r = requests.head(url, timeout=10)
        return r.status_code == 200
    except Exception:
        return False

def generate_speech(text, emotion):
    s = EMOTIONS.get(emotion, EMOTIONS["barker"])
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers={"xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        json={"text": text,  # prefix dropped — ElevenLabs reads asterisk-bracketed prose literally; direction is in voice_settings "model_id": "eleven_multilingual_v2",
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
    with open(os.path.join(here, "palimpsest-host-lines.json")) as f:
        lines = json.load(f)
    print(f"═══ PALIMPSEST HOST VO ═══\n  {len(lines)} lines | Voice: {VOICE_ID}\n")
    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key"); sys.exit(1)

    manifest_path = os.path.join(here, "..", "shared", "palimpsestHostVoManifest.json")
    try:
        with open(manifest_path) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}

    for i, line in enumerate(lines):
        filename = line.get("filename") or f"{line['id']}.mp3"
        target_url = f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{S3_PREFIX.replace(' ', '+')}/{filename}"
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
            url = upload_to_s3(audio, filename)
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
