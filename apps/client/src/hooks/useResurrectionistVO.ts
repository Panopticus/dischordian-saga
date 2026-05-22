/* useResurrectionistVO — Plays the Resurrectionist's voice lines
   from S3 manifest. Same thin-wrapper pattern as useLockeVO /
   useHumanVO / etc. — see useNpcVO for the shared engine. */
import { useNpcVO } from "./useNpcVO";

const loader = async () => {
  const m = await import("@shared/resurrectionistVoManifest.json");
  return (m.default || m) as Record<string, string>;
};

export function useResurrectionistVO() {
  return useNpcVO("resurrectionist", loader);
}
