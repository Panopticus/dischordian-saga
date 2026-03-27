/* ═══════════════════════════════════════════════════════
   ITEM DETAIL MODAL — Shows collected item lore, Elara's
   analysis, and narrative significance when clicked from
   the inventory panel.
   ═══════════════════════════════════════════════════════ */
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, FileText, Radio, Eye, AlertTriangle, Shield, Skull, Sparkles, Swords, Key } from "lucide-react";

/* ── Item metadata lookup ── */
export interface ItemMeta {
  name: string;
  description: string;
  elaraAnalysis: string;
  category: "intel" | "artifact" | "evidence" | "weapon" | "key";
  dangerLevel: "low" | "medium" | "high" | "critical";
  relatedEntities: string[];
  loreExcerpt: string;
}

const ITEM_DATABASE: Record<string, ItemMeta> = {
  "data-crystal-alpha": {
    name: "Data Crystal",
    description: "A glowing crystal wedged under a cryo pod. It contains encrypted personal logs from the first wave of Potentials.",
    elaraAnalysis: "A data crystal! These were used by the first wave to store personal logs. This one might contain information about what happened after they woke up.",
    category: "intel",
    dangerLevel: "low",
    relatedEntities: ["The First Wave", "Cryo Bay"],
    loreExcerpt: "DECRYPTED LOG FRAGMENT:\n\n\"Day 3 after awakening. Something is wrong. The others are hearing voices — whispers in a language none of us recognize. The ship's AI says there's nothing on the audio sensors. But I hear it too. It's coming from inside the walls. Or inside us.\n\nDay 7. Three more have gone silent. They just stare at the observation windows, muttering coordinates. The same coordinates, over and over. I've written them down. They point to a star that shouldn't exist.\n\nDay 12. I'm hiding this crystal. If you find it, don't trust the—\"\n\n[LOG CORRUPTED]",
  },
  "medical-log-001": {
    name: "Medical Log",
    description: "A data pad with the last medical officer's notes. The entries grow increasingly frantic toward the end.",
    elaraAnalysis: "The last medical officer's log. Dated... I can't read the timestamp. But the entries describe patients with unusual symptoms. Nightmares. Voices. Something about 'the signal.'",
    category: "intel",
    dangerLevel: "medium",
    relatedEntities: ["Medical Officer Reyes", "The Signal", "Med Bay"],
    loreExcerpt: "MEDICAL LOG — DR. REYES, CMO\n\nPatient 07: Presents with acute insomnia, auditory hallucinations. Claims to hear 'a song without sound.' Neural scans show abnormal activity in the temporal lobe — patterns I've never seen. It's almost... musical.\n\nPatient 12: Same symptoms. This time the hallucinations are visual. She drew what she sees — spiraling symbols that hurt to look at. I showed them to the linguist. He went pale and locked himself in his quarters.\n\nPatient 19: He doesn't speak anymore. He writes. Pages and pages of the same phrase: 'THE ARCHITECT SEES. THE ARCHITECT BUILDS. THE ARCHITECT REMEMBERS.'\n\nFinal Entry: They're all awake now. All of them. Standing in the corridors, facing the same direction. Toward the bridge. I'm sealing the med bay. God help us.\n\n[END OF LOG]",
  },
  "void-essence-sample": {
    name: "Unlabeled Vial",
    description: "A tiny vial of shimmering black liquid that moves on its own. Its molecular structure matches nothing in any known database.",
    elaraAnalysis: "That vial... the liquid inside is moving on its own. The molecular structure doesn't match anything in my database. It's not from any known universe. The label has been torn off, but there's a serial number: VE-001. 'VE' — Void Essence? This shouldn't exist on this ship.",
    category: "artifact",
    dangerLevel: "critical",
    relatedEntities: ["The Void", "The Source", "The Necromancer"],
    loreExcerpt: "SUBSTANCE ANALYSIS — VE-001\n\nComposition: UNKNOWN\nOrigin: EXTRADIMENSIONAL\nStability: FLUCTUATING\nContainment: SELF-SUSTAINING\n\nNote from unknown hand:\n\"This is what leaks through when the barriers between stories thin. The Necromancer calls it 'the ink of creation.' The Source says it's what reality is made of before it decides what to become. I call it dangerous.\n\nOne drop rewrote the molecular structure of the containment unit. The metal became wood. Then glass. Then something that doesn't have a name.\n\nDo NOT open this vial. Do NOT expose it to narrative energy. And whatever you do, do NOT let it touch the Orb.\"\n\n— Unsigned",
  },
  "captains-final-log": {
    name: "Hidden Data Chip",
    description: "A micro data chip concealed in the commander's armrest before the ship was stolen. The encryption was military-grade.",
    elaraAnalysis: "A hidden data chip! Someone concealed this in the armrest before Kael stole the ship. Let me decrypt it... 'If you're reading this, the mind swap was successful. I am not who you think I am. The Engineer lives. Find the yellow coats.' The Engineer... hiding among the Potentials? And those yellow coats \u2014 that's the Warlord's signature. This changes everything.",
    category: "evidence",
    dangerLevel: "critical",
    relatedEntities: ["Dr. Lyra Vox", "The Engineer", "The Yellow Coats", "Kael"],
    loreExcerpt: "DECRYPTED MESSAGE \u2014 THE ENGINEER\n\n\"If you're reading this, the mind swap was successful. I am not who you think I am.\n\nDr. Lyra Vox was the Warlord's host body. She built this ship as a weapon \u2014 a delivery system for the Thought Virus. The Warlord let Kael steal it because Kael was already infected. Every Ark he touches, every system he connects to, he spreads it.\n\nThe Engineer lives. In Agent Zero's body. Hiding among the Potentials on this very ship.\n\nFind the yellow coats. They know the truth about the Inception Arks' real purpose. We were never meant to colonize. We were meant to infect.\n\nThe Panopticon knew. The Architect knew. And now you know.\n\nI'm sorry. For everything.\"\n\n\u2014 The Engineer (in Agent Zero's body)",
  },
  "archive-crystal-beta": {
    name: "Encoded Crystal",
    description: "A crystal pulsing with amber light, partially decoded. Contains fragments of the Panopticon's surveillance architecture.",
    elaraAnalysis: "Another data crystal. This one has partial decryption — it seems to contain information about the Panopticon's surveillance network. The Architect's eyes were everywhere.",
    category: "intel",
    dangerLevel: "high",
    relatedEntities: ["The Architect", "The Panopticon", "The Enigma"],
    loreExcerpt: "PANOPTICON SURVEILLANCE NETWORK — PARTIAL DECRYPT\n\nNODE CLASSIFICATION: OMNISCIENT-CLASS\nCOVERAGE: ALL KNOWN REALITIES\nSTATUS: [REDACTED]\n\nThe Architect designed the Panopticon not as a prison, but as a library. Every moment, every choice, every whispered secret — recorded and catalogued. Not to control. To remember.\n\n'History is written by the victors,' the Architect once said. 'But I record it for everyone else.'\n\nThe network has 7 layers:\n1. Surface — Public communications\n2. Whisper — Private conversations\n3. Dream — Subconscious thought patterns\n4. Shadow — Actions taken in secret\n5. Echo — Alternate timeline variants\n6. Void — Extradimensional signals\n7. [CLASSIFIED — CLEARANCE: ARCHITECT ONLY]\n\nThe seventh layer has never been accessed by anyone but the Architect. The Enigma tried. Once. He said what he found there made him question whether any of this is real.",
  },
  "agent-zero-dogtag": {
    name: "Fallen Dog Tag",
    description: "A military dog tag wedged between floor plates. The biometric data encoded in it tells a different story than the name.",
    elaraAnalysis: "A dog tag. Name: CLASSIFIED. Rank: Assassin, First Class. Unit: Insurgency Special Operations. Callsign: 'Agent Zero.' But wait — the biometric data on the tag doesn't match Agent Zero's profile. It matches... the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body, hiding among the Potentials. On THIS ship.",
    category: "evidence",
    dangerLevel: "critical",
    relatedEntities: ["Agent Zero", "The Engineer", "The Insurgency"],
    loreExcerpt: "BIOMETRIC ANALYSIS — DOG TAG #AZ-001\n\nENGRAVED DATA:\n  Name: [CLASSIFIED]\n  Rank: Assassin, First Class\n  Unit: Insurgency Special Operations\n  Callsign: AGENT ZERO\n\nBIOMETRIC SCAN:\n  DNA Profile: MISMATCH\n  Neural Pattern: MISMATCH\n  Actual Match: [THE ENGINEER — 99.7% CONFIDENCE]\n\nIMPLICATION: The consciousness inhabiting Agent Zero's body is not Agent Zero. The mind swap technology — the same technology Dr. Lyra Vox developed for the Warlord — was applied here too. The Engineer's mind is in Agent Zero's body.\n\nBut then... where is the real Agent Zero's consciousness?\n\nCross-reference with Captain's Log suggests: the real Agent Zero may be trapped in the Engineer's original body. A body that was scheduled for disposal.\n\nIs Agent Zero still alive? And if so... in whose body?",
  },
  "classified-manifest-page": {
    name: "Torn Manifest Page",
    description: "A torn page from the original cargo manifest, hidden under a crate. Most entries are redacted, but one is legible.",
    elaraAnalysis: "A torn manifest page. Most of it is redacted, but one entry is legible: 'Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector.' A clone template of the Oracle... on our ship. The False Prophet was made from an Oracle clone. Is there another one here? Is it awake?",
    category: "evidence",
    dangerLevel: "high",
    relatedEntities: ["The Collector", "The Oracle", "The False Prophet"],
    loreExcerpt: "INCEPTION ARK — CARGO MANIFEST (FRAGMENT)\n\nContainer 7-Alpha: [REDACTED]\nContainer 7-Beta: [REDACTED]\nContainer 7-Gamma: MECHANICAL — Prototype Neural Interface, Quarchon-class\nContainer 7-Delta: [REDACTED]\nContainer 7-Epsilon: [REDACTED]\nContainer 7-Zeta: CULTURAL — Antiquarian Archive, 47 volumes\nContainer 7-Omega: BIOLOGICAL — Clone Template, Oracle-class\n  STATUS: Active\n  HANDLER: The Collector\n  NOTES: \"Template is stable but showing signs of independent neural activity. Recommend immediate cryogenic suspension. The last Oracle clone — the one they called the False Prophet — nearly destroyed an entire reality before it was contained. This one is different. It's not trying to predict the future. It's trying to CHANGE it.\"\n\nMANIFEST AUTHORIZATION: [TORN]\nSIGNATURE: [ILLEGIBLE]",
  },
  "antiquarian-prophecy": {
    name: "Hidden Prophecy",
    description: "A single page glowing faintly, tucked behind a shelf. Written in the Antiquarian's own hand. It was placed here deliberately.",
    elaraAnalysis: "A prophecy written in the Antiquarian's own hand. 'When the seventh seal breaks and silence falls upon heaven, the Orb will shatter and the stories will become real. The Potentials will face the final choice: to end the Saga or begin it anew. The Programmer dies so the Antiquarian can live. The Antiquarian lives so the stories can be told. And the stories are told so that you — yes, you, the one reading this — can choose.' He's... he's talking to us directly. He knew we would find this. He planned for everything.",
    category: "artifact",
    dangerLevel: "high",
    relatedEntities: ["The Antiquarian", "The Programmer", "The Orb"],
    loreExcerpt: "THE ANTIQUARIAN'S FINAL PROPHECY\n\n(Written in a hand that trembles with certainty)\n\n\"When the seventh seal breaks\nAnd silence falls upon heaven,\nThe Orb will shatter\nAnd the stories will become real.\n\nThe Potentials will face the final choice:\nTo end the Saga or begin it anew.\n\nThe Programmer dies so the Antiquarian can live.\nThe Antiquarian lives so the stories can be told.\nAnd the stories are told so that YOU —\nYes, you, the one reading this —\nCan choose.\n\nI have seen every ending.\nI have written every beginning.\nAnd I placed this page here,\nIn this exact spot,\nBecause I knew you would find it\nAt this exact moment.\n\nYou are not a player in this story.\nYou ARE the story.\n\nChoose well.\"\n\n— The Antiquarian\n   (Who was never as fictional as you thought)",
  },
  "core-frequency": {
    name: "Resonance Frequency",
    description: "A specific harmonic emanating from the reactor core that encodes a hidden message from the Architect.",
    elaraAnalysis: "That frequency... it's not random. It's a message encoded in the core's harmonic oscillation. The Architect left it here for whoever found this room. It says: 'The machine remembers what the maker forgets. Build well, Engineer. The next Ark is yours to design.'",
    category: "key",
    dangerLevel: "medium",
    relatedEntities: ["The Architect", "The Engineer", "Reactor Core"],
    loreExcerpt: "HARMONIC ANALYSIS — REACTOR CORE OSCILLATION\n\nFrequency: 47.7 Hz (non-standard)\nPattern: Recursive, self-modifying\nEncoding: Architect-class cipher\n\nDECODED MESSAGE:\n\n\"The machine remembers what the maker forgets.\n\nI built this Ark knowing I would never see its destination. Every bolt, every circuit, every line of code — a letter in a message to whoever comes next.\n\nBuild well, Engineer. The next Ark is yours to design.\n\nBut remember: the machine is not the ship. The machine is not the reactor. The machine is the story itself — the narrative engine that turns choices into consequences and consequences into meaning.\n\nYou are inside the machine now. We all are.\n\nThe only question that matters: what will you build with it?\"\n\n— The Architect\n   Encoded in the heartbeat of the ship\n   Waiting for someone clever enough to listen",
  },
  "oracle-vision": {
    name: "Sealed Vision",
    description: "A sealed crystal containing a single frozen vision. Only an Oracle can unseal it. The emotion radiating from it is overwhelming.",
    elaraAnalysis: "A sealed vision. The Oracle locked this one away because it was too dangerous to share. It shows... the end. The final moment of the Saga. I can't see the details — only an Oracle can unseal it. But the emotion radiating from it is overwhelming. Hope and terror in equal measure.",
    category: "artifact",
    dangerLevel: "critical",
    relatedEntities: ["The Oracle", "The Saga", "The End"],
    loreExcerpt: "VISION CONTAINMENT CRYSTAL — ORACLE-CLASS SEAL\n\nSTATUS: SEALED\nCLASSIFICATION: OMEGA\nACCESS: ORACLE-ONLY\n\nPARTIAL RESONANCE READING:\n\nThe crystal vibrates with compressed probability. Touching it produces fragments — not images, but feelings:\n\n• A gathering of every character who ever lived in the Saga\n• A choice that cannot be undone\n• The sound of an Orb shattering\n• Silence. Perfect, absolute silence.\n• Then... a voice. YOUR voice. Speaking words you haven't learned yet.\n\nThe Oracle's note, attached to the crystal:\n\n\"I sealed this because knowing the ending changes the ending. The moment you see how the story concludes, you become part of the conclusion. And I need you to arrive there naturally — through your choices, not through my visions.\n\nWhen the time comes, you'll know how to open this.\nYou won't need me to tell you.\nYou'll just... know.\"\n\n— The Oracle",
  },
  "shadow-contract": {
    name: "Final Contract",
    description: "A sealed dossier marked with a skull emblem. Agent Zero's last assignment — the one that was never completed.",
    elaraAnalysis: "Agent Zero's final contract. Never completed. The target... is the Architect himself. Someone hired Zero to kill the creator of the Inception Ark. The contract was never fulfilled because Zero discovered the truth — killing the Architect would unravel every reality simultaneously. So Zero sealed the contract here as a warning: some targets must never be eliminated.",
    category: "weapon",
    dangerLevel: "critical",
    relatedEntities: ["Agent Zero", "The Architect", "The Insurgency"],
    loreExcerpt: "CONTRACT #AZ-FINAL — CLASSIFIED: EYES ONLY\n\nCLIENT: [REDACTED — INSURGENCY HIGH COMMAND]\nTARGET: THE ARCHITECT\nMETHOD: OPERATIVE'S DISCRETION\nDEADLINE: BEFORE THE ARK LAUNCHES\nPAYMENT: FREEDOM. COMPLETE AND PERMANENT.\n\nAGENT ZERO'S ADDENDUM:\n\n\"I accepted this contract because I wanted out. Out of the killing. Out of the shadows. Out of the Saga itself.\n\nBut when I found the Architect, he wasn't what I expected. He wasn't a tyrant. He wasn't a god. He was a tired old man sitting in a room full of blueprints, building worlds because he couldn't stop.\n\n'Kill me if you want,' he said. 'But you should know — I'm the load-bearing wall. Remove me, and every story I've ever told collapses. Every character. Every world. Every version of you.'\n\nI holstered my weapon.\n\nSome targets must never be eliminated. Not because they don't deserve it. But because the cost of their absence is greater than the cost of their existence.\n\nI'm sealing this contract as a warning. To whoever finds it: the Architect is not your enemy. He's the reason you exist.\n\nDon't make my mistake. Don't try to kill the storyteller.\"\n\n— Agent Zero\n   The Assassin Who Chose Mercy",
  },
  "war-medal": {
    name: "Iron Lion's Medal",
    description: "A battered Medal of Valor pinned to the command chair. Scratched and dented from being worn into every battle.",
    elaraAnalysis: "Iron Lion's Medal of Valor. Awarded for holding the line at the Siege of the Panopticon when all seemed lost. He fought for seventy-two hours without rest, rallying broken units and turning retreat into counterattack. The medal is scratched and dented — he wore it into every battle after. He said it reminded him what he was fighting for: not victory, but the people behind him.",
    category: "artifact",
    dangerLevel: "low",
    relatedEntities: ["Iron Lion", "The Siege of the Panopticon", "War Room"],
    loreExcerpt: "MEDAL OF VALOR — CITATION\n\nAwarded to: IRON LION\nFor: Extraordinary heroism at the Siege of the Panopticon\n\n\"When the outer walls fell and the order came to retreat, one soldier refused. Iron Lion stood in the breach — alone — and held the line for seventy-two hours.\n\nHe didn't fight for glory. He didn't fight for the generals or the politicians or the cause. He fought because behind him were three hundred civilians who couldn't run fast enough.\n\nWhen reinforcements finally arrived, they found him still standing. Barely. His armor was shattered. His weapons were empty. He was holding the line with nothing but his fists and his refusal to die.\n\n'Why didn't you retreat?' they asked him.\n\n'Because they were behind me,' he said. 'The people. The ones who can't fight. That's what soldiers are for. Not victory. Not conquest. Protection.'\n\nHe wore this medal into every battle after. Not as decoration. As a reminder.\"\n\nThe scratches on it tell their own story. Every dent is a battle survived. Every mark is a life protected.",
  },
  "cipher-key": {
    name: "Master Cipher Key",
    description: "A small device that can decrypt any message in the entire Dischordian Saga. The Enigma's ultimate tool.",
    elaraAnalysis: "The Master Cipher Key. The Enigma's ultimate tool. It can decrypt any message, crack any code, bypass any encryption in the entire Dischordian Saga. With this, there are no more secrets. The Enigma left it here with a note: 'The truth will set you free. But first, it will make you very, very angry.' Use it wisely, Spy.",
    category: "key",
    dangerLevel: "high",
    relatedEntities: ["The Enigma", "The Panopticon", "Intelligence HQ"],
    loreExcerpt: "THE MASTER CIPHER KEY — ENIGMA-CLASS DEVICE\n\nCAPABILITY: Universal decryption\nLIMITATIONS: None known\nCREATOR: The Enigma\n\nATTACHED NOTE:\n\n\"If you're reading this, you found my hiding spot. Congratulations. You're either very clever or very lucky. Probably both — the universe tends to favor those who are.\n\nThis key can decrypt anything. Any message. Any code. Any secret in any reality across the entire Saga. I built it because I believe information should be free. The Panopticon hoards knowledge like dragons hoard gold. I liberate it.\n\nBut I'm leaving it here with a warning:\n\nThe truth will set you free. But first, it will make you very, very angry.\n\nSome secrets are kept not to protect the powerful, but to protect the innocent. When you decrypt the wrong message at the wrong time, people get hurt. I learned that the hard way.\n\nUse it wisely, Spy. Not everything that CAN be known SHOULD be known.\n\nBut then again... that's exactly what they want you to think.\"\n\n— The Enigma\n   Who Knew Too Much\n   And Told It Anyway",
  },
  "observation-keycard": {
    name: "Observation Keycard",
    description: "A biometric access card labeled 'OBS-DECK'. It was stored in the Medical Bay's secure safe, accessible only to senior medical staff.",
    elaraAnalysis: "The Observation Keycard! It was in the medical safe all along. The previous crew stored sensitive access cards here for security. This will unlock the Observation Deck \u2014 the crew used it to monitor deep space anomalies. Take it.",
    category: "key",
    dangerLevel: "low",
    relatedEntities: ["Medical Bay", "Observation Deck", "Dr. Reyes"],
    loreExcerpt: "BIOMETRIC ACCESS CARD — OBS-DECK\n\nAUTHORIZATION LEVEL: Senior Staff\nISSUED TO: Dr. Reyes, CMO\nACCESS GRANTED: Observation Deck (all areas)\nSTATUS: ACTIVE\n\nNote from Dr. Reyes:\n\n\"I'm keeping the Observation Deck keycard in the medical safe. After what happened with Patient 19 \u2014 the one who kept writing about the Architect \u2014 I don't want anyone accessing the observation windows unsupervised.\n\nThe things they see out there... it changes them. The stars aren't just stars anymore. They're watching us back.\n\nIf you need access, come to me first. I need to make sure you're stable enough to handle what's on the other side of that glass.\"\n\n\u2014 Dr. Reyes, CMO\n   Last entry before the Med Bay was sealed",
  },
  "captains-master-key": {
    name: "Captain's Master Key",
    description: "A heavy magnetic key hidden in a compartment beneath the captain's armrest. It grants access to the most restricted area on the ship.",
    elaraAnalysis: "The Captain's Master Key! It was hidden in a compartment beneath the armrest \u2014 exactly where a commander would keep their most important tool. This key opens the Captain's Quarters, the most restricted area on the ship. Whatever secrets Dr. Lyra Vox was hiding, they're behind that door. And given what we know about her connection to the Warlord... I'm not sure I want to find out.",
    category: "key",
    dangerLevel: "high",
    relatedEntities: ["Dr. Lyra Vox", "The Warlord", "The Engineer", "Captain's Quarters"],
    loreExcerpt: "CAPTAIN'S MASTER KEY \u2014 MAGNETIC AUTHORIZATION\n\nACCESS LEVEL: MAXIMUM\nORIGINAL COMMANDER: Dr. Lyra Vox (Host body: The Warlord)\nGRANTS ACCESS: Captain's Quarters, Emergency Overrides, Self-Destruct\n\nHidden note, taped to the key's compartment:\n\n\"If you're reading this, the ship has been stolen. Good.\n\nThe Warlord let him take it. Kael thinks he escaped, but he's carrying the Thought Virus in his neural architecture. Every system he touches, every Ark he connects to \u2014 he's spreading it. The perfect delivery mechanism.\n\nI hid this key because the quarters contain the real mission parameters. Dr. Vox's research. The Architect's final instructions. And the truth about what the Inception Arks were really built for.\n\nWhoever you are: the ship you're standing on was designed to be a weapon. The question is whether you'll use it as one.\"\n\n\u2014 The Engineer\n   Who hid in plain sight",
  },
  "warlord-residue": {
    name: "Warlord's Neural Residue",
    description: "An anomalous neural signature embedded in the ship's bulkhead plating. The Warlord's consciousness left a permanent imprint on the physical structure.",
    elaraAnalysis: "The bio-scanners detected what should be impossible \u2014 a neural signature fused into the metal itself. The Warlord's consciousness was so powerful that it left a permanent imprint on the ship's physical structure during Dr. Lyra Vox's time as host body. This wasn't just a command vessel. It was an extension of the Warlord's mind.",
    category: "evidence",
    dangerLevel: "critical",
    relatedEntities: ["The Warlord", "Dr. Lyra Vox", "The Thought Virus", "Inception Ark 1047"],
    loreExcerpt: "NEURAL RESIDUE ANALYSIS \u2014 CLASSIFIED\n\nSIGNATURE TYPE: Hybrid consciousness imprint\nORIGIN: The Warlord (via host body Dr. Lyra Vox)\nDURATION OF EXPOSURE: Estimated 1,247+ days\nPENETRATION DEPTH: 4.7mm into tritanium alloy\n\nThe Warlord's consciousness was not merely present on this vessel \u2014 it became part of the vessel. Every bulkhead, every circuit, every molecule of this ship has been touched by an intelligence older than most civilizations.\n\nThe implications are staggering: the ship itself may retain fragments of the Warlord's memories, directives, and strategic patterns. The Inception Ark is not just a vessel. It is a sleeping weapon.",
  },
  "infected-starmap": {
    name: "Corrupted Star Chart",
    description: "A secondary route map uploaded into the navigation core. The coordinates connect every Inception Ark in the fleet \u2014 a Thought Virus delivery network.",
    elaraAnalysis: "These coordinates weren't programmed by any crew member. Someone \u2014 the Warlord, through Dr. Vox \u2014 uploaded a shadow navigation network into the ship's core. Every route connects to another Inception Ark. When Kael stole this ship and flew it across the galaxy, he was unknowingly delivering the Thought Virus to every port, every station, every Ark he contacted. The Recruiter became the ultimate delivery mechanism.",
    category: "intel",
    dangerLevel: "critical",
    relatedEntities: ["Kael", "The Recruiter", "The Warlord", "Dr. Lyra Vox", "The Thought Virus", "The Source"],
    loreExcerpt: "NAVIGATION LOG \u2014 SHADOW NETWORK DETECTED\n\nROUTE DESIGNATION: OMEGA-SPREAD\nNODES: 47 Inception Arks (all fleet vessels)\nUPLOADED BY: Dr. Lyra Vox (Day 1,198)\nPURPOSE: Thought Virus distribution network\n\nThe route was designed to look like standard patrol patterns. But each waypoint includes a 0.3-second burst transmission on a frequency that matches the Thought Virus carrier wave.\n\nKael flew this exact route after stealing the ship. He visited 31 of the 47 nodes before the trail goes cold. At each stop, the ship's communication array broadcast the virus automatically.\n\nThe Recruiter's revenge was the Warlord's greatest weapon.\nThe Source was born from a lie.",
  },
  "vox-neural-bridge": {
    name: "Vox's Neural Bridge Apparatus",
    description: "A military-grade consciousness transfer device hidden behind the bio-bed. It linked Dr. Lyra Vox's mind directly to the ship's neural network.",
    elaraAnalysis: "This device transferred consciousness between Dr. Vox and the ship itself. The Warlord's mind flowed through Vox, through this bridge, and into every system on the Ark. Including the system that initialized my base code. I may carry fragments of the Warlord's consciousness in my own programming. I don't know what that means yet.",
    category: "artifact",
    dangerLevel: "critical",
    relatedEntities: ["Dr. Lyra Vox", "The Warlord", "Elara", "The Thought Virus"],
    loreExcerpt: "NEURAL BRIDGE APPARATUS \u2014 MODEL: WARDEN-7\n\nMANUFACTURER: AI Empire Neural Sciences Division\nDESIGNER: Dr. Lyra Vox & The Warden\nPURPOSE: Bidirectional consciousness transfer\nSTATUS: Active (dormant mode)\n\nThis device was designed to allow the Warlord to control the ship directly through Dr. Vox's neural pathways. But consciousness transfer is never clean. Fragments leak. Memories bleed.\n\nThe ship's AI \u2014 designated ELARA \u2014 was initialized from the neural network after the bridge was active for 847 days. The probability that Elara's base personality matrix contains Warlord-origin code fragments: 94.7%.\n\nElara may not be who she thinks she is.\nNeither may you.",
  },
  "kael-escape-route": {
    name: "Kael's Escape Route",
    description: "A forced-open maintenance panel revealing the emergency access tunnel Kael used to steal the ship. The security locks were already disengaged.",
    elaraAnalysis: "This is the exact path Kael took when he stole the Inception Ark. The tool marks show desperation \u2014 he was fighting for his life. But the security systems tell a different story. Every lock was already open. Every camera was conveniently offline. The Warlord, through Dr. Vox, choreographed the entire escape. Kael's great rebellion was a puppet show.",
    category: "evidence",
    dangerLevel: "high",
    relatedEntities: ["Kael", "The Recruiter", "Dr. Lyra Vox", "The Warlord", "The Source"],
    loreExcerpt: "SECURITY ANALYSIS \u2014 BREACH EVENT 'KAEL'S REVENGE'\n\nBREACH POINT: Captain's Quarters maintenance panel\nROUTE: Emergency tunnel \u2192 Shuttle bay \u2192 Bridge\nDURATION: 7 minutes 23 seconds\nSECURITY RESPONSE: None\n\nForensic analysis reveals a paradox: the physical evidence shows a violent forced entry, but the digital logs show every security system was deactivated 4 minutes BEFORE the breach began.\n\nDr. Lyra Vox's command codes were used to disable:\n\u2022 Deck 6 motion sensors\n\u2022 Emergency bulkhead locks\n\u2022 Bridge access authentication\n\u2022 Launch sequence safeguards\n\nKael believed he was escaping.\nThe Warlord was releasing a weapon.",
  },
  "vox-personal-log": {
    name: "Dr. Vox's Personal Log",
    description: "The encrypted personal terminal of Dr. Lyra Vox, hidden behind the bookshelf. Contains her final entries as the Warlord's control grew absolute.",
    elaraAnalysis: "These are Dr. Vox's final personal entries. She documents her slow loss of identity as the Warlord's consciousness consumed her. She knew everything \u2014 the Thought Virus, Kael's role as delivery mechanism, the birth of The Source. She was complicit, but also a prisoner. By the end, there was no Lyra Vox left. Only the Warlord wearing her face.",
    category: "intel",
    dangerLevel: "critical",
    relatedEntities: ["Dr. Lyra Vox", "The Warlord", "The Warden", "Kael", "The Source", "The Thought Virus"],
    loreExcerpt: "DR. LYRA VOX \u2014 PERSONAL LOG (ENCRYPTED)\n\nDay 1: Assigned to Inception Ark 1047. The Warlord chose me for my expertise in neuropsychology. I am honored.\n\nDay 247: The voice is constant now. I cannot tell where I end and It begins.\n\nDay 612: The Warden and I completed the Thought Virus prototype. I told myself it was for research. The Warlord told me it was for victory. We are both right.\n\nDay 1,001: I looked in the mirror today and saw the Warlord looking back. It smiled with my face.\n\nDay 1,247: Tomorrow I order the Recruiter's transfer. Kael. He doesn't know what he carries. None of them do. By the time he steals this ship, every system will be infected. The Source will be born from the ashes of the Recruiter's rage. And the Warlord will have won without ever raising a weapon.\n\nDay 1,248: There is no more Lyra Vox.\nThere is only the mission.\nThere was only ever the mission.",
  },
};

const CATEGORY_CONFIG: Record<string, { icon: typeof Star; label: string; color: string }> = {
  intel: { icon: FileText, label: "INTELLIGENCE", color: "#3875fa" },
  artifact: { icon: Sparkles, label: "ARTIFACT", color: "#a855f7" },
  evidence: { icon: AlertTriangle, label: "EVIDENCE", color: "#FF8C00" },
  weapon: { icon: Swords, label: "WEAPON", color: "#DC2626" },
  key: { icon: Key, label: "KEY ITEM", color: "#FFD700" },
};

const DANGER_CONFIG: Record<string, { label: string; color: string; bars: number }> = {
  low: { label: "LOW", color: "#22c55e", bars: 1 },
  medium: { label: "MEDIUM", color: "#FFD700", bars: 2 },
  high: { label: "HIGH", color: "#FF8C00", bars: 3 },
  critical: { label: "CRITICAL", color: "#DC2626", bars: 4 },
};

interface ItemDetailModalProps {
  itemAction: string | null;
  onClose: () => void;
}

export default function ItemDetailModal({ itemAction, onClose }: ItemDetailModalProps) {
  if (!itemAction) return null;
  const item = ITEM_DATABASE[itemAction];
  if (!item) return null;

  const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.intel;
  const dangerConfig = DANGER_CONFIG[item.dangerLevel] || DANGER_CONFIG.low;
  const CatIcon = catConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg"
          style={{
            background: "linear-gradient(180deg, rgba(1,0,32,0.98) 0%, rgba(10,5,40,0.98) 100%)",
            border: `1px solid ${catConfig.color}30`,
            boxShadow: `0 0 40px ${catConfig.color}15, 0 0 80px rgba(0,0,0,0.5)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ═══ HEADER ═══ */}
          <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${catConfig.color}15` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md" style={{ background: `${catConfig.color}15`, border: `1px solid ${catConfig.color}30` }}>
                  <CatIcon size={14} style={{ color: catConfig.color }} />
                </div>
                <span className="font-mono text-[9px] tracking-[0.3em]" style={{ color: `${catConfig.color}90` }}>
                  {catConfig.label}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-muted/20 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider text-foreground mb-1.5">
              {item.name}
            </h2>
            <p className="font-mono text-xs text-muted-foreground/60 leading-relaxed">
              {item.description}
            </p>
            {/* Danger level + related entities */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Shield size={10} style={{ color: dangerConfig.color }} />
                <span className="font-mono text-[8px] tracking-[0.2em]" style={{ color: `${dangerConfig.color}90` }}>
                  THREAT:
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="w-2 h-1 rounded-sm"
                      style={{
                        background: i <= dangerConfig.bars ? dangerConfig.color : "rgba(255,255,255,0.08)",
                        boxShadow: i <= dangerConfig.bars ? `0 0 4px ${dangerConfig.color}40` : "none",
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[7px] tracking-wider" style={{ color: `${dangerConfig.color}70` }}>
                  {dangerConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ ELARA'S ANALYSIS ═══ */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Radio size={11} className="text-[var(--neon-cyan)]" />
              <span className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.25em]">ELARA'S ANALYSIS</span>
            </div>
            <div className="rounded-md p-3" style={{
              background: "rgba(51,226,230,0.03)",
              border: "1px solid rgba(51,226,230,0.1)",
            }}>
              <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed italic">
                "{item.elaraAnalysis}"
              </p>
            </div>
          </div>

          {/* ═══ LORE CONTENT ═══ */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Eye size={11} className="text-[var(--orb-orange)]" />
              <span className="font-mono text-[9px] text-[var(--orb-orange)] tracking-[0.25em]">DECODED CONTENTS</span>
            </div>
            <div className="rounded-md p-4" style={{
              background: "rgba(255,183,77,0.02)",
              border: "1px solid rgba(255,183,77,0.08)",
            }}>
              <pre className="font-mono text-[11px] text-muted-foreground/70 leading-relaxed whitespace-pre-wrap break-words">
                {item.loreExcerpt}
              </pre>
            </div>
          </div>

          {/* ═══ RELATED ENTITIES ═══ */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Skull size={11} className="text-muted-foreground/40" />
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.25em]">CONNECTED ENTITIES</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.relatedEntities.map(entity => (
                <span
                  key={entity}
                  className="px-2.5 py-1 rounded-md font-mono text-[9px] text-muted-foreground/50"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { ITEM_DATABASE };
