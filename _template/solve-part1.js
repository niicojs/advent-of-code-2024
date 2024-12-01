import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day);
consola.log(lines);

const answer = 0;


consola.warn('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
// await submit({ day, level: 1, answer: answer });
consola.success('Done.');
