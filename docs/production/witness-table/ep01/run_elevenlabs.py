#!/usr/bin/env python3
"""
The Witness Table, Ep. 1: generate the full performance with ElevenLabs Text to Dialogue.

Usage (Python 3.8+, no extra packages needed):
    export ELEVENLABS_API_KEY=your_key        # Windows PowerShell: $env:ELEVENLABS_API_KEY="your_key"
    python3 run_elevenlabs.py --ko KO_VOICE_ID --jun JUN_VOICE_ID

Useful options:
    --only 03,07        regenerate just those chunks (e.g. after you dislike a take)
    --takes 3           make 3 takes of each chunk (chunk_03_take1.mp3, _take2, ...) to pick from
    --stability 0.0     more expressive (0.0 Creative / 0.5 Natural / 1.0 Robust)
    --model eleven_v3   model id (eleven_v3 is the documented default)

Output goes to ./out/ : chunk_XX.mp3 plus chunk_XX.json (timing for every line).
Send the whole ./out folder back and the video gets rebuilt around the new performance.
"""
import argparse, base64, json, os, sys, time, urllib.request, urllib.error, getpass

API = "https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128"

def call(key, body, tries=5):
    data = json.dumps(body).encode()
    for attempt in range(tries):
        req = urllib.request.Request(API, data=data, method="POST",
              headers={"xi-api-key": key, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.loads(r.read()), r.headers.get("request-id")
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:500]
            if e.code in (429, 500, 502, 503, 504) and attempt < tries - 1:
                wait = 10 * (attempt + 1)
                print(f"  {e.code}, retrying in {wait}s ...", flush=True); time.sleep(wait); continue
            sys.exit(f"ElevenLabs error {e.code}: {msg}")
        except urllib.error.URLError as e:
            if attempt < tries - 1:
                time.sleep(10); continue
            sys.exit(f"Network error: {e}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ko", required=True, help="voice_id for Ko")
    ap.add_argument("--jun", required=True, help="voice_id for Jun")
    ap.add_argument("--script", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "witness_table_ep01_dialogue.json"))
    ap.add_argument("--out", default="out")
    ap.add_argument("--model", default="eleven_v3")
    ap.add_argument("--stability", type=float, default=0.5)
    ap.add_argument("--takes", type=int, default=1)
    ap.add_argument("--only", default="")
    ap.add_argument("--seed", type=int, default=None)
    a = ap.parse_args()
    key = os.environ.get("ELEVENLABS_API_KEY") or os.environ.get("ELEVENLABS_KEY") or getpass.getpass("ElevenLabs API key: ")
    voices = {"KO": a.ko, "JUN": a.jun}
    script = json.load(open(a.script, encoding="utf-8"))
    os.makedirs(a.out, exist_ok=True)
    only = {x.strip().zfill(2) for x in a.only.split(",") if x.strip()}
    last_req = {}  # section -> previous request id, for continuity within a segment
    chunks = script["chunks"]
    for c in chunks:
        cid = c["id"]
        if only and cid not in only:
            continue
        for take in range(1, a.takes + 1):
            suffix = "" if a.takes == 1 else f"_take{take}"
            mp3 = os.path.join(a.out, f"chunk_{cid}{suffix}.mp3")
            meta = os.path.join(a.out, f"chunk_{cid}{suffix}.json")
            if os.path.exists(mp3) and os.path.exists(meta) and not only:
                print(f"chunk {cid}{suffix}: already done, skipping"); continue
            body = {
                "inputs": [{"text": l["text"], "voice_id": voices[l["speaker"]]} for l in c["lines"]],
                "model_id": a.model,
                "settings": {"stability": a.stability},
            }
            if a.seed is not None:
                body["seed"] = a.seed + take
            prev = last_req.get(c["section"])
            if prev:
                body["previous_request_ids"] = [prev]
            n = sum(len(l["text"]) for l in c["lines"])
            print(f"chunk {cid}{suffix} [{c['section']}] {len(c['lines'])} lines, {n} chars ...", flush=True)
            res, rid = call(key, body)
            with open(mp3 + ".part", "wb") as f:
                f.write(base64.b64decode(res["audio_base64"]))
            os.replace(mp3 + ".part", mp3)
            json.dump({"id": cid, "section": c["section"], "request_id": rid,
                       "voice_segments": res.get("voice_segments"),
                       "lines": [{"speaker": l["speaker"], "caption": l["caption"]} for l in c["lines"]]},
                      open(meta, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            if take == 1 and rid:
                last_req[c["section"]] = rid
    print(f"Done. Send the '{a.out}' folder back.")

if __name__ == "__main__":
    main()
