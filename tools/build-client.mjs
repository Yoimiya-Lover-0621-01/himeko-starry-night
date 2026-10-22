/**
 * Regenerates ../client.js by inlining the packaged artwork as data URIs.
 * Run from the package directory: node tools/build-client.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageDir = join(here, '..');
const template = readFileSync(join(here, 'client.template.js'), 'utf8');
const wallpaper = readFileSync(join(packageDir, 'assets', 'nebula.jpg'));
const whaleTail = readFileSync(join(packageDir, 'assets', 'whale-tail.png'));
const whaleStill = readFileSync(join(packageDir, 'assets', 'whale-tail-still.svg'));
const eggBgm = readFileSync(join(packageDir, 'assets', 'egg-bgm.mp3'));

const placeholders = [
  '__WALLPAPER_DATA_URI__',
  '__WHALE_TAIL_DATA_URI__',
  '__WHALE_STILL_DATA_URI__',
  '__EGG_BGM_DATA_URI__',
];
for (const placeholder of placeholders) {
  if (!template.includes(placeholder)) {
    throw new Error(`client.template.js is missing the ${placeholder} placeholder`);
  }
}

const output = template
  .replaceAll('__WALLPAPER_DATA_URI__', `data:image/jpeg;base64,${wallpaper.toString('base64')}`)
  .replaceAll('__WHALE_TAIL_DATA_URI__', `data:image/png;base64,${whaleTail.toString('base64')}`)
  .replaceAll('__WHALE_STILL_DATA_URI__', `data:image/svg+xml;base64,${whaleStill.toString('base64')}`)
  .replaceAll('__EGG_BGM_DATA_URI__', `data:audio/mpeg;base64,${eggBgm.toString('base64')}`);

writeFileSync(join(packageDir, 'client.js'), output, 'utf8');
console.log(
  `wrote client.js (${output.length} chars, wallpaper ${wallpaper.length} B, whale ${whaleTail.length} B, bgm ${eggBgm.length} B)`,
);
