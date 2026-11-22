// Museum guards: patrol waypoints, sweeping vision cones, investigation
// when a thrown coin clinks nearby, and the shared cone test that decides
// whether a guard can actually see the thief right now.
import {
  GUARD_FOV,
  GUARD_RANGE,
  GUARD_SPEED,
  INVESTIGATE_SECONDS,
  SHADOW_RANGE_FACTOR,
} from './config.js';
import { pointInShadow, segmentBlocked } from './level.js';

export function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function canSee(viewer, tx, ty, level, range, fov) {
  const dx = tx - viewer.x;
  const dy = ty - viewer.y;
  const dist = Math.hypot(dx, dy);
  if (dist > range) return false;
  if (dist > 4 && Math.abs(angleDiff(Math.atan2(dy, dx), viewer.angle)) > fov / 2) return false;
  if (segmentBlocked(viewer.x, viewer.y, tx, ty, level)) return false;
  return true;
}

export class Guard {
  constructor(waypoints) {
    this.waypoints = waypoints;
    this.x = waypoints[0].x;
    this.y = waypoints[0].y;
    this.target = 1;
    this.angle = 0;
    this.wait = 0;
    this.investigating = false;
    this.investigateX = 0;
    this.investigateY = 0;
    this.investigateTimer = 0;
    this.seesPlayer = false;
    this.sweepPhase = 0;
  }

  update(dt, level, player) {
    if (this.investigating) {
      this.moveToward(this.investigateX, this.investigateY, dt, level);
      const arrived = Math.hypot(this.investigateX - this.x, this.investigateY - this.y) < 10;
      if (arrived) {
        this.investigateTimer -= dt;
        this.angle += dt * 1.6;
        if (this.investigateTimer <= 0) {
          this.investigating = false;
        }
      }
    } else if (this.wait > 0) {
      this.wait -= dt;
      this.angle += Math.sin(this.sweepPhase) * dt * 0.9;
      this.sweepPhase += dt * 2.2;
    } else {
      const goal = this.waypoints[this.target];
      const beforeX = this.x;
      const beforeY = this.y;
      this.moveToward(goal.x, goal.y, dt, level);
      if (Math.hypot(this.x - beforeX, this.y - beforeY) > 0.01) {
        this.angle = Math.atan2(this.y - beforeY, this.x - beforeX);
      }
      if (Math.hypot(goal.x - this.x, goal.y - this.y) < 8) {
        this.target = (this.target + 1) % this.waypoints.length;
        this.wait = 1.4;
      }
    }
    const hidden = pointInShadow(player.x, player.y, level);
    const range = hidden ? GUARD_RANGE * SHADOW_RANGE_FACTOR : GUARD_RANGE;
    this.seesPlayer = !player.inSmoke && canSee(this, player.x, player.y, level, range, GUARD_FOV);
    return this.seesPlayer;
  }

  moveToward(tx, ty, dt, level) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;
    const step = Math.min(dist, GUARD_SPEED * dt);
    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
    this.angle = Math.atan2(dy, dx);
  }

  distract(x, y) {
    this.investigating = true;
    this.investigateX = x;
    this.investigateY = y;
    this.investigateTimer = INVESTIGATE_SECONDS;
    this.wait = 0;
  }
}

export function buildGuards() {
  return [
    new Guard([
      { x: 300, y: 108 },
      { x: 980, y: 108 },
      { x: 980, y: 216 },
      { x: 300, y: 216 },
    ]),
    new Guard([
      { x: 200, y: 360 },
      { x: 1080, y: 360 },
      { x: 1080, y: 300 },
      { x: 200, y: 300 },
    ]),
    new Guard([
      { x: 980, y: 600 },
      { x: 300, y: 600 },
      { x: 300, y: 520 },
      { x: 980, y: 520 },
    ]),
  ];
}
