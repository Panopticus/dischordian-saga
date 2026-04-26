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
] as const;

/**
 * Allegiance faction's prompt registry, keyed by card id.
 *
 * Currently populated: 1 / 6 sets (Antiquarian allegiance).
 * TODO: architect, dreamer, insurgency, new_babylon, thought_virus.
 */
export const ALLEGIANCE_CARD_ART_PROMPTS: Readonly<
  Record<string, CardArtPrompt>
> = Object.freeze(
  Object.fromEntries(ALLEGIANCE_PROMPTS_LIST.map((p) => [p.cardId, p])),
);
