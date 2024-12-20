import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
  getGrid,
  inGridRange,
  nums,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines());

const key = (x, y, x2, y2) => {
  if (x2 && y2) return `${x},${y},${x2},${y2}`;
  else return `${x},${y}`;
};

let start = [0, 0];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'S') {
    start = [x, y];
    grid[y][x] = '.';
  }
}

function initdists() {
  const dists = new Map();
  const todo = [{ pos: start, dist: 0 }];

  while (todo.length > 0) {
    const { pos, dist } = todo.shift();
    let [x, y] = pos;

    if (dists.has(key(x, y))) continue;
    dists.set(key(x, y), dist);

    if (grid[y][x] === 'E') return dists;

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] !== '#'
    );

    for (const [nx, ny] of possible) {
      todo.push({
        pos: [nx, ny],
        dist: dist + 1,
      });
    }
  }
}

const dists = initdists();

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

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
