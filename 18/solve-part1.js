import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
  inGridRange,
  inPath,
  nums,
  printGrid,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines().map(nums);

const SIZE = process.argv[2] === 'real' ? 71 : 7;
const grid = Array(SIZE)
  .fill(0)
  .map((_) => Array(SIZE).fill('.'));
const key = (x, y) => `${x},${y}`;

for (const [x, y] of lines.slice(0, 1024)) {
  grid[y][x] = '#';
}

function search() {
  const todo = new TinyQueue(
    [{ pos: [0, 0], score: 0, path: [[0, 0]] }],
    (a, b) => a.score - b.score
  );
  const visited = new Set();
  while (todo.length > 0) {
    const {
      pos: [x, y],
      score,
      path,
    } = todo.pop();

    if (x === SIZE - 1 && y === SIZE - 1) return [score, path];

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] !== '#'
    );

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1, path: [...path, [nx, ny]] });
    }
  }
}

let [answer, path] = search();

printGrid(grid, path);

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
