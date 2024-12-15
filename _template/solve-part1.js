import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  getRawData,
  nums,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const raw = getRawData();
const lines = getDataLines();
const grid = getGrid(getDataLines());
const values = getDataLines().map(nums);

let answer = 0;

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
