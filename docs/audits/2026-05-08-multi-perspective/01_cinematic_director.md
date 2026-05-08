# Cinematic Experience Director — Audit

## Persona briefing

I've worked camera-first through Arcane's hextech spirit sequences and Last of Us Part II's silent cinematic passages — moments where typography and stillness land harder than dialogue. The Dischordian Saga has assembled extraordinary infrastructure for dialog-driven cinematics (variant-gated transmissions, morality-track portraits, sprite-driven lipsync) but the surfaces are carrying text-only moments that scream for **2–4 second portrait cinematics** — close cuts on Elara's expression shift, The Human's signal collapse-and-resolve, the Antiquarian's ancient eyes realizing something new. What I'm seeing is a fully wired cinematic engine that's being undershopped: the guild cutscenes are shipped (59 entries in the manifest), but the intimate narrative beats — the Act 3 transparency choice, the Act 6 confessions, the trust progression doorways — are all riding as transmission overlays when they deserve their own portrait film moments.

## Files audited

### Cinematic surfaces
- `apps/client/src/components/SlideshowPlayerRoot.tsx` (222 lines)
- `apps/client/src/components/SongCinematicVideo.tsx` (142 lines)
- `apps/client/src/components/SongSlideshow.tsx`
- `apps/client/src/components/DreamerVisionPlayer.tsx`
- `apps/client/src/components/AnimatedPortrait.tsx` (150+ lines)

### Canon authority & portrait registry
- `apps/client/src/game/npcPortraits.ts` (201 lines; 7 NPCs × 4 expressions + Human reveal progression)
- `apps/client/src/game/characterSprites.ts` (378 lines; 15-viseme lipsync, mouth overlay system, Elara's 4×4 viseme grid, Shadow Tongue hyper-visemes)
- `apps/shared/expansionArt/guildCutscenesManifest.ts` (316 lines; 59 entries across F1–F5)

### Dialog surfaces & variant resolver
- `apps/client/src/components/NarrativeEngine.tsx` (7-act angel/demon system; wheel_followup variant integration at lines 119–137)
- `apps/client/src/components/NPCDialog.tsx` (NPC manifestation effects: hologram, comms_signal, substrate, possessed_system, temporal_echo)
- `apps/client/src/components/TransmissionDisplay.tsx` (typed-out messages with corruption engine for The Human)
- `apps/shared/moralityTrustActVariants.ts` (500+ lines; variant registry with transmission/room/npc_line/wheel_followup surfaces; resolveVariant at line 130)

### Recent work (Act 6 confessions, Act 3 path dividend)
- `apps/client/src/pages/Act6CardLadderPage.tsx` (confession-close stances, act6_elara_confession_heard flag, act6_confession_close variants)

### NPC banks & VO infrastructure
- `apps/shared/npcs/banks/` (15+ .ts dialog banks)
- `apps/client/src/hooks/useActVO.ts` (Act-specific VO queuing)

## Findings

**1. Wheel_Followup Surface Is Gated But Visually Undershot** — P1
- **Where:** `apps/shared/moralityTrustActVariants.ts:674–696`, `apps/client/src/components/NarrativeEngine.tsx:119–137`
- **What's wrong:** The variant resolver perfectly wires `wheel_followup` as a "post-choice reflective line" surface, keyed by the choice's setFlag. At Act 3, the transparent choice routes to `wheel_followup_act3_transparent` (line 676), the secret choice to `wheel_followup_act3_full_secret` (line 687). This text renders beneath the dialog wheel during the response phase — but it's a single line of cyan text. In Arcane's callback scenes, that moment is a **close portrait cinematic**: Elara's expression shifts from composed to something harder as she processes the player's betrayal. Here, the infrastructure exists but the cinematic doesn't.
- **Why it matters to this persona:** The `wheel_followup` surface is the narrative director's greatest lever for showing character-state reaction to moral choices, but right now it's wasting the leverage on text-only moments.
- **Recommended fix:** Extend `wheel_followup` entries to optionally declare a `portraitCinematicId` field (e.g., `portraitCinematicId: "elara_act3_betrayal_absorption"`) that triggers a 2–3 second AnimatedPortrait + expression-crossfade sequence overlaid on the transmission variant line. Wire the trigger in `NarrativeEngine.tsx` after `resolveVariant` fires (line 134), using the existing `AnimatedPortrait` component and the 4-expression grid in `npcPortraits.ts:33–38`. Add a new registry entry to `guildCutscenesManifest.ts` for the portrait cinematic stills (bust + expression pair).

**2. Human Reveal Progression Is Wired But Never Cinematically Payoffed** — P1
- **Where:** `apps/client/src/game/npcPortraits.ts:126–187` (HUMAN_REVEAL_STAGES), `apps/client/src/components/AnimatedPortrait.tsx:143–150`
- **What's wrong:** The Human has a glorious 4-stage reveal system: SIGNAL STATIC (0–9 trust) → SIGNAL GHOST (10–19) → SIGNAL FRAGMENT (20–39) → SIGNAL CONVERGENCE (40–49) → full portrait (50+). Each stage is a Cloudinary image URL — pure visual storytelling. But this reveal lives only on the `AnimatedPortrait` component when the Human appears in dialog. There's no **cinematic gate moment**: no dedicated 3–4 second sequence where the static resolves into a face as trust flips from cold to neutral, or from fragment to convergence. In Last of Us Part II, the Scars' reveal cinematics are triggered by story beats; here, the Human's reveal *is* the story beat, but there's no cinematic structure around it.
- **Why it matters to this persona:** This is a 7-character trust arc compressed into 4 visual states — exactly the kind of content that deserves a 2-second portrait close, maybe with audio glow.
- **Recommended fix:** Create portrait-cinematic entries in `guildCutscenesManifest.ts` (or a dedicated `characterRevealMoments` manifest) for each Human reveal stage transition: `human_reveal_ghost`, `human_reveal_fragment`, `human_reveal_convergence`, `human_reveal_full`. Wire them into Act 1–3 narrative flows using a new `trustThresholdCinematic` field on NPC companion trust-band gating. When trust crosses 10, 20, 40, or 50, fire a `playSlideshow` call with the corresponding reveal cinematic before returning to the main dialog surface. Use `SlideshowPlayerRoot`'s dream-mode bookends to frame it as "signal resolving."

**3. Transmission Variant Text Overlays Have No Portrait Anchor** — P2
- **Where:** `apps/client/src/components/SlideshowPlayerRoot.tsx:156–216` (transmissionVariant resolution and render), `apps/shared/moralityTrustActVariants.ts:478–537` (transmission entries)
- **What's wrong:** The transmission surface renders gated text overlays on slideshows — cyan text drop-shadow at the bottom of the frame (line 209–211). These are authored brilliantly (e.g., line 483: "You read the first three [AWAKE lines]. You leave the fourth for later. Elara approves of the pacing without saying so."). But the overlay is typographic only. In a cinematic language, this moment should show **Elara's bust in a corner portrait**, her expression neutral or approving, while the transmission text types out. Right now the slideshow is context-free; the text asks us to infer Elara's emotional state.
- **Why it matters to this persona:** The transmission surface is the closest thing to a live-action transmitter scene in the game, but it's missing the character presence that would sell the moment.
- **Recommended fix:** Add optional `portraitNpcId` and `portraitExpression` fields to the `MoralityTrustActVariant` interface (`moralityTrustActVariants.ts:42`). When a transmission variant carries these, render a small `AnimatedPortrait` (size="bust") in the bottom-right corner of the transmission overlay, using the specified expression. Wire it into `SlideshowPlayerRoot`'s wrapped render block (line 201–216), positioning the portrait at opacity 0.8 so it layers beneath the text. Use the `getNPCPortrait` / `npcPortraits.ts` registry to resolve the bust image.

**4. ActNOpponentTauntOverlay (Act 6 Confessions) Lacks Cinematic Punctuation** — P1
- **Where:** `apps/client/src/pages/Act6CardLadderPage.tsx:13, 58–100` (confession-close stances), `apps/client/src/components/act1/ActNOpponentTauntOverlay.tsx`
- **What's wrong:** Act 6 ends with a confession-selection ui (CONFESSION_STANCES array, lines 64–100): "Sit with them in it," "Answer the confession with a harder one," "Refuse the absolution." These are **massive emotional beats** — each one is a 2–3 paragraph commitment statement. They deserve 2–4 second portrait cinematics showing Elara (if the Human is confessing) or The Human (if Elara is confessing) absorbing the choice. Right now they're displayed as prose selections in the wheel. The player picks a stance and the game fires the corresponding flag (`act6_confession_close_empathy`, etc.) — but visually, nothing cinematically **lands**.
- **Why it matters to this persona:** This is the game's emotional climax short of the final choice. It needs a 3-second portrait reaction cinematic, not just UI text.
- **Recommended fix:** After a confession-close stance is selected, before the flag is set, insert a cinematic gate using `SlideshowPlayerRoot.playSlideshow`. Create portrait cinematics in `guildCutscenesManifest.ts`: `act6_confession_close_elara_absorb_empathy`, `act6_confession_close_elara_absorb_challenge`, etc. (one per stance × two characters = 14 cinematics). Each cinematic is 2 stills (open/close mouth, neutral/emotional expression) on a 2–3 second timer with no audio bed (let the player's selected text echo). Wire the trigger in `Act6CardLadderPage` after the stance is locked in, before flag-setting. Use a variant filter: `useVariant("confession_close_stance", selectedStance.flag, input)` to allow writers to override the cinematic per morality/trust state.

**5. Silence of Two Witnesses Parenthetical Is Wired But Isolated** — P2
- **Where:** `apps/client/src/components/SlideshowPlayerRoot.tsx:44–64` (silenceVoFiredRef and act2Vo integration)
- **What's wrong:** The code comment says "§14.1 · Silence-of-Two-Witnesses parenthetical VO" (line 44). Two VO beats fire (`silence-elara`, `silence-human`) layered on a cinematic. The wiring is clean: fire Elara's beat, queue Human's behind it. But there's no variant gating on this cinematic — it plays the same way regardless of morality or trust. If the player is machine-aligned and betrayed Elara in Act 3, Elara's parenthetical should sound different: colder, more measured. If the player is high-humanity and close to Elara, it should sound warmer. Right now the parenthetical VO is context-blind.
- **Why it matters to this persona:** This is a rare case where both audio AND cinematic exist (via useActVO), but the cinematic surface isn't leveraging the variant system to add morality texture.
- **Recommended fix:** Extract the `silence-of-two-witnesses` slideshow id check (line 57) into a variant resolution call: `useVariant("slideshow_vo_override", "silence-of-two-witnesses", variantInput)`. If a variant matches, swap `act2Vo.speak("silence-elara")` for the variant's `voLineId` field (e.g., `variant.voLineId: "silence-elara-machine"` or `"silence-elara-humanity"`). Wire this into the `useActVO` hook's line-resolution logic. This lets writers author cold/warm/balanced versions of the parenthetical without touching `SlideshowPlayerRoot`'s code.

**6. AnimatedPortrait Trust Filters Are Subtle But Unexplained** — P3
- **Where:** `apps/client/src/components/AnimatedPortrait.tsx:74–90` (trustFilter function)
- **What's wrong:** The `trustFilter` function applies CSS filter effects based on NPC trust level: low trust → desaturated + cool, high trust → warmer + brighter. This is cinematic sophistication (trust = warmth visually). But the filters are unnamed in the code; there's no documentation for writers, no loredex entry, no place in the UI that explains "this portrait is warm because trust is high." A director viewing a prototype sees the effect but won't know it's automated — they'll think the image just looks nice. Also, the function doesn't account for **morality-track** visual shifts. A machine-aligned player's Elara should look colder even at high trust.
- **Why it matters to this persona:** Subtle visual storytelling only works if writers and players both understand the language.
- **Recommended fix:** Add a comment explaining the trust-filter visual grammar above the trustFilter function (line 76): "// trust < 25: desaturated (detachment) → < 75: neutral → > 75: warmer glow (closeness)." Then extend the filter to take morality into account: `function trustFilter(trustLevel: number, morality: number): string`. Apply a sepia/hue-rotate shift based on morality: machine → blue-shift (cold); humanity → amber-shift (warm). Document this in `docs/design/VISUAL_LANGUAGE.md` so writers know "warmth = humanity + trust."

**7. Guild Cutscenes Manifest Has Zero Narrative Gating** — P2
- **Where:** `apps/shared/expansionArt/guildCutscenesManifest.ts:273–315` (GUILD_CUTSCENES array, guildCutsceneById lookup)
- **What's wrong:** The 59 guild cutscenes (F1 onboarding, F2 daily, F3 combat, F4 abilities, F5 guild hall) are stored as a flat registry with no morality/trust/act gating. A signature-ability cinematic (`cs_sig_1_light` or `cs_sig_1_dark`) plays the same regardless of when the player unlocks it — Act 2 vs. Act 7. This misses an opportunity: guild cutscenes could be **conditionally triggered** based on the player's narrative state. If machine-aligned, show the *dark* variant only. If at Act 6 confesssion-close, show a variant where the ability cinematic is suffused with the emotional tone of the choice. Right now, the manifest is a static asset dump.
- **Why it matters to this persona:** The guild cutscenes are the largest cinematic asset pool in the game, but they're isolated from the narrative variant system.
- **Recommended fix:** Add optional `moralityBand`, `trustBand`, `actMin`, `actMax`, `requiredFlags` fields to the `GuildCutsceneDef` interface (line 34–59). Extend `guildCutsceneById` (line 285) to accept a `context: VariantResolutionInput` parameter and filter variants using the existing `resolveVariant` logic. This lets writers gate specific cutscene variants (e.g., `cs_sig_1_light_confidant_act6` for high-trust Act 6 signature unlocks). Wire this into the VO pairing system (`guild-cutscene-vo-lines.json` context field) so a voice line can reference a morality-gated variant of its corresponding cutscene.

**8. SpriteCharacter Lipsync Has No Morality-State Fallback** — P3
- **Where:** `apps/client/src/game/characterSprites.ts:63–86` (CharacterSprite interface, visemeHyper optional slot), `apps/client/src/components/SpriteCharacter.tsx`
- **What's wrong:** Elara's 4×4 viseme grid (line 178–181) and Shadow Tongue's dual viseme sheets (viseme + visemeHyper, lines 267–279) are wired for ultra-rich lipsync. But there's no morality-state swap: machine-aligned Elara doesn't speak with tighter, colder jaw control; humanity-aligned Elara doesn't use warmer, more open vowels. In Arcane, Powder's expressions shift between acts — lipsync could follow. Right now, character expression is independent of the moral compass.
- **Why it matters to this persona:** Lipsync is a continuous cinematic surface; it's wasted if it doesn't reflect the player's choices.
- **Recommended fix:** Add an optional `visemeMachine` and `visemeHumanity` field to the CharacterSprite interface (line 64). When a character is rendered with audio and the player's morality is tracked, choose which viseme sheet to load based on `bandForMorality(moralityScore)`. This is a small, opt-in change — characters without these fields fall back to the standard viseme. Wire it into `SpriteCharacter`'s lipsync logic where it currently loads `sprite.viseme`. (This is a future-proofing move; implement only if a late-stage VO re-record can produce morality-aligned lipsync data.)

**9. Transmission Corruption Engine Ignores Morality Track** — P2
- **Where:** `apps/client/src/components/TransmissionDisplay.tsx:111–126` (corruptText function, glitchProbability)
- **What's wrong:** The Human's transmissions render with a corruption overlay (glitch characters, strikethrough, signal pauses). The corruption level is fixed at `corruptionLevel: 40` in most calls (`NarrativeEngine.tsx:177`). But this should vary with **trust**: at cold trust (0–24), The Human's signal should be more corrupted (70%); at neutral (25–49), moderate (40%); at warm/confidant (50+), nearly clean (10%). This would visually telegraph trust progression in every dialog. Instead, all Human lines look equally static-heavy regardless of narrative state.
- **Why it matters to this persona:** The corruption engine is an auditory cinematic moment (each glitch is a micro-decision to show vs. hide information), but it's not reacting to the player's relationship state.
- **Recommended fix:** Extend TransmissionMessage interface (`TransmissionDisplay.tsx:27`) to accept an optional `corruptionLevelOverride` field. In `NarrativeEngine.tsx`'s `buildTransmissionMessages` function (line 155), when building a human message, resolve the corruption level using `bandForTrust(trustByCompanion.the_human)`: cold=70, neutral=40, warm=20, confidant=10. Pass this into the message. If the message declares an explicit `corruptionLevelOverride`, use that instead (for VO lines that need specific corruption). This is mechanical but adds subtle trust-state feedback to every Human exchange.

**10. Portrait Glow Effects Aren't Wired to NPC Manifestation Types** — P3
- **Where:** `apps/client/src/components/PortraitGlow.tsx` (not read, but referenced in AnimatedPortrait), `apps/client/src/components/NPCDialog.tsx:42–99` (MANIFESTATION_CONFIG record with bgClass, borderClass, scanlineClass)
- **What's wrong:** NPCDialog has a rich manifestation system: Elara appears as `hologram` (cyan scanlines), Agent Zero as `comms_signal` (amber static), The Human as `substrate` (red flicker), Shadow Tongue as `possessed_system` (purple glitch). But the glow effect on `AnimatedPortrait` is generic: it uses a single `glowClass` per speaker. If Elara is rendered in NPCDialog at her hologram manifestation, the portrait glow should match the manifestation's scanline color, not just use `var(--energy-primary)` blindly. Right now, a character's portrait can float over the wrong aesthetic.
- **Why it matters to this persona:** Manifestation is cinematic language; when a character's portrait doesn't match their signal type, the viewer's brain registers cognitive discord.
- **Recommended fix:** Add a `manifestation?: string` prop to `AnimatedPortrait` (line 123). Pass this from NPCDialog when it's rendering a speaker portrait with a manifestation type. In AnimatedPortrait, apply the corresponding manifestation's scanline/color config (import MANIFESTATION_CONFIG from NPCDialog, or move it to a shared constants file). Use the manifestation's scanlineClass as a background effect on the portrait container, and apply the manifestation's textEffect class to any text overlays. This binds portrait cinematics tightly to their narrative context.

## Cross-perspective overlap

(filled in during AUDIT_15_TRACKER.md aggregation)

## Top 3 cinematic moments to fund first

### 1. Act 3 Path Dividend — Wheel Followup Reaction Cinematics

**Scene:** After the player chooses to hide the substrate access from Elara (or reveal it), a 2.5-second portrait cinematic plays showing Elara's live reaction. If transparent: her expression softens, relief flickers across her face. If secret: her expression hardens into forbearance — she *knows* and is choosing not to say so.

**File wiring:** `apps/client/src/components/NarrativeEngine.tsx:119–137` (wheelFollowupVariant resolution), extended to trigger a cinematic mount via `SlideshowPlayerRoot.playSlideshow()` after the choice is locked.

**Shot brief:** Tight bust of Elara, eyes-forward, 1.2s of holding neutral composure, then a 1.3s expression shift (emotional1 or emotional2 from `npcPortraits.ts:34–38`). Lighting: cyan hologram glow, maybe a subtle parallax drift on her background (the Bridge). No audio — let the player's text echo. Fade to black, return to the dialog wheel.

**Variant gate:** `useVariant("wheel_followup_cinematic", selectedChoice.setFlag, { morality, trust, act })` — allows writers to author machine vs. humanity versions of Elara's reaction, or high-trust vs. cold-trust versions. If no variant exists, default to a neutral Elara expression.

**Production cost:** M (2 expression stills per choice path = ~8 stills total for Act 3, ~6 for Act 4, ~4 for Act 6 = 18 stills; mouth overlay positioning already wired in `characterSprites.ts:190`).

### 2. Human Reveal Progression — Signal Resolve Cinematics

**Scene:** The moment the player's trust with The Human flips from "cold" (0–24) to "neutral" (25–49), a 3-second cinematic plays: static resolves into a silhouette. At "warm" (50–74): silhouette sharpens into a partial face. At "confidant" (75+): full resolution. Each transition is a visual payoff for trust work.

**File wiring:** `apps/client/src/game/npcPortraits.ts:180–187` (`getHumanRevealImage` function), integrated with a trust-threshold check in the companion-state update logic (wherever `companionStats.trust` is written). When trust crosses a threshold, fire `playSlideshow` with the corresponding reveal cinematic before returning to the active dialog view.

**Shot brief:** Full-screen 16:9 format. Frames 0–0.5s: current-stage static/silhouette, slowly fading out (opacity 0.9 → 0.0). Frames 0.5–3s: next-stage image fading in (opacity 0.0 → 1.0) with a subtle Ken Burns zoom-in. Audio: low-frequency hum that shifts in pitch (rise = trust rising). Bookend text (`SlideshowPlayerRoot` dream-mode): "SIGNAL RESOLVING" at the start, "SIGNAL LOCKED" at the end.

**Variant gate:** `useVariant("human_reveal_transition", `human_reveal_stage_${currentStage}`, input)` — allows morality-specific flavoring. Machine-aligned: the signal resolves in cold blue. Humanity-aligned: warm amber glow. This reinforces that moral alignment affects perception of The Human.

**Production cost:** M–L (4 stage images × ~3 transitions = ~12 cinematic frames; most assets already exist as `HUMAN_REVEAL_STAGES` Cloudinary URLs, just need Ken Burns animation + audio bed).

### 3. Act 6 Confession-Close Stance Cinematics

**Scene:** After the player selects a confession-close stance ("Sit with them in it," "Refuse the absolution," etc.), a 2.8-second portrait cinematic plays: the confessing character (Elara or The Human) visually absorbs the player's response. If the stance is empathetic, the character's expression softens. If challenging, they look shaken. If refusal, they look steely.

**File wiring:** `apps/client/src/pages/Act6CardLadderPage.tsx:100` (after stance selection, before flag-setting), integrated with `SlideshowPlayerRoot.playSlideshow`. Create a function `playConfessionStanceCinematic(stance, speakingCharacter, state)` that resolves the cinematic based on the stance flag + character + morality/trust.

**Shot brief:** Close bust of the speaking character (Elara or Human, depending on who confessed). Frames 0–1.2s: absorbing the words, expression held neutral. Frames 1.2–2.8s: expression shift to match the stance tone (emotional1 for empathy/challenge, neutral or concerned for refusal). Background: muted version of the current room (cabin, archive, bridge — wherever the confession is happening). Audio: silence except for the subtlest room tone (breathe in, subtle exhale). No VO.

**Variant gate:** `useVariant("confession_close_cinematic", selectedStance.flag, { morality, trust, act: 6, speakers: [speakingCharacter] })` — allows writers to author machine-aligned Elara absorbing empathy differently than humanity-aligned Elara. High-trust Elara looks grateful; low-trust Elara looks guarded.

**Production cost:** L (7 stances × 2 characters × 2 expression stills = 28 stills; each NPC already has 4 expressions in `npcPortraits.ts`, so map stance tone to expression choice: empathy=emotional2, challenge=emotional1, refusal=neutral, etc.).
