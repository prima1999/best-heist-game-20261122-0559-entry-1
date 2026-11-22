// Wall-mounted security cameras: each sweeps its cone back and forth on a
// fixed arc, and an EMP blast switches them off for a few seconds while
// their lenses stay dark and their cones vanish from the floor.
import {
  CAMERA_FOV,
  CAMERA_RANGE,
} from './config.js';
import { canSee } from './guards.js';

export class Camera {
  constructor(x, y, baseAngle, sweep, speed, phase) {
    this.x = x;
    this.y = y;
    this.baseAngle = baseAngle;
    this.sweep = sweep;
    this.speed = speed;
    this.phase = phase;
    this.angle = baseAngle;
    this.disabledTimer = 0;
    this.seesPlayer = false;
  }

  update(dt, level, player) {
    if (this.disabledTimer > 0) {
      this.disabledTimer -= dt;
      this.seesPlayer = false;
      return false;
    }
    this.phase += dt * this.speed;
    this.angle = this.baseAngle + Math.sin(this.phase) * this.sweep;
    const smokeHides = player.inSmoke;
    this.seesPlayer = !smokeHides && canSee(this, player.x, player.y, level, CAMERA_RANGE, CAMERA_FOV);
    return this.seesPlayer;
  }

  disable(seconds) {
    this.disabledTimer = Math.max(this.disabledTimer, seconds);
  }

  get disabled() {
    return this.disabledTimer > 0;
  }
}

export function buildCameras() {
  return [
    new Camera(640, 30, Math.PI / 2, 0.85, 0.55, 0),
    new Camera(1250, 360, Math.PI, 0.7, 0.45, 2.1),
  ];
}
