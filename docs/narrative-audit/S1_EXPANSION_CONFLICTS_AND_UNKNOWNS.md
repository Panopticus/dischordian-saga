# S1 Expansion — Conflicts & Unknowns Requiring User Decision

> This document lists every conflict, contradiction, or missing
> canonical detail discovered during the Season 1 Expansion
> narrative audit. Each item is **open** until you confirm or
> correct it.
>
> Audit date: 2026-04-10
> Resolutions applied: 2026-04-10 (see "USER RESOLUTIONS"
> section below)
> Scope: CADES FPS, Dead Man's Circuit, Story Mode, Mechronis,
> Celebration, Narrative Acts 6-7

---

## ✅ USER RESOLUTIONS (2026-04-10)

The following items were resolved in a follow-up turn. The decisions
below are now canonical and have been applied to the affected files.

| # | Item | Decision | Status |
|---|------|----------|--------|
| 1 | Thoughtborn Pilgrim description | Inferred description stands | ✅ applied |
| 2 | Game Masters cult — are they ever seen? | **They should be seen** — canonical visual added | ✅ applied |
| 3 | Professor Orphic canonical anchor | **Claude decides** — spectacles + door-key + tweed jacket | ✅ applied |
| 4 | Minnie canonical baseline | **Teen influencer** — 13–14 y/o influencer, filter-perfect skin, ring-light eyes, oversized hoodie, phone always up | ✅ applied |
| 5 | All-Seeing One vs The Watcher | **The All-Seeing One IS the CoNexus** — 1st Archon secretly still around; its "dismantling" was theatre; entity_3 and concept_the_watcher_hidden have been rewritten accordingly; the Watcher (entity_4) is a **distinct** 2nd Archon | ✅ applied |

Items 6–15 remain open or informational — see below.

---

## 🔴 BLOCKING — Need Your Decision Before Production

### 1. The Thoughtborn Pilgrim — Physical Description ✅ RESOLVED
**Status:** ~~Inferred from context, not canonized anywhere.~~ Confirmed canonical — Claude's inferred description stands.

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

### 2. The Game Masters (cult) — Are They Ever Seen? ✅ RESOLVED
**Decision:** They SHOULD be seen. First visible in-game appearance: after the player completes the Thaloria Burns Historical Incursion (scenario #4), the Matrix membrane thins and the Game Masters manifest in person as a cohort of 7–12 robed figures.

**Canonical visual (applied to faction_game_masters_cult bio):**
- Sterile white-and-violet corporate archival robes with Matrix Anchor Point 7 sigils embroidered over the heart
- Faces hidden behind cracked brass-and-glass steampunk goggles (reverent replicas of the Game Master's Goggles — the real ones are in the Hierarchy's vault)
- One lens violet, one lens amber per pair (dual-vision reference)
- Thin white gloves, slim obsidian data-slates with scrolling Matrix glyphs
- Move in silent unison, stand in perfect symmetrical formations
- Killed Game Masters dissolve into white-violet static, leaving only the goggles and slate behind; the others collect the goggles without comment and add them to the archive
- Voice: corporate-clinical, vocal-processor-flattened, perfect 0.7-second pauses, first-person plural only

**Status:** ~~All in-game interactions are transmission-only.~~ Rewritten as visible.

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

### 3. Professor Orphic (Mechronis Vortex Archon) — Canonical Anchor ✅ RESOLVED
**Decision:** "Claude decides" — canonical anchor now specified.

**The anchor (three things that never change, no matter how the body shifts):**
1. Half-moon silver spectacles perched halfway down the bridge of his nose
2. A tarnished silver door-key on a long leather cord around his neck, bit worn smooth from being turned
3. A patched tweed jacket with leather elbow patches (same patched tweed even when the species underneath has changed)

**Canonical rule:** New students try to describe his face and give up. Senior students describe the spectacles, the key, and the jacket, and that's enough. Artists should always show these three. Everything else (face, build, age, even species) is free to drift between renders.

**Applied to:** `shared/mechronisProfessors.ts` line 86.

**Status:** ~~Canonically "constantly-shifting" with no fixed appearance.~~ Anchor defined.

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

### 4. Minnie (Mascoteer of The Meme) — Canonical Baseline ✅ RESOLVED
**Decision:** "Make it look like a teen influencer."

**Canonical baseline (applied to mascoteers.ts):**
- A 13-to-14-year-old teen influencer
- Doe-eyed, doll-skinned, filter-perfect symmetry
- Ring-light reflections permanently visible in the whites of the eyes
- Oversized pastel hoodie with kawaii print (the print itself updates to whatever is trending this hour)
- Cycling-shorts and oversized platform sneakers
- Hair in space buns or pigtails depending on the week
- Long acrylic nails, different color every session
- Phone always up, framing her own face for an invisible audience
- Laughs on cue for clips, pauses mid-sentence to check her reflection

**The face itself stays the same.** The outfit, print, nails, and hair color update with the crowd. She is what "engineered belief" looks like when it grows up in a Dreamer-reprogrammed nursery: a 15-year-old with better marketing instincts than the Empire's entire propaganda division, and she does not know yet that her trials kill people.

**Applied to:** `shared/mascoteers.ts` line 88.

**Status:** ~~Canonically "face updates per cultural trend."~~ Teen-influencer baseline set; face stays, outfit/nails/hair drift with the trend.

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

### 9. The All-Seeing One vs The Watcher (entity_4) ✅ RESOLVED — MAJOR REVEAL
**Decision:** The All-Seeing One is **not** a new entity and is **not** entity_4 The Watcher. It is **entity_3 The CoNexus**. The 1st Archon is secretly still around — its canonical "dismantling" in Year 15 A.A. was theatre. The CoNexus scattered itself into the substrate of every Ark, Matrix, and Archive in the Empire and has been silently counting thoughts, betrayals, compassions, and prayers for 15,000 years.

**Consequences applied:**
- `entity_3 The CoNexus` — aliases expanded to include "The All-Seeing One," "The Hidden Watcher," "The Pattern," "The Thing Above The War," "The One Who Counts"; status rewritten from "Decommissioned" to "SECRETLY ACTIVE"; bio and history rewritten to carry the reveal
- `concept_the_watcher_hidden` — renamed to "The All-Seeing One (CoNexus, Hidden)" and rewritten as a cross-reference card that explicitly identifies the subject as entity_3
- `entity_4 The Watcher` — **not** the All-Seeing One; confirmed distinct as the 2nd Archon (a separate surveillance officer who was an earlier public face of the Empire's panopticon doctrine)
- 9 new relationships added:
  - The Human → secretly fights → The CoNexus
  - The All-Seeing One → is → The CoNexus
  - The CoNexus → silently observes → The Architect
  - The CoNexus → silently observes → The Dreamer
  - The CoNexus → embedded in substrate of → Inception Arks
  - The CoNexus → embedded in substrate of → The Matrix of Dreams
  - The Antiquarian → knows the secret of → The CoNexus
  - The Game Masters → unknowingly routes through → The CoNexus
  - The Game Masters → wear replicas of → The Goggles of the Game Master
- **Narrative stake**: The Human's cover operation (narrativeActs.ts Act 6–7) is revealed as a 1,351-year campaign to dismantle the CoNexus from inside the machines it lives inside. The public Architect/Dreamer war exists to keep the CoNexus watching the wrong stage. If Elara or the player ever names the All-Seeing One as the CoNexus inside an Ark, the cover is blown. The Human never says the name aloud because the name is a search keyword. This entry in the Loredex is only discoverable from telemetry-dead regions (Antiquarian's Library, Matrix of Dreams dead-zones, corrupted Archive fragments).

**Status:** ~~I canonized them as distinct — The All-Seeing One is older and above the Archon Watcher.~~ Corrected. All-Seeing One = CoNexus (entity_3). The Watcher (entity_4) is distinct.

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

