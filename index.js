/**
 * Host half of the 姬子的星月夜 bundle.
 *
 * The Client module (./client.js) owns everything the running app renders.
 * This Host half only contributes one early `<style>` row to the Web UI
 * index, so the boot screen ("HARNESS" + spinner + "Loading plugins…") is
 * already painted in the theme instead of flashing an empty black page.
 *
 * The row travels both ways DSH supports:
 *  - `dsh web`: webserver renders the row into index.html before any script
 *    runs, so the very first frame is themed;
 *  - Desktop: the same row rides the boot payload and the Web shell applies
 *    it before plugin modules load (i.e. exactly during "Loading plugins…").
 *
 * The style is scoped to `[data-dsh-boot]`, the boot screen's own root, so it
 * disappears the moment the app renders and cannot leak into the UI.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Read one packaged asset as a data URI.
 * @param path - path relative to this module.
 * @param mime - MIME type written before `;base64`.
 * @returns the data URI, or an empty string when the asset cannot be read.
 */
function assetDataUri(path, mime) {
  try {
    const bytes = readFileSync(fileURLToPath(new URL(path, import.meta.url)));
    return `data:${mime};base64,${bytes.toString('base64')}`;
  } catch {
    return '';
  }
}

/**
 * Build the boot-splash stylesheet.
 * @returns the stylesheet text, or an empty string when no asset is available.
 */
function buildBootStyle() {
  const wallpaper = assetDataUri('./assets/boot.jpg', 'image/jpeg');
  const logo = assetDataUri('./assets/brand-lockup.svg', 'image/svg+xml');
  const whaleTail = assetDataUri('./assets/whale-tail.png', 'image/png');
  const whaleStill = assetDataUri('./assets/whale-tail-still.svg', 'image/svg+xml');
  if (wallpaper === '' && logo === '') return '';

  const spinnerRule =
    whaleTail === ''
      ? `[data-dsh-boot-spinner] {
  width: 22px !important;
  height: 22px !important;
  border: 2px solid rgba(150, 160, 255, 0.20) !important;
  animation: swt-boot-spin 1.15s linear infinite !important;
  filter: drop-shadow(0 0 9px rgba(150, 120, 255, 0.55));
}`
      : `[data-dsh-boot-spinner] {
  width: 26px !important;
  height: 26px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: #dfe0ff !important;
  -webkit-mask: url("${whaleTail}") center center / contain no-repeat !important;
  mask: url("${whaleTail}") center center / contain no-repeat !important;
  animation: none !important;
  filter: drop-shadow(0 0 8px rgba(150, 120, 255, 0.55));
}
[data-dsh-boot-spinner]::after {
  display: none !important;
}`;

  const whaleReducedMotion =
    whaleStill === ''
      ? ''
      : `  [data-dsh-boot-spinner] {
    -webkit-mask-image: url("${whaleStill}") !important;
    mask-image: url("${whaleStill}") !important;
  }`;

  const wallpaperRule =
    wallpaper === ''
      ? ''
      : `html:has([data-dsh-boot]) {
  background-color: #05060f !important;
  background-image: url("${wallpaper}") !important;
  background-position: center center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
}
html:has([data-dsh-boot]) body,
html:has([data-dsh-boot]) #root {
  background-color: transparent !important;
}`;

  const logoRule =
    logo === ''
      ? ''
      : `[data-dsh-boot] > div:has([data-dsh-boot-spinner]) > div:first-child {
  width: 242px !important;
  height: 32px !important;
  font-size: 0 !important;
  line-height: 0 !important;
  color: transparent !important;
  background: url("${logo}") center center / contain no-repeat !important;
}`;

  return `/* ── 姬子的星月夜 · boot splash (scoped to [data-dsh-boot]) ───────── */
[data-dsh-boot] {
  background: transparent !important;
  color: #f1f2ff !important;
  isolation: isolate;
  animation: swt-boot-fade 260ms ease-out both;
}
[data-dsh-boot] > div > div {
  color: inherit !important;
}
${wallpaperRule}
[data-dsh-boot]::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(120% 95% at 50% 32%, rgba(8, 10, 34, 0.10) 0%, rgba(4, 5, 16, 0.52) 100%),
    linear-gradient(180deg, rgba(5, 7, 20, 0.48) 0%, rgba(5, 7, 20, 0.34) 46%, rgba(5, 7, 20, 0.56) 100%);
}
[data-dsh-boot] > div {
  box-sizing: border-box !important;
  min-width: 430px !important;
  padding: 30px 40px 26px !important;
  gap: 16px !important;
  border-radius: 22px !important;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 38%, rgba(255, 255, 255, 0.02) 100%),
    rgba(24, 27, 70, 0.46) !important;
  -webkit-backdrop-filter: blur(60px) saturate(160%) !important;
  backdrop-filter: blur(60px) saturate(160%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    0 24px 64px rgba(0, 0, 0, 0.42) !important;
  animation: swt-boot-in 420ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
}
${logoRule}
${spinnerRule}
[data-dsh-boot] > div:has([data-dsh-boot-spinner]) > div:last-child {
  font-size: 0 !important;
  color: transparent !important;
}
[data-dsh-boot] > div:has([data-dsh-boot-spinner]) > div:last-child::after {
  content: "正在点亮星月夜…";
  display: block;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.08em;
  color: rgba(190, 193, 236, 0.88);
}
[data-dsh-boot]::after {
  content: "姬子的星月夜 · HIMEKO'S STARRY NIGHT";
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  pointer-events: none;
  white-space: nowrap;
  font-family: Montserrat, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.22em;
  color: rgba(150, 155, 200, 0.55);
}
@keyframes swt-boot-fade {
  from { opacity: 0; }
}
@keyframes swt-boot-in {
  from { opacity: 0; transform: translateY(10px) scale(0.985); }
}
@media (prefers-reduced-motion: reduce) {
  [data-dsh-boot],
  [data-dsh-boot] > div,
  [data-dsh-boot-spinner] {
    animation: none !important;
  }
${whaleReducedMotion}
}
`;
}

/**
 * Register the boot-splash stylesheet with the Web server's index renderer.
 * @param ctx - Host plugin context carrying the event bus.
 */
export function apply(ctx) {
  let style = '';
  try {
    style = buildBootStyle();
  } catch {
    return;
  }
  if (style === '') return;
  try {
    ctx.on('webserver/index-inject', (table) => {
      try {
        if (Array.isArray(table)) table.push({ kind: 'style', text: style });
      } catch {}
    });
  } catch {}
}
