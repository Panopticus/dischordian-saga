/* useAgentZeroVO — Plays Agent Zero's voice lines from S3 manifest */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/agent_zeroVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useAgentZeroVO() {
  return useNpcVO("agent_zero", loader);
}
