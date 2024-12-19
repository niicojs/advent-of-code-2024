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
  .split(/\r?\n\r?\n/);
const towels = one.split(', ');
const designs = two.split(/\r?\n/);

const bystart = {};
for (const t of towels) {
  if (!bystart[t.at(0)]) bystart[t.at(0)] = [];
  bystart[t.at(0)].push(t);
}

const search = memoize((design) => {
  if (design.length === 0) return 1;
  const first = design.at(0);
  if (!bystart[first]) return 0;
  let res = 0;
  for (const towel of bystart[first]) {
    if (design.length >= towel.length && design.startsWith(towel)) {
      res += search(design.slice(towel.length));
    }
  }
  return res;
});

let answer = 0;
for (const design of designs) {
  if (search(design)) answer++;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
