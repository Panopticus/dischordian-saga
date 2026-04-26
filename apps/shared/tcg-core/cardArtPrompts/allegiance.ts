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
] as const;

/**
 * Allegiance faction's prompt registry, keyed by card id.
 *
 * Currently populated: 2 / 6 sets (Antiquarian, Architect).
 * TODO: dreamer, insurgency, new_babylon, thought_virus.
 */
export const ALLEGIANCE_CARD_ART_PROMPTS: Readonly<
  Record<string, CardArtPrompt>
> = Object.freeze(
  Object.fromEntries(ALLEGIANCE_PROMPTS_LIST.map((p) => [p.cardId, p])),
);
