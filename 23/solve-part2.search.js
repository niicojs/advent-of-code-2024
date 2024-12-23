import { consola } from 'consola';
import clipboard from 'clipboardy';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
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
  if (!connections.has(from)) connections.set(from, new Set());
  if (!connections.has(to)) connections.set(to, new Set());
  connections.get(from).add(to);
  connections.get(to).add(from);
  if (from.at(0) === 't') possible.push(from);
  if (to.at(0) === 't') possible.push(to);
}

const key = (g) => [...g].sort().join(',');

function search(start) {
  const todo = [[start, new Set([start])]];
  const visited = new Set();
  let best = new Set();
  while (todo.length) {
    const [node, graph] = todo.shift();
    if (visited.has(key(graph))) continue;
    visited.add(key(graph));
    for (const next of connections.get(node)) {
      if (node === graph || graph.has(next)) continue;
      let ok = true;
      for (const n of graph) {
        if (!connections.get(n).has(next)) ok = false;
      }
      if (ok) todo.push([next, new Set([...graph, next])]);
    }
    if (graph.size > best.size) best = graph;
  }
  return best;
}

let best = new Set();
for (const node of possible) {
  const g = search(node);
  if (g.size > best.size) best = g;
}
let answer = key(best);

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
clipboard.writeSync(answer?.toString());
