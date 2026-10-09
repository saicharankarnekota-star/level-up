import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = import.meta.dirname;
const out = join(here, '../artifacts/level-up/public/lottie');
mkdirSync(out, { recursive: true });

const picks = {
  frog: 'frog/jumping-frog-7723FH0JvJ',
  bear: 'bear/brown-bear-lRzeUW72jC',
  squirrel: 'squirrel/squirrel-love-AE8Rcj5qkJ',
  rocket: 'dragon/rocket-launched-into-space-r9dJVtVojW',
  dragon: 'dragon/dragon-flying-fly-dragao-voador-voando-3QZwbo98oF',
  crocodile: 'crocodile/crocodile-fkDkZvF7Gd',
  castle: 'castle/castle-dragon-palace-vUDezHj71S',
  girl: 'girl-waving/girl-waving-2-0-yFHnzUoH0D',
  confetti: 'confetti/confetti-3ofTs67sBx',
  sparkle: 'sparkle/twinkle-tLkJ41yzbb',
  coins: 'coins/falling-coins-KjVAkKwkiI',
  trophy: 'trophy/trophy-animation-3trvvLV1Mn',
};

const reports = Object.fromEntries(
  readdirSync(here).filter((f) => f.endsWith('.json')).flatMap((f) => {
    try { return JSON.parse(readFileSync(join(here, f), 'utf8')).map((r) => [r.id, r]); } catch { return []; }
  }),
);

const credits = ['# Lottie animation credits', '', 'Free animations from LottieFiles, used under the Lottie Simple License (https://lottiefiles.com/page/license).', ''];
for (const [name, path] of Object.entries(picks)) {
  const x = join(here, path, 'x');
  const animDir = join(x, 'animations');
  const json = JSON.parse(readFileSync(join(animDir, readdirSync(animDir)[0]), 'utf8'));
  for (const a of json.assets ?? []) {
    if (!a.p || a.layers || a.p.startsWith('data:')) continue;
    const file = join(x, 'images', a.p);
    if (!existsSync(file)) continue;
    const ext = a.p.split('.').pop().replace('jpg', 'jpeg');
    a.p = `data:image/${ext};base64,${readFileSync(file).toString('base64')}`;
    a.u = '';
    a.e = 1;
  }
  writeFileSync(join(out, `${name}.json`), JSON.stringify(json));
  const r = reports[path.split('/')[1]];
  credits.push(`- \`${name}.json\`: ${r?.creator?.replace(' on LottieFiles', '') ?? 'LottieFiles'} — https://lottiefiles.com${r?.slug ?? ''}`);
}
writeFileSync(join(out, 'CREDITS.md'), credits.join('\n') + '\n');
console.log(readdirSync(out));
