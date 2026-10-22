#!/usr/bin/env node
/**
 * Selector inventory for the star-wallpaper skin.
 *
 * The theme's skin layer is written against CSS-module class names from one
 * DSH web-client build. A DSH upgrade re-hashes those names, so this report
 * exists to make that fragility visible: run it before and after an upgrade
 * and diff the groups, then update the affected rules (or migrate them to the
 * stable `data-sws-*` anchors).
 *
 *   node tools/selectors-report.mjs          # human report
 *   node tools/selectors-report.mjs --json   # machine-readable
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, 'client.template.js'), 'utf8');

const rules = [];
for (const [kind, pattern] of [
  ['contains', /\[class\*="([^"]+)"\]/g],
  ['token', /\[class~="([^"]+)"\]/g],
]) {
  let match;
  while ((match = pattern.exec(source)) !== null) {
    rules.push({ kind, selector: match[0], value: match[1] });
  }
}

const groups = new Map();
for (const rule of rules) groups.set(rule.value, (groups.get(rule.value) || 0) + 1);
const report = {
  generated_from: 'tools/client.template.js',
  total: rules.length,
  contains: rules.filter((rule) => rule.kind === 'contains').length,
  token: rules.filter((rule) => rule.kind === 'token').length,
  unique: groups.size,
  groups: [...groups.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count })),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `selectors: ${report.total} (contains ${report.contains} / token ${report.token}) · unique tokens: ${report.unique}`,
  );
  for (const group of report.groups.slice(0, 40)) {
    console.log(`  ${String(group.count).padStart(3)}  ${group.value}`);
  }
  if (report.groups.length > 40) console.log(`  … ${report.groups.length - 40} more (use --json)`);
}
