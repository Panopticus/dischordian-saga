# Character Turnaround Production Spec

**Status:** design doc + manifest substrate. Ships in audit/16 PR 37.
Closes audit/15 finding **Cos1** ("Turnarounds for only 2 of 27
characters; 25 NPCs have no full-body geometric reference").

## What this PR addresses

The Cosplay-persona audit flagged that the saga ships full-body
turnaround art for only the two protagonists (Elara + The Human).
The 24 NPC speakers ship per-character `bust.avif`,
`viseme.avif`, `blink.avif`, `breathing.avif`, `expressions.avif`,
but no `front_turnaround.avif` / `full_turnaround.avif`. Cosplayers,
character-sheet illustrators, and any future 3D modelling work have
no orthographic reference.

The audit's recommendation: produce 360° turnarounds for every
NPC speaker. That's an **asset-team deliverable** — generating 24
high-quality 2048×2048 turnarounds is outside this PR's tooling. What
**is** in this PR's scope:

1. **The production spec** (this document) — the canonical brief
   the asset team works against.
2. **A typed manifest** (`apps/shared/characterTurnaroundManifest.ts`)
   declaring every character that NEEDS a turnaround, with each
   slot marked `pending: true | false`. As assets land, the slot
   flips to `pending: false` and the audit-tracker count tightens.
3. **An invariant test** that the manifest matches the cast list
   shipped in `apps/client/public/characters/_inventory.json` —
   so adding a new NPC speaker without authoring a turnaround slot
   becomes a CI failure.

## What this PR does NOT ship

- **The 24 missing AVIF files.** They're outside my image-generation
  tooling. The asset team produces them; the manifest tracks
  delivery.
- **A renderer for the turnarounds in-game.** None of the existing
  surfaces consume turnarounds at runtime; they're for production
  reference (cosplay, model sheets, character bibles). When/if a
  consumer surface lands, it reads the same manifest.

## Production canon

Every turnaround comes in TWO files per character, identical to the
existing protagonist set (`elara/`, `the_human/`):

| Slot                  | Shape       | Bytes target | Notes                                                             |
|-----------------------|-------------|--------------|-------------------------------------------------------------------|
| `front_turnaround.avif` | 2752 × 1536 | ≤ 200 KB     | Front 3-frame: 0°, 45°, 90° (left half) — the "approach" reference. |
| `full_turnaround.avif`  | 2752 × 1536 | ≤ 200 KB     | Full 8-frame: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°.        |

Both AVIFs render the character against the canonical neutral
background (`#0a0a0a`, the same matte the protagonist set uses), at
the same scale (1500px tall figure inside the 1536px-tall frame),
with the same lighting rig. The neutral pose is the one used in the
character's `bust.avif` source — same outfit, same expression, same
silhouette.

## Naming convention

The asset team's PR adds the AVIFs at:

```
apps/client/public/characters/<characterId>/front_turnaround.avif
apps/client/public/characters/<characterId>/full_turnaround.avif
```

`<characterId>` matches the existing `_inventory.json` rel-path
prefixes — every entry already in the manifest has a known `id`.

## The 24 characters needing turnarounds

The current inventory ships 26 character ids. Two have turnarounds
already (`elara`, `the_human`). The remaining 24 (alphabetical):

```
adjudicator_locke    architect           collector            conexus_authority
degen                eidola              engineer             enigma
eyes                 gamemaster          iron_lion            kael_recruiter
matrikala            necromancer         nilmorg              programmer
seer                 shadow_tongue       the_antiquarian      the_meme
the_source           warlord             watcher              agent_zero
```

(The audit cited 18 NPC speakers; the manifest is more complete —
some of these are non-speaking but appear in cinematic frames or
the bestiary. Authoring turnarounds for all 24 means cosplay /
model-sheet coverage of the full speaking + appearing cast.)

## Per-character production notes (asset-team starter pack)

Each character below ships with the existing `bust.avif` as the
canonical reference. The turnaround MUST match the bust's outfit /
silhouette / scale or the asset chains downstream of the bust
(visemes, breathing loops) drift visually.

- **adjudicator_locke** — formal robe, gavel-prop, severe stance.
  Pose: standing, hands at sides; gavel held loosely in right hand
  for the 90° / 270° quarters.
- **agent_zero** — masked operative, full-body cloak. The cloak's
  drape across the rear arc (135°-225°) is the cosplay-critical
  surface. Reference the existing `agent_zero/breathing.avif` for
  cloak motion baseline.
- **architect** — robed engineer, blueprint-token in left hand.
  Tall figure (175 cm equivalent in-fiction); pose: surveyor's
  stance with weight slightly back.
- **collector** — multi-armed ledger-keeper. The arm-count is
  AUDIT-CRITICAL (4 arms; not 2, not 6). Front 3-frame must show
  all 4 arms in clear silhouette.
- **conexus_authority** — uniformed bureaucrat with insignia.
  Insignia is the same one used on the Codex's CoNexus markers;
  reference `apps/client/public/sigils/conexus_authority.avif`.
- **degen** — casino dealer with sleeve-roll, full eye-shadow.
  The lover-route variant (`vox-iv`) is NOT a separate turnaround;
  the Degen's outfit is a single canonical stance.
- **eidola** — projection construct; partially translucent.
  Render the translucency as a 30% alpha ON the figure, NOT on the
  background. The turnaround captures the construct's geometric
  pose; the alpha pass lands in a separate layer.
- **engineer** — workshop coveralls, tool-belt, goggles up. Pose:
  hands-on-hips, weight even.
- **enigma** — masked riddle-keeper. The mask's full geometry
  (it has a back panel that completes the ovoid) needs the rear
  90° quarter to read.
- **eyes** — collective NPC; rendered as a single representative
  figure (the audit-doc canonizes this: "eyes is rendered as one
  figure for production purposes; lore is a collective"). Cloak
  + hood; eyes obscured.
- **gamemaster** — game-show host suit; fingers-tented at chest
  height. The suit's shoulder-padding is silhouette-defining;
  must read in profile.
- **iron_lion** — lionkin warrior, full plate. The mane shape in
  profile is critical; reference the existing
  `iron_lion/expressions.avif` for mane geometry.
- **kael_recruiter** — military fatigues, recruitment-officer arm
  band. Posture: parade-rest.
- **matrikala** — Vedic-coded archivist with sari draping. The
  sari's drape across the back-half (135°-225°) is the
  production-critical detail.
- **necromancer** — bone-staff, hooded. Hood up; face fully
  obscured in front-3 frame.
- **nilmorg** — alien diplomat; non-humanoid silhouette. The
  audit-doc'd silhouette is reference material — verify against
  `docs/built/LORE_BIBLE.md` §"Nilmorg form."
- **programmer** — coding hoodie, terminal-prop. The terminal
  glows; that glow is in the turnaround as an inset light source
  on the figure (not a background effect).
- **seer** — robed mystic, bowl in hands. The bowl is canon
  ("the Seer's bowl"); must be the same one shown in
  `seer/bust.avif`.
- **shadow_tongue** — black-robed; voice-actor's silhouette has a
  signature lean. The lean is in the front-3 frame; the full-8
  shows the lean as a stable feature, not a momentary pose.
- **the_antiquarian** — scholar's robe, monocle. The monocle is
  on the right eye (audit-canon).
- **the_meme** — pop-aesthetic figure; loud palette. The
  background MUST stay matte black — the meme aesthetic is in the
  figure, not the field.
- **the_source** — bardic instrument-bearer; instrument is canon
  (lyre-equivalent). The instrument geometry on the back-half is
  the cosplay-critical surface.
- **warlord** — armoured. Cape behind; cape's rear silhouette in
  the 135°-225° quarter is the production-critical detail.
- **watcher** — surveillance figure, multiple eye-icons stitched
  on the cloak. Eye-count and placement on the back of the cloak
  must match `watcher/expressions.avif`.

## Production checklist (asset team)

Per character:
- [ ] `front_turnaround.avif` — 2752×1536, ≤ 200KB, three-quarter
      front
- [ ] `full_turnaround.avif` — 2752×1536, ≤ 200KB, eight-frame full
- [ ] Manifest entry flipped from `pending: true` → `pending: false`
- [ ] `_inventory.json` regenerated via the existing inventory
      script (same path the protagonist turnarounds shipped through)
- [ ] PR updates this doc's checklist row to ☑

## When all 24 ship

The audit-tracker entry Cos1 closes. The follow-up consumer surface
(in-game character codex page renders the turnaround instead of the
bust — separate PR) reads the same manifest.
