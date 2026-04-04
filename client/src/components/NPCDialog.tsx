/* ══════════════════════════════════════════════════���════
   NPC DIALOG — Unified dialog component for all 7 NPCs
   Manifestation-specific visual effects:
   - hologram: cyan scanlines, holographic shimmer
   - comms_signal: static overlay, signal strength bar
   - substrate: glitch distortion, red flicker
   - possessed_system: viral corruption, text rewrites
   - temporal_echo: time-shifted echoes, green glow
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, ChevronRight, Radio, AlertTriangle,
  Shield, Skull, Clock, Eye, Zap, BookOpen,
} from "lucide-react";
import { FACTION_NPCS, type FactionNPCId, type FactionNPC } from "@/game/factionNPCs";
import { useGame } from "@/contexts/GameContext";

/* ─── MANIFESTATION STYLES ─── */

const MANIFESTATION_CONFIG: Record<string, {
  bgClass: string;
  borderClass: string;
  scanlineClass: string;
  textEffect: string;
  icon: typeof Radio;
  label: string;
}> = {
  hologram: {
    bgClass: "bg-cyan-950/90",
    borderClass: "border-cyan-400/30",
    scanlineClass: "bg-gradient-to-b from-cyan-400/5 via-transparent to-cyan-400/5",
    textEffect: "",
    icon: Eye,
    label: "HOLOGRAPHIC LINK",
  },
  comms_signal: {
    bgClass: "bg-gray-950/95",
    borderClass: "border-amber-500/30",
    scanlineClass: "bg-gradient-to-b from-amber-500/3 via-transparent to-amber-500/3",
    textEffect: "tracking-wider",
    icon: Radio,
    label: "ENCRYPTED SIGNAL",
  },
  substrate: {
    bgClass: "bg-red-950/90",
    borderClass: "border-red-500/30",
    scanlineClass: "bg-gradient-to-b from-red-500/5 via-transparent to-red-500/5",
    textEffect: "",
    icon: Zap,
    label: "SUBSTRATE LINK",
  },
  possessed_system: {
    bgClass: "bg-purple-950/90",
    borderClass: "border-purple-500/30",
    scanlineClass: "bg-gradient-to-b from-purple-500/5 via-transparent to-purple-500/5",
    textEffect: "",
    icon: Skull,
    label: "CORRUPTED CHANNEL",
  },
  temporal_echo: {
    bgClass: "bg-emerald-950/90",
    borderClass: "border-emerald-400/30",
    scanlineClass: "bg-gradient-to-b from-emerald-400/5 via-transparent to-emerald-400/5",
    textEffect: "",
    icon: Clock,
    label: "TEMPORAL ECHO",
  },
  physical_trace: {
    bgClass: "bg-orange-950/90",
    borderClass: "border-orange-500/30",
    scanlineClass: "bg-gradient-to-b from-orange-500/3 via-transparent to-orange-500/3",
    textEffect: "",
    icon: AlertTriangle,
    label: "TRACE SIGNAL",
  },
};

/* ─── DIALOG CHOICE ─── */

export interface NPCDialogChoice {
  id: string;
  label: string;
  archetype: "compassionate" | "pragmatic" | "suspicious" | "loyal" | "manipulative";
  trustChange: number;
  response: string;
  callbackFlag?: string;
  secretFromElara?: boolean;
}

/* ─── DIALOG SCENE ─── */

export interface NPCDialogScene {
  npcId: FactionNPCId;
  /** The main dialog text */
  text: string;
  /** Whether this is a revelation (locks in after showing) */
  revelationId?: string;
  /** Available choices */
  choices: NPCDialogChoice[];
  /** Minimum trust required to see this scene */
  minTrust?: number;
}

/* ─── PROPS ─── */

interface NPCDialogProps {
  npcId: FactionNPCId;
  /** The dialog scene to show */
  scene: NPCDialogScene;
  /** Called when dialog closes */
  onClose: () => void;
  /** Called when a choice is made */
  onChoice: (choice: NPCDialogChoice) => void;
}

export default function NPCDialog({ npcId, scene, onClose, onChoice }: NPCDialogProps) {
  const npc = FACTION_NPCS[npcId];
  const manifest = MANIFESTATION_CONFIG[npc.manifestation] || MANIFESTATION_CONFIG.comms_signal;
  const { state } = useGame();
  const trust = npcId === "elara" ? state.elaraTrust : npcId === "the_human" ? state.humanTrust : (state.npcTrust[npcId] || 0);

  // Typewriter effect
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayText("");
    setIsTyping(true);
    setShowChoices(false);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < scene.text.length) {
        setDisplayText(scene.text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowChoices(true);
      }
    }, npc.typeSpeed);
    return () => clearInterval(interval);
  }, [scene.text, npc.typeSpeed]);

  // Skip typewriter on click
  const handleSkip = useCallback(() => {
    if (isTyping) {
      setDisplayText(scene.text);
      setIsTyping(false);
      setShowChoices(true);
    }
  }, [isTyping, scene.text]);

  // Corruption effect for possessed_system / viral
  const corruptedText = useMemo(() => {
    if (npc.corruption === "none" || npc.corruption === "echo") return displayText;
    if (npc.corruption === "whisper" && trust < 20) {
      // Shadow Tongue: corrupt random characters before discovery
      return displayText.split("").map((c, i) =>
        Math.random() < 0.03 && c !== " " ? String.fromCharCode(c.charCodeAt(0) + Math.floor(Math.random() * 3) - 1) : c
      ).join("");
    }
    if (npc.corruption === "viral" && trust < 30) {
      // Source: viral glitch effect
      return displayText.split("").map((c, i) =>
        Math.random() < 0.02 && c !== " " ? "█" : c
      ).join("");
    }
    return displayText;
  }, [displayText, npc.corruption, trust]);

  const Icon = manifest.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-2 sm:p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Dialog Panel */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-2xl ${manifest.bgClass} border ${manifest.borderClass} rounded-xl overflow-hidden backdrop-blur-md`}
          style={{ boxShadow: `0 0 40px ${npc.color}20, inset 0 0 20px ${npc.color}05` }}
          onClick={handleSkip}
        >
          {/* Scanlines */}
          <div className={`absolute inset-0 ${manifest.scanlineClass} pointer-events-none`}
            style={{ backgroundSize: "100% 4px" }} />

          {/* Corruption overlay for possessed systems */}
          {(npc.corruption === "viral" || npc.corruption === "whisper") && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-px animate-scan-line" style={{ background: `${npc.color}30` }} />
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: `${npc.color}25` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${npc.color}15`, boxShadow: `0 0 12px ${npc.color}30` }}>
                <Icon size={14} style={{ color: npc.color }} />
              </div>
              <div>
                <p className="font-display text-sm font-bold tracking-wider" style={{ color: npc.color }}>
                  {npc.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: `${npc.color}80` }}>
                    {manifest.label}
                  </span>
                  {/* Trust indicator */}
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${trust}%`, backgroundColor: npc.color }} />
                    </div>
                    <span className="font-mono text-[7px]" style={{ color: `${npc.color}60` }}>{trust}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Dialog Body */}
          <div className="px-4 py-4 min-h-[120px]" ref={textRef}>
            {/* NPC title/role */}
            <p className="font-mono text-[9px] tracking-[0.2em] mb-3" style={{ color: `${npc.color}40` }}>
              {npc.title.toUpperCase()}
            </p>

            {/* Dialog text with typewriter */}
            <p className={`font-mono text-sm leading-relaxed ${manifest.textEffect}`}
              style={{ color: "rgba(255,255,255,0.85)" }}>
              {corruptedText}
              {isTyping && (
                <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse"
                  style={{ backgroundColor: npc.color }} />
              )}
            </p>

            {/* Revelation badge */}
            {scene.revelationId && (
              <div className="mt-3 flex items-center gap-1.5">
                <BookOpen size={10} style={{ color: npc.color }} />
                <span className="font-mono text-[8px] tracking-wider" style={{ color: `${npc.color}60` }}>
                  REVELATION UNLOCKED
                </span>
              </div>
            )}
          </div>

          {/* Choices */}
          <AnimatePresence>
            {showChoices && scene.choices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 pb-4 space-y-2"
              >
                {scene.choices.map((choice, i) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChoice(choice);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group hover:brightness-125"
                    style={{
                      borderColor: `${npc.color}15`,
                      backgroundColor: `${npc.color}05`,
                    }}
                  >
                    <ChevronRight size={12} style={{ color: `${npc.color}60` }}
                      className="group-hover:translate-x-0.5 transition-transform" />
                    <div className="flex-1">
                      <p className="font-mono text-xs text-white/80 group-hover:text-white transition-colors">
                        {choice.label}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[8px] text-white/20">
                          [{choice.archetype}]
                        </span>
                        {choice.secretFromElara && (
                          <span className="font-mono text-[7px] text-red-400/50">SECRET</span>
                        )}
                        {choice.trustChange !== 0 && (
                          <span className={`font-mono text-[8px] ${choice.trustChange > 0 ? "text-green-400/50" : "text-red-400/50"}`}>
                            {choice.trustChange > 0 ? "+" : ""}{choice.trustChange} trust
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click to continue hint */}
          {isTyping && (
            <div className="px-4 pb-2">
              <p className="font-mono text-[8px] text-white/15 tracking-wider text-center">
                CLICK TO SKIP
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── NPC DIALOG TRIGGER BUTTON ─── */

interface NPCDialogTriggerProps {
  npcId: FactionNPCId;
  onClick: () => void;
  size?: "sm" | "md";
}

export function NPCDialogTrigger({ npcId, onClick, size = "sm" }: NPCDialogTriggerProps) {
  const npc = FACTION_NPCS[npcId];
  if (!npc) return null;
  const manifest = MANIFESTATION_CONFIG[npc.manifestation] || MANIFESTATION_CONFIG.comms_signal;
  const Icon = manifest.icon;
  const sz = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${sz} rounded-full flex items-center justify-center border transition-all`}
      style={{
        borderColor: `${npc.color}30`,
        backgroundColor: `${npc.color}10`,
        boxShadow: `0 0 12px ${npc.color}20`,
      }}
      title={`Talk to ${npc.name}`}
    >
      <Icon size={size === "sm" ? 12 : 16} style={{ color: npc.color }} />
    </motion.button>
  );
}

/* ─── HELPER: Build first-contact scene from NPC data ─── */

export function buildFirstContactScene(npcId: FactionNPCId): NPCDialogScene {
  const npc = FACTION_NPCS[npcId];
  return {
    npcId,
    text: npc.firstContact,
    choices: [
      {
        id: `${npcId}_fc_listen`,
        label: "I'm listening. Tell me more.",
        archetype: "pragmatic",
        trustChange: 3,
        response: "Good. You're smarter than the last one.",
      },
      {
        id: `${npcId}_fc_trust`,
        label: "Why should I trust you?",
        archetype: "suspicious",
        trustChange: -1,
        response: "Trust is earned. I'm offering information. What you do with it is your choice.",
      },
      {
        id: `${npcId}_fc_help`,
        label: "What do you need from me?",
        archetype: "compassionate",
        trustChange: 5,
        response: "Someone who's willing to see the truth, even when it's uncomfortable.",
      },
    ],
  };
}
