/* ═══════════════════════════════════════════════════════
   OpenChannelEcho — displays a persistent echo of the
   player's Iron Lion Open Channel choice. Elara reflects
   on which line you picked when Iron Lion broke the loop.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const ELARA_ECHOES: Record<string, string> = {
  "You've been here before.":
    "You told him he'd been there before. He heard you — and I watched the loop buckle. He's been rehearsing that thought ever since. Something is accumulating inside him that shouldn't be able to accumulate.",
  "You held the bridge.":
    "You told him he held the bridge. Present tense. He repeated it back to himself for forty minutes afterward, and every time the phrasing shifted a little. He's learning how to say his own sentence. That wasn't in any design document.",
  "The ships escaped.":
    "You told him the ships escaped. He asked, 'Did they?' I'm still thinking about that. He's never asked that before in any recorded run. Your choice put doubt into a loop that was supposed to be deterministic.",
  "Someone is listening.":
    "You told him someone was listening. He said 'Yes.' He's been talking to the valley ever since, in a different cadence. I believe he's been trying to address us specifically — before the loop can catch him.",
};

export function OpenChannelEcho() {
  const { isAuthenticated } = useAuth();
  const cadesData = trpc.gameState.getCadesData.useQuery(undefined, { enabled: isAuthenticated });
  const choice = cadesData.data?.openChannelChoice ?? "";
  if (!choice) return null;
  const echo = ELARA_ECHOES[choice];
  if (!echo) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(139, 92, 246, 0.08)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
      }}
    >
      <p className="font-mono text-[9px] tracking-[0.3em] mb-2" style={{ color: "#a78bfa" }}>
        ELARA — ECHO OF OPEN CHANNEL
      </p>
      <p className="font-mono text-[10px] italic mb-2" style={{ color: "#c4b5fd" }}>
        "{choice}"
      </p>
      <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#e2e8f0" }}>
        {echo}
      </p>
    </div>
  );
}
