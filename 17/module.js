import { readFileSync } from 'fs';
import { mod, nums } from '../utils.js';

export function getParsedData() {
  const [one, two] = readFileSync('./17/real.txt', 'utf-8')
    .trim()
    .split(/\r?\n\r?\n/);
  const regs = {};
  for (const l of one.split(/\r?\n/)) {
    const [r, val] = l.split(': ');
    regs[r.split(' ')[1]] = +val;
  }
  const program = nums(two);
  return { regs, program };
}

const [ADV, BXL, BST, JNZ, BXC, OUT, BDV, CDV] = [0, 1, 2, 3, 4, 5, 6, 7];

export function part1({ regs, program }) {
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
  // console.log(answer);
}

export function part2({ regs, program }) {
  function run(val) {
    const out = [];
    const regs = { A: val, B: 0, C: 0 };
    for (let i = 0; i < program.length; i += 2) {
      const [opcode, operand] = [program[i], program[i + 1]];

      let val = 0;
      if (operand <= 3) val = operand;
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
    return out.join(',');
  }

  function recsearch(last, val) {
    if (last > program.length) return val;
    val *= 8;
    const ok = program.slice(-last).join(',');
    for (let i = 0; i < 8; i++) {
      if (run(val + i) === ok) {
        const sub = recsearch(last + 1, val + i);
        if (sub >= 0) return sub;
      }
    }
    return -1;
  }

  let answer = recsearch(1, 0);
  // console.log(answer);
}
