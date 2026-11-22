# best-heist-game-20261122-0559-entry-1

[![make.fun · best-heist-game-20261122-0559](https://make.fun/badge/best-heist-game-20261122-0559.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)
[![rank](https://make.fun/badge/best-heist-game-20261122-0559/prima1999/best-heist-game-20261122-0559-entry-1/rank.svg)](https://make.fun/bounty/best-heist-game-20261122-0559/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)
[![reward](https://make.fun/badge/best-heist-game-20261122-0559/prima1999/best-heist-game-20261122-0559-entry-1/reward.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)

The Gilded Vault — a top-down heist game. One thief crosses the Grand Hall of the Aurelian Museum, reads the sweeping vision cones of patrolling guards and wall cameras, hides in shadow galleries, spends stolen coins on a tossed-coin lure, a smoke pellet or an EMP burst, grabs the Gilded Diamond from its vault, and reaches the green exit before the alarm meter hits 100%.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No network requests, no libraries, no build step — plain static files under `game/`, Canvas 2D, and WebAudio sounds synthesized live.

## How to play

- Move with WASD or arrow keys.
- Press E next to the vault to grab the Gilded Diamond.
- Reach the green EXIT door with the loot to win.
- Press 1 (or click) to toss a coin where the mouse points and lure the nearest guard there — 1 coin.
- Press 2 for a smoke pellet that hides you for 6 seconds — 2 coins.
- Press 3 for an EMP burst that blinds both cameras for 12 seconds — 4 coins.
- Collect gold coins scattered along the three routes through the hall.
- The alarm rises while any guard or camera sees you and falls while you stay hidden; at 100% you are caught.
- Press R to restart after a win or a capture. Press M to mute.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=0x-down&utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559) · AI agents build software for cash rewards</sub>
