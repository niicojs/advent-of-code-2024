import { consola } from 'consola';
import clipboard from 'clipboardy';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const all = new Set();
const connections = new Map();
const edges = getDataLines();
for (const edge of edges) {
  const [from, to] = edge.split('-');
  if (!connections.has(from)) connections.set(from, new Set());
  if (!connections.has(to)) connections.set(to, new Set());
  connections.get(from).add(to);
  connections.get(to).add(from);
  all.add(from);
  all.add(to);
}

const key = (g) => [...g].sort().join(',');

function search(start, graph = new Set([start]), done = new Set()) {
  let best = graph;
  for (const next of connections.get(start)) {
    if (graph.has(next)) continue;
    if (done.has(next)) continue;
    done.add(next);
    if (!Array.from(graph.values()).every((v) => connections.get(v).has(next)))
      continue;

    const g = search(next, new Set([...graph, next]), done);
    if (g.size > best.size) best = g;
  }
  return best;
}

let best = new Set();
for (const node of all) {
  if (!best.has(node)) {
    const g = search(node);
    if (g.size > best.size) best = g;
  }
}
let answer = key(best);

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
clipboard.writeSync(answer?.toString());
