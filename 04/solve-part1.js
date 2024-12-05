import { consola } from 'consola';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
  neighbors,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

function find(x, y, dirs, left) {
  if (left === '') return 1;
  let cnt = 0;
  for (const [dx, dy] of dirs) {
    const [nx, ny] = [x + dx, y + dy];
    if (!inGridRange(grid, nx, ny)) continue;
    if (grid[ny][nx] === left[0])
      if (find(nx, ny, [[dx, dy]], left.slice(1))) {
        cnt++;
      }
  }
  return cnt;
}

let answer = 0;
const grid = getGrid(getDataLines(day));
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'X') {
    console.log(`[${x},${y}]`, find(x, y, neighbors, 'MAS'));
    answer += find(x, y, neighbors, 'MAS');
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
