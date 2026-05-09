/* ═══════════════════════════════════════════════════════
   APPRENTICE IDENTITY — per-archetype companion identity

   The identity table that gives every apprentice archetype
   the structure of a Mass Effect / Dragon Age companion:
    - what they like and dislike (gifts)
    - what they want and want to avoid (agenda goals)
    - their 3-stage personal quest chain
    - their romance hook (or lack of one)
    - their breaking-point choice (loyalty crystallizer)

   Apprentices share archetype with demon summons (heretic /
   revenant / oracle archetypes apply to demons too); the
   identity table is the single authoritative source.

   This module is consumed by:
    - personalAgenda.ts (agenda goal pool seed)
    - apprenticePersonalQuests.ts (quest stage authoring)
    - apprenticeGifts.ts (gift table per archetype)
    - apprenticeRomance.ts (romance arc gating)
    - companionBanter.ts (banter line filters)
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { PersonalQuestSubtaskRef } from "./personalQuestSubtasks";

export interface ApprenticeIdentity {
  archetype: ApprenticeArchetype;
  /** Gifts they value highly. +bond when given. */
  likes: string[];
  /** Gifts that hurt the bond when given. */
  dislikes: string[];
  /** What this archetype always wants — surfaces as agenda goals. */
  wants: string[];
  /** What this archetype actively avoids — surfaces as tension scenes. */
  avoids: string[];
  /** Personal quest chain (3 stages). Stage 3 is the breaking-point choice.
   *  Each stage has 3 sub-tasks gating advance; bond AND all sub-tasks
   *  complete to move on. Validators live in apprenticeQuestSubtaskService. */
  personalQuest: {
    chainTitle: string;
    stage1: { title: string; description: string; subtasks?: PersonalQuestSubtaskRef[] };
    stage2: { title: string; description: string; subtasks?: PersonalQuestSubtaskRef[] };
    stage3: {
      title: string;
      description: string;
      subtasks?: PersonalQuestSubtaskRef[];
      /** The two choices at the breaking point. The first deepens; the
       *  second triggers apprenticeBetrayal. */
      deepenChoice: { label: string; consequence: string };
      breakChoice: { label: string; consequence: string };
    };
  };
  /** Whether this archetype can romance. Some (artisan, scholar) yes;
   *  others (jester, oracle) only with the right rapport curve. The
   *  romance arc reads this gate and curses unsupported pairings. */
  romance: {
    available: boolean;
    /** Bond threshold below which the romance arc cannot start. */
    minBondToStart: number;
    /** Their preferred archetypes / npcKeys for partners (soft signal). */
    preferredPartners: string[];
    /** Their archetype-flavored romance signature line — surfaces in
     *  the alcove sub-zone of the Commons at courtship stage. */
    courtshipSignature: string;
  };
  /** The line they say at their breaking point — pre-Path A or Path B. */
  breakingPointLine: string;
}

export const APPRENTICE_IDENTITIES: Record<ApprenticeArchetype, ApprenticeIdentity> = {
  zealot: {
    archetype: "zealot",
    likes: ["devotional_text", "engraved_sigil", "red_candle"],
    dislikes: ["heretical_pamphlet", "bourbon", "lottery_ticket"],
    wants: ["argue_a_doctrine", "consecrate_a_room", "convert_someone"],
    avoids: ["philosophical_relativism", "comedy_routines"],
    personalQuest: {
      chainTitle: "The Cause Eats Its Own",
      stage1: {
        title: "The Sermon",
        description:
          "The Zealot has been preaching a recovered scripture in the Commons. They want you to attend and bring witnesses. Bring 2 crew members; the speech will move them or test them.",
      },
      stage2: {
        title: "The Heresy",
        description:
          "An old comrade returns and accuses the doctrine of being a fabrication. Investigate. The truth is uncomfortable: the founder was a charlatan, and the Zealot's faith outgrew the lie.",
      },
      stage3: {
        title: "The Choice",
        description:
          "The Zealot demands you decide for them. Confirm the lie and they break, or affirm the cause is theirs now and they deepen.",
        deepenChoice: {
          label: "The cause is yours now. The founder doesn't matter.",
          consequence:
            "Loyalty +25, romance unlocks, faction-rep gain bonus +10%. The Zealot writes you into the new scripture.",
        },
        breakChoice: {
          label: "The lie was the cause. There's nothing left.",
          consequence:
            "Triggers apprenticeBetrayal — Zealot leaves the ship at next port, becomes a hostile faction-leader cameo in Act 4.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 60,
      preferredPartners: ["martyr", "sentinel", "wraith_calder"],
      courtshipSignature:
        "I would burn for the cause. Tell me you are the cause and I will burn for you.",
    },
    breakingPointLine:
      "Tell me what to believe in and I will believe in it harder than I should.",
  },

  ghost: {
    archetype: "ghost",
    likes: ["silenced_recorder", "shadow_cloak", "untraceable_coin"],
    dislikes: ["spotlight", "official_commendation", "uniform"],
    wants: ["disappear_for_a_day", "watch_unseen", "pay_an_old_debt"],
    avoids: ["public_appearances", "loud_celebrations"],
    personalQuest: {
      chainTitle: "Visible",
      stage1: {
        title: "The Sighting",
        description:
          "Someone identified the Ghost on a security scan. They want to find out who and why. The trail leads back to a job they did pre-recruitment.",
      },
      stage2: {
        title: "The Reckoning",
        description:
          "The job was a quiet murder. The mark's daughter is the one who flagged the scan. She wants to meet the Ghost. The Ghost wants you to handle it.",
      },
      stage3: {
        title: "The Meeting",
        description:
          "Bring the Ghost to the meeting or send them to vanish. The daughter is unarmed.",
        deepenChoice: {
          label: "Bring the Ghost. They face her.",
          consequence:
            "Loyalty +30, the Ghost stops vanishing for days at a time, romance unlocks, stealth bonus +10%.",
        },
        breakChoice: {
          label: "Tell the Ghost to disappear. We'll handle the daughter.",
          consequence:
            "Ghost vanishes that night for good. They reappear in Act 6 as a cameo working for the daughter.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 75,
      preferredPartners: ["sentinel", "scholar", "wraith_calder"],
      courtshipSignature:
        "I have never let anyone follow me into the corridor. You followed me anyway. I noticed.",
    },
    breakingPointLine: "I would rather not be seen. By you, I make exceptions.",
  },

  scholar: {
    archetype: "scholar",
    likes: ["rare_codex", "field_microscope", "annotated_manuscript"],
    dislikes: ["folksy_advice", "intuition_over_evidence", "round_numbers"],
    wants: ["finish_a_paper", "correct_a_colleague", "read_classified_data"],
    avoids: ["unfounded_claims", "anti-intellectualism"],
    personalQuest: {
      chainTitle: "The Footnote",
      stage1: {
        title: "The Citation Trail",
        description:
          "The Scholar is finishing a paper that contradicts a Hierarchy-aligned consensus. They want you to source three rare references. Each requires a side-mission.",
      },
      stage2: {
        title: "The Threat",
        description:
          "A Hierarchy operative pays the Scholar a visit warning them off. The Scholar wants to publish anyway. Decide whether to provide protection.",
      },
      stage3: {
        title: "The Publication",
        description:
          "Publish, retract, or rewrite. The Scholar trusts your judgement.",
        deepenChoice: {
          label: "Publish. We'll handle the consequences.",
          consequence:
            "Loyalty +35, XP gain bonus +10%, romance unlocks, Loredex entry recovered. Hierarchy faction rep -20.",
        },
        breakChoice: {
          label: "Retract. The fight isn't worth it.",
          consequence:
            "Scholar resigns from your crew the next morning. Returns in Act 5 as a Hierarchy-funded researcher publishing the original consensus paper they once opposed.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 65,
      preferredPartners: ["heretic", "ghost", "antiquarian"],
      courtshipSignature:
        "I have catalogued seventeen reasons why this would be a bad idea. I have read all seventeen. I am not deterred.",
    },
    breakingPointLine: "Tell me what you know and I will tell you what it means.",
  },

  revenant: {
    archetype: "revenant",
    likes: ["grave_soil", "old_coin", "iron_lock"],
    dislikes: ["fresh_flowers", "celebration_music", "second_chances_offered_freely"],
    wants: ["pay_an_old_debt", "find_the_one_who_owes_them", "return_a_borrowed_thing"],
    avoids: ["forgetting", "starting_fresh"],
    personalQuest: {
      chainTitle: "The Ledger",
      stage1: {
        title: "The First Mark",
        description:
          "The Revenant has a list. They want to start ticking it off. The first mark is alive on a station two systems over. Take them there.",
      },
      stage2: {
        title: "The Cost",
        description:
          "The first mark is not who the Revenant remembered. The list is wrong in places. The Revenant wants to keep going anyway. Decide whether to humor them.",
      },
      stage3: {
        title: "The Tally",
        description:
          "Burn the list, or finish it. The Revenant is exhausted either way.",
        deepenChoice: {
          label: "Burn it. The debt is paid in the burning.",
          consequence:
            "Loyalty +30, damage-taken reduction +5%, romance unlocks, Revenant sleeps through the night for the first time since rebirth.",
        },
        breakChoice: {
          label: "Finish it. Every name.",
          consequence:
            "Revenant becomes apprenticeBetrayal candidate — corruption rises to 0.9, they leave to finish the list alone, returning as a hostile ambusher in Act 4.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 70,
      preferredPartners: ["martyr", "sentinel", "the_necromancer"],
      courtshipSignature:
        "I owe a great deal. I do not yet know if I owe you. The not-knowing is the most alive I have felt.",
    },
    breakingPointLine: "I came back for a reason. Help me decide which one.",
  },

  artisan: {
    archetype: "artisan",
    likes: ["rare_alloy", "calibration_jig", "single-source_pigment"],
    dislikes: ["mass_produced_tool", "approximation", "rushed_work"],
    wants: ["finish_the_workbench_project", "teach_someone_a_skill", "fix_the_broken_thing_in_the_corner"],
    avoids: ["being_called_an_artist", "showroom_displays"],
    personalQuest: {
      chainTitle: "The Commission",
      stage1: {
        title: "The Brief",
        description:
          "A Coda commission has come in for the Artisan — a piece for a wedding on a mid-tier station. The Artisan asks you to scout the venue and return with measurements.",
      },
      stage2: {
        title: "The Misuse",
        description:
          "Six months later the wedding goes sour and the piece is repurposed as a torture device by the new station governor. The Artisan wants to retrieve it.",
      },
      stage3: {
        title: "The Retrieval",
        description:
          "Steal the piece back, destroy it, or buy it back at the governor's price.",
        deepenChoice: {
          label: "Steal it. Bring it back to the workshop.",
          consequence:
            "Loyalty +35, crafting-quality bonus +10%, romance unlocks, the Artisan begins a new commission *for you*.",
        },
        breakChoice: {
          label: "Destroy it. Some things shouldn't be remade.",
          consequence:
            "Artisan loses faith in the work. Their hands shake. They retire to a port station and stop crafting; visiting them in Act 5 finds them tending a small garden.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 55,
      preferredPartners: ["scholar", "wanderer", "vex_solene"],
      courtshipSignature:
        "I made you something. I won't tell you what it is. You have to use it to find out.",
    },
    breakingPointLine: "I built it well. I cannot control what is done with it. Help me try.",
  },

  oracle: {
    archetype: "oracle",
    likes: ["unread_letter", "fogged_mirror", "blank_dice"],
    dislikes: ["confirmed_prediction", "calendar", "appointment_card"],
    wants: ["interpret_a_dream", "warn_someone", "be_wrong_for_once"],
    avoids: ["being_asked_for_certainty", "scheduled_events"],
    personalQuest: {
      chainTitle: "The Vision That Came True",
      stage1: {
        title: "The Warning",
        description:
          "The Oracle has been writing a vision in their journal. They don't want to share it. You catch them in the corridor; they ask you to keep an eye on a specific crew member.",
      },
      stage2: {
        title: "The Cost",
        description:
          "The vision came true. The crew member they warned about is dead — and not by accident. The Oracle blames themselves for not being clearer.",
      },
      stage3: {
        title: "The Next Vision",
        description:
          "The Oracle has another vision and wants to know whether to share it. Pressure them to speak, or tell them silence is sometimes the kindest prophecy.",
        deepenChoice: {
          label: "Speak. Even when it costs.",
          consequence:
            "Loyalty +30, crit-chance +5%, romance unlocks, the Oracle starts shouldering visions instead of hiding from them.",
        },
        breakChoice: {
          label: "Stop seeing. We don't need more prophecies.",
          consequence:
            "Oracle gives up the gift; their stats normalize; they fade into ambient crew. The vision they didn't share comes true in Act 6.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 80,
      preferredPartners: ["scholar", "heretic", "the_dreamer"],
      courtshipSignature:
        "I saw this conversation. I did not see how it ended. That is the first time in a long time.",
    },
    breakingPointLine: "I see it. I do not always tell you. Tell me when to tell you.",
  },

  wanderer: {
    archetype: "wanderer",
    likes: ["star_chart", "foreign_coin", "travel_journal"],
    dislikes: ["lease_agreement", "season_subscription", "anchor_tattoo"],
    wants: ["take_a_detour", "learn_a_new_word", "leave_a_trail_of_breadcrumbs"],
    avoids: ["committed_routes", "long_term_contracts"],
    personalQuest: {
      chainTitle: "Home, If There Is One",
      stage1: {
        title: "The Map",
        description:
          "The Wanderer has been adding to a private map. They want to take you to one of the locations on it — somewhere they once meant to settle.",
      },
      stage2: {
        title: "The Place",
        description:
          "The place is a war-graveyard. The Wanderer's family is buried there. They want to know if you'd stay long enough for them to say goodbye properly.",
      },
      stage3: {
        title: "The Choice",
        description:
          "Stay another week, or push back to the schedule.",
        deepenChoice: {
          label: "Stay. The schedule will keep.",
          consequence:
            "Loyalty +30, exploration-rewards +10%, romance unlocks, the Wanderer commits a new mark on the map: 'home was here once.'",
        },
        breakChoice: {
          label: "We have to push on. Pay your respects fast.",
          consequence:
            "Wanderer leaves the ship two systems later. Sends a postcard from a port you've never visited. Doesn't say goodbye. Returns in a far-future cameo as the postmistress of an unmarked station.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 60,
      preferredPartners: ["jester", "prodigal", "vex_solene"],
      courtshipSignature:
        "I have never stayed anywhere this long. The novelty is you. I am keeping a list of reasons.",
    },
    breakingPointLine: "I am restless. Tell me a reason to stand still and I will try.",
  },

  martyr: {
    archetype: "martyr",
    likes: ["bandage_kit", "borrowed_jacket", "letter_addressed_to_no_one"],
    dislikes: ["selfishness_lessons", "self_help_book", "mirror"],
    wants: ["take_a_hit_for_someone", "apologize_for_something_not_their_fault", "be_unnecessary"],
    avoids: ["being_thanked", "being_seen_as_essential"],
    personalQuest: {
      chainTitle: "Necessary",
      stage1: {
        title: "The Hit",
        description:
          "The Martyr stepped in front of a shot meant for another crew member. They downplay it. The other crew member tells you it was the third time this month.",
      },
      stage2: {
        title: "The Conversation",
        description:
          "The Martyr believes they're only worth the hits they take. Confront them. They want to be told that's wrong, but they won't say so.",
      },
      stage3: {
        title: "The Test",
        description:
          "Tell them they're necessary as themselves, or tell them to keep doing what they're best at.",
        deepenChoice: {
          label: "You're necessary as you. Stop taking the shots.",
          consequence:
            "Loyalty +35, ally-damage-redirect halved (they take fewer hits), romance unlocks, they begin asking for things instead of offering.",
        },
        breakChoice: {
          label: "Keep doing it. We need you to take the shots.",
          consequence:
            "Martyr dies on the next mission they're sent on. Their last words are the line you said to them. apprenticeBetrayal does not fire — they die loyal. The grief is heavier for it.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 65,
      preferredPartners: ["zealot", "revenant", "locke"],
      courtshipSignature:
        "I would die for the others without thinking. For you, I would think first. That is new.",
    },
    breakingPointLine: "Tell me I'm needed for who I am, not what I take.",
  },

  heretic: {
    archetype: "heretic",
    likes: ["banned_text", "underground_zine", "blasphemy_recorded_live"],
    dislikes: ["official_commendation", "loyalty_oath", "uniform"],
    wants: ["argue_with_authority", "find_an_orthodoxy_to_break", "be_proven_wrong_about_something"],
    avoids: ["being_agreed_with_too_easily", "consensus"],
    personalQuest: {
      chainTitle: "The Right Orthodoxy",
      stage1: {
        title: "The Debate",
        description:
          "The Heretic has been baiting Locke (or another adjudicator-equivalent) into an argument over a Hierarchy-aligned ruling. They want you to hear it. Bring witnesses.",
      },
      stage2: {
        title: "The Discovery",
        description:
          "The Heretic discovers they were wrong on a key point — and the orthodoxy was right. They are devastated.",
      },
      stage3: {
        title: "The Concession",
        description:
          "Tell them losing was the point, or tell them the orthodoxy is wrong about something else and the fight continues.",
        deepenChoice: {
          label: "Losing was the point. You questioned. The system answered.",
          consequence:
            "Loyalty +25, leverage-bonus +10%, romance unlocks, the Heretic becomes a more careful arguer.",
        },
        breakChoice: {
          label: "The system is wrong about something else. Find it.",
          consequence:
            "Heretic spirals into perpetual contrarianism. Triggers apprenticeBetrayal — leaves to start an underground movement, returns in Act 5 as a charismatic faction leader opposing your decisions.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 70,
      preferredPartners: ["scholar", "oracle", "the_necromancer"],
      courtshipSignature:
        "I have never wanted to be agreed with. With you, I want to be agreed with about one specific thing. Don't tell anyone.",
    },
    breakingPointLine: "I question everything. Including this. Tell me the question is worth asking.",
  },

  jester: {
    archetype: "jester",
    likes: ["whoopee_cushion", "punchline_book", "mismatched_socks"],
    dislikes: ["sincerity_award", "earnest_apology", "moment_of_silence"],
    wants: ["land_a_joke_at_a_funeral", "make_a_serious_person_laugh", "be_taken_seriously_for_one_minute"],
    avoids: ["genuine_emotion_in_public", "sincerity"],
    personalQuest: {
      chainTitle: "The Punchline That Doesn't Land",
      stage1: {
        title: "The Funeral",
        description:
          "A crew member's family has died. The Jester wants to do their bit — they think it'll help. You can let them, talk them out of it, or coach them.",
      },
      stage2: {
        title: "The Aftermath",
        description:
          "It went badly (or it didn't). The Jester is shaken either way. They want to talk to you privately, no jokes.",
      },
      stage3: {
        title: "The Real One",
        description:
          "They make a serious confession. Take it seriously, or laugh.",
        deepenChoice: {
          label: "Listen. No joke back.",
          consequence:
            "Loyalty +35, party morale bonus +10%, romance unlocks, the Jester starts pacing their humor — saving the jokes for when they're needed.",
        },
        breakChoice: {
          label: "Match it with a joke. Lighten the mood.",
          consequence:
            "Jester puts the mask back on permanently. They laugh louder. They're funnier. Their bond stops growing. apprenticeBetrayal does not fire — they stay loyal but distant. The grief is in the not-talking.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 75,
      preferredPartners: ["scholar", "wanderer", "antiquarian"],
      courtshipSignature:
        "Hardest crowd I've ever played. I'd like to keep playing it. No bit, just — yeah.",
    },
    breakingPointLine: "I can do a joke. I am asking you to listen instead.",
  },

  sentinel: {
    archetype: "sentinel",
    likes: ["watch_log", "boot_polish", "sealed_perimeter_alarm"],
    dislikes: ["off-duty_invitation", "celebration_drink", "casual_conversation"],
    wants: ["secure_the_perimeter", "memorize_a_new_route", "stand_a_double_watch"],
    avoids: ["small_talk", "off_duty_socializing"],
    personalQuest: {
      chainTitle: "The Watch That Failed",
      stage1: {
        title: "The Breach",
        description:
          "Something got past the Sentinel's perimeter on a previous tour. They've been quietly tracking it ever since. They want backup to follow up the lead.",
      },
      stage2: {
        title: "The Source",
        description:
          "The breach was caused by their old commanding officer, now defected. The Sentinel wants to confront them. Personally.",
      },
      stage3: {
        title: "The Verdict",
        description:
          "Take the old CO in alive, or finish the job.",
        deepenChoice: {
          label: "Take them in alive. Let the courts handle it.",
          consequence:
            "Loyalty +30, ambush-resistance +5%, romance unlocks, the Sentinel sleeps in the bunks instead of the watch-station for the first time.",
        },
        breakChoice: {
          label: "Finish it. The watch was breached. The watch is the law.",
          consequence:
            "Sentinel becomes vigilante-coded. They start refusing the chain of command. apprenticeBetrayal triggers when their next solo decision goes against your orders.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 70,
      preferredPartners: ["zealot", "ghost", "locke"],
      courtshipSignature:
        "I do not let my guard down. With you I have considered it. I have not done it. I have considered it.",
    },
    breakingPointLine: "The watch broke once. Tell me how to hold it again.",
  },

  prodigal: {
    archetype: "prodigal",
    likes: ["return_ticket", "old_address_book", "second_chance_voucher"],
    dislikes: ["welcome_home_banner", "first_meeting_invitation", "fresh_start_speech"],
    wants: ["clear_an_old_debt", "settle_an_old_score", "send_a_letter_home"],
    avoids: ["being_welcomed_too_enthusiastically", "fresh_starts"],
    personalQuest: {
      chainTitle: "The Place I Left",
      stage1: {
        title: "The Letter",
        description:
          "The Prodigal got a letter. The handwriting is old. They won't open it without you in the room.",
      },
      stage2: {
        title: "The Visit",
        description:
          "The letter says someone they wronged is dying and wants to see them. The Prodigal asks you to come. They do not want to make the trip alone.",
      },
      stage3: {
        title: "The Conversation",
        description:
          "Prepare them for the conversation, push them to honesty, or let them lie one last time.",
        deepenChoice: {
          label: "Honesty. Even now.",
          consequence:
            "Loyalty +35, comeback-damage cap raised, romance unlocks, the Prodigal starts writing letters home weekly.",
        },
        breakChoice: {
          label: "Let them lie. It's the kinder thing.",
          consequence:
            "Prodigal gets the absolution and immediately goes back to old patterns. apprenticeBetrayal triggers when they steal from the crew on the next mission.",
        },
      },
    },
    romance: {
      available: true,
      minBondToStart: 70,
      preferredPartners: ["wanderer", "revenant", "jericho_jones"],
      courtshipSignature:
        "I have left every place I have ever loved. I am not leaving this one. I am asking permission to stay.",
    },
    breakingPointLine: "I am the one who came back. Tell me I'm allowed to stay.",
  },
};

/* ─── Sub-task merge — read APPRENTICE_SUBTASKS and attach the 3
 *  sub-tasks per stage to the corresponding personalQuest stage.
 *  Lives at module load so identity readers see the merged shape
 *  without per-callsite plumbing. ─── */
import { APPRENTICE_SUBTASKS } from "./apprenticeSubtasks";
{
  const archetypes = Object.keys(APPRENTICE_IDENTITIES) as ApprenticeArchetype[];
  for (const arch of archetypes) {
    const subs = APPRENTICE_SUBTASKS[arch];
    if (!subs) continue;
    const pq = APPRENTICE_IDENTITIES[arch].personalQuest;
    pq.stage1.subtasks = subs.stage1;
    pq.stage2.subtasks = subs.stage2;
    pq.stage3.subtasks = subs.stage3;
  }
}

/** Lookup helper. */
export function getApprenticeIdentity(archetype: ApprenticeArchetype): ApprenticeIdentity {
  return APPRENTICE_IDENTITIES[archetype];
}

/** Verify all 12 archetypes are present (ship-check parity hook). */
export function getApprenticeIdentityCount(): number {
  return Object.keys(APPRENTICE_IDENTITIES).length;
}
