extends Node
class_name AmbientDrone

# Procedural ambient drone. Sums three low-frequency sine waves into an
# AudioStreamGenerator and breathes each partial with its own slow LFO
# so the bed never loops in a detectable way. No audio asset to ship —
# the whole thing generates from the @export frequencies below.
#
# Per-level palettes live in the .tscn's instance overrides; the
# defaults tune for "dark, tense, big room".
#
# CPU budget: at 11 025 Hz × 0.2 s buffer refilled once per frame, the
# inner loop does ~11 k sin() calls per second total — cheap even on
# web builds. Amplitude default (-16 dB via volume_db) is intentionally
# subtle: the drone should register as "the room has air", not music.

@export_range(20.0, 200.0) var base_freq_a: float = 55.00     # ~A1
@export_range(20.0, 200.0) var base_freq_b: float = 82.41     # ~E2
@export_range(20.0, 200.0) var base_freq_c: float = 110.00    # ~A2
@export_range(0.0, 0.5) var amplitude: float = 0.12
@export_range(0.0, 1.0) var lfo_rate_a: float = 0.07
@export_range(0.0, 1.0) var lfo_rate_b: float = 0.11
@export_range(0.0, 1.0) var lfo_rate_c: float = 0.13
@export var volume_db: float = -16.0
@export var bus: String = "master"
# Web builds are more sensitive to audio-thread starvation; 11 025 Hz is
# plenty of headroom for a <200 Hz drone and halves the per-frame work.
@export var mix_rate: float = 11025.0
@export_range(0.1, 2.0) var fade_in_seconds: float = 2.5

var _player: AudioStreamPlayer
var _playback: AudioStreamGeneratorPlayback
var _phase_a: float = 0.0
var _phase_b: float = 0.0
var _phase_c: float = 0.0
var _lfo_time: float = 0.0

func _ready() -> void:
	# Run through SceneTree pauses (Open Channel cinematic in particular)
	# so the atmosphere doesn't drop to silence mid-conversation.
	process_mode = Node.PROCESS_MODE_ALWAYS
	_player = AudioStreamPlayer.new()
	_player.bus = bus
	_player.volume_db = -80.0  # start silent, fade in below
	_player.process_mode = Node.PROCESS_MODE_ALWAYS
	var gen := AudioStreamGenerator.new()
	gen.mix_rate = mix_rate
	gen.buffer_length = 0.2
	_player.stream = gen
	add_child(_player)
	_player.play()
	_playback = _player.get_stream_playback()
	if fade_in_seconds > 0.0:
		var tween := create_tween()
		tween.tween_property(_player, "volume_db", volume_db, fade_in_seconds)
	else:
		_player.volume_db = volume_db

func _process(delta: float) -> void:
	if _playback == null:
		return
	_lfo_time += delta
	# LFOs breathe the three partials at different rates so the combined
	# envelope never periodically lines up — stays "organic" indefinitely.
	var lfo_a: float = 0.60 + 0.40 * sin(_lfo_time * TAU * lfo_rate_a)
	var lfo_b: float = 0.50 + 0.50 * sin(_lfo_time * TAU * lfo_rate_b)
	var lfo_c: float = 0.40 + 0.60 * sin(_lfo_time * TAU * lfo_rate_c)
	var amp_a: float = amplitude * 0.40 * lfo_a
	var amp_b: float = amplitude * 0.30 * lfo_b
	var amp_c: float = amplitude * 0.30 * lfo_c
	var dphase_a: float = TAU * base_freq_a / mix_rate
	var dphase_b: float = TAU * base_freq_b / mix_rate
	var dphase_c: float = TAU * base_freq_c / mix_rate
	var frames: int = _playback.get_frames_available()
	for i in frames:
		var sample: float = (
			sin(_phase_a) * amp_a +
			sin(_phase_b) * amp_b +
			sin(_phase_c) * amp_c
		)
		_playback.push_frame(Vector2(sample, sample))
		_phase_a += dphase_a
		_phase_b += dphase_b
		_phase_c += dphase_c
		# Keep phases bounded so float precision stays clean across
		# long runs (25-min Ship Defense in particular).
		if _phase_a > TAU: _phase_a -= TAU
		if _phase_b > TAU: _phase_b -= TAU
		if _phase_c > TAU: _phase_c -= TAU
