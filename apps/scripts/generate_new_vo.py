#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════
  GENERATE NEW VO — Incremental ElevenLabs TTS generation

  Only generates lines that don't yet have audio on S3.
  Reads from *-lines.json, checks S3, generates missing,
  updates the manifest.

  Usage:
    python3 scripts/generate_new_vo.py              # all characters
    python3 scripts/generate_new_vo.py elara         # just Elara
    python3 scripts/generate_new_vo.py elara --dry   # preview only
    python3 scripts/generate_new_vo.py cades         # CADES Elara lines

  Env vars:
    ELEVENLABS_API_KEY  — ElevenLabs API key
    AWS_ACCESS_KEY_ID   — AWS credentials
    AWS_SECRET_ACCESS_KEY
═══════════════════════════════════════════════════════════
"""

import json, os, sys, time
import requests

BUCKET = "dgrsvoices"
REGION = "us-east-2"
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
SHARED_DIR = os.path.join(SCRIPTS_DIR, "..", "shared")

# ─── CHARACTER VOICE REGISTRY ───────────────────────

CHARACTERS = {
    "elara": {
        "voice_id": "xMyNDrPFEtQN8iZtT7l2",
        "s3_prefix": "Elara Voices",
        "lines_file": "elara-lines.json",
        "manifest_file": "elaraVoManifest.json",
        "emotions": {
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
            "cautious":    {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*cautiously, with measured concern* "},
        },
    },
    "meme": {
        "voice_id": "VgFgBh5TnWeBhCBvCJ1E",
        "s3_prefix": "Meme Voices",
        "lines_file": "meme-lines.json",
        "manifest_file": "memeVoManifest.json",
        "emotions": {
            "sardonic":       {"stability": 0.30, "similarity_boost": 0.75, "style": 0.65, "prefix": "*sardonic, amused, like a late-night host* "},
            "mocking":        {"stability": 0.25, "similarity_boost": 0.72, "style": 0.70, "prefix": "*mocking and playful, barely containing laughter* "},
            "playful":        {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60, "prefix": "*playful and mischievous* "},
            "mysterious":     {"stability": 0.35, "similarity_boost": 0.78, "style": 0.50, "prefix": "*dropping the comedy mask, genuinely mysterious* "},
            "dramatic":       {"stability": 0.25, "similarity_boost": 0.72, "style": 0.75, "prefix": "*over-the-top dramatic, clearly enjoying himself* "},
            "conspiratorial": {"stability": 0.35, "similarity_boost": 0.75, "style": 0.55, "prefix": "*leaning in, conspiratorial whisper* "},
            "breaking":       {"stability": 0.20, "similarity_boost": 0.70, "style": 0.80, "prefix": "*breaking the fourth wall, speaking directly to the audience* "},
        },
    },
    "cades": {
        "voice_id": "xMyNDrPFEtQN8iZtT7l2",  # Elara's voice for CADES Elara lines
        "s3_prefix": "CADES Voices",
        "lines_file": "cades-lines.json",
        "manifest_file": "cadesVoManifest.json",
        "emotions": {
            "alert":             {"stability": 0.35, "similarity_boost": 0.78, "style": 0.45, "prefix": "*alert, monitoring systems* "},
            "urgent":            {"stability": 0.25, "similarity_boost": 0.72, "style": 0.65, "prefix": "*with urgency* "},
            "urgent_controlled": {"stability": 0.35, "similarity_boost": 0.75, "style": 0.50, "prefix": "*urgent but controlled* "},
            "relief":            {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*with relief* "},
            "wonder":            {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*with quiet wonder* "},
            "reverent":          {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*reverent, awed* "},
            "soft_cyclical":     {"stability": 0.45, "similarity_boost": 0.78, "style": 0.30, "prefix": "*soft, cyclical, like reciting a ritual* "},
            "quiet_awe":         {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*quiet awe* "},
            "self_aware":        {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*self-aware, slightly uncomfortable* "},
            "firm":              {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30, "prefix": "*firm and direct* "},
            "sharp_protective":  {"stability": 0.40, "similarity_boost": 0.78, "style": 0.45, "prefix": "*sharp, protective* "},
            "unsettled":         {"stability": 0.35, "similarity_boost": 0.75, "style": 0.50, "prefix": "*unsettled, unnerved* "},
            "slow_realization":  {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*slow dawning realization* "},
            "desperate_hope":    {"stability": 0.30, "similarity_boost": 0.72, "style": 0.60, "prefix": "*desperate hope* "},
            "profound_relief":   {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*profound relief* "},
            "tired_honest":      {"stability": 0.45, "similarity_boost": 0.78, "style": 0.30, "prefix": "*tired but honest* "},
            "direct_address":    {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*direct, looking at someone* "},
            "quiet_promise":     {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*quiet, a promise* "},
            "approving":         {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*approving* "},
            "tactical":          {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25, "prefix": "*tactical, observing* "},
            "annoyed":           {"stability": 0.35, "similarity_boost": 0.75, "style": 0.50, "prefix": "*annoyed* "},
            "respectful":        {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*respectfully* "},
            "flat_factual":      {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*flat, factual* "},
            "encouraging":       {"stability": 0.45, "similarity_boost": 0.78, "style": 0.40, "prefix": "*encouraging* "},
            "status_check":      {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25, "prefix": "*status check, matter of fact* "},
            "more_unsettled":    {"stability": 0.30, "similarity_boost": 0.72, "style": 0.55, "prefix": "*more unsettled than before* "},
            "proud_emotional":   {"stability": 0.40, "similarity_boost": 0.78, "style": 0.50, "prefix": "*proud, emotional* "},
            "devastated":        {"stability": 0.20, "similarity_boost": 0.70, "style": 0.70, "prefix": "*devastated* "},
            "dry_factual":       {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*dry, factual* "},
            "slow_revelation":   {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*slow revelation* "},
            "gentle_certainty":  {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*gentle certainty* "},
            "building_wonder":   {"stability": 0.35, "similarity_boost": 0.75, "style": 0.50, "prefix": "*building wonder* "},
            "vulnerable_plea":   {"stability": 0.25, "similarity_boost": 0.72, "style": 0.65, "prefix": "*vulnerable, pleading* "},
            "clinical":          {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*clinical, detached* "},
            "slightly_warm":     {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*slightly warm, careful* "},
            "genuine_interest":  {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45, "prefix": "*genuine interest* "},
            "seductive_patient": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.50, "prefix": "*seductive, patient* "},
            "flat_terminal":     {"stability": 0.55, "similarity_boost": 0.80, "style": 0.15, "prefix": "*flat, terminal* "},
            "cyclical":          {"stability": 0.45, "similarity_boost": 0.78, "style": 0.30, "prefix": "*cyclical, ritual* "},
            "definitive":        {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30, "prefix": "*definitive* "},
            "relief_factual":    {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25, "prefix": "*relief, factual* "},
            "matter_of_fact":    {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*matter of fact* "},
        },
    },
    "collector": {
        "voice_id": os.environ.get("COLLECTOR_VOICE_ID", ""),
        "s3_prefix": "Collector Voices",
        "lines_file": "collector-lines.json",
        "manifest_file": "collectorVoManifest.json",
        "emotions": {
            "delighted": {"stability": 0.40, "similarity_boost": 0.78, "style": 0.50, "prefix": "*delighted, like showing off a prized exhibit* "},
            "precise":   {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25, "prefix": "*precise, cataloguing* "},
            "warm":      {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*warmly, with collector's fondness* "},
            "clinical":  {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*clinical, appraising* "},
        },
    },
    "architect": {
        "voice_id": os.environ.get("ARCHITECT_VOICE_ID", ""),
        "s3_prefix": "Architect Voices",
        "lines_file": "architect-lines.json",
        "manifest_file": "architectVoManifest.json",
        "emotions": {
            "analytical": {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20, "prefix": "*analytically, like examining data* "},
            "cold":       {"stability": 0.55, "similarity_boost": 0.80, "style": 0.15, "prefix": "*cold, detached, godlike* "},
            "curious":    {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35, "prefix": "*with rare curiosity, something unexpected* "},
        },
    },
    "palimpsestHost": {
        "voice_id": os.environ.get("PALIMPSEST_HOST_VOICE_ID", ""),
        "s3_prefix": "Palimpsest Host",
        "lines_file": "palimpsestHost-lines.json",
        "manifest_file": "palimpsestHostVoManifest.json",
        "emotions": {
            "grand_barker":    {"stability": 0.30, "similarity_boost": 0.75, "style": 0.65, "prefix": "*grand carnival barker with a slight delay between syllables* "},
            "stutter_mask":    {"stability": 0.20, "similarity_boost": 0.70, "style": 0.70, "prefix": "*stuttering, the mask slipping, recovering mid-sentence* "},
            "delighted":       {"stability": 0.35, "similarity_boost": 0.75, "style": 0.60, "prefix": "*delighted, clapping* "},
            "theatrical":      {"stability": 0.25, "similarity_boost": 0.72, "style": 0.75, "prefix": "*over-the-top theatrical disappointment* "},
            "amused":          {"stability": 0.35, "similarity_boost": 0.75, "style": 0.55, "prefix": "*amused, patronizing* "},
            "sardonic":        {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60, "prefix": "*sardonic, dry* "},
            "vulnerable":      {"stability": 0.20, "similarity_boost": 0.70, "style": 0.70, "prefix": "*suddenly vulnerable, the real voice underneath the mask* "},
            "somber_shift":    {"stability": 0.40, "similarity_boost": 0.78, "style": 0.35, "prefix": "*somber, the showmanship dropping away* "},
            "silent_broadcast": {"stability": 0.55, "similarity_boost": 0.80, "style": 0.10, "prefix": ""},
        },
    },
}

# ─── CORE FUNCTIONS ─────────────────────────────────

def check_s3_exists(url):
    """HEAD request to check if an S3 file exists."""
    if not url or url.strip() == "":
        return False
    try:
        resp = requests.head(url, timeout=5)
        return resp.status_code == 200
    except:
        return False

def generate_speech(text, emotion, voice_id, emotions_map):
    """Call ElevenLabs TTS API."""
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY not set")

    default_settings = {"stability": 0.40, "similarity_boost": 0.75, "style": 0.40, "prefix": ""}
    settings = emotions_map.get(emotion, default_settings)
    full_text = settings.get("prefix", "") + text

    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": api_key,
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

def upload_to_s3(data, s3_prefix, key):
    """Upload MP3 to S3 and return public URL."""
    import boto3
    s3 = boto3.client("s3", region_name=REGION,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", ""),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", ""))

    full_key = f"{s3_prefix}/{key}"
    s3.put_object(Bucket=BUCKET, Key=full_key, Body=data,
        ContentType="audio/mpeg",
        CacheControl="public, max-age=31536000")

    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{full_key.replace(' ', '+')}"

# ─── MAIN ───────────────────────────────────────────

def process_character(char_name, dry_run=False):
    """Generate missing VO for one character."""
    config = CHARACTERS[char_name]
    voice_id = config["voice_id"]

    if not voice_id:
        print(f"\n⚠️  {char_name}: No voice ID configured. Set {char_name.upper()}_VOICE_ID env var.")
        return 0, 0

    # Load lines
    lines_path = os.path.join(SCRIPTS_DIR, config["lines_file"])
    with open(lines_path) as f:
        lines = json.load(f)

    # Load existing manifest
    manifest_path = os.path.join(SHARED_DIR, config["manifest_file"])
    with open(manifest_path) as f:
        manifest = json.load(f)

    # Filter to only metadata-free entries
    real_manifest = {k: v for k, v in manifest.items() if not k.startswith("_")}

    # Find lines that need generation (URL doesn't resolve on S3)
    needs_generation = []
    print(f"\n{'═'*50}")
    print(f"  {char_name.upper()} — checking {len(lines)} lines...")
    print(f"  Voice: {voice_id}")
    print(f"{'═'*50}")

    for line in lines:
        url = real_manifest.get(line["id"], "")
        if not url:
            needs_generation.append(line)
            continue
        # Check if the S3 file actually exists
        if not check_s3_exists(url):
            needs_generation.append(line)

    print(f"  {len(lines) - len(needs_generation)} already on S3")
    print(f"  {len(needs_generation)} need generation")

    if not needs_generation:
        print("  ✅ All lines already generated!")
        return len(lines), 0

    if dry_run:
        print(f"\n  [DRY RUN] Would generate {len(needs_generation)} lines:")
        for line in needs_generation:
            print(f"    {line['id']} ({line['emotion']}): \"{line['text'][:60]}...\"")
        return len(lines) - len(needs_generation), len(needs_generation)

    # Check API key
    if not os.environ.get("ELEVENLABS_API_KEY"):
        print("  ❌ ELEVENLABS_API_KEY not set!")
        return len(lines) - len(needs_generation), len(needs_generation)

    # Generate
    generated = 0
    errors = []
    for i, line in enumerate(needs_generation):
        s3_key = f"{line.get('context', 'general')}/{line['id']}.mp3"
        try:
            sys.stdout.write(f"  [{i+1}/{len(needs_generation)}] {line['id']} ({line['emotion']})... ")
            sys.stdout.flush()

            audio = generate_speech(line["text"], line["emotion"], voice_id, config["emotions"])
            url = upload_to_s3(audio, config["s3_prefix"], s3_key)
            manifest[line["id"]] = url
            generated += 1
            print(f"✓ {len(audio)//1024}KB")

            time.sleep(0.2)  # Rate limit
        except Exception as e:
            print(f"✗ {e}")
            errors.append({"id": line["id"], "error": str(e)})
            if "429" in str(e):
                print("    Rate limited — waiting 30s...")
                time.sleep(30)

    # Save updated manifest (merge, don't overwrite)
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")

    print(f"\n  Generated: {generated}/{len(needs_generation)}")
    if errors:
        print(f"  Errors: {len(errors)}")
        for e in errors:
            print(f"    {e['id']}: {e['error']}")

    return len(lines) - len(needs_generation) + generated, len(needs_generation) - generated


def main():
    args = sys.argv[1:]
    dry_run = "--dry" in args
    args = [a for a in args if a != "--dry"]

    targets = args if args else list(CHARACTERS.keys())

    print("═══════════════════════════════════════════════════")
    print("  DISCHORDIAN SAGA — INCREMENTAL VO GENERATION")
    print(f"  Characters: {', '.join(targets)}")
    print(f"  Mode: {'DRY RUN (preview only)' if dry_run else 'LIVE GENERATION'}")
    print("═══════════════════════════════════════════════════")

    total_ok = 0
    total_missing = 0

    for char in targets:
        if char not in CHARACTERS:
            print(f"\n⚠️  Unknown character: {char}")
            print(f"   Available: {', '.join(CHARACTERS.keys())}")
            continue
        ok, missing = process_character(char, dry_run)
        total_ok += ok
        total_missing += missing

    print(f"\n{'═'*50}")
    print(f"  SUMMARY: {total_ok} on S3, {total_missing} still missing")
    print(f"{'═'*50}")


if __name__ == "__main__":
    main()
