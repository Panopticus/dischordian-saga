#!/usr/bin/env tsx
/**
 * One-shot codemod for plan Part I: upgrade balanceException
 * `reason` and `reviewer` fields on 41 of the 45 cards auto-classified
 * by PR #486. The 4 flagged-for-rebalance cards (general_prometheus,
 * wraith_calder, loop_walker, honor_guard) are skipped — they stay
 * with reviewer "2026-05-stat-curve-recalibration" until a stat
 * decision lands in a follow-up PR.
 *
 * Each entry pairs a card-definition file with the card id it
 * targets, the new reason text (mechanic-specific per the plan
 * templates), and the new reviewer handle.
 *
 * Usage:
 *   pnpm tsx apps/scripts/upgrade-balance-reasons.ts            (preview)
 *   pnpm tsx apps/scripts/upgrade-balance-reasons.ts --apply    (write)
 *
 * Idempotent: a card whose reviewer already differs from the
 * 2026-05-stat-curve-recalibration baseline is skipped silently
 * (so re-runs after partial application are safe).
 */
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");
const APPLY = process.argv.includes("--apply");
const REVIEWER_NEW = "panopticus";
const REVIEWER_OLD = "2026-05-stat-curve-recalibration";

interface Upgrade {
  /** Card id (id: "..." in the CardDefinition) */
  cardId: string;
  /** Source file relative to apps/shared/tcg-core/cards/definitions/ */
  file: string;
  /** New reason text. */
  reason: string;
}

const UPGRADES: ReadonlyArray<Upgrade> = [
  // ── Cost 1: cyclers + pets ──
  {
    cardId: "s1_char_089",
    file: "neutral/s1_char_089_courier_sprite.ts",
    reason:
      "1/1 cycler design: small body is the cost, on-death draw is the value. Curve-printed line is intentional below floor — the card is a 1-mana card-replacement plus a flying chump.",
  },
  {
    cardId: "s1_pack_021",
    file: "dreamer/s1_pack_021_starlight_familiar.ts",
    reason:
      "1/1 cycler design: small flier body, on-death draw replaces the card. Sub-curve printed stats are the trade for guaranteed card-replacement at 1 mana.",
  },
  {
    cardId: "s1_pack_pet_gilt_beetle_1",
    file: "architect/s1_pack_pet_gilt_beetle_1.ts",
    reason:
      "Pet flavor-tier unit: provoke is the value, sub-curve stat profile keeps pet rewards from competing with main-board threats.",
  },
  {
    cardId: "s1_pack_pet_spore_fungus_1",
    file: "insurgency/s1_pack_pet_spore_fungus_1.ts",
    reason:
      "Pet engine: 0/2 body with on-death spore-token summon is the swarm-seed pattern; raw stats below curve because the value is the chain that follows it dying.",
  },
  {
    cardId: "s1_pack_pet_temporal_kitten_1",
    file: "dreamer/s1_pack_pet_temporal_kitten_1.ts",
    reason:
      "Pet engine: 1/1 rush + on-death draw — immediate impact + free card replacement at 1 mana. Sub-curve printed stats are the trade for both lines of value.",
  },
  {
    cardId: "s1_reward_pet_streak",
    file: "neutral/s1_reward_pet_streak.ts",
    reason:
      "Reward-tier pet from the win-streak grant pool. Sub-curve flavor unit; rush keyword is the only board-relevant value.",
  },

  // ── Cost 2 ──
  {
    cardId: "s1_elem_air_01",
    file: "elemental/air.ts",
    reason:
      "Element-kit baseline: 1/2 flier with on-deploy draw is the air-element template. The kit's design lives in value-text-not-stats (drawing, repositioning, dispelling).",
  },
  {
    cardId: "s1_neutral_pack_001",
    file: "neutral/engine_demo_cards.ts",
    reason:
      "Pack snowball mechanic: pack scales +1 power per other ally with the same defId. Solo printed stats are floor; with 2 copies effective stats reach curve, with 4 copies far exceed it. Sub-curve printed line is intentional to prevent solo over-stat.",
  },

  // ── Cost 3 ──
  {
    cardId: "s1_char_111",
    file: "dreamer/s1_char_111_vision_walker.ts",
    reason:
      "Ability-driven design: 2/3 flier + on-deploy random buff (+1/+1 to a friendly). Sub-curve printed stats compensate for board-presence + buff value at 3 mana.",
  },
  {
    cardId: "s1_char_114",
    file: "thought_virus/s1_char_114_viral_vector.ts",
    reason:
      "Death-rattle control: on-death applies permanent -1/-1 to adjacent enemies. The unit is a removal trade dressed as a body; sub-curve printed stats compensate for the persistent debuff.",
  },
  {
    cardId: "s1_char_124",
    file: "antiquarian/s1_char_124_age_walker.ts",
    reason:
      "Grow snowball: +1/+1 at start of owner's turn (post-H2 the keyword is functional). Sub-curve printed line is intentional — by turn 4 the unit is on-curve, by turn 6 it's well above. Matches the grow-archetype design.",
  },
  {
    cardId: "s1_dim_time_01",
    file: "dimensional/time.ts",
    reason:
      "Grow snowball: +1/+1 at start of owner's turn. Antiquarian's late-game-scaling archetype. Sub-curve printed line is the floor; effective ceiling is unbounded across long games.",
  },
  {
    cardId: "s1_imprint_the_detective_t2",
    file: "imprint/the_detective.ts",
    reason:
      "Imprint-tier scaling design (T2): stats stay below curve so tier upgrades land mechanic-side. T2 adds backstab + on-deploy draw; the player feels growth via tier, not stat creep.",
  },
  {
    cardId: "s1_imprint_the_engineer_t2",
    file: "imprint/the_engineer.ts",
    reason:
      "Imprint-tier scaling design (T2): stats stay below curve so tier upgrades land mechanic-side. T2 adds the on-deploy draw; T3 deepens to draw 2. The player feels tier growth as an ability acquisition curve.",
  },
  {
    cardId: "s1_imprint_the_oracle_t2",
    file: "imprint/the_oracle.ts",
    reason:
      "Imprint-tier scaling design (T2): stats stay below curve so tier upgrades land mechanic-side. T2 adds dispel — buff-removal is the per-card value at 3 mana.",
  },
  {
    cardId: "s1_neutral_if_001",
    file: "neutral/engine_demo_cards.ts",
    reason:
      "Conditional buff card: 2/3 floor; if damage_dealt_match >= 4 the unit becomes 4/5 effective on deploy (= 9 stats, on curve). Sub-curve printed line reflects the floor; the if-branch is the ceiling.",
  },
  {
    cardId: "s1_neutral_oncardplayed_001",
    file: "neutral/engine_demo_cards.ts",
    reason:
      "Card-engine ability: draws 1 on every spell played while on-board. Sub-curve printed stats compensate for unbounded per-event card-value generation in spell-heavy decks.",
  },
  {
    cardId: "s1_pack_010",
    file: "insurgency/s1_pack_010_signal_repeater.ts",
    reason:
      "Cycler engine: 2/3 body + on-death draw 2 = effective 2-card cycle for a 3-mana investment. Sub-curve printed line is the trade for the strong on-death replacement.",
  },
  {
    cardId: "s1_pack_pet_glyph_moth_2",
    file: "dreamer/s1_pack_pet_glyph_moth_2.ts",
    reason:
      "Pet engine: 2/3 flier + on-death permanent +1/+1 buff to adjacents. Pet form factor with real on-death value; printed stats reflect the body-cost, the death-rattle is the per-card payoff.",
  },
  {
    cardId: "s1_reward_class_spy",
    file: "insurgency/s1_reward_class_spy.ts",
    reason:
      "Reward-tier card from the spy-class grant. Aggressive 3/2 statline + backstab + on-kill draw fits the assassin archetype. Stats held below ladder curve to prevent class rewards from gating competitive play.",
  },

  // ── Cost 4 ──
  {
    cardId: "s1_imprint_the_detective_t3",
    file: "imprint/the_detective.ts",
    reason:
      "Imprint-tier scaling design (T3): stats below curve so tier upgrades land mechanic-side. T3 adds deathwatch on top of the T2 backstab + draw. The player feels growth via tier, not stat creep.",
  },
  {
    cardId: "s1_imprint_the_engineer_t3",
    file: "imprint/the_engineer.ts",
    reason:
      "Imprint-tier scaling design (T3): stats below curve so tier upgrades land mechanic-side. T3 deepens the on-deploy draw to draw 2 — the player feels tier growth as escalating ability strength.",
  },
  {
    cardId: "s1_imprint_the_oracle_t3",
    file: "imprint/the_oracle.ts",
    reason:
      "Imprint-tier scaling design (T3): stats below curve so tier upgrades land mechanic-side. T3 adds on-deploy draw on top of T2 dispel. The keyword + ability stack is the per-tier reward.",
  },
  {
    cardId: "s1_neutral_struct_001",
    file: "neutral/engine_demo_cards.ts",
    reason:
      "Structure tank: cannot move or attack (structure keyword). Above-curve HP is the design role — the unit is a positional anchor, not a threat. The +33% printed-vs-curve stats reflect that structures pay the entire stat budget into HP because they have no offensive output.",
  },
  {
    cardId: "s1_pack_038",
    file: "antiquarian/s1_pack_038_chrono_blade.ts",
    reason:
      "Celerity ability-driven: 4/3 + 2 actions per turn = 8 effective damage potential per turn-cycle. Sub-curve printed stats compensate for the doubled damage cadence.",
  },
  {
    cardId: "s1_pack_id_elara_advocate",
    file: "neutral/s1_pack_id_elara_advocate.ts",
    reason:
      "Mass-heal utility: 2/5 statline + on-deploy heal-all-friendlies +1. The card is a heal spell stapled to a tanky body. Sub-curve printed line reflects the cost of the ongoing board presence.",
  },
  {
    cardId: "s1_pack_seed_fighter",
    file: "new_babylon/s1_pack_seed_fighter.ts",
    reason:
      "Snowball + armor-pierce: rush + pierce + on-kill +2/+0 permanent. Pierce now actually fires post-armor system (PR #488). The on-kill snowball is the per-card ceiling; sub-curve printed stats are the floor.",
  },
  {
    cardId: "s1_reward_campaign_balanced",
    file: "neutral/s1_reward_campaign_balanced.ts",
    reason:
      "Reward-tier card from the balanced-campaign grant. On-deploy draw + general-heal is the core value. Stats held below ladder curve to prevent campaign rewards from gating competitive play.",
  },
  {
    cardId: "s1_reward_casino_poker",
    file: "new_babylon/s1_reward_casino_poker.ts",
    reason:
      "Reward-tier card from the casino-poker grant. On-deploy opponent-discard is the value. Stats held below ladder curve so reward-pool cards don't dominate ladder.",
  },
  {
    cardId: "s1_reward_eidolon_cipher",
    file: "architect/s1_reward_eidolon_cipher.ts",
    reason:
      "Reward-tier card from the eidolon grant. On-deploy draw is the per-card value. Stats held below ladder curve to keep narrative-unlock cards out of competitive must-include slots.",
  },
  {
    cardId: "s1_reward_eidolon_echo",
    file: "insurgency/s1_reward_eidolon_echo.ts",
    reason:
      "Reward-tier card from the eidolon grant. Heal-on-attack ability gives sustained value across the unit's lifespan. Stats below ladder curve to balance the per-attack heal generation.",
  },
  {
    cardId: "s1_reward_graduate_deploy",
    file: "neutral/s1_reward_graduate_deploy.ts",
    reason:
      "Reward-tier card from the graduate grant. On-deploy permanent +1/+1 to a friendly is the value (= effective 4/5 split across two units). Stats below ladder curve to balance the persistent buff.",
  },

  // ── Cost 5 ──
  {
    cardId: "s1_char_117",
    file: "new_babylon/s1_char_117_senator_voss.ts",
    reason:
      "Sacrifice-then-summon ability: sacrifice a friendly + summon a 5/5 token. Net: trade one body for a 5/5 + the Voss 3/4. Sub-curve printed stats reflect the cost of the sacrifice mechanic; combined effective stats far exceed curve.",
  },
  {
    cardId: "s1_char_122",
    file: "antiquarian/s1_char_122_timeline_splitter.ts",
    reason:
      "Removal/control utility: 3/5 body + on-deploy bounce-enemy-to-hand. The card is a bounce spell stapled to a tanky body. Sub-curve printed line is the cost of the spell-equivalent on-deploy effect.",
  },
  {
    cardId: "s1_pack_pet_glyph_moth_3",
    file: "dreamer/s1_pack_pet_glyph_moth_3.ts",
    reason:
      "Pet engine (anthem): 3/5 flier + on-deploy permanent +1/+0 to all friendly units. Anthem effects across multiple units far exceed per-card stats; sub-curve printed line is the trade for global board buff.",
  },

  // ── Cost 6 ──
  {
    cardId: "s1_dim_prob_03",
    file: "dimensional/probability.ts",
    reason:
      "Legendary ability-driven: flying + dispel + on-deploy draw 3 + 2 mana this turn. The on-deploy alone is ~5 cards of effective value. Sub-curve printed stats compensate for the extreme per-card resource generation.",
  },
  {
    cardId: "s1_pack_id_elara_panoptic",
    file: "neutral/s1_pack_id_elara_panoptic.ts",
    reason:
      "Legendary ability-driven: 3/7 tanky body + on-deploy heal-all + draw. The on-deploy is a heal spell + cantrip stapled together. Sub-curve printed stats reflect the cost of the spell-equivalent value.",
  },

  // ── Cost 7 ──
  {
    cardId: "s1_char_104",
    file: "architect/s1_char_104_white_oracle.ts",
    reason:
      "Legendary ability-driven: on-deploy silence + permanent +4/+4. After deploy the unit is effectively 7/12 plus the silence has stripped an enemy threat. Sub-curve printed line is the floor; the immediate post-deploy state is far above curve.",
  },

  // ── Cost 8 ──
  {
    cardId: "s2_hierarchy_chro_mor_vethic",
    file: "s2_hierarchy/c_suite.ts",
    reason:
      "Legendary tank + draw engine: 4/9 with provoke + draws 1 when any friendly Hierarchy unit dies. Provoke locks adjacent enemies onto the tank; the draw engine generates per-death value. Sub-curve printed stats compensate for the dual-axis value.",
  },
  {
    cardId: "s2_hierarchy_cmo_vex_drelm",
    file: "s2_hierarchy/c_suite.ts",
    reason:
      "Legendary sweeper: 5/7 + dispel + on-deploy global -1 power debuff to all enemies this turn. The on-deploy turns a turn into a tempo-positive board reset. Sub-curve printed stats reflect the cost of the spell-equivalent on-deploy.",
  },
  {
    cardId: "s2_hierarchy_cto_skarn_iterate",
    file: "s2_hierarchy/c_suite.ts",
    reason:
      "Legendary draw engine: 5/8 body + draws 1 at start of every owner's turn. Permanent card-engine; 5+ cards of effective value over the unit's lifespan. Sub-curve printed stats compensate for the unbounded draw advantage.",
  },
];

/**
 * Per-card edit. The block we replace runs from `balanceException: {`
 * through the next `},` — covers `reason: "…"`, `reviewer: "…"`. We
 * preserve indentation by reading the block's leading whitespace.
 */
function applyUpgrade(absPath: string, cardId: string, newReason: string): boolean {
  const src = fs.readFileSync(absPath, "utf-8");
  const idIdx = src.indexOf(`id: "${cardId}"`);
  if (idIdx === -1) return false;
  // Find the balanceException block AFTER the cardId.
  const blockStart = src.indexOf("balanceException:", idIdx);
  if (blockStart === -1) return false;
  // Capture the indent.
  const lineStart = src.lastIndexOf("\n", blockStart) + 1;
  const indent = src.slice(lineStart, blockStart);
  // Find the closing `},` of the block.
  const blockEnd = src.indexOf("},", blockStart);
  if (blockEnd === -1) return false;
  const closeEnd = blockEnd + "},".length;
  // Skip if this card was already re-reviewed (idempotency).
  const existing = src.slice(blockStart, closeEnd);
  if (!existing.includes(REVIEWER_OLD)) return false;
  // Build the new block.
  const escapedReason = newReason.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const newBlock =
    `balanceException: {\n` +
    `${indent}  reason: "${escapedReason}",\n` +
    `${indent}  reviewer: "${REVIEWER_NEW}",\n` +
    `${indent}}`;
  // Note: closeEnd includes the trailing `,`; preserve it.
  const next = src.slice(0, blockStart) + newBlock + src.slice(closeEnd - 1);
  if (APPLY) fs.writeFileSync(absPath, next);
  return true;
}

function main(): void {
  let touched = 0;
  let skipped = 0;
  for (const u of UPGRADES) {
    const abs = path.join(REPO_ROOT, "apps/shared/tcg-core/cards/definitions", u.file);
    if (!fs.existsSync(abs)) {
      console.log(`  ✗ ${u.cardId} → file not found: ${u.file}`);
      continue;
    }
    const wrote = applyUpgrade(abs, u.cardId, u.reason);
    if (wrote) {
      touched++;
      console.log(`  ${APPLY ? "✓" : "·"} ${u.cardId} (${u.file})`);
    } else {
      skipped++;
      console.log(`  - ${u.cardId} → already reviewed or block not found, skip`);
    }
  }
  console.log(
    `\nupgrade-balance-reasons: ${touched} card(s) ${APPLY ? "rewritten" : "would be rewritten"}; ${skipped} already-reviewed/skipped.`,
  );
}

main();
