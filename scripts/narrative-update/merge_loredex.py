#!/usr/bin/env python3
"""
Merges new Loredex entries and relationships from batch JSON files
into client/src/data/loredex-data.json.

Idempotent: if an entry ID already exists, it is skipped. Relationships
are de-duplicated by (source, target, relationship_type) tuple.
"""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LOREDEX_PATH = os.path.join(ROOT, "client", "src", "data", "loredex-data.json")
BATCH_DIR = os.path.join(ROOT, "scripts", "narrative-update")

BATCH_FILES = [
    "new_entries_cades.json",
    "new_entries_factions_events.json",
    "new_entries_locations.json",
    "new_entries_concepts_events.json",
    "new_entries_events_story.json",
]

# The schema requires type ∈ {character, concept, event, faction, location, song}
# but some entries use technology/concept synonyms — normalize here.
TYPE_ALIASES = {
    "technology": "concept",
}


def load_json(path):
    with open(path, "r") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def normalize_entry(entry):
    """Add defaults + normalize type + ensure all schema fields."""
    t = entry.get("type", "concept")
    entry["type"] = TYPE_ALIASES.get(t, t)

    # Required fields with defaults
    entry.setdefault("aliases", [])
    entry.setdefault("era", "")
    entry.setdefault("date_aa", "")
    entry.setdefault("date_ad", "")
    entry.setdefault("season", "")
    entry.setdefault("affiliation", "")
    entry.setdefault("status", "")
    entry.setdefault("history", "")
    entry.setdefault("connections", [])
    entry.setdefault("conexus_stories", [])
    entry.setdefault("song_appearances", [])
    entry.setdefault("image", "")
    entry.setdefault("priority", "normal")

    return entry


def main():
    print(f"Loading existing loredex from {LOREDEX_PATH}")
    loredex = load_json(LOREDEX_PATH)
    existing_ids = {e["id"] for e in loredex["entries"]}
    existing_rels = {
        (r["source"], r["target"], r.get("relationship_type", ""))
        for r in loredex.get("relationships", [])
    }
    print(f"  Existing entries: {len(existing_ids)}")
    print(f"  Existing relationships: {len(existing_rels)}")

    added_entries = 0
    added_rels = 0
    skipped_entries = 0
    skipped_rels = 0

    for fname in BATCH_FILES:
        path = os.path.join(BATCH_DIR, fname)
        if not os.path.exists(path):
            print(f"  [warn] batch file missing: {fname}")
            continue
        batch = load_json(path)
        print(f"\nBatch: {fname}")
        print(f"  entries: {len(batch.get('entries', []))}")
        print(f"  relationships: {len(batch.get('relationships', []))}")

        for raw in batch.get("entries", []):
            entry = normalize_entry(raw)
            if entry["id"] in existing_ids:
                print(f"  [skip existing] {entry['id']}")
                skipped_entries += 1
                continue
            loredex["entries"].append(entry)
            existing_ids.add(entry["id"])
            added_entries += 1
            print(f"  [+] {entry['id']} — {entry['name']}")

        for rel in batch.get("relationships", []):
            key = (rel["source"], rel["target"], rel.get("relationship_type", ""))
            if key in existing_rels:
                skipped_rels += 1
                continue
            loredex.setdefault("relationships", []).append(rel)
            existing_rels.add(key)
            added_rels += 1

    print("\nSUMMARY")
    print(f"  Added entries: {added_entries} (skipped {skipped_entries})")
    print(f"  Added relationships: {added_rels} (skipped {skipped_rels})")
    print(f"  Total entries now: {len(loredex['entries'])}")
    print(f"  Total relationships now: {len(loredex['relationships'])}")

    save_json(LOREDEX_PATH, loredex)
    print(f"\nWrote {LOREDEX_PATH}")


if __name__ == "__main__":
    main()
