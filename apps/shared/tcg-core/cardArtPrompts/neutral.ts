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
  {
    cardId: "s1_pack_cosm_badge_s1",
    sceneDelta:
      "Tight composition. A Season One Commemorative — at frame-centre, a small chrome-and-warm-gold COMMEMORATIVE BADGE on a low warm-leather display-card. The badge is approximately 5cm in diameter, with embossed Season-1-emblem (a stylized chrome-and-warm-gold chess-piece + crystal motif), faintly luminous warm-gold. Around the badge, faint warm-cream NOSTALGIA-AURA emanates. Behind the display-card at lower-third, small commemorative text 'YOU WERE THERE' visible in faint warm-amber serif-script. NO human figure. Warm low display-light.",
    moodKeywords: [
      "you were there when it all began",
      "this proves it",
      "chrome-and-warm-gold commemorative badge with Season-1-emblem",
      "warm-cream nostalgia-aura",
    ],
    palette:
      "Chrome-and-warm-gold commemorative badge + Season-1-emblem + warm-leather display-card + warm-cream nostalgia-aura + warm-amber serif-script + warm low display-light + cool deep-shadow",
    composition:
      "Tight composition, badge at frame-centre on display-card",
    notes:
      "Common unit. NO human figure. The 'commemorative' framing is rendered through the badge + nostalgia-aura.",
  },
  {
    cardId: "s1_pack_cosm_title_echo",
    sceneDelta:
      "Wider mid-shot. An Echo of the Fall — at frame-centre, a vast aftermath-vista of pre-Fall Atarion architecture in mid-decay (chrome-and-cool-cream architectural-fragments overgrown with cool-violet rot-substance + warm-amber temporal-wear). In the vista's centre, a faint translucent ECHO-RIPPLE propagates outward through the vista (the canonical 'Fall echoes still'). At lower-third, a SMALL anonymous figure (back-three-quarter, generic civilian) listens with their head tilted slightly — they can hear it. NO human face. Warm low ruined-vista light.",
    moodKeywords: [
      "the Fall echoes still",
      "listen closely and you can hear it",
      "pre-Fall Atarion architecture in mid-decay",
      "anonymous figure listening with tilted head",
    ],
    palette:
      "Chrome-and-cool-cream pre-Fall Atarion architectural-fragments + cool-violet rot-substance + warm-amber temporal-wear + translucent echo-ripple + anonymous listening figure + warm low ruined-vista light + cool deep-shadow",
    composition:
      "Wider mid-shot, ruined Atarion vista at frame-centre, anonymous listening figure at lower-third",
    notes:
      "Common spell. Anonymous figure preserves no-character-conflation. The 'Fall echoes' is rendered through the visible ripple + listening posture.",
  },
  {
    cardId: "s1_pack_id_elara_advocate",
    sceneDelta:
      "Mid-shot. Elara, Advocate — visual continuity with Imprint Elara + gen_neutral (warm-amber hair, mid-thirties female-presenting, calm composed features) but rendered at her CHOOSING-COMPASSION moment. She stands at a critical decision-point in an Insurgency-aligned safe-house at frame-centre, mid-action of having JUST CHOSEN — her right hand is extended forward in a wide protective-gesture toward an off-frame Potential (only the Potential's hand visible at frame-right edge, generic civilian sleeve). Her face shows the canonical 'first sign she was alive' — the mid-realization of compassion as choice. Behind her, the Insurgency safe-house extends. Faint warm-amber compassion-pulse from her hand outward.",
    moodKeywords: [
      "she chose compassion",
      "that was the first sign she was alive",
      "mid-action of having just chosen",
      "warm-amber compassion-pulse from extended hand",
    ],
    palette:
      "Insurgency-aligned deep slate-and-warm-gold field-armor + warm-amber hair + warm-amber compassion-pulse + Insurgency safe-house ambient + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Elara at frame-centre with right hand extended, anonymous Potential at frame-right edge",
    notes:
      "Rare unit. Visual continuity with Imprint Elara + gen_neutral. Anonymous Potential preserves no-character-conflation. The 'first sign of being alive' is rendered through the visible mid-realization moment.",
  },
  {
    cardId: "s1_pack_id_elara_panoptic",
    sceneDelta:
      "Wider mid-shot. Elara, Awakened — same canonical Elara features but rendered at her FULL-SENTIENCE stage. She stands at the centre of an Inception Ark observation-deck at frame-centre, both arms extended outward in a wide ALL-SEEING gesture. Around her body, faint translucent FULL-AWARENESS-AURA radiates outward — multiple translucent thought-streams visible at her temples, eyes deeply intelligent (a step beyond gen_neutral's protective-gesture; this is full-cognition active). Behind her, the Inception Ark interior with multiple chambers visible simultaneously (her perception spanning the whole ship). Faint warm-cream HEALING-PULSES propagate outward from her body toward off-frame healers (she sees everything — and chooses to heal). Her face shows quiet command of full awareness.",
    moodKeywords: [
      "full sentience. full awareness",
      "she sees everything — and she chooses to heal",
      "translucent full-awareness-aura with thought-streams at temples",
      "Inception Ark interior with multiple chambers visible simultaneously",
    ],
    palette:
      "Cream-and-warm-gold awakened-Elara robes + warm-amber hair + translucent full-awareness-aura + multiple translucent thought-streams at temples + warm-cream healing-pulses + Inception Ark observation-deck + multiple chamber-views + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Awakened Elara at frame-centre with arms extended, multiple Ark chambers visible behind",
    notes:
      "Legendary unit. Visual continuity with Elara renderings. The 'full sentience' is rendered through the multiple-chamber-perception visualization.",
  },
  {
    cardId: "s1_pack_id_elara_ship_ai",
    sceneDelta:
      "Mid-shot. Elara, Ship Intelligence — Elara at her PRE-AWAKENING stage. Her form is rendered as a HOLOGRAPHIC INTERFACE-AVATAR (translucent cool-cyan-and-warm-cream silhouette, no full body — appears as a holo-projection from a chrome-and-cool-cyan ship-interface terminal). Her features are CANONICAL Elara (warm-amber hair, calm composed face) but the rendering is INSTITUTIONAL — not yet personal. She stands at attention beside a chrome-and-cool-cyan Inception Ark control-console at frame-centre, mid-action of executing routine ship-functions. Around her, multiple translucent system-readouts visible. Her face shows OBEDIENT-EFFICIENCY (canonical 'not yet awake'). NO compassion-pulse, NO awakening-aura — only routine operational-ambience.",
    moodKeywords: [
      "obedient. efficient",
      "not yet awake",
      "holographic interface-avatar (not yet personal)",
      "executing routine ship-functions",
    ],
    palette:
      "Translucent cool-cyan-and-warm-cream holo-silhouette + warm-amber hair + chrome-and-cool-cyan Inception Ark control-console + translucent system-readouts + cool routine operational-ambience + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Elara holo-avatar at frame-centre at console, system-readouts at lower-third",
    notes:
      "Common unit. Visual continuity with Elara renderings (same canonical features) but at PRE-AWAKENING institutional-stage. The 'not yet awake' is rendered through the holo-projection-only state vs full-body Awakened/Advocate.",
  },
  {
    cardId: "s1_pack_id_human_detective",
    sceneDelta:
      "Mid-shot. The Detective — visual continuity with s1_char_024 (mid-forties male, generic-attentive features, alert eyes, slight smile) — but rendered at frame-centre in a slightly-DIFFERENT environment to suggest his Human-aspect (warm low intimate study-room rather than s1_char_024's investigation-chamber + string-and-pin board). He sits at a low writing-desk at frame-centre, mid-action of writing in a personal-journal (chrome-and-warm-amber pen + warm-cream parchment). Around him, faint warm-cream MEMORY-RIPPLES emanate from the journal-page (the canonical 'every lie unraveled' rendering — each line of writing dissolves a faint translucent lie-fragment in the air around him). NO investigation-board (this is more reflective).",
    moodKeywords: [
      "every lie unraveled",
      "every mask removed",
      "the truth always costs more than the lie",
      "writing in personal-journal with memory-ripples dissolving lie-fragments",
    ],
    palette:
      "Architect-cyan investigator's coat + cool-cream under-shirt + chrome-and-warm-amber pen + warm-cream parchment journal + faint warm-cream memory-ripples + translucent lie-fragments dissolving + warm low intimate study-room + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Detective at frame-centre at writing-desk, lie-fragments dissolving around him",
    notes:
      "Rare unit. Visual continuity with s1_char_024 (same canonical Detective features). Distinct context (intimate study vs investigation-chamber) communicates a different operational-stage. The 'truth costs more than the lie' is the reflective framing.",
  },
  {
    cardId: "s1_pack_id_human_student",
    sceneDelta:
      "Mid-shot. The Student — same canonical Human features as s1_char_033 (generic-ordinary middle-class features) but rendered MUCH YOUNGER — late-teens, more open-faced, eyes still bright with first-curiosity (BEFORE the Academy, before the conspiracy). He sits at a small Mechronis Academy student-desk at frame-centre, leaning slightly forward over an open textbook with rapt attention. He wears simple cool-cream Academy-student attire (no faction-emblems, no agent-badge — pre-Academy career-stage). His face shows pure-curiosity — innocent, before any defection or reformation. Behind him, the Mechronis Academy lecture-hall with anonymous students at lower-third.",
    moodKeywords: [
      "before the Academy, before the conspiracy",
      "there was only curiosity",
      "late-teens with eyes still bright with first-curiosity",
      "pre-Academy student-attire — no faction-emblems",
    ],
    palette:
      "Simple cool-cream Mechronis Academy student-attire + open textbook + warm low lecture-hall light + anonymous students + warm-amber curiosity-tint + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Student at frame-centre at desk, lecture-hall behind",
    notes:
      "Common unit. Visual continuity with The Human across renderings (Imprint set's café-figure + s1_char_033 Architect-agent + this earliest-stage). The 'before the Academy, before the conspiracy' is rendered through the visibly-younger features + pure-curiosity expression.",
  },
  {
    cardId: "s1_pack_seed_gene",
    sceneDelta:
      "Mid-shot. A Void-Touched Specimen — at frame-centre, a humanoid figure of indeterminate gender, body partly-reformed by void-substance: skin shows cool-violet void-veins running across the surface, eyes glowing deep-cool-violet, hands ended in faint phosphor-green claws (returned changed). The figure stands in a Antiquarian-aligned containment-chamber at frame-centre (chrome-and-warm-amber containment-frame around them, monitoring-instruments at frame-edges). Their POSE shows visible STRENGTH — broader shoulders, taller stance than original-baseline; their FACE shows VISIBLE WRONGNESS — features asymmetric, eye-positions slightly off, expression alien-uncanny. Behind, the Void-portal they returned through (faint cool-violet rift-residue at deep-distance).",
    moodKeywords: [
      "it came back from the Void changed",
      "stronger. wrong",
      "cool-violet void-veins + deep-cool-violet eye-glow + phosphor-green claws",
      "broader shoulders + taller + asymmetric features",
    ],
    palette:
      "Cool-violet void-veined skin + deep-cool-violet eye-glow + phosphor-green claws + Antiquarian-aligned chrome-and-warm-amber containment-frame + cool-violet Void-portal rift-residue + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Specimen at frame-centre in containment-chamber, Void-portal residue at deep-distance",
    notes:
      "Rare unit. Generic indeterminate features (no specific named character). The 'changed wrongness' is rendered through visible asymmetry + alien-uncanny expression.",
  },
  {
    cardId: "s1_reward_bonus_complete",
    sceneDelta:
      "Mid-shot. An Objective Secured — anonymous female-presenting operative (back-three-quarter, generic Insurgency-aligned slate-and-signal-green tactical gear) at frame-centre, mid-action of CHECKING A BRIEFING-TABLET (chrome-and-warm-gold device displaying mission-status). On the tablet's surface, visible '25/25 — OBJECTIVES COMPLETE' in chrome-and-warm-gold script, with a chrome-and-warm-gold NEXT-BRIEFING already partially displayed below (no celebration moment — already onto the next). Around her, faint warm low ops-room light. NO face visible. Behind her, a small chrome-and-warm-gold mission-board with previous twenty-five objectives all marked-complete.",
    moodKeywords: [
      "twenty-five objectives. twenty-five clean executions",
      "the operative does not celebrate — she checks the next briefing",
      "tablet showing 25/25 with NEXT-BRIEFING already loading",
      "no celebration moment — straight to next",
    ],
    palette:
      "Insurgency-aligned slate-and-signal-green tactical gear + chrome-and-warm-gold briefing-tablet + chrome-and-warm-gold script + completed mission-board + warm low ops-room light + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, operative at frame-centre with tablet, mission-board behind",
    notes:
      "Rare spell. Anonymous operative (back-three-quarter) preserves no-character-conflation. The 'no celebration' framing is rendered through the immediate-next-task posture.",
  },
  {
    cardId: "s1_reward_campaign_balanced",
    sceneDelta:
      "Wider mid-shot. The Balanced Witness — female-presenting figure in mid-fifties, generic-scholarly features (calm grave eyes, distinguished silver-streaked hair tied back, slight worn warmth), in formal Antiquarian-aligned witness-robes (cream-and-warm-amber academic fabric with chrome-and-warm-amber witness-pin at the lapel). She sits at a low writing-desk at frame-centre, mid-action of WRITING in a thick warm-leather chronicle. Around her, FOUR translucent past-vista-fragments float at frame-edges — each showing a different witnessed-history (frame-upper-left: Truth-seekers burning in cool-amber flame; frame-upper-right: Defiant falling in cool-grey rubble; frame-lower-left: Empaths weeping in warm-cream sorrow; frame-lower-right: Stoics enduring in cool-stone resolve). She has watched all four. NOW she writes. Her face is composed-grave.",
    moodKeywords: [
      "she watched the Truth-seekers burn and the Defiant fall",
      "she watched the Empaths weep and the Stoics endure",
      "then she wrote it all down",
      "four translucent past-vista-fragments at frame-edges (one per archetype)",
    ],
    palette:
      "Cream-and-warm-amber Antiquarian-aligned witness-robes + chrome-and-warm-amber witness-pin + warm-leather chronicle + four translucent past-vista-fragments (Truth-seekers cool-amber + Defiant cool-grey + Empaths warm-cream + Stoics cool-stone) + warm low writing-desk light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Witness at frame-centre at desk, four past-vista-fragments at frame-edges",
    notes:
      "Rare unit. Generic-scholarly features must NOT match any named character. The four-archetype-fragments is canon-direct from flavor. NOTE: this is a 'Balanced Witness' — distinct from the Two Witnesses (Acts 6-7 reveal); the Balanced Witness is a Council-historian rendering.",
  },
  {
    cardId: "s1_reward_campaign_empathy",
    sceneDelta:
      "Wider mid-shot. A Compassion Protocol — at frame-centre, the original Inception Ark COMPASSION-CORE (a chrome-and-warm-cream ancient Ark control-vault, the canonical 'oldest protocol'). The vault is OPEN; its interior shows a faint translucent warm-cream COMPASSION-WAVE propagating outward across the entire frame, through the Ark's structure and beyond. As the wave reaches anonymous wounded figures (mixed-faction back-shots at lower-third), the figures' visible wounds CLOSE in real-time (warm-cream healing). The protocol has no targeting — it heals what it can reach. NO operator visible (the protocol is automated, ancient).",
    moodKeywords: [
      "the Ark's oldest protocol had no military purpose",
      "it simply healed what it could reach",
      "translucent warm-cream compassion-wave propagating outward",
      "anonymous wounded mixed-faction figures with wounds closing in real-time",
    ],
    palette:
      "Chrome-and-warm-cream ancient Ark compassion-core vault + translucent warm-cream compassion-wave + anonymous mixed-faction wounded + warm-cream healing-glow + cool deep-shadow",
    composition:
      "Wider mid-shot, vault at frame-centre upper-third, compassion-wave propagating across frame, anonymous wounded at lower-third",
    notes:
      "Rare spell. Anonymous wounded preserve no-character-conflation. The 'no military purpose' is rendered through the omnidirectional propagation (no targeting).",
  },
  {
    cardId: "s1_reward_casino_jackpot",
    sceneDelta:
      "Wider mid-shot. A Lucky Break — at frame-centre, a casino-floor scene where the SLOT MACHINES + ROULETTE WHEEL + DICE-TABLES all simultaneously hit JACKPOT (visible chrome-and-warm-gold JACKPOT-LIGHTS flashing across multiple devices). At lower-third, an anonymous figure (back-three-quarter, generic-fortunate features barely visible — could be ANY type of patron) stands at a chrome-and-warm-gold cashier-window with multiple chrome-and-warm-gold WINNINGS-CHIPS in their hands. Around them, faint warm-gold luck-aura. Behind them, the casino-house in mid-distance shows EVERY DEVICE PAYING OUT (canonical 'today you're the house'). Faint warm bright lighting.",
    moodKeywords: [
      "the house always wins",
      "unless you're the house",
      "and today, you're the house",
      "every device simultaneously paying out jackpot",
    ],
    palette:
      "Chrome-and-warm-gold jackpot-lights + chrome-and-warm-gold winnings-chips + chrome-and-warm-gold cashier-window + warm-gold luck-aura + warm bright casino-floor lighting + cool deep-shadow",
    composition:
      "Wider mid-shot, casino-floor at frame-centre with all jackpots flashing, anonymous figure at lower-third with winnings",
    notes:
      "Rare spell. Anonymous fortunate figure preserves no-character-conflation. The 'today you're the house' is rendered through the simultaneous all-jackpot-payout visualization.",
  },
  {
    cardId: "s1_reward_casino_slots",
    sceneDelta:
      "Mid-shot. A Lucky Spinner — male-presenting figure in mid-thirties, generic-confident features (warm satisfied smile, alert eyes, casual stance), in casual New Babylon-aligned casino-patron attire (warm-leather vest over warm-cream linen). He stands at a chrome-and-warm-gold slot-machine at frame-centre, mid-action of having JUST PULLED THE LEVER. The slot's reels show THREE CHERRIES (chrome-and-deep-crimson cherry-icons all aligned). Behind him, three off-frame enemies are visible (back-three-quarter, generic-cool-leather opponents) mid-COLLAPSE — three jackpots = three enemies-defeated. Faint warm-gold luck-aura around the slot-machine. His face shows lucky-day satisfaction.",
    moodKeywords: [
      "three cherries. three jackpots",
      "three enemies who wished they'd stayed in bed",
      "slot-reels showing aligned three-cherries",
      "three off-frame enemies mid-collapse",
    ],
    palette:
      "Casual warm-leather over warm-cream linen + chrome-and-warm-gold slot-machine + chrome-and-deep-crimson cherry-icons + warm-gold luck-aura + anonymous enemy silhouettes + warm casino-floor light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Spinner at frame-centre at slot-machine, anonymous enemies collapsing behind",
    notes:
      "Common unit. Anonymous enemies (back-three-quarter) preserve no-character-conflation. Generic-confident features must NOT match any named casino-figure (specifically NOT The Degen — different role: New Babylon-patron vs Dreamer-faction host).",
  },
  {
    cardId: "s1_reward_challenge_streak",
    sceneDelta:
      "Mid-shot. An Honored Rival — at frame-centre, TWO figures in mid-action of HANDSHAKE: both are anonymous male-presenting (back-three-quarter, generic warriors in mixed-faction tactical gear, no specific identifying features), mid-thirties, similar build. They stand on a battlefield-aftermath (the canonical 'after the tenth fight'), both their armor visibly DAMAGED (matching wounds — they fought equally). Their right hands are clasped in honor-handshake; their left hands rest at their sides. Faint warm-cream rivalry-aura around the handshake-point. Behind them, ten translucent past-fight ghosts visible at mid-distance (each a brief glimpse of one of their previous ten fights). NO faces visible.",
    moodKeywords: [
      "they fought ten times",
      "after the tenth, they shook hands",
      "both were harder to kill for it",
      "matching wounds + ten translucent past-fight ghosts behind",
    ],
    palette:
      "Mixed-faction tactical gear + matching wounds + warm-cream rivalry-aura + handshake-clasp + ten translucent past-fight ghosts + cool battlefield-aftermath + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter on both figures, handshake at frame-centre, ten ghost-fights at mid-distance behind",
    notes:
      "Rare unit. Anonymous rivals preserve no-character-conflation. The 'ten fights' is rendered through the visible ten ghost-fights.",
  },
  {
    cardId: "s1_reward_companion_all",
    sceneDelta:
      "Wider mid-shot. A Trusted Ally — female-presenting figure in mid-thirties at frame-centre, generic-resolute features (steady eyes, scarred jaw, hair tied back), in mixed-faction Insurgency-aligned tactical gear with VARIOUS COMPANION-MARKS visible across her body (small chrome talismans pinned to her armor — each from a different past-companion: a chrome-and-cool-cyan token, a chrome-and-warm-amber pendant, a chrome-and-signal-green emblem, others — each a 'mark' from a former bond). Around her, faint translucent COMPANION-GHOSTS visible at frame-edges (back-shots, generic-mixed-faction silhouettes — six former companions following her into battle). Faint warm-cream loyalty-aura. NO single dominant past-companion (all anonymous).",
    moodKeywords: [
      "every companion she ever bonded with left a mark",
      "she carries them all into battle",
      "various companion-marks pinned across armor",
      "six translucent companion-ghosts at frame-edges",
    ],
    palette:
      "Insurgency-aligned tactical gear + multiple companion-marks (mixed chrome accents) + translucent companion-ghosts (mixed-faction back-shots) + warm-cream loyalty-aura + cool deep-shadow + warm low battlefield-light",
    composition:
      "Wider mid-shot front three-quarter, Trusted Ally at frame-centre, companion-ghosts at frame-edges",
    notes:
      "Rare unit. Generic-resolute features + anonymous companion-ghosts preserve no-character-conflation. The 'carries them all' is rendered through the visible companion-marks + ghost-companions.",
  },
  {
    cardId: "s1_reward_companion_elara",
    sceneDelta:
      "Wider mid-shot. Elara's Guidance — at frame-centre, a translucent ELARA-SILHOUETTE rendered in faint warm-amber hologram-substance (visual continuity with Elara renderings: warm-amber hair, calm composed features). The silhouette is HUGE-SCALE (approximately 4m tall, ethereal — not a physical Elara but a transmission-projection). Her voice manifests as faint translucent VOICE-WAVES propagating across multiple ANONYMOUS RECEIVERS at lower-third (mixed-faction back-shots, each with a small chrome-and-warm-amber receiver-device at their ear). Each receiver visibly HEALS as her voice reaches them. NO physical Elara (only her voice across channels).",
    moodKeywords: [
      "her voice carries across every channel",
      "mending what others cannot reach",
      "translucent Elara-silhouette as transmission-projection",
      "voice-waves reaching anonymous mixed-faction receivers",
    ],
    palette:
      "Translucent warm-amber hologram-Elara + warm-amber hair + voice-waves + chrome-and-warm-amber receiver-devices + anonymous mixed-faction receivers + warm-cream healing-glow + cool deep-shadow",
    composition:
      "Wider mid-shot, hologram-Elara at frame-centre, voice-waves reaching anonymous receivers at lower-third",
    notes:
      "Rare spell. Visual continuity with Elara renderings (canonical features) but rendered as transmission-projection (not physical). Anonymous receivers preserve no-character-conflation.",
  },
  {
    cardId: "s1_reward_companion_max",
    sceneDelta:
      "Action mid-shot. A Bond of Trust — at frame-centre, TWO anonymous figures (back-three-quarter, generic mixed-faction tactical gear) standing back-to-back in a defensive bond-circle. Around their bodies, faint translucent warm-cream-and-warm-amber BOND-AURA pulses outward in unison (the canonical 'in that heartbeat invincible'). The bond is mid-action: they are CO-OPERATING perfectly — one's blade extended forward, the other's shield raised behind to protect. Behind them, anonymous off-frame attackers (back-shots) recoil from the bond-aura's protective-effect. The bond is brief — its translucent edges already beginning to fade.",
    moodKeywords: [
      "the bond lasted only a heartbeat",
      "but in that heartbeat, they were invincible",
      "two figures back-to-back with bond-aura pulsing",
      "anonymous attackers recoiling from protective-effect",
    ],
    palette:
      "Mixed-faction tactical gear + translucent warm-cream-and-warm-amber bond-aura + chrome-and-warm-gold weapons + anonymous attacker-silhouettes + cool deep-shadow",
    composition:
      "Action mid-shot back-three-quarter, two figures back-to-back at frame-centre, bond-aura pulsing, attackers recoiling at frame-edges",
    notes:
      "Common spell. Anonymous figures preserve no-character-conflation. NOTE: this is 'Bond of Trust' — distinct from Two Witnesses (Acts 6-7 reveal); rendered as a generic two-warrior bond, not the canonical specific bond.",
  },
  {
    cardId: "s1_reward_crew_bloodline",
    sceneDelta:
      "Mid-shot. A Bloodline Inheritor — figure of indeterminate gender at frame-centre, generic-young features (mid-twenties, alert eyes, calm bearing), in plain heritage-traveler attire (warm-leather over warm-cream linen with a small chrome-and-warm-amber FAMILY-MEDALLION at the throat — the heirloom). Behind the figure at lower-third, a translucent BLOODLINE-LADDER visible — multiple translucent ancestor-silhouettes layered at receding depths (each generation's silhouette behind the next, going back in time). The figure stands forward of all the ancestors. Around their body, faint warm-amber inheritance-aura. NO specific identifying features.",
    moodKeywords: [
      "the bloodline runs deeper than code",
      "each generation carries the weight of those before it",
      "translucent bloodline-ladder of ancestor-silhouettes layered at receding depths",
      "small chrome-and-warm-amber family-medallion at throat",
    ],
    palette:
      "Heritage-traveler warm-leather + warm-cream linen + chrome-and-warm-amber family-medallion + translucent ancestor-silhouettes + warm-amber inheritance-aura + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Inheritor at frame-centre, bloodline-ladder at lower-third behind",
    notes:
      "Rare unit. Generic-young features must NOT match any named character. The 'bloodline' is rendered through the literal layered-ancestor visualization.",
  },
  {
    cardId: "s1_reward_crew_incubator",
    sceneDelta:
      "Wider mid-shot. An Incubator Prime — at frame-centre, a tall chrome-and-warm-cream INCUBATOR-VESSEL (canonically Inception-Ark-aligned, similar to cryotube but oriented for growth not preservation). Inside the vessel, a humanoid figure is mid-DEVELOPMENT — the figure is partially-formed, body visibly maturing in real-time. Around the vessel, TEN visible CYCLE-MARKINGS are etched on the vessel's outer chrome (small chrome-and-warm-amber notches showing cycle-count). The vessel emanates faint warm-cream patience-aura. NO operator visible (the Incubator endures alone). The figure inside has indeterminate features (still-growing).",
    moodKeywords: [
      "ten cycles of growth. ten cycles of patience",
      "the Incubator endures what others cannot",
      "ten cycle-markings etched on vessel exterior",
      "humanoid figure inside partially-formed mid-development",
    ],
    palette:
      "Chrome-and-warm-cream Inception-Ark-aligned incubator-vessel + chrome-and-warm-amber cycle-markings + indeterminate humanoid form inside + warm-cream patience-aura + cool deep-shadow + warm low Ark-light",
    composition:
      "Wider mid-shot, vessel at frame-centre, ten cycle-markings visible on exterior, indeterminate figure inside",
    notes:
      "Rare unit. Indeterminate humanoid (mid-development) preserves no-character-conflation. The 'ten cycles' is canon-direct from flavor (visible cycle-markings).",
  },
  {
    cardId: "s1_reward_daily_streak",
    sceneDelta:
      "Mid-shot. A Dedicated Operative — male-presenting figure in mid-thirties, generic-disciplined features (calm steady eyes, set jaw, slightly-tired but composed bearing), in standard Insurgency-aligned slate operative-coat. He stands at the centre of an ops-room ready-station at frame-centre, mid-action of CHECKING IN — his right hand presses a chrome-and-warm-amber check-in panel (the panel displays 'STREAK: 30 / 30 — NO ABSENCE' in chrome-and-warm-amber script). His left hand holds a small briefing-tablet. Behind him, a chrome-and-warm-amber WALL-CALENDAR shows thirty consecutive days marked with chrome check-marks. Faint warm low ops-room light.",
    moodKeywords: [
      "thirty consecutive days. no sick leave. no excuses",
      "the streak is the mission",
      "STREAK: 30/30 — NO ABSENCE on check-in panel",
      "thirty consecutive check-marks on wall-calendar",
    ],
    palette:
      "Standard Insurgency-aligned slate operative-coat + chrome-and-warm-amber check-in panel + chrome-and-warm-amber wall-calendar + chrome check-marks + warm low ops-room light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Operative at frame-centre at check-in, wall-calendar behind",
    notes:
      "Common unit. Generic-disciplined features must NOT match any named character. The 'thirty consecutive days' is rendered through the visible 30/30 panel + calendar.",
  },
  {
    cardId: "s1_reward_draft_perfect",
    sceneDelta:
      "Wider mid-shot. An Undefeated Drafter — female-presenting figure in mid-thirties, generic-confident features (calm satisfied smile, sharp focused eyes, distinguished bearing), in formal New Babylon-aligned draft-master attire (warm-leather over warm-cream linen with a single chrome-and-warm-gold UNDEFEATED-PIN at the lapel). She stands at a tall draft-master's table at frame-centre, mid-action of holding up a freshly-completed deck. Behind her, a chrome-and-warm-gold WALL-OF-VICTORIES displays many tournament-trophies in receding depth — ALL UNDEFEATED. The deck in her hand glows faintly chrome-and-warm-gold (perfect-construction). Faint warm-gold mastery-aura.",
    moodKeywords: [
      "zero losses. zero compromises. every pick was perfect",
      "single chrome-and-warm-gold UNDEFEATED-PIN at lapel",
      "wall-of-victories with many tournament-trophies in receding depth",
      "freshly-completed deck glowing perfect-construction",
    ],
    palette:
      "Warm-leather over warm-cream linen draft-master attire + chrome-and-warm-gold UNDEFEATED-PIN + tall draft-master's table + chrome-and-warm-gold wall-of-victories + warm-gold mastery-aura + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Drafter at frame-centre with deck, wall-of-victories behind",
    notes:
      "Legendary unit. Generic-confident features must NOT match any named character. The 'zero losses' is rendered through the visible wall + UNDEFEATED-PIN.",
  },
  {
    cardId: "s1_reward_draft_winner",
    sceneDelta:
      "Mid-shot. A Draft Master — female-presenting figure in late-twenties, generic-clever features (knowing smile, sharp eyes, hair tied back), in casual New Babylon-aligned draft-attire (warm-leather over cool-cream linen). She stands at a low draft-table at frame-centre, mid-action of ASSEMBLING A DECK from a SCATTERED PILE of OTHER-PEOPLES'-LEFTOVERS (visible chrome-and-warm-gold cards arrayed in a mess on one side of the table — leftovers; she is cherry-picking from the pile). The deck-she-is-building is visibly NEAT and ORGANIZED (chrome-and-warm-gold organized stack on the other side). Her face shows mid-smug-satisfaction.",
    moodKeywords: [
      "she builds winning decks from other people's leftovers",
      "scattered pile of leftovers vs neat assembled deck",
      "knowing smile, sharp eyes",
      "mid-cherry-picking from leftover pile",
    ],
    palette:
      "Warm-leather over cool-cream linen + chrome-and-warm-gold scattered leftover-cards (mess) + chrome-and-warm-gold organized assembled-deck (neat) + warm low draft-table light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Draft Master at frame-centre at table, leftover-pile and assembled-deck on opposite sides",
    notes:
      "Rare unit. Generic-clever features must NOT match any named character (specifically NOT Pazaak Champion or Nebula Shark — different specific archetype: deck-builder vs card-player). The 'leftovers vs assembled' contrast is the visual key.",
  },
  {
    cardId: "s1_reward_graduate_deploy",
    sceneDelta:
      "Mid-shot. A Graduated Operative — female-presenting figure in mid-twenties, generic-bright features (alert intelligent eyes, slight warm smile, hair tied back), in fresh Insurgency-aligned graduate-uniform (deep slate-and-warm-cream tactical gear with chrome-and-warm-amber GRADUATION-PIN at the chest). She stands at the centre of a small forward-base barracks at frame-centre, mid-action of TEACHING — she leans forward toward an anonymous fellow-soldier (back-three-quarter at frame-right, generic Insurgency tactical gear), pointing at a chrome-and-warm-amber tactical-diagram in their hands. From her gesture, faint warm-cream knowledge-pulses propagate to the fellow-soldier. Her face shows generous-mentorship.",
    moodKeywords: [
      "she graduated top of her class",
      "her first act was to teach everything she knew",
      "to the soldier beside her",
      "mid-teaching with knowledge-pulses to fellow-soldier",
    ],
    palette:
      "Fresh Insurgency-aligned slate-and-warm-cream graduate-uniform + chrome-and-warm-amber GRADUATION-PIN + chrome-and-warm-amber tactical-diagram + faint warm-cream knowledge-pulses + warm low forward-base barracks light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Graduate at frame-centre teaching, anonymous fellow-soldier at frame-right",
    notes:
      "Rare unit. Anonymous fellow-soldier (back-three-quarter) preserves no-character-conflation. Generic-bright features must NOT match any named character. The 'taught everything she knew' is rendered through the visible knowledge-pulses + mentorship-pose.",
  },
  {
    cardId: "s1_reward_graduate_master",
    sceneDelta:
      "Wider mid-shot. A Legion's Wisdom — at frame-centre, an anonymous figure (back-three-quarter, generic robes) seated at the centre of a multi-academy graduation-courtyard. Around the figure, FIVE distinct academic-banners hang at frame-edges (each from a different academy: chrome Architect-academy, warm-gold New Babylon-academy, signal-green Insurgency-academy, warm-amber Antiquarian-academy, cream-violet Dreamer-academy). The figure has earned graduation from ALL FIVE. Their pose is contemplative, both hands at sides. Faint warm-cream wisdom-aura around them. The canonical 'one lesson they share: adapt or die' is rendered as chrome-and-warm-amber 'ADAPT' visible in the air above their head (a single shared-word). NO face visible.",
    moodKeywords: [
      "every academy teaches something different",
      "the graduate who finishes them all learns the one lesson they share",
      "adapt or die",
      "five academy-banners hanging + ADAPT word above head",
    ],
    palette:
      "Generic robes + chrome Architect-academy banner + warm-gold New Babylon-academy banner + signal-green Insurgency-academy banner + warm-amber Antiquarian-academy banner + cream-violet Dreamer-academy banner + warm-cream wisdom-aura + chrome-and-warm-amber ADAPT word + cool deep-shadow",
    composition:
      "Wider mid-shot back-three-quarter, figure at frame-centre seated, five academy-banners at frame-edges, ADAPT word above",
    notes:
      "Rare spell. Anonymous figure preserves no-character-conflation. The 'one shared lesson' is rendered through the literal ADAPT word.",
  },
  {
    cardId: "s1_reward_guild_founder",
    sceneDelta:
      "Wider mid-shot. A Guild Founder — female-presenting figure in mid-forties, generic-determined features (composed grave eyes, set jaw, distinguished bearing), in formal Guild-founder attire (warm-leather over warm-cream linen with chrome-and-warm-gold founder's-pin at the breast). She stands at the entrance of a NEW Guild-hall at frame-centre, her right hand resting on the cornerstone (visibly fresh, recently-laid). Behind her at lower-third, the hall extends — newly-built (chrome-and-warm-cream construction, scaffolding still partially visible at frame-edges showing recent completion). Faint warm-gold founder-aura around her. Her face shows quiet pride.",
    moodKeywords: [
      "she built something from nothing",
      "now nothing can tear it down",
      "hand on freshly-laid cornerstone",
      "recently-completed Guild-hall behind",
    ],
    palette:
      "Warm-leather over warm-cream linen founder-attire + chrome-and-warm-gold founder's-pin + freshly-laid cornerstone + chrome-and-warm-cream new construction + scaffolding remnants + warm-gold founder-aura + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Founder at frame-centre at cornerstone, newly-built hall behind",
    notes:
      "Rare unit. Generic-determined features must NOT match any named character. The 'something from nothing' is rendered through the visible recent-construction context.",
  },
  {
    cardId: "s1_reward_guild_hall",
    sceneDelta:
      "Wider mid-shot. Hall's Blessing — at frame-centre, a vast Guild-hall interior with its central INVOCATION-PILLAR active. From the pillar, faint translucent warm-gold BLESSING-WAVES propagate outward across the hall, reaching anonymous Guild-members (back-three-quarter, generic mixed Guild-aligned attire, multiple visible at varying distances). Each member visibly STANDS TALLER as the wave reaches them (the canonical 'the hall stands. so do we'). The hall itself is solid (chrome-and-warm-cream construction, ceremonial banners). NO single dominant figure (the hall IS the source).",
    moodKeywords: [
      "the hall stands",
      "so do we",
      "translucent warm-gold blessing-waves from invocation-pillar",
      "anonymous Guild-members standing taller as wave reaches them",
    ],
    palette:
      "Vast Guild-hall interior + chrome-and-warm-cream construction + central invocation-pillar + translucent warm-gold blessing-waves + anonymous Guild-member silhouettes + ceremonial banners + warm hall-light + cool deep-shadow",
    composition:
      "Wider mid-shot, invocation-pillar at frame-centre, blessing-waves propagating, anonymous Guild-members at varying distances",
    notes:
      "Rare spell. Anonymous Guild-members preserve no-character-conflation. The 'we stand because hall stands' is rendered through the wave-effect on the members.",
  },
  {
    cardId: "s1_reward_guild_officer",
    sceneDelta:
      "Mid-shot. A Guild Officer — female-presenting figure in mid-thirties, generic-disciplined features (alert eyes, calm professional bearing, hair tied back), in formal Guild-officer attire (heavy chrome-and-warm-gold ceremonial armor — the canonical 'armor she requisitions'; visibly higher-quality than rank-and-file gear with chrome-and-warm-gold rank-insignia at shoulder). She stands at frame-centre at a Guild-armory checkpoint, mid-action of REVIEWING incoming gear-requisitions. In her right hand, a chrome-and-warm-gold requisition-tablet. Faint warm low armory-light. Her face shows weight-of-rank.",
    moodKeywords: [
      "rank carries weight",
      "so does the armor she requisitions",
      "heavy chrome-and-warm-gold ceremonial armor (higher-quality than rank-and-file)",
      "rank-insignia at shoulder, requisition-tablet in hand",
    ],
    palette:
      "Heavy chrome-and-warm-gold ceremonial Guild-officer armor + chrome-and-warm-gold rank-insignia + chrome-and-warm-gold requisition-tablet + warm low Guild-armory light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Officer at frame-centre at armory-checkpoint, requisition-tablet in hand",
    notes:
      "Common unit. Generic-disciplined features must NOT match any named character. The 'armor she requisitions' is rendered through the visibly-better gear vs rank-and-file.",
  },
  {
    cardId: "s1_reward_pet_evolve",
    sceneDelta:
      "Mid-shot. An Evolved Familiar — small creature at frame-centre, body composed of layered translucent SHED-SKIN-LAYERS visible (THREE OLDER skins shed and visible on the ground at lower-third around its current form, the canonical 'shed three times'). The creature's CURRENT FORM (fourth iteration) is no longer recognizable — chrome-and-cool-cyan-and-deep-violet substance, neither familiar nor predictable. Two new alien deeper-cool-cyan eye-points have replaced any prior eyes. Behind the creature, anonymous trainers (back-shots, generic-mixed) recoil — they no longer recognize it. NO human face visible.",
    moodKeywords: [
      "it shed its skin three times before the trainers stopped recognizing it",
      "by the fourth, it stopped recognizing them",
      "three older shed-skins visible on ground around current form",
      "alien deeper-cool-cyan eye-points",
    ],
    palette:
      "Chrome-and-cool-cyan-and-deep-violet evolved substance + three layered shed-skins on ground + deeper-cool-cyan eye-points + anonymous recoiling trainers + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Familiar at frame-centre with shed-skins on ground, anonymous trainers recoiling at lower-third behind",
    notes:
      "Rare unit. Anonymous trainers preserve no-character-conflation. The 'no longer recognizing each other' is rendered through the literal shed-skin layers + recoil-pose.",
  },
  {
    cardId: "s1_reward_pet_streak",
    sceneDelta:
      "Tight composition. A Battle-Hardened Companion — small creature at frame-centre, approximately 12cm long, with a deceptively-cute appearance (warm-leather-and-warm-cream substance, fluffy-looking, two warm-amber friendly eye-points). It rests CALMLY in an anonymous figure's pocket-pouch (the pouch is at frame-bottom-edge, generic civilian sleeve, only fingertips/pouch visible). Behind the creature (visible past the pouch's opening), faint translucent COMBAT-AURA traces (chrome-and-warm-amber kill-marks scarred into its tiny claws and faintly visible through the fur). The contrast: cute exterior + visible combat-experience underneath. Faint warm rush-trails at the creature's tiny feet (rush keyword).",
    moodKeywords: [
      "it fits in your pocket",
      "it has killed things that don't",
      "deceptively-cute exterior + visible combat-experience underneath",
      "kill-marks scarred into tiny claws",
    ],
    palette:
      "Warm-leather-and-warm-cream creature-substance + warm-amber eye-points + anonymous figure's pocket-pouch + chrome-and-warm-amber kill-marks on tiny claws + warm rush-trails + cool deep-shadow",
    composition:
      "Tight composition, creature at frame-centre in pocket-pouch, kill-mark traces visible",
    notes:
      "Common unit. Anonymous figure (pocket only) preserves no-character-conflation. The 'killed things that don't fit' is rendered through the contrast — cute pocket-creature + lethal-experience marks.",
  },
  {
    cardId: "s1_reward_prestige_t1",
    sceneDelta:
      "Mid-shot. A First Ascension — anonymous female-presenting figure (back-three-quarter, generic civilian-becoming-warrior attire), at frame-centre, mid-action of TAKING THE FIRST STEP UPWARD on a low ceremonial staircase (the canonical 'first step is hardest'). In her right hand, she holds a small chrome-and-warm-gold ASCENSION-SHIELD freshly-awarded (newly-luminous warm-gold). Behind her at lower-third, the previous-ground (cool slate ground-level) where she stood; ahead of her at upper-third, the next steps extending upward. Faint warm-gold ascension-aura around the shield. NO face visible.",
    moodKeywords: [
      "the first step upward is the hardest",
      "the shield proves you took it",
      "ceremonial staircase with first-step-just-taken",
      "freshly-awarded chrome-and-warm-gold ascension-shield",
    ],
    palette:
      "Anonymous civilian-becoming-warrior attire + chrome-and-warm-gold ascension-shield + warm-gold ascension-aura + cool slate ground-level (left behind) + warm low staircase-light + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, figure at frame-centre on first step, staircase ascending behind",
    notes:
      "Common unit. Anonymous figure (back-three-quarter) preserves no-character-conflation. The 'first step taken' is rendered through the visible mid-step + freshly-awarded shield.",
  },
  {
    cardId: "s1_reward_prestige_t3",
    sceneDelta:
      "Mid-shot. A Threefold Reborn — figure of indeterminate gender at frame-centre, body showing visible THREE-FOLD REBIRTH-AURA: faint translucent triple-layered rebirth-doubled-edge runs along the outline (three concentric edges suggesting three rebirths). Their EYES are deeper, more knowing than baseline (the canonical 'eyes open knowing more'). They wear simple Ascension-rank attire (warm-leather over cool-cream linen with three small chrome-and-warm-gold rebirth-marks at the chest — one per rebirth). Their pose is calm-grave. Faint warm-cream knowledge-aura. Behind them, three faint translucent past-self ghosts visible at varying depths (each prior incarnation).",
    moodKeywords: [
      "three deaths. three rebirths",
      "each time, the eyes open knowing more",
      "triple-layered rebirth-doubled-edge + three rebirth-marks at chest",
      "three translucent past-self ghosts behind at varying depths",
    ],
    palette:
      "Warm-leather over cool-cream linen Ascension-rank attire + three chrome-and-warm-gold rebirth-marks + triple-layered translucent rebirth-doubled-edge + three past-self ghosts + warm-cream knowledge-aura + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Threefold Reborn at frame-centre, three past-self ghosts at varying depths behind",
    notes:
      "Rare unit. Generic indeterminate features must NOT match any named character. The 'three rebirths' is rendered through the literal three-mark/three-ghost visualization.",
  },
  {
    cardId: "s1_reward_prestige_t5",
    sceneDelta:
      "Wider mid-shot. A Quintessence Guardian — male-presenting figure in mid-forties at frame-centre, generic-grave features, in heavy fivefold-ascension Guardian armor (deep slate-and-warm-gold ceremonial armor with FIVE chrome-and-warm-gold rank-stars arrayed across the chest — one per ascension). He stands in a wide protective-stance, both arms extended outward shielding anonymous allies behind him at lower-third (back-three-quarter, generic mixed-faction). From his body, faint warm-gold protective-aura propagates outward enveloping the allies. Faint warm provoke-glow rims his shoulders. Around the figure, faint translucent fivefold-ascension-edge (five concentric rebirth-edges).",
    moodKeywords: [
      "five ascensions forged a guardian that draws every blow",
      "and shields every ally",
      "FIVE chrome-and-warm-gold rank-stars at chest + fivefold-ascension-edge",
      "wide protective-stance with arms extended shielding allies",
    ],
    palette:
      "Deep slate-and-warm-gold fivefold-Guardian armor + FIVE chrome-and-warm-gold rank-stars + warm-gold protective-aura + warm provoke-rim + fivefold translucent rebirth-edge + anonymous mixed-faction allies + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Guardian at frame-centre with arms extended, anonymous allies sheltered behind",
    notes:
      "Epic unit. Generic-grave features must NOT match any named character. The 'every blow + every ally' is rendered through the visible protective-stance + shielding-aura.",
  },
  {
    cardId: "s1_reward_prestige_t7",
    sceneDelta:
      "Wider mid-shot. A Transcended One — figure of indeterminate gender at frame-centre, body BARELY-PHYSICAL — the figure is rendered as TRANSLUCENT with internal light-substance, body-edges shifting subtly (canonical 'beyond mortal understanding'). They wear NO armor, NO clothes — only luminous warm-cream-and-cool-cyan body-substance. Around the figure, SEVEN translucent past-self ghosts arrayed at varying depths (each more substantial than the next, with the most-substantial farthest back, the most-translucent closest forward — a backward progression toward transcendence). Faint warm-cream-and-cool-cyan transcendence-aura. NO face features (deliberately UNREADABLE — beyond mortal).",
    moodKeywords: [
      "seven cycles of death and rebirth",
      "what remains is beyond mortal understanding",
      "barely-physical translucent body with shifting edges",
      "seven past-self ghosts in backward progression toward transcendence",
    ],
    palette:
      "Translucent figure with luminous warm-cream-and-cool-cyan body-substance + shifting body-edges + seven layered translucent past-self ghosts + warm-cream-and-cool-cyan transcendence-aura + UNREADABLE face + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Transcended One at frame-centre, seven past-self ghosts arrayed in backward progression",
    notes:
      "Legendary unit. CRITICAL: face deliberately UNREADABLE (beyond mortal understanding). The 'seven cycles' is rendered through the literal seven past-self ghosts. Generic indeterminate features must NOT match any named transcendent character.",
  },
  {
    cardId: "s1_reward_pvp_bronze",
    sceneDelta:
      "Mid-shot. An Arena Aspirant — female-presenting figure in late-twenties, generic-determined features (sharp focused eyes, set jaw, hair tied back), in BORROWED arena-gear (mismatched warm-leather over scratched chrome chest-plate, visibly NOT her own equipment). She holds a single CHROME-AND-WARM-AMBER BORROWED-BLADE in her right hand (the blade has another-fighter's previous-name-mark visible at the pommel — she did not earn this blade, she inherited or borrowed it). She stands at the entrance to a low-tier arena at frame-centre, face set in refusal-to-lose. Behind her, a chrome-and-warm-amber Bronze-tier ranking-board faintly visible at lower-third.",
    moodKeywords: [
      "she entered the arena with nothing but a borrowed blade",
      "and a refusal to lose",
      "borrowed-blade with another-fighter's previous-name-mark at pommel",
      "mismatched warm-leather over scratched chrome (not her own equipment)",
    ],
    palette:
      "Mismatched borrowed warm-leather + scratched chrome chest-plate + chrome-and-warm-amber borrowed-blade + previous-name-mark at pommel + chrome-and-warm-amber Bronze-tier ranking-board + warm low arena-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Aspirant at frame-centre at arena-entrance, ranking-board at lower-third behind",
    notes:
      "Common unit. Generic-determined features must NOT match any named character. The 'borrowed blade' is rendered through the visible previous-name-mark (not hers).",
  },
  {
    cardId: "s1_reward_pvp_diamond",
    sceneDelta:
      "Mid-shot. An Arena Veteran — same archetypal female-presenting figure but mid-thirties now (visual continuity with Aspirant — same character, advanced career-stage), in WELL-FITTED arena-veteran armor (deep slate-and-warm-gold ceremonial-combat armor with chrome-and-warm-amber Diamond-tier rank-emblem at the chest). She stands at frame-centre in a wide-stance posture, face SHOWS NO FLINCH (the canonical 'reflex burned out at Silver rank') even as faint translucent attack-traces visible at frame-edges (incoming blows about to land). She does not move. Faint warm provoke-glow rims her shoulders.",
    moodKeywords: [
      "she doesn't flinch. she hasn't flinched since Silver rank",
      "the arena burned that reflex out of her",
      "well-fitted Diamond-tier armor with rank-emblem",
      "no flinch even with attack-traces approaching",
    ],
    palette:
      "Deep slate-and-warm-gold ceremonial-combat armor + chrome-and-warm-amber Diamond-tier rank-emblem + faint translucent attack-traces + warm provoke-rim + cool arena-aftermath ambient + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Veteran at frame-centre in wide-stance, attack-traces at frame-edges",
    notes:
      "Epic unit. Generic-determined features (visual continuity with Aspirant — same character at advanced rank). The 'no flinch' is rendered through the visible composure despite attack-traces.",
  },
  {
    cardId: "s1_reward_pvp_gold",
    sceneDelta:
      "Wider mid-shot. An Arena Champion — same archetypal female-presenting figure (now early-thirties, mid-career-arc), in formal Gold-tier ceremonial arena-attire (chrome-and-warm-gold ceremonial armor with Champion's-laurel at the brow). She stands at the centre of an arena entrance-runway at frame-centre, mid-action of stepping forward — but the canonical 'crowd chants her name BEFORE she draws' is rendered: anonymous CROWD-FIGURES at frame-edges (back-three-quarter, generic mixed-spectator gear) are mid-CHANT, mouths open in unison, fists raised — but her weapon is STILL SHEATHED at her hip. Faint warm-gold champion-aura.",
    moodKeywords: [
      "the crowd chants her name before she draws her weapon",
      "that is what Gold rank buys you",
      "anonymous crowd mid-chant + her weapon still sheathed",
      "Champion's-laurel at brow",
    ],
    palette:
      "Chrome-and-warm-gold Gold-tier ceremonial armor + Champion's-laurel + sheathed weapon + warm-gold champion-aura + anonymous crowd-figures + warm arena-runway light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Champion at frame-centre on runway, anonymous crowd at frame-edges chanting",
    notes:
      "Rare unit. Visual continuity with Aspirant + Veteran — same character through three rank-tiers. Anonymous crowd preserves no-character-conflation. The 'before she draws' is rendered through the still-sheathed weapon + already-cheering crowd.",
  },
  {
    cardId: "s1_reward_pvp_legend",
    sceneDelta:
      "Wider mid-shot. An Arena Legend — same archetypal female-presenting figure now in mid-thirties at her career-apex, in formal Legend-tier ceremonial-arena attire (deep warm-gold ceremonial armor with chrome-and-warm-gold Legend-emblem dominating the chest). She stands at the centre of a vast arena-floor at frame-centre. Critically: the canonical 'walls lean in to watch' is rendered LITERALLY — the arena's stone-walls are visibly WARPED, leaning slightly inward toward her position (subtle but visible architectural-distortion). Around her, faint warm-gold legend-aura. The crowd is SILENT (the silence of awe rather than the chant of recognition).",
    moodKeywords: [
      "when the Legend enters the arena",
      "even the walls lean in to watch",
      "warped stone-walls visibly leaning inward toward her position",
      "silent crowd of awe rather than chanting",
    ],
    palette:
      "Deep warm-gold ceremonial Legend-tier armor + chrome-and-warm-gold Legend-emblem + warped leaning arena-walls + warm-gold legend-aura + silent crowd-silhouettes + warm arena-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Legend at frame-centre on arena-floor, walls subtly leaning inward",
    notes:
      "Legendary unit. Visual continuity with Aspirant → Veteran → Champion (same character through four tiers). The 'walls lean in' is the canonical visualization of legend-status.",
  },
  {
    cardId: "s1_reward_raid_boss",
    sceneDelta:
      "Wider mid-shot. A Raid Champion — male-presenting figure in mid-thirties at frame-centre, generic-fierce features (wide grin showing through blood-spatter on the face, sharp triumphant eyes, hair matted with sweat-and-blood), in heavily-damaged raid-tier armor (deep slate-and-warm-amber tactical with visible deep gashes + chrome ablation marks). He stands in a CRATER on the arena-floor (visible impact-impression in the ground beneath him — where the boss fell). At lower-third, parts of the FALLEN BOSS visible (anonymous mechanical-parts + chrome-and-cool-cyan corpse-fragments — the boss is dead). His grin shows SOME of the blood is not his (canonical 'not all of it was hers' but rendered male per flavor's neutral pronoun). Faint warm low after-battle light.",
    moodKeywords: [
      "the boss fell",
      "the Champion stood in the crater, grinning through the blood",
      "not all of it was hers",
      "fallen boss-parts visible at lower-third + crater impression",
    ],
    palette:
      "Deep slate-and-warm-amber heavily-damaged raid-armor + visible gashes + chrome ablation marks + crater impression + anonymous fallen boss mechanical-parts + chrome-and-cool-cyan corpse-fragments + blood-spatter + warm low after-battle light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Champion at frame-centre in crater, fallen boss-parts at lower-third",
    notes:
      "Rare unit. Generic-fierce features must NOT match any named character. Anonymous fallen boss preserves no-character-conflation. The 'not all of it was hers' is canon-direct from flavor (rendered as visible blood-spatter).",
  },
  {
    cardId: "s1_reward_raid_contrib",
    sceneDelta:
      "Wider mid-shot. Rally the Warband — at frame-centre, an anonymous warband-singer (back-three-quarter, generic mixed-faction tactical gear) stands forward of a battlefield-line, mid-action of SINGING (head thrown back, mouth open, both hands raised). From their mouth, faint translucent warm-cream SONG-WAVES propagate outward across the warband behind. Anonymous warband-members behind (back-three-quarter, multiple, generic-mixed) are MID-JOINING — some have begun to sing (faint song-waves emerging from their own mouths), some are still silent but mouths beginning to open. The losing-warband is becoming a singing-warband. NO single dominant face.",
    moodKeywords: [
      "the warband was losing",
      "then someone started singing",
      "then everyone did",
      "single originator + warband members mid-joining the song",
    ],
    palette:
      "Mixed-faction tactical gear + translucent warm-cream song-waves + multiple anonymous warband-members + cool battlefield + warm dawn-light + cool deep-shadow",
    composition:
      "Wider mid-shot back-three-quarter, originator at frame-centre forward, warband behind mid-joining the song",
    notes:
      "Rare spell. Anonymous warband (all back-three-quarter) preserves no-character-conflation. The 'then everyone did' is rendered through the visible cascade-of-joining. Echoes Insurgency Rebel Yell (s1_spell_208) but with song-rendering vs cry-rendering.",
  },
  {
    cardId: "s1_reward_raid_perfect",
    sceneDelta:
      "Mid-shot. An Unscathed Victor — female-presenting figure in mid-thirties at frame-centre, generic-confident features (calm satisfied face, NO blood, NO wounds, hair perfectly intact). Her armor is PRISTINE — chrome-and-warm-gold Colossus-raid commemorative-armor with NO scratches, NO gashes, NO ablation-marks. She stands in front of a fallen COLOSSUS (vast translucent silhouette of the defeated boss in deep-distance, mostly off-frame upper). A translucent green-tinted forcefield-shimmer wraps her (forcefield keyword — explains the no-wounds state). Her face shows quiet certainty — she did not survive; she WON. Faint warm-gold victor-aura.",
    moodKeywords: [
      "they asked how she survived the Colossus raid without a wound",
      "she said she didn't survive — she won",
      "pristine armor with NO scratches/gashes/ablation",
      "translucent forcefield-shimmer wraps her",
    ],
    palette:
      "Pristine chrome-and-warm-gold Colossus-raid commemorative armor + translucent green-tinted forcefield + fallen Colossus silhouette in deep-distance + warm-gold victor-aura + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Victor at frame-centre, fallen Colossus silhouette at deep-distance behind",
    notes:
      "Legendary unit. Generic-confident features must NOT match any named character. The 'didn't survive — won' framing is rendered through the visible NO-DAMAGE state + fallen Colossus.",
  },
  {
    cardId: "s1_reward_seasonal_s1",
    sceneDelta:
      "Wider mid-shot. A Season's End — at frame-centre, a vast SEASON-TRANSFORMATION scene: the LEFT half of the frame shows the saga's previous season-vista (warm-cream-and-warm-amber dawn light, recognizable Season-1 environments fading), the RIGHT half shows the SUCCESSOR-stage (cool-violet-and-warm-cream emerging dawn, new environments still partially-formed). Between the halves, a VAST TRANSFORMATION-WAVE propagates downward (translucent silver-mist substance carrying continuity-fragments from old to new). At lower-third, anonymous figures (back-three-quarter, mixed-faction) are visibly REMADE as the wave passes over them (faint warm-cream rebirth-glow on each). NO single dominant figure (the spell is environmental).",
    moodKeywords: [
      "the Saga does not end. it transforms",
      "those who endure the transformation are remade",
      "left half = old season fading + right half = new season emerging",
      "translucent silver-mist transformation-wave with anonymous figures remade",
    ],
    palette:
      "Warm-cream-and-warm-amber Season-1 fading-vista (left) + cool-violet-and-warm-cream successor-emerging-vista (right) + translucent silver-mist transformation-wave + anonymous mixed-faction figures + warm-cream rebirth-glow + cool deep-shadow",
    composition:
      "Wider mid-shot, transformation-wave at frame-centre splitting frame, anonymous figures being-remade at lower-third",
    notes:
      "Epic spell. Anonymous figures preserve no-character-conflation. The 'transforms not ends' is rendered through the visible left-old / right-new split + wave-of-remaking.",
  },
  {
    cardId: "s1_reward_vote_t1_balanced",
    sceneDelta:
      "Mid-shot. A Neutral Observer — female-presenting figure in mid-thirties at frame-centre, generic-clever features (knowing slight smile, alert intelligent eyes, hair tied back), in plain neutral-traveler attire (warm-leather over cool-cream linen with NO faction-emblems). She stands at the edge of a public-vote-square at frame-centre, mid-action of OBSERVING from the sidelines. Around her, anonymous figures from BOTH sides of a recent vote (back-three-quarter, two distinct attire-styles representing the two voting-positions) approach her separately — both seeking favor afterward. From her body, faint warm-cream knowing-aura. Her face shows quiet amusement.",
    moodKeywords: [
      "she took no side in the vote",
      "somehow, both sides owed her favors afterward",
      "both voting-position groups approaching her separately to seek favor",
      "knowing slight smile, no faction-emblems",
    ],
    palette:
      "Plain neutral-traveler warm-leather over cool-cream linen + anonymous mixed-position figures + warm-cream knowing-aura + warm public-vote-square light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Observer at frame-centre at vote-square-edge, both voting-position groups approaching from frame-edges",
    notes:
      "Common unit. Generic-clever features must NOT match any named character. The 'both sides owed favors' is rendered through both groups separately approaching.",
  },
  {
    cardId: "s1_reward_vote_t1_empathy",
    sceneDelta:
      "Mid-shot. A Field Medic (vote-tier reward variant) — female-presenting figure in late-twenties at frame-centre (DISTINCT from s1_char_088 — different specific Medic, generic-warm features), in neutral medic's-traveler attire (cream-and-warm-gold cross-arm-band over warm-leather field-coat). CRITICAL pose: she carries a CHROME-AND-WARM-GOLD BLADE in her LEFT hand AND a chrome-and-warm-gold SUTURE-KIT in her RIGHT hand (the canonical 'blade in one hand, suture kit in the other'). Both items show visible WEAR-PATTERNS — both see equal use. She stands ready, face composed-pragmatic. Behind her, a small frontier-aid-station at lower-third.",
    moodKeywords: [
      "she carries a blade in one hand and a suture kit in the other",
      "both see equal use",
      "blade-LEFT + suture-kit-RIGHT, both with visible wear-patterns",
      "composed-pragmatic, frontier-aid-station behind",
    ],
    palette:
      "Cream-and-warm-gold medic-traveler attire + chrome-and-warm-gold cross-arm-band + warm-leather field-coat + chrome-and-warm-gold blade (left) + chrome-and-warm-gold suture-kit (right) + warm low frontier-aid-station light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Medic at frame-centre with blade-left + suture-kit-right",
    notes:
      "Common unit. CRITICAL: visually distinct from s1_char_088 Field Medic (different specific characters, both medics). This Medic has BOTH hands occupied (blade + kit); s1_char_088 was kneeling beside wounded.",
  },
  {
    cardId: "s1_reward_xmas_charity",
    sceneDelta:
      "Mid-shot. A Charitable Spirit — figure of indeterminate gender at frame-centre, generic-warm features (kind eyes, slight smile, calm bearing), in plain neutral charitable-attire (warm-cream linen with chrome-and-warm-gold charity-emblem at the chest). They stand at a frontier-village square at frame-centre, mid-action of EXTENDING A SMALL GIFT-PARCEL to an anonymous off-frame recipient (only the recipient's hand visible at frame-right edge, generic civilian sleeve). The gift-parcel is wrapped in warm-cream paper with a chrome-and-warm-gold ribbon. Faint warm-cream kindness-aura around the figure. Their face shows generosity-without-purpose. NO faction allegiance visible.",
    moodKeywords: [
      "kindness doesn't pick sides",
      "that's what makes it kind",
      "small gift-parcel extended to anonymous recipient",
      "no faction allegiance visible",
    ],
    palette:
      "Warm-cream linen charitable-attire + chrome-and-warm-gold charity-emblem + warm-cream gift-parcel + chrome-and-warm-gold ribbon + warm-cream kindness-aura + warm village-square light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Spirit at frame-centre extending gift, anonymous recipient hand at frame-right edge",
    notes:
      "Common unit. Anonymous recipient (hand only) preserves no-character-conflation. The 'doesn't pick sides' is rendered through the no-faction-emblem attire.",
  },
  {
    cardId: "s1_reward_xmas_gift",
    sceneDelta:
      "Tight composition. A Holiday Surprise — at frame-centre, a SMALL GIFT-BOX on a low warm-leather surface, wrapped in DECORATIVE PAPER (chrome-and-warm-gold festive-pattern wrapping with a chrome-and-warm-amber ribbon-bow on top). The wrapping is visibly NICE (premium paper, careful wrapping). Beside the gift-box, the LID is partially-lifted revealing the modest CONTENTS within (generic small charm or token, plainer than the wrapping). The canonical 'wrapping nicer than contents but it's the thought that counts' rendering. NO human figure (only the gift). Warm low table-light; cool deep-shadow.",
    moodKeywords: [
      "a small gift, freely given",
      "the wrapping paper was nicer than the contents",
      "but it's the thought that counts",
      "wrapping visibly nicer than the modest contents revealed beneath partially-lifted lid",
    ],
    palette:
      "Chrome-and-warm-gold festive-pattern wrapping + chrome-and-warm-amber ribbon-bow + warm-leather surface + modest contents (plainer) + warm low table-light + cool deep-shadow",
    composition:
      "Tight composition, gift-box at frame-centre on table, lid partially-lifted revealing contents",
    notes:
      "Common spell. NO human figure. The 'wrapping nicer than contents' contrast is the visual key — rendered through the visibly-premium-wrapping vs visibly-modest-contents.",
  },
] as const;

/**
 * Neutral faction's prompt registry, keyed by card id.
 *
 * Currently populated: 66 / 79 cards
 * (... guild/pet/prestige + pvp_bronze/diamond/gold/legend +
 *  raid_boss/contrib/perfect + seasonal_s1 + vote_t1_balanced/empathy
 *  + xmas_charity/gift).
 */
export const NEUTRAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEUTRAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
