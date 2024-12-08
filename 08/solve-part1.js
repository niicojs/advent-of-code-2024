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

export const printGrid = (grid) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (antinodes.has(key(x, y))) line += '#';
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
