import 'dotenv/config';
import { consola } from 'consola';
import { getData } from './aoc.js';

const day = new Date().getDate().toString().padStart(2, '0');
consola.start("récupération de l'input pour le jour", day);

getData({ day });

consola.success('done.');
