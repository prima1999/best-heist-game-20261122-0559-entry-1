// The Gilded Vault: game loop and state machine.
// Title, playing, won and caught screens; the alarm meter that rises while
// any guard or camera sees the thief and falls while hidden; the loot grab
// that unlocks the exit; and the tools the thief buys with stolen coins.
import {
  ALARM_CAMERA_RATE,
  ALARM_DECAY_RATE,
  ALARM_GUARD_RATE,
  ALARM_MAX,
  VIEW_H,
  VIEW_W,
} from './config.js';
import { Input } from './input.js';
import { ENTRY, buildLevel } from './level.js';
import { buildGuards } from './guards.js';
import { buildCameras } from './cameras.js';
import { Player } from './player.js';
import { Renderer } from './render.js';
import { Sound } from './audio.js';
import { applyShot, shotFromUrl } from './shots.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.input = new Input(canvas);
    this.renderer = new Renderer(canvas);
    this.sound = new Sound();
    this.screen = 'title';
    this.time = 0;
    this.alarm = 0;
    this.seenNow = false;
    this.seenBefore = false;
    this.coinsBefore = 4;
    this.reset();
    this.renderer.resize();
    window.addEventListener('resize', () => this.renderer.resize());
  }

  reset() {
    this.level = buildLevel();
    this.guards = buildGuards();
    this.cameras = buildCameras();
    this.player = new Player(ENTRY.x, ENTRY.y);
    this.time = 0;
    this.alarm = 0;
    this.seenNow = false;
    this.seenBefore = false;
    this.coinsBefore = this.player.coins;
    this.sound.stopAlarm();
  }

  startGame() {
    this.reset();
    this.screen = 'playing';
  }

  update(dt) {
    if (this.screen === 'title') {
      if (this.input.wasPressed('enter') || this.input.wasPressed(' ')) {
        this.sound.ensure();
        this.startGame();
      }
      return;
    }
    if (this.screen === 'won' || this.screen === 'caught') {
      if (this.input.wasPressed('r') || this.input.wasPressed('enter')) {
        this.startGame();
      }
      return;
    }
    this.time += dt;
    if (this.input.anyKey || this.input.mouseDown) {
      this.sound.ensure();
    }
    if (this.input.wasPressed('m')) {
      this.sound.muted = !this.sound.muted;
    }
    const axis = this.input.axis();
    this.player.move(axis, dt, this.level);
    this.player.update(dt, this.level);
    if (this.player.coins > this.coinsBefore) {
      this.sound.coin();
    }
    this.coinsBefore = this.player.coins;
    if (this.input.wasPressed('e') && this.player.grabLoot()) {
      this.level.lootTaken = true;
      this.sound.grab();
    }
    if (this.input.wasPressed('1') || this.input.wasPressed('click')) {
      if (this.player.tossCoin(this.input.mouseX, this.input.mouseY, this.guards)) {
        this.sound.tool();
      }
    }
    if (this.input.wasPressed('2') && this.player.useSmoke()) {
      this.sound.tool();
    }
    if (this.input.wasPressed('3') && this.player.useEmp(this.cameras)) {
      this.sound.tool();
    }
    let seen = false;
    let guardSeen = false;
    for (const guard of this.guards) {
      if (guard.update(dt, this.level, this.player)) guardSeen = true;
    }
    let cameraSeen = false;
    for (const camera of this.cameras) {
      if (camera.update(dt, this.level, this.player)) cameraSeen = true;
    }
    seen = guardSeen || cameraSeen;
    if (guardSeen) this.alarm += ALARM_GUARD_RATE * dt;
    if (cameraSeen) this.alarm += ALARM_CAMERA_RATE * dt;
    if (!seen) this.alarm -= ALARM_DECAY_RATE * dt;
    this.alarm = Math.max(0, Math.min(ALARM_MAX, this.alarm));
    this.seenNow = seen;
    if (seen && !this.seenBefore) this.sound.startAlarm();
    if (!seen && this.seenBefore) this.sound.stopAlarm();
    this.seenBefore = seen;
    for (const guard of this.guards) {
      if (Math.hypot(guard.x - this.player.x, guard.y - this.player.y) < 26) {
        this.alarm = ALARM_MAX;
      }
    }
    if (this.alarm >= ALARM_MAX) {
      this.screen = 'caught';
      this.sound.stopAlarm();
      this.sound.caught();
      return;
    }
    if (this.player.atExit()) {
      this.screen = 'won';
      this.sound.stopAlarm();
      this.sound.win();
    }
  }

  frame(now) {
    const elapsed = (now - (this.lastNow || now)) / 1000;
    const dt = Math.min(0.05, elapsed || 0.016);
    this.lastNow = now;
    this.update(dt);
    this.renderer.draw(this);
    this.input.endFrame();
  }

  run() {
    const loop = (now) => {
      this.frame(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

const canvas = document.getElementById('game');
const game = new Game(canvas);
const shot = shotFromUrl();
if (shot) {
  applyShot(game, shot);
} else {
  game.screen = 'title';
}
window.__heist = game;
game.run();
