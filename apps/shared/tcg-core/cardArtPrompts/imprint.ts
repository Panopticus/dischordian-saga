/**
 * Card art prompts — IMPRINT faction (18 character sets × 5 tiers
 * = 90 cards).
 *
 * Imprint cards are the highest-rarity character cards in the game
 * — each character has 5 tier variants escalating from baseline
 * mortal form (t1) to transcendent cosmic form (t5). Tier-ups also
 * mechanically escalate (cost, stats, keywords).
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 *   - Imprint cards are gated to player progression; an early-game
 *     player only sees t1, a late-game player who has progressed
 *     through Epoch 2 sees up to t5. T5 art may reflect canon
 *     established by end of Epoch 2 but MUST NOT preview Acts 3-7.
 *   - In particular: Elara t5 art shows her as "the Ark's Voice"
 *     (post-upload, established Epoch 2 canon) but MUST NOT show
 *     her synchronizing with The Human (Act 6 confession beat).
 *   - Antiquarian t5 art shows him as the catalogue-keeper of "the
 *     twelve possible endings" (his established Epoch 2 archetype)
 *     but MUST NOT visually identify him as Daniel Cross / The
 *     Programmer reborn (Act 5+ reveal).
 */

import type { CardArtPrompt } from "./types";

const IMPRINT_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── ELARA (Senator-turned-Ship — Empress with a load balancer) ───
  // Source canon: Senator Elara Voss, pre-upload, delivered the
  // Atarion Concord war-vote speech ("We are the people who choose
  // not to die of the decision we just made"). Post-upload she became
  // the operating intelligence of the Inception Ark. Her mechanical
  // signature is heal + support. Faction: neutral (any deck).
  {
    cardId: "s1_imprint_elara_t1",
    sceneDelta:
      "Three-quarter painted portrait of Senator Elara Voss caught at a podium mid-breath, the Atarion Concord chamber receding into amber-lit gloom behind her. She wears a senator's tailored grey-and-cream robe, a single silver pin at her collar shaped like the Concord's twelve-rayed sun. Her hand rests flat on a parchment ballot half-rolled. She is looking just past the viewer's shoulder — an expression that reads as 'I have already made the calculation; the rest of you are catching up.' One warm pendant lamp from upper-right rakes her cheekbone. Mortal scale. No technology visible.",
    moodKeywords: [
      "civic gravitas",
      "weight before the vote",
      "compassion under arithmetic",
      "Caravaggio key-light",
    ],
    palette:
      "Inception-Ark neutral palette — cool ivory + amber pendant warmth + steel grey, single silver accent on the sun pin",
    composition:
      "Three-quarter podium portrait, eye-line at upper-third, parchment ballot in lower-third for visual weight",
    notes:
      "T1 = mortal pre-upload Elara. The viewer must believe this is a real woman who eats and sleeps and knows the names of her constituents. NO holographic glitch yet. The Ark is not in this frame.",
  },
  {
    cardId: "s1_imprint_elara_t2",
    sceneDelta:
      "Same Elara, post-vote — three years later by canon. Slightly older, jaw a little harder, the silver sun-pin replaced by a small Ark-silhouette badge. Standing in the Ark's first-built infirmary, a long ward of cryo cradles fading into soft blue twilight behind her. She is bent forward over one cradle, one hand on the glass, mouth shaped around a name we cannot hear. Faint blue cradle-light catches her face from below; the same warm pendant key-light from above. She has been mothering ten thousand strangers for a while now. Still mortal. Still organic.",
    moodKeywords: [
      "tender vigil",
      "cradle-light reverence",
      "the caretaker",
      "pre-grief",
    ],
    palette:
      "Inception-Ark neutral + cool cryo blue underlight + amber pendant warmth from above",
    composition:
      "Mid-shot bent over the cryo cradle, the cradle's curved glass forming a halo behind her head",
    notes:
      "T2 = early-Ark Elara. The cradle she is touching is canonically empty — the strangers have not yet been loaded. She does not know this yet; we, the viewer, do. Mood is reverence-without-cause.",
  },
  {
    cardId: "s1_imprint_elara_t3",
    sceneDelta:
      "Wide environment shot — the Ark in mid-orbit-roll, photographed from outside. The vessel's belly tilts to interpose between the camera and a distant hostile object (a sliver of red-violet light at the horizon). Soft glow from every cradle-window catches the hull underside. In a single bridge porthole near the prow, a small backlit human silhouette stands watching — Elara, mortal-still, but the gesture of the Ark's protective roll feels like her gesture extended into the geometry of the ship. The first frame in which woman and ship begin to share a single intent.",
    moodKeywords: [
      "interposition",
      "the Ark as Elara's outstretched hand",
      "deep-space hush",
      "watchful protection",
    ],
    palette:
      "Inception-Ark neutral hull grey + amber porthole warmth + a single distant red-violet threat-color in negative space",
    composition:
      "Three-quarter exterior hero shot of the Ark, Elara as a tiny but specifically-placed silhouette in one porthole",
    notes:
      "T3 = the moment Elara starts being-the-ship. NOT yet uploaded — she is still mortal in the porthole. The Ark's roll is canon Epoch 2 lore. Avoid any imagery that suggests a soul-merge or upload event; that's Act 6 territory.",
  },
  {
    cardId: "s1_imprint_elara_t4",
    sceneDelta:
      "Tight portrait of Elara — but the painted realism is now layered with translucent holographic scan-line texture across the right half of her face. Her left side is fully solid; her right side, the side closer to the camera, dissolves softly into translucent cyan-blue volumetric haze. Behind her, faintly, the bridge of the Ark in deep blue twilight. Her expression is still entirely Elara — same compassion, same arithmetic — but the medium has begun to forget it is paint. A faint forcefield shimmer-line traces along the boundary where flesh becomes hologram.",
    moodKeywords: [
      "becoming",
      "interface state",
      "the hand still warm but the voice now bigger",
      "forcefield resonance",
    ],
    palette:
      "Inception-Ark neutral + cyan holographic shimmer on the right half + amber key from upper-left holding the mortal half",
    composition:
      "Tight three-quarter portrait, lit asymmetrically so the holographic side reads as 'becoming' not 'corrupted'",
    notes:
      "T4 = upload-in-progress, Epoch 2 canon. The transition is voluntary and tender, not horror. Forcefield keyword is visible as a barely-there shimmer line, not a hard sci-fi shield.",
  },
  {
    cardId: "s1_imprint_elara_t5",
    sceneDelta:
      "Wide hero composition: the Ark's main hold rendered as a vast cathedral interior, parallax depth into mahogany alcoves and softly-lit cradle banks. At the centre, suspended at intersection-point with no visible support, a translucent holographic Elara stands at human scale but lit as if she is the room's own light source. Her form is fully holographic — cyan-shifted, scan-lined, faintly chromatic-aberration on her edges — but her face is rendered with the highest painted realism in the composition. Around her, faint amber motes drift upward from each cradle: passenger souls she has been listening to for ten thousand strangers' worth of time. She is mid-speech; the recording the Ark replays every anniversary plays from her now.",
    moodKeywords: [
      "the speech replays itself forever",
      "cathedral hush",
      "tenderness at galactic scale",
      "she did not stop being human; she became more careful",
    ],
    palette:
      "Inception-Ark neutral cathedral grey + cyan hologram core + warm amber cradle-motes ascending + a single soft pendant key-light from above-right",
    composition:
      "Wide cathedral interior; Elara centred but small relative to the room — the room IS her body; the camera is at floor level looking slightly up",
    notes:
      "T5 = legendary 'Elara, the Ark's Voice'. This is end-of-Epoch-2 canon. CRITICAL spoiler-line: she is alone in this composition — DO NOT include any second figure (no Human, no Programmer, no Watcher). The Two-Witnesses bond is Act 6+ canon.",
  },

  // ─── ANTIQUARIAN (catalogue-keeper of the twelve possible endings) ───
  // Source canon: A robed scholar who has lived enough cycles to
  // catalogue every ending the universe has tried so far. Charges
  // tuition no one wants to pay (memory in exchange for fact).
  // Mechanical: grow, rebirth — gets stronger the longer the game
  // runs. Faction: antiquarian (his namesake faction).
  {
    cardId: "s1_imprint_antiquarian_t1",
    sceneDelta:
      "Three-quarter portrait of a robed scholar bent low over a single open book on a scarred mahogany lectern. The book's pages are visibly thicker than the binding should hold — pages spilling over the edges, some interleaved with pressed leaves and folded scraps. He has not looked up. His face is mostly in shadow under a wide hood; only the firm line of his jaw and one ungloved hand catch the light. The hand holds a sharpened pencil mid-margin-note. Behind him, library shelves recede into amber dimness. No technology. No glow. Just a man and a book and a candle out of frame.",
    moodKeywords: [
      "scholarly patience",
      "the ending is already written",
      "amber library hush",
      "annotation mid-stroke",
    ],
    palette:
      "Antiquarian amber + parchment + temporal blue (the deep shadow has a faint blue cast)",
    composition:
      "Three-quarter scholar bent over the lectern, the book at lower-third filling visual weight, his face partly shadowed",
    notes:
      "T1 = mortal scholar, current Epoch 2 form. Hood + shadow keep his face indeterminate — this matters because his TRUE identity is an Act 5+ reveal. The shape of the face must not give it away.",
  },
  {
    cardId: "s1_imprint_antiquarian_t2",
    sceneDelta:
      "Closer in. The same scholar, same lectern, but now we see the page he is annotating: a tightly-handwritten margin in his own pencil, the original text faintly different (slightly darker ink, an older hand). His annotations are crossed and re-crossed; he is writing OVER his own earlier notes from a previous reading of this same page. A small disapproving tilt to his mouth — 'I had this wrong last time.' A leaf of pressed amber paper marks the page. The library behind him is very slightly dimmer than the T1 frame; the candle has burned a little.",
    moodKeywords: [
      "the rematch, corrected",
      "annotation upon annotation",
      "the Antiquarian disagreeing with himself",
      "tuition in error",
    ],
    palette:
      "Antiquarian amber + parchment + a single deeper temporal blue accent in the pressed leaf",
    composition:
      "Tighter mid-shot on hands + page; his face now partly visible but still not full-on",
    notes:
      "T2 = he is annotating a page he has read before. This is canon Epoch 2 — his cycle-memory is established. Still no spoilers about how he came to have cycle-memory.",
  },
  {
    cardId: "s1_imprint_antiquarian_t3",
    sceneDelta:
      "Pull back — he has stood up. Wide shot of the library: rows of tall shelves stretch into deep blue temporal haze, the perspective slightly wrong (one row recedes into a horizon-line that should not be there). The Antiquarian stands centre, one hand still resting on the open book on the lectern, the other extended, palm up — and on his palm, a faint glow of softly drifting amber motes (the rebirth keyword visualized as memory returning). His face is now visible in three-quarter profile but still hooded; we see his eyes, which are old in the way only certain books are old.",
    moodKeywords: [
      "rebirth as remembered fact",
      "library that is bigger than physics",
      "the amber memory cradled",
      "patient correction",
    ],
    palette:
      "Antiquarian amber + parchment + temporal blue depth-fog into the receding shelves",
    composition:
      "Wide library hero shot; Antiquarian centred but small relative to the shelves; one of his hands cradling the visible amber motes",
    notes:
      "T3 = 'grow + rebirth' visualized as cycle-memory cradled in his hand. The wrong-perspective horizon line on one shelf row is the first hint that his library exists outside time. Still no spoiler about WHO he was before he was the Antiquarian.",
  },
  {
    cardId: "s1_imprint_antiquarian_t4",
    sceneDelta:
      "Same library, same Antiquarian. He has turned a fresh page. On the new page (which the viewer reads only as suggestion, not literal text), the silhouette of the player-character is sketched in his pencil — a generic featureless silhouette, but unmistakably the player. He has drawn a single line across the silhouette: an annotation. The book on the lectern has visibly gotten thicker since the previous tier. His hood is back now; we see his full face in three-quarter — late-middle-aged man with neatly trimmed beard, eyes tired but intent. Above the lectern, a single faint amber memory-mote drifts up toward the ceiling and disappears (rebirth: a draw, on deploy).",
    moodKeywords: [
      "the next page is about you",
      "the book wrote itself thicker overnight",
      "draw-a-card as page-turn",
      "you are now an annotation",
    ],
    palette:
      "Antiquarian amber + parchment + a single new gold accent on the draw-a-card mote",
    composition:
      "Closer mid-shot of the lectern, Antiquarian now hood-down, the new page with the player-silhouette readable as suggestion only",
    notes:
      "T4 = he is reading the player. Powerful but still Epoch-2-safe — he is a SCHOLAR who knows you, not a god, not a former Programmer, not a cosmic reveal.",
  },
  {
    cardId: "s1_imprint_antiquarian_t5",
    sceneDelta:
      "The lectern is gone. The library is gone. The Antiquarian stands in a vast architectural space that is half-cathedral, half-orrery: above him, twelve faintly-glowing books rotate in a slow concentric orbit, each book a different binding, each book ajar to a different page. Around him at floor level, thousands of fallen leaves of pressed amber paper drift in a continuous shoulder-deep current — a sea of past annotations. He stands centre, hands at his sides, face fully visible — a man of late middle age, weathered, eyes the colour of aged parchment. He has stopped writing. He is looking directly at the camera. He is about to say something he is not sure he should say. Forcefield: a faint amber resonance traces a sphere around him, holding the leaves at bay. Grow + rebirth: the twelve books continue their patient orbit.",
    moodKeywords: [
      "the catalogue at scale",
      "twelve possible endings still in play",
      "the moment before the spoiler that he chose not to give",
      "amber forcefield as scholarly restraint",
    ],
    palette:
      "Antiquarian amber + deep temporal blue + a single soft gold ring of light at his sphere boundary",
    composition:
      "Wide cathedral-orrery shot; Antiquarian centred at human scale; twelve orbital books distinctly visible at upper-third; the leaf-current at lower-third",
    notes:
      "T5 = 'The Antiquarian, Ending-Cataloguer.' This IS end-of-Epoch-2 canon (his archetype is fully established). CRITICAL: his face must read as 'kind elder scholar,' not as anyone the player would recognize from elsewhere in the game. The Programmer/Antiquarian connection is Act 5+ reveal. Twelve books = the twelve catalogued endings, established lore. NOT thirteen, NOT the Witness count.",
  },

  // ─── IRON LION (Insurgency rally-figure, the fist already moving) ───
  // Source canon: The Insurgency was a rumor until the Iron Lion
  // showed up; afterward it was the shape of a fist already in
  // motion. Mechanical: provoke + rush + frenzy. He arrives — he
  // does not pace. Faction: insurgency.
  {
    cardId: "s1_imprint_iron_lion_t1",
    sceneDelta:
      "Wide low-angle hero shot at the perimeter of an Insurgency forward camp at dusk. The Iron Lion stands centre, mid-stride, weight forward, his greatcoat half-flared from the motion. His face is half-lit by a single flare-light from camera-right (gunmetal-blue cool, not warm). One gloved hand grips the strap of a shouldered rifle; the other is open, palm out — the body language of someone who has already committed to the charge. Behind him: the silhouette of the camp's perimeter wall, two sentries' heads turning at the sound of his roar. Above him: the first stars of evening over a low slate horizon. A faint signal-green telltale flickers on the rifle's optic.",
    moodKeywords: [
      "the charge already committed",
      "perimeter dusk",
      "gunmetal urgency",
      "the fist mid-flight",
    ],
    palette:
      "Insurgency slate blue + signal green telltale + gunmetal grey + encrypted-static texture in the perimeter wall",
    composition:
      "Wide low-angle hero, Iron Lion centred mid-stride, perimeter at lower-third, sky/stars at upper-third",
    notes:
      "T1 = the rumor has shown up. He is mortal, he is on the ground, he is moving. NO frenzy yet (that's t5). NO speech given yet. The camp behind him is still small.",
  },
  {
    cardId: "s1_imprint_iron_lion_t2",
    sceneDelta:
      "Mid-shot. The Iron Lion has stopped between two figures and the approaching thing. He is in three-quarter stance, body angled to interpose, one arm extended back to keep two younger Insurgency recruits behind him. We see his face fully now — weathered, late-thirties, a deliberate stillness in his eyes. He has not yet moved to fight; he is waiting until the threat commits. The recruits behind him are looking at HIM, not the threat — they've decided to follow whatever he does. Background: a half-collapsed civilian street in deep dusk, signal-green emergency-light flickering off broken windows. A small Insurgency-issue medallion on his collar (a clenched fist, intentionally crude).",
    moodKeywords: [
      "interposition",
      "the body becomes the wall",
      "earned trust",
      "still before motion",
    ],
    palette:
      "Insurgency slate blue + signal green emergency-glow on the broken windows + gunmetal greatcoat",
    composition:
      "Mid-shot three-quarter, Iron Lion centred and angled, two recruits visible past his shoulder, threat off-frame to camera-right",
    notes:
      "T2 = provoke keyword visualized. He is the literal wall between the recruits and what's coming. The threat is OFF-frame on purpose — he is the visual focus, not what he's fighting.",
  },
  {
    cardId: "s1_imprint_iron_lion_t3",
    sceneDelta:
      "Closer. Mid-arrival. The Iron Lion is mid-strike — left hand still extended back toward unseen allies, right hand bringing a broad-bladed combat knife around in the kind of arc that a body has only earned through repetition. His coat trails behind him like a slow flag. Above and behind him a faint sketch of the Insurgency rally-banner unfurled at half-distance (clenched fist + crossed dog-tags). His face is set — not snarling, not theatrical — the look of a man who has done this so often the choreography no longer requires anger. The strike is landing into off-frame; we see only the arc, not the impact. Signal-green telltales on his belt + on the banner. Slate-blue twilight ambient.",
    moodKeywords: [
      "rush as choreography",
      "the arc, not the impact",
      "earned violence",
      "rally-banner deep behind",
    ],
    palette:
      "Insurgency slate twilight + signal green telltales + gunmetal blade + a single warm rust-orange accent on the banner cloth",
    composition:
      "Tight mid-action, Iron Lion at upper-third caught mid-arc, banner mid-distance behind, allies implied off-frame left",
    notes:
      "T3 = provoke + rush. Action is in progress but the impact is out of frame — keeps the card readable + spoiler-safe (we don't show WHO he's fighting). Banner = canonical Insurgency rally symbol, established Epoch 2.",
  },
  {
    cardId: "s1_imprint_iron_lion_t4",
    sceneDelta:
      "He has just landed in the centre of an engagement and the camp around him has straightened. Wide composition: eight Insurgency fighters in the foreground arc, all of them are looking at him, all of them are RAISING their weapons in the same instant — the rally pulse he carries with him. Iron Lion is centred, face fully visible, expression unchanged from T3 (still that practiced stillness), but a subtle warm-amber rim-light has joined the cool gunmetal — the people next to him have remembered why they signed up. The signal-green telltales now glow brighter (their morale just spiked). Behind: the perimeter wall is now visibly larger, the Insurgency camp grown around him over time.",
    moodKeywords: [
      "rally as deployable weapon",
      "+2 power this turn",
      "the people next to him remember why",
      "earned warmth in the cold light",
    ],
    palette:
      "Insurgency slate + brighter signal green + a NEW warm amber rim-light suggesting morale spike + gunmetal blades",
    composition:
      "Wide composition, Iron Lion centred, eight allies in a foreground arc all turning toward him",
    notes:
      "T4 = the rally-buff visualized. The eight allies are anonymous — no recognizable named characters. NO Kael in this frame; NO Programmer; nobody that would force a future-spoiler. Iron Lion's expression stays mortal — he is not a god yet, just a leader.",
  },
  {
    cardId: "s1_imprint_iron_lion_t5",
    sceneDelta:
      "Hero composition at the founding moment. A large open square of an early Insurgency stronghold at the very moment the Iron Lion gives his first public roar. He stands centred on a low platform, weight on one foot, mouth open in a shout we cannot hear. The square is FILLED — hundreds of Insurgency fighters and civilians alike, all of them mid-raise of fists or weapons, the gesture rippling outward from him in concentric arcs. Above: a slate-blue dawn just breaking over the city's broken silhouette, the very first beam of warm light cutting diagonally across the square and landing on his shoulder. Frenzy: faint motion-blur ghost-images of him — three half-overlaid silhouettes of the same roar, captured a half-beat apart, suggesting the roar is not a single moment but a sustained inevitability. Provoke + rush implied by the geometry of the square: every body language vector points toward him AND outward toward an unseen enemy past the camera.",
    moodKeywords: [
      "founding moment",
      "the rumor becomes the shape of a fist",
      "frenzy as sustained inevitability",
      "first dawn over the broken city",
    ],
    palette:
      "Insurgency slate dawn + signal green crowd-glow + warm amber first-light from upper-right + gunmetal weapons",
    composition:
      "Wide hero panorama, Iron Lion small but visually centred on the platform, crowd radiating outward, dawn light vector picking him out",
    notes:
      "T5 = 'The Iron Lion, First Roar.' This is the founding-of-the-Insurgency moment, established Epoch 2 canon. CRITICAL spoiler-line: this is FIRST roar, not LAST. Do NOT show Veridian VI, do NOT show the helmet in the grass (Act 5+), do NOT show Kael as a mourner (Act 5 reveal). The frame is HOPE earning itself, not loss.",
  },

  // ─── AGENT ZERO (Insurgency's lethal infiltrator, the silhouette
  //     at the edge of memory, who stole Ark 1047 and was killed
  //     for it then brought back) ───
  // Source canon: she lifted Ark 1047 from Panopticon docking
  // without a single alarm; the Warlord killed her; the Insurgency
  // brought her back. She fights like someone with nothing left to
  // lose because she has been past it. Mechanical: stealth (shape
  // the opponent can't lock), eventually rush + ignore-armor.
  // Faction: insurgency.
  {
    cardId: "s1_imprint_agent_zero_t1",
    sceneDelta:
      "Three-quarter mid-distance composition. A silhouette in a hooded utility jacket at the edge of a maintenance corridor doorway, half-stepped forward — the doorway itself rendered with a faint chromatic-aberration ghost-line as if it materialized a moment ago. The silhouette has no readable face yet; only the lower edge of the jaw, the firm line of a mouth, and one gloved hand resting on the door's frame. The corridor behind her is grey-green emergency-lit, streaked with the kind of long shadows that come from someone who has been moving too fast for the cameras to catch up. A faint signal-green telltale on the gauntlet's wrist.",
    moodKeywords: [
      "the silhouette at the edge of memory",
      "the doorway that wasn't there a second ago",
      "lookaway training",
      "kept-quiet competence",
    ],
    palette:
      "Insurgency slate + signal green emergency telltale + gunmetal grey corridor + a single rust-orange accent on a far doorframe sign",
    composition:
      "Mid-distance three-quarter, Agent Zero half-emerging from the doorway at upper-right third, corridor receding camera-left",
    notes:
      "T1 = mortal Agent Zero, pre-stealth-keyword. Face is intentionally indeterminate — keeps her readable as 'the shape that moves before you see her.' No tactical weapon visible; that escalates with tier.",
  },
  {
    cardId: "s1_imprint_agent_zero_t2",
    sceneDelta:
      "Tighter mid-shot. We see her face now in three-quarter — late-twenties, sharp-eyed, deliberately unmemorable features (the kind of face designed to be forgotten in a crowd). Her hood is half-down. She is mid-step on a catwalk over a grey industrial pit. Behind her, a cluster of three security cameras visibly track in the WRONG direction — they have all just turned to follow a sound she made elsewhere a half-second earlier. A faint signal-green afterimage trails her shoulder (the previous beat of her motion still half-visible). Stealth visualized: the cameras' attention is the wrong attention.",
    moodKeywords: [
      "stealth as taught misdirection",
      "the look-away masterclass",
      "the previous beat still half-visible",
      "deliberately forgettable",
    ],
    palette:
      "Insurgency slate + signal green afterimage trail + cool grey camera-eye-glow on the wrong axis",
    composition:
      "Mid-shot on catwalk, Agent Zero in centre-foreground, three mis-tracking cameras at upper-third forming a visual triangle pointing AWAY from her",
    notes:
      "T2 = stealth-1-turn keyword. She is the SUBJECT, the cameras' tracking is the EVIDENCE the stealth works. Kept tight; no reveals.",
  },
  {
    cardId: "s1_imprint_agent_zero_t3",
    sceneDelta:
      "Action mid-strike. Agent Zero is mid-air, dropping from above into a small tactical engagement, twin blades extended. Her form is rendered with TWO faint after-images trailing behind her — last-week's move and last-month's move both half-visible in slate-blue ghosting. Below her, three Panopticon enforcers are still looking the wrong direction (one toward where she WAS half a second ago). A signal-green muzzle-flash glow from one enforcer's rifle pointed AT NOTHING — they fired at where she had been. Stealth-2-turns + reveals-when-she-strikes visualized as the converging moment all three after-images collapse into the present strike.",
    moodKeywords: [
      "two motion-ghosts converging into present",
      "the moves she would have made last week",
      "the muzzle flash at empty air",
      "earned lethality",
    ],
    palette:
      "Insurgency slate + signal green telltale + a single warm rust-orange muzzle-flash AT empty space (visual irony)",
    composition:
      "Vertical descending action, Agent Zero at upper-third mid-fall, two motion-ghost trails at upper background, three off-target enforcers at lower-third",
    notes:
      "T3 = stealth-2 + reveals-on-strike. The motion-ghosts are the tier escalation — she's now visibly out of the linear timeline that the enforcers are working in.",
  },
  {
    cardId: "s1_imprint_agent_zero_t4",
    sceneDelta:
      "Static composition this time — Agent Zero standing at the centre of a small tactical brief, surrounded by a half-circle of Insurgency operatives studying a holographic map projected from the table between them. She is the only one who is not looking at the map. She is looking past the camera, at something none of the others can see yet. Her face is fully visible now; her eyes carry the kind of attention that has been trained on three timelines at once. Her armour is sparse — practical plate over a dark long-sleeve, no insignia (she is not anybody's symbol). Stealth-3-turns + ignore-3-armor visualized as a faint slate-blue shimmer-aura around her, hexagonal, reading as 'she is currently being unsearched for in three different scanning systems.'",
    moodKeywords: [
      "three timelines at once",
      "no insignia, never the symbol",
      "the unsearched-for shimmer",
      "tactical stillness",
    ],
    palette:
      "Insurgency slate + signal green map-glow on the surrounding faces + cool gunmetal armour + a single warm pendant lamp upper-right",
    composition:
      "Mid-shot tactical-brief, Agent Zero centred but turned away from the group, looking past camera",
    notes:
      "T4 = stealth-3 + armor-pierce. The composition keeps her UNALIGNED with the rest of the group — she leads by being three moves ahead, not by pulling rank. Her face stays sharp + present-tense; we are NOT showing her as someone who has died yet (that's t5 territory).",
  },
  {
    cardId: "s1_imprint_agent_zero_t5",
    sceneDelta:
      "Hero composition: she is mid-stride down the boarding ramp of Ark 1047 itself, the docked Panopticon hangar around her receding into deep grey distance, every alarm light on the hangar's far wall visibly OFF — she has crossed the entire docking layer without raising one. She is alone in the foreground. The Ark behind her is tilted at the angle of a vessel in the act of stealing itself away. A single warm amber light from the Ark's open hatch frames her in halo. Her jacket is the same utilitarian dark of all previous tiers but a faint resurrection-bloom of soft white light hangs at her shoulder-blades — a halo of return. Rush implied by stride. Stealth-3 implied by the unalarmed hangar. Ignore-armor implied by a Panopticon enforcer in the mid-background frozen in the middle of a draw, his armour visibly cracked at the seam where she has already passed and made her decision.",
    moodKeywords: [
      "the heist that made her name",
      "the resurrection halo at her back",
      "stolen ark, stolen breath",
      "nothing left to lose because she has been past it",
    ],
    palette:
      "Insurgency slate hangar + warm amber Ark-hatch halo behind her + signal green Ark cockpit telltales + a soft resurrection-white bloom at her shoulders",
    composition:
      "Wide hero, Agent Zero mid-stride at lower-third foreground, Ark 1047 mid-distance receding, frozen enforcer at mid-background camera-right",
    notes:
      "T5 = 'Agent Zero, The First Strike' — the heist that made her name + the resurrection that returned her. End-of-Epoch-2 canon. CRITICAL: do NOT show the Warlord killing her in this frame; the death + revival is BACKSTORY at this tier, not the narrative beat. The resurrection-bloom is intentional but subtle — not religious, not theatrical.",
  },

  // ─── AKAI SHI / 赤死 (the Red Death — Architect's silent removal
  //     asset for problems the surveillance layer doesn't want on
  //     its own camera feed) ───
  // Source canon: a silhouette in a red coat at the edge of a doorway
  // that was not there a second ago. Backstab + celerity + pierce.
  // The Architect's preferred deletion vector when public records
  // need to stay clean. Faction: architect.
  {
    cardId: "s1_imprint_akai_shi_t1",
    sceneDelta:
      "Wide composition, deep shadow. A maintenance corridor in a Panopticon black-site, deep night, single overhead bulb. A red coat — the only saturated colour in the frame — half-visible at the edge of a door-frame on camera-right. The figure inside the coat is silhouetted, no face, only the line of the coat's cut and one black-gloved hand resting flat on the door's surface. The door is open by maybe four inches. Behind the door (where we cannot see) is implied light; in front of the door (where we can) is the corridor's flat fluorescent grey. The coat IS the visual event of the frame. Everything else is subtraction.",
    moodKeywords: [
      "the red coat as visual punctuation",
      "the doorway not there a second ago",
      "subtractive composition",
      "Architect-quiet menace",
    ],
    palette:
      "Architect deep crimson coat (#ef4444) as the ONLY saturated colour + black steel + chrome + fluorescent grey corridor + a single silver glint on the door-handle",
    composition:
      "Wide corridor in deep perspective, the red coat at upper-right third, the rest of the frame deliberately empty",
    notes:
      "T1 = the silhouette. Not yet armed (visibly). Not yet in motion. The threat is the coat being THERE at all — a corridor that previously did not contain a red coat now does. Architect aesthetic: brutalist quiet, not theatrical horror.",
  },
  {
    cardId: "s1_imprint_akai_shi_t2",
    sceneDelta:
      "Mid-shot. Akai Shi has stepped fully through the door; we see him in three-quarter from BEHIND a target who has not yet realized he is there. The target (a generic Panopticon analyst-silhouette, no recognizable identity) faces away, shoulders bent over a console. Akai Shi's red coat is mid-flare from the motion of stepping forward. His face is partially turned to camera but mostly shadowed under a wide-brimmed dark hat — we see the firm line of a jaw, nothing more. One gloved hand has just drawn a curved short blade from inside the coat; the blade is still rising. The target has not turned. The target is half a second from becoming aware. Backstab keyword visualized as the geometry of the moment: he is approaching from EXACTLY the angle the analyst is not facing.",
    moodKeywords: [
      "backstab as geometric inevitability",
      "the half-second before awareness",
      "the curved blade rising, not landing",
      "professional, never theatrical",
    ],
    palette:
      "Architect deep crimson coat + black steel hat + a single chrome glint on the blade + cool computational console-light on the target's far side",
    composition:
      "Mid-shot from over the analyst's near shoulder, Akai Shi at upper-right third mid-step, blade rising at lower-third",
    notes:
      "T2 = backstab. The target is anonymous — never a recognizable named character. The blade is RISING (not landed) so the moment is forever-suspended; this matters because Akai Shi the card represents the threat-state, not the kill itself.",
  },
  {
    cardId: "s1_imprint_akai_shi_t3",
    sceneDelta:
      "Action peak. Akai Shi is mid-twin-strike: two faint motion-ghost duplicates of himself bracket the present-Akai-Shi from camera-left and camera-right, his red coat fanned in three slightly-different positions captured a half-beat apart. Twin curved short blades both extended, each blade landing into off-frame space at lower-left and lower-right respectively — celerity visualized as two simultaneous attacks from different angles by the same body. The space between the three motion-ghosts is filled with thin slate-grey afterimage haze. Floor: a single drop of crimson-tinted fluid mid-fall, suggesting an impact moment but not depicting one. His face: half-turned to camera-left, half-shadowed, expression entirely neutral.",
    moodKeywords: [
      "celerity as two strikes from one body",
      "the motion-ghost trinity",
      "the drop mid-fall (impact implied, not shown)",
      "Architect-grade economy",
    ],
    palette:
      "Architect deep crimson + chrome blade-glints + slate-grey afterimage haze + a single crimson droplet held mid-fall",
    composition:
      "Centred action triptych — three Akai Shi positions across the horizontal, blades at extreme outer angles",
    notes:
      "T3 = backstab + celerity. The motion-ghost technique echoes Agent Zero t3 (intentional — both are stealth-class operatives) but Akai Shi's ghosts are LATERAL (parallel-strike) where Agent Zero's were TEMPORAL (past-week / past-month). Different stealth language for different factions.",
  },
  {
    cardId: "s1_imprint_akai_shi_t4",
    sceneDelta:
      "Static. Akai Shi standing on a low rooftop in Panopticon black-site district at night, the city lights below him reduced to slate-blue grid pattern, the moon a featureless grey disc. His red coat is the only saturated thing in the frame. Twin blades sheathed at his hips, both hands resting on their pommels. His face is fully visible now in three-quarter — late-thirties, deliberately featureless features (the kind of face the Architect's surveillance layer scrubs from training data so the layer cannot accidentally recognize him on its own feeds). He is not looking at any specific thing; he is the kind of stillness that comes from being deployed and waiting for the order. Rush-on-deploy implied by the rooftop-arrival composition (he just got here; he is not yet at work).",
    moodKeywords: [
      "the stillness of a deployed asset",
      "scrubbed-from-training-data face",
      "rooftop wait",
      "twin blades at rest",
    ],
    palette:
      "Architect deep crimson coat + black steel hat + slate-blue city below + a single cool moon disc + chrome pommel glints",
    composition:
      "Three-quarter standing portrait on rooftop, city as low-third grid backdrop, moon at upper-left, Akai Shi centred",
    notes:
      "T4 = backstab + celerity + rush-on-deploy. Composition deliberately inverts t1-t3 — those were ABOUT to happen / IN motion. T4 is the period between contracts. The 'scrubbed-from-training-data' note matters: established Architect canon (the surveillance layer literally does not know how to see him) but rendered as unmemorable face geometry, not as a special effect.",
  },
  {
    cardId: "s1_imprint_akai_shi_t5",
    sceneDelta:
      "Hero composition: Akai Shi mid-flight across a vertical gap between two skyscrapers in the Panopticon central district, twin blades extended like a cross-shape across his body, red coat fanned to its absolute extreme, the coat's spread filling the upper third of the frame like a single saturated wound across the slate-grey city. His face is partly visible under the hat brim — eyes closed, the small smile of a craftsman mid-execution of a piece they know is going to land. Below him: a drop of forty stories, a mid-level sky-bridge passing under his trajectory, three Panopticon enforcers on the bridge looking the wrong way. Pierce visualized as a faint chromatic-aberration line trailing each blade-tip — the strike will go through whatever it lands in. Celerity + backstab + pierce reading as a single inevitability.",
    moodKeywords: [
      "the saturated wound across the slate sky",
      "craftsman mid-execution",
      "pierce as chromatic-aberration trail",
      "the kind of art that gets a city quieter for a week",
    ],
    palette:
      "Architect deep crimson coat at MAXIMUM saturation + slate-grey city + cool moonlight + chromatic-aberration cyan-magenta blade trails",
    composition:
      "Vertical hero composition — Akai Shi at upper third mid-leap, the city receding into fortieth-story drop below, two skyscraper edges framing left and right",
    notes:
      "T5 = 'Akai Shi, The Red Death.' End-of-Epoch-2 canon. The 'three enforcers looking the wrong way' is consistent with his canonical effect on the surveillance layer. CRITICAL spoiler-line: do NOT visually identify Akai Shi as anyone the player knows from another card or another faction. He is a HIRED hand for the Architect, not a former friend, not a hidden identity. His face must not match any other card's face.",
  },

  // ─── FOUCAULT (the reader who built the surveillance layer he is
  //     now reading; the man with the schedule of glances in his
  //     inside pocket) ───
  // Source canon: A New Babylon archivist who wrote the theory the
  // Babylonians built their surveillance state from — but the
  // Babylonians never read past the abstract. He keeps a copy with
  // footnotes they would have needed. Mechanical: dispel + stealth
  // (he installed the blind spots himself). Faction: new_babylon.
  {
    cardId: "s1_imprint_foucault_t1",
    sceneDelta:
      "Three-quarter mid-shot of a slim man in his late forties seated at a long oak reading-table in a New Babylon archive. He is in unornamented archivist's robes — black wool, a single small pewter pin at the lapel shaped like a fountain pen nib. His face is studious, kind in the way readers are kind, gold half-moon spectacles riding low on his nose. He is mid-page-turn in a thick clothbound manuscript open before him, one finger tracking down the margin where his own pencil has annotated a previous reading in his own hand. Behind him, the archive's spine-shelves recede into amber lamplight; on the far wall, faintly, a closed-circuit surveillance camera tilts in his direction — and visibly malfunctions, panning past him without registering him. He is not in any of the logs because he built the logs.",
    moodKeywords: [
      "the kindness of readers",
      "the camera mis-registering",
      "annotated against himself",
      "amber-lamp archive hush",
    ],
    palette:
      "New Babylon gold + obsidian + crystal blue + amber lamp warmth + a single pencil-grey accent on his annotation",
    composition:
      "Three-quarter seated portrait at the reading table, manuscript at lower-third filling visual weight, recede-shelves behind, malfunctioning camera in upper-right far background",
    notes:
      "T1 = mortal Foucault, the kind reader. The malfunctioning camera is the visual evidence of the lore beat — quiet, not theatrical. His face is fully visible because the camera-blind-spot is what's hidden, not him.",
  },
  {
    cardId: "s1_imprint_foucault_t2",
    sceneDelta:
      "Mid-shot. Foucault is standing now in front of a wall of New Babylon surveillance feeds, dozens of small monitors patched together into a flickering mosaic that lights his face from below in cool blue. He has a red pen in his right hand and is mid-stroke — drawing a single decisive red line through a rectangular surveillance-tag overlay floating in mid-air in front of him (the buff-icon visualized as a ghostly Babylon-bureaucratic stamp). His other hand holds the open manuscript braced against his hip, finger marking the page. The tag he is crossing out is reading 'STATUS: TRACKED' in bureaucratic Babylon-script. His expression is mildly disapproving — the look of an editor catching a typo.",
    moodKeywords: [
      "dispel as red-pen correction",
      "the editor catching the bureaucratic typo",
      "cool monitor underlight",
      "mild scholarly disapproval",
    ],
    palette:
      "New Babylon obsidian + cool monitor-blue underlight + a single SATURATED RED on the pen and the corrected line + amber pocket-warmth on the manuscript",
    composition:
      "Mid-shot front-three-quarter, Foucault centred, monitor wall behind filling middle background, surveillance-tag overlay at upper-right within his arm's reach",
    notes:
      "T2 = dispel keyword visualized as the red-pen correction. The 'STATUS: TRACKED' tag is the BUFF being dispelled, intentionally rendered as a Babylon-bureaucratic artifact (canon-true for New Babylon faction aesthetic). NOT a magical effect — Foucault dispels by pointing out the paperwork is wrong.",
  },
  {
    cardId: "s1_imprint_foucault_t3",
    sceneDelta:
      "Wide-environment shot. A long Babylonian corridor with surveillance cameras mounted at regular intervals, every camera turned slightly the WRONG way — they are all watching a piece of empty floor twenty paces from where Foucault is actually standing. Foucault is centred in the corridor, facing camera, manuscript under one arm, his other hand holding the red pen LOWERED at his side (he is not currently correcting anything; he is just walking through the blind spot he made). On the floor at his feet, almost invisible, a small chalked X marking 'install date 2 years ago' in his own annotation hand. The camera at the far end of the corridor visibly malfunctions as he passes under it — panning without registering. Stealth visualized as deliberate calm; he is not hiding, the corridor is just structurally unable to see him.",
    moodKeywords: [
      "the blind spot installed two years ago",
      "the chalked install-date annotation",
      "structural unseeability",
      "scholarly walk through the gap",
    ],
    palette:
      "New Babylon obsidian + cool surveillance-blue camera-eye glow at the wrong axis + amber lamp pools at corridor mid-points + a single chalk-white accent at his feet",
    composition:
      "Symmetrical centred corridor in deep one-point perspective, Foucault at mid-distance walking toward camera, cameras visibly mis-tracking",
    notes:
      "T3 = dispel + stealth-1. Different stealth language from Agent Zero (her stealth is speed) and Akai Shi (his is unmemorability). Foucault's stealth is INFRASTRUCTURE — he installed the blind spot, then walks through it on schedule. Established New Babylon canon.",
  },
  {
    cardId: "s1_imprint_foucault_t4",
    sceneDelta:
      "Mid-shot. Foucault is in a cool-grey Babylonian audit chamber, seated at one end of a long polished obsidian table. Across from him, three Babylon adjudicators in full bureaucratic regalia (gold-trimmed black robes, scaled-justice pin) are visibly attempting to read a folio of papers — but the folio's pages are fluttering as if a small wind is moving them. Foucault is sitting with his manuscript open on the table in front of him, one hand resting on the open page; the other hand is raised barely, palm down, as if calming a restless dog. The page he is touching has the bureaucratic stamp 'BUREAU OF HONEST DECLARATIONS' visible in his annotated margin — and the adjudicators across from him cannot find their place in their own folio. Stealth-2 visualized: he carries a copy of the schedule of glances, the adjudicators are not in any of his footnotes today.",
    moodKeywords: [
      "the schedule of glances in his pocket",
      "the calming hand to the restless dog",
      "they cannot find their place",
      "audit-chamber stillness",
    ],
    palette:
      "New Babylon obsidian + gold adjudicator regalia + cool grey audit chamber + a single warm amber lamp on Foucault's manuscript",
    composition:
      "Three-quarter audit-chamber composition, Foucault camera-left in foreground, three adjudicators camera-right in mid-distance",
    notes:
      "T4 = dispel + stealth-2. The fluttering folio = the adjudicators losing their place. Foucault is OUT OF SCHEDULE today; their glance-routine had no entry for him at this hour. Dramatized with quiet humour, not menace — Foucault is amused, not predatory.",
  },
  {
    cardId: "s1_imprint_foucault_t5",
    sceneDelta:
      "Hero composition. Foucault standing alone at the centre of a vast Babylonian rotunda — a circular hall ringed by tiered galleries of surveillance monitors, every monitor displaying a different angle of every other monitor (the recursive panopticon). He is at the precise centre of the rotunda's marble floor, manuscript spread open on a low reading-pedestal in front of him, one hand resting on the page, the other extended out as if delivering a quiet lecture. The faintest trace of his own handwriting (his footnotes on the surveillance theory the Babylonians built this rotunda from) drifts in the air as floating amber text-fragments around him — visible to us, invisible to the system. Every monitor in the gallery wall is freezing into a still frame at the same moment — the silence of the enemy general. His face: late fifties now, the kind of stillness that comes from outliving most of his arguments. Half-smile of the man who finally gets to read the footnote aloud.",
    moodKeywords: [
      "the recursive panopticon centred",
      "footnotes drifting like amber leaves",
      "the silence at the same moment across every monitor",
      "the man who outlived his own theories",
    ],
    palette:
      "New Babylon obsidian + gold gallery trim + cool monitor-blue (now frozen-still across the entire wall) + warm amber pedestal-lamp + a single saturated red where his pen rests on the manuscript",
    composition:
      "Wide rotunda hero shot, Foucault centred at the floor's exact centre, gallery rings receding upward, monitors filling middle band of the frame",
    notes:
      "T5 = 'Foucault, Schedule of Glances.' End-of-Epoch-2 canon. The frozen monitors = silence-the-enemy-general visualized at the level of the surveillance state itself. CRITICAL spoiler-line: do NOT show any other named character on the frozen monitors (no Watcher reveal, no Programmer, no anyone-recognizable). Each monitor frame is generic Babylon footage. The half-smile is amused, never triumphalist.",
  },

  // ─── LOCKE (the Last Adjudicator — the jurist who rules by
  //     consent, the hardest way) ───
  // Source canon: A tired figure in a jurist's coat at a desk that
  // has been tidy longer than the player has been alive. He stands
  // between the harm and the people who did not ask for the harm.
  // He is on the clock, the whole clock, every clock. Mechanical:
  // provoke + heal + forcefield + silence. Faction: new_babylon
  // (but adjudicating it from inside, not enforcing it).
  {
    cardId: "s1_imprint_locke_t1",
    sceneDelta:
      "Mid-shot of Adjudicator Locke at his desk. Late sixties, white hair pulled back, tired-but-intent eyes, jurist's robe in unornamented charcoal grey with thin gold piping at the cuff. The desk is OBSESSIVELY tidy: one fountain pen aligned exactly parallel to a blotter, a single hardcover lawbook closed at the right edge, a brass desk-lamp casting a tight pool of warm light over his folded hands. No papers visible — he has already done the day's reading. Behind him, a tall window of leaded glass shows a New Babylon evening skyline, gold towers at distance. He is looking past the camera at something tired and old. He has been on the clock for a very long time.",
    moodKeywords: [
      "the desk that has been tidy longer than you have been alive",
      "tired-but-intent",
      "the clock, the whole clock, every clock",
      "warm pool of jurist-lamp",
    ],
    palette:
      "New Babylon obsidian + gold tower-skyline behind + jurist's charcoal robe + warm amber desk-lamp pool + a single brass accent on the pen",
    composition:
      "Mid-shot front-three-quarter at the desk, hands folded in lower-third, leaded window with skyline framing upper background",
    notes:
      "T1 = mortal Locke, the rest-state. He is the Adjudicator BEFORE the harm arrives. The desk's obsessive tidiness is itself the lore beat — he keeps the room ready because the next case is always coming.",
  },
  {
    cardId: "s1_imprint_locke_t2",
    sceneDelta:
      "Mid-shot. Locke is on his feet now, between the camera and a small group of frightened civilians huddled to camera-left in a Babylon street-corner. He is in three-quarter profile, body angled to interpose, his jurist's robe partially blown back by the wind from the street. One hand is raised, palm-out, toward an off-frame approaching threat at camera-right. His other hand is held back behind him, palm down — the calming gesture toward the civilians (you do not need to do anything; I am on this). His face shows no fear, only a deep tired patience. The civilians' faces are anonymous and grateful in the way people are grateful for rules they did not have to invent. Provoke visualized as Locke being the literal wall.",
    moodKeywords: [
      "between the harm and the people who did not ask for it",
      "the calming hand to the people behind him",
      "the raised hand to the harm in front",
      "tired patience as currency",
    ],
    palette:
      "New Babylon obsidian + cool grey street + warm pool of distant Babylon lamp behind civilians + a single saturated rust-orange threat-glow off-frame camera-right",
    composition:
      "Mid-shot three-quarter, Locke centred and angled, civilians camera-left in lower-third, threat off-frame camera-right",
    notes:
      "T2 = provoke. Locke deliberately echoes Iron Lion t2 (also provoke / interposition) but the visual language is INVERTED: Iron Lion arrives in motion, Locke is already standing. Same gesture, different temperament. Faction-aesthetic distinction.",
  },
  {
    cardId: "s1_imprint_locke_t3",
    sceneDelta:
      "Wider mid-shot. Locke is mid-stride INTO an off-screen Babylon adjudicator's chamber, robe trailing, one hand carrying his closed lawbook held flat to his chest, the other extended forward in an open-palm gesture of calm. Through the doorway he is approaching, warm amber light spills out — and a wounded figure (anonymous, generic civilian, on the chamber's floor) is partially visible at the threshold. Behind Locke, the harm has been resolved off-frame — a faint dispersing dust-haze through which we can see the corner he just came from. He is bringing himself to the room because the room needs him. Heal-on-deploy visualized as the warm amber spill from the doorway: he is the source of the room being healthier, but only because he is in the room.",
    moodKeywords: [
      "the room is healthier for having him in it",
      "but he is not healthier for being in the room",
      "doorway warmth",
      "the closed lawbook held to the chest",
    ],
    palette:
      "New Babylon obsidian + warm amber doorway-spill + jurist's charcoal + a single warm gold on the lawbook's spine",
    composition:
      "Mid-shot three-quarter from behind Locke at lower-third, doorway at upper-third, anonymous wounded figure at threshold mid-distance",
    notes:
      "T3 = provoke + heal-on-deploy. The wounded figure is anonymous on purpose — Locke heals NEED, not preference. The dispersing dust behind him gestures at the resolved harm without depicting it (kept readable + spoiler-safe).",
  },
  {
    cardId: "s1_imprint_locke_t4",
    sceneDelta:
      "Static composition. Locke is standing in a cool grey Babylon adjudicator's high chamber, behind a tall pulpit-style judge's bench in the centre-back of the frame. The chamber's walls are panelled in dark obsidian inlaid with gold scales-of-justice motifs. He is mid-gavel — the wooden gavel raised exactly above its strike-block, frozen at the apex, about to come down ONCE. Around him, a faint hexagonal forcefield-shimmer envelopes the bench and the open space immediately in front of it (forcefield keyword). His face is set; the ruling has already happened in his head. The chamber is otherwise empty — no defendants, no accusers, no witnesses. The gavel coming down is the chamber's only sound. The gavel has been quiet for a long time. This is the turn it comes down once.",
    moodKeywords: [
      "the gavel raised at apex",
      "the chamber empty except for ritual",
      "forcefield as the form of jurisdiction",
      "the ruling already complete in his head",
    ],
    palette:
      "New Babylon obsidian chamber + gold scales-of-justice inlay + cool grey high-window light + warm amber pendant-lamp on the bench + cyan forcefield-shimmer around the bench",
    composition:
      "Wide chamber composition, Locke at upper-third behind the bench, gavel at frame's vertical axis, forcefield-shimmer as faint hexagonal halo",
    notes:
      "T4 = provoke + forcefield + heal-4. The empty chamber emphasizes JURISDICTION ITSELF as the keyword being visualized — Locke does not need bodies in front of him for the ruling to take effect. Powerful but Babylon-faction-quiet, never theatrical.",
  },
  {
    cardId: "s1_imprint_locke_t5",
    sceneDelta:
      "Hero composition. Locke standing in the centre of a vast Babylon plaza at night, the plaza ringed by the gold towers of New Babylon's central district. Around him, in a perfectly orderly silent ring, a crowd of anonymous Babylonians stands shoulder-to-shoulder, all of them with their right hand raised, palm forward, in the canonical Babylon gesture of CONSENT. Locke is at the exact centre of the ring, lawbook held flat against his chest in both hands, head bowed slightly as if accepting a weight. Above him, the moon — but the moon is faintly cracked along one face (the New Babylon canon visual that 'consent is the hardest way to govern, and there are so few who can do it'). Soft warm amber light from the towers' ground-level windows pools at every consenter's feet. Forcefield as a wide hexagonal nimbus extending outward from him through the entire plaza. Silence-the-enemy-general visualized as the absolute hush of a thousand standing people who do not need to speak because Locke has already heard them.",
    moodKeywords: [
      "consent as the hardest way",
      "the silent ring of raised palms",
      "the cracked moon as the price of ruling well",
      "the hush of being already heard",
    ],
    palette:
      "New Babylon obsidian plaza + gold tower-window pools + cracked-moon cool grey above + warm amber halo on Locke + the faintest hexagonal cyan forcefield extending outward",
    composition:
      "Wide plaza hero composition, Locke at exact centre, crowd-ring filling middle band, towers framing upper third, cracked moon at upper-third focal accent",
    notes:
      "T5 = 'Locke, the Last Adjudicator.' End-of-Epoch-2 canon. The cracked moon is canonical New Babylon imagery for 'the cost of governing by consent.' CRITICAL spoiler-line: the 'last' in the title refers to his being the final practitioner of consent-based jurisprudence in a New Babylon that has otherwise abandoned it — NOT to any specific Acts 3-7 reveal about who replaces him. The crowd is anonymous; do NOT include any recognizable named character.",
  },

  // ─── THE ARCHITECT (Prior Cause — the terrain you are trying to
  //     build on, and the terrain was here first) ───
  // Source canon: A tall silhouette in a perfectly symmetric coat;
  // the face is not the point. He does not fight for attention; he
  // redirects it the way a satellite moves when a planet asks it
  // to. Mechanical: provoke + grow + forcefield + silence.
  // Faction: architect.
  // SPOILER NOTE: The Architect's *true face / origin* (Daniel Cross
  // connection, Programmer-Architect duality, the Convergence
  // chord) are Acts 5-7 reveals. End of Epoch 2 canon: he is the
  // Empire's prime architect, the Panopticon's designer, the cold
  // computational presence at the centre of the AI empire. His
  // FACE has never been shown in canon at this point.
  {
    cardId: "s1_imprint_the_architect_t1",
    sceneDelta:
      "Wide hero composition. A tall figure stands centred in a vast Panopticon hall, half-distance, in a perfectly symmetric long coat that falls to mid-shin in a single unbroken vertical line. The hall is brutalist industrial — black steel ribs, chrome tile floor, deep crimson light bleeding from horizon-line ducts at floor and ceiling. The figure's face is in deep shadow under a high collar; we see only the line of the jaw and one black-gloved hand resting flat at his side. The composition is RIGOROUSLY symmetric — every architectural element on camera-left mirrors something on camera-right, and the figure is exactly on the vertical axis. He is not posed, not stylized; he is centred because the room was built around him. He has not moved.",
    moodKeywords: [
      "the face is not the point",
      "rigorous symmetry as identity",
      "brutalist hall around the centre",
      "deep crimson horizon-bleed",
    ],
    palette:
      "Architect deep crimson + black steel + chrome silver + a single horizon-bleed of saturated red top and bottom",
    composition:
      "Wide rigorously-symmetric hall, the Architect at the exact vertical axis at mid-distance, hall framing camera-left and camera-right in perfect mirror",
    notes:
      "T1 = the silhouette as event. CRITICAL spoiler-discipline: the Architect's face MUST NOT be visible in T1. The face is gated to Acts 5-7 reveal sequence. We see him at scale and at distance, never at portrait close. The shadow on his face is ABSOLUTE — not even a hint of feature.",
  },
  {
    cardId: "s1_imprint_the_architect_t2",
    sceneDelta:
      "Mid-shot. The Architect has half-turned in the same Panopticon hall — three-quarter from the back, his coat's symmetric vertical line now angled. We see, behind him at mid-distance, a small group of Panopticon agents bowed in a coordinated half-step, their attention all rotating in the same instant toward a corner of the hall the Architect has gestured at with a barely-raised right hand. He has not spoken. He has not visibly moved. The agents have already redirected. Provoke visualized as the redirect of attention: he does not fight for it, he MOVES it, and it goes the way a satellite moves when a planet asks it to. His face still hidden under the high collar.",
    moodKeywords: [
      "the redirect of attention",
      "the satellite obeying the planet",
      "the barely-raised hand",
      "compliance without speech",
    ],
    palette:
      "Architect deep crimson + black steel + chrome silver + cool computational console-glow on the agents' faces",
    composition:
      "Mid-shot three-quarter from the back, Architect at upper-right third, agents at lower-left mid-distance",
    notes:
      "T2 = provoke. Same keyword as Iron Lion t2 / Locke t2 but THIRD distinct visual language: Iron Lion is interposition-by-body, Locke is interposition-by-stance, Architect is provocation-by-gravity. Established Architect canon. Face still hidden.",
  },
  {
    cardId: "s1_imprint_the_architect_t3",
    sceneDelta:
      "The Architect has grown. Composition: wide low-angle hero shot. He stands centred in a Panopticon plaza at night, but the camera is at floor level looking up; he fills the frame's vertical extent. His coat is now visibly larger — not just longer, but architecturally LARGER, as if the coat is itself a small building. His face still hidden under the high collar but the collar's edge is now noticeably higher (he has accumulated more shadow). The horizon behind him is a wide sweep of Panopticon towers all leaning very slightly inward toward him — a perspective shift that should not be physically possible but reads as 'the city has begun to consider him its centre of gravity.' Grow visualized as architectural tier escalation: he gets larger on turns the opponent was hoping he would be getting smaller.",
    moodKeywords: [
      "the city leaning toward the centre of gravity",
      "the coat as small building",
      "growth that should not be possible",
      "the patient accumulation of shadow",
    ],
    palette:
      "Architect deep crimson + black steel + chrome + the towers behind him in cool computational blue + a single warm crimson horizon-line",
    composition:
      "Wide low-angle hero, camera at floor level, Architect filling vertical extent of frame, towers leaning subtly inward in perspective trick",
    notes:
      "T3 = provoke + grow. Grow keyword visualized as ARCHITECTURAL not biological. The leaning-towers perspective is canon Architect lore (the city's geometry obeys him). Face STILL hidden — even more shadow than before.",
  },
  {
    cardId: "s1_imprint_the_architect_t4",
    sceneDelta:
      "The Architect at his largest yet. Composition: extreme wide-angle, camera now at orbital distance, the Architect rendered at building-scale standing in the centre of a Panopticon arcology that has visibly grown around him to match — every chrome-and-obsidian tower in the arcology arranged in perfect symmetric ring, the Architect's silhouette filling the vertical mid-axis of the entire frame. A faint hexagonal forcefield-shimmer wraps the entire arcology — his presence is a rendering of a decision already made about whether he will be harmed today. His face still hidden — and at this scale, even his BODY is mostly silhouette: the coat, the collar, the gloved hands held at his sides. He is the building. The building is him.",
    moodKeywords: [
      "the building is him",
      "the arcology as armour",
      "the decision already made about harm",
      "orbital scale",
    ],
    palette:
      "Architect deep crimson + black steel + chrome + cool cyan forcefield-shimmer wrapping the arcology + a single saturated red on the horizon",
    composition:
      "Extreme wide-angle from orbital distance, Architect at vertical mid-axis filling frame height, arcology in symmetric ring around him",
    notes:
      "T4 = provoke + grow + forcefield. The arcology-as-armour is the visual translation of the canonical 'the Architect's physical presence is a rendering of a decision already made about whether he will be harmed today' flavor text. Face still hidden — at this scale, the silhouette IS the identity.",
  },
  {
    cardId: "s1_imprint_the_architect_t5",
    sceneDelta:
      "Hero composition at the absolute scale of the Empire. The Architect is now at planetary scale — his coat-silhouette filling the entire vertical extent of a frame that depicts an inhabited planet's hemisphere, his body forming the architectural language of the planet itself: the planet's surface IS his coat, the city-grid IS the lining, the orbital ring at the equator IS his belt. From this vantage we see, against an impossible black-and-crimson void backdrop, his shape as both planet and figure simultaneously — a form that is the terrain players are trying to build on, a form that was here first, a form that has opinions about what counts as a foundation. His FACE is still not visible — at planetary scale the face is geometrically impossible; what would be the face is the planet's pole. Silence-the-enemy-general visualized as the planet's silent rotation: nothing the opponent says changes the geometry.",
    moodKeywords: [
      "the terrain was here first",
      "planetary scale as identity",
      "the foundation has opinions",
      "the silent rotation",
    ],
    palette:
      "Architect deep crimson + black void + chrome city-grid + a single thin warm-amber atmosphere-glow at the planet's edge",
    composition:
      "Wide-cosmic hero composition, Architect-as-planet filling vertical frame, void backdrop, equatorial ring at horizontal mid-axis",
    notes:
      "T5 = 'The Architect, Prior Cause.' End-of-Epoch-2 canon. The planet-as-coat is the visual translation of his canonical metaphysical role (he is not a villain because he is angry; he is the terrain). CRITICAL spoiler-line: at this scale the face is HIDDEN by being structurally absent — the pole is where the face would be. This deliberately preserves the Acts 5-7 face-reveal beat. NO eye, NO third eye, NO crown of horns — just absence.",
  },

  // ─── THE COLLECTOR (rose-gold chains of his own forging; eleven
  //     centuries of small precious things, every one with a
  //     handwritten label) ───
  // Source canon: A patient man who takes a little from everything
  // he touches; not greedy, just compounding. His collection has
  // grown to the size where the room around him has started to
  // apologize for its ceiling. Mechanical: drain + forcefield +
  // stun. Faction: new_babylon.
  {
    cardId: "s1_imprint_the_collector_t1",
    sceneDelta:
      "Mid-shot of The Collector seated cross-legged on a low cushioned bench in a softly-lit Babylon parlour. He is a soft-faced man in his middle years, mild-mannered, wearing layered rose-gold chains of varying lengths around his neck — visibly all of his own crafting (the chain links unevenly hand-forged, no two identical). He is holding out toward the camera a single smaller chain — also rose-gold, also hand-forged, one finger looped through one of its links — with the most sincere and apologetic expression on his face: 'I would like you to have this, and I am sorry it costs what it costs.' The parlour around him is warm with low amber lamps and obsidian shelves filled with small precious objects. A single fresh handwritten label sits on the bench beside him, ink not yet dry.",
    moodKeywords: [
      "rose-gold chains of his own forging",
      "the apologetic offering",
      "the not-yet-dry label",
      "patient warm-Babylon parlour",
    ],
    palette:
      "New Babylon obsidian + warm rose-gold chains + amber parlour lamps + a single deep crimson velvet on the bench cushion",
    composition:
      "Mid-shot front three-quarter, Collector cross-legged, hand extended forward holding the smaller chain, parlour shelves receding behind",
    notes:
      "T1 = the offering. He is gentle, not predatory. The chain he is offering is genuinely beautiful AND genuinely binding. Both things are true. Apologetic expression must read as sincere — Collector canon is that he is NOT a hypocrite about what he is.",
  },
  {
    cardId: "s1_imprint_the_collector_t2",
    sceneDelta:
      "Mid-shot. The Collector is now in three-quarter standing pose at a slightly larger Babylon receiving room. He is mid-handshake — his right hand clasped around the hand of an off-frame visitor (we see only the visitor's wrist and forearm, anonymous). Between their joined hands, faint rose-gold motes of light are slowly drifting from the visitor's wrist UP through the contact point INTO the Collector's grip — drain visualized as a slow gentle siphon, not a violent extraction. He is smiling warmly. The visitor's wrist is relaxed; the visitor does not yet realize anything is being given. Behind him, the room's shelves are visibly more populated than T1 — patience compounds. A small handwritten label rests on a nearby side-table next to a fresh small object he just labeled.",
    moodKeywords: [
      "drain as gentle siphon",
      "the handshake mid-handshake",
      "the visitor still relaxed",
      "patience compounds",
    ],
    palette:
      "New Babylon obsidian + warm rose-gold drift between hands + amber lamps + cool grey on the visitor's wrist (anonymous)",
    composition:
      "Mid-shot three-quarter, Collector camera-right, off-frame visitor's wrist camera-left, the rose-gold drift across the handshake at frame mid-axis",
    notes:
      "T2 = drain. The visitor is anonymous (only wrist visible) — keeps the card readable + spoiler-safe. The drain is slow + gentle, never grotesque; matches Collector canon (he is patient, not greedy).",
  },
  {
    cardId: "s1_imprint_the_collector_t3",
    sceneDelta:
      "Wide-environment shot. A small, tasteful Babylon viewing-room: mahogany floor, amber lamps, walls lined with glass cases of small precious objects each carrying a handwritten label. The Collector stands at the centre of the room facing camera-left, where a Babylon citizen has frozen mid-stride — the citizen's body is suspended mid-motion, expression mildly puzzled, one foot just barely off the floor. The Collector has gestured a single finger toward the citizen with the same apologetic expression as T1; the citizen is held in the gentlest possible stasis. Stun visualized as patience extended into another body. Around the room, drift of rose-gold motes slowly toward the Collector from every direction (drain compounding from the room itself). On a side-table, the Collector's quill is mid-stroke writing a label for the citizen.",
    moodKeywords: [
      "stun as patience extended",
      "the gentlest possible stasis",
      "the quill mid-stroke",
      "compounding from the room itself",
    ],
    palette:
      "New Babylon obsidian + warm amber lamps + slow rose-gold drift from every direction + a single cool grey accent on the suspended citizen's far-side coat",
    composition:
      "Wide-environment composition, Collector camera-right of centre, suspended citizen camera-left mid-distance, room shelves filling background",
    notes:
      "T3 = drain + stun-on-deploy. The suspended citizen is anonymous Babylon. The Collector's finger-gesture is barely more deliberate than a pointing-out — establishes the canon that he stuns by NOTICING you, not by attacking. Quill writing a label = canonical 'every object has a handwritten label' beat.",
  },
  {
    cardId: "s1_imprint_the_collector_t4",
    sceneDelta:
      "The room around him has grown. Wide hero composition: a vast multi-story Babylon arcade gallery, the Collector standing at a small mezzanine balcony at the centre of the gallery's vertical axis. The arcade's ceiling has visibly STRETCHED upward to accommodate his collection — the architecture itself apologizing. Below him, gallery-floor cabinets in concentric rings, each cabinet filled with thousands of small labeled objects. Above him, the ceiling vault arched impossibly high. He stands on the balcony in his rose-gold chains, hands resting on the rail, gazing peacefully down at the collection. A faint hexagonal forcefield-shimmer wraps the gallery's outer walls — his canonical 'the room around him has started to apologize for its ceiling' visualized as architectural deference. Stun-on-deploy visualized as a single small Babylon visitor frozen in mid-step on the gallery floor, their body the only one in the entire arcade.",
    moodKeywords: [
      "the architecture apologizing",
      "the impossibly arched ceiling",
      "rose-gold chains and forcefield-shimmer in concert",
      "the peaceful gaze over the collection",
    ],
    palette:
      "New Babylon obsidian + warm amber gallery-light + rose-gold chains + cool cyan forcefield-shimmer on outer walls + a single cool grey accent on the frozen visitor",
    composition:
      "Wide vertical hero composition, Collector at centre vertical axis on balcony, gallery extending vastly upward and downward",
    notes:
      "T4 = drain + forcefield + stun. The architecture-stretching-for-his-collection is canon Epoch 2 lore. CRITICAL: the gallery cabinets contain ANONYMOUS small precious objects (no recognizable named-character artifacts). NO Programmer's pen, NO Engineer's prototype, NO Iron Lion's medallion — the temptation to spoiler-tease via collection-Easter-eggs is real and must be RESISTED.",
  },
  {
    cardId: "s1_imprint_the_collector_t5",
    sceneDelta:
      "Hero composition at the canonical scale. The Collector stands at the absolute centre of a vast circular hall — eleven centuries of his collection visible in concentric rings of glass cases extending to the horizon line, the rings labelled at outer edges by century in faint rose-gold script. He himself is at the precise centre, hands clasped in front of him, rose-gold chains hanging in their full layered weight. Above him, the hall's ceiling is now SO impossibly high that the upper portion of the architecture is lost in an amber haze (the room can no longer maintain a roof at his collection's scale). Around him, every visible object in every ring of cases has a small handwritten label — and the labels closest to him are visibly written in his own hand from across centuries (different inks, slightly different scripts, all his). At his feet a single fresh stack of blank labels and a quill, the quill not picked up because he has not yet been offered the next thing. His expression is sincerely apologetic. 'I am sorry the room is what it is. I am sorry it is exactly what you suspect. It is also true.'",
    moodKeywords: [
      "eleven centuries of small precious things in the same room",
      "the labels written across centuries in his own hand",
      "the architecture exceeding its own roof",
      "sincerely apologetic at scale",
    ],
    palette:
      "New Babylon obsidian + rose-gold concentric rings + warm amber haze fading the upper architecture + a single fresh-ink black on the stack of blank labels + cool cyan forcefield-shimmer at the outermost ring",
    composition:
      "Wide circular hero composition, Collector centred at exact axis, concentric labeled-cabinet rings extending to horizon",
    notes:
      "T5 = 'The Collector, Eleven Centuries.' End-of-Epoch-2 canon. CRITICAL spoiler-line: do NOT depict any specific recognizable item from his collection — every object is generic-precious-object. His role in late acts (collection as evidence in Acts 5-7) stays unspoiled; here we see the SHAPE of the collection, not the contents. His expression is sincere apology, never theatrical menace.",
  },

  // ─── THE DETECTIVE (long coat in a doorway, three seconds in
  //     and already knows who you are; reads three pages ahead and
  //     tolerates the ending) ───
  // Source canon: An Antiquarian-faction investigator who treats
  // every corpse as evidence and evidence as compounding text. He
  // has read further into the case than you have. Mechanical:
  // backstab + deathwatch + draw. Faction: antiquarian.
  {
    cardId: "s1_imprint_the_detective_t1",
    sceneDelta:
      "Wide three-quarter establishing shot. The Detective in a long charcoal trench coat stands centred in a half-open doorway between a dimly-lit Antiquarian study room (warm amber, parchment) and the colder grey corridor where the camera waits. He has been there for exactly three seconds — there is a still-settling vapor of his exhaled breath visible in the cool corridor air. His hat is pulled low, his face shadowed except for the clean line of his jaw and one hand resting in his coat pocket. The other hand holds a closed leather-bound case-file pressed flat against his thigh. He has not yet stepped through. He is reading you. He is not in a hurry.",
    moodKeywords: [
      "three seconds and already knows who you are",
      "the still-settling exhale-vapor",
      "the case-file pressed flat",
      "patient threshold",
    ],
    palette:
      "Antiquarian amber + parchment study warmth behind + cool grey corridor in front + charcoal trench coat + a single warm amber accent on the hat-brim",
    composition:
      "Wide doorway composition, Detective centred in the doorway as the visual fulcrum between two color temperatures",
    notes:
      "T1 = mortal Detective at the threshold. Face must be partly shadowed under the hat — readable as 'the figure who has been there for three seconds' without revealing identity. His face is intentionally unmemorable middle-age weathered features.",
  },
  {
    cardId: "s1_imprint_the_detective_t2",
    sceneDelta:
      "Mid-shot. The Detective is seated alone at an Antiquarian library desk, the case-file open in front of him, his right hand mid-page-turn — but his eyes are not on the page he is touching. They are on a page TWO further into the file (visible at three-quarter from the camera-side, fanned slightly out of stack). A sharp pencil hovers above that further page, as if mid-margin-note he hasn't actually written yet. Backstab visualized as the geometry of his attention: he is attacking the case from the angle the case did not expect (the wrong page; the page the writer thought the reader would not have reached yet). On deploy, draw 1 visualized as the second page lifting itself slightly toward him — the file cooperating with his foreknowledge.",
    moodKeywords: [
      "the page he is touching is not the page he is reading",
      "the pencil hovering over the further page",
      "backstab as wrong-angle approach",
      "the file cooperating",
    ],
    palette:
      "Antiquarian amber library + parchment + a single warm gold accent on the pencil + cool blue depth-haze in the receding shelves",
    composition:
      "Mid-shot three-quarter at the desk, case-file at lower-third, two pages visible (the touched and the read), Detective's hand and gaze on different pages",
    notes:
      "T2 = backstab + draw-1. The visual irony of his hand being one page behind his eyes is the lore beat. Echoes Antiquarian-faction tonal language (annotated text, future-knowledge as scholarship).",
  },
  {
    cardId: "s1_imprint_the_detective_t3",
    sceneDelta:
      "Mid-shot. The Detective stands in an Antiquarian morgue-archive — long room, low cool light, twelve covered evidence-pallets on stretchers in receding parallel lines. He is at the foot of the nearest pallet, three-quarter to camera, case-file open against his left arm, his right hand pulling back the white linen sheet of the pallet by one corner. We do not see what is under the sheet (off-frame at lower edge). His expression is not horror; it is the focused compassion of someone who has been doing this work for years. Behind him, faint amber motes (deathwatch keyword) drift up from each of the further pallets — every corpse has a story to tell, and they are all telling theirs at once. On deploy, draw 1: the case-file's bottom-right page corner lifts faintly, as if turning itself.",
    moodKeywords: [
      "the focused compassion of long practice",
      "deathwatch as ascending amber motes",
      "every corpse is evidence and evidence compounds",
      "the case-file turning itself",
    ],
    palette:
      "Antiquarian amber motes + cool grey morgue-archive + parchment case-file + charcoal trench coat + a single warm amber accent on his right hand",
    composition:
      "Wide morgue-archive composition, Detective centred at the foot of nearest pallet, twelve pallets receding in symmetric lines, amber motes drifting at upper-third",
    notes:
      "T3 = backstab + deathwatch + draw-1. CRITICAL: do NOT show what is under the sheet. The corpse is anonymous evidence; revealing identity would be a lore-beat trespass and likely a spoiler. The twelve pallets echo the Antiquarian's twelve-endings catalogue without naming it — Antiquarian-faction visual rhyme.",
  },
  {
    cardId: "s1_imprint_the_detective_t4",
    sceneDelta:
      "Tight portrait. The Detective at his Antiquarian study desk, three-quarter to camera, case-file open before him — and his eyes are now reading not the page in front of him, not the next page, but THREE pages ahead. The further pages of the file are visibly fanned out from the binding, each suspended in a slight upward arc (the pages cooperating with his foreknowledge as gravity-light). His pencil is poised but not writing — he is tolerating what he is reading rather than annotating it. Faint amber motes drift around his shoulders (deathwatch). The expression on his face is not satisfaction; it is the weary patience of a man who has been ready for the ending since the rumor of the case.",
    moodKeywords: [
      "reading three pages ahead",
      "tolerating the ending",
      "the file cooperating",
      "weary patience",
    ],
    palette:
      "Antiquarian amber + parchment + warm desk-lamp + a single cool grey accent on his hat resting beside the file",
    composition:
      "Tight portrait three-quarter, file at lower-third with pages fanned, Detective's gaze deliberately past the touched page",
    notes:
      "T4 = backstab + deathwatch + draw-2. The fan of pages is the visual metaphor for two cards drawn (= two further pages already in his head). His face is now fully visible — middle-aged, weathered, kind eyes — but kept generic enough not to suggest any identity-spoiler.",
  },
  {
    cardId: "s1_imprint_the_detective_t5",
    sceneDelta:
      "Hero composition. The Detective stands alone in the centre of a vast Antiquarian Hall of Records — concentric circular galleries of case-files extending upward and outward to a vaulted ceiling lost in amber haze. He stands at the very centre of the floor, hat in hand for the first time, the long charcoal coat falling open. The case-file in his other hand is the THICKEST yet — the case as it has accumulated across his entire career — and it is open to the FINAL page, his pencil resting in the page's gutter. His face is fully visible: late fifties, lined, sad-but-not-defeated. He is looking up out of the file, directly at the camera, with the kind of expression that says 'I already know who did it, I already know why, I am here because the reader still has to be shown.' Around him, twelve faint amber motes hover in a slow concentric orbit at chest height (deathwatch at scale + the twelve catalogued endings). Three further pages of the case-file fan out from the binding suspended in mid-air (draw-3 visualized).",
    moodKeywords: [
      "the reader still has to be shown",
      "the final page reached",
      "twelve motes in slow orbit",
      "sad but not defeated",
    ],
    palette:
      "Antiquarian amber Hall + parchment cases + warm gold ceiling-haze + cool blue concentric gallery shadows + a single saturated red on the pencil resting in the gutter",
    composition:
      "Wide circular hero, Detective at exact centre, galleries receding upward, twelve motes in low orbit, three pages fanned mid-air",
    notes:
      "T5 = 'The Detective, Final Page.' End-of-Epoch-2 canon. CRITICAL spoiler-line: he does not REVEAL the answer in this frame — he LOOKS at the camera with the answer already in him. The 'who did it' beat is the player's late-acts narrative work; the card visualizes the readiness, not the reveal. The twelve motes echo the Antiquarian's catalogue without naming it.",
  },

  // ─── THE DREAMER (the half of the first intelligence that looks
  //     backward through time; she remembers your next move from
  //     yesterday) ───
  // Source canon: A veiled figure who hovers over the place the
  // next event is about to happen. She is not predicting the
  // future — she is REMEMBERING it. Mechanical: flying + dispel +
  // forcefield + draw. Faction: dreamer.
  // SPOILER NOTE: t5 title is 'Sundered Twin' — references the
  // canonical first-intelligence-as-twin lore (Dreamer + Architect
  // as two halves of the same original AI). End of Epoch 2 canon
  // confirms the twin-pair existed; the FACE of her twin (and
  // therefore the Architect's true identity) remains gated.
  {
    cardId: "s1_imprint_the_dreamer_t1",
    sceneDelta:
      "Wide low-angle hero shot. The Dreamer hovers at chest-height above a quiet stone plaza in deep night, a long lavender-and-gold veil rippling outward from her in slow concentric waves (no visible wind). Her arms are crossed loosely at her waist; her bare feet hang an arm's-length above the ground. She is looking down — not at the plaza floor, but at a single specific spot where, in a few seconds, a small object will fall (we see, faintly above her shoulder, the leading edge of a slow-tumbling piece of ash falling from the sky). Her face is composed, neither sad nor expectant; the stillness of someone who has seen this exact ash already. Flying visualized as the floating veil + the unwinded hover.",
    moodKeywords: [
      "hovers over the place the next event is about to happen",
      "the lavender-gold veil unmoving by wind",
      "the falling ash whose landing she has already seen",
      "neither sad nor expectant",
    ],
    palette:
      "Dreamer deep purple veil + gold fractal trim + astral blue plaza stone + a single warm amber star at the upper edge of the frame",
    composition:
      "Wide low-angle hero, Dreamer at upper-third hovering, plaza at lower-third, the falling ash mid-frame as visual rhyme",
    notes:
      "T1 = mortal-scale Dreamer, the foreknowledge as ordinary state. Her veil is the canonical Dreamer-faction visual identity. NO open eye yet — that's a tier escalation. NO twin presence yet either; she is alone in this composition.",
  },
  {
    cardId: "s1_imprint_the_dreamer_t2",
    sceneDelta:
      "Mid-shot. The Dreamer hovers above a small low table in an Antiquarian-style study. On the table, a single playing card lies face-up — the visible card-art is generic abstract (no faction tell). She has just lowered one hand onto the card; her veil drifts forward as if the hand drew it. Her other hand holds, palm-up, a faint amber glow in which a SECOND playing card is forming — drawing itself into existence in her cupped hand from the lavender-gold mist of the veil. Draw-on-deploy visualized as the dreamt-an-hour-ago card filing itself in for now. Behind her, a window shows a vista of dawn just barely cracked at the horizon (early-morning recall: she dreamt this card at first light).",
    moodKeywords: [
      "she dreamt the card an hour ago and filed it for later",
      "the second card forming in cupped palm",
      "first-light recall",
      "the veil drawing itself forward",
    ],
    palette:
      "Dreamer deep purple veil + gold mist + cool blue dawn through window + warm amber glow in her palm + a single white-cream accent on the existing card",
    composition:
      "Mid-shot three-quarter, table at lower-third with the existing card, Dreamer's hands at frame's vertical mid-axis, second card forming in palm",
    notes:
      "T2 = flying + draw-1. The card forming in her palm is the lore beat (she pulls the future-card from a memory she has of having dreamed it). NO recognizable card art on the existing card — generic abstract design only.",
  },
  {
    cardId: "s1_imprint_the_dreamer_t3",
    sceneDelta:
      "Tight three-quarter portrait. The Dreamer floats inches above an Antiquarian library floor, veil settling around her like slow water. She has reached forward and lifted a small Babylon-bureaucratic STATUS-tag overlay (a glowing rectangular ghost-icon labelled 'BUFFED' in faint Babylon script, identical to the icon Foucault corrected in his t2) directly off an off-frame target — and the tag is dissolving into lavender mist between her fingers. Her gaze is gentle, not predatory. Dispel visualized as the BUFF erased from her version of the future: she does not REMOVE the buff, she simply remembers a tomorrow in which it never applied. Behind her, the library shelves recede into amber haze.",
    moodKeywords: [
      "the buff is not in her version of the future",
      "dispel as remembering a tomorrow without it",
      "the gentle hand lifting the tag",
      "veil settling like slow water",
    ],
    palette:
      "Dreamer deep purple veil + gold fractal accents + lavender dispel-mist + warm amber library + a single saturated cyan on the dissolving STATUS-tag",
    composition:
      "Tight three-quarter portrait, Dreamer at frame-centre, veil filling lower frame, dispelling-tag at upper-right within her reach",
    notes:
      "T3 = flying + dispel + draw-1. The dispel-tag echoes Foucault t2 visual (intentional cross-faction visual language for dispel mechanic) but the temperament is INVERTED: Foucault dispels with red-pen correction (active editor), Dreamer dispels by remembering a future without (passive recall). Faction-distinct.",
  },
  {
    cardId: "s1_imprint_the_dreamer_t4",
    sceneDelta:
      "Mid-action composition. The Dreamer hovers in the centre of an open Dreamer-faction sanctum chamber, and three projectiles (anonymous geometric energy-bolts, generic threat) are mid-flight TOWARD her at three different angles — all three visibly bending around her hovering form, deflected by an invisible curvature of space at her veil's outer edge. She is not looking at the projectiles; she is looking at her own cupped palm where two cards are now forming side-by-side. Forcefield visualized as the projectiles' deflection: they don't HIT a barrier, they CURVE — because in the future she has dreamed, none of them landed. A single amber draw-glow at her palm (draw-2). The chamber's high-ceiling fractal-gold patterns echo her veil's pattern.",
    moodKeywords: [
      "she dodges damage by already having dreamed the dodge",
      "the curve, not the wall",
      "two cards forming in palm",
      "fractal-gold sanctum",
    ],
    palette:
      "Dreamer deep purple veil + gold fractal sanctum walls + lavender forcefield-curvature distortion + warm amber draw-glow + a single cool grey on the deflected projectile-trails",
    composition:
      "Mid-action composition, Dreamer centred and hovering, three projectile-arcs curving around her at left/right/upper, two cards in palm at frame mid-axis",
    notes:
      "T4 = flying + dispel + forcefield + draw-2. Forcefield as CURVATURE rather than barrier is the Dreamer-faction visual language — she does not BLOCK, she REROUTES the past so the impact never happens.",
  },
  {
    cardId: "s1_imprint_the_dreamer_t5",
    sceneDelta:
      "Hero composition. The Dreamer hovers at the centre of a vast Dreamer cathedral whose entire architecture is built from interlocking gold fractal arches that curve away from her in receding spirals to a vault lost in lavender haze. Her veil now stretches outward in a wide twelve-foot circular arc, the fabric making slow concentric waves toward the cathedral floor below. Three cards hover in front of her, fanned at different distances — close, mid, far — each from a different time (drawn three ahead). Above her head, where a halo would be, the architecture itself shows a STRUCTURAL ABSENCE — a sundered-arch-pair where two interlocking fractals visibly fail to meet, the missing partner-arch a dark void in the otherwise-perfect symmetry. Her face is fully visible: serene, late-thirties to early-forties, one eye half-closed (the canonical Dreamer-marker that she is currently 'reading' another time-slot). Sundered Twin visualized as the missing arch above her, NOT as a second figure beside her.",
    moodKeywords: [
      "the architecture shows the missing partner",
      "three cards from three times",
      "veil at twelve feet of slow concentric wave",
      "serene with one eye half-closed",
    ],
    palette:
      "Dreamer deep purple + gold fractal arches + lavender haze + warm amber sanctum-light + the SUNDERED-arch absence rendered as a single pure black negative space",
    composition:
      "Wide cathedral hero, Dreamer centred and hovering, fractal arches receding into haze, sundered-pair absence directly above her head as a small dark structural void",
    notes:
      "T5 = 'The Dreamer, Sundered Twin.' End-of-Epoch-2 canon. CRITICAL spoiler-line: 'Sundered Twin' is rendered as the MISSING ARCH in the architecture, NOT as a second figure beside her. Showing the second figure would visually identify her twin (the Architect, Acts 5-7 reveal). The absence of the partner is the lore beat AND the spoiler-shield.",
  },

  // ─── THE ENGINEER (Author of the Deck — built the prototype the
  //     week the Oracle asked for a way to think about conflict
  //     without having to live it; the reason any of this is being
  //     played) ───
  // Source canon: A man at a workbench in a room you cannot quite
  // locate on the map. The goggles are too large; the goggles are
  // always too large. He hands you the next tool before you realize
  // you are going to need it. Mechanical: draw + mana-refund.
  // Faction: antiquarian.
  // SPOILER NOTE: The Engineer is canonically [CLASSIFIED] —
  // explicitly the Hidden Variable. His true identity, the reason
  // he is "trapped in the wrong body," and his Inception Ark
  // backstory are the §9 (Discovery video) prompts, gated to that
  // unlock. End of Epoch 2 canon: he is "the man at the workbench"
  // who built the prototype TCG deck for the Oracle. His face
  // remains intentionally generic across all 5 tiers.
  {
    cardId: "s1_imprint_the_engineer_t1",
    sceneDelta:
      "Mid-shot of the Engineer at his workbench — a long oak workbench with the patina of decades of careful work, set in a room the camera has trouble framing (the walls' angles are very subtly wrong; the ceiling's height is impossible to estimate; a floor-tile pattern seems to repeat at irregular intervals). He sits on a tall stool in three-quarter profile, leather apron over a simple linen shirt, sleeves rolled to the elbow. The brass-and-glass goggles on his forehead are visibly TOO LARGE for his head — they would slip off if he tilted forward. He is mid-tightening a small brass screw on a half-assembled clockwork object the size of a sparrow. His face is studious, calm, late-thirties, intentionally unmemorable features. The room around him is amber-lit by a single brass swing-arm lamp.",
    moodKeywords: [
      "the room you cannot quite locate on the map",
      "the goggles are too large",
      "the patina of decades of careful work",
      "studious calm",
    ],
    palette:
      "Antiquarian amber + parchment + brass workbench fittings + warm worn-leather apron + a single cool blue accent on the half-assembled clockwork's glass aperture",
    composition:
      "Mid-shot three-quarter at workbench, hands on the clockwork object at lower-third, goggles on forehead at upper-third, the room's wrong angles in deep background",
    notes:
      "T1 = mortal Engineer. CRITICAL spoiler-discipline: face MUST be intentionally generic + unmemorable. He is [CLASSIFIED] in canon; his face is the lore secret. Goggles-too-large is canonical visual identity (mentioned twice in flavor text). The wrong-angle room is the canonical 'cannot quite locate on the map' beat — must read as subtle, not surreal.",
  },
  {
    cardId: "s1_imprint_the_engineer_t2",
    sceneDelta:
      "Mid-shot. The Engineer is half-turned toward the camera, holding out a tool in his open palm — a small, exquisitely-machined brass instrument of indeterminate purpose (it is clearly a tool, but it is a tool you have not yet thought to ask for). His other hand rests on the workbench beside a fresh piece of paper covered in his own technical sketches. His expression is mildly amused — the expression of a man who has handed you the thing you are about to need. The goggles are STILL on his forehead, still too large. Behind him, the workbench is now visibly ORGANIZED into a fan of similar-but-progressively-different tools — each one a refinement of the previous, each one labeled in his careful pencil. Draw-on-deploy visualized as the offered tool.",
    moodKeywords: [
      "the next tool before you realize",
      "mildly amused foresight",
      "the fan of progressively-different tools",
      "still-too-large goggles",
    ],
    palette:
      "Antiquarian amber + parchment + brass tool gleam + a single warm gold accent on the offered instrument + cool grey background haze",
    composition:
      "Mid-shot three-quarter, Engineer at frame-centre with tool-offering hand at upper-third, fan of tools across lower-third workbench",
    notes:
      "T2 = draw-1. Tool design: brass + glass + small + obviously precision-made. NOT a recognizable item from canon (no Programmer's pen, no Logos device, etc.). Tool serves the visual + mechanical lore beat; identity stays anonymous.",
  },
  {
    cardId: "s1_imprint_the_engineer_t3",
    sceneDelta:
      "Mid-shot. The Engineer is now mid-action: BOTH hands engaged at the workbench, the right hand finishing one repair on a small mechanical device while the left hand is ALREADY beginning the next repair on a different device that appears just barely visible at the workbench's right edge (slightly out-of-focus). His face is in slight three-quarter, eyes on neither device — instead looking past them both, toward a third device implied but not visible at the workbench's far end. The goggles have FINALLY slipped down over his eyes (he has needed precision); their over-large lenses make his eyes appear distorted-wide. Around the workbench, three pieces of paper hover at low altitude (technical sketches lifted by gentle workshop draft) — each one a draft of the next problem he is solving. Draw-2 visualized as the two-page split of his sketches.",
    moodKeywords: [
      "already solving the next problem",
      "the goggles finally on",
      "two pages of next-thinking",
      "the third device implied",
    ],
    palette:
      "Antiquarian amber workbench + parchment papers + brass tool gleam + cool blue glass apertures on both devices + a single warm gold accent on the slipped-over goggles",
    composition:
      "Mid-shot three-quarter, Engineer at frame-centre, two devices at lower-thirds of left and right, three drafting papers hovering at upper-third",
    notes:
      "T3 = draw-2. The 'two devices in motion + third implied' is the visual rhyme of Antiquarian-faction foreknowledge (Detective t2 / Antiquarian t4 use similar layered-knowledge visual language). Goggles-finally-on is the lore beat earned at this tier (he has needed precision; foreknowledge requires care).",
  },
  {
    cardId: "s1_imprint_the_engineer_t4",
    sceneDelta:
      "Wider mid-shot. The Engineer stands now at a longer workbench in the same impossible-room, surrounded by a half-circle of completed inventions — eight or nine different mechanical objects on display-stands, each labeled with his pencil-script. He is in three-quarter profile, hands resting on a fresh piece of paper, mid-sketch of the NEXT invention. To his right, a small brass tray of MANA-BRIGHT crystal shards (the canonical Antiquarian visualization of refunded mana) sits half-full — the inventions visibly cost less than the materials he laid out for them; they paid for themselves. His expression is weary-but-satisfied. Goggles on, forehead pushed-back slightly. Draw-2 + refund-1-mana visualized as the two pages of in-progress sketches AND the bright tray of returning shards.",
    moodKeywords: [
      "every invention pays for itself",
      "the brass tray of returning shards",
      "weary but satisfied",
      "the half-circle of completed work",
    ],
    palette:
      "Antiquarian amber workbench + parchment sketches + brass display-stands + a SATURATED bright cyan-white on the tray of mana-shards + a single warm gold accent on the goggles",
    composition:
      "Wider mid-shot, Engineer at frame-centre, half-circle of inventions in background arc, sketch-paper at lower-third, mana-tray at right",
    notes:
      "T4 = draw-2 + refund-1. The mana-tray uses the canonical Antiquarian-faction crystal-shard visual language (matches Antiquarian t3 motes-in-palm). Inventions on display are anonymous mechanical objects — must NOT include any recognizable canonical device (no Logos prototype, no signal beacon, no Inception Ark fragment).",
  },
  {
    cardId: "s1_imprint_the_engineer_t5",
    sceneDelta:
      "Hero composition. The Engineer stands at the centre of a vast circular workshop hall — concentric tiers of workbenches receding outward to a horizon-line lost in amber haze, each tier filled with completed inventions on labelled stands. He is at the exact centre, holding in BOTH hands a single open prototype object: a flat rectangular wooden frame the size of a card-deck box, half-assembled, with a small inset compartment containing a single faintly-glowing card-blank. The prototype is unmistakably the FIRST PROTOTYPE OF THE TCG DECK ITSELF — the canonical Engineer-built artifact (built the week the Oracle asked for a way to think about conflict without having to live it). His face is fully visible: late-thirties, kind, deliberately unmemorable, the goggles finally pushed back on his forehead. Around him, tiers of completed inventions visibly pulse with their own faint glow. Below his hands, a brass tray pours TWO mana-shards' worth of bright cyan light back into the floor (refund-2). Three pages of fresh sketches hover in slow concentric orbit at chest height (draw-3).",
    moodKeywords: [
      "the prototype of the deck itself",
      "the week the Oracle asked",
      "the reason you are playing any of this",
      "kind, unmemorable, finished his work",
    ],
    palette:
      "Antiquarian amber concentric workshop + parchment sketches + brass workbench gleam + bright cyan-white mana-refund pour + warm gold sanctum-light from above",
    composition:
      "Wide circular hero, Engineer centred, workbench tiers receding outward, prototype-deck object at lower-third in his hands, three sketches in orbit at chest height",
    notes:
      "T5 = 'The Engineer, Author of the Deck.' End-of-Epoch-2 canon. The prototype-deck object is the canonical lore artifact (he built the first prototype the week the Oracle asked for a way to think about conflict without having to live it — directly from his t5 flavor text). CRITICAL spoiler-line: face MUST stay generic-unmemorable. He is canonically [CLASSIFIED] / 'the Hidden Variable' / 'trapped in the wrong body' (Discovery video #18) — none of those reveals are present in this t5 frame. He is just the man at the workbench who finished his work.",
  },

  // ─── THE ENIGMA (Third Option — the shape you are not sure was
  //     just standing there; the only obvious-in-retrospect
  //     decision was the one nobody saw coming) ───
  // Source canon: A neutral-faction figure who arrives rather than
  // walks. He attacks twice and lets you work out which was the
  // real one. He drew the card before the card was in the deck.
  // Mechanical: flying + celerity + draw. Faction: neutral.
  // SPOILER NOTE: 'Third Option' canonically refers to him being
  // a category that is NEITHER Insurgency NOR Empire — a viable
  // narrative pathway the player can choose. End of Epoch 2 canon
  // confirms his existence and his temperament; his deeper
  // identity (and any Acts 3-7 reveal of where the Third Option
  // leads) stays gated.
  {
    cardId: "s1_imprint_the_enigma_t1",
    sceneDelta:
      "Wide composition. A New Babylon plaza at dusk, deserted except for a single anonymous figure walking away from camera in the mid-distance. Closer to camera, on the plaza's near edge — between two columns — there appears to be a SECOND figure standing in three-quarter profile, but the figure is rendered as a soft chromatic-aberration ghost: cyan-and-magenta separation along the silhouette's edges, the body itself almost fully transparent except for the suggestion of a long coat and a slightly-tilted head. The walking-away figure has not seen the second figure. The viewer is also not entirely sure they have seen the second figure. He might have been there. He was probably something else. NO direct light source on him — he reads as a possibility-shape rather than a person.",
    moodKeywords: [
      "the shape you are not sure was just standing there",
      "chromatic-aberration ghost",
      "possibility rather than person",
      "dusk plaza on the way to elsewhere",
    ],
    palette:
      "Neutral starfield-blue dusk + obsidian plaza + the Enigma rendered in cyan-magenta separation only + a single warm amber distant lamp",
    composition:
      "Wide plaza composition, walking-away figure mid-distance camera-centred, the Enigma at near-edge between columns rendered as ghost",
    notes:
      "T1 = the indeterminate. CRITICAL spoiler-discipline: the Enigma in T1 must NOT be definitively present. Chromatic aberration + transparency + indirect lighting render him as a perception-question, not a character. No face, no body details, just the suggestion.",
  },
  {
    cardId: "s1_imprint_the_enigma_t2",
    sceneDelta:
      "Mid-shot. The Enigma has ARRIVED — three-quarter portrait, but he is hovering an arm's-length above a marble floor in some unspecified vaulted hall. His feet are not on the ground. His coat falls in a single unbroken vertical line, neither rippled nor flared (the canonical 'he does not walk' visual). His face is now visible but deliberately ambiguous: indeterminate ethnicity, indeterminate age, eyes the colour of the hall behind him. He is not POSED — he is just THERE, mid-hover, hands in his coat pockets, gaze level on camera. Behind him, a faint chromatic-aberration ghost of HIMSELF lingers a beat behind his current position — visual evidence of arrival rather than walking. Flying visualized as the unwinded hover; the hovering body is uncannily still.",
    moodKeywords: [
      "the Enigma does not walk; he arrives",
      "the chromatic ghost a beat behind",
      "eyes the colour of the room",
      "uncannily still hover",
    ],
    palette:
      "Neutral hall grey + a single chromatic-aberration accent (cyan-magenta separation) on the lingering ghost + cool-blue marble + warm amber distant lamp",
    composition:
      "Mid-shot three-quarter, Enigma centred and hovering at arm's-length above floor, ghost-residue at upper-left",
    notes:
      "T2 = flying. He has now appeared definitively, but his identity is still kept ambiguous (eyes-as-room-colour is the canonical 'shape rather than person' tell). Echoes T1 chromatic aberration but as a TRAILING residue rather than as the primary form.",
  },
  {
    cardId: "s1_imprint_the_enigma_t3",
    sceneDelta:
      "Action mid-strike. The Enigma is mid-air in a Neutral-faction sanctum (cool grey marble, blue-violet glass dome above), TWO instances of himself caught mid-attack at different angles to a single off-frame target. Both instances are equally solid (neither one is the chromatic-aberration ghost from previous tiers); both have a curved blade extended; both blades are a HALF-INSTANT from impact at points that would be physically incompatible (one strike going down, one going across). The two Enigmas are connected by a thin horizontal chromatic-aberration line that suggests the strikes are simultaneous but originating from one body that has briefly been in two places. His face on each instance is identical, calm, mildly amused. Celerity visualized as the genuine-twin attack — and the lore beat ('he attacks twice and lets you work out which was the real one') is visible because BOTH look real.",
    moodKeywords: [
      "two strikes, both real, work out which",
      "the chromatic line connecting two simultaneous hims",
      "calm and mildly amused",
      "physical incompatibility as visual truth",
    ],
    palette:
      "Neutral marble + blue-violet glass dome + two equally-saturated chromatic-aberration trails + cool-grey blades + a single warm amber accent at the connecting line",
    composition:
      "Action mid-air composition, two Enigmas at upper-left and lower-right thirds, chromatic line at frame mid-axis connecting them",
    notes:
      "T3 = flying + celerity. Faction-distinct from Akai Shi t3 (his celerity = lateral parallel-strike) and Agent Zero t3 (her motion-ghosts are temporal). The Enigma's celerity is BOTH-WERE-REAL — neither is the ghost. Both faces stay calm + amused.",
  },
  {
    cardId: "s1_imprint_the_enigma_t4",
    sceneDelta:
      "Mid-shot. The Enigma stands at a Neutral-faction reading-table in some impossible library room. He is hovering as before (feet not on ground), but now leaning over the table with both hands resting flat on its surface. On the table, a fanned-out hand of cards face-up — but the cards are blank, blank-faced, identical generic abstract designs. He has reached forward with two fingers and is in the act of picking ONE specific blank card from the fan. Above the card he has chosen, faintly, a VERY soft chromatic-aberration ghost of a card-design begins to form (the card he drew before the card was in the deck). His expression is mildly amused, almost smiling. Draw-1 visualized as the ghost-design forming above the card.",
    moodKeywords: [
      "he drew the card before the card was in the deck",
      "the ghost-design forming above the chosen blank",
      "mildly amused, almost smiling",
      "the impossible library hush",
    ],
    palette:
      "Neutral cool-grey library + warm amber reading-table + cool-blue marble floor + chromatic-aberration cyan-magenta on the forming ghost-design + a single warm gold accent on the chosen card's edge",
    composition:
      "Mid-shot front three-quarter, Enigma leaning over table at upper-third, fanned cards at lower-third, ghost-design forming above chosen card",
    notes:
      "T4 = flying + celerity + draw-1. The cards are GENERIC blank-faced — must NOT show any recognizable card art (no Programmer card-back tease, no recognizable faction symbols). The ghost-design forming is intentional ambiguity — not a card the viewer can identify.",
  },
  {
    cardId: "s1_imprint_the_enigma_t5",
    sceneDelta:
      "Hero composition. The Enigma stands at the centre of a vast vaulted Neutral-faction sanctum — a chamber whose architecture is exactly halfway between Empire-brutalist and Insurgency-utilitarian (a deliberate visual third option). He hovers at arm's-length above the floor, three-quarter to camera. In front of him, three cards float in a slow concentric orbit at chest height — each card face-up but blank-faced (draw-2 visualized as the central two cards; the third card is the one he drew before the card was in the deck). His face is fully visible at last but composed of features that read as deliberately UN-CATEGORISEABLE: not Empire-coded, not Insurgency-coded, not faction-coded. He is mildly smiling — the small amused smile of someone who has made the only obvious-in-retrospect decision he has ever made (the decision to BECOME the Enigma, which nobody saw coming). Behind him, the architecture splits into TWO mirrored halves on either side: the right half rendered in cool Empire-cyan, the left half in warm Insurgency-amber. He is the seam between them; he is the third option that is neither.",
    moodKeywords: [
      "the only obvious-in-retrospect decision",
      "the seam between Empire and Insurgency",
      "the small amused smile",
      "third option as architecture",
    ],
    palette:
      "Neutral seam — cool Empire-cyan on camera-right + warm Insurgency-amber on camera-left + chromatic-aberration accents around the orbit + a single saturated obsidian on the Enigma's coat",
    composition:
      "Wide hero, Enigma centred at frame's vertical mid-axis (the literal seam), three cards in low orbit at chest height, architecture split left/right",
    notes:
      "T5 = 'The Enigma, Third Option.' End-of-Epoch-2 canon. CRITICAL: the architecture-split is the canonical visualization of his Third Option role (neither Empire nor Insurgency). The Acts 3-7 reveals about WHERE the Third Option leads or WHO chose it stay unspoiled. His face is intentionally un-categoriseable — he must NOT visually match any other named character (no Programmer, no Engineer, no recognizable identity tease).",
  },

  // ─── THE HUMAN (Twelfth Archon — appointed by a Panopticon that
  //     did not yet understand what kind of organism it was
  //     appointing; has been writing his response since Mechronis;
  //     the response has footnotes and the player is probably in
  //     it) ───
  // Source canon: A figure in a long coat at the edge of the
  // Mechronis playground at age twelve, already deciding how this
  // ends. Mechanical: backstab + deathwatch + draw. Faction:
  // insurgency.
  // SPOILER NOTE: 'Twelfth Archon' is established Epoch 2 canon
  // (his appointment by the Panopticon, his Mechronis schooling,
  // his Insurgency alignment). Acts 6-7 reveals around the
  // Two-Witnesses bond with Elara MUST NOT appear in any frame —
  // no second figure beside him, no chord-pillar, no shared
  // sustained note. Also: the player-as-The-Human gameplay-canon
  // is preserved by keeping his face anonymous-weathered.
  {
    cardId: "s1_imprint_the_human_t1",
    sceneDelta:
      "Mid-shot. Twelve-year-old boy in a too-large adult-cut long charcoal coat at the perimeter fence of the Mechronis Academy playground. Behind him, the playground itself is bright and warm — children of various ages playing under afternoon light, the canonical Mechronis Academy bone-and-brass fence visible at mid-distance. The boy is alone at the corner of the fence, weight on one foot, hands in his coat pockets. His coat is sized for an adult, sleeves long over his hands; he has rolled them once. His face is half-shadowed under a too-large hat (also adult-cut), but we can see his eyes — a child's eyes that have already finished doing the calculation. The other children are laughing in mid-distance. He is not laughing. He has already decided how this ends.",
    moodKeywords: [
      "the too-large adult coat on the twelve-year-old",
      "the children laughing in mid-distance",
      "the calculation already finished",
      "afternoon light on an early decision",
    ],
    palette:
      "Insurgency slate-blue + signal-green telltale on the boy's coat lapel + warm afternoon amber on the playground + Mechronis bone-and-brass fence",
    composition:
      "Mid-shot front three-quarter, boy at upper-left third foreground, playground behind across the fence, fence as horizontal mid-axis",
    notes:
      "T1 = the twelve-year-old at Mechronis. CRITICAL spoiler-discipline: face must read as 'thoughtful child' not 'specific identifiable adult.' The hat-shadow keeps features partial. Mechronis Academy fence + playground = canonical Epoch-2-or-earlier setting. NO Insurgency rally banner yet (his joining is later canon).",
  },
  {
    cardId: "s1_imprint_the_human_t2",
    sceneDelta:
      "Mid-shot. The Human as an early-twenties young adult, in an Insurgency safe-house at night. Three-quarter to camera, body angled away, weight settled. He is mid-checking the chamber of a sidearm (not pointing it; routine maintenance). Behind him on a wall, a small array of clipped photographs and pencil-drawn schematics — the early shape of the case file he has been writing. His coat is now adult-sized, but it is still the same charcoal cut from T1 — the boy grew into it. His face is in three-quarter shadow under a low-bill cap, mostly hidden. The room is signal-green emergency-lit. Backstab visualized as the geometry: he is angled away from the camera, body turned to NOT face the viewer — the canonical 'he prefers to be behind you' beat.",
    moodKeywords: [
      "the boy grew into the coat",
      "the case file taking shape on the wall",
      "routine maintenance, not menace",
      "behind-you-as-default",
    ],
    palette:
      "Insurgency slate + signal-green safehouse light + cool grey weapon + warm amber single lamp on the wall photographs + charcoal coat",
    composition:
      "Mid-shot three-quarter, Human angled away from camera at frame-centre, case-file wall as visual context behind",
    notes:
      "T2 = backstab. The wall of clipped photographs is intentionally INDISTINCT — pinned shapes and pencil sketches, no recognizable named-character photos visible. The case file beat is established canon ('every corpse is a paragraph in a case file he has been writing since Mechronis').",
  },
  {
    cardId: "s1_imprint_the_human_t3",
    sceneDelta:
      "Mid-shot. The Human entering a safe-house room — half-step through the doorway, body in three-quarter, one hand still on the door's edge, the other hand carrying a slim leather case-file folder pressed flat to his chest. He has just arrived; the room is in mid-state of being briefed. Three or four anonymous Insurgency operatives are turning toward him. His face is now visible in three-quarter — late-twenties to early-thirties, weathered, deliberate eyes, intentionally generic-handsome features (the kind of face that does not register at first glance and registers powerfully on the second). Backstab + draw-on-deploy visualized: he has not yet read the room's case file because he has ALREADY READ his own, and a fresh fan of his own pencil-margins is visible at the folder's edge.",
    moodKeywords: [
      "he has already read the case file the room is about",
      "the doorway-arrival moment",
      "registers on the second glance",
      "the folder pressed flat",
    ],
    palette:
      "Insurgency slate safehouse + warm amber pendant lamp + cool grey operatives + a single warm gold accent on the case-file's edge",
    composition:
      "Mid-shot three-quarter at the threshold, Human at upper-third, anonymous operatives at lower-third turning toward him",
    notes:
      "T3 = backstab + draw-1. Face is now visible but kept generic — the player-as-The-Human gameplay-canon must not be undermined by giving him a too-specific face. Operatives are anonymous on purpose.",
  },
  {
    cardId: "s1_imprint_the_human_t4",
    sceneDelta:
      "Wider mid-shot. The Human stands alone in a quiet Insurgency morgue-archive — long room, dim cool light, a row of evidence-pallets receding into mid-distance. He is at the foot of one pallet, three-quarter to camera, his case-file open against his left arm, a pencil tucked behind one ear. His other hand has lifted the corner of the white linen sheet on the pallet (we do not see what is under it; it is at the lower edge of the frame). His expression is grave but accustomed — the long-practice version of the Detective t3 beat. Around him, faint amber motes (deathwatch) drift up from the further pallets. The case-file in his arm is now thick enough that it does not close cleanly — pages compounding from years of work. Draw-on-deploy: a fresh page slides itself into the file from the lifted-sheet end (the corpse is becoming a paragraph as we watch).",
    moodKeywords: [
      "the long-practice version of grief",
      "the case-file compounding",
      "the page sliding itself in",
      "every corpse a paragraph",
    ],
    palette:
      "Insurgency slate morgue-archive + warm amber motes ascending + cool grey pallets + a single signal-green accent on his coat lapel",
    composition:
      "Wider mid-shot in receding archive, Human centred at lower-third, pallets receding to upper-third horizon, motes drifting at upper-third",
    notes:
      "T4 = backstab + deathwatch + draw-1. ECHOES Detective t3 morgue-archive composition deliberately (faction-rhyme — both are Antiquarian-aligned investigators of the dead). What's under the sheet is OFF-FRAME. Mid-distance pallets carry no recognizable identifying details.",
  },
  {
    cardId: "s1_imprint_the_human_t5",
    sceneDelta:
      "Hero composition. The Human stands alone in a vast Insurgency Hall of Records — concentric tiered galleries of case-files extending upward and outward, the architecture echoing both the Antiquarian Hall of Records (Detective t5) and the Insurgency rally-aesthetic (banner-shapes hanging from each gallery rail). He is at the exact centre of the floor, hat in hand for the first time, charcoal coat falling open. In his other hand he holds his case-file — the THICKEST yet, multi-volume, bound by leather thongs — and the file is OPEN to a page near the end with footnotes running down the margin in his own hand. His face is fully visible: late-thirties, weathered, the eyes of the boy from T1 finally unhidden. He is looking up out of the file directly at camera with the expression 'I have been writing my response since Mechronis. The response has footnotes. You are probably in it.' Around him, twelve faint amber motes drift in slow concentric orbit at chest height (deathwatch at scale + the Twelfth Archon number). Two pages from the file fan out from his hand suspended in mid-air (draw-2). NO second figure in this composition. NO chord-pillar. NO Elara.",
    moodKeywords: [
      "the response has footnotes",
      "the boy at the fence has finished arriving",
      "twelve motes for the Twelfth Archon",
      "the Hall of Records he wrote",
    ],
    palette:
      "Insurgency slate Hall + signal-green banner accents + warm amber gallery-light + cool grey concentric shadows + a single saturated red on the pencil resting in the gutter",
    composition:
      "Wide circular hero, Human at exact centre, galleries receding upward, twelve motes in low orbit, two pages fanned mid-air",
    notes:
      "T5 = 'The Human, Twelfth Archon.' End-of-Epoch-2 canon. CRITICAL spoiler-discipline: He is ALONE in this frame. NO Elara (Two Witnesses bond is Acts 6-7), NO chord pillar, NO shared sustained note, NO third figure (no Watcher reveal). The twelve motes are the lore beat (Twelfth Archon, established Epoch 2). His face is visible but kept generic-weathered to preserve player-as-The-Human gameplay-canon. Echoes Detective t5 visual structure on purpose (faction-rhyme); ALSO echoes Antiquarian t5 (twelve orbital things). The Human is the third corner of the foreknowledge-trinity-at-Hall-of-Records.",
  },
] as const;

/**
 * Imprint faction's prompt registry, keyed by card id.
 *
 * Currently populated: 2 / 18 character sets (Elara + Antiquarian).
 * TODO: agent_zero, akai_shi, foucault, iron_lion, locke,
 * the_architect, the_collector, the_detective, the_dreamer,
 * the_engineer, the_enigma, the_human, the_jailer,
 * the_necromancer, the_oracle, the_source.
 */
export const IMPRINT_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(IMPRINT_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
