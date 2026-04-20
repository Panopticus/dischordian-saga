# Room State Art Prompts — Cryo Bay + Medical Bay

_Generated from_ `apps/shared/roomStateArtPrompts.ts`_. Do not hand-edit — regenerate from source if the TypeScript changes._

- **Total prompts:** 8 — 4 Cryo Bay states + 4 Medical Bay states.
- **Resolution:** 1920×1080 (16:9 wide-shot).
- **Asset id format:** `<roomId>:<stateId>` (e.g. `medical-bay:device-awakened`).
- **Runtime picker:** a Section F follow-up; for now the art pipeline renders all 8 states and the runtime variant selector plugs in once the scene component is built.

Every prompt below is composed as:

```
<shared ROOM_STATE_STYLE_ANCHOR>

<shared room layout sentence>  STATE: <state-specific body>
```

Copy the full composed block into the art backend verbatim.

---

## Shared style anchor

Prepended to every composed prompt. This is the aesthetic contract — cyberpunk × steampunk sorcery, Awakening/Prelude palette, no figures, no text, no HUD.

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.

---

## Shared Cryo Bay layout

Every cryo-bay state embeds this layout sentence so the four variants composite onto identical architecture. **Do not change the camera, pod arrangement, or bulkhead position across states — only the state-specific layer changes.**

> The Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod occupying the lower-right foreground (pod rim and frost-rimed interior visible, no figure inside). The left wall carries a bank of diagnostic cryo-terminals with warm-gold indicator lights; the right wall a brass-framed corridor junction. Ceiling is a vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor is textured plate metal with frost pooled at pod bases. At the far end of the chamber: a reinforced bulkhead door marked with a single warm-gold sigil — the route to the Medical Bay.

## Shared Medical Bay layout

Every med-bay state embeds this layout sentence so the four variants composite onto identical architecture. The maintenance access panel behind the bio-bed is always in the same position; only its open/closed state (and what's visible through it) changes.

> The Medical Bay seen from the doorway — a wide surgical chamber with a central examination bio-bed on a raised brass dais, diagnostic scanners arrayed in a half-ring around it, and banks of pharmaceutical fabricators along the left wall. The right wall carries a floor-to-ceiling DNA analysis station (a slow-rotating holographic double helix in phosphor-green), beside a medicine cabinet of labelled vials. The back wall is dominated by the bio-bed and its floating holographic readout over the headrest. Behind the bio-bed, recessed into the wall between cable conduits, a maintenance access panel is inset — its position is always visible, but whether it is closed, ajar, or open shifts per state. Glass underfoot near the bio-bed — crunched boot-sized footprints trail past it. Ceiling is vaulted hull-rib with copper conduit; walls are oil-blued steel with warm-gold service lamps and brass-rimmed signage placards. A reinforced bulkhead door on the left leads back to the Cryo Bay; a second sealed door on the right (amber seal-status) leads deeper into the Ark.

---

# Table of contents

## Cryo Bay — Section F mystery arc

- [Cryo Bay — initial wake-up (`cryo-bay:initial`, P0)](#cryo-bay--initial-wake-up)
- [Cryo Bay — mid-investigation (`cryo-bay:investigating`, P0)](#cryo-bay--mid-investigation)
- [Cryo Bay — victim identified (`cryo-bay:victim-identified`, P0)](#cryo-bay--victim-identified)
- [Cryo Bay — returning later (`cryo-bay:case-open-later`, P1)](#cryo-bay--returning-later)

## Medical Bay — DNA device beat

- [Medical Bay — first entry (`medical-bay:initial`, P0)](#medical-bay--first-entry)
- [Medical Bay — device awakened (`medical-bay:device-awakened`, P0)](#medical-bay--device-awakened)
- [Medical Bay — after donating (`medical-bay:donated`, P0)](#medical-bay--after-donating)
- [Medical Bay — after refusing (`medical-bay:refused`, P0)](#medical-bay--after-refusing)

---

# Cryo Bay — Section F mystery arc

## Cryo Bay — initial wake-up

- **Asset id:** `cryo-bay:initial`
- **Priority:** P0
- **Condition:** Default state — no investigation flags set; player has just arrived in the room.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod occupying the lower-right foreground (pod rim and frost-rimed interior visible, no figure inside). The left wall carries a bank of diagnostic cryo-terminals with warm-gold indicator lights; the right wall a brass-framed corridor junction. Ceiling is a vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor is textured plate metal with frost pooled at pod bases. At the far end of the chamber: a reinforced bulkhead door marked with a single warm-gold sigil — the route to the Medical Bay. STATE: pristine wake-up. All pods are frost-rimed and humming quietly; the service lamps have their warm-gold cast but are dim. The foreground pod (the player's) is the only one open, its interior lined with condensation. Every other pod reads as sealed and intact from this distance. One pod in the middle row — second from the end, left side — shows a dark status indicator instead of the usual warm-gold, but it is easy to miss at this range (about 2% of the frame, just a small cold-blue absence where a light should be). No scattered debris, no movement, no open access panels. The bulkhead door at the far end shows a red-lit seal-status, clearly locked. The overall mood is "you just woke up and everything is exactly as it should be."

---

## Cryo Bay — mid-investigation

- **Asset id:** `cryo-bay:investigating`
- **Priority:** P0
- **Condition:** Player has examined at least one murder-mystery hotspot (`dead-pod`, `cracked-panel`, `medical-chart`, `personal-effect`, or `data-slate`). Sets `narrativeFlags.cryo_mystery_first_clue_found`.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod occupying the lower-right foreground (pod rim and frost-rimed interior visible, no figure inside). The left wall carries a bank of diagnostic cryo-terminals with warm-gold indicator lights; the right wall a brass-framed corridor junction. Ceiling is a vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor is textured plate metal with frost pooled at pod bases. At the far end of the chamber: a reinforced bulkhead door marked with a single warm-gold sigil — the route to the Medical Bay. STATE: mid-investigation. The dark pod (middle row, second from end, left side) is now the unmistakable focal point — frame-centered through depth cue, its interior visible through condensed glass as an inky occupied silhouette. Its control panel below the glass is cracked along a hairline fracture, with a slow intermittent arc of phosphor-lavender sparks escaping the seam. A thin printed medical chart is magnetically clipped to the pod's exterior near the fracture, one corner lifted as if disturbed. On the floor directly below the pod: a torn identification tag (brass-edged, cord cut), a small personal effect (a tarnished silver locket, open), and the edge of a data-slate peeking out from under the pod housing. A thin bioluminescent blood trail runs a short distance from beneath the pod toward the central aisle before disappearing under plate-metal seam. Bulkhead door at far end still shows red-lit seal-status. The other pods recede into softer focus to emphasize the evidence cluster. Mood: "something is wrong here and you have just started to see it."

---

## Cryo Bay — victim identified

- **Asset id:** `cryo-bay:victim-identified`
- **Priority:** P0
- **Condition:** Player has combined the torn ID tag + data-slate to identify the victim. Sets `narrativeFlags.cryo_mystery_victim_identified` and unlocks the Medical Bay bulkhead.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod occupying the lower-right foreground (pod rim and frost-rimed interior visible, no figure inside). The left wall carries a bank of diagnostic cryo-terminals with warm-gold indicator lights; the right wall a brass-framed corridor junction. Ceiling is a vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor is textured plate metal with frost pooled at pod bases. At the far end of the chamber: a reinforced bulkhead door marked with a single warm-gold sigil — the route to the Medical Bay. STATE: victim identified, door unlocking. The dark pod's glass has been wiped clear of condensation in a small oval where the player leaned in to read; the occupant's silhouette is now unambiguously visible inside but tastefully lit so features are obscured by reflection, not explicit violence — a figure in a crew uniform, slumped. On a small brass-topped diagnostic cart pulled up beside the pod: the torn ID tag laid flat, the data-slate powered on with its screen glow bouncing warm-gold off the cart surface, and the tarnished silver locket open beside them — the three evidence items consolidated as a deliberate exhibit. The cracked control panel is dark now; the phosphor arcs have stopped. At the far end of the chamber the bulkhead door is mid-cycle: seal-status indicator has flipped from red to amber, the door itself partially retracted, warm-gold light spilling from the Medical Bay corridor beyond into a long floor stripe. Mood: "you have given the dead a name, and a door that was closed is opening because of it."

---

## Cryo Bay — returning later

- **Asset id:** `cryo-bay:case-open-later`
- **Priority:** P1
- **Condition:** Player revisits the room after identifying the victim and progressing past Act 1 opening. Case remains open per plan (who killed them is an Act 2+ answer). Sets `narrativeFlags.cryo_case_marked_open`.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod occupying the lower-right foreground (pod rim and frost-rimed interior visible, no figure inside). The left wall carries a bank of diagnostic cryo-terminals with warm-gold indicator lights; the right wall a brass-framed corridor junction. Ceiling is a vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor is textured plate metal with frost pooled at pod bases. At the far end of the chamber: a reinforced bulkhead door marked with a single warm-gold sigil — the route to the Medical Bay. STATE: revisited, case still open. The dark pod is now cordoned off with a translucent phosphor-lavender tape strung between two brass posts placed by the operative — a makeshift crime scene marker. A small hand-written note (Elara's, in a precise scripted hand on a card) is pinned to the tape: rendered as a visible card shape but with no legible text (per anchor). The cracked control panel has been sealed with a brass patch riveted crudely in place. The evidence cart has been moved aside but is still in frame, items arranged more neatly than before. The floor blood trail is dry now, darker, no longer bioluminescent. Through the open bulkhead at the far end the Medical Bay corridor is clearly visible — warm-gold, welcoming. The other pods' service lights have dimmed to a cooler wash as the Ark's power rotation has moved on. Mood: "this place keeps its dead carefully, but it has already turned its attention elsewhere."

---

# Medical Bay — DNA device beat

## Medical Bay — first entry

- **Asset id:** `medical-bay:initial`
- **Priority:** P0
- **Condition:** Default state on entry — neither `donated_dna_sample` nor `refused_dna_sample` is set; the device has not yet been engaged.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Medical Bay seen from the doorway — a wide surgical chamber with a central examination bio-bed on a raised brass dais, diagnostic scanners arrayed in a half-ring around it, and banks of pharmaceutical fabricators along the left wall. The right wall carries a floor-to-ceiling DNA analysis station (a slow-rotating holographic double helix in phosphor-green), beside a medicine cabinet of labelled vials. The back wall is dominated by the bio-bed and its floating holographic readout over the headrest. Behind the bio-bed, recessed into the wall between cable conduits, a maintenance access panel is inset — its position is always visible, but whether it is closed, ajar, or open shifts per state. Glass underfoot near the bio-bed — crunched boot-sized footprints trail past it. Ceiling is vaulted hull-rib with copper conduit; walls are oil-blued steel with warm-gold service lamps and brass-rimmed signage placards. A reinforced bulkhead door on the left leads back to the Cryo Bay; a second sealed door on the right (amber seal-status) leads deeper into the Ark. STATE: first entry, the unkempt device dormant but findable. The maintenance access panel behind the bio-bed sits ajar by about 30° — not flung open, but clearly not latched, as if whoever was last in the room was in a hurry. Through the gap, a sliver of a brass-and-oil-blued-steel apparatus is visible: a neural-bridge rig with a short articulated needle-arm folded against its housing, a small smoked-glass capacitor window banked a barely-alive phosphor-lavender. A bundle of copper cables runs out of the panel and disappears into the wall conduit. The bio-bed's holographic readout is idle (flat cyan pulse). The DNA-helix station on the right wall rotates its slow green loop. The overall mood is "something in here was meant to stay hidden, and someone left in a hurry." No figures in frame. The device sliver is small in the frame (about 5%) — it rewards a player who looks.

---

## Medical Bay — device awakened

- **Asset id:** `medical-bay:device-awakened`
- **Priority:** P0
- **Condition:** Player has clicked the `vox-neural-bridge` hotspot and is mid-offer. No flag persisted yet (modal open).
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Medical Bay seen from the doorway — a wide surgical chamber with a central examination bio-bed on a raised brass dais, diagnostic scanners arrayed in a half-ring around it, and banks of pharmaceutical fabricators along the left wall. The right wall carries a floor-to-ceiling DNA analysis station (a slow-rotating holographic double helix in phosphor-green), beside a medicine cabinet of labelled vials. The back wall is dominated by the bio-bed and its floating holographic readout over the headrest. Behind the bio-bed, recessed into the wall between cable conduits, a maintenance access panel is inset — its position is always visible, but whether it is closed, ajar, or open shifts per state. Glass underfoot near the bio-bed — crunched boot-sized footprints trail past it. Ceiling is vaulted hull-rib with copper conduit; walls are oil-blued steel with warm-gold service lamps and brass-rimmed signage placards. A reinforced bulkhead door on the left leads back to the Cryo Bay; a second sealed door on the right (amber seal-status) leads deeper into the Ark. STATE: device awakened, offer extended. The maintenance access panel behind the bio-bed has been swung fully open (hinged to the right, held by a brass latch). The neural-bridge device is now fully visible: a chest-high apparatus of patinated brass and oil-blued steel, its central column bearing an arcane sigil ring that is breathing a warm-to-cold pulse of phosphor-lavender. The articulated needle-arm has extended from the housing and hovers above the bio-bed surface — a hair-thin chrome needle at its tip, a small sample-vial socket directly beneath it. A ring of fiber-optic ley-lines around the base of the device has come alive, tracing faint runic script across the floor plates in phosphor-lavender. The bio-bed's holographic readout has flipped from idle to ready — a single warm-gold glyph rotating slowly over the headrest. The room's warm-gold service lamps have dimmed slightly; the device is the dominant light source. Mood: "the room is waiting for your answer."

---

## Medical Bay — after donating

- **Asset id:** `medical-bay:donated`
- **Priority:** P0
- **Condition:** `narrativeFlags.donated_dna_sample === true`. The device has taken a sample and delivered the rolled reward.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Medical Bay seen from the doorway — a wide surgical chamber with a central examination bio-bed on a raised brass dais, diagnostic scanners arrayed in a half-ring around it, and banks of pharmaceutical fabricators along the left wall. The right wall carries a floor-to-ceiling DNA analysis station (a slow-rotating holographic double helix in phosphor-green), beside a medicine cabinet of labelled vials. The back wall is dominated by the bio-bed and its floating holographic readout over the headrest. Behind the bio-bed, recessed into the wall between cable conduits, a maintenance access panel is inset — its position is always visible, but whether it is closed, ajar, or open shifts per state. Glass underfoot near the bio-bed — crunched boot-sized footprints trail past it. Ceiling is vaulted hull-rib with copper conduit; walls are oil-blued steel with warm-gold service lamps and brass-rimmed signage placards. A reinforced bulkhead door on the left leads back to the Cryo Bay; a second sealed door on the right (amber seal-status) leads deeper into the Ark. STATE: donation complete, device dormant again, reward delivered. The maintenance panel remains open but the needle-arm has retracted fully into the housing. The device's sigil ring is now a cold, banked ember of phosphor-lavender — spent, not dead. A small brass receipt plate (about postcard-sized) rests on the bio-bed surface where the needle-arm was; its surface is engraved with a fresh radiant glyph and a clean class-species-element cant (rendered as glyph-shapes, not legible words per anchor). Beside the plate: the rolled-reward object itself (small enough to fit the bed — render as an indistinct brass-and-glass silhouette; the specific item is chosen at runtime by the earned-loadout roller, so the prompt must not commit to a shape). The bio-bed's holographic readout has returned to a gentle warm-gold idle pulse. A single sample-vial sits in the device's socket, its silver contents caught in the light. Mood: "the trade is done; the room remembers."

---

## Medical Bay — after refusing

- **Asset id:** `medical-bay:refused`
- **Priority:** P0
- **Condition:** `narrativeFlags.refused_dna_sample === true`. Player stepped back; the device has powered down and re-concealed itself.
- **Resolution:** 1920×1080

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080, cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt, clean horizontal horizon, no dutch angle, no lens distortion. Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and fiber-optic ley lines threaded through riveted hull panels. Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces, smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage. Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction, visible dust in the beam, faint film-grain sepia undertone. No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.
>
> The Medical Bay seen from the doorway — a wide surgical chamber with a central examination bio-bed on a raised brass dais, diagnostic scanners arrayed in a half-ring around it, and banks of pharmaceutical fabricators along the left wall. The right wall carries a floor-to-ceiling DNA analysis station (a slow-rotating holographic double helix in phosphor-green), beside a medicine cabinet of labelled vials. The back wall is dominated by the bio-bed and its floating holographic readout over the headrest. Behind the bio-bed, recessed into the wall between cable conduits, a maintenance access panel is inset — its position is always visible, but whether it is closed, ajar, or open shifts per state. Glass underfoot near the bio-bed — crunched boot-sized footprints trail past it. Ceiling is vaulted hull-rib with copper conduit; walls are oil-blued steel with warm-gold service lamps and brass-rimmed signage placards. A reinforced bulkhead door on the left leads back to the Cryo Bay; a second sealed door on the right (amber seal-status) leads deeper into the Ark. STATE: refusal, device re-concealed. The maintenance access panel has been pulled closed but NOT latched — it sits flush with the wall with a single hairline seam visible, a quiet "I am still here" rather than a sealed "I am gone." No phosphor glow escapes around the seam; the device behind it has fully powered down. The bio-bed's holographic readout is idle (flat cyan pulse), same as the initial state. On the floor beside the panel: a faint dust-free rectangle where the needle-arm had briefly extended — an absence the eye has to hunt for. The DNA-helix station on the right wall continues its slow rotation, indifferent. The warm-gold service lamps are back to their normal brightness. Mood: "nothing was taken and nothing was given, and the room accepts both."

---

_End of catalog — 8 prompts total (4 Cryo Bay + 4 Medical Bay)._
