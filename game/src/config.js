// Shared tuning for The Gilded Vault: one place for every number the
// other modules read, so balance changes never need a hunt through code.
export const VIEW_W = 1280;
export const VIEW_H = 720;
export const HUD_H = 52;
export const WALL = 24;
export const PLAYER_R = 14;
export const PLAYER_SPEED = 178;
export const GUARD_SPEED = 56;
export const GUARD_RANGE = 252;
export const GUARD_FOV = 1.14;
export const CAMERA_RANGE = 318;
export const CAMERA_FOV = 0.92;
export const ALARM_GUARD_RATE = 34;
export const ALARM_CAMERA_RATE = 24;
export const ALARM_DECAY_RATE = 12;
export const ALARM_MAX = 100;
export const SHADOW_RANGE_FACTOR = 0.55;
export const SMOKE_SECONDS = 6;
export const EMP_SECONDS = 12;
export const INVESTIGATE_SECONDS = 4;
export const COST_COIN_TOSS = 1;
export const COST_SMOKE = 2;
export const COST_EMP = 4;
export const GRAB_RANGE = 85;
export const COLORS = {
  floor: '#1b2334',
  floorTile: '#212b41',
  wall: '#3a2f22',
  wallTop: '#5a4630',
  caseGlass: '#7fb2d9',
  caseGold: '#c9a227',
  shadow: '#0d1526',
  coneGuard: 'rgba(255, 196, 66, 0.20)',
  coneGuardHot: 'rgba(255, 64, 64, 0.30)',
  coneCamera: 'rgba(255, 90, 90, 0.16)',
  coneCameraHot: 'rgba(255, 64, 64, 0.28)',
  player: '#e8e6df',
  playerHood: '#2b3a55',
  guard: '#31435f',
  guardVest: '#d8b13c',
  camera: '#8a94a6',
  diamond: '#9fe8ff',
  gold: '#f2c14e',
  exit: '#37d67a',
  alarm: '#ff5252',
  alarmSafe: '#37d67a',
  text: '#f2ead8',
  dim: '#9aa7bd',
};
