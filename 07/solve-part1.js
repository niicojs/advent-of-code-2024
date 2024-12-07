import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day);

function calculate(t, numbers) {
  const todo = [{ val: numbers[0], nums: numbers.slice(1) }];
  while (todo.length > 0) {
    const { val, nums } = todo.shift();
    if (nums.length === 0 && val === t) {
      return true;
    } else if (nums.length > 0) {
      todo.push({ val: val * nums[0], nums: nums.slice(1) });
      todo.push({ val: val + nums[0], nums: nums.slice(1) });
    }
  }
  return false;
}

let answer = 0;
for (let i = 0; i < lines.length; i++) {
  const [a, b] = lines[i].split(':');
  const target = +a;
  const possible = b.split(' ').filter(Boolean).map(Number);
  if (calculate(target, possible)) {
    answer += target;
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
