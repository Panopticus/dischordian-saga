# DREAM ART COMPENDIUM — Dischordian Saga

> **Purpose.** One source-of-truth art production manifest for every non-TCG-card visual asset in the Dischordian Saga universe. Every entry ships with an audit grade against AAA standards and a copy-paste-ready Nano Banana 2 prompt. Cutscenes additionally carry Seedance 2.0 keyframe-pair prompts.
>
> **Scope IN:** All UI, icons, frames, backgrounds, empty states, loading screens, logos, mini-games, character portraits, fight animations, story NPCs, Eidolons, specimens, Ark rooms, arenas, planets, stations, special maps, page-route backgrounds, VFX, status effects, cinematic keyframe pairs, TCG card-backs / frames / rarity gems / keyword icons / pack artwork, Cades-FPS and Dead Man's Circuit engine assets, faction heraldry, seasonal event art.
>
> **Scope OUT:** The 316 TCG card illustrations themselves (governed by `docs/TCG_ART_SPEC.md`). Voice-over lines (ElevenLabs — governed by `SHIP_READY_ASSET_BIBLE.md §4`). SFX and music (Suno / CADES SFX docs remain authoritative).
>
> **Supersedes:** `ART_PRODUCTION_BIBLE.md`, `COMPLETE_ART_PROMPT_BIBLE.md`, `VISUAL_PRODUCTION_BIBLE.md`, `SHIP_READY_ASSET_BIBLE.md §3`, `STORY_MODE_ART_BIBLE.md`, `CASINO_EXPANSION_ART_BIBLE.md`, `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`, `PARALLAX_ROOMS_ART_BIBLE.md`, `PLAYER_CABIN_ART_BIBLE.md`, `LORE_GALLERY_ART_BIBLE.md`, `BREEDING_SYSTEM_ART_PROMPTS.md`, `MECHRONIS_ART_PROMPTS.md`, `CELEBRATION_ART_PROMPTS.md`, `CHRISTMAS_IN_JULY_ART_BIBLE.md`, `OPTIONAL_COMPONENTS_ART_BIBLE.md`, `PAGE_BACKGROUND_ART_PROMPTS.md`, `MISSING_ART_PROMPTS.md`, `DEAD_MANS_CIRCUIT_PRODUCTION.md` (deprecation gated — do not delete sources until this compendium ships complete).
>
> **Build status:** Incrementally drafted in 16 commits (B0–B15). Each commit is artist-usable.

---

## Table of Contents

- **Part A — Direction & Methodology**
  - A.1 Mission & Non-Negotiables
  - A.2 Global Style Anchor (inherited by every prompt)
  - A.3 Global Negative Prompt
  - A.4 Faction Palettes (8 factions, hex-locked)
  - A.5 Nano Banana 2 Prompting Rules
  - A.6 Audit Rubric & Grade Mapping
  - A.7 Prompt Entry Template (fixed 12-field block)
  - A.8 Canonical Character Lock-List
- **Part B — Ship-Wide Primitives** *(pending B0b)*
- **Part C — Characters & Creatures** *(pending B1, B4, B6, B10, B14)*
- **Part D — Environments & Backgrounds** *(pending B2, B3, B8)*
- **Part E — Game Modes & Features** *(pending B9)*
- **Part F — VFX, UI, Iconography** *(pending B7)*
- **Part G — Cinematics (Keyframe Pairs)** *(pending B5, B13)*
- **Part H — External Engine Assets** *(pending B11, B12)*
- **Part I — Cross-References & Appendices** *(pending B15)*

---

# PART A — DIRECTION & METHODOLOGY

## A.1 Mission & Non-Negotiables

The compendium exists because Dischordian Saga's art is currently spread across 20+ fragmented production bibles, ~1,285 deployed image files of inconsistent quality, and 25 CloudFront-hosted room backgrounds with no single owner. This document fixes that by giving every asset one entry, one grade, one prompt.

**Non-negotiables (violate any of these and the asset is rejected):**

1. **Dark sci-fi / biomechanical horror.** No cartoon, no anime, no flat illustration, no oil-paint simulation. Cinematic prestige rendering only.
2. **No embedded text.** All captions, HP bars, names, and UI labels are overlaid in code. Generated images with baked-in text are rejected.
3. **Canonical character gender is locked.** See A.8. Any portrait rendering The Warlord, Agent Zero, The Enigma, or The Seer as male is rejected on sight.
4. **Transparent backgrounds for sprites.** All character portraits, creature sprites, and UI icons export as PNG with clean alpha. Environmental backgrounds export as JPG (no alpha).
5. **One asset = one path.** Every prompt targets a single output path in `apps/client/public/art/...` (or `client/public/art/...` legacy). Two entries may not point at the same path.
6. **Faction palette fidelity.** Any asset belonging to a faction must use that faction's hex codes from A.4. Ambient color overlays (CSS) apply on top; the base asset must not contradict them.

## A.2 Global Style Anchor

Every prompt in this compendium copy-pastes the following 2-line capsule inline (do not reference it — paste it). Batch generators grep for exact-match style anchors for consistency auditing.

```
STYLE ANCHOR: Hyper-realistic cinematic 4K dark sci-fi. Deep space black base
(#0a0a1a→#010020). Neon accents — cyan #22d3ee, foxfire green #00e676, corrupted
red #ff1744, sacred gold #fbbf24, violet #e040fb. Volumetric fog, anamorphic
lens flare, film grain, dramatic rim lighting, cyberpunk meets cosmic horror.
No rendered text in image.
```

## A.3 Global Negative Prompt

```
NEGATIVE: cartoon, anime, chibi, flat illustration, watercolor, oil painting,
low quality, blurry, out of focus, jpeg artifacts, watermark, signature,
text, letters, numbers, logos, flat lighting, studio white background,
duplicate limbs, extra fingers, mangled hands, asymmetric eyes,
photobashing seams, pixel art (unless explicitly requested).
```

## A.4 Faction Palettes (hex-locked)

Each faction has three locked layers: **primary** (dominant surface color), **accent** (neon / energy), and **trim** (material hint). A prompt for a faction asset must name at least the primary and accent hex inline.

| # | Faction | Primary | Accent | Trim | Material Language |
|---|---|---|---|---|---|
| 1 | **Architect / AI Empire** | Crimson `#ef4444` | Cyan `#22d3ee` | Black steel, chrome silver | Brutalist industrial megastructure, cold computational precision, panopticon plates, digital glitch lines |
| 2 | **Insurgency (Human Resistance)** | Golden amber `#f59e0b` | Signal green `#22c55e` | Slate blue `#94a3b8`, gunmetal grey | Guerrilla warfare patches, encrypted transmissions, dog tags, reclaimed tech, oil-stained fatigues |
| 3 | **Dreamer / Ne-Yons** | Deep purple `#7c3aed` | Gold `#fbbf24` | Astral blue, pearl iridescence | Mystical foreknowledge, fractal geometry, probability clouds, swirling sigils, robes woven from sound |
| 4 | **New Babylon (Corporate)** | Gold `#fbbf24` | Blood red `#991b1b` | Obsidian black, crystal blue `#60a5fa` | Scales of justice on obsidian, crystal shards, price tags, ornate cruelty, holographic ledgers |
| 5 | **Antiquarian (Knowledge)** | Amber `#f59e0b` | Temporal blue `#3b82f6` | Aged parchment, hourglass gold | Time-shifted echoes, impossible libraries, brass orreries, red-glowing goggles, leather ledger covers |
| 6 | **Thought Virus (Corruption)** | Toxic green `#84cc16` | Corruption pink `#ec4899` | Void black, bioluminescent | Neural networks, viral tendrils, five concentric corruption rings, wet chitinous skin, spore pods |
| 7 | **Hierarchy of the Damned (Infernal)** | Deep red `#7f1d1d` | Foxfire green `#00e676` | Obsidian black, corporate chart lines | Corporate occultism, demon lords as C-suite executives, infernal spreadsheets, contract seals |
| 8 | **Neutral / Ark** | Slate white `#f1f5f9` | Starfield blue `#60a5fa` | Silver, hull grey `#475569` | Utilitarian hope, the last ship, clean silver borders, sleek ark plating, mission patches |

## A.5 Nano Banana 2 Prompting Rules

1. **Prose over keyword soup.** Nano Banana 2 responds best to continuous natural-language scene descriptions with clear subject / framing / lighting / palette / atmosphere blocks. Avoid comma-salad keyword lists.
2. **Order inside every prompt:** SUBJECT → POSE/ACTION → FRAMING/CAMERA → ENVIRONMENT → LIGHTING → PALETTE (inline hex) → ATMOSPHERE/VFX → STYLE ANCHOR → negative prompt reference.
3. **Aspect ratio by path.** Hero / cinematic backgrounds = 16:9 (1920×1080). Portraits = 2:3 (1024×1536). Sprites = 1:1 (1024×1024) with transparent background. Parallax layers = 16:9 with separate disparity-map render pass.
4. **Resolution discipline.** Render at **2× target resolution**, Magnific upscale if needed, downscale to spec. Fine sprites (96×96) render at 512×512 then downscale for crisp detail.
5. **Seed locking for character consistency.** Within a single character's entry block (e.g. all 4 shots of Iron Lion), use the same random seed as the portrait so pose variants stay recognizable.
6. **No internal cross-references inside a prompt.** A prompt never says "as defined in B.3" — it pastes the primitive prose inline. This makes every entry copy-pasteable into a batch queue.
7. **Explicit gender in every human-character prompt.** The words "male" / "female" / "androgynous" appear in the first 10 words of every human character prompt to prevent drift toward model defaults.
8. **"No rendered text"** is repeated in every prompt's final line. Nano Banana 2 otherwise hallucinates labels, tattoos, and sign boards.

## A.6 Audit Rubric & Grade Mapping

Every existing asset on disk is audited against six criteria, each scored 1–5. Total out of 30.

| # | Criterion | 5 (A) | 3 (C) | 1 (F) |
|---|---|---|---|---|
| 1 | **Composition** | Intentional framing, clear focal hierarchy, cinematic negative space. | Readable subject but flat blocking. | Centered blob, no hierarchy, tangents. |
| 2 | **Character fidelity** | Matches canonical gender, ethnicity, wardrobe, silhouette. | Mostly correct, minor drift. | Wrong gender/ethnicity/faction palette. |
| 3 | **Lighting & palette** | Hex-locked faction palette, cinematic rim light, correct color temperature. | Some palette drift, adequate shading. | Mud / flat light / off-brand colors. |
| 4 | **Resolution & crispness** | Sharp at 2× intended display size. | Usable at display size, soft edges. | Blurry, jpeg artifacts, aliasing. |
| 5 | **Style alignment** | Reads as Dischordian Saga dark sci-fi, identical voice to anchor assets. | Close but generic sci-fi. | Cartoon / stock / anime / off-brand. |
| 6 | **Usage fit** | Correct aspect, transparent where needed, composition leaves space for overlays. | Works but needs cropping. | Broken aspect, no alpha, UI would overlap subject. |

**Grade mapping:**

| Score | Grade | Meaning |
|---|---|---|
| 27–30 | **A** | Ship as-is. Canonical. |
| 22–26 | **B** | Ship. Minor polish nice-to-have. |
| 17–21 | **C** | Usable placeholder. Schedule regeneration for next content pass. |
| 12–16 | **D** | Regenerate. Existing asset blocks perception of AAA quality. |
| ≤ 11 | **F** | Regenerate immediately. Visible in-product as obviously broken. |
| — | **MISSING** | No asset exists on disk. Generate from scratch. |
| — | **CANONICAL-REFERENCE** | Overrides numeric grade. Locks the look for regenerations even if technically imperfect. Used for original art that defines the style voice. |

**Regeneration queue:** D and F grades are pulled forward into Part I.4's regen priority queue. MISSING entries are distributed across Parts C–H. CANONICAL-REFERENCE assets are tagged in Part I.3's file-path index as seed-lock targets for Magnific / Nano Banana 2 reference-image fields.

## A.7 Prompt Entry Template (fixed 12-field block)

Every entry in Parts C–H follows this block exactly. Missing fields show `—`, never omitted.

```
### [CAT-###] — Asset Name

- **Path:** apps/client/public/art/<subdir>/<file>.<ext>
- **Size / Aspect / Format:** 1920×1080 · 16:9 · JPG   (or PNG with alpha)
- **Usage:** Component file + line — where this asset is loaded
- **Priority:** P0 | P1 | P2
- **Audit Grade:** A | B | C | D | F | MISSING | CANONICAL-REFERENCE
- **Audit Notes:** 1–2 sentences on what was judged and why
- **Dependencies:** See §C.1.04, Reuses primitive §B.6.2, or —
- **Style Anchor:** (paste the A.2 capsule verbatim)
- **Prompt (Nano Banana 2):**
  > Self-contained prose. No internal references. Ends with palette hex block,
  > grain / flare note, "no rendered text."
- **Seedance Motion Prompt:** — (Part G only)
- **Post-processing:** Upscale / background removal / trim notes
- **Wiring:** apps/client/src/…/Component.tsx:123  (if known)
```

**Reader workflow:**
- Scanning for "what needs regenerating right now" → grep `Audit Grade: D\|Audit Grade: F\|Audit Grade: MISSING`.
- Batch-generating → grep `Prompt (Nano Banana 2)` and feed the following prose block into the model.
- Path uniqueness audit → grep `- \*\*Path:\*\*` and check for duplicates.

## A.8 Canonical Character Lock-List

These canonical attributes override any inferred default. Any prompt that contradicts them is rejected.

| Character | Locked Attributes |
|---|---|
| **The Warlord** | **Female.** Young woman, long blonde hair, cybernetic enhancements on right side of face, saffron-yellow hooded commander's coat over dark segmented armor, Archon faction. |
| **Agent Zero** | **Female.** Insurgency's deadliest assassin. Short dark hair, scarred left cheek, matte black tactical suit with orange static-silhouette motif, twin sidearms. |
| **The Enigma (Malkia Ukweli)** | **Female.** Kenyan heritage, dark skin, mid-thirties, short natural hair crowned with a band of golden light, iridescent gown woven from sound waves. Queen of Truth, 12th Ne-Yon. |
| **The Seer** | **Female.** Blue-skinned woman, long black hair, hooded robe. Insurgency prophet. |
| **Iron Lion** | Male. Grizzled human warrior, full beard, scarred face, Insurgency reclaimed armor, yellow insurgent arm-band. Protagonist of Cades-FPS. |
| **The Architect** | Non-gendered. Towering humanoid crystalline AI, single vertical-slit cyan eye, cold blue-white crystal planes. Scale: 100–200m tall when manifested. |
| **The Collector** | Male. Tall thin figure in long dark high-collar coat, face hidden behind bronze surgical mask with multiple lens-eyes, white-gloved hands. |
| **The Game Master** | Two canonical forms: (a) human in blue trench coat with top hat; (b) robot form in polished chrome with playing-card-suit cutouts. |
| **The Antiquarian (Dr. Daniel Cross)** | Male. Mid-40s originally, elderly scholar form after reincarnation. Rumpled dark lab coat, red-glowing goggles. Programmer reborn. |
| **The Source / Kael** | Male face dissolving into viral tendrils. Thought Virus apex. Dark crown of neural connections, eyes windows to infinite corruption. |
| **The Watcher** | Male, Japanese heritage. Calm observer. Architect's eye. Dark kimono over tactical underlayer, one cybernetic eye. |
| **The Jailer** | Male. Former Oracle, now imprisoned. Blindfolded, chains of light wrapped around forearms. |
| **The Necromancer** | Male. Academic mad scientist, theatrical flourishes, dark robes over lab coat. Death state-changer. |
| **The Degen** | Male. 8th Ne-Yon, entropy master, casino bartender aesthetic. Velvet jacket, dice-pattern cufflinks. |
| **White Oracle** | False prophet, Oracle possessed. Robed figure, white mask with single vertical seam, empty cowl interior. |
| **The Meme** | Genderfluid, shifting forms. Casino aesthetic. Face never the same twice. |

---

*Part B primitives and Parts C–I will be filled in subsequent batches. Current build state: **B0a shipped** (header + Part A). Next queued: **B0b** (Part B primitives).*
