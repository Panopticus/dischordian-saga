extends CanvasLayer

# Tracks the most recent health value so _on_health_updated can tell a
# damage tick from a heal (or the initial set to 100) and flash only on
# the former.
var _last_health: int = 100
var _flash_tween: Tween = null

func _ready() -> void:
	add_to_group("hud")
	$ElaraSubtitle.visible = false
	$TimeHeld.visible = false
	$TokenBar.visible = false
	$ShieldBar.visible = false
	$BreachStatus.visible = false
	$OpenChannelPrompt.visible = false
	$WaveLabel.visible = false
	$DamageFlash.color.a = 0.0
	# Set mode-specific UI
	set_mode_ui(GameMode.current_mode)

func set_mode_ui(mode: String) -> void:
	$TimeHeld.visible = (mode == "last_stand")
	$TokenBar.visible = (mode == "last_stand")
	$WaveLabel.visible = (mode == "last_stand")
	$ShieldBar.visible = (mode == "ship_defense")
	$BreachStatus.visible = (mode == "ship_defense")

func _on_health_updated(health: int) -> void:
	$Health.text = "INTEGRITY: " + str(health) + "%"
	if health > 50:
		$Health.add_theme_color_override("font_color", Color(0.961, 0.624, 0.043))
	elif health > 25:
		$Health.add_theme_color_override("font_color", Color(0.976, 0.451, 0.086))
	else:
		$Health.add_theme_color_override("font_color", Color(0.937, 0.267, 0.267))
	if health < _last_health:
		_flash_damage()
	_last_health = health

func _flash_damage() -> void:
	if _flash_tween and _flash_tween.is_valid():
		_flash_tween.kill()
	$DamageFlash.color.a = 0.45
	_flash_tween = create_tween()
	_flash_tween.tween_property($DamageFlash, "color:a", 0.0, 0.35)

func show_elara(text: String) -> void:
	# Kill any in-flight fade before starting a new one — otherwise a
	# rapid-fire sequence (the Boot Diagnostic) has stale tweens fading
	# out a fresh subtitle mid-display.
	if _elara_tween and _elara_tween.is_valid():
		_elara_tween.kill()
	$ElaraSubtitle.text = text
	$ElaraSubtitle.visible = true
	$ElaraSubtitle.modulate.a = 1.0
	_elara_tween = create_tween()
	_elara_tween.tween_interval(4.5)
	_elara_tween.tween_property($ElaraSubtitle, "modulate:a", 0.0, 1.0)
	_elara_tween.tween_callback(func(): $ElaraSubtitle.visible = false)

func update_time_held(seconds: float) -> void:
	var h = int(seconds) / 3600
	var m = (int(seconds) % 3600) / 60
	var s = int(seconds) % 60
	$TimeHeld.text = "TIME HELD: %02d:%02d:%02d" % [h, m, s]

func update_wave(wave: int) -> void:
	$WaveLabel.text = "WAVE " + str(wave)

func update_tokens(count: int) -> void:
	$TokenBar/Value.text = str(count)
	if count > 5:
		$TokenBar/Value.add_theme_color_override("font_color", Color(0.961, 0.624, 0.043))
	else:
		$TokenBar/Value.add_theme_color_override("font_color", Color(0.937, 0.267, 0.267))

func update_shield(progress: float, remaining: float) -> void:
	$ShieldBar.value = progress * 100.0
	var m = int(remaining) / 60
	var s = int(remaining) % 60
	$ShieldBar/TimeLabel.text = "%02d:%02d" % [m, s]

func update_breach_status(states: Dictionary) -> void:
	for zone in ["engineering", "cargo", "observation"]:
		var abbr = {"engineering": "ENG", "cargo": "CARGO", "observation": "OBS"}[zone]
		var label = $BreachStatus.get_node_or_null(abbr)
		if label:
			if states.get(zone, true):
				label.add_theme_color_override("font_color", Color(0.133, 0.773, 0.369))
			else:
				label.add_theme_color_override("font_color", Color(0.937, 0.267, 0.267))

func show_open_channel() -> void:
	$OpenChannelPrompt.visible = true

var _weapon_name_tween: Tween = null
var _elara_tween: Tween = null

func update_weapon_name(wname: String) -> void:
	if not has_node("WeaponName"):
		return
	var label: Label = $WeaponName
	label.text = wname
	label.add_theme_color_override("font_color", Color(0.961, 0.624, 0.043))
	# Brief fade-in so the readout reads as "changed" rather than "is".
	if _weapon_name_tween and _weapon_name_tween.is_valid():
		_weapon_name_tween.kill()
	label.modulate.a = 0.3
	_weapon_name_tween = create_tween()
	_weapon_name_tween.tween_property(label, "modulate:a", 1.0, 0.25)
