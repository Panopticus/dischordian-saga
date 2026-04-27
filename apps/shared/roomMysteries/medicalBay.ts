/* ═══════════════════════════════════════════════════════
   MEDICAL BAY MYSTERY — verb × hotspot table

   Extends the LucasArts-style verb-coin pilot from the Cryo
   Bay (apps/shared/cryoBayMystery.ts) into the Med Bay.
   Hotspot ids match the Med Bay entries already declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime can wire `room-mystery:medical-bay:<id>`
   actions onto the existing hotspot rectangles without any
   coordinate authoring.

   Tier progression (see apps/shared/roomTier.ts):
     Tier 0 → 1   first Look on any clue-bearing hotspot fires
                  `medbay_first_clue_found`
     Tier 1 → 2   DNA device donate flow fires
                  `medbay_device_awakened`  (already wired in
                  ArkExplorerPage's dna-device-offer branch)
     Tier 2 → 3   `medbay_restored` (set by the runtime when
                  the player completes a follow-up beat — left
                  unauthored in this module so the existing
                  Section F flow stays the source of truth)
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type MedicalBayHotspotId =
  | "bio-bed"
  | "dna-helix"
  | "medicine-cabinet"
  | "medical-log"
  | "egg-vox-neural-bridge";

export const MEDICAL_BAY_MYSTERY: RoomMysteryModule<MedicalBayHotspotId> = {
  roomId: "medical-bay",
  responses: {
    "bio-bed": {
      look: {
        narration:
          "The bio-bed's holo-display is still active, cycling through old vitals belonging to no one in this room. Whoever was last on this slab was scanned mid-emergency — the readout stalls on a flat line that hasn't been cleared.",
        logsClue: {
          id: "clue-medbay-stalled-vitals",
          title: "A vitals scan that was never cleared",
          body: "The bio-bed froze mid-procedure on a flatline. The previous medical officer stopped the scan and ran. Nobody came back to acknowledge the patient.",
          source: "medical-bay",
          order: 0,
        },
        setsFlag: "medbay_first_clue_found",
      },
      talk: {
        narration:
          "Elara: \"Step on, and I'll run a fresh scan. The bed will accept you. I want to know what your blood is doing more than I want to admit.\"",
      },
    },
    "dna-helix": {
      look: {
        narration:
          "The DNA analysis station is still rotating a half-built helix. The species template comparison is paused on three rows: DeMagi, Quarchon, Ne-Yon — and a fourth row that the system has annotated only with a question mark.",
        logsClue: {
          id: "clue-medbay-fourth-template",
          title: "An unnamed fourth species template",
          body: "The DNA station has a fourth comparison row it can't classify. The template was added by hand, after the manifest was sealed.",
          source: "medical-bay",
          order: 1,
        },
        setsFlag: "medbay_first_clue_found",
      },
      use: {
        narration:
          "You won't learn what the fourth row is by poking the screen. You'd need a sample. The station is asking for one.",
      },
    },
    "medicine-cabinet": {
      look: {
        narration:
          "Most of these vials are standard stim-packs and neural stabilizers. Two compounds aren't in the manifest. One is labelled in a chemist's hand: 'do not let her see this.' The other is unlabelled entirely.",
        logsClue: {
          id: "clue-medbay-off-manifest-compounds",
          title: "Off-manifest compounds in the cabinet",
          body: "Two of the cabinet's vials don't appear in the ship's medical manifest. One carries a handwritten warning. The other has no label at all.",
          source: "medical-bay",
          order: 2,
        },
        setsFlag: "medbay_first_clue_found",
      },
      use: {
        narration:
          "You consider taking the unlabelled vial. You don't. The handwritten warning was left for someone, and pretending you aren't that someone won't change the chemistry.",
      },
    },
    "medical-log": {
      look: {
        narration:
          "The last medical officer's data pad. The timestamp is corrupted, but the entries describe patients hearing voices, dreaming the same dream, asking after a name nobody on the manifest carries. The final entry is one word: 'signal.'",
        logsClue: {
          id: "clue-medbay-signal-log",
          title: "Patients who heard a signal",
          body: "The med officer's final log describes patients across multiple wake-cycles converging on the same dream and the same name. The last word entered is 'signal.'",
          source: "medical-bay",
          order: 3,
        },
        setsFlag: "medbay_first_clue_found",
      },
    },
    "egg-vox-neural-bridge": {
      look: {
        narration:
          "It hums at a frequency you feel in your jaw. A neural-bridge apparatus, military grade, built to move consciousness between flesh and the Ark itself. The plate beside the needle-port is etched: 'L. Vox.'",
        logsClue: {
          id: "clue-medbay-vox-bridge",
          title: "Dr. Lyra Vox's neural bridge",
          body: "A hidden neural-bridge device behind the bio-bed. Etched with Dr. Vox's initials. The needle-port is warm — the device is waiting for a sample.",
          source: "medical-bay",
          order: 4,
        },
        setsFlag: "medbay_first_clue_found",
      },
      talk: {
        narration:
          "Elara: \"It is not a person. Do not try to talk to it. I have already tried.\"",
      },
      // The `use` verb on this hotspot is intentionally not authored
      // here — the existing dna-device-offer branch in ArkExplorerPage
      // owns the donate/refuse choice and sets `medbay_device_awakened`
      // (Tier 1 → 2 advancement) on donate. The verb-coin's "use"
      // dispatch falls through to that branch unchanged.
    },
  },
};
