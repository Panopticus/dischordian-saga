/**
 * Hierarchy Spell-Mechanic VFX (3 VFX assets).
 *
 * Visual effects for the three signature S2_HIERARCHY mechanic
 * keywords: Performance Review (cost-reduction), Quarterly
 * Earnings (deathwatch buffs), and Stock Buyback (resurrect-and-
 * deny). These VFX play in-match when their mechanic triggers,
 * separate from the pack-open flip-cycle.
 *
 * Output spec locked to prelude pipeline.
 *
 * Visual language: Hierarchy palette throughout — plum, charcoal,
 * crimson-and-rust, cool-cyan, occasional warm-amber. The
 * mechanics share a corporate-bureaucratic visual idiom (paper
 * stamps, contracts, ledger-pages, signatures-in-motion) over a
 * supernatural underlay. The VFX should feel like 'an office
 * function operating on the battlefield' rather than traditional
 * sword-and-sorcery spell visuals.
 */
import type { VfxPrompt } from "../types";
import { VFX_OUTPUT_LOCKED } from "../types";

export const HIERARCHY_MECHANIC_VFX: Readonly<Record<string, VfxPrompt>> = Object.freeze({
  "vfx_hierarchy_performance_review": {
    id: "vfx_hierarchy_performance_review",
    trigger: "Hierarchy 'Performance Review' keyword triggers (cost-reduction effect on a friendly Hierarchy unit)",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 1.2,
    startFramePrompt:
      "Above the target Hierarchy unit, a translucent Hierarchy review-form (a single sheet of cream paper with REVIEW header in plum typeset and several ruled lines below) materializes at chest-height in front of the unit. The form is held suspended by no visible hand. The unit's outline begins to pulse with a faint plum-and-cream rim-light.",
    endFramePrompt:
      "The review-form has descended onto the unit and dissolved into them. A bright cream-colored numeric '−1' (the cost-reduction value) floats upward from the unit's mana-cost slot, fading as it rises. The unit's rim-light has subsided to a faint sustained plum glow (signaling the buff is active).",
    motionPrompt:
      "0-0.3s: review-form materializes from translucent fade-in. 0.3-0.6s: form descends smoothly onto the unit's chest, dissolving into them. 0.6-0.9s: '−1' numeric floats upward from the mana-cost slot, scaling slightly larger then fading. 0.9-1.2s: unit's rim-light settles to sustained plum-glow.",
    sfxCue: "hierarchy_perf_review.mp3 (subtle paper-rustle + soft plum-tonal chord landing at form-dissolve + faint quill-stroke for the '-1' reveal; total 1.2s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (re-tuned for plum-cream paper-fragment particles during dissolve)",
      "BattleVFX.floatingText (for the '−1' numeric)",
      "RewardCelebration.tierGlow (for sustained rim-light)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy expansion (Manager-tier 'Performance Review' synergy)",
      "(intra-set) §s2_hierarchy_mgr_perf_review_wraith — performance-review canonical visual signature",
      "(intra-set) §s2_hierarchy_chro_mor_vethic — Hierarchy HR canon (review framing)",
    ],
  },

  "vfx_hierarchy_quarterly_earnings": {
    id: "vfx_hierarchy_quarterly_earnings",
    trigger: "Hierarchy 'Quarterly Earnings' keyword triggers (deathwatch — buffs friendly Hierarchy units when an enemy dies)",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 1.5,
    startFramePrompt:
      "An enemy unit has just died at frame-centre — its silhouette dispersing into faint dark mist. From the dispersing silhouette, a translucent Hierarchy ledger-page rises upward and outward, followed by a small bright-cream RECEIPT-style scroll that begins to scroll out from the ledger. The ledger-page is the canonical ledger from Xeth'Raal's CFO mythic art.",
    endFramePrompt:
      "The receipt-scroll has fully unscrolled across the upper third of frame (a thin horizontal banner reading +1/+1 to all friendly Hierarchy units in cool-cyan ink). All friendly Hierarchy units visible on the battlefield have a pulse of warm-amber up-arrow VFX above their stat blocks. The dead enemy's silhouette has fully dispersed.",
    motionPrompt:
      "0-0.3s: enemy silhouette continues dispersing; ledger-page rises from the dispersion. 0.3-0.7s: receipt-scroll unscrolls from the ledger horizontally across upper-frame, with text appearing character-by-character. 0.7-1.2s: warm-amber up-arrow particles burst upward above each friendly Hierarchy unit's stat-block (each unit shows simultaneously). 1.2-1.5s: receipt-scroll and ledger fade; up-arrow particles dissipate; sustained warm-amber stat-block glow remains as the buff-indicator.",
    sfxCue: "hierarchy_quarterly_earnings.mp3 (subtle paper-unfurl + receipt-printer-tape sound + warm cash-register-style chime at scroll-completion + chorus of small chimes at +1/+1 application; total 1.5s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (dispersing-silhouette + warm-amber up-arrow particles — multi-target)",
      "BattleVFX.floatingText (for the receipt-scroll text reveal)",
      "RewardCelebration.tierGlow (sustained warm-amber stat-block glow for buff indicator)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy expansion (Analyst-tier 'Quarterly Earnings' synergy)",
      "(intra-set) §s2_hierarchy_cfo_xeth_raal — Ledger of Ruin canonical framing",
    ],
  },

  "vfx_hierarchy_stock_buyback": {
    id: "vfx_hierarchy_stock_buyback",
    trigger: "Hierarchy 'Stock Buyback' keyword triggers (resurrect-and-deny — returns a friendly Hierarchy unit from the discard pile and removes it from opponent's clone/copy effects)",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 2.0,
    startFramePrompt:
      "From the friendly discard-pile area (lower-right of frame), a Hierarchy contract-folio rises into the air, then opens mid-air to reveal the dead unit's portrait stamped with a deep-red REPURCHASED stamp across its face. Behind the rising folio, the previously-dead unit's translucent silhouette begins to re-form on its starting battlefield position.",
    endFramePrompt:
      "The contract-folio has dissolved into Hierarchy plum-and-cream paper-fragments that drift upward and outward. The previously-dead unit is fully re-formed on the battlefield, solid, with a bright sustained plum aura. Anywhere on the opponent's side of the field where a clone/copy of this unit existed, that copy is now visibly DESTROYED — small Hierarchy crest stamps strike each copy and dissolve them in a flash.",
    motionPrompt:
      "0-0.5s: contract-folio rises from discard pile, opens mid-air to reveal REPURCHASED-stamped portrait. 0.5-1.0s: folio dissolves into paper-fragments drifting upward; unit silhouette re-forms on battlefield (gradient transparent to solid). 1.0-1.5s: any opponent clone/copy of this unit is struck by a Hierarchy crest stamp (one per clone, sequenced) and dissolves in a brief flash. 1.5-2.0s: paper-fragments dissipate; unit's plum aura settles to sustained level (signaling resurrection-protected state).",
    sfxCue: "hierarchy_stock_buyback.mp3 (paper-unfurl + REPURCHASED stamp impact + sub-bass landing-thud for unit re-emergence + per-clone-destruction sequenced stamp-impacts; total 2.0s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (paper-fragment dispersal)",
      "BattleVFX.ScreenFlash (per-clone-destruction flashes, 80ms each, sequenced)",
      "RewardCelebration.tierGlow (sustained plum-aura on resurrected unit)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy expansion (Director-tier 'Stock Buyback' synergy)",
      "(intra-set) §s2_hierarchy_dir_bottom_line_decimator — Hierarchy financial-action canonical framing",
      "(intra-set) §s2_hierarchy_cfo_xeth_raal — Ledger-of-Ruin contract framing",
    ],
  },
});
