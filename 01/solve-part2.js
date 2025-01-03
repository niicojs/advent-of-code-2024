import { consola } from 'consola';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines().map(nums);

const left = lines.map((l) => l[0]);
const right = lines.map((l) => l[1]);
const rightmap = new Map();
for (let i = 0; i < right.length; i++) {
  rightmap.set(right[i], (rightmap.get(right[i]) || 0) + 1);
}

let answer = 0;
for (let i = 0; i < left.length; i++) {
  answer += left[i] * (rightmap.get(left[i]) || 0);
}

consola.success('result', answer);
consola.success('Done in', t.format());
