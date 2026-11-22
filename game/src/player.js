// The thief: movement with wall collision, gold-coin pickups, the grab
// for the Gilded Diamond, the sprint to the exit, and the three paid tools:
// a tossed coin that lures a guard, a smoke pellet that hides the thief,
// and an EMP burst that blinds the cameras for a few seconds.
import {
  COST_COIN_TOSS,
  COST_EMP,
  COST_SMOKE,
  EMP_SECONDS,
  GRAB_RANGE,
  PLAYER_R,
  PLAYER_SPEED,
  SMOKE_SECONDS,
} from './config.js';
import { DIAMOND, EXIT, collideCircle, pointInRect } from './level.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = PLAYER_R;
    this.coins = 4;
    this.smokeTimer = 0;
    this.smokeX = 0;
    this.smokeY = 0;
    this.hasLoot = false;
    this.escaped = false;
    this.caught = false;
    this.facing = -Math.PI / 2;
  }

  get inSmoke() {
    if (this.smokeTimer <= 0) return false;
    const smokeDist = Math.hypot(this.x - this.smokeX, this.y - this.smokeY);
    return smokeDist < 72;
  }

  move(axis, dt, level) {
    if (axis.x === 0 && axis.y === 0) return;
    this.facing = Math.atan2(axis.y, axis.x);
    this.x += axis.x * PLAYER_SPEED * dt;
    this.y += axis.y * PLAYER_SPEED * dt;
    collideCircle(this, this.radius, level);
  }

  update(dt, level) {
    if (this.smokeTimer > 0) this.smokeTimer -= dt;
    for (const coin of level.coins) {
      if (coin.taken) continue;
      const nearCoin = Math.hypot(coin.x - this.x, coin.y - this.y) < 30;
      if (nearCoin) {
        coin.taken = true;
        this.coins += 1;
      }
    }
  }

  nearDiamond() {
    return !this.hasLoot && Math.hypot(DIAMOND.x - this.x, DIAMOND.y - this.y) < GRAB_RANGE;
  }

  grabLoot() {
    if (!this.nearDiamond()) return false;
    this.hasLoot = true;
    return true;
  }

  atExit() {
    return this.hasLoot && pointInRect(this.x, this.y, EXIT);
  }

  tossCoin(targetX, targetY, guards) {
    if (this.coins < COST_COIN_TOSS) return false;
    let best = null;
    let bestDist = 420;
    for (const guard of guards) {
      const d = Math.hypot(guard.x - targetX, guard.y - targetY);
      if (d < bestDist) {
        bestDist = d;
        best = guard;
      }
    }
    if (!best) return false;
    this.coins -= COST_COIN_TOSS;
    best.distract(targetX, targetY);
    return true;
  }

  useSmoke() {
    if (this.coins < COST_SMOKE || this.smokeTimer > 0) return false;
    this.coins -= COST_SMOKE;
    this.smokeTimer = SMOKE_SECONDS;
    this.smokeX = this.x;
    this.smokeY = this.y;
    return true;
  }

  useEmp(cameras) {
    if (this.coins < COST_EMP) return false;
    if (cameras.every((camera) => camera.disabled)) return false;
    this.coins -= COST_EMP;
    for (const camera of cameras) camera.disable(EMP_SECONDS);
    return true;
  }
}
