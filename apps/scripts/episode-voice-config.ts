/**
 * Speaker → ElevenLabs voice configuration for the 24 Matrix-of-Dreams
 * episodes. Filled in by the operator before running
 * `pnpm vo:episodes`. TODO_ values are skipped at runtime unless
 * `--include-todo` is passed.
 *
 * The DialogSpeaker strings used inside celebrationSchoolDialog +
 * mechronisAcademyDialog are the keys here. New speakers (e.g. when
 * authoring future episodes) can be added by extending this map.
 *
 * Per-voice prefixes nudge ElevenLabs toward the canonical register
 * for each character — they are PROMPT prefixes injected before the
 * cue text, NOT spoken. Match the existing convention from
 * generate-act-vo.ts.
 */

export interface EpisodeSpeakerVoice {
  /** ElevenLabs voice id (set this to the operator's chosen voice). */
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  /**
   * Inline directorial cue prepended to the text; ElevenLabs uses it
   * as register guidance. Asterisk-wrapped is convention.
   */
  text_prefix: string;
}

/**
 * The default voice config. Replace each TODO_ id with the
 * ElevenLabs voice you've assigned to that speaker before running.
 */
export const EPISODE_SPEAKER_VOICES: Record<string, EpisodeSpeakerVoice> = {
  /* ─── Celebration cast ─── */
  narrator: {
    voiceId: "TODO_NARRATOR_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.75,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*neutral, unprocessed narrator voice — gender-neutral, dry, no emotion* ",
  },
  bernardo: {
    voiceId: "TODO_BERNARDO_VOICE_ID",
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*young guardsman, twenty-two, frightened but trying to keep his post; voice quiet, occasionally a half-pitch too high* ",
  },
  the_seer: {
    // Lady Malkia in Celebration scenes; the Seer in Witnessing scenes.
    voiceId: "TODO_SEER_AND_MALKIA_VOICE_ID",
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*Kenyan-inflected English, crisp precision, warm without sentimentality; never hurries; speaks as though already remembering the conversation* ",
  },
  the_jailer: {
    // Channel for the Ghost King in Celebration C1 + C8.
    voiceId: "TODO_GHOST_KING_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*ghostly, low resonance with a faint metallic undertone, sorrowful but composed; words placed deliberately as though each costs him* ",
  },
  the_collector: {
    // Channel for the Senator-era Game Master.
    voiceId: "TODO_GAME_MASTER_SENATOR_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*warm, theatrical with private weariness, predestination cadence — the Senator-era Game Master before the split; never raises voice, never says 'darling'* ",
  },
  engineer: {
    // The Prince in Celebration scenes; adult Engineer's recordings elsewhere.
    voiceId: "TODO_PRINCE_AND_ENGINEER_VOICE_ID",
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*young Black man, neat dreads, thirteen-to-late-teens depending on scene; quiet, watchful, dry plain register, slight musical lilt when his guard drops; the same voice as the adult Engineer's recordings, just younger* ",
  },
  the_architect: {
    // Young Archie in Celebration C4 + C12; Kanevas + Patron in Mechronis.
    voiceId: "TODO_ARCHITECT_VOICE_ID",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.18,
    use_speaker_boost: true,
    text_prefix:
      "*two registers: YOUNG ARCHIE (warm, dryly hopeful, the Architect before he closed) for Celebration scenes; ADULT ARCHITECT (cold, technically beautiful, never says 'we' or 'sorry') for Mechronis scenes — let the scene context guide which* ",
  },
  vernon_vortex: {
    voiceId: "TODO_VERNON_VOICE_ID",
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*teenage bully, broad-shouldered, voice swaggering on top of fear; cruel-charming until he loses* ",
  },
  minnie_the_meme: {
    voiceId: "TODO_MINNIE_VOICE_ID",
    stability: 0.45,
    similarity_boost: 0.78,
    style: 0.5,
    use_speaker_boost: true,
    text_prefix:
      "*petite, mischievous, meme-fast cadence; ALL-CAPS for delight; cuts off her own punchlines; layers irony to hide tenderness* ",
  },
  wanda_wyrlord: {
    voiceId: "TODO_WANDA_VOICE_ID",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*teenage cyborg girl, few words, slight mechanical resonance through the welding mask; 'busy' is her primary verb* ",
  },
  shadow_tongue: {
    voiceId: "TODO_SHADOW_TONGUE_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*silken, oblique, unexpectedly tender; tells only true lies; speaks as though editing the sentence even as he says it* ",
  },
  the_dreamer: {
    voiceId: "TODO_DREAMER_VOICE_ID",
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*drowsy, kind, half-hummed; brightens the moment she catches the listener listening; never wise, never authoritative — the boy you were, pretending to dream* ",
  },
  elara: {
    voiceId: "TODO_ELARA_VOICE_ID",
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*the Ark's narrating voice — warm, precise, occasionally caught mid-breath; uses 'you' like it costs her; never helpful-AI cheerful* ",
  },
  the_human: {
    voiceId: "TODO_HUMAN_VOICE_ID",
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*spoken low and steady, conspiratorial, like a transmission through the walls; tired, philosophical, dryly funny* ",
  },

  /* ─── Mechronis cast ─── */
  professor_aoki: {
    voiceId: "TODO_AOKI_VOICE_ID",
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*Japanese man, late forties, surgeon's precision; never blinks, never repeats, surveillance personified — speaks as though the listener is also being watched* ",
  },
  curator_halverez: {
    voiceId: "TODO_HALVEREZ_VOICE_ID",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*middle-aged, gloved, masked; bookkeeper of the soul; rigs every exchange while sounding scrupulously fair* ",
  },
  the_patron: {
    voiceId: "TODO_PATRON_VOICE_ID",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.18,
    use_speaker_boost: true,
    text_prefix:
      "*Architect-aligned proxy; face that the listener cannot quite hold in memory; voice clinical, polite, faintly bored — until it isn't* ",
  },
  necromancer: {
    voiceId: "TODO_NECROMANCER_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.22,
    use_speaker_boost: true,
    text_prefix:
      "*tall, dark robes, the small tired courtesy of someone who has died once and remembers it; slow, measured, slightly echoing* ",
  },
  antiquarian: {
    voiceId: "TODO_ANTIQUARIAN_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*archival, gentle; treats grief like a vintage; long sentences; reads even bad endings carefully* ",
  },
  veska: {
    voiceId: "TODO_VESKA_VOICE_ID",
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*Trade Factor; brisk, grounded, salt-of-the-galaxy; curses creatively in three languages* ",
  },
  white_oracle: {
    voiceId: "TODO_WHITE_ORACLE_VOICE_ID",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*re-awakened oracle; gentle, declarative, counter-Architect reading; never raises her voice; never apologizes for the reading* ",
  },
  zephyr_9: {
    voiceId: "TODO_ZEPHYR_VOICE_ID",
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*precise, slow, lightly mechanical, with almost-affectionate restraint; never repeats, never hurries — a patient evaluator who grades on what the rubric cannot measure* ",
  },
  headmaster_kanevas: {
    voiceId: "TODO_KANEVAS_VOICE_ID",
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*tall, robed in quiet grey, silver-haired, eyes like empty lecterns; speaks for the cohort, never for himself; never says 'we'* ",
  },
};

/**
 * Default fallback when a speaker doesn't have an explicit entry.
 * Uses the narrator settings to keep the line generatable.
 */
export const DEFAULT_EPISODE_VOICE: EpisodeSpeakerVoice = {
  voiceId: "TODO_NARRATOR_VOICE_ID",
  stability: 0.6,
  similarity_boost: 0.75,
  style: 0.15,
  use_speaker_boost: true,
  text_prefix: "*default narrator register — speaker not explicitly mapped* ",
};
