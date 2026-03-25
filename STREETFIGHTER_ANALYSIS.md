# StreetFighter Open-Source Game Analysis

## Architecture
- Pure vanilla JS with ES modules, no build step needed
- Canvas-based rendering at 382x224 resolution (pixel art scale)
- Sprite sheet based: each character is a single PNG with frame coordinates defined in code
- Frame-based animation system with per-frame hitbox/hurtbox/pushbox data
- State machine for fighter behavior (idle, walk, jump, crouch, attack, hurt, KO, victory)
- Camera system that follows both fighters
- Sound system using HTML audio elements

## Key Files (6553 lines total)
- `StreetFighterGame.js` - Main game loop (requestAnimationFrame)
- `scenes/BattleScene.js` - Battle orchestration, hit handling, HP tracking
- `scenes/StartScene.js` - Title/start screen
- `entitites/fighters/Fighter.js` (950 lines) - Base fighter class with all mechanics
- `entitites/fighters/Ryu.js` (1398 lines) - Ryu character with all frame data
- `entitites/fighters/Ken.js` - Ken character
- `engine/InputHandler.js` - Keyboard + gamepad input (NO touch support built-in)
- `engine/Camera.js` - Camera following both fighters
- `entitites/overlays/StatusBar.js` - Health bars, timer, scores
- `entitites/stage/KenStage.js` - Background with animated elements

## How Attacks Work
1. InputHandler tracks held/pressed keys per player
2. Fighter.update() calls state handler which checks input
3. e.g. handleIdle checks `control.isLightPunch(this.playerId)` → changes to LIGHT_PUNCH state
4. Attack animation plays with frame-by-frame hitbox data
5. `updateAttackBoxCollided()` checks hitbox vs opponent hurtbox overlap each frame
6. On hit: opponent.handleAttackHit() → damage, slide, hurt animation, hit splash

## Collision System
- Each frame has: sprite coords, pushBox, hurtBox (head/body/legs)
- Attack frames additionally have hitBox
- `getActualBoxDimensions()` converts relative box to world position
- `boxOverlap()` checks AABB intersection

## What Needs to Change for Reskin
1. Replace sprite sheet images (Ryu.png, Ken.png) with Dischordian characters
2. Update frame coordinate maps in character classes
3. Replace stage background image
4. Replace HUD image
5. Add touch controls overlay for mobile
6. Replace sound effects
7. Update character names/IDs
8. Integrate into React component (embed canvas)

## Critical: No Touch Support
The original game only supports keyboard + gamepad. We need to add a touch control overlay for mobile.
