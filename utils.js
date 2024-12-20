import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { colors } from 'consola/utils';

/**
 *
 * @returns string
 */
export function getCurrentDay() {
  let file = path.parse(path.dirname(process.argv[1])).name;
  if (!file.match(/^(\d+)/)) {
    file = path.parse(process.argv[1]).name;
  }
  return file.match(/^(\d+)/)?.[0];
}

/**
 *
 * @returns string
 */
export function getRawData() {
  let filename = './input.txt';
  if (process.argv.length > 2) {
    if (
      existsSync(
        path.join(path.dirname(process.argv[1]), process.argv[2] + '.txt')
      )
    )
      filename = process.argv[2] + '.txt';
  }
  let file = path.join(path.dirname(process.argv[1]), filename);

  return readFileSync(file, 'utf8');
}

/**
 *
 * @param {boolean?} removeBlank
 * @returns string[]
 */
export function getDataLines(removeBlank = true) {
  const raw = getRawData();
  let lines = raw.split(/\r?\n/);
  if (removeBlank) {
    lines = lines.filter(Boolean);
  }
  return lines;
}

/**
 *
 * @param {string[]} lines
 * @returns string[][]
 */
export function getGrid(lines) {
  return lines.map((l) => l.split(''));
}

/**
 * Extracts all integer numbers from a given string and returns them as an array of numbers.
 *
 * @param {string} str - The input string containing numbers.
 * @returns {number[]} - An array of numbers extracted from the string.
 */
export function nums(str) {
  return str.match(/-?\d+/g).map(Number);
}

/**
 *
 * @param {any[][]} grid
 * @param {number} x
 * @param {number} y
 * @returns boolean
 */
export function inGridRange(grid, x, y) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

/**
 * @param {any[][]} grid
 */
export const printGrid = (grid, path = null) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (path && inPath(path, [x, y])) line += colors.yellow(grid[y][x]);
      else line += grid[y][x];
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function sum(arr) {
  return arr.reduce((acc, v) => acc + v, 0);
}

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function product(arr) {
  return arr.reduce((acc, v) => acc * v, 1);
}

export function* enumerate(enumerable) {
  let i = 0;
  for (const item of enumerable) yield [i++, item];
}

export function* enumGrid(grid) {
  for (const [y, row] of enumerate(grid)) {
    for (const [x, cell] of enumerate(row)) {
      yield { x, y, row, cell };
    }
  }
}

/** @type {[number, number][]} */
export const directNeighbors = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
/** @type {[number, number][]} */
export const diagNeighbors = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
export const neighbors = [...diagNeighbors, ...directNeighbors];

/**
 * Returns all direct neighbors of (x, y)
 * @param {number} x
 * @param {number} y
 * @returns {[number, number][]}
 */
export function getDirectNeighbors(x, y) {
  return directNeighbors.map(([dx, dy]) => [x + dx, y + dy]);
}

export function chunk(arr, len) {
  arr = [...arr];
  return [...Array(Math.ceil(arr.length / len))].map((_, i) =>
    arr.slice(i * len, (i + 1) * len)
  );
}

const gcd = (x, y) => (!y ? x : gcd(y, x % y));
const _lcm = (x, y) => (x * y) / gcd(x, y);
/**
 *
 * @param {number[]} arr
 * @returns number[]
 */
export const lcm = (arr) => {
  return arr.reduce((a, b) => _lcm(a, b));
};

export function deepEqual(a, b) {
  if (typeof a !== 'object') {
    return a === b;
  }
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([k, v]) => deepEqual(v, b[k]))
  );
}

export function shallowEqual(a, b) {
  if (typeof a !== 'object') {
    return a === b;
  }
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([k, v]) => v === b[k])
  );
}

export function memoize(func, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = resolver.apply(this, args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

export function dist([x1, y1], [x2, y2]) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}

export function manhattan([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export const inPath = (path, [x, y]) =>
  path.some(([i, j]) => i === x && j === y);

export const formatElapsedTime = (elapsed) => {
  const diff = Math.abs(elapsed);

  const minutes = Math.floor(diff / 60 / 1000) % 60;
  const seconds = Math.floor((diff / 1000) % 60);
  const milliseconds = Math.floor(diff % 1000);

  let result = '';
  if (minutes > 0) {
    result += `${minutes.toString().padStart(2, 0)}min `;
  }
  if (seconds > 0) {
    result += `${seconds.toString().padStart(2, 0)}s `;
  }

  return result + `${milliseconds.toString().padEnd(3, 0)}ms`;
};

export const lacet = (path) => {
  let res = 0;
  for (let i = 0; i < path.length; i++) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[(i + 1) % path.length];
    res += x1 * y2 - x2 * y1;
  }
  return Math.abs(res) / 2;
};

/**
 * These ranges are inclusive
 *
 * @param {[number, number][]} ranges
 * @returns
 */
export function mergeRanges(ranges) {
  ranges.sort(([min1], [min2]) => min1 - min2);
  const merged = [ranges[0]];
  for (const [min, max] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (min <= last[1] + 1) {
      last[1] = Math.max(max, last[1]);
    } else {
      merged.push([min, max]);
    }
  }
  return merged;
}

export function zip(...arr) {
  const length = Math.max(...arr.map((a) => a.length));
  return arr.length
    ? Array(length)
        .fill(0)
        .map((_, i) => arr.map((row) => row[i]))
    : [];
}

/**
 * positive remainder
 * @param {number} a first operand
 * @param {number} b operand to divide by
 * @returns {number} positive remainder
 */
export function mod(x, n) {
  return ((x % n) + n) % n;
}

/**
 * Solve two equations with two incognites.
 *  a1 * x + b1 * y = c1
 *  a2 * x + b2 * y = c2
 * @param {number[]} a first equation [a1, b1, c1]
 * @param {number[]} b second equation [a2, b2, c2]
 * @returns {number[]} [x, y]
 */
export function solve2eq2inc([a1, b1, c1], [a2, b2, c2]) {
  const x = (b2 * c1 - b1 * c2) / (b2 * a1 - b1 * a2);
  const y = (c1 - a1 * x) / b1;
  return [x, y];
}

export function isPrime(n) {
  if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
  if (n % 2 == 0) return n == 2;
  if (n % 3 == 0) return n == 3;
  var m = Math.sqrt(n);
  for (var i = 5; i <= m; i += 6) {
    if (n % i == 0) return false;
    if (n % (i + 2) == 0) return false;
  }
  return true;
}