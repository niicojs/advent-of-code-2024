import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  memoize,
  mod,
  nums,
  sum,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const values = getDataLines().map(nums);

const mix = (val, secret) => val ^ secret;
const prune = (val) => mod(val, 16777216);

const nextsecret = memoize((secret) => {
  let val = prune(mix(secret * 64, secret));
  val = prune(mix(Math.floor(val / 32), val));
  val = prune(mix(val * 2048, val));
  return val;
});

const key = (a, b, c, d) => `${a},${b},${c},${d}`;

const changes = new Map();

for (let [buyers, v] of values.entries()) {
  let rolling = [0, 0, 0, 0];
  let p = v % 10;
  for (let i = 0; i < 2000; i++) {
    v = nextsecret(v);
    let diff = (v % 10) - p;
    p = v % 10;
    rolling.push(diff);
    rolling.shift();
    if (i > 3) {
      const k = key(...rolling);
      if (!changes.has(k)) {
        changes.set(k, Array(values.length).fill(null));
      }
      const r = changes.get(k);
      if (r[buyers] === null) r[buyers] = p;
    }
  }
}

let answer = 0;
for (const vals of changes.values()) {
  const gain = sum(vals.map((v) => v || 0));
  if (gain > answer) {
    answer = gain;
  }
}

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
clipboard.writeSync(answer?.toString());
