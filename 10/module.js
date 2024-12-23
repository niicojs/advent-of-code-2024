import { readFileSync } from 'fs';
import { enumGrid, getDirectNeighbors, getGrid, inGridRange, sum } from '../utils.js';
import { get } from 'http';

export function getParsedData() {
  return getGrid(
    readFileSync('./10/real.txt', 'utf-8').split(/\r?\n/).filter(Boolean)
  );
}

export function part1(grid) {
  const zeros = [];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '0') zeros.push([x, y]);
  }

  const key = (x, y) => `${x},${y}`;

  function findTrails(start) {
    const todo = [start];
    let end = new Set();
    while (todo.length) {
      const [x, y] = todo.shift();
      if (grid[y][x] === '9') {
        end.add(key(x, y));
        continue;
      }
      const possible = getDirectNeighbors(x, y).filter(
        ([nx, ny]) =>
          inGridRange(grid, nx, ny) && +grid[ny][nx] === +grid[y][x] + 1
      );
      todo.push(...possible);
    }
    return end.size;
  }

  let answer = 0;
  for (const z of zeros) {
    answer += findTrails(z);
  }

  // console.log(answer);
}

export function part2(grid) {
  const zeros = [];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '0') zeros.push([x, y]);
  }

  const key = (x, y) => `${x},${y}`;

  function findTrails(start) {
    const todo = [start];
    let end = [];
    while (todo.length) {
      const [x, y] = todo.shift();
      if (grid[y][x] === '9') {
        end[key(x, y)] = (end[key(x, y)] || 0) + 1;
        continue;
      }
      const possible = getDirectNeighbors(x, y)
        .filter(
          ([nx, ny]) =>
            inGridRange(grid, nx, ny) && +grid[ny][nx] === +grid[y][x] + 1
        );
      todo.push(...possible);
    }
    return sum(Object.values(end));
  }

  let answer = 0;
  for (const z of zeros) {
    answer += findTrails(z);
  }

  // console.log(answer);
}
