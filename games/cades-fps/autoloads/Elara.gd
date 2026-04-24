extends Node

var _queue: Array[String] = []
var _run_start_queue: Array[String] = []
var _last_spoken: float = 0.0
var _cooldown: float = 7.0

# Maps Elara.speak() keys to URLs in apps/shared/cadesVoManifest.json.
# Only keys present in the manifest get voiced; others remain subtitle-only.
const VO_BASE = "https://dgrsvoices.s3.us-east-2.amazonaws.com/CADES+Voices"
const VO_URLS = {
	# Mode 1 — Elara narration over Iron Lion's loop
	"time_2h":             VO_BASE + "/elara/elara_pause.mp3",
	"iron_lion_memory":    VO_BASE + "/elara/elara_memory.mp3",
	"iron_lion_suspects":  VO_BASE + "/elara/elara_looked.mp3",
	"iron_lion_waiting":   VO_BASE + "/elara/elara_waiting.mp3",
	"time_canon":          VO_BASE + "/elara/elara_canon.mp3",
	"loop_reset":          VO_BASE + "/elara/elara_bridge_holds.mp3",
	# Mode 2 — Ship Defense
	"game_start":                 VO_BASE + "/elara/elara_25min.mp3",
	"breach_lost_engineering":    VO_BASE + "/elara/elara_eng_breach.mp3",
	"breach_lost_cargo":          VO_BASE + "/elara/elara_cargo_breach.mp3",
	"breach_lost_observation":    VO_BASE + "/elara/elara_obs_breach.mp3",
	"shields_done":               VO_BASE + "/elara/elara_shields_done.mp3",
	"shields_fail":               VO_BASE + "/elara/elara_shields_fail.mp3",
	"thoughtborn_first":          VO_BASE + "/elara/elara_thoughtborn.mp3",
	"thoughtborn_rev":            VO_BASE + "/elara/elara_changed.mp3",
	# Mode 3 — Historical Incursions
	"matrix_hub_enter":    VO_BASE + "/elara/elara_matrix.mp3",
	"gm_theory":           VO_BASE + "/elara/elara_gm_theory.mp3",
	"gm_final":            VO_BASE + "/elara/elara_dont_answer.mp3",
	# The Game Masters speak over the secondary channel directly
	"gm_contact_1":        VO_BASE + "/game_masters/gm_unauthorized.mp3",
	"gm_contact_2":        VO_BASE + "/game_masters/gm_stop.mp3",
	"gm_contact_3":        VO_BASE + "/game_masters/gm_curious.mp3",
}

const LINES = {
	# Mode 1
	"loop_reset": "The bridge holds. Dawn comes again.",
	"iron_lion_pause": "He paused at the parapet. He looked at his hands. Then he went back.",
	"iron_lion_memory": "He said something: 'I've been here before.' To no one.",
	"iron_lion_suspects": "He looked toward us today. He doesn't know what he's looking at.",
	"iron_lion_waiting": "He's waiting. He's very patient.",
	"iron_lion_channel": "He's waiting. The channel is open. He can hear you.",
	"wave_1": "The scouts are probing. He knows this.",
	"wave_4_soldiers": "Soldiers now. He's adjusting.",
	"wave_7": "Shielded units. He's already changing angle.",
	"wave_10_disruptors": "Something's affecting his aim. He knows what that means.",
	"wave_13": "A command unit. They're committing. This is unusual.",
	"token_used": "One soldier. They went when called.",
	"tokens_3": "Three left. Choose carefully.",
	"tokens_0": "No one left to call. It's just him now.",
	"time_1h": "One hour. The ships are still boarding.",
	"time_2h": "Two hours. He hasn't stopped moving.",
	"time_canon": "Three hours, forty-seven minutes. The ships cleared the range. He held it.",
	"open_channel_ready": "The channel is ready. When you are.",
	# Mode 2
	"game_start": "I need twenty-five minutes. Hold the breaches.",
	"breach_lost_engineering": "Engineering breach — the Reclamation are through.",
	"breach_lost_cargo": "Cargo hold — Salvagers. They move fast. Move faster.",
	"breach_lost_observation": "Observation deck — the Thoughtborn are walking toward the unit. Don't shoot them.",
	"breach_regained_engineering": "Engineering clear.",
	"breach_regained_cargo": "Cargo hold secure.",
	"breach_regained_observation": "Observation deck — they've stopped.",
	"thoughtborn_first": "They followed Iron Lion's signal. They've been looking for years.",
	"thoughtborn_contact": "Their leader is asking for us. I'm going to answer.",
	"thoughtborn_rev": "I changed three assessments in five minutes. Uncomfortable. Correct.",
	"thoughtborn_gone": "Tell them they're welcome to look. But they'll need to knock.",
	"shields_25": "Twenty-five percent. Keep the breaches held.",
	"shields_50": "Halfway. Don't lose Engineering.",
	"shields_75": "Almost there.",
	"shields_done": "Shields at full power. Ark 1047 is secure.",
	"shields_fail": "Shields failed. I needed more time. I'm sorry.",
	# Mode 3
	"matrix_hub_enter": "Welcome to the Matrix of Dreams. Built by an Archon. Maintained by fans.",
	"pillar_last_stand": "This one you know. But knowing and being there aren't the same.",
	"pillar_first_breath": "Before the Architect became what he became. The Game Master preserved this.",
	"pillar_severance": "Kael, uncorrupted. The moment before Project Vector completed.",
	"pillar_thaloria": "What the Collector did. Archived without comment. He found it beautiful.",
	"pillar_fall": "The Oracle's prophecy. The one nobody was ready to hear.",
	"pillar_agent_zero": "What she chose to forget. It's locked until you're ready.",
	"scenario_enter": "Going in. I'll be outside. Tell me when you're back.",
	"scenario_exit": "You're back.",
	"gm_contact_1": "First contact from the Game Masters. They've noticed.",
	"gm_contact_2": "Second message. They're concerned about Iron Lion asking questions.",
	"gm_contact_3": "They're curious about you specifically.",
	"gm_final": "Final transmission. Full offer.",
	"gm_theory": "The Game Master was destroyed from inside. Iron Lion is asking. I have a theory.",
	# Boot Diagnostic — first-time calibration protocol. These fire
	# directly from BootDiagnostic.gd via $HUD.show_elara rather than
	# through the Elara queue, because the tutorial needs tighter
	# pacing than the 7-second gameplay cooldown allows. The strings
	# live here so they stay discoverable with the rest of Elara's
	# voice and can later be lifted into VO_URLS if we author audio.
	"boot_power_cycle": "CADES Unit, power cycle complete. Identity handshake — acknowledged. Running post-reboot diagnostic. Protocol three, standard.",
	"boot_optics": "Optics online. Look around — anywhere. Confirm the gimbal tracks.",
	"boot_optics_ok": "Optics nominal.",
	"boot_locomotion": "Locomotion next. A calibration mark is lit on the deck. Walk to it.",
	"boot_locomotion_ok": "Servos nominal. Jump systems cleared on the walk.",
	"boot_weapons": "Weapons diagnostic. A target drone is inbound. Discharge your primary until it's down.",
	"boot_weapons_ok": "Weapons nominal. Loadout integrity: full.",
	"boot_loadout": "One more thing. Cycle to your secondary. A second drone, same protocol.",
	"boot_loadout_ok": "Secondary discharge clean. Cycling back.",
	"boot_complete": "Diagnostic complete. CADES Unit is cleared for theater. Returning you to the Matrix Anchor.",
	"boot_abort": "Protocol aborted. Returning to the Matrix Anchor.",
}

func speak(key: String) -> void:
	_queue.append(key)

func queue_for_run_start(key: String) -> void:
	_run_start_queue.append(key)

func flush_run_start_queue() -> void:
	for key in _run_start_queue:
		_queue.append(key)
	_run_start_queue.clear()

func _process(_delta: float) -> void:
	if _queue.is_empty(): return
	var now = Time.get_ticks_msec() / 1000.0
	if now - _last_spoken < _cooldown: return
	var key = _queue.pop_front()
	_display(key)
	_last_spoken = now

func _display(key: String) -> void:
	var text = LINES.get(key, "")
	if text.is_empty(): return
	var hud = get_tree().get_first_node_in_group("hud")
	if hud and hud.has_method("show_elara"):
		hud.show_elara("ELARA: " + text)
	_play_vo(key)

func _play_vo(key: String) -> void:
	# Only the web export can reach the remote VO bucket; desktop runs stay
	# subtitle-only. We use the browser's native Audio element via
	# JavaScriptBridge instead of Godot's AudioStreamMP3 so we don't have
	# to bundle the files locally or cold-load them through HTTPRequest.
	if not OS.has_feature("web"):
		return
	var url = VO_URLS.get(key, "")
	if url == "":
		return
	JavaScriptBridge.eval("""
		(function(){
			try {
				if (window._cadesVoAudio) { window._cadesVoAudio.pause(); }
				var a = new Audio(%s);
				a.volume = 0.85;
				window._cadesVoAudio = a;
				a.play().catch(function(){});
			} catch(e) {}
		})();
	""" % JSON.stringify(url))
