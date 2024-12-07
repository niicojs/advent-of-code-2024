import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day);

function calculate(t, numbers) {
  const todo = [{ val: numbers[0], nums: numbers.slice(1) }];
  while (todo.length > 0) {
    const { val, nums } = todo.shift();
    if (val > t) continue;

    if (nums.length === 0 && val === t) {
      return true;
    } else if (nums.length === 1) {
      let v = val * nums[0];
      if (v === t) return true;
      v = val + nums[0];
      if (v === t) return true;
      v = +(val + '' + nums[0]);
      if (v === t) return true;
    } else if (nums.length > 1) {
      if (val * nums[0] <= t)
        todo.push({ val: val * nums[0], nums: nums.slice(1) });
      if (val + nums[0] <= t)
        todo.push({ val: val + nums[0], nums: nums.slice(1) });
      if (+(val + '' + nums[0]) <= t)
        todo.push({ val: +(val + '' + nums[0]), nums: nums.slice(1) });
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
  consola.log(((i / lines.length) * 100).toFixed(2) + '%');
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
// await submit({ day, level: 1, answer: answer });
consola.success('Done.');
