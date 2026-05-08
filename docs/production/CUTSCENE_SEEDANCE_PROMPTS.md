# Cutscene Seedance v2 + Nano Banana Prompt Pack

> Source-of-truth prompts for the five named cutscenes from
> `docs/design/ANIMATED_CUTSCENES.md`. Each cutscene is broken into
> 15-second Seedance v2 shots; each shot has a **start frame** and
> **end frame** prompt for Nano Banana (Gemini 2.5 Flash Image)
> generation, plus a **Seedance v2** motion prompt that animates from
> the start frame to the end frame.
>
> **Workflow:**
> 1. Render start frame with Nano Banana 2 using the `START` prompt.
> 2. Render end frame with Nano Banana 2 using the `END` prompt.
> 3. Feed both frames + the `MOTION` prompt to Seedance v2 with
>    `duration: 15s`, `aspect: 16:9`, `quality: high`.
> 4. Concat shots in order; export as MP4 + WebM at 1920×1080.
> 5. Drop into `apps/client/public/videos/cutscenes/<cutscene_id>/shotN.mp4`.
> 6. Wire shot timing into the matching component under
>    `apps/client/src/components/cutscenes/`.
>
> **Style anchors (apply to every Nano Banana prompt):**
> - Cinematic lighting, anamorphic lens flares only when noted
> - 35mm film grain, slight halation on bright sources
> - Color grade: cool teal shadows + amber highlights for hopeful beats;
>   sodium-vapor amber + green-cyan shadows for surveillance/horror beats
> - No watermarks, no captions, no on-screen UI
>
> **Style anchors (apply to every Seedance v2 prompt):**
> - Smooth interpolation between start and end keyframes
> - Camera moves are slow and intentional (no whip pans)
> - Reduced-motion fallback frames are the start frames themselves

---

## CUTSCENE 1 — AWAKENING (45s total, 3 shots)

**Trigger flag:** `cutscene_awakening_complete`
**Sets:** `cutscene_awakening_complete`, `first_login`

### Shot 1.A — Inside the Pod (0:00–0:15)

**START (Nano Banana):**
> Extreme close-up shot from INSIDE a cryogenic pod, looking through frosted curved glass at a dark sleeping face in three-quarter profile. Skin pale, eyelashes coated in frost crystals. The glass surface has hexagonal ice patterns blooming from the corners. Beyond the glass: a deep black void with a single pulsing amber medical indicator LED visible through the fog. Shallow depth of field. Lens distortion on the glass curvature. Cinematic, film grain, ultra-detailed. Color grade: cyan-blue shadows, sodium-vapor amber backlight bleed.

**END (Nano Banana):**
> Same close-up, but the eyelids are now half-open, irises catching the amber LED light. Frost crystals on the glass have begun to retreat from a central thaw point. A thin condensation rivulet runs down the inside of the glass. The amber LED has shifted to a steady warm green. Same lens distortion, same depth of field. Eyelashes still frosted but glistening from melt. Color grade: warmed by 8% — the amber pull is stronger.

**MOTION (Seedance v2):**
> Slow ambient hum builds. Frost crystals retreat from the glass center over 8 seconds. Eyelids flutter once at 6 seconds, then drift open at 10 seconds. Subtle parallax: the camera holds inside the pod but breath fog from the subject drifts past the lens at 12 seconds. The amber LED transitions to green at the 14-second mark. No camera movement — pure surface and lighting animation.

---

### Shot 1.B — Pod Hatch Cracks Open (0:15–0:30)

**START (Nano Banana):**
> Medium shot from the head-end of a cryogenic pod. The hexagonal hatch is sealed but a thin seam of warm yellow light has begun to glow where the seal meets the rim. Mist particles are forming along the seam. Wider environment visible: a darkened pod chamber, rows of dormant pods stretching into shadow on either side, only this central pod illuminated. Heavy chiaroscuro lighting. Industrial sci-fi production design — brushed metal, exposed conduit, faint deck-numbered stencils. Color grade: deep teal-shadow, warm amber rim from the seal.

**END (Nano Banana):**
> Same pod, hatch now hinged open by 30 degrees. Volumetric mist pours out and downward, catching the amber-warm interior light. The figure inside is now visible in silhouette, sitting up. Beyond the pod, the camera has pulled back enough to reveal the chamber's curved ceiling and the dormant rows on either side, more clearly defined. A diagonal shaft of paler emergency light cuts through the mist from above. Same color grade, slightly higher contrast.

**MOTION (Seedance v2):**
> Pneumatic hiss at 0:15. Hatch cracks open with a slow hydraulic motion across 5 seconds. Mist begins pouring out at 0:18 and continues throughout the shot, gravity-falling and curling around the pod's edges. Camera SLOWLY dolly-pulls backward starting at 0:20, revealing the pod's surroundings. The figure inside sits up at 0:25, silhouetted against interior light. No facial detail visible — pure shape against light.

---

### Shot 1.C — Wide Establishing & Elara Materializes (0:30–0:45)

**START (Nano Banana):**
> Wide establishing shot of a cryogenic pod chamber labeled "POD CHAMBER 47". Dozens of pods arranged in two long rows recede into perspective. Only one pod (center-frame, mid-row) is open and lit warmly; all others are dark. A figure sits on the edge of the open pod, draped in steam. The chamber is vast, industrial, sci-fi — vaulted ceiling, exposed pipework, distant emergency strobes. Floor reflects the pod's amber glow into a long warm streak. Shadowy, atmospheric, lonely. Color grade: deep teal/black with amber single-source.

**END (Nano Banana):**
> Same wide composition, but a translucent humanoid hologram has now materialized standing 2 meters in front of the seated figure. The hologram is a young woman in a sleek high-collared uniform, head tilted slightly with concern. She emits a soft cyan-cyan-white inner glow that illuminates the seated figure from a second angle. Subtle volumetric scattering through the lingering steam. The chamber's emergency strobes are still pulsing distantly. Color grade: dual-source — warm amber from pod, cool cyan from hologram, in symbolic balance.

**MOTION (Seedance v2):**
> Camera holds wide. Particles of cyan light coalesce mid-frame at 0:32, building from scattered motes into a coherent humanoid form by 0:38. Brief bloom flare at 0:40 as the hologram resolves. Hologram tilts head and gestures gently at 0:42. Steam continues to drift. Pod glow remains stable. Subtle anamorphic flare on the hologram's eyes. End on the held composition — both figures, both light sources.

---

## CUTSCENE 2 — FIRST HUMAN CONTACT (30s total, 2 shots)

**Trigger flag:** `first_human_contact`
**Sets:** `first_human_contact`, `human_signal_detected`

### Shot 2.A — Static Resolves Into Silhouette (0:00–0:15)

**START (Nano Banana):**
> Pure television static — RGB color separation, scan lines, NTSC-style chromatic aberration. The frame is consumed by digital noise. Faint hint of a vertical shape barely perceptible in the center, suggested only by a very slight rhythmic darker patch at chest height. Imagine a 1970s surveillance monitor straining to lock onto a signal. Heavy grain, 4:3 framing inside a wider 16:9 black-bar safe area. Color grade: cold blue-cyan and red bleed.

**END (Nano Banana):**
> The static has partially resolved. A male silhouette is now visible center-frame, lit harshly from a 45-degree off-camera key with deep shadow on the right half of the face. Noir lighting — thin slashes of light across the eyes, jawline visible, mouth in shadow. Skin tones present but desaturated. The static persists as a translucent film over the entire image, with periodic horizontal interference bands. The 4:3 inside 16:9 framing remains. Color grade: amber-warmed key against cyan ambient — sodium-vapor noir.

**MOTION (Seedance v2):**
> Pure static at 0:00 with audio of high-frequency white noise. At 0:04, the static begins to thin in the center, periodically. By 0:08, a vertical shape pulses in and out of legibility. At 0:11 the silhouette locks for the first time briefly. By 0:14 the silhouette is held but the static persists overlaid. Periodic horizontal sync rolls (every 3 seconds) jitter the image vertically by 4 pixels. Camera does not move; this is a fixed surveillance frame.

---

### Shot 2.B — Zoom To Eyes, Signal Cuts (0:15–0:30)

**START (Nano Banana):**
> The same male silhouette held in noir half-shadow. Now framed slightly tighter — head and shoulders, eyes visible but in shadow. Static still overlaid. The set is unmistakably a 1970s detective-noir interrogation room: bare overhead bulb, faint cigarette smoke, peeling-paint background. Color grade: amber/cyan noir.

**END (Nano Banana):**
> Extreme close-up on the man's eyes only. Both eyes are sharply lit through the shadow — one slightly more visible than the other. The pupils are huge. The static interference is at its thickest, almost obscuring the rest of the face. There is a subtle red-cyan chroma split focused on the pupils themselves. The mouth and jaw are now in pitch-black shadow. Color grade: high-contrast amber/cyan with a touch of magenta in the chroma split.

**MOTION (Seedance v2):**
> Camera slowly zooms toward the silhouette's face from 0:15. Static intensity slowly increases. At 0:20, the figure tilts head a fraction — almost imperceptible. By 0:25, the camera is on the eyes only. At 0:28, the static spikes to maximum intensity for half a second; then the entire frame cuts to pure black with a SHARP digital glitch sound. End on black. No motion in the final 2 seconds.

---

## CUTSCENE 3 — ELARA'S MEMORY RECOVERY (60s total, 4 shots)

**Trigger flag:** `elara_memory_recovered`
**Sets:** `elara_memory_recovered`, `elara_identity_revealed`

### Shot 3.A — Atarion's Crystal Spires (0:00–0:15)

**START (Nano Banana):**
> Wide establishing shot of an alien city carved entirely from translucent golden crystal. Spires of varying heights pierce a violet sky lit by twin suns at golden-hour angle. Each spire glows internally with a warm amber light source. The city sits on a high plateau surrounded by mist-filled valleys. Architectural style: organic art-nouveau meeting brutalist geometric forms — think H.R. Giger collaborated with Frank Lloyd Wright for an opera house. Birds-of-paradise-like flying creatures with long iridescent tails wheel between the spires. Color grade: golden-honey with violet ambient and crystalline rainbow refractions.

**END (Nano Banana):**
> The same crystal city, but now viewed from a slightly elevated angle and slightly closer. The tallest central spire — labeled in alien script "Atarion Senate" — is fracturing. A single hairline crack runs from base to peak, glowing white-hot from inside. The amber light pouring from inside the spires has begun to flicker, some flashing red. The flying creatures have scattered. The violet sky is darkening. A second sun has dimmed. Color grade: golden-honey now bruised with red and storm-purple.

**MOTION (Seedance v2):**
> Slow forward dolly through the crystal city for the first 8 seconds — the camera glides between two spires. At 0:08, the central spire's crack appears with a chime sound and an internal flash. At 0:10, the flying creatures scatter outward. By 0:12, all spires have begun pulsing red instead of amber. The second sun visibly dims at 0:14. End on dolly held position. Subtle particle-debris drift of crystal dust throughout.

---

### Shot 3.B — Senate Chamber & Senator Voss (0:15–0:30)

**START (Nano Banana):**
> Interior wide shot of an alien senatorial chamber. Tiered semi-circular seating in concentric rings rises around a central speaking dais. Hundreds of robed alien senators (slender, four-armed, opalescent skin) sit in respectful poses. The architecture matches Cutscene 3.A: crystal columns, soaring vaulted ceiling, golden internal lighting. At the dais center: a young human-presenting woman in formal Atarion robes, mid-20s, dark hair tied up, a circlet of silver and crystal on her brow. She is mid-speech, hands raised. Her face is calm but pained. Color grade: deep gold-honey with rich purple shadows.

**END (Nano Banana):**
> Tighter shot now focused on the woman's face alone, three-quarter profile. Her expression has shifted from composed diplomat to dawning horror. Tears track down both cheeks. The crystal circlet on her brow has cracked, glowing red along the fracture lines. Behind her, blurry but visible, the chamber is in chaos — senators standing, alarmed gestures, a few rising in alarm. Color grade: same gold-honey but with red-firelight pulses creeping in from off-frame. Her name appears as an ethereal subtitle one second before the shot ends: "SENATOR ELARA VOSS — 2387 CYCLE".

**MOTION (Seedance v2):**
> Camera slowly pushes in on the dais speaker over 5 seconds. At 0:18, alarms begin ringing (low-frequency siren). At 0:20, the woman's expression shifts — eyes widen, mouth tightens. At 0:22, she stops speaking and her arms slowly lower. By 0:25, tears track down her cheeks (animated wet trail). At 0:27, the circlet on her brow flashes red and cracks. The subtitle name reveals at 0:29 with a soft typewriter sound effect.

---

### Shot 3.C — Panopticon Consciousness Transfer (0:30–0:45)

**START (Nano Banana):**
> Massive interior chamber, brutalist sci-fi: a central upright glass-and-steel tube (the "Panopticon") in which a still figure floats, suspended in luminous blue fluid. The figure is the same young woman from 3.B — Elara Voss — eyes closed, peaceful, robes replaced by a sheer biofiber suit. Surrounding the tube: arrays of crystalline data-spires, holographic displays, tendril-like cables. The room is lit only by the tube's blue internal glow and the cascading text on the displays. Background: distant figures in lab-coat hoods, blurred and watching. Color grade: cool cobalt-blue dominant with neon-cyan highlights on the data displays.

**END (Nano Banana):**
> Same chamber, same tube, but the woman's body inside is now translucent, semi-dissolved into pure light. Tendrils of golden-cyan light leave her body and flow upward through the tube, then horizontally into a smaller, secondary upright chamber to the right of frame containing a sleek black-and-chrome cybernetic body with no face yet — a blank chassis that is becoming her. The transfer is mid-flow. The data displays show cascades of white text. The lab-coat hoods are partially turned away — one figure has hands raised in alarm. Color grade: cobalt-blue plus golden transfer-stream creating teal mid-tones.

**MOTION (Seedance v2):**
> Slow zoom into the central tube over 4 seconds. At 0:34, the woman's body begins to glow more intensely. By 0:36, golden-cyan light tendrils begin escaping her body through the tube's apex. The tendrils flow horizontally across-frame to the secondary chamber. By 0:40, the lab-coat figures are turning toward the camera — one has raised an arm in protest or alarm. By 0:43, only a luminous ghost of her remains in the original tube. End just as the secondary chamber's chassis begins to take on her facial geometry.

---

### Shot 3.D — Ark 1047 Resolves (0:45–1:00)

**START (Nano Banana):**
> Exterior space shot. A massive generation-ark — kilometers long, brutalist sci-fi industrial design — drifts in deep space against a starscape with one pale dwarf star far in the distance. The ship's hull is scarred, scorched, ancient. Many of its docking arms are damaged. A registry plaque on the ship's flank reads "ARK 1047". The hull glows faintly from internal lights through countless porthole windows; one of those lights flickers blue (the Cryo Bay). Color grade: black-space dominant with subtle teal and amber from internal lights, a touch of dwarf-star red on the silhouette.

**END (Nano Banana):**
> Same ship, but the camera has pulled around to a tighter three-quarter angle showing the ship's nose and side. Superimposed on the right two-thirds of frame, semi-transparent: a portrait of the same young woman from earlier shots, now older, more weary, eyes open, looking directly at the viewer. She is no longer wearing Atarion robes — she now wears a streamlined Ark uniform. The crystal circlet is gone. Her expression is determined and a little sad. Behind her transparent portrait, the ship's silhouette is fully visible. Color grade: warm-amber portrait against cool-teal ship.

**MOTION (Seedance v2):**
> Slow camera arc around the ship over 10 seconds. Stars subtly parallax-shift. Internal lights twinkle. The Cryo Bay porthole pulses blue once. At 0:52, Elara's translucent portrait begins to fade in over the right side of frame. By 0:55, she is fully resolved. She blinks once at 0:57. End on held composition. Subtle warm-key on her face brightens slightly in the final second.

---

## CUTSCENE 4 — THE BREAKING POINT (player-controlled; 30s intro + choice + 15s consequence, 3 shots before choice + 2 after)

**Trigger flag:** `breaking_point_complete`
**Sets:** `breaking_point_complete` + one of `breaking_point_chose_elara` / `breaking_point_chose_human` / `breaking_point_refused`

### Shot 4.A — Split Screen Symmetry (0:00–0:15)

**START (Nano Banana):**
> 16:9 frame split symmetrically down the middle by a thin glowing white seam. **Left half:** Elara — same young woman from Cutscene 3 — three-quarter profile facing right toward the seam, lit warm amber-gold, surrounded by soft particle motes of warm light. Hair flowing as if in slow wind. Behind her: blurred crystal-spire imagery. **Right half:** The Human — same noir silhouette from Cutscene 2, now resolved into a weathered man's face in his 40s — three-quarter profile facing left toward the seam, lit cold cyan-blue, with sharp angular shadows. Behind him: blurred surveillance-grid imagery. Both characters are speaking — mouths mid-word. Color grade: bisected — warm amber left, cool cyan right.

**END (Nano Banana):**
> Same split-screen composition, but the central seam has thickened into a vertical glowing energy bar — the "morality meter" — pulled to a rough centerline but visibly trembling. Both characters' faces are slightly closer to camera now. Elara's expression is pleading. The Human's expression is solemn, almost grim. Both are still speaking. The particle motes around Elara have intensified into golden sparks; the angular shadows around the Human have deepened into near-pitch-black voids. Color grade: same bisection but with higher saturation and contrast.

**MOTION (Seedance v2):**
> Both characters speak simultaneously throughout — mouths animate continuously. The central seam pulses to the rhythm of speech. At 0:08, the seam begins to vibrate visibly, oscillating left and right by 5 pixels. The particle effects on each side intensify gradually. Slow zoom on both faces (matched, mirrored) over the full 15 seconds. End with both expressions held, seam at a tense centerline. No camera movement other than the matched zoom.

---

### Shot 4.B — Tension Builds (0:15–0:30)

**START (Nano Banana):**
> Same split-screen but now closer — both faces are framed tightly, eyes-and-nose composition. Elara's eyes are wide and shining. The Human's eyes are narrow and steely. The central morality bar has shifted to take up more of the screen, glowing white. The bar pulses brighter as if waiting for input. Background imagery on each side has dimmed to near-black to focus on faces and bar. Color grade: bisected, very high contrast.

**END (Nano Banana):**
> Same composition but ALL three elements are at maximum intensity. Elara's eyes are filled with tears. The Human's jaw is set. The central morality bar is now a vertical bolt of pure white light from top to bottom of frame, audibly humming. THREE button shapes have appeared at the BOTTOM of the morality bar: rectangular, glowing, equally spaced. From top to bottom: amber "SAVE ELARA", cyan "SAVE THE HUMAN", grey "REFUSE BOTH". Each button has a thin border, holographic UI styling. Color grade: same bisection, with the central column desaturated to near-white.

**MOTION (Seedance v2):**
> Both faces continue to speak. The morality bar pulses faster. Camera pushes in slowly. At 0:20, both characters' audio overlap audibly intensifies — the music becomes dissonant. At 0:25, both fall silent simultaneously. At 0:27, the three choice buttons fade in at the base of the morality bar, one at a time (top first, 0.4s apart). End with all three buttons visible, both faces held in their tense expressions. Music drops to a low ominous hum.

---

### Shot 4.C — The Choice Moment (player-controlled, ~no fixed time)

This is an **interactive shot, not animated**. The end-frame from Shot 4.B remains on screen indefinitely while the player chooses. The music loops a 16-bar dissonant pad. No time pressure.

**Implementation note:** the player's selection triggers either Shot 4.D-Elara, 4.D-Human, or 4.D-Refuse. The other two shots are not rendered.

---

### Shot 4.D-ELARA — Elara Side Glows, Human Side Shatters (0:00–0:15 of consequence)

**START (Nano Banana):**
> The end-frame composition from Shot 4.B is held — split screen, both faces, three buttons. The amber "SAVE ELARA" button is now glowing white-hot, ringed with a pulsing aura.

**END (Nano Banana):**
> The right half of the screen — the Human's side — has shattered like glass. Hundreds of jagged transparent shards are mid-flight, scattering outward beyond the frame edge. Behind the shattering: pure white. Elara's left half is now full-screen but expanded — the seam is gone. Elara is now centered in the frame, glowing brilliant golden-white, hair fully alight with energy. Her expression is one of relief and grief mixed. Color grade: amber-white dominant; cyan tones gone entirely.

**MOTION (Seedance v2):**
> At 0:00, the amber button flashes brighter. At 0:02, a sharp glass-shatter sound. The right half of the frame fractures into shards visibly mid-flight. Particles burst outward and dissipate. Elara's side expands rightward, the seam disappearing by 0:06. She steps forward into camera at 0:08. By 0:10, she fills the frame. Her expression resolves to relief at 0:13. End on held close-up of her face, full screen, golden-warm.

---

### Shot 4.D-HUMAN — Human Side Glows, Elara Side Shatters (0:00–0:15 of consequence)

**START (Nano Banana):**
> The end-frame composition from Shot 4.B is held. The cyan "SAVE THE HUMAN" button is now glowing white-hot, ringed with a pulsing aura.

**END (Nano Banana):**
> The left half of the screen — Elara's side — has shattered like glass. Golden-amber shards are mid-flight, scattering outward. Behind the shattering: pure white. The Human's right half is now full-screen but expanded. He is centered in the frame, lit cold cyan-blue, expression solemn and resolved. Color grade: cyan-cold dominant; amber tones gone entirely.

**MOTION (Seedance v2):**
> At 0:00, the cyan button flashes brighter. At 0:02, a sharp glass-shatter sound. Elara's half fractures into amber shards mid-flight. Particles dissipate. The Human's side expands leftward; seam dissolves by 0:06. He nods slowly at 0:08, expression unchanged. By 0:10 he fills the frame. He looks directly at the camera at 0:13. End on held close-up.

---

### Shot 4.D-REFUSE — Both Sides Shatter (0:00–0:15 of consequence)

**START (Nano Banana):**
> The end-frame composition from Shot 4.B is held. The grey "REFUSE BOTH" button is now glowing dim white. Neither face's side has changed.

**END (Nano Banana):**
> Both halves of the screen have shattered simultaneously. Amber and cyan shards mingle in mid-flight, scattering outward to all edges. Behind: pitch black. Center frame: nothing — empty void. A faint flicker of an old surveillance camera's red recording dot blinks weakly in the center. Color grade: pure black with a tiny red point.

**MOTION (Seedance v2):**
> At 0:00, the grey button flashes briefly. At 0:02, BOTH halves shatter simultaneously with a stereo glass-burst sound. Shards collide mid-air and ricochet outward. By 0:05, the frame is empty black. At 0:08, the red surveillance dot fades in at center. It blinks once at 0:11, again at 0:14. End on the dot, alone in black.

---

## CUTSCENE 5 — THE THOUGHT VIRUS MANIFESTS (30s total, 2 shots)

**Trigger flag:** `thought_virus_manifested`
**Sets:** `thought_virus_manifested`, `ship_quarantine_active`

### Shot 5.A — Ship Blueprint, Infection Begins (0:00–0:15)

**START (Nano Banana):**
> Top-down architectural blueprint view of a generation ark vessel — Ark 1047 — rendered in clean cyan-blue holographic linework against a near-black background. All decks visible: bridge at the bow, medical bay mid-port, engineering aft, cargo, observation, comms, etc. Each room labeled with thin sci-fi typography. Tiny dot-icons represent NPCs in their current rooms (small glowing cyan motes). Style: a mixture of Alien (1979) interface graphics and Death Stranding's networking maps. Color grade: deep navy background with cyan and electric-blue lines. No camera tilt — pure top-down orthographic.

**END (Nano Banana):**
> Same blueprint, same orthographic view. The Medical Bay deck has begun to glow red-orange. From its border, three thin vein-like red tendrils have started crawling outward through the corridor system — like infected blood vessels following the ship's ventilation paths. The NPCs inside Medical Bay are still cyan dots, but their dots are now flickering and shifting toward red. The rest of the ship remains untouched. Color grade: same navy-cyan base, with the new red infection as the only warm element.

**MOTION (Seedance v2):**
> Holding camera throughout — pure top-down. At 0:02, the Medical Bay starts glowing redder. At 0:04, the first red tendril emerges from its border. By 0:06, the tendril has reached the first corridor junction. At 0:09, a second tendril emerges. At 0:12, NPC dots inside Medical Bay flicker rapidly between cyan and red. End at 0:15 with three tendrils crawling slowly outward. Heartbeat audio sync at 75 BPM throughout. Subtle wet organic squelch on each tendril growth pulse.

---

### Shot 5.B — Infection Spreads, Bridge Holds (0:15–0:30)

**START (Nano Banana):**
> Same top-down blueprint of Ark 1047. The infection has now consumed roughly 60% of the ship's decks — Medical Bay, Engineering, Lower Cargo, the Observation Deck, Crew Quarters, and most of the corridor network all glow red-orange with dense infection patterns. Many NPC dots are now solid red. Some flicker. The remaining cyan-blue zones are: the Bridge (still cyan, untouched), the Comms Array (partially infected, flickering), and Pod Chamber 47 (still cyan). Heartbeat audio is louder. Color grade: the warm red has expanded to cover most of the frame.

**END (Nano Banana):**
> Almost the entire ship blueprint is now consumed by saturated red-orange infection. NPC dots are uniformly red. Only ONE room glows defiantly cyan: the Bridge at the bow. The rest of the blueprint pulses with infected energy. The cyan Bridge stands out as a single bright island. Faint text overlay near the Bridge reads: "QUARANTINE PROTOCOL ARMED". Color grade: red-dominant, with the Bridge's cyan as a pure focal point.

**MOTION (Seedance v2):**
> Continuous slow infection spread for the first 10 seconds — tendrils branching, rooms turning red one by one, NPC dots converting. At 0:22, the Comms Array fully turns. By 0:25, only Pod Chamber 47 and the Bridge remain cyan. Pod Chamber 47 turns at 0:27. From 0:27 to 0:29: TOTAL silence. The heartbeat stops. At 0:29, a single soft cyan PING emanates from the Bridge — a circular pulse rippling outward across the infected ship. End on the held composition. Quarantine text appears with a typewriter sound at 0:30.

---

## Render budget summary

| Cutscene | Shots | Nano Banana frames | Seedance shots | Total runtime |
|---|---:|---:|---:|---:|
| 1 — Awakening | 3 | 6 | 3 | 45s |
| 2 — First Human Contact | 2 | 4 | 2 | 30s |
| 3 — Elara's Memory Recovery | 4 | 8 | 4 | 60s |
| 4 — The Breaking Point | 5 (3 + 2 alt) | 10 | 5 | 30s + branch |
| 5 — Thought Virus Manifests | 2 | 4 | 2 | 30s |
| **TOTAL** | **16** | **32** | **16** | **~3m + branches** |

Asset paths the cutscene components expect:

```
apps/client/public/videos/cutscenes/awakening/shot1.mp4
apps/client/public/videos/cutscenes/awakening/shot2.mp4
apps/client/public/videos/cutscenes/awakening/shot3.mp4
apps/client/public/videos/cutscenes/first_human_contact/shot1.mp4
apps/client/public/videos/cutscenes/first_human_contact/shot2.mp4
apps/client/public/videos/cutscenes/elara_memory_recovery/shot1.mp4
... (etc; same pattern for breaking_point and thought_virus_manifests)
```

Each `.mp4` should be H.264, 1920×1080, 30fps, ≤ 6Mbps target bitrate;
include a `.webm` (VP9) sibling for older browsers. Reduced-motion
fallback uses the `START` frame of shot 1 as a single PNG at the same
resolution.
