import { consola } from 'consola';
import clipboard from 'clipboardy';
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

const possible = [];
const connections = new Map();
const edges = getDataLines();
for (const edge of edges) {
  const [from, to] = edge.split('-');
  if (!connections.has(from)) connections.set(from, []);
  if (!connections.has(to)) connections.set(to, []);
  connections.get(from).push(to);
  connections.get(to).push(from);
  if (from.at(0) === 't') possible.push(from);
  if (to.at(0) === 't') possible.push(to);
}

const ok = new Set();
for (const node of possible) {
  const candidate = new Set(connections.get(node));
  for (const c of candidate) {
    if (c === node) continue;
    for (const c2 of connections.get(c)) {
      if (c2 === node || c2 === c) continue;
      if (connections.get(c2).includes(node)) {
        ok.add([node, c, c2].sort().join('-'));
      }
    }
  }
}

let answer = ok.size;

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
clipboard.writeSync(answer?.toString());
