# Log 5 — Production Workflow

The Engineer's final Vortex recording. ~6m40s continuous take. Plays during
Beat J (Archives + Two Witnesses Meet Part 1) as the emotional climax of
the entire Prelude.

Canonical source specs: `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md`
§5.6.1 through §5.6.11.

---

## Files in this directory

| File | Purpose |
|---|---|
| `holo_log_5_full.txt` | The paste-ready transcript with SSML break tags, movement headers, and register direction. Paste into an ElevenLabs **Studio Project** — one paragraph per section. |
| `README.md` | This doc. |

---

## Why this can't use the CSV + TTS batch flow

The rest of the Prelude's VO goes through `apps/scripts/generate-prelude-vo.ts`
which reads CSV files and hits the ElevenLabs TTS API. Log 5 **cannot** go
through that pipeline:

1. The transcript is ~2,500 words — the CSV "text" column cannot hold it.
2. SSML breaks would not survive CSV escaping at this scale.
3. The Prince's emotional arc across 5 movements needs per-paragraph
   regeneration control, which CSV batch mode does not expose.
4. The final audio needs 6 layers of post-production (scrubber hum,
   Protocols click, deliberate dropouts, voice harmonic, hard cut) that
   the batch script does not apply.

**Use ElevenLabs Studio Projects** instead — the web UI at
[elevenlabs.io/app/studio](https://elevenlabs.io/app/studio).

---

## Step 1 — Set up the Studio Project

1. Sign in to ElevenLabs (same account as the batch script's `ELEVENLABS_API_KEY`).
2. Go to **Studio → Create new project**.
3. Title: `holo_final_vortex_log` (the canonical CANON_REV_7 id)
4. Voice profile: **the_prince** (Voice ID `FLW8imgp50K85LICuLQs`)
5. Voice settings (project-level, applies to all paragraphs):
   - Stability: **0.50**
   - Similarity boost: **0.85**
   - Style: **0.35**
   - Speaker boost: **ON**
6. Model: `eleven_multilingual_v2`
7. Paste `holo_log_5_full.txt` into the project document. Keep the
   movement-header bars in as editorial scaffolding — Studio Projects
   won't speak them because they don't look like sentences, but if you
   want to be safe, delete them before generation.

Split the document into ~15-20 paragraphs at the `<break time=...>` boundaries
so each paragraph regenerates independently.

---

## Step 2 — Generate

Target **8–12 regeneration passes** on the tender sections until the
register lands. Per §5.6.11:

| Section | Recommended passes |
|---|---|
| Movement 2 "You are going to remember things…" (Elara tenderness) | 8+ |
| Movement 3 sandwich recipe callback | 8+ |
| Movement 4 "you were the right call" (to Kael about Vex) | 8+ |
| Movement 5 "Enigma." (first utterance) + following line | **10+** |
| Movement 5 manifesto block (Don't kneel / Love is the key / Hope is rebellion) | 5+ each |
| Movement 5 "I loved you. I am allowed to say it now." | 8+ |
| Movement 5 final 3 lines (I am the Prince / bench hums / Back to the —) | 5+ |
| Everything else (Protocols walkthrough, etc.) | 2-3 sufficient |

The first "Enigma." is the fulcrum of the entire log. Take the pause
before and after. Do not settle for a take that doesn't land it.

---

## Step 3 — Export

- Format: **WAV, 48 kHz, 24-bit** (not MP3)
- This becomes the **master**. MP3 encoding happens later at the
  distribution step.

---

## Step 4 — Voice-actor direction summary (§5.6.10)

The log moves through **4 emotional registers in sequence**. The actor
(or the generation passes) must hit each register without telegraphing
the next:

### 1. PROFESSIONAL (Movement 1 + opening of Movement 5)
At a bench. Doing a job. Precise because he is precise, not because
he is scared. Any tremor at this stage is a mistake. Believe he could
maintain this register indefinitely if the air lasted.

### 2. PRIVATE (Movements 2, 3, 4 — the three farewells)
Writing letters to people he cannot see again. Register softens but
does not break. Warmth enters. Voice drops slightly in volume.
Dry humor is welcome (the sandwich line; "I forgive you for whatever I
did"). **Do not play it sad. Play it loving.**

### 3. CONFESSIONAL (Movement 5, from "Enigma." onward)
The register the Prince has avoided for forty years. Volume drops.
Voice gets closer to the mic. Quality of a man who has opened a door
he has kept locked his entire life. The word **"Enigma"** itself —
the first time he says it — lands with the full weight of a
forty-year withheld confession. **Take the pause after the name.**

### 4. MANIFESTO (Movement 5, "Don't kneel…" through "Make a song out of this.")
Register rises — not into performance but into **instruction**. The
Prince is giving the Enigma something to carry. Voice gains authority
**without volume**. Every line is going to become a lyric in her song;
deliver each line with enough shape that the listener hears the song
inside it before the song begins.

### Things the actor must NOT do
- Do not weep. The devastation is in the precision.
- Do not add trailing warmth to the closing.
- Do not pause longer than indicated. Air is running out.
- Do not raise volume on manifesto lines.
- Do not deliver the Oracle content as religious awe — it's an
  engineer's awe, the awe of watching a tool do something his
  blueprint said it could not do.

---

## Step 5 — Post-production layering (§5.6.11)

Apply in this order on top of the ElevenLabs export:

### Layer 1 — Base vocal
The Studio Projects WAV export. 48 kHz 24-bit.

### Layer 2 — Atmospheric scrubber hum @ −24 dB
Reuse the Log 4 scrubber-hum asset. Canonically the **same room, same
failing scrubber, three weeks later**. The player who heard Log 4
recognizes the hum instantly.

Runs continuously under the entire recording. Does not fade in/out —
it's an environmental constant.

### Layer 3 — Resurrection Protocols device click @ −32 dB, 0.5 Hz
Continuous rhythmic click through the **first ~6 minutes** of the log.
Tapers to silence in the final 40 seconds as the Prince notes *"the
clicks are slowing."* When the clicks stop, the device has armed and
the Engineer is out of time.

Do not change tempo. The click's constancy is the point.

### Layer 4 — Hologram-tape recording-artifact dropouts
Subtle dropout on approximately every fifth word (small capacitor
whine rising/falling with the scrubber hum). **Plus 4 deliberate
full 0.3-second dropouts** at these narrative beats (§5.6.10):

| Placement | Line fragment just before dropout |
|---|---|
| Movement 2 mid | "…both of those things can be true in the same skull" |
| Movement 4 mid | "…Only one of us is going to make it out." |
| Movement 5 Enigma confession | "…I never said it well enough for it to matter" |
| Movement 5 closing | "…That is enough. That was always enough." |

Each dropout should feel like a small stumble the listener almost
doesn't notice the first time but cannot un-hear on a second listen.

### Layer 5 — Voice-harmonic ghost on one line
When the Prince says *"he sounds like a song that hasn't been written
yet"* (Movement 5, in the Oracle passage), **apply a subtle female-voice
harmonic ghost underneath his delivery at −32 dB**, pitch-shifted to
match the future Enigma voice profile. It is a deliberate haunting —
the hologram briefly catches her voice instead of his.

### Layer 6 — Hard cut at the end
Sample-accurate cut at "Back to the —". No fade. No trailing silence.
No mastering tail. The atmospheric scrubber hum AND the Protocols
click both **stop with the cut**, not before.

The cut is the single most important audio event in the entire
Prelude. Cut precision > any other consideration.

---

## Step 6 — Mastering targets

| Target | Value |
|---|---|
| Integrated loudness | **−14 LUFS** |
| True peak | **−1.0 dBTP** |
| Sample rate (master) | 48 kHz |
| Bit depth (master) | 24-bit |

The scrubber hum will push the noise floor slightly; this is
intentional and **must not be gated out**. The noise is canon.

---

## Step 7 — Output paths

After mastering, export TWO files:

### Distribution (MP3 — ships in the client)
```
apps/client/public/audio/prince/holo_log_5_full.mp3
```
- MP3, CBR 192 kbps, 48 kHz
- This path is the one `apps/shared/preludeSequence.ts` expects for
  Beat J. **Do not rename.** The canonical CANON_REV_7 id is
  `holo_final_vortex_log`, but the preludeSequence manifest path
  uses `holo_log_5_full.mp3` as the Prelude filename and that wins.

### Master archive (WAV — for re-exports only)
```
assets/intermediate/prelude/audio/holo_log_5_full_master.wav
```
- 48 kHz 24-bit
- Kept out of the client bundle — re-export from here if the MP3
  ever needs a different encoding or a remaster.

---

## Step 8 — Update the manifest

Once the MP3 is in place, add an entry to
`apps/shared/princeVoManifest.json`:

```json
{
  "prince_beat_e_diploma": "…existing URL…",
  "prince_beat_e_toy_soldier": "…existing URL…",
  "holo_log_5_full": "https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/prince/holo_log_5_full.mp3"
}
```

(assuming you also upload to S3 at the same path convention the batch
script uses; if you ship it via a different CDN, update the URL
accordingly).

Also drop the `STALE_REF_ALLOWLIST` entries for `antiq_fc_1` and any
remaining Log-5-related placeholders in
`apps/server/preludeBibleAudit.test.ts` once those lines are on disk
and in the manifests.

---

## Readiness dashboard impact

Once Log 5 is generated, uploaded, and manifest-linked:

- **VO (new)**: 10/10 → with Log 5, all 10 recorded VO lines are in place
- **Beat J music** (Last Words): already 1/1 present
- **`cutscene_archives_two_witnesses_part1_complete` flag**: can actually
  fire after a real Beat J playthrough instead of being spec'd but
  content-gated

At that point the Prelude is fully shippable as a standalone
experience, modulo the P0 follow-ups (Beat C/D/E interactions,
Beat F biometric lockbox composition).
