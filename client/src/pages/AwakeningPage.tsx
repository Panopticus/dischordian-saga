/* ═══════════════════════════════════════════════════════
   AWAKENING PAGE — First-time cryo pod experience
   Horror sci-fi narrative character creation through Elara dialog
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useGame, type AwakeningStep } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import StarterDeckViewer, { generateStarterDeck } from "@/components/StarterDeckViewer";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp";
const CRYO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp";

/* ─── TYPEWRITER HOOK ─── */
function useTypewriter(text: string, speed = 30, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return; }
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
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  const skip = useCallback(() => { setDisplayed(text); setDone(true); }, [text]);

  return { displayed, done, skip };
}

/* ─── ELARA DIALOG BOX ─── */
function ElaraDialogBox({
  text,
  onContinue,
  showPortrait = true,
  choices,
  onChoice,
}: {
  text: string;
  onContinue?: () => void;
  showPortrait?: boolean;
  choices?: { label: string; value: string; description?: string }[];
  onChoice?: (value: string) => void;
}) {
  const { displayed, done, skip } = useTypewriter(text, 25);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        {/* Elara portrait */}
        {showPortrait && (
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={ELARA_PORTRAIT}
                alt="Elara"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[var(--neon-cyan)]/30"
                style={{ boxShadow: "0 0 20px rgba(51,226,230,0.2)" }}
              />
              <div className="absolute inset-0 rounded-full animate-pulse" style={{
                boxShadow: "0 0 30px rgba(51,226,230,0.15)",
              }} />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30">
                <span className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em]">ELARA</span>
              </div>
            </div>
          </div>
        )}

        {/* Dialog box */}
        <div
          className="rounded-lg p-5 sm:p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(1,0,32,0.95) 0%, rgba(10,12,43,0.95) 100%)",
            border: "1px solid rgba(51,226,230,0.2)",
            boxShadow: "0 0 30px rgba(51,226,230,0.05), inset 0 1px 0 rgba(51,226,230,0.1)",
          }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51,226,230,0.1) 2px, rgba(51,226,230,0.1) 4px)",
          }} />

          <p className="font-mono text-sm sm:text-base text-white/90 leading-relaxed relative z-10 min-h-[3em]">
            {displayed}
            {!done && <span className="inline-block w-2 h-4 bg-[var(--neon-cyan)] ml-1 animate-pulse" />}
          </p>

          {/* Continue or choices */}
          <div className="mt-4 relative z-10">
            {done && choices && onChoice ? (
              <div className="space-y-2">
                {choices.map((choice, i) => (
                  <motion.button
                    key={choice.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    onClick={() => onChoice(choice.value)}
                    className="w-full text-left px-4 py-3 rounded-md font-mono text-sm transition-all group"
                    style={{
                      background: "rgba(51,226,230,0.05)",
                      border: "1px solid rgba(51,226,230,0.15)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(51,226,230,0.12)";
                      e.currentTarget.style.borderColor = "rgba(51,226,230,0.4)";
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(51,226,230,0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(51,226,230,0.05)";
                      e.currentTarget.style.borderColor = "rgba(51,226,230,0.15)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span className="text-[var(--neon-cyan)]/70 mr-2">&gt;</span>
                    <span className="text-white/80 group-hover:text-white">{choice.label}</span>
                    {choice.description && (
                      <span className="block text-[11px] text-white/30 mt-0.5 ml-4">{choice.description}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : done && onContinue ? (
              <button
                onClick={onContinue}
                className="font-mono text-xs text-[var(--neon-cyan)]/60 hover:text-[var(--neon-cyan)] transition-colors flex items-center gap-1"
              >
                <span className="animate-pulse">&gt;</span> Click to continue...
              </button>
            ) : !done ? (
              <button
                onClick={skip}
                className="font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors"
              >
                [click to skip]
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── ATTRIBUTE ALLOCATOR ─── */
function AttributeAllocator({
  attack, defense, vitality,
  onChange,
  onConfirm,
}: {
  attack: number; defense: number; vitality: number;
  onChange: (a: number, d: number, v: number) => void;
  onConfirm: () => void;
}) {
  const total = attack + defense + vitality;
  const remaining = 9 - total;

  const adjust = (attr: "a" | "d" | "v", delta: number) => {
    let a = attack, d = defense, v = vitality;
    if (attr === "a") a = Math.max(1, Math.min(5, a + delta));
    if (attr === "d") d = Math.max(1, Math.min(5, d + delta));
    if (attr === "v") v = Math.max(1, Math.min(5, v + delta));
    if (a + d + v <= 9) onChange(a, d, v);
  };

  const renderDots = (val: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-3 h-3 rounded-full border ${
          i <= val
            ? "bg-[var(--neon-cyan)] border-[var(--neon-cyan)]/50 shadow-[0_0_6px_var(--neon-cyan)]"
            : "border-white/20 bg-transparent"
        }`} />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-lg p-5" style={{
        background: "linear-gradient(135deg, rgba(1,0,32,0.95) 0%, rgba(10,12,43,0.95) 100%)",
        border: "1px solid rgba(51,226,230,0.2)",
      }}>
        <h3 className="font-display text-sm tracking-[0.2em] text-[var(--neon-cyan)] mb-1">NEURAL CALIBRATION</h3>
        <p className="font-mono text-[11px] text-white/40 mb-4">
          Distribute 9 points across your attributes. Each starts at 1, max 5.
          <span className="text-[var(--neon-cyan)] ml-1">Remaining: {remaining}</span>
        </p>

        {[
          { label: "ATTACK", desc: "Offensive power", val: attack, key: "a" as const },
          { label: "DEFENSE", desc: "Damage resistance", val: defense, key: "d" as const },
          { label: "VITALITY", desc: "Health & endurance", val: vitality, key: "v" as const },
        ].map(attr => (
          <div key={attr.key} className="flex items-center justify-between mb-3">
            <div className="w-24">
              <p className="font-mono text-xs text-white/80">{attr.label}</p>
              <p className="font-mono text-[9px] text-white/30">{attr.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjust(attr.key, -1)}
                className="w-6 h-6 rounded border border-white/20 text-white/40 hover:text-white hover:border-white/40 font-mono text-sm flex items-center justify-center transition-colors"
              >-</button>
              {renderDots(attr.val)}
              <button
                onClick={() => adjust(attr.key, 1)}
                className="w-6 h-6 rounded border border-white/20 text-white/40 hover:text-white hover:border-white/40 font-mono text-sm flex items-center justify-center transition-colors"
              >+</button>
            </div>
          </div>
        ))}

        <button
          onClick={onConfirm}
          disabled={total !== 9}
          className="w-full mt-3 py-2.5 rounded-md font-mono text-sm tracking-wider transition-all disabled:opacity-30"
          style={{
            background: total === 9 ? "rgba(51,226,230,0.15)" : "transparent",
            border: `1px solid rgba(51,226,230,${total === 9 ? 0.4 : 0.1})`,
            color: total === 9 ? "var(--neon-cyan)" : "rgba(255,255,255,0.3)",
          }}
        >
          CALIBRATE NEURAL MATRIX
        </button>
      </div>
    </motion.div>
  );
}

/* ─── MAIN AWAKENING PAGE ─── */
export default function AwakeningPage({ elaraTTS }: { elaraTTS?: any }) {
  const { state, advanceAwakening, setCharacterChoice, completeAwakening, setAwakeningStep } = useGame();
  const { discoverEntry } = useGamification();
  const { initAudio, setRoomAmbience, playSFX, audioReady } = useSound();
  const [, navigate] = useLocation();
  const [nameInput, setNameInput] = useState("");
  const [screenOpacity, setScreenOpacity] = useState(0);
  const [showFrost, setShowFrost] = useState(true);
  const [heartbeat, setHeartbeat] = useState(true);
  const [showDeckReveal, setShowDeckReveal] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const lastSpokenRef = useRef<string>("");

  const createCitizen = trpc.citizen.createCharacter.useMutation();
  const [selectedNeyonTokenId, setSelectedNeyonTokenId] = useState<number | null>(null);

  const { awakeningStep, characterChoices } = state;

  const neyonEligibility = trpc.citizen.checkNeyonEligibility.useQuery(undefined, {
    enabled: awakeningStep === "SPECIES_QUESTION",
    staleTime: 60_000,
  });

  // Initialize audio on first user interaction
  const handleInitAudio = useCallback(async () => {
    if (!audioInitialized) {
      try {
        await initAudio();
        setAudioInitialized(true);
        setRoomAmbience("cryo-bay");
      } catch { /* audio blocked */ }
    }
  }, [audioInitialized, initAudio, setRoomAmbience]);

  // Blackout → fade in
  useEffect(() => {
    if (awakeningStep === "BLACKOUT") {
      const t1 = setTimeout(() => setScreenOpacity(0.3), 1500);
      const t2 = setTimeout(() => setScreenOpacity(0.6), 3000);
      const t3 = setTimeout(() => { setScreenOpacity(1); setHeartbeat(false); }, 4500);
      const t4 = setTimeout(() => advanceAwakening(), 6000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [awakeningStep, advanceAwakening]);

  // Cryo open → remove frost + play cryo SFX
  useEffect(() => {
    if (awakeningStep === "CRYO_OPEN") {
      if (audioInitialized) playSFX("cryo_open");
      const t = setTimeout(() => setShowFrost(false), 2000);
      return () => clearTimeout(t);
    }
  }, [awakeningStep, audioInitialized, playSFX]);

  // Play dialog SFX on each step change + trigger Elara TTS
  useEffect(() => {
    if (audioInitialized && awakeningStep !== "BLACKOUT" && awakeningStep !== "COMPLETE") {
      playSFX("dialog_open");
    }
  }, [awakeningStep, audioInitialized, playSFX]);

  // Elara TTS — speak dialog text when step changes
  const STEP_DIALOG: Partial<Record<AwakeningStep, string>> = useMemo(() => ({
    CRYO_OPEN: "Can you hear me? Don't try to move yet. Your neural pathways are still re-establishing.",
    ELARA_INTRO: "I am Elara, the ship's intelligence. You've been in cryogenic suspension. You are aboard Inception Ark Vessel 47. You are a Potential. The others, the first wave, they're gone. All communications have been severed. We are alone.",
    SPECIES_QUESTION: "Your neural patterns are unusual. Your cellular structure doesn't match standard human baselines. What do you remember about your origin?",
    CLASS_QUESTION: "Your skill matrices are partially intact. What comes naturally to you?",
    ALIGNMENT_QUESTION: "The Architect built the Panopticon to impose order. The Dreamer believed in the chaos of free will. Where do you stand?",
    ELEMENT_QUESTION: "Choose your elemental affinity. Which force resonates with your soul?",
    NAME_INPUT: "The cryo manifest lists you by serial number, but every Potential deserves a name. What should I call you?",
    ATTRIBUTES: "I need to calibrate your neural interface. Distribute your attribute points carefully.",
    FIRST_STEPS: "Welcome aboard. Your Citizen profile has been created. The rest of the ship needs your help to restore power.",
  }), []);

  useEffect(() => {
    const dialogText = STEP_DIALOG[awakeningStep];
    if (dialogText && elaraTTS && dialogText !== lastSpokenRef.current) {
      lastSpokenRef.current = dialogText;
      // Small delay to let the typewriter start first
      const t = setTimeout(() => elaraTTS.speak(dialogText), 300);
      return () => clearTimeout(t);
    }
  }, [awakeningStep, elaraTTS, STEP_DIALOG]);

  // Get available elements based on species
  const availableElements = useMemo(() => {
    const species = characterChoices.species;
    if (!species) return [];
    const map: Record<string, { value: string; label: string; desc: string }[]> = {
      demagi: [
        { value: "earth", label: "Earth — Stability and haste", desc: "Stable, trusting, peaceful. Grants temporary speed boost." },
        { value: "fire", label: "Fire — Passion and immunity", desc: "Passionate, fierce. Immune to fire and lava damage." },
        { value: "water", label: "Water — Adaptability", desc: "Flowing, adaptable. Can breathe underwater." },
        { value: "air", label: "Air — Freedom and flight", desc: "Free-spirited. Grants temporary flight." },
      ],
      quarchon: [
        { value: "space", label: "Space — Spatial manipulation", desc: "Keen spatial awareness. Grants speed through spatial warping." },
        { value: "time", label: "Time — Temporal mastery", desc: "Slow time to survive any environment." },
        { value: "probability", label: "Probability — Chance bending", desc: "Manipulate probability to defy gravity." },
        { value: "reality", label: "Reality — Reality warping", desc: "Reshape local reality to negate damage." },
      ],
      neyon: [
        { value: "earth", label: "Earth", desc: "Stability and haste" },
        { value: "fire", label: "Fire", desc: "Passion and immunity" },
        { value: "water", label: "Water", desc: "Adaptability" },
        { value: "air", label: "Air", desc: "Freedom and flight" },
        { value: "space", label: "Space", desc: "Spatial manipulation" },
        { value: "time", label: "Time", desc: "Temporal mastery" },
        { value: "probability", label: "Probability", desc: "Chance bending" },
        { value: "reality", label: "Reality", desc: "Reality warping" },
      ],
    };
    return map[species] ?? [];
  }, [characterChoices.species]);

  // Generate starter deck from choices
  const starterDeck = useMemo(() => {
    return generateStarterDeck({
      species: characterChoices.species || undefined,
      characterClass: characterChoices.characterClass || undefined,
      alignment: characterChoices.alignment || undefined,
      element: characterChoices.element || undefined,
      name: characterChoices.name || undefined,
    });
  }, [characterChoices]);

  const handleCompleteCreation = useCallback(async () => {
    const c = characterChoices;
    if (!c.species || !c.characterClass || !c.alignment || !c.element || !c.name) return;

    try {
      await createCitizen.mutateAsync({
        name: c.name,
        species: c.species,
        characterClass: c.characterClass,
        alignment: c.alignment,
        element: c.element as any,
        attrAttack: c.attrAttack,
        attrDefense: c.attrDefense,
        attrVitality: c.attrVitality,
        ...(c.species === "neyon" && selectedNeyonTokenId ? { neyonTokenId: selectedNeyonTokenId } : {}),
      });
    } catch (err) {
      // If character already exists, that's fine — continue
      console.warn("Character creation:", err);
    }

    if (audioInitialized) playSFX("achievement");
    // Show deck reveal before navigating
    setShowDeckReveal(true);
  }, [characterChoices, createCitizen, audioInitialized, playSFX]);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: "#000" }} onClick={handleInitAudio}>
      {/* Background image with opacity transition */}
      <div className="absolute inset-0 transition-opacity duration-[3000ms]" style={{ opacity: screenOpacity * 0.4 }}>
        <img src={CRYO_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      {/* Frost overlay */}
      <AnimatePresence>
        {showFrost && awakeningStep !== "BLACKOUT" && (
          <motion.div
            initial={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(100,180,255,0.15) 70%, rgba(100,180,255,0.3) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Heartbeat overlay */}
      {heartbeat && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-red-500/50 animate-ping" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {/* ─── BLACKOUT ─── */}
          {awakeningStep === "BLACKOUT" && (
            <motion.div
              key="blackout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="font-mono text-xs text-red-400/60 animate-pulse tracking-[0.3em]">
                EMERGENCY REVIVAL PROTOCOL INITIATED
              </p>
            </motion.div>
          )}

          {/* ─── CRYO OPEN ─── */}
          {awakeningStep === "CRYO_OPEN" && (
            <ElaraDialogBox
              key="cryo"
              text="Can you hear me? Don't try to move yet. Your neural pathways are still re-establishing. The cryogenic process is... imperfect. Give yourself a moment."
              onContinue={advanceAwakening}
              showPortrait={false}
            />
          )}

          {/* ─── ELARA INTRO ─── */}
          {awakeningStep === "ELARA_INTRO" && (
            <ElaraDialogBox
              key="intro"
              text="I am Elara, the ship's intelligence. You've been in cryogenic suspension for... I can't determine how long. My chronometers are damaged. You are aboard Inception Ark Vessel 47. You are a Potential. The others — the first wave — they're gone. I don't know where. All inter-Ark communications have been severed across every known universe. We are alone."
              onContinue={advanceAwakening}
            />
          )}

          {/* ─── SPECIES QUESTION ─── */}
          {awakeningStep === "SPECIES_QUESTION" && (
            <ElaraDialogBox
              key="species"
              text="Your neural patterns are unusual. I'm running a deep scan... Your cellular structure doesn't match standard human baselines. I'm detecting traces of something else. What do you remember about your origin?"
              choices={[
                { label: "I remember the machine lattice, the digital realm...", value: "demagi", description: "DeMagi — Superhuman abilities from genetic alterations. Mastery over the elements." },
                { label: "I remember the quantum storms, the probability fields...", value: "quarchon", description: "Quarchon — Vast artificial intelligence. Cold, calculating. Masters of dimensions." },
                ...(neyonEligibility.data?.eligible
                  ? [{
                      label: "I remember both... fragments of everything...",
                      value: "neyon",
                      description: `Ne-Yon — Perfect hybrid. 1/1 NFT VERIFIED ✦ ${neyonEligibility.data.availableNeyonIds.length} Ne-Yon(s) available to bind.`,
                    }]
                  : [{
                      label: "[LOCKED] I remember both... fragments of everything...",
                      value: "neyon_locked",
                      description: neyonEligibility.data?.walletLinked === false
                        ? "Ne-Yon — Requires Potentials NFT #1-10. Link your wallet first in Settings → Wallet."
                        : "Ne-Yon — Requires ownership of Potentials NFT #1-10. Only 10 exist.",
                    }]),
              ]}
              onChoice={(v) => {
                if (v === "neyon_locked") return; // Do nothing for locked option
                if (v === "neyon" && neyonEligibility.data?.availableNeyonIds?.length === 1) {
                  // Auto-select the only available Ne-Yon
                  setSelectedNeyonTokenId(neyonEligibility.data.availableNeyonIds[0]);
                  setCharacterChoice("species", "neyon" as any);
                  advanceAwakening();
                } else if (v === "neyon") {
                  // Multiple Ne-Yons available — show picker (handled in NEYON_SELECT step)
                  setCharacterChoice("species", "neyon" as any);
                  // We'll handle token selection in the next step
                  advanceAwakening();
                } else {
                  setCharacterChoice("species", v as any);
                  advanceAwakening();
                }
              }}
            />
          )}

          {/* ─── NE-YON TOKEN PICKER (only if species=neyon and multiple tokens available) ─── */}
          {awakeningStep === "CLASS_QUESTION" && characterChoices.species === "neyon" && !selectedNeyonTokenId && neyonEligibility.data?.availableNeyonIds && neyonEligibility.data.availableNeyonIds.length > 1 && (
            <ElaraDialogBox
              key="neyon-picker"
              text="I'm detecting multiple Ne-Yon signatures in your neural imprint. Each Ne-Yon is unique — a singular entity. Which one are you?"
              choices={neyonEligibility.data.neyonDetails
                ?.filter(n => !n.bound)
                .map(n => ({
                  label: n.name || `Ne-Yon #${n.tokenId}`,
                  value: String(n.tokenId),
                  description: `Potentials NFT #${n.tokenId} — Unique 1/1 Ne-Yon. This identity will be permanently bound to your citizen.`,
                })) ?? []
              }
              onChoice={(v) => {
                setSelectedNeyonTokenId(Number(v));
                // Don't advance — let the CLASS_QUESTION render now
              }}
            />
          )}

          {/* ─── CLASS QUESTION ─── */}
          {awakeningStep === "CLASS_QUESTION" && (characterChoices.species !== "neyon" || selectedNeyonTokenId) && (
            <ElaraDialogBox
              key="class"
              text="Interesting. Your skill matrices are partially intact — the cryogenic process preserved some of your training. I can see fragments of specialized knowledge. What comes naturally to you?"
              choices={[
                { label: "I can see the code behind reality...", value: "engineer", description: "Engineer — Master builders. Start with Diamond Pick Axes." },
                { label: "I sense things before they happen...", value: "oracle", description: "Oracle (Prophet) — Seers of fate. Start with crossbow and potions." },
                { label: "I move through shadows unseen...", value: "assassin", description: "Assassin (Virus) — Silent killers. Start with poison blade." },
                { label: "I was built for war...", value: "soldier", description: "Soldier (Warrior) — Frontline fighters. Start with plasma sword." },
                { label: "I observe. I learn. I adapt...", value: "spy", description: "Spy — Intelligence operatives. Stealth and deception." },
              ]}
              onChoice={(v) => {
                setCharacterChoice("characterClass", v as any);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── ALIGNMENT QUESTION ─── */}
          {awakeningStep === "ALIGNMENT_QUESTION" && (
            <ElaraDialogBox
              key="alignment"
              text="There's a fundamental question every Potential must answer. The Architect built the Panopticon to impose order — surveillance, control, a perfect machine. The Dreamer believed in the chaos of free will — unpredictable, dangerous, alive. The war between them tore reality apart. Where do you stand?"
              choices={[
                { label: "Order. Structure. Control.", value: "order", description: "Orderly, disciplined. Light glow aura. +2 Attack bonus on cards." },
                { label: "Freedom. Chaos. Choice.", value: "chaos", description: "Chaotic, brave. Dark glow aura. +2 Defense bonus on cards." },
              ]}
              onChoice={(v) => {
                setCharacterChoice("alignment", v as any);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── ELEMENT QUESTION ─── */}
          {awakeningStep === "ELEMENT_QUESTION" && (
            <ElaraDialogBox
              key="element"
              text={characterChoices.species === "demagi"
                ? "Your DeMagi heritage grants you mastery over one of the primal elements. Which force resonates with your soul?"
                : characterChoices.species === "quarchon"
                ? "Your Quarchon nature gives you dominion over one dimension of reality. Which dimension calls to you?"
                : "As a Ne-Yon hybrid, you can attune to any force — elemental or dimensional. Choose your affinity."
              }
              choices={availableElements.map(e => ({
                label: e.label,
                value: e.value,
                description: e.desc,
              }))}
              onChoice={(v) => {
                setCharacterChoice("element", v);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── NAME INPUT ─── */}
          {awakeningStep === "NAME_INPUT" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl mx-auto"
            >
              <ElaraDialogBox
                text="One last thing. The cryo manifest lists you by serial number, but every Potential deserves a name. What should I call you?"
                showPortrait={true}
              />
              <div className="mt-4 max-w-md mx-auto">
                <div className="rounded-lg p-4" style={{
                  background: "linear-gradient(135deg, rgba(1,0,32,0.95) 0%, rgba(10,12,43,0.95) 100%)",
                  border: "1px solid rgba(51,226,230,0.2)",
                }}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={64}
                    className="w-full bg-transparent border-b border-[var(--neon-cyan)]/30 pb-2 font-mono text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[var(--neon-cyan)]/60"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === "Enter" && nameInput.trim().length >= 2) {
                        setCharacterChoice("name", nameInput.trim());
                        advanceAwakening();
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (nameInput.trim().length >= 2) {
                        setCharacterChoice("name", nameInput.trim());
                        advanceAwakening();
                      }
                    }}
                    disabled={nameInput.trim().length < 2}
                    className="mt-3 w-full py-2 rounded-md font-mono text-xs tracking-wider transition-all disabled:opacity-30"
                    style={{
                      background: nameInput.trim().length >= 2 ? "rgba(51,226,230,0.12)" : "transparent",
                      border: "1px solid rgba(51,226,230,0.2)",
                      color: "var(--neon-cyan)",
                    }}
                  >
                    CONFIRM IDENTITY
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ATTRIBUTES ─── */}
          {awakeningStep === "ATTRIBUTES" && (
            <motion.div
              key="attrs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="mb-4">
                <ElaraDialogBox
                  text={`Good. ${characterChoices.name}, I need to calibrate your neural interface. This will determine your combat capabilities. Distribute your attribute points carefully — they define who you are.`}
                  showPortrait={true}
                />
              </div>
              <AttributeAllocator
                attack={characterChoices.attrAttack}
                defense={characterChoices.attrDefense}
                vitality={characterChoices.attrVitality}
                onChange={(a, d, v) => {
                  setCharacterChoice("attrAttack", a);
                  setCharacterChoice("attrDefense", d);
                  setCharacterChoice("attrVitality", v);
                }}
                onConfirm={advanceAwakening}
              />
            </motion.div>
          )}

          {/* ─── FIRST STEPS ─── */}
          {awakeningStep === "FIRST_STEPS" && !showDeckReveal && (
            <ElaraDialogBox
              key="first-steps"
              text={`Welcome aboard, ${characterChoices.name}. Your Citizen profile has been created. You are ${characterChoices.species === "demagi" ? "a DeMagi" : characterChoices.species === "quarchon" ? "a Quarchon" : "a Ne-Yon"} ${characterChoices.characterClass}, aligned with ${characterChoices.alignment}. Your quarters are through that door — the Cryo Bay. The rest of the ship... I'll need your help to restore power to the other decks. There's so much I need to show you. And so much I need to warn you about.`}
              onContinue={handleCompleteCreation}
            />
          )}

          {/* ─── STARTER DECK REVEAL ─── */}
          {showDeckReveal && (
            <motion.div
              key="deck-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl mx-auto"
            >
              <StarterDeckViewer
                cards={starterDeck}
                onClose={() => {
                  completeAwakening();
                  discoverEntry("awakening-complete");
                  navigate("/ark");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button (bottom corner) */}
      {awakeningStep !== "BLACKOUT" && awakeningStep !== "FIRST_STEPS" && (
        <button
          onClick={() => {
            setAwakeningStep("FIRST_STEPS");
            setCharacterChoice("species", characterChoices.species || "human" as any);
            setCharacterChoice("characterClass", characterChoices.characterClass || "soldier" as any);
            setCharacterChoice("alignment", characterChoices.alignment || "order" as any);
            setCharacterChoice("element", characterChoices.element || "earth");
            setCharacterChoice("name", characterChoices.name || "Operative");
          }}
          className="fixed bottom-4 right-4 z-50 font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors px-3 py-1.5 rounded border border-white/10 hover:border-white/20"
        >
          SKIP INTRO &gt;&gt;
        </button>
      )}
    </div>
  );
}
