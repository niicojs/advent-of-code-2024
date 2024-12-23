import { readFileSync } from 'fs';
import { enumGrid, getDirectNeighbors, getGrid, inGridRange, nums } from '../utils.js';

export function getParsedData() {
  const lines = readFileSync('./20/real.txt', 'utf-8').trim().split(/\r?\n/);
  return getGrid(lines);
}

const key = (x, y, x2, y2) => {
  if (x2 !== undefined && y2 !== undefined) return `${x},${y},${x2},${y2}`;
  else return `${x},${y}`;
};

function initdists(grid, start) {
  let d = 0;
  const dists = new Map([[key(...start), 0]]);
  let last = [-1, -1];
  let [x, y] = start;
  while (grid[y][x] !== 'E') {
    const neighbors = getDirectNeighbors(x, y).filter(
      ([nx, ny]) =>
        inGridRange(grid, nx, ny) &&
        grid[ny][nx] !== '#' &&
        (nx !== last[0] || ny !== last[1])
    );
    last = [x, y];
    [x, y] = neighbors[0];
    dists.set(key(x, y), ++d);
  }
  return dists;
}

export function part1(grid) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === 'S') {
      start = [x, y];
      grid[y][x] = '.';
    }
  }

  const dists = initdists(grid, start);

  let answer = 0;
  for (const k of dists.keys()) {
    const [x, y] = nums(k);

    const cheat = 2 + dists.get(key(x, y));
    const check = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] === '#'
    );
    for (const [nx, ny] of check) {
      const after = getDirectNeighbors(nx, ny).filter(
        ([a, b]) => inGridRange(grid, a, b) && grid[b][a] !== '#'
      );
      for (const [a, b] of after) {
        if (!dists.has(key(a, b))) continue;
        const real = dists.get(key(a, b));
        if (cheat < real) {
          if (real - cheat >= 100) {
            answer++;
          }
        }
      }
    }
  }

  // console.log(answer);
  grid[start[1]][start[0]] = 'S';
}

export function part2(grid) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === 'S') {
      start = [x, y];
      grid[y][x] = '.';
    }
  }

  const dists = initdists(grid, start);

  let cheats = {};
  const abs = Math.abs;
  function cheatpath(sx, sy) {
    const r = 20;
    for (let i = -r; i <= r; i++) {
      for (let j = -r; j <= r; j++) {
        if (abs(i) + abs(j) < 2) continue;
        if (abs(i) + abs(j) > r) continue;
        if (!inGridRange(grid, sx + i, sy + j)) continue;
        if (grid[sy + j][sx + i] === '#') continue;

        const nocheat = dists.get(key(sx + i, sy + j));
        if (!nocheat) continue;

        const cheat = dists.get(key(sx, sy)) + abs(i) + abs(j);
        if (cheat < nocheat) {
          const k = key(sx, sy, sx + i, sy + j);
          if (!cheats[k] || nocheat - cheat > cheats[k])
            cheats[k] = nocheat - cheat;
        }
      }
    }
  }

  for (const k of dists.keys()) {
    const [x, y] = nums(k);
    cheatpath(x, y);
  }

  const answer = Object.values(cheats).filter((v) => v >= 100).length;
  // console.log(answer);
}
