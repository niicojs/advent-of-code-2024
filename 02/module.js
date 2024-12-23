import { readFileSync } from 'fs';
import { nums } from '../utils.js';

export function getParsedData() {
  const raw = readFileSync('./02/real.txt', 'utf-8');
  return raw.split(/\r?\n/).filter(Boolean).map(nums);
}

export function part1(reports) {
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
    if (safe(report)) answer++;
  }

  // console.log(answer);
}

export function part2(reports) {
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
    if (safe(report)) answer++;
  }

  // console.log(answer);
}
