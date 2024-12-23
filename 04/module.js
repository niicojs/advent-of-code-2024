import { readFileSync } from 'fs';
import {
  getGrid,
  enumGrid,
  inGridRange,
  neighbors,
  diagNeighbors,
} from '../utils.js';

export function getParsedData() {
  const raw = readFileSync('./04/real.txt', 'utf-8');
  return getGrid(raw.split(/\r?\n/).filter(Boolean));
}

export function part1(grid) {
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
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === 'X') {
      answer += find(x, y, neighbors, 'MAS');
    }
  }

  // console.log(answer);
}

export function part2(grid) {
  let answer = 0;

  const map = { M: 'S', S: 'M' };
  function findcross(x, y) {
    const crosses = diagNeighbors
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => grid[ny][nx] === 'M' || grid[ny][nx] === 'S')
      .map(([nx, ny]) => grid[ny][nx]);
    if (crosses.length !== 4) return 0;
    if (map[crosses[0]] === crosses[2] && map[crosses[1]] === crosses[3])
      return 1;
    return 0;
  }

  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[0].length - 1; x++) {
      if (grid[y][x] === 'A') answer += findcross(x, y);
    }
  }

  // console.log(answer);
}
