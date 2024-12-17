import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {} from 'yoctocolors';
import {
  formatElapsedTime,
  getCurrentDay,
  getRawData,
  mod,
  nums,
} from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const regs = {};
const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);
for (const l of one.split(/\r?\n/)) {
  const [r, val] = l.split(': ');
  regs[r.split(' ')[1]] = +val;
}
const program = nums(two);

const [ADV, BXL, BST, JNZ, BXC, OUT, BDV, CDV] = [0, 1, 2, 3, 4, 5, 6, 7];

const out = [];
for (let i = 0; i < program.length; i += 2) {
  const opcode = program[i];
  const operand = program[i + 1];
  let val = 0;
  if (operand === 0) val = 0;
  if (operand === 1) val = 1;
  if (operand === 2) val = 2;
  if (operand === 3) val = 3;
  if (operand === 4) val = regs['A'];
  if (operand === 5) val = regs['B'];
  if (operand === 6) val = regs['C'];

  if (opcode === ADV) {
    regs['A'] = Math.floor(regs['A'] / Math.pow(2, val));
  } else if (opcode === BXL) {
    regs['B'] = regs['B'] ^ operand;
  } else if (opcode === BST) {
    regs['B'] = mod(val, 8);
  } else if (opcode === JNZ) {
    if (regs['A'] !== 0) i = operand - 2;
  } else if (opcode === BXC) {
    regs['B'] = regs['B'] ^ regs['C'];
  } else if (opcode === OUT) {
    out.push(mod(val, 8));
  } else if (opcode === BDV) {
    regs['B'] = Math.floor(regs['A'] / Math.pow(2, val));
  } else if (opcode === CDV) {
    regs['C'] = Math.floor(regs['A'] / Math.pow(2, val));
  }
}

let answer = out.join(',');
consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 1, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
