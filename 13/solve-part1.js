import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  memoize,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines().map((l) => l.split(': ')[1].split(', '));

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
  consola.log('machine', i / 3, res);
  if (res !== Infinity) answer += res;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
