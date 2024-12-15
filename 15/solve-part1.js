import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getRawData,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const raw = getRawData();
const [one, two] = raw.split(/\r?\n\r?\n/);
const grid = one.split(/\r?\n/).map((l) => l.split(''));
const dirs = two.replace(/\r?\n/g, '');

export const printGrid = (grid, pos) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (pos && pos[0] === x && pos[1] === y) line += '@';
      else line += grid[y][x];
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

let start = [0, 0];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '@') {
    start = [x, y];
    grid[y][x] = '.';
  }
}

consola.log(start);

const dirmap = {
  '>': [1, 0],
  '<': [-1, 0],
  v: [0, 1],
  '^': [0, -1],
};

function move([x, y]) {
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirmap[dirs[i]];
    if (!dir) throw new Error('bad dir ' + dirs[i]);
    let [nx, ny] = [x + dir[0], y + dir[1]];
    if (grid[ny][nx] === '#') continue;
    if (grid[ny][nx] === 'O') {
      let n = 2;
      while (grid[y + n * dir[1]][x + n * dir[0]] === 'O') n++;
      if (grid[y + n * dir[1]][x + n * dir[0]] === '#') continue;
      for (let j = 2; j <= n; j++) {
        grid[y + j * dir[1]][x + j * dir[0]] =
          grid[y + (j - 1) * dir[1]][x + (j - 1) * dir[0]];
      }
      grid[ny][nx] = '.';
    }
    [x, y] = [nx, ny];
  }
  return [x, y];
}

move(start);

let answer = 0;
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'O') answer += 100 * y + x;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
