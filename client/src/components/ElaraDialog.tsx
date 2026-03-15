import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_7ce2522f.png";
const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_small_66ba7463.png";

interface DialogChoice {
  id: string;
  text: string;
  category: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ElaraDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [choices, setChoices] = useState<DialogChoice[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = trpc.elara.getGreeting.useQuery(undefined, { enabled: false });
  const chatMutation = trpc.elara.chat.useMutation();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentMessage, isLoading]);

  const openDialog = useCallback(async () => {
    setIsOpen(true);
    if (!hasGreeted) {
      const result = await greeting.refetch();
      if (result.data) {
        setCurrentMessage(result.data.message);
        setChoices(result.data.choices);
        setHistory([{ role: "assistant", content: result.data.message }]);
        setHasGreeted(true);
      }
    }
  }, [hasGreeted, greeting]);

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
      setChoices(choices);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ═══ FLOATING ELARA BUTTON ═══ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={openDialog}
            className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 group"
            aria-label="Talk to Elara"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full animate-cyber-pulse" 
                   style={{ background: "radial-gradient(circle, rgba(51,226,230,0.2) 0%, transparent 70%)" }} />
              {/* Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(51,226,230,0.3)] group-hover:shadow-[0_0_30px_rgba(51,226,230,0.5)] transition-shadow">
                <img src={ELARA_AVATAR} alt="Elara" className="w-full h-full object-cover" />
              </div>
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

      {/* ═══ BIOWARE-STYLE DIALOG BOX ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(10px)" }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] sm:h-[600px] sm:max-h-[80vh] z-50 flex flex-col"
          >
            {/* Glass container */}
            <div className="flex-1 flex flex-col bg-[var(--bg-void)]/95 sm:rounded-xl border border-[var(--glass-border)] overflow-hidden shadow-[0_0_60px_rgba(51,226,230,0.1)]"
                 style={{ backdropFilter: "blur(20px)" }}>
              
              {/* ── HEADER ── */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--glass-border)]"
                   style={{ background: "linear-gradient(180deg, rgba(22,30,95,0.5) 0%, rgba(1,0,32,0.8) 100%)" }}>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--neon-cyan)]/50 shadow-[0_0_10px_rgba(51,226,230,0.2)]">
                  <img src={ELARA_AVATAR} alt="Elara" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-white tracking-wider">ELARA</h3>
                  <p className="font-mono text-[10px] text-[var(--neon-cyan)]/70 tracking-widest">ARK NAVIGATOR // LORE KEEPER</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <X size={18} />
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
                        ? "bg-[var(--electric-blue)]/20 border border-[var(--electric-blue)]/30 text-white/90"
                        : "bg-[var(--glass-base)] border border-[var(--glass-border)] text-white/85"
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
              <div className="border-t border-[var(--glass-border)]"
                   style={{ background: "linear-gradient(0deg, rgba(1,0,32,0.95) 0%, rgba(22,30,95,0.3) 100%)" }}>
                
                {/* Portrait bar */}
                <div className="flex items-end gap-3 px-4 pt-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[var(--neon-cyan)]/30 shadow-[0_0_15px_rgba(51,226,230,0.15)] flex-shrink-0">
                    <img src={ELARA_PORTRAIT} alt="Elara" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles size={12} className="text-[var(--deep-purple)]" />
                      <span className="font-display text-[10px] text-[var(--deep-purple)] tracking-[0.2em]">ELARA</span>
                    </div>
                    <p className="font-mono text-[11px] text-white/50 leading-snug">
                      {isLoading ? "Processing dimensional data..." : "Select a response:"}
                    </p>
                  </div>
                </div>

                {/* Dialog choices */}
                <div className="px-4 py-3 space-y-1.5 max-h-[200px] overflow-y-auto">
                  {!isLoading && choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-[var(--neon-cyan)]/30 hover:bg-[var(--glass-base)] transition-all group"
                    >
                      <ChevronRight size={12} className="text-[var(--neon-cyan)]/50 group-hover:text-[var(--neon-cyan)] transition-colors flex-shrink-0" />
                      <span className="font-mono text-xs text-white/70 group-hover:text-white transition-colors">
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
                        className="flex-1 bg-[var(--glass-dark)] border border-[var(--glass-border)] rounded-md px-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:border-[var(--neon-cyan)] focus:outline-none focus:shadow-[0_0_10px_rgba(51,226,230,0.15)]"
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
        )}
      </AnimatePresence>
    </>
  );
}
