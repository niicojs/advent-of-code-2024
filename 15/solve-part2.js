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
const grid = one
  .split(/\r?\n/)
  .map((l) =>
    l
      .replaceAll('#', '##')
      .replaceAll('O', '[]')
      .replaceAll('.', '..')
      .replace('@', '@.')
      .split('')
  );
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

const TEST = true;
function movewithbox([x, y], [dx, dy], test) {
  const [nx, ny] = [x + dx, y + dy];
  if (grid[ny][nx] === '#') return false;
  if (grid[ny][nx] === '.') {
    if (!test) {
      grid[ny][nx] = grid[y][x];
      grid[y][x] = '.';
    }
    return true;
  }
  if (dx !== 0) {
    // move left/right
    const next = movewithbox([nx, ny], [dx, dy], test);
    if (!test && next) {
      grid[ny][nx] = grid[y][x];
      grid[y][x] = '.';
    }
    return next;
  }

  // up or down
  if (grid[ny][nx] === '[') {
    const next =
      movewithbox([nx, ny], [dx, dy], test) &&
      movewithbox([nx + 1, ny], [dx, dy], test);
    if (!test && next) {
      grid[ny][nx] = grid[y][x];
      grid[y][x] = '.';
    }
    return next;
  }

  if (grid[ny][nx] === ']') {
    const next =
      movewithbox([nx, ny], [dx, dy], test) &&
      movewithbox([nx - 1, ny], [dx, dy], test);
    if (!test && next) {
      grid[ny][nx] = grid[y][x];
      grid[y][x] = '.';
    }
    return next;
  }
}

function move([x, y]) {
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirmap[dirs[i]];
    if (!dir) throw new Error('bad dir ' + dirs[i]);
    let [nx, ny] = [x + dir[0], y + dir[1]];
    if (grid[ny][nx] === '#') continue;
    if (movewithbox([x, y], dir, TEST)) {
      movewithbox([x, y], dir);
      [x, y] = [nx, ny];
    }
  }
  return [x, y];
}

const pos = move(start);
printGrid(grid, pos);

let answer = 0;
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '[') answer += 100 * y + x;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
