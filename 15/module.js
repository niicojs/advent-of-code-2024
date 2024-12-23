import { readFileSync } from 'fs';
import { enumGrid } from '../utils.js';

export function getParsedData() {
  const raw = readFileSync('./15/real.txt', 'utf-8');
  const [one, two] = raw.split(/\r?\n\r?\n/);
  const p1 = one.split(/\r?\n/).map((l) => l.split(''));
  const p2 = one
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
  return { p1, p2, dirs };
}

const dirmap = {
  '>': [1, 0],
  '<': [-1, 0],
  v: [0, 1],
  '^': [0, -1],
};

export function part1({ p1: grid, dirs }) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '@') {
      start = [x, y];
      grid[y][x] = '.';
    }
  }

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

  // console.log(answer);
}

export function part2({ p2: grid, dirs }) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '@') {
      start = [x, y];
      grid[y][x] = '.';
    }
  }

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

  move(start);

  let answer = 0;
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '[') answer += 100 * y + x;
  }

  // console.log(answer);
}
