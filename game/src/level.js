// The museum floor of The Gilded Vault: walls, display cases that block
// sight and movement, dark shadow galleries that hide the thief, the vault
// pedestal holding the Gilded Diamond, the entry door, the exit door, and
// the gold coins scattered along the three routes through the hall.
import { VIEW_H, VIEW_W, WALL } from './config.js';

export const ENTRY = { x: 88, y: 648 };
export const EXIT = { x: 1130, y: 624, w: 110, h: 62 };
export const VAULT = { x: 1062, y: 72, w: 150, h: 104 };
export const DIAMOND = { x: 1137, y: 124 };

export const SOLIDS = [
  { x: 0, y: 0, w: VIEW_W, h: WALL },
  { x: 0, y: VIEW_H - WALL, w: VIEW_W, h: WALL },
  { x: 0, y: 0, w: WALL, h: VIEW_H },
  { x: VIEW_W - WALL, y: 0, w: WALL, h: VIEW_H },
  { x: 180, y: 140, w: 180, h: 58 },
  { x: 560, y: 118, w: 200, h: 58 },
  { x: 920, y: 140, w: 118, h: 58 },
  { x: 180, y: 420, w: 180, h: 58 },
  { x: 560, y: 462, w: 200, h: 58 },
  { x: 920, y: 420, w: 118, h: 58 },
  { x: 420, y: 300, w: 42, h: 42 },
  { x: 818, y: 300, w: 42, h: 42 },
  { x: VAULT.x, y: VAULT.y, w: VAULT.w, h: VAULT.h },
];

export const SHADOWS = [
  { x: 300, y: 250, w: 220, h: 92 },
  { x: 760, y: 250, w: 220, h: 92 },
  { x: 60, y: 250, w: 120, h: 92 },
];

export const COIN_SPOTS = [
  { x: 260, y: 320 },
  { x: 420, y: 200 },
  { x: 640, y: 320 },
  { x: 860, y: 200 },
  { x: 1040, y: 320 },
  { x: 260, y: 560 },
  { x: 470, y: 620 },
  { x: 700, y: 560 },
  { x: 900, y: 620 },
  { x: 1080, y: 520 },
  { x: 120, y: 460 },
  { x: 1180, y: 260 },
];

// A fresh level state: coins start untaken and the vault starts full, so
// every run and every restart begins from the same board.
export function buildLevel() {
  return {
    solids: SOLIDS,
    shadows: SHADOWS,
    coins: COIN_SPOTS.map((spot) => ({ x: spot.x, y: spot.y, taken: false })),
    lootTaken: false,
    lootTakenAt: 0,
  };
}

export function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

export function pointInShadow(x, y, level) {
  return level.shadows.some((zone) => pointInRect(x, y, zone));
}

// True when a solid rectangle blocks the straight line from (x0, y0) to
// (x1, y1): sampled finely enough that no case or pillar can be skipped.
export function segmentBlocked(x0, y0, x1, y1, level) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(dist / 10));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const px = x0 + dx * t;
    const py = y0 + dy * t;
    for (const solid of level.solids) {
      if (pointInRect(px, py, solid)) return true;
    }
  }
  return false;
}

// Push a circle out of every solid it overlaps, so the thief slides along
// cases and walls instead of sticking to their corners.
export function collideCircle(pos, radius, level) {
  for (const solid of level.solids) {
    const nearestX = Math.max(solid.x, Math.min(pos.x, solid.x + solid.w));
    const nearestY = Math.max(solid.y, Math.min(pos.y, solid.y + solid.h));
    const dx = pos.x - nearestX;
    const dy = pos.y - nearestY;
    const distSq = dx * dx + dy * dy;
    if (distSq >= radius * radius) continue;
    if (distSq === 0) {
      pos.y = solid.y - radius;
      continue;
    }
    const dist = Math.sqrt(distSq);
    const push = (radius - dist) / dist;
    pos.x += dx * push;
    pos.y += dy * push;
  }
  pos.x = Math.max(WALL + radius, Math.min(VIEW_W - WALL - radius, pos.x));
  pos.y = Math.max(WALL + radius, Math.min(VIEW_H - WALL - radius, pos.y));
}
