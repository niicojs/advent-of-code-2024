import { consola } from 'consola';
import clipboard from 'clipboardy';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const edges = getDataLines();
const all = new Set();
const connections = new Map();
for (const edge of edges) {
  const [from, to] = edge.split('-');
  if (!connections.has(from)) connections.set(from, []);
  if (!connections.has(to)) connections.set(to, []);
  connections.get(from).push(to);
  connections.get(to).push(from);
  all.add(from);
  all.add(to);
}

// https://en.wikipedia.org/wiki/Clique_problem

function bronKerbosch(R, P, X) {
  if (P.size === 0 && X.size === 0) return R;
  let best = null;
  for (const v of P) {
    const cv = new Set(connections.get(v));
    const res = bronKerbosch(
      new Set([...R, v]),
      P.intersection(cv),
      X.intersection(cv)
    );
    if (best === null || (res && res.size > best.size)) {
      best = res;
    }
    P.delete(v);
    X.add(v);
  }
  return best;
}

const clique = bronKerbosch(new Set(), all, new Set());
const answer = [...clique].sort().join(',');

consola.success('result', answer);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
clipboard.writeSync(answer?.toString());
