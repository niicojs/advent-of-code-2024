import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines();

function calculate(target, nums) {
  const left = nums.slice(0, -1);
  const last = nums.at(-1);
  if (nums.length === 1) return last === target;
  if (target % last === 0 && calculate(target / last, left)) return true;
  if (target > last && calculate(target - last, left)) return true;
  const tstr = target.toString();
  const numstr = last.toString();
  if (tstr.endsWith(numstr)) {
    const rem = tstr.slice(0, -numstr.length);
    return calculate(+rem, left);
  }
  return false;
}

let answer = 0;

for (let i = 0; i < lines.length; i++) {
  const [a, b] = lines[i].split(': ');
  const target = +a;
  const possible = b.split(' ').map(Number);
  if (calculate(target, possible)) {
    answer += target;
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
