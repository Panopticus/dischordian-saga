extends Node
## PostMessage bridge for iframe communication with the React host.
## Protocol: CIRCUIT_READY → CIRCUIT_CONFIG → CIRCUIT_RESULT

signal config_received(config: Dictionary)

var is_web: bool = false
var _config_polled: bool = false

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
				emit_signal("config_received", cfg)

func send_result(data: Dictionary) -> void:
	if is_web:
		var json_str := JSON.stringify(data)
		JavaScriptBridge.eval("window.parent.postMessage({type:'CIRCUIT_RESULT',payload:" + json_str + "},'*');")
	else:
		print("[DMC] Race Result: ", data)

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
