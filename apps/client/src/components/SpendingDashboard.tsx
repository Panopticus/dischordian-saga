/* ═══════════════════════════════════════════════════════
   SPENDING DASHBOARD — Transparent Monetization Tracking
   Shows spending history, monthly totals, optional budget
   alerts. Accessible from Store page footer.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Settings,
  X,
  ShoppingBag,
} from "lucide-react";

export interface PurchaseRecord {
  id: string;
  itemName: string;
  price: number;
  date: Date;
  category: "cosmetic" | "card_pack" | "subscription" | "season_pass" | "bundle";
}

interface SpendingDashboardProps {
  purchases: PurchaseRecord[];
  monthlyBudget: number | null;
  onSetBudget: (budget: number | null) => void;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function isSameMonth(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

export default function SpendingDashboard({
  purchases,
  monthlyBudget,
  onSetBudget,
  onClose,
}: SpendingDashboardProps) {
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget?.toString() ?? "");

  const now = new Date();

  const spentThisMonth = useMemo(() => {
    return purchases
      .filter(p => isSameMonth(new Date(p.date), now))
      .reduce((sum, p) => sum + p.price, 0);
  }, [purchases]);

  const spentAllTime = useMemo(() => {
    return purchases.reduce((sum, p) => sum + p.price, 0);
  }, [purchases]);

  const last10 = useMemo(() => {
    return [...purchases]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [purchases]);

  const budgetPercent = monthlyBudget ? (spentThisMonth / monthlyBudget) * 100 : 0;
  const nearBudget = monthlyBudget && budgetPercent >= 80;
  const overBudget = monthlyBudget && budgetPercent >= 100;

  function handleSaveBudget() {
    const val = parseFloat(budgetInput);
    onSetBudget(val > 0 ? val : null);
    setShowBudgetSettings(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/95 border void-border rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b void-border void-bg-sunk">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="void-text-accent" />
            <h2 className="font-display text-lg tracking-[0.2em] void-text-accent">
              SPENDING DASHBOARD
            </h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Budget Warning */}
          {nearBudget && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg border ${
                overBudget
                  ? "void-bg-error void-border-error"
                  : "void-bg-sunk void-border"
              }`}
            >
              <AlertTriangle
                size={16}
                className={`mt-0.5 shrink-0 ${overBudget ? "void-text-error" : "void-text-accent"}`}
              />
              <p
                className={`font-mono text-[11px] leading-relaxed ${
                  overBudget ? "void-text-error" : "void-text-accent"
                }`}
              >
                {overBudget
                  ? `You've exceeded your monthly budget of ${formatCurrency(monthlyBudget!)}.`
                  : `You've spent ${Math.round(budgetPercent)}% of your monthly budget (${formatCurrency(monthlyBudget!)}).`}
              </p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="text-white/30" />
                <span className="font-mono text-[10px] text-white/30 tracking-wider">
                  THIS MONTH
                </span>
              </div>
              <p className="font-mono text-lg void-text-accent font-bold">
                {formatCurrency(spentThisMonth)}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={12} className="text-white/30" />
                <span className="font-mono text-[10px] text-white/30 tracking-wider">
                  ALL TIME
                </span>
              </div>
              <p className="font-mono text-lg text-white/80 font-bold">
                {formatCurrency(spentAllTime)}
              </p>
            </div>
          </div>

          {/* Budget progress bar */}
          {monthlyBudget && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-white/30">MONTHLY BUDGET</span>
                <span className="font-mono text-[10px] text-white/40">
                  {formatCurrency(spentThisMonth)} / {formatCurrency(monthlyBudget)}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    overBudget
                      ? "void-bg-error"
                      : nearBudget
                        ? "void-bg-sunk"
                        : "void-bg-success"
                  }`}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Budget Settings */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/40">
              {monthlyBudget
                ? `Budget: ${formatCurrency(monthlyBudget)}/mo`
                : "No monthly budget set"}
            </span>
            <button
              onClick={() => setShowBudgetSettings(!showBudgetSettings)}
              className="flex items-center gap-1 font-mono text-[10px] void-text-accent void-text-accent transition-colors"
            >
              <Settings size={12} />
              {showBudgetSettings ? "CLOSE" : "SET BUDGET"}
            </button>
          </div>

          {showBudgetSettings && (
            <div className="p-3 rounded-xl border void-border void-bg-sunk space-y-2">
              <p className="font-mono text-[11px] text-white/40">
                Alert me when I've spent this much per month:
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  placeholder="e.g. 20"
                  className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white/80 font-mono text-sm focus:outline-none focus:void-border"
                />
                <button
                  onClick={handleSaveBudget}
                  className="px-4 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-xs font-bold void-bg-sunk transition-colors"
                >
                  SAVE
                </button>
              </div>
              {monthlyBudget && (
                <button
                  onClick={() => { onSetBudget(null); setShowBudgetSettings(false); setBudgetInput(""); }}
                  className="font-mono text-[10px] void-text-error void-text-error transition-colors"
                >
                  Remove budget limit
                </button>
              )}
            </div>
          )}

          {/* Recent purchases */}
          <div>
            <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
              RECENT PURCHASES
            </p>

            {last10.length === 0 ? (
              <div className="p-4 text-center">
                <ShoppingBag size={24} className="text-white/10 mx-auto mb-2" />
                <p className="font-mono text-xs text-white/20">No purchases yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {last10.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div>
                      <p className="font-mono text-xs text-white/70">{p.itemName}</p>
                      <p className="font-mono text-[10px] text-white/25">
                        {new Date(p.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-mono text-xs void-text-accent font-bold">
                      {formatCurrency(p.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
