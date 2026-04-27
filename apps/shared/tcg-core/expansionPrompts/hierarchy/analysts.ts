/**
 * Hierarchy of the Damned — Analyst-tier (24 uncommons).
 *
 * The Hierarchy's individual-contributor layer. Per the gameplay
 * spec, analysts power the "Quarterly Earnings" synergy
 * (deathwatch / consumption / recursion bonuses) — thematically
 * the Hierarchy derives power from analyst sacrifice/overwork.
 * All 24 newly-named per the 2026-04-27 plan §Hierarchy naming
 * policy.
 *
 * SceneDelta is tighter than Manager-tier (60-90 words rather than
 * 100-150) because these are IC desk-workers, but every entry still
 * carries its own visual signature: a specific tool, a specific
 * micro-environment, a specific in-joke detail.
 *
 * All UNCOMMON rarity, faction `new_babylon`.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "s2_hierarchy_anl_compliance_auditor": {
    cardId: "s2_hierarchy_anl_compliance_auditor",
    name: "Compliance Auditor",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Eighty-seven controls, of which she has tested forty-two this quarter, of which thirty-seven passed, of which two have been escalated. The remainder are in PROGRESS.",
    sceneDelta:
      "Mid-shot. A precise mid-thirties Quarchon analyst in a Hierarchy plain-charcoal blouse and pencil-skirt, hair in a tight low bun. Sits at a small Hierarchy audit-desk reviewing a control-test workpaper, highlighter mid-pass over a single line. A Hierarchy plain-grey lanyard hangs from her neck with a small AUDIT clearance-tag. Three identical bound binders stacked at her desk-edge labeled 'Q3 CONTROLS'. The cubicle's overhead fluorescent throws her in flat institutional light.",
    moodKeywords: [
      "eighty-seven controls",
      "forty-two tested, two escalated",
      "flat institutional fluorescent",
      "audit clearance-tag",
    ],
    palette:
      "Hierarchy plain-charcoal blouse + pencil-skirt + flat institutional fluorescent + cool-grey cubicle walls + binder-spine forest-green + plain-grey lanyard + highlighter pale-yellow",
    composition:
      "Mid-shot front three-quarter, Auditor at frame-centre seated, binder-stack at frame-foreground, cubicle wall in soft focus behind",
    notes:
      "Uncommon. Reports operationally to Nessith VP Internal Audit. The deliberately-plain styling matches Nessith's framing: audit-tier roles in the Hierarchy are deliberately low-visibility.",
    archetypeRationale:
      "Newly-named per plan. Forms the IC layer of the Hierarchy's audit function — Nessith VP at the executive level, this Auditor at the desk level.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_vp_audit_nessith — audit-stack pairing",
    ],
  },

  "s2_hierarchy_anl_reporting_specialist": {
    cardId: "s2_hierarchy_anl_reporting_specialist",
    name: "Reporting Specialist",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The dashboard refreshes hourly. The dashboard is consulted weekly. The discrepancy is reconciled monthly. The reconciliation is filed quarterly. The filing is reviewed annually.",
    sceneDelta:
      "Mid-shot. A Hierarchy analyst at a wide multi-monitor reporting station, mid-thirties, in a steel-blue cardigan over a black t-shirt. The three monitors show three Hierarchy dashboards in cool-cyan — KPI grids, trend lines, exception lists — each refreshing live. Both hands rest lightly on the keyboard, one finger mid-tap on the F5 refresh key. His face is tired, calm, focused. A small mug of cold tea on the desk-edge with a faint condensation ring.",
    moodKeywords: [
      "F5 mid-tap",
      "three dashboards refreshing",
      "the reconciliation filed quarterly",
      "cold-tea condensation ring",
    ],
    palette:
      "Hierarchy steel-blue cardigan + black t-shirt + cool-cyan dashboard glow + warm desk-lamp accent + mug muted-warm + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front-on, Specialist at frame-centre seated, three monitors arc behind him at frame-rear, mug at desk-foreground",
    notes:
      "Uncommon. Pairs operationally with Quarterly Forecaster (Manager) and Metrics Oracle (Director) — the Specialist generates the dashboards the Forecaster forecasts from and the Oracle reads.",
    archetypeRationale:
      "Newly-named per plan. The Hierarchy's data-stack needs an IC-tier dashboard-author; the Specialist grounds the abstract Metrics-Oracle role in a desk-level operator.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_metrics_oracle — data-stack pairing",
    ],
  },

  "s2_hierarchy_anl_cs_drone": {
    cardId: "s2_hierarchy_anl_cs_drone",
    name: "Customer-Success Drone",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Renewal at risk. Champion has departed. Sponsor has been reorganized. The Drone files the at-risk flag, schedules the QBR, attaches the deck. The Drone has done this before. The Drone will do this again.",
    sceneDelta:
      "Mid-shot. A Hierarchy customer-success analyst at a small headset-equipped workstation, late-twenties, in a Hierarchy soft-violet polo over a charcoal under-shirt. Her face is professionally cheerful, with the slight rictus of someone twelve calls into a sixteen-call day. Right hand on a customer-account screen showing health-score AT RISK in warning-amber; left hand mid-click on a Hierarchy 'Schedule QBR' button. A small framed picture on the desk-edge — a cute Hierarchy office-pet (deliberately bland, e.g. a small grey office-cat).",
    moodKeywords: [
      "twelve calls into a sixteen-call day",
      "AT RISK in warning-amber",
      "Schedule QBR mid-click",
      "professional cheerful rictus",
    ],
    palette:
      "Hierarchy soft-violet polo + charcoal under-shirt + cool-cyan account-screen + warning-amber AT-RISK accent + warm desk-lamp + framed-picture muted-warm",
    composition:
      "Mid-shot front three-quarter, Drone at frame-centre seated, account-screen at frame-right, framed picture at desk-foreground",
    notes:
      "Uncommon. Pairs with Demand-Gen Phantom (Manager) operationally — Phantom generates pipeline, Drone keeps it from churning. Cheerful-rictus is the canonical Drone signature.",
    archetypeRationale:
      "Newly-named per plan. Customer-success ICs are the Hierarchy's customer-retention layer; the drone framing emphasizes the bureaucratic-procedural aspect.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_demand_gen_phantom — pipeline pairing",
    ],
  },

  "s2_hierarchy_anl_qa_imp": {
    cardId: "s2_hierarchy_anl_qa_imp",
    name: "QA Imp",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "She has filed seventeen bugs. Twelve have been triaged. Nine have been closed as INTENDED BEHAVIOR. The remainder will, the Imp informs you, be addressed as part of a future architectural review.",
    sceneDelta:
      "Mid-shot. A small Quarchon analyst in a Hierarchy charcoal hoodie zipped halfway over a black t-shirt with a faded Hierarchy QA-team logo, sleeves pushed up, fingerless gloves. Sits cross-legged in a Hierarchy QA-pod task-chair. Two monitors: one showing a bug-tracker queue with seventeen open items, the other showing a screenshot of a UI bug she is mid-annotating with a circle-and-arrow. Her face is sharp, fox-like, faintly grinning. A small empty energy-drink can balanced on the chair-arm.",
    moodKeywords: [
      "INTENDED BEHAVIOR",
      "seventeen open bugs",
      "circle-and-arrow annotation",
      "energy-drink can on chair-arm",
    ],
    palette:
      "Hierarchy charcoal hoodie + black t-shirt + cool-cyan dual-monitor + warm task-lamp + energy-drink can muted-amber + fingerless leather gloves",
    composition:
      "Mid-shot front-on, QA Imp at frame-centre cross-legged in chair, two monitors at frame-rear, energy-drink can at chair-arm foreground",
    notes:
      "Uncommon. Echoes the imp-tier visual language (Process Imp / Burndown Imp / Estimation Goblin) at the analyst tier — sharp features, fingerless gloves, fox-grin.",
    archetypeRationale:
      "Newly-named per plan. QA ICs are the Hierarchy's product-quality layer; the imp framing matches the broader Hierarchy small-mischief archetype while keeping the role recognizable.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_anl_procurement_clerk": {
    cardId: "s2_hierarchy_anl_procurement_clerk",
    name: "Procurement Clerk",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Three quotes were required. Three quotes were received. Two were from vendors with a relationship to the Clerk's manager's previous firm. The Clerk has noted this in the file. The file is, the Clerk confirms, internal.",
    sceneDelta:
      "Mid-shot. A Hierarchy procurement analyst at a tidy Hierarchy procurement-desk, mid-forties, in a Hierarchy grey blouse over a black skirt, half-moon glasses on a chain. Three folders open in a fan in front of her, each labeled with a different vendor's invented Hierarchy-style code (HIER-VND-001, HIER-VND-002, HIER-VND-003). Her right hand mid-stroke with a fine pen on a comparison spreadsheet; her left hand rests palm-down on the third folder. The desk lamp throws warm amber from one side.",
    moodKeywords: [
      "three quotes required, three quotes received",
      "the file is internal",
      "comparison spreadsheet mid-stroke",
      "half-moon glasses on a chain",
    ],
    palette:
      "Hierarchy grey blouse + black skirt + warm amber desk-lamp + folder-cream + comparison-spreadsheet pale-blue + half-moon glasses chain pale-silver",
    composition:
      "Mid-shot three-quarter, Clerk at frame-centre seated, three folders fanned across desk-foreground, lamp at frame-edge",
    notes:
      "Uncommon. Pairs with Vendor-Mgmt Wraith (Manager) — the Wraith renews the contract, the Clerk runs the procurement that selects the vendor.",
    archetypeRationale:
      "Newly-named per plan. Procurement ICs are the Hierarchy's external-supply IC layer; the careful-internal-noting framing is the canonical Hierarchy procurement signature.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_vendor_mgmt_wraith — procurement-stack pairing",
    ],
  },

  "s2_hierarchy_anl_internal_comms": {
    cardId: "s2_hierarchy_anl_internal_comms",
    name: "Internal Communications Analyst",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "She drafts the all-hands deck. She also drafts the all-hands deck rebuttal. She also drafts the FAQ. The FAQ contains the rebuttal. The all-hands deck is, by Q3, the source of every question and every answer.",
    sceneDelta:
      "Mid-shot. A Hierarchy internal-comms analyst at a Hierarchy bullpen workstation, mid-thirties, in a Hierarchy plum cardigan over a black collared blouse. Three browser-windows open across two monitors: a slide deck mid-edit, a FAQ document with bulleted Q&A, and a Hierarchy comms-channel composer. Her right hand mid-keyboard-shortcut between windows; her left hand holds a Hierarchy lukewarm-tea mug at chest height. Her face is mid-context-switch, focused, mouth slightly tense.",
    moodKeywords: [
      "the FAQ contains the rebuttal",
      "three windows, two monitors",
      "lukewarm-tea mug",
      "mouth slightly tense",
    ],
    palette:
      "Hierarchy plum cardigan + black collared blouse + dual-monitor cool-cyan + lukewarm-tea mug muted-warm + warm bullpen overhead + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front three-quarter, Analyst at frame-centre seated, two monitors at frame-right, mug held at chest-foreground",
    notes:
      "Uncommon. Pairs with Townhall Phantom (Director) — Phantom moderates the all-hands the Analyst drafts. The drafted-FAQ-containing-the-rebuttal is the canonical Comms Analyst signature.",
    archetypeRationale:
      "Newly-named per plan. Internal-communications ICs are the Hierarchy's institutional-voice IC layer; pairs with Shadow Tongue's executive language-corruption at the IC tier.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_townhall_phantom — comms-stack pairing",
    ],
  },

  "s2_hierarchy_anl_ux_researcher": {
    cardId: "s2_hierarchy_anl_ux_researcher",
    name: "UX Researcher Wraith",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "She conducted thirty interviews. The findings did not align with the roadmap. The findings have been re-prioritized for a future cycle. The interviews are, the Wraith confirms gently, still very valuable.",
    sceneDelta:
      "Mid-shot. A faintly-translucent Quarchon analyst at a Hierarchy research-pod desk, mid-thirties, in a Hierarchy soft-grey cardigan over a sage-green blouse. Her left hand rests on an open Hierarchy research-binder showing tabbed interview-transcripts; her right hand holds a Hierarchy color-coded sticky-note ready to file. The wall behind her holds a research-affinity board covered in clusters of color-sorted sticky-notes. Her face is patient, slightly resigned.",
    moodKeywords: [
      "thirty interviews, re-prioritized",
      "color-sorted sticky-notes",
      "translucent patient researcher",
      "the findings did not align",
    ],
    palette:
      "Hierarchy soft-grey cardigan + sage-green blouse + warm research-pod overhead + sticky-note multi-color rainbow + binder forest-green + research-affinity-board cool-grey background",
    composition:
      "Mid-shot front three-quarter, Wraith at frame-centre seated, affinity-board filling frame-rear, binder open at desk-foreground",
    notes:
      "Uncommon. Translucency is moderate; sticky-note colors must read as a palette rather than chaos. Pairs with Roadmap Banshee (Manager) — Banshee maintains the dual roadmaps that re-prioritize the Wraith's findings.",
    archetypeRationale:
      "Newly-named per plan. UX Research ICs are the Hierarchy's user-empathy layer; the wraith framing emphasizes the institutional-erasure of inconvenient findings.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_roadmap_banshee — research-vs-roadmap pairing",
    ],
  },

  "s2_hierarchy_anl_data_analyst": {
    cardId: "s2_hierarchy_anl_data_analyst",
    name: "Data Analyst (Hierarchy)",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The query is still running. The query has been running for forty minutes. The Analyst has, in the interim, been promoted, reorganized, given a new dataset, and asked to re-run the query.",
    sceneDelta:
      "Mid-shot. A Hierarchy data analyst at a Hierarchy data-pod workstation, late-twenties, in a Hierarchy charcoal hoodie over a black collared shirt, sleeves pushed up. Three monitors: the leftmost shows a SQL editor with a long query in progress, middle shows a slow-spinning loading icon, rightmost shows a data-warehouse schema. Right hand on mouse, left hand resting on chin. His face is patient, slightly bored.",
    moodKeywords: [
      "the query is still running",
      "forty-minute waits as routine",
      "patient slight boredom",
      "SQL editor + loading icon + schema",
    ],
    palette:
      "Hierarchy charcoal hoodie + black collared shirt + cool-cyan triple-monitor + warm desk-lamp + loading-icon amber accent + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front-on, Analyst at frame-centre seated, three monitors arc behind him, mouse-hand at frame-right desk-edge",
    notes:
      "Uncommon. Pairs with Reporting Specialist (within-tier) and Metrics Oracle (Director) — the Analyst writes the queries the Specialist surfaces and the Oracle reads from.",
    archetypeRationale:
      "Newly-named per plan. The Hierarchy's data IC layer needs both report-builders (Reporting Specialist) and query-authors (this Analyst) — the data flows from raw to surfaced through both.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_anl_reporting_specialist — data-stack pairing",
    ],
  },

  "s2_hierarchy_anl_sales_ops": {
    cardId: "s2_hierarchy_anl_sales_ops",
    name: "Sales Operations Specialist",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Quota allocations approved. Territory boundaries drawn. Comp plan finalized. Comp plan revised. Comp plan finalized again. The Specialist has not slept since Q1.",
    sceneDelta:
      "Mid-shot. A weary Hierarchy sales-ops analyst at a wide Hierarchy ops-desk, late-twenties, in a Hierarchy slate-blue blazer over a wrinkled white shirt (collar slightly askew). Spread across the desk: three Hierarchy territory maps, a thick comp-plan binder mid-flip, a fresh coffee. His face shows visible fatigue — dark under-eyes, two-day stubble. Right hand mid-flip on the comp-plan binder.",
    moodKeywords: [
      "comp plan finalized again",
      "territory maps spread",
      "two-day stubble fatigue",
      "fresh coffee three deep",
    ],
    palette:
      "Hierarchy slate-blue blazer + wrinkled white shirt + warm desk-lamp + territory-map cool-grey + comp-plan binder forest-green + coffee muted-amber",
    composition:
      "Mid-shot three-quarter, Specialist at frame-centre seated, territory-maps fanned across desk-foreground, binder mid-flip in hands at chest-height",
    notes:
      "Uncommon. The visible fatigue is intentional — sales-ops in the Hierarchy is canonically the most-overworked IC role. Pairs with Kelv'Orth VP Sales operationally.",
    archetypeRationale:
      "Newly-named per plan. Sales ops ICs are the Hierarchy's revenue-engine maintenance layer; the fatigue framing matches the canon Hierarchy 'overwork as power source' (Quarterly Earnings synergy).",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_vp_sales_kelv_orth — sales-stack pairing",
    ],
  },

  "s2_hierarchy_anl_finance_analyst": {
    cardId: "s2_hierarchy_anl_finance_analyst",
    name: "Finance & Strategy Analyst",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The model is built. The assumptions are documented. The sensitivity is run. The board deck is ready. The board deck has been re-templated. The model is being rebuilt.",
    sceneDelta:
      "Mid-shot. A meticulous Hierarchy finance analyst at a tidy Hierarchy finance-pod workstation, late-twenties, in a Hierarchy navy blazer over a crisp white blouse, hair in a low pony. Two monitors: the left shows a Hierarchy financial-model with cells highlighted in cool-cyan; the right shows a board-deck slide with a financial chart. Right hand mid-keystroke; left hand holds a bound assumptions-document open at chest-height.",
    moodKeywords: [
      "the model is being rebuilt",
      "tidy meticulous workstation",
      "navy blazer crisp blouse",
      "assumptions documented at chest-height",
    ],
    palette:
      "Hierarchy navy blazer + crisp white blouse + cool-cyan dual-monitor + warm desk-lamp + bound-document forest-green + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front-on, Analyst at frame-centre seated, two monitors at frame-rear, bound-document held at chest-foreground",
    notes:
      "Uncommon. Pairs with Xeth'Raal CFO at the executive level and with Quarterly Forecaster (Manager) operationally. The deliberate tidiness is the Finance Analyst signature — opposite end of the visual spectrum from the Sales Ops fatigue.",
    archetypeRationale:
      "Newly-named per plan. Finance ICs are the Hierarchy's modeling layer; the tidiness/precision framing reflects the financial-discipline canon (Xeth'Raal's Ledger of Ruin).",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_cfo_xeth_raal — finance-stack pairing",
    ],
  },

  "s2_hierarchy_anl_recruiting_coordinator": {
    cardId: "s2_hierarchy_anl_recruiting_coordinator",
    name: "Recruiting Coordinator",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Five rounds. Two panel sessions. One take-home. Three additional culture-fit interviews. The Coordinator schedules each round. The Coordinator has not been able to schedule her own performance review.",
    sceneDelta:
      "Mid-shot. A Hierarchy recruiting-coordinator analyst at a Hierarchy people-ops workstation, mid-twenties, in a Hierarchy plum cardigan over a soft-cream blouse. Single tall monitor showing a Hierarchy interview-scheduling grid with overlapping calendar-blocks in cool-cyan. Her right hand on a Hierarchy-branded pen mid-stroke on a small printed candidate-tracker; her left hand mid-tap on the calendar-grid. Her face is friendly, composed, with the slight strained patience of someone who has rescheduled the same panel three times.",
    moodKeywords: [
      "five rounds and a take-home",
      "calendar overlap cool-cyan",
      "candidate-tracker pen-stroke",
      "rescheduled the same panel three times",
    ],
    palette:
      "Hierarchy plum cardigan + soft-cream blouse + cool-cyan calendar-grid + warm desk-lamp + Hierarchy-branded pen muted-silver + candidate-tracker pale-grey",
    composition:
      "Mid-shot front three-quarter, Coordinator at frame-centre seated, monitor at frame-right, candidate-tracker on desk-foreground",
    notes:
      "Uncommon. Pairs with Velm Acrith (Director Onboarding) operationally — the Coordinator hires, Velm onboards. Together they bracket the Hierarchy's hiring-pipeline IC layer.",
    archetypeRationale:
      "Newly-named per plan. Recruiting Coordinators are the Hierarchy's hiring-funnel IC layer; the overscheduled-friendly framing is the canonical recruiter signature.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_onboarding_specialist — hiring-pipeline pairing",
    ],
  },

  "s2_hierarchy_anl_office_manager": {
    cardId: "s2_hierarchy_anl_office_manager",
    name: "Office Manager Specter",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The fridge is restocked. The mail is sorted. The badge-printer is online. The all-hands lunch has been ordered (and re-ordered, after the dietary restrictions arrived). The Specter does not need acknowledgment, but she does keep a list.",
    sceneDelta:
      "Mid-shot. A faintly-translucent Hierarchy office-manager analyst at the threshold of a Hierarchy main-floor common-area, mid-fifties, in a Hierarchy soft-violet cardigan over a black blouse, reading-glasses on a chain. Holds a small Hierarchy clipboard tucked under one arm; right hand mid-pat to a stack of fresh badge-printer paper on a side-counter. Behind her: a tidy Hierarchy office kitchenette (coffee maker, fruit bowl, recycling sorted). Her face is competent, faintly weary, no smile.",
    moodKeywords: [
      "the fridge is restocked",
      "the badge-printer is online",
      "she keeps a list",
      "translucent competent weary",
    ],
    palette:
      "Hierarchy soft-violet cardigan + black blouse + reading-glasses chain pale-silver + warm common-area uplight + cool corridor light through doorway behind + clipboard pale-grey",
    composition:
      "Mid-shot three-quarter, Specter at frame-centre at threshold, kitchenette at frame-rear in soft focus, side-counter foreground at frame-right",
    notes:
      "Uncommon. Translucency is moderate. The 'she keeps a list' detail is the canonical Office Manager Specter signature — quiet competence with quiet ledger.",
    archetypeRationale:
      "Newly-named per plan. Office-manager ICs are the Hierarchy's invisible-infrastructure layer; the specter framing emphasizes that the role is felt only when interrupted.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_anl_travel_expense_auditor": {
    cardId: "s2_hierarchy_anl_travel_expense_auditor",
    name: "Travel & Expense Auditor",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The receipt is missing. The receipt is invalid. The receipt is in the wrong currency. The traveler will need to refile. The Auditor has, by Q3, three thousand open expense queries.",
    sceneDelta:
      "Mid-shot. A Hierarchy T&E auditor at a Hierarchy expense-review workstation, late-thirties, in a Hierarchy charcoal blouse over a black skirt. Single tall monitor showing a Hierarchy expense-management grid; on the desk a small physical inbox stacked with photocopied paper receipts (some torn, some faded, some clearly illegible). Right hand mid-stamp with a small REJECTED stamp on a printed expense report; left hand holds a magnifying-glass over a faded receipt.",
    moodKeywords: [
      "three thousand open expense queries",
      "REJECTED stamp mid-impact",
      "faded receipts under magnifier",
      "the receipt is in the wrong currency",
    ],
    palette:
      "Hierarchy charcoal blouse + black skirt + cool-cyan expense-grid + warm desk-lamp + receipt-paper muted-warm + REJECTED stamp deep-red + magnifier brass accent",
    composition:
      "Mid-shot front three-quarter, Auditor at frame-centre seated, monitor at frame-rear, paper-inbox at frame-foreground, magnifier in hand at chest-height",
    notes:
      "Uncommon. Pairs with Procurement Clerk (within-tier) and with Mid-Year Adjuster (Manager) — the T&E function is the Hierarchy's smallest-unit financial-discipline IC layer.",
    archetypeRationale:
      "Newly-named per plan. T&E auditors are the Hierarchy's pettiest-financial-friction IC layer; the canonical signature is the REJECTED stamp + the illegible-receipt magnifier.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_anl_procurement_clerk — fiscal-IC pairing",
    ],
  },

  "s2_hierarchy_anl_vendor_coordinator": {
    cardId: "s2_hierarchy_anl_vendor_coordinator",
    name: "Vendor Coordinator",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "He has scheduled the kickoff. He has chased the SOW. He has reminded the vendor of the SLA. He has filed the change-order. He has, in a quiet moment, started looking for a different role.",
    sceneDelta:
      "Mid-shot. A Hierarchy vendor-coordinator analyst at a Hierarchy ops-pod desk, late-twenties, in a Hierarchy navy polo over a charcoal sweater. Two monitors: leftmost shows a Hierarchy email client mid-compose to a vendor; rightmost shows a Hierarchy SOW document with several yellow highlights. His face is tired, faintly resigned. Right hand on mouse mid-click; left hand cradling a Hierarchy mug at chest-height. A small Hierarchy office-stress-ball sits squashed on the desk.",
    moodKeywords: [
      "chasing the SOW",
      "in a quiet moment looking elsewhere",
      "yellow-highlighted SOW",
      "office-stress-ball squashed",
    ],
    palette:
      "Hierarchy navy polo + charcoal sweater + cool-cyan dual-monitor + warm desk-lamp + SOW pale-yellow highlights + Hierarchy mug muted-warm + stress-ball pale-blue",
    composition:
      "Mid-shot front three-quarter, Coordinator at frame-centre seated, two monitors at frame-rear, mug at chest-foreground, stress-ball at desk-edge",
    notes:
      "Uncommon. Pairs with Vendor-Mgmt Wraith (Manager) — the Wraith renews; the Coordinator runs day-to-day.",
    archetypeRationale:
      "Newly-named per plan. Vendor coordinators are the Hierarchy's day-to-day external-relations IC layer; the squashed-stress-ball is the canonical signature.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_vendor_mgmt_wraith — vendor-stack pairing",
    ],
  },

  "s2_hierarchy_anl_project_coordinator": {
    cardId: "s2_hierarchy_anl_project_coordinator",
    name: "Project Coordinator",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Status: GREEN. Risks: NONE IDENTIFIED. Blockers: NONE OUTSTANDING. Notes: project is fully on track. The Coordinator emails this to the executive sponsor at 9:01am every Monday and at no other time.",
    sceneDelta:
      "Mid-shot. A Hierarchy project coordinator at a Hierarchy project-management workstation, mid-thirties, in a Hierarchy plum cardigan over a black blouse. Two monitors: leftmost shows a Hierarchy project-status dashboard with multiple cards in GREEN; rightmost shows the project's actual blocker-list (long, with several red flags). Right hand mid-click on a SEND button on a status-update compose-window; left hand holds a small Hierarchy paper schedule-printout. Her face is composed, faintly pained.",
    moodKeywords: [
      "Status: GREEN, blockers below",
      "9:01am Monday email",
      "fully on track per official record",
      "composed faintly pained",
    ],
    palette:
      "Hierarchy plum cardigan + black blouse + cool-cyan dual-monitor + GREEN-status accents + red-flag warning accent on second monitor + warm desk-lamp + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front three-quarter, Coordinator at frame-centre seated, two monitors at frame-rear with deliberate visual contrast (left GREEN, right RED-flagged), schedule-printout at chest-foreground",
    notes:
      "Uncommon. The two-monitor green-vs-red contrast is the Project Coordinator's canonical signature: the official report and the actual state, side-by-side, both visible to the viewer (and only to the viewer).",
    archetypeRationale:
      "Newly-named per plan. Project coordinators are the Hierarchy's status-management IC layer; the canon framing is the dual-truth dashboard.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_burndown_imp — status-distortion pairing",
    ],
  },

  "s2_hierarchy_anl_risk_modeler": {
    cardId: "s2_hierarchy_anl_risk_modeler",
    name: "Risk-Modeling Analyst",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The model says the risk is 4%. The reality says the risk is 4% per attempt, and there will be many attempts. The model is, the Analyst notes, technically correct.",
    sceneDelta:
      "Mid-shot. A meticulous Hierarchy risk-modeling analyst at a wide Hierarchy risk-pod workstation, late-thirties, in a Hierarchy steel-grey blazer over a black turtleneck. Three monitors: leftmost shows a Monte Carlo simulation graph with a long-tail distribution; middle shows a risk-scoring matrix; rightmost shows a Hierarchy probability-table. Right hand mid-click on a parameter-slider; left hand on chin in thought. Face mid-fifties, calm, precise.",
    moodKeywords: [
      "the model says 4%",
      "long-tail distribution",
      "many attempts will be made",
      "calm precise modeler",
    ],
    palette:
      "Hierarchy steel-grey blazer + black turtleneck + cool-cyan triple-monitor + warm desk-lamp + Monte-Carlo graph pale-violet long-tail accent + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front-on, Analyst at frame-centre seated, three monitors arc behind him, parameter-slider mid-click at frame-right",
    notes:
      "Uncommon. Pairs with Kragvex VP Operational Risk and Iglarath CISO. The long-tail distribution graph is the Risk Modeler's canonical signature — the menace is in the tail.",
    archetypeRationale:
      "Newly-named per plan. Risk modelers are the Hierarchy's quantitative-risk IC layer; the long-tail-as-canon framing parallels Iglarath's perimeter-breach inevitability.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_vp_ops_risk_kragvex — risk-stack pairing",
    ],
  },

  "s2_hierarchy_anl_pricing_analyst": {
    cardId: "s2_hierarchy_anl_pricing_analyst",
    name: "Pricing Analyst",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Discount approved. Discount approved. Discount approved. The Analyst has not approved any of these. The Analyst was looped in for visibility. The Analyst is, formally, the approver.",
    sceneDelta:
      "Mid-shot. A Hierarchy pricing analyst at a Hierarchy pricing-pod workstation, late-twenties, in a Hierarchy plum blazer over a charcoal blouse. Single wide monitor showing a Hierarchy pricing-approval queue with a long list of discount-requests, all marked APPROVED in green. Right hand mid-tap on the next item in the queue; left hand holds a small Hierarchy pricing-policy binder. Her face is mid-twenties resigned-with-coffee.",
    moodKeywords: [
      "approved approved approved",
      "looped in for visibility",
      "the analyst is formally the approver",
      "resigned-with-coffee composure",
    ],
    palette:
      "Hierarchy plum blazer + charcoal blouse + cool-cyan pricing-queue + APPROVED-row green accent + warm desk-lamp + pricing-policy binder forest-green",
    composition:
      "Mid-shot front three-quarter, Analyst at frame-centre seated, monitor at frame-right, pricing-policy binder at chest-foreground",
    notes:
      "Uncommon. Pairs with Channel-Conflict Goblin (Manager) — the Goblin exploits seams; the Pricing Analyst rubber-stamps the discounts that create them.",
    archetypeRationale:
      "Newly-named per plan. Pricing analysts are the Hierarchy's discount-approval IC layer; the looped-in-for-visibility framing is the canon Hierarchy pattern of formal-but-toothless approval gates.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_channel_conflict_goblin — pricing-friction pairing",
    ],
  },

  "s2_hierarchy_anl_brand_coordinator": {
    cardId: "s2_hierarchy_anl_brand_coordinator",
    name: "Brand Coordinator",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The brand standard is documented. The brand standard is in the wiki. The wiki is two versions out of date. The Coordinator has, again, taken the screenshot of the correct standard and pasted it into the channel. The screenshot will, again, be lost.",
    sceneDelta:
      "Mid-shot. A Hierarchy brand-coordinator analyst at a Hierarchy brand-pod desk, late-twenties, in a Hierarchy ivory blouse over a charcoal blazer. Single tall monitor showing a Hierarchy brand-standards document with multiple version-tabs across the top. Right hand mid-click on a Hierarchy chat-channel composer where a screenshot has just been pasted; left hand on a small Hierarchy-branded paper notebook open at chest-height. Her face is friendly, polite-frustrated.",
    moodKeywords: [
      "the wiki is two versions out of date",
      "the screenshot will be lost",
      "polite-frustrated friendly",
      "paste screenshot, again",
    ],
    palette:
      "Hierarchy ivory blouse + charcoal blazer + cool-cyan brand-standards monitor + chat-channel pale-blue + warm desk-lamp + Hierarchy-branded notebook ivory accent",
    composition:
      "Mid-shot front three-quarter, Coordinator at frame-centre seated, monitor at frame-rear, notebook at chest-foreground",
    notes:
      "Uncommon. Pairs with Vex'Drelm CMO operationally — Vex'Drelm acquires brands; the Coordinator polices them. The pasted-screenshot is the canon Brand Coordinator signature.",
    archetypeRationale:
      "Newly-named per plan. Brand coordinators are the Hierarchy's brand-stewardship IC layer; the wiki-version-friction is the canonical Hierarchy knowledge-management dysfunction.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_cmo_vex_drelm — brand-stack pairing",
    ],
  },

  "s2_hierarchy_anl_marketing_analyst": {
    cardId: "s2_hierarchy_anl_marketing_analyst",
    name: "Marketing Analyst",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "The campaign drove engagement. Engagement is up. Conversion is — being measured. Awareness is — being reviewed. The campaign was, by every leading indicator, a success.",
    sceneDelta:
      "Mid-shot. A Hierarchy marketing analyst at a Hierarchy marketing-pod desk, late-twenties, in a Hierarchy plum blazer over a soft-cream blouse. Two monitors: leftmost shows a Hierarchy campaign-performance dashboard with several upward-trending lines in cool-cyan; rightmost shows a Hierarchy survey-results view with a multi-page open response section. Right hand mid-keystroke; left hand holds a Hierarchy printed campaign-brief. Her face is bright, mid-presentation-prep.",
    moodKeywords: [
      "engagement up, conversion being measured",
      "leading-indicator success",
      "campaign brief mid-printed",
      "bright presentation-prep",
    ],
    palette:
      "Hierarchy plum blazer + soft-cream blouse + cool-cyan dual-monitor + warm desk-lamp + campaign-brief paper-warm + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front three-quarter, Analyst at frame-centre seated, two monitors at frame-rear, campaign-brief at chest-foreground",
    notes:
      "Uncommon. Pairs with Demand-Gen Phantom (Manager) at the data-supply level. The leading-indicator framing is the Marketing Analyst signature — confidence in proxies that resist measurement.",
    archetypeRationale:
      "Newly-named per plan. Marketing analysts are the Hierarchy's campaign-attribution IC layer; pairs with the broader marketing-stack (Vex'Drelm/Demand-Gen Phantom/Brand Coordinator).",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_demand_gen_phantom — measurement-friction pairing",
    ],
  },

  "s2_hierarchy_anl_ir_coordinator": {
    cardId: "s2_hierarchy_anl_ir_coordinator",
    name: "Investor-Relations Coordinator",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "She drafts the earnings narrative. The narrative emphasizes momentum. Momentum is, the Coordinator notes carefully, a measurement-independent property. The auditor will, again, accept this framing.",
    sceneDelta:
      "Mid-shot. A composed Hierarchy IR coordinator at a tidy Hierarchy IR-pod workstation, late-twenties, in a Hierarchy navy suit-jacket over a crisp white blouse, hair in a low pony. Single tall monitor showing a Hierarchy earnings-narrative draft with multiple track-changes in the margin. Right hand on a fountain pen mid-stroke on a printed copy of the same narrative; left hand rests palm-down on a closed Hierarchy investor-deck folio. The Hierarchy crest pendant at her throat catches warm desk-light.",
    moodKeywords: [
      "narrative emphasizes momentum",
      "measurement-independent property",
      "auditor will accept this framing",
      "track-changes in the margin",
    ],
    palette:
      "Hierarchy navy suit-jacket + crisp white blouse + cool-cyan narrative-draft monitor + warm desk-lamp + investor-deck folio forest-green + Hierarchy crest pendant pale-silver",
    composition:
      "Mid-shot front three-quarter, Coordinator at frame-centre seated, monitor at frame-right, investor-deck folio on desk-foreground",
    notes:
      "Uncommon. Pairs with Xeth'Raal CFO and Quarterly Forecaster (Manager) — IR is downstream of the Forecaster's projections and Xeth'Raal's ledger.",
    archetypeRationale:
      "Newly-named per plan. IR coordinators are the Hierarchy's external-narrative IC layer; the measurement-independent-momentum framing is the canonical IR signature.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_cfo_xeth_raal — IR-stack pairing",
    ],
  },

  "s2_hierarchy_anl_tax_compliance": {
    cardId: "s2_hierarchy_anl_tax_compliance",
    name: "Tax-Compliance Specialist",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Seventeen jurisdictions. Three transfer-pricing structures. Two reciprocal-treaty exemptions. The position is defensible. The Specialist will defend it. The Specialist has, in fact, already begun.",
    sceneDelta:
      "Mid-shot. A meticulous Hierarchy tax-compliance specialist at a Hierarchy tax-pod desk, mid-forties, in a Hierarchy charcoal blazer over a Hierarchy plum blouse, half-moon glasses on a chain. Three folders open in a fan, each labeled with a different invented Hierarchy-jurisdiction code. Right hand mid-stroke with a fine pen on a tax-position memo; left hand holds a small Hierarchy treaty-reference book open at chest-height. Two empty Hierarchy tea-mugs visible on a side-counter (not yet cleared).",
    moodKeywords: [
      "seventeen jurisdictions",
      "transfer-pricing structures",
      "the position is defensible",
      "two empty mugs uncleared",
    ],
    palette:
      "Hierarchy charcoal blazer + plum blouse + warm desk-lamp + jurisdiction-folder cream-and-amber + treaty-book pale-grey + half-moon glasses chain pale-silver",
    composition:
      "Mid-shot three-quarter, Specialist at frame-centre seated, folder-fan at desk-foreground, treaty-book held at chest-height",
    notes:
      "Uncommon. Pairs with Mid-Year Adjuster (Manager) and Xeth'Raal CFO. The two uncleared mugs are the canonical Tax Specialist signature — the work is too constant to break for cleanup.",
    archetypeRationale:
      "Newly-named per plan. Tax compliance ICs are the Hierarchy's regulatory-defense IC layer; the seventeen-jurisdiction framing parallels Riri's seventeen-dimension command and Iglarath's seventeen-dimension perimeter.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_cfo_xeth_raal — fiscal-IC pairing",
    ],
  },

  "s2_hierarchy_anl_internal_mobility": {
    cardId: "s2_hierarchy_anl_internal_mobility",
    name: "Internal-Mobility Analyst",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Posted internally first. Two qualified internal candidates declined to apply. External search initiated. External hire selected. The Hierarchy's internal-mobility commitment, the Analyst notes, has been honored in full.",
    sceneDelta:
      "Mid-shot. A composed Hierarchy mobility analyst at a Hierarchy people-ops desk, mid-thirties, in a Hierarchy soft-grey cardigan over a deep-violet blouse. Single tall monitor showing a Hierarchy internal-jobs-board with two roles flagged INTERNAL FIRST — both already showing 0 internal applicants and an external posting going live tomorrow. Right hand mid-click on the schedule-external-posting button; left hand on a small Hierarchy mobility-policy printout. Her face is mid-thirties professional-resigned.",
    moodKeywords: [
      "posted internally first",
      "internal commitment honored in full",
      "external posting going live tomorrow",
      "professional-resigned composure",
    ],
    palette:
      "Hierarchy soft-grey cardigan + deep-violet blouse + cool-cyan jobs-board monitor + INTERNAL FIRST flag amber accent + warm desk-lamp + mobility-policy printout pale-cream",
    composition:
      "Mid-shot front three-quarter, Analyst at frame-centre seated, monitor at frame-right, mobility-policy printout at chest-foreground",
    notes:
      "Uncommon. Pairs with Recruiting Coordinator (within-tier) and Mor'Vethic CHRO. The 'INTERNAL FIRST' flag with zero applicants is the Mobility Analyst's canonical signature.",
    archetypeRationale:
      "Newly-named per plan. Internal-mobility analysts are the Hierarchy's compliance-with-policy IC layer; the canonical pattern is policy-honored-in-form-only.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_chro_mor_vethic — people-ops pairing",
    ],
  },

  "s2_hierarchy_anl_knowledge_management": {
    cardId: "s2_hierarchy_anl_knowledge_management",
    name: "Knowledge Management Specialist",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Documented. Categorized. Tagged. Indexed. The article has, in the time it took to publish, been made obsolete by a process change posted in a different channel. The Specialist will, of course, update.",
    sceneDelta:
      "Mid-shot. A Hierarchy knowledge-management specialist at a Hierarchy KM-pod desk, late-thirties, in a Hierarchy navy cardigan over a charcoal blouse, fingerless leather gloves with the pattern of a small Hierarchy crest stitched into them. Two monitors: leftmost shows a Hierarchy wiki-article being edited; rightmost shows a Hierarchy chat-channel with a process-change announcement that contradicts the article. Right hand mid-edit on the wiki-article; left hand on a small Hierarchy index-card box.",
    moodKeywords: [
      "obsolete by the time of publish",
      "fingerless gloves, crest-stitched",
      "wiki-article edited mid-redundant",
      "index-card box at the desk-edge",
    ],
    palette:
      "Hierarchy navy cardigan + charcoal blouse + cool-cyan dual-monitor + warm desk-lamp + index-card box muted-cream + Hierarchy crest fingerless-glove accent",
    composition:
      "Mid-shot front three-quarter, Specialist at frame-centre seated, two monitors at frame-rear, index-card box at desk-foreground",
    notes:
      "Uncommon. Pairs with Brand Coordinator (within-tier). The contradicting-channel-vs-wiki framing is the canonical KM Specialist signature.",
    archetypeRationale:
      "Newly-named per plan. KM specialists are the Hierarchy's documentation IC layer; the canonical pattern is documentation-perpetually-trailing-reality.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_anl_brand_coordinator — knowledge-friction pairing",
    ],
  },

  "s2_hierarchy_anl_training_content_designer": {
    cardId: "s2_hierarchy_anl_training_content_designer",
    name: "Training Content Designer",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "uncommon",
    cardType: "unit",
    flavorText:
      "Module 47. Module 48. Module 49. The series will continue. The series will, the Designer notes, never conclude. Conclusions are not the goal. Modules are.",
    sceneDelta:
      "Mid-shot. A patient Hierarchy training-content designer at a Hierarchy content-pod desk, mid-thirties, in a Hierarchy soft-cream cardigan over a black t-shirt. Single tall monitor showing a Hierarchy training-module authoring interface with module structure cards visible (a sequence of small numbered tiles: 47, 48, 49 — and a faint future-greyed pipeline of 50+). Right hand mid-drag on a module tile; left hand holds a Hierarchy content-style-guide. Her face is calm, focused.",
    moodKeywords: [
      "Module 47, 48, 49",
      "modules are the goal, not conclusions",
      "module-tile drag mid-action",
      "calm focused designer",
    ],
    palette:
      "Hierarchy soft-cream cardigan + black t-shirt + cool-cyan authoring-interface + warm desk-lamp + content-style-guide forest-green + numbered-tile cool-cyan",
    composition:
      "Mid-shot front three-quarter, Designer at frame-centre seated, monitor at frame-right showing the module-pipeline, style-guide at chest-foreground",
    notes:
      "Uncommon. Pairs with Compliance Inquisitor (Director) — the Inquisitor delivers the modules; the Designer authors them. Module 47 is the canonical Hierarchy training in-joke (referenced on the Compliance Inquisitor card too).",
    archetypeRationale:
      "Newly-named per plan. Training content designers are the Hierarchy's compliance-content IC layer; pairs with the Compliance Inquisitor's delivery to complete the training-stack.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_compliance_inquisitor — training-stack pairing",
    ],
  },
};

export const ANALYST_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
