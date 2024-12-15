import { consola } from 'consola';
import {
  diagNeighbors,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

let answer = 0;
const grid = getGrid(getDataLines());

const map = { M: 'S', S: 'M' };
function findcross(x, y) {
  const crosses = diagNeighbors
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([nx, ny]) => grid[ny][nx] === 'M' || grid[ny][nx] === 'S')
    .map(([nx, ny]) => grid[ny][nx]);
  if (crosses.length !== 4) return 0;
  if (map[crosses[0]] === crosses[2] && map[crosses[1]] === crosses[3])
    return 1;
  return 0;
}

for (let y = 1; y < grid.length - 1; y++) {
  for (let x = 1; x < grid[0].length - 1; x++) {
    if (grid[y][x] === 'A') answer += findcross(x, y);
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
