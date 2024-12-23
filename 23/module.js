import { readFileSync } from 'fs';

export function getParsedData() {
  return readFileSync('./23/real.txt', 'utf-8')
    .trim()
    .split(/\r?\n/)
    .map((v) => v.split('-'));
}

export function part1(edges) {
  const possible = [];
  const connections = new Map();
  for (const [from, to] of edges) {
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
  // console.log(answer);
}

export function part2(edges) {
  const all = new Set();
  const connections = new Map();
  for (const [from, to] of edges) {
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
      if (
        !Array.from(graph.values()).every((v) => connections.get(v).has(next))
      )
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
  // console.log(answer);
}
