extends CanvasLayer

signal conversation_complete

# Iron Lion Open Channel conversation. The player's first choice branches
# through different Iron Lion responses before reconverging on the salute
# and the final line. Each choice is remembered via player_choice so the
# BridgeOfKael host can forward it to the React layer.

var player_choice: String = ""

const CHOICES = [
	"You've been here before.",
	"You held the bridge.",
	"The ships escaped.",
	"Someone is listening.",
]

const BRANCH_LINES = {
	"You've been here before.": [
		"I know. Something in me knows.",
		"I wake at dawn and I remember\nnot the morning before —\nthe ten thousand mornings before.",
	],
	"You held the bridge.": [
		"I hold it. Present tense.",
		"Every time I check the valley\nit's dusk and the machines are coming.\nEvery time I check my hands\nthey are already tired.",
	],
	"The ships escaped.": [
		"Did they?",
		"I never saw them leave.\nI only saw the machines stop.\nSomeone told me, afterward.\nBut afterward is a word\nI no longer trust.",
	],
	"Someone is listening.": [
		"Yes.",
		"I have been speaking to you\nfor longer than you have been hearing me.\nI am not surprised\nit was you.",
	],
}

const CORE_DIALOGUE = [
	{"speaker": "iron_lion", "text": "I know I've been here before.\nI can feel it — not as a memory.\nAs a fact in my hands."},
	{"speaker": "iron_lion", "text": "Did they make it?\nThe ships?"},
	{"type": "player_confirm", "text": "Yes."},
	{"speaker": "iron_lion", "text": "Then this was worth it.\nWhatever this is.\nIt was worth it."},
	{"speaker": "pause", "duration": 1.5},
	{"speaker": "iron_lion", "text": "I'd like to stop watching the valley.\nI don't know if that's possible.\nBut I'd like to."},
	{"speaker": "pause", "duration": 1.5},
	{"speaker": "iron_lion", "text": "Someone is watching.\nI've felt it for a long time.\nIf you're that someone —"},
	{"type": "salute"},
	{"speaker": "iron_lion", "text": "When I'm done —\nI'd like to have a word with you."},
	{"type": "end"},
]

@onready var label = $IronLionLabel
@onready var choices_box = $ChoicesBox
@onready var background = $Background

func _ready() -> void:
	get_tree().paused = true
	process_mode = Node.PROCESS_MODE_ALWAYS
	background.modulate.a = 0.0
	choices_box.visible = false
	var tween = create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
	tween.tween_property(background, "modulate:a", 0.9, 0.8)
	tween.tween_callback(_start)

func _start() -> void:
	_show_line("Who's there?")
	await get_tree().create_timer(1.8, true).timeout
	_show_choices(CHOICES, _on_branch_chosen)

func _on_branch_chosen(choice: String) -> void:
	player_choice = choice
	var branch_lines = BRANCH_LINES.get(choice, [])
	for line in branch_lines:
		await _type_text(line)
		await get_tree().create_timer(1.3, true).timeout
	_run_core_sequence(0)

func _run_core_sequence(idx: int) -> void:
	if idx >= CORE_DIALOGUE.size():
		await get_tree().create_timer(1.0, true).timeout
		emit_signal("conversation_complete")
		get_tree().paused = false
		queue_free()
		return
	var step = CORE_DIALOGUE[idx]
	var step_type = step.get("type", "dialogue")
	match step_type:
		"player_confirm":
			_show_confirm(step["text"], idx)
		"salute":
			_show_salute(idx)
		"end":
			_run_core_sequence(idx + 1)
		_:
			if step.get("speaker") == "pause":
				await get_tree().create_timer(step.get("duration", 1.0), true).timeout
				_run_core_sequence(idx + 1)
			elif step.get("speaker") == "iron_lion":
				await _type_text(step["text"])
				await get_tree().create_timer(1.2, true).timeout
				_run_core_sequence(idx + 1)
			else:
				_run_core_sequence(idx + 1)

func _show_line(text: String) -> void:
	label.text = text

func _type_text(text: String) -> void:
	label.text = ""
	for ch in text:
		label.text += ch
		await get_tree().create_timer(0.04, true).timeout

func _show_choices(options: Array, on_pick: Callable) -> void:
	choices_box.visible = true
	for child in choices_box.get_children():
		child.queue_free()
	for option in options:
		var btn = Button.new()
		btn.text = option
		btn.add_theme_color_override("font_color", Color(0.961, 0.941, 0.914))
		btn.add_theme_color_override("font_hover_color", Color(0.984, 0.749, 0.165))
		var captured := option
		btn.pressed.connect(func():
			choices_box.visible = false
			on_pick.call(captured)
		)
		choices_box.add_child(btn)

func _show_confirm(text: String, idx: int) -> void:
	choices_box.visible = true
	for child in choices_box.get_children():
		child.queue_free()
	var btn = Button.new()
	btn.text = text
	btn.add_theme_color_override("font_color", Color(0.961, 0.941, 0.914))
	btn.pressed.connect(func():
		choices_box.visible = false
		_run_core_sequence(idx + 1)
	)
	choices_box.add_child(btn)

func _show_salute(idx: int) -> void:
	label.text = "[fist to chest]"
	label.add_theme_color_override("font_color", Color(0.984, 0.749, 0.165))
	Audio.play("sounds/land.ogg") # placeholder for salute sound
	await get_tree().create_timer(0.8, true).timeout
	label.add_theme_color_override("font_color", Color(0.961, 0.624, 0.043))
	_run_core_sequence(idx + 1)
