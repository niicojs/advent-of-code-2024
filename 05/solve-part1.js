import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getRawData,
  nums,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);
const rules = one.split(/\r?\n/).map(nums);
const updates = two.split(/\r?\n/).map(nums);

const cmpmap = {};
for (const [a, b] of rules) {
  cmpmap[`${a},${b}`] = true;
}

function check(pages) {
  for (let x = 0; x < pages.length - 1; x++) {
    if (!cmpmap[`${pages[x]},${pages[x + 1]}`]) {
      return false;
    }
  }
  return true;
}

let answer = 0;
for (const pages of updates) {
  if (check(pages)) {
    const middle = pages[Math.floor(pages.length / 2)];
    answer += middle;
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
