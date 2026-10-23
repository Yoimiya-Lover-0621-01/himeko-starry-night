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
import { createReadStream, createWriteStream, mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
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
function buildBootStyle(customWallpaper = '') {
  const wallpaper =
    customWallpaper !== '' ? customWallpaper : assetDataUri('./assets/boot.jpg', 'image/jpeg');
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

const MEDIA_ROUTE = '/star-wallpaper/background';
const MEDIA_META_ROUTE = '/star-wallpaper/background-meta';
const MEDIA_MAX_BYTES = 512 * 1024 * 1024;

/**
 * Where the user's own canvas lives. Inside the home directory, next to the
 * greeting ledger, so a profile reinstall keeps it and no package copy does.
 * @returns absolute paths, or null when the home directory is unwritable.
 */
function mediaPaths() {
  try {
    const dir = join(homedir(), '.dsh', 'star-wallpaper');
    mkdirSync(dir, { recursive: true });
    return { dir, file: join(dir, 'background'), meta: join(dir, 'background.json') };
  } catch {
    return null;
  }
}

/**
 * Read the stored canvas descriptor, but only while its bytes are still there.
 * @returns the metadata record, or null.
 */
function readMediaMeta() {
  const paths = mediaPaths();
  if (!paths) return null;
  try {
    const meta = JSON.parse(readFileSync(paths.meta, 'utf8'));
    if (!meta || typeof meta.mime !== 'string') return null;
    if (meta.kind !== 'image' && meta.kind !== 'video') return null;
    if (statSync(paths.file).size <= 0) return null;
    return meta;
  } catch {
    return null;
  }
}

/**
 * Identify a photo or video from its first bytes. The MIME the client sends is
 * a hint for the file picker, never the authority.
 * @param head - the leading bytes of the upload.
 * @returns { kind, mime } or null when the bytes are none of the formats.
 */
function sniffMedia(head) {
  if (!head || head.length < 12) return null;
  const ascii = (start, end) => {
    let text = '';
    for (let i = start; i < end && i < head.length; i += 1) text += String.fromCharCode(head[i]);
    return text;
  };
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    return { kind: 'image', mime: 'image/jpeg' };
  }
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) {
    return { kind: 'image', mime: 'image/png' };
  }
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x38) {
    return { kind: 'image', mime: 'image/gif' };
  }
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    return { kind: 'image', mime: 'image/webp' };
  }
  if (ascii(4, 8) === 'ftyp') {
    const brand = ascii(8, 12);
    if (brand === 'avif' || brand === 'avis') return { kind: 'image', mime: 'image/avif' };
    /* HEIC/HEIF decodes in macOS but not in the desktop shell: refuse it here
       instead of storing a file the canvas can never paint. */
    if (brand === 'heic' || brand === 'heix' || brand === 'mif1' || brand === 'msf1') return null;
    return { kind: 'video', mime: 'video/mp4' };
  }
  if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) {
    return { kind: 'video', mime: 'video/webm' };
  }
  if (ascii(0, 4) === 'OggS') return { kind: 'video', mime: 'video/ogg' };
  return null;
}

/**
 * Serve the stored canvas with byte-range support: a video seeks, and even a
 * still benefits from a browser that can fetch just the head of the file.
 * @param request - the incoming request (GET or HEAD).
 * @param response - the response that owns the bytes.
 * @param paths - storage paths from {@link mediaPaths}.
 * @param meta - the descriptor from {@link readMediaMeta}.
 */
function streamMedia(request, response, paths, meta) {
  let size = 0;
  try {
    size = statSync(paths.file).size;
  } catch {
    size = 0;
  }
  if (size <= 0) {
    response.statusCode = 404;
    response.end();
    return;
  }
  response.setHeader('Content-Type', meta.mime);
  response.setHeader('Accept-Ranges', 'bytes');
  response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  const range = request.headers.range;
  if (typeof range === 'string' && range.startsWith('bytes=')) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (match !== null) {
      let start = match[1] === '' ? size - Number(match[2]) : Number(match[1]);
      let end = match[1] !== '' && match[2] !== '' ? Number(match[2]) : size - 1;
      if (!Number.isFinite(start) || start < 0) start = 0;
      if (!Number.isFinite(end) || end >= size) end = size - 1;
      if (start > end) {
        response.statusCode = 416;
        response.setHeader('Content-Range', 'bytes */' + size);
        response.end();
        return;
      }
      response.statusCode = 206;
      response.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
      response.setHeader('Content-Length', String(end - start + 1));
      if (request.method === 'HEAD') {
        response.end();
        return;
      }
      const stream = createReadStream(paths.file, { start, end });
      stream.on('error', () => {
        try { response.destroy(); } catch {}
      });
      stream.pipe(response);
      return;
    }
  }
  response.statusCode = 200;
  response.setHeader('Content-Length', String(size));
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  const stream = createReadStream(paths.file);
  stream.on('error', () => {
    try { response.destroy(); } catch {}
  });
  stream.pipe(response);
}

/**
 * The canvas routes: GET/HEAD serve the stored file, POST stores a sniffed and
 * size-capped photo or video, DELETE brings the packaged nebula back. The bytes
 * never leave this machine — they only move into ~/.dsh/star-wallpaper/.
 * @param ctx - Host plugin context carrying the web server service.
 */
function registerMediaRoute(ctx) {
  try {
    ctx.inject(['webServer'], (webCtx) => {
      let webServer;
      try {
        webServer = typeof webCtx.get === 'function' ? webCtx.get('webServer') : webCtx.webServer;
      } catch {
        return;
      }
      if (!webServer || typeof webServer.register !== 'function') return;
      const paths = mediaPaths();
      if (!paths) return;
      const sendJson = (response, status, body) => {
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify(body));
      };
      const handleMedia = (request, response) => {
        const method = request.method;
        if (method === 'GET' || method === 'HEAD') {
          const meta = readMediaMeta();
          if (!meta) {
            response.statusCode = 404;
            response.end();
            return;
          }
          streamMedia(request, response, paths, meta);
          return;
        }
        if (method === 'DELETE') {
          try { unlinkSync(paths.file); } catch {}
          try { unlinkSync(paths.meta); } catch {}
          sendJson(response, 200, { ok: true, meta: { has: false } });
          return;
        }
        if (method !== 'POST') {
          response.statusCode = 405;
          response.setHeader('Allow', 'GET, HEAD, POST, DELETE');
          response.end();
          return;
        }
        const temp = paths.file + '.upload';
        /* A dead upload from an earlier run must not become this one's prefix.
           On Windows the handle can also outlive the decision to abort, so the
           discard rides both the immediate call and the stream's close. */
        try { unlinkSync(temp); } catch {}
        const out = createWriteStream(temp);
        /* Every exit from this stream — abort, failure, success — passes
           through `close`; unlinking here is the one place that always runs
           after the handle is gone, so nothing 0-byte is left behind. */
        out.once('close', () => {
          try { unlinkSync(temp); } catch {}
        });
        let received = 0;
        let head = Buffer.alloc(0);
        let sniffed = null;
        let aborted = false;
        const discardTemp = () => {
          try { unlinkSync(temp); } catch {}
        };
        const fail = (status, error) => {
          if (aborted) return;
          aborted = true;
          try { out.once('close', discardTemp); } catch {}
          try { out.destroy(); } catch {}
          discardTemp();
          try { request.resume(); } catch {}
          sendJson(response, status, { ok: false, error });
        };
        request.on('error', () => fail(400, 'bad-request'));
        request.on('data', (chunk) => {
          if (aborted) return;
          if (!sniffed) {
            head = Buffer.concat([head, chunk]);
            if (head.length < 32) return;
            sniffed = sniffMedia(head);
            if (!sniffed) {
              fail(415, 'unsupported');
              return;
            }
            received = head.length;
            out.write(head);
            head = null;
            return;
          }
          received += chunk.length;
          if (received > MEDIA_MAX_BYTES) {
            fail(413, 'too-large');
            return;
          }
          out.write(chunk);
        });
        request.on('end', () => {
          if (aborted) return;
          if (!sniffed) {
            if (head && head.length > 0) {
              sniffed = sniffMedia(head);
              if (sniffed) {
                received = head.length;
                out.write(head);
              }
            }
            if (!sniffed) {
              fail(415, 'unsupported');
              return;
            }
          }
          if (received > MEDIA_MAX_BYTES) {
            fail(413, 'too-large');
            return;
          }
          let name = '';
          try {
            name = decodeURIComponent(String(request.headers['x-sws-name'] || ''));
          } catch {
            name = '';
          }
          name = name.replace(/[\\/\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
          if (name === '') name = 'background';
          const meta = {
            has: true,
            kind: sniffed.kind,
            mime: sniffed.mime,
            name,
            size: received,
            version: Date.now(),
          };
          out.end(() => {
            try {
              renameSync(temp, paths.file);
              writeFileSync(paths.meta, JSON.stringify(meta));
            } catch {
              try { out.once('close', discardTemp); } catch {}
              discardTemp();
              sendJson(response, 500, { ok: false, error: 'store-failed' });
              return;
            }
            sendJson(response, 200, { ok: true, meta });
          });
        });
      };
      const handleMeta = (request, response) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.statusCode = 405;
          response.setHeader('Allow', 'GET, HEAD');
          response.end();
          return;
        }
        const meta = readMediaMeta();
        sendJson(
          response,
          200,
          meta
            ? { ok: true, meta: { has: true, kind: meta.kind, mime: meta.mime, name: meta.name, size: meta.size, version: meta.version } }
            : { ok: true, meta: { has: false } },
        );
      };
      try {
        const disposers = [
          webServer.register({ kind: 'exact', path: MEDIA_ROUTE, handler: handleMedia }),
          webServer.register({ kind: 'exact', path: MEDIA_META_ROUTE, handler: handleMeta }),
        ];
        webCtx.on('dispose', () => {
          for (const dispose of disposers) {
            try { dispose(); } catch {}
          }
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
  registerMediaRoute(ctx);
  /* The boot splash follows the canvas too: when the user picked a photo, the
     first frame of the app is theirs as well. Rebuilt on every index render,
     so a new picture needs only a reload — never a restart. A video keeps the
     packaged nebula, because a boot screen cannot play one. */
  let bootStyle = '';
  let bootKey = null;
  const bootStyleFor = () => {
    let custom = '';
    try {
      const meta = readMediaMeta();
      if (meta !== null && meta.kind === 'image') custom = MEDIA_ROUTE + '?v=' + String(meta.version || '1');
    } catch {}
    const key = custom === '' ? 'packaged' : custom;
    if (key !== bootKey) {
      bootKey = key;
      bootStyle = '';
      try {
        bootStyle = buildBootStyle(custom);
      } catch {
        bootStyle = '';
      }
    }
    return bootStyle;
  };
  try {
    ctx.on('webserver/index-inject', (table) => {
      try {
        const style = bootStyleFor();
        if (style !== '' && Array.isArray(table)) table.push({ kind: 'style', text: style });
      } catch {}
    });
  } catch {}
}
