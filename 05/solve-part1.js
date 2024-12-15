import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(false);

const cmpmap = {};
let i = 0;
do {
  const [a, b] = lines[i].split('|').map(Number);
  cmpmap[`${a},${b}`] = true;
} while (lines[++i]);
i++;

function check(pages) {
  for (let x = 0; x < pages.length - 1; x++) {
    if (!cmpmap[`${pages[x]},${pages[x + 1]}`]) {
      return false;
    }
  }
  return true;
}

let answer = 0;

do {
  const pages = lines[i].split(',').map(Number);
  if (check(pages)) {
    const middle = pages[Math.floor(pages.length / 2)];
    answer += middle;
  }
} while (++i < lines.length);

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
