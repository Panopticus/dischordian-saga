/* ═══════════════════════════════════════════════════════
   LockeConfidentialLedgerPanel

   Renders Adjudicator Locke's Confidential Ledger inside the
   Trade Empire surface. Shows:

     • The player's current Locke band + reputation
     • Available contracts (signable now): pitch + collapsible
       fine print + cost + cross-system payout + SIGN button
     • Locked contracts (visible but greyed): why they're
       locked (band, reputation, prerequisite)
     • Completed contracts (collapsed by default)

   On a successful sign, Locke's transaction-close line surfaces
   in a small inline result banner. The cross-system payout is
   handed back via the hook for the caller to route.

   Voice surface only — apps/shared/lockeConfidentialLedger.ts
   owns the pitches, fine print, and close lines.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, ChevronDown, Check, Lock as LockIcon } from "lucide-react";
import {
  useLockeLedger,
  deriveLockeBand,
  type SignResult,
} from "@/hooks/useLockeLedger";
import type { LedgerEntry, LedgerPayout } from "@shared/lockeConfidentialLedger";

export interface LockeConfidentialLedgerPanelProps {
  /** Numeric reputation reading the panel uses to derive Locke's band.
   *  In the Phase-1 wire-up the caller passes a stand-in (eg empire
   *  influence); the trade-empire subsystem will ship per-broker
   *  reputation later. */
  reputation: number;
  /** Optional callback invoked when a contract signs successfully —
   *  caller routes the cross-system payout to the receiving subsystem.
   *  No-op by default; the panel still surfaces Locke's close line. */
  onPayout?: (payout: LedgerPayout) => void;
}

const PAYOUT_LABEL: Record<LedgerPayout["kind"], string> = {
  crew_xp:               "Crew XP",
  army_recruitment:      "Army Recruitment",
  celebration_bond:      "Celebration Bond",
  mechronis_approval:    "Mechronis Approval",
  trade_reputation:      "Trade Reputation",
};

const REASON_LABEL: Record<string, string> = {
  trust_band_too_low:        "Locke does not yet treat you as a counterparty.",
  insufficient_reputation:   "Reputation insufficient.",
  prerequisite_not_completed: "An earlier contract is required first.",
  already_completed:         "This contract is already on file.",
  unknown_entry:             "Unknown contract.",
};

export function LockeConfidentialLedgerPanel({
  reputation,
  onPayout,
}: LockeConfidentialLedgerPanelProps) {
  const band = deriveLockeBand(reputation);
  const ledger = useLockeLedger({ band, reputation });
  const [expandedFinePrint, setExpandedFinePrint] = React.useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = React.useState(false);

  // Notify parent when a successful sign produces a payout.
  React.useEffect(() => {
    if (ledger.current?.result.success && ledger.current.result.payout && onPayout) {
      onPayout(ledger.current.result.payout);
    }
    // We only want to fire this for new payouts; current is a fresh
    // object identity each push.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledger.current]);

  const toggleFinePrint = (id: string) => {
    setExpandedFinePrint(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedIds = new Set(ledger.completedIds);
  const availableIds = new Set(ledger.available.map(e => e.id));
  const lockedEntries = ledger.catalog.filter(
    e => !availableIds.has(e.id) && !completedIds.has(e.id),
  );
  const completedEntries = ledger.catalog.filter(e => completedIds.has(e.id));

  return (
    <div className="space-y-4">
      {/* Header — Locke metadata */}
      <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 mb-1">
          <FileSignature size={14} className="text-primary" />
          <h3 className="font-display text-sm font-bold tracking-wide">
            CONFIDENTIAL LEDGER
          </h3>
          <span className="ml-auto font-mono text-[10px] opacity-60 tracking-[0.15em]">
            BAND: <span className="text-primary">{band.toUpperCase()}</span>
            <span className="opacity-50 mx-1.5">·</span>
            REP: <span className="text-primary">{reputation}</span>
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-80">
          Adjudicator Locke. Side-contracts payable in currencies other than
          trade. The fine print is mine; you may audit on signing.
        </p>
      </div>

      {/* Result banner — appears after any sign attempt */}
      <AnimatePresence>
        {ledger.current && (
          <motion.div
            key={ledger.current.entry.id + (ledger.current.result.success ? "-ok" : "-no")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-md border p-3 ${
              ledger.current.result.success
                ? "border-primary/40 bg-primary/5"
                : "border-destructive/40 bg-destructive/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-primary">
                {ledger.current.result.success ? "CONTRACT FILED" : "CONTRACT DECLINED"}
              </span>
              <button
                onClick={ledger.dismiss}
                className="ml-auto font-mono text-[10px] opacity-60 hover:opacity-100"
              >
                DISMISS
              </button>
            </div>
            <ResultLine result={ledger.current.result} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available contracts */}
      {ledger.available.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[10px] tracking-[0.2em] opacity-60">
            AVAILABLE
          </div>
          {ledger.available.map(entry => (
            <ContractCard
              key={entry.id}
              entry={entry}
              status="available"
              expandedFinePrint={expandedFinePrint.has(entry.id)}
              onToggleFinePrint={() => toggleFinePrint(entry.id)}
              onSign={() => ledger.sign(entry.id)}
              signing={ledger.signing}
            />
          ))}
        </div>
      )}

      {/* Locked contracts */}
      {lockedEntries.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[10px] tracking-[0.2em] opacity-60">
            LOCKED
          </div>
          {lockedEntries.map(entry => (
            <ContractCard
              key={entry.id}
              entry={entry}
              status="locked"
              expandedFinePrint={false}
              onToggleFinePrint={() => {}}
              onSign={() => {}}
              signing={false}
            />
          ))}
        </div>
      )}

      {/* Completed contracts */}
      {completedEntries.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(s => !s)}
            className="w-full flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] opacity-60 hover:opacity-100"
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${showCompleted ? "rotate-0" : "-rotate-90"}`}
            />
            COMPLETED ({completedEntries.length})
          </button>
          {showCompleted && (
            <div className="space-y-2 mt-2">
              {completedEntries.map(entry => (
                <ContractCard
                  key={entry.id}
                  entry={entry}
                  status="completed"
                  expandedFinePrint={false}
                  onToggleFinePrint={() => {}}
                  onSign={() => {}}
                  signing={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {ledger.catalog.length === 0 && (
        <div className="text-center py-8 opacity-50 font-mono text-[10px]">
          Loading ledger...
        </div>
      )}
    </div>
  );
}

function ContractCard({
  entry,
  status,
  expandedFinePrint,
  onToggleFinePrint,
  onSign,
  signing,
}: {
  entry: LedgerEntry;
  status: "available" | "locked" | "completed";
  expandedFinePrint: boolean;
  onToggleFinePrint: () => void;
  onSign: () => void;
  signing: boolean;
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <div
      className={`rounded-md border p-3 ${
        isCompleted
          ? "border-primary/20 bg-background/30 opacity-70"
          : isLocked
            ? "border-border/40 bg-background/30 opacity-50"
            : "border-primary/30 bg-background/50"
      }`}
    >
      <div className="flex items-start gap-2 mb-1">
        {isCompleted && <Check size={12} className="text-primary mt-0.5" />}
        {isLocked && <LockIcon size={12} className="opacity-50 mt-0.5" />}
        <h4 className="font-display text-sm font-bold tracking-wide flex-1">
          {entry.title}
        </h4>
        <span className="font-mono text-[9px] opacity-60 tracking-[0.15em]">
          TIER {entry.tier}
        </span>
      </div>

      <p className="text-xs leading-relaxed mb-2 opacity-90">{entry.pitch}</p>

      {!isLocked && !isCompleted && (
        <button
          onClick={onToggleFinePrint}
          className="w-full text-left font-mono text-[9px] tracking-[0.2em] opacity-70 hover:opacity-100 mb-2"
        >
          <ChevronDown
            size={10}
            className={`inline mr-1 transition-transform ${expandedFinePrint ? "rotate-0" : "-rotate-90"}`}
          />
          AUDIT FINE PRINT
        </button>
      )}

      {expandedFinePrint && (
        <div className="border-l-2 border-primary/40 pl-3 mb-2">
          <p className="text-xs italic opacity-80 leading-relaxed">{entry.finePrint}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
        <span className="opacity-60">
          COST: <span className="text-primary">{entry.reputationCost} REP</span>
        </span>
        <span className="opacity-60">
          PAYS: <span className="text-primary">{entry.payout.amount} {PAYOUT_LABEL[entry.payout.kind]}</span>
        </span>
      </div>

      {status === "available" && (
        <button
          onClick={onSign}
          disabled={signing}
          className="w-full px-3 py-1.5 rounded-md bg-primary/10 border border-primary/40 text-primary text-[11px] font-mono hover:bg-primary/20 transition-all tracking-wide disabled:opacity-50"
        >
          {signing ? "FILING..." : "SIGN"}
        </button>
      )}
    </div>
  );
}

function ResultLine({ result }: { result: SignResult }) {
  if (result.success && result.closeLine) {
    return <p className="text-xs leading-relaxed">{result.closeLine}</p>;
  }
  if (!result.success && result.reason) {
    return (
      <p className="text-xs leading-relaxed opacity-90">
        {REASON_LABEL[result.reason] ?? result.reason}
      </p>
    );
  }
  return null;
}
