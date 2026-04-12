/* ═══════════════════════════════════════════════════════
   INFILTRATION RUNNER — §7.3 Eyes Path minigame host

   A single modal that renders any of the 9 infiltration stage
   types defined in infiltrationContent.ts. Each stage type has
   a small bespoke sub-renderer; they all share the same chrome
   (header, intro, result panel, close button) and post a
   uniform `InfiltrationStageResult` back to the caller.

   Loredex rewrites are committed here via loredexRewrite.ts —
   that's the single side effect the runner performs directly.
   Everything else (narrative flags, event logging, stage
   advancement) is returned to TradeEmpirePage via onResolve.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Scale, MessageSquare, Feather, Flame, Radio,
  ArrowLeft, Check, X, Clock3, BookOpen, AlertTriangle,
} from "lucide-react";
import {
  getInfiltrationStage,
  type InfiltrationStage,
  type InfiltrationStageResult,
  type InfiltrationStageType,
  type ChoiceStage,
  type JudgmentStage,
  type DialogueStage,
  type RewriteStage,
  type RitualStage,
  type DecryptStage,
  type DarkFlipStage,
  type SilenceStage,
  type TimeSkipStage,
  type ChoiceOption,
} from "./infiltrationContent";
import { applyLoredexOverride } from "./loredexRewrite";

interface Props {
  stageId: string;
  /** Called when the stage resolves (success or explicit fail/close) */
  onResolve: (result: InfiltrationStageResult) => void;
  onClose: () => void;
}

/* ─── per-type icon ─── */
const TYPE_ICON: Record<InfiltrationStageType, typeof Eye> = {
  choice: Eye,
  judgment: Scale,
  dialogue: MessageSquare,
  rewrite: Feather,
  ritual: Flame,
  decrypt: Radio,
  dark_flip: AlertTriangle,
  silence: Clock3,
  time_skip: Clock3,
};

/** Shared chrome (header + intro + body slot) for every sub-renderer */
function StageFrame({
  stage,
  children,
  onClose,
}: {
  stage: InfiltrationStage;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const Icon = TYPE_ICON[stage.type] ?? Eye;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[75] bg-black/95 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={14} className="text-purple-400" />
          <p className="font-mono text-[9px] tracking-[0.3em] text-purple-400/70">
            INFILTRATION · {stage.type.replace("_", " ").toUpperCase()}
          </p>
        </div>
        <h2 className="font-display text-lg text-white mb-3 tracking-wider">{stage.title}</h2>
        <p className="font-mono text-[11px] text-white/60 italic leading-relaxed mb-5 whitespace-pre-line">
          {stage.intro}
        </p>

        <div>{children}</div>

        <button
          onClick={onClose}
          className="mt-5 px-3 py-1 rounded bg-white/5 text-white/30 font-mono text-[9px] hover:text-white/60 flex items-center gap-1"
        >
          <ArrowLeft size={10} /> LEAVE (do not resolve)
        </button>
      </div>
    </motion.div>
  );
}

/* ─── CHOICE / JUDGMENT shared option button ─── */
function OptionButton({
  option,
  onPick,
  variant = "default",
}: {
  option: ChoiceOption;
  onPick: (option: ChoiceOption) => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={() => onPick(option)}
      className={`w-full text-left p-3 rounded-lg border transition-all mb-2 ${
        variant === "danger"
          ? "bg-red-500/5 border-red-500/30 hover:bg-red-500/10"
          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
      }`}
    >
      <p className="font-mono text-[11px] text-white font-bold">{option.label}</p>
      {option.fails && (
        <p className="font-mono text-[9px] text-red-400/80 mt-1">
          <AlertTriangle size={8} className="inline mr-1" />
          This choice closes the path permanently.
        </p>
      )}
    </button>
  );
}

/* ─── "choice" — single-prompt multi-option fork ─── */
function ChoiceRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: ChoiceStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState<ChoiceOption | null>(null);

  const pick = (opt: ChoiceOption) => setPicked(opt);

  const commit = () => {
    if (!picked) return;
    const flags = [...(stage.flagsOnComplete ?? []), ...(picked.flags ?? [])];
    onResolve({
      success: !picked.fails,
      flagsToSet: flags,
      logLabel: `${stage.title}: ${picked.label}`,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      {!picked && (
        <>
          <p className="font-mono text-[11px] text-white/80 mb-3">{stage.prompt}</p>
          {stage.options.map(o => (
            <OptionButton key={o.id} option={o} onPick={pick} variant={o.fails ? "danger" : "default"} />
          ))}
        </>
      )}
      {picked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
        >
          <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-2">OUTCOME</p>
          <p className="font-mono text-[11px] text-white/70 italic leading-relaxed mb-4">{picked.outcome}</p>
          <button
            onClick={commit}
            className="w-full py-2.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
          >
            {picked.fails ? "ACCEPT THE COST & CLOSE PATH" : "CONTINUE"}
          </button>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "judgment" — rule on cases, each a mini ChoiceOption list ─── */
function JudgmentRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: JudgmentStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [verdicts, setVerdicts] = useState<ChoiceOption[]>([]);
  const current = stage.cases[idx];
  const done = idx >= stage.cases.length;

  const pickVerdict = (v: ChoiceOption) => {
    setVerdicts(prev => [...prev, v]);
    setIdx(i => i + 1);
  };

  const commit = () => {
    const flags = [
      ...(stage.flagsOnComplete ?? []),
      ...verdicts.flatMap(v => v.flags ?? []),
    ];
    const anyFail = verdicts.some(v => v.fails);
    onResolve({
      success: !anyFail,
      flagsToSet: flags,
      logLabel: `${stage.title} — ${verdicts.length} ruling${verdicts.length === 1 ? "" : "s"}`,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      {!done && current && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] text-white/30">
              CASE {idx + 1} / {stage.cases.length}
            </span>
          </div>
          <p className="font-mono text-[11px] text-amber-400 font-bold mb-2">{current.caseTitle}</p>
          <p className="font-mono text-[10px] text-white/70 italic mb-4 leading-relaxed">{current.prompt}</p>
          {current.verdicts.map(v => (
            <OptionButton key={v.id} option={v} onPick={pickVerdict} />
          ))}
        </div>
      )}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
        >
          <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-2">RULINGS ENTERED</p>
          <ol className="space-y-2 mb-4">
            {verdicts.map((v, i) => (
              <li key={i} className="font-mono text-[10px] text-white/70">
                <p className="text-white/90">{stage.cases[i].caseTitle}</p>
                <p className="text-white/50 italic pl-2">→ {v.label}</p>
              </li>
            ))}
          </ol>
          {stage.finalLine && (
            <p className="font-mono text-[10px] text-white/60 italic mb-4 border-l-2 border-purple-500/30 pl-3">
              {stage.finalLine}
            </p>
          )}
          <button
            onClick={commit}
            className="w-full py-2.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
          >
            ENTER INTO THE RECORD
          </button>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "dialogue" — sequential NPC exchanges with picked responses ─── */
function DialogueRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: DialogueStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<typeof stage.exchanges[number]["responses"][number][]>([]);
  const [showingReply, setShowingReply] = useState<string | null>(null);

  const current = stage.exchanges[idx];
  const done = idx >= stage.exchanges.length;

  const pick = (r: typeof stage.exchanges[number]["responses"][number]) => {
    setPicks(prev => [...prev, r]);
    setShowingReply(r.npcReply ?? null);
  };

  const advanceExchange = () => {
    setShowingReply(null);
    setIdx(i => i + 1);
  };

  const commit = () => {
    const flags = [...(stage.flagsOnComplete ?? []), ...picks.flatMap(p => p.flags ?? [])];
    onResolve({
      success: true,
      flagsToSet: flags,
      logLabel: `${stage.title} — ${stage.speaker}`,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      {!done && current && !showingReply && (
        <div>
          <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-1">
            {stage.speaker.toUpperCase()}
          </p>
          <p className="font-mono text-[11px] text-white/80 italic leading-relaxed mb-4 whitespace-pre-line">
            &ldquo;{current.npcLine}&rdquo;
          </p>
          <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">YOUR RESPONSE</p>
          {current.responses.map(r => (
            <OptionButton key={r.id} option={r} onPick={pick} />
          ))}
        </div>
      )}
      {!done && showingReply && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
        >
          <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-2">
            {stage.speaker.toUpperCase()} · REPLIES
          </p>
          <p className="font-mono text-[11px] text-white/80 italic leading-relaxed mb-4 whitespace-pre-line">
            &ldquo;{showingReply}&rdquo;
          </p>
          <button
            onClick={advanceExchange}
            className="w-full py-2.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
          >
            CONTINUE
          </button>
        </motion.div>
      )}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
        >
          <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-2">CONVERSATION CLOSED</p>
          <button
            onClick={commit}
            className="w-full py-2.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
          >
            WALK AWAY
          </button>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "rewrite" — loredex entry edit ─── */
function RewriteRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: RewriteStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [pickedId, setPickedId] = useState<string | null>(null);

  const picked = pickedId ? stage.templates.find(t => t.id === pickedId) : null;

  const commit = () => {
    if (!picked) return;
    // If this is the binding stage, actually write the override.
    let override: InfiltrationStageResult["loredexOverride"];
    if (stage.binding) {
      applyLoredexOverride({
        entityId: stage.entityId,
        field: "bio",
        originalFragment: picked.find,
        rewrittenFragment: picked.replace,
        authoredByStage: stage.stageId,
      });
      override = {
        entityId: stage.entityId,
        field: "bio",
        originalFragment: picked.find,
        rewrittenFragment: picked.replace,
        authoredByStage: stage.stageId,
      };
    }
    onResolve({
      success: true,
      flagsToSet: stage.flagsOnComplete ?? [],
      loredexOverride: override,
      logLabel: stage.binding
        ? `Permanent Loredex rewrite: ${stage.entityName}`
        : `Practice rewrite: ${stage.entityName}`,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={12} className="text-amber-400" />
          <p className="font-mono text-[9px] text-amber-400/70 tracking-wider">LOREDEX · {stage.entityName.toUpperCase()}</p>
        </div>
        <p className="font-mono text-[10px] text-white/50 italic leading-relaxed">{stage.entityPreview}</p>
      </div>

      {!picked && (
        <>
          <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">CHOOSE A REWRITE</p>
          {stage.templates.map(t => (
            <button
              key={t.id}
              onClick={() => setPickedId(t.id)}
              className="w-full text-left p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] mb-2"
            >
              <p className="font-mono text-[11px] text-white font-bold mb-1">{t.label}</p>
              <p className="font-mono text-[10px] text-white/50 italic">{t.claim}</p>
            </button>
          ))}
        </>
      )}

      {picked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
        >
          <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-2">REWRITE PREVIEW</p>
          <div className="mb-3">
            <p className="font-mono text-[9px] text-red-400/70 tracking-wider mb-1">WAS</p>
            <p className="font-mono text-[10px] text-white/60 italic border-l-2 border-red-500/30 pl-2">{picked.find}</p>
          </div>
          <div className="mb-4">
            <p className="font-mono text-[9px] text-emerald-400/70 tracking-wider mb-1">BECOMES</p>
            <p className="font-mono text-[10px] text-white/80 italic border-l-2 border-emerald-500/30 pl-2">{picked.replace}</p>
          </div>
          {stage.binding && (
            <p className="font-mono text-[9px] text-red-400/70 mb-3">
              <AlertTriangle size={8} className="inline mr-1" />
              This rewrite is BINDING. The change is permanent on your device.
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setPickedId(null)}
              className="flex-1 py-2 rounded border border-white/10 text-white/60 font-mono text-[10px]"
            >
              RECONSIDER
            </button>
            <button
              onClick={commit}
              className="flex-1 py-2 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
            >
              {stage.binding ? "COMMIT PERMANENTLY" : "LOCK IN"}
            </button>
          </div>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "ritual" — multi-beat click-through ─── */
function RitualRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: RitualStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const done = idx >= stage.beats.length;
  const current = stage.beats[idx];

  const commit = () => {
    onResolve({
      success: true,
      flagsToSet: stage.flagsOnComplete ?? [],
      logLabel: stage.title,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      {!done && current && (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
        >
          {current.label && (
            <p className="font-mono text-[9px] text-purple-400/70 tracking-wider mb-2">{current.label}</p>
          )}
          <p className="font-mono text-[11px] text-white/70 italic leading-relaxed whitespace-pre-line mb-4">
            {current.text}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8px] text-white/20">
              BEAT {idx + 1} / {stage.beats.length}
            </p>
            <button
              onClick={() => setIdx(i => i + 1)}
              className="px-4 py-2 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
            >
              {current.buttonLabel}
            </button>
          </div>
        </motion.div>
      )}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
        >
          <p className="font-mono text-[11px] text-white/70 italic mb-4">{stage.closingLine}</p>
          <button
            onClick={commit}
            className="w-full py-2.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
          >
            WALK OUT
          </button>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "decrypt" — signal pattern-match ─── */
function DecryptRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: DecryptStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [slotIdx, setSlotIdx] = useState(0);
  const [wrongPicks, setWrongPicks] = useState(0);
  const [failed, setFailed] = useState(false);

  // Shuffle options once per slot (stable across rerenders of the same slot).
  const slotOptions = useMemo(() => {
    return stage.slots.map(s => {
      const all = [s.correct, ...s.decoys];
      // Deterministic shuffle using slot index to keep useMemo stable
      return all.sort((a, b) => a.localeCompare(b));
    });
  }, [stage.slots]);

  const done = slotIdx >= stage.slots.length;

  const pick = (slot: number, value: string) => {
    if (failed || done) return;
    const expected = stage.slots[slot].correct;
    if (value === expected) {
      setSlotIdx(i => i + 1);
    } else {
      const next = wrongPicks + 1;
      setWrongPicks(next);
      if (next > stage.maxWrongPicks) setFailed(true);
    }
  };

  const commit = (success: boolean) => {
    onResolve({
      success,
      flagsToSet: success ? stage.flagsOnComplete ?? [] : [],
      logLabel: success ? `${stage.title} — decrypted` : `${stage.title} — failed`,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      <p className="font-mono text-[10px] text-amber-400/70 italic mb-3">{stage.hint}</p>
      {!done && !failed && (
        <div>
          <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">
            SLOT {slotIdx + 1} / {stage.slots.length} · WRONG {wrongPicks} / {stage.maxWrongPicks}
          </p>
          <div className="space-y-2">
            {slotOptions[slotIdx].map(opt => (
              <button
                key={opt}
                onClick={() => pick(slotIdx, opt)}
                className="w-full p-2.5 rounded border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] font-mono text-[11px] text-white text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Check size={14} className="text-emerald-400" />
            <p className="font-mono text-[10px] text-emerald-300 font-bold">SIGNAL DECRYPTED</p>
          </div>
          <button
            onClick={() => commit(true)}
            className="w-full mt-3 py-2.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold hover:bg-emerald-500/30"
          >
            CONTINUE
          </button>
        </motion.div>
      )}
      {failed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/5 border border-red-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <X size={14} className="text-red-400" />
            <p className="font-mono text-[10px] text-red-300 font-bold">SIGNAL LOST</p>
          </div>
          <p className="font-mono text-[10px] text-white/60 italic">
            Too many wrong picks. The handshake's gone quiet. You can retry this stage another time.
          </p>
          <button
            onClick={() => commit(false)}
            className="w-full mt-3 py-2.5 rounded border border-white/10 text-white/50 font-mono text-[10px]"
          >
            LEAVE
          </button>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "dark_flip" — show cards flipping to dark counterparts ─── */
function DarkFlipRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: DarkFlipStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const done = idx >= stage.pairs.length;
  const current = stage.pairs[idx];

  const commit = () => {
    onResolve({
      success: true,
      flagsToSet: stage.flagsOnComplete ?? [],
      logLabel: `${stage.title} — ${stage.pairs.length} cards flipped`,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      {!done && current && (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-red-900/20 border border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 text-center">
              <p className="font-mono text-[9px] text-emerald-400/70 tracking-wider mb-1">LIGHT</p>
              <p className="font-mono text-sm text-emerald-300">{current.light}</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            >
              <Flame size={18} className="text-red-400/80" />
            </motion.div>
            <div className="flex-1 text-center">
              <p className="font-mono text-[9px] text-red-400/70 tracking-wider mb-1">DARK</p>
              <p className="font-mono text-sm text-red-300">{current.dark}</p>
            </div>
          </div>
          <p className="font-mono text-[10px] text-white/60 italic mb-4">{current.note}</p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8px] text-white/20">
              {idx + 1} / {stage.pairs.length}
            </p>
            <button
              onClick={() => setIdx(i => i + 1)}
              className="px-4 py-2 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold hover:bg-red-500/30"
            >
              WATCH IT FLIP
            </button>
          </div>
        </motion.div>
      )}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-900/20 border border-red-500/30"
        >
          <p className="font-mono text-[11px] text-white/70 italic mb-4">{stage.closingLine}</p>
          <button
            onClick={commit}
            className="w-full py-2.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold hover:bg-red-500/30"
          >
            LET THE SESSION END
          </button>
        </motion.div>
      )}
    </StageFrame>
  );
}

/* ─── "silence" — fragments with long pauses, no input until final ─── */
function SilenceRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: SilenceStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const done = idx >= stage.fragments.length;

  useEffect(() => {
    if (done) return;
    const f = stage.fragments[idx];
    const t = setTimeout(() => setIdx(i => i + 1), f.pauseMs);
    return () => clearTimeout(t);
  }, [idx, done, stage.fragments]);

  const commit = () => {
    onResolve({
      success: true,
      flagsToSet: stage.flagsOnComplete ?? [],
      logLabel: stage.title,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      <div className="min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs text-white/70 italic text-center leading-relaxed px-4"
            >
              {stage.fragments[idx].text}
            </motion.p>
          ) : (
            <motion.button
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={commit}
              className="px-6 py-3 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold hover:bg-purple-500/30"
            >
              {stage.finalButton}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </StageFrame>
  );
}

/* ─── "time_skip" — same engine as silence with different styling ─── */
function TimeSkipRenderer({
  stage,
  onResolve,
  onClose,
}: {
  stage: TimeSkipStage;
  onResolve: (r: InfiltrationStageResult) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const done = idx >= stage.fragments.length;

  useEffect(() => {
    if (done) return;
    const f = stage.fragments[idx];
    const t = setTimeout(() => setIdx(i => i + 1), f.pauseMs);
    return () => clearTimeout(t);
  }, [idx, done, stage.fragments]);

  const commit = () => {
    onResolve({
      success: true,
      flagsToSet: stage.flagsOnComplete ?? [],
      logLabel: stage.title,
    });
  };

  return (
    <StageFrame stage={stage} onClose={onClose}>
      <div className="min-h-[180px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8 }}
              className="text-center px-4"
            >
              <Clock3 size={18} className="text-amber-400/60 mx-auto mb-3" />
              <p className="font-mono text-xs text-amber-100/80 italic leading-relaxed">
                {stage.fragments[idx].text}
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={commit}
              className="px-6 py-3 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold hover:bg-amber-500/30"
            >
              {stage.finalButton}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </StageFrame>
  );
}

/* ─── top-level runner ─── */
export default function InfiltrationRunner({ stageId, onResolve, onClose }: Props) {
  const stage = getInfiltrationStage(stageId);

  // No bespoke content authored for this stage id — caller should fall back
  // to the generic "MARK STAGE COMPLETE" flow.
  if (!stage) return null;

  switch (stage.type) {
    case "choice":
      return <ChoiceRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "judgment":
      return <JudgmentRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "dialogue":
      return <DialogueRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "rewrite":
      return <RewriteRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "ritual":
      return <RitualRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "decrypt":
      return <DecryptRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "dark_flip":
      return <DarkFlipRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "silence":
      return <SilenceRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    case "time_skip":
      return <TimeSkipRenderer stage={stage} onResolve={onResolve} onClose={onClose} />;
    default:
      return null;
  }
}
