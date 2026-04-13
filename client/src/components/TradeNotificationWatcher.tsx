/* ═══════════════════════════════════════════════════════
   TRADE NOTIFICATION WATCHER — Polls for new incoming
   trades and shows toast notifications
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeftRight, Check, X } from "lucide-react";

const POLL_INTERVAL = 15_000; // 15 seconds

export default function TradeNotificationWatcher() {
  const { isAuthenticated } = useAuth();
  const seenTradeIds = useRef<Set<number>>(new Set());
  const initialLoadDone = useRef(false);

  const myTrades = trpc.trading.getMyTrades.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: false,
  });

  const utils = trpc.useUtils();

  const acceptTrade = trpc.trading.acceptTrade.useMutation({
    onSuccess: () => {
      utils.trading.getMyTrades.invalidate();
      utils.trading.getTradeHistory.invalidate();
      toast.success("Trade accepted! Cards exchanged.");
    },
    onError: (err) => toast.error(err.message),
  });

  const declineTrade = trpc.trading.declineTrade.useMutation({
    onSuccess: () => {
      utils.trading.getMyTrades.invalidate();
      toast.success("Trade declined.");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAccept = useCallback((tradeId: number) => {
    acceptTrade.mutate({ tradeId });
  }, [acceptTrade]);

  const handleDecline = useCallback((tradeId: number) => {
    declineTrade.mutate({ tradeId });
  }, [declineTrade]);

  useEffect(() => {
    if (!myTrades.data || !("received" in myTrades.data)) return;

    const incoming = myTrades.data.received.filter((t) => t.status === "pending");

    // On first load, just record existing trade IDs without showing toasts
    if (!initialLoadDone.current) {
      incoming.forEach((t) => seenTradeIds.current.add(t.id));
      initialLoadDone.current = true;
      return;
    }

    // Check for new trades we haven't seen
    for (const trade of incoming) {
      if (!seenTradeIds.current.has(trade.id)) {
        seenTradeIds.current.add(trade.id);

        const senderName = (trade as any).senderName || "An operative";
        const cardCount = Array.isArray(trade.senderCards) ? trade.senderCards.length : 0;

        toast(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ArrowLeftRight size={14} className="text-primary shrink-0" />
              <span className="font-mono text-xs">
                <span className="text-primary font-bold">{senderName}</span> sent you a trade offer
              </span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {cardCount > 0 ? `${cardCount} card${cardCount !== 1 ? "s" : ""} offered` : "Dream tokens offered"}
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => {
                  handleAccept(trade.id);
                  toast.dismiss(`trade-${trade.id}`);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-500/20 border border-green-500/40 text-green-400 font-mono text-[10px] hover:bg-green-500/30 transition-colors"
              >
                <Check size={10} /> ACCEPT
              </button>
              <button
                onClick={() => {
                  handleDecline(trade.id);
                  toast.dismiss(`trade-${trade.id}`);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-[10px] hover:bg-red-500/30 transition-colors"
              >
                <X size={10} /> DECLINE
              </button>
            </div>
          </div>,
          {
            id: `trade-${trade.id}`,
            duration: 30_000,
            position: "top-right",
          }
        );
      }
    }

    // Also notify when a trade we sent was accepted
    const sentTrades = myTrades.data.sent || [];
    for (const trade of sentTrades) {
      const acceptedKey = `accepted-${trade.id}`;
      if (trade.status === "accepted" && !seenTradeIds.current.has(trade.id + 100000)) {
        seenTradeIds.current.add(trade.id + 100000);
        const receiverName = (trade as any).receiverName || "An operative";
        toast.success(
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={14} className="text-green-400 shrink-0" />
            <span className="font-mono text-xs">
              <span className="text-green-400 font-bold">{receiverName}</span> accepted your trade!
            </span>
          </div>,
          { duration: 8_000, position: "top-right" }
        );
      }
      if (trade.status === "declined" && !seenTradeIds.current.has(trade.id + 200000)) {
        seenTradeIds.current.add(trade.id + 200000);
        const receiverName = (trade as any).receiverName || "An operative";
        toast.error(
          <div className="flex items-center gap-2">
            <X size={14} className="text-red-400 shrink-0" />
            <span className="font-mono text-xs">
              <span className="text-red-400 font-bold">{receiverName}</span> declined your trade.
            </span>
          </div>,
          { duration: 8_000, position: "top-right" }
        );
      }
    }
  }, [myTrades.data, handleAccept, handleDecline]);

  // This component renders nothing — it's a side-effect watcher
  return null;
}
