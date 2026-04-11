/* ═══════════════════════════════════════════════════════
   CADESAmbientLines — renders the currently applicable
   CADES ambient NPC chatter and Game Masters surveillance
   lines. Uses useCadesAmbientLines to evaluate conditions.
   ═══════════════════════════════════════════════════════ */
import { useCadesAmbientLines } from "@/hooks/useCadesAmbientLines";

const NPC_LABELS: Record<string, { name: string; color: string }> = {
  elara:             { name: "ELARA",             color: "#8b5cf6" },
  the_human:         { name: "THE HUMAN",         color: "#ef4444" },
  agent_zero:        { name: "AGENT ZERO",        color: "#f59e0b" },
  adjudicator_locke: { name: "ADJUDICATOR LOCKE", color: "#eab308" },
  the_antiquarian:   { name: "THE ANTIQUARIAN",   color: "#a855f7" },
  the_source:        { name: "THE SOURCE",        color: "#06b6d4" },
};

export function CADESAmbientLines({ memeRevealed = false }: { memeRevealed?: boolean }) {
  const { ambientLines, surveillanceLines } = useCadesAmbientLines({ memeRevealed });
  if (ambientLines.length === 0 && surveillanceLines.length === 0) return null;

  // Show at most one per speaker to keep it compact.
  const seen = new Set<string>();
  const pickedAmbient = ambientLines.filter((l) => {
    if (seen.has(l.npcId)) return false;
    seen.add(l.npcId);
    return true;
  }).slice(0, 4);

  const topSurveillance = surveillanceLines.slice(0, 2);

  return (
    <div className="space-y-3">
      {pickedAmbient.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur p-4">
          <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "#8b5cf6" }}>
            AMBIENT CHATTER — NPC RESPONSES
          </p>
          <div className="space-y-3">
            {pickedAmbient.map((line) => {
              const label = NPC_LABELS[line.npcId] ?? { name: line.npcId.toUpperCase(), color: "#64748b" };
              return (
                <div key={line.id} className="border-l-2 pl-3" style={{ borderColor: label.color + "80" }}>
                  <p className="font-mono text-[8px] tracking-widest mb-1" style={{ color: label.color }}>
                    {label.name}
                  </p>
                  <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#e2e8f0" }}>
                    {line.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {topSurveillance.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(30, 20, 60, 0.3)",
            border: "1px solid rgba(139, 92, 246, 0.4)",
          }}
        >
          <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "#8b5cf6" }}>
            [GAME MASTERS — SECONDARY CHANNEL]
          </p>
          <div className="space-y-2">
            {topSurveillance.map((line) => (
              <p
                key={line.id}
                className="font-mono text-[10px] leading-relaxed whitespace-pre-line"
                style={{
                  color: line.style === "overt" ? "#c4b5fd" : "#64748b",
                  fontStyle: line.style === "cryptic" ? "italic" : "normal",
                }}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
