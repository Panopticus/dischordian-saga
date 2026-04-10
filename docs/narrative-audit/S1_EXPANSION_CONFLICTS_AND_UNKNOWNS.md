# S1 Expansion — Conflicts & Unknowns Requiring User Decision

> This document lists every conflict, contradiction, or missing
> canonical detail discovered during the Season 1 Expansion
> narrative audit. Each item is **open** until you confirm or
> correct it.
>
> Audit date: 2026-04-10
> Scope: CADES FPS, Dead Man's Circuit, Story Mode, Mechronis,
> Celebration, Narrative Acts 6-7

---

## 🔴 BLOCKING — Need Your Decision Before Production

### 1. The Thoughtborn Pilgrim — Physical Description
**Status:** Inferred from context, not canonized anywhere.

The CADES scripts describe them as "pale near-white skin, violet
bioluminescent circuit patterns pulsing under skin, eyes closed,
hands raised, non-hostile, walking toward the CADES Unit." I have
extrapolated the rest of the portrait (tall, lean, androgynous,
silver-white hair, off-white tunic, plural voice with 3-4 layered
chorus) but none of that is canonical.

**Decision needed:**
- Confirm or correct the physical description.
- Are they clearly humanoid? Something else?
- Are they visibly digital, biological, or hybrid?
- Does the leader look different from the followers, or are they
  functionally identical?
- Is the "chorus" voice canonical or my invention?

**Files affected if corrected:**
- `LORE_BIBLE_S1_EXPANSION.md` (The Thoughtborn Pilgrim section)
- `LOREDEX_ART_PROMPTS_S1_EXPANSION.md` (prompt needs update)
- `DEFINITIVE_ART_PRODUCTION_BIBLE.md` (description needs update)

---

### 2. The Game Masters (cult) — Are They Ever Seen?
**Status:** All in-game interactions are transmission-only.

The cult communicates entirely through corporate-memo transmissions
routed through Matrix Anchor Point 7. Nowhere in the source files
do they appear visually. Their transmissions use "we" / "us" in
plural. I have canonized them as "never seen, only transmission"
in the Lore Bible and created an emblem-only portrait.

**Decision needed:**
- **Confirm they are never seen visually** (only emblem + text
  transmissions), OR
- **Provide a canonical visual** (even a glimpse — a silhouette,
  a robed figure, a deceased founder archive image).

**Current handling:**
- Lore Bible: "They are organized like an academic department that
  survived its own funding's collapse."
- Art prompt: faction emblem only — seven nested hexagons with
  "MATRIX ANCHOR POINT 7" border text.

---

### 3. Professor Orphic (Mechronis Vortex Archon) — Canonical Anchor
**Status:** Canonically "constantly-shifting" with no fixed
appearance.

`mechronisProfessors.ts` line 86 states: *"Professor Orphic —
Constantly shifting — sometimes heavy-set, sometimes gaunt.
Students disagree on what he looks like."*

**Decision needed:**
- Do you want him to have a canonical "anchor pose" that artists
  can default to when generating him?
- Or is "no canonical appearance" itself the canonical rule — in
  which case, each generation should deliberately differ, and the
  art pipeline should tag him as `no_anchor`?

**Suggested default** (if you want one): Tall, robed in shifting
grey-to-black gradient fabric, face partially obscured by moving
shadow, eyes the only fixed feature — pale grey and unmoving. This
matches his Lecturer in Liminal Physics persona.

---

### 4. Minnie (Mascoteer of The Meme) — Canonical Baseline
**Status:** Canonically "face updates per cultural trend."

`mascoteers.ts` line 88 states: *"A constantly-changing child whose
face updates with every laugh in the crowd."*

**Decision needed:**
- Baseline face for default renders (before trend-shifting).
- Current visual in the Mascoteers faction emblem is a generic
  silhouette — fine for the faction card, but Minnie herself needs
  at least one canonical anchor for first-meeting portraits.

**Suggested default**: Small girl with shoulder-length hair, a
cheerful hand-wave, but her face is a "template" face with visible
seams suggesting it can be swapped. When the trend shifts, the face
literally swaps like a mask, leaving the seams briefly visible.

---

## 🟡 CLARIFYING — Need Your Confirmation, Not Blocking

### 5. Vex'Ahlia — "Taskmaster" vs "Collector"
**Status:** Naming inconsistency between files.

- `loredex-data.json` entity_93: **"Vex'Ahlia the Taskmaster"**
- `DEAD_MANS_CIRCUIT_PRODUCTION.md` line 127:
  **"Vex'Ahlia the Collector"**

**My current handling:** I've documented "Taskmaster" as the
canonical title and "Collector" as an internal Hierarchy alias for
her soul-acquisition role.

**Decision:** Is this correct, or are these two different entities,
or should the canonical title be "Collector" and "Taskmaster" the
alias?

---

### 6. Professor Vex vs The Warden — Visual Adjacency
**Status:** Both wear red steampunk goggles. They are NOT the same.

- **Professor Vex** (Mechronis Academy, Game Master Archon):
  "Blue-trenchcoat-wearing man, red steampunk goggles, always
  smiling too wide." — mechronisProfessors.ts line 146
- **The Warden** (Story Mode Ch. 10 boss): "Grotesque cybernetic
  creature, mottled gray-pink skin, spiked neon-green hair,
  chrome mechanical jaw, brown-khaki trenchcoat." — Story Mode Art
  Bible

They are visually adjacent (both in trench coats, both with red
goggles). They are narratively distinct (Vex is a programmed
simulacrum; the Warden is a real cybernetic horror).

**Decision:** Confirm they are distinct characters and that the
visual adjacency is intentional (homage / recursion / visual
parallel). If so, we should add a canonical "never conflate"
note in the art pipeline.

---

### 7. The Seer — Loredex Status
**Status:** Described in `ART_PRODUCTION_BIBLE.md` line 13 but
**no Loredex entry exists** for "The Seer."

The description: "beautiful blue-skinned woman, long black hair,
hooded robe." She appears to be canonical (the Art Bible treats
her as a confirmed character) but has no entity ID.

**Decision:**
- Is "The Seer" in fact **entity_34 "The Seer"** (already in
  loredex)? If so, update the art bible to link them.
- Or is this a different character who needs a new Loredex entry?

---

### 8. Agent Zero — CADES Scenario 6 Content
**Status:** Chapter 6 of the CADES Historical Incursions is
"AGENT ZERO'S SILENCE" — "What she chose to forget — and why."

This is locked until the player completes 5 other scenarios.
`HistoricalManager.gd` line 44-51 establishes the scenario, but
the actual content has not been written yet. Elara's line about
it is: *"It's locked until you're ready."*

**Decision:**
- Is this content planned? If so, when?
- Should the Loredex entry `lore_agent_zero_mystery` be updated to
  reference this scenario as the "proof moment"?
- Do you want me to draft the scenario's memory fragments now, or
  leave it as a locked placeholder?

---

### 9. The All-Seeing One vs The Watcher (entity_4)
**Status:** I canonized them as distinct — The All-Seeing One is
older and above the Archon Watcher.

This is my interpretation of Act 6's "the watcher" language and
the Narrative Architecture doc's description of the Architect/
Dreamer split being subservient to something else.

**Decision:** Confirm this distinction, OR collapse The All-Seeing
One into entity_4 The Watcher as a revelation about his true nature.
If the latter, update concept_the_watcher_hidden to merge with
entity_4.

---

### 10. The Human's Confession — Narrative Stakes
**Status:** I documented the confession as "the war between the
Architect and the Dreamer is a cover; the real enemy is the
All-Seeing One."

This is drawn directly from `narrativeActs.ts` Act 6-7 dialogue. It
is a MAJOR retcon of the existing Architect/Dreamer conflict in
the original Lore Bible.

**Decision:** Confirm this retcon is intentional and should be
reflected in the main Lore Bible, not just the expansion appendix.
If confirmed, The Architect, The Dreamer, The Human, and Elara all
need history updates in the main `LORE_BIBLE.md`.

---

## 🟢 LOW PRIORITY — Informational

### 11. The Salvagers' 12% Tribute
Canonized in `DEFINITIVE_ART_PRODUCTION_BIBLE.md` and the Lore
Bible appendix. "12%" is specified in the Salvager faction emblem
prompt. This is my invention (a thematic detail to make their
deal specific). **Correct if the canonical number is different.**

### 12. Iron Lion's Canonical Time: 3:47:00
Confirmed in `GameMode.gd` constant `CANONICAL_TIME = 13620.0`
(seconds). **Confirmed canonical, no decision needed.**

### 13. Nilmorg's "He always pays" Line
Confirmed from `DEAD_MANS_CIRCUIT_PRODUCTION.md` line 124. **No
decision needed.**

### 14. The 1,351 Years (Human's Promotion)
Confirmed from `NARRATIVE_ARCHITECTURE.md` line 34 and the Human
VO bible. **No decision needed.**

### 15. The Reclamation's "Weighted Scales" Insignia
I invented the weighted-scales design. Adjudicar Locke also has
a scales-themed insignia. **Decision:** should they be visually
related, or distinctly different?

---

## 📋 CHANGE LOG (this expansion)

**Files created:**
- `docs/built/LORE_BIBLE_S1_EXPANSION.md` (1,901 lines)
- `docs/production/DEFINITIVE_ART_PRODUCTION_BIBLE.md` (999 lines)
- `docs/production/LOREDEX_ART_PROMPTS_S1_EXPANSION.md` (642 lines)
- `docs/narrative-audit/S1_EXPANSION_CONFLICTS_AND_UNKNOWNS.md`
  (this file)

**Files modified:**
- `shared/livingUniverseEvents.ts` — added ARCHIVE_WAKES_EVENT
  and BONE_LANE_HUNGERS_EVENT to ALL_EMERGENT_EVENTS

**Files already updated (previous session):**
- `client/src/data/loredex-data.json` — 29 new entries
- `shared/transmissionLoredexUnlocks.ts` — new unlock mappings
- `server/services/rippleEngine.ts` — CADES & DMC ripple hooks

---

## Next Steps

1. **You** review this file and respond with decisions on items 1-10.
2. **I** apply corrections to the affected files.
3. **You** generate the 29 loredex images via NanoBanna 2 using the
   prompts in `LOREDEX_ART_PROMPTS_S1_EXPANSION.md`.
4. **You** upload approved images to the S3 loredex bucket (paths
   already in `loredex-data.json`).
5. **I** close out remaining conflicts and generate any final asset
   tickets for characters missing VO or portraits.

