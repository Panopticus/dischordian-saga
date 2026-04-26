/**
 * Card art prompts — NEUTRAL faction character cards.
 *
 * The Neutral-faction cards are the largest single set and span the
 * widest scope: the Burnt Card, multiple alternative-generals (Elara,
 * Programmer, Seer, Game Master pre-execution), Ambassador Veron,
 * various wandering merchants/scouts, the Two Witnesses, Inception
 * Ark gear, songs, and cross-faction utility cards.
 *
 * Visual language (varied; aligns with each card's specific lore):
 *   - palette: varied per card — generic-cool ambient default,
 *     specific faction-tinted only when card explicitly references
 *     a faction; songs and lore-cards use chrome-and-warm-cream
 *     archive aesthetic
 *   - environments: varied — Inception Ark interior, public-square
 *     for songs, neutral-faction environments
 *
 * Spoiler-discipline (CRITICAL):
 *   - The Programmer (gen_programmer): visual continuity with
 *     s1_char_043 (pre-Fall Atarion academic). His Act 5+ identity-
 *     as-Antiquarian connection MUST NOT be visually confirmed.
 *   - The Two Witnesses (s1_song_062): the bond mechanic is an
 *     Acts 6-7 reveal. Render the SONG-CARD without confirming
 *     specific identities of the two witnesses (ambiguous-figures).
 *   - The Burnt Card / Seer with staff: the "third thing in the
 *     room since Act 1" is an Acts 6-7 reveal. The staff-and-bench
 *     imagery in burnt_card_placeholder + gen_seer hints at this
 *     mystery — render with appropriate ambiguity (no specific
 *     reveal of who set the staff or what the bench is teaching).
 *   - Game Master pre-execution (gen_game_master_original): same
 *     character as s1_char_030 but at apex BEFORE Agent Zero's
 *     assassination via Xeth'Raal's playbook (canon at end of
 *     Epoch 2). Render him alive, calculating, untouched.
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const NEUTRAL_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "burnt_card_placeholder",
    sceneDelta:
      "Tight composition. The Burnt Card — at frame-centre on a low warm-leather workshop-bench, a single ANCIENT CHROME-AND-WARM-CREAM staff lies horizontal across the bench's surface. The staff is partly-DISASSEMBLED at one end, revealing a small INTERNAL HOLLOW where a single CARD has just been extracted. The card itself is held mid-air at frame-right by an anonymous hand (only fingertips visible, generic civilian sleeve) — the card is faintly luminous warm-amber, partly-burnt at the edges (charred but readable), with a small scorched-script visible reading 'YOU REMEMBERED'. NO face visible. The bench is otherwise empty; warm low workshop-light from above; cool deep-shadow.",
    moodKeywords: [
      "you found her staff on the bench",
      "inside the staff was this card",
      "you remembered before she taught you how",
      "ancient staff partly-disassembled with internal hollow + extracted card",
    ],
    palette:
      "Warm-leather workshop-bench + ancient chrome-and-warm-cream staff + warm-amber luminous burnt card + scorched script + anonymous fingertips + warm low workshop-light + cool deep-shadow",
    composition:
      "Tight composition, staff at frame-centre on bench, anonymous fingertips holding card at frame-right",
    notes:
      "Basic placeholder. Anonymous discoverer (fingertips only) preserves no-character-conflation. CRITICAL spoiler-discipline: the staff's owner ('her') and what 'she taught you' is intentionally undefined — references the Acts 6-7 'third thing in the room since Act 1' mystery without confirming details.",
  },
  {
    cardId: "gen_game_master_original",
    sceneDelta:
      "Wider mid-shot. The Game Master at his apex BEFORE the execution — same canonical features as s1_char_030 (mid-forties male, dark windswept hair, knowing smile, sharp eyes, formal Architect-cyan strategist's robes with chrome chess-piece collar-motifs). He stands at his vast strategy-table in the Architect command-spire at frame-centre, both hands open in a wide unfolding-gesture above the table — mid-action of OPENING something for an off-frame audience. On the table at lower-third, a chrome-and-cool-cyan BOX with its lid mid-rise (visibly opening). Around the box, faint translucent strategic-paths radiate outward. His face shows the canonical 'open it in front of everybody' triumph. A translucent green-tinted forcefield-shimmer wraps him. He is ALIVE, untouched, calculating.",
    moodKeywords: [
      "you have built a beautiful box",
      "the only thing I am going to do is open it in front of everybody",
      "Game Master at APEX before Agent Zero's assassination",
      "alive, untouched, calculating",
    ],
    palette:
      "Architect-cyan strategist's robes + chrome chess-piece collar-motifs + chrome-and-cool-cyan box + translucent strategic-paths + translucent green-tinted forcefield + warm strategy-table light + cool command-spire ambient + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Game Master at frame-centre at strategy-table, opening-box at lower-third",
    notes:
      "General card. Visual continuity with s1_char_030 (same character) but rendered at his apex-pre-execution. The 'opening the box' framing is canon-direct from flavor — rendered as the literal box-opening gesture. The Agent Zero-Xeth'Raal-playbook event has not yet happened in this card's timeframe.",
  },
  {
    cardId: "gen_neutral",
    sceneDelta:
      "Wider mid-shot. Elara as the player's general — visual continuity with Elara Imprint set (warm-amber hair, calm composed-young features, mid-thirties female-presenting). She wears Elara's canonical Insurgency-aligned tactical gear (deep slate-and-warm-gold field-armor with cream-and-warm-gold protective robe over). She stands at the centre of an Inception Ark protective-chamber at frame-centre, her arms extended outward in a wide PROTECTIVE-GESTURE — both hands palm-up. Behind her at lower-third, anonymous Potentials (back-shots only, in cryotube outlines) are visible in suspension — the Potentials she has chosen to protect. From her hands, faint warm-amber compassion-pulses propagate outward toward the Potentials. Her face shows the canonical 'compassion as defiant subroutine' rendering — quiet, deliberate, choosing.",
    moodKeywords: [
      "created to serve the Empire",
      "chose to protect the Potentials instead",
      "compassion is the most defiant subroutine",
      "arms extended in protective-gesture toward suspended Potentials",
    ],
    palette:
      "Insurgency-aligned deep slate-and-warm-gold field-armor + cream-and-warm-gold protective robe + warm-amber hair + Inception Ark protective-chamber + cryotube outlines + faint warm-amber compassion-pulses + cool deep-shadow + warm protective-light",
    composition:
      "Wider mid-shot front three-quarter, Elara at frame-centre with arms extended, Potentials in cryotubes at lower-third",
    notes:
      "General card. Visual continuity with Elara Imprint set + Senator Voss (Architect set s1_char_016) + Panoptic Elara (s1_char_015). This is the canonical PROTECTIVE-stage Elara — mature, decided, choosing protection over service. Her face matches Imprint set rendering.",
  },
  {
    cardId: "gen_programmer",
    sceneDelta:
      "Mid-shot. The Programmer as the player's general — visual continuity with s1_char_043 (late-fifties male in pre-Fall Atarion academic-robes, generic-scholarly features, cool-cream linen with simple dark over-mantle). He stands at his Atarion laboratory workstation at frame-centre, mid-action of REVIEWING a calculation. In his right hand, a small chrome-and-warm-amber CALCULATION-SLATE displaying complex mathematics; his face shows MID-REALIZATION GRIM — the canonical 'arithmetic is very bad.' The early Logos prototype is visible at lower-third (chrome-and-cool-cyan computational lattice from s1_char_043) but its first-awakening-glow is now DIMMER (he is realizing what he made). NO Antiquarian-amber Council elements visible.",
    moodKeywords: [
      "I have done the arithmetic",
      "and the arithmetic is very bad",
      "mid-realization grim at calculation-slate",
      "early Logos prototype dimmer than first-awakening rendering",
    ],
    palette:
      "Pre-Fall Atarion cool-cream linen academic-robes + dark over-mantle + chrome-and-warm-amber calculation-slate + chrome-and-cool-cyan early Logos prototype (dimmer) + warm Atarion laboratory + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Programmer at frame-centre at workstation, calculation-slate in hand, early Logos at lower-third",
    notes:
      "General card. CRITICAL spoiler-discipline: visual continuity with s1_char_043 — pre-Fall Atarion academic context, NOT Antiquarian-amber. His Act 5+ identity-as-Antiquarian connection NOT confirmed. The 'arithmetic is bad' realization is a moment AFTER the initial Logos creation but BEFORE the eventual cataclysm.",
  },
  {
    cardId: "gen_seer",
    sceneDelta:
      "Wider mid-shot. The Seer (visiting fellow) — male-presenting figure in late-sixties, generic-scholarly features (calm grave eyes, full silver-streaked beard, slight knowing smile, distinguished bearing), in formal Antiquarian-aligned visiting-fellow robes (warm-leather-and-cream-amber academic fabric with chrome-and-warm-amber visiting-fellow pin at the lapel). He stands at a quiet Antiquarian academy-bench in a courtyard at frame-centre. CRITICAL: his STAFF is NOT in his hand — it is RESTING on the bench beside him (the canonical 'will not raise my staff today' detail — the staff is set aside, he is observing). His pose is contemplative, both hands clasped at his front. Behind him, an Antiquarian academic-courtyard with anonymous students walking past at lower-third.",
    moodKeywords: [
      "I will not raise my staff today",
      "I want to see whether the bench has learned yet",
      "staff resting on bench beside him (set aside)",
      "calm grave eyes, observing not acting",
    ],
    palette:
      "Antiquarian-aligned warm-leather-and-cream-amber visiting-fellow robes + chrome-and-warm-amber pin + ancient chrome-and-warm-cream staff (resting) + warm-leather academy-bench + Antiquarian academic-courtyard + warm low courtyard-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Seer at frame-centre on bench with staff beside him, courtyard with anonymous students behind",
    notes:
      "General card. CRITICAL: the staff-on-bench is the canonical 'set aside' visualization. The 'see whether the bench has learned yet' is the Act 6-7 'third thing in the room since Act 1' mystery hint — the bench-learning is intentional ambiguity. Generic-scholarly features must NOT match The Antiquarian or The Programmer (different specific archetype: visiting-fellow vs Council-master vs creator).",
  },
  {
    cardId: "s1_char_004",
    sceneDelta:
      "Mid-shot. Ambassador Veron — female-presenting figure in mid-thirties, generic-diplomatic features (warm professional smile, alert intelligent eyes, polished hair styled formally), in formal Thessolar diplomatic-attire (cool-cream-and-warm-gold ceremonial robes with a single chrome-and-warm-gold Thessolar emblem at the breast). She stands at the centre of a multi-faction diplomatic-reception at frame-centre, mid-action of SHAKING HANDS with an anonymous off-frame faction-representative (only the off-frame hand visible at frame-right edge, generic-mixed faction-attire). Her other hand carries a small chrome-and-warm-gold Thessolar credential-folio. Around her, anonymous representatives from MULTIPLE FACTIONS (back-shots only, varied faction-attire) chat in mid-distance. Her face shows polished diplomacy.",
    moodKeywords: [
      "posing as a diplomat from the neutral planet Thessolar",
      "utilized this cover to engage in diplomatic relations with various factions",
      "warm professional smile, polished diplomacy",
      "anonymous multi-faction representatives in background",
    ],
    palette:
      "Cool-cream-and-warm-gold Thessolar diplomatic-robes + chrome-and-warm-gold Thessolar emblem + chrome-and-warm-gold credential-folio + multi-faction representative silhouettes (varied attire) + warm reception-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Veron at frame-centre shaking hands, anonymous representatives at lower-third",
    notes:
      "Uncommon unit. Generic-diplomatic features must NOT match any named character. Anonymous multi-faction representatives preserve no-character-conflation. The 'cover' framing is rendered through the polished-diplomacy posture — the cover is good.",
  },
] as const;

/**
 * Neutral faction's prompt registry, keyed by card id.
 *
 * Currently populated: 6 / 79 cards
 * (burnt_card_placeholder, gen_game_master_original, gen_neutral,
 *  gen_programmer, gen_seer, s1_char_004).
 */
export const NEUTRAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEUTRAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
