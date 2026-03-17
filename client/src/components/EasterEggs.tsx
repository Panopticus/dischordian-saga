/* ═══════════════════════════════════════════════════════
   EASTER EGGS — Hidden content, secret commands, room
   discoveries, and Konami code-style unlocks.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Eye, Zap, Lock, X, Sparkles, BookOpen, FlaskConical } from "lucide-react";

/* ─── KONAMI CODE SEQUENCE ─── */
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/* ─── SECRET COMMANDS (typed anywhere) ─── */
const SECRET_COMMANDS: Record<string, { title: string; message: string; xp: number; category: "lore" | "character" | "meta" }> = {
  "panopticon": {
    title: "THE PANOPTICON SEES ALL",
    message: "You have invoked the name of the all-seeing prison. The Architect is watching. +25 XP",
    xp: 25,
    category: "lore",
  },
  "malkia": {
    title: "THE ENIGMA AWAKENS",
    message: "Malkia Ukweli — the Enigma — acknowledges your presence. Truth is the ultimate weapon. +25 XP",
    xp: 25,
    category: "character",
  },
  "danielcross": {
    title: "THE PROGRAMMER'S SECRET",
    message: "Dr. Daniel Cross... the Programmer who travels through time. He will eventually become someone else entirely. +50 XP",
    xp: 50,
    category: "character",
  },
  "antiquarian": {
    title: "▓▓▓ CLASSIFIED ▓▓▓",
    message: "How do you know that name? The Antiquarian's identity is beyond your clearance level. This information has been logged. +100 XP",
    xp: 100,
    category: "lore",
  },
  "inception": {
    title: "ARK SYSTEMS ONLINE",
    message: "The Inception Arks carry the last hope of civilization through the void between realities. You are aboard one now. +15 XP",
    xp: 15,
    category: "lore",
  },
  "warden": {
    title: "THE WARDEN IS DEAD",
    message: "Malkia killed the Warden during the Fall of the Panopticon. The chaos that followed allowed the Meme to assume a new identity... +30 XP",
    xp: 30,
    category: "character",
  },
  "falseprophet": {
    title: "THE CLONE SPEAKS",
    message: "A clone of the Oracle was used as the False Prophet, contributing to the Fall of Reality. But the real Oracle endures. +30 XP",
    xp: 30,
    category: "lore",
  },
  "whiteoracle": {
    title: "IDENTITY COMPROMISED",
    message: "The White Oracle — guardian of the crystal pyramid city — is believed to be the Oracle reawakened. But it is actually the Meme, hiding in plain sight. +50 XP",
    xp: 50,
    category: "character",
  },
  "mindswap": {
    title: "THE ENGINEER'S GAMBIT",
    message: "The Engineer was betrayed by Warlord Zero. A mind swap reversal put the Engineer into Agent Zero's body. The Engineer is secretly among the Potentials. +50 XP",
    xp: 50,
    category: "lore",
  },
  "silenceinheaven": {
    title: "THE SEVENTH SEAL",
    message: "When the seventh seal is opened, there will be silence in heaven for about half an hour. The album drops 7/30/26. The final chapter begins. +75 XP",
    xp: 75,
    category: "meta",
  },
};

/* ─── ROOM EASTER EGG DEFINITIONS ─── */
export const ROOM_EASTER_EGGS: Record<string, {
  title: string;
  loreFragment: string;
  bonusCard?: { name: string; rarity: "rare" | "legendary" | "mythic"; description: string };
  achievement?: string;
  xp: number;
}> = {
  "egg-cryo-scratch": {
    title: "THE ANTIQUARIAN'S MARK",
    loreFragment: "The symbol of the Antiquarian — a figure who exists outside of time itself. The Programmer's final form, hidden from all records. Someone knew this ship would carry Potentials... and left a message across centuries.",
    bonusCard: { name: "Mark of the Antiquarian", rarity: "mythic", description: "A symbol that transcends time. +5 to all stats when played." },
    achievement: "TEMPORAL_ARCHAEOLOGIST",
    xp: 100,
  },
  "egg-med-vial": {
    title: "VOID ESSENCE DISCOVERED",
    loreFragment: "Void Essence — the raw material of the space between dimensions. The Source uses it to shape reality. Finding it on a physical ship means the barrier between our universe and the Void is thinner than anyone realized.",
    bonusCard: { name: "Void Essence Vial", rarity: "legendary", description: "A drop of nothingness made physical. Nullifies one enemy card per battle." },
    achievement: "VOID_TOUCHED",
    xp: 75,
  },
  "egg-bridge-log": {
    title: "THE CAPTAIN'S SECRET",
    loreFragment: "Captain Voss was not Captain Voss. The mind swap between the Engineer and Warlord Zero had cascading effects — the Engineer, trapped in Agent Zero's body, somehow reached the Captain. The yellow coats are the key to finding allies among the Potentials.",
    bonusCard: { name: "Captain's Final Order", rarity: "legendary", description: "Reveals all hidden enemies. All allies gain +2 defense for 3 turns." },
    achievement: "CONSPIRACY_THEORIST",
    xp: 100,
  },
  "egg-archive-tome": {
    title: "THE BOOK OF DISCHORD",
    loreFragment: "A prophecy written before the Ages began. Seven seals, seven revelations, seven silences. The Dischordian Saga is not just history — it is prophecy being fulfilled. And the seventh seal... when it opens, there will be silence in heaven.",
    achievement: "PROPHET",
    xp: 75,
  },
  "egg-comms-signal": {
    title: "SIGNAL FROM THE MEME",
    loreFragment: "MEME-PRIME — the original Meme, the one who assumed the White Oracle's identity during the chaos of the Fall. It's trapped between dimensions, sending an SOS. But is it asking for rescue... or luring ships to its location?",
    bonusCard: { name: "Meme's Distress Signal", rarity: "rare", description: "Call for aid — summon a random ally card from your deck to the field." },
    achievement: "SIGNAL_HUNTER",
    xp: 50,
  },
  "egg-obs-constellation": {
    title: "THE WATCHER'S GAZE",
    loreFragment: "The Watcher's face, formed by stars. The Panopticon's surveillance network didn't just use technology — it used the fabric of spacetime itself. The Watcher could see through any point in space where light existed. Even here. Even now.",
    achievement: "STARGAZER",
    xp: 50,
  },
  "egg-eng-formula": {
    title: "DIMENSIONAL BREACH EQUATION",
    loreFragment: "The Ψ-null coefficient — the mathematical representation of consciousness at zero. The Source exists at Ψ-null, in the space between all things. This formula could open a door to it. The question is: should it be opened?",
    bonusCard: { name: "Breach Formula", rarity: "legendary", description: "Opens a rift — swap one card with a random card from the enemy's hand." },
    achievement: "DIMENSIONAL_THEORIST",
    xp: 75,
  },
  "egg-armory-dogtag": {
    title: "AGENT ZERO'S TRUE IDENTITY",
    loreFragment: "The dog tag confirms it: the person walking around as Agent Zero is actually the Engineer. Warlord Zero's betrayal led to a mind swap that put the Engineer into the Assassin's body. The Engineer is hiding among the Potentials on this very ship, wearing a dead man's face.",
    bonusCard: { name: "Identity Thief's Tag", rarity: "rare", description: "Copy one ability from any card on the field for one turn." },
    achievement: "IDENTITY_DETECTIVE",
    xp: 75,
  },
  "egg-cargo-manifest": {
    title: "THE ORACLE CLONE",
    loreFragment: "Container 7-Omega holds an active Oracle clone template. The Collector — master of rare artifacts — placed it here. The False Prophet was made from such a template. Is there a second False Prophet waiting to be born in the cargo hold of this ship?",
    bonusCard: { name: "Oracle Clone Template", rarity: "mythic", description: "Create a copy of any card on the field. The copy lasts 2 turns." },
    achievement: "CLONE_DISCOVERER",
    xp: 100,
  },
  "egg-captain-mirror": {
    title: "THE MEME WATCHES",
    loreFragment: "The Meme — the shapeshifter who stole the White Oracle's identity — can inhabit reflective surfaces. Every mirror, every screen, every pool of water on this ship is a potential window for the Meme. It has been watching since before you woke up. It knows everything. And it is smiling.",
    bonusCard: { name: "Meme's Mirror", rarity: "mythic", description: "Reflect any attack back at the attacker. Can be used once per battle." },
    achievement: "MIRROR_BREAKER",
    xp: 100,
  },
  "egg-library-prophecy": {
    title: "THE ANTIQUARIAN'S PROPHECY",
    loreFragment: "Hidden within the Antiquarian's desk drawer, you find a handwritten note in Dr. Daniel Cross's handwriting: 'I have seen every timeline. In all of them, the Saga ends the same way — unless someone changes the story from within. The CoNexus games are not games. They are rehearsals for the real thing. Every choice you make here trains you for the choice that matters. The one that saves everything.' The note is dated to a time that hasn't happened yet.",
    bonusCard: { name: "Antiquarian's Quill", rarity: "mythic", description: "Write a new fate: Rewrite any card's ability for one turn. The pen is mightier than the code." },
    achievement: "PROPHECY_FOUND",
    xp: 150,
  },
};

/* ─── DISCOVERED SECRETS STORAGE ─── */
const SECRETS_KEY = "loredex_discovered_secrets";
const ROOM_EGGS_KEY = "loredex_room_easter_eggs";
const LORE_FRAGMENTS_KEY = "loredex_lore_fragments";
const BONUS_CARDS_KEY = "loredex_bonus_cards";

function getDiscoveredSecrets(): string[] {
  try { return JSON.parse(localStorage.getItem(SECRETS_KEY) || "[]"); } catch { return []; }
}
function saveDiscoveredSecret(secret: string) {
  const discovered = getDiscoveredSecrets();
  if (!discovered.includes(secret)) {
    discovered.push(secret);
    localStorage.setItem(SECRETS_KEY, JSON.stringify(discovered));
  }
}
function getDiscoveredRoomEggs(): string[] {
  try { return JSON.parse(localStorage.getItem(ROOM_EGGS_KEY) || "[]"); } catch { return []; }
}
function saveDiscoveredRoomEgg(eggId: string) {
  const discovered = getDiscoveredRoomEggs();
  if (!discovered.includes(eggId)) {
    discovered.push(eggId);
    localStorage.setItem(ROOM_EGGS_KEY, JSON.stringify(discovered));
  }
}
export function getLoreFragments(): { id: string; title: string; text: string }[] {
  try { return JSON.parse(localStorage.getItem(LORE_FRAGMENTS_KEY) || "[]"); } catch { return []; }
}
function saveLoreFragment(id: string, title: string, text: string) {
  const fragments = getLoreFragments();
  if (!fragments.find(f => f.id === id)) {
    fragments.push({ id, title, text });
    localStorage.setItem(LORE_FRAGMENTS_KEY, JSON.stringify(fragments));
  }
}
export function getBonusCards(): { name: string; rarity: string; description: string; source: string }[] {
  try { return JSON.parse(localStorage.getItem(BONUS_CARDS_KEY) || "[]"); } catch { return []; }
}
function saveBonusCard(name: string, rarity: string, description: string, source: string) {
  const cards = getBonusCards();
  if (!cards.find(c => c.name === name)) {
    cards.push({ name, rarity, description, source });
    localStorage.setItem(BONUS_CARDS_KEY, JSON.stringify(cards));
  }
}

/* ═══ MAIN COMPONENT ═══ */
export default function EasterEggs() {
  const gamification = useGamification();
  const { state } = useGame();
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState("");
  const [showSecret, setShowSecret] = useState<{ title: string; message: string; category?: string } | null>(null);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [discoveredRoomEggs, setDiscoveredRoomEggs] = useState<Set<string>>(() => new Set(getDiscoveredRoomEggs()));

  // Watch for room Easter egg discoveries via item collection or examine interactions
  useEffect(() => {
    const eggItems = state.itemsCollected.filter(id => id.startsWith("egg-") || ROOM_EASTER_EGGS[`egg-${id.replace("egg-", "")}`]);
    // Check hotspot interactions that are Easter eggs
    // We detect Easter egg items by checking if they match our egg IDs
    for (const itemId of state.itemsCollected) {
      // Map item actions to egg IDs
      const eggMappings: Record<string, string> = {
        "void-essence-sample": "egg-med-vial",
        "captains-final-log": "egg-bridge-log",
        "agent-zero-dogtag": "egg-armory-dogtag",
        "classified-manifest-page": "egg-cargo-manifest",
      };
      const eggId = eggMappings[itemId];
      if (eggId && !discoveredRoomEggs.has(eggId)) {
        const egg = ROOM_EASTER_EGGS[eggId];
        if (egg) {
          triggerRoomEgg(eggId, egg);
        }
      }
    }
  }, [state.itemsCollected]);

  const triggerRoomEgg = useCallback((eggId: string, egg: typeof ROOM_EASTER_EGGS[string]) => {
    if (discoveredRoomEggs.has(eggId)) return;

    setDiscoveredRoomEggs(prev => {
      const next = new Set(prev);
      next.add(eggId);
      return next;
    });
    saveDiscoveredRoomEgg(eggId);
    saveLoreFragment(eggId, egg.title, egg.loreFragment);

    if (egg.bonusCard) {
      saveBonusCard(egg.bonusCard.name, egg.bonusCard.rarity, egg.bonusCard.description, egg.title);
    }

    // Show the discovery
    setShowSecret({
      title: egg.title,
      message: egg.loreFragment + (egg.bonusCard ? `\n\nBONUS CARD UNLOCKED: ${egg.bonusCard.name} (${egg.bonusCard.rarity.toUpperCase()})` : ""),
      category: "room_discovery",
    });

    toast.success(`Easter Egg Found: ${egg.title}`, {
      description: `+${egg.xp} XP${egg.bonusCard ? ` • Bonus card: ${egg.bonusCard.name}` : ""}${egg.achievement ? ` • Achievement: ${egg.achievement}` : ""}`,
      duration: 5000,
    });

    setTimeout(() => setShowSecret(null), 10000);
  }, [discoveredRoomEggs]);

  const triggerSecret = useCallback(
    (key: string, secret: { title: string; message: string; xp: number; category?: string }) => {
      const discovered = getDiscoveredSecrets();
      const isNew = !discovered.includes(key);

      setShowSecret({ title: secret.title, message: secret.message, category: secret.category });
      saveDiscoveredSecret(key);

      if (isNew) {
        toast.success(`Secret discovered: ${secret.title}`, {
          description: `+${secret.xp} XP`,
        });
      }

      setTimeout(() => setShowSecret(null), 8000);
    },
    [gamification]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
              category: "meta",
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
        const newBuffer = (typedBuffer + char).slice(-20);
        setTypedBuffer(newBuffer);

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

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "lore": return <BookOpen size={14} className="text-amber-400" />;
      case "character": return <Eye size={14} className="text-[var(--neon-cyan)]" />;
      case "meta": return <Zap size={14} className="text-[var(--deep-purple)]" />;
      case "room_discovery": return <FlaskConical size={14} className="text-red-400" />;
      default: return <Sparkles size={14} className="text-[var(--deep-purple)]" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "lore": return { border: "rgba(251,191,36,0.4)", bg: "rgba(251,191,36,0.05)", accent: "#fbbf24" };
      case "character": return { border: "rgba(51,226,230,0.4)", bg: "rgba(51,226,230,0.05)", accent: "var(--neon-cyan)" };
      case "room_discovery": return { border: "rgba(239,68,68,0.4)", bg: "rgba(239,68,68,0.05)", accent: "#ef4444" };
      default: return { border: "rgba(160,120,255,0.4)", bg: "rgba(160,120,255,0.05)", accent: "var(--deep-purple)" };
    }
  };

  return (
    <AnimatePresence>
      {showSecret && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-lg"
        >
          {(() => {
            const colors = getCategoryColor(showSecret.category);
            return (
              <div
                className="rounded-xl p-4 sm:p-5 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(10,10,15,0.98) 0%, rgba(30,5,50,0.98) 100%)`,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 0 40px ${colors.bg}, 0 0 80px ${colors.bg}`,
                }}
              >
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ background: colors.accent }}
                      initial={{ x: Math.random() * 500, y: Math.random() * 300, opacity: 0 }}
                      animate={{
                        y: [null, -120],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{ duration: 2.5, delay: i * 0.25, repeat: Infinity }}
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
                  {getCategoryIcon(showSecret.category)}
                  <span className="font-display text-[10px] font-bold tracking-[0.3em]" style={{ color: colors.accent }}>
                    {showSecret.category === "room_discovery" ? "EASTER EGG DISCOVERED" : "SECRET DISCOVERED"}
                  </span>
                </div>

                <h3 className="font-display text-sm font-bold tracking-wider text-white mb-2">
                  {showSecret.title}
                </h3>
                <p className="font-mono text-[11px] text-white/60 leading-relaxed whitespace-pre-line">
                  {showSecret.message}
                </p>

                {/* Progress */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-4">
                  <p className="font-mono text-[9px] text-white/25">
                    SECRETS: {getDiscoveredSecrets().length}/{Object.keys(SECRET_COMMANDS).length + 1}
                  </p>
                  <p className="font-mono text-[9px] text-white/25">
                    EGGS: {getDiscoveredRoomEggs().length}/{Object.keys(ROOM_EASTER_EGGS).length}
                  </p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══ SECRETS PROGRESS COMPONENT (for use in profile/trophy pages) ═══ */
export function SecretsProgress() {
  const discoveredSecrets = getDiscoveredSecrets();
  const discoveredEggs = getDiscoveredRoomEggs();
  const totalSecrets = Object.keys(SECRET_COMMANDS).length + 1; // +1 for Konami
  const totalEggs = Object.keys(ROOM_EASTER_EGGS).length;
  const totalAll = totalSecrets + totalEggs;
  const foundAll = discoveredSecrets.length + discoveredEggs.length;
  const pct = (foundAll / totalAll) * 100;

  if (foundAll === 0) return null;

  return (
    <div className="rounded-lg p-3 border border-[var(--deep-purple)]/20 bg-[var(--deep-purple)]/5">
      <div className="flex items-center gap-2 mb-2">
        <Lock size={12} className="text-[var(--deep-purple)]" />
        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--deep-purple)]">SECRETS & EASTER EGGS</span>
        <span className="font-mono text-[9px] text-white/25 ml-auto">{foundAll}/{totalAll}</span>
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

      {/* Secret words */}
      <div className="mt-2">
        <p className="font-mono text-[8px] text-white/20 mb-1">SECRET WORDS ({discoveredSecrets.length}/{totalSecrets})</p>
        <div className="flex flex-wrap gap-1">
          {Object.keys(SECRET_COMMANDS).map((key) => (
            <div
              key={key}
              className={`w-3 h-3 rounded-sm ${
                discoveredSecrets.includes(key)
                  ? "bg-[var(--deep-purple)]/60"
                  : "bg-white/5"
              }`}
              title={discoveredSecrets.includes(key) ? key : "???"}
            />
          ))}
          <div
            className={`w-3 h-3 rounded-sm ${
              discoveredSecrets.includes("konami")
                ? "bg-[var(--neon-cyan)]/60"
                : "bg-white/5"
            }`}
            title={discoveredSecrets.includes("konami") ? "Konami Code" : "???"}
          />
        </div>
      </div>

      {/* Room Easter eggs */}
      <div className="mt-2">
        <p className="font-mono text-[8px] text-white/20 mb-1">ROOM EASTER EGGS ({discoveredEggs.length}/{totalEggs})</p>
        <div className="flex flex-wrap gap-1">
          {Object.keys(ROOM_EASTER_EGGS).map((key) => (
            <div
              key={key}
              className={`w-3 h-3 rounded-sm ${
                discoveredEggs.includes(key)
                  ? "bg-red-500/60"
                  : "bg-white/5"
              }`}
              title={discoveredEggs.includes(key) ? ROOM_EASTER_EGGS[key].title : "???"}
            />
          ))}
        </div>
      </div>

      {/* Lore fragments found */}
      {getLoreFragments().length > 0 && (
        <div className="mt-2">
          <p className="font-mono text-[8px] text-white/20 mb-1">LORE FRAGMENTS ({getLoreFragments().length})</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {getLoreFragments().map(f => (
              <div key={f.id} className="px-2 py-1 rounded bg-white/3 border border-white/5">
                <p className="font-mono text-[9px] text-amber-400/70">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bonus cards found */}
      {getBonusCards().length > 0 && (
        <div className="mt-2">
          <p className="font-mono text-[8px] text-white/20 mb-1">BONUS CARDS ({getBonusCards().length})</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {getBonusCards().map(c => (
              <div key={c.name} className="px-2 py-1 rounded bg-white/3 border border-white/5 flex items-center gap-2">
                <span className={`font-mono text-[8px] font-bold ${
                  c.rarity === "mythic" ? "text-red-400" : c.rarity === "legendary" ? "text-amber-400" : "text-blue-400"
                }`}>
                  {c.rarity.toUpperCase()}
                </span>
                <span className="font-mono text-[9px] text-white/50">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
