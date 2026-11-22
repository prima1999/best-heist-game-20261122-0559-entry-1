// Fixed screenshot states for The Gilded Vault: ?shot=start shows the
// heist just begun, ?shot=mid shows the thief deep in the hall with a cone
// sweeping close and the alarm half raised, ?shot=caught shows the alarm
// at 100 with a guard on top of the thief, and ?shot=win shows the clean
// getaway at the exit. Each is a real game state, never a still image.
import { ENTRY } from './level.js';

export function applyShot(game, name) {
  if (name === 'start') {
    game.startGame();
    game.alarm = 12;
    game.player.x = 150;
    game.player.y = 600;
    return;
  }
  if (name === 'mid') {
    game.startGame();
    game.alarm = 40;
    game.player.x = 860;
    game.player.y = 190;
    game.player.facing = Math.PI / 4;
    game.guards[0].x = 620;
    game.guards[0].y = 216;
    game.guards[0].angle = Math.PI;
    game.guards[0].wait = 3;
    game.guards[1].x = 980;
    game.guards[1].y = 300;
    game.guards[1].angle = Math.PI;
    game.guards[2].x = 520;
    game.guards[2].y = 560;
    game.guards[2].angle = -Math.PI / 2;
    game.time = 47;
    return;
  }
  if (name === 'caught') {
    game.startGame();
    game.alarm = 100;
    game.player.x = 640;
    game.player.y = 360;
    game.guards[1].x = 664;
    game.guards[1].y = 360;
    game.guards[1].angle = Math.PI;
    game.guards[1].seesPlayer = true;
    game.screen = 'caught';
    game.time = 83;
    return;
  }
  if (name === 'win') {
    game.startGame();
    game.player.hasLoot = true;
    game.level.lootTaken = true;
    game.player.x = 1185;
    game.player.y = 655;
    game.player.coins = 7;
    game.screen = 'won';
    game.time = 96;
    game.alarm = 34;
    return;
  }
  if (name === 'title') {
    game.screen = 'title';
  }
}

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}

export function entryPoint() {
  return ENTRY;
}
