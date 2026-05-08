# Guild System: Make the Social Side Fun

## Context

The guild system in Loredex OS is mechanically deep (two real war systems, 12-Archon
House lore, 5-tier Guild Hall, weekly Epoch seasons) but feels **lonely in practice**.
Today, two players in the same guild can co-exist for hours and never feel each other's
presence: chat is REST-polled, there are no online indicators, no emotes, no DMs,
no friend lists, and no co-op activities outside of admin-scheduled wars. The
shipped narrative pieces (Sorting Ceremony, House Cup, Archon training voices) are
beautifully made but consumed solo.

Goal: turn the guild from a leaderboard-and-treasury app into a place where players
**bump into each other, react to each other's moments, and play together on a daily
cadence** — and where every social beat is punctuated by **bespoke art and short
Veo 3.1 cutscenes** so the world feels alive. Reuse the infrastructure that already
exists (WS server, notifications table, signature-ability data, decoration data,
the `apps/client/public/videos/` CDN pipeline, Archon VO manifests) and layer
cinematic moments on top.

## Recommended Approach (phased)

### Phase 1 — Presence and live chat (the foundation)

Most player-facing fun depends on knowing someone is *there*. Today guild chat is
polled and there is no online indicator anywhere.

- **Add a `guild` WebSocket channel** alongside the existing PvP/chess WS surfaces in
  `apps/server/_core/index.ts`. On connect, subscribe by `guildId`; broadcast
  `chat`, `system`, `war_update`, `presence_join`, `presence_leave`, `typing`.
- **Server**: convert `apps/server/routers/guild.ts` `sendMessage` to also publish
  to the WS room. Keep REST `getChat` as the cold-load fallback. New routers:
  `guildPresence` (heartbeat ping every 30s).
- **Client**: in `apps/client/src/pages/GuildPage.tsx` ("Comms" tab), replace
  `tRPC.guild.getChat` polling with a WS subscription hook. Add an online/offline
  dot to each row in the Roster tab.
- **Reuse**: existing PvP/chess WS bootstrap pattern in `apps/server/_core/index.ts`;
  the `notifications` table for offline fallback (`apps/db/schema.ts` line 1595).

### Phase 2 — Reactions, emotes, and shareable moments

Cheap, high-engagement primitives. The Sorting Ceremony is already cinematic — let
others see it happen.

- **Message reactions**: extend `guildChat` with a `reactions` JSON column (emoji →
  user-id list). New `react`/`unreact` procedures. UI: emoji-picker on hover.
- **Emote spam**: a fixed set of 12 lore-themed emotes (one per Archon — reuse the
  Archon mapping in `apps/client/src/game/archonTrainingVoices.ts`). They render as
  inline chat stickers, free, animated.
- **Shared moments**: when a guildmate triggers `SortingCeremony`
  (`apps/client/src/components/SortingCeremony.tsx`) or hits a guild-level milestone
  or wins a war MVP, broadcast a system card to guild chat with a "🎉 React" affordance.

### Phase 3 — Daily/weekly contribution loops

The guild today has no reason to log in *today vs. tomorrow*. Add a rotating
contribution board so logging in together compounds.

- **New shared file** `apps/shared/guildContracts.ts`: 8 weekly contracts (e.g., "Win
  20 chess matches as a guild", "Donate 5,000 Dream collectively", "Clear 3 Terminus
  bosses") that read from existing war-point sources in `apps/server/routers/guildWars.ts`
  (so no new event plumbing).
- **New router** `apps/server/routers/guildContracts.ts`: `getCurrent`,
  `getProgress`, `claim`. Resolution = a cron tick written into existing scheduler
  surface (or compute-on-read keyed by ISO week, like `getActiveWarSeason()` already
  does in `apps/shared/allianceWar.ts`).
- **UI**: new "Contracts" tab in `GuildPage.tsx`, with a per-member contribution bar
  so players can see whose effort is tipping it.
- **Reuse**: contribution multiplier code path in `guildWars.contribute` —
  contracts share the same hook so a single fight win counts everywhere.

### Phase 4 — Friends, DMs, and pings

Not every conversation belongs in guild chat.

- **Schema additions**: `friendships(userA, userB, status, createdAt)` and
  `directMessages(threadId, fromUserId, toUserId, body, createdAt)` in
  `apps/db/schema.ts`. Friend requests reuse the `notifications` table.
- **Server**: new `friends.ts` and `dm.ts` routers (mirror `guild.ts` invite shape).
  WS channel re-used for delivery.
- **Client**: a global friends drawer (top-bar) so it lives outside the guild page;
  `@mention` autocomplete in guild chat that pings the user.

### Phase 5 — Wire the lonely systems into the social layer

The codebase already has gorgeous **defined-but-unused** systems. Connecting them is
mostly cheap.

- **Signature abilities** (`apps/shared/guildSignatureAbilities.ts` — 12 defined,
  zero call sites): expose as a chat-bar action in the guild Comms tab — using one
  burns its cooldown and posts a system card ("Hekara channels Harmonize: +5%
  guild-wide war points for 1h"). Buff applies via the existing
  `warPointMultiplier` trait pipeline already used in
  `apps/server/routers/guildWars.ts`.
- **House Cup persistence** (`apps/client/src/pages/HouseCupPage.tsx`): migrate
  from `localStorage` to a `houseCupStandings` table so the leaderboard is
  cross-device and visible to guildmates. Add weekly reset to the same
  ISO-week scheduler used for Epochs.
- **Decoration placement** (`apps/server/routers/guildHall.ts` is a stub): a single
  `decorationPlacements` JSON column on `guilds`. Placement is collaborative — any
  officer can rearrange, and movements broadcast via WS. The 30+ decorations in
  `apps/shared/guildHall.ts` are already costed and bonused.

### Phase 6 — Guild identity art (visual pride)

Today guild emblems are string IDs ("sword", "shield", "crown") with no art.
Production volume is mid-indie. Two layers, ship both:

- **Composable emblem kit** (procedural identity for every guild):
  - 32-piece kit: frames × 8, charges × 16, colors × 8
  - `apps/client/src/components/GuildEmblem.tsx` composes at runtime → ~4,000 unique
    combinations
  - Slot into the 12 guild backgrounds already shipped in
    `art/guilds/guild-the-*.jpg` and on the new emblem chips next to every member
    in Roster, in chat avatars, on war banners, on the Guild Hall masthead
  - Asset prefix on dgrsart S3: `art/guild-emblems/{frames,charges,colors}/`
- **Hero emblem illustrations** (24 commissioned pieces): one per Mechronis Guild
  + one per signature ability. Manifested in `apps/shared/expansionArt/guildArt.ts`.
  Used as the hero card on the Common Room, signature-ability cast splash, and
  war-victory diplomas.
- **Common-room repaint**: replace the PLACEHOLDER-14 art flagged in
  the archived `docs/archive/2026-05-08-superseded/SHIP_READY_ASSET_BIBLE.md`
  (folded into `docs/ART_DEPARTMENT_PRODUCTION.md` §3) with 12 finished
  guild common-room paintings (one per Archon Guild) at 1920×1080.
- **Decoration sprites**: the 30+ decorations in `apps/shared/guildHall.ts` are
  data-only today. Commission a 96×96 isometric sprite per item so the Guild Hall
  actually looks decorated when Phase 5 placement ships.

### Phase 7 — Cinematic layer: Veo 3.1 cutscenes everywhere

This is the AAA-feel lift. Veo 3.1 produces short (4–8 sec), 1080p, 24fps clips
with native audio that lazy-load on triggered moments. Every social beat gets a
cutscene. Players see each other's cutscenes via the WS broadcast from Phase 1
("a card lands in chat with the video inline; tap to expand fullscreen").

The full per-shot prompts live in the **Art Production Bible** below
(Nano Banana start/end frames + Veo 3.1 motion prompt + VFX + SFX + music + VO
line for every cutscene). The high-level catalogue is 28 entries → ~45 short
videos, covering onboarding, daily/weekly engagement, combat & wars, all 12
signature abilities (light + dark), and hall/decoration moments.

Tooling & pipeline:
- **New script** `apps/scripts/guild-cutscenes-veo.ts` — mirrors the existing
  `vo:*` generators. Reads `apps/shared/guildCutscenes.ts` (script + prompt +
  voiceover line + camera/tone notes), calls the Veo 3.1 endpoint, writes mp4 +
  webm + poster.jpg to a local cache, then uploads to dgrsart at
  `cdn/client-public/videos/guild/{cutscene_id}.{mp4,webm,jpg}`. Idempotent on
  ETag, like `assets:upload`.
- **New manifest** `apps/shared/guildCutsceneManifest.json` — generated alongside
  the videos (id → {duration, posterUrl, mp4Url, webmUrl, voManifestKey,
  rulesVersion}). Mirrors the VO manifest pattern.
- **Coverage audit** `scripts/_cutscene-audit.mjs` — HEAD-checks every manifest
  URL like `_check-art-coverage.mjs` does for cards.
- **Voiceover hooks**: each cutscene optionally references a key in the existing
  Archon VO manifests so the line is dubbed in the assigned Archon's voice
  (reuses `apps/shared/<character>VoManifest.json` discovered during research).
- **package.json scripts**: add `vo:cutscenes`, `vo:cutscenes:audit`,
  `assets:upload:cutscenes`.

Client integration:
- **New component** `apps/client/src/components/CutscenePlayer.tsx` — lightweight
  wrapper around `<video>` with: poster preload, fade-in, `prefers-reduced-motion`
  fallback to the poster + caption, skip on Esc, "play once per session" guard
  keyed by cutscene id, autoplay-with-mute fallback for browsers that block sound.
- **New hook** `apps/client/src/hooks/useCutscene.ts` — triggers a cutscene by id,
  resolves URL via the manifest, posts a "watched" event to the analytics router.
- **WS broadcast**: when a triggering server event fires (war victory, signature
  cast, hall tier-up), publish a `cutscene` event to the guild WS room from
  Phase 1 with `{cutsceneId, actorUserId, contextPayload}`. All connected
  guildmates' clients render an inline preview card; opening it plays fullscreen.
- **Performance**: lazy-load the manifest on first guild-page mount; preload only
  posters; videos load on hover/intent. Total bundle impact: zero (everything is
  on the CDN).
- **Accessibility**: every cutscene ships with closed captions
  (`.vtt` next to the mp4) authored from the `voManifestKey` line.

Production scope estimate (Veo 3.1):
- 28 entries × ~1.6 average sub-clips ≈ **45 short videos**
- At 5s average, ~3.75 minutes total runtime
- Veo 3.1 cost-rough order: a few hundred dollars per pass at current pricing,
  iterate 2–3 times for art-direction matches
- Storage on dgrsart: ~150 MB total (1080p, 5Mbps webm), trivial CDN cost

---

# ART PRODUCTION BIBLE — Guild Cutscenes (Nano Banana + Veo 3.1)

This bible is the single source of truth for the 28 guild-cutscene entries
(~45 sub-clips). For every entry it specifies: **two Nano Banana 2 still frames
(start + end) at 1920×1080**, the **Veo 3.1 image-to-video motion prompt** that
animates between them, the **VFX**, **SFX**, **music** stem, and the **VO line**
referenced from an existing manifest in `apps/shared/*VoManifest.json`.

## A. Production Standards (apply to every entry — do not repeat in shots)

**House style** (from `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` and
`docs/ART_DEPARTMENT_PRODUCTION.md` §3 / §6 — supersedes the archived
`SHIP_READY_ASSET_BIBLE.md`):

- Aesthetic: BioWare cinematic lighting × Blade Runner palette × bio-mechanical
  horror with corporate cool. Dark academia overtones for Mechronis interiors.
- Base: deep-space black `#010020`. Primary cyan `#22d3ee` (Elara energy).
  Rose accent `#f43f5e` (Human substrate). Volumetric fog at ankle height,
  anamorphic lens flare on the brightest element only.
- **No rendered text** in any frame — all titles/labels are HTML overlays
  applied later in code. This includes guild names, ability names, captions.
- Film grain (subtle, 3% intensity), 24fps, 1.85:1 framing inside 16:9 with
  letterbox bars baked OUT (the player can see beyond the bars in the player UI).
- Void Energy materials: **glass** (translucent holographic, cyan refraction,
  circuit traces beneath), **flat** (stark UI, signal static, glitch transitions),
  **retro** (CRT scanlines, VHS chroma bleed, green terminal). Every shot picks
  exactly one material.

**Per-Guild palette** (cite the hex in every prompt that involves the guild):

| Guild | Hex | House | Material default |
|-------|-----|-------|------------------|
| The Chorus | `#818cf8` | Resonance | glass |
| The Eyes | `#a1a1aa` | Umbra | flat |
| The Archive | `#fbbf24` | Umbra | retro |
| The Between | `#e879f9` | Liminal | glass |
| The Influencers | `#f472b6` | Resonance | flat |
| The Yellow Coats | `#facc15` | Ironflight | flat |
| The Congress | `#c084fc` | Resonance | glass |
| The Locks | `#34d399` | Umbra | flat |
| The Grey Gamers | `#60a5fa` | Liminal | retro |
| The Living | `#f87171` | Ironflight | glass |
| The Forge | `#fb923c` | Ironflight | flat |
| The Architect's Study | `#a8a29e` | Liminal | retro |

**Per-House palette** (used for House-level shots — sorting, House Cup):

- Resonance: brass `#C59A3F` / accent `#F4E4B8`; warm amber particles.
- Umbra: slate `#3A4A5E` / accent `#A8B4C2`; cool silver particles, no fire crackle.
- Ironflight: red `#B83232` / gold `#F4B13A`; hot orange embers.
- Liminal: violet `#6B4EA8` / accent `#C9A8E0`; magenta sparks, room geometry shifts.

**Dark variant rule**: every "dark" cutscene re-renders its light counterpart
with: hex hue rotated −20°, saturation pushed to 110%, particles tinted to
`#7f1d1d` corruption-red, lens-flare element replaced by a single hairline
crack of red light. Same camera move, same composition.

## B. Nano Banana 2 frame conventions

- **Aspect**: 1920×1080, no letterbox baked in.
- **Layout grid**: subject occupies center-third; volumetric fog fills bottom
  fifth; lens flare lives in the upper-right unless otherwise specified.
- **Naming**: `videos/guild/{cs_id}_start.jpg` and `..._end.jpg`. Posters are
  always the start frame (lighter weight).
- **Continuity**: start and end frames must share camera focal length, lighting
  source direction, and one visual anchor (a banner, a glyph, a hand) so Veo
  3.1's image-to-video pass interpolates cleanly. Always state the anchor in
  both prompts using identical wording.
- **Per-prompt structure** (use the same field order every time so iteration
  is diffable):
  1. Subject and pose
  2. Environment and depth cues (foreground / midground / background)
  3. Lighting (key, rim, fill, lens flare anchor)
  4. Color callouts (hex from the table above)
  5. Material (glass / flat / retro)
  6. Atmosphere (fog density, particle type)
  7. Camera (lens mm, height, angle)
  8. Negative prompt (always: "no rendered text, no logos, no watermarks, no
     letterbox bars, no extra fingers")

## C. Veo 3.1 cinematic prompt conventions

- **Mode**: image-to-video, both Nano Banana frames provided as start and end
  conditioning images. Duration: matches the entry's spec (1.5–8s).
- **One camera move + one dominant visual idea per shot** — push-in OR pan,
  not both; one VFX bloom, not three.
- **Per-prompt structure**:
  1. Camera move (e.g., "slow 18mm push-in, 30°/sec parallax, no roll")
  2. Subject motion (what the anchor object does between frames)
  3. Atmospheric beat (particle behavior, fog drift)
  4. Audio cue tied to a beat in the music stem ("on beat 2: glyph ignites")
  5. Negative motion prompt ("no whip pans, no zoom-out, no character speech
     unless a VO line is specified, no morphing faces")
- **Sound**: Veo 3.1 native audio is OFF for guild cutscenes. We layer SFX +
  music + VO ourselves so they can be remixed per-locale and per-mute-state.
  This means every clip ships with a silent mp4 plus a synchronized audio
  bundle (see section E).

## D. VO sourcing (from research)

Existing manifests at `apps/shared/*VoManifest.json` we will pull lines from
(or write new lines into when needed — the VO pipeline is `pnpm vo:*`):

- Archon professors: `watcherVoManifest.json`, `collectorVoManifest.json`,
  `necromancerVoManifest.json`, `warlordVoManifest.json`,
  `programmerVoManifest.json`, `gamemasterVoManifest.json`,
  `sourceVoManifest.json`, `architectVoManifest.json`
- Companions / narrators: `elaraVoManifest.json`, `humanVoManifest.json`,
  `lockeVoManifest.json`
- Misc: `antiquarianVoManifest.json`, `seerVoManifest.json`,
  `shadow_tongueVoManifest.json`, `authorityVoManifest.json`,
  `eidolaVoManifest.json`, `memeVoManifest.json`, `nilmorgVoManifest.json`,
  `degenVoManifest.json`

Every cutscene entry below names its VO as `manifest:line_id`. Lines that do
not yet exist are flagged `[NEW]` and added to the appropriate manifest in
the same PR that ships the cutscene.

## E. Audio bus conventions

- **Music stem** is a 4–8s loopable bed at -18 LUFS, 48kHz, stereo. Sourced
  from the existing `apps/client/public/music/` library when possible; new
  beds named `music/guild/{cs_id}_bed.ogg`.
- **SFX stack** is a layered bundle (sub, mid, top, transient) at -12 LUFS
  peak, mono summed with stereo width on the top layer. Sourced from
  `apps/client/public/audio/sfx/` — extend that directory with a new
  `audio/sfx/guild/` namespace.
- **VO** is the existing 24-bit / 48kHz manifest format.
- **Final mix**: SFX -12 LUFS, music -18 LUFS, VO -16 LUFS. Music ducks
  -6dB under VO. All three play through the existing `audioBus` in
  `apps/client/src/audio/` so the player's master volume and mute state apply.

## F. Cutscene Catalogue

The catalogue below is grouped by section and follows the same per-entry
template. Sections are added in subsequent commits to keep diffs reviewable.

### F.1 Onboarding & joining (4 entries)

#### F.1.1 — `cs_guild_join`

| Field | Value |
|---|---|
| Trigger | `guild.join` server mutation succeeds for the first time per (user, guild) pair |
| Duration | 6.0 s |
| Broadcast scope | Caster (fullscreen on accept) + guild WS room (inline chat card, all members) |
| Anchor object | The new member's composable emblem (Phase 6 kit), floating mid-frame |
| Material | glass |
| House palette | Inherits joined guild's hex from the per-guild table; if unaffiliated, default to cyan `#22d3ee` + brass `#C59A3F` |

**Nano Banana start frame** — `videos/guild/cs_guild_join_start.jpg`
1. Subject and pose: a single un-lit composable emblem disc (8 cm diameter
   visual size) floating perfectly still at frame center, axis tilted 12° away
   from camera, bevelled edge catching one rim highlight on the upper-left arc.
   Emblem charges are silhouetted, not yet illuminated.
2. Environment: the threshold of the guild's common room seen from just outside
   the doorway. Foreground: dark stone arch with carved Mechronis runes (no
   readable text — abstract geometric glyphs). Midground: emblem disc.
   Background: the common room itself, dim, every banner furled around its pole,
   the floor a polished obsidian reflecting only ambient.
3. Lighting: single key from upper-left at 35°, color-temperature 5600K, soft.
   Rim from emblem itself (self-luminous edge, very faint, 5% intensity). Fill
   from ankle-fog only. Lens flare anchor: a pinprick highlight on the emblem's
   topmost charge.
4. Color callouts: walls in deep-space `#010020`, rune carvings in slate
   `#3A4A5E`, emblem edge in the joined guild's hex (cite at gen time), fog
   tinted very faintly cyan `#22d3ee` at 8% opacity.
5. Material: glass — the emblem reads as translucent holographic with circuit
   traces visible inside; the doorway arch reads as solid stone (not glass).
6. Atmosphere: ankle-fog at medium density, drifting right-to-left at 2 cm/s
   visual rate. No particles in motion yet.
7. Camera: 35mm, eye-level (1.6 m), dead-on perpendicular to the doorway plane.
8. Negative prompt: no rendered text, no logos, no watermarks, no letterbox
   bars, no extra fingers, no member silhouettes inside the room (it must read
   "empty until you arrive"), no animated sparks.

**Nano Banana end frame** — `videos/guild/cs_guild_join_end.jpg`
1. Subject and pose: the same emblem disc, now fully ignited (every charge
   filled with the guild's accent color), tilted to a true vertical axis,
   levitating 10 cm higher in frame. A column of soft cyan light rises from
   beneath it.
2. Environment: identical doorway and arch from the start frame (continuity
   anchor). Common room beyond is now lit — every banner unfurled and gently
   lit from below, six holographic name-plates (no text — abstract glyph shapes
   standing in for member names) hovering at chest height around a circular
   meeting platform on the room's central rug.
3. Lighting: same 35° key but lifted to 60% intensity. Emblem self-rim now at
   80% intensity. Banner under-lights bloom in their guild hex at 40%
   intensity. Lens flare anchor: emblem top charge now blooms a 4-petal flare.
4. Color callouts: walls still `#010020` but now picking up the guild hex as a
   wash on the upper third (12% opacity). Banners in their full guild hex.
   Cyan column reads `#22d3ee` at 50% opacity.
5. Material: glass throughout — the room itself reads as a holographic projection
   layered over the stone arch.
6. Atmosphere: ankle fog now seeded with rising motes (gold for Resonance/
   Ironflight, silver for Umbra, magenta for Liminal — choose by joined
   guild). Six glyph name-plates visible in the background but not animating
   in this still.
7. Camera: identical 35mm eye-level dead-on (continuity).
8. Negative prompt: same as start, plus: no specific human faces, no readable
   member names, no UI chrome.

**Veo 3.1 motion prompt** (image-to-video, both stills as conditioning):
1. Camera: slow 35mm push-in along the room axis, 0.4 m total travel over
   6 seconds, no roll, no pan. Easing: cubic-out (fast start, soft settle).
2. Subject motion: the emblem disc rotates 90° clockwise about its vertical
   axis between t=0.5s and t=2.0s, charges igniting one by one in a counter-
   clockwise sequence on each beat (8 charges over 1.5 s). Banners unfurl
   from their poles between t=2.0s and t=4.0s in a synchronized cascade.
   Six glyph name-plates fade in (each 0.3 s) between t=4.0s and t=5.5s.
3. Atmospheric beat: ankle fog accelerates from 2 cm/s to 6 cm/s during the
   push-in; rising motes appear at t=2.0s and travel up at 12 cm/s.
4. Audio cue ties: emblem charge ignitions sit on the music stem's eighth-note
   grid; banner cascade lands on beat 5; final settle on the downbeat at t=5.5s.
5. Negative motion prompt: no whip pans, no zoom-out, no character speech, no
   morphing geometry, no flicker on the emblem after ignition completes, no
   second push-in beyond the spec.

**VFX**
- Emblem ignition: per-charge particle burst (12 particles each, lifetime
  300ms, additive blend, color = guild hex).
- Banner unfurl: cloth-sim approximation via 2D mesh deformation, no real
  cloth-sim cost; under-light bleeds onto the floor obsidian as a reflective
  smear.
- Rising motes: 24 simultaneous on screen, GPU-instanced, additive blend,
  120-frame loop sprite from `art/vfx/motes_{house}.webp`.
- Lens flare bloom: single anamorphic streak, 18° rotation, intensity ramps
  0→100% between t=4.5s and t=5.5s, then holds.

**SFX** (bundle: `audio/sfx/guild/cs_guild_join.ogg` synchronized stems)
- Sub: low rumble swell, 80Hz fundamental, 6 s ramp, peaks at t=5.5s (-15dB).
- Mid: crystalline chime cluster on each emblem charge ignition (8 chimes,
  C5–G5 ascending), -12dB peak.
- Top: paper-and-silk banner whoosh, stereo-wide, 6 instances staggered
  100ms apart between t=2.0s–2.6s.
- Transient: deep magnetic "click" on final emblem settle at t=5.5s, -8dB.

**Music** (`music/guild/cs_guild_join_bed.ogg`)
- 6 s loopable bed at 88 BPM, in the joined House's mode (Resonance: Lydian,
  Umbra: Aeolian, Ironflight: Phrygian Dominant, Liminal: whole-tone).
- Instrumentation: sustained pad (analog warmth) + plucked dulcimer
  arpeggio on the eighth-note grid + low timpani hit on the downbeat at t=0.
- -18 LUFS, 48kHz stereo. Ducks -6dB under VO.

**VO** (`elaraVoManifest.json` line `elara_guild_welcome_001` [NEW])
- Line: "You're in. The hall remembers your name now — even if it can't say it
  back."
- Delivery: warm half-smile, conspiratorial whisper, 0.6 s lead silence so
  it lands at t=4.0s as banners finish unfurling.
- Caption (.vtt) authored verbatim from the line.

#### F.1.2 — `cs_guild_first_message`

| Field | Value |
|---|---|
| Trigger | `guild.sendMessage` mutation succeeds AND it is the (user, guild) pair's first ever message (server-side check on `guildChat` for any prior row by this user in this guild) |
| Duration | 4.0 s |
| Broadcast scope | Caster only (fullscreen, skippable) — guild WS room sees a static "first words" chat card with the start-frame poster, no autoplay |
| Anchor object | A single hovering ink-glyph at frame center, equidistant from camera in both frames |
| Material | flat (the wall is a paper-thin signal surface, not glass — keeps it intimate, not grand) |
| House palette | Joined guild's hex; if unaffiliated, `#22d3ee` cyan default |

**Nano Banana start frame** — `videos/guild/cs_guild_first_message_start.jpg`
1. Subject and pose: a single ink-droplet glyph (loosely calligraphic, abstract
   — reads as proto-language, not a letter), 6 cm diameter visual size, hovering
   1 m from a vertical stone wall, perfectly motionless. The glyph is matte
   black with a pinprick of guild-hex color at its core.
2. Environment: tight close-up on a section of common-room wall — carved stone
   with horizontal grain, weathered. Foreground: the glyph (sharp focus).
   Midground: the wall surface itself, in focus. Background: hint of one banner
   pole at extreme frame-right edge, soft-blurred to f/2.8 bokeh.
3. Lighting: single key from the lower-right at 25°, warm 3200K (candle-temperature).
   No rim. Fill from a faint cyan ambient (`#22d3ee` at 6%) implying the player's
   chat-input cursor is glowing just below frame.
4. Color callouts: wall in slate-grey `#3A4A5E`, glyph in matte black with
   guild-hex pinprick, ambient wash in cyan `#22d3ee` at 6%, candle warmth at
   `#F4E4B8` at 18%.
5. Material: flat — the wall is signal-receptive, not architectural; reads as
   a quiet flat surface waiting for a transmission.
6. Atmosphere: no fog at this scale. Two slow-floating dust motes at upper
   third (lit from below). Air feels held.
7. Camera: 50mm, eye-level (1.6 m), oblique to the wall at 15° (so the wall
   recedes toward the right edge, leaving negative space on the left for the
   ink trail to fill).
8. Negative prompt: no rendered text, no logos, no readable script, no second
   glyph, no cursor visible in frame, no animated motion blur.

**Nano Banana end frame** — `videos/guild/cs_guild_first_message_end.jpg`
1. Subject and pose: the same single glyph (same position, same size — continuity
   anchor), now joined by a vertical ink-trail rising from the original glyph
   up the wall in a slow counter-clockwise spiral, terminating at the guild's
   crest emblem (the composable Phase 6 emblem) glowing at the top-left of
   frame, fully lit in guild hex.
2. Environment: same wall, same banner pole at frame-right. The spiral occupies
   the previously-empty left negative space.
3. Lighting: same 25° key from lower-right, but the spiral self-illuminates
   along its length (additive blend, guild hex), and the crest at the top-left
   throws a 40% wash across the upper third of the wall.
4. Color callouts: wall still slate `#3A4A5E`, ink-trail in matte black with
   guild-hex inner-glow, crest fully ignited in guild hex.
5. Material: flat throughout.
6. Atmosphere: same two dust motes drifted slightly up and right (passive drift
   only, not VFX-prominent).
7. Camera: identical 50mm eye-level oblique 15° (continuity).
8. Negative prompt: same as start, plus: no halo around the crest (just the
   hex wash), no second spiral, no character in frame.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: locked. No move at all. This is the only static-camera shot in the
   F.1 set — keeps it personal.
2. Subject motion: at t=0.3s the original glyph trembles once (5px shimmy,
   100ms). At t=0.5s a single tendril of ink begins to climb the wall in a
   counter-clockwise spiral, reaching the top-left crest position at t=3.2s.
   At t=3.4s the crest ignites in a single soft pulse (no flare, no burst).
   Final settle by t=3.8s.
3. Atmospheric beat: the two dust motes drift gently up-and-right throughout;
   no other particle motion. The candle-warmth ambient pulses once at t=3.4s
   in time with the crest ignition (12% intensity bump, 200ms).
4. Audio cue ties: glyph tremble lands on the music's pickup beat; spiral
   travel maps 1:1 to the dulcimer arpeggio's ascending run; crest ignition
   sits on the downbeat at t=3.4s.
5. Negative motion prompt: no whip pans, no zoom, no second glyph, no spiral
   re-tracing, no faces, no rendered text appearing along the trail.

**VFX**
- Spiral ink-trail: 2D mesh path animated along a Catmull-Rom spline, ink
  texture sampled from `art/vfx/ink_trail.webp` with per-vertex alpha taper at
  the leading edge. Inner glow added in shader (guild hex, 40% additive).
- Crest pulse: single one-shot bloom on the emblem composable, 200ms
  intensity envelope (0 → 100% → 80% hold).
- Dust motes: 2 GPU-instanced sprites with brownian drift, no other VFX.
- No lens flare in this shot (flat material, intimate scale).

**SFX** (`audio/sfx/guild/cs_guild_first_message.ogg`)
- Sub: barely-there breath of low air, -22dB, 4 s gentle swell, no peak.
- Mid: wet-ink dragging-on-paper sound, granular-stretched, follows the spiral
  travel exactly (synchronized to its position). -14dB peak at t=2.0s.
- Top: a single chime on glyph tremble (t=0.3s, F#5, -16dB, 600ms tail) and
  a second chime on crest ignition (t=3.4s, C6, -10dB, 1.2 s tail).
- Transient: a soft heart-thud kick at t=3.4s under the crest chime, -14dB.

**Music** (`music/guild/cs_guild_first_message_bed.ogg`)
- 4 s loopable bed at 72 BPM, in the joined House's mode.
- Instrumentation: solo dulcimer with a sustained sub-pad underneath. No
  percussion. Minimal — this beat is about the player's own first words, not
  spectacle.
- -20 LUFS (quieter than the F.1.1 bed by intent), 48kHz stereo.

**VO** (`elaraVoManifest.json` line `elara_first_words_001` [NEW])
- Line: "First words. The walls are listening — they always do."
- Delivery: hushed, almost reverent, with a hint of dry warmth. Lands at
  t=2.4s, mid-spiral, so the line completes just before the crest ignites.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- This cutscene is **caster-only fullscreen** (intimate moment), unlike
  `cs_guild_join` which broadcasts. The chat-card variant for guildmates is a
  static poster of the start frame with overlay "{member} spoke for the first
  time" — no autoplay, click-to-expand only.
- No per-guild variant rendering needed — the start/end stills are
  guild-agnostic; the guild hex is applied at runtime via a CSS color filter
  on the spiral and crest layers (single mp4, color-filtered in browser).
  This saves 11 of 12 renders.
- Reduced-motion fallback: end frame as static poster + caption + SFX bundle.

#### F.1.3 — `cs_friend_accept`

| Field | Value |
|---|---|
| Trigger | `friends.respond` mutation transitions a friendship row from `pending` to `accepted` |
| Duration | 4.0 s |
| Broadcast scope | Both friends (fullscreen on the accepter; toast-card on the requester next time they're online). Neither guild receives a chat card — friendship is private. |
| Anchor object | Two glyph-sigils, one per friend, drifting in deep void; they meet at frame center on the climax beat |
| Material | glass (both sigils read as translucent, light-bending) |
| House palette | Dual: each sigil carries its caster's joined-guild hex. If a friend has no guild, default cyan `#22d3ee` for them. |

**Nano Banana start frame** — `videos/guild/cs_friend_accept_start.jpg`
1. Subject and pose: two glyph-sigils — abstract calligraphic seals, each
   roughly 8 cm visual diameter — floating in deep void. Sigil A on the left
   third, axis tilted 18° toward camera. Sigil B on the right third, axis
   tilted 18° in the mirror direction. They are 1.4 m apart (visually),
   facing each other but not touching. Each sigil bears a single carved
   "personal mark" at its core (a unique generative glyph derived from the
   user's id, identical for the same user across all renders).
2. Environment: pure deep-space `#010020` void. Foreground: nothing.
   Midground: the two sigils. Background: a faint star-field, density 0.4%
   coverage, no constellations, no nebulae.
3. Lighting: each sigil is self-rim-lit by its caster's guild hex. No external
   key light. A faint cyan ambient `#22d3ee` at 4% fills the void as a
   "you are not nowhere" hint. Lens flare anchor: a single pinprick on the
   inner-facing edge of each sigil (the side that will meet the other).
4. Color callouts: void `#010020`, sigil A in friend-A's guild hex,
   sigil B in friend-B's guild hex, ambient cyan `#22d3ee` at 4%.
5. Material: glass — both sigils are translucent with circuit traces visible
   inside, reading as "stored will, not yet bound."
6. Atmosphere: no fog (we are not in a room). Faint stars only. Air feels
   suspended.
7. Camera: 50mm, level, perfectly perpendicular to the line connecting the
   two sigils. Symmetric framing.
8. Negative prompt: no rendered text, no logos, no watermarks, no faces, no
   hands, no environment beyond stars, no third sigil, no readable runes.

**Nano Banana end frame** — `videos/guild/cs_friend_accept_end.jpg`
1. Subject and pose: the two sigils have met at frame center, interlocked
   along their inner edges (each notches into the other in a yin-yang style
   without forming a circle). The seam where they touch is a thin line of
   pure white `#ffffff` light, 2 px wide. Each sigil's personal mark remains
   readable on its half — preserved, not merged.
2. Environment: identical void, identical star density (continuity). The
   ambient cyan has lifted slightly (now 8%) implying the bond itself is
   illuminating local space.
3. Lighting: each sigil's self-rim now at 90% intensity (up from start). The
   white seam is the brightest element in frame and is the lens flare anchor
   (single anamorphic streak, 18° rotation, 60% intensity).
4. Color callouts: same void, same hexes per sigil; new white seam
   `#ffffff`; ambient cyan at 8%.
5. Material: glass throughout; the seam itself reads as a thin solid
   light-emissive plane.
6. Atmosphere: no fog. A handful of motes (8 total, additive blend, white)
   have appeared near the seam — the "spark of contact."
7. Camera: identical 50mm level perpendicular framing (continuity).
8. Negative prompt: same as start, plus: no halo around the joined sigils,
   no second seam, no full circle (the two halves never close into a ring).

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: locked. No move. The drama is the meeting, not the framing.
2. Subject motion: between t=0.4s and t=2.6s the two sigils drift toward
   center along the line connecting them, easing cubic-in-out. They rotate
   30° each in opposing directions during the drift so their inner edges
   align by t=2.6s. At t=2.6s they touch — a single white "click" pulse
   expands from the contact point (4 cm radial flash, 200ms decay). At
   t=2.8s the seam settles and the lens flare ramps in over 800ms. Sigils
   never separate again; the final 400ms is a held tableau.
3. Atmospheric beat: the cyan ambient lifts from 4% to 8% smoothly across
   the whole 4 s. The 8 contact-motes appear at t=2.6s and drift outward
   slowly (8 cm/s), exiting frame edges by t=4.0s.
4. Audio cue ties: drift maps to a 4-bar swell on the music bed; contact
   "click" lands precisely on the downbeat at t=2.6s; lens flare ramp
   coincides with the chime tail.
5. Negative motion prompt: no whip pans, no zoom, no second drift, no sigil
   morphing into a face or symbol, no readable text appearing in the seam,
   no separation after contact.

**VFX**
- Sigil drift: positional tween only, no particle trail (keeps the
  pre-contact silence visually quiet).
- Contact pulse: single one-shot radial bloom at the meeting point, 4 cm
  visual radius, 200ms envelope (0 → 100% → 0).
- White seam: thin emissive plane, 2 px wide, alpha-feathered at the ends.
- Contact motes: 8 GPU-instanced sprites, additive white, brownian outward
  drift, no rotation, 1.4s lifetime each.
- Single anamorphic lens flare on the seam, ramp-in over 800ms, then hold.

**SFX** (`audio/sfx/guild/cs_friend_accept.ogg`)
- Sub: a low, breath-like swell building from -22dB at t=0 to -14dB at t=2.6s,
  cutting on contact (gives the silence around the click weight).
- Mid: two soft "approach" tones — one panned hard left at -18dB starting at
  t=0.5s on G3 (caster A's guild root), one panned hard right at -18dB
  starting at t=0.7s on D4 (caster B's guild root). Both glide toward
  center pan and converge on a unison F4 at t=2.6s.
- Top: a single bell-like "click" on contact at t=2.6s, -8dB, 1.6s tail
  (allowed to ring out under the held tableau).
- Transient: no kick — this beat lives in resonance, not impact.

**Music** (`music/guild/cs_friend_accept_bed.ogg`)
- 4 s loopable bed at 60 BPM (slow, breath-paced).
- Instrumentation: two solo cellos (one per friend, panned wide, each in
  the friend's guild root), drifting toward unison; a single bowed glass
  bowl underneath as a sustained drone in cyan-implied F.
- -19 LUFS, 48kHz stereo. Ducks -4dB under VO (lighter duck than the F.1
  default — the line is short).

**VO** (`elaraVoManifest.json` line `elara_friend_accept_001` [NEW])
- Line: "Two wills, one seam. The Loredex remembers."
- Delivery: warm but ceremonial; ~1.4 s spoken length. Lands at t=1.0s so
  it completes well before the contact click and the silence afterward
  belongs to the players.
- Caption (.vtt) authored verbatim.
- Per-friend variant: not needed — Elara narrates both sides.

**Implementation notes**
- The two guild hexes are passed as runtime CSS color filters on two layers
  in `CutscenePlayer.tsx` (one per sigil). Single mp4 covers all
  guild-pair combinations (12 × 12 = 144 pairings), avoiding 143 wasted
  renders.
- Generative personal-mark glyphs: derived deterministically from the
  user-id hash → 32-piece kit selection (reuses the Phase 6 emblem-component
  kit at small scale). Rendered client-side as an SVG overlay on top of
  the mp4's sigil region — Veo never sees the per-user mark; it only
  renders the sigil base and edge-glow.
- WS broadcast payload: `{ cutsceneId: "cs_friend_accept", actorUserId,
  friendUserId, actorGuildSlug, friendGuildSlug }`. Both clients render
  the same mp4 with mirrored sigil sides (the "left" sigil is always the
  viewer's own).
- Reduced-motion fallback: end frame as static poster (with the two SVG
  personal marks composited in) + caption + SFX bundle.

#### F.1.4 — `cs_sorting_ceremony_arrival` (2 sub-clips: `_pre` + `_post`)

This entry **wraps** the existing `SortingCeremony.tsx` rather than replacing
it. The component already plays the silent vote sequence and the assigned-
Archon voice line. The two sub-clips below are slotted **before** and **after**
that existing sequence:

- `_pre` (6.0 s) — fires before the silent vote begins; sets the
  Crownless-Lectern stage and the 12 Archon arc.
- `_post` (5.0 s) — fires after the assigned Archon names the student;
  unfurls the assigned House banner.

Both sub-clips broadcast to the player's guild WS room as a chat card so
guildmates can witness the sorting moment.

##### F.1.4.a — `cs_sorting_ceremony_arrival_pre` (6.0 s)

| Field | Value |
|---|---|
| Trigger | `SortingCeremony.tsx` `phase === "approach"` (slotted in via the existing component's lifecycle, before the silent vote) |
| Duration | 6.0 s |
| Broadcast scope | Caster fullscreen + guild WS room chat card (the moment is publicly meaningful — guildmates already know the player is being sorted) |
| Anchor object | The Crownless Lectern itself, dead center frame, throne-of-stone scale, present and identical in both stills |
| Material | retro (CRT scanlines on the Archon silhouettes; the Lectern itself is solid stone — the retro overlay reads as the Architect's surveillance, not the room) |
| House palette | Unknown at trigger time — the House is decided during the vote, after this clip ends. Use Mechronis-base palette: deep-space `#010020`, slate `#3A4A5E`, brass `#C59A3F` accents only. No guild hexes yet. |

**Nano Banana start frame** —
`videos/guild/cs_sorting_ceremony_arrival_pre_start.jpg`
1. Subject and pose: the Crownless Lectern centered in frame, an obsidian
   waist-high pedestal with a circular concave reading surface on top, ringed
   by 12 carved notches (one per Archon, no labels — abstract notch shapes
   only). The reading surface is dark, dormant. No human figure in frame
   yet — the player POV is implied as the camera.
2. Environment: cathedral-scale chamber. Foreground: polished obsidian floor
   reflecting a faint cyan ambient. Midground: the Lectern alone in the central
   third. Background: a perfect arc of 12 hooded silhouettes standing 4 m back
   on a raised circular plinth, equidistant, motionless. Each silhouette is
   featureless black against a vertical column of pale signal-light behind it.
   Ceiling: lost in upper darkness, suggested only by a single pinprick of
   warm light far above.
3. Lighting: single key from directly above the Lectern at 90° (cold 6500K
   rim around the reading surface), no fill on the foreground floor (which
   reflects only ambient), back-lights behind each Archon silhouette at 12%
   intensity (just enough to silhouette them). Lens flare anchor: the upper
   pinprick of warm light — the only warm element in frame.
4. Color callouts: floor and walls in deep-space `#010020`, Lectern in slate
   `#3A4A5E`, Archon back-lights in pale signal-cyan `#22d3ee` at 12%, upper
   pinprick in brass `#C59A3F` at 100%.
5. Material: retro — CRT scanline overlay applied to the 12 Archon silhouettes
   only (the Architect "sees through them" but not through the Lectern). The
   Lectern itself reads as solid stone, no overlay.
6. Atmosphere: heavy ankle-fog at the floor (40% density, drifting slowly
   from the back of the room toward the camera, 4 cm/s). Two faint dust shafts
   visible in the Archon back-lights.
7. Camera: 28mm wider lens for cathedral scale, low-eye-level (1.4 m) so the
   Lectern reads as authoritative. Centered, perfectly perpendicular to the
   Archon arc — the player POV is reverent, slightly looked-down-upon.
8. Negative prompt: no rendered text, no logos, no faces inside the hoods, no
   recognizable Archon costumes (the hoods are uniform), no readable runes on
   the Lectern, no human player figure in frame, no warm color anywhere except
   the upper pinprick.

**Nano Banana end frame** —
`videos/guild/cs_sorting_ceremony_arrival_pre_end.jpg`
1. Subject and pose: the same Lectern, exact same composition (continuity
   anchor), but its reading surface now glows softly — a single cyan disc at
   the center, 8 cm visual diameter, signaling readiness. A single
   translucent hand has reached forward from the central Archon's silhouette
   and now hovers 30 cm above the Lectern's reading surface, palm-down,
   fingers slightly spread. The hand is clearly Archon-material: glassy,
   semi-transparent, cyan-edge-lit.
2. Environment: identical chamber, identical 12-Archon arc, identical
   architecture. The fog has thickened slightly. No other change in geometry.
3. Lighting: the upper key has dimmed (down to 70% from start) — focus has
   shifted to the Lectern surface itself, which now self-illuminates at 60%
   from its central disc. The reaching hand is rim-lit cyan from within. Lens
   flare anchor: now on the Lectern's central disc (the upper pinprick has
   dimmed to 40%).
4. Color callouts: same `#010020` floor and walls, same slate Lectern stone,
   the disc glows cyan `#22d3ee` at 60%, the reaching hand outlined in cyan
   `#22d3ee` rim, brass pinprick now at 40%.
5. Material: retro on the silhouettes still; the reaching hand is glass
   (translucent, circuit traces faintly visible in its forearm region just
   inside the hood).
6. Atmosphere: fog density up to 55% at floor level, one extra dust shaft
   visible behind the central Archon (the one whose hand is reaching).
7. Camera: identical 28mm low-eye-level perpendicular framing (continuity).
8. Negative prompt: same as start, plus: no specific finger detail
   (anonymous Archon), no second hand, no the-chosen-Archon-is-revealed-yet
   moment (this happens in `_post`), no House colors, no readable rune on
   the disc.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 28mm push-in along the room axis, 0.25 m total travel
   over 6 seconds, no roll, no pan. Easing: linear (this beat is solemn, not
   propulsive).
2. Subject motion: the Lectern's central disc fades up from 0% to 60%
   between t=0.5s and t=2.0s. The 12 Archon silhouettes do not move at all.
   The reaching hand emerges from the central Archon's hood between t=3.0s
   and t=5.2s (slow, deliberate, never accelerating), settling 30 cm above
   the disc by t=5.2s. The hand holds, motionless, for the final 0.8s.
3. Atmospheric beat: ankle-fog density rises smoothly from 40% to 55% over
   the full 6 s. The brass pinprick above dims from 100% to 40% across t=0
   to t=4.0s. CRT scanlines on the silhouettes flicker once at t=2.5s
   (single-frame stutter, near-imperceptible) — a hint that the Architect is
   watching.
4. Audio cue ties: disc fade-up sits under the music's first sustained
   chord; hand-emergence runs against an ascending bowed-glass swell;
   final hold lands as the bed reaches its longest sustain.
5. Negative motion prompt: no whip pans, no zoom-out, no character speech,
   no Archon hood movement, no second hand, no rapid lighting changes, no
   visible breath, no ceiling reveal.

**VFX**
- Lectern disc fade: shader-driven emissive ramp on the stone, 1.5 s
  envelope, no particle component (keeps the moment austere).
- Reaching hand: 3D model with a glass-shader pass — internal circuit
  traces drawn as a low-frequency emissive noise, animated at 0.3 Hz so
  the hand reads as living-but-not-organic. Edge rim sampled from a 1D
  cyan gradient.
- Scanline stutter: single-frame post-effect, 1px vertical jitter on the
  silhouette layer only at t=2.5s.
- Fog: existing volumetric fog system, density-keyed animation curve.
- Single anamorphic lens flare on the disc, ramping in 0.5–2.0s.

**SFX** (`audio/sfx/guild/cs_sorting_ceremony_arrival_pre.ogg`)
- Sub: deep cathedral drone, 40Hz fundamental, 6 s sustain, -16dB,
  no swell — felt more than heard.
- Mid: stone-grinding settle on disc fade-up at t=0.5s (-14dB, 600ms),
  then a single low-bowed-glass note rising slowly from G2 to D3 between
  t=3.0s and t=5.2s as the hand emerges.
- Top: the scanline stutter at t=2.5s gets a single 1-frame click of
  digital glitch (-12dB, 80ms, no tail).
- Transient: a subsonic kick at t=5.2s when the hand settles (-10dB,
  felt-not-heard, 120Hz fundamental).

**Music** (`music/guild/cs_sorting_ceremony_arrival_pre_bed.ogg`)
- 6 s through-composed bed at 50 BPM (no loop — this clip is one-shot per
  player lifetime). Modal ambiguity intentional (Architect has not yet
  decided): suspended chord built from C, D, F#, A#, with no resolving
  third.
- Instrumentation: bowed glass armonica (lead), pipe organ (sustained
  pad, 16' stop), single distant bass drone.
- -19 LUFS, 48kHz stereo. Ducks -6dB under VO.

**VO** (`architectVoManifest.json` line `architect_sorting_pre_001` [NEW])
- Line: "The Lectern is listening. So are the twelve. Step forward."
- Delivery: cool, administrative, no warmth — the Architect speaks as
  process, not parent. Lands at t=1.5s and completes by t=4.0s, leaving
  the hand-emergence beat to play out in instrumental silence.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- Single render only — no per-guild variant (House is unknown at this
  point in the flow). One mp4 ships globally.
- Slot point: insert before `SortingCeremony.tsx`'s existing
  `phase === "voting"`. Pass control back to the existing component on
  clip end so the silent-vote sequence plays as it does today.
- WS broadcast payload: `{ cutsceneId: "cs_sorting_ceremony_arrival_pre",
  actorUserId, guildId }`. Inline chat card uses the start frame as
  poster.
- Reduced-motion fallback: end frame as static poster + caption only;
  music bed still plays (the SFX stack is too sparse to carry the
  fallback alone).
- The post sub-clip (`_post`) is authored in the next chunk.

##### F.1.4.b — `cs_sorting_ceremony_arrival_post` (5.0 s)

| Field | Value |
|---|---|
| Trigger | `SortingCeremony.tsx` `phase === "claimed"` (slotted in via the existing component's lifecycle, after the assigned Archon's voice line completes) |
| Duration | 5.0 s |
| Broadcast scope | Caster fullscreen + guild WS room chat card (other guildmates see the assigned-House reveal — same scope as `_pre`) |
| Anchor object | The Crownless Lectern, **identical position and framing** as `_pre`'s end frame, so this clip reads as a true continuation; the disc on its surface glows with the assigned-House root color rather than cyan |
| Material | glass (the chamber transitions from administrative-retro to celebratory-glass as the Architect's process completes and the House claims the student) |
| House palette | Determined at trigger time by `SortingCeremony.tsx`'s assignment result. One of: Resonance brass `#C59A3F` / `#F4E4B8`; Umbra slate `#3A4A5E` / `#A8B4C2`; Ironflight red `#B83232` / `#F4B13A`; Liminal violet `#6B4EA8` / `#C9A8E0` |

**Nano Banana start frame** —
`videos/guild/cs_sorting_ceremony_arrival_post_{house}_start.jpg`
1. Subject and pose: identical Lectern in identical low-eye-level perpendicular
   composition as `_pre`'s end frame. The Archon hand has withdrawn into its
   hood (no longer in frame). The Lectern's central disc has shifted color
   from cyan to the assigned House's root hex, glowing at 80% intensity.
   A single furled banner-pole rises 2 m vertically from directly behind the
   Lectern (newly present — emerged from the floor during the silent vote
   that just played in `SortingCeremony.tsx`). The banner cloth is wrapped
   tightly around the pole, dark, no House sigil yet visible.
2. Environment: same cathedral chamber, same 12-Archon arc on the back
   plinth — but 11 of the silhouettes have receded one half-step backward
   into shadow, and one (the assigned Archon, located in the arc-position
   matching the assigned House) has stepped one half-step forward and now
   reads slightly more present (still hooded, still featureless). The
   chamber walls have begun picking up the House-root hex as a 6% wash on
   the upper third.
3. Lighting: the upper brass pinprick has come back up to 80%. The Lectern
   disc lights the immediate floor in the assigned hex at 30%. The assigned
   Archon's back-light has shifted from cyan to House-hex at 30% (no other
   Archons have shifted). Lens flare anchor: the Lectern disc.
4. Color callouts: floor and walls still `#010020` base, House-hex wash at
   6% on the upper walls, disc and assigned-Archon back-light at the
   House-root hex, brass pinprick `#C59A3F` at 80%, all other 11 Archon
   back-lights still cyan `#22d3ee` at 12%.
5. Material: glass — the assigned Archon's silhouette still carries faint
   retro scanlines (the Architect retains some authorship), but the rest
   of the chamber has shed the retro overlay.
6. Atmosphere: ankle-fog density at 50% (slightly down from `_pre`'s end at
   55% — tension easing). The two dust shafts behind the assigned Archon
   are now lit in the House-hex.
7. Camera: identical 28mm low-eye-level perpendicular framing
   (continuity with `_pre`).
8. Negative prompt: no rendered text, no logos, no House sigil visible on
   the wrapped banner yet, no faces inside hoods, no third light source,
   no readable runes anywhere.

**Nano Banana end frame** —
`videos/guild/cs_sorting_ceremony_arrival_post_{house}_end.jpg`
1. Subject and pose: identical Lectern, identical framing. The banner has
   fully unfurled — a 2.5 m × 1.6 m cloth hanging behind the Lectern, lit
   from below by the disc, displaying the assigned House's emblem at its
   center (the existing per-House emblem from
   `apps/shared/mechronisHouses.ts`, rendered as embroidered cloth-on-
   cloth — no rendered text). The disc itself has settled to 60% intensity
   and now pulses gently. The assigned Archon has stepped one full step
   forward of the others, now standing 3 m back from the Lectern,
   featureless hood still up but the hood-shadow now back-lit in a thin
   House-hex rim.
2. Environment: same chamber. The House-hex wash on the upper walls has
   risen from 6% to 18%. The other 11 Archon silhouettes have receded a
   further half-step into shadow, their back-lights dimmed to 6%. The
   chamber now reads unambiguously as belonging to the assigned House.
3. Lighting: Lectern disc 60%, banner under-light 50% in House-hex, the
   assigned Archon's hood-rim 25%, the upper brass pinprick now down to
   30% (its job is done — the Architect has handed authority to the
   House). Lens flare anchor: the banner's center emblem.
4. Color callouts: walls picking up House-hex at 18% upper-third wash,
   banner cloth in House-accent hex (Resonance `#F4E4B8`, Umbra
   `#A8B4C2`, Ironflight `#F4B13A`, Liminal `#C9A8E0`) with the House-root
   hex used for the embroidered emblem itself.
5. Material: glass throughout. No retro overlay anywhere — the Architect's
   surveillance has lifted.
6. Atmosphere: ankle-fog now down to 40%, drifting outward from the
   Lectern (reversal of the inward drift in `_pre`). 12 rising motes in
   House-accent color (gold for Resonance, silver for Umbra, ember for
   Ironflight, magenta for Liminal) appear in the air around the banner.
7. Camera: identical 28mm low-eye-level perpendicular framing
   (continuity).
8. Negative prompt: same as start, plus: no Archon face reveal, no
   readable text on the banner, no other House emblems anywhere, no
   second banner, no character-of-the-player figure.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 28mm push-in continuing from `_pre`'s push-in
   trajectory, an additional 0.20 m of travel over 5 seconds (so the
   combined `_pre` + silent-vote + `_post` arc reads as one continuous
   forward motion). Linear easing.
2. Subject motion: at t=0.4s the wrapped banner rotates 5° about its
   pole and begins to unfurl downward, completing the unfurl by t=2.6s
   in a clean cloth-physics cascade (no whipping, no over-shoot). The
   embroidered emblem fades in on the cloth between t=2.6s and t=3.6s
   (sub-pixel detail revealing on a soft cross-fade — never sharp-cuts).
   The 11 unselected Archons recede in unison between t=3.0s and t=4.5s
   (each takes a single back-step of 30 cm visual distance, fully
   synchronized). The assigned Archon's hood-rim ignites at t=4.5s in
   a single soft pulse and holds.
3. Atmospheric beat: the upper-wall House-hex wash ramps from 6% to
   18% between t=2.0s and t=4.0s. The 12 House-accent motes appear at
   t=3.6s and rise at 10 cm/s. The brass pinprick dims continuously
   from 80% at t=0 to 30% at t=5.0s.
4. Audio cue ties: banner unfurl rides a cloth-and-bell swell;
   embroidered-emblem reveal sits on a sustained chord change in the
   bed; Archon recession lands on a 4-bar bowed-strings figure;
   assigned-Archon hood-rim pulse hits the downbeat at t=4.5s.
5. Negative motion prompt: no whip pans, no zoom-out, no character
   speech beyond the VO line below, no ceiling reveal, no Archon
   face emergence, no banner over-shoot or whip, no flicker on the
   final hood-rim.

**VFX**
- Banner unfurl: 2D cloth-mesh deformation (low-cost, no physics-sim
  pass) with a baked cloth-shadow strip. Embroidered-emblem layer is
  a separate sprite cross-faded on top of the cloth.
- Disc color-shift: shader-driven hue ramp from cyan to House-root hex
  during the first 200 ms of the clip (carries continuity from `_pre`'s
  cyan disc).
- Archon recession: positional tween only, no particle trail (matches
  the silent reverence of the silhouettes).
- Assigned-Archon hood-rim: single one-shot rim-light pulse at t=4.5s,
  300 ms envelope (0 → 100% → 25% hold).
- 12 rising motes in House-accent color, GPU-instanced, additive
  blend, 2 s lifetime each, brownian upward drift.
- Single anamorphic lens flare on the banner's center emblem, ramping
  in 3.0–4.0s, holding through clip end.

**SFX** (`audio/sfx/guild/cs_sorting_ceremony_arrival_post_{house}.ogg`)
- Sub: the cathedral drone from `_pre` continues at -16dB but now lifts
  by +4dB over the first 1.5 s as the chamber transitions out of
  administrative tension into ceremonial release.
- Mid: cloth-and-rope unfurl sound, granular-stretched over 2.2 s
  (t=0.4s to t=2.6s), -12dB peak. House-tinted resonant chime swell
  on the embroidered-emblem reveal at t=2.6s–3.6s (House-root pitch:
  Resonance C5, Umbra G4, Ironflight A4, Liminal D5).
- Top: 12 small bell-chimes in House-accent timbre on each rising
  mote (staggered across t=3.6s–4.4s, total -10dB summed).
- Transient: a low felt-not-heard kick at t=4.5s under the
  assigned-Archon hood-rim ignition (-10dB, 100Hz).

**Music** (`music/guild/cs_sorting_ceremony_arrival_post_{house}_bed.ogg`)
- 5 s through-composed bed at 56 BPM (one-shot per player lifetime,
  same as `_pre`). Resolves the suspended chord from `_pre` into the
  House's home mode:
  - Resonance: resolves to Lydian on F (bright, hopeful).
  - Umbra: resolves to Aeolian on D (cool, watchful).
  - Ironflight: resolves to Phrygian Dominant on A (martial, hot).
  - Liminal: resolves to whole-tone on G (uncanny, open).
- Instrumentation: bowed glass armonica (lead, carried over from
  `_pre`), pipe organ (now joined by a low choir pad), single struck
  bell on each major beat.
- -18 LUFS, 48kHz stereo. Ducks -6dB under VO.

**VO** (`SortingCeremony.tsx` already plays the assigned-Archon's
claim line via the existing `archonTrainingVoices.ts` mapping during
the silent-vote phase that runs **between** `_pre` and `_post`. This
post sub-clip therefore intentionally has **no new VO of its own** —
the cinematic carries on the resonance of the line just spoken.) An
optional Architect coda line is reserved as a future addition:
- Reserved line (`architectVoManifest.json` line
  `architect_sorting_post_001` [NEW, optional]):
  "Resonance / Umbra / Ironflight / Liminal. The hall is yours now,
  student." — 4 House-keyed variants. Disabled by default; ship if
  playtests find the post sub-clip feels too quiet.

**Implementation notes**
- **4 variants per House** — `{house}` is one of `resonance`, `umbra`,
  `ironflight`, `liminal`. Both stills, the mp4, the SFX bundle, and
  the music bed are all rendered four times. The `vo:cutscenes`
  script accepts a `--variants per_house` flag and produces the
  matrix.
- Slot point: insert after `SortingCeremony.tsx`'s existing
  `phase === "voting"` completes and after the assigned-Archon voice
  line plays. The post-clip then yields control back to the existing
  component's "complete" state.
- WS broadcast payload:
  `{ cutsceneId: "cs_sorting_ceremony_arrival_post", actorUserId,
  guildId, house }`. Inline chat card renders the matching house
  variant's start-frame poster.
- Reduced-motion fallback: end frame as static poster + caption only
  (the music bed plays; SFX bundle is too sparse to carry alone).
- Asset CDN paths follow the established pattern:
  `cdn/client-public/videos/guild/cs_sorting_ceremony_arrival_post_{house}.{mp4,webm,jpg}`.

#### F.1.5 — `cs_guild_charter_signing`

The founding rite: when the guild leader signs the Charter, the
guild's faction allegiance locks for 30 days, the vocabulary tier
takes effect across guild surfaces, and the presiding companion
witnesses the signing. This cutscene is the social-payoff moment
that turns "we joined a guild" into "we are a House."

| Field | Value |
|---|---|
| Trigger | `roleplay.signGuildCharter` server mutation succeeds (first-time per guild; re-signs replay the cutscene only if `factionLockedUntil` had elapsed) |
| Duration | 7.5 s |
| Broadcast scope | Caster (fullscreen, skippable) + guild WS room (inline chat card with start-frame poster, autoplay-with-mute for all online guildmates) |
| Anchor object | A single quill-stylus hovering above an open obsidian charter-slab; the slab carries one un-inked sigil at frame center, mirrored in both frames |
| Material | glass — the charter-slab itself reads as translucent obsidian with circuit-traces beneath the surface; the quill reads as solid metal |
| House palette | Vocabulary-tier driven, NOT guild hex: `rite` → insurgency green `#22c55e` ink; `edict` → empire crimson `#ef4444` ink; `weave` → witness violet `#a855f7` ink; `compact` → cyan `#22d3ee` ink. The presiding companion's accent appears as the rim-light source. |
| Companion variants | 5 variants for the 5 canonical companions: Elara (cyan rim `#22d3ee`), The Human (rose rim `#f43f5e`), The Antiquarian (amber rim `#fbbf24`), Locke (slate rim `#A8B4C2`), The Seer (violet rim `#a855f7`). Each variant changes ONLY the rim-light source direction + color and the VO line. Camera, anchor, and ink-color stay tier-driven. |

**Nano Banana start frame** — `videos/guild/cs_guild_charter_signing_start_{tier}_{companion}.jpg`

1. Subject and pose: a quill-stylus hovers exactly 8 cm above an
   open obsidian charter-slab (28 × 18 cm visual size, 12° tilt
   away from camera so the surface catches highlight along the
   upper-left edge). The quill is held mid-air by no visible hand —
   it floats vertical, nib pointing down, perfectly motionless.
   On the slab's inscription field, a single un-inked sigil sits
   at exact frame center: an empty ring 6 cm diameter with three
   inscribed slots arranged 120° apart, each slot carved but unfilled.
   The companion's silhouette is just visible at the right edge of
   the frame (cropped at the shoulder, fully out of focus, 8 m back),
   serving as the rim-light source.
2. Environment: a circular vow-chamber on the guild's deepest level
   — Mechronis stonework, no banners yet (that's the end frame).
   Foreground: the charter-slab on a low obsidian plinth (60 cm
   tall). Midground: the floating quill. Background: a circular
   ringwall of unlit standing-glyph posts (9 of them, 60° apart,
   each glyph carved but dark), then the chamber's shadow void.
3. Lighting: single key from upper-left at 35°, color-temperature
   3200K (warm), soft. The companion's rim from the right edge
   adds a single colored hairline (Elara cyan / Human rose /
   Antiquarian amber / Locke slate / Seer violet) at 25% intensity.
   Fill from ankle-fog only. Lens-flare anchor: the quill's nib
   pinprick highlight.
4. Color callouts: walls in deep-space `#010020`, plinth and slab in
   obsidian `#0a0a14`, sigil-ring carving in slate `#3A4A5E`, ink
   reservoir in the floating quill glows in the **vocabulary-tier
   ink hex** (cite per the table — `#22c55e` / `#ef4444` / `#a855f7`
   / `#22d3ee`) at 40% opacity, fog tinted faint cyan `#22d3ee` at
   8% opacity, companion rim in companion accent.
5. Material: glass — the slab reads as translucent obsidian with
   visible circuit-traces beneath; the sigil-ring reads as carved-
   into-stone (still the slab's surface); the quill reads as solid
   matte-black metal (deliberate contrast).
6. Atmosphere: ankle-fog at medium density drifting right-to-left
   at 2 cm/s. No rising motes yet. The companion's silhouette has a
   single dust-mote orbital at chest height (slow, visible).
7. Camera: 50mm prime, eye-level (1.6 m), perpendicular to the slab
   plane, slight 2° downward tilt to make the slab read as offered
   *to* the viewer, not displayed.
8. Negative prompt: no rendered text, no logos, no watermarks, no
   letterbox bars, no extra fingers, no glyphs that read as letters,
   no banners (those land in the end frame), no hand visible holding
   the quill, no other guild members, no fire, no smoke beyond the
   ankle-fog.

**Nano Banana end frame** — `videos/guild/cs_guild_charter_signing_end_{tier}_{companion}.jpg`

1. Subject and pose: the same quill, now resting horizontally
   across the charter-slab's upper-right corner (continuity anchor).
   The sigil-ring at frame center is now fully inked: each of the
   three carved slots filled with the vocabulary-tier ink hex,
   connected by three luminous chord-lines. The full sigil emits
   a soft column of light upward (40 cm tall, 8 cm wide, additive
   blend). The companion silhouette at the right edge has stepped
   8 cm closer (still cropped, still out of focus, but warmer
   rim-light now).
2. Environment: identical chamber and slab from the start frame
   (continuity). The 9 standing-glyph posts in the ringwall are
   now ignited — each glyph filled with the same ink-hex at 60%
   intensity, casting nine pools of colored light onto the chamber
   floor in a 9-pointed-star pattern. A circular banner-ring (one
   per post, so 9 banners) has unfurled from each post's top, every
   banner bearing the same vow-sigil at smaller scale (16 cm
   diameter, dimmer ignition than the central sigil).
3. Lighting: same 3200K key but lifted to 50% intensity. Companion
   rim now at 70% intensity (the rite acknowledged the witness).
   Sigil column-of-light emits its own bloom at 100% intensity in
   the ink-hex. Standing-glyph posts add 9 secondary key sources
   at 40% intensity each. Lens-flare anchor: the central sigil's
   topmost slot, blooming a 3-petal flare.
4. Color callouts: walls still `#010020` but now wash-tinted in the
   ink-hex on the upper third (15% opacity). Banners in the ink-
   hex at full saturation. Standing-glyph posts in the same hex.
   Cyan column from start frame is REPLACED with the ink-hex
   column (this is the visual punch line: the chamber takes the
   guild's color).
5. Material: glass throughout — banners read as holographic vow-
   surfaces, slab still translucent obsidian, sigil-ring now reads
   as fully-inked translucent glass plate set into the slab.
6. Atmosphere: ankle-fog now at heavy density (3 cm rise into
   ambient). Rising motes seeded at t=4s in the sigil-ring and
   trailing up the central column (24 motes, ink-hex tinted). The
   companion's orbital dust-mote count has increased to 4.
7. Camera: identical 50mm eye-level perpendicular (continuity).
8. Negative prompt: same as start, plus: no specific human face on
   the companion (silhouette only), no readable banner text, no
   UI chrome, no animated sparks past the rim of the central
   sigil column, no second sigil-ring beyond the central one.

**Veo 3.1 motion prompt** (image-to-video, both stills as conditioning):

1. Camera: slow 50mm push-in along the chamber axis, 0.6 m total
   travel over 7.5 seconds, no roll, no pan. Easing: cubic-out
   (deliberate start, settle on the downbeat). Final frame matches
   the end-frame composition exactly (the conditioning image
   anchors the resolution).
2. Subject motion:
   - t=0.0–1.5s: quill remains motionless, hovering. Companion
     silhouette at right edge takes one slow step closer (8 cm of
     parallax travel), rim-light strengthens from 25% → 50%.
   - t=1.5–2.0s: quill descends 8 cm in cubic-out easing to touch
     the slab at the first sigil slot.
   - t=2.0–4.0s: ink flows from the quill nib into each of the
     three sigil slots in a 120° rotational sequence (slot 1 fills
     0.5s, slot 2 0.5s, slot 3 0.5s, sigil-ring chord-lines
     connect over the final 0.5s). Each slot ignition is a discrete
     flash of bloom at the slot, fading to steady glow.
   - t=4.0–5.5s: standing-glyph posts in the ringwall ignite in
     a counter-clockwise wave (9 posts, 0.16s per post) starting
     from the post directly behind the slab.
   - t=5.5–6.5s: 9 banners unfurl from their post-tops in a
     synchronized cascade (300ms per banner, staggered 80ms).
   - t=6.5–7.5s: central sigil-column of light rises from the
     fully-inked sigil, growing from 0 → 40 cm height in cubic-
     out. Quill rotates 90° clockwise about its own center to its
     final horizontal rest position. Companion rim-light reaches
     final 70% intensity on t=7.5s.
3. Atmospheric beat: ankle-fog accelerates from 2 cm/s to 5 cm/s
   between t=2.0s and t=4.0s as the sigil ignites; rising motes
   appear at t=4.5s and travel up the central column at 14 cm/s.
   Companion orbital dust-mote count animates 1 → 4 over t=4.0–7.5s.
4. Audio cue ties (per E.1):
   - t=0.0s: low timpani hit on the downbeat (music stem starts).
   - t=2.0s: first ink-flow chime on the music stem's beat 3.
   - t=2.5s, t=3.0s, t=3.5s: subsequent slot-fill chimes on each
     half-beat ascending C5 → E5 → G5.
   - t=4.0s: chord-line connection lands on beat 7 with a single
     bowed-cello swell, mid-bus.
   - t=4.5s: companion VO line starts (line tied to companion
     variant — see VO section). Ducks -6dB under VO.
   - t=4.5–5.5s: 9 standing-glyph ignitions sit on a sixteenth-
     note grid, panned in a 9-step counter-clockwise field.
   - t=6.5s: banner cascade lands on the music stem's drop.
   - t=7.5s: final magnetic "click" of the quill settling, -8dB.
5. Negative motion prompt: no whip pans, no zoom-out, no character
   speech other than the VO line, no morphing geometry, no flicker
   on the central sigil after t=4.0s, no second push-in beyond
   the spec, no companion's full face revealed (silhouette only),
   no extra ink running off the slab, no posts igniting in any
   order other than the specified counter-clockwise wave, no fire,
   no smoke beyond the ankle-fog, no lens dirt.

**VFX**

- Sigil slot ignition: per-slot particle burst (16 particles each,
  lifetime 350 ms, additive blend, color = ink-hex). 3 bursts total.
- Sigil chord-lines: GPU-traced lightning-arc between the 3 slots,
  120ms growth, 0.4 mm width, additive blend.
- Standing-glyph wave: per-post bloom (8 particles, lifetime 250ms,
  ink-hex tint), staggered counter-clockwise around the ringwall.
- Banner unfurl: cloth-sim approximation via 2D mesh deformation
  (no real cloth-sim cost). Under-light bleeds onto the floor
  obsidian as a 9-pointed-star reflective smear.
- Central sigil column: GPU-instanced volumetric beam, 8 cm radius,
  40 cm height, additive blend, 0–100% intensity over t=6.5–7.5s.
- Rising motes: 24 simultaneous on screen, GPU-instanced, additive
  blend, 120-frame loop sprite from `art/vfx/motes_charter_{tier}.webp`.
- Lens flare bloom: single anamorphic streak, 12° rotation,
  intensity ramps 0→100% between t=6.5s and t=7.5s, then holds.

**SFX** (bundle: `audio/sfx/guild/cs_guild_charter_signing.ogg` synchronized stems)

- Sub: low rumble swell, 70 Hz fundamental, 7.5 s ramp, peaks at
  t=7.5s (-12 dB).
- Mid: crystalline chime cluster on each sigil-slot ignition (3
  chimes, C5–E5–G5 ascending, half-beat spacing), -10 dB peak each.
  Bowed-cello swell at t=4.0s (low D3, 1.5 s sustain, -14 dB).
- Top: 9 staggered glyph-post ignitions (light bell-strikes,
  100ms each, panned counter-clockwise across stereo field 9
  positions, -16 dB peak). Paper-and-silk banner-whoosh, stereo-
  wide, 9 instances staggered 80 ms apart between t=6.5–7.3 s.
- Transient: deep magnetic "click" on quill final settle at
  t=7.5 s, -6 dB.

**Music** (`music/guild/cs_guild_charter_signing_bed_{tier}.ogg`)

- 7.5 s loopable bed at 80 BPM in the **vocabulary tier's mode**:
  - `rite` (Insurgency): Phrygian Dominant, sparse percussion,
    militant restraint.
  - `edict` (Empire): Lydian, full brass undertone, ceremonial
    formality.
  - `weave` (Witness): whole-tone, choral pad, cosmic quietude.
  - `compact` (neutral): Dorian, balanced dulcimer + analog pad.
- Instrumentation: sustained pad (analog warmth) + plucked
  dulcimer arpeggio on the eighth-note grid + low timpani on the
  downbeat (t=0). Bowed cello swell at t=4.0s carries the chord-
  line connection. Drop at t=6.5s = full mode resolution.
- -18 LUFS, 48 kHz stereo. Ducks -6 dB under VO between t=4.5–6.0s.

**VO** (per companion variant — manifest line ids)

- Elara — `elaraVoManifest.json` line `elara_charter_witness_001` [NEW]
  - Line: "By this sigil, you are not alone. By this sigil, the
    record holds. Speak the oath."
  - Delivery: warm half-confidence, conspiratorial but formal,
    0.4 s lead silence so it lands at t=4.5 s as the chord-lines
    finish connecting.
- The Human — `humanVoManifest.json` line `human_charter_witness_001` [NEW]
  - Line: "Sign it. Mean it. Not for me — for the next one who
    shows up at this door wondering if anyone will witness them."
  - Delivery: low rasp, noir gravity, faint cigarette burn under
    the line, same 0.4 s lead.
- The Antiquarian — `antiquarianVoManifest.json` line `antiquarian_charter_witness_001` [NEW]
  - Line: "Seventeen thousand years I have waited to record one
    name. Yours. Speak it now, and I will."
  - Delivery: dry, amused, hint of relief; 0.4 s lead.
- Locke — `lockeVoManifest.json` line `locke_charter_witness_001` [NEW]
  - Line: "Charter signed, accountability assigned. The hall
    knows you now. Don't waste it."
  - Delivery: clipped administrative warmth, mission-board
    cadence, 0.4 s lead.
- The Seer — `seerVoManifest.json` line `seer_charter_witness_001` [NEW]
  - Line: "I see the threads converging. This sigil holds for
    thirty days — every weave you make in that time pulls the
    others tighter."
  - Delivery: half-prophetic half-weary, breath-pause mid-line,
    0.4 s lead.
- Caption (.vtt) authored verbatim from the chosen companion's
  line. Falls back to text-only display when audio is muted.

**Client integration notes**

- Trigger: `roleplay.signGuildCharter` mutation success path
  appends a WS event to the guild room: `{ cutsceneId:
  "cs_guild_charter_signing", actorUserId, guildId, vocabularyTier,
  presidingCompanion }`.
- Caster's client: full-screen autoplay via `useCutscene("cs_guild_charter_signing")`,
  variant resolved by `(vocabularyTier, presidingCompanion)`.
- Other guildmates online: inline chat card renders the start-frame
  poster (matching variant) with autoplay-with-mute fallback.
- Reduced-motion fallback: end-frame poster + caption only; music
  bed plays.
- 30-day re-sign: server checks `factionLockedUntil` on the
  charter row. If the existing lock has elapsed, the cutscene
  re-plays. Otherwise the mutation is rejected before reaching
  the cutscene trigger, by design.
- Asset CDN paths follow the established pattern:
  `cdn/client-public/videos/guild/cs_guild_charter_signing_{tier}_{companion}.{mp4,webm,jpg}`.
  4 tiers × 5 companions = 20 variants total.

### F.2 Daily / weekly engagement (5 entries, 16 sub-clips)

#### F.2.1 — `cs_contract_unlock`

| Field | Value |
|---|---|
| Trigger | First member of the guild to load the Contracts tab in a new ISO week (server-side check on `guildContracts.getCurrent` against the per-guild `weekIsoStamp`) |
| Duration | 5.0 s |
| Broadcast scope | Caster fullscreen + guild WS room chat card (every guildmate sees the new week begin — this is a shared cadence event) |
| Anchor object | A circular obsidian contract table at frame center, 1.6 m visual diameter, with 8 face-down cards arranged in a perfect octagonal ring on its surface (one per weekly contract from `apps/shared/guildContracts.ts`) |
| Material | retro (the cards read as VHS-era tarot — the Architect's syllabus delivered weekly) |
| House palette | Mechronis-base (no per-guild tint): deep-space `#010020`, slate `#3A4A5E`, brass `#C59A3F` accent |

**Nano Banana start frame** — `videos/guild/cs_contract_unlock_start.jpg`
1. Subject and pose: a circular obsidian table at frame center, viewed from
   25° above (low-three-quarter), with 8 face-down rectangular cards (12 cm
   × 18 cm visual size each) arranged in a perfect octagonal ring around the
   table's center. Cards are perfectly still, edges aligned, faces down. The
   table's center bears a single carved 8-pointed sigil (no readable text).
2. Environment: the guild's "war-room" reading nook — a stone alcove with
   shelving on the back wall holding rolled scrolls (no readable spines). The
   table sits in the central third. Foreground: the table's near-edge,
   sharp-focus. Background: shelving softly out of focus at f/2.8 bokeh.
3. Lighting: single key from above the table at 70°, warm 4000K (lectern
   pool-light reading lamp). Walls fall to deep-space `#010020` ambient.
   Lens flare anchor: a pinprick highlight on the central carved sigil.
4. Color callouts: table obsidian black with slate `#3A4A5E` carved sigil,
   card backs in deep slate with brass `#C59A3F` border-glyphs (no readable
   detail), pool-light warmth at `#F4E4B8` 30%, walls at `#010020`.
5. Material: retro — faint CRT scanlines visible on the card backs only
   (the Architect's syllabus is being delivered through the surveillance
   layer); the table itself reads as solid stone.
6. Atmosphere: very light ankle-fog (15% density). Three slow dust motes in
   the pool-light beam.
7. Camera: 50mm, slightly raised eye-level (1.8 m), 25° downward tilt onto
   the table, perpendicular to the table's 12-o'clock card.
8. Negative prompt: no rendered text, no readable card faces, no logos, no
   tarot symbols, no human hands, no fingers, no card spread beyond the
   octagonal ring.

**Nano Banana end frame** — `videos/guild/cs_contract_unlock_end.jpg`
1. Subject and pose: same table, identical framing (continuity anchor). All
   8 cards have flipped face-up and now lie in the same octagonal ring,
   each card displaying its contract's icon (an abstract pictogram — coins
   for "Donate Dream", crossed swords for "Win Fights", a chess knight for
   "Win Chess matches", etc. — drawn from the existing 8-contract roster in
   `apps/shared/guildContracts.ts`). The central carved sigil now self-
   illuminates in brass.
2. Environment: identical alcove, identical shelving (continuity).
3. Lighting: pool-light intensity has lifted from 70% to 100%. Each card
   now self-illuminates faintly along its top edge in brass at 30%. Lens
   flare anchor: now on the central sigil (the previous start-frame
   pinprick has bloomed into a soft 4-petal flare).
4. Color callouts: card faces in slate `#3A4A5E` parchment with brass
   `#C59A3F` icon-art, central sigil ignited in brass, pool-light warmth
   at `#F4E4B8` 50%.
5. Material: retro on the cards still (the syllabus retains its
   surveillance signature); table and walls remain stone.
6. Atmosphere: ankle-fog still 15%. The three dust motes have drifted
   up and are now lit from below by the brightened pool-light.
7. Camera: identical 50mm 1.8m 25°-down framing (continuity).
8. Negative prompt: same as start, plus: no rendered contract names, no
   number values printed on cards (those overlay in HTML), no second
   sigil, no fan-spread beyond the octagonal ring.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 50mm push-in along the table's vertical axis, 0.15 m
   total downward travel over 5 s, no roll, no pan. Easing: ease-out (the
   camera arrives and settles before the cards complete their flip).
2. Subject motion: at t=0.6s the central sigil pulses once (200 ms
   intensity bump). At t=0.8s the cards begin a tarot-fan flip — each card
   rotates 180° about its long axis in sequence around the ring,
   counter-clockwise from the 12-o'clock card, 200 ms per card with a
   100 ms stagger (so the full ring completes by t=3.4s). At t=3.4s the
   pool-light intensity ramps from 70% to 100% over 600 ms; sigil bloom
   ramps in over the same window. Final 1 s holds the ignited tableau.
3. Atmospheric beat: dust motes drift up at constant 6 cm/s throughout.
   Ankle-fog density holds at 15% — no swell (this is a calm liturgical
   moment, not a climactic one).
4. Audio cue ties: sigil pulse on the music's pickup beat; each card flip
   lands on an eighth-note grid; pool-light ramp coincides with the bed's
   sustained chord change at t=3.4s.
5. Negative motion prompt: no whip pans, no zoom, no second flip, no
   card-shuffle, no second sigil pulse, no animated hands, no scanline
   stutter (the Architect is calm this week).

**VFX**
- Card flip: per-card 180° axis rotation (single quad, two textures —
  back and face), GPU-instanced across the 8-card ring.
- Sigil pulse: shader-driven emissive ramp on the carved sigil, single
  one-shot 200 ms envelope at t=0.6s; second ramp (1 s, 70% → 100%
  → 100% hold) at t=3.4s.
- Card top-edge glow: 1px additive emissive edge on each card face,
  fades up between t=3.4s and t=4.0s.
- Single anamorphic lens flare on the central sigil, bloom in
  3.4–4.4s, hold to clip end.
- Three GPU-instanced dust mote sprites with brownian upward drift.

**SFX** (`audio/sfx/guild/cs_contract_unlock.ogg`)
- Sub: warm low pad swell, 60 Hz fundamental, 5 s gentle ramp, peaks
  at t=3.4s (-16 dB).
- Mid: 8 sequential card-flip "paper-and-leather" sounds, staggered
  300 ms apart from t=0.8s, each -14 dB peak with 80 ms tail. Tone
  ascends in pitch slightly across the ring (each flip raises by a
  semitone) to suggest progress around the table.
- Top: a single struck-bell on the sigil pulse at t=0.6s (-12 dB,
  C5, 800 ms tail) and a sustained brass shimmer ramping in
  3.4–4.4s (-10 dB peak, F-major triad, 1.4 s tail).
- Transient: low felt-not-heard tap on the pool-light ramp at t=3.4s
  (-12 dB, 90 Hz, 100 ms).

**Music** (`music/guild/cs_contract_unlock_bed.ogg`)
- 5 s loopable bed at 64 BPM, in F Lydian (the Mechronis week's
  default mode — bright but procedural).
- Instrumentation: harpsichord plucked on the eighth-note grid
  (carries the card-flip rhythm), sustained pipe-organ pad, a single
  low timpani roll under the t=3.4s pool-light ramp.
- -19 LUFS, 48 kHz stereo. Ducks -6 dB under VO.

**VO** (`gamemasterVoManifest.json` line `gm_contracts_weekly_001` [NEW])
- Line: "Eight tasks. One week. The Architect grades on a curve — but
  only if you all pass."
- Delivery: dry, schoolmasterly, with one beat of conspiratorial warmth
  on the second sentence. Lands at t=1.4s (during the card flips) so it
  completes by t=4.0s, leaving the final ignited tableau silent for
  500 ms before the clip ends.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- **Single global render** — no per-guild or per-house variant. The
  contract icons are rendered into the mp4 (the Veo pass sees the icon
  set as part of its end-frame conditioning), so the 8 contracts'
  pictograms are baked. When the contract roster rotates seasonally
  (say, every quarter), re-render the clip with the new icon set.
  Acceptable cadence: ~4 renders/year.
- WS broadcast payload: `{ cutsceneId: "cs_contract_unlock",
  weekIsoStamp, contractIds[] }`. Clients display the inline chat
  card with the start-frame poster; expanding plays the mp4 and then
  navigates the player to the Contracts tab on dismiss.
- Reduced-motion fallback: end frame as static poster + caption +
  SFX bundle (the 8-card flip sequence is the moving heart of the
  shot, but the SFX paper-and-leather staccato carries the rhythm
  alone well enough).
#### F.2.2 — `cs_contract_complete`

| Field | Value |
|---|---|
| Trigger | `guildContracts.claim` mutation succeeds (server-side: a contract row transitions from `progress >= target` to `claimedAt: now`) |
| Duration | 4.0 s |
| Broadcast scope | Caster fullscreen + guild WS room chat card (the contract is shared work — the team should see it close out) |
| Anchor object | A rectangular vellum diploma at frame center, 18 cm × 26 cm visual size, present and identical-positioned in both stills (only its seal-state and ink-state change) |
| Material | flat (the diploma is paper-receptive, not architectural; reads as quiet receipt, not spectacle) |
| House palette | Joined guild's hex from the per-guild table (the diploma is stamped with the claiming guild's identity) |

**Nano Banana start frame** — `videos/guild/cs_contract_complete_start.jpg`
1. Subject and pose: a single sheet of vellum lying flat on a desk surface,
   centered in frame, viewed from a 60° downward angle so the page reads
   nearly head-on with a slight perspective taper. The page is blank along
   its bottom third — only the contract's printed body (abstract typographic
   shapes, no readable text) fills the upper two thirds in muted ink. A
   wax-seal-shaped indentation is visible at the bottom-right corner of the
   page but is **empty** (no wax yet, just the carved circular impression
   waiting to be filled).
2. Environment: a quiet desk corner — leather blotter under the page,
   off-frame edge of an inkwell at far frame-right. Foreground: the page's
   leading edge in sharp focus. Midground: the page itself. Background: the
   blotter and the soft-focus dark wood of the desk surface.
3. Lighting: single key from the upper-left at 45°, warm 3500K reading-lamp
   color, soft shadow under the page's right edge. No rim. Fill from a faint
   guild-hex ambient at 4% (a subtle hint of who is about to seal this).
   Lens flare anchor: a small specular highlight on the empty seal-impression
   ring.
4. Color callouts: vellum in cream `#F4E4B8`, ink in slate `#3A4A5E`, blotter
   in oxblood-brown `#5A2F2F` at 50%, desk wood in deep walnut `#2A1810`,
   guild-hex ambient at 4%.
5. Material: flat — the page reads as paper, not parchment-of-prophecy. The
   surroundings carry no overlay.
6. Atmosphere: no fog at this scale. One slow dust mote drifting through the
   key beam in the upper-third.
7. Camera: 65mm (slightly long for desk intimacy), at 1.4 m, tilted 60° down
   onto the page, perpendicular to the page's vertical axis.
8. Negative prompt: no rendered text, no readable contract body, no readable
   signature line, no human hands, no fingers, no quill or stylus visible
   yet, no second page, no logos.

**Nano Banana end frame** — `videos/guild/cs_contract_complete_end.jpg`
1. Subject and pose: the same page, identical positioning (continuity
   anchor), but now the seal-impression at the bottom-right has been filled
   — a circular pool of wax in the guild's accent hex, with the joined
   guild's composable-emblem (Phase 6 kit) pressed into its surface in
   crisp 3D relief. A single bright bead of fresh wax catches the key light
   at the seal's upper-left edge. The page itself has gained a single
   horizontal underline of glowing guild-hex ink across the contract body's
   final clause line (additive blend, 30% intensity) marking
   "this is closed."
2. Environment: identical desk corner, identical blotter and inkwell edge.
   The dust mote has drifted up and right (passive — not a VFX feature).
3. Lighting: same 45° warm key. The wax seal self-illuminates faintly in
   the guild hex (15%), throwing a soft hex-tinted bounce onto the blotter
   beneath the page's bottom-right corner. Lens flare anchor: now the
   bright bead on the wax seal (the previous start-frame highlight on the
   empty impression has bloomed into a 2-petal flare).
4. Color callouts: vellum still cream `#F4E4B8`, ink still slate
   `#3A4A5E`, wax seal in the joined guild's accent hex (cite at gen
   time), bounce-light tint on the blotter in guild-hex at 8%.
5. Material: flat throughout (the seal is wax, glass-overlay would feel
   wrong here).
6. Atmosphere: no fog. The single dust mote remains, repositioned.
7. Camera: identical 65mm 1.4m 60°-down framing (continuity).
8. Negative prompt: same as start, plus: no readable text on the
   underline, no second seal, no other guild emblems anywhere, no quill
   or stylus visible, no signature in the body of the page.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: locked. No move. The diploma is the entire frame and it does
   not need traveling — let the seal-press be the only event.
2. Subject motion: between t=0.0s and t=1.0s the page is still and the
   guild-hex ambient brightens from 4% to 10% (a subtle "someone is
   approaching to seal this"). At t=1.0s a soft column of guild-hex
   light descends from off-frame top onto the seal-impression. At
   t=1.6s a wax-bead falls into the impression from the top of the
   column and pools, expanding to fill the impression by t=2.4s.
   Between t=2.4s and t=3.0s the emblem-relief presses into the wax in
   a single deliberate stamp motion (the emblem is implied — never
   render a hand). At t=3.0s the underline of guild-hex ink ignites
   along the page's final clause line, sweeping left-to-right over
   600 ms. Final 400 ms holds the sealed tableau.
3. Atmospheric beat: the dust mote drifts gently throughout. The
   guild-hex ambient peaks at 10% at t=1.6s and holds. No other
   particle motion until the underline ignition at t=3.0s, which
   throws three small hex-colored sparks at its leading edge during
   its 600 ms sweep.
4. Audio cue ties: wax-bead fall lands on the music's downbeat at
   t=1.6s; emblem stamp lands on a 4-bar upbeat at t=2.4s; underline
   ignition rides the bed's resolving cadence at t=3.0s.
5. Negative motion prompt: no whip pans, no zoom, no human hands, no
   stylus or quill, no second seal, no animated typography in the
   page body, no glitch frames, no flicker on the wax after settle.

**VFX**
- Wax bead drop: single positional tween of a translucent red-tinted
  sprite, 600 ms fall easing-in, then a 400 ms expand-and-flatten on
  the seal impression (shader-driven sub-surface scattering tint to
  the guild hex during expand).
- Emblem stamp: shader-driven displacement on the wax surface,
  pressed-relief geometry baked from the Phase 6 emblem mesh,
  300 ms press envelope.
- Underline ignition: 1 px additive emissive line drawn along the
  page's final-clause y-coordinate, 600 ms left-to-right reveal with a
  3-particle spark trail at its leading edge.
- Single anamorphic lens flare on the wax bead's specular highlight,
  ramps in 2.4–3.0s, holds to clip end.

**SFX** (`audio/sfx/guild/cs_contract_complete.ogg`)
- Sub: a single warm pad swell from t=0.0s to t=1.6s, peaking at
  -16 dB on the wax-bead drop, then decaying back to -22 dB.
- Mid: a soft "drip" sound on the wax bead at t=1.6s (-12 dB,
  220 ms tail). A satisfying low-and-warm "press-and-settle" thunk
  on the emblem stamp at t=2.4s (-10 dB, 600 ms tail). A bright
  pen-on-paper scratch riding the underline ignition between t=3.0s
  and t=3.6s (granular, 600 ms total, -14 dB).
- Top: three small bell-tings on the underline sparks (staggered at
  3.0s, 3.3s, 3.6s, ascending C6→E6→G6, -16 dB summed).
- Transient: a low felt-not-heard kick at t=2.4s under the emblem
  stamp (-12 dB, 80 Hz, 100 ms).

**Music** (`music/guild/cs_contract_complete_bed.ogg`)
- 4 s through-composed bed at 72 BPM, in F Lydian (matching the
  weekly-contract bed of `cs_contract_unlock` so the two clips read
  as bookends of one liturgical cycle). Resolves on a clean
  authentic cadence at t=3.0s — the underline lands on the tonic.
- Instrumentation: harpsichord (carry-over from `cs_contract_unlock`,
  sparser here — single notes, not arpeggios), low cello sustain,
  one bowed glass-bowl flourish on the emblem-stamp beat.
- -18 LUFS, 48 kHz stereo. Ducks -4 dB under VO (lighter — the line
  is short and the bed is the emotional pay-off).

**VO** (`gamemasterVoManifest.json` line
`gm_contract_complete_001` [NEW])
- Line: "Sealed. The Architect's quill remembers your name."
- Delivery: warm pride underneath dry administrative satisfaction; ~1.6 s
  spoken length. Lands at t=2.4s (synchronized with the emblem stamp)
  so the seal-press and the spoken word land together as a single beat.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- **Single mp4 + runtime CSS color filter** — same trick used for
  `cs_guild_first_message`. The wax pool and the bounce-light layers
  in the mp4 are rendered at neutral cyan, then color-filtered to the
  joined guild's hex at runtime in `CutscenePlayer.tsx`. Saves 11 of
  12 renders. The Phase 6 composable emblem is a separate SVG layer
  composited over the mp4's seal region (so the emblem displacement
  silhouette is a single shared rendered shape; the per-guild emblem
  is overlaid in the browser).
- WS broadcast payload: `{ cutsceneId: "cs_contract_complete",
  actorUserId, guildId, contractId, contractIcon }`. The inline chat
  card uses the start frame composited with the end-frame seal at
  guildmate-side runtime so guildmates immediately see "which contract
  closed" without playing the mp4.
- Reduced-motion fallback: end frame as static poster (with the SVG
  emblem composited into the seal) + caption + SFX bundle. The
  fallback intentionally retains the SFX press-and-settle thunk so the
  satisfying "claimed" beat survives even without motion.
#### F.2.3 — `cs_house_cup_weekly_reset` (part 1: header + frames)

| Field | Value |
|---|---|
| Trigger | Server-side ISO-week roll (Monday 00:00 UTC). Plays once per player on first session of the new week, regardless of guild membership. Same scheduler used by `getActiveWarSeason()` in `apps/shared/allianceWar.ts`. |
| Duration | 6.0 s |
| Broadcast scope | School-wide. Plays fullscreen for every player who logs in during the new week's first session. **Not** broadcast to a guild WS room — this is a Mechronis-Academy-level beat, not a guild-level one. The HouseCup leaderboard then reads zero for all four Houses for the new week. |
| Anchor object | The interior of the Mechronis Academy dome — a vast oculus-domed amphitheatre ceiling — present and identical-framed in both stills (only the banner-state and lighting evolve) |
| Material | glass (the dome's oculus is a holographic projection lens, not a physical opening — the four House banners are projected through it) |
| House palette | All four Houses simultaneously. Colors must be balanced — no single House dominates the frame. Use the per-House palette from section A: Resonance brass `#C59A3F`, Umbra slate `#3A4A5E`, Ironflight red `#B83232`, Liminal violet `#6B4EA8`. |

**Nano Banana start frame** —
`videos/guild/cs_house_cup_weekly_reset_start.jpg`
1. Subject and pose: viewed from inside the amphitheatre at low-three-quarter
   angle, the dome's interior fills the upper two-thirds of frame. The dome
   is a hemispherical coffered ceiling, 30 m visual diameter, with carved
   geometric patterns radiating from a central oculus (a perfectly circular
   aperture, 4 m visual diameter, at the dome's apex). The oculus is dark —
   showing only deep-space `#010020` beyond, with a faint star-field at 0.4%
   density. No banners are visible yet — four empty banner-poles stand
   spaced equidistantly around the oculus rim, vertical, their cloth
   completely furled and unlit.
2. Environment: foreground occupies the lower third — the upper edge of the
   amphitheatre's tiered seating, empty (no students), reading as wide
   curving stone benches in soft focus. Midground: the dome's lower coffers,
   in sharp focus. Background: the oculus aperture and its dark sky-beyond.
   No specific architectural ornaments are readable as text.
3. Lighting: the dome interior is uniformly under-lit at a low cool 4000K
   (15% intensity, no shadows) — a "dormant chamber, awaiting the week"
   feel. The oculus contributes a faint cyan ambient `#22d3ee` at 5%
   creeping down the dome's inner surface near its apex. The four
   banner-poles each have a tiny pinprick highlight on their finials in
   their respective House colors at 8%. Lens flare anchor: the central
   oculus aperture itself.
4. Color callouts: dome stone in `#1A1530` (a warmer-than-floor variant of
   deep-space), coffers' shadow lines in `#010020`, oculus dark at `#010020`,
   star-field whites in `#F4E4B8` at 100%, banner-pole finials in their
   respective House root hexes at 8%, ambient cyan at 5%.
5. Material: glass — the dome's coffered surface reads with a faint
   holographic shimmer in its inner-surface lacquer, signaling the
   amphitheatre is technically active even when dormant. The banner-poles
   themselves are solid stone (not glass).
6. Atmosphere: low-density volumetric fog (10%) at the seating tier,
   barely-there. No particles in motion.
7. Camera: 24mm wide for cathedral scale, low-eye-level (1.5 m, just above
   the seating tier), tilted 35° upward toward the oculus. Centered on the
   oculus's vertical axis.
8. Negative prompt: no rendered text, no readable carvings, no House
   emblems anywhere yet, no banners unfurled, no students or other people
   in the seating, no recognizable astronomical bodies in the oculus
   beyond, no logos, no anachronistic detail (chairs, electronics, etc.).

**Nano Banana end frame** —
`videos/guild/cs_house_cup_weekly_reset_end.jpg`
1. Subject and pose: identical dome, identical framing (continuity anchor).
   All four banner-poles now bear fully-unfurled banners, each banner
   2.4 m × 1.4 m visual size, rising vertically from each pole's lower
   half down to the upper edge of the dome's lower-coffer band. Each
   banner displays its House emblem (existing per-House emblem from
   `apps/shared/mechronisHouses.ts`) embroidered cloth-on-cloth in the
   House's accent hex on the House's root-hex field. The four banners are
   spaced 90° apart around the oculus rim — Resonance at 12-o'clock,
   Ironflight at 3-o'clock, Umbra at 6-o'clock, Liminal at 9-o'clock
   (canonical clockwise sequence per `mechronisHouses.ts` order). The
   oculus aperture itself now glows softly: a thin annular ring of brass
   `#C59A3F` at 30% sits inside the aperture's circumference, signaling
   the new week has begun.
2. Environment: same amphitheatre, same empty seating tier (continuity).
   The dome's coffers now pick up a 12% wash of mixed House colors
   on their inner surfaces (each coffered panel near a banner picks up
   that banner's hex at 12%, falling off to neutral between banners).
3. Lighting: each banner self-illuminates from below at 50% in its
   House-root hex, throwing a soft hex-tinted bounce onto the immediately-
   adjacent dome coffers. The oculus annular ring is the brightest single
   element in frame — lens flare anchor (single anamorphic streak at 18°,
   60% intensity). The seating-tier under-light has lifted from 15% to
   25% to read "the chamber is now alive."
4. Color callouts: dome stone still `#1A1530`, banner cloths in the four
   House-root hexes (each banner is a single hex, no blending), banner
   embroidery in House-accent hexes, oculus annular ring in brass
   `#C59A3F` at 30%, mixed-hex 12% wash on the dome coffers.
5. Material: glass throughout. The banner cloth itself reads as
   embroidered fabric (not glass) but the dome interior carries the
   holographic shimmer.
6. Atmosphere: volumetric fog at the seating tier holds at 10%. Four
   small mote streams (one per banner) rise gently from each banner's
   bottom edge in House-accent color, 16 motes total, brownian upward
   drift at 8 cm/s.
7. Camera: identical 24mm low-eye-level 35°-up framing, centered on
   the oculus axis (continuity).
8. Negative prompt: same as start, plus: no readable text on banners,
   no rendered House names, no leaderboard numbers visible, no fifth
   banner, no people in the seating, no specific Archon imagery in the
   oculus, no glow-spillover that visually merges two banner colors.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 24mm rotation about the oculus's vertical axis,
   3° total counter-clockwise rotation across 6 s, eye-level held at
   1.5 m. No push-in, no tilt change. The slight rotation reads as
   "the dome is turning to greet the new week" rather than a pan.
   Easing: linear (procedural, calendar-driven, not propulsive).
2. Subject motion: at t=0.4s the oculus annular ring begins to
   illuminate — fading from 0% to 30% intensity over 1.6 s, completing
   by t=2.0s. Between t=2.0s and t=2.4s the four banner-poles each
   release a single small spark from their finials. Between t=2.4s and
   t=4.4s all four banners unfurl downward in perfect synchrony —
   identical 2 s descent, identical easing, no banner leads or lags.
   The embroidered House emblems fade in on each banner between
   t=4.4s and t=5.2s (cross-fade reveal, no sharp-cut). Between
   t=5.2s and t=5.6s the dome's mixed-hex coffer wash ramps from 0%
   to 12%. Final 400 ms holds the four-banner tableau.
3. Atmospheric beat: seating-tier under-light ramps from 15% to 25%
   smoothly across t=2.0s–5.2s. The 16 House-accent motes (4 per
   banner) appear at t=4.4s, drift up at 8 cm/s. Volumetric fog
   density holds at 10% throughout — no swell.
4. Audio cue ties: oculus ring fade-up rides a sustained low-string
   crescendo; banner-pole sparks land on a 4-bar pickup; banner
   unfurl synchronizes to a 2 s timpani-and-strings figure;
   embroidered emblem reveal sits on the bed's home-chord
   resolution; coffer wash and final tableau ride the bed's outro
   sustain.
5. Negative motion prompt: no whip pans, no zoom, no second
   rotation pass, no banner over-shoot or whip, no asynchronous
   banner descent, no oculus aperture animation beyond the
   annular-ring fade-up, no specific Archon faces in the oculus
   beyond.

**VFX**
- Oculus annular ring fade-up: shader-driven emissive ring drawn at
  the oculus aperture's inner circumference, single 1.6 s envelope
  (0% → 30% → 30% hold).
- Banner-pole sparks: four GPU-instanced one-shot sprites at the
  finial positions, 400 ms lifetime each, additive blend, color =
  respective House-root hex.
- Banner unfurl: per-banner 2D cloth-mesh deformation (same
  technique as `cs_sorting_ceremony_arrival_post`), four instances
  perfectly synchronized via shared timeline driver.
- Embroidered emblem reveal: per-banner sprite cross-fade on top
  of the cloth, 800 ms, no separate VFX layer beyond alpha.
- Coffer mixed-hex wash: shader-driven per-coffer color sampling
  from the four banner positions weighted by inverse-distance,
  ramps in 5.2–5.6s.
- Per-banner mote streams: 4 GPU-instanced sprites per banner
  (16 total on screen), brownian upward drift, 2.4 s lifetime each,
  spawned continuously from t=4.4s to clip end.
- Single anamorphic lens flare on the oculus annular ring's
  upper-right arc, ramps in 1.6–2.0s, holds to clip end.

**SFX** (`audio/sfx/guild/cs_house_cup_weekly_reset.ogg`)
- Sub: a deep cathedral drone, 35 Hz fundamental, 6 s sustain,
  ramping from -22 dB to -14 dB across the full clip — felt more
  than heard, gives the oculus weight.
- Mid: a single low metallic chime on the oculus ring's
  fade-up start at t=0.4s (-12 dB, A1 fundamental, 4 s tail).
  Four small "spark-pop" sounds on the banner-pole sparks
  (staggered 50 ms apart between t=2.0s and t=2.2s, summed
  -10 dB peak). A 2 s "rope-and-cloth descent" granular layer
  riding the banner unfurl from t=2.4s to t=4.4s, -12 dB peak.
- Top: four bell-strikes on the embroidered-emblem reveals
  (one per banner, staggered 200 ms apart starting at t=4.4s,
  pitched to each House's root: Resonance C5, Umbra G4,
  Ironflight A4, Liminal D5, summed -10 dB). A single struck
  triangle on the final coffer-wash settle at t=5.6s
  (-14 dB, 2 s tail).
- Transient: a low felt-not-heard kick at t=2.0s on the oculus
  ring's full ignition (-10 dB, 60 Hz, 200 ms).

**Music** (`music/guild/cs_house_cup_weekly_reset_bed.ogg`)
- 6 s through-composed bed at 60 BPM. Modal tour — the bed
  briefly visits each House's home mode in canonical clockwise
  order, lingering 1.4 s on each before returning to the Mechronis
  C-major-with-flat-six "school anthem" cadence in the final 600 ms:
  - t=0.0–1.4s: Resonance Lydian (bright, hopeful)
  - t=1.4–2.8s: Ironflight Phrygian Dominant (martial, hot)
  - t=2.8–4.2s: Umbra Aeolian (cool, watchful)
  - t=4.2–5.4s: Liminal whole-tone (uncanny, open)
  - t=5.4–6.0s: school anthem cadence on a sustained C
- Instrumentation: full Mechronis ensemble — pipe organ pad,
  bowed glass armonica lead, low choir (ahh-vowel only, no words),
  timpani roll on the t=2.4s banner-unfurl beat, single struck
  triangle on the t=5.6s outro.
- -17 LUFS (slightly louder than other F.2 beds — this is the
  school's biggest weekly moment), 48 kHz stereo. Ducks -6 dB
  under VO.

**VO** (`architectVoManifest.json` line
`architect_house_cup_reset_001` [NEW])
- Line: "A new week, students. The Cup is empty. Earn it."
- Delivery: cool administrative authority (consistent with
  `architect_sorting_pre_001`), with a single beat of barely-
  audible amusement on "Earn it." ~3.0 s spoken length. Lands
  at t=2.4s (synchronized with the banner-unfurl beat) so the
  line completes by t=5.4s as the bed reaches its outro.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- **Single global render** — the four-banner composition is
  fixed (Resonance / Ironflight / Umbra / Liminal in canonical
  positions). One mp4 ships globally; every player on the
  whole platform sees the same clip. No per-guild or
  per-player variant.
- **School-wide broadcast scheduling** — fired by the same
  ISO-week scheduler that drives `getActiveWarSeason()` in
  `apps/shared/allianceWar.ts`. The server marks
  `playerGameState.lastHouseCupResetSeen = weekIsoStamp` on
  first session of the new week per user. The
  `cs_house_cup_weekly_reset` event is **not** sent over the
  guild WS room — it's enqueued in a per-user notification
  delivered on next session-start (so offline players don't
  miss it, and online players see it at most once per week).
- WS broadcast payload (per-user, not per-guild):
  `{ cutsceneId: "cs_house_cup_weekly_reset", weekIsoStamp,
  previousWinner: { house, score } }`. The client overlays
  the previous-week winning House and score as HTML chrome
  on top of the start frame poster (no rendered text in the
  mp4 itself). Brand-new players or accounts with no prior
  House Cup data show the cutscene with no overlay.
- Reduced-motion fallback: end frame as static poster +
  caption + SFX bundle. The static poster carries the
  visual idea (four banners, oculus ring, balanced four-House
  composition) well enough on its own; the music bed plays
  to keep the school-wide ceremonial weight.
- Pairs with `HouseCupPage.tsx` — clicking the post-clip
  dismiss button lands the player on `/house-cup` so they can
  see the freshly-zeroed leaderboard. Players who skip the
  cutscene still get this navigation suggestion as a small
  toast.
- Per-quarter or per-act asset refresh: the dome architecture
  itself can be re-rendered seasonally to mark major
  story-arc transitions (e.g., during the Fall of Reality
  alliance-war season the dome's coffers gain a faint
  red-corruption overlay). Re-render cadence: ~4 per year.
  Acceptable since this is the platform's most-watched
  cutscene.

#### F.2.4 — `cs_emote_archon_{1..12}` (12 sub-clips — shared standards)

This entry is **a set of 12 short looping emote stickers**, one per Archon,
authored to a stricter shared spec than the cinematic clips above. Players
spend these in guild chat the way Discord users spend custom emoji — they
should be instantly recognizable, loop seamlessly, render at small size
without losing legibility, and never overstay their welcome.

The shared standards below apply to **every** Archon emote. Per-Archon
entries (F.2.4.a through F.2.4.l, authored in subsequent chunks) only
specify what differs: the Archon's signature glyph, motion verb, color,
material override (if any), SFX timbre, and VO snippet.

**Shared format**

| Field | Value |
|---|---|
| Aspect | 1:1 square. Render at 512×512, deliver mp4+webm. Display in chat at 64×64 inline; expand on hover to 128×128. |
| Duration | 1.6 s, **seamless loop** (the last frame of the rendered clip must visually equal the first frame so the chat client can `loop` the `<video>` element with no perceptible seam). |
| Material | Per-Archon default from section A's per-guild table, with a noise floor of "always slightly less material than a cinematic" — emotes read flatter and friendlier than the dramatic clips so they don't pull focus when stacked in chat. |
| Background | **Transparent** (alpha channel preserved through webm). The chat-bubble background bleeds through. Veo 3.1 outputs are composited against a green-screen plate at gen time, then keyed in post (`apps/scripts/guild-cutscenes-veo.ts` runs ffmpeg `colorkey` on each emote output before upload). |
| Frame budget | Each emote ships with **one** Nano Banana still — the loop's anchor frame, which serves as both start and end. There is no separate end-frame because the motion is a closed cycle. |
| Audio | **Optional and off by default.** Each emote ships with a 1.6 s SFX-only stem (no music, no VO). Players can opt-in per-emote via Settings → Chat → "Play emote sounds" (default: off, so chat doesn't get noisy). |
| Trigger | Player taps an emote in the chat composer's emote tray; the WS broadcast pushes a 1-line chat message of type `emote` carrying `{ archonId }`. All connected guildmates' clients render the looping video inline. |
| Broadcast scope | Guild WS room only (chat). No fullscreen variant. Stacked emotes (more than 3 of the same archon-id within 4 s) auto-collapse client-side into a single sticker with a small numeric multiplier overlay (HTML chrome, no re-render). |
| House palette | Per-Archon, from the per-guild palette table in section A. The emote disregards the player's joined-guild hex — the Archon **is** the identity here, not the guild. |

**Shared Nano Banana frame conventions** (apply to all 12 anchor stills)

1. Subject and pose: a single floating glyph at frame center, occupying the
   center 60% of the canvas, axis perpendicular to camera. The glyph is the
   Archon's signature mark (specified per-emote below). No environmental
   scenery — the glyph is the entire subject.
2. Environment: green-screen plate (`#00ff00`) covering the full canvas.
   No fog, no particles in the still. **All visual interest must come from
   the glyph itself.**
3. Lighting: single rim light from upper-left at 45°, color-temperature
   matched to the Archon's hex; no fill, no key. The glyph reads
   self-luminous, edge-glowing, against an empty plate.
4. Color callouts: glyph in the Archon's accent hex (per-Archon below);
   inner-fill at 60% intensity of the same hex; rim at 100%.
5. Material: per-Archon (glass / flat / retro), but **always one step
   simpler than the same Archon's cinematic material** — e.g., a
   cinematic-glass Archon delivers a flat emote with a single glass
   highlight rather than full circuit traces. This keeps the emote
   readable at 64×64.
6. Atmosphere: none in the still. Motion (per-Archon) introduces small
   particles during the loop.
7. Camera: 50mm equivalent, dead-on, locked. Subject sits at frame center.
   No perspective tilt.
8. Negative prompt: no rendered text, no logos, no watermarks, no
   environmental scenery, no second glyph, no readable runes,
   no human figures, no specific Archon costumes, no faces, no
   off-canvas spillover, no recognizable real-world iconography
   (no sword shapes, gun shapes, real-world religious symbols),
   no anti-aliasing crawl on the glyph edge.

**Shared Veo 3.1 motion convention**

1. Camera: locked. No move. Ever. Camera motion in a 64-pixel chat
   sticker reads as jitter.
2. Subject motion: each Archon's emote is a **single closed-loop verb**
   (specified per-emote — e.g., "blink", "spin", "pulse-and-fade"). The
   verb completes one full cycle in 1.6 s. The loop must be exact:
   render the verb so frame 0 and frame 38 (1.6 s × 24 fps) are
   pixel-equivalent within the green-screen plate.
3. Atmospheric beat: each Archon may add at most **one** small
   particle behavior during the loop (e.g., 3 motes orbiting the
   glyph; a single ember rising and dissolving). No more.
4. Audio cue ties: the optional SFX stem matches the verb's beat
   structure (1 hit, 2 hits, or sustained — see per-Archon).
5. Negative motion prompt: no whip pans, no zoom, no second cycle,
   no wobble, no morphing into a different shape, no secondary
   glyph appearing, no environmental cuts.

**Shared sound design**

- Each per-Archon SFX stem is 1.6 s, **single mono channel**, peak
  -16 dB, no music, no VO. Bundle name:
  `audio/sfx/guild/cs_emote_archon_{n}.ogg`.
- Stems are **timbral signatures**, not full sound design — one
  recognizable instrument or texture per Archon (e.g., struck
  brass for The CoNexus; a single film-projector click for The
  Game Master). The goal is a pavlovian "Archon X just spoke"
  cue when sounds are enabled.
- Captions: each emote's optional VO snippet (≤4 words, see
  per-Archon) ships with a `.vtt` file but **the captions never
  display by default in chat** — they're surfaced only in
  hover-tooltip on the emote sticker for screen-reader and
  reduced-motion users.

**Shared implementation notes**

- **Single render per Archon, no per-guild variants.** 12 webms +
  12 mp4s + 12 jpgs (anchor stills) + 12 optional SFX stems +
  12 vtt captions = 60 files total in the emote subset.
- File naming: `videos/guild/cs_emote_archon_{n}.{webm,mp4,jpg}`,
  where `{n}` is the canonical Archon number (1–12) from
  `apps/client/src/game/archonTrainingVoices.ts`. The integer key
  matches the existing skill-to-Archon mapping so existing code
  paths can address an emote by Archon id without a new lookup.
- **In-chat rendering** (`GuildPage.tsx` Comms tab + any future
  DM thread): emotes render as `<video autoplay muted loop
  playsinline>` inline. The webm is preferred (alpha channel);
  fall back to mp4 with no alpha against a chat-bubble-colored
  matte. At very small chat-density (more than ~6 sticker
  instances visible at once), the player automatically pauses
  all emote playback and freezes them on the anchor still
  (saves CPU; click-to-resume on hover).
- **Reduced-motion fallback:** anchor still rendered as a static
  PNG (with alpha) in place of the video. The captioned tooltip
  on hover delivers the verb as text ("The Watcher blinks",
  "The Forge sparks", etc.).
- **Authoring cadence:** the 12 emotes can be rendered in a
  single Veo 3.1 batch since they share the green-screen plate
  and the locked camera. Estimated ~30 minutes total Veo wall
  time for the full set.
- **Per-Archon authoring chunks:** F.2.4.a (CoNexus / Chorus)
  through F.2.4.l (The Human / Architect's Study) follow in
  subsequent commits — one Archon per chunk to keep diffs
  reviewable at the per-Archon level. Each chunk specifies only
  the differences from this shared template.

##### F.2.4.a — `cs_emote_archon_1` — The CoNexus / The Chorus

| Field | Value |
|---|---|
| Skill | leadership |
| Color | indigo `#818cf8` (accent), `#5b6cf2` deeper inner-fill |
| Material override | flat with a single glass highlight on the upper-left arc of the outer ring (cinematic Chorus is glass; emote is one step simpler) |
| Signature glyph | A two-pronged tuning fork seen head-on, prongs vertical, base pointing down, enclosed inside a thin concentric circle (the "resonance ring") at 1.6× the fork's height. Both fork and ring are line-art, 4 px stroke at 512 res, no fill. The fork sits centered inside the ring with 8 px clearance between prong tips and ring's inner edge. |
| Motion verb | **ring-and-pulse** — single closed cycle: at frame 0 the glyph is at rest; at frame 6 (250 ms) the resonance ring expands outward by 4% then snaps back; at frame 12 (500 ms) the fork prongs vibrate laterally ±2 px for 250 ms (6 micro-oscillations); at frame 24 (1.0 s) a single concentric ring of light emanates from the fork's center, expands to and dissolves through the resonance ring by frame 32 (1.33 s); frames 32–38 (1.33–1.6 s) the glyph holds at rest, identical to frame 0. |
| Atmospheric beat | 3 small indigo motes orbit the glyph clockwise once around the resonance ring across the full 1.6 s, evenly spaced at 120°. |
| SFX timbre | A struck brass tuning fork hit on frame 0 (single mallet strike, fundamental F4, indigo-tinted via slow flange), -16 dB peak, 1.4 s overtone tail. No second hit. The orbiting motes get a barely-audible airy whoosh layer (granular brass sustain, -22 dB). |
| VO snippet | `chorusVoManifest.json` line `chorus_emote_001` [NEW]: "Sync to me." Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This is the platform's most-used emote in playtest expectations (leadership/orchestration tone fits guild coordination naturally) — render at full 512 res with extra anti-aliasing pass. The orbiting-motes cycle period must divide evenly into 1.6 s so the loop is seamless; verify via frame-by-frame diff in Veo's preview before publishing. |

##### F.2.4.b — `cs_emote_archon_2` — The Watcher / The Eyes

| Field | Value |
|---|---|
| Skill | perception |
| Color | slate `#a1a1aa` (accent), `#71717a` deeper inner-fill, plus a single hairline of red `#ef4444` at 60% opacity along the pupil's vertical axis (the targeting-laser hint that distinguishes The Watcher from a passive observer) |
| Material override | flat with a single retro scanline pass at 8% opacity across the eye-lens only (cinematic Eyes is flat; emote keeps flat but adds a faint surveillance overlay so the glyph reads as "equipment, not creature") |
| Signature glyph | A horizontal almond-shaped lens (camera-iris geometry, not human eye), 4 px stroke line-art, with a concentric small target-reticle pupil at center (two nested circles, inner solid slate, outer ring slate). The whole eye sits inside a square reticle frame with corner brackets at the four corners (each bracket is two perpendicular 3 px line segments forming an "L"). 8 px clearance between eye edges and reticle frame. |
| Motion verb | **lock-and-blink** — single closed cycle: frames 0–4 (0–167 ms) reticle brackets are at rest at the canvas's outer 8 px margin; frames 4–10 (167–417 ms) the four corner brackets travel inward 6 px each (lock-on tighten) and the red pupil hairline brightens from 60% to 100%; frames 10–16 (417–667 ms) a horizontal eyelid line (slate, 3 px stroke) sweeps top-to-bottom across the eye-lens, fully closing it by frame 16; frames 16–18 (667–750 ms) the eye is closed (a single horizontal slate line where the eye was — held 83 ms); frames 18–24 (750 ms–1.0 s) the eyelid sweeps back up; frames 24–34 (1.0–1.42 s) the corner brackets travel back outward to their original 8 px margin and the red hairline dims back to 60%; frames 34–38 (1.42–1.6 s) hold at rest, identical to frame 0. |
| Atmospheric beat | A single horizontal scanline (3 px tall, 12% opacity slate) sweeps top-to-bottom across the entire canvas once during the loop, taking 1.6 s — perfectly matched to the loop length so its position at frame 38 equals its position at frame 0 (off-canvas, just below the bottom edge, about to wrap). |
| SFX timbre | A two-stage mechanical sound: a faint servo-whir on the bracket lock-on at frame 4 (-18 dB, 200 ms), then a single soft camera-shutter snap on the eyelid close at frame 10 (-14 dB, 80 ms, no tail). Bracket-out and eyelid-up are silent — only the lock-on and the close get a sound, so the emote reads as deliberate. The scanline sweep is silent. |
| VO snippet | `watcherVoManifest.json` line `watcher_emote_001` [NEW]: "Seen." Single dry word, ~300 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "+1 / I see you" reaction** in chat — the lock-and-blink reads as acknowledgement, not surveillance threat, when stacked under a teammate's message. Reserve the dark-tone surveillance read for the signature-ability cutscene `cs_sig_2` instead. The red pupil hairline must remain at 100% during the closed-eyelid frames (16–18) so the threat hint persists even when the lens is hidden — visible only as a thin 3 px red dash bisecting the eyelid line. |

##### F.2.4.c — `cs_emote_archon_3` — The Collector / The Archive

| Field | Value |
|---|---|
| Skill | espionage |
| Color | amber `#fbbf24` (accent), `#d97706` deeper inner-fill, with a single warm cream `#F4E4B8` highlight on the gem's upper-left facet |
| Material override | retro at half-strength — keep CRT scanlines on the gem only at 8% opacity, but **drop the VHS chroma bleed** that the cinematic Archive material carries. The setting (claw prongs) reads as solid metal, no overlay. |
| Signature glyph | A faceted teardrop-cut gem (apex pointing up, broad base down, four visible facets) held in a thin three-prong claw setting at its base. The gem itself is amber, semi-translucent (the inner-glyph reveal shows through it). The claw setting is matte slate-grey `#71717a`, 3 px stroke line-art with subtle thickness variation suggesting hammered metal. No band, no chain — the gem floats alone in its prongs. Total glyph footprint occupies the center 55% of the 512×512 canvas. |
| Motion verb | **gem-pulse-and-glimpse** — single closed cycle: frames 0–4 (0–167 ms) gem at rest, inner amber glow at 30%; frames 4–14 (167–583 ms) the gem's inner glow ramps from 30% to 100% in a slow swell while the gem itself remains motionless (no rotation); frames 14–22 (583–917 ms) a small abstract sigil (a single procedurally-deterministic glyph derived from a seed shared by all 12 emotes — looks like proto-cuneiform, no readable language) flickers into visibility **inside** the gem at 70% opacity, holding for 333 ms; frames 22–28 (917 ms–1.17 s) the inner sigil fades to 0% over 250 ms; frames 28–34 (1.17–1.42 s) the inner glow ramps back from 100% to 30%; frames 34–38 (1.42–1.6 s) hold at rest, identical to frame 0. The gem itself **never moves** — only the inner illumination changes. |
| Atmospheric beat | Three small amber dust motes drift downward from above the gem's apex (gravity-fed, not orbiting), spawning at 200 ms intervals starting at t=0 and disappearing as they cross the gem's base by t=1.6s. The bottom-most mote at frame 38 occupies the same canvas position as the top-most mote at frame 0 — that's how the loop seams. |
| SFX timbre | A dry vinyl-crackle pad runs at -22 dB across the full 1.6 s (continuous, the Archive's "the past is being read" texture). A single soft amber bell-chime on the inner-sigil reveal at frame 14 (-14 dB, F#5, 1.2 s decay tail). A faint paper-rustle (granular-stretched) accompanies the gem's inner-glow swell from frames 4–14 (-20 dB peak). |
| VO snippet | `collectorVoManifest.json` line `collector_emote_001` [NEW]: "Catalogued." Single dry word with a hint of dusty satisfaction, ~600 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | The procedurally-deterministic inner sigil shape **must** be the same shape across every render of this emote (no randomization at gen time) — it is the Collector's personal mark, the player should learn to recognize it. The shape is generated once at authoring time from a fixed seed (`seed = 0x3A1C` per established convention for Archon 3) and frozen in the asset. Future re-renders for asset refresh must reuse the same seed. The dust motes' brownian noise IS allowed to vary per render. |

##### F.2.4.d — `cs_emote_archon_4` — The Vortex / The Between

| Field | Value |
|---|---|
| Skill | intuition |
| Color | fuchsia `#e879f9` (accent), `#a21caf` deeper inner-fill, with a single magenta-white `#fdf4ff` shimmer-line that runs along the door-gap |
| Material override | flat-with-translucency — the door-frame is solid line-art, but the sliver-gap reads as glass-translucent so the "elsewhere" hint shows through. (Cinematic Between is glass; emote drops the volumetric inside-the-frame circuit traces and keeps only the gap-shimmer.) |
| Signature glyph | A vertical rectangular door-frame, 4 px stroke line-art, occupying the center-third of the canvas with 6:11 aspect (taller than wide). The door panel itself is **slightly ajar** — pivoted 8° at its right hinge — revealing a 14 px-wide sliver of "elsewhere" (a vertical band of fuchsia gradient running from `#e879f9` at top to `#a21caf` at bottom, with the magenta-white shimmer-line bisecting it horizontally at the gap's vertical mid-point). No handle, no hinges visible — the frame is the geometry, the gap is the subject. |
| Motion verb | **phase-flicker** — single closed cycle: frames 0–6 (0–250 ms) door at rest at 8° ajar, shimmer-line at horizontal mid-point holding still; frames 6–14 (250–583 ms) door pivots open further from 8° to 18° (the gap widens to 30 px) while the shimmer-line drifts upward by 4 px; frames 14–18 (583–750 ms) the entire glyph **stutters** — three rapid 1-frame phase-jumps where the door alternates between fully closed (0°) and 18° ajar (alternating frames 14, 15, 16, 17, 18 = open, closed, open, closed, open), the shimmer-line briefly disappears during the closed frames; frames 18–28 (750 ms–1.17 s) door pivots back from 18° to 8°, shimmer-line drifts back to mid-point; frames 28–38 (1.17–1.6 s) hold at 8° ajar, identical to frame 0. The "elsewhere" gradient inside the gap **never animates** — only the door-pivot and shimmer-line position change. |
| Atmospheric beat | A single fuchsia mote spawns just outside the right edge of the door-gap at frame 6, drifts horizontally to the left across the gap, and exits through the left edge at frame 30 (1.25 s travel) — visually as if "something passed through from elsewhere." This mote is the loop-seam anchor: at frame 38 a new mote spawns at the same right-edge starting position, ready for frame 0 of the next loop. |
| SFX timbre | A continuous airy hush at -22 dB across the full 1.6 s (the Between's ambient "the seam is open" texture, made from filtered pink noise pitched at 220 Hz). Three sharp dimensional-pop ticks aligned to the phase-jump frames at 14, 16, 18 (each -14 dB, 40 ms, no tail, slightly different fuchsia-tinted timbre — suggesting the door is briefly elsewhere, not just opening and closing). The drifting mote gets a barely-audible doppler-shifted tone-glide from F5 down to D5 across its 1 s travel (-20 dB peak). |
| VO snippet | `archonVoManifest.json` (or `betweenVoManifest.json` [NEW manifest]) line `between_emote_001` [NEW]: "Elsewhere." Single word, breath-half-spoken, ~700 ms with a slight reverb tail suggesting the speaker isn't fully present. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | The phase-jump stutter is the **single most identifiable** visual gimmick across all 12 emotes — keep it crisp at 24 fps and don't soften the frame transitions with motion-blur during gen. Reduced-motion users are particularly sensitive to phase-stutter content; the static-PNG fallback for this emote should pick the **8°-ajar at-rest pose** rather than mid-stutter to avoid implying flicker. The door-frame line-art must be pixel-perfect at 64×64 chat-display size — verify by zoom-out preview before publishing. |

##### F.2.4.e — `cs_emote_archon_5` — The Meme / The Influencers

| Field | Value |
|---|---|
| Skill | empathy |
| Color | pink `#f472b6` (accent), `#be185d` deeper inner-fill, with a thin warm cream `#F4E4B8` highlight on the leading edge of the outermost ripple |
| Material override | clean flat, no overlay — the emote reads as a UI ping, not a material object. (Cinematic Influencers is flat; emote keeps flat at full strength.) |
| Signature glyph | A small solid pink dot (10 px diameter) at canvas center, surrounded by three concentric ring-ripples at rest radii of 80, 140, and 200 px. Each ripple is a 3 px-stroke line-art ring at decreasing opacity outward (innermost 100%, middle 65%, outermost 30%). The composition reads as a single "ping" or sonar return. No additional geometry. |
| Motion verb | **ripple-pulse** — single closed cycle: frames 0–4 (0–167 ms) center dot at rest, three rings holding their stable radii; frames 4–8 (167–333 ms) center dot expands to 16 px and pulses brighter to a near-white pink `#fdf2f8` core; frames 8–24 (333 ms–1.0 s) **a fourth ripple** spawns at the dot's edge and expands outward, easing out — passing through the 80 px innermost ring at frame 12, the 140 px middle ring at frame 18, and the 200 px outermost ring at frame 24, fading from 100% opacity at spawn to 0% at the canvas edge; frames 24–34 (1.0–1.42 s) center dot returns to 10 px, three stable rings hold steady; frames 34–38 (1.42–1.6 s) hold at rest, identical to frame 0. The three at-rest rings **never move** — only the center dot's pulse and the spawned fourth ripple animate. |
| Atmospheric beat | None — the spawning fourth ripple **is** the atmospheric content. Adding additional particles would clutter the ping read at 64×64 chat size. |
| SFX timbre | A single soft heart-thud kick on the center dot's pulse at frame 4 (-14 dB, 60 Hz fundamental, 200 ms tail with a tape-saturated edge). A rising harmonic-resonance swell layered underneath the ripple expansion from frames 8–24 (-18 dB peak, F4 chord with 4ths and 5ths, no thirds — "open" harmony, not happy or sad). The at-rest first 4 frames and final 4 frames are silent — the emote breathes around the pulse. |
| VO snippet | `memeVoManifest.json` line `meme_emote_001` [NEW]: "Feel that." Half-whispered, conspiratorial, ~700 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "this resonates"** chat reaction — the spreading ripple intentionally mimics the visual language of the Influencers' viral-spread mechanic. When stacked (multiple players hit it on the same message), the auto-collapse multiplier should display in **pink** rather than the default neutral so the visual language stays in-faction. Verify the fourth ripple's outermost frame fades to true 0% opacity (not 1%) before reaching the canvas edge — any residual ripple at frame 24 will become a visible artifact at frame 0 of the next loop. |

##### F.2.4.f — `cs_emote_archon_6` — The Warlord / The Yellow Coats

| Field | Value |
|---|---|
| Skill | tactics |
| Color | yellow `#facc15` (accent), `#a16207` deeper inner-fill, with three thin warm cream `#F4E4B8` hash-mark vectors radiating from the chevron apex |
| Material override | clean flat, crisp geometry, no overlay — the emote reads as a tactical HUD element. (Cinematic Yellow Coats is flat; emote keeps flat at full strength.) |
| Signature glyph | An upward-pointing chevron — two solid yellow beveled bars (each 60 px long, 12 px thick) intersecting at a 60° apex angle at the center-top of the canvas. From the apex, three thin cream hash-mark vectors fan outward at 30° spread (one straight up, one 15° left of vertical, one 15° right) — each hash-mark is 3 px stroke, 50 px long, with a single 4 px tick at its tip suggesting a measurement endpoint. The composition reads as a force-projection vector diagram, not a heraldic chevron. |
| Motion verb | **project-and-lock** — single closed cycle: frames 0–4 (0–167 ms) chevron at rest, three hash-marks at full extension; frames 4–10 (167–417 ms) the three hash-marks **retract** inward toward the apex (50 px → 20 px length), tips dimming to 30% — reading as "vectors gathering"; frames 10–14 (417–583 ms) hash-marks hold at 20 px in their gathered state for 167 ms — the tactical "decision pause"; frames 14–22 (583–917 ms) all three hash-marks **snap back outward** to 60 px length (10 px longer than at-rest, indicating fresh lock-on) with their tips brightening to 100% and gaining a single yellow particle-flash at each tip; frames 22–32 (917 ms–1.33 s) hash-marks settle from 60 px back down to 50 px at-rest length, particle flashes fade; frames 32–38 (1.33–1.6 s) hold at rest, identical to frame 0. The chevron itself never moves — only the hash-mark vectors animate. |
| Atmospheric beat | A faint yellow grid-floor effect: a single horizontal grid line drifts upward across the canvas's lower third (8% opacity, 24 px below the chevron base at frame 0, drifting up to the chevron's lower edge by frame 38 then resetting off-canvas). Reads as a subtle tactical-display backdrop, almost imperceptible at 64×64 but adds depth at hover-128 size. |
| SFX timbre | A crisp mechanical "click-clack" servo-tick on the hash-mark retraction at frame 4 (-16 dB, 80 ms, no tail). Three rapid-fire tactical comm chirps on the snap-back at frames 14, 18, 22 (each -14 dB, 40 ms, square-wave-tinted, ascending in pitch — A4, C5, E5 — for "lock acquired" cadence). The decision-pause at frames 10–14 is **silent** so the snap-back chirps land hard. The grid-line drift is silent. |
| VO snippet | `warlordVoManifest.json` line `warlord_emote_001` [NEW]: "Counted." Single dry word, parade-ground crisp, ~400 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "noted / understood / on it"** chat reaction — the snap-and-lock cadence reads as confirmation of orders, not aggression. The chevron geometry must remain readable as a tactical vector at 64×64 chat size — the three hash-marks are the most likely to lose legibility on small displays, so render them at minimum 3 px stroke and verify edge-clarity in zoom-out preview. The grid-floor drift is intentionally subtle; it can be omitted entirely from the reduced-motion static-PNG fallback without losing recognition. |

##### F.2.4.g — `cs_emote_archon_7` — The Politician / The Congress

| Field | Value |
|---|---|
| Skill | negotiation |
| Color | purple `#c084fc` (accent), `#7c3aed` deeper inner-fill, with a single warm cream `#F4E4B8` highlight on the upper-arc of each ring at the moment of contact |
| Material override | flat with a single glass highlight on the ring intersection during the contact frames (cinematic Congress is glass; emote drops the inner circuit traces and keeps only the contact-glint) |
| Signature glyph | Two thin line-art rings, each 80 px diameter, 4 px stroke, **interlocked**: the left ring's right edge passes through the right ring's left edge, forming the classic two-ring chain shape. Left ring is purple `#c084fc`; right ring is `#a78bfa` (one shade lighter). The interlock-seam reads as a single 12 px overlap region where the two rings cross. No fill, no third element, no text. The composition is centered and symmetric across the canvas's vertical axis. |
| Motion verb | **converge-and-seal** — single closed cycle: frames 0–4 (0–167 ms) rings at rest in their interlocked position, holding still; frames 4–12 (167–500 ms) the two rings slide horizontally toward each other by 8 px each — the interlock overlap region grows from 12 px to 28 px (rings increasingly nested); frames 12–16 (500–667 ms) at maximum overlap, a single warm cream highlight flashes along the upper arcs of both rings simultaneously (300 ms envelope, 0% → 100% → 60% hold) — the "deal sealed" beat; frames 16–28 (667 ms–1.17 s) the two rings slide back apart to the original 12 px overlap, highlight dimming to 0%; frames 28–38 (1.17–1.6 s) hold at rest, identical to frame 0. Neither ring rotates — only horizontal translation animates. |
| Atmospheric beat | A single thin purple line (3 px stroke, 30% opacity) materializes connecting the two rings' centers during the converge phase from frame 4 to frame 12 (length shortens as rings approach), then dissolves during the apart phase from frame 16 to frame 28. Reads as the negotiation's "thread of agreement" briefly visible during the seal moment. The line is not visible at frame 0 or frame 38 (so the loop seam is clean). |
| SFX timbre | A soft fabric-and-wax press sound on the ring convergence from frames 4–12 (granular-stretched, -16 dB peak at frame 12). A single bright bell-chime on the seal-flash at frame 13 (-12 dB, B5, 1.4 s decay tail). The apart phase from frames 16–28 is **silent** — the deal is done, no sound needed for the rings drifting back. |
| VO snippet | `politicianVoManifest.json` line `politician_emote_001` [NEW]: "Agreed." Single word, warm and slightly conspiratorial, ~600 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "deal / agreed / on the same page"** chat reaction — useful for confirming guild decisions or accepting a teammate's plan. The two-ring composition reuses geometry from `cs_friend_accept` deliberately so players who learned that cinematic's visual language transfer the read here (both are about agreement). Keep the seal-flash highlight contained to the upper arcs only — letting it bleed across the full ring at any frame would visually compete with the converge motion. |

##### F.2.4.h — `cs_emote_archon_8` — The Warden / The Locks

| Field | Value |
|---|---|
| Skill | paranoia |
| Color | emerald `#34d399` (accent), `#047857` deeper inner-fill, with a single thin red `#ef4444` warning hairline that pulses once at the moment of containment (the Warden's threat-detection signal) |
| Material override | clean flat — the emote reads as a security-system UI element. (Cinematic Locks is flat; emote keeps flat at full strength.) |
| Signature glyph | A regular hexagonal frame, 4 px stroke line-art, inscribed with vertices at the canvas's 12, 2, 4, 6, 8, and 10 clock positions (size occupying the center 60% of the canvas). At the hex's geometric center sits a small solid emerald dot (8 px diameter) — the "subject" being watched. Inside the hex but outside the center dot, the frame is **empty** at rest (no inner mesh, no visible containment field). 6 px clearance between dot and hex inner edges. |
| Motion verb | **cell-contain** — single closed cycle: frames 0–4 (0–167 ms) hex frame and center dot at rest; frames 4–10 (167–417 ms) a containment-mesh pattern materializes inside the hex — six thin emerald lines (3 px stroke, 60% opacity) extend inward from each vertex of the hex frame toward the center dot, stopping 4 px short of touching the dot, forming a six-spoked containment lattice (lines fade in over the 250 ms window); frames 10–14 (417–583 ms) the lattice holds steady and the red warning hairline flashes briefly along the hex's top edge (single 167 ms pulse, 0% → 100% → 0%) — "threat acknowledged, contained"; frames 14–22 (583–917 ms) the six lattice spokes retract back toward their hex vertices and fade to 0%; frames 22–34 (917 ms–1.42 s) hex frame and center dot hold at rest, no inner content; frames 34–38 (1.42–1.6 s) hold at rest, identical to frame 0. |
| Atmospheric beat | None — the lattice fade-in/fade-out is the whole show. Adding orbiting motes around a "containment" emote would visually undermine the locked-down read. |
| SFX timbre | A mechanical lock-engage click on the lattice fade-in start at frame 4 (-14 dB, 80 ms, no tail — single hard click). A faint emerald-tinted containment-field hum runs underneath frames 10–14 only (sine wave at 110 Hz with subtle ring-modulation, -22 dB, 167 ms). A second softer disengage-click on the lattice fade-out start at frame 14 (-18 dB, 80 ms, slightly higher pitched than the engage-click — the lock loosening). The red warning hairline flash at frame 11 gets **no sound** — it's a visual-only threat tag. |
| VO snippet | `wardenVoManifest.json` line `warden_emote_001` [NEW]: "Contained." Single dry word, professional security-officer tone, ~700 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "I've got this / on lockdown / handled"** chat reaction — useful when a teammate flags a problem and someone wants to claim ownership of the response. The red warning hairline flash is the **only** red element across all 12 emotes; it's a deliberate stylistic choice signaling that even friendly Warden affirmations carry a threat-detection sub-text. At 64×64 chat size, verify the red flash is still readable as an intentional accent and not a rendering artifact — bump to 4 px stroke if needed in the small-size variant. |

##### F.2.4.i — `cs_emote_archon_9` — The Game Master / The Grey Gamers

| Field | Value |
|---|---|
| Skill | authority |
| Color | blue `#60a5fa` (accent), `#1d4ed8` deeper inner-fill, with retro-tinted off-green `#86efac` highlight at 30% opacity on the cube's top face only (the GM's signature subtle "rules are negotiable" tint) |
| Material override | retro at half-strength — keep light CRT scanlines on the cube faces (8% opacity) and **drop** the VHS chroma-bleed and green-terminal-text overlays from the cinematic Grey Gamers material. The dots on the cube faces are crisp pip-circles, not retro-pixelated. |
| Signature glyph | A single die rendered in axonometric projection — 3 visible faces, equal-isometric (30°/30° offset), each face 80 px square edge length. **Top face**: one solid blue pip at center. **Front face** (lower-left): two pips on the diagonal (upper-left to lower-right). **Right face** (lower-right): three pips in a triangular cluster at the face's center. All pips are 8 px diameter solid blue, all face-edges drawn in 4 px line-art with no fill. The cube floats at canvas center with its bottom-front vertex pointing slightly down-and-forward. |
| Motion verb | **die-rolls-and-rewrites** — single closed cycle: frames 0–4 (0–167 ms) cube at rest in its 1-2-3 configuration; frames 4–18 (167–750 ms) the cube **rotates 360° about its vertical axis** (one full revolution in 14 frames, 583 ms) — and during each integer frame the visible faces' pip counts **rapidly cycle through random values** (each face shows a different 1–6 pip pattern at each new frame, never repeating the same combination twice in a row); frames 18–28 (750 ms–1.17 s) the cube continues rotating but slower (decelerating), and the pip cycling slows in lockstep — settling progressively until at frame 28 the visible faces lock back to the original 1-2-3 configuration; frames 28–38 (1.17–1.6 s) hold at rest, identical to frame 0. The cube **must** complete exactly one revolution by frame 28 so the orientation at frame 38 matches frame 0 perfectly. |
| Atmospheric beat | A single thin horizontal CRT-scanline (3 px tall, 12% opacity blue) drifts top-to-bottom across the entire canvas once over the 1.6 s loop, identical pattern to F.2.4.b's scanline but tinted blue instead of slate. This visually links Game Master and Watcher as the two retro-material Archons in the emote set. |
| SFX timbre | A single sharp die-clack on the felt at frame 4 (-12 dB, 80 ms, no tail — "the roll begins"). During the 14-frame rotation, a soft film-projector click runs at 24 fps cadence (-20 dB per click, almost subliminal — one click per frame, 14 clicks total in 583 ms) — the retro-material signature. A second slightly softer die-settle clack at frame 28 (-14 dB, 80 ms) — "the roll lands". The decel-and-settle phase from frames 18–28 has no additional SFX so the projector clicks gradually trail off as the cube slows. |
| VO snippet | `gamemasterVoManifest.json` line `gm_emote_001` [NEW]: "Rewritten." Single word delivered with dry administrative authority (consistent with `gm_contracts_weekly_001`), ~900 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "rules are mine / I'm running this / let me handle it"** chat reaction — fits guild leaders or officers asserting authority on a coordination call. The rapid pip-cycling during the rotation phase is the visual gimmick — keep the pip-pattern transitions as crisp 1-frame cuts (no cross-fade between values) so the "rewrite in progress" read is unmistakable. The decel-phase pip cycling must also slow in true lockstep with the rotation, not just slow visually — verify by single-stepping frames 18–28 and confirming the pip-pattern change rate decreases monotonically. The blue scanline drift is paired with F.2.4.b's slate scanline as a visual easter egg — players who collect both emotes notice the retro-material "twins." |

##### F.2.4.j — `cs_emote_archon_10` — The Necromancer / The Living

| Field | Value |
|---|---|
| Skill | endurance |
| Color | red `#f87171` (accent), `#991b1b` deeper inner-fill, with a single warm cream `#F4E4B8` highlight on the spike apex during the resurrection-surge frames |
| Material override | flat with a single glass highlight on the spike apex during the surge — the at-rest waveform reads flat (clinical-monitor signal) but the moment of resurrection introduces one moment of glass-translucency. (Cinematic Living is glass; emote uses the glass highlight only at the dramatic beat.) |
| Signature glyph | A horizontal ECG-style pulse waveform — a thin red line (3 px stroke) running edge-to-edge across the canvas's vertical mid-point at rest, **with a single asymmetric spike** at the canvas center: the line rises sharply 60 px upward to a peak, immediately drops 80 px below mid-line to a trough, then rebounds back to mid-line — the entire spike-and-trough complex spans just 40 px horizontally, leaving the rest of the line flat. The signature shape reads as one heartbeat against an otherwise still trace. No grid behind the line, no axis labels, no fill. |
| Motion verb | **flatline-and-revive** — single closed cycle: frames 0–4 (0–167 ms) waveform at rest with stable spike at center; frames 4–10 (167–417 ms) the spike collapses smoothly into the horizontal mid-line — peak height drops from 60 px to 0 px, trough depth drops from 80 px to 0 px, the line goes flat across the canvas; frames 10–14 (417–583 ms) line holds at perfect flat — 167 ms of "fatal moment"; frames 14–22 (583–917 ms) **a new spike grows back at the same canvas center**, peak rising from 0 px to **80 px** (taller than at-rest), trough deepening to 100 px (deeper than at-rest), and a single warm cream highlight ignites at the spike's apex (single 333 ms envelope, 0% → 100% → 60% hold) — the "Second Breath" surge; frames 22–32 (917 ms–1.33 s) the spike settles from 80 px back down to 60 px, trough from 100 px back to 80 px, cream highlight fades to 0%; frames 32–38 (1.33–1.6 s) hold at rest, identical to frame 0. |
| Atmospheric beat | A single faint red mote spawns at the spike's apex on the resurrection beat (frame 14) and drifts upward, exiting the top edge by frame 28. Reads as the Necromancer's "soul that refused to leave." This is the one mote on screen at any time. |
| SFX timbre | A clinical heartbeat-monitor pulse on the at-rest spike held for the first 4 frames (-18 dB, single 80 ms blip — characteristic ECG "beep"). On flatline at frames 10–14, a continuous **flatline tone** at A4 (-16 dB, sine wave, no modulation, held for 167 ms). On the resurrection-surge spike growth from frames 14–22, a deep heartbeat thud (-12 dB, 50 Hz fundamental, 333 ms tail with tape-saturated edge — "the body remembers how"). On the cream-highlight ignition at frame 17, a single defibrillator-like high zap (-14 dB, 60 ms, briefly bright at 1 kHz). Frames 22–38 contain only a softer return-to-at-rest heartbeat-monitor pulse (-20 dB, identical timbre to the opening). |
| VO snippet | `necromancerVoManifest.json` line `necromancer_emote_001` [NEW]: "Again." Single word delivered with weary determination, ~500 ms spoken length, slight gravel underneath. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "still here / not done / one more time"** chat reaction — useful after a teammate's tough loss or to rally for another attempt. The flatline phase at frames 10–14 is the emote's most striking beat — at chat-bubble size (64×64) the flat line will be very subtle but the SFX flatline tone carries the moment audibly even when sounds are enabled. **Sound-enabled accessibility consideration:** the flatline tone is associated with medical trauma in some users; the in-app emote-sounds toggle should include a per-emote opt-out or a clear label that this emote's audio simulates a medical monitor. The cream highlight at the apex is the **one warm color** in the entire 12-emote set — pair it visually with F.2.4.a's cream rim (Chorus) so warmth in the emote palette stays on-Archon. |

##### F.2.4.k — `cs_emote_archon_11` — The Engineer / The Forge

| Field | Value |
|---|---|
| Skill | craftsmanship |
| Color | orange `#fb923c` (accent), `#9a3412` deeper inner-fill, with bright spark-particles in pure white-yellow `#fef08a` for the tightening flash |
| Material override | clean flat — the hex-bolt reads as solid metal. (Cinematic Forge is flat; emote keeps flat at full strength.) |
| Signature glyph | A single hex-bolt seen head-on — a regular hexagonal frame (4 px stroke line-art, 100 px across the flats, vertices at 12, 2, 4, 6, 8, 10 clock positions) with a smaller concentric hex socket cut into its center (40 px across the flats, 3 px stroke). Both hexagons share the same orientation. The bolt-head face is filled with a flat `#fb923c` orange between the outer hex and the inner socket; the socket itself is empty (canvas-transparent / green-screen plate showing through). No additional geometry, no text, no thread visible. |
| Motion verb | **bolt-tighten** — single closed cycle: frames 0–4 (0–167 ms) bolt at rest in its 12-2-4-6-8-10 vertex orientation; frames 4–22 (167–917 ms) the bolt **rotates exactly 60° clockwise** around its center axis — one full hex-step (vertices land back at 12-2-4-6-8-10 by the rotation's end since hex symmetry brings them home), easing-in then easing-out, taking 750 ms; frames 22–28 (917 ms–1.17 s) at the moment of rotation completion, **three short white-yellow spark particles** burst outward from the inner socket's edges (one each at the socket's 12, 4, and 8 clock positions), traveling 30 px outward from the socket and fading to 0% over 250 ms; frames 28–38 (1.17–1.6 s) hold at rest, identical to frame 0 — the bolt has rotated a full 60° and lands in its visually-identical hex orientation, making the loop seamless even though work was performed. |
| Atmospheric beat | A faint orange ember-mote drifts upward across the canvas's right edge throughout the loop (8% opacity, slow drift at 4 cm/s visual rate). Spawns at the canvas's bottom-right corner at frame 0, exits the top-right corner by frame 38 — its position at frame 38 equals the spawn position of frame 0's mote, making the seam clean. |
| SFX timbre | A continuous quiet metal-on-metal grinding torque sound underneath the rotation from frames 4–22 (granular friction-noise pitched in the C2 register, -20 dB, no peak). Three crisp wrench-click ticks at evenly-spaced moments during the rotation: frame 8 (-14 dB), frame 14 (-13 dB), frame 20 (-12 dB) — the "click click click" of a ratcheting socket wrench, increasing slightly in intensity. A single bright spark-flash on the rotation-completion beat at frame 22 (-12 dB, broadband white-noise burst, 60 ms, no tail). The held-rest frames at the end of the loop are silent except for the ember-mote drift, which is itself silent. |
| VO snippet | `engineerVoManifest.json` line `engineer_emote_001` [NEW]: "Fixed." Single dry word with workshop-floor satisfaction underneath, ~500 ms spoken length. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "done / handled / patched / shipped"** chat reaction — fits closing out a guild task, fixing a broken plan, or signaling completion of a hand-off. The 60° rotation is the cleanest possible "the bolt turned" loop: hex symmetry means frame 0 and frame 38 are pixel-equivalent without any cheating, while still showing real work happened. Verify the rotation interpolation is true 24fps (not 30fps blended) so the wrench-click ticks land precisely on the visual position changes. The ember-mote drift at the canvas's right edge is the **most likely** atmospheric element to violate the loop seam — verify pixel-exact position match between frame 0 and frame 38 in the green-screen channel before the colorkey pass. |

##### F.2.4.l — `cs_emote_archon_12` — The Human / The Architect's Study

| Field | Value |
|---|---|
| Skill | lore |
| Color | stone `#a8a29e` (accent), `#57534e` deeper inner-fill, with vellum cream `#F4E4B8` for the scroll's parchment surface |
| Material override | retro at half-strength — keep light CRT scanlines on the scroll's parchment surface only (8% opacity), and **drop** the green-terminal-text overlay from the cinematic Architect's Study material. The scroll's wooden rollers read as solid stained wood, no overlay. |
| Signature glyph | A horizontal scroll viewed from a slight 15° elevated angle, partially unrolled, with rollers at both ends. The visible parchment surface stretches across the canvas's central horizontal band (340 px wide × 120 px tall at the at-rest pose). The two end-rollers are short cylinders (40 px wide × 80 px tall, drawn in line-art with subtle wood-grain hatching). On the visible parchment surface sit **three short rows of abstract glyph-marks** — squiggle-line strokes evoking proto-cuneiform or unreadable ancient script (3 px stroke, stone-grey, randomly varied lengths but **deterministically seeded** so all renders match). The center 30% of the parchment is empty space (no glyphs) — this is the "next reveal" target zone. |
| Motion verb | **scroll-unfurl-and-find** — single closed cycle: frames 0–4 (0–167 ms) scroll at rest, three at-rest glyph rows visible, center zone empty; frames 4–14 (167–583 ms) the **left roller rotates** counter-clockwise (rolling itself) and **the right roller stays still** — pulling more parchment leftward across the visible surface — the at-rest glyph rows drift 40 px leftward (one row exiting off the left side, two rows shifting left) and **a new fourth row of glyphs scrolls into view from the right** entering the previously-empty center zone; frames 14–22 (583–917 ms) the new center row holds visible and a single soft cream highlight pulses on its glyphs (333 ms envelope, 0% → 100% → 60% hold) — the "found it" beat; frames 22–34 (917 ms–1.42 s) the right roller now rotates clockwise pulling the parchment **back rightward** — the new row scrolls back off-canvas to the right and the original three rows slide back into their starting positions; frames 34–38 (1.42–1.6 s) hold at rest, identical to frame 0. |
| Atmospheric beat | Two slow dust motes drift downward across the scroll's surface (gravity-fed, like Collector's emote — visually links the two retro-archive Archons). Spawn at canvas top at frames 0 and 20 respectively, drift down at 6 cm/s, exit canvas bottom by frames 28 and 48. The frame-48 mote is technically beyond loop end, so it's just the frame-0 mote of the next loop — the seam is built in. |
| SFX timbre | A continuous parchment-rustle granular texture runs underneath the unrolling phase from frames 4–14 (-18 dB, dry paper-on-paper friction noise). The roller rotation itself adds a quiet wooden-shaft creak (granular wooden-stretch noise, -22 dB, frames 4–14). On the cream-highlight pulse at frame 16, a single soft amber bell-chime (similar timbre to the Collector's emote chime but **lower pitched at D5** rather than F#5, distinguishing the two retro Archons audibly), -14 dB, 1.2 s decay tail. The reverse-roll phase from frames 22–34 reuses the parchment-rustle and wooden-creak at lower volume (-22 dB) — "putting it back the way I found it." |
| VO snippet | `humanVoManifest.json` line `human_emote_001` [NEW]: "There." Single word with the satisfied quietness of a librarian who just found the right page, ~600 ms spoken length, slightly breathy. Hover-tooltip caption only; never auto-plays. |
| Per-Archon notes | This emote is **functionally a "found it / here's the reference / look at this"** chat reaction — fits sharing intel, lore citations, or pointing teammates at a teaching moment. The deterministic glyph-mark seed (`seed = 0x4C2E` per established convention for Archon 12) is shared across all renders — like Collector's emote, the at-rest scroll's glyph patterns must remain pixel-identical between asset refreshes so players who've memorized them recognize the scroll. The new fourth row of glyphs that reveals during the unfurl phase uses a **separate fixed seed** (`seed = 0x4C2F`) so it's also deterministic but visually distinct from the at-rest rows. The two-mote dust-drift visually pairs this emote with F.2.4.c (Collector / Archive) — both emotes' atmospheric content is gravity-fed downward dust, marking them as the two "archive-keeper" Archons. |

#### F.2.5 — `cs_donation_milestone`

| Field | Value |
|---|---|
| Trigger | `guild.donate` mutation crosses a treasury tier threshold (1k, 5k, 10k, 25k, 50k, 100k, 250k, 500k, 1M Dream — same tiers used by guild-level XP thresholds in `apps/server/routers/guild.ts`). The crossing is detected server-side by comparing pre/post treasury values against the threshold list; only the **highest** crossed threshold per single donation fires the cutscene (a single 100k donation that crosses 1k, 5k, 10k, 25k, 50k, and 100k all at once plays only the 100k variant). |
| Duration | 4.0 s |
| Broadcast scope | Caster (donating member) fullscreen + guild WS room chat card. Other guildmates see "{donor} pushed us past {tier}" inline as the chat card. |
| Anchor object | The treasury vault's open circular mouth at frame center, present and identical-positioned in both stills (only its contents and inner glow evolve) |
| Material | glass (the coins are dream-substance, semi-translucent; the vault is solid stone but its interior depths are abyssal-glass) |
| House palette | Joined guild's hex from the per-guild table — the coin's surface, the vault's inner glow, and the splash particles all carry the guild's accent color |

**Nano Banana start frame** —
`videos/guild/cs_donation_milestone_start.jpg`
1. Subject and pose: viewed from a 45° elevated angle, a single circular
   stone vault-mouth (1.4 m visual diameter) recessed into a polished obsidian
   floor, occupying the center two-thirds of the frame's lower portion. Above
   the vault's mouth, hovering 60 cm overhead and centered, floats **a single
   large dream-coin** — 14 cm visual diameter, perfectly circular, edge-on to
   camera (so it reads as a thin ellipse), slowly rotating about its vertical
   axis. The coin's surface bears an abstract impressed glyph (no readable
   text) at its center, identical to the Phase 6 emblem-component kit's
   default frame so the dream-coin reads as official guild currency. The
   vault's interior, visible through its mouth, is a deep abyssal recess —
   no bottom visible.
2. Environment: the polished obsidian floor reflects faintly. Foreground:
   the floor's near edge, sharp focus. Midground: vault mouth and hovering
   coin. Background: a wider sense of vault-chamber walls receding into
   darkness, soft-focus.
3. Lighting: single warm key from upper-right at 35°, color-temperature
   3500K. The vault interior self-illuminates faintly in the joined guild's
   hex at 20% (a "the vault is alive" hint). The hovering coin catches a
   bright specular highlight on its upper rim from the key. Lens flare
   anchor: the coin's upper-rim specular.
4. Color callouts: floor and walls in deep-space `#010020`, vault stone in
   slate `#3A4A5E`, coin surface in glass-translucent guild hex (cite at
   gen time), vault interior glow in guild hex at 20%, key warmth at
   `#F4E4B8` 30%.
5. Material: glass — the coin reads as translucent dream-substance,
   circuit traces visible faintly across its face. The vault stone reads
   solid (no overlay).
6. Atmosphere: very light volumetric haze at vault-mouth interior (15%
   density, drifting upward as if the vault breathes). No external
   particles.
7. Camera: 35mm, slightly raised eye-level (1.9 m), tilted 45° down toward
   the vault mouth, centered on the vault's vertical axis.
8. Negative prompt: no rendered text, no readable coin face, no logos, no
   visible vault-bottom, no human hands, no pile of coins inside the vault
   yet (reserved for end frame), no second coin, no specific currency
   imagery (no real-world coins, no embossed numbers).

**Nano Banana end frame** —
`videos/guild/cs_donation_milestone_end.jpg`
1. Subject and pose: same vault, identical framing (continuity anchor). The
   hovering coin is **gone** — it has fallen into the vault. Inside the
   vault's recess, a small mounded pile of stacked dream-coins is now
   visible at the previously-empty bottom (12–18 coins stacked roughly,
   none individually readable, total mass occupying the center 25% of the
   vault-mouth's visible interior). The vault's interior glow has lifted
   from 20% to 70%, washing the immediate surroundings of the vault-mouth
   in guild-hex light. A handful of glass-translucent splash particles
   (small hex-shaped fragments of dream-substance, 8 px each, guild-hex
   tinted) hover briefly above the vault mouth as if just upthrown by the
   coin's impact.
2. Environment: identical chamber, identical floor reflectivity (the
   reflectivity now picks up the brightened guild-hex glow from the vault).
3. Lighting: the warm key from upper-right has dimmed to 70% — the vault's
   own self-illumination has taken over as the dominant light source. The
   vault interior glow is the brightest single element — lens flare anchor
   (single anamorphic streak at 18°, 60% intensity, oriented along the
   vault-mouth's upper edge).
4. Color callouts: floor still `#010020`, vault stone still slate `#3A4A5E`,
   pile of coins in glass-translucent guild hex with subtle individual coin
   edges visible, vault glow guild hex at 70%, splash particles guild hex
   at 80% with edge-rim warm cream `#F4E4B8` at 100%.
5. Material: glass throughout — pile of coins reads as a small mound of
   translucent dream-substance.
6. Atmosphere: vault-mouth haze density up to 25% (more "vault-breath" from
   the impact). Splash particles are the only external particle activity
   in the still — they're held mid-flight, suspended, ready to dissolve.
7. Camera: identical 35mm 1.9m 45°-down framing (continuity).
8. Negative prompt: same as start, plus: no readable coin pile total
   (count not implied numerically), no readable text on splash particles,
   no second hovering coin above (the dropped one is the only coin), no
   specific real-world currency.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 35mm push-in along the vault's vertical axis, 0.10 m
   total downward travel over 4 s, no roll, no pan. Easing: ease-out (the
   camera arrives just before the coin lands). The push-in mirrors and
   echoes the coin's fall.
2. Subject motion: at t=0.0s the hovering coin holds in place, rotating
   slowly. At t=0.4s the coin's rotation accelerates and it tilts from
   edge-on to face-down toward the vault. Between t=0.4s and t=1.6s the
   coin **falls** into the vault — accelerating under gravity, rotating
   1.5 turns during its descent, disappearing into the vault mouth at
   t=1.6s. At the moment of impact (t=1.6s) the splash particles burst
   outward (8 particles, ~30 px upward and outward), and the vault's
   interior glow ramps from 20% to 70% over 800 ms (t=1.6s–2.4s). Between
   t=2.4s and t=3.0s the splash particles dissolve to 0% opacity. Between
   t=3.0s and t=4.0s the brighter vault glow holds steady — the milestone
   is locked in. The pile of coins becomes visible at the vault's bottom
   between t=2.0s and t=2.8s (cross-fade reveal as the glow brightens).
3. Atmospheric beat: the vault-mouth haze breathes upward at constant
   4 cm/s throughout. After impact at t=1.6s, the haze briefly
   intensifies to 30% density between t=1.6s and t=2.0s before settling
   back to 25%.
4. Audio cue ties: coin fall maps 1:1 to a rising tone-glide; impact
   lands on a percussive timpani-and-cymbal hit; vault glow ramp rides a
   sustained low-strings swell; the hold-steady tableau plays under the
   bed's resolving cadence.
5. Negative motion prompt: no whip pans, no zoom-out, no second coin, no
   specific milestone-tier number burst (HTML chrome handles that), no
   character speech beyond the VO line, no over-shoot bounce on the coin
   landing.

**VFX**
- Coin fall: positional-tween with rotation, sub-pixel motion blur during
  the 1.2 s fall, cubic-in-out easing.
- Impact splash: 8 GPU-instanced glass-hex sprites (each 8 px, alpha
  fade 1.4 s lifetime, additive blend, guild-hex tinted with cream rim).
- Vault interior glow ramp: shader-driven emissive on the vault recess
  geometry, 800 ms envelope.
- Coin pile reveal: cross-fade between empty-vault layer and coin-pile
  layer, 800 ms cross-fade window timed to overlap the glow-ramp peak.
- Vault-mouth haze: existing volumetric fog system, density-keyed
  animation curve.
- Single anamorphic lens flare on the vault-mouth's upper edge, ramps
  in 1.6–2.4s, holds to clip end.

**SFX** (`audio/sfx/guild/cs_donation_milestone.ogg`)
- Sub: a deep treasury-vault cathedral drone, 50 Hz fundamental, 4 s
  sustain, ramping from -20 dB to -14 dB across the clip.
- Mid: a rising tone-glide tracking the coin's fall from t=0.4s to
  t=1.6s (sine wave glissando from G3 to A4, -16 dB peak). A satisfying
  low timpani-and-cymbal hit on impact at t=1.6s (-10 dB, 600 ms
  decay tail). A cascade of glass-chime tings from the splash particles
  staggered between t=1.6s and t=2.0s (8 chimes, ascending pentatonic
  C-D-E-G-A across two octaves, summed -12 dB, 1.6 s overall tail).
- Top: a sustained brass shimmer ramping in 1.6–3.0s (-14 dB peak,
  House-keyed major triad — Resonance F-major, Umbra D-minor,
  Ironflight A-minor with raised 4th, Liminal G whole-tone).
- Transient: a low felt-not-heard kick at t=1.6s under the timpani
  hit (-12 dB, 60 Hz, 200 ms).

**Music** (`music/guild/cs_donation_milestone_bed.ogg`)
- 4 s through-composed bed at 76 BPM, in F Lydian (matching the
  weekly-contract bed series so contracts and donations share an
  audible "guild-economy" mode signature). The bed builds toward a
  resolving authentic cadence at t=2.4s as the vault glow lifts.
- Instrumentation: pipe organ pad, low strings sustain, a single
  bowed-harp-glissando timed to the coin's fall (t=0.4s–1.6s), and
  one struck low gong on the impact (t=1.6s).
- -18 LUFS, 48 kHz stereo. Ducks -6 dB under VO.

**VO** (`elaraVoManifest.json` line `elara_donation_milestone_001` [NEW])
- Line: "The vault remembers. Your name is in it now."
- Delivery: warm pride underneath dry administrative satisfaction
  (consistent with Elara's other guild lines), ~2.6 s spoken length.
  Lands at t=1.6s (synchronized with the coin impact) so the line
  completes by t=4.0s as the bed reaches its outro.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- **Single mp4 + runtime CSS color filter** — same trick used for
  `cs_guild_first_message` and `cs_contract_complete`. The coin
  surface, vault glow, and splash-particle layers are rendered at
  neutral cyan, color-filtered to the joined guild's hex at runtime
  in `CutscenePlayer.tsx`. Saves 11 of 12 renders.
- **Per-tier visual variants** — the cutscene plays for **all** tier
  thresholds, but the bigger the milestone, the bigger the visual
  payoff. Implemented via three runtime overlays applied on top of the
  mp4 in `CutscenePlayer.tsx`:
  - 1k / 5k tiers: base mp4 plays as authored (single coin, 12-coin pile
    reveal, no extras).
  - 10k / 25k / 50k tiers: a small additional "shower" of 4 secondary
    coins falls behind the primary coin during t=1.0s–1.8s (HTML
    overlay, no re-render needed) — saved sprite-sheet at
    `art/vfx/dream_coin_shower.webp`.
  - 100k / 250k / 500k / 1M tiers: the secondary-coin shower bumps up
    to 12 coins, the vault-glow ramp peaks at 100% instead of 70%
    (CSS filter override), and the pile reveal includes a brief
    "milestone seal" stamp atop the pile (composited SVG of the
    Phase 6 emblem, identical to `cs_contract_complete`'s wax-stamp
    asset reused).
- WS broadcast payload: `{ cutsceneId: "cs_donation_milestone",
  actorUserId, guildId, tier, treasuryAfter, treasuryDelta }`. The
  inline chat card uses the start frame poster and overlays the tier
  label as HTML chrome.
- **Stack policy** — if multiple milestone-crossings happen in a single
  session (e.g., a player donates a huge sum that crosses several
  tiers, server picks the highest; or several members donate in
  rapid succession across tiers), only the first plays fullscreen for
  each receiving viewer; subsequent crossings within 60 s emit a
  smaller "coin-into-vault" toast that reuses the impact SFX layer
  (no mp4). Same pattern as `cs_contract_complete` stacked claims.
- Reduced-motion fallback: end frame as static poster + caption +
  SFX bundle (the timpani-and-cymbal impact carries the milestone
  beat alone well).
- Pairs with `GuildPage.tsx` Treasury tab — clicking the post-clip
  dismiss button lands the donor on `/guild/treasury` so they can
  see the new total. Other guildmates' chat-card click navigates
  the same route.

### F.3 Combat & wars (8 entries, 12 sub-clips)

#### F.3.1 — `cs_war_declared`

| Field | Value |
|---|---|
| Trigger | Either: (a) admin creates a faction territory war via the existing `guildWars.create` mutation, OR (b) a guild leader/officer declares an alliance war via `allianceWar.declareWar`. The cutscene fires for both war types — the broadcast scope differs (see below). |
| Duration | 5.0 s |
| Broadcast scope | Both guilds' WS rooms simultaneously. **Faction territory wars**: every member of every guild on each side gets a chat card; the declaring admin (typically a guild leader on the initiating side) sees fullscreen. **Alliance wars**: both involved guilds see chat cards; the declaring leader sees fullscreen. The two opposing guilds' chat cards display **mirrored** — viewer's own guild's banner is always on the left, opponent's on the right. |
| Anchor object | The war-room table at frame center, present and identical-positioned in both stills (only the banners' state on the table changes) |
| Material | flat — the war room reads as operational tactical-ops space, not the cinematic glass of celebration moments |
| House palette | Dual: each banner carries its respective guild's hex from the per-guild table. The war-room itself uses Mechronis-base palette (slate `#3A4A5E`, deep-space `#010020`) so the two guild colors read as the only "alive" elements in frame. |

**Nano Banana start frame** — `videos/guild/cs_war_declared_start.jpg`
1. Subject and pose: viewed from a 30° elevated angle, a long rectangular
   tactical war-room table at frame center (1.8 m × 0.9 m visual size),
   surface bearing a faintly-lit holographic territory map (no readable
   text; reads as abstract topographic shapes — hexes for alliance war,
   irregular regions for faction war). Above the table, one banner-pole
   stands vertically on each side: **left banner-pole** at the table's
   left short edge, **right banner-pole** at the right short edge. Both
   banners are unfurled but **held aloft** (poles vertical, banners
   hanging down from a horizontal crossbar at each pole's top). The
   banners are clearly visible — left in the viewing guild's accent hex,
   right in the opposing guild's accent hex — but neither banner has
   touched the table yet.
2. Environment: foreground: the table's near-edge in sharp focus.
   Midground: the table itself with both banner-poles. Background:
   tactical-room walls fading to deep-space `#010020`, with hint of
   bookshelves and hanging maps soft-blurred at f/2.8 bokeh on the
   back wall. No people in frame.
3. Lighting: a single overhead key from directly above the table at 90°,
   warm 4000K, illuminating the table surface and the upper portions of
   the two banners. The walls fall to ambient. Each banner self-
   illuminates from below at 25% in its respective guild hex (a "ready"
   pulse). Lens flare anchor: the table's center (where the holographic
   map's brightest pixel sits).
4. Color callouts: walls in `#010020`, table in slate `#3A4A5E` with
   holographic-map glow in cyan `#22d3ee` at 30%, left banner cloth in
   viewer's guild root hex, right banner cloth in opponent's guild root
   hex, bookshelf hints in oxblood-brown `#5A2F2F` at 30% bokeh.
5. Material: flat throughout — operational, not ceremonial.
6. Atmosphere: very light volumetric haze at floor level (10% density),
   barely visible. No particles in motion yet.
7. Camera: 28mm wide for tactical-scale framing, eye-level (1.7 m),
   tilted 30° down toward the table, centered on the table's geometric
   center.
8. Negative prompt: no rendered text, no readable map labels, no people,
   no human hands, no specific real-world military insignia, no second
   pair of banners, no banner-cloth touching the table yet, no readable
   guild names on the banners (just the cloth color and the embroidered
   guild emblem).

**Nano Banana end frame** — `videos/guild/cs_war_declared_end.jpg`
1. Subject and pose: same table, identical framing (continuity). Both
   banners have **slammed down onto the table** — each pole has tilted
   inward 70° from vertical and now lies across the table at a steep
   diagonal, the two banner-cloths overlapping at the table's center
   in a small triangular intersection zone. The poles' lower-shaft ends
   strike the table's near-edges with a subtle indentation visible in
   the table surface beneath each impact point. Each banner's
   embroidered guild emblem (existing per-Guild emblem from
   `apps/shared/expansionArt/guildArt.ts` — Phase 6 hero illustrations)
   is now clearly readable on the cloth, both emblems visible in the
   end frame's composition.
2. Environment: identical war-room (continuity). Three small smoke wisps
   rise from each impact point on the table-edges (6 total).
3. Lighting: the overhead key has remained at 90% intensity but the
   banners' self-illumination from below has lifted from 25% to 70% —
   the table now glows in mixed guild hexes. The holographic map at
   the table's center has shifted from cyan to a contested-territory
   visualization: red `#ef4444` highlights pulse on a few of the
   hexes/regions where the two banners overlap. Lens flare anchor:
   the contested-region glow at the banners' overlap point.
4. Color callouts: same wall/table base, both banners' embroidered
   emblems in their guild's accent hex on root-hex cloth, contested-
   region red highlights at `#ef4444` 60%, smoke wisps in pale
   `#A8B4C2` at 40%.
5. Material: flat throughout.
6. Atmosphere: floor haze density holds at 10%; the 6 smoke wisps
   from impact are the only added particles.
7. Camera: identical 28mm 1.7m 30°-down framing (continuity).
8. Negative prompt: same as start, plus: no readable rule-text on the
   table, no specific territory names, no human figures, no banner
   cloth in the air mid-fall (this is the held end pose), no
   countdown timer rendered.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slight 28mm push-in along the table's vertical axis,
   0.10 m total downward travel over 5 s. Easing: linear (the camera
   is just-arriving-and-watching, not propulsive). Slight 1° forward
   tilt during the push-in, returning to neutral by t=5.0s.
2. Subject motion: at t=0.0s both banners hold aloft at rest. At
   t=0.6s **both banners simultaneously slam downward** — synchronized
   70° pole-tilt inward, taking 600 ms (t=0.6s–1.2s), easing-in
   acceleration. Impact at t=1.2s: both poles' lower ends strike the
   table-edges, table indentation forms, 6 smoke wisps spawn (3 per
   impact point). Between t=1.2s and t=1.4s the two banner-cloths
   settle onto the table surface in a brief cloth-physics ripple
   (synchronized, no over-shoot). Between t=1.4s and t=2.6s the banner
   under-illumination ramps from 25% to 70% in both guild hexes
   simultaneously. Between t=2.6s and t=3.6s the holographic map at
   the table center shifts from cyan to contested-red as the red
   highlights bloom on the disputed regions. Between t=3.6s and t=4.4s
   the smoke wisps drift up and dissolve. Final 600 ms (t=4.4s–5.0s)
   holds the locked tableau.
3. Atmospheric beat: floor haze breathes slowly throughout, no swell.
   The 6 smoke wisps are the only spawning particles.
4. Audio cue ties: banner-slam impact lands on the music's downbeat at
   t=1.2s; cloth-settle ripple rides a 4-bar timpani figure;
   under-illumination ramp coincides with sustained low strings;
   contested-red bloom rides a brass-stab figure; final tableau plays
   under the bed's outro.
5. Negative motion prompt: no whip pans, no zoom, no slow-motion on
   the slam (full speed at 24fps), no second slam, no banner-cloth
   over-shoot bounce on impact, no asynchronous banner descent (the
   two banners must land together to the frame).

**VFX**
- Banner-slam: per-banner pole-rotation tween about its lower-end pivot
  point on the table edge, 70° in 600 ms, ease-in cubic. Cloth-physics
  approximation via 2D mesh deformation (same low-cost technique as
  `cs_sorting_ceremony_arrival_post`).
- Impact indentation: shader-driven displacement on the table-surface
  geometry at the two impact points (1 px depth, persists from t=1.2s
  onward).
- Smoke wisps: 6 GPU-instanced sprites (3 per impact), brownian
  upward drift, 1.6 s lifetime each, sampled from
  `art/vfx/smoke_wisp.webp` at 60% opacity, dissolving by t=3.6s.
- Banner under-illumination ramp: shader-driven emissive curve on the
  banner-cloth meshes, 70% peak in each guild hex.
- Contested-region red highlights: per-territory shader sampling on
  the holographic map mesh, ramps in 2.6–3.6s on the disputed
  hexes/regions only (the rest of the map remains cyan-base).
- Single anamorphic lens flare on the contested-region center,
  ramps in 3.6–4.4s, holds to clip end.

**SFX** (`audio/sfx/guild/cs_war_declared.ogg`)
- Sub: a deep cathedral war-drone, 50 Hz fundamental, building from
  -22 dB at t=0 to -12 dB peak at t=1.2s (the impact peak), then
  decaying back to -16 dB sustain across t=1.4s–5.0s.
- Mid: a 600 ms swooshing wind-and-cloth descent for both banners
  from t=0.6s–1.2s (-14 dB peak). On impact at t=1.2s: a massive
  combined banner-and-pole-slam sound — heavy wood pole striking
  stone, layered with cloth whump and metallic finial clang
  (-8 dB peak, 200 ms transient, 800 ms decay tail). A 6-instance
  smoke-puff layer spawns alongside the impact (granular pink-noise
  bursts, summed -16 dB, 400 ms tail).
- Top: a brass-stab figure on the contested-red bloom at t=2.6s
  (-12 dB, B-flat minor triad, 1.4 s decay tail) — military
  declaration brass.
- Transient: a deep felt-not-heard double-kick at t=1.2s (-8 dB,
  40 Hz, 200 ms) — twin-pole impact reads as one big hit.

**Music** (`music/guild/cs_war_declared_bed.ogg`)
- 5 s through-composed bed at 88 BPM, in **D Phrygian Dominant**
  (the war-anthem mode, Ironflight-house-keyed even though both
  participating guilds may be from any house — war music
  transcends house affiliation). Builds into a half-cadence at
  t=1.2s for the slam impact, sustains tension across the under-
  illumination ramp, releases on the contested-red bloom at t=2.6s
  with a brass-and-timpani figure, settles to a held tonic D
  drone for the final tableau.
- Instrumentation: full Ironflight-style ensemble — low brass
  section (tubas and trombones), war timpani, bass drum, and a
  single bowed glass armonica sustained throughout (the dream-
  substance signature that connects this bed to the rest of the
  Mechronis cinematic library).
- -16 LUFS (louder than F.2 beds — wars are LOUD), 48 kHz
  stereo. Ducks -8 dB under VO (heavier duck — the brass-stab
  competition with VO needs cleaner separation).

**VO** (`warlordVoManifest.json` line `warlord_war_declared_001` [NEW])
- Line: "War declared. Count their angles before you count their numbers."
- Delivery: parade-ground crisp, the second sentence delivered as
  the Warlord's signature mantra (canonical from
  `archonTrainingVoices.ts`). ~3.4 s spoken length. Lands at
  t=1.4s (immediately after the slam impact) so the line completes
  by t=4.8s as the bed reaches its final hold.
- Caption (.vtt) authored verbatim.
- **Note**: this VO is shared across both faction territory wars
  AND alliance wars (the Warlord declares both kinds equally). No
  per-war-type variant.

**Implementation notes**
- **Two-banner palette runtime composition** — the mp4 is rendered
  once with both banner cloths in neutral cyan and the embroidered
  emblems as procedurally-generated placeholder shapes. Two CSS
  color filters apply at runtime in `CutscenePlayer.tsx`, one per
  banner side. The two embroidered emblems are SVG overlays
  (composited from the Phase 6 hero illustration manifest in
  `apps/shared/expansionArt/guildArt.ts`) — single mp4 covers all
  12 × 12 = 144 guild-pair combinations.
- **Mirrored composition for opposing-side viewers** — the mp4 is
  rendered once with the viewer's-guild banner on the left; for
  opposing-guild viewers, `CutscenePlayer.tsx` applies a horizontal
  CSS flip so each viewer always sees their own guild's banner on
  the left. The Warlord VO line is direction-agnostic so it survives
  the flip.
- WS broadcast payload: `{ cutsceneId: "cs_war_declared", warType:
  "faction" | "alliance", warId, declaringGuildId,
  declaringGuildSlug, opposingGuildId, opposingGuildSlug }`. The
  inline chat card displays the start frame poster with the two
  banners visible aloft and the war-type label as HTML chrome
  ("FACTION TERRITORY WAR" or "ALLIANCE WAR").
- Reduced-motion fallback: end frame as static poster + caption +
  SFX bundle. The big slam impact SFX carries the moment audibly
  even without motion; the static poster shows both banners on the
  table so the visual fact of "war declared" is unambiguous.
- Pairs with `GuildPage.tsx` Territory tab — clicking the post-clip
  dismiss button lands the viewer on the war-detail page for the
  specific warId broadcast in the payload, so members can
  immediately register/contribute.

#### F.3.2 — `cs_war_first_blood`

| Field | Value |
|---|---|
| Trigger | First successful `guildWars.contribute` call for a given `warId` (or first `allianceWar.attack` for alliance wars) after `cs_war_declared` has fired. Server-side check: `firstContributionAt IS NULL` on the war row, set to `now()` atomically with the contribution write. |
| Duration | 4.0 s |
| Broadcast scope | Caster (the contributing player) sees fullscreen. Both involved guilds' WS rooms get chat cards. The contributing guild's card reads as celebration ("first blood for {guild}"); the opposing guild's card reads as warning ("{opposing guild} drew first blood"). |
| Anchor object | A floating territory-map frame at frame center, present and identical-positioned in both stills. The contested territory (one hex for alliance war, one named region for faction war) is highlighted at the map's center. |
| Material | glass — the entire frame composition is dream-substance projection; the territory map is holographic |
| House palette | Contributing guild's hex from the per-guild table — the emblem and the territory's ignition all carry the contributor's color |

**Nano Banana start frame** — `videos/guild/cs_war_first_blood_start.jpg`
1. Subject and pose: a holographic territory-map frame floating at frame
   center, 1.4 m visual diameter, viewed from a 25° elevated angle. The
   map's surface displays an abstract topography (hexes for alliance war,
   irregular regions for faction war — pick the alliance-war hex layout
   for this single render and treat faction-war as a runtime
   substitution). Hovering 30 cm above the map's surface, centered over
   one specific hex/region (the **first-contested territory**), floats
   the contributing guild's composable emblem (Phase 6 kit), 12 cm
   visual diameter, **unlit** — its charges are silhouetted, no internal
   illumination yet. The emblem is held mid-descent, having just begun
   its drop toward the territory.
2. Environment: the holographic map exists in an abstract void — no
   war-room context, no physical environment. Foreground: the map's
   near-edge in sharp focus. Midground: the map and the floating
   emblem. Background: deep-space `#010020` void with a faint
   star-field at 0.3% density. Around the map's perimeter, 24 small
   abstract guild-emblem placeholders sit at the rim positions of all
   participating guilds (each a tiny 6 px disc, indicating "these are
   the players in this war") — most are unlit, one (the contributing
   guild's) is brightening.
3. Lighting: a single overhead key from above the map at 90°,
   color-temperature 6500K (cool, holographic). The map self-
   illuminates from within at 30%. The hovering emblem catches a soft
   rim light on its upper arc from the key. Lens flare anchor: the
   first-contested territory's surface (where the emblem will land).
4. Color callouts: void in `#010020`, map surface in slate `#3A4A5E`
   with hex-gridlines in cyan `#22d3ee` at 40%, the first-contested
   territory tinted faintly red `#ef4444` at 30% (carrying continuity
   from `cs_war_declared`'s contested-red bloom), perimeter emblem
   placeholders in slate `#71717a`, the contributing guild's
   placeholder brightening to its accent hex at 50%.
5. Material: glass throughout — map, emblem, perimeter placeholders
   all read as translucent dream-substance.
6. Atmosphere: very faint star-field, no particles in motion yet.
7. Camera: 35mm, slightly raised eye-level (1.9 m), tilted 25° down
   toward the map's center, perpendicular to the map's vertical axis.
8. Negative prompt: no rendered text, no readable territory names,
   no people, no human hands, no second emblem mid-descent, no
   weapons or violence imagery, no readable guild names on the
   perimeter placeholders, no specific real-world maps.

**Nano Banana end frame** — `videos/guild/cs_war_first_blood_end.jpg`
1. Subject and pose: same holographic map, identical framing
   (continuity). The contributing guild's emblem has **descended onto
   the first-contested territory** and now sits embedded into the hex
   surface at the territory's center, fully lit — every charge ignited
   in the contributing guild's accent hex. A bright burst of
   guild-hex light radiates outward from the emblem across the
   territory hex, covering the hex's entire surface area in a 100%
   guild-hex wash. The faintly-red contested tint has been pushed back
   to the hex's perimeter (30% red ring around the bright guild-hex
   interior). Around the map's perimeter, the contributing guild's
   placeholder is now fully ignited at 100%; all other 23 placeholders
   remain at 50% slate (untouched).
2. Environment: identical void, identical star-field (continuity).
3. Lighting: the overhead key has dimmed to 70% — focus has shifted
   to the emblem itself, which now self-illuminates at 100% in the
   guild's accent hex. The territory hex's wash is the brightest
   single area in frame. Lens flare anchor: the emblem's center
   (single anamorphic streak at 18°, 60% intensity).
4. Color callouts: void still `#010020`, map base unchanged, the
   first-contested hex now in 100% guild accent hex with a 30% red
   perimeter ring, contributing guild's perimeter placeholder
   ignited.
5. Material: glass throughout. The territory hex's wash reads as
   plasma-translucent (slightly more solid than the at-rest
   holographic surface).
6. Atmosphere: 12 small guild-hex motes have appeared around the
   ignited emblem, drifting outward at 8 cm/s — the "spark" of
   first contribution.
7. Camera: identical 35mm 1.9m 25°-down framing (continuity).
8. Negative prompt: same as start, plus: no readable contribution
   numbers, no second contributing guild emblem visible, no halo
   around the emblem (just the territory wash), no third party.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: locked. No move. The drama is the emblem-drop and
   ignition; camera motion would compete.
2. Subject motion: at t=0.0s the emblem holds mid-descent; the
   territory hex below is at-rest. Between t=0.2s and t=1.0s the
   emblem **descends** onto the territory hex, accelerating from
   30 cm above to surface contact, with simultaneous ignition of
   each emblem charge in counter-clockwise sequence (8 charges
   over 800 ms, 100 ms per charge — first charge igniting at
   t=0.3s, last at t=1.0s). Impact at t=1.0s: the territory hex's
   surface bursts in a 200 ms guild-hex flash that radiates outward
   to fill the hex by t=1.4s. Between t=1.0s and t=1.4s the 12
   guild-hex motes spawn and begin their outward drift. Between
   t=1.4s and t=2.6s the contributing guild's perimeter
   placeholder ramps from 50% to 100%. Between t=2.6s and t=3.4s
   the territory hex's red perimeter ring solidifies (carrying the
   "still contested but we've staked our claim" tension). Final
   600 ms (t=3.4s–4.0s) holds the ignited tableau.
3. Atmospheric beat: the star-field holds steady throughout. The
   12 guild-hex motes from the ignition burst are the only added
   particles; they drift outward and exit the canvas edges by
   t=4.0s.
4. Audio cue ties: each emblem-charge ignition sits on an eighth-
   note grid; impact-flash lands on a percussive timpani hit at
   t=1.0s; territory-wash fill rides a sustained brass swell;
   perimeter-placeholder ramp coincides with low strings; final
   tableau plays under the bed's outro.
5. Negative motion prompt: no whip pans, no zoom, no second
   descent, no emblem rebound on impact, no asynchronous charge
   ignition, no character speech beyond the VO line.

**VFX**
- Emblem descent: positional tween with sub-pixel motion blur,
  cubic-in easing across 800 ms. Charges ignite via per-charge
  shader-driven emissive ramps, staggered.
- Impact flash: single one-shot bloom on the emblem's center,
  200 ms envelope, additive blend, guild-hex tinted.
- Territory hex wash: shader-driven emissive ramp on the hex
  geometry, 400 ms ramp from 0% to 100%, then hold.
- Red perimeter ring: shader-driven emissive ring drawn at the
  hex's outer 8 px boundary, ramps in 2.6–3.4s, holds.
- 12 guild-hex motes: GPU-instanced sprites, additive blend,
  brownian outward drift, 2.4 s lifetime each.
- Contributing perimeter placeholder ramp: shader-driven emissive
  curve, 1.2 s envelope from 50% to 100%.
- Single anamorphic lens flare on the ignited emblem's center,
  ramps in 1.4–2.0s, holds to clip end.

**SFX** (`audio/sfx/guild/cs_war_first_blood.ogg`)
- Sub: a deep war-drone, 50 Hz fundamental, ramping from -22 dB
  at t=0 to -14 dB at t=1.0s (the impact peak), then sustaining
  at -16 dB through the end.
- Mid: 8 sequential emblem-charge ignition chimes from t=0.3s
  to t=1.0s — each a brass-tinted bell-strike, ascending in pitch
  (C5–G5 across the 8 charges), summed peak -12 dB. On impact at
  t=1.0s: a percussive timpani-and-brass hit (-10 dB peak,
  600 ms decay tail). A territory-wash brass swell from t=1.0s
  to t=1.4s (-12 dB sustained, F major triad).
- Top: a sustained brass shimmer ramping in 1.4–2.6s (-14 dB
  peak, House-keyed major triad: contributing-guild's House mode
  — Resonance F major, Umbra D minor, Ironflight A minor with
  raised 4th, Liminal G whole-tone).
- Transient: a low felt-not-heard kick at t=1.0s under the
  timpani hit (-10 dB, 60 Hz, 200 ms).

**Music** (`music/guild/cs_war_first_blood_bed.ogg`)
- 4 s through-composed bed at 92 BPM, in **D Phrygian Dominant**
  (matching `cs_war_declared`'s war-anthem mode for continuity
  across the war-cycle). Builds into a half-cadence at t=1.0s
  for the impact, sustains tension across the territory-wash,
  resolves on a held tonic at t=3.4s.
- Instrumentation: same Ironflight ensemble as `cs_war_declared`
  — low brass, war timpani, bass drum, plus a single bowed glass
  armonica sustained throughout. Adds a solo trumpet flourish at
  t=1.0s for the "first blood" fanfare moment.
- -16 LUFS, 48 kHz stereo. Ducks -8 dB under VO.

**VO** (`warlordVoManifest.json` line `warlord_first_blood_001` [NEW])
- Line: "First mark on the map. Hold it."
- Delivery: parade-ground crisp, with a beat of pride underneath.
  ~2.0 s spoken length. Lands at t=1.4s (immediately after the
  territory-wash completes) so the line completes by t=3.4s as
  the bed reaches its final hold. The Warlord delivers all war-
  cycle VO consistently.
- Caption (.vtt) authored verbatim.

**Implementation notes**
- **Single mp4 + runtime CSS color filter** — same trick used
  throughout. The emblem charges, territory wash, and motes are
  rendered at neutral cyan, color-filtered to the contributing
  guild's hex at runtime in `CutscenePlayer.tsx`. The emblem
  shape is an SVG overlay (Phase 6 composable kit). Single mp4
  covers all 12 contributing-guild variants.
- **Faction-war territory layout substitution** — for faction
  territory wars, the holographic-map base layer is replaced
  client-side with the faction-war territory layout (irregular
  regions, not hexes). The emblem-descent and territory-wash
  layers are agnostic to the underlying layout — they composite
  on top correctly. The faction-war substitute base is a static
  PNG overlay (`art/maps/faction_war_base.png`).
- **Opposing-guild chat card variant** — same mp4, but the
  inline chat card's HTML chrome reads warning-styled text
  ("{opposing guild} drew first blood — territory contested") in
  red rather than celebration-styled. The mp4 itself plays
  identically.
- WS broadcast payload: `{ cutsceneId: "cs_war_first_blood",
  warType: "faction" | "alliance", warId, contributorUserId,
  contributorGuildId, contributorGuildSlug, opposingGuildId,
  territoryId, territoryName }`. The territoryName overlays as
  HTML chrome on the chat card.
- Reduced-motion fallback: end frame as static poster + caption +
  SFX bundle. The 8-chime charge-ignition sequence carries the
  rhythm even without motion; the timpani impact carries the
  "first blood" beat audibly.
- Pairs with `GuildPage.tsx` Territory tab — clicking the post-
  clip dismiss button lands the viewer on the war-detail page
  scrolled to the contested territory.

#### F.3.3 — `cs_war_mvp_crowned`

| Field | Value |
|---|---|
| Trigger | War-resolution mutation determines MVP (highest `contributionPoints` across all participants on either side, computed once on war close in `guildWars.resolve` / `allianceWar.resolve`). Cutscene fires once, server-side, broadcast atomically with the resolution write. |
| Duration | 6.0 s |
| Broadcast scope | MVP player fullscreen (the moment is theirs); both involved guilds' WS rooms get chat cards. The MVP's guildmates' card reads as celebration, the opposing guild's reads as honored-respect ("{MVP} earned MVP — {guild}"). |
| Anchor object | A single silhouetted figure standing on a low circular plinth at frame center, present and identical-positioned in both stills (only the figure's lighting and the laurel-form's state change) |
| Material | glass — heroic dream-substance projection, the MVP figure reads as a luminous archetype rather than a specific character |
| House palette | MVP's guild hex from the per-guild table; the laurel-form, the figure's rim-light, and the plinth's underglow all carry that color |

**Nano Banana start frame** — `videos/guild/cs_war_mvp_crowned_start.jpg`
1. Subject and pose: a single human-silhouette figure (gender-neutral, 1.8 m tall, viewed from a 5° elevated three-quarter angle), standing motionless on a low circular obsidian plinth (1.0 m diameter, 30 cm tall) at frame center. The figure's pose is neutral — feet shoulder-width, arms at sides, head level. Hovering 50 cm above the figure's head, a translucent laurel-form (a circular wreath of abstract leaf-shapes — no recognizable real-world plant species, just stylized geometric arcs forming a closed crown ring) floats unlit, dim, beginning its slow descent.
2. Environment: the figure stands in a deep volumetric mist that fills the lower two-thirds of the frame — heavy 60% density mist obscuring the plinth's base. Foreground: mist tendrils in soft focus. Midground: the figure and plinth in sharp focus. Background: receding mist fading to deep-space `#010020` at the upper third, with a faint star-field at 0.3% density at the very top.
3. Lighting: a single overhead key from above the figure at 80°, color-temperature 4000K, illuminating only the figure's upper outline. The plinth self-illuminates faintly from below at 20% in the MVP's guild hex (a "your guild stands here" hint). The laurel-form is unlit. Lens flare anchor: a pinprick highlight on the figure's right shoulder where the key catches strongest.
4. Color callouts: void in `#010020`, mist in pale `#A8B4C2` at 60% opacity, plinth in slate `#3A4A5E` with guild-hex underglow, figure silhouetted in pure black with white-cream `#F4E4B8` rim-highlight, laurel-form in slate `#71717a` at 40% (dim).
5. Material: glass — figure, plinth, and laurel-form all read as translucent dream-substance.
6. Atmosphere: heavy ankle-mist at 60% drifting slowly upward at 2 cm/s. No particles in motion yet.
7. Camera: 50mm, eye-level (1.6 m), tilted 5° upward toward the figure (heroic low-angle). Centered on the figure's vertical axis.
8. Negative prompt: no rendered text, no readable name on the figure, no specific facial features, no specific costume detail (silhouette only), no weapons in hand, no laurel touching the figure yet, no real-world species of leaves.

**Nano Banana end frame** — `videos/guild/cs_war_mvp_crowned_end.jpg`
1. Subject and pose: same figure, identical framing (continuity). The laurel-form has descended and now rests on the figure's head/shoulders — a closed wreath ring sitting atop the head with two trailing leaf-strands draping 20 cm down the figure's back. The wreath is fully ignited in the MVP's guild accent hex, glowing at 100%. The figure's silhouette is now rim-lit at 80% intensity (up from 30% at start) by the wreath's bloom. The plinth's underglow has lifted from 20% to 70%, casting a soft hex-tinted bounce onto the immediate mist around it.
2. Environment: identical setting (continuity). Mist density has dropped from 60% to 35% — the heroic moment has parted the fog.
3. Lighting: overhead key has dimmed to 60%; the wreath is now the brightest single element. Lens flare anchor: the wreath's upper arc (single anamorphic streak at 18°, 70% intensity, oriented horizontally).
4. Color callouts: void still `#010020`, mist now in pale `#A8B4C2` at 35% opacity, plinth in slate with guild-hex underglow at 70%, figure silhouetted with guild-hex rim-highlight at 80%, wreath in MVP guild's accent hex at 100% with cream-rim `#F4E4B8` highlights on the leading-edge leaf shapes.
5. Material: glass throughout.
6. Atmosphere: lighter mist at 35%, eight small guild-hex motes drifting upward around the figure (the "spark" of recognition).
7. Camera: identical 50mm 1.6m 5°-up framing (continuity).
8. Negative prompt: same as start, plus: no readable contribution numbers, no second figure, no halo around the figure, no specific facial detail emerging.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 50mm push-in along the figure's vertical axis, 0.20 m total forward travel over 6 s. Easing: linear (ceremonial, not propulsive). The push-in mirrors the laurel's descent.
2. Subject motion: at t=0.0s figure is static, laurel hovers dim. Between t=0.6s and t=2.6s the laurel **descends** smoothly onto the figure — 50 cm vertical travel, ease-out (slow settle). The laurel's individual leaf-shapes ignite in counter-clockwise sequence as it descends (12 leaves over 2 s, igniting one every 167 ms). Settles on figure's head at t=2.6s. Between t=2.6s and t=3.6s the figure's rim-light ramps from 30% to 80% in MVP guild hex; mist parts (60% → 35% density) over the same 1 s window. Between t=3.6s and t=4.6s the plinth underglow ramps from 20% to 70%; 8 guild-hex motes spawn around the figure and drift upward. Final 1.4 s (t=4.6s–6.0s) holds the heroic tableau.
3. Atmospheric beat: mist-clearing is the dominant beat — slow, ceremonial, not dramatic. The 8 motes are the only spawning particles.
4. Audio cue ties: laurel descent rides a 2 s string-and-harp swell; each leaf-ignition sits on the eighth-note grid; settle lands on the music's downbeat at t=2.6s; rim-light ramp coincides with brass swell; tableau hold under sustained chord.
5. Negative motion prompt: no whip pans, no zoom, no figure motion (the figure must remain static throughout — only lighting changes), no second laurel, no readable text materializing, no specific face emerging from the silhouette.

**VFX**
- Laurel descent: positional tween with sub-pixel motion blur, 2 s ease-out cubic.
- Per-leaf ignition: 12 shader-driven emissive ramps staggered 167 ms apart, each leaf 200 ms ramp envelope.
- Figure rim-light ramp: shader pass on the silhouette geometry's edge-detect, ramping in 2.6–3.6s.
- Mist density curve: existing volumetric fog, density-keyed from 60% → 35% over 1 s.
- Plinth underglow ramp: shader-driven emissive on the plinth geometry's underside.
- 8 guild-hex motes: GPU-instanced sprites, brownian upward drift, 2.4 s lifetime each.
- Single anamorphic lens flare on the wreath's upper arc, ramps in 3.0–4.0s, holds.

**SFX** (`audio/sfx/guild/cs_war_mvp_crowned.ogg`)
- Sub: a deep ceremonial pad swell, 50 Hz fundamental, ramping from -22 dB at t=0 to -14 dB at t=2.6s, sustaining at -16 dB through end.
- Mid: 12 sequential leaf-ignition chimes from t=0.6s–2.6s — soft brass-tinted bells, ascending an octave (C5→C6 across 12 leaves), summed peak -14 dB. On settle at t=2.6s: a sustained brass fanfare swell (-12 dB peak, 1.4 s) — heroic but restrained.
- Top: a sustained string shimmer ramping in 3.6–4.6s (-14 dB peak, House-keyed major triad — MVP's guild's House mode).
- Transient: a low felt-not-heard kick at t=2.6s under the settle (-12 dB, 60 Hz, 200 ms) — ceremonial weight.

**Music** (`music/guild/cs_war_mvp_crowned_bed.ogg`)
- 6 s through-composed bed at 60 BPM (slow, ceremonial), in a bright variant of the war-anthem mode — **D Mixolydian** (warmer than the Phrygian Dominant of `cs_war_declared`, signaling honor rather than aggression).
- Instrumentation: low brass section (sustained, no stabs), harp arpeggios on the leaf-ignition grid, solo trumpet melody on the settle beat, full string section underneath, plus the bowed glass armonica continuity sustain.
- -17 LUFS, 48 kHz stereo. Ducks -6 dB under VO.

**VO** (`warlordVoManifest.json` line `warlord_mvp_crowned_001` [NEW])
- Line: "{playerName}, MVP. Your name is in the wind now."
- Delivery: parade-ground crisp, with one beat of pride. ~3.0 s spoken length. Lands at t=2.8s (just after laurel settle) so the line completes by t=5.8s. The `{playerName}` is a runtime SSML insertion — the player's display name spliced into the line via the existing TTS pipeline (the manifest stores a base line with a `{name}` slot, the client substitutes via Web Speech API for short names or falls back to a generic "Champion" for long/non-pronounceable names).
- Caption (.vtt) authored verbatim, with `{playerName}` as a runtime substitution.

**Implementation notes**
- Single mp4 + runtime CSS color filter for the guild hex. SVG laurel composited at runtime is unnecessary — the laurel shape is generic across all guilds (a procedurally-generated wreath, not the Phase 6 emblem).
- WS broadcast payload: `{ cutsceneId: "cs_war_mvp_crowned", warType, warId, mvpUserId, mvpDisplayName, mvpGuildId, mvpGuildSlug, contributionPoints }`. The chat card overlays the MVP's display name as HTML chrome.
- Reduced-motion fallback: end frame as static poster + caption + SFX bundle.
- **Critical**: the figure must remain static throughout — silhouette rendering at 1080p makes any subtle facial emergence visible and breaks the "you-are-the-hero" identification. Verify every frame in Veo's preview before publishing.

#### F.3.4 — `cs_war_victory` (the "money shot")

| Field | Value |
|---|---|
| Trigger | War-resolution mutation determines a winning side (`guildWars.resolve` for faction, `allianceWar.resolve` for alliance — both surface a `winnerGuildId` or `winnerFactionId`). Cutscene fires once for every member of the winning side. |
| Duration | 8.0 s — **the longest cutscene in the catalogue**, deliberately. This is the climax of the war cycle; it earns its runtime. |
| Broadcast scope | All winning guild's members fullscreen on next session-start (queued as a per-user cutscene, like `cs_house_cup_weekly_reset`). Both losing and winning guilds' WS rooms get distinct chat cards: winning side reads "victory — {territory} held / claimed", losing side gets the parallel `cs_war_defeat` (F.3.5) instead, not this one. |
| Anchor object | The contested territory at frame center on the holographic map, present and identical-positioned in both stills (only its faction-sigil-state and surrounding flora-state change) |
| Material | glass — full cinematic glass (the war's resolution is a heroic moment; the material elevation marks it as the war-cycle climax) |
| House palette | Winning guild's hex; the territory wash, surrounding particle bloom, and the rising banner all carry that color |

**Nano Banana start frame** — `videos/guild/cs_war_victory_start.jpg`
1. Subject and pose: identical to `cs_war_first_blood`'s end-frame composition — the holographic territory map at frame center, with the **contested territory** at the map's central position. The territory currently bears the **opposing faction's sigil** at its center (a procedurally-generated abstract emblem distinct from the winning guild's emblem, rendered at 60% intensity in red `#ef4444`). Around the territory hex, smaller adjacent hexes/regions are tinted in mixed faction colors at low intensity, indicating the broader war state. No floating emblem above (we are mid-resolution, not mid-attack).
2. Environment: same abstract holographic-map void as `cs_war_first_blood`, with deep-space `#010020` and faint star-field. The 24 perimeter guild-emblem placeholders are now mostly ignited in their respective guild accent hexes (showing the war's full participation), with the winning guild's placeholder pulsing slightly brighter than the others at 90% (the others at 50–80% per their contribution).
3. Lighting: overhead 90° key at 70%, holographic map self-illumination at 60%. Lens flare anchor: the contested territory's center.
4. Color callouts: void in `#010020`, map in slate `#3A4A5E` with cyan grid, contested territory in red `#ef4444` at 60% (opposing faction's hold), winning guild's perimeter placeholder in winning-guild accent hex at 90%.
5. Material: glass throughout.
6. Atmosphere: faint star-field, no particles in motion yet.
7. Camera: 35mm, raised eye-level (2.0 m), tilted 30° down toward the map. Slightly closer framing than `cs_war_first_blood` to emphasize the territory itself.
8. Negative prompt: no rendered text, no readable territory names, no readable faction names, no winning-guild emblem visible yet, no laurel, no character figure.

**Nano Banana end frame** — `videos/guild/cs_war_victory_end.jpg`
1. Subject and pose: same map, identical framing (continuity). The opposing faction's red sigil has been **completely replaced** by the winning guild's emblem (Phase 6 hero illustration from `apps/shared/expansionArt/guildArt.ts`), now occupying the territory's center at 100% in the winning guild's accent hex. The territory hex's surface is washed in a 100% guild-hex bloom. From the territory's edges, four small abstract banner-poles have risen (one per cardinal direction relative to the territory), each bearing a miniature guild banner in winning-guild accent hex — these are the "claim posts." A larger guild banner unfurls vertically rising 60 cm above the territory's center, tethered to a tall central pole that has emerged from the territory's geometric center.
2. Environment: identical map and void. The 23 non-winning perimeter placeholders have dimmed to 30% (the war is over, attention has consolidated to the winner). The winning placeholder is now at 100% with a bright glow ring around it.
3. Lighting: overhead key at 50%; the territory's bloom is the brightest element. Lens flare anchor: the central banner's top finial (single anamorphic streak at 18°, 80% intensity).
4. Color callouts: contested-red gone entirely, replaced by 100% winning-guild accent hex on the territory wash, the central rising banner cloth in winning-guild root hex with embroidered emblem in accent hex, the four claim-posts in matching colors.
5. Material: glass throughout.
6. Atmosphere: 32 guild-hex motes (the most particle activity in any cutscene in the catalogue) rise from the territory in a slow column, drifting upward in the void above the map. Faint volumetric haze at the territory's edge tinted in winning-guild hex.
7. Camera: identical 35mm 2.0m 30°-down framing (continuity).
8. Negative prompt: same as start, plus: no readable territory bonus name (HTML chrome handles it), no second territory's emblem changing, no character figure, no real-world geography, no readable text on the rising banner.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: very slow 35mm push-in along the territory's vertical axis, 0.30 m total downward travel over 8 s, with a subtle 2° clockwise rotation about the territory's vertical axis (the longest, most ceremonial camera move in the catalogue — befitting the climax). Easing: linear.
2. Subject motion: at t=0.0s the opposing faction's red sigil holds at 60% intensity. Between t=0.4s and t=1.6s the red sigil **fades** to 0% over 1.2 s (slow dissolve, no shatter — diplomatic, not violent). Between t=1.6s and t=2.4s the cleared territory's surface ramps to a 100% winning-guild hex wash. At t=2.4s the winning guild's emblem **appears** at the territory's center via a 600 ms fade-in (cross-fade, not flash). Between t=3.0s and t=4.6s the four claim-posts emerge from the territory's edges in synchronized rise (1.6 s vertical extension, 50 cm height each), banners unfurling on each as they reach full height. Between t=4.6s and t=6.0s the central tall pole rises from the territory's center, vertical banner unfurling along its length (cloth-physics descent reaching full extension by t=6.0s). Between t=4.0s and t=8.0s the 32-mote upward column spawns and rises continuously. Final 1.0 s (t=7.0s–8.0s) holds the locked tableau.
3. Atmospheric beat: territory-edge haze ramps in from t=2.4s through t=8.0s. The 32-mote column is the dominant atmospheric content from t=4.0s onward.
4. Audio cue ties: red-sigil dissolve rides a slow string-glissando descent; territory-wash bloom lands on a brass swell at t=2.4s; emblem appearance sits on the bed's authentic cadence; claim-posts rise on a 4-bar timpani figure; central banner unfurl rides the bed's primary melodic statement; final tableau plays under the bed's outro fade.
5. Negative motion prompt: no whip pans, no zoom, no slow-mo, no second emblem-appearance flash, no banner over-shoot, no character speech beyond the VO line, no map zoom-out at the end (resist the urge to "show the bigger picture" — stay on the territory).

**VFX**
- Red-sigil dissolve: shader-driven alpha fade with a low-frequency dissolve-noise pattern, 1.2 s envelope.
- Territory wash bloom: shader-driven emissive ramp from 0% to 100% in winning-guild hex, 800 ms ramp.
- Emblem cross-fade: SVG overlay (winning guild's Phase 6 hero illustration) cross-faded onto the territory's center over 600 ms.
- Four claim-posts rise: per-post vertical positional tween with attached cloth-mesh banner, ease-out, synchronized.
- Central tall pole rise: positional tween, 1.4 s ease-out, with longer vertical banner cloth-unfurl following.
- 32-mote upward column: GPU-instanced sprites, continuous spawn from t=4.0s at 8/sec rate, vertical drift at 12 cm/s, 2.0 s lifetime each, additive blend.
- Territory-edge haze: existing volumetric fog system, tinted via shader to winning-guild hex, density ramps 0% → 30% over t=2.4s–8.0s.
- Single anamorphic lens flare on the central banner's top finial, ramps in 6.0–7.0s, holds to clip end.

**SFX** (`audio/sfx/guild/cs_war_victory.ogg`)
- Sub: a deep cathedral-organ swell, 40 Hz fundamental, building from -22 dB at t=0 to -10 dB peak at t=6.0s (the central banner's full unfurl), sustaining at -12 dB through end.
- Mid: a slow string-glissando descent during the red-sigil dissolve from t=0.4s to t=1.6s (-16 dB peak). On territory-wash bloom at t=2.4s: a triumphant brass swell entering (-10 dB, B-flat major triad, 1.6 s sustained). At emblem appearance t=2.4s: a single struck large bell (-8 dB, fundamental F2, 4 s decay tail). At claim-posts rise t=3.0s–4.6s: a 4-bar war-timpani roll (-12 dB peak, ascending). At central banner unfurl t=4.6s–6.0s: a rising orchestral gesture (full ensemble, -8 dB peak at t=6.0s).
- Top: a sustained brass shimmer ramping in 6.0s–7.0s (-12 dB peak, full triumphal fanfare in House-keyed major). 32 small bell-tings on the rising motes (continuous, summed -16 dB).
- Transient: deep felt-not-heard kicks at t=2.4s, t=4.6s, t=6.0s (each -10 dB, 50 Hz, 300 ms) — ceremonial weight markers.

**Music** (`music/guild/cs_war_victory_bed.ogg`)
- 8 s through-composed bed at 76 BPM, in **B-flat major** (the school anthem's home key — winning a war is institutionally celebrated). Builds across three peaks: territory bloom (t=2.4s), claim-posts rise climax (t=4.6s), and central banner finial (t=6.0s — the bed's primary harmonic resolution). Outros to a sustained tonic chord across the final 2 s.
- Instrumentation: full Mechronis ensemble — pipe organ pad, full string section, low and high brass (with solo trumpet melody), war timpani, choir on a held "ahh" vowel from t=3.0s onward, harp arpeggios, and the bowed glass armonica sustained continuity. The most fully-orchestrated bed in the catalogue.
- -15 LUFS (the loudest bed in the catalogue — the war-cycle climax earns it), 48 kHz stereo. Ducks -8 dB under VO.

**VO** (`warlordVoManifest.json` line `warlord_war_victory_001` [NEW])
- Line: "Victory. The territory is yours. Hold what you have taken."
- Delivery: parade-ground crisp, with three beats of pride paced through the three sentences. ~5.0 s spoken length. Lands at t=2.6s (just after the territory bloom completes) so the line completes by t=7.6s, leaving the final 400 ms tableau silent for breath. Per-territory-bonus runtime substitution: a follow-up clause "Your reward: {bonusName}" inserts via SSML if the player's territory has a named bonus per `apps/server/routers/guildWars.ts`'s 8-territory bonus list (e.g., "Your reward: +10% Dream").
- Caption (.vtt) authored verbatim with runtime substitution slot.

**Implementation notes**
- Single mp4 + runtime CSS color filter on the territory wash, claim-post banners, central banner, and motes (all share the winning guild hex). The winning guild's emblem is an SVG overlay composited at runtime from the Phase 6 hero illustration manifest.
- WS broadcast payload: `{ cutsceneId: "cs_war_victory", warType, warId, winningGuildId, winningGuildSlug, territoryId, territoryName, territoryBonusName, territoryBonusValue }`. Both `territoryBonusName` and `territoryBonusValue` are HTML-overlay chrome on the chat card and appear as caption-line substitutions in the VO.
- **Per-user delivery (not WS-real-time)**: like `cs_house_cup_weekly_reset`, this cutscene is queued per-user via `playerGameState.pendingCutscenes[]` and plays on next session-start. Online players see it within seconds of the war-resolution; offline players see it on next login. The cutscene is **never silently skipped** — players must dismiss it explicitly.
- Reduced-motion fallback: end frame as static poster + caption + SFX bundle.
- Pairs with `GuildPage.tsx` Territory tab — clicking dismiss lands the player on the war-detail summary page showing the new territory holdings and their bonus.

#### F.3.5 — `cs_war_defeat`

| Field | Value |
|---|---|
| Trigger | War-resolution mutation determines a winning side; the loser receives this cutscene instead of `cs_war_victory`. |
| Duration | 5.0 s |
| Broadcast scope | All losing-side guild members fullscreen on next session-start (queued like the victory variant). Losing guild's WS room gets a chat card. The opposing winning guild does not receive this cutscene — they get `cs_war_victory`. |
| Anchor object | A single banner-pole with the losing guild's banner at frame center, present in both stills (only its lighting and posture change). |
| Material | glass with reduced saturation — the cinematic still feels heroic, but muted; no full-flat-defeat material because the message is "bowed but not broken" |
| House palette | Losing guild's hex, **desaturated to 60%** at runtime via CSS `saturate(0.6)` filter — the visual signal is "your colors are still here, just dimmed" |

**Nano Banana start frame** — `videos/guild/cs_war_defeat_start.jpg`
1. Subject and pose: a single tall banner-pole at frame center (3.0 m visual height), vertical, with the losing guild's banner unfurled and hanging at full extension. The banner's pole is **upright but tilted 8° backward** (a posture of weariness, not collapse). The banner cloth bears the losing guild's emblem (Phase 6 hero illustration overlay) but rendered at 50% intensity. At the base of the pole, scattered fragments — small abstract debris shapes (8 fragments, none weapons, none recognizable) — lie on the ground. No people in frame.
2. Environment: a wind-swept open plateau seen from a low elevation. Foreground: scattered fragments in sharp focus. Midground: the banner-pole. Background: an empty horizon with a single thin layer of low cloud at the upper third, no sun visible — overcast, cold. No specific war-room or holographic-map context (this is "after the battle," not on the map).
3. Lighting: a single key from the upper-right at 35°, color-temperature 5500K (overcast, no warmth). The banner self-illuminates faintly from below at 15% in the desaturated guild hex. Lens flare anchor: a small specular highlight on the pole's top finial.
4. Color callouts: ground in slate-cold `#3A4A5E`, sky in pale grey `#A8B4C2`, cloud layer in `#D4D4D8` at 30%, banner cloth in 60%-desaturated guild root hex, banner emblem in 60%-desaturated guild accent hex, fragments in `#71717a`.
5. Material: glass with reduced internal-light intensity (the banner's circuit traces are barely visible — the projection is wounded but functional).
6. Atmosphere: subtle ankle-level dust drifting horizontally with the wind (left-to-right, 6 cm/s visual rate). One small dust mote spinning.
7. Camera: 50mm, low eye-level (1.4 m), perfectly horizontal — no upward tilt (defiant, not submissive; eye-to-eye with the banner).
8. Negative prompt: no rendered text, no readable defeat-message, no fallen figures, no blood, no broken pole, no shattered banner cloth, no opposing-guild presence, no rising sun, no rendered phoenix shape (the phoenix-glyph hint is reserved for the end frame), no specific real-world military imagery.

**Nano Banana end frame** — `videos/guild/cs_war_defeat_end.jpg`
1. Subject and pose: same banner-pole, same backward tilt, identical framing (continuity). At the base of the pole, in the empty space between the scattered fragments, a single small **phoenix-glyph** has materialized — a stylized bird-form sigil (4 px stroke line-art, 12 cm visual size, abstract enough to evoke "rising" without being a literal phoenix). The glyph glows softly in pure cream `#F4E4B8` at 80%, casting a small warm bounce onto the ground around it. The banner itself remains at 50% intensity (no recovery in the cloth) but the pole's tilt has settled back from 8° to 5° (a small rebound — "we will stand again").
2. Environment: identical horizon (continuity). The cloud layer remains.
3. Lighting: same overcast key. The phoenix-glyph is now the brightest element. Lens flare anchor: the phoenix-glyph itself (single soft warm bloom, 30% intensity — restrained, not triumphal).
4. Color callouts: same ground/sky/cloud, same 60%-desaturated banner, phoenix-glyph in cream `#F4E4B8` at 80%, warm bounce on ground at `#F4E4B8` 12%.
5. Material: glass throughout, with the phoenix-glyph reading as the only fully-saturated element in frame (the cream is cream, not a desaturated cream — the hint of recovery).
6. Atmosphere: dust still drifting horizontally; the phoenix-glyph emits no particles of its own (the recovery is implied, not shown).
7. Camera: identical 50mm 1.4m horizontal framing (continuity).
8. Negative prompt: same as start, plus: no actual phoenix bird flying, no fire effects, no characters, no banner returning to full saturation (the loss is real — only the phoenix-glyph hints at future), no rising sun, no opposing-guild victory imagery.

**Veo 3.1 motion prompt** (image-to-video)
1. Camera: locked. No move. Defeat is held still.
2. Subject motion: at t=0.0s the banner is at 8° tilt, fragments scattered, no glyph visible. Between t=0.6s and t=2.0s the banner-cloth ripples once in the wind (a single 1.4 s undulation, suggesting weariness rather than triumph). Between t=2.0s and t=2.4s the pole-tilt corrects from 8° to 5° (subtle 400 ms rebound, ease-out). Between t=2.4s and t=3.6s the **phoenix-glyph fades in** at the pole's base (slow cross-fade reveal, no flash, no spark — it has always been there, we just see it now). Between t=3.6s and t=4.4s the warm bounce on the ground around the glyph ramps in. Final 600 ms (t=4.4s–5.0s) holds the tableau with the pole at 5° tilt, glyph glowing softly, dust still drifting.
3. Atmospheric beat: dust drifts steadily throughout at 6 cm/s, no swell. The single dust mote spins continuously. No other particles.
4. Audio cue ties: banner ripple rides a low string-and-cello sustain; pole rebound on a soft cello pluck at t=2.0s; phoenix-glyph fade-in rides the music's resolving chord; warm-bounce ramp coincides with sustained low choir.
5. Negative motion prompt: no whip pans, no zoom, no character speech other than VO, no fire effects, no actual phoenix animation, no banner restoration, no rising sun, no second glyph, no triumphant key-change in the music.

**VFX**
- Banner ripple: cloth-mesh deformation, single 1.4 s wave from pole-side outward.
- Pole-tilt rebound: rotational tween about the pole's base pivot, 400 ms ease-out.
- Phoenix-glyph cross-fade: SVG overlay (procedurally-generated stylized bird-glyph from a fixed seed `seed = 0xF1E5`) cross-faded in over 1.2 s.
- Warm bounce ramp: shader-driven emissive on the ground geometry around the glyph, 800 ms ramp.
- Dust drift: existing volumetric fog with horizontal wind direction.
- No lens flare (defeat is unflattered by anamorphic streaks; the phoenix-glyph's warm bloom is enough).

**SFX** (`audio/sfx/guild/cs_war_defeat.ogg`)
- Sub: a deep low cello drone, 60 Hz fundamental, sustained at -18 dB throughout the full 5 s with a slight rise to -16 dB at t=3.6s on the phoenix-glyph reveal, then back to -18 dB.
- Mid: a soft wind-and-cloth ripple riding the banner movement from t=0.6s–2.0s (-16 dB peak). A single soft cello pluck on the pole rebound at t=2.0s (-14 dB, A2, 1.4 s decay tail). A barely-audible high choir entrance on the phoenix-glyph fade-in from t=2.4s–3.6s (-18 dB, sustained "ahh" vowel, 1.2 s).
- Top: no fanfare, no bells, no struck percussion. The defeat cutscene is intentionally the **quietest** in the catalogue — the dignity of loss is in restraint.
- Transient: no kicks, no impacts.

**Music** (`music/guild/cs_war_defeat_bed.ogg`)
- 5 s through-composed bed at 50 BPM (slowest tempo in the catalogue — defeat is paced), in **D minor** (the parallel minor of the war-anthem's D Phrygian Dominant; signaling tonal grief without abandoning the war-cycle's harmonic family). Resolves to a held tonic D minor chord at t=3.6s on the phoenix-glyph reveal — not a triumphant resolution, but a settled one ("the loss is real, the future is open").
- Instrumentation: solo cello (lead), low strings (sustained), pipe organ pad at 25% intensity, single soft choir entrance at t=2.4s, no brass, no timpani, no harp. The bowed glass armonica sustains throughout as connective tissue to the rest of the catalogue.
- -19 LUFS (significantly quieter than the victory bed's -15 LUFS; the contrast tells the story), 48 kHz stereo. Ducks -4 dB under VO.

**VO** (`warlordVoManifest.json` line `warlord_war_defeat_001` [NEW])
- Line: "We lost the field. We did not lose the fight. Stand. Again."
- Delivery: parade-ground crisp but quieter than victory or first-blood — the Warlord delivers defeat with the same authority but lower volume, longer pauses between sentences. ~3.4 s spoken length with two natural pauses ("the fight." [pause] "Stand." [pause] "Again."). Lands at t=1.0s so the line spans the banner-ripple and pole-rebound, completing by t=4.4s as the phoenix-glyph reaches full visibility.
- Caption (.vtt) authored verbatim with the rest pauses preserved.

**Implementation notes**
- Single mp4 + runtime CSS color filter (`saturate(0.6)`) applied globally to the entire video output — the desaturation is the visual signal of defeat, not baked into the render. This means a single mp4 covers all 12 losing-guild variants AND can be re-used as a generic "defeat poster" if needed elsewhere.
- The phoenix-glyph SVG is a fixed shape (`seed = 0xF1E5`, identical across all renders) — it's the **same glyph** for every guild's defeat, signaling that hope of return belongs to the institution of guild-warfare itself, not to any one guild.
- WS broadcast payload: `{ cutsceneId: "cs_war_defeat", warType, warId, losingGuildId, losingGuildSlug, contestedTerritoryId, contestedTerritoryName, winningGuildSlug }`. The chat card overlays the contested territory's name and the winning guild's name as HTML chrome.
- Per-user delivery (queued like victory) — players are not surprised with a defeat cutscene mid-session.
- Reduced-motion fallback: end frame as static poster + caption + SFX bundle. The static poster carries the dignity well; the SFX cello drone holds the mood.
- Pairs with `GuildPage.tsx` Territory tab — clicking dismiss lands the player on the war-detail summary page showing the lost territory and any defensive contributions they made.

#### F.3.6 — `cs_alliance_war_placement_lock`

| Field | Value |
|---|---|
| Trigger | Alliance war's placement phase ends (24h window per `apps/shared/allianceWar.ts` `phaseDurations`). Server enforces lock atomically — defenders can no longer reposition decks on map nodes. |
| Duration | 5.0 s |
| Broadcast scope | Both involved guilds' WS rooms get chat cards. Each guild's officers + leaders see fullscreen on next session-start (queued — they're the placement-decision-makers). |
| Anchor object | The 19-node honeycomb hex grid (5-4-5-4-1 boss layout), at frame center, identical-positioned in both stills (only the defender-glyph state changes) |
| Material | flat — the war map is operational, not ceremonial |
| House palette | Both guilds' hexes, defender glyphs in each respective guild's accent hex |

**Nano Banana start frame** — `videos/guild/cs_alliance_war_placement_lock_start.jpg`
1. Subject and pose: viewed from a 45° elevated angle, the full 19-node honeycomb hex grid laid out in the canonical 5-4-5-4-1 layout per `apps/shared/allianceWar.ts`. Nodes drawn as glowing hex tiles (each 80 px across the flats) connected by thin path lines. The boss node at the layout's apex is larger (120 px). All 19 nodes are currently in their **placement state**: defender-deck glyphs (small abstract sigils, 24 px each) hover **above** their assigned nodes by 12 px, **not yet locked in** — visibly floating, with a slight up-and-down bob animation suggested by the still's slight motion-blur on the glyph positions.
2. Environment: holographic-map void context (carry-over from `cs_war_first_blood`'s setting). Foreground: nearest hex tiles in sharp focus. Midground: full grid. Background: deep-space void with faint star-field.
3. Lighting: overhead 80° key, holographic map self-illumination at 50%, defender glyphs self-rim-lit in their respective guild hexes at 60% (placement is provisional, not yet final). Lens flare anchor: the boss node's center.
4. Color callouts: void in `#010020`, hex tiles in slate `#3A4A5E` with cyan `#22d3ee` grid-line glow, defender glyphs in their respective guild hexes at 60%, boss node tinted faintly red `#ef4444` at 30%.
5. Material: flat throughout.
6. Atmosphere: faint star-field, no volumetric haze (pure abstract holographic context).
7. Camera: 28mm wide, raised eye-level (2.0 m), 45° down toward the grid's center (the boss-node).
8. Negative prompt: no rendered text, no readable node names, no defender deck-list overlays, no people, no weapons, no real-world chess imagery, no Battle.net interface chrome.

**Nano Banana end frame** — `videos/guild/cs_alliance_war_placement_lock_end.jpg`
1. Subject and pose: same grid, identical framing (continuity). Each defender glyph has **dropped 12 px down to seal onto its assigned node** — locked in place, no longer hovering. Each glyph now glows at 100% intensity in its respective guild hex, and a thin guild-hex aura extends 8 px outward from the glyph (visualizing the locked-in defense). The hex tiles themselves have shifted from cyan grid-line glow to **blended faction colors** — each tile picks up the color of whichever guild has more defenders adjacent (per Phase 5 mechanic). The boss-node remains red-tinted but slightly brighter at 50%.
2. Environment: identical void.
3. Lighting: overhead key dimmed slightly to 70%; the locked glyphs and tile-color blend now dominate visual interest. Lens flare anchor: boss node.
4. Color callouts: hex tiles now in mixed dual-guild hexes (per defender adjacency), defender glyphs in 100% guild hex with 8 px aura, boss-node red at 50%.
5. Material: flat throughout.
6. Atmosphere: 19 small "lock-in" particle bursts (one per node) have just fired and are dissolving — small guild-hex motes around each node.
7. Camera: identical 28mm 2.0m 45°-down framing.
8. Negative prompt: same as start.

**Veo 3.1 motion prompt**
1. Camera: very slight 28mm push-in along grid's vertical axis, 0.10 m over 5 s, no roll. Linear easing.
2. Subject motion: at t=0.0s glyphs hover at +12 px above nodes, bobbing. At t=0.4s a single low countdown-pulse rings out from the boss-node (radial 200 ms shockwave through the grid). Between t=0.4s and t=2.4s the **19 defender glyphs descend in unison** by 12 px onto their assigned nodes — synchronized perfect-lockstep, 2 s ease-in cubic. At t=2.4s every glyph **lands** simultaneously, each emitting a small particle burst (19 bursts at exactly the same instant). Between t=2.4s and t=3.6s glyph self-illumination ramps from 60% to 100% with the 8 px auras extending outward. Between t=3.6s and t=4.4s the hex tiles' colors blend from cyan-base to dual-guild mixed hues based on defender adjacency. Final 600 ms holds locked tableau.
3. Atmospheric beat: lock-bursts at t=2.4s are the dominant atmospheric event; otherwise calm.
4. Audio cue ties: countdown-pulse on a low gong; descent rides a 2 s string-and-timpani crescendo; lock-in lands on a percussive 19-glyph synchronized hit; tile-color blend rides a sustained brass swell.
5. Negative motion prompt: no whip pans, no zoom, no asynchronous glyph descent (must be lockstep), no character speech, no boss-node eruption.

**VFX**
- Glyph descent: 19 GPU-instanced positional tweens, perfectly synchronized.
- Lock-in particle bursts: 19 simultaneous one-shot bursts at t=2.4s, each 8 particles, guild-hex tinted.
- Glyph aura extension: shader-driven 8 px outline glow per glyph.
- Hex tile color blend: per-tile shader sampling adjacency, ramps in 3.6–4.4s.
- Single anamorphic lens flare on the boss-node, ramps in 3.6–4.4s, holds.

**SFX** (`audio/sfx/guild/cs_alliance_war_placement_lock.ogg`)
- Sub: war-drone at -18 dB sustained, lifting to -14 dB during the descent.
- Mid: low gong on countdown-pulse at t=0.4s (-12 dB, 50 Hz, 2.4 s tail). Crescendo of strings-and-timpani during the 2 s descent (-14 dB → -10 dB peak at t=2.4s). Synchronized hard percussive impact on lock-in (-8 dB peak, 200 ms transient — sounds like 19 simultaneous metal-on-stone hits stacked).
- Top: brass swell during tile-color blend, F-major triad, -12 dB.
- Transient: deep felt-not-heard kick at t=2.4s (-8 dB, 40 Hz, 200 ms).

**Music** (`music/guild/cs_alliance_war_placement_lock_bed.ogg`)
- 5 s bed at 96 BPM (faster than other war beds — placement-lock is tactical urgency), in D Phrygian Dominant. Builds to lock-in peak at t=2.4s, then sustains tonic.
- Instrumentation: low brass, war timpani, strings, bowed glass armonica.
- -16 LUFS, 48 kHz stereo. Ducks -8 dB under VO.

**VO** (`warlordVoManifest.json` line `warlord_placement_lock_001` [NEW])
- Line: "Placement locked. Hold the line."
- Delivery: parade-ground crisp, ~2.0 s. Lands at t=2.6s. Caption .vtt verbatim.

**Implementation notes**
- Mp4 covers single grid layout (19 nodes is fixed). Defender glyphs are SVG overlays composited per-guild from each guild's emblem kit. CSS color filters per-side handle the dual hex.
- WS payload: `{ cutsceneId: "cs_alliance_war_placement_lock", warId, leftGuildSlug, rightGuildSlug }`.
- Reduced-motion fallback: end frame poster + caption + SFX bundle.

#### F.3.7 — `cs_thought_virus_reinfection`

| Field | Value |
|---|---|
| Trigger | Alliance war during the **Fall of Reality** epoch only — the `applyThoughtVirusReinfection()` handler in `apps/shared/allianceWar.ts` returns a successful reinfection roll for a previously-cleared node. Cutscene fires for that specific node-event. |
| Duration | 4.0 s |
| Broadcast scope | Both involved guilds' WS rooms get chat cards. The defending guild's members see fullscreen if currently active in the alliance-war page (the node's defenders are recovering ground); the attacking guild's members see fullscreen if currently active (the node they cleared is reverting). |
| Anchor object | A single hex node at frame center, present and identical-positioned in both stills (the node transitions from "cleared" state to "reinfected" state). |
| Material | retro at heavy strength — the Thought Virus is the Architect's surveillance corruption made manifest; CRT scanlines and VHS chroma bleed are at full intensity, the only cutscene in the catalogue with this material at full strength. |
| House palette | Reinfecting node's defending guild hex, **shifted toward red `#ef4444` at 50% blend** — the corruption signal |

**Nano Banana start frame** — `videos/guild/cs_thought_virus_reinfection_start.jpg`
1. Subject and pose: a single hex node at frame center, viewed from a 25° elevated angle, currently in **cleared state**: cyan grid-line glow at the hex's perimeter, blank slate `#3A4A5E` interior, no defender glyph, no aura. The hex appears stable, neutral. Adjacent partial hexes visible at the canvas edges (5 partial hexes around the central focus hex) in their own states (some cleared cyan, some defended in mixed guild hexes), suggesting wider grid context.
2. Environment: holographic-map void with retro-overlay — strong horizontal CRT scanlines (8 px tall, 12% opacity slate) drift continuously from top to bottom across the canvas. Faint VHS chroma-bleed visible on the hex perimeter (red-blue split at 1 px offset).
3. Lighting: overhead 80° key, hex self-illumination at 30% (cleared = dim).
4. Color callouts: void in `#010020`, central hex in slate `#3A4A5E` with cyan `#22d3ee` perimeter glow.
5. Material: retro at heavy strength.
6. Atmosphere: scanlines + chroma-bleed are the dominant atmospheric content.
7. Camera: 50mm, raised 1.9 m, tilted 25° down on the central hex.
8. Negative prompt: no rendered text, no readable node coords, no defender glyphs in the central hex (it's cleared), no actual virus imagery (no DNA helices, no biological-virus visuals), no real-world disease iconography, no human figures.

**Nano Banana end frame** — `videos/guild/cs_thought_virus_reinfection_end.jpg`
1. Subject and pose: same hex, identical framing (continuity). The hex has **reverted to a corrupted defended state**: a defender glyph has materialized at the hex's center in the reinfecting guild's accent hex blended toward red (50% red shift), with a corrupted-aura extending outward in red-tinted ripples. The hex perimeter glow has shifted from cyan to red. Two thin red "infection-tendrils" visibly extend outward from the central hex toward two of the adjacent partial hexes (suggesting potential further spread, even though only this node has reinfected this turn).
2. Environment: same void. Scanlines now display occasional 1-frame stutter glitches (visible as a brief misalignment in the still). VHS chroma-bleed has intensified to 3 px red-blue split.
3. Lighting: overhead key dimmed to 50%; the corrupted defender glyph and red perimeter dominate. Lens flare anchor: the central hex's defender glyph (single red anamorphic streak at 18°, 60% intensity).
4. Color callouts: central hex perimeter glow in red `#ef4444` at 80%, defender glyph in 50%-red-blended guild hex, infection-tendrils in red `#ef4444` at 60%.
5. Material: retro at heavy strength.
6. Atmosphere: scanlines + chroma-bleed at peak intensity, plus 4 small red corruption-motes drifting outward from the central hex.
7. Camera: identical (continuity).
8. Negative prompt: same as start, plus: no biological imagery, no chemical-flask or syringe imagery, no real-world horror tropes.

**Veo 3.1 motion prompt**
1. Camera: locked. No move. The horror is the inevitability — camera motion would soften it.
2. Subject motion: at t=0.0s hex is cleared. Between t=0.2s and t=0.4s a single CRT scanline-stutter fires (1-frame glitch — the Architect blinks). Between t=0.6s and t=1.6s the hex perimeter glow **shifts** from cyan to red over 1 s (no flash, just a hue rotation — gradual corruption). At t=1.6s the defender glyph **materializes** at the hex center in a 200 ms cross-fade reveal, fully corrupted. Between t=1.8s and t=2.8s the corrupted-aura ramps outward in pulsing red ripples; the two infection-tendrils extend outward toward adjacent hexes at the same rate. Between t=2.8s and t=3.4s VHS chroma-bleed intensifies from 1 px to 3 px split. Final 600 ms (t=3.4s–4.0s) holds the corrupted tableau with continued slow scanline drift.
3. Atmospheric beat: scanlines drift continuously throughout; stutter at t=0.2s is the inciting event.
4. Audio cue ties: scanline-stutter on a single retro-glitch click; perimeter glow-shift rides a slow detuning string-glissando; defender materialization on a granular noise-burst impact; aura ripple rides a low pulsing drone.
5. Negative motion prompt: no whip pans, no zoom, no biological-style virus-cells animating, no character speech beyond VO, no fast cuts, no shock-flash.

**VFX**
- Scanline stutter: post-effect 1-frame glitch at t=0.2s.
- Perimeter glow hue-rotation: shader-driven hue interpolation, cyan to red over 1 s.
- Defender glyph cross-fade: SVG overlay (defending guild's emblem with 50% red-shift CSS filter) cross-faded in over 200 ms.
- Corrupted-aura pulsing ripples: shader-driven concentric ring emission, 0.5 Hz pulse rate, red-tinted.
- Infection-tendrils: 2D mesh-line tweens extending outward from central hex, ease-out.
- VHS chroma-bleed intensification: post-effect chroma-split parameter ramping from 1 px to 3 px over 600 ms.
- 4 corruption-motes: GPU-instanced sprites drifting outward, additive red.

**SFX** (`audio/sfx/guild/cs_thought_virus_reinfection.ogg`)
- Sub: a low ominous drone, 30 Hz fundamental, ramping from -22 dB at t=0 to -12 dB at t=4.0s — the corruption is growing.
- Mid: a single retro-glitch click at t=0.2s (-12 dB, 60 ms, no tail). A slow detuning string-glissando from G3 to G3-flat across t=0.6s–1.6s (-16 dB peak, eerie). A granular noise-burst impact on defender materialization at t=1.6s (-10 dB peak, 200 ms, retro-tinted). A pulsing low-drone underneath the aura ripples (0.5 Hz pulse, -14 dB peak).
- Top: VHS-static rising from -22 dB at t=2.8s to -16 dB at t=3.4s (intensifying chroma-bleed audible).
- Transient: a deep felt-not-heard kick at t=1.6s (-10 dB, 30 Hz, 300 ms) — the corruption settles in.

**Music** (`music/guild/cs_thought_virus_reinfection_bed.ogg`)
- 4 s bed at 56 BPM, in **D minor with constantly detuning intervals** — the bed itself sounds wrong, like a tape player slowing. No clean cadence; ends on an unresolved diminished chord at t=4.0s.
- Instrumentation: low cellos (lead, with progressively-detuning pitch), pipe organ pad with retro-distortion, single bowed glass armonica (the only stable element).
- -19 LUFS, 48 kHz stereo. Ducks -4 dB under VO.

**VO** (`architectVoManifest.json` line `architect_thought_virus_001` [NEW])
- Line: "The thought returned."
- Delivery: cool, administrative, with no warmth — same Architect tone as `cs_sorting_ceremony_arrival_pre`. ~1.4 s spoken length. Lands at t=2.0s, mid-aura-ripple. Caption .vtt verbatim.

**Implementation notes**
- Single mp4 + runtime CSS color filters: defending guild's hex is filter-blended with red. The defender glyph is an SVG overlay composited from the defending guild's Phase 6 emblem with a runtime red-shift filter.
- WS broadcast payload: `{ cutsceneId: "cs_thought_virus_reinfection", warId, nodeId, defendingGuildSlug, attackingGuildSlug }`. The chat card shows the node identifier and a "RECOVERED" badge for the defending guild / "REVERTED" badge for the attacking guild.
- Active-only fullscreen — players not currently on the alliance-war page receive only the chat card; this is real-time war state, not a queued ceremonial moment.
- Reduced-motion fallback: end frame as static poster + caption + SFX bundle. **Important**: the Architect VO line is the only fully-clear element of this cutscene; the visuals are intentionally disorienting. The reduced-motion fallback should retain the line clearly.

#### F.3.8 — `cs_epoch_change` (5 sub-clips — shared standards)

This entry generates **5 distinct cutscenes**, one per epoch season from `apps/shared/allianceWar.ts` `WAR_SEASONS`: Age of Privacy, Age of Prophecy, Age of Insurgency, Age of Revelation, Fall of Reality. The shared standards below apply to all 5; per-epoch sub-entries (F.3.8.a–F.3.8.e) specify what differs.

**Shared format**

| Field | Value |
|---|---|
| Trigger | ISO-week scheduler advances the active war season (rotation: Privacy → Prophecy → Insurgency → Revelation → Fall, then back to Privacy). Per-user cutscene queued on next session-start, plays once per epoch boundary regardless of guild membership. |
| Duration | 5.0 s per epoch sub-clip |
| Broadcast scope | School-wide. Plays fullscreen for every player on first session of the new epoch (similar to `cs_house_cup_weekly_reset`). Not WS-broadcast — queued per-user. |
| Anchor object | The Mechronis Academy dome interior (carry-over from `cs_house_cup_weekly_reset` for visual continuity) — but viewed from a different angle (looking up at the oculus from directly beneath, not from the seating tier). |
| Material | Per-epoch — see sub-entries. |
| House palette | Per-epoch root color from the established lore palette (Privacy indigo, Prophecy violet, Insurgency green-and-red, Revelation crimson, Fall red-black). |

**Shared composition (Nano Banana frames)**

- **Start frame**: looking straight up from directly beneath the dome's oculus, the oculus aperture (4 m visual diameter) fills the canvas's central third. The aperture currently shows the **previous epoch's signature sky** — colors and atmosphere from the outgoing epoch. The dome's coffered interior radiates outward from the oculus rim, in soft focus, picking up the outgoing epoch's hue at 12% wash on the upper-third coffers.
- **End frame**: identical framing (continuity). The aperture now shows the **incoming epoch's signature sky** — colors per sub-entry. The dome's coffer wash has shifted to the incoming epoch's hue at 18% (slightly stronger than the start's wash, signaling "the new epoch has settled in"). A thin annular "epoch-marker" ring inside the aperture's circumference glows brass `#C59A3F` at 30% (consistent with `cs_house_cup_weekly_reset`'s oculus marker).

**Shared Veo 3.1 motion prompt**

1. Camera: locked, looking straight up. No move (gazing reverently).
2. Subject motion: at t=0.0s aperture shows outgoing epoch's sky. Between t=0.4s and t=2.0s the sky **transitions** through a 1.6 s cross-fade — the outgoing epoch's atmosphere dissolves and the incoming epoch's atmosphere fades in. Between t=2.0s and t=3.0s the dome's coffer-wash hue shifts from outgoing to incoming. Between t=3.0s and t=4.0s the brass annular epoch-marker ring fades up from 0% to 30%. Final 1.0 s holds tableau with the new epoch's sky stable.
3. Atmospheric beat: per-epoch (see sub-entries — the sky's atmospheric character IS the differentiator).
4. Audio cue ties: sky cross-fade rides a 1.6 s modal-transition figure; coffer-wash shift on a sustained chord change; epoch-marker fade-up on a low gong.
5. Negative motion prompt: no whip pans, no zoom, no specific weather effects (the sky is abstract atmospheric color, not literal weather), no character speech beyond per-epoch VO.

**Shared sound design**

- Each epoch sub-clip ships with its own bed (5 beds total), but all 5 share a common transition motif: a 1.6 s "modal transition" figure that briefly visits the outgoing epoch's mode, slides through a chromatic glissando, and lands in the incoming epoch's mode. This makes the transitions feel like a connected weekly rhythm.
- SFX shared: low gong on the epoch-marker fade-up at t=3.0s. Per-epoch atmospheric textures vary.

**Shared VO**

- All 5 epoch transitions get an Architect VO line. Each line is unique to the incoming epoch, but they share a delivery cadence: cool, administrative, ~2.4 s. Lines below.

**Shared implementation notes**

- Single mp4 per epoch (5 mp4s total), each rendered with the appropriate sky atmosphere baked in. No CSS filter shenanigans — the sky atmospheres are too distinct to fake with filters.
- Per-user delivery via `playerGameState.lastEpochSeen`; first session of the new epoch fires the matching mp4.
- The "outgoing epoch" portion of the cross-fade is **the previous epoch's signature sky**; this means each mp4's start-frame is the previous epoch in the canonical rotation. Asset cadence: 5 mp4s, but each features two different epoch atmospheres in its first 2 seconds. Acceptable production overhead.
- Chat-card surface: a single combined chat card fires ("New epoch: {epochName}") when the player loads the cutscene; opening it plays the matching mp4.

##### F.3.8.a — `cs_epoch_change_privacy`

- **Outgoing → Incoming**: Fall of Reality (red-black chaotic) → **Age of Privacy** (deep indigo, heavy shadow).
- **Incoming sky**: deep indigo `#312e81` saturated, with a low layer of dark cloud cover and silhouetted distant surveillance towers visible at the aperture's lower-third edge (just hinted, not defined).
- **Coffer wash hue**: indigo `#312e81` at 18%.
- **Atmospheric beat**: faint surveillance-grid lines (cyan `#22d3ee` at 10% opacity) drift slowly across the aperture's surface, suggesting unseen watching.
- **SFX timbre**: low cathedral drone in B minor; surveillance-radio chatter low-passed and barely audible (-22 dB) underneath; single low gong at t=3.0s.
- **Music**: 5 s bed at 60 BPM, B minor with raised 6th, low brass + surveillance-radio noise-floor + bowed glass armonica.
- **VO** (`architectVoManifest.json` line `architect_epoch_privacy_001` [NEW]): "The Age of Privacy returns. What you do not show, no one will know. What you do show, everyone will."

##### F.3.8.b — `cs_epoch_change_prophecy`

- **Outgoing → Incoming**: Age of Privacy → **Age of Prophecy**.
- **Incoming sky**: mystic violet `#7e22ce` saturated, with three slowly-rotating concentric celestial wheels of pale gold visible deep in the aperture (abstract, not zodiac), suggesting "what is written turns."
- **Coffer wash hue**: violet `#7e22ce` at 18%.
- **Atmospheric beat**: faint gold motes drift slowly upward through the aperture, brighter than the indigo epoch's grid lines.
- **SFX timbre**: bowed glass armonica long sustains in C# Phrygian; high choir held "ahh" vowel at -18 dB; low gong at t=3.0s.
- **Music**: 5 s bed at 56 BPM, C# Phrygian, full-orchestra sustained chord with celestial-wheel arpeggios on harp.
- **VO** (`architectVoManifest.json` line `architect_epoch_prophecy_001` [NEW]): "The Age of Prophecy returns. The wheels turn. Read the spokes."

##### F.3.8.c — `cs_epoch_change_insurgency`

- **Outgoing → Incoming**: Age of Prophecy → **Age of Insurgency**.
- **Incoming sky**: militant green `#16a34a` blended 60-40 with rebellion red `#dc2626` — the only dual-color epoch sky. The two colors do NOT blend smoothly; they sit in aggressive contrast bands across the aperture, like a torn flag.
- **Coffer wash hue**: alternating green and red at 18% each, on alternate coffer panels around the dome rim.
- **Atmospheric beat**: small ember-sparks drift in irregular eddies (combat-air feel).
- **SFX timbre**: war-drone in A minor; distant gunfire-impact noise-floor (heavily processed, abstract — no actual gunshot recognition) at -24 dB; low gong at t=3.0s; shorter, drier reverb than the other epochs.
- **Music**: 5 s bed at 100 BPM (fastest of the epochs — insurgency is movement), A minor, full Ironflight ensemble + war timpani, no choir.
- **VO** (`architectVoManifest.json` line `architect_epoch_insurgency_001` [NEW]): "The Age of Insurgency returns. The line breaks. Choose your side."

##### F.3.8.d — `cs_epoch_change_revelation`

- **Outgoing → Incoming**: Age of Insurgency → **Age of Revelation**.
- **Incoming sky**: crimson `#b91c1c` saturated with a single bright central truth-aperture at the oculus center — a brilliant white `#fefce8` pinprick that grows to 2 m visual diameter during the cross-fade, suggesting "all secrets visible."
- **Coffer wash hue**: crimson `#b91c1c` at 18%, with bright cream `#F4E4B8` highlights on coffers nearest the central truth-aperture.
- **Atmospheric beat**: visible "exposure ripples" (concentric expanding rings from the truth-aperture) emit twice during the clip, at t=2.4s and t=4.0s.
- **SFX timbre**: low cathedral drone in F minor with raised 5th (gives it an exposed, almost painful quality); brilliant high choir at -16 dB on truth-aperture grow; low gong at t=3.0s.
- **Music**: 5 s bed at 64 BPM, F minor with raised 5th, full ensemble + high choir + brass swell on the truth-aperture grow.
- **VO** (`architectVoManifest.json` line `architect_epoch_revelation_001` [NEW]): "The Age of Revelation returns. What was hidden is now seen. Including you."

##### F.3.8.e — `cs_epoch_change_fall`

- **Outgoing → Incoming**: Age of Revelation → **Fall of Reality**.
- **Incoming sky**: chaotic red-black `#7f1d1d` blended with deep void `#000000`, with **VHS-style glitch artifacts** ripping across the aperture's surface continuously (1-frame chroma-shift glitches at irregular intervals — 6 glitches across the 5 s clip). The Thought Virus's signature material visible everywhere.
- **Coffer wash hue**: red-black `#7f1d1d` at 25% (slightly stronger than other epochs' 18% — Fall is louder).
- **Atmospheric beat**: continuous CRT-scanline drift, periodic chroma-bleed glitches, occasional reality-tear flickers (1-frame frame-jumps where the dome briefly looks like a different angle).
- **SFX timbre**: low ominous drone in G minor with bent intervals; tape-stutter glitch SFX at each visual glitch instance (-12 dB each, 60 ms); low gong at t=3.0s; layered detuning string drone at -16 dB.
- **Music**: 5 s bed at 50 BPM (slowest — fall is paced), G minor with constantly shifting microtones (the bed itself sounds wrong, like `cs_thought_virus_reinfection`'s bed extended), low cellos + pipe organ + bowed glass armonica + retro-glitch percussion.
- **VO** (`architectVoManifest.json` line `architect_epoch_fall_001` [NEW]): "Fall of Reality. The Thought Virus walks. Cleared ground will not stay cleared."

### F.4 Signature abilities (12 entries × 2 variants = 24 sub-clips)

This section authors the cast cutscene for each of the 12 signature abilities defined in `apps/shared/guildSignatureAbilities.ts`. Each ability has a **light variant** (the canonical ceremonial cast) and a **dark variant** (the corrupted-power cast). Per Phase 5, abilities are exposed as chat-bar actions in the Common Room; casting one fires the matching cutscene to the caster fullscreen and a 2 s preview thumbnail to the guild WS room.

#### F.4 Shared standards

| Field | Value |
|---|---|
| Trigger | `guildSignatureAbilities.cast` server mutation succeeds (cooldown checked, skill 75+ required, player must be of the matching Archon's guild). |
| Duration | 3.0–5.0 s per cast (per-ability spec); the dark variant is **always 0.5 s longer** than its light counterpart (the additional 500 ms is corruption settle-time). |
| Broadcast scope | Caster fullscreen. Guild WS room receives a 2 s preview thumbnail (the start frame poster) plus the ability's name as HTML chrome. |
| Anchor object | The casting Archon's signature glyph at frame center, scaled larger than the F.2.4 emote glyphs (covering ~75% of frame height) and rendered in full cinematic detail (vs the emote's UI-grade simplification). Each ability's anchor matches its emote's glyph from F.2.4 for visual continuity — players who learned the emote glyph immediately recognize the ability. |
| Frame format | 16:9 cinematic 1920×1080 (the standard cutscene aspect, not the 1:1 emote square). Letterbox bars NOT baked in; camera framing fills the canvas. |
| Material | Per-Archon, **at full cinematic strength** — the cast cutscenes intentionally use the deepest material expression of each guild (cinematic Chorus is glass with full circuit traces; cinematic Eyes is flat with a full surveillance-grid; etc.). |
| House palette | Per-Archon accent hex from the per-guild table. The light variant is the guild's pure hex; the dark variant is the same hex hue-rotated −20°, saturation pushed to 110%, with a 50% blend toward corruption-red `#7f1d1d`. |

**Shared composition pattern**

- **Start frame**: the caster's environment (Common Room of the matching guild from `apps/client/src/pages/GuildCommonRoomPage.tsx`'s 12 backgrounds — `art/guilds/guild-the-{slug}.jpg`), the Archon's signature glyph **suspended in the air mid-foreground** at full size but **unlit** (only its silhouette readable). The player's POV is implied — first-person, no avatar.
- **End frame**: same Common Room, same glyph position, but the glyph is now **fully ignited** in a peak-cinematic burst — particles, lens flare anchor on the glyph's center, surrounding architecture lit by the burst, and a single visible element relevant to the ability's effect (per-ability spec — e.g., for Harmonize, a faint web of light connects the glyph to silhouetted ally figures around the room edges).

**Shared Veo 3.1 motion convention**

- Camera: a slow 50mm push-in toward the glyph along its central axis, 0.20 m total over the duration. No roll, no whip-pan.
- Subject motion: the glyph ignites in a 2-stage envelope — **gather** (the surrounding Common Room's ambient particles drift inward to the glyph) for the first 40% of duration, then **release** (the glyph bursts and the ability's effect propagates outward) for the remaining 60%.
- Closing tableau: the final 600 ms hold the post-release state, with the room's ambient lighting now tinted in the guild's accent hex.

**Shared sound design**

- Each ability's SFX bundle is keyed to its Archon's emote SFX timbre (carry-forward — players who learned the emote's audio signature recognize it expanded into a full cast). Per-ability spec adds the burst-and-release sound design.
- Music bed is in the Archon's House mode (Resonance Lydian, Umbra Aeolian, Ironflight Phrygian Dominant, Liminal whole-tone), 4–5 s through-composed.
- VO is delivered by the matching Archon Professor (per `apps/shared/mechronisProfessors.ts`) using the existing professor VO manifests, at -16 LUFS, ducks music -6 dB.

**Shared dark-variant rule**

For each ability's dark variant:
- Visuals: same composition, full corruption-red blend; black-mist tendrils replace bright particles; the glyph's burst includes a brief 1-frame "shadow tear" glitch at the peak.
- Audio: the music bed retains its pitch but loses 1 octave of high-frequency content (low-pass filter at 4kHz) and gains a bit-crushed parallel layer at -22dB.
- VO: a different line per Archon — the dark line is delivered with **the same Professor's voice** but in a corrupted register (pitch-shifted +50 cents, slight reverb-tail extension). This is canon — the Professor IS still casting; the corruption is in what they've chosen, not who they are.
- Implementation: the dark variant ships as its own mp4 (not a runtime filter — the corruption-red blend and shadow-tear glitch are too visually distinct to fake), but it shares the start-frame Common-Room background asset with the light variant.

**Shared implementation notes**

- 24 mp4s total + 24 SFX bundles + 24 music beds + 24 VO lines (12 light + 12 dark, one of each per Archon).
- WS broadcast payload: `{ cutsceneId: "cs_sig_{archonId}_{light|dark}", casterUserId, casterGuildId, archonId, abilityName, cooldownEndsAt }`.
- Reduced-motion fallback: end frame as static poster + caption + SFX bundle.
- Authoring cadence: render in batches of 4 (one per House — Resonance bunch, Umbra bunch, Ironflight bunch, Liminal bunch) to share lighting setups across each House's Common-Room backgrounds.

#### Per-ability entries

Each entry below specifies only what differs from the shared standards. The light and dark variants are summarized in a single tabular block per ability.

##### F.4.1 — `cs_sig_1` — The CoNexus / Chorus — **Harmonize** ↔ **Dissonance**

| Field | Light: Harmonize | Dark: Dissonance |
|---|---|---|
| Anchor glyph | The tuning-fork-in-resonance-ring (matches F.2.4.a emote) at full cinematic scale |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | A web of indigo light connects the glyph to **3 silhouetted ally figures** standing at the Common Room's edges (the "all companions sync to initiative" ability text made visible) | Same web, but it inverts: the connections **pull energy from the allies inward** to the glyph, and one ally silhouette flickers red as if forced to act against will |
| Burst peak | Full-bloom indigo `#818cf8` resonance ring expansion, 8 charge ignitions in sequence (carries the emote's count) | Inverted resonance — the ring contracts inward, charges igniting in red corruption sequence |
| SFX peak | Brass tuning-fork strike at burst peak (-10dB), followed by 3-voice harmonic chord swell (one note per ally, perfect fifths, glass-armonica) | Same brass strike but pitch-bent down 50 cents at peak, harmonic chord deconstructs into a tritone interval |
| Music | 4 s bed in C Lydian, full-orchestra harmonic-cascade figure | 4.5 s bed in C Locrian (the diabolus of Lydian), same instrumentation but pitch-bent and bit-crushed |
| VO | Headmaster Kanevas (`kanevasVoManifest.json` line `kanevas_harmonize_001` [NEW]): "Sync to me. We move as one." | Kanevas line `kanevas_dissonance_001` [NEW]: "Sync to me. They will move as I choose." |

##### F.4.2 — `cs_sig_2` — The Watcher / Eyes — **Unseen Passage** ↔ **Private Confession**

| Field | Light: Unseen Passage | Dark: Private Confession |
|---|---|---|
| Anchor glyph | Camera-iris in reticle brackets (matches F.2.4.b emote) — this is the most recognizable Archon glyph, deserves cinematic treatment |
| Duration | 3.0 s (shortest of the abilities — Unseen is fast) | 3.5 s |
| Effect-visible element | The caster's POV briefly fades to 30% alpha (the player goes invisible — visualized via a translucent post-effect on the entire frame for 1.5 s) | Caster's POV holds full opacity; instead, **3 floating thought-bubbles** materialize around the glyph, each containing an unreadable script-glyph (NPC private thoughts visualized as overheard whispers) |
| Burst peak | Reticle brackets snap inward and lock; full frame shifts to 30% alpha for 1.5 s | Reticle brackets stay open; thought-bubbles fade in around the glyph (each bubble cross-fades over 600 ms) |
| SFX peak | Camera-shutter snap (carries from emote, scaled up) at -8dB; 1.5 s of muted ambient (the "you are unseen" silence is the audio signature) | Shutter snap, then 3 layered whispered voice-clips (each unintelligible, mixed at -22dB) panned hard L, C, R |
| Music | 3 s bed in D Aeolian, sparse — solo cello + sustained pad, mostly silent during the muted-ambient window | 3.5 s bed in D Aeolian, denser — solo cello + 3-voice whispered choir at -18dB |
| VO | Professor Aoki (`aokiVoManifest.json` line `aoki_unseen_001` [NEW]): "Walk where they cannot watch." | Aoki line `aoki_private_001` [NEW]: "Their secrets are mine now." |

##### F.4.3 — `cs_sig_3` — The Collector / Archive — **Soul-Read** ↔ **Soul-Take**

| Field | Light: Soul-Read | Dark: Soul-Take |
|---|---|---|
| Anchor glyph | Faceted teardrop gem in three-prong claw (matches F.2.4.c emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | The gem's inner sigil (the deterministic Collector mark) blooms outward and **3 floating amber motes orbit a target silhouette** at frame edge — the NPC's trust/desires/secret visualized as 3 motes | Same gem-bloom but the 3 motes detach from the target silhouette and migrate **into the gem itself** (theft visualized) |
| Burst peak | Gem reaches full inner-glow at 100%, motes bloom around target | Gem reaches 100%, motes consumed into gem, target silhouette dims by 30% |
| SFX peak | Vinyl-crackle pad (carry from emote) sustains; soft amber bell-chime at peak (-10dB, F#5, 2 s tail); 3 sequential paper-rustle whispers as motes bloom | Same crackle and chime, then 3 sucking-pull sounds (granular reverse-pad) as motes migrate into gem |
| Music | 4 s bed in D Aeolian, dulcimer + harpsichord arpeggios | 4.5 s bed in D Aeolian Phrygian, same instrumentation but with retrograde harpsichord (notes play backward) |
| VO | Curator Halverez (`halverezVoManifest.json` line `halverez_soulread_001` [NEW]): "Show me what you treasure." | Halverez line `halverez_soultake_001` [NEW]: "It is mine now. Always was." |

##### F.4.4 — `cs_sig_4` — The Vortex / Between — **Phase-Step** ↔ **Dimensional Drift**

| Field | Light: Phase-Step | Dark: Dimensional Drift |
|---|---|---|
| Anchor glyph | Door-frame with ajar-sliver (matches F.2.4.d emote) |
| Duration | 3.5 s (Phase is fast) | 4.0 s |
| Effect-visible element | Camera POV briefly enters the door's gap — a 1 s journey through abstract fuchsia hyperspace, exiting at a different room-perspective (the "teleport through walls" mechanic visualized) | Same camera entry, but the hyperspace journey **stutters** with 4 phase-jumps, exiting at a slightly off-target room-perspective (15% miss-chance visualized) |
| Burst peak | Door opens fully (90° pivot), camera dives through, room re-establishes | Same dive but with 4 stutter-jumps mid-journey, slight perspective wobble on exit |
| SFX peak | Three dimensional-pop ticks (carry from emote scaled up, -8dB each), then 1 s of airy hyperspace whoosh, then a gentle re-establish chime | Same ticks and whoosh, but each phase-jump adds a glitch-click; exit chime is subtly off-pitch by 30 cents |
| Music | 3.5 s bed in G whole-tone, electric piano + bowed glass armonica + reverse cymbal swells | 4.0 s bed in G whole-tone, same but with 4 short tape-stop glitches at the phase-jump moments |
| VO | Professor Orphic (`orphicVoManifest.json` line `orphic_phasestep_001` [NEW]): "Through. Out the other side." | Orphic line `orphic_drift_001` [NEW]: "Through... mostly." |

##### F.4.5 — `cs_sig_5` — The Meme / Influencers — **Viral Word** ↔ **Thought Carry**

| Field | Light: Viral Word | Dark: Thought Carry |
|---|---|---|
| Anchor glyph | Center-dot with three concentric ripples (matches F.2.4.e emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | The 4th ripple (carrier from emote) propagates outward through the room and **passes through a single NPC silhouette**, which briefly nods (the "one NPC believes one lie" mechanic) | Same ripple, but it passes through **multiple NPC silhouettes** at the room edges — 4 in sequence, each nodding (faction-wide spread) |
| Burst peak | Single ripple expansion; one NPC nod at frame edge | Quad ripple expansion; 4 NPC nods cascading |
| SFX peak | Heart-thud (carry from emote, scaled to -8dB), harmonic-resonance swell (-12dB peak); single soft acknowledgment-chime as NPC nods | Heart-thud, harmonic swell, 4 sequential acknowledgment-chimes ascending in pitch (the lie spreading) |
| Music | 4 s bed in F Lydian, electric piano + dulcimer + sustained pad | 4.5 s bed in F Lydian to F Dorian (modal shift mid-bed — the meaning warps), same instrumentation |
| VO | Professor Mireille (`mireilleVoManifest.json` line `mireille_viral_001` [NEW]): "Believe me. Just for a moment." | Mireille line `mireille_carry_001` [NEW]: "Believe me. Tell everyone." |

##### F.4.6 — `cs_sig_6` — The Warlord / Yellow Coats — **Parade Order** ↔ **Acceptable Casualties**

| Field | Light: Parade Order | Dark: Acceptable Casualties |
|---|---|---|
| Anchor glyph | Chevron with three hash-mark vectors (matches F.2.4.f emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | The 3 hash-marks extend outward to **3 enemy silhouettes** at frame edges, then **pull them inward** to the caster's position (forced-positioning visualized) | Same 3 hash-marks, but **enemy silhouettes turn on each other** mid-pull — the caster's command makes them friendly-fire |
| Burst peak | Chevron snap-and-lock (carry from emote, scaled), enemies hauled inward | Chevron snap, enemies converge inward, then turn on adjacent enemies in a sequence of 3 micro-impacts |
| SFX peak | Mechanical click-clack, 3 tactical chirps (carry), 3 sequential tow-cable-and-impact sounds as enemies are pulled (-10dB summed) | Same chirps, 3 sequential blade-on-blade clashes (-8dB summed) as friendly-fire kicks in |
| Music | 4 s bed in A Phrygian Dominant (Ironflight mode), war-timpani + low brass + military trumpet | 4.5 s bed in A Phrygian Dominant, same instruments but with dissonant trumpet stabs |
| VO | General Kasra (`kasraVoManifest.json` line `kasra_parade_001` [NEW]): "Parade order. To me. Now." | Kasra line `kasra_casualties_001` [NEW]: "Some losses are acceptable. These." |

##### F.4.7 — `cs_sig_7` — The Politician / Congress — **Verbal Contract** ↔ **Blood Oath**

| Field | Light: Verbal Contract | Dark: Blood Oath |
|---|---|---|
| Anchor glyph | Two interlocking purple rings (matches F.2.4.g emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | Right ring extends outward to wrap around an enemy silhouette at frame edge — the enemy's outline shifts from red to purple (5-turn ally conversion visualized) | Right ring extends to wrap enemy, but **a thin red line connects from the ring back to the caster** (a "blood oath" tether), and the caster's silhouette dims slightly (HP drain visualized) |
| Burst peak | Rings converge-and-seal (carry from emote, scaled), right ring extends outward, enemy turns purple | Same rings + extension, plus a single red tether line ramps in connecting caster to enemy |
| SFX peak | Wax-press-and-settle (carry from emote, scaled to -8dB), bright bell-chime; soft choral "ah" as enemy is converted (-14dB) | Same press, bell, but the choral "ah" is replaced by a wet thread-pulling sound and a single low cello pluck on the tether |
| Music | 4 s bed in F Lydian, harpsichord + sustained string pad | 4.5 s bed in F Lydian Dominant, same but with a low pulsing cello drone underneath |
| VO | Senator Vellis (`vellisVoManifest.json` line `vellis_contract_001` [NEW]): "Agreed. For five turns of the wheel." | Vellis line `vellis_blood_001` [NEW]: "Agreed. For all turns. Mine." |

##### F.4.8 — `cs_sig_8` — The Warden / Locks — **Quarantine** ↔ **Thought Virus**

| Field | Light: Quarantine | Dark: Thought Virus |
|---|---|---|
| Anchor glyph | Hex containment cell with center dot (matches F.2.4.h emote) |
| Duration | 4.0 s | 4.5 s (this dark variant is the longest) |
| Effect-visible element | The 6-spoked containment lattice extends outward to **fully enclose a target silhouette** at frame center, freezing them in place (2-turn lockdown visualized) | The lattice extends, but instead of locking the target, it **infects them** — red corruption-veins spread from the contact points outward across the target's silhouette (50% friendly-fire risk, multi-turn duration visualized as a slow corruption spread) |
| Burst peak | Lattice extends, target frozen in cell, brief red warning-hairline flash (carry from emote) | Lattice contacts, then transforms — corruption-veins sprout and extend across target |
| SFX peak | Mechanical lock-engage click (carry, scaled to -6dB), containment-field hum (sustained, -16dB during lockdown), single red-flash silent | Lock-engage click, then a wet-corruption hiss replacing the field hum, low-pulsing infection drone |
| Music | 4 s bed in B Aeolian (Umbra mode), pipe organ + low strings + bowed glass | 4.5 s bed in B Locrian, same but with retrograde organ (notes reversed) |
| VO | Warden Greenshaw (`greenshawVoManifest.json` line `greenshaw_quarantine_001` [NEW]): "Held. You will not move." | Greenshaw line `greenshaw_virus_001` [NEW]: "Held. And contagious." |

##### F.4.9 — `cs_sig_9` — The Game Master / Grey Gamers — **Rule Rewrite** ↔ **House Rules**

| Field | Light: Rule Rewrite | Dark: House Rules |
|---|---|---|
| Anchor glyph | Axonometric die showing 1-2-3 faces (matches F.2.4.i emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | The die rotates 360° (carry from emote, scaled), then a **single rule-line of glyph-script** materializes in the air beside the die, which then dissolves with a quick rewrite (this-turn rule change) | Same rotation and rule-line materializes, but **stays visible** (permanent rule change), and the surrounding architecture itself subtly distorts to reflect the new rule (one wall edge briefly bends) |
| Burst peak | Die rotation completes, rule-line cross-fades in, then dissolves over 600 ms | Die rotation, rule-line materializes and persists, environment-bend at the moment of permanence |
| SFX peak | Die-clack (carry, -8dB), 14-frame projector-clicks during rotation, settle-clack; rule-rewrite "page-turn" sound at peak | Same die-clacks, but the page-turn sound is replaced by a stone-grinding architectural shift |
| Music | 4 s bed in G whole-tone (Liminal mode), retro-synth + harpsichord + bowed glass | 4.5 s bed in G whole-tone with bent intervals, same instruments but processed through a tape-warble |
| VO | Professor Vex (`vexVoManifest.json` line `vex_rewrite_001` [NEW]): "House rules. For this turn." | Vex line `vex_houserules_001` [NEW]: "House rules. From now on. Forever." |

##### F.4.10 — `cs_sig_10` — The Necromancer / Living — **Second Breath** ↔ **Borrowed Time**

| Field | Light: Second Breath | Dark: Borrowed Time |
|---|---|---|
| Anchor glyph | ECG pulse waveform with central spike (matches F.2.4.j emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | The waveform flatlines (carry from emote pattern), then a single dramatic resurrection-spike grows back at 25% size (the "revive at 25% HP" mechanic) | Same flatline-and-revive, but the spike grows to **full 100% HP size** while a thin black tether-line extends from the caster to a nearby enemy silhouette (the borrowed-time mechanic — life debt) |
| Burst peak | Flatline (1 s held silence — the dramatic moment), then revival-spike grows | Same flatline, then full-spike revive plus tether ramp-in connecting caster to enemy |
| SFX peak | ECG pulse (carry), flatline tone (carry, sustained 1.0s), defibrillator-zap (carry, scaled), then deep heartbeat-thud at full revive | Same pattern but the heartbeat-thud now echoes faintly from the tether endpoint (dual-source resurrection) |
| Music | 4 s bed in A minor (Living mode), low cello solo + sustained pad, builds from silence at flatline | 4.5 s bed in A minor with a parallel detuned cello underneath (the borrowed-time signature), same builds |
| VO | Dr. Vasara (`vasaraVoManifest.json` line `vasara_breath_001` [NEW]): "Again. Not finished." | Vasara line `vasara_borrowed_001` [NEW]: "Again. At their cost." |

##### F.4.11 — `cs_sig_11` — The Engineer / Forge — **Field Repair** ↔ **Salvage Rights**

| Field | Light: Field Repair | Dark: Salvage Rights |
|---|---|---|
| Anchor glyph | Hex-bolt seen head-on (matches F.2.4.k emote) |
| Duration | 4.0 s | 4.5 s |
| Effect-visible element | The bolt rotates 60° (carry from emote, scaled), then **a damaged equipment silhouette** at frame edge visibly mends (cracks fill with orange light, durability restored) | Same bolt-tighten, but instead of mending equipment, the caster **extracts a glowing trait-shard from a previous-user's silhouette** and absorbs it (trait extraction mechanic visualized) |
| Burst peak | Bolt rotation completes (3 wrench-ticks carry), spark-flash (carry, scaled), then mend-light filling the equipment | Same rotation and spark, but instead of mend-light, an extraction-pull as the trait-shard migrates from a fading silhouette to the caster |
| SFX peak | Wrench-clicks, metal-grinding torque (carry), spark-flash burst (-8dB), then rebuilding-mechanical-clatter as equipment mends | Same wrench-clicks but the rebuilding-clatter is replaced by a granular trait-extraction whoosh + the silhouette fading to silence |
| Music | 4 s bed in C Phrygian Dominant (Ironflight mode), low brass + anvil-percussion + bowed glass | 4.5 s bed in C Phrygian Dominant, same instruments but with a fading-out final cello note (the previous user's voice receding) |
| VO | Artificer Vent (`ventVoManifest.json` line `vent_repair_001` [NEW]): "Fixed. Stronger than before." | Vent line `vent_salvage_001` [NEW]: "Salvaged. Their loss, your gain." |

##### F.4.12 — `cs_sig_12` — The Human / Architect's Study — **Investigator's Sight** ↔ **Architect's Eye**

| Field | Light: Investigator's Sight | Dark: Architect's Eye |
|---|---|---|
| Anchor glyph | Scroll partially unrolled (matches F.2.4.l emote) |
| Duration | 5.0 s (longest light variant — the Human's signature is investigative, takes time) | 5.5 s (longest dark variant) |
| Effect-visible element | Scroll unrolls (carry from emote, scaled), revealing the next puzzle's solution as a **briefly-visible glyph-arrow** pointing at a target object/silhouette in the room | Same scroll-unroll, but the revealed glyph shows **the entire solution chain plus its designer's name** (architectural omniscience) — multiple linked glyph-strands materialize across the room, like seeing the puzzle's source code |
| Burst peak | Scroll fully unrolls, single glyph-arrow points to target (held visible 1.5 s) | Scroll unrolls, full solution-chain materializes (held visible 2.0 s), then dissolves |
| SFX peak | Parchment-rustle (carry), wooden-roller-creak (carry), bell-chime at solution reveal (D5, -10dB, 1.6s tail) | Same rustle and creak, then a layered chord of 4 bell-chimes (D5+F#5+A5+C#6, summed -8dB, 2.4s tail) for the chain reveal |
| Music | 5 s bed in F Lydian (Architect's Study mode is bright but contemplative), harp + bowed glass + dulcimer | 5.5 s bed in F Lydian Augmented (the "uncanny" Lydian variant), same instruments + a single faint pipe organ pad |
| VO | The Proctor (`proctorVoManifest.json` line `proctor_sight_001` [NEW]): "There. The next answer." | Proctor line `proctor_eye_001` [NEW]: "There. And there. And there. All of it. Yours." |

### F.5 Hall & decoration (3 entries, 7 sub-clips)

#### F.5.1 — `cs_hall_tier_up` (4 sub-clips, one per tier transition)

| Field | Value |
|---|---|
| Trigger | `guildHall.upgradeTier` mutation succeeds; tier transitions are 1→2 (Outpost→Barracks), 2→3 (Barracks→Fortress), 3→4 (Fortress→Citadel), 4→5 (Citadel→Sanctum). Per the existing `apps/shared/guildHall.ts` data. |
| Duration | 8.0 s per sub-clip — the longest entries in F.5; tier-ups deserve weight. |
| Broadcast scope | All guild members fullscreen on next session-start (per-user queued, like victory). The leader who paid the upgrade also gets a chat card immediately. |
| Anchor object | The guild's Common Room interior at frame center, present in both stills with the camera fixed; what changes is the architecture itself reshaping. |
| Material | glass — heroic; the room transforms |
| House palette | Joined guild's hex from per-guild table |

**Shared composition (4 sub-clips)**

- **Start frame**: a wide interior shot of the guild's Common Room at the **outgoing tier**, viewed from a low-three-quarter angle, with the architectural details and decorations corresponding to that tier present and visible (per `apps/shared/guildHall.ts` per-tier room definitions).
- **End frame**: identical camera, identical guild — the room has reshaped. Walls have moved (Barracks adds a second floor; Fortress adds reinforced columns; Citadel adds vaulted ceilings; Sanctum adds the central oculus and floating dais). New rooms unlock and are visible through previously-empty doorways.

**Shared Veo 3.1 motion prompt**

1. Camera: locked. The room transforms; the camera holds.
2. Subject motion: at t=0.0s the room is at outgoing tier. Between t=0.4s and t=2.0s the **outgoing-tier walls fade-glitch** (a brief retro-material 1-frame stutter, then continuous translucency). Between t=2.0s and t=5.0s the **architectural reshape**: stone blocks materialize via additive cross-fade as new walls rise, ceilings extend, floor-patterns add new inlay. Between t=5.0s and t=6.4s decorations and furniture fill in (the new tier's room contents visualizing — banners unfurl, trophy cases materialize, etc.). Between t=6.4s and t=7.4s the lighting transitions from outgoing-tier ambient to new-tier brighter ambient. Final 600 ms holds the new tableau.
3. Atmospheric beat: rising motes throughout the reshape (architecture being "remembered into existence"); 12-mote upward column from the center floor across the full duration.
4. Audio cue ties: outgoing-walls fade rides a low retro-glitch swell; reshape rides a 3 s building-orchestral crescendo; decorations fill on a 4-bar harp-and-timpani figure; lighting transition on sustained brass swell; final tableau under bed's cadence.
5. Negative motion prompt: no whip pans, no zoom, no characters, no readable text, no architectural elements morphing into faces, no real-world building styles.

**Per-tier sub-clip differentiation** (sub-clips F.5.1.a through F.5.1.d)

- **F.5.1.a — `cs_hall_tier_up_outpost_to_barracks`** (1→2): Outpost (single-room stone) reshapes into Barracks (adds Mess Hall and Training Ground, second floor visible through new staircase). Music: bright F Lydian, 76 BPM. VO: Elara (`elaraVoManifest.json` line `elara_tier_2_001` [NEW]): "Outpost no more. The hall has weight now."
- **F.5.1.b — `cs_hall_tier_up_barracks_to_fortress`** (2→3): Barracks reshapes into Fortress (reinforced columns, War Room visible, Armory door appears). Music: F Lydian with brass, 84 BPM. VO: Elara line `elara_tier_3_001` [NEW]: "Fortress. Strong walls. Better songs."
- **F.5.1.c — `cs_hall_tier_up_fortress_to_citadel`** (3→4): Fortress reshapes into Citadel (vaulted ceilings, Research Wing visible, Diplomatic Chamber). Music: F Lydian + pipe organ, 92 BPM. VO: Elara line `elara_tier_4_001` [NEW]: "Citadel. The world looks up at you now."
- **F.5.1.d — `cs_hall_tier_up_citadel_to_sanctum`** (4→5): Citadel reshapes into Sanctum (central oculus opens, floating dais materializes, Oracle Pool and Portal Chamber visible). Music: full Mechronis ensemble in B-flat major, 76 BPM. VO: Elara line `elara_tier_5_001` [NEW]: "Sanctum. You have reached the place where the Architect's gaze rests warmest."

**Shared SFX bundle structure**

- Sub: deep rumble swell, 30 Hz, ramping from -22dB to -10dB at the reshape peak (t=4.0s), settling to -14dB.
- Mid: stone-grinding-and-rebuilding granular layer (4 s during the reshape, -12dB peak), wooden-and-metal furniture-settling sounds during the decoration-fill phase (-14dB summed).
- Top: brass swell during the lighting transition (-12dB), 12-mote bell-tings during the upward column (continuous, summed -16dB).
- Transient: deep felt-not-heard kicks at t=2.0s, 5.0s, 7.4s (each -10dB, 50Hz, 200ms).

**Implementation notes**

- 4 mp4s total (one per tier transition). Per-guild variant via runtime CSS color filter (the room itself is rendered guild-agnostic; decorations/banners get the guild hex). Scenes are 90% architecture, 10% color, so single-render-with-filter works.
- WS payload: `{ cutsceneId: "cs_hall_tier_up_{transition}", guildId, newTier }`.
- Reduced-motion fallback: end frame poster + caption + SFX bundle. The architectural reshape is the heart, but the SFX stone-grinding carries the moment.

#### F.5.2 — `cs_decoration_place` (1 generic clip)

| Field | Value |
|---|---|
| Trigger | `guildHall.placeDecoration` mutation succeeds. |
| Duration | 2.0 s — shortest of the F.5 entries; placement is frequent and small. |
| Broadcast scope | Caster sees the cutscene as a small inline animation in the Hall view (NOT fullscreen — would be too disruptive for a routine action). Other guildmates currently in the Hall view see the same animation in real-time via WS. |
| Anchor object | The placed decoration itself (procedural — could be a banner, trophy case, candelabra, etc., per `apps/shared/guildHall.ts` decoration list). |
| Material | glass with single-particle bloom. |
| House palette | Joined guild's hex. |

**Composition**

- **Start frame**: an empty grid-cell in the Hall's room layout (top-down 3D view, slight 30° elevation), highlighted with a faint cyan placement-target outline.
- **End frame**: the decoration has materialized in the cell, fully formed, with a soft particle bloom around it just settling.

**Veo 3.1 motion prompt**

1. Camera: locked.
2. Subject motion: at t=0.0s empty cell with cyan outline. Between t=0.2s and t=1.0s the decoration **materializes** via additive cross-fade — first an outline, then full geometry, then full color. At t=1.0s a single soft particle bloom (8 motes, guild-hex tinted) spawns and dissolves outward over 1 s.
3. Audio cue ties: materialize on a soft chime; bloom on harp arpeggio.
4. Negative motion: no zoom, no panning, no character interaction.

**SFX**: 2-second bundle. Sub: barely-there pad (-22dB). Mid: cross-fade reveal whoosh + wooden-or-metal settling (per decoration type — the asset library tags each decoration with a settling-timbre). Top: 8 bell-tings on the bloom (continuous, summed -16dB). Transient: a soft felt-tap kick on materialize start (-14dB, 80Hz, 100ms).

**Music**: NO bed. The clip is too short and frequent for music; SFX-only.

**VO**: NO VO. Routine action.

**Implementation notes**: single mp4 covers all decorations via the runtime decoration-type-overlay layer in `CutscenePlayer.tsx`. The decoration's mesh/sprite is composited onto the empty-cell base render at runtime. Reduced-motion fallback: end frame poster only, no caption (no VO to caption).

#### F.5.3 — `cs_signature_room_unlock` (2 sub-clips: Oracle Pool, Portal Chamber)

| Field | Value |
|---|---|
| Trigger | The first time a guild's Hall reaches tier 4 (unlocks Oracle Pool) or tier 5 (unlocks Portal Chamber), per the existing `apps/shared/guildHall.ts` per-tier room-unlock data. |
| Duration | 6.0 s per sub-clip |
| Broadcast scope | All guild members fullscreen on next session-start (per-user queued). Leader who paid the upgrade gets a chat card immediately. |
| Anchor object | The newly-unlocked room's central feature (the Oracle Pool's still water surface; the Portal Chamber's center portal-arch). |
| Material | glass — both rooms are mystical, deserve full cinematic glass. |
| House palette | Joined guild's hex. |

##### F.5.3.a — `cs_signature_room_unlock_oracle_pool`

- **Start frame**: a previously-sealed door at the end of a hallway in the Citadel-tier hall, viewed from 4 m back, doorway glyphs dim.
- **End frame**: same hallway, same door — **now open**, revealing the Oracle Pool beyond: a circular pool of dream-substance reflecting an impossible starfield, ringed by a low stone bench, with three small glowing prophecy-flames at the pool's edges. Camera through the doorway, depth visible.
- **Veo motion**: door glyphs ignite (t=0.4s–1.6s); door opens via 3-second slow inward swing (t=1.6s–4.6s); camera pushes through the doorway by 0.8 m (t=2.0s–4.6s); pool revealed with a slow 1 s ambient-rise as the prophecy-flames ignite. Final 1.4 s holds.
- **SFX**: glyph-ignite chime, slow stone-grinding door swing, water-reflective ambient rise, 3 prophecy-flame ignition crackles.
- **Music**: 6 s bed in F Lydian Augmented (the prophecy mode), bowed glass armonica + harp + sustained low choir.
- **VO**: Professor Vex (`vexVoManifest.json` line `vex_oracle_001` [NEW]): "The pool sees what is. Drink carefully."

##### F.5.3.b — `cs_signature_room_unlock_portal_chamber`

- **Start frame**: a previously-sealed circular doorway in the Sanctum-tier hall, with 12 small inactive runic stones embedded in the doorframe (one per Archon).
- **End frame**: same doorway — runic stones now ignited in a sequence around the frame, doorway open, revealing the Portal Chamber: a vaulted hexagonal room with a single large central portal-arch at the room's center, currently dormant but humming with potential.
- **Veo motion**: 12 runic stones ignite in sequence (the canonical 1-12 Archon order, t=0.5s–3.5s, ~250ms per stone); doorway opens between t=3.5s and t=5.0s (1.5 s slow rotation around its center axis like a lock-mechanism — different visual language from F.5.3.a's swing); camera pushes through to reveal the Portal Chamber. Final 1.0 s holds.
- **SFX**: 12 sequential rune-ignition chimes (ascending C5 to C6 chromatic, each -12dB), stone-and-metal lock-rotation (granular, -10dB peak), portal-hum activation (low sustained drone, -14dB).
- **Music**: 6 s bed in B-flat major (Mechronis school anthem mode), full ensemble + brass swell at the portal reveal.
- **VO**: The Architect (`architectVoManifest.json` line `architect_portal_001` [NEW]): "Twelve voices unlock the door. The chamber is yours. Use it well."

**Shared implementation notes (F.5.3)**

- 2 mp4s total. Per-guild variant via runtime CSS color filter (the room geometry is guild-agnostic; ambient lighting tints to guild hex).
- WS payload: `{ cutsceneId: "cs_signature_room_unlock_{room}", guildId }`.
- Reduced-motion fallback: end frame poster + caption + SFX bundle.

---

# G. SOUND-DESIGN APPENDIX & VERIFICATION

This section consolidates audio-asset inventories across the catalogue (so the sound-design contractor can see all music beds, all SFX stems, and all VO lines in one place) and specifies the verification plan that gates "shipped" status.

## G.1 — Music bed library (consolidated)

26 unique through-composed music beds, all 48 kHz stereo, normalized per-bed LUFS as specified. Beds tagged `[loopable]` are seamless 4–6s loops; the rest are one-shot. Per-cutscene mode reflects the matching House (or war-anthem mode where applicable).

| Bed file | Length | BPM | Mode | LUFS | One-shot or [loopable] | Tied to |
|---|---|---|---|---|---|---|
| `cs_guild_join_bed.ogg` | 6s | 88 | House-keyed (4 variants) | -18 | one-shot | F.1.1 |
| `cs_guild_first_message_bed.ogg` | 4s | 72 | House-keyed | -20 | [loopable] | F.1.2 |
| `cs_friend_accept_bed.ogg` | 4s | 60 | F (modal) | -19 | one-shot | F.1.3 |
| `cs_sorting_ceremony_arrival_pre_bed.ogg` | 6s | 50 | suspended C/D/F#/A# | -19 | one-shot | F.1.4.a |
| `cs_sorting_ceremony_arrival_post_{house}_bed.ogg` (×4) | 5s | 56 | House home mode | -18 | one-shot | F.1.4.b |
| `cs_contract_unlock_bed.ogg` | 5s | 64 | F Lydian | -19 | [loopable] | F.2.1 |
| `cs_contract_complete_bed.ogg` | 4s | 72 | F Lydian | -18 | one-shot | F.2.2 |
| `cs_house_cup_weekly_reset_bed.ogg` | 6s | 60 | school anthem (modal tour) | -17 | one-shot | F.2.3 |
| `cs_donation_milestone_bed.ogg` | 4s | 76 | F Lydian | -18 | one-shot | F.2.5 |
| `cs_war_declared_bed.ogg` | 5s | 88 | D Phrygian Dominant | -16 | one-shot | F.3.1 |
| `cs_war_first_blood_bed.ogg` | 4s | 92 | D Phrygian Dominant | -16 | one-shot | F.3.2 |
| `cs_war_mvp_crowned_bed.ogg` | 6s | 60 | D Mixolydian | -17 | one-shot | F.3.3 |
| `cs_war_victory_bed.ogg` | 8s | 76 | B-flat major | -15 | one-shot | F.3.4 |
| `cs_war_defeat_bed.ogg` | 5s | 50 | D minor | -19 | one-shot | F.3.5 |
| `cs_alliance_war_placement_lock_bed.ogg` | 5s | 96 | D Phrygian Dominant | -16 | one-shot | F.3.6 |
| `cs_thought_virus_reinfection_bed.ogg` | 4s | 56 | D minor (detuned) | -19 | one-shot | F.3.7 |
| `cs_epoch_change_privacy_bed.ogg` | 5s | 60 | B minor (raised 6th) | -18 | one-shot | F.3.8.a |
| `cs_epoch_change_prophecy_bed.ogg` | 5s | 56 | C# Phrygian | -18 | one-shot | F.3.8.b |
| `cs_epoch_change_insurgency_bed.ogg` | 5s | 100 | A minor | -17 | one-shot | F.3.8.c |
| `cs_epoch_change_revelation_bed.ogg` | 5s | 64 | F minor (raised 5th) | -17 | one-shot | F.3.8.d |
| `cs_epoch_change_fall_bed.ogg` | 5s | 50 | G minor (microtonal) | -19 | one-shot | F.3.8.e |
| `cs_sig_{1..12}_light_bed.ogg` (×12) | 3–5s | varies | House home mode | -17 | one-shot | F.4.1–12 light |
| `cs_sig_{1..12}_dark_bed.ogg` (×12) | 3.5–5.5s | varies | parallel-dark mode | -19 | one-shot | F.4.1–12 dark |
| `cs_hall_tier_up_{1..4}_bed.ogg` (×4) | 8s | 76–92 | F Lydian / B-flat major | -16 | one-shot | F.5.1.a–d |
| `cs_signature_room_unlock_oracle_pool_bed.ogg` | 6s | 60 | F Lydian Augmented | -18 | one-shot | F.5.3.a |
| `cs_signature_room_unlock_portal_chamber_bed.ogg` | 6s | 76 | B-flat major | -17 | one-shot | F.5.3.b |

**Cross-bed continuity rules**:
- The bowed glass armonica is the catalogue's connective tissue — present (often as a sustain pad) in every bed so transitions between back-to-back cutscenes feel like one continuous piece.
- Beds in adjacent rotation (e.g., the F.3.8 epoch-change beds following one another in the canonical rotation) end on a sustained tonic that resolves into the next bed's pickup — verifying this requires the audio contractor to prep beds in pairs (Privacy→Prophecy, Prophecy→Insurgency, etc.).
- F.3.4 (war victory) and F.3.5 (war defeat) are in parallel keys (B-flat major / D minor) and at adjacent tempos so the loser's bed harmonically resolves "near" the winner's bed if both played in sequence — intentional.

## G.2 — SFX bundle library (consolidated)

Every SFX bundle is delivered as a single multitrack `.ogg` file with stems for sub / mid / top / transient on separate channels (so the audio engineer can rebalance per platform). Per-bundle peak summed at -12 dB.

**Per-cutscene SFX bundles** (47 total — including the 12 emotes, the 24 signature abilities, etc.):

- F.1: 4 bundles (one per onboarding entry, except F.1.4 which has separate `_pre` and `_post` bundles → 5 SFX bundles)
- F.2: 4 narrative bundles + 12 emote stems (F.2.4) = 16 bundles
- F.3: 8 narrative bundles + 5 epoch sub-clip bundles + 0 thought-virus stub = 13 bundles
- F.4: 24 ability bundles (12 light + 12 dark)
- F.5: 4 tier-up + 1 decoration + 2 room-unlock = 7 bundles

**Recurring SFX timbre signatures** (re-used across cutscenes — author once, license-clear, archive in `audio/sfx/library/`):

| Signature | Source description | Used in |
|---|---|---|
| Bowed glass armonica sustain | Real glass-armonica recordings, granular-stretched | every bed (connective continuity) |
| Cathedral cathedral-organ pad | Long-tail pipe organ samples, layered with low choir | F.1.1, F.1.4, F.3.1, F.3.4 |
| Stone-grinding architectural shift | Foley granular | F.5.1 (all 4), F.5.3.a |
| Wax-press-and-settle | Foley wax-on-paper | F.2.2, F.4.7 (Politician light) |
| Defibrillator zap | Synthesized impulse | F.2.4.j (Necromancer emote), F.4.10 |
| CRT scanline stutter | 1-frame digital glitch | F.1.4.a, F.2.4.b (Watcher), F.2.4.i (GameMaster), F.3.7, F.3.8.e |
| Wind-and-cloth banner descent | Foley silk + ambience | F.1.1, F.1.4.b, F.3.1 |
| Tactical comm chirps | Synthesized pulse trio | F.2.4.f (Warlord), F.3.6 |
| Brass tuning-fork strike | Real brass struck-and-resonated | F.2.4.a (Chorus), F.4.1 |
| Modal-transition figure | 1.6s glissando-and-modal-shift | F.3.8 (all 5 epoch beds — required cross-bed continuity) |

The contractor delivers 10 reusable signature SFX stems (above) plus 47 cutscene-specific bundles. Signature stems live in `audio/sfx/library/`; per-cutscene bundles live in `audio/sfx/guild/`.

## G.3 — VO line index (consolidated)

Every `[NEW]` voice line referenced across the catalogue, grouped by speaker, delivered to the existing `pnpm vo:*` pipeline. **48 new lines** total. Manifests created when a speaker doesn't already have one.

| Manifest | Line ID | Cutscene | Line text | Notes |
|---|---|---|---|---|
| `elaraVoManifest.json` | `elara_guild_welcome_001` | F.1.1 | "You're in. The hall remembers your name now — even if it can't say it back." | warm half-smile |
| `elaraVoManifest.json` | `elara_first_words_001` | F.1.2 | "First words. The walls are listening — they always do." | hushed reverent |
| `elaraVoManifest.json` | `elara_friend_accept_001` | F.1.3 | "Two wills, one seam. The Loredex remembers." | warm ceremonial |
| `architectVoManifest.json` | `architect_sorting_pre_001` | F.1.4.a | "The Lectern is listening. So are the twelve. Step forward." | cool administrative |
| `architectVoManifest.json` | `architect_sorting_post_001` | F.1.4.b (optional) | per-house line | reserved, default disabled |
| `gamemasterVoManifest.json` | `gm_contracts_weekly_001` | F.2.1 | "Eight tasks. One week. The Architect grades on a curve — but only if you all pass." | dry schoolmasterly |
| `gamemasterVoManifest.json` | `gm_contract_complete_001` | F.2.2 | "Sealed. The Architect's quill remembers your name." | warm pride |
| `architectVoManifest.json` | `architect_house_cup_reset_001` | F.2.3 | "A new week, students. The Cup is empty. Earn it." | cool with hint of amusement |
| `chorusVoManifest.json` | `chorus_emote_001` | F.2.4.a | "Sync to me." | tooltip only |
| `watcherVoManifest.json` | `watcher_emote_001` | F.2.4.b | "Seen." | tooltip only |
| `collectorVoManifest.json` | `collector_emote_001` | F.2.4.c | "Catalogued." | tooltip only |
| `betweenVoManifest.json` (NEW manifest) | `between_emote_001` | F.2.4.d | "Elsewhere." | tooltip only |
| `memeVoManifest.json` | `meme_emote_001` | F.2.4.e | "Feel that." | tooltip only |
| `warlordVoManifest.json` | `warlord_emote_001` | F.2.4.f | "Counted." | tooltip only |
| `politicianVoManifest.json` (NEW manifest) | `politician_emote_001` | F.2.4.g | "Agreed." | tooltip only |
| `wardenVoManifest.json` (NEW manifest) | `warden_emote_001` | F.2.4.h | "Contained." | tooltip only |
| `gamemasterVoManifest.json` | `gm_emote_001` | F.2.4.i | "Rewritten." | tooltip only |
| `necromancerVoManifest.json` | `necromancer_emote_001` | F.2.4.j | "Again." | tooltip only |
| `engineerVoManifest.json` (NEW manifest) | `engineer_emote_001` | F.2.4.k | "Fixed." | tooltip only |
| `humanVoManifest.json` | `human_emote_001` | F.2.4.l | "There." | tooltip only |
| `elaraVoManifest.json` | `elara_donation_milestone_001` | F.2.5 | "The vault remembers. Your name is in it now." | warm pride |
| `warlordVoManifest.json` | `warlord_war_declared_001` | F.3.1 | "War declared. Count their angles before you count their numbers." | parade-ground crisp |
| `warlordVoManifest.json` | `warlord_first_blood_001` | F.3.2 | "First mark on the map. Hold it." | crisp with pride beat |
| `warlordVoManifest.json` | `warlord_mvp_crowned_001` | F.3.3 | "{playerName}, MVP. Your name is in the wind now." | runtime name SSML |
| `warlordVoManifest.json` | `warlord_war_victory_001` | F.3.4 | "Victory. The territory is yours. Hold what you have taken." | optional bonus clause |
| `warlordVoManifest.json` | `warlord_war_defeat_001` | F.3.5 | "We lost the field. We did not lose the fight. Stand. Again." | quieter delivery, paced |
| `warlordVoManifest.json` | `warlord_placement_lock_001` | F.3.6 | "Placement locked. Hold the line." | crisp |
| `architectVoManifest.json` | `architect_thought_virus_001` | F.3.7 | "The thought returned." | cool, no warmth |
| `architectVoManifest.json` | `architect_epoch_privacy_001` | F.3.8.a | "The Age of Privacy returns. What you do not show, no one will know. What you do show, everyone will." | administrative |
| `architectVoManifest.json` | `architect_epoch_prophecy_001` | F.3.8.b | "The Age of Prophecy returns. The wheels turn. Read the spokes." | administrative |
| `architectVoManifest.json` | `architect_epoch_insurgency_001` | F.3.8.c | "The Age of Insurgency returns. The line breaks. Choose your side." | administrative |
| `architectVoManifest.json` | `architect_epoch_revelation_001` | F.3.8.d | "The Age of Revelation returns. What was hidden is now seen. Including you." | administrative |
| `architectVoManifest.json` | `architect_epoch_fall_001` | F.3.8.e | "Fall of Reality. The Thought Virus walks. Cleared ground will not stay cleared." | administrative |
| `kanevasVoManifest.json` (NEW manifest) | `kanevas_harmonize_001` / `_dissonance_001` | F.4.1 | light + dark | Resonance |
| `aokiVoManifest.json` (NEW manifest) | `aoki_unseen_001` / `_private_001` | F.4.2 | light + dark | Umbra |
| `halverezVoManifest.json` (NEW manifest) | `halverez_soulread_001` / `_soultake_001` | F.4.3 | light + dark | Umbra |
| `orphicVoManifest.json` (NEW manifest) | `orphic_phasestep_001` / `_drift_001` | F.4.4 | light + dark | Liminal |
| `mireilleVoManifest.json` (NEW manifest) | `mireille_viral_001` / `_carry_001` | F.4.5 | light + dark | Resonance |
| `kasraVoManifest.json` (NEW manifest) | `kasra_parade_001` / `_casualties_001` | F.4.6 | light + dark | Ironflight |
| `vellisVoManifest.json` (NEW manifest) | `vellis_contract_001` / `_blood_001` | F.4.7 | light + dark | Resonance |
| `greenshawVoManifest.json` (NEW manifest) | `greenshaw_quarantine_001` / `_virus_001` | F.4.8 | light + dark | Umbra |
| `vexVoManifest.json` (NEW manifest) | `vex_rewrite_001` / `_houserules_001` | F.4.9 | light + dark | Liminal |
| `vasaraVoManifest.json` (NEW manifest) | `vasara_breath_001` / `_borrowed_001` | F.4.10 | light + dark | Ironflight |
| `ventVoManifest.json` (NEW manifest) | `vent_repair_001` / `_salvage_001` | F.4.11 | light + dark | Ironflight |
| `proctorVoManifest.json` (NEW manifest) | `proctor_sight_001` / `_eye_001` | F.4.12 | light + dark | Liminal |
| `vexVoManifest.json` | `vex_oracle_001` | F.5.3.a | "The pool sees what is. Drink carefully." | reuses Vex manifest |
| `architectVoManifest.json` | `architect_portal_001` | F.5.3.b | "Twelve voices unlock the door. The chamber is yours. Use it well." | administrative |
| `elaraVoManifest.json` | `elara_tier_2_001` / `_3_001` / `_4_001` / `_5_001` | F.5.1.a–d | per-tier lines | warm pride |

**12 NEW VO manifests required** (one per Mechronis Professor): `betweenVoManifest.json`, `politicianVoManifest.json`, `wardenVoManifest.json`, `engineerVoManifest.json`, `kanevasVoManifest.json`, `aokiVoManifest.json`, `halverezVoManifest.json`, `orphicVoManifest.json`, `mireilleVoManifest.json`, `kasraVoManifest.json`, `vellisVoManifest.json`, `greenshawVoManifest.json`, `vexVoManifest.json`, `vasaraVoManifest.json`, `ventVoManifest.json`, `proctorVoManifest.json`. Use the existing `pnpm vo:*` pattern (see `apps/scripts/<character>-lines.json` template).

## G.4 — Verification plan

End-to-end checks gating "shipped" status. Layered: per-asset checks → per-cutscene checks → per-flow integration checks → repo-wide gates.

### G.4.1 Per-asset verification

For each of the 64 mp4 sub-clips:

1. **Render integrity**: `pnpm vo:cutscenes` regenerates only missing assets; second run is a no-op (idempotent).
2. **Manifest URL liveness**: `pnpm vo:cutscenes:audit` HEAD-checks every URL in `apps/shared/guildCutsceneManifest.json`; exits non-zero on any 404.
3. **Loop seamlessness** (emotes only, F.2.4): for each emote, extract frame 0 and frame 38 from the rendered webm; assert pixel-equivalence within the green-screen plate via `apps/scripts/_emote-loop-audit.mjs`.
4. **Continuity-anchor parity** (cinematic clips F.1, F.3, F.5): for each clip with a continuity anchor (e.g., the Lectern in F.1.4, the territory map in F.3.2/F.3.4), assert that the start and end frame's anchor-region pixel coordinates match within 2 px tolerance — this is what makes Veo's image-to-video pass interpolate cleanly.
5. **Negative-prompt compliance**: spot-check rendered frames for "no rendered text" and "no logos" — automatable via OCR pass over the start/end stills (`apps/scripts/_ocr-bibleblockcheck.mjs` runs Tesseract and fails the build if any frame returns confident text).

### G.4.2 Per-cutscene verification

For each of the 28 catalogue entries:

1. **Trigger correctness**: in `pnpm dev`, perform the trigger action (join a guild, donate to cross a milestone, declare a war, cast an ability, etc.); confirm the matching cutscene fires within 1 s of the server-side mutation.
2. **Broadcast scope**: open 3 browser windows simultaneously (caster, guildmate, opposing-guild member where applicable); confirm each role sees the documented scope (fullscreen / chat card / nothing).
3. **Mirrored composition** (F.3.1, F.3.2 specifically): confirm opposing-guild viewers see the horizontal-flipped composition correctly.
4. **Per-guild color filter correctness**: cycle through all 12 guilds via dev-mode override; for each, assert the runtime CSS color filter produces the expected guild-hex visually (use a screenshot diff against pre-rendered swatches in `apps/scripts/_guild-hex-swatches/`).
5. **Audio sync**: confirm SFX peaks land within ±50 ms of their documented frame markers; confirm VO line completion lands within the documented timing window.
6. **Reduced-motion fallback**: enable OS "reduce motion"; confirm the cutscene renders as static poster + caption + SFX bundle (no video), AND the SFX bundle is sufficient to convey the moment alone (subjective playtest review).
7. **Autoplay-blocked fallback**: in a browser with `Autoplay: User-only`, confirm the cutscene autoplays muted with captions visible, and sound resumes on the first user click.

### G.4.3 Per-flow integration verification

End-to-end flows that span multiple cutscenes:

- **Onboarding flow**: brand-new player joins guild → first message → friends with another member → reaches skill 60 → triggers Sorting Ceremony arrival pre + assigned-Archon line + post. Confirm 6 cutscenes fire in order, all VO is correctly gated to skill levels, and the final post-clip's House variant matches the assigned House.
- **Daily/weekly cycle**: simulate a Monday 00:00 UTC roll → confirm `cs_house_cup_weekly_reset` queues; have player donate to cross 1k tier → confirm milestone fires; complete a contract → confirm `cs_contract_complete` fires with correct guild's wax seal.
- **War cycle**: declare war → contribute first → contribute more → resolve victory for one side, defeat for the other; confirm the 5-cutscene sequence fires correctly per side, including the **per-user delivery** (offline player's defeat cutscene plays on their next login, not real-time).
- **Signature ability flow**: skill 75+ player casts an ability → confirm the Common Room cutscene fires fullscreen, the 2 s preview thumbnail broadcasts to guild WS, the cooldown is enforced, and the dark variant fires correctly when the dark choice is made.
- **Hall progression flow**: guild treasury → leader pays for tier 2 → confirm `cs_hall_tier_up_outpost_to_barracks` fires queued for all members; place 5 decorations → confirm 5 small `cs_decoration_place` animations fire in the Hall view; reach tier 4 → confirm Oracle Pool unlock fires.
- **Epoch transition flow**: simulate weekly epoch rotation across all 5 epochs in sequence (use ISO-week dev override); confirm each `cs_epoch_change_*` plays with the correct outgoing-and-incoming sky pair, and the architect VO line matches.

### G.4.4 Repo-wide gates

Before merge:

1. `pnpm check && pnpm lint && pnpm test` — full type-check, lint, vitest pass.
2. `pnpm vo:cutscenes` — generates any missing cutscene videos, idempotent on re-run.
3. `pnpm vo:cutscenes:audit` — HEAD-checks every manifest URL, exits non-zero on any 404.
4. `pnpm vo:audit` — confirms all 48 [NEW] VO lines have been recorded into their manifests (zero missing).
5. `pnpm db:smoke` — confirms schema additions for cutscene-event tracking work end-to-end.
6. `pnpm test:e2e` — Playwright suite includes a new `apps/e2e/cutscene-flows.spec.ts` covering the 6 integration flows above.
7. Manual playback test on iOS Safari + Android Chrome + desktop Firefox + desktop Chromium with autoplay policies set per platform default — confirms WebM alpha, mp4 fallback, and reduced-motion respect work across the matrix.

### G.4.5 Subjective playtest review

A single 90-minute playtest session per release candidate:

- Two playtesters in a shared guild trigger every cutscene category at least once.
- Reviewer confirms: (a) cutscenes feel like one connected world (the bowed-glass-armonica continuity carries), (b) emote stickers are recognizable at 64×64 chat size without sound, (c) the 12 Archon emotes are distinguishable from each other at a glance, (d) the war cycle feels weighted (declared → first blood → resolution), (e) reduced-motion players still enjoy the moments.
- Final blocker: any cutscene that requires the playtester to ask "what just happened?" gets re-authored.

---

## H. Where this document lives in the repo

When this plan is exited and implementation begins, this Production Bible should be ported into the repo at:

```
docs/production/GUILD_CUTSCENE_BIBLE.md
```

…alongside the active `docs/ART_DEPARTMENT_PRODUCTION.md` (which folded in the formerly-separate `SHIP_READY_ASSET_BIBLE.md`, archived 2026-05-08) and `docs/production/ASSET_URLS.md`. The bible is the source of truth for the Veo 3.1 + Nano Banana 2 generation pipeline (`apps/scripts/guild-cutscenes-veo.ts`) and the contractor-facing handoff document for sound design and VO recording. Any change to a cutscene's prompt, frame, audio, or VO **must** be reflected here first; the production pipeline is a downstream consumer.

The matching shared registry is `apps/shared/guildCutscenes.ts` (the typed manifest of cutscene-id → metadata) and the rendered manifest is `apps/shared/guildCutsceneManifest.json` (URLs + posters + VO references, generated by the pipeline and committed alongside the videos on the dgrsart CDN).

---

## Critical Files

**Edit:**
- `apps/server/_core/index.ts` — add guild WS channel + cutscene broadcast event
- `apps/server/routers/guild.ts` — publish chat to WS, reactions, mentions, fire cutscenes
- `apps/server/routers/guildHall.ts` — wire decoration placement, tier-up cutscene fires
- `apps/server/routers/guildWars.ts` — signature-ability buff hook, victory cutscene fire
- `apps/client/src/pages/GuildPage.tsx` — Comms WS, Contracts tab, presence, emblem chips
- `apps/client/src/pages/GuildCommonRoomPage.tsx` — signature ability cast → cutscene
- `apps/client/src/pages/HouseCupPage.tsx` — DB-backed standings, weekly-reset cutscene
- `apps/client/src/components/SortingCeremony.tsx` — slot in pre/post Veo intro and outro
- `apps/db/schema.ts` — `friendships`, `directMessages`, `houseCupStandings`,
  `reactions` column on `guildChat`, `decorationPlacements` + `emblemConfig` JSON on
  `guilds`, `cutsceneEvents` (id, guildId, cutsceneId, actorUserId, contextJson, createdAt)
- `package.json` — add `vo:cutscenes`, `vo:cutscenes:audit`, `assets:upload:cutscenes`
- `docs/ART_DEPARTMENT_PRODUCTION.md` §3 — replace PLACEHOLDER-14 entries
  (carried over from the archived `SHIP_READY_ASSET_BIBLE.md`) with the 12
  new common-room paintings and the 28 cutscene catalogue rows

**Create:**
- `apps/server/routers/guildContracts.ts` — weekly contract progress + claim
- `apps/server/routers/friends.ts`, `apps/server/routers/dm.ts`
- `apps/server/routers/guildPresence.ts` — heartbeat
- `apps/server/routers/guildCutscenes.ts` — `getEventForGuild`, `acknowledge`, `record`
- `apps/shared/guildContracts.ts` — 8-contract weekly rotation
- `apps/shared/guildCutscenes.ts` — 28-entry cutscene catalogue (id, prompt,
  voManifestKey, duration, trigger, broadcastScope)
- `apps/shared/guildCutsceneManifest.json` — generated url/poster/duration manifest
- `apps/shared/expansionArt/guildArt.ts` — 24 hero emblem illustration manifest
- `apps/scripts/guild-cutscenes-veo.ts` — Veo 3.1 generation pipeline (idempotent)
- `apps/scripts/guild-emblems-compose.ts` — preview-renders for the 32-piece kit
- `scripts/_cutscene-audit.mjs` — HEAD-check every manifest URL
- `apps/client/src/components/GuildEmblem.tsx` — composable runtime emblem
- `apps/client/src/components/CutscenePlayer.tsx` — fullscreen + inline-card player
- `apps/client/src/components/FriendsDrawer.tsx` — global friends UI
- `apps/client/src/hooks/useGuildSocket.ts` — WS subscription hook
- `apps/client/src/hooks/useCutscene.ts` — id → manifest → playback orchestrator

## Reused Functions and Utilities

- WS bootstrap pattern: PvP and chess sockets in `apps/server/_core/index.ts`
- ISO-week deterministic scheduling: `getActiveWarSeason()` in
  `apps/shared/allianceWar.ts`
- War-point trait multipliers: `warPointMultiplier`, `captureSpeedMultiplier`,
  `sabotageMultiplier` already resolved in `guildWars.contribute`
- Cinematic component for shared moments: `SortingCeremony.tsx` (already wired to
  voice + particles) — extend rather than replace
- Notifications fallback: `notifications` table, used by guild invites today
- Civil skill XP grant: existing donation path in `guild.donate`
- Archon→skill→guild mapping: `apps/client/src/game/archonTrainingVoices.ts`
- Asset CDN helper: `assetUrl(...)` from `@/lib/assetUrl` — same pattern works for
  `videos/guild/*.mp4` and `art/guild-emblems/*` paths
- VO pipeline: existing `vo:run-all` generators and `apps/shared/<character>VoManifest.json`
  (Veo cutscene generator follows the same idempotent skip-existing pattern)
- Asset upload: `pnpm assets:upload:dry` and `pnpm assets:upload`
  (`apps/scripts/upload-public-to-s3.ts` — extend to cover `public/videos/guild/`)
- Coverage probe pattern: `scripts/_check-art-coverage.mjs` (Cutscene audit clones
  this shape: HEAD every manifest URL on dgrsart)
- Expansion art manifest pattern: `apps/shared/expansionArt/` (typed, slug-based)
- Reduced-motion + autoplay-blocked fallbacks: existing pattern used by
  cinematic components in the client (check `SortingCeremony.tsx` for the
  prefers-reduced-motion guard before authoring the new one)

## Verification

End-to-end checks per phase:

- **Phase 1**: `pnpm dev`, log in two browsers as different users in the same
  guild, confirm chat messages and presence dots flip in real time.
  `pnpm vitest apps/server/routers/guild.test.ts`.
- **Phase 2**: react to a message → other browser sees count update without
  refresh. Trigger Sorting Ceremony in dev → guild card posts.
- **Phase 3**: progress a contract via a card-battle win, confirm progress bar
  ticks in both clients. `pnpm vitest apps/shared/guildContracts.test.ts`.
- **Phase 4**: send a friend request across browsers, accept, exchange a DM.
  Verify `@mention` triggers a notification only for the mentioned user.
- **Phase 5**: cast a signature ability, confirm guild war contribution earns the
  +5% multiplier in `guildWars.contribute` for the duration. House Cup standings
  survive a hard refresh and show in both browsers.
- **Phase 6**:
  - Render every emblem-kit permutation in a Storybook-style preview page; eyeball
    for color clashes and frame/charge collisions.
  - Confirm the 12 common-room paintings load on `/guild/common-room` with no layout
    shift; check the PLACEHOLDER-14 entries (carried over from the archived
    `docs/archive/2026-05-08-superseded/SHIP_READY_ASSET_BIBLE.md`) are gone in
    `docs/ART_DEPARTMENT_PRODUCTION.md` §3.
  - Place each of the 30+ decoration sprites in the Guild Hall and verify zoom + DPR
    scaling looks crisp on retina.
- **Phase 7**:
  - `pnpm vo:cutscenes` regenerates only missing entries (idempotent — second run is
    a no-op).
  - `pnpm vo:cutscenes:audit` HEADs every URL in `guildCutsceneManifest.json` and
    exits non-zero on any 404.
  - `pnpm dev` with two browsers logged into the same guild: cast a signature
    ability in one → both clients render the inline cutscene card; expand
    fullscreen plays the Veo clip with synced VO line.
  - Trigger a war victory in dev via the admin endpoint → `cs_war_victory` plays
    for every connected guildmate.
  - Toggle the OS "reduce motion" setting and re-run; cutscene falls back to
    poster + caption.
  - Disable autoplay-with-sound in the browser; cutscene autoplays muted with
    captions, sound resumes on user click.

Full repo: `pnpm check && pnpm lint && pnpm test`. Spot-check `pnpm db:smoke`
after schema additions. Manual UI test in a real browser per CLAUDE.md guidance —
explicitly call out cutscene playback in the smoke test (multiple browsers, real
network, mobile + desktop viewports).
