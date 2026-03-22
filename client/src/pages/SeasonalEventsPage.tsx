/* ═══════════════════════════════════════════════════════
   SEASONAL EVENTS PAGE — Time-limited events, tokens, shop
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Calendar, Gift, ShoppingBag, Trophy,
  Clock, Star, Zap, Target, Crown, Sparkles, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "events" | "shop";

export default function SeasonalEventsPage() {
  const [tab, setTab] = useState<Tab>("events");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: events, isLoading } = trpc.seasonalEvents.getActiveEvents.useQuery();
  const { data: eventDetail } = trpc.seasonalEvents.getEventDetails.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );
  const contributeMut = trpc.seasonalEvents.contribute.useMutation({
    onSuccess: (d) => toast.success(`+${d.tokensEarned} event tokens earned!`),
    onError: (e) => toast.error(e.message),
  });
  const purchaseMut = trpc.seasonalEvents.buyShopItem.useMutation({
    onSuccess: () => toast.success("Item purchased!"),
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Calendar size={18} className="text-accent" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">SEASONAL EVENTS</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["events", "shop"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "events" ? "ACTIVE EVENTS" : "EVENT SHOP"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "events" && (
          <>
            {(!events || events.length === 0) ? (
              <div className="text-center py-16">
                <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No active events right now</p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">Check back soon for new seasonal content!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event: any, i: number) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`rounded-lg border p-4 cursor-pointer transition-all ${
                      selectedEventId === event.id
                        ? "border-accent/50 bg-accent/5"
                        : "border-border/30 bg-card/30 hover:border-accent/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles size={14} className="text-accent" />
                          <h3 className="font-display text-sm font-bold tracking-wide">{event.eventKey}</h3>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">
                          Status: <span className="text-accent">{event.status}</span>
                        </p>
                        {event.endsAt && (
                          <p className="font-mono text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                            <Clock size={10} /> Ends: {new Date(event.endsAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-muted-foreground">Tokens</p>
                        <p className="font-display text-lg font-bold text-accent">{event.tokensEarned || 0}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Event Detail */}
            {eventDetail && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-primary/20 bg-card/50 p-4 space-y-4"
              >
                <h3 className="font-display text-sm font-bold tracking-wide flex items-center gap-2">
                  <Target size={14} className="text-primary" />
                  EVENT DETAILS
                </h3>

                {/* Milestones */}
                {eventDetail.milestones && eventDetail.milestones.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">MILESTONES</p>
                    <div className="space-y-2">
                      {eventDetail.milestones.map((m: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-mono">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            m.completed ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted-foreground"
                          }`}>
                            {m.completed ? <Check size={12} /> : <Star size={10} />}
                          </div>
                          <span className={m.completed ? "text-accent" : "text-foreground"}>{m.name || `Milestone ${i + 1}`}</span>
                          <span className="text-muted-foreground/60 ml-auto">{m.reward || ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contribute Button */}
                <Button
                  size="sm"
                  onClick={() => selectedEventId && contributeMut.mutate({ eventId: selectedEventId, amount: 1 })}
                  disabled={contributeMut.isPending}
                  className="w-full"
                >
                  <Zap size={14} className="mr-1" />
                  {contributeMut.isPending ? "Contributing..." : "Contribute to Event"}
                </Button>
              </motion.div>
            )}
          </>
        )}

        {tab === "shop" && eventDetail?.shopItems && (
          <div className="space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">EVENT SHOP</p>
            {eventDetail.shopItems.map((item: any, i: number) => (
              <motion.div
                key={item.key || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <Gift size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-xs font-semibold">{item.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{item.cost} tokens</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedEventId && purchaseMut.mutate({ eventId: selectedEventId, itemKey: item.key })}
                  disabled={purchaseMut.isPending}
                >
                  <ShoppingBag size={12} className="mr-1" /> Buy
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
