/* ═══════════════════════════════════════════════════════
   COMPANION PRESENCE BADGE — Section 9 polish.

   Persistent corner pip in every Ark room reminding the player who
   the voice they're hearing belongs to. Two slots: Elara on the
   left, the human on the right. A status dot under each goes
   solid-cyan when that party is currently speaking, dim when they
   are merely monitoring.

   The component is purely presentational — `elaraSpeaking` and
   `humanSpeaking` are driven by whatever conversation popup or
   narrator is live above. We avoid pulling those hooks here so the
   badge can render anywhere in the room shell without taking on a
   policy. ═══════════════════════════════════════════════════════ */
import HolographicElara from "@/components/HolographicElara";

interface CompanionPresenceBadgeProps {
  /** When true, Elara's portrait pulses + the dot goes solid. */
  elaraSpeaking?: boolean;
  /** When true, the human's portrait pulses + the dot goes solid. */
  humanSpeaking?: boolean;
  /** Override default placement (top-right). Single-axis offsets only;
   *  pass `none` to let the parent position the badge itself. */
  placement?: "top-right" | "top-left" | "bottom-right" | "none";
}

const PLACEMENT_CLASS: Record<NonNullable<CompanionPresenceBadgeProps["placement"]>, string> = {
  // Placements clear the page chrome that lives in the same corner.
  // top-right collides with the Ark header's INVENTORY / FULLSCREEN
  // buttons, so callers should prefer bottom-right or top-left for
  // in-room ambient presence.
  "top-right": "fixed top-20 right-3",
  "top-left": "fixed top-3 left-3",
  "bottom-right": "fixed bottom-6 right-4",
  "none": "",
};

export function CompanionPresenceBadge({
  elaraSpeaking = false,
  humanSpeaking = false,
  placement = "top-right",
}: CompanionPresenceBadgeProps) {
  return (
    <div
      className={`${PLACEMENT_CLASS[placement]} z-[55] pointer-events-none flex items-end gap-3`}
      aria-hidden
    >
      <Slot
        speaking={elaraSpeaking}
        label="ELARA"
        accent="var(--neon-cyan)"
      >
        {/* Reuses the holographic Elara renderer at its smallest size
            so visemes (when audio is attached upstream) still drive
            the mouth — but here we don't pipe audio in. The badge is
            ambient presence, not a viseme view. */}
        <HolographicElara size="sm" isSpeaking={elaraSpeaking} />
      </Slot>
      <Slot
        speaking={humanSpeaking}
        label="YOU"
        accent="var(--energy-system)"
      >
        {/* Static disc placeholder — the human sprite has no
            holographic frame in current art. A solid coloured ring
            communicates "this slot is the human" without faking a
            second hologram. */}
        <div
          className="w-[44px] h-[44px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, color-mix(in oklch, var(--energy-system) 35%, transparent), transparent 70%)",
            border: humanSpeaking
              ? "1px solid color-mix(in oklch, var(--energy-system) 70%, transparent)"
              : "1px solid color-mix(in oklch, var(--energy-system) 22%, transparent)",
            boxShadow: humanSpeaking
              ? "0 0 18px color-mix(in oklch, var(--energy-system) 35%, transparent)"
              : "none",
            transition: "border 0.25s ease, box-shadow 0.25s ease",
          }}
        />
      </Slot>
    </div>
  );
}

function Slot({
  children,
  speaking,
  label,
  accent,
}: {
  children: React.ReactNode;
  speaking: boolean;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {children}
      <div className="flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: speaking ? accent : `color-mix(in oklch, ${accent} 25%, transparent)`,
            boxShadow: speaking ? `0 0 6px ${accent}` : "none",
            transition: "background 0.25s ease, box-shadow 0.25s ease",
          }}
        />
        <span
          className="font-mono text-[8px] tracking-[0.25em]"
          style={{ color: speaking ? accent : `color-mix(in oklch, ${accent} 50%, transparent)` }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default CompanionPresenceBadge;
