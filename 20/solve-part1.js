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

function search() {
  const todo = new TinyQueue(
    [{ score: 0, path: [start] }],
    (a, b) => a.score - b.score
  );
  const visited = new Set();

  while (todo.length > 0) {
    const { score, path } = todo.pop();
    let [x, y] = path.at(-1);

    if (grid[y][x] === 'E') return path;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] !== '#'
    );

    for (const [nx, ny] of possible.filter(
      ([nx, ny]) => grid[ny][nx] !== '#'
    )) {
      todo.push({
        path: [...path, [nx, ny]],
        score: score + 1,
      });
    }
  }
}

let path = search();

const nocheat = path.length - 1;

const dist = new Map();
for (let i = 0; i < path.length; i++) {
  dist.set(key(...path[i]), nocheat - i);
}
consola.log('no cheat', nocheat);

let answer = 0;
for (const [x, y] of path) {
  const real = dist.get(key(x, y));
  const check = getDirectNeighbors(x, y).filter(
    ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] === '#'
  );
  for (const [nx, ny] of check) {
    const after = getDirectNeighbors(nx, ny).filter(
      ([a, b]) => inGridRange(grid, a, b) && grid[b][a] !== '#'
    );
    for (const [a, b] of after) {
      if (!dist.has(key(a, b))) continue;
      const cheat = 2 + dist.get(key(a, b));
      if (cheat < real) {
        if (real - cheat >= 100) {
          answer++;
        }
      }
    }
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
