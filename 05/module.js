import { readFileSync } from 'fs';
import { nums } from '../utils.js';

export function getParsedData() {
  const [one, two] = readFileSync('./05/real.txt', 'utf-8')
    .trim()
    .split(/\r?\n\r?\n/);
  const rules = one.split(/\r?\n/).map(nums);
  const updates = two.split(/\r?\n/).map(nums);
  return { rules, updates };
}

export function part1({ rules, updates }) {
  const cmpmap = {};
  for (const [a, b] of rules) {
    cmpmap[`${a},${b}`] = true;
  }

  function check(pages) {
    for (let x = 0; x < pages.length - 1; x++) {
      if (!cmpmap[`${pages[x]},${pages[x + 1]}`]) {
        return false;
      }
    }
    return true;
  }

  let answer = 0;
  for (const pages of updates) {
    if (check(pages)) {
      const middle = pages[Math.floor(pages.length / 2)];
      answer += middle;
    }
  }

  // console.log(answer);
}

export function part2({ rules, updates }) {
  const cmpmap = {};
  for (const [a, b] of rules) {
    cmpmap[`${a},${b}`] = true;
  }

  function check(pages) {
    for (let x = 0; x < pages.length - 1; x++) {
      if (!cmpmap[`${pages[x]},${pages[x + 1]}`]) {
        return false;
      }
    }
    return true;
  }

  let answer = 0;
  for (const pages of updates) {
    if (!check(pages)) {
      pages.sort((a, b) => (cmpmap[`${a},${b}`] ? -1 : 1));
      const middle = pages[Math.floor(pages.length / 2)];
      answer += middle;
    }
  }

  // console.log(answer);
}
