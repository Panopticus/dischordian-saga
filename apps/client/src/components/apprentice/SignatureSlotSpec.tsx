/* ═══════════════════════════════════════════════════════
   SIGNATURE SLOT SPEC — per-(archetype × doctrine) preview.

   Renders the producer-spec record from {@link signatureCardManifest}
   for a given (archetype, doctrineId) pair: which motif the
   doctrine resolves to, the slot id producers paint into, the
   composition prompt the painter starts from, and the color
   anchor the renderer overlays.

   First non-test consumer of signatureCardManifest. Mounted
   under each doctrine option in DoctrinePicker so the
   apprentice picker doubles as a "this is what your signature
   card will look like" preview.
   ═══════════════════════════════════════════════════════ */
import {
  motifFromDoctrine,
  signatureArtSlotId,
  getSignatureArtSlotSpec,
} from "@shared/expansionArt/signatureCardManifest";
import type { ApprenticeArchetype } from "@shared/apprentices";
import type { DoctrineId } from "@shared/apprenticeDoctrines";

interface Props {
  archetype: ApprenticeArchetype;
  doctrineId: DoctrineId;
}

const MOTIF_LABEL: Record<ReturnType<typeof motifFromDoctrine>, string> = {
  tuning_fork: "Tuning Fork",
  two_doors: "Two Doors",
  iron_keyhole: "Iron Keyhole",
  withheld_letter: "Withheld Letter",
  open_palm: "Open Palm",
};

export function SignatureSlotSpec({ archetype, doctrineId }: Props) {
  const motif = motifFromDoctrine(doctrineId);
  const slotId = signatureArtSlotId(archetype, motif);
  const spec = getSignatureArtSlotSpec(slotId);
  if (!spec) return null;
  return (
    <div className="mt-2 space-y-1.5 pl-2 border-l border-slate-800 text-xs">
      <div className="text-slate-400">
        Motif: <span className="text-slate-200">{MOTIF_LABEL[motif]}</span>
      </div>
      <div className="text-slate-400">
        Slot: <code className="text-slate-300">{slotId}</code>
      </div>
      <div className="text-slate-300 italic">{spec.composition}</div>
      <div className="text-slate-500">
        Color anchor: <span className="text-slate-300">{spec.colorAnchor}</span>
      </div>
    </div>
  );
}
