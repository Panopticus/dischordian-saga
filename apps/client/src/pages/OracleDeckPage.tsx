/* ═══════════════════════════════════════════════════════
   THE ORACLE DECK — 23-card Dischordian Tarot System

   Collection view + daily reading + weekly spread. Pre-match
   readings are triggered from the TCG / chess match lobbies
   (E6 / E7), not from this page directly.

   Design: the page is deliberately small. A tarot reading is
   mostly negative space around a few intense images. The UI
   should feel like flipping a card on an oak table, not
   browsing a menu.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Moon,
  Sun,
  Loader2,
  CheckCircle2,
  Calendar,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type View = "deck" | "daily_reading" | "weekly_reading";

/** Arcanum → subtle accent color. The Thoth deck taught us that
 *  tarot loves color. Dischordia gets a cooler, more digital
 *  palette than Crowley's. */
const ARCANUM_ACCENT: Record<string, string> = {
  fool: "border-sky-400/40 text-sky-100",
  magician: "border-amber-400/40 text-amber-100",
  high_priestess: "border-indigo-400/40 text-indigo-100",
  empress: "border-emerald-400/40 text-emerald-100",
  emperor: "border-slate-400/40 text-slate-100",
  hierophant: "border-violet-400/40 text-violet-100",
  lovers: "border-rose-400/40 text-rose-100",
  chariot: "border-orange-400/40 text-orange-100",
  justice: "border-teal-400/40 text-teal-100",
  hermit: "border-stone-400/40 text-stone-100",
  fortune: "border-yellow-400/40 text-yellow-100",
  strength: "border-red-400/40 text-red-100",
  hanged_man: "border-cyan-400/40 text-cyan-100",
  death: "border-neutral-400/40 text-neutral-100",
  temperance: "border-lime-400/40 text-lime-100",
  devil: "border-fuchsia-400/40 text-fuchsia-100",
  tower: "border-red-500/40 text-red-100",
  star: "border-blue-400/40 text-blue-100",
  moon: "border-purple-400/40 text-purple-100",
  sun: "border-yellow-300/40 text-yellow-50",
  judgment: "border-emerald-500/40 text-emerald-100",
  world: "border-violet-500/40 text-violet-100",
  fnord: "border-rose-500/40 text-rose-100",
};

export default function OracleDeckPage() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<View>("deck");

  const progressQ = trpc.oracleDeck.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const collectionQ = trpc.oracleDeck.listCollection.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const castDaily = trpc.oracleDeck.castDaily.useMutation();
  const castWeekly = trpc.oracleDeck.castWeekly.useMutation();

  const [dailyReading, setDailyReading] = useState<any>(null);
  const [weeklyReading, setWeeklyReading] = useState<any>(null);

  const owned = collectionQ.data?.filter((c: any) => c.owned) ?? [];
  const locked = collectionQ.data?.filter((c: any) => !c.owned) ?? [];

  const handleCastDaily = async () => {
    const result = await castDaily.mutateAsync();
    setDailyReading(result.reading);
    setView("daily_reading");
  };

  const handleCastWeekly = async () => {
    try {
      const result = await castWeekly.mutateAsync();
      setWeeklyReading(result.reading);
      setView("weekly_reading");
    } catch (err: any) {
      alert(err.message ?? "Could not cast weekly reading.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <a
          href={getLoginUrl()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
        >
          Sign in to open the Oracle Deck
        </a>
      </div>
    );
  }

  if (progressQ.isLoading || collectionQ.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const progress = progressQ.data?.progress;
  const charges = progress?.charges ?? 0;
  const todayDayNumber = progressQ.data?.dayNumber ?? 0;
  const canCastDaily = progress?.lastDailyDayNumber !== todayDayNumber;
  const thisWeekNumber = progressQ.data?.weekNumber ?? 0;
  const canCastWeekly =
    progress?.lastWeeklyWeekNumber !== thisWeekNumber && charges >= 3;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-2">
            <Moon size={20} className="text-violet-300" />
            THE ORACLE DECK
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Twenty-three cards the Oracle and the Engineer wrote together
            the week before she left // {owned.length} / {collectionQ.data?.length ?? 23} collected
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "deck" && (
          <motion.div
            key="deck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Reading actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCastDaily}
                disabled={!canCastDaily || castDaily.isPending}
                className="rounded-lg border border-sky-400/40 bg-sky-400/5 p-4 text-left hover-lift disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sun size={16} className="text-sky-300" />
                  <span className="font-display text-sm font-bold tracking-wider">
                    DAILY READING
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {canCastDaily
                    ? "One free card for the shape of your day."
                    : "Already cast today. Come back tomorrow."}
                </p>
              </button>

              <button
                onClick={handleCastWeekly}
                disabled={!canCastWeekly || castWeekly.isPending}
                className="rounded-lg border border-violet-400/40 bg-violet-400/5 p-4 text-left hover-lift disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-violet-300" />
                  <span className="font-display text-sm font-bold tracking-wider">
                    WEEKLY SPREAD — THE FIVE FORCES
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {canCastWeekly
                    ? `Five cards for the week. Cost: 3 Oracle charges (you have ${charges}).`
                    : charges < 3
                      ? `Not enough charges (need 3, have ${charges}).`
                      : "Already cast this week. Come back next week."}
                </p>
              </button>
            </div>

            {/* Charges display */}
            <div className="rounded-lg border border-border/30 bg-card/20 p-3 flex items-center gap-3">
              <Sparkles size={16} className="text-amber-300" />
              <span className="font-mono text-xs">
                Oracle Charges: <span className="text-amber-200">{charges}</span>
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                // earned from governance votes, chapter completions, and
                Academy milestones. 1 per pre-match reading; 3 per weekly spread.
              </span>
            </div>

            {/* Owned cards */}
            {owned.length > 0 && (
              <div>
                <h2 className="font-display text-sm font-bold tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  IN YOUR DECK
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {owned.map((card: any) => (
                    <OracleCardFace key={card.slug} card={card} />
                  ))}
                </div>
              </div>
            )}

            {/* Locked cards */}
            {locked.length > 0 && (
              <div>
                <h2 className="font-display text-sm font-bold tracking-wider mb-2 flex items-center gap-2">
                  <Lock size={14} className="text-muted-foreground" />
                  NOT YET COLLECTED
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {locked.map((card: any) => (
                    <OracleCardFace key={card.slug} card={card} silhouette />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === "daily_reading" && dailyReading && (
          <ReadingView
            key="daily"
            reading={dailyReading}
            onClose={() => {
              setView("deck");
              setDailyReading(null);
            }}
          />
        )}

        {view === "weekly_reading" && weeklyReading && (
          <ReadingView
            key="weekly"
            reading={weeklyReading}
            onClose={() => {
              setView("deck");
              setWeeklyReading(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── OracleCardFace ─── */
function OracleCardFace({
  card,
  silhouette,
}: {
  card: any;
  silhouette?: boolean;
}) {
  const accent = ARCANUM_ACCENT[card.arcanum] ?? "border-border/30 text-foreground";
  if (silhouette) {
    return (
      <div className="rounded-md border border-border/30 bg-card/20 p-3 opacity-60">
        <div className="flex items-center gap-1 mb-1">
          <Lock size={10} className="text-muted-foreground" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            ??? // {card.arcanum.replace(/_/g, " ")}
          </span>
        </div>
        <p className="font-display text-xs font-bold text-muted-foreground">
          {card.id === 22 ? "???" : card.name}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground mt-2 line-clamp-3">
          {card.unlock.label}
        </p>
      </div>
    );
  }
  return (
    <div className={`rounded-md border ${accent} bg-card/40 p-3 hover-lift`}>
      <span className="font-mono text-[9px] uppercase tracking-widest">
        {card.id} // {card.arcanum.replace(/_/g, " ")}
      </span>
      <p className="font-display text-xs font-bold mt-1">{card.name}</p>
      <p className="font-mono text-[10px] text-muted-foreground mt-2 line-clamp-4">
        {card.loreBlurb}
      </p>
    </div>
  );
}

/* ─── ReadingView ─── */
function ReadingView({
  reading,
  onClose,
}: {
  reading: any;
  onClose: () => void;
}) {
  const draws = reading.draws ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-lg border border-violet-400/30 bg-gradient-to-br from-violet-500/5 to-transparent p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-wider">
          {reading.spread?.name ?? "Reading"}
        </h2>
        <button
          onClick={onClose}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          ← close
        </button>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {reading.spread?.blurb}
      </p>

      <div
        className={`grid gap-3 ${
          draws.length <= 1
            ? "grid-cols-1"
            : draws.length <= 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        }`}
      >
        {draws.map((d: any, i: number) => (
          <DrawnCard key={i} drawn={d} hidden={d.position.label === "Hidden"} />
        ))}
      </div>

      {reading.fallback && (
        <p className="font-mono text-[10px] text-amber-300/80 border-l-2 border-amber-400/40 pl-3">
          Fallback reading — you own fewer cards than the spread length. The
          Prisoner stood in for you today. Collect more Oracle cards to
          unlock the full reading.
        </p>
      )}
    </motion.div>
  );
}

function DrawnCard({ drawn, hidden }: { drawn: any; hidden: boolean }) {
  const accent = hidden
    ? "border-rose-500/50 text-rose-100"
    : ARCANUM_ACCENT.fool;
  return (
    <div className={`rounded-md border ${accent} bg-black/40 p-4 space-y-2`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {drawn.position.label}
      </p>
      {hidden ? (
        <>
          <p className="font-display text-sm font-bold text-rose-200">???</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            The Hidden card is not revealed in the reading UI. Its effect
            fires at an unspecified moment during the week.
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-sm font-bold">{drawn.cardSlug}</p>
          <p className="font-mono text-[10px] text-muted-foreground italic">
            {drawn.orientation}
          </p>
          <p className="font-mono text-[10px] text-amber-200/80">
            {drawn.buff?.label}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            applies at {drawn.position.appliesAt}
          </p>
        </>
      )}
    </div>
  );
}
