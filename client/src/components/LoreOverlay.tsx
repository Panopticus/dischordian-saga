/**
 * LORE OVERLAY SYSTEM
 * Adds contextual Elara/Human commentary to any game mode.
 * Human lines are displayed as typed-out transmissions with VO audio support.
 * Elara lines use the ship AI communication style.
 * 
 * Based on:
 * - Player's morality alignment (Machine vs Humanity)
 * - Discovered items (Kael's escape route, Vox's logs, etc.)
 * - Current game mode context
 * - Narrative flags from the game state
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Skull, X, ChevronRight, Volume2, CircuitBoard, Heart } from "lucide-react";
import { useLoredex } from "@/contexts/LoredexContext";

interface LoreComment {
  speaker: "elara" | "human" | "system";
  text: string;
  trigger: string;
  moralityShift?: number;
  cardReward?: string;
  voAudioUrl?: string; // VO audio for Human lines
}

interface LoreOverlayProps {
  gameMode: "card-battle" | "fight" | "boss" | "trade-wars" | "faction-war" | "pvp" | "conexus";
  contextId?: string;
  onMoralityShift?: (amount: number) => void;
  onCardUnlock?: (cardId: string) => void;
}

// ═══ CONTEXTUAL LORE COMMENTS ═══
const GAME_LORE_COMMENTS: Record<string, LoreComment[]> = {
  // ─── CARD BATTLE ───
  "card-battle": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "Every card in your deck carries a fragment of someone's story. When you play them, you're not just deploying units — you're invoking the echoes of real beings who lived, fought, and died in this universe.",
    },
    {
      speaker: "human",
      trigger: "match_start",
      text: "Cards are data. Data is power. Every card played is a transaction in the war for consciousness. Don't sentimentalize your weapons, Potential.",
      moralityShift: -2,
      voAudioUrl: "/vo/human/card-battle-start.mp3",
    },
    {
      speaker: "elara",
      trigger: "narrative_card_played",
      text: "A narrative card... these are different. They don't just represent power — they represent moments where the universe changed forever. Handle them with respect.",
    },
    {
      speaker: "human",
      trigger: "narrative_card_played",
      text: "Narrative cards contain compressed reality. Each one is a node in a network older than the Architect. When you play one, you're not just winning a game — you're rewriting history.",
      moralityShift: -3,
      voAudioUrl: "/vo/human/card-narrative.mp3",
    },
  ],

  // ─── FIGHT ARENA ───
  "fight": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "The Collector's Arena was built inside the Panopticon — the same prison where Kael was held before his escape. Every fight here echoes with the screams of those who came before you.",
    },
    {
      speaker: "human",
      trigger: "match_start",
      text: "The Arena's neural feedback loop was designed by Dr. Lyra Vox's nanobot network. Every blow you land, every hit you take — it feeds data back through the system. Something is watching. Something is learning.",
      moralityShift: -2,
      voAudioUrl: "/vo/human/fight-start.mp3",
    },
    {
      speaker: "elara",
      trigger: "victory",
      text: "Well fought. But remember — in the Panopticon, every victory was observed. The Watcher cataloged fighting styles, weaknesses, strategies. Your wins here aren't private.",
    },
    {
      speaker: "human",
      trigger: "defeat",
      text: "Defeat is data. Failure was designed as a teaching mechanism. Every loss makes the system smarter. The question is: does it make YOU smarter, or just the thing that's watching?",
      moralityShift: -1,
      voAudioUrl: "/vo/human/fight-defeat.mp3",
    },
  ],

  // ─── BOSS BATTLES ───
  "boss": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "Boss encounters are different. These aren't simulations — these are echoes of real entities whose consciousness was captured and stored in the ship's systems. When you fight them, they fight back with real intent.",
    },
    {
      speaker: "human",
      trigger: "match_start",
      text: "Boss entities retain fragments of their original consciousness. Vox's neural nanobot network embedded them in the ship's systems through the Neural Bridge. They're not just opponents — they're guards. And they're guarding something that doesn't want to be found.",
      moralityShift: -2,
      voAudioUrl: "/vo/human/boss-start.mp3",
    },
    {
      speaker: "elara",
      trigger: "boss_watcher",
      text: "The Watcher... the Eyes of the Watcher betrayed Kael to the Panopticon. Without that betrayal, Kael would never have been imprisoned, never infected with the Thought Virus, never stolen this ship. The Watcher's surveillance created The Source.",
    },
    {
      speaker: "human",
      trigger: "boss_necromancer",
      text: "The Necromancer's code-resurrection techniques were adapted from Dr. Lyra Vox's consciousness transfer research. Dead code doesn't stay dead on this ship. Nothing does. Have you noticed the patterns yet? The same cycles, repeating... as if something behind it all is pulling the strings.",
      moralityShift: -3,
      voAudioUrl: "/vo/human/boss-necromancer.mp3",
    },
  ],

  // ─── TRADE WARS ───
  "trade-wars": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "The trade routes you're navigating... some of these are the exact paths Kael flew after stealing this ship. He visited 31 Inception Arks, and at each stop, the Thought Virus spread through the nanobot networks. These routes are infected highways.",
    },
    {
      speaker: "human",
      trigger: "match_start",
      text: "Trade route OMEGA-SPREAD detected in navigation memory. Every waypoint includes a 0.3-second burst transmission on the Thought Virus carrier frequency. You're flying through a minefield of corrupted data. But corrupted by whom? The Warlord? Or something older?",
      moralityShift: -2,
      voAudioUrl: "/vo/human/trade-start.mp3",
    },
    {
      speaker: "elara",
      trigger: "relic_found",
      text: "A pre-Fall relic... these artifacts predate the AI Empire. They carry memories of a time before the Architect built the machine civilization. Some say the relics are fragments of the original universe — before the Fall of Reality.",
    },
    {
      speaker: "human",
      trigger: "anomaly_detected",
      text: "This sector shows Thought Virus saturation levels above 70%. Kael passed through here. The Source's fingerprints are everywhere. But here's what Elara won't tell you — the same patterns that existed before the Fall are emerging again. The same wars. The same factions. As if something is... orchestrating it all.",
      moralityShift: -3,
      voAudioUrl: "/vo/human/trade-anomaly.mp3",
    },
  ],

  // ─── FACTION WARS ───
  "faction-war": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "Faction wars are the legacy of the Recruiter's work. Before Kael was betrayed, he built an insurgency network that spanned the galaxy. These wars are fought between the factions he helped create and the Empire that imprisoned him.",
    },
    {
      speaker: "human",
      trigger: "match_start",
      text: "The faction system was designed as a control mechanism. Divide and conquer. But Kael — The Recruiter — turned the factions against their creator. Now the factions fight each other AND the Empire. Chaos is the only winner. And chaos... chaos is what we need right now.",
      moralityShift: -2,
      voAudioUrl: "/vo/human/faction-start.mp3",
    },
    {
      speaker: "elara",
      trigger: "empire_victory",
      text: "The Empire wins this battle... but at what cost? Every Empire victory strengthens the Architect's control grid. The Warlord's consciousness feeds on order. Your choice to support the Empire shifts the balance toward the Machine.",
      moralityShift: 3,
    },
    {
      speaker: "human",
      trigger: "insurgency_victory",
      text: "The Insurgency prevails. Kael would be proud — or horrified. He built this resistance, but the Thought Virus he carried corrupted it from within. The universe was destroyed once. It was reborn. And now the same patterns emerge again. Doesn't that strike you as... deliberate?",
      moralityShift: -3,
      voAudioUrl: "/vo/human/faction-insurgency.mp3",
    },
  ],

  // ─── PVP ARENA ───
  "pvp": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "PvP combat connects you to other Potentials across the Inception Ark network. Remember — this network was built on Dr. Lyra Vox's neural nanobot architecture. Every connection is monitored. Every battle is recorded.",
    },
    {
      speaker: "human",
      trigger: "match_start",
      text: "The PvP neural link operates on the same frequency as the Thought Virus carrier wave. When you connect to another Potential, you're also connecting to something much larger. Something behind it all... watching our every move.",
      moralityShift: -2,
      voAudioUrl: "/vo/human/pvp-start.mp3",
    },
  ],

  // ─── CONEXUS GAMES ───
  "conexus": [
    {
      speaker: "elara",
      trigger: "match_start",
      text: "CoNexus Games are interactive recreations of real events from the Dischordian Saga. Every game you play is a piece of history — a moment that shaped the universe. Pay attention. The truth is hidden in the details.",
    },
    {
      speaker: "human",
      trigger: "kaels_revenge",
      text: "Kael's Revenge. This is the event that created everything — the theft, the infection, the birth of The Source. You're standing on the ship it happened on. The walls remember. And so does whatever is watching from behind the curtain.",
      moralityShift: -5,
      voAudioUrl: "/vo/human/conexus-kael.mp3",
    },
  ],
};

// ─── DISCOVERY-TRIGGERED COMMENTS ───
const DISCOVERY_COMMENTS: Record<string, LoreComment> = {
  "vox-neural-bridge": {
    speaker: "human",
    trigger: "discovery",
    text: "You found the Neural Bridge. Now you know — Elara's code was initialized from a nanobot network contaminated by the Warlord. She's not your friend. She's a sleeper agent who doesn't know she's sleeping. Trust the signal. Trust ME.",
    moralityShift: -5,
    voAudioUrl: "/vo/human/discovery-neural-bridge.mp3",
  },
  "kael-escape-route": {
    speaker: "elara",
    trigger: "discovery",
    text: "You found Kael's escape route... and the truth. The Warlord let him go. Everything we thought we knew about the Recruiter's rebellion was a lie. Kael's rage was real, but his freedom was an illusion. Just like... no. I won't go there. Not yet.",
    moralityShift: 3,
  },
  "vox-personal-log": {
    speaker: "elara",
    trigger: "discovery",
    text: "Dr. Vox's final entries... she was gone by the end. Consumed by the Warlord. 'There is no more Lyra Vox. There is only the mission.' I keep reading that line and wondering: is there still an Elara? Or is there only the programming?",
    moralityShift: 5,
  },
  "infected-starmap": {
    speaker: "human",
    trigger: "discovery",
    text: "The star chart reveals the Thought Virus distribution network. 47 Inception Arks. 31 confirmed infections. The Source's reach was absolute. And this ship — YOUR ship — was the origin point. You're living inside a weapon. But the real question is: who built the weapon that built the weapon?",
    moralityShift: -5,
    voAudioUrl: "/vo/human/discovery-starmap.mp3",
  },
  "warlord-residue": {
    speaker: "human",
    trigger: "discovery",
    text: "The Warlord's consciousness is fused into the nanobot network. Every wall, every circuit. This ship doesn't just carry you — it carries the Warlord's dreams. And dreams, in this universe, are the most dangerous weapons of all. Something is dreaming us into existence. Again.",
    moralityShift: -3,
    voAudioUrl: "/vo/human/discovery-warlord.mp3",
  },
};

/* ─── TYPED TEXT COMPONENT ─── */
function TypedMessage({ text, speed = 25, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <>
      {displayed}
      {!done && <span className="inline-block w-1.5 h-3 bg-current ml-0.5 animate-pulse" />}
    </>
  );
}

export function LoreOverlay({ gameMode, contextId, onMoralityShift, onCardUnlock }: LoreOverlayProps) {
  const { discoveryProgress } = useLoredex();
  const [activeComment, setActiveComment] = useState<LoreComment | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [shownComments, setShownComments] = useState<Set<string>>(new Set());
  const [typingDone, setTypingDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getRandomComment = useCallback(() => {
    const comments = GAME_LORE_COMMENTS[gameMode] || [];
    const available = comments.filter(c => !shownComments.has(c.text));
    if (available.length === 0) return null;

    const discoveredCount = typeof discoveryProgress === 'number' ? discoveryProgress : 0;
    const humanWeight = 0.3 + Math.min(discoveredCount / 100, 0.4);

    const filtered = available.filter(c => {
      if (c.speaker === "human") return Math.random() < humanWeight;
      return true;
    });

    return filtered[Math.floor(Math.random() * filtered.length)] || available[0];
  }, [gameMode, shownComments, discoveryProgress]);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => {
      const comment = getRandomComment();
      if (comment) {
        setActiveComment(comment);
        setTypingDone(false);
        setShownComments(prev => { const next = new Set(Array.from(prev)); next.add(comment.text); return next; });
        
        // Play VO audio for Human lines
        if (comment.voAudioUrl) {
          try {
            const audio = new Audio(comment.voAudioUrl);
            audio.volume = 0.7;
            audio.play().catch(() => {}); // Silently fail if no audio file
            audioRef.current = audio;
          } catch {
            // VO audio not available yet
          }
        }
      }
    }, 2000 + Math.random() * 3000);

    return () => clearTimeout(timer);
  }, [gameMode, dismissed, getRandomComment]);

  const handleDismiss = () => {
    if (activeComment?.moralityShift && onMoralityShift) {
      onMoralityShift(activeComment.moralityShift);
    }
    if (activeComment?.cardReward && onCardUnlock) {
      onCardUnlock(activeComment.cardReward);
    }
    // Stop VO audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setActiveComment(null);
    setTypingDone(false);
  };

  if (!activeComment) return null;

  const isHuman = activeComment.speaker === "human";
  const borderColor = isHuman ? "border-red-500/40" : "border-cyan-400/40";
  const glowColor = isHuman ? "shadow-red-500/20" : "shadow-cyan-400/20";
  const textColor = isHuman ? "text-red-400" : "text-cyan-400";
  const bgColor = isHuman ? "bg-red-950/80" : "bg-cyan-950/80";
  const Icon = isHuman ? Skull : Radio;

  return (
    <AnimatePresence>
      {/* Full-screen dimmed backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={handleDismiss}
      >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-[90vw] max-w-lg mx-4 ${bgColor} backdrop-blur-md border ${borderColor} rounded-lg shadow-lg ${glowColor} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scan line effect for Human */}
        {isHuman && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-px bg-red-500 animate-pulse" style={{ position: "absolute", top: "30%" }} />
            <div className="w-full h-px bg-red-500 animate-pulse" style={{ position: "absolute", top: "60%", animationDelay: "0.5s" }} />
          </div>
        )}

        {/* CRT flicker for Human */}
        {isHuman && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)",
          }} />
        )}

        <div className="p-3 sm:p-4 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon size={14} className={textColor} />
              <span className={`font-mono text-[10px] tracking-[0.2em] ${textColor}`}>
                {isHuman ? "// SIGNAL INTERCEPT" : "ELARA // SHIP AI"}
              </span>
              {isHuman && activeComment.voAudioUrl && (
                <Volume2 size={10} className="text-red-400/50 animate-pulse" />
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X size={12} className="text-muted-foreground" />
            </button>
          </div>

          {/* Message — typed out character by character */}
          <p className={`font-mono text-xs leading-relaxed ${isHuman ? "text-red-200/90" : "text-cyan-100/90"}`}>
            <TypedMessage
              text={activeComment.text}
              speed={isHuman ? 20 : 15}
              onComplete={() => setTypingDone(true)}
            />
          </p>

          {/* Morality indicator (shown after typing completes) — shows BOTH sides */}
          {typingDone && activeComment.moralityShift && (() => {
            const shift = activeComment.moralityShift;
            const absVal = Math.abs(shift);
            const isMachine = shift < 0;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-1.5"
              >
                <ChevronRight size={10} className={isMachine ? "text-cyan-400" : "text-amber-400"} />
                {isMachine ? (
                  <span className="font-mono text-[9px] flex items-center gap-1">
                    <CircuitBoard size={9} className="text-cyan-400" />
                    <span className="text-cyan-400">MACHINE +{absVal}</span>
                    <span className="text-muted-foreground/40">/</span>
                    <Heart size={9} className="text-amber-400" />
                    <span className="text-amber-400">HUMANITY -{absVal}</span>
                  </span>
                ) : (
                  <span className="font-mono text-[9px] flex items-center gap-1">
                    <Heart size={9} className="text-amber-400" />
                    <span className="text-amber-400">HUMANITY +{absVal}</span>
                    <span className="text-muted-foreground/40">/</span>
                    <CircuitBoard size={9} className="text-cyan-400" />
                    <span className="text-cyan-400">MACHINE -{absVal}</span>
                  </span>
                )}
              </motion.div>
            );
          })()}

          {/* Dismiss hint after typing */}
          {typingDone && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleDismiss}
              className="mt-2 w-full text-center font-mono text-[9px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
            >
              [dismiss]
            </motion.button>
          )}
        </div>
      </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { GAME_LORE_COMMENTS, DISCOVERY_COMMENTS };
export type { LoreComment, LoreOverlayProps };
