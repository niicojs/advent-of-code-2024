import { readFileSync } from 'fs';
import { memoize, shallowEqual } from '../utils.js';

export function getParsedData() {
  return readFileSync('./21/real.txt', 'utf-8').trim().split(/\r?\n/);
}

const keypos = {
  7: [0, 0],
  8: [1, 0],
  9: [2, 0],
  4: [0, 1],
  5: [1, 1],
  6: [2, 1],
  1: [0, 2],
  2: [1, 2],
  3: [2, 2],
  nope: [0, 3],
  0: [1, 3],
  A: [2, 3],
};

const dirpos = {
  nope: [0, 0],
  '^': [1, 0],
  A: [2, 0],
  '<': [0, 1],
  v: [1, 1],
  '>': [2, 1],
};

const possibletypes = memoize(([sx, sy], [tx, ty], nope) => {
  if (sx === tx && sy === ty) return [['A']];
  let possible = [];
  if (sy < ty && !shallowEqual(nope, [sx, sy + 1])) {
    possible.push(
      ...possibletypes([sx, sy + 1], [tx, ty], nope).map((m) => ['v', ...m])
    );
  }
  if (sy > ty && !shallowEqual(nope, [sx, sy - 1])) {
    possible.push(
      ...possibletypes([sx, sy - 1], [tx, ty], nope).map((m) => ['^', ...m])
    );
  }
  if (sx < tx && !shallowEqual(nope, [sx + 1, sy])) {
    possible.push(
      ...possibletypes([sx + 1, sy], [tx, ty], nope).map((m) => ['>', ...m])
    );
  }
  if (sx > tx && !shallowEqual(nope, [sx - 1, sy])) {
    possible.push(
      ...possibletypes([sx - 1, sy], [tx, ty], nope).map((m) => ['<', ...m])
    );
  }
  return possible;
});

const precompute = (poses) => {
  const path = {};
  for (const [from, pfrom] of Object.entries(poses)) {
    for (const [to, pto] of Object.entries(poses)) {
      path[from + ',' + to] = possibletypes(pfrom, pto, poses['nope']);
    }
  }
  return path;
};

function solve(lines, nb_layer) {
  const keypath = precompute(keypos);
  const dirpath = precompute(dirpos);

  const typedir = memoize((from, to, layer) => {
    let possibles = dirpath[from + ',' + to];
    if (layer === 1) return possibles.at(0).length;

    let res = Infinity;
    let cur = 'A';
    for (const p of possibles) {
      let ln = 0;
      for (const k of p) {
        ln += typedir(cur, k, layer - 1);
        cur = k;
      }
      if (ln < res) res = ln;
    }

    return res;
  });

  const typedigit = memoize((from, to) => {
    let possibles = keypath[from + ',' + to];

    let res = Infinity;
    let cur = 'A';
    for (const p of possibles) {
      let ln = 0;
      for (const k of p) {
        ln += typedir(cur, k, nb_layer);
        cur = k;
      }
      if (ln < res) res = ln;
    }

    return res;
  });

  let answer = 0;
  for (const line of lines) {
    let pos = 'A';
    let ln = 0;
    for (let i = 0; i < line.length; i++) {
      const res = typedigit(pos, line[i]);
      ln += res;
      pos = line[i];
    }

    answer += +line.replace('A', '') * ln;
  }

  return answer;
}

export function part1(lines) {
  const answer = solve(lines, 2);
  // console.log(answer);
}

export function part2(lines) {
  const answer = solve(lines, 25);
  // console.log(answer);
}
