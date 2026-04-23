/* useShadowTongueVO — Plays Shadow Tongue's voice lines from S3 manifest */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/shadow_tongueVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useShadowTongueVO() {
  return useNpcVO("shadow_tongue", loader);
}
