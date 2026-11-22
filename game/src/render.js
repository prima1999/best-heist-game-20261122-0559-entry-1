// All drawing for The Gilded Vault: the museum floor, the vault and its
// diamond, the guards and their vision cones, the cameras and their arcs,
// the thief and the smoke, the HUD with the alarm meter, and the title,
// win and caught screens. Canvas 2D only, no images, no network.
import { COLORS, HUD_H, VIEW_H, VIEW_W } from './config.js';
import { DIAMOND, EXIT, VAULT } from './level.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = VIEW_W * dpr;
    this.canvas.height = VIEW_H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  drawCone(x, y, angle, range, fov, fill) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, range, angle - fov / 2, angle + fov / 2);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  drawRoom(level, state) {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = COLORS.floorTile;
    for (let gx = 0; gx < VIEW_W; gx += 64) {
      for (let gy = HUD_H; gy < VIEW_H; gy += 64) {
        if ((gx / 64 + gy / 64) % 2 === 0) ctx.fillRect(gx, gy, 62, 62);
      }
    }
    for (const zone of level.shadows) {
      ctx.fillStyle = COLORS.shadow;
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
      ctx.strokeStyle = 'rgba(120, 160, 220, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(160, 190, 240, 0.55)';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('SHADOW — HIDDEN HERE', zone.x + 14, zone.y + 22);
    }
    ctx.fillStyle = COLORS.wall;
    ctx.fillRect(0, 0, VIEW_W, 24);
    ctx.fillRect(0, VIEW_H - 24, VIEW_W, 24);
    ctx.fillRect(0, 0, 24, VIEW_H);
    ctx.fillRect(VIEW_W - 24, 0, 24, VIEW_H);
    ctx.fillStyle = COLORS.wallTop;
    ctx.fillRect(0, 0, VIEW_W, 5);
    for (const solid of level.solids) {
      if (solid.y === 0 || solid.y === VIEW_H - 24 || solid.x === 0 || solid.x === VIEW_W - 24) continue;
      ctx.fillStyle = '#2c3a55';
      ctx.fillRect(solid.x, solid.y, solid.w, solid.h);
      ctx.fillStyle = COLORS.caseGlass;
      ctx.fillRect(solid.x + 6, solid.y + 6, solid.w - 12, solid.h - 12);
      ctx.strokeStyle = COLORS.caseGold;
      ctx.lineWidth = 3;
      ctx.strokeRect(solid.x, solid.y, solid.w, solid.h);
    }
    this.drawVault(state);
    this.drawExit(state);
    for (const coin of level.coins) {
      if (coin.taken) continue;
      ctx.fillStyle = COLORS.gold;
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7a5a00';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('¢', coin.x, coin.y + 3);
      ctx.textAlign = 'left';
    }
  }

  drawVault(state) {
    const ctx = this.ctx;
    const taken = state.level.lootTaken;
    ctx.fillStyle = '#241f16';
    ctx.fillRect(VAULT.x, VAULT.y, VAULT.w, VAULT.h);
    ctx.strokeStyle = taken ? '#5a6a7a' : COLORS.caseGold;
    ctx.lineWidth = 4;
    ctx.strokeRect(VAULT.x, VAULT.y, VAULT.w, VAULT.h);
    if (!taken) {
      const pulse = 0.7 + 0.3 * Math.sin(state.time * 3);
      ctx.save();
      ctx.translate(DIAMOND.x, DIAMOND.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = COLORS.diamond;
      ctx.globalAlpha = pulse;
      ctx.fillRect(-13, -13, 26, 26);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-13, -13, 26, 26);
      ctx.restore();
      ctx.fillStyle = COLORS.diamond;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('THE GILDED DIAMOND', VAULT.x - 8, VAULT.y + VAULT.h + 18);
    } else {
      ctx.fillStyle = '#7a8aa0';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('VAULT EMPTY', VAULT.x + 28, VAULT.y + VAULT.h + 18);
    }
  }

  drawExit(state) {
    const ctx = this.ctx;
    const open = state.player.hasLoot;
    ctx.fillStyle = open ? COLORS.exit : '#3a4a3a';
    ctx.fillRect(EXIT.x, EXIT.y, EXIT.w, EXIT.h);
    ctx.strokeStyle = open ? '#b8ffcf' : '#5a6a5a';
    ctx.lineWidth = 3;
    ctx.strokeRect(EXIT.x, EXIT.y, EXIT.w, EXIT.h);
    ctx.fillStyle = open ? '#062b14' : '#9ab89a';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(open ? 'EXIT — GO!' : 'EXIT — LOCKED', EXIT.x + EXIT.w / 2, EXIT.y + EXIT.h / 2 + 6);
    ctx.textAlign = 'left';
  }

  drawGuards(guards) {
    const ctx = this.ctx;
    for (const guard of guards) {
      const coneFill = guard.seesPlayer ? COLORS.coneGuardHot : COLORS.coneGuard;
      this.drawCone(guard.x, guard.y, guard.angle, 252, 1.14, coneFill);
    }
    for (const guard of guards) {
      ctx.fillStyle = COLORS.guard;
      ctx.beginPath();
      ctx.arc(guard.x, guard.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLORS.guardVest;
      ctx.beginPath();
      ctx.arc(guard.x, guard.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#101826';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(guard.x, guard.y);
      ctx.lineTo(guard.x + Math.cos(guard.angle) * 22, guard.y + Math.sin(guard.angle) * 22);
      ctx.stroke();
      if (guard.investigating) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('?', guard.x + 18, guard.y - 16);
      }
    }
  }

  drawCameras(cameras) {
    const ctx = this.ctx;
    for (const camera of cameras) {
      if (!camera.disabled) {
        const coneFill = camera.seesPlayer ? COLORS.coneCameraHot : COLORS.coneCamera;
        this.drawCone(camera.x, camera.y, camera.angle, 318, 0.92, coneFill);
      }
      ctx.fillStyle = camera.disabled ? '#4a4a4a' : COLORS.camera;
      ctx.fillRect(camera.x - 10, camera.y - 7, 20, 14);
      ctx.fillStyle = camera.disabled ? '#222222' : '#ff4040';
      ctx.beginPath();
      ctx.arc(camera.x + Math.cos(camera.angle) * 12, camera.y + Math.sin(camera.angle) * 12, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlayer(player, state) {
    const ctx = this.ctx;
    if (player.inSmoke) {
      ctx.fillStyle = 'rgba(200, 200, 210, 0.55)';
      ctx.beginPath();
      ctx.arc(player.smokeX, player.smokeY, 66, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = COLORS.playerHood;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#101826';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + Math.cos(player.facing) * 18, player.y + Math.sin(player.facing) * 18);
    ctx.stroke();
    if (player.hasLoot) {
      ctx.fillStyle = COLORS.diamond;
      ctx.save();
      ctx.translate(player.x + 16, player.y - 16);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
    }
    if (player.nearDiamond() && state.screen === 'playing') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press E — GRAB THE DIAMOND', player.x, player.y - 28);
      ctx.textAlign = 'left';
    }
  }

  drawHud(state) {
    const ctx = this.ctx;
    ctx.fillStyle = '#0c0f16';
    ctx.fillRect(0, 0, VIEW_W, HUD_H);
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('ALARM', 24, 32);
    const alarmW = 260;
    const alarmFrac = Math.max(0, Math.min(1, state.alarm / 100));
    ctx.fillStyle = '#2a3448';
    ctx.fillRect(96, 18, alarmW, 20);
    ctx.fillStyle = alarmFrac > 0.6 ? COLORS.alarm : COLORS.alarmSafe;
    ctx.fillRect(96, 18, alarmW * alarmFrac, 20);
    ctx.strokeStyle = '#f2ead8';
    ctx.lineWidth = 2;
    ctx.strokeRect(96, 18, alarmW, 20);
    ctx.fillStyle = COLORS.text;
    ctx.fillText(`${Math.round(state.alarm)}%`, 366, 33);
    ctx.fillStyle = state.player.hasLoot ? COLORS.diamond : '#7a8aa0';
    ctx.fillText(state.player.hasLoot ? '◆ LOOT SECURED' : '◇ LOOT: THE GILDED DIAMOND', 440, 32);
    ctx.fillStyle = COLORS.gold;
    ctx.fillText(`COINS ${state.player.coins}`, 700, 32);
    ctx.fillStyle = COLORS.dim;
    ctx.font = '13px sans-serif';
    ctx.fillText('[1] Toss coin 1¢  ·  [2] Smoke 2¢  ·  [3] EMP 4¢', 800, 32);
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`TIME ${Math.floor(state.time)}s`, 1150, 32);
    if (state.seenNow) {
      ctx.fillStyle = COLORS.alarm;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('! SEEN — BREAK LINE OF SIGHT !', VIEW_W / 2, HUD_H + 24);
      ctx.textAlign = 'left';
    }
  }

  drawOverlay(title, lines, accent) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(8, 10, 16, 0.82)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = accent;
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, VIEW_W / 2, 250);
    ctx.fillStyle = COLORS.text;
    ctx.font = '18px sans-serif';
    lines.forEach((line, i) => {
      ctx.fillText(line, VIEW_W / 2, 300 + i * 30);
    });
    ctx.textAlign = 'left';
  }

  drawTitle(state) {
    this.drawOverlay('THE GILDED VAULT', [
      'One thief. One museum. One diamond worth the risk.',
      'Sneak past the guards and their sweeping vision cones, dodge the cameras,',
      'grab the Gilded Diamond, then reach the green EXIT before the alarm hits 100%.',
      'Move with WASD or arrows. Aim a coin toss with the mouse, press 1 to throw it.',
      'Press 2 for smoke, 3 for EMP. Hide in the dark shadow galleries.',
      'Press ENTER to begin the heist.',
    ], COLORS.caseGold);
  }

  drawWin(state) {
    const score = Math.max(0, Math.round(1000 - state.time * 5) + state.player.coins * 50);
    this.drawOverlay('CLEAN GETAWAY!', [
      `The Gilded Diamond is yours. Time: ${Math.floor(state.time)} seconds.`,
      `Coins left: ${state.player.coins}. Score: ${score}.`,
      'The museum never knew you were there.',
      'Press R to run the heist again.',
    ], COLORS.exit);
  }

  drawCaught(state) {
    this.drawOverlay('CAUGHT!', [
      'The alarm hit 100% and the guards closed in.',
      `You lasted ${Math.floor(state.time)} seconds.`,
      'Read the cones, use the shadows, spend a coin to lure a guard away.',
      'Press R to try the heist again.',
    ], COLORS.alarm);
  }

  draw(state) {
    this.drawRoom(state.level, state);
    this.drawCameras(state.cameras);
    this.drawGuards(state.guards);
    this.drawPlayer(state.player, state);
    this.drawHud(state);
    if (state.screen === 'title') this.drawTitle(state);
    if (state.screen === 'won') this.drawWin(state);
    if (state.screen === 'caught') this.drawCaught(state);
  }
}
