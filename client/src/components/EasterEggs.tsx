/* ═══════════════════════════════════════════════════════
   EASTER EGGS — Hidden content, secret commands, and
   Konami code-style unlocks for the Dischordian Saga.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Eye, Zap, Lock, X, Sparkles } from "lucide-react";

/* ─── KONAMI CODE SEQUENCE ─── */
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/* ─── SECRET COMMANDS (typed anywhere) ─── */
const SECRET_COMMANDS: Record<string, { title: string; message: string; xp: number }> = {
  "panopticon": {
    title: "THE PANOPTICON SEES ALL",
    message: "You have invoked the name of the all-seeing prison. The Architect is watching. +25 XP",
    xp: 25,
  },
  "malkia": {
    title: "THE ENIGMA AWAKENS",
    message: "Malkia Ukweli — the Enigma — acknowledges your presence. Truth is the ultimate weapon. +25 XP",
    xp: 25,
  },
  "danielcross": {
    title: "THE PROGRAMMER'S SECRET",
    message: "Dr. Daniel Cross... the Programmer who travels through time. He will eventually become someone else entirely. +50 XP",
    xp: 50,
  },
  "antiquarian": {
    title: "▓▓▓ CLASSIFIED ▓▓▓",
    message: "How do you know that name? The Antiquarian's identity is beyond your clearance level. This information has been logged. +100 XP",
    xp: 100,
  },
  "inception": {
    title: "ARK SYSTEMS ONLINE",
    message: "The Inception Arks carry the last hope of civilization through the void between realities. You are aboard one now. +15 XP",
    xp: 15,
  },
  "warden": {
    title: "THE WARDEN IS DEAD",
    message: "Malkia killed the Warden during the Fall of the Panopticon. The chaos that followed allowed the Meme to assume a new identity... +30 XP",
    xp: 30,
  },
  "falseprophet": {
    title: "THE CLONE SPEAKS",
    message: "A clone of the Oracle was used as the False Prophet, contributing to the Fall of Reality. But the real Oracle endures. +30 XP",
    xp: 30,
  },
  "whiteoracle": {
    title: "IDENTITY COMPROMISED",
    message: "The White Oracle — guardian of the crystal pyramid city — is believed to be the Oracle reawakened. But it is actually the Meme, hiding in plain sight. +50 XP",
    xp: 50,
  },
  "mindswap": {
    title: "THE ENGINEER'S GAMBIT",
    message: "The Engineer was betrayed by Warlord Zero. A mind swap reversal put the Engineer into Agent Zero's body. The Engineer is secretly among the Potentials. +50 XP",
    xp: 50,
  },
};

/* ─── DISCOVERED SECRETS STORAGE ─── */
const SECRETS_KEY = "loredex_discovered_secrets";

function getDiscoveredSecrets(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SECRETS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDiscoveredSecret(secret: string) {
  const discovered = getDiscoveredSecrets();
  if (!discovered.includes(secret)) {
    discovered.push(secret);
    localStorage.setItem(SECRETS_KEY, JSON.stringify(discovered));
  }
}

/* ═══ MAIN COMPONENT ═══ */
export default function EasterEggs() {
  const gamification = useGamification();
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState("");
  const [showSecret, setShowSecret] = useState<{ title: string; message: string } | null>(null);
  const [konamiActivated, setKonamiActivated] = useState(false);

  const triggerSecret = useCallback(
    (key: string, secret: { title: string; message: string; xp: number }) => {
      const discovered = getDiscoveredSecrets();
      const isNew = !discovered.includes(key);

      setShowSecret({ title: secret.title, message: secret.message });
      saveDiscoveredSecret(key);

      if (isNew) {
        // Award XP for first discovery
        toast.success(`Secret discovered: ${secret.title}`, {
          description: `+${secret.xp} XP`,
        });
      }

      // Auto-hide after 6 seconds
      setTimeout(() => setShowSecret(null), 6000);
    },
    [gamification]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Konami code detection
      if (e.key === KONAMI_CODE[konamiProgress]) {
        const next = konamiProgress + 1;
        setKonamiProgress(next);
        if (next === KONAMI_CODE.length) {
          setKonamiProgress(0);
          if (!konamiActivated) {
            setKonamiActivated(true);
            triggerSecret("konami", {
              title: "KONAMI CODE ACTIVATED",
              message: "The ancient code has been entered. The CoNexus recognizes you as a true gamer. All secrets are closer to being revealed. +75 XP",
              xp: 75,
            });
          }
        }
      } else if (e.key === KONAMI_CODE[0]) {
        setKonamiProgress(1);
      } else {
        setKonamiProgress(0);
      }

      // Secret word detection
      const char = e.key.length === 1 ? e.key.toLowerCase() : "";
      if (char) {
        const newBuffer = (typedBuffer + char).slice(-20); // Keep last 20 chars
        setTypedBuffer(newBuffer);

        // Check all secret commands
        for (const [cmd, secret] of Object.entries(SECRET_COMMANDS)) {
          if (newBuffer.endsWith(cmd)) {
            triggerSecret(cmd, secret);
            setTypedBuffer("");
            break;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiProgress, typedBuffer, konamiActivated, triggerSecret]);

  return (
    <AnimatePresence>
      {showSecret && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-md"
        >
          <div
            className="rounded-xl p-4 sm:p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(10,10,15,0.98) 0%, rgba(30,5,50,0.98) 100%)",
              border: "1px solid rgba(160,120,255,0.4)",
              boxShadow: "0 0 40px rgba(160,120,255,0.2), 0 0 80px rgba(160,120,255,0.1)",
            }}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[var(--deep-purple)]"
                  initial={{ x: Math.random() * 400, y: Math.random() * 200, opacity: 0 }}
                  animate={{
                    y: [null, -100],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
              ))}
            </div>

            <button
              onClick={() => setShowSecret(null)}
              className="absolute top-2 right-2 p-1 rounded-md text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[var(--deep-purple)]" />
              <span className="font-display text-[10px] font-bold tracking-[0.3em] text-[var(--deep-purple)]">
                SECRET DISCOVERED
              </span>
            </div>

            <h3 className="font-display text-sm font-bold tracking-wider text-white mb-2">
              {showSecret.title}
            </h3>
            <p className="font-mono text-[11px] text-white/60 leading-relaxed">
              {showSecret.message}
            </p>

            {/* Secret count */}
            <div className="mt-3 pt-2 border-t border-white/10">
              <p className="font-mono text-[9px] text-white/25">
                SECRETS FOUND: {getDiscoveredSecrets().length} / {Object.keys(SECRET_COMMANDS).length + 1}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══ SECRETS PROGRESS COMPONENT (for use in profile/trophy pages) ═══ */
export function SecretsProgress() {
  const discovered = getDiscoveredSecrets();
  const total = Object.keys(SECRET_COMMANDS).length + 1; // +1 for Konami
  const pct = (discovered.length / total) * 100;

  if (discovered.length === 0) return null;

  return (
    <div className="rounded-lg p-3 border border-[var(--deep-purple)]/20 bg-[var(--deep-purple)]/5">
      <div className="flex items-center gap-2 mb-2">
        <Lock size={12} className="text-[var(--deep-purple)]" />
        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--deep-purple)]">SECRETS</span>
        <span className="font-mono text-[9px] text-white/25 ml-auto">{discovered.length}/{total}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--deep-purple), var(--neon-cyan))",
          }}
        />
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.keys(SECRET_COMMANDS).map((key) => (
          <div
            key={key}
            className={`w-3 h-3 rounded-sm ${
              discovered.includes(key)
                ? "bg-[var(--deep-purple)]/60"
                : "bg-white/5"
            }`}
            title={discovered.includes(key) ? key : "???"}
          />
        ))}
        <div
          className={`w-3 h-3 rounded-sm ${
            discovered.includes("konami")
              ? "bg-[var(--neon-cyan)]/60"
              : "bg-white/5"
          }`}
          title={discovered.includes("konami") ? "Konami Code" : "???"}
        />
      </div>
    </div>
  );
}
