import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight, Search, Send, Check, X, Clock,
  Package, User, Loader2, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import season1Cards from "@/data/season1-cards.json";

type CardData = (typeof season1Cards)[number];

const RARITY_COLORS: Record<string, string> = {
  Common: "text-gray-400 border-gray-500/30",
  Uncommon: "text-green-400 border-green-500/30",
  Rare: "text-blue-400 border-blue-500/30",
  Epic: "text-purple-400 border-purple-500/30",
  Legendary: "text-amber-400 border-amber-500/30",
};

const RARITY_BG: Record<string, string> = {
  Common: "bg-gray-500/10",
  Uncommon: "bg-green-500/10",
  Rare: "bg-blue-500/10",
  Epic: "bg-purple-500/10",
  Legendary: "bg-amber-500/10",
};

type Tab = "create" | "incoming" | "outgoing" | "history";

export default function CardTradingPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffering, setSelectedOffering] = useState<string[]>([]);
  const [selectedWanting, setSelectedWanting] = useState<string[]>([]);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: number; name: string } | null>(null);

  // tRPC
  const myTrades = trpc.trading.getMyTrades.useQuery(undefined, { enabled: isAuthenticated });
  const tradeHistory = trpc.trading.getTradeHistory.useQuery(undefined, { enabled: isAuthenticated });
  const searchPlayers = trpc.trading.searchPlayers.useQuery(
    { query: recipientSearch },
    { enabled: recipientSearch.length >= 2 }
  );
  const createOffer = trpc.trading.createOffer.useMutation({
    onSuccess: () => {
      utils.trading.getMyTrades.invalidate();
      setSelectedOffering([]);
      setSelectedWanting([]);
      setSelectedRecipient(null);
      setRecipientSearch("");
      toast.success("Trade offer sent!");
      setActiveTab("outgoing");
    },
    onError: (err) => toast.error(err.message),
  });
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

  const cardMap = useMemo(() => {
    const map = new Map<string, CardData>();
    season1Cards.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  const filteredCards = useMemo(() => {
    if (!searchQuery) return season1Cards.slice(0, 50);
    const q = searchQuery.toLowerCase();
    return season1Cards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.affiliation || "").toLowerCase().includes(q) ||
        (c.rarity || "").toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const incomingTrades = useMemo(() => {
    const data = myTrades.data;
    if (!data || !('received' in data)) return [] as any[];
    return data.received.filter((t) => t.status === "pending");
  }, [myTrades.data]);

  const outgoingTrades = useMemo(() => {
    const data = myTrades.data;
    if (!data || !('sent' in data)) return [] as any[];
    return data.sent.filter((t) => t.status === "pending");
  }, [myTrades.data]);

  const handleCreateTrade = useCallback(() => {
    if (selectedOffering.length === 0 && selectedWanting.length === 0) {
      toast.error("Select at least one card to offer or request");
      return;
    }
    if (!selectedRecipient) {
      toast.error("Select a trade partner");
      return;
    }
    createOffer.mutate({
      receiverId: selectedRecipient.id,
      senderCards: selectedOffering.map((id) => ({ cardId: id, quantity: 1 })),
      receiverCards: selectedWanting.map((id) => ({ cardId: id, quantity: 1 })),
    });
  }, [selectedOffering, selectedWanting, selectedRecipient, createOffer]);

  const toggleOffering = (id: string) => {
    setSelectedOffering((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };
  const toggleWanting = (id: string) => {
    setSelectedWanting((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <ArrowLeftRight className="mx-auto mb-4 text-primary" size={48} />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-3">CARD TRADING</h1>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Trade cards with other operatives. Login to access the trading floor.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm"
          >
            LOGIN TO TRADE
          </a>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: any; count?: number }[] = [
    { key: "create", label: "NEW TRADE", icon: Send },
    { key: "incoming", label: "INCOMING", icon: Package, count: incomingTrades.length },
    { key: "outgoing", label: "OUTGOING", icon: Clock, count: outgoingTrades.length },
    { key: "history", label: "HISTORY", icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">TRADING FLOOR</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider">
          CARD <span className="text-primary">TRADING</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Exchange cards with other operatives across the network
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border/20 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-mono text-xs transition-all ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon size={13} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Create Trade Tab */}
      {activeTab === "create" && (
        <div className="space-y-6">
          {/* Recipient Search */}
          <div className="border border-border/20 rounded-lg bg-card/30 p-4">
            <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
              <User size={14} className="text-primary" />
              TRADE PARTNER
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={recipientSearch}
                onChange={(e) => {
                  setRecipientSearch(e.target.value);
                  setSelectedRecipient(null);
                }}
                placeholder="Search player by name..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            {selectedRecipient && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                <User size={14} className="text-primary" />
                <span className="font-mono text-sm text-primary">{selectedRecipient.name}</span>
                <button onClick={() => setSelectedRecipient(null)} className="ml-auto text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
            )}
            {!selectedRecipient && recipientSearch.length >= 2 && searchPlayers.data && (
              <div className="mt-2 border border-border/20 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                {searchPlayers.data.length === 0 ? (
                  <p className="p-3 font-mono text-xs text-muted-foreground text-center">No players found</p>
                ) : (
                  searchPlayers.data.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedRecipient({ id: p.id, name: p.name || "Unknown" });
                        setRecipientSearch("");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <User size={12} className="text-muted-foreground" />
                      <span className="font-mono text-xs">{p.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Card Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Offering */}
            <div className="border border-border/20 rounded-lg bg-card/30 p-4">
              <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                <Package size={14} className="text-accent" />
                OFFERING ({selectedOffering.length}/5)
              </h3>
              {selectedOffering.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedOffering.map((id) => {
                    const card = cardMap.get(id);
                    return card ? (
                      <span
                        key={id}
                        onClick={() => toggleOffering(id)}
                        className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer hover:opacity-70 ${RARITY_BG[card.rarity || "Common"]} ${RARITY_COLORS[card.rarity || "Common"]}`}
                      >
                        {card.name} ×
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <div className="relative mb-2">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards..."
                  className="w-full pl-8 pr-3 py-2 rounded bg-secondary/50 border border-border/20 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredCards.slice(0, 30).map((card) => (
                  <button
                    key={card.id}
                    onClick={() => toggleOffering(card.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-all ${
                      selectedOffering.includes(card.id)
                        ? "bg-accent/20 border border-accent/40"
                        : "hover:bg-secondary/50 border border-transparent"
                    }`}
                  >
                    {card.imageUrl && (
                      <img src={card.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs truncate">{card.name}</p>
                      <p className={`font-mono text-[9px] ${RARITY_COLORS[card.rarity || "Common"]}`}>
                        {card.rarity} • {card.cardType}
                      </p>
                    </div>
                    {selectedOffering.includes(card.id) && <Check size={14} className="text-accent shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Wanting */}
            <div className="border border-border/20 rounded-lg bg-card/30 p-4">
              <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                <Heart size={14} className="text-destructive" />
                REQUESTING ({selectedWanting.length}/5)
              </h3>
              {selectedWanting.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedWanting.map((id) => {
                    const card = cardMap.get(id);
                    return card ? (
                      <span
                        key={id}
                        onClick={() => toggleWanting(id)}
                        className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer hover:opacity-70 ${RARITY_BG[card.rarity || "Common"]} ${RARITY_COLORS[card.rarity || "Common"]}`}
                      >
                        {card.name} ×
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <div className="max-h-60 overflow-y-auto space-y-1">
                {season1Cards.slice(0, 50).map((card) => (
                  <button
                    key={card.id}
                    onClick={() => toggleWanting(card.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-all ${
                      selectedWanting.includes(card.id)
                        ? "bg-destructive/20 border border-destructive/40"
                        : "hover:bg-secondary/50 border border-transparent"
                    }`}
                  >
                    {card.imageUrl && (
                      <img src={card.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs truncate">{card.name}</p>
                      <p className={`font-mono text-[9px] ${RARITY_COLORS[card.rarity || "Common"]}`}>
                        {card.rarity} • {card.cardType}
                      </p>
                    </div>
                    {selectedWanting.includes(card.id) && <Check size={14} className="text-destructive shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              onClick={handleCreateTrade}
              disabled={createOffer.isPending || (selectedOffering.length === 0 && selectedWanting.length === 0)}
              className="px-6 py-3 font-mono text-sm tracking-wider"
            >
              {createOffer.isPending ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Send className="mr-2" size={16} />
              )}
              SEND TRADE OFFER
            </Button>
          </div>
        </div>
      )}

      {/* Incoming Trades Tab */}
      {activeTab === "incoming" && (
        <div className="space-y-3">
          {incomingTrades.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto mb-3 text-muted-foreground/30" size={48} />
              <p className="font-mono text-sm text-muted-foreground">No incoming trade offers</p>
            </div>
          ) : (
            incomingTrades.map((trade: any) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border/20 rounded-lg bg-card/30 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-primary" />
                    <span className="font-mono text-sm font-semibold">From: {trade.senderName || "Unknown"}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {new Date(trade.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="font-mono text-[10px] text-accent mb-1.5 tracking-wider">THEY OFFER</p>
                    <div className="space-y-1">
                      {(trade.senderCards || []).map((item: any) => {
                        const card = cardMap.get(item.cardId);
                        return card ? (
                          <div key={item.cardId} className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10">
                            <span className={`font-mono text-[10px] ${RARITY_COLORS[card.rarity || "Common"]}`}>
                              {card.name} x{item.quantity}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-destructive mb-1.5 tracking-wider">THEY WANT</p>
                    <div className="space-y-1">
                      {(trade.receiverCards || []).map((item: any) => {
                        const card = cardMap.get(item.cardId);
                        return card ? (
                          <div key={item.cardId} className="flex items-center gap-1.5 px-2 py-1 rounded bg-destructive/10">
                            <span className={`font-mono text-[10px] ${RARITY_COLORS[card.rarity || "Common"]}`}>
                              {card.name} x{item.quantity}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => declineTrade.mutate({ tradeId: trade.id })}
                    disabled={declineTrade.isPending}
                    className="font-mono text-xs"
                  >
                    <X size={14} className="mr-1" /> DECLINE
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => acceptTrade.mutate({ tradeId: trade.id })}
                    disabled={acceptTrade.isPending}
                    className="font-mono text-xs"
                  >
                    <Check size={14} className="mr-1" /> ACCEPT
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Outgoing Trades Tab */}
      {activeTab === "outgoing" && (
        <div className="space-y-3">
          {outgoingTrades.length === 0 ? (
            <div className="text-center py-16">
              <Send className="mx-auto mb-3 text-muted-foreground/30" size={48} />
              <p className="font-mono text-sm text-muted-foreground">No outgoing trade offers</p>
            </div>
          ) : (
            outgoingTrades.map((trade: any) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border/20 rounded-lg bg-card/30 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-accent" />
                    <span className="font-mono text-sm font-semibold">To: {trade.receiverName || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">PENDING</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-[10px] text-accent mb-1.5 tracking-wider">YOU OFFER</p>
                    <div className="space-y-1">
                      {(trade.offeredCardIds || []).map((id: string) => {
                        const card = cardMap.get(id);
                        return card ? (
                          <div key={id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10">
                            <span className={`font-mono text-[10px] ${RARITY_COLORS[card.rarity || "Common"]}`}>
                              {card.name}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-destructive mb-1.5 tracking-wider">YOU WANT</p>
                    <div className="space-y-1">
                      {(trade.requestedCardIds || []).map((id: string) => {
                        const card = cardMap.get(id);
                        return card ? (
                          <div key={id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-destructive/10">
                            <span className={`font-mono text-[10px] ${RARITY_COLORS[card.rarity || "Common"]}`}>
                              {card.name}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {!tradeHistory.data || tradeHistory.data.length === 0 ? (
            <div className="text-center py-16">
              <ArrowLeftRight className="mx-auto mb-3 text-muted-foreground/30" size={48} />
              <p className="font-mono text-sm text-muted-foreground">No trade history yet</p>
            </div>
          ) : (
            tradeHistory.data.map((trade: any) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border/20 rounded-lg bg-card/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight size={14} className="text-muted-foreground" />
                    <span className="font-mono text-xs">
                      {trade.senderId === user?.id ? `→ ${trade.receiverName || "Unknown"}` : `← ${trade.senderName || "Unknown"}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                      trade.status === "accepted" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {trade.status === "accepted" ? "COMPLETED" : "DECLINED"}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(trade.updatedAt || trade.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(trade.offeredCardIds || []).map((id: string) => {
                      const card = cardMap.get(id);
                      return card ? (
                        <span key={id} className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${RARITY_BG[card.rarity || "Common"]} ${RARITY_COLORS[card.rarity || "Common"]}`}>
                          {card.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(trade.requestedCardIds || []).map((id: string) => {
                      const card = cardMap.get(id);
                      return card ? (
                        <span key={id} className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${RARITY_BG[card.rarity || "Common"]} ${RARITY_COLORS[card.rarity || "Common"]}`}>
                          {card.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
