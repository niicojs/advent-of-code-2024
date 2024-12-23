import { readFileSync } from 'fs';
import { nums, mod } from '../utils.js';

export function getParsedData() {
  return readFileSync('./22/real.txt', 'utf-8').trim().split(/\r?\n/).map(nums);
}

export function part1(values) {
  const mix = (val, secret) => val ^ secret;
  const prune = (val) => mod(val, 16777216);

  const nextsecret = (secret) => {
    let val = prune(mix(secret * 64, secret));
    val = prune(mix(Math.floor(val / 32), val));
    val = prune(mix(val * 2048, val));
    return val;
  };

  let answer = 0;
  for (let v of values) {
    for (let i = 0; i < 2000; i++) {
      v = nextsecret(v);
    }
    answer += v;
  }
  // console.log(answer);
}

export function part2(values) {
  const nextsecret = (secret) => {
    let val = mod((secret * 64) ^ secret, 16777216);
    val = mod(Math.floor(val / 32) ^ val, 16777216);
    val = mod((val * 2048) ^ val, 16777216);
    return val;
  };

  const key = (a, b, c, d) => `${a},${b},${c},${d}`;

  const changes = new Map();

  for (let [buyers, v] of values.entries()) {
    let rolling = [0, 0, 0, 0];
    let p = v % 10;
    for (let i = 0; i < 2000; i++) {
      v = nextsecret(v);
      let diff = (v % 10) - p;
      p = v % 10;
      rolling.push(diff);
      rolling.shift();
      if (i > 3) {
        const k = key(...rolling);
        if (!changes.has(k)) changes.set(k, Array(values.length).fill(null));
        const r = changes.get(k);
        if (r[buyers] === null) r[buyers] = p;
      }
    }
  }

  let answer = 0;
  for (const vals of changes.values()) {
    const gain = vals.reduce((acc, c) => acc + (c || 0), 0);
    if (gain > answer) answer = gain;
  }
  // console.log(answer);
}
