/* ═══════════════════════════════════════════════════════
   THE TABLE — Diplomacy Minigame Component
   Round table, three NPCs, word-spending, theme-aware art.
   Used by Trade Empire Act 3 Diplomacy paths (§7.3 / §8.1).
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Handshake, AlertTriangle, X, Check, Sparkles } from "lucide-react";
import {
  DIPLOMACY_TABLES, createDiplomacyState, spendWord,
  isDemandMet, resolveTable, totalWordsLeft,
  type DiplomacyGameState, type DiplomacyWordKind, type DiplomacyTable as TableDef,
} from "./diplomacyMinigame";

interface Props {
  tableId: string;
  onClose: () => void;
  onResolve: (result: "success" | "failure", state: DiplomacyGameState) => void;
}

const WORD_KIND_META: Record<DiplomacyWordKind, { label: string; icon: typeof MessageCircle; color: string; description: string }> = {
  offer: { label: "OFFER", icon: Handshake, color: "#22c55e", description: "A generous offer. Spends goodwill." },
  concession: { label: "CONCEDE", icon: Check, color: "#60a5fa", description: "Give ground. Costs pride." },
  threat: { label: "THREAT", icon: AlertTriangle, color: "#f97316", description: "Show teeth. Costs reputation." },
  truth: { label: "TRUTH", icon: Sparkles, color: "#e0b3ff", description: "An uncomfortable truth. Costs privacy." },
};

const THEME_STYLES: Record<TableDef["theme"], { bg: string; accent: string; overlay: string }> = {
  crystal_coffins: { bg: "from-rose-950/60 via-black to-purple-950/40", accent: "#e040fb", overlay: "Six coffins pulse in the periphery." },
  burning_ledger: { bg: "from-orange-950/70 via-black to-red-950/50", accent: "#fb923c", overlay: "The ledger burns at the table's center." },
  broken_counter: { bg: "from-amber-950/50 via-black to-zinc-950/60", accent: "#fcd34d", overlay: "A broken kitchen counter. A coffee stain that hasn't moved in thirty years." },
  chessboard: { bg: "from-emerald-950/60 via-black to-black", accent: "#34d399", overlay: "A chessboard the size of a galaxy. Pieces move when you blink." },
  brushed_chrome: { bg: "from-slate-900/70 via-black to-cyan-950/40", accent: "#38bdf8", overlay: "Three identical holograms. One is lying. Watch the eyes." },
};

export default function DiplomacyTable({ tableId, onClose, onResolve }: Props) {
  const table = DIPLOMACY_TABLES[tableId];
  const [state, setState] = useState<DiplomacyGameState>(() => createDiplomacyState(tableId));
  const [selectedNpc, setSelectedNpc] = useState<string>(table.npcs[0].id);
  const [selectedDemand, setSelectedDemand] = useState<string>(table.npcs[0].demands[0].id);

  const theme = THEME_STYLES[table.theme];

  const spend = useCallback((kind: DiplomacyWordKind) => {
    setState(prev => {
      const next = spendWord(prev, selectedNpc, selectedDemand, kind);
      return next ?? prev;
    });
  }, [selectedNpc, selectedDemand]);

  const finalize = useCallback(() => {
    const resolved = resolveTable(state);
    setState(resolved);
    // Defer onResolve so the player can read the transcript first.
  }, [state]);

  const confirmAndClose = useCallback(() => {
    if (state.resolved) {
      onResolve(state.resolved, state);
      onClose();
    }
  }, [state, onClose, onResolve]);

  const wordsLeft = totalWordsLeft(state);
  const allWordsSpent = wordsLeft === 0;

  const activeNpc = useMemo(() => table.npcs.find(n => n.id === selectedNpc)!, [table, selectedNpc]);

  const metDemandsPerNpc = useMemo(() => {
    const out: Record<string, number> = {};
    for (const npc of table.npcs) {
      out[npc.id] = npc.demands.filter(d => isDemandMet(state, npc.id, d)).length;
    }
    return out;
  }, [state, table]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className={`w-full max-w-5xl rounded-2xl border border-white/10 bg-gradient-to-b ${theme.bg} p-6 relative`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display text-xl tracking-[0.2em] text-white">{table.title.toUpperCase()}</h2>
            <p className="font-mono text-[10px] text-white/40 max-w-lg mt-1">{table.subtitle}</p>
            <p className="font-mono text-[9px] italic mt-2" style={{ color: theme.accent }}>{theme.overlay}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Opening line */}
        {!state.resolved && (
          <div className="p-3 rounded-lg bg-black/60 border border-white/10 mb-4">
            <p className="font-mono text-[11px] text-white/70 italic leading-relaxed">{table.opening}</p>
          </div>
        )}

        {/* Resolution view */}
        {state.resolved && (
          <div className="space-y-3 mb-4">
            <div className={`p-4 rounded-lg border ${state.resolved === "success" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <p className={`font-mono text-sm font-bold ${state.resolved === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {state.resolved === "success" ? "TREATY SIGNED" : "THE TABLE BREAKS"}
              </p>
              <p className="font-mono text-[10px] text-white/60 mt-1">
                {state.satisfiedNpcs.length} of {table.npcs.length} satisfied · required: {table.minSatisfied}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-white/10 max-h-60 overflow-y-auto">
              <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">TRANSCRIPT</p>
              {state.transcript.map((line, i) => (
                <p key={i} className="font-mono text-[10px] text-white/60 mb-1.5 leading-relaxed">{line}</p>
              ))}
            </div>
            <button
              onClick={confirmAndClose}
              className="w-full py-3 rounded-lg font-mono text-xs font-bold"
              style={{ backgroundColor: theme.accent + "20", border: `1px solid ${theme.accent}60`, color: theme.accent }}
            >
              CLOSE THE TABLE
            </button>
          </div>
        )}

        {!state.resolved && (
          <>
            {/* Word bank */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {(Object.entries(WORD_KIND_META) as [DiplomacyWordKind, typeof WORD_KIND_META[DiplomacyWordKind]][]).map(([kind, meta]) => {
                const Icon = meta.icon;
                const count = state.wordBank[kind] ?? 0;
                return (
                  <button
                    key={kind}
                    onClick={() => spend(kind)}
                    disabled={count === 0}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      count > 0 ? "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer" : "bg-white/[0.02] border-white/5 opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={10} style={{ color: meta.color }} />
                      <span className="font-mono text-[9px] font-bold" style={{ color: meta.color }}>{meta.label}</span>
                    </div>
                    <p className="font-mono text-lg font-bold text-white mt-1">{count}</p>
                    <p className="font-mono text-[7px] text-white/30 leading-tight mt-0.5">{meta.description}</p>
                  </button>
                );
              })}
            </div>

            {/* NPCs at the table */}
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              {table.npcs.map(npc => {
                const met = metDemandsPerNpc[npc.id];
                const totalDemands = npc.demands.length;
                const threshold = totalDemands <= 2 ? totalDemands : 2;
                const satisfied = met >= threshold;
                const selected = selectedNpc === npc.id;
                return (
                  <button
                    key={npc.id}
                    onClick={() => {
                      setSelectedNpc(npc.id);
                      setSelectedDemand(npc.demands[0].id);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selected ? "border-white/30 bg-white/10" : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-mono text-[11px] font-bold text-white">{npc.name}</p>
                      {satisfied && <Check size={12} className="text-emerald-400" />}
                    </div>
                    <p className="font-mono text-[8px] text-white/40 mb-2">{npc.title}</p>
                    <p className="font-mono text-[8px] text-white/30 italic leading-tight mb-2">{npc.portrait}</p>
                    <div className="flex gap-1">
                      {npc.demands.map(d => {
                        const dMet = isDemandMet(state, npc.id, d);
                        return (
                          <div
                            key={d.id}
                            className={`flex-1 h-1 rounded-full ${dMet ? "bg-emerald-400" : "bg-white/10"}`}
                          />
                        );
                      })}
                    </div>
                    <p className="font-mono text-[8px] text-white/40 mt-1.5">{met}/{threshold} demands met</p>
                  </button>
                );
              })}
            </div>

            {/* Demand detail — selected NPC */}
            <div className="p-3 rounded-lg bg-black/60 border border-white/10 mb-4">
              <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">DEMANDS FROM {activeNpc.name.toUpperCase()}</p>
              <div className="space-y-2">
                {activeNpc.demands.map(d => {
                  const met = isDemandMet(state, activeNpc.id, d);
                  const selected = selectedDemand === d.id;
                  const spent = state.spent[`${activeNpc.id}:${d.id}`] ?? {};
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDemand(d.id)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-colors ${
                        met ? "border-emerald-500/40 bg-emerald-500/5" :
                        selected ? "border-white/30 bg-white/5" :
                        "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-mono text-[10px] text-white flex-1">{d.text}</p>
                        {met && <Check size={10} className="text-emerald-400 shrink-0 mt-0.5" />}
                      </div>
                      <div className="flex gap-1.5 mt-1.5">
                        {(Object.entries(d.need) as [DiplomacyWordKind, number][]).map(([kind, need]) => {
                          const have = spent[kind] ?? 0;
                          return (
                            <span
                              key={kind}
                              className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: WORD_KIND_META[kind].color + "15",
                                color: have >= need ? WORD_KIND_META[kind].color : WORD_KIND_META[kind].color + "80",
                              }}
                            >
                              {have}/{need} {WORD_KIND_META[kind].label}
                            </span>
                          );
                        })}
                      </div>
                      {met && <p className="font-mono text-[8px] text-emerald-400/80 italic mt-1">{d.metLine}</p>}
                    </button>
                  );
                })}
              </div>
              <p className="font-mono text-[8px] text-white/30 mt-3">Tip: click a demand then click a word above to spend.</p>
            </div>

            {/* Finalize */}
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-[10px] text-white/40">
                {wordsLeft} words left · {Object.values(metDemandsPerNpc).reduce((a, b) => a + b, 0)} total demands met
              </div>
              <button
                onClick={finalize}
                disabled={!allWordsSpent && Object.keys(state.spent).length === 0}
                className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                  allWordsSpent || Object.keys(state.spent).length > 0
                    ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
                    : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {allWordsSpent ? "FINALIZE (all words spent)" : "FINALIZE TABLE"}
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
