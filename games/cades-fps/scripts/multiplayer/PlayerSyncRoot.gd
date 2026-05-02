extends Node
## ════════════════════════════════════════════════════════════════
## PlayerSyncRoot — entity replication scaffolding for CADES PvP.
##
## Status: SCAFFOLDING. Establishes the spawner/synchronizer topology
## but does NOT enable replication (peer transport is wired by
## MultiplayerBridge in a follow-up). Adding this module without an
## active MultiplayerPeer is safe — Godot treats every node as
## locally-owned by peer 1 (HOST_PEER_ID).
##
## Topology:
##
##   PlayerSyncRoot (this node — set as MultiplayerSpawner root path)
##   ├── MultiplayerSpawner   (replicates child additions to peers)
##   │   └── spawnable_scene = res://scenes/players/RemotePlayer.tscn
##   ├── LocalPlayer          (already in scene; not synced — we
##   │                         broadcast its transform via
##   │                         MultiplayerSynchronizer)
##   └── (RemotePlayer instances spawn here on JOIN events)
##
## Fields synced on the MultiplayerSynchronizer attached to each
## RemotePlayer scene:
##   - transform (server auth, client interp)
##   - velocity  (server auth)
##   - aim_pitch (server auth)
##   - current_weapon (RPC on swap, not continuously synced)
##   - hp (server auth, anti-cheat clamps deltas)
##
## RPC channels (each declared on the RemotePlayer scene script):
##   - fire_weapon(weapon_id, hit_targets)  reliable, server validates
##   - take_damage(amount, source_peer_id)  reliable, server clamps
##   - swap_weapon(weapon_id)               reliable
## ════════════════════════════════════════════════════════════════

signal remote_player_spawned(peer_id: int)
signal remote_player_despawned(peer_id: int)

var _remote_players: Dictionary = {}  # peer_id → Node
var _spawner: MultiplayerSpawner = null

func _ready() -> void:
	# Watch the bridge for connection lifecycle events.
	if Engine.has_singleton("MultiplayerBridge"):
		var bridge = Engine.get_singleton("MultiplayerBridge")
		bridge.peer_connected.connect(_on_peer_connected)
		bridge.peer_disconnected.connect(_on_peer_disconnected)
		bridge.handshake_failed.connect(_on_handshake_failed)
	# The spawner is added as a child via the .tscn, but we can
	# create it programmatically too if the scene was loaded
	# without the editor wiring. Look it up by name; tolerate absence.
	_spawner = get_node_or_null("MultiplayerSpawner") as MultiplayerSpawner

func _on_peer_connected(peer_id: int) -> void:
	# Multiplayer peer ready — the spawner will replicate the local
	# player onto the remote peer's tree on its next add_child call.
	# We delegate the actual spawn to whichever scene script owns
	# player creation (GameMode autoload or scene-level director).
	emit_signal("remote_player_spawned", peer_id)

func _on_peer_disconnected(peer_id: int) -> void:
	if _remote_players.has(peer_id):
		var node: Node = _remote_players[peer_id]
		if is_instance_valid(node):
			node.queue_free()
		_remote_players.erase(peer_id)
	emit_signal("remote_player_despawned", peer_id)

func _on_handshake_failed(_reason: String) -> void:
	# Hand back to the async time-trial fallback. The game scene is
	# expected to listen for this and gracefully degrade — for v1 we
	# just log; the scene-level handler decides whether to abort.
	push_warning("[PlayerSyncRoot] Handshake failed: " + _reason)

func register_remote_player(peer_id: int, node: Node) -> void:
	## Called by the spawner's `spawned` signal handler in the scene
	## that owns this PlayerSyncRoot. Stored locally so we can clean up
	## on disconnect without scanning the tree.
	_remote_players[peer_id] = node

func get_remote_player(peer_id: int) -> Node:
	return _remote_players.get(peer_id, null)

func remote_player_count() -> int:
	return _remote_players.size()
