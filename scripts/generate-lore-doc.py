#!/usr/bin/env python3
"""Generate the comprehensive lore verification document."""
import json
import os

with open('/home/ubuntu/duelyst/app/localization/locales/en/index.json') as f:
    d = json.load(f)

with open('/home/ubuntu/loredex-os/scripts/reskin-report.json') as f:
    report = json.load(f)

changes = report['changes']

out = []
out.append("# The Collector's Arena — Complete Lore Mapping")
out.append("")
out.append("This document lists every faction, general, unit, spell, and artifact in The Collector's Arena")
out.append("(Duelyst reskinned for The Dischordian Saga). Use this to verify lore accuracy.")
out.append("")
out.append("---")
out.append("")

# ═══ FACTION MAPPING ═══
out.append("## Faction Mapping")
out.append("")
out.append("| # | Original (Duelyst) | Dischordian Saga | Abbreviation |")
out.append("|---|---|---|---|")
originals = ['Lyonar Kingdoms', 'Songhai Empire', 'Vetruvian Imperium', 'Abyssian Host', 'Magmar Aspects', 'Vanar Kindred']
for i in range(1, 7):
    name = d.get(f'faction_{i}_name', '?')
    abbr = d.get(f'faction_{i}_abbreviated_name', '?')
    orig = originals[i-1]
    out.append(f"| {i} | {orig} | **{name}** | {abbr} |")
out.append("")

# ═══ PER-FACTION DETAILS ═══
for fid in range(1, 7):
    fname = d.get(f'faction_{fid}_name', f'Faction {fid}')
    out.append("---")
    out.append("")
    out.append(f"## Faction {fid}: {fname}")
    out.append("")
    
    # Generals
    generals = [c for c in changes if c['key'].startswith(f'faction_{fid}_unit_') and c['category'] == 'general']
    if generals:
        out.append("### Generals")
        out.append("")
        out.append("| Original | Dischordian Saga |")
        out.append("|---|---|")
        for g in sorted(generals, key=lambda x: x['key']):
            out.append(f"| {g['old']} | **{g['new']}** |")
        out.append("")
    
    # Units
    units = [c for c in changes if c['key'].startswith(f'faction_{fid}_unit_') and c['category'] == 'unit']
    if units:
        out.append("### Units / Minions")
        out.append("")
        out.append("| Original | Dischordian Saga |")
        out.append("|---|---|")
        for u in sorted(units, key=lambda x: x['key']):
            out.append(f"| {u['old']} | {u['new']} |")
        out.append("")
    
    # Spells
    spells = [c for c in changes if c['key'].startswith(f'faction_{fid}_spell_') and c['category'] == 'spell']
    if spells:
        out.append("### Spells")
        out.append("")
        out.append("| Original | Dischordian Saga |")
        out.append("|---|---|")
        for s in sorted(spells, key=lambda x: x['key']):
            out.append(f"| {s['old']} | {s['new']} |")
        out.append("")
    
    # Artifacts
    artifacts = [c for c in changes if c['key'].startswith(f'faction_{fid}_artifact_') and c['category'] == 'artifact']
    if artifacts:
        out.append("### Artifacts")
        out.append("")
        out.append("| Original | Dischordian Saga |")
        out.append("|---|---|")
        for a in sorted(artifacts, key=lambda x: x['key']):
            out.append(f"| {a['old']} | {a['new']} |")
        out.append("")
    
    # Also list ALL cards from the localization that belong to this faction (including unchanged ones)
    # Find all unit names for this faction
    all_units = {}
    for key, val in sorted(d.items()):
        if key.startswith(f'faction_{fid}_unit_') and key.endswith('_name'):
            all_units[key] = val
    
    all_spells = {}
    for key, val in sorted(d.items()):
        if key.startswith(f'faction_{fid}_spell_') and key.endswith('_name'):
            all_spells[key] = val
    
    all_artifacts = {}
    for key, val in sorted(d.items()):
        if key.startswith(f'faction_{fid}_artifact_') and key.endswith('_name'):
            all_artifacts[key] = val
    
    # Show unchanged cards too
    changed_keys = {c['key'] for c in changes}
    unchanged_units = {k: v for k, v in all_units.items() if k not in changed_keys}
    unchanged_spells = {k: v for k, v in all_spells.items() if k not in changed_keys}
    unchanged_artifacts = {k: v for k, v in all_artifacts.items() if k not in changed_keys}
    
    if unchanged_units:
        out.append("### Unchanged Units (kept original names)")
        out.append("")
        out.append("| Card Name | Key |")
        out.append("|---|---|")
        for k, v in sorted(unchanged_units.items()):
            out.append(f"| {v} | `{k}` |")
        out.append("")
    
    if unchanged_spells:
        out.append("### Unchanged Spells (kept original names)")
        out.append("")
        out.append("| Card Name | Key |")
        out.append("|---|---|")
        for k, v in sorted(unchanged_spells.items()):
            out.append(f"| {v} | `{k}` |")
        out.append("")
    
    if unchanged_artifacts:
        out.append("### Unchanged Artifacts (kept original names)")
        out.append("")
        out.append("| Card Name | Key |")
        out.append("|---|---|")
        for k, v in sorted(unchanged_artifacts.items()):
            out.append(f"| {v} | `{k}` |")
        out.append("")

# ═══ NEUTRAL CARDS ═══
out.append("---")
out.append("")
out.append("## Neutral Cards")
out.append("")

# Changed neutral units
neutral_units = [c for c in changes if c['key'].startswith('neutral_unit_') and c['category'] == 'unit']
if neutral_units:
    out.append("### Renamed Neutral Units")
    out.append("")
    out.append("| Original | Dischordian Saga |")
    out.append("|---|---|")
    for u in sorted(neutral_units, key=lambda x: x['key']):
        out.append(f"| {u['old']} | {u['new']} |")
    out.append("")

# All neutral units
all_neutral_units = {k: v for k, v in sorted(d.items()) if k.startswith('neutral_unit_') and k.endswith('_name')}
unchanged_neutral = {k: v for k, v in all_neutral_units.items() if k not in changed_keys}
if unchanged_neutral:
    out.append("### Unchanged Neutral Units")
    out.append("")
    out.append("| Card Name | Key |")
    out.append("|---|---|")
    for k, v in sorted(unchanged_neutral.items()):
        out.append(f"| {v} | `{k}` |")
    out.append("")

# Neutral spells
neutral_spells = [c for c in changes if c['key'].startswith('neutral_spell_') and c['category'] == 'spell']
if neutral_spells:
    out.append("### Renamed Neutral Spells")
    out.append("")
    out.append("| Original | Dischordian Saga |")
    out.append("|---|---|")
    for s in sorted(neutral_spells, key=lambda x: x['key']):
        out.append(f"| {s['old']} | {s['new']} |")
    out.append("")

# ═══ BOSS CHARACTERS ═══
bosses = [c for c in changes if c['category'] == 'boss']
if bosses:
    out.append("---")
    out.append("")
    out.append("## Boss Characters")
    out.append("")
    out.append("| Original | Dischordian Saga |")
    out.append("|---|---|")
    for b in sorted(bosses, key=lambda x: x['key']):
        out.append(f"| {b['old']} | **{b['new']}** |")
    out.append("")

# ═══ SUMMARY STATISTICS ═══
out.append("---")
out.append("")
out.append("## Summary Statistics")
out.append("")
cats = report['by_category']
out.append("| Category | Renamed Count |")
out.append("|---|---|")
for cat, count in sorted(cats.items()):
    out.append(f"| {cat.replace('_', ' ').title()} | {count} |")
out.append(f"| **Total Renamed** | **{report['total_changes']}** |")
out.append("")

# Count total cards in the game
total_units = len([k for k in d if '_unit_' in k and k.endswith('_name')])
total_spells = len([k for k in d if '_spell_' in k and k.endswith('_name')])
total_artifacts = len([k for k in d if '_artifact_' in k and k.endswith('_name')])
out.append(f"Total unit names in game: {total_units}")
out.append(f"Total spell names in game: {total_spells}")
out.append(f"Total artifact names in game: {total_artifacts}")
out.append(f"Total card names: {total_units + total_spells + total_artifacts}")
out.append("")

# ═══ ARENA ACHIEVEMENTS ═══
out.append("---")
out.append("")
out.append("## Arena Achievements")
out.append("")
out.append("| ID | Name | Condition | XP Reward | Tier |")
out.append("|---|---|---|---|---|")
achievements = [
    ('arena_first_blood', 'First Blood', '1 win', 200, 'Bronze'),
    ('arena_warrior', 'Arena Warrior', '10 wins', 500, 'Silver'),
    ('arena_champion', 'Arena Champion', '50 wins', 1500, 'Gold'),
    ('arena_legend', 'Arena Legend', '100 wins', 3000, 'Platinum'),
    ('arena_faction_master', 'Faction Master', '25 wins with any faction', 1000, 'Gold'),
    ('arena_streak_5', 'Unstoppable', '5 win streak', 500, 'Silver'),
    ('arena_streak_10', 'Legendary Streak', '10 win streak', 2000, 'Gold'),
    ('arena_all_factions', 'Master of All', 'Play all 6 factions', 1000, 'Gold'),
    ('arena_empire_loyal', 'Empire Loyalist', '10 Empire wins', 500, 'Silver'),
    ('arena_insurgent', 'Insurgent Commander', '10 Insurgency wins', 500, 'Silver'),
    ('arena_hierarchy', 'Lord of the Damned', '10 Hierarchy wins', 500, 'Silver'),
    ('arena_virus', 'Viral Propagator', '10 Thought Virus wins', 500, 'Silver'),
    ('arena_babylon', 'Babylonian Conqueror', '10 New Babylon wins', 500, 'Silver'),
    ('arena_potential', 'Awakened Potential', '10 Potentials wins', 500, 'Silver'),
]
for aid, name, cond, xp, tier in achievements:
    out.append(f"| `{aid}` | {name} | {cond} | {xp} | {tier} |")
out.append("")

# ═══ XP REWARDS ═══
out.append("## XP Rewards")
out.append("")
out.append("| Outcome | XP |")
out.append("|---|---|")
out.append("| Win | 150 |")
out.append("| Loss | 50 |")
out.append("| Draw | 75 |")
out.append("| Practice Win | 75 |")
out.append("| Practice Loss | 25 |")
out.append("| First Win of Day Bonus | +100 |")
out.append("")

# ═══ TITLE PROGRESSION ═══
out.append("## Title Progression")
out.append("")
out.append("| Wins Required | Title |")
out.append("|---|---|")
for wins, title in [(0, 'Recruit'), (5, 'Initiate'), (15, 'Gladiator'), (30, 'Centurion'), (50, 'Champion'), (100, 'Warlord'), (200, 'Grand Champion'), (500, 'Legendary')]:
    out.append(f"| {wins} | {title} |")
out.append("")

os.makedirs('/home/ubuntu/loredex-os/docs', exist_ok=True)
with open('/home/ubuntu/loredex-os/docs/arena-lore-mapping.md', 'w') as f:
    f.write('\n'.join(out))

print(f"Document generated: {len(out)} lines")
print(f"Total reskin entries: {report['total_changes']}")
