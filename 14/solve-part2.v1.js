import { consola } from 'consola';
import { mean } from 'remeda';
import {
  dist,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  printGrid,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

let tall = 7;
let wide = 11;
if (process.argv[2] === 'real') {
  tall = 103;
  wide = 101;
}

const robots = [];
const lines = getDataLines().map((l) => l.match(/(-?\d+)/g).map(Number));

for (const [x, y, dx, dy] of lines) {
  robots.push({ pos: [x, y], speed: [dx, dy] });
}

function print() {
  const grid = Array(tall)
    .fill(0)
    .map((_) => Array(wide).fill('.'));

  for (const robot of robots) {
    const [x, y] = robot.pos;
    grid[y][x] = '#';
  }
  printGrid(grid);
}

const mod = (x, n) => ((x % n) + n) % n;

function move(time = 1) {
  for (const robot of robots) {
    const [x, y] = robot.pos;
    const [dx, dy] = robot.speed;
    robot.pos = [mod(x + dx * time, wide), mod(y + dy * time, tall)];
  }
}

function check(i) {
  const first = robots.at(0);
  return mean(robots.slice(1).map((robot) => dist(first.pos, robot.pos)));
}

let i = 0;
let mincheck = Infinity;
let best = 0;
while (i <= wide * tall) {
  const c = check(i);
  if (c < mincheck) {
    mincheck = c;
    best = i;
    print();
  }
  i++;
  move();
}

let answer = best;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
