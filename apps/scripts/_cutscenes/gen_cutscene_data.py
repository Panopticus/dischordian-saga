"""Generate apps/shared/expansionArt/expansionCutscenes.data.ts
   from apps/scripts/_cutscenes/inventory.txt.

   Matches each .mp4 to a sibling .._start.png poster either by
   exact stem or longest prefix (handles producer's slightly-
   inconsistent naming where some posters use a shorter stem than
   their video, e.g. cs_doctrine_recitation_start.png pairs with
   cs_doctrine_recitation_ceremony.mp4)."""
import os
from collections import Counter

INV = "apps/scripts/_cutscenes/inventory.txt"
OUT = "apps/shared/expansionArt/expansionCutscenes.data.ts"

mp4s, starts = [], []
for line in open(INV):
    line = line.strip()
    if not line:
        continue
    if line.endswith(".mp4"):
        mp4s.append(line)
    elif line.endswith("_start.png"):
        starts.append(line)

def find_poster(cat: str, stem: str):
    exact = f"{cat}/{stem}_start.png"
    if exact in starts:
        return exact
    candidates = []
    for p in starts:
        pcat, pfname = p.split("/", 1)
        if pcat != cat:
            continue
        pstem = pfname[: -len("_start.png")]
        if stem == pstem or stem.startswith(pstem + "_"):
            candidates.append((len(pstem), p))
    if candidates:
        candidates.sort(reverse=True)
        return candidates[0][1]
    return None

entries = []
for mp4 in mp4s:
    cat, fname = mp4.split("/", 1)
    stem = fname[: -len(".mp4")]
    poster = find_poster(cat, stem)
    entries.append({
        "id": stem,
        "category": cat,
        "videoRelPath": f"art/cutscenes/{mp4}",
        "posterRelPath": f"art/cutscenes/{poster}" if poster else None,
    })

entries.sort(key=lambda e: (e["category"], e["id"]))
counts = Counter(e["category"] for e in entries)

lines = [
    "/**",
    " * AUTO-GENERATED — do not edit by hand.",
    " *",
    " * Source: NEW_CUTSCENES_67.zip (producer drop 2026-05-12).",
    " * 67 mp4 cutscene clips across 10 categories. Re-generate via",
    " * `python3 apps/scripts/_cutscenes/gen_cutscene_data.py` after future drops.",
    " *",
    " * Category counts:",
]
for cat, n in sorted(counts.items()):
    lines.append(f" *   {cat:<22s} {n}")
lines += [
    " */",
    "",
    'import type { ExpansionCutsceneDef } from "./cinematicsManifest";',
    "",
    "export const EXPANSION_CUTSCENES_DATA: readonly ExpansionCutsceneDef[] = [",
]
for e in entries:
    lines.append("  {")
    lines.append(f'    id: "{e["id"]}",')
    lines.append(f'    category: "{e["category"]}",')
    lines.append(f'    videoRelPath: "{e["videoRelPath"]}",')
    if e["posterRelPath"]:
        lines.append(f'    posterRelPath: "{e["posterRelPath"]}",')
    lines.append("  },")
lines.append("];")
lines.append("")

with open(OUT, "w") as f:
    f.write("\n".join(lines))

print(f"Wrote {OUT}: {len(entries)} entries; {sum(1 for e in entries if e['posterRelPath'])} have producer posters")
