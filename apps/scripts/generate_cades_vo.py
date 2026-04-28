#!/usr/bin/env python3
"""CADES MODE VO GENERATOR — 5 characters, 43 lines
Iron Lion uses existing Elara voice ID for her lines.
Other characters need custom voice IDs — set them below or via env vars.

Run: python3 scripts/generate_cades_vo.py
"""
import json, os, sys, time, requests, boto3

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "CADES Voices"

# Voice IDs per character
# Elara reuses her existing voice
# Iron Lion, Thoughtborn, Game Masters, Narrator need custom voices
VOICE_IDS = {
    "elara": "xMyNDrPFEtQN8iZtT7l2",  # Engineer Zero
    "iron_lion": os.environ.get("IRON_LION_VOICE_ID", "UFc00HkV4yTNA1eMW99e"),
    "thoughtborn": os.environ.get("THOUGHTBORN_VOICE_ID", "dyc1L3GAWDC51vAN1Co9"),
    "game_masters": os.environ.get("GAME_MASTERS_VOICE_ID", "BCJrrrZvds7k3qzM9nXU"),
    "narrator": os.environ.get("NARRATOR_VOICE_ID", "VgFgBh5TnWeBhCBvCJ1E"),
}

# Emotion settings per character + emotion
CHAR_EMOTIONS = {
    "iron_lion": {
        "default": {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25, "prefix": "*old soldier, weathered, quiet authority* "},
        "alert": {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*alert, not afraid — curious* "},
        "slow_realization": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.45, "prefix": "*slow realization, each sentence heavier* "},
        "desperate_hope": {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60, "prefix": "*this is the only question that matters* "},
        "profound_relief": {"stability": 0.35, "similarity_boost": 0.78, "style": 0.50, "prefix": "*profound relief, a weight lifting* "},
        "tired_honest": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.30, "prefix": "*tired, honest, not complaining — requesting* "},
        "direct_address": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.40, "prefix": "*direct address, speaking to someone watching* "},
        "quiet_promise": {"stability": 0.50, "similarity_boost": 0.82, "style": 0.25, "prefix": "*quiet promise, after a salute* "},
        "approving": {"stability": 0.50, "similarity_boost": 0.82, "style": 0.20, "prefix": "*approving, prefers real fights* "},
        "tactical": {"stability": 0.55, "similarity_boost": 0.85, "style": 0.15, "prefix": "*tactical, clipped, military* "},
        "annoyed": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.30, "prefix": "*annoyed but adapting* "},
        "respectful": {"stability": 0.50, "similarity_boost": 0.82, "style": 0.25, "prefix": "*respect for the escalation* "},
        "flat_factual": {"stability": 0.60, "similarity_boost": 0.85, "style": 0.10, "prefix": "*flat, factual* "},
        "encouraging": {"stability": 0.50, "similarity_boost": 0.82, "style": 0.25, "prefix": "*encouragement without sentiment* "},
        "status_check": {"stability": 0.55, "similarity_boost": 0.85, "style": 0.15, "prefix": "*not a question — a status check* "},
    },
    "elara": {
        "default": {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*warm, precise, AI advisor in crisis* "},
        "soft_cyclical": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.30, "prefix": "*soft, she's said this before, cyclical* "},
        "unsettled": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.40, "prefix": "*observational, slightly unsettled* "},
        "more_unsettled": {"stability": 0.35, "similarity_boost": 0.75, "style": 0.50, "prefix": "*more unsettled now* "},
        "quiet_awe": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.45, "prefix": "*quiet awe* "},
        "reverent": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.35, "prefix": "*reverent* "},
        "urgent_controlled": {"stability": 0.30, "similarity_boost": 0.75, "style": 0.55, "prefix": "*urgent but controlled, military operations* "},
        "alert": {"stability": 0.30, "similarity_boost": 0.75, "style": 0.55, "prefix": "*alert, military efficiency* "},
        "urgent": {"stability": 0.25, "similarity_boost": 0.72, "style": 0.65, "prefix": "*urgent* "},
        "firm": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.40, "prefix": "*firm, this is important* "},
        "relief": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.35, "prefix": "*genuine relief* "},
        "devastated": {"stability": 0.20, "similarity_boost": 0.70, "style": 0.75, "prefix": "*devastated, the sorry breaks* "},
        "wonder": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.45, "prefix": "*wonder and discovery* "},
        "self_aware": {"stability": 0.45, "similarity_boost": 0.80, "style": 0.30, "prefix": "*self-aware, precise about her own emotions* "},
        "dry_factual": {"stability": 0.50, "similarity_boost": 0.82, "style": 0.20, "prefix": "*dry, factual, hidden weight* "},
        "slow_revelation": {"stability": 0.35, "similarity_boost": 0.78, "style": 0.45, "prefix": "*slow, each sentence a revelation* "},
        "sharp_protective": {"stability": 0.35, "similarity_boost": 0.78, "style": 0.50, "prefix": "*sharp, protective* "},
        "proud_emotional": {"stability": 0.35, "similarity_boost": 0.78, "style": 0.55, "prefix": "*emotional but controlled, pride* "},
    },
    "thoughtborn": {
        "default": {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*ethereal, calm, transmitted across vast distance* "},
        "gentle_certainty": {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*gentle certainty* "},
        "building_wonder": {"stability": 0.35, "similarity_boost": 0.72, "style": 0.55, "prefix": "*building wonder, each sentence adds weight* "},
        "vulnerable_plea": {"stability": 0.30, "similarity_boost": 0.72, "style": 0.60, "prefix": "*simple, vulnerable, a plea* "},
    },
    "game_masters": {
        "default": {"stability": 0.55, "similarity_boost": 0.82, "style": 0.15, "prefix": "*cold corporate, encrypted, bureaucratic menace* "},
        "clinical": {"stability": 0.60, "similarity_boost": 0.85, "style": 0.10, "prefix": "*clinical, first contact* "},
        "slightly_warm": {"stability": 0.55, "similarity_boost": 0.82, "style": 0.20, "prefix": "*slightly warmer, still corporate* "},
        "genuine_interest": {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30, "prefix": "*the mask slips, genuine interest* "},
        "seductive_patient": {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*seductive, patient, the full offer* "},
    },
    "narrator": {
        "default": {"stability": 0.60, "similarity_boost": 0.85, "style": 0.10, "prefix": "*neutral, authoritative, military broadcast* "},
        "flat_terminal": {"stability": 0.65, "similarity_boost": 0.88, "style": 0.05, "prefix": "*flat, terminal, final* "},
        "cyclical": {"stability": 0.55, "similarity_boost": 0.82, "style": 0.15, "prefix": "*each word separated, cyclical* "},
        "definitive": {"stability": 0.55, "similarity_boost": 0.82, "style": 0.15, "prefix": "*simple, definitive* "},
        "relief_factual": {"stability": 0.55, "similarity_boost": 0.82, "style": 0.15, "prefix": "*relief without emotion, factual* "},
        "matter_of_fact": {"stability": 0.60, "similarity_boost": 0.85, "style": 0.10, "prefix": "*matter of fact, loss* "},
    },
}

def generate_speech(text, character, emotion):
    voice_id = VOICE_IDS.get(character, "")
    if not voice_id:
        return None
    char_emotions = CHAR_EMOTIONS.get(character, {})
    s = char_emotions.get(emotion, char_emotions.get("default", {"stability":0.5,"similarity_boost":0.8,"style":0.2,"prefix":""}))
    resp = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
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
    with open(os.path.join(os.path.dirname(__file__), "cades-lines.json")) as f:
        lines = json.load(f)
    
    # Check which voices are available
    available = {k for k, v in VOICE_IDS.items() if v}
    skippable = {l["character"] for l in lines} - available
    if skippable:
        print(f"WARNING: Missing voice IDs for: {skippable}")
        print("Set env vars: IRON_LION_VOICE_ID, THOUGHTBORN_VOICE_ID, GAME_MASTERS_VOICE_ID, NARRATOR_VOICE_ID")
        print("Will generate available characters only.\n")
    
    gennable = [l for l in lines if l["character"] in available]
    print(f"=== CADES VO GENERATOR ===")
    print(f"  {len(gennable)}/{len(lines)} lines (voices available)")
    print(f"  Characters: {', '.join(sorted(available))}\n")
    
    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=your_key"); sys.exit(1)
    
    # IDEMPOTENT_PATCH
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "cadesVoManifest.json")
    try:
        with open(manifest_path) as _mf:
            manifest = json.load(_mf)
    except (FileNotFoundError, json.JSONDecodeError):
        manifest = {}
    initial_count = len(manifest)
    for i, line in enumerate(gennable):
        s3_key = f"{line['character']}/{line['id']}.mp3"
        if line["id"] in manifest:
            print(f"[{i+1}/{len(lines)}] {line['id']} (already in manifest, skipping)")
            continue
        try:
            sys.stdout.write(f"[{i+1}/{len(gennable)}] {line['id']} ({line['character']}/{line['emotion']})... ")
            sys.stdout.flush()
            audio = generate_speech(line["text"], line["character"], line["emotion"])
            if audio is None:
                print("SKIP (no voice)")
                continue
            url = upload_to_s3(audio, s3_key)
            manifest[line["id"]] = url
            with open(manifest_path, "w") as _mf:
                json.dump(manifest, _mf, indent=2)
            print(f"ok {len(audio)//1024}KB")
            time.sleep(0.2)
        except Exception as e:
            print(f"FAIL {e}")
            if "429" in str(e): print("  Rate limited — waiting 30s..."); time.sleep(30)
    
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "shared", "cadesVoManifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n=== COMPLETE: {len(manifest)}/{len(lines)} generated ===")
    print(f"Manifest: {manifest_path}")

if __name__ == "__main__":
    main()
