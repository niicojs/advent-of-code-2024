import { readFileSync } from 'fs';
import { enumGrid, getGrid } from '../utils.js';
import TinyQueue from 'tinyqueue';

export function getParsedData() {
  const raw = readFileSync('./16/real.txt', 'utf-8');
  return getGrid(raw.split(/\r?\n/).filter(Boolean));
}

const key = (x, y, dx, dy) => `${x},${y},${dx},${dy}`;

export function part1(grid) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === 'S') {
      start = [x, y];
      grid[y][x] = '.';
      break;
    }
  }

  const rotatel = (dir) => [dir[1], -dir[0]];
  const rotater = (dir) => [-dir[1], dir[0]];

  function run() {
    const todo = new TinyQueue([], (a, b) => a.score - b.score);
    const visited = new Set();
    todo.push({ score: 0, pos: start, dir: [1, 0] });
    while (todo.length > 0) {
      const {
        score,
        pos: [x, y],
        dir,
      } = todo.pop();
      const k = key(x, y, dir[0], dir[1]);
      if (visited.has(k)) continue;
      visited.add(k);
      if (grid[y][x] === 'E') return score;

      const [nx, ny] = [x + dir[0], y + dir[1]];
      if (grid[ny][nx] !== '#') {
        todo.push({
          score: score + 1,
          pos: [nx, ny],
          dir,
        });
      }

      todo.push({ score: score + 1000, pos: [x, y], dir: rotatel(dir) });
      todo.push({ score: score + 1000, pos: [x, y], dir: rotater(dir) });
    }
    return Infinity;
  }

  let answer = run();
  // console.log(answer);

  grid[start[1]][start[0]] = 'S';
}

export function part2(grid) {
  let start = [0, 0];
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === 'S') {
      start = [x, y];
      grid[y][x] = '.';
      break;
    }
  }

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
    }
    return bests;
  }

  const possible = findAllPaths();
  let answer = possible.size;

  // console.log(answer);
}
