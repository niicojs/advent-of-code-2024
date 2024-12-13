import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day).map((l) => l.split(': ')[1].split(', '));

function find([px, py], [ax, ay], [bx, by]) {
  // ax * x + bx * y = px and ay * x + by * y = py
  // mult to that both y have same coeff
  // by * ax * x + bx * by * y = by * px or bx * by * y = by * px - by * ax * x
  // bx * ay * x + bx * by * y = bx * py or bx * by * y = bx * py - bx * ay * x
  // so
  // by * px - by * ax * x = bx * py - bx * ay * x
  // x (- bx * ay + by * ax) = by * px - bx * py
  // x = (by * px - bx * py) / (by * ax - bx * ay)

  const x = (by * px - bx * py) / (by * ax - bx * ay);
  const y = (px - ax * x) / bx;

  if (x < 0 || y < 0) return 0;
  if (!Number.isInteger(x) || !Number.isInteger(y)) return 0;

  return 3 * x + y;
}

let answer = 0;
for (let i = 0; i < lines.length; i += 3) {
  const a = lines[i].map((x) => x.split('+')[1]).map(Number);
  const b = lines[i + 1].map((x) => x.split('+')[1]).map(Number);
  const target = lines[i + 2].map((x) => x.split('=')[1]).map(Number);
  target[0] += 10000000000000;
  target[1] += 10000000000000;

  const res = find(target, a, b);
  consola.log('machine', i / 3, res);
  if (res) answer += res;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
