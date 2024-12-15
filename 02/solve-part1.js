import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const reports = getDataLines().map((l) => l.split(/\s+/).map(Number));

function safe(report) {
  const incr = report.at(0) < report.at(1);
  for (let i = 0; i < report.length - 1; i++) {
    if (report[i] === report[i + 1]) return false;
    if (Math.abs(report[i] - report[i + 1]) > 3) return false;
    if (
      (incr && report[i] > report[i + 1]) ||
      (!incr && report[i] < report[i + 1])
    )
      return false;
  }
  return true;
}

let answer = 0;
for (let i = 0; i < reports.length; i++) {
  const report = reports[i];
  consola.log(i, safe(report), report);
  if (safe(report)) answer++;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
// await submit({ day, level: 1, answer: answer });
consola.success('Done.');
