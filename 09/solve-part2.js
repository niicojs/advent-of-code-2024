import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getRawData } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const raw = getRawData().split('').map(Number);

const data = [];
const free = [];

let idx = 0;
for (let i = 0; i < raw.length; i++) {
  if (raw[i] === 0) continue;
  if (i % 2 === 0) {
    data.push({ idx, size: raw[i], id: i / 2 });
  } else {
    free.push({ idx, size: raw[i] });
  }
  idx += raw[i];
}

for (let i = data.length - 1; i >= 0; i--) {
  const d = data[i];
  for (let j = 0; j < free.length; j++) {
    const f = free[j];
    if (f.size >= d.size && f.idx <= d.idx) {
      d.idx = f.idx;
      f.idx += d.size;
      f.size -= d.size;
      break;
    }
  }
}

let answer = 0;
for (const d of data) {
  for (let i = 0; i < d.size; i++) {
    answer += (d.idx + i) * d.id;
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
