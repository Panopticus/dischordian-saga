# Handoff: voice The Witness Table, Ep. 1 with ElevenLabs

**Context.** *The Witness Table* is a two-host Dischordia lore podcast for @thedischordia. Ko (Aiko Bennett) is the archivist with the receipts; Jun (Kang Min-jun) is the former K-pop trainee and theorist. The series bible, with the host profiles, season plan and full Ep. 1 script, is at `docs/production/witness-table/WITNESS_TABLE_SERIES_BIBLE.md`.

A first cut of the video was rendered in a cloud session with offline TTS. The voices were flat, so this pass re-voices the episode with ElevenLabs Text to Dialogue (Eleven v3), using inline audio tags for performance. The cloud session couldn't reach ElevenLabs, which is why this runs on Daniel's machine.

## Task
1. Get the API key from the repo's usual environment (`ELEVENLABS_API_KEY`, or `ELEVENLABS_KEY`; check `.env`). Never print it or commit it.
2. Voices: ask Daniel whether he has existing Ko and Jun voice IDs. If he doesn't, create them with ElevenLabs Voice Design using the two descriptions in `README.md`, and play him the previews before running the full episode.
3. Run a test on chunk 01 only:
   `python3 run_elevenlabs.py --ko KO_ID --jun JUN_ID --only 01 --out out`
   Have Daniel listen. Adjust `--stability` if he asks: 0.0 is more dramatic, 1.0 is steadier.
4. Run the full episode (18 chunks, about 23,000 characters):
   `python3 run_elevenlabs.py --ko KO_ID --jun JUN_ID --out out`
5. Check that `out/` has `chunk_01`–`chunk_18` `.mp3` + `.json` files, and that every `.json` has a non-empty `voice_segments` list.
6. Zip `out/` as `witness_table_ep01_elevenlabs_out.zip`, and tell Daniel to send it back to the Claude chat that is rebuilding the video. That chat re-times captions, music and visuals to the new audio.

## Don't
- Commit the generated audio, or the `out/` folder, to git.
- Edit `witness_table_ep01_dialogue.json` without asking. The tags were chosen line by line, and the captions depend on the line order.
- Change the Talarico or Facebook lines. They were written to stay factual and even-handed during an election week.
