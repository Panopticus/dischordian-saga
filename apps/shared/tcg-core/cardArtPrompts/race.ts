/**
 * Card art prompts — RACE faction (5 races × 3 cards = 15 cards).
 *
 * Race cards are NOT tier-up variants — they are 3 discrete cards
 * per race (uncommon → rare → legendary), numbered
 * `s1_race_<name>_01` / `_02` / `_03`. Each race has its own visual
 * language tied to its faction-affiliation:
 *
 *   - human:     baseline pre-Fall stock (faction-neutral)
 *   - demagi:    Hierarchy of the Damned demon-stock (thought_virus)
 *   - quarchon:  Architect's crystalline silicon-based race (architect)
 *   - synthetic: Architect's built-from-scratch entities (architect)
 *   - neyon:     Dischordian successor-humans (faction-neutral)
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const RACE_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── HUMAN RACE — Ark survivor stock, rebirth + provoke ───
  {
    cardId: "s1_race_human_01",
    sceneDelta:
      "Mid-shot. An Ark Survivor in mid-fifties — visibly aged, weather-beaten skin, generic-civilian features, in worn but clean Ark-issue maintenance coveralls (slate-and-cream, with a single small Insurgency-aligned name-patch over the left chest). They stand at a small shop-bench inside an Ark maintenance bay, mid-action of repairing a piece of cryotube life-support equipment. Behind them, a row of Ark cryotubes recedes into mid-distance — the tubes glow with low cool-cyan suspension-light. The Survivor's hands are calm, careful, methodical. A faint cool-cream rebirth-glow surrounds them at body-edge (rebirth visualized — they have already woken up once and they have stopped being surprised by it). Their face is unhurried, focused, slightly weary; on the bench beside them is an open work-log with the day of the week underlined.",
    moodKeywords: [
      "asleep through Atarion burning",
      "woke up eleven years late",
      "working every Wednesday since",
      "unhurried, methodical, slightly weary",
    ],
    palette:
      "Ark slate-and-cream coverall + cool cyan cryotube-glow + warm shop-bench amber + dirty-yellow Ark deck + faint cool cream rebirth-glow",
    composition:
      "Mid-shot front three-quarter, Survivor at frame-centre at workbench, row of cryotubes receding into mid-distance behind",
    notes:
      "Uncommon unit. Generic-civilian face must NOT match any named character (not Locke, not Iron Lion). The 'every Wednesday' detail from flavor is rendered as the open work-log on the bench. Cool-cyan cryotube-glow is the canonical Ark-environment visual idiom established in the Locke Imprint set (post-Fall Ark continuity).",
  },
  {
    cardId: "s1_race_human_02",
    sceneDelta:
      "Mid-shot. A Senate Legionary in mid-thirties, in archaic pre-Fall Atarion Senate-guard armor — bronze-and-leather scale over a deep crimson under-tunic, a tall ceremonial pike-shaft held vertical in their right hand, a small round shield in their left. They stand alone in a wide marble Senate-corridor at the moment BEFORE the Hierarchy's shock troops arrive — the corridor is empty behind them, but the hush of the scene communicates that the moment is held: doors at the far end of the corridor are visibly being hammered from outside, light spilling between the seams. They face the doors squarely. A faint warm provoke-glow rims their pike-shaft (provoke visualized). Their face is composed, knowing — they have already decided how this ends.",
    moodKeywords: [
      "the last physical guard between Elara Voss and the shock troops",
      "did not survive the meeting — the vote did",
      "doors being hammered from outside",
      "already decided how this ends",
    ],
    palette:
      "Atarion Senate marble cool-cream + bronze-and-leather Legionary armor + deep crimson under-tunic + warm pike-shaft provoke-rim + cool corridor depth-haze + warm spill-light through doors",
    composition:
      "Mid-shot front three-quarter, Legionary at frame-centre alone in corridor, doors being hammered at upper-third deep background",
    notes:
      "Rare unit. Canon: the day Atarion voted for the war (Genesis-era event, fully revealed by end of Epoch 2). Generic-Legionary face must NOT match any named character. Senate-corridor is direct lore-tie to Elara Voss's Atarion. The deliberate doors-being-hammered framing makes the 'they did not survive but the vote did' flavor visible without showing the actual death.",
  },
  {
    cardId: "s1_race_human_03",
    sceneDelta:
      "Wider mid-shot. A single cryotube at the far end of a long Ark cryo-vault hallway — the tube is the Final Potential's, the LAST one in the row, faintly different from all the others (slightly brighter cool-cyan suspension-light, a faint warm-amber rebirth-glow already pulsing UNDERNEATH the cryo-frost on the glass, the indicator-light at top reading the SECOND-TO-LAST stage of cryo-readiness — almost ready to wake, but not yet). Inside the tube, the silhouette of a sleeping human is just barely visible through the frost — gender, ethnicity, age all DELIBERATELY indeterminate and unreadable. Around the tube, a faint warm provoke-glow rim and faint cool rebirth-cream underfoot. Behind, the hallway extends back toward the camera with NINE thousand more identical tubes receding into deep distance, each holding their own indeterminate silhouette. Above the Final Potential's tube, a single warm heal-glow halo (heal-5 on deploy visualized as the saga's wake-up-call already arriving).",
    moodKeywords: [
      "ten thousand humans asleep in the cryo vaults",
      "the Saga has elected to wake them last",
      "the saga already knows which one — and it is not yet time",
      "indeterminate silhouette through frost",
    ],
    palette:
      "Ark deep cool-cyan cryotube + warm amber rebirth-glow underneath + cool corridor depth + warm provoke-rim + warm heal-halo + dirty-yellow Ark deck-plates",
    composition:
      "Wider mid-shot, Final Potential's tube at frame-centre at hallway end, nine-thousand identical tubes receding into deep distance",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: the Final Potential's identity is DELIBERATELY UNREADABLE — gender, ethnicity, age must NOT be visually determined. This card represents the un-arrived-at savior figure; the Saga has not yet elected to wake them. The single-cryotube-among-many composition echoes the 'the one the Saga already knows' framing from flavor. The cool-cyan cryo-vault visual continuity ties to Locke Imprint set.",
  },

  // ─── DEMAGI RACE — Hierarchy demon-stock, drain + deathwatch + provoke ───
  {
    cardId: "s1_race_demagi_01",
    sceneDelta:
      "Mid-shot. A Demagi Footsoldier — humanoid build but visibly NOT human: charcoal-grey hide, a low-set ridge of dark keratinous spines along the shoulders, eyes that read as small gold-flecked black voids, a jaw with two small downward-curving lower tusks. They wear Hierarchy-issue dark-iron field-armor with a single dirty-bronze sigil over the chest. They stand at a Hierarchy-of-the-Damned holding-yard, mid-action of accepting payment from an unseen paymaster — a small clay-cup is held in their hand, half-full of a luminous black ichor (the 'feeling' the engagement generated, made literal). Faint cool drain-glow rims their armor's leading edge (drain visualized — they feed on what they take). Their face is matter-of-fact, professional, the kind of expression a worker has when payday arrived on schedule. Behind them, two more Demagi footsoldiers wait their turn at the paymaster's window.",
    moodKeywords: [
      "paid in whatever feeling the engagement generates",
      "the payroll is always on time",
      "matter-of-fact, professional",
      "luminous black ichor in a clay cup",
    ],
    palette:
      "Thought Virus phosphor-green and black + Hierarchy dirty-bronze + dark-iron armor + cool drain-glow rim + warm holding-yard sodium-light + charcoal-grey demagi hide",
    composition:
      "Mid-shot front three-quarter, Footsoldier at frame-centre with cup, two more Demagi at lower-third behind",
    notes:
      "Uncommon unit. Generic-Demagi face — must communicate 'demon-stock' without leaning on cliché horns/red-skin tropes. The black-ichor-in-clay-cup is the canonical visualization of the 'paid in feelings' mechanic. Faction is thought_virus per definition; palette uses Thought Virus phosphor-green as accent.",
  },
  {
    cardId: "s1_race_demagi_02",
    sceneDelta:
      "Mid-shot. A Demagi Corpse-Reader — older female-presenting Demagi with lined charcoal hide, sharper jawline and longer lower tusks than a footsoldier. She wears the dark-iron forensic-accountant's robe of the Hierarchy — hooded but the hood is back, revealing greying spine-ridges. She kneels at a battlefield's edge over a freshly-fallen body (the body deliberately rendered as anonymous and partly off-frame at lower-right — only the body's leg and the edge of its armor visible). One of her hands rests palm-down on the body's chest; the other holds a bound ledger half-open. Across the page, her writing in dark Hierarchy-script glows faintly cool-green where the deathwatch ledger registers a new line-item. A faint cool drain-glow rims her hand on the body. Her eyes are sharp, professional, attentive — every death is data.",
    moodKeywords: [
      "the Hierarchy's forensic accountants",
      "every death on the board is a line item",
      "a ledger only she knows how to audit",
      "every death is data",
    ],
    palette:
      "Thought Virus phosphor-green ledger-glow + dark Hierarchy iron-robe + charcoal-grey demagi hide + cool drain-rim + dirty-bronze accent + warm battlefield-dusk hue + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Corpse-Reader kneeling at frame-centre with ledger, anonymous fallen body partially in lower-right",
    notes:
      "Rare unit. Anonymous body preserves spoiler-discipline (no specific named character is being audited). The phosphor-green ledger-script is the Thought Virus / Hierarchy textual visual idiom. Generic-female-Demagi features — must NOT match any named character.",
  },
  {
    cardId: "s1_race_demagi_03",
    sceneDelta:
      "Wider mid-shot. Xeth'Raal, Demagi Archlord — a tall, broad-shouldered male Demagi with deep-charcoal hide, an elaborate crown-of-spines along the brow, two long curved lower tusks, eyes the colour of dirty-bronze with a single luminous gold pupil-line down each. He wears full Hierarchy archlord ceremonial-iron armor — heavy plate over his chest with the Hierarchy's full sigil engraved, a long dark-iron cape. He stands in his private war-room, one gauntleted hand resting casually on the corner of an open strategic playbook on a low table — the playbook is the SAME ONE he sent to Agent Zero that arranged the Game Master's death (kept for sentimental reasons). His other hand holds nothing; his posture is relaxed-confident, the posture of someone who has planned thirty-three of the last forty wars and won twenty-nine of them. A faint cool drain-glow rims his armor; faint cool deathwatch-script (phosphor-green) drifts up from the playbook; a faint warm provoke-glow rims his foreground gauntlet. His face is half-amused.",
    moodKeywords: [
      "arranged the Game Master's death by sending Agent Zero his playbook",
      "kept a copy for sentimental reasons",
      "half-amused, relaxed-confident",
      "thirty-three of the last forty wars",
    ],
    palette:
      "Thought Virus phosphor-green + Hierarchy ceremonial-iron + deep-charcoal hide + dirty-bronze pupil-line + cool drain-rim + warm war-room sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Xeth'Raal at frame-centre with hand on playbook, war-room map-table at lower-third",
    notes:
      "Legendary unit. Canon: Xeth'Raal arranged Game Master's death by leaking strategic playbook to Agent Zero (Epoch 2 reveal in Agent Zero Imprint set lore). The retained playbook is the canonical 'sentimental reasons' detail. Three keywords (drain + deathwatch + provoke) rendered as three distinct visual elements. Generic-Archlord face must NOT match any named playable Hierarchy character.",
  },

  // ─── QUARCHON RACE — Architect's silicon crystalline race ───
  {
    cardId: "s1_race_quarchon_01",
    sceneDelta:
      "Mid-shot. A Quarchon Latticework — a humanoid figure constructed entirely of pale-violet faceted crystal-lattice, approximately human-shaped but visibly UNFINISHED: the chest and upper-arms are dense crystal-lattice, the lower legs and head are still partially translucent with internal lattice-veins still being PROPAGATED in slow visible growth-pulses. They stand alone in an Architect crystallization-chamber — the chamber itself is crystalline cool-blue. Around the Latticework's body, a translucent hexagonal-cyan forcefield-shimmer wraps them at body-edge (the canonical Architect forcefield idiom). One faint warm-violet pulse-line runs from chest to head as a new lattice-row commits. Their face is partially-formed — eye-cavities yes, mouth-line yes, nose-ridge no, expression NONE.",
    moodKeywords: [
      "a lattice of intentions the Architect has not yet committed to",
      "the forcefield is what he still reserves the right to",
      "unfinished, propagating, expression none",
      "the chamber is the womb",
    ],
    palette:
      "Architect cold-blue crystallization-chamber + pale-violet faceted lattice + hexagonal-cyan forcefield-shimmer + warm-violet propagation-pulse + chrome chamber-frame",
    composition:
      "Mid-shot front three-quarter, Latticework at frame-centre in chamber, internal lattice-pattern visible through translucent regions",
    notes:
      "Uncommon unit. The hexagonal-cyan forcefield idiom is canon for Architect-faction (established in Architect Allegiance set t3-t6). The Latticework is deliberately UNFINISHED — chest dense, lower body still translucent — communicating 'intentions not yet committed.' Generic-blank features = Architect's lattice-without-personality.",
  },
  {
    cardId: "s1_race_quarchon_02",
    sceneDelta:
      "Mid-shot. A Quarchon Archivist — taller and visibly OLDER than the Latticework (their crystal-lattice is denser, the facets smaller and more numerous, the colour shifted from pale-violet to a deeper amethyst at the body-core, their entire silhouette slightly thicker and heavier). They stand in an Architect archive-hall — tall lattice-shelves stacked with smaller crystal-records receding to either side. The Archivist's chest is partially open, revealing internal lattice-rings rotating slowly at different speeds (the racial 'memory by becoming denser' visualized as nested rings). One faint warm provoke-glow rims their leading shoulder; one faint cool-blue grow-pulse propagates outward from their core, adding a new outermost lattice-row in real-time. Their face is more formed than the Latticework — full eye-sockets with deep-amethyst pupils, a defined mouth-line, but still expressionless. Their posture is patient, immovable.",
    moodKeywords: [
      "remembering by becoming denser",
      "the older one is, the more it weighs",
      "more room in any conversation that thinks it has finished",
      "patient, immovable",
    ],
    palette:
      "Architect cold-blue archive-hall + deep amethyst lattice-core + pale-violet outer-rows + warm provoke-rim + cool grow-pulse + chrome shelving",
    composition:
      "Mid-shot front three-quarter, Archivist at frame-centre with chest-rings visible, lattice-shelves receding to either side",
    notes:
      "Rare unit. The 'memory by density' is rendered as nested rotating rings inside the chest — direct visualization of the racial mechanic. Grow keyword as a propagating outer-ring pulse. Provoke as a rim-glow on the leading shoulder. Generic-Archivist face must NOT match any named character.",
  },
  {
    cardId: "s1_race_quarchon_03",
    sceneDelta:
      "Wider mid-shot. The Crystal Senator — an enormous Quarchon, taller than a human by half-again, of EXTREME density: their lattice has compacted into near-opaque deep-amethyst-and-violet crystal, the facets so small they read as a continuous slightly-sparkling surface. Their silhouette is broad and ceremonial — they wear NO clothing because their body IS the ceremony. They stand at a tall Architect Senate-rostrum, one hand raised in mid-gesture (an opening-remark gesture, held). Their face is deeply lined with crystal-fissures suggesting age but still expressionless. Behind them, the Architect Senate chamber recedes — empty seats on tiered crystal benches, dust-motes in cool-blue ambient light, ALL of which has the quality of having been waiting for 4,700 years. A faint warm provoke-glow rims their leading shoulder; a hexagonal-cyan forcefield around their entire body; a slow cool-blue grow-pulse adds a NEW row of lattice on their crown.",
    moodKeywords: [
      "in session for 4,700 years",
      "has not yet finished his opening remarks",
      "ten health, growing",
      "the body is the ceremony",
    ],
    palette:
      "Architect cold-blue Senate-chamber + deep-amethyst-and-violet near-opaque lattice + hexagonal-cyan forcefield + warm provoke-rim + cool grow-pulse + chrome rostrum",
    composition:
      "Wider mid-shot front three-quarter, Senator at frame-centre raised at rostrum, empty Senate seats receding behind",
    notes:
      "Legendary unit. The 4,700-year session = empty seats waiting. Three keywords (provoke + forcefield + grow) rendered as three distinct visual elements simultaneously. Generic-ceremonial Senator face must NOT match any named character. Architect Senate-chamber visual continuity with Architect Allegiance set t6.",
  },

  // ─── SYNTHETIC RACE — Architect's built-from-scratch entities ───
  {
    cardId: "s1_race_synthetic_01",
    sceneDelta:
      "Mid-shot. A Synthetic Worker — humanoid bipedal entity built of brushed-chrome plates and matte-black joint-mesh, approximately the size of a tall human. Their body's visual language is utilitarian: plain torso plate, simple cylindrical limbs, one small hex-cyan optical lens where each eye would be, a flat speaker-grille where the mouth would be. They stand at an Architect industrial fabrication-bay's input conveyor, mid-action of carrying a heavy crate of crystalline raw-stock. Their posture is purely functional. A faint warm slip of paper drifts up from above their leading shoulder (draw-1 visualized as the Architect-issued task-manifest spawning). Behind them, two more identical Synthetic Workers carry similar crates in mid-distance. The bay's floor is dirty-grey deck-plate; the ceiling-strip lights are cool-cyan.",
    moodKeywords: [
      "designed the week he needed a worker",
      "forgot to ask whether anybody else needed something",
      "purely functional posture",
      "two more identical Workers behind",
    ],
    palette:
      "Architect cool-cyan ceiling-strip + brushed-chrome plates + matte-black joint-mesh + warm amber paper-drift accent + dirty-grey deck-plate + warm crate-rust accent",
    composition:
      "Mid-shot front three-quarter, Worker at frame-centre carrying crate, conveyor and two more Workers at lower-third behind",
    notes:
      "Uncommon unit. Generic-utilitarian synthetic features — must NOT echo any named Architect-aligned character (specifically NOT The Architect's chrome aesthetic from his Imprint set, which is more architectural/elegant). The hex-cyan optical lens is the canonical Architect visual signature. Three identical Workers reinforce the 'designed without consultation' framing.",
  },
  {
    cardId: "s1_race_synthetic_02",
    sceneDelta:
      "Wider mid-shot. A Synthetic Watchtower — taller, heavier-built than a Worker, with a wide reinforced lower-body plinth and a fortified upper-torso, optical lens cluster (FOUR hex-cyan lenses arrayed in a 2×2 pattern instead of the Worker's single pair) at the head, and articulating sensor-arms folded against the back. They stand utterly still at the entrance to an Architect outer-perimeter checkpoint, the geometry of their stance optimized for being a fixed obstacle. A translucent hexagonal-cyan forcefield-shimmer wraps them at body-edge (forcefield visualized). A faint warm provoke-glow rims their leading edge (provoke visualized — they exist to be the first thing engaged). On a small chest-mounted display, a real-time engagement-log scrolls in cool-cyan Architect-script. Behind them, a long Architect compound wall extends to either side; the time of day is cold midnight with cool starlight.",
    moodKeywords: [
      "stand in one place and be a very reliable shape",
      "the enemy has to go through",
      "writes a detailed log afterward",
      "fixed obstacle, four lenses",
    ],
    palette:
      "Architect cool-cyan + hex-cyan optical lenses + brushed-chrome heavy plate + hexagonal-cyan forcefield-shimmer + warm provoke-rim + cool midnight ambient + cool starlight",
    composition:
      "Wider mid-shot front three-quarter, Watchtower at frame-centre at checkpoint, compound wall extending to either side",
    notes:
      "Rare unit. Four hex-cyan lenses in 2×2 differentiate the Watchtower from the Worker (single pair). Engagement-log on chest display is canon-direct from flavor ('writes a detailed log afterward'). Forcefield + provoke dual-keyword rendering matches Architect-faction visual idiom established in Architect Allegiance set.",
  },
  {
    cardId: "s1_race_synthetic_03",
    sceneDelta:
      "Wider mid-shot. A Chrome Archon — a tall ceremonial synthetic, the highest tier of Architect-built parliamentarian-class. Their body is brushed-chrome with deep-cyan inset detailing tracing parliamentary regalia patterns down the chest, a long ceremonial chrome-and-cyan cape, an elongated head with a single horizontal hex-cyan optical bar across where eyes would be (a parliamentary 'sees the whole motion at once' visual), and articulating fingers each tipped with a small cyan record-stylus. They stand at a tall lectern in the Architect parliamentary chamber, one hand resting on an open thick chrome-bound vote-record. The vote-record's pages glow faintly cool-cyan with eighteen-years-of-Wednesdays of motions logged. A translucent hexagonal-cyan forcefield around them; a faint warm provoke-glow rims their leading shoulder; a faint cool deathwatch-script (cool-cyan, NOT phosphor-green which is Hierarchy/Thought-Virus) drifts up from the vote-record (deathwatch visualized as Architect-aligned 'every motion is a body counted' framing). Behind them, the parliamentary chamber recedes — tiered chrome benches, dust-motes in cool-cyan light.",
    moodKeywords: [
      "do not eat, do not sleep, do not forget",
      "the motion anyone voted for on the last eighteen years of Wednesdays",
      "parliamentary regalia patterns",
      "elongated head, horizontal optical bar",
    ],
    palette:
      "Architect cool-cyan parliamentary chamber + brushed-chrome ceremonial body + deep-cyan inset regalia + hexagonal-cyan forcefield + warm provoke-rim + cool deathwatch-script + chrome-bound vote-record",
    composition:
      "Wider mid-shot front three-quarter, Chrome Archon at frame-centre at lectern, parliamentary chamber receding behind",
    notes:
      "Legendary unit. The horizontal optical bar (instead of vertical/round lenses) differentiates Archon-tier from Worker/Watchtower. Three keywords (provoke + forcefield + deathwatch) rendered simultaneously. Cool-cyan deathwatch-script DELIBERATELY differs from Hierarchy phosphor-green — the same mechanic, two completely different visual idioms per affiliation. Generic-Archon must NOT echo The Architect Imprint set (he is the BUILDER, this is one of his BUILT — distinct visual languages).",
  },

  // ─── NE-YON RACE — Dischordian successor-humans, balanced + draw + flying ───
  {
    cardId: "s1_race_neyon_01",
    sceneDelta:
      "Mid-shot. A Ne-Yon Adept — a young human-presenting figure (early-twenties, indeterminate ethnicity, generic-mixed features), in plain Dischordian apprentice-robes (cream-and-warm-grey layered cloth, no visible faction-markers). They sit cross-legged on a low platform in a plain meditation-loft with a wide arched window behind them showing dawn light. Their eyes are half-lidded, focused. One hand is open in their lap; the other is raised, palm-out — a single warm slip of paper drifts up from the open hand toward the upper-third of the frame (draw-1 visualized). A faint warm-amber glow at their temples suggests heightened cognition (the eleven-percent-of-the-brain visualization). No special gear, no aura, no glow-rings — just a quiet practitioner using slightly more of themselves than the room expects.",
    moodKeywords: [
      "the same brain the first humans had",
      "eleven percent — eleven percent more than the other races believe possible",
      "plain meditation-loft at dawn",
      "quiet practitioner, slightly more aware",
    ],
    palette:
      "Dischordian cream-and-warm-grey apprentice-robes + warm dawn ambient light + warm cream meditation-platform + faint amber temple-glow + warm amber paper-drift",
    composition:
      "Mid-shot front three-quarter, Adept seated cross-legged at frame-centre, arched dawn-window behind",
    notes:
      "Uncommon unit. Generic-mixed features must NOT match any named character. The Ne-Yon visual language as a RACE is distinct from the Ne-Yon CLASS (which uses overt class-tokens) — the race is plain, restrained, faction-neutral, with the cognitive heightening rendered ONLY as faint temple-glow.",
  },
  {
    cardId: "s1_race_neyon_02",
    sceneDelta:
      "Wider mid-shot. A Ne-Yon Bondwalker — a thirty-something human-presenting figure, generic-mixed features, in lightweight traveling cream-and-warm-grey wear, mid-flight on the back of a large pet-species (a Dischordian sky-raptor — a falconid bird the size of a small horse, deep-grey plumage flecked with warm-cream, intelligent gold-flecked eyes). The Bondwalker rides bareback (no saddle — the bird agreed to carry them, no contract beyond the agreement). Their posture is leaned-forward in flight-stance, one hand on the bird's shoulder-feathers, the other extended in balance. Both rider and bird have a SHARED faint warm-cream bond-shimmer running between them at the contact-point — the negotiation-as-bond visualized. Below them, a Dischordian valley at midmorning recedes — green meadows, distant terraced hills, a single warm village in the deep distance. Faint cool-cream wind-trails behind both rider and bird (flying visualized).",
    moodKeywords: [
      "any pet species that has agreed to ride them back",
      "the negotiation is the first thing they teach",
      "the academy is sometimes a bird",
      "bareback, no saddle — only the agreement",
    ],
    palette:
      "Dischordian cream-and-warm-grey traveling-wear + deep-grey raptor plumage with warm-cream flecks + warm midmorning sky + green valley below + faint warm-cream bond-shimmer + cool wind-trails",
    composition:
      "Wider mid-shot side three-quarter, Bondwalker and raptor mid-flight at frame-centre, valley receding at lower-third",
    notes:
      "Rare unit. The bareback-no-saddle is the canonical visualization of 'the negotiation is the bond.' Generic-Ne-Yon-rider face must NOT match any named character. Sky-raptor is a Dischordian fauna-species (consistent with established setting) and does NOT need to be a previously-rendered specific creature.",
  },
  {
    cardId: "s1_race_neyon_03",
    sceneDelta:
      "Mid-shot. Kael, First of the Ne-Yon — a woman in her late-twenties at the moment of her first crossing into Ne-Yon, standing at the threshold of a Dischordian gateway-hall at dawn. She is generic-pre-Fall-human in features — long warm-brown hair, warm-amber eyes, a quiet smile. She wears archaic pre-Fall Atarion traveling-clothes (warm cream and dark-leather), simpler than later-era garments. Her posture is forward, mid-step, having just crossed through a low stone-arched gateway. Around her, faint warm-amber gateway-glow lingers (the moment of crossing). Faint cool-cream wing-shape projection-echoes (flying visualized as legacy-projection, NOT literal wings) trail behind her shoulders. Faint warm cream rush-trails leak from her trailing heel. Two warm slips of paper drift up from above her shoulder (draw-2 visualized). Her smile is the SPECIFIC kind of smile that her descendants will carry — a smile that begins at the inner-corner of the eye and reaches the mouth slightly later. The gateway-arch itself is plain, ancient, unornamented. Behind her through the arch, a hint of pre-Fall Atarion architecture; ahead of her, the open Dischordian dawn.",
    moodKeywords: [
      "the first human the Dischordian cosmology let through the gate",
      "every Ne-Yon you meet will be wearing her smile somewhere",
      "without knowing why",
      "smile begins at the inner-corner of the eye",
    ],
    palette:
      "Dischordian warm cream gateway-light + dark-leather Atarion traveling-wear + warm-brown hair + warm-amber eyes + cool wing-shape projection-echoes + warm rush-trails + warm amber paper-drifts",
    composition:
      "Mid-shot front three-quarter, Kael at frame-centre stepping through arched gateway, dawn ahead, pre-Fall Atarion architecture hinted behind",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: Kael as the historical First-of-the-Ne-Yon is established lore by end of Epoch 2. Her IDENTITY-AS-THE-SOURCE (Kael Reborn) is an Act 5 reveal and MUST NOT be visually confirmed here. Render her as a distinctly pre-Fall-historical figure — warm-amber palette, archaic traveling-clothes, no brilliant-white-dominance, no toxic-green outer ring (those are The Source's visual signatures). The smile-detail is canon-direct from flavor and is what every later Ne-Yon inherits. NO visual rhyme with The Source's Imprint card.",
  },
] as const;

/**
 * Race faction's prompt registry, keyed by card id.
 *
 * Currently populated: 5 / 5 races — COMPLETE
 * (Human, Demagi, Quarchon, Synthetic, Ne-Yon).
 */
export const RACE_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(RACE_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
