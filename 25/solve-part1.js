import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getGrid,
  getRawData,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const locks = [];
const keys = [];
const data = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

let locksize = 0;

for (const d of data) {
  const schema = d.split(/\r?\n/);
  const grid = getGrid(schema);
  if (locksize === 0) locksize = grid.length;
  const vals = [];
  for (let i = 0; i < grid[0].length; i++) {
    let v = 0;
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === '#') v++;
    }
    vals.push(v);
  }
  if (schema.at(0).startsWith('###')) locks.push(vals);
  else keys.push(vals);
}

function check(lock, key) {
  for (let x = 0; x < lock.length; x++) {
    if (lock[x] + key[x] > locksize) return false;
  }
  return true;
}

let answer = 0;
for (const lock of locks) {
  for (const key of keys) {
    if (check(lock, key)) answer++;
  }
}

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
clipboard.writeSync(answer?.toString());
