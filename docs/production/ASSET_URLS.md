# Generated Asset URLs

## Elara Portraits
- Portrait (dark): https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_dark-3LuC6hKvNnsrFfy39deYjm.webp
- Portrait (speaking): https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp

## Room Scenes
- Cryo Bay: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp
- Bridge: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_bridge-g5ANMfUqgxd8ZnPgh9h6nd.webp
- Archives: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_archives-ZHkbF8dmAL5SyqykdLgy3n.webp
- Comms Array: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_comms_array-MeKGcBZGammMEjbx8aN8fb.webp
- Observation Deck: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_observation_deck-DbxXnUWAHiiLro4YP8rDUg.webp
- Engineering: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_engineering-7B58pQup6v64GgmmT7stby.webp
- Armory: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_armory-cVMQ78mPE6bJeREyXAxC6a.webp
- Cargo Hold: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cargo_hold-U6wJuiqP3pgzQHUKscNpi6.webp
- Medical Bay: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_medical_bay-gLunh6wxp8sNASjZDo5FpV.webp
- Captain's Quarters: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_captains_quarters-BWMWKmvU7KomMEe2RxdxTV.webp

## Cryo Bay / Medical Bay — Murder-Mystery State Renders (Section F)

State-aware room backdrops that swap at runtime as the player logs clues.
Resolver: `apps/client/src/game/roomStateAssets.ts` → `resolveRoomStateAsset(roomId, narrativeFlags)`.
Drop source: `AAA Final/dischordian_room_state_art.zip` (2026-04-21). Served
locally via Vite's static assets at `/art/rooms/mystery-states/`; originals
live in `apps/client/public/art/rooms/mystery-states/`. Transcoded from
1920×1080 PNG → WebP @q82 to match the repo's existing asset convention
(~350 KB each, ~2.9 MB total).

### Cryo Bay (4 states)
- Initial (pristine wake, dark pod unnoticed): `/art/rooms/mystery-states/cryo-bay_initial.webp`
- Investigating (evidence cluster at the dark pod): `/art/rooms/mystery-states/cryo-bay_investigating.webp`
- Victim Identified (door mid-cycle to amber): `/art/rooms/mystery-states/cryo-bay_victim-identified.webp`
- Case Open Later (revisit with phosphor tape + brass patch): `/art/rooms/mystery-states/cryo-bay_case-open-later.webp`

### Medical Bay (4 states)
- Initial (maint. panel ajar, device sliver visible): `/art/rooms/mystery-states/medical-bay_initial.webp`
- Device Awakened (needle-arm extended, offer live): `/art/rooms/mystery-states/medical-bay_device-awakened.webp`
- Donated (receipt plate + rolled reward silhouette): `/art/rooms/mystery-states/medical-bay_donated.webp`
- Refused (panel closed but unlatched, no glow): `/art/rooms/mystery-states/medical-bay_refused.webp`

## Card Art
- Soldier: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_soldier-5DTnHpCwXMSjQwSSLL3Y69.webp
- Oracle: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_oracle-g4rDcyk322zSKbKGvF8dF6.webp
- Engineer: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_engineer-87sWBmYL7gTbn268o6MDC9.webp
- Assassin: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_assassin-KiyFK4iYWiFfBiKtgJcCVa.webp
- Spy: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_spy-4XKj4uc84NHCSshGpoDKqE.webp

## Sprite Sheets (12 characters, 4x2 grid: idle, walk, light, heavy, block, hit, crouch, special)

| Character | CDN URL |
|-----------|---------|
| architect | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/architect_spritesheet-cUbdFYrNmAJggCQWBB2aaX.webp |
| collector | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/collector_spritesheet-nmDY6uThYNZRUsZ3ucFSRS.webp |
| enigma | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/enigma_spritesheet-QvpeQ3pkgQxotULWbsexzM.webp |
| warlord | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/warlord_spritesheet-Rn8XDZdk9qW4zzEg3VuroZ.webp |
| necromancer | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/necromancer_spritesheet-2s7GsFKkNJEHZxztk4AXbq.webp |
| iron-lion | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/iron-lion_spritesheet-eN9jaJRKdSML9gQTxwBZEM.webp |
| oracle | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/oracle_spritesheet-oTeoDSPhLMRVy4a2XrUX94.webp |
| agent-zero | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/agent-zero_spritesheet-RZUqHFz5LP59H8Q68sFo4h.webp |
| meme | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/meme_spritesheet-7bVrsYxzdg2r6pnWABRnEj.webp |
| source | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/source_spritesheet-VXZZJzh3TSkHpj2GNqDAKu.webp |
| akai-shi | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/akai-shi_spritesheet-5weLr4FcHmRqjSd5W53Wyf.webp |
| human | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/human_spritesheet-A5aeHoy98gKJYAERvfnL6W.webp |

## Arena Backgrounds (8 stages)

| Arena | CDN URL |
|-------|---------|
| new-babylon | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/new-babylon_bg-L5pBrrUTe6CFpHgUCnzGZc.webp |
| panopticon | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/panopticon_bg-gApTAVKfeK2mH2t2EjSnXa.webp |
| thaloria | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/thaloria_bg-M7SWZHAJwr8fcXgRRMMax4.webp |
| terminus | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/terminus_bg-DX47zzMZ5k3JdifSRVmKhR.webp |
| mechronis | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/mechronis_bg-CYQGpJMy45LhszadcxaySY.webp |
| necropolis | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/necropolis_bg-FGT6JpTpUEJS36iuVerv7R.webp |
| digital-void | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/digital-void_bg-MXXbEFzrcPU2f6iCeSDG2N.webp |
| resistance-base | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/resistance-base_bg-FfKoe3Z7EovPpm24P7DcoX.webp |

---

## TODO_PRODUCTION — Dischordian Saga Episode Videos

The in-fiction "Dischordian Saga" episodes play diegetically when their
trigger flag fires. Registry: `apps/shared/dischordianSagaEpisodes.ts`.
The episode player (`apps/client/src/components/DischordianSagaEpisodePlayer.tsx`)
detects `durationSec: null` as the signal to render a diegetic
"signal received, decoding in progress" fallback — gameplay path is never
blocked while an episode is in production.

### S01E01 — "The Worlds I Saved"

| Field | Value |
|-------|-------|
| Slug | `the-worlds-i-saved` |
| Trigger flag | `engineer_recording_3_discovered` |
| Paired recording | Engineer Recording 3 (`holo_worlds_i_saved`) |
| Paired vote | `engineer_vote_thought_vs_violence` (opens on episode dismissal) |
| Video path | `cdn/client-public/videos/episodes/s01e01-the-worlds-i-saved.mp4` |
| Captions path | `cdn/client-public/captions/episodes/s01e01.vtt` |
| Target duration | ~3–5 minutes (TBD with producer) |
| Audio bed | TBD — episodes ship with their own mix, no separate music cue from client |

**In-fiction synopsis (for production brief):** The Engineer's third
recording, broadcast in full: an invisible network of survivors his class
never wrote down, the worlds he fixed instead of broke, and the question
the Potentials must answer before the cycle closes — patience or violence.

**Production gating:** once the MP4 ships and the captions are uploaded,
update `DSAGA_EPISODES[0].durationSec` in
`apps/shared/dischordianSagaEpisodes.ts` to the real runtime. That flips
the player out of fallback mode automatically — no other client change
required.
