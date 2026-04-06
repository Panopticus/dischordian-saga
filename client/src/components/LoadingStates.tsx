/* ═══════════════════════════════════════════════════════
   LOADING + ERROR STATES — Reusable UI for every page

   Consistent graceful fallbacks for:
   - Data fetching
   - Server errors
   - Offline mode
   - Empty states
   ═══════════════════════════════════════════════════════ */
import { motion } from "framer-motion";
import { Radio, WifiOff, AlertTriangle, Inbox, Cpu } from "lucide-react";

/* ─── LOADING SPINNER (in-world) ─── */

export function ArkLoader({ message = "ACCESSING SYSTEMS..." }: { message?: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 p-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Radio size={16} className="text-cyan-400 animate-pulse" />
        </div>
      </div>
      <p className="font-mono text-[10px] text-cyan-400/60 tracking-[0.3em]">{message}</p>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-1 h-1 rounded-full bg-cyan-400"
          />
        ))}
      </div>
    </div>
  );
}

/* ─── SKELETON CARDS ─── */

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          className="p-3 void-surface"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-white/5 rounded w-3/4" />
              <div className="h-2 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── ERROR STATES ─── */

export function ErrorDisplay({
  title = "SIGNAL LOST",
  message = "The Ark's systems are experiencing turbulence. Try again in a moment.",
  onRetry,
}: { title?: string; message?: string; onRetry?: () => void }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-2">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <p className="font-display text-sm font-bold tracking-[0.2em] text-red-400">{title}</p>
      <p className="font-mono text-xs text-white/40 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 void-surface border-red-500/30 text-red-400 font-mono text-[10px] tracking-wider hover:bg-red-500/20 transition-colors"
        >
          RETRY CONNECTION
        </button>
      )}
    </div>
  );
}

export function OfflineDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2">
        <WifiOff size={24} className="text-amber-400" />
      </div>
      <p className="font-display text-sm font-bold tracking-[0.2em] text-amber-400">COMMS ARRAY OFFLINE</p>
      <p className="font-mono text-xs text-white/40 max-w-sm leading-relaxed">
        Cannot reach the Ark's network. Some features may be limited until connection is restored.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-[10px] tracking-wider hover:bg-amber-500/20 transition-colors"
        >
          RECONNECT
        </button>
      )}
    </div>
  );
}

/* ─── EMPTY STATES ─── */

export function EmptyState({
  icon: Icon = Inbox,
  title = "NO DATA",
  message = "Nothing here yet. Come back after exploring.",
}: { icon?: typeof Inbox; title?: string; message?: string }) {
  return (
    <div className="min-h-[30vh] flex flex-col items-center justify-center gap-2 p-8 text-center">
      <Icon size={32} className="text-white/15 mb-2" />
      <p className="font-mono text-xs text-white/40 tracking-wider">{title}</p>
      <p className="font-mono text-[10px] text-white/20 max-w-xs">{message}</p>
    </div>
  );
}

/* ─── INLINE LOADING (small spinner) ─── */

export function InlineSpinner({ size = 14 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="inline-block"
    >
      <Cpu size={size} className="text-cyan-400/60" />
    </motion.div>
  );
}

/* ─── BOOT SEQUENCE (for major loading events) ─── */

export function BootSequence({ messages }: { messages: string[] }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full px-6">
        <div className="font-mono text-xs space-y-1">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-cyan-400/70"
            >
              ▸ {msg}
            </motion.div>
          ))}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-cyan-400 ml-1"
          />
        </div>
      </div>
    </div>
  );
}
