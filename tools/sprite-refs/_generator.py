#!/usr/bin/env python3
"""Regenerate tools/sprite-refs/<room>/<sprite>.jpg for every Phase J sprite.

One-off tool — runs against the live CDN, doesn't need a local sprite stage.
Reads canonical sprite + base id lists from the composite resolvers, fetches
the PNGs, alpha-composites each sprite over its room's reference base, scales
to 640×360 with an 80px header band, and writes JPEG q70.

Requires: Pillow only (pip install pillow). No other deps.

Usage:
    cd <repo>
    python3 tools/sprite-refs/_generator.py
    python3 tools/sprite-refs/_generator.py --room=bridge      # one room only
    python3 tools/sprite-refs/_generator.py --quality=85       # better quality
"""

from __future__ import annotations

import argparse
import concurrent.futures
import os
import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

CANVAS = (1920, 1080)
TARGET_W, TARGET_H = 640, 360
DEFAULT_Q = 70
CDN = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public"

# Room id → (s3 dir, reference base id)
ROOM_CFG: dict[str, tuple[str, str]] = {
    "bridge":           ("bridge",           "bridge_base_t2_activated"),
    "cryo-bay":         ("cryo_bay",         "cryo_bay_base_initial"),
    "medical-bay":      ("medical_bay",      "medical_bay_base_initial"),
    "engineering":      ("engineering",      "engineering_base_t2_activated"),
    "archives":         ("archives",         "archives_base_initial"),
    "comms-array":      ("comms_array",      "comms_array_base_initial"),
    "observation-deck": ("observation_deck", "observation_deck_base_initial"),
}

# Resolver path per room (relative to repo root)
RESOLVERS = {
    "bridge":           "apps/shared/roomComposition/bridgeComposite.ts",
    "cryo-bay":         "apps/shared/roomComposition/cryoBayComposite.ts",
    "medical-bay":      "apps/shared/roomComposition/medicalBayComposite.ts",
    "engineering":      "apps/shared/roomComposition/engineeringComposite.ts",
    "archives":         "apps/shared/roomComposition/archivesComposite.ts",
    "comms-array":      "apps/shared/roomComposition/commsArrayComposite.ts",
    "observation-deck": "apps/shared/roomComposition/observationDeckComposite.ts",
}


def find_repo_root() -> Path:
    here = Path(__file__).resolve()
    for p in (here, *here.parents):
        if (p / "package.json").exists() and (p / "apps").exists():
            return p
    sys.exit("error: can't find repo root (no package.json + apps/ in any parent)")


def sprite_ids(resolver_path: Path) -> list[str]:
    src = resolver_path.read_text()
    m = re.search(r"_SPRITE_IDS\s*=\s*\[(.*?)\]\s*as\s*const", src, re.DOTALL)
    return re.findall(r'"([^"]+)"', m.group(1)) if m else []


def fetch_to(url: str, path: Path) -> None:
    if path.exists() and path.stat().st_size > 100_000:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, path)


def find_font(size: int, bold: bool) -> ImageFont.FreeTypeFont:
    candidates = [
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
        f"/Library/Fonts/Arial{'Bold' if bold else ''}.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def render_ref(base_img: Image.Image, sprite_path: Path, sid: str, room: str, base_id: str) -> Image.Image:
    sprite = Image.open(sprite_path).convert("RGBA")
    composited = Image.alpha_composite(base_img.copy(), sprite).convert("RGB")
    header_h = 80
    framed = Image.new("RGB", (CANVAS[0], CANVAS[1] + header_h), (12, 12, 16))
    framed.paste(composited, (0, header_h))
    d = ImageDraw.Draw(framed)
    d.text((20, 8),  sid, fill=(255, 255, 255), font=find_font(30, bold=True))
    d.text((20, 46), f"{room}  •  base: {base_id}", fill=(180, 200, 220), font=find_font(20, bold=False))
    scaled_h = TARGET_H + (header_h * TARGET_W // CANVAS[0])
    return framed.resize((TARGET_W, scaled_h), Image.LANCZOS)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--room", help="only regenerate this room (default: all 7)")
    ap.add_argument("--quality", type=int, default=DEFAULT_Q, help="JPEG quality (default 70)")
    ap.add_argument("--cache-dir", default=None, help="where to cache downloaded PNGs (default: /tmp/sprite-refs-cache)")
    args = ap.parse_args()

    repo = find_repo_root()
    cache = Path(args.cache_dir or "/tmp/sprite-refs-cache")
    cache.mkdir(parents=True, exist_ok=True)
    out_root = repo / "tools" / "sprite-refs"

    rooms = [args.room] if args.room else list(ROOM_CFG.keys())
    if args.room and args.room not in ROOM_CFG:
        sys.exit(f"error: unknown room '{args.room}'. Known: {', '.join(ROOM_CFG)}")

    sprite_lists = {r: sprite_ids(repo / RESOLVERS[r]) for r in rooms}
    total = sum(len(v) for v in sprite_lists.values())
    print(f"generating {total} refs for {len(rooms)} room(s)")

    # Stage downloads
    tasks: list[tuple[str, Path]] = []
    for room in rooms:
        s3_dir, base_id = ROOM_CFG[room]
        tasks.append((f"{CDN}/art/rooms/{s3_dir}/base/{base_id}.png", cache / f"{s3_dir}__base.png"))
        for sid in sprite_lists[room]:
            tasks.append((f"{CDN}/art/rooms/{s3_dir}/sprites/{sid}.png", cache / f"{s3_dir}__{sid}.png"))

    print(f"staging {len(tasks)} downloads...")
    errors: list[tuple[str, str]] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=24) as ex:
        futures = {ex.submit(fetch_to, url, p): (url, p) for url, p in tasks}
        for fu in concurrent.futures.as_completed(futures):
            url, _ = futures[fu]
            try:
                fu.result()
            except Exception as e:
                errors.append((url, str(e)))
    if errors:
        print(f"  {len(errors)} fetch errors; first 3:")
        for u, e in errors[:3]:
            print(f"    {e}: {u}")

    # Render
    total_bytes = 0
    made = 0
    for room in rooms:
        s3_dir, base_id = ROOM_CFG[room]
        out_dir = out_root / room
        out_dir.mkdir(parents=True, exist_ok=True)
        base_path = cache / f"{s3_dir}__base.png"
        if not base_path.exists():
            print(f"  SKIP {room} (no base downloaded)")
            continue
        base = Image.open(base_path).convert("RGBA")
        room_made = 0
        for sid in sprite_lists[room]:
            sp = cache / f"{s3_dir}__{sid}.png"
            if not sp.exists():
                continue
            img = render_ref(base, sp, sid, room, base_id)
            out = out_dir / f"{sid}.jpg"
            img.save(out, "JPEG", quality=args.quality, optimize=True)
            total_bytes += out.stat().st_size
            room_made += 1
            made += 1
        print(f"  {room:<18} {room_made:>3} refs")

    print(f"\nwrote {made} files, {total_bytes / 1024 / 1024:.1f} MB → {out_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
