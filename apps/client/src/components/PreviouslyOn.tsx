/* ═══════════════════════════════════════════════════════
   PREVIOUSLY ON — Cinematic recap of last session
   Shows when player returns after 1+ hour absence.
   Elara narrates discoveries, battles, and progress.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Map, Swords, Puzzle, Package, Clock } from "lucide-react";

const SESSION_KEY = "loredex-session-data";
const LAST_VISIT_KEY = "loredex-last-visit";
const RECAP_SHOWN_KEY = "loredex-recap-shown";
const ABSENCE_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

export interface SessionData {
  roomsExplored: string[];
  puzzlesSolved: string[];
  itemsFound: string[];
  battlesWon: number;
  achievementsEarned: string[];
  timestamp: number;
}

export function getSessionData(): SessionData {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { roomsExplored: [], puzzlesSolved: [], itemsFound: [], battlesWon: 0, achievementsEarned: [], timestamp: Date.now() };
}

export function updateSessionData(updates: Partial<SessionData>) {
  const current = getSessionData();
  const merged = { ...current, ...updates, timestamp: Date.now() };
  if (updates.roomsExplored) merged.roomsExplored = Array.from(new Set([...current.roomsExplored, ...updates.roomsExplored]));
  if (updates.puzzlesSolved) merged.puzzlesSolved = Array.from(new Set([...current.puzzlesSolved, ...updates.puzzlesSolved]));
  if (updates.itemsFound) merged.itemsFound = Array.from(new Set([...current.itemsFound, ...updates.itemsFound]));
  if (updates.achievementsEarned) merged.achievementsEarned = Array.from(new Set([...current.achievementsEarned, ...updates.achievementsEarned]));
  if (updates.battlesWon) merged.battlesWon = current.battlesWon + updates.battlesWon;
  localStorage.setItem(SESSION_KEY, JSON.stringify(merged));
}

export function clearSessionData() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    roomsExplored: [], puzzlesSolved: [], itemsFound: [], battlesWon: 0, achievementsEarned: [], timestamp: Date.now(),
  }));
}

export function markVisit() {
  localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
}

export function shouldShowRecap(): boolean {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const recapShown = localStorage.getItem(RECAP_SHOWN_KEY);
  if (!lastVisit) return false;
  const elapsed = Date.now() - parseInt(lastVisit, 10);
  if (elapsed < ABSENCE_THRESHOLD_MS) return false;
  if (recapShown && Date.now() - parseInt(recapShown, 10) < ABSENCE_THRESHOLD_MS) return false;
  const session = getSessionData();
  return session.roomsExplored.length > 0 || session.battlesWon > 0 || session.itemsFound.length > 0;
}

export function markRecapShown() {
  localStorage.setItem(RECAP_SHOWN_KEY, Date.now().toString());
}

function generateNarrative(session: SessionData): string[] {
  const lines: string[] = [];
  lines.push("Operative... you've been away. Let me bring you up to speed.");

  if (session.roomsExplored.length > 0) {
    const roomNames = session.roomsExplored.map(r => r.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()));
    if (roomNames.length === 1) {
      lines.push(`You explored the ${roomNames[0]}. Its secrets are slowly revealing themselves.`);
    } else {
      lines.push(`You explored ${roomNames.length} areas: ${roomNames.slice(0, -1).join(", ")} and ${roomNames[roomNames.length - 1]}.`);
    }
  }

  if (session.battlesWon > 0) {
    lines.push(`You won ${session.battlesWon} battle${session.battlesWon > 1 ? "s" : ""} in the combat arena. Your tactical skills are improving.`);
  }

  if (session.itemsFound.length > 0) {
    lines.push(`You recovered ${session.itemsFound.length} artifact${session.itemsFound.length > 1 ? "s" : ""} from the Ark's corridors.`);
  }

  if (session.puzzlesSolved.length > 0) {
    lines.push(`You cracked ${session.puzzlesSolved.length} puzzle${session.puzzlesSolved.length > 1 ? "s" : ""}. The Architect's designs are no match for you.`);
  }

  if (session.achievementsEarned.length > 0) {
    lines.push(`You earned ${session.achievementsEarned.length} new achievement${session.achievementsEarned.length > 1 ? "s" : ""}. The crew is taking notice.`);
  }

  lines.push("The Ark still holds many secrets. Shall we continue?");
  return lines;
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
      className="rounded-lg p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <Icon size={16} className={`mx-auto mb-1.5 ${color}`} />
      <p className="font-display text-lg font-bold text-white">{value}</p>
      <p className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">{label}</p>
    </motion.div>
  );
}

export default function PreviouslyOn({ onDismiss }: { onDismiss: () => void }) {
  const session = useMemo(() => getSessionData(), []);
  const narrative = useMemo(() => generateNarrative(session), [session]);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (currentLine >= narrative.length) { setShowStats(true); return; }
    const line = narrative[currentLine];
    let charIdx = 0;
    setDisplayedText("");
    setIsTyping(true);
    const interval = setInterval(() => {
      if (charIdx < line.length) { setDisplayedText(line.slice(0, charIdx + 1)); charIdx++; }
      else { clearInterval(interval); setIsTyping(false); }
    }, 35);
    return () => clearInterval(interval);
  }, [currentLine, narrative]);

  const advance = useCallback(() => {
    if (isTyping) { setDisplayedText(narrative[currentLine]); setIsTyping(false); }
    else if (currentLine < narrative.length - 1) { setCurrentLine(prev => prev + 1); }
    else { setShowStats(true); }
  }, [isTyping, currentLine, narrative]);

  const handleDismiss = useCallback(() => {
    markRecapShown(); clearSessionData(); markVisit(); onDismiss();
  }, [onDismiss]);

  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const hoursAgo = lastVisit ? Math.floor((Date.now() - parseInt(lastVisit, 10)) / (1000 * 60 * 60)) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at center, rgba(10,5,30,0.97) 0%, rgba(0,0,0,0.99) 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-[var(--neon-cyan)]"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.15 }}
            animate={{ y: [0, -30, 0], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />
        ))}
      </div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="relative w-full max-w-lg">
        <button onClick={handleDismiss}
          className="absolute -top-8 right-0 font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors flex items-center gap-1">
          SKIP <X size={10} />
        </button>
        <div className="text-center mb-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}>
            <p className="font-mono text-[10px] text-[var(--neon-cyan)]/40 tracking-[0.5em] mb-2">PREVIOUSLY ON</p>
            <h1 className="font-display text-2xl sm:text-3xl tracking-[0.2em] text-white">THE DISCHORDIAN SAGA</h1>
            {hoursAgo > 0 && (
              <p className="font-mono text-[10px] text-muted-foreground/35 mt-2 flex items-center justify-center gap-1">
                <Clock size={8} /> {hoursAgo}h since last transmission
              </p>
            )}
          </motion.div>
        </div>
        <div className="rounded-lg p-5 mb-4 cursor-pointer" onClick={advance}
          style={{ background: "rgba(10,10,40,0.8)", border: "1px solid rgba(51,226,230,0.1)" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="font-display text-xs text-[var(--neon-cyan)]">E</span>
            </div>
            <div className="flex-1">
              <p className="font-display text-[10px] text-[var(--neon-cyan)]/60 tracking-wider mb-1.5">ELARA // SHIP AI</p>
              <p className="font-mono text-sm text-muted-foreground/90 leading-relaxed min-h-[2.5em]">
                {displayedText}
                {isTyping && <span className="inline-block w-1.5 h-4 bg-[var(--neon-cyan)] ml-0.5 animate-pulse" />}
              </p>
            </div>
          </div>
          {!isTyping && currentLine < narrative.length - 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-mono text-[9px] text-muted-foreground/35 text-right mt-2 flex items-center justify-end gap-1">
              TAP TO CONTINUE <ChevronRight size={8} />
            </motion.p>
          )}
        </div>
        <AnimatePresence>
          {showStats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {session.roomsExplored.length > 0 && <StatCard icon={Map} label="ROOMS" value={session.roomsExplored.length} color="text-[var(--neon-cyan)]" />}
                {session.battlesWon > 0 && <StatCard icon={Swords} label="BATTLES" value={session.battlesWon} color="text-red-400" />}
                {session.itemsFound.length > 0 && <StatCard icon={Package} label="ITEMS" value={session.itemsFound.length} color="text-amber-400" />}
                {session.puzzlesSolved.length > 0 && <StatCard icon={Puzzle} label="PUZZLES" value={session.puzzlesSolved.length} color="text-purple-400" />}
              </div>
              <button onClick={handleDismiss}
                className="w-full py-3 rounded-lg font-mono text-xs tracking-[0.2em] transition-all hover:scale-[1.02]"
                style={{ background: "rgba(51,226,230,0.08)", border: "1px solid rgba(51,226,230,0.2)", color: "var(--neon-cyan)" }}>
                CONTINUE MISSION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
