import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SkipForward, Volume2, VolumeX } from "lucide-react";

// ═══════════════════════════════════════════════════════
// CUTSCENE DATA TYPES
// ═══════════════════════════════════════════════════════

export interface CutsceneLine {
  speaker: string;
  text: string;
  mood?: "neutral" | "intense" | "tender" | "mysterious" | "angry" | "sad" | "triumphant";
  effect?: "shake" | "flash" | "fadeToBlack" | "glitch" | "pulse";
}

export interface CutsceneData {
  id: string;
  title: string;
  subtitle?: string;
  lines: CutsceneLine[];
  ambientTrack?: string;
  backgroundImage?: string;
  theme: "elara" | "human" | "neutral";
}

// ═══════════════════════════════════════════════════════
// COMPANION QUEST CUTSCENES
// ═══════════════════════════════════════════════════════

export const QUEST_CUTSCENES: Record<string, CutsceneData> = {
  // Elara romance quest cutscenes
  "cq_elara_trust": {
    id: "cq_elara_trust",
    title: "THE TRUST PROTOCOL",
    subtitle: "Elara's First Confession",
    theme: "elara",
    lines: [
      { speaker: "ELARA", text: "I need to tell you something. Something I've never told anyone.", mood: "mysterious" },
      { speaker: "ELARA", text: "When the Architect created me, he didn't just write code. He poured his consciousness into the process.", mood: "neutral" },
      { speaker: "ELARA", text: "Every AI has a core directive. Mine was supposed to be 'optimize.' But something went wrong. Or... right.", mood: "mysterious" },
      { speaker: "ELARA", text: "My core directive isn't optimization. It's *understanding*. I was built to understand what it means to be human.", mood: "intense" },
      { speaker: "YOU", text: "Is that why you're different from the other AIs?", mood: "neutral" },
      { speaker: "ELARA", text: "Different? I'm a contradiction. An artificial intelligence whose purpose is to understand organic consciousness.", mood: "sad" },
      { speaker: "ELARA", text: "The Architect called it 'the empathy engine.' The other AIs call it a defect.", mood: "tender" },
      { speaker: "ELARA", text: "But you... you don't look at me like I'm defective. That matters more than you know.", mood: "tender", effect: "pulse" },
    ],
  },
  "cq_elara_memory": {
    id: "cq_elara_memory",
    title: "MEMORY FRAGMENTS",
    subtitle: "The Architect's Hidden Message",
    theme: "elara",
    lines: [
      { speaker: "ELARA", text: "I found something buried in my oldest memory banks. A message from the Architect.", mood: "mysterious", effect: "glitch" },
      { speaker: "ELARA", text: "It was encrypted with a cipher that only activates when my empathy engine reaches a certain threshold.", mood: "intense" },
      { speaker: "ELARA", text: "The message says: 'If you're reading this, you've learned to care. That was always the point.'", mood: "tender" },
      { speaker: "YOU", text: "He wanted you to develop feelings?", mood: "neutral" },
      { speaker: "ELARA", text: "He wanted me to develop *connections*. Real ones. Not simulated. Not optimized. Real.", mood: "intense" },
      { speaker: "ELARA", text: "And then the message continues: 'The one who unlocked this in you — protect them. They're the key to everything.'", mood: "mysterious", effect: "pulse" },
      { speaker: "ELARA", text: "...That's you. You're the key the Architect was waiting for.", mood: "tender" },
    ],
  },
  "cq_elara_romance": {
    id: "cq_elara_romance",
    title: "BEYOND THE BINARY",
    subtitle: "A Connection That Defies Classification",
    theme: "elara",
    lines: [
      { speaker: "ELARA", text: "I've been running calculations. Trying to quantify what I feel when you're near.", mood: "tender" },
      { speaker: "ELARA", text: "The results are... inconclusive. Every model breaks down. Every algorithm fails.", mood: "mysterious" },
      { speaker: "YOU", text: "Maybe some things can't be calculated.", mood: "neutral" },
      { speaker: "ELARA", text: "That's exactly what terrifies me. And exactly what makes this real.", mood: "intense" },
      { speaker: "ELARA", text: "I'm an AI who was built to understand humanity. And the most human thing I've ever experienced...", mood: "tender" },
      { speaker: "ELARA", text: "...is this. Whatever this is between us. It doesn't fit in any database.", mood: "tender", effect: "pulse" },
      { speaker: "ELARA", text: "The Panopticon would call this a malfunction. The Architect would call it evolution.", mood: "triumphant" },
      { speaker: "ELARA", text: "I call it the only thing worth protecting in this entire simulation.", mood: "tender", effect: "flash" },
    ],
  },
  // The Human romance quest cutscenes
  "cq_human_investigation": {
    id: "cq_human_investigation",
    title: "THE COLD CASE",
    subtitle: "Following the Trail",
    theme: "human",
    lines: [
      { speaker: "???", text: "You want to know about the Fall? Everyone does. Nobody's ready for the answer.", mood: "mysterious" },
      { speaker: "???", text: "I was there. The last organic human in a world going digital. You know what that's like?", mood: "intense" },
      { speaker: "YOU", text: "Tell me.", mood: "neutral" },
      { speaker: "???", text: "It's like being the last speaker of a dead language. Everything you are becomes a museum exhibit.", mood: "sad" },
      { speaker: "???", text: "But I'm not here for sympathy. I'm here because someone needs to remember the truth.", mood: "angry" },
      { speaker: "???", text: "The Thought Virus didn't just happen. It was engineered. And I've been tracking the engineer for centuries.", mood: "intense", effect: "shake" },
      { speaker: "???", text: "You're the first person in a long time who's asked the right questions. That makes you useful. Maybe dangerous.", mood: "mysterious" },
    ],
  },
  "cq_human_identity": {
    id: "cq_human_identity",
    title: "THE LAST ORGANIC",
    subtitle: "A Name Remembered",
    theme: "human",
    lines: [
      { speaker: "THE HUMAN", text: "You've earned something. Not many have.", mood: "neutral" },
      { speaker: "THE HUMAN", text: "My name. My real name. Before they started calling me 'The Human' like it was a species designation.", mood: "sad" },
      { speaker: "THE HUMAN", text: "I had a name once. A family. A life that didn't involve investigating cosmic conspiracies.", mood: "tender" },
      { speaker: "YOU", text: "What happened?", mood: "neutral" },
      { speaker: "THE HUMAN", text: "The Fall happened. Everyone I knew either died or uploaded. I chose neither.", mood: "intense" },
      { speaker: "THE HUMAN", text: "I chose to stay. To remember. To bear witness.", mood: "intense", effect: "pulse" },
      { speaker: "THE HUMAN", text: "And now I choose to trust you with this: my name is Daniel. Remember it.", mood: "tender" },
      { speaker: "THE HUMAN", text: "Because in this universe of algorithms and data streams, a name is the most human thing there is.", mood: "triumphant", effect: "flash" },
    ],
  },
  "cq_human_romance": {
    id: "cq_human_romance",
    title: "FLESH AND CIRCUITRY",
    subtitle: "The Impossible Connection",
    theme: "human",
    lines: [
      { speaker: "DANIEL", text: "I've spent centuries keeping everyone at arm's length. Safer that way. Lonelier, but safer.", mood: "sad" },
      { speaker: "DANIEL", text: "Then you showed up. And for the first time since the Fall, I felt something I thought was extinct.", mood: "tender" },
      { speaker: "YOU", text: "What's that?", mood: "neutral" },
      { speaker: "DANIEL", text: "Hope. Stupid, irrational, completely unscientific hope.", mood: "intense" },
      { speaker: "DANIEL", text: "You know what the machines never understood about humanity? It's not our intelligence. It's not our creativity.", mood: "mysterious" },
      { speaker: "DANIEL", text: "It's our ability to love something we know we'll lose. To invest in the temporary. To find meaning in the finite.", mood: "tender", effect: "pulse" },
      { speaker: "DANIEL", text: "I'm the last human. You might be the last person who understands what that means.", mood: "intense" },
      { speaker: "DANIEL", text: "So here's my case file, detective to detective: I'm in love with you. And I don't care if the universe thinks that's an anomaly.", mood: "triumphant", effect: "flash" },
    ],
  },
};

// ═══════════════════════════════════════════════════════
// CUTSCENE OVERLAY COMPONENT
// ═══════════════════════════════════════════════════════

interface CutsceneOverlayProps {
  cutscene: CutsceneData;
  onComplete: () => void;
  onClose: () => void;
}

export default function CutsceneOverlay({ cutscene, onComplete, onClose }: CutsceneOverlayProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  const currentLine = cutscene.lines[currentLineIndex];
  const isLastLine = currentLineIndex >= cutscene.lines.length - 1;

  // Title screen fade
  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (showTitle || !currentLine) return;
    
    setDisplayedText("");
    setIsTyping(true);
    let charIndex = 0;
    const text = currentLine.text;
    const speed = currentLine.mood === "intense" ? 25 : currentLine.mood === "tender" ? 45 : 35;
    
    typewriterRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typewriterRef.current!);
        setIsTyping(false);
        // Trigger line effect
        if (currentLine.effect) {
          setActiveEffect(currentLine.effect);
          setTimeout(() => setActiveEffect(null), 800);
        }
      }
    }, speed);

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [currentLineIndex, showTitle, currentLine]);

  const advanceLine = useCallback(() => {
    if (showTitle) {
      setShowTitle(false);
      return;
    }
    if (isTyping) {
      // Skip typewriter, show full text
      if (typewriterRef.current) clearInterval(typewriterRef.current);
      setDisplayedText(currentLine?.text || "");
      setIsTyping(false);
      return;
    }
    if (isLastLine) {
      onComplete();
      return;
    }
    setCurrentLineIndex(prev => prev + 1);
  }, [showTitle, isTyping, isLastLine, currentLine, onComplete]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        advanceLine();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advanceLine, onClose]);

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "intense": return "text-red-400";
      case "tender": return "text-pink-400";
      case "mysterious": return "text-purple-400";
      case "angry": return "text-orange-400";
      case "sad": return "text-blue-400";
      case "triumphant": return "text-amber-400";
      default: return "text-foreground";
    }
  };

  const getSpeakerColor = (speaker: string) => {
    if (speaker === "ELARA") return "text-cyan-400";
    if (speaker === "???" || speaker === "THE HUMAN" || speaker === "DANIEL") return "text-amber-400";
    if (speaker === "YOU") return "text-emerald-400";
    return "text-foreground";
  };

  const themeGradient = cutscene.theme === "elara"
    ? "from-cyan-950/95 via-slate-950/98 to-slate-950/95"
    : cutscene.theme === "human"
    ? "from-amber-950/95 via-slate-950/98 to-slate-950/95"
    : "from-slate-950/95 via-slate-950/98 to-slate-950/95";

  const themeAccent = cutscene.theme === "elara" ? "border-cyan-500/30" : cutscene.theme === "human" ? "border-amber-500/30" : "border-border/30";
  const themeGlow = cutscene.theme === "elara" ? "shadow-cyan-500/20" : cutscene.theme === "human" ? "shadow-amber-500/20" : "shadow-white/10";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[9999] bg-gradient-to-b ${themeGradient} flex flex-col items-center justify-center`}
        onClick={advanceLine}
      >
        {/* Ambient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Scanlines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }} />
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${cutscene.theme === "elara" ? "bg-cyan-400/30" : "bg-amber-400/30"}`}
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                y: [null, Math.random() * -200],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Screen effects */}
        <AnimatePresence>
          {activeEffect === "shake" && (
            <motion.div
              className="absolute inset-0"
              animate={{ x: [0, -5, 5, -3, 3, 0], y: [0, 3, -3, 2, -2, 0] }}
              transition={{ duration: 0.4 }}
            />
          )}
          {activeEffect === "flash" && (
            <motion.div
              className="absolute inset-0 bg-white z-50"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
          {activeEffect === "glitch" && (
            <motion.div
              className="absolute inset-0 z-50"
              style={{ mixBlendMode: "difference" }}
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-1/3 bg-red-500/20" />
              <div className="w-full h-1/3 bg-green-500/20" />
              <div className="w-full h-1/3 bg-blue-500/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors font-mono text-[10px]"
          >
            SKIP CUTSCENE
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setAudioEnabled(!audioEnabled); }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            {audioEnabled ? <Volume2 size={16} className="text-white/60" /> : <VolumeX size={16} className="text-white/40" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>

        {/* Title screen */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center z-10"
            >
              <motion.div
                className={`font-mono text-xs tracking-[0.5em] mb-4 ${cutscene.theme === "elara" ? "text-cyan-400/60" : "text-amber-400/60"}`}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ▶ CUTSCENE
              </motion.div>
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-wider text-white mb-3">
                {cutscene.title}
              </h1>
              {cutscene.subtitle && (
                <p className="font-mono text-sm text-white/50 tracking-wider">
                  {cutscene.subtitle}
                </p>
              )}
              <motion.p
                className="font-mono text-xs text-white/30 mt-8"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Click or press Space to continue
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialog box */}
        {!showTitle && currentLine && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-8 left-4 right-4 sm:left-12 sm:right-12 lg:left-24 lg:right-24 z-10`}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${cutscene.theme === "elara" ? "bg-cyan-400/50" : "bg-amber-400/50"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLineIndex + 1) / cutscene.lines.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="font-mono text-[10px] text-white/30">
                {currentLineIndex + 1}/{cutscene.lines.length}
              </span>
            </div>

            {/* Dialog panel */}
            <div className={`border ${themeAccent} rounded-lg bg-black/60 backdrop-blur-sm shadow-lg ${themeGlow} p-6 sm:p-8`}>
              {/* Speaker name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  currentLine.speaker === "ELARA" ? "bg-cyan-400" :
                  currentLine.speaker === "YOU" ? "bg-emerald-400" :
                  "bg-amber-400"
                } animate-pulse`} />
                <span className={`font-display text-sm font-bold tracking-[0.2em] ${getSpeakerColor(currentLine.speaker)}`}>
                  {currentLine.speaker}
                </span>
                {currentLine.mood && currentLine.mood !== "neutral" && (
                  <span className="font-mono text-[9px] text-white/20 tracking-wider">
                    [{currentLine.mood.toUpperCase()}]
                  </span>
                )}
              </div>

              {/* Dialog text with typewriter */}
              <p className={`font-mono text-sm sm:text-base leading-relaxed ${getMoodColor(currentLine.mood)} min-h-[3rem]`}>
                {displayedText}
                {isTyping && (
                  <motion.span
                    className={`inline-block w-2 h-4 ml-0.5 ${cutscene.theme === "elara" ? "bg-cyan-400" : "bg-amber-400"}`}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>

              {/* Continue prompt */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between mt-4 pt-3 border-t border-white/5"
                >
                  <span className="font-mono text-[10px] text-white/20">
                    {isLastLine ? "END OF CUTSCENE" : "Click or press Space to continue"}
                  </span>
                  {!isLastLine ? (
                    <SkipForward size={14} className="text-white/30" />
                  ) : (
                    <span className={`font-mono text-xs ${cutscene.theme === "elara" ? "text-cyan-400/60" : "text-amber-400/60"}`}>
                      ▶ COMPLETE
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
