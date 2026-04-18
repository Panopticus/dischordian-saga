/* ═══════════════════════════════════════════════════════
   CASINO GAME PANELS — Playable UI for the 12 previously
   stubbed casino games. Each panel wires the user's bet
   to the server-authoritative tRPC casino router and
   displays the returned result.

   These replace the "Coming to Ne-Yon Space soon…" stub
   in DegensCasinoPage.tsx.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { SLOT_SYMBOLS, type CasinoGame } from "./degensCasino";
import { CASINO_SLOT_ASSETS } from "@/lib/casinoAssets";
import { ResponsiveImage } from "@/components/ResponsiveImage";

/** Payload emitted by each game panel after a successful play.
 *  Lifted into a named type so callers can pattern-match against
 *  `achievementsUnlocked` and `rewardsUnlocked` to show toasts. */
export interface CasinoGameResultPayload {
  achievementsUnlocked?: string[];
  rewardsUnlocked?: string[];
}
export type CasinoGameResultCallback = (payload?: CasinoGameResultPayload) => void;

/** Equipped cosmetic slots pulled from `getMyCasinoRewards`. Panels
 *  that render a board / reel / table use this to tint their frame
 *  when a matching cosmetic is equipped. Only slots the casino UI
 *  actually honours are listed here; unused slots (loredex,
 *  companion) are ignored. */
export interface EquippedCosmeticsMap {
  title?: string;
  chip?: string;
  card_back?: string;
  table_felt?: string;
  companion?: string;
  loredex?: string;
}

/** Compute the CSS class suffix for an equipped table-felt cosmetic.
 *  Returns "" when nothing is equipped so the default frame style
 *  wins. */
function tableFeltClass(equipped?: EquippedCosmeticsMap): string {
  if (!equipped?.table_felt) return "";
  if (equipped.table_felt === "cosmetic:void_slot_reels") {
    return "ring-2 ring-purple-500/50 shadow-[0_0_30px_color-mix(in oklch, var(--energy-system) 25%, transparent)]";
  }
  if (equipped.table_felt === "cosmetic:custom_casino_theme") {
    return "ring-2 ring-amber-500/50 shadow-[0_0_30px_color-mix(in oklch, var(--energy-accent) 25%, transparent)]";
  }
  return "";
}

/** CSS class applied to chip buttons when a chip cosmetic is equipped. */
function chipClass(equipped?: EquippedCosmeticsMap): string {
  if (!equipped?.chip) return "";
  if (equipped.chip === "cosmetic:golden_chip") {
    return "shadow-[0_0_12px_rgba(234,179,8,0.6)] void-border";
  }
  if (equipped.chip === "cosmetic:black_crown_chip") {
    return "shadow-[0_0_12px_color-mix(in oklch, var(--bg-void) 80%, transparent)] border-white/40";
  }
  return "";
}

/** Shared result banner used by every panel after a mutation returns. */
function ResultBanner({ result }: { result: { won: boolean; payout: number; jackpot: boolean; detail: Record<string, unknown> } | null }) {
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-3 rounded-xl border text-center font-mono text-sm ${
        result.jackpot
          ? "void-bg-sunk void-border void-text-accent"
          : result.won
          ? "void-bg-success void-border-success void-text-energy"
          : "void-bg-error void-border-error void-text-error"
      }`}
    >
      {result.jackpot && <div className="void-text-accent font-display mb-1">JACKPOT!</div>}
      {result.won ? `+${result.payout} DREAM` : "No payout"}
    </motion.div>
  );
}

/** Bet selector used by every money game. */
function BetSelector({
  bet, setBet, min, max,
}: { bet: number; setBet: (n: number) => void; min: number; max: number }) {
  const steps = [min, Math.round((min + max) / 4), Math.round((min + max) / 2), max].filter((n, i, a) => a.indexOf(n) === i);
  return (
    <div className="flex gap-2 justify-center mb-3 flex-wrap">
      {steps.map((s) => (
        <button
          key={s}
          onClick={() => setBet(s)}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
            bet === s
              ? "void-bg-sunk void-border void-text-accent"
              : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70"
          }`}
        >
          {s}D
        </button>
      ))}
    </div>
  );
}

/* ─── VOID SLOTS (server-authoritative) ─── */

export function VoidSlotsPanel({
  onResult,
  equipped,
}: { onResult?: CasinoGameResultCallback; equipped?: EquippedCosmeticsMap }) {
  const [bet, setBet] = useState(10);
  const mut = trpc.casino.playVoidSlots.useMutation();
  const reels = (mut.data?.result.detail as { reels?: string[] } | undefined)?.reels;
  const feltCls = tableFeltClass(equipped);
  const chipCls = chipClass(equipped);
  return (
    <div className={`text-center rounded-xl p-4 transition-shadow ${feltCls}`}>
      <h2 className="font-display text-xl void-text-accent mb-2">VOID SLOTS</h2>
      <div className="mx-auto mb-4 max-w-md opacity-80">
        <ResponsiveImage
          src={CASINO_SLOT_ASSETS.symbolSpriteSheet}
          alt="Void Slots symbol gallery"
          className="w-full h-auto block"
        />
      </div>
      {reels && (
        <div className="flex justify-center gap-4 mb-6">
          {reels.map((sym, i) => {
            const s = SLOT_SYMBOLS.find((x) => x.id === sym);
            return (
              <motion.div
                key={`${sym}-${i}-${mut.data?.seed}`}
                initial={{ rotateX: 360 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="w-20 h-20 rounded-xl border-2 flex items-center justify-center text-3xl"
                style={{ borderColor: `${s?.color || "#fff"}40`, background: `${s?.color || "#fff"}10` }}
              >
                {s?.emoji || "?"}
              </motion.div>
            );
          })}
        </div>
      )}
      <BetSelector bet={bet} setBet={setBet} min={5} max={100} />
      <button
        onClick={() => mut.mutate({ bet }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className={`px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50 ${chipCls}`}
      >
        {mut.isPending ? "Spinning..." : `SPIN ${bet}D`}
      </button>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── ENTROPY DICE (server-authoritative) ─── */

export function EntropyDicePanel({
  onResult,
  equipped,
}: { onResult?: CasinoGameResultCallback; equipped?: EquippedCosmeticsMap }) {
  const [bet, setBet] = useState(25);
  const mut = trpc.casino.playEntropyDice.useMutation();
  const detail = mut.data?.result.detail as { die1?: number; die2?: number; total?: number } | undefined;
  const feltCls = tableFeltClass(equipped);
  return (
    <div className={`text-center rounded-xl p-4 transition-shadow ${feltCls}`}>
      <h2 className="font-display text-xl void-text-accent mb-4">ENTROPY DICE</h2>
      {detail?.die1 !== undefined && (
        <div className="flex justify-center gap-6 mb-4">
          <motion.div
            key={`d1-${mut.data?.seed}`}
            initial={{ rotateZ: 360 }}
            animate={{ rotateZ: 0 }}
            className="w-16 h-16 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center font-display text-2xl text-white"
          >
            {detail.die1}
          </motion.div>
          <motion.div
            key={`d2-${mut.data?.seed}`}
            initial={{ rotateZ: -360 }}
            animate={{ rotateZ: 0 }}
            className="w-16 h-16 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center font-display text-2xl text-white"
          >
            {detail.die2}
          </motion.div>
        </div>
      )}
      {detail?.total !== undefined && (
        <p className="font-mono text-lg text-white/60 mb-4">Total: {detail.total}</p>
      )}
      <BetSelector bet={bet} setBet={setBet} min={10} max={200} />
      <p className="font-mono text-[10px] text-white/20 mb-3 mt-2">Predict the roll:</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => mut.mutate({ bet, prediction: "under" }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
          disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-sunk border void-border void-text-energy font-mono text-sm void-bg-sunk disabled:opacity-50"
        >
          UNDER 7 (2x)
        </button>
        <button
          onClick={() => mut.mutate({ bet, prediction: "exact" }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
          disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
        >
          EXACT 7 (5x)
        </button>
        <button
          onClick={() => mut.mutate({ bet, prediction: "over" }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
          disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-error border void-border-error void-text-error font-mono text-sm void-bg-error disabled:opacity-50"
        >
          OVER 7 (2x)
        </button>
      </div>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── NEBULA POKER ─── */

export function NebulaPokerPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(25);
  const [hand, setHand] = useState<Array<{ rank: number; suit: string }> | null>(null);
  const [discard, setDiscard] = useState<number[]>([]);
  const [handType, setHandType] = useState<string | null>(null);
  const mut = trpc.casino.playNebulaPoker.useMutation();

  const play = () => {
    mut.mutate(
      { bet, discard },
      {
        onSuccess: (data) => {
          const detail = data.result.detail as { hand: Array<{ rank: number; suit: string }>; handType: string };
          setHand(detail.hand);
          setHandType(detail.handType);
          setDiscard([]);
          onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked });
        },
      },
    );
  };

  const rankLabel = (r: number) =>
    r === 14 ? "A" : r === 13 ? "K" : r === 12 ? "Q" : r === 11 ? "J" : String(r);
  const suitGlyph: Record<string, string> = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" };

  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">NEBULA POKER</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">
        5-card draw. Discard up to 3 cards before dealing.
      </p>
      {hand && (
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {hand.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                if (discard.includes(i)) setDiscard(discard.filter(d => d !== i));
                else if (discard.length < 3) setDiscard([...discard, i]);
              }}
              className={`w-14 h-20 rounded-lg border-2 flex flex-col items-center justify-center font-display ${
                discard.includes(i)
                  ? "void-bg-error void-border-error void-text-error opacity-50"
                  : c.suit === "hearts" || c.suit === "diamonds"
                  ? "bg-white/5 void-border-error void-text-error"
                  : "bg-white/5 border-white/30 text-white"
              }`}
            >
              <div className="text-lg">{rankLabel(c.rank)}</div>
              <div className="text-xl">{suitGlyph[c.suit]}</div>
            </button>
          ))}
        </div>
      )}
      {handType && <p className="font-mono text-sm void-text-accent mb-3 uppercase tracking-widest">{handType.replace(/_/g, " ")}</p>}
      <BetSelector bet={bet} setBet={setBet} min={25} max={500} />
      <button
        onClick={play}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Dealing..." : hand ? "DRAW / STAND" : `DEAL ${bet}D`}
      </button>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── QUANTUM ROULETTE ─── */

const FACTIONS = ["architect", "insurgency", "new_babylon", "thought_virus", "antiquarian", "hierarchy"] as const;

export function QuantumRoulettePanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(25);
  const [selected, setSelected] = useState<typeof FACTIONS[number][]>([]);
  const mut = trpc.casino.playQuantumRoulette.useMutation();

  const play = () => {
    if (selected.length === 0) return;
    const kind = selected.length === 1 ? "straight" : selected.length === 2 ? "adjacent" : "half";
    mut.mutate(
      { bet, kind, factions: selected },
      { onSuccess: (data) => { onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }); } },
    );
  };

  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">QUANTUM ROULETTE</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Pick 1-3 factions. Straight 5x, adjacent 2.5x, half 1.8x.</p>
      <div className="grid grid-cols-3 gap-2 mb-4 max-w-md mx-auto">
        {FACTIONS.map(f => {
          const on = selected.includes(f);
          return (
            <button
              key={f}
              onClick={() => {
                if (on) setSelected(selected.filter(s => s !== f));
                else if (selected.length < 3) setSelected([...selected, f]);
              }}
              className={`px-3 py-2 rounded-lg font-mono text-xs border ${
                on ? "void-bg-sunk void-border void-text-accent" : "bg-white/[0.03] border-white/10 text-white/50"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          );
        })}
      </div>
      <BetSelector bet={bet} setBet={setBet} min={10} max={300} />
      <button
        onClick={play}
        disabled={mut.isPending || selected.length === 0}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Spinning..." : `SPIN ${bet}D`}
      </button>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-xs text-white/60">
          Landed on: <span className="void-text-accent">{(mut.data.result.detail as { landed: string }).landed.replace("_", " ")}</span>
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── PAZAAK 21 ─── */

export function Pazaak21Panel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(25);
  const [stand, setStand] = useState(18);
  const mut = trpc.casino.playPazaak21.useMutation();

  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">PAZAAK 21</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Stand at {stand}. Dealer draws to 17.</p>
      <input
        type="range" min={10} max={21} value={stand}
        onChange={e => setStand(Number(e.target.value))}
        className="w-48 mb-4"
      />
      <BetSelector bet={bet} setBet={setBet} min={15} max={250} />
      <button
        onClick={() => mut.mutate({ bet, stand }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Dealing..." : `DEAL ${bet}D`}
      </button>
      {mut.data?.result && (
        <div className="mt-3 font-mono text-xs text-white/60">
          <p>You: {(mut.data.result.detail as { player: number }).player}</p>
          <p>Dealer: {(mut.data.result.detail as { dealer: number }).dealer}</p>
        </div>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── HIGH / LOW ─── */

export function HighLowPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(10);
  const [chainLength, setChainLength] = useState(3);
  const mut = trpc.casino.playHighLow.useMutation();

  const play = (guess: "high" | "low") => {
    const guesses = Array.from({ length: chainLength }, () => guess);
    mut.mutate({ bet, guesses }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) });
  };

  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">HIGH / LOW</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Chain length {chainLength}. Each correct = 1.5x multiplier.</p>
      <input
        type="range" min={1} max={10} value={chainLength}
        onChange={e => setChainLength(Number(e.target.value))}
        className="w-48 mb-4"
      />
      <BetSelector bet={bet} setBet={setBet} min={5} max={50} />
      <div className="flex gap-3 justify-center">
        <button onClick={() => play("high")} disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-error border void-border-error void-text-error font-mono text-sm void-bg-error disabled:opacity-50">
          ALL HIGH
        </button>
        <button onClick={() => play("low")} disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-sunk border void-border void-text-energy font-mono text-sm void-bg-sunk disabled:opacity-50">
          ALL LOW
        </button>
      </div>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-xs text-white/60">
          Chain: <span className="void-text-accent">{(mut.data.result.detail as { chain: number }).chain}</span>
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── SCRATCH CARDS ─── */

export function ScratchCardPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const mut = trpc.casino.playScratchCard.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">VOID SCRATCH CARDS</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Fixed 10D. Match 3 for prize, curse loses 20.</p>
      <button
        onClick={() => mut.mutate(undefined, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Scratching..." : "BUY CARD (10D)"}
      </button>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── VOID BLACKJACK TOURNAMENT ─── */

export function VoidBlackjackTournamentPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(50);
  const [stand, setStand] = useState(17);
  const mut = trpc.casino.playVoidBlackjackTournament.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">VOID BLACKJACK TOURNAMENT</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Best of 3. Winner takes 6x minus 10% rake.</p>
      <input type="range" min={10} max={21} value={stand} onChange={e => setStand(Number(e.target.value))} className="w-48 mb-4" />
      <BetSelector bet={bet} setBet={setBet} min={50} max={500} />
      <button
        onClick={() => mut.mutate({ bet, stand }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Running..." : `ENTER ${bet}D`}
      </button>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── LIAR'S DICE ─── */

export function LiarsDicePanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(30);
  const mut = trpc.casino.playLiarsDice.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">LIAR'S DICE</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">The NPC bids. Trust or call liar.</p>
      <BetSelector bet={bet} setBet={setBet} min={20} max={200} />
      <div className="flex gap-3 justify-center">
        <button onClick={() => mut.mutate({ bet, call: "trust" }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })} disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-sunk border void-border void-text-energy font-mono text-sm void-bg-sunk disabled:opacity-50">
          TRUST (2x)
        </button>
        <button onClick={() => mut.mutate({ bet, call: "liar" }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })} disabled={mut.isPending}
          className="px-4 py-2 rounded-lg void-bg-error border void-border-error void-text-error font-mono text-sm void-bg-error disabled:opacity-50">
          LIAR (3x)
        </button>
      </div>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-xs text-white/60">
          Bid: {(mut.data.result.detail as { bidQuantity: number; bidValue: number }).bidQuantity}×{(mut.data.result.detail as { bidValue: number }).bidValue}
          {" — actual: "}
          {(mut.data.result.detail as { actualCount: number }).actualCount}
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── FACTION WAR BETTING ─── */

const BET_LABELS: Record<string, string> = {
  insurgency_weekly:   "Insurgency wins weekly territory war",
  architect_weekly:    "Architect holds core sectors",
  necromancer_event:   "Necromancer event triggers",
  alliance_war_outcome:"Iron Lions vs Void Walkers",
  new_babylon_trade:   "New Babylon trade index rises",
  thought_virus_spread:"Thought Virus spreads to Sector 12",
};

export function FactionWarBettingPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(50);
  const [selectedId, setSelectedId] = useState("insurgency_weekly");
  const oddsQuery = trpc.casino.getFactionWarOdds.useQuery(undefined, { refetchInterval: 30_000 });
  const mut = trpc.casino.playFactionWarBet.useMutation();
  const odds = oddsQuery.data ?? {};
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">FACTION WAR BETTING</h2>
      <p className="font-mono text-[9px] void-text-accent mb-3">
        Odds are computed live from the active faction war.
      </p>
      <div className="space-y-2 mb-4 max-w-md mx-auto">
        {Object.keys(BET_LABELS).map(id => {
          const live = odds[id];
          return (
            <button
              key={id}
              onClick={() => setSelectedId(id)}
              className={`w-full p-2 rounded-lg border text-left text-xs font-mono ${
                selectedId === id ? "void-bg-sunk void-border void-text-accent" : "bg-white/[0.03] border-white/10 text-white/50"
              }`}
            >
              {BET_LABELS[id]} — <span className="void-text-accent">{live ? `${live.toFixed(2)}x` : "…"}</span>
            </button>
          );
        })}
      </div>
      <BetSelector bet={bet} setBet={setBet} min={10} max={1000} />
      <button
        onClick={() => mut.mutate({ bet, betId: selectedId }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Placing..." : `BET ${bet}D`}
      </button>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── DREAM ROULETTE ─── */

export function DreamRoulettePanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(50);
  const mut = trpc.casino.playDreamRoulette.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">DREAM ROULETTE</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">6 chambers. Survive all 6 for 5x payout.</p>
      <BetSelector bet={bet} setBet={setBet} min={25} max={300} />
      <button
        onClick={() => mut.mutate({ bet }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-error border void-border-error void-text-error font-mono text-sm void-bg-error disabled:opacity-50"
      >
        {mut.isPending ? "Cylinder spinning..." : `PULL THE TRIGGER ${bet}D`}
      </button>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-xs text-white/60">
          Rounds survived: {(mut.data.result.detail as { rounds: number }).rounds}/6
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── CARD BATTLER'S GAUNTLET ─── */

export function CardBattlersGauntletPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(50);
  const mut = trpc.casino.playCardBattlersGauntlet.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">CARD BATTLER'S GAUNTLET</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Best-of-3 vs The Degen. Win = 3x.</p>
      <BetSelector bet={bet} setBet={setBet} min={30} max={250} />
      <button
        onClick={() => mut.mutate({ bet }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Battling..." : `ENTER ${bet}D`}
      </button>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-xs text-white/60">
          Rounds: {((mut.data.result.detail as { rounds: string[] }).rounds).join(" → ")}
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── VOID BINGO ─── */

export function VoidBingoPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const mut = trpc.casino.playVoidBingo.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">VOID BINGO</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Free to play. Win 50D if you line up in under 20 draws.</p>
      <button
        onClick={() => mut.mutate(undefined, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Calling..." : "PLAY SESSION"}
      </button>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-xs text-white/60">
          Drew {(mut.data.result.detail as { drawsTaken: number }).drawsTaken} events
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── VOID CASES ─── */

export function VoidCasesPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [bet, setBet] = useState(100);
  const mut = trpc.casino.playVoidCase.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">VOID CASES</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Pity timer at 20 cases. Published drop rates.</p>
      <BetSelector bet={bet} setBet={setBet} min={50} max={500} />
      <button
        onClick={() => mut.mutate({ bet }, { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) })}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Cracking..." : `OPEN CASE ${bet}D`}
      </button>
      {mut.data?.result && (
        <p className="mt-3 font-mono text-sm uppercase font-display tracking-widest void-text-accent">
          {(mut.data.result.detail as { tier: string }).tier}
          {(mut.data.result.detail as { pityTriggered?: boolean }).pityTriggered && " (pity)"}
        </p>
      )}
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── DISCHORDIAN MAHJONG ─── */

export function DischordianMahjongPanel({ onResult }: { onResult?: CasinoGameResultCallback }) {
  const [timeUsed, setTimeUsed] = useState(120);
  const mut = trpc.casino.reportMahjongCompletion.useMutation();
  return (
    <div className="text-center">
      <h2 className="font-display text-xl void-text-accent mb-4">DISCHORDIAN MAHJONG</h2>
      <p className="font-mono text-[10px] text-white/40 mb-4">Daily pattern challenge. Faster = more XP.</p>
      <input type="range" min={30} max={300} value={timeUsed} onChange={e => setTimeUsed(Number(e.target.value))} className="w-48 mb-2" />
      <p className="font-mono text-[10px] text-white/50 mb-4">Simulated time: {timeUsed}s / 300s</p>
      <button
        onClick={() => mut.mutate(
          { baseXp: 50, timeUsedSeconds: timeUsed, timeLimitSeconds: 300, factionCombo: 3 },
          { onSuccess: (data) => onResult?.({ achievementsUnlocked: data?.achievementsUnlocked, rewardsUnlocked: data?.rewardsUnlocked }) },
        )}
        disabled={mut.isPending}
        className="px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
      >
        {mut.isPending ? "Scoring..." : "COMPLETE RUN"}
      </button>
      <ResultBanner result={mut.data?.result ?? null} />
    </div>
  );
}

/* ─── DISPATCHER ─── */

export function CasinoGamePanel({
  game, onResult, equippedCosmetics,
}: {
  game: CasinoGame;
  onResult?: CasinoGameResultCallback;
  equippedCosmetics?: EquippedCosmeticsMap;
}) {
  switch (game) {
    case "void_slots":                return <VoidSlotsPanel                onResult={onResult} equipped={equippedCosmetics} />;
    case "entropy_dice":              return <EntropyDicePanel              onResult={onResult} equipped={equippedCosmetics} />;
    case "nebula_poker":              return <NebulaPokerPanel              onResult={onResult} />;
    case "quantum_roulette":          return <QuantumRoulettePanel          onResult={onResult} />;
    case "pazaak_21":                 return <Pazaak21Panel                 onResult={onResult} />;
    case "high_low":                  return <HighLowPanel                  onResult={onResult} />;
    case "scratch_cards":             return <ScratchCardPanel              onResult={onResult} />;
    case "void_blackjack_tournament": return <VoidBlackjackTournamentPanel  onResult={onResult} />;
    case "liars_dice":                return <LiarsDicePanel                onResult={onResult} />;
    case "faction_war_betting":       return <FactionWarBettingPanel        onResult={onResult} />;
    case "dream_roulette":            return <DreamRoulettePanel            onResult={onResult} />;
    case "card_battlers_gauntlet":    return <CardBattlersGauntletPanel     onResult={onResult} />;
    case "void_bingo":                return <VoidBingoPanel                onResult={onResult} />;
    case "void_cases":                return <VoidCasesPanel                onResult={onResult} />;
    case "dischordian_mahjong":       return <DischordianMahjongPanel       onResult={onResult} />;
    default: return null;
  }
}
