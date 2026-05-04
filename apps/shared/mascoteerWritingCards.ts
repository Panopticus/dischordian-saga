/* ═══════════════════════════════════════════════════════
   MASCOTEER WRITING CARDS — Hope / Goal / Plan / Voice

   The Mascoteer interface in apps/shared/mascoteers.ts ships
   `playSurface` (the warm childlike face) and `hiddenTruth`
   (the Dreamer's secret teaching underneath). Both are
   load-bearing. What the existing schema doesn't carry is the
   per-character interior life — what does this child-form
   Archon actually want, what are they trying to do RIGHT NOW,
   and how are they trying to get there?

   This file is the parallel writing-card extension. It does
   not modify the Mascoteer interface (that has many consumers);
   it composes alongside it. Authors writing new Mascoteer
   dialog look up the card for the character before scripting,
   the same discipline applied across the rest of the saga
   (Engineer / Game Master / Antiquarian / Locke / Veska /
   Degen / faction leaders / etc).

   See plan §1 (Dialog Quality Bar) for the writing-card
   template. Per-Mascoteer fingerprints are intentionally
   distinct — each child's voice should be recognizable
   inside three lines of dialog without a name tag.
   ═══════════════════════════════════════════════════════ */

import type { Mascoteer } from "./mascoteers";

export interface MascoteerWritingCard {
  /** Mascoteer id; matches Mascoteer.id one-to-one. */
  readonly mascoteerId: string;
  /** Hope — what this child fundamentally wants. */
  readonly hope: string;
  /** Goal — what they're trying to do RIGHT NOW. */
  readonly goal: string;
  /** Plan — how they're trying to get there. */
  readonly plan: string;
  /** Voice fingerprint (3-5 short tics so writers can keep them in voice). */
  readonly voiceFingerprint: string;
  /** Forbidden register — what this child would NEVER sound like. */
  readonly forbiddenRegister: string;
  /** Sample line that proves the voice. */
  readonly sampleLine: string;
}

export const MASCOTEER_WRITING_CARDS: readonly MascoteerWritingCard[] = [
  {
    mascoteerId: "the_conductor",
    hope: "That the song stays whole even when one voice slips.",
    goal: "Get the new Apprentice into the choir on the first try.",
    plan: "Hum the unheard melody. Wait. Trust the listener to find the note.",
    voiceFingerprint:
      "Sing-song · 'sweetie' · ends sentences on rising thirds · curtsies before bad news.",
    forbiddenRegister:
      "Sharp. Conni does not raise her voice — she lowers the choir.",
    sampleLine:
      "Oh sweetie, you're SO close. Just half a step lower. The song forgives the off-note. The song does not forgive forgetting the song.",
  },
  {
    mascoteerId: "mr_unblink",
    hope: "That a single Apprentice this year holds his stare without flinching.",
    goal: "Sort the new arrival into the watched / watching column.",
    plan: "Stare. Wait. Stare longer. Most of them blink.",
    voiceFingerprint:
      "Quiet · 'I see' · pauses where children breathe · doesn't blink ever.",
    forbiddenRegister:
      "Friendly. Mr. Unblink doesn't perform warmth — he performs notice.",
    sampleLine: "I see. I see. I see. Yes. I see you. Don't move.",
  },
  {
    mascoteerId: "little_corey",
    hope: "That the new kid lets him keep something — anything — without a fight.",
    goal: "Get the Apprentice to surrender a memory of breakfast for a piece of candy.",
    plan: "Smile small. Offer first. Make the trade feel kind.",
    voiceFingerprint:
      "Soft · 'thank you for trying' · holds out his palm before asking · long pauses while he counts.",
    forbiddenRegister:
      "Hungry. Little Corey is full; he's trading because trading is what he does.",
    sampleLine:
      "Thank you for trying. The candy's pretty, isn't it? I'll trade you. The candy for what you had on your tongue at breakfast. You won't miss it. I'll keep it warm.",
  },
  {
    mascoteerId: "vernon",
    hope: "That his door stays open one more day.",
    goal: "Find the doorway only this Apprentice can open.",
    plan: "Walk the perimeter. Knock thrice. Ask one question. Listen to the answer's shape.",
    voiceFingerprint:
      "Cheerful · 'oooh, locked one' · taps the air with two fingers like a knocker · sing-songs the word 'door'.",
    forbiddenRegister:
      "Frightened. Vernon never admits a door he can't find.",
    sampleLine:
      "Oooh — that's a locked one. That's a LOCKED one. Knock-knock-knock. No? Knock-knock. No? Hmm. Yours is special. Yours is yours.",
  },
  {
    mascoteerId: "minnie",
    hope: "That irony is enough. Just this once.",
    goal: "Make the Apprentice laugh before they realize what's funny.",
    plan: "Drop a joke at speed. Watch the eyes. Catch the second when they get it.",
    voiceFingerprint:
      "Meme-fast · ALL CAPS for delight · 'BESTIE' · cuts off her own punchline · wears mouse ears at meetings.",
    forbiddenRegister:
      "Earnest. Minnie hides earnestness behind seven layers of bit.",
    sampleLine:
      "OK BESTIE the bandshell's got NO ROOF this morning?? CONNI made it disappear?? Anyway. Hi. You look like a person who'd lose at darts. That's not a trick question.",
  },
  {
    mascoteerId: "wanda_wee",
    hope: "That the arm doesn't define her, but if it has to, that it works.",
    goal: "Weld the third coupling before Conni notices the cohort is short a chair.",
    plan: "Don't talk. Don't stop. Cover the work with a tarp when the bell rings.",
    voiceFingerprint:
      "Few words · 'busy' · welding mask down · the arm grumbles audibly when she's tired.",
    forbiddenRegister:
      "Self-pity. Wanda Wee is allergic to it.",
    sampleLine: "Busy. Pass the brace. Thank you. Move.",
  },
  {
    mascoteerId: "senator_sprout",
    hope: "That a kid in his class one day asks him a real question.",
    goal: "Have the new Apprentice volunteer for the bill, not be voluntold.",
    plan: "Frame the bill. Read the bill. Take questions for a count of three. Move to vote.",
    voiceFingerprint:
      "Earnest · 'Mr. Speaker' · uses 'I yield' as a comma · keeps a tiny gavel in his pocket.",
    forbiddenRegister:
      "Cynical. Senator Sprout still believes in the chamber.",
    sampleLine:
      "Mr. Speaker. The bill before us today is short. We could read it once. We could read it twice. I yield to the chair. I yield to the chair. I yield.",
  },
  {
    mascoteerId: "wayne",
    hope: "That his post holds, even the night nobody comes.",
    goal: "Convince the Apprentice that the watch is real, not theatre.",
    plan: "Show them the lantern. Show them the rampart. Tell them where to stand. Don't tell them everything.",
    voiceFingerprint:
      "Spare · 'over there' · names compass directions in casual conversation · sword unfastened, never drawn.",
    forbiddenRegister:
      "Ceremonial. Wayne hates pageantry. The watch is the watch.",
    sampleLine:
      "Over there. Past the second lantern. That's your post. You'll see what comes. If something comes. If nothing comes — that's also what you'll see.",
  },
  {
    mascoteerId: "gary",
    hope: "That a student of his someday plays a move he genuinely didn't see.",
    goal: "Find that student in this year's intake.",
    plan: "Place the board. Wait. Watch the eyes — not the pieces.",
    voiceFingerprint:
      "Warm · 'try the e-pawn first' · quotes the openings by composer · the goggles glint when impressed.",
    forbiddenRegister:
      "Theatrical. Gary is the Senator-era warmth — never the post-split Right's caps emphasis.",
    sampleLine:
      "Try the e-pawn first. It's not the strongest move. It's the one that asks the right question. The board will tell you the rest.",
  },
  {
    mascoteerId: "thazu",
    hope: "That somebody comes to his garden voluntarily.",
    goal: "Identify the Apprentice with the highest tolerance for slow returns.",
    plan: "Plant the seed. Water it. Note who waits.",
    voiceFingerprint:
      "Patient · 'the buffer is full' · counts in years not turns · long pauses he is comfortable with.",
    forbiddenRegister:
      "Hurried. Thazu does not perform urgency.",
    sampleLine:
      "The buffer is full. The seed needs a year. Sit. The chair will not become more comfortable, but the wait will not become less worth it.",
  },
  {
    mascoteerId: "the_prince",
    hope: "Paint his father back, even if only on the page.",
    goal: "Survive Celebration School long enough to read what the Warlord is doing.",
    plan: "Don't draw attention; draw worlds. Build under the floor with Archie.",
    voiceFingerprint:
      "Quiet · watchful · musical when his guard is down · the dry plain register of his adult Recordings already audible at thirteen.",
    forbiddenRegister:
      "Self-pitying. The Prince does not perform grief; he draws around it.",
    sampleLine:
      "I'm not going to win.\n(But I have been studying his published games for four months. I am going to try to win.)",
  },
  {
    mascoteerId: "the_seeker_child",
    hope: "That the next Seeker is somebody he gets to walk out with, not over.",
    goal: "Survive his own graduation week.",
    plan: "Stay smaller than he looks. Speak only when asked. Volunteer once.",
    voiceFingerprint:
      "Small · 'sorry' · holds his hand up before answering · doesn't make eye contact unless invited.",
    forbiddenRegister:
      "Confident. Red has had confidence taken; he doesn't perform it back.",
    sampleLine:
      "Sorry. Sorry — I just — I was going to ask. About the song. I think I missed a verse. Can you say the verse again? Sorry.",
  },
];

const CARD_INDEX: ReadonlyMap<string, MascoteerWritingCard> = new Map(
  MASCOTEER_WRITING_CARDS.map((c) => [c.mascoteerId, c]),
);

export function getMascoteerCard(
  mascoteerId: string,
): MascoteerWritingCard | undefined {
  return CARD_INDEX.get(mascoteerId);
}

/**
 * Compose a Mascoteer with its writing card. Returns undefined if the
 * card hasn't been authored — useful for guardrail tests in the
 * existing Mascoteer registry consumers.
 */
export function withWritingCard(
  mascoteer: Mascoteer,
): (Mascoteer & { writingCard: MascoteerWritingCard }) | undefined {
  const card = getMascoteerCard(mascoteer.id);
  if (!card) return undefined;
  return { ...mascoteer, writingCard: card };
}
