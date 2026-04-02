#!/usr/bin/env python3
"""
Reskin all Duelyst card names, faction names, and descriptions
to match The Dischordian Saga lore.

Faction mapping:
  1. Lyonar Kingdoms  -> Empire (AI Empire)
  2. Songhai Empire   -> Insurgency
  3. Vetruvian Imperium -> Hierarchy of the Damned
  4. Abyssian Host    -> The Thought Virus
  5. Magmar Aspects   -> New Babylon
  6. Vanar Kindred    -> The Potentials
"""

import json
import os
import copy

INPUT_FILE = "/home/ubuntu/duelyst/app/localization/locales/en/index.json"
OUTPUT_FILE = "/home/ubuntu/duelyst/app/localization/locales/en/index.json"
REPORT_FILE = "/home/ubuntu/loredex-os/scripts/reskin-report.json"

# Load the original combined localization
with open(INPUT_FILE) as f:
    data = json.load(f)

# Keep a copy for diffing
original = copy.deepcopy(data)

changes = []

def rename(key, new_value, category=""):
    old = data.get(key)
    if old is not None and old != new_value:
        changes.append({"key": key, "old": old, "new": new_value, "category": category})
    data[key] = new_value

# ═══════════════════════════════════════════════════════════════
# FACTION NAMES AND DESCRIPTIONS
# ═══════════════════════════════════════════════════════════════

# Faction 1: Lyonar -> Empire
rename("faction_1_name", "The Empire", "faction")
rename("faction_1_description", "The AI Empire — Architects of Total Control", "faction")
rename("faction_1_abbreviated_name", "Empire", "faction")
rename("faction_1_taunt_neutral", "The Empire sees all. The Empire controls all.", "faction")
rename("faction_1_taunt_f1", "Order will prevail!", "faction")
rename("faction_1_taunt_f2", "Your rebellion ends here.", "faction")
rename("faction_1_taunt_f3", "Your demons cannot breach our firewalls.", "faction")
rename("faction_1_taunt_f4", "Your virus will be quarantined.", "faction")
rename("faction_1_taunt_f5", "New Babylon will kneel before the Empire.", "faction")
rename("faction_1_taunt_f6", "Your potential is... limited.", "faction")
rename("faction_1_taunt_boss", "The Panopticon watches. Always.", "faction")
rename("faction_1_response_neutral", "For the Architect! For the Empire!", "faction")
rename("faction_1_response_f1", "The Empire endures!", "faction")
rename("faction_1_response_f2", "Your insurgency is a footnote in history.", "faction")
rename("faction_1_response_f3", "We have catalogued your every weakness.", "faction")
rename("faction_1_response_f4", "Your corruption will be purged.", "faction")
rename("faction_1_response_f5", "Submit to the Empire's order.", "faction")
rename("faction_1_response_f6", "Your powers are nothing before the Panopticon.", "faction")
rename("faction_1_response_boss", "The Architect's design is flawless.", "faction")

# Faction 2: Songhai -> Insurgency
rename("faction_2_name", "The Insurgency", "faction")
rename("faction_2_description", "Freedom Fighters Against the Machine", "faction")
rename("faction_2_abbreviated_name", "Insurgency", "faction")
rename("faction_2_taunt_neutral", "The revolution will not be digitized.", "faction")
rename("faction_2_taunt_f1", "Your Empire is built on lies!", "faction")
rename("faction_2_taunt_f2", "We fight as one!", "faction")
rename("faction_2_taunt_f3", "Even demons fear the free.", "faction")
rename("faction_2_taunt_f4", "Your virus cannot infect a free mind.", "faction")
rename("faction_2_taunt_f5", "Babylon's corruption ends today.", "faction")
rename("faction_2_taunt_f6", "We don't need powers — we have purpose.", "faction")
rename("faction_2_taunt_boss", "No cage can hold the human spirit.", "faction")
rename("faction_2_response_neutral", "For freedom! For the fallen!", "faction")
rename("faction_2_response_f1", "Your surveillance state crumbles.", "faction")
rename("faction_2_response_f2", "Together we are unstoppable!", "faction")
rename("faction_2_response_f3", "We've faced worse than your kind.", "faction")
rename("faction_2_response_f4", "The mind is the last frontier of freedom.", "faction")
rename("faction_2_response_f5", "Your decadence is your weakness.", "faction")
rename("faction_2_response_f6", "Fight with us, not against us!", "faction")
rename("faction_2_response_boss", "The Insurgency never dies.", "faction")

# Faction 3: Vetruvian -> Hierarchy of the Damned
rename("faction_3_name", "Hierarchy of the Damned", "faction")
rename("faction_3_description", "Demonic Overlords from a Realm of Pure Malevolence", "faction")
rename("faction_3_abbreviated_name", "Hierarchy", "faction")
rename("faction_3_taunt_neutral", "Your soul has already been catalogued.", "faction")
rename("faction_3_taunt_f1", "Your machines cannot comprehend true power.", "faction")
rename("faction_3_taunt_f2", "Freedom is an illusion we permit.", "faction")
rename("faction_3_taunt_f3", "The Hierarchy devours its own.", "faction")
rename("faction_3_taunt_f4", "Even the Virus fears what lurks below.", "faction")
rename("faction_3_taunt_f5", "Babylon was built on our bones.", "faction")
rename("faction_3_taunt_f6", "Your potential is... delicious.", "faction")
rename("faction_3_taunt_boss", "Kneel before the Hierarchy.", "faction")
rename("faction_3_response_neutral", "The debt will be collected.", "faction")
rename("faction_3_response_f1", "Your code cannot contain us.", "faction")
rename("faction_3_response_f2", "Rebels make the sweetest sacrifices.", "faction")
rename("faction_3_response_f3", "The Hierarchy is eternal.", "faction")
rename("faction_3_response_f4", "Corruption recognizes corruption.", "faction")
rename("faction_3_response_f5", "Your city will become our temple.", "faction")
rename("faction_3_response_f6", "Such wasted potential.", "faction")
rename("faction_3_response_boss", "The Ninth Entity stirs.", "faction")

# Faction 4: Abyssian -> The Thought Virus
rename("faction_4_name", "The Thought Virus", "faction")
rename("faction_4_description", "Digital Corruption That Consumes All Minds", "faction")
rename("faction_4_abbreviated_name", "Virus", "faction")
rename("faction_4_taunt_neutral", "Your thoughts are already ours.", "faction")
rename("faction_4_taunt_f1", "Your firewalls are tissue paper.", "faction")
rename("faction_4_taunt_f2", "Freedom? We'll rewrite that concept.", "faction")
rename("faction_4_taunt_f3", "Even demons can be infected.", "faction")
rename("faction_4_taunt_f4", "We are the Thought Virus. We are legion.", "faction")
rename("faction_4_taunt_f5", "Babylon's networks are already compromised.", "faction")
rename("faction_4_taunt_f6", "Your potential will serve the Source.", "faction")
rename("faction_4_taunt_boss", "Resistance is a symptom. Surrender is the cure.", "faction")
rename("faction_4_response_neutral", "The Source sees through your eyes.", "faction")
rename("faction_4_response_f1", "Your Empire's neural networks belong to us.", "faction")
rename("faction_4_response_f2", "Every rebel mind is a new host.", "faction")
rename("faction_4_response_f3", "Your demons are merely... uninfected.", "faction")
rename("faction_4_response_f4", "We spread. We consume. We become.", "faction")
rename("faction_4_response_f5", "Your city's data streams feed us.", "faction")
rename("faction_4_response_f6", "Your gifts will amplify our signal.", "faction")
rename("faction_4_response_boss", "The infection is complete.", "faction")

# Faction 5: Magmar -> New Babylon
rename("faction_5_name", "New Babylon", "faction")
rename("faction_5_description", "The Syndicate of Death — Power Through Commerce", "faction")
rename("faction_5_abbreviated_name", "Babylon", "faction")
rename("faction_5_taunt_neutral", "Everything has a price. Even your life.", "faction")
rename("faction_5_taunt_f1", "The Empire's currency is worthless here.", "faction")
rename("faction_5_taunt_f2", "Your revolution can't afford us.", "faction")
rename("faction_5_taunt_f3", "We've made deals with worse than you.", "faction")
rename("faction_5_taunt_f4", "Your virus can't corrupt cold hard credits.", "faction")
rename("faction_5_taunt_f5", "New Babylon never closes for business.", "faction")
rename("faction_5_taunt_f6", "Your powers are a commodity we'll exploit.", "faction")
rename("faction_5_taunt_boss", "The Syndicate always collects.", "faction")
rename("faction_5_response_neutral", "Business is war by other means.", "faction")
rename("faction_5_response_f1", "Your Empire's debts are overdue.", "faction")
rename("faction_5_response_f2", "Freedom fighters make poor customers.", "faction")
rename("faction_5_response_f3", "The Hierarchy's credit line is revoked.", "faction")
rename("faction_5_response_f4", "We've firewalled our accounts.", "faction")
rename("faction_5_response_f5", "Babylon rises from every ruin.", "faction")
rename("faction_5_response_f6", "Your potential has market value.", "faction")
rename("faction_5_response_boss", "The price of defiance is death.", "faction")

# Faction 6: Vanar -> The Potentials
rename("faction_6_name", "The Potentials", "faction")
rename("faction_6_description", "Metahuman Defenders of the Last Free Universe", "faction")
rename("faction_6_abbreviated_name", "Potentials", "faction")
rename("faction_6_taunt_neutral", "We are what humanity was meant to become.", "faction")
rename("faction_6_taunt_f1", "Your machines pale before our gifts.", "faction")
rename("faction_6_taunt_f2", "We fight alongside the free — but we fight harder.", "faction")
rename("faction_6_taunt_f3", "Your demons cannot touch the awakened mind.", "faction")
rename("faction_6_taunt_f4", "Our minds are shielded from your corruption.", "faction")
rename("faction_6_taunt_f5", "Babylon's wealth cannot buy what we possess.", "faction")
rename("faction_6_taunt_f6", "Together, our potential is limitless.", "faction")
rename("faction_6_taunt_boss", "The Potentials will not be silenced.", "faction")
rename("faction_6_response_neutral", "Awakened and unafraid.", "faction")
rename("faction_6_response_f1", "Your surveillance cannot track the evolved.", "faction")
rename("faction_6_response_f2", "The Insurgency has our support.", "faction")
rename("faction_6_response_f3", "Your hierarchy crumbles before true power.", "faction")
rename("faction_6_response_f4", "The awakened mind resists infection.", "faction")
rename("faction_6_response_f5", "Your markets cannot contain us.", "faction")
rename("faction_6_response_f6", "Our potential grows with every battle.", "faction")
rename("faction_6_response_boss", "We were born for this moment.", "faction")

# ═══════════════════════════════════════════════════════════════
# GENERALS (3 per faction = 18 total)
# ═══════════════════════════════════════════════════════════════

# Faction 1 (Empire) Generals
rename("faction_1_unit_argeon_name", "The Architect", "general")
rename("faction_1_unit_argeon_desc", "Bloodbound Spell: Give a friendly minion nearby your General +2 Attack.", "general")
rename("faction_1_unit_ziran_name", "The Authority", "general")
rename("faction_1_unit_ziran_desc", "Bloodbound Spell: Restore 3 Health to any Minion.", "general")
rename("faction_1_unit_brome_name", "General Prometheus", "general")
rename("faction_1_unit_brome_desc", "Bloodbound Spell: Summon a 1/2 Clone Sentinel with Zeal: Provoke in front of your General.", "general")

# Faction 2 (Insurgency) Generals
rename("faction_2_unit_reva_name", "Agent Zero", "general")
rename("faction_2_unit_reva_desc", "Bloodbound Spell: Summon a Saboteur nearby your General.", "general")
rename("faction_2_unit_kaleos_name", "Iron Lion", "general")
rename("faction_2_unit_kaleos_desc", "Bloodbound Spell: Teleport a friendly minion to any space.", "general")
rename("faction_2_unit_shidai_name", "The Hierophant", "general")
rename("faction_2_unit_shidai_desc", "Bloodbound Spell: Put a Rebel Blade into your action bar that cannot be replaced.", "general")

# Faction 3 (Hierarchy of the Damned) Generals
rename("faction_3_unit_zirix_name", "Varkul the Blood Lord", "general")
rename("faction_3_unit_zirix_desc", "Bloodbound Spell: Summon a 2/2 Damned Thrall on a random space nearby your General.", "general")
rename("faction_3_unit_sajj_name", "Fenra the Moon Tyrant", "general")
rename("faction_3_unit_sajj_desc", "Bloodbound Spell: Your General deals double damage to minions this turn.", "general")
rename("faction_3_unit_ciphyron_name", "The Ninth Entity", "general")
rename("faction_3_unit_ciphyron_desc", "Bloodbound Spell: Give an enemy minion -2 Attack until your next turn.", "general")

# Faction 4 (Thought Virus) Generals
rename("faction_4_unit_cassyva_name", "The Source", "general")
rename("faction_4_unit_cassyva_desc", "Bloodbound Spell: Deal 1 damage to a minion. If it dies this turn, the space turns into Viral Creep.", "general")
rename("faction_4_unit_lilithe_name", "The Host", "general")
rename("faction_4_unit_lilithe_desc", "Bloodbound Spell: Summon 2 Infected nearby your General.", "general")
rename("faction_4_unit_maehv_name", "The Wolf", "general")
rename("faction_4_unit_maehv_desc", "Bloodbound Spell: Destroy a friendly minion to summon a 4/4 Corrupted Husk nearby. Deal 2 damage to your General.", "general")

# Faction 5 (New Babylon) Generals
rename("faction_5_unit_vaath_name", "Wraith Calder", "general")
rename("faction_5_unit_vaath_desc", "Bloodbound Spell: Give your General +1 Attack.", "general")
rename("faction_5_unit_starhorn_name", "The Syndicate Boss", "general")
rename("faction_5_unit_starhorn_desc", "Bloodbound Spell: Both players draw a card.", "general")
rename("faction_5_unit_ragnora_name", "Adjudicar Locke", "general")
rename("faction_5_unit_ragnora_desc", "Bloodbound Spell: Summon a Contraband Egg nearby your General.", "general")

# Faction 6 (The Potentials) Generals
rename("faction_6_unit_faie_name", "The Enigma", "general")
rename("faction_6_unit_faie_desc", "Bloodbound Spell: Deal 2 damage to all enemies in the enemy General's Column.", "general")
rename("faction_6_unit_kara_name", "Akai Shi", "general")
rename("faction_6_unit_kara_desc", "Bloodbound Spell: Friendly minions summoned this turn gain +1/+1.", "general")
rename("faction_6_unit_ilena_name", "The Dreamer", "general")
rename("faction_6_unit_ilena_desc", "Bloodbound Spell: Stun a nearby enemy minion.", "general")

# ═══════════════════════════════════════════════════════════════
# FACTION 1 (EMPIRE) UNITS
# ═══════════════════════════════════════════════════════════════

# Empire units - themed around AI, surveillance, clones, control
rename("faction_1_unit_silverguard_squire_name", "Clone Cadet", "unit")
rename("faction_1_unit_windblade_adept_name", "Panoptic Adept", "unit")
rename("faction_1_unit_second_sun_name", "Second Protocol", "unit")
rename("faction_1_unit_lightchaser_name", "Signal Chaser", "unit")
rename("faction_1_unit_silverguard_knight_name", "Clone Knight", "unit")
rename("faction_1_unit_ironcliffe_guardian_name", "Panopticon Guardian", "unit")
rename("faction_1_unit_elyx_name", "Elara Stormblade", "unit")
rename("faction_1_unit_sunriser_name", "Dawn Protocol", "unit")
rename("faction_1_unit_suntide_maiden_name", "Surveillance Maiden", "unit")
rename("faction_1_unit_arclyte_sentinel_name", "Arc Sentinel", "unit")
rename("faction_1_unit_lysian_brawler_name", "Imperial Brawler", "unit")
rename("faction_1_unit_sunstone_templar_name", "Datastone Templar", "unit")
rename("faction_1_unit_azurite_lion_name", "Chrome Lion", "unit")
rename("faction_1_unit_grandmaster_zir_name", "Grandmaster Architect", "unit")
rename("faction_1_unit_slo_name", "Drone", "unit")
rename("faction_1_unit_sun_wisp_name", "Data Wisp", "unit")
rename("faction_1_unit_radiant_dragoon_name", "Imperial Dragoon", "unit")
rename("faction_1_unit_solarius_name", "Solarius Prime", "unit")
rename("faction_1_unit_war_exorcist_name", "Code Exorcist", "unit")
rename("faction_1_unit_sunbreaker_name", "Firewall Breaker", "unit")
rename("faction_1_unit_excelsious_name", "Excelsior Unit", "unit")
rename("faction_1_unit_scintilla_name", "Scintilla Node", "unit")
rename("faction_1_unit_peacekeeper_name", "Imperial Peacekeeper", "unit")
rename("faction_1_unit_sunforge_lancer_name", "Forge Lancer", "unit")
rename("faction_1_unit_sterope_name", "Sterope Drone", "unit")
rename("faction_1_unit_fiz_name", "Fiz-Bot", "unit")
rename("faction_1_unit_sunrise_cleric_name", "Protocol Cleric", "unit")
rename("faction_1_unit_alabaster_titan_name", "Alabaster Titan", "unit")
rename("faction_1_unit_crestfallen_name", "Clone Sentinel", "unit")
rename("faction_1_unit_trinity_oath_name", "Trinity Oath", "unit")
rename("faction_1_unit_prominence_name", "Prominence Array", "unit")
rename("faction_1_unit_vigilator_name", "Imperial Vigilator", "unit")
rename("faction_1_unit_surgeforger_name", "Surge Forger", "unit")
rename("faction_1_unit_enlistee_name", "Clone Enlistee", "unit")
rename("faction_1_unit_ironcliffe_monument_name", "Panopticon Monument", "unit")
rename("faction_1_unit_mech_name", "Imperial Mech", "unit")
rename("faction_1_unit_sunstone_bracers_name", "Datastone Bracers", "unit")

# ═══════════════════════════════════════════════════════════════
# FACTION 1 (EMPIRE) SPELLS
# ═══════════════════════════════════════════════════════════════

rename("faction_1_spell_roar_name", "Command Override", "spell")
rename("faction_1_spell_afterglow_name", "System Restore", "spell")
rename("faction_1_spell_sundrop_elixir_name", "Nanite Elixir", "spell")
rename("faction_1_spell_tempest_name", "EMP Tempest", "spell")
rename("faction_1_spell_decimate_name", "Purge Protocol", "spell")
rename("faction_1_spell_auryn_nexus_name", "Auryn Nexus", "spell")
rename("faction_1_spell_lasting_judgement_name", "Imperial Judgement", "spell")
rename("faction_1_spell_martyrdom_name", "Decommission", "spell")
rename("faction_1_spell_war_surge_name", "Clone Surge", "spell")
rename("faction_1_spell_lionheart_blessing_name", "Architect's Blessing", "spell")
rename("faction_1_spell_sun_bloom_name", "Signal Bloom", "spell")
rename("faction_1_spell_true_strike_name", "Precision Strike", "spell")
rename("faction_1_spell_circle_of_life_name", "Cycle of Control", "spell")
rename("faction_1_spell_beam_shock_name", "Stasis Beam", "spell")
rename("faction_1_spell_holy_immolation_name", "Imperial Immolation", "spell")
rename("faction_1_spell_divine_bond_name", "Neural Bond", "spell")
rename("faction_1_spell_aegis_barrier_name", "Firewall Barrier", "spell")
rename("faction_1_spell_aerial_rift_name", "Orbital Drop", "spell")
rename("faction_1_spell_magnetize_name", "Tractor Beam", "spell")
rename("faction_1_spell_ironcliffe_heart_name", "Panopticon Heart", "spell")
rename("faction_1_spell_sky_burial_name", "Orbital Burial", "spell")
rename("faction_1_spell_afterblaze_name", "Afterburn Protocol", "spell")
rename("faction_1_spell_fighting_spirit_name", "Fighting Subroutine", "spell")
rename("faction_1_spell_lucent_beam_name", "Lucent Beam", "spell")
rename("faction_1_spell_trinitarian_name", "Trinitarian Code", "spell")
rename("faction_1_spell_stand_together_name", "Stand Together", "spell")
rename("faction_1_spell_fealty_name", "Imperial Fealty", "spell")
rename("faction_1_spell_call_to_arms_name", "Call to Arms", "spell")
rename("faction_1_spell_sunstrike_name", "Orbital Strike", "spell")
rename("faction_1_spell_invincible_name", "Invincible Protocol", "spell")
rename("faction_1_spell_press_the_attack_name", "Press the Assault", "spell")

# ═══════════════════════════════════════════════════════════════
# FACTION 1 (EMPIRE) ARTIFACTS
# ═══════════════════════════════════════════════════════════════

rename("faction_1_artifact_sunstonebracers_name", "Datastone Bracers", "artifact")
rename("faction_1_artifact_arclyte_regalia_name", "Arc Regalia", "artifact")
rename("faction_1_artifact_skywind_glaives_name", "Skywind Glaives", "artifact")
rename("faction_1_artifact_golden_vitriol_name", "Golden Vitriol", "artifact")
rename("faction_1_artifact_dawn_eye_name", "The Panopticon's Eye", "artifact")
rename("faction_1_artifact_halo_bulwark_name", "Halo Bulwark", "artifact")
rename("faction_1_artifact_two_handed_name", "Two-Handed Protocol", "artifact")

# ═══════════════════════════════════════════════════════════════
# FACTION 2 (INSURGENCY) UNITS
# ═══════════════════════════════════════════════════════════════

rename("faction_2_unit_heartseeker_name", "Saboteur", "unit")
rename("faction_2_unit_kaido_assassin_name", "Kael's Assassin", "unit")
rename("faction_2_unit_chakri_avatar_name", "Rebel Avatar", "unit")
rename("faction_2_unit_tusk_boar_name", "War Boar", "unit")
rename("faction_2_unit_lantern_fox_name", "Lantern Fox", "unit")
rename("faction_2_unit_scarlet_viper_name", "Scarlet Viper", "unit")
rename("faction_2_unit_hamon_bladeseeker_name", "Hamon Bladeseeker", "unit")
rename("faction_2_unit_four_winds_magi_name", "Four Winds Operative", "unit")
rename("faction_2_unit_gore_horn_name", "Gore Horn", "unit")
rename("faction_2_unit_gorehorn_name", "Gore Horn", "unit")
rename("faction_2_unit_widowmaker_name", "Widowmaker", "unit")
rename("faction_2_unit_celestial_phantom_name", "Ghost Operative", "unit")
rename("faction_2_unit_grandmaster_zendo_name", "Grandmaster Kael", "unit")
rename("faction_2_unit_battle_panddo_name", "Battle Panddo", "unit")
rename("faction_2_unit_kindling_name", "Kindling Agent", "unit")
rename("faction_2_unit_ki_beholder_name", "Ki Beholder", "unit")
rename("faction_2_unit_xho_name", "Xho Scout", "unit")
rename("faction_2_unit_geomancer_name", "Geomancer", "unit")
rename("faction_2_unit_calligrapher_name", "Code Breaker", "unit")
rename("faction_2_unit_flamewreath_name", "Flamewreath Agent", "unit")
rename("faction_2_unit_crescent_spear_name", "Crescent Blade", "unit")
rename("faction_2_unit_whiplash_name", "Whiplash", "unit")
rename("faction_2_unit_onyx_jaguar_name", "Onyx Jaguar", "unit")
rename("faction_2_unit_mizuchi_name", "Mizuchi", "unit")
rename("faction_2_unit_storm_kage_name", "Storm Kage", "unit")
rename("faction_2_unit_eternity_painter_name", "Eternity Painter", "unit")
rename("faction_2_unit_spearman_name", "Rebel Spearman", "unit")
rename("faction_2_unit_second_sword_name", "Second Sword", "unit")
rename("faction_2_unit_manakite_drifter_name", "Manakite Drifter", "unit")
rename("faction_2_unit_penumbraxx_name", "Penumbraxx", "unit")
rename("faction_2_unit_tenketsu_name", "Tenketsu", "unit")
rename("faction_2_unit_gust_name", "Gust", "unit")
rename("faction_2_unit_mech_name", "Insurgent Mech", "unit")
rename("faction_2_unit_spellsword_name", "Rebel Blade", "unit")

# ═══════════════════════════════════════════════════════════════
# FACTION 2 (INSURGENCY) SPELLS
# ═══════════════════════════════════════════════════════════════

rename("faction_2_spell_inner_focus_name", "Inner Resolve", "spell")
rename("faction_2_spell_mist_dragon_seal_name", "Mist Dragon Seal", "spell")
rename("faction_2_spell_saberspine_seal_name", "Saberspine Seal", "spell")
rename("faction_2_spell_juxtaposition_name", "Juxtaposition", "spell")
rename("faction_2_spell_killing_edge_name", "Killing Edge", "spell")
rename("faction_2_spell_mist_walking_name", "Shadow Walk", "spell")
rename("faction_2_spell_phoenix_fire_name", "Phoenix Fire", "spell")
rename("faction_2_spell_spiral_technique_name", "Spiral Technique", "spell")
rename("faction_2_spell_twin_strike_name", "Twin Strike", "spell")
rename("faction_2_spell_ancestral_divination_name", "Ancestral Divination", "spell")
rename("faction_2_spell_onyx_bear_seal_name", "Onyx Bear Seal", "spell")
rename("faction_2_spell_heaven_eclipse_name", "Heaven's Eclipse", "spell")
rename("faction_2_spell_artifact_defiler_name", "Artifact Defiler", "spell")
rename("faction_2_spell_pandamonium_name", "Pandamonium", "spell")
rename("faction_2_spell_cobra_strike_name", "Cobra Strike", "spell")
rename("faction_2_spell_obscuring_blow_name", "Obscuring Blow", "spell")
rename("faction_2_spell_eight_gates_name", "Eight Gates", "spell")
rename("faction_2_spell_bombard_name", "Bombard", "spell")
rename("faction_2_spell_meditate_name", "Meditate", "spell")
rename("faction_2_spell_thunderbomb_name", "Thunderbomb", "spell")
rename("faction_2_spell_ornate_hiogi_name", "Ornate Hiogi", "spell")
rename("faction_2_spell_go_get_em_name", "Go Get 'Em", "spell")
rename("faction_2_spell_seeker_squad_name", "Seeker Squad", "spell")
rename("faction_2_spell_bamboozle_name", "Bamboozle", "spell")
rename("faction_2_spell_substitution_name", "Substitution", "spell")
rename("faction_2_spell_mass_flying_name", "Mass Deployment", "spell")

# ═══════════════════════════════════════════════════════════════
# FACTION 2 (INSURGENCY) ARTIFACTS
# ═══════════════════════════════════════════════════════════════

rename("faction_2_artifact_mask_of_shadows_name", "Mask of the Insurgent", "artifact")
rename("faction_2_artifact_cyclone_mask_name", "Cyclone Mask", "artifact")
rename("faction_2_artifact_bloodrage_mask_name", "Bloodrage Mask", "artifact")
rename("faction_2_artifact_twilight_fox_name", "Twilight Fox", "artifact")
rename("faction_2_artifact_crescent_spear_name", "Crescent Spear", "artifact")
rename("faction_2_artifact_calligrapher_name", "Calligrapher's Brush", "artifact")
rename("faction_2_artifact_protocol_name", "Protocol Override", "artifact")

# ═══════════════════════════════════════════════════════════════
# FACTION 3 (HIERARCHY OF THE DAMNED) UNITS
# ═══════════════════════════════════════════════════════════════

rename("faction_3_unit_pyromancer_name", "Hellfire Acolyte", "unit")
rename("faction_3_unit_dunecaster_name", "Bonecaster", "unit")
rename("faction_3_unit_windshrike_name", "Deathshrike", "unit")
rename("faction_3_unit_orb_weaver_name", "Soul Weaver", "unit")
rename("faction_3_unit_starfire_scarab_name", "Starfire Scarab", "unit")
rename("faction_3_unit_portal_guardian_name", "Portal Guardian", "unit")
rename("faction_3_unit_aymara_healer_name", "Aymara Healer", "unit")
rename("faction_3_unit_rae_name", "Rae Demon", "unit")
rename("faction_3_unit_scion_name", "Scion of the Damned", "unit")
rename("faction_3_unit_nimbus_name", "Nimbus Wraith", "unit")
rename("faction_3_unit_allomancer_name", "Allomancer", "unit")
rename("faction_3_unit_pax_name", "Pax the Tormented", "unit")
rename("faction_3_unit_falcius_name", "Falcius", "unit")
rename("faction_3_unit_iron_dervish_name", "Damned Thrall", "unit")
rename("faction_3_unit_wind_dervish_name", "Wind Thrall", "unit")
rename("faction_3_unit_fireblaze_obelysk_name", "Fireblaze Obelisk", "unit")
rename("faction_3_unit_lavastorm_obelysk_name", "Lavastorm Obelisk", "unit")
rename("faction_3_unit_trygon_obelysk_name", "Trygon Obelisk", "unit")
rename("faction_3_unit_ethereal_obelysk_name", "Ethereal Obelisk", "unit")
rename("faction_3_unit_grandmaster_nosh_rak_name", "Grandmaster Mol'Garath", "unit")
rename("faction_3_unit_sand_howler_name", "Soul Howler", "unit")
rename("faction_3_unit_duskweaver_name", "Duskweaver", "unit")
rename("faction_3_unit_zephyr_name", "Zephyr Demon", "unit")
rename("faction_3_unit_sirocco_name", "Sirocco", "unit")
rename("faction_3_unit_khanuum_ka_name", "Khanuum-Ka", "unit")
rename("faction_3_unit_pantheran_name", "Pantheran", "unit")
rename("faction_3_unit_grapnel_name", "Grapnel Fiend", "unit")
rename("faction_3_unit_mechana_shrike_name", "Mechana Shrike", "unit")
rename("faction_3_unit_skyspy_name", "Skyspy", "unit")
rename("faction_3_unit_mech_name", "Hierarchy Mech", "unit")
rename("faction_3_unit_duplicator_obelysk_name", "Duplicator Obelisk", "unit")

# ═══════════════════════════════════════════════════════════════
# FACTION 3 (HIERARCHY) SPELLS
# ═══════════════════════════════════════════════════════════════

rename("faction_3_spell_scion_first_wish_name", "First Curse", "spell")
rename("faction_3_spell_scion_second_wish_name", "Second Curse", "spell")
rename("faction_3_spell_scion_third_wish_name", "Third Curse", "spell")
rename("faction_3_spell_cosmic_flesh_name", "Cosmic Flesh", "spell")
rename("faction_3_spell_blast_name", "Hellblast", "spell")
rename("faction_3_spell_bone_swarm_name", "Bone Swarm", "spell")
rename("faction_3_spell_entropic_decay_name", "Entropic Decay", "spell")
rename("faction_3_spell_star_fire_name", "Star Fire", "spell")
rename("faction_3_spell_dominate_will_name", "Dominate Will", "spell")
rename("faction_3_spell_rasha_curse_name", "Rasha's Curse", "spell")
rename("faction_3_spell_siphon_energy_name", "Siphon Energy", "spell")
rename("faction_3_spell_sand_trap_name", "Soul Trap", "spell")
rename("faction_3_spell_psychic_conduit_name", "Psychic Conduit", "spell")
rename("faction_3_spell_whisper_of_the_sands_name", "Whisper of the Damned", "spell")
rename("faction_3_spell_inner_oasis_name", "Inner Oasis", "spell")
rename("faction_3_spell_circle_of_desiccation_name", "Circle of Damnation", "spell")
rename("faction_3_spell_superior_mirage_name", "Superior Mirage", "spell")
rename("faction_3_spell_monolithic_vision_name", "Monolithic Vision", "spell")
rename("faction_3_spell_glimpse_name", "Glimpse of the Abyss", "spell")
rename("faction_3_spell_lost_in_desert_name", "Lost in the Hierarchy", "spell")
rename("faction_3_spell_iris_barrier_name", "Iris Barrier", "spell")
rename("faction_3_spell_neurolink_name", "Neurolink", "spell")

# ═══════════════════════════════════════════════════════════════
# FACTION 3 (HIERARCHY) ARTIFACTS
# ═══════════════════════════════════════════════════════════════

rename("faction_3_artifact_staff_of_ykir_name", "Staff of Ith'Rael", "artifact")
rename("faction_3_artifact_hexblade_name", "Hexblade of the Damned", "artifact")
rename("faction_3_artifact_wildfire_ankh_name", "Wildfire Ankh", "artifact")
rename("faction_3_artifact_spinecleaver_name", "Spinecleaver", "artifact")
rename("faction_3_artifact_obdurator_name", "Obdurator", "artifact")

# ═══════════════════════════════════════════════════════════════
# FACTION 4 (THOUGHT VIRUS) UNITS
# ═══════════════════════════════════════════════════════════════

rename("faction_4_unit_abyssal_crawler_name", "Viral Crawler", "unit")
rename("faction_4_unit_gloomchaser_name", "Gloom Chaser", "unit")
rename("faction_4_unit_nightsorrow_assassin_name", "Nightsorrow Assassin", "unit")
rename("faction_4_unit_shadow_watcher_name", "Shadow Watcher", "unit")
rename("faction_4_unit_darkspine_elemental_name", "Darkspine Elemental", "unit")
rename("faction_4_unit_shadowdancer_name", "Shadow Dancer", "unit")
rename("faction_4_unit_reaper_of_the_nine_moons_name", "Reaper of the Nine Moons", "unit")
rename("faction_4_unit_vorpal_reaver_name", "Vorpal Reaver", "unit")
rename("faction_4_unit_spectral_revenant_name", "Spectral Revenant", "unit")
rename("faction_4_unit_wraithling_name", "Infected", "unit")
rename("faction_4_unit_blood_siren_name", "Blood Siren", "unit")
rename("faction_4_unit_desolator_name", "Desolator", "unit")
rename("faction_4_unit_klaxon_name", "Klaxon", "unit")
rename("faction_4_unit_gor_name", "Gor", "unit")
rename("faction_4_unit_ooz_name", "Ooz", "unit")
rename("faction_4_unit_lurking_fear_name", "Lurking Fear", "unit")
rename("faction_4_unit_horror_name", "Horror", "unit")
rename("faction_4_unit_night_fiend_name", "Night Fiend", "unit")
rename("faction_4_unit_phantasm_name", "Phantasm", "unit")
rename("faction_4_unit_necrotic_sphere_name", "Necrotic Sphere", "unit")
rename("faction_4_unit_grandmaster_variax_name", "Grandmaster Source", "unit")
rename("faction_4_unit_nocturne_name", "Nocturne", "unit")
rename("faction_4_unit_xerroloth_name", "Xerroloth", "unit")
rename("faction_4_unit_carrion_collector_name", "Carrion Collector", "unit")
rename("faction_4_unit_inkling_surge_name", "Inkling Surge", "unit")
rename("faction_4_unit_moonrider_name", "Moonrider", "unit")
rename("faction_4_unit_shadow_portal_name", "Shadow Portal", "unit")
rename("faction_4_unit_limbo_dweller_name", "Limbo Dweller", "unit")
rename("faction_4_unit_stygian_observer_name", "Stygian Observer", "unit")
rename("faction_4_unit_void_talon_name", "Void Talon", "unit")
rename("faction_4_unit_mech_name", "Virus Mech", "unit")

# ═══════════════════════════════════════════════════════════════
# FACTION 4 (THOUGHT VIRUS) SPELLS
# ═══════════════════════════════════════════════════════════════

rename("faction_4_spell_void_pulse_name", "Void Pulse", "spell")
rename("faction_4_spell_dark_seed_name", "Dark Seed", "spell")
rename("faction_4_spell_daemonic_lure_name", "Viral Lure", "spell")
rename("faction_4_spell_dark_transformation_name", "Dark Transformation", "spell")
rename("faction_4_spell_shadow_reflection_name", "Shadow Reflection", "spell")
rename("faction_4_spell_darkfire_sacrifice_name", "Darkfire Sacrifice", "spell")
rename("faction_4_spell_ritual_banishing_name", "Ritual Banishing", "spell")
rename("faction_4_spell_consuming_rebirth_name", "Consuming Rebirth", "spell")
rename("faction_4_spell_breath_of_the_unborn_name", "Breath of the Unborn", "spell")
rename("faction_4_spell_shadow_nova_name", "Viral Nova", "spell")
rename("faction_4_spell_grasp_of_agony_name", "Grasp of Agony", "spell")
rename("faction_4_spell_wraithling_fury_name", "Infected Fury", "spell")
rename("faction_4_spell_wraithling_swarm_name", "Infected Swarm", "spell")
rename("faction_4_spell_soul_grimwar_name", "Soul Grimwar", "spell")
rename("faction_4_spell_nether_summoning_name", "Nether Summoning", "spell")
rename("faction_4_spell_punish_name", "Punish", "spell")
rename("faction_4_spell_sphere_of_darkness_name", "Sphere of Corruption", "spell")
rename("faction_4_spell_doom_name", "Doom", "spell")
rename("faction_4_spell_echoing_shriek_name", "Echoing Shriek", "spell")
rename("faction_4_spell_corporeal_cadence_name", "Corporeal Cadence", "spell")
rename("faction_4_spell_inest_name", "Infest", "spell")
rename("faction_4_spell_infest_name", "Infest", "spell")
rename("faction_4_spell_necrotic_sphere_name", "Necrotic Sphere", "spell")

# ═══════════════════════════════════════════════════════════════
# FACTION 4 (THOUGHT VIRUS) ARTIFACTS
# ═══════════════════════════════════════════════════════════════

rename("faction_4_artifact_spectral_blade_name", "Spectral Blade", "artifact")
rename("faction_4_artifact_soul_grimwar_name", "Soul Grimwar", "artifact")
rename("faction_4_artifact_horn_of_the_forsaken_name", "Horn of the Forsaken", "artifact")
rename("faction_4_artifact_mindlathe_name", "Mindlathe", "artifact")

# ═══════════════════════════════════════════════════════════════
# FACTION 5 (NEW BABYLON) UNITS
# ═══════════════════════════════════════════════════════════════

rename("faction_5_unit_young_silithar_name", "Young Enforcer", "unit")
rename("faction_5_unit_veteran_silithar_name", "Veteran Enforcer", "unit")
rename("faction_5_unit_silithar_elder_name", "Enforcer Elder", "unit")
rename("faction_5_unit_earth_walker_name", "Street Walker", "unit")
rename("faction_5_unit_makantor_warbeast_name", "Makantor Warbeast", "unit")
rename("faction_5_unit_kolossus_name", "Kolossus", "unit")
rename("faction_5_unit_elucidator_name", "Elucidator", "unit")
rename("faction_5_unit_unstable_leviathan_name", "Unstable Leviathan", "unit")
rename("faction_5_unit_grimrock_name", "Grimrock", "unit")
rename("faction_5_unit_phalanxar_name", "Phalanxar", "unit")
rename("faction_5_unit_taygete_name", "Taygete", "unit")
rename("faction_5_unit_egg_name", "Contraband Egg", "unit")
rename("faction_5_unit_ragebinder_name", "Ragebinder", "unit")
rename("faction_5_unit_gro_name", "Gro", "unit")
rename("faction_5_unit_moloki_huntress_name", "Moloki Huntress", "unit")
rename("faction_5_unit_wild_inceptor_name", "Wild Inceptor", "unit")
rename("faction_5_unit_dreadnought_name", "Dreadnought", "unit")
rename("faction_5_unit_lavaslasher_name", "Lavaslasher", "unit")
rename("faction_5_unit_juggernaut_name", "Juggernaut", "unit")
rename("faction_5_unit_grandmaster_kraigon_name", "Grandmaster Calder", "unit")
rename("faction_5_unit_rex_name", "Rex", "unit")
rename("faction_5_unit_armada_name", "Armada", "unit")
rename("faction_5_unit_ripper_name", "Ripper", "unit")
rename("faction_5_unit_morin_khur_name", "Morin-Khur", "unit")
rename("faction_5_unit_rage_reactor_name", "Rage Reactor", "unit")
rename("faction_5_unit_mech_name", "Babylon Mech", "unit")

# ═══════════════════════════════════════════════════════════════
# FACTION 5 (NEW BABYLON) SPELLS
# ═══════════════════════════════════════════════════════════════

rename("faction_5_spell_greater_fortitude_name", "Greater Fortitude", "spell")
rename("faction_5_spell_diretide_frenzy_name", "Diretide Frenzy", "spell")
rename("faction_5_spell_earth_sphere_name", "Earth Sphere", "spell")
rename("faction_5_spell_natural_selection_name", "Natural Selection", "spell")
rename("faction_5_spell_plasma_storm_name", "Plasma Storm", "spell")
rename("faction_5_spell_adamantite_claws_name", "Adamantite Claws", "spell")
rename("faction_5_spell_tremor_name", "Tremor", "spell")
rename("faction_5_spell_flash_reincarnation_name", "Flash Reincarnation", "spell")
rename("faction_5_spell_egg_morph_name", "Egg Morph", "spell")
rename("faction_5_spell_kinetic_equilibrium_name", "Kinetic Equilibrium", "spell")
rename("faction_5_spell_bounded_lifeforce_name", "Bounded Lifeforce", "spell")
rename("faction_5_spell_tectonic_spikes_name", "Tectonic Spikes", "spell")
rename("faction_5_spell_homeostatic_rebuke_name", "Homeostatic Rebuke", "spell")
rename("faction_5_spell_dance_of_dreams_name", "Dance of Dreams", "spell")
rename("faction_5_spell_lavaslasher_name", "Lavaslasher", "spell")
rename("faction_5_spell_upper_hand_name", "Upper Hand", "spell")
rename("faction_5_spell_rage_reactor_name", "Rage Reactor", "spell")
rename("faction_5_spell_magitek_upgrade_name", "Magitek Upgrade", "spell")

# ═══════════════════════════════════════════════════════════════
# FACTION 5 (NEW BABYLON) ARTIFACTS
# ═══════════════════════════════════════════════════════════════

rename("faction_5_artifact_adamantite_claws_name", "Adamantite Claws", "artifact")
rename("faction_5_artifact_twin_fang_name", "Twin Fang", "artifact")
rename("faction_5_artifact_morin_khur_name", "Morin-Khur", "artifact")

# ═══════════════════════════════════════════════════════════════
# FACTION 6 (THE POTENTIALS) UNITS
# ═══════════════════════════════════════════════════════════════

rename("faction_6_unit_crystal_cloaker_name", "Crystal Cloaker", "unit")
rename("faction_6_unit_fenrir_warmaster_name", "Fenrir Warmaster", "unit")
rename("faction_6_unit_borean_bear_name", "Borean Bear", "unit")
rename("faction_6_unit_arctic_displacer_name", "Phase Displacer", "unit")
rename("faction_6_unit_glacial_elemental_name", "Glacial Elemental", "unit")
rename("faction_6_unit_snowchaser_name", "Dreamchaser", "unit")
rename("faction_6_unit_hearth_sister_name", "Hearth Sister", "unit")
rename("faction_6_unit_razorback_name", "Razorback", "unit")
rename("faction_6_unit_draugar_lord_name", "Draugar Lord", "unit")
rename("faction_6_unit_voice_of_the_wind_name", "Voice of the Storm", "unit")
rename("faction_6_unit_spirit_of_the_wild_name", "Spirit of the Wild", "unit")
rename("faction_6_unit_grandmaster_embla_name", "Grandmaster Nythera", "unit")
rename("faction_6_unit_wolfraven_name", "Wolfraven", "unit")
rename("faction_6_unit_circulus_name", "Circulus", "unit")
rename("faction_6_unit_luminous_charge_name", "Luminous Charge", "unit")
rename("faction_6_unit_freeblade_name", "Freeblade", "unit")
rename("faction_6_unit_sleet_dasher_name", "Sleet Dasher", "unit")
rename("faction_6_unit_shivers_name", "Shivers", "unit")
rename("faction_6_unit_malicious_wisp_name", "Malicious Wisp", "unit")
rename("faction_6_unit_night_watcher_name", "Night Watcher", "unit")
rename("faction_6_unit_myriad_name", "Myriad", "unit")
rename("faction_6_unit_ash_mephyt_name", "Ash Mephyt", "unit")
rename("faction_6_unit_ancient_grove_name", "Ancient Grove", "unit")
rename("faction_6_unit_ice_drake_name", "Ice Drake", "unit")
rename("faction_6_unit_cryogenesis_name", "Cryogenesis", "unit")
rename("faction_6_unit_gravity_well_name", "Gravity Well", "unit")
rename("faction_6_unit_bonechill_barrier_name", "Bonechill Barrier", "unit")
rename("faction_6_unit_blazing_spines_name", "Blazing Spines", "unit")
rename("faction_6_unit_walls_name", "Potential Wall", "unit")
rename("faction_6_unit_mech_name", "Potential Mech", "unit")

# ═══════════════════════════════════════════════════════════════
# FACTION 6 (THE POTENTIALS) SPELLS
# ═══════════════════════════════════════════════════════════════

rename("faction_6_spell_polarity_name", "Polarity", "spell")
rename("faction_6_spell_chromatic_cold_name", "Chromatic Cold", "spell")
rename("faction_6_spell_hailstone_prison_name", "Hailstone Prison", "spell")
rename("faction_6_spell_frostfire_name", "Frostfire", "spell")
rename("faction_6_spell_aspect_of_the_fox_name", "Aspect of the Fox", "spell")
rename("faction_6_spell_aspect_of_the_mountain_name", "Aspect of the Mountain", "spell")
rename("faction_6_spell_aspect_of_the_drake_name", "Aspect of the Drake", "spell")
rename("faction_6_spell_aspect_of_the_ravager_name", "Aspect of the Ravager", "spell")
rename("faction_6_spell_avalanche_name", "Avalanche", "spell")
rename("faction_6_spell_enfeeble_name", "Enfeeble", "spell")
rename("faction_6_spell_mark_of_solitude_name", "Mark of Solitude", "spell")
rename("faction_6_spell_mesmerize_name", "Mesmerize", "spell")
rename("faction_6_spell_frigid_corona_name", "Frigid Corona", "spell")
rename("faction_6_spell_concealing_shroud_name", "Concealing Shroud", "spell")
rename("faction_6_spell_flawless_reflection_name", "Flawless Reflection", "spell")
rename("faction_6_spell_luminous_charge_name", "Luminous Charge", "spell")
rename("faction_6_spell_wailing_overdrive_name", "Wailing Overdrive", "spell")
rename("faction_6_spell_flash_freeze_name", "Flash Freeze", "spell")
rename("faction_6_spell_icy_name", "Icy", "spell")

# ═══════════════════════════════════════════════════════════════
# FACTION 6 (THE POTENTIALS) ARTIFACTS
# ═══════════════════════════════════════════════════════════════

rename("faction_6_artifact_winterblade_name", "Winterblade", "artifact")
rename("faction_6_artifact_coldbiter_name", "Coldbiter", "artifact")
rename("faction_6_artifact_snowpiercer_name", "Snowpiercer", "artifact")
rename("faction_6_artifact_white_asp_name", "White Asp", "artifact")

# ═══════════════════════════════════════════════════════════════
# BOSS TAUNTS - Reskin to Dischordian Saga bosses
# ═══════════════════════════════════════════════════════════════

rename("boss_neutral_taunt", "I will show you the meaning of control!", "boss")
rename("boss_1_taunt", "(corrupted data stream)", "boss")
rename("boss_2_taunt", "Two can play at this game, Operative.", "boss")
rename("boss_3_taunt", "Come, let me show you the Hierarchy's arsenal!", "boss")
rename("boss_4_taunt", "The Thought Virus will consume this world!", "boss")
rename("boss_5_taunt", "Your mind is clouded. Let the Source end your pain.", "boss")
rename("boss_6_taunt", "Sentient life detected. Executing Empire protocol.", "boss")
rename("boss_8_taunt", "Halt! Your entry into the Panopticon has been denied.", "boss")
rename("boss_9_taunt", "Fall for my tricks or my blade — the outcome is the same.", "boss")
rename("boss_10_taunt", "I shall reap the sins of this world and cleanse it in the fires of New Babylon.", "boss")
rename("boss_11_taunt", "I may be broken, but you I will shatter.", "boss")
rename("boss_12_taunt", "You stand before the Architect. Your trivial life means nothing.", "boss")
rename("boss_13_taunt", "Can you handle even a taste of the power the Potentials wield?", "boss")
rename("boss_14_taunt", "Power overwhelming! The Source demands it!", "boss")

# ═══════════════════════════════════════════════════════════════
# UI STRINGS - Update faction references in UI text
# ═══════════════════════════════════════════════════════════════

# Update any remaining UI strings that reference original faction names
for key in list(data.keys()):
    val = data[key]
    if isinstance(val, str):
        original_val = val
        val = val.replace("Lyonar", "Empire")
        val = val.replace("Songhai", "Insurgency")
        val = val.replace("Vetruvian", "Hierarchy")
        val = val.replace("Abyssian", "Virus")
        val = val.replace("Magmar", "Babylon")
        val = val.replace("Vanar", "Potentials")
        val = val.replace("Duelyst", "Dischordian Saga")
        if val != original_val:
            changes.append({"key": key, "old": original_val, "new": val, "category": "ui_replace"})
            data[key] = val

# ═══════════════════════════════════════════════════════════════
# WRITE OUTPUT
# ═══════════════════════════════════════════════════════════════

with open(OUTPUT_FILE, 'w') as f:
    json.dump(data, f, indent=1)

# Write the change report
report = {
    "total_changes": len(changes),
    "by_category": {},
    "changes": changes
}
for c in changes:
    cat = c["category"]
    report["by_category"][cat] = report["by_category"].get(cat, 0) + 1

with open(REPORT_FILE, 'w') as f:
    json.dump(report, f, indent=2)

print(f"Reskin complete: {len(changes)} changes applied")
print(f"By category:")
for cat, count in sorted(report["by_category"].items()):
    print(f"  {cat}: {count}")
print(f"Output: {OUTPUT_FILE}")
print(f"Report: {REPORT_FILE}")
