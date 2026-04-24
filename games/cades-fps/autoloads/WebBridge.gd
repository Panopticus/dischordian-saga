extends Node

signal config_received(config: Dictionary)

var is_web: bool = false
var _config_timer: Timer = null
var _config_received: bool = false

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
				_config_received = true
				if _config_timer:
					_config_timer.stop()
				emit_signal("config_received", cfg)

func send_result(data: Dictionary) -> void:
	if is_web:
		var json_str = JSON.stringify(data)
		JavaScriptBridge.eval("window.parent.postMessage({type:'CADES_RESULT',payload:" + json_str + "},'*');")

func send_event(event_type: String, payload: Dictionary = {}) -> void:
	if is_web:
		var data = {"type": event_type, "payload": payload}
		var json_str = JSON.stringify(data)
		JavaScriptBridge.eval("window.parent.postMessage(" + json_str + ",'*');")

func _dev_mode_config() -> void:
	var cfg = {"mode": "last_stand", "loop_count": 0, "awareness_level": 0, "scenarios_completed": []}
	emit_signal("config_received", cfg)
