import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines());
let start = [0, 0];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'S') {
    start = [x, y];
    grid[y][x] = '.';
    break;
  }
}

const key = (x, y, dx, dy) => `${x},${y},${dx},${dy}`;
const rotatel = (dir) => [dir[1], -dir[0]];
const rotater = (dir) => [-dir[1], dir[0]];

function run() {
  const todo = new TinyQueue([], (a, b) => a.score - b.score);
  const visited = new Set();
  todo.push({ score: 0, pos: start, dir: [1, 0] });
  while (todo.length > 0) {
    const {
      score,
      pos: [x, y],
      dir,
    } = todo.pop();
    const k = key(x, y, dir[0], dir[1]);
    if (visited.has(k)) continue;
    visited.add(k);
    if (grid[y][x] === 'E') return score;

    const [nx, ny] = [x + dir[0], y + dir[1]];
    if (grid[ny][nx] !== '#') {
      todo.push({
        score: score + 1,
        pos: [nx, ny],
        dir,
      });
    }

    todo.push({ score: score + 1000, pos: [x, y], dir: rotatel(dir) });
    todo.push({ score: score + 1000, pos: [x, y], dir: rotater(dir) });
    todo.push({ score: score + 2000, pos: [x, y], dir: [-dir[0], -dir[1]] });
  }
  return Infinity;
}

let answer = run();

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
