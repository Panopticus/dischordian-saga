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
