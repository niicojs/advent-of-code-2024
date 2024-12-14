import { consola } from 'consola';
import { pymport, proxify } from 'pymport';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

consola.wrapAll();
const np = proxify(pymport('numpy'));

const day = getCurrentDay();

consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day).map((l) => l.split(': ')[1].split(', '));

function find([px, py], [ax, ay], [bx, by]) {
  const a = np.array([
    [ax, bx],
    [ay, by],
  ]);
  const b = np.array([px, py]);
  const res = np.linalg.solve(a, b);
  const [x, y] = [
    Math.round(res.item(0).toJS()),
    Math.round(res.item(1).toJS()),
  ];
  if (x <= 0 || y <= 0) return 0;
  const check = np.matmul(a, np.array([x, y]));
  if (check.item(0).toJS() !== px || check.item(1).toJS() !== py) return 0;
  return 3 * x + y
}

let answer = 0;
for (let i = 0; i < lines.length; i += 3) {
  const a = lines[i].map((x) => x.split('+')[1]).map(Number);
  const b = lines[i + 1].map((x) => x.split('+')[1]).map(Number);
  const target = lines[i + 2].map((x) => x.split('=')[1]).map(Number);
  target[0] += 10000000000000;
  target[1] += 10000000000000;

  const res = find(target, a, b);
  consola.log('machine', i / 3, res);
  if (res) answer += res;
}

consola.success('result', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));
if (process.argv[2] === 'real') {
  // await submit({ day, level: 2, answer: answer });
}
consola.success('Done.');
