/* ═══════════════════════════════════════════════════════
   CONTENT REWARD TOAST — Shows rewards earned from content participation
   Used by WatchPage, ConexusPortalPage, LoreQuizPage, etc.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useCallback } from "react";

type RewardItem = { type: string; value: string; quantity: number };

/**
 * Hook to record content participation and show reward toasts.
 * Returns a function that records participation and shows rewards.
 */
export function useContentReward() {
  const { isAuthenticated } = useAuth();
  const recordParticipation = trpc.contentReward.recordParticipation.useMutation();

  const recordAndReward = useCallback(async (
    contentType: string,
    contentId: string,
    completed: boolean = true,
    metadata?: Record<string, unknown>,
  ) => {
    if (!isAuthenticated) return null;

    try {
      const result = await recordParticipation.mutateAsync({
        contentType,
        contentId,
        completed,
        progress: completed ? 100 : 50,
        metadata,
      });

      if (result.rewards && result.rewards.length > 0) {
        showRewardToast(result.rewards);
      }

      return result;
    } catch (err) {
      // Silently fail — don't block the user experience
      console.warn("[ContentReward] Failed to record:", err);
      return null;
    }
  }, [isAuthenticated, recordParticipation]);

  return { recordAndReward, isRecording: recordParticipation.isPending };
}

function showRewardToast(rewards: RewardItem[]) {
  const dreamReward = rewards.find(r => r.type === "dream");
  const cardRewards = rewards.filter(r => r.type === "card" || r.type === "milestone_card");
  const milestoneReward = rewards.find(r => r.type === "milestone_dream");

  let message = "🎁 Rewards earned!";
  const parts: string[] = [];

  if (dreamReward) {
    parts.push(`+${dreamReward.quantity} Dream`);
  }
  if (cardRewards.length > 0) {
    parts.push(`${cardRewards.length} card${cardRewards.length > 1 ? "s" : ""} unlocked`);
  }
  if (milestoneReward) {
    parts.push(`Milestone bonus: +${milestoneReward.quantity} Dream`);
  }

  if (parts.length > 0) {
    message = parts.join(" • ");
  }

  toast.success(message, {
    duration: 5000,
    description: milestoneReward ? "🏆 Milestone reached!" : "Keep exploring for more rewards!",
  });
}
