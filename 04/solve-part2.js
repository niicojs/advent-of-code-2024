import { consola } from 'consola';
import {
  diagNeighbors,
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

const map = { M: 'S', S: 'M' };

function findcross(x, y) {
  const crosses = diagNeighbors
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(
      ([nx, ny]) =>
        inGridRange(grid, nx, ny) &&
        (grid[ny][nx] === 'M' || grid[ny][nx] === 'S')
    )
    .map(([nx, ny]) => grid[ny][nx]);
  if (crosses.length !== 4) return 0;
  if (map[crosses[0]] === crosses[2] && map[crosses[1]] === crosses[3])
    return 1;
  return 0;
}

let answer = 0;
const grid = getGrid(getDataLines(day));
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'A') {
    answer += findcross(x, y);
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
