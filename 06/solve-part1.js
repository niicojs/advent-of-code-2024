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

let guard = [0, 0];
let dir = [0, -1];
let history = new Set();

const grid = getGrid(getDataLines(day));
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '^') guard = [x, y];
}

history.add(key(guard[0], guard[1]));

function step() {
  let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
  if (!inGridRange(grid, nx, ny)) return false;
  while (grid[ny][nx] === '#') {
    dir = turn[key(dir[0], dir[1])];
    [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
  }
  guard = [nx, ny];
  history.add(key(guard[0], guard[1]));
  return true;
}

while (step()) {}

let answer = history.size;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
