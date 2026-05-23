/* ═══════════════════════════════════════════════════════
   ENGINE-EVENT VFX DISPATCHER

   The tcg-core reducer emits a flat GameEvent[] timeline on every
   dispatch (apps/shared/tcg-core/types/Event.ts). BoardRenderer.update
   already auto-fires summon / hit / death / damage-number / heal-number
   from prev→next board diffs, and DuelystGameUI inline-fires its
   screen-level card-event glows when the LOCAL PLAYER acts.

   This module fills two gaps:
     1. Per-tile board particles for events the diff alone can't see:
        heals (sparkles + ring), buffs / debuffs, keyword grant/remove
        pulses, teleports, pushes, resurrections, artifact equip /
        destroy on the carrier tile.
     2. Screen-level card-event glows for OPPONENT (AI) actions, which
        had no inline VFX wiring at all — every AI summon, attack,
        artifact equip, bloodborn cast etc. previously fired only a
        SoundManager bleep.

   Pure with respect to its inputs: every observable effect is on the
   `deps` surface, so it's testable by mocking deps. The exhaustive
   switch over GameEvent.type means TypeScript will surface any new
   event variant that needs a decision.
   ═══════════════════════════════════════════════════════ */

import type { GameEvent } from "@shared/tcg-core/types/Event";
import type { CardVfxId } from "@shared/aaaArtArchive";
import type { DuelystGameState } from "./types";
import { findUnit } from "./engine";
import type { SoundType } from "./SoundManager";

export interface EngineEventVfxRenderer {
  playHealEffect(row: number, col: number): void;
  playBuffEffect(row: number, col: number): void;
  playDebuffEffect(row: number, col: number): void;
  playKeywordPulse(row: number, col: number, color: number): void;
  playTeleportEffect(row: number, col: number): void;
  playPushEffect(row: number, col: number): void;
  playResurrectEffect(row: number, col: number): void;
}

export interface EngineEventVfxDeps {
  /** Post-dispatch view state — used to look up the (row,col) of an
   *  entityId. For events whose target was destroyed in the same
   *  dispatch (e.g. damage_dealt that killed), the lookup will miss
   *  and the per-tile effect is skipped silently. */
  state: DuelystGameState;
  triggerCardVfx: (id: CardVfxId, durationMs?: number) => void;
  playSfx: (sound: SoundType) => void;
  renderer: EngineEventVfxRenderer | null;
  /** "player" suppresses screen-level overlays the inline UI already
   *  fires from click handlers; "opponent" fires the full set so the
   *  AI's turn is visually as expressive as the player's. */
  actor: "player" | "opponent";
}

/** Visual signature per keyword for the grant/remove pulse. Unknown
 *  keywords fall back to a neutral white pulse so the player still
 *  gets feedback. Mirrors the BoardRenderer's existing indicator
 *  palette (provoke = amber outline, ranged = cyan dot). */
const KEYWORD_COLORS: Record<string, number> = {
  provoke: 0xffaa00,
  taunt: 0xffaa00,
  rush: 0x44ff88,
  celerity: 0x88ffaa,
  ranged: 0x44aaff,
  flying: 0x88ddff,
  blast: 0xff8844,
  frenzy: 0xff4488,
  forcefield: 0xddddff,
  drain: 0xaa44ff,
  zeal: 0xffff88,
  airdrop: 0x88ccff,
};

function tileOf(
  state: DuelystGameState,
  entityId: string,
): { row: number; col: number } | null {
  const unit = findUnit(state, entityId);
  if (!unit) return null;
  return { row: unit.row, col: unit.col };
}

export function dispatchEngineEventVfx(
  events: readonly GameEvent[],
  deps: EngineEventVfxDeps,
): void {
  const { state, triggerCardVfx, playSfx, renderer, actor } = deps;
  const isOpponent = actor === "opponent";

  for (const ev of events) {
    switch (ev.type) {
      /* ─── Per-tile board VFX (fired for both actors) ─── */

      case "healed": {
        if (ev.amount <= 0) break;
        const at = tileOf(state, ev.targetId);
        if (at && renderer) renderer.playHealEffect(at.row, at.col);
        playSfx("spell_cast");
        if (isOpponent) triggerCardVfx("card_buff_glow", 500);
        break;
      }
      case "buff_applied": {
        if (ev.powerDelta === 0 && ev.healthDelta === 0) break;
        const positive = ev.powerDelta >= 0 && ev.healthDelta >= 0;
        const at = tileOf(state, ev.targetId);
        if (at && renderer) {
          if (positive) renderer.playBuffEffect(at.row, at.col);
          else renderer.playDebuffEffect(at.row, at.col);
        }
        if (isOpponent) {
          triggerCardVfx(positive ? "card_buff_glow" : "card_debuff_curse", 500);
        }
        break;
      }
      case "keyword_granted": {
        const at = tileOf(state, ev.targetId);
        if (at && renderer) {
          const color = KEYWORD_COLORS[ev.keyword] ?? 0xffffff;
          renderer.playKeywordPulse(at.row, at.col, color);
        }
        break;
      }
      case "keyword_removed": {
        const at = tileOf(state, ev.targetId);
        if (at && renderer) renderer.playKeywordPulse(at.row, at.col, 0x666666);
        break;
      }
      case "teleported": {
        if (renderer) renderer.playTeleportEffect(ev.toRow, ev.toCol);
        playSfx("spell_cast");
        break;
      }
      case "pushed": {
        if (renderer) renderer.playPushEffect(ev.toRow, ev.toCol);
        playSfx("attack_hit");
        break;
      }
      case "resurrected": {
        if (renderer) renderer.playResurrectEffect(ev.atRow, ev.atCol);
        triggerCardVfx("card_legendary_reveal", 700);
        playSfx("unit_summon");
        break;
      }

      /* ─── Artifact lifecycle (carrier-tile VFX + SFX) ─── */

      case "artifact_equipped": {
        const at = tileOf(state, ev.entityId);
        if (at && renderer) renderer.playBuffEffect(at.row, at.col);
        if (isOpponent) triggerCardVfx("card_buff_glow", 600);
        playSfx("card_play");
        break;
      }
      case "artifact_destroyed": {
        const at = tileOf(state, ev.entityId);
        if (at && renderer) renderer.playDebuffEffect(at.row, at.col);
        if (isOpponent) triggerCardVfx("card_destroy_shatter", 500);
        playSfx("unit_death");
        break;
      }

      /* ─── SFX-only (visuals owned by BoardRenderer state-diff) ─── */

      case "damage_dealt": {
        // BoardRenderer.update() auto-fires playHitEffect + damage
        // number from the HP-decrease diff; just add the SFX (and an
        // extra punch when a general takes the hit).
        if (ev.absorbed) break;
        const target = findUnit(state, ev.targetId);
        playSfx(target?.isGeneral ? "general_damage" : "attack_hit");
        break;
      }
      case "unit_destroyed": {
        playSfx("unit_death");
        break;
      }
      case "token_summoned": {
        playSfx("unit_summon");
        break;
      }
      case "card_drawn": {
        // Opponent draws are hidden by fog of war — only sound the
        // player's own draws.
        if (ev.player === 0) {
          playSfx("card_draw");
          if (isOpponent) triggerCardVfx("card_draw_glow", 400);
        }
        break;
      }

      /* ─── Match / turn / mode-banner cues ─── */

      case "bloodborn_cast": {
        if (isOpponent) triggerCardVfx("card_void_drain", 600);
        playSfx("spell_cast");
        break;
      }
      case "trial_verdict_resolved": {
        // Always fire — this is a match-defining moment regardless of
        // who triggered the dispatch.
        triggerCardVfx(
          ev.outcome === "overturn" ? "card_legendary_reveal" : "card_destroy_shatter",
          900,
        );
        playSfx(ev.outcome === "overturn" ? "victory" : "defeat");
        break;
      }
      case "warlord_lockout_started":
      case "warlord_lockout_ended": {
        triggerCardVfx("card_combo_chain", 600);
        playSfx("spell_cast");
        break;
      }
      case "match_ended": {
        playSfx(ev.winner === 0 ? "victory" : ev.winner === 1 ? "defeat" : "turn_end");
        break;
      }
      case "turn_started": {
        if (ev.player === 0) playSfx("turn_start");
        else playSfx("turn_end");
        break;
      }

      /* ─── Noiseless / handled elsewhere ─── */

      case "match_started":
      case "mulligan_drawn":
      case "mulligan_finished":
      case "turn_ended":
      case "mana_gained":
      case "card_burned":
      case "card_discarded":
      case "card_replaced":
      case "card_played":
      case "unit_deployed":
      case "unit_moved":
      case "unit_transformed":
      case "buff_expired":
      case "counter_added":
      case "trigger_fired":
      case "architect_reality_edit_witnessed":
      case "warlord_lockout_ticked":
      case "warlord_lockout_re_evaluated":
      case "scripted_action_fired":
      case "scripted_action_skipped":
      case "trial_phase_started":
      case "trial_phase_violation":
      case "trial_balance_changed":
        break;
    }
  }
}
