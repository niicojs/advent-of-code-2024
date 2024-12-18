import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
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

    if (x === SIZE - 1 && y === SIZE - 1) return true;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) =>
        nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE && !walls.has(key(nx, ny))
    );

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1 });
    }
  }
  return false;
}

let t = 1;
while (search(t)) t++;

let answer = lines[t - 1].join(',');

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
