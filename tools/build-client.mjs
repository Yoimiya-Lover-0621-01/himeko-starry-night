/**
 * Regenerates ../client.js by inlining assets/nebula.jpg as a base64 data URI.
 * Run from the package directory: node tools/build-client.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageDir = join(here, '..');
const template = readFileSync(join(here, 'client.template.js'), 'utf8');
const image = readFileSync(join(packageDir, 'assets', 'nebula.jpg'));
if (!template.includes('__WALLPAPER_DATA_URI__')) {
  throw new Error('client.template.js is missing the __WALLPAPER_DATA_URI__ placeholder');
}
const dataUri = `data:image/jpeg;base64,${image.toString('base64')}`;
const output = template.replace('__WALLPAPER_DATA_URI__', dataUri);
writeFileSync(join(packageDir, 'client.js'), output, 'utf8');
console.log(`wrote client.js (${output.length} bytes, artwork ${image.length} bytes)`);
