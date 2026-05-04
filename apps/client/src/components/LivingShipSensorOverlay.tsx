/**
 * LivingShipSensorOverlay — The Ark feels it through the hull
 *
 * Renders the highest-priority active ship-sensor reaction as a
 * small floating overlay on the Ark exploration page. Surfaces
 * Elara's catch-line, names the affected room, and provides an
 * "Investigate" CTA the player can click to be routed to that
 * room (or to the relevant NPC tutorial scene).
 *
 * Visual register varies by sensor pattern: creak / flicker /
 * red_tint / frost_bloom / low_thrum / static_burst / lights_dim
 * / lights_warm. Each maps to a colour + animation cue per
 * shipSensorReactions.ts canon.
 *
 * The component self-suppresses if no reaction is active.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Eye, X } from "lucide-react";
import { useLivingShipSensor } from "@/hooks/useLivingShipSensor";
import type { SensorPattern, ShipSensorReaction } from "@shared/shipSensorReactions";

const PATTERN_PRESET: Record<
  SensorPattern,
  { ringClass: string; iconClass: string; pulseDuration: number }
> = {
  creak: { ringClass: "border-zinc-600", iconClass: "text-zinc-300", pulseDuration: 3.6 },
  flicker: { ringClass: "border-amber-500/70", iconClass: "text-amber-300", pulseDuration: 0.9 },
  red_tint: { ringClass: "border-red-700/70", iconClass: "text-red-400", pulseDuration: 2.2 },
  frost_bloom: { ringClass: "border-cyan-600/70", iconClass: "text-cyan-300", pulseDuration: 4.2 },
  low_thrum: { ringClass: "border-indigo-600/70", iconClass: "text-indigo-300", pulseDuration: 5.0 },
  static_burst: { ringClass: "border-fuchsia-600/70", iconClass: "text-fuchsia-300", pulseDuration: 0.6 },
  lights_dim: { ringClass: "border-stone-700", iconClass: "text-stone-300", pulseDuration: 4.0 },
  lights_warm: { ringClass: "border-amber-600/70", iconClass: "text-amber-200", pulseDuration: 3.0 },
};

const ROOM_LABELS: Record<string, string> = {
  cryo_bay: "Cryo Bay",
  medical_bay: "Medical Bay",
  bridge: "Bridge",
  archives: "Archives",
  comms_array: "Comms Array",
  observation_deck: "Observation Deck",
  armory: "Armory",
  engineering: "Engineering",
  trade_hub: "Trade Hub",
  cargo_bay: "Cargo Bay",
  trophy_room: "Trophy Room",
  captains_quarters: "Captain's Quarters",
};

function formatRoom(roomId: string): string {
  return ROOM_LABELS[roomId] ?? roomId.replace(/_/g, " ");
}

export default function LivingShipSensorOverlay() {
  const { primaryReaction } = useLivingShipSensor();
  const [dismissed, setDismissed] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {primaryReaction && dismissed !== primaryReaction.eventId && (
        <SensorReactionPanel
          key={primaryReaction.eventId}
          reaction={primaryReaction}
          onDismiss={() => setDismissed(primaryReaction.eventId)}
        />
      )}
    </AnimatePresence>
  );
}

function SensorReactionPanel({
  reaction,
  onDismiss,
}: {
  reaction: ShipSensorReaction;
  onDismiss: () => void;
}) {
  const preset = PATTERN_PRESET[reaction.pattern];
  const roomName = formatRoom(reaction.affectedRoomId);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-24 right-6 z-40 max-w-sm rounded-lg border ${preset.ringClass} bg-zinc-950/95 backdrop-blur p-4 shadow-lg`}
      data-component="living-ship-sensor-overlay"
      data-event={reaction.eventId}
      data-pattern={reaction.pattern}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: preset.pulseDuration, repeat: Infinity }}
          className="shrink-0 mt-1"
          aria-hidden="true"
        >
          <Activity size={18} className={preset.iconClass} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Hull-sense · {roomName}
          </div>
          <p className="text-sm text-zinc-100 leading-relaxed mb-3">
            {reaction.elaraCatchLine}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`/room/${reaction.affectedRoomId}`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <Eye size={12} />
              Investigate
            </a>
            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Not yet
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-zinc-600 hover:text-zinc-300 shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </motion.aside>
  );
}
