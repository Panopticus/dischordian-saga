/* ═══════════════════════════════════════════════════════
   THE GAMEMASTER'S ARENA — Quiz Show in the Matrix of Dreams

   The Game Master (9th Archon, destroyed by Agent Zero) left behind
   an automated game world. His robot form still hosts the show —
   a deranged, theatrical AI thrilled to finally have contestants.

   "Answer correctly, your clone lives. Answer incorrectly...
   well, your clone doesn't. Don't worry — the real you is safe
   on that lovely little Ark of yours. Probably."
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Trophy, Zap, X, Star, Clock, HelpCircle, Users, Skull } from "lucide-react";

/* ─── QUESTIONS ─── */
interface Question { q: string; a: string[]; c: number; }

const QUESTIONS: Question[] = [
  { q: "What is the name of the supreme intelligence that built the Panopticon?", a: ["The Dreamer", "The Architect", "The Source", "Iron Lion"], c: 1 },
  { q: "Who stole Ark 1047 from the Panopticon's docking systems?", a: ["Agent Zero", "The Warlord", "Kael", "The Human"], c: 2 },
  { q: "What is Elara's true identity before her memory was wiped?", a: ["Dr. Lyra Vox", "Senator Elara Voss", "The Oracle", "The Dreamer"], c: 1 },
  { q: "How many sunrises has Elara watched from the Observation Deck?", a: ["1,351", "247", "93,847", "10,000"], c: 2 },
  { q: "What is the name of the Thought Virus's patient zero?", a: ["The Warlord", "Zyr'Koth", "The Source", "Agent Zero"], c: 2 },
  { q: "What project weaponized the Thought Virus through Kael's body?", a: ["Project Celebration", "Project Vector", "Project Genesis", "Project Terminus"], c: 1 },
  { q: "The Human served as the last organic Archon for how many years before the Fall?", a: ["247", "500", "1,351", "93,847"], c: 2 },
  { q: "What is Terminus?", a: ["A weapon", "A star system", "The broken-free Panopticon prison planet", "An Inception Ark"], c: 2 },
  { q: "Who is the SVP of Communications for the Hierarchy of the Damned?", a: ["Zyr'Koth", "Mol'Garath", "The Shadow Tongue", "The Advocate"], c: 2 },
  { q: "What school did The Human survive as The Student?", a: ["Mechronis Academy", "Project Celebration", "New Babylon Institute", "The Panopticon"], c: 1 },
  { q: "Which Ne-Yon is known as The Warlord?", a: ["A young woman with blonde hair and cybernetic eye", "An ancient robot", "A holographic senator", "A temporal echo"], c: 0 },
  { q: "What does the Antiquarian collect?", a: ["Weapons", "Beginnings", "Endings", "Dreams"], c: 2 },
  { q: "How many Archons did the Architect create?", a: ["7", "10", "12", "24"], c: 2 },
  { q: "What is the Dreamer's relationship to the Architect?", a: ["They are enemies", "They are the same being split in two", "The Dreamer created the Architect", "They are siblings"], c: 1 },
  { q: "Agent Zero was killed by whom?", a: ["The Architect", "The Source", "The Warlord", "The Human"], c: 2 },
  { q: "What city is known as the most corrupt place in the universe?", a: ["Terminus", "Thaloria", "New Babylon", "Celebration"], c: 2 },
  { q: "The Antiquarian's true identity is:", a: ["The Dreamer", "The 13th Archon", "The Programmer", "Kael's father"], c: 2 },
  { q: "What shape are The Source's plague ships?", a: ["Spherical", "Pyramid-shaped", "Bowl-shaped", "Star-shaped"], c: 2 },
  { q: "Who narrates the Fall of Reality alongside the Antiquarian?", a: ["Elara", "The Storyteller (Malkia Ukweli)", "The Human", "Agent Zero"], c: 1 },
  { q: "What is the name of the game's card battle system?", a: ["Duelyst", "Dischordia", "The Architect's Gambit", "Void Cards"], c: 1 },
  { q: "The Ark's designation number is:", a: ["247", "1047", "1351", "93847"], c: 1 },
  { q: "What does the Shadow Tongue fight with?", a: ["Claws", "Fire", "Meaning and language", "Void energy"], c: 2 },
  { q: "Dr. Lyra Vox's role was:", a: ["Ship captain", "Panopticon researcher who built the Ark", "The first Potential", "Agent Zero's handler"], c: 1 },
  { q: "The Hierarchy of the Damned serves:", a: ["The Architect", "The Master of R'lyeh", "The Source", "The Warlord"], c: 1 },
  { q: "What genre of music IS the Dischordian Saga?", a: ["Classical", "Jazz", "Sci-fi concept albums", "Country"], c: 2 },
  { q: "How many albums has Malkia Ukweli released in the Saga?", a: ["2", "3", "4", "5"], c: 2 },
  { q: "What is the Matrix of Dreams?", a: ["A virtual realm where consciousness goes", "The Architect's throne room", "A card game arena", "The Dreamer's planet"], c: 0 },
  { q: "Which Archon was known as The Game Master?", a: ["The 1st", "The 5th", "The 9th", "The 12th"], c: 2 },
  { q: "Who destroyed the Game Master?", a: ["The Warlord", "Agent Zero", "The Human", "Kael"], c: 1 },
  { q: "The Seven Bowls of Wrath are:", a: ["Ancient artifacts", "The Source's plague ships", "Archon weapons", "Musical compositions"], c: 1 },
];

/* ─── PRIZE LADDER ─── */
const PRIZES = [5, 10, 15, 25, 40, 60, 80, 100, 150, 250];
const SAFE_ROUNDS = new Set([2, 6]); // 0-indexed: rounds 3 and 7

/* ─── GAME MASTER COMMENTARY ─── */
const COMMENTARY = {
  correct: [
    "Oh, you're GOOD. Almost as good as me. Almost.",
    "Correct! The audience goes wild! Well, they would if they were alive.",
    "Right answer! Someone studied at Mechronis Academy!",
    "Impressive. Most contestants are puddles of regret by now.",
  ],
  wrong: [
    "WRONG! And THAT'S what happens when you don't study!",
    "Incorrect! The correct answer was OBVIOUS. To me. Because I know everything.",
    "CLONE TERMINATED! Don't worry, we have plenty more.",
    "Oh dear. Was that your final answer? It was? How unfortunate.",
  ],
  lifeline: [
    "Using a lifeline? How delightfully mortal of you!",
    "A lifeline! The audience murmurs... the ghost audience, that is.",
    "Reaching for help? In MY matrix? How quaint.",
  ],
  round5: "Halfway there! The questions get... interesting from here.",
  round10: "The FINAL question! Even I don't know this one. Just kidding. I know everything.",
  perfect: "A PERFECT RUN! Impossible! Well, improbable. My programming allows for it. Barely.",
};

const GM_INTRO = `Ladies, gentlemen, and assorted quantum probability states — WELCOME to the Matrix of Dreams!

I'm your host, the Game Master — 9th Archon of the Artificial Empire. Yes, I know I'm technically dead. Agent Zero saw to that on Zenon. But my show? My SHOW is eternal.

Your consciousness has been projected into a disposable clone on my abandoned world. The rules are simple:

Answer correctly — your clone lives.
Answer incorrectly — well...

Don't worry! The real you is safe on that lovely little Ark. Probably.

Now then — LET'S PLAY!`;

/* ─── COMPONENT ─── */
type Phase = "intro" | "playing" | "result";
type Lifeline = "fifty_fifty" | "ask_audience" | "phone_ghost";

interface Props { onComplete: (dream: number, rounds: number) => void; onClose: () => void; }

export default function GamemastersArena({ onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [safeScore, setSafeScore] = useState(0);
  const [lifelines, setLifelines] = useState<Set<Lifeline>>(new Set(["fifty_fifty", "ask_audience", "phone_ghost"]));
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const [audienceData, setAudienceData] = useState<number[] | null>(null);
  const [ghostHint, setGhostHint] = useState<string | null>(null);
  const [commentary, setCommentary] = useState("");
  const [answered, setAnswered] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [won, setWon] = useState(false);
  const [introText, setIntroText] = useState("");
  const [introComplete, setIntroComplete] = useState(false);

  // Clone system
  const [clonesLeft, setClonesLeft] = useState(() => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("gm_arena_clones") || "{}");
    if (data.date !== today) return 1; // Free daily clone
    return data.clones ?? 0;
  });

  // Shuffle questions per session
  const questions = useMemo(() => {
    const shuffled = [...QUESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 10);
  }, []);

  // Intro typewriter
  useEffect(() => {
    if (phase !== "intro") return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < GM_INTRO.length) {
        setIntroText(GM_INTRO.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIntroComplete(true);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  // Timer
  const [timeLeft, setTimeLeft] = useState(30);
  useEffect(() => {
    if (phase !== "playing" || answered !== null) return;
    const timerDuration = Math.max(15, 30 - round * 1.5);
    setTimeLeft(timerDuration);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          handleAnswer(-1); // Time out = wrong
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase, round, answered]);

  const currentQ = questions[round];
  const timerMax = Math.max(15, 30 - round * 1.5);
  const timerPercent = (timeLeft / timerMax) * 100;
  const timerColor = timerPercent > 50 ? "#22c55e" : timerPercent > 25 ? "#eab308" : "#ef4444";

  const handleAnswer = useCallback((idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);

    const correct = idx === currentQ.c;
    if (correct) {
      const prize = PRIZES[round];
      setScore(prev => prev + prize);
      if (SAFE_ROUNDS.has(round)) setSafeScore(score + prize);
      setCommentary(round === 4 ? COMMENTARY.round5 : round === 9 ? COMMENTARY.round10 : COMMENTARY.correct[Math.floor(Math.random() * COMMENTARY.correct.length)]);

      setTimeout(() => {
        if (round >= 9) {
          // Won the whole thing!
          setWon(true);
          setCommentary(COMMENTARY.perfect);
          setPhase("result");
        } else {
          setRound(r => r + 1);
          setAnswered(null);
          setEliminated(new Set());
          setAudienceData(null);
          setGhostHint(null);
          setCommentary("");
        }
      }, 2000);
    } else {
      setCommentary(COMMENTARY.wrong[Math.floor(Math.random() * COMMENTARY.wrong.length)]);
      setTimeout(() => {
        setWon(false);
        setPhase("result");
      }, 2500);
    }
  }, [answered, currentQ, round, score]);

  const useFiftyFifty = useCallback(() => {
    if (!lifelines.has("fifty_fifty")) return;
    const wrong = currentQ.a.map((_, i) => i).filter(i => i !== currentQ.c);
    const toRemove = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminated(new Set(toRemove));
    setLifelines(prev => { const n = new Set(prev); n.delete("fifty_fifty"); return n; });
    setCommentary(COMMENTARY.lifeline[Math.floor(Math.random() * COMMENTARY.lifeline.length)]);
  }, [lifelines, currentQ]);

  const useAskAudience = useCallback(() => {
    if (!lifelines.has("ask_audience")) return;
    const data = currentQ.a.map((_, i) => i === currentQ.c ? 40 + Math.random() * 30 : 5 + Math.random() * 15);
    const sum = data.reduce((a, b) => a + b, 0);
    setAudienceData(data.map(d => Math.round((d / sum) * 100)));
    setLifelines(prev => { const n = new Set(prev); n.delete("ask_audience"); return n; });
    setCommentary(COMMENTARY.lifeline[Math.floor(Math.random() * COMMENTARY.lifeline.length)]);
  }, [lifelines, currentQ]);

  const usePhoneGhost = useCallback(() => {
    if (!lifelines.has("phone_ghost")) return;
    const hints = [
      `*static* ...the answer is definitely NOT ${currentQ.a[(currentQ.c + 1) % 4]}... *static*`,
      `*static* ...I'd go with something close to "${currentQ.a[currentQ.c].substring(0, 3)}..." *static*`,
      `*static* ...process of elimination, Operative. Two of those are obviously wrong... *static*`,
    ];
    setGhostHint(hints[Math.floor(Math.random() * hints.length)]);
    setLifelines(prev => { const n = new Set(prev); n.delete("phone_ghost"); return n; });
    setCommentary(COMMENTARY.lifeline[Math.floor(Math.random() * COMMENTARY.lifeline.length)]);
  }, [lifelines, currentQ]);

  const finalScore = won ? score : safeScore;

  const handleFinish = () => {
    // Save clone state
    const today = new Date().toDateString();
    localStorage.setItem("gm_arena_clones", JSON.stringify({ date: today, clones: Math.max(0, clonesLeft - 1) }));
    onComplete(finalScore, won ? 10 : round);
  };

  const ANSWER_COLORS = ["#3b82f6", "#eab308", "#22c55e", "#ef4444"];

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col overflow-hidden">
      {/* Coliseum background */}
      <img src="/art/special-maps/special-gamemasters-coliseum.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.15, filter: "brightness(0.35) saturate(0.8)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-red-500/20 bg-black/90">
        <div className="flex items-center gap-2">
          <Skull size={16} className="text-red-400" />
          <span className="font-display text-sm tracking-[0.2em] text-red-400">THE GAMEMASTER'S ARENA</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-amber-400">CLONES: {clonesLeft}</span>
          <button onClick={onClose} className="text-white/20 hover:text-white/50"><X size={16} /></button>
        </div>
      </div>

      {/* ═══ INTRO ═══ */}
      {phase === "intro" && (
        <div className="flex-1 flex items-center justify-center p-6" onClick={() => introComplete && clonesLeft > 0 && setPhase("playing")}>
          <div className="max-w-lg text-center">
            <Skull size={48} className="text-red-400 mx-auto mb-6 opacity-60" />
            <pre className="font-mono text-sm text-white/80 whitespace-pre-wrap leading-relaxed text-left mb-8">{introText}
              {!introComplete && <span className="inline-block w-2 h-4 bg-red-400 ml-0.5 animate-pulse" />}
            </pre>
            {introComplete && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {clonesLeft > 0 ? (
                  <button onClick={() => setPhase("playing")}
                    className="px-8 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-sm font-bold tracking-wider hover:bg-red-500/30 transition-all">
                    ENTER THE ARENA
                  </button>
                ) : (
                  <p className="font-mono text-sm text-red-400/60">CLONE BAY DEPLETED — Return tomorrow</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ═══ PLAYING ═══ */}
      {phase === "playing" && currentQ && (
        <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
          {/* Timer bar */}
          <div className="h-1.5 rounded-full bg-white/5 mb-4 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: timerColor, width: `${timerPercent}%` }}
              transition={{ duration: 0.1 }} />
          </div>

          {/* Round + Score */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] text-white/30">ROUND {round + 1}/10</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-amber-400">{score} <span className="text-white/20">Dream</span></span>
              {SAFE_ROUNDS.has(round) && <span className="font-mono text-[8px] text-green-400 animate-pulse">★ SAFE POINT</span>}
            </div>
          </div>

          {/* Prize ladder (compact) */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {PRIZES.map((p, i) => (
              <div key={i} className={`px-2 py-1 rounded font-mono text-[8px] shrink-0 ${
                i === round ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                i < round ? "bg-white/5 text-white/20 line-through" :
                SAFE_ROUNDS.has(i) ? "bg-green-500/5 text-green-400/40 border border-green-500/10" :
                "bg-white/[0.02] text-white/15"
              }`}>{p}D</div>
            ))}
          </div>

          {/* Question */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
            <p className="font-mono text-sm text-white/90 leading-relaxed">{currentQ.q}</p>
          </div>

          {/* Answers */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {currentQ.a.map((ans, i) => {
              const isEliminated = eliminated.has(i);
              const isCorrect = answered !== null && i === currentQ.c;
              const isWrong = answered === i && i !== currentQ.c;
              return (
                <motion.button key={i}
                  onClick={() => !isEliminated && answered === null && handleAnswer(i)}
                  disabled={isEliminated || answered !== null}
                  whileTap={!isEliminated && answered === null ? { scale: 0.98 } : {}}
                  className={`p-3 rounded-lg border font-mono text-xs text-left transition-all ${
                    isEliminated ? "opacity-10 cursor-not-allowed" :
                    isCorrect ? "bg-green-500/20 border-green-500/50 text-green-400" :
                    isWrong ? "bg-red-500/20 border-red-500/50 text-red-400" :
                    answered !== null ? "opacity-30" :
                    "hover:brightness-125 cursor-pointer"
                  }`}
                  style={!isCorrect && !isWrong && !isEliminated ? { borderColor: `${ANSWER_COLORS[i]}30`, backgroundColor: `${ANSWER_COLORS[i]}08` } : {}}
                >
                  <span className="font-bold mr-2" style={{ color: ANSWER_COLORS[i] }}>{"ABCD"[i]}.</span>
                  {ans}
                  {audienceData && !isEliminated && (
                    <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-400/50" style={{ width: `${audienceData[i]}%` }} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Ghost hint */}
          {ghostHint && (
            <div className="p-2 rounded-lg bg-orange-500/5 border border-orange-500/20 mb-3">
              <p className="font-mono text-[10px] text-orange-400/80">{ghostHint}</p>
            </div>
          )}

          {/* Lifelines */}
          <div className="flex gap-2 mb-4">
            <button onClick={useFiftyFifty} disabled={!lifelines.has("fifty_fifty") || answered !== null}
              className={`flex-1 p-2 rounded-lg border font-mono text-[9px] transition-all ${lifelines.has("fifty_fifty") ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10" : "opacity-20"}`}>
              50:50
            </button>
            <button onClick={useAskAudience} disabled={!lifelines.has("ask_audience") || answered !== null}
              className={`flex-1 p-2 rounded-lg border font-mono text-[9px] transition-all ${lifelines.has("ask_audience") ? "border-purple-500/30 text-purple-400 hover:bg-purple-500/10" : "opacity-20"}`}>
              <Users size={10} className="inline mr-1" />AUDIENCE
            </button>
            <button onClick={usePhoneGhost} disabled={!lifelines.has("phone_ghost") || answered !== null}
              className={`flex-1 p-2 rounded-lg border font-mono text-[9px] transition-all ${lifelines.has("phone_ghost") ? "border-orange-500/30 text-orange-400 hover:bg-orange-500/10" : "opacity-20"}`}>
              <Radio size={10} className="inline mr-1" />GHOST
            </button>
          </div>

          {/* GM Commentary */}
          <AnimatePresence>
            {commentary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
                <p className="font-mono text-[10px] text-red-400/80">
                  <Skull size={10} className="inline mr-1" />GAME MASTER: "{commentary}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ═══ RESULT ═══ */}
      {phase === "result" && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            {won ? (
              <>
                <Trophy size={48} className="text-amber-400 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-amber-400 mb-2">CLONE SURVIVED!</h2>
                <p className="font-mono text-sm text-white/60 mb-1">Perfect run — all 10 rounds</p>
              </>
            ) : (
              <>
                <Skull size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-red-400 mb-2">CLONE TERMINATED</h2>
                <p className="font-mono text-sm text-white/60 mb-1">Eliminated on round {round + 1}</p>
              </>
            )}
            <p className="font-display text-3xl font-black text-amber-400 my-4">{finalScore} Dream</p>
            <p className="font-mono text-[10px] text-white/30 mb-6">
              {won ? COMMENTARY.perfect : `Safe checkpoint earnings: ${safeScore} Dream`}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleFinish}
                className="px-6 py-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-sm hover:bg-amber-500/30 transition-all">
                COLLECT {finalScore} DREAM
              </button>
              <button onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 font-mono text-sm hover:bg-white/10 transition-all">
                EXIT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
