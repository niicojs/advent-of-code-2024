import { readFileSync } from 'fs';
import { nums, sum } from '../utils.js';

export function getParsedData() {
  return nums(readFileSync('./11/real.txt', 'utf-8'));
}

export function part1(numbers) {
  let map = {};
  for (let i = 0; i < numbers.length; i++) {
    map[numbers[i]] = 1 + (map[numbers[i]] || 0);
  }

  function blink(data) {
    const result = {};
    for (const str in data) {
      const d = +str;
      if (d === 0) {
        result[1] = data[str] + (result[1] || 0);
      } else if (str.length % 2 === 0) {
        const one = +str.slice(0, str.length / 2);
        const two = +str.slice(str.length / 2);
        result[one] = data[str] + (result[one] || 0);
        result[two] = data[str] + (result[two] || 0);
      } else {
        result[d * 2024] = data[str] + (result[d * 2024] || 0);
      }
    }
    return result;
  }

  for (let i = 0; i < 25; i++) map = blink(map);

  const answer = sum(Object.values(map));
  // console.log(answer);
}

export function part2(numbers) {
  let map = {};
  for (let i = 0; i < numbers.length; i++) {
    map[numbers[i]] = 1 + (map[numbers[i]] || 0);
  }

  function blink(data) {
    const result = {};
    for (const str in data) {
      const d = +str;
      if (d === 0) {
        result[1] = data[str] + (result[1] || 0);
      } else if (str.length % 2 === 0) {
        const one = +str.slice(0, str.length / 2);
        const two = +str.slice(str.length / 2);
        result[one] = data[str] + (result[one] || 0);
        result[two] = data[str] + (result[two] || 0);
      } else {
        result[d * 2024] = data[str] + (result[d * 2024] || 0);
      }
    }
    return result;
  }

  for (let i = 0; i < 75; i++) map = blink(map);

  const answer = sum(Object.values(map));
  // console.log(answer);
}
