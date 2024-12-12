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

const grid = getGrid(getDataLines(day));

const key = (x, y) => `${x},${y}`;
const done = new Set();

function findSides(edges) {
  let sides = 0;
  for (const dir in edges) {
    const groups = [];
    const [dx, dy] = dir.split(',').map(Number);
    edges[dir].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
    while (edges[dir].length) {
      const [r1, c1] = edges[dir].shift();
      let found = false;
      for (const g of groups) {
        if (
          g.some(
            ([r2, c2]) =>
              (r1 === r2 + dy && c1 === c2 + dx) ||
              (r1 === r2 - dy && c1 === c2 + dx) ||
              (r1 === r2 + dy && c1 === c2 - dx) ||
              (r1 === r2 - dy && c1 === c2 - dx)
          )
        ) {
          g.push([r1, c1]);
          found = true;
          break;
        }
      }
      if (!found) groups.push([[r1, c1]]);
    }
    sides += groups.length;
  }
  return sides;
}

function findArea(type, x, y) {
  const todo = [[x, y]];
  const area = new Set();
  let edges = {};
  while (todo.length) {
    const [r, c] = todo.shift();
    if (done.has(key(r, c))) continue;
    done.add(key(r, c));
    area.add(key(r, c));
    for (const [dx, dy] of directNeighbors) {
      const [nx, ny] = [r + dx, c + dy];
      if (!inGridRange(grid, nx, ny) || grid[ny][nx] !== type) {
        edges[key(dx, dy)] = [...(edges[key(dx, dy)] || []), [nx, ny]];
      } else {
        todo.push([nx, ny]);
      }
    }
  }

  // find sides
  const sides = findSides(edges);

  return { type, size: area.size, sides };
}

let answer = 0;

for (const { x, y, cell } of enumGrid(grid)) {
  if (done.has(key(x, y))) continue;
  const area = findArea(cell, x, y);
  consola.log(area);
  if (area.size === 0 || area.sides < 4) {
    ''.toString();
  }
  answer += area.size * area.sides;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
