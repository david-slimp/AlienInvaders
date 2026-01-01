import "./style.css";
import pkg from "../package.json";

type Vec2 = { x: number; y: number };

type InputState = {
  left: boolean;
  right: boolean;
  fire: boolean;
  overcharge: boolean;
  pause: boolean;
};

type Star = {
  x: number;
  y: number;
  speed: number;
  size: number;
  hue: number;
};

type AlienType = {
  color: string;
  points: number;
  hp: number;
  glow: string;
};

type Explosion = {
  x: number;
  y: number;
  life: number;
  color: string;
};

type ShieldCell = {
  x: number;
  y: number;
  hp: number;
};

type Bullet = {
  pos: Vec2;
  vel: Vec2;
  friendly: boolean;
  radius: number;
  color: string;
};

type UFO = {
  pos: Vec2;
  speed: number;
  active: boolean;
  direction: number;
  hp: number;
};

type Player = {
  pos: Vec2;
  width: number;
  height: number;
  speed: number;
  cooldown: number;
  lives: number;
  overcharge: number;
};

type GameState = {
  score: number;
  wave: number;
  running: boolean;
  paused: boolean;
  gameOver: boolean;
  lastFrame: number;
  nextAlienShot: number;
  nextUfo: number;
  formationDir: number;
  formationSpeed: number;
  formationDrop: number;
  formationTick: number;
  animStep: boolean;
};

const canvas = document.querySelector<HTMLCanvasElement>("#game");
const scoreEl = document.querySelector<HTMLDivElement>("#score");
const waveEl = document.querySelector<HTMLDivElement>("#wave");
const livesEl = document.querySelector<HTMLDivElement>("#lives");
const editionEl = document.querySelector<HTMLDivElement>("#edition");

if (!canvas || !scoreEl || !waveEl || !livesEl || !editionEl) {
  throw new Error("Missing UI elements");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Unable to acquire 2D context");
}

const WORLD = {
  width: canvas.width,
  height: canvas.height,
  floor: canvas.height - 32
};

const alienTypes: AlienType[] = [
  { color: "#ff4dd8", points: 30, hp: 1, glow: "rgba(255, 77, 216, 0.8)" },
  { color: "#5fe8ff", points: 20, hp: 1, glow: "rgba(95, 232, 255, 0.8)" },
  { color: "#9bff5f", points: 10, hp: 1, glow: "rgba(155, 255, 95, 0.8)" },
  { color: "#ffe95f", points: 15, hp: 1, glow: "rgba(255, 233, 95, 0.8)" }
];

const input: InputState = {
  left: false,
  right: false,
  fire: false,
  overcharge: false,
  pause: false
};

const player: Player = {
  pos: { x: WORLD.width / 2, y: WORLD.floor },
  width: 34,
  height: 18,
  speed: 220,
  cooldown: 0,
  lives: 3,
  overcharge: 0
};

const bullets: Bullet[] = [];
const aliens: { pos: Vec2; type: AlienType; alive: boolean; row: number; col: number }[] = [];
const explosions: Explosion[] = [];
const stars: Star[] = [];
const shields: ShieldCell[] = [];
const ufo: UFO = {
  pos: { x: -80, y: 60 },
  speed: 90,
  active: false,
  direction: 1,
  hp: 3
};

const state: GameState = {
  score: 0,
  wave: 1,
  running: false,
  paused: false,
  gameOver: false,
  lastFrame: performance.now(),
  nextAlienShot: 0,
  nextUfo: 10,
  formationDir: 1,
  formationSpeed: 22,
  formationDrop: 24,
  formationTick: 0,
  animStep: false
};

const audio = new AudioContext();

const playTone = (freq: number, duration = 0.08, type: OscillatorType = "square") => {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0.08;
  osc.connect(gain).connect(audio.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.stop(audio.currentTime + duration);
};

const spawnStars = () => {
  stars.length = 0;
  for (let i = 0; i < 120; i += 1) {
    stars.push({
      x: Math.random() * WORLD.width,
      y: Math.random() * WORLD.height,
      speed: 10 + Math.random() * 40,
      size: Math.random() * 1.5 + 0.4,
      hue: 180 + Math.random() * 120
    });
  }
};

const buildShields = () => {
  shields.length = 0;
  const shieldWidth = 52;
  const shieldHeight = 20;
  const padding = 24;
  const baseY = WORLD.floor - 70;
  const columns = 4;
  for (let i = 0; i < columns; i += 1) {
    const startX = 40 + i * (shieldWidth + padding);
    for (let y = 0; y < shieldHeight; y += 4) {
      for (let x = 0; x < shieldWidth; x += 4) {
        if (y < 6 && (x < 8 || x > shieldWidth - 12)) {
          continue;
        }
        shields.push({ x: startX + x, y: baseY + y, hp: 1 });
      }
    }
  }
};

const spawnWave = () => {
  aliens.length = 0;
  const rows = 5;
  const cols = 11;
  const offsetX = 40;
  const offsetY = 90;
  const spacingX = 34;
  const spacingY = 28;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const type = alienTypes[row % alienTypes.length];
      aliens.push({
        pos: { x: offsetX + col * spacingX, y: offsetY + row * spacingY },
        type,
        alive: true,
        row,
        col
      });
    }
  }
  state.formationDir = 1;
  state.formationSpeed = 22 + state.wave * 2;
  state.nextAlienShot = 1.2;
  state.nextUfo = 8 + Math.random() * 10;
  state.formationTick = 0;
  state.animStep = false;
};

const resetGame = () => {
  state.score = 0;
  state.wave = 1;
  state.running = true;
  state.paused = false;
  state.gameOver = false;
  player.lives = 3;
  player.pos.x = WORLD.width / 2;
  player.cooldown = 0;
  player.overcharge = 1;
  bullets.length = 0;
  explosions.length = 0;
  ufo.active = false;
  ufo.pos.x = -80;
  spawnWave();
  buildShields();
};

const nextWave = () => {
  state.wave += 1;
  spawnWave();
  buildShields();
  player.overcharge = Math.min(1, player.overcharge + 0.2);
};

const drawText = (text: string, x: number, y: number, color: string, size = 12) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${size}px "Press Start 2P", monospace`;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
  ctx.restore();
};

const fireBullet = (pos: Vec2, vel: Vec2, friendly: boolean, color: string) => {
  bullets.push({ pos: { ...pos }, vel: { ...vel }, friendly, radius: friendly ? 3 : 4, color });
};

const firePlayer = () => {
  if (player.cooldown > 0) return;
  const basePos = { x: player.pos.x, y: player.pos.y - player.height };
  if (input.overcharge && player.overcharge > 0.4) {
    fireBullet(basePos, { x: 0, y: -360 }, true, "#ffe95f");
    fireBullet(basePos, { x: -90, y: -320 }, true, "#5fe8ff");
    fireBullet(basePos, { x: 90, y: -320 }, true, "#ff4dd8");
    player.overcharge -= 0.4;
    player.cooldown = 0.26;
    playTone(520, 0.12, "sawtooth");
  } else {
    fireBullet(basePos, { x: 0, y: -320 }, true, "#9bff5f");
    player.cooldown = 0.18;
    playTone(420, 0.08, "square");
  }
};

const fireAlien = (origin: Vec2) => {
  fireBullet({ x: origin.x, y: origin.y + 12 }, { x: 0, y: 180 }, false, "#ff8f5f");
  playTone(180, 0.06, "triangle");
};

const spawnUfo = () => {
  ufo.active = true;
  ufo.direction = Math.random() > 0.5 ? 1 : -1;
  ufo.pos.x = ufo.direction === 1 ? -60 : WORLD.width + 60;
  ufo.pos.y = 50;
  ufo.hp = 3;
  playTone(220, 0.2, "square");
};

const updateStars = (dt: number) => {
  stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > WORLD.height) {
      star.y = -5;
      star.x = Math.random() * WORLD.width;
    }
  });
};

const updatePlayer = (dt: number) => {
  if (input.left) {
    player.pos.x -= player.speed * dt;
  }
  if (input.right) {
    player.pos.x += player.speed * dt;
  }
  player.pos.x = Math.max(20, Math.min(WORLD.width - 20, player.pos.x));
  if (input.fire) {
    firePlayer();
  }
  if (player.cooldown > 0) {
    player.cooldown -= dt;
  }
  player.overcharge = Math.min(1, player.overcharge + dt * 0.08);
};

const updateBullets = (dt: number) => {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const bullet = bullets[i];
    bullet.pos.x += bullet.vel.x * dt;
    bullet.pos.y += bullet.vel.y * dt;
    if (bullet.pos.y < -20 || bullet.pos.y > WORLD.height + 20) {
      bullets.splice(i, 1);
    }
  }
};

const alienBounds = () => {
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;
  aliens.forEach((alien) => {
    if (!alien.alive) return;
    minX = Math.min(minX, alien.pos.x);
    maxX = Math.max(maxX, alien.pos.x);
    maxY = Math.max(maxY, alien.pos.y);
  });
  if (!Number.isFinite(minX)) {
    return { minX: 0, maxX: 0, maxY: 0 };
  }
  return { minX, maxX, maxY };
};

const updateAliens = (dt: number) => {
  const aliveAliens = aliens.filter((alien) => alien.alive);
  if (aliveAliens.length === 0) {
    nextWave();
    return;
  }

  const speedBoost = 1 + (1 - aliveAliens.length / aliens.length) * 1.8;
  const moveX = state.formationSpeed * speedBoost * state.formationDir * dt;
  aliveAliens.forEach((alien) => {
    alien.pos.x += moveX;
  });

  const bounds = alienBounds();
  if (bounds.minX < 24 && state.formationDir === -1) {
    state.formationDir = 1;
    aliveAliens.forEach((alien) => {
      alien.pos.y += state.formationDrop;
    });
  }
  if (bounds.maxX > WORLD.width - 24 && state.formationDir === 1) {
    state.formationDir = -1;
    aliveAliens.forEach((alien) => {
      alien.pos.y += state.formationDrop;
    });
  }

  if (bounds.maxY > WORLD.floor - 30) {
    state.gameOver = true;
  }

  state.nextAlienShot -= dt;
  if (state.nextAlienShot <= 0) {
    const shooters: { [key: number]: { pos: Vec2; row: number } } = {};
    aliveAliens.forEach((alien) => {
      const current = shooters[alien.col];
      if (!current || alien.row > current.row) {
        shooters[alien.col] = { pos: alien.pos, row: alien.row };
      }
    });
    const columns = Object.values(shooters);
    const shooter = columns[Math.floor(Math.random() * columns.length)];
    if (shooter) {
      fireAlien(shooter.pos);
    }
    state.nextAlienShot = Math.max(0.4, 1.2 - state.wave * 0.08);
  }

  state.formationTick -= dt;
  if (state.formationTick <= 0) {
    state.animStep = !state.animStep;
    playTone(240 + state.wave * 6, 0.05, "square");
    state.formationTick = Math.max(0.18, 0.6 - state.wave * 0.04);
  }
};

const updateUfo = (dt: number) => {
  state.nextUfo -= dt;
  if (!ufo.active && state.nextUfo <= 0) {
    spawnUfo();
    state.nextUfo = 10 + Math.random() * 12;
  }
  if (ufo.active) {
    ufo.pos.x += ufo.speed * dt * ufo.direction;
    if (ufo.pos.x < -100 || ufo.pos.x > WORLD.width + 100) {
      ufo.active = false;
    }
  }
};

const updateExplosions = (dt: number) => {
  for (let i = explosions.length - 1; i >= 0; i -= 1) {
    explosions[i].life -= dt;
    if (explosions[i].life <= 0) {
      explosions.splice(i, 1);
    }
  }
};

const collideBullet = (bullet: Bullet) => {
  if (bullet.friendly) {
    for (const alien of aliens) {
      if (!alien.alive) continue;
      const dx = bullet.pos.x - alien.pos.x;
      const dy = bullet.pos.y - alien.pos.y;
      if (Math.abs(dx) < 14 && Math.abs(dy) < 10) {
        alien.alive = false;
        state.score += alien.type.points;
        explosions.push({ x: alien.pos.x, y: alien.pos.y, life: 0.7, color: alien.type.color });
        playTone(320, 0.08, "triangle");
        return true;
      }
    }
    if (ufo.active) {
      const dx = bullet.pos.x - ufo.pos.x;
      const dy = bullet.pos.y - ufo.pos.y;
      if (Math.abs(dx) < 26 && Math.abs(dy) < 10) {
        ufo.hp -= 1;
        state.score += 100;
        explosions.push({ x: ufo.pos.x, y: ufo.pos.y, life: 1.0, color: "#ffe95f" });
        playTone(500, 0.1, "sawtooth");
        if (ufo.hp <= 0) {
          state.score += 250;
          ufo.active = false;
          playTone(120, 0.2, "square");
        }
        return true;
      }
    }
  } else {
    const dx = bullet.pos.x - player.pos.x;
    const dy = bullet.pos.y - player.pos.y;
    if (Math.abs(dx) < player.width / 2 && Math.abs(dy) < player.height / 2) {
      playerHit();
      return true;
    }
  }

  for (const shield of shields) {
    if (shield.hp <= 0) continue;
    if (Math.abs(bullet.pos.x - shield.x) < 3 && Math.abs(bullet.pos.y - shield.y) < 3) {
      shield.hp -= 1;
      explosions.push({ x: shield.x, y: shield.y, life: 0.4, color: "#ff8f5f" });
      return true;
    }
  }

  return false;
};

const playerHit = () => {
  player.lives -= 1;
  player.pos.x = WORLD.width / 2;
  player.cooldown = 0.5;
  player.overcharge = Math.max(0.1, player.overcharge - 0.4);
  explosions.push({ x: player.pos.x, y: player.pos.y, life: 1.2, color: "#ff4dd8" });
  playTone(100, 0.2, "sawtooth");
  if (player.lives <= 0) {
    state.gameOver = true;
  }
};

const handleCollisions = () => {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const bullet = bullets[i];
    if (collideBullet(bullet)) {
      bullets.splice(i, 1);
    }
  }
};

const drawStars = () => {
  stars.forEach((star) => {
    ctx.fillStyle = `hsl(${star.hue} 100% 75% / 0.9)`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
};

const drawPlayer = () => {
  ctx.save();
  ctx.translate(player.pos.x, player.pos.y);
  ctx.fillStyle = "#9bff5f";
  ctx.shadowColor = "rgba(155, 255, 95, 0.8)";
  ctx.shadowBlur = 18;
  const pixel = 3;
  ctx.fillRect(-pixel * 5, -pixel * 2, pixel * 10, pixel * 2);
  ctx.fillRect(-pixel * 4, -pixel * 4, pixel * 8, pixel * 2);
  ctx.fillRect(-pixel * 3, -pixel * 6, pixel * 6, pixel * 2);
  ctx.fillRect(-pixel * 2, -pixel * 8, pixel * 4, pixel * 2);
  ctx.fillRect(-pixel, -pixel * 10, pixel * 2, pixel * 2);
  ctx.restore();

  const barWidth = 60;
  const fillWidth = barWidth * player.overcharge;
  ctx.fillStyle = "rgba(95, 232, 255, 0.35)";
  ctx.fillRect(player.pos.x - barWidth / 2, player.pos.y + 18, barWidth, 6);
  ctx.fillStyle = "rgba(95, 232, 255, 0.95)";
  ctx.fillRect(player.pos.x - barWidth / 2, player.pos.y + 18, fillWidth, 6);
};

const alienSprites = [
  {
    a: ["..XX..", ".XXXX.", "XXXXXX", "X.XX.X", "X....X", "..XX.."],
    b: ["..XX..", ".XXXX.", "XXXXXX", "X.XX.X", "..XX..", ".X..X."]
  },
  {
    a: [".X..X.", "..XX..", ".XXXX.", "XX..XX", "XXXXXX", "X....X"],
    b: [".X..X.", "XX..XX", ".XXXX.", "XX..XX", "XXXXXX", ".X..X."]
  },
  {
    a: [".X..X.", "X.XX.X", "XXXXXX", "XX..XX", "X.XX.X", ".X..X."],
    b: ["X....X", ".X..X.", "XXXXXX", "XX..XX", "X.XX.X", ".X..X."]
  },
  {
    a: [".XXXX.", "XXXXXX", "X.XX.X", "XXXXXX", "X....X", ".X..X."],
    b: [".XXXX.", "XXXXXX", "X.XX.X", "XXXXXX", ".X..X.", "X....X"]
  },
  {
    a: [".XXXX.", "XX..XX", "XXXXXX", "X.XX.X", "XX..XX", ".X..X."],
    b: [".XXXX.", "XX..XX", "XXXXXX", ".X..X.", "X.XX.X", "X....X"]
  }
];

const drawSprite = (pattern: string[], pixel: number) => {
  const height = pattern.length;
  const width = Math.max(...pattern.map((row) => row.length));
  const originX = -((width * pixel) / 2);
  const originY = -((height * pixel) / 2);
  pattern.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "X") {
        ctx.fillRect(originX + x * pixel, originY + y * pixel, pixel, pixel);
      }
    });
  });
};

const ufoSprites = {
  a: ["..XXXX..", ".XXXXXX.", "XX.XX.XX", "XXXXXXXX", ".XX..XX."],
  b: ["..XXXX..", "XXXXXXXX", "XX.XX.XX", "XXXXXXXX", "..XX..XX"]
};

const drawAlienFrame = (row: number, step: boolean) => {
  const pixel = 3;
  const sprite = alienSprites[row % alienSprites.length];
  drawSprite(step ? sprite.b : sprite.a, pixel);
};

const drawAliens = () => {
  aliens.forEach((alien) => {
    if (!alien.alive) return;
    ctx.save();
    ctx.translate(alien.pos.x, alien.pos.y);
    ctx.fillStyle = alien.type.color;
    ctx.shadowColor = alien.type.glow;
    ctx.shadowBlur = 16;
    drawAlienFrame(alien.row, state.animStep);
    ctx.restore();
  });
};

const drawShields = () => {
  shields.forEach((shield) => {
    if (shield.hp <= 0) return;
    ctx.fillStyle = shield.hp >= 1 ? "#5fe8ff" : "#ff8f5f";
    ctx.fillRect(shield.x, shield.y, 4, 4);
  });
};

const drawBullets = () => {
  bullets.forEach((bullet) => {
    ctx.save();
    ctx.fillStyle = bullet.color;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
};

const drawExplosions = () => {
  explosions.forEach((spark) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, spark.life / 1.2);
    ctx.fillStyle = spark.color;
    ctx.shadowColor = spark.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, 18 * spark.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
};

const drawUfo = () => {
  if (!ufo.active) return;
  ctx.save();
  ctx.translate(ufo.pos.x, ufo.pos.y);
  ctx.fillStyle = "#ffe95f";
  ctx.shadowColor = "rgba(255, 233, 95, 0.85)";
  ctx.shadowBlur = 20;
  drawSprite(state.animStep ? ufoSprites.b : ufoSprites.a, 3);
  ctx.restore();
};

const drawOverlay = () => {
  if (!state.running || state.paused || state.gameOver) {
    ctx.save();
    ctx.fillStyle = "rgba(4, 4, 12, 0.65)";
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    ctx.restore();
  }
  if (!state.running) {
    drawText("PRESS SPACE", WORLD.width / 2, WORLD.height / 2 - 20, "#5fe8ff", 16);
    drawText("TO START", WORLD.width / 2, WORLD.height / 2 + 10, "#ff4dd8", 12);
  }
  if (state.paused) {
    drawText("PAUSED", WORLD.width / 2, WORLD.height / 2, "#ffe95f", 14);
  }
  if (state.gameOver) {
    drawText("GAME OVER", WORLD.width / 2, WORLD.height / 2 - 10, "#ff4dd8", 14);
    drawText("PRESS R", WORLD.width / 2, WORLD.height / 2 + 18, "#5fe8ff", 10);
  }
};

const updateHud = () => {
  scoreEl.textContent = state.score.toString().padStart(6, "0");
  waveEl.textContent = state.wave.toString().padStart(2, "0");
  livesEl.textContent = player.lives.toString().padStart(2, "0");
};

const tick = (time: number) => {
  const dt = Math.min(0.033, (time - state.lastFrame) / 1000);
  state.lastFrame = time;

  if (!state.paused) {
    updateStars(dt);
    if (state.running && !state.gameOver) {
      updatePlayer(dt);
      updateBullets(dt);
      updateAliens(dt);
      updateUfo(dt);
      updateExplosions(dt);
      handleCollisions();
    }
  }

  ctx.clearRect(0, 0, WORLD.width, WORLD.height);
  drawStars();
  drawShields();
  drawUfo();
  drawAliens();
  drawPlayer();
  drawBullets();
  drawExplosions();
  drawOverlay();
  updateHud();

  requestAnimationFrame(tick);
};

const startGame = () => {
  if (!state.running) {
    resetGame();
    state.running = true;
  }
};

const setupInput = () => {
  window.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" || event.code === "KeyA") input.left = true;
    if (event.code === "ArrowRight" || event.code === "KeyD") input.right = true;
    if (event.code === "Space") input.fire = true;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") input.overcharge = true;
    if (event.code === "KeyP") {
      if (state.running && !state.gameOver) state.paused = !state.paused;
    }
    if (event.code === "KeyR" && state.gameOver) {
      resetGame();
    }

    if (event.code === "Space" && !state.running) {
      startGame();
    }

    if (audio.state === "suspended") {
      audio.resume();
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft" || event.code === "KeyA") input.left = false;
    if (event.code === "ArrowRight" || event.code === "KeyD") input.right = false;
    if (event.code === "Space") input.fire = false;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") input.overcharge = false;
  });
};

const init = () => {
  spawnStars();
  buildShields();
  setupInput();
  updateHud();
  editionEl.textContent = `rock808 EDITION // v${pkg.version}`;
  requestAnimationFrame(tick);
};

init();
