import { existsSync } from 'fs';
import { formatElapsedTime } from './utils.js';

console.log('Load modules...');
const puzzles = Array(26).fill(null);
for (let i = 1; i <= 25; i++) {
  const file = `./${i.toString().padStart(2, '0')}/module.js`;
  if (existsSync(file)) puzzles[i] = await import(file);
}

console.log('Load data...');
const data = Array(26).fill(null);
for (let i = 1; i <= 25; i++) {
  if (puzzles[i]) data[i] = puzzles[i].getParsedData();
}

console.log('Run puzzles...');
let count = 0;
const begin = new Date().getTime();
for (let i = 1; i <= 25; i++) {
  if (puzzles[i]) {
    count++;
    // puzzles[i].part1(data[i]);
    puzzles[i].part2(data[i]);
  }
}

console.log('Done in', formatElapsedTime(begin - new Date().getTime()));
console.log(count, 'puzzles done');
