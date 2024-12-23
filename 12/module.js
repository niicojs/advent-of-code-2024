import { readFileSync } from 'fs';
import {
  directNeighbors,
  enumGrid,
  getDirectNeighbors,
  getGrid,
  inGridRange,
} from '../utils.js';

export function getParsedData() {
  const raw = readFileSync('./12/real.txt', 'utf-8');
  return getGrid(raw.split(/\r?\n/).filter(Boolean));
}

const key = (x, y, x2, y2) => {
  if (x2 !== undefined && y2 !== undefined) return `${x},${y},${x2},${y2}`;
  else return `${x},${y}`;
};

export function part1(grid) {
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
      const possible = getDirectNeighbors(r, c);
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

  // console.log(answer);
}

export function part2(grid) {
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
          edges.add(key(nx, ny, dx, dy));
          const nb = getDirectNeighbors(nx, ny);
          for (const [nx2, ny2] of nb) {
            if (edges.has(key(nx2, ny2, dx, dy))) {
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
    answer += area.size * area.sides;
  }
  // console.log(answer);
}
