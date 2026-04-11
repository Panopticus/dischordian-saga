extends CanvasLayer

# Secondary comms channel panel for Game Masters transmissions.
# HistoricalManager.trigger_gm_contact() looks up the first node in group
# "gm_message_ui" and calls show_message() on it.

@onready var background: ColorRect = $Background
@onready var panel: Panel = $Panel
@onready var label: Label = $Panel/MessageLabel
@onready var dismiss_hint: Label = $Panel/DismissHint

var _visible_now: bool = false

func _ready() -> void:
	add_to_group("gm_message_ui")
	layer = 20
	background.modulate.a = 0.0
	panel.modulate.a = 0.0
	visible = false

func show_message(text: String) -> void:
	label.text = text
	visible = true
	_visible_now = true
	var tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(background, "modulate:a", 0.75, 0.4)
	tween.tween_property(panel, "modulate:a", 1.0, 0.5)
	# Auto-dismiss after a while so gameplay resumes even if the player
	# ignores it.
	await get_tree().create_timer(12.0, true).timeout
	if _visible_now:
		_dismiss()

func _input(event: InputEvent) -> void:
	if not _visible_now: return
	if event is InputEventKey and event.pressed:
		_dismiss()
	elif event is InputEventMouseButton and event.pressed:
		_dismiss()

func _dismiss() -> void:
	_visible_now = false
	var tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(background, "modulate:a", 0.0, 0.3)
	tween.tween_property(panel, "modulate:a", 0.0, 0.3)
	await tween.finished
	visible = false
