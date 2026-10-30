# The Witness Table, Ep. 1: ElevenLabs voice kit

This kit re-voices the whole episode with ElevenLabs Text to Dialogue (Eleven v3), so Ko and Jun sound like two people in a room, not two separate readings.

## 1. Make the two voices (Voice Design, about 10 minutes)
In ElevenLabs, open **Voices → Add a new voice → Voice Design**, generate a few previews, and save the best one for each host.

**Ko:** "Black American woman in her late twenties. Low alto, dry and unhurried, precise diction, a short low laugh. Warm and wry; gets quieter, not louder, when tense. Podcast-close microphone, natural room."

**Jun:** "Korean man in his late twenties, born in Incheon, fluent American English with a light Korean accent. Bright tenor, fast and animated, expressive, big laugh. Former K-pop trainee energy. Goes flat and slow when scared. Podcast-close microphone, natural room."

Copy each saved voice's **Voice ID** (on the voice's menu: Copy voice ID).

## 2. Run it (on your computer)
```
export ELEVENLABS_API_KEY=your_key
python3 run_elevenlabs.py --ko KO_VOICE_ID --jun JUN_VOICE_ID
```
On Windows PowerShell, use `$env:ELEVENLABS_API_KEY="your_key"` and `python run_elevenlabs.py ...`.

- 18 requests, about 23,000 characters in total. Check your plan's credit balance first.
- If a chunk sounds off, re-roll only that chunk: `--only 07` (add `--takes 3` to get three versions to pick from).
- For more dramatic delivery, use `--stability 0.0`. For steadier, more consistent delivery, use `--stability 1.0`.

## 3. Send back the `out` folder
It holds `chunk_XX.mp3` plus `chunk_XX.json`, which carries the per-line timing. The video gets rebuilt around the new performance: captions, pacing, music and visuals all re-timed.

## Files
- `witness_table_ep01_dialogue.json`: the tagged script the runner reads
- `witness_table_ep01_performance_script.md`: the same script, readable, for review or pasting into Studio by hand
- `run_elevenlabs.py`: the runner (standard Python only)
