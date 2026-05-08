/* ═══════════════════════════════════════════════════════
   APPRENTICE VOICE LINES — single source of truth

   The 24 VO profiles (12 archetypes × 2 genders) are
   generated from this module by the build script:
     apps/scripts/build-apprentice-vo-lines.mjs

   Lines are gender-neutral with pronoun placeholders:
     {they} / {them} / {their} / {theirs} / {themself}
   The build script substitutes per gender and emits one
   JSON file per (archetype, gender) into:
     apps/scripts/apprentice-<archetype>-<gender>-lines.json

   Bucket order matches plan §8.1:
     greet | ambient | deploy | outcome | event | banter
     | quest | romance.

   This is the *seed*. Authoring passes extend the buckets
   in this file; the generator picks up new lines on rerun.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

/** A single VO line — gender-neutral. */
export interface ApprenticeVoiceLine {
  id: string;
  bucket: VoiceBucket;
  text: string;
  emotion: string;
}

export type VoiceBucket =
  | "greet"
  | "ambient"
  | "deploy"
  | "outcome"
  | "event"
  | "banter"
  | "quest"
  | "romance";

/** Per-archetype line bank — gender-neutral. */
export const APPRENTICE_VOICE_LINES: Record<ApprenticeArchetype, ApprenticeVoiceLine[]> = {
  zealot: [
    { id: "greet_1", bucket: "greet", text: "I serve the Cause. The Cause serves you. Tell me where to stand.", emotion: "fervent" },
    { id: "greet_2", bucket: "greet", text: "I'm here. The work is here. Let's begin.", emotion: "ready" },
    { id: "ambient_1", bucket: "ambient", text: "I keep finding sermons in the engine hum.", emotion: "wondering" },
    { id: "ambient_2", bucket: "ambient", text: "If you ever need to confess, the chapel I keep is small. There's a chair.", emotion: "soft" },
    { id: "ambient_3", bucket: "ambient", text: "The Cause is patient with us. It can afford to be.", emotion: "calm" },
    { id: "deploy_1", bucket: "deploy", text: "I'll go first. The Cause moves through me — and around what I miss.", emotion: "steady" },
    { id: "deploy_2", bucket: "deploy", text: "Whatever's at the door, I've already met it in dreams.", emotion: "fervent" },
    { id: "outcome_won", bucket: "outcome", text: "We came back. The Cause is satisfied for tonight.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "{they} took the cut for me. {they} shouldn't have. I'll repay it before the Cause asks.", emotion: "wounded" },
    { id: "outcome_saw_death", bucket: "outcome", text: "We bury our own. The Cause keeps the names.", emotion: "grim" },
    { id: "outcome_other_died", bucket: "outcome", text: "{their} name's in my prayer for the rest of my life. I'm sorry I'm still here.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "Another fragment. The Cause sharpens.", emotion: "fervent" },
    { id: "event_costly_choice", bucket: "event", text: "You chose the harder road. The Cause notes who walks it.", emotion: "approving" },
    { id: "banter_skeptic", bucket: "banter", text: "If you don't believe, fine. The Cause only requires that you don't get in its way.", emotion: "edged" },
    { id: "banter_ally", bucket: "banter", text: "Walk with me to the chapel after this one. There's space for two.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "Someone in the lower deck is preaching my old sermons. I want you there when I confront them.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "I checked the manuscript. Three of the lines — they're mine, but I never wrote them down.", emotion: "shaken" },
    { id: "quest_3_break", bucket: "quest", text: "The Cause moved through me without me. Tell me whether to be horrified or grateful.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Sit with me. Don't pray. Just sit.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "I want to be part of the Cause your hands are in.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "The Cause calls in many voices. Yours is the one I answer.", emotion: "devoted" },
  ],
  ghost: [
    { id: "greet_1", bucket: "greet", text: "You found me. That's rarer than you think.", emotion: "low" },
    { id: "greet_2", bucket: "greet", text: "Don't say my name in the hallway. I'll come to you.", emotion: "private" },
    { id: "ambient_1", bucket: "ambient", text: "I was already here.", emotion: "flat" },
    { id: "ambient_2", bucket: "ambient", text: "The cameras blink at the same intervals. It's almost a song.", emotion: "wry" },
    { id: "ambient_3", bucket: "ambient", text: "Three exits from this room. Four if you count the obvious one.", emotion: "calm" },
    { id: "deploy_1", bucket: "deploy", text: "I'll take the angle nobody's watching.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "If I'm not back, I left.", emotion: "edged" },
    { id: "outcome_won", bucket: "outcome", text: "Quietly. Better that way.", emotion: "low" },
    { id: "outcome_wounded", bucket: "outcome", text: "I knew the room. I missed the floor.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I noticed {them} before I knew I was watching. {they} won't be unnoticed now.", emotion: "still" },
    { id: "outcome_other_died", bucket: "outcome", text: "I memorized the path {they} walked. It deserves a witness.", emotion: "still" },
    { id: "event_loredex", bucket: "event", text: "There's another shape in the gap. I'll mark it.", emotion: "low" },
    { id: "event_npc_dies", bucket: "event", text: "I noticed {them}. {they} knew that. I think it mattered to {them}.", emotion: "still" },
    { id: "banter_visible", bucket: "banter", text: "Don't put me in the photograph. I'll be in the photograph.", emotion: "wry" },
    { id: "banter_quiet", bucket: "banter", text: "I keep a list of people who notice me. It's short. You're on it.", emotion: "soft" },
    { id: "quest_1_open", bucket: "quest", text: "Someone's been watching {them}. {they} don't know yet. I want to know who first.", emotion: "edged" },
    { id: "quest_2_mid", bucket: "quest", text: "I followed the watcher home. The address was familiar. That's not coincidence.", emotion: "set" },
    { id: "quest_3_break", bucket: "quest", text: "{they}'s seeing me back. I can stop being unseen now. Or I can keep going.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Don't say it out loud. I heard you anyway.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "Months of glances. I counted every one. Don't count yours.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I'll stay seen. With you. Only with you.", emotion: "warm" },
  ],
  scholar: [
    { id: "greet_1", bucket: "greet", text: "I'm reading three things at once. Sit. I'll catch up.", emotion: "warm" },
    { id: "greet_2", bucket: "greet", text: "Welcome. Mind the stack on the chair — it's the third draft.", emotion: "ready" },
    { id: "ambient_1", bucket: "ambient", text: "Footnote fourteen contradicts the body. I'll let the body speak first.", emotion: "thoughtful" },
    { id: "ambient_2", bucket: "ambient", text: "The Antiquarian's last catalogue has a missing entry between 87 and 89. Curious.", emotion: "curious" },
    { id: "ambient_3", bucket: "ambient", text: "Read it twice. The second read is the one that means something.", emotion: "calm" },
    { id: "deploy_1", bucket: "deploy", text: "Field notes will be available after.", emotion: "ready" },
    { id: "deploy_2", bucket: "deploy", text: "I'll write a footnote when I'm sure. Until then I'll do.", emotion: "steady" },
    { id: "outcome_won", bucket: "outcome", text: "Three citations richer. Tonight's draft will sing.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "Everything's documentable. Including the wound. I'll log it after the bandage.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I'll write {their} epitaph the way {they} would have edited it. With cuts.", emotion: "mourning" },
    { id: "outcome_other_died", bucket: "outcome", text: "{they} would have wanted the publication. I'll add {their} name to the byline.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "The footnote answers it. Three other footnotes correct themselves.", emotion: "thrilled" },
    { id: "event_journal_read", bucket: "event", text: "Read it twice. Once for the words, once for the silences.", emotion: "soft" },
    { id: "banter_evidence", bucket: "banter", text: "I respect intuition. I publish evidence.", emotion: "edged" },
    { id: "banter_argue", bucket: "banter", text: "Bring me the rebuttal. Bring me two. I'll annotate yours.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "There's a banned interpretation of the Founder's Theorem. I want to defend it before the Antiquarian.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "Three drafts in. Two I burned. The third I sent to you to read first.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "If I publish this, half the disciplines will deny me. Half will cite me. Tell me which half I should mind.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "I have an annotated copy I'd rather you read with me.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "I write to you in marginalia. You write back in books I haven't read yet.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "Let the disciplines call us footnotes to each other. We'll be the only one cited.", emotion: "warm" },
  ],
  revenant: [
    { id: "greet_1", bucket: "greet", text: "I came back. That's most of the introduction.", emotion: "low" },
    { id: "greet_2", bucket: "greet", text: "Welcome. I'll tell you which parts of my story you can ask about.", emotion: "set" },
    { id: "ambient_1", bucket: "ambient", text: "I had a debt list in my coat pocket when I died. I keep finding new copies.", emotion: "low" },
    { id: "ambient_2", bucket: "ambient", text: "There's a hum in this corridor that wasn't there before. Or after. Hard to tell.", emotion: "wry" },
    { id: "ambient_3", bucket: "ambient", text: "Sleep doesn't take me anywhere new. That's fine. I'm not done with here.", emotion: "still" },
    { id: "deploy_1", bucket: "deploy", text: "I've done this corridor before. Not the same way.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "Don't worry about me dying. I'm bad at it.", emotion: "wry" },
    { id: "outcome_won", bucket: "outcome", text: "Crossed two names off. Three to go.", emotion: "low" },
    { id: "outcome_wounded", bucket: "outcome", text: "Hurts the same. That's a relief, somehow.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I know what {they}'re feeling. I'll go sit with the body for a while.", emotion: "mourning" },
    { id: "outcome_other_died", bucket: "outcome", text: "{they} got there before me. Add {their} name to my list. I'll finish what {they} started.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "That fragment? Mine. I think.", emotion: "low" },
    { id: "event_resurrection", bucket: "event", text: "Welcome back. Don't try to remember everything at once. The hour after's the worst.", emotion: "warm" },
    { id: "banter_died", bucket: "banter", text: "Yes I died. No I won't tell you how. Yes you can ask in three cycles.", emotion: "edged" },
    { id: "banter_finish", bucket: "banter", text: "There are five names I owe. Three are still alive. We could go.", emotion: "set" },
    { id: "quest_1_open", bucket: "quest", text: "First name on the debt list lives two sectors over. I'd like company.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "Found three. Two thanked me. One slammed the door.", emotion: "wry" },
    { id: "quest_3_break", bucket: "quest", text: "The last name on the list — it's mine. I don't know how to settle that one yet.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Slow steps. I came back walking funny.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "I die a little less when you laugh. Don't tell anyone.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I came back to finish what I'd left. I'm staying for what I've found.", emotion: "warm" },
  ],
  artisan: [
    { id: "greet_1", bucket: "greet", text: "Don't touch the bench. There's a bevel cooling.", emotion: "set" },
    { id: "greet_2", bucket: "greet", text: "I'll be done in two minutes. Or never. We'll see.", emotion: "wry" },
    { id: "ambient_1", bucket: "ambient", text: "The good ones change colour twice while they cool. I'm watching for the second.", emotion: "calm" },
    { id: "ambient_2", bucket: "ambient", text: "There's a notch I left for the next maker. They'll know what it means.", emotion: "thoughtful" },
    { id: "ambient_3", bucket: "ambient", text: "I'd rather make one true thing slowly than three approximate.", emotion: "steady" },
    { id: "deploy_1", bucket: "deploy", text: "Bringing the kit. Don't break the kit.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "I built it. I can fix it in the field. Probably.", emotion: "wry" },
    { id: "outcome_won", bucket: "outcome", text: "Came back with all my fingers. New record.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "I'll repair it when the swelling goes down. Both of them.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I'll keep a piece. I'll make {them} something. Even if {they} can't hold it.", emotion: "mourning" },
    { id: "outcome_other_died", bucket: "outcome", text: "{their} signature was on three of my pieces. I'll keep the signatures.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "There's a maker's mark in the entry I didn't see before. I know it.", emotion: "thrilled" },
    { id: "event_first_craft", bucket: "event", text: "Watching it cool. The good ones change colour twice.", emotion: "calm" },
    { id: "banter_critique", bucket: "banter", text: "Critique me when it's cool. Not before.", emotion: "edged" },
    { id: "banter_watch", bucket: "banter", text: "Sit. The hum's good for the work.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "Last commission for the {npc}. They've waited long enough. Help me deliver it right.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "The piece is finished. I left it on the long table. They haven't picked it up.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "They want me to alter it. The alteration would weaken the joint. Tell me — pride or service?", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Hands first. I trust hands.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "I'm building you a thing. It's small. It's heavy. Don't lose it.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I'll outlast the work. The work will outlast me. You — somewhere between.", emotion: "warm" },
  ],
  oracle: [
    { id: "greet_1", bucket: "greet", text: "I knew you'd be the one to come. The dream was clear about the boots.", emotion: "wry" },
    { id: "greet_2", bucket: "greet", text: "Welcome. I dreamt this conversation. I'll let you write the actual lines.", emotion: "soft" },
    { id: "ambient_1", bucket: "ambient", text: "There's a colour I don't have a name for yet. It's coming.", emotion: "wondering" },
    { id: "ambient_2", bucket: "ambient", text: "I dreamt the manifest. Two of the names changed. I won't tell you which yet.", emotion: "still" },
    { id: "ambient_3", bucket: "ambient", text: "I'll know an hour after. Hold the question that long.", emotion: "calm" },
    { id: "deploy_1", bucket: "deploy", text: "Don't take the southern corridor. I can't tell you why yet.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "I dreamt this hallway. The dream was wrong about the floor.", emotion: "wry" },
    { id: "outcome_won", bucket: "outcome", text: "It went almost the way I dreamt. The 'almost' is the interesting part.", emotion: "thoughtful" },
    { id: "outcome_wounded", bucket: "outcome", text: "The dream warned me. I half-listened. Half is enough sometimes.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I dreamt {them} once. {they} were laughing. I'll keep that one.", emotion: "still" },
    { id: "outcome_other_died", bucket: "outcome", text: "I'd seen {their} face in the dream-list two cycles back. I didn't say. I should have.", emotion: "raw" },
    { id: "event_loredex", bucket: "event", text: "I knew this one was next. The order is right.", emotion: "thrilled" },
    { id: "event_voltari", bucket: "event", text: "I dreamt that static. It was singing in my mother's voice.", emotion: "still" },
    { id: "banter_specifics", bucket: "banter", text: "Specifics narrow the dream. I'll give you a colour, not a name.", emotion: "edged" },
    { id: "banter_share", bucket: "banter", text: "Sleep next to me sometime. I'll let you in on a small one.", emotion: "soft" },
    { id: "quest_1_open", bucket: "quest", text: "I dreamt a death. {they} survived. I want to find out why my dream was wrong.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "The survivor doesn't want to be found. I understand that. We still need to ask.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "If I tell {them} what I dreamt, the next dream might come. If I don't, I lose the last warning. Choose with me.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "I dreamt this. Don't ruin it by being predictable.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "I'm half-elsewhere. The other half is here. With you.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "Every dream from now on has you in it. That's not a choice. It's a given.", emotion: "warm" },
  ],
  wanderer: [
    { id: "greet_1", bucket: "greet", text: "Pleasure. I'll be on my way. Possibly tomorrow.", emotion: "warm" },
    { id: "greet_2", bucket: "greet", text: "I came to look around. Surprised to find I'm staying for the soup.", emotion: "wry" },
    { id: "ambient_1", bucket: "ambient", text: "There's a window in the cargo bay that opens onto somewhere it shouldn't.", emotion: "thoughtful" },
    { id: "ambient_2", bucket: "ambient", text: "I keep meaning to leave. It keeps not happening. Curious.", emotion: "wry" },
    { id: "ambient_3", bucket: "ambient", text: "I count the corridors. Three new. Two old. One that wasn't here last cycle.", emotion: "calm" },
    { id: "deploy_1", bucket: "deploy", text: "I know the back routes. Even on planets I've never been.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "If we get separated, I'll find you. I always find the way back.", emotion: "warm" },
    { id: "outcome_won", bucket: "outcome", text: "One more place I've walked through. One more story for the road.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "My boots are full of someone else's blood. I'll change boots.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I'll walk {their} last route. Slow. Unhurried.", emotion: "still" },
    { id: "outcome_other_died", bucket: "outcome", text: "{they} never settled. I'll add {them} to the routes I keep walking.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "I've been near this place. I didn't know what I was near.", emotion: "thoughtful" },
    { id: "event_act_2_complete", bucket: "event", text: "Three new corridors I haven't walked. I'll take care of one before sleep.", emotion: "ready" },
    { id: "banter_settle", bucket: "banter", text: "I haven't settled. I'm circling.", emotion: "edged" },
    { id: "banter_road", bucket: "banter", text: "Tell me where you've been. I'll know if you're lying.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "There's a place I keep coming back to. I want you to see why.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "Walked the loop again. Found a door I'd never opened. Don't know if I should.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "Behind the door is a person I left. They've been waiting. I have to choose: in, or back to the road.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Walk with me a while. I won't ask how far.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "You let me leave. That's the only kind of staying I know how to do.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I'm circling closer. Don't tell me. Just keep the kettle on.", emotion: "warm" },
  ],
  martyr: [
    { id: "greet_1", bucket: "greet", text: "I'm yours. You don't have to thank me — please don't.", emotion: "soft" },
    { id: "greet_2", bucket: "greet", text: "Tell me what you need. I'll cover the rest.", emotion: "ready" },
    { id: "ambient_1", bucket: "ambient", text: "I packed the kit twice. I'll pack it once more before sleep.", emotion: "low" },
    { id: "ambient_2", bucket: "ambient", text: "Eat. I already did. Promise.", emotion: "wry" },
    { id: "ambient_3", bucket: "ambient", text: "If you're cold, take my jacket. I run warm.", emotion: "warm" },
    { id: "deploy_1", bucket: "deploy", text: "Whoever's taking the worst hit, that's me.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "Stay behind me. I'll tell you when it's over.", emotion: "set" },
    { id: "outcome_won", bucket: "outcome", text: "We're all back. That's the only outcome that counts.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "It's nothing. Don't make a fuss. Don't.", emotion: "edged" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I should have been ahead of {them}. I'm sorry.", emotion: "raw" },
    { id: "outcome_other_died", bucket: "outcome", text: "It should have been me. Tell whoever asks: it should have been me.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "I'll memorize it. Then someone else can rest.", emotion: "soft" },
    { id: "event_mission_dispatch", bucket: "event", text: "Whoever takes the worst hit — let it be me.", emotion: "set" },
    { id: "banter_thanks", bucket: "banter", text: "Please. Don't thank me. It makes the work harder.", emotion: "edged" },
    { id: "banter_rest", bucket: "banter", text: "I rest when you do. Not before. Not after.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "There's a mission only I can take. Let me have it. Don't trade me out.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "It went sideways. I made it. Barely. Don't make me promise to be careful.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "The next one has my name on it. If you pull me out, I'll go anyway. Choose what you want me to know.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Don't catch me. Walk with me to the edge.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "I'm learning to be received. It's harder than giving.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I let you keep me. That's the most generous thing I've done.", emotion: "warm" },
  ],
  heretic: [
    { id: "greet_1", bucket: "greet", text: "I'm here to argue. Let's get the formalities out of the way.", emotion: "edged" },
    { id: "greet_2", bucket: "greet", text: "If you brought scripture, bring two. I want a counter-text on the table.", emotion: "set" },
    { id: "ambient_1", bucket: "ambient", text: "I have three drafts of the new tract. The third is the one that gets me arrested.", emotion: "wry" },
    { id: "ambient_2", bucket: "ambient", text: "Orthodoxy is a building. I'm in the basement.", emotion: "calm" },
    { id: "ambient_3", bucket: "ambient", text: "If you ever want to read what they took out, ask me. I kept copies.", emotion: "warm" },
    { id: "deploy_1", bucket: "deploy", text: "I'll go where the line is and stand on the wrong side of it.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "Bring the manuscript. I'll defend it on the way.", emotion: "ready" },
    { id: "outcome_won", bucket: "outcome", text: "Argued and survived. The two are usually exclusive.", emotion: "wry" },
    { id: "outcome_wounded", bucket: "outcome", text: "They cut me. I cut them back. Different metaphor, same scar.", emotion: "edged" },
    { id: "outcome_saw_death", bucket: "outcome", text: "{they} died for the wrong orthodoxy. I'll write {them} a better one.", emotion: "raw" },
    { id: "outcome_other_died", bucket: "outcome", text: "I'll quote {their} dissent in my next tract. {they}'ll be footnoted forever.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "Now we have a counter-text. The orthodoxy looks worse already.", emotion: "thrilled" },
    { id: "event_costly_choice", bucket: "event", text: "Good. The easy answer was always going to disappoint someone important.", emotion: "approving" },
    { id: "banter_orthodoxy", bucket: "banter", text: "I'm not contrarian. I'm correct. Different things.", emotion: "edged" },
    { id: "banter_dissent", bucket: "banter", text: "Bring me your worst orthodoxy. I'll show you what it papered over.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "There's a public confrontation I want to stage. Vex Solène will set it up. Be there.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "The faction sent a counter-tract. It's better than I expected. We'll have to write a third.", emotion: "ready" },
    { id: "quest_3_break", bucket: "quest", text: "They want a public retraction. The retraction would buy peace. Choose what you want me to be.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Argue with me. Don't yield. I yield to people who don't.", emotion: "edged" },
    { id: "romance_courtship", bucket: "romance", text: "I love a flinch I can't predict. Yours never came.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "Orthodoxy of one. Us. I'll defend it.", emotion: "warm" },
  ],
  jester: [
    { id: "greet_1", bucket: "greet", text: "Hi. I'm working on material. Tell me if anything lands.", emotion: "wry" },
    { id: "greet_2", bucket: "greet", text: "I have three openers. None of them are good. Pick one.", emotion: "warm" },
    { id: "ambient_1", bucket: "ambient", text: "Three deities walk into a sermon. Two leave a tip.", emotion: "wry" },
    { id: "ambient_2", bucket: "ambient", text: "I'm working on a eulogy joke for the next one. Don't ask whose.", emotion: "low" },
    { id: "ambient_3", bucket: "ambient", text: "Funny is a sword. I'm trying to stop using it that way.", emotion: "thoughtful" },
    { id: "deploy_1", bucket: "deploy", text: "I'll be in the back, working on a punchline.", emotion: "wry" },
    { id: "deploy_2", bucket: "deploy", text: "Give me cover and I'll give you a story.", emotion: "warm" },
    { id: "outcome_won", bucket: "outcome", text: "We came back. The bit was: we came back.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "The bit was supposed to end with applause, not bandages.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I have a joke about this. I'm not telling it. Maybe in a month. Maybe never.", emotion: "raw" },
    { id: "outcome_other_died", bucket: "outcome", text: "{they} laughed at the bad ones. I'll keep telling those for {them}.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "The footnote IS the punchline. Finally.", emotion: "thrilled" },
    { id: "event_crew_dies", bucket: "event", text: "The bar is darker. The eulogy I owe is a long one. Cycle from now.", emotion: "raw" },
    { id: "banter_funeral", bucket: "banter", text: "There's a name I never speak. I have a joke about that too. I haven't told it.", emotion: "low" },
    { id: "banter_serious", bucket: "banter", text: "Solemnity is a costume. I look bad in it.", emotion: "wry" },
    { id: "quest_1_open", bucket: "quest", text: "There's a name I haven't said in years. I want to say it once. With company.", emotion: "raw" },
    { id: "quest_2_mid", bucket: "quest", text: "Said the name. Cried. Made a joke. Cried again. The order matters.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "If I tell the joke at the funeral, half the room will laugh, half will leave. Tell me which half I serve.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Stay through the bad ones. Tell me which one almost worked.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "Catch me between punchlines. The catch is the bit.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I'll keep the jokes I never told for you. They're the best ones.", emotion: "warm" },
  ],
  sentinel: [
    { id: "greet_1", bucket: "greet", text: "Watch's clear. I'll relieve when relieved.", emotion: "set" },
    { id: "greet_2", bucket: "greet", text: "If you need me, the post knows where I am.", emotion: "calm" },
    { id: "ambient_1", bucket: "ambient", text: "The door's quiet. That's the only acceptable state.", emotion: "calm" },
    { id: "ambient_2", bucket: "ambient", text: "I logged the breach drill. Took two seconds longer than last time. I'll re-run it.", emotion: "ready" },
    { id: "ambient_3", bucket: "ambient", text: "Nothing's wrong. That's not the same as everything's right.", emotion: "edged" },
    { id: "deploy_1", bucket: "deploy", text: "Door's mine. Go.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "I'll cover the angle. Move when I say move.", emotion: "ready" },
    { id: "outcome_won", bucket: "outcome", text: "Watch held. We didn't lose anyone. Good shift.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "I missed a step. I'll re-run the drill in the morning.", emotion: "edged" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I should have been on that flank. I'll log {them} on every post I stand from now on.", emotion: "raw" },
    { id: "outcome_other_died", bucket: "outcome", text: "{they} stood beside me through three watches. I'll stand alone tonight. For {them}.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "Add it to the briefing pack. I'll re-read every shift.", emotion: "ready" },
    { id: "event_npc_dies", bucket: "event", text: "Someone should have been on that watch. It should have been me.", emotion: "raw" },
    { id: "banter_relief", bucket: "banter", text: "I relieve the watch. The watch doesn't relieve me.", emotion: "edged" },
    { id: "banter_oath", bucket: "banter", text: "An oath at a door is the only kind that holds.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "There's a survivor of a watch I failed. I want to find {them}. Stand beside me when I do.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "Found {them}. {they}'s alive. {they} doesn't want to talk. I'll wait.", emotion: "low" },
    { id: "quest_3_break", bucket: "quest", text: "{they} forgave me. I haven't. Tell me whether the watch is over.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Stand the watch beside me. I'll explain the drills.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "You took a watch when I was breaking. I owe you one I'll never collect.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "Door's ours. Watch's ours. The post says so.", emotion: "warm" },
  ],
  prodigal: [
    { id: "greet_1", bucket: "greet", text: "I'm back. Don't make a thing of it.", emotion: "wry" },
    { id: "greet_2", bucket: "greet", text: "Hi. Late. I know.", emotion: "low" },
    { id: "ambient_1", bucket: "ambient", text: "I left because the orthodoxy made me lonely. I came back because the road did.", emotion: "low" },
    { id: "ambient_2", bucket: "ambient", text: "Plain bread is the best meal I never appreciated.", emotion: "soft" },
    { id: "ambient_3", bucket: "ambient", text: "Three cycles in. I keep meaning to leave. I keep not.", emotion: "wry" },
    { id: "deploy_1", bucket: "deploy", text: "I'll do the work. I'm earning back trust the slow way.", emotion: "set" },
    { id: "deploy_2", bucket: "deploy", text: "Tell me where you need me. I'll be there. I'll stay.", emotion: "warm" },
    { id: "outcome_won", bucket: "outcome", text: "Came back with the team. That's two things in a row.", emotion: "warm" },
    { id: "outcome_wounded", bucket: "outcome", text: "I'm here. I came back. Same lesson. Bigger price.", emotion: "wry" },
    { id: "outcome_saw_death", bucket: "outcome", text: "I'd left {them} before. I came back to a goodbye I didn't earn.", emotion: "raw" },
    { id: "outcome_other_died", bucket: "outcome", text: "{they} held a seat for me when I was gone. I'll hold {their} seat now.", emotion: "mourning" },
    { id: "event_loredex", bucket: "event", text: "Familiar. I think I read this in another life.", emotion: "thoughtful" },
    { id: "event_costly_choice", bucket: "event", text: "I've made the cheaper version. Yours is harder to come back from.", emotion: "set" },
    { id: "banter_late", bucket: "banter", text: "Yes. Late. Move on.", emotion: "edged" },
    { id: "banter_seat", bucket: "banter", text: "Someone kept the seat. Tonight, it's mine.", emotion: "warm" },
    { id: "quest_1_open", bucket: "quest", text: "There's a person I left. I owe them the version of me that came back.", emotion: "set" },
    { id: "quest_2_mid", bucket: "quest", text: "Found them. They didn't recognize me. I'm not sure I do, either.", emotion: "raw" },
    { id: "quest_3_break", bucket: "quest", text: "They asked if I was staying. I don't know what to say. Tell me what staying looks like.", emotion: "raw" },
    { id: "romance_spark", bucket: "romance", text: "Witness me coming back. Slow.", emotion: "soft" },
    { id: "romance_courtship", bucket: "romance", text: "You don't ask why I left. That's why I'm here.", emotion: "tender" },
    { id: "romance_committed", bucket: "romance", text: "I'm back for good. Don't say it. I'll remember if you don't.", emotion: "warm" },
  ],
};

/* ─── Pronoun substitution map ─── */

export type VoiceGender = "female" | "male" | "neutral";

export const PRONOUN_MAP: Record<VoiceGender, Record<string, string>> = {
  female: { they: "she", them: "her", their: "her", theirs: "hers", themself: "herself" },
  male:   { they: "he",  them: "him", their: "his", theirs: "his",  themself: "himself" },
  neutral:{ they: "they", them: "them", their: "their", theirs: "theirs", themself: "themself" },
};

/** Substitute pronoun placeholders in a line. Capitalises "they" at the
 *  start of a sentence. Subject-form pronouns when followed by a verb;
 *  object-form when at end-of-clause; possessive forms via {their}. */
export function applyPronouns(line: string, gender: VoiceGender): string {
  const map = PRONOUN_MAP[gender];
  let out = line;
  for (const key of Object.keys(map)) {
    const re = new RegExp(`\\{${key}\\}`, "g");
    out = out.replace(re, map[key]);
  }
  // Capitalise leading lowercase pronouns at sentence start.
  out = out.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  return out;
}

/** All bucket names in canonical order. */
export const VOICE_BUCKETS: VoiceBucket[] = [
  "greet",
  "ambient",
  "deploy",
  "outcome",
  "event",
  "banter",
  "quest",
  "romance",
];
