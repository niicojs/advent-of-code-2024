import { readFileSync } from 'fs';
import { nums } from '../utils.js';

export function getParsedData() {
  const raw = readFileSync('./01/real.txt', 'utf-8');
  const data = raw.split(/\r?\n/).filter(Boolean).map(nums);
  const left = data.map((l) => l[0]);
  const right = data.map((l) => l[1]);
  return { left, right };
}

export function part1(data) {
  const left = data.left.sort((a, b) => a - b);
  const right = data.right.sort((a, b) => a - b);
  let answer = 0;
  for (let i = 0; i < left.length; i++) {
    answer += Math.abs(right[i] - left[i]);
  }
  // console.log(answer);
}

export function part2(data) {
  const { left, right } = data;
  const rightmap = new Map();
  for (let i = 0; i < right.length; i++) {
    rightmap.set(right[i], (rightmap.get(right[i]) || 0) + 1);
  }

  let answer = 0;
  for (let i = 0; i < left.length; i++) {
    answer += left[i] * (rightmap.get(left[i]) || 0);
  }

  // console.log(answer);
}
