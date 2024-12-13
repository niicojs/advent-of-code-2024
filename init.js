import 'dotenv/config';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { consola } from 'consola';
import { getData } from './aoc.js';

const day = new Date().getDate().toString().padStart(2, '0');

const arg = process.argv[2];
if (arg === 'part2') {
  consola.start('init part 2 pour', day);
  if (!existsSync(`./${day}/solve-part2.js`)) {
    const submit1 = 'await submit({ day, level: 1, answer: answer });';
    const submit2 = 'await submit({ day, level: 2, answer: answer });';
    let content = readFileSync(`./${day}/solve-part1.js`, 'utf8');
    content = content.replace(submit1, submit2);
    writeFileSync(`./${day}/solve-part2.js`, content, 'utf8');
  }
  if (!existsSync(`./${day}/real.txt`)) getData({ day });
} else {
  consola.start("récupération de l'input pour le jour", day);
  if (!existsSync(`./${day}`)) {
    mkdirSync(`./${day}`);
    copyFileSync(`./_template/solve-part1.js`, `./${day}/solve-part1.js`);
    copyFileSync(`./_template/input.txt`, `./${day}/input.txt`);
  }
  getData({ day });
}

consola.success('done.');
