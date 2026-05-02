#!/usr/bin/env bash
# Extract every asset URL/path referenced in source code.
# Output: docs/production/audit/all-urls.tsv (url \t source_file)
CDN_PUBLIC="https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public"
ROOT="$(cd "$(dirname "$0")"/../../.. && pwd)"
OUT="$ROOT/docs/production/audit/all-urls.tsv"
: > "$OUT"
cd "$ROOT"

# Pattern 1: assetUrl("path") → CDN_PUBLIC + path
grep -REn 'assetUrl\("[^"]+"\)' --include='*.ts' --include='*.tsx' \
  apps/client/src apps/shared apps/scripts 2>/dev/null \
  | grep -v '\.test\.' | grep -v __tests__ \
  | sed -E 's/^([^:]+):[0-9]+:.*assetUrl\("([^"]+)"\).*/\2|\1/' \
  | awk -F'|' -v cdn="$CDN_PUBLIC" '{
      gsub(/^\//, "", $1);
      print cdn "/" $1 "\t" $2
    }' >> "$OUT"

# Pattern 2: literal dgrsart.s3 URLs
grep -REoh 'https://dgrsart\.s3\.us-east-2\.amazonaws\.com/[A-Za-z0-9._/-]+' \
  --include='*.ts' --include='*.tsx' --include='*.json' \
  apps/client/src apps/shared 2>/dev/null \
  | sort -u | awk '{print $0 "\tliteral-dgrsart-url"}' >> "$OUT"

# Pattern 3: legacy CloudFront
grep -REoh 'https://d2xsxph8kpxj0f\.cloudfront\.net/[A-Za-z0-9._/-]+' \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.txt' \
  apps/client/src apps/shared . 2>/dev/null \
  | sort -u | awk '{print $0 "\tlegacy-cloudfront"}' >> "$OUT"

# Pattern 4: voice manifests (per file with annotated source)
for f in apps/shared/*VoManifest.json; do
  [ -f "$f" ] || continue
  grep -oE 'https://[A-Za-z0-9./-]+\.(mp3|wav|ogg|m4a)' "$f" 2>/dev/null \
    | awk -v src="$f" '{print $0 "\t" src}' >> "$OUT"
done

# Pattern 5: room-artwork-urls.txt
if [ -f room-artwork-urls.txt ]; then
  grep -oE 'https://[^[:space:]]+' room-artwork-urls.txt 2>/dev/null \
    | awk '{print $0 "\troom-artwork-urls.txt"}' >> "$OUT"
fi

# Pattern 6: fighter sprite sheets — 17 ids in spriteSheetConfig.ts × 4 sheets each
# (3 fighters use variant naming; emit those alternates so the probe sees real URLs)
src="apps/client/src/game/spriteSheetConfig.ts"
for id in architect collector enigma warlord necromancer iron_lion white_oracle agent_zero meme source akai_shi human degen prisoner wraith_calder warden jailer; do
  case "$id" in
    architect)  sheets="idle_movement basic_attacks reactions_throws portraits" ;;
    collector)  sheets="idle_movement basic_attacks reactions_victory_ko portraits" ;;
    enigma)     sheets="idle_movement basic_attacks specials_reactions_victory portraits" ;;
    *)          sheets="idle_movement attacks_specials reactions_victory portraits" ;;
  esac
  for s in $sheets; do
    echo "$CDN_PUBLIC/art/fighters/$id/${id}_${s}.png	$src" >> "$OUT"
  done
done

# Pattern 6b: fighter sprite sheets — 5 NEW additions (programmer, shadow_tongue,
# game_master, watcher, authority — confirmed playable per 2026-05-02 user direction).
# These are NOT in spriteSheetConfig.ts yet; emit the expected URLs so the probe can
# confirm whether the producer has uploaded them ahead of the engine config.
src="planned-fighters-2026-05-02"
for id in programmer shadow_tongue game_master watcher authority; do
  for s in idle_movement attacks_specials reactions_victory portraits; do
    echo "$CDN_PUBLIC/art/fighters/$id/${id}_${s}.png	$src" >> "$OUT"
  done
done

# Pattern 7: cinematic motion videos — extracted from
# docs/production/acts-2-7-aaa-final/ASSET_MANIFEST.md and remaining_work.md
# IDs (videos/acts/act-{N}/cin_act{N}_{slug}.mp4)
# Act folder format: "act-2", "act-3", "act-4", "act-4_5", "act-5", "act-6", "act-7"
src="acts-2-7-aaa-final"
for cin in \
  cin_act2_opener cin_act2_silence cin_act2_gamemaster_left cin_act2_gamemaster_right cin_act2_engineer_recording_2 cin_act2_engineer_recording_3 \
  cin_act3_opener cin_act3_thaloria_echo cin_act3_eyes_fall cin_act3_infiltration_insurgency cin_act3_infiltration_empire cin_act3_infiltration_hierarchy cin_act3_engineer_rec4 cin_act3_engineer_rec5 \
  cin_act4_opener cin_act4_path_willing cin_act4_path_discovery cin_act4_path_betrayal cin_act4_memorial_corridor cin_act4_kael_extraction_1 cin_act4_kael_extraction_2 cin_act4_kael_extraction_3 cin_act4_kael_extraction_4 \
  cin_act4_5_opener cin_act4_5_identity_wager \
  cin_act5_opener cin_act5_bulb_dims cin_act5_sector_wakes cin_act5_iron_lion_final cin_act5_bridge_of_kael cin_act5_engineer_recording_7 \
  cin_act6_opener cin_act6_elara_confession cin_act6_human_confession cin_act6_watcher_reveal \
  cin_act7_opener cin_act7_two_wars_diagram cin_act7_voices_align cin_act7_stance_humanity cin_act7_stance_pattern cin_act7_stance_bridge cin_act7_stance_command; do
  # Extract numeric suffix; act4_5 → 4_5, act5 → 5
  num=$(echo "$cin" | sed -E 's/^cin_act([0-9_]+)_.*/\1/')
  echo "$CDN_PUBLIC/videos/acts/act-${num}/${cin}.mp4	$src" >> "$OUT"
done

# Pattern 8: cinematic START/END key frames (per ASSET_MANIFEST naming)
# Layout: cinematics/act-{N}/start/{cin_id}_start.png + cinematics/act-{N}/end/...
for cin in \
  cin_act2_opener cin_act2_silence cin_act2_gamemaster_left cin_act2_gamemaster_right cin_act2_engineer_recording_2 cin_act2_engineer_recording_3 \
  cin_act3_opener cin_act3_thaloria_echo cin_act3_eyes_fall cin_act3_infiltration_shared cin_act3_engineer_rec4 cin_act3_engineer_rec5 \
  cin_act4_opener cin_act4_path_willing cin_act4_path_discovery cin_act4_path_betrayal cin_act4_memorial_corridor cin_act4_kael_extraction_1 cin_act4_kael_extraction_2 cin_act4_kael_extraction_3 cin_act4_kael_extraction_4 \
  cin_act4_5_opener cin_act4_5_identity_wager \
  cin_act5_opener cin_act5_bulb_dims cin_act5_sector_wakes cin_act5_iron_lion_final cin_act5_bridge_of_kael cin_act5_engineer_recording_7 \
  cin_act6_opener cin_act6_elara_confession cin_act6_human_confession cin_act6_watcher_reveal \
  cin_act7_opener cin_act7_two_wars_diagram cin_act7_voices_align cin_act7_stance_humanity cin_act7_stance_pattern cin_act7_stance_bridge cin_act7_stance_command; do
  num=$(echo "$cin" | sed -E 's/^cin_act([0-9_]+)_.*/\1/')
  for half in start end; do
    echo "$CDN_PUBLIC/cinematics/act-${num}/${half}/${cin}_${half}.png	acts-2-7-aaa-final" >> "$OUT"
  done
done

# Pattern 9: VFX atlases per ASSET_MANIFEST (vfx-atlases/act-{N}/...)
for atlas in \
  "act-2/substrate_layer" "act-2/bench_glow_light" "act-2/bench_glow_dark" "act-2/chess_depth_ring" "act-2/silence_freeze_grain" \
  "act-3/thaloria_echo_mist" "act-3/infiltration_choice_beam" "act-3/eyes_helmet_dust" \
  "act-4/kael_memory_palace" "act-4/caravaggio_light_cone" "act-4/prison_mirror_reflection" \
  "act-4_5/identity_chip_etching" "act-4_5/entropy_table_glow" \
  "act-5/iron_lion_broadcast_static" "act-5/vortex_consumption_edge" "act-5/kael_map_ink" \
  "act-6/elara_face_resolve_grain" "act-6/watcher_shape_stencil" \
  "act-7/army_composite_parallax" "act-7/voices_align_chord_ring" "act-7/invisible_war_overlay"; do
  echo "$CDN_PUBLIC/vfx-atlases/${atlas}.png	acts-2-7-aaa-final" >> "$OUT"
done

# Pattern 10: Acts 2-7 music cues per ASSET_MANIFEST (audio/acts/act-{N}/mus_*.mp3)
# Approximation: opener + 1-2 stingers per act. The full 40 are listed in the bible §X.7 sections.
for cue in \
  mus_act2_opener mus_act2_silence mus_act2_gamemaster mus_act2_engineer_recording_2 mus_act2_engineer_recording_3 \
  mus_act3_opener mus_act3_thaloria_echo mus_act3_eyes_fall mus_act3_infiltration mus_act3_engineer_rec4 mus_act3_engineer_rec5 \
  mus_act4_opener mus_act4_path_willing mus_act4_path_discovery mus_act4_path_betrayal mus_act4_memorial_corridor \
  mus_act4_kael_extraction \
  mus_act4_5_opener mus_act4_5_identity_wager \
  mus_act5_opener mus_act5_iron_lion_final mus_act5_bridge_of_kael mus_act5_engineer_recording_7 \
  mus_act6_opener mus_act6_elara_confession mus_act6_human_confession mus_act6_watcher_reveal \
  mus_act7_opener mus_act7_two_wars_diagram mus_act7_voices_align mus_act7_stance_humanity mus_act7_stance_pattern mus_act7_stance_bridge mus_act7_stance_command; do
  act=$(echo "$cue" | sed -E 's/mus_(act[0-9_]+)_.*/\1/' | tr '_' '-')
  echo "$CDN_PUBLIC/audio/acts/${act}/${cue}.mp3	acts-2-7-aaa-final" >> "$OUT"
done

# Pattern 11: loredex entry images — extract from loredex-data.json `image` field
if [ -f apps/client/src/data/loredex-data.json ]; then
  grep -oE '"image":\s*"https://[^"]+"' apps/client/src/data/loredex-data.json 2>/dev/null \
    | sed -E 's/"image":\s*"([^"]+)"/\1/' \
    | awk '{print $0 "\tapps/client/src/data/loredex-data.json"}' >> "$OUT"
fi

# Pattern 12: season1 + expansion card images — extract `imageUrl` field from any *cards*.json
for f in apps/client/src/data/season1-cards.json apps/client/src/data/*-cards.json apps/shared/expansionArt/*-cards.json; do
  [ -f "$f" ] || continue
  grep -oE '"imageUrl":\s*"https://[^"]+"' "$f" 2>/dev/null \
    | sed -E 's/"imageUrl":\s*"([^"]+)"/\1/' \
    | awk -v src="$f" '{print $0 "\t" src}' >> "$OUT"
done

# Pattern 13: album audio manifests — extract audioUrl from any *AlbumAudio.json
for f in apps/shared/*AlbumAudio.json; do
  [ -f "$f" ] || continue
  grep -oE '"(audioUrl|src|url)":\s*"https://[^"]+"' "$f" 2>/dev/null \
    | sed -E 's/.*"(https://[^"]+)".*/\1/' \
    | awk -v src="$f" '{print $0 "\t" src}' >> "$OUT"
done

echo "raw lines: $(wc -l < "$OUT")"
echo "unique URLs: $(awk -F'\t' '{print $1}' "$OUT" | sort -u | wc -l)"
