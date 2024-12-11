import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getRawData, sum } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

let numbers = getRawData(day).trim().split(/\s+/);
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
consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
