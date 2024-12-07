import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day);

function calculate(t, nums) {
  const todo = [{ val: nums[0], idx: 1 }];
  const max = nums.length - 1;
  while (todo.length > 0) {
    const { val, idx } = todo.shift();
    if (val > t) continue;

    const v = [val * nums[idx], val + nums[idx], +(val + '' + nums[idx])];
    if (idx === max) {
      if (v[0] === t) return true;
      if (v[1] === t) return true;
      if (v[2] === t) return true;
    } else {
      if (v[0] <= t) todo.push({ val: v[0], idx: idx + 1 });
      if (v[1] <= t) todo.push({ val: v[1], idx: idx + 1 });
      if (v[2] <= t) todo.push({ val: v[2], idx: idx + 1 });
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
  if (i % 4 === 0) consola.log(((i / lines.length) * 100).toFixed(2) + '%');
}

consola.success('result', answer, answer === 189207836795655);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
// await submit({ day, level: 1, answer: answer });
consola.success('Done.');
