# Silence in Heaven — Art Production Guide

## Naming Convention

All assets follow: `SIH-{TRACK##}-{FRAME##}-{descriptor}`

Examples:
- `SIH-01-01-city-wakes.png` (Track 1, Frame 1 keyframe)
- `SIH-01-01-city-wakes.mp4` (Track 1, Frame 1 motion clip)
- `SIH-PRO-01-void.png` (Prologue, Frame 1)

## The Two Narrators — Canonical Visual Reference

### THE ANTIQUARIAN (Dr. Daniel Cross / The Programmer)
- Seated in a high-backed chair made of tangled cables and starlight
- Massive leather-bound Chronicle open on his lap
- Ancient and weary. Dry, wry voice
- Red-tinted goggles
- Deep teal and gold palette when solo

### THE STORYTELLER (Malkia Ukweli / The Enigma)
- Stands at a glowing microphone stand
- Vibrant, defiant, warm
- Deep umber skin. Short, natural hair
- Crimson silk gown with flowing torn hem strips
- Antique gold cross at her neck

## Color Palettes by Track

| Track | Title | Palette | Overlay |
|-------|-------|---------|---------|
| PRO | Prologue: The Void | Stage-lit dark | Clean |
| 01 | New Babylon Goddamn | Neon red + gold | Scanlines, corruption |
| 02 | Letters to the Remnant | Deep blue + amber | Grain, vignette |
| 03 | Turn Back | Cold white + deep black | Corruption (building) |
| 04 | Worthy (Who Can Open It) | Gold + white | Clean |
| 05 | Behold (The Horsemen) | White/red/black/pale grey | Grain (building) |
| 06 | Plead the Fifth | White + deep red | Vignette, scanlines |
| 07 | The Two Witnesses | Cold blue + warm amber | Scanlines |
| 08 | The Trumpets | Each trumpet a color → white | Corruption (building) |
| 09 | They Would Not Repent | Corporate gold + static grey | Heavy scanlines |
| 10 | False Prophet | Warm gold + velvet | Clean |
| 11 | Sixth Sense | Neon red + ultraviolet | Chromatic aberration |
| 12 | Silence in Heaven | Pure black → white | None |
| 13 | The Mark | Warm domesticity | Vignette |
| 14 | The Harvest | Natural gold | Clean |
| 15 | It Is Done (The Bowls) | Seven colors → white | Corruption |
| 16 | Fall of New Babylon | Crumbling gold, dust | Grain |
| 17 | Faithful and True | Pure white → warm gold | Clean |
| 18 | All Things New | Dawn: water, green, new light | Clean |

## Frame Count by Track

| Track | Frames | Notes |
|-------|--------|-------|
| PRO | 1 | The void — two spotlights |
| 01 | 7 | Full production (7 frames + dialog) |
| 02 | 7 | Full production |
| 03 | 6 | Full production |
| 04 | 5 | Full production |
| 05 | 5 | One per horseman + all-four |
| 06 | 6 | Full production |
| 07 | 6 | Full production |
| 08 | 5 | One per trumpet group |
| 09 | 4 | Full production |
| 10 | 6 | Full production |
| 11 | 6 | Full production |
| 12 | 5 | Minimal — silence is the point |
| 13 | 1 | Hero frame only |
| 14 | 1 | Hero frame only |
| 15 | 1 | Hero frame only |
| 16 | 1 | Hero frame only |
| 17 | 1 | Hero frame only |
| 18 | 2 | Hero frame + final Chronicle page |

**Total: ~76 frames**

## Art Production Pipeline

For each frame:
1. Copy the KLING PROMPT from the Kling prompts file → Generate keyframe in Kling v2
2. Artist reviews → approve or re-prompt with adjustments
3. Copy the SEEDANCE MOTION from the Kling prompts file → Apply to approved keyframe
4. Export motion clip → Upload to CDN
5. Name the files: `SIH-{TRACK##}-{FRAME##}-{descriptor}.{ext}`
6. Add CDN URLs to the track data file in `apps/shared/slideshowData/silence-in-heaven/`

## Character Appearances by Track

| Character | Tracks |
|-----------|--------|
| The Antiquarian | PRO, 01, 02, 03, 04, 05, 07, 08, 09, 14, 18 |
| The Storyteller (Malkia) | PRO, 01, 02, 03, 04, 06, 07, 09, 11, 16, 18 |
| The Politician | 01, 04 |
| The Warden | 01, 04 |
| The White Oracle (False Prophet) | 10, 12 |
| The Hierophant | 07 |
| The Oracle | 07 |
| The Seer | (v1 Track 2 — omitted in v2) |
| The Human | (v1 Track 3 — "It Ain't Been the Same") |
| The Necromancer | 08 (dialog overlay on existing video) |
| The Female Devil | 11 |
| The Architect | 12, 18 |
| The Dreamer | (v1 Track 11 — Samsara) |
| The Resurrectionist | (v1 Track 11 — Samsara) |
| Binath-VII / Clone Army | (v1 Track 15 — "Awaken the Clone") |
| The Source (Kael) | (v1 Track 16) |

## Existing Music Videos (Play Video, Overlay Theater Mode)

| Track (v1 numbering) | Title | YouTube |
|----------------------|-------|---------|
| The Ninth | The Ninth | youtube.com/watch?v=szJ_B13c3ik |
| Judgment Day | Judgment Day | youtube.com/watch?v=mIUKgCWp2f4 |
| Walk in Power | Walk in Power | youtube.com/watch?v=GaTtZiD0qfQ |
| The Queen of Truth | The Queen of Truth | youtube.com/watch?v=WiV_Ax_4wBo |
| A Very Civil War | A Very Civil War | youtube.com/watch?v=-Lyq0lEzzm4 |
| The Ocularum | The Ocularum | youtube.com/watch?v=Loc03QeRpfM |
| Awaken the Clone | Awaken the Clone | youtube.com/watch?v=KljI0bV8mm0 |
