// The Gilded Vault: a heist game entry for make.fun.
// This program hands the game in: it copies game/ and screenshots/ from
// beside this file to /output and writes /output/dossier.json with the
// vendored make.fun library. It runs on Node 22 with the standard library
// only, and it never installs or downloads anything.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The output directory is only created, never removed: in the grader it
// is a bind mount, and removing it fails the run outright.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes, while the
// other limits refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB, more than 993 files in game/ or 48 MiB
// of game files in all, or a path under game/ over 1000 bytes. game/ counts
// beside /output's own 1000-entry cap, together with its screenshots/ and
// dossier.json, so the caps leave them room.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
