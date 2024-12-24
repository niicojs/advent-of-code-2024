import { writeFileSync } from 'fs';
import { getRawData } from '../utils.js';

let content = 'digraph G {\n';

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/)
  .map((v) => v.split(/\r?\n/));

const vals = one.map((x) => x.split(': '));
const inputs = new Map();
for (const [l, v] of vals) {
  inputs.set(l, +v);
}

let swap = {
  // z13: 'vcv',
  // vcv: 'z13',
  // z19: 'vwp',
  // vwp: 'z19',
  // z25: 'mps',
  // mps: 'z25',
  // vjv: 'cqm',
  // cqm: 'vjv',
};

const g = two.map((x) => x.match(/(\w+) (\w+) (\w+) \-\> (\w+)/));
const gates = new Map();
for (let [_, a, b, c, d] of g) {
  if (swap[d]) d = swap[d];
  gates.set(d, [b, a, c]);
  content += `${a} -> ${d} [label=${b}];\n`;
  content += `${c} -> ${d} [label=${b}];\n`;
}

const output = Array.from(gates.keys())
  .filter((g) => g.startsWith('z'))
  .sort((a, b) => b.localeCompare(a));

for (const g of output) {
  content += `${g} [style=filled, fillcolor=red];\n`;
}

content += '}\n';

writeFileSync('./24/graph.dot', content, 'utf-8');
console.log('done');
