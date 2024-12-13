import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
  getGrid,
  getRawData,
  inGridRange,
  nums,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const raw = getRawData().trim();
const lines = getDataLines();
const grid = getGrid(getDataLines());
const values = getDataLines().map(nums);

const key = (x, y) => `${x},${y}`;
const key2 = (x, y, dx, dy) => `${x},${y},${dx},${dy}`;

function search() {
  const todo = new TinyQueue(
    [{ pos: [0, 0], score: 0 }],
    (a, b) => a.score - b.score
  );
  const visited = new Set();
  while (todo.length > 0) {
    const {
      pos: [x, y],
      score,
    } = todo.pop();

    if (x === 0 && y === 0) return score;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] !== '#'
    );

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1 });
    }
  }
}

let answer = 0;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
