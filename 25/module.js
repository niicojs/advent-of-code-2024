import { readFileSync } from 'fs';
import { getGrid } from '../utils.js';

export function getParsedData() {
  return readFileSync('./25/real.txt', 'utf-8')
    .trim()
    .split(/\r?\n\r?\n/);
}

export function part1(data) {
  let locksize = 0;
  const locks = [];
  const keys = [];

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

  // console.log(answer);
}

export function part2(data) {
  return part1(data);
}
