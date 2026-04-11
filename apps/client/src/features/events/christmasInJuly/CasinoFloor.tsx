/* ═══════════════════════════════════════════════════════
   DEGEN'S CASINO — CHRISTMAS IN JULY

   The main event hub for the Christmas in July seasonal
   event. Five tabs: The Floor, Naughty or Nice Wheel,
   Soul Stone Craps, Twelve Days of Degenmas, and
   Charity & Milestones.

   Festive casino aesthetic — neon reds/greens, gold
   accents, snow particles, casino energy meets
   Christmas warmth.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Gem, Sparkles, Gift, TreePine, Calendar, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
  RotateCw, Trophy, Heart, Star, Flame, ChevronLeft, Target,
  Snowflake, CircleDollarSign, TrendingUp, Check,
  Timer, Package, ArrowRight,
} from "lucide-react";
import { useSoulStoneStore } from "@/features/soulStones/soulStoneStore";
import { trpc } from "@/lib/trpc";
import { useIsChristmasActive, getNpcHolidayLines } from "./holidayDialog";
import { CHRISTMAS_EVENT_CONFIG } from "@/data/events/christmasInJuly/eventConfig";

/* ─── TAB TYPE ─── */
type Tab = "floor" | "wheel" | "craps" | "calendar" | "charity";

/* ─── WHEEL PRIZES ─── */
interface WheelPrize {
  label: string;
  color: string;
  weight: number;
  tokens: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
}

const WHEEL_PRIZES: WheelPrize[] = [
  { label: "5 Tokens",        color: "#dc2626", weight: 20, tokens: 5,   rarity: "common" },
  { label: "10 Tokens",       color: "#16a34a", weight: 18, tokens: 10,  rarity: "common" },
  { label: "Gift Box",        color: "#dc2626", weight: 15, tokens: 0,   rarity: "uncommon" },
  { label: "15 Tokens",       color: "#16a34a", weight: 12, tokens: 15,  rarity: "uncommon" },
  { label: "Soul Stone",      color: "#dc2626", weight: 10, tokens: 0,   rarity: "uncommon" },
  { label: "25 Tokens",       color: "#16a34a", weight: 8,  tokens: 25,  rarity: "rare" },
  { label: "Naughty Coal",    color: "#dc2626", weight: 6,  tokens: -5,  rarity: "common" },
  { label: "50 Tokens",       color: "#16a34a", weight: 4,  tokens: 50,  rarity: "rare" },
  { label: "Nice Blessing",   color: "#dc2626", weight: 3,  tokens: 0,   rarity: "rare" },
  { label: "100 Tokens",      color: "#16a34a", weight: 2,  tokens: 100, rarity: "legendary" },
  { label: "Mystery Gift",    color: "#dc2626", weight: 1.5, tokens: 0,  rarity: "legendary" },
  { label: "JACKPOT",         color: "#eab308", weight: 0.5, tokens: 500, rarity: "legendary" },
];

/* ─── CALENDAR CHALLENGES ─── */
interface DayChallenge {
  day: number;
  challenge: string;
  reward: string;
  tokens: number;
}

const CALENDAR_DAYS: DayChallenge[] = [
  { day: 1,  challenge: "Send a gift to any player",           reward: "10 Festive Tokens",    tokens: 10 },
  { day: 2,  challenge: "Win 3 hands at the Wheel",            reward: "15 Festive Tokens",    tokens: 15 },
  { day: 3,  challenge: "Purify a Soul Stone",                 reward: "1 Gift Box",           tokens: 0 },
  { day: 4,  challenge: "Roll doubles in Craps",               reward: "20 Festive Tokens",    tokens: 20 },
  { day: 5,  challenge: "Send 3 gifts in one session",         reward: "Gold Ornament Badge",  tokens: 0 },
  { day: 6,  challenge: "Win a rare prize on the Wheel",       reward: "25 Festive Tokens",    tokens: 25 },
  { day: 7,  challenge: "Complete any 3 previous challenges",  reward: "Streak Bonus x2",      tokens: 50 },
  { day: 8,  challenge: "Wager 5 Soul Stones in Craps",        reward: "Blessed Stone",        tokens: 0 },
  { day: 9,  challenge: "Fill 10% of the Giving Tree",         reward: "30 Festive Tokens",    tokens: 30 },
  { day: 10, challenge: "Send a gift to a new player",         reward: "Welcome Wreath Badge", tokens: 0 },
  { day: 11, challenge: "Hit 3 Nice spins in a row",           reward: "40 Festive Tokens",    tokens: 40 },
  { day: 12, challenge: "Contribute to the Charity Pool",      reward: "LCIF Donor Badge",     tokens: 0 },
  { day: 13, challenge: "Win 50+ tokens from a single spin",   reward: "Lucky Star Badge",     tokens: 0 },
  { day: 14, challenge: "Complete ALL previous challenges",    reward: "Degen's Crown",        tokens: 100 },
];

/* ─── CHARITY MILESTONES ─── */
interface Milestone {
  name: string;
  threshold: number;
  reward: string;
  lcifDonation: string;
  reached: boolean;
}

const MILESTONES: Milestone[] = [
  { name: "Stocking Stuffer",     threshold: 10000,  reward: "Community Snow Effect",            lcifDonation: "$250",   reached: false },
  { name: "Gift Avalanche",       threshold: 50000,  reward: "Exclusive Ornament Avatar Frame",  lcifDonation: "$1,000", reached: false },
  { name: "Blizzard of Giving",   threshold: 100000, reward: "Double Token Weekend",             lcifDonation: "$2,500", reached: false },
  { name: "North Pole Express",   threshold: 175000, reward: "Legendary Degen Santa Skin",       lcifDonation: "$5,000", reached: false },
  { name: "Miracle on Degen St.", threshold: 250000, reward: "Permanent Casino Wing + $10k LCIF", lcifDonation: "$10,000", reached: false },
];

/* ─── CRAPS OUTCOMES ─── */
const DEGEN_COMMENTARY: Record<string, string[]> = {
  win:  ["Ho ho ho! The Degen smiles upon you!", "Merry Crit-mas! You crushed it!", "Even Santa couldn't roll that clean!", "The host raises his glass. For a moment, his eyes flash with something ancient and golden."],
  lose: ["Coal for you, degenerate!", "The house always wins... eventually. It has had a VERY long time to practice.", "Degen giveth, Degen taketh away. Entropy is generous like that."],
  jackpot: ["BY THE VOID — DOUBLE SIXES! JACKPOT BABY!", "The Degen is SHOOK! Something cosmic flickers behind those golden eyes. Legendary roll!"],
  snake: ["Snake eyes... the Degen cackles from the shadows. The sound is older than it should be.", "Ouch. That's gonna leave a mark on your soul. The host knows about soul-marks. He's collected a few."],
};

/* ─── DICE ICON MAP ─── */
const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

/* ─── SNOW CSS (injected once) ─── */
const SNOW_STYLES = `
@keyframes snowfall {
  0%   { transform: translateY(-10vh) translateX(0); opacity: 1; }
  50%  { transform: translateY(50vh) translateX(20px); opacity: 0.8; }
  100% { transform: translateY(110vh) translateX(-10px); opacity: 0; }
}
@keyframes casino-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.15), 0 0 40px rgba(34,197,94,0.1); }
  50%      { box-shadow: 0 0 30px rgba(239,68,68,0.25), 0 0 60px rgba(34,197,94,0.15); }
}
@keyframes wheel-decel {
  0%   { transform: rotate(var(--start-angle)); }
  100% { transform: rotate(var(--end-angle)); }
}
@keyframes pulse-gold {
  0%, 100% { text-shadow: 0 0 10px rgba(234,179,8,0.3); }
  50%      { text-shadow: 0 0 20px rgba(234,179,8,0.6); }
}
.snow-particle {
  position: fixed;
  top: -10px;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  opacity: 0.6;
  pointer-events: none;
  z-index: 50;
  animation: snowfall linear infinite;
}
.casino-panel { animation: casino-glow 4s ease-in-out infinite; }
.gold-pulse   { animation: pulse-gold 2s ease-in-out infinite; }
`;

/* ═══════════════════════════════════════════════════════
   GIFT SEND BAR — autocomplete-based recipient picker.
   The "Send" button is gated on a resolved recipient from
   the searchGiftRecipients query.
   ═══════════════════════════════════════════════════════ */
function GiftSendBar() {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<{ id: number; name: string | null } | null>(null);
  const [giftType, setGiftType] = useState<"gift_box" | "candy_cane" | "snowflake_fragment" | "mystery_box">("gift_box");
  const [message, setMessage] = useState("");
  const utils = trpc.useUtils();
  const searchQuery = trpc.christmasInJuly.searchGiftRecipients.useQuery(
    { query },
    { enabled: query.length >= 2 && !picked, staleTime: 15_000 },
  );
  const sendGift = trpc.christmasInJuly.sendGift.useMutation({
    onSuccess: () => {
      utils.christmasInJuly.getMyProgress.invalidate();
      utils.christmasInJuly.getCharityPool.invalidate();
      setMessage("");
      setQuery("");
      setPicked(null);
    },
  });
  const onSend = () => {
    if (!picked) return;
    sendGift.mutate({ recipientId: picked.id, giftType, message: message || undefined });
  };
  return (
    <div className="bg-gradient-to-r from-red-950/20 via-amber-900/10 to-green-950/20 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-4 h-4 text-amber-400" />
        <span className="font-display text-sm text-amber-300">Send a Gift</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={picked ? (picked.name ?? `User #${picked.id}`) : query}
            onChange={(e) => {
              setPicked(null);
              setQuery(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/40 text-gray-200 text-sm"
          />
          {query.length >= 2 && !picked && searchQuery.data && searchQuery.data.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg bg-gray-900 border border-gray-700/60 shadow-xl max-h-48 overflow-auto">
              {searchQuery.data.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setPicked(u); setQuery(""); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-amber-500/10 border-b border-gray-800/60 last:border-b-0"
                >
                  {u.name ?? `User #${u.id}`}
                </button>
              ))}
            </div>
          )}
        </div>
        <select
          value={giftType}
          onChange={(e) => setGiftType(e.target.value as typeof giftType)}
          className="px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/40 text-gray-200 text-sm"
        >
          <option value="gift_box">Gift Box</option>
          <option value="candy_cane">Candy Cane</option>
          <option value="snowflake_fragment">Snowflake Fragment</option>
          <option value="mystery_box">Mystery Box</option>
        </select>
        <input
          type="text"
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/40 text-gray-200 text-sm"
        />
        <button
          onClick={onSend}
          disabled={sendGift.isPending || !picked}
          className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono text-sm hover:bg-amber-500/30 disabled:opacity-50"
        >
          {sendGift.isPending ? "Sending..." : "Send"}
        </button>
      </div>
      {sendGift.isError && (
        <p className="mt-2 text-xs text-red-400/80 font-mono">{sendGift.error.message}</p>
      )}
      {sendGift.isSuccess && (
        <p className="mt-2 text-xs text-green-400/80 font-mono">Gift sent! +{sendGift.data?.tokensEarned ?? 0} tokens earned.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   REWARDS PANEL — Displays badges, items, and titles the
   player has earned during the event. Reads the decorated
   unlockedRewards list from `christmasInJuly.getMyRewards`.
   ═══════════════════════════════════════════════════════ */
function RewardsPanel() {
  const rewardsQuery = trpc.christmasInJuly.getMyRewards.useQuery();
  const rewards = rewardsQuery.data ?? [];
  if (rewards.length === 0) {
    return (
      <div className="bg-gray-900/30 border border-gray-700/20 rounded-xl p-4 text-center text-xs text-gray-500 font-mono">
        No holiday rewards earned yet. Spin, roll, and claim daily challenges to collect them.
      </div>
    );
  }
  const byKind = {
    title: rewards.filter(r => r.kind === "title"),
    badge: rewards.filter(r => r.kind === "badge"),
    item: rewards.filter(r => r.kind === "item"),
  };
  return (
    <div className="bg-gradient-to-br from-amber-950/20 to-red-950/20 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-amber-400" />
        <span className="font-display text-sm text-amber-300">Holiday Rewards Earned</span>
        <span className="ml-auto text-xs text-amber-400/50 font-mono">{rewards.length} total</span>
      </div>
      {(["title", "badge", "item"] as const).map((kind) =>
        byKind[kind].length > 0 ? (
          <div key={kind} className="mb-3 last:mb-0">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">
              {kind}s
            </p>
            <div className="flex flex-wrap gap-2">
              {byKind[kind].map((r) => (
                <span
                  key={r.id}
                  className={`text-xs px-3 py-1 rounded-full border font-mono ${
                    kind === "title"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : kind === "badge"
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-green-500/10 border-green-500/30 text-green-300"
                  }`}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GIFT INBOX — lists the current user's received gifts
   with a Claim button for unclaimed ones.
   ═══════════════════════════════════════════════════════ */
function GiftInbox({ userId }: { userId: number }) {
  const utils = trpc.useUtils();
  const giftsQuery = trpc.christmasInJuly.myGifts.useQuery();
  const claimGift = trpc.christmasInJuly.claimGift.useMutation({
    onSuccess: () => {
      utils.christmasInJuly.myGifts.invalidate();
      utils.christmasInJuly.getMyProgress.invalidate();
    },
  });
  const gifts = giftsQuery.data ?? [];
  const received = gifts.filter(g => g.recipientId === userId);
  const unclaimed = received.filter(g => !g.claimed);
  if (received.length === 0) {
    return (
      <div className="bg-gray-900/40 border border-gray-700/20 rounded-xl p-4 text-center text-xs text-gray-500 font-mono">
        No gifts received yet. Tell your friends you love presents.
      </div>
    );
  }
  return (
    <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-amber-400" />
        <span className="font-display text-sm text-amber-300">Gift Inbox</span>
        {unclaimed.length > 0 && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono">
            {unclaimed.length} unclaimed
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-64 overflow-auto">
        {received.slice(0, 10).map((gift) => (
          <div
            key={gift.id}
            className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
              gift.claimed
                ? "bg-gray-900/30 border-gray-700/20 opacity-60"
                : "bg-amber-500/10 border-amber-500/30"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-amber-300 truncate">
                {gift.giftType.replace(/_/g, " ")}
              </p>
              {gift.message && (
                <p className="text-[10px] text-gray-400 italic mt-1 truncate">"{gift.message}"</p>
              )}
            </div>
            {!gift.claimed ? (
              <button
                onClick={() => claimGift.mutate({ giftId: gift.id })}
                disabled={claimGift.isPending}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono text-xs hover:bg-amber-500/30 disabled:opacity-50"
              >
                Claim
              </button>
            ) : (
              <span className="text-[10px] text-gray-500 font-mono">claimed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function CasinoFloor() {
  /* ─── TAB STATE ─── */
  const [activeTab, setActiveTab] = useState<Tab>("floor");

  /* ─── HOLIDAY DIALOG + EVENT-ACTIVE FLAG ─── */
  const isEventActive = useIsChristmasActive();
  const degenLines = getNpcHolidayLines("degen");

  /* ─── BACKEND PROGRESS + CONFIG ─── */
  const trpcContext = trpc.useUtils();
  const configQuery = trpc.christmasInJuly.getConfig.useQuery();
  const progressQuery = trpc.christmasInJuly.getMyProgress.useQuery(undefined, { retry: false });
  const charityPoolQuery = trpc.christmasInJuly.getCharityPool.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const spinWheelMut = trpc.christmasInJuly.spinWheel.useMutation({
    onSuccess: () => {
      trpcContext.christmasInJuly.getMyProgress.invalidate();
      trpcContext.christmasInJuly.getCharityPool.invalidate();
    },
  });
  const rollCrapsMut = trpc.christmasInJuly.rollCraps.useMutation({
    onSuccess: () => {
      trpcContext.christmasInJuly.getMyProgress.invalidate();
      trpcContext.christmasInJuly.getCharityPool.invalidate();
    },
  });
  const claimTokensMut = trpc.christmasInJuly.claimDailyTokens.useMutation({
    onSuccess: () => trpcContext.christmasInJuly.getMyProgress.invalidate(),
  });
  const claimChallengeMut = trpc.christmasInJuly.claimDailyChallenge.useMutation({
    onSuccess: () => trpcContext.christmasInJuly.getMyProgress.invalidate(),
  });
  const donateToCharityMut = trpc.christmasInJuly.donateToCharity.useMutation({
    onSuccess: () => {
      trpcContext.christmasInJuly.getMyProgress.invalidate();
      trpcContext.christmasInJuly.getCharityPool.invalidate();
    },
  });

  const progress = progressQuery.data;
  const charityPool = charityPoolQuery.data;
  const currentDay = configQuery.data?.currentDay ?? 1;
  const completedDaysSet = useMemo(() => new Set((progress?.completedDays as number[] | null) ?? []), [progress?.completedDays]);

  /* ─── FESTIVE TOKEN ECONOMY (mirrors server) ─── */
  const [festiveTokens, setFestiveTokens] = useState(100);
  const [giftsSent, setGiftsSent] = useState(0);
  const [giftsReceived, setGiftsReceived] = useState(0);

  // Mirror server progress into local display state.
  useEffect(() => {
    if (!progress) return;
    setFestiveTokens(progress.festiveTokens);
    setGiftsSent(progress.giftsSent);
    setGiftsReceived(progress.giftsReceived);
  }, [progress]);

  /* ─── WHEEL STATE ─── */
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelPrize | null>(null);
  const [history, setHistory] = useState<WheelPrize[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  /* ─── CRAPS STATE ─── */
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [crapsResult, setCrapsResult] = useState<string>("");
  const [crapsCommentary, setCrapsCommentary] = useState("");
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const [stonesWagered, setStonesWagered] = useState(0);
  const [stonesWon, setStonesWon] = useState(0);
  const [blessedPurifications, setBlessedPurifications] = useState(0);
  const [communityPool, setCommunityPool] = useState(0);

  /* ─── CALENDAR STATE — backed by server completedDays ─── */
  const completedDays = completedDaysSet;
  const streak = progress?.streak ?? 0;

  /* ─── CHARITY STATE — backed by xmas_july_charity_pool ─── */
  const communityGifts = charityPool?.totalGifts ?? 0;
  const [animatedGifts, setAnimatedGifts] = useState(communityGifts);

  /* ─── GIVING TREE ─── Pulled live from the charity pool. The
   *  tree fills up against the next uncleared milestone; each
   *  community milestone effectively "reseeds" the tree with a
   *  higher goal so there's always something to aim at. */
  const treeGoal = useMemo(() => {
    const milestones = configQuery.data?.milestones ?? [];
    const next = milestones.find(m => communityGifts < m.threshold);
    return next?.threshold ?? (milestones[milestones.length - 1]?.threshold ?? 250_000);
  }, [configQuery.data, communityGifts]);
  const treeGifts = communityGifts;
  const treeProgress = Math.min((treeGifts / treeGoal) * 100, 100);

  /* ─── EVENT TIMER ─── Real days remaining until event end. */
  const daysRemaining = useMemo(() => {
    const end = new Date(CHRISTMAS_EVENT_CONFIG.endDate).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((end - now) / (24 * 60 * 60 * 1000)));
  }, []);

  /* ─── SOUL STONE STORE ─── */
  const stoneStore = useSoulStoneStore();

  /* ─── INJECT SNOW STYLES ─── */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = SNOW_STYLES;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  /* ─── ANIMATED GIFT COUNTER ─── */
  useEffect(() => {
    if (animatedGifts === communityGifts) return;
    const diff = communityGifts - animatedGifts;
    const step = Math.max(1, Math.floor(Math.abs(diff) / 30));
    const timer = setTimeout(() => {
      setAnimatedGifts((prev) =>
        diff > 0 ? Math.min(prev + step, communityGifts) : Math.max(prev - step, communityGifts)
      );
    }, 30);
    return () => clearTimeout(timer);
  }, [animatedGifts, communityGifts]);


  /* ─── WHEEL SPIN LOGIC — server-authoritative ─── */
  const spinWheel = useCallback(() => {
    if (spinning || festiveTokens < 5) return;
    setSpinning(true);
    setResult(null);

    spinWheelMut.mutate(
      { useFreeSpin: false },
      {
        onSuccess: (data) => {
          // Map the server prize back to a local wheel segment
          const serverPrize = data.prize;
          const tokenAmount =
            serverPrize.prizeType === "tokens" || serverPrize.prizeType === "jackpot"
              ? serverPrize.amount
              : 0;
          const localRarity: WheelPrize["rarity"] =
            serverPrize.rarity === "epic" ? "rare" :
            serverPrize.rarity as WheelPrize["rarity"];
          const selected: WheelPrize = {
            label: serverPrize.id.replace(/_/g, " "),
            color: "#eab308",
            weight: serverPrize.weight,
            tokens: tokenAmount,
            rarity: localRarity,
          };
          // Animate the wheel: pick a random segment to land on (visual only)
          const segmentAngle = 360 / WHEEL_PRIZES.length;
          const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
          const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
          const totalRotation = wheelRotation + 1440 + targetAngle;
          setWheelRotation(totalRotation);
          setTimeout(() => {
            setSpinning(false);
            setResult(selected);
            setHistory((prev) => [selected, ...prev].slice(0, 5));
          }, 3500);
        },
        onError: () => { setSpinning(false); },
      },
    );
  }, [spinning, festiveTokens, wheelRotation, spinWheelMut]);

  /* ─── CRAPS ROLL LOGIC — server-authoritative + soul stone integration ─── */
  const rollDice = useCallback(() => {
    if (rolling || !selectedStone) return;
    // Find a stone of the selected color in the player's inventory
    const stone = stoneStore.stones.find((s) => s.state === selectedStone);
    if (!stone) {
      setCrapsResult("No matching soul stone in inventory");
      return;
    }
    setRolling(true);
    setCrapsResult("");
    setCrapsCommentary("");

    // Animate dice for 1.5s
    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 80);

    rollCrapsMut.mutate(
      { stoneId: stone.id },
      {
        onSuccess: (data) => {
          clearInterval(interval);
          setDice([data.roll.die1, data.roll.die2]);
          setStonesWagered((s) => s + 1);

          // Apply the server's instruction to the soul stone store via
          // its public actions.
          const action = data.stoneAction;
          if (action === "consumed") {
            stoneStore.markStoneConsumed(stone.id);
          } else if (action === "corrupted") {
            stoneStore.markStoneCorrupted(stone.id);
          } else if (action === "purified") {
            setBlessedPurifications((b) => b + 1);
            stoneStore.markStonePurified(stone.id);
          }

          // Tally wins on the local UI mirror
          if (data.roll.outcome === "win" || data.roll.outcome === "miracle" || data.roll.outcome === "blessed") {
            setStonesWon((s) => s + 1);
          }
          if (data.roll.outcome === "hierarchy_claims" || data.roll.outcome === "loss_to_pool") {
            setCommunityPool((p) => p + 1);
          }

          // Pick a commentary bucket based on the outcome
          const bucket =
            data.roll.outcome === "miracle" ? DEGEN_COMMENTARY.jackpot :
            data.roll.outcome === "hierarchy_claims" ? DEGEN_COMMENTARY.snake :
            data.roll.outcome === "blessed" || data.roll.outcome === "win" ? DEGEN_COMMENTARY.win :
            DEGEN_COMMENTARY.lose;
          setCrapsResult(`${data.roll.total} — ${data.roll.outcome.replace(/_/g, " ")}`);
          setCrapsCommentary(bucket[Math.floor(Math.random() * bucket.length)]);
          setRolling(false);
        },
        onError: (err) => {
          clearInterval(interval);
          setCrapsResult(`Error: ${err.message}`);
          setRolling(false);
        },
      },
    );
  }, [rolling, selectedStone, stoneStore.stones, rollCrapsMut]);

  /* ─── TAB CONFIG ─── */
  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "floor",    label: "The Floor",    icon: <Sparkles className="w-4 h-4" /> },
    { id: "wheel",    label: "Wheel",        icon: <RotateCw className="w-4 h-4" /> },
    { id: "craps",    label: "Craps",        icon: <Dice5 className="w-4 h-4" /> },
    { id: "calendar", label: "12 Days",      icon: <Calendar className="w-4 h-4" /> },
    { id: "charity",  label: "Charity",      icon: <Heart className="w-4 h-4" /> },
  ];

  /* ─── RARITY COLORS ─── */
  const rarityColor: Record<string, string> = {
    common: "text-gray-300",
    uncommon: "text-green-400",
    rare: "text-blue-400",
    legendary: "text-amber-400",
  };


  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-red-950/10 to-gray-950 text-white relative overflow-hidden">
      {/* ── SNOW PARTICLES ── */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="snow-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${4 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}

      {/* ── AMBIENT GLOW OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* ── HEADER ── */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-red-950/30 border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-red-400" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Gem className="w-8 h-8 text-amber-400" />
            </motion.div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 via-amber-400 to-green-400 bg-clip-text text-transparent">
                DEGEN'S CASINO
              </h1>
              <p className="text-xs text-amber-400/60 font-mono tracking-widest uppercase">
                Christmas in July — Season of Giving
              </p>
            </div>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-display text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? tab.id === "charity"
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10"
                    : "bg-red-500/20 border border-red-500/40 text-red-300 shadow-lg shadow-red-500/10"
                  : "bg-gray-900/50 border border-gray-700/30 text-gray-400 hover:text-gray-200 hover:border-gray-600/40"
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* ══════════ TAB 1: THE FLOOR ══════════ */}
            {activeTab === "floor" && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <motion.div
                  className="casino-panel rounded-2xl bg-gradient-to-r from-red-950/40 via-gray-900/60 to-green-950/40 border border-red-500/20 p-6"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center flex-shrink-0"
                      animate={{ boxShadow: ["0 0 10px rgba(234,179,8,0.2)", "0 0 25px rgba(234,179,8,0.4)", "0 0 10px rgba(234,179,8,0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Gem className="w-8 h-8 text-amber-400" />
                    </motion.div>
                    <div>
                      <h2 className="font-display text-xl text-amber-300 gold-pulse">
                        Welcome to Degen's Casino!
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {isEventActive && degenLines
                          ? degenLines.welcome
                          : "'Tis the season to be degenerate! Spin the wheel, roll the bones, spread some holiday cheer, and help us reach our charity milestones. Every gift counts — 10% of premium purchases go to LCIF."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Festive Tokens", value: festiveTokens, icon: <CircleDollarSign className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-950/20", border: "border-amber-500/20" },
                    { label: "Gifts Sent",     value: giftsSent,     icon: <Gift className="w-5 h-5" />,             color: "text-red-400",   bg: "bg-red-950/20",   border: "border-red-500/20" },
                    { label: "Gifts Received",  value: giftsReceived, icon: <Package className="w-5 h-5" />,          color: "text-green-400", bg: "bg-green-950/20", border: "border-green-500/20" },
                    { label: "Days Remaining",  value: daysRemaining, icon: <Timer className="w-5 h-5" />,            color: "text-red-300",   bg: "bg-red-950/20",   border: "border-red-500/20" },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-xl p-4 text-center`}>
                      <div className={`${stat.color} flex justify-center mb-1`}>{stat.icon}</div>
                      <div className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Daily free tokens claim */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={() => claimTokensMut.mutate()}
                    disabled={claimTokensMut.isPending}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border border-amber-400/40 text-amber-200 font-display tracking-wider disabled:opacity-50"
                  >
                    {claimTokensMut.isPending ? "Claiming..." : "Claim 10 Free Festive Tokens"}
                  </motion.button>
                </div>
                {claimTokensMut.isError && (
                  <p className="text-center text-xs text-red-400/80 font-mono">{claimTokensMut.error?.message}</p>
                )}

                {/* Quick gift dispatcher + inbox + holiday rewards */}
                <GiftSendBar />
                <GiftInbox userId={progress?.userId ?? 0} />
                <RewardsPanel />

                {/* Quick Access Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Naughty or Nice Wheel", icon: <RotateCw className="w-6 h-6" />, tab: "wheel" as Tab,    color: "text-red-400",   bg: "from-red-950/30 to-red-900/10",   border: "border-red-500/20" },
                    { label: "Soul Stone Craps",      icon: <Dice5 className="w-6 h-6" />,    tab: "craps" as Tab,    color: "text-green-400", bg: "from-green-950/30 to-green-900/10", border: "border-green-500/20" },
                    { label: "Gift Exchange",          icon: <Gift className="w-6 h-6" />,     tab: "charity" as Tab,  color: "text-amber-400", bg: "from-amber-950/30 to-amber-900/10", border: "border-amber-500/20" },
                    { label: "12 Days Calendar",       icon: <Calendar className="w-6 h-6" />, tab: "calendar" as Tab, color: "text-red-300",   bg: "from-red-950/30 to-red-900/10",   border: "border-red-500/20" },
                  ].map((game) => (
                    <motion.button
                      key={game.label}
                      onClick={() => setActiveTab(game.tab)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`bg-gradient-to-b ${game.bg} ${game.border} border rounded-xl p-5 text-center transition-all hover:shadow-lg`}
                    >
                      <div className={`${game.color} flex justify-center mb-3`}>{game.icon}</div>
                      <div className="font-display text-sm text-gray-200">{game.label}</div>
                      <ArrowRight className="w-3 h-3 text-gray-600 mx-auto mt-2" />
                    </motion.button>
                  ))}
                </div>

                {/* Community Charity Thermometer (compact) */}
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="font-display text-amber-300">Community Charity Thermometer</span>
                    </div>
                    <span className="font-mono text-sm text-amber-400">
                      {animatedGifts.toLocaleString()} / 250,000
                    </span>
                  </div>
                  <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700/30">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((communityGifts / 250000) * 100, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    {MILESTONES.map((m) => (
                      <span key={m.name} className={communityGifts >= m.threshold ? "text-amber-400" : ""}>
                        {(m.threshold / 1000).toFixed(0)}k
                      </span>
                    ))}
                  </div>
                </div>

                {/* The Giving Tree */}
                <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-5 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <TreePine className="w-16 h-16 text-green-400 mx-auto mb-3" />
                  </motion.div>
                  <h3 className="font-display text-lg text-green-300 mb-1">The Giving Tree</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Community gifts to fill the tree. Every gift adds an ornament!
                  </p>
                  <div className="max-w-sm mx-auto">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-400 font-mono">{treeGifts.toLocaleString()} gifts</span>
                      <span className="text-gray-500 font-mono">{treeGoal.toLocaleString()} goal</span>
                    </div>
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700/30">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${treeProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-green-400/60 mt-2 font-mono uppercase tracking-wider">
                      {treeProgress >= 100 ? "TREE FILLED! 🎄" : `Fill the Tree — ${treeProgress.toFixed(1)}%`}
                    </p>
                  </div>
                </div>
              </div>
            )}


            {/* ══════════ TAB 2: NAUGHTY OR NICE WHEEL ══════════ */}
            {activeTab === "wheel" && (
              <div className="space-y-6">
                <div className="casino-panel bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
                  <h2 className="font-display text-xl text-red-300 text-center mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Naughty or Nice Wheel
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </h2>

                  {/* Wheel + Pointer */}
                  <div className="flex flex-col items-center mb-6">
                    {/* Pointer */}
                    <div className="relative z-10 mb-[-12px]">
                      <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-amber-400" />
                    </div>

                    {/* Wheel */}
                    <div className="relative w-72 h-72 md:w-80 md:h-80">
                      <motion.div
                        ref={wheelRef}
                        className="w-full h-full rounded-full border-4 border-amber-500/40 shadow-2xl shadow-amber-500/10 relative overflow-hidden"
                        animate={{ rotate: wheelRotation }}
                        transition={{
                          duration: spinning ? 3.5 : 0,
                          ease: spinning ? [0.2, 0.8, 0.3, 1] : "linear",
                        }}
                      >
                        {WHEEL_PRIZES.map((prize, i) => {
                          const angle = (360 / WHEEL_PRIZES.length) * i;
                          const skew = 90 - 360 / WHEEL_PRIZES.length;
                          return (
                            <div
                              key={i}
                              className="absolute w-1/2 h-1/2 origin-bottom-right"
                              style={{
                                transform: `rotate(${angle}deg) skewY(${-skew}deg)`,
                                top: 0,
                                right: "50%",
                              }}
                            >
                              <div
                                className="w-full h-full opacity-80"
                                style={{ backgroundColor: prize.color }}
                              />
                            </div>
                          );
                        })}
                        {/* Center hub */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-amber-500/60 flex items-center justify-center shadow-lg">
                            <Gem className="w-6 h-6 text-amber-400" />
                          </div>
                        </div>
                        {/* Prize labels */}
                        {WHEEL_PRIZES.map((prize, i) => {
                          const angle = (360 / WHEEL_PRIZES.length) * i + 360 / WHEEL_PRIZES.length / 2;
                          const rad = (angle * Math.PI) / 180;
                          const r = 100;
                          const x = 50 + r * Math.sin(rad) * 0.32;
                          const y = 50 - r * Math.cos(rad) * 0.32;
                          return (
                            <div
                              key={`label-${i}`}
                              className="absolute text-[8px] font-bold text-white/90 pointer-events-none"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                              }}
                            >
                              {prize.label}
                            </div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </div>

                  {/* Spin Button */}
                  <div className="text-center mb-6">
                    <motion.button
                      onClick={spinWheel}
                      disabled={spinning || festiveTokens < 5}
                      whileHover={{ scale: spinning ? 1 : 1.05 }}
                      whileTap={{ scale: spinning ? 1 : 0.95 }}
                      className={`px-8 py-3 rounded-xl font-display text-lg transition-all ${
                        spinning
                          ? "bg-gray-700/50 border border-gray-600/30 text-gray-500 cursor-wait"
                          : festiveTokens < 5
                          ? "bg-gray-800/50 border border-gray-700/30 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-600 to-green-600 border border-amber-500/30 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                      }`}
                    >
                      {spinning ? (
                        <span className="flex items-center gap-2">
                          <RotateCw className="w-5 h-5 animate-spin" /> Spinning...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" /> SPIN — 5 Tokens
                        </span>
                      )}
                    </motion.button>
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      Balance: {festiveTokens} Festive Tokens
                    </p>
                  </div>

                  {/* Prize Result */}
                  <AnimatePresence>
                    {result && !spinning && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center mb-6 p-4 rounded-xl bg-gray-900/60 border border-amber-500/30"
                      >
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">You Won</p>
                        <p className={`font-display text-2xl ${rarityColor[result.rarity]}`}>
                          {result.label}
                        </p>
                        <span className={`text-xs font-mono ${rarityColor[result.rarity]} opacity-60 uppercase`}>
                          {result.rarity}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Spin History */}
                  {history.length > 0 && (
                    <div>
                      <h3 className="text-sm font-display text-gray-400 mb-2">Recent Spins</h3>
                      <div className="flex gap-2 flex-wrap">
                        {history.map((h, i) => (
                          <span
                            key={i}
                            className={`text-xs px-3 py-1.5 rounded-full border ${
                              h.rarity === "legendary"
                                ? "bg-amber-950/30 border-amber-500/30 text-amber-400"
                                : h.rarity === "rare"
                                ? "bg-blue-950/30 border-blue-500/30 text-blue-400"
                                : "bg-gray-900/50 border-gray-700/30 text-gray-400"
                            } font-mono`}
                          >
                            {h.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* ══════════ TAB 3: SOUL STONE CRAPS ══════════ */}
            {activeTab === "craps" && (
              <div className="space-y-6">
                <div className="casino-panel bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
                  <h2 className="font-display text-xl text-green-300 text-center mb-6 flex items-center justify-center gap-2">
                    <Gem className="w-5 h-5 text-amber-400" />
                    Soul Stone Craps
                    <Gem className="w-5 h-5 text-amber-400" />
                  </h2>

                  {/* Dice Display */}
                  <div className="flex justify-center gap-8 mb-8">
                    {dice.map((d, i) => {
                      const DieIcon = DICE_ICONS[d - 1];
                      return (
                        <motion.div
                          key={i}
                          animate={rolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : { rotate: 0 }}
                          transition={rolling ? { duration: 0.3, repeat: Infinity } : { duration: 0.3 }}
                          className="w-24 h-24 md:w-28 md:h-28 bg-gray-900/80 border-2 border-green-500/30 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/10"
                        >
                          <DieIcon className={`w-14 h-14 ${rolling ? "text-green-300" : "text-white"}`} />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Stone Selection */}
                  <div className="mb-6 text-center">
                    <p className="text-sm text-gray-400 mb-3">Select a Soul Stone to wager:</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {(["violet", "red", "gold"] as const).map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => setSelectedStone(color)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg border font-mono text-sm transition-all ${
                            selectedStone === color
                              ? color === "violet"
                                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                                : color === "red"
                                ? "bg-red-500/20 border-red-500/40 text-red-300"
                                : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                              : "bg-gray-900/50 border-gray-700/30 text-gray-500"
                          }`}
                        >
                          <Gem className="w-4 h-4 inline mr-1" />
                          {color.charAt(0).toUpperCase() + color.slice(1)} Stone
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Roll Button */}
                  <div className="text-center mb-6">
                    <motion.button
                      onClick={rollDice}
                      disabled={rolling || !selectedStone}
                      whileHover={{ scale: rolling ? 1 : 1.05 }}
                      whileTap={{ scale: rolling ? 1 : 0.95 }}
                      className={`px-8 py-3 rounded-xl font-display text-lg transition-all ${
                        rolling
                          ? "bg-gray-700/50 border border-gray-600/30 text-gray-500 cursor-wait"
                          : !selectedStone
                          ? "bg-gray-800/50 border border-gray-700/30 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-700 to-green-600 border border-green-500/30 text-white shadow-lg shadow-green-500/20"
                      }`}
                    >
                      {rolling ? (
                        <span className="flex items-center gap-2">
                          <Dice5 className="w-5 h-5 animate-bounce" /> Rolling...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Flame className="w-5 h-5" /> ROLL — 1 Soul Stone
                        </span>
                      )}
                    </motion.button>
                    {!selectedStone && !rolling && (
                      <p className="text-xs text-gray-600 mt-2">Select a stone to wager</p>
                    )}
                  </div>

                  {/* Result + Commentary */}
                  <AnimatePresence>
                    {crapsResult && !rolling && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center mb-6 p-4 rounded-xl bg-gray-900/60 border border-green-500/20"
                      >
                        <p className={`font-display text-xl ${
                          crapsResult.includes("win") || crapsResult.includes("JACKPOT")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}>
                          {crapsResult}
                        </p>
                        <p className="text-sm text-amber-400/80 italic mt-2">
                          "{crapsCommentary}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Craps Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Stones Wagered",  value: stonesWagered,       color: "text-purple-400" },
                      { label: "Stones Won",       value: stonesWon,           color: "text-green-400" },
                      { label: "Blessed",          value: blessedPurifications, color: "text-amber-400" },
                      { label: "Community Pool",   value: communityPool,       color: "text-red-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-900/40 border border-gray-700/20 rounded-lg p-3 text-center">
                        <div className={`font-mono text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* ══════════ TAB 4: TWELVE DAYS OF DEGENMAS ══════════ */}
            {activeTab === "calendar" && (
              <div className="space-y-6">
                <div className="casino-panel bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
                  <h2 className="font-display text-xl text-red-300 text-center mb-2 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    Twelve Days of Degenmas
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </h2>
                  <p className="text-center text-sm text-gray-400 mb-4">
                    Complete daily challenges for rewards. Consecutive streaks multiply bonuses!
                  </p>

                  {/* Streak Indicator */}
                  <div className="flex items-center justify-center gap-3 mb-6 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span className="font-display text-amber-300">Current Streak:</span>
                    <span className="font-mono text-2xl font-bold text-amber-400">{streak}</span>
                    <span className="text-sm text-gray-400">days</span>
                    {streak >= 3 && (
                      <span className="text-xs px-2 py-0.5 bg-amber-500/20 rounded-full text-amber-300 border border-amber-500/30 font-mono">
                        x{Math.min(streak, 7)} BONUS
                      </span>
                    )}
                  </div>

                  {/* 14-Day Calendar Grid — 2 rows of 7 */}
                  <div className="grid grid-cols-7 gap-2">
                    {CALENDAR_DAYS.map((day) => {
                      const isCompleted = completedDays.has(day.day);
                      const isCurrent = day.day === currentDay;
                      const isLocked = day.day > currentDay;

                      return (
                        <motion.button
                          key={day.day}
                          onClick={() => {
                            if (isLocked || isCompleted) return;
                            claimChallengeMut.mutate({ day: day.day });
                          }}
                          whileHover={!isLocked ? { scale: 1.05 } : undefined}
                          whileTap={!isLocked ? { scale: 0.95 } : undefined}
                          className={`relative rounded-xl p-2 md:p-3 text-center border transition-all min-h-[80px] flex flex-col items-center justify-center gap-1 ${
                            isCompleted
                              ? "bg-green-950/30 border-green-500/30"
                              : isCurrent
                              ? "bg-red-950/30 border-red-500/40 shadow-lg shadow-red-500/10 ring-1 ring-red-500/20"
                              : isLocked
                              ? "bg-gray-900/30 border-gray-800/20 opacity-40 cursor-not-allowed"
                              : "bg-gray-900/40 border-gray-700/20 hover:border-red-500/30"
                          }`}
                          disabled={isLocked}
                        >
                          {/* Day number */}
                          <span className={`font-mono text-xs ${
                            isCompleted ? "text-green-400" : isCurrent ? "text-red-400" : "text-gray-500"
                          }`}>
                            Day {day.day}
                          </span>

                          {/* Status icon */}
                          {isCompleted ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : isCurrent ? (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              <Star className="w-5 h-5 text-amber-400" />
                            </motion.div>
                          ) : isLocked ? (
                            <Snowflake className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Gift className="w-4 h-4 text-red-400/60" />
                          )}

                          {/* Reward preview */}
                          <span className="text-[9px] text-gray-500 leading-tight hidden md:block">
                            {day.reward.length > 16 ? day.reward.slice(0, 14) + "..." : day.reward}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Current Day Detail */}
                  {CALENDAR_DAYS.find((d) => d.day === currentDay) && (
                    <div className="mt-6 p-4 rounded-xl bg-gray-900/40 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="font-display text-red-300">Today's Challenge — Day {currentDay}</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {CALENDAR_DAYS.find((d) => d.day === currentDay)!.challenge}
                      </p>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-400 font-mono">
                          {CALENDAR_DAYS.find((d) => d.day === currentDay)!.reward}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* ══════════ TAB 5: CHARITY & MILESTONES ══════════ */}
            {activeTab === "charity" && (
              <div className="space-y-6">
                {/* LCIF Banner */}
                <motion.div
                  className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/30 rounded-xl p-4 text-center"
                  animate={{ borderColor: ["rgba(234,179,8,0.3)", "rgba(234,179,8,0.5)", "rgba(234,179,8,0.3)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="font-display text-amber-300">Lions Clubs International Foundation</span>
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-sm text-amber-400/80">
                    10% of all premium purchases during Christmas in July are donated to LCIF
                  </p>
                </motion.div>

                {/* Direct donation widget */}
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
                  <div className="text-center sm:text-left">
                    <p className="font-display text-sm text-amber-300">Donate Festive Tokens</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Each 5 tokens donated counts as +1 community gift toward the next milestone.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[10, 25, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => donateToCharityMut.mutate({ amount })}
                        disabled={donateToCharityMut.isPending || (progress?.festiveTokens ?? 0) < amount}
                        className="px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono text-xs hover:bg-amber-500/30 disabled:opacity-50"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Community Gifts Counter */}
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-mono">
                    Total Community Gifts
                  </p>
                  <motion.div
                    className="font-mono text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-amber-400 to-green-400 bg-clip-text text-transparent"
                    key={animatedGifts}
                  >
                    {animatedGifts.toLocaleString()}
                  </motion.div>
                  <p className="text-sm text-gray-500 mt-2">
                    gifts donated by the community
                  </p>
                </div>

                {/* Large Charity Thermometer */}
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-6">
                  <h2 className="font-display text-xl text-amber-300 text-center mb-6 flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Charity Thermometer
                  </h2>

                  <div className="relative">
                    {/* Thermometer */}
                    <div className="h-8 bg-gray-900 rounded-full overflow-hidden border border-gray-700/30 mb-4">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-green-500 relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((communityGifts / 250000) * 100, 100)}%` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 rounded-full" />
                      </motion.div>
                    </div>

                    {/* Milestone Markers */}
                    <div className="relative h-2 mb-4">
                      {MILESTONES.map((m) => (
                        <div
                          key={m.name}
                          className="absolute top-0 transform -translate-x-1/2"
                          style={{ left: `${(m.threshold / 250000) * 100}%` }}
                        >
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            communityGifts >= m.threshold
                              ? "bg-amber-400 border-amber-300"
                              : "bg-gray-700 border-gray-600"
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestone Cards */}
                  <div className="space-y-3 mt-8">
                    {MILESTONES.map((milestone, idx) => {
                      const reached = communityGifts >= milestone.threshold;
                      const progress = Math.min((communityGifts / milestone.threshold) * 100, 100);

                      return (
                        <motion.div
                          key={milestone.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`rounded-xl p-4 border transition-all ${
                            reached
                              ? "bg-green-950/20 border-green-500/30"
                              : "bg-gray-900/40 border-gray-700/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                reached
                                  ? "bg-green-500/20 border border-green-500/30"
                                  : "bg-gray-800/50 border border-gray-700/30"
                              }`}>
                                {reached ? (
                                  <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Target className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <h3 className={`font-display text-sm ${reached ? "text-green-300" : "text-gray-300"}`}>
                                  {milestone.name}
                                </h3>
                                <p className="text-xs text-gray-500 font-mono">
                                  {milestone.threshold.toLocaleString()} gifts
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-amber-400 font-mono">{milestone.reward}</p>
                              <p className="text-xs text-red-400/60 mt-1">
                                LCIF: {milestone.lcifDonation}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar per milestone */}
                          {!reached && (
                            <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}


          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
