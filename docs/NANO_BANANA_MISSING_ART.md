# NANO BANANA — MISSING ART PROMPTS (2026-05-19 Audit Gap)

Art prompts for the assets the [2026-05-19 art-completion audit](audits/2026-05-19-art-completion.md)
identified as genuinely missing from the dgrsart CDN — items whose code
reference resolves to `cdn/client-public/...` 403 and that have no
bucket counterpart under any naming variant (verified via authenticated
`aws s3 ls --recursive`).

**Universal style anchor** (per `TCG_ART_SPEC.md`): dark sci-fi
painterly, dramatic chiaroscuro, rich detail, cinematic framing, film
grain. Every card tells a story from the Dischordian Saga. No
rendered text in the art (text is for the card frame, not the
painting).

**Card art dimensions:** 680×500 px landscape (TCG art window).
**Slideshow frames:** 3168×1344 (Album 2) or 2752×1536 (Album 4),
cinematic widescreen, cel-shaded anime — Cowboy Bebop × Afro Samurai
× Cyberpunk Edgerunners.

**Sections:**

- §A — TCG single-card webps (33)
- §B — Engine-demo neutral cards (10)
- §C — Hierarchy of the Damned lords (2)
- §D — Eidolon specimen fragments (6)
- §E — Album 2 + Album 4 slideshow title cards (13)
- §F — UI background webps (4)
- §G — Late-game scene rooms (4)
- §H — Miscellaneous singles (card-back-seer, duel-bg, master_faces/elara, fighter sprites, ship/bunkroom)
- §I — Audio gaps (out-of-scope for Nano Banana; pointer to music-prompt doc)

---

## §A — TCG Single Cards (33)

**Output convention** (per the post-rename code paths):
`art/cards/<faction>/<descriptor>.webp` — e.g. an antiquarian curve
card writes to `art/cards/antiquarian/<name_slug>.webp`. Match the
existing producer drop's naming pattern (see
`art/cards/antiquarian/*.webp` on bucket for prior cards).

### A.1 — Antiquarian (5)

#### Era Mote (Common, T1, P1/H2, 1Ø)
**File**: `art/cards/antiquarian/era_mote.webp`
**Flavor**: *Smaller than the period at the end of an era. Heavier than its name.*
**Prompt**: A single dust-mote-sized fleck of amber suspended in dim air, lit from within by accumulated centuries — visible at the scale of a closed library where the only motion is the mote rotating slowly on its own axis. Around it, the dust is still. Mood: the smallest thing in the room that nevertheless decides the room's temperature. Amber + parchment + temporal blue palette.

#### Hourglass Sentinel (Uncommon, T2, P3/H6, 4Ø)
**File**: `art/cards/antiquarian/hourglass_sentinel.webp`
**Flavor**: *The grain falls at the rate the room agrees to. The Sentinel does not negotiate.*
**Prompt**: A robed sentinel in muted amber with an actual hourglass embedded in the chestplate where the heart should be — the sand inside falling at a visibly slower rate than ambient time (motion-blur the room behind, freeze the sand mid-fall). Face hidden in deep hood. Standing perfectly still in a corridor whose flagstones have been worn smooth by centuries of identical posts. Mood: the corridor's clock.

#### Relic Archive (Rare, T3, P3/H12, 5Ø, structure)
**File**: `art/cards/antiquarian/relic_archive.webp`
**Flavor**: *The shelf is older than the language on it. The shelf does not move.*
**Prompt**: A massive vaulted stone shelf running floor-to-ceiling in a dim archive chamber, every shelf-level packed with relics — broken swords, sealed canopic jars, an unlit lantern with cooled wax dripping into its base — labeled in three superimposed scripts (Antiquarian glyph, common, and a third the viewer cannot quite read). One amber sconce throws long shadows. No people. Mood: the shelf is the witness.

#### Relic Acolyte (Common, T1 in zeal slot, P1/H3, 2Ø, zeal)
**File**: `art/cards/antiquarian/relic_acolyte.webp`
**Flavor**: *Every relic was once a tool. Then a question. Then this acolyte, who has outlived all three.*
**Prompt**: A young acolyte in a faded amber-and-grey hood, kneeling next to a small floor-altar holding a single broken hilt. The acolyte's hand is on the hilt, not on the altar — touching the thing, not the ceremony. Their face is half-lit by amber from below; the rest is shadow. Mood: tools first, then questions, then this. Painted in the Antiquarian's chiaroscuro.

#### The Antiquarian (Legendary General, P5/H6, 5Ø, forcefield)
**File**: `art/cards/antiquarian/the_antiquarian.webp` (currently audited at `s1_char_018_the_antiquarian.webp`)
**Flavor**: *Throughout the cataclysm and the epochs that followed, he retreated into a hidden pocket dimension — a refuge woven from stolen time.*
**Prompt**: A bearded figure in a long amber-edged cloak standing inside a pocket dimension that is visibly *not the room around him* — the geometry behind him is folded, shelves of stolen books receding into impossible perspectives, walls that meet at angles greater than 360°. A faint translucent forcefield envelope hugs his silhouette. His face is composed, scholarly, not surprised. Mood: he built the corner he is standing in.

### A.2 — Architect (5)

#### Arc Lance (Uncommon, blast, P3/H5, 4Ø)
**File**: `art/cards/architect/arc_lance.webp`
**Flavor**: *The lance does not aim. The lance traces. The schematic does the aiming.*
**Prompt**: A chrome-and-crimson Architect operative gripping a polearm-length electrical lance, the lance discharging a perfectly straight arc of red-white plasma down a precisely-projected schematic line that's visible as a faint geometric overlay in mid-air. The operative's eyes are on the schematic, not the target. Background: a featureless red-grid void. Mood: aiming is bureaucracy; the schematic already aimed.

#### Schematic Spark (Common, curve, P2/H1, 1Ø)
**File**: `art/cards/architect/schematic_spark.webp`
**Flavor**: *The schematic does not waste a stroke. Neither does the spark.*
**Prompt**: A floating geometric construct the size of a fist — three nested wireframe cubes in chrome and crimson, a tiny red plasma ember at the absolute center, no flesh involved. The construct hovers at chest height in an Architect classroom; the chalkboard behind it shows the same construct drawn flawlessly in a single unbroken line. Mood: the spark is the proof.

#### Schematic Bastion (Uncommon, P4/H5, 4Ø)
**File**: `art/cards/architect/schematic_bastion.webp`
**Flavor**: *The plan is complete. The bastion is the plan. No further iteration is required.*
**Prompt**: A hulking architectural figure made of interlocking chrome plates — humanoid silhouette but every joint is a perfect right angle. The plates carry the same blueprint glyph repeated at every scale (a fractal of a single drawing). Standing in a perfect square of red light projected on the floor, the figure does not extend beyond the square. Mood: the iteration is over.

#### Observation Pylon (Uncommon, structure, P2/H10, 4Ø)
**File**: `art/cards/architect/observation_pylon.webp`
**Flavor**: *Geometry knows what flesh forgets. The pylon does not blink.*
**Prompt**: A four-sided chrome pylon, two stories tall, planted in a courtyard whose tiles align with the pylon's base to within a millimeter. The pylon has no visible sensor — the entire structure is the sensor. A single red lens at the apex, unblinking. The shadows it casts are too sharp for the ambient light. Mood: surveillance as architecture, not as device.

#### Engine Warden (Uncommon, zeal, P2/H4, 3Ø)
**File**: `art/cards/architect/engine_warden.webp`
**Flavor**: *Geometry knows what flesh forgets. So she stays within sight of the line.*
**Prompt**: A female Architect warden in chrome-plated uniform standing one meter behind a glowing red line painted on a factory floor; the line traces a complex polygon around an industrial assembly engine. She holds a baton at parade-rest. She has never crossed the line. The line has never moved. Mood: discipline is the warden, geometry is the warden, both are her.

### A.3 — Dreamer (3)

#### Glimmer Wisp (Common, curve, P1/H2, 1Ø)
**File**: `art/cards/dreamer/glimmer_wisp.webp`
**Flavor**: *It is the half-second after waking, given a body. It does not last. It does not need to.*
**Prompt**: A small humanoid silhouette woven entirely from soft violet-and-gold light — not solid, not transparent, the in-between of half-asleep. The figure is mid-step, one foot already disappearing in a swirl of probability dust. Behind it, the floor of a dim chamber. The figure is more an impression than a body. Mood: the moment between dream and naming. Purple + gold + astral blue palette.

#### Vision Anchor (Uncommon, P3/H6, 4Ø)
**File**: `art/cards/dreamer/vision_anchor.webp`
**Flavor**: *The dream moves around her. She does not. That is the whole job.*
**Prompt**: A seated woman cross-legged on a stone floor with eyes closed and hands open upward, while the room around her is in violent visual flux — the walls shifting between three different cathedrals, the ceiling cycling through six different skies, dream-debris drifting past her in slow motion. She is perfectly sharp; everything else is motion-blurred. Mood: the still point.

#### Dream Anchor (Uncommon, structure, P2/H9, 4Ø)
**File**: `art/cards/dreamer/dream_anchor.webp`
**Flavor**: *Some doors only open inward. The anchor is the doorway that does not move.*
**Prompt**: A standalone stone doorway in the middle of a void — purple-and-gold sky behind, no walls attached to the doorway, just the frame. Through the doorway: a corridor receding into impossible interior depth. Outside the doorway: nothing. The doorway is anchored to the void by golden chains attached to nothing on the other end. Mood: only inward.

### A.4 — Insurgency (5)

#### Strafe Runner (Common, blast, P2/H4, 3Ø)
**File**: `art/cards/insurgency/strafe_runner.webp`
**Flavor**: *I do not choose who is in the row. The row is the choice.*
**Prompt**: An Insurgency operative running parallel to a long line of identical Architect drones, firing their rifle from the hip in a controlled sweep — bullet tracers parallel to the row, not aimed at any individual unit. Mid-stride, expression cold and focused. Slate-blue and signal-green palette. Mood: the geometry is the target.

#### Cell Decoy (Common, curve, P1/H2, 1Ø)
**File**: `art/cards/insurgency/cell_decoy.webp`
**Flavor**: *She walks the route the auditors expect. The actual cell walks the other route.*
**Prompt**: A young insurgent in scavenged grey-and-green gear walking briskly down an alley while a New Babylon auditor drone tracks her from behind. Her hands are visibly empty, her posture deliberate. In the very background, two distant figures slip in the opposite direction down a parallel alley — barely visible, just shadow movement. Mood: the audit is the decoy too. Slate + signal green.

#### Trench Sergeant (Uncommon, P4/H5, 4Ø)
**File**: `art/cards/insurgency/trench_sergeant.webp`
**Flavor**: *The trench is the cell, written in dirt. Hold it. Hold it. The relief is coming. The relief is you.*
**Prompt**: A grizzled Insurgency sergeant in mud-streaked green coat, half-emerged from a long earth trench, bracing a rifle on the parapet and yelling backward to an unseen squad. Rain. Mid-shout. Multiple tattoos visible on the forearm. Mood: holding the line is the prayer.

#### Ghost Cell Runner (Rare, resurrect+rush, P3/H4, 4Ø)
**File**: `art/cards/insurgency/ghost_cell_runner.webp`
**Flavor**: *We were here before the maps. We are here after them. The runner does not stay dead because the cell does not stay caught.*
**Prompt**: A lone Insurgency courier sprinting across a rooftop at dusk, half-transparent — the silhouette of the runner is double-exposed, as if two takes of the same run are overlaid one frame apart. A satchel charge clipped at the hip. The buildings beneath are an unmapped slum the Architect's grid does not include. Mood: more than one of them is always running.

#### Oath Keeper (Uncommon, zeal, P3/H5, 4Ø)
**File**: `art/cards/insurgency/oath_keeper.webp`
**Flavor**: *We outlast every framework that names us. She names me. I outlast.*
**Prompt**: An older Insurgency operative in a worn duster, holding their right hand flat over their own heart, eyes locked off-frame to where a comrade is standing (just out of view). Both stand at the edge of a bombed-out plaza at dawn. The cloak fabric is repaired in many places with mismatched threads — every repair is a previous oath. Mood: oaths are inventory.

### A.5 — New Babylon (5)

#### Audit Artillery (Uncommon, blast, P3/H5, 4Ø)
**File**: `art/cards/new_babylon/audit_artillery.webp`
**Flavor**: *Submit in triplicate. The triplicate is the row. The row is what we audit.*
**Prompt**: A New Babylon gun emplacement that has been retrofitted to fire stacks of triplicate paperwork — three sheets per shell, three shells per volley — into a row of distant defendants. Brass-and-gold casings, ornate ledger-style filigree carved into the barrel. A magistrate in golden robes stands beside it with a clipboard checking each volley off. Mood: artillery as bureaucracy. Gold + obsidian + crimson palette.

#### Compliance Watcher (Common, curve, P2/H1, 1Ø)
**File**: `art/cards/new_babylon/compliance_watcher.webp`
**Flavor**: *Submit your form. The form is part of the form. Submit them both. In triplicate.*
**Prompt**: A New Babylon clerk in gold-trimmed black uniform standing behind a counter that is itself a stack of forms — the counter top is a triplicate ledger. Clerk has one hand extended palm-up waiting for a signature, the other hand already stamping a form they have not been given yet. Behind them: a wall of pigeonholes, all labeled, all full. Mood: form-as-prayer.

#### Sector Magistrate (Uncommon, P4/H5, 4Ø)
**File**: `art/cards/new_babylon/sector_magistrate.webp`
**Flavor**: *Her seal is heavier than her sidearm. The seal does most of the work. The sidearm does the rest.*
**Prompt**: A New Babylon magistrate in tailored gold-and-black robes, standing in the doorway of a sector tribunal. Right hand resting on a brass seal-stamp the size of her fist (mounted on her belt); left hand resting on a sidearm holstered next to it. The seal-stamp is visibly more worn. Background: a dim hallway with brass plaques on every door. Mood: the seal is the verdict.

#### Audit Tower (Uncommon, structure, P3/H8, 4Ø)
**File**: `art/cards/new_babylon/audit_tower.webp`
**Flavor**: *There is a form for that. There is also a tower for that. Submit in triplicate.*
**Prompt**: A tall gold-leafed tower in a New Babylon plaza, every floor lit from within by clerks at desks — silhouettes visible through the windows, all writing simultaneously. The tower's spire is a triplicate seal, three brass discs stacked at the top. A line of citizens at the entrance, each holding three identical sheets. Mood: the audit is the architecture.

#### Compliance Zealot (Common, zeal, P3/H3, 3Ø)
**File**: `art/cards/new_babylon/compliance_zealot.webp`
**Flavor**: *Procedure is the prayer the empire understands. He prays at her elbow.*
**Prompt**: A young New Babylon zealot in a gold-piped acolyte uniform standing one step behind a magistrate (the magistrate's elbow is visible in foreground left). The zealot is murmuring procedure code from a small leather book held at chest height, lips moving, eyes closed in something between concentration and prayer. The magistrate has not turned. Mood: procedural devotion.

### A.6 — Thought Virus (2)

#### Pyre Swarm (Rare, blast, P4/H6, 5Ø)
**File**: `art/cards/thought_virus/pyre_swarm.webp`
**Flavor**: *The strain does not infect a self. The strain infects a sentence and waits for selves to read it.*
**Prompt**: A swirling cloud of toxic-green particulate the size of a person but distinctly not-a-person, hovering in a town square where torn pages of a single book are blowing in every direction. Each page is on fire from the inside out. A handful of bystanders are reading the pages mid-flight, eyes lit toxic-green from below. The swarm is the audience. Toxic green + void black + corruption pink palette.

#### Persistent Strain (Rare, resurrect, P3/H4, 5Ø)
**File**: `art/cards/thought_virus/persistent_strain.webp`
**Flavor**: *The host believes the idea was theirs. Then the strain comes back, and the host believes that too.*
**Prompt**: A figure in plain clothes sitting calmly at a desk in a comfortable home, smiling slightly, with a faint toxic-green corona around their head. Above and behind them, a faded translucent ghost of the same figure with the same smile, slightly larger — already having "left" once. The host has not noticed the ghost is present. Mood: the strain ships.

### A.7 — Panopticon (4)

#### Undying Witness (Rare, resurrect, P4/H5, 5Ø)
**File**: `art/cards/panopticon/undying_witness.webp`
**Flavor**: *The eye does not blink. Even when struck. Especially when struck.*
**Prompt**: A large stone face mounted on a column in a Panopticon courtyard — only the eye is rendered in detail, the rest of the face is rough-hewn. The eye is wet, alive, alarmingly human. A fresh chip in the stone around the brow is bleeding faintly. The eye is open. Mood: damage as witness, witness as permanence. Steel grey + cold blue + red iris accent.

#### The L. Signature (Epic spell, 3Ø)
**File**: `art/cards/panopticon/l_signature.webp`
**Flavor**: *Every letter she sent you carried the glyph. You read 'L.' because that is what your eye knew how to see.*
**Prompt**: A close-up of a hand-written letter on cream stationery, ink in deep blue. The signature reads "L." in elegant cursive. The serif of the "L" is — on closer inspection — a Panopticon glyph, perfectly disguised as a stroke of the letter. The signature is repeated faintly in the margins of the paper, hundreds of times, like an obsessive doodle. Mood: what your eye knew how to see.

#### The Coordinator's Dossier (Legendary, provoke+forcefield, P4/H5, 5Ø)
**File**: `art/cards/panopticon/the_coordinators_dossier.webp`
**Flavor**: *The dossier is not surveillance. It is recognition. The interpretation has always been yours. You are reading the interpretation now.*
**Prompt**: A thick leather-bound dossier lying open on a steel desk in a dim Panopticon office, the visible pages covered with photographs, transcripts, annotations in red — every photograph is *of the viewer*. The figure that holds the dossier is mostly out of frame; only their hands are visible, gloved, deliberate, turning a page. Mood: the page that recognizes you. Steel + cold blue + crimson annotation.

#### Now You Are Ours (Legendary spell, 6Ø)
**File**: `art/cards/panopticon/now_you_are_ours.webp`
**Flavor**: *You have been useful. You have been quiet. You have been mine. Now you are ours, if you wish.*
**Prompt**: A ceremonial room in the Panopticon — a circular chamber with a low pedestal at the center on which sits an empty chrome chair facing outward at the viewer. Around the chair, a ring of standing figures in identical Panopticon coats, all facing inward, faces blurred. A single red eye floats at the chamber's apex, watching. The chair is offered, not commanded. Mood: invitation as inevitability.

### A.8 — Neutral (3)

#### The Seer, visiting fellow (Basic general, P3/H25, 0Ø)
**File**: `art/cards/neutral/the_seer_visiting_fellow.webp` (currently audited at `gen_seer.webp`)
**Flavor**: *I will not raise my staff today. I want to see whether the bench has learned yet.*
**Prompt**: An older robed figure with a tall staff held vertically in the left hand but planted on the ground next to him — *not* raised in stance. He is seated in an alcove of a library-arena, watching unseen events on a board he can see. His expression is patient, curious. The robe is academic, not combat. Mood: a teacher watching a test. Cream + silver + starlight palette (neutral).

#### Eternal Pilgrim (Epic, resurrect, P4/H6, 6Ø)
**File**: `art/cards/neutral/eternal_pilgrim.webp`
**Flavor**: *Their flag is the absence of a flag. The pilgrim outlasts every banner that names her, including her own.*
**Prompt**: A solitary figure walking a long road in worn travel clothes — no badge, no banner, no faction marker — carrying a walking-staff and a small bedroll. Behind her, the silhouettes of fallen banners from every faction lie in the dust she has already walked through (chrome+crimson, gold, signal-green, amber, purple, toxic green — all crumpled). Ahead: open road. Mood: outlasting nomenclature. Cream/silver palette.

#### Cut the Threads (Common spell, 2Ø — also in engine demos §B)
*(Listed in §B for unification with the engine-demo set.)*

### A.9 — House oath titles (2 — `house_oath_titles.ts`)

These are 1Ø/P1/H1 "title" cards — declarative single-line statements
rendered as identity-pass cards. Art should feel ceremonial rather than
combat.

#### The Sworn Pen (Basic, 0Ø, House Locke / new_babylon palette)
**File**: `art/cards/new_babylon/the_sworn_pen.webp` (currently audited at `art/cards/card_locke_sworn_pen_title.webp`)
**Flavor**: *The Authority's Ledger inks your name in red crystal. The pen is sworn. Six minds in coffins read the registry every cycle.*
**Prompt**: A ceremonial quill made of red crystal, suspended above an open page of The Authority's Ledger — the page is bound in gold-and-obsidian. The quill is mid-write; a single name has just been inscribed (the name itself is blurred / unreadable, but its presence is unmistakable). In the deep background, six cryogenic coffins arranged in a hexagon, faintly lit from within. Mood: oath as record. Gold + crimson + crystal-blue palette.

#### Witness of the Quiet Year (Basic, 0Ø, House Thaloria / neutral palette)
**File**: `art/cards/neutral/witness_of_the_quiet_year.webp` (currently audited at `art/cards/card_thaloria_witness_title.webp`)
**Flavor**: *The Council of Harmony permits you to be present. Not a position; a permission. The silence outlived the year.*
**Prompt**: A single empty chair set at the back of a small council chamber, beside an open arched window that looks out on a still meadow. A folded white sash rests on the seat — the only marker of presence. No people in frame. Late afternoon light. Mood: permission to be present. Cream + pale silver + meadow-green palette.

---

## §B — Engine Demo Cards (10 — neutral)

These are demo/test cards that ship with the engine demo. Style: same
dark sci-fi painterly but slightly more iconographic (each card is
illustrating a single rule mechanic). All under `art/cards/neutral/`.

#### Cut the Threads (Common spell, 2Ø)
**File**: `art/cards/neutral/cut_the_threads.webp`
**Flavor**: *Some weaves only hold while no one is looking. Look carefully — and pull.*
**Prompt**: A close-up shot of a gloved hand holding ceremonial shears about to snip through a single thread that is visibly part of a much larger woven enchantment — the enchantment glows faint blue, the thread under the shears glows brighter (it's the one holding everything else together). Mood: precision over force. Cream/silver neutral palette.

#### Tidewall (Common spell, 1Ø)
**File**: `art/cards/neutral/tidewall.webp`
**Flavor**: *The wall arrives a heartbeat before the wave. The wave is the wall.*
**Prompt**: A vertical wall of seawater frozen mid-rise at a beachhead — the wall is taller than the wave it will become. A defender stands at the foot of the wall with one hand raised, palm flat, the gesture matching the wall's geometry. Light catches the spray. Mood: defense is timing.

#### Witness Whose Time Has Come (Rare, P2/H3, 3Ø)
**File**: `art/cards/neutral/witness_whose_time_has_come.webp`
**Flavor**: *If the courtroom is loud, she will speak. If the courtroom is quiet, she will listen.*
**Prompt**: A woman in plain grey robes standing at a witness stand in a half-empty courtroom, the room split visually — left side bright and crowded, right side dim and empty. She faces forward, calm. Her hands rest on the rail. She is in the moment between the choice. Mood: testimony as response to weather.

#### Honor Guard (Common, zeal, P2/H3, 3Ø)
**File**: `art/cards/neutral/honor_guard.webp`
**Flavor**: *He stands within arm's reach of the one he chose. The bond is the weapon.*
**Prompt**: A guard in ceremonial dark armor standing exactly one arm's length to the right of an unidentified figure (only the figure's shoulder is in frame). The guard's right hand is empty, palm open in a gesture of readiness rather than aggression. Eye contact off-frame toward a threat. Mood: the bond is the weapon.

#### Wolfpack Initiate (Common, pack, P1/H2, 2Ø)
**File**: `art/cards/neutral/wolfpack_initiate.webp`
**Flavor**: *Alone she is a yelp. In two she is a song. In four she is the dawn.*
**Prompt**: A young initiate in pelt-and-leather garb, crouched on a low rocky outcrop with mouth open mid-howl, alone against a deep blue twilight sky. The horizon is faintly tinged dawn-red. Behind her, only her shadow — but the shadow is shaped like *more than one wolf*. Mood: alone but not for long.

#### Phoenix Cadre (Rare, resurrect, P4/H4, 4Ø)
**File**: `art/cards/neutral/phoenix_cadre.webp`
**Flavor**: *Killed once, the Cadre learns to die. Killed twice, the Cadre learns to stay.*
**Prompt**: A small unit of four armored soldiers standing tight in a defensive arrowhead formation in the middle of a smoke-and-ash battlefield. Two are wreathed in soft golden flame — the "second wake" — and look unbothered. The other two are intact but watching the burning ones with the relief of having been there before. Mood: institutional immortality.

#### The Reading Room (Rare, P2/H3, 3Ø)
**File**: `art/cards/neutral/the_reading_room.webp`
**Flavor**: *Every spell cast in the room is a page added to the next book.*
**Prompt**: A high-ceilinged library with a single wooden table at the center, on which lies a leather book in mid-write — the pen is moving on its own, ink flowing without a hand. The shelves around the room glow faintly each time a spark of magic crosses through the air. The book is recording each spark. Mood: the room is a recorder.

#### The Watchtower's Eye (Uncommon, P2/H2, 2Ø)
**File**: `art/cards/neutral/the_watchtowers_eye.webp`
**Flavor**: *Every step the watcher takes, the watched flinches. Every flinch counts.*
**Prompt**: A tall stone watchtower at dusk with a single bright slit-window at the top — the silhouette of a sentry visible. On the ground far below, the silhouette of a small figure mid-step has frozen, half-glancing up. The light from the slit casts a clear line to the figure. Mood: the line counts.

#### The Hospitality Officer (Uncommon, P2/H4, 3Ø)
**File**: `art/cards/neutral/the_hospitality_officer.webp`
**Flavor**: *She arrives at every guest's first step into the room. She makes the room feel chosen.*
**Prompt**: A composed woman in a clean grey-and-cream uniform standing in a doorway, gesturing welcomingly into a softly-lit lounge. A figure is just stepping across the threshold (foot mid-step). The lounge interior looks slightly warmer than the corridor exterior — not by lighting but by something less namable. Mood: arrival is the gift.

#### The Anchor of Kael (Uncommon, structure, P4/H8, 4Ø)
**File**: `art/cards/neutral/the_anchor_of_kael.webp`
**Flavor**: *Set down where Kael walked away. The Anchor remembers. The Anchor does not move.*
**Prompt**: A waist-high stone obelisk standing in a wide grass plain at dusk. A single rough boot-print is pressed into the dirt beside the base — old, weathered, faintly luminous. The obelisk carries one weathered glyph at the top: the Ne-Yon mark of Kael. No other figure in frame. Mood: the anchor holds because someone left.

---

## §C — Hierarchy of the Damned Lords (2)

These are S2 expansion cards (Lord-tier, ~14-19 HP, legendary). Visual
language: the Hierarchy of the Damned is the eldritch nobility of
Vortex Standing — cosmic horror in the form of grave aristocrats.
Color: deep voids, gilded bone, smoldering iron.

#### The Pale Emissary, Courier of Vortex Standing (Legendary, P4/H14, 8Ø, forcefield)
**File**: `art/cards/hierarchy/the_pale_emissary.webp` (currently audited at `lord_pale_emissary.webp`)
**Flavor**: *The pen is offered. The pen is empty — the ink will come from you. Whether you sign or refuse, the Emissary bows.*
**Prompt**: A tall, gaunt figure in an immaculate pale silver-grey diplomatic coat, no face visible beneath a low-brimmed hat — only the lower jaw, pale as bone, expressionless. One gloved hand extends forward holding a slender black pen, nib down, hovering above a contract whose page is blank. The Emissary bows slightly at the waist — the bow already begun. The room around him is a dim antechamber with one chair facing the contract. Mood: signing changes nothing — the bow precedes the signature. Pale silver + bone-white + deep void palette.

#### The Reckoning Daughter, Hierarchy Auditor (Legendary, P6/H19, 9Ø, dispel+untargetable)
**File**: `art/cards/hierarchy/the_reckoning_daughter.webp` (currently audited at `lord_reckoning_daughter.webp`)
**Flavor**: *Her arrival is the OTHER lords going quiet. The audit closes. Whatever you did was reconcilable — she would still be present otherwise.*
**Prompt**: A tall woman in a heavy black-and-gilt audit-robe entering a grand hall from a wide doorway, the other figures in the hall (other Lords, ministers, scribes) visibly going still and silent as she crosses the threshold. She carries a closed leather ledger in her right hand; her left hand rests on a small key at her belt. Her face is composed, unreadable, slightly weary — she did not want to be sent, but she was. Gilt accents on the robe glint dimly. Mood: the audit is over because she is here. Deep void + gilt + ledger-amber palette.

---

## §D — Eidolon Specimen Fragments (6)

The Eidolon specimens are bonded crew companions. The existing 7
fragments (`cipher-fragment`, `echo-fragment`, `flicker-fragment`,
`gilt-fragment`, `glyph-fragment`, `lux-fragment`, `spore-fragment`)
on the bucket establish the visual format: a "fragment" is the
companion's seed-form rendered in 3/4 anatomical study style on a
neutral void background, with the species' core thematic shimmer
visible at low intensity (companion-fragment = pre-bonding state).

Output convention: `art/specimens/<id>-fragment.png` (and `.webp` if
batch-converted at upload).

#### Auros (Gilded Lion, soldier-class)
**Flavor**: *A void-forged Nemean lion. Golden mane burning with contained plasma. The last of a species the Architect bred for war.*
**Prompt**: A 3/4 anatomical study of a young Nemean lion specimen on a deep-void background, mane composed of slow-burning golden plasma threaded with copper light — the plasma stays contained an inch off the fur, never touching it. Eyes are matte gold, calm. Body posture is regal but still, watching the viewer. Mood: noble survival. Gold + copper-glow + void-black palette.

#### Cog (Lattice Golem, engineer-class)
**Flavor**: *Not cloned — it assembled itself from nanobots while you slept. It has no DNA. It chose you because your neural patterns matched its swarm frequency.*
**Prompt**: A 3/4 study of a small humanoid figure made entirely of interlocking copper-orange nanobot lattice cubes — at this scale, the lattice cubes are individually visible, slowly shifting positions as if breathing. One forearm extends, palm open, with a tiny gift-shaped lattice construct resting on it. Eyes are paired glints of orange light, no actual sockets. Mood: assembled by choice. Copper + warm orange + void-black palette.

#### Nyx (Umbral Raven, spy-class)
**Flavor**: *Agent Zero's lost companion, found in stasis labeled 'DO NOT OPEN.' She carries fragments of a dead agent's memories in her neural lattice.*
**Prompt**: A 3/4 study of a large raven specimen on void-black background — feathers black with deep indigo iridescence, eyes blank silver (no pupil — the memories of a dead agent reflect off the eyes as faint scrolling text). Beak slightly parted as if mid-thought. One claw lifted off-perch, fragments of memory drifting like fine silver dust away from her shoulder. Mood: bequeathed. Indigo + silver-text + void-black palette.

#### Sibyl (Dreaming Owl, oracle-class)
**Flavor**: *Eyes that show glimpses of futures that were supposed to happen. She doesn't sleep — she's already dreaming. Older than the Panopticon.*
**Prompt**: A 3/4 study of a great owl specimen on void background, plumage in deep violet and grey, eyes enormous and oversized — each eye is a window into a different un-happened future (the left eye shows a sunset on a planet that hasn't formed, the right eye shows a hand setting down a teacup that will never be picked up). Posture is settled, ancient, patient. Mood: futures-as-vision. Violet + grey + dim-gold dream-light palette.

#### Strain (Living Infection, defected Thought-Virus species)
**Flavor**: *A piece of the Source that developed independent consciousness. The only Thought Virus entity to ever defect. Or it's a Trojan horse. You won't know for a long time.*
**Prompt**: A 3/4 study of a small humanoid figure made of clean white biological-mesh — soft, almost spongelike, with faint toxic-green veining visible at the joints (the Thought Virus origin not fully scrubbed out). Eyes are paired beads of clear blue light. Posture is hesitant, curious — half-leaned forward as if asking a question. Behind the figure: a single thin trailing tendril, the only piece that still looks viral. Mood: defection mid-becoming. White + clear blue + faint toxic-green vein palette.

#### Toxis (Blight Frog, assassin-class)
**Flavor**: *Found in the Viral Wastes — the only living thing in a Thought Virus dead zone. Its toxin exists 2 seconds in the future.*
**Prompt**: A 3/4 study of a small amphibian on void background — skin a deep oily green-black, with bright emerald-yellow spots that pulse very slowly. Above one shoulder, a faint translucent ghost of the same frog displaced two seconds forward — already mid-leap, mid-strike, while the primary frog is still seated. Eyes are emerald-yellow slits, fixed. Mood: predator with foreknowledge. Emerald + oil-black + faint void-purple palette.

---

## §E — Album 2 + Album 4 Slideshow Title Cards (13)

Title cards are the *frame-zero* of each track's slideshow — the
visual title cue that introduces the song. Style matches the rest of
the album: cel-shaded anime, Cowboy Bebop × Afro Samurai × Cyberpunk
Edgerunners. The title card is *not* the only frame — the rest of the
slideshow already exists on the bucket; the title card just opens it.

**Output convention:**
`art/slideshows/album2/T<NN>/T<NN>_00_title.webp` (3168×1344)
`art/slideshows/album4/T<NN>/T<NN>_00_title.webp` (2752×1536)

**Visual format for all title cards:** the song title rendered in
hand-lettered display type integrated into the scene as a diegetic
element (graffiti, neon sign, holographic display, etched into a
wall) — NOT a typography card over an unrelated image. The frame
should establish the song's central image so the viewer recognizes
the track from the title card alone.

### Album 2 — The Age of Privacy (3 missing)

#### T05 — "The Experiment"
**File**: `art/slideshows/album2/T05/T05_00_title.webp`
**Prompt**: A New Babylon laboratory — bright sterile fluorescents, polished concrete floor — with a single occupied gurney at center. The subject's face is calm; the audience behind the one-way glass is the experiment. On the wall above the gurney: a holographic display reads **"THE EXPERIMENT"** in clean Helvetica. Mood: the subject is the audit; the audit is the subject. Gold-and-obsidian palette of New Babylon, with one cold cyan accent from the display.

#### T06 — "Top Floor Door"
**File**: `art/slideshows/album2/T06/T06_00_title.webp`
**Prompt**: An elevator door on the top floor of a New Babylon tower, opening onto an unoccupied office with a single chair facing the elevator. Above the door, an ornate brass plate reads **"TOP FLOOR DOOR"** in art-deco lettering. The view past the chair: a panoramic window onto the city, blood-orange at dusk. Mood: arrival without invitation. Gold + brass + dusk-orange palette.

#### T15 — "This Ain't A Song"
**File**: `art/slideshows/album2/T15/T15_00_title.webp`
**Prompt**: A subway-tunnel wall in the slums of New Babylon, covered in layered graffiti. The newest layer, fresh wet spray paint in toxic-green, reads **"THIS AIN'T A SONG"** scrawled across the whole wall. Below it, in much smaller hand-print: a single dripping fingerprint. No people in frame. Mood: the message refuses its medium. Slate + signal-green palette (Insurgency-adjacent).

### Album 4 — West By God (10 missing — all of them)

Album 4 is a single continuous album-movie following the bridge from
Age of Privacy → Age of Revelation. Per the producer's MASTER_BIBLE
notes: The Programmer (Daniel Cross) IS the Antiquarian — keep that
identity reveal subtle in the visuals (never overt). The album-movie
arc is gritty, road-bound, mythic-Americana refracted through
post-collapse sci-fi.

#### T01 — "We Are Not Okay"
**File**: `art/slideshows/album4/T01/T01_00_title.webp`
**Prompt**: A roadside truckstop diner at 3am, exterior shot — the neon sign overhead reads **"WE ARE NOT OKAY"** in faded pink-and-cyan tubelight, several letters flickering. A solitary figure sits at the counter visible through the window. The parking lot is empty except for one battered car. Mood: confession by neon. Pink + cyan + asphalt-black palette.

#### T02 — "Medicated"
**File**: `art/slideshows/album4/T02/T02_00_title.webp`
**Prompt**: A close-up of a pharmacy counter at night, a row of orange prescription bottles on the counter — the labels collectively spell **"MEDICATED"** when read left-to-right (each bottle = one letter). Behind the counter, the pharmacist is half-visible, eyes downcast. Mood: prescription as identity. Amber + clinical-white palette.

#### T03 — "Hypnotized"
**File**: `art/slideshows/album4/T03/T03_00_title.webp`
**Prompt**: A diner booth seen from above — two figures across the table, one drawing a slow circle in the air with a fingertip, the other watching the circle. A streak of warped reflective neon on the tabletop reads **"HYPNOTIZED"** in distorted cursive. Both figures' eyes are slightly out of focus. Mood: the spell is being agreed to. Diner-orange + warped-neon palette.

#### T04 — "It Ain't Illegal (...Yet)"
**File**: `art/slideshows/album4/T04/T04_00_title.webp`
**Prompt**: A roadside billboard in a wide-open Western landscape, the billboard half-faded; the painted slogan reads **"IT AIN'T ILLEGAL (... YET)"** in 70s-style hand-painted Americana lettering. In the foreground, a parked motorcycle. A figure leans against it, hat tilted low. Mood: legality is weather. Sun-bleached ochre + dust-tan palette.

#### T05 — "Monuments"
**File**: `art/slideshows/album4/T05/T05_00_title.webp`
**Prompt**: A row of toppled bronze statues lying on their sides in a public square at dawn, weeds growing through the cracks. The largest fallen pedestal's plaque, half-buried in dust, reads **"MONUMENTS"** in classical Roman serif. Behind the row, the silhouette of a new statue under canvas. Mood: what we put up to remember. Bronze + dawn-pink + dust palette.

#### T06 — "Damned for Sure"
**File**: `art/slideshows/album4/T06/T06_00_title.webp`
**Prompt**: A small wooden country church on a windy ridge, white paint peeling, the front-door sign reads **"DAMNED FOR SURE"** in crude black hand-paint over the original parish name (the original name is just barely visible underneath). The door is ajar. One pair of boots visible on the threshold from inside. Mood: certainty as architecture. Storm-grey + weathered-white palette.

#### T07 — "It Ain't Been the Same (Born Under a Bad Sign)"
**File**: `art/slideshows/album4/T07/T07_00_title.webp`
**Prompt**: A drifter sitting on the back step of a rusted-out trailer at dusk, holding an acoustic guitar across the knees. A homemade hand-painted sign nailed to the trailer above his head reads **"BORN UNDER A BAD SIGN"** with the words "BAD SIGN" larger than the rest. The sky is a long bruised pink. Mood: blues as inheritance. Bruise-pink + rust-orange + worn-denim palette.

#### T08 — "On the Road"
**File**: `art/slideshows/album4/T08/T08_00_title.webp`
**Prompt**: A wide-angle shot down an empty two-lane highway at noon, heat shimmer above the asphalt. The road's painted yellow centerline forms the words **"ON THE ROAD"** when seen at the right angle (the perspective of the shot exactly aligns the letters). No vehicles. No people. Mood: the road is the destination. Heat-bleached blue + asphalt-grey + faded-yellow palette.

#### T09 — "The Death of Music"
**File**: `art/slideshows/album4/T09/T09_00_title.webp`
**Prompt**: The interior of an abandoned recording studio at night, sheet-draped equipment, a single overturned microphone stand center frame. A scrap of paper taped to the dead control console reads **"THE DEATH OF MUSIC"** in clean black sans-serif. Through the window: a city skyline with all the music-venue marquees dark. Mood: silence as bulletin. Black + faded-cream + cold-fluorescent palette.

#### T10 — "Yes I Do (Dream)"
**File**: `art/slideshows/album4/T10/T10_00_title.webp`
**Prompt**: A figure sleeping in a hammock strung between two scrub-pines at dawn, the slats of light through the trees catching a slow stream of dream-particles drifting upward from the sleeper's forehead. The particles spell **"YES I DO"** in cursive across the air. Mood: dreaming as affirmation. Dawn-amber + pine-green + dream-violet palette.

---

## §F — UI Background Webps (4)

These are background plates for full-screen UI surfaces. Hold-still
ambient art — no diegetic narrative content, no figures. Pure
atmosphere. Each at 1920×1080 (16:9) hero size.

#### `art/ui/card-frame.webp`
**Prompt**: An abstract dark sci-fi backplate suggesting "the moment before a card is revealed" — a deep indigo void with very faint chrome-silver schematic gridlines fading in and out, a soft circular glow at center-bottom as if a card is about to lift out of the surface. No card visible. No text. 1920×1080. Mood: anticipation. Indigo + chrome + black palette.

#### `art/ui/deck-bg.webp`
**Prompt**: A close-up overhead shot of a stack of face-down TCG cards on a dark felt-textured table — cards are visibly the same back design but the back design is heavily defocused (this is background, not foreground). One card at the top is slightly askew. Soft warm light from off-frame upper-left. No text. 1920×1080. Mood: deck as inventory. Felt-green + chrome-card-edge palette.

#### `art/ui/graph-bg.webp`
**Prompt**: An abstract data-visualization backplate — soft cyan-and-violet node-graph radiating outward from off-frame, lines connecting glowing nodes against a deep navy void. Edges fade at the canvas margins. No labels, no rendered text. Designed to sit *behind* a UI graph overlay without competing. 1920×1080. Mood: visible structure under invisible data. Cyan + violet + navy palette.

#### `art/ui/leaderboard-bg.webp`
**Prompt**: A wide ceremonial stadium interior shot from a high angle — empty tiered seating curving around a central illuminated arena floor. Spotlights stab down onto the floor; the seating is in dim violet shadow. No people, no scoreboard text. The composition has clear central empty space for a UI overlay. 1920×1080. Mood: the arena waits for names. Violet + warm-spotlight + chrome-rail palette.

---

## §G — Late-game Scene Rooms (4)

Each scene room is referenced from a specific page; the asset is the
"baseline" plate (idle/empty state). Format follows the existing
producer drop pattern: `art/rooms/<snake_case_name>/baseline.png`
(2752×1536, eventually converted to .webp at q85 on upload).
Wide-shot interior, no figures (figures composite in at runtime).

#### `art/rooms/comms_relay/baseline.png`
**Referenced by**: `Act2InterludePage.tsx`
**Prompt**: A dim communications-relay chamber on the Ark — a horseshoe of consoles ringed around a central holographic emitter that's currently quiet (faint blue-cyan haze, no projection). Long cables drape from the ceiling. One operator chair is empty, facing the emitter, swiveled slightly off-axis as if the operator left mid-shift. Wall panels show a frozen waveform. No people. Mood: the broadcast is about to resume. Cyan + cold-blue + dim-amber console palette.

#### `art/rooms/dreams_workshop_subbasement/baseline.png`
**Referenced by**: `GameContext.tsx` (late-game Dreamer surface)
**Prompt**: A low-ceilinged subbasement workshop carved into stone, lit by clusters of slow-floating dream-orbs in deep violet and gold. Workbenches around the perimeter cluttered with half-assembled visionary instruments — astrolabes that are slightly wrong, lenses that show different things from each angle, a small fountain of glowing dust. The center of the room is empty. No people. Mood: where dreams are built out of parts. Violet + gold + stone-grey palette.

#### `art/rooms/engineers_bench/baseline.png`
**Referenced by**: `EngineersBenchPage.tsx`
**Prompt**: A working engineer's bench in a warm-lit workshop on the Ark — wide L-shaped tool counter with neatly organized hand tools, a half-disassembled drone laid out in pieces in the workspace, a coffee mug at the corner of the bench (still steaming). Soft warm overhead light, cool blue light from an inactive holographic schematic floating above the drone. Mood: paused work waiting to resume. Warm amber + cool-blue accent palette.

#### `art/rooms/game_masters_arena/baseline.png`
**Referenced by**: `GameMastersArenaAct2Page.tsx`
**Prompt**: A small arena chamber set up like a private chess room — circular, with a single illuminated chess-style table at center, two empty chairs facing each other across the board, the board itself displaying a frozen mid-game position. Above the table, a holographic projection of the same board in 3D, slowly rotating. The walls are lined with banners of past players, faces obscured. No people. Mood: the rematch is scheduled. Royal-blue + chrome + warm-felt palette.

---

## §H — Miscellaneous Singles (6)

#### `art/card-game/card-back-seer.png`
**Referenced by**: `SeerCardFlicker.tsx` (tutorial overlay)
**Prompt**: A card-back design for the Seer tutorial cue: cream-and-silver base with a Seer staff motif centered as a vertical line, encircled by a small ring of pale-gold runes. Cleaner / less ornate than the standard faction backs (this is a *tutorial* card back, not a faction back — it should feel instructional, not combat-tense). 750×1050 px. Mood: pointer. Cream + silver + faint-gold palette.

#### `art/duel/duel-bg.webp`
**Referenced by**: `lib/assetPrefetch.ts` (PvP / casual duel splash)
**Prompt**: A wide cinematic backplate of two distant silhouetted duelists standing at opposite ends of a long ceremonial Dischordian dueling ground — neither figure recognizable as a specific character. Between them, a faint ring of floating glyphs at ground-level (the dueling circle). Atmospheric haze in the middle distance. 1920×1080. Mood: the contest before identity. Slate-blue + chrome + violet palette.

#### `art/portraits/master_faces/elara.png`
**Referenced by**: literal URL in source (suspected stale reference; bucket has `characters/elara/...` instead, this filename never existed)
**Suggestion**: this looks like a stale path. Verify via `git blame` whether the consumer still needs a `master_faces/elara.png` distinct from the existing `characters/elara/idle_hologram.avif` and other portraits. If yes, prompt:
**Prompt**: A formal "master portrait" of Elara — 3/4 head-and-shoulders bust at high resolution, neutral expression, plain dark backdrop, even cinematic studio lighting. This is the "canonical reference face" of Elara, intended to be the single visual source-of-truth other portraits derive from. Mood: identity reference, not in-fiction. 1024×1024. Cyan + cream skin-tone + neutral palette.

#### `art/ship/bunkroom_corridor.webp`
**Referenced by**: `BunkroomPage.tsx`
**Prompt**: A long narrow Ark crew-quarters corridor at low-light night cycle, twin rows of recessed bunk doors on either side (visible bunk-numbers above each door), a single ceiling light midway down the corridor at half-power, soft cyan emergency strips along the floor. No people. Sense of habitation: an open jacket on a hook, a single coffee cup on the corridor floor outside one bunk. Mood: shipboard sleep. Steel + cyan + dim-amber palette.

#### Fighter sprites — `art/fighters/{architect,collector,enigma}` (atlases)
**Referenced by**: `spriteSheetConfig.ts`
**Note**: The bucket already has the *first three atlases* for these characters at:
- `art/fighters/architect/architect_{idle_movement,basic_attacks,reactions_throws,specials_supers,portraits,victory_ko_art}.{png,webp}` (6 atlases live)
- Same for `collector` and `enigma` (verify per-character via `aws s3 ls`)

The audit flagging these as 403 is the directory-style probe — the
fighter atlases themselves are present. **No new art is required here**;
this is a §B base-URL false positive. If `spriteSheetConfig.ts`
references a *specific* missing atlas (not just the directory), call
out the atlas name explicitly and re-probe.

---

## §I — Audio Gaps (out-of-scope for Nano Banana)

For completeness, the audit also identified these missing audio
assets. **Nano Banana is for images**; use the music-prompt pipeline
(`docs/FNORD23_MUSIC_PROMPTS.md` + `docs/production/prompts/
suno-game-music-prompts.md`) for these:

- `audio/album1/T11.mp3`, `T18.mp3`, `T23.mp3` — Album 1 tracks
  beyond T09 (album currently only delivered through T09)
- `audio/music/celebration/welcome-to-celebration.mp3`
- `audio/music/mechronis/to-be-the-human.mp3`
- `audio/music/song_last_words_prelude_full.mp3`
- `audio/songs/dischordian_logic.mp3`
- `audio/antiquarian/...` (base URL — see if a specific track is
  missing, or if this is a stale const)

Cross-reference these with the existing music-prompt backlog in
`docs/FNORD23_MUSIC_PROMPTS.md`. If a song-name already has a Suno
prompt there, it's a producer-pipeline gap (prompt exists, render
hasn't shipped) rather than a writing gap.

---

## Output paths quick-reference

After Nano Banana renders, upload via `pnpm assets:upload` (which
walks `apps/client/public/{art,audio,videos,music,games,vo,
characters,vfx-atlases}` and PUTs to `s3://dgrsart/cdn/client-public/`
with `Cache-Control: public, max-age=31536000, immutable`).

The 85 actionable images break down by output prefix as:

| Prefix | Count |
|---|---:|
| `art/cards/<faction>/<descriptor>.webp` | 33 single + 10 demo + 2 hierarchy = **45** |
| `art/specimens/<id>-fragment.png` | **6** |
| `art/slideshows/album{2,4}/T<NN>/T<NN>_00_title.webp` | **13** |
| `art/ui/*.webp` | **4** |
| `art/rooms/<name>/baseline.png` | **4** |
| Misc singles (card-back-seer, duel-bg, master_faces/elara, bunkroom_corridor) | **4** |

Re-run `bash docs/production/audit/extract-urls.sh && bash
docs/production/audit/probe-cdn.sh` after upload to confirm the
dead-URL count drops accordingly.
