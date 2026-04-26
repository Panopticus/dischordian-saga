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
  {
    cardId: "s1_char_086",
    sceneDelta:
      "Mid-shot. A Wandering Merchant — male-presenting figure in mid-fifties, generic-mercantile features (warm professional smile, weathered tradesman's face, distinguished but humble bearing), in worn neutral travel-merchant attire (warm-leather over cream linen with multi-faction trade-tokens visible at the belt — chrome Architect-cyan + warm-gold New Babylon + signal-green Insurgency + warm-amber Antiquarian — all clipped at the same belt). He stands at a small market-stall at frame-centre on a frontier-road, mid-action of HANDLING a chrome-and-warm-gold COIN-PURSE. Around the stall, varied trade-goods displayed (faction-neutral). NO faction-specific environment.",
    moodKeywords: [
      "he sells to all sides and swears allegiance to none",
      "coin is the only faction that never falls",
      "multi-faction trade-tokens at belt — chrome cyan + warm-gold + signal-green + amber",
      "warm professional smile, weathered tradesman's face",
    ],
    palette:
      "Worn warm-leather over cream linen + multi-faction trade-tokens + chrome-and-warm-gold coin-purse + frontier-road market-stall + warm low stall-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Merchant at frame-centre at stall, varied trade-goods displayed",
    notes:
      "Common unit. Generic-mercantile features must NOT match any named character (specifically NOT The Degen — different role: stationary casino-host vs wandering frontier-merchant). The multi-faction-tokens at belt is the visual key to 'sells to all sides.'",
  },
  {
    cardId: "s1_char_087",
    sceneDelta:
      "Mid-shot. A Scrapyard Golem — humanoid-mechanical entity at frame-centre, approximately 2.4m tall, body composed of MIXED SCRAP from diverse origins: chrome architect-plates at one shoulder, warm-leather sailing-mast for one arm, brass-and-glass clockwork at the chest, signal-green Insurgency-helm fragment for the head. The composition is canonically NON-WAR-DESIGN (the salvaged components were household / civilian / utility — washing-machine-drum chest, plow-blade arms). Faint warm provoke-glow rims its leading shoulder. The Golem's posture is alert combat-stance, but the cobbled-together body shows visible RECENT-LEARNING (some welds are fresh, recently-made). Behind it, a scrapyard at lower-third with more mixed-origin debris.",
    moodKeywords: [
      "built from the wreckage of a dozen machines",
      "none of which were designed to kill",
      "it learned that part on its own",
      "household-civilian-utility salvaged components in combat-pose",
    ],
    palette:
      "Mixed scrap substance + chrome architect-plates + warm-leather sailing-mast + brass-and-glass clockwork + signal-green Insurgency-helm fragment + washing-machine-drum chest + plow-blade arms + warm provoke-rim + scrapyard debris + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Golem at frame-centre, scrapyard debris at lower-third behind",
    notes:
      "Common unit. NO human face (mechanical). The 'not designed to kill — learned that part' is the canonical visualization through the visibly-utility-origin components composed into combat-stance.",
  },
  {
    cardId: "s1_char_088",
    sceneDelta:
      "Mid-shot. A Field Medic — female-presenting figure in late-twenties, generic-warm features (kind eyes, calm focused expression, hair tied back), in neutral medic's attire (cream-and-warm-gold cross-arm-band on warm-leather field-coat, chrome-and-warm-gold medical kit at hip). She kneels at frame-centre beside an anonymous wounded figure (back-three-quarter, mixed-faction tactical gear — could be ANY side). Her hands are mid-action of treating a visible warm-amber wound. Around her hands, faint cool drain-rim wraps her body (drain keyword — she takes the wound's pain into herself). She does not LOOK at the figure's faction-markings. Faint warm low field-light.",
    moodKeywords: [
      "she does not ask which side you fight for",
      "only where it hurts",
      "anonymous mixed-faction wounded figure",
      "kind eyes, doesn't look at faction-markings",
    ],
    palette:
      "Cream-and-warm-gold medic-attire + chrome-and-warm-gold medical kit + anonymous mixed-faction wounded + warm-amber wound + faint cool drain-rim + warm low field-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Medic kneeling at frame-centre, wounded figure beside her",
    notes:
      "Uncommon unit. Anonymous wounded (mixed-faction) preserves no-character-conflation. Generic-warm features must NOT match any named character. The 'doesn't ask which side' is rendered through the medic's gaze focused on the wound, not the gear.",
  },
  {
    cardId: "s1_char_089",
    sceneDelta:
      "Tight composition. A Courier Sprite — small luminous warm-amber-and-cool-cream creature, approximately 12cm long, mid-flight at frame-centre. Body is winged (translucent silver-mist wings) and slim, designed for speed. In its tiny grasping-hands, a SMALL SCROLL or MESSAGE-CAPSULE (chrome-and-warm-gold). The Sprite's body shows visible TIRING — it is mid-action of carrying the message past dangerous territory (cool-violet shadowy threats faintly visible at frame-edges). Faint warm rush-trails behind it; faint cool wind-trails above. The Sprite's brief-bright life is canonically nearing its end.",
    moodKeywords: [
      "it carries messages no one else dares to deliver",
      "and pays for it with its brief, bright life",
      "translucent silver-mist wings + chrome-and-warm-gold message-capsule",
      "shadowy threats faintly visible at frame-edges",
    ],
    palette:
      "Warm-amber-and-cool-cream Sprite-body + translucent silver-mist wings + chrome-and-warm-gold message-capsule + warm rush-trails + cool wind-trails + cool-violet shadowy threats at edges + cool deep-shadow",
    composition:
      "Tight composition, Sprite at frame-centre mid-flight with message-capsule, threats at frame-edges",
    notes:
      "Common unit. NO human figure. The 'brief bright life' framing is rendered through the visible tiring + dangerous environment.",
  },
  {
    cardId: "s1_char_090",
    sceneDelta:
      "Action mid-shot. A Hired Blade — male-presenting figure in mid-thirties, generic-cool features (focused eyes, slight smirk, weathered scar on the brow), in mercenary-eclectic combat-attire (mixed pieces from multiple factions — could have served any side at any time, no clear current allegiance). At his belt, multiple chrome-and-warm-gold contract-pendants from previous-employers (visible different faction-emblems, all PAID/DONE). He is mid-stride forward, weapon (a chrome short-blade) raised. Faint warm rush-trails at heels (rush keyword). His face shows professional-detachment — the canonical 'loyalty is expensive, disloyalty more so' rendering — neither passion nor hatred, just contracted-execution.",
    moodKeywords: [
      "loyalty is expensive",
      "disloyalty, more so",
      "mercenary-eclectic with mixed-faction contract-pendants",
      "professional-detachment — no passion, no hatred",
    ],
    palette:
      "Mercenary-eclectic combat-attire + mixed-faction pieces + chrome-and-warm-gold contract-pendants + chrome short-blade + warm rush-trails + scar on brow + cool deep-shadow",
    composition:
      "Action mid-shot front three-quarter, Hired Blade at frame-centre mid-stride forward, weapon raised",
    notes:
      "Uncommon unit. Generic-cool features must NOT match any named character. The 'eclectic mercenary' is rendered through the deliberately-mixed-faction attire — no single allegiance.",
  },
  {
    cardId: "s1_char_091",
    sceneDelta:
      "Mid-shot. A Border Scout — figure of indeterminate gender at frame-centre, generic-quiet features (alert eyes, hood pulled low partially-obscuring face, lean build), in neutral borderlands-traveler attire (cool-cream-and-warm-leather camouflaged-pattern cloak with chrome compass-pendant at the throat). They stand mid-action of OBSERVING a borderlands-vista at frame-centre, both hands at sides, body absolutely still (the canonical 'quiet enough to survive'). In their right hand, a small chrome-and-warm-gold scout's spyglass extended toward off-frame distance. Faint warm backstab-glow rims their leading hand (backstab keyword). The borderlands behind shows multiple competing-faction territories meeting (faint translucent boundary-markers in mid-distance). NO clear face features.",
    moodKeywords: [
      "the borderlands belong to no faction",
      "only to those quiet enough to survive them",
      "scout's spyglass extended, body absolutely still",
      "translucent faction-boundary markers in mid-distance",
    ],
    palette:
      "Cool-cream-and-warm-leather camouflaged-pattern cloak + chrome compass-pendant + chrome-and-warm-gold scout's spyglass + warm backstab-glow + translucent faction-boundary markers + cool borderlands ambient + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Scout at frame-centre with spyglass, borderlands extending behind",
    notes:
      "Common unit. Hood-low + generic features preserves no-character-conflation. The 'belong to no faction' is rendered through the no-faction-marker attire + the multiple competing-territories visible behind.",
  },
  {
    cardId: "s1_char_092",
    sceneDelta:
      "Action mid-shot. A Ruin Stalker — non-human predatory figure at frame-centre, body composed of corrupted-charcoal-and-warm-amber substance (NOT thought-virus phosphor-green; this is a different kind of corruption — pre-Fall ruin-substance). Quadrupedal feline-aspect with elongated jaw, glowing warm-amber eye-points, tattered leathery skin showing ancient damage. It is mid-leap toward off-frame target at frame-right (only target's edge-of-armor visible). Faint warm backstab-glow rims its leading paws; faint warm pierce-glow rims its claws. Behind it, the RUINS of the old world (pre-Fall architecture in cool-grey decay, broken columns, ash-covered ground). The Stalker has FORGOTTEN what it was. It only knows hunger.",
    moodKeywords: [
      "in the ruins of the old world, something still hunts",
      "it does not remember what it was",
      "only what it is hungry for",
      "corrupted-charcoal-and-warm-amber feline-aspect with ancient damage",
    ],
    palette:
      "Corrupted-charcoal-and-warm-amber substance + tattered leathery skin + warm-amber eye-points + warm backstab-glow + warm pierce-glow + cool-grey pre-Fall ruins + ash-covered ground + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Stalker at frame-centre mid-leap, ruins behind",
    notes:
      "Rare unit. NO human-character-conflation possible (the Stalker is alien-monstrous). The 'forgotten what it was' is rendered through the indistinct creature-form (recognizable as quadrupedal-feline only, not as any specific named species).",
  },
  {
    cardId: "s1_char_093",
    sceneDelta:
      "Wider mid-shot. An Ironclad Veteran — male-presenting figure in mid-sixties, generic-grizzled-warrior features (deeply weathered face, full grey beard, slow grave eyes, heavy posture), in heavy worn IRONCLAD ARMOR (deep slate-and-warm-amber heavy plate, every-faction-emblem visibly OVERLAID across the armor — chrome Architect + warm-gold New Babylon + signal-green Insurgency + warm-amber Antiquarian + others — but ALL CROSSED-OUT with thick chrome strikes (he buried each of them; each banner crossed-out). He stands at the centre of a battlefield-overlook at frame-centre, both hands on the pommel of a tall planted iron sword. Behind him, multiple buried-graves at lower-third (the allies he buried). Faint warm provoke-glow rims his shoulders; translucent green-tinted forcefield wraps him; faint translucent rebirth-doubled-edge runs along his outline. His face is set, exhausted-but-standing.",
    moodKeywords: [
      "he has buried allies under every banner",
      "now he fights only for the war itself",
      "the one thing that never abandoned him",
      "every-faction-emblem overlaid and CROSSED-OUT on his armor",
    ],
    palette:
      "Deep slate-and-warm-amber heavy ironclad armor + every-faction-emblem (multiple, all crossed-out) + tall planted iron sword + warm provoke-rim + translucent green-tinted forcefield + translucent rebirth-doubled-edge + multiple buried-graves at lower-third + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Veteran at frame-centre with planted sword, buried-graves at lower-third behind",
    notes:
      "Legendary unit. Generic-grizzled-warrior features must NOT match Iron Lion (different specific archetype: Insurgency-loyal vs faction-burned). The crossed-out-every-emblem is the canonical 'buried allies under every banner' visualization. Three keywords (provoke + forcefield + rebirth) rendered as three distinct visual elements.",
  },
  {
    cardId: "s1_pack_043",
    sceneDelta:
      "Tight composition. A Void Crystal — at frame-centre, a single small VOID-CRYSTAL hovering at chest-height in mid-air. The crystal is approximately 8cm in diameter, faceted, with internal cool-violet-and-deep-black void-substance visible through translucent crystalline-faces. Critically, the crystal SEEMS WEIGHTLESS (the canonical 'costs nothing to hold') — but at lower-frame-edge, an anonymous figure (only fingertips visible, generic civilian) is mid-action of HOLDING it lightly. The figure's hand is FINE — but the GROUND beneath the fingertips is visibly STRAINING (small hairline cracks forming in the floor — 'costs everything to put down' rendered as the impossible cost of release: putting it down would shatter what's beneath). Faint cool-violet emanation around the crystal.",
    moodKeywords: [
      "it costs nothing to hold",
      "it costs everything to put down",
      "anonymous fingertips lightly holding crystal",
      "ground beneath visibly straining with hairline cracks",
    ],
    palette:
      "Faceted void-crystal + cool-violet-and-deep-black void-substance + translucent crystalline-faces + anonymous fingertips + warm low light + hairline cracks in floor + cool deep-shadow",
    composition:
      "Tight composition, crystal at frame-centre at chest-height, anonymous fingertips at frame-edge, straining ground below",
    notes:
      "Rare spell. Anonymous holder (fingertips only) preserves no-character-conflation. The 'costs everything to put down' is rendered through the visible cost-of-release in the strained-ground.",
  },
  {
    cardId: "s1_pack_044",
    sceneDelta:
      "Mid-shot. An Ark Defender — humanoid-mechanical figure at frame-centre, body composed of plain CHROME-AND-COOL-CYAN Ark-construction (consistent with Inception Ark visual idiom from Destiny s1_char_005 and Ark Sentry s1_char_103). Critically, the body shows NO FACTION MARKINGS — no Architect-emblem, no Insurgency-emblem, no faction-decoration of any kind (the canonical 'no faction markings'). Only the small Inception Ark stenciled-serial-number is visible at the chest. They stand at an Ark interior corridor at frame-centre, both hands forward in defensive stance. Faint cool-cyan optical visor (single horizontal slit) at the head. Behind them, the Ark interior with cryotubes visible at lower-third.",
    moodKeywords: [
      "the Ark's defenders were built without faction markings",
      "they defend the ship, not the ideology",
      "only Inception Ark serial-number visible — no faction emblems",
      "cryotubes visible behind",
    ],
    palette:
      "Chrome-and-cool-cyan Ark-construction + Inception Ark serial-number + cool-cyan optical visor + Ark interior corridor + cryotube outlines + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Defender at frame-centre in defensive stance, cryotubes at lower-third behind",
    notes:
      "Common unit. NO human face (mechanical). Visual continuity with Ark-thematic cards (Destiny + Locke + Ark Sentry). The 'defend the ship not the ideology' is rendered through the visible ABSENCE of faction emblems.",
  },
  {
    cardId: "s1_pack_045",
    sceneDelta:
      "Mid-shot. A Universal Adapter — small chrome-and-warm-gold mechanical entity at frame-centre, approximately 60cm tall, humanoid-cute proportions. Body has MULTIPLE INTERFACE-PORTS visibly arrayed across its torso — chrome Architect-cyan port + warm-gold New Babylon port + signal-green Insurgency port + warm-amber Antiquarian port + others (one for every faction). It is mid-action of CONNECTING to a faction-specific equipment-rack (the rack is ambiguous-faction; could be any). The Adapter's port-of-the-day is visibly engaged. Faint warm low workshop-light. NO face (chrome blank-plate where face would be).",
    moodKeywords: [
      "it connects to any system, any faction, any purpose",
      "versatility is the only true currency",
      "multiple interface-ports for every faction",
      "mid-action of connecting to ambiguous-faction equipment-rack",
    ],
    palette:
      "Chrome-and-warm-gold Adapter-body + multi-faction interface-ports (architect-cyan + new-babylon-gold + insurgency-green + antiquarian-amber) + ambiguous-faction equipment-rack + warm low workshop-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Adapter at frame-centre connecting to rack, ports visible across torso",
    notes:
      "Uncommon unit. NO human face. The 'connects to any system' is rendered through the visible multi-faction port-array. Distinct from Wandering Merchant's faction-tokens (those at belt; these are body-integrated ports).",
  },
  {
    cardId: "s1_pack_046",
    sceneDelta:
      "Wider mid-shot. A Dimensional Rift — at frame-centre, a vast TEAR in mid-air across a battlefield, approximately 3m tall. The rift's edges show cool-violet-and-warm-amber distortion. Through the rift, a faint silhouette of WHAT CAME THROUGH is visible — but the silhouette is INTENTIONALLY UNREADABLE (only a vast indistinct shape that the viewer cannot decode; not a specific named entity). Around the rift, the air shows MEMORY-RIPPLES (the canonical 'considerably longer to forget'). At lower-third, anonymous combatants (back-three-quarter, mixed-faction) recoil from the rift, shielding their eyes. The rift is ALREADY CLOSING (faint translucent closing-edges visible) but the unreadable silhouette is mostly through.",
    moodKeywords: [
      "the rift opened for half a second",
      "what came through took considerably longer to forget",
      "intentionally unreadable silhouette — vast indistinct shape",
      "anonymous combatants recoiling, shielding eyes",
    ],
    palette:
      "Cool-violet-and-warm-amber rift edges + intentionally-unreadable interior silhouette + translucent memory-ripples + anonymous mixed-faction combatants + closing-edges + cool deep-shadow",
    composition:
      "Wider mid-shot, rift at frame-centre, anonymous recoiling combatants at lower-third",
    notes:
      "Rare spell. Anonymous combatants preserve no-character-conflation. The 'unreadable shape' is the visual key — preserves the mystery without committing to a specific entity.",
  },
  {
    cardId: "s1_pack_047",
    sceneDelta:
      "Action mid-shot. An Emergency Protocol — at frame-centre, an anonymous figure (back-three-quarter, generic civilian) mid-FALL — they have just been struck by an off-frame blow at upper-right (visible faint trajectory-line). But CRITICALLY, the moment is FROZEN BETWEEN the blow and the fall: a translucent chrome-and-warm-amber PROTOCOL-FIELD has just activated around the figure, suspending them mid-air at the canonical 'space between the blow and the fall.' The protocol-field is rendered as a translucent geometric shield-pattern. From off-frame, the protocol's trigger-source (a small chrome-and-cool-cyan emergency-emitter visible at frame-edge) is mid-discharge. NO face visible.",
    moodKeywords: [
      "the protocol was designed for catastrophe",
      "it activates in the space between the blow and the fall",
      "figure suspended mid-fall by translucent chrome-and-warm-amber protocol-field",
      "geometric shield-pattern, trigger-emitter at frame-edge",
    ],
    palette:
      "Anonymous civilian back-three-quarter + faint trajectory-line + translucent chrome-and-warm-amber protocol-field + geometric shield-pattern + chrome-and-cool-cyan emergency-emitter + cool deep-shadow",
    composition:
      "Action mid-shot back-three-quarter, figure mid-fall at frame-centre suspended by protocol-field, emitter at frame-edge",
    notes:
      "Common spell. Anonymous figure (back-three-quarter) preserves no-character-conflation. The 'space between blow and fall' is the canonical visualization — the freeze-frame moment.",
  },
  {
    cardId: "s1_pack_048",
    sceneDelta:
      "Wider mid-shot. Elara's Final Gift — at frame-centre, the canonical Elara figure (visual continuity: warm-amber hair, mid-thirties, deep slate-and-warm-gold field-armor) standing at her last-moment in an Insurgency-aligned final-broadcast chamber. CRITICAL pose: she is mid-action of TRANSMITTING outward, both hands extended forward palms-open, faint warm-cream-and-warm-amber FINAL-GIFT-PULSES propagating outward from her body in all directions (the canonical 'gave it to everyone'). Around her, anonymous recipients across the entire frame (back-shots only, mixed-faction silhouettes — Insurgency + Architect + neutral civilians + others) are receiving the gift simultaneously (each silhouette has a faint warm-cream gift-aura around them). Her face shows quiet certainty.",
    moodKeywords: [
      "she had one last thing to give",
      "she gave it to everyone",
      "warm-cream-and-warm-amber final-gift-pulses propagating in all directions",
      "anonymous mixed-faction recipients all receiving simultaneously",
    ],
    palette:
      "Insurgency-aligned deep slate-and-warm-gold field-armor + warm-amber hair + warm-cream-and-warm-amber final-gift-pulses + anonymous mixed-faction recipients + warm-cream gift-aura + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Elara at frame-centre with arms extended, anonymous mixed-faction recipients receiving across frame",
    notes:
      "Epic unit. Visual continuity with Elara Imprint set + gen_neutral. The 'gave it to everyone' is rendered through the visible mixed-faction recipient-distribution — not just Insurgency.",
  },
  {
    cardId: "s1_pack_049",
    sceneDelta:
      "Wider mid-shot. The Inception — at frame-centre, the GENESIS-MOMENT of the entire saga: a vast cool-violet-and-warm-cream PRE-EVERYTHING void-vista. In the very centre of the void, a single luminous point is visibly EXPANDING — the moment-of-beginning. From the point, faint translucent BRANCHING-PATHS extend outward in all directions (each branch a future faction's origin: a path that will become Architect-cyan, a path that will become Insurgency-green, a path that will become Antiquarian-amber, etc — but all still UNCOMMITTED, all still possibility). NO faces, NO factions yet. Around the moment, faint translucent INCEPTION-RIPPLES propagate.",
    moodKeywords: [
      "before the Architect, before the Insurgency, before the Virus and the Dream",
      "there was this — the moment everything began",
      "central luminous expanding point with branching-paths to all future factions",
      "no faces, no factions yet, all still possibility",
    ],
    palette:
      "Cool-violet-and-warm-cream pre-everything void + central luminous point + faint translucent branching-paths in faction-future colors (uncommitted) + translucent inception-ripples + cool deep-shadow",
    composition:
      "Wider mid-shot, central point at frame-centre, branching-paths radiating outward to all directions",
    notes:
      "Legendary unit. NO human figure (the inception is impersonal). The 'moment everything began' is rendered through the literal central-point + branching-paths visualization. Genesis-era event, fully revealed at end of Epoch 2.",
  },
] as const;

/**
 * Neutral faction's prompt registry, keyed by card id.
 *
 * Currently populated: 21 / 79 cards
 * (burnt_card_placeholder, gen_game_master_original, gen_neutral,
 *  gen_programmer, gen_seer, s1_char_004, s1_char_086-093,
 *  s1_pack_043-049).
 */
export const NEUTRAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEUTRAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
