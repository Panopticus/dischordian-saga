class_name RaceHUD
extends CanvasLayer
## In-race HUD showing position, lap, time, integrity, abilities, minimap.

var _position_label: Label
var _lap_label: Label
var _time_label: Label
var _integrity_bar: ProgressBar
var _speed_label: Label
var _designation_label: Label
var _countdown_label: Label
var _ability_container: HBoxContainer
var _nilmorg_label: Label
var _minimap: Control

# Palette
const ORANGE := Color("#f97316")
const BONE := Color("#f5f0e8")
const DARK := Color("#1c1917")
const RED := Color("#ef4444")
const GOLD := Color("#fbbf24")
const VOID := Color("#0f172a")

func _ready() -> void:
	layer = 10
	_build_ui()

func _build_ui() -> void:
	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(root)

	# Top-left: Position + Lap
	var top_left := VBoxContainer.new()
	top_left.position = Vector2(20, 12)
	root.add_child(top_left)

	_position_label = _make_label("P8", 42, ORANGE)
	top_left.add_child(_position_label)
	_lap_label = _make_label("LAP 0/3", 16, BONE)
	top_left.add_child(_lap_label)

	# Top-center: Countdown
	_countdown_label = _make_label("", 72, ORANGE)
	_countdown_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_countdown_label.set_anchors_preset(Control.PRESET_CENTER_TOP)
	_countdown_label.position.y = 40
	root.add_child(_countdown_label)

	# Top-right: Time
	_time_label = _make_label("0:00.000", 20, BONE)
	_time_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_time_label.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	_time_label.position = Vector2(-20, 12)
	root.add_child(_time_label)

	_designation_label = _make_label("WIRED-0000-UNKNOWN", 11, Color(ORANGE, 0.6))
	_designation_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_designation_label.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	_designation_label.position = Vector2(-20, 38)
	root.add_child(_designation_label)

	# Bottom-left: Integrity bar
	var bottom_left := VBoxContainer.new()
	bottom_left.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	bottom_left.position = Vector2(20, -80)
	root.add_child(bottom_left)

	var integrity_label := _make_label("INTEGRITY", 9, Color(BONE, 0.4))
	bottom_left.add_child(integrity_label)

	_integrity_bar = ProgressBar.new()
	_integrity_bar.custom_minimum_size = Vector2(200, 14)
	_integrity_bar.max_value = 100
	_integrity_bar.value = 100
	_integrity_bar.show_percentage = false
	var style_bg := StyleBoxFlat.new()
	style_bg.bg_color = Color(1, 1, 1, 0.05)
	style_bg.corner_radius_top_left = 3
	style_bg.corner_radius_top_right = 3
	style_bg.corner_radius_bottom_left = 3
	style_bg.corner_radius_bottom_right = 3
	_integrity_bar.add_theme_stylebox_override("background", style_bg)
	var style_fill := StyleBoxFlat.new()
	style_fill.bg_color = ORANGE
	style_fill.corner_radius_top_left = 3
	style_fill.corner_radius_top_right = 3
	style_fill.corner_radius_bottom_left = 3
	style_fill.corner_radius_bottom_right = 3
	_integrity_bar.add_theme_stylebox_override("fill", style_fill)
	bottom_left.add_child(_integrity_bar)

	_speed_label = _make_label("0 km/h", 14, GOLD)
	bottom_left.add_child(_speed_label)

	# Bottom-center: Abilities
	_ability_container = HBoxContainer.new()
	_ability_container.set_anchors_preset(Control.PRESET_CENTER_BOTTOM)
	_ability_container.position = Vector2(-100, -60)
	_ability_container.add_theme_constant_override("separation", 12)
	root.add_child(_ability_container)

	# Bottom-right: Nilmorg commentary
	_nilmorg_label = _make_label("", 12, Color(ORANGE, 0.7))
	_nilmorg_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_nilmorg_label.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	_nilmorg_label.position = Vector2(-20, -30)
	_nilmorg_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_nilmorg_label.custom_minimum_size.x = 300
	root.add_child(_nilmorg_label)

func _make_label(text: String, size: int, color: Color) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l

func update_position(pos: int) -> void:
	var suffix := "TH"
	match pos:
		1: suffix = "ST"
		2: suffix = "ND"
		3: suffix = "RD"
	_position_label.text = "P" + str(pos)
	_position_label.add_theme_color_override("font_color", GOLD if pos <= 3 else ORANGE)

func update_lap(current: int, total: int) -> void:
	_lap_label.text = "LAP " + str(current) + "/" + str(total)

func update_time(ms: float) -> void:
	var total_s := ms / 1000.0
	var mins := int(total_s) / 60
	var secs := fmod(total_s, 60.0)
	_time_label.text = "%d:%06.3f" % [mins, secs]

func update_integrity(value: float) -> void:
	_integrity_bar.value = value
	var style: StyleBoxFlat = _integrity_bar.get_theme_stylebox("fill") as StyleBoxFlat
	if style:
		if value > 60:
			style.bg_color = ORANGE
		elif value > 30:
			style.bg_color = GOLD
		else:
			style.bg_color = RED

func update_speed(speed: float) -> void:
	_speed_label.text = str(int(speed * 0.8)) + " km/h"

func update_designation(d: String) -> void:
	_designation_label.text = d

func show_countdown(text: String) -> void:
	_countdown_label.text = text

func show_nilmorg(text: String) -> void:
	_nilmorg_label.text = "\"" + text + "\" — Nilmorg"

func setup_abilities(ability_keys: Array) -> void:
	for child in _ability_container.get_children():
		child.queue_free()
	for key in ability_keys:
		var panel := PanelContainer.new()
		var style := StyleBoxFlat.new()
		style.bg_color = Color(1, 1, 1, 0.05)
		style.border_color = Color(ORANGE, 0.3)
		style.border_width_left = 1
		style.border_width_right = 1
		style.border_width_top = 1
		style.border_width_bottom = 1
		style.corner_radius_top_left = 6
		style.corner_radius_top_right = 6
		style.corner_radius_bottom_left = 6
		style.corner_radius_bottom_right = 6
		style.content_margin_left = 8
		style.content_margin_right = 8
		style.content_margin_top = 4
		style.content_margin_bottom = 4
		panel.add_theme_stylebox_override("panel", style)
		var lbl := _make_label(_ability_display(key), 11, BONE)
		panel.add_child(lbl)
		panel.name = key
		_ability_container.add_child(panel)

func update_ability_cooldown(key: String, ready: bool) -> void:
	var panel := _ability_container.get_node_or_null(key)
	if panel and panel is PanelContainer:
		var style: StyleBoxFlat = panel.get_theme_stylebox("panel") as StyleBoxFlat
		if style:
			style.border_color = ORANGE if ready else Color(1, 1, 1, 0.1)

static func _ability_display(key: String) -> String:
	match key:
		"emp_pulse": return "[Q] EMP"
		"thought_spike": return "[Q] SPIKE"
		"neural_flood": return "[Q] FLOOD"
		"overclock": return "[E] TURBO"
		"phase_step": return "[E] PHASE"
		"dead_weight": return "[E] DROP"
	return "[?] " + key.to_upper()
