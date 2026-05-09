#!/usr/bin/env python3
"""TRADE EMPIRE VOICE DESIGNER

Two-step generator that creates synthetic ElevenLabs voices for the
sub-houses that don't have a priority-roster NPC cast. Uses
ElevenLabs Voice Design (the text-to-voice synthesis API) — no
recorded reference audio required.

Workflow:

  Step 1 — Generate previews to audition:
    python3 apps/scripts/design_trade_empire_voices.py preview
        → writes MP3 previews to apps/scripts/voice_previews/
        → writes apps/scripts/voice_previews/_index.json with the
          generated_voice_id for each preview

  Step 2 — Listen to the MP3s, then save your picks permanently:
    python3 apps/scripts/design_trade_empire_voices.py save \\
        --pick nb_civic_engineers=2 thaloria_quietwork=1 \\
        --pick insurgency_zero_doctrine=3
        → calls /v1/voices/add for each picked preview
        → updates apps/shared/tradeEmpireVoLinePacks.json
          speaker_voice_ids with the new permanent IDs

Each `preview` run gets 3 candidate voices per speaker (the
ElevenLabs default). Pick whichever index (1, 2, or 3) sounds best.

Caveats:
  - Each saved voice consumes one slot in your ElevenLabs voice
    library. Free tier = 10 slots; Creator = 30; Pro = 160.
  - Preview generation consumes character credits (~1 sample text
    worth per preview). Designing all 10 sub-houses costs roughly
    10 × 3 × ~150 chars ≈ 4500 characters.
  - The "voice" is synthesised from your description. Quality varies
    by description; iterate the SUB_HOUSE_DESIGN_BRIEFS dict and
    re-run preview if the first round isn't usable.

Run env:
  export ELEVENLABS_API_KEY=...
  pip install requests   # already installed if generate_trade_empire_vo.py works

Custom speaker (not in the registry):
    --custom <speaker_key> "voice description"
"""
import argparse
import base64
import json
import os
import sys
from typing import Optional

try:
    import requests
except ImportError:
    print("ERROR: pip install requests", file=sys.stderr)
    sys.exit(1)

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1"

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PACK_PATH = os.path.join(REPO_ROOT, "apps", "shared", "tradeEmpireVoLinePacks.json")
PREVIEW_DIR = os.path.join(os.path.dirname(__file__), "voice_previews")
PREVIEW_INDEX = os.path.join(PREVIEW_DIR, "_index.json")

# Voice design briefs for the 10 sub-houses without a priority-roster
# NPC. Each brief feeds the ElevenLabs Voice Design API:
#   - voice_description: the casting prompt the synthesiser reads
#   - sample_text: the audition line the preview will speak (drawn
#                  from that sub-house's demand pack so what you
#                  hear is a real game line in the synthesised voice)
#
# To design a voice for a speaker NOT in this dict, use --custom on
# the preview subcommand.
SUB_HOUSE_DESIGN_BRIEFS = {
    "nb_civic_engineers": {
        "voice_description": (
            "Mid-40s, working-class Mid-Atlantic accent, slight rasp from years "
            "of breath-vapour in industrial lift shafts. Speaks with the patient "
            "irritation of someone who keeps the lights on for people who don't "
            "notice the lights. Never theatrical. The exhaustion is the politics."
        ),
        "sample_text": (
            "A generator station three sectors out went down. We need the part. "
            "Bring it; we keep the lifts running."
        ),
    },
    "hierarchy_syndicate_of_death": {
        "voice_description": (
            "Late-50s, gender-ambiguous, dry chamber-resonance like inverted "
            "Thalorian liturgy spoken in a corporate boardroom. Slow, ceremonial, "
            "no warmth, very precise. Speaks of sacrifice the way an accountant "
            "speaks of quarterly close. Faint reverb suggesting a sanctum that "
            "is also an office."
        ),
        "sample_text": (
            "The death-cult arm requests a sacrificial component. The sacrifice "
            "is precise; the precision is the ceremony."
        ),
    },
    "hierarchy_research_and_development": {
        "voice_description": (
            "Late-30s, female-coded, faintly accented Eastern-European, dry "
            "scientific cadence. Speaks like a patent attorney describing an "
            "invention she does not entirely approve of but is, today, paid "
            "to file. Cool, articulate, never raises pitch."
        ),
        "sample_text": (
            "Demonic instrument prototype is one component shy. Provide it; the "
            "slow industrial automation of damnation thanks you, in writing."
        ),
    },
    "thaloria_quietwork": {
        "voice_description": (
            "Bible-canonically faceless. Mid-register, gender-ambiguous, no "
            "regional accent — deliberately characterless. Speaks at the pace "
            "of someone who has decided it is not their turn to be remembered. "
            "Faint priestly cadence, but the priestliness is suppressed; the "
            "Quietwork is intentionally off-the-books."
        ),
        "sample_text": (
            "The Quietwork asks. There is no signed request. There is no public "
            "knowledge of the asking. There is, however, this conversation."
        ),
    },
    "insurgency_zero_doctrine": {
        "voice_description": (
            "Late-30s, female, military-clipped, signal-static undertone like a "
            "transmission through a failing comm link. Speaks in tradecraft, "
            "not philosophy. Centralised, surgical, doctrinaire — every "
            "sentence ends like a stencil being lifted off a wall."
        ),
        "sample_text": (
            "Zero Doctrine requests. The Engineer does not, in this case, sign "
            "the request; the doctrine signs."
        ),
    },
    "insurgency_old_network": {
        "voice_description": (
            "Late-50s, male-coded, weathered baritone with a faint smoker's "
            "rasp. Speaks like a sleeper-cell handler from the era before "
            "encrypted comms — every word measured, every pause meaningful. "
            "Predates the Engineer; doesn't believe his signal is who he says."
        ),
        "sample_text": (
            "The Old Network requests. We predate the Engineer; the request "
            "predates him too. Bring it."
        ),
    },
    "ae_architects_court": {
        "voice_description": (
            "Computational, ancient, patient — a digital presence with no "
            "regional accent, mid-pitch, faint synthesised harmonic at the "
            "lowest formant. Speaks in chess-move logic. Pure information. "
            "Rare flashes of acknowledged curiosity about the listener."
        ),
        "sample_text": (
            "Architect's Court requests a substrate component. The lattice will, "
            "in time, accept it. Time, today, is the constraint."
        ),
    },
    "tv_sovereigns_circle": {
        "voice_description": (
            "Mid-40s, male-coded, layered viral red-black harmonic distortion "
            "underneath an otherwise-charming voice. Alternates seductive "
            "inevitability with cold swarm-logic calculation. Lucid Engineer-"
            "recruiter remnants flicker through. The voice is, today, still "
            "negotiating."
        ),
        "sample_text": (
            "Sovereign's Circle asks. The viral aristocracy negotiates; we are, "
            "today, negotiating with you."
        ),
    },
    "ind_freeports": {
        "voice_description": (
            "Mid-50s, gender-neutral, salt-weathered Atlantic-port accent, the "
            "quiet warmth of a market trader who has done business across "
            "twelve faction lines. Allergic to hidden clauses; speaks plainly. "
            "Trustworthy without sounding earnest."
        ),
        "sample_text": (
            "Free Ports Coalition asks at standard barter rates. We do not hide "
            "clauses; the asking is the clause."
        ),
    },
    "ind_unaligned": {
        "voice_description": (
            "Young adult, gender-ambiguous, no regional reference — a brand-new "
            "civilisation has no shared accent yet. Halting, curious, polite, "
            "vulnerable. The asking is itself a small civilisational milestone."
        ),
        "sample_text": (
            "A new civilisation asks. There is no shared history to draw on; we "
            "are asking from scratch, which is the only way we know how."
        ),
    },
}


def _require_key():
    if not ELEVENLABS_KEY:
        print("ERROR: export ELEVENLABS_API_KEY=...", file=sys.stderr)
        sys.exit(1)


def _post(path: str, payload: dict, timeout: int = 120) -> dict:
    """POST to ElevenLabs and return parsed JSON. Raises on HTTP error
    with the response body included in the message for debuggability."""
    url = f"{ELEVENLABS_API_BASE}{path}"
    resp = requests.post(
        url,
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json=payload,
        timeout=timeout,
    )
    if not resp.ok:
        body = resp.text[:500]
        raise RuntimeError(f"HTTP {resp.status_code} on {path}: {body}")
    return resp.json()


def design_previews(speaker_key: str, description: str, sample_text: str):
    """Call /v1/text-to-voice/create-previews to generate candidate voices.

    Returns the parsed previews list:
      [{ "audio_base_64": str, "generated_voice_id": str, ... }, ...]

    The endpoint is the current ElevenLabs Voice Design path (post-2024
    reorganisation; the older /v1/voices/design and /v1/voice-generation/
    generate-voice paths return 405 / 404).
    """
    payload = {
        "voice_description": description,
        "text": sample_text,
        "auto_generate_text": False,
        "loudness": 0.5,
        "guidance_scale": 5,
        "model_id": "eleven_multilingual_ttv_v2",
    }
    data = _post("/text-to-voice/create-previews", payload, timeout=180)
    return data.get("previews", [])


def save_preview_as_voice(name: str, description: str, generated_voice_id: str) -> str:
    """Persist a previewed voice into the user's voice library via the
    current /v1/text-to-voice/create-voice-from-preview endpoint.

    Returns the permanent voice_id.
    """
    payload = {
        "voice_name": name,
        "voice_description": description,
        "generated_voice_id": generated_voice_id,
        "labels": {"project": "trade_empire"},
    }
    data = _post("/text-to-voice/create-voice-from-preview", payload, timeout=60)
    voice_id = data.get("voice_id")
    if not voice_id:
        raise RuntimeError(f"create-voice-from-preview returned no voice_id: {data}")
    return voice_id


def cmd_preview(args):
    _require_key()
    os.makedirs(PREVIEW_DIR, exist_ok=True)

    # Build the work list — built-in registry plus any --custom briefs.
    work = {}
    if args.custom:
        for k, desc in args.custom:
            work[k] = {
                "voice_description": desc,
                "sample_text": "This is a sample line for voice audition.",
            }
    else:
        # Filter the built-in registry.
        keys = args.only or list(SUB_HOUSE_DESIGN_BRIEFS.keys())
        for k in keys:
            if k not in SUB_HOUSE_DESIGN_BRIEFS:
                print(f"WARN: unknown speaker key {k}; skipping", file=sys.stderr)
                continue
            work[k] = SUB_HOUSE_DESIGN_BRIEFS[k]

    if not work:
        print("Nothing to design.", file=sys.stderr)
        sys.exit(1)

    # Load existing index so re-runs add to the catalog instead of replacing.
    if os.path.exists(PREVIEW_INDEX):
        with open(PREVIEW_INDEX) as f:
            index = json.load(f)
    else:
        index = {}

    print(f"=== TRADE EMPIRE VOICE DESIGNER (preview) ===")
    print(f"  Designs: {len(work)} speakers × 3 previews each")
    print(f"  Output:  {PREVIEW_DIR}")
    print()

    for speaker, brief in work.items():
        print(f"[{speaker}] generating 3 previews...")
        try:
            previews = design_previews(
                speaker, brief["voice_description"], brief["sample_text"]
            )
        except Exception as e:
            print(f"  FAIL: {e}", file=sys.stderr)
            continue
        if not previews:
            print(f"  WARN: no previews returned", file=sys.stderr)
            continue

        index[speaker] = []
        for i, p in enumerate(previews, start=1):
            # API has used both audio_base_64 and audio_base64 over time.
            audio_b64 = p.get("audio_base_64") or p.get("audio_base64") or ""
            gvid = p.get("generated_voice_id", "")
            if not audio_b64 or not gvid:
                print(f"  preview {i} missing fields (got keys: {list(p.keys())}); skipping")
                continue
            mp3_path = os.path.join(PREVIEW_DIR, f"{speaker}_{i}.mp3")
            with open(mp3_path, "wb") as fh:
                fh.write(base64.b64decode(audio_b64))
            entry = {
                "index": i,
                "generated_voice_id": gvid,
                "mp3_path": mp3_path,
                "voice_description": brief["voice_description"],
                "sample_text": brief["sample_text"],
            }
            index[speaker].append(entry)
            print(f"  preview {i}: {mp3_path}")
            print(f"             generated_voice_id={gvid}")

    with open(PREVIEW_INDEX, "w") as f:
        json.dump(index, f, indent=2, sort_keys=True)
    print()
    print(f"Wrote index: {PREVIEW_INDEX}")
    print()
    print("Next: listen to the MP3s, then run:")
    print("  python3 apps/scripts/design_trade_empire_voices.py save \\")
    print("    --pick nb_civic_engineers=2 thaloria_quietwork=1 \\")
    print("    --pick insurgency_zero_doctrine=3")


def cmd_save(args):
    _require_key()
    if not os.path.exists(PREVIEW_INDEX):
        print(f"ERROR: no preview index at {PREVIEW_INDEX}", file=sys.stderr)
        print("Run `preview` first.", file=sys.stderr)
        sys.exit(1)
    with open(PREVIEW_INDEX) as f:
        index = json.load(f)

    picks = {}
    for entry in args.pick:
        if "=" not in entry:
            print(f"--pick wants speaker=NUM (got {entry!r})", file=sys.stderr)
            sys.exit(1)
        k, n = entry.split("=", 1)
        picks[k] = int(n)

    if not picks:
        print("Nothing picked. Pass --pick speaker=N flags.", file=sys.stderr)
        sys.exit(1)

    # Load JSON pack to update at the end.
    with open(PACK_PATH) as f:
        pack = json.load(f)
    voice_ids = pack["speaker_voice_ids"]

    print(f"=== TRADE EMPIRE VOICE DESIGNER (save) ===")
    print(f"  Saving {len(picks)} voices to your ElevenLabs library...")
    print()

    saved = {}
    for speaker, n in picks.items():
        if speaker not in index:
            print(f"  WARN: {speaker} not in preview index; run preview first")
            continue
        previews = index[speaker]
        match = next((p for p in previews if p["index"] == n), None)
        if not match:
            print(f"  WARN: {speaker} has no preview index {n}")
            continue
        try:
            voice_name = f"trade_empire/{speaker}"
            voice_id = save_preview_as_voice(
                voice_name,
                match["voice_description"],
                match["generated_voice_id"],
            )
            saved[speaker] = voice_id
            voice_ids[speaker] = voice_id
            print(f"  {speaker:35s} saved as {voice_id}")
        except Exception as e:
            print(f"  FAIL {speaker}: {e}", file=sys.stderr)

    if not saved:
        print("\nNo voices saved.", file=sys.stderr)
        sys.exit(1)

    # Also update casting_status to reflect the new cast voices.
    cast = set(pack["casting_status"]["cast_and_pinned"])
    todo = set(pack["casting_status"]["uncast_todo"])
    for speaker in saved:
        cast.add(speaker)
        todo.discard(speaker)
    pack["casting_status"]["cast_and_pinned"] = sorted(cast)
    pack["casting_status"]["uncast_todo"] = sorted(todo)

    with open(PACK_PATH, "w") as f:
        json.dump(pack, f, indent=2)

    print()
    print(f"=== COMPLETE ===")
    print(f"  Saved {len(saved)} voices.")
    print(f"  Updated speaker_voice_ids in {PACK_PATH}")
    print()
    print("Next: regenerate audio for these speakers:")
    for speaker in saved:
        print(f"  python3 apps/scripts/generate_trade_empire_vo.py --speaker {speaker}")


def cmd_list(args):
    """List all design briefs in the registry."""
    print("Speakers in the design-brief registry:")
    for k, brief in SUB_HOUSE_DESIGN_BRIEFS.items():
        print(f"\n  {k}")
        print(f"    sample: \"{brief['sample_text'][:80]}...\"")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_prev = sub.add_parser("preview", help="generate 3 preview voices per speaker")
    p_prev.add_argument("--only", nargs="+", metavar="SPEAKER",
                        help="restrict to these speaker keys (default: all in registry)")
    p_prev.add_argument("--custom", nargs=2, metavar=("SPEAKER", "DESCRIPTION"),
                        action="append", default=[],
                        help="design a custom speaker not in the registry; can repeat")
    p_prev.set_defaults(func=cmd_preview)

    p_save = sub.add_parser("save", help="save chosen previews permanently to your voice library")
    p_save.add_argument("--pick", nargs="+", metavar="SPEAKER=N",
                        required=True,
                        help="for each speaker, which preview index to save (1, 2, or 3)")
    p_save.set_defaults(func=cmd_save)

    p_list = sub.add_parser("list", help="list speakers in the design-brief registry")
    p_list.set_defaults(func=cmd_list)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
