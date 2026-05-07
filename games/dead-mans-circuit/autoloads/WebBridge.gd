extends Node
## PostMessage bridge for iframe communication with the React host.
## Protocol: CIRCUIT_READY → CIRCUIT_CONFIG → CIRCUIT_RESULT

signal config_received(config: Dictionary)
## Async / synchronous PvP — emitted when CIRCUIT_CONFIG carries pvp
## metadata so a Rival Run can seed deterministically and the result
## screen can show the opponent's score side-by-side.
signal pvp_config_received(pvp_seed: String, opponent_score: int, opponent_name: String, match_id: String)

var is_web: bool = false
var _config_polled: bool = false

# T9 / Tier 5A — Rival Circuit PvP metadata. Optional fields; absent
# on solo seasonal runs.
# pvp_seed:        deterministic track seed shared with the opponent
# pvp_match_id:    server-issued match id; echoed back in CIRCUIT_RESULT
# opponent_score:  -1 if opponent hasn't submitted yet
# opponent_name:   for the post-race comparison panel
var pvp_seed: String = ""
var pvp_match_id: String = ""
var opponent_score: int = -1
var opponent_name: String = ""

# §G.11.1 — suit-set bonuses delivered by the React side in
# CIRCUIT_CONFIG.suit_bonuses. Most Circuit bonuses land via
# player_clone stat adjustments on the React side; this dict
# carries any non-clone bonuses for future subsystems.
var suit_bonuses: Dictionary = {}

func get_suit_bonus(key: String, default_value = 1.0):
	if suit_bonuses.has(key):
		return suit_bonuses[key]
	return default_value

func _ready() -> void:
	is_web = OS.has_feature("web")
	if is_web:
		JavaScriptBridge.eval("""
			window.addEventListener('message', function(e) {
				if (e.data && e.data.type === 'CIRCUIT_CONFIG') {
					window._circuitConfig = e.data.payload;
				}
			});
			window.parent.postMessage({type: 'CIRCUIT_READY'}, '*');
		""")
		var timer := Timer.new()
		timer.wait_time = 0.3
		timer.timeout.connect(_check_config)
		add_child(timer)
		timer.start()
	else:
		# Dev mode — use defaults after a short delay
		await get_tree().create_timer(0.2).timeout
		_dev_mode_config()

func _check_config() -> void:
	if _config_polled:
		return
	if not is_web:
		return
	var result = JavaScriptBridge.eval("JSON.stringify(window._circuitConfig || null)")
	if result != "null" and result != null:
		_config_polled = true
		var json := JSON.new()
		if json.parse(result) == OK:
			var cfg = json.get_data()
			if cfg is Dictionary:
				var sb = cfg.get("suit_bonuses", {})
				if sb is Dictionary:
					suit_bonuses = sb
				# T9 — Rival Circuit PvP fields. Optional.
				if cfg.has("pvp_seed"):
					pvp_seed = String(cfg.get("pvp_seed", ""))
					pvp_match_id = String(cfg.get("pvp_match_id", ""))
					opponent_score = int(cfg.get("opponent_score", -1))
					opponent_name = String(cfg.get("opponent_name", ""))
					if pvp_seed != "":
						emit_signal(
							"pvp_config_received",
							pvp_seed,
							opponent_score,
							opponent_name,
							pvp_match_id,
						)
				emit_signal("config_received", cfg)

func send_result(data: Dictionary) -> void:
	# T9 — when this is a Rival Run, echo the match id so React routes
	# the result to apps/server/routers/tier5Pvp.circuit.submitResult.
	if pvp_match_id != "":
		data["pvp_match_id"] = pvp_match_id
		data["pvp_seed"] = pvp_seed
	if is_web:
		var json_str := JSON.stringify(data)
		JavaScriptBridge.eval("window.parent.postMessage({type:'CIRCUIT_RESULT',payload:" + json_str + "},'*');")
	else:
		print("[DMC] Race Result: ", data)

# Cross-game narrative beats — emit a beat id at a canonical narrative
# moment in DMC, and the React side forwards it to the
# crossGameThreads.emit tRPC mutation. The beat id MUST match an
# entry in apps/shared/crossGameNarrativeThreads.ts. Same protocol +
# semantics as CADES's WebBridge.fire_cross_game_beat — see the doc
# comment there for the canonical example. Beats are
# once-per-account; the local Dictionary just suppresses redundant
# postMessage spam in the same session.
func fire_cross_game_beat(beat_id: String) -> void:
	if beat_id == "":
		return
	if _cross_game_beats_emitted.has(beat_id):
		return
	_cross_game_beats_emitted[beat_id] = true
	if is_web:
		var payload := {"beat_id": beat_id}
		var json_str := JSON.stringify({"type": "CROSS_GAME_BEAT", "payload": payload})
		JavaScriptBridge.eval("window.parent.postMessage(" + json_str + ",'*');")
	else:
		print("[DMC] cross-game beat (dev mode): ", beat_id)

func has_emitted_cross_game_beat(beat_id: String) -> bool:
	return _cross_game_beats_emitted.has(beat_id)

var _cross_game_beats_emitted: Dictionary = {}

func _dev_mode_config() -> void:
	var cfg := {
		"player_clone": {
			"designation": "WIRED-7042-DELTA",
			"neural_sync": 80,
			"physical_integrity": 100,
			"velocity_ceiling": 100,
			"surface_grip": 65,
			"survival_instinct": 25,
		},
		"total_laps": 3,
		"phase": 1,
		"ai_count": 7,
		"ai_difficulty": 0.5,
		"abilities": ["emp_pulse", "overclock"],
		"track_sequence": ["STRAIGHT", "CURVE_LIGHT", "STRAIGHT", "BONE_LANE", "CURVE_HARD", "SPEED_CONDUIT", "STRAIGHT", "DEAD_STRAIGHT"],
		"bone_obstacles": [],
	}
	emit_signal("config_received", cfg)
