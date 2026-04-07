# Voice Acting Pipeline

Design document for implementing voiced dialog across Dischordian Saga, from AI-generated placeholder VO through full human voice acting.

---

## Table of Contents

1. [Phase 1: AI-Generated VO (Immediate)](#phase-1-ai-generated-vo-immediate)
2. [Phase 2: Selective Human VO (Future)](#phase-2-selective-human-vo-future)
3. [Phase 3: Full VO (Long-term)](#phase-3-full-vo-long-term)
4. [Audio Pipeline](#audio-pipeline)
5. [Integration Points](#integration-points)
6. [Fallback & Accessibility](#fallback--accessibility)

---

## Phase 1: AI-Generated VO (Immediate)

Use ElevenLabs TTS to generate voice lines for high-impact, short-form dialog. This covers the moments where voice adds the most atmosphere per line of effort.

### Scope

| Category              | Lines per Character | Notes                                                    |
| --------------------- | ------------------- | -------------------------------------------------------- |
| Companion greetings   | 3-5                 | First meeting, returning after absence, room-specific    |
| Combat barks          | 5-10 per fighter    | Attack, hit react, critical, low HP, KO, victory, taunt |
| Transmission intros   | 1 per transmission  | Short identity callsign before message body              |

### Voice Profiles

Each profile maps to an ElevenLabs voice configuration (voice ID, stability, similarity boost, style).

#### Elara
- **Tone:** Warm, composed, quietly authoritative
- **Accent:** British Received Pronunciation
- **Pacing:** Measured, deliberate pauses before key words
- **ElevenLabs settings:** Stability 0.65, Similarity Boost 0.80, Style 0.40
- **Example bark:** *"Shields failing -- hold the line."*

#### The Human
- **Tone:** Gravelly, world-weary, noir detective cadence
- **Accent:** Mid-Atlantic American
- **Pacing:** Slow drawl punctuated by clipped observations
- **ElevenLabs settings:** Stability 0.50, Similarity Boost 0.75, Style 0.55
- **Example bark:** *"Seen worse. Hit harder."*

#### The Meme
- **Tone:** Energetic, irreverent, radio DJ showmanship
- **Accent:** Neutral American with exaggerated inflection
- **Pacing:** Fast, punchy, occasional static/signal distortion overlay
- **ElevenLabs settings:** Stability 0.35, Similarity Boost 0.70, Style 0.80
- **Post-processing:** Add light static/signal artifacts via ffmpeg
- **Example bark:** *"Aaand THAT's a critical hit, folks!"*

#### Agent Zero
- **Tone:** Clipped, precise, emotionally flat
- **Accent:** Military/operational, no regional markers
- **Pacing:** Rapid staccato bursts, NATO-phonetic influence
- **ElevenLabs settings:** Stability 0.85, Similarity Boost 0.85, Style 0.15
- **Example bark:** *"Target neutralized. Next."*

#### Antiquarian
- **Tone:** Old, scholarly, gently amused
- **Accent:** Soft European, indeterminate origin
- **Pacing:** Unhurried, contemplative, trails off mid-thought
- **ElevenLabs settings:** Stability 0.70, Similarity Boost 0.80, Style 0.30
- **Example bark:** *"Ah, I believe I've read about this... somewhere."*

### Voice Line File Convention

```
assets/vo/{character}/{category}/{line_id}.mp3

# Examples
assets/vo/elara/greetings/greeting_first_meet.mp3
assets/vo/the_human/combat/bark_attack_01.mp3
assets/vo/the_meme/transmissions/intro_signal.mp3
```

### Generation Workflow

1. Write line in a voice line manifest (`vo-manifest.json`)
2. Call ElevenLabs API with character voice config
3. Run through audio pipeline (see [Audio Pipeline](#audio-pipeline))
4. Commit normalized file to `assets/vo/`
5. Register line ID in the voice line registry

---

## Phase 2: Selective Human VO (Future)

Replace AI-generated lines at key story beats with professional human voice acting. AI lines remain as placeholders until human recordings are approved.

### Target Content

- Major story reveals and turning points
- Companion loyalty arc climaxes
- Final boss encounter dialog
- Opening and ending cinematics
- Any line where emotional nuance exceeds AI capability

### Audition Requirements

- Actors must match the established voice profile (tone, accent, pacing)
- Audition must include: 1 greeting, 2 combat barks, 1 story line (provided)
- Submissions accepted as uncompressed WAV only

### Recording Specifications

| Parameter       | Value            |
| --------------- | ---------------- |
| Sample rate     | 44.1 kHz         |
| Bit depth       | 16-bit           |
| Channels        | Mono             |
| Format          | WAV (recording)  |
| Delivery format | WAV, converted to MP3 in pipeline |
| Room tone       | 2 seconds of silence at start of each session |
| Noise floor     | Below -60 dB     |
| Peak level      | -3 dB max        |

### Replacement Process

1. Human recording passes QA review
2. Run through the same audio pipeline as AI lines
3. Replace the AI file at the same path (`assets/vo/{character}/...`)
4. No code changes required -- the voice line registry is path-based

---

## Phase 3: Full VO (Long-term)

Voice every line of dialog in the game.

### Scope

- All companion dialog (conversations, reactive comments, idle chatter)
- All transmission content (full body text, not just intros)
- NPC ambient lines (background chatter, merchant calls, environmental storytelling)
- UI narration for key menus (optional, accessibility-driven)

### Estimation

| Category            | Estimated Lines | Notes                          |
| ------------------- | --------------- | ------------------------------ |
| Companion dialog    | 500-800         | Per companion, across all arcs |
| Transmissions       | 200-400         | All decoded transmissions      |
| NPC ambient         | 100-200         | Shared pool, per-area          |
| Combat (expanded)   | 15-25 per fighter | Situation-specific variants  |

### Production Notes

- Batch recording sessions by character to maintain consistency
- Maintain a living script document synced with game content
- All new dialog written after Phase 3 begins must include VO direction notes

---

## Audio Pipeline

```
ElevenLabs API (or human WAV)
        │
        ▼
  ┌─────────────┐
  │  Raw audio   │   .wav / .mp3 from source
  └──────┬──────┘
         │
         ▼
  ┌─────────────────────────────────┐
  │  ffmpeg normalize               │
  │  - Target loudness: -16 LUFS   │
  │  - True peak: -1.5 dBTP        │
  │  - EBU R128 standard           │
  └──────┬──────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────┐
  │  ffmpeg compress                │
  │  - MP3 CBR 128kbps (mono)      │
  │  - Strip metadata               │
  │  - Apply character post-FX      │
  │    (e.g., static for The Meme)  │
  └──────┬──────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────┐
  │  CDN upload                     │
  │  - Cache-Control: immutable     │
  │  - Content hashed filenames     │
  │  - Gzip/Brotli transfer        │
  └──────┬──────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────┐
  │  Client lazy load               │
  │  - Preload on room enter        │
  │  - Play on trigger              │
  │  - Evict from cache on exit     │
  └─────────────────────────────────┘
```

### ffmpeg Reference Commands

```bash
# Normalize loudness (EBU R128, two-pass)
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | \
  # parse measured values, then:
ffmpeg -i input.wav \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=<val>:measured_TP=<val>:measured_LRA=<val>:measured_thresh=<val>" \
  normalized.wav

# Compress to MP3, mono, strip metadata
ffmpeg -i normalized.wav -ac 1 -b:a 128k -map_metadata -1 output.mp3

# Add static overlay (The Meme only)
ffmpeg -i normalized.wav -filter_complex \
  "anoisesrc=d=0:c=pink:r=44100:a=0.015[noise];[0][noise]amix=inputs=2:duration=first:weights=1 0.08" \
  the_meme_output.wav
```

---

## Integration Points

### Existing: `server/_core/voiceTranscription.ts`

The current module handles speech-to-text (Whisper API via Forge). The voice acting pipeline is the reverse direction (text-to-speech). A new companion module should be created:

```
server/_core/voiceSynthesis.ts     # ElevenLabs TTS wrapper
```

This module will:
- Accept a line ID, character profile, and text
- Call ElevenLabs API with per-character voice settings
- Return the raw audio buffer for pipeline processing
- Share the same `ENV` configuration pattern as `voiceTranscription.ts`

### Existing: `client/src/contexts/SoundContext.tsx`

The `ProceduralSoundEngine` in `SoundContext.tsx` manages Web Audio API state, master gain, and mute/volume controls. Voice lines should route through the same audio graph:

- VO plays through a dedicated `voiceGain` node connected to `masterGain`
- Respects existing `muted` and `volume` state
- VO volume has an independent multiplier (default 1.0) exposed in settings
- When VO plays, ambient layers duck by ~40% (sidechain-style)

### New: `VoiceLinePlayer` Component

```tsx
// client/src/components/VoiceLinePlayer.tsx

interface VoiceLinePlayerProps {
  lineId: string;           // e.g., "elara/combat/bark_attack_01"
  trigger: "auto" | "click"; // auto-play on mount or wait for interaction
  onComplete?: () => void;  // callback when line finishes
  className?: string;
}
```

Responsibilities:
- Resolve `lineId` to CDN URL via voice line registry
- Lazy load the audio file (fetch + decode)
- Play through `SoundContext` voice gain node
- Show subtitle text while playing (pulled from `vo-manifest.json`)
- Handle errors silently -- missing VO never blocks gameplay

### Voice Line Registry

```jsonc
// assets/vo/vo-manifest.json
{
  "version": 1,
  "lines": {
    "elara/greetings/greeting_first_meet": {
      "text": "Welcome aboard. I wish the circumstances were better.",
      "duration": 3.2,
      "character": "elara",
      "category": "greeting",
      "phase": 1
    },
    "the_human/combat/bark_attack_01": {
      "text": "Seen worse. Hit harder.",
      "duration": 1.8,
      "character": "the_human",
      "category": "combat",
      "phase": 1
    }
  }
}
```

---

## Fallback & Accessibility

### Core Principle

**Every voiced line must have a complete text equivalent.** Voice acting is an enhancement layer, never a requirement.

### Implementation

1. **Text always present:** The `vo-manifest.json` contains the full text for every line. Dialog systems render text regardless of VO state.
2. **VO toggle in settings:** Players can disable voice acting entirely via a settings toggle. When disabled, no audio files are fetched.
3. **Subtitle display:** When VO is enabled, subtitles display in sync. Subtitle timing derived from `duration` in the manifest.
4. **Graceful degradation:**
   - CDN unavailable: text displays normally, no error shown to player
   - Audio decode failure: text displays normally, error logged to console
   - Slow connection: text appears immediately, audio plays when ready (no blocking)
5. **Settings UI:**
   - `Voice Acting: ON / OFF` (master toggle)
   - `VO Volume: 0-100%` (independent of master/SFX volume)
   - `Subtitles: Always / With VO / Off`

### Screen Reader Compatibility

- VO lines are not `aria-live` -- they duplicate visible text
- Subtitle container uses `role="status"` for screen reader announcement
- VO toggle and volume controls are fully keyboard-accessible
