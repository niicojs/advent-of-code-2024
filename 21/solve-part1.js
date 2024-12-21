import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  memoize,
  shallowEqual,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

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

const keypath = precompute(keypos);
const dirpath = precompute(dirpos);

const typecodes = memoize((current, inputs, paths) => {
  let possibles = [[]];
  for (const input of inputs) {
    const path = paths[current + ',' + input];
    let newpossibles = [];
    for (const p of possibles) {
      for (const pa of path) {
        newpossibles.push(p.concat(pa));
      }
    }
    possibles = newpossibles;
    current = input;
  }
  return possibles;
});

const lines = getDataLines();

let answer = 0;
for (const line of lines) {
  let all = {};
  let best = Infinity;

  let possible = typecodes('A', line.split(''), keypath);
  for (let p of possible) {
    all[p.join('')] = p.length;
    if (p.length < best) best = p.length;
  }

  for (let i = 0; i < 2; i++) {
    possible = [];
    for (const m of Object.keys(all)) {
      if (all[m] !== best) continue;
      const moves = typecodes('A', m.split(''), dirpath);
      if (possible.length === 0 || moves.at(0).length < possible.at(0).length) {
        possible = moves;
      } else if (moves.at(0).length === possible.at(0).length) {
        possible = possible.concat(moves);
      }
    }
    all = {};
    best = Infinity;
    for (let p of possible) {
      all[p.join('')] = p.length;
      if (p.length < best) best = p.length;
    }
  }

  // consola.info(line, best, +line.replace('A', '') * best);
  answer += +line.replace('A', '') * best;
}

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
clipboard.writeSync(answer?.toString());
