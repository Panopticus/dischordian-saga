/* ═══════════════════════════════════════════════════════
   WEST BY GOD — 10-Track Package
   Age of Insurgency | Near-Future Cyberpunk
   The Two Witnesses Rising
   ═══════════════════════════════════════════════════════ */

export interface WBGTrack {
  id: string; trackNumber: number; title: string;
  storyPosition: string; lore: string;
  loredexEntries: string[];
  klingPrompt: string; seedanceMotion: string;
  loreNotification?: string;
  hasExistingVideo?: boolean;
}

export const WBG_TRACKS: WBGTrack[] = [
  { id: "wbg-01", trackNumber: 1, title: "We Are Not Okay", storyPosition: "Pre-contact. The Programmer alone in New Babylon.", lore: "Thought Virus deployed through pharmacies. Citizens sedated. The Programmer is the first to resist.", loredexEntries: ["entity_thought_virus", "location_new_babylon"], hasExistingVideo: true,
    klingPrompt: "2D anime illustration, cel shaded, sharp clean outlines, Cowboy Bebop meets Cyberpunk Edgerunners meets Afro Samurai aesthetic, 8K. The Programmer — tall, lean, fair skin, dark newsboy cap, dark coat — walks alone through sterile sun-bleached streets of New Babylon. Citizens with blank, glassy eyes. Holographic billboards display The Meme's soothing broadcasts. The Programmer is the only person whose eyes are fully open. The horror is the normalcy.",
    seedanceMotion: "Camera follows behind The Programmer at street level. The world moves at a slightly wrong pace — too smooth, too calm. He stops at a corner. Crowds part around him without acknowledging. A protest flyer blows past his feet.",
    loreNotification: "[LORE] New Babylon the Great was built on pharmaceuticals. The Thought Virus is distributed through the city's automated pharmacy network. The Programmer is the first to notice." },
  { id: "wbg-02", trackNumber: 2, title: "Medicated", storyPosition: "Pre-contact. Mapping the pharmaceutical system.", lore: "The voice shift mid-song IS the Thought Virus speaking through him. 'Raise your hand if you've ever been medicated.' The breaking of the seventh seal referenced.", loredexEntries: ["entity_thought_virus", "entity_lyra_vox"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. The Programmer at a terminal, cascading pharmaceutical data. Pill bottles labeled 'SAMSARA.' Whiteboard: 'THOUGHT VIRUS — DISTRIBUTION MATRIX.' Eyes slightly unfocused — the virus is in the air he's breathing. He doesn't know yet.",
    seedanceMotion: "Data streams around him. Some spell 'IN THE BEGINNING WAS THE WORD' in fragments. The virus visually pulses through infrastructure. He sees the data pattern. He doesn't see what's in the air.",
    loreNotification: "[HIDDEN] The voice that takes over mid-song isn't metaphor. That is the Thought Virus architecture speaking through him." },
  { id: "wbg-03", trackNumber: 3, title: "Hypnotized", storyPosition: "CONTACT — Programmer finds The Enigma.", lore: "The fixed narrative pivot. 'She moves like a Lioness / Rules like her highness / The Queen of Truth.' First time The Enigma is named.", loredexEntries: ["entity_enigma", "entity_programmer", "concept_two_witnesses"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. The moment of first contact. The Programmer in an underground club doorway, light behind him. Across the crowd: The Enigma — tall, regal, ebony skin, radiant smile, warm brown eyes — performing. She hasn't seen him yet. He has stopped moving. Only she is in focus. Number 7 in graffiti behind her. Banner: 'NO KINGS.'",
    seedanceMotion: "Camera is The Programmer's POV — pushing slowly through the crowd toward The Enigma. Everything else blurs. She gets clearer. The ambient drops away. Only her voice remains." },
  { id: "wbg-04", trackNumber: 4, title: "It Ain't Illegal (...Yet)", storyPosition: "Early alliance. Programmer embedded with rebel crew.", lore: "Digital resistance. The ominous 'yet' foreshadows the Age of Revelation. Code contains 'inception_ark' and 'genesis_protocol' variable names.", loredexEntries: ["entity_kael", "location_new_babylon", "concept_insurgency"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. The Programmer at a hacking terminal, fingers flying, holographic data streams. Variable names 'inception_ark' and 'genesis_protocol' glow faintly. Graffiti: 'HACK REALITY.' Wanted poster for 'THE RECRUITER.' The Enigma in the doorway, watching, arms crossed, half-smiling.",
    seedanceMotion: "Code streams become a visual map of the Empire's architecture — surveillance, pharmaceutical distribution, Panopticon data lines. The Programmer draws the map of everything that needs to be taken down.",
    loreNotification: "[CODE] Variable names 'inception_ark' and 'genesis_protocol' in The Programmer's code. His father hid the keys to a system older than the Empire inside his son's inheritance." },
  { id: "wbg-05", trackNumber: 5, title: "Monuments", storyPosition: "Pre-contact reflection. After the archive revelation.", lore: "Statues of all Ten Archons in the plaza. 'The bigger the monument, the deeper the grave.'", loredexEntries: ["faction_empire"], hasExistingVideo: true,
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. The crew walking through a vast imperial plaza. Statues of all Ten Archons — massive, gleaming. The Collector's statue holds memory crystals. A cracked base reads 'THE CONEXUS — DECOMMISSIONED.' The Programmer looks up at the statues. He recognizes his father's creation. His expression is grief.",
    seedanceMotion: "Slow walk through monument plaza. Camera moves between statues — each a face the player will encounter. At the end: an empty pedestal. No statue. Plaque: 'THE HUMAN.' The crew doesn't notice. The camera lingers." },
  { id: "wbg-06", trackNumber: 6, title: "Damned for Sure", storyPosition: "Empire strikes back. The crew hunted.", lore: "Watcher Sentinels with 'OCULARUM' visors. Panopticon soldiers in pursuit. High-speed chase.", loredexEntries: ["entity_programmer", "entity_warden", "entity_watcher"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. High-speed chase through New Babylon's underbelly. Watcher Sentinels — visors blazing 'OCULARUM' — and Panopticon soldiers closing in. The Programmer and Enigma at full sprint, breath visible in cold air. Behind: destruction. Ahead: a narrow alley.",
    seedanceMotion: "Chase sequence — rapid cuts between pursuers and pursued. The city itself closing in. One moment of stillness: The Enigma looks back at him over her shoulder. A decision in her eyes." },
  { id: "wbg-07", trackNumber: 7, title: "Born Under a Bad Sign", storyPosition: "The Programmer's confession and backstory.", lore: "Leo/lion imagery connects to Iron Lion. Jazz-to-techno mirrors his arc. 'Even a demon can become an angel again if he believes' — foreshadows Two Witnesses.", loredexEntries: ["entity_programmer", "entity_iron_lion"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. Split image: LEFT — The Programmer as a child, Appalachian mountains, coal-dusted community, analog warmth. RIGHT — now, surrounded by digital infrastructure, neon city. The lion pendant around his neck connects both images. A single thread of continuity across a broken identity.",
    seedanceMotion: "The two halves slowly merge — the child and the man becoming one frame. The lion pendant is the fixed point." },
  { id: "wbg-08", trackNumber: 8, title: "On the Road", storyPosition: "Journey montage. Old Mountains to New Babylon.", lore: "'Well-travelled witnesses' = Two Witnesses ref. 'Across a thousand realities' = time travel hint. The crew as found family.", loredexEntries: ["concept_two_witnesses", "entity_programmer"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. Wide shot: the crew in a salvaged vehicle through vast post-empire landscapes — Appalachian mountains behind, neon New Babylon ahead. Stars above. Constellation of The Wolf visible. A shooting star crosses — an Inception Ark in high orbit.",
    seedanceMotion: "Vehicle moves forward. Mountains shrink. City grows. Wolf constellation rotates. Programmer and Enigma visible through windshield — not looking at each other, both looking forward." },
  { id: "wbg-09", trackNumber: 9, title: "The Death of Music", storyPosition: "The Programmer's most honest confession.", lore: "'I fed my vision to a machine and it sang my songs back to me.' 'Exit stage left, fake my own death' — FORESHADOWS the Programmer becoming the Antiquarian.", loredexEntries: ["entity_programmer", "entity_antiquarian"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. The Programmer alone at a piano — old, analog, slightly out of tune. Around him: vast digital infrastructure, AI systems running. He is the only organic thing. His hands rest on the keys. He hasn't played yet. The question of whether he will IS the image.",
    seedanceMotion: "His hands lower to the keys. First notes purely acoustic. Then AI systems harmonize. Are they completing his thought? Or replacing it? The question has no answer.",
    loreNotification: "[ANTIQUARIAN ECHO] 'Exit stage left, fake my own death.' He did. He did exactly that. The Antiquarian is still listening from across five Ages." },
  { id: "wbg-10", trackNumber: 10, title: "Yes I Do (Dream)", storyPosition: "Epilogue / mission statement / album closer.", lore: "Both Witnesses trade verses. 'It won't be televised… it'll be dreamed.' 'The book that bears my given name' — The Book of Daniel IS named for Daniel Cross.", loredexEntries: ["entity_programmer", "entity_enigma", "concept_two_witnesses", "concept_insurgency"],
    klingPrompt: "2D anime, cel shaded, CB×CE×AS, 8K. The Programmer and The Enigma at dawn — New Babylon behind them, changed. Not destroyed. Changed. People moving without the pharmaceutical haze. Newspaper headline: 'THE SILENCE IS BROKEN.' They look out at what they made happen. Not celebrating. Assessing. A new age beginning.",
    seedanceMotion: "Camera pulls back from close two-shot to reveal full New Babylon. The city waking up — real waking. Keeps pulling until we see the whole city, two small figures at its edge, vast unknown ahead." },
];

export const WBG_MEME_INTRO = `[SOUND: Broadcast tower hum. A signal cutting through Empire frequencies.]
THE PROGRAMMER (V.O., urgent whisper):
"They control every frequency. Every stream. Every algorithm. I spent three years building the backdoor. Tonight I'm using it.
The Empire broadcasts the Thought Virus on its frequencies. We're broadcasting truth on every frequency they couldn't lock.
You're not supposed to be hearing this. That's exactly why you need to.
West By God. The revolution won't be televised. It'll be dreamed.
And by the way — I'm still here. I never left. I just changed my name."`;

export const WBG_MEME_OUTRO = `THE ENIGMA (V.O., warm, certain):
"He dreamed it before any of it happened. He saw the Witnesses. He saw the Silence. He saw the Fall.
He thought he was writing songs. He was writing history.
The Age of Insurgency is over. What comes next is not an insurgency. What comes next is a revelation.
Are you ready to hear what comes next? Because it gets quieter before it gets louder.
And the quiet is the loudest thing you'll ever hear."`;
