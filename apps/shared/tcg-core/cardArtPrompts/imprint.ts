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
