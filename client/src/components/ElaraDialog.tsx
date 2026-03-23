import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { dialogOpened, dialogClosed } from "@/lib/dialogState";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import HolographicElara from "./HolographicElara";
import { Streamdown } from "streamdown";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_7ce2522f.png";
const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png";

interface DialogChoice {
  id: string;
  text: string;
  category: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ═══ PAGE-SPECIFIC DIALOG OPTIONS ═══
// Each page gets contextual choices that Elara can answer about
function getPageChoices(path: string): { greeting: string; choices: DialogChoice[] } {
  // Home / Dashboard
  if (path === "/" || path === "") {
    return {
      greeting: "Welcome back to the Ark, Operative. The CoNexus systems are nominal. I can brief you on the Saga, guide you through the ship's systems, or prepare a CADES simulation. What interests you?",
      choices: [
        { id: "overview", text: "Give me an overview of the Dischordian Saga.", category: "lore" },
        { id: "whats-new", text: "What should I explore first?", category: "ark" },
        { id: "music", text: "Tell me about the music transmissions.", category: "music" },
        { id: "games", text: "What CADES simulations are available?", category: "games" },
        { id: "who", text: "Who are you, Elara?", category: "personal" },
      ],
    };
  }

  // Card Game
  if (path === "/cards/play") {
    return {
      greeting: "Ah, the Dischordian Struggle. This CADES simulation pits faction against faction across three dimensional lanes. Each card you deploy shapes the fate of a parallel universe. Shall I explain the rules, or do you have a tactical question?",
      choices: [
        { id: "rules", text: "How do I play this card game?", category: "games" },
        { id: "factions", text: "Tell me about the factions and their strengths.", category: "games" },
        { id: "lanes", text: "How do the three lanes work?", category: "games" },
        { id: "elements", text: "Explain the element system and keywords.", category: "games" },
        { id: "strategy", text: "What's a good strategy for beginners?", category: "games" },
        { id: "lore-cards", text: "How do the cards connect to the lore?", category: "lore" },
      ],
    };
  }

  // Card Browser
  if (path === "/cards") {
    return {
      greeting: "The dimensional archive contains over 3,000 card manifestations. Each one represents an entity, event, or force from across the multiverse. Looking for something specific?",
      choices: [
        { id: "rare-cards", text: "What are the rarest cards?", category: "games" },
        { id: "factions-browse", text: "Tell me about each faction's card style.", category: "games" },
        { id: "keywords", text: "Explain the card keywords and abilities.", category: "games" },
        { id: "elements", text: "How do elements affect card combat?", category: "games" },
        { id: "build-deck", text: "How should I build a good deck?", category: "games" },
      ],
    };
  }

  // Deck Builder
  if (path === "/deck-builder") {
    return {
      greeting: "The Deck Configuration Terminal is online. A well-constructed deck balances offense, defense, and influence across all three lanes. Need guidance on composition?",
      choices: [
        { id: "deck-basics", text: "What makes a good deck?", category: "games" },
        { id: "faction-synergy", text: "Which factions synergize well together?", category: "games" },
        { id: "lane-balance", text: "How do I balance cards across lanes?", category: "games" },
        { id: "counter-play", text: "How do I counter aggressive decks?", category: "games" },
        { id: "card-combos", text: "What are some powerful card combos?", category: "games" },
      ],
    };
  }

  // Trade Empire
  if (path === "/trade-empire") {
    return {
      greeting: "You've accessed the Trade Empire simulation — a CADES projection of interstellar commerce during the Age of Privacy. Every trade route you establish, every pirate you outrun, shapes the economic fate of this parallel universe. What do you need to know?",
      choices: [
        { id: "tw-basics", text: "How does Trade Empire work?", category: "games" },
        { id: "tw-trading", text: "What's the best trading strategy?", category: "games" },
        { id: "tw-combat", text: "How does space combat work?", category: "games" },
        { id: "tw-colonize", text: "Tell me about colonization.", category: "games" },
        { id: "tw-lore", text: "How does this connect to the Saga?", category: "lore" },
        { id: "tw-factions", text: "What factions control the sectors?", category: "lore" },
      ],
    };
  }

  // Fight / Combat Simulator
  if (path === "/fight") {
    return {
      greeting: "The Combat Simulator is a CADES projection that tests your readiness through dimensional combat trials. Each fighter is a manifestation of a Saga entity. Choose wisely — their abilities reflect their true nature in the lore.",
      choices: [
        { id: "fight-how", text: "How do I fight in the simulator?", category: "games" },
        { id: "fight-chars", text: "Tell me about the fighters and their abilities.", category: "games" },
        { id: "fight-lore", text: "How do these fighters connect to the lore?", category: "lore" },
        { id: "fight-tips", text: "Any combat tips for a beginner?", category: "games" },
        { id: "fight-warlord", text: "Tell me about the Warlord.", category: "lore" },
      ],
    };
  }

  // Conspiracy Board
  if (path === "/board") {
    return {
      greeting: "The Conspiracy Board maps the hidden connections between every entity in the Saga. Each node is a character, faction, or location — and every line represents a relationship that shapes the multiverse. What web would you like to untangle?",
      choices: [
        { id: "board-architect", text: "Show me the Architect's connections.", category: "lore" },
        { id: "board-factions", text: "How are the factions connected?", category: "lore" },
        { id: "board-hidden", text: "What hidden connections should I look for?", category: "lore" },
        { id: "board-enigma", text: "Tell me about the Enigma's web of influence.", category: "lore" },
        { id: "board-betrayals", text: "Who betrayed whom in the Saga?", category: "lore" },
        { id: "board-fall", text: "What caused the Fall of Reality?", category: "lore" },
      ],
    };
  }

  // Inception Ark
  if (path === "/ark") {
    return {
      greeting: "You're exploring the Inception Ark itself — the vessel that carries the last hope of civilization through the void. Each deck serves a critical function. I know every corridor, every system, every secret aboard this ship.",
      choices: [
        { id: "ark-what", text: "What is an Inception Ark?", category: "ark" },
        { id: "ark-decks", text: "Tell me about each deck.", category: "ark" },
        { id: "ark-conexus", text: "What is the CoNexus Core?", category: "ark" },
        { id: "ark-crew", text: "Who else is aboard?", category: "ark" },
        { id: "ark-cades", text: "How does CADES work?", category: "games" },
        { id: "ark-purpose", text: "Where is the Ark heading?", category: "lore" },
      ],
    };
  }

  // Timeline
  if (path === "/timeline" || path === "/character-timeline") {
    return {
      greeting: "The temporal records span four great ages of the Saga. From the Age of Privacy through the Fall of Reality to the Age of Potentials — every event is catalogued here. What era interests you?",
      choices: [
        { id: "tl-privacy", text: "Tell me about the Age of Privacy.", category: "lore" },
        { id: "tl-revelation", text: "What happened in the Age of Revelation?", category: "lore" },
        { id: "tl-fall", text: "Describe the Fall of Reality.", category: "lore" },
        { id: "tl-potentials", text: "What is the Age of Potentials?", category: "lore" },
        { id: "tl-key-events", text: "What are the most important events?", category: "lore" },
      ],
    };
  }

  // Search / Entity Database
  if (path === "/search") {
    return {
      greeting: "The Entity Database contains every character, location, faction, and concept catalogued by the Ark's sensors. I can help you find specific entries or explain the connections between them.",
      choices: [
        { id: "search-chars", text: "Who are the most important characters?", category: "lore" },
        { id: "search-factions", text: "List the major factions.", category: "lore" },
        { id: "search-locations", text: "What are the key locations?", category: "lore" },
        { id: "search-concepts", text: "Explain the key concepts of the Saga.", category: "lore" },
        { id: "search-hidden", text: "Are there any hidden entries?", category: "lore" },
      ],
    };
  }

  // Watch
  if (path === "/watch") {
    return {
      greeting: "You've accessed the Dimensional Broadcast System. The Dischordian Saga unfolds across seven epochs — from the Fall of Reality through the Age of Privacy. Each epoch is a chapter in the story of the multiverse. Choose an epoch to begin.",
      choices: [
        { id: "watch-epochs", text: "Explain the epochs to me.", category: "lore" },
        { id: "watch-start", text: "Where should I start watching?", category: "music" },
        { id: "watch-fall", text: "What is the Fall of Reality?", category: "lore" },
        { id: "watch-programmer", text: "Who is the Programmer?", category: "lore" },
        { id: "watch-malkia", text: "Tell me about Malkia Ukweli.", category: "lore" },
        { id: "watch-conexus", text: "What are the CoNexus Stories?", category: "lore" },
      ],
    };
  }

  // Store
  if (path === "/store") {
    return {
      greeting: "The Requisition Terminal allows you to acquire resources using Dream Tokens. These tokens fuel your CADES simulations, card collection, and research operations. How can I help?",
      choices: [
        { id: "store-dreams", text: "What are Dream Tokens?", category: "games" },
        { id: "store-spend", text: "What should I spend my tokens on?", category: "games" },
        { id: "store-earn", text: "How do I earn more Dream Tokens?", category: "games" },
        { id: "store-packs", text: "What's in the card packs?", category: "games" },
      ],
    };
  }

  // Research Lab
  if (path === "/research-lab") {
    return {
      greeting: "The Research Lab uses CoNexus technology to fuse and transmute cards. By combining lesser manifestations, you can forge more powerful entities. The recipes are... complex, but I can guide you.",
      choices: [
        { id: "lab-how", text: "How does card fusion work?", category: "games" },
        { id: "lab-recipes", text: "What recipes are available?", category: "games" },
        { id: "lab-rare", text: "How do I craft rare cards?", category: "games" },
        { id: "lab-materials", text: "What materials do I need?", category: "games" },
      ],
    };
  }

  // Citizen Creation
  if (path === "/create-citizen") {
    return {
      greeting: "The Citizen Registration System creates your identity within the Ark's crew manifest. Your alignment, attributes, and archetype will shape your journey through the CADES simulations. Choose carefully — these choices echo across dimensions.",
      choices: [
        { id: "citizen-what", text: "What is a Citizen identity?", category: "games" },
        { id: "citizen-align", text: "Explain the alignment system.", category: "games" },
        { id: "citizen-attrs", text: "What do the attributes mean?", category: "games" },
        { id: "citizen-archetype", text: "What archetypes can I choose?", category: "games" },
        { id: "citizen-lore", text: "How does this connect to the Saga?", category: "lore" },
      ],
    };
  }

  // Character Sheet
  if (path === "/character-sheet") {
    return {
      greeting: "Your Citizen dossier shows your current standing aboard the Ark. Your attributes, alignment, and progression all factor into how CADES simulations respond to you. What would you like to know?",
      choices: [
        { id: "sheet-stats", text: "How do my stats affect gameplay?", category: "games" },
        { id: "sheet-level", text: "How do I level up?", category: "games" },
        { id: "sheet-alignment", text: "Can I change my alignment?", category: "games" },
        { id: "sheet-progress", text: "What should I focus on improving?", category: "games" },
      ],
    };
  }

  // Console / C.A.D.E.S.
  if (path === "/console") {
    return {
      greeting: "The C.A.D.E.S. Console is the primary interface for the CoNexus Advanced Dimensional Exploration Simulation. From here, you can access the doom scroll feed, monitor dimensional activity, and review your operative status.",
      choices: [
        { id: "console-cades", text: "What is C.A.D.E.S. exactly?", category: "ark" },
        { id: "console-doom", text: "What's on the doom scroll?", category: "lore" },
        { id: "console-conexus", text: "Tell me about the CoNexus.", category: "lore" },
        { id: "console-sims", text: "What simulations can I run?", category: "games" },
      ],
    };
  }

  // Trophy Room
  if (path === "/trophy") {
    return {
      greeting: "The Trophy Room displays your achievements across all CADES simulations. Each trophy represents a milestone in your journey through the multiverse. Impressive collection... or is it?",
      choices: [
        { id: "trophy-how", text: "How do I earn trophies?", category: "games" },
        { id: "trophy-rare", text: "What are the rarest achievements?", category: "games" },
        { id: "trophy-cards", text: "Do trophies unlock any cards?", category: "games" },
      ],
    };
  }

  // Games Hub
  if (path === "/games") {
    return {
      greeting: "The CADES Simulation Hub. Each game here is a window into a parallel universe — powered by the CoNexus technology salvaged from the Architect's dismantled creation. Your choices in these simulations ripple across the multiverse. Which reality will you enter?",
      choices: [
        { id: "games-card", text: "Tell me about the Card Game.", category: "games" },
        { id: "games-trade", text: "What is Trade Empire?", category: "games" },
        { id: "games-fight", text: "How does the Combat Simulator work?", category: "games" },
        { id: "games-ark", text: "What can I explore on the Ark?", category: "ark" },
        { id: "games-save-doom", text: "What do you mean 'save or doom'?", category: "lore" },
      ],
    };
  }

  // Entity detail pages
  if (path.startsWith("/entity/")) {
    return {
      greeting: "You're examining a dossier from the Ark's database. I can provide additional context about this entity — their connections, their role in the Saga, or how they appear in the music transmissions.",
      choices: [
        { id: "entity-connections", text: "Who is this entity connected to?", category: "lore" },
        { id: "entity-songs", text: "Do they appear in any songs?", category: "music" },
        { id: "entity-timeline", text: "Where do they fit in the timeline?", category: "lore" },
        { id: "entity-secrets", text: "Are there any hidden details about them?", category: "lore" },
        { id: "entity-faction", text: "What faction do they belong to?", category: "lore" },
      ],
    };
  }

  // Song pages
  if (path.startsWith("/song/")) {
    return {
      greeting: "This is an archived transmission — a song that echoes through the dimensions. The music of Malkia Ukweli carries encoded lore within its lyrics. Shall I decode it for you?",
      choices: [
        { id: "song-meaning", text: "What is this song about?", category: "music" },
        { id: "song-chars", text: "Which characters appear in this song?", category: "lore" },
        { id: "song-album", text: "Tell me about this album.", category: "music" },
        { id: "song-connected", text: "What other songs connect to this one?", category: "music" },
      ],
    };
  }

  // Album pages
  if (path.startsWith("/album/")) {
    return {
      greeting: "You're exploring an album — a collection of dimensional transmissions that tell a chapter of the Saga. Each track is a piece of the larger story.",
      choices: [
        { id: "album-story", text: "What story does this album tell?", category: "music" },
        { id: "album-key-tracks", text: "Which tracks are most important for lore?", category: "music" },
        { id: "album-chars", text: "Which characters feature in this album?", category: "lore" },
        { id: "album-era", text: "What era does this album cover?", category: "lore" },
      ],
    };
  }

  // Default fallback
  return {
    greeting: "Operative. I am Elara — navigator, keeper of records, and guide aboard this Inception Ark. The CoNexus systems have detected your neural signature. Whether you seek knowledge of the Saga, wish to explore the Ark's systems, or are ready to enter a CADES simulation... I am here.\n\nWhat would you like to know?",
    choices: [
      { id: "lore", text: "Tell me about the Dischordian Saga.", category: "lore" },
      { id: "ark", text: "What is this Inception Ark?", category: "ark" },
      { id: "games", text: "Explain the CADES simulations.", category: "games" },
      { id: "who", text: "Who are you, Elara?", category: "personal" },
      { id: "music", text: "Tell me about the music.", category: "music" },
    ],
  };
}

export default function ElaraDialog({ elaraTTS: _elaraTTS }: { elaraTTS?: any } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [choices, setChoices] = useState<DialogChoice[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [lastPath, setLastPath] = useState("");
  const [roomDialogActive, setRoomDialogActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notify global dialog state when ElaraDialog opens/closes
  useEffect(() => {
    if (isOpen) {
      dialogOpened();
    } else {
      dialogClosed();
    }
    return () => {
      if (isOpen) dialogClosed();
    };
  }, [isOpen]);

  // Hide floating Elara button when a room dialog (ElaraPopup) is active on mobile
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setRoomDialogActive(detail?.active ?? false);
    };
    window.addEventListener("elara-dialog", handler);
    return () => window.removeEventListener("elara-dialog", handler);
  }, []);

  const [location] = useLocation();
  const chatMutation = trpc.elara.chat.useMutation();

  // Get page-specific context
  const pageContext = useMemo(() => getPageChoices(location), [location]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentMessage, isLoading]);

  // When page changes while dialog is open, offer new context
  useEffect(() => {
    if (isOpen && hasGreeted && location !== lastPath) {
      setLastPath(location);
      const ctx = getPageChoices(location);
      const navMsg: ChatMessage = {
        role: "assistant",
        content: ctx.greeting,
      };
      setHistory((prev) => [...prev, navMsg]);
      setCurrentMessage(ctx.greeting);
      setChoices(ctx.choices);
    }
  }, [location, isOpen, hasGreeted, lastPath]);

  const openDialog = useCallback(() => {
    setIsOpen(true);
    if (!hasGreeted) {
      setLastPath(location);
      setCurrentMessage(pageContext.greeting);
      setChoices(pageContext.choices);
      setHistory([{ role: "assistant", content: pageContext.greeting }]);
      setHasGreeted(true);
    }
  }, [hasGreeted, pageContext, location]);

  const handleChoice = async (choice: DialogChoice) => {
    if (choice.id === "custom") {
      setShowCustomInput(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    setShowCustomInput(false);
    setIsLoading(true);

    const userMsg: ChatMessage = { role: "user", content: choice.text };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setCurrentMessage("");
    setChoices([]);

    try {
      const result = await chatMutation.mutateAsync({
        message: choice.text,
        category: choice.category,
        pageContext: location,
        history: newHistory.slice(-10),
      });

      const assistantMsg: ChatMessage = { role: "assistant", content: result.message };
      setHistory([...newHistory, assistantMsg]);
      setCurrentMessage(result.message);
      setChoices(result.choices);
    } catch {
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "The dimensional relay is experiencing interference. Try again, Operative.",
      };
      setHistory([...newHistory, errorMsg]);
      setCurrentMessage(errorMsg.content);
      setChoices(pageContext.choices);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setShowCustomInput(false);
    setIsLoading(true);

    const userMsg: ChatMessage = { role: "user", content: customInput };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setCurrentMessage("");
    setChoices([]);
    setCustomInput("");

    try {
      const result = await chatMutation.mutateAsync({
        message: customInput,
        category: "lore",
        pageContext: location,
        history: newHistory.slice(-10),
      });

      const assistantMsg: ChatMessage = { role: "assistant", content: result.message };
      setHistory([...newHistory, assistantMsg]);
      setCurrentMessage(result.message);
      setChoices(result.choices);
    } catch {
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "The dimensional relay is experiencing interference. Try again, Operative.",
      };
      setHistory([...newHistory, errorMsg]);
      setCurrentMessage(errorMsg.content);
      setChoices(pageContext.choices);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ═══ FLOATING ELARA BUTTON ═══ */}
      <AnimatePresence>
        {!isOpen && !roomDialogActive && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={openDialog}
            className="fixed bottom-[140px] sm:bottom-6 right-4 sm:right-6 z-[45] group"
            aria-label="Talk to Elara"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full animate-cyber-pulse" 
                   style={{ background: "radial-gradient(circle, rgba(51,226,230,0.2) 0%, transparent 70%)" }} />
              {/* Holographic Avatar */}
              <HolographicElara size="sm" isSpeaking={false} />
              {/* Label */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[var(--glass-base)] backdrop-blur-md border border-[var(--glass-border)] rounded-md px-2 py-1 text-[10px] font-mono text-[var(--neon-cyan)] opacity-0 group-hover:opacity-100 transition-opacity">
                TALK TO ELARA
              </div>
              {/* Notification dot */}
              {!hasGreeted && (
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--orb-orange)] border-2 border-[var(--bg-void)] animate-pulse" />
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ BIOWARE-STYLE DIALOG BOX — CENTERED MODAL ═══ */}
      <AnimatePresence>
        {isOpen && (
          <>
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[59]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.35 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[520px] sm:h-[640px] sm:max-h-[85vh] z-[60] flex flex-col"
          >
            {/* Glass container */}
            <div className="flex-1 flex flex-col bg-[var(--bg-void)]/95 sm:rounded-xl border border-[var(--glass-border)] overflow-hidden shadow-[0_0_60px_rgba(51,226,230,0.1)]"
                 style={{ backdropFilter: "blur(20px)" }}>
              
              {/* ── HEADER ── */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--glass-border)]"
                   style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--glass-base) 50%, transparent) 0%, var(--bg-overlay) 100%)" }}>
                <HolographicElara size="sm" isSpeaking={isLoading} />
                <div className="flex-1 ml-1">
                  <h3 className="font-display text-sm font-bold text-white tracking-wider">ELARA</h3>
                  <p className="font-mono text-[10px] text-[var(--neon-cyan)]/70 tracking-widest">ARK NAVIGATOR // LORE KEEPER</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 sm:p-1.5 rounded-md border border-[var(--glass-border)] sm:border-transparent hover:bg-muted/60 hover:border-[var(--glass-border)] transition-colors text-muted-foreground hover:text-white"
                  aria-label="Close dialog"
                >
                  <X size={20} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>

              {/* ── CONVERSATION AREA ── */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {history.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--neon-cyan)]/30 flex-shrink-0 mt-1">
                        <img src={ELARA_AVATAR} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--electric-blue)]/20 border border-[var(--electric-blue)]/30 text-foreground"
                        : "bg-[var(--glass-base)] border border-[var(--glass-border)] text-foreground/90"
                    }`}>
                      {msg.role === "assistant" && i === history.length - 1 ? (
                        <Streamdown>{msg.content}</Streamdown>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--neon-cyan)]/30 flex-shrink-0 mt-1">
                      <img src={ELARA_AVATAR} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-[var(--glass-base)] border border-[var(--glass-border)] rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-[var(--neon-cyan)]/70">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="font-mono text-xs">Accessing dimensional archives...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── PORTRAIT + DIALOG CHOICES (BioWare style) ── */}
              <div className="border-t border-[var(--glass-border)] flex-shrink-0"
                   style={{ background: "linear-gradient(0deg, var(--bg-void) 0%, color-mix(in srgb, var(--glass-base) 30%, transparent) 100%)" }}>
                
                {/* Portrait bar — hidden on mobile to save space */}
                <div className="flex items-end gap-3 px-4 pt-3">
                  <div className="hidden sm:block w-20 h-20 rounded-lg overflow-hidden border border-[var(--neon-cyan)]/30 shadow-[0_0_15px_rgba(51,226,230,0.15)] flex-shrink-0">
                    <img src={ELARA_PORTRAIT} alt="Elara" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles size={12} className="text-[var(--deep-purple)]" />
                      <span className="font-display text-[10px] text-[var(--deep-purple)] tracking-[0.2em]">ELARA</span>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground/70 leading-snug">
                      {isLoading ? "Processing dimensional data..." : "Select a response:"}
                    </p>
                  </div>
                </div>

                {/* Dialog choices */}
                <div className="px-4 py-2 sm:py-3 space-y-1 sm:space-y-1.5 max-h-[160px] sm:max-h-[200px] overflow-y-auto">
                  {!isLoading && choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-[var(--neon-cyan)]/30 hover:bg-[var(--glass-base)] transition-all group"
                    >
                      <ChevronRight size={12} className="text-[var(--neon-cyan)]/50 group-hover:text-[var(--neon-cyan)] transition-colors flex-shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground/90 group-hover:text-white transition-colors">
                        {choice.text}
                      </span>
                    </button>
                  ))}

                  {/* Custom input */}
                  {showCustomInput && (
                    <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Ask Elara anything..."
                        className="flex-1 bg-[var(--glass-dark)] border border-[var(--glass-border)] rounded-md px-3 py-2 text-xs font-mono text-white placeholder:text-muted-foreground/50 focus:border-[var(--neon-cyan)] focus:outline-none focus:shadow-[0_0_10px_rgba(51,226,230,0.15)]"
                      />
                      <button
                        type="submit"
                        disabled={!customInput.trim()}
                        className="px-3 py-2 rounded-md bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] text-xs font-mono hover:bg-[var(--neon-cyan)]/20 disabled:opacity-30 transition-all"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </form>
                  )}

                  {/* Always show free-form input option */}
                  {!showCustomInput && !isLoading && choices.length > 0 && (
                    <button
                      onClick={() => {
                        setShowCustomInput(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-[var(--deep-purple)]/30 hover:border-[var(--deep-purple)]/50 hover:bg-[var(--deep-purple)]/5 transition-all group mt-1"
                    >
                      <MessageCircle size={12} className="text-[var(--deep-purple)]/50 group-hover:text-[var(--deep-purple)] transition-colors flex-shrink-0" />
                      <span className="font-mono text-xs text-[var(--deep-purple)]/60 group-hover:text-[var(--deep-purple)] transition-colors">
                        Type your own question...
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
