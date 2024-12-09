import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getRawData } from '../utils.js';
import Heap from 'heap';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const raw = getRawData(day).split('').map(Number);

const data = new Heap((a, b) => b.idx - a.idx);
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

while (free.length > 0) {
  const f = free.at(0);
  const d = data.pop();
  if (d.idx + d.size < f.idx) {
    free.shift();
    data.push(d);
  } else if (d.size < f.size) {
    d.idx = f.idx;
    f.idx += d.size;
    f.size -= d.size;
    data.push(d);
  } else {
    data.push({ idx: f.idx, size: f.size, id: d.id });
    d.size -= f.size;
    if (d.size > 0) data.push(d);
    free.shift();
  }
}

let answer = 0;
const result = data.toArray();
for (const d of result) {
  for (let i = 0; i < d.size; i++) {
    answer += (d.idx + i) * d.id;
  }
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
