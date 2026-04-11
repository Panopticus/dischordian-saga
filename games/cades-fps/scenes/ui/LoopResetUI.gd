extends CanvasLayer

# Loop reset cinematic for The Last Stand. LoopManager fetches the first
# node in group "loop_ui" and calls show_signal_lost() then show_dawn_text().

@onready var background: ColorRect = $Background
@onready var signal_lost_label: Label = $SignalLost
@onready var dawn_label: Label = $Dawn

func _ready() -> void:
	add_to_group("loop_ui")
	layer = 15
	background.modulate.a = 0.0
	signal_lost_label.modulate.a = 0.0
	dawn_label.modulate.a = 0.0

func show_signal_lost() -> void:
	var tween = create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
	tween.tween_property(background, "modulate:a", 1.0, 0.4)
	tween.tween_property(signal_lost_label, "modulate:a", 1.0, 0.6)

func show_dawn_text() -> void:
	var tween = create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
	tween.tween_property(signal_lost_label, "modulate:a", 0.0, 0.4)
	tween.tween_property(dawn_label, "modulate:a", 1.0, 0.8)
	# The tween completes and then LoopManager continues its own wait before
	# reloading the scene, which tears this node down automatically.
