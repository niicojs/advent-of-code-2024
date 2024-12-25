import { consola } from 'consola';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const reports = getDataLines().map(nums);

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
consola.success('Done in', t.format());
