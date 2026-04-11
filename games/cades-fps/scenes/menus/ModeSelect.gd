extends Control

func _ready() -> void:
	$VBox/Title.add_theme_font_size_override("font_size", 48)
	$VBox/Title.add_theme_color_override("font_color", Color(0.886, 0.910, 0.937))
	$VBox/Subtitle.add_theme_font_size_override("font_size", 14)
	$VBox/Subtitle.add_theme_color_override("font_color", Color(0.545, 0.361, 0.965))
	for btn_name in ["BtnLastStand", "BtnShipDefense", "BtnHistorical"]:
		var btn = $VBox.get_node(btn_name)
		btn.add_theme_color_override("font_color", Color(0.886, 0.910, 0.937))
		btn.add_theme_color_override("font_hover_color", Color(0.961, 0.941, 0.914))
	$VBox/BtnLastStand.pressed.connect(_on_last_stand)
	$VBox/BtnShipDefense.pressed.connect(_on_ship_defense)
	$VBox/BtnHistorical.pressed.connect(_on_historical)

func _on_last_stand() -> void:
	GameMode.reset_for_mode("last_stand")
	get_tree().change_scene_to_file("res://scenes/levels/BridgeOfKael.tscn")

func _on_ship_defense() -> void:
	GameMode.reset_for_mode("ship_defense")
	get_tree().change_scene_to_file("res://scenes/levels/Ark1047.tscn")

func _on_historical() -> void:
	GameMode.reset_for_mode("historical_incursions")
	get_tree().change_scene_to_file("res://scenes/levels/MatrixHub.tscn")
