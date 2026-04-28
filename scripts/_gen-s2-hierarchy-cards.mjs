#!/usr/bin/env node
/* Generate the bulk S2 Hierarchy of the Damned card definitions.

   Emits these files under apps/shared/tcg-core/cards/definitions/s2_hierarchy/:
     - directors.ts       (14 epic · 5-cost · 5/5 base)
     - managers.ts        (18 rare · 4-cost · 4/4 base)
     - analysts.ts        (24 uncommon · 3-cost · 3/3 base)
     - interns.ts         (16 common · 1-2 cost · 2/2 or 1/3 base)
     - act_exclusives.ts  (28 epic/legendary · unlockCondition act_completion)
     - special_editions.ts (10 epic · unlockCondition secret/battle_pass/etc.)

   c_suite.ts and vps.ts are hand-authored separately (richest lore).

   Templates pick keywords + abilities from each card's slug (e.g.
   `wraith` → ephemeral, `imp` → fury, `auditor` → silence). Every
   ability is tagged `// AUTO-DRAFT` so design can grep for them.
*/
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(
  ROOT,
  "apps",
  "shared",
  "tcg-core",
  "cards",
  "definitions",
  "s2_hierarchy",
);
mkdirSync(OUT_DIR, { recursive: true });

/* ─── Producer slugs (matches hierarchyOfDamned.ts manifest) ─── */

const DIRECTORS = [
  "s2_hierarchy_dir_bottom_line_decimator",
  "s2_hierarchy_dir_compliance_inquisitor",
  "s2_hierarchy_dir_cross_functional_predator",
  "s2_hierarchy_dir_fenra",
  "s2_hierarchy_dir_jira_ghoul",
  "s2_hierarchy_dir_metrics_oracle",
  "s2_hierarchy_dir_okr_specter",
  "s2_hierarchy_dir_pivot_demon",
  "s2_hierarchy_dir_q4_ritualist",
  "s2_hierarchy_dir_rif_custodian",
  "s2_hierarchy_dir_synergy_vampire",
  "s2_hierarchy_dir_townhall_phantom",
  "s2_hierarchy_dir_velm_acrith",
  "s2_hierarchy_dir_velocity_wraith",
];
const MANAGERS = [
  "s2_hierarchy_mgr_backlog_maw",
  "s2_hierarchy_mgr_burndown_imp",
  "s2_hierarchy_mgr_calendar_demon",
  "s2_hierarchy_mgr_channel_conflict_goblin",
  "s2_hierarchy_mgr_demand_gen_phantom",
  "s2_hierarchy_mgr_estimation_goblin",
  "s2_hierarchy_mgr_midyear_adjuster",
  "s2_hierarchy_mgr_perf_review_wraith",
  "s2_hierarchy_mgr_pivot_memo_phantom",
  "s2_hierarchy_mgr_process_imp",
  "s2_hierarchy_mgr_quarterly_forecaster",
  "s2_hierarchy_mgr_reorg_specter",
  "s2_hierarchy_mgr_roadmap_banshee",
  "s2_hierarchy_mgr_slack_phantom",
  "s2_hierarchy_mgr_stakeholder_wrangler",
  "s2_hierarchy_mgr_stand_up_wraith",
  "s2_hierarchy_mgr_token_economy_imp",
  "s2_hierarchy_mgr_vendor_mgmt_wraith",
];
const ANALYSTS = [
  "s2_hierarchy_anl_brand_coordinator",
  "s2_hierarchy_anl_compliance_auditor",
  "s2_hierarchy_anl_cs_drone",
  "s2_hierarchy_anl_data_analyst",
  "s2_hierarchy_anl_finance_analyst",
  "s2_hierarchy_anl_internal_comms",
  "s2_hierarchy_anl_internal_mobility",
  "s2_hierarchy_anl_ir_coordinator",
  "s2_hierarchy_anl_knowledge_management",
  "s2_hierarchy_anl_marketing_analyst",
  "s2_hierarchy_anl_office_manager",
  "s2_hierarchy_anl_pricing_analyst",
  "s2_hierarchy_anl_procurement_clerk",
  "s2_hierarchy_anl_project_coordinator",
  "s2_hierarchy_anl_qa_imp",
  "s2_hierarchy_anl_recruiting_coordinator",
  "s2_hierarchy_anl_reporting_specialist",
  "s2_hierarchy_anl_risk_modeler",
  "s2_hierarchy_anl_sales_ops",
  "s2_hierarchy_anl_tax_compliance",
  "s2_hierarchy_anl_training_content_designer",
  "s2_hierarchy_anl_travel_expense_auditor",
  "s2_hierarchy_anl_ux_researcher",
  "s2_hierarchy_anl_vendor_coordinator",
];
const INTERNS = [
  "s2_hierarchy_intn_calendar_sync_imp",
  "s2_hierarchy_intn_coffee_runner",
  "s2_hierarchy_intn_data_entry_drone",
  "s2_hierarchy_intn_document_reviewer",
  "s2_hierarchy_intn_eoq_casualty",
  "s2_hierarchy_intn_lunch_order_coordinator",
  "s2_hierarchy_intn_new_hire",
  "s2_hierarchy_intn_note_taker",
  "s2_hierarchy_intn_onboarding_shadow",
  "s2_hierarchy_intn_onboarding_survivor",
  "s2_hierarchy_intn_print_room_attendant",
  "s2_hierarchy_intn_slack_reactor",
  "s2_hierarchy_intn_stand_up_lurker",
  "s2_hierarchy_intn_status_update_drone",
  "s2_hierarchy_intn_survey_form_drone",
  "s2_hierarchy_intn_ticket_triager",
];
const ACT_EXCLUSIVES = [
  "act1_first_witness",
  "act1_substrate_static",
  "act1_the_signal",
  "act1_twelve_step_inheritance",
  "act2_bond_60_silence",
  "act2_conspiracy_of_two",
  "act2_engineers_bench",
  "act2_the_whisper",
  "act3_ithrael_scouts",
  "act3_soul_map_calibration",
  "act3_the_offer",
  "act3_three_path_crossroads",
  "act4_memory_extraction",
  "act4_oracle_half_mask",
  "act4_the_revelation",
  "act4_two_witnesses_meet",
  "act5_antiquarian_prestige",
  "act5_sector_navigation_charm",
  "act5_the_map_decoded",
  "act5_vortex_core_cleared",
  "act6_banishment_glyph",
  "act6_bond_90_confessional",
  "act6_narrators_truth",
  "act6_the_confession",
  "act7_all_faction_convergence",
  "act7_convergence_chord",
  "act7_final_witness_bond100",
  "act7_the_convergence",
];
const SPECIAL_EDITIONS = [
  "secret_act1_memoirist_is_memoir",
  "secret_act2_engineers_bench",
  "secret_act3_pledge_was_made",
  "secret_act4_witnesses_always_knew",
  "secret_act5_source_is_reflection",
  "secret_act6_confession_mutual",
  "secret_act7_chord_is_listener",
  "special_authors_edition_s2",
  "special_founding_author",
  "special_the_author_bp50",
];

/* ─── Naming helpers ─── */

function titleCase(slug, dropPrefix = "") {
  let s = slug.replace(/^s2_hierarchy_(?:dir|mgr|anl|intn)_/, "");
  if (dropPrefix) s = s.replace(new RegExp(`^${dropPrefix}_?`), "");
  return s
    .split("_")
    .map((w) => (w === "vp" || w === "ux" || w === "qa" || w === "cs" || w === "ir" ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function actName(slug) {
  return slug
    .replace(/^act\d_/, "")
    .replace(/^secret_act\d_/, "")
    .replace(/^special_/, "")
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─── Slug-driven keyword + ability picker ─── */

/* Highest-priority match wins. Ordered so narrower archetypes
 * (auditor, decimator) take precedence over broader synonyms
 * (synergy, predator). */
const KEYWORD_RULES = [
  [/wraith|phantom|specter|ghost|ghoul/, "ephemeral"],
  [/imp|demon|goblin/,                   "fury"],
  [/auditor|reviewer|compliance|inquisitor/, "dispel"],
  [/decimator|flayer|unmaker/,           "blast"],
  [/predator|vampire|synergy/,           "drain"],
  [/oracle|metrics|banshee/,             "ranged"],
  [/maw|vendor|stakeholder/,             "provoke"],
  [/velocity|burndown/,                  "rush"],
];

function pickKeyword(slug) {
  for (const [pattern, kw] of KEYWORD_RULES) if (pattern.test(slug)) return kw;
  return null;
}

/* Slug-pattern → ability-template-string. First matching rule wins.
 * Rules order matters when patterns overlap (e.g. `predator|vampire`
 * subsumes `vampire`-only). */
const ABILITY_RULES = [
  [/auditor|inquisitor|reviewer/, () => `      effect: { op: "silence", to: { kind: "trigger_source" } },`,
    `      trigger: { kind: "on_deploy" },`],
  [/decimator|flayer|unmaker/, (rarity) => `      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: ${rarity === "epic" ? 2 : 1} },
        to: { kind: "enemy_general" },
      },`,
    `      trigger: { kind: "on_deploy" },`],
  [/oracle|metrics|forecaster|modeler/, () => `      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },`,
    `      trigger: { kind: "on_deploy" },`],
  [/maw|backlog|gen_phantom|demand|estimation/, () => `      effect: { op: "discard", amount: { kind: "const", value: 1 }, from: "opponent", mode: "random" },`,
    `      trigger: { kind: "on_deploy" },`],
  [/predator|vampire|synergy/, () => `      effect: { op: "heal", amount: { kind: "const", value: 1 }, to: { kind: "self" } },`,
    `      trigger: { kind: "on_damage_dealt", by: "self" },`],
  [/q4|midyear|reorg|pivot/, () => `      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },`,
    `      trigger: { kind: "on_turn_end", owner: "self" },`],
  [/rif/, () => `      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },`,
    `      trigger: { kind: "on_any_unit_dies", filter: { faction: [F] } },`],
];

function pickAbility(slug, rarity) {
  const id = slug.replace(/^s2_hierarchy_(?:dir|mgr|anl|intn)_/, "").slice(0, 28) + "_signature";
  for (const [pattern, effectFn, trigger] of ABILITY_RULES) {
    if (pattern.test(slug)) {
      return `    {
      // AUTO-DRAFT
      id: "${id}" as CardDefinition["abilities"][number]["id"],
${trigger}
${effectFn(rarity)}
    },`;
    }
  }
  return null; // vanilla
}

/* ─── Card-emitter helpers ─── */

const RARITY_TEMPLATES = {
  epic: { cost: 5, power: 5, health: 5, verdict: -1, trial: ["evidence"] },
  rare: { cost: 4, power: 4, health: 4, verdict: -1, trial: ["evidence"] },
  uncommon: { cost: 3, power: 3, health: 3, verdict: 0, trial: ["defensive"] },
  common: { cost: 2, power: 2, health: 2, verdict: 0, trial: ["defensive"] },
};

function emitCard(slug, rarity, opts = {}) {
  const tpl = RARITY_TEMPLATES[rarity];
  const name = opts.name ?? titleCase(slug);
  const keyword = pickKeyword(slug);
  const ability = pickAbility(slug, rarity);
  const exportName = slug.replace(/^s2_hierarchy_/, "").replace(/^act/, "ax_act").replace(/^secret_act/, "se_act").replace(/^special_/, "se_");
  const safeExport = exportName.replace(/[^a-z0-9_]/g, "_");

  return `export const ${safeExport}: CardDefinition = {
  id: "${slug}" as CardDefinition["id"],
  name: "${name.replace(/"/g, '\\"')}",
  faction: F,
  cardType: "unit",
  rarity: "${rarity}",
  cost: ${opts.cost ?? tpl.cost},
  baseStats: { power: ${opts.power ?? tpl.power}, health: ${opts.health ?? tpl.health} },
  keywords: [${keyword ? `"${keyword}"` : ""}],
  abilities: [${ability ? "\n" + ability + "\n  " : ""}],
  art: art("${slug}"),
  flavorText: "${(opts.flavor ?? defaultFlavor(slug)).replace(/"/g, '\\"')}",
  rulesVersion: RULES,
  trial_categories: [${tpl.trial.map((t) => `"${t}"`).join(", ")}] as const,
  verdict_delta: ${tpl.verdict},${opts.unlockCondition ? `\n  unlockCondition: ${opts.unlockCondition},` : ""}
};`;
}

function defaultFlavor(slug) {
  if (/wraith|phantom|specter|ghost|ghoul/.test(slug)) {
    return "It does not haunt the meeting. It IS the meeting.";
  }
  if (/imp|demon|goblin/.test(slug)) {
    return "Small. Persistent. Erodes by attrition. Already on your calendar.";
  }
  if (/oracle|metrics|forecaster/.test(slug)) {
    return "The dashboard speaks. The dashboard is always speaking. You stopped listening years ago.";
  }
  if (/auditor|reviewer|compliance|inquisitor/.test(slug)) {
    return "The audit is procedural. The findings are not.";
  }
  return "Another seat at another table that did not need to exist.";
}

/* ─── File assembly ─── */

const HEADER_PREAMBLE = `import type { CardDefinition } from "../../../index";
import { art, HIERARCHY_FACTION as F } from "./_art";

const RULES = "1.0.0";
`;

function emitFile(filename, header, slugs, rarity, opts = {}) {
  const cards = slugs.map((slug) => emitCard(slug, rarity, typeof opts === "function" ? opts(slug) : opts));
  const exportNames = slugs.map((s) =>
    s.replace(/^s2_hierarchy_/, "").replace(/^act/, "ax_act").replace(/^secret_act/, "se_act").replace(/^special_/, "se_").replace(/[^a-z0-9_]/g, "_"),
  );
  const collection = filename
    .replace(/\.ts$/, "")
    .toUpperCase()
    .replace(/^_/, "");
  const arrName = `S2_HIERARCHY_${collection}`;
  const body = `${header}\n${HEADER_PREAMBLE}\n${cards.join("\n\n")}\n\nexport const ${arrName}: readonly CardDefinition[] = [\n${exportNames.map((n) => "  " + n + ",").join("\n")}\n];\n`;
  writeFileSync(join(OUT_DIR, filename), body);
  console.log(`  wrote ${filename}: ${slugs.length} cards`);
}

/* Directors (14 epic) */
emitFile(
  "directors.ts",
  `/**
 * S2 — Hierarchy of the Damned · Directors (14 epic · 5-cost · 5/5).
 * AUTO-GENERATED by scripts/_gen-s2-hierarchy-cards.mjs from the
 * producer-slug list. Hand-edit individual cards in this file if
 * design wants finer tuning; the generator is idempotent on re-run
 * (overwrites this file, so move custom edits into the generator's
 * per-slug overrides if you need them sticky).
 */`,
  DIRECTORS,
  "epic",
);

/* Managers (18 rare) */
emitFile(
  "managers.ts",
  `/**
 * S2 — Hierarchy of the Damned · Managers (18 rare · 4-cost · 4/4).
 * AUTO-GENERATED by scripts/_gen-s2-hierarchy-cards.mjs.
 */`,
  MANAGERS,
  "rare",
);

/* Analysts (24 uncommon) */
emitFile(
  "analysts.ts",
  `/**
 * S2 — Hierarchy of the Damned · Analysts (24 uncommon · 3-cost · 3/3).
 * AUTO-GENERATED by scripts/_gen-s2-hierarchy-cards.mjs.
 */`,
  ANALYSTS,
  "uncommon",
);

/* Interns (16 common) */
emitFile(
  "interns.ts",
  `/**
 * S2 — Hierarchy of the Damned · Interns (16 common · 2-cost · 2/2).
 * AUTO-GENERATED by scripts/_gen-s2-hierarchy-cards.mjs.
 */`,
  INTERNS,
  "common",
);

/* Act exclusives (28 epic, unlockCondition: act_completion) */
function actNum(slug) {
  const m = /^act(\d)_/.exec(slug);
  return m ? Number(m[1]) : 1;
}
emitFile(
  "act_exclusives.ts",
  `/**
 * S2 — Hierarchy of the Damned · Act Exclusives (28 epic).
 * AUTO-GENERATED by scripts/_gen-s2-hierarchy-cards.mjs.
 *
 * Each card unlocks on completion of its gating act per the
 * \`unlockCondition: { kind: "act_completion", act: N }\` field.
 * The expansionUnlockService dispatches this against player
 * progression state.
 */`,
  ACT_EXCLUSIVES,
  "epic",
  (slug) => ({
    name: actName(slug),
    cost: 5,
    power: 5,
    health: 5,
    flavor: "Earned at the gate. Forgotten by the hand that earned it.",
    unlockCondition: `{ kind: "act_completion", act: ${actNum(slug)} }`,
  }),
);

/* Special editions (10 epic, unlockCondition varies) */
function secretActNum(slug) {
  const m = /^secret_act(\d)_/.exec(slug);
  return m ? Number(m[1]) : 7;
}
emitFile(
  "special_editions.ts",
  `/**
 * S2 — Hierarchy of the Damned · Special Editions (10 epic).
 * AUTO-GENERATED by scripts/_gen-s2-hierarchy-cards.mjs.
 *
 * Seven secrets (one per act) + three "author" prestige cards. Each
 * carries a distinct unlockCondition. The expansionUnlockService
 * dispatches.
 */`,
  SPECIAL_EDITIONS,
  "epic",   // engine has no "mythic"; legendary is reserved for the canonical lore characters.
  (slug) => {
    let unlock;
    if (slug.startsWith("secret_act")) {
      unlock = `{ kind: "secret", act: ${secretActNum(slug)} }`;
    } else if (slug === "special_the_author_bp50") {
      unlock = `{ kind: "battle_pass", tier: 50 }`;
    } else if (slug === "special_founding_author") {
      unlock = `{ kind: "founding_author" }`;
    } else if (slug === "special_authors_edition_s2") {
      unlock = `{ kind: "authors_edition", season: "s2" }`;
    }
    return {
      name: actName(slug),
      cost: 6,
      power: 5,
      health: 6,
      flavor: "A reveal that became a relic. The hand that played it remembered why.",
      unlockCondition: unlock,
    };
  },
);

console.log("Done.");
