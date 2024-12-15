import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines().map((l) => l.split(': ')[1].split(', '));

/**
 * Solve two equations with two unknowns.
 *  a1 * x + b1 * y = c1
 *  a2 * x + b2 * y = c2
 * @param {number} a1 coefficient of x in first equation
 * @param {number} b1 coefficient of y in first equation
 * @param {number} c1 the right hand side of first equation
 * @param {number} a2 coefficient of x in second equation
 * @param {number} b2 coefficient of y in second equation
 * @param {number} c2 the right hand side of second equation
 * @returns {number[]} The solution [x, y]
 */
function solve2eq2inc(ax, bx, px, ay, by, py) {
  const x = (by * px - bx * py) / (by * ax - bx * ay);
  const y = (px - ax * x) / bx;
  return [x, y];
}

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
    consola.log('machine', i / 3, res);
    if (res) answer += res;
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
