/* useLockeVO — Plays Locke's voice lines from S3 manifest */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/lockeVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useLockeVO() {
  return useNpcVO("locke", loader);
}
