/* ═══════════════════════════════════════════════════════
   CROSS-ACT OPPONENT TAUNT ADAPTER

   The Act 1 / Act 3 / Act 4 / Act 6 / Act 7 per-opponent
   dialog files each define their own local `buildActNOppon-
   entTauntHooks` function. All four produce functionally
   identical three-phase hook shapes (early / mid / late);
   this module is the polymorphic entry point that UI
   consumers call without caring which act a dialog belongs
   to.

     OpponentTauntHooks — the canonical shape
     getTauntHooksForOpponent(opponentId) — resolve + build

   Consumers:
     - ActNOpponentTauntOverlay (client component)
     - any future per-match render surface that needs the
       early / mid / late texts without the act-specific
       import dance
   ═══════════════════════════════════════════════════════ */

import { getAct1Opponent } from "./act1Opponents";
import {
  ACT_1_OPPONENT_DIALOGS,
  buildOpponentTauntHooks as buildAct1Hooks,
  type Act1OpponentDialog,
  type Act1OpponentTauntHooks,
} from "./act1OpponentDialog";
import {
  ACT_3_OPPONENT_DIALOGS,
  buildAct3OpponentTauntHooks,
  type Act3OpponentDialog,
} from "./act3OpponentDialog";
import {
  ACT_4_OPPONENT_DIALOGS,
  buildAct4OpponentTauntHooks,
  type Act4OpponentDialog,
} from "./act4OpponentDialog";
import {
  ACT_6_OPPONENT_DIALOGS,
  buildAct6OpponentTauntHooks,
  type Act6OpponentDialog,
} from "./act6OpponentDialog";
import {
  ACT_7_OPPONENT_DIALOGS,
  buildAct7OpponentTauntHooks,
  type Act7OpponentDialog,
} from "./act7OpponentDialog";

/** Canonical three-phase taunt hook shape shared by every act. */
export interface OpponentTauntHooks {
  opponentId: string;
  sourceAct: 1 | 3 | 4 | 6 | 7;
  early: { id: string; turn: number; text: string };
  mid: { id: string; hpBelowPercent: number; text: string };
  late: { id: string; hpBelowPercent: number; text: string };
}

type AnyActDialog =
  | Act1OpponentDialog
  | Act3OpponentDialog
  | Act4OpponentDialog
  | Act6OpponentDialog
  | Act7OpponentDialog;

function fromAct1(hooks: Act1OpponentTauntHooks, opponentId: string): OpponentTauntHooks {
  return { opponentId, sourceAct: 1, early: hooks.early, mid: hooks.mid, late: hooks.late };
}

/**
 * Resolve an opponent's taunt hooks by id, dispatching to the correct
 * per-act dialog registry. Returns null if the id does not match any
 * registered opponent.
 */
export function getTauntHooksForOpponent(
  opponentId: string,
): OpponentTauntHooks | null {
  // Resolve through canonical Act 1 aliases so legacy ids like
  // "little_meme" still find their dialog table.
  const act1Canonical = getAct1Opponent(opponentId)?.id ?? opponentId;
  const act1 = ACT_1_OPPONENT_DIALOGS.find((d) => d.opponentId === act1Canonical);
  if (act1) return fromAct1(buildAct1Hooks(act1), act1Canonical);

  const act3 = ACT_3_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
  if (act3) {
    const hooks = buildAct3OpponentTauntHooks(act3);
    return { opponentId, sourceAct: 3, early: hooks.early, mid: hooks.mid, late: hooks.late };
  }

  const act4 = ACT_4_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
  if (act4) {
    const hooks = buildAct4OpponentTauntHooks(act4);
    return { opponentId, sourceAct: 4, early: hooks.early, mid: hooks.mid, late: hooks.late };
  }

  const act6 = ACT_6_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
  if (act6) {
    const hooks = buildAct6OpponentTauntHooks(act6);
    return { opponentId, sourceAct: 6, early: hooks.early, mid: hooks.mid, late: hooks.late };
  }

  const act7 = ACT_7_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
  if (act7) {
    const hooks = buildAct7OpponentTauntHooks(act7);
    return { opponentId, sourceAct: 7, early: hooks.early, mid: hooks.mid, late: hooks.late };
  }

  return null;
}

/**
 * Direct builder for callers that already hold a dialog object and
 * know which act it came from. Useful when the caller is inside a
 * per-act module and wants the canonical shape without a registry
 * lookup.
 */
export function buildAnyActTauntHooks(
  dialog: AnyActDialog,
  sourceAct: OpponentTauntHooks["sourceAct"],
): OpponentTauntHooks {
  switch (sourceAct) {
    case 1: {
      const h = buildAct1Hooks(dialog as Act1OpponentDialog);
      return { opponentId: dialog.opponentId, sourceAct: 1, early: h.early, mid: h.mid, late: h.late };
    }
    case 3: {
      const h = buildAct3OpponentTauntHooks(dialog as Act3OpponentDialog);
      return { opponentId: dialog.opponentId, sourceAct: 3, early: h.early, mid: h.mid, late: h.late };
    }
    case 4: {
      const h = buildAct4OpponentTauntHooks(dialog as Act4OpponentDialog);
      return { opponentId: dialog.opponentId, sourceAct: 4, early: h.early, mid: h.mid, late: h.late };
    }
    case 6: {
      const h = buildAct6OpponentTauntHooks(dialog as Act6OpponentDialog);
      return { opponentId: dialog.opponentId, sourceAct: 6, early: h.early, mid: h.mid, late: h.late };
    }
    case 7: {
      const h = buildAct7OpponentTauntHooks(dialog as Act7OpponentDialog);
      return { opponentId: dialog.opponentId, sourceAct: 7, early: h.early, mid: h.mid, late: h.late };
    }
  }
}
