/* Seedance 2.0 Cinematics — production prompts (spec §10) */

export interface CinematicPrompt {
  id: string; title: string; durationSeconds: number;
  keyframes: { timestamp: string; description: string }[];
  songCue?: string;
}

export const GALACTIC_DANCE_CINEMATICS: CinematicPrompt[] = [
  {
    id: "CIN-V1", title: "THE WORD IN THE STORM", durationSeconds: 15,
    keyframes: [
      { timestamp: "0-5s", description: "Deep space. Violetta — enormous, purple, wrapped in a living electrical storm. The storm is not chaotic. It is rhythmic. It breathes. Camera holds at distance until the viewer realizes: those aren't random lightning strikes. Those are pulses. A heartbeat." },
      { timestamp: "5-12s", description: "Ark's Comms Array interior. Oscilloscope going wild with pattern, not noise. Elara stands before it, one hand raised. The Human watches from his corner with recognition. The AWAKE encoding resolves letter by letter in an unknown font that every being understands immediately." },
      { timestamp: "12-15s", description: "Back to Violetta. One section of the storm stills for 0.7 seconds. A point of non-storm in the perpetual storm. Then it closes. The Voltari looked back." },
    ],
    songCue: "The Enigma's Lament — opening bars only",
  },
  {
    id: "CIN-V2", title: "AWAKE REMEMBER BEFORE YOU", durationSeconds: 10,
    keyframes: [
      { timestamp: "0-5s", description: "Governance Hub. Every Ark as a light on the galaxy map, vibrating in harmonic pattern matching Voltari encoding. Tens of thousands of lights pulsing at the same frequency. The Antiquarian stands at his desk, pen in hand, very still." },
      { timestamp: "5-10s", description: "Four words appear at four Voltari beacon locations, lighting simultaneously to form the sentence across the galaxy. The Antiquarian writes one line. Camera holds on handwriting: 'It was addressed to you. It was always addressed to you.'" },
    ],
  },
  {
    id: "CIN-H1", title: "THE COUNCIL OF SURVIVORS", durationSeconds: 10,
    keyframes: [
      { timestamp: "0-5s", description: "New Atarion. A city built from nothing — practical before beautiful, streets wide enough for emergency equipment, solar on every roof, water reclamation on every wall. Not sad. A city that decided to survive and kept deciding every morning. Mirren Hale stands at a window, back to viewer." },
      { timestamp: "5-10s", description: "She turns. Her face: someone who has spent eleven years making decisions for people who couldn't and is tired in the specific way of those who persist. She assesses the viewer — not welcoming, but underneath the assessment, something that might become hope." },
    ],
  },
  {
    id: "CIN-T1", title: "THE LONG MOURNING", durationSeconds: 10,
    keyframes: [
      { timestamp: "0-5s", description: "Hierophant's chamber. Walls covered floor to ceiling in names — hundreds of thousands in Thalorian script, oldest faded, newest sharp. Camera moves slowly across the wall. Not reading. Counting. Feeling the weight of the count." },
      { timestamp: "5-10s", description: "The Hierophant's hand writing a name. Deliberateness of ceremony, not task. The name resolves. The pen lifts. A small silence. Then a period. Complete. The hand moves to the next clean space. There is always more wall." },
    ],
  },
  {
    id: "CIN-C1", title: "SEVENTEEN THOUSAND", durationSeconds: 10,
    keyframes: [
      { timestamp: "0-5s", description: "Clone collective home sector. Seventeen thousand identical faces and yet — not one doing the same thing. One laughing. One arguing over a data slate. One teaching a child. One alone, watching stars. The sameness of DNA and the complete individuality of life. The Oracle's argument made visible." },
      { timestamp: "5-10s", description: "Binath-VII standing apart, looking at them. Specific pride of someone who built something that exceeded what they thought possible. She turns to the viewer: 'The Collector thought he was proving the soul didn't exist. He was proving the opposite. He just didn't stay long enough to see the data.'" },
    ],
  },
];
