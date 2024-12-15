import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  product,
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

const mod = (x, n) => ((x % n) + n) % n;

function move(time) {
  for (const robot of robots) {
    const [x, y] = robot.pos;
    const [dx, dy] = robot.speed;
    robot.pos = [mod(x + dx * time, wide), mod(y + dy * time, tall)];
  }
}

function split() {
  const quads = [0, 0, 0, 0];
  for (const robot of robots) {
    const [x, y] = robot.pos;
    const [left, right] = [x < Math.floor(wide / 2), x > Math.floor(wide / 2)];
    const [up, down] = [y < Math.floor(tall / 2), y > Math.floor(tall / 2)];

    if (left && up) quads[0]++;
    if (right && up) quads[1]++;
    if (right && down) quads[2]++;
    if (left && down) quads[3]++;
  }
  return quads;
}

move(100);
let answer = product(split());

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
