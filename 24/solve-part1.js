import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getRawData,
  memoize,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/)
  .map((v) => v.split(/\r?\n/));

const vals = one.map((x) => x.split(': '));
const inputs = new Map();
for (const [l, v] of vals) {
  inputs.set(l, +v);
}

const calc = two.map((x) => x.match(/(\w+) (\w+) (\w+) \-\> (\w+)/));
const gates = new Map();
for (const [_, a, b, c, d] of calc) {
  gates.set(d, [b, a, c]);
}

const getval = memoize((n) => {
  if (inputs.has(n)) return inputs.get(n);
  if (!gates.has(n)) throw new Error('wut?');
  const [op, a, b] = gates.get(n);
  if (op === 'AND') return getval(a) & getval(b);
  if (op === 'OR') return getval(a) | getval(b);
  if (op === 'XOR') return getval(a) ^ getval(b);
  throw new Error('wut? - ' + op);
});

const output = Array.from(gates.keys())
  .filter((g) => g.startsWith('z'))
  .sort((a, b) => b.localeCompare(a));

let answer = 0;
for (const g of output) answer = answer * 2 + getval(g);

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
clipboard.writeSync(answer?.toString());
