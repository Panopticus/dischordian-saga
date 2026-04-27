/**
 * Hierarchy of the Damned — Intern-tier (14 commons).
 *
 * The Hierarchy's entry-level layer. Per the gameplay spec these
 * are the Hierarchy's TOKEN-GENERATOR cards — 1-mana low-stat
 * workhorse units that fuel the deathwatch / consumption / sacrifice
 * synergies of higher-tier cards. All 14 newly-named per the
 * 2026-04-27 plan §Hierarchy naming policy.
 *
 * SceneDelta is tightest of all tiers (50-75 words) because these
 * are uniform-ish entry-level workers — visually they wear similar
 * Hierarchy intern attire (charcoal-and-cream business-casual with a
 * single Hierarchy crest lanyard) and are distinguished by ONE
 * specific micro-prop or environmental signature each. The artist
 * should be able to render the entire tier as a recognizable cohort
 * with each member individually identifiable.
 *
 * All COMMON rarity, faction `new_babylon`.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "s2_hierarchy_intn_new_hire": {
    cardId: "s2_hierarchy_intn_new_hire",
    name: "New Hire",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Day one. Three trainings completed. Forty-seven left. Welcome to the Hierarchy. Your seventeen-dimension orientation begins on Wednesday.",
    sceneDelta:
      "Mid-shot. A bright nervous Hierarchy intern at a fresh Hierarchy onboarding desk, twenties, in stiff-new Hierarchy charcoal-and-cream business-casual, single Hierarchy crest lanyard hanging at chest, brand-new sealed Hierarchy welcome-laptop just opened, fingers hovering over the keyboard. Face: bright, wide-eyed, faintly anxious.",
    moodKeywords: [
      "day one bright nervous",
      "three trainings down, forty-seven left",
      "stiff-new business-casual",
      "fingers hovering over the keyboard",
    ],
    palette:
      "Hierarchy charcoal-and-cream business-casual + bright onboarding-suite uplight + sealed-laptop branded-pale-cream + Hierarchy crest plum-silver lanyard",
    composition:
      "Mid-shot front three-quarter, New Hire at frame-centre seated, fresh laptop at desk-foreground",
    notes:
      "Common. The bright-anxious face is the canonical New Hire signature; pairs with Velm Acrith (Director Onboarding) — Velm hands them the badge, the New Hire has just used it.",
    archetypeRationale:
      "Newly-named per plan. Token-generator at the entry-tier that visualizes the moment-of-arrival; the Hierarchy's 'overwork as power source' synergy starts here.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_dir_onboarding_specialist — onboarding pairing",
    ],
  },

  "s2_hierarchy_intn_stand_up_lurker": {
    cardId: "s2_hierarchy_intn_stand_up_lurker",
    name: "Stand-Up Lurker",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Yesterday: documentation. Today: documentation. Blockers: none. The Lurker has not been called on for three weeks and is, on balance, content.",
    sceneDelta:
      "Mid-shot. A quiet Hierarchy intern at the back of a Hierarchy team-pod stand-up half-circle, mid-twenties, in standard Hierarchy charcoal cardigan over a grey t-shirt with the Hierarchy crest faintly visible. Stands slightly apart from the half-circle, holding a Hierarchy Hierarchy-branded mug at chin-height as cover. Face: politely attentive, eyes slightly elsewhere.",
    moodKeywords: [
      "back of the half-circle",
      "mug as cover",
      "not called on for three weeks",
      "politely-attentive eyes elsewhere",
    ],
    palette:
      "Hierarchy charcoal cardigan + grey crested t-shirt + cool team-pod overhead + warm corridor light through doorway behind + Hierarchy mug muted-warm + lanyard plum-silver",
    composition:
      "Mid-shot side three-quarter, Lurker at frame-edge, half-circle of pod-members at frame-centre, mug at chin-height as visual blocker",
    notes:
      "Common. Pairs with Stand-Up Wraith (Manager) — the Wraith runs the round; the Lurker survives it.",
    archetypeRationale:
      "Newly-named per plan. Token-generator that visualizes the meeting-attendance survivor archetype; common in every Hierarchy team-pod.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_stand_up_wraith — meeting-survivor pairing",
    ],
  },

  "s2_hierarchy_intn_slack_reactor": {
    cardId: "s2_hierarchy_intn_slack_reactor",
    name: "Slack Reactor",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      ":eyes: :raised_hands: :100: :rocket: — by Q3 the Reactor has contributed eight thousand reactions to the Hierarchy chat-channels and approximately three sentences. Both metrics, the Reactor notes, are tracked.",
    sceneDelta:
      "Mid-shot. A focused Hierarchy intern at a small Hierarchy entry-pod desk, mid-twenties, in Hierarchy charcoal-and-cream business-casual. Single laptop monitor showing a Hierarchy chat-channel scrolling with messages and a fan of small emoji-reactions in cool-cyan and warm-amber. Right hand mid-click on a reaction; left hand poised over a different message. Face: contented, eyes flicking between channels.",
    moodKeywords: [
      "eight thousand reactions, three sentences",
      "emoji-fan cool-and-warm",
      "contented flick-eye",
      "both metrics tracked",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan chat monitor + warm-amber emoji-reaction accents + warm desk-lamp + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Reactor at frame-centre seated, monitor at frame-right with reaction-fan visible",
    notes:
      "Common. The reaction-fan composition is the Reactor's canon signature — visible cluster of cool-cyan + warm-amber emoji-reactions reads as the working-vocabulary of the role.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the chat-engagement-as-presence archetype.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_intn_coffee_runner": {
    cardId: "s2_hierarchy_intn_coffee_runner",
    name: "Coffee Runner",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Eleven orders. Eleven names. Eleven specifications. The Runner has memorized them all and, en route, two have been amended. The Runner does not lose orders. The Runner has lost themselves.",
    sceneDelta:
      "Mid-shot. A swift Hierarchy intern striding through a Hierarchy main-floor corridor, mid-twenties, in Hierarchy charcoal slacks and a dusty-rose dress-shirt rolled to forearms. Carries a Hierarchy-branded cardboard drink-tray with eleven distinct paper cups (each labeled in different hand-marker). Face: focused, mid-stride, slightly out-of-breath.",
    moodKeywords: [
      "eleven orders, eleven labels",
      "mid-stride out-of-breath",
      "two amended en route",
      "drink-tray careful balance",
    ],
    palette:
      "Hierarchy charcoal slacks + dusty-rose dress-shirt + Hierarchy-branded drink-tray cardboard-warm + corridor cool-cyan + paper-cup multi-warm-tones + lanyard plum-silver",
    composition:
      "Mid-shot side three-quarter, Runner at frame-centre mid-stride, drink-tray at chest-height in foreground, corridor receding behind",
    notes:
      "Common. The eleven-cup count is the canon signature — eleven is intentional (matches the Stakeholder Wrangler's eleven podiums; deliberate set-internal echo).",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the entry-tier's-most-visible-tribute archetype.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_stakeholder_wrangler — eleven-count echo",
    ],
  },

  "s2_hierarchy_intn_note_taker": {
    cardId: "s2_hierarchy_intn_note_taker",
    name: "Note-Taker",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "She captures every action item. She circulates the recap. The recap is acknowledged. The action items are not done. She captures every action item.",
    sceneDelta:
      "Mid-shot. A focused Hierarchy intern in the corner of a Hierarchy meeting-room, mid-twenties, in Hierarchy charcoal cardigan over a soft-cream blouse. Hunched slightly over a Hierarchy-branded laptop in lap-mode; fingers fast on the keyboard mid-type. A small Hierarchy paper-notebook on the chair-arm with several action-item bullet-points already inked. Face: focused, mid-listen, mid-capture.",
    moodKeywords: [
      "every action item captured",
      "the recap acknowledged, not done",
      "hunched corner-of-room posture",
      "ink-bullet action items",
    ],
    palette:
      "Hierarchy charcoal cardigan + soft-cream blouse + Hierarchy-branded laptop dark + paper-notebook cream + warm meeting-room overhead + lanyard plum-silver",
    composition:
      "Mid-shot side three-quarter, Note-Taker at frame-edge of meeting-room, meeting-table partially visible at frame-centre, action-item notebook on chair-arm in foreground",
    notes:
      "Common. The hunched-corner posture is the canonical signature; the action-item-bullets-ink-already on the side notebook reads as the visual tell.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the institutional-memory entry-tier role.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_intn_data_entry_drone": {
    cardId: "s2_hierarchy_intn_data_entry_drone",
    name: "Data-Entry Drone",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Three thousand rows imported. Six hundred required manual cleanup. Two were skipped. The Drone will, at the next opportunity, return to those two.",
    sceneDelta:
      "Mid-shot. A Hierarchy intern at a Hierarchy data-pod entry-station, mid-twenties, in standard Hierarchy charcoal-and-cream casual. Single tall monitor showing a vast Hierarchy spreadsheet, scrolled to a row near the bottom of three thousand. Right hand on numeric-keypad in mid-keystroke; left hand on a printed Hierarchy import-source document. Face: tired, focused, eyes locked on the screen.",
    moodKeywords: [
      "three thousand rows imported",
      "two skipped, will return",
      "numeric-keypad mid-keystroke",
      "tired focused eyes-locked",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan spreadsheet monitor + warm desk-lamp + import-source document pale-grey + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Drone at frame-centre seated, monitor at frame-right showing vast spreadsheet, import-document at desk-foreground",
    notes:
      "Common. The visible row-count near three-thousand is the canonical signature; the two-skipped flavor-line should not have a visible counterpart on screen (the menace is in the implication).",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the volume-of-clerical-work entry-tier role.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_intn_onboarding_survivor": {
    cardId: "s2_hierarchy_intn_onboarding_survivor",
    name: "Onboarding Survivor",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Day forty-seven. Forty-six trainings remain in the queue. The Survivor has, by attrition, become senior to two New Hires and is now expected to mentor them.",
    sceneDelta:
      "Mid-shot. A slightly-rumpled Hierarchy intern at a Hierarchy team-pod entry-desk, mid-twenties, in Hierarchy charcoal cardigan over a slightly-wrinkled cream blouse. Single laptop showing the Hierarchy training-portal with a long descending list of MODULES TO COMPLETE; visible progress-bar at 17%. Right hand mid-click on the next module; left hand on a Hierarchy mug at chest-height (cold). Face: stoic, tired, faintly amused.",
    moodKeywords: [
      "day forty-seven, forty-six remain",
      "17% progress",
      "stoic tired faint-amusement",
      "now expected to mentor",
    ],
    palette:
      "Hierarchy charcoal cardigan + wrinkled cream blouse + cool-cyan training-portal + warm desk-lamp + cold-mug muted-warm + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Survivor at frame-centre seated, training-portal monitor at frame-right showing module-list, mug held at chest-foreground",
    notes:
      "Common. Pairs with New Hire (within-tier) — the Survivor visualizes the day-47 state; the New Hire visualizes day-1. The 17% progress-bar is the canonical signature.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the early-tenure-attrition archetype.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_intn_new_hire — tenure-progression pairing",
    ],
  },

  "s2_hierarchy_intn_ticket_triager": {
    cardId: "s2_hierarchy_intn_ticket_triager",
    name: "Ticket Triager",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Eighty incoming tickets. Twelve assigned. Sixty-eight reclassified as 'documentation gap'. The Triager has documented the gap. The documentation has been categorized as 'pending review'.",
    sceneDelta:
      "Mid-shot. A Hierarchy intern at a Hierarchy support-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single tall monitor showing a Hierarchy ticket-queue with eighty rows visible; many rows tagged with a small 'DOCUMENTATION GAP' label in muted-amber. Right hand mid-click on the bulk-tag dropdown; left hand on a Hierarchy support-playbook printout. Face: focused, mildly weary.",
    moodKeywords: [
      "eighty incoming tickets",
      "documentation gap as bulk-tag",
      "playbook printout at hand",
      "focused mildly weary",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan ticket-queue + DOCUMENTATION GAP muted-amber tag + warm desk-lamp + playbook printout pale-grey + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Triager at frame-centre seated, ticket-queue monitor at frame-right, playbook printout at chest-foreground",
    notes:
      "Common. The bulk-tag dropdown mid-click is the canonical signature.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the support-queue triage entry-tier role.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_intn_status_update_drone": {
    cardId: "s2_hierarchy_intn_status_update_drone",
    name: "Status-Update Drone",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Yesterday: gathered statuses. Today: gathered statuses. Blockers: those who do not respond to the status request. Plan: gather statuses.",
    sceneDelta:
      "Mid-shot. A patient Hierarchy intern at a Hierarchy ops-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single laptop showing a Hierarchy status-collation document with seven rows of contributors: three filled, three with 'AWAITING' in muted-amber, one with 'NO RESPONSE' in soft-red. Right hand mid-keystroke composing a follow-up DM; left hand resting on the desk. Face: patiently expectant.",
    moodKeywords: [
      "AWAITING and NO RESPONSE",
      "the follow-up DM",
      "patiently expectant",
      "seven rows, three filled",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan status-document + AWAITING muted-amber + NO RESPONSE soft-red + warm desk-lamp + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Drone at frame-centre seated, monitor at frame-right with status-document visible, follow-up DM compose-window in foreground",
    notes:
      "Common. The seven-row status table with the three-state breakdown is the canonical signature.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the status-collection entry-tier role; pairs with Project Coordinator (Analyst) — the Drone gathers, the Coordinator presents.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_anl_project_coordinator — status-stack pairing",
    ],
  },

  "s2_hierarchy_intn_calendar_sync_imp": {
    cardId: "s2_hierarchy_intn_calendar_sync_imp",
    name: "Calendar-Sync Imp",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "He resolved the meeting conflict. The resolution created two new conflicts. He resolved those. The Hierarchy's calendar is now, by a generous reading, internally consistent.",
    sceneDelta:
      "Mid-shot. A small wiry Quarchon intern at a Hierarchy entry-pod desk, twenties, in Hierarchy charcoal vest over a faded grey t-shirt, fingerless leather gloves, ledger-pen behind one pointed ear (matching the Manager-tier imp visual). Single monitor showing a Hierarchy multi-calendar view with overlapping blocks; right hand mid-drag of one block to a new slot; left hand resting on a printed schedule-key. Face: sharp, faintly amused fox-grin.",
    moodKeywords: [
      "two conflicts created from one resolved",
      "fingerless gloves entry-tier",
      "fox-grin at the calendar",
      "internally consistent by generous reading",
    ],
    palette:
      "Hierarchy charcoal vest + faded grey t-shirt + fingerless leather gloves + cool-cyan multi-calendar view + warm desk-lamp + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Imp at frame-centre seated, monitor at frame-right with multi-calendar view, mid-drag block in motion",
    notes:
      "Common. Inherits the imp visual language (fingerless gloves, ledger-pen, fox-grin) at entry-tier — pairs with Estimation Goblin (Manager) on the imp visual lineage.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the calendar-juggling entry-tier role; matches the broader Hierarchy imp archetype.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_mgr_calendar_demon — calendar-stack pairing",
    ],
  },

  "s2_hierarchy_intn_document_reviewer": {
    cardId: "s2_hierarchy_intn_document_reviewer",
    name: "Document Reviewer",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Forty pages. Track-changes engaged. Comment count: ninety-eight. None of the comments are substantive. All of them are required. The document will, the Reviewer assures, be released by EOD.",
    sceneDelta:
      "Mid-shot. A focused Hierarchy intern at a Hierarchy review-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single tall monitor showing a Hierarchy document with track-changes panel filled with margin-comments in cool-cyan and warm-amber. Right hand mid-comment-add; left hand on a printed Hierarchy review-checklist. Face: mid-twenties focused, eyes slightly red.",
    moodKeywords: [
      "forty pages, ninety-eight comments",
      "none substantive, all required",
      "track-changes panel cluttered",
      "eyes slightly red",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan document monitor + track-changes warm-amber + cool-cyan margin-comments + review-checklist forest-green + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Reviewer at frame-centre seated, monitor at frame-right with track-changes panel visible, review-checklist at desk-foreground",
    notes:
      "Common. The cluttered margin-comment panel is the canonical signature.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the document-review entry-tier role.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_intn_lunch_order_coordinator": {
    cardId: "s2_hierarchy_intn_lunch_order_coordinator",
    name: "Lunch-Order Coordinator",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Twenty-three orders. Eight dietary restrictions. Two unstated allergies. One vendor that closed unannounced. The Coordinator's plan B has, of course, been activated since 11:14am.",
    sceneDelta:
      "Mid-shot. A composed Hierarchy intern at a small Hierarchy ops-pod corner, mid-twenties, in Hierarchy charcoal-and-cream casual. Holds a Hierarchy office-issued tablet displaying a Hierarchy lunch-order spreadsheet with twenty-three rows; a small flagged column shows dietary-restriction icons. Phone wedged between shoulder and ear, mid-call to the backup vendor. Face: focused, faintly grim.",
    moodKeywords: [
      "twenty-three orders, eight restrictions",
      "plan B activated 11:14am",
      "phone shoulder-wedged",
      "focused faintly grim",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan tablet display + dietary-icon multi-color cluster + warm corridor light + Hierarchy phone matte-charcoal + lanyard plum-silver",
    composition:
      "Mid-shot side three-quarter, Coordinator at frame-centre, tablet at chest-height in foreground, phone at shoulder",
    notes:
      "Common. The shoulder-wedged-phone is the canonical signature; pairs with Office Manager Specter (Analyst) at the entry-tier.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the small-logistics entry-tier role.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_anl_office_manager — logistics-stack pairing",
    ],
  },

  "s2_hierarchy_intn_survey_form_drone": {
    cardId: "s2_hierarchy_intn_survey_form_drone",
    name: "Survey-Form Drone",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "The pulse-survey is open. The pulse-survey is reminded. The pulse-survey is closed. The results are aggregated. The results show no concerns. The pulse-survey is open.",
    sceneDelta:
      "Mid-shot. A patient Hierarchy intern at a Hierarchy people-ops entry-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single tall monitor showing a Hierarchy pulse-survey admin panel with a list of recurring surveys and their states (OPEN / REMINDED / CLOSED / AGGREGATING) in muted-amber and cool-cyan. Right hand mid-click on the SCHEDULE NEXT WAVE button; left hand on a small Hierarchy survey-template printout. Face: politely-engaged.",
    moodKeywords: [
      "pulse-survey open / reminded / closed",
      "no concerns reported",
      "SCHEDULE NEXT WAVE mid-click",
      "politely-engaged composure",
    ],
    palette:
      "Hierarchy charcoal-and-cream casual + cool-cyan survey-admin panel + state-indicator muted-amber accents + warm desk-lamp + survey-template pale-cream + lanyard plum-silver",
    composition:
      "Mid-shot front three-quarter, Drone at frame-centre seated, monitor at frame-right with survey-admin visible, template at chest-foreground",
    notes:
      "Common. The state-indicator column is the canonical signature; pairs with Internal Communications Analyst (within Hierarchy comms-stack) — the Drone runs the survey, the Analyst drafts the recap-narrative.",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the engagement-survey entry-tier role.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_anl_internal_comms — comms-stack pairing",
    ],
  },

  "s2_hierarchy_intn_eoq_casualty": {
    cardId: "s2_hierarchy_intn_eoq_casualty",
    name: "End-of-Quarter Casualty",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "common",
    cardType: "unit",
    flavorText:
      "Sprint pushed. Deadline held. Story-points delivered. The Casualty has not slept since Tuesday. The Casualty's Q4 PIP, formally initiated this morning, was — the Casualty learns — a foregone conclusion since Q3.",
    sceneDelta:
      "Mid-shot close. A clearly-exhausted Hierarchy intern slumped at a Hierarchy team-pod desk, late-twenties, in a wrinkled Hierarchy charcoal cardigan over a creased cream t-shirt. Three empty Hierarchy energy-drink cans on the desk. The desk-clock visible reads 03:47. Single laptop showing a Hierarchy sprint-board fully marked DONE in green. The Casualty's head is down on folded arms, eyes closed. A small unopened Hierarchy email notification visible in the corner of the screen, subject-line readable: 'Performance Improvement Plan — Required Meeting'.",
    moodKeywords: [
      "sprint pushed, deadline held",
      "03:47 desk-clock",
      "PIP email unopened",
      "head down on folded arms",
    ],
    palette:
      "Hierarchy wrinkled charcoal cardigan + creased cream t-shirt + cool-cyan sprint-board DONE + warm desk-lamp + energy-drink cans muted-warm + PIP email subject-line muted-amber + lanyard plum-silver askew",
    composition:
      "Mid-shot close side, Casualty at frame-centre slumped, laptop at frame-right with sprint-board + PIP email both visible, energy-drink cans on desk-foreground",
    notes:
      "Common. The PIP-email-while-slumped composition is the canonical End-of-Quarter Casualty signature; the desk-clock at 03:47 echoes the Pivot-Memo Phantom's 4:47pm in inverted form (early-morning, not late-afternoon).",
    archetypeRationale:
      "Newly-named per plan. Token-generator visualizing the Hierarchy's 'overwork as power source' synergy directly — the entry-tier card whose sacrifice fuels the deathwatch / consumption mechanics across S2_HIERARCHY.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_chro_mor_vethic — termination-pipeline pairing",
      "(intra-set) §s2_hierarchy_dir_q4_ritualist — quarterly-cycle pairing",
    ],
  },
};

export const INTERN_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
