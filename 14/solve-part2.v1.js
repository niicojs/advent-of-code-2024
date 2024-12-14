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
const lines = getDataLines(day).map((l) => l.match(/(-?\d+)/g).map(Number));

for (const [x, y, dx, dy] of lines) {
  robots.push({ pos: [x, y], speed: [dx, dy] });
}

const mod = (x, n) => ((x % n) + n) % n;

function move(time) {
  for (const robot of robots) {
    const [x, y] = robot.pos;
    const [dx, dy] = robot.speed;
    robot.pos = [mod(x + dx * time, wide), mod(y + dy * time, tall)];
  }
}

let mincheck = Infinity;
function check(i) {
  const first = robots.at(0);
  const m = mean(robots.slice(1).map((robot) => dist(first.pos, robot.pos)));
  if (m < mincheck) {
    mincheck = m;
    consola.log(i);
    print();
  }
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

let i = 0;
while (true) {
  check(i++);
  move(1);
}

let answer = 0;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
