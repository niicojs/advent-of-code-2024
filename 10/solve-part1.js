import { consola } from 'consola';
import {
  directNeighbors,
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines());

const zeros = [];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '0') zeros.push([x, y]);
}

const key = (x, y) => `${x},${y}`;

function findTrails(start) {
  const todo = [start];
  let end = new Set();
  while (todo.length) {
    const [x, y] = todo.shift();
    if (grid[y][x] === '9') {
      end.add(key(x, y));
      continue;
    }
    const possible = directNeighbors
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(
        ([nx, ny]) =>
          inGridRange(grid, nx, ny) && +grid[ny][nx] === +grid[y][x] + 1
      );
    todo.push(...possible);
  }
  return end.size;
}

let answer = 0;
for (const z of zeros) {
  answer += findTrails(z);
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
