# Streamer / Content Creator — Audit

## Persona briefing

You're a 50K-follower variety streamer and YouTube longplay producer who needs to know: Will this game mute on Twitch (DMCA on those 118 songs)? Can you solo-stream the card-battle climax without copyright strike? Does the pause menu blur for IRL screen-shares? Which moments are *actually* 60-second-clip-worthy vs. "out of context, looks like a menu"? If you enable music separately from SFX/VO, can viewers hear your hot takes without the underscore track drowned out? The Memorial Corridor (newly patched via PR #513, 1300 VO lines) might be emotionally heavy — are the animations configurable so you don't lose three minutes per death card? Most critically: **no granular music-vs-VO-vs-SFX toggle exists today**, so your editor can't selectively mute just the licensed album soundtrack while keeping card-battle cues.

## Files audited

**Audio Control Infrastructure:**
- `apps/client/src/contexts/SoundContext.tsx` (lines 1–1127) — procedural SFX engine, master mute/volume, no granular per-track muting
- `apps/client/src/contexts/AmbientMusicContext.tsx` (lines 1–423) — YouTube IFrame BGM player, room-based track routing, toggleMusicEnabled flag but no separate music/VO slider
- `apps/client/src/contexts/GameAudioContext.tsx` (lines 1–399) — crossfade engine for game areas, auto-duck for Elara VO, track registry (currently unpopulated)
- `apps/client/src/pages/SettingsPage.tsx` (lines 1–850+) — Master Volume, Music Volume, SFX Volume, Ambient Sounds toggles (lines 521–561); Captions, Caption Size, Motion Intensity sliders for accessibility

**Cinematic & Replay Infrastructure:**
- `apps/client/src/components/SongCinematicVideo.tsx` (lines 1–142) — MP4 playback with music bed underneath, auto-dismiss, fallback on 404
- `apps/client/src/components/SongSlideshow.tsx` (lines 1–105) — reusable still-art + lyrics + timed crossfade, video-frame fallback, dream-mode bookend prophecies
- `apps/shared/tcg-core/replay/replay.ts` (lines 1–100) — deterministic match replay infrastructure, state hash verification, action replay for card-battle spectation

**Memorial & Narrative:**
- `apps/client/src/pages/MemorialCorridorPage.tsx` (lines 1–150) — Bond-40 gated memorial, per-NPC death records, "Remembrance" affordance (audio epitaph playback), narrator slot for contextual VO

**Music & Song Data:**
- `apps/shared/loredexSongMap.ts` (lines 1–31) — 20 Loredex→Song links across 5 albums (Dischordian Logic, Age of Privacy, Book of Daniel, Silence in Heaven, West by God)
- `apps/shared/lockeVoManifest.json` (11 S3-hosted preset-voice VO lines, no cloned voices)

**Card Battle (Clip-Worthy Moments):**
- `apps/client/src/pages/CardBattlePage.tsx` (lines 1–150) — holographic cards, particle systems, screen shake, floating damage, dynamic board lighting, element colors, rarity glow effects, 3D tilt on hover

**Component Inventory:**
- 308 components in `apps/client/src/components/` (naming: Toast, Memorial, Battle, Board, Cinematic, Effects, NPC, Puzzle, etc.)

**Licensing & Provenance:**
- `docs/legal/AI_PROVENANCE.md` (lines 1–100) — ElevenLabs TTS (preset voices, no cloning), Gemini for NPC chat (anonymised, 24-month retention), UI icons from Lucide/Heroicons (open-source)

## Findings

**1. No Granular Audio Control for Music vs. VO vs. SFX — Streamer Nightmare**
- **Severity:** P1
- **Where:** `apps/client/src/pages/SettingsPage.tsx:521–561`, `apps/client/src/contexts/SoundContext.tsx:1015–1027`
- **What's wrong:** The Settings page exposes Master Volume, Music Volume, SFX Volume, and Ambient toggle, but there is no independent Voice-Over volume slider. When you play a scene with Elara speaking (S3-hosted preset VO), you cannot turn down the background music separately without also affecting SFX cues (card_attack, achievement_unlock, etc.). The `useSound()` hook returns a single `muted` / `volume` pair that controls procedural SFX globally; `AmbientMusicContext` controls YouTube BGM independently, but VO routing lives in neither — it's baked into the narrative scene playback.
- **Why it matters:** Twitch streamers need to mute copyrighted album music (118 songs in LOREDEX) during gameplay without silencing card-battle feedback or VO. Without a separate VO slider, you either (a) mute all music and lose immersion, or (b) keep music on and risk DMCA claims on highlights. Longplay editors cannot surgically remove the Dischordian Logic soundtrack from a 20-minute boss encounter without Adobe Audition.
- **Recommended fix:** Add `voVolume: number` and `muteVO: boolean` to `SoundContextValue` (`SoundContext.tsx:1015`), expose VolumeSlider for "VO VOLUME" in SettingsPage Audio section (after line 551), and thread the VO volume through the S3 audio playback in `TrustVoiceLine.tsx` and `NarrativeEngine.tsx` via a new `useVOVolume()` hook that reads from SoundContext.

**2. Pause-Menu Blur for IRL Share: Missing Entirely**
- **Severity:** P2
- **Where:** `apps/client/src/pages/SettingsPage.tsx` (no blur implementation), `apps/client/src/components/AppShell.tsx` (modal/menu rendering)
- **What's wrong:** A streamer pulling up `/settings` to adjust brightness or check a quest log will have the full UI (username, account status, cloud sync status, cosmetic unlocks, promo code redemption) visible on-stream if they accidentally screen-share. There is no toggle to blur sensitive UI before IRL camera swaps.
- **Why it matters:** Twitch category guidelines ask streamers to blur passwords and account info. A "blur on pause" toggle saves you 10 seconds of framing before sharing your desktop to the camera.
- **Recommended fix:** Add a `blurPauseMenu: boolean` setting to `GameSettings` (`apps/shared/settingsSchema.ts`), implement a CSS class `[data-blur-ui="true"] .settings-sensitive-data { filter: blur(8px); }` for Account and Promo Code sections, and wire the toggle in SettingsPage line 580.

**3. No Run-Tracker Overlay for Acts & Decisions**
- **Severity:** P2
- **Where:** No dedicated overlay component exists; narrative state is in `GameContext` (`apps/client/src/contexts/GameContext.tsx`)
- **What's wrong:** Longplay editors segment gameplay by "Act 1 complete", "Collected all 7 Compendium entries", "Chose Redemption path", etc. Today there's no persistent, draggable overlay widget showing Acts, decision checkpoints, and death count. The HUD shows health/energy but not narrative progress.
- **Why it matters:** Longplay videos need chapter cards: "Act 3: The Fall" appears onscreen for 2 seconds before fading. A run-tracker overlay lets your editor see at a glance: "They're at Act 2 / Loyalty Path / 3 deaths", then pull the footage into timeline software with pre-built chapter markers.
- **Recommended fix:** Create `apps/client/src/components/RunTrackerOverlay.tsx` with state pulled from `GameContext` (current act, active decisions, death count, current room), render as a compact sidebar widget (toggleable via SettingsPage), and expose `position: "top-left" | "bottom-left" | "draggable"` option.

**4. Animation Durations Not Configurable; Threatens Longplay Pacing**
- **Severity:** P2
- **Where:** `apps/client/src/components/AnimatedPortrait.tsx:99–119`, `apps/client/src/pages/MemorialCorridorPage.tsx:138–150`, CardBattlePage transition durations hard-coded
- **What's wrong:** Narrative scenes like the Memorial Corridor (newly extended in PR #513 with 1300+ VO lines) have fixed fade/transition timings (e.g., line 139: `initial={{ opacity: 0, y: -4 }}` with 0.5s duration). Per PR #513, some moments may carry 5–10 second VO lines, but the UI animations are not linked to VO duration, so a slow reveal happens *before* the narrator finishes speaking, or vice versa.
- **Why it matters:** A 60-minute longplay has 15–20 narrative scenes. If each Memorial Corridor entry takes 8s (VO + reading time) but the card fade-in is 0.5s, that's 7.5s of dead air where the player is staring at a faded card waiting for the epitaph to finish. Longplay editors need to either (a) speed up the VO, or (b) compress animations — neither is ideal. A slider for "narrative timing" (0.5–2.0× speed) would let you lock animations to VO duration.
- **Recommended fix:** Add `narrativeAnimSpeed: number` slider (0.5–2.0×) to SettingsPage (near Motion Intensity, line 584), thread it through a `useNarrativeSpeed()` hook, and apply `transition={{ duration: baseDuration * useNarrativeSpeed() }}` across all Framer Motion wrappers in SongSlideshow, MemorialCorridorPage, and NarrativeEngine.

**5. Music Rights & Streaming Legality — Undocumented**
- **Severity:** P1
- **Where:** `docs/legal/AI_PROVENANCE.md` (lines 1–100, covers VO/card art but not music), no license file for songs
- **What's wrong:** The Dischordian Saga has 118 songs (per brief) across 5 albums (Dischordian Logic, Silence in Heaven, Age of Privacy, Book of Daniel, West by God). The AI_PROVENANCE doc discloses ElevenLabs VO and Gemini NPC chat, but **there is zero documentation of music origin, licensing model, or DMCA/BMI/ASCAP status**. Loredex shows YouTube IDs in `AmbientMusicContext.tsx:16–89`, suggesting third-party content is embedded, but no license manifest exists.
- **Why it matters:** Twitch flags copyrighted music in real-time; YouTube's Content ID system will claim or mute your stream if the songs are commercial. A streamer needs a manifest: "Dischordian Logic — Original Composition, Suno AI, Commercial OK", or "Silence in Heaven — Licensed from [artist] under [license]". Without this, you cannot confidently stream the game.
- **Recommended fix:** Create `docs/music-licenses.md` with a table: Song Title | Album | Source | License | Commercial Use OK | DMCA Safe? Per-album entries. If all music is original (Suno), note that Suno's Terms allow commercial use but require attribution. If licensed, cite the license file (CC-BY-SA, Epidemic Sound subscription, etc.). Link from the in-app About page and README.

**6. Song Cinematic Moments Lack Context Card Telegraph**
- **Severity:** P2
- **Where:** `apps/client/src/components/SongCinematicVideo.tsx:33–53`, `apps/client/src/components/SongSlideshow.tsx:112–143`
- **What's wrong:** When a Cinematic plays (e.g., the Act 2 climax, line 20: `videoUrl: string`), the player sees a title card for 1.2s (line 33: `TITLE_HOLD_MS = 1200`), then the video. There's no "Act 2 ??? Chapter 3: Betrayal" card that *tells* the longplay editor where to split chapters. The slideshow variant has a `title` prop but it's underutilized; it doesn't auto-render with an act/chapter template.
- **Why it matters:** Longplay editors need visual chapter breaks. A moment like "The Fall of New Babylon" (line 27 of `loredexSongMap.ts`) should trigger a chapter card that says `[CHAPTER XX: THE FALL]` for 2 seconds before playback resumes. Today, the editor has to scrub through raw footage to find the moment, then manually insert a card in post.
- **Recommended fix:** Extend `SongCinematicVideoProps` (`SongCinematicVideo.tsx:14–31`) to accept `chapterTitle?: string` and `chapterId?: string`, then render a full-screen title card with act + chapter number (e.g., "ACT 3 · THE FALL OF NEW BABYLON") for 2.5s before the video fades in. Wire chapter data from a `chaptersManifest.ts` keyed by narrative event.

**7. Card Battle Replay Export Missing for Highlight Reels**
- **Severity:** P2
- **Where:** `apps/shared/tcg-core/replay/replay.ts:37–74`, no export/download mechanism in UI
- **What's wrong:** The replay infrastructure (deterministic match replay, state hash verification) is fully implemented for spectation. A card battle can be replayed bytewise given (seed, actions, rules version). However, there is no "Export Replay as Video" button. A streamer cannot pull the raw battle from their last card ladder match and auto-render it as an MP4 for YouTube Shorts.
- **Why it matters:** Card-battle highlights are clip gold — decisive final turns, combo chains (ComboChainCounter component), critical hits with screen shake. Without replay export, you have to re-stream the match or record via OBS. A one-click replay→MP4 pipeline lets your editor grab battle footage in seconds.
- **Recommended fix:** Create `apps/client/src/lib/replayExport.ts` with a function `exportReplayAsMP4(replay: ReplayResult): Promise<Blob>` that reconstructs the match via `replay.ts`, renders each step as a canvas frame (using the CardBattlePage BattleCardView, BattleVFX, BoardEffects components), and encodes to H.264 MP4 via FFmpeg WASM. Expose a "Download Replay" button in the post-battle dialog (`PostBattleDialog.tsx`).

**8. SFX Trigger Sounds Not Configurable for Stream Alerts**
- **Severity:** P2
- **Where:** `apps/client/src/contexts/SoundContext.tsx:357–1002` (SFX definitions), no per-trigger mute or volume override
- **What's wrong:** The SFX system includes alert-friendly triggers (card_deploy, achievement_unlock, battle_victory, casino_jackpot — lines 532–958). However, there's no way to mute *only* the jarring ones (card_attack, casino_spin, puzzle_fail) without muting the rewarding ones (achievement, heal, specimen_bond). A streamer cannot say "use card sounds but not the error buzz when I mess up a puzzle."
- **Why it matters:** Streamers with alert-heavy OBS setups (channel point redemption sound, sub noise, raid alert) want game SFX to complement, not compete. A "mute puzzle_fail" checkbox prevents audio mud when the Twitch notification overlaps.
- **Recommended fix:** Add `sfxMuteList: SFXType[]` to GameSettings (`apps/shared/settingsSchema.ts`), expose a multi-select "Mute Specific SFX" in SettingsPage Audio section (before line 561), and filter `playSFX(type)` in `SoundContext.tsx:1099` to skip if `type in settings.sfxMuteList`.

## Cross-perspective overlap

(filled in during AUDIT_15_TRACKER.md aggregation)

## My streamer-mode toggle wishlist

**Vision:** A dedicated `/settings/streamer-mode` panel that appears alongside the existing Audio section, with presets for "Twitch Music Mute", "YouTube Longplay", and "IRL Demo". The panel should:

1. **Separate Audio Sliders** (independent from Master Volume): Music Volume, VO Volume, SFX Volume, Ambient Volume. Allows surgical muting of copyrighted album tracks while keeping card-battle feedback live.

2. **Streaming Presets**: Click "Twitch Music Mute" and the UI auto-sets: Music=OFF, VO=100%, SFX=100%, Ambient=OFF. "YouTube Longplay" instead: Music=70%, VO=100%, SFX=80%, Ambient=50%. Longplay editors can swap presets mid-stream without fiddling sliders.

3. **Pause-Menu Blur**: Toggle "Blur Account Info on Pause" — when you hit ESC, the Account section (username, email, sync status) fades to `blur(8px)`. IRL screen-share safe.

4. **Run-Tracker Overlay**: Draggable widget showing current Act, Active Decisions, Deaths, and Current Room. Toggleable position (top-left, bottom-left, corner-drag). Editors can see act progression at a glance.

5. **Replay Export**: Post-battle "Download Replay as MP4" button with quality selector (720p, 1080p). Highlight-clip pipeline automatic.

6. **Animation Speed Control**: Slider for narrative timing (0.5–2.0×). Locks animations to VO duration across all scenes. Prevents dead air in longplays.

7. **SFX Granularity**: Multi-checkbox list of SFX types (card_attack, puzzle_fail, casino_spin, etc.) with per-trigger mute. Prevents alert collision on Twitch.

8. **HUD Readability Mode**: Scales UI to 1.25–1.5× at 720p re-encode (applies `--scale` CSS var to all icon/text sizing). Ensures pause-menu text is readable on phone-camera-capture.

This panel would live at `/settings?tab=streamer-mode` and integrate seamlessly with the existing SettingsPage layout, using the same SettingsSection + VolumeSlider + Toggle components already present.

## The 5 most clip-worthy moments in the game

**1. Card Battle: Legendary Unit Deploy with Screen Shake & Combo Chain**
- **Which moment:** A Legendary-rarity unit (e.g., "The Architect" card) is played onto the board during a tight match; the deploy triggers a whoosh + impact thud (card_deploy SFX), screen flash, dynamic board lighting pulse, and a visible combo counter increments to 3.
- **File:line wiring:** `apps/client/src/pages/CardBattlePage.tsx:52–120` (BattleCardView rarity glow + 3D tilt), `apps/client/src/components/BattleVFX.tsx` (DeployBurst animation, ScreenFlash, ComboChainCounter), `apps/client/src/contexts/SoundContext.tsx:532–548` (card_deploy SFX).
- **Screenshot-able vs. GIF-able vs. 60-second-clip:** Screenshot: the card mid-glow, rarity border animating. GIF: the 0.4s deploy animation loop (whoosh + thud + board lighting spike). 60-sec clip: setup (hand with 3 cards, energy bar), deploy (deploy animation hits), combo counter pops to 3, opponent reactions (board shifts, AI card highlight for counter-attack). Total: 8–10 seconds of action.
- **What's missing for a 60-second clip:** Context card showing "Card Ladder Round 5 of 7 — Final Turn" and the opponent's health bar, so viewers understand the stakes. Deploy alone looks cool but reads as "pretty card animation" without the win/loss consequence onscreen. **Recommendation:** Add a subtle "FINAL TURN" banner above the opponent's board 1 second before this deploy, so the moment lands with narrative weight.

**2. Memorial Corridor: Reading an NPC's Epitaph (Newly Added, PR #513)**
- **Which moment:** Player walks into the Memorial Corridor (bond-40 gated unlock), the MobileNarratorSlot plays contextual VO (e.g., Elara reflecting on Kael's death), and a memorial entry fades in with the NPC's cause of death and a whispered epitaph. The player clicks "Remembrance" and hears a 5–8 second VO line tied to that character's S3 audio manifest.
- **File:line wiring:** `apps/client/src/pages/MemorialCorridorPage.tsx:66–102` (readMemorials, remember callback), `apps/client/src/components/TrustVoiceLine.tsx` (VO playback from manifest), `apps/shared/lockeVoManifest.json` (preset ElevenLabs voices), `apps/client/src/contexts/AmbientMusicContext.tsx:16–89` (ambient music for the corridor room).
- **Screenshot-able vs. GIF-able vs. 60-second-clip:** Screenshot: a memorial card with NPC name, cause of death, and "Remembrance" button glowing. GIF: the fade-in of the card over the ambient background. 60-sec clip: narrator intro (1.5s VO), memorial card appears (1s fade), player reads the epitaph onscreen (3s text visible), player clicks Remembrance (0.5s UI feedback), epitaph VO plays (5–8s), ambient music swells underneath, narrator outro (1s). Total: 12–15 seconds; can extend to 60s with multiple memorials (3–4 entries, each 12–15s).
- **What's missing:** A chapter-card telegraph ("ACT 3 · REMEMBRANCE") that auto-plays before the first memorial, so the audience knows they're entering a "slow, emotional" moment. Without it, the clip reads as a long loading screen. **Recommendation:** Add an `isMemorialGate` flag to the MemorialCorridorPage, and trigger a SongSlideshow-style chapter card on first entry.

**3. PvP Arena: Turn-Start Banner + Opponent's Highlight Card**
- **Which moment:** A Competitive Arena match begins; the TurnBanner component displays "Player Turn" in an ascendant chord (turn_start SFX, line 693–708 of SoundContext), the board lights up, and the opponent's highest-attack card is highlighted with a red pulsing border (targetable state), signaling the threat the player must manage.
- **File:line wiring:** `apps/client/src/components/BattleVFX.tsx` (TurnBanner, ScreenFlash), `apps/client/src/contexts/SoundContext.tsx:693–708` (turn_start SFX — ascending power chord), `apps/client/src/pages/CardBattlePage.tsx:122–135` (targetable glow, line 130: energy-error red pulsing).
- **Screenshot-able vs. GIF-able vs. 60-second-clip:** Screenshot: the "Player Turn" banner mid-animation. GIF: the banner entrance + opponent's threat card pulsing. 60-sec clip: opponent's last turn (board state, their creature positions), TurnBanner appears (0.8s entrance + SFX), player's hand fades in, threat card pulsates (2–3s loop), player selects a card and makes the play (3–5s), next turn begins. Total: 10–15 seconds.
- **What's missing:** On-screen health/energy tracking. A clip of "my turn begins" doesn't convey whether I'm ahead or losing. **Recommendation:** Add a persistent mini-HUD in the bottom corner showing "Player 18/20 HP, Opponent 7/20 HP" with a progress bar that updates mid-clip. Viewers immediately understand the stakes.

**4. Discovery Moment Sting: Conspiracy Board Revelation**
- **Which moment:** A player connects the final link on the Conspiracy Board (CADES investigation), unlocking a major plot revelation. The SFX triggers discovery_moment (oneshot audio sting, line 29 of GameAudioContext), the connected nodes pulse with a golden glow, and a modal appears with the revealed lore entry and a portrait of the key figure.
- **File:line wiring:** `apps/client/src/components/CADESConspiracyBoard.tsx` (node connection logic, trigger discovery SFX), `apps/client/src/contexts/GameAudioContext.tsx:214–230` (playOneShot for discovery sting), `apps/client/src/components/LoreOverlay.tsx` (lore modal reveal).
- **Screenshot-able vs. GIF-able vs. 60-second-clip:** Screenshot: the conspiracy board with the final link highlighted. GIF: the link draws onscreen (1–2s line animation) + golden glow cascade. 60-sec clip: player hovers the final connection (1s tension build, music ducks), clicks the link (0.2s), discovery sting plays (1.5s audio + visual flash), board nodes glow in sequence (2–3s), lore modal fades in with a character portrait and text (3–5s reveal), player reads/screenshot time (3–5s). Total: 12–18 seconds.
- **What's missing:** The discovery sting is audio-only (oneshot). A visual parallel — a screen flash or a starburst effect behind the nodes — would make the moment pop for muted clips (YouTube Shorts, TikTok). **Recommendation:** Add a `DiscoveryFlash` VFX component that triggers alongside the audio sting, with a 1.5s particle burst originating from the final connected node.

**5. Casino Jackpot Moment: Slots Spin + Win Animation**
- **Which moment:** The player spins the slot machine, the reels ratchet (casino_spin SFX, line 910–924 of SoundContext repeats 8 times), then all three reels land on the same symbol. The screen flashes, a "JACKPOT!" banner erupts with a triumphant fanfare (casino_jackpot SFX, line 943–958), coins cascade down the screen, and the player's balance UI blooms with green text (reward amount gained).
- **File:line wiring:** `apps/client/src/game/DegensCasinoPage.tsx` (casino floor; main entry), `apps/client/src/contexts/SoundContext.tsx:910–958` (casino_spin, casino_win, casino_jackpot SFX definitions), `apps/client/src/components/BattleVFX.tsx:FloatingNumbers` (reusable for coin cascade).
- **Screenshot-able vs. GIF-able vs. 60-second-clip:** Screenshot: the three reels all showing the same symbol. GIF: the final reel landing (0.5s) + jackpot banner pop (0.4s). 60-sec clip: setup (player's balance, stakes), spins trigger (6s of ratcheting SFX + reel animation), reels converge on match (0.8s tension), jackpot banner + fanfare erupts (1s audio + visual), coin cascade (2s animation), balance updates with green "+5000" floating numbers (1.5s), reaction shot / chat overlay (3–5s optional). Total: 14–20 seconds.
- **What's missing:** The casino lacks visible **player control feedback** — the SPIN button and "Bet Amount" display need to be prominent so viewers understand the risk/reward. **Recommendation:** Add a "Replay Jackpot Clip" export button in the casino post-spin dialog (similar to the replay export recommendation in Finding #7).
