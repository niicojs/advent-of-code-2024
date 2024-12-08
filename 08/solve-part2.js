import { consola } from 'consola';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const key = (x, y) => `${x},${y}`;

const antennas = {};
const antinodes = new Set();

const grid = getGrid(getDataLines(day));
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '.') continue;

  if (!antennas[cell]) antennas[cell] = [];
  antennas[cell].push([x, y]);
}

let answer = 0;

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

export const printGrid = (grid) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (antinodes.has(key(x, y))) line += 'X';
      else line += grid[y][x];
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

printGrid(grid);

answer = antinodes.size;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
consola.success('Done.');
