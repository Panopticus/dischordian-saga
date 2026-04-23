/* ═══════════════════════════════════════════════════════
   "X WILL REMEMBER THIS" — Telltale-style notification

   Listens for "npc-remember" custom events and displays
   a cinematic notification that fades in and out.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from "react";
import { FACTION_NPCS, type FactionNPCId } from "@/game/factionNPCs";
import { ToastSlot } from "@/components/toast";

interface RememberData {
  npcId: FactionNPCId;
  npcName: string;
  text: string;
  isPositive: boolean;
}

export default function RememberThisToast() {
  const [current, setCurrent] = useState<RememberData | null>(null);
  const queueRef = useRef<RememberData[]>([]);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Queue-drain loop. When ToastSlot's durationMs fires, it calls
  // onDismiss which clears current; we then wait 500ms before promoting
  // the next queued memory so successive "X will remember this" beats
  // have breathing room instead of stacking.
  const promoteNext = useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) { setCurrent(null); return; }
    setCurrent(next);
  }, []);

  const dismiss = useCallback(() => {
    setCurrent(null);
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    gapTimerRef.current = setTimeout(promoteNext, 500);
  }, [promoteNext]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as RememberData;
      queueRef.current.push(detail);
      if (!current) promoteNext();
    };
    window.addEventListener("npc-remember", handler);
    return () => {
      window.removeEventListener("npc-remember", handler);
      if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    };
  }, [current, promoteNext]);

  const npc = current ? FACTION_NPCS[current.npcId] : null;
  const color = npc?.color || "#33e2e6";

  return (
    <ToastSlot
      visible={!!current}
      onDismiss={dismiss}
      position="top-center"
      tone="custom"
      toneColor={color}
      durationMs={3500}
      maxWidth={420}
      contentKey={current ? `${current.npcId}-${current.text}` : undefined}
      showCloseButton={false}
    >
      {current && (
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-8 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <p
            className="font-mono text-sm tracking-wider"
            style={{ color }}
          >
            {current.text}
          </p>
        </div>
      )}
    </ToastSlot>
  );
}
