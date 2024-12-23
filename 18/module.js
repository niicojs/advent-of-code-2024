import { readFileSync } from 'fs';
import TinyQueue from 'tinyqueue';
import { getDirectNeighbors, inGridRange, nums } from '../utils.js';

export function getParsedData() {
  return readFileSync('./18/real.txt', 'utf-8')
    .trim()
    .split(/\r?\n/)
    .map(nums);
}

const SIZE = 71;
const key = (x, y) => `${x},${y}`;

export function part1(lines) {
  const grid = Array(SIZE)
    .fill(0)
    .map((_) => Array(SIZE).fill('.'));

  for (const [x, y] of lines.slice(0, 1024)) {
    grid[y][x] = '#';
  }

  function search() {
    const todo = new TinyQueue(
      [{ pos: [0, 0], score: 0, path: [[0, 0]] }],
      (a, b) => a.score - b.score
    );
    const visited = new Set();
    while (todo.length > 0) {
      const {
        pos: [x, y],
        score,
        path,
      } = todo.pop();

      if (x === SIZE - 1 && y === SIZE - 1) return [score, path];

      if (visited.has(key(x, y))) continue;
      visited.add(key(x, y));

      const possible = getDirectNeighbors(x, y).filter(
        ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] !== '#'
      );

      for (const [nx, ny] of possible) {
        todo.push({
          pos: [nx, ny],
          score: score + 1,
          path: [...path, [nx, ny]],
        });
      }
    }
  }

  let [answer, path] = search();

  // console.log(answer);
}

export function part2(lines) {
  const blocks = (nb) => {
    const b = new Set();
    for (const [x, y] of lines.slice(0, nb)) {
      b.add(key(x, y));
    }
    return b;
  };

  function search(secs) {
    const walls = blocks(secs);
    const todo = [[0, 0]];

    const visited = new Set();
    while (todo.length > 0) {
      const [x, y] = todo.shift();

      if (x === SIZE - 1 && y === SIZE - 1) return true;

      if (visited.has(key(x, y))) continue;
      visited.add(key(x, y));

      const possible = getDirectNeighbors(x, y).filter(
        ([nx, ny]) =>
          nx >= 0 &&
          ny >= 0 &&
          nx < SIZE &&
          ny < SIZE &&
          !walls.has(key(nx, ny))
      );

      for (const [nx, ny] of possible) {
        todo.push([nx, ny]);
      }
    }
    return false;
  }

  function binarysearch(min, max) {
    let left = min;
    let right = max;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (search(mid)) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }

  let t = binarysearch(1024, lines.length);
  let answer = lines[t - 1].join(',');
  // console.log(answer);
}
