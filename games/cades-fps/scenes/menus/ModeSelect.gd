extends Control

# Short blurbs that tell the player what each mode actually is. Hover /
# focus a button to see the matching entry in the Description panel.
const MODE_DESCRIPTIONS := {
	"BtnLastStand": "[b]Infinite hold.[/b] Defend the Bridge of Kael. Waves keep coming — there's no win state, only how long you last. Dying increments your awareness; enough loops unlock the Iron Lion's Open Channel conversation.",
	"BtnShipDefense": "[b]25-minute timer.[/b] Hold three breach zones on Inception Ark 1047 while Elara charges the shields. A Thoughtborn pilgrim walks toward CADES around the midpoint — hurting them costs shield progress.",
	"BtnHistorical": "[b]Scenario replay.[/b] Step into archived consciousness-recordings from the Matrix of Dreams. Five pillars unlock from the start; Agent Zero's Silence unlocks once the other five are complete.",
	"BtnVoidCorridor": "[b]Mission M3.[/b] A short combat beat through Agent Zero's carrier signal. Six kills, voice-over driven, ~90 seconds.",
	"BtnKaelsOwn": "[b]Mission M4.[/b] The room at the end of Kael's assassination. Four kills, voice-over driven, ~90 seconds.",
	"BtnVexRecruit": "[b]Mission M6.[/b] Accept Vex Solène's handshake on the central platform. Five kills, voice-over driven, ~90 seconds.",
}
const DEFAULT_DESC := "[center]Hover a mode to see what it is.[/center]"

func _ready() -> void:
	$VBox/Title.add_theme_font_size_override("font_size", 48)
	$VBox/Title.add_theme_color_override("font_color", Color(0.886, 0.910, 0.937))
	$VBox/Subtitle.add_theme_font_size_override("font_size", 14)
	$VBox/Subtitle.add_theme_color_override("font_color", Color(0.545, 0.361, 0.965))
	for btn_name in [
		"BtnLastStand", "BtnShipDefense", "BtnHistorical",
		"BtnVoidCorridor", "BtnKaelsOwn", "BtnVexRecruit",
	]:
		var btn = $VBox.get_node(btn_name)
		btn.add_theme_color_override("font_color", Color(0.886, 0.910, 0.937))
		btn.add_theme_color_override("font_hover_color", Color(0.961, 0.941, 0.914))
		btn.focus_entered.connect(_show_description.bind(btn_name))
		btn.mouse_entered.connect(_show_description.bind(btn_name))
		btn.mouse_exited.connect(_reset_description)
	$VBox/BtnLastStand.pressed.connect(_on_last_stand)
	$VBox/BtnShipDefense.pressed.connect(_on_ship_defense)
	$VBox/BtnHistorical.pressed.connect(_on_historical)
	$VBox/BtnVoidCorridor.pressed.connect(_on_void_corridor)
	$VBox/BtnKaelsOwn.pressed.connect(_on_kaels_own)
	$VBox/BtnVexRecruit.pressed.connect(_on_vex_recruit)

func _show_description(btn_name: String) -> void:
	var desc: RichTextLabel = $VBox/Description
	desc.text = MODE_DESCRIPTIONS.get(btn_name, DEFAULT_DESC)

func _reset_description() -> void:
	$VBox/Description.text = DEFAULT_DESC

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
