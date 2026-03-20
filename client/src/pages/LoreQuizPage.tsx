import { useGameAreaBGM } from "@/contexts/GameAudioContext";
/* ═══════════════════════════════════════════════════════
   LORE QUIZ — Test knowledge of the Dischordian Saga.
   Generates questions from the loredex data with
   gamification XP rewards.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Zap, Trophy, ChevronRight, RotateCcw, CheckCircle2,
  XCircle, ArrowRight, Shield, Star, Clock, Users, MapPin, Swords, Music
} from "lucide-react";
import { toast } from "sonner";

/* ─── QUIZ TYPES ─── */
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: "character" | "faction" | "location" | "song" | "lore";
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
}

type QuizState = "menu" | "playing" | "results";

/* ─── QUESTION GENERATORS ─── */
function generateQuestions(entries: LoredexEntry[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const characters = entries.filter((e) => e.type === "character" && e.affiliation);
  const locations = entries.filter((e) => e.type === "location");
  const factions = entries.filter((e) => e.type === "faction");
  const songs = entries.filter((e) => e.type === "song" && e.album);

  // Helper: get N random items from array
  const pickRandom = <T,>(arr: T[], n: number): T[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };

  // 1. "Which faction does X belong to?"
  characters.forEach((char) => {
    if (!char.affiliation) return;
    const wrongFactions = entries
      .filter((e) => e.type === "faction" && e.name !== char.affiliation)
      .map((e) => e.name);
    if (wrongFactions.length < 3) return;
    const wrong = pickRandom(wrongFactions, 3);
    const options = [...wrong, char.affiliation].sort(() => Math.random() - 0.5);
    questions.push({
      id: `faction-${char.id}`,
      question: `Which faction is ${char.name} affiliated with?`,
      options,
      correctIndex: options.indexOf(char.affiliation),
      category: "character",
      difficulty: "easy",
      explanation: `${char.name} is affiliated with ${char.affiliation}.`,
    });
  });

  // 2. "Which album features the song X?"
  songs.forEach((song) => {
    if (!song.album) return;
    const allAlbums = Array.from(new Set(songs.map((s) => s.album).filter(Boolean))) as string[];
    const wrongAlbums = allAlbums.filter((a) => a !== song.album);
    if (wrongAlbums.length < 3) return;
    const wrong = pickRandom(wrongAlbums, 3);
    const options = [...wrong, song.album].sort(() => Math.random() - 0.5);
    questions.push({
      id: `album-${song.id}`,
      question: `Which album features the song "${song.name}"?`,
      options,
      correctIndex: options.indexOf(song.album!),
      category: "song",
      difficulty: "easy",
      explanation: `"${song.name}" is from the album ${song.album}.`,
    });
  });

  // 3. "What era does X belong to?"
  characters.filter((c) => c.era).forEach((char) => {
    const allEras = Array.from(new Set(characters.map((c) => c.era).filter(Boolean))) as string[];
    const wrongEras = allEras.filter((e) => e !== char.era);
    if (wrongEras.length < 3) return;
    const wrong = pickRandom(wrongEras, 3);
    const options = [...wrong, char.era!].sort(() => Math.random() - 0.5);
    questions.push({
      id: `era-${char.id}`,
      question: `In which era does ${char.name} primarily appear?`,
      options,
      correctIndex: options.indexOf(char.era!),
      category: "lore",
      difficulty: "medium",
      explanation: `${char.name} appears in the ${char.era}.`,
    });
  });

  // 4. "What type of entity is X?"
  const allTypes = ["character", "location", "faction", "concept"];
  entries.filter((e) => allTypes.includes(e.type)).forEach((entry) => {
    const wrongTypes = allTypes.filter((t) => t !== entry.type);
    const options = [...wrongTypes, entry.type].sort(() => Math.random() - 0.5);
    questions.push({
      id: `type-${entry.id}`,
      question: `What type of entity is "${entry.name}"?`,
      options: options.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
      correctIndex: options.indexOf(entry.type),
      category: entry.type as "character" | "faction" | "location",
      difficulty: "easy",
    });
  });

  // 5. Hard: "Which of these is NOT connected to X?"
  entries.filter((e) => e.connections && e.connections.length >= 3).forEach((entry) => {
    const connected = entry.connections!.slice(0, 3);
    const unconnected = entries
      .filter((e) => e.id !== entry.id && !entry.connections!.includes(e.name))
      .map((e) => e.name);
    if (unconnected.length === 0) return;
    const wrongAnswer = pickRandom(unconnected, 1)[0];
    const options = [...connected, wrongAnswer].sort(() => Math.random() - 0.5);
    questions.push({
      id: `notconn-${entry.id}`,
      question: `Which of these is NOT directly connected to ${entry.name}?`,
      options,
      correctIndex: options.indexOf(wrongAnswer),
      category: "lore",
      difficulty: "hard",
      explanation: `${wrongAnswer} is not directly connected to ${entry.name}.`,
    });
  });

  return questions;
}

/* ─── DIFFICULTY CONFIG ─── */
const DIFFICULTY_CONFIG = {
  easy: { questions: 10, timeLimit: 0, xpPerCorrect: 5, label: "RECRUIT", color: "text-[var(--neon-cyan)]", bg: "bg-[var(--neon-cyan)]" },
  medium: { questions: 15, timeLimit: 0, xpPerCorrect: 10, label: "OPERATIVE", color: "text-accent", bg: "bg-accent" },
  hard: { questions: 20, timeLimit: 30, xpPerCorrect: 20, label: "COMMANDER", color: "text-destructive", bg: "bg-destructive" },
};

const CATEGORY_ICONS: Record<string, typeof Brain> = {
  character: Users,
  faction: Swords,
  location: MapPin,
  song: Music,
  lore: Brain,
};

/* ═══ MAIN COMPONENT ═══ */
export default function LoreQuizPage() {
  const { entries } = useLoredex();
  const gamification = useGamification();
  useGameAreaBGM("quiz");
  const [quizState, setQuizState] = useState<QuizState>("menu");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const allQuestions = useMemo(() => generateQuestions(entries), [entries]);

  const quizQuestions = useMemo(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const filtered = difficulty === "easy"
      ? allQuestions.filter((q) => q.difficulty === "easy")
      : difficulty === "medium"
      ? allQuestions.filter((q) => q.difficulty !== "hard")
      : allQuestions;

    return [...filtered].sort(() => Math.random() - 0.5).slice(0, config.questions);
  }, [allQuestions, difficulty, quizState]);

  const config = DIFFICULTY_CONFIG[difficulty];
  const question = quizQuestions[currentQ];

  // Timer for hard mode
  useEffect(() => {
    if (quizState !== "playing" || config.timeLimit === 0 || selectedAnswer !== null) return;
    setTimeLeft(config.timeLimit);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(-1); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ, quizState, selectedAnswer]);

  const handleAnswer = useCallback(
    (answerIdx: number) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(answerIdx);
      const correct = answerIdx === question?.correctIndex;
      setAnswers((prev) => [...prev, correct]);

      if (correct) {
        setScore((s) => s + config.xpPerCorrect);
        setStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          return newStreak;
        });
      } else {
        setStreak(0);
      }

      setShowExplanation(true);
    },
    [selectedAnswer, question, config.xpPerCorrect]
  );

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= quizQuestions.length) {
      setQuizState("results");
      // Award XP
      if (score > 0) {
        toast.success(`+${score} XP earned from Lore Quiz!`, {
          description: `${answers.filter(Boolean).length}/${quizQuestions.length} correct`,
        });
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentQ, quizQuestions.length, score, answers]);

  const startQuiz = useCallback(
    (diff: "easy" | "medium" | "hard") => {
      setDifficulty(diff);
      setQuizState("playing");
      setCurrentQ(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStreak(0);
      setBestStreak(0);
      setAnswers([]);
    },
    []
  );

  const resetQuiz = useCallback(() => {
    setQuizState("menu");
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
  }, []);

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">KNOWLEDGE CHECK // CLASSIFIED</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          LORE <span className="text-primary glow-cyan">QUIZ</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground max-w-2xl">
          Test your knowledge of the Dischordian Saga. Earn XP for correct answers.
        </p>
      </div>

      {/* ═══ MENU ═══ */}
      {quizState === "menu" && (
        <div className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["easy", "medium", "hard"] as const).map((diff) => {
              const cfg = DIFFICULTY_CONFIG[diff];
              return (
                <motion.button
                  key={diff}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => startQuiz(diff)}
                  className="rounded-lg border border-border/30 bg-card/30 p-5 text-left hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={16} className={cfg.color} />
                    <span className={`font-display text-xs font-bold tracking-[0.2em] ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mb-3">
                    {cfg.questions} questions // {cfg.xpPerCorrect} XP each
                    {cfg.timeLimit > 0 && ` // ${cfg.timeLimit}s timer`}
                  </p>
                  <div className="flex items-center gap-1 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                    <span className="font-mono text-[9px]">START</span>
                    <ChevronRight size={10} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="rounded-lg border border-border/20 bg-card/20 p-4">
            <p className="font-mono text-[10px] text-muted-foreground/50 mb-2">AVAILABLE QUESTIONS</p>
            <div className="flex flex-wrap gap-2">
              {(["character", "faction", "location", "song", "lore"] as const).map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                const count = allQuestions.filter((q) => q.category === cat).length;
                return (
                  <div key={cat} className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/30 text-[9px] font-mono text-muted-foreground">
                    <Icon size={9} />
                    {cat.toUpperCase()}: {count}
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-[9px] font-mono text-primary">
                TOTAL: {allQuestions.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PLAYING ═══ */}
      {quizState === "playing" && question && (
        <div className="px-4 sm:px-6 space-y-4">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-secondary/30 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${config.bg}/60`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">
              {currentQ + 1}/{quizQuestions.length}
            </span>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <Zap size={10} className="text-accent" />
              <span className="text-accent">{score} XP</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <Star size={10} className="text-[var(--neon-amber)]" />
                <span className="text-[var(--neon-amber)]">{streak}x STREAK</span>
              </div>
            )}
            {config.timeLimit > 0 && selectedAnswer === null && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono ml-auto">
                <Clock size={10} className={timeLeft <= 5 ? "text-destructive animate-pulse" : "text-muted-foreground"} />
                <span className={timeLeft <= 5 ? "text-destructive" : "text-muted-foreground"}>{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-lg border border-border/30 bg-card/30 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const CatIcon = CATEGORY_ICONS[question.category] || Brain;
                  return <CatIcon size={14} className="text-primary" />;
                })()}
                <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">
                  {question.category.toUpperCase()} // {question.difficulty.toUpperCase()}
                </span>
              </div>

              <h2 className="font-display text-sm sm:text-base font-bold text-foreground mb-5 leading-relaxed">
                {question.question}
              </h2>

              <div className="space-y-2">
                {question.options.map((option, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === question.correctIndex;
                  const showResult = selectedAnswer !== null;

                  let borderClass = "border-border/20 hover:border-primary/30";
                  let bgClass = "bg-secondary/10 hover:bg-secondary/20";

                  if (showResult) {
                    if (isCorrect) {
                      borderClass = "border-green-500/50";
                      bgClass = "bg-green-500/10";
                    } else if (isSelected && !isCorrect) {
                      borderClass = "border-destructive/50";
                      bgClass = "bg-destructive/10";
                    } else {
                      borderClass = "border-border/10";
                      bgClass = "bg-secondary/5 opacity-50";
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`w-full flex items-center gap-3 p-3 rounded-md border ${borderClass} ${bgClass} text-left transition-all`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
                        showResult && isCorrect
                          ? "border-green-500 text-green-500 bg-green-500/10"
                          : showResult && isSelected
                          ? "border-destructive text-destructive bg-destructive/10"
                          : "border-border/30 text-muted-foreground"
                      }`}>
                        {showResult && isCorrect ? (
                          <CheckCircle2 size={14} />
                        ) : showResult && isSelected ? (
                          <XCircle size={14} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </div>
                      <span className="text-xs font-medium">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && question.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-3 rounded-md bg-secondary/20 border border-border/10"
                  >
                    <p className="font-mono text-[10px] text-muted-foreground">{question.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {selectedAnswer !== null && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={nextQuestion}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-mono bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
                >
                  {currentQ + 1 >= quizQuestions.length ? "VIEW RESULTS" : "NEXT QUESTION"}
                  <ArrowRight size={12} />
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ═══ RESULTS ═══ */}
      {quizState === "results" && (
        <div className="px-4 sm:px-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-primary/30 bg-card/30 p-6 text-center"
          >
            <Trophy size={32} className="mx-auto text-accent mb-3" />
            <h2 className="font-display text-xl font-black tracking-wider mb-2">
              QUIZ <span className="text-accent glow-amber">COMPLETE</span>
            </h2>

            <div className="grid grid-cols-3 gap-4 my-6">
              <div>
                <p className="font-display text-2xl font-bold text-primary">{answers.filter(Boolean).length}</p>
                <p className="font-mono text-[9px] text-muted-foreground/50">CORRECT</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-accent">{score}</p>
                <p className="font-mono text-[9px] text-muted-foreground/50">XP EARNED</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[var(--neon-amber)]">{bestStreak}</p>
                <p className="font-mono text-[9px] text-muted-foreground/50">BEST STREAK</p>
              </div>
            </div>

            {/* Score rating */}
            <div className="mb-4">
              {(() => {
                const pct = (answers.filter(Boolean).length / quizQuestions.length) * 100;
                if (pct >= 90) return <p className="font-display text-sm text-primary glow-cyan">CLEARANCE: LEVEL 5 // EXCEPTIONAL</p>;
                if (pct >= 70) return <p className="font-display text-sm text-accent">CLEARANCE: LEVEL 3 // PROFICIENT</p>;
                if (pct >= 50) return <p className="font-display text-sm text-[var(--neon-amber)]">CLEARANCE: LEVEL 2 // ADEQUATE</p>;
                return <p className="font-display text-sm text-destructive">CLEARANCE: LEVEL 1 // NEEDS TRAINING</p>;
              })()}
            </div>

            {/* Answer summary */}
            <div className="flex justify-center gap-1 mb-6">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${correct ? "bg-green-500" : "bg-destructive"}`}
                  title={`Q${i + 1}: ${correct ? "Correct" : "Wrong"}`}
                />
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono bg-secondary/30 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <RotateCcw size={12} /> TRY AGAIN
              </button>
              <Link
                href="/search"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
              >
                STUDY DATABASE <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
