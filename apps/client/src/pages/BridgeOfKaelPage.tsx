/* ═══════════════════════════════════════════════════════
   BRIDGE OF KAEL POST-CREDITS — Act 5 denouement

   Fires once after the player completes Kael's questline
   and returns to the bridge. Canon shell lives in
   `apps/shared/actsFourFiveShells.ts` BRIDGE_OF_KAEL_POST_CREDITS;
   this page renders the scene, plays the 3 EngineerRecall VO
   lines (act5-vo-lines.json §5.1 `bridge-of-kael-{1,2,3}`),
   and raises `returned_to_bridge_post_kael` + the canonical
   seen flag so the completion gate + cross-system watchers
   pick up the moment.

   Route: /bridge-of-kael. Unlocked when
   `kael_questline_complete` holds (bridge button on Ark
   explorer / Witnessing Hub).
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Star } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { BRIDGE_OF_KAEL_POST_CREDITS } from "@shared/actsFourFiveShells";
import LivingBackground from "@/components/LivingBackground";
import { useActVO } from "@/hooks/useActVO";
import { assetUrl } from "@/lib/assetUrl";

export default function BridgeOfKaelPage() {
  const { state, setNarrativeFlag } = useGame();
  const [, navigate] = useLocation();
  const flags = state.narrativeFlags ?? {};
  const vo = useActVO("5");
  const firedRef = useRef(false);

  // Gate: the player only sees this after Kael's questline completes.
  // Without that flag we route them back; the Hub CTA shouldn't
  // have been offered in the first place, but be defensive.
  const unlocked = Boolean(flags.kael_questline_complete);

  useEffect(() => {
    if (!unlocked) {
      navigate("/witnessing");
    }
  }, [unlocked, navigate]);

  // Fire the returned-to-bridge trigger + the 3-line Engineer
  // recall sequence once per save. The post-credit-seen flag
  // is set on the player's close-out button, not here — canon
  // gives them the choice to sit in the scene.
  useEffect(() => {
    if (firedRef.current) return;
    if (!unlocked) return;
    firedRef.current = true;
    if (!flags.returned_to_bridge_post_kael) {
      setNarrativeFlag("returned_to_bridge_post_kael", true);
    }
    vo.speak("bridge-of-kael-1");
    vo.speak("bridge-of-kael-2");
    vo.speak("bridge-of-kael-3");
  }, [unlocked, flags.returned_to_bridge_post_kael, setNarrativeFlag, vo]);

  const close = useCallback(() => {
    if (!flags[BRIDGE_OF_KAEL_POST_CREDITS.flag]) {
      setNarrativeFlag(BRIDGE_OF_KAEL_POST_CREDITS.flag, true);
    }
    navigate("/witnessing");
  }, [flags, setNarrativeFlag, navigate]);

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={assetUrl("art/rooms/room-bridge.png")}
        accent="rgba(212, 188, 120, 0.28)"
        opacity={0.1}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-amber-500/25 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/witnessing"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300/80 hover:text-amber-100"
        >
          <ChevronLeft size={14} />
          Witnessing Hub
        </Link>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
            §5 · The Bridge of Kael
          </p>
          <p className="mt-1 font-serif text-lg italic text-amber-50">
            {BRIDGE_OF_KAEL_POST_CREDITS.title}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
          Post-credits
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 space-y-8">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="rounded-md border border-amber-500/30 bg-stone-950/60 p-6 backdrop-blur"
        >
          <ul className="space-y-3 font-serif text-[14px] italic text-amber-100/90 leading-relaxed">
            {BRIDGE_OF_KAEL_POST_CREDITS.changes.map((line, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.8, duration: 0.8 }}
              >
                — {line}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 1.5 }}
          className="rounded-md border border-amber-500/40 bg-amber-950/20 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-amber-300" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
              Console
            </p>
          </div>
          <p className="font-serif text-[13px] italic text-amber-50/90 leading-relaxed">
            {BRIDGE_OF_KAEL_POST_CREDITS.consoleObject}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 9, duration: 1.8 }}
          className="rounded-md border border-emerald-500/30 bg-emerald-950/10 p-5 text-center"
        >
          <p className="font-serif text-[16px] italic text-emerald-50/95 leading-relaxed">
            &ldquo;{BRIDGE_OF_KAEL_POST_CREDITS.closingLine}&rdquo;
          </p>
        </motion.section>

        <div className="flex justify-center pt-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 12, duration: 1 }}
            onClick={close}
            className="rounded border border-amber-500/50 bg-amber-950/30 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-100 hover:bg-amber-900/50"
          >
            Close the console
          </motion.button>
        </div>
      </main>
    </div>
  );
}
