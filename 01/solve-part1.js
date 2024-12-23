import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  nums,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines().map(nums);

const left = lines.map((l) => l[0]).sort((a, b) => a - b);
const right = lines.map((l) => l[1]).sort((a, b) => a - b);

let answer = 0;
for (let i = 0; i < left.length; i++) {
  answer += Math.abs(right[i] - left[i]);
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
