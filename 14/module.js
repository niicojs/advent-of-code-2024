import { readFileSync } from 'fs';
import { nums, mod, product, dist } from '../utils.js';
import { mean } from 'remeda';

export function getParsedData() {
  const lines = readFileSync('./14/real.txt', 'utf-8')
    .split(/\r?\n/)
    .filter(Boolean);
  return lines.map(nums);
}

export function part1(lines) {
  let tall = 103;
  let wide = 101;

  const robots = [];
  for (const [x, y, dx, dy] of lines) {
    robots.push({ pos: [x, y], speed: [dx, dy] });
  }

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
      const [left, right] = [
        x < Math.floor(wide / 2),
        x > Math.floor(wide / 2),
      ];
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

  // console.log(answer);
}

export function part2(lines) {
  let tall = 103;
  let wide = 101;

  const robots = [];
  for (const [x, y, dx, dy] of lines) {
    robots.push({ pos: [x, y], speed: [dx, dy] });
  }

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
      // print();
    }
    i++;
    move();
  }

  let answer = best;

  // console.log(answer);
}
