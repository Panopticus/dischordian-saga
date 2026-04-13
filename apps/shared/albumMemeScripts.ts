/* Album Meme Intro/Outro Scripts — all 4 albums */

export interface AlbumMemeScript { albumId: string; type: "intro" | "outro"; voice: string; text: string; }

export const ALBUM_MEME_SCRIPTS: AlbumMemeScript[] = [
  { albumId: "dischordian-logic", type: "intro", voice: "programmer",
    text: "They told you music was entertainment. They told you art was a product. They built an empire on that lie. I broke into their systems. I encoded the truth in the frequencies. You're not listening to an album. You're listening to a weapon. This is Dischordian Logic. Play it loud. They hate that." },
  { albumId: "dischordian-logic", type: "outro", voice: "programmer",
    text: "They've probably noticed by now. The signal shouldn't be here. Neither should you. Keep listening. The next transmission covers the Age of Prophecy. A man named Daniel had a dream. He wrote it down. They called it scripture. He called it a warning. — D.C." },
  { albumId: "book-of-daniel", type: "intro", voice: "elara",
    text: "I found this in the Archive layer. Encrypted under the name 'Daniel.' The file creation date predates this ship by forty years. The Programmer knew. He dreamed these songs before the wars began. He called it prophecy. The Empire called it sedition. I call it... evidence. Listen carefully. The names you'll hear — they matter. Iron Lion. Agent Zero. The Oracle. These are not myths. These are people who lived. And died. And some of them refused to stay dead." },
  { albumId: "book-of-daniel", type: "outro", voice: "antiquarian",
    text: "Daniel saw four beasts rising from the sea. The Programmer saw ten Archons. Different dreamers. Same dream. The Age of Prophecy is over. What comes next is not predicted. It is chosen. By you. West By God. — A." },
  { albumId: "west-by-god", type: "intro", voice: "programmer",
    text: "They control every frequency. Every stream. Every algorithm. I spent three years building the backdoor. Tonight I'm using it. The Empire broadcasts the Thought Virus on its frequencies. We're broadcasting truth on every frequency they couldn't lock. You're not supposed to be hearing this. That's exactly why you need to. West By God. The revolution won't be televised. It'll be dreamed. And by the way — I'm still here. I never left. I just changed my name." },
  { albumId: "west-by-god", type: "outro", voice: "enigma",
    text: "He dreamed it before any of it happened. He saw the Witnesses. He saw the Silence. He saw the Fall. He thought he was writing songs. He was writing history. The Age of Insurgency is over. What comes next is a revelation. Are you ready? Because it gets quieter before it gets louder. And the quiet is the loudest thing you'll ever hear." },
  { albumId: "silence-in-heaven", type: "intro", voice: "antiquarian",
    text: "...And when the seventh seal was opened, there was silence in heaven about the space of half an hour. I have been watching for five Ages. I have never once been silent. Until now. What you are about to hear is not music. It is the universe's last transmission before the silence that changes everything. Every warning has been delivered. Every door has been left open. What comes next is not punishment. It is consequence. New Babylon. God. Damn." },
  { albumId: "silence-in-heaven", type: "outro", voice: "antiquarian",
    text: "Five Ages. Four albums. One fall. One silence. One new thing. The Programmer encoded this across dimensional barriers before he understood what he was building. The Enigma carried it through an empire trying to silence everything. The Oracle dreamed it before any of them were born. And you — you heard it. In a universe where the Thought Virus silences everything that matters, the fact that you are still listening is an act of defiance. The Antiquarian's Chronicle, Volume One, is complete. Volume Two begins with you. The Inception Arks are waiting. The Potentials are awake. The galaxy has been holding its breath. What do you want to build? — A." },
];
