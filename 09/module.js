import { readFileSync } from 'fs';
import TinyQueue from 'tinyqueue';

export function getParsedData() {
  return readFileSync('./09/real.txt', 'utf-8').trim().split('').map(Number);
}

export function part1(raw) {
  const data = new TinyQueue([], (a, b) => b.idx - a.idx);
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
  while (data.length > 0) {
    const d = data.pop();
    for (let i = 0; i < d.size; i++) {
      answer += (d.idx + i) * d.id;
    }
  }

  // console.log(answer);
}

export function part2(raw) {
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

  // console.log(answer);
}
