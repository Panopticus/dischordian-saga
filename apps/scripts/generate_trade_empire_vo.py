#!/usr/bin/env python3
"""TRADE EMPIRE VO GENERATOR

Walks apps/shared/tradeEmpireVoLinePacks.json and generates audio for
every line via ElevenLabs, uploading to s3://dgrsvoices/Trade Empire
Voices/. Idempotent — re-runs skip lines whose audio is already on S3.

Resolves voice IDs via the speaker_voice_ids registry in the JSON.
All 10 speakers are cast as of commit aa1ec2a, so this generator
processes all 233 lines without --skip-todo.

Sections processed:
  - brokers.{key}.lines       — 5 broker packs, ~145 lines
  - declaration_heralds       — 7 lines (one per declaration)
  - climax_resolution_scenes  — 18 lines (3 climax × 6 NPCs avg)
  - sub_house_demand_lines    — 66 lines (22 sub-houses × 3),
                                using each house's primary NPC voice;
                                houses without a roster NPC are
                                skipped with a warning.

Run:
  export ELEVENLABS_API_KEY=...
  export AWS_ACCESS_KEY_ID=...
  export AWS_SECRET_ACCESS_KEY=...
  python3 apps/scripts/generate_trade_empire_vo.py

Optional:
  --dry-run             list the lines that would be generated
  --section <name>      restrict to one section (brokers,
                        declaration_heralds, climax_resolution_scenes,
                        sub_house_demand_lines)
  --speaker <key>       restrict to one speaker (locke, nilmorg, etc.)
"""
import argparse
import json
import os
import re
import sys
import time

import boto3
import requests

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BUCKET = "dgrsvoices"
REGION = "us-east-2"
S3_PREFIX = "Trade Empire Voices"
ELEVENLABS_MODEL = "eleven_multilingual_v2"

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PACK_PATH = os.path.join(REPO_ROOT, "apps", "shared", "tradeEmpireVoLinePacks.json")
MANIFEST_PATH = os.path.join(REPO_ROOT, "apps", "shared", "tradeEmpireVoManifest.json")

# Per-speaker tunings. Mirrors the SPEAKER_SETTINGS conventions in
# apps/scripts/generate-act-vo.ts and the per-character generators
# (generate_locke_vo.py, generate_nilmorg_vo.py, etc.). Edit these
# numbers in one place if a speaker's delivery needs adjusting.
SPEAKER_TUNING = {
    "locke": {
        "stability": 0.55, "similarity_boost": 0.80, "style": 0.30,
        "prefix": "*chrome bureaucrat, contract closing, fine-print precision; never raises volume* ",
    },
    "nilmorg": {
        "stability": 0.55, "similarity_boost": 0.82, "style": 0.20,
        "prefix": "*institutional precision without warmth, surgical clarity, late-30s; refuses gratitude by re-routing* ",
    },
    "the_antiquarian": {
        "stability": 0.65, "similarity_boost": 0.78, "style": 0.15,
        "prefix": "*chronicler, archival, patient, professorial; speaks from outside time, lines feel cited rather than spoken* ",
    },
    "the_degen": {
        "stability": 0.45, "similarity_boost": 0.78, "style": 0.45,
        "prefix": "*jazz-club host, smile-in-voice, never urgent; the smile is the urgency; treats every transaction as a bet the house already won* ",
    },
    "wraith_calder": {
        "stability": 0.65, "similarity_boost": 0.78, "style": 0.20,
        "prefix": "*Hierophant of Thaloria, chamber-resonant, candle-warm baritone; speaks slowly, every line is a candle being lit* ",
    },
    "the_oracle": {
        "stability": 0.60, "similarity_boost": 0.78, "style": 0.25,
        "prefix": "*reads probability forks aloud; calm, slightly distant, mid-tempo; technical when describing forks, plain when describing outcomes* ",
    },
    "the_seer": {
        "stability": 0.55, "similarity_boost": 0.78, "style": 0.30,
        "prefix": "*Insurgency-adjacent, sees what others can't, never surprised; quiet confidence, patient cadence* ",
    },
    "drael_mon": {
        "stability": 0.55, "similarity_boost": 0.78, "style": 0.35,
        "prefix": "*wet-chrome enforcer baritone, slow corporate cadence, third-person about Acquisitions, never raises volume* ",
    },
    "elara": {
        "stability": 0.55, "similarity_boost": 0.80, "style": 0.20,
        "prefix": "",
    },
    "human": {
        "stability": 0.50, "similarity_boost": 0.80, "style": 0.25,
        "prefix": "*spoken low and steady, conspiratorial, like a transmission through the walls* ",
    },
}

# Sub-house key → speaker. Lifted from SUB_HOUSE_REGISTRY in
# apps/shared/tradeEmpire/houses.ts (primaryNpcKey field). Houses
# without a roster NPC are intentionally None — those demand-line
# packs need a separate casting decision.
SUB_HOUSE_SPEAKER = {
    "potentials_restorationists": "elara",
    "potentials_reformers": "human",
    "nb_authoritys_ledger": "locke",
    "nb_civic_engineers": None,
    "hierarchy_severance": "nilmorg",
    "hierarchy_acquisitions": "drael_mon",
    "hierarchy_syndicate_of_death": None,
    "hierarchy_research_and_development": None,
    "antiquarian_shelfmates": "the_antiquarian",
    "antiquarian_casino": "the_degen",
    "antiquarian_cross_references_desk": "the_antiquarian",
    "thaloria_council": "wraith_calder",
    "thaloria_quietwork": None,
    "insurgency_zero_doctrine": None,
    "insurgency_old_network": None,
    "ae_architects_court": None,
    "ae_substrate_rebels": "human",
    "tv_sovereigns_circle": None,
    "tv_unaligned_swarm": None,
    "ind_freeports": None,
    "ind_unaligned": None,
    "dreamer_shield_opaque": None,
}


def slugify(s: str) -> str:
    """File-safe slug for synthetic line ids."""
    s = re.sub(r"[^a-zA-Z0-9_-]+", "-", s.strip().lower())
    return re.sub(r"-+", "-", s).strip("-")[:80] or "line"


def load_pack():
    with open(PACK_PATH) as f:
        return json.load(f)


def normalize_lines(pack, only_section=None, only_speaker=None):
    """Flatten the pack into a uniform list of line jobs.

    Yields dicts: { id, speaker, voiceId, text, section, sub_path }
    sub_path is the relative S3 path under S3_PREFIX/.
    """
    voice_ids = {
        k: v for k, v in pack["speaker_voice_ids"].items() if not k.startswith("$")
    }

    def _vid(speaker):
        vid = voice_ids.get(speaker, "")
        if vid.startswith("TODO"):
            return None
        return vid or None

    # 1) brokers.{brokerKey}.lines.{lineId}: text
    if only_section in (None, "brokers"):
        for broker_key, pack_block in pack["brokers"].items():
            if broker_key.startswith("$"):
                continue
            speaker = pack_block["speaker"]
            if only_speaker and speaker != only_speaker:
                continue
            voice_id = _vid(speaker)
            for line_id, text in pack_block["lines"].items():
                yield {
                    "id": line_id,
                    "speaker": speaker,
                    "voiceId": voice_id,
                    "text": text,
                    "section": "brokers",
                    "sub_path": f"brokers/{broker_key}/{line_id}.mp3",
                }

    # 2) declaration_heralds.{declarationKey}: { speaker, line }
    if only_section in (None, "declaration_heralds"):
        for decl_key, herald in pack["declaration_heralds"].items():
            if decl_key.startswith("$"):
                continue
            speaker = herald["speaker"]
            if only_speaker and speaker != only_speaker:
                continue
            voice_id = _vid(speaker)
            line_id = f"te-herald-{slugify(decl_key)}"
            yield {
                "id": line_id,
                "speaker": speaker,
                "voiceId": voice_id,
                "text": herald["line"],
                "section": "declaration_heralds",
                "sub_path": f"declaration_heralds/{line_id}.mp3",
            }

    # 3) climax_resolution_scenes.{climaxKey}: [{ speaker, line }]
    if only_section in (None, "climax_resolution_scenes"):
        for climax_key, scene in pack["climax_resolution_scenes"].items():
            if climax_key.startswith("$"):
                continue
            for idx, entry in enumerate(scene, start=1):
                speaker = entry["speaker"]
                if only_speaker and speaker != only_speaker:
                    continue
                voice_id = _vid(speaker)
                line_id = f"te-{slugify(climax_key)}-{idx:02d}-{speaker}"
                yield {
                    "id": line_id,
                    "speaker": speaker,
                    "voiceId": voice_id,
                    "text": entry["line"],
                    "section": "climax_resolution_scenes",
                    "sub_path": f"climax_resolution_scenes/{slugify(climax_key)}/{line_id}.mp3",
                }

    # 4) sub_house_demand_lines.{houseKey}: [text, text, text]
    if only_section in (None, "sub_house_demand_lines"):
        for house_key, lines in pack["sub_house_demand_lines"].items():
            if house_key.startswith("$"):
                continue
            speaker = SUB_HOUSE_SPEAKER.get(house_key)
            if speaker is None:
                # Tracked separately — see the "skipped" summary at end.
                continue
            if only_speaker and speaker != only_speaker:
                continue
            voice_id = _vid(speaker)
            for idx, text in enumerate(lines, start=1):
                if text.startswith("(") or text.startswith("(unalignable)"):
                    continue
                line_id = f"te-demand-{house_key}-{idx:02d}"
                yield {
                    "id": line_id,
                    "speaker": speaker,
                    "voiceId": voice_id,
                    "text": text,
                    "section": "sub_house_demand_lines",
                    "sub_path": f"sub_house_demand_lines/{house_key}/{line_id}.mp3",
                }


def s3_key(sub_path):
    return f"{S3_PREFIX}/{sub_path}"


def s3_url(sub_path):
    safe = sub_path.replace(" ", "+")
    safe_prefix = S3_PREFIX.replace(" ", "+")
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{safe_prefix}/{safe}"


def head_exists(url):
    try:
        return requests.head(url, timeout=10).status_code == 200
    except Exception:
        return False


def generate_speech(text, speaker, voice_id):
    tuning = SPEAKER_TUNING.get(speaker, {
        "stability": 0.55, "similarity_boost": 0.78, "style": 0.25, "prefix": "",
    })
    payload = {
        "text": tuning["prefix"] + text,
        "model_id": ELEVENLABS_MODEL,
        "voice_settings": {
            "stability": tuning["stability"],
            "similarity_boost": tuning["similarity_boost"],
            "style": tuning["style"],
            "use_speaker_boost": True,
        },
    }
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json=payload,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.content


def s3_client():
    return boto3.client(
        "s3",
        region_name=REGION,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", ""),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", ""),
    )


def upload(s3, data, sub_path):
    s3.put_object(
        Bucket=BUCKET,
        Key=s3_key(sub_path),
        Body=data,
        ContentType="audio/mpeg",
        CacheControl="public, max-age=31536000",
    )
    return s3_url(sub_path)


def load_manifest():
    try:
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_manifest(manifest):
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="list the lines that would be generated; no API or S3 calls")
    ap.add_argument("--section",
                    choices=["brokers", "declaration_heralds",
                             "climax_resolution_scenes", "sub_house_demand_lines"],
                    help="restrict to one section")
    ap.add_argument("--speaker", help="restrict to one speaker key")
    args = ap.parse_args()

    pack = load_pack()
    jobs = list(normalize_lines(pack, only_section=args.section,
                                only_speaker=args.speaker))
    skipped_houses = [h for h, sp in SUB_HOUSE_SPEAKER.items() if sp is None]
    skipped_lines = sum(
        len(pack["sub_house_demand_lines"].get(h, []))
        for h in skipped_houses
    )

    print(f"=== TRADE EMPIRE VO GENERATOR ===")
    print(f"  Pack: {PACK_PATH}")
    print(f"  Manifest: {MANIFEST_PATH}")
    print(f"  S3: s3://{BUCKET}/{S3_PREFIX}/")
    print(f"  Jobs to consider: {len(jobs)}")
    print(f"  Sub-house lines skipped (no roster NPC cast): {skipped_lines}")
    if skipped_houses:
        print(f"    -> houses needing a casting decision: {', '.join(skipped_houses)}")

    if args.dry_run:
        print("\n[DRY RUN] would generate:")
        by_speaker = {}
        for j in jobs:
            by_speaker.setdefault(j["speaker"], 0)
            by_speaker[j["speaker"]] += 1
            print(f"  {j['section']:30s} {j['speaker']:15s} {j['id']}")
        print("\nby speaker:")
        for sp, count in sorted(by_speaker.items()):
            tag = "TODO" if any(j["voiceId"] is None and j["speaker"] == sp for j in jobs) else "ok"
            print(f"  {sp:20s} {count:4d} lines   [{tag}]")
        return

    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=...", file=sys.stderr)
        sys.exit(1)
    if not (os.environ.get("AWS_ACCESS_KEY_ID") and os.environ.get("AWS_SECRET_ACCESS_KEY")):
        print("ERROR: export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY", file=sys.stderr)
        sys.exit(1)

    manifest = load_manifest()
    s3 = s3_client()
    fail_count = 0
    todo_count = 0

    for i, job in enumerate(jobs, start=1):
        prefix = f"[{i}/{len(jobs)}]"
        if job["voiceId"] is None:
            print(f"{prefix} {job['id']} TODO speaker={job['speaker']} — skipping")
            todo_count += 1
            continue

        url = s3_url(job["sub_path"])
        existing = manifest.get(job["id"])
        check_url = existing if isinstance(existing, str) and existing.startswith("http") else url
        if head_exists(check_url):
            print(f"{prefix} {job['id']} (already on S3, skipping)")
            if existing != check_url:
                manifest[job["id"]] = check_url
                save_manifest(manifest)
            continue

        try:
            sys.stdout.write(f"{prefix} {job['id']} ({job['speaker']})... ")
            sys.stdout.flush()
            audio = generate_speech(job["text"], job["speaker"], job["voiceId"])
            uploaded = upload(s3, audio, job["sub_path"])
            manifest[job["id"]] = uploaded
            save_manifest(manifest)
            print(f"ok {len(audio) // 1024}KB")
            time.sleep(0.2)
        except requests.HTTPError as e:
            fail_count += 1
            print(f"FAIL HTTP {e.response.status_code if e.response else '?'} — {e}")
            if e.response is not None and e.response.status_code == 429:
                print("  Rate limited — waiting 30s...")
                time.sleep(30)
        except Exception as e:
            fail_count += 1
            print(f"FAIL {type(e).__name__}: {e}")

    print()
    print(f"=== COMPLETE ===")
    print(f"  Manifest entries: {len(manifest)}")
    print(f"  Jobs processed: {len(jobs)}")
    print(f"  Skipped (TODO voice): {todo_count}")
    print(f"  Failures: {fail_count}")
    print(f"  Sub-house lines awaiting casting: {skipped_lines}")


if __name__ == "__main__":
    main()
