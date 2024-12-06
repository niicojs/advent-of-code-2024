import { consola } from 'consola';
import {
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

let start = [0, 0];

const grid = getGrid(getDataLines(day));
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '^') start = [x, y];
}

const key = (pos, dir) => `${pos[0]},${pos[1]},${dir[0]},${dir[1]}`;

function gogogo(guard, dir) {
  const done = new Set();
  while (true) {
    let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    if (!inGridRange(grid, nx, ny)) return 'OUT';
    while (grid[ny][nx] === '#') {
      dir = [-dir[1], dir[0]];
      [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    }
    guard = [nx, ny];
    if (done.has(key(guard, dir))) return 'LOOP';
    done.add(key(guard, dir));
  }
}

let answer = 0;

for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '^') continue;
  if (cell === '#') continue;

  grid[y][x] = '#';

  let res = gogogo(start, [0, -1]);
  if (res === 'LOOP') answer++;

  grid[y][x] = '.';
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
