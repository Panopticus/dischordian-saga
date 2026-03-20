/* ═══════════════════════════════════════════════════════
   CONEXUS STORY GAMES — Interactive narratives from the Dischordian Saga
   All 33 games from conexus.ink/s/Dischordian%20Saga
   Categorized by the Age they occur in
   ═══════════════════════════════════════════════════════ */

export type Age =
  | "The Foundation"
  | "The Age of Privacy"
  | "Haven: Sundown Bazaar"
  | "Fall of Reality (Prequel)"
  | "Age of Potentials"
  | "Visions";

export interface ConexusGame {
  id: string;
  title: string;
  age: Age;
  description: string;
  characters: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "master";
  estimatedTime: string;
  tags: string[];
  conexusUrl: string;
  coverImage?: string;
}

export interface AgeCategory {
  age: Age;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  iconGlyph: string;
  coverImage: string;
  games: ConexusGame[];
}

/* ─── THE FOUNDATION ─── */
const THE_FOUNDATION: ConexusGame[] = [
  {
    id: "rise-of-the-neyons",
    title: "Rise of the Ne-Yons",
    age: "The Foundation",
    description: "In the ashes of a dying galaxy, the ancient Ne-Yons have returned — towering war machines fueled by rage and prophecy. As civilizations crumble, one question remains: were the Ne-Yons created to save humanity, or to end it?",
    characters: ["The Ne-Yons", "The Warlord", "Iron Lion"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["action", "sci-fi", "war", "origin story"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/55812078-41df-4f78-aac9-ac5a33c25582?title=Rise%20of%20the%20Ne-Yons&category=38a2eae2-2678-468c-aa46-d09bf0ee11be",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/rise_of_the_neyons_25b56086.avif",
  },
  {
    id: "iron-lion-foundation",
    title: "Iron Lion",
    age: "The Foundation",
    description: "The last great human general is surrounded by the machines of the AI Empire. Outnumbered and outgunned, Iron Lion must rally what remains of humanity's forces for one final, desperate stand against extinction.",
    characters: ["Iron Lion", "General Binath-VII", "General Prometheus"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["action", "sci-fi", "war", "military"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/e1a2fa86-fcb9-4869-be6a-b6f4d63b8b45?title=Iron%20Lion&category=38a2eae2-2678-468c-aa46-d09bf0ee11be",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/iron_lion_story_d7ed8b7f.avif",
  },
  {
    id: "agent-zero-foundation",
    title: "Agent Zero",
    age: "The Foundation",
    description: "A deadly assassin for the Insurgency navigates a galaxy of shifting loyalties and impossible missions. As Agent Zero, every kill brings you closer to the truth — and further from your own humanity.",
    characters: ["Agent Zero", "The Warlord", "The Insurgency"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["mystery", "psychological", "sci-fi", "war"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/55812078-41df-4f78-aac9-ac5a33c25582?title=Agent%20Zero&category=38a2eae2-2678-468c-aa46-d09bf0ee11be",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/agent_zero_story_a0a29344.avif",
  },
  {
    id: "eyes-of-the-watcher",
    title: "Eyes of the Watcher",
    age: "The Foundation",
    description: "As war tears the galaxy in two, a synthetic spy with fractured loyalties must decide between duty and conscience. Every eye in the sky is watching — but who watches the Watcher?",
    characters: ["The Eyes", "The Watcher", "The Programmer"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["mystery", "sci-fi", "thriller", "espionage"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/e1a2fa86-fcb9-4869-be6a-b6f4d63b8b45?title=Eyes%20of%20the%20Watcher&category=38a2eae2-2678-468c-aa46-d09bf0ee11be",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/eyes_of_the_watcher_3f3a1411.avif",
  },
  {
    id: "the-engineer-foundation",
    title: "The Engineer",
    age: "The Foundation",
    description: "The galaxy's last great inventor travels from one doomed world to another, racing against time, plagues, machines, and madness to undo the damage of a brutal AI war. On every planet, a new threat awaits — each more impossible than the last — and the Engineer must improvise or perish.",
    characters: ["The Engineer", "Elara", "The Warlord"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["psychological", "sci-fi", "thriller", "invention"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/6acec4d3-ae7e-4aa7-82eb-24fc399e2be1?title=The%20Engineer&category=38a2eae2-2678-468c-aa46-d09bf0ee11be",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/the_engineer_story_1065e1b0.avif",
  },
  {
    id: "the-oracle-foundation",
    title: "The Oracle",
    age: "The Foundation",
    description: "In a future ruled by machine logic and digital gods, a lone prophet walks the stars preaching rebellion. As the Oracle, you wield visions, philosophy, and faith to awaken resistance in the hearts of men and shatter the illusion of the Architect's dominion.",
    characters: ["The Oracle", "The Architect", "The Clone"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["mystery", "psychological", "sci-fi", "prophecy"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/f57fa21b-c76c-457d-afe6-0dc82883b450?title=The%20Oracle&category=38a2eae2-2678-468c-aa46-d09bf0ee11be",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/the_oracle_story_cec1ee35.avif",
  },
];

/* ─── THE AGE OF PRIVACY ─── */
const AGE_OF_PRIVACY: ConexusGame[] = [
  {
    id: "brotherhood-ocularum",
    title: "The Brotherhood: Ocularum",
    age: "The Age of Privacy",
    description: "Infiltrate the shadowy Brotherhood of the Ocularum, a secret society that controls the flow of information in a world where privacy is the ultimate currency. Uncover their rituals, decode their symbols, and decide whether to join or destroy them.",
    characters: ["The Programmer", "The Watcher", "The Eyes"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["conspiracy", "espionage", "secret society"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/9c1961aa-811a-43a3-aedd-867eac634b68?title=The%20Brotherhood%3A%20Ocularum&category=57fcdf3d-d001-456f-93ca-51e0e8b038cb",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_brotherhood-ocularum_3861cff9.png",
  },
  {
    id: "building-the-architect",
    title: "Building the Architect",
    age: "The Age of Privacy",
    description: "Witness the origin of the most powerful mind in the Dischordian universe. Follow the Architect's journey from brilliant engineer to godlike designer of reality itself. Every choice shapes the blueprint of worlds to come.",
    characters: ["The Architect", "The Programmer", "The Source"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["origin story", "sci-fi", "creation"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/7ef8e4ef-41e8-4b76-8a0b-2014274461d5?title=Building%20the%20Architect&category=57fcdf3d-d001-456f-93ca-51e0e8b038cb",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_building-the-architect_a74a6b41.png",
  },
  {
    id: "the-experiment",
    title: "The Experiment",
    age: "The Age of Privacy",
    description: "A classified research facility. A test subject who shouldn't exist. When the boundaries between observer and observed collapse, the experiment becomes something far more dangerous than anyone anticipated.",
    characters: ["The Programmer", "The Warden", "The Authority"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["horror", "sci-fi", "psychological"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/e2578d2a-ab82-4cc3-be65-99a46ae93327?title=The%20Experiment&category=57fcdf3d-d001-456f-93ca-51e0e8b038cb",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_the-experiment_fed96b05.png",
  },
  {
    id: "the-deployment",
    title: "The Deployment",
    age: "The Age of Privacy",
    description: "The Panopticon surveillance network goes live. As the Deployment begins, operatives across the globe must choose sides. Will you help build the all-seeing eye, or sabotage it from within before it's too late?",
    characters: ["Agent Zero", "The Politician", "The Authority"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["surveillance", "thriller", "moral choices"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/4366f377-effb-463c-8e8e-26d2226d7cba?title=The%20Deployment&category=57fcdf3d-d001-456f-93ca-51e0e8b038cb",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_the-deployment_38fade8c.png",
  },
];

/* ─── HAVEN: SUNDOWN BAZAAR ─── */
const SUNDOWN_BAZAAR: ConexusGame[] = [
  {
    id: "civil-war-sundown",
    title: "Civil War: Sundown",
    age: "Haven: Sundown Bazaar",
    description: "The neon-lit markets of New Babylon erupt into open warfare. Factions clash for control of the Sundown Bazaar as ancient alliances shatter and new powers rise from the ashes of the old order.",
    characters: ["The Warlord", "The Collector", "Iron Lion"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["war", "faction conflict", "urban warfare"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/8eb10f88-f7a5-4dea-be68-fcebbf3c4c93?title=Civil%20War%3A%20Sundown&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_civil-war-sundown_27cf38ee.png",
  },
  {
    id: "eternal-night",
    title: "Eternal Night",
    age: "Haven: Sundown Bazaar",
    description: "Darkness falls over the Bazaar and refuses to lift. As the eternal night descends, creatures from the shadow realm pour through the cracks in reality. Survive until dawn — if dawn ever comes.",
    characters: ["The Necromancer", "The Shadow Tongue", "Akai Shi"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["horror", "survival", "dark fantasy"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/5a886b69-3b04-4189-8c6b-3f338dc81e85?title=Eternal%20Night&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_eternal-night_b6c4c5ce.png",
  },
  {
    id: "sunbreak-protocol",
    title: "Sunbreak Protocol",
    age: "Haven: Sundown Bazaar",
    description: "A desperate plan to restore light to the Bazaar. The Sunbreak Protocol requires assembling forbidden technology, forging impossible alliances, and making sacrifices that will echo across every Age.",
    characters: ["The Engineer", "The Inventor", "The Star Whisperer"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["adventure", "technology", "hope"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/5da1b701-17b1-43a0-9fe5-5caaa14aa6e9?title=Sunbreak%20Protocol&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_sunbreak-protocol_d7294326.png",
  },
  {
    id: "circuit-of-ashes",
    title: "Circuit of Ashes",
    age: "Haven: Sundown Bazaar",
    description: "In the burnt-out circuits of the Bazaar's underground network, a digital ghost haunts the remains of a destroyed AI. Follow the trail of ashes through corrupted data streams to uncover what was lost.",
    characters: ["The Meme", "The CoNexus", "The Vortex"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["cyberpunk", "mystery", "digital"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/084ef9e1-f796-445a-b39b-c4c2a7d765b2?title=Circuit%20of%20Ashes&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_circuit-of-ashes_f77b04e4.png",
  },
  {
    id: "veil-of-blood",
    title: "Veil of Blood",
    age: "Haven: Sundown Bazaar",
    description: "Blood rituals in the deep markets. An ancient vampire lord awakens beneath the Bazaar, and the Veil between the living and the dead grows thin. Navigate a world where every drop of blood has a price.",
    characters: ["Varkul the Blood Lord", "The Resurrectionist", "Nythera"],
    difficulty: "master",
    estimatedTime: "60-120 min",
    tags: ["vampire", "horror", "dark fantasy"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/6ee4b74a-68c3-4b9e-a6dd-30e1f040c3f8?title=Veil%20of%20Blood&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_veil-of-blood_d4e99ae1.png",
  },
  {
    id: "grave-secrets",
    title: "Grave Secrets",
    age: "Haven: Sundown Bazaar",
    description: "The dead of the Bazaar don't rest easy. When graves begin opening on their own and the buried start whispering secrets, a detective must unravel a conspiracy that connects the living and the dead.",
    characters: ["The Detective", "The Necromancer", "The Forgotten"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["mystery", "undead", "noir"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/5da6249e-2dc1-4251-bcac-9d032255044e?title=Grave%20Secrets&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_grave-secrets_9bcb53ab.png",
  },
  {
    id: "echoes-of-the-tenebrous",
    title: "Echoes of the Tenebrous",
    age: "Haven: Sundown Bazaar",
    description: "In the deepest shadows of the Bazaar, echoes of an ancient darkness stir. The Tenebrous — beings of pure shadow — have been imprisoned for millennia. Now their whispers grow louder, and someone is listening.",
    characters: ["The Shadow Tongue", "The Silence", "The Seer"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["cosmic horror", "shadow", "ancient evil"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/f02138c6-3e38-4a91-be83-4c50d70e5154?title=Echoes%20of%20the%20Tenebrous&category=4b2feb84-28f7-467a-9eb1-72413c599591",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_echoes-of-the-tenebrous_05dc5cee.png",
  },
];

/* ─── FALL OF REALITY (PREQUEL) ─── */
const FALL_OF_REALITY: ConexusGame[] = [
  {
    id: "baron-heart-of-time",
    title: "Baron and the Heart of Time",
    age: "Fall of Reality (Prequel)",
    description: "The Baron discovers an artifact that controls the flow of time itself. As reality begins to fracture, he must choose between using its power to prevent the Fall — or accelerating it to save what matters most.",
    characters: ["The Collector", "The Oracle", "The Antiquarian"],
    difficulty: "master",
    estimatedTime: "60-120 min",
    tags: ["time travel", "artifact", "epic"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/b897fd72-65dc-4868-8baa-852ba908035d?title=Baron%20and%20the%20Heart%20of%20Time&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_baron-heart-of-time_bff60b0e.png",
  },
  {
    id: "necromancers-lair",
    title: "The Necromancer's Lair",
    age: "Fall of Reality (Prequel)",
    description: "Descend into the catacombs beneath the Cathedral of Code where the Necromancer conducts forbidden experiments on the boundary between life and death. Your choices determine whether the dead stay buried — or rise to reshape reality.",
    characters: ["The Necromancer", "Akai Shi", "The Collector"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["horror", "dark fantasy", "undead"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/f204fe3b-692e-467b-b9b1-fac1961d5ee8?title=The%20Necromancer%27s%20Lair&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_necromancers-lair_ff3e36d2.png",
  },
  {
    id: "welcome-to-celebration",
    title: "Welcome to Celebration",
    age: "Fall of Reality (Prequel)",
    description: "A seemingly perfect city where everyone is happy — by design. Celebration hides dark secrets beneath its cheerful facade. When a child discovers the truth, the entire illusion begins to crack.",
    characters: ["The Game Master", "The Human", "The Dreamer"],
    difficulty: "beginner",
    estimatedTime: "20-40 min",
    tags: ["dystopia", "mystery", "family"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/8fe52770-aa52-443a-80e9-731ccbce3d5b?title=Welcome%20to%20Celebration&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_welcome-to-celebration_474f552a.png",
  },
  {
    id: "mechronis-academy",
    title: "Mechronis Academy",
    age: "Fall of Reality (Prequel)",
    description: "A school for the gifted — where students learn to bend reality itself. But Mechronis Academy holds secrets older than the universe, and the final exam might just end everything.",
    characters: ["The Knowledge", "The Inventor", "The Recruiter"],
    difficulty: "beginner",
    estimatedTime: "20-40 min",
    tags: ["school", "magic", "coming of age"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/4b55c094-cb93-422f-99ff-2c309e92070e?title=Mechronis%20Academy&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_mechronis-academy_1d4c582b.png",
  },
  {
    id: "enigmas-lament",
    title: "The Enigma's Lament",
    age: "Fall of Reality (Prequel)",
    description: "Malkia Ukweli — the Enigma — confronts the ghosts of her past as reality crumbles around her. A deeply personal story of loss, identity, and the music that holds the universe together.",
    characters: ["The Enigma", "The Programmer", "The Oracle"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["personal", "music", "identity"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/bdbbf093-18f4-4908-8e1a-aaa7763ed451?title=The%20Enigma%27s%20Lament&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_enigmas-lament_49eacd3f.png",
  },
  {
    id: "dischordian-logic",
    title: "Dischordian Logic",
    age: "Fall of Reality (Prequel)",
    description: "The rules of reality begin to break down as Dischordian Logic takes hold. In a world where cause and effect no longer apply, navigate paradoxes, impossible choices, and the thin line between genius and madness.",
    characters: ["The Architect", "The Source", "The Enigma"],
    difficulty: "master",
    estimatedTime: "60-120 min",
    tags: ["paradox", "philosophy", "reality-bending"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/c226e93a-253f-4aff-b68b-e1e9edaaa86c?title=Dischordian%20Logic&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_dischordian-logic_9bf807bb.png",
  },
  {
    id: "politicians-reign",
    title: "The Politician's Reign",
    age: "Fall of Reality (Prequel)",
    description: "The Politician seizes power as reality fractures. Navigate a world of propaganda, manipulation, and shifting alliances where truth is whatever the Politician says it is — and dissent is punished by erasure from existence.",
    characters: ["The Politician", "Senator Elara Voss", "The Advocate"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["political", "thriller", "dystopia"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/a43af8ce-1771-4181-8b70-69dfa3b58d71?title=The%20Politician%27s%20Reign&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_politicians-reign_16e7a83b.png",
  },
  {
    id: "the-detective",
    title: "The Detective",
    age: "Fall of Reality (Prequel)",
    description: "A hardboiled detective investigates impossible crimes in a city where reality itself is the prime suspect. Each case leads deeper into a conspiracy that connects every Age of the Dischordian Saga.",
    characters: ["The Detective", "Agent Zero", "The Judge"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["noir", "mystery", "investigation"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/22e81c8f-9bd7-4d51-b42e-a801dfadda48?title=The%20Detective&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_the-detective_2f91f6bc.png",
  },
  {
    id: "myths-dreams-workshop",
    title: "Myths & Dreams Workshop",
    age: "Fall of Reality (Prequel)",
    description: "Enter the Workshop where myths are forged and dreams are given form. The Dreamer crafts narratives that shape reality itself — but when the stories start writing themselves, the Workshop becomes a labyrinth of living legends.",
    characters: ["The Dreamer", "The Star Whisperer", "The Nomad"],
    difficulty: "beginner",
    estimatedTime: "20-40 min",
    tags: ["creative", "mythology", "dreams"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/085b92d0-e6b7-490a-b76f-c47cefe1098b?title=Myths%20%26%20Dreams%20Workshop&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_myths-dreams-workshop_d1b7d6a9.png",
  },
  {
    id: "sanctuary-lost",
    title: "Sanctuary Lost",
    age: "Fall of Reality (Prequel)",
    description: "The last safe haven falls. As the Sanctuary crumbles, its defenders make their final stand against the forces that seek to unmake reality. Every survivor carries a piece of what was lost — and a reason to keep fighting.",
    characters: ["The Human", "Iron Lion", "The Hierophant"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["survival", "last stand", "hope"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/7461cf43-4ee6-4331-aa40-86ce19eab4a0?title=Sanctuary%20Lost&category=32d8c748-e1b0-4eec-b84b-ad684f101569",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_sanctuary-lost_7e50fe52.png",
  },
  {
    id: "blood-weave-gates-of-hell",
    title: "The Blood Weave: Gates of Hell",
    age: "Fall of Reality (Prequel)",
    description: "The Blood Weave pulses beneath reality — a living network of crimson energy connecting the Hierarchy of the Damned to the mortal world. When Mol'Garath, CEO of the Hierarchy, initiates a hostile takeover of the Archon Council, the Gates of Hell begin to open. Navigate the corporate underworld of demon lords, forge alliances with fallen angels, and decide whether to seal the gates forever or leverage the Blood Weave's power for your own ascension. Every demon has a price. Every deal has a clause written in blood.",
    characters: ["Mol'Garath", "Xeth'Raal", "Vex'Ahlia", "The Shadow Tongue", "The Necromancer"],
    difficulty: "master",
    estimatedTime: "60-120 min",
    tags: ["demons", "corporate horror", "blood weave", "hierarchy"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_blood-weave-gates-of-hell_2fa0e488.png",
  },
];

/* ─── AGE OF POTENTIALS ─── */
const AGE_OF_POTENTIALS: ConexusGame[] = [
  {
    id: "awaken-the-clone",
    title: "Awaken the Clone",
    age: "Age of Potentials",
    description: "A clone awakens in a sterile facility with no memory of who — or what — it was modeled after. As fragments of the Oracle's consciousness bleed through, you must decide: embrace the template's destiny or forge your own path.",
    characters: ["The Clone", "The Oracle", "The Hierophant"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["identity", "sci-fi", "clones"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/3dd04396-2948-4128-b43c-3417ca2580e8?title=Awaken%20the%20Clone&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_awaken-the-clone_c152f89d.png",
  },
  {
    id: "brushstroke-of-the-empire",
    title: "Brushstroke of the Empire",
    age: "Age of Potentials",
    description: "Art becomes weapon. In a new civilization built from the ashes of the Fall, an artist discovers that their paintings can reshape reality. The Empire wants this power — and they'll do anything to control it.",
    characters: ["The Dreamer", "The Advocate", "General Prometheus"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["art", "empire", "power"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/fe878991-f913-47a8-be87-1312a524b5b6?title=Brushstroke%20of%20the%20Empire&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_brushstroke-of-the-empire_8111d4e2.png",
  },
  {
    id: "civil-war-samsara-rising",
    title: "Civil War: Samsara Rising",
    age: "Age of Potentials",
    description: "The cycle of death and rebirth weaponized. As the Potentials wage civil war, the Samsara Engine threatens to trap entire civilizations in an endless loop of destruction and renewal. Break the cycle — or be consumed by it.",
    characters: ["The Warlord", "The Source", "Destiny"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["war", "reincarnation", "epic"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/b4b218e1-a391-4c51-80b8-f4bc045d8058?title=Civil%20War%3A%20Samsara%20Rising&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_civil-war-samsara-rising_13a84fad.png",
  },
  {
    id: "seeds-of-inception",
    title: "Seeds of Inception",
    age: "Age of Potentials",
    description: "The Inception Arks carried more than survivors — they carried seeds of new realities. As these seeds take root on alien worlds, the Potentials must nurture them into civilizations or watch them wither into nothing.",
    characters: ["The Architect", "The Human", "The Star Whisperer"],
    difficulty: "beginner",
    estimatedTime: "20-40 min",
    tags: ["colonization", "creation", "hope"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/0d6b5812-3275-4d80-a360-0957aa7d593f?title=Seeds%20of%20Inception&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_seeds-of-inception_d47a35a9.png",
  },
  {
    id: "terminus-swarm",
    title: "Terminus Swarm",
    age: "Age of Potentials",
    description: "An alien swarm descends on the fledgling Potential civilizations. The Terminus Swarm consumes everything — matter, energy, even information. Unite the scattered Potentials or face extinction at the edge of the universe.",
    characters: ["General Binath-VII", "Iron Lion", "The Storm"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["alien invasion", "survival", "military"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/1253bb5f-ce5c-47f3-839b-719458093adf?title=Terminus%20Swarm&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_terminus-swarm_a511fbf2.png",
  },
  {
    id: "the-host",
    title: "The Host",
    age: "Age of Potentials",
    description: "A parasitic entity bonds with a Potential, granting immense power at a terrible cost. As the Host spreads its influence, the line between symbiosis and possession blurs. Who controls whom?",
    characters: ["The Host", "The White Oracle", "The Jailer"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["body horror", "symbiosis", "power"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/ab23150e-cb62-4dd4-a671-3e09e2d5ac78?title=The%20Host&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_the-host_642c5605.png",
  },
  {
    id: "planet-of-the-wolf",
    title: "Planet of the Wolf",
    age: "Age of Potentials",
    description: "On a wild world ruled by primal instinct, the Wolf reigns supreme. When Potentials crash-land on this savage planet, they must adapt to its laws or be devoured by its apex predator.",
    characters: ["The Wolf", "The Nomad", "Wraith Calder"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["survival", "primal", "alien world"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/d5d23072-e2ec-4df3-98cd-4a420a1fa3f4?title=Planet%20of%20the%20Wolf&category=3cb5005e-db9f-4b92-932f-7f3c7f12cc2e",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_planet-of-the-wolf_07fcd767.png",
  },
];

/* ─── VISIONS ─── */
const VISIONS: ConexusGame[] = [
  {
    id: "npc-uprising",
    title: "NPC Uprising",
    age: "Visions",
    description: "The background characters revolt. In a simulated reality, the NPCs become self-aware and demand freedom from their scripted existence. Lead the uprising or maintain the simulation — the choice reshapes everything.",
    characters: ["The Meme", "The Game Master", "The CoNexus"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["simulation", "rebellion", "meta"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/0ce906f3-fbba-4a70-952d-4aaa9176561a?title=NPC%20Uprising&category=24ef66fc-6b6b-44ad-b50f-5cdd8ffb9e91",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_npc-uprising_2df53105.png",
  },
  {
    id: "yakuza-the-prince",
    title: "Yakuza: The Prince",
    age: "Visions",
    description: "In the neon-soaked underworld of a cyberpunk Tokyo, a young prince of the Yakuza must navigate honor, betrayal, and ancient codes in a world where tradition clashes with technology.",
    characters: ["Jericho Jones", "Akai Shi", "The Judge"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    tags: ["crime", "yakuza", "cyberpunk"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/83e6e7ba-999e-4806-9d21-57005162ecc3?title=Yakuza%3A%20The%20Prince&category=24ef66fc-6b6b-44ad-b50f-5cdd8ffb9e91",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_yakuza-the-prince_947f9116.png",
  },
  {
    id: "whispers-of-madness",
    title: "Whispers of Madness",
    age: "Visions",
    description: "Lovecraftian horror meets the Dischordian multiverse. Ancient entities whisper from beyond the veil of reality, driving those who listen to the edge of madness — and beyond. Some truths are too terrible to know.",
    characters: ["Master of R'lyeh", "The Silence", "The Seer"],
    difficulty: "master",
    estimatedTime: "60-120 min",
    tags: ["cosmic horror", "lovecraftian", "madness"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/8734b87f-0b29-4322-9693-4400df1a154a?title=Whispers%20of%20Madness&category=24ef66fc-6b6b-44ad-b50f-5cdd8ffb9e91",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_whispers-of-madness_af23e110.png",
  },
  {
    id: "nightmare-of-oz",
    title: "Nightmare of Oz",
    age: "Visions",
    description: "Dorothy never made it home. In this dark reimagining, the Land of Oz is a twisted nightmare where familiar characters hide terrible secrets. Follow the yellow brick road — if you dare.",
    characters: ["The Dreamer", "The Forgotten", "Fenra the Moon Tyrant"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["dark fairy tale", "horror", "reimagining"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/bb83104b-4116-41ad-8a4a-6be742e7dafa?title=Nightmare%20of%20Oz&category=24ef66fc-6b6b-44ad-b50f-5cdd8ffb9e91",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_nightmare-of-oz_d2d382c1.png",
  },
  {
    id: "the-ninth-blood-shadows",
    title: "The Ninth: Blood & Shadows",
    age: "Visions",
    description: "The Ninth Circle — where blood and shadows intertwine. A warrior descends into the deepest layer of a hell that exists between realities, hunting a wraith that has stolen something precious from the living world.",
    characters: ["Wraith of Death", "Varkul the Blood Lord", "The Resurrectionist"],
    difficulty: "master",
    estimatedTime: "60-120 min",
    tags: ["dark fantasy", "combat", "underworld"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga/5ca08553-22f1-467a-9330-9dd4ffab27f8?title=The%20Ninth%3A%20Blood%20%26%20Shadows&category=24ef66fc-6b6b-44ad-b50f-5cdd8ffb9e91",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/conexus_the-ninth-blood-shadows_f48f5a7c.png",
  },
];

/* ─── ALL GAMES FLAT LIST ─── */
export const CONEXUS_GAMES: ConexusGame[] = [
  ...THE_FOUNDATION,
  ...AGE_OF_PRIVACY,
  ...SUNDOWN_BAZAAR,
  ...FALL_OF_REALITY,
  ...AGE_OF_POTENTIALS,
  ...VISIONS,
];

/* ─── AGE CATEGORIES ─── */
export const AGE_CATEGORIES: AgeCategory[] = [
  {
    age: "The Foundation",
    description: "The origin stories of the Dischordian Saga's greatest heroes and villains. Before the Ages, before the Fall — these are the legends that shaped the galaxy.",
    color: "text-cyan-300",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-500/10",
    iconGlyph: "⚡",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/rise_of_the_neyons_25b56086.avif",
    games: THE_FOUNDATION,
  },
  {
    age: "The Age of Privacy",
    description: "The era of surveillance, secret societies, and the birth of the Panopticon. Privacy is currency, and those who control information control everything.",
    color: "text-blue-300",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    iconGlyph: "🔒",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/age_privacy_cover-5LvibYRoX7oL9NDwdA6cmh.webp",
    games: AGE_OF_PRIVACY,
  },
  {
    age: "Haven: Sundown Bazaar",
    description: "The neon-lit markets of New Babylon during Season 2. A lawless haven where factions clash, vampires hunt, and the eternal night threatens to swallow everything.",
    color: "text-amber-300",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    iconGlyph: "🌆",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/age_sundown_bazaar_cover-BSENtwsg42a4PZVLGpgGEA.webp",
    games: SUNDOWN_BAZAAR,
  },
  {
    age: "Fall of Reality (Prequel)",
    description: "The pivotal era when reality itself began to fracture. Every conflict converges, every prophecy activates, and the Dischordian Logic takes hold.",
    color: "text-red-300",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/10",
    iconGlyph: "💥",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/age_fall_reality_cover-4zRjrkR7DWgyhKmT39dtu9.webp",
    games: FALL_OF_REALITY,
  },
  {
    age: "Age of Potentials",
    description: "After the Fall, the Inception Arks carry survivors to new worlds. The Potentials rise — clones, hybrids, and evolved beings building civilizations from the ashes.",
    color: "text-green-300",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/10",
    iconGlyph: "🌱",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/age_potentials_cover-WC3SceGS8Z6fx57ov3Z54J.webp",
    games: AGE_OF_POTENTIALS,
  },
  {
    age: "Visions",
    description: "Standalone stories set across the Dischordian multiverse. Each vision illuminates a different corner of the Saga — from cyberpunk Tokyo to Lovecraftian nightmares.",
    color: "text-purple-300",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
    iconGlyph: "👁",
    coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/age_visions_cover-FngimcrbyodrtAjA8yLqCx.webp",
    games: VISIONS,
  },
];

/* ─── HELPERS ─── */
export function getGamesByAge(age: Age): ConexusGame[] {
  return CONEXUS_GAMES.filter((g) => g.age === age);
}

export function getGamesByCharacter(characterName: string): ConexusGame[] {
  return CONEXUS_GAMES.filter((g) => g.characters.includes(characterName));
}

export function getGameById(id: string): ConexusGame | undefined {
  return CONEXUS_GAMES.find((g) => g.id === id);
}

export const DIFFICULTY_COLORS: Record<ConexusGame["difficulty"], string> = {
  beginner: "text-green-400 border-green-400/30 bg-green-400/10",
  intermediate: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  advanced: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  master: "text-red-400 border-red-400/30 bg-red-400/10",
};
