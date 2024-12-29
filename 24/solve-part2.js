import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/)
  .map((v) => v.split(/\r?\n/));

const vals = one.map((x) => x.split(': '));
const inputs = new Map();
for (const [l, v] of vals) {
  inputs.set(l, +v);
}

const calc = two.map((x) => x.match(/(\w+) (\w+) (\w+) \-\> (\w+)/));
let gates = new Map();
for (const [_, a, b, c, d] of calc) {
  gates.set(d, [b, a, c]);
}

function inputval(n) {
  const all = Array.from(inputs.keys())
    .filter((g) => g.startsWith(n))
    .sort((a, b) => b.localeCompare(a));
  let res = 0;
  for (const v of all) res = res * 2 + inputs.get(v);
  return res;
}

let done = new Set();
let swap = {};

const getval = (n) => {
  if (inputs.has(n)) return inputs.get(n);
  if (swap[n]) n = swap[n];
  let [op, a, b] = gates.get(n);
  if (op === 'AND') return getval(a) & getval(b);
  if (op === 'OR') return getval(a) | getval(b);
  if (op === 'XOR') return getval(a) ^ getval(b);
};

const depends = (n) => {
  if (inputs.has(n)) return new Set([n]);
  if (swap[n]) n = swap[n];
  let [_, a, b] = gates.get(n);
  return depends(a)
    .union(depends(b))
    .union(new Set([a, b]));
};

function setinput(n, v) {
  const all = Array.from(inputs.keys())
    .filter((g) => g.startsWith(n))
    .sort((a, b) => a.localeCompare(b));
  for (const g of all) {
    inputs.set(g, v & 1);
    v = v >> 1;
  }
}

const output = Array.from(gates.keys())
  .filter((g) => g.startsWith('z'))
  .sort((a, b) => a.localeCompare(b));

const x = inputval('x');
const y = inputval('y');
const correct = BigInt(x) + BigInt(y);

function find(operator, from) {
  for (const [to, [op, a, b]] of gates.entries()) {
    if (op == operator && (a === from || b === from)) {
      return to;
    }
  }
  return null;
}

function fixOutputXOR(z) {
  const num = z.slice(1);
  let firstxor = find('XOR', 'x' + num);
  // firstxor should not be z
  if (firstxor.startsWith('z')) {
    consola.log(`  should swap ${firstxor} and ?`);
  } else {
    const secondxor = find('XOR', firstxor);
    if (secondxor !== z) {
      consola.log(`  should swap ${z} and ${secondxor}`);
      swap[z] = secondxor;
      swap[secondxor] = z;
      done.add('z' + num);
    }
  }
}

function dostuff() {
  const incorrects = [];
  let expected = BigInt(x) + BigInt(y);
  for (const g of output) {
    const v = getval(g);
    if ((expected & 1n) !== BigInt(v)) {
      incorrects.push(g);
    }
    expected = expected >> 1n;
  }

  consola.log('total incorrects', incorrects.length);
  consola.log(JSON.stringify(incorrects));
}

consola.box('before');
dostuff();

consola.box('try to fix');

// output is only from xor
for (const z of output) {
  if (swap[z]) z = swap[z];
  if (z != 'z45' && gates.get(z)[0] !== 'XOR') {
    consola.log('output without xor', z);
    fixOutputXOR(z);
  }
}
// input xor into a node that xor to output
{
  let idx = '01';
  while (inputs.has('x' + idx) && idx !== '45') {
    if (!done.has('z' + idx)) {
      const x = find('XOR', 'x' + idx);
      const toz = gates.get('z' + idx);
      const good =
        gates.get(toz[1])[2].startsWith('x' + idx) ||
        gates.get(toz[1])[1].startsWith('x' + idx)
          ? toz[1]
          : toz[2];
      if (x !== good) {
        consola.log(`z${idx} not a good pattern input XOR node XOR output`);
        consola.log(`  should swap ${x} and ${good}`);
        swap[x] = good;
        swap[good] = x;
      }
    }
    idx = (+idx + 1).toString().padStart(2, '0');
  }
}

consola.box('after');

dostuff();

// consola.log('swap', JSON.stringify(swap));

let answer = Object.keys(swap).sort().join(',');
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
