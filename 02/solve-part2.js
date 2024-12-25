import { consola } from 'consola';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const reports = getDataLines().map(nums);

function safe(report, strict = false) {
  if (report[0] === report[1]) {
    if (strict) return false;
    else return safe(report.slice(1), true);
  }

  const incr = report[0] < report[1];
  for (let i = 0; i < report.length - 1; i++) {
    if (
      report[i] === report[i + 1] ||
      Math.abs(report[i] - report[i + 1]) > 3 ||
      (incr && report[i] > report[i + 1]) ||
      (!incr && report[i] < report[i + 1])
    )
      if (strict) return false;
      else
        return (
          safe(report.slice(0, i - 1).concat(report.slice(i)), true) ||
          safe(report.slice(0, i + 1).concat(report.slice(i + 2)), true) ||
          safe(report.slice(0, i).concat(report.slice(i + 1)), true)
        );
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
