#!/usr/bin/env python3
"""WIRE SUB-HOUSE VOICES

Activates the 33 sub-house demand-line speakers that were skipped by
generate_trade_empire_vo.py because their sub-houses had no priority-
roster NPC. After design_trade_empire_voices.py save populates
speaker_voice_ids with the newly-designed voices (keyed by sub-house
key), this script rewires the audio generator so it picks them up.

What it does:
  1. Reads apps/shared/tradeEmpireVoLinePacks.json.
  2. For each sub-house in sub_house_demand_lines:
     - Skips unalignable houses (tv_unaligned_swarm, dreamer_shield_opaque).
     - Checks if speaker_voice_ids has a real (non-TODO) entry keyed
       by the sub-house id.
     - If yes, plans to wire that house: SUB_HOUSE_SPEAKER[house] = house.
  3. Edits apps/scripts/generate_trade_empire_vo.py in place:
     - Updates SUB_HOUSE_SPEAKER entries from None → "house_id".
     - Adds a SPEAKER_TUNING entry for each newly-wired house (using
       a generic neutral profile; the user can tune per-character later).
  4. Reports: which houses got wired, how many demand lines that
     unblocks, and a hint for the next render command.

Idempotent — re-running on an already-wired generator is a no-op.

Run:
  python3 apps/scripts/wire_subhouse_voices.py             # apply
  python3 apps/scripts/wire_subhouse_voices.py --dry-run   # preview
  python3 apps/scripts/wire_subhouse_voices.py --report    # diagnose only

The audit covers the 12 NPC-less sub-houses that generate_trade_empire_vo.py
defers by default; once they're wired, the next `generate_trade_empire_vo.py`
run renders the previously-skipped 33 demand lines.
"""
import argparse
import json
import os
import re
import sys
from typing import Optional, Tuple

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PACK_PATH = os.path.join(REPO_ROOT, "apps", "shared", "tradeEmpireVoLinePacks.json")
GENERATOR_PATH = os.path.join(REPO_ROOT, "apps", "scripts", "generate_trade_empire_vo.py")

# Sub-houses whose demand lines must NOT be voiced by anyone — they are
# canonically unalignable per apps/shared/tradeEmpire/houses.ts.
UNALIGNABLE = {"tv_unaligned_swarm", "dreamer_shield_opaque"}


def load_pack() -> dict:
    with open(PACK_PATH) as f:
        return json.load(f)


def candidate_subhouses(pack: dict) -> list[str]:
    """Sub-house keys that have demand lines and are alignable."""
    return [
        h for h in pack.get("sub_house_demand_lines", {}).keys()
        if not h.startswith("$") and h not in UNALIGNABLE
    ]


def has_real_voice_id(pack: dict, key: str) -> bool:
    voice_ids = pack.get("speaker_voice_ids", {})
    val = voice_ids.get(key, "")
    return bool(val) and not val.startswith("TODO")


def real_demand_line_count(pack: dict, key: str) -> int:
    """Count of voiceable demand lines for a sub-house (excludes
    `(unalignable)` stub entries)."""
    lines = pack.get("sub_house_demand_lines", {}).get(key, [])
    return sum(
        1 for line in lines
        if not (isinstance(line, str) and line.lstrip().startswith("("))
    )


def patch_sub_house_speaker(src: str, house: str) -> Tuple[str, bool]:
    """Replace `"house": None,` with `"house": "house",` in the
    SUB_HOUSE_SPEAKER literal. Returns (new_src, changed)."""
    pattern = rf'(\s*"{re.escape(house)}":\s*)None(\s*,)'
    replacement = rf'\1"{house}"\2'
    new_src, n = re.subn(pattern, replacement, src, count=1)
    return new_src, n > 0


def patch_speaker_tuning(src: str, house: str) -> Tuple[str, bool]:
    """Add a generic SPEAKER_TUNING entry for `house` if one doesn't
    exist. Inserted just before the closing `}` of the dict so it
    coexists with the existing entries."""
    if f'"{house}":' in _speaker_tuning_block(src):
        return src, False

    block_start = src.find("SPEAKER_TUNING = {")
    if block_start < 0:
        return src, False
    # Find the matching closing brace at the top level of this dict.
    # We look for the next `\n}\n` after block_start.
    closing = src.find("\n}\n", block_start)
    if closing < 0:
        return src, False
    insertion = (
        f'    "{house}": {{\n'
        f'        "stability": 0.55, "similarity_boost": 0.78, "style": 0.30,\n'
        f'        "prefix": "*sub-house demand voice for {house} — designed via Voice Design; tune per-character if delivery needs adjusting* ",\n'
        f'    }},\n'
    )
    new_src = src[:closing] + "\n" + insertion + src[closing:]
    return new_src, True


def _speaker_tuning_block(src: str) -> str:
    block_start = src.find("SPEAKER_TUNING = {")
    if block_start < 0:
        return ""
    closing = src.find("\n}\n", block_start)
    if closing < 0:
        return src[block_start:]
    return src[block_start:closing + 3]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="show changes without writing")
    ap.add_argument("--report", action="store_true",
                    help="audit only (no edits)")
    args = ap.parse_args()

    pack = load_pack()
    candidates = candidate_subhouses(pack)

    rows = []
    wireable = []
    for h in candidates:
        has_voice = has_real_voice_id(pack, h)
        line_count = real_demand_line_count(pack, h)
        rows.append((h, has_voice, line_count, pack["speaker_voice_ids"].get(h, "")))
        if has_voice:
            wireable.append(h)

    print("=== SUB-HOUSE VOICE WIRE AUDIT ===")
    print(f"{'sub-house':40s} {'voice':6s} {'lines':6s} voice_id")
    print("-" * 80)
    total_lines = 0
    wireable_lines = 0
    for h, has_voice, line_count, vid in rows:
        flag = "READY" if has_voice else "(none)"
        vshort = vid[:24] if vid else ""
        print(f"{h:40s} {flag:6s} {line_count:<6} {vshort}")
        total_lines += line_count
        if has_voice:
            wireable_lines += line_count

    print()
    print(f"  Wireable sub-houses: {len(wireable)} / {len(candidates)}")
    print(f"  Demand lines unblocked by wire: {wireable_lines} / {total_lines}")

    if args.report:
        return

    if not wireable:
        print("\nNothing to wire — no sub-houses have a designed voice in speaker_voice_ids.", file=sys.stderr)
        print("Run design_trade_empire_voices.py preview + save first.", file=sys.stderr)
        return

    # Patch generator script.
    with open(GENERATOR_PATH) as f:
        src = f.read()
    original = src
    speaker_changes = []
    tuning_changes = []
    for h in wireable:
        src, sc = patch_sub_house_speaker(src, h)
        if sc:
            speaker_changes.append(h)
        src, tc = patch_speaker_tuning(src, h)
        if tc:
            tuning_changes.append(h)

    if src == original:
        print("\nGenerator already wired for every ready sub-house. No changes.")
        return

    print()
    print(f"Patches to {GENERATOR_PATH}:")
    print(f"  SUB_HOUSE_SPEAKER updates: {len(speaker_changes)}")
    for h in speaker_changes:
        print(f"    {h}: None → \"{h}\"")
    print(f"  SPEAKER_TUNING additions: {len(tuning_changes)}")
    for h in tuning_changes:
        print(f"    {h}: generic neutral profile")

    if args.dry_run:
        print("\n[DRY RUN] no file written.")
        return

    with open(GENERATOR_PATH, "w") as f:
        f.write(src)
    print(f"\nWrote {GENERATOR_PATH}")
    print()
    print("Next:")
    print("  python3 apps/scripts/generate_trade_empire_vo.py --section sub_house_demand_lines")
    print("(generates audio for the unblocked demand lines; idempotent + S3-cached)")


if __name__ == "__main__":
    main()
