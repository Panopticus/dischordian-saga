/* useSourceVO — Plays Source's voice lines from S3 manifest */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/sourceVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useSourceVO() {
  return useNpcVO("source", loader);
}
