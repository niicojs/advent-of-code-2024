import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines().map((l) => l.split(',').map(Number));

const SIZE = process.argv[2] === 'real' ? 71 : 7;
const key = (x, y) => `${x},${y}`;

const blocks = (nb) => {
  const b = new Set();
  for (const [x, y] of lines.slice(0, nb)) {
    b.add(key(x, y));
  }
  return b;
};

function search(secs) {
  const walls = blocks(secs);
  const todo = [[0, 0]];

  const visited = new Set();
  while (todo.length > 0) {
    const [x, y] = todo.shift();

    if (x === SIZE - 1 && y === SIZE - 1) return true;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) =>
        nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE && !walls.has(key(nx, ny))
    );

    for (const [nx, ny] of possible) {
      todo.push([nx, ny]);
    }
  }
  return false;
}

function binarysearch(min, max) {
  let left = min;
  let right = max;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (search(mid)) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

let t = binarysearch(1024, lines.length);
let answer = lines[t - 1].join(',');

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
