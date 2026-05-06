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
  X, Radio, AlertTriangle,
  Skull, Clock, Eye, Zap, BookOpen,
} from "lucide-react";
import { FACTION_NPCS, type FactionNPCId } from "@/game/factionNPCs";
import { useGame } from "@/contexts/GameContext";
import { GIFT_ITEMS, calculateGiftResult, type GiftItem, type NpcId, type GiftItemId } from "@/game/npcGifts";
import { useNPCPhysics } from "@/engine/useVoidEngine";
import { useDialogVO } from "@/hooks/useDialogVO";
import { getNPCPortrait } from "@/game/npcPortraits";
import { AnimatedPortrait } from "./AnimatedPortrait";
import { getAmbientReference } from "@/game/ambientStorytelling";
import { getRelationshipState } from "@/game/npcRelationships";
import { getActiveVoices, SKILL_VOICES, type SkillId } from "@/game/innerVoices";
import { ARCHON_VOICE_MAPPING } from "@/game/archonTrainingVoices";
import { KineticText } from "@/components/void";
import type { NarrativeEffect } from "@/engine/voidNarrative";
import { VOID } from "@/engine/voidPresets";
import { deriveSkillStats, type SkillType } from "@/lib/dialogSkillCheck";
import NPCDialogChoiceWheel from "./NPCDialogChoiceWheel";

// Choice-affordance icons (SKILL_ICONS / SKILL_COLORS / RARITY_COLORS)
// moved into NPCDialogChoiceWheel.tsx — they only render inside the
// choice list and the wheel internalises that rendering now.

type MoralityAlignment = "machine" | "humanity" | "neutral";
type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

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
    bgClass: "void-bg-success",
    borderClass: "void-border-success",
    scanlineClass: "bg-gradient-to-b from-cyan-400/5 via-transparent to-cyan-400/5",
    textEffect: "",
    icon: Eye,
    label: "HOLOGRAPHIC LINK",
  },
  comms_signal: {
    bgClass: "void-bg-canvas",
    borderClass: "void-border",
    scanlineClass: "bg-gradient-to-b from-amber-500/3 via-transparent to-amber-500/3",
    textEffect: "tracking-wider",
    icon: Radio,
    label: "ENCRYPTED SIGNAL",
  },
  substrate: {
    bgClass: "void-bg-error",
    borderClass: "void-border-error",
    scanlineClass: "bg-gradient-to-b from-red-500/5 via-transparent to-red-500/5",
    textEffect: "",
    icon: Zap,
    label: "SUBSTRATE LINK",
  },
  possessed_system: {
    bgClass: "void-bg-system",
    borderClass: "void-border-system",
    scanlineClass: "bg-gradient-to-b from-purple-500/5 via-transparent to-purple-500/5",
    textEffect: "",
    icon: Skull,
    label: "CORRUPTED CHANNEL",
  },
  temporal_echo: {
    bgClass: "void-bg-success",
    borderClass: "void-border-success",
    scanlineClass: "bg-gradient-to-b from-emerald-400/5 via-transparent to-emerald-400/5",
    textEffect: "",
    icon: Clock,
    label: "TEMPORAL ECHO",
  },
  physical_trace: {
    bgClass: "void-bg-sunk",
    borderClass: "void-border",
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
  /** ME-style alignment tag — drives the indicator bar on the choice
   *  button. When unset, the choice renders as the existing neutral
   *  archetype-coloured row. Plan §A1: unify wheel + NPC dialog UI. */
  alignment?: MoralityAlignment;
  /** KOTOR/ME-style skill-check gate. When present, clicking rolls
   *  D100 + playerStat vs threshold; the UI shows a SUCCESS/FAILED
   *  badge and onChoice fires with `passed` set accordingly. The
   *  D100 logic comes from apps/client/src/lib/dialogSkillCheck.ts
   *  so wheel and NPC dialog use the exact same rule. */
  skillCheck?: { skill: SkillType; threshold: number };
  /** Optional KOTOR-style morality nudge — shown as ±X on the
   *  choice button. Caller is still responsible for applying the
   *  shift on selection (read it off the chosen choice). */
  moralityShift?: number;
  /** Optional card-reward preview — shows a rarity badge. */
  cardRewardRarity?: CardRarity;
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
  /**
   * Optional VO manifest line ID. When present and the NPC's VO
   * manifest contains this entry, audio plays on dialog open and the
   * portrait's "speaking" tells (expression, glow pulse, brightness)
   * follow audio.onplay / audio.onended instead of the typewriter.
   */
  voLineId?: string;
}

/* ─── PROPS ─── */

interface NPCDialogProps {
  npcId: FactionNPCId;
  /** The dialog scene to show */
  scene: NPCDialogScene;
  /** Called when dialog closes */
  onClose: () => void;
  /** Called when a choice is made. Second arg is the skill-check
   *  outcome: `true` if no skill-check was attached (default), or the
   *  passed/failed boolean from the D100 roll otherwise. Backward-
   *  compatible — pre-A1 callers can ignore the second arg. */
  onChoice: (choice: NPCDialogChoice, passed?: boolean) => void;
}

export default function NPCDialog({ npcId, scene, onClose, onChoice }: NPCDialogProps) {
  const npc = FACTION_NPCS[npcId];
  const manifest = MANIFESTATION_CONFIG[npc.manifestation] || MANIFESTATION_CONFIG.comms_signal;
  const { state } = useGame();
  const trust = npcId === "elara" ? state.elaraTrust : npcId === "the_human" ? state.humanTrust : (state.npcTrust[npcId] || 0);

  // Player stats for ME-style skill-check choices (plan §A1). Shared
  // derivation with DialogWheel via deriveSkillStats so the same
  // attributes drive the same rolls in both surfaces.
  const playerStats = useMemo<Record<SkillType, number>>(
    () => deriveSkillStats(state.characterChoices),
    [state.characterChoices],
  );

  // Per-choice skill-check state previously lived here; the §D1
  // promotion moved it into NPCDialogChoiceWheel where the roll UI
  // is rendered.

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

  // ─── VO playback ───
  // When the scene specifies a voLineId AND the NPC's VO manifest has
  // it, audio plays on scene change and `vo.speaking` tracks actual
  // playback state. Portrait "speaking" tells (expression, glow,
  // brightness) follow audio when present, else fall back to isTyping.
  //
  // `audioWorked` is a sticky flag that flips true the first time
  // vo.speaking becomes true in this scene. It stays true for the rest
  // of the scene so that when audio ENDS we correctly stop showing
  // speaking (isSpeaking = vo.speaking = false). If audio never starts
  // (missing manifest entry, autoplay blocked, etc.), audioWorked stays
  // false and we use the typewriter as the speaking proxy — no silent
  // failure mode where the portrait just never animates.
  const vo = useDialogVO(npcId);
  const [audioWorked, setAudioWorked] = useState(false);
  useEffect(() => {
    if (vo.speaking) setAudioWorked(true);
  }, [vo.speaking]);
  const isSpeaking = audioWorked ? vo.speaking : isTyping;

  // ─── BioWare-style cinematic portrait ───
  // Expression shifts: speaking while typing, emotional on choice hover, neutral at rest
  const portrait = useMemo(() => getNPCPortrait(npc.id), [npc.id]);
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);

  // Compute the active expression KEY. AnimatedPortrait handles The Human's
  // progressive reveal internally — we just pass "neutral" and it overrides.
  // Speaking follows actual audio when VO is present (see isSpeaking above),
  // typewriter otherwise. Hover archetypes shift to emotional1 / emotional2.
  const activeExpressionKey = useMemo<"neutral" | "speaking" | "emotional1" | "emotional2">(() => {
    if (isSpeaking) return "speaking";
    if (hoveredArchetype === "suspicious" || hoveredArchetype === "manipulative") return "emotional2";
    if (hoveredArchetype === "compassionate" || hoveredArchetype === "loyal") return "emotional1";
    return "neutral";
  }, [isSpeaking, hoveredArchetype]);

  // Reset state on scene change + trigger VO playback if available.
  // We always attempt speak() when a voLineId is present — the hook
  // safely no-ops if the manifest is missing that entry. audioWorked
  // resets per-scene so the first scene's successful playback doesn't
  // lock later scenes without their own VO into audio-mode.
  useEffect(() => {
    setIsTyping(true);
    setShowChoices(false);
    setKineticKey(k => k + 1);
    setAudioWorked(false);
    // Skill-check roll state lives in NPCDialogChoiceWheel; the wheel
    // remounts on scene-change because its `choices` prop reference
    // changes, so per-scene reset happens automatically.
    if (scene.voLineId) {
      vo.speak(scene.voLineId);
    }
    return () => {
      vo.stop();
    };
  }, [scene.text, scene.voLineId, vo]);

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
            {/* AnimatedPortrait owns: image + crossfade, breathing+drift, blink,
                speaking-glow, trust-based filter, The Human progressive reveal
                effects (CRT scanlines, interference sweep, glitch bars, stage
                label), and the inner-frame shadow. We wrap it for the dialog's
                column framing + faction-color background gradient. */}
            {portrait && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="hidden sm:block relative w-[200px] shrink-0 overflow-hidden"
                style={{ background: `linear-gradient(180deg, ${npc.color}08 0%, transparent 40%, ${npc.color}05 100%)` }}
              >
                <AnimatedPortrait
                  npcId={npcId}
                  expression={activeExpressionKey}
                  isSpeaking={isSpeaking}
                  audio={vo.audio}
                  trustLevel={trust}
                  size="full"
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
              style={{ color: "color-mix(in oklch, var(--text-primary) 85%, transparent)" }}>
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
              className="mt-2 p-2 rounded border-l-2 void-border void-bg-sunk"
              data-testid="archon-whisper"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="font-mono text-[8px] uppercase tracking-wider font-bold"
                  style={{ color: archonWhisper.voice.color }}
                >
                  {archonWhisper.voice.name}
                </span>
                <span className="font-mono text-[8px] void-text-energy">
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
              className="mt-2 p-2 rounded border-l-2 void-border-system void-bg-system"
              data-testid="ambient-leak"
            >
              <span className="font-mono text-[8px] uppercase tracking-wider void-text-system block mb-0.5">
                (unprompted, quietly)
              </span>
              <p className="font-mono text-[10px] italic text-foreground/70 leading-relaxed">
                "{ambientLeak.text}"
              </p>
            </motion.div>
          )}

          {/* Choices — D1 promotion: NPCDialogChoiceWheel renders the
              ME-style alignment-sorted wheel with HUMANITY/NEUTRAL/MACHINE
              legend and the right-side affordance cluster. Skill-check
              roll state is internalised in the wheel component, so
              NPCDialog no longer needs to track skillCheckResults /
              rollingChoiceId locally. */}
          <AnimatePresence>
            {showChoices && scene.choices.length > 0 && (
              <NPCDialogChoiceWheel
                choices={scene.choices}
                npcColor={npc.color}
                playerStats={playerStats}
                onChoice={onChoice}
                onHoverArchetype={setHoveredArchetype}
              />
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

/**
 * Per-NPC voLineId used on first-contact dialog. Entries that exist
 * today in the VO manifests will play audio immediately (audioWorked
 * flips true, portrait speaking follows the audio). Entries that don't
 * exist yet will no-op through vo.speak() — the dialog then falls back
 * to typewriter-driven isSpeaking per NPCDialog's audioWorked logic.
 *
 * Naming convention for future VO generation: `{npcId}_first_contact`
 * where npcId matches FactionNPCId, except for the two cases below
 * where the existing manifest entry has a different stable key.
 */
const FIRST_CONTACT_VO_LINE: Record<FactionNPCId, string> = {
  elara: "elara_first_contact",
  the_human: "human_first_contact",
  agent_zero: "agent_zero_first_contact",
  adjudicator_locke: "locke_intro",           // existing
  the_source: "source_first_contact",
  the_antiquarian: "antiquarian_first_contact",
  shadow_tongue: "st_first_contact",          // existing
};

export function buildFirstContactScene(npcId: FactionNPCId): NPCDialogScene {
  const npc = FACTION_NPCS[npcId];
  return {
    npcId,
    text: npc.firstContact,
    voLineId: FIRST_CONTACT_VO_LINE[npcId],
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
