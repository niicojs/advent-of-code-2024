import 'dotenv/config';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { consola } from 'consola';
import { getData } from './aoc.js';

const day = new Date().getDate().toString().padStart(2, '0');

const arg = process.argv[2];
if (arg === 'part2') {
  consola.start('init part 2 pour', day);
  const submit1 = 'await submit({ day, level: 1, answer: answer });';
  const submit2 = 'await submit({ day, level: 2, answer: answer });';
  let content = readFileSync(`./${day}/solve-part1.js`, 'utf8');
  content = content.replace(submit1, submit2);
  writeFileSync(`./${day}/solve-part2.js`, content, 'utf8');
} else {
  consola.start("récupération de l'input pour le jour", day);
  getData({ day });
}

consola.success('done.');
