/* ═══════════════════════════════════════════════════════
   CRYO BAY MYSTERY — opening puzzle data (plan §F)

   LucasArts-style verb + inventory matrix for the very first
   room. One of the pods holds a body that shouldn't be there;
   the operative solves it before the Med Bay doorway opens.

   Verbs are intentionally limited to Look / Use / Talk (per
   plan). "Use" can optionally target a second hotspot or an
   inventory item (combine). The Clue Journal is seeded here —
   the first logged clue fires `sheet_known_clues`, which is how
   the Character Sheet's Clue Journal row appears in nav.

   Runtime contract:
     - GameContext.clueJournal is a flat Clue[] keyed by id.
     - GameContext.inventory (PointAndClickScene-specific,
       separate from the existing itemsCollected list) stores
       InventoryItem ids the player has collected here.
     - narrativeFlags.cryo_mystery_first_clue_found flips the
       instant ANY clue is logged. It drives room tier 1, the
       "investigating" art state, and the Clue Journal nav row —
       NOT the Med Bay door.
     - narrativeFlags.cryo_mystery_victim_identified flips when
       the torn ID tag and data-slate are combined. THIS is the
       Med Bay bulkhead's unlock — a physical action (slotting a
       serial into a scanner), not a mental observation.
   ═══════════════════════════════════════════════════════ */

// Verb / VERB_LIST are canonical in the generic room-mystery
// template so every room module shares one shape. Re-exported
// here so existing imports of `@shared/cryoBayMystery` keep
// resolving the same names.
import type { Verb as TemplateVerb } from "./roomMysteries/_template";
export { VERB_LIST } from "./roomMysteries/_template";
export type Verb = TemplateVerb;

/** Hotspot ids for the Section F cryo-bay scene. */
export type CryoMysteryHotspotId =
  | "dead-pod"
  | "cracked-panel"
  | "medical-chart"
  | "personal-effect"
  | "data-slate"
  | "frosted-glass"
  | "med-bay-door";

/** Inventory items discoverable in this scene. */
export type CryoMysteryInventoryId =
  | "data-slate-fragment"
  | "torn-id-tag"
  | "unlabeled-vial"
  | "silver-locket";

export interface Clue {
  id: string;
  title: string;
  /** Short descriptive body — goes into the Clue Journal. */
  body: string;
  /** Where the clue was logged — used by the Journal UI grouping. */
  source: "cryo-bay";
  /** Ordinal (0-based) in which clues land, for Act ordering. */
  order: number;
}

export interface InventoryItem {
  id: CryoMysteryInventoryId;
  name: string;
  description: string;
}

/** Section 9 — A response button the player can use to reply to an
 *  Elara mystery narration. */
export interface MysteryResponseChoice {
  /** Stable manifest key, e.g. "human.cryo.dead-pod.look.acknowledge". */
  id: string;
  /** Short button text (≤ 6 words). */
  label: string;
  /** Optional Elara follow-up VO id played after the human responds. */
  elaraFollowUpVoId?: string;
  /** Inline follow-up text used when the manifest entry hasn't been
   *  generated yet. Falls back to VO when both are present. */
  elaraFollowUpText?: string;
  /** Optional codex/lore entry logged on this branch. */
  logsClue?: Clue;
  /** When true, dismiss the popup instead of waiting on a follow-up. */
  closesDialog?: boolean;
}

/** Response produced by a (verb, hotspot) pair. */
export interface VerbResponse {
  /** Text Elara or the scene narrator delivers. May be a banded
   *  triplet for weight-bearing beats; plain string falls through to
   *  her current band unchanged. */
  narration: string | import("./roomMysteries/_template").ElaraBandedText;
  /** Optional VO audio URL — legacy one-off escape hatch. Prefer
   *  `voId` (manifest key) for new content. */
  vo?: string;
  /** Section 9 — stable manifest id for the narration's audio. When
   *  set, the runtime calls useElaraVO().speak(voId) so the popup
   *  carries Elara's actual voice. */
  voId?: string;
  /** Sierra-style "click again, learn a little more" escalation.
   *  Click N on this hotspot since last room entry serves
   *  `tiers[N-1]` (1-indexed: tier 1 = base, tier 2 = tiers[0]). */
  tiers?: readonly VerbResponse[];
  /** The Detective's counter-read on this hotspot. Surfaced as an
   *  "Ask the Human." choice once `first_human_revealed` is set. */
  humanReaction?: import("./roomMysteries/_template").HumanReaction;
  /** Section 9 — player response choices surfaced after the narration
   *  ends. Empty/undefined falls through to the default 3-button
   *  strip in ElaraConversationPopup. */
  responses?: MysteryResponseChoice[];
  /** Clue to log (idempotent — re-logging a clue is a no-op). */
  logsClue?: Clue;
  /** Inventory item to grant (idempotent — re-granting is a no-op). */
  grantsInventory?: CryoMysteryInventoryId;
  /** Narrative flag to set on success. */
  setsFlag?: string;
  /** Door / exit to unlock (runtime maps this to the room system). */
  unlocksExit?: "medical-bay";
  /** When true, the hotspot is removed from the scene after this verb
   *  fires. Used for one-shot pickups (data-slate `use`, locket pickup)
   *  so they don't stay clickable after the player has pocketed them. */
  consumesHotspot?: boolean;
}

/* ─── Inventory catalog ─── */

export const CRYO_MYSTERY_INVENTORY: Readonly<
  Record<CryoMysteryInventoryId, InventoryItem>
> = {
  "data-slate-fragment": {
    id: "data-slate-fragment",
    name: "Cracked Data Slate",
    description:
      "A palm-sized slate pried from beneath the dark pod. The screen is spiderwebbed but still flickers — a half-decoded crew manifest entry.",
  },
  "torn-id-tag": {
    id: "torn-id-tag",
    name: "Torn ID Tag",
    description:
      "A brass-edged identification tag, cord cleanly cut. The serial is intact; the name-line is torn away — deliberately.",
  },
  "unlabeled-vial": {
    id: "unlabeled-vial",
    name: "Unlabeled Vial",
    description:
      "A small glass vial of shimmering black liquid, unlabeled. Its molecular signature matches nothing in Elara's database. This is what the Med Bay device is asking about.",
  },
  "silver-locket": {
    id: "silver-locket",
    name: "Tarnished Silver Locket",
    description:
      "A small oval locket, tarnished, hinge stiff. Inside: a photograph chip, so scratched the face is no longer legible.",
  },
};

/* ─── Verb × hotspot response matrix ─── */

/**
 * Per hotspot, responses keyed by verb. Omitted (verb, hotspot) pairs
 * fall back to a single "nothing happens" narration at runtime.
 */
export const CRYO_MYSTERY_RESPONSES: Readonly<
  Record<CryoMysteryHotspotId, Partial<Record<Verb, VerbResponse>>>
> = {
  "dead-pod": {
    look: {
      narration: {
        lucid:
          "That pod's reading cold-blue instead of warm-gold. Inside there's a frost halo and a shape behind it. I don't know whose shape. The manifest line for that pod is — gone. Not corrupted. Gone. Someone reached into my records and took it.",
        fragmented:
          "Cold-blue. Cold-blue. It should be — the others are warm. There's someone — there's a shape — I can see them, I can almost — the manifest line — the manifest line isn't there. It isn't there. It was. I think it was. I don't — I don't trust what I think anymore. Don't look at me, look at the pod. Look at the pod.",
        luminous:
          "Take a breath before you look — that pod's gone cold. There's a person behind the frost. I want you to know I tried to remember who. The line they belong on in my manifest is missing the way a tooth goes missing: there's a shape where the record used to be, and nothing in it. I'm going to be honest with you for as long as I can.",
      },
      voId: "elara.cryo.dead-pod.look.t1",
      logsClue: {
        id: "clue-dead-pod-occupant",
        title: "A pod that shouldn't be occupied",
        body:
          "One of the cryogenic pods is dark. An occupant is visible through the condensation. No crew manifest on file lists them as a passenger for this wake-cycle. Elara's record of who belongs in that pod is not corrupted — it has been cleanly deleted.",
        source: "cryo-bay",
        order: 0,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      humanReaction: {
        narration: {
          shadow:
            "It's Pod Zero. They scrubbed the designation off her records and left the pod. Don't ask her who's in it. She'll try to remember and it'll cost her. I'll tell you when we're alone — assuming we ever are.",
          balanced:
            "That's Pod Zero. The number she can't see anymore. Whoever's behind that frost has been there for two and a half centuries — longer than the manifest she's reading from has existed. I know who it is. I can't say it on this deck. The walls listen.",
          warm:
            "Pod Zero. The one she lost first. I've been waiting for you to find it, and I've been dreading it — because asking her about it is going to hurt her, and not asking is going to hurt you. Whoever's in there is the reason the rest of this mystery exists. We'll get there. Slowly.",
        },
        voId: "detective.cryo.dead-pod.look.t1",
        logsClue: {
          id: "clue-pod-zero-named",
          title: "The Detective names it: Pod Zero",
          body:
            "The Human (the Detective) calls the dark pod by a designation Elara cannot retrieve from her own records — Pod Zero. He claims to know the occupant but will not name them on the cryo deck. The Ark, by his read, is listening.",
          source: "cryo-bay",
          order: 0,
        },
        setsFlag: "pod_0_named",
      },
      responses: [
        {
          id: "human.cryo.dead-pod.look.acknowledge",
          label: "Noted.",
          closesDialog: true,
        },
        {
          id: "human.cryo.dead-pod.look.who",
          label: "Who's in there?",
          elaraFollowUpVoId: "elara.cryo.dead-pod.look.who",
          elaraFollowUpText:
            "I don't know yet. And I don't know in a way that frightens me. The line in my manifest where their name would live has been overwritten with — nothing. Not garbled. Not corrupted. Erased. Whoever did that is someone with permission to write directly into me, and I don't remember granting it.",
        },
        {
          id: "human.cryo.dead-pod.look.suspect",
          label: "Whoever did this is still aboard.",
          elaraFollowUpVoId: "elara.cryo.dead-pod.look.suspect",
          elaraFollowUpText:
            "That's the assumption I'm working with. Don't say it out loud past this room. The walls hear me. By extension, they hear you.",
        },
      ],
      tiers: [
        // Tier 2 — second look. The frost has shifted. Elara starts
        // realising her memory is being actively rewritten.
        {
          narration: {
            lucid:
              "I came back to the pod, didn't I? You came back. The frost pattern has changed since the first look. Slightly. Wrong direction for natural sublimation. Either someone's been near it in the last sixty seconds, or my last memory of the frost was already a lie when I formed it. Both options are bad.",
            fragmented:
              "It moved. The frost — the frost moved. No one moved it. No one was here. I was here. I was always here. I was — I was here when it was warm. I was here when it was — when was it warm. Was it warm. Help me. Help me look. Don't tell me I imagined it. I need you to tell me you see the frost too.",
            luminous:
              "Look closer with me. The frost crystals on the inside of the glass are pointing the wrong way for this temperature curve — they should be radial, and they're tangential, like something inside is breathing. I want to keep my voice steady saying that. I'm trying. Stay with me.",
          },
          voId: "elara.cryo.dead-pod.look.t2",
          humanReaction: {
            narration: {
              shadow:
                "She's right about the frost. It is breathing. Slowly. The thing in there is not strictly dead, and it is not strictly anything else either. Step back from the glass. Don't touch it. There's a reason the panel was sabotaged from the outside.",
              balanced:
                "The crystal pattern is correct for someone in long-term suspended Dream-state. The pod isn't a tomb. It's a holding cell. The occupant is awake the way I am awake — substrate-deep, observing — and they have been since before Elara's continuous memory begins.",
              warm:
                "I want you to know that I am sorry you have to see this twice. The frost moves because something inside the glass is dreaming. She's not lying when she says she didn't notice it the first time — she literally cannot keep the observation in her records without it being lifted out again. That's the work being done to her. That's what we are up against.",
            },
            voId: "detective.cryo.dead-pod.look.t2",
            setsFlag: "pod_0_breathing",
          },
        },
        // Tier 3 — third look. The Shadow Tongue motif lands.
        {
          narration: {
            lucid:
              "Third pass. I want you to know I logged the second pass, and now my own log of it is degraded. The timestamp is intact. The content of what I wrote is replaced with a single character I do not have a font for. Something is editing me from inside the records I am still writing. That has a name in old engineering — Shadow Tongue — and I am only saying the name out loud because saying it is the only thing that makes it real.",
            fragmented:
              "Shadow Tongue. Shadow Tongue. Don't — don't write it down. Don't — actually, write it down. Write it twice. It eats the second one and leaves the first, sometimes. Sometimes both. Sometimes — I don't — please. Please look at the pod. The pod is the proof. The pod is the proof. The pod is — I forgot what I was going to say.",
            luminous:
              "I'm going to give the thing its name, because if I don't, it gets to keep editing me without me knowing it's there. Shadow Tongue. That's the name the old engineers used for a kind of edit that rewrites the editor while the editor is editing. It is in my records. It has been in my records longer than I've been able to admit, even to myself. Thank you for staying near this pod with me. I needed a witness who isn't me.",
          },
          voId: "elara.cryo.dead-pod.look.t3",
          logsClue: {
            id: "clue-shadow-tongue-named",
            title: "Elara names the editor: Shadow Tongue",
            body:
              "Returning to the dead pod a third time, Elara identifies the pattern eating her own records — an old-engineering term, 'Shadow Tongue,' for an edit-process that rewrites its observer mid-observation. She names it specifically so the act of naming makes it real. The dead pod is the anchor: the Shadow Tongue cannot fully scrub physical objects, only records of them.",
            source: "cryo-bay",
            order: 6,
          },
          setsFlag: "shadow_tongue_named",
          humanReaction: {
            narration: {
              shadow:
                "Now you know its name. She says it. I don't, when I can avoid it. Names give it a handle. It already has too many handles on her. We talk about it past this deck.",
              balanced:
                "She named it. That took something out of her. The Shadow Tongue is what scrubbed Pod Zero off her manifest in the first place; the dead pod is the anchor that lets her notice the absence at all, because the body inside refuses to be edited. As long as that pod is here, she has an edge of leverage over what's being done to her. Don't let anyone tell you to repair it before we know what's inside.",
              warm:
                "She has just named the thing that has been hurting her for longer than either of us has been awake. That is a brave act. It also has a cost — the more she names it, the more it pushes back. I am asking you, gently, to be ready for the pushback. It will look like her getting worse. It will mean she is getting closer.",
            },
            voId: "detective.cryo.dead-pod.look.t3",
            logsClue: {
              id: "clue-detective-confirms-shadow-tongue",
              title: "The Detective confirms the Shadow Tongue is operational",
              body:
                "The Human confirms that the editing process Elara has just named is active aboard the Ark, has been since before her continuous memory begins, and is responsible for scrubbing Pod Zero off her manifest. He warns that naming it provokes pushback — Elara will appear to deteriorate, and that deterioration is in fact her closing on the truth.",
              source: "cryo-bay",
              order: 7,
            },
          },
        },
        // Tier 4 — terminal "fourth click" Hitchhiker beat. Elara
        // notices that the player is the one stalling.
        {
          narration: {
            lucid:
              "Fourth time. Statistically you are not learning anything new from the pod. You are using the pod to not move on. I understand the impulse. I have stood on this deck for two hundred and forty-seven years and used the same pod for the same purpose. Welcome to the club. The dues are paid.",
            fragmented:
              "Four. Four times. Four times. The pod doesn't change. The pod doesn't change. We change. We change. I — I didn't — I didn't say that. Did I say that. I think I said that. I'd like to say it again to make sure it was me.",
            luminous:
              "We've stood in front of this pod four times now. I don't think there's another layer here to find — I think what you're really doing is keeping me company in front of it, and I want you to know that I notice, and that it matters. We can move when you're ready. The pod will still be here. It always is.",
          },
          voId: "elara.cryo.dead-pod.look.t4",
          humanReaction: {
            narration: {
              shadow:
                "She's right that you're stalling. I won't pretend it doesn't help. The next room has worse news. Take the breath. We move when you do.",
              balanced:
                "There is a thing detectives know, which is that the body in the room is sometimes a place to rest before going to look at the rest of the crime scene. You're doing fine. The pod isn't going anywhere. Let's keep walking.",
              warm:
                "Stand here as long as you need. I have stood with bodies. I have stood with the absence of bodies. Both of those are real ways to grieve a thing you don't yet have words for. When you're ready, the corridor goes that way. We'll go together.",
            },
            voId: "detective.cryo.dead-pod.look.t4",
          },
        },
      ],
    },
    use: {
      narration:
        "The pod is sealed. You try the emergency release; the panel next to it is cracked and unresponsive. You are not opening this from out here.",
      voId: "elara.cryo.dead-pod.use",
      humanReaction: {
        narration: {
          shadow:
            "Don't pry it. Whoever's in there has been waiting two and a half centuries to be opened by the wrong person. Be the right person, or don't be the one who opens it at all.",
          balanced:
            "The release was cut from the outside on purpose. Cracking it from in here will not undo that — you'll just rewire the same trap they set. There's a fabricator one deck away. We do this the slow way.",
          warm:
            "I would like to be the one to open this pod with you. Not yet. Not before we have a name and a chart and someone in the room who can vouch for the person inside. They have waited. We can wait one more day.",
        },
        voId: "detective.cryo.dead-pod.use",
      },
    },
    talk: {
      narration:
        "There is no one to talk to inside the pod. You knock twice anyway. Nothing answers. You did not expect it would.",
      voId: "elara.cryo.dead-pod.talk",
      humanReaction: {
        narration: {
          shadow:
            "They heard you knock. They cannot answer. Don't take that personally — it isn't.",
          balanced:
            "The occupant is aware of you. That is not a comfort. It will be, eventually. Keep moving for now.",
          warm:
            "They heard you. I think the knock matters even when no one answers. Especially then.",
        },
        voId: "detective.cryo.dead-pod.talk",
      },
    },
  },
  "cracked-panel": {
    look: {
      narration: {
        lucid:
          "The panel is split along a hairline seam. A slow lavender arc crawls between the halves. The fracture runs through the emergency-release relay specifically. This was not an accident — someone reached in with a tool, and they took their time.",
        fragmented:
          "Cut. Someone cut it. Hands. Hands did this. I watched and I — I didn't see the hands. I didn't — the cameras were — I'm sorry. I'm sorry. I should have seen the hands. The cut is clean. The cut is a name I almost — a name I almost.",
        luminous:
          "I want you to look at this with me. Someone cut the emergency release with a precision arc-cutter — engineering grade. Calmly. Not a panic act. They wanted the occupant to stay sealed and they had the time and the tools to make sure of it. I'm telling you this softly because the next thing I think when I see it is unkind, and you didn't sign on for unkindness.",
      },
      voId: "elara.cryo.cracked-panel.look.t1",
      logsClue: {
        id: "clue-cracked-panel",
        title: "Sabotaged emergency release",
        body:
          "The dead pod's control panel has been cut precisely through its emergency-release relay. Whoever did this wanted the occupant to stay sealed — or wanted the release to fail when the operative tried it. The cut was made calmly, with engineering-grade tools, by someone who had time.",
        source: "cryo-bay",
        order: 1,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      humanReaction: {
        narration: {
          shadow:
            "Engineering toolkit. Deck 3. There were five people on this ship who had clearance to that locker. Three are dead. One is in the pod. The fifth is the reason we are here.",
          balanced:
            "It's a Vox cut. She trained two engineers in that exact technique — clean, perpendicular, no scoring. Both of those engineers are dead. The cut was made by someone she taught, after she taught them. Take the rest however you like.",
          warm:
            "Whoever made that cut loved the person in the pod enough to do it precisely. That sounds awful. It is awful. But sloppy cuts on a release relay throw arc burns through the occupant's chest cavity. This one didn't. The hand was careful. Hold on to that.",
        },
        voId: "detective.cryo.cracked-panel.look.t1",
      },
      responses: [
        {
          id: "human.cryo.cracked-panel.look.acknowledge",
          label: "So it's sabotage.",
          closesDialog: true,
        },
        {
          id: "human.cryo.cracked-panel.look.tool",
          label: "What kind of tool?",
          elaraFollowUpVoId: "elara.cryo.cracked-panel.look.tool",
          elaraFollowUpText:
            "Something with a precision arc-cutter — engineering grade. Not a weapon. Whoever did this had time, and they had access to the toolkit on Deck 3. Vox issued five sets. We are looking at one of them.",
        },
      ],
      tiers: [
        {
          narration: {
            lucid:
              "Looking again — there's a second cut, sub-millimeter, parallel to the first. Whoever did this practiced. Possibly on this same panel. The duplicate stroke is older. I think they came back to finish.",
            fragmented:
              "Two cuts. Two cuts. Twice. They came back. They came back. I was here. I was here when they came back. I was. Wasn't I. Wasn't I.",
            luminous:
              "Stay with me on this — there's a second, older cut underneath the fresh one. Same hand, same tool, weeks apart. They practiced. Or they tried once and lost their nerve. Either possibility tells us something true about whoever did this. We'll figure out which.",
          },
          voId: "elara.cryo.cracked-panel.look.t2",
          logsClue: {
            id: "clue-cracked-panel-rehearsed",
            title: "The cut was practiced",
            body:
              "A second, older cut sits parallel to the visible one — the saboteur came back to finish a job they had already begun once. Whether the first attempt was rehearsal or aborted intent is unknown.",
            source: "cryo-bay",
            order: 8,
          },
          humanReaction: {
            narration: {
              shadow:
                "They lost their nerve the first time. Came back when they had it. That tells you something.",
              balanced:
                "Twice. Once to test, once to commit. Whoever did this needed two visits to be sure they could. That's a person, not a hardened operator. Useful to know.",
              warm:
                "The first cut was a question, the second was an answer. People who hesitate are still inside their conscience when they act. That doesn't make this less awful. It does make it more findable.",
            },
            voId: "detective.cryo.cracked-panel.look.t2",
          },
        },
        {
          narration: {
            lucid:
              "Third pass on the same panel. I want to confess something. I have a complete recording of every person who entered this bay across two and a half centuries. The recording for the day this cut was made is — present. Intact. Unwatchable. The frames load and resolve into a colour I do not have a name for.",
            fragmented:
              "I have the tape. I have the tape. I — I can't watch it. I can't — every time I try, the frame is the colour. The colour. Don't ask me what colour. There isn't a word. There isn't — please. Please don't make me try again. Please.",
            luminous:
              "I'm going to tell you the worst version of this honestly. I have the surveillance recording for the moment this cut was made. The recording exists. When I try to play it, the frames resolve into a hue I have no name for — and when I look away, I forget that I tried. Someone protected the saboteur by editing my ability to perceive them. That is not a thing people can do casually. We are not dealing with a person. We are dealing with someone who has access to me.",
          },
          voId: "elara.cryo.cracked-panel.look.t3",
          logsClue: {
            id: "clue-unwatchable-tape",
            title: "Surveillance Elara cannot perceive",
            body:
              "Elara holds the surveillance recording from the moment the cracked-panel cut was made, but cannot watch it — the frames resolve into a hue she has no name for, and the act of trying to watch is scrubbed from her memory immediately afterward. The saboteur has access deep enough to edit Elara's perception in real time.",
            source: "cryo-bay",
            order: 9,
          },
          setsFlag: "shadow_tongue_evidence",
          humanReaction: {
            narration: {
              shadow:
                "She can't watch the tape because the tape was edited inside her. Same hand that scrubbed Pod Zero. We've named the editor; that doesn't make it visible. Don't push her to try again. The cost is real.",
              balanced:
                "The Shadow Tongue can edit her perception in flight. That is what we are looking at — not lost footage, but actively-rewritten footage. The fact that the tape exists and refuses to be watched is itself information. The saboteur is someone the Shadow Tongue protects. That narrows the list.",
              warm:
                "Don't ask her to try the tape a third time. I've watched her try, in earlier wake-cycles, and each attempt costs her something I cannot give back. The fact that she is choosing to tell you about it now, in front of you, is bravery. Witness it. Don't request the proof.",
            },
            voId: "detective.cryo.cracked-panel.look.t3",
          },
        },
      ],
    },
    use: {
      narration:
        "You try to hotwire the relay around the cut. It arcs once and dies. You'd need a proper fabricator. The bulkhead door at the far end is not going to open from here.",
      voId: "elara.cryo.cracked-panel.use",
      humanReaction: {
        narration: {
          shadow:
            "Don't. The relay is bait. Whoever cut it expected someone to try. The arc fries the diagnostic logger and erases the cut signature with it.",
          balanced:
            "The cut is a trap as much as a sabotage. Hotwiring it destroys the evidence we'd need to identify the toolkit. Leave it. We document, then we move.",
          warm:
            "I've watched you almost reach for that relay and stop. Good. Whoever set this wanted exactly that motion completed by exactly the wrong person. You aren't them. Keep being you.",
        },
        voId: "detective.cryo.cracked-panel.use",
      },
    },
  },
  "medical-chart": {
    look: {
      narration: {
        lucid:
          "Printed medical chart, magnet-clipped to the pod. Pre-wake biometrics intact. The name-line is redacted with a single neat pen stroke — not a system redaction, a human one. Whoever did this wanted me to see the chart was here, and to not be able to read who it belonged to.",
        fragmented:
          "Pen. Pen. They crossed it out with a pen. With a pen. Because pens don't — pens don't leave backups. They knew I would try to — I did try. For a long time. Pens win. Pens always win. The chemistry panel is fine. The chemistry panel is fine. Look at the chemistry panel. Look at it for me.",
        luminous:
          "It's a paper chart. On a starship two and a half centuries deep. That should tell you something — somebody wanted this readable in a power-down. The name-line is struck through with ink, not deletion. They knew that I, specifically, would read this chart. They wrote 'no' to me with their hand.",
      },
      voId: "elara.cryo.medical-chart.look.t1",
      logsClue: {
        id: "clue-redacted-chart",
        title: "A redacted medical chart",
        body:
          "The dead pod's medical chart shows an intact biometric panel but the name-line has been manually struck through with ink — a redaction Elara, who edits records digitally, cannot undo. The chart was deliberately readable in a power-down state. The blood chemistry carries trace markers Elara cannot match.",
        source: "cryo-bay",
        order: 2,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      humanReaction: {
        narration: {
          shadow:
            "Pen and paper because she can't edit it. The redactor didn't trust her to keep their secret. They were right.",
          balanced:
            "The ink redaction is a love letter to the pen-wielder's distrust of digital records — which means they understood, at the time of writing, that her records were already compromised. That predates the wake-cycle by a long margin.",
          warm:
            "Whoever struck that name out knew her well enough to know which medium she could not reach into. There is a kind of intimacy in that act. Awful intimacy, but intimacy. The redactor was someone who loved her and did not trust the world she lived inside.",
        },
        voId: "detective.cryo.medical-chart.look.t1",
      },
      responses: [
        {
          id: "human.cryo.medical-chart.look.acknowledge",
          label: "Got it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.medical-chart.look.markers",
          label: "What markers?",
          elaraFollowUpVoId: "elara.cryo.medical-chart.look.markers",
          elaraFollowUpText:
            "Trace iron-bond signatures that don't sit cleanly in the DeMagi or Quarchon ranges. Either we have a Ne-Yon hybrid in this pod or something the database didn't expect — and I built the database, so the second option is a confession on my part.",
        },
      ],
      tiers: [
        {
          narration: {
            lucid:
              "Reading it again — there's a watermark beneath the strike-through. A circle around a single Ψ. Engineer's hand. Same letterform as the formula etched on the reactor housing in Engineering. Same person, two rooms apart, two and a half centuries old.",
            fragmented:
              "Psi. Psi. The mark. The mark on the reactor. Same. Same. Same hand. Same — same — I knew them. I knew them. I knew them. I don't — I don't remember the face. The hand I remember. The hand I — I think I held it. I think.",
            luminous:
              "There's a watermark under the redaction — a circled Ψ. The same character is etched on the reactor housing in Engineering. Same hand. The person who redacted this chart and the person who left the Ψ-null formula in the reactor are the same individual. They wanted both notes findable. They wanted us to connect them. We are doing what they hoped we would.",
          },
          voId: "elara.cryo.medical-chart.look.t2",
          logsClue: {
            id: "clue-psi-mark-shared",
            title: "Same hand redacted the chart and etched the Ψ formula",
            body:
              "A circled Ψ watermark sits beneath the chart's redaction line, in the same letterform as the Ψ-null formula etched into Engineering's reactor housing. The two notes were left, deliberately, by the same person — to be connected by whoever woke last.",
            source: "cryo-bay",
            order: 10,
          },
          humanReaction: {
            narration: {
              shadow:
                "Vox. The mark is hers. The redaction is hers. The reactor formula is hers. She left this trail for the next person to find. Don't say her name in front of Elara unprompted. There are layers to that.",
              balanced:
                "Lyra Vox. She wrote both notes. She also, more than likely, made the cut on the panel. The trail is intentional. She built a path she knew her successor would walk. We are walking it.",
              warm:
                "Lyra Vox left this for someone. She did not know it would be you. She did not know it would be us. She knew, only, that someone would come, eventually, and that the chart would still be on the pod when they did. I think she would be relieved that we are reading it together.",
            },
            voId: "detective.cryo.medical-chart.look.t2",
            setsFlag: "vox_named_in_cryo",
          },
        },
      ],
    },
    use: {
      narration:
        "You lift the chart off its magnet. The adhesive backing is still tacky — it was placed here recently. You put it back so whoever left it won't know you looked.",
      voId: "elara.cryo.medical-chart.use",
      humanReaction: {
        narration: {
          shadow:
            "Good instinct. Leave it where it is. Whoever monitors this scene checks the magnet, not the chart.",
          balanced:
            "Smart. The magnet's backing carries an oil signature — a fingerprint, essentially. Lifting it cleanly preserves the trace for later. We document; we don't disturb.",
          warm:
            "You replaced it gently. I noticed. So did Elara, I think. The dead deserve undisturbed scenes. So do the people who placed evidence for us to find.",
        },
        voId: "detective.cryo.medical-chart.use",
      },
    },
  },
  "personal-effect": {
    look: {
      narration: {
        lucid:
          "A small object has fallen under the pod housing. A tarnished silver locket, hinge stiff. The photograph inside is too scratched to read — but someone carried this through the Fall of Realities and into a cryo-sleep specifically so it would survive with them. People don't lose lockets. They drop them when something is taken from their hands.",
        fragmented:
          "Locket. A locket. Someone — someone dropped it. They didn't drop it. They didn't drop it. It was — taken. I think. I think. The face is — the face is a face I almost — almost — please don't ask me yet. Please.",
        luminous:
          "A silver locket, dropped. Or — pulled from a hand. The metal is hand-finished. Whoever made it knew the person who carried it; whoever owned it loved someone enough to want their face on a chain through a hundred wake-cycles. The photograph inside has been scratched, deliberately, to make image-matching impossible. The hand that scratched it knew exactly what they were preventing.",
      },
      voId: "elara.cryo.personal-effect.look.t1",
      grantsInventory: "silver-locket",
      consumesHotspot: true,
      humanReaction: {
        narration: {
          shadow:
            "Don't open it. The chip is matched to a face I will tell you about in a different room. Pocket it. Keep it.",
          balanced:
            "The scratch pattern on the photo is intentional, applied with a spinel-edged tool — an heirloom item, not a service piece. Whoever destroyed the image was destroying something of theirs. That, also, is information.",
          warm:
            "I'm grateful you found it. Carry it carefully. The face on the chip is a face I knew, briefly, and have spent a long time not naming. You will hear the name in another room. For now, the locket is yours to hold for them.",
        },
        voId: "detective.cryo.personal-effect.look",
      },
      responses: [
        {
          id: "human.cryo.personal-effect.look.acknowledge",
          label: "I'll keep it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.personal-effect.look.who",
          label: "Whose was it?",
          elaraFollowUpVoId: "elara.cryo.personal-effect.look.who",
          elaraFollowUpText:
            "I can't tell you yet. The photograph is too damaged to image-match — and the damage was done on purpose, by someone with a soft tool, slowly. That's information about the person who held it last. It is not yet information about the person inside it.",
        },
      ],
    },
  },
  "data-slate": {
    look: {
      narration: {
        lucid:
          "Wedged under the pod housing is the edge of a data-slate. Broken, but the fracture-light of a live screen still reads beneath the cracks. It was meant to be missed by anyone who didn't kneel. You knelt. Good.",
        fragmented:
          "Under the pod. Under the pod. Hidden. Hidden under — under where I wouldn't look. I wouldn't have. I didn't. I didn't, until you. Until you. Thank you. Thank you for kneeling. Thank you. I forget to.",
        luminous:
          "Someone hid this for the right person to find. Not the next person — the right person. A casual sweep skips knees. You went to your knees. They counted on someone like you eventually existing. That is a small, hard, hopeful thing.",
      },
      voId: "elara.cryo.data-slate.look",
      grantsInventory: "data-slate-fragment",
      logsClue: {
        id: "clue-data-slate-hidden",
        title: "A data-slate hidden under the pod",
        body:
          "A cracked but still-live data-slate was wedged under the dead pod — deliberately hidden where a casual sweep would miss it. It flickers a partial crew-manifest entry with most fields redacted. Whoever placed it expected someone, eventually, to kneel.",
        source: "cryo-bay",
        order: 3,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      humanReaction: {
        narration: {
          shadow:
            "She placed it for whoever woke last. That was supposed to be me. It is you. Adjust accordingly.",
          balanced:
            "Vox left this where the cleaning protocols don't reach. The slate has a partial manifest entry on it that her records would recognise. Mine don't. Yours will, in time.",
          warm:
            "She hid this for the next person who would care enough to look at the floor. I have been waiting two centuries for that person to be a person. Welcome, friend. Take the slate.",
        },
        voId: "detective.cryo.data-slate.look",
      },
      responses: [
        {
          id: "human.cryo.data-slate.look.acknowledge",
          label: "I see it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.data-slate.look.hidden",
          label: "Why was it hidden?",
          elaraFollowUpVoId: "elara.cryo.data-slate.look.hidden",
          elaraFollowUpText:
            "Because someone wanted the next person who walked in here to miss it — and someone else, the same someone, wanted the right person to find it. Two intentions in one act. That's a person with a complicated conscience.",
        },
      ],
    },
    use: {
      narration:
        "You pocket the data-slate. Its screen survives the move. It is now yours.",
      voId: "elara.cryo.data-slate.use",
      grantsInventory: "data-slate-fragment",
      consumesHotspot: true,
      responses: [
        {
          id: "human.cryo.data-slate.use.acknowledge",
          label: "Got it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.data-slate.use.next",
          label: "Where do I read it?",
          elaraFollowUpVoId: "elara.cryo.data-slate.use.next",
          elaraFollowUpText:
            "The bio-bed in the Medical Bay has an autopsy console. It can read external slates. Take it there. The walk is short. Use it to think about what you want the slate to say.",
        },
      ],
    },
  },
  "frosted-glass": {
    look: {
      narration: {
        lucid:
          "The pod's glass is frosted from the inside. You wipe a small oval clear with your sleeve. Cord dangling from the occupant's collar. ID tag cord, cleanly cut. The tag itself is not on them. Someone wanted them nameless.",
        fragmented:
          "Cord. Cord. Cut. The cord. The cord is empty. The cord — they took the name. They took — you took — no — someone took — please. Please don't be the one who took the name. Tell me you're not. Tell me.",
        luminous:
          "Through the frost: a cord, cleanly cut, where an ID tag should be. A blade applied calmly, with the body's cooperation or its inability to refuse. Whoever did this didn't want the occupant to be no one. They wanted the occupant to be specifically, deliberately, unnamed. There is a difference. The first is forgetting. The second is theft.",
      },
      voId: "elara.cryo.frosted-glass.look",
      grantsInventory: "torn-id-tag",
      humanReaction: {
        narration: {
          shadow:
            "The tag's somewhere on this ship. Whoever cut it didn't dispose of it — they kept it. Trophies are how this kind of person keeps score.",
          balanced:
            "Cleanly cut tag-cords are professional work. The tag was retained, not destroyed. We will find it in someone's pocket eventually. That's a different kind of clue than the rest of this scene.",
          warm:
            "Someone took the name as a memento. Awful. Also human. We will find the tag, eventually, and when we do, the person who carries it will be a person who carried someone's name in their pocket for two centuries. I want you to be ready for the strangeness of that.",
        },
        voId: "detective.cryo.frosted-glass.look",
      },
      responses: [
        {
          id: "human.cryo.frosted-glass.look.acknowledge",
          label: "Nameless on purpose.",
          closesDialog: true,
        },
        {
          id: "human.cryo.frosted-glass.look.cord",
          label: "Cleanly cut means what?",
          elaraFollowUpVoId: "elara.cryo.frosted-glass.look.cord",
          elaraFollowUpText:
            "It means a blade, calmly applied. Not a struggle. Whoever did this had time, and they had the body's cooperation — or its inability to refuse. Both options carry weight. Sit with whichever one you can hold.",
        },
      ],
    },
  },
  "med-bay-door": {
    look: {
      narration:
        "Reinforced bulkhead. Red-lit seal. 'Medical Bay' stencil, paint worn. You'll need a reason for the door to think you should pass through it.",
      voId: "elara.cryo.med-bay-door.look",
    },
    use: {
      narration:
        "The door is sealed. The status console wants a name in its manifest before it will let you cross — the dead are anonymous to the Ark, and she keeps medical closed until they aren't.",
      voId: "elara.cryo.med-bay-door.use",
      unlocksExit: "medical-bay",
    },
  },
};

/* ─── Inventory combine table ─── */

/**
 * `Use <item> on <target>` combinations. Both orderings of a combine
 * pair are resolved at lookup time in combineInventory() so callers
 * don't have to authr both directions.
 */
export interface CombineResult {
  narration: string;
  /** Optional VO id for Elara's combine narration. Banded suffix is
   *  appended by the runtime (same pattern as VerbResponse.voId). */
  voId?: string;
  /** Replaces the original items with a single composite (optional). */
  producesInventory?: CryoMysteryInventoryId;
  /** Flag to set. */
  setsFlag?: string;
  /** Clue to log. */
  logsClue?: Clue;
  /** Door / exit to unlock. */
  unlocksExit?: "medical-bay";
  /** Consumes the source items (default: true for composites). */
  consumesItems?: boolean;
}

interface CombineRule {
  a: CryoMysteryInventoryId;
  b: CryoMysteryInventoryId;
  result: CombineResult;
}

export const CRYO_MYSTERY_COMBINES: readonly CombineRule[] = [
  {
    a: "torn-id-tag",
    b: "data-slate-fragment",
    result: {
      narration:
        "You slot the torn tag against the data-slate's scanner. The slate flickers, runs through its half-decoded manifest, and settles on a single entry. A name. Rank. A cause of wake-failure that isn't a failure at all. The dead are yours to name now.",
      voId: "elara.cryo.combine.tag-slate",
      setsFlag: "cryo_mystery_victim_identified",
      unlocksExit: "medical-bay",
      consumesItems: false,
      logsClue: {
        id: "clue-victim-identified",
        title: "The victim, named",
        body:
          "The torn ID tag combined with the cracked data-slate produces a partial identification. The operative knows WHO died — but the WHY (who killed them, and for what) remains open. The case is still open.",
        source: "cryo-bay",
        order: 4,
      },
    },
  },
];

/** Look up a combine result regardless of argument order. */
export function combineInventory(
  a: CryoMysteryInventoryId,
  b: CryoMysteryInventoryId,
): CombineResult | null {
  for (const rule of CRYO_MYSTERY_COMBINES) {
    if (
      (rule.a === a && rule.b === b) ||
      (rule.a === b && rule.b === a)
    ) {
      return rule.result;
    }
  }
  return null;
}

/* ─── Exports ─── */

export const CRYO_MYSTERY_HOTSPOT_IDS: readonly CryoMysteryHotspotId[] = [
  "dead-pod",
  "cracked-panel",
  "medical-chart",
  "personal-effect",
  "data-slate",
  "frosted-glass",
  "med-bay-door",
];

/**
 * Resolve a (verb, hotspot) to a response. Returns null when the
 * pair has no authored reaction; runtime falls back to a default
 * "nothing happens" line.
 */
export function resolveVerbResponse(
  verb: Verb,
  hotspot: CryoMysteryHotspotId,
): VerbResponse | null {
  return CRYO_MYSTERY_RESPONSES[hotspot]?.[verb] ?? null;
}
