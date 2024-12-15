import { consola } from 'consola';
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

let numbers = getRawData().trim().split(/\s+/).map(Number);

let answer = 0;

const count = memoize((num, times) => {
  if (times === 0) return 1;
  if (num === 0) return count(1, times - 1);
  const str = num.toString();
  const ln = str.length;
  if (ln % 2 === 0) {
    const one = +str.slice(0, ln / 2);
    const two = +str.slice(ln / 2);
    return count(one, times - 1) + count(two, times - 1);
  } else {
    return count(num * 2024, times - 1);
  }
});

for (const num of numbers) {
  answer += count(num, 75);
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
