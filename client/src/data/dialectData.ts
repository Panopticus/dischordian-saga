export interface Phoneme {
  ipa: string;
  name: string;
  example: string;
  mouthPosition: string;
  tonguePosition: string;
  lipShape: string;
  jawPosition: string;
  voicing: "voiced" | "voiceless";
  type: "vowel" | "consonant" | "diphthong";
  tip: string;
}

export interface PracticePhrase {
  text: string;
  phonetic: string;
  focus: string;
  difficulty: 1 | 2 | 3;
}

export interface Dialect {
  id: string;
  name: string;
  region: string;
  flag: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  signature: string[];
  keyFeatures: {
    title: string;
    description: string;
  }[];
  phonemeShifts: {
    standard: string;
    dialect: string;
    example: string;
    note: string;
  }[];
  mouthPosture: string;
  prosody: {
    rhythm: string;
    intonation: string;
    stress: string;
  };
  practicePhrases: PracticePhrase[];
  commonWords: { word: string; pronunciation: string }[];
  famousExamples: string[];
  pitfalls: string[];
}

export const PHONEMES: Phoneme[] = [
  {
    ipa: "iː",
    name: "Close Front Unrounded (long)",
    example: "fleece, see, beat",
    mouthPosition: "Narrow opening, corners pulled back",
    tonguePosition: "High and forward, near hard palate",
    lipShape: "Spread, smiling",
    jawPosition: "Nearly closed",
    voicing: "voiced",
    type: "vowel",
    tip: "Smile slightly and make the tongue arch toward the roof of your mouth without touching.",
  },
  {
    ipa: "ɪ",
    name: "Near-close Near-front (short)",
    example: "kit, bit, sit",
    mouthPosition: "Slightly more open than iː",
    tonguePosition: "High-mid, forward but relaxed",
    lipShape: "Neutral, slightly spread",
    jawPosition: "Slightly open",
    voicing: "voiced",
    type: "vowel",
    tip: "Relax the tongue from iː position. It should feel lazier and shorter.",
  },
  {
    ipa: "ɛ",
    name: "Open-mid Front Unrounded",
    example: "dress, bed, head",
    mouthPosition: "Mid-open",
    tonguePosition: "Mid, forward",
    lipShape: "Neutral",
    jawPosition: "Half open",
    voicing: "voiced",
    type: "vowel",
    tip: "Jaw drops slightly more than ɪ. Tongue stays forward.",
  },
  {
    ipa: "æ",
    name: "Near-open Front Unrounded",
    example: "trap, cat, bad",
    mouthPosition: "Wide open",
    tonguePosition: "Low-mid, forward",
    lipShape: "Spread wide",
    jawPosition: "Open",
    voicing: "voiced",
    type: "vowel",
    tip: "Classic American 'flat a'. Pull corners of mouth back and drop jaw.",
  },
  {
    ipa: "ɑː",
    name: "Open Back Unrounded (long)",
    example: "father, bath (UK), palm",
    mouthPosition: "Wide open, relaxed",
    tonguePosition: "Low and back",
    lipShape: "Neutral, slightly open",
    jawPosition: "Fully open",
    voicing: "voiced",
    type: "vowel",
    tip: "Open wide like at the doctor's. Tongue pulls back and down.",
  },
  {
    ipa: "ɒ",
    name: "Open Back Rounded (British)",
    example: "lot, hot, top (UK)",
    mouthPosition: "Open with rounded lips",
    tonguePosition: "Low and back",
    lipShape: "Slightly rounded",
    jawPosition: "Open",
    voicing: "voiced",
    type: "vowel",
    tip: "British LOT vowel. Round the lips slightly from ɑː.",
  },
  {
    ipa: "ɔː",
    name: "Open-mid Back Rounded (long)",
    example: "thought, law, caught",
    mouthPosition: "Mid-open, rounded",
    tonguePosition: "Mid-low, back",
    lipShape: "Rounded",
    jawPosition: "Half open",
    voicing: "voiced",
    type: "vowel",
    tip: "Round lips firmly. Tongue drawn back and slightly up from ɒ.",
  },
  {
    ipa: "uː",
    name: "Close Back Rounded (long)",
    example: "goose, blue, food",
    mouthPosition: "Narrow, tightly rounded",
    tonguePosition: "High and back",
    lipShape: "Tightly rounded, protruded",
    jawPosition: "Nearly closed",
    voicing: "voiced",
    type: "vowel",
    tip: "Pucker lips as if kissing. Tongue pulls back and up.",
  },
  {
    ipa: "ʊ",
    name: "Near-close Near-back Rounded",
    example: "foot, book, good",
    mouthPosition: "Slightly open, loose rounding",
    tonguePosition: "High-mid, back",
    lipShape: "Loosely rounded",
    jawPosition: "Slightly open",
    voicing: "voiced",
    type: "vowel",
    tip: "Shorter, looser version of uː. Don't pucker, just round gently.",
  },
  {
    ipa: "ʌ",
    name: "Open-mid Back Unrounded",
    example: "strut, cup, love",
    mouthPosition: "Mid-open, relaxed",
    tonguePosition: "Mid, central-back",
    lipShape: "Neutral",
    jawPosition: "Half open",
    voicing: "voiced",
    type: "vowel",
    tip: "A grunt-like vowel. Tongue low and back, mouth relaxed.",
  },
  {
    ipa: "ə",
    name: "Schwa (mid central)",
    example: "about, sofa, comma",
    mouthPosition: "Neutral",
    tonguePosition: "Centered, mid",
    lipShape: "Relaxed neutral",
    jawPosition: "Slightly open",
    voicing: "voiced",
    type: "vowel",
    tip: "The most common English vowel. Total relaxation — no effort.",
  },
  {
    ipa: "ɜː",
    name: "Open-mid Central (long)",
    example: "nurse, bird, word",
    mouthPosition: "Mid, neutral",
    tonguePosition: "Central, mid",
    lipShape: "Neutral",
    jawPosition: "Half open",
    voicing: "voiced",
    type: "vowel",
    tip: "Like schwa but longer. In American English, add r-color (ɝ).",
  },
  {
    ipa: "eɪ",
    name: "Face diphthong",
    example: "face, day, rain",
    mouthPosition: "Glides from ɛ to ɪ",
    tonguePosition: "Starts mid-front, glides higher",
    lipShape: "Slight spread, ending tighter",
    jawPosition: "Starts half-open, closes",
    voicing: "voiced",
    type: "diphthong",
    tip: "Start in ɛ position and smoothly glide toward ɪ. Don't split into two syllables.",
  },
  {
    ipa: "aɪ",
    name: "Price diphthong",
    example: "price, my, time",
    mouthPosition: "Glides from open to closed",
    tonguePosition: "Starts low, glides high-front",
    lipShape: "Starts wide, closes slightly",
    jawPosition: "Starts open, closes",
    voicing: "voiced",
    type: "diphthong",
    tip: "Open wide with 'ah', then glide to 'ee'. One fluid motion.",
  },
  {
    ipa: "ɔɪ",
    name: "Choice diphthong",
    example: "choice, boy, coin",
    mouthPosition: "Glides from rounded to spread",
    tonguePosition: "Starts back, glides forward",
    lipShape: "Starts rounded, unrounds",
    jawPosition: "Half open, closing",
    voicing: "voiced",
    type: "diphthong",
    tip: "Round the lips for 'oh', then glide to 'ee' as lips spread.",
  },
  {
    ipa: "aʊ",
    name: "Mouth diphthong",
    example: "mouth, now, loud",
    mouthPosition: "Open glides to rounded",
    tonguePosition: "Starts low, glides back-high",
    lipShape: "Starts spread, rounds",
    jawPosition: "Open, closing",
    voicing: "voiced",
    type: "diphthong",
    tip: "Start wide like 'ah' and close to 'oo' while rounding lips.",
  },
  {
    ipa: "əʊ",
    name: "Goat diphthong (UK)",
    example: "goat, go, home (UK)",
    mouthPosition: "Starts central, rounds",
    tonguePosition: "Central to back-high",
    lipShape: "Neutral to rounded",
    jawPosition: "Half closed",
    voicing: "voiced",
    type: "diphthong",
    tip: "Starts with schwa, then glides and rounds to ʊ. Very British.",
  },
  {
    ipa: "oʊ",
    name: "Goat diphthong (US)",
    example: "goat, go, home (US)",
    mouthPosition: "Starts back-rounded, glides",
    tonguePosition: "Mid-back to high-back",
    lipShape: "Rounded throughout",
    jawPosition: "Half closed",
    voicing: "voiced",
    type: "diphthong",
    tip: "American version — starts already rounded. Think 'ohhh'.",
  },
  {
    ipa: "θ",
    name: "Voiceless dental fricative",
    example: "think, bath, thing",
    mouthPosition: "Tongue between teeth",
    tonguePosition: "Tongue tip touches top teeth",
    lipShape: "Slightly open",
    jawPosition: "Slightly open",
    voicing: "voiceless",
    type: "consonant",
    tip: "Stick tongue tip BETWEEN teeth and blow air. Don't say 'f' or 't'.",
  },
  {
    ipa: "ð",
    name: "Voiced dental fricative",
    example: "this, mother, the",
    mouthPosition: "Tongue between teeth",
    tonguePosition: "Tongue tip touches top teeth",
    lipShape: "Slightly open",
    jawPosition: "Slightly open",
    voicing: "voiced",
    type: "consonant",
    tip: "Same position as θ but vibrate the vocal cords. Feel throat buzz.",
  },
  {
    ipa: "ʃ",
    name: "Voiceless postalveolar fricative",
    example: "she, fish, nation",
    mouthPosition: "Narrow, rounded",
    tonguePosition: "Raised toward hard palate, not touching",
    lipShape: "Slightly protruded, rounded",
    jawPosition: "Nearly closed",
    voicing: "voiceless",
    type: "consonant",
    tip: "Pucker slightly and hiss. Like telling someone to be quiet.",
  },
  {
    ipa: "ʒ",
    name: "Voiced postalveolar fricative",
    example: "measure, vision, garage",
    mouthPosition: "Narrow, rounded",
    tonguePosition: "Raised toward hard palate",
    lipShape: "Slightly rounded",
    jawPosition: "Nearly closed",
    voicing: "voiced",
    type: "consonant",
    tip: "Voiced ʃ — add vocal cord vibration to the hiss.",
  },
  {
    ipa: "ŋ",
    name: "Velar nasal",
    example: "sing, ring, long",
    mouthPosition: "Closed at back",
    tonguePosition: "Back of tongue touches soft palate",
    lipShape: "Open",
    jawPosition: "Half open",
    voicing: "voiced",
    type: "consonant",
    tip: "Back of tongue blocks air flow; sound comes through nose.",
  },
  {
    ipa: "r",
    name: "Alveolar approximant (US) / Trill (Spanish)",
    example: "red, car (US), perro (rolled)",
    mouthPosition: "Varies by dialect",
    tonguePosition: "Curled back (US) or tapping alveolar ridge (trill)",
    lipShape: "Slightly rounded (US)",
    jawPosition: "Half open",
    voicing: "voiced",
    type: "consonant",
    tip: "For American R: curl tongue back without touching. For trill: let tongue vibrate.",
  },
];

const RP_BRITISH: Dialect = {
  id: "rp-british",
  name: "Received Pronunciation (RP)",
  region: "England (prestige accent)",
  flag: "GB",
  difficulty: "intermediate",
  description: "The classic 'Queen's English' — the prestige accent of Britain heard in BBC broadcasts, royal speeches, and period dramas.",
  signature: ["Non-rhotic (dropped R's)", "Crisp T's", "Rounded LOT vowel", "Long BATH"],
  keyFeatures: [
    { title: "Non-rhotic", description: "R is dropped unless followed by a vowel. 'Car' = /kɑː/, 'farmer' = /ˈfɑːmə/." },
    { title: "BATH-TRAP split", description: "Words like 'bath', 'class', 'dance' use long /ɑː/, not the American /æ/." },
    { title: "Crisp consonants", description: "T's are fully articulated. 'Water' = /ˈwɔːtə/ — no flap." },
    { title: "LOT rounded", description: "The vowel in 'lot', 'hot' uses rounded /ɒ/, not American /ɑː/." },
    { title: "Clear diphthongs", description: "GOAT = /əʊ/ (starts with schwa), not American /oʊ/." },
  ],
  phonemeShifts: [
    { standard: "/ɑːr/", dialect: "/ɑː/", example: "car → /kɑː/", note: "Drop the R in coda position" },
    { standard: "/æ/", dialect: "/ɑː/", example: "bath → /bɑːθ/", note: "Only in BATH-words (bath, laugh, dance)" },
    { standard: "/ɑː/", dialect: "/ɒ/", example: "lot → /lɒt/", note: "Rounded back vowel" },
    { standard: "/oʊ/", dialect: "/əʊ/", example: "go → /gəʊ/", note: "Centralized start" },
    { standard: "/t/", dialect: "/t/", example: "butter → /ˈbʌtə/", note: "No flapping — keep the T crisp" },
  ],
  mouthPosture: "Slight forward lift in upper lip, jaw relaxed but precise. Tongue feels 'lifted'. Think vertical, not horizontal.",
  prosody: {
    rhythm: "Measured, with clear syllable articulation",
    intonation: "Moderate range, falling at sentence ends",
    stress: "Strong stress on content words, weak forms on function words",
  },
  practicePhrases: [
    { text: "The rain in Spain stays mainly in the plain.", phonetic: "ðə reɪn ɪn speɪn steɪz ˈmeɪnli ɪn ðə pleɪn", focus: "FACE diphthong", difficulty: 1 },
    { text: "I can't dance after a bath in the garden.", phonetic: "aɪ kɑːnt dɑːns ˈɑːftə ə bɑːθ ɪn ðə ˈgɑːdn", focus: "BATH words with /ɑː/", difficulty: 2 },
    { text: "A proper cup of coffee in a copper coffee pot.", phonetic: "ə ˈprɒpə kʌp əv ˈkɒfi ɪn ə ˈkɒpə ˈkɒfi pɒt", focus: "LOT vowel, crisp T's", difficulty: 2 },
    { text: "Rather a lot of bother over father's farther car.", phonetic: "ˈrɑːðər ə lɒt əv ˈbɒðər ˈəʊvə ˈfɑːðəz ˈfɑːðə kɑː", focus: "Non-rhoticity, linking R", difficulty: 3 },
  ],
  commonWords: [
    { word: "schedule", pronunciation: "/ˈʃɛdjuːl/" },
    { word: "tomato", pronunciation: "/təˈmɑːtəʊ/" },
    { word: "water", pronunciation: "/ˈwɔːtə/" },
    { word: "garage", pronunciation: "/ˈgærɑːʒ/" },
    { word: "privacy", pronunciation: "/ˈprɪvəsi/" },
  ],
  famousExamples: ["Dame Judi Dench", "Benedict Cumberbatch (heightened)", "Emma Thompson", "Hugh Grant"],
  pitfalls: ["Don't overdo it — modern RP is subtler than 1950s film RP", "Avoid American 'flapped' T's", "Don't pronounce terminal R's"],
};

const COCKNEY: Dialect = {
  id: "cockney",
  name: "Cockney / East London",
  region: "East End of London",
  flag: "GB",
  difficulty: "advanced",
  description: "Working-class London accent famous for glottal stops, H-dropping, and TH-fronting. Heard in films like Lock Stock and My Fair Lady.",
  signature: ["Glottal stops (bottle → bo'le)", "H-dropping", "TH-fronting (think → fink)", "L-vocalization"],
  keyFeatures: [
    { title: "Glottal T", description: "T between vowels or at word-end becomes a glottal stop: 'butter' → /ˈbʌʔə/, 'what' → /wɒʔ/." },
    { title: "H-dropping", description: "Drop initial H: 'house' → /aʊs/, 'hello' → /əˈləʊ/." },
    { title: "TH-fronting", description: "'Think' → /fɪŋk/, 'brother' → /ˈbrʌvə/. TH becomes F or V." },
    { title: "L-vocalization", description: "Dark L becomes /w/ or /ʊ/: 'milk' → /mɪʊk/, 'hill' → /hɪʊ/." },
    { title: "Diphthong shift", description: "FACE becomes /aɪ/, PRICE becomes /ɔɪ/. 'Day' sounds like 'die'." },
  ],
  phonemeShifts: [
    { standard: "/t/", dialect: "/ʔ/", example: "better → /ˈbeʔə/", note: "Glottal stop between vowels" },
    { standard: "/h/", dialect: "∅", example: "'ello → /ˈeləʊ/", note: "Drop initial H" },
    { standard: "/θ/", dialect: "/f/", example: "thin → /fɪn/", note: "TH-fronting" },
    { standard: "/ð/", dialect: "/v/", example: "brother → /ˈbrʌvə/", note: "Voiced TH becomes V medially" },
    { standard: "/eɪ/", dialect: "/aɪ/", example: "day → /daɪ/", note: "FACE diphthong shift" },
    { standard: "/aɪ/", dialect: "/ɔɪ/", example: "nice → /nɔɪs/", note: "PRICE diphthong shift" },
  ],
  mouthPosture: "Jaw loose and forward. Lips relaxed, almost lazy. Tongue sits low in the mouth. Much more relaxed than RP.",
  prosody: {
    rhythm: "Punchy, with swallowed endings",
    intonation: "Wide pitch range, dramatic rises",
    stress: "Strong initial stress, dropped finals",
  },
  practicePhrases: [
    { text: "I'm going down the pub for a pint, innit?", phonetic: "aɪm ˈgəʊɪn daʊn ðə pʌb fər ə paɪnʔ ˈɪnɪʔ", focus: "Glottal stops, casual tone", difficulty: 2 },
    { text: "Bruv, my bruvver fought a bottle of water.", phonetic: "brʌv maɪ ˈbrʌvə fɔːʔ ə ˈbɒʔl̩ əv ˈwɔːʔə", focus: "TH-fronting, glottal T", difficulty: 3 },
    { text: "'Ow about a nice cup of tea 'n a biscuit?", phonetic: "aʊ əˈbaʊʔ ə nɔɪs kʌp əv tiː n̩ ə ˈbɪskɪʔ", focus: "H-dropping, PRICE shift", difficulty: 3 },
  ],
  commonWords: [
    { word: "mate", pronunciation: "/maɪʔ/" },
    { word: "alright", pronunciation: "/ɔːˈraɪʔ/" },
    { word: "nothing", pronunciation: "/ˈnʌfɪŋ/" },
    { word: "water", pronunciation: "/ˈwɔːʔə/" },
    { word: "fought/thought", pronunciation: "/fɔːʔ/" },
  ],
  famousExamples: ["Michael Caine", "Danny Dyer", "Adele (in interviews)", "Jason Statham"],
  pitfalls: ["Don't confuse with Estuary English (Cockney is more extreme)", "Keep glottal stops varied — not every T!", "Avoid cartoon 'Dick Van Dyke' Cockney"],
};

const SOUTHERN_US: Dialect = {
  id: "southern-us",
  name: "Southern American",
  region: "Southern United States",
  flag: "US",
  difficulty: "intermediate",
  description: "Warm, drawling accent with monophthongization and vowel stretching. Heard from Atlanta to Austin.",
  signature: ["PRICE monophthong (I → Ah)", "Pin-pen merger", "Drawl (vowel extension)", "Y'all"],
  keyFeatures: [
    { title: "PRICE monophthongization", description: "The /aɪ/ diphthong flattens to /aː/. 'Time' → /taːm/, 'I' → /aː/." },
    { title: "Pin-pen merger", description: "Short E before N becomes I. 'Pen' and 'pin' sound identical: /pɪn/." },
    { title: "Drawl", description: "Single vowels stretch into two. 'Bed' → /beɪəd/, 'cat' → /kæjət/." },
    { title: "Dropped G's", description: "'-ing' endings become '-in': 'going' → /ˈgoʊɪn/, 'fixin' → /ˈfɪksɪn/." },
    { title: "R-retention (mostly)", description: "Most modern Southern is rhotic, though older Coastal Southern drops R's." },
  ],
  phonemeShifts: [
    { standard: "/aɪ/", dialect: "/aː/", example: "time → /taːm/", note: "Flatten to a long A" },
    { standard: "/ɛ/ before N", dialect: "/ɪ/", example: "pen → /pɪn/", note: "Pin-pen merger" },
    { standard: "/ɪŋ/", dialect: "/ɪn/", example: "going → /ˈgoʊɪn/", note: "G-dropping in -ing" },
    { standard: "/æ/", dialect: "/æjə/", example: "cat → /kæjət/", note: "Southern drawl (breaking)" },
  ],
  mouthPosture: "Jaw relaxed and lower. Lips generous, slow-moving. Tongue rests forward. Think slow honey.",
  prosody: {
    rhythm: "Languid, drawn-out vowels",
    intonation: "Melodic, dips and rises within words",
    stress: "Heavy stress with drawling vowel extensions",
  },
  practicePhrases: [
    { text: "I reckon I might could use a nice glass of sweet tea.", phonetic: "aː ˈrekən aː maːʔ kʊd juːz ə naːs glæs əv swiːt tiː", focus: "PRICE flattening", difficulty: 2 },
    { text: "Y'all fixin' to head down to the county fair?", phonetic: "jɔːl ˈfɪksɪn tə hed daʊn tə ðə ˈkaʊnti feːr", focus: "G-dropping, Y'all", difficulty: 1 },
    { text: "Bless your heart, that pen just won't write.", phonetic: "bles jɔːr hɑːrt ðæt pɪn dʒʌst woʊnt raːt", focus: "Pin-pen merger", difficulty: 2 },
  ],
  commonWords: [
    { word: "y'all", pronunciation: "/jɔːl/" },
    { word: "oil", pronunciation: "/ɔɪəl/ or /ɔːl/" },
    { word: "right", pronunciation: "/raːt/" },
    { word: "dinner", pronunciation: "/ˈdɪnər/" },
    { word: "ten", pronunciation: "/tɪn/" },
  ],
  famousExamples: ["Matthew McConaughey", "Reese Witherspoon", "Morgan Freeman", "Dolly Parton"],
  pitfalls: ["Don't make it a caricature — subtle is more authentic", "Southern isn't monolithic — Texas ≠ Georgia ≠ Louisiana", "Slow down your overall rhythm"],
};

const NEW_YORK: Dialect = {
  id: "new-york",
  name: "New York City",
  region: "NYC metro area",
  flag: "US",
  difficulty: "intermediate",
  description: "The iconic sound of Brooklyn, Queens, and the Bronx — nasal, assertive, with a distinctive THOUGHT vowel.",
  signature: ["Raised THOUGHT (coffee → caw-fee)", "Historical non-rhoticity", "Fronted A", "Fast rhythm"],
  keyFeatures: [
    { title: "Raised THOUGHT", description: "'Coffee', 'talk', 'dog' use a very high /ɔə/ or /oə/ vowel. 'Coffee' → /ˈkɔəfi/." },
    { title: "Split short-A", description: "Some A words raise to /eə/: 'man' → /meən/, 'bath' → /beəθ/. Others stay flat: 'cat' → /kæt/." },
    { title: "Dropped R (old-school)", description: "Classic NY drops R's: 'car' → /kɑː/, 'forget about it' → /fəˈgedəˈbaʊdɪt/." },
    { title: "Dental T/D", description: "T and D can be dental (tongue touches teeth), giving the sound a 'tuff' texture." },
    { title: "TH-stopping", description: "'This', 'that' → /dɪs/, /dæt/. 'Think' → /tɪŋk/." },
  ],
  phonemeShifts: [
    { standard: "/ɔː/", dialect: "/ʊə/", example: "coffee → /ˈkʊəfi/", note: "Raised and diphthongized" },
    { standard: "/æ/", dialect: "/eə/", example: "man → /meən/", note: "Raised before nasals, voiced stops" },
    { standard: "/ð/", dialect: "/d/", example: "this → /dɪs/", note: "TH-stopping (working class)" },
    { standard: "/ɜːr/", dialect: "/ɜɪ/", example: "bird → /bɜɪd/", note: "Old-school 'toity-toid' (largely gone)" },
  ],
  mouthPosture: "Lips forward and tight. Nasal resonance. Jaw minimal movement. Speak from the front of the face.",
  prosody: {
    rhythm: "Rapid-fire, overlapping",
    intonation: "Steep rises at phrase ends (even in statements)",
    stress: "Heavy stress on key words",
  },
  practicePhrases: [
    { text: "I'm walkin' here! Get outta the road!", phonetic: "aɪm ˈwɔəkɪn hɪə get ˈaʊɾə ðə roʊd", focus: "Raised THOUGHT", difficulty: 2 },
    { text: "Fuhgeddaboudit, you want coffee or dawg water?", phonetic: "fəgedəˈbaʊdɪʔ jə wɑnt ˈkʊəfi ɔə dʊəg ˈwɔəɾə", focus: "Classic NY vowels", difficulty: 3 },
    { text: "My cousin from Brooklyn talks like dat all the time.", phonetic: "maɪ ˈkʌzn fʁəm ˈbrʊklɪn tɔəks laɪk dæt ɔl ðə taɪm", focus: "TH-stopping", difficulty: 2 },
  ],
  commonWords: [
    { word: "coffee", pronunciation: "/ˈkʊəfi/" },
    { word: "talk", pronunciation: "/tʊək/" },
    { word: "dog", pronunciation: "/dʊəg/" },
    { word: "on", pronunciation: "/ʊən/" },
    { word: "Long Island", pronunciation: "/lɔəŋ ˈaɪlənd/ (or 'Lawn Guyland')" },
  ],
  famousExamples: ["Al Pacino", "Robert De Niro", "Fran Drescher (heightened)", "Jerry Seinfeld"],
  pitfalls: ["Modern NY is more rhotic than movies suggest", "Don't overdo 'toity-toid' — it's dated", "Italian-American NY ≠ Jewish NY ≠ Puerto Rican NY"],
};

const IRISH: Dialect = {
  id: "irish",
  name: "Irish (Dublin)",
  region: "Ireland",
  flag: "IE",
  difficulty: "advanced",
  description: "Melodic, musical accent with soft T's, TH-stopping, and distinctive diphthongs. This profile covers standard Dublin/Leinster Irish English.",
  signature: ["Melodic intonation", "Slit T's (soft T)", "TH-stopping (this → dis)", "Rhotic"],
  keyFeatures: [
    { title: "Slit T", description: "T between vowels becomes a soft fricative /t̞/ — almost like a lazy S. 'Water' → /ˈwɒt̞ər/." },
    { title: "TH-stopping", description: "'This', 'think' → /dɪs/, /tɪŋk/. Dental stops replace fricatives." },
    { title: "Raised PRICE/MOUTH", description: "'I' sounds slightly like /ɔɪ/, 'now' slightly like /nɛʊ/." },
    { title: "Full rhoticity", description: "All R's pronounced, often with a retroflex quality." },
    { title: "Sing-song intonation", description: "Wide melodic range — rises and falls within sentences give musical quality." },
  ],
  phonemeShifts: [
    { standard: "/t/", dialect: "/t̞/ (slit)", example: "butter → /ˈbʌt̞ər/", note: "Soft fricative T between vowels" },
    { standard: "/θ/", dialect: "/t/", example: "think → /tɪŋk/", note: "Dental stop" },
    { standard: "/ð/", dialect: "/d/", example: "this → /dɪs/", note: "Dental stop" },
    { standard: "/aɪ/", dialect: "/ɔɪ/", example: "night → /nɔɪt/", note: "Raised starting point" },
  ],
  mouthPosture: "Lips active and mobile. Tongue tip alert and dental-touching. Jaw bouncy. Forward placement.",
  prosody: {
    rhythm: "Lilting, musical",
    intonation: "Wide range with characteristic upward sweeps",
    stress: "Strong but varied, with pitch shifts on stressed syllables",
  },
  practicePhrases: [
    { text: "Top of the mornin' to ya, how's she cuttin'?", phonetic: "tɒp əv ðə ˈmɔːrnɪn tə jə haʊz ʃi ˈkʌt̞ɪn", focus: "Classic Irish phrasing", difficulty: 1 },
    { text: "Three thirty-three is a tricky thing to say.", phonetic: "triː ˈtɜːrti triː ɪz ə ˈtrɪki tɪŋ tə seɪ", focus: "TH-stopping", difficulty: 3 },
    { text: "I'd like a pint of the black stuff, thanks.", phonetic: "ɔɪd lɔɪk ə pɔɪnt əv ðə blæk stʌf tæŋks", focus: "Raised PRICE", difficulty: 2 },
  ],
  commonWords: [
    { word: "thirty", pronunciation: "/ˈtɜːrti/" },
    { word: "film", pronunciation: "/ˈfɪləm/ (two syllables)" },
    { word: "three", pronunciation: "/triː/" },
    { word: "tomato", pronunciation: "/təˈmɑːtoʊ/" },
  ],
  famousExamples: ["Cillian Murphy", "Saoirse Ronan", "Colin Farrell", "Brendan Gleeson"],
  pitfalls: ["Irish isn't one accent — Dublin ≠ Cork ≠ Belfast", "Don't do a 'leprechaun' — modern Irish is subtle", "Keep it musical, not sing-songy stereotype"],
};

const AUSTRALIAN: Dialect = {
  id: "australian",
  name: "Australian",
  region: "Australia (General)",
  flag: "AU",
  difficulty: "intermediate",
  description: "Laid-back, drawly, with a distinctive vowel shift. Non-rhotic like British, but with its own diphthong patterns.",
  signature: ["Raised PRICE (mate → moyt)", "Non-rhotic", "Rising intonation (HRT)", "Clipped schwa"],
  keyFeatures: [
    { title: "Raised/fronted FACE", description: "'Day', 'mate' use /æɪ/ not /eɪ/ — sounds to Americans like 'die', 'moyt'." },
    { title: "Fronted GOOSE", description: "'Too', 'moon' have lips more spread — /ʉː/ rather than /uː/." },
    { title: "Non-rhotic", description: "R dropped at word-end: 'car' → /kaː/, 'butter' → /ˈbʌtə/." },
    { title: "High Rising Terminal", description: "Statements end with upward intonation, as if asking a question?" },
    { title: "Short-I weakened", description: "'City' ends with /iː/, not /ɪ/: /ˈsɪtiː/." },
  ],
  phonemeShifts: [
    { standard: "/eɪ/", dialect: "/æɪ/", example: "mate → /mæɪt/", note: "Lowered starting point" },
    { standard: "/aɪ/", dialect: "/ɑɪ/", example: "time → /tɑɪm/", note: "Backed starting point" },
    { standard: "/uː/", dialect: "/ʉː/", example: "too → /tʉː/", note: "Fronted goose vowel" },
    { standard: "/æ/", dialect: "/e/", example: "cat → /ket/", note: "TRAP raising (Aus)" },
  ],
  mouthPosture: "Mouth barely opens — 'minimum movement' posture. Lips relaxed, lazy. Speak from the back of the mouth.",
  prosody: {
    rhythm: "Laid-back, casual",
    intonation: "Rising terminals on statements",
    stress: "Moderate, with long vowels carrying weight",
  },
  practicePhrases: [
    { text: "G'day mate, how's it goin'?", phonetic: "gəˈdæɪ mæɪt haʊz ɪt ˈgəʊɪn", focus: "Classic FACE raising", difficulty: 1 },
    { text: "I'm off to the beach for a barbie this arvo.", phonetic: "ɑɪm ɒf tə ðə biːtʃ fɔːr ə ˈbaːbi ðɪs ˈaːvəʊ", focus: "Aussie slang, non-rhotic", difficulty: 2 },
    { text: "No worries, we'll grab a tinny and watch the footy.", phonetic: "nəʊ ˈwʌriːz wiːl græb ə ˈtɪniː ən wɒtʃ ðə ˈfʊtiː", focus: "Minimal mouth movement", difficulty: 2 },
  ],
  commonWords: [
    { word: "mate", pronunciation: "/mæɪt/" },
    { word: "day", pronunciation: "/dæɪ/" },
    { word: "no", pronunciation: "/næʉ/" },
    { word: "dance", pronunciation: "/dæns/ or /daːns/" },
    { word: "Australia", pronunciation: "/əˈstræɪljə/" },
  ],
  famousExamples: ["Cate Blanchett", "Hugh Jackman", "Margot Robbie", "Chris Hemsworth"],
  pitfalls: ["Don't confuse with Kiwi (NZ has 'fush and chups')", "Avoid crocodile Dundee stereotype", "Australian is more varied than films suggest"],
};

const FRENCH_ENGLISH: Dialect = {
  id: "french-english",
  name: "French (speaking English)",
  region: "France (French speaker)",
  flag: "FR",
  difficulty: "intermediate",
  description: "Classic French accent when speaking English: uvular R's, dropped H's, and syllable-timed rhythm.",
  signature: ["Uvular R", "Dropped H", "Syllable-timed rhythm", "No TH sounds"],
  keyFeatures: [
    { title: "Uvular R", description: "R is made at the back of the throat: /ʁ/. 'Red' becomes /ʁɛd/." },
    { title: "H-dropping", description: "French has no /h/: 'happy' → /ˈæpi/, 'hello' → /əˈloʊ/." },
    { title: "TH becomes Z or S", description: "'This' → /zɪs/, 'think' → /sɪŋk/. French lacks dental fricatives." },
    { title: "Final stress", description: "French stresses final syllables, transferring to English: 'ho-TEL', 'ro-MANCE'." },
    { title: "Syllable timing", description: "Every syllable gets roughly equal weight — no reduction to schwa." },
  ],
  phonemeShifts: [
    { standard: "/r/", dialect: "/ʁ/", example: "red → /ʁɛd/", note: "Back-of-throat uvular R" },
    { standard: "/h/", dialect: "∅", example: "happy → /ˈæpi/", note: "Drop H entirely" },
    { standard: "/θ/", dialect: "/s/", example: "think → /sɪŋk/", note: "Replace with S" },
    { standard: "/ð/", dialect: "/z/", example: "this → /zɪs/", note: "Replace with Z" },
    { standard: "/ɪ/", dialect: "/i/", example: "ship → /ʃip/", note: "Tense vowel instead of lax" },
  ],
  mouthPosture: "Lips rounded and forward (French lip posture). Tongue pushed forward. Speak from the lips.",
  prosody: {
    rhythm: "Syllable-timed, even",
    intonation: "Gentle rises, final-syllable stress",
    stress: "Moved to final syllables",
  },
  practicePhrases: [
    { text: "I think this is a very beautiful day.", phonetic: "aɪ sɪŋk zɪs ɪz a ˈveʁi bjuːtiˈful deɪ", focus: "TH-replacement, uvular R", difficulty: 1 },
    { text: "Henri happily hailed a taxi at the hotel.", phonetic: "ɑ̃ˈʁi ˈæpili ˈeɪld a ˈtæksi æt zə oˈtɛl", focus: "H-dropping, final stress", difficulty: 2 },
    { text: "Zese are ze croissants I told you about.", phonetic: "ziːz ɑː zə kʁwaˈsɑ̃ aɪ tɔld juː əˈbaʊ", focus: "TH-replacement", difficulty: 1 },
  ],
  commonWords: [
    { word: "the", pronunciation: "/zə/" },
    { word: "hotel", pronunciation: "/oˈtɛl/" },
    { word: "people", pronunciation: "/ˈpipɫ/" },
    { word: "very", pronunciation: "/ˈveʁi/" },
  ],
  famousExamples: ["Inspector Clouseau (exaggerated)", "Marion Cotillard (subtle)", "Gérard Depardieu"],
  pitfalls: ["Don't go full Pepe Le Pew", "Keep it grounded — real French speakers vary wildly", "Be consistent with which sounds you transform"],
};

export const DIALECTS: Dialect[] = [
  RP_BRITISH,
  COCKNEY,
  SOUTHERN_US,
  NEW_YORK,
  IRISH,
  AUSTRALIAN,
  FRENCH_ENGLISH,
];

export interface TongueTwister {
  text: string;
  focus: string;
  difficulty: 1 | 2 | 3;
}

export const TONGUE_TWISTERS = [
  { text: "She sells seashells by the seashore.", focus: "S/SH alternation", difficulty: 1 as const },
  { text: "Red leather, yellow leather, red leather, yellow leather.", focus: "L/R discrimination", difficulty: 2 as const },
  { text: "Unique New York, unique New York.", focus: "UK/NY vowel contrast", difficulty: 2 as const },
  { text: "Peter Piper picked a peck of pickled peppers.", focus: "Plosive P articulation", difficulty: 2 as const },
  { text: "The sixth sick sheikh's sixth sheep's sick.", focus: "S/SH/TH combination", difficulty: 3 as const },
  { text: "Toy boat, toy boat, toy boat.", focus: "Diphthong shift", difficulty: 2 as const },
  { text: "Betty Botter bought some butter, but she said the butter's bitter.", focus: "B/T articulation", difficulty: 3 as const },
  { text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", focus: "W/CH discrimination", difficulty: 2 as const },
  { text: "Rubber baby buggy bumpers.", focus: "R/B alternation", difficulty: 3 as const },
  { text: "I thought a thought, but the thought I thought wasn't the thought I thought I thought.", focus: "TH articulation", difficulty: 3 as const },
];


