/* useAntiquarianVO — Plays Antiquarian's voice lines from S3 manifest */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/antiquarianVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useAntiquarianVO() {
  return useNpcVO("antiquarian", loader);
}
