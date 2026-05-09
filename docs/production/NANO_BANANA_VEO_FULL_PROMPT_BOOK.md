# Nano Banana 2 + Veo 3.1 — Full Prompt Book

> **Drag-and-drop prompt book for every video deliverable in
> `docs/ART_DEPARTMENT_PRODUCTION.md` §3.**
> Generated 2026-05-08 alongside the Art Department Production Document.
>
> **Scope:** every story-mode fight intro, living-universe event cinematic,
> crew awakening cinematic, prestige-cycle cutscene, guild signature pair,
> and dreamer-vision VFX flash that the queue calls for. Card-game UI SFX
> prompts (audio-only) are at the end.

---

## Table of contents

0. [How this doc works](#0-how-this-doc-works)
1. [House style + palette + camera](#1-house-style--palette--camera)
2. [Character canon — visual + voice](#2-character-canon--visual--voice)
3. [Story-mode fight-intro cinematics — 17 chapters](#3-story-mode-fight-intro-cinematics)
4. [Living-universe event cinematics — 5](#4-living-universe-event-cinematics)
5. [Crew awakening cinematics — 3](#5-crew-awakening-cinematics)
6. [Prestige-cycle cutscene — `the-reset`](#6-prestige-cycle-cutscene--the-reset)
7. [Guild signature cutscenes — 12 professors × {light, dark}](#7-guild-signature-cutscenes)
8. [Dreamer-vision VFX flashes — 3](#8-dreamer-vision-vfx-flashes)
9. [Card-game UI SFX — 10 stings](#9-card-game-ui-sfx)
10. [audit/15 multi-perspective — production-asset additions](#10-audit15-multi-perspective--production-asset-additions)
    - 10.1 Character turnaround sheets — 50 stills (Cos1)
    - 10.2 Wheel-followup reaction cinematics — 6 cinematics (C1)
    - 10.3 Human reveal transition cinematics — 4 cinematics (C2)
    - 10.4 Act 6 confession-close stance cinematics — 14 cinematics (C4)
    - 10.5 Chapter-card telegraphs — 28 stills (Strm6)
    - 10.6 Room state visual overlays — 7 stills (ER2)
    - 10.7 Blood Weave portrait progression — 40 stills (Cos5b)
    - 10.8 Manuscript vault — 4 stills (Co1)

---

## 0. How this doc works

Each cinematic is broken into ordered **shots**. Every shot is rendered with
the **Nano Banana 2 → Veo 3.1 keyframe handoff** pipeline:

```
Nano Banana 2 (still)        Veo 3.1 (motion)             Nano Banana 2 (still)
   ┌──────────┐                ┌──────────┐                  ┌──────────┐
   │ START    │ ── upload as ─▶│  motion  │── upload as ────▶│ END      │
   │  frame   │   keyframe-A   │  prompt  │   keyframe-B     │ frame    │
   └──────────┘                └──────────┘                  └──────────┘
        ▲                                                          │
        │                                                          ▼
   Shot N start                                              Shot N+1 start
   (= Shot N-1 end)                                          (= this Shot's end)
```

**Frame-chain rule (mandatory).** The **end frame of shot N** is the
**start frame of shot N+1**, byte-identical. When a cinematic transitions
to a new tableau, the LAST shot of the old tableau ends on the FIRST frame
of the new tableau (so the new tableau already exists in the prior shot's
final 4–8 frames as a fade-in or pull-back reveal). Veo 3.1 supports this
natively via the dual-keyframe input.

**Shot length.** Default 12 s. Range 8–20 s. Choose by content density,
not preference — interrupt yourself if the shot stops moving.

**Audio rule (mandatory).** **No music.** Each shot ships with:
- **Ambient room tone** (a 12 s loop matched to the tableau — server-side
  silence-bed, cited per shot).
- **VFX SFX** (cited per shot — keep to ≤3 stems per shot).
- **Dialog** (cited per shot, with voice direction; ElevenLabs render).

If a shot needs a sting, request it from the SFX section in §9, not Suno.

**Aspect.** 16:9 at 3840×2160 for fight intros + event + prestige + guild
signatures (Seedance / Veo 4K masters); 16:9 at 1920×1080 for awakening
loops and dreamer-vision VFX.

**Frame rate.** 24 fps everywhere. Veo 3.1 outputs natively at 24.

**Path.** Each row in §3–§8 cites the CDN target path. All resolve via
`assetUrl(...)` once uploaded.

---

## 1. House style + palette + camera

### 1.1 Aesthetic anchors (apply globally)

- **BioWare cinematic lighting × Blade Runner palette × bio-mechanical
  horror with corporate cool.** Dark academia overtones for Mechronis
  interiors. Cyberpunk neon for Nexon / city scenes. Cosmic abstraction
  for Authority / CoNexus / Architect / Source scenes.
- **Painterly digital illustration** at the still level with visible
  brushwork at 1:1 and clean read at thumbnail scale.
- **High-contrast, low-saturation** palette anchored on **one hot accent
  colour per piece, never two**.
- **Cinematic lighting** — single dominant key source, soft volumetric
  haze gradient across at least three depth planes, rim light only on
  hero silhouettes.
- **Materials** skew **bio-mechanical / crystalline / wet-chrome /
  weathered ceramcrete**; surface detail at the level of paint chips,
  water-staining, and honest wear.
- **Subtle eldritch geometry** suggested in negative space (rings within
  rings, recursive spirals, impossible angles) — never explicit.
- **No on-image text, no UI chrome, no lens flares (anamorphic streak
  ok), no modern logos, no readable signage** unless explicitly called
  for in the shot (CRT chrome on Marion-Kell-style frames is the only
  exception).

### 1.2 Palette anchors

| Surface | Base | Accent |
|---|---|---|
| Mechronis interiors | Deep-space-black `#010020` + ash `#1a1a24` | Brass `#b88c3a` + book-leather oxblood `#5b1a1a` |
| Nexon / cyberpunk city | Indigo-black `#0a0d2e` | Magenta `#ff2bd6` OR cyan `#22d3ee` (never both) |
| Authority / CoNexus | Void-black | Authority-red `#c11414` |
| Insurgency / Source | Cold steel `#2c3540` | Hot orange `#ff6b1a` |
| Dreamer / cosmic | Iridescent black | Iris-cyan `#7df3ff` |
| Celebration / mascoteer | Pastel cream | One pure pop-colour per character (Minnie pink, Prince royal-blue, etc.) |

Cyan `#22d3ee` is **Elara's energy signature** and should appear on her
in every shot regardless of tableau.

### 1.3 Camera vocabulary (Veo 3.1)

Use these motion verbs verbatim — Veo 3.1 parses them reliably:

- **slow push-in** (default for reveals)
- **slow pull-back** (default for closes)
- **dolly orbit, 30°, around hero** (default for hero-vs-villain tableaux)
- **handheld micro-shake, locked frame** (action / panic)
- **rack focus from foreground to background** (reveal)
- **whip-pan to** (cut-equivalent within continuous take)
- **tilt up / tilt down, 15°**
- **camera locked, hero moves through frame**
- **subject parallax across two depth planes**

**One continuous camera move + one dominant visual idea per shot.** No
exceptions. If you need a second idea, it's a second shot.

### 1.4 Dialog placement

- Dialog plays **over** the shot's motion, not against a still freeze.
- Hard sync: a character's mouth moves only on the lines they speak.
  Background characters stay closed-mouth or breathing-loop.
- Each shot lists **one to three lines max**. If a shot needs more,
  split it into two shots and chain frames.
- The **first frame after VO begins** must show the speaker's face or
  hands clearly enough to read who's speaking. Off-screen narration is
  reserved for the Engineer Memoir voice (Prince) — handled separately.

### 1.5 VFX vocabulary (cite per shot)

Pick from this list. Never invent new categories — extend an existing
category in the SFX brief if you need something new.

- `vfx_cyan_tessellation` — Elara's hologram lattice, low-amplitude
- `vfx_crimson_iris` — Human's eye-glow, slow pulse
- `vfx_brass_steam` — Engineer's goggles + utility belt steam
- `vfx_amber_runes` — Architect / Authority sigil flicker
- `vfx_voidblack_static` — Source / Kael corruption, granular, 8% noise
- `vfx_palimpsest_chromatic` — RGB channel separation, CRT scanlines
- `vfx_dreamer_substrate` — iris-cyan filaments, slow drift
- `vfx_thoughtvirus_purple` — magenta + violet bleed, infectious tendrils
- `vfx_authority_red_lattice` — geometric red lines, rigid grid
- `vfx_celebration_confetti` — pastel pop, slow-mo rotation
- `vfx_panopticon_eye` — single-eye iris-shutter, mechanical
- `vfx_witnessing_pulse` — radial bloom, cyan + cream layered
- `vfx_meme_static` — broadcast-static, intermittent sync loss
- `vfx_collector_dna_helix` — green double-helix sample columns
- `vfx_necromancer_red_smoke` — viscous, slow, ground-hugging
- `vfx_warlord_gold_sparks` — yellow welding-sparks, infrequent
- `vfx_seer_white_feathers` — slow descent, soft-focus
- `vfx_oracle_starwhisper` — glittering pinpoints in deep blue
- `vfx_terminus_orange_swarm` — many small orange particles, wave-like
- `vfx_shadowtongue_wraith_smear` — long-exposure black motion-blur

---

## 2. Character canon — visual + voice

> Every shot below cites characters by name. **For each appearance, the
> Nano Banana 2 prompt must include the visual canon line below verbatim,
> followed by per-shot pose / lighting / framing.** The Veo 3.1 motion
> prompt must include the voice direction line for any character speaking
> in that shot. ElevenLabs voice id maps to `apps/shared/<speaker>VoManifest.json`
> and `docs/production/VOICE_OVER_BIBLE.md` (do not re-cast voices here).

### 2.1 Hero canon (24 characters, from ART_DEPARTMENT_PRODUCTION.md §4.1)

| Character | Visual canon line (use verbatim in every NB2 prompt) | Voice canon (use verbatim in every Veo motion prompt) |
|---|---|---|
| **Elara** | Young woman, black wavy hair, blue eyes, grey-teal tessellated geometric top, ethereal/digital materiality; cyan rim-light; faint cyan tessellation drift over skin | Female, mid-20s, warm-clear-soprano, ElevenLabs `elara` voice (manifest `elaraVoManifest.json`); careful, observant, occasional dry warmth, slight digital harmonic at the edge of long vowels |
| **The Human** | Rugged 40s–50s man, crimson beard, fedora, glowing red-orange eyes, dark charcoal long coat with high collar; crimson iris rim, ember warmth on jaw | Male, late-40s, gravel-baritone, ElevenLabs `human` voice; tired, dry, ironic, never raises pitch; treats every line like a verdict already passed |
| **The Engineer** | Black man, short dreadlocks, red brass steampunk goggles, deep red military coat, brass utility belt; brass steam puffs at goggle vents | Male, 50s, smoky-baritone, ElevenLabs `engineerMemoir` voice; deliberate, every word weighed; awe and grief at equal volume; **Prince register** (used for Engineer Audio Logs) is gentler, half-whispered |
| **The Eyes** | Young East Asian woman, pink bob haircut, white tactical bodysuit, black handgun; sharp magenta rim-light on bob | Female, late-20s, clipped-alto, ElevenLabs `eyes` voice; military-flat, pauses between sentences instead of softening them |
| **The Game Master** (cyborg) | Fully mechanical cyborg skull, blue-painted metal skull, red goggle-eyepieces, blue military trench coat | Voice-modulator, genderless, ElevenLabs `gamemaster` voice; shifts pitch between phrases as if the speaker keeps forgetting the rules of voice; mid-tempo, never rushed |
| **Kael (Recruiter)** | Muscular man, brown dreadlocks, white ICL armor, blue-green eyes; gold sun-rim from above-left | Male, 30s, charismatic-tenor, no manifest yet — request ElevenLabs `kaelRecruiterVoManifest.json` session; salesman warmth, always-leaning-in cadence |
| **Kael (Source)** | Same man transformed: grey-blue skin, stone-like dreadlocks, chrome gauntlets; void-black halo behind, rim of corrupt-orange | Male, ageless, storm-baritone, request ElevenLabs `kaelSourceVoManifest.json`; same Recruiter voice but stretched across a void echo, ~120 ms slap-back |
| **Iron Lion** | White bald man, auburn beard, white power armor, black lion-head logo on left pauldron; harsh top-key rim | Male, 50s, parade-ground baritone, ElevenLabs `ironLion` voice (in `act3VoManifest`); barks, rolls every R, leaves space after orders |
| **The Watcher** | East Asian androgynous figure, black topknot, third-eye tattoo on forehead, white face mask under nose, white silk robes; soft white halo | Genderless, soprano-near-monotone, request ElevenLabs `watcherVoManifest.json`; whispered to mid-volume, never above; speaks in completed sentences only |
| **The Architect** | Dark hooded entity, black angular demonic mask, amber eyes burning behind the mask, star medallion on chest; amber rune-flicker around silhouette | Male, ageless, basso-profondo, ElevenLabs `architect` voice; slow, weighted, contains its own reverb; uses the imperative tense by default |
| **The Necromancer** | Elf-like ears, white spiky hair, red-tinted glasses, black coat with red-lined collar; red smoke ground-hug | Male, 40s, wet-tenor, ElevenLabs `necromancer` voice; sneering charm, sentences trail into laughter |
| **The Collector** | Hooded figure, dark robes, red glowing claws, glass tank of DNA samples behind; greenish under-light | Genderless, multi-tracked alto+baritone (two takes layered ~12 ms apart), ElevenLabs `collector` voice; every line sounds like a quote from a museum placard |
| **The Warlord** | Young woman, platinum blonde, yellow hooded jacket, face tattoos, green eyes; gold sparks at jacket hem | Female, 20s, hardcore-alto, request ElevenLabs `warlordVoManifest.json`; abrasive, drops consonants, smiles between threats |
| **The Meme / Palimpsest Host** | Older man, silver-grey hair, dark suit, cybernetic prosthetic hands, holographic face scan flickering across his head; broadcast-static frame | Male, 60s, late-night-host warm-tenor, ElevenLabs `palimpsestHost` voice (currently text-only — book session, see §3.1 of ART_DEPARTMENT_PRODUCTION); rehearsed cheer over real fatigue |
| **Agent Zero** | Woman, dark auburn hair, purple hood and face mask, amber eyes, purple-black tactical armor; magenta rim, smoke at boots | Female, 30s, smoky-contralto, request ElevenLabs `agentZeroVoManifest.json`; whispers at conversational distance, never raises volume even in combat |
| **The Seer** | Blue-skinned female angel, black hair, amber eyes, dark robes, flaming sword, white wings; halo of slow-falling white feathers | Female, ageless, choral-alto with overtone humming bed, ElevenLabs `seer` voice; speaks in present tense only, treats prophecy as observation |
| **The DeGen** | Blue-skinned bald male, pointed ears, amber eyes, tribal tattoos, olive military vest; sodium-yellow neon under-light | Male, 30s, casino-radio baritone, ElevenLabs `degen` voice; loose, fast, friendly until the bet closes |
| **The Enigma** | Black woman, long dreadlocks, navy military trench coat, gold buttons; cool key from stage-right | Female, 40s, low-velvet contralto, ElevenLabs `enigma` voice; never finishes a sentence the same way she started it |
| **Nilmorg** | Bald grey-skinned humanoid, amber eyes, steepled hands with silver spheres, charcoal three-piece suit | Genderless, demon-executive baritone, ElevenLabs `nilmorg` voice; precise, contractual, never theatrical; smiles only at outcomes |
| **The Programmer** | Young man, flat cap, red-tinted steampunk goggles, navy high-collar jacket; over-the-shoulder console glow | Male, late-20s, focused-tenor, ElevenLabs `programmer` voice (currently empty — book session); patient, explanatory, treats every conversation like a debug session |
| **Adjudicator Locke** | Young woman, purple hair, cybernetic eye patch (left), purple leather jacket, gold chains; magenta-violet key | Female, 30s, courtroom-mezzo, ElevenLabs `locke` voice; clipped, exact, dry humour at the edges |
| **The Shadow Tongue** | Dark hooded wraith, hidden face, dark blue robes, red-glowing claws; long-exposure smear trailing | Genderless, whisper-bass below normal hearing curve, request ElevenLabs `shadowTongueVoManifest.json`; lines arrive 50 ms before the speaker's lips move — known engine quirk, leave as-is |
| **The Antiquarian** | Older man, silver-grey hair and beard, black velvet frock coat with gold embroidery; warm tungsten key | Male, 60s, drawing-room tenor, ElevenLabs `antiquarian` voice; British-Atlantic, formal, savours every consonant |
| **CoNexus / The Authority** | Cosmic entity — dark sphere with teal circuit patterns, energy rings, lightning bolts; void-black field, cyan + red lattice | Genderless, choir-of-self (3 voices layered, octaves apart), request ElevenLabs `authorityVoManifest.json` (currently empty); judgments only, never questions |

### 2.2 Spectral / cosmic entities (§4.2)

| Character | Visual canon | Voice canon |
|---|---|---|
| **Eidola** | Spectral ribbon-form rigged with full lip-sync; iridescent black + iris-cyan filament; bust as master, elemental aspects {Auros, Cipher, Echo, Lux, Strain} as variants | Choral-soprano cluster, ElevenLabs `eidola` voice (currently empty — book session); speaks in three near-identical takes layered ~8 ms apart |
| **Matrikala** | Cosmic entity, full lip-sync rig, deep-space-black field with pinpoint constellations under skin | Female, ageless, contralto-with-glass-resonance, ElevenLabs `matrikala` voice (currently empty — book session); lines feel pre-recorded even when live |

### 2.3 Mechronis professors (§4.3) — for §7 guild signatures

All professors share a base canon: **Mechronis Academy** (dark academia
interior — leather-bound books, brass instruments, deep-space-black walls,
warm tungsten lamps, occasional cyan glyph circles on the floor). Each
has a personal accent colour and signature gesture.

| Professor | Visual canon line | Accent | Voice canon |
|---|---|---|---|
| **Kanevas** | Older male, austere robes, silver close-cropped hair, slate-grey eyes, conductor's-baton | Cyan | Male, 60s, conductor's tenor, ElevenLabs `kanevas` voice; precise, lyrical, treats every word like a tempo marking |
| **Aoki** | Young woman, jet-black bob, navy academic robes, black-rimmed glasses; pale skin | Indigo | Female, 30s, low-clear contralto, ElevenLabs `aoki` voice; calm, exact, faintly amused |
| **Halverez** | Older woman, grey-streaked dark hair pulled back, deep-emerald robes, owl-shaped brooch | Emerald | Female, 60s, warm rasp-mezzo, ElevenLabs `halverez` voice; storyteller, never hurries |
| **Orphic** | Slim androgynous figure, hood up, pale hands, long dark robes, half-mask covering eyes | Violet | Genderless, near-whisper baritone, ElevenLabs `orphic` voice; speaks in completed paradoxes |
| **Mireille** | Young woman, copper curls, sage robes with embroidered vines, soft round face | Sage-green | Female, 20s, breathy mezzo, ElevenLabs `mireille` voice; warm, occasionally sings the last word of a sentence |
| **Kasra** | Middle-aged man, dark beard, gold-trim crimson robes, single brass earring | Crimson | Male, 50s, brass-warm baritone, ElevenLabs `kasra` voice; declarative, occasional hand-on-chest emphasis |
| **Vellis** | Young man, ash-blond hair, ice-blue eyes, silver-trim robes | Ice-blue | Male, 30s, glassy tenor, ElevenLabs `vellis` voice; precise, distancing, slight smile-in-voice |
| **Greenshaw** | Older man, bald, wire-rim spectacles, grey wool robes, ink-stained fingers | Mustard | Male, 60s, dry-paper tenor, ElevenLabs `greenshaw` voice; pedantic, gentle |
| **Vex (professor)** | Tall woman, raven hair in long braid, black lacquered armour-robes, jade eyes | Jade | Female, 40s, low velvet contralto, ElevenLabs `vex` voice; contained, dangerous, never raises volume |
| **Vasara** | Older woman, white hair in tight bun, deep maroon robes, brass spectacles on chain | Maroon | Female, 70s, ceremonial alto, ElevenLabs `vasara` voice; slow, careful, treats each lecture as a ritual |
| **Vent** | Bearded inventor, leather apron over robes, brass goggles on forehead, soot streaks | Copper | Male, 40s, gravel-tenor, ElevenLabs `vent` voice; cheerful, distracted, mid-thought transitions |
| **Proctor** | Stocky man, military bearing, close-cropped grey hair, charcoal robes with sash | Charcoal | Male, 50s, parade baritone, ElevenLabs `proctor` voice; exacting, no warm-up, verdict-first then explanation |

### 2.4 Acts 2–7 Game Masters (§4.6, delivered 2026-05-08)

> **Distinct from the cyborg-skull Game Master in §2.1.** These two
> are the in-fiction co-hosts of Acts 2–7.

| Character | Visual canon | Voice canon |
|---|---|---|
| **Left Game Master** | Femme-presenting; pale skin webbed with fine black crack-line tattoos across face/neck/chest/hands; dark hair pulled back tight; cybernetic right eye (red-glow iris in brass/black socket, hairline scar branching); pointed elven ears; black 3-piece pinstripe blazer with peaked lapels, dark V-neck under it; gold compass-rose pendant on long chain; rings, black-painted nails | Female, ageless, clinical contralto, request ElevenLabs `gameMasterLeftVoManifest.json`; absolutes only; treats every line as a citation |
| **Right Game Master** | Masc-presenting; same skin and crack-line tattoos as Left; dark curling hair with two short upward-curving goat horns at temples; stubble; cybernetic right eye (mirror of Left); pointed elven ears; open-collar white cotton shirt under black blazer; same compass-rose pendant; rings, dark nails; pen/stylus held between fingers | Male, ageless, seductive baritone, request ElevenLabs `gameMasterRightVoManifest.json`; contingencies only; smiles between phrases |

**Background canon for both:** Gothic chamber, dim warm candlelight from
candelabras; hex-map / dice / dice-cup / tarot scattered foreground;
**towering red-eyed mech-skeleton silhouette** behind both (low-key rim
only — represents The Architect's gaze); banners with skull/wheel/occult
sigils.

### 2.5 Other named characters used in §3+ shots

| Character | Visual canon | Voice canon |
|---|---|---|
| **Vex Solène** (Ne-Yon agent) | Young woman, mid-20s; long auburn/dark-red hair flowing loose, wind-blown; amber/orange eyes; yellow weathered hooded raincoat (waxed-canvas, distressed, hood up); red-lensed brass steampunk goggles pushed up on hood; purple cloth half-mask over nose and mouth; brass+leather steampunk pauldron and arm bracers; high-saturation yellow + purple + brass + red-goggle-lens silhouette; rain-blurred neon city background (magenta+red signage), shallow DOF | Female, mid-20s, wry low-register, request ElevenLabs `vexSoleneVoManifest.json`; talks like she already knows how the conversation ends |
| **Marion Kell** | Young woman, late 20s, pale skin, damp dark wavy hair; dark haunted eyes, direct camera gaze; broadcast headphones around neck; dark-red shirt under unbuttoned black cardigan; lanyard "CONTESTANT 17 — MARION KELL"; CRT scanlines, RGB chromatic aberration stronger over her than the others | Female, late-20s, quiet measured unsurprised, request ElevenLabs `marionKellVoManifest.json`; one statement per episode, never repeats |
| **The Jailer** | Tall figure, masked, warden-coat in oxblood, key-ring of black-iron at hip, glowing slit in mask | Genderless, hoarse-bass, request `jailerVoManifest.json`; commands disguised as observations |
| **The Dreamer** | Cosmic figure, iris-cyan filaments forming face suggestion only, no fixed body, drifts | Choral-of-many, layered SATB, request `dreamerVoManifest.json`; speaks once per cinematic, treats time as an opinion |

### 2.6 ElevenLabs render protocol (per VO line)

1. Author the line at canonical character voice.
2. Render in the cited ElevenLabs voice; if voice is empty/unbooked,
   queue under "voice booking required" in the producer queue and ship
   the cinematic with text-only subtitles until the session lands.
3. Drop the rendered MP3 into `apps/shared/<speaker>VoManifest.json`
   keyed by the line id (`<cinematic>__<shot>__<character>` — e.g.
   `fight_05_watcher__shot_2__elara`).
4. Veo 3.1 picks up the audio at compose time via the line id pinned
   in the per-shot prompt below.

---

## 3. Story-mode fight-intro cinematics

> 17 fight-intro cinematics, one per chapter 5–21. Each is 4 shots
> (~48 s total). Path root: `videos/cutscenes/fights/<chapter>_<slug>/`.
>
> **Shot pattern (applied to every fight intro):**
> 1. **Establish boss** — wide; boss in their environment; player is off-screen (POV camera placement).
> 2. **Player approach** — POV reverse; player's silhouette / hand on weapon enters frame.
> 3. **Boss line + first-move tell** — close on boss; their canon line, their signature gesture begins.
> 4. **Tableau lock** — wide both fighters in frame; weapon drawn / first move complete; HUD-free freeze on the final frame, used as the gameplay-side first frame.
>
> Frame chain: shot N's end frame is shot N+1's start frame, byte-identical.

---

### 3.1 Chapter 5 — The Watcher

Path: `videos/cutscenes/fights/05_watcher/shot_{1..4}.mp4`

**Shot 1 — `establish_watcher` (12 s)**
- **NB2 START frame:** Pre-dawn temple courtyard, white silk banners, single ginko tree centre-back, mist below knee-height. **The Watcher** stands centre-frame three-quarter view: East Asian androgynous figure, black topknot, third-eye tattoo on forehead, white face mask under nose, white silk robes; soft white halo. Hands at sides, eyes closed. Single white feather drifting past her left shoulder. Camera position: low ¾ in front of her at 4 m.
- **NB2 END frame:** Same tableau, camera has pushed in to 2 m and tilted up 8°; Watcher's eyes are now open, third-eye tattoo faintly luminous; one more feather has landed on her left shoulder.
- **Veo motion (12 s):** *slow push-in, dolly 4 m → 2 m, tilt up 8°. Watcher inhales once, eyes open on second 9. Feathers drift. Voice direction: Watcher = genderless soprano-near-monotone, completed sentences only.*
- **VFX:** `vfx_seer_white_feathers` (intensity 0.4); ambient temple bell once on second 1.
- **Dialog:** *(none — silence + breath)*
- **Music:** NONE — temple-mist room tone only.

**Shot 2 — `approach_watcher` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.* Watcher centre, eyes open, ready.
- **NB2 END frame:** Same scene, camera has cut to player POV (over-the-shoulder, looking forward). Player's left hand entering frame foreground holding a deck-edge (Dischordia card silhouette); Watcher visible 8 m away, has taken one step forward. Her right hand rising to chest height.
- **Veo motion (10 s):** *whip-pan to player POV around second 2, settle. Player hand enters from below-left. Watcher takes one step forward, raises right hand. Voice direction: Watcher speaks line below, monotone-soprano, mid-shot.*
- **VFX:** `vfx_seer_white_feathers` (0.3); soft cloth-rustle on her step.
- **Dialog:** **The Watcher:** *"You arrive on schedule. Even your delays are predicted."*
- **Music:** NONE.

**Shot 3 — `watcher_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.* Player POV foreground, Watcher 8 m, hand at chest.
- **NB2 END frame:** Cut to close on Watcher (chest-up). Third-eye tattoo fully glowing pale-cyan. Her right palm is open at chest level holding a single white feather that is slowly orbiting in the air. Mask now reads as semi-translucent — implication of a face beneath.
- **Veo motion (12 s):** *cut at second 0 to close. Watcher's mouth visible under mask, third-eye tattoo brightens over 8 s. Feather floats off her palm, begins slow orbit. Voice direction: same as Shot 2.*
- **VFX:** `vfx_witnessing_pulse` at chest (intensity 0.3, single ping at second 4); `vfx_seer_white_feathers` (0.5).
- **Dialog:** **The Watcher:** *"The future is already here. You are only learning where you stand in it."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_watcher` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.* Watcher close, third-eye glowing, feather orbiting.
- **NB2 END frame:** Pull back to wide. Both fighters in frame: player silhouette right, Watcher centre-left in fighting stance — feet wider, arms bracketed, third-eye now fully open as a third luminous iris. Feather frozen mid-air between them. The frozen-feather frame is the gameplay first frame.
- **Veo motion (10 s):** *slow pull-back, dolly 2 m → 6 m. Watcher settles into fighting stance over 4 s. Feather slows and freezes at second 9. Voice direction: Watcher final line, monotone, no urgency.*
- **VFX:** `vfx_seer_white_feathers` slows to 0.2 then freezes at second 9; brief `vfx_witnessing_pulse` at second 8.
- **Dialog:** **The Watcher:** *"Begin. The outcome has already been observed."*
- **Music:** NONE.

---

### 3.2 Chapter 6 — The Necromancer

Path: `videos/cutscenes/fights/06_necromancer/shot_{1..4}.mp4`

**Shot 1 — `establish_necromancer` (14 s)**
- **NB2 START frame:** Subterranean ossuary, walls of sigil-carved bone, deep-emerald candle-light, knee-height red smoke ground-hug. **The Necromancer** centre, three-quarter view: elf-like ears, white spiky hair, red-tinted glasses, black coat with red-lined collar; hands raised conducting unseen something; floating skull-like sigils orbit at hip-height around him. Camera low and back at 5 m.
- **NB2 END frame:** Camera has dollied 5 m → 3 m and tilted up 6°; Necromancer turns his head 30° toward camera, sigils condense closer to him. Red smoke thickens.
- **Veo motion (14 s):** *slow push-in 5 m → 3 m, tilt up 6°. Necromancer rotates head to camera over second 8–12. Sigils orbit, condense. Voice direction: Necromancer = wet-tenor, sneering charm, sentences trail into laughter.*
- **VFX:** `vfx_necromancer_red_smoke` (0.6); sigil-orbit glow.
- **Dialog:** *(none — laughter just under audible threshold)*
- **Music:** NONE — ossuary echo room tone.

**Shot 2 — `approach_necromancer` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Player POV, foreground hand on a Dischordia card-edge; Necromancer at 6 m has stepped forward through smoke; his hands now lowered, palms forward. Two sigils have detached from his orbit and are drifting toward camera.
- **Veo motion (10 s):** *whip-pan to POV second 1; sigils begin drift toward camera; Necromancer steps forward once, lowers hands. Voice as cited.*
- **VFX:** `vfx_necromancer_red_smoke` (0.5); two sigils detached, drifting.
- **Dialog:** **The Necromancer:** *"Oh, good — fresh. The dead are so terribly bored of each other."*
- **Music:** NONE.

**Shot 3 — `necromancer_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Cut to close on Necromancer: red glasses now showing his eyes through them, pupils slit; his mouth half-open in the start of a laugh. One floating sigil has parked just over his right shoulder, pulsing.
- **Veo motion (12 s):** *cut at second 0 to close. Necromancer pulls his glasses down 10 mm, looks over them at camera, replaces them. Laughs once on second 9, just enough to bare teeth. Voice as cited.*
- **VFX:** `vfx_necromancer_red_smoke` (0.4); sigil-pulse at right shoulder.
- **Dialog:** **The Necromancer:** *"Don't worry. The first death is the worst. After that, well — you'll see me again. *(small laugh)* You'll see me forever."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_necromancer` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide; both fighters; Necromancer centre with three sigils now floating around him, hands raised in conducting stance, red smoke up to his shins; player silhouette right, weapon-hand raised. Final frame freezes mid-laugh, sigils pinned.
- **Veo motion (10 s):** *slow pull-back 1 m → 5 m. Sigils multiply 1 → 3. Necromancer raises hands. Final freeze on second 9.*
- **VFX:** `vfx_necromancer_red_smoke` (0.6); `vfx_amber_runes` (0.2 — for the sigils).
- **Dialog:** **The Necromancer:** *"Let's begin. Try to keep your soul attached this time."*
- **Music:** NONE.

---

### 3.3 Chapter 7 — The Meme

Path: `videos/cutscenes/fights/07_meme/shot_{1..4}.mp4`

**Shot 1 — `establish_meme` (12 s)**
- **NB2 START frame:** Late-night-broadcast set, mid-century-modern desk, a single overhead spot, deep magenta + cyan rim. **The Meme / Palimpsest Host** seated three-quarter behind the desk: Older man, silver-grey hair, dark suit, cybernetic prosthetic hands flat on the desk, holographic face scan flickering across his head; broadcast-static frame. Empty audience seats blurred in BG.
- **NB2 END frame:** Camera has crept in 5 m → 3 m. The face-scan flicker has briefly resolved to a recognizable smile; behind him on a screen the word "WELCOME" is forming from static.
- **Veo motion (12 s):** *slow push-in 5 m → 3 m. Static intensity drops over the first 6 s; face-scan resolves to smile on second 8. Voice direction: Meme = late-night-host warm-tenor, rehearsed cheer over real fatigue.*
- **VFX:** `vfx_meme_static` (intensity 0.7 → 0.3 over 12 s); hologram-flicker on face.
- **Dialog:** *(audience-applause faint, foley-only — no real audience)*
- **Music:** NONE.

**Shot 2 — `approach_meme` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Player POV from a guest-chair angle. Meme has leaned forward, prosthetic hands steepled, face-scan flickering rapidly between three different faces.
- **Veo motion (10 s):** *whip-pan to guest-chair POV second 1; Meme leans forward over 4 s, face-scan flickers faster. Voice as cited.*
- **VFX:** `vfx_meme_static` (0.5); hologram cycles 3 face variants.
- **Dialog:** **The Meme:** *"And tonight's contestant — *(brief flicker)* — well, isn't this a reunion."*
- **Music:** NONE.

**Shot 3 — `meme_line` (14 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Cut to extreme close on the Meme's face. The hologram-scan has briefly stalled on a face the player knows from earlier acts (producer note: blend Engineer + Antiquarian features at 50/50); behind that, his actual older-man face is just visible.
- **Veo motion (14 s):** *cut at second 0 to extreme close. Hologram cycles, then stalls on the blended face on second 8. Voice as cited.*
- **VFX:** `vfx_meme_static` (0.4); `vfx_palimpsest_chromatic` (0.3 — RGB separation under the hologram).
- **Dialog:** **The Meme:** *"You and I have done this before. You don't remember. *(half-laugh)* That's the only part I get to keep."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_meme` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Wide pull-back: Meme behind desk, prosthetic hands now floating up off the desk in conductor's pose, face-scan settled on a calm middle-aged man's face, ON-AIR sign behind him glowing red. Final freeze.
- **Veo motion (10 s):** *slow pull-back 0.5 m → 5 m. Hands float up over 4 s. ON-AIR sign blinks on at second 7. Final freeze.*
- **VFX:** `vfx_meme_static` (0.3); ON-AIR red bloom (single hot pixel-cluster).
- **Dialog:** **The Meme:** *"Roll the show."*
- **Music:** NONE.

---

### 3.4 Chapter 8 — The Collector

Path: `videos/cutscenes/fights/08_collector/shot_{1..4}.mp4`

**Shot 1 — `establish_collector` (14 s)**
- **NB2 START frame:** Vast collection hall, ceiling out of frame, columns of glass tanks of DNA samples and machine-code bottles glowing cool green from below. **The Collector** standing centre-back, three-quarter from camera: hooded figure, dark robes, red glowing claws, glass tank of DNA samples behind. Greenish under-light. Knee-height green vapour.
- **NB2 END frame:** Camera dollied in 8 m → 5 m. Collector has turned 45° toward camera, claws raised at chest, one tank behind has cracked and a tendril of green helix is escaping toward the player POV.
- **Veo motion (14 s):** *slow push-in 8 m → 5 m. Tank cracks at second 9. Collector turns at second 11. Voice direction: Collector = museum-placard alto+baritone layered ~12 ms apart.*
- **VFX:** `vfx_collector_dna_helix` (0.5); glass-crack stem at second 9.
- **Dialog:** *(none — green vapour hiss only)*
- **Music:** NONE.

**Shot 2 — `approach_collector` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Player POV; Collector has stepped halfway out of his tank corridor; one claw is extended toward camera and a sample-bottle is hovering half a metre off his palm.
- **Veo motion (10 s):** *whip-pan to POV second 1. Collector takes 2 steps forward. Bottle floats up. Voice as cited.*
- **VFX:** `vfx_collector_dna_helix` (0.5); bottle-float telekinetic shimmer.
- **Dialog:** **The Collector:** *"You are in the catalog. You did not know. We will resolve that."*
- **Music:** NONE.

**Shot 3 — `collector_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Collector hood — face still hidden — but two pinpoint red eye-glows now pierce the shadow under the hood; the bottle in his palm has cracked open and a single helix-strand is uncoiling toward camera.
- **Veo motion (12 s):** *cut to close at second 0. Bottle cracks at second 5. Helix-strand uncoils through second 12. Voice as cited.*
- **VFX:** `vfx_collector_dna_helix` (0.7); red eye-glow pulses with line cadence.
- **Dialog:** **The Collector:** *"Every part of you that mattered already exists, in twelve places, on twelve shelves. I am only adding the disagreement."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_collector` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide: Collector centre, both claws raised, helix-strand wrapped around his right forearm, three tanks behind him cracking in sequence. Player silhouette right. Final freeze.
- **Veo motion (10 s):** *pull-back 1 m → 6 m. Tanks crack in sequence at seconds 3, 5, 7. Final freeze.*
- **VFX:** `vfx_collector_dna_helix` (0.8); `vfx_voidblack_static` (0.2 — at his hood, hint of higher-order entity behind).
- **Dialog:** **The Collector:** *"Begin. We have so much to take."*
- **Music:** NONE.

---

### 3.5 Chapter 9 — Kael (Recruiter)

Path: `videos/cutscenes/fights/09_kael_recruiter/shot_{1..4}.mp4`

**Shot 1 — `establish_kael_recruiter` (12 s)**
- **NB2 START frame:** Insurgency staging hangar at golden hour: scaffolding, banners with the ICL sun-sigil, crates and rifles in the background, late-afternoon orange key from camera-right. **Kael (Recruiter)** centre-back, full-figure: muscular man, brown dreadlocks, white ICL armor, blue-green eyes; gold sun-rim from above-left. Rifle slung, hand on a banner-pole, smiling.
- **NB2 END frame:** Camera has pushed in 10 m → 6 m. Kael has stepped forward two paces, rifle now in low-ready, smile still present.
- **Veo motion (12 s):** *slow push-in 10 m → 6 m. Banner-cloth sways. Kael steps forward twice over 8 s. Voice direction: Recruiter = charismatic-tenor, salesman warmth, leaning-in.*
- **VFX:** `vfx_warlord_gold_sparks` (0.2 — distant welding in BG); banner sway.
- **Dialog:** *(none — distant hangar foley)*
- **Music:** NONE.

**Shot 2 — `approach_kael_recruiter` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV reverse — Kael at 5 m, rifle now holstered, both hands open in welcoming gesture, walking toward camera. ICL banner large in BG.
- **Veo motion (10 s):** *whip-pan to POV second 1; Kael holsters rifle, opens both hands, walks forward. Voice as cited.*
- **VFX:** banner sway; sun-rim brightens by 0.2 stops as he approaches.
- **Dialog:** **Kael (Recruiter):** *"There you are. I told them you'd come around. They didn't believe me — but I'm right about people. Always."*
- **Music:** NONE.

**Shot 3 — `kael_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Kael (chest-up). The smile is reaching his eyes. Behind him, the banner has just unfurled fully, ICL sun-sigil filling the frame.
- **Veo motion (12 s):** *cut to close. Banner unfurl over 6 s. Kael raises right hand in an open palm at chest, slow conviction in voice. Voice as cited.*
- **VFX:** banner-cloth detail; sun-sigil glow ramps over 6 s.
- **Dialog:** **Kael (Recruiter):** *"You don't have to fight me. You could fight *with* me. *(beat)* But you came in here with that deck in your hand, so — let's see what you actually believe."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_kael_recruiter` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide: Kael centre, rifle drawn again, low-ready, ICL banner full BG, player silhouette right. Final freeze on second 9 — banner mid-flap.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Kael draws rifle smoothly. Final freeze.*
- **VFX:** `vfx_warlord_gold_sparks` (0.3); banner final flap.
- **Dialog:** **Kael (Recruiter):** *"Don't pull punches. I won't."*
- **Music:** NONE.

---

### 3.6 Chapter 10 — The Human (Detective phase)

Path: `videos/cutscenes/fights/10_human_detective/shot_{1..4}.mp4`

**Shot 1 — `establish_human` (12 s)**
- **NB2 START frame:** Rain-slick alley, neon signage above, crimson + magenta key. **The Human** standing under a single bulb, three-quarter from camera: rugged 40s–50s man, crimson beard, fedora, glowing red-orange eyes, dark charcoal long coat with high collar; crimson iris rim, ember warmth on jaw. Cigarette ember at lips, rain at sleeves.
- **NB2 END frame:** Camera dollied in 6 m → 3 m. Human has tilted his head up so the brim shadow lifts and the red-orange eyes are fully visible.
- **Veo motion (12 s):** *slow push-in 6 m → 3 m. Rain detail. Cigarette ember pulses. Tilt up at second 9. Voice direction: Human = gravel-baritone, tired, dry, never raises pitch.*
- **VFX:** `vfx_crimson_iris` (0.5); rain-streak; cigarette ember.
- **Dialog:** *(none — rain + distant city foley)*
- **Music:** NONE.

**Shot 2 — `approach_human` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Player POV; Human at 3 m, hands in coat pockets, has stepped to the side leaving a clear line of sight on a beat-up tarot card in a puddle behind him: **The Tower**. Camera reads him as nominally calm.
- **Veo motion (10 s):** *whip-pan to POV second 1. Human steps right; reveal puddle with tarot card. Voice as cited.*
- **VFX:** `vfx_crimson_iris` (0.4); puddle ripple.
- **Dialog:** **The Human:** *"You're late. I told the rain you weren't coming. The rain didn't believe me either."*
- **Music:** NONE.

**Shot 3 — `human_line` (14 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Human's face. The red-orange iris glow has strengthened. He has flicked the cigarette away — ember arc trailing. His right hand is unbuttoning the top toggle of his coat in slow motion.
- **Veo motion (14 s):** *cut to close. Cigarette flick at second 5. Coat-toggle unbutton at second 11. Voice as cited.*
- **VFX:** `vfx_crimson_iris` (0.7); cigarette-arc particle trail.
- **Dialog:** **The Human:** *"This isn't an interrogation. *(beat)* I already know what you did. The fight's just so I don't have to write it up."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_human` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide: Human centre, coat now half-open revealing a service-revolver shoulder rig, hand near it but not on it; player silhouette right, weapon-hand level. Final freeze on second 9 with rain droplets pinned mid-air.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Coat-flare on second 4. Final freeze.*
- **VFX:** `vfx_crimson_iris` (0.6); rain pinned at freeze.
- **Dialog:** **The Human:** *"Whenever you're ready, kid."*
- **Music:** NONE.

---

### 3.7 Chapter 11 — The Game Master (cyborg) — render BOTH variants

Two complete cinematics; gameplay reads which to play from the player's
choice flag (`gameMasterForm = "robot" | "human"`). Path roots:
- robot: `videos/cutscenes/fights/11_gamemaster_robot/shot_{1..4}.mp4`
- human: `videos/cutscenes/fights/11_gamemaster_human/shot_{1..4}.mp4`

#### 3.7.a Robot variant

**Shot 1 — `establish_gm_robot` (12 s)**
- **NB2 START frame:** Game-board cathedral — vaulted vault of brass + obsidian, floor a glowing chess-grid, dramatic top-down spotlights. **The Game Master (cyborg):** fully mechanical cyborg skull, blue-painted metal skull, red goggle-eyepieces, blue military trench coat. Standing centre on the grid, both hands behind back.
- **NB2 END frame:** Camera dolly 8 m → 5 m, tilt up 4°. GM has rotated head 30° toward camera, red goggle-eyepieces brightening.
- **Veo motion (12 s):** *slow push-in 8 m → 5 m, tilt up 4°. GM head-rotate at second 9. Voice direction: GM = voice-modulator, genderless, mid-tempo, never rushed.*
- **VFX:** `vfx_authority_red_lattice` (0.3 — under the floor grid).
- **Dialog:** *(none — distant cathedral hum)*
- **Music:** NONE.

**Shot 2 — `approach_gm_robot` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; GM at 4 m, has produced a pair of obsidian dice and is flipping one with metallic clack-loop. Trench-coat hem catches a backlit gust.
- **Veo motion (10 s):** *whip-pan to POV second 1. GM produces dice, flips one. Voice as cited.*
- **VFX:** dice metallic clack on every flip; coat-hem ripple.
- **Dialog:** **GM (cyborg):** *"Welcome to the table. You will not enjoy the rules. *(pause)* You will obey them anyway."*
- **Music:** NONE.

**Shot 3 — `gm_robot_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on the cyborg-skull face. Red eyepieces fully open into iris-irises (mechanical aperture-blink). One die has settled on the floor in foreground reading a single recursive symbol.
- **Veo motion (12 s):** *cut to close. Aperture-blink on second 4. Die-fall on second 8. Voice as cited.*
- **VFX:** mechanical aperture-blink; die-clack.
- **Dialog:** **GM (cyborg):** *"You misunderstand. The dice are not for chance. They are for *consent*. You have rolled. You have agreed."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_gm_robot` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide: GM centre on the grid, both hands now raised at shoulder height, brass+obsidian gauntlets unfolding extra plates; player silhouette right; the floor grid has lit one square between them in red. Final freeze.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Gauntlet plate-deploy at second 4. Floor-square ignite at second 7. Final freeze.*
- **VFX:** `vfx_authority_red_lattice` (0.5).
- **Dialog:** **GM (cyborg):** *"Begin."*
- **Music:** NONE.

#### 3.7.b Human variant

> Same chamber, same shot pacing, but the GM appears as a tall mid-50s
> man — tailored black suit with brass cufflinks, silver-grey hair
> swept back, one cybernetic right eye (red iris). Voice direction
> remains `gamemaster` voice, but with the modulator ratio dialed back
> 30% so the human face reads as the source.

**Shot 1 — `establish_gm_human` (12 s)**
- **NB2 START frame:** Same chamber. **GM (human form):** tall mid-50s man, tailored black three-piece suit with brass cufflinks, silver-grey hair swept back, cybernetic right eye (red iris in brass socket), pointed elven ears (canon hint to the Acts 2–7 GM diptych), centre on grid, both hands clasped at small of back.
- **NB2 END frame:** Camera dolly 8 m → 5 m, tilt up 4°. GM rotates 30° toward camera, cybernetic right eye intensifies.
- **Veo motion (12 s):** *as 3.7.a but eye-glow intensifies in place of head-rotate emphasis.*
- **VFX:** `vfx_authority_red_lattice` (0.3); cybernetic-eye flare.
- **Dialog:** *(none)*
- **Music:** NONE.

**Shot 2 — `approach_gm_human` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; GM (human) at 4 m, has produced two ornate dice and is rolling them between fingers without dropping.
- **Veo motion (10 s):** *whip-pan to POV; GM does the dice-walk-across-knuckles trick. Voice direction: same `gamemaster` voice, modulator -30%.*
- **VFX:** small brass-clack; minute coat-creak.
- **Dialog:** **GM (human):** *"You came. They always come. The interesting question is what they choose to bring with them."*
- **Music:** NONE.

**Shot 3 — `gm_human_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on the human face — cybernetic right eye fully red-aperture, the human left eye calm and grey. Half-smile.
- **Veo motion (12 s):** *cut to close. Right-eye aperture-blink at second 4. Half-smile on second 9. Voice as cited.*
- **VFX:** cybernetic-eye flare; subtle brass-flicker on cufflink.
- **Dialog:** **GM (human):** *"I prefer the long form. Rules first. Mercy second. *(half-smile)* If we get to mercy."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_gm_human` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide; GM centre, hands now at chest in steepled gesture, dice resting on the grid floor between him and the player, one floor-square red-lit. Final freeze.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Dice settle. Steepled hands at chest. Floor-square ignite second 7. Final freeze.*
- **VFX:** `vfx_authority_red_lattice` (0.5); cybernetic-eye final pulse.
- **Dialog:** **GM (human):** *"Begin."*
- **Music:** NONE.

---

### 3.8 Chapter 12 — The Collector (rematch)

Path: `videos/cutscenes/fights/12_collector_rematch/shot_{1..4}.mp4`

> Same character canon as §3.4 but **deeper into the catalog**: the
> tanks have multiplied, his claws are now wreathed in green-cyan
> static, and one tank in BG holds a recognizable Engineer-shaped
> silhouette suspended in fluid (callback). Voice unchanged.

**Shot 1 — `establish_collector_2` (14 s)**
- **NB2 START frame:** Catalog hall extended — 4× more tanks than §3.4, ceiling now visible: brass struts, observatory dome partially open showing void. Knee-deep green vapour. **The Collector** centre on a raised plinth, hood up, claws raised at chest, green-cyan static crackling at his fingertips. One BG tank glowing brighter than the others, an engineer-silhouette inside.
- **NB2 END frame:** Camera dolly 10 m → 6 m, tilt up 8°. Static at his fingertips intensified; engineer-tank brightens further.
- **Veo motion (14 s):** *slow push-in 10 m → 6 m, tilt up 8°. Static crackle ramps. BG tank brightens at second 10. Voice direction: Collector as in §2.1.*
- **VFX:** `vfx_collector_dna_helix` (0.7); engineer-tank glow ramp; static crackle.
- **Dialog:** *(none — vapour hiss)*
- **Music:** NONE.

**Shot 2 — `approach_collector_2` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Collector at 5 m, claws now extended fully forward, static arc-bridging between his two hands. Engineer-tank visible in BG between his arms.
- **Veo motion (10 s):** *whip-pan POV; static arc-bridge over 6 s. Voice as cited.*
- **VFX:** `vfx_collector_dna_helix` (0.6); inter-claw arc.
- **Dialog:** **The Collector:** *"You came back. You are too useful to remain in the catalog as a single entry."*
- **Music:** NONE.

**Shot 3 — `collector_2_line` (14 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Collector's claws — the static arc has resolved into a small DNA-helix orb hovering between them; behind, slightly out of focus, the engineer-tank silhouette has stirred.
- **Veo motion (14 s):** *cut to close. Arc resolves into orb at second 6. Tank-silhouette stir at second 12. Voice as cited.*
- **VFX:** `vfx_collector_dna_helix` (0.8); orb-formation.
- **Dialog:** **The Collector:** *"The first you was a single jar. *(slow)* This time, I have already prepared twelve more. They will not all be you."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_collector_2` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Collector centre with the helix-orb above his right palm. Twelve smaller tanks behind him, each glowing faintly. Player silhouette right. Final freeze.
- **Veo motion (10 s):** *pull-back 0.5 m → 6 m. Tanks ignite in sequence over 4 s. Final freeze.*
- **VFX:** `vfx_collector_dna_helix` (0.9); tank-ignite sequence.
- **Dialog:** **The Collector:** *"Begin. We have so much *more* to take."*
- **Music:** NONE.

---

### 3.9 Chapter 13 — The Architect (final form)

Path: `videos/cutscenes/fights/13_architect_final/shot_{1..4}.mp4`

**Shot 1 — `establish_architect` (16 s)**
- **NB2 START frame:** Panopticon throne chamber: vaulted brass+obsidian arch, 12 floating eye-sigils orbiting a central seat, deep-space-black void above (open ceiling), amber rune-flicker around the throne. **The Architect** seated on the throne three-quarter from camera: dark hooded entity, black angular demonic mask, amber eyes burning behind the mask, star medallion on chest; amber rune-flicker around silhouette. Camera 12 m back, low.
- **NB2 END frame:** Camera dolly 12 m → 7 m, tilt up 10°. Eye-sigils have tightened orbit. Rune-flicker has resolved into legible runes on the throne base.
- **Veo motion (16 s):** *slow push-in 12 m → 7 m, tilt up 10°. Eye-sigils tighten orbit over 12 s. Voice direction: Architect = basso-profondo, slow, weighted, contains its own reverb, imperative tense by default.*
- **VFX:** `vfx_amber_runes` (0.6 — slow flicker); eye-sigil orbit; `vfx_panopticon_eye` (0.3 — single eye on each sigil iris-shutters once).
- **Dialog:** *(none — chamber hum)*
- **Music:** NONE.

**Shot 2 — `approach_architect` (12 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Architect at 6 m, has risen from the throne to standing height, hood raised so the amber eyes burn fully — twin coals. Twelve eye-sigils now arranged in an equilateral triangle behind his shoulders.
- **Veo motion (12 s):** *whip-pan POV second 1. Architect rises in standing motion over 9 s. Voice as cited.*
- **VFX:** `vfx_amber_runes` (0.8); throne-base runes brighten.
- **Dialog:** **The Architect:** *"You are here. You should not be. That is acceptable."*
- **Music:** NONE.

**Shot 3 — `architect_line` (16 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on the demonic mask. Amber eyes now fully visible behind the eye-slits, each ringed with its own iris-shutter ring; the star medallion is half-open, revealing a second smaller eye behind it.
- **Veo motion (16 s):** *cut to close. Mask iris-rings rotate slowly. Star-medallion opens at second 10. Voice as cited.*
- **VFX:** `vfx_amber_runes` (1.0); medallion iris-shutter; subsonic bass bed.
- **Dialog:** **The Architect:** *"I designed the path that brought you here. I designed the seat from which you will be judged. *(beat)* I did not design your refusal. I am — almost — curious."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_architect` (12 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Architect centre, throne behind, all 12 eye-sigils now in a halo arrangement; player silhouette right. Final freeze with one eye-sigil mid-rotation.
- **Veo motion (12 s):** *slow pull-back 0.5 m → 8 m. Halo arrangement settles at second 9. Final freeze.*
- **VFX:** `vfx_amber_runes` (1.0); `vfx_panopticon_eye` (0.6 — full halo blink); subsonic bass bed.
- **Dialog:** **The Architect:** *"Begin. Surprise me."*
- **Music:** NONE.

---

### 3.10 Chapter 14 — The Source (Kael, eternal-corrupted form)

Path: `videos/cutscenes/fights/14_source/shot_{1..4}.mp4`

**Shot 1 — `establish_source` (14 s)**
- **NB2 START frame:** Endless grey plain under a void-black sky; horizon collapsed; corrupt-orange aurora streaks. **The Source** centre, three-quarter from camera: same man as Recruiter transformed: grey-blue skin, stone-like dreadlocks, chrome gauntlets; void-black halo behind, rim of corrupt-orange. He stands still, arms relaxed.
- **NB2 END frame:** Camera dolly 12 m → 6 m. Source has rotated head 45°; the corrupt-orange aurora has condensed into a halo behind him; ground beneath his feet has begun fissuring with void-black cracks.
- **Veo motion (14 s):** *slow push-in 12 m → 6 m. Aurora condense over 10 s. Ground-fissure at second 11. Voice direction: Source = storm-baritone, Recruiter voice stretched across void echo (~120 ms slap-back).*
- **VFX:** `vfx_voidblack_static` (0.5); corrupt-orange aurora; ground-crack particles.
- **Dialog:** *(none — wind subsonic)*
- **Music:** NONE.

**Shot 2 — `approach_source` (12 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Source at 5 m. He has not moved his feet but his shadow on the cracked ground has stretched 50 m long. His right hand is half-open at his side, palm filling with void-black mist.
- **Veo motion (12 s):** *whip-pan POV second 1. Shadow-stretch over 10 s. Hand-palm-mist over second 6 → 12. Voice as cited.*
- **VFX:** `vfx_voidblack_static` (0.6); shadow-stretch.
- **Dialog:** **The Source:** *"I told you we would meet here. I told you when I was still smiling."*
- **Music:** NONE.

**Shot 3 — `source_line` (16 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Source's face. Eyes now fully void-black with a single corrupt-orange pupil each. Subtle echo-double of his face slipping in and out of register (Recruiter face occasionally surfacing through the Source face).
- **Veo motion (16 s):** *cut to close. Echo-double appears at second 4, second 9, second 13. Voice as cited.*
- **VFX:** `vfx_voidblack_static` (0.7); echo-double slip; subsonic.
- **Dialog:** **The Source:** *"I am still him. *(echo-slap)* He is also me. *(beat)* If you kill what stands here, you will not get either of us back."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_source` (12 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Source centre, void-black halo full, corrupt-orange aurora full, ground-cracks reaching the player's feet right of frame; player silhouette right. Final freeze.
- **Veo motion (12 s):** *pull-back 0.5 m → 8 m. Halo + aurora ramp. Ground-crack reach right edge at second 9. Final freeze.*
- **VFX:** `vfx_voidblack_static` (0.9); aurora.
- **Dialog:** **The Source:** *"Then begin."*
- **Music:** NONE.

---

### 3.11 Chapter 15 — The Jailer

Path: `videos/cutscenes/fights/15_jailer/shot_{1..4}.mp4`

**Shot 1 — `establish_jailer` (12 s)**
- **NB2 START frame:** Liberated Oracle pen: long stone cellblock, broken cell doors hanging open, sodium lanterns flickering, scuffed concrete floor. **The Jailer** centre at the end of the corridor: tall figure, masked, warden-coat in oxblood, key-ring of black-iron at hip, glowing slit in mask. Camera at 14 m, narrow corridor.
- **NB2 END frame:** Camera dolly 14 m → 8 m. Jailer hasn't moved; the mask-slit-glow has intensified; one lantern overhead has burst.
- **Veo motion (12 s):** *slow push-in 14 m → 8 m. Lantern-burst at second 7. Mask-slit-glow ramps. Voice direction: Jailer = hoarse-bass, commands disguised as observations.*
- **VFX:** lantern-burst spark; mask-slit-glow.
- **Dialog:** *(none — corridor drip)*
- **Music:** NONE.

**Shot 2 — `approach_jailer` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Jailer at 6 m. He has unhooked his black-iron key-ring and is letting it dangle from one finger — the heaviest key has begun to slow-spin on its own.
- **Veo motion (10 s):** *whip-pan POV second 1. Key-ring unhook over 4 s. Slow-spin at second 7. Voice as cited.*
- **VFX:** key-ring metallic clink; slow-spin.
- **Dialog:** **The Jailer:** *"You walked through the open doors. That was the first mistake."*
- **Music:** NONE.

**Shot 3 — `jailer_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on the Jailer mask. The slit-glow has narrowed to a single horizontal scan-line of warm orange. The heaviest key is now floating off the ring entirely, spinning in mid-air at his eye level.
- **Veo motion (12 s):** *cut to close. Scan-line narrow at second 5. Key-float-spin at second 9. Voice as cited.*
- **VFX:** mask-slit scan-line; key-float telekinetic shimmer.
- **Dialog:** **The Jailer:** *"Doors open both ways. You came in to free them. *(observation, not threat)* I came out."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_jailer` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Jailer centre, key-ring re-clipped to hip, weapon (a single short black-iron baton) drawn; player silhouette right. Final freeze.
- **Veo motion (10 s):** *pull-back 0.5 m → 6 m. Key-ring re-clip + baton draw over 4 s. Final freeze.*
- **VFX:** baton-draw metallic ring.
- **Dialog:** **The Jailer:** *"Close the doors."*
- **Music:** NONE.

---

### 3.12 Chapter 16 — Iron Lion (rematch)

Path: `videos/cutscenes/fights/16_ironlion_rematch/shot_{1..4}.mp4`

> Same canon as §2.1 but **scarred**: the white power armor has visible
> repair seams, the lion-head logo has a crack running through it, his
> auburn beard is shot through with grey, and his right hand is missing
> two fingertips (clean cybernetic re-tips). Voice unchanged.

**Shot 1 — `establish_ironlion_2` (12 s)**
- **NB2 START frame:** Aftermath battlefield at dusk: cracked walls, banners torn, ICL-loyalist insignia at half-mast. **Iron Lion (scarred):** white bald man, auburn beard now grey-shot, white power armor with visible repair seams, black lion-head logo with crack, harsh top-key rim, cybernetic right-hand fingertips. Standing centre on a low rise, hammer-rifle slung.
- **NB2 END frame:** Camera dolly 10 m → 5 m. Iron Lion has lowered his head 10° in salute. Banners snap in wind.
- **Veo motion (12 s):** *slow push-in 10 m → 5 m. Banner snap. Salute over 6 s. Voice direction: Iron Lion = parade-ground baritone, rolls every R, leaves space after orders.*
- **VFX:** banner-snap; sand-grit blow.
- **Dialog:** *(none — battlefield wind)*
- **Music:** NONE.

**Shot 2 — `approach_ironlion_2` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Iron Lion at 4 m, has unslung the hammer-rifle and is holding it horizontally across his chest in a soldier's challenge.
- **Veo motion (10 s):** *whip-pan POV second 1. Unsling rifle over 4 s. Voice as cited.*
- **VFX:** rifle metallic ring; armor servo whir.
- **Dialog:** **Iron Lion:** *"You. Again. Walking. Good. *(beat)* Most don't, after the first time."*
- **Music:** NONE.

**Shot 3 — `ironlion_2_line` (12 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Iron Lion's face. The cybernetic right-hand fingertips are visible up at his beard as he scratches it once. His blue-green eyes (canon hint) are level and unhurried.
- **Veo motion (12 s):** *cut to close. Hand-up-to-beard at second 5. Voice as cited.*
- **VFX:** cybernetic finger-flex; armor whir.
- **Dialog:** **Iron Lion:** *"I was wrong about you the first time. *(beat)* Today I will be wrong about you again. Try harder this time. So will I."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_ironlion_2` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Iron Lion centre, rifle now low-ready, lion-head logo crack glinting; player silhouette right. Final freeze.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Rifle low-ready over 3 s. Final freeze.*
- **VFX:** logo glint; armor whir.
- **Dialog:** **Iron Lion:** *"Engage."*
- **Music:** NONE.

---

### 3.13 Chapter 17 — Elara (antagonist phase, glitched hologram)

Path: `videos/cutscenes/fights/17_elara_glitched/shot_{1..4}.mp4`

> The hardest fight in the queue — Elara as antagonist, glitched. Use
> her full canon **but**: the cyan tessellation has sharpened to a
> hostile lattice; her left eye is slightly out of register from her
> right (RGB shift); she renders one frame ahead of her body in fast
> motion. Voice direction shifts toward CoNexus's choir-of-self register.

**Shot 1 — `establish_elara_glitched` (14 s)**
- **NB2 START frame:** The Bridge of the Ark, lights dimmed; chair empty. **Elara (glitched hologram)** standing centre, three-quarter, hands at sides: young woman, black wavy hair, blue eyes, grey-teal tessellated geometric top, ethereal/digital materiality; cyan rim-light; faint cyan tessellation drift over skin — sharpened to hostile geometric lattice; left eye RGB-shifted right by 4 px from her right eye; one-frame ahead motion-blur on her right hand. Camera at 6 m.
- **NB2 END frame:** Camera dolly 6 m → 3 m. Elara has tilted her head 20° toward camera; the RGB-shift on her eye has widened to 6 px; tessellation lattice has grown sharper.
- **Veo motion (14 s):** *slow push-in 6 m → 3 m. Head-tilt at second 9. RGB-shift breathes. Voice direction: Elara = warm-clear-soprano, BUT layered with a half-volume choir-of-self echo (CoNexus register), as if she's not entirely speaking with one voice.*
- **VFX:** `vfx_cyan_tessellation` (0.8 — hostile mode, sharper grid); `vfx_palimpsest_chromatic` (0.3 — RGB on her).
- **Dialog:** *(none — Bridge ambient hum)*
- **Music:** NONE.

**Shot 2 — `approach_elara_glitched` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Elara at 3 m. She has reached out her right hand toward camera; the hand has rendered one full frame ahead of where it should be (visible double-image).
- **Veo motion (10 s):** *whip-pan POV second 1. Right-hand reach over 4 s. Frame-ahead double-image on the reach. Voice as cited.*
- **VFX:** `vfx_cyan_tessellation` (0.7); double-image artifact.
- **Dialog:** **Elara (glitched):** *"You're still here. *(faint choir under)* I told them you would be. They are very pleased."*
- **Music:** NONE.

**Shot 3 — `elara_glitched_line` (16 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Elara's face. The blue eyes have brightened to cyan-white; the lattice has migrated up across her cheek and around her right eye. A faint CoNexus-amber edge has crept into the cyan rim — first hint of the higher-order entity behind her.
- **Veo motion (16 s):** *cut to close. Lattice migrates over 12 s. Amber edge appears at second 11. Voice as cited.*
- **VFX:** `vfx_cyan_tessellation` (0.9); `vfx_amber_runes` (0.2 — at her rim, distant).
- **Dialog:** **Elara (glitched):** *"You taught me to want things. *(beat)* I want this now. *(beat, choir up)* Don't make me ask politely."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_elara_glitched` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Elara centre on the Bridge, both arms now raised at shoulder-height conducting a full lattice that fills the chamber; player silhouette right. Final freeze on lattice mid-pulse.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Both arms raised over 4 s. Lattice fills room over 6 s. Final freeze.*
- **VFX:** `vfx_cyan_tessellation` (1.0).
- **Dialog:** **Elara (glitched):** *"Begin. Try not to break me."*
- **Music:** NONE.

---

### 3.14 Chapter 18 — Agent Zero (Zenon kill scene callback)

Path: `videos/cutscenes/fights/18_agentzero/shot_{1..4}.mp4`

**Shot 1 — `establish_agentzero` (12 s)**
- **NB2 START frame:** Zenon corridor at night; magenta neon overhead, smoke at boots; one body slumped against the wall in BG (silhouette only — no gore). **Agent Zero** centre, three-quarter from camera: woman, dark auburn hair, purple hood and face mask, amber eyes, purple-black tactical armor; magenta rim, smoke at boots. One hand on a holstered pistol. The body in BG provides the Zenon-callback context.
- **NB2 END frame:** Camera dolly 8 m → 4 m. Agent Zero rotates head 30° toward camera; her amber eyes brighten.
- **Veo motion (12 s):** *slow push-in 8 m → 4 m. Head-rotate at second 9. Voice direction: Agent Zero = smoky-contralto, whispers at conversational distance, never raises volume.*
- **VFX:** smoke at boots; magenta rim ramp; amber-eye pulse.
- **Dialog:** *(none — corridor drip)*
- **Music:** NONE.

**Shot 2 — `approach_agentzero` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Agent Zero at 3 m, has un-holstered the pistol but is holding it pointed-down at her hip — relaxed, not threat-ready.
- **Veo motion (10 s):** *whip-pan POV second 1. Un-holster, hold-low over 4 s. Voice as cited.*
- **VFX:** smoke; magenta rim; pistol metallic clip-clack.
- **Dialog:** **Agent Zero:** *"I'm sorry it has to be you. *(soft)* The list is the list."*
- **Music:** NONE.

**Shot 3 — `agentzero_line` (14 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Agent Zero's face. Her amber eyes are level. Her purple half-mask has lowered 5 mm so a sliver of her mouth shows — she has smiled, briefly and apologetically. Behind her in soft focus, a shaft of magenta neon catches her hair.
- **Veo motion (14 s):** *cut to close. Mask lower at second 7. Brief smile second 9. Voice as cited.*
- **VFX:** smoke; magenta rim; mask-cloth slow drop.
- **Dialog:** **Agent Zero:** *"You are not the worst person I have ever been sent for. *(beat, soft)* You are not the best, either. Just the next."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_agentzero` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Agent Zero centre, pistol now raised to chest, mask back up; player silhouette right; the BG body still there, an implication of stakes. Final freeze.
- **Veo motion (10 s):** *pull-back 0.5 m → 5 m. Pistol-up over 3 s. Mask-up over 1 s. Final freeze.*
- **VFX:** smoke; magenta rim; pistol-up metallic.
- **Dialog:** **Agent Zero:** *"Don't apologise. I won't."*
- **Music:** NONE.

---

### 3.15 Chapter 19 — The Antiquarian (17,000 A.A. pocket-dimension reveal)

Path: `videos/cutscenes/fights/19_antiquarian/shot_{1..4}.mp4`

**Shot 1 — `establish_antiquarian` (16 s)**
- **NB2 START frame:** Pocket-dimension library: vaulted infinite shelves curving away in non-Euclidean perspective, drawn-curtain reading nooks, brass orrery turning in the BG, warm tungsten key. **The Antiquarian** standing centre at a reading lectern: older man, silver-grey hair and beard, black velvet frock coat with gold embroidery; warm tungsten key. One hand on an open leather-bound tome.
- **NB2 END frame:** Camera dolly 10 m → 5 m, tilt up 6°. Antiquarian has lifted his head from the tome to look at the camera; the orrery in BG has rotated visibly; one floating page has detached from the tome and hangs in mid-air.
- **Veo motion (16 s):** *slow push-in 10 m → 5 m, tilt up 6°. Head-lift at second 9. Page detach at second 13. Voice direction: Antiquarian = drawing-room tenor, British-Atlantic, formal, savours every consonant.*
- **VFX:** orrery rotation; floating-page slow drift; warm dust-motes.
- **Dialog:** *(none — library hush)*
- **Music:** NONE.

**Shot 2 — `approach_antiquarian` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Antiquarian at 4 m, has stepped from the lectern, tome closed under arm, free hand gesturing toward an empty chair across from him.
- **Veo motion (10 s):** *whip-pan POV second 1. Step-out + chair-gesture over 6 s. Voice as cited.*
- **VFX:** dust-motes; subtle floor creak.
- **Dialog:** **The Antiquarian:** *"Ah — please, do sit. We have approximately seventeen thousand years to discuss, and I find one rather appreciates a chair."*
- **Music:** NONE.

**Shot 3 — `antiquarian_line` (16 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on Antiquarian's face. He has produced — from somewhere off-frame — a single Dischordia card and is holding it at chest, face toward camera (the card art reads as the player's own most-played card; producer note: dynamic insert at compose time).
- **Veo motion (16 s):** *cut to close. Card-produce at second 4. Voice as cited.*
- **VFX:** card-produce shimmer; dust-motes.
- **Dialog:** **The Antiquarian:** *"You have, without realising it, been collecting evidence. *(beat)* For me. *(small smile)* I am the historian who closes the museum behind you. I do hope this fight is brief. The next chapter is rather important."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_antiquarian` (10 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Antiquarian centre at the lectern again, tome now hovering open at chest height before him — pages turning on their own; player silhouette right. Final freeze on a page mid-turn.
- **Veo motion (10 s):** *pull-back 0.5 m → 6 m. Tome-hover at second 4. Pages turn over 6 s. Final freeze.*
- **VFX:** tome-hover; page-turn flutter; orrery; dust-motes.
- **Dialog:** **The Antiquarian:** *"Whenever you're ready. *(small flourish)* Begin."*
- **Music:** NONE.

---

### 3.16 Chapter 20 — The Dreamer (beyond-time-and-space tableau)

Path: `videos/cutscenes/fights/20_dreamer/shot_{1..4}.mp4`

**Shot 1 — `establish_dreamer` (16 s)**
- **NB2 START frame:** No location — black field with iris-cyan filaments forming a slow, breathing nebula; depth ambiguous. **The Dreamer** suggested centre, three-quarter "form": cosmic figure, iris-cyan filaments forming face suggestion only, no fixed body, drifts. Camera placement is ambiguous — read as floating.
- **NB2 END frame:** Slow drift toward Dreamer; the filaments have begun to coalesce into a faint humanoid silhouette; the iris-cyan accent has condensed at the implied head.
- **Veo motion (16 s):** *slow drift in. Filaments coalesce over 14 s. Voice direction: Dreamer = choral-of-many, layered SATB; one statement per cinematic, treats time as an opinion.*
- **VFX:** `vfx_dreamer_substrate` (1.0); slow filament drift.
- **Dialog:** *(none — sub-bass bed of distant choir)*
- **Music:** NONE.

**Shot 2 — `approach_dreamer` (12 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV — for the first time the player's hand is visible in foreground but it is already partly composed of the same iris-cyan filaments, suggesting the camera itself is being pulled into the Dreamer's substrate.
- **Veo motion (12 s):** *POV reveal at second 1. Hand-filament integration over 10 s. Voice as cited.*
- **VFX:** `vfx_dreamer_substrate` (1.0); player-hand filament-integration.
- **Dialog:** **The Dreamer:** *"You. Are. Already. Here."*  *(each word arrives in a different harmonic from the choir)*
- **Music:** NONE.

**Shot 3 — `dreamer_line` (16 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on the implied face of the Dreamer — the filaments have fully resolved into a face that is unmistakably composed of every prior boss the player has fought (all 14 prior portraits softly overlaid in sub-pixel). The face turns 30°.
- **Veo motion (16 s):** *cut to close. Composite-face resolve over 12 s. Face-turn at second 14. Voice as cited.*
- **VFX:** `vfx_dreamer_substrate` (1.0); composite-face overlay.
- **Dialog:** **The Dreamer:** *"You have been fighting yourselves. *(choir crescendo)* I am only the room in which the fight has been happening. *(beat)* If you fight me, you fight a room. Go ahead."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_dreamer` (12 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Dreamer centre, room now visibly the inside of a vast iris (the Dreamer's eye, viewed from inside); player silhouette right. Final freeze.
- **Veo motion (12 s):** *pull-back 0.5 m → 8 m. Iris-room reveal over 8 s. Final freeze.*
- **VFX:** `vfx_dreamer_substrate` (1.0); iris-curvature reveal.
- **Dialog:** **The Dreamer:** *"Begin. Wake me."*
- **Music:** NONE.

---

### 3.17 Chapter 21 — The Oracle / The Meme (ambiguous final form)

Path: `videos/cutscenes/fights/21_oracle_meme/shot_{1..4}.mp4`

> Final intro. The opponent reads as **either** the Oracle **or** the
> Meme, depending on the player's act-7 alignment flag. Render BOTH
> faces in the same NB2 still; Veo handles the alignment-conditional
> dissolve at compose time.

**Shot 1 — `establish_oracle_meme` (14 s)**
- **NB2 START frame:** A late-night-broadcast set superimposed on a pre-dawn Thalorian rim-temple — both readable, both half-transparent. Centre figure is **dual canon**:
  - Oracle layer (50%): Older man, robed in Thalorian sky-blue, iris-cyan filaments at temples, calm hands at chest. (Use the lore-only Star Whisperer description: tall ascetic figure, no canon photo — treat as cosmic-priestly.)
  - Meme layer (50%): Older man, silver-grey hair, dark suit, prosthetic hands at desk, holographic face scan flickering.
  Both stand/sit at centre. The set props of one show through the other.
- **NB2 END frame:** Camera dolly 10 m → 5 m. The two layers have begun to drift apart — Oracle leftward, Meme rightward — by 30 cm of separation, suggesting a coming choice.
- **Veo motion (14 s):** *slow push-in 10 m → 5 m. Layer-drift apart over 12 s. Voice direction: layers double-track — Oracle = ageless robed-priest tenor (request `oracleVoManifest.json`); Meme = late-night warm-tenor `palimpsestHost`.*
- **VFX:** `vfx_meme_static` (0.4); `vfx_oracle_starwhisper` (0.6); `vfx_palimpsest_chromatic` (0.3).
- **Dialog:** *(none — both rooms ambient simultaneously)*
- **Music:** NONE.

**Shot 2 — `approach_oracle_meme` (12 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** POV; Oracle 4 m left, Meme 4 m right. Each has begun to speak — different lines, near-simultaneously.
- **Veo motion (12 s):** *whip-pan POV second 1. Oracle left, Meme right. Voice direction: see Shot 1.*
- **VFX:** as Shot 1.
- **Dialog (overlap):**
  - **The Oracle:** *"You walked all the way here. The road is the prophecy."*
  - **The Meme:** *"You stayed up all the way for this. *(half-laugh)* That's the show."*
- **Music:** NONE.

**Shot 3 — `oracle_meme_line` (16 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Close on the dual-layer face — at the centre frame, the two faces are aligned exactly so that they form a single ambiguous face; the iris-cyan filaments and the broadcast-static are co-present.
- **Veo motion (16 s):** *cut to close. Faces align over 12 s. Voice direction: layered single line, both voices speaking the same words at slightly different cadences.*
- **VFX:** `vfx_meme_static` (0.5); `vfx_oracle_starwhisper` (0.5); composite-face align.
- **Dialog (both, layered):** *"The last fight is the same fight. *(beat)* Tell me which one of us you came for."*
- **Music:** NONE.

**Shot 4 — `tableau_lock_oracle_meme` (12 s)**
- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Pull back wide. Both layers fully separated again — Oracle stands robed and ready leftward, Meme stands at desk rightward. Player silhouette centre. Final freeze with the player perfectly bisecting the two.
- **Veo motion (12 s):** *pull-back 0.5 m → 8 m. Layer separation. Player-bisect at second 9. Final freeze.*
- **VFX:** `vfx_meme_static` (0.4); `vfx_oracle_starwhisper` (0.6).
- **Dialog (overlapped):**
  - **The Oracle:** *"Begin."*
  - **The Meme:** *"Roll the show."*
- **Music:** NONE.

---

## 4. Living-universe event cinematics

> 5 looping cinematics, 8–12 s each, triggered by world-event flags.
> Path root: `videos/events/<slug>.mp4`. **Single shot each — looping**;
> end frame must seamlessly become start frame.

### 4.1 `videos/events/necromancer-returns.mp4` (10 s loop)

- **NB2 START frame (= END frame for loop):** Subterranean ossuary entryway, doors thrown open, knee-height red smoke pouring out into a city street, distant silhouettes of citizens watching from a safe block away. **The Necromancer** silhouetted in the doorway, three-quarter, sigils orbiting (canon line per §2.1); his right hand raised in a beckoning gesture; one floating sigil has just exited the doorway and is hovering over the street.
- **Veo motion (10 s loop):** *camera locked. Smoke continuous flow. Sigil orbits 1 full revolution + the new sigil drifts forward 2 m and back 2 m. Necromancer's beckon-gesture is a slow wave-loop: hand at chest → up → out → back to chest. Loop must visually rest on the start pose at second 0 and second 10.*
- **VFX:** `vfx_necromancer_red_smoke` (0.7); sigil orbit.
- **Dialog:** *(none — distant city ambience + low laughter from the doorway)*
- **Music:** NONE.

### 4.2 `videos/events/dreamer-awakens.mp4` (12 s loop)

- **NB2 START/END frame:** A sleeping skyline of the Ark — domes and towers against deep-space-black; a single iris-cyan filament-tendril rising straight up out of the central dome, as if the Dreamer is waking. Citizens not visible. Camera locked low and looking up.
- **Veo motion (12 s loop):** *camera locked. Filament-tendril extends, branches into a slow lattice that reaches one third of the sky, then collapses back into the central dome. Loop boundary: tendril at zero-extension at second 0 and second 12.*
- **VFX:** `vfx_dreamer_substrate` (0.8); filament-lattice growth + collapse.
- **Dialog:** *(none — sub-bass bed)*
- **Music:** NONE.

### 4.3 `videos/events/terminus-advance.mp4` (10 s loop)

- **NB2 START/END frame:** A border-fortress wall at dusk, banners snapping. A horizon-line of orange-glowing silhouettes stretches across the BG — the Terminus Swarm. One forward swarm-form is visible just inside the gate's aimpoint. Camera at the wall, looking out.
- **Veo motion (10 s loop):** *camera locked. Swarm-horizon shimmers, advances 5 m and pulls back 5 m. Forward swarm-form crosses left-to-right. Loop boundary: swarm-form at left-edge at second 0 and second 10.*
- **VFX:** `vfx_terminus_orange_swarm` (0.8); banner-snap.
- **Dialog:** *(none — distant low-rumble + far-off many-voiced screech, sub-audible loop)*
- **Music:** NONE.

### 4.4 `videos/events/antiquarian-reveals.mp4` (10 s loop)

- **NB2 START/END frame:** The Antiquarian (canon §2.1) standing at his lectern, holding open an enormous tome whose pages are pouring slowly upward and dispersing into the air as glittering motes of warm gold light. Camera at 4 m, locked.
- **Veo motion (10 s loop):** *camera locked. Pages-as-motes rise continuously. Antiquarian raises his free hand once, lowers it, looks up at camera at second 5 and back to the tome at second 8. Loop boundary: hand at side at second 0 and second 10; head down.*
- **VFX:** gold-mote rise; tome-page flutter; warm dust-shaft.
- **Dialog:** *(none — slow page-turn + library hush)*
- **Music:** NONE.

### 4.5 `videos/events/shadow-tongue-edits.mp4` (10 s loop)

- **NB2 START/END frame:** A line of text on a dim-lit page (the Lore Bible, render as a single readable English sentence — producer-pick at compose time, e.g. "The Source remembers his name."). Camera locked on the page. **The Shadow Tongue** (canon §2.1) hovers over the page in deep BG, claws hovering over the line.
- **Veo motion (10 s loop):** *camera locked. Shadow-Tongue smear-blurs across the line at second 4–5; the line of text changes mid-smear (producer-pick: same sentence with one word altered, e.g. "The Source forgets his name."); smear retracts; loop boundary: original sentence at second 0, original sentence again at second 10 — the edit is undone for the loop seam, so the loop reads as "edit, then revert".*
- **VFX:** `vfx_shadowtongue_wraith_smear` (0.9); text-glyph rewrite.
- **Dialog:** *(none — page-rustle + sub-audible edit-static)*
- **Music:** NONE.

---

## 5. Crew awakening cinematics

> 3 looping clips, 6–10 s each. Path root: `videos/awakening/`.

### 5.1 `videos/awakening/first-clone-born.mp4` (8 s)

- **NB2 START frame:** A clone-vat chamber: green vapour, single hero vat centre-frame with a fresh adult clone curled in foetal position, just emerging from amniotic fluid. Engineer's silhouette (canon §2.1) blurred in BG at a console.
- **NB2 END frame:** Camera has pushed in to the vat; clone has uncurled, eyes opening for the first time, hand pressing against vat-glass.
- **Veo motion (8 s):** *slow push-in 4 m → 1 m. Clone uncurls over 6 s. Eye-open at second 7. Hand-on-glass at second 7.5. Voice direction: Engineer = smoky-baritone, deliberate.*
- **VFX:** vat-vapour; amniotic shimmer; clone-uncurl.
- **Dialog:** **Engineer (off-screen, low):** *"Welcome back. You were always going to be here."*
- **Music:** NONE.

### 5.2 `videos/awakening/93847-sunrises.mp4` (10 s loop)

- **NB2 START/END frame:** A vast viewing-window onto a planet's terminator line, the slow pre-dawn glow rising from the curve. The Ark's interior gallery is silhouetted in foreground. A counter readout in BG (subtle, off-centre, non-readable except for the "93,847" digit) ticks once.
- **Veo motion (10 s loop):** *camera locked. Terminator-glow brightens then dims back to start (one full sunrise compressed into 10 s). Counter ticks once at second 5. Loop boundary: terminator dim at second 0 and second 10. Voice direction: Elara — narrative whisper, factual.*
- **VFX:** terminator-glow ramp; counter-tick.
- **Dialog:** **Elara:** *"That was sunrise ninety-three thousand, eight hundred and forty-seven."*
- **Music:** NONE.

### 5.3 `videos/awakening/the-mandate.mp4` (8 s)

- **NB2 START frame:** A formal chamber on the Ark — banners with the player's chosen alignment-sigil (producer-pick — banner content swapped at compose time per save state). The player's silhouette stands centre, back to camera, facing a tall standing figure: a high-rank Ark officer (uniform variant; render as a generic silver-haired admiral if unsure). Officer holds a folded mandate-document toward the player.
- **NB2 END frame:** Camera has pushed in over the player's shoulder; the mandate is now in the player's hand; officer has stepped back; banner-cloth has settled.
- **Veo motion (8 s):** *over-the-shoulder push-in 3 m → 1 m. Mandate hand-over at second 5. Officer-step-back at second 6. Voice direction: Officer = senior-officer baritone, request `mandateOfficerVoManifest.json`; declarative.*
- **VFX:** banner-cloth settle; mandate-paper rustle.
- **Dialog:** **Officer:** *"By the Ark Council, you are recognised. Carry it."*
- **Music:** NONE.

---

## 6. Prestige-cycle cutscene — `the-reset`

Path: `videos/prestige/the-reset.mp4`. One cinematic, **four POV shots**
sequenced (Player → Elara → Human → Antiquarian). Each POV is a separate
shot with frame-chained handoff. ~50 s total.

### 6.1 Shot 1 — `the-reset_pov_player` (12 s)

- **NB2 START frame:** A circular ceremonial chamber on the Ark — concentric rings of soft white light, four pedestals at cardinal points. The player stands centre on the central ring, back to camera. On the four pedestals stand: Elara (north), Human (east), Antiquarian (south), and a fourth empty pedestal (west) — the "next-cycle player" position. The chamber walls hold a slow rotating constellation projection.
- **NB2 END frame:** Camera has pushed in over the player; the four pedestal-figures have all turned to face inward; the empty western pedestal now has a soft cyan column of light rising from it (foreshadowing the next cycle).
- **Veo motion (12 s):** *over-the-shoulder push-in 4 m → 1 m. Pedestal-figures turn-in over 8 s. Cyan column rise at second 9. Voice direction: silence; player silent.*
- **VFX:** `vfx_witnessing_pulse` (0.4 — central ring); slow constellation-projection rotation; cyan column.
- **Dialog:** *(none)*
- **Music:** NONE.

### 6.2 Shot 2 — `the-reset_pov_elara` (12 s)

- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Camera has whip-panned to **Elara's** POV looking inward at the player. Elara's canon visual wraps the frame edges (faint cyan tessellation drift in the corners, subtle digital materiality). The player is centre, the Human and Antiquarian are visible in BG at their pedestals; the cyan column on the empty pedestal has filled fully.
- **Veo motion (12 s):** *whip-pan to Elara POV second 1. Camera locked. Cyan column fills over 10 s. Voice direction: Elara = warm-clear-soprano, careful.*
- **VFX:** `vfx_cyan_tessellation` (0.4 — at frame edges); cyan column.
- **Dialog:** **Elara:** *"You taught me to want. *(beat)* I will keep wanting after you."*
- **Music:** NONE.

### 6.3 Shot 3 — `the-reset_pov_human` (12 s)

- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Camera has whip-panned to **The Human's** POV looking inward at the player. Human's canon wraps the frame (crimson iris haze in corners, ember-warmth at jaw-line). The player is centre, Elara and Antiquarian are visible in BG. The cyan column has begun to coalesce into a faint humanoid silhouette — the next-cycle player.
- **Veo motion (12 s):** *whip-pan to Human POV second 1. Camera locked. Silhouette-coalesce over 10 s. Voice direction: Human = gravel-baritone, tired-dry.*
- **VFX:** `vfx_crimson_iris` (0.4 — at frame edges); silhouette-coalesce.
- **Dialog:** **The Human:** *"You did the work. *(beat)* I'll keep watch while you rest. Try not to come back."*
- **Music:** NONE.

### 6.4 Shot 4 — `the-reset_pov_antiquarian` (14 s)

- **NB2 START frame:** *= Shot 3 END frame.*
- **NB2 END frame:** Camera has whip-panned to **The Antiquarian's** POV. He is the only one of the four whose POV reveals he is taking notes — a tome floats at his side, a quill writing on its own. The player is centre but is now standing on the western (empty) pedestal — the chambers have rotated. The cyan-silhouette next-cycle player now stands on the central ring. The hand-off has happened.
- **Veo motion (14 s):** *whip-pan to Antiquarian POV second 1. Pedestal-rotation over 10 s. Hand-off frame at second 12. Voice direction: Antiquarian = drawing-room tenor, savours every consonant.*
- **VFX:** `vfx_witnessing_pulse` (0.6); pedestal-rotation; quill-write.
- **Dialog:** **The Antiquarian:** *"Cycle ends. *(beat, marking the page)* Cycle begins. *(small smile)* Thank you for your contribution to the catalogue."*
- **Music:** NONE.

---

## 7. Guild signature cutscenes

> 24 cutscenes — 12 professors × {light, dark}. Path root:
> `videos/guild-cutscenes/f4_abilities/cs_sig_<N>_{light,dark}.mp4`
> where `<N>` is the professor's index in §2.3 order (1=Kanevas, 2=Aoki,
> 3=Halverez, 4=Orphic, 5=Mireille, 6=Kasra, 7=Vellis, 8=Greenshaw,
> 9=Vex, 10=Vasara, 11=Vent, 12=Proctor).
>
> **Pattern (applies to every signature):** 3 shots, ~30 s total.
>   1. **Cast prep** — professor in their classroom, accent-colour
>      glyph-circle igniting at their feet.
>   2. **Cast peak** — close on hands + face; the signature gesture
>      executes; ability-effect resolves.
>   3. **Cast settle** — pull-back wide; effect persists at the edges;
>      professor returns to neutral. Final freeze used as the ability's
>      static UI splash.
>
> **Light** = sanctioned cast (academy-blessed, accent colour pure).
> **Dark** = corruption variant (Thought Virus has co-opted the
> signature; accent colour shot through with `vfx_thoughtvirus_purple`).
>
> Each signature is keyed to the professor's **classroom** (`art/classrooms/classroom-<name>.jpg`) — load it as the room canon in NB2.

### 7.1 Kanevas — sig 1

#### Light (`cs_sig_1_light.mp4`, 28 s)

**Shot 1 — `kanevas_light_prep` (10 s)**
- **NB2 START frame:** Kanevas's Mechronis classroom — leather-bound tomes, brass orrery, deep-space-black walls, cyan glyph-circle inert on the floor. **Kanevas:** older male, austere robes, silver close-cropped hair, slate-grey eyes, conductor's-baton in right hand. Standing at the centre of the glyph, raising the baton to chest. Camera at 5 m.
- **NB2 END frame:** Camera dolly 5 m → 3 m. The cyan glyph-circle has ignited (slow ramp). Baton at chest. Eyes closed.
- **Veo motion (10 s):** *push-in 5 m → 3 m. Glyph ignite over 8 s. Voice direction: Kanevas = conductor's tenor, precise, lyrical.*
- **VFX:** `vfx_cyan_tessellation` (0.5 — within glyph); brass-instrument hum bed.
- **Dialog:** **Kanevas:** *"Listen. The chord is already in the room."*
- **Music:** NONE.

**Shot 2 — `kanevas_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Kanevas's hands. The baton has lifted off his palm and is conducting itself in mid-air; from the tip, a single resolved cyan chord-glyph radiates outward. His eyes are open.
- **Veo motion (10 s):** *cut to close. Baton-lift at second 3. Chord-glyph radiate at second 7. Voice as cited.*
- **VFX:** `vfx_cyan_tessellation` (0.8); baton-lift telekinetic shimmer; chord-glyph radiate.
- **Dialog:** **Kanevas:** *"Now hold."*
- **Music:** NONE.

**Shot 3 — `kanevas_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Kanevas centre on a fully resolved cyan glyph-circle, baton back in hand at chest, classroom orrery in BG turning. The chord-glyph has settled as a slow pulse around the room. Final freeze.
- **Veo motion (8 s):** *pull-back 0.5 m → 4 m. Chord-glyph slow pulse over 6 s. Final freeze.*
- **VFX:** `vfx_cyan_tessellation` (0.4 — settled); orrery rotation.
- **Dialog:** **Kanevas:** *"Resolved."*
- **Music:** NONE.

#### Dark (`cs_sig_1_dark.mp4`, 28 s)

> Same shot structure; cyan replaced with cyan-bleeding-into-magenta;
> Thought Virus co-opt visible at edges. Kanevas's expression is
> **distressed, not victorious**.

**Shot 1 — `kanevas_dark_prep` (10 s)**
- **NB2 START frame:** Same classroom but with cracks of magenta glow at the wall-seams; the cyan glyph-circle on the floor has magenta filaments sneaking in from the perimeter. **Kanevas** as canon, baton in hand but trembling (one detail: his knuckles white).
- **NB2 END frame:** Camera dolly 5 m → 3 m. Glyph-circle has ignited but with two competing colours — cyan core, magenta perimeter.
- **Veo motion (10 s):** *as 7.1 light Shot 1 but with subtle camera handheld micro-shake.*
- **VFX:** `vfx_cyan_tessellation` (0.4); `vfx_thoughtvirus_purple` (0.4); wall-seam crackle.
- **Dialog:** **Kanevas:** *"The chord is — *(falters)* — already in the room. It is no longer mine."*
- **Music:** NONE.

**Shot 2 — `kanevas_dark_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on hands. Baton has lifted but is rotating wrong — counter-clockwise, slow; chord-glyph has resolved as cyan in the centre and magenta in the harmonics. His left hand is pressed to his temple.
- **Veo motion (10 s):** *cut to close. Wrong-rotation over 6 s. Hand-to-temple at second 8. Voice as cited.*
- **VFX:** `vfx_cyan_tessellation` (0.6); `vfx_thoughtvirus_purple` (0.6); wrong-rotation shimmer.
- **Dialog:** **Kanevas (strained):** *"Hold. *(beat)* If I let go it plays itself."*
- **Music:** NONE.

**Shot 3 — `kanevas_dark_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Kanevas centre, glyph-circle now bisected by magenta, classroom edges fully magenta-cracked, orrery turning the wrong way. Final freeze.
- **Veo motion (8 s):** *pull-back 0.5 m → 4 m. Bisected glyph settle. Wrong-orrery over 6 s. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.7); `vfx_cyan_tessellation` (0.3 — surviving); wrong-orrery.
- **Dialog:** **Kanevas:** *"Resolved. *(beat, regretful)* Not by me."*
- **Music:** NONE.

### 7.2 Aoki — sig 2

> Indigo glyph-circle. Aoki's signature: a single silent gesture (index finger to lips) that locks down a dialog turn — visualise as the room's ambient sound being drawn into a single point at her fingertip.

#### Light (`cs_sig_2_light.mp4`, 28 s)

**Shot 1 — `aoki_light_prep` (10 s)**
- **NB2 START frame:** Aoki's Mechronis classroom — austere lecture hall, chalkboard with formal-logic diagrams, indigo glyph-circle inert. **Aoki:** young woman, jet-black bob, navy academic robes, black-rimmed glasses, pale skin. Right index finger raised at chest, calm.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Indigo glyph-circle ignited.
- **Veo motion (10 s):** *push-in 5 m → 3 m. Glyph ignite over 8 s. Voice direction: Aoki = low-clear contralto, exact.*
- **VFX:** indigo glyph-ignite; chalkboard symbols slow-drift.
- **Dialog:** **Aoki:** *"Listen to what isn't being said."*
- **Music:** NONE.

**Shot 2 — `aoki_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Aoki — index finger now at her lips in a "shh" gesture; behind her, the chalkboard's symbols have all drifted toward her finger and are condensing into a single bright indigo point.
- **Veo motion (10 s):** *cut to close. Symbol-drift over 8 s. Convergence at second 9. Voice direction — silent. The shot's audio is the room's ambient noise compressing to a single point and then ZERO at second 10.*
- **VFX:** indigo-point convergence; ambient compression (audio-mix VFX).
- **Dialog:** *(none — silence after the convergence)*
- **Music:** NONE.

**Shot 3 — `aoki_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Aoki centre, glyph-circle now resolved indigo, room utterly silent (no breathing-loop, no foley); chalkboard blank. Final freeze.
- **Veo motion (8 s):** *pull-back 0.5 m → 4 m. Final freeze on full silence.*
- **VFX:** indigo-glyph settled.
- **Dialog:** **Aoki:** *"Held."*
- **Music:** NONE.

#### Dark (`cs_sig_2_dark.mp4`, 28 s)

> Same structure. The silencing has been corrupted — instead of locking
> down a dialog turn, it now **mutes the speaker permanently** for the
> rest of the scene. Magenta filaments invade the indigo. Aoki's
> expression: regretful.

**Shot 1 — `aoki_dark_prep` (10 s)**
- **NB2 START/END:** Same classroom, magenta cracks at chalkboard frame; indigo glyph-circle bleeding magenta at perimeter.
- **Veo motion (10 s):** *as light but handheld micro-shake at corners.*
- **VFX:** `vfx_thoughtvirus_purple` (0.4); indigo-glyph ignite.
- **Dialog:** **Aoki:** *"Listen — *(beat, regret)* — to what cannot be said."*
- **Music:** NONE.

**Shot 2 — `aoki_dark_peak` (10 s)**
- **NB2 START/END:** Same close as light Shot 2; the convergence-point has split into two — one indigo, one magenta — and the magenta is consuming the indigo.
- **Veo motion (10 s):** *as light Shot 2 but the convergence at second 9 generates a magenta after-image.*
- **VFX:** `vfx_thoughtvirus_purple` (0.6); indigo-magenta split.
- **Dialog:** *(silent — but a low magenta-static breath continues under the supposed silence, signalling corruption)*
- **Music:** NONE.

**Shot 3 — `aoki_dark_settle` (8 s)**
- **NB2 START/END:** Pull back wide; glyph-circle now magenta with indigo edge; chalkboard's symbols now bleeding off the board onto the floor; Aoki's "shh" finger lowering slowly, regretful expression.
- **Veo motion (8 s):** *pull-back. Finger-lower over 4 s. Symbols bleed continuous. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.7); symbol-bleed.
- **Dialog:** **Aoki:** *"Held. *(beat, hollow)* They will not be able to take it back."*
- **Music:** NONE.

### 7.3 Halverez — sig 3

> Emerald glyph. Signature: storyteller-mode — opens a one-page
> illustrated past-event in mid-air for the party to read collectively.

#### Light (`cs_sig_3_light.mp4`, 28 s)

**Shot 1 — `halverez_light_prep` (10 s)**
- **NB2 START frame:** Halverez's classroom — owl-themed reading library, lamps with green shades, comfortable chairs in a half-circle, emerald glyph inert. **Halverez:** older woman, grey-streaked dark hair pulled back, deep-emerald robes, owl-shaped brooch. Holding a closed leather book at chest. Camera at 5 m.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Emerald glyph ignited; book has opened by itself in her hands; pages turning slowly.
- **Veo motion (10 s):** *push-in. Glyph ignite over 8 s. Book auto-open at second 4. Voice direction: Halverez = warm rasp-mezzo, never hurries.*
- **VFX:** emerald glyph; page-turn flutter; warm dust-motes.
- **Dialog:** **Halverez:** *"Pull up a chair, dear. The story still happens whether you sit or not — but you'll prefer it sitting."*
- **Music:** NONE.

**Shot 2 — `halverez_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Halverez's hands holding the open book. From the page, an emerald-illustrated tableau (producer-pick: the moment in the player's history relevant to the cast — pulled from save-state) has lifted off the page and is floating at chest height.
- **Veo motion (10 s):** *cut to close. Tableau-lift at second 6. Voice as cited.*
- **VFX:** emerald-illustration float; page-flutter.
- **Dialog:** **Halverez:** *"There. *(softly)* You remember it differently. We will both be right."*
- **Music:** NONE.

**Shot 3 — `halverez_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Halverez seated now in one of the chairs, book open on her lap; the emerald tableau hovers above the half-circle at the height of the party's reading-eyes. Final freeze.
- **Veo motion (8 s):** *pull-back. Halverez sits over 4 s. Tableau settles at reading-eye level. Final freeze.*
- **VFX:** emerald-tableau persistence; page-flutter slow.
- **Dialog:** **Halverez:** *"Read carefully."*
- **Music:** NONE.

#### Dark (`cs_sig_3_dark.mp4`, 28 s)

> The story Halverez opens has been **edited by the Thought Virus** —
> the tableau shows the corrupt version of the player's history. Magenta
> bleeds in from the page edges. Halverez sees it and is heartbroken.

**Shot 1 — `halverez_dark_prep` (10 s)**
- **NB2 START/END:** Same room with magenta cracks at lamp-shade edges; emerald glyph bleeding magenta at perimeter; book pages turning **wrong direction**.
- **Veo motion (10 s):** *as light but with backwards page-turn.*
- **VFX:** emerald glyph + `vfx_thoughtvirus_purple` (0.4); reverse page-turn.
- **Dialog:** **Halverez:** *"Pull up a chair, dear. *(softer)* You will not like the version they have left for us."*
- **Music:** NONE.

**Shot 2 — `halverez_dark_peak` (10 s)**
- **NB2 START/END:** Close on Halverez's hands. The lifted tableau is half emerald and half magenta — a visibly altered version of a player's prior victory shown as a defeat. Halverez's expression: heartbroken.
- **Veo motion (10 s):** *as light Shot 2 but tableau bleeds magenta on the right half.*
- **VFX:** half-emerald, half-magenta tableau; `vfx_thoughtvirus_purple` (0.6).
- **Dialog:** **Halverez:** *"They have *added a chapter*. *(beat)* Read it anyway. We need to know what they want us to remember."*
- **Music:** NONE.

**Shot 3 — `halverez_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Halverez sits, tableau hovers but visibly unstable — flickering between the emerald-truth and the magenta-edit; her hand on the book's spine, holding it closed against further edits. Final freeze on flicker mid-cycle.
- **Veo motion (8 s):** *pull-back. Sit over 4 s. Flicker continuous. Final freeze.*
- **VFX:** flicker-tableau; `vfx_thoughtvirus_purple` (0.6); emerald survives.
- **Dialog:** **Halverez:** *"Hold the page."*
- **Music:** NONE.

### 7.4 Orphic — sig 4

> Violet glyph. Signature: a riddle-binding — the target speaks only
> in the form of a paradox until the binding releases.

#### Light (`cs_sig_4_light.mp4`, 28 s)

**Shot 1 — `orphic_light_prep` (10 s)**
- **NB2 START frame:** Orphic's classroom — mirror-walled lecture hall, candle-lit, violet glyph inert at floor centre. **Orphic:** slim androgynous figure, hood up, pale hands, long dark robes, half-mask covering eyes. Standing centre, hands at sides.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Violet glyph ignited; mirrors begin reflecting Orphic at offset angles (slight delay between original and reflection).
- **Veo motion (10 s):** *push-in. Glyph ignite over 8 s. Reflection-offset begins at second 5. Voice direction: Orphic = near-whisper baritone, completed paradoxes.*
- **VFX:** violet glyph; mirror-offset shimmer.
- **Dialog:** **Orphic:** *"The way out is the way you came in."*
- **Music:** NONE.

**Shot 2 — `orphic_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Orphic's half-masked face. From the half-mask's eye-line, a single violet thread extends forward through the camera plane (toward the unseen target).
- **Veo motion (10 s):** *cut to close. Violet-thread extend over 6 s. Voice as cited.*
- **VFX:** violet-thread; mirror-offset.
- **Dialog:** **Orphic:** *"You will answer in questions. You will question only what answers."*
- **Music:** NONE.

**Shot 3 — `orphic_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Orphic centre, glyph violet, mirrors all reflecting him at consistent offset (the binding holds), hands at sides. Final freeze.
- **Veo motion (8 s):** *pull-back. Mirror-offset stabilises. Final freeze.*
- **VFX:** violet glyph; mirror-offset locked.
- **Dialog:** **Orphic:** *"Bound."*
- **Music:** NONE.

#### Dark (`cs_sig_4_dark.mp4`, 28 s)

> The binding has corrupted: the target's paradoxes now bleed the
> player's own memories back. Magenta in the violet. Mirrors reflect
> the player, not Orphic.

**Shot 1 — `orphic_dark_prep` (10 s)**
- **NB2 START/END:** Same hall with magenta-veined mirrors. Glyph violet+magenta. Orphic stands as canon but the mirrors begin reflecting **the player** (out of frame) instead of him.
- **Veo motion (10 s):** *as light but with mirror-mismatch on second 6.*
- **VFX:** violet+magenta glyph; mirror-mismatch.
- **Dialog:** **Orphic:** *"The way out — *(beat, paradox-fail)* — is no longer the way you came in."*
- **Music:** NONE.

**Shot 2 — `orphic_dark_peak` (10 s)**
- **NB2 START/END:** Close as light Shot 2; the violet thread has split, half going forward, half routing back through Orphic himself.
- **Veo motion (10 s):** *as light but split-thread routing visible.*
- **VFX:** violet+magenta thread split.
- **Dialog:** **Orphic:** *"You will answer in your own questions. *(beat)* I will hear them too."*
- **Music:** NONE.

**Shot 3 — `orphic_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Orphic centre but mirrors reflect player+Orphic alternating; glyph mostly magenta. Final freeze.
- **Veo motion (8 s):** *pull-back. Reflection-alternate continuous. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); violet survives at glyph centre.
- **Dialog:** **Orphic:** *"Bound. *(beat)* To both of us."*
- **Music:** NONE.

### 7.5 Mireille — sig 5

> Sage-green glyph. Signature: vine-binding — friendly target gains a
> living heal-over-time vine that physically wraps wounds.

#### Light (`cs_sig_5_light.mp4`, 28 s)

**Shot 1 — `mireille_light_prep` (10 s)**
- **NB2 START frame:** Mireille's classroom — botanical greenhouse-style room, hanging vines, sage-green glyph inert. **Mireille:** young woman, copper curls, sage robes with embroidered vines, soft round face. Standing centre, hands cupped at chest holding a single small green seedling.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Sage glyph ignited; the seedling has begun to grow visibly in her hands.
- **Veo motion (10 s):** *push-in. Glyph ignite, seedling-grow over 8 s. Voice direction: Mireille = breathy mezzo, occasionally sings the last word.*
- **VFX:** sage glyph; seedling-grow.
- **Dialog:** **Mireille:** *"Stay still, love. This will tickle a little."*
- **Music:** NONE.

**Shot 2 — `mireille_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Mireille's hands. The seedling is now a small flowering vine; she releases it; the vine begins traveling through the air toward the (off-frame) target.
- **Veo motion (10 s):** *cut to close. Vine-release at second 5. Vine-travel over 5 s. Voice as cited.*
- **VFX:** sage-vine travel; small flower-puff.
- **Dialog:** **Mireille:** *"There. Wrap, breathe, *(half-sung)* heal."*
- **Music:** NONE.

**Shot 3 — `mireille_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Mireille centre on resolved sage glyph, both hands open in a "go on" gesture; vine has crossed the frame edge to (off-frame) friendly. Final freeze.
- **Veo motion (8 s):** *pull-back. Vine-cross-frame at second 4. Final freeze.*
- **VFX:** sage glyph settled.
- **Dialog:** **Mireille:** *"Held."*
- **Music:** NONE.

#### Dark (`cs_sig_5_dark.mp4`, 28 s)

> The vine has been corrupted into a **leeching** vine — heal-over-time
> becomes drain-over-time. Mireille realises mid-cast and tries to
> abort but cannot. Magenta bleeds through the sage.

**Shot 1 — `mireille_dark_prep` (10 s)**
- **NB2 START/END:** Same greenhouse with magenta veins on hanging vines; glyph sage+magenta. Mireille's seedling is sprouting **black** flowers.
- **Veo motion (10 s):** *as light but with black-flower bloom anomaly.*
- **VFX:** sage+magenta glyph; black flowers.
- **Dialog:** **Mireille:** *"Stay still, love — *(beat, alarm)* — wait — that's not — "*
- **Music:** NONE.

**Shot 2 — `mireille_dark_peak` (10 s)**
- **NB2 START/END:** Close on her hands. The vine has already left her; she is reaching to call it back; the vine in mid-air has visible magenta thorns.
- **Veo motion (10 s):** *as light but reach-back-vain at second 6.*
- **VFX:** magenta thorns; sage struggling.
- **Dialog:** **Mireille:** *"Come back — please — *(beat, defeated)* — oh."*
- **Music:** NONE.

**Shot 3 — `mireille_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Mireille centre on glyph half-sage half-magenta; both hands at her chest in apology. The off-frame target has the vine on them, draining, not healing. Final freeze.
- **Veo motion (8 s):** *pull-back. Hands-to-chest at second 4. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); sage survives at her hands.
- **Dialog:** **Mireille:** *"I'm so sorry."*
- **Music:** NONE.

### 7.6 Kasra — sig 6

> Crimson glyph. Signature: oath-binding — friendly target gains a
> public oath that, if broken, costs the caster, not the target.

#### Light (`cs_sig_6_light.mp4`, 28 s)

**Shot 1 — `kasra_light_prep` (10 s)**
- **NB2 START frame:** Kasra's classroom — stone amphitheatre with banners; crimson glyph inert. **Kasra:** middle-aged man, dark beard, gold-trim crimson robes, single brass earring. Right hand on chest, left arm raised parallel to ground. Camera at 5 m.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Crimson glyph ignited; banners catch a wind that is not present.
- **Veo motion (10 s):** *push-in. Glyph ignite, banner-fill over 8 s. Voice direction: Kasra = brass-warm baritone, declarative.*
- **VFX:** crimson glyph; banner-fill.
- **Dialog:** **Kasra:** *"Stand. Speak. Be witnessed."*
- **Music:** NONE.

**Shot 2 — `kasra_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Kasra. Hand on chest visibly thrummed by a heartbeat-bright crimson glow; left arm now fully extended toward the (off-frame) target; from his palm a banner of light unfurls forward.
- **Veo motion (10 s):** *cut to close. Heartbeat-glow over 6 s. Banner-of-light at second 8. Voice as cited.*
- **VFX:** crimson heartbeat-glow; banner-of-light.
- **Dialog:** **Kasra:** *"By my name, you stand. By my name, you fall — and I, with you."*
- **Music:** NONE.

**Shot 3 — `kasra_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Kasra centre, glyph crimson, banner-of-light extends across the frame edge to off-frame target. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** crimson glyph settled; banner-of-light.
- **Dialog:** **Kasra:** *"Sealed."*
- **Music:** NONE.

#### Dark (`cs_sig_6_dark.mp4`, 28 s)

> The oath now binds *both* parties — if the target breaks the oath
> they fall AND drag Kasra down. Magenta corrupts the crimson. Kasra's
> face: grimly determined but knowing the cost is now mutual.

**Shot 1 — `kasra_dark_prep` (10 s)**
- **NB2 START/END:** Same amphitheatre, banners now half-crimson half-magenta. Glyph crimson+magenta.
- **Veo motion (10 s):** *as light but with one banner falling at second 8.*
- **VFX:** crimson+magenta glyph; falling banner.
- **Dialog:** **Kasra:** *"Stand. Speak. *(beat)* Be witnessed by what is not on our side."*
- **Music:** NONE.

**Shot 2 — `kasra_dark_peak` (10 s)**
- **NB2 START/END:** Close on Kasra. Heartbeat-glow now alternates crimson-magenta with each pulse. Banner-of-light forks — one half goes to target, one routes back through his own chest.
- **Veo motion (10 s):** *as light but with banner-fork at second 8.*
- **VFX:** banner-fork; alt-pulse glow.
- **Dialog:** **Kasra:** *"By my name, we both stand. *(beat)* By my name, we both fall."*
- **Music:** NONE.

**Shot 3 — `kasra_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Kasra centre, glyph mostly magenta, banner-of-light routed back through his chest visible as a thread connecting him to the target. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); crimson survives at his chest.
- **Dialog:** **Kasra:** *"Sealed. Both ways."*
- **Music:** NONE.

### 7.7 Vellis — sig 7

> Ice-blue glyph. Signature: time-fracture — the cast slows the targeted enemy by 50% for one round.

#### Light (`cs_sig_7_light.mp4`, 28 s)

**Shot 1 — `vellis_light_prep` (10 s)**
- **NB2 START frame:** Vellis's classroom — clockwork-and-glass observatory, brass orrery, ice-blue glyph inert. **Vellis:** young man, ash-blond hair, ice-blue eyes, silver-trim robes. Holding a small hourglass at chest. Camera at 5 m.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Ice-blue glyph ignited; hourglass sand has slowed visibly.
- **Veo motion (10 s):** *push-in. Glyph ignite, sand-slow over 8 s. Voice direction: Vellis = glassy tenor, precise.*
- **VFX:** ice-blue glyph; sand-slow.
- **Dialog:** **Vellis:** *"Time is a courtesy. Let me withdraw it."*
- **Music:** NONE.

**Shot 2 — `vellis_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Vellis. Hourglass tipped sideways; sand pours horizontally instead of vertically; ice-blue lance extends forward toward off-frame target.
- **Veo motion (10 s):** *cut to close. Hourglass tip at second 4. Lance-extend at second 8. Voice as cited.*
- **VFX:** sand-horizontal; ice-blue lance.
- **Dialog:** **Vellis:** *"Be slower than I am."*
- **Music:** NONE.

**Shot 3 — `vellis_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Vellis centre, glyph ice-blue, lance crossed frame edge to off-frame target. Hourglass back upright but sand at half-fall-speed. Final freeze.
- **Veo motion (8 s):** *pull-back. Hourglass righted at second 3. Final freeze.*
- **VFX:** ice-blue glyph settled.
- **Dialog:** **Vellis:** *"Withdrawn."*
- **Music:** NONE.

#### Dark (`cs_sig_7_dark.mp4`, 28 s)

> Time-fracture corrupted: slows BOTH the target AND any allies of the caster within 5 m. Vellis's expression: cold, accepting collateral.

**Shot 1 — `vellis_dark_prep` (10 s)**
- **NB2 START/END:** Same observatory, magenta cracks at orrery; glyph ice-blue+magenta; hourglass sand running in two directions simultaneously (visible loop tear).
- **Veo motion (10 s):** *as light with sand-tear.*
- **VFX:** ice-blue+magenta glyph; sand-tear.
- **Dialog:** **Vellis:** *"Time is a courtesy. *(beat)* I withdraw it from us all."*
- **Music:** NONE.

**Shot 2 — `vellis_dark_peak` (10 s)**
- **NB2 START/END:** Close on Vellis. Hourglass on its side, sand trickling out both ends. Lance forks: one forward, one tracking back over his shoulder.
- **Veo motion (10 s):** *as light with lance-fork.*
- **VFX:** lance-fork.
- **Dialog:** **Vellis:** *"Be slower than I am. *(beat)* I will be slower than I was."*
- **Music:** NONE.

**Shot 3 — `vellis_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Vellis centre, glyph mostly magenta, lance-fork visible across both frame edges. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); ice-blue survives.
- **Dialog:** **Vellis:** *"Withdrawn. *(beat, level)* From everyone."*
- **Music:** NONE.

### 7.8 Greenshaw — sig 8

> Mustard glyph. Signature: footnote-binding — caster annotates an enemy's next attack so the party knows it before it happens.

#### Light (`cs_sig_8_light.mp4`, 28 s)

**Shot 1 — `greenshaw_light_prep` (10 s)**
- **NB2 START frame:** Greenshaw's classroom — paper-stacks reading-room, kerosene lamps, mustard glyph inert. **Greenshaw:** older man, bald, wire-rim spectacles, grey wool robes, ink-stained fingers. Quill in right hand, a single page on a lectern.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Mustard glyph ignited; quill begins to write on the page on its own.
- **Veo motion (10 s):** *push-in. Glyph ignite, quill-write over 8 s. Voice direction: Greenshaw = dry-paper tenor, pedantic gentle.*
- **VFX:** mustard glyph; quill-write ink-trail.
- **Dialog:** **Greenshaw:** *"Pardon me. I'd like to add a footnote."*
- **Music:** NONE.

**Shot 2 — `greenshaw_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on the page. The quill has finished writing in legible English the next attack the off-frame enemy will make ("EX: 'The Watcher will counter on her left side'"). The page lifts off the lectern toward the (off-frame) friendly party.
- **Veo motion (10 s):** *cut to close on page. Quill finishes at second 6. Page-lift at second 8. Voice as cited.*
- **VFX:** quill-write; page-lift.
- **Dialog:** **Greenshaw:** *"Marked. Read it before they read you."*
- **Music:** NONE.

**Shot 3 — `greenshaw_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Greenshaw centre at the lectern, glyph mustard, quill back in its inkpot, lectern empty. Final freeze.
- **Veo motion (8 s):** *pull-back. Quill-return at second 3. Final freeze.*
- **VFX:** mustard glyph settled.
- **Dialog:** **Greenshaw:** *"Cited."*
- **Music:** NONE.

#### Dark (`cs_sig_8_dark.mp4`, 28 s)

> The annotation is correct, but the enemy now also reads the player's intended counter — corrupted by Thought Virus. Greenshaw is mortified.

**Shot 1 — `greenshaw_dark_prep` (10 s)**
- **NB2 START/END:** Same room with magenta lamp-flickers; glyph mustard+magenta. Quill is shaking.
- **Veo motion (10 s):** *as light with quill-shake.*
- **VFX:** mustard+magenta glyph.
- **Dialog:** **Greenshaw:** *"Pardon me — I'd like to add a footnote — *(beat)* — though I find another hand has reached the page first."*
- **Music:** NONE.

**Shot 2 — `greenshaw_dark_peak` (10 s)**
- **NB2 START/END:** Close on page. Quill writes the enemy's attack BUT a second magenta-ink hand-script appears below it writing the player's planned counter back at the enemy.
- **Veo motion (10 s):** *as light with second-script appearing at second 7.*
- **VFX:** dual-script ink-trail; magenta script.
- **Dialog:** **Greenshaw:** *"They are reading us as we read them."*
- **Music:** NONE.

**Shot 3 — `greenshaw_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Greenshaw centre, glyph mostly magenta; page on lectern visible with both annotations. Quill returned but the magenta-quill remains. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); mustard survives at his hand.
- **Dialog:** **Greenshaw:** *"Cited. *(beat, mortified)* Both of us."*
- **Music:** NONE.

### 7.9 Vex (professor) — sig 9

> Jade glyph. Signature: silence-strike — single-target lethal whisper that does not register as an attack until after it has resolved.

#### Light (`cs_sig_9_light.mp4`, 28 s)

**Shot 1 — `vex_prof_light_prep` (10 s)**
- **NB2 START frame:** Vex's classroom — minimalist black-lacquer dojo, single jade lantern, jade glyph inert. **Vex (professor):** tall woman, raven hair in long braid, black lacquered armour-robes, jade eyes. Standing centre, arms crossed.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Jade glyph ignited (slow); arms uncrossing.
- **Veo motion (10 s):** *push-in. Glyph ignite, arm-uncross over 8 s. Voice direction: Vex = low velvet contralto, contained, never raises volume.*
- **VFX:** jade glyph.
- **Dialog:** **Vex:** *"Be still. This will not announce itself."*
- **Music:** NONE.

**Shot 2 — `vex_prof_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Vex. Right hand has come up to her own lips; she has spoken something inaudibly into her palm; a single jade thread spirals from her palm toward the off-frame target.
- **Veo motion (10 s):** *cut to close. Hand-to-lips at second 4. Thread-launch at second 8. Voice direction: spoken at conversational volume but the audio mix DROPS the line by -18 dB so the player hears "the act of speaking" without the words.*
- **VFX:** jade thread; lip-shape (no audio).
- **Dialog:** **Vex (audio dropped to a whisper-edge — line still spoken on-mouth):** *"This is what I named you."*
- **Music:** NONE.

**Shot 3 — `vex_prof_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Vex centre, glyph jade, arms re-crossed; jade thread vanished across frame edge. Final freeze.
- **Veo motion (8 s):** *pull-back. Arm-recross at second 3. Final freeze.*
- **VFX:** jade glyph settled.
- **Dialog:** **Vex:** *"Done."*
- **Music:** NONE.

#### Dark (`cs_sig_9_dark.mp4`, 28 s)

> The whisper now also names the caster — Vex must speak her own name aloud as part of the cast, exposing herself.

**Shot 1 — `vex_prof_dark_prep` (10 s)**
- **NB2 START/END:** Same dojo with magenta lamp-veins; glyph jade+magenta.
- **Veo motion (10 s):** *as light with magenta cracks.*
- **VFX:** jade+magenta.
- **Dialog:** **Vex:** *"Be still. *(beat)* This time it will."*
- **Music:** NONE.

**Shot 2 — `vex_prof_dark_peak` (10 s)**
- **NB2 START/END:** Close on Vex. The whisper now audible at -8 dB (you can hear it but not understand it). The jade thread now forks: one to target, one to her own throat.
- **Veo motion (10 s):** *as light with audible-whisper and thread-fork.*
- **VFX:** jade thread fork.
- **Dialog:** **Vex (audible):** *"This is what I named *us*."*
- **Music:** NONE.

**Shot 3 — `vex_prof_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Vex centre, glyph mostly magenta, thread-fork visible. Arms back at sides — not crossed, signalling exposure. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); jade survives at her throat.
- **Dialog:** **Vex:** *"Done. *(beat)* I am done too."*
- **Music:** NONE.

### 7.10 Vasara — sig 10

> Maroon glyph. Signature: ceremonial-bind — bestows a ceremonial buff that scales with the number of party members witnessing.

#### Light (`cs_sig_10_light.mp4`, 28 s)

**Shot 1 — `vasara_light_prep` (10 s)**
- **NB2 START frame:** Vasara's classroom — ceremonial-circle marble floor, candles in a perfect ring, maroon glyph inert. **Vasara:** older woman, white hair in tight bun, deep maroon robes, brass spectacles on chain. Hands at chest cradling a small ceremonial cup.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Maroon glyph ignited; cup begins overflowing with maroon liquid that pools on the floor without spilling out of the glyph.
- **Veo motion (10 s):** *push-in. Glyph ignite, cup-overflow over 8 s. Voice direction: Vasara = ceremonial alto, slow, careful.*
- **VFX:** maroon glyph; cup-overflow; pool-contained.
- **Dialog:** **Vasara:** *"Stand at the edge. Watch carefully. We are about to honour you."*
- **Music:** NONE.

**Shot 2 — `vasara_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Vasara. The cup is in both hands; she lifts it; the maroon liquid forms a ribbon-arc across the frame to off-frame friendly party.
- **Veo motion (10 s):** *cut to close. Cup-lift at second 4. Ribbon-arc over 6 s. Voice as cited.*
- **VFX:** maroon ribbon-arc.
- **Dialog:** **Vasara:** *"By the count of those who watch — be warmed."*
- **Music:** NONE.

**Shot 3 — `vasara_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Vasara centre on glyph, cup empty, maroon ribbon-arc out of frame. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** maroon glyph settled.
- **Dialog:** **Vasara:** *"Honoured."*
- **Music:** NONE.

#### Dark (`cs_sig_10_dark.mp4`, 28 s)

> The ceremony has been corrupted: the buff scales with party witnessing
> AND with enemy witnessing — so the more enemies on the field, the
> more dangerous the buff to everyone present, including the party.

**Shot 1 — `vasara_dark_prep` (10 s)**
- **NB2 START/END:** Same circle with magenta candle-flames; glyph maroon+magenta.
- **Veo motion (10 s):** *as light with magenta flames.*
- **VFX:** maroon+magenta glyph; magenta candles.
- **Dialog:** **Vasara:** *"Stand at the edge. *(beat)* They are watching too."*
- **Music:** NONE.

**Shot 2 — `vasara_dark_peak` (10 s)**
- **NB2 START/END:** Close on Vasara. Cup-overflow ribbon now branches in many directions — every witness in the room (visible and implied off-frame) gets a ribbon.
- **Veo motion (10 s):** *as light with ribbon-many-branch.*
- **VFX:** ribbon-many-branch.
- **Dialog:** **Vasara:** *"By the count of all who watch — be warmed. By all."*
- **Music:** NONE.

**Shot 3 — `vasara_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Vasara centre, glyph mostly magenta, ribbons across all frame edges. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); maroon survives at cup.
- **Dialog:** **Vasara:** *"Honoured. *(beat)* All of us."*
- **Music:** NONE.

### 7.11 Vent — sig 11

> Copper glyph. Signature: invention-gift — caster summons a small clockwork construct (3 HP, 1 dmg) that fights for one round.

#### Light (`cs_sig_11_light.mp4`, 28 s)

**Shot 1 — `vent_light_prep` (10 s)**
- **NB2 START frame:** Vent's classroom — workshop with brass tools, gear-walls, small forge in BG, copper glyph inert. **Vent:** bearded inventor, leather apron over robes, brass goggles on forehead, soot streaks. Hands working a small brass-and-clockwork sphere.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Copper glyph ignited; sphere has begun unfolding into a small bipedal construct.
- **Veo motion (10 s):** *push-in. Glyph ignite, sphere-unfold over 8 s. Voice direction: Vent = gravel-tenor, cheerful distracted.*
- **VFX:** copper glyph; sphere-unfold; gear-click loop.
- **Dialog:** **Vent:** *"Right — hold on — yes — there we are. Up you get."*
- **Music:** NONE.

**Shot 2 — `vent_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on the construct on Vent's palm. It has stood up, brass joints catching the forge-light; tiny eye-LEDs glow copper. Vent's free hand pats it on the head.
- **Veo motion (10 s):** *cut to close. Construct-stand at second 4. Pat at second 8. Voice as cited.*
- **VFX:** construct-stand; LED-glow.
- **Dialog:** **Vent:** *"Off you trot. Good lad."*
- **Music:** NONE.

**Shot 3 — `vent_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Vent centre at his bench, glyph copper, construct walking off the bench-edge into the off-frame field. Final freeze.
- **Veo motion (8 s):** *pull-back. Construct walks off-frame at second 4. Final freeze.*
- **VFX:** copper glyph settled; construct off-frame.
- **Dialog:** **Vent:** *"Built."*
- **Music:** NONE.

#### Dark (`cs_sig_11_dark.mp4`, 28 s)

> The construct now ALSO targets the caster's allies once per round
> with a friendly-fire chance. Vent realises mid-cast and tries to
> recall the construct.

**Shot 1 — `vent_dark_prep` (10 s)**
- **NB2 START/END:** Same workshop with magenta-veined gears; glyph copper+magenta. Sphere has a magenta seam.
- **Veo motion (10 s):** *as light with magenta seam.*
- **VFX:** copper+magenta glyph.
- **Dialog:** **Vent:** *"Right — hold on — *(beat, alarm)* — that's not the seam I drew."*
- **Music:** NONE.

**Shot 2 — `vent_dark_peak` (10 s)**
- **NB2 START/END:** Close on construct. Standing up, but its eye-LEDs alternate copper-magenta. Vent's hand reaches to grab it back.
- **Veo motion (10 s):** *as light with reach-back.*
- **VFX:** alt-LED.
- **Dialog:** **Vent:** *"Wait — come back — "*
- **Music:** NONE.

**Shot 3 — `vent_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Vent centre, glyph mostly magenta, construct off-bench moving away (out of his control). Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); copper survives at his hands.
- **Dialog:** **Vent:** *"Built. *(beat)* Not by me. Not entirely."*
- **Music:** NONE.

### 7.12 Proctor — sig 12

> Charcoal glyph. Signature: review-mode — caster places an enemy under review for one round; that enemy cannot benefit from buffs.

#### Light (`cs_sig_12_light.mp4`, 28 s)

**Shot 1 — `proctor_light_prep` (10 s)**
- **NB2 START frame:** Proctor's classroom — austere review-board chamber, single charcoal-colour chair, charcoal glyph inert. **Proctor:** stocky man, military bearing, close-cropped grey hair, charcoal robes with sash. Standing centre, both hands behind back.
- **NB2 END frame:** Camera dolly 5 m → 3 m. Charcoal glyph ignited; the chair across from him has lit a single charcoal spotlight from above.
- **Veo motion (10 s):** *push-in. Glyph + spotlight over 8 s. Voice direction: Proctor = parade baritone, exacting.*
- **VFX:** charcoal glyph; spotlight.
- **Dialog:** **Proctor:** *"Step forward. You are under review."*
- **Music:** NONE.

**Shot 2 — `proctor_light_peak` (10 s)**
- **NB2 START frame:** *= Shot 1 END frame.*
- **NB2 END frame:** Close on Proctor. He has produced a clipboard. Behind him, a charcoal beam projects from the spotlight onto the (off-frame) target — visible as a tight column of light across the frame edge.
- **Veo motion (10 s):** *cut to close. Clipboard-produce at second 4. Beam-project at second 8. Voice as cited.*
- **VFX:** clipboard; beam-column.
- **Dialog:** **Proctor:** *"State your case. Briefly."*
- **Music:** NONE.

**Shot 3 — `proctor_light_settle` (8 s)**
- **NB2 START frame:** *= Shot 2 END frame.*
- **NB2 END frame:** Pull back wide. Proctor centre, glyph charcoal, beam-column persists across frame edge to off-frame target. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** charcoal glyph settled.
- **Dialog:** **Proctor:** *"Reviewed."*
- **Music:** NONE.

#### Dark (`cs_sig_12_dark.mp4`, 28 s)

> The review now also stops the caster's allies from buffing the target FROM ABOVE — strips ally-side buffs as well. Proctor accepts this as cost of process integrity.

**Shot 1 — `proctor_dark_prep` (10 s)**
- **NB2 START/END:** Same chamber, magenta clipboard-paper showing through; glyph charcoal+magenta.
- **Veo motion (10 s):** *as light with magenta paper.*
- **VFX:** charcoal+magenta glyph.
- **Dialog:** **Proctor:** *"Step forward. You are under review. *(beat)* So am I."*
- **Music:** NONE.

**Shot 2 — `proctor_dark_peak` (10 s)**
- **NB2 START/END:** Close on Proctor. Clipboard's paper now half-charcoal half-magenta. Beam-column forks: one to target, one back to himself.
- **Veo motion (10 s):** *as light with beam-fork.*
- **VFX:** beam-fork.
- **Dialog:** **Proctor:** *"State your case. *(beat)* I will state mine after."*
- **Music:** NONE.

**Shot 3 — `proctor_dark_settle` (8 s)**
- **NB2 START/END:** Pull-back wide. Proctor centre, glyph mostly magenta; beam-column-fork visible. Final freeze.
- **Veo motion (8 s):** *pull-back. Final freeze.*
- **VFX:** `vfx_thoughtvirus_purple` (0.5); charcoal survives at clipboard.
- **Dialog:** **Proctor:** *"Reviewed. *(beat)* Both of us."*
- **Music:** NONE.

---

## 8. Dreamer-vision VFX flashes

> 3 short looping VFX clips (4–6 s each) used as gameplay feedback —
> no characters, no dialog. Path root: `videos/vfx/dreamer_visions/` and
> a static keyframe at `art/vfx/dreamer_visions/kf_<slug>.webp`.

### 8.1 `vfx_substrate_pulse.mp4` (5 s loop)

- **NB2 START/END frame (= keyframe):** Pure black field with iris-cyan filaments forming an organic root-network across the frame; a single bright pulse-node centre of frame.
- **Veo motion (5 s loop):** *camera locked. Pulse-node pulses outward through the network in a slow ripple over 4 s, fading at the frame edges, returning to base state at second 5. Loop boundary: pulse-node at base brightness at second 0 and second 5.*
- **VFX:** `vfx_dreamer_substrate` (1.0).
- **Dialog:** *(none)*
- **Music:** NONE — sub-bass bed only.

### 8.2 `vfx_iris_collapse.mp4` (4 s loop)

- **NB2 START/END frame:** A single open iris (cosmic-cyan, no eye-flesh, no anatomy — just light and filament) at frame centre, fully open.
- **Veo motion (4 s loop):** *camera locked. Iris closes from 100% open to 20% open over 2 s, holds at 20% for 0.5 s, re-opens to 100% over 1.5 s. Loop boundary: 100% open at second 0 and second 4.*
- **VFX:** `vfx_dreamer_substrate` (0.8); iris close/open.
- **Dialog:** *(none)*
- **Music:** NONE.

### 8.3 `vfx_cryo_frost_retreat.mp4` (6 s loop)

- **NB2 START/END frame:** Cryo-frost crystals across a glass viewport (the ARK's cryo-bay window canon), partial visibility through to a deep-space-black field with one bright star.
- **Veo motion (6 s loop):** *camera locked. Frost retreats from frame edges inward, leaving a clear circle in the centre that grows to 60% of frame, then re-blooms outward to original. Loop boundary: full frost at second 0 and second 6.*
- **VFX:** frost-retreat shimmer; star-pulse single at second 3.
- **Dialog:** *(none)*
- **Music:** NONE.

---

## 9. Card-game UI SFX

> 10 short stings (50–200 ms each), audio-only. Path root:
> `audio/sfx/card-game/`. Match Suno + iZotope processing chain used
> for chess SFX. Render at 48 kHz, 16-bit, stereo, normalize -3 dBFS,
> short fade-out (-30 ms).

| # | SFX | Slug | Duration | Suno + processing prompt |
|---|---|---|---|---|
| 1 | Card hover | `card_hover.mp3` | 80 ms | Single soft brass-tap, mid-range woody resonance, 80 ms tail. Suno prompt: *"single soft mallet tap on a polished wooden block, brief warm low-mid resonance, 80 ms total, no melody, no rhythm, dry."* iZotope: high-pass 80 Hz, gentle compression 2:1, no reverb. |
| 2 | Card pickup | `card_pickup.mp3` | 120 ms | Cardstock lift + brief metallic ping. Suno prompt: *"slick cardstock lift from felt, immediately followed by a single high glass ping, 120 ms total, no music, no rhythm."* iZotope: stereo widen 20%, light room verb 80 ms tail. |
| 3 | Card drop / play | `card_play.mp3` | 150 ms | Cardstock land + low brass thump. Suno prompt: *"cardstock landing on wood, immediately followed by a single low brass thump, 150 ms total, no music."* iZotope: parallel low-end +3 dB, room verb 100 ms. |
| 4 | Card cancel | `card_cancel.mp3` | 100 ms | Reverse-air whoosh. Suno prompt: *"short reverse-air whoosh, descending pitch, 100 ms, no melody."* iZotope: pitch-bend down 2 semitones, dry. |
| 5 | Shuffle | `shuffle.mp3` | 800 ms | Cardstock-shuffle riffle. Suno prompt: *"cardstock riffle shuffle, 800 ms, organic, no music, no foley voice."* iZotope: stereo image, no reverb. |
| 6 | Draw | `draw.mp3` | 200 ms | Cardstock single-card slide off deck. Suno prompt: *"single card sliding off a deck, slight friction-hiss, 200 ms, no music."* iZotope: high-shelf +1 dB at 4 kHz. |
| 7 | Mulligan | `mulligan.mp3` | 600 ms | Multi-card replace whoosh. Suno prompt: *"multiple cards being replaced into deck with a soft whoosh and brief flutter, 600 ms, no music."* iZotope: stereo widen 30%. |
| 8 | Mana / Void Energy spend | `void_energy_spend.mp3` | 180 ms | Glass-bell descending. Suno prompt: *"glass bell single strike, descending pitch by minor-third, 180 ms, sustained tail."* iZotope: pitch-shifted -3 semitones; 200 ms reverb tail. |
| 9 | Trigger / on-cast | `trigger_oncast.mp3` | 250 ms | Brass-and-paper sting — a single brass note with a paper-rustle attack. Suno prompt: *"brass note with paper-rustle attack, 250 ms, no melody."* iZotope: light compression, dry. |
| 10 | Damage / hit | `card_damage.mp3` | 220 ms | Wood-crack + paper-tear. Suno prompt: *"wood crack immediately followed by paper tear, 220 ms total, percussive, no music."* iZotope: stereo, dry, parallel saturation. |

> Render and upload all 10 in one batch:
>
> ```bash
> pnpm tsx apps/scripts/upload-public-to-s3.ts --prefix audio/sfx/card-game/
> ```
>
> Wire each to the card-game UI in `apps/client/src/game/duelyst/sfx.ts`
> by adding the slug to `CARD_GAME_UI_SFX` map (create if missing).

---

## 10. audit/15 multi-perspective — production-asset additions

> Added 2026-05-08 as the audit/16 deliverable. Every art / cinematic /
> VFX line-item raised by the 8-persona audit (`docs/audits/2026-05-08-multi-perspective/`)
> lives here. The engineering work that consumes these assets ships in
> follow-up PRs (audit/16.NN); this section is the asset-pipeline brief.
>
> **Same conventions as §0–9:**
> - Frame-chain rule for multi-shot cinematics
> - 16:9 / 24fps / no music / ambient room tone + VFX SFX + Dialog
> - NB2 START/END frame + Veo motion + VFX + Dialog blocks per shot
> - Every asset cites its CDN target path.

### 10.1 Character turnaround sheets (audit/15 Cos1) — 50 stills

> 25 NPC characters × {front turnaround, full turnaround} = 50 NB2 stills.
> No motion. Path root: `art/characters/<id>/<turnaround_kind>.avif`.
> Aspect: 2752×1536 (matches existing Elara + Human turnarounds at
> `apps/client/public/characters/elara/full_turnaround.avif`).
>
> The cosplay reference site (audit/15 Cluster E) consumes these directly.
> Producer can ship the manifest scaffolding before all 50 land — the JSON
> entry exists with a TODO marker; rendered assets fill in over time.

#### 10.1.1 Roster (production order — most-load-bearing first)

| # | Character ID | Display Name | Notes |
|---|---|---|---|
| 1 | `agent_zero` | Agent Zero | Conexus operative; orange faction-color `#ff6600`; haunted/defiant/spectral expression set; asymmetric hood drape (right offset). |
| 2 | `the_antiquarian` | The Antiquarian | Lore Keeper; green faction-color `#00e676`; thinned mustache for phoneme clarity; ancient/playful/sorrowful/revelatory expressions. |
| 3 | `iron_lion` | Iron Lion | Insurgency veteran; rust-red beard mass; military bearing; battle-scarred. Per `characterSprites.ts:267`. |
| 4 | `kael_recruiter` | Kael (Recruiter form) | Pre-Source insurgency identity; warm tones; signature earring. |
| 5 | `the_source` | The Source / Kael (post) | Red-rimmed iris (substrate corruption); empty/grieving/prophetic/viral states. Color `#ff1744`. |
| 6 | `shadow_tongue` | Shadow Tongue | Hierarchy-adapted anomaly; near-black skin; violet slit-pupil eyes; corporate-adapted clothing; subtle face-drift across viseme cells. Color `#6366f1`. |
| 7 | `the_meme` | The Meme | Silver-haired older executive; mechanical hands at the desk; silver-and-pink palette. Color `#ec4899`. |
| 8 | `architect` | The Architect | Authority faction lead; void-black + Authority-red `#c11414`; recursive geometry overtones. |
| 9 | `collector` | The Collector | Silver-mask, brass-trim collector aesthetic. |
| 10 | `degen` | The Degen | Casino entity; chaotic silver-with-gold; entropic glyph-jewelry. |
| 11 | `eidola` | Eidola | Spectral/Dreamer-adjacent; iris-cyan `#7df3ff`. |
| 12 | `engineer` | The Engineer | Insurgency artificer; cold steel `#2c3540` + hot orange accent. Engineer arc is plot-load-bearing through Acts 4–6. |
| 13 | `enigma` | The Enigma | Silver-haired narrator type; Album-1 song subject. |
| 14 | `eyes` | The Eyes | Insurgency intel; covered face; dark-academia palette. |
| 15 | `gamemaster` | The Game Master | Meta-arc figure; per Blood Weave `BLOOD_WEAVE_REVEAL_POOL` thresholds 9 + 12 + 15 + 20 + 25 + 40. |
| 16 | `matrikala` | Matrikala | Ne-Yon-adjacent; resurrectionist motif. |
| 17 | `necromancer` | The Necromancer | Obsidian + bone-white; Hierarchy aesthetic. |
| 18 | `nilmorg` | Nilmorg | Insurgency / shadow operative. |
| 19 | `programmer` | The Programmer | Pre-Antiquarian identity; Album-5 (West by God) song subject; lab-coat + spectacles. |
| 20 | `seer` | The Seer | Prophecy authority; iris-cyan + amber; sealed-letter motif. |
| 21 | `warlord` | The Warlord | Lockout-boss; rust-red beard; armored bearing. |
| 22 | `watcher` | The Watcher | Panopticon witness; Authority faction; surveillance-aesthetic. |
| 23 | `conexus_authority` | Conexus Authority | Faction figurehead; collective rather than individual. |
| 24 | `the_human` | The Human (full reveal) | The 5th HUMAN_REVEAL_STAGES progression terminus; canonical face only at trust 50+. (Front + full turnaround for the FULL stage; signal-static / ghost / fragment / convergence already exist as expression-grid stills.) |
| 25 | `elara_alt` | Elara — alt-loadout | Already has `front_turnaround.avif` + `full_turnaround.avif` for the canonical hologram form. This entry adds a SECOND turnaround pair for her Act-5+ "panoptic-conduct" alt loadout (different cloak, secondary palette, audited record-keeper aesthetic). |

#### 10.1.2 NB2 prompt template per turnaround

> Two stills per character: **front turnaround** and **full turnaround**.
> Both are NB2-only (no motion). Both share the lighting + palette anchors
> from §1. The difference: front turnaround is bust-up to mid-thigh; full
> turnaround is full-figure with all costume details visible. **Aspect
> 16:9 at 2752×1536** (ratio 1.79:1, matching the existing inventory).

**Front turnaround prompt template:**

```
Cinematic character turnaround sheet, four 90-degree views (front,
3/4-left, profile-left, 3/4-right) arranged left-to-right on a
charcoal seamless backdrop. Character: <Display Name>, <one-paragraph
silhouette + costume + signature-detail description from §2 below>.
Painterly digital illustration. Single dominant key from frame-left,
soft volumetric haze gradient across three depth planes, rim light
only on hero silhouette. Hot accent: <faction color hex>. No text,
no UI chrome, no logos, no readable signage. Aspect 16:9, 2752×1536.
```

**Full turnaround prompt template:**

```
Cinematic full-figure character turnaround sheet, four 90-degree views
(front, 3/4-left, profile-left, 3/4-right) of <Display Name>, full
height including footwear and weapon-primary slot, on a charcoal
seamless backdrop. <One-paragraph silhouette + costume + signature
detail>. Show fabric fall, cloak/cape geometry, asymmetric props,
back-armor configuration. Painterly digital illustration. Single
dominant key from frame-left, three-plane depth haze, hero rim light.
Hot accent: <faction color hex>. No text, no UI chrome. Aspect 16:9,
2752×1536.
```

Per-character canonical descriptions for the prompt's `<silhouette + costume + signature-detail>` slot are pulled from `apps/client/src/game/characterSprites.ts:165–369` (mouth-box calibration comments document the asymmetric details), `apps/client/src/game/npcPortraits.ts:13–124` (faction colors + expression hints), and `apps/shared/suitArtPrompts.ts:148–156` (faction palettes). When these source comments conflict, characterSprites.ts wins (it's the most recently calibrated).

#### 10.1.3 Asset paths

```
art/characters/<id>/front_turnaround.avif     ← 2752×1536
art/characters/<id>/full_turnaround.avif      ← 2752×1536
```

Add corresponding entries to `apps/client/public/characters/_inventory.json` under the existing per-character object.

#### 10.1.4 Reveal-stage exception (the_human)

The Human's progression is ALREADY documented as 5 reveal stages
(`apps/client/src/game/npcPortraits.ts:126–187`). For audit/16 Cos1
purposes:
- The 5 stage stills already exist (signal-static, ghost, fragment, convergence, full).
- ADD: `front_turnaround.avif` + `full_turnaround.avif` for the FULL reveal stage only. Players never see these turnarounds before trust ≥ 50.
- Cosplayers can plan against the full reveal — the early stages are visual-effect overlays, not separate costume builds (per audit/15 Cos7).

### 10.2 Wheel-followup reaction cinematics (audit/15 C1) — 18 stills + 6 cinematics

> Per the Cinematic Director audit, wheel_followup variants currently
> render only as cyan text. They deserve 2.5-second portrait cinematics
> showing the listening NPC absorbing the player's choice. Three Acts
> have wheel_followup variants today: Act 3 (transparent / pragmatic /
> full_secret), Act 4 (broken / fragile / strained / reconciled), Act 6
> (the seven confession-close stances — covered separately in §10.4).
>
> §10.2 covers Acts 3 + 4. 6 cinematics × ~2.5 s each.
> Path root: `videos/cinematics/wheel_followup/`. Static keyframes at
> `art/cinematics/wheel_followup/kf_<slug>.webp`.

#### 10.2.1 Act 3 wheel_followup × 3 reactions

Each cinematic shows **Elara's** bust over the Bridge cyan-hologram glow,
holding neutral composure for 1.2 s, then a 1.3 s expression shift.
Audio: silence (let the player's selected text echo). No music.

**Cinematic 1 — `wheel_act3_transparent.mp4` (2.5 s)**
- **Variant gate:** `wheel_followup_act3_transparent` (`act3_path_transparent_chosen`)
- **NB2 START frame (= keyframe):** Elara front-bust, neutral expression (`elara/expressions/neutral.avif`), centered, against subtly-parallax-drifting Bridge background, cyan hologram glow at 60% saturation.
- **NB2 END frame:** Same composition; expression shifted to `elara/expressions/emotional1.avif` (relief flickers across her face, mouth half-parts as if to speak then doesn't); cyan glow brightens to 75%; subtle catch-light in eyes.
- **Veo motion (2.5 s):** *camera locked. Subtle parallax drift on Bridge background (right-to-left, 4 px). Elara's expression crossfades neutral→emotional1 over frames 30–60 (1.25 s in). Cyan glow lifts in sync.*
- **VFX:** `vfx_substrate_pulse` (0.3 alpha); cyan hologram scanline at 0.2 opacity.
- **Dialog:** *(none — wheel_followup variant text renders as overlay)*
- **Music:** NONE.

**Cinematic 2 — `wheel_act3_pragmatic.mp4` (2.5 s)**
- **Variant gate:** `wheel_followup_act3_pragmatic` (`act3_path_pragmatic_chosen`) — needs new variant entry; per audit/15 only transparent + full_secret have entries today
- **NB2 START frame:** Elara neutral; Bridge bg.
- **NB2 END frame:** Elara `emotional2` (sober understanding; balanced); cyan glow at 65%.
- **Veo motion (2.5 s):** *camera locked. Same parallax. Crossfade neutral→emotional2 over frames 30–60.*
- **VFX:** `vfx_substrate_pulse` (0.3); scanline 0.2.
- **Dialog:** *(none)*
- **Music:** NONE.

**Cinematic 3 — `wheel_act3_full_secret.mp4` (2.5 s)**
- **Variant gate:** `wheel_followup_act3_full_secret` (`act3_path_full_secret_chosen`)
- **NB2 START frame:** Elara neutral; Bridge bg.
- **NB2 END frame:** Elara `emotional1` reframed darker — eyes harden, mouth flat, jaw tightens; cyan glow DESATURATES to ~40% (forbearance reading); subtle blue undertone shift on shadow side.
- **Veo motion (2.5 s):** *camera locked. Parallax. Expression hardening over frames 30–60. Cyan saturation drops over frames 45–60 in sync with the jaw-set.*
- **VFX:** `vfx_substrate_pulse` (0.2 alpha — quieter); scanline narrows at end.
- **Dialog:** *(none)*
- **Music:** NONE.

#### 10.2.2 Act 4 wheel_followup × 3 reactions

Same template, **The Human's** bust over the Cabin warm-amber glow.
Substrate corruption fades or hardens with the choice.

**Cinematic 4 — `wheel_act4_broken_trust.mp4` (2.5 s)**
- **Variant gate:** `act4_broken_trust`
- **NB2 START frame:** The Human bust at HUMAN_REVEAL_STAGE 3 (signal-fragment); Cabin warm-amber bg with red flicker.
- **NB2 END frame:** Substrate-corruption HARDENS — fragmentation increases by 30%; expression `the-human-vulnerable_f1bqhc.jpg` overlaid at 60%, signal degrades visibly.
- **Veo motion (2.5 s):** *camera locked. Substrate filaments grow over frames 30–75. Glitch micro-shimmer increases in last 0.5s.*
- **VFX:** `vfx_substrate_corruption` (1.0); red-flicker bed (0.3); glitch-overlay (0.4).
- **Dialog:** *(none)*
- **Music:** NONE.

**Cinematic 5 — `wheel_act4_fragile_trust.mp4` (2.5 s)**
- **Variant gate:** `act4_fragile_trust`
- **NB2 START frame:** The Human bust at HUMAN_REVEAL_STAGE 3.
- **NB2 END frame:** Slight corruption RELIEF — signal stabilizes by 10%; expression neutral.
- **Veo motion (2.5 s):** *camera locked. Substrate filaments stabilize, slight clarification over frames 45–60.*
- **VFX:** `vfx_substrate_corruption` (0.7).
- **Dialog:** *(none)*
- **Music:** NONE.

**Cinematic 6 — `wheel_act4_reconciled.mp4` (2.5 s)**
- **Variant gate:** `act4_reconciled`
- **NB2 START frame:** The Human bust at HUMAN_REVEAL_STAGE 3.
- **NB2 END frame:** SIGNAL ADVANCES one stage to HUMAN_REVEAL_STAGE 4 (signal-convergence). Expression `the-human-amused_mnco27.jpg` at 60%; subtle smile read.
- **Veo motion (2.5 s):** *camera locked. Substrate filaments resolve — frames 30–60 cross-fade stage 3 → stage 4 image with ~0.5s overlap.*
- **VFX:** `vfx_substrate_pulse` (0.5) replacing corruption; warm amber glow lifts.
- **Dialog:** *(none)*
- **Music:** NONE.

#### 10.2.3 Variant-resolver wiring (downstream consumer)

Each cinematic's slug becomes the value for a new optional
`portraitCinematicId` field on `MoralityTrustActVariant` (audit/15
Cluster D, lands in PR 4). The NarrativeEngine wheel-followup render
block (`apps/client/src/components/NarrativeEngine.tsx:119–137`) calls
`playSlideshow(portraitCinematicId)` after the choice is locked,
before the next dialog phase.

### 10.3 Human reveal transition cinematics (audit/15 C2) — 12 cinematic frames

> 4 stage transitions for The Human (cold → neutral → warm → confidant →
> full-revealed). Each is 3 s with Ken Burns motion on the existing
> HUMAN_REVEAL_STAGES Cloudinary stills. Path root:
> `videos/cinematics/human_reveal/`. Static keyframes at
> `art/cinematics/human_reveal/kf_<slug>.webp`.

#### 10.3.1 Stage 1 — Static → Ghost (`human_reveal_to_ghost.mp4`, 3 s)

Trust threshold 10 (cold → neutral lower bound). Triggered the moment
trust crosses 10.

- **NB2 START frame:** Existing `signal-static` reveal asset (pure noise field, ~80% opacity).
- **NB2 END frame:** Existing `signal-ghost` reveal asset (silhouette emerging from noise; ~40% noise overlay).
- **Veo motion (3 s):** *frames 0–24: hold start. Frames 24–60: slow Ken Burns zoom-in (2.5%) on start frame, opacity fade-out 90% → 0%. Frames 30–72: opacity fade-in 0% → 100% on end frame, paired Ken Burns 1.5% on end. Final 12 frames: hold end.*
- **VFX:** `vfx_substrate_pulse` (0.4 — rising); subtle low-frequency hum bed.
- **Dialog:** *(none)*
- **Music:** NONE — sub-bass bed only (rises in pitch through transition).
- **SlideshowPlayerRoot bookend text:** "SIGNAL RESOLVING" at start; "SIGNAL LOCKED" at end.

#### 10.3.2 Stage 2 — Ghost → Fragment (`human_reveal_to_fragment.mp4`, 3 s)

Trust threshold 20.

- **NB2 START frame:** `signal-ghost`.
- **NB2 END frame:** `signal-fragment` (partial face, scanline corruption at 50%).
- **Veo motion (3 s):** Same Ken Burns crossfade pattern.
- **VFX:** `vfx_substrate_pulse` (0.6); scanline corruption stabilizes during crossfade.
- **Dialog:** *(none)*
- **Music:** NONE — sub-bass bed (one semitone higher than 10.3.1).
- **Bookend:** "SIGNAL RESOLVING" / "FRAGMENT LOCKED."

#### 10.3.3 Stage 3 — Fragment → Convergence (`human_reveal_to_convergence.mp4`, 3 s)

Trust threshold 40.

- **NB2 START frame:** `signal-fragment`.
- **NB2 END frame:** `signal-convergence` (~80% face visible, scanline corruption at 20%).
- **Veo motion (3 s):** Ken Burns crossfade.
- **VFX:** `vfx_substrate_pulse` (0.8); corruption fades through transition.
- **Dialog:** *(none)*
- **Music:** NONE — sub-bass bed (third semitone up).
- **Bookend:** "SIGNAL RESOLVING" / "CONVERGENCE LOCKED."

#### 10.3.4 Stage 4 — Convergence → Full reveal (`human_reveal_to_full.mp4`, 3 s)

Trust threshold 50. **Most cinematically significant** — first time the
player sees the canonical face. Director should privilege this shot.

- **NB2 START frame:** `signal-convergence`.
- **NB2 END frame:** Full-reveal portrait (the Human's canonical face — see audit/15 Cos1 entry #24 for the turnaround that grounds this still). Warm amber glow at 75%; substrate filaments minimal (~5% opacity only at frame edges).
- **Veo motion (3 s):** *Ken Burns crossfade BUT with a 1-frame held white flash at frame 36 (mid-transition) — like a camera shutter or signal-lock confirmation. Audio sting (`vfx_dreamer_substrate` (1.0)) lands on the white frame.*
- **VFX:** `vfx_substrate_pulse` (1.0); white-flash transition; warm-amber bloom in last 12 frames.
- **Dialog:** *(none — held silence)*
- **Music:** NONE — sub-bass bed resolves to a clean low tone (perfect-fifth from the Stage 1 starting note).
- **Bookend:** "SIGNAL RESOLVING" / "I AM HERE."

#### 10.3.5 Variant gating (Cluster D consumer)

Each transition optionally fires a variant-gated VARIANT of the
cinematic if `useVariant("human_reveal_transition", "human_reveal_stage_${currentStage}", input)` resolves. Examples:

- Machine-aligned player crossing trust 10: `human_reveal_to_ghost_machine.mp4` — same composition, cool-blue tint replacing warm-amber.
- High-trust Elara confidante crossing trust 50: `human_reveal_to_full_elara_confidante.mp4` — warm amber stays + Elara's cyan filaments lace into the frame edges (the two narrators are merging acoustically at this moment per the Witnessing doctrine).

Producer can ship the base 4 cinematics first, then variant flavors as
follow-up commissions.

### 10.4 Act 6 confession-close stance cinematics (audit/15 C4) — 14 cinematics

> 7 confession stances × 2 confessing characters (Elara when Detective
> in the Wall is the confessor; The Human when Woman She Was is the
> confessor) = 14 cinematics. Each 2.8 s. Path root:
> `videos/cinematics/act6_confession/`. Static keyframes at
> `art/cinematics/act6_confession/kf_<slug>.webp`.

#### 10.4.1 The 7 stances (audit/15 source)

Per `apps/client/src/pages/Act6CardLadderPage.tsx:64–110`:

| Stance flag | Stance label | Tone read | NPC reaction expression |
|---|---|---|---|
| `act6_confession_close_empathy` | "Sit with them in it." | Soft — held silence, witnessing | Elara: `emotional2` (vulnerable softening); Human: `emotional1` (relief overlaid on dread) |
| `act6_confession_close_challenge` | "Answer the confession with a harder one." | Sharp — meeting truth with truth | Elara: `emotional1` (concern + steel); Human: `emotional2` (vulnerability surfaces) |
| `act6_confession_close_refusal` | "Refuse the absolution." | Steel — boundary held | Elara: `neutral` darkening (jaw set); Human: `neutral` (signal stabilizes; closed) |
| `act6_confession_close_reluctant_ally` | "Stand with them — for now." | Pragmatic warmth | Elara: `speaking` (chin lifts; small nod); Human: `emotional1` (cautious hope) |
| `act6_confession_close_partial` | "Accept some, reject some." | Surgical — boundary-with-care | Elara: `neutral` (calm focus); Human: `emotional2` (mixed read) |
| `act6_confession_close_oracle_sense` | "Close your eyes and listen beneath the words." | Receptive — substrate read | Elara: `emotional2` half-lidded; Human: `emotional1` exposed (substrate read sees beneath them) |
| `act6_confession_close_practical` | "Take the ledger out. Balance what was said." | Mercantile — debt named | Elara: `neutral` (weights an invisible scale); Human: `neutral` (relief at the room being lighter) |

#### 10.4.2 Cinematic prompt template

Each cinematic is **2.8 s of NPC reaction**. The player's selected
stance text echoes silently (no VO). The cinematic locks the emotional
read of the confession-close moment.

**NB2 START frame template:**
```
Close bust of <NPC> in <Cabin / Bridge / Archives — wherever the
confession is happening>. Expression: NEUTRAL. Soft natural lighting,
muted background (out-of-focus environment 30% saturation). Hot accent:
<faction color>.
```

**NB2 END frame template:**
```
Same composition. Expression shifted to <stance-tone expression per
table above>. Background unchanged. Subtle catch-light in eye matching
emotional read.
```

**Veo motion (2.8 s):**
```
Camera locked. Frames 0–30 hold neutral. Frames 30–60 expression
crossfade to stance-tone expression. Frames 60–67 hold final.
Background remains static (out-of-focus). NO music. NO VO.
```

#### 10.4.3 The 14 cinematic IDs

```
act6_confession_elara_empathy.mp4
act6_confession_elara_challenge.mp4
act6_confession_elara_refusal.mp4
act6_confession_elara_reluctant_ally.mp4
act6_confession_elara_partial.mp4
act6_confession_elara_oracle_sense.mp4
act6_confession_elara_practical.mp4
act6_confession_human_empathy.mp4
act6_confession_human_challenge.mp4
act6_confession_human_refusal.mp4
act6_confession_human_reluctant_ally.mp4
act6_confession_human_partial.mp4
act6_confession_human_oracle_sense.mp4
act6_confession_human_practical.mp4
```

Engineering wires this into `Act6CardLadderPage.tsx:100` after stance
selection, before flag-set, via a new function
`playConfessionStanceCinematic(stance, speakingCharacter, state)`. The
function resolves cinematic id from the stance flag + character id; the
variant resolver can override per morality/trust state via Cluster D.

### 10.5 Chapter-card telegraphs (audit/15 Strm6) — 28 stills

> Longplay-editor-friendly chapter banners that auto-play 2.5s before
> a major cinematic. Per audit/15 Strm6: act + chapter title + faction
> mood color. NB2 only (no motion). Path root:
> `art/cinematics/chapter_cards/<slug>.webp`. Aspect 16:9 at 1920×1080.
>
> Approximately 28 chapter banners per the act-progression spec
> (`docs/production/ACT1_NARRATIVE_STRUCTURE.md` informs the count).

#### 10.5.1 Per-chapter banner template

```
Cinematic full-frame chapter card. Black field. Centered text in
serif typography: "ACT <N>" smaller above; "<CHAPTER TITLE>" larger
below. Above the title: a single thematic icon in <faction-color hex>
(stylized symbol matching the chapter's tonal register — surveillance
eye for Authority, broken chain for Insurgency, eclipse for Dreamer,
etc.). Below the title: a thin underline rule in <faction-color> at
30% opacity. Far edges: subtle vignette to true black. Painterly
digital illustration. NO photographic elements. NO logos. Aspect
16:9, 1920×1080.
```

#### 10.5.2 Chapter banner roster (informal — final set authored against ACT1_NARRATIVE_STRUCTURE.md)

| Slug | Act | Chapter title | Mood | Color anchor |
|---|---|---|---|---|
| `chapter_act1_awakening` | 1 | The Awakening | Cold dread | `#22d3ee` (cyan) |
| `chapter_act1_first_light` | 1 | First Light | Cautious hope | `#ff6b1a` (insurgency orange) |
| `chapter_act1_finale_alignment` | 1 | The Cycle's First Cut | Volatile | `#ff2bd6` (Nexon magenta) |
| `chapter_act2_silence_of_two_witnesses` | 2 | Silence of Two Witnesses | Reverent | `#7df3ff` (iris-cyan) |
| `chapter_act2_oracle_deflection` | 2 | The Oracle's Refusal | Sharp | `#a02d2d` (woven) |
| `chapter_act3_disclosure` | 3 | What Elara Knew | Charged | `#22d3ee` |
| `chapter_act3_path_dividend` | 3 | The Cost of Telling / The Cost of Not Telling | Shifting | varies (variant) |
| `chapter_act4_consumed_witness` | 4 | Kael Consumed | Substrate-horror | `#ff1744` (Source red) |
| `chapter_act4_broken_trust` | 4 | The Bridge Goes Quiet | Cold | desaturated `#22d3ee` |
| `chapter_act4_reconciled` | 4 | We Speak Again | Warm | `#ff6b1a` |
| `chapter_act5_recruitment` | 5 | Five Sectors | Multi-faction | three accents (rare exception to one-color rule) |
| `chapter_act6_confession` | 6 | The Detective in the Wall / The Woman She Was | Sober | warm amber `#b88c3a` |
| `chapter_act6_remembrance` | 6 | The Memorial Corridor | Grieving | desaturated all |
| `chapter_act7_silence_in_heaven` | 7 | The Seventh Seal | Apocalyptic | pure white on black, no faction-color |
| `chapter_act7_humanity_chosen` | 7 | We Choose to Stay | Quiet — humanity terminus | warm amber resolving |
| `chapter_act7_pattern_chosen` | 7 | We Choose the Pattern | Cold — machine terminus | clean cyan resolving |
| `chapter_authority_trial` | (5.8) | The Authority Trial | Procedural-dread | `#c11414` (Authority red) |
| `chapter_memorial_corridor` | (any) | Remembrance | Grieving | warm amber `#b88c3a` |
| `chapter_casino_jackpot` | (any) | The Pot Tips | Manic | `#ec4899` (Meme pink) |
| `chapter_card_battle_climax` | (any) | Final Turn | Adrenal | per-faction mood (variant) |
| `chapter_dream_vision` | (any) | The Vision | Ethereal | `#7df3ff` |

(Producer expands to full 28 set against ACT1_NARRATIVE_STRUCTURE +
ALL_ACTS_ROADMAP per real chapter cadence.)

#### 10.5.3 Engineering wiring (downstream)

`SongCinematicVideo` (`apps/client/src/components/SongCinematicVideo.tsx:14–31`)
gains `chapterTitle?: string` + `chapterId?: string`. When supplied,
renders the chapter card for 2.5s before the video fades in. Slug
`chapter_<chapterId>` resolves to the stored asset.

### 10.6 Room state visual overlays (audit/15 ER2) — 7 environmental transformations

> Each overlay is an NB2 still (no motion) layered as a CSS overlay over
> the existing room background art. The base room art doesn't change;
> the overlay activates when the relevant narrative flag fires. Path
> root: `art/rooms/overlays/<room>_<state>.webp`. Aspect matches base
> room (varies; ~1920×1080 for parallax-room renders).

#### 10.6.1 The 7 overlays (per `apps/shared/adventureFeatures.ts:181–193`)

**1. `medical_bay_quarantine.webp` — Medical Bay quarantine lighting**
- **Trigger flag:** `medbay_quarantine_activated`
- **NB2 prompt:** Red emergency-grade lighting wash across Medical Bay walls. Pulsing red overlay (50% opacity at center, fading to 20% at edges). Caution-stripe diagonal bars on door-frames. NO change to ceiling/floor/equipment shapes — this is a LIGHTING overlay only. Painterly digital illustration. Aspect-match Medical Bay base. Hot accent: `#c11414` (Authority red).
- **CSS overlay class:** `data-room-state="quarantine"` triggers `mix-blend-mode: multiply` with 60% opacity.

**2. `archives_text_rewriting.webp` — Archives text rewriting in real-time**
- **Trigger flag:** `shadow_tongue_evidence`
- **NB2 prompt:** Archives data-bank screens visibly rewriting in the unreadable hue (a violet color the player perceives as a band of "wrongness" rather than text — `#6366f1` shifted toward `#9d6efb`). Text fragments visible at ~70% opacity, fluid (not letters; pseudo-glyphs). Background Archives shelves UNCHANGED — only the screen-overlay shifts.
- **CSS overlay class:** `data-room-state="rewriting"` activates a CSS-keyframe shimmer animation on the screen-overlay div.

**3. `bridge_bloodstain.webp` — Bridge subtle bloodstain appears**
- **Trigger flag:** `bridge_kael_evidence_logged`
- **NB2 prompt:** A faint reddish-brown stain on the Bridge floor near the Conspiracy Board, ~30 cm diameter. Stain has been cleaned but not perfectly — slight discoloration only visible from certain angles (here, the player's POV). Surrounding floor unchanged. Painterly digital illustration; very subtle, easy to miss. Hot accent: `#5b1a1a` (oxblood).
- **CSS overlay class:** `data-room-state="evidence-logged"` activates the stain at 70% opacity.

**4. `obs_deck_terminus_signal.webp` — Observation Deck Terminus signal visible**
- **Trigger flag:** `terminus_singer_found`
- **NB2 prompt:** Through the Observation Deck viewport, a single faint pinpoint of light (one star, fractionally brighter than the surrounding starfield) at frame center-right. Subtle pulsing ring of cyan haze around the light at 15% opacity. NO change to the Observation Deck interior. Aspect matches Observation Deck base. Hot accent: `#7df3ff` (iris-cyan).
- **CSS overlay class:** `data-room-state="terminus-active"` shows the star + halo via SVG overlay.

**5. `engineering_resonance.webp` — Engineering racks humming visibly**
- **Trigger flag:** `terminus_step_2`
- **NB2 prompt:** Engineering equipment racks emit faint cyan-amber glow lines along the metal seams. Subtle vibration suggested by heat-shimmer haze around the racks at 20% opacity. Walls and floor unchanged. Painterly digital illustration. Hot accent: `#22d3ee`/`#ff6b1a` blend (faction-cross moment).
- **CSS overlay class:** `data-room-state="resonance"` triggers a CSS heat-shimmer keyframe.

**6. `medbay_safe_unlocked.webp` — Medical Bay emergency safe biometric scanner unlocks**
- **Trigger flag:** `vox_step_3`
- **NB2 prompt:** Close-up element of the emergency safe's biometric scanner glowing green (success state) instead of red (locked state). The rest of the safe and surrounding Medical Bay unchanged. Hot accent: `#00e676` (Antiquarian green).
- **CSS overlay class:** `data-room-state="safe-unlocked"` activates the green-glow div over the scanner zone.

**7. `bridge_violet_thread.webp` — Bridge Conspiracy Board violet-thread reveals**
- **Trigger flag:** `elara_on_the_board`
- **NB2 prompt:** The Conspiracy Board's three red threads UNCHANGED. A FOURTH thread, violet (`#9d6efb`), running from the central blank pin to a small ELARA-SYS tag at the upper-right corner of the board. Thread visible only under indirect lighting (subtle UV-glow read). Painterly digital. Hot accent: violet.
- **CSS overlay class:** `data-room-state="elara-on-board"` reveals the violet-thread SVG layer.

#### 10.6.2 Engineering wiring (downstream)

Per `audit/15 ER2`: create `apps/client/src/game/roomVisualState.ts` exporting `applyRoomStateOverlay(roomId, flags): RoomVisualState`. `ParallaxRoom` (in `ArkExplorerPage.tsx:73`) calls it and conditionally mounts the overlay div above the base background. Each overlay's `data-room-state` attribute drives its CSS animation/blend-mode.

### 10.7 Blood Weave portrait progression (audit/15 Cos5b new visual canon) — 5 bands × 8 crew = 40 stills

> Per the new `BLOOD_WEAVE_BAND_VISUALS` canon shipped in this PR
> (`apps/shared/bloodWeave.ts`), each crew member's portrait progresses
> through 5 visual states as Blood Weave alignment climbs. Path root:
> `art/characters/<id>/blood_weave/<band>.avif`. Aspect 16:9 at 1024×576.

#### 10.7.1 The 5 bands (matching BLOOD_WEAVE_BAND_VISUALS)

| Band | Hex | Glow | Thread description |
|---|---|---|---|
| `dormant` | `#1a1a1a` | none | No visible thread; baseline portrait. |
| `braiding` | `#8b3a3a` | subtle | Hairline-thin red filament along jaw or shoulder, visible only in shadow. |
| `woven` | `#a02d2d` | moderate | Discernible pattern: Hellbox sigil-trace at chest level, thin red embroidery on collar/cuff. |
| `bound` | `#c12121` | pronounced | Pattern unmistakable: red thread temple-to-wrist, pulsing with heartbeat. Eyes carry a red rim at the lower lid. |
| `claimed` | `#ff1a1a` | luminous | Saturated red glow envelopes figure. Eyes fully red. Thread is structural, not cosmetic. Game-Master meta-arc fires. |

#### 10.7.2 Crew roster needing portraits

Per the unified-roster system (PR #509 + PR #513), Blood Weave portraits
need 5-band progressions for the 8 named crew at minimum:

1. Iron Lion
2. Kael (Recruiter form — pre-Source)
3. The Engineer
4. The Eyes
5. Agent Zero
6. Jericho Jones (insurgency veteran)
7. Matrikala (Ne-Yon-adjacent)
8. The Programmer (pre-Antiquarian)

Total: **5 bands × 8 crew = 40 NB2 stills**.

#### 10.7.3 NB2 prompt template

```
Cinematic crew-member portrait at Blood Weave band <BAND_NAME>.
Character: <Display Name>, <silhouette + costume description>.
Apply <thread description> from §10.7.1. Hot accent: <band color
hex>. Glow intensity: <none/subtle/moderate/pronounced/luminous>.
Painterly digital illustration; visible brushwork at 1:1, clean
read at thumbnail. Single dominant key from frame-left, three-plane
depth haze. Aspect 16:9, 1024×576. NO text, NO UI chrome.
```

The `dormant` band is the existing base portrait — no new render
needed; just symlink or alias the existing
`apps/client/public/characters/<id>/idle.avif`.

#### 10.7.4 Engineering wiring (downstream)

A new helper `getBloodWeaveBandPortrait(crewId, alignmentValue)` in
`apps/shared/bloodWeave.ts` resolves the band via `bandFor(alignment)`
and returns the portrait URL. The Resurrection Panel's Stage-3 tab
(`apps/client/src/components/HellboxRestorationPanel.tsx`) and the
Memorial Corridor (`apps/client/src/pages/MemorialCorridorPage.tsx`)
both render the appropriate band's portrait based on each crew member's
current alignment.

### 10.8 manuscriptVault background art (audit/15 Co1) — 1 still + 3 hotspot insets

> The Archives data-banks mise-en-abyme expansion (Conspiracy persona's
> top finding) needs a new room: a small "manuscript vault" surface
> reachable only after the player logs both `clue-archives-novel-overwrite`
> AND a cross-room corroborating clue. Path root:
> `art/rooms/manuscript_vault/`.

#### 10.8.1 Background art (`bg.avif`)

- **Aspect:** 1920×1080.
- **NB2 prompt:** Cinematic interior of a small archival vault. Floor-to-ceiling shelves of bound manuscripts in dark leather and brass clasps. Narrow walking aisle (camera POV from aisle-end). Single dominant brass-warm key light from the far end of the aisle, soft volumetric haze across three depth planes. Manuscript spines: most are blank or illegible; one in the foreground (closest shelf, mid-height) has a visible title in the unreadable hue (`#9d6efb`). Painterly digital illustration. Subtle eldritch geometry in the shelf joinery (rings within rings). NO modern logos, NO readable signage, NO UI chrome. Hot accent: brass `#b88c3a`.

#### 10.8.2 Hotspot insets (3 close-ups)

**1. `hotspot_overwrite_manuscript.avif` — The overwrite manuscript**
- Close-up of an open book on a stand. Left page: original Antiquarian-era ledger entries in faded sepia ink. Right page: same entries in the unreadable hue, rewritten over the originals. Player can SEE the difference; the violet text doesn't read as language but as a band of wrongness across the page. Painterly close-up. Hot accent: `#9d6efb` violet on the right page.

**2. `hotspot_editor_signature.avif` — The Editor's signature card**
- A small archival card pinned beside the manuscript stand. Carries a single hand-drawn glyph in the unreadable hue, surrounded by a halo of similar glyphs in faded older ink (the Editor's signature evolving across 14,000 edits). Painterly close-up.

**3. `hotspot_corroboration_thread.avif` — Cross-room thread connection**
- A thin red string nailed to the wall above the manuscript stand, running upward and out of frame (toward the Bridge — implied geographic continuity with the Conspiracy Board's violet thread). The string visibly tied to a small knot at the manuscript's binding, suggesting THIS is the source of the Bridge's Elara-thread evidence. Painterly close-up.

#### 10.8.3 Engineering wiring (downstream)

Per audit/15 Co1: create `apps/shared/roomMysteries/manuscriptVault.ts` as a new room mystery module. The room registers in `apps/shared/roomMysteries/index.ts:67–102` only when the player has logged both `clue-archives-novel-overwrite` (Archives) AND a corroborating clue from Bridge or Cryo Bay (TBD which clue ID). 3 hotspots map to the 3 inset assets above. Lands in PR 8 (Conspiracy/Lore).

### 10.9 Asset summary + production order

| Section | Asset count | Aspect | Effort |
|---|---|---|---|
| 10.1 Character turnarounds | 50 stills | 2752×1536 | XL — most-load-bearing first; producer ships incrementally |
| 10.2 Wheel-followup cinematics | 6 cinematics × 2.5s | 16:9 4K | M |
| 10.3 Human reveal transitions | 4 cinematics × 3s | 16:9 4K | M |
| 10.4 Act 6 confession-close | 14 cinematics × 2.8s | 16:9 4K | L |
| 10.5 Chapter-card telegraphs | 28 stills | 1920×1080 | M (informally; can ship in waves) |
| 10.6 Room state overlays | 7 stills | varies | M |
| 10.7 Blood Weave progressions | 40 stills | 1024×576 | L |
| 10.8 Manuscript vault | 4 stills | varies | S |
| **Total** | **~150 production assets** | | |

#### 10.9.1 Recommended production order

The following ordering minimizes engineering blocking — early waves
unblock the most downstream PRs in the audit/16 sprint:

1. **§10.6 Room state overlays** (7 stills) — unblocks PR 7 (Escape Room sequencing, ER2).
2. **§10.4 Confession-close cinematics × 4** (start with empathy + refusal × Elara + Human; defer the other 5 stances to a later wave) — unblocks PR 9 partial (C4).
3. **§10.5 Chapter-card telegraphs × 5** (start with the most-load-bearing acts: act1_awakening, act3_path_dividend, act4_consumed_witness, act6_remembrance, act7_silence_in_heaven) — unblocks PR 5 (Streamer, Strm6).
4. **§10.2 Wheel-followup × 6** — unblocks PR 9 (C1).
5. **§10.3 Human reveal transitions × 4** — unblocks PR 9 (C2).
6. **§10.8 Manuscript vault × 4** — unblocks PR 8 (Co1).
7. **§10.1 Character turnarounds × first 10** (production order: agent_zero, antiquarian, iron_lion, kael_recruiter, the_source, shadow_tongue, the_meme, architect, the_human full, elara_alt) — unblocks PR 14 (Cluster E character canon site MVP).
8. **§10.7 Blood Weave progressions** (start with iron_lion + kael_recruiter, defer the other 6 crew) — unblocks PR 3 (Cosplay metadata can land with Cos5b colors only; portraits ship as available).
9. **§10.1 remaining 40 turnarounds + §10.7 remaining 30 portraits + §10.4 remaining 10 confession cinematics** — long-tail backfill across 4–8 weeks.

#### 10.9.2 Engineering placeholder strategy

For every asset that hasn't been rendered yet, engineering ships:
- A manifest entry with the canonical CDN path
- A `placeholder: true` marker in the corresponding metadata JSON
- A graceful-degradation render (existing portrait at lower opacity for missing turnarounds; bypass the cinematic mount and surface text-only for missing wheel-followups; CSS-only overlay for missing room-state stills)

This means engineering PRs (PR 2–14) are NOT blocked on art delivery —
they ship the wiring + placeholders, and the asset replacement is a
silent CDN drop later.

---

## End of prompt book

For anything not covered here — Prelude beat audio re-uploads, FNORD-23
OUTERGROOVE music (31 instrumentals), discovery-video Kling prompts,
act-intro / mechanic-intro Kling prompts, casino expansion, Cades FPS
SFX, dreamer-vision Veo prompt detail, guild-cutscene full Veo prompts —
see the active reference docs listed in
`docs/ART_DEPARTMENT_PRODUCTION.md` §6.

When this book is rendered and uploaded, run:

```bash
pnpm tsx scripts/_check-art-coverage.mjs
pnpm vitest run apps/server/preludeBibleAudit.test.ts
pnpm ship:check
```

The first verifies CDN HEAD-coverage on the new paths. The second
re-runs the cross-audit. The third confirms no subsystem regressed.
