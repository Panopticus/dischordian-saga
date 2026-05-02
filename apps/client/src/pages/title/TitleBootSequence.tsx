/**
 * TitleBootSequence — calibration-log overlay that flashes on the
 * title screen once per session (Liminal touch §5 from
 * /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md).
 *
 * 4 lines from a 15-line pool, picked deterministically per (epoch
 * day × morality alignment) so two players who compare logs on the
 * same day see the same logs but two days apart see different
 * orders. Wanons can catalogue these.
 *
 * Flashes for ~3.4s total (4 lines × 850ms each), then unmounts.
 * A `sessionStorage` flag prevents re-mount within a session — the
 * sequence runs once per fresh tab.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  alignmentBucketFor,
  calibrationLogsFor,
  epochDayUtc,
} from "@/lib/liminalTouches";
import { useMoralityStore } from "@/stores/moralityStore";

const LINE_INTERVAL_MS = 850;
const SESSION_FLAG = "loredex.bootSequenceSeen";

export function TitleBootSequence() {
  const moralityScore = useMoralityStore((s) => s.score);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [sequenceDone, setSequenceDone] = useState(false);

  // Skip if the boot sequence already ran this session. The flag is
  // session-scoped (not localStorage) so a fresh tab gets a fresh
  // sequence, but the user doesn't see it on every internal nav.
  const [skipFromSession] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_FLAG) === "1";
  });

  const logs = calibrationLogsFor(
    epochDayUtc(),
    alignmentBucketFor(moralityScore),
  );

  useEffect(() => {
    if (skipFromSession) {
      setSequenceDone(true);
      return;
    }
    if (visibleLineCount >= logs.length) {
      const timer = setTimeout(() => {
        setSequenceDone(true);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(SESSION_FLAG, "1");
        }
      }, LINE_INTERVAL_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(
      () => setVisibleLineCount((n) => n + 1),
      LINE_INTERVAL_MS,
    );
    return () => clearTimeout(timer);
  }, [visibleLineCount, logs.length, skipFromSession]);

  if (sequenceDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="boot-sequence"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none fixed top-4 left-4 z-30 max-w-xs"
        aria-hidden="true"
      >
        <div className="space-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          {logs.slice(0, visibleLineCount).map((line, i) => (
            <motion.p
              key={`${line}-${i}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="text-white/20">› </span>
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Test surface — exposed so a test can clear the session flag.
export function _resetBootSequenceForTest(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_FLAG);
}
