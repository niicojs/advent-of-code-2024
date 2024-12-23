import { readFileSync } from 'fs';
import { memoize } from '../utils.js';

export function getParsedData() {
  const lines = readFileSync('./13/real.txt', 'utf-8')
    .split(/\r?\n/)
    .filter(Boolean);
  return lines.map((l) => l.split(': ')[1].split(', '));
}

export function part1(lines) {
  const find = memoize((target, a, b) => {
    if (target[0] === 0 && target[1] === 0) return 0;
    if (target[0] < 0 || target[1] < 0) return Infinity;
    const c1 = 3 + find([target[0] - a[0], target[1] - a[1]], a, b);
    const c2 = 1 + find([target[0] - b[0], target[1] - b[1]], a, b);
    return Math.min(c1, c2);
  });

  let answer = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const a = lines[i].map((x) => x.split('+')[1]).map(Number);
    const b = lines[i + 1].map((x) => x.split('+')[1]).map(Number);
    const target = lines[i + 2].map((x) => x.split('=')[1]).map(Number);

    const res = find(target, a, b);
    if (res !== Infinity) answer += res;
  }

  // console.log(answer);
}

function solve2eq2inc(ax, bx, px, ay, by, py) {
  const x = (by * px - bx * py) / (by * ax - bx * ay);
  const y = (px - ax * x) / bx;
  return [x, y];
}

export function part2(lines) {
  let answer = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const a = lines[i].map((x) => x.split('+')[1]).map(Number);
    const b = lines[i + 1].map((x) => x.split('+')[1]).map(Number);
    const target = lines[i + 2].map((x) => x.split('=')[1]).map(Number);
    target[0] += 10000000000000;
    target[1] += 10000000000000;

    const [x, y] = solve2eq2inc(a[0], b[0], target[0], a[1], b[1], target[1]);
    if (x > 0 && y > 0 && Number.isInteger(x) && Number.isInteger(y)) {
      const res = 3 * x + y;
      if (res) answer += res;
    }
  }
  // console.log(answer);
}
