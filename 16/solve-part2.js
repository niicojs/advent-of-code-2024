import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { yellow } from 'yoctocolors';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines());

let start = [0, 0];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'S') {
    start = [x, y];
    grid[y][x] = '.';
    break;
  }
}

const key = (x, y, dx, dy) => `${x},${y},${dx},${dy}`;
const rotatel = (dir) => [dir[1], -dir[0]];
const rotater = (dir) => [-dir[1], dir[0]];

function findAllPaths() {
  const todo = new TinyQueue([], (a, b) => a.score - b.score);
  const visited = new Map();
  let bestscore = Infinity;
  const bests = new Set();
  todo.push({
    score: 0,
    pos: start,
    dir: [1, 0],
    path: [start],
  });
  while (todo.length > 0) {
    const {
      score,
      pos: [x, y],
      dir,
      path,
    } = todo.pop();
    const k = key(x, y, dir[0], dir[1]);
    if (visited.has(k) && visited.get(k) < score) continue;
    visited.set(k, score);
    if (grid[y][x] === 'E') {
      if (score <= bestscore) {
        bestscore = score;
        path.forEach(([x, y]) => bests.add(`${x},${y}`));
        continue;
      } else {
        return bests;
      }
    }

    const [nx, ny] = [x + dir[0], y + dir[1]];
    if (grid[ny][nx] !== '#') {
      todo.push({
        score: score + 1,
        pos: [nx, ny],
        dir,
        path: [...path, [nx, ny]],
      });
    }

    todo.push({ score: score + 1000, pos: [x, y], dir: rotatel(dir), path });
    todo.push({ score: score + 1000, pos: [x, y], dir: rotater(dir), path });
    todo.push({
      score: score + 2000,
      pos: [x, y],
      dir: [-dir[0], -dir[1]],
      path,
    });
  }
  return bests;
}

const printGrid = (grid, visited) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      line += visited.has(`${x},${y}`) ? yellow('o') : grid[y][x];
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const possible = findAllPaths();
let answer = possible.size;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
