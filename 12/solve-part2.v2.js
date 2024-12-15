import { consola } from 'consola';
import {
  directNeighbors,
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
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
const key2 = (x, y, dx, dy) => `${x},${y},${dx},${dy}`;
const done = new Set();

function findArea(type, x, y) {
  const todo = [[x, y]];
  const area = new Set();
  let sides = 0;
  const edges = new Set();
  while (todo.length) {
    const [r, c] = todo.shift();
    if (area.has(key(r, c))) continue;
    done.add(key(r, c));
    area.add(key(r, c));
    for (const [dx, dy] of directNeighbors) {
      const [nx, ny] = [r + dx, c + dy];
      if (!inGridRange(grid, nx, ny) || grid[ny][nx] !== type) {
        sides++;
        edges.add(key2(nx, ny, dx, dy));
        const nb = getDirectNeighbors(nx, ny);
        for (const [nx2, ny2] of nb) {
          if (edges.has(key2(nx2, ny2, dx, dy))) {
            sides--;
          }
        }
      } else if (!area.has(key(nx, ny))) {
        todo.push([nx, ny]);
      }
    }
  }

  return { type, size: area.size, sides };
}

let answer = 0;

for (const { x, y, cell } of enumGrid(grid)) {
  if (done.has(key(x, y))) continue;
  const area = findArea(cell, x, y);
  consola.log(area);
  answer += area.size * area.sides;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
