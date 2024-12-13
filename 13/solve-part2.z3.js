import { consola } from 'consola';
import Z3 from 'z3-solver';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day).map((l) => l.split(': ')[1].split(', '));

const { Context } = await Z3.init();
const { Solver, Int } = new Context('main');
const solver = new Solver();
const [x, y] = [Int.const('x'), Int.const('y')];

async function find(target, a, b) {
  solver.reset();
  solver.add(x.ge(0));
  solver.add(y.ge(0));
  solver.add(x.mul(a[0]).add(y.mul(b[0])).eq(target[0]));
  solver.add(x.mul(a[1]).add(y.mul(b[1])).eq(target[1]));
  const ok = await solver.check();
  if (ok === 'sat') {
    const model = await solver.model();
    const valx = +model.eval(x).asString();
    const valy = +model.eval(y).asString();
    return 3 * valx + valy;
  } else {
    return 0;
  }
}

let answer = 0;
for (let i = 0; i < lines.length; i += 3) {
  const a = lines[i].map((x) => x.split('+')[1]).map(Number);
  const b = lines[i + 1].map((x) => x.split('+')[1]).map(Number);
  const target = lines[i + 2].map((x) => x.split('=')[1]).map(Number);
  target[0] += 10000000000000;
  target[1] += 10000000000000;

  const res = await find(target, a, b);
  consola.log('machine', i / 3, res);
  if (res) answer += res;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
process.exit(0);