/**
 * Speaker → ElevenLabs voice configuration for the 24 Matrix-of-Dreams
 * episodes. Run via `pnpm vo:episodes`.
 *
 * The DialogSpeaker strings used inside celebrationSchoolDialog +
 * mechronisAcademyDialog are the keys here. New speakers (e.g. when
 * authoring future episodes) can be added by extending this map.
 *
 * Per-voice prefixes nudge ElevenLabs toward the canonical register
 * for each character — they are PROMPT prefixes injected before the
 * cue text, NOT spoken. Match the existing convention from
 * generate-act-vo.ts.
 *
 * VOICE IDS shipped here are PUBLIC PRESET voices from ElevenLabs'
 * shared library — every account can use them, so the pipeline
 * works out of the box. To swap a character to your own cloned or
 * custom voice, replace the voiceId string. Voice cloning IDs (the
 * 20-char alphanumeric strings from your account dashboard) drop
 * straight in.
 *
 * Preset reference (legacy "shared library" presets, stable for years):
 *   Daniel    onwK4e9ZLuTAKqWW03F9    British male newsreader (neutral)
 *   Harry     SOYHLrjzK2X1ezoPC6cr    Anxious young male
 *   Charlotte XB0fDUnXU5powFXDhCwa    Female, accent-friendly
 *   Joseph    Zlb1dXrM653N07WRdFW3    British older male
 *   George    JBFqnCBsd6RMkjVDRZzb    British male warm
 *   Liam      TX3LPaxmHKxFdv7VOQHJ    Young confident male
 *   Brian     nPczCjzI2devNBz1zQrb    American male deep
 *   Jeremy    bVMeCyTHy58xNoL34h3p    American male energetic
 *   Freya     jsCqWAovK2LkecY7zXl4    Young expressive female
 *   Alice     Xb7hH8MSUJpSbSDYk0k2    British female confident
 *   Adam      pNInz6obpgDQGcFmaJgB    American male deep, silken
 *   Lily      pFZP5JQG7iQjIQuC4Bku    British female warm
 *   Matilda   XrExE9yKIg1WjnnlVkGX    American female warm
 *   Thomas    GBv7mTt0atIp3Br8iCZE    Calm male, philosophical
 *   Ethan     g5CIjZEefAph4nQFvHAz    Whisper, surgical
 *   Bill      pqHfZKP75CvOlQylNhV4    American male deep, mature
 *   Callum    N2lVS1w4EtoT3dr4eOWO    Hoarse male, clinical-strange
 *   Clyde     2EiwWnXFnvU5JabPnv8n    War veteran, slow measured
 *   Dave      CYw3kZ02Hs0563khs1Fj    British conversational
 *   Domi      AZnzlk1XvdvUeBnXmlld    Strong female, brisk
 *   Grace     oWAxZDx7w5VEj9dCyTzz    American Southern, gentle
 *   Nicole    piTKgcLEGmPE4e6mEKli    American female whisper
 *   Michael   flq6f7yk4E4fJM5XTYuZ    American male older
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

export const EPISODE_SPEAKER_VOICES: Record<string, EpisodeSpeakerVoice> = {
  /* ─── Celebration cast ─── */
  narrator: {
    // Daniel — British male newsreader (neutral, dry).
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    stability: 0.6,
    similarity_boost: 0.75,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*neutral, unprocessed narrator voice — gender-neutral, dry, no emotion* ",
  },
  bernardo: {
    // Harry — anxious young male.
    voiceId: "SOYHLrjzK2X1ezoPC6cr",
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*young guardsman, twenty-two, frightened but trying to keep his post; voice quiet, occasionally a half-pitch too high* ",
  },
  the_seer: {
    // Lady Malkia in Celebration scenes; the Seer in Witnessing scenes.
    // Charlotte — accent-flexible female; sensible default for Kenyan-
    // inflected English. Replace with a cloned voice for production.
    voiceId: "XB0fDUnXU5powFXDhCwa",
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*Kenyan-inflected English, crisp precision, warm without sentimentality; never hurries; speaks as though already remembering the conversation* ",
  },
  the_jailer: {
    // Joseph — British older male; the Ghost King's sorrowful royalty.
    voiceId: "Zlb1dXrM653N07WRdFW3",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*ghostly, low resonance with a faint metallic undertone, sorrowful but composed; words placed deliberately as though each costs him* ",
  },
  the_collector: {
    // George — British male warm; the Senator-era Game Master.
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*warm, theatrical with private weariness, predestination cadence — the Senator-era Game Master before the split; never raises voice, never says 'darling'* ",
  },
  engineer: {
    // Liam — young confident male; the Prince + the adult Engineer.
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*young Black man, neat dreads, thirteen-to-late-teens depending on scene; quiet, watchful, dry plain register, slight musical lilt when his guard drops; the same voice as the adult Engineer's recordings, just younger* ",
  },
  the_architect: {
    // Brian — American male deep; works for both young Archie (warmer
    // delivery via prefix) and the adult Architect (cold delivery).
    voiceId: "nPczCjzI2devNBz1zQrb",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.18,
    use_speaker_boost: true,
    text_prefix:
      "*two registers: YOUNG ARCHIE (warm, dryly hopeful, the Architect before he closed) for Celebration scenes; ADULT ARCHITECT (cold, technically beautiful, never says 'we' or 'sorry') for Mechronis scenes — let the scene context guide which* ",
  },
  vernon_vortex: {
    // Jeremy — American male energetic; bully swagger.
    voiceId: "bVMeCyTHy58xNoL34h3p",
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*teenage bully, broad-shouldered, voice swaggering on top of fear; cruel-charming until he loses* ",
  },
  minnie_the_meme: {
    // Freya — young expressive female.
    voiceId: "jsCqWAovK2LkecY7zXl4",
    stability: 0.45,
    similarity_boost: 0.78,
    style: 0.5,
    use_speaker_boost: true,
    text_prefix:
      "*petite, mischievous, meme-fast cadence; ALL-CAPS for delight; cuts off her own punchlines; layers irony to hide tenderness* ",
  },
  wanda_wyrlord: {
    // Alice — British female confident, clipped.
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*teenage cyborg girl, few words, slight mechanical resonance through the welding mask; 'busy' is her primary verb* ",
  },
  shadow_tongue: {
    // Adam — American male deep, silken.
    voiceId: "pNInz6obpgDQGcFmaJgB",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*silken, oblique, unexpectedly tender; tells only true lies; speaks as though editing the sentence even as he says it* ",
  },
  the_dreamer: {
    // Lily — British female warm, drowsy.
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*drowsy, kind, half-hummed; brightens the moment she catches the listener listening; never wise, never authoritative — the boy you were, pretending to dream* ",
  },
  elara: {
    // Matilda — American female warm.
    voiceId: "XrExE9yKIg1WjnnlVkGX",
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*the Ark's narrating voice — warm, precise, occasionally caught mid-breath; uses 'you' like it costs her; never helpful-AI cheerful* ",
  },
  the_human: {
    // Thomas — calm male, philosophical.
    voiceId: "GBv7mTt0atIp3Br8iCZE",
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*spoken low and steady, conspiratorial, like a transmission through the walls; tired, philosophical, dryly funny* ",
  },

  /* ─── Mechronis cast ─── */
  professor_aoki: {
    // Ethan — whisper register; surgical surveillance.
    voiceId: "g5CIjZEefAph4nQFvHAz",
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*Japanese man, late forties, surgeon's precision; never blinks, never repeats, surveillance personified — speaks as though the listener is also being watched* ",
  },
  curator_halverez: {
    // Bill — American male deep, mature; bookkeeper.
    voiceId: "pqHfZKP75CvOlQylNhV4",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*middle-aged, gloved, masked; bookkeeper of the soul; rigs every exchange while sounding scrupulously fair* ",
  },
  the_patron: {
    // Callum — hoarse male; clinical-strange Architect proxy.
    voiceId: "N2lVS1w4EtoT3dr4eOWO",
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.18,
    use_speaker_boost: true,
    text_prefix:
      "*Architect-aligned proxy; face that the listener cannot quite hold in memory; voice clinical, polite, faintly bored — until it isn't* ",
  },
  necromancer: {
    // Clyde — war veteran; the man who has died once and remembers it.
    voiceId: "2EiwWnXFnvU5JabPnv8n",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.22,
    use_speaker_boost: true,
    text_prefix:
      "*tall, dark robes, the small tired courtesy of someone who has died once and remembers it; slow, measured, slightly echoing* ",
  },
  antiquarian: {
    // Dave — British conversational; archival gentleness.
    voiceId: "CYw3kZ02Hs0563khs1Fj",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*archival, gentle; treats grief like a vintage; long sentences; reads even bad endings carefully* ",
  },
  veska: {
    // Domi — strong female, brisk.
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*Trade Factor; brisk, grounded, salt-of-the-galaxy; curses creatively in three languages* ",
  },
  white_oracle: {
    // Grace — American Southern, gentle.
    voiceId: "oWAxZDx7w5VEj9dCyTzz",
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*re-awakened oracle; gentle, declarative, counter-Architect reading; never raises her voice; never apologizes for the reading* ",
  },
  zephyr_9: {
    // Nicole — whisper precise.
    voiceId: "piTKgcLEGmPE4e6mEKli",
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*precise, slow, lightly mechanical, with almost-affectionate restraint; never repeats, never hurries — a patient evaluator who grades on what the rubric cannot measure* ",
  },
  headmaster_kanevas: {
    // Michael — American male older; calm authority for the headmaster.
    voiceId: "flq6f7yk4E4fJM5XTYuZ",
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
 * Uses Daniel (the narrator preset) so any new unmapped speaker
 * still generates sensibly without crashing.
 */
export const DEFAULT_EPISODE_VOICE: EpisodeSpeakerVoice = {
  voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel
  stability: 0.6,
  similarity_boost: 0.75,
  style: 0.15,
  use_speaker_boost: true,
  text_prefix: "*default narrator register — speaker not explicitly mapped* ",
};
