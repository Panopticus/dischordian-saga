import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, Check, CheckCheck, Trash2, Loader2,
  Store, Swords, Gavel, Shield, Gift, Star,
  Trophy, Crown, Users, Flag, Scroll, Zap,
  ArrowLeftRight, ShoppingCart, MessageSquare
} from "lucide-react";
import { useLocation } from "wouter";

const TYPE_ICONS: Record<string, typeof Bell> = {
  trade_offer: ArrowLeftRight,
  trade_accepted: Check,
  trade_declined: X,
  pvp_challenge: Swords,
  pvp_result: Trophy,
  auction_outbid: Gavel,
  auction_won: Crown,
  auction_ended: Gavel,
  market_sold: Store,
  market_buy_filled: ShoppingCart,
  faction_war: Flag,
  guild_invite: Users,
  guild_message: MessageSquare,
  daily_reset: Scroll,
  daily_login: Gift,
  quest_complete: Star,
  weekly_quest: Scroll,
  epoch_quest: Crown,
  achievement: Trophy,
  battle_pass_reward: Zap,
  syndicate_quest: Shield,
  system: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  trade_offer: "text-cyan-400",
  trade_accepted: "text-green-400",
  trade_declined: "text-red-400",
  pvp_challenge: "text-red-400",
  pvp_result: "text-amber-400",
  auction_outbid: "text-orange-400",
  auction_won: "text-amber-400",
  auction_ended: "text-muted-foreground",
  market_sold: "text-green-400",
  market_buy_filled: "text-cyan-400",
  faction_war: "text-red-400",
  guild_invite: "text-purple-400",
  guild_message: "text-blue-400",
  daily_reset: "text-cyan-400",
  daily_login: "text-amber-400",
  quest_complete: "text-green-400",
  weekly_quest: "text-blue-400",
  epoch_quest: "text-purple-400",
  achievement: "text-amber-400",
  battle_pass_reward: "text-purple-400",
  syndicate_quest: "text-cyan-400",
  system: "text-muted-foreground",
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Poll unread count every 30 seconds
  const { data: unreadData } = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const { data: listData, refetch } = trpc.notifications.list.useQuery(
    { limit: 20, offset: 0 },
    { enabled: isAuthenticated && isOpen }
  );

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => refetch(),
  });
  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteNotif = trpc.notifications.delete.useMutation({
    onSuccess: () => refetch(),
  });
  const clearAll = trpc.notifications.clearAll.useMutation({
    onSuccess: () => refetch(),
  });

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  if (!isAuthenticated) return null;

  const unreadCount = unreadData?.count ?? 0;
  const items = listData?.items ?? [];

  function handleNotifClick(notif: typeof items[0]) {
    if (!notif.isRead) {
      markRead.mutate({ id: notif.id });
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
      setIsOpen(false);
    }
  }

  function formatTime(date: Date | string) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-secondary/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className={unreadCount > 0 ? "text-primary" : "text-muted-foreground"} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] rounded-lg border border-border/50 bg-card shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/90">
              <h3 className="font-display text-sm font-bold tracking-wider flex items-center gap-2">
                <Bell size={14} className="text-primary" />
                NOTIFICATIONS
                {unreadCount > 0 && (
                  <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {unreadCount} NEW
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="p-1.5 rounded hover:bg-secondary/50 transition-colors"
                    title="Mark all read"
                  >
                    <CheckCheck size={14} className="text-muted-foreground" />
                  </button>
                )}
                {items.length > 0 && (
                  <button
                    onClick={() => clearAll.mutate()}
                    className="p-1.5 rounded hover:bg-secondary/50 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={14} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[calc(70vh-52px)]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell size={32} className="text-muted-foreground/30 mb-3" />
                  <p className="font-mono text-xs text-muted-foreground">No notifications</p>
                </div>
              ) : (
                items.map((notif, i) => {
                  const Icon = TYPE_ICONS[notif.type] || Bell;
                  const color = TYPE_COLORS[notif.type] || "text-muted-foreground";

                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => handleNotifClick(notif)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-border/10 cursor-pointer transition-colors ${
                        notif.isRead
                          ? "opacity-60 hover:opacity-80"
                          : "bg-primary/5 hover:bg-primary/10"
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${notif.isRead ? "bg-secondary/30" : "bg-primary/10"}`}>
                        <Icon size={14} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-mono text-xs font-semibold truncate ${notif.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                          {notif.title}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <span className="font-mono text-[9px] text-muted-foreground/50 mt-1 block">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
