import { readFileSync } from 'fs';

export function getParsedData() {
  return readFileSync('./07/real.txt', 'utf-8').split(/\r?\n/).filter(Boolean);
}

export function part1(lines) {
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

  // console.log(answer);
}

export function part2(lines) {
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

  // console.log(answer);
}
