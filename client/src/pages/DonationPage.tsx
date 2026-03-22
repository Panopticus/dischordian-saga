/* ═══════════════════════════════════════════════════════
   DONATION PAGE — Card/material donations, reputation
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Gift, Star, Trophy, Users,
  Heart, Package, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "donate" | "guild" | "leaderboard";

export default function DonationPage() {
  const [tab, setTab] = useState<Tab>("donate");
  const [donationType, setDonationType] = useState("dream_fragments");
  const [amount, setAmount] = useState(10);

  const { data: myRep, isLoading } = trpc.donation.getMyReputation.useQuery({ guildId: 0 });
  const { data: donationTypes } = trpc.donation.getDonationTypes.useQuery();
  const { data: guildDonations } = trpc.donation.getGuildDonations.useQuery(
    { guildId: 0 },
    { enabled: tab === "guild" }
  );
  const { data: leaderboard } = trpc.donation.getReputationLeaderboard.useQuery(
    { guildId: 0 },
    { enabled: tab === "leaderboard" }
  );

  const donateMut = trpc.donation.donate.useMutation({
    onSuccess: (d: any) => toast.success(`Donated! +${d.reputationEarned} reputation`),
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
          <Gift size={18} className="text-accent" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">DONATIONS</h1>
          {myRep && (
            <span className="ml-auto font-mono text-[10px] text-accent">
              REP: {myRep.totalReputation || 0}
            </span>
          )}
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["donate", "guild", "leaderboard"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-accent/20 text-accent border border-accent/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "donate" ? "DONATE" : t === "guild" ? "GUILD LOG" : "LEADERBOARD"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "donate" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Donation type selector */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">DONATION TYPE</p>
              <div className="grid grid-cols-2 gap-2">
                {(donationTypes?.types || []).map((dt: string) => (
                  <button
                    key={dt}
                    onClick={() => setDonationType(dt)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      donationType === dt
                        ? "border-accent/40 bg-accent/5"
                        : "border-border/30 bg-card/30 hover:border-accent/20"
                    }`}
                  >
                    <p className="font-mono text-xs font-semibold">{dt.replace(/_/g, " ")}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/60">{(donationTypes?.reputationPer as any)?.[dt] || 1} rep/unit</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">AMOUNT</p>
              <div className="flex gap-2">
                {[10, 25, 50, 100].map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`px-4 py-2 rounded-md text-xs font-mono transition-colors ${
                      amount === a ? "bg-accent/20 text-accent border border-accent/30" : "bg-card/30 border border-border/20 text-muted-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => donateMut.mutate({ guildId: 0, donationType, amount })}
              disabled={donateMut.isPending}
            >
              <Gift size={14} className="mr-1" />
              {donateMut.isPending ? "Donating..." : `Donate ${amount} ${donationType.replace(/_/g, " ")}`}
            </Button>
          </motion.div>
        )}

        {tab === "guild" && (
          <div className="space-y-2">
            {guildDonations && guildDonations.length > 0 ? (
              guildDonations.map((d: any, i: number) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
                >
                  <Heart size={14} className="text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold">Player #{d.userId}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {d.donationType} × {d.amount} • +{d.reputationEarned} rep
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No guild donations yet</p>
              </div>
            )}
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="space-y-2">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((entry: any, i: number) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
                >
                  <span className={`font-display text-sm font-bold w-8 text-center ${
                    i === 0 ? "text-accent" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-chart-4" : "text-muted-foreground/60"
                  }`}>
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-xs font-semibold">Player #{entry.userId}</p>
                  </div>
                  <span className="font-mono text-xs text-accent">{entry.totalDonated} donated</span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Trophy size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No donations yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
