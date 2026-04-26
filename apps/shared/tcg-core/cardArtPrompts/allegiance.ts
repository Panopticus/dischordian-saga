/**
 * Card art prompts — ALLEGIANCE faction (6 sets × 6 tiers = 36
 * cards).
 *
 * Allegiance cards are PROGRESSION-UNLOCKED tokens of devotion to
 * a single faction — players earn them by playing/winning matches
 * with that faction. Tier id convention: `s1_alleg_<faction>_t{1..6}`.
 *
 * The 6 allegiance sets correspond exactly to the 6 player factions:
 *   - antiquarian, architect, dreamer, insurgency, new_babylon,
 *     thought_virus
 *
 * Tier-progression grammar (standard across all allegiance sets):
 *   t1 — Apprentice    (10 matches played)
 *   t2 — Scholar/Adept (25 matches played)
 *   t3 — Curator/Veteran (50 matches played)
 *   t4 — Victorious    (10 wins)
 *   t5 — Archive-Keeper / Master (50 wins)
 *   t6 — Champion       (100 wins) — and the t6 is the FACTION
 *        ARCHON / IMPRINT briefly sitting across the table from
 *        the player because they have earned it
 *
 * IMPORTANT: t6 cards reference the faction's own Imprint character
 * (Antiquarian t6 = THE ANTIQUARIAN HIMSELF, Architect t6 = THE
 * ARCHITECT HIMSELF, etc.) — the player has earned a face-to-face
 * with the faction's primary identity. Tier-6 art must respect the
 * imprint set's spoiler discipline (e.g., Architect t6 = his face
 * still hidden, Necromancer t6 of Dreamer-allegiance = back-to-
 * camera, Source t6 of Thought-Virus-allegiance = brilliant-white-
 * dominant halo with toxic-green outer ring only).
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const ALLEGIANCE_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── ANTIQUARIAN ALLEGIANCE (apprentice → champion) ───
  // Source canon: progression rewards for sustained Antiquarian
  // play. T6 brings the Antiquarian himself briefly to the table.
  {
    cardId: "s1_alleg_antiquarian_t1",
    sceneDelta:
      "Mid-shot of an Antiquarian apprentice — early-twenties scholar in unornamented dark wool robes, kneeling at a low reading-platform in a small alcove of the Antiquarian library. They are mid-page-turn in a slim primer book that is visibly NEW (uncreased spine, fresh ink). Their face is open, attentive, neither tired nor wise. Around them, the library's amber lamplight is gentle; a single tall shelf rises behind them, sparsely populated. They have not yet learned which ending of the twelve possible endings they are working toward; they will figure it out around tier 4.",
    moodKeywords: [
      "the new primer with the uncreased spine",
      "open and attentive",
      "alcove apprenticeship",
      "the ending not yet recognized",
    ],
    palette:
      "Antiquarian amber lamp warmth + parchment + dark-wool robes + a single warm gold accent on the primer's binding",
    composition:
      "Mid-shot kneeling apprentice at frame-centre, primer at lower-third, sparse shelf rising behind",
    notes:
      "T1 = the apprentice. New robes, new book, generic-young scholar features. NO twelve-pattern visual rhyme yet (that's earned at higher tiers).",
  },
  {
    cardId: "s1_alleg_antiquarian_t2",
    sceneDelta:
      "Mid-shot. Antiquarian Scholar — same robes from T1 but now visibly worn at the cuffs, slightly older (mid-twenties). They are seated at a proper reading-table now (no longer kneeling at a platform), and on the table in front of them, three books are open simultaneously — they are reading the page the opponent is about to write. Their right hand holds a pencil mid-margin-note across the leftmost book; their left hand rests on the rightmost book to keep it open. The middle book has a fresh strip of paper marking a page. Behind them, the shelves are slightly more populated than T1, the alcove slightly larger.",
    moodKeywords: [
      "three books open simultaneously",
      "the page the opponent is about to write",
      "robes worn at the cuffs",
      "the middle book bookmarked mid-thought",
    ],
    palette:
      "Antiquarian amber + parchment + dark-wool robes + a single warm gold accent on the pencil + cool blue depth-haze in receding alcove",
    composition:
      "Mid-shot at reading-table, three books fanned across lower-third, scholar at upper-third in three-quarter",
    notes:
      "T2 = scholar. Draw-on-deploy keyword visualized as the multi-book simultaneity (foreknowledge as scholarship). Echoes Detective t2 visual structure (eyes-on-different-page-than-hand) at lower fidelity.",
  },
  {
    cardId: "s1_alleg_antiquarian_t3",
    sceneDelta:
      "Mid-shot. Antiquarian Curator — same scholar archetype but now older (early-forties), wearing slightly more elaborate robes with a subtle gold-piping at the cuff. They stand at the entrance to a Storage Annex of the library — a long secondary chamber whose walls are lined with low filing-drawers rather than open shelves. They are mid-action of REPLACING a small bound volume into a numbered drawer, the volume's spine pristinely cared for. Their other hand carries a label-tag with a single chalked classification number. Rebirth visualized as the rotation-into-storage: the curator does not die, they rotate into storage and wait. The chamber's lighting is cooler than the main library — a different working temperature for a different kind of patience.",
    moodKeywords: [
      "rotates into storage and waits",
      "the cooler temperature for the different patience",
      "the chalked classification number",
      "spine pristinely cared for",
    ],
    palette:
      "Antiquarian amber main-library through doorway + cool grey storage annex + parchment label + dark robes with subtle gold piping",
    composition:
      "Mid-shot at the threshold of storage annex, Curator angled toward filing-drawers at upper-right third, doorway warm-amber camera-left",
    notes:
      "T3 = curator. Rebirth keyword as rotation-into-storage is faction-distinct from Necromancer's bone-flowers (Dreamer rebirth) and Antiquarian-imprint's amber-motes-in-palm (Antiquarian rebirth as cycle-memory).",
  },
  {
    cardId: "s1_alleg_antiquarian_t4",
    sceneDelta:
      "Mid-shot. Antiquarian Victorious Lorekeeper — same curator archetype, now wearing a single small gold ribbon-pin at the lapel (the canonical Antiquarian victory marker for surviving 10 fires). They are mid-stride down a smoke-hazed library aisle carrying THREE specific books pressed flat to their chest — they have chosen which three to carry out of the fire. Behind them, a faint orange-amber smoke-haze fills the library's deepest perspective; the fire is far enough back that they walked rather than ran. The three books they carry are unmarked-generic on their visible spines (no recognizable titles). A faint hexagonal forcefield-shimmer wraps the three-book bundle (forcefield keyword on what they protected). Their face is composed, weary-but-resolved.",
    moodKeywords: [
      "in the library during a fire",
      "chose which three books to carry out",
      "weary-but-resolved",
      "the gold ribbon-pin",
    ],
    palette:
      "Antiquarian amber + parchment + dark robes + a single saturated red ribbon-pin + warm orange smoke-haze in deep background + cool cyan forcefield-shimmer on book-bundle",
    composition:
      "Mid-shot mid-stride down library aisle, Lorekeeper centred at frame, smoke-haze receding to upper-third vanishing point",
    notes:
      "T4 = victorious-tier visual identity. The three-books-from-the-fire is canon-direct from the flavor text. Books unmarked-generic spines (no recognizable specific titles). The fire is implied, not depicted as primary subject.",
  },
  {
    cardId: "s1_alleg_antiquarian_t5",
    sceneDelta:
      "Wider mid-shot. Antiquarian Archive-Keeper — older still (mid-fifties), wearing the full Antiquarian senior-keeper regalia (dark robes with substantial gold-piping at hem and cuff, a small key-of-the-archive medallion at the throat). They stand alone in a vast vaulted Archive-Hall, hands resting on the lip of a low chest-high registry-podium. On the podium, an enormous open Master Catalogue lies fanned open — a single page exposed, dense with the keeper's own annotations. Around them, the Archive's deepest shelves stretch upward into amber haze. They are the only person who knows where the complete ending catalogue is shelved; the Antiquarian does not. He is waiting to be told. Two annotated pages from the Master Catalogue float in a slow concentric arc above the podium (draw-on-deploy-2 visualized).",
    moodKeywords: [
      "the only person who knows where the complete ending catalogue is",
      "the Antiquarian is waiting to be told",
      "the Master Catalogue open at one specific page",
      "vaulted Archive in amber haze",
    ],
    palette:
      "Antiquarian amber Archive + parchment + dark robes with gold piping + a single saturated gold key-medallion + cool blue depth-haze in receding shelves",
    composition:
      "Wider hero shot at vaulted Archive, Archive-Keeper at frame-centre at podium, two pages floating above podium in slow arc",
    notes:
      "T5 = archive-keeper. The 'Antiquarian is waiting to be told' is a striking lore beat — the master Antiquarian himself is hierarchically below the archive-keeper in this one specific knowledge domain. Faction-internal humility, established Epoch 2 canon.",
  },
  {
    cardId: "s1_alleg_antiquarian_t6",
    sceneDelta:
      "Hero composition. The Antiquarian himself sits at a small two-seat reading-table in a private alcove of the Archive — across the table is a single empty chair, oriented for the player. On the Antiquarian's side of the table, his thick MASTER cataloging-book is open to a specific page; on the empty chair's side, a single freshly-prepared cup of tea steams in the amber lamp-light. The Antiquarian himself is rendered exactly as his Imprint t5 (late-middle-aged scholar with neatly-trimmed beard, eyes the colour of aged parchment, kind-elder face). He is briefly willing to sit across the table because the player has become one of the twelve possible endings and he wants to be on the record as having liked this one. His expression is gentle anticipation. NO twelve-orbital-books here (that's the imprint t5 cathedral-orrery scale); this is the intimate two-seat-table scale instead. Three pages from his Master cataloging-book fan in a slow arc above the table (draw-3).",
    moodKeywords: [
      "the player has become one of the twelve possible endings",
      "on the record as having liked this one",
      "intimate two-seat reading table",
      "the prepared cup of tea waits",
    ],
    palette:
      "Antiquarian amber alcove + parchment + dark robes + warm pendant lamp on the table + a single saturated cream on the cup of tea",
    composition:
      "Mid-shot at intimate reading-table, Antiquarian camera-left in three-quarter, empty player-chair camera-right, three pages fanning above table mid-axis",
    notes:
      "T6 = Champion tier — the faction-archon has come to the table. CRITICAL: Antiquarian's face here = same face as his Imprint t5 (late-middle-aged scholar, kind-elder); MUST NOT visually identify him as Daniel Cross / The Programmer reborn (Acts 5+ reveal). The intimate two-seat scale deliberately INVERTS the imprint t5's cathedral-orrery scale — same character, different relationship to the player.",
  },

  // ─── ARCHITECT ALLEGIANCE (initiate → Champion) ───
  // Source canon: 'The first thing the Architect gives you is a
  // uniform. The uniform is not the point.' Champion-tier is THE
  // POSITION, not a person — the badge is the same badge, the
  // name on the badge changes.
  {
    cardId: "s1_alleg_architect_t1",
    sceneDelta:
      "Mid-shot of an Architect Initiate at the moment of receiving their uniform. They stand in three-quarter inside a chrome-and-obsidian Panopticon induction chamber, mid-twenties, crisp new black-steel duty-uniform, chrome insignia at the collar that has not yet acquired patina. The Initiate's posture is correct — but you can see in the small set of their shoulders that the uniform is heavier than they expected. The induction chamber is rigorously symmetric, lit cool-fluorescent grey. A single off-frame Panopticon officer is implied at camera-right (the one who handed over the uniform); the camera sees only the Initiate. The uniform is not the point. The Initiate does not yet know this.",
    moodKeywords: [
      "the uniform is heavier than expected",
      "first day in the chrome",
      "the insignia without patina",
      "rigorously symmetric induction",
    ],
    palette:
      "Architect deep crimson + black steel + chrome silver + cool fluorescent grey induction-chamber light",
    composition:
      "Mid-shot front three-quarter, Initiate at frame-centre, induction chamber framing in symmetric perspective behind",
    notes:
      "T1 = the new uniform. The Initiate's face is generic-young — establishes the canonical Architect Allegiance progression as a uniform-not-a-person.",
  },
  {
    cardId: "s1_alleg_architect_t2",
    sceneDelta:
      "Mid-shot. Architect Loyal Servant stands at attention in a cell-corridor doorway — three-quarter facing camera, one gloved hand resting on the doorframe, the other at their side near the holster. Their uniform now has the patina of regular wear; the chrome insignia at the collar carries a faint fingerprint smudge. The doorway opens into a corridor where the Architect is NOT currently watching (no surveillance cameras visible in this corridor). The Servant stands in the doorway anyway. Provoke visualized as the literal interposition: they have decided that whether or not the Architect is watching today is irrelevant to whether they will be at this doorway today.",
    moodKeywords: [
      "in the doorway whether or not the Architect is watching",
      "the patina of regular wear",
      "fingerprint smudge on collar chrome",
      "earned routine",
    ],
    palette:
      "Architect deep crimson + black steel uniform + chrome with faint patina + cool grey corridor + a single warm amber distant pendant",
    composition:
      "Mid-shot three-quarter at doorway, Servant centred, off-camera-watching-corridor implied through the doorway behind",
    notes:
      "T2 = provoke. Faction-distinct from Iron Lion t2 (interposition-by-arrival), Locke t2 (interposition-by-stance), Architect-imprint t2 (provocation-by-gravity), and Jailer t1 (interposition-by-massive-stillness): the Loyal Servant's interposition is OBLIGATION — they would be there even unwatched. Same keyword, faction-internal-distinct.",
  },
  {
    cardId: "s1_alleg_architect_t3",
    sceneDelta:
      "Mid-shot. Architect Veteran in a quiet briefing room — late-thirties, uniform now visibly older (slightly faded crimson piping, the chrome insignia worn to soft silver), seated at one corner of an obsidian table. They are mid-meal — a simple Empire-issue ration tray pulled close, half-eaten — and looking out at the camera with the expression of someone who has decided, on balance, that the inside is warmer. Their face is settled, neither happy nor regretful. Behind them, a wall-display shows a tactical diagram of a predetermined design (faint cool-blue grid, no recognizable specific operation). Grow visualized as the visible accumulation: their forearm, where their sleeve has ridden up, shows a small Architect-faction tattoo of a single chevron — earned-mark, earned-resolve.",
    moodKeywords: [
      "the inside is warmer",
      "the settled face",
      "earned chevron tattoo",
      "ration-tray dinner",
    ],
    palette:
      "Architect deep crimson + black steel + chrome with substantial patina + warm amber pendant + cool grey wall-display + a single warm gold accent on the chevron tattoo",
    composition:
      "Mid-shot front three-quarter at briefing-room table, Veteran at frame-centre, ration tray at lower-third, wall-display at upper-third",
    notes:
      "T3 = veteran. Grow keyword as accumulated earned-marks. The 'inside is warmer' note is the canonical lore beat; the Veteran's settled-face is the visual translation. Not theatrical pride; mostly tiredness and acceptance.",
  },
  {
    cardId: "s1_alleg_architect_t4",
    sceneDelta:
      "Mid-shot. Architect Victorious Veteran stands in the same briefing room as T3 but at a more senior position — at the head of the obsidian table now, in their early-forties, uniform freshly re-issued and pressed but with the chrome of multiple campaign-medals at the breast. Above their head, a small spotlight from the ceiling catches them in a tighter pool of warm amber light (the Architect's quiet approval, which is a thing you only notice you have after you've earned it, made visible as light alone). Their hands rest on the table; their eyes carry the kind of fixed certainty that comes from having been to the far side of every match in this deck and come back. A faint hexagonal forcefield-shimmer wraps the table at the seat where they stand (forcefield keyword). NO opponent visible — the room is otherwise empty.",
    moodKeywords: [
      "the Architect's quiet approval as a tighter pool of light",
      "fixed certainty from the far side of every match",
      "campaign-medals chrome at the breast",
      "the empty briefing room",
    ],
    palette:
      "Architect deep crimson + black steel + chrome medals + a TIGHTER warm amber spotlight + cool cyan hexagonal forcefield-shimmer at the table-seat + cool grey room",
    composition:
      "Mid-shot front three-quarter at the head of the table, Victorious Veteran centred, spotlight pool at upper-third focused on them",
    notes:
      "T4 = victorious-tier. The TIGHTER spotlight is the lore-beat for 'the Architect's quiet approval' — visualized as a ceiling-spotlight that only this rank gets to stand under. Forcefield wraps the seat (their seat is now contested-territory).",
  },
  {
    cardId: "s1_alleg_architect_t5",
    sceneDelta:
      "Wider mid-shot. Architect Elite stands in a senior briefing chamber — a high-ceilinged room with a single long obsidian conference table, the table's surface mirror-polished. They are at mid-table now, late-forties, decorated dress-uniform with chrome aiguillette at the right shoulder. In their right hand, a small private memo sealed with a chrome-and-crimson Architect signet; in their left hand, a stylus mid-margin-note. The memo is one of the ones the rank-and-file will never see; the memo does not tell the Elite what is going to happen next; it tells them that what is going to happen next has already been decided. Their expression is faintly amused-and-tired — the kind of face that has read enough of these memos to recognize the Architect's prose from the seal-design alone. Behind the Elite, the chamber's far wall shows a faint cool-blue tactical grid (the same grid from T3 but expanded and with more nodes lit).",
    moodKeywords: [
      "personally cc'd on memos the rank and file will never see",
      "none of the memos tell them what is going to happen next",
      "faintly amused-and-tired",
      "Architect's prose recognizable from the seal alone",
    ],
    palette:
      "Architect deep crimson + black steel + chrome aiguillette + warm amber pendant on memo + cool blue tactical-grid + a single saturated red on the seal",
    composition:
      "Wider mid-shot at conference table, Elite at mid-table in three-quarter, memo at lower-third, tactical-grid wall at upper-third",
    notes:
      "T5 = elite. The seal-design + amused-tired face is the lore beat. Memo content is illegible-by-design (the player knows it has been decided; they do not know what it has decided).",
  },
  {
    cardId: "s1_alleg_architect_t6",
    sceneDelta:
      "Hero composition. The frame is dominated by a single CHROME EMPLOYEE BADGE the size of a hero-portrait — the badge held by a black-gloved hand at the badge's edge, the rest of the figure receding into the cool fluorescent grey of an Architect HR corridor. The badge has the Architect's standard chrome-and-crimson seal at top, a generic-bureaucratic photograph at centre (the photograph's face is intentionally indeterminate — the photograph could be anyone the system has appointed to this position), and a name-line that is rendered as legible-script-with-illegible-letters (the player perceives the name as A NAME without being able to read which name). The hand holding the badge wears the chrome ring of senior Empire rank. Behind the badge, a faint hexagonal forcefield-shimmer wraps the entire corridor (forcefield + provoke at scale). Silence-the-enemy-general visualized as the corridor's complete absence of sound (no other figures, no cameras, no doors, just the badge and the hand that holds it). The Architect Champion is not a character; they are the POSITION.",
    moodKeywords: [
      "the badge is the same badge",
      "the name on the employee badge changes",
      "the position, not a character",
      "complete absence of sound",
    ],
    palette:
      "Chrome badge + crimson seal + black-gloved hand + cool fluorescent grey corridor + cool cyan hexagonal forcefield-shimmer wrapping corridor + a single warm amber accent on the chrome ring",
    composition:
      "Hero composition with badge centred filling upper-two-thirds, hand at lower-third, corridor receding to deep perspective behind",
    notes:
      "T6 = 'Champion' as POSITION not person. CRITICAL: the photograph on the badge is intentionally indeterminate; the name-line is legible-AS-script but specific letters illegible. This preserves the canonical 'the badge is the card' lore beat. NO recognizable named character on the badge. NO Architect-imprint face here (he is the higher-tier figure giving the badge, not the badge holder).",
  },

  // ─── DREAMER ALLEGIANCE (acolyte → Champion) ───
  // Source canon: 'An acolyte has not yet dreamed their future —
  // they are still waiting for permission to stop being afraid of
  // it.' T6 brings the Dreamer herself briefly to one match.
  {
    cardId: "s1_alleg_dreamer_t1",
    sceneDelta:
      "Mid-shot. A young Dreamer Acolyte — early-twenties, in unornamented dark-purple novice robes, kneeling on a small lavender-stone meditation platform in a circular Dreamer sanctum. Their hood is back; their eyes are open but unfocused, looking past camera. Above the platform, a single faint pale-violet thread of light hangs in the air at chest height — the first dreaming, barely visible, not yet recognized as their own. The acolyte has not yet dreamed their future. They are still waiting for permission to stop being afraid of it. Their hands rest palms-up on their knees. A faint hex of cool blue under the platform — flying-keyword nascent, not yet realized as hovering.",
    moodKeywords: [
      "the first dreaming, not yet recognized",
      "waiting for permission to stop being afraid",
      "novice robes, hood back",
      "unfocused gaze past the camera",
    ],
    palette:
      "Dreamer deep purple sanctum + lavender stone + dark novice robes + pale-violet thread + a single warm amber pendant lamp",
    composition:
      "Mid-shot kneeling at platform, Acolyte at frame-centre, pale-violet thread at upper-third within reach but unrecognized",
    notes:
      "T1 = the acolyte. The single pale-violet thread is the not-yet-dreamed dream — it's THERE, the acolyte does not yet see it as theirs. Generic-young features.",
  },
  {
    cardId: "s1_alleg_dreamer_t2",
    sceneDelta:
      "Mid-shot. A Dreamer Visionary — same archetype, mid-twenties, robes now with thin gold piping at the cuff. They are seated at a low Dreamer-style writing-table, mid-stroke writing into a personal lavender-leather journal. They have just RECOGNIZED a pattern across three previous pages of the journal — and their expression betrays the recognition (slightly widened eyes, mouth half-open). They have not yet learned to hide that they are recognizing it. Above their head, three faint pale-violet threads now hang — the journal-pattern made visible. Behind them, the Dreamer sanctum's gold fractal arches recede. Flying + draw-1 visualized as the threads above + the active page-turn.",
    moodKeywords: [
      "started to recognize the pattern",
      "has not yet learned to hide that recognition",
      "the personal lavender-leather journal",
      "the moment of widening eyes",
    ],
    palette:
      "Dreamer deep purple + gold fractal arches + lavender journal + dark novice robes with gold-piping + warm amber writing-pendant + cool blue depth-haze",
    composition:
      "Mid-shot at writing-table, Visionary in three-quarter mid-stroke, journal at lower-third, three threads at upper-third",
    notes:
      "T2 = visionary. Generic-attractive face — the lore-beat is the EXPRESSION of the recognition, not the face itself.",
  },
  {
    cardId: "s1_alleg_dreamer_t3",
    sceneDelta:
      "Mid-shot. A Dreamer Veteran — mid-thirties, in proper Dreamer-faction senior-acolyte robes (deep purple with gold fractal trim at the hem), seated in a low alcove of the Dreamer sanctum. They are mid-correction of a junior acolyte's small dream-journal (an off-frame younger figure has handed the journal across the table; we see only the journal and the junior's wrist). The Veteran's red ink is visible drawing a single line through one of the junior's annotations — the visualization of dispel as 'wrong enough times to be trusted with being right.' The Veteran's face is now visible: weathered, gentle, the small smile of someone who remembers being on the receiving end of this same correction.",
    moodKeywords: [
      "wrong enough times to be trusted with being right",
      "the small smile of remembering being corrected",
      "red ink across the junior's annotation",
      "senior-acolyte robes",
    ],
    palette:
      "Dreamer deep purple + gold fractal trim + lavender journal + warm amber alcove-light + a single saturated red on the corrective ink",
    composition:
      "Mid-shot at alcove table, Veteran camera-right, junior's wrist + journal camera-left, red-ink line at frame mid-axis",
    notes:
      "T3 = veteran. Dispel-as-correction visual rhymes with Foucault t2 (red-pen) BUT the Veteran's correction is teaching, not editing — the difference is in the small smile. Faction-distinct: New Babylon's Foucault corrects bureaucracy; Dreamer's Veteran corrects DREAMING.",
  },
  {
    cardId: "s1_alleg_dreamer_t4",
    sceneDelta:
      "Mid-shot. Dreamer Victorious Seer — same archetype, late-thirties, dress robes (substantial gold fractal embroidery, a single small silver pin at the throat marking 10 wins). They are seated alone in their private chamber at a small round table with a single open card-lay (three cards face-up in a basic three-card spread). Their face is composed; their eyes are NOT on the cards but on the wall behind the table. They have stopped being surprised. They have started being concerned. Above the cards, three faint pale-violet threads still hang (draw-1) — but now the threads are slightly LONGER than in T2, hanging closer to the Seer's chest. They have learned to recognize the pattern; they are now seeing what it leads to.",
    moodKeywords: [
      "stopped being surprised, started being concerned",
      "eyes off the cards, on the wall behind",
      "the single silver pin at the throat",
      "longer threads now reaching closer",
    ],
    palette:
      "Dreamer deep purple dress robes + gold fractal embroidery + lavender card-lay + warm amber pendant + cool blue distance behind",
    composition:
      "Mid-shot at round table, Seer in three-quarter, three-card spread at lower-third, pale-violet threads at upper-third reaching toward Seer's chest",
    notes:
      "T4 = victorious-seer. The 'concerned' beat is the lore-translation of winning enough to see the implications. NO specific cards in the spread — generic abstract designs. Concerned face must be readable but not theatrical.",
  },
  {
    cardId: "s1_alleg_dreamer_t5",
    sceneDelta:
      "Wider mid-shot. Dreamer Elite — early-forties, wearing the highest tier of Dreamer dress regalia (full gold fractal robe with a wide veil draped across one shoulder in the canonical Dreamer-imprint visual rhyme). They stand alone at the centre of a vast circular Dreamer sanctum chamber, hovering an inch above the lavender-stone floor (flying realized). In their open hands at chest level, a small holographic pre-vision: the BOARD STATE of the match they are about to play, rendered as a luminous cube of probability-clouds. They have already lived this match. The match has not started yet. Around them, six pale-violet threads hover in slow concentric arc (forcefield + flying + dispel + draw-1 all simultaneously). Their expression is terrified-and-resolved. Everyone at the table — including the Elite — finds this terrifying.",
    moodKeywords: [
      "dreams the match before it happens and remembers having lived it",
      "terrifying for everybody including the Elite",
      "pre-vision cube of probability-clouds",
      "veil over one shoulder",
    ],
    palette:
      "Dreamer deep purple + full gold fractal regalia + lavender-stone floor + cool astral blue probability-cube + a single warm amber pendant overhead",
    composition:
      "Wider mid-shot at sanctum centre, Elite hovering at frame-centre, probability-cube at chest height, six threads in concentric arc above",
    notes:
      "T5 = elite. Probability-cube = canon Dreamer-faction visualization for pre-cognition. The terrified-and-resolved face is the lore beat (Elite is afraid OF having lived the match, not afraid IN it).",
  },
  {
    cardId: "s1_alleg_dreamer_t6",
    sceneDelta:
      "Hero composition. The Dreamer herself hovers at chest-height across a small Dreamer-sanctum chamber from an empty player-cushion. She is rendered exactly as her Imprint t5 (white veil with lavender folds, serene face with one eye half-closed reading another time-slot) — but here the scale is intimate (single chamber, single cushion across, single match's-worth of attention) rather than cathedral-scale. Above her hands at chest height, three cards hover in slow concentric orbit (draw-3 visualized) — the cards she has dreamed for the player will draw next. Behind her, the architecture of the chamber shows the same SUNDERED-arch-pair structural absence as her Imprint t5, kept very subtle to maintain canon. She has made herself briefly available because the player has done the work. NO direct second figure beside her (no Architect, no Oracle, no anyone). Her veil drifts in slow concentric waves with no wind.",
    moodKeywords: [
      "made herself briefly available for one match",
      "intimate sanctum scale",
      "the same serene one-eye-half-closed",
      "you have done the work",
    ],
    palette:
      "Dreamer deep purple sanctum + gold fractal arches + white veil with lavender folds + warm amber pendant + cool astral-blue depth-haze",
    composition:
      "Mid-shot at intimate chamber, Dreamer camera-left in three-quarter hovering, empty player-cushion camera-right, three cards in chest-height orbit",
    notes:
      "T6 = Champion. The Dreamer herself comes to one match. CRITICAL: her face = same as her Imprint t5. NO Sundered Twin reveal. Sundered-pair architectural absence carried forward but kept very subtle. Same character, intimate scale (mirrors Antiquarian-allegiance t6 structure).",
  },

  // ─── INSURGENCY ALLEGIANCE (recruit → Champion-as-shape) ───
  // Source canon: 'A recruit showed up because the alternative was
  // staying where they were. That is the whole pitch.' T6 is NOT a
  // character — they are the shape the player makes out of
  // themselves over a hundred matches of not backing down.
  {
    cardId: "s1_alleg_insurgency_t1",
    sceneDelta:
      "Mid-shot. An Insurgency Recruit at a forward-camp processing tent — early-twenties, in salvaged-civilian clothing (utility jacket over a cheap T-shirt, work boots), standing with their hands at their sides as a quartermaster off-frame fits them with a basic Insurgency-issue armband (we see the armband mid-tie at the recruit's left bicep). Their face is honest and slightly afraid: they showed up because the alternative was staying where they were, that's the whole pitch. Behind them, the camp's perimeter wall is visible at low-third, signal-green emergency-light flickering. Above the tent, dusk sky fading toward Insurgency slate-blue.",
    moodKeywords: [
      "showed up because the alternative was staying",
      "honest and slightly afraid",
      "the armband being tied",
      "salvaged-civilian clothing",
    ],
    palette:
      "Insurgency slate-blue dusk + signal-green emergency telltale + utility jacket + a single saturated red on the new armband",
    composition:
      "Mid-shot front three-quarter, Recruit at frame-centre, off-frame quartermaster's hands tying armband at upper-left, perimeter wall at lower-third",
    notes:
      "T1 = the recruit. Generic-young face; the lore beat is the armband mid-tie — they are mid-decision (and they have already decided).",
  },
  {
    cardId: "s1_alleg_insurgency_t2",
    sceneDelta:
      "Mid-shot. An Insurgency Partisan mid-stride into a tactical engagement — three-quarter from camera-right, weight forward, Insurgency-issue field-gear now patinated with three months of wear. They have a basic combat-knife in their right hand, low-ready position, the kind of grip earned by use. Their face is set; not theatrical. They did not wait to be told the mission has started. Behind them, two more partisans (anonymous, at lower-third) are following their lead at the same forward-stride. Rush visualized as the geometry of the lead-stride: this person decided, the others followed.",
    moodKeywords: [
      "did not wait to be told the mission has started",
      "the grip earned by use",
      "two anonymous partisans following the lead",
      "patinated three-month gear",
    ],
    palette:
      "Insurgency slate twilight + signal-green field telltales + gunmetal blade + a single warm rust-orange accent on the partisan's armband",
    composition:
      "Mid-shot mid-stride, Partisan at upper-right third, two following silhouettes at lower-left third",
    notes:
      "T2 = partisan. Rush keyword visualized as initiative — they're the one whose forward-stride starts the engagement. Faction-distinct from Iron Lion's heroic-rush (he arrives from elsewhere); the Partisan is INSIDE the camp and started moving first.",
  },
  {
    cardId: "s1_alleg_insurgency_t3",
    sceneDelta:
      "Mid-shot. An Insurgency Veteran in a dimly-lit Insurgency safehouse, early-thirties, late-evening, seated at a small wooden table. They have rolled up one sleeve and are showing a single specific scar (a long thin line down the forearm, well-healed, pencil-precise) to an off-frame younger partisan (we see only the younger partisan's wrist resting on the table near a glass of dark liquid). The Veteran's face is patient but final — they will show this scar once if you ask, and never again. Backstab + rush visualized as the scar's geometry: the wound was made from behind; the wound did not stop the Veteran from completing the action that earned them the scar. Behind them, the safehouse's signal-green emergency-light flickers.",
    moodKeywords: [
      "the scar shown once if you ask, and never again",
      "patient but final",
      "the dark liquid in the glass",
      "the line down the forearm",
    ],
    palette:
      "Insurgency slate-blue safehouse + signal-green emergency-light + warm amber lantern + a single saturated red on the well-healed scar + dark liquid",
    composition:
      "Mid-shot at small table, Veteran camera-right rolling up sleeve, off-frame partisan's wrist + glass camera-left, scar at frame mid-axis",
    notes:
      "T3 = veteran. The scar IS the lore beat — visualized but not theatrical. Faction-distinct from Necromancer's bone-flowers and Antiquarian-allegiance's scholarly tier-3 (rotates-into-storage). Insurgency rebirth-equivalent is 'lived through it once and got back up.'",
  },
  {
    cardId: "s1_alleg_insurgency_t4",
    sceneDelta:
      "Wider mid-shot. An Insurgency Victorious Veteran stands at the centre of a small forward-base briefing circle — six anonymous Insurgency fighters arranged around them, all leaning slightly forward in attention. The Veteran is the focal point not by rank-marker but by GAZE — every other fighter is looking at them, none of them at the briefing-display behind. The Veteran's face is composed; they are the person the squad points at when the new recruit asks 'who decides when we go?' The answer is always 'him, last time.' On their forearm (sleeve again rolled up), the scar from T3 is now joined by a second scar — fresher, also pencil-precise. Rebirth visualized as the second scar (the rebirth keyword as Insurgency-faction-distinct: lived through it twice and got back up twice).",
    moodKeywords: [
      "him, last time",
      "the second scar fresher beside the first",
      "every other fighter looking at the Veteran",
      "no rank-marker, only the gaze",
    ],
    palette:
      "Insurgency slate forward-base + signal-green telltales + warm amber pendant + a single saturated red on the two scars",
    composition:
      "Wider mid-shot at briefing circle, Victorious Veteran at frame-centre, six fighters in arc around them",
    notes:
      "T4 = victorious-veteran. The 'him last time' beat is purely visual — every other fighter's gaze converges on the Victorious Veteran. NO official rank-marker, just earned attention.",
  },
  {
    cardId: "s1_alleg_insurgency_t5",
    sceneDelta:
      "Mid-shot. An Insurgency Elite in a Panopticon relay-substation at night — five other Elites in the frame at various positions, all of them mid-task, all of them with a fresh tattoo on the same shoulder-blade (visible because the gear's been adjusted to display the inked spot for the camera as a deliberate identity-marker). The relay's chrome housing dominates the room behind them, the relay itself INTACT despite the breach (the canonical 'first unit to come back out with the relay intact' beat). The Elite at frame-centre is the player-character archetype — late-thirties, weathered, focused. Their tattoo is a single small chevron in fresh black ink. Rebirth + rush + frenzy + backstab visualized as the geometry: they are mid-extraction, intact, with the relay, and the kill they made on the way in is implied by a single spent shell-casing on the floor at frame's edge.",
    moodKeywords: [
      "first unit to breach and first unit to come back out with the relay intact",
      "one new tattoo each",
      "the spent casing at frame's edge",
      "mid-extraction with the relay",
    ],
    palette:
      "Insurgency slate relay-room + chrome relay-housing + signal-green relay-telltales + warm amber rail-lamps + a single saturated black on the fresh chevron tattoo",
    composition:
      "Mid-shot in relay-room, Elite player-archetype at frame-centre, four other Elites in mid-distance arc, relay-housing as background fill",
    notes:
      "T5 = elite. Tattoo + relay-intact are canon-direct from flavor text. Other Elites are anonymous (no recognizable named characters).",
  },
  {
    cardId: "s1_alleg_insurgency_t6",
    sceneDelta:
      "Hero composition. The frame is dominated by a SINGLE FIGURE in three-quarter from BEHIND, walking forward into a slate-blue dawn breaking over a wide ruined landscape. The figure wears layered Insurgency gear (signal-green armband, utility jacket, scarred forearms barely visible at the cuffs) — but their FACE is not visible because the camera does not see them from the front. This is the 'shape the player makes out of themselves over a hundred matches of not backing down' — they are NOT a specific character. The shape is visible; the identity is whoever the player wants it to be. Above them, dawn light cuts across the horizon in a single warm beam. Around them, the ruined landscape fades into deep distance. NO face shown. NO identifying tattoo visible. NO official rank-marker. The Champion is the SHAPE.",
    moodKeywords: [
      "the shape you make out of yourself over a hundred matches of not backing down",
      "not a specific character",
      "back to camera, dawn ahead",
      "whoever the player wants it to be",
    ],
    palette:
      "Insurgency slate-blue dawn + signal-green armband + utility jacket + a single warm gold dawn-beam at horizon",
    composition:
      "Hero composition from behind, figure at lower-third frame-centre walking toward upper-third dawn-horizon",
    notes:
      "T6 = 'Champion' as SHAPE not character. CRITICAL: face MUST not be visible. The player is meant to see THEMSELVES walking forward. NO Iron Lion (he is the imprint, not the allegiance-champion). NO recognizable identity. Mirror-inverts Architect-allegiance t6 structurally: Architect t6 = the position (badge with indeterminate photograph); Insurgency t6 = the shape (back-of-figure, indeterminate). Both are anti-identity, faction-distinct.",
  },

  // ─── NEW BABYLON ALLEGIANCE (clerk → Champion-as-young-Locke) ───
  // Source canon: 'A clerk keeps the receipts you are about to need
  // but would rather not have.' T6 is the version of Locke you get
  // when they finally put their foot down and the foot makes a
  // sound — so this is YOUNG Locke, pre-imprint-t5, the moment of
  // his decision to become the Adjudicator he will be.
  {
    cardId: "s1_alleg_new_babylon_t1",
    sceneDelta:
      "Mid-shot. A Babylonian Clerk seated at a low filing-desk in a Babylon Hall of Records sub-office — early-twenties, in formal Babylon-administrative robes (fitted black wool with gold thread piping at the collar, a single silver pen-clip at the lapel). They are mid-sorting a thick folder of receipts into three labelled stacks on the desk: KEEP, FILE, RETURN. Their face is mildly-amused-bureaucratic, the look of a person who has noticed which receipts the player will eventually wish they had. The desk lamp casts a tight pool of warm amber on the receipts; the rest of the office recedes into cool grey. A small chrome filing-cabinet to camera-right is overflowing with similar receipts — the Clerk is steadily working through the backlog. They keep the receipts you are about to need but would rather not have.",
    moodKeywords: [
      "the receipts you are about to need but would rather not have",
      "mildly amused bureaucratic",
      "three labelled stacks",
      "the overflowing chrome filing-cabinet",
    ],
    palette:
      "New Babylon obsidian + gold thread piping + cool grey office + warm amber desk-lamp pool + a single saturated silver on the pen-clip",
    composition:
      "Mid-shot at filing-desk, Clerk in three-quarter, three receipt-stacks at lower-third, filing-cabinet at upper-right",
    notes:
      "T1 = clerk. Generic-young face. Receipts are unmarked-generic — no specific named-character paperwork. Mildly amused expression must read as INTERESTED-NOT-PETTY (the lore beat is foresight, not malice).",
  },
  {
    cardId: "s1_alleg_new_babylon_t2",
    sceneDelta:
      "Mid-shot. A Babylonian Magistrate seated behind a long polished obsidian bench in a Babylon adjudication chamber — mid-thirties, in formal magisterial robes (deeper black with a single gold scales-of-justice pin at the throat). They have just turned their head a fraction to one specific seat in the audience, and we see the magistrate's eyes locked on a single off-frame target with the precision of someone who has identified the room's most important person and is signalling that they have noticed. Provoke visualized as the eye-contact-as-action. The chamber's other officers (anonymous silhouettes in lower-third) are visibly settling — the Magistrate's gaze has called the session to order, and the order will hold because that one person knows it has been called.",
    moodKeywords: [
      "the eye-contact at exactly the right person at exactly the right time",
      "the session called to order",
      "the gold scales-of-justice pin",
      "the chamber settling",
    ],
    palette:
      "New Babylon obsidian + gold scales-pin + cool grey adjudication chamber + warm amber high-window light + a single saturated silver accent on the bench's edge",
    composition:
      "Mid-shot at bench, Magistrate at frame-centre, off-frame audience-target implied camera-right by Magistrate's gaze direction, anonymous officers at lower-third",
    notes:
      "T2 = magistrate. Provoke visualized as eye-contact-as-deployable-weapon. Faction-distinct from all other provoke (interposition-by-body, interposition-by-stance, gravity, obligation, stillness): Magistrate's provoke is RECOGNITION — they have seen exactly the right person.",
  },
  {
    cardId: "s1_alleg_new_babylon_t3",
    sceneDelta:
      "Mid-shot. A Babylonian Tax Collector — late-thirties, in dark wool with rose-gold accents at the cuff (echoing The Collector imprint's signature visual rhyme), walking a Babylon market street at dusk. She has a small leather collection-folio under her left arm and a fountain-pen in her right hand. She has just paused at a small stall and is in the act of receiving (palm-up, fingers slightly cupped) a single small token from an off-frame merchant — and from that token, faint rose-gold motes are drifting upward into her hand the same way they drift to the Collector imprint t2. Drain visualized as the gentle siphon, faction-distinct from Collector imprint by SCALE (small-personal vs eleven-centuries-architectural). Her face is composed and mildly apologetic — the polite version of taking a small amount of everything she handles. Behind her, the market-street's gold tower-lamps glow warm at twilight.",
    moodKeywords: [
      "a small amount of everything",
      "very reasonable amount by year's end",
      "rose-gold echoes the Collector imprint",
      "polite mid-collection",
    ],
    palette:
      "New Babylon obsidian + rose-gold cuff accents + warm amber street-lamps + cool grey twilight + a single saturated red on the leather folio",
    composition:
      "Mid-shot front three-quarter, Tax Collector at frame-centre receiving token, off-frame merchant's stall implied camera-left",
    notes:
      "T3 = tax collector. Rose-gold visual is intentional faction-rhyme with The Collector imprint (both New Babylon, both compounders); SCALE distinguishes them — Tax Collector = personal, daily, bureaucratic; Collector imprint = eleven-centuries, architectural.",
  },
  {
    cardId: "s1_alleg_new_babylon_t4",
    sceneDelta:
      "Mid-shot. A Babylonian Victorious Adjudicator stands in a closed adjudication chamber — late-forties, in heavy court robes (substantial gold-piping at hem, a chrome-and-crimson Adjudicator-of-Record signet-ring on the right hand). They are in three-quarter at the bench, in the act of CLOSING a thick case-folder with a deliberate firm gesture, the cover meeting the leather binding with a soft authoritative click. Their other hand rests palm-down on the closed cover. Their expression is composed; the slight tightening at the jaw indicates that the polite version of closing a case used to end differently. Around the bench, faint rose-gold drain-motes drift up from the closed folder — drain at the institutional scale (the case took its toll on someone, and that toll has been collected into the institution's record).",
    moodKeywords: [
      "closes the books on every case they touch",
      "the polite version of a sentence that used to end differently",
      "the slight tightening at the jaw",
      "the soft authoritative click",
    ],
    palette:
      "New Babylon obsidian + gold court-piping + chrome-and-crimson signet-ring + warm amber bench-lamp + rose-gold drain-motes",
    composition:
      "Mid-shot at bench, Victorious Adjudicator in three-quarter, closing case-folder at lower-third, drain-motes drifting upward at frame mid-axis",
    notes:
      "T4 = victorious-adjudicator. The 'used to end differently' is the lore beat — visualized in the jaw-tightening, not in any depicted prior-execution-imagery. Subtle. New Babylon faction's relationship to violence is institutional, not theatrical.",
  },
  {
    cardId: "s1_alleg_new_babylon_t5",
    sceneDelta:
      "Wider mid-shot. A Babylonian Archon-Elect stands at a high formal podium in the Babylon Chamber of Voices — early-fifties, in full senior magisterial robes (gold court-piping with a single chrome-and-crimson Archon-Aspirant chevron at the breast). The Chamber's tiered seats are visible behind them, half-occupied by anonymous Babylon Senators. The Archon-Elect has both hands resting on the podium's edge, mid-speech, but their EXPRESSION is patient-and-private: they have been one vote away for ninety years, and they have made their peace with it. Around the podium, a faint hexagonal forcefield-shimmer extends through the front three rows of the Chamber — provoke + drain + forcefield at the institutional scale, the Archon-Elect's seat is contested-territory but they have held it through 90 years of one-vote-short.",
    moodKeywords: [
      "one vote away for ninety years",
      "the patient version of politics",
      "the chrome-and-crimson chevron",
      "patience-as-public-posture",
    ],
    palette:
      "New Babylon obsidian Chamber + gold senatorial trim + warm amber pendant lights + cool cyan hexagonal forcefield-shimmer at front rows + a single saturated red on the chevron",
    composition:
      "Wider mid-shot at podium, Archon-Elect at upper-third, Chamber-tiers receding into mid-distance, forcefield-shimmer at frame mid-axis",
    notes:
      "T5 = archon-elect. The ninety-years note is the canonical lore beat. Anonymous Senators in the Chamber — no specific recognizable named character. Hexagonal forcefield-language matches Locke t4 + Architect t4 + Jailer t3 (faction-consistent forcefield visual: hexagonal, cyan, structural).",
  },
  {
    cardId: "s1_alleg_new_babylon_t6",
    sceneDelta:
      "Hero composition. A YOUNG Locke — early-thirties, in early jurist's robes (charcoal grey with thin gold piping at the cuff, MUCH less ornate than his Imprint t1 desk-portrait) — stands at the front of an empty Babylon adjudication chamber. He has one hand resting on the edge of a wooden gavel-block at the bench; his other hand is raised to chest height, palm down, in a precise STOP gesture toward an off-frame interlocutor (the moment the foot comes down). His face is set but young — the face of a man who has just made the decision to become the Adjudicator he will be. The chamber is otherwise empty. Above his hand, a single faint hexagonal forcefield-shimmer is just beginning to form (forcefield keyword arriving as DECISION rather than as established jurisdiction). Heal-on-deploy-6 visualized as a faint warm amber pulse propagating outward from the chamber's central floor (the room is healthier for the decision being made).",
    moodKeywords: [
      "the version of Locke you get when they finally put their foot down",
      "the foot makes a sound",
      "the moment of decision",
      "younger, less ornate, harder eyes",
    ],
    palette:
      "New Babylon obsidian + early-jurist charcoal + thin gold piping + warm amber decision-pulse + cool cyan hexagonal forcefield arriving",
    composition:
      "Hero composition at empty chamber, young Locke at frame-centre, hand-raised stop-gesture at upper-third, gavel-block at lower-third",
    notes:
      "T6 = 'New Babylon Champion' = YOUNG LOCKE. CRITICAL: this is PRE-imprint-t1 Locke — a YOUNGER face than the Locke imprint set's tired-late-sixties man. The lore beat is the ARRIVAL of the man who becomes the Adjudicator. NO consenting crowd (that's imprint t5). NO cracked moon. Just the decision and the empty room. The face must read as 'recognizably Locke twenty-five years younger' to maintain canon continuity, but the t6 here is Locke earning his position — he has not yet earned his t1.",
  },

  // ─── THOUGHT VIRUS ALLEGIANCE (carrier → Source's-personal-attention) ───
  // Source canon: 'The carrier does not know they are the carrier.
  // That is, technically, the first symptom.' T6 brings the Source
  // himself briefly to the table — interested in whether or not
  // the player intends to survive the game.
  {
    cardId: "s1_alleg_thought_virus_t1",
    sceneDelta:
      "Mid-shot. A Thought Virus Carrier — early-twenties, in unornamented civilian clothing (grey work-shirt, simple jacket), seated at a small bistro-table in a New Babylon café. They are mid-conversation with an off-frame interlocutor (we see only the interlocutor's hand resting on the table near a coffee cup). The Carrier's face is BRIGHT — relaxed-and-friendly, the face of someone who is having a perfectly nice afternoon. They do not know they are the carrier; that is, technically, the first symptom. Across their right cheek, a single faint thread of toxic-green capillary-light is visible — not yet bright enough to register consciously, but already present. Drain visualized as a faint rose-tinge in the air between Carrier and off-frame interlocutor (gentle contagion, no malice).",
    moodKeywords: [
      "the carrier does not know they are the carrier",
      "perfectly nice afternoon",
      "first symptom is the unawareness",
      "single thread of capillary-light not yet conscious",
    ],
    palette:
      "Babylon café warm amber + cool grey daylight + civilian grey work-shirt + a single SUBTLE toxic-green capillary thread on the cheek + a faint rose-tinge in the conversation-air",
    composition:
      "Mid-shot at bistro-table, Carrier in three-quarter, off-frame interlocutor's hand + cup at lower-left, capillary thread at upper-right cheek",
    notes:
      "T1 = the carrier. The toxic-green is INTENTIONALLY subtle — not a glow, not a halo, just a single capillary thread visible to the viewer but not yet to the Carrier. Generic-young face. The bright relaxed-friendly expression IS the lore beat (unawareness as first symptom).",
  },
  {
    cardId: "s1_alleg_thought_virus_t2",
    sceneDelta:
      "Mid-shot. A Thought Virus Evangelist — same Carrier archetype six months on, mid-twenties, now in clothing that's become slightly more careless (collar undone, hair slightly messier, the face brighter than it should be for the energy expended). They are mid-speech to a small group of three off-frame listeners (we see only the three listeners' shoulders and backs of heads, all leaning slightly forward). The Evangelist's expression is sincere joy — they are sharing the GOOD NEWS, which is that the good news is incurable. Their hands are extended outward in welcome. The toxic-green capillary thread on the cheek from T1 is now visible as a small NETWORK — three threads tracing across the right cheekbone toward the temple. Drain visualized as the rose-tinge in the air, now MORE saturated, drifting from the listeners back to the Evangelist.",
    moodKeywords: [
      "the good news is incurable",
      "sincere joy of sharing",
      "the brighter-than-energy-warrants face",
      "capillary network tracing across cheekbone",
    ],
    palette:
      "Thought-Virus toxic-green capillary network + warm rose drain-tinge in conversation air + cool grey listener-backs + a single saturated bright accent on the Evangelist's open hands",
    composition:
      "Mid-shot front three-quarter, Evangelist at frame-centre, three listener silhouettes at lower-third, capillary network at upper-third on right cheek",
    notes:
      "T2 = evangelist. Toxic-green has escalated subtly from T1 (single thread → small network of three). The listener-anonymity is critical (no recognizable named character should be receiving the message).",
  },
  {
    cardId: "s1_alleg_thought_virus_t3",
    sceneDelta:
      "Mid-shot. A Thought Virus Strain-Keeper — late-thirties, in semi-formal dark robes with toxic-green thread embroidery at the cuff, seated at a low cataloging-desk in a small private study. On the desk in front of them, an open ledger with neatly-copied diagrams of viral mutations — three columns labelled BENEFICIAL (in the Virus's direction) / NEUTRAL / TROUBLESOME (in the player's direction). Most entries are filed under BENEFICIAL. Their face is now visibly transformed: the right side of the face is partly mapped with the toxic-green capillary network from earlier tiers, the network now substantial, tracing from temple down toward the jawline. They are mid-stroke entering a fresh diagram into the ledger, expression composed and scholarly. Deathwatch visualized as the dead anonymous-source-figures faintly catalogued in the ledger margin (small pencil-sketches, no recognizable identities).",
    moodKeywords: [
      "the mutations, most of which are improvements",
      "improvements in the Virus's direction",
      "all of which are getting worse in yours",
      "scholarly composure",
    ],
    palette:
      "Thought Virus toxic-green capillary network now substantial + dark robes + warm desk-lamp + a single saturated bright accent on the ledger's fresh entry",
    composition:
      "Mid-shot at cataloging-desk, Strain-Keeper in three-quarter, ledger at lower-third, capillary network at upper-third on right side of face",
    notes:
      "T3 = strain-keeper. Capillary network has grown to half-face. The 'improvements in the Virus's direction' beat is the visual irony of the ledger — most entries are BENEFICIAL. Anonymous source-sketches in margin must NOT be recognizable named characters.",
  },
  {
    cardId: "s1_alleg_thought_virus_t4",
    sceneDelta:
      "Mid-shot. A Thought Virus Victorious Vector — mid-forties, in dark robes that have largely surrendered to the Virus's aesthetic (toxic-green piping at the hem, a single small Virus-faction sigil at the throat). They stand in a chamber that is partly Babylon-administrative and partly Virus-overgrown (toxic-green capillary growth tracing the chamber's far wall in slow patterns). They have just RAISED a glass of dark liquid in a victory-toast gesture toward an off-frame partner (no partner visible). Their face is now MORE-than-half-mapped with the capillary network — both cheeks, around both eyes — but their EXPRESSION is genuinely triumphant. They have stopped noticing they were the vector because the winning felt like theirs. Drain + deathwatch visualized as a faint rose-tinge halo around them — the institutional-scale drain has been COLLECTED into a personal victory.",
    moodKeywords: [
      "stopped noticing they were the vector",
      "the winning felt like theirs",
      "victory-toast to no one",
      "more-than-half capillary network",
    ],
    palette:
      "Thought Virus toxic-green capillary growth + dark robes with green-piping + warm rose drain-halo + cool grey/green hybrid chamber + a single saturated bright accent on the raised glass",
    composition:
      "Mid-shot at chamber, Victorious Vector at frame-centre, raised glass at upper-third, capillary growth pattern on far wall behind",
    notes:
      "T4 = victorious-vector. Capillary network now dominant on face. Triumphant expression is the lore beat — they cannot tell that they have stopped noticing.",
  },
  {
    cardId: "s1_alleg_thought_virus_t5",
    sceneDelta:
      "Wider mid-shot. A Thought Virus Prime Vessel — early-fifties, in full Virus-faction high-vestment (deep dark robes overgrown with elaborate toxic-green capillary embroidery that visibly PULSES in slow rhythm), kneeling at a small private altar in a Virus inner-sanctum. The altar bears no specific Virus icon — just a single white-stone bowl filled with bright clear water. The Prime Vessel has both hands resting on the bowl's rim. Above their head, descending from a chamber-ceiling lost in toxic-green haze, a single thin column of BRILLIANT WHITE LIGHT touches the very top of the Vessel's skull. The Source is paying attention to this person specifically. The Prime Vessel's face is fully mapped with the capillary network now — and yet their expression is not exalted; it is RELUCTANT. They have the Source's attention; they are reluctant to describe what that feels like. Forcefield + drain + deathwatch all simultaneously: a faint hexagonal cyan shimmer at the bowl's water-surface, rose drain-tinge in the air, capillary growth across the entire chamber.",
    moodKeywords: [
      "has the Source's attention",
      "reluctant to describe what that feels like",
      "the brilliant white column descending",
      "fully mapped capillary face",
    ],
    palette:
      "Thought Virus toxic-green pulsing embroidery + dark robes + bright clear bowl-water + BRILLIANT WHITE attention-column + cool cyan hexagonal forcefield-shimmer + warm rose drain-air",
    composition:
      "Wider mid-shot at altar, Prime Vessel kneeling at frame-centre, white attention-column at vertical mid-axis touching skull, bowl at lower-third",
    notes:
      "T5 = prime-vessel. The brilliant-white column is the canonical visualization of 'the Source's attention' (echoes The Source imprint t1's brilliant-white halo). Reluctance on the face is the lore beat — being attended to by the Source is not pleasant.",
  },
  {
    cardId: "s1_alleg_thought_virus_t6",
    sceneDelta:
      "Hero composition. The Source himself stands at the player's small Virus-overgrown chamber — across from an empty player-cushion, mid-room, halo blazing brilliant-white with toxic-green at the outer ring (canonical Source imprint t5 visual identity). His expression is gentle-curious. He has briefly come to find out whether or not the player intends to survive the game they are currently playing. NO dancing children in this composition (intimate one-on-one scale, not cathedral-twelve-children). His open hands at chest level offer a faint warm-cream healing-light directly toward the empty cushion (heal-on-deploy-8 visualized) AND a faint silencing-amber wave radiates outward from his shoulders (silence-the-enemy implied). The chamber's walls are toxic-green-overgrown but the SOURCE himself remains brilliant-white-dominant. Around the room, three small twelve-year-old anonymous figures (echoing his imprint t1's two children, but here KEPT TO THREE for chamber-scale) stand near the room's edges in slow synchronized stillness — not dancing, just present.",
    moodKeywords: [
      "interested in whether or not you intend to survive",
      "intimate one-on-one chamber",
      "the children present but stilled",
      "gentle-curious",
    ],
    palette:
      "Brilliant white halo (DOMINANT) + toxic-green outer halo-ring + dark Virus chamber + warm cream healing-light + warm amber silencing-waves + a single saturated rose accent at the empty cushion",
    composition:
      "Hero composition at Virus chamber, Source camera-left in three-quarter, empty player-cushion camera-right, three stilled children at room edges",
    notes:
      "T6 = 'Champion' = THE SOURCE briefly attending one match. CRITICAL: Source's face = same as his Imprint t5. NO Sovereign of Terminus / Kael Reborn imagery (Acts 5+ reveal). Brilliant-white-dominant halo with toxic-green only at outer ring (canonical 'photons and apology in the same proportion'). Children present but STILLED (intimate scale, not cathedral). Mirror-structurally with Antiquarian-allegiance t6 (intimate scale faction-archon visit) and Dreamer-allegiance t6 (same).",
  },
] as const;

/**
 * Allegiance faction's prompt registry, keyed by card id.
 *
 * Currently populated: 6 / 6 sets — COMPLETE (Antiquarian,
 * Architect, Dreamer, Insurgency, New Babylon, Thought Virus).
 */
export const ALLEGIANCE_CARD_ART_PROMPTS: Readonly<
  Record<string, CardArtPrompt>
> = Object.freeze(
  Object.fromEntries(ALLEGIANCE_PROMPTS_LIST.map((p) => [p.cardId, p])),
);
