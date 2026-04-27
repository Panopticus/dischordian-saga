/**
 * Hierarchy of the Damned — Director-tier (14 epics).
 *
 * Middle management. One canon-anchored entry (Fenra reprint), plus
 * 13 newly-named directors covering operational, financial, and
 * organizational roles in the corporate-hell framing. All EPIC
 * rarity, faction `new_babylon`.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "s2_hierarchy_dir_ops_fenra_reprint": {
    cardId: "s2_hierarchy_dir_ops_fenra_reprint",
    name: "Fenra the Moon Tyrant, Director of Operations (Hierarchy Edition)",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "She organized the invasion of seventeen dimensions in a single quarter. Riri's commendation came back stamped CONFIRMED, NEXT QUARTER STRETCH GOAL +30%.",
    sceneDelta:
      "Mid-shot. Fenra in her Director-of-Operations attire — a Hierarchy steel-grey ops uniform with crimson piping over a high-collar black under-tunic, sleeves rolled to forearm. She is mid-thirties, sharp-featured, with grey eyes and short black hair pinned in a tight crop; partial werewolf-aspect rendered as faint canine silhouette overlay around her jaw and the visible tip of one elongated incisor at the resting mouth. She stands at a Hierarchy operations command-pit, leaning over a tactical sand-table that displays three of the seventeen dimensions as scaled topographical surfaces. Her right hand grips a Hierarchy field-marshal's baton tipped with a small obsidian wolf-head. Her left hand rests on the rim of the table mid-gesture. Around the pit: silent ops-staff in lower-rank Hierarchy uniforms working stations. Faint silver moon-glow rims her shoulders.",
    moodKeywords: [
      "the moon tyrant indoors",
      "operations as ritual procession",
      "stretch goal +30% quarterly",
      "wolf-aspect reading as managerial bearing",
    ],
    palette:
      "Hierarchy steel-grey ops uniform + crimson piping + black under-tunic + tactical sand-table cool-cyan topographical-glow + warm command-pit overhead lighting + faint silver moon-rim",
    composition:
      "Mid-shot three-quarter, Fenra at frame-centre leaning over the sand-table, dimensional topographical surfaces visible at lower-third, ops-staff in soft-focus background",
    notes:
      "Epic — alt-art reprint of s1_char_066 Fenra the Moon Tyrant. The s1 base art is full-werewolf battle pose; this Director edition shows the management side — werewolf aspect dialed back to a faint silhouette and one incisor only. The Hierarchy field-marshal baton is the Director-of-Operations signature for this card.",
    loreCitations: [
      "apps/shared/tcg-core/cards/definitions/new_babylon/s1_char_066_fenra_the_moon_tyrant.ts",
      "docs/built/LORE_BIBLE.md §Fenra the Moon Tyrant",
      "docs/built/LORE_BIBLE.md §Riri'Ahlia / commendation framing",
    ],
  },

  "s2_hierarchy_dir_synergy_vampire": {
    cardId: "s2_hierarchy_dir_synergy_vampire",
    name: "The Synergy Vampire, Director of Cross-Functional Initiatives",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "She does not drain souls. She drains *initiative bandwidth*. By the end of the meeting, every team has agreed to do her work for her, and she has gained nothing — except, of course, the meeting.",
    sceneDelta:
      "Mid-shot. A pale lean Quarchon-aligned figure in a Hierarchy bone-white blazer over a high-collar plum blouse, fanged smile catching warm boardroom uplight. She stands at a glass-walled cross-functional-meeting room, mid-presentation, pointing at a wall projection that reads (legibly) 'Q3 SYNERGY OPPORTUNITIES — CROSS-PILLAR ALIGNMENT' in Hierarchy script. Around the meeting table: six Hierarchy analysts of varying rank, each with a small drained-faint quality (faint translucent threads connect their chests to her outstretched left hand). Her right hand holds a presentation pointer mid-gesture. The boardroom's overhead fluorescents are deliberately too-bright.",
    moodKeywords: [
      "the meeting that drained six other teams' quarters",
      "synergy as predation",
      "smile of the willing collaborator",
      "translucent draining-threads",
    ],
    palette:
      "Hierarchy bone-white blazer + plum blouse + warm boardroom uplight + cool-cyan projection + faint translucent draining-threads + over-bright overhead fluorescent",
    composition:
      "Mid-shot three-quarter, Synergy Vampire at frame-left mid-gesture, meeting-table and analysts arrayed at frame-right, projection on far wall",
    notes:
      "Epic. Fanged smile is the canon Synergy Vampire signature; the draining-threads must read as faint enough to suggest rather than confirm — the LORE_BIBLE framing is bureaucratic vampirism, not literal blood-drinking.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Cross-functional-initiative directors are the Hierarchy's most invasive middle-management archetype; the vampire metaphor is a corporate-satire trope made literal in the Hierarchy framing.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Varkul the Blood Lord (vampiric framing precedent)",
    ],
  },

  "s2_hierarchy_dir_metrics_oracle": {
    cardId: "s2_hierarchy_dir_metrics_oracle",
    name: "The Metrics Oracle, Director of Performance Analytics",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Three KPIs governed her quarter. Two she cannot disclose. The third, she will optimize — and the consequence of that optimization, you will recognize from your own annual review.",
    sceneDelta:
      "Mid-shot. A figure in Hierarchy office-plain charcoal, hooded by a hood that conceals the upper face entirely; only the chin is visible — calm, mouth a flat line. She sits cross-legged atop a low pedestal at the centre of a Hierarchy dashboard-room — every wall is a curved surface displaying live KPI graphs in cool-cyan and warning-amber, the graphs constantly redrawing as the Hierarchy's metrics shift. Three of the graphs are framed in rusted-bronze frames (the special three KPIs); the rest in plain steel. Her hands are extended palm-up, holding nothing, but small holographic numerical readouts hover an inch above each palm. The room's lighting is pure dashboard-glow — no other source.",
    moodKeywords: [
      "the unseen face under the hood",
      "three KPIs you cannot read",
      "dashboard-room as oracle's chamber",
      "calm of the optimizing function",
    ],
    palette:
      "Hierarchy office-charcoal + hood concealing upper face + cool-cyan and warning-amber dashboard wall + rusted-bronze frame around the three special KPI displays + pure dashboard-glow ambient",
    composition:
      "Mid-shot front-on, Metrics Oracle at frame-centre cross-legged on pedestal, curved dashboard walls forming a 270-degree arc behind her",
    notes:
      "Epic. The hooded face is intentional — the LORE_BIBLE framing for analytics-roles is faceless function. The three rusted-bronze-framed KPIs are the canon Metrics Oracle signature; specific values must be illegible (faint blur) so this card doesn't accidentally encode any plot-significant Hierarchy metric.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Pairs with Iglarath CISO (six eyes, six feeds): both functions read the Hierarchy's data, but the Metrics Oracle reads what is being measured, not what is being breached.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_dir_bottom_line_decimator": {
    cardId: "s2_hierarchy_dir_bottom_line_decimator",
    name: "The Bottom-Line Decimator, Director of Cost Containment",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "He cuts costs. He cuts headcount. He cuts the function that asks why he keeps cutting. Last quarter, he cut his own assistant — and the quarter still came in under budget, so the action was approved retroactively.",
    sceneDelta:
      "Mid-shot. A heavyset Quarchon executive in a Hierarchy iron-grey three-piece suit, the waistcoat tightly buttoned, a Hierarchy crest at the lapel. He carries a pair of Hierarchy ceremonial silver shears the size of a forearm, held carefully in front of his body in a both-hands grip. His face is jowled, calm, mid-fifties, with the contented expression of someone who has already balanced this week's books. He stands in a Hierarchy department-floor that has been visibly half-emptied — half the cubicles are still populated, half are stripped to bare desk, the difference is sharp and recent. The remaining cubicle workers do not look up. The fluorescents above the empty half are switched off; above the populated half, on.",
    moodKeywords: [
      "the contented decimator",
      "ceremonial shears at the office",
      "half-lit floor, half-dark floor",
      "the heads that did not look up",
    ],
    palette:
      "Hierarchy iron-grey three-piece + Hierarchy crest plum-and-silver + ceremonial silver shears + cool fluorescent populated-side + dim absent-side + warm crest-pin highlight",
    composition:
      "Mid-shot three-quarter, Decimator at frame-centre standing, half-emptied office stretching behind, lighting bisects the frame left-dark / right-lit",
    notes:
      "Epic. The contentment is intentional — the LORE_BIBLE framing of corporate hell is procedural, never gleeful. The lighting bisection is the Decimator's canonical visual signature: lit + unlit halves visualize the cuts.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Pairs with Mor'Vethic CHRO at the operational level — Mor'Vethic terminates individuals; the Decimator terminates teams.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Xeth'Raal Ledger-of-Ruin (cost-containment framing)",
    ],
  },

  "s2_hierarchy_dir_q4_ritualist": {
    cardId: "s2_hierarchy_dir_q4_ritualist",
    name: "The Q4 Ritualist, Director of Year-End Close",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "The fiscal year does not close itself. Three weeks of incantation, two pints of contract-blood, and one mandatory off-site retreat. The numbers are made to balance.",
    sceneDelta:
      "Wide environmental composition. The Q4 Ritualist is a Hierarchy mid-fifties figure in a deep-purple ceremonial close-the-books robe over a charcoal under-suit, sleeves rolled to the elbow, hands stained with translucent contract-blood up to the wrists. He stands at the centre of a Hierarchy fiscal-close chamber — a hexagonal room whose six walls each bear a different Quarter's ledger imprinted in floor-to-ceiling living red-ink glyph-text. At the chamber's centre: a low stone fiscal-altar, on it a single bound copy of the Year-End Trial Balance. He is mid-incantation, both hands flat on the open ledger, the page glyphs lifting off in a slow upward swirl as the totals reconcile in real time. Six small Hierarchy junior-accountants stand at the six wall positions, each holding a ceremonial closing-quill, all in deep-purple under-robes.",
    moodKeywords: [
      "year-end close as high ritual",
      "contract-blood to the wrists",
      "six juniors, six walls, one balance",
      "the totals reconcile by incantation",
    ],
    palette:
      "Deep-purple Hierarchy ceremonial robes + charcoal under-suits + translucent contract-blood + living red-ink ledger-glyphs + cool-grey hexagonal stone walls + warm altar-uplight",
    composition:
      "Wide environmental front-on, Ritualist and altar at frame-centre, six walls and six juniors arranged hexagonally, glyph-swirl rising from ledger",
    notes:
      "Epic. The framing is bureaucracy-as-occult, not occult-with-business-overlay. Contract-blood is the canon Hierarchy fluid (visible on Mol'Garath's contract too). The six juniors must read as participating in routine procedure, not initiates.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The Hierarchy is canonically a fiscal-cycle organization (Xeth'Raal CFO sets quarterly debt rates); a Year-End Close director makes the fiscal cycle a visible ritual moment.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Xeth'Raal / quarterly debt-rate framing",
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_dir_cross_functional_predator": {
    cardId: "s2_hierarchy_dir_cross_functional_predator",
    name: "The Cross-Functional Predator, Director of Stakeholder Alignment",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "He has been seconded to your team. He has been seconded to every team. He attends every stand-up. By Q3, his calendar is the only one that survives.",
    sceneDelta:
      "Mid-shot. A wiry Quarchon executive in a Hierarchy quick-cut navy blazer over a thin black turtleneck, a Hierarchy crest pin at the lapel, a slim rolled-leather portfolio under his left arm. He stands at the convergence of three frosted-glass corridor segments in the Hierarchy mid-floor, each corridor leading to a different team's bullpen. Three holographic calendar-tiles float at chest height — one above each corridor — and each calendar shows the same name 'V. KORAL' booked into every meeting slot. His right hand is mid-gesture, one finger lifted as if interrupting whoever is speaking off-frame. His face is sharp, pleasant, carries the practiced charm of someone who closes with phrases like 'just one quick thing'.",
    moodKeywords: [
      "the stakeholder who eats every quarter",
      "calendar-tiles populated wall-to-wall",
      "just one quick thing",
      "polite predator with a portfolio",
    ],
    palette:
      "Hierarchy navy blazer + black turtleneck + Hierarchy crest plum-silver + frosted-glass corridors cool-cyan + holographic calendar-tile pale-blue + warm corridor-junction overhead",
    composition:
      "Mid-shot three-quarter, Predator at frame-centre at the corridor junction, three corridors radiating outward and three calendar-tiles floating above each",
    notes:
      "Epic. The 'V. KORAL' name on the calendar-tiles is intentional canon for this card; do not change. The predator framing is etiquette-at-knife-edge — pleasant, never overtly menacing.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Cross-functional alignment is the Hierarchy's most-abused middle-management lever; a Director-tier visualization grounds it as a role with character, not just a meeting type.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_dir_pivot_demon": {
    cardId: "s2_hierarchy_dir_pivot_demon",
    name: "The Pivot Demon, Director of Strategic Realignment",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "spell",
    flavorText:
      "Last quarter's strategy is no longer aligned with this quarter's strategy. Next quarter's strategy will not be aligned with this one. The continuity is not the strategy. The continuity is the realignment.",
    sceneDelta:
      "Wide environmental. A Hierarchy strategy-room mid-realignment. The room's central wall holds three large strategic-plan documents projected at scale — labeled 'Q1 STRATEGIC PRIORITIES', 'Q2 STRATEGIC PRIORITIES', 'Q3 STRATEGIC PRIORITIES' — and each document is a visibly different organizational map (different boxes, different connecting lines, different north-star arrow). Mid-frame: the Pivot Demon, a slim Quarchon figure in a Hierarchy chrome-edged consultant's suit (silver pinstripes), arms wide, palms forward, with eight to ten ghostly translucent extra arms fanning out behind the visible two — each ghostly arm is mid-motion sweeping a different organizational box from one chart to another. The figure's face is mid-thirties, smooth-shaven, calm. Around the room: Hierarchy strategy-staff watching the realignment-in-progress with the resigned posture of people who have done this every quarter.",
    moodKeywords: [
      "the demon of constant pivot",
      "translucent extra arms moving boxes",
      "three quarters of three different strategies",
      "staff resigned posture",
    ],
    palette:
      "Hierarchy chrome-edged silver pinstripe suit + cool-cyan strategy projections + warm strategy-room uplight + ghostly translucent extra-arm pale-violet + staff in muted Hierarchy charcoal",
    composition:
      "Wide environmental front-on, Pivot Demon at frame-centre, three strategy-projections behind on the central wall, staff arranged at frame-edges",
    notes:
      "Epic spell card — the Pivot Demon casts realignment, not damage. The eight-to-ten translucent extra arms are the canonical signature; the count must read as 'too many to count cleanly' rather than a specific number. Strategy-projection text must be legible-but-generic (no Act-specific keywords).",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Strategic-realignment-as-constant is the Hierarchy's signature dysfunction; making it a spell card lets the gameplay layer use it for board-state shuffling effects.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Thelv'Oss / long-range strategy framing",
    ],
  },

  "s2_hierarchy_dir_velocity_wraith": {
    cardId: "s2_hierarchy_dir_velocity_wraith",
    name: "The Velocity Wraith, Director of Sprint Cadence",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "The sprint board is full. The retrospective is brief. The team is shipping faster than ever. Nobody can quite remember what they shipped last week. The Velocity Wraith remembers — but the Velocity Wraith is not paid to share.",
    sceneDelta:
      "Mid-shot. A blurred-edge Hierarchy figure in a Hierarchy charcoal-and-blood-red sprint-track-suit (no formal blazer — this is a director who works the floor). She is moving fast even in still-frame: her outline is sharp at the centre and soft-blurred at hands, feet, hair-tips, suggesting motion. Her face is mid-thirties, focused, with the thousand-yard stare of someone who has not paused since stand-up. She stands at a tall standing-desk in a Hierarchy team-room, in front of a wall-mounted sprint board (a digital kanban projection covered in moving cards — DOING / BLOCKED / DONE). Several DONE cards are mid-flying-off-screen as she swipes them away. Her right hand mid-swipe; her left holds a cup of black coffee held perfectly steady despite the motion-blur on her hair.",
    moodKeywords: [
      "the wraith who works through stand-up",
      "motion-blur at the edges, stillness at the centre",
      "DONE cards flying offscreen",
      "coffee perfectly steady",
    ],
    palette:
      "Hierarchy charcoal sprint-suit + blood-red piping + cool-cyan sprint-board projection + warm team-room overhead + motion-blur edge softening + black-coffee accent",
    composition:
      "Mid-shot three-quarter, Velocity Wraith at frame-left mid-swipe, sprint-board projection occupying frame-right two-thirds, DONE cards flying out of frame-right",
    notes:
      "Epic. Motion-blur effect is essential — this card is about velocity, the visual signature is partial blur. The DONE-cards-flying-off-frame motif suggests work is being completed without trace; sprint-board kanban tile-text must be illegible.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Sprint-cadence directors are the Hierarchy archetype that keeps the org always-shipping-and-never-remembering — a productivity layer that erases its own evidence.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_dir_compliance_inquisitor": {
    cardId: "s2_hierarchy_dir_compliance_inquisitor",
    name: "The Compliance Inquisitor, Director of Mandatory Training",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Failure to complete the training will result in further training. Repeated failure will result in extended training. Persistent failure is, at this point, a form of training in itself.",
    sceneDelta:
      "Wide three-quarter portrait. The Compliance Inquisitor is broad, tall, austere — a Hierarchy mid-fifties Quarchon in a high-collar pure-white compliance officer's robe over a charcoal under-suit, with a small silver Hierarchy crest pendant at the throat (the only pinned ornament). She carries a slim leather Hierarchy training binder open across one forearm. She stands at the front of a Hierarchy training auditorium — three rows of lecture-hall seats stretching back into vanishing-point depth, every seat occupied by a Hierarchy worker in muted workplace dress, every face turned forward, every face neutral. A massive projection screen behind her displays the slide title 'MODULE 47: WORKPLACE PROCEDURE & ETERNAL LIABILITY' in Hierarchy script. Her right hand holds a slim presentation pointer mid-gesture toward an animated training-graphic on the slide.",
    moodKeywords: [
      "Module 47 of an unending series",
      "every face neutral, every face forward",
      "compliance as inquisition",
      "the silver crest at the throat, no other ornament",
    ],
    palette:
      "Hierarchy pure-white compliance robe + charcoal under-suit + silver crest pendant + cool-cyan auditorium overhead + warm slide-projection white + audience muted-workplace-charcoal",
    composition:
      "Wide three-quarter, Inquisitor at frame-left in foreground, audience of seats receding to vanishing point at frame-right, projection screen visible behind her on the auditorium back wall",
    notes:
      "Epic. The all-white compliance robe is the canon Inquisitor signature — every other Hierarchy senior wears at least one Hierarchy plum/charcoal/crimson accent; the Inquisitor's white is a deliberate visual outlier. Module number 47 is the canonical Hierarchy training-series in-joke; do not change.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Mandatory-training directors are the Hierarchy's mechanism for endless ritualized friction — the LORE_BIBLE Severance was filed via memo (Shadow Tongue), but enforced via training (this director).",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Severance / enforcement framing",
    ],
  },

  "s2_hierarchy_dir_okr_specter": {
    cardId: "s2_hierarchy_dir_okr_specter",
    name: "The OKR Specter, Director of Goal Cascades",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Every objective has key results. Every key result has sub-objectives. Every sub-objective has its own key results. The cascade is recursive. It is also the Hierarchy's primary export.",
    sceneDelta:
      "Mid-shot. A translucent ghostly Quarchon figure in a Hierarchy rust-violet floor-length suit, see-through enough that the room behind shows through the body's silhouette, but the suit and the open Hierarchy goals-binder he carries in both hands are fully solid. His face is gaunt, formal, calm; eyes are two small empty sockets glowing dim cool-cyan. He stands at the centre of a Hierarchy goal-cascade architecture: a vertical fractal display floating in midair around him — at the top, three large primary OBJECTIVES; from each, branching down, three KEY RESULTS; from each KR, three sub-OBJECTIVES; the recursion continues for at least four observable levels before fading into mist. He is mid-gesture, his left hand turning a page of the binder; his right hand resting palm-up at chest height as if holding the entire fractal in place.",
    moodKeywords: [
      "the recursive cascade",
      "ghost-suit holding the fractal",
      "objectives all the way down",
      "translucent body, solid binder",
    ],
    palette:
      "Hierarchy rust-violet suit + translucent-ghostly body silhouette + cool-cyan eye-glow + cool-grey goals-binder + fractal-cascade light pale-cyan + dim mist receding background",
    composition:
      "Mid-shot front-on, OKR Specter at frame-centre, fractal cascade extending upward from above his shoulders to the top edge of frame, mist behind",
    notes:
      "Epic. The translucent body / solid binder contrast is the canon OKR Specter signature — the Hierarchy's framework persists when its operators do not. The fractal must read as recursive (level → level → level) rather than as separate floating shapes.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Goal-cascade frameworks are the Hierarchy's exported management technology; a ghostly archetype reflects the canon framing that frameworks outlive their creators.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as eternal (frameworks-outlive-creators framing)",
    ],
  },

  "s2_hierarchy_dir_rif_custodian": {
    cardId: "s2_hierarchy_dir_rif_custodian",
    name: "The RIF Custodian, Director of Reduction-in-Force Operations",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "She does not deliver the news. She prepares the room before the news is delivered. The water is filled. The tissues are stocked. The exit-badge is queued. By the time you arrive, the conclusion has been waiting longer than you have.",
    sceneDelta:
      "Mid-shot. A composed mid-forties Quarchon woman in a Hierarchy plum-and-grey blazer over a black blouse, hair pulled into a low knot, no jewelry. She stands at the threshold of a small windowless Hierarchy conversation-room, holding the door half-open with her left hand. The room behind her is impeccably prepared: two chairs facing each other across a small table, on the table a single closed Hierarchy personnel folder, a glass of water, a small box of plain tissues, and a deactivated exit-badge resting face-down. The lighting is gentler than the corridor's — deliberate. Her face is calm-professional, the slight half-smile of someone who has done this so many times the room arranges itself.",
    moodKeywords: [
      "the room arranged before you arrive",
      "tissues stocked, water filled",
      "the gentle indoor light",
      "half-smile of practiced sympathy",
    ],
    palette:
      "Hierarchy plum-and-grey blazer + black blouse + warm conversation-room interior light + cool corridor light contrast + plain personnel-folder cream + glass-of-water clear + face-down exit-badge accent",
    composition:
      "Mid-shot three-quarter, Custodian at frame-left at the doorway, conversation-room interior visible at frame-right, table-arrangement reading clearly",
    notes:
      "Epic. The Custodian is Mor'Vethic CHRO's operational director — Mor'Vethic conducts the conversation, the Custodian prepares the room. The face-down exit-badge is the canon RIF Custodian signature.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Reports to Mor'Vethic CHRO (mythic); the Hierarchy's HR function needs a director-tier operational layer to make Mor'Vethic's role feel like a real organization.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_chro_mor_vethic — operational pairing",
    ],
  },

  "s2_hierarchy_dir_jira_ghoul": {
    cardId: "s2_hierarchy_dir_jira_ghoul",
    name: "The JIRA Ghoul, Director of Backlog Hygiene",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Every ticket has a story. Every story has a parent. Every parent has an epic. The epic was opened in Q1 of the year you were hired. It is, the Ghoul informs you, still in PROGRESS.",
    sceneDelta:
      "Mid-shot. A gaunt mid-fifties Quarchon figure in a stained Hierarchy charcoal cardigan over a faded black t-shirt, sleeves pushed up, fingernails slightly too long. He sits at a cramped Hierarchy backlog-hygiene workstation surrounded by stacked monitors — front centre monitor shows a vast scrolling backlog grid, side monitors show ticket-relationship trees that branch into fractal tangles. His face is grey-toned, the cheekbones sharp, eyes lit only by the monitors' cool-cyan. His right hand is mid-keyboard-shortcut, his left holds a half-eaten energy bar at a forgotten angle. Behind him: an old Hierarchy mug on a cluttered desk-edge, a dusty plastic plant, and a small framed Hierarchy values-statement at a slight tilt.",
    moodKeywords: [
      "the ghoul who never closes a ticket",
      "fractal-tangle relationship trees",
      "energy bar held at forgotten angle",
      "the epic opened in Q1 of the year you were hired",
    ],
    palette:
      "Hierarchy stained charcoal cardigan + faded black t-shirt + cool-cyan monitor light + grey-toned skin + warm-amber over-mug accent + dust-tinged plastic plant",
    composition:
      "Mid-shot front-on, JIRA Ghoul at frame-centre seated, monitors arrayed in a tight semi-circle around him, cluttered desk-edge in foreground",
    notes:
      "Epic. The deliberate lived-in grime is the JIRA Ghoul signature — every other Hierarchy director keeps a tidy desk; this one does not. The fractal-tangle relationship trees must read as overwhelming, not decorative.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Reports to Velocity Wraith (sprint-cadence director); the Ghoul keeps the backlog the Wraith ships from. Pairs as the 'before' and 'during' of Hierarchy delivery.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_velocity_wraith — operational pairing",
    ],
  },

  "s2_hierarchy_dir_townhall_phantom": {
    cardId: "s2_hierarchy_dir_townhall_phantom",
    name: "The Townhall Phantom, Director of All-Hands Communications",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "spell",
    flavorText:
      "He moderates the all-hands. He does not speak in the all-hands. The questions in the chat have been pre-screened. The answers will be circulated by email. The recording will not be made available.",
    sceneDelta:
      "Wide environmental. A Hierarchy all-hands auditorium mid-broadcast — a vast hall with a small raised stage at the far end, on the stage a single tall Hierarchy podium, and standing behind the podium a translucent ghostly figure in a Hierarchy charcoal moderator's suit holding a thin Hierarchy-issued tablet. The figure's translucency is mid-grade — clearly a person, but also clearly not all there. The auditorium's seats stretch back into vanishing-point depth — every seat occupied, every face uniform, every face turned toward the stage. A massive screen behind the podium displays a generic Hierarchy townhall slide titled 'Q3 BUSINESS UPDATE — ALIGNED PATH FORWARD'. Off-stage at the lower-left, a Hierarchy broadcast camera-rig is recording. The camera's recording-light is on. Behind the camera, a sticky-note attached reads 'NOT FOR DISTRIBUTION'.",
    moodKeywords: [
      "the moderator who never speaks",
      "questions pre-screened, answers circulated",
      "recording-light on, distribution off",
      "translucent figure at the podium",
    ],
    palette:
      "Hierarchy auditorium charcoal-and-cream + warm stage-uplight + cool audience-light + translucent ghostly suit-grey + Q3 update slide cool-cyan + camera-rig sticky-note pale-yellow accent",
    composition:
      "Wide environmental three-quarter from upper-side, podium and stage at frame-right, audience receding to frame-left and into vanishing point, camera-rig and sticky-note in foreground at lower-left",
    notes:
      "Epic spell card. Spell because the card's effect is information-control rather than direct combat. The 'NOT FOR DISTRIBUTION' sticky-note is the canon Townhall Phantom signature; the slide title 'ALIGNED PATH FORWARD' is generic enough to not encode any Act-specific reveal.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The Hierarchy's communications stack needs a director-tier counterpart to Shadow Tongue's executive layer; the Phantom is the ghost in the all-hands microphone.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Shadow Tongue (communications-stack pairing)",
    ],
  },

  "s2_hierarchy_dir_onboarding_specialist": {
    cardId: "s2_hierarchy_dir_onboarding_specialist",
    name: "Velm Acrith, Director of Onboarding & Acclimation",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Welcome to the Hierarchy. Here is your laptop. Here is your badge. Here is your first task — and here is the contract you signed last quarter, in which you agreed to it. Velm pauses, gentle as the doorman she resembles. Any questions?",
    sceneDelta:
      "Mid-shot. Velm Acrith is small, kindly-featured, mid-fifties, with the bearing of a hospitality concierge. She wears a Hierarchy soft-cream button-down under a dusty-rose cardigan, a small Hierarchy crest pin at the cardigan lapel, and reading glasses on a thin chain at her neck. She stands at the entrance of a Hierarchy onboarding suite, the door open behind her revealing a row of four immaculately-prepared workstations — each with a new Hierarchy laptop sealed in branded packaging, a fresh Hierarchy badge in a small leather wallet, and a single neatly-folded Hierarchy welcome-shirt. In her hands she holds a single fresh badge in its wallet, opened, ready to hand over. She is mid-extension of the badge to an off-frame new hire. The suite's lighting is warmer than the corridor's, deliberately welcoming.",
    moodKeywords: [
      "the kindly doorman of the Hierarchy",
      "contract you signed last quarter",
      "welcome-shirt folded just so",
      "deliberately warm onboarding light",
    ],
    palette:
      "Hierarchy soft-cream button-down + dusty-rose cardigan + Hierarchy crest plum-silver + warm onboarding-suite uplight + fresh-laptop branded-packaging white + new-badge wallet leather-tan",
    composition:
      "Mid-shot three-quarter, Velm at frame-left at the suite door, prepared workstations visible in soft focus through the doorway at frame-right, badge mid-extension toward off-frame new-hire",
    notes:
      "Epic. The hospitality framing is intentional — Velm is the friendly face of the Hierarchy's induction; the menace is in the clause, not the manner. The contract-signed-last-quarter line in the flavor is the canon onboarding twist; do not soften.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Pairs with the Compliance Inquisitor (training) — Velm onboards, the Inquisitor maintains. Together they bracket the Hierarchy worker's entire tenure.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as sacred law",
    ],
  },
};

export const DIRECTOR_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
