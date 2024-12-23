import { readFileSync } from 'fs';
import { memoize } from '../utils.js';

export function getParsedData() {
  const [one, two] = readFileSync('./19/real.txt', 'utf-8')
    .trim()
    .split(/\r?\n\r?\n/);
  const towels = one.split(', ');
  const designs = two.split(/\r?\n/);
  return { towels, designs };
}

export function part1({ towels, designs }) {
  const bystart = {};
  for (const t of towels) {
    if (!bystart[t.at(0)]) bystart[t.at(0)] = [];
    bystart[t.at(0)].push(t);
  }

  const search = memoize((design) => {
    if (design.length === 0) return 1;
    const first = design.at(0);
    if (!bystart[first]) return 0;
    let res = 0;
    for (const towel of bystart[first]) {
      if (design.length >= towel.length && design.startsWith(towel)) {
        res += search(design.slice(towel.length));
      }
    }
    return res;
  });

  let answer = 0;
  for (const design of designs) {
    if (search(design)) answer++;
  }

  // console.log(answer);
}

export function part2({ towels, designs }) {
  const bystart = {};
  for (const t of towels) {
    if (!bystart[t.at(0)]) bystart[t.at(0)] = [];
    bystart[t.at(0)].push(t);
  }

  const search = memoize((design) => {
    if (design.length === 0) return 1;
    const first = design.at(0);
    if (!bystart[first]) return 0;
    let res = 0;
    for (const towel of bystart[first]) {
      if (design.length >= towel.length && design.startsWith(towel)) {
        res += search(design.slice(towel.length));
      }
    }
    return res;
  });

  let answer = 0;
  for (const design of designs) {
    answer += search(design);
  }

  // console.log(answer);
}
