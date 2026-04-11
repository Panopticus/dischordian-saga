extends Node3D

# Scenario pillars — approach one and press "interact" to enter a scenario.
# The Bridge of Kael reuses its own dedicated level for the "last_stand"
# scenario so historical incursions can revisit the full Mode 1 combat loop.

const MATRIX_HUB_PATH = "res://scenes/levels/MatrixHub.tscn"

var _nearby_scenario: String = ""
@onready var _prompt_label: Label = $PillarPrompt/Label
@onready var _player: Node3D = $Player

func _ready() -> void:
	$Player.weapons = [
		load("res://weapons/resonance_disruptor.tres"),
		load("res://weapons/arc_caster.tres"),
		load("res://weapons/severance_blade.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	$HUD.set_mode_ui("historical_incursions")
	$Player.health_updated.connect($HUD._on_health_updated)
	GameMode.current_mode = "historical_incursions"
	GameMode.current_scenario = ""
	Elara.speak("matrix_hub_enter")
	_prompt_label.visible = false
	_connect_pillar_areas()

func _connect_pillar_areas() -> void:
	for pillar in get_tree().get_nodes_in_group("scenario_pillar"):
		var area = pillar.get_node_or_null("Area")
		if area == null: continue
		var scenario_id = pillar.name
		area.body_entered.connect(func(body): _on_pillar_entered(body, scenario_id))
		area.body_exited.connect(func(body): _on_pillar_exited(body, scenario_id))

func _on_pillar_entered(body: Node, scenario_id: String) -> void:
	if body != _player: return
	_nearby_scenario = scenario_id
	_refresh_prompt()
	var data = HistoricalManager.SCENARIOS.get(scenario_id, null)
	if data and data.has("elara_approach"):
		Elara.speak(data["elara_approach"])

func _on_pillar_exited(body: Node, scenario_id: String) -> void:
	if body != _player: return
	if _nearby_scenario == scenario_id:
		_nearby_scenario = ""
		_prompt_label.visible = false

func _refresh_prompt() -> void:
	if _nearby_scenario == "":
		_prompt_label.visible = false
		return
	var data = HistoricalManager.SCENARIOS.get(_nearby_scenario, null)
	if data == null: return
	var status = HistoricalManager.get_scenario_status(_nearby_scenario)
	var title = data.get("title", _nearby_scenario)
	var subtitle = data.get("subtitle", "")
	var line := ""
	match status:
		"LOCKED":
			line = "[%s — LOCKED]\n%s" % [title, subtitle]
		"COMPLETED":
			line = "[%s — COMPLETED]\n%s\n[F] Enter Again" % [title, subtitle]
		_:
			line = "[%s]\n%s\n[F] Enter Scenario" % [title, subtitle]
	_prompt_label.text = line
	_prompt_label.visible = true

func _process(_delta: float) -> void:
	if _nearby_scenario == "":
		return
	if not Input.is_action_just_pressed("interact"):
		return
	var status = HistoricalManager.get_scenario_status(_nearby_scenario)
	if status == "LOCKED":
		return
	_enter_scenario(_nearby_scenario)

func _enter_scenario(scenario_id: String) -> void:
	var data = HistoricalManager.SCENARIOS.get(scenario_id, null)
	if data == null: return
	GameMode.current_scenario = scenario_id
	var path = data.get("level_scene", "res://scenes/levels/ScenarioStub.tscn")
	get_tree().change_scene_to_file(path)
