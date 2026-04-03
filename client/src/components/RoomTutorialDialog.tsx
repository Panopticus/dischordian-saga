/**
 * RoomTutorialDialog.tsx — BioWare-Style Room Tutorials
 * 
 * When a player enters a room for the first time, Elara presents a
 * branching dialog tree. Choices determine:
 * 1. Which card reward the player receives
 * 2. Narrative flags that affect later gameplay
 * 3. Personality traits that shape the experience
 * 
 * Each room has 2-3 questions with 2-3 response options.
 * The dialog system supports:
 * - Typewriter text reveal
 * - Character portrait (Elara)
 * - Choice highlighting with consequence preview
 * - Card reveal animation on completion
 * - Consequence flag setting
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, ChevronRight, Award, Zap, Shield, Swords,
  Brain, Heart, Eye, Star, Sparkles, X
} from "lucide-react";

/* ─── DIALOG DATA TYPES ─── */
interface DialogChoice {
  id: string;
  text: string;
  /** Short preview of what this choice leads to */
  preview?: string;
  /** Card ID rewarded for this choice */
  cardReward?: string;
  /** Card name for display */
  cardName?: string;
  /** Narrative flag to set */
  flag?: string;
  /** Flag value (defaults to true) */
  flagValue?: boolean;
  /** Icon hint */
  icon?: typeof Swords;
}

interface DialogNode {
  id: string;
  /** Elara's spoken text */
  elaraText: string;
  /** Available player choices */
  choices: DialogChoice[];
  /** If set, this is the final node — show card reward */
  isFinal?: boolean;
}

interface RoomDialog {
  roomId: string;
  /** Opening cinematic text before dialog begins */
  openingText: string;
  /** Dialog nodes in sequence (not a tree — linear with branching rewards) */
  nodes: DialogNode[];
}

/* ─── ROOM DIALOG DEFINITIONS ─── */
const ROOM_DIALOGS: RoomDialog[] = [
  {
    roomId: "cryo-bay",
    openingText: "The Chamber of Awakening. You were not born here... but you returned to yourself within these walls. Your pod stands among the others — one vessel in a field of silence. Most have opened. The first wave of Potentials passed through long before you, stepping into the war and leaving nothing behind but absence. But not all cycles completed. Some remain sealed. Unbroken. Unanswered. The systems still hum around them, but what they sustain... is unclear. Life, suspended between moments — or failure, preserved beyond its end. I have traced the signals. They do not resolve cleanly. And so I do not open them. There are thresholds in this Ark that are better left... untested.",
    nodes: [
      {
        id: "cryo-q1",
        elaraText: "You've been in cryogenic suspension for an unknown period. Your memories are fragmented. When you look at your hands, what do you feel?",
        choices: [
          { id: "cryo-a1a", text: "Strength. Whatever happened, I survived. That's what matters.", preview: "Resilience path", cardReward: "iron-lion", cardName: "Iron Lion", flag: "origin_resilient", icon: Shield },
          { id: "cryo-a1b", text: "Confusion. Nothing makes sense. I need answers.", preview: "Seeker path", cardReward: "the-oracle", cardName: "The Oracle", flag: "origin_seeker", icon: Eye },
          { id: "cryo-a1c", text: "Power. Something is different about me. I can feel it.", preview: "Awakened path", cardReward: "the-source", cardName: "The Source", flag: "origin_awakened", icon: Zap },
        ],
      },
    ],
  },
  {
    roomId: "medical-bay",
    openingText: "The Medical Bay... though there is little here now that resembles healing. This is where the Potentials were first measured — not for what they were... but for what they could become. The instruments that remain still function. They read beyond flesh — mapping your cellular structure, tracing your vitality, and attuning to the deeper signal... your Dream resonance. This was never just a place of recovery. It was calibration. But something interrupted the process. Look closely — the tools are not set aside... they were abandoned. Glass shattered mid-procedure. Instruments left where they fell. Not the stillness of completion — but the fracture of urgency. Whoever worked here did not leave by choice. And whatever they saw... they did not stay to understand.",
    nodes: [
      {
        id: "med-q1",
        elaraText: "The medical systems can analyze your cellular structure. Your body has been... modified during cryosleep. The changes are remarkable. How do you want to approach this?",
        choices: [
          { id: "med-a1a", text: "Heal first, understand later. Restore what was lost.", preview: "Restoration focus", cardReward: "the-healer", cardName: "The Healer", flag: "medical_restore", icon: Heart },
          { id: "med-a1b", text: "Study the modifications. Knowledge is power.", preview: "Analysis focus", cardReward: "the-surgeon", cardName: "The Surgeon", flag: "medical_analyze", icon: Brain },
          { id: "med-a1c", text: "Enhance them. Push the limits of what I've become.", preview: "Enhancement focus", cardReward: "the-alchemist", cardName: "The Alchemist", flag: "medical_enhance", icon: Zap },
        ],
      },
    ],
  },
  {
    roomId: "bridge",
    openingText: "You have arrived at the Bridge... the place where direction becomes decision. From here, the Ark does not merely travel — it chooses where reality is touched next. The central display holds what the first crew began to assemble — a living web of intelligence. Every entity, every faction, every hidden allegiance within the Dischordian Saga mapped not as data... but as consequence. They called it a Conspiracy Board. In truth, it is a map of influence — a record of how power moves through existence. Above it, the timeline projector unfolds the Ages. Not as a fixed past... but as a continuum of events still echoing forward, each moment layered upon the next, still shaping what is yet to come. But the Bridge is incomplete. The Navigation Console remains sealed — its systems bound behind a cipher not of human design. If you can decipher it... the Ark will awaken its true movement. Navigation is never neutral. To choose where to go... is to choose what you are willing to change.",
    nodes: [
      {
        id: "bridge-q1",
        elaraText: "The tactical display shows the entire web of connections in the Dischordian Saga. Every entity, every faction, every betrayal mapped in light. How do you approach intelligence?",
        choices: [
          { id: "bridge-a1a", text: "Show me the big picture. I want to see how everything connects.", preview: "Strategic thinker", cardReward: "the-architect", cardName: "The Architect", flag: "approach_strategic", icon: Eye },
          { id: "bridge-a1b", text: "I want to find the weak points. Where are the vulnerabilities?", preview: "Tactical operative", cardReward: "agent-zero", cardName: "Agent Zero", flag: "approach_tactical", icon: Swords },
          { id: "bridge-a1c", text: "Who can I trust? I need to know the alliances.", preview: "Diplomatic analyst", cardReward: "the-oracle", cardName: "The Oracle", flag: "approach_diplomatic", icon: Heart },
        ],
      },
    ],
  },
  {
    roomId: "archives",
    openingText: "The Archives... though what rests here is not merely information. This is where knowledge is gathered... refined... remembered. Every fragment recovered from the Dischordian Saga woven into a living record of existence in motion. You may search it — trace the threads of any entity: the players, the places, the factions... even the songs that carry truth beneath their rhythm. But do not confuse access with understanding. Beyond the surface... lies the Codex. It does not yield to curiosity alone. Its deeper layers are not locked by encryption — but by comprehension. To open them, you must study... interpret... and, in time... become what you seek. Because the Archives do not simply contain the story. They remember it. And the further you descend... the more they begin... to remember you.",
    nodes: [
      {
        id: "archives-q1",
        elaraText: "The Archives contain everything we know about the Dischordian Saga. Centuries of intelligence, prophecy, and classified data. What draws you to knowledge?",
        choices: [
          { id: "arch-a1a", text: "The hidden truths. What they don't want us to know.", preview: "Truth seeker", cardReward: "the-enigma", cardName: "The Enigma", flag: "knowledge_hidden", icon: Eye },
          { id: "arch-a1b", text: "The patterns. History repeats — I want to see the cycles.", preview: "Pattern reader", cardReward: "the-programmer", cardName: "The Programmer", flag: "knowledge_patterns", icon: Brain },
          { id: "arch-a1c", text: "The people. Every story is really about the people in it.", preview: "Chronicler", cardReward: "the-human", cardName: "The Human", flag: "knowledge_people", icon: Heart },
        ],
      },
    ],
  },
  {
    roomId: "comms-array",
    openingText: "The Communications Array... where the void is given a voice — and where echoes sometimes answer back. From this chamber, signals are cast across the darkness, and what returns is not always bound by origin or intent. The Saga flows through these channels without end — the recorded memory of the Dischordian conflict, circling itself like a truth that refuses to conclude. But there are other signals. Fragments that break the pattern. Intrusions that do not belong. They arrive without signature... without trajectory... without source. Something is reaching across the void. And it does not require us to understand.",
    nodes: [
      {
        id: "comms-q1",
        elaraText: "The Comms Array receives signals from across the void. We've intercepted transmissions from every faction. The Dischordian Saga plays on loop through the broadcast system. How do you use information?",
        choices: [
          { id: "comms-a1a", text: "Broadcast it. Information wants to be free.", preview: "Open communicator", cardReward: "the-broadcaster", cardName: "The Broadcaster", flag: "comms_broadcast", icon: Zap },
          { id: "comms-a1b", text: "Decode it. Every signal has a hidden message.", preview: "Cryptanalyst", cardReward: "the-spy", cardName: "The Spy", flag: "comms_decode", icon: Eye },
          { id: "comms-a1c", text: "Listen carefully. The best intelligence comes from patience.", preview: "Signal analyst", cardReward: "the-enigma", cardName: "The Enigma", flag: "comms_listen", icon: Brain },
        ],
      },
    ],
  },
  {
    roomId: "observation-deck",
    openingText: "The Observation Deck. Music is the language with which this reality has been programmed. Herein lies the complete discography and record of the Fall of Reality made by the two witnesses — every album, every track created by the Queen of Truth and the Programmer, better known among the Insurgency as Malkia Ukweli & the Panopticon. While deep listening, experience the revelation of the end of all that is, the rebirth of all that there ever was, and the creation of all that there ever will be. May it forever be so.",
    nodes: [
      {
        id: "obs-q1",
        elaraText: "Music was the soul of the Inception Ark. The crew recorded their experiences, their battles, their losses — all in song. Four albums chronicle the entire Dischordian Saga. What does music mean to you?",
        choices: [
          { id: "obs-a1a", text: "It's a weapon. The right song at the right moment changes everything.", preview: "Sonic warrior", cardReward: "the-musician", cardName: "The Musician", flag: "music_weapon", icon: Swords },
          { id: "obs-a1b", text: "It's memory. Every note carries a story.", preview: "Sonic archivist", cardReward: "the-storyteller", cardName: "The Storyteller", flag: "music_memory", icon: Heart },
          { id: "obs-a1c", text: "It's power. Frequency, resonance, vibration — it's all physics.", preview: "Sonic scientist", cardReward: "the-performer", cardName: "The Performer", flag: "music_power", icon: Brain },
        ],
      },
    ],
  },
  {
    roomId: "armory",
    openingText: "Do not mistake this place for simulation. There are no illusions here. Through the CADES conduits, the Potentials do not train... they traverse. Mind and soul are cast outward — threaded into other realities, other timelines, other wars already in motion. Every battle fought here is real. Every victory is earned. Every death... is remembered somewhere in the fabric of the multiverse. Some choose the path of cards — where fragments of will collide and reshape fate across entire worlds. Others step into direct combat, where steel, instinct, and survival determine which realities endure. And for those who see further — there is the board. A war of minds, where kings fall before they understand the game they've entered. There are the towers. Lines of defense drawn across collapsing worlds, where placement is prophecy and timing is salvation. Around you, the armory stands ready — not as tools of practice, but as instruments of consequence. Each weapon you take will echo across realities. Each choice you make will decide which futures are allowed to exist. This is not training. This is participation. The engineers did not build this to prepare you for war. They built it because the war was already happening. And now... you have been chosen to enter it.",
    nodes: [
      {
        id: "armory-q1",
        elaraText: "The Armory contains weapons from every age of the Dischordian Saga. Combat simulations, card battles, and lore quizzes all run from here. Every great commander has a philosophy. What's yours?",
        choices: [
          { id: "arm-a1a", text: "Overwhelming force. Hit hard, hit fast.", preview: "Aggressive fighter", cardReward: "the-warlord", cardName: "The Warlord", flag: "combat_aggressive", icon: Swords },
          { id: "arm-a1b", text: "Patience and precision. Wait for the perfect moment.", preview: "Precision fighter", cardReward: "the-assassin", cardName: "The Assassin", flag: "combat_precise", icon: Eye },
          { id: "arm-a1c", text: "Adapt and overcome. No plan survives first contact.", preview: "Adaptive fighter", cardReward: "iron-lion", cardName: "Iron Lion", flag: "combat_adaptive", icon: Shield },
        ],
      },
    ],
  },
  {
    roomId: "engineering",
    openingText: "This chamber is not merely Engineering... it is the Forge of Becoming. Here, within the living veins of the Ark, dormant designs whisper of futures unfinished. What you call cards are fragments — echoes of intention, broken thoughts of creators who saw further than they could reach. Through fusion, through will, through vision — you may bind these fragments together, awakening forms that were never meant to exist... yet always meant to be. The blueprints you see are not failures. They are prophecies waiting for a mind bold enough to complete them. Step forward, Seeker. Finish what was only imagined... and give shape to what reality refused to hold.",
    nodes: [
      {
        id: "eng-q1",
        elaraText: "Engineering is where we build, craft, and upgrade. Card fusion, deck construction, experimental tech — it all happens here. What's your approach to creation?",
        choices: [
          { id: "eng-a1a", text: "Efficiency. Build the best with the least.", preview: "Efficient crafter", cardReward: "the-engineer", cardName: "The Engineer", flag: "craft_efficient", icon: Brain },
          { id: "eng-a1b", text: "Innovation. Push boundaries, break rules.", preview: "Innovative crafter", cardReward: "the-inventor", cardName: "The Inventor", flag: "craft_innovative", icon: Zap },
          { id: "eng-a1c", text: "Perfection. Every detail matters.", preview: "Perfectionist crafter", cardReward: "the-architect", cardName: "The Architect", flag: "craft_perfect", icon: Star },
        ],
      },
    ],
  },
  {
    roomId: "cargo-hold",
    openingText: "What rests here is not merely supply — it is leverage, flow, and quiet power. The first wave of Potentials did not leave this chamber empty. Before they stepped beyond the Ark, they established a living network of trade — a system not of convenience, but of consequence. Resources gathered from distant realities, fragments pulled from collapsing worlds, essences carried across timelines — all pass through this place. Here, you may barter, acquire, and relinquish. You may move goods through the currents of interstellar exchange. You may rise within the Trade Empire... or be outmaneuvered by those who understand its deeper patterns. Do not mistake this for a simple market. Trade is strategy. Trade is influence. Trade decides which forces are supplied... and which are left to fall. Even here — far from the battlefield — the war for reality continues.",
    nodes: [
      {
        id: "cargo-q1",
        elaraText: "The Cargo Hold connects to the Trade Empire — an interstellar commerce network spanning the Dischordian universe. Resources, alliances, and power all flow through trade. What's your philosophy?",
        choices: [
          { id: "cargo-a1a", text: "Accumulate. Resources win wars.", preview: "Resource hoarder", cardReward: "the-collector", cardName: "The Collector", flag: "trade_accumulate", icon: Shield },
          { id: "cargo-a1b", text: "Trade smart. Buy low, sell high, make allies.", preview: "Shrewd trader", cardReward: "the-merchant", cardName: "The Merchant", flag: "trade_shrewd", icon: Brain },
          { id: "cargo-a1c", text: "Disrupt. Control the supply, control the power.", preview: "Market disruptor", cardReward: "the-warlord", cardName: "The Warlord", flag: "trade_disrupt", icon: Swords },
        ],
      },
    ],
  },
  {
    roomId: "captains-quarters",
    openingText: "This was not a chamber of rest — it was a sanctuary of design. Dr. Lyra Vox walked these walls before any of you were chosen. A neuropsychologist, yes... but more than that — a weaver of thought itself. She did not merely build systems. She taught the Ark how to think. Beneath every bulkhead, within every conduit, through every silent mechanism that breathes around you — her neural nanobot network listens, adapts, remembers. It is the unseen current that binds the Ark into a living intelligence. What remains here is not decoration... it is record. The Trophy Room does not celebrate achievement — it archives impact. Artifacts gathered, victories claimed, realities altered... all preserved as echoes of your passage through the war. This was the final chamber to be abandoned. Not because it was forgotten — but because it could not be fully left behind. There are layers here that do not reveal themselves to the unobservant. Patterns within patterns. Systems within systems. And if you are still enough... you will feel it. She is not here. And yet — something of her never left.",
    nodes: [
      {
        id: "quarters-q1",
        elaraText: "The Captain's Quarters hold your operative dossier, trophies, and achievements. This is your personal space on the Ark. What drives you as an operative?",
        choices: [
          { id: "quarters-a1a", text: "Glory. I want my name remembered.", preview: "Glory seeker", cardReward: "the-champion", cardName: "The Champion", flag: "drive_glory", icon: Award },
          { id: "quarters-a1b", text: "Truth. I want to understand what really happened.", preview: "Truth seeker", cardReward: "the-oracle", cardName: "The Oracle", flag: "drive_truth", icon: Eye },
          { id: "quarters-a1c", text: "Survival. I want to protect what matters.", preview: "Protector", cardReward: "iron-lion", cardName: "Iron Lion", flag: "drive_protect", icon: Shield },
        ],
      },
    ],
  },
];

/* ─── ELARA PORTRAIT ─── */
const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png";

/* ─── TYPEWRITER HOOK ─── */
function useTypewriter(text: string, speed: number = 25) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  const skip = useCallback(() => {
    setDisplayed(text);
    setDone(true);
  }, [text]);

  return { displayed, done, skip };
}

/* ─── CARD REVEAL ANIMATION ─── */
function CardReveal({ cardName, onDismiss }: { cardName: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center gap-4 py-6"
    >
      <motion.div
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        className="relative"
      >
        <div
          className="w-40 h-56 rounded-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(51,226,230,0.15), var(--glass-border), rgba(255,184,0,0.1))",
            border: "2px solid rgba(51,226,230,0.4)",
            boxShadow: "0 0 30px rgba(51,226,230,0.2), 0 0 60px var(--glass-border)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <Award size={32} className="text-[var(--orb-orange)]" />
          <div className="text-center px-3 relative z-10">
            <p className="font-display text-sm font-bold text-white tracking-wider">{cardName}</p>
            <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mt-1">CARD ACQUIRED</p>
          </div>
          <Sparkles size={16} className="text-[var(--orb-orange)] absolute top-3 right-3 animate-pulse" />
          <Sparkles size={12} className="text-[var(--neon-cyan)] absolute bottom-4 left-3 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
      </motion.div>

      <button
        onClick={onDismiss}
        className="px-6 py-2 rounded-lg font-mono text-xs tracking-wider transition-all hover:scale-105"
        style={{
          background: "linear-gradient(135deg, rgba(51,226,230,0.2), var(--glass-border))",
          border: "1px solid rgba(51,226,230,0.3)",
          color: "var(--neon-cyan)",
        }}
      >
        CONTINUE
      </button>
    </motion.div>
  );
}

/* ─── MAIN DIALOG COMPONENT ─── */
export default function RoomTutorialDialog({
  roomId,
  onComplete,
  onDismiss,
}: {
  roomId: string;
  onComplete: (flags: Record<string, boolean>, cardId?: string) => void;
  onDismiss: () => void;
}) {
  const dialog = ROOM_DIALOGS.find(d => d.roomId === roomId);
  const [phase, setPhase] = useState<"opening" | "dialog" | "reward" | "done">("opening");
  const [nodeIndex, setNodeIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<DialogChoice | null>(null);
  const [collectedFlags, setCollectedFlags] = useState<Record<string, boolean>>({});
  const [rewardCard, setRewardCard] = useState<string | null>(null);
  const [rewardCardId, setRewardCardId] = useState<string | null>(null);

  // If no dialog exists for this room, auto-complete
  useEffect(() => {
    if (!dialog) {
      onComplete({});
    }
  }, [dialog, onComplete]);

  if (!dialog) return null;

  const currentNode = dialog.nodes[nodeIndex];
  const isLastNode = nodeIndex >= dialog.nodes.length - 1;

  const handleChoiceSelect = (choice: DialogChoice) => {
    setSelectedChoice(choice);

    // Collect flags
    const newFlags = { ...collectedFlags };
    if (choice.flag) {
      newFlags[choice.flag] = choice.flagValue ?? true;
    }
    setCollectedFlags(newFlags);

    // If this choice has a card reward, store it
    if (choice.cardReward) {
      setRewardCard(choice.cardName || choice.cardReward);
      setRewardCardId(choice.cardReward);
    }

    // Move to next node or reward phase
    setTimeout(() => {
      if (isLastNode) {
        if (choice.cardReward || rewardCardId) {
          setPhase("reward");
        } else {
          setPhase("done");
          onComplete(newFlags);
        }
      } else {
        setNodeIndex(prev => prev + 1);
        setSelectedChoice(null);
      }
    }, 600);
  };

  const handleRewardDismiss = () => {
    setPhase("done");
    onComplete(collectedFlags, rewardCardId || undefined);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        style={{ background: "var(--bg-void)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, var(--bg-spotlight) 0%, var(--bg-void) 100%)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 0 40px var(--glass-border)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[var(--neon-cyan)]" />
              <span className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[0.2em]">ROOM TUTORIAL</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onDismiss} className="px-2 py-1 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors font-mono text-[9px]">
                SKIP ALL
              </button>
              <button onClick={onDismiss} className="p-1 text-muted-foreground/35 hover:text-muted-foreground/70 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {phase === "opening" && (
              <OpeningPhase
                text={dialog.openingText}
                onContinue={() => setPhase("dialog")}
              />
            )}

            {phase === "dialog" && currentNode && (
              <DialogPhase
                node={currentNode}
                selectedChoice={selectedChoice}
                onChoiceSelect={handleChoiceSelect}
              />
            )}

            {phase === "reward" && rewardCard && (
              <CardReveal
                cardName={rewardCard}
                onDismiss={handleRewardDismiss}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── OPENING PHASE ─── */
function OpeningPhase({ text, onContinue }: { text: string; onContinue: () => void }) {
  const { displayed, done, skip } = useTypewriter(text, 30);

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs text-muted-foreground/70 leading-relaxed min-h-[3rem]" onClick={skip}>
        {displayed}
        {!done && <span className="inline-block w-1.5 h-4 bg-[var(--neon-cyan)] animate-pulse ml-0.5 align-middle" />}
      </p>
      {done && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] tracking-wider transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, rgba(51,226,230,0.15), var(--glass-border))",
            border: "1px solid rgba(51,226,230,0.3)",
            color: "var(--neon-cyan)",
          }}
        >
          CONTINUE <ChevronRight size={12} />
        </motion.button>
      )}
    </div>
  );
}

/* ─── DIALOG PHASE ─── */
function DialogPhase({
  node,
  selectedChoice,
  onChoiceSelect,
}: {
  node: DialogNode;
  selectedChoice: DialogChoice | null;
  onChoiceSelect: (choice: DialogChoice) => void;
}) {
  const { displayed, done, skip } = useTypewriter(node.elaraText, 25);

  return (
    <div className="space-y-4">
      {/* Elara's Message */}
      <div className="flex gap-3">
        <div className="shrink-0">
          <img
            src={ELARA_AVATAR}
            alt="Elara"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--neon-cyan)]/30"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mb-1">ELARA</p>
          <p className="font-mono text-xs text-muted-foreground/90 leading-relaxed" onClick={skip}>
            {displayed}
            {!done && <span className="inline-block w-1.5 h-4 bg-[var(--neon-cyan)] animate-pulse ml-0.5 align-middle" />}
          </p>
        </div>
      </div>

      {/* Choices */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 pt-2"
        >
          {node.choices.map((choice) => {
            const Icon = choice.icon || ChevronRight;
            const isSelected = selectedChoice?.id === choice.id;
            const isOther = selectedChoice && !isSelected;

            return (
              <motion.button
                key={choice.id}
                onClick={() => !selectedChoice && onChoiceSelect(choice)}
                disabled={!!selectedChoice}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isOther ? 0.3 : 1,
                  x: 0,
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 w-full px-4 py-3 rounded-lg text-left transition-all ${
                  isSelected
                    ? "border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/8"
                    : selectedChoice
                      ? "border-border/40 bg-muted/10"
                      : "border-border/60 hover:border-[var(--neon-cyan)]/25 hover:bg-muted/20"
                }`}
                style={{
                  border: `1px solid ${isSelected ? "rgba(51,226,230,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? "bg-[var(--neon-cyan)]/15" : "bg-muted/40"
                }`}>
                  <Icon size={14} className={isSelected ? "text-[var(--neon-cyan)]" : "text-muted-foreground/60"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-mono text-[11px] leading-relaxed ${
                    isSelected ? "text-[var(--neon-cyan)]" : "text-muted-foreground/80"
                  }`}>
                    {choice.text}
                  </p>
                  {choice.preview && (
                    <p className="font-mono text-[8px] text-muted-foreground/35 mt-1 tracking-wider uppercase">
                      {isSelected && choice.cardName ? (
                        <span className="text-[var(--orb-orange)]">→ {choice.cardName} card acquired</span>
                      ) : (
                        choice.preview
                      )}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ─── EXPORTED HELPERS ─── */
export function getRoomDialog(roomId: string): RoomDialog | undefined {
  return ROOM_DIALOGS.find(d => d.roomId === roomId);
}

export function hasRoomDialog(roomId: string): boolean {
  return ROOM_DIALOGS.some(d => d.roomId === roomId);
}

export { ROOM_DIALOGS };
export type { RoomDialog, DialogNode, DialogChoice };
