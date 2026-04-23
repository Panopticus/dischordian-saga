# Reference images for Living Character Sheet commission

This directory is the canonical drop-zone for the canon reference images
that feed the Living Character Sheet art pipeline. Asset generation
(Meshy v5 for 3D rigs, Nano Banana 2 for turnaround / viseme sheets,
Veo 3.1 for cinematics) reads from here.

**Authoritative brief:** `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`
— specifically Part 10.2's pre-commission checklist, which this tree
enumerates.

## Structure

```
references/
├── protagonists/
│   ├── elara/front.png + REFERENCE.md
│   └── human/front.png + REFERENCE.md
├── npcs/
│   ├── {npcId}/front.png + REFERENCE.md          (per 22-NPC roster)
│   ├── engineer_prince/phase1_prince/            ⚠ pending user upload
│   ├── engineer_prince/phase2_engineer/          ✓ canon locked
│   ├── source/phase-1, phase-2, phase-3/         (Kael's three-phase rig)
│   └── warlord_armored/  + warlord_host_face/    (default vs reveal-cinematic)
└── 3d-turnarounds/
    └── {characterId}/{front,3q_left,side_left,back}.png
```

## Canon status (as of 2026-04-22)

**✅ User-locked (drop images here when ready to commission):**
Elara, The Human, Agent Zero, Adjudicator Locke, Kael/Source (3-phase),
The Antiquarian, Shadow Tongue, The Architect, The Authority, The
Collector + Corey, The Degen, Eidola, The Gamemaster, Matrikala, Meme/
Palimpsest entity, Minnie, Necromancer, Nilmorg, The Programmer, The
Seer, Warlord (armored + host-face-under-helm), Watcher, Engineer
(Phase 2).

**⚠ Awaiting user canon upload:**
Engineer/Prince Phase 1 (`engineer_prince/phase1_prince/`). Candidate
source: `docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png`.
User confirmation required before finalizing.

**❌ Retracted (no longer an NPC):**
CADES — audit revealed it's the Comprehensive Analysis & Defense
Engagement System (a game-mode), not a character. Directory is intentionally
omitted.

## REFERENCE.md per character

Each character directory should contain a `REFERENCE.md` that:
1. Cites the Part 2 subsection in the art brief that defines canon
2. Links to the canonical reference image (e.g. `./front.png`)
3. Lists explicit DO-NOT-DEPICT constraints inherited from the brief

Example for the Warlord (see `npcs/warlord_armored/REFERENCE.md`):

```md
# Warlord (armored default render)

Canon: docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md §2T
Image:  ./front.png
Shader: apps/client/public/rigs/SwarmHostedArmorPortrait.preset

DO NOT DEPICT:
- Her face, ever. Helm stays DOWN for all of Act 1.
- The swarm directly. Only the visor-edge shimmer hints at its presence.
```

## How asset pipelines read this tree

- **Meshy v5 / Tripo3D (image-to-3D):** reads `front.png` + the per-set
  turnaround sheets under `3d-turnarounds/` as input plates.
- **Nano Banana 2 (viseme sheets, expression variants):** reads
  `front.png` as identity anchor; produces `portraits2d/{npcId}/` outputs.
- **Veo 3.1 (cinematics):** reads START + END frames generated from
  Nano Banana 2, which in turn read this directory as character-identity
  input.

Paths, runtime shader uniforms, and per-character rig specs are all in
the art brief. This directory is the input side of that pipeline.
