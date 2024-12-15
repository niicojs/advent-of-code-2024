import { consola } from 'consola';
import {
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

const mod = (x, n) => ((x % n) + n) % n;

function move(time = 1) {
  for (const robot of robots) {
    const [x, y] = robot.pos;
    const [dx, dy] = robot.speed;
    robot.pos = [mod(x + dx * time, wide), mod(y + dy * time, tall)];
  }
}

const overlap = () => {
  return (
    new Set(robots.map((r) => `${r.pos[0]},${r.pos[1]}`)).size !== lines.length
  );
};

let answer = 0;
do {
  move();
  answer++;
} while (overlap());

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
