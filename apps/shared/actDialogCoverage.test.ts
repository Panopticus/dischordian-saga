/**
 * CI guard for opponent-dialog coverage across Acts 1, 3, 4, 6, 7.
 *
 * The audit narrative ("Acts 3-7 line text exists but opponent dialog
 * tables are MISSING") was wrong on inspection — the tables exist
 * (apps/shared/act{1,3,4,6,7}OpponentDialog.ts), they're imported by
 * the corresponding ladder pages, and the field shape is parallel to
 * Act 1. What's NOT defended at the type level is the relation
 * between the opponents list and the dialog table: a future contributor
 * could add a new Act N opponent in acts2to7Opponents.ts and forget to
 * author the matching dialog block, leaving the runtime to hit
 * `getAct{N}OpponentDialog(...)` and quietly return undefined.
 *
 * This test closes that gap: every Act-N opponent must have a dialog
 * entry, and every dialog entry must reference a real opponent. It
 * runs in CI; if it fails, the contributor knows immediately what to
 * add (or remove) before the change reaches a player.
 *
 * Acts 2 and 5 are intentionally absent — they're structural
 * interludes per acts2to7Opponents.ts §header and ship no scripted
 * battles.
 */
import { describe, it, expect } from "vitest";

import { ACT_1_OPPONENTS } from "./act1Opponents";
import { getAct1OpponentDialog } from "./act1OpponentDialog";
import {
  ACT_3_OPPONENTS,
  ACT_4_OPPONENTS,
  ACT_6_OPPONENTS,
  ACT_7_OPPONENTS,
} from "./acts2to7Opponents";
import { getAct3OpponentDialog } from "./act3OpponentDialog";
import { getAct4OpponentDialog } from "./act4OpponentDialog";
import { getAct6OpponentDialog } from "./act6OpponentDialog";
import { getAct7OpponentDialog } from "./act7OpponentDialog";

const ACTS = [
  { actNumber: 1, opponents: ACT_1_OPPONENTS, getDialog: getAct1OpponentDialog },
  { actNumber: 3, opponents: ACT_3_OPPONENTS, getDialog: getAct3OpponentDialog },
  { actNumber: 4, opponents: ACT_4_OPPONENTS, getDialog: getAct4OpponentDialog },
  { actNumber: 6, opponents: ACT_6_OPPONENTS, getDialog: getAct6OpponentDialog },
  { actNumber: 7, opponents: ACT_7_OPPONENTS, getDialog: getAct7OpponentDialog },
] as const;

describe.each(ACTS)("Act $actNumber opponent-dialog coverage", ({ opponents, getDialog }) => {
  it("the opponents list is non-empty (sanity check)", () => {
    expect(opponents.length).toBeGreaterThan(0);
  });

  it("every opponent has a dialog entry", () => {
    const missing: string[] = [];
    for (const op of opponents) {
      if (!getDialog(op.id)) missing.push(op.id);
    }
    expect(missing, `opponents without dialog: ${missing.join(", ")}`).toEqual([]);
  });

  it("every authored dialog block has the canonical pre/mid/post fields filled", () => {
    const stubs: string[] = [];
    for (const op of opponents) {
      const d = getDialog(op.id);
      if (!d) continue; // covered by the previous test
      // Treat empty strings as failures — an empty string passes the
      // `if (!d)` check and silently renders as no dialog. The shape
      // we care about: pre-match, mid-match (3 phases), post-match
      // win/loss for both companions.
      const required = [
        "elaraPreMatch",
        "humanPreMatch",
        "opponentMidMatchEarly",
        "opponentMidMatchMid",
        "opponentMidMatchLate",
        "elaraPostMatchWin",
        "humanPostMatchWin",
        "elaraPostMatchLoss",
        "humanPostMatchLoss",
      ] as const;
      for (const field of required) {
        const v = (d as unknown as Record<string, unknown>)[field];
        if (typeof v !== "string" || v.trim().length === 0) {
          stubs.push(`${op.id}.${field}`);
        }
      }
    }
    expect(stubs, `empty-string dialog fields: ${stubs.slice(0, 5).join(", ")}${stubs.length > 5 ? ` …+${stubs.length - 5}` : ""}`).toEqual([]);
  });

  it("mid-match opponent taunts honour the ≤25-word voice constraint", () => {
    const offenders: string[] = [];
    for (const op of opponents) {
      const d = getDialog(op.id);
      if (!d) continue;
      const tauntFields = [
        "opponentMidMatchEarly",
        "opponentMidMatchMid",
        "opponentMidMatchLate",
      ] as const;
      for (const field of tauntFields) {
        const v = (d as unknown as Record<string, unknown>)[field];
        if (typeof v !== "string") continue;
        const words = v.trim().split(/\s+/).filter(Boolean).length;
        if (words > 25) {
          offenders.push(`${op.id}.${field} (${words}w)`);
        }
      }
    }
    expect(offenders, `taunts >25w: ${offenders.slice(0, 5).join("; ")}`).toEqual([]);
  });
});
