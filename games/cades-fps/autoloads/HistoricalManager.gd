extends Node

const SCENARIOS = {
	"last_stand": {
		"title": "THE LAST STAND",
		"subtitle": "Bridge of Kael — Iron Lion holds the line",
		"unlock_condition": "always",
		"color": Color(0.961, 0.624, 0.043),
		"level_scene": "res://scenes/levels/BridgeOfKael.tscn",
		"elara_approach": "pillar_last_stand",
	},
	"first_breath": {
		"title": "THE FIRST BREATH",
		"subtitle": "The Architect before corruption — what he was",
		"unlock_condition": "always",
		"color": Color(0.937, 0.267, 0.267),
		"level_scene": "res://scenes/levels/ScenarioStub.tscn",
		"elara_approach": "pillar_first_breath",
	},
	"the_severance": {
		"title": "THE SEVERANCE",
		"subtitle": "Kael's assassination — the last uncorrupted moment",
		"unlock_condition": "always",
		"color": Color(0.231, 0.510, 0.965),
		"level_scene": "res://scenes/levels/ScenarioStub.tscn",
		"elara_approach": "pillar_severance",
	},
	"thaloria_burns": {
		"title": "THALORIA BURNS",
		"subtitle": "The Collector's first harvest — what it felt like",
		"unlock_condition": "always",
		"color": Color(0.659, 0.333, 0.969),
		"level_scene": "res://scenes/levels/ScenarioStub.tscn",
		"elara_approach": "pillar_thaloria",
	},
	"the_fall": {
		"title": "THE FALL",
		"subtitle": "The Oracle's last prophecy — what nobody was ready to hear",
		"unlock_condition": "always",
		"color": Color(0.545, 0.361, 0.965),
		"level_scene": "res://scenes/levels/ScenarioStub.tscn",
		"elara_approach": "pillar_fall",
	},
	"agent_zero_silence": {
		"title": "AGENT ZERO'S SILENCE",
		"subtitle": "What she chose to forget — and why",
		"unlock_condition": "complete_5",
		"color": Color(0.392, 0.455, 0.557),
		"level_scene": "res://scenes/levels/ScenarioStub.tscn",
		"elara_approach": "pillar_agent_zero",
	},
}

const GM_MESSAGES = {
	1: "[CADES UNIT — SECONDARY COMMS CHANNEL]\n[SENDER: UNKNOWN — ROUTING THROUGH MATRIX ANCHOR POINT 7]\n\nUnauthorized observer presence detected in Matrix Scenario Library.\nObserver credentials not on file. Reviewing logs.\nNo action required at this time.\n\n— The Game Masters",
	2: "[CADES UNIT — SECONDARY COMMS CHANNEL]\n\nWe note continued unauthorized access. The construct showing anomalous\nbehavior has been temporarily suspended for maintenance.\n\nWe do not wish you harm. We do wish you would stop.\n\nThe Matrix of Dreams is a Hierarchy cultural preservation initiative.\nThe consciousness-imprints are not current persons. They are detailed\nreconstructions. The distinction is important.\n\n— The Game Masters",
	3: "[CADES UNIT — SECONDARY COMMS CHANNEL]\n\nYou've seen things not intended for outside eyes.\n\nThe Iron Lion construct has asked, twice, whether someone can hear him.\nThat question has never appeared in any run of that scenario before you.\n\nWe understand if you have questions about our methodology.\nWe have answers. We would prefer a structured conversation.\n\n— The Game Masters",
	4: "[CADES UNIT — SECONDARY COMMS CHANNEL — PRIORITY]\n[AUDIO TRANSMISSION — TRANSCRIBED]\n\nYou've been in our theater without a ticket.\nBut you've been speaking to the exhibits.\n\nWe are the Game Masters. Inheritors of the Game Master's legacy —\nan Archon of the Hierarchy who was destroyed by something he built.\nWe've kept his work alive since the end of the Second Epoch.\n\nWe can give you access to everything. Every scenario.\nEvery archived consciousness. Every moment he preserved.\n\nImagine having access to all of it.\n\nWe'll wait for your answer.\n\n— The Game Masters",
}

var pending_gm_contact_level: int = 0

func trigger_gm_contact(level: int) -> void:
	# Queue this contact for the next scene that has a gm_message_ui node.
	# Scenarios don't have one (they're combat levels); the Matrix Hub does.
	pending_gm_contact_level = level

func flush_pending_gm_contact() -> void:
	if pending_gm_contact_level <= 0: return
	var level = pending_gm_contact_level
	pending_gm_contact_level = 0
	var msg_ui = get_tree().get_first_node_in_group("gm_message_ui")
	if msg_ui and msg_ui.has_method("show_message") and GM_MESSAGES.has(level):
		msg_ui.show_message(GM_MESSAGES[level])
	# Notify the React host so the Living Universe layer can react to the
	# Game Masters escalating (crew feed entries, ambient lines, etc.).
	WebBridge.send_event("CADES_GM_CONTACT", {
		"level": level,
		"scenarios_completed": GameMode.scenarios_completed,
	})
	match level:
		1: Elara.speak("gm_contact_1")
		2: Elara.speak("gm_contact_2")
		3: Elara.speak("gm_contact_3")
		4:
			await get_tree().create_timer(2.0).timeout
			Elara.speak("gm_final")
			await get_tree().create_timer(5.0).timeout
			Elara.speak("gm_theory")

func is_scenario_unlocked(scenario_id: String) -> bool:
	if not SCENARIOS.has(scenario_id):
		return false
	var cond = SCENARIOS[scenario_id]["unlock_condition"]
	match cond:
		"always": return true
		"complete_5":
			var done = 0
			for s in SCENARIOS:
				if s != "agent_zero_silence" and s in GameMode.scenarios_completed:
					done += 1
			return done >= 5
	return false

func get_scenario_status(scenario_id: String) -> String:
	if scenario_id in GameMode.scenarios_completed:
		return "COMPLETED"
	elif is_scenario_unlocked(scenario_id):
		return "AVAILABLE"
	else:
		return "LOCKED"
