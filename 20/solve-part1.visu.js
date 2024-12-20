import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
  getGrid,
  inGridRange,
  nums,
  printGrid,
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

const dists = initdists();

let answer = 0;
let cheats =[];
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
          cheats.push([nx, ny]);
          cheats.push([a, b]);
        }
      }
    }
  }
}

printGrid(grid, cheats);

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
