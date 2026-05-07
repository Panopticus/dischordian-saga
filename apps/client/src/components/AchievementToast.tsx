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
import LottiePlayer from "@/components/LottiePlayer";
import { hapticFeedback } from "@/lib/haptics";
import { dispatchLegendaryAchievement } from "@/components/LegendaryAchievementModal";

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

  // When a new achievement arrives, route by tier:
  //   legendary → fullscreen LegendaryAchievementModal (skip the toast)
  //   everything else → standard toast (suppressed during dialogs)
  // The modal mounts at the App level and listens for the
  // legendary-achievement custom event; dispatching from here keeps
  // the celebration loop non-blocking and matches the existing
  // pattern (every toast-tier component owns its own dispatch site).
  useEffect(() => {
    if (newAchievement) {
      if (newAchievement.tier === "legendary") {
        dispatchLegendaryAchievement({
          id: newAchievement.achievementId,
          name: newAchievement.name,
          description: newAchievement.description,
          tier: "legendary",
          icon: newAchievement.icon,
          xpReward: newAchievement.xpReward,
          pointsReward: newAchievement.pointsReward,
        });
        dismissNewAchievement();
        setVisible(false);
        pendingRef.current = false;
        return;
      }
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
  }, [newAchievement, dismissNewAchievement]);

  // When dialog closes and we have a pending achievement, show it
  useEffect(() => {
    if (!dialogSuppressed && pendingRef.current && newAchievement) {
      pendingRef.current = false;
      setVisible(true);
    }
  }, [dialogSuppressed, newAchievement]);

  // Fire haptics when the toast first becomes visible. Using a
  // separate effect (keyed on `visible` + achievementId) so we pulse
  // once per achievement, not on every render tick. Haptic lib
  // respects reduce-motion + hapticsEnabled setting internally.
  useEffect(() => {
    if (visible && newAchievement) {
      hapticFeedback("achievement");
    }
  }, [visible, newAchievement?.achievementId]);

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
            {/* Lottie tier-flourish if one's been authored for this tier
                (bronze/silver/gold/platinum/legendary → /art/lottie/
                achievement-{tier}.json). Falls back to the existing
                emoji icon so shipping behavior is preserved until the
                JSON files land — this is a progressive upgrade. */}
            <LottiePlayer
              src={`/art/lottie/achievement-${newAchievement.tier}.json`}
              loop={false}
              fallback={<span>{newAchievement.icon}</span>}
              className="w-10 h-10 flex items-center justify-center"
            />
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
