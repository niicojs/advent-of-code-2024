import { existsSync, readFileSync, writeFileSync } from 'fs';
import { consola } from 'consola';

export async function submit({ year, day, level, answer }) {
  if (!year) {
    if (process.env.AOC_YEAR) year = +process.env.AOC_YEAR;
    else year = new Date().getFullYear();
  }
  if (!level) level = 1;

  let incorrect = {};
  if (existsSync('incorrect.json')) {
    incorrect = JSON.parse(readFileSync('incorrect.json', 'utf-8'));
  }
  const wrong = incorrect[`${day}-${level}`] || {};
  if (wrong[answer]) {
    consola.error('Réponse incorrect et déjà envoyée : ' + wrong[answer]);
    return false;
  }

  const url = `https://adventofcode.com/${year}/day/${+day}/answer`;
  const body = new URLSearchParams({ level, answer });
  const res = await fetch(url, {
    body,
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  if (res.status !== 200) {
    throw new Error(
      `Fetching "${url}" failed with status ${res.status}:\n${await res.text()}`
    );
  }
  const response = await res.text();
  if (response.includes('You gave an answer too recently')) {
    const match = response.match(/You have (.*?) left to wait/);
    if (!match) {
      consola.error('Mauvaise réponse envoyée trop récemment.');
    } else {
      consola.error(
        "Pas le droit d'envoyer une autre réponse avant " + match[1]
      );
    }
    return false;
  } else if (response.includes('not the right answer')) {
    if (response.includes('too high')) {
      consola.error('Réponse trop élevée.');
      wrong[answer] = 'trop élevé';
    } else if (response.includes('too low')) {
      consola.error('Réponse trop basse.');
      wrong[answer] = 'trop bas';
    } else {
      consola.error('Réponse incorrect.');
      wrong[answer] = 'incorrect';
    }

    incorrect[`${day}-${level}`] = wrong;
    writeFileSync(
      'incorrect.json',
      JSON.stringify(incorrect, null, 2),
      'utf-8'
    );
    return false;
  } else if (response.includes("That's the right answer!")) {
    consola.success('Bonne réponse !');
    return true;
  }
  
  consola.warn('Impossible de comprendre la réponse du serveur :');
  consola.warn(response);
  return false;
}
