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
import { GIFT_ITEMS, calculateGiftResult, type GiftItem, type NpcId, type GiftItemId } from "@/game/npcGifts";
import { useNPCPhysics } from "@/engine/useVoidEngine";
import { getNPCPortrait, getHumanRevealImage } from "@/game/npcPortraits";
import { getAmbientReference } from "@/game/ambientStorytelling";
import { getActiveVoices, SKILL_VOICES, type SkillId } from "@/game/innerVoices";
import { ARCHON_VOICE_MAPPING } from "@/game/archonTrainingVoices";
import { KineticText } from "@/components/void";
import type { NarrativeEffect } from "@/engine/voidNarrative";
import { VOID } from "@/engine/voidPresets";

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

/* ─── MANIFESTATION → NARRATIVE EFFECT ─── */
const MANIFESTATION_NARRATIVE: Record<string, string> = {
  hologram: "breathe",          // Elara — gentle presence pulse
  comms_signal: "static",       // Agent Zero, Locke — radio interference
  substrate: "flicker",         // The Human — digital flicker
  possessed_system: "glitch",   // Source, Shadow Tongue — corruption
  temporal_echo: "drift",       // Antiquarian — time-shifted motion
  physical_trace: "tremble",    // physical remnants — unstable signal
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

  // NPC relationship state (tier + personality based on player archetype)
  const relationship = useMemo(
    () => getRelationshipState(npcId, trust, "unknown"),
    [npcId, trust],
  );

  // Ambient storytelling: NPCs may leak backstory when you open dialog with them
  const ambientLeak = useMemo(
    () => getAmbientReference(npcId, trust, "small_talk", new Set()),
    [npcId, trust],
  );

  // Archon training voice: when dialog opens, the player's strongest relevant skill
  // (taught by an Archon in the Matrix of Dreams) whispers a lesson about this NPC
  const archonWhisper = useMemo(() => {
    const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;
    const utterances = getActiveVoices({ type: "npc_dialog", npcId }, skills, 1);
    if (utterances.length === 0) return null;
    const u = utterances[0];
    return {
      utterance: u,
      voice: SKILL_VOICES[u.skillId],
      mentor: ARCHON_VOICE_MAPPING[u.skillId],
    };
  }, [npcId, state.innerVoiceSkills]);

  // Void Energy: shift document physics to match this NPC's manifestation while dialog is open
  useNPCPhysics(npc.manifestation, true);

  // KineticText reveal state
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [giftResult, setGiftResult] = useState<string | null>(null);
  const [kineticKey, setKineticKey] = useState(0); // force re-mount on scene change
  const textRef = useRef<HTMLDivElement>(null);

  // ─── BioWare-style cinematic portrait ───
  // Expression shifts: speaking while typing, emotional on choice hover, neutral at rest
  const portrait = useMemo(() => getNPCPortrait(npc.id), [npc.id]);
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);

  const activeExpression = useMemo(() => {
    if (!portrait) return null;
    // The Human uses progressive reveal before Trust 50
    if (npcId === "the_human" && trust < 50) return getHumanRevealImage(trust);
    // While NPC is "talking", show speaking expression
    if (isTyping) return portrait.expressions.speaking;
    // Hovering a hostile/suspicious choice → emotional2 (tension)
    if (hoveredArchetype === "suspicious" || hoveredArchetype === "manipulative") return portrait.expressions.emotional2;
    // Hovering a compassionate/loyal choice → emotional1 (warmth)
    if (hoveredArchetype === "compassionate" || hoveredArchetype === "loyal") return portrait.expressions.emotional1;
    // At rest with choices visible → neutral
    return portrait.expressions.neutral;
  }, [portrait, npcId, trust, isTyping, hoveredArchetype]);

  // Reset state on scene change
  useEffect(() => {
    setIsTyping(true);
    setShowChoices(false);
    setKineticKey(k => k + 1);
  }, [scene.text]);

  // Map NPC manifestation to a per-character kinetic effect
  const npcKineticEffect = useMemo((): NarrativeEffect => {
    switch (npc.manifestation) {
      case "hologram": return "drift";           // Elara: gentle holographic drift
      case "possessed_system": return "static";   // Source, Shadow Tongue: CRT static
      case "temporal_echo": return "breathe";     // Antiquarian: time-breathing
      case "electrical_pattern": return "flicker"; // Voltari: electrical flicker
      case "resurrection_echo": return "tremble"; // Necromancer: dead-frequency tremor
      default: return null;                       // substrate, comms_signal: clean text
    }
  }, [npc.manifestation]);

  const handleKineticComplete = useCallback(() => {
    setIsTyping(false);
    setShowChoices(true);
  }, []);

  // Skip typewriter on click
  const handleSkip = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      setShowChoices(true);
      setKineticKey(k => k + 1); // force instant display
    }
  }, [isTyping]);

  // Determine kinetic mode based on NPC personality and corruption
  const kineticMode = useMemo(() => {
    if (npc.corruption === "viral" && trust < 30) return "decode" as const;
    if (npc.manifestation === "possessed_system") return "decode" as const;
    return "char" as const;
  }, [npc.corruption, npc.manifestation, trust]);

  // Corruption effect for possessed_system / viral (applied to scene text before KineticText)
  const corruptedText = useMemo(() => {
    if (npc.corruption === "none" || npc.corruption === "echo") return scene.text;
    if (npc.corruption === "whisper" && trust < 20) {
      // Shadow Tongue: corrupt random characters before discovery
      return scene.text.split("").map((c, i) =>
        Math.random() < 0.03 && c !== " " ? String.fromCharCode(c.charCodeAt(0) + Math.floor(Math.random() * 3) - 1) : c
      ).join("");
    }
    if (npc.corruption === "viral" && trust < 30) {
      // Source: viral glitch effect
      return scene.text.split("").map((c, i) =>
        Math.random() < 0.02 && c !== " " ? "█" : c
      ).join("");
    }
    return scene.text;
  }, [scene.text, npc.corruption, trust]);

  const Icon = manifest.icon;

  return (
    <AnimatePresence>
      <motion.div
        {...VOID.fade()}
        className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-2 sm:p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Dialog Panel */}
        <motion.div
          {...VOID.springUp()}
          className={`relative w-full max-w-4xl void-elevated overflow-hidden`}
          style={{ boxShadow: `0 0 40px ${npc.color}20, inset 0 0 20px ${npc.color}05` }}
          data-narrative={MANIFESTATION_NARRATIVE[npc.manifestation] || "breathe"}
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

          {/* ═══ BioWare-style layout: Portrait | Dialog ═══ */}
          <div className="flex">
            {/* ─── CINEMATIC PORTRAIT PANEL ─── */}
            {activeExpression && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="hidden sm:block relative w-[200px] shrink-0 overflow-hidden"
                style={{ background: `linear-gradient(180deg, ${npc.color}08 0%, transparent 40%, ${npc.color}05 100%)` }}
              >
                {/* Portrait image with crossfade on expression change */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeExpression}
                    src={activeExpression}
                    alt={npc.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full object-cover object-top"
                    style={{
                      minHeight: "320px",
                      filter: isTyping ? `brightness(1.1) drop-shadow(0 0 8px ${npc.color}40)` : "brightness(1)",
                      transition: "filter 0.4s ease",
                    }}
                  />
                </AnimatePresence>

                {/* Speaking glow pulse at bottom of portrait */}
                {isTyping && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{
                      background: `linear-gradient(0deg, ${npc.color}25 0%, transparent 100%)`,
                    }}
                  />
                )}

                {/* Manifestation-specific portrait frame */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 30px ${npc.color}15, inset -1px 0 0 ${npc.color}20`,
                  }}
                />
              </motion.div>
            )}

            {/* ─── DIALOG CONTENT COLUMN ─── */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: `${npc.color}25` }}>
                <div className="flex items-center gap-2.5">
                  {/* Small avatar for mobile / fallback */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden sm:hidden"
                    style={{ backgroundColor: `${npc.color}15`, boxShadow: `0 0 12px ${npc.color}30` }}>
                    {portrait ? (
                      <img src={portrait.bustPortrait} alt={npc.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={14} style={{ color: npc.color }} />
                    )}
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
                      {relationship && (
                        <span
                          className="font-mono text-[7px] uppercase tracking-[0.2em] px-1.5 py-0.5 rounded border"
                          style={{ color: npc.color, borderColor: `${npc.color}40`, backgroundColor: `${npc.color}0c` }}
                          title={relationship.tierLabel}
                          data-testid={`relationship-tier-${npcId}`}
                        >
                          {relationship.tier} · {relationship.personality}
                        </span>
                      )}
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

            {/* Dialog text with KineticText per-character reveal */}
            <div className={`font-mono text-sm leading-relaxed ${manifest.textEffect}`}
              style={{ color: "rgba(255,255,255,0.85)" }}>
              {isTyping ? (
                <KineticText
                  key={kineticKey}
                  text={corruptedText}
                  mode={kineticMode}
                  speed={npc.typeSpeed}
                  effect={npcKineticEffect}
                  perCharacter={!!npcKineticEffect}
                  onComplete={handleKineticComplete}
                  showCursor
                  as="p"
                  className="inline"
                />
              ) : (
                <KineticText
                  key={`done-${kineticKey}`}
                  text={corruptedText}
                  mode="char"
                  speed={0}
                  autoStart
                  effect={npcKineticEffect}
                  perCharacter={!!npcKineticEffect}
                  as="p"
                  className="inline"
                  showCursor={false}
                />
              )}
            </div>

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

          {/* Archon training whisper — from the Matrix of Dreams */}
          {archonWhisper && showChoices && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 0.85, x: 0 }}
              className="mt-2 p-2 rounded border-l-2 border-indigo-400/40 bg-indigo-500/5"
              data-testid="archon-whisper"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="font-mono text-[8px] uppercase tracking-wider font-bold"
                  style={{ color: archonWhisper.voice.color }}
                >
                  {archonWhisper.voice.name}
                </span>
                <span className="font-mono text-[8px] text-indigo-300/60">
                  ◈ {archonWhisper.mentor.archonName}
                </span>
              </div>
              <p className="font-mono text-[10px] italic text-foreground/75 leading-relaxed">
                "{archonWhisper.utterance.text}"
              </p>
            </motion.div>
          )}

          {/* Ambient leak — backstory surfacing */}
          {ambientLeak && showChoices && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 0.7, y: 0 }}
              className="mt-2 p-2 rounded border-l-2 border-purple-400/40 bg-purple-500/5"
              data-testid="ambient-leak"
            >
              <span className="font-mono text-[8px] uppercase tracking-wider text-purple-400/70 block mb-0.5">
                (unprompted, quietly)
              </span>
              <p className="font-mono text-[10px] italic text-foreground/70 leading-relaxed">
                "{ambientLeak.text}"
              </p>
            </motion.div>
          )}

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
                    onMouseEnter={() => setHoveredArchetype(choice.archetype)}
                    onMouseLeave={() => setHoveredArchetype(null)}
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

          {/* Gift button + panel */}
          {showChoices && !showGifts && !giftResult && (
            <div className="px-4 pb-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowGifts(true); }}
                className="font-mono text-[9px] text-white/20 hover:text-white/40 transition-colors flex items-center gap-1"
              >
                🎁 OFFER GIFT
              </button>
            </div>
          )}

          {showGifts && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="px-4 pb-3">
              <p className="font-mono text-[9px] text-white/30 mb-2">SELECT A GIFT</p>
              <div className="grid grid-cols-3 gap-1.5 max-h-[120px] overflow-y-auto">
                {Object.values(GIFT_ITEMS).slice(0, 12).map((item: GiftItem) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      const result = calculateGiftResult("player", npcId as NpcId, item.id as GiftItemId);
                      if (result && "dialogue" in result) {
                        setGiftResult(result.dialogue);
                        setShowGifts(false);
                        // Trust change handled by parent via onChoice
                      }
                    }}
                    className="p-1.5 rounded text-left border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                  >
                    <p className="font-mono text-[8px] text-white/60 truncate">{item.name}</p>
                  </button>
                ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowGifts(false); }} className="font-mono text-[8px] text-white/15 mt-2">CANCEL</button>
            </motion.div>
          )}

          {giftResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-3">
              <p className="font-mono text-xs text-white/70 italic">{giftResult}</p>
            </motion.div>
          )}

          {/* Click to continue hint */}
          {isTyping && (
            <div className="px-4 pb-2">
              <p className="font-mono text-[8px] text-white/15 tracking-wider text-center">
                CLICK TO SKIP
              </p>
            </div>
          )}
            </div>{/* end dialog content column */}
          </div>{/* end BioWare flex layout */}
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
