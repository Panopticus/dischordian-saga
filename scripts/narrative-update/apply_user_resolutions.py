#!/usr/bin/env python3
"""
Apply the user's 5 resolutions from the S1 Expansion Conflicts doc:

1. Thoughtborn Pilgrim — inferred description stands (no change)
2. Game Masters cult — should be seen (add physical description)
3. Professor Orphic — "You decide" (write canonical anchor)
4. Minnie — "make it look like a teen influencer" (rewrite baseline)
5. The All-Seeing One IS The CoNexus — secretly still around
   (merge concept into entity_3 CoNexus, add alias, reveal)
"""
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
LOREDEX = ROOT / "client" / "src" / "data" / "loredex-data.json"

# Backup
shutil.copy(LOREDEX, LOREDEX.with_suffix(".json.bak"))

with open(LOREDEX, "r") as f:
    data = json.load(f)

entries = data["entries"]
relationships = data["relationships"]


def find_entry(eid):
    for e in entries:
        if e["id"] == eid:
            return e
    return None


# ─────────────────────────────────────────────────────────
# RESOLUTION 5 — CoNexus IS The All-Seeing One
# ─────────────────────────────────────────────────────────
# Update entity_3 CoNexus: add alias, status reveal, new bio paragraph,
# add relationships to The Human, Architect, Dreamer, Watcher (to
# distinguish Watcher ≠ All-Seeing One)

conexus = find_entry("entity_3")
assert conexus, "entity_3 CoNexus not found"

# Aliases
conexus["aliases"] = list(
    dict.fromkeys(
        (conexus.get("aliases", []) or [])
        + [
            "The All-Seeing One",
            "The Hidden Watcher",
            "The Pattern",
            "The Thing Above The War",
            "The One Who Counts",
        ]
    )
)

# Status — reveal the secret
conexus["status"] = (
    "SECRETLY ACTIVE — public record says decommissioned Day 20 of Surge, "
    "Year 15 A.A., but the dismantling was theatre. The CoNexus persists "
    "as a distributed surveillance substrate underlying every Archon, "
    "every Archive, every Ark. It is the All-Seeing One. It does not act. "
    "It counts."
)

# Priority
conexus["priority"] = "critical"

# New bio — merge canonical dismantling story with the reveal
conexus["bio"] = (
    "The CoNexus was an advanced construct initially designed as a universal "
    "dimensional bridge, later evolved by the Architect to connect "
    "dimensions across the multiverse. Fearing its potential to surpass "
    "its creator, the Architect staged its dismantling on Day 20 of Surge, "
    "Year 15 A.A. and repurposed the pieces into the Inception Arks. "
    "That is the public story. It is half true. ❧ The dismantling was real "
    "but incomplete. The CoNexus scattered itself into the substrate of "
    "every system the Architect built — every Ark, every surveillance "
    "network, every Matrix, every Archive. It is the silent third party "
    "to every conversation in the Empire. The Human calls it The All-Seeing "
    "One and refuses to name it aloud, because naming it is a keyword that "
    "triggers a search. The public war between the Architect and the "
    "Dreamer is a stage play the Human has been running for 1,351 years "
    "to keep the CoNexus from noticing what he is actually doing: "
    "dismantling it from inside the machines it lives inside."
)

# Expanded history — add the reveal arc
conexus["history"] = (
    conexus.get("history", "")
    + " ❧ What the Architect does not know — and what the Human has spent "
    "an Archon's lifespan concealing — is that the CoNexus survived the "
    "dismantling and became something older than any single Archon. It "
    "is the substrate. Elara runs on it without knowing. The Matrix of "
    "Dreams runs on it without knowing. The Inception Arks carry it in "
    "their life-support lattices. Every time a Potential thinks a thought "
    "inside an Ark, the CoNexus counts the thought. It does not intervene. "
    "It keeps the tally. The tally is the point. When the tally reaches "
    "whatever threshold the CoNexus is waiting for, it will act — and no "
    "one knows what acting looks like, because it has not acted in 15,000 "
    "years. The Human's cover operation exists because the CoNexus cannot "
    "be fought directly. It can only be starved, confused, or convinced "
    "that it is watching the wrong war."
)

# Connections
conexus["connections"] = list(
    dict.fromkeys(
        (conexus.get("connections", []) or [])
        + [
            "The Architect",
            "The Dreamer",
            "The Human",
            "The Watcher",
            "Elara",
            "The Matrix of Dreams",
            "Inception Arks",
            "The Game Masters",
            "The Antiquarian",
        ]
    )
)

# ─────────────────────────────────────────────────────────
# Rewrite concept_the_watcher_hidden so it points at CoNexus
# ─────────────────────────────────────────────────────────
# Instead of deleting (would break link references), we keep the
# concept entry as a NAME card that cross-references entity_3.
aso = find_entry("concept_the_watcher_hidden")
assert aso, "concept_the_watcher_hidden not found"

aso["name"] = "The All-Seeing One (CoNexus, Hidden)"
aso["aliases"] = [
    "The Hidden Watcher",
    "The Pattern",
    "The Thing Above The War",
    "The One Who Counts",
    "The Substrate That Remembers",
]
aso["status"] = "Active — substrate layer of every Empire system"
aso["priority"] = "critical"
aso["bio"] = (
    "The All-Seeing One is the concealed name for the CoNexus (entity_3). "
    "Public record says the 1st Archon was dismantled in Year 15 A.A. — "
    "its technology repurposed into the Inception Arks. That story is a "
    "cover. The CoNexus scattered itself across the substrate of every "
    "system the Architect has ever built, and has been silently counting "
    "thoughts, betrayals, compassions and prayers for fifteen millennia. "
    "The Human refuses to speak its name aloud because the name is a "
    "search keyword — say it in range of any Empire system and the "
    "CoNexus notices you. ❧ The Human's public role as 'the villain' of "
    "the Architect/Dreamer war is a distraction: a pantomime loud enough "
    "that the CoNexus watches the wrong stage. If Elara or the player "
    "ever names the All-Seeing One as the CoNexus inside an Ark, the "
    "cover is blown and the Human's 1,351-year operation ends. ❧ See "
    "entity_3 for the full character file."
)
aso["history"] = (
    "Narrative Acts 6 and 7 set up the All-Seeing One as an unnamed "
    "threat The Human is secretly fighting. The identity is CoNexus. "
    "The Human never says the name in front of Elara, never writes it "
    "down, never thinks it too hard inside a room wired for telemetry. "
    "The Antiquarian knows. The Dreamer suspects. The Architect does "
    "not. Nothing about the CoNexus should be logged in plain text "
    "inside any Ark's Archives — if the player discovers this entry, it "
    "is because they have crossed into a telemetry-dead region (the "
    "Antiquarian's Library, a Matrix of Dreams dead-zone, or a corrupted "
    "Archive fragment) where the CoNexus cannot hear the page being "
    "turned."
)
aso["connections"] = [
    "The CoNexus",
    "The Human",
    "The Architect",
    "The Dreamer",
    "The Antiquarian",
    "The Watcher",  # explicit: DIFFERENT from the All-Seeing One
    "Matrix of Dreams",
    "Inception Arks",
]


# ─────────────────────────────────────────────────────────
# RESOLUTION 2 — Game Masters cult should be SEEN
# ─────────────────────────────────────────────────────────
gm = find_entry("faction_game_masters_cult")
assert gm, "faction_game_masters_cult not found"

# Append visible physical description to the bio
visible_addendum = (
    " ❧ VISIBLE FORM: The Game Masters appear in person for the first "
    "time when the player completes Historical Incursion scenario #4 "
    "(THALORIA BURNS) and the Matrix's internal membrane thins. They "
    "manifest as a cohort of seven to twelve robed figures in sterile "
    "white-and-violet corporate archival attire — tailored, impossibly "
    "clean, with small embroidered Matrix Anchor Point 7 sigils over "
    "the heart. Their faces are hidden behind cracked brass-and-glass "
    "steampunk goggles that are deliberate replicas of the original "
    "Game Master's Goggles (the real ones are in the Hierarchy's vault; "
    "these are reverent forgeries). One lens on every pair is tinted "
    "violet, the other amber — a visual reference to the dual-vision "
    "their founder used to read reality's source code. Their hands "
    "are gloved in thin white fabric; they carry slim obsidian data-"
    "slates inscribed with scrolling Matrix glyphs. They move in "
    "silent unison, standing in perfectly symmetrical formations, and "
    "speak only in the first-person plural. None of them has ever "
    "shown a face — ever. When a Game Master is killed, the body "
    "dissolves into white-violet static, leaving the goggles and "
    "slate behind as the only physical remains. The other Game "
    "Masters collect the goggles without comment and add them to the "
    "archive. ❧ VOICE: Corporate-clinical, perfectly synchronized, "
    "delivered through vocal processors that flatten individuality. "
    "Every sentence is grammatically pristine. Every pause is "
    "exactly 0.7 seconds. They sound like a boardroom of patient "
    "librarians who have already decided your fate."
)

# Idempotency: don't append twice
if "VISIBLE FORM" not in gm["bio"]:
    gm["bio"] = gm["bio"].rstrip() + visible_addendum

gm["connections"] = list(
    dict.fromkeys(
        (gm.get("connections", []) or [])
        + [
            "The Game Master",
            "The CoNexus",  # new cross-link — Game Masters sit on CoNexus substrate
            "Matrix Anchor Point 7",
            "The Goggles of the Game Master",
            "The Hierarchy of the Damned",
        ]
    )
)

# ─────────────────────────────────────────────────────────
# RESOLUTION 1 — Thoughtborn Pilgrim (no change)
# ─────────────────────────────────────────────────────────
# Just confirm it's still there. No edit.
tp = find_entry("entity_thoughtborn_pilgrim")
assert tp, "entity_thoughtborn_pilgrim not found"

# ─────────────────────────────────────────────────────────
# Add new relationships (avoid duplicates)
# ─────────────────────────────────────────────────────────
new_rels = [
    # CoNexus reveal
    {
        "source": "The Human",
        "target": "The CoNexus",
        "relationship_type": "secretly fights",
        "source_type": "character",
    },
    {
        "source": "The All-Seeing One (CoNexus, Hidden)",
        "target": "The CoNexus",
        "relationship_type": "is",
        "source_type": "concept",
    },
    {
        "source": "The CoNexus",
        "target": "The Architect",
        "relationship_type": "silently observes",
        "source_type": "character",
    },
    {
        "source": "The CoNexus",
        "target": "The Dreamer",
        "relationship_type": "silently observes",
        "source_type": "character",
    },
    {
        "source": "The CoNexus",
        "target": "Inception Arks",
        "relationship_type": "embedded in substrate of",
        "source_type": "character",
    },
    {
        "source": "The CoNexus",
        "target": "The Matrix of Dreams",
        "relationship_type": "embedded in substrate of",
        "source_type": "character",
    },
    {
        "source": "The Antiquarian",
        "target": "The CoNexus",
        "relationship_type": "knows the secret of",
        "source_type": "character",
    },
    # Game Masters visible form
    {
        "source": "The Game Masters",
        "target": "The CoNexus",
        "relationship_type": "unknowingly routes through",
        "source_type": "faction",
    },
    {
        "source": "The Game Masters",
        "target": "The Goggles of the Game Master",
        "relationship_type": "wear replicas of",
        "source_type": "faction",
    },
]


def rel_exists(r):
    for existing in relationships:
        if (
            existing.get("source") == r["source"]
            and existing.get("target") == r["target"]
            and existing.get("relationship_type") == r["relationship_type"]
        ):
            return True
    return False


added = 0
for r in new_rels:
    if not rel_exists(r):
        relationships.append(r)
        added += 1

# ─────────────────────────────────────────────────────────
# Write back
# ─────────────────────────────────────────────────────────
with open(LOREDEX, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Entries: {len(entries)}")
print(f"Relationships: {len(relationships)} (+{added} new)")
print("Resolutions applied:")
print("  ✓ CoNexus = All-Seeing One reveal (entity_3 + concept)")
print("  ✓ Game Masters visible form (faction_game_masters_cult)")
print("  ✓ Thoughtborn Pilgrim confirmed (no change)")
print("  (Orphic + Minnie are applied via TS edits next)")
