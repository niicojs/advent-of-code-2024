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

const key = (x, y) => `${x},${y}`;
const turn = {
  '0,-1': [1, 0],
  '1,0': [0, 1],
  '0,1': [-1, 0],
  '-1,0': [0, -1],
};

let start = [0, 0];
let guard = [0, 0];
let dir = [0, -1];
let done = new Set();
let history = new Set();

const grid = getGrid(getDataLines(day));
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '^') start = [x, y];
}
guard = start;

history.add(key(guard[0], guard[1]));

function step() {
  let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
  if (!inGridRange(grid, nx, ny)) return 'OUT';
  while (grid[ny][nx] === '#') {
    dir = turn[key(dir[0], dir[1])];
    [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
  }
  guard = [nx, ny];
  history.add(key(guard, dir));
  if (done.has(key2(guard, dir))) return 'LOOP';
  done.add(key2(guard, dir));
  return 'OK';
}

const key2 = (pos, dir) => `${pos[0]},${pos[1]},${dir[0]},${dir[1]}`;

let answer = 0;

for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '^') continue;
  if (cell === '#') continue;
  guard = start;
  dir = [0, -1];
  done = new Set();
  history = new Set();

  grid[y][x] = '#';

  let state = 'OK';
  do {
    state = step();
  } while (state === 'OK');

  if (state === 'LOOP') answer++;

  grid[y][x] = '.';
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
