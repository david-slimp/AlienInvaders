# 🪐 Product Requirements Document (PRD)

## Game Title: **AlienInvaders**

**Version:** MVP 0.1.0  
**Author:** David Slimp (rock808) <coder@David-Slimp.com>  
**Platform:** HTML5, JavaScript (Canvas-based)  
**Genre:** Retro Arcade Shooter  
**Target Audience:** Casual gamers (age 10+), retro gaming fans  
**Status:** MVP Complete — PRD created post-launch to formalize features and guide future iterations.

---

## 🧭 1. Project Overview

**AlienInvaders** is a web-based arcade shooter inspired by _Space Invaders_ and _Galaxian_, and enhanced with modern browser features. The player defends Earth by shooting descending alien formations while protecting shield structures. The game emphasizes score-chasing, strategic timing, and progressive difficulty.

---

## 🎮 2. Core Gameplay Features

### ✅ MVP Features (Already Implemented)

| Feature                 | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| Player Controls         | Arrow keys for movement + Up arrow to shoot                                |
| Alien Formations        | 5 rows × 10 columns; each row with unique shapes and point values          |
| Score Tracking          | Score displayed on screen and incremented by enemy kills                   |
| Game Over Conditions    | Aliens reaching the player or alien missile collision                      |
| Restart Button          | 'R' key to restart the game                                                |
| Pause Functionality     | Space bar toggles pause                                                    |
| Mute Button             | Toggle audio via button or 'M' key                                         |
| Missile Mechanics       | Player fires upward; enemies fire downward                                 |
| Shields                 | 3 semi-destructible shields using alpha-based canvas masking               |
| Basic Sound Effects     | Oscillator-based sound effects per action                                  |
| Difficulty Scaling      | Alien speed increases as fewer remain; interval shortens per kill          |
| Win Condition           | All aliens destroyed (with bonus points)                                   |

---

## 🔭 3. Stretch Goals / Planned Enhancements

### Visual / Audio

- [ ] Replace geometric alien/player shapes with sprites or sprite sheets
- [ ] Add particle-based explosion effects
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
| Frontend Framework  | Vanilla JS + HTML5 Canvas + Web Audio API                              |
| Game Loop           | `requestAnimationFrame()`                                               |
| Canvas Rendering    | Single `<canvas>` for all drawing, overlayed DOM elements               |
| Input Handling      | `keydown` / `keyup` listeners for movement, shooting, pause, etc.       |
| Audio               | Web Audio API (oscillator-based) for sound effects                      |
| Shield Masking      | Off-screen canvas with alpha manipulation (`globalCompositeOperation`)  |
| State Management    | Basic flags (`gameOver`, `paused`, etc.)                                |

---

## 🧪 5. Testing & Validation

| Area             | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| Cross-browser     | Confirm runs consistently in latest Chrome, Firefox, Safari             |
| Mobile Support    | Optional; not yet implemented                                            |
| Game Feel         | Responsive controls, predictable missile behavior                       |
| Performance       | Stable FPS under high alien count                                       |
| Sound Function    | Mute/unmute and sound playback functional across supported devices      |
| Shields           | Masking and pixel collisions behave as expected                         |
| Restart/Replay    | Game resets state, UI elements and shield visuals correctly             |

---

## 📈 6. Success Criteria

- [x] Game loads quickly and plays in browser with no errors
- [x] Clear win/lose conditions
- [x] Shields visibly degrade
- [x] Sound and pause/mute features operate without interfering with gameplay
- [x] Players can score, restart, and replay without reloading the page

---

## 📆 7. Roadmap

| Milestone             | Target | Key Features                                              |
|------------------------|--------|-----------------------------------------------------------|
| **v0.1.0 - MVP**         | ✅ Done | Basic shooting, aliens, shields, pause, score tracking   |
| **v1.1 - Polish**      | TBD    | Sprites, explosions, power-ups                           |
| **v1.2 - Progress**    | TBD    | Wave titles, localStorage high score, persistent scoring |
| **v1.3 - Bosses**      | TBD    | Boss encounters, new alien types                         |
| **v2.0 - Leaderboards**| TBD    | Online score saving, rankings                            |
| **v3.0 - Multiplayer** | TBD    | Co-op/PvP mechanics using WebSockets or Colyseus         |

---

## 🗂️ 8. Files & Assets

| File              | Purpose                              |
|-------------------|---------------------------------------|
| `invaders.html`      | Main game container & HTML            |
| `<script>` (inline)| Game logic, rendering, sound         |
| `canvas`          | Main game rendering surface           |
| `shieldCanvas`    | Off-screen canvas for damage          |
| `#gameOver`, `#score` | UI overlays                       |

