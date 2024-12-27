import { existsSync } from 'fs';
import { formatElapsedTime, sum, timer } from './utils.js';

console.log('Load modules...');
const t = timer();
const puzzles = Array(26).fill(null);
const times = Array(26).fill(null);
for (let i = 1; i <= 25; i++) {
  const file = `./${i.toString().padStart(2, '0')}/module.js`;
  if (existsSync(file)) puzzles[i] = await import(file);
}
console.log('  done in', t.format());

console.log('Load data...');
t.start();
const data = Array(26).fill(null);
for (let i = 1; i <= 25; i++) {
  if (puzzles[i]) data[i] = puzzles[i].getParsedData();
}
console.log('  done in', t.format());

console.log('Run puzzles...');
t.start();
let count = 0;
const it = timer();

for (let i = 1; i <= 25; i++) {
  if (puzzles[i]) {
    count++;
    it.start();
    // puzzles[i].part1(data[i]);
    puzzles[i].part2(data[i]);
    times[i] = it.elapsed();
  }
}

console.log('  done in', t.format());

const max = { p: 0, t: 0n };
for (let i = 1; i <= 25; i++) {
  if (times[i] !== null && times[i] > max.t) {
    max.p = i;
    max.t = times[i];
  }
}
const strmax = formatElapsedTime(Number(max.t / 1_000_000n));
const ftimes = times.filter(Boolean).map((t) => Number(t / 1_000_000n));
const meantime = sum(ftimes) / ftimes.length;

console.log('  mean time', formatElapsedTime(meantime));
console.log('  max time', strmax, 'for puzzle', max.p);
console.log('  ', count, 'puzzles done');

const heights = times
  .slice(1)
  .map((time) => (time === null ? 0 : Number((5n * time) / max.t)));

console.log('┌───────────────────────────┐');
console.log('│ ' + heights.map((h) => (h >= 5 ? '#' : ' ')).join('') + ' │');
console.log('│ ' + heights.map((h) => (h >= 4 ? '#' : ' ')).join('') + ' │');
console.log('│ ' + heights.map((h) => (h >= 3 ? '#' : ' ')).join('') + ' │');
console.log('│ ' + heights.map((h) => (h >= 2 ? '#' : ' ')).join('') + ' │');
console.log('│ ' + heights.map((h) => (h >= 1 ? '#' : ' ')).join('') + ' │');
console.log('│ ' + heights.map((h) => (h >= 0 ? '#' : ' ')).join('') + ' │');
console.log('│          1111111111222222 │');
console.log('│ 1234567890123456789012345 │');
console.log('└───────────────────────────┘');
