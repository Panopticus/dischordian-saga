/* ═══════════════════════════════════════════════════════
   MOBILE NARRATOR SLOT — §1.2 floating companion hologram.

   Renders the single-slot hologram card in the upper corner
   of a room view. On mount (or when roomId/bonds/flags
   change) it reseeds the slot via the Witnessing store,
   then displays whichever narrator landed in the slot —
   Elara, The Human, or silence.

   The slot exposes a dismiss button that opens the §1.3
   three-option wheel (give_space / rather_hear_other /
   both_out). Bond deltas are applied via the GameContext
   adjusters; the bond score displayed is read live.

   Usage:
     <MobileNarratorSlot roomId="archives" />
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { NarratorId, NarratorRoomId } from "@shared/mobileNarrator";
import {
  deriveNarratorDominance,
  getBondLocks,
  type DismissalChoice,
} from "@shared/mobileNarrator";
import { pickNarratorLine } from "@shared/mobileNarratorDialog";
import { pickLyraVoxLine } from "@shared/lyraVoxDialog";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { applyDischordiaEnergy } from "@/stores/dischordiaCycleStore";
import { recordMemorableMoment } from "@/stores/memorableMomentsStore";
import { useGame } from "@/contexts/GameContext";
import { getNPCBust } from "@/game/npcPortraits";

export interface MobileNarratorSlotProps {
  roomId: NarratorRoomId;
  /**
   * Optional story flags in effect right now. Callers that
   * track the Prelude reveal beats (§1.4) should pass them in
   * here so forcing flags can fire.
   */
  flags?: ReadonlySet<string>;
  /** Optional extra class names for the wrapping card. */
  className?: string;
}

const NARRATOR_NAME: Record<NarratorId, string> = {
  elara: "Elara",
  the_human: "The Human",
  lyra_vox: "Dr. Lyra Vox",
};

const NARRATOR_ACCENT: Record<NarratorId, { ring: string; text: string; dot: string }> = {
  elara: { ring: "ring-cyan-400/40", text: "void-text-energy", dot: "void-bg-success" },
  the_human: { ring: "ring-amber-400/40", text: "void-text-accent", dot: "void-bg-sunk" },
  lyra_vox: { ring: "ring-violet-400/40", text: "void-text-system", dot: "void-bg-system" },
};

export function MobileNarratorSlot({ roomId, flags, className }: MobileNarratorSlotProps) {
  const game = useGame();
  const elaraBond = game.state.elaraTrustLevel;
  const humanBond = game.state.humanTrustLevel;
  const adjustElara = game.adjustElaraTrust;
  const adjustHuman = game.adjustHumanTrust;

  // Hide the corner narrator card while another Elara/companion surface
  // owns the screen (ElaraConversationPopup, AutoTutorialPrompt). Two
  // Elara faces in the same view at once was the duplicate-portrait bug.
  const [conversationActive, setConversationActive] = useState(false);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setConversationActive(Boolean(detail?.active));
    };
    window.addEventListener("elara-dialog", handler);
    return () => window.removeEventListener("elara-dialog", handler);
  }, []);

  // §1.5 — derive the narrator dominance once per render from the
  // game's narrative flags. Passed through to the witnessing store
  // so the slot roll respects the player's Bond-80 Forgive choice.
  const dominance = useMemo(
    () => deriveNarratorDominance(game.state.narrativeFlags),
    [game.state.narrativeFlags],
  );

  const enterRoom = useWitnessingStore((s) => s.enterRoom);
  const dismiss = useWitnessingStore((s) => s.dismiss);
  const slot = useWitnessingStore((s) => s.currentSlot);
  const currentRoomId = useWitnessingStore((s) => s.currentRoomId);

  const [wheelOpen, setWheelOpen] = useState(false);

  // Reseed on room entry or when bonds/flags/dominance meaningfully
  // change. We key on (roomId, flag set identity, dominance) so
  // callers can re-trigger by passing a fresh Set when a Prelude
  // beat fires, and a forgiveness choice immediately biases every
  // subsequent room entry.
  useEffect(() => {
    enterRoom(roomId, { elaraBond, humanBond }, flags, dominance);
    // We intentionally only reseed on roomId/flags/dominance changes.
    // Bond drift during a single room visit should NOT reseat the
    // slot mid-conversation — that would feel jarring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, flags, dominance, enterRoom]);

  const line = useMemo(() => {
    if (!slot?.narratorId) return null;
    // Lyra Vox uses her own dialog lookup — she's always-on and
    // not gated by bond tier.
    if (slot.narratorId === "lyra_vox") {
      const lvLine = pickLyraVoxLine(roomId, game.state.narrativeFlags);
      if (!lvLine) return null;
      // Adapt to the NarratorLine shape so the render below can
      // reuse its path.
      return { tier: "F" as const, text: lvLine.text };
    }
    const bond = slot.narratorId === "elara" ? elaraBond : humanBond;
    // Pass the active beat flags through so beat-tagged lines
    // (e.g. the §2.7 Archives opener) can override the normal
    // tier-weighted selection. F8 — cap tier at "P" until the
    // player has actually met the Human; otherwise H/V/D lines
    // that reference "both of you" / the Warlord / etc. fire on
    // first cryo-bay entry purely off Elara's starting bond.
    const firstHumanRevealed = Boolean(
      game.state.narrativeFlags?.first_human_revealed,
    );
    return pickNarratorLine(roomId, slot.narratorId, bond, flags, firstHumanRevealed);
  }, [slot, roomId, elaraBond, humanBond, flags, game.state.narrativeFlags]);

  const handleDismiss = useCallback(
    (choice: DismissalChoice) => {
      const deltas = dismiss(
        choice,
        { elaraBond, humanBond },
        flags,
        dominance,
      );
      if (deltas.elaraBond) adjustElara(deltas.elaraBond);
      if (deltas.humanBond) adjustHuman(deltas.humanBond);
      // Witnessing §3.6 — dismissing a companion feeds the Dark
      // meter. All three wheel options count; the third ("silence")
      // is a harsher dismissal of BOTH, so we apply it twice.
      applyDischordiaEnergy("dismiss_companion");
      if (choice === "both_out") {
        applyDischordiaEnergy("dismiss_companion");
      }
      // Witnessing §11.2 — record a memorable moment for the
      // Antiquarian's Lion in Black feed. The silence choice
      // fills the "night you chose silence" slot specifically.
      const dismissedId = slot?.narratorId;
      if (choice === "both_out") {
        recordMemorableMoment(
          "silence_chosen",
          `The night you chose silence in the ${roomId.replace(/_/g, " ")}.`,
        );
      } else if (dismissedId) {
        const nameFor = dismissedId === "elara" ? "Elara" : "The Human";
        recordMemorableMoment(
          "companion_argument",
          `An argument with ${nameFor} in the ${roomId.replace(/_/g, " ")}.`,
          undefined,
          { narratorId: dismissedId, choice },
        );
      }
      setWheelOpen(false);
    },
    [dismiss, elaraBond, humanBond, flags, dominance, adjustElara, adjustHuman, slot, roomId],
  );

  // Don't render until we've actually seeded for this room.
  if (!slot || currentRoomId !== roomId) return null;

  // Suppress while a foreground Elara surface owns the screen.
  if (conversationActive) return null;

  // Silence mode — the slot is empty. Render a whisper-quiet state.
  if (slot.narratorId === null) {
    return (
      <div
        className={`absolute top-4 right-4 w-56 rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-3 ${className ?? ""}`}
        data-testid="narrator-slot-silence"
      >
        <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1">
          Narrator Slot
        </p>
        <p className="font-mono text-xs italic text-white/50">
          The slot is empty. You asked for silence; they gave it.
        </p>
      </div>
    );
  }

  const narratorId = slot.narratorId;
  const accent = NARRATOR_ACCENT[narratorId];
  // Lyra Vox has no NPC portrait or bond score — she's the ship.
  const isLyraVox = narratorId === "lyra_vox";
  const bust = isLyraVox ? null : getNPCBust(narratorId);
  const bond = narratorId === "elara" ? elaraBond : narratorId === "the_human" ? humanBond : 0;
  const locks = isLyraVox ? [] : getBondLocks(narratorId, bond);

  return (
    <motion.div
      key={narratorId}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.4 }}
      className={`absolute top-4 right-4 w-64 rounded-lg border border-white/10 bg-black/60 backdrop-blur-md shadow-lg p-3 ${className ?? ""}`}
      data-testid={`narrator-slot-${narratorId}`}
    >
      <div className="flex items-center gap-3">
        {bust && (
          <img
            src={bust}
            alt={NARRATOR_NAME[narratorId]}
            className={`w-12 h-12 rounded-full object-cover ring-2 ${accent.ring}`}
            style={{ objectPosition: "center 22%" }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} animate-pulse`} />
            <p
              className={`font-display text-sm font-bold tracking-wide ${accent.text}`}
            >
              {NARRATOR_NAME[narratorId]}
            </p>
          </div>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
            {isLyraVox ? "Ship Substrate" : `Bond ${bond}`}
          </p>
        </div>
        {/* Lyra Vox cannot be dismissed — she is the ship. */}
        {!isLyraVox && (
          <button
            type="button"
            onClick={() => setWheelOpen((v) => !v)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition"
            aria-label="Dismiss narrator"
            data-testid="narrator-slot-dismiss"
          >
            <X size={14} className="text-white/60" />
          </button>
        )}
      </div>

      {/* Dialog line for this room × narrator × bond. */}
      {line ? (
        <p className="mt-3 font-mono text-xs text-white/80 leading-relaxed italic">
          &ldquo;{line.text}&rdquo;
        </p>
      ) : (
        <p className="mt-3 font-mono text-[11px] text-white/40">
          {NARRATOR_NAME[narratorId]} is quiet here. You haven&rsquo;t earned
          these lines yet.
        </p>
      )}

      {/* Bond lock hints (§1.3 teeth). */}
      {locks.length > 0 && (
        <p className="mt-2 font-mono text-[10px] void-text-error">
          Locked: {locks.join(", ")}
        </p>
      )}

      {/* Dismissal wheel overlay. */}
      <AnimatePresence>
        {wheelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 border-t border-white/10 pt-3 space-y-1"
            data-testid="narrator-slot-wheel"
          >
            <WheelButton
              label="Give me space"
              sub="−2 bond, 10 min. They return wounded."
              onClick={() => handleDismiss("give_space")}
            />
            <WheelButton
              label="I'd rather hear the other one"
              sub="−5 dismissed, +3 summoned. Swap for 3 rooms."
              onClick={() => handleDismiss("rather_hear_other")}
            />
            <WheelButton
              label="Both of you. Out."
              sub="−3 both. Silence for 20 min. Unlocks a tome page."
              onClick={() => handleDismiss("both_out")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WheelButton({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-2 py-1.5 rounded hover:bg-white/5 transition"
    >
      <p className="font-mono text-xs text-white/90">{label}</p>
      <p className="font-mono text-[10px] text-white/40">{sub}</p>
    </button>
  );
}
