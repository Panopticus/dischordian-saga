extends Control

# Short blurbs that tell the player what each mode actually is. Hover /
# focus a button to see the matching entry in the Description panel.
const MODE_DESCRIPTIONS := {
	"BtnBootDiagnostic": "[b]First-time calibration.[/b] CADES Unit's post-reboot diagnostic — Elara walks you through optics, locomotion, and weapons. If this is your first boot, run it first. Escape aborts.",
	"BtnLastStand": "[b]Infinite hold.[/b] Defend the Bridge of Kael. Waves keep coming — there's no win state, only how long you last. Dying increments your awareness; enough loops unlock the Iron Lion's Open Channel conversation.",
	"BtnShipDefense": "[b]25-minute timer.[/b] Hold three breach zones on Inception Ark 1047 while Elara charges the shields. A Thoughtborn pilgrim walks toward CADES around the midpoint — hurting them costs shield progress.",
	"BtnHistorical": "[b]Scenario replay.[/b] Step into archived consciousness-recordings from the Matrix of Dreams. Five pillars unlock from the start; Agent Zero's Silence unlocks once the other five are complete.",
	"BtnVoidCorridor": "[b]Mission M3.[/b] A short combat beat through Agent Zero's carrier signal. Six kills, voice-over driven, ~90 seconds.",
	"BtnKaelsOwn": "[b]Mission M4.[/b] The room at the end of Kael's assassination. Four kills, voice-over driven, ~90 seconds.",
	"BtnVexRecruit": "[b]Mission M6.[/b] Accept Vex Solène's handshake on the central platform. Five kills, voice-over driven, ~90 seconds.",
}
const DEFAULT_DESC := "[center]Hover a mode to see what it is.[/center]"

var _button_tweens: Dictionary = {}

func _ready() -> void:
	$VBox/Title.add_theme_font_size_override("font_size", 48)
	$VBox/Title.add_theme_color_override("font_color", Color(0.886, 0.910, 0.937))
	$VBox/Subtitle.add_theme_font_size_override("font_size", 14)
	$VBox/Subtitle.add_theme_color_override("font_color", Color(0.545, 0.361, 0.965))
	for btn_name in [
		"BtnBootDiagnostic",
		"BtnLastStand", "BtnShipDefense", "BtnHistorical",
		"BtnVoidCorridor", "BtnKaelsOwn", "BtnVexRecruit",
	]:
		var btn: Button = $VBox.get_node(btn_name)
		btn.add_theme_color_override("font_color", Color(0.886, 0.910, 0.937))
		btn.add_theme_color_override("font_hover_color", Color(0.961, 0.941, 0.914))
		btn.pivot_offset = btn.size * 0.5
		btn.resized.connect(func(): btn.pivot_offset = btn.size * 0.5)
		btn.focus_entered.connect(_on_button_highlight.bind(btn, btn_name))
		btn.mouse_entered.connect(_on_button_highlight.bind(btn, btn_name))
		btn.focus_exited.connect(_on_button_release.bind(btn))
		btn.mouse_exited.connect(_on_button_release.bind(btn))
	$VBox/BtnBootDiagnostic.pressed.connect(_on_boot_diagnostic)
	$VBox/BtnLastStand.pressed.connect(_on_last_stand)
	$VBox/BtnShipDefense.pressed.connect(_on_ship_defense)
	$VBox/BtnHistorical.pressed.connect(_on_historical)
	$VBox/BtnVoidCorridor.pressed.connect(_on_void_corridor)
	$VBox/BtnKaelsOwn.pressed.connect(_on_kaels_own)
	$VBox/BtnVexRecruit.pressed.connect(_on_vex_recruit)
	# Fade-in: cover the whole menu in black, then ease out over 0.6 s so
	# the title doesn't just pop in on scene change.
	_fade_in()

func _fade_in() -> void:
	var overlay: ColorRect = $FadeOverlay
	overlay.color.a = 1.0
	var tween := create_tween()
	tween.tween_property(overlay, "color:a", 0.0, 0.6)

func _on_button_highlight(btn: Button, btn_name: String) -> void:
	$VBox/Description.text = MODE_DESCRIPTIONS.get(btn_name, DEFAULT_DESC)
	_pulse_button(btn, Vector2(1.04, 1.04))

func _on_button_release(btn: Button) -> void:
	_pulse_button(btn, Vector2(1.0, 1.0))

func _pulse_button(btn: Button, target_scale: Vector2) -> void:
	var prev: Tween = _button_tweens.get(btn, null)
	if prev and prev.is_valid():
		prev.kill()
	var tween := create_tween()
	tween.set_trans(Tween.TRANS_CUBIC)
	tween.set_ease(Tween.EASE_OUT)
	tween.tween_property(btn, "scale", target_scale, 0.12)
	_button_tweens[btn] = tween

func _on_boot_diagnostic() -> void:
	# Tutorial runs outside the normal mode state machine — it sets its
	# own current_mode in _ready.
	get_tree().change_scene_to_file("res://scenes/levels/BootDiagnostic.tscn")

func _on_last_stand() -> void:
	GameMode.reset_for_mode("last_stand")
	get_tree().change_scene_to_file("res://scenes/levels/BridgeOfKael.tscn")

func _on_ship_defense() -> void:
	GameMode.reset_for_mode("ship_defense")
	get_tree().change_scene_to_file("res://scenes/levels/Ark1047.tscn")

func _on_historical() -> void:
	GameMode.reset_for_mode("historical_incursions")
	get_tree().change_scene_to_file("res://scenes/levels/MatrixHub.tscn")

# ─── CADES_FPS_MISSIONS M3 / M4 / M6 ───
# Three narrative-driven mission arenas added to close the VO-consumer
# gap for `cades-m3/4/6-{brief,mid,debrief}` lines. Each routes to a
# thin MissionArena.gd instance themed for the mission and sends a
# CADES_RESULT with the matching mode string on completion, which the
# React side maps to the canonical mission-complete flag.

func _on_void_corridor() -> void:
	GameMode.reset_for_mode("void_corridor")
	get_tree().change_scene_to_file("res://scenes/levels/VoidCorridor.tscn")

func _on_kaels_own() -> void:
	GameMode.reset_for_mode("kaels_own")
	get_tree().change_scene_to_file("res://scenes/levels/KaelsOwn.tscn")

func _on_vex_recruit() -> void:
	GameMode.reset_for_mode("vex_recruit")
	get_tree().change_scene_to_file("res://scenes/levels/VexRecruit.tscn")
