import { consola } from 'consola';
import clipboard from 'clipboardy';
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

const registers = {};
const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);
for (const l of one.split(/\r?\n/)) {
  const [r, val] = l.split(': ');
  registers[r.split(' ')[1]] = +val;
}
const program = nums(two);

//      0    1    2    3    4    5    6    7
const [ADV, BXL, BST, JNZ, BXC, OUT, BDV, CDV] = [0, 1, 2, 3, 4, 5, 6, 7];

function findloop(regs) {
  let stack = [];
  for (let i = 0; i < program.length; i += 2) {
    const opcode = program[i];
    const operand = program[i + 1];
    stack.push([opcode, operand]);
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
      return stack;
    } else if (opcode === BDV) {
      regs['B'] = Math.floor(regs['A'] / Math.pow(2, val));
    } else if (opcode === CDV) {
      regs['C'] = Math.floor(regs['A'] / Math.pow(2, val));
    }
  }
}

function run(prog, regs) {
  for (let i = 0; i < prog.length; i++) {
    const [opcode, operand] = prog[i];
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
      return mod(val, 8);
    } else if (opcode === BDV) {
      regs['B'] = Math.floor(regs['A'] / Math.pow(2, val));
    } else if (opcode === CDV) {
      regs['C'] = Math.floor(regs['A'] / Math.pow(2, val));
    }
  }
}

let pidx = program.length - 1;
const loop = findloop(registers);

let answer = 0;
while (pidx >= 0) {
  answer = answer * 8;
  while (true) {
    const r = { A: answer, B: 0, C: 0 };
    let ok = true;
    for (let i = pidx; i < program.length; i++) {
      ok = ok && run(loop, r) === program[i];
    }
    if (ok) break;
    answer++;
  }
  pidx--;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
clipboard.writeSync(answer?.toString());
