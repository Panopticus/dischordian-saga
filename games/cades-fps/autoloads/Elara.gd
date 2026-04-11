extends Node

var _queue: Array[String] = []
var _run_start_queue: Array[String] = []
var _last_spoken: float = 0.0
var _cooldown: float = 7.0

const LINES = {
	# Mode 1
	"loop_reset": "The bridge holds. Dawn comes again.",
	"iron_lion_pause": "He paused at the parapet. He looked at his hands. Then he went back.",
	"iron_lion_memory": "He said something: 'I've been here before.' To no one.",
	"iron_lion_suspects": "He looked toward us today. He doesn't know what he's looking at.",
	"iron_lion_waiting": "He's waiting. He's very patient.",
	"iron_lion_channel": "He's waiting. The channel is open. He can hear you.",
	"wave_1": "The scouts are probing. He knows this.",
	"wave_4_soldiers": "Soldiers now. He's adjusting.",
	"wave_7": "Shielded units. He's already changing angle.",
	"wave_10_disruptors": "Something's affecting his aim. He knows what that means.",
	"wave_13": "A command unit. They're committing. This is unusual.",
	"token_used": "One soldier. They went when called.",
	"tokens_3": "Three left. Choose carefully.",
	"tokens_0": "No one left to call. It's just him now.",
	"time_1h": "One hour. The ships are still boarding.",
	"time_2h": "Two hours. He hasn't stopped moving.",
	"time_canon": "Three hours, forty-seven minutes. The ships cleared the range. He held it.",
	"open_channel_ready": "The channel is ready. When you are.",
	# Mode 2
	"game_start": "I need twenty-five minutes. Hold the breaches.",
	"breach_lost_engineering": "Engineering breach — the Reclamation are through.",
	"breach_lost_cargo": "Cargo hold — Salvagers. They move fast. Move faster.",
	"breach_lost_observation": "Observation deck — the Thoughtborn are walking toward the unit. Don't shoot them.",
	"breach_regained_engineering": "Engineering clear.",
	"breach_regained_cargo": "Cargo hold secure.",
	"breach_regained_observation": "Observation deck — they've stopped.",
	"thoughtborn_first": "They followed Iron Lion's signal. They've been looking for years.",
	"thoughtborn_contact": "Their leader is asking for us. I'm going to answer.",
	"thoughtborn_rev": "I changed three assessments in five minutes. Uncomfortable. Correct.",
	"thoughtborn_gone": "Tell them they're welcome to look. But they'll need to knock.",
	"shields_25": "Twenty-five percent. Keep the breaches held.",
	"shields_50": "Halfway. Don't lose Engineering.",
	"shields_75": "Almost there.",
	"shields_done": "Shields at full power. Ark 1047 is secure.",
	"shields_fail": "Shields failed. I needed more time. I'm sorry.",
	# Mode 3
	"matrix_hub_enter": "Welcome to the Matrix of Dreams. Built by an Archon. Maintained by fans.",
	"pillar_last_stand": "This one you know. But knowing and being there aren't the same.",
	"pillar_first_breath": "Before the Architect became what he became. The Game Master preserved this.",
	"pillar_severance": "Kael, uncorrupted. The moment before Project Vector completed.",
	"pillar_thaloria": "What the Collector did. Archived without comment. He found it beautiful.",
	"pillar_fall": "The Oracle's prophecy. The one nobody was ready to hear.",
	"pillar_agent_zero": "What she chose to forget. It's locked until you're ready.",
	"scenario_enter": "Going in. I'll be outside. Tell me when you're back.",
	"scenario_exit": "You're back.",
	"gm_contact_1": "First contact from the Game Masters. They've noticed.",
	"gm_contact_2": "Second message. They're concerned about Iron Lion asking questions.",
	"gm_contact_3": "They're curious about you specifically.",
	"gm_final": "Final transmission. Full offer.",
	"gm_theory": "The Game Master was destroyed from inside. Iron Lion is asking. I have a theory.",
}

func speak(key: String) -> void:
	_queue.append(key)

func queue_for_run_start(key: String) -> void:
	_run_start_queue.append(key)

func flush_run_start_queue() -> void:
	for key in _run_start_queue:
		_queue.append(key)
	_run_start_queue.clear()

func _process(_delta: float) -> void:
	if _queue.is_empty(): return
	var now = Time.get_ticks_msec() / 1000.0
	if now - _last_spoken < _cooldown: return
	var key = _queue.pop_front()
	_display(key)
	_last_spoken = now

func _display(key: String) -> void:
	var text = LINES.get(key, "")
	if text.is_empty(): return
	var hud = get_tree().get_first_node_in_group("hud")
	if hud and hud.has_method("show_elara"):
		hud.show_elara("ELARA: " + text)
