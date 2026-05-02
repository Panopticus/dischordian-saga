## ════════════════════════════════════════════════════════════════
## MultiplayerBridge — Real-time PvP foundation for CADES FPS.
##
## Status: SCAFFOLDING. This autoload establishes the WebRTC-over-
## browser plumbing and exposes a high-level API for game scripts.
## The full netcode (snapshot interpolation, lag comp, anti-cheat)
## lives one layer up in scripts/multiplayer/* and is built incrementally
## by future PRs.
##
## Architecture:
##   1. SIGNALING. Exchange SDP offers/answers + ICE candidates with
##      the React side via a `MULTIPLAYER_*` PostMessage protocol.
##      The React side relays them to the server's
##      apps/server/cadesSignalingWs.ts WebSocket, which fans them
##      out to the matched peer.
##   2. PEER CONNECTION. Godot's WebRTCMultiplayerPeer wraps the
##      WebRTC PeerConnection that JS owns. We hand the actual
##      connection back to Godot once both sides have completed
##      the handshake.
##   3. SYNC. Once peer.is_connected_to_server() returns true,
##      MultiplayerSpawner / MultiplayerSynchronizer take over for
##      entity replication. See scripts/multiplayer/PlayerSyncRoot.gd.
##
## Lifecycle:
##   1. Game scene calls MultiplayerBridge.host_match(match_id)
##      or MultiplayerBridge.join_match(match_id).
##   2. Bridge posts MULTIPLAYER_NEGOTIATE → React → server WS
##      → opposite peer.
##   3. SDP exchange runs over PostMessage. Bridge invokes
##      WebRTCPeerConnection.create_offer() / create_answer()
##      via JS calls and feeds the result back.
##   4. ICE candidates trickle on both sides via MULTIPLAYER_ICE.
##   5. On connection success: emit `peer_connected(peer_id)`.
##   6. Game scenes use multiplayer.peer (set by the bridge) for
##      MultiplayerSpawner / MultiplayerSynchronizer.
##
## Assumptions:
##   - Web build only. Native runs are dev-mode no-ops.
##   - Two peers max for v1. The signaling protocol does not
##     require this — extending to N-peer FFA is a future patch.
## ════════════════════════════════════════════════════════════════
extends Node

signal peer_connected(peer_id: int)
signal peer_disconnected(peer_id: int)
## Fired when the WebRTC handshake fully completes and the Godot-side
## MultiplayerAPI is ready for spawn/sync traffic.
signal multiplayer_ready(is_host: bool, my_peer_id: int)
## Fired on signaling errors (bad SDP, ICE failure, peer abandoned).
signal handshake_failed(reason: String)
## Game-traffic message received from the peer. Payload is whatever
## the peer pushed into the data channel (string for v1).
signal data_received(payload: Variant)

const HOST_PEER_ID := 1
const REMOTE_PEER_ID := 2
## Hard ceiling on signaling round-trip — if the handshake doesn't
## complete in this window, give up and fall back to the async
## time-trial path.
const HANDSHAKE_TIMEOUT_SEC := 30.0

var is_web: bool = false
var is_host: bool = false
var match_id: String = ""
var my_peer_id: int = 0
var _handshake_complete: bool = false
var _handshake_timer: Timer = null
var _signal_poll_timer: Timer = null

func _ready() -> void:
	is_web = OS.has_feature("web")
	if is_web:
		_install_signal_listener()
		_signal_poll_timer = Timer.new()
		_signal_poll_timer.wait_time = 0.1
		_signal_poll_timer.timeout.connect(_drain_signals)
		add_child(_signal_poll_timer)

func host_match(match_id_arg: String) -> void:
	if not is_web:
		push_warning("[MultiplayerBridge] host_match: web feature disabled, no-op")
		return
	match_id = match_id_arg
	is_host = true
	my_peer_id = HOST_PEER_ID
	_signal_poll_timer.start()
	_arm_handshake_timer()
	_post_to_react("MULTIPLAYER_HOST", {"match_id": match_id})

func join_match(match_id_arg: String) -> void:
	if not is_web:
		push_warning("[MultiplayerBridge] join_match: web feature disabled, no-op")
		return
	match_id = match_id_arg
	is_host = false
	my_peer_id = REMOTE_PEER_ID
	_signal_poll_timer.start()
	_arm_handshake_timer()
	_post_to_react("MULTIPLAYER_JOIN", {"match_id": match_id})

func disconnect_match() -> void:
	if multiplayer.has_multiplayer_peer():
		multiplayer.multiplayer_peer.close()
		multiplayer.multiplayer_peer = null
	if _signal_poll_timer:
		_signal_poll_timer.stop()
	if _handshake_timer:
		_handshake_timer.stop()
	if is_web:
		_post_to_react("MULTIPLAYER_LEAVE", {"match_id": match_id})
	match_id = ""
	is_host = false
	_handshake_complete = false

## ─── React/server signaling plumbing ─────────────────────────────

func _install_signal_listener() -> void:
	# React forwards every MULTIPLAYER_* message it receives from the
	# server WS into window._mpSignals (a queue). We poll-drain it
	# below; same pattern as WebBridge._cadesConfig polling.
	JavaScriptBridge.eval("""
		window._mpSignals = window._mpSignals || [];
		window.addEventListener('message', function(e) {
			if (e.data && typeof e.data.type === 'string' && e.data.type.startsWith('MULTIPLAYER_')) {
				window._mpSignals.push(e.data);
			}
		});
	""")

func _post_to_react(msg_type: String, payload: Dictionary) -> void:
	if not is_web:
		return
	var json = JSON.stringify({"type": msg_type, "payload": payload})
	JavaScriptBridge.eval("window.parent.postMessage(" + json + ", '*');")

func _drain_signals() -> void:
	if not is_web:
		return
	# Atomically swap out the queue so we don't lose signals that
	# arrive between the read and the clear.
	var raw = JavaScriptBridge.eval("(function(){var q=window._mpSignals||[];window._mpSignals=[];return JSON.stringify(q);})()")
	if raw == null or raw == "[]":
		return
	var json = JSON.new()
	if json.parse(String(raw)) != OK:
		return
	var msgs = json.get_data()
	if not (msgs is Array):
		return
	for m in msgs:
		if not (m is Dictionary):
			continue
		_handle_signal(m)

func _handle_signal(msg: Dictionary) -> void:
	var t = String(msg.get("type", ""))
	var payload = msg.get("payload", {})
	match t:
		"MULTIPLAYER_PEER_READY":
			# Both peers have arrived at the signaling room. The host
			# kicks off the SDP offer; the joiner waits for it.
			if is_host:
				_post_to_react("MULTIPLAYER_REQUEST_OFFER", {"match_id": match_id})
		"MULTIPLAYER_OFFER":
			_handle_offer(payload)
		"MULTIPLAYER_ANSWER":
			_handle_answer(payload)
		"MULTIPLAYER_ICE":
			_handle_ice(payload)
		"MULTIPLAYER_CONNECTED":
			# JS-side WebRTC connection completed. Bring up the Godot
			# MultiplayerPeer.
			_finalize_connection()
		"MULTIPLAYER_PEER_LEFT":
			emit_signal("peer_disconnected", REMOTE_PEER_ID if is_host else HOST_PEER_ID)
		"MULTIPLAYER_ERROR":
			var reason = String(payload.get("reason", "unknown"))
			emit_signal("handshake_failed", reason)
			disconnect_match()

func _handle_offer(_payload: Dictionary) -> void:
	# Joiner: accept offer, generate answer, post back. The actual
	# WebRTC.setRemoteDescription / createAnswer calls are issued
	# JS-side because Godot's WebRTCPeerConnection wraps the same
	# browser primitive — we just hand the fully-formed
	# WebRTCMultiplayerPeer back to MultiplayerAPI in _finalize.
	pass

func _handle_answer(_payload: Dictionary) -> void:
	# Host: receive answer, set remote description, wait for ICE.
	pass

func _handle_ice(_payload: Dictionary) -> void:
	# Trickle ICE candidate. JS-side adds via pc.addIceCandidate().
	pass

func _finalize_connection() -> void:
	if _handshake_complete:
		return
	_handshake_complete = true
	if _handshake_timer:
		_handshake_timer.stop()
	# T13: install a JS-side hook that pushes inbound data-channel
	# messages into window._mpInbox. We poll-drain it from
	# _drain_inbound_data below. The peer connection itself is owned
	# by useCadesSignaling and exposed at window._mpPc /
	# window._mpDataChannel.
	if is_web:
		JavaScriptBridge.eval("""
			(function(){
				if (!window._mpInbox) window._mpInbox = [];
				if (window._mpDataChannel && !window._mpDataChannel._mpHooked) {
					window._mpDataChannel._mpHooked = true;
					var orig = window._mpDataChannel.onmessage;
					window._mpDataChannel.onmessage = function(ev) {
						window._mpInbox.push(typeof ev.data === 'string' ? ev.data : '');
						if (orig) orig(ev);
					};
				}
			})();
		""")
		# Drain inbound data on a fast timer so the gameplay loop
		# sees peer messages within one frame.
		var rx_timer := Timer.new()
		rx_timer.wait_time = 1.0 / 30.0  # 30 Hz drain
		rx_timer.timeout.connect(_drain_inbound_data)
		add_child(rx_timer)
		rx_timer.start()
	emit_signal("multiplayer_ready", is_host, my_peer_id)
	emit_signal("peer_connected", REMOTE_PEER_ID if is_host else HOST_PEER_ID)

func _drain_inbound_data() -> void:
	if not is_web:
		return
	var raw = JavaScriptBridge.eval("(function(){var q=window._mpInbox||[];window._mpInbox=[];return JSON.stringify(q);})()")
	if raw == null or raw == "[]":
		return
	var json := JSON.new()
	if json.parse(String(raw)) != OK:
		return
	var msgs = json.get_data()
	if not (msgs is Array):
		return
	for m in msgs:
		emit_signal("data_received", m)

## Send game-traffic data over the peer-to-peer data channel. Wraps
## window._mpDataChannel.send via the React host (so the React
## relay isn't a hop in the hot path).
func send_to_peer(payload: String) -> void:
	if not is_web:
		return
	if not _handshake_complete:
		push_warning("[MultiplayerBridge] send_to_peer before handshake — dropping")
		return
	# Escape and route through React-side helper that calls
	# window._mpDataChannel.send.
	var escaped = JSON.stringify(payload)
	JavaScriptBridge.eval(
		"(function(){if(window._mpDataChannel && window._mpDataChannel.readyState==='open'){window._mpDataChannel.send(" + escaped + ");}})()"
	)

func _arm_handshake_timer() -> void:
	if _handshake_timer == null:
		_handshake_timer = Timer.new()
		_handshake_timer.wait_time = HANDSHAKE_TIMEOUT_SEC
		_handshake_timer.one_shot = true
		_handshake_timer.timeout.connect(_on_handshake_timeout)
		add_child(_handshake_timer)
	_handshake_complete = false
	_handshake_timer.start()

func _on_handshake_timeout() -> void:
	if _handshake_complete:
		return
	emit_signal("handshake_failed", "timeout")
	disconnect_match()
