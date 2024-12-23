import { readFileSync } from 'fs';
import { enumGrid, getGrid, inGridRange } from '../utils.js';

export function getParsedData() {
  return getGrid(
    readFileSync('./08/real.txt', 'utf-8').split(/\r?\n/).filter(Boolean)
  );
}

const key = (x, y) => `${x},${y}`;

export function part1(grid) {
  const antennas = {};
  const antinodes = new Set();

  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '.') continue;
    if (!antennas[cell]) antennas[cell] = [];
    antennas[cell].push([x, y]);
  }

  for (const type in antennas) {
    if (antennas[type].length < 2) continue;
    for (let i = 0; i < antennas[type].length; i++) {
      for (let j = i + 1; j < antennas[type].length; j++) {
        const a1 = antennas[type][i];
        const a2 = antennas[type][j];
        const [dx, dy] = [a1[0] - a2[0], a1[1] - a2[1]];
        const [x1, y1] = [a1[0] + dx, a1[1] + dy];
        const [x2, y2] = [a2[0] - dx, a2[1] - dy];
        if (inGridRange(grid, x1, y1)) antinodes.add(key(x1, y1));
        if (inGridRange(grid, x2, y2)) antinodes.add(key(x2, y2));
      }
    }
  }

  let answer = antinodes.size;

  // console.log(answer);
}

export function part2(grid) {
  const antennas = {};
  const antinodes = new Set();

  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '.') continue;

    if (!antennas[cell]) antennas[cell] = [];
    antennas[cell].push([x, y]);
  }

  for (const type in antennas) {
    if (antennas[type].length < 2) continue;
    for (let i = 0; i < antennas[type].length; i++) {
      for (let j = i + 1; j < antennas[type].length; j++) {
        const [a1, a2] = [antennas[type][i], antennas[type][j]];
        let [dx, dy] = [a1[0] - a2[0], a1[1] - a2[1]];
        let t = 0;
        while (inGridRange(grid, a1[0] + t * dx, a1[1] + t * dy)) {
          antinodes.add(key(a1[0] + t * dx, a1[1] + t * dy));
          t++;
        }
        t = 0;
        while (inGridRange(grid, a2[0] - t * dx, a2[1] - t * dy)) {
          antinodes.add(key(a2[0] - t * dx, a2[1] - t * dy));
          t++;
        }
      }
    }
  }

  let answer = antinodes.size;

  // console.log(answer);
}
