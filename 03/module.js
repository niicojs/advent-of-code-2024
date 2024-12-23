import { readFileSync } from 'fs';

export function getParsedData() {
  const raw = readFileSync('./03/real.txt', 'utf-8');
  return raw.trim();
}

export function part1(data) {
  let answer = 0;
  const all = data.matchAll(/mul\((\d+)\,(\d+)\)/g);
  for (const m of all) {
    answer += +m[1] * +m[2];
  }

  // console.log(answer);
}

export function part2(data) {
  let answer = 0;
  let ok = true;
  const all = data.matchAll(/(mul\((\d+)\,(\d+)\))|(do\(\))|(don\'t\(\))/g);
  for (const m of all) {
    if (m[0] === 'do()') ok = true;
    else if (m[0] === "don't()") ok = false;
    else if (ok) answer += +m[2] * +m[3];
  }

  // console.log(answer);
}
