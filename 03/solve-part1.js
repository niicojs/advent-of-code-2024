import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getRawData } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const data = getRawData();

let answer = 0;
const all = data.matchAll(/mul\((\d+)\,(\d+)\)/g);
for (const m of all) {
  console.log(m[1], m[2]);
  answer += +m[1] * +m[2];
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
