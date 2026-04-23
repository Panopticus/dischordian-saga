/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT TOAST — Pop-up notification when earned
   Suppressed while dialogs (NarrativeEngine, LoreOverlay,
   ElaraDialog) are active. Queued items show after dialog closes.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useRef } from "react";
import { Trophy } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { isDialogActive } from "@/lib/dialogState";
import { ToastSlot } from "@/components/toast";

const TIER_COLORS: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "var(--energy-premium)",
  platinum: "#e5e4e2",
  legendary: "#ff6b35",
};

export default function AchievementToast() {
  const { newAchievement, dismissNewAchievement } = useGamification();
  const [dialogSuppressed, setDialogSuppressed] = useState(() => isDialogActive());
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef(false);

  // Listen for dialog state changes
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.active) {
        setDialogSuppressed(true);
        // If currently showing, hide it and mark as pending
        if (visible) {
          setVisible(false);
          pendingRef.current = true;
        }
      } else {
        setDialogSuppressed(false);
      }
    };
    window.addEventListener("dialog-state-change", handler);
    return () => window.removeEventListener("dialog-state-change", handler);
  }, [visible]);

  // When a new achievement arrives, show it if no dialog is active
  useEffect(() => {
    if (newAchievement) {
      if (isDialogActive()) {
        // Queue it — mark pending, don't show yet
        pendingRef.current = true;
      } else {
        setVisible(true);
        pendingRef.current = false;
      }
    } else {
      setVisible(false);
      pendingRef.current = false;
    }
  }, [newAchievement]);

  // When dialog closes and we have a pending achievement, show it
  useEffect(() => {
    if (!dialogSuppressed && pendingRef.current && newAchievement) {
      pendingRef.current = false;
      setVisible(true);
    }
  }, [dialogSuppressed, newAchievement]);

  // Auto-dismiss is now owned by ToastSlot — we just pass durationMs
  // and it schedules/clears the timer for us. Keeping the state flag
  // local so the dialog-suppression logic above still works.

  const tierColor = newAchievement ? TIER_COLORS[newAchievement.tier] : undefined;

  return (
    <ToastSlot
      visible={visible && !!newAchievement}
      onDismiss={dismissNewAchievement}
      position="top-center"
      tone="custom"
      toneColor={tierColor}
      durationMs={5000}
      maxWidth={460}
      contentKey={newAchievement?.achievementId}
      showCloseButton={false}
    >
      {newAchievement && (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ background: `${tierColor}20` }}
          >
            {newAchievement.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Trophy size={12} style={{ color: tierColor }} />
              <span
                className="font-mono text-[10px] tracking-[0.2em]"
                style={{ color: tierColor }}
              >
                ACHIEVEMENT UNLOCKED
              </span>
            </div>
            <div className="font-display text-sm font-bold text-foreground">
              {newAchievement.name}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground/70">
              {newAchievement.description}
            </div>
          </div>
          <div className="text-right ml-2 shrink-0">
            <div className="font-mono text-[10px] void-text-accent">
              +{newAchievement.xpReward} XP
            </div>
            <div className="font-mono text-[10px] void-text-energy">
              +{newAchievement.pointsReward} PTS
            </div>
          </div>
        </div>
      )}
    </ToastSlot>
  );
}
