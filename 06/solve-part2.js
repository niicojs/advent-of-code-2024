import { consola } from 'consola';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
  inPath,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

let start = [0, 0];

const grid = getGrid(getDataLines());
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '^') start = [x, y];
}

const key = (pos, dir) => `${pos[0]},${pos[1]},${dir[0]},${dir[1]}`;

function findpath(guard, dir) {
  const path = [];
  while (true) {
    let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    if (!inGridRange(grid, nx, ny)) return path;
    while (grid[ny][nx] === '#') {
      dir = [-dir[1], dir[0]];
      [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    }
    guard = [nx, ny];
    if (!inPath(path, guard)) path.push(guard);
  }
}

function gogogo(guard, dir) {
  const done = new Set();
  while (true) {
    let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    if (!inGridRange(grid, nx, ny)) return 'OUT';
    if (grid[ny][nx] === '#') {
      if (done.has(key([nx, ny], dir))) return 'LOOP';
      done.add(key([nx, ny], dir));
    }
    while (grid[ny][nx] === '#') {
      dir = [-dir[1], dir[0]];
      [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    }
    guard = [nx, ny];
  }
}

let answer = 0;

const path = findpath(start, [0, -1]);
for (const [x, y] of path) {
  grid[y][x] = '#';

  let res = gogogo(start, [0, -1]);
  if (res === 'LOOP') answer++;

  grid[y][x] = '.';
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
