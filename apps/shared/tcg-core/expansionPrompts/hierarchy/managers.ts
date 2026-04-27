/**
 * Hierarchy of the Damned — Manager-tier (18 rares).
 *
 * Middle managers, no canon name in LORE_BIBLE — all 18 are newly-
 * named per the 2026-04-27 plan §Hierarchy naming policy and
 * grounded in the corporate-hell archetype framework. The
 * Managers form the working layer between the Director-tier
 * leadership and the Analyst-tier individual contributors.
 *
 * All RARE rarity, faction `new_babylon`. SceneDelta is tighter
 * than the C-Suite/VP/Director entries (these are not face-cards;
 * they are swarm/tempo cards in gameplay terms) but every entry
 * still carries a distinguishing visual signature so the artist
 * can render them recognizably apart.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "s2_hierarchy_mgr_stand_up_wraith": {
    cardId: "s2_hierarchy_mgr_stand_up_wraith",
    name: "Stand-Up Wraith",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Three questions: yesterday, today, blockers. Twenty-three minutes. By the time the round is complete, somebody is missing.",
    sceneDelta:
      "Mid-shot. A faintly-translucent Quarchon manager in Hierarchy charcoal-and-cream business-casual — open-collar shirt, no tie, badge on lanyard. Stands at the head of a small Hierarchy team-pod, half-circle of six junior analysts gathered in front of a wall-mounted virtual sprint-board. The Wraith's translucency is mid-grade: clearly there, but the analyst directly behind reads through the Wraith's shoulder. The wraith is mid-question, one hand raised, palm-up — the classic 'who's blocked' gesture. Behind: cool Hierarchy team-pod overhead light, sprint-board cool-cyan.",
    moodKeywords: [
      "the daily ritual",
      "translucent manager who consumes the round",
      "twenty-three minutes",
      "palm-up blocker question",
    ],
    palette:
      "Hierarchy charcoal-and-cream business-casual + translucent body + cool team-pod overhead + sprint-board cool-cyan + analyst silhouettes muted",
    composition:
      "Mid-shot three-quarter, Wraith at frame-centre at head of pod, half-circle of analysts forming arc at frame-edges",
    notes:
      "Rare. Translucency is the manager-tier signature for Hierarchy — every Manager has some degree of phasing/absence. Mid-grade for Stand-Up Wraith (you can read through, but not transparently).",
    archetypeRationale:
      "Newly-named per plan. Stand-up ritual is the most-recognizable manager friction-point; making it a Hierarchy card grounds the corporate-satire framing at the rare tier.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_process_imp": {
    cardId: "s2_hierarchy_mgr_process_imp",
    name: "Process Imp",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Every workflow has a step. The Process Imp adds another. The new step requires the Process Imp's approval. The approval requires another step.",
    sceneDelta:
      "Mid-shot. A small wiry Quarchon manager — barely four feet tall — perched on a tall Hierarchy stool at a process-design workstation. Wears Hierarchy steel-grey vest over a black shirt, sleeves rolled to forearm, fingerless leather gloves spattered with toner. Hands manipulate a vast holographic Hierarchy workflow-graph floating in front of him — boxes-and-arrows that he is mid-action of inserting a new approval-step into. His face is sharp-featured, faintly amused, with a small ledger-pen tucked behind one pointed ear. Behind him: a wall of bound Hierarchy process-binders, each slightly thicker than the last.",
    moodKeywords: [
      "the imp who adds approval steps",
      "ledger-pen behind the ear",
      "binders thicker each year",
      "fingerless gloves spattered with toner",
    ],
    palette:
      "Hierarchy steel-grey vest + black shirt + fingerless leather gloves + workflow-graph cool-cyan glow + process-binder forest-green spines + warm task-lamp accent",
    composition:
      "Mid-shot front three-quarter, Imp on stool at frame-centre, holographic workflow-graph extending into frame-right and overhead, process-binder wall in soft focus background",
    notes:
      "Rare. The fingerless gloves and toner-spatter are the canonical Process Imp signature; do not omit. Workflow-graph must read as overcomplicated rather than artfully complex.",
    archetypeRationale:
      "Newly-named per plan. Process-design managers are the Hierarchy's mechanism for institutional friction; an imp archetype works visually because the harm is small per-step but compounding.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_backlog_maw": {
    cardId: "s2_hierarchy_mgr_backlog_maw",
    name: "Backlog Maw",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "structure",
    flavorText:
      "It does not move. It does not speak. It is fed every quarter. Whatever is fed in does not return. The Hierarchy has been feeding it since the founding.",
    sceneDelta:
      "Wide environmental. The Backlog Maw is not a person — it is a STRUCTURE. A vast circular pit set into the floor of a Hierarchy archive-chamber, its rim lined with rusted-bronze Hierarchy filing-tags. From above: a wide oculus reveals the pit descending into total black darkness. Around the rim: small Hierarchy junior-analysts in plain office attire are stacking tightly-bound paper packets onto a slow-moving conveyor that feeds the pit. The packets are visibly slipping into darkness with no echo. The chamber's lighting is cold blue-grey from sourceless overheads.",
    moodKeywords: [
      "the pit that does not echo",
      "fed every quarter since the founding",
      "rusted-bronze filing-tags at the rim",
      "cold blue-grey sourceless light",
    ],
    palette:
      "Hierarchy archive cool blue-grey + rusted-bronze rim-tags + total black pit-darkness + paper-packet cream + analyst-uniform muted-charcoal",
    composition:
      "Wide environmental from upper three-quarter angle looking down into the pit, rim and conveyor at frame-centre, oculus partially visible at upper-frame, analysts arrayed around rim",
    notes:
      "Rare structure. The Backlog Maw is the Hierarchy's canonical archetype for Things That Cannot Be Closed; the pit-darkness must read as absolute (no inner detail).",
    archetypeRationale:
      "Newly-named per plan. JIRA Ghoul (Director) curates the backlog; the Backlog Maw is what the backlog actually IS — the canon visualization of work-that-never-completes.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_jira_ghoul — operational pairing",
    ],
  },

  "s2_hierarchy_mgr_burndown_imp": {
    cardId: "s2_hierarchy_mgr_burndown_imp",
    name: "Burndown Imp",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The burndown chart slopes correctly. The work is on track. The Imp adjusts a parameter. The work was always on track.",
    sceneDelta:
      "Mid-shot close. A small Hierarchy mid-manager imp standing on a Hierarchy floor-tile boardroom-corner, holding a tall holographic burndown-chart slate at chest height. The slate displays a pristine downward-sloping line in cool-cyan. The Imp's free hand rests on a small adjustment-dial at the slate's lower-left, and a faint amber-glow on the dial indicates it has just been turned. The Imp's face is mid-thirties, calm, slightly satisfied. Wears a Hierarchy charcoal vest over a faded black shirt, sleeves rolled, with a small Hierarchy crest pin at the collar.",
    moodKeywords: [
      "the dial that was just turned",
      "the work was always on track",
      "satisfied imp at the burndown-slate",
      "amber dial-glow",
    ],
    palette:
      "Hierarchy charcoal vest + faded black shirt + cool-cyan burndown-line + amber dial-glow + warm corner-lamp + Hierarchy crest plum-silver",
    composition:
      "Mid-shot close, Imp at frame-centre, holographic burndown-slate occupying frame-right two-thirds, boardroom corner in soft focus background",
    notes:
      "Rare. The amber dial-glow is the Burndown Imp's canonical signature — the menace is in the adjustment, never in the chart. Slope and chart-text must read as pristine; the lie is in the parameter.",
    archetypeRationale:
      "Newly-named per plan. Pairs with Velocity Wraith (Director) — Wraith ships, Imp adjusts the appearance of shipping.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_velocity_wraith — operational pairing",
    ],
  },

  "s2_hierarchy_mgr_slack_phantom": {
    cardId: "s2_hierarchy_mgr_slack_phantom",
    name: "Slack-Channel Phantom",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "She types. She stops typing. She types again. The 'is typing' indicator runs for forty minutes. The message, when it arrives, is a single word: 'thoughts?'",
    sceneDelta:
      "Mid-shot. A pale translucent Hierarchy manager in a Hierarchy charcoal cardigan over a faded black shirt, sleeves pushed up, hair pulled into a careless twist. She sits at a Hierarchy mid-floor cubicle work-station; her face is soft-lit by a single chat-application monitor. The monitor displays a Hierarchy chat-channel with a visible 'PHANTOM is typing...' indicator at the bottom of the panel. Above the indicator, a single message bubble has been sent and it reads 'thoughts?' in legible Hierarchy script. Her hands hover above the keyboard, paused mid-air. Her face is contemplative, slightly tired.",
    moodKeywords: [
      "forty minutes of typing-indicator",
      "thoughts?",
      "translucent manager hovering over keys",
      "monitor-glow soft-lit cubicle",
    ],
    palette:
      "Hierarchy charcoal cardigan + faded black shirt + monitor cool-cyan + cubicle muted overhead + 'PHANTOM is typing...' indicator amber + sent-message bubble pale-blue",
    composition:
      "Mid-shot front three-quarter, Phantom at frame-centre seated, monitor occupying frame-right one-third, paused hands above keyboard at frame-bottom",
    notes:
      "Rare. Translucency is moderate — clearly visible but readable through. The 'thoughts?' message text is the canonical Phantom signature; do not change. Type-indicator must be the LIVE animated form (slight motion-blur on the dots).",
    archetypeRationale:
      "Newly-named per plan. Asynchronous-ambush messaging is a Hierarchy manager-tier dysfunction; the Phantom archetype gives it a face.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_estimation_goblin": {
    cardId: "s2_hierarchy_mgr_estimation_goblin",
    name: "Estimation Goblin",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The work is estimated at three points. The work is delivered in three weeks. The points were always correct. It is the weeks that were the problem, the Goblin clarifies, helpfully.",
    sceneDelta:
      "Mid-shot. A short hunched Quarchon manager in a Hierarchy mustard-yellow cardigan over a black t-shirt, sleeves pushed up, fingerless gloves, single Hierarchy crest pin at collar. He sits at a low Hierarchy planning-poker table strewn with a chaotic spread of estimation-cards (each card is a Fibonacci-numbered planning chip). His right hand holds a small mallet mid-strike — about to bang a gavel on the planning table. His left hand holds up a single planning-card with a large '3' visible. His face is fox-like, sharp, faintly grinning, eyes a clever yellow.",
    moodKeywords: [
      "three points, three weeks",
      "the gavel on the planning table",
      "fox-grin clever-yellow eyes",
      "fibonacci chips strewn chaos",
    ],
    palette:
      "Hierarchy mustard-yellow cardigan + black t-shirt + fingerless leather gloves + planning-table cool-grey + planning-cards pale-blue + fox-yellow eye accent",
    composition:
      "Mid-shot front three-quarter, Goblin at frame-centre seated at planning table, chips spread across table-foreground, mallet mid-strike at frame-right",
    notes:
      "Rare. The mustard-yellow cardigan is the Estimation Goblin's canon signature. The clever-yellow eye-tone must be subtle; the framing is competent-but-mischievous, not hostile.",
    archetypeRationale:
      "Newly-named per plan. Estimation friction is a near-universal manager dysfunction; the goblin archetype lets the artist convey the under-promise/over-deliver paradox visually.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_calendar_demon": {
    cardId: "s2_hierarchy_mgr_calendar_demon",
    name: "Calendar Demon",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "She accepts every meeting on your behalf. She declines every meeting on your behalf. The pattern is not visible to you — only to her, and only at the moment of the act.",
    sceneDelta:
      "Mid-shot. A composed Quarchon manager in a Hierarchy charcoal blazer over a deep-violet blouse, mid-thirties, hair in a neat bun. She sits at a Hierarchy team-pod desk, hands hovering over a holographic calendar-grid floating at chest height. Her right hand mid-click on an ACCEPT button; her left hand mid-click on a DECLINE button — both for different meetings on the same calendar at the same time. Her face is calm, unreadable. The calendar-grid shows a chaotic mosaic of accepted, declined, and tentative blocks, all overlapping. A single small Hierarchy crest at her collar.",
    moodKeywords: [
      "accept and decline simultaneously",
      "the pattern visible only to her",
      "neat-bun calm",
      "calendar-grid chaotic mosaic",
    ],
    palette:
      "Hierarchy charcoal blazer + deep-violet blouse + cool-cyan calendar-grid hologram + warm desk-lamp + ACCEPT-button green / DECLINE-button red small accents + Hierarchy crest plum-silver",
    composition:
      "Mid-shot front-on, Calendar Demon at frame-centre seated, holographic calendar-grid filling frame-right two-thirds, hands mid-click in mirrored gesture",
    notes:
      "Rare. The simultaneous-mirror-click is the Calendar Demon's canonical visual signature — the menace is in the parallel decisions made on your behalf without your knowledge.",
    archetypeRationale:
      "Newly-named per plan. Delegated calendar control is a near-universal Hierarchy executive-assistant pattern; the demon archetype emphasizes the hidden-hand framing.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_perf_review_wraith": {
    cardId: "s2_hierarchy_mgr_perf_review_wraith",
    name: "Performance-Review Wraith",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The review is calibrated. The calibration is panel-driven. The panel is pre-aligned. The Wraith is on the panel. The review was decided last quarter.",
    sceneDelta:
      "Mid-shot. A faintly-translucent Hierarchy mid-manager in a charcoal blazer over a Hierarchy plum dress-shirt, no tie. Sits at a small round Hierarchy review-room table across from an empty chair (the reviewee position — empty, the framing is deliberate). On the table: a Hierarchy review-form open, a glass of water, a single small porcelain figurine of an asphodel flower (the Hierarchy HR-suite signature). The Wraith holds a fountain pen mid-stroke over the form's CALIBRATED RATING line. Translucency strong enough that the asphodel figurine shows through her shoulder.",
    moodKeywords: [
      "calibrated rating line",
      "asphodel figurine on the review-table",
      "the empty chair across",
      "the review was decided last quarter",
    ],
    palette:
      "Hierarchy charcoal blazer + plum dress-shirt + warm review-room interior + cool corridor light through doorway behind + asphodel figurine pale-grey + fountain-pen mid-stroke ink-black",
    composition:
      "Mid-shot front three-quarter, Wraith at frame-left at the review-table, empty reviewee-chair at frame-right foreground, asphodel-figurine and review-form on table between them",
    notes:
      "Rare. Asphodel figurine echoes Mor'Vethic CHRO's asphodel plant + Nessith Audit VP's asphodel print — intentional design echo across all Hierarchy HR/calibration roles. CALIBRATED RATING line on the form should be visibly inked but illegible at distance.",
    archetypeRationale:
      "Newly-named per plan. Reports operationally to Mor'Vethic CHRO; the Hierarchy's performance-review function needs a manager-tier IC counterpart to make the calibration system feel like a real org.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_chro_mor_vethic — calibration pairing",
    ],
  },

  "s2_hierarchy_mgr_reorg_specter": {
    cardId: "s2_hierarchy_mgr_reorg_specter",
    name: "Reorg Specter",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "The org chart is inviolate. The Specter does not violate it. The Specter merely re-renders it. The fact that the new rendering bears no resemblance to the old is, technically, an aesthetic choice.",
    sceneDelta:
      "Wide environmental. A Hierarchy planning-room with a vast wall-mounted org-chart projection. The chart is mid-rerender — the upper half of the visible projection shows the OLD org structure (boxes, reporting lines), the lower half shows the NEW org structure (different boxes, different reporting lines), and a horizontal seam mid-frame separates them where the rerender is still propagating. Standing centre-frame is the Reorg Specter — a translucent Hierarchy manager-figure in a steel-grey blazer over a black under-shirt, both arms wide, palms outward, mid-incantation. Translucent ghost-arms (six total beyond the visible two) extend from his shoulders, each hand on a different box in the chart. Around him: empty Hierarchy planning-room, no other staff present.",
    moodKeywords: [
      "the rerender propagating mid-projection",
      "no resemblance to the old chart",
      "ghost-arms each on a different box",
      "empty planning-room",
    ],
    palette:
      "Hierarchy steel-grey blazer + black under-shirt + cool-cyan org-chart projection + horizontal rerender-seam pale-amber + translucent ghost-arms pale-violet + empty planning-room muted-neutral",
    composition:
      "Wide environmental front-on, Specter at frame-centre, org-chart projection occupying entire background wall, rerender-seam visible across frame mid-height",
    notes:
      "Rare spell card. Pairs visually with Pivot Demon (Director) but at the structural-org level rather than strategic level. The horizontal rerender-seam is the Reorg Specter's canonical signature.",
    archetypeRationale:
      "Newly-named per plan. Reorganization-without-warning is a Hierarchy structural-friction pattern; pairs with Pivot Demon (strategy) and Townhall Phantom (comms) as the trio of Hierarchy disruption-spells.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_pivot_demon — disruption-spell pairing",
    ],
  },

  "s2_hierarchy_mgr_pivot_memo_phantom": {
    cardId: "s2_hierarchy_mgr_pivot_memo_phantom",
    name: "Pivot-Memo Phantom",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The memo arrives at 4:47pm on Friday. The subject reads 'Quick Note'. The note is six pages. The pivot is announced in paragraph four. The Phantom has already gone home.",
    sceneDelta:
      "Mid-shot. A translucent Hierarchy manager in a Hierarchy charcoal cardigan over a faded blue dress-shirt, mid-action of standing up from a desk and reaching for an office-door handle in a single motion — caught mid-motion, body angled toward the exit. On the desk behind him: an open laptop showing a sent-email confirmation 'QUICK NOTE — SENT 4:47pm'. The desk's overhead lamp is in mid-power-down (lamp filament dimming). The wall-clock visible behind reads exactly 4:47pm on a Friday. His face is mid-departure, neutral, not looking back at the desk.",
    moodKeywords: [
      "4:47pm Friday",
      "the memo titled 'Quick Note'",
      "lamp dimming as he leaves",
      "Phantom mid-motion at the door",
    ],
    palette:
      "Hierarchy charcoal cardigan + faded-blue dress-shirt + warm desk-lamp dimming + cool corridor light through open doorway + laptop screen-glow pale-cyan + wall-clock muted",
    composition:
      "Mid-shot side-three-quarter, Phantom at frame-left mid-motion toward the doorway at frame-right, desk and laptop visible in extreme background centre",
    notes:
      "Rare. The 4:47pm timing is the Phantom's canonical signature — not 5:00pm exactly, the pre-departure thirteen minutes are intentional. Mid-motion posture must read as already-leaving, not preparing to leave.",
    archetypeRationale:
      "Newly-named per plan. End-of-week strategic-pivot memos are a Hierarchy timing-attack pattern; the Phantom archetype emphasizes the absence-after-the-act.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_midyear_adjuster": {
    cardId: "s2_hierarchy_mgr_midyear_adjuster",
    name: "Mid-Year Adjuster",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The fiscal year is a contract. Contracts can be amended. The amendments are retroactive. The retroactivity is, the Adjuster confirms, also amendable.",
    sceneDelta:
      "Mid-shot. A precise Hierarchy mid-manager in a Hierarchy plum suit-coat over a charcoal under-shirt, half-moon reading glasses on a chain, gloves of fine grey leather. Stands at a Hierarchy contract-amendment table, the table strewn with bound Hierarchy fiscal-contract folios. Her right hand holds a stamp mid-press onto an open contract page; the stamp is shaped like the Hierarchy crest with the additional inscription RETROACTIVELY AMENDED visible on the impression already made on the page. Her left hand holds a small fountain pen, mid-poise. Her face is mid-fifties, professional, no-frills.",
    moodKeywords: [
      "RETROACTIVELY AMENDED",
      "amendments to the amendments",
      "fine grey leather gloves",
      "half-moon reading glasses on a chain",
    ],
    palette:
      "Hierarchy plum suit-coat + charcoal under-shirt + fine grey leather gloves + warm contract-amendment table-uplight + stamp-impression deep-red + fountain-pen ink-black",
    composition:
      "Mid-shot three-quarter, Adjuster at frame-centre standing at table, contract folios spread across foreground, stamp mid-press on open page",
    notes:
      "Rare. The RETROACTIVELY AMENDED stamp inscription is the Adjuster's canon signature; do not change the wording. Pairs operationally with Q4 Ritualist (Director) — the Adjuster amends mid-year, the Ritualist closes year-end.",
    archetypeRationale:
      "Newly-named per plan. Mid-year fiscal amendments are a Hierarchy mechanism for moving the goalposts; the Adjuster grounds it as a role rather than an event.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_q4_ritualist — fiscal-cycle pairing",
    ],
  },

  "s2_hierarchy_mgr_quarterly_forecaster": {
    cardId: "s2_hierarchy_mgr_quarterly_forecaster",
    name: "Quarterly Forecaster",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "He produces the forecast. The forecast is wrong. He produces the next forecast. The previous forecast was, he explains, externally-impacted.",
    sceneDelta:
      "Mid-shot. A Hierarchy mid-manager in a Hierarchy navy blazer over a striped charcoal-and-cream dress-shirt, no tie, sleeves slightly cuffed. Stands at a Hierarchy forecasting-room standing-desk, both hands resting on the desk's edge, leaning slightly forward to study a wall-sized projection of a Hierarchy quarterly forecast — the projection shows three lines: a HISTORICAL line (steady trend), a FORECAST line (overconfident upward arc), and an ACTUAL line (well below the forecast, just visible at the lower edge). His face is calm, focused, mid-explanation. His mouth is slightly open as if speaking off-frame; one hand has lifted from the desk to gesture toward the projection.",
    moodKeywords: [
      "externally-impacted",
      "forecast above, actual below",
      "the explanation that begins with 'unforeseen'",
      "navy blazer striped shirt",
    ],
    palette:
      "Hierarchy navy blazer + striped charcoal-and-cream shirt + cool-cyan projection lines + warm forecasting-room overhead + standing-desk pale-grey + lower ACTUAL-line slightly muted",
    composition:
      "Mid-shot three-quarter, Forecaster at frame-left leaning over desk, wall-projection occupying frame-right two-thirds, three forecast-lines visible at projection",
    notes:
      "Rare. The HISTORICAL/FORECAST/ACTUAL line composition is the Forecaster's canonical signature. The visual gap between FORECAST and ACTUAL must read as significant but not slapstick — the Hierarchy framing is procedural, not absurd.",
    archetypeRationale:
      "Newly-named per plan. Pairs with Metrics Oracle (Director) — Oracle measures, Forecaster predicts. The two together complete the Hierarchy's data layer.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_metrics_oracle — data-layer pairing",
    ],
  },

  "s2_hierarchy_mgr_roadmap_banshee": {
    cardId: "s2_hierarchy_mgr_roadmap_banshee",
    name: "Roadmap Banshee",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "She maintains the public roadmap. The public roadmap is reassuring. She maintains the private roadmap. The private roadmap is, she promises, much more interesting.",
    sceneDelta:
      "Mid-shot. A Hierarchy product manager in a forest-green blazer over a black collared shirt, mid-thirties, sharp jaw. Stands at a Hierarchy roadmap-room with two adjacent wall-projections — left projection labeled 'PUBLIC ROADMAP' shows a tidy sequenced quarter-by-quarter plan in cool-cyan; right projection labeled 'INTERNAL ROADMAP' shows a chaotic sprawling actual-plan in warning-amber-and-red, with double the items, half marked DEPRIORITIZED, several marked UNDER NDA. Her left hand rests on the public projection; her right hand mid-flick toward the private one as if revealing it. Her mouth is open mid-utterance — a low keen that the artist should suggest as a faint visible distortion-ripple emanating from her throat-area.",
    moodKeywords: [
      "two roadmaps, one true",
      "the keen that distorts the air",
      "DEPRIORITIZED and UNDER NDA",
      "public reassuring, internal chaotic",
    ],
    palette:
      "Hierarchy forest-green blazer + black collared shirt + cool-cyan public-roadmap + warning-amber-and-red internal-roadmap + faint distortion-ripple pale-violet + warm roadmap-room overhead",
    composition:
      "Mid-shot three-quarter, Banshee at frame-centre between two wall-projections, public roadmap at frame-left, internal roadmap at frame-right, mouth-distortion-ripple visible as faint visual artifact",
    notes:
      "Rare. The two-projection contrast is the Banshee's canonical signature; the distortion-ripple from the keen must be subtle (faint visual artifact, not full effects). Roadmap-item text on both projections must be illegible to avoid encoding any Act-specific Hierarchy plans.",
    archetypeRationale:
      "Newly-named per plan. Maintaining-two-roadmaps is a Hierarchy product-management dysfunction; the banshee archetype echoes the auditory-distortion framing of Shadow Tongue at the manager tier.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Shadow Tongue (auditory-distortion framing precedent)",
    ],
  },

  "s2_hierarchy_mgr_token_economy_imp": {
    cardId: "s2_hierarchy_mgr_token_economy_imp",
    name: "Token-Economy Imp",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The token has utility. The utility is the token. The token also rewards loyalty. The loyalty is to the token. The whitepaper is twelve pages and resolves nothing.",
    sceneDelta:
      "Mid-shot. A small wiry Quarchon imp in a Hierarchy charcoal vest over a faded crypto-conference t-shirt (no real-world brand visible — invented Hierarchy crypto-event title), mid-twenties. Sits cross-legged atop a Hierarchy product-team table. In one outstretched palm: a small floating holographic token-glyph rotating slowly, tagged with a circular Hierarchy crest. In the other palm: an open holographic whitepaper showing dense flowchart-style token-utility loops that double back on themselves. His face is bright, animated, mid-pitch — eyes wide, faintly amused. Around him: empty Hierarchy product-room chairs.",
    moodKeywords: [
      "token-utility loops doubling back",
      "twelve pages resolving nothing",
      "the utility IS the token",
      "imp pitching to empty chairs",
    ],
    palette:
      "Hierarchy charcoal vest + faded crypto-event t-shirt + cool-cyan holographic token + warm floor-uplight from below table + pale-violet whitepaper-glow + empty chairs muted",
    composition:
      "Mid-shot front-on, Imp at frame-centre cross-legged on table, both palms extended forward, token at frame-left palm and whitepaper at frame-right palm",
    notes:
      "Rare. The empty-chairs framing is intentional — Hierarchy token-economy initiatives canonically pitch to nobody. The whitepaper-loops must read as recursively-self-referential without being literally readable.",
    archetypeRationale:
      "Newly-named per plan. Token-economy/incentive-design managers are a Hierarchy product-management archetype where the framework justifies itself; the imp archetype emphasizes the playful self-justification.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_vendor_mgmt_wraith": {
    cardId: "s2_hierarchy_mgr_vendor_mgmt_wraith",
    name: "Vendor-Management Wraith",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "The vendor is contracted. The contract is renewed. The renewal terms are slightly worse. The vendor is contracted. The cycle is, the Wraith notes mildly, working as designed.",
    sceneDelta:
      "Mid-shot. A faintly-translucent Hierarchy mid-manager in a Hierarchy steel-grey blazer over a charcoal turtleneck, mid-forties, hair short and silvering at the temples. Sits at a Hierarchy procurement-room conference table, across from a stack of three identical bound Hierarchy vendor-contract folios labeled by year. In her hands: an open fourth folio (the current year's renewal), pen mid-stroke on the signature line. The contract's MARGINALLY WORSE TERMS clause is visible as a small highlighted block on the open page (text faint enough to be illegible). Behind her: a Hierarchy procurement floor-plan map of vendor relationships pinned to a corkboard.",
    moodKeywords: [
      "the cycle is working as designed",
      "marginally worse terms each renewal",
      "translucent procurement-veteran",
      "three identical folios stacked",
    ],
    palette:
      "Hierarchy steel-grey blazer + charcoal turtleneck + warm procurement-room overhead + cool corridor light through doorway behind + folio-stack pale-grey + corkboard-pinned floor-plan muted",
    composition:
      "Mid-shot three-quarter, Wraith at frame-centre seated, folio-stack at frame-foreground, current-folio open in her hands at chest-height, corkboard visible in soft focus background",
    notes:
      "Rare. Translucency is moderate. The MARGINALLY WORSE TERMS highlight is the Wraith's canon signature — the bureaucratic horror is in the pattern, not the action.",
    archetypeRationale:
      "Newly-named per plan. Vendor-management managers operate the Hierarchy's external supply-chain via slow predatory renewals; the wraith archetype emphasizes the institutional-memory advantage that drives the pattern.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_mgr_stakeholder_wrangler": {
    cardId: "s2_hierarchy_mgr_stakeholder_wrangler",
    name: "Stakeholder Wrangler",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Eleven stakeholders agreed to the meeting. Nine attended. Six understood. Four signed. Two remember signing. The proposal is, by every metric the Hierarchy tracks, fully aligned.",
    sceneDelta:
      "Mid-shot. A Hierarchy program manager in a Hierarchy charcoal long-coat over a deep-violet sweater, mid-forties, with the patient bearing of an experienced facilitator. Holds a thin Hierarchy folio open in one hand and a thin presentation-pointer in the other. Stands at the centre of a Hierarchy stakeholder-alignment chamber — a circular room with eleven small Hierarchy podiums arranged in a circle, each with a tiny brass nameplate bearing a generic Hierarchy department-title (PROCUREMENT / STRATEGY / OPS / etc — generic enough to not encode specific Acts). Two podiums are unattended (vacant). Three are occupied by figures depicted as faint silhouettes (deliberate ambiguity — the figures attended but did not engage). Six are occupied by clearer Hierarchy junior-figures. The Wrangler's face is mid-explanation, calm, patient.",
    moodKeywords: [
      "eleven podiums, four signatures",
      "patient facilitator at the centre",
      "vacant podiums, silhouette podiums",
      "fully aligned by every metric tracked",
    ],
    palette:
      "Hierarchy charcoal long-coat + deep-violet sweater + warm chamber overhead + brass nameplates muted-warm + Hierarchy junior-figures muted-charcoal + vacant podiums muted-grey",
    composition:
      "Mid-shot front-on, Wrangler at frame-centre, eleven podiums arrayed in a 270-degree arc around her with the foreground arc opening toward the viewer",
    notes:
      "Rare. The eleven-podium count is the Wrangler's canonical signature; the variable engagement-states across the eleven (vacant, silhouette, present) visualize the canon framing of Hierarchy stakeholder-alignment dysfunction.",
    archetypeRationale:
      "Newly-named per plan. Pairs with Cross-Functional Predator (Director) — Predator wedges into every team, Wrangler convenes them all and then declares alignment.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_cross_functional_predator — alignment-stack pairing",
    ],
  },

  "s2_hierarchy_mgr_channel_conflict_goblin": {
    cardId: "s2_hierarchy_mgr_channel_conflict_goblin",
    name: "Channel-Conflict Goblin",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Two channels. One customer. Two reps. Two contracts. Two commissions. The Goblin charges both, then files the conflict, then bills the resolution. By Q4 he has been promoted.",
    sceneDelta:
      "Mid-shot. A short broad Quarchon manager in a Hierarchy steel-grey vest over a salmon-pink dress-shirt, sleeves rolled, fingerless gloves, ledger-pen behind one pointed ear. Stands at the centre of a Hierarchy channel-conflict resolution table; on the table: two side-by-side identical Hierarchy customer-contract folios, each labeled with a different Hierarchy channel name (DIRECT / PARTNER), each open to the same signature page. The Goblin's left hand stamps the DIRECT folio; his right hand stamps the PARTNER folio. Both stamps simultaneously land. Both contracts read identically. His face is fox-like, wide-grinning, eyes a bright commission-green.",
    moodKeywords: [
      "two channels, one customer, two commissions",
      "simultaneous stamp on both folios",
      "salmon-pink dress-shirt accent",
      "commission-green eyes",
    ],
    palette:
      "Hierarchy steel-grey vest + salmon-pink dress-shirt + fingerless leather gloves + warm table-uplight + folio-cream + bright commission-green eye-tone + ledger-pen ink-black",
    composition:
      "Mid-shot front-on, Goblin at frame-centre at the table, both folios visible in foreground at frame-left and frame-right, simultaneous stamp-impacts mid-action",
    notes:
      "Rare. The simultaneous-stamp visual is the Channel-Conflict Goblin's canon signature; the salmon-pink shirt is a deliberate counterpoint to the otherwise-cool Hierarchy palette and is the goblin's identifier among the otherwise-uniform manager-tier.",
    archetypeRationale:
      "Newly-named per plan. Pairs operationally with Kelv'Orth VP of Soul Acquisitions — Kelv'Orth designs the pipeline, the Goblin exploits the seams between channels.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_vp_sales_kelv_orth — sales-pipeline pairing",
    ],
  },

  "s2_hierarchy_mgr_demand_gen_phantom": {
    cardId: "s2_hierarchy_mgr_demand_gen_phantom",
    name: "Demand-Generation Phantom",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Pipeline is up. Conversions are up. Attribution is — the Phantom waves a translucent hand at this — being reviewed. The numbers, however, are real. As real as anything else.",
    sceneDelta:
      "Mid-shot. A translucent Hierarchy mid-manager in a Hierarchy charcoal blazer over a navy turtleneck, mid-thirties, hair pulled back. Stands at a Hierarchy marketing-bullpen wall covered in floor-to-ceiling pipeline-funnel projections — each funnel shows: TOP (large input), MIDDLE (smaller qualified-leads), BOTTOM (smallest closed-won). Each funnel's BOTTOM number is highlighted with a small green up-arrow (positive trend). Her right hand is mid-gesture, palm-up, presenting the largest funnel. Her left hand holds a holographic ATTRIBUTION-MODEL diagram that is visibly fragmented (broken arrows, dotted lines marked TBD). She is mid-explanation, gentle smile.",
    moodKeywords: [
      "pipeline up, attribution being reviewed",
      "fragmented attribution-model",
      "translucent presenter",
      "the numbers are real as anything else",
    ],
    palette:
      "Hierarchy charcoal blazer + navy turtleneck + cool-cyan funnel projections + green up-arrow accents + fragmented attribution-model amber-and-grey + warm bullpen overhead",
    composition:
      "Mid-shot three-quarter, Phantom at frame-left presenting, pipeline-funnel wall at frame-right occupying two-thirds of frame, attribution-model diagram in her left hand visible at chest-height",
    notes:
      "Rare. Translucency is moderate. The fragmented attribution-model in the left hand is the Phantom's canonical signature — the menace is in the gentle hand-wave at the broken measurement.",
    archetypeRationale:
      "Newly-named per plan. Pairs with Kelv'Orth VP of Soul Acquisitions on the demand-supply side; the Phantom generates the leads Kelv'Orth's reps close.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_vp_sales_kelv_orth — sales-pipeline pairing",
    ],
  },
};

export const MANAGER_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
