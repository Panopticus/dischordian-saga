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
10. [Fighter game — sprites, stages, HUD, VFX](#10-fighter-game--sprites-stages-hud-vfx)
11. [Fighter game — SFX, voice barks, music](#11-fighter-game--sfx-voice-barks-music)
12. [Ark + Mechronis rooms × states](#12-ark--mechronis-rooms--states)
13. [Guild common rooms + casino + game-mode environments](#13-guild-common-rooms--casino--game-mode-environments)
14. [Trade Empire sectors × prosperity states](#14-trade-empire-sectors--prosperity-states)
15. [Soul Stones / Castle of Death summoning + sig VFX + card-combat VFX + room ambients + UI/transition SFX](#15-summoning--sig-vfx--card-combat-vfx--ambients--sfx)
16. [Mini-DLC mystery arcs + Daniel Cross epigraphs + Acts 2-7 climax + Expansion Bible gameplay loops + Witnessing VFX](#16-mini-dlc--epigraphs--acts-2-7--expansion-bible-loops--witnessing-vfx)
17. [Living Character Sheet — base bodies + "Energy chooses a form" awakening](#17-living-character-sheet)

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

## 10. Fighter game — sprites, stages, HUD, VFX

### 10.0 Render contract for the fighter game

- **Sprite sheets**: per-fighter, per-pose. Format **PNG with alpha**, 8 frames per row, 1 row per pose. Frame size **256×256**; sheet size therefore **2048×256**. Source render in **Nano Banana 2** at 4× (1024×1024 per frame), then downsample. Style anchor: §1.1, but with a slightly **higher contrast** (the fighter game reads at smaller scale than story stills) and a hard rim-light on the leading edge of the action.
- **Stage backgrounds**: 3 parallax layers per stage. Format **JPG sRGB** for FG/MG/BG (no alpha), **WebM with alpha** for the animated ambient layer. Resolution **1920×1080** per static layer; ambient layer **24fps, 6s seamless loop, ≤4MB**. House style: §1.1 + §1.2.
- **HUD assets**: PNG with alpha, 2× resolution for retina. Style anchor: brass-and-cyan from §1.2, no neon overpower (HUD must not compete with action).
- **VFX**: WebM with alpha, 24fps, 0.3–1.0s, frame-budget ≤24 frames each. Composited over the action via additive blend.
- **Asset prefix**: `art/fight/sprites/<fighter_id>/<pose>.png`, `art/fight/stages/<stage_id>/<layer>.{jpg,webm}`, `art/fight/hud/<element>.png`, `art/fight/vfx/<effect>.webm`, all uploadable via `pnpm assets:upload`.
- **Voice direction (per fighter)**: §11 carries the bark catalog. Sprite renders DO NOT bake mouth-shapes — the fighter game uses synthesized lip-flap, not phoneme-keyed mouths.

### 10.1 Per-fighter sprite-sheet pack

Each fighter gets one consolidated authoring pass. **All 20 pose sheets per
fighter** carry the same canon (cite §2 hero canon by id), the same palette,
the same lighting register. The differences across pose sheets are:
**silhouette**, **frame-count**, **start/end frame anatomy**.

The 20 pose sheets per fighter:

| # | Pose ID | Frames | Start frame | End frame | Notes |
|---|---|---:|---|---|---|
| 1 | `idle` | 6 | settled stance | settled stance + small breath rise | seamless loop |
| 2 | `walk_forward` | 8 | left foot leading | right foot leading | seamless cycle |
| 3 | `walk_back` | 8 | right foot leading | left foot leading | seamless cycle |
| 4 | `run_forward` | 8 | full stride extension | full stride extension (mirror) | seamless cycle |
| 5 | `jump` | 6 | crouched windup | apex peak / descent rotation / land squash | one-shot |
| 6 | `attack_light_punch` | 5 | guard | full extension | quick recovery |
| 7 | `attack_medium_punch` | 7 | wind-up rotation | full extension + rotation | longer recovery |
| 8 | `attack_heavy_punch` | 9 | deep wind-up | full uppercut extension | heavy recovery |
| 9 | `attack_light_kick` | 5 | guard | front-leg extension | quick recovery |
| 10 | `attack_medium_kick` | 7 | hip rotation | roundhouse extension | longer recovery |
| 11 | `attack_heavy_kick` | 10 | deep crouch | sweep arc + knockdown follow-through | recovery |
| 12 | `special_1` | 12 | charge stance | release pose + held "after" pose | character-unique |
| 13 | `special_2` | 12 | alt charge | alt release + after-pose | character-unique |
| 14 | `super_move` | 16 | full-body invocation | climactic strike + screen-flash trigger frame | fires VFX `vfx_super_screenflash` |
| 15 | `hit_high` | 4 | guard | full head-back recoil | hitstun |
| 16 | `hit_mid` | 4 | guard | mid-torso fold | hitstun |
| 17 | `hit_low` | 4 | guard | knee-buckle | hitstun |
| 18 | `knockdown` | 10 | airborne | ground bounce + still + rise | combines fall+rise |
| 19 | `block_active` | 3 | guard | guard + shimmer flash | held while button down |
| 20 | `victory` | 8 | end-of-fight stillness | full victory pose with character signature | one-shot |
| 21 | `taunt` | 6 | provoke wind-up | arms-out mockery | one-shot |
| 22 | `crouch` | 2 | standing | crouched | toggle |

(That's 22, not 20 — `block_active` and `crouch` were added as required for
combat readability.)

The per-fighter authoring template below is filled per each of the 22 fighters.

#### Authoring template — `<fighter_id>` sprite-sheet pack

> **Fighter**: `<fighter_id>` (Loredex `<entity_id>`, see §2.<x>).
> **Canon visual** (carry into every sheet): `<one-line silhouette + signature attribute, e.g., "Architect: tall, geometric red-glow figure, asymmetric pauldron, void-black bodysuit, fractal-line interior glow, Hierarchy red #ff1744 inner light, no exposed face">`.
> **Palette**: `<2-3 colors from §1.2, e.g., "Hierarchy red, void black, brass edge">`.
> **Backlight**: hard rim from upper-right at 75°, brass edge color.
> **Render style**: §1.1 painterly digital with visible brush at 1:1, clean read at 256-px thumbnail. No on-image text.
> **Sheet manifest** (render all 22 sheets to `art/fight/sprites/<fighter_id>/`):
> - `idle.png` — 6 frames, seamless. Start/end frame: settled fighting stance, weight on back foot, leading hand at chin-height. Breathing oscillation 1px on the chest.
> - `walk_forward.png` — 8 frames, seamless cycle. Use real-walk weight transfer; don't bob the head more than 4px.
> - `walk_back.png` — 8 frames, mirror of forward but with shoulders 5° more squared (defensive read).
> - `run_forward.png` — 8 frames, full stride. Trailing arm tucked. Hair/cape drift trails behind by 30px on extension frames.
> - `jump.png` — 6 frames. Frame 1 deep crouch. Frame 3 apex. Frame 6 land squash with anticipated dust kick (just the silhouette — actual dust VFX is layered separately).
> - `attack_light_punch.png` — 5 frames. Frame 1 guard. Frame 2 windup. Frame 3 strike (active). Frame 4 retract. Frame 5 guard. Lead hand only.
> - `attack_medium_punch.png` — 7 frames. Add hip-rotation windup + recovery beat.
> - `attack_heavy_punch.png` — 9 frames. Uppercut: deep crouch windup, full body uncoils to upward strike, recovery beat, return to guard.
> - `attack_light_kick.png` — 5 frames. Front-leg snap kick.
> - `attack_medium_kick.png` — 7 frames. Roundhouse with full hip rotation.
> - `attack_heavy_kick.png` — 10 frames. Sweep — deep crouch, leg arc, knockdown follow-through (off-foot can be airborne briefly).
> - `special_1.png` — 12 frames. <fighter-specific charge + release; e.g., for Architect: gathering-of-fractal-lines into the offhand, then a fan-shaped projectile release pose held for 4 frames>.
> - `special_2.png` — 12 frames. <fighter-specific alternative; e.g., for Architect: a defensive lattice manifesting around the body — a mid-air block-counter>.
> - `super_move.png` — 16 frames. <fighter-signature climactic; e.g., for Architect: GENESIS PROTOCOL — body splits into 4 fractal-mirrors, all four strike simultaneously, screen-flash trigger frame is frame 14>.
> - `hit_high.png` — 4 frames. Head snaps back, body follows.
> - `hit_mid.png` — 4 frames. Body folds inward at mid-torso, hands drop.
> - `hit_low.png` — 4 frames. Knee buckles inward.
> - `knockdown.png` — 10 frames. Airborne tumble (3) → ground impact (2 — one bounce frame) → grounded still (2) → rise to knee (2) → rise to stand (1).
> - `block_active.png` — 3 frames. Guard with arms crossed-X high, frame 2 shimmer flash, frame 3 return to guard. Hold by repeating frame 1 if button held.
> - `victory.png` — 8 frames. End-of-fight stillness → full <fighter-signature> pose. Hold frame 8 for 0.5s before idle resumes.
> - `taunt.png` — 6 frames. Provoke wind-up → arms-out mockery → return.
> - `crouch.png` — 2 frames. Standing → crouched. Toggle.
>
> **Veo 3.1 motion test** (optional QA): render the `idle.png` 6-frame loop as a 1s WebM at 256×256, alpha; verify the seamless-loop join at frame 6 → frame 1 has zero visible jump.

The 22 pose sheets are rendered for each of the **21 canonical fighters**:

| Fighter id | Loredex | Signature super-move authoring note |
|---|---|---|
| `architect` | entity_2 | GENESIS PROTOCOL — body fractures into 4 fractal-mirrors, all strike at once. Hard red flash trigger frame 14. |
| `collector` | entity_6 | DNA HARVEST — bony tendrils erupt from beneath the cape, drag opponent in, freeze-frame on a ribbon-helix forming over the head. |
| `enigma_malkia` | entity_54 | CYAN TESSELLATION CASCADE — body lattice ripples outward in concentric squares, each tile that touches opponent applies frostbite. Trigger frame 12. |
| `warlord` | entity_10 | NANOBOT SWARM — body dissolves into orange-glowing motes, reassembles behind opponent for back-strike. Trigger frame 13. |
| `necromancer` | entity_20 | RAISE DEAD — three ghostly silhouettes erupt from the floor, each delivers one strike in sequence. Trigger frame 14 on the third strike. |
| `meme` | entity_5 | IDENTITY THEFT — body morphs through 4 species silhouettes (DeMagi, Quarchon, Neyon, Human) striking once each, ends in the opponent's silhouette. Trigger frame 15. |
| `shadow_tongue` | entity_7 | EDIT THE TIMELINE — cone of indigo glyph-text washes the screen, opponent's last 2 hits "un-happen" (gameplay: heal opponent's last 2 lost health bars then remove them). Trigger frame 13. |
| `watcher` | entity_4 | PANOPTICON LOCK — single eye descends from above, beam of cyan light pins opponent in place for 4 frames. Trigger frame 11. |
| `oracle` | entity_51 | (not implemented as fighter — Oracle is referenced but does not enter the playable roster; render `idle` only as a placeholder for future-content slot.) |
| `human` | entity_1 | TWO VOICES ONE FIST — character splits into rose+cyan halves, both strike same point. Trigger frame 13. |
| `agent_zero` | entity_12 | YELLOW COAT INFILTRATION — character vanishes, reappears behind opponent, six rapid taps + a final knockdown sweep. Trigger frame 15. |
| `akai_shi` | entity_88 | NINE TAILS — feline afterimages strike from nine angles. Trigger frame 14 on the ninth. |
| `programmer` | entity_3 | DANIEL CROSS PATCH — character types in midair, code-glyph projectile explodes on opponent, opponent stuns for 2s. Trigger frame 13. |
| `iron_lion` | entity_42 | ARMY OF ONE — Insurgency banner unfurls behind, 4 silhouetted soldiers join for a synchronized rifle-volley pose, then a single spear-thrust from Iron Lion himself. Trigger frame 15. |
| `source_kael` | entity_49 | TERMINUS BLOOM — character flares into chaos-corruption form (purple + black), 12-frame all-screen lattice expands, opponent caught at the center. Trigger frame 12. |
| `game_master` | entity_14 | GAME OVER — chess-piece silhouettes (king, queen, rook, knight, bishop, pawn) cycle through 6 strikes; final pose is checkmate-king salute. Trigger frame 14 on the king strike. |
| `authority` | entity_13 | SUPREME VERDICT — robe billows out, scales-of-justice manifest above the head, descend to crush opponent. Trigger frame 13. |
| `jailer` | entity_48 | CONTAINMENT FIELD — chains erupt from the four corners of the screen, lock onto opponent, character delivers a ceremonial single strike. Trigger frame 14. |
| `host` | entity_89 | HOST'S EMBRACE — body splits like an opening flower, opponent pulled in, character closes over them. Trigger frame 13. |
| `engineer` | entity_17 | LAST WORDS — character invokes the song bar, on-screen waveform pulses, single delayed-impact strike that lands 8 frames after the visual cue. Trigger frame 16 (last). |
| `the_eyes` | entity_24 | SWARM SIGHT — 12 cyan eye-projectiles fan out, converge on opponent. Trigger frame 14. |

### 10.2 Stage parallax + ambient

Each stage gets 4 layers: `bg.jpg`, `mg.jpg`, `fg.jpg` (each 1920×1080, sRGB,
80 quality), and `ambient.webm` (1920×1080, alpha, 24fps, 6s seamless loop,
H.264 alpha or VP9 alpha, ≤4MB).

#### Stage authoring template — `<stage_id>`

> **bg.jpg** — `<deepest layer; very out of focus, 8-stop bokeh; no actor-relevant detail>`. Render in Nano Banana 2 at 1920×1080. House style §1.1. Palette §1.2 anchor: `<colors>`. Lighting register: `<key from §1.3>`.
> **mg.jpg** — `<middle layer; moderately blurred (3-stop), recognizable but non-distracting>`.
> **fg.jpg** — `<closest non-actor layer; sharp, but composition pulled to the screen edges so center stage is unobstructed>`.
> **ambient.webm** — `<animated element drifting across the screen; smoke / sparks / dust / water / etc. Alpha. Seamless 6s loop. No hard edges that would draw the eye away from action.>`.

#### Per-stage prompts (8 standard + 3 PvP + 4 boss = 15 stages)

##### `stage_new_babylon`
> bg: deep-violet citystate skyline at dusk, hundreds of red Authority lanterns at every level, central pyramidal courthouse tower silhouetted against a blood-orange sun, smog haze. mg: marble plaza floor with red-and-gold mosaic Authority sigil baked in (large enough to read at full-screen, faded by foot-wear at center). fg: two ceremonial red banners flanking the screen edges, brass tassels, slight wind-sway baked-in (still). ambient: gold leaf falling diagonally screen-right to screen-left, soft, ~30 leaves visible in any frame. Palette: Authority crimson #ff1744, brass #d4a574, void black.

##### `stage_panopticon`
> bg: vertical surveillance-tower interior; concentric ring-walkways recede upward into shadow; tiny silhouettes of guards on every ring (the bg implies thousands of watchers without rendering them). mg: stone-and-glass cell-block-style backdrop; reinforced windows, faint cyan camera-LED pips visible (60% off, 40% on, randomized). fg: dark stone arch frame to left and right, dust caught in down-shafts of light. ambient: a single cyan surveillance-orb drifts across the screen at ankle height, slow, scans the action with a sweeping rectangular beam (the beam is **part of the ambient layer**, not gameplay). Palette: Watcher amber #fbbf24, charcoal, cyan camera-LED.

##### `stage_thaloria`
> bg: Thalorian valley at dawn, low-fog blanket the floor, a single distant silver tree (2m tall on screen, twisted, leafless). mg: terraced stone steps, weathered, with prayer-glyph carvings (carvings illegible by design — not text, just glyph patterns). fg: low foreground stones, a single broken wheel-shaped prayer-disc lying flat. ambient: drifting white feathers, slow descent, ~12 feathers visible. Palette: pearl-cream, deep-slate blue, amber morning-light.

##### `stage_terminus`
> bg: void-rift tear cracking the sky, deep purple → black gradient inside the rift, exterior is a chaos-storm of black sand. mg: a fractured monument, a single seven-pointed star carved into the broken stone, pulsing softly. fg: the floor itself is broken in tile-fragments hovering at ankle level (the floor is gone — the fighters fight on a grid of suspended slabs). ambient: void-particles (small black motes) drift upward, the opposite of dust falling. Palette: void black, royal purple, blood orange interior-rift glow.

##### `stage_mechronis`
> bg: massive vertical industrial pistons reciprocating slowly behind a glass observation wall (the pistons render as a parallax-loop in the JPG — the WebM ambient adds the real motion). mg: lecture-platform riser steps, brass-bound, indigo running-light strips along edges. fg: a heavy lectern at left edge, bronze book-rest, dim internal light. ambient: piston-strokes (the actual motion — vertical pump arms behind the glass wall — animate at 2.4 strokes per 6s loop, always returning to start). Palette: indigo, brass, matte black industrial.

##### `stage_crucible`
> bg: open-air arena rim; lava lake below; the rim is a scarred black-stone amphitheater, partial silhouettes of crowd-shadow figures in the distant tiers. mg: cracked obsidian arena floor, lava-glow seams. fg: a brazier on either screen-edge, shoulder-height, full active fire. ambient: ember spray rising from the lava cracks beneath the arena floor, slow. Palette: scorched black, lava-orange, blood-red.

##### `stage_blood_weave`
> bg: organic chamber, walls are intertwined sinew-and-bone columns, faint red pulse from within them (heartbeat-like, slow). mg: a low altar at center-back, draped in crimson cloth, single iron knife. fg: hanging meat-hooks at left and right, red fabric streamers. ambient: drifting blood-mist, near-black with red highlights, ankle-height. Palette: crimson, bone-cream, pitch black.

##### `stage_shadow_sanctum`
> bg: floating purple-arcane runes forming a dome, runes rotate very slowly (the slow rotation is in the ambient layer), a single moon-disc behind the dome. mg: stone altar of dark obsidian, geometric carving. fg: two stone sentinel statues, faceless, flanking screen edges. ambient: 8 floating runes drift in concentric counter-rotating rings around the central altar; the rings cross the action zone but at z-back (behind the fighters). Palette: deep purple, indigo, soft cyan accent.

##### `stage_ranked_table` (PvP)
> bg: tournament chamber with 12 large screens mounted in a hemispherical arc, each screen showing a faction sigil. mg: polished marble floor with brass tournament-roster inlay. fg: two ranked-judge thrones at left/right edges, empty. ambient: a slow-rotating brass tournament cup hovers at upper-screen-center (not in the action zone), faint sparkle. Palette: brass, marble white, royal blue accent.

##### `stage_tournament_hall` (PvP)
> bg: vast banquet-style hall with banners hanging from the rafters (12 Archon Guild sigils alternating). mg: a balcony-edge stage with stairs descending to fighter-floor. fg: two heralds' standards at left/right edges, embroidered with gold. ambient: confetti drifts from above, gold and white, slow. Palette: gold, royal red, ivory.

##### `stage_draft_chamber` (PvP)
> bg: glass-roofed strategy room, deep night sky above, constellation-map of factions pulsing softly (each constellation is a player's deck-roster represented as star-points; design-only suggestion, not gameplay). mg: a long planning table with floating holographic deck-pieces. fg: two strategist-chairs flanking. ambient: 6 floating cards drift in a shallow horizontal arc near the top of the screen, slow tumble. Palette: midnight blue, electric cyan, brass.

##### `stage_watcher_panopticon` (boss)
> bg: an enormous third-eye iris dominates the back wall, the iris contracting and dilating slowly. mg: hovering surveillance-feed monitors (12 visible) showing partial scenes from across the game's other rooms — render the monitors at low contrast so the scenes feel surveilled. fg: the camera-eye scaffold at left/right edges — two robotic arms with cameras pointed at the fighters. ambient: the central iris contracts/dilates over the 6s loop, in sync. Palette: charcoal, cyan camera-glow, amber alert-glow.

##### `stage_architect_throne` (boss)
> bg: massive vertical fractal-lattice arch dominating the back; the arch is the Architect's signature lattice rendered architectural-scale; the arch glows from within. mg: a throne of red-and-black ascending steps, throne itself empty (the Architect IS on stage as the boss fighter — the throne being empty matters). fg: two fractal-spire columns flanking. ambient: code-cascade drifts down the back arch, like a slow-falling Matrix-style cascade but in fractal-glyph rather than letters. Palette: red lattice glow, void black, fractal cyan accent.

##### `stage_necromancer_castle` (boss)
> bg: gothic vaulted hall with seven blood-crystal pedestals arranged in a heptagon at the back; the central summoning circle is dormant in this stage variant. mg: a long stone aisle with two rows of empty wooden pews; each pew has a single skull on it (skulls don't move). fg: a single hanging green-foxfire chandelier at upper-screen-center (lit). ambient: green foxfire wisps rise from the floor in slow vertical drifts. Palette: bone-cream, blood-red crystal, foxfire green.

##### `stage_terminus_core` (boss)
> bg: deep-rift interior — the camera is INSIDE a void-tear; perspective shifts visibly across the loop (this means render the bg as a still that suggests motion, and let the ambient WebM carry the actual perspective shift). mg: floating slabs of corrupted city-stone, all at slight angles. fg: a single corrupted seven-pointed-star monument breaking through the floor at left, half-buried. ambient: across the 6s loop the camera FOV shifts 8° (toward the action and back), making the fighters appear to be stalked by the rift itself. Palette: violet, royal purple, void-black, blood-orange seam.

### 10.3 HUD assets

> **`art/fight/hud/health_bar_p1.png`** — 600×40 px. Brass frame, deep-red interior fill region, divider tick-marks every 50 HP. Empty state: deep grey interior; full state: bright red. Subtle inner shadow. Two-layer authoring: `health_bar_p1_frame.png` + `health_bar_p1_fill.png` (so engine can clip the fill).
> **`art/fight/hud/health_bar_p2.png`** — same as p1 but mirrored, framed in cobalt-blue.
> **`art/fight/hud/super_meter.png`** — 240×24 px, gold-frame, internal three-segment marks (Lv1/2/3). Three segment-states authored: empty, partial (3 variants), full-glowing.
> **`art/fight/hud/portrait_frame_p1.png`** — 160×160 px brass-bordered frame, alpha-cut ring inside for a circle-cropped fighter portrait. Slight inner glow corresponding to player faction.
> **`art/fight/hud/portrait_frame_p2.png`** — mirrored, cobalt-bordered.
> **`art/fight/hud/round_card_round_1.png`** — 1200×400 px, full-bleed banner: ornate red-on-black scroll with "ROUND 1" in cinematic display text (this is the **only** HUD asset that allows on-image text). Plays once at round start.
> **`art/fight/hud/round_card_round_2.png`** — same, "ROUND 2".
> **`art/fight/hud/round_card_final.png`** — same composition, "FINAL ROUND" in larger weight, gold underline.
> **`art/fight/hud/timer_clock.png`** — 96×96 px, brass clock-face, 12-position tick layout. Engine handles needle rotation in code.
> **`art/fight/hud/combo_pop_<tier>.png`** — 4 tiers (`bronze`, `silver`, `gold`, `platinum`). 200×80 px each. Brass-and-color floating numerals with a dynamic-glow rim. Engine substitutes the numeral.
> **`art/fight/hud/victory_banner.png`** — 1920×400 px full-width banner: "VICTORY" in cinematic display text, brass-and-gold, with a soft particle aura. Plays after match.
> **`art/fight/hud/flawless_victory_banner.png`** — same composition, "FLAWLESS VICTORY" with deep-red underline + flame-aura accent.
> **`art/fight/hud/perfect_banner.png`** — same composition, "PERFECT" at largest weight, white outer glow.
> **`art/fight/hud/ko_splash.png`** — 1920×1080 full-screen overlay: huge "K.O." text bottom-center, semi-transparent black tint top, screen-edge cracks emanating from the center (visual broken-glass effect). One-shot play on KO.

### 10.4 Combat VFX

All VFX render as **WebM with alpha**, 24fps, 256×256 unless noted. Style: §1.5
animation vocabulary; lifespans short (the eye should never linger).

> **`art/fight/vfx/hit_spark_light.webm`** — 5 frames, 0.21s. Radial 6-ray burst, white core, brass spokes. 256×256.
> **`art/fight/vfx/hit_spark_medium.webm`** — 7 frames, 0.29s. 12-ray burst, white core, gold spokes, faint orange falloff.
> **`art/fight/vfx/hit_spark_heavy.webm`** — 10 frames, 0.42s. Full sunburst, white-hot core, red-orange falloff, two satellite mini-bursts.
> **`art/fight/vfx/block_shimmer.webm`** — 4 frames, 0.17s. Cyan hex-grid lattice flashes once over the blocker silhouette, then fades.
> **`art/fight/vfx/super_screenflash.webm`** — 1920×1080, 6 frames, 0.25s. Full-screen white flash → fighter-faction-color tint → fade. **Tinted-color is per-fighter** — render 21 variants, one per fighter, named `super_screenflash_<fighter_id>.webm`.
> **`art/fight/vfx/freeze_frame_outline.webm`** — 4 frames, 0.17s. White outline traces fighter silhouette (outline only, not the body), holds 2 frames, fades.
> **`art/fight/vfx/knockdown_dirt.webm`** — 8 frames, 0.33s. Brown dust burst at ankle level, expanding outward then settling. 384×128 (wider than tall).
> **`art/fight/vfx/projectile_trail_<faction>.webm`** — 8 frames, looping 0.33s. Trail of energy in faction color (6 variants: hierarchy-red, insurgency-orange, authority-crimson, dreamer-cyan, mechronis-indigo, terminus-violet).
> **`art/fight/vfx/victory_afterimage.webm`** — 12 frames, 0.5s. Trailing translucent clone of the fighter steps backward then dissolves. Renders **per-fighter** — 21 variants. Use the `victory.png` sprite as the source frame.
> **`art/fight/vfx/ko_blackout.webm`** — 1920×1080, 12 frames, 0.5s. Iris-close vignette to black from the screen edges, then a single white flash, then black hold. One-shot.
> **`art/fight/vfx/character_glow_super_ready.webm`** — looping 12 frames, 0.5s. Outer glow halo rotates around fighter-silhouette. Plays whenever the super meter caps. **Per-fighter color** — 21 variants.

> **Render + upload**:
> ```bash
> pnpm tsx apps/scripts/upload-public-to-s3.ts --prefix art/fight/
> ```
> **Wire**:
> - Sprite sheets register in `apps/client/src/game/fight/spriteRegistry.ts` (create if missing).
> - HUD elements register in `apps/client/src/game/fight/hud/hudRegistry.ts`.
> - VFX register in `apps/client/src/game/fight/vfx/vfxRegistry.ts`.
> - Stage layers register in `apps/client/src/game/fight/stages/stageRegistry.ts`.

---

## 11. Fighter game — SFX, voice barks, music

### 11.0 Render contract for fighter audio

- **All combat SFX**: 48kHz 16-bit stereo, OGG Vorbis q=6 (or MP3 192kbps if engine prefers), normalized to -14 LUFS, peak ≤ -1.5 dBTP. Render in **Suno 5.1** + **iZotope** chain (RX 11 De-Click + Insight 2 metering); export trimmed to ±5ms of useful onset.
- **All voice barks**: ElevenLabs Studio Project, per-fighter voice profile (see §11.2 voice-profile catalog), -14 LUFS, peak ≤ -1.5 dBTP, 48kHz. Each bark is its own asset; no concatenation.
- **All music tracks**: Suno 5.1, 48kHz stereo, MP3 256kbps (engine streams). Loop-points pre-baked at the top-of-file via Studio One's "loop tail" technique (last 8s overlap with first 8s, crossfade, render).
- **Asset prefix**: `audio/fight/sfx/<slug>.ogg`, `audio/fight/voice/<fighter_id>/<bark_id>.ogg`, `audio/fight/music/<slug>.mp3`, `audio/fight/ambient/<stage_id>.ogg`.

### 11.1 Combat SFX (32 universal + 21 per-fighter super-move + 21 per-fighter taunt-clack)

Universal stings:

> **`audio/fight/sfx/punch_light_whoosh.ogg`** (0.18s) — Suno: "single sharp air-cut whoosh, thin, 80–120ms decay, no body, no impact, just the cut".
> **`audio/fight/sfx/punch_light_hit.ogg`** (0.16s) — Suno: "flesh-on-flesh quick slap with a small wood-knock undertone, no reverb, brief".
> **`audio/fight/sfx/punch_medium_whoosh.ogg`** (0.22s) — Suno: "fuller air-cut, broader frequency, 200ms decay".
> **`audio/fight/sfx/punch_medium_hit.ogg`** (0.22s) — Suno: "meatier impact, body-hit thump under the slap, brief room-tail (40ms)".
> **`audio/fight/sfx/punch_heavy_whoosh.ogg`** (0.30s) — Suno: "deep arcing whoosh, 300ms decay, slight low-end rumble".
> **`audio/fight/sfx/punch_heavy_hit.ogg`** (0.32s) — Suno: "heavy thud + bone-crack accent + 80ms reverb tail, weighty".
> **`audio/fight/sfx/kick_light_whoosh.ogg`** (0.20s) — Suno: "short fabric-air cut, 150ms decay".
> **`audio/fight/sfx/kick_light_hit.ogg`** (0.18s) — Suno: "leather-on-flesh slap, mid-frequency".
> **`audio/fight/sfx/kick_medium_whoosh.ogg`** (0.26s) — Suno: "fabric-sweep through air, 250ms decay".
> **`audio/fight/sfx/kick_medium_hit.ogg`** (0.26s) — Suno: "boot-on-body, lower-frequency thump".
> **`audio/fight/sfx/kick_heavy_whoosh.ogg`** (0.36s) — Suno: "long arcing kick-whoosh, body-momentum, 350ms decay, low-end".
> **`audio/fight/sfx/kick_heavy_hit.ogg`** (0.40s) — Suno: "heavy boot-impact + crack + room-tail (100ms), weighty".
> **`audio/fight/sfx/sweep_kick_hit.ogg`** (0.45s) — Suno: "low-sweep ground-impact + tumbling-body element, 100ms tail".
> **`audio/fight/sfx/jump_landing.ogg`** (0.30s) — Suno: "boot-on-floor double-tap (heel-toe), no reverb".
> **`audio/fight/sfx/block_metallic.ogg`** (0.20s) — Suno: "single sharp metal-on-metal clang with a small bell-tail, 200ms".
> **`audio/fight/sfx/parry_chime.ogg`** (0.30s) — Suno: "single high glass-bell ping, 250ms decay, distinct from block".
> **`audio/fight/sfx/knockdown_thud.ogg`** (0.50s) — Suno: "body-on-floor heavy thud + slight room-tail (150ms)".
> **`audio/fight/sfx/ko_impact.ogg`** (0.80s) — Suno: "huge sub-bass hit + cracked-glass shatter accent + long reverb (600ms)".
> **`audio/fight/sfx/round_start_bell.ogg`** (1.20s) — Suno: "single boxing-bell ding with a 1s decay, brass tone".
> **`audio/fight/sfx/round_end_bell.ogg`** (1.50s) — Suno: "double boxing-bell ding with a 1.2s decay".
> **`audio/fight/sfx/match_start_announce.ogg`** (1.20s) — ElevenLabs: voice — male announcer baritone, line: "FIGHT!", short, with stadium reverb (180ms tail).
> **`audio/fight/sfx/finish_him.ogg`** (1.40s) — ElevenLabs: same announcer, line: "FINISH HIM.", calm-grave delivery (not shouted), with stadium reverb.
> **`audio/fight/sfx/finish_her.ogg`** (1.40s) — ElevenLabs: same announcer, line: "FINISH HER.", same delivery.
> **`audio/fight/sfx/finish_them.ogg`** (1.40s) — ElevenLabs: same announcer, line: "FINISH THEM.", same delivery.
> **`audio/fight/sfx/victory_sting.ogg`** (2.50s) — Suno: "brass-fanfare 5-note ascending sting, full orchestra, ending on a held high-F, 500ms tail".
> **`audio/fight/sfx/defeat_sting.ogg`** (2.20s) — Suno: "low brass three-note descending sting, mournful but proud".
> **`audio/fight/sfx/perfect_sting.ogg`** (3.00s) — Suno: "ascending fanfare overtopped with a soprano choir-stab on the final chord".
> **`audio/fight/sfx/menu_select.ogg`** (0.10s) — Suno: "tight tech-blip, 80ms".
> **`audio/fight/sfx/menu_back.ogg`** (0.12s) — Suno: "reverse blip, 100ms".
> **`audio/fight/sfx/menu_confirm.ogg`** (0.20s) — Suno: "double-tap confirmation, brass tone".
> **`audio/fight/sfx/character_select_lock.ogg`** (0.50s) — Suno: "metal-clamp lock-down sound + small bell".
> **`audio/fight/sfx/super_meter_full.ogg`** (1.20s) — Suno: "ascending glittering-bell flourish ending on a sustained tone".

Per-fighter super-move SFX (21 variants). Authoring template:

> **`audio/fight/sfx/super_<fighter_id>.ogg`** (1.5–2.5s) — Suno: `<fighter-flavor>`, capture the silhouette of the super animation in audio (every fighter's super has 4 distinct sonic moments: invoke, charge, release, impact). Examples:
> - `super_architect.ogg`: invoke = sub-bass swell, charge = fractal-glass-tinkle layered with rising whine, release = single hard fractal-shatter, impact = orchestral hit + tape stop.
> - `super_collector.ogg`: invoke = whispered crowd-mumble, charge = rising bone-helix click, release = wet dragging + helix lock-click, impact = crystal-cage close.
> - `super_enigma_malkia.ogg`: invoke = ascending cyan choir, charge = crystalline ringing, release = ice-pane shatter, impact = held-tone for 0.4s.
> - `super_warlord.ogg`: invoke = mechanical clicking, charge = swarm-buzz crescendo, release = ringed metal-impact, impact = deep boom.
> - `super_necromancer.ogg`: invoke = single bass-organ note, charge = three rising ghost-wails, release = three sequential wet-thuds (one per ghost), impact = crypt-door slam.
> - `super_meme.ogg`: invoke = morphing voice-pitch slide, charge = 4 stacked vocal-stab samples, release = each species' weapon-strike audio chained, impact = laugh-cut.
> - `super_shadow_tongue.ogg`: invoke = retrograde-tape rewinding, charge = whispered-text wash, release = single backward-impact, impact = ringing silence (3s).
> - `super_watcher.ogg`: invoke = single eye-iris-shutter click, charge = high-whine surveillance-beam, release = single laser-snap, impact = electronic confirmation tone.
> - `super_human.ogg`: invoke = duet-of-two-voices breathing, charge = stacking harmonic, release = single dual-channel hit (rose channel + cyan channel), impact = held duet-chord.
> - `super_agent_zero.ogg`: invoke = silent (0.8s of room-tone — by design), charge = footsteps fading, release = six rapid-fire close-microphone shots, impact = single body-fall.
> - `super_akai_shi.ogg`: invoke = nine bell-pings ascending, charge = wind through bamboo, release = nine quick blade-cuts, impact = single sustained held-note.
> - `super_programmer.ogg`: invoke = mechanical-keyboard typing, charge = code-compile beep, release = single explosion + glass-shatter, impact = error-tone.
> - `super_iron_lion.ogg`: invoke = banner-unfurl flap, charge = four synchronized rifle-bolt-pulls, release = single rifle-volley, impact = spear-thrust + roar.
> - `super_source_kael.ogg`: invoke = chaos-storm swell, charge = rising distortion, release = lattice-ring expansion (sub-bass), impact = sustained reverse-reverb tail.
> - `super_game_master.ogg`: invoke = chess-clock click, charge = 6 piece-moves on board (clack-clack), release = single king-piece slam, impact = "checkmate" whispered + sting.
> - `super_authority.ogg`: invoke = robe-fabric whirl, charge = scales-of-justice clank-rising, release = stone-crush thud, impact = gavel-strike.
> - `super_jailer.ogg`: invoke = chain-rattle from four directions, charge = chains-tightening, release = ceremonial single-strike, impact = lock-snap.
> - `super_host.ogg`: invoke = wet floral-bloom unfurling, charge = soft suction-pull, release = closing-flower sound, impact = muffled-from-inside thud.
> - `super_engineer.ogg`: invoke = waveform-bar rising hum, charge = "Last Words" musical-bar fragment (4 piano notes), release = held silence (8 frames), impact = single resonant-bell tone.
> - `super_the_eyes.ogg`: invoke = 12 simultaneous iris-clicks, charge = swarm-whine, release = 12 staggered laser-snaps, impact = unified confirmation tone.

Per-fighter taunt-clack SFX (the audio-only "clack" that plays under the
visual `taunt.png` sprite, distinct from the voice-bark `taunt_*` lines in
§11.2):

> **`audio/fight/sfx/taunt_clack_<fighter_id>.ogg`** (0.4–0.7s) — A short non-verbal sonic signature that registers AS THAT FIGHTER's audio fingerprint. Examples: Architect = single fractal-glass tap; Necromancer = bone-rattle; Iron Lion = banner-flap + spear-butt floor-thump; Game Master = chess-piece-on-board clack. Render 21 variants.

### 11.2 Per-fighter voice barks (catalog)

Each fighter gets **a voice profile** (ElevenLabs Studio) and a **bark
catalog** rendered against that profile. The catalog is identical per fighter
in slot-structure; the lines and delivery vary.

The 22-slot bark catalog per fighter:

| Slot | When | Line direction | Notes |
|---|---|---|---|
| `intro_1` | round 1 start | confident statement of self | 1.5s |
| `intro_2` | round 1 start (alt) | confident statement of self | 1.5s |
| `taunt_1` | manual taunt button | mockery, character-flavored | 1.0s |
| `taunt_2` | manual taunt button (alt) | mockery, alt | 1.0s |
| `taunt_3` | manual taunt button (alt) | mockery, alt | 1.0s |
| `hit_grunt_light` | take light hit | brief vocal grunt | 0.4s |
| `hit_grunt_medium` | take medium hit | mid-volume grunt | 0.5s |
| `hit_grunt_heavy` | take heavy hit | loud strained grunt | 0.7s |
| `attack_yell_light` | throw light attack | brief exhale | 0.3s |
| `attack_yell_medium` | throw medium attack | mid-exhale | 0.4s |
| `attack_yell_heavy` | throw heavy attack | full exhale + word | 0.6s |
| `special_yell_1` | throw special_1 | single character-word callout | 0.8s |
| `special_yell_2` | throw special_2 | single character-word callout (alt) | 0.8s |
| `super_invoke` | super start | full ritualized invocation phrase | 1.5–2.5s |
| `super_release` | super hit-frame | single climactic word | 0.6s |
| `block_grunt` | block held under pressure | strain-grunt | 0.5s |
| `parry_quip` | successful parry | brief one-line quip | 1.0s |
| `knockdown_grunt` | knocked down | strained "ah" / wordless | 0.5s |
| `victory_line_1` | win | post-fight statement | 2.0s |
| `victory_line_2` | win (alt) | post-fight statement | 2.0s |
| `defeat_line` | lose | post-fight statement | 2.0s |
| `mid_round_breath` | between rounds | wordless breath/regroup | 1.0s |

That's **22 barks × 21 fighters = 462 voice-bark renders**, all batched in
one ElevenLabs Studio Project per fighter. Voice profiles are catalogued in
the table below; line scripts ship as a CSV (`apps/scripts/fight-voice-barks.csv`,
to be authored alongside this prompt book).

#### Fighter voice profile catalog

> **`architect`** — Cold synthetic baritone, 0% breath, vocoder ring (8% wet), perfectly clean reverb (250ms hall, 12% wet), zero pitch jitter. Reference timbre: HAL 9000 baritone. ElevenLabs: "fight_architect_v1".
> **`collector`** — Whispered patrician baritone, hyper-articulate, slight vinyl-crackle (0.6%), low room-tone bed (-32dB). Reference: a quieter Christopher Lee. ElevenLabs: "fight_collector_v1".
> **`enigma_malkia`** — Cyan, crystalline female alto, light glass-shimmer-style chorus (12% wet), held-tone reverb (1.4s tail at -22dB). Reference: a half-whispered Tilda Swinton. ElevenLabs: "fight_enigma_v1".
> **`warlord`** — Gravel mid-baritone, mechanical-distortion underlayer (subtle, 4% drive), bullhorn-style EQ (notched 200Hz), zero reverb (combat-radio register). Reference: Idris Elba in "command" register. ElevenLabs: "fight_warlord_v1".
> **`necromancer`** — Sardonic baritone, theatrical cadence, ghost-double-tracking at -8dB (every line has a half-second-delayed ghost-line of itself), faint cathedral reverb (700ms tail, 18% wet). Reference: Jeremy Irons "Scar" register. ElevenLabs: "fight_necromancer_v1".
> **`meme`** — Morphing voice — every line records 4 takes with different vocal characters (DeMagi-warrior baritone, Quarchon-vocoder, Neyon-flange, Human-natural) and the engine cross-fades through them. ElevenLabs: 4 profiles, "fight_meme_demagi_v1" / "fight_meme_quarchon_v1" / "fight_meme_neyon_v1" / "fight_meme_human_v1".
> **`shadow_tongue`** — Reverse-reverb pre-tail (the reverb plays BEFORE the voice, by 200ms — feels wrong but reads as Shadow Tongue's identity), male tenor neutral. Reference: Cillian Murphy whispering. ElevenLabs: "fight_shadow_tongue_v1".
> **`watcher`** — Modulated synthetic, slight robotic step-quantization on consonants, surveillance-camera-radio EQ (high-pass at 500Hz). Reference: a less-emotional GLaDOS. ElevenLabs: "fight_watcher_v1".
> **`oracle`** — (placeholder; not implemented as fighter — record a single `intro_1` line for the future-content slot).
> **`human`** — Natural rose-cyan duet — every line records as a true duet of two voices (one rose-warm female, one cyan-cool female), close-miked, in unison. The two voices diverge by 50¢ on emotional words. ElevenLabs: "fight_human_rose_v1" + "fight_human_cyan_v1", combined in mix.
> **`agent_zero`** — Whispered female alto, hyper-controlled breath (3% wet breath layer), no reverb (close-mic register), occasional 60Hz mains-hum (4% — operator-radio coloration). ElevenLabs: "fight_agent_zero_v1".
> **`akai_shi`** — Light feline alto, slight fricative emphasis on S/SH consonants, soft delay (180ms feedback, 10% wet) so every line whispers itself once. ElevenLabs: "fight_akai_shi_v1".
> **`programmer`** — Daniel Cross — natural mid-baritone, normal Earth-American register, slight terminal-keyboard background bed (-36dB). ElevenLabs: "fight_programmer_v1".
> **`iron_lion`** — Powerful chest-resonant baritone, leonine roar accent on heavy lines, brass-bullhorn EQ, parade-ground reverb (1.2s tail, 22% wet on roar lines, 0% on speech). ElevenLabs: "fight_iron_lion_v1".
> **`source_kael`** — Layered male baritone — three takes pitched at 0¢, +700¢, -700¢ stacked at -2dB each (the chord-of-self), heavy distortion (16% drive), void-reverb tail (3.5s, 28% wet). ElevenLabs: "fight_source_kael_v1" + post-process pitch stack.
> **`game_master`** — Genteel mid-tenor with theatrical cadence, no reverb (parlor-register), occasional mechanical chess-clock-tick at -36dB under speech. ElevenLabs: "fight_game_master_v1".
> **`authority`** — Stentorian formal-court baritone, chamber reverb (1.8s tail, 26% wet), zero contractions, hyper-articulate. ElevenLabs: "fight_authority_v1".
> **`jailer`** — Cold monotone tenor, chain-jangle background (-28dB) under speech, dungeon-reverb (2.4s tail, 32% wet). ElevenLabs: "fight_jailer_v1".
> **`host`** — Choir-stacked alto + tenor + bass takes (3 simultaneous voices, in unison, panned hard L/C/R), consonants synchronized within 5ms. Reference: Gregorian-chant register applied to combat barks. ElevenLabs: "fight_host_choir_v1".
> **`engineer`** — Two profiles — "engineer_normal" (warm baritone) and "the_prince" (same speaker pitched +200¢, with a cathedral-tail, 1.8s, 20% wet). Engineer barks default to "the_prince" register; `defeat_line` only is "engineer_normal". ElevenLabs: 2 profiles.
> **`the_eyes`** — Whispered child-like soprano, 12 voices stacked (one per Eye), each panned to a different stereo position around the listener (use 12-channel ambisonic if available, else stereo with stochastic L/R distribution). ElevenLabs: "fight_eyes_swarm_v1" rendered 12× and mixed.

### 11.3 Stage ambient music + universal fight music

Per-stage music (15 stages):

> **`audio/fight/music/<stage_id>.mp3`** (2:30 loop, 256kbps stereo) — Suno 5.1: `<style + tempo + 4-bar core motif>`. Pre-baked 8s overlap loop-tail.
> - `new_babylon.mp3`: imperial-orchestra brass + Authority-choir, 88 BPM, A-minor, motif = 4-note descending fanfare.
> - `panopticon.mp3`: cold synth-pad + stochastic camera-clicks bed, 64 BPM, ambient (no clear key).
> - `thaloria.mp3`: monastic-choir + lonely cello, 52 BPM, D-minor, motif = single rising 5-note prayer figure.
> - `terminus.mp3`: distorted industrial bass + glitched-string drones, 120 BPM, dropped-D-tuning chaos, motif = 7-beat irregular pattern.
> - `mechronis.mp3`: industrial percussion + dark organ + brass, 96 BPM, B-minor, motif = mechanical rotation pattern.
> - `crucible.mp3`: war-drum percussion + brass swells, 132 BPM, E-minor, motif = battle-march call-and-response.
> - `blood_weave.mp3`: ritualistic drone + bone-flute, 60 BPM, F-sharp-minor, motif = single sustained tone with whispered overlay.
> - `shadow_sanctum.mp3`: arcane synth-pads + glass-bell percussion, 72 BPM, A-flat-minor, motif = 8-note rune-circle progression.
> - `ranked_table.mp3`: orchestral drama + electronic accent, 100 BPM, C-major, motif = rising-tournament fanfare.
> - `tournament_hall.mp3`: brass-celebration + processional drums, 120 BPM, D-major, motif = victory-march.
> - `draft_chamber.mp3`: contemplative piano + electronic strings, 80 BPM, E-minor, motif = thoughtful 4-bar phrase.
> - `watcher_panopticon.mp3` (boss): tension-building orchestra + relentless camera-click rhythm, 100 BPM, F-minor, motif = surveillance-stalking pattern.
> - `architect_throne.mp3` (boss): grand-imperial orchestra + fractal-electronic accents, 88 BPM, B-flat-minor, motif = architectural-scale 12-note theme.
> - `necromancer_castle.mp3` (boss): pipe-organ + ghostly choir + bone-percussion, 64 BPM, D-minor, motif = funeral-march variation.
> - `terminus_core.mp3` (boss): broken-orchestra + chaos-distortion + screams-of-the-corrupted (low-mix), 120 BPM, dropped-D, motif = collapsing-into-chaos progression.

Universal fight music (4 missing tracks):

> **`audio/fight/music/character_select.mp3`** (1:30 loop) — Suno: "energetic orchestral + electronic hybrid, 110 BPM, A-major, brass fanfare motif, 4-bar phrases, designed to loop at the character-select screen".
> **`audio/fight/music/training.mp3`** (3:00 loop) — Suno: "ambient meditative piano + light synth-pad, 60 BPM, C-major, designed to be present-not-distracting for repetitive practice".
> **`audio/fight/music/victory_screen.mp3`** (45s loop) — Suno: "triumphant brass-and-strings fanfare, 100 BPM, G-major, 4-bar repeating victory phrase".
> **`audio/fight/music/defeat_screen.mp3`** (45s loop) — Suno: "mournful-but-defiant low-strings + lonely horn, 70 BPM, F-minor, 4-bar reflective phrase".

Stage ambient loops (15 stages, room-tone beds that play UNDER the music):

> **`audio/fight/ambient/<stage_id>.ogg`** (15s seamless loop, mono) — Suno: `<atmospheric room-tone, no melody, no rhythm, just place>`.
> - `new_babylon`: distant city-crowd hush + stone-courtyard reverb + imperial-banner flap.
> - `panopticon`: ventilation hum + occasional camera-servo clicks + distant footsteps.
> - `thaloria`: high-altitude wind + faint-monastery-choir-drone.
> - `terminus`: void-rift-static + low-frequency dimensional-instability hum.
> - `mechronis`: industrial-piston-rhythm + steam-vent hiss.
> - `crucible`: lava-bubbling + crowd-roar-faint + brazier-crackle.
> - `blood_weave`: heart-beat-from-walls + dripping + ritualistic-low-chant.
> - `shadow_sanctum`: low-arcane-drone + whispered-runes-faint.
> - `ranked_table`: tournament-hall murmur + brass-tea-cup clinks (close-mic).
> - `tournament_hall`: cheering-crowd hush + banner-flap + occasional cheer.
> - `draft_chamber`: contemplative-quiet + holographic-card-drift.
> - `watcher_panopticon`: surveillance-iris-pulse + alarm-tone-faint.
> - `architect_throne`: fractal-cascade-hum + lattice-electrical.
> - `necromancer_castle`: foxfire-hiss + crypt-drip + distant-organ.
> - `terminus_core`: chaos-storm + corrupted-voice-fragments-faint.

> **Render + upload**:
> ```bash
> pnpm tsx apps/scripts/upload-public-to-s3.ts --prefix audio/fight/
> ```
> **Wire**: register slugs in `apps/client/src/game/fight/audio/audioRegistry.ts`.

---

## 12. Ark + Mechronis rooms × states

### 12.0 Render contract for room stills

- **Format**: WEBP, sRGB, **1920×1080** (16:9, the standard story-mode aspect). House style anchor: §1.1 + §1.2.
- **Asset prefix**: `art/rooms/<room_id>/<state_id>.webp`. The `state_id` defaults to `default` for single-state rooms.
- **Lighting register canon**: each room carries its register from §1.3 + the Living Ark filter system (`warm_elara`, `noir_human`, `yin_yang_flicker`, `silence_ambient`). Render the **default** state in `warm_elara` neutral; ship per-filter overlays as code (recolor LUTs in `apps/client/src/lib/livingArkFilter.ts`), not as separate stills — except where a state literally changes the geometry of the room (e.g. `engineering:beat_c_active` vs `engineering:act2_crafting_open`).
- **NPC presence**: NPCs are NEVER baked into room stills. NPCs render as overlay sprites/portraits at runtime. The room is the set; the cast performs on top.
- **In-world props**: every prop the design canon names in this room must be visible at the resolution it will read at on-screen. If a chart, a notebook, a diagram, a scroll, a medical readout is named in canon, **render it visibly at the wall position the canon implies**. Do not abstract.
- **Composition rule**: leave a clean center-stage column for character placement (in-game UI may overlay portraits/dialog). For LCS-background-eligible rooms (every Ark + Mechronis + Celebration + Guild + Casino + game-mode room is LCS-eligible), also render a **portrait variant** at 1024×2048 with character-zone composition per §17.B.

### 12.1 Ark interior rooms

#### `cryo_bay`

> **Default canon (state baseline)**: 12 cryo-pods in two rows of 6. Brass-and-bone railing worn smooth from millennia. Frost-glass canopies with six-point crystal formations. Cyan #22d3ee canopy-glow IFF vital-monitor holos. Charcoal composite walls with horizontal seams every 1.5m. Volumetric cryogas at ankle height. Emergency floor strips breath-pulse sub-1Hz. One holographic recording rig (dormant, plays Engineer's first log on trigger). Hierarchy of the Damned ritual marking carved between two pods on the back wall (Beat A discovery — must be visible at full-screen res, faint but present).
> **State `pre_awakening`** — All 12 pods sealed, occupant-shadow visible inside each canopy. Overhead lights off. Only emergency floor strips and pod-canopy cyan illumination active. Dust suspended in the cyan light shafts (slow-motion read). No cryogas pooling (canopies sealed). Compose deep, the back wall fading into shadow. Asset: `art/rooms/cryo_bay/pre_awakening.webp`.
> **State `beat_a_post_awakening`** — Player's pod (front-row, third-from-left) hatch raised 40°. Cryogas pooling at floor and drifting outward from the open canopy. Eleven other pods still sealed and glowing. Frost retreat visible on the open pod canopy (fractal-ice line withdrawing toward edges). Asset: `art/rooms/cryo_bay/beat_a_post_awakening.webp`.
> **State `act1_post_virus_cleared`** — Living Ark state: warm overhead lights have come up partially (bridge restoration cascading back to here). Frost-scar glitch overlay visible at the pod-canopy seams (Shadow Tongue's Beat A reveal lingers — render as a faint scanline-warp across the back wall, very subtle). Two pods now visibly empty (player's + Patch's), canopies retracted. Asset: `art/rooms/cryo_bay/act1_post_virus.webp`.
> **State `kael_pod_discovered`** — Camera-angle variant: tighter on Pod 7 (center-back row). Claw marks score the pod's interior glass (visible from outside as inverted scratches). EMP scorch on the lock mechanism, blackened edge. The pod is empty. Asset: `art/rooms/cryo_bay/kael_pod_discovered.webp`.

#### `corridor`

> **Default canon**: 15m corridor, slowly arcing right. Charcoal composite walls with horizontal seams every 1.5m. Brass-and-bone handrail worn bare to substrate. Two parallel emergency floor strips (one per wall, ankle-height). Three small auxiliary fixtures on right wall (handrail emergency lights). Cable conduits along upper-left and lower-right joins. Dust motes drifting through cyan light.
> **State `beat_a5_breath_beat`** — Cryogas residue trail at floor (faint white drift, ankle-height, trailing back toward cryo_bay). Both emergency strips pulse at sub-1Hz; capture the strip nearer the camera at peak brightness with a hot edge bleed. Asset: `art/rooms/corridor/beat_a5_breath.webp`.
> **State `beat_b_post_iris`** — End of corridor arc shows engineering bay door iris fully retracted, green standby pip glowing. Door mechanism still warm (subtle thermal-bloom around iris ring). Asset: `art/rooms/corridor/beat_b_iris_open.webp`.
> **State `act1_post_virus_cleared`** — Quarantine-door markers gone. Lights come up to normal (still cool, but readable). Becomes a transit space; render with very slight focal-blur on the back arc (suggesting the corridor extends further than before). Asset: `art/rooms/corridor/act1_post_virus.webp`.

#### `engineering`

> **Default canon**: Engineer's workbench (3m × 2m brass-obsidian) center-back. Tool racks above (loops, calipers, micro-welders, empty data-slate rows). Holographic recording rig wall-mounted above bench. Brass-and-bone deck box (hardcover-book size, latched) sitting center-bench. 6 incubator pods in 240° semicircle facing the bench (1.2m spacing, hip-high cylinders, brass-obsidian glass, dataplate at base of each).
> **State `beat_c_choice_active`** — All 6 incubator pods dormant, dark. Brass deck box latched-closed center-bench. Foxfire-green #00e676 standby indicator at bench knee-height. Light register: workbench warm-amber spotlight from above; rest of room cool-cyan emergency. Composition: deck box visually centered, pods radiating outward. Asset: `art/rooms/engineering/beat_c_choice.webp`.
> **State `act1_post_virus_workbench_used`** — Living Ark state: workbench shows micro-vibration wear marks, oil residue on tool rack, deck-box latch visibly handled. Engineer-bench warmth amplified — additional warm pool of light at the work-edge of the bench. Asset: `art/rooms/engineering/act1_workbench_used.webp`.
> **State `act2_crafting_open`** — Incubators running with faint hum (canopies internally lit cyan). Workbench hologram empty (UI overlays at runtime). Tool racks active (one tool slot empty — current job in progress). Asset: `art/rooms/engineering/act2_crafting_open.webp`.
> **State `engineer_scorched_array_revealed`** — One floor-panel removed near the back-left, exposing a scorched neural-array fragment (per EXPANSION_BIBLE.md §1.2). Burn-shadow halos out from the exposed substrate. Asset: `art/rooms/engineering/scorched_array.webp`.

#### `medical_bay`

> **Default canon**: Power converter panel back wall (3 sub-puzzle zones: coolant loop, signal bypass, power routing — render each as visible labeled sub-grids at panel-readable res). Patch's cryo pod back-right (slightly damaged, low-power indicator). Automated cloning pod center-stage (large glass-fronted chamber, dark when off). Transfer array wall-left (ambient stasis field, amber standby). Vital-monitor holos at the cloning pod and Patch's pod (variable per state). Wall-mounted medicine cabinet (sealed, holds Vox's Research Journal hidden behind it). Wall-mounted neural-rig with dangling sensor arrays.
> **State `beat_b_power_out`** — Converter panel dark, blown indicator on signal-bypass sub-zone (red flash). Patch's pod faint cyan heartbeat-glow only. Vital-monitor holos flickering Shadow Tongue text on life-support codes (the text **rewrites itself** in-frame — render as a still where the text is half-rewritten, characters mid-morph). Cloning pod unlit. Render: the room reads as "broken." Asset: `art/rooms/medical_bay/beat_b_power_out.webp`.
> **State `beat_b_post_outbreak_quarantine`** — Walls show "rearranging" virus-glitch (subtle geometric distortion on wall panels, like the virus is rewriting the room). Quarantine door visible at the side (sliding door with red-cross flash). Med-pod faint pulse. Neural-rig ambient amber glow. Asset: `art/rooms/medical_bay/beat_b_quarantine.webp`.
> **State `act1_post_virus_journal_discoverable`** — Power restored; vital-monitors stable; cloning pod lit-but-empty. Medicine cabinet door slightly ajar (player has discovered Vox's Research Journal — render the journal partially-visible inside the cabinet, leather-bound, hand-written page open). Lighting filter shifts toward Human's affinity (slightly cooler cyan with violet undertones). Asset: `art/rooms/medical_bay/act1_journal_discoverable.webp`.

#### `mess_hall`

> **Default canon**: Long composite dining tables (visible food-stains and 17k-year patina). Food dispensers wall-back (dark, non-functional). Personal-effects lockers wall-mounted (brass-bound, some with crew-name plates). Prince's notebook holographic rig wall-right. Ambient archive mood implied (warm amber, candlelit, distinct from cold-cyan elsewhere — but dormant by default).
> **State `beat_e_archive_active`** — Archive wall hologram active: sepia-toned flashback frame visible (film-damage overlay, diploma-bloom in the frame). Prince's notebook holo open on the table next to the rig. Room lighting fully shifted to warm amber (candle-lit aesthetic, almost shrine-like). One or two locker doors slightly open showing personal items (a folded uniform, a small pendant). Asset: `art/rooms/mess_hall/beat_e_archive_active.webp`.
> **State `beat_h_little_one_home`** — Domestic warmth: pet supplies visible at far table corner (small dish, soft-fabric blanket, makeshift crib if pet/egg survived). One locker bears a child's drawing taped to it (Little One's). Lighting still warm but more "lived-in" than archive. Asset: `art/rooms/mess_hall/beat_h_little_one_home.webp`.
> **State `act2_npc_hangout`** — Three navigator-slot touchpoints rendered as in-room objects per `livingArkTouchpoints.ts` (the table corner where Elara recently sat — chair pushed out, mug still warm; the locker Human keeps tools in — slightly open; the food dispenser Little One reprogrammed — small foxfire-green LED on it). NPCs are NOT in the still; their recent-presence is. Asset: `art/rooms/mess_hall/act2_npc_hangout.webp`.

#### `cargo_bay`

> **Default canon**: Trade-mission board (holographic, foxfire-green when active) center-back. Cargo lockers wall-mounted with transparent sections showing abstract trade-goods (don't detail individual items; lockers should read as inventory-suggestion). Dust shaft volumetric light-beam through ceiling access. Mission ticker display on the side wall.
> **State `beat_d_first_mission_board`** — Mission board glowing for first time. Locke's curated 3-mission list visible as floating holo-cards at board (each card shows a faction icon and a destination glyph; text is illegible by composition design). Dust shaft very prominent (the room is "showing itself" to the player for the first time). Asset: `art/rooms/cargo_bay/beat_d_first_board.webp`.
> **State `act1_post_virus_biohazard_revealed`** — A specific cargo crate (back-left, 4th from corner) is highlighted with a Sealed Crate warning glyph (Hierarchy biohazard sigil). Render the glyph at readable size. The crate itself is matte black, banded in red. The mission board still active. Asset: `art/rooms/cargo_bay/biohazard_revealed.webp`.
> **State `act2_trade_empire_active`** — Logistics manifests scattered on tables (small data-slates, illegible by composition). Cargo lockers more visibly stocked (shapes inside have more contrast). Mission board shows 5–6 active missions. Asset: `art/rooms/cargo_bay/act2_trade_active.webp`.

#### `briefing_room`

> **Default canon**: Wall-mounted lockbox (brass-bound, biometric-lock scanner with amber LED). Briefing table center (worn brass-composite, tactical map etched into surface — render the map as a faint acid-etch, recognizable as a stellar-region but readable as "tactical" not as specific stars). Dark formal seating around the table (one chair more worn than others — Kael's). Walls lined with obsolete tactical displays (dark holo-panels, long inactive). Stark, formal military aesthetic.
> **State `beat_f_memo_reveal`** — Lockbox bio-recognition scanner glowing amber-active. Data-slate holo rising from lockbox displaying Kael's Contingency Memo (the holo shows tactical diagrams + readable-as-text-but-actually-glyph content; do not render legible English in the still). Faint warm edge light catches the lockbox rim. Asset: `art/rooms/briefing_room/beat_f_memo.webp`.
> **State `beat_f5_breath_beat`** — Lockbox closed. The memo holo gone. Camera composition: Kael's empty chair at frame-center, rim-hot-edge light catching the wear-marks on the seat. The room has the silence of a sermon. Asset: `art/rooms/briefing_room/beat_f5_breath.webp`.
> **State `act2_war_room_active`** — Tactical displays come back online (8 wall-displays lit, each showing a faction-territory map at a quadrant of New Babylon, Thaloria, Mechronis, etc.). Asset: `art/rooms/briefing_room/act2_war_room.webp`.

#### `observation_deck`

> **Default canon**: Curved viewport (cleanest glass on the Ark, minimal dust, 17k-year micro-abrasion visible at glancing angles). Comfort seating worn-but-intact, arranged to face viewport. Manual polarization wheel brass-fitting wall-side, faintly glowing indicator. Starfield visible beyond.
> **State `act1_galaxy_lit`** — Sector map lit via galaxy-color-state code: render with the lit-state baseline (warm gold pinpoints across the void). Slight warm dust-drift INSIDE the room (ambient air motion catches in the viewport's reflected light). Asset: `art/rooms/observation_deck/galaxy_lit.webp`.
> **State `act3_galaxy_consumed`** — Galaxy view shows wide swaths of consumed (sickly purple corruption rendered as smear-stains across what was star territory). Comfort seating slightly dustier (player visits less often when the galaxy looks like this). Polarization wheel half-engaged (player has tried to dim it). Asset: `art/rooms/observation_deck/galaxy_consumed.webp`.
> **State `act5_galaxy_reclaimed`** — Galaxy view shows reclaimed regions (cyan + cream layered glow, layered Bridge of Kael shield-edge visible far beyond as a faint blue-white horizon line). Lighting fully restored. Asset: `art/rooms/observation_deck/galaxy_reclaimed.webp`.

#### `bridge`

> **Default canon**: Witnessing Hub hemispherical hologram-chamber center-stage (cyan scanline architecture, slow rotation). Galaxy map large holographic display front-of-room (dominant focus). Communication array wall-mounted, cyan status indicators. Pilot's chair brass-fitted, facing map, worn leather. Command terminals around the periphery (default dark). Primary light fixtures default cool-cyan.
> **State `pre_beat_i_offline`** — Bridge dark, locked-out. Witnessing Hub dormant (no scanlines). Galaxy map blank. Doors at corridor end visible as locked (red status). Asset: `art/rooms/bridge/pre_beat_i_offline.webp`.
> **State `beat_i_witnessing_hub_activation`** — Primary lights restoring in cascade (capture mid-restore: front three fixtures fully on, back three half-warmed-up). Witnessing Hub hemisphere blooming with cyan scanlines. Warm dust drift visible for first time. Galaxy map populating with sector-color overlay. Asset: `art/rooms/bridge/beat_i_witnessing_activation.webp`.
> **State `act2_home_base_warm_elara`** — Bridge fully lit. Galaxy map active with current faction-war zones. Community-vote tally bar visible above the map (translucent UI hints; abstract, not detailed). Living Ark filter `warm_elara` baked into the still (slight golden tint to the cyan light). Asset: `art/rooms/bridge/act2_home_base.webp`.
> **State `act3_galaxy_in_crisis`** — Galaxy map shows escalating Dark sectors. Some command terminals lit emergency-amber (warning panels). Witnessing Hub hemisphere has a slight glitchy flicker (the corruption is reaching here). Asset: `art/rooms/bridge/act3_in_crisis.webp`.
> **State `act5_reclamation_loop_endgame`** — Bridge composition expanded — Galaxy map dominates more wall-space, choice-archive holo-catalog visible at side wall, Light/Dark meter prominent overhead, slideshow-playback station stage-right. Asset: `art/rooms/bridge/act5_endgame.webp`.

#### `archives`

> **Default canon**: Central holographic pedestal (brass-and-obsidian, projection surface). Memory crystals floating around the pedestal pulsing amber. Log-projection rig wall-mounted (similar architecture to engineering/mess-hall rigs, capable of 8m+ continuous video playback). Wall-mounted document racks (showing past researcher notes, all displaying subtle scanline glitch). Permanent ambient archive mood: warm gold underscore from memory crystals, contrast to cold-cyan elsewhere.
> **State `beat_j_potential_origin_log5`** — Holographic Log 5 (full Engineer recording) actively projecting from pedestal. Last Words slideshow visible mid-Ken-Burns frame (one of 12 sepia frames captured). Memory-crystal pulse strong. Enigma hand-on-rim hologram visible (translucent silhouette, hand resting on pedestal rim, ethereal). Peripheral warm halo. Asset: `art/rooms/archives/beat_j_log5.webp`.
> **State `beat_j_choice_pillar_emerged`** — Choice pillar has emerged from the floor near the pedestal. Pillar visibly splits Light/Dark (left half cyan-cream, right half violet-static). The four button-glyphs (Forgive Both / Forgive Elara / Forgive Human / Forgive Neither) visible at pillar mid-height — render as glyphs not as text. Asset: `art/rooms/archives/beat_j_choice_pillar.webp`.
> **State `post_choice_forgive_both`** — Warm golden halo permanent. Memory-crystals pulse in synchrony. Document-rack scanline glitch reduced to almost zero. Asset: `art/rooms/archives/post_forgive_both.webp`.
> **State `post_choice_forgive_elara`** — Cyan scanline-softening pervades the room. Document racks gain a faint cyan halo at top-edge. Memory crystals pulse asymmetrically. Asset: `art/rooms/archives/post_forgive_elara.webp`.
> **State `post_choice_forgive_human`** — Subtle violet static overlay everywhere. Document racks gain a faint violet halo at bottom-edge. Memory-crystal pulse muted. Asset: `art/rooms/archives/post_forgive_human.webp`.
> **State `post_choice_forgive_neither`** — Silence-ambient filter. Lyra Vox substrate-voice presence implied via a faint static-ghost silhouette near the pedestal (like a person isn't quite there but you can almost see them). Document racks lit in stark white-on-black, scanlines extra-sharp. Asset: `art/rooms/archives/post_forgive_neither.webp`.

#### `comms_array`

> **Default canon**: NPC Inbox holographic envelope-system center. Signal-intake panel wall-mounted (live signal-bars indicator). Transmission array ceiling-mounted (multiple antenna-like probes, faint hum). Message counter glyph display.
> **State `beat_h_first_message`** — Inbox envelope unfolding mid-animation (capture the unfold mid-action — paper-edge in motion). Signal-intake panel glowing amber-active. Envelope edge-sentence bloom visible (text appearing character-by-character — render at the moment 8 characters are visible, the rest faded). Amber counter glyph showing "1 NEW" (as a glyph, not as English text). Asset: `art/rooms/comms_array/beat_h_first_msg.webp`.
> **State `beat_h5_memo_drift`** — One memo paper drifting in the room's air (visual silence). Inbox dormant. Signal-intake panel signal-bars at half-strength (signal weakening). Asset: `art/rooms/comms_array/beat_h5_memo_drift.webp`.
> **State `act3_yellow_coats_contact`** — Inbox active with Vex Solène / Agent Zero first-contact message: the envelope is yellow-edged (Yellow Coats sigil). Signal-intake at full-strength. Multiple incoming-signal indicators on transmission array. Asset: `art/rooms/comms_array/act3_yellow_coats.webp`.

#### `player_cabin`

> **Default canon (sparse)**: Cryo-recovery cot/bunk dark composite. Wall-mounted personal trophy shelf (initially empty). Companion-quarters alcove (initially empty). Wall-space for faction banners / companion art (initially empty). Pet incubator corner (initially empty if pet system not yet active).
> **State `pre_human_arrival`** — Sparse, monastic. Bunk made. Trophy shelf empty. No companion items. Lighting cool-warm-neutral. Asset: `art/rooms/player_cabin/pre_human.webp`.
> **State `beat_f_human_moves_in`** — Companion-quarters alcove has The Human's ambient presence: a stack of leather-bound books on a side-table; an open data-slate face-down; a folded jacket on a chair. The Human is NOT in the still; their things are. Asset: `art/rooms/player_cabin/human_moved_in.webp`.
> **State `act2_collected_lore_visible`** — Trophy shelf has 6–8 floating-holo lore cards. A faction banner hangs on one wall (player-choice — render the variant for the highest-bond faction at the time of authoring; ship Insurgency-orange as the default; alt variants in code). Asset: `art/rooms/player_cabin/act2_lore_visible.webp`.
> **State `act5_endgame_full`** — Pet dynasty portraits grow on wall (5–6 pet-portraits, simple painted style). Little One's drawings taped between portraits (crayon-style child-art). Trophy shelf full. Companion items more numerous. Lighting warm-personalized. Asset: `art/rooms/player_cabin/act5_endgame_full.webp`.

#### `pet_garden`

> **Default canon**: 6–8 incubator pods (smaller than engineering's, creature-scale). Wall-space for ancestor pet portraits. Feeding/care stations. Genesis-pod (primary, slightly larger than the others). Growing-wall (area for Little One's art).
> **State `pre_pet_system`** — Empty garden, dark incubators, minimal decoration. Asset: `art/rooms/pet_garden/pre_pet.webp`.
> **State `beat_e_first_egg`** — Genesis-pod active with cyan glow (egg inside, suggested by canopy contour). One incubator has soft warm light (preparation). Wall-space empty. Asset: `art/rooms/pet_garden/beat_e_first_egg.webp`.
> **State `act1_pet_kept_alive`** — Garden thrives. 4–5 incubators active. Genesis-pod retired (closed but warm). Wall has 2–3 simple pet portraits. Little One's first drawing visible. Asset: `art/rooms/pet_garden/pet_kept.webp`.
> **State `act1_pet_sacrificed`** — Genesis-pod scarred (burn marks, black residue baked into the canopy). Other incubators dark. Wall-space empty (Little One has taken her drawings down). Lighting cooler, mournful. Asset: `art/rooms/pet_garden/pet_sacrificed.webp`.
> **State `act3_pet_dynasty_thriving`** — 8 incubators all active. Wall fills with portraits + Little One's drawings (8–10 small artworks, child-art). Garden has plant-life now (mushroom-style growth, foxfire green tint). Asset: `art/rooms/pet_garden/act3_dynasty.webp`.

### 12.2 Mechronis Academy rooms

#### `mechronis_grand_hall`

> **Default canon**: Tiered stone-and-metal seating. Central lectern brass, worn from centuries. Holographic Mechronis academy insignia rotating slowly above lectern (indigo light). Reinforced windows showing mechanical gears + molten-metal rivers beyond. Dark polished stone floor, inlaid indigo light-strips. Worn central aisle from millennia of student passage. Industrial hum implied.
> **State `act1_flashback_active_lecture`** — Lectern active, lit warm-indigo. Tiered seating shows abstract student-shadow shapes (NPCs at runtime — render the seating empty in the still). Industrial gears beyond windows in mid-motion. Asset: `art/rooms/mechronis_grand_hall/act1_active_lecture.webp`.
> **State `act2_dream_archive`** — Lectern dormant. Hall reads museum-like (a velvet rope across the central aisle, suggesting "do not approach"). Insignia rotation slowed to half-speed. Lighting cooler. Asset: `art/rooms/mechronis_grand_hall/act2_archive.webp`.
> **State `act5_graduation_memory`** — Empty podium where Iron Lion should have stood (a single beam of light from above marks the empty spot). Distance figure of the Engineer visible at far back (rendered as silhouette only — runtime overlay not needed; the silhouette is part of the still by design). Asset: `art/rooms/mechronis_grand_hall/act5_graduation_memory.webp`.

#### `mechronis_classroom`

> **Default canon**: 12 student desks in a circle around central holographic display. Personal data terminals (one per desk, dark/inert). Specimen containment units (one per desk, empty but ominous). Central holographic display showing changing lesson content. Professor's desk at front (the only fixed object). Walls visibly shifting (subtle warp effect on wall-panels — render as a slight not-quite-perpendicular distortion). Red-inked grading tablet on Professor's desk.
> **State `act1_flashback_lesson`** — Central holo active, showing a lesson-content frame (specific lesson: render an anatomical-diagram-style holo of "soul anatomy" — the lesson the Engineer most-remembers). Professor's desk lit warm-amber. Walls' shifting-distortion subtle. Asset: `art/rooms/mechronis_classroom/act1_lesson.webp`.
> **State `act4_memory_corruption_intrusion`** — Walls shifting more violently (the distortion now visible as fault-line cracks across wall-panels). Central holo flickering between educational-content and Shadow-Tongue corrupted-glyph content. Specimen units lit red (alarm). Red-inked grading tablet visibly bleeding ink (literal, in-frame). Asset: `art/rooms/mechronis_classroom/act4_corruption.webp`.
> **State `act5_classroom_empty_memory`** — Desks empty. Central holo blank. Professor's desk dust-covered. Walls fully still (the distortion has ended; the room has accepted being a memory). Asset: `art/rooms/mechronis_classroom/act5_empty.webp`.

#### `mechronis_graduation_platform`

> **Default canon**: Raised industrial platform brass-and-steel. 12 marked spots for graduating students (one obviously empty — Iron Lion's, lit by overhead spot). Holographic Architect's seal floating above ceremony space (indigo + gold). Planetary shields visible as faint hexagonal grid in sky. Backdrop: massive mechanical gears turning slowly in far distance, molten-metal rivers flowing below platform. Smoke stacks and energy conduits.
> **State `act2_flashback_ceremony_in_progress`** — 11 abstract graduating-student silhouettes at attention (render as silhouettes only; runtime sprites overlay if needed). Iron Lion's empty spot front-and-center, lit by overhead beam. Architect's seal active. Mood: solemn formal. Asset: `art/rooms/mechronis_graduation_platform/act2_ceremony.webp`.
> **State `act5_post_ceremony_reflection`** — Platform empty. Architect's seal dormant. Wind across the platform implied (subtle dust movement on stone). Engineer's silhouette at platform-edge looking away (toward Iron Lion's implied direction). Asset: `art/rooms/mechronis_graduation_platform/act5_reflection.webp`.

### 12.3 Celebration Campus rooms

#### `celebration_grand_orientation`

> **Default canon**: Auditorium with tiered seating (capacity ~120, but render abstract). Governance Hub holo-display front (large hemispherical, similar to Bridge's Witnessing Hub but at smaller scale and indigo-lit, not cyan). Cool indigo institutional lighting. Subtle implied surveillance: small camera-orbs at ceiling corners (Mechronis influence — render as 4 visible orb fixtures).
> **State `beat_c5_orientation`** — Governance Hub active with holographic-introduction content (abstract House-sigil rotation). Auditorium empty (NPCs runtime). Asset: `art/rooms/celebration_grand_orientation/beat_c5.webp`.

#### `celebration_house_common_room`

> **Default canon**: Communal warm tables. Lounges. Notice boards (handwritten-style notes pinned, illegible by design — texture, not text). House-sigil banner on back wall. Warm fireplace-substitute glow at one corner (light source, no actual fire — use foxfire-green or warm-amber depending on house affiliation).
> **State `default_warm`** — House-Insignia banner reads as **player-house-affiliation**: ship 6 banner variants (one per Mechronis house — Resonance, Umbra, Ironflight, plus 3 expansion houses). Common rooms render same composition with banner-swap as the runtime overlay. Asset: `art/rooms/celebration_house_common/default_warm.webp` (with banner-overlay layer at `art/rooms/celebration_house_common/banner_<house>.png`).

#### `celebration_chess_classroom`

> **Default canon**: Giant playable chessboard (visible at frame-center). 32 chess pieces in starting position (rendered as 3D models, glowing bases). Strategic holo-display wall-mounted (move-suggestions area). Player + opponent chair flanking board. Zephyr-9 hologram emergence-rig wall-mounted (dormant by default).
> **State `beat_d_tutorial_zephyr_active`** — Zephyr-9 hologram present (cyan scanline form, clean professional silhouette). Holo-display showing piece-movement rules. Pieces in starting position. Asset: `art/rooms/celebration_chess_classroom/beat_d_tutorial.webp`.
> **State `act1_standard_play`** — Zephyr-9 dormant. Pieces mid-game (capture a representative position — center-board contested, pawns advanced asymmetrically). Holo-display showing position-analysis abstract (heat-map style). Asset: `art/rooms/celebration_chess_classroom/act1_standard.webp`.
> **State `act3_mastery_register`** — Position complex (high-level mid-game). Holo-display shows probability-heat-maps + opening-diagram overlays + Mechronis-style strategic notation. Pieces have very subtle gold-leaf rim-light (mastery achieved). Asset: `art/rooms/celebration_chess_classroom/act3_mastery.webp`.

#### `celebration_laboratory`

> **Default canon**: Crafting stations (alchemical aesthetic). Ingredient storage shelving (jars + flasks + crystal-canisters at varied translucencies). Central work-table. Holographic recipe-display wall-mounted.
> **State `default`** — Active workspace, one in-progress experiment center-table (a brass alembic with pale-violet liquid bubbling slowly). Asset: `art/rooms/celebration_laboratory/default.webp`.

#### `celebration_training_grounds`

> **Default canon**: Practice dummies (3 visible, sculpted humanoid wooden-mannequin style). Holo-enemy emitters at perimeter (4 small floor-disc fixtures, each capable of projecting a ghosted holographic combatant). Padded sparring floor with sigil-circle inlay.
> **State `default_dormant`** — Dummies still. Emitters dark. Asset: `art/rooms/celebration_training_grounds/dormant.webp`.
> **State `act1_active_simulation`** — One dummy mid-strike (slight motion-blur captured in still). Two holo-enemies projected (cyan, translucent, mid-attack pose). Sigil-circle pulsing. Asset: `art/rooms/celebration_training_grounds/active_sim.webp`.

#### `celebration_library`

> **Default canon**: Floor-to-ceiling shelves. Reading tables. Knowledge-scroll holos floating at table-top (small, illegible-by-design). Warm reading-lamp at each table.
> **State `default`** — Active study room. Several scrolls open. One central holo-orb glowing softly with a "today's lesson" content. Asset: `art/rooms/celebration_library/default.webp`.

#### `celebration_tribunal_chamber`

> **Default canon**: Judge's podium back-center (raised). Defendant + accuser positions facing podium. Voting hologram floating above podium (12-bar abstract vote-display, no values). Cool austere lighting.
> **State `default`** — Empty chamber. Voting hologram dormant. Asset: `art/rooms/celebration_tribunal_chamber/default.webp`.
> **State `apprentice_aftermath`** — Empty accuser chair. Solemn mood (lighting cooler, dimmer). Voting hologram still dormant. A single white flower on the defendant podium. Asset: `art/rooms/celebration_tribunal_chamber/apprentice_aftermath.webp`.

> **Render + upload §12 in one batch**:
> ```bash
> pnpm tsx apps/scripts/upload-public-to-s3.ts --prefix art/rooms/
> ```
> **Wire**: register slugs in `apps/client/src/lib/roomMediaPrompts.ts` (existing) — extend the registry's `<room_id>` keys to include the `<state_id>` suffix variants. Living Ark filter overlays remain code-side in `apps/client/src/lib/livingArkFilter.ts`.

---

## 13. Guild common rooms + casino + game-mode environments

### 13.1 Guild common rooms × 5 universal states

Each of the 12 Archon Guilds has a common-room with a distinctive palette,
key-prop set, and mood register. Render each guild-room in **5 universal
states** (60 stills total).

#### 13.1.0 Universal state matrix (applied to every guild)

> **State `daily_idle`** — Scattered guild-member touchpoints (chairs pushed-out, mugs on tables, datapads open at low-angle); no NPCs in the still. Lighting at the guild's "neutral" register. Ambient suggestion: hum, low conversation, no event. Asset: `art/rooms/guild_<guild_id>/daily_idle.webp`.
> **State `assembly_meeting`** — Furniture realigned for formal gathering: seating in concentric rings or rows facing the guild's central focal element. Lighting concentrated at center. Empty floor (NPCs runtime). Asset: `art/rooms/guild_<guild_id>/assembly.webp`.
> **State `victory_celebration`** — Guild colors brightened. Decorations appear (sigil-banners, holo-confetti, congratulatory floating-trophies near central focus). Lighting warmer. Decoration asset: `art/rooms/guild_<guild_id>/victory.webp`.
> **State `defeat_mourning`** — Decorations removed or dimmed. Lighting cooler / lower. Drapery in the guild's mourning-color (per the table below) replaces banners. Single empty central seat for the lost member. Asset: `art/rooms/guild_<guild_id>/mourning.webp`.
> **State `broadcast_moment`** — Room oriented toward the central screen / focal element. All seating faces the focus. Faint silhouette suggestion of attentive members (NPCs runtime). Lighting dimmed except for the focal element which is fully active. Asset: `art/rooms/guild_<guild_id>/broadcast.webp`.

#### 13.1.1 Per-guild canon (12 rooms)

| Guild | Visual register | Palette anchors | Central focal element | Wall + floor signature props | Mourning color |
|---|---|---|---|---|---|
| `conexus` | Vast amphitheater with concentric tiered seating; cyan light-webs flowing between member-node markers along walls. | Cyan #22d3ee, brass, ivory | Central holographic display showing the guild's connected-network status | Light-web network visualization across walls; member-status boards above each tier | Pearl-cream |
| `watcher` | Surveillance-control room aesthetic. Multiple wall screens show angles of shared spaces. | Watcher amber #fbbf24, charcoal, cyan camera-glow | Wall of 16 monitor screens | High-backed observer chairs facing wall; data-scrolls listing observed events at each chair | Charcoal-black |
| `collector` | Museum-library hybrid. Hushed reverence. Curated exhibition. | Brass, deep mahogany, ivory | Central glass display case (rotating featured-artifact pedestal) | Glass-fronted shelving lined with relic cases; reading nooks at perimeter; cataloging terminals at side wall | Ivory |
| `vortex` | Impossible-geometry room. Translucent walls suggest other spaces beyond. Corners don't quite meet. | Royal purple, void-black, silver | Floating central portal-disc (always partially open) | Disorienting wall-angles; portal-door silhouettes at multiple positions; floor with shifting tile-patterns | Silver |
| `meme` | Broadcast studio merged with social space. High-energy. Aesthetic-forward. | Magenta #e040fb, electric cyan, gold | Central broadcast-display showing live trending content (abstract motion bars + signal-graphs) | Recording rigs at perimeter; aesthetic-transformation booths; large social-media-style interface overlays at walls | Black-and-white |
| `warlord` | Military barracks + war-room. Tactical maps cover walls. | Insurgency orange, tactical black, brass | Central briefing table with 3D holographic battlefield (current campaign) | Wall-mounted weapons racks; status boards listing field deployments; communication terminals at side; one wall-mounted lion-banner | Iron-grey |
| `politician` | Parliamentary chamber. Tiered debate seating. Procedural. | Royal blue, gold, deep cream | Central debate podium under chandelier | Tiered seating in horseshoe; voting-bell (ceiling-mounted); record-ledger walls; gavel-podium at front | Slate-grey |
| `warden` | Containment facility aesthetic applied to social. Cells with transparent barriers in circle. Central control booth elevated. | Steel-grey, amber alert, ivory | Elevated central control booth | Transparent-barrier cell rings; key-ring trophy displays on walls; access-control panels; cell-status indicators at every cell | Ash-white |
| `game_master` | Casino-parlor. Multiple game-tables. Trophy-piece displays. | Deep green felt, gold, mahogany | Central game-master's table (always set with cards + dice + chess pieces) | Multiple gaming tables at perimeter; trophy-piece displays on walls (each piece a moment-of-play); holographic scoreboards | Deep mahogany |
| `necromancer` | Botanical-magical garden + medical lab. Specimen displays. Ritual altars. | Bone-cream, foxfire-green, blood-red | Central ritual altar with specimen-jar centerpiece | Specimen cases lining one wall; cultivation vats opposite; ritual altars at corners; carefully tended gardens at perimeter (foxfire-glow plants) | Black with red trim |
| `engineer` | Functional workshop repurposed. Workbenches. Tool racks. | Brass, charcoal, warm-amber | Central collaborative workbench (always with an in-progress device on it) | Multiple workbenches at perimeter (each with different specialization); tool racks above; materials-storage at side wall; completed-project display shelf along one wall | Brass-tarnish |
| `human` | Scholar's library + interrogation chamber. Floor-to-ceiling books. Single central desk under spotlight. | Rose-warm + cyan-cool overlay, mahogany, ivory | Central research desk under single overhead beam (The Human's chair, only seat with armrests, faces the door) | Floor-to-ceiling bookshelves on all walls; solitary reading nooks at corners; writing-implements on desk; research journals stacked | Slate-purple |

> **Per-guild authoring template** (apply to each of the 12 with the row above):
> > **Canon visual** (carry into every state): `<row visual-register>`. Palette: `<row palette>`. Focal element: `<row focal>`. Wall+floor props: `<row wall+floor>`. House style §1.1, lighting register §1.3 → `<map register to mood: amphitheater = stage-spot, surveillance = camera-amber, museum = gallery-spot, etc.>`. No on-image text.
> > Render the 5 universal states above for each `<guild_id>`.

#### 13.1.2 Holiday + faction-war overlays

> **Christmas-in-July overlay** — A swap-in tinsel-and-lights variant for **6 guilds** (conexus, meme, game_master, necromancer, engineer, human — the guilds whose registers tolerate festivity). Add wreath-circlets at the focal element; tinsel along seating edges; one floating holo-snowflake at upper-screen-center. Asset: `art/rooms/guild_<guild_id>/christmas_in_july.webp`.
> **Faction-war active overlay** — A swap-in for **all 12 guilds**: a holographic war-status banner appears above the focal element showing the guild's current campaign-stake. Asset: `art/rooms/guild_<guild_id>/faction_war_active.webp`.

That's **60 universal-state stills + 6 christmas + 12 faction-war = 78
guild-room renders**.

### 13.2 Casino rooms × 3 states

#### `casino_main_floor`

> **Default canon (per CASINO_EXPANSION_ART_BIBLE.md §CF-001)**: Obsidian-black glass gaming tables in organic clusters (each lit by a hovering amber light-source). Slot machines along walls (soft golden glow + holographic spinning symbols). Void-energy particle motes (golden fireflies in zero-gravity aesthetic). Probability-distortion shimmer around high-stakes tables. Bar at far wall (backlit bottles in luminescent impossible colors). Progressive jackpot display wall-mounted (enormous holographic number). The Degen's personal table center-stage (obsidian + gold inlay, private force-field bubble). Massive curved viewport showing Ne-Yon space (swirling probability clouds in purple + gold).
> **State `quiet`** — 4–5 tables active out of 20. The Degen's table active (single drink resting). Bar dim. Particle motes few. Lighting subdued. Asset: `art/rooms/casino_main_floor/quiet.webp`.
> **State `high_stakes_event`** — All tables active. The Degen's table with multiple drinks + chips + a single dramatic-lit chair across from him. Bar fully active. Particle motes abundant. Probability shimmer intense at high-stakes tables. Music-tempo energy implied (no rendered music — just the visual energy). Asset: `art/rooms/casino_main_floor/high_stakes.webp`.
> **State `post_major_loss`** — Tables half-empty. Drinks abandoned. The Degen's table glowing brighter (predatory). Bar dimmer. Lighting tense. Particle motes drift in slow-motion. Asset: `art/rooms/casino_main_floor/post_loss.webp`.

#### `casino_vip_lounge`

> **Default canon (§CF-005)**: 3 private gaming tables in semi-transparent amber force-field bubbles. The Degen's personal table central (obsidian + gold inlay). Dark leather seating (appears to breathe). Trophy case wall-mounted (artifacts: senator's sigil, Warlord general's insignia, Archon's crystallized wager — each illuminated by a golden spotlight + plaque). Living void wall (dark matter undulating, occasional translucent windows show frozen-battle / senate-chamber / singing-children-in-darkness). Bar stocked with bottled starlight. Compressed-entropy ceiling (dark mirror reflecting probability-of-winning, not literal mirror images). Golden veins in floor.
> **State `inaccessible_pre_vip4`** — Viewed from outside (camera looking in through glass). Lounge dimly lit (off-hours). Trophy case glints in distant spotlights. The Degen's table empty. Asset: `art/rooms/casino_vip_lounge/locked.webp`.
> **State `accessible_vip4_active`** — Camera inside lounge. All 3 private tables active (force-field bubbles full). The Degen at his personal table dealing. Trophy case fully lit. Living void wall undulating, one translucent window-of-other-space visible. Compressed-entropy ceiling reflecting subtle probability-shapes. Asset: `art/rooms/casino_vip_lounge/active.webp`.
> **State `final_ante_endgame`** — Only The Degen's central table active. Other tables retracted into floor. Lounge claustrophobic and intimate. Void-walls undulating intensely (multiple windows-of-future-states visible — render them as faint translucent overlays at corners of the back wall). Asset: `art/rooms/casino_vip_lounge/final_ante.webp`.

#### `casino_void_bingo_hall`

> **Default canon (§CF-007)**: Circular communal tables (6-player capacity each, 8 visible). The Degen's podium raised stage at front. Holographic lottery sphere on stage (orbs inscribed with lore-event names spinning inside). 2 large side-display screens flanking podium (animated lore-vignette playback). Complimentary anti-gravity drink-trays floating between tables. Decorative banners hanging from void-ceiling (past Bingo champions' names). Warm amber lighting (softer than rest of casino).
> **State `active_session`** — Tables full of players (NPCs runtime; render the bingo-grid holos floating above each table at moments-mid-call — render specific event-glyphs on each grid). The Degen at podium gesturing. Lottery sphere mid-spin. Side displays mid-vignette. Drink-trays moving. Asset: `art/rooms/casino_void_bingo_hall/active.webp`.
> **State `between_sessions`** — Tables empty. Stage lights off. Lottery sphere dormant. Side displays off. Drink-trays parked at the bar. Lighting dim, eerie-after-hours feel. Asset: `art/rooms/casino_void_bingo_hall/between.webp`.
> **State `championship_finale`** — One central table only (others retracted). Stage lights brightest. Lottery sphere paused on a single glowing winning-orb. Side displays both showing the winning event-vignette. Asset: `art/rooms/casino_void_bingo_hall/championship.webp`.

#### `casino_dream_roulette_chamber`

> **Default canon (§CF-008)**: 6 high-backed dark thrones in a perfect circle. Central void-charge device (revolver-cylinder merged with void-energy reactor; 6 visible chambers, one glowing unstable magenta). Trapdoor outlines beneath each throne (purely decorative). Holographic pot display ceiling-center (showing accumulated ante). Dark-mirror walls reflecting infinitely (kaleidoscope effect). Harsh downward spotlight per throne. Coldest room in casino.
> **State `pre_game_empty`** — Chamber empty. Device dormant (no chamber glowing). Spots off. Pot display dark. Asset: `art/rooms/casino_dream_roulette/pre_game.webp`.
> **State `active_player_turn`** — Device rotating slowly (mid-rotation captured). One chamber glowing unstable magenta. Spots active per throne (6 spots harsh on each). Pot display showing accumulated value (abstract numerals — not legible English). The Degen visible at raised observation booth (silhouette only, watching). Asset: `art/rooms/casino_dream_roulette/active_turn.webp`.
> **State `aftermath_survivor`** — One throne occupied (camera centered on the survivor's chair, occupant runtime). Other 5 thrones empty + slightly disturbed. Trapdoor outlines now lit faintly red (one or more triggered). Device dormant. Asset: `art/rooms/casino_dream_roulette/aftermath.webp`.

#### `casino_christmas_in_july_floor`

> **Default canon**: Casino main-floor with full Christmas-in-July overlay. Holiday-banners draped over slot machines. Wreath-trim on tables. Tinsel along bar. A holographic snow-flurry drifting through the room (set apart from gameplay particles). Holiday-music implied (in-room speakers visible).
> **State `default_active`** — 8–10 tables active. Holiday décor rich. Bar busy. Asset: `art/rooms/casino_christmas_in_july/active.webp`.
> **State `gift_drop_event`** — Holographic Christmas-tree at center spinning slowly, dispensing prize-glyphs to tables. Crowd-density implied higher than baseline. Asset: `art/rooms/casino_christmas_in_july/gift_drop.webp`.

### 13.3 Game-mode environments (non-fight, non-casino)

#### `collectors_arena`

> **Default canon**: Central duel circle (marked floor, dark composite with amber light-strips). Opposite player platform (raised, spotlight-illuminated). DNA-harvesting field generators at perimeter (6, amber when active). Tournament bracket display wall-mounted (holographic, shows elimination progress as glyph-icons not text). Crowd stands implied (shadowed, beyond the spotlight ring). Genetic archive display at side wall (showing harvested DNA tier-trophies: bronze, silver, gold, platinum).
> **State `standard`** — Spots from above (warm-white). DNA-fields active. Bracket display populated mid-tournament. Genetic archive lit. Asset: `art/rooms/collectors_arena/standard.webp`.
> **State `engineer_battle_act1_indigo`** — Same composition, lighting tinted indigo (Mechronis echo). Bracket display showing Engineer's bracket-position highlighted. Asset: `art/rooms/collectors_arena/engineer_indigo.webp`.
> **State `kael_revenge_act3_red_corruption`** — Lighting flickers red (corrupted state). DNA-fields render with a sickly green-red gradient (corruption bleeds in). Bracket display glitches partially. Asset: `art/rooms/collectors_arena/kael_corruption.webp`.
> **State `degen_act4_5_void_bleeding`** — Spots dim. Void-space visible beyond the perimeter (the arena-walls fade into Ne-Yon space). Probability shimmer at the perimeter of the duel circle. Asset: `art/rooms/collectors_arena/degen_void_bleeding.webp`.

#### `dead_mans_circuit_track`

> **Default canon**: Multi-lap neon-lit racing track under dark sky. Holographic lane markers in player-faction colors. Crowd-shadows at track edges (blurred). Other racer karts as competitive AI silhouettes. Spectator stands, holographic lap-counter and position-display HUD (UI overlay; not in still).
> **State `standard_race_active`** — Track fully lit. Lane markers in default cyan. Other racer-karts visible at varied positions on track. Spectator stands implied. Hazards at expected positions (oil spills, debris). Asset: `art/rooms/dmc_track/standard.webp`.
> **State `memory_race_act4_5_identity_chain`** — Track flickers between past and future states (overlay distortion: faint transparent past-track superimposed at slight offset). Competitor-models occasionally swap silhouettes (render multiple ghosted-silhouettes at one position to suggest the identity-flicker). Profoundly disorienting. Asset: `art/rooms/dmc_track/memory_race.webp`.

#### `tower_defense_arena`

> **Default canon**: Sigil-grid floor (player tower-placement zones marked as glowing tiles). Wave-spawn portal at far end (large stone arch with dormant portal-shimmer). Defense-tower placement zones (raised platforms at various positions). Wave-counter display wall-mounted. Resources-meter at side.
> **State `pre_wave`** — Portal dormant. Tile-grid lit cyan-cool. Tower zones empty (or with a few placed towers — render 2–3 towers placed by way of suggesting active gameplay). Asset: `art/rooms/tower_defense_arena/pre_wave.webp`.
> **State `wave_active`** — Portal flaring (mid-spawn). Towers visible (4–6 placed). Some wave enemies visible mid-screen (silhouettes; runtime sprites for live enemies). Resources-meter mid-spend. Asset: `art/rooms/tower_defense_arena/wave_active.webp`.
> **State `wave_complete_victory`** — Portal extinguished. Towers visible. Confetti-glyph-rain falling (cyan + brass). Resources-meter overflowing-glow. Asset: `art/rooms/tower_defense_arena/wave_complete.webp`.

#### `vortex_incursion_chamber`

> **Default canon**: Spherical chamber with void-rift suspended center. Concentric ring-platforms around the rift (player approaches inward through them). Rift-stabilizer pillars at cardinal positions (4 visible). Status-displays at perimeter showing rift-stability (abstract gauges). Lighting cool-violet (deep void-color baseline).
> **State `pre_incursion`** — Rift contained, stable. Stabilizer pillars steady amber-glow. Status-displays balanced. Asset: `art/rooms/vortex_incursion_chamber/pre.webp`.
> **State `incursion_active`** — Rift expanded, unstable (lattice cracks visible at the rift surface). Stabilizer pillars flickering. Status-displays alarmed (red across most gauges). Lighting strobes violet-red. Asset: `art/rooms/vortex_incursion_chamber/active.webp`.
> **State `incursion_sealed`** — Rift collapsed to a single point. Stabilizer pillars returned to amber. Status-displays balanced. Subtle scarring visible on the floor (rift left a permanent ring-imprint). Asset: `art/rooms/vortex_incursion_chamber/sealed.webp`.

#### `witnessing_hub_bridge_console`

> **Default canon (§5 endgame)**: Bridge-console expanded for endgame. Galaxy-map dominant on wall. Real-time faction-war visualization. Choice-archive interface side-wall. Light/Dark meter prominently overhead. Slideshow-playback station stage-right. Community-statistics display at side.
> **State `endgame_active_warm`** — Galaxy-map showing humanity-dominated state (warm gold pinpoints heavy). Light meter heavy-toward-light. Lighting warm. Asset: `art/rooms/witnessing_hub_bridge/endgame_warm.webp`.
> **State `endgame_active_cold`** — Galaxy-map showing machine-dominated (cold violet pinpoints heavy). Light meter heavy-toward-dark. Lighting cool-violet. Asset: `art/rooms/witnessing_hub_bridge/endgame_cold.webp`.
> **State `reclamation_loop_silence_path`** — All lights at quarter-strength. Galaxy-map showing reclaimed-but-silenced state (no faction colors, just neutral cream). Slideshow-playback station has a single Lyra Vox audio-waveform displayed. Asset: `art/rooms/witnessing_hub_bridge/silence_path.webp`.

> **Render + upload §13 in one batch**:
> ```bash
> pnpm tsx apps/scripts/upload-public-to-s3.ts --prefix art/rooms/
> ```

---

## 14. Trade Empire sectors × prosperity states

### 14.0 Render contract

- **Format**: WEBP, sRGB, 1920×1080. House style §1.1, palette anchors §1.2.
- **Asset prefix**: `art/sectors/<sector_id>/<prosperity_state>.webp`. The "default" 1920×1080 render is the **lit** state.
- **Cross-reference**: the named-sector base palettes are already authored in `apps/shared/tradeEmpireArtPrompts.ts` (the SECTOR_PAINTING export). Carry those palettes verbatim into the prosperity-state variants. Do NOT re-paint the named sectors from scratch.
- **NPC density**: workers / merchants / soldiers vary by prosperity. Render at the densities below as small silhouettes — runtime sprite-overlays NOT used for sectors.

### 14.1 Universal prosperity-state matrix

The same 5 prosperity states apply to **every** sector. Each state shifts
lighting, decay, density, and faction-presence consistently across sector
types.

> **`lit` — community prosperous**
> - Lighting: bright, key-light at golden-hour angle from camera-left.
> - Worker / merchant density: visibly active, ~30–40 silhouettes appropriate to sector.
> - Construction: scaffolding visible at one sector landmark (always-improving).
> - Energy output: high — visible holographic meter on the central infrastructure.
> - Faction presence: player-aligned banners or none.
> **`dimming` — decline visible**
> - Lighting: amber-shifted, sun lower, harsher shadows.
> - Worker density: ~10–15 silhouettes, sporadic.
> - Construction: scaffolding abandoned, materials in stacks.
> - Energy: flickers — meter bouncing around half-strength.
> - Faction presence: contested — render small clusters of unidentified armed figures at 2–3 perimeter points.
> **`dark` — AI Empire control**
> - Lighting: red emergency-strip dominant, key-light killed; everything backlit by red security floods.
> - Worker density: ~5 silhouettes, bowed posture, oppression implied.
> - Construction: nothing — only enforcement gantries; barbed-wire equivalents.
> - Energy: forced-high (wired into Empire's grid) — meter pinned, but the sector itself has no warm-light internally.
> - Faction presence: AI Empire enforcers visible at every entrance / chokepoint (~6 silhouettes total). The Architect's seal / Authority sigil prominently displayed.
> **`consumed` — Thought Virus**
> - Lighting: sickly purple corruption tint over everything; void-static at the screen edges.
> - Worker density: ~3 silhouettes, glitched/infected (render with subtle visual-distortion artifacts at their outlines).
> - Construction: decaying — sector landmarks crumbling; void-space bleeding through cracks in walls / hull / sky.
> - Energy: erratic — meter in chaos / NaN-glyph display.
> - Faction presence: none recognizable; the corruption itself is the controlling presence.
> **`reclaimed` — player victory**
> - Lighting: returns to lit-like brightness but with subtle cyan-cream undertone (Bridge of Kael shield color).
> - Worker density: ~30 silhouettes, restored, posture upright.
> - Construction: rebuilding — scaffolding new, materials fresh, banners-of-hope.
> - Energy: high — meter glowing cyan-cream.
> - Faction presence: player-faction banners + a single cyan-cream Bridge-of-Kael memorial-statue at the central plaza.

### 14.2 Sector-type catalog

Each base sector type carries its own focal element + worker density logic. Compose the universal-state matrix per sector type.

#### `space_port`
> **Focal**: docking bays with cargo loaders. Merchant vessels moored at quays. Trading-post buildings in mid-distance. Asset: `art/sectors/space_port/<state>.webp`.

#### `mining_colony`
> **Focal**: excavation equipment + ore-storage silos. Worker settlements at sector edge. Mineral-deposit holograms floating above the dig-site. Asset: `art/sectors/mining_colony/<state>.webp`.

#### `research_station`
> **Focal**: laboratory domes (transparent-glass at lit, opaque at dark). Data-transmission arrays at perimeter. Scientific equipment fields. Asset: `art/sectors/research_station/<state>.webp`.

#### `agricultural_world`
> **Focal**: crop fields (or hydroponic gardens if space-based). Silos. Harvest machinery. Settler communities at field-edges. Asset: `art/sectors/agricultural_world/<state>.webp`.

#### `manufacturing_hub`
> **Focal**: industrial factories with assembly lines visible. Robotic-worker clusters. Product-storage warehouses. Smoke-stacks (output color shifts with prosperity — clean cyan when lit, choking gray when dark). Asset: `art/sectors/manufacturing_hub/<state>.webp`.

#### `trade_nexus`
> **Focal**: central marketplace. Holographic price-boards. Merchant convoys arriving / departing at perimeter. Asset: `art/sectors/trade_nexus/<state>.webp`.

### 14.3 Named sector palettes (carried from `tradeEmpireArtPrompts.ts`)

Each named sector below = one base sector-type rendered in **all 5 prosperity states**. Carry the palette anchors verbatim.

| Sector id | Base type | Palette | Lit-state special note |
|---|---|---|---|
| `sector_trade_nexus` | trade_nexus | Authority red, brass, deep city-blue | Hub-of-hubs; render slightly larger central marketplace than other trade_nexus instances |
| `sector_new_babylon_core` | trade_nexus | Deep indigo, Authority red, window-gold | Capital prominence; render Authority sigil prominently |
| `sector_new_babylon_lower_tiers` | manufacturing_hub | Soot-black, rust, neon-cyan puddle-reflection | Underclass register; rain-soaked surfaces |
| `sector_empire_frontier` | space_port | Bone-white, red-black trim, cold grey sky | Edge-of-empire; sparse infrastructure |
| `sector_forge_worlds` | manufacturing_hub | Forge-orange, char-black, one thin cold cyan orbital ring | Volcanic-industry; lava channels visible |
| `sector_thaloria_outskirts` | agricultural_world | Pearl-cream, deep-slate, amber morning-light | Faith-based; prayer-glyphs at field edges |
| `sector_mechronis_periphery` | research_station | Indigo, brass, matte black industrial | Academy-adjacent; lecture-platform terraces |
| `sector_ne_yon_periphery` | space_port | Royal purple, void-black, blood-orange | Void-leakage at perimeter; the Casino is implied at far horizon |
| `sector_kael_pocket` | mining_colony | Ember-orange, charcoal, blood-red | Insurgency-lineage; banners of Iron-Lion's army at workers' camps |
| `sector_terminus_edge` | space_port | Void-black, royal purple, blood-orange interior-rift glow | Closest to a void-rift; permanent corruption at perimeter |

That's **10 named sectors × 5 prosperity states = 50 sector renders**.

> **Render + upload §14**:
> ```bash
> pnpm tsx apps/scripts/upload-public-to-s3.ts --prefix art/sectors/
> ```
> **Wire**: extend `apps/shared/tradeEmpireArtPrompts.ts`'s SECTOR_PAINTING export with `<state>` keyed entries. Live-Light-Dark meter selects the matching state at runtime in `apps/client/src/game/TradeEmpirePage.tsx`.

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
