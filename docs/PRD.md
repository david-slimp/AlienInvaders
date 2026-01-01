# 🪐 Product Requirements Document (PRD)

## Game Title: **AlienInvaders**

**Version:** 0.2.0  
**Author:** David Slimp (rock808) <coder@David-Slimp.com>  
**Platform:** HTML5, TypeScript, Vite (Canvas-based)  
**Genre:** Retro Arcade Shooter  
**Target Audience:** Casual gamers (age 10+), retro gaming fans  
**Status:** Active — PRD maintained alongside current build.

---

## 🧭 1. Project Overview

**AlienInvaders** is a web-based arcade shooter inspired by _Space Invaders_ and _Galaxian_, wrapped in a neon CRT presentation. The player defends Earth by shooting descending alien formations, dodging plasma barrages, and intercepting the bonus mothership while protecting shield structures. The game emphasizes score-chasing, timing, and progressive difficulty.

---

## 🎮 2. Core Gameplay Features

### ✅ MVP Features (Already Implemented)

| Feature                 | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| Player Controls         | Arrow keys or A/D to move, Space to fire, Shift for overcharge             |
| Alien Formations        | 5 rows × 11 columns; each row with unique pixel shapes and point values    |
| Score Tracking          | Score displayed on screen and incremented by enemy kills                   |
| Lives System            | 3 lives with hit-based loss and quick reset                               |
| Game Over Conditions    | Aliens reaching the player or player running out of lives                 |
| Restart Button          | 'R' key to restart the game                                                |
| Pause Functionality     | 'P' key toggles pause                                                      |
| Missile Mechanics       | Player fires upward; enemies fire downward                                 |
| Shields                 | 4 semi-destructible shield blocks that chip away per hit                   |
| Basic Sound Effects     | Oscillator-based sound effects per action                                  |
| Difficulty Scaling      | Alien speed increases as fewer remain; interval shortens per kill          |
| Wave Loop               | New wave spawns after all aliens are destroyed                             |
| Bonus Target            | Mothership fly-bys award extra points                                      |
| Overcharge Shot         | Hold Shift to release triple-shot bursts                                   |

---

## 🔭 3. Stretch Goals / Planned Enhancements

### Visual / Audio

- [ ] Add more sprite variants or animated enemy types
- [ ] Add additional explosion variants and screen shake
- [ ] Add looping background music
- [ ] Add separate volume controls for music/SFX

### Game Mechanics

- [ ] Power-ups:
  - [ ] Triple Shot
  - [ ] Shield Refill
  - [ ] Time Slow
  - [ ] Magnet Coin Pull
- [ ] Boss Fight every 5 waves with unique attack patterns
- [ ] Diverse alien types: cloaked, zig-zag, armored, split-on-death
- [ ] Multiple game modes: Classic, Endless, Hardcore

### Scoring & Progress

- [ ] LocalStorage high score saving
- [ ] Procedural or tiered wave system with labeled “WAVE 1: INVASION” intros
- [ ] Leaderboard integration (optional with backend)
- [ ] Accuracy tracking & bonus for hit streaks

### Multiplayer (Optional Future Phase)

- [ ] Co-op mode with shared shield grid
- [ ] PvP timed score challenge

---

## 🧱 4. Technical Architecture

| Layer               | Details                                                                 |
|---------------------|-------------------------------------------------------------------------|
| Frontend Framework  | Vite + TypeScript + HTML5 Canvas + Web Audio API                        |
| Game Loop           | `requestAnimationFrame()`                                               |
| Canvas Rendering    | Single `<canvas>` for all drawing, overlayed DOM elements               |
| Input Handling      | `keydown` / `keyup` listeners for movement, shooting, pause, etc.       |
| Audio               | Web Audio API (oscillator-based) for sound effects                      |
| Shield Damage       | Simple shield cell grid with per-hit degradation                        |
| State Management    | Basic flags (`gameOver`, `paused`, etc.)                                |

---

## 🧪 5. Testing & Validation

| Area             | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| Cross-browser     | Confirm runs consistently in latest Chrome, Firefox, Safari             |
| Mobile Support    | Optional; not yet implemented                                            |
| Game Feel         | Responsive controls, predictable missile behavior                       |
| Performance       | Stable FPS under high alien count                                       |
| Sound Function    | Sound cues and playback functional across supported devices             |
| Shields           | Masking and pixel collisions behave as expected                         |
| Restart/Replay    | Game resets state, UI elements and shield visuals correctly             |

---

## 📈 6. Success Criteria

- [x] Game loads quickly and plays in browser with no errors
- [x] Clear win/lose conditions
- [x] Shields visibly degrade
- [x] Sound cues and pause features operate without interfering with gameplay
- [x] Players can score, restart, and replay without reloading the page

---

## 📆 7. Roadmap

| Milestone             | Target | Key Features                                              |
|------------------------|--------|-----------------------------------------------------------|
| **v0.1.0 - MVP**         | ✅ Done | Basic shooting, aliens, shields, pause, score tracking   |
| **v1.1 - Polish**      | TBD    | Extra sprite variants, explosions, power-ups             |
| **v1.2 - Progress**    | TBD    | Wave titles, localStorage high score, persistent scoring |
| **v1.3 - Bosses**      | TBD    | Boss encounters, new alien types                         |
| **v2.0 - Leaderboards**| TBD    | Online score saving, rankings                            |
| **v3.0 - Multiplayer** | TBD    | Co-op/PvP mechanics using WebSockets or Colyseus         |

---

## 🗂️ 8. Files & Assets

| File              | Purpose                              |
|-------------------|---------------------------------------|
| `src/index.html`  | Main game container & HTML            |
| `src/main.ts`     | Game logic, rendering, sound          |
| `src/style.css`   | Styling and CRT UI                    |
| `public/`         | Static assets (thumbs, audio, etc.)   |
| `#game`           | Main game rendering surface           |
