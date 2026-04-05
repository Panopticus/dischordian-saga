/* ═══════════════════════════════════════════════════════
   "X WILL REMEMBER THIS" — Telltale-style notification

   Listens for "npc-remember" custom events and displays
   a cinematic notification that fades in and out.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FACTION_NPCS, type FactionNPCId } from "@/game/factionNPCs";

interface RememberData {
  npcId: FactionNPCId;
  npcName: string;
  text: string;
  isPositive: boolean;
}

export default function RememberThisToast() {
  const [current, setCurrent] = useState<RememberData | null>(null);
  const queueRef = useRef<RememberData[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showNext = useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) { setCurrent(null); return; }
    setCurrent(next);
    timerRef.current = setTimeout(() => {
      setCurrent(null);
      setTimeout(showNext, 500);
    }, 3500);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as RememberData;
      queueRef.current.push(detail);
      if (!current) showNext();
    };
    window.addEventListener("npc-remember", handler);
    return () => {
      window.removeEventListener("npc-remember", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, showNext]);

  const npc = current ? FACTION_NPCS[current.npcId] : null;
  const color = npc?.color || "#33e2e6";

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[95] pointer-events-none"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-lg"
            style={{
              background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, ${color}08 100%)`,
              border: `1px solid ${color}20`,
              boxShadow: `0 0 30px ${color}10`,
            }}>
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
            <div>
              <p className="font-mono text-sm tracking-wider" style={{ color }}>
                {current.text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
