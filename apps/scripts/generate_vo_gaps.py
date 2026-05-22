#!/usr/bin/env python3
"""
VO GAP-FILL GENERATOR — generates only the spoken lines that haven't
been generated yet.

Three bank types:

  1. SimpleVoiceBank — one lines.json, one voice, one manifest.
     The 80% case (Elara, Wraith, Akai, Lycos, etc.).

  2. MultiCharacterBank — one lines.json where each entry carries a
     `character` (or speaker) key; fans out to per-character voice
     ids + per-character manifests. (cades-lines.json,
     act1-taunts-lines.json.)

  3. StingBank — short clips with deliberate voice destabilisation
     (Shadow Tongue stings). Same shape as SimpleVoiceBank but uses
     a non-standard manifest filename pattern.

For every bank, the script:
  1. Reads the lines file.
  2. Reads the existing manifest (id → URL map).
  3. Diffs to find missing ids.
  4. Calls ElevenLabs TTS with the per-bank voice id + the line's
     emotion-tuned settings.
  5. Uploads to s3://dgrsvoices/<s3_prefix>/<context>/<id>.mp3
  6. Persists the manifest after EVERY successful line — re-runs
     resume cleanly after rate-limits / crashes.

Run:
  ELEVENLABS_API_KEY=... AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \\
      pnpm vo:gaps
  pnpm vo:gaps --only akai_shi,wraith_calder
  pnpm vo:gaps:dry        # discover gaps; no API calls

Deps: pip install requests boto3
"""

import argparse
import json
import os
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import requests
import boto3

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPTS_DIR = REPO_ROOT / "apps" / "scripts"
SHARED_DIR = REPO_ROOT / "apps" / "shared"

ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
AWS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
AWS_SECRET = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
BUCKET = "dgrsvoices"
REGION = "us-east-2"

# ─── EMOTION → ElevenLabs voice settings ──────────────────
EMOTIONS = {
    # legacy emotion set
    "warm":        {"stability": 0.45, "similarity_boost": 0.78, "style": 0.35},
    "urgent":      {"stability": 0.25, "similarity_boost": 0.72, "style": 0.65},
    "curious":     {"stability": 0.40, "similarity_boost": 0.75, "style": 0.45},
    "fearful":     {"stability": 0.20, "similarity_boost": 0.70, "style": 0.70},
    "analytical":  {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20},
    "sad":         {"stability": 0.30, "similarity_boost": 0.75, "style": 0.55},
    "hopeful":     {"stability": 0.40, "similarity_boost": 0.78, "style": 0.50},
    "betrayed":    {"stability": 0.20, "similarity_boost": 0.72, "style": 0.75},
    "reassuring":  {"stability": 0.50, "similarity_boost": 0.80, "style": 0.30},
    "excited":     {"stability": 0.30, "similarity_boost": 0.75, "style": 0.60},
    "serious":     {"stability": 0.50, "similarity_boost": 0.80, "style": 0.25},
    "whispered":   {"stability": 0.15, "similarity_boost": 0.65, "style": 0.50},  # stings setting
    "commanding":  {"stability": 0.45, "similarity_boost": 0.78, "style": 0.55},
    "first_meeting": {"stability": 0.50, "similarity_boost": 0.78, "style": 0.30},
    # Section D5 trio emotion vocabulary
    "calibrated":  {"stability": 0.60, "similarity_boost": 0.78, "style": 0.18},
    "considered":  {"stability": 0.55, "similarity_boost": 0.78, "style": 0.22},
    "vulnerable":  {"stability": 0.32, "similarity_boost": 0.74, "style": 0.55},
    "grateful":    {"stability": 0.48, "similarity_boost": 0.78, "style": 0.33},
    "tender":      {"stability": 0.40, "similarity_boost": 0.76, "style": 0.45},
    "settled":     {"stability": 0.55, "similarity_boost": 0.78, "style": 0.22},
    "correcting":  {"stability": 0.50, "similarity_boost": 0.76, "style": 0.40},
    "weary":       {"stability": 0.45, "similarity_boost": 0.75, "style": 0.32},
    "wry":         {"stability": 0.50, "similarity_boost": 0.77, "style": 0.42},
    "patient":     {"stability": 0.58, "similarity_boost": 0.78, "style": 0.20},
    "firm":        {"stability": 0.52, "similarity_boost": 0.78, "style": 0.38},
    "cold":        {"stability": 0.55, "similarity_boost": 0.76, "style": 0.28},
    "refused":     {"stability": 0.55, "similarity_boost": 0.76, "style": 0.35},
    "resolved":    {"stability": 0.55, "similarity_boost": 0.78, "style": 0.30},
    "reflective":  {"stability": 0.55, "similarity_boost": 0.78, "style": 0.28},
    "kindred":     {"stability": 0.48, "similarity_boost": 0.78, "style": 0.30},
    "relieved":    {"stability": 0.48, "similarity_boost": 0.78, "style": 0.32},
    "quiet":       {"stability": 0.55, "similarity_boost": 0.76, "style": 0.25},
    "neutral":     {"stability": 0.50, "similarity_boost": 0.78, "style": 0.28},
}


def _is_placeholder(voice_id: str) -> bool:
    return not voice_id or voice_id.startswith("TODO:")


@dataclass
class SimpleVoiceBank:
    """One lines.json, one voice, one manifest."""
    key: str
    lines_filename: str
    manifest_filename: str
    voice_id: str
    s3_prefix: str
    # Override emotion defaults (used by stings).
    emotion_override: Optional[dict] = None

    @property
    def lines_path(self) -> Path:
        return SCRIPTS_DIR / self.lines_filename

    @property
    def manifest_path(self) -> Path:
        return SHARED_DIR / self.manifest_filename

    @property
    def is_ready(self) -> bool:
        return not _is_placeholder(self.voice_id)

    def settings_for(self, emotion: str) -> dict:
        if self.emotion_override:
            return self.emotion_override
        return EMOTIONS.get(emotion, EMOTIONS["neutral"])


@dataclass
class MultiCharacterBank:
    """One lines.json where each entry has a `character` key; fans
    out to per-character voice ids + per-character manifests."""
    key: str
    lines_filename: str
    # character key (read from each line entry) → (voice_id, s3_prefix, manifest_filename)
    voice_map: dict[str, tuple[str, str, str]] = field(default_factory=dict)
    # Optional per-line key to read the character from. Defaults to "character".
    character_field: str = "character"

    @property
    def lines_path(self) -> Path:
        return SCRIPTS_DIR / self.lines_filename

    @property
    def is_ready(self) -> bool:
        return all(not _is_placeholder(vid) for vid, _, _ in self.voice_map.values())


@dataclass
class PerLineVoiceBank:
    """One lines.json where each entry carries its own `voiceId`
    field. Voices are already chosen at authoring time — no per-bank
    casting needed. All entries write to a single manifest + single
    S3 prefix; the per-line voice id is what varies.

    Used for story-mode-lines.json (4 voices baked into the data).
    """
    key: str
    lines_filename: str
    manifest_filename: str
    s3_prefix: str
    voice_field: str = "voiceId"

    @property
    def lines_path(self) -> Path:
        return SCRIPTS_DIR / self.lines_filename

    @property
    def manifest_path(self) -> Path:
        return SHARED_DIR / self.manifest_filename

    @property
    def is_ready(self) -> bool:
        # Per-line bank: ready iff every line has a non-placeholder voiceId.
        if not self.lines_path.exists():
            return False
        lines = load_lines(self.lines_path)
        if not lines:
            return False
        return all(
            ln.get(self.voice_field) and not _is_placeholder(ln[self.voice_field])
            for ln in lines
        )


# ─── CHARACTERS TABLE ─────────────────────────────────────
# Add a row here for every <character>-lines.json + matching
# <character>VoManifest.json you want gap-fill to process.
#
# Placeholder voice ids (prefixed "TODO:") cause the bank to be
# skipped with a documented reason.
SIMPLE_BANKS: list[SimpleVoiceBank] = [
    # ── Core companion voices (existing generators, voice canonised) ──
    SimpleVoiceBank("elara",        "elara-lines.json",        "elaraVoManifest.json",       "xMyNDrPFEtQN8iZtT7l2", "Elara Voices"),
    SimpleVoiceBank("the_human",    "human-lines.json",        "humanVoManifest.json",       "oGbGJdgofRR8z0MxwI8L", "Human Voices"),
    SimpleVoiceBank("antiquarian",  "antiquarian-lines.json",  "antiquarianVoManifest.json", "yAKlvHIsuj4SvnKQ6Mk4", "Antiquarian Voices"),
    SimpleVoiceBank("agent_zero",   "agent_zero-lines.json",   "agent_zeroVoManifest.json",  "F1waTCPWl7KpShIScYQs", "AgentZero Voices"),
    SimpleVoiceBank("degen",        "degen-lines.json",        "degenVoManifest.json",       "r6VqF23i4qBEORazjelf", "Degen Voices"),
    SimpleVoiceBank("locke",        "locke-lines.json",        "lockeVoManifest.json",       "8XiBWqS5ffaH5naIFHPI", "Locke Voices"),
    SimpleVoiceBank("meme",         "meme-lines.json",         "memeVoManifest.json",        "VgFgBh5TnWeBhCBvCJ1E", "Meme Voices"),
    SimpleVoiceBank("necromancer",  "necromancer-lines.json",  "necromancerVoManifest.json", "II5QotwxLcQdwey5xEyd", "Necromancer Voices"),
    SimpleVoiceBank("nilmorg",      "nilmorg-lines.json",      "nilmorgVoManifest.json",     "7fKASPr2SR0NYifziNgu", "Nilmorg Voices"),
    SimpleVoiceBank("seer",         "seer-lines.json",         "seerVoManifest.json",        "BTfBVfMM9XgZG8GG1bJn", "Seer Voices"),
    SimpleVoiceBank("source",       "source-lines.json",       "sourceVoManifest.json",      "hfq5qawrYj4gqFsfoE28", "Source Voices"),
    SimpleVoiceBank("shadow_tongue","shadow_tongue-lines.json","shadow_tongueVoManifest.json","14wGKUgRFDPSwtCQurbB","ShadowTongue Voices"),

    # ── Section D5 trio (fully cast 2026-05-21) ──
    SimpleVoiceBank("wraith_calder","wraith-calder-lines.json","wraithCalderVoManifest.json","Vogq3iKs5PJ3cL39gFhW", "WraithCalder Voices"),
    SimpleVoiceBank("akai_shi",     "akai-shi-lines.json",     "akaiShiVoManifest.json",     "AQYSOeM9rkJY878exSfM", "AkaiShi Voices"),
    SimpleVoiceBank("lycos",        "lycos-lines.json",        "lycosVoManifest.json",       "rfHVfqlu6LXw4vLf7q4i", "Lycos Voices"),

    # ── Additional single-voice banks (voices canonised in existing per-character generators) ──
    SimpleVoiceBank("engineer_memoir", "engineer-memoir-lines.json", "engineerMemoirVoManifest.json", "FLW8imgp50K85LICuLQs", "Engineer Voices"),
    SimpleVoiceBank("palimpsest_host", "palimpsest-host-lines.json", "palimpsestHostVoManifest.json", "VgFgBh5TnWeBhCBvCJ1E", "Palimpsest Host"),

    # ── Banks pending voice casting (uncomment / fill the voice id and re-run) ──
    SimpleVoiceBank("engineer",        "engineer-lines.json",        "engineerVoManifest.json",        "FLW8imgp50K85LICuLQs",      "Engineer Voices"),
    SimpleVoiceBank("chess_climb",     "chess-climb-lines.json",     "chessClimbVoManifest.json",      "TT28j5FWUeiDbRr27c7t",      "ChessClimb Voices"),
    SimpleVoiceBank("guild_cutscene",  "guild-cutscene-vo-lines.json","guildCutsceneVoManifest.json",  "yAKlvHIsuj4SvnKQ6Mk4",      "Guild Cutscene Voices"),
    SimpleVoiceBank("loredex_mention", "loredex-mention-lines.json", "loredexMentionVoManifest.json",  "yAKlvHIsuj4SvnKQ6Mk4",      "Loredex Mention"),
    SimpleVoiceBank("loredex_narrator","loredex-narrator-lines.json","loredexVoManifest.json",         "yAKlvHIsuj4SvnKQ6Mk4",      "Loredex Voices"),
    # story_mode lives in PER_LINE_BANKS below (each entry carries its own voiceId).

    # ── Per-NPC line banks (apps/scripts/npc-<key>-lines.json) ──
    # Most overlap with companion voices that already exist (the_seer,
    # the_degen, the_game_master, the_source, the_antiquarian, the_necromancer).
    # If you want to reuse the existing companion voice for the NPC bank,
    # replace the TODO with the existing voice id from above and the bank
    # generates automatically.
    SimpleVoiceBank("npc_drael_mon",         "npc-drael_mon-lines.json",         "draelmonVoManifest.json",          "ts3xd1UbeTpZBMUn3Rjv",       "DraelMon Voices"),
    SimpleVoiceBank("npc_engineer_zero",     "npc-engineer_zero-lines.json",     "engineerZeroNpcVoManifest.json",   "F1waTCPWl7KpShIScYQs",       "EngineerZero Voices"),
    SimpleVoiceBank("npc_iron_lion_prefall", "npc-iron_lion_prefall-lines.json", "ironLionPrefallVoManifest.json",   "UFc00HkV4yTNA1eMW99e",       "IronLionPrefall Voices"),
    SimpleVoiceBank("npc_the_antiquarian",   "npc-the_antiquarian-lines.json",   "antiquarianNpcVoManifest.json",    "yAKlvHIsuj4SvnKQ6Mk4",       "AntiquarianNpc Voices"),
    SimpleVoiceBank("npc_the_architect",     "npc-the_architect-lines.json",     "architectVoManifest.json",         "PmtzUaeg5rMejCZzRqOZ",       "Architect Voices"),
    SimpleVoiceBank("npc_the_degen",         "npc-the_degen-lines.json",         "degenNpcVoManifest.json",          "r6VqF23i4qBEORazjelf",       "DegenNpc Voices"),
    SimpleVoiceBank("npc_the_dreamer",       "npc-the_dreamer-lines.json",       "dreamerVoManifest.json",           "vmBbkUZnePLkXbDidbQa",       "Dreamer Voices"),
    SimpleVoiceBank("npc_the_game_master",   "npc-the_game_master-lines.json",   "gamemasterVoManifest.json",        "TT28j5FWUeiDbRr27c7t",       "GameMaster Voices"),
    SimpleVoiceBank("npc_the_necromancer",   "npc-the_necromancer-lines.json",   "necromancerNpcVoManifest.json",    "II5QotwxLcQdwey5xEyd",       "NecromancerNpc Voices"),
    SimpleVoiceBank("npc_the_resurrectionist","npc-the_resurrectionist-lines.json","resurrectionistVoManifest.json", "MloihDuG0rz5KwxdPiSP",       "Resurrectionist Voices"),
    SimpleVoiceBank("npc_the_seer",          "npc-the_seer-lines.json",          "seerNpcVoManifest.json",           "BTfBVfMM9XgZG8GG1bJn",       "SeerNpc Voices"),
    SimpleVoiceBank("npc_the_source",        "npc-the_source-lines.json",        "sourceNpcVoManifest.json",         "hfq5qawrYj4gqFsfoE28",       "SourceNpc Voices"),
]

# ── Apprentice archetype banks (12 archetypes × 2 genders = 24 banks).
#    Each (archetype, gender) pair gets its own voice cast.
#    Add a row to APPRENTICE_VOICE_MAP below to canonise; absent rows
#    fall back to a TODO placeholder and skip cleanly. ──
APPRENTICE_ARCHETYPES = [
    "artisan", "ghost", "heretic", "jester", "martyr", "oracle",
    "prodigal", "revenant", "scholar", "sentinel", "wanderer", "zealot",
]
APPRENTICE_VOICE_MAP: dict[str, str] = {
    "apprentice_artisan_female":   "xcaGXUiuDthc4Ct1ierk",
    "apprentice_artisan_male":     "j0BH5nbZqg2yMqlOj0Yy",
    "apprentice_ghost_female":     "5h1zEU9BtNv7ULblG5d5",
    "apprentice_ghost_male":       "VHcmyPq978eI2HDbYrN2",
    "apprentice_heretic_female":   "gzbkOWL1CcQf8QMWedf6",
    "apprentice_heretic_male":     "jg760ye7BuN40jqa3vt8",
    "apprentice_jester_female":    "md03QNdrD3dsATM3P8cv",
    "apprentice_jester_male":      "uG6mRLiyfs3EcbzfGLPW",
    "apprentice_martyr_female":    "bmemLtm5Q1Q2NyCgZTHh",
    "apprentice_martyr_male":      "vFVmFkT4waUKWbDqPeec",
    "apprentice_oracle_female":    "8n6ojRHYPcegteWiN7vL",
    "apprentice_oracle_male":      "kHJZXYhnPDBuGNNtyaqC",
    "apprentice_prodigal_female":  "3AueIPflpGWFVHLmeELs",
    "apprentice_prodigal_male":    "slWPGCoUrCP7iQnED7FU",
    "apprentice_revenant_female":  "nNhqN5ffZExg1ZxAyBzn",
    "apprentice_revenant_male":    "XumMLB8cjaNYPhdBoTTL",
    "apprentice_scholar_female":   "OxO0YlIfndGq04NU8W8Z",
    "apprentice_scholar_male":     "gbZb8tR0qcJCwZs0ucpk",
    "apprentice_sentinel_female":  "HWGPOyrwIzlpSmBi0COP",
    "apprentice_sentinel_male":    "K41xXfuEqvhZvJcidOk2",
    "apprentice_wanderer_female":  "SZE7kLr0elYLWlKkfpmW",
    "apprentice_wanderer_male":    "KZIgaMgM6cETHXbkJJ96",
    "apprentice_zealot_female":    "n7HG8UDLfSQiaVofv2U7",
    "apprentice_zealot_male":      "FXBXSivN5dZPw07XsO17",
    # All 24 (archetype, gender) pairs are now cast — apprentice
    # roster fully covered.
}
for arch in APPRENTICE_ARCHETYPES:
    for gender in ("female", "male"):
        key = f"apprentice_{arch}_{gender}"
        SIMPLE_BANKS.append(SimpleVoiceBank(
            key=key,
            lines_filename=f"apprentice-{arch}-{gender}-lines.json",
            manifest_filename=f"apprentice{arch.capitalize()}{gender.capitalize()}VoManifest.json",
            voice_id=APPRENTICE_VOICE_MAP.get(key, f"TODO:cast_{key}"),
            s3_prefix=f"Apprentice {arch.capitalize()} {gender.capitalize()}",
        ))

# Apprentice pedagogy banks (non-archetype-specific).
# All four currently share a single narrator voice; if any one ever
# diverges, add an override row to PEDAGOGY_VOICE_MAP.
APPRENTICE_PEDAGOGY_NARRATOR = "vFjpEDBMRbSY1JrztN5z"
PEDAGOGY_VOICE_MAP: dict[str, str] = {
    "apprentice_pedagogy_audits":    APPRENTICE_PEDAGOGY_NARRATOR,
    "apprentice_pedagogy_doctrines": APPRENTICE_PEDAGOGY_NARRATOR,
    "apprentice_pedagogy_missions":  APPRENTICE_PEDAGOGY_NARRATOR,
    "apprentice_pedagogy_warden":    APPRENTICE_PEDAGOGY_NARRATOR,
}
for kind in ("audits", "doctrines", "missions", "warden"):
    key = f"apprentice_pedagogy_{kind}"
    SIMPLE_BANKS.append(SimpleVoiceBank(
        key=key,
        lines_filename=f"apprentice-pedagogy-{kind}-lines.json",
        manifest_filename=f"apprenticePedagogy{kind.capitalize()}VoManifest.json",
        voice_id=PEDAGOGY_VOICE_MAP.get(key, f"TODO:cast_{key}"),
        s3_prefix=f"Apprentice Pedagogy {kind.capitalize()}",
    ))

# Act narrative VO banks (act 2-7) are owned by the canonical TS
# pipeline apps/scripts/generate-act-vo.ts (`pnpm vo:act{N}`), which
# does per-line multi-voice fan-out from richer act source data than
# the simple lines.json shape supports. The act{N}-vo-lines.json
# files exist but feed that TS generator, not this one. Intentionally
# not registered here — the manifests are already populated by the
# TS run.


# ── Per-line voice banks (each line entry carries its own voiceId). ──
PER_LINE_BANKS: list[PerLineVoiceBank] = [
    PerLineVoiceBank(
        key="story_mode",
        lines_filename="story-mode-lines.json",
        manifest_filename="storyModeVoManifest.json",
        s3_prefix="Story Mode Voices",
        voice_field="voiceId",
    ),
]


# ── Sting banks (short clips with deliberate destabilisation). ──
# Shadow Tongue stings use a low-stability voice profile so the text
# corrupts the speech model into the canonical "editorial" timbre.
SHADOW_TONGUE_STING_VOICE = os.environ.get(
    "ELEVENLABS_SHADOW_TONGUE_VOICE_ID", "14wGKUgRFDPSwtCQurbB"
)
STING_SETTINGS = {
    "stability": 0.10,
    "similarity_boost": 0.55,
    "style": 0.55,
}
STING_BANKS: list[SimpleVoiceBank] = [
    SimpleVoiceBank(
        key="shadow_tongue_stings",
        lines_filename="shadow-tongue-stings.json",
        manifest_filename="shadowTongueStingManifest.json",
        voice_id=SHADOW_TONGUE_STING_VOICE,
        s3_prefix="Shadow Tongue Stings",
        emotion_override=STING_SETTINGS,
    ),
]


# ── Multi-character banks (one lines.json fanning out to N voices). ──
MULTI_BANKS: list[MultiCharacterBank] = [
    # CADES (cinematic — narrator + iron_lion + thoughtborn + game_masters
    # + elara). Each line has a `character` field; voice id + manifest
    # are looked up by that field. Mirror of generate_cades_vo.py.
    MultiCharacterBank(
        key="cades",
        lines_filename="cades-lines.json",
        voice_map={
            "elara":        ("xMyNDrPFEtQN8iZtT7l2", "CADES Voices/Elara",        "elaraCadesVoManifest.json"),
            "iron_lion":    ("UFc00HkV4yTNA1eMW99e", "CADES Voices/IronLion",     "ironLionCadesVoManifest.json"),
            "thoughtborn":  ("dyc1L3GAWDC51vAN1Co9", "CADES Voices/Thoughtborn",  "thoughtbornCadesVoManifest.json"),
            "game_masters": ("BCJrrrZvds7k3qzM9nXU", "CADES Voices/GameMasters",  "gameMastersCadesVoManifest.json"),
            "narrator":     ("VgFgBh5TnWeBhCBvCJ1E", "CADES Voices/Narrator",     "narratorCadesVoManifest.json"),
        },
        character_field="character",
    ),
    # Act 1 opponent taunts (collector, watcher, eidola, matrikala,
    # authority, programmer, warlord). Mirror of
    # generate_act1_taunts_vo.py.
    MultiCharacterBank(
        key="act1_taunts",
        lines_filename="act1-taunts-lines.json",
        voice_map={
            "collector":  ("RIxivqUM0unaDjCxkHyr", "Collector Voices",  "collectorVoManifest.json"),
            "watcher":    ("bez1UNea9Mdx4PwE4xkC", "Watcher Voices",    "watcherVoManifest.json"),
            "eidola":     ("gclOFJffti38SCrcsEPl", "Eidola Voices",     "eidolaVoManifest.json"),
            "matrikala":  ("XKH2coLtMnPddLRG7oMW", "Matrikala Voices",  "matrikalaVoManifest.json"),
            "authority":  ("bBHJS7m4eXuHz5YaKP4B", "Authority Voices",  "authorityVoManifest.json"),
            "programmer": ("1q0znKQADwaKdTNWneaW", "Programmer Voices", "programmerVoManifest.json"),
            "warlord":    ("F1waTCPWl7KpShIScYQs", "Warlord Voices",    "warlordVoManifest.json"),
        },
        character_field="character",
    ),
]


# ── ElevenLabs / S3 plumbing ─────────────────────────────

def generate_speech(text: str, voice_id: str, settings: dict) -> bytes:
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": settings["stability"],
                "similarity_boost": settings["similarity_boost"],
                "style": settings["style"],
                "use_speaker_boost": True,
            },
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.content


def upload_to_s3(data: bytes, s3_prefix: str, key: str) -> str:
    s3 = boto3.client(
        "s3", region_name=REGION,
        aws_access_key_id=AWS_KEY_ID,
        aws_secret_access_key=AWS_SECRET,
    )
    full_key = f"{s3_prefix}/{key}"
    s3.put_object(
        Bucket=BUCKET, Key=full_key, Body=data,
        ContentType="audio/mpeg",
        CacheControl="public, max-age=31536000",
    )
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{full_key.replace(' ', '+')}"


def load_lines(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return json.load(f)


def load_manifest(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    try:
        with path.open() as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def save_manifest(path: Path, manifest: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
        f.write("\n")


def have_creds() -> bool:
    return bool(ELEVENLABS_KEY and AWS_KEY_ID and AWS_SECRET)


# ── Bank processors ──────────────────────────────────────

def process_simple(bank: SimpleVoiceBank, dry_run: bool) -> dict:
    lines = load_lines(bank.lines_path)
    manifest = load_manifest(bank.manifest_path)
    gap = [ln for ln in lines if ln["id"] not in manifest]
    summary = {
        "key": bank.key, "type": "simple",
        "total_lines": len(lines),
        "already_generated": len(manifest),
        "gap": len(gap), "generated_this_run": 0, "errors": [],
    }
    if not bank.lines_path.exists():
        summary["skipped_reason"] = f"lines file missing: {bank.lines_filename}"
        return summary
    if not bank.is_ready:
        summary["skipped_reason"] = f"voice id placeholder ({bank.voice_id}); assign a real ElevenLabs voice id."
        return summary
    if not gap:
        summary["skipped_reason"] = "nothing to generate — manifest already covers every line"
        return summary
    if dry_run:
        summary["skipped_reason"] = f"dry-run; would generate {len(gap)} lines"
        return summary
    if not have_creds():
        summary["skipped_reason"] = "missing ELEVENLABS_API_KEY / AWS_* env vars"
        return summary

    print(f"\n=== {bank.key} (simple) ===")
    print(f"    lines: {len(lines)}  have: {len(manifest)}  gap: {len(gap)}")
    print(f"    voice: {bank.voice_id}  s3: {BUCKET}/{bank.s3_prefix}/")
    for i, line in enumerate(gap, start=1):
        emotion = line.get("emotion", "neutral")
        context = line.get("context", "misc")
        s3_key = f"{context}/{line['id']}.mp3"
        sys.stdout.write(f"  [{i}/{len(gap)}] {line['id']} ({emotion})... ")
        sys.stdout.flush()
        try:
            settings = bank.settings_for(emotion)
            audio = generate_speech(line["text"], bank.voice_id, settings)
            url = upload_to_s3(audio, bank.s3_prefix, s3_key)
            manifest[line["id"]] = url
            save_manifest(bank.manifest_path, manifest)
            summary["generated_this_run"] += 1
            print(f"✓ {len(audio) // 1024}KB")
            time.sleep(0.15)
        except requests.HTTPError as exc:
            status = exc.response.status_code if exc.response is not None else "?"
            print(f"✗ HTTP {status}")
            summary["errors"].append({"id": line["id"], "error": f"HTTP {status}: {exc}"})
            if str(status) == "429":
                print("    rate-limited — sleeping 30s"); time.sleep(30)
        except Exception as exc:
            print(f"✗ {exc}")
            summary["errors"].append({"id": line["id"], "error": str(exc)})
    return summary


def process_per_line(bank: PerLineVoiceBank, dry_run: bool) -> dict:
    """Each line carries its own voiceId. No per-bank casting needed."""
    lines = load_lines(bank.lines_path)
    manifest = load_manifest(bank.manifest_path)
    gap = [ln for ln in lines if ln["id"] not in manifest]
    summary = {
        "key": bank.key, "type": "per_line",
        "total_lines": len(lines),
        "already_generated": len(manifest),
        "gap": len(gap), "generated_this_run": 0, "errors": [],
    }
    if not bank.lines_path.exists():
        summary["skipped_reason"] = f"lines file missing: {bank.lines_filename}"
        return summary
    # Per-line readiness: every line must have a non-placeholder voiceId.
    bad = [ln for ln in lines if not ln.get(bank.voice_field) or _is_placeholder(ln[bank.voice_field])]
    if bad:
        summary["skipped_reason"] = (
            f"{len(bad)}/{len(lines)} line(s) missing or placeholder voiceId field"
        )
        return summary
    if not gap:
        summary["skipped_reason"] = "nothing to generate — manifest already covers every line"
        return summary
    if dry_run:
        summary["skipped_reason"] = f"dry-run; would generate {len(gap)} lines"
        return summary
    if not have_creds():
        summary["skipped_reason"] = "missing ELEVENLABS_API_KEY / AWS_* env vars"
        return summary

    print(f"\n=== {bank.key} (per-line voice) ===")
    print(f"    lines: {len(lines)}  have: {len(manifest)}  gap: {len(gap)}")
    print(f"    s3: {BUCKET}/{bank.s3_prefix}/  (voiceId per line)")
    for i, line in enumerate(gap, start=1):
        emotion = line.get("emotion", "neutral")
        context = line.get("context", "misc")
        voice_id = line[bank.voice_field]
        s3_key = f"{context}/{line['id']}.mp3"
        sys.stdout.write(f"  [{i}/{len(gap)}] {line['id']} ({emotion}, voice={voice_id})... ")
        sys.stdout.flush()
        try:
            settings = EMOTIONS.get(emotion, EMOTIONS["neutral"])
            audio = generate_speech(line["text"], voice_id, settings)
            url = upload_to_s3(audio, bank.s3_prefix, s3_key)
            manifest[line["id"]] = url
            save_manifest(bank.manifest_path, manifest)
            summary["generated_this_run"] += 1
            print(f"✓ {len(audio) // 1024}KB")
            time.sleep(0.15)
        except requests.HTTPError as exc:
            status = exc.response.status_code if exc.response is not None else "?"
            print(f"✗ HTTP {status}")
            summary["errors"].append({"id": line["id"], "error": f"HTTP {status}: {exc}"})
            if str(status) == "429":
                print("    rate-limited — sleeping 30s"); time.sleep(30)
        except Exception as exc:
            print(f"✗ {exc}")
            summary["errors"].append({"id": line["id"], "error": str(exc)})
    return summary


def process_multi(bank: MultiCharacterBank, dry_run: bool) -> dict:
    lines = load_lines(bank.lines_path)
    summary = {
        "key": bank.key, "type": "multi",
        "total_lines": len(lines),
        "already_generated": 0, "gap": 0,
        "generated_this_run": 0, "errors": [],
        "per_character": {},
    }
    if not bank.lines_path.exists():
        summary["skipped_reason"] = f"lines file missing: {bank.lines_filename}"
        return summary
    if not bank.is_ready:
        missing = [c for c, (vid, _, _) in bank.voice_map.items() if _is_placeholder(vid)]
        summary["skipped_reason"] = f"voice id placeholder for: {', '.join(missing)}"
        return summary

    # Group lines by character; diff each against its manifest.
    by_char: dict[str, list] = {}
    for ln in lines:
        ch = ln.get(bank.character_field)
        if ch is None:
            summary["errors"].append({"id": ln.get("id", "?"), "error": f"line missing {bank.character_field} field"})
            continue
        by_char.setdefault(ch, []).append(ln)

    manifests: dict[str, dict[str, str]] = {}
    gaps: dict[str, list] = {}
    for ch, ch_lines in by_char.items():
        if ch not in bank.voice_map:
            summary["errors"].append({"id": "schema", "error": f"unknown character '{ch}' in {bank.lines_filename}"})
            continue
        _, _, manifest_file = bank.voice_map[ch]
        manifests[ch] = load_manifest(SHARED_DIR / manifest_file)
        gaps[ch] = [ln for ln in ch_lines if ln["id"] not in manifests[ch]]
        summary["per_character"][ch] = {
            "lines": len(ch_lines),
            "have": len(manifests[ch]),
            "gap": len(gaps[ch]),
        }
        summary["already_generated"] += len(manifests[ch])
        summary["gap"] += len(gaps[ch])

    if summary["gap"] == 0:
        summary["skipped_reason"] = "nothing to generate — every character's manifest is full"
        return summary
    if dry_run:
        summary["skipped_reason"] = f"dry-run; would generate {summary['gap']} lines across {len(gaps)} characters"
        return summary
    if not have_creds():
        summary["skipped_reason"] = "missing ELEVENLABS_API_KEY / AWS_* env vars"
        return summary

    print(f"\n=== {bank.key} (multi-character) ===")
    for ch, ch_gap in gaps.items():
        if not ch_gap:
            continue
        voice_id, s3_prefix, manifest_file = bank.voice_map[ch]
        manifest_path = SHARED_DIR / manifest_file
        manifest = manifests[ch]
        print(f"  ── {ch}: gap={len(ch_gap)}  voice={voice_id}")
        for i, line in enumerate(ch_gap, start=1):
            emotion = line.get("emotion", "neutral")
            context = line.get("context", "misc")
            s3_key = f"{context}/{line['id']}.mp3"
            sys.stdout.write(f"    [{i}/{len(ch_gap)}] {line['id']} ({emotion})... ")
            sys.stdout.flush()
            try:
                settings = EMOTIONS.get(emotion, EMOTIONS["neutral"])
                audio = generate_speech(line["text"], voice_id, settings)
                url = upload_to_s3(audio, s3_prefix, s3_key)
                manifest[line["id"]] = url
                save_manifest(manifest_path, manifest)
                summary["generated_this_run"] += 1
                print(f"✓ {len(audio) // 1024}KB")
                time.sleep(0.15)
            except requests.HTTPError as exc:
                status = exc.response.status_code if exc.response is not None else "?"
                print(f"✗ HTTP {status}")
                summary["errors"].append({"id": line["id"], "error": f"HTTP {status}: {exc}"})
                if str(status) == "429":
                    print("      rate-limited — sleeping 30s"); time.sleep(30)
            except Exception as exc:
                print(f"✗ {exc}")
                summary["errors"].append({"id": line["id"], "error": str(exc)})
    return summary


# ── CLI ──────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--only", type=str, default="", help="Comma-separated bank keys to process")
    parser.add_argument("--dry-run", action="store_true", help="Count gaps without API calls")
    parser.add_argument("--show-todos", action="store_true", help="Include TODO-placeholder banks in summary")
    args = parser.parse_args()

    selected = set(s.strip() for s in args.only.split(",") if s.strip())
    all_banks: list[tuple[str, object]] = (
        [("simple",   b) for b in SIMPLE_BANKS]   +
        [("sting",    b) for b in STING_BANKS]    +
        [("per_line", b) for b in PER_LINE_BANKS] +
        [("multi",    b) for b in MULTI_BANKS]
    )
    if selected:
        all_banks = [(t, b) for (t, b) in all_banks if b.key in selected]

    print("════════════════════════════════════════════════════════")
    print(f"  VO GAP-FILL GENERATOR")
    print(f"  banks: {len(all_banks)}  dry_run={args.dry_run}")
    print("════════════════════════════════════════════════════════")

    summaries: list[dict] = []
    for kind, bank in all_banks:
        if kind in ("simple", "sting"):
            summaries.append(process_simple(bank, args.dry_run))
        elif kind == "per_line":
            summaries.append(process_per_line(bank, args.dry_run))
        else:
            summaries.append(process_multi(bank, args.dry_run))

    print("\n══ SUMMARY ══")
    print(f"{'bank':<32} {'total':>6} {'have':>6} {'gap':>6} {'gen':>6}  status")
    for s in summaries:
        is_todo_skip = s.get("skipped_reason", "").startswith("voice id placeholder")
        if is_todo_skip and not args.show_todos and not selected:
            continue  # hide TODO banks in the default view
        status = s.get("skipped_reason") or (
            f"OK  ({len(s['errors'])} error(s))" if s["errors"] else "OK"
        )
        print(
            f"{s['key']:<32} {s['total_lines']:>6} {s['already_generated']:>6} "
            f"{s['gap']:>6} {s['generated_this_run']:>6}  {status}"
        )

    pending_voices = [s for s in summaries if (s.get("skipped_reason") or "").startswith("voice id placeholder")]
    if pending_voices and not args.show_todos and not selected:
        print(f"\n({len(pending_voices)} bank(s) pending voice casting — re-run with --show-todos to list)")

    all_errors = [
        {"bank": s["key"], **e} for s in summaries for e in s["errors"]
    ]
    if all_errors:
        err_path = SCRIPTS_DIR / "vo-gap-errors.json"
        with err_path.open("w") as f:
            json.dump(all_errors, f, indent=2)
        print(f"\nerror log: {err_path}  ({len(all_errors)} entries)")

    return 1 if all_errors else 0


if __name__ == "__main__":
    sys.exit(main())
