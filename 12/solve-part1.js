import { consola } from 'consola';
import {
  directNeighbors,
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines());

const key = (x, y) => `${x},${y}`;
const done = new Set();

function findArea(type, x, y) {
  const todo = [[x, y]];
  const area = new Set();
  let edges = 0;
  while (todo.length) {
    const [r, c] = todo.shift();
    if (done.has(key(r, c))) continue;
    done.add(key(r, c));
    area.add(key(r, c));
    const possible = directNeighbors.map(([dx, dy]) => [r + dx, c + dy]);
    for (const [nx, ny] of possible) {
      if (!inGridRange(grid, nx, ny) || grid[ny][nx] !== type) {
        edges++;
      } else {
        todo.push([nx, ny]);
      }
    }
  }
  return { type, area, size: area.size, edges };
}

let answer = 0;
for (const { x, y, cell } of enumGrid(grid)) {
  if (done.has(key(x, y))) continue;
  const area = findArea(cell, x, y);
  answer += area.size * area.edges;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
