import { readFileSync } from 'fs';
import { enumGrid, getGrid, inGridRange, inPath } from '../utils.js';

export function getParsedData() {
  const raw = readFileSync('./06/real.txt', 'utf-8');
  return getGrid(raw.split(/\r?\n/).filter(Boolean));
}

export function part1(grid) {
  const key = (x, y) => `${x},${y}`;
  const turn = {
    '0,-1': [1, 0],
    '1,0': [0, 1],
    '0,1': [-1, 0],
    '-1,0': [0, -1],
  };

  let guard = [0, 0];
  let dir = [0, -1];
  let history = new Set();

  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '^') guard = [x, y];
  }

  history.add(key(guard[0], guard[1]));

  function step() {
    let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    if (!inGridRange(grid, nx, ny)) return false;
    while (grid[ny][nx] === '#') {
      dir = turn[key(dir[0], dir[1])];
      [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
    }
    guard = [nx, ny];
    history.add(key(guard[0], guard[1]));
    return true;
  }

  while (step()) {}

  let answer = history.size;

  // console.log(answer);
}

export function part2(grid) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '^') {
      start = [x, y];
      break;
    }
  }

  const key = (pos, dir) => `${pos[0]},${pos[1]},${dir[0]},${dir[1]}`;

  function findpath(guard, dir) {
    const path = [];
    while (true) {
      let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
      if (!inGridRange(grid, nx, ny)) return path;
      while (grid[ny][nx] === '#') {
        dir = [-dir[1], dir[0]];
        [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
      }
      guard = [nx, ny];
      if (!inPath(path, guard)) path.push(guard);
    }
  }

  function gogogo(guard, dir) {
    const done = new Set();
    while (true) {
      let [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
      if (!inGridRange(grid, nx, ny)) return 'OUT';
      if (grid[ny][nx] === '#') {
        if (done.has(key([nx, ny], dir))) return 'LOOP';
        done.add(key([nx, ny], dir));
      }
      while (grid[ny][nx] === '#') {
        dir = [-dir[1], dir[0]];
        [nx, ny] = [guard[0] + dir[0], guard[1] + dir[1]];
      }
      guard = [nx, ny];
    }
  }

  let answer = 0;

  const path = findpath(start, [0, -1]);
  for (const [x, y] of path) {
    grid[y][x] = '#';

    let res = gogogo(start, [0, -1]);
    if (res === 'LOOP') answer++;

    grid[y][x] = '.';
  }

  // console.log(answer);
}
