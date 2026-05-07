extends Node

signal config_received(config: Dictionary)
## Async PvP — emitted when CADES_CONFIG carries pvp metadata so
## scenarios can seed deterministically and the result screen can
## show the opponent's score side-by-side.
signal pvp_config_received(pvp_seed: String, opponent_score: int, opponent_name: String, match_id: String)

var is_web: bool = false
var _config_timer: Timer = null
var _config_received: bool = false

# T8.4 / T9 — async time-trial PvP metadata (Tier 5C).
# pvp_seed:        deterministic scenario seed shared with the opponent
# pvp_match_id:    server-issued match id; echoed back in CADES_RESULT
# opponent_score:  prior submitted score (-1 if opponent hasn't run yet)
# opponent_name:   for the post-match comparison panel
var pvp_seed: String = ""
var pvp_match_id: String = ""
var opponent_score: int = -1
var opponent_name: String = ""

# Section §G.11.1 — suit-set bonuses delivered by the React side in
# CADES_CONFIG.suit_bonuses. Any subsystem (ShieldManager,
# future weapon/movement managers) reads these via
# `WebBridge.get_suit_bonus(key, default)` — never hardcoded,
# never re-posted.
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
				if (e.data && e.data.type === 'CADES_CONFIG') {
					window._cadesConfig = e.data.payload;
				}
			});
			window.parent.postMessage({type: 'CADES_READY'}, '*');
		""")
		# Poll for config. Stored on the instance so _check_config can stop
		# it once CADES_CONFIG arrives; otherwise we'd keep calling back
		# into the JS bridge every 500 ms for the life of the run.
		_config_timer = Timer.new()
		_config_timer.wait_time = 0.5
		_config_timer.timeout.connect(_check_config)
		add_child(_config_timer)
		_config_timer.start()
	else:
		_dev_mode_config()

func _check_config() -> void:
	if not is_web: return
	if _config_received: return
	var result = JavaScriptBridge.eval("JSON.stringify(window._cadesConfig || null)")
	if result != "null" and result != null:
		var json = JSON.new()
		if json.parse(result) == OK:
			var cfg = json.get_data()
			if cfg is Dictionary:
				GameMode.current_mode = cfg.get("mode", "last_stand")
				GameMode.loop_count = cfg.get("loop_count", 0)
				GameMode.awareness_level = cfg.get("awareness_level", 0)
				var sc = cfg.get("scenarios_completed", [])
				if sc is Array:
					for s in sc:
						if s not in GameMode.scenarios_completed:
							GameMode.scenarios_completed.append(s)
				# §G.11.1 — latch suit_bonuses at CONFIG post time.
				# Mid-run gear swaps are blocked on the React side.
				var sb = cfg.get("suit_bonuses", {})
				if sb is Dictionary:
					suit_bonuses = sb
				# T9 — async PvP metadata. Optional fields; absent on
				# solo / co-op runs.
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
				_config_received = true
				if _config_timer:
					_config_timer.stop()
				emit_signal("config_received", cfg)

func send_result(data: Dictionary) -> void:
	# T9 — when this is a PvP run, echo the match id so the React side
	# can route the result to apps/server/routers/cadesPvp.submitScore
	# without needing to thread the id through scenario state itself.
	if pvp_match_id != "":
		data["pvp_match_id"] = pvp_match_id
		data["pvp_seed"] = pvp_seed
	if is_web:
		var json_str = JSON.stringify(data)
		JavaScriptBridge.eval("window.parent.postMessage({type:'CADES_RESULT',payload:" + json_str + "},'*');")

func send_event(event_type: String, payload: Dictionary = {}) -> void:
	if is_web:
		var data = {"type": event_type, "payload": payload}
		var json_str = JSON.stringify(data)
		JavaScriptBridge.eval("window.parent.postMessage(" + json_str + ",'*');")

# Cross-game narrative beats — emit a beat id at a canonical narrative
# moment in CADES, and the React side forwards it to the
# crossGameThreads.emit tRPC mutation. The beat id MUST match an
# entry in apps/shared/crossGameNarrativeThreads.ts (an unknown id is
# rejected by the server). Caller is responsible for ensuring the
# moment is the canonical one — beats are once-per-account and
# idempotent server-side, so multiple emits are cheap but still
# redundant.
#
# Example (Chapter 7 memorial reading) — generic placeholder so the
# crossGameNarrativeThreads.test.ts wiring scanner doesn't count this
# docstring as a real fire site:
#   var beat = "iron_lions_wake_cades_memorial"  # use the real id at the call site
#   if not WebBridge.has_emitted_cross_game_beat(beat):
#       WebBridge.fire_cross_game_beat(beat)
func fire_cross_game_beat(beat_id: String) -> void:
	if beat_id == "":
		return
	if _cross_game_beats_emitted.has(beat_id):
		return
	_cross_game_beats_emitted[beat_id] = true
	send_event("CROSS_GAME_BEAT", {"beat_id": beat_id})

func has_emitted_cross_game_beat(beat_id: String) -> bool:
	return _cross_game_beats_emitted.has(beat_id)

# Session-local emit guard (server is the source of truth, this is
# just a free local short-circuit so a hot loop doesn't spam the
# bridge with redundant postMessage calls).
var _cross_game_beats_emitted: Dictionary = {}

func _dev_mode_config() -> void:
	var cfg = {"mode": "last_stand", "loop_count": 0, "awareness_level": 0, "scenarios_completed": []}
	emit_signal("config_received", cfg)
