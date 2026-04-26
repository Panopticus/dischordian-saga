/**
 * Card art prompts — ANTIQUARIAN faction character cards.
 *
 * The Antiquarian-faction cards extend the Antiquarian Allegiance
 * set's visual language to the broader cast of named Antiquarian-
 * aligned characters: temporal scholars, relic-keepers, paradox-
 * adepts, age-walkers, and the Antiquarian Council itself.
 *
 * Visual language (consistent with Antiquarian Imprint set + Allegiance
 * set):
 *   - palette: Antiquarian amber + warm cream + parchment + temporal
 *     blue + brass-and-glass clockwork + warm reading-light
 *   - environments: museum-of-failed-timelines, archive-cabinet halls,
 *     temporal-vault chambers, twelve-clock atrium, pocket-dimension
 *     refuges woven from stolen time
 *   - signature visual idioms: clock-faces, hour-canisters, paper-drift
 *     for draw, parchment-ledgers, twelve-pattern motifs, brass-and-
 *     glass instruments
 *   - faces: when visible, scholarly / weary / patient / quietly
 *     amused — the Antiquarian Council has seen everything end at
 *     least twice
 *
 * Spoiler-discipline: The Programmer's identity-as-Antiquarian is
 * an Act 5+ reveal. Cards depicting The Programmer (s1_char_043) MUST
 * render him as a SEPARATE pre-Fall identity — distinctly NOT The
 * Antiquarian's face, no twelve-pattern motif on his person, no
 * pocket-dimension refuge as his backdrop.
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const ANTIQUARIAN_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_antiquarian",
    sceneDelta:
      "Wider mid-shot. The Antiquarian general — a senior female-presenting Antiquarian Council member, late-fifties, generic-scholarly features, in formal Antiquarian-amber Council robes with deep warm-leather trim and a single small twelve-pointed brass medallion at the throat. She stands at the head of the Antiquarian Council's twelve-seat round table — the ELEVEN OTHER SEATS are empty (visible chairs of the absent council, each draped with a different ending's relic). She holds an open ledger in both hands at chest-height; the ledger shows TWELVE numbered entries — the twelve endings she has catalogued. Behind her, a tall arched window onto a twelfth-civilization sunset; in the deep distance, the museum-of-failed-timelines extends along the horizon. Her face is weary, attentive, slightly amused — every war makes the next one easier to survive.",
    moodKeywords: [
      "every war she catalogues makes the next one easier to survive",
      "twelve endings collected",
      "yours need not be the thirteenth",
      "weary, attentive, slightly amused",
    ],
    palette:
      "Antiquarian amber Council robes + warm-leather trim + brass twelve-pointed medallion + warm parchment ledger + temporal-blue distant museum + cool deep-window sunset + warm reading-light at lower-right",
    composition:
      "Wider mid-shot front three-quarter, Council member at frame-centre at twelve-seat round table, eleven empty chairs visible at lower-third, museum extending behind",
    notes:
      "General card. CRITICAL spoiler-discipline: this is NOT The Antiquarian himself (he is hidden, retreated to pocket dimension per s1_char_018 lore). This is a senior female Council member who chairs in his absence. Generic-scholarly features must NOT match any named character. The eleven empty chairs are canon-direct from the twelve-pattern Council motif established in the Antiquarian Imprint set.",
  },
  {
    cardId: "s1_char_018",
    sceneDelta:
      "Wider mid-shot. The Antiquarian himself, in his hidden pocket-dimension refuge — a chamber that exists OUTSIDE conventional time, woven from stolen moments. The chamber's walls are bookshelves of impossible depth; floating in mid-air at various heights are TIME-WOVEN OBJECTS (a frozen falling leaf at chest-height; a half-burned letter mid-curl; a tea-cup mid-pour with the tea-arc paused). The Antiquarian himself stands at frame-centre in deep Antiquarian-amber senior-archivist robes with a long silver-streaked dark beard and warm-amber eyes that catch his desk-lamp. He holds a single brass-and-glass hour-canister (consistent with the Time-dimension visual language). A translucent forcefield-shimmer (the warm-amber Antiquarian-tinted variant of the Architect's hexagonal-cyan, communicating 'this is woven from time, not engineered') wraps him at body-edge — the canonical 4-charge shield visualized. His face is calm, attentive, ancient. Behind him, a small twelve-clock atrium-fragment is visible through an archway — the museum's catalogue floor.",
    moodKeywords: [
      "throughout the cataclysm and the epochs that followed",
      "retreated into a hidden pocket dimension",
      "a refuge woven from stolen time",
      "frozen falling leaf, paused tea-arc",
    ],
    palette:
      "Antiquarian deep-amber archivist robes + silver-streaked dark beard + warm-amber eyes + warm-amber forcefield-shimmer + brass-and-glass hour-canister + temporal-blue floating frozen-objects + warm reading-light + cool deep-archway depth",
    composition:
      "Wider mid-shot front three-quarter, Antiquarian at frame-centre, frozen-time objects floating around him, twelve-clock atrium visible through archway",
    notes:
      "Legendary unit. This IS The Antiquarian (same master as imprint set), rendered at battle-scale in active stance rather than imprint-portrait. Pocket-dimension refuge is canon-direct from flavor. The warm-amber forcefield variant is a deliberate faction-coloured difference from Architect's hexagonal-cyan — same mechanic, different visual idiom. Visual continuity with Antiquarian Imprint set + Allegiance set + Time dimension.",
  },
  {
    cardId: "s1_char_058",
    sceneDelta:
      "Wider mid-shot. Epoch Walker — a tall figure mid-stride in late-middle-age, deep weathered features, in layered Antiquarian-amber traveling-robes worn through every era (visibly patched in different fabric-styles from different ages — the patches are a visual archive). He carries a long brass-tipped walking-staff in his right hand; over his back, a satchel containing visibly-multiple bookmark-ribbons of every colour (each ribbon is a death he has marked). Behind him, the ground TRANSITIONS through visible epochs: the path he has just walked across shifts from pre-Fall stone-paving (closest to camera, with familiar architecture in the deep-distance) to early-Epoch-1 broken-rubble (mid-frame) to early-Epoch-2 cool-grey ash-ground (just behind him), all three eras existing simultaneously along his footpath. Faint cool celerity after-image trails behind both feet (celerity); a faint translucent rebirth-doubled-edge runs along his outline (rebirth). His face is calm, slightly bored — he has done this before.",
    moodKeywords: [
      "already lived through the end of every age",
      "each death is merely a bookmark",
      "a story he has read before",
      "ground transitions through visible epochs",
    ],
    palette:
      "Antiquarian-amber traveling-robes + visibly-patched fabric in different era-styles + brass-tipped staff + multi-colour bookmark-ribbons + transitioning epoch ground (warm stone → broken rubble → cool ash) + cool celerity after-images + translucent rebirth-edge",
    composition:
      "Wider mid-shot side three-quarter, Epoch Walker mid-stride at frame-centre, ground-eras transitioning along footpath behind",
    notes:
      "Legendary unit. The 'transitioning ground beneath the path' is the visual key to 'walking through every age.' Multi-colour bookmark-ribbons in satchel = bookmark-of-each-death from flavor. Generic-weathered face must NOT match The Antiquarian himself or any other named character. The visible-patch-fabric tells the story of ages without naming them.",
  },
  {
    cardId: "s1_char_059",
    sceneDelta:
      "Mid-shot. Chronosplicer — a female-presenting figure in mid-thirties at a long brass-and-glass workbench in an Antiquarian temporal-surgery chamber, generic-precise features, in tight-fitting Antiquarian-amber surgeon's apron over a dark fitted under-tunic. She wears a single small surgical magnifier-monocle over her right eye. In her hands, two long brass-handled time-cutting instruments (NOT scalpels — temporal-shears with cool-cyan-glowing edges). She is mid-action of CUTTING a faintly-visible translucent time-thread that floats above the workbench between two anchor-points (the thread is approximately forearm-length, like a stretched ribbon). One end of the thread is cleanly severed; the other end is mid-cut. Cool celerity after-images flicker around her hands (she has already made the cut three times in three different positions — celerity). Her face is precise, focused, without remorse.",
    moodKeywords: [
      "cuts time the way a surgeon cuts flesh",
      "precisely, and without remorse",
      "two brass-handled temporal-shears",
      "translucent time-thread mid-cut",
    ],
    palette:
      "Antiquarian-amber surgeon's apron + dark fitted under-tunic + brass-and-glass temporal-shears + cool-cyan thread-edges + warm workbench-amber + cool surgical-magnifier-monocle + warm reading-light + cool celerity after-images",
    composition:
      "Mid-shot front three-quarter, Chronosplicer at frame-centre at workbench, time-thread floating between anchors, instruments mid-cut",
    notes:
      "Rare unit. The 'time as a surgical thread' is the canonical Antiquarian-temporal-surgery visual. Cool-cyan thread-edges differentiate from Architect-faction cool-cyan-engineering by being NARROW and FILAMENT-like rather than ARCHITECTURAL. Generic-precise face must NOT match any named character. Surgical-magnifier-monocle echoes the Engineer's oversized-goggles motif from his Imprint set without quoting it directly.",
  },
  {
    cardId: "s1_char_060",
    sceneDelta:
      "Mid-shot. Relic Keeper — a young female-presenting Antiquarian junior-curator, late-twenties, in plain Antiquarian-staff-apprentice apron over warm-leather staff-tunic, generic-attentive features. She stands in a quiet display-hall of the museum-of-failed-timelines, mid-action of placing a small ANCIENT RELIC (a brass-and-glass clockwork piece, approximately fist-sized, with a clearly-broken internal gear visible) onto a low chest-height display-pedestal. The relic itself is faintly luminous — a translucent warm-amber forcefield-shimmer wraps it (forcefield as 'the relic protects itself,' canon-direct from flavor — the protection is the relic's, not the Keeper's). Her hands are gentle, careful, just-barely-touching the relic. Behind her, the display-hall extends with rows of similar pedestals at receding distance, each with its own glowing-relic. Warm reading-light from above; cool deep-shadow at floor.",
    moodKeywords: [
      "the relics protect themselves",
      "she merely gives them someone to protect",
      "junior-curator placing relic on pedestal",
      "gentle, careful, just-barely-touching",
    ],
    palette:
      "Antiquarian-amber junior-curator apron + warm-leather staff-tunic + brass-and-glass clockwork relic + translucent warm-amber forcefield-shimmer + warm display-hall pedestal-light + cool floor-shadow + receding rows of glowing relics",
    composition:
      "Mid-shot front three-quarter, Keeper at frame-centre at display-pedestal, relic mid-placement, display-hall receding behind",
    notes:
      "Common unit. Canon-direct from flavor: forcefield is on the RELIC, not the Keeper — visualized as the relic's own glow rather than the Keeper's body-shimmer. Junior-curator apprentice apron differentiates from The Antiquarian himself (master) and the senior-Council member (gen_antiquarian). Generic-attentive young face must NOT match any named character.",
  },
] as const;

/**
 * Antiquarian faction's prompt registry, keyed by card id.
 *
 * Currently populated: 5 / ~39 cards
 * (gen_antiquarian, s1_char_018, s1_char_058, s1_char_059, s1_char_060).
 */
export const ANTIQUARIAN_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ANTIQUARIAN_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
