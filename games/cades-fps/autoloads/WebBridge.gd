extends Node

signal config_received(config: Dictionary)

var is_web: bool = false

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
		# Poll for config
		var timer = Timer.new()
		timer.wait_time = 0.5
		timer.timeout.connect(_check_config)
		add_child(timer)
		timer.start()
	else:
		_dev_mode_config()

func _check_config() -> void:
	if not is_web: return
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
