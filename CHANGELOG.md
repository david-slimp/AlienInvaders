# 📓 CHANGELOG

All notable changes to **AlienInvaders** will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

---

### 🔖 Legend
- ✅ Complete
- 🚧 In development / planned
- ✨ New feature
- 🐞 Bugfix
- 🔧 Refactor/technical improvement
- 🔥 Removed


---

## [0.1.0] - 2024-09-17  
### 🎮 MVP Release

#### ✅ Added
- Core player controls (left/right movement, shoot missile)
- 5×10 alien grid with different shapes and point values (triangle, circle, square)
- Alien movement with directional shifting and vertical descent
- Single player missile logic (one missile at a time)
- Single alien missile logic (one active shot from the lowest alien closest to player)
- Score tracking with on-screen display
- Game over conditions (alien reaches player, player hit by missile)
- Restart functionality via 'R' key
- Pause/unpause toggle with Spacebar
- Mute/unmute toggle with button and 'M' key
- Sound effects using Web Audio API (oscillator-based)
- Destructible shields using off-screen canvas and alpha masking
- Progressive difficulty: alien speed increases as fewer remain
- "You Win!" condition when all aliens are eliminated
- Visual UI: score, game over message, restart instructions, title, pause overlay

---

## [1.1.0] - Planned  
### ✨ Polish & Visual Enhancements

#### 🚧 To Be Added
- Sprites for aliens, player, and missiles
- Basic explosion animations
- Background music loop
- Sound FX mixing and volume control
- Score saving via `localStorage`
- Shield visual updates (damaged graphics)
- FPS/performance debug overlay

---

## [1.2.0] - Planned  
### 📈 Game Progression & UX

#### 🚧 To Be Added
- Wave system with labels (e.g., "WAVE 2: STRIKE")
- Power-ups (triple shot, shield refill, slow time, magnet)
- Local high score leaderboard (client-side)
- Enemy variation with new movement/behavior patterns

---

## [1.3.0] - Planned  
### 👹 Boss Fights

#### 🚧 To Be Added
- Boss enemies every 5 waves
- Bosses with multi-phase mechanics and unique attacks
- Bonus score for defeating bosses

---

## [2.0.0] - Planned  
### 🌐 Leaderboards & Persistence

#### 🚧 To Be Added
- Online leaderboard support
- Player name input for scoreboards
- Score upload via backend API (TBD)

---

## [3.0.0] - Planned  
### 🤝 Multiplayer Mode

#### 🚧 To Be Added
- Co-op gameplay with shared shields and score
- PvP race mode (who can kill more aliens)
- Real-time syncing via WebSocket/Colyseus
