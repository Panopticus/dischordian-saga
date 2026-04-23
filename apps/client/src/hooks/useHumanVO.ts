/* useHumanVO — Plays The Human's voice lines from S3 manifest */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/humanVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useHumanVO() {
  return useNpcVO("human", loader);
}
