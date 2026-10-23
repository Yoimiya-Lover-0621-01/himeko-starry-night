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
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';

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
  content: "HONKAI STAR RAIL";
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  pointer-events: none;
  white-space: nowrap;
  font-family: Montserrat, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.34em;
  color: rgba(160, 165, 210, 0.62);
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

const AMBIENT_ROUTE = '/star-wallpaper/ambient.mp3';

/**
 * Serve the ambient track on demand.
 *
 * The Client half used to carry the track as an inline data URI, so every
 * start paid for 835 KB of base64 whether or not it is ever played.
 * The bytes stay in the package; this route hands them out only when the
 * Client asks for them. Registration is best-effort: without a web server
 * (CLI-only profiles) the theme still loads, it simply has no music.
 * @param ctx - Host plugin context carrying the web server service.
 */
function registerBgmRoute(ctx) {
  let bytes;
  try {
    bytes = readFileSync(new URL('./assets/ambient.mp3', import.meta.url));
  } catch {
    return;
  }
  try {
    ctx.inject(['webServer'], (webCtx) => {
      let webServer;
      try {
        webServer = typeof webCtx.get === 'function' ? webCtx.get('webServer') : webCtx.webServer;
      } catch {
        return;
      }
      if (!webServer || typeof webServer.register !== 'function') return;
      try {
        const dispose = webServer.register({
          kind: 'exact',
          path: AMBIENT_ROUTE,
          handler(request, response) {
            try {
              if (request.method !== 'GET' && request.method !== 'HEAD') {
                response.statusCode = 405;
                response.setHeader('Allow', 'GET, HEAD');
                response.end();
                return;
              }
              response.statusCode = 200;
              response.setHeader('Content-Type', 'audio/mpeg');
              response.setHeader('Content-Length', String(bytes.length));
              response.setHeader('Cache-Control', 'public, max-age=86400');
              if (request.method === 'HEAD') {
                response.end();
                return;
              }
              response.end(bytes);
            } catch {}
          },
        });
        webCtx.on('dispose', () => {
          try {
            dispose();
          } catch {}
        });
      } catch {}
    });
  } catch {}
}

const GREET_STATE_ROUTE = '/star-wallpaper/greet-state';

/**
 * Persist which greeting groups already fired, so a name blesses exactly once
 * across restarts (the Client can only keep localStorage, which the desktop
 * shell's own scheme may scope per run).
 *
 * The payload is a small array of group indexes — never a name, never a digest.
 * Registration is best-effort like the track route: without a web server the
 * Client keeps its own local copy.
 * @param ctx - Host plugin context carrying the web server service.
 */
function registerGreetStateRoute(ctx) {
  let file;
  try {
    const dir = join(homedir(), '.dsh', 'star-wallpaper');
    mkdirSync(dir, { recursive: true });
    file = join(dir, 'greet-state.json');
  } catch {
    return;
  }
  const readState = () => {
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf8'));
      return Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)) : [];
    } catch {
      return [];
    }
  };
  let queue = Promise.resolve();
  try {
    ctx.inject(['webServer'], (webCtx) => {
      let webServer;
      try {
        webServer = typeof webCtx.get === 'function' ? webCtx.get('webServer') : webCtx.webServer;
      } catch {
        return;
      }
      if (!webServer || typeof webServer.register !== 'function') return;
      try {
        const dispose = webServer.register({
          kind: 'exact',
          path: GREET_STATE_ROUTE,
          handler(request, response) {
            const send = (status, body) => {
              response.statusCode = status;
              response.setHeader('Content-Type', 'application/json; charset=utf-8');
              response.setHeader('Cache-Control', 'no-store');
              response.end(JSON.stringify(body));
            };
            try {
              if (request.method === 'GET' || request.method === 'HEAD') {
                send(200, readState());
                return;
              }
              if (request.method !== 'POST') {
                response.statusCode = 405;
                response.setHeader('Allow', 'GET, HEAD, POST');
                response.end();
                return;
              }
              let raw = '';
              request.on('data', (chunk) => {
                if (raw.length < 4096) raw += chunk;
              });
              request.on('end', () => {
                let list = [];
                try {
                  const parsed = JSON.parse(raw);
                  list = Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)).slice(0, 64) : [];
                } catch {
                  list = [];
                }
                queue = queue
                  .then(() => {
                    try {
                      writeFileSync(file, JSON.stringify(list));
                    } catch {}
                  })
                  .catch(() => {});
                queue.then(() => send(200, { ok: true })).catch(() => send(500, { ok: false }));
              });
            } catch {}
          },
        });
        webCtx.on('dispose', () => {
          try {
            dispose();
          } catch {}
        });
      } catch {}
    });
  } catch {}
}

/**
 * Register the boot-splash stylesheet with the Web server's index renderer.
 * @param ctx - Host plugin context carrying the event bus.
 */
export function apply(ctx) {
  registerBgmRoute(ctx);
  registerGreetStateRoute(ctx);
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
