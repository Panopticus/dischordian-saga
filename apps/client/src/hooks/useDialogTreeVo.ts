/* useDialogTreeVo — per-NPC VO playback for NpcDialogTreeRunner.
 *
 * Thin wrapper around the existing useNpcVO factory that selects the
 * right `<npcKey>VoManifest.json` based on a runtime NpcKey value.
 * The factory handles the shared playback plumbing (claim/release
 * the global VO rail, lipsync hooks, mid-load queueing); this
 * wrapper picks the manifest.
 *
 * Missing manifest entries are silent no-ops — when an NPC's MP3s
 * haven't been generated yet, the dialog still walks; only the
 * audio is absent. This makes the hook safe to drop into any
 * surface without worrying about VO completion state.
 */
import { useNpcVO, type NpcVoApi } from "./useNpcVO";
import type { NpcKey } from "@shared/npcs/types";

/** NpcKey → manifest module path. Mirrors the canonical mapping in
 *  apps/scripts/generate-npc-first-meet-vo.ts so the runtime stays
 *  in sync with the generator's S3 + manifest layout. NPCs without
 *  a mapping resolve to an empty manifest (no audio plays). */
// Only NPCs with a shipped <key>VoManifest.json appear here. The
// rest fall through to EMPTY_LOADER below — the runner walks the
// dialog silently for those until their manifests ship.
const MANIFEST_LOADERS: Partial<
  Record<NpcKey, () => Promise<Record<string, string>>>
> = {
  the_degen: async () =>
    (await import("@shared/degenVoManifest.json")).default ?? {},
  vex_solene: async () =>
    (await import("@shared/vexVoManifest.json")).default ?? {},
  the_game_master: async () =>
    (await import("@shared/gamemasterVoManifest.json")).default ?? {},
  the_meme: async () =>
    (await import("@shared/memeVoManifest.json")).default ?? {},
  the_seer: async () =>
    (await import("@shared/seerVoManifest.json")).default ?? {},
  adjudicator_locke: async () =>
    (await import("@shared/lockeVoManifest.json")).default ?? {},
};

const EMPTY_LOADER = async (): Promise<Record<string, string>> => ({});

export function useDialogTreeVo(npcKey: NpcKey): NpcVoApi {
  const loader = MANIFEST_LOADERS[npcKey] ?? EMPTY_LOADER;
  return useNpcVO(`dialogTree:${npcKey}`, loader);
}
