# CADES PvP — Async + Real-time Architecture

Status: async (Tier 5C) shipping; real-time foundation in place
Last updated: 2026-05-02

This document covers the two flavors of CADES FPS PvP and the Dead
Man's Circuit Rival Run that share the same Godot ↔ React ↔ server
plumbing.

## Async Time-Trial PvP (shipping)

**Lore framing**: "Last Stand: Rival Run" / "Rival Circuit". Both
players race the same scenario seed solo; the higher composite score
wins. Same patterns drive Tier 5A (Dead Man's Circuit) and Tier 5C
(CADES) — only the score formula and seed payload differ.

### Flow

1. Player A queues from `/pvp-variants` → Circuit / CADES tab,
   `proposeMatch` returns a `matchId` + deterministic `scenarioSeed`
   / `trackSeed`.
2. Player A navigates to `/cades?match=<matchId>` (or
   `/dead-mans-circuit?match=<matchId>`).
3. The page hydrates `pvpMatch` via `tier5Pvp.cades.getMyMatches` /
   `tier5Pvp.circuit.getMyMatches`.
4. On `CADES_READY` / `CIRCUIT_READY` from the iframe, the page posts
   `*_CONFIG` with the additional fields:
   ```ts
   {
     ...usualConfig,
     pvp_seed: string,        // deterministic scenario/track seed
     pvp_match_id: string,    // server-issued match id
     opponent_score: number,  // -1 if opponent hasn't run yet
     opponent_name: string,
   }
   ```
5. Godot's `WebBridge.gd` reads these, latches them, and emits
   `pvp_config_received(seed, opponent_score, opponent_name, match_id)`.
   Scenarios listen for this signal to seed their RNG deterministically.
6. On scenario complete, `WebBridge.send_result(data)` echoes
   `pvp_match_id` and `pvp_seed` back in the result payload.
7. The React page picks up `pvp_match_id` in `*_RESULT` and calls
   `tier5Pvp.cades.submitScore` / `tier5Pvp.circuit.submitResult` with
   the composite score (CADES: `waves * 10 + kills`; DMC: position +
   survival + kills).
8. Server reconciles both submissions, decides winner, mirrors into
   `competitive_ratings`, fires title grants + clue drops.

### Files

| Layer | File |
|-------|------|
| Server router | `apps/server/routers/tier5Pvp.ts` (sub-routers `cades`, `circuit`) |
| Schema | `apps/db/schema.ts` — `cades_pvp_matches`, `circuit_pvp_matches` |
| Migration | `apps/db/0061_pvp_overhaul.sql` |
| React (CADES) | `apps/client/src/pages/CADESFPSPage.tsx` |
| React (DMC) | `apps/client/src/pages/DeadMansCircuitPage.tsx` |
| Godot bridge (CADES) | `games/cades-fps/autoloads/WebBridge.gd` |
| Godot bridge (DMC) | `games/dead-mans-circuit/autoloads/WebBridge.gd` |

## Real-time PvP foundation (scaffolding, not playable yet)

The async path covers most of the design intent. Real-time
direct-shot FPS PvP is layered on top via WebRTC peer-to-peer.

### Components

```
  ┌─ Godot iframe ──────────────────┐
  │  MultiplayerBridge.gd (autoload)│
  │   - host_match(match_id)        │
  │   - join_match(match_id)        │
  │   - manages WebRTCPeerConnection│
  │      via JavaScriptBridge       │
  │  PlayerSyncRoot.gd              │
  │   - MultiplayerSpawner +        │
  │     MultiplayerSynchronizer     │
  │   - replicates RemotePlayer     │
  └─────────────┬───────────────────┘
                │ PostMessage MULTIPLAYER_*
                ▼
  ┌─ React parent ──────────────────┐
  │  useCadesSignaling hook         │
  │   - opens WS to                 │
  │     /ws/cades-signaling         │
  │   - relays MULTIPLAYER_*        │
  │     PostMessages ↔ WS messages  │
  └─────────────┬───────────────────┘
                │ WS
                ▼
  ┌─ Server ────────────────────────┐
  │  cadesSignalingWs.ts            │
  │   - stateless room-based relay  │
  │   - JOIN_ROOM / OFFER /         │
  │     ANSWER / ICE / LEAVE        │
  │   - sends PEER_READY when both  │
  │     peers arrive                │
  └─────────────────────────────────┘
```

### Wire protocol (server ↔ client)

**Client → Server:**
```jsonc
{ "type": "JOIN_ROOM", "matchId": "cades_xyz", "role": "host" | "joiner", "userId": 42 }
{ "type": "OFFER",     "matchId": "cades_xyz", "sdp":  { ...RTCSessionDescription } }
{ "type": "ANSWER",    "matchId": "cades_xyz", "sdp":  { ...RTCSessionDescription } }
{ "type": "ICE",       "matchId": "cades_xyz", "candidate": { ...RTCIceCandidate } }
{ "type": "LEAVE",     "matchId": "cades_xyz" }
```

**Server → Client:**
```jsonc
{ "type": "PEER_READY", "matchId": "cades_xyz" }   // both peers present
{ "type": "OFFER",   "sdp":  { ... } }              // forwarded
{ "type": "ANSWER",  "sdp":  { ... } }              // forwarded
{ "type": "ICE",     "candidate": { ... } }         // forwarded
{ "type": "PEER_LEFT" }                             // partner disconnected
{ "type": "ERROR",   "reason": "..." }
```

**Server → iframe** (via React `useCadesSignaling`):
Each server message is forwarded with the `MULTIPLAYER_` prefix
(`PEER_READY` → `MULTIPLAYER_PEER_READY`, etc.) so Godot's
`MultiplayerBridge` listener picks it up.

### What's done in this PR

- [x] WS server with full JOIN / OFFER / ANSWER / ICE / LEAVE
      message handling + room pairing
- [x] Per-room peer slots (host/joiner) with collision detection
- [x] PEER_READY notification when both peers arrive
- [x] PEER_LEFT cleanup on disconnect
- [x] React `useCadesSignaling` hook bridges iframe ↔ WS
- [x] Godot `MultiplayerBridge.gd` autoload with signal-driven API
      (`host_match`, `join_match`, `disconnect_match`)
- [x] Godot `PlayerSyncRoot.gd` topology scaffold for spawner /
      synchronizer setup
- [x] 7 server-side smoke tests (room pairing, OFFER relay, role
      conflict, peer-left notify, malformed JSON, status snapshot)

### What's NOT done (future work)

- [ ] Actual WebRTC `RTCPeerConnection` lifecycle in JS — the bridge
      currently only relays signaling messages; the SDP/ICE
      generation needs to happen JS-side via `new RTCPeerConnection()`.
      See `MultiplayerBridge.gd._handle_offer/_answer/_ice` (currently
      stubs).
- [ ] Wiring the JS-side `RTCPeerConnection` back into Godot's
      `WebRTCMultiplayerPeer`. Godot 4.6 ships a
      `WebRTCPeerConnectionExtension` interface for this; the wrapper
      is non-trivial.
- [ ] Per-entity `MultiplayerSynchronizer` configs on
      `RemotePlayer.tscn`. (The scene scaffolding landed in
      `games/cades-fps/scenes/multiplayer/RemotePlayer.tscn` along
      with `RemotePlayer.gd`; per-entity synchronizer wiring is the
      remaining work.)
- [ ] Server-side validation / anti-cheat: damage clamp, fire-rate
      limit, server-authoritative hit detection. Currently the
      authority model is "trust the host"; that's fine for friendly
      duels but unsuitable for ladder.
- [ ] STUN/TURN configuration for users behind symmetric NATs. The
      server-side relay only carries signaling, not media — peers
      need a TURN server URL in the `RTCPeerConnection` config to
      relay when direct UDP fails.
- [ ] Packet pacing / interpolation / prediction. Snapshot at 20 Hz
      with client-side interpolation is the standard playbook.

### Run book

1. **Local test** of the signaling WS without Godot:
   ```bash
   pnpm vitest run apps/server/cadesSignalingWs.test.ts
   ```

2. **Local end-to-end** with two browser tabs (once the WebRTC JS
   is wired):
   - `pnpm dev`
   - Tab A: `/pvp-variants` → CADES → propose vs your own user id
   - Tab B: `/cades?match=<id>&role=joiner` (URL from tab A's
     proposal toast)
   - Watch the server logs for `cades_signaling_join` events.

3. **Production deploy considerations**:
   - The `/ws/cades-signaling` endpoint must be exposed through any
     reverse proxy (Cloudflare / Railway / etc.) with WebSocket
     upgrades enabled.
   - For NAT traversal, configure a TURN server (e.g.
     `turn:turn.example.com:3478` with credentials) and pass it into
     the `RTCPeerConnection` config when wired.
   - Signaling room state is in-process memory. For multi-instance
     deploys, swap the `rooms` Map for Redis pub/sub (each instance
     subscribes to `signaling:<matchId>`).

### Testing strategy

- **Unit**: signaling WS protocol (in this PR — 7 tests).
- **Integration**: needs both the React side and Godot's
  WebRTC wrapper to be wired before integration tests are useful.
- **Manual**: two browsers on the same dev box; check the server
  logs and browser dev-tools `RTCPeerConnection` state.
- **End-to-end**: deferred until the WebRTC JS layer ships.

## Lore-cohesion notes

- The Hierarchy archetype's "Two Witnesses" co-testimony lives in
  card co-op (Tier 3 plan); CADES PvP is its competitive sibling for
  the FPS modality.
- The Game Master watches every Rival Run — a future scenario hook
  could fire a Game Master commentary line when both players are in
  the same room (`MULTIPLAYER_PEER_READY` is the trigger).
