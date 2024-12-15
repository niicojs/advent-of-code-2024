import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getRawData } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const data = getRawData();

let answer = 0;
let ok = true;
const all = data.matchAll(/(mul\((\d+)\,(\d+)\))|(do\(\))|(don\'t\(\))/g);
for (const m of all) {
  if (m[0] === 'do()') ok = true;
  else if (m[0] === "don't()") ok = false;
  else if (ok) {
    console.log(m[2], m[3]);
    answer += +m[2] * +m[3];
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
