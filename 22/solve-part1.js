import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  memoize,
  mod,
  nums,
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

let answer = 0;
for (let v of values) {
  for (let i = 0; i < 2000; i++) {
    v = nextsecret(v);
  }
  answer += v;
}

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
clipboard.writeSync(answer?.toString());
