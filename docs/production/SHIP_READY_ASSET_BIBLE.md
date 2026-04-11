# SHIP-READY ASSET BIBLE — Dischordian Saga

> **Purpose:** Every missing art still, cinematic, and voice-over line that must be produced for Dischordian Saga to ship. One document, grouped by game mode, with tool-specific prompts ready to copy-paste.
>
> **Date:** 2026-04-11
> **Scope:** 46 game modes (6 ship-ready, 40 needing assets). All sources reconciled from: `docs/production/FULL_AUDIT_REPORT.md`, `MISSING_CUTSCENES.md`, `COMPLETE_ART_PROMPT_BIBLE.md`, `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`, `VOICE_OVER_BIBLE.md`, `DiscoveryVideoOverlay.tsx`, `witnessingAssetManifest.ts`, `gameData.ts`, `npcPortraits.ts`, and the 6 TS dialog files.
>
> **Branch:** `claude/game-modes-asset-audit-bp1LV`

---

## Section 0 — How to Use This Doc

This bible is split into three toolchains:

| Tool | What to feed it | Section |
|---|---|---|
| **Nano Banana 2** (image generation) | Prose in **Nano Banana 2 prompt** fields. Each prompt is self-contained — paste the whole thing, render at the listed size, save to the listed output path. | §3 (art), §2 (start/end frames inside cutscenes), §3.7 (Witnessing frames) |
| **Seedance 2.0** (video generation) | Pair of start-frame + end-frame images you just rendered from Nano Banana 2, plus the **Seedance 2.0 motion prompt**. Seedance takes start image + end image + motion directive. | §2 (cutscenes) |
| **ElevenLabs** (voice-over) | Use §4.1 to set up the 14 voice profiles in ElevenLabs Voice Library. Then paste the CSV block in §4.2 into ElevenLabs Studio → Projects → Import CSV, or feed it to the Python SDK in a loop. Every row → one MP3. | §4 |

**Visual style anchor (applies to every image prompt unless overridden):**
> Dark sci-fi aesthetic. Deep space blacks (#0a0a1a to #010020) as the base. Neon accents: cyan (#22d3ee), foxfire green (#00e676), corrupted red (#ff1744), sacred gold (#fbbf24), violet (#e040fb). Holographic overlays, scanlines, volumetric fog, anamorphic lens flare, cinematic 4K quality with film grain. Cyberpunk meets cosmic horror. Dramatic rim lighting. No rendered text in images — overlays are added in code.

**Seedance 2.0 motion prompt style:**
> Verb-led, time-anchored, camera-first. Format: `[camera movement] as [subject action], [beat change at X seconds], [VFX arc], [emotional tone]. 24fps. Cinematic composition.` Keep under 400 characters. Never describe the start or end frame — that's what the key-frame images are for.

**ElevenLabs CSV format (§4):**
> `id,character,voice_profile,stability,similarity,style,speaker_boost,text,direction,priority`
> Text field may contain ElevenLabs SSML (`<break time="Xms"/>`, `<emphasis level="moderate">`, etc.) and is quoted with doubled inner quotes to be valid CSV.

---

## Section 1 — Master Index

| Priority | Cutscenes | Art Stills | VO Lines | Total |
|---|---|---|---|---|
| **P0** (ship-blockers) | 23 | ~230 | ~350 | **603** |
| **P1** (important) | 15 | ~180 | ~400 | **595** |
| **P2** (polish) | 8 | ~150 | ~424 | **582** |
| **Placeholder directories** | 29 | — | — | **29** |
| **Witnessing frames (all tiers)** | — | ~1,500 | — | **~1,500** |
| **TOTAL ROWS TO PRODUCE** | **75** | **~2,060** | **~1,174** | **~3,309** |

### Quick-ship ordering (do these in order)

1. **§2.1 — Loredex discovery cinematics** (13 rows, P0) — unlocks the encyclopedia/lore UX.
2. **§3.1 — 20 missing fighters × 4 sheets** (80 rows, P0) — blocks the full roster.
3. **§4.1 + §4.2 top 50 rows** — Elara awakening, Antiquarian Year One vote intros, Human first contact. The ~20-minute "first impression" window.
4. **§2.2 — Story mode fight cinematics** (17 rows, P0/P1) — chapter boss intros.
5. **§3.3 — Game mode environments** (27 rows, P0/P1) — backgrounds for pet battles, PvP card, space station, trade empire, boss arenas, coop raids, casino.
6. Everything else.

---

