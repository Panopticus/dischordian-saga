/* ═══════════════════════════════════════════════════════
   TITLE T01 LOREDEX ENTRY — synth entry for the meme video's
   tail-end song (The Enigma's Lament).

   Surfaces the song to PlayerContext during the opening:
     - Pre-rolled muted on the surveillance handshake gesture.
     - Unmuted in the cinematic's last 10 seconds.
     - Plays under the login screen until TitlePage unmounts.
   ═══════════════════════════════════════════════════════ */
import { ALBUM1_T01_SLIDESHOW } from "@shared/songSlideshows";
import type { LoredexEntry } from "@/contexts/LoredexContext";

export const TITLE_T01_LOREDEX_ENTRY: LoredexEntry = {
  id: `album1_${ALBUM1_T01_SLIDESHOW.songId.replace(/^album1_/, "")}`,
  type: "song",
  name: ALBUM1_T01_SLIDESHOW.title,
  audio_url: ALBUM1_T01_SLIDESHOW.audioUrl,
  album: "Dischordian Logic",
};
