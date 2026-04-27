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
};

export const ANALYST_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
