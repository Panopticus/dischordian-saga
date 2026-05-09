import { describe, it, expect } from "vitest";

import {
  formatResumeReport,
  formatTickEventSummary,
  type TickEventPayload,
} from "../tickEvents";

describe("formatTickEventSummary — every kind formats", () => {
  const samples: TickEventPayload[] = [
    {
      kind: "faction_objective_advanced",
      factionCanonical: "insurgency",
      objectiveId: "awaken_the_faithful",
      stageId: "indoctrinate",
      stageLabel: "Indoctrinate the carriers",
    },
    {
      kind: "npc_agenda_stage_fired",
      npcKey: "adjudicator_locke",
      agendaKey: "agenda.locke.bind_a_partner",
      stageId: "shortlist",
      stageLabel: "Shortlist drafted",
    },
    {
      kind: "npc_agenda_countered",
      npcKey: "nilmorg",
      agendaKey: "agenda.nilmorg.take_the_trench",
      stageId: "scout",
      counterDescription: "Independent contract closed first",
    },
    {
      kind: "shadow_tongue_redaction_revealed",
      entryId: "entity_105",
      revealedBy: "antiquarian_research",
    },
    {
      kind: "shadow_tongue_power_changed",
      previousLevel: 40,
      newLevel: 55,
    },
    {
      kind: "architect_plot_beat",
      beatId: "archive_dormant_activated",
      consequence: "A dormant archive came back online; the Antiquarian noticed first.",
    },
    {
      kind: "dreamer_plot_beat",
      beatId: "prophecy_fragment_revealed",
      consequence: "A prophecy fragment surfaced through the Oracle's broadcast.",
    },
    {
      kind: "loredex_entry_revealed",
      entryId: "entity_1",
      revealedVia: "antiquarian_research",
    },
    {
      kind: "memorial_inscribed",
      inscriptionId: "inscription_42",
      memorialFor: "Marion Kell",
    },
  ];

  it.each(samples)("kind=%s formats to a non-empty string", (sample) => {
    const summary = formatTickEventSummary(sample);
    expect(summary).toBeTruthy();
    expect(summary.length).toBeGreaterThan(8);
  });

  it("Shadow Tongue power change uses different verbs for rises and falls", () => {
    const rise = formatTickEventSummary({
      kind: "shadow_tongue_power_changed",
      previousLevel: 30,
      newLevel: 60,
    });
    const fall = formatTickEventSummary({
      kind: "shadow_tongue_power_changed",
      previousLevel: 60,
      newLevel: 30,
    });
    expect(rise.toLowerCase()).toMatch(/grew|rose|increased|louder|moved/);
    expect(fall.toLowerCase()).toMatch(/receded|fell|decreased/);
  });

  it("faction headlines use the canonical human name", () => {
    const headline = formatTickEventSummary({
      kind: "faction_objective_advanced",
      factionCanonical: "hierarchy_of_damned",
      objectiveId: "siege_of_potentials",
      stageId: "mark",
      stageLabel: "Targets marked",
    });
    expect(headline).toContain("Hierarchy of the Damned");
  });

  it("NPC headlines humanise the snake_case key", () => {
    const headline = formatTickEventSummary({
      kind: "npc_agenda_stage_fired",
      npcKey: "wraith_calder",
      agendaKey: "agenda.wraith.cultivate_the_successor",
      stageId: "transmit_method",
      stageLabel: "Method transmitted",
    });
    expect(headline).toContain("Wraith Calder");
  });
});

describe("formatResumeReport", () => {
  it("renders a multi-line bulleted summary", () => {
    const events: TickEventPayload[] = [
      {
        kind: "npc_agenda_stage_fired",
        npcKey: "adjudicator_locke",
        agendaKey: "agenda.locke.bind_a_partner",
        stageId: "shortlist",
        stageLabel: "Shortlist drafted",
      },
      {
        kind: "shadow_tongue_redaction_revealed",
        entryId: "entity_105",
        revealedBy: "antiquarian_research",
      },
    ];
    const report = formatResumeReport(events);
    const lines = report.split("\n");
    expect(lines.length).toBe(2);
    expect(lines.every(l => l.startsWith("•"))).toBe(true);
  });

  it("respects bullet override and maxLines", () => {
    const events: TickEventPayload[] = Array.from({ length: 5 }, (_, i) => ({
      kind: "memorial_inscribed",
      inscriptionId: `i${i}`,
      memorialFor: `Person ${i}`,
    }));
    const report = formatResumeReport(events, {
      bullet: "—",
      maxLines: 3,
    });
    const lines = report.split("\n");
    expect(lines.length).toBe(3);
    expect(lines.every(l => l.startsWith("—"))).toBe(true);
  });

  it("empty events list produces empty string", () => {
    expect(formatResumeReport([])).toBe("");
  });
});
