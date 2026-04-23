/* ═══════════════════════════════════════════════════════
   FEATURE UNLOCK TOAST — Shows Elara's intro when systems unlock

   Listens for narrative flags and system state changes.
   When a feature becomes available, shows the appropriate
   Elara message in a toast.

   Prevents "50 systems at once" overwhelm by announcing
   new features one at a time, with narrative context.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { FEATURE_ROADMAP, isFeatureUnlocked, FEATURE_CATEGORIES, type FeatureUnlock } from "@shared/featureRoadmap";
import { getSessionDuration } from "@/lib/analytics";
import { useElaraVO } from "@/hooks/useElaraVO";
import { ToastSlot } from "@/components/toast";

const STORAGE_KEY = "feature_unlocks_seen";

export default function FeatureUnlockToast() {
  const { state } = useGame();
  const { speak } = useElaraVO();
  const [queue, setQueue] = useState<FeatureUnlock[]>([]);
  const [current, setCurrent] = useState<FeatureUnlock | null>(null);
  const seenRef = useRef<Set<string>>(new Set());

  // Load seen features from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { seenRef.current = new Set(JSON.parse(saved)); }
      catch { /* ignore */ }
    }
  }, []);

  // Check for newly unlocked features whenever game state changes.
  // F4 — during the prelude we queue unlocks silently; they drain as
  // soon as prelude_complete flips. This prevents the cold-boot
  // "everything unlocks at once" popup swarm.
  useEffect(() => {
    const snapshot = {
      rooms: state.rooms,
      narrativeFlags: state.narrativeFlags || {},
      elaraTrust: state.elaraTrust || 0,
      humanTrust: state.humanTrust || 0,
      npcTrust: state.npcTrust || {},
      level: Math.max(1, Math.floor((state.conexusXp || 0) / 100) + 1),
      questsCompleted: (state.claimedQuestRewards || []).length,
      playtimeHours: getSessionDuration() / 3_600_000,
    };

    const newlyUnlocked = FEATURE_ROADMAP.filter(f =>
      isFeatureUnlocked(f, snapshot) && !seenRef.current.has(f.featureId)
    );

    if (newlyUnlocked.length > 0) {
      setQueue(prev => [...prev, ...newlyUnlocked]);
      newlyUnlocked.forEach(f => seenRef.current.add(f.featureId));
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seenRef.current]));
    }
  }, [state.rooms, state.narrativeFlags, state.elaraTrust, state.humanTrust, state.npcTrust, state.claimedQuestRewards, state.conexusXp]);

  // F4 — drain gate. Until prelude_complete we keep the queue stocked but
  // never promote to `current`. The moment the flag flips, the existing
  // `current/queue` effect drains in priority order.
  const preludeComplete = Boolean(state.narrativeFlags?.prelude_complete);

  // Show next in queue + play Elara VO
  useEffect(() => {
    if (!preludeComplete) return; // F4 — hold queue during opening
    if (!current && queue.length > 0) {
      const next = queue[0];
      setCurrent(next);
      setQueue(prev => prev.slice(1));
      // Play Elara's voice for this feature unlock
      speak(`feature_${next.featureId}`);
    }
  }, [current, queue, speak, preludeComplete]);

  // Auto-dismiss handled by ToastSlot via durationMs.

  const category = current ? FEATURE_CATEGORIES[current.category] : null;

  return (
    <ToastSlot
      visible={!!current}
      onDismiss={() => setCurrent(null)}
      position="top-center"
      tone="custom"
      toneColor={category?.color}
      durationMs={8000}
      maxWidth={460}
      contentKey={current?.featureId}
    >
      {current && category && (
        <div className="flex items-start gap-3 pr-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${category.color}20`, border: `1px solid ${category.color}40` }}
          >
            <Sparkles size={18} style={{ color: category.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-[9px] tracking-[0.3em]"
                style={{ color: category.color }}
              >
                {category.icon} SYSTEM UNLOCKED
              </span>
            </div>
            <p className="font-display text-sm font-bold text-white mb-1">
              {current.name}
            </p>
            <p className="font-mono text-[10px] text-white/60 leading-relaxed mb-2">
              {current.description}
            </p>
            <p
              className="font-mono text-[10px] text-white/80 italic leading-relaxed border-l-2 pl-2"
              style={{ borderColor: category.color }}
            >
              {current.unlockMessage}
            </p>
          </div>
        </div>
      )}
    </ToastSlot>
  );
}
