/**
 * Star nebula wallpaper - browser half.
 *
 *  - `html` keeps a solid night fallback; `body` and `#root` stay transparent;
 *  - `body::before` paints the artwork as a fixed, cover-sized layer at
 *    z-index -1 (below every in-flow element, above the root canvas) with a
 *    per-theme scrim baked into the same layer:
 *      light palette -> airy white veil (dark text stays readable),
 *      dark palette  -> thin night veil (the artwork stays vivid);
 *  - the shell's surface tokens are re-declared with thinner RGBA values, so
 *    the sidebar, columns and cards are more see-through than the stock theme;
 *  - liquid-glass surfaces: the composer card, user bubbles, the "new session"
 *    button and file cards get backdrop blur + extra saturation + a soft top
 *    sheen, so they read as frosted glass instead of opaque black panels;
 *  - the Windows titlebar content corner is squared (its cut-out used to show
 *    as a bright notch beside the brand).
 *
 * The stylesheet is rendered by a zero-size slot occupant, so React owns its
 * insertion and removal exactly like any other component-local style.
 */
window.__ModuleLoader__.load({
  id: '@local/star-wallpaper',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const WALLPAPER = '__WALLPAPER_DATA_URI__';
    /* Official animated whale tail (APNG, 28x28) lifted from the Harness chat
       running indicator, plus its static fallback for reduced-motion users. */
    const WHALE_TAIL = '__WHALE_TAIL_DATA_URI__';
    const WHALE_STILL = '__WHALE_STILL_DATA_URI__';

    const CSS = `
html {
  background-color: #0a0917 !important;
  background-image: none !important;
}
body {
  background-color: transparent !important;
}
#root {
  background-color: transparent !important;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, calc(0.36 * var(--sws-dim))) 0%, rgba(255, 255, 255, calc(0.40 * var(--sws-dim))) 46%, rgba(255, 255, 255, calc(0.50 * var(--sws-dim))) 100%),
    url("${WALLPAPER}");
  background-position: center center, 50% center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: saturate(1.3) brightness(1.01);
}
body[data-ds-dark-theme]::before {
  background-image:
    linear-gradient(180deg, rgba(7, 9, 20, calc(0.22 * var(--sws-dim))) 0%, rgba(7, 9, 20, calc(0.12 * var(--sws-dim))) 46%, rgba(7, 9, 20, calc(0.38 * var(--sws-dim))) 100%),
    url("${WALLPAPER}");
  background-position: center center, 50% center;
  filter: saturate(1.2) contrast(1.03);
}
/* Light palette: readable panels, see-through liquid-glass components. */
body {
  --dsw-alias-bg-base: rgba(250, 252, 255, 0.26) !important;
  --dsw-alias-bg-layer-1: rgba(255, 255, 255, 0.64) !important;
  --dsw-alias-bg-layer-2: rgba(255, 255, 255, 0.74) !important;
  --dsw-alias-bg-layer-3: rgba(255, 255, 255, 0.80) !important;
  --dsw-alias-bg-overlay: rgba(246, 248, 253, 0.74) !important;
  --dsw-alias-bg-module-platform: rgba(255, 255, 255, 0.78) !important;
  --dsw-specific-sidebar-fill: rgba(250, 252, 255, 0.26) !important;
  --dsw-specific-selector: rgba(255, 255, 255, 0.30) !important;
  --dsw-specific-input-major: rgba(255, 255, 255, 0.06) !important;
  --dsw-specific-bubble: rgba(235, 242, 255, 0.06) !important;
  --dsw-menu-surface-fill: rgba(250, 251, 253, 0.90) !important;
  --dsw-specific-menu: rgba(250, 251, 253, 0.90) !important;
  --dsw-alias-menu-group-header-fill: rgba(248, 249, 251, 0.80) !important;
  --dsw-alias-button-elevated-fill: rgba(255, 255, 255, 0.06) !important;
  --dsw-menu-backdrop-filter: blur(84px) saturate(180%);
}
/* Dark palette: readable panels, liquid-glass components. */
body[data-ds-dark-theme] {
  --dsw-alias-bg-base: rgba(10, 12, 26, 0.26) !important;
  --dsw-alias-bg-layer-1: rgba(28, 31, 48, 0.64) !important;
  --dsw-alias-bg-layer-2: rgba(36, 39, 58, 0.74) !important;
  --dsw-alias-bg-layer-3: rgba(45, 48, 68, 0.80) !important;
  --dsw-alias-bg-overlay: rgba(40, 44, 60, 0.74) !important;
  --dsw-alias-bg-module-platform: rgba(40, 43, 60, 0.78) !important;
  --dsw-specific-sidebar-fill: rgba(10, 12, 26, 0.26) !important;
  --dsw-specific-selector: rgba(255, 255, 255, 0.10) !important;
  --dsw-specific-input-major: rgba(255, 255, 255, 0.025) !important;
  --dsw-specific-bubble: rgba(170, 195, 255, 0.05) !important;
  --dsw-menu-surface-fill: rgba(45, 50, 100, 0.90) !important;
  --dsw-specific-menu: rgba(45, 50, 100, 0.90) !important;
  --dsw-alias-menu-group-header-fill: rgba(44, 48, 64, 0.80) !important;
  --dsw-alias-button-elevated-fill: rgba(255, 255, 255, 0.025) !important;
  --dsw-menu-backdrop-filter: blur(84px) saturate(180%);
}
/* DSH's Windows titlebar layout rounds the content column's top-left corner
   over the frame background; over a wallpaper that cut-out reads as a bright
   notch beside the brand, so square the chrome corner in wallpaper mode. */
html[data-windows-titlebar] [class*="_centerCol"] {
  border-radius: 0 !important;
}
/* Native window controls (minimize / restore / close). The desktop preload
   samples a hidden probe span whose fill is --dsw-specific-sidebar-fill and
   forwards that colour to Electron's title-bar overlay, which then paints an
   opaque-ish film over the artwork in the top-right corner — the visible
   "colour step" beside the three buttons, and the reason each button seems to
   sit on a different shade. Force the probe transparent: the overlay becomes
   transparent too, the caption buttons float directly on the nebula, and the
   three glyphs share one continuous backdrop. */
body > span[style*="var(--dsw-specific-sidebar-fill)"] {
  background-color: rgba(0, 0, 0, 0) !important;
}
/*
 * Liquid-glass surfaces: frosted blur, saturated artwork behind, soft sheen.
 * "_newSession" also names the button's inner label/content spans, so only the
 * button itself is selected; the composer card is this build's exact
 * ui-conversation InputBar 'card' class (if a DSH update renames it the
 * composer simply stays translucent without blur). */
[class*="_bubble"],
[class*="_newSession"]:not([class*="Content"]):not([class*="Label"]):not([class*="Shortcut"]),
[class*="_fileCard"],
[class~="RlGAzG_card"] {
  -webkit-backdrop-filter: blur(72px) saturate(150%) brightness(1.0);
  backdrop-filter: blur(72px) saturate(150%) brightness(1.0);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0.025) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    inset 0 -1px 0 rgba(255, 255, 255, 0.07),
    0 16px 36px rgba(0, 0, 0, 0.22) !important;
}
body[data-ds-dark-theme] [class*="_bubble"],
body[data-ds-dark-theme] [class*="_newSession"]:not([class*="Content"]):not([class*="Label"]):not([class*="Shortcut"]),
body[data-ds-dark-theme] [class*="_fileCard"],
body[data-ds-dark-theme] [class~="RlGAzG_card"] {
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0.02) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.38),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06),
    0 16px 36px rgba(0, 0, 0, 0.26) !important;
}

/* Composer round buttons: glass instead of solid black / solid blue. */
[class~="RlGAzG_add"],
[class~="RlGAzG_primary"] {
  -webkit-backdrop-filter: blur(18px) saturate(170%);
  backdrop-filter: blur(18px) saturate(170%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.40), inset 0 0 0 0.5px rgba(255, 255, 255, 0.20), 0 4px 14px rgba(0, 0, 0, 0.18) !important;
}
[class~="RlGAzG_primary"] {
  background: rgba(58, 84, 255, 0.82) !important;
  color: #ffffff !important;
}
[class~="RlGAzG_primary"]:hover:not(:disabled) {
  background: rgba(80, 108, 255, 0.92) !important;
}

/* ===== Session header controls: Liquid Glass on hover ==================
   The row's chips (Agent Teams / agent preset / background jobs) and the
   right-hand buttons (open-in-app, overflow, sidebar expand) are flat ghost
   controls: most of them only shift their text colour on hover. Give them the
   menu's frosted material only while the pointer is over them, so the resting
   header stays clean. The chip classes are the shipped ones; the right-side
   wrappers (utilities / corner) have display:contents slot wrappers, so their
   inner buttons are matched directly. */
[class~="EBLgjq_trigger"],
[class~="foD-wG_trigger"],
[class~="b06baG_label"],
[class~="oXE0lW_trigger"],
[class~="oXE0lW_switcherTrigger"],
[class~="dzXS4q_button"],
[class~="Dc7zOa_headerUtilities"] button,
[class~="Dc7zOa_headerUtilities"] [role="button"],
[class~="Dc7zOa_headerCorner"] button {
  border-radius: 8px !important;
  transition: background-color 0.14s ease, box-shadow 0.14s ease, color 0.14s ease;
}
/* The agent-preset chip is a bare 22px inline label (no horizontal padding),
   so its hover glass would read smaller than the chips beside it. Give it the
   same padded 28px box; negative margins keep the row layout unchanged. */
[class~="b06baG_label"] {
  padding: 3px 8px !important;
  margin: -3px -6px !important;
  min-height: 22px;
}
[class~="EBLgjq_trigger"]:hover,
[class~="foD-wG_trigger"]:hover,
[class~="b06baG_label"]:hover,
[class~="oXE0lW_trigger"]:hover,
[class~="oXE0lW_switcherTrigger"]:hover,
[class~="dzXS4q_button"]:hover,
[class~="Dc7zOa_headerUtilities"] button:hover,
[class~="Dc7zOa_headerUtilities"] [role="button"]:hover,
[class~="Dc7zOa_headerCorner"] button:hover,
[class~="EBLgjq_trigger"][aria-expanded="true"],
[class~="foD-wG_trigger"][aria-expanded="true"],
[class~="oXE0lW_trigger"][aria-expanded="true"],
[class~="oXE0lW_switcherTrigger"][aria-expanded="true"],
[class~="Dc7zOa_headerUtilities"] button[aria-expanded="true"] {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.16) 0%,
    rgba(255, 255, 255, 0.05) 38%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.10) 100%
  ) !important;
  background-color: rgba(16, 18, 48, 0.30) !important;
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  backdrop-filter: blur(20px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 6px 16px rgba(0, 0, 0, 0.22) !important;
  color: var(--dsw-alias-label-primary, #f1f2ff) !important;
}
/* ===== Greeting overlay: a quiet card, surfaced only by matching input ========
   The trigger words are never shipped: they live in localStorage and are
   edited in Settings → 彩蛋. This stylesheet only paints the card when the
   overlay component decides to open. */
.swt-greeting-backdrop {
  position: fixed;
  inset: 0;
  z-index: 12000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(4, 6, 18, 0.44);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  backdrop-filter: blur(12px) saturate(120%);
  animation: swt-greeting-fade 0.55s ease both;
}
.swt-greeting-card {
  position: relative;
  box-sizing: border-box;
  width: min(560px, 100%);
  padding: 34px 36px 26px;
  border-radius: 18px;
  overflow: hidden;
  color: #e2e5ff;
  background:
    radial-gradient(120% 90% at 16% -12%, rgba(190, 190, 255, 0.16) 0%, rgba(190, 190, 255, 0) 62%),
    radial-gradient(90% 80% at 88% 116%, rgba(140, 120, 255, 0.10) 0%, rgba(140, 120, 255, 0) 58%),
    rgba(16, 18, 46, 0.74);
  -webkit-backdrop-filter: blur(46px) saturate(170%);
  backdrop-filter: blur(46px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    0 34px 90px rgba(0, 0, 0, 0.48);
  animation: swt-greeting-rise 0.6s cubic-bezier(0.22, 0.9, 0.25, 1) both;
}
.swt-greeting-star {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(230, 232, 255, 0.8);
  animation: swt-greeting-twinkle 4.5s ease-in-out infinite;
}
.swt-greeting-text {
  margin: 0;
  font-size: 15px;
  line-height: 2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: pre-wrap;
  color: #dfe3ff;
}
.swt-greeting-bless {
  margin: 22px 0 0;
  text-align: center;
  font-size: 17px;
  letter-spacing: 0.22em;
  color: #dcd6ff;
  text-shadow: 0 0 18px rgba(170, 160, 255, 0.35);
}
.swt-greeting-sig {
  margin: 20px 0 0;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.34em;
  color: rgba(160, 166, 210, 0.58);
}
.swt-greeting-close {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  color: rgba(220, 224, 255, 0.65);
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.swt-greeting-close:hover {
  color: #f1f2ff;
  background: rgba(255, 255, 255, 0.10);
}
@keyframes swt-greeting-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes swt-greeting-rise {
  from { opacity: 0; transform: translateY(14px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes swt-greeting-twinkle {
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.85; }
}

/* Settings modal builds its panel on the translucent layer-2 token; give the
   panel itself a readable frosted backing so settings pages stay usable. */
body:not([data-ds-dark-theme]) [class~="wCInkW_panel"] {
  background: rgba(248, 250, 254, 0.90) !important;
  -webkit-backdrop-filter: blur(34px) saturate(130%);
  backdrop-filter: blur(34px) saturate(130%);
}
body[data-ds-dark-theme] [class~="wCInkW_panel"] {
  background: rgba(20, 22, 60, 0.84) !important;
  -webkit-backdrop-filter: blur(66px) saturate(165%);
  backdrop-filter: blur(66px) saturate(165%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.20), inset 0 0 0 0.5px rgba(170, 178, 255, 0.15), 0 22px 48px rgba(0, 0, 0, 0.30) !important;
}
/* Hover feedback matches the glass send button instead of solid black. */
[class~="RlGAzG_add"]:hover:not(:disabled),
[class~="_2H3hWW_newSession"]:hover {
  background: rgba(70, 96, 255, 0.30) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
}
/* Delivered-file cards (the presented-files row under an assistant turn):
   the stock fill is a solid opaque neutral, so they read as flat grey slabs
   beside the glass bubbles. rc3 puts data-presented-file on the card and
   derives its fill from --deliverable-fill / --deliverable-hover, so we
   override those two variables on the card itself and add the same blur +
   specular rim the other glass surfaces use. The old flL80G_* rules were
   rc2 class hashes and had gone inert. */
body[data-ds-dark-theme] [data-presented-file] {
  --deliverable-fill: rgba(255, 255, 255, 0.07) !important;
  --deliverable-hover: rgba(255, 255, 255, 0.14) !important;
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  backdrop-filter: blur(30px) saturate(150%);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.10) 0%,
    rgba(255, 255, 255, 0.02) 46%,
    rgba(255, 255, 255, 0.05) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
}
body:not([data-ds-dark-theme]) [data-presented-file] {
  --deliverable-fill: rgba(255, 255, 255, 0.40) !important;
  --deliverable-hover: rgba(255, 255, 255, 0.60) !important;
}

/* 'Open with File Explorer' split button: swap the colorful app logo for a
   monochrome folder line icon so it matches the rest of the header chrome. */
[class*="WgQWqa_appIcon"] { display: none !important; }
[class~="WgQWqa_main"]::before {
  content: "";
  width: 14px;
  height: 14px;
  flex: none;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPSdibGFjaycgc3Ryb2tlLXdpZHRoPScxLjcnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PHBhdGggZD0nTTMuNSA3LjVBMS41IDEuNSAwIDAgMSA1IDZoMy44bDIgMkgxOWExLjUgMS41IDAgMCAxIDEuNSAxLjV2OEExLjUgMS41IDAgMCAxIDE5IDE5SDVhMS41IDEuNSAwIDAgMS0xLjUtMS41eicvPjwvc3ZnPg==") center / contain no-repeat;
  mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPSdibGFjaycgc3Ryb2tlLXdpZHRoPScxLjcnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PHBhdGggZD0nTTMuNSA3LjVBMS41IDEuNSAwIDAgMSA1IDZoMy44bDIgMkgxOWExLjUgMS41IDAgMCAxIDEuNSAxLjV2OEExLjUgMS41IDAgMCAxIDE5IDE5SDVhMS41IDEuNSAwIDAgMS0xLjUtMS41eicvPjwvc3ZnPg==") center / contain no-repeat;
}
[class~="WgQWqa_split"] {
  border-color: var(--dsw-alias-border-l4) !important;
  background: transparent !important;
}
[class~="WgQWqa_main"]:hover:not(:disabled),
[class~="WgQWqa_chevron"]:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}

/* Dark theme is locked; hide the light/dark chooser row in Settings. */
[class*="v01cdW_group"] { display: none !important; }

/* Shared menu/popover primitive: readable glass with a specular rim. */
[class*="q7hbua_menu"] {
  background: var(--dsw-specific-menu) !important;
  -webkit-backdrop-filter: blur(70px) saturate(170%);
  backdrop-filter: blur(70px) saturate(170%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 18px 40px rgba(0, 0, 0, 0.30) !important;
}

/* Monet-style theme derived from the wallpaper: deep indigo ink + periwinkle
   accent (sampled from the nebula), so menus and panels are tinted glass
   instead of neutral black. */
body[data-ds-dark-theme] {
  --dsw-alias-bg-base: rgba(12, 14, 44, 0.30) !important;
  --dsw-specific-sidebar-fill: rgba(12, 14, 44, 0.30) !important;
  --dsw-alias-bg-layer-1: rgba(22, 24, 62, 0.66) !important;
  --dsw-alias-bg-layer-2: rgba(28, 31, 78, 0.74) !important;
  --dsw-alias-bg-layer-3: rgba(35, 38, 92, 0.80) !important;
  --dsw-alias-bg-module-platform: rgba(30, 33, 84, 0.80) !important;
  --dsw-alias-bg-overlay: rgba(26, 29, 76, 0.85) !important;
  --dsw-specific-menu: rgba(45, 50, 100, 0.90) !important;
  --dsw-menu-surface-fill: rgba(45, 50, 100, 0.90) !important;
  --dsw-alias-menu-group-header-fill: rgba(55, 60, 115, 0.92) !important;
  --dsw-alias-brand-primary: #8b82f5 !important;
  --dsw-alias-button-primary-fill: #8b82f5 !important;
  --dsw-alias-button-primary-hover: #9d94ff !important;
  --dsw-alias-button-primary-dimmed: #4c468f !important;
  --dsw-alias-label-primary-foreground: #ffffff !important;
  --dsw-alias-link: #a99fff !important;
  --dsw-alias-state-business-primary: #8b82f5 !important;
  --dsw-alias-button-info-fill: #3f5aff !important;
  --dsw-alias-button-info-hover: #5f74ff !important;
  --dsw-alias-label-primary: #f1f2ff !important;
  --dsw-alias-label-secondary: #c4c9f2 !important;
  --dsw-alias-label-tertiary: #9ba1d9 !important;
  --dsw-alias-label-caption: #868dc7 !important;
  --dsw-alias-border-l1: rgba(160, 168, 255, 0.10) !important;
  --dsw-alias-border-l2: rgba(160, 168, 255, 0.16) !important;
  --dsw-alias-border-l3: rgba(160, 168, 255, 0.22) !important;
  --dsw-alias-border-l4: rgba(160, 168, 255, 0.28) !important;
  --dsw-alias-interactive-bg-hover: rgba(150, 160, 255, 0.07) !important;
  --dsw-alias-interactive-bg-hover-solid: rgba(160, 170, 255, 0.12) !important;
  --dsw-alias-interactive-bg-active: rgba(170, 180, 255, 0.14) !important;
  --dsw-specific-sidebar-nav-item-hover: rgba(150, 160, 255, 0.07) !important;
  --dsw-specific-input-major: rgba(40, 44, 110, 0.10) !important;
  --dsw-specific-bubble: rgba(140, 150, 255, 0.10) !important;
  --dsw-alias-button-elevated-fill: rgba(150, 158, 255, 0.10) !important;
}



/* Hover highlight follows the option's own rounded rect (no corner leaks). */

:is(
  [role="menuitem"]:hover,
  [role="option"]:hover,
  [class*="Z9Jnlq_item"]:hover,
  [class*="_3tUStW_item"]:hover,
  [class*="foD-wG_row"]:hover,
  [class*="Woyo-G_row"]:hover,
  [class*="wq12jW_option"]:hover,
  [class*="oXE0lW_row"]:hover
) {
  border-radius: inherit !important;
}


/* Menu item hover: glossy glass painted directly on the option row (one
   layer, rounded to the row's own corners). */
:is(
  [role="menuitem"]:hover, [role="menuitem"][aria-checked="true"],
  [role="option"]:hover, [role="option"][aria-selected="true"],
  [class*="EhuiKa_row"]:hover, [class*="EhuiKa_rowActive"],
  [class*="q7hbua_rowTask"]:hover, [class*="v1kfCW_action"]:hover,
  [class*="wCInkW_navCell"]:hover,
  [class*="Z9Jnlq_item"]:hover, [class*="_3tUStW_item"]:hover,
  [class*="foD-wG_row"]:hover, [class*="Woyo-G_row"]:hover,
  [class*="wq12jW_option"]:hover, [class*="oXE0lW_row"]:hover
) {
  border-radius: 10px !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}

/* Nested rows inside a menu row must never paint a second highlight: only the
   outermost option row carries the hover glass. */
:is(
  [role="menuitem"], [role="option"],
  [class*="EhuiKa_row"], [class*="q7hbua_rowTask"], [class*="v1kfCW_action"],
  [class*="wCInkW_navCell"], [class*="Z9Jnlq_item"], [class*="_3tUStW_item"],
  [class*="foD-wG_row"], [class*="Woyo-G_row"], [class*="wq12jW_option"],
  [class*="oXE0lW_row"]
) :is(
  [role="menuitem"], [role="option"],
  [class*="EhuiKa_row"], [class*="q7hbua_rowTask"], [class*="v1kfCW_action"],
  [class*="wCInkW_navCell"], [class*="Z9Jnlq_item"], [class*="_3tUStW_item"],
  [class*="foD-wG_row"], [class*="Woyo-G_row"], [class*="wq12jW_option"],
  [class*="oXE0lW_row"]
) {
  background-image: none !important;
  box-shadow: none !important;
}

/* Left sidebar rows get the same liquid-glass hover as menu options. */
:is(
  [class*="_2H3hWW_panelRow"]:hover,
  [class*="_2H3hWW_panelRow"][class*="_2H3hWW_panelActive"],
  [class*="_2H3hWW_regionArea"] :is(button, [role="button"], [role="treeitem"], [role="option"], [role="tab"]):hover,
  [class*="_2H3hWW_settingsArea"] :is(button, [role="button"]):hover,
  [class*="_2H3hWW_footArea"] :is(button, [role="button"]):hover
) {
  border-radius: 10px !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
/* Nested buttons inside a sidebar row must not paint a second layer. */
:is([class*="_2H3hWW_regionArea"] :is(button, [role="button"], [role="treeitem"])) :is(button, [role="button"]) {
  background-image: none !important;
  box-shadow: none !important;
}

/* Persistent highlight of the CURRENT conversation in the workspace list:
   repaint it as liquid glass instead of a flat block. */
[class*="_2H3hWW_regionArea"] :is(
  [aria-selected="true"],
  [aria-current="true"],
  [aria-current="page"],
  [data-active="true"],
  [data-selected="true"],
  [class*="_rowActive"],
  [class*="_sessionActive"],
  [class*="_itemActive"]
) {
  border-radius: 10px !important;
  background-color: transparent !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
/* Nested parts of the active row must not stack a second glass layer. */
[class*="_2H3hWW_regionArea"] :is(
  [aria-selected="true"],
  [data-active="true"],
  [class*="_rowActive"],
  [class*="_sessionActive"]
) :is([aria-selected="true"], [data-active="true"], [class*="_active"]) {
  background-image: none !important;
  box-shadow: none !important;
}

/* Session hover card (primitives HoverCard): the stock component hardcodes a
   flat #2C2C2E panel instead of a theme token, so hovering a session showed a
   grey box floating over the artwork. Put it on the same deep-navy frosted
   glass as every other secondary menu. */
[class*="_card_38jqx_"] {
  --dsw-hovercard-bg: transparent !important;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    rgba(45, 50, 100, 0.92) !important;
  -webkit-backdrop-filter: blur(64px) saturate(170%);
  backdrop-filter: blur(64px) saturate(170%);
  border-radius: 14px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.12),
    0 16px 36px rgba(0, 0, 0, 0.34) !important;
}

/* Standalone popovers/dialogs (agent team, registry pickers, schedule menu):
   same deep-navy frosted glass as the other secondary menus. */
:is(
  [class*="Xt1eiG_panel"],
  [class*="_2WTFBq_panel"],
  [class*="CVUQCW_panel"],
  [class*="_VovcG_panel"],
  /* The plugin installer's registry picker is a bare <fieldset>: match the
     panel class token exactly, otherwise class*="fO69Vq_registry" also hits
     registryToggle / registryOption / registryCustomField and turns every row
     inside the popover into its own frosted card (stacked translucent layers,
     text bleeding through). */
  [class~="fO69Vq_registry"],
  [class*="q7hbua_menu"]
) {
  background: rgba(45, 50, 100, 0.90) !important;
  -webkit-backdrop-filter: blur(60px) saturate(120%);
  backdrop-filter: blur(60px) saturate(120%);
  border-radius: 14px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.07),
    0 14px 30px rgba(0, 0, 0, 0.30) !important;
}
/* The installer's registry popover floats above the install dialog, so it
   needs a denser fill than a standalone menu: the dialog copy underneath
   (the source warning + the install button) must not read through the panel. */
[class~="fO69Vq_registry"] {
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    rgba(32, 36, 82, 0.965) !important;
}

/* Agent-team popover (EBLgjq_panel): real liquid glass on its ::before layer,
   matching rounded rect, no black elevation stroke. */
[class*="EBLgjq_panel"] {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28) !important;
}
[class*="EBLgjq_panel"]::before {
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.10) 0%,
      rgba(255, 255, 255, 0.03) 26%,
      rgba(255, 255, 255, 0.015) 60%,
      rgba(255, 255, 255, 0.06) 100%
    ),
    rgba(30, 34, 80, 0.55) !important;
  -webkit-backdrop-filter: blur(80px) saturate(170%) !important;
  backdrop-filter: blur(80px) saturate(170%) !important;
  border-radius: 16px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.36),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.18) !important;
}
/* Only the panel carries glass; inner rows/tiles stay flat so text never
   stacks multiple glass layers. */
[class*="EBLgjq_member"],
[class*="EBLgjq_task"],
[class*="EBLgjq_body"] {
  background: transparent !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
[class*="EBLgjq_member"]:not(:disabled):hover,
[class*="EBLgjq_member"]:not(:disabled):focus-visible,
[class*="EBLgjq_memberCurrent"] {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}

/* 自动化任务 page (ui-schedule, "q7hbua_" classes): buttons and row
   highlights get the send-button blue liquid glass, original colours kept. */
[class*="q7hbua_"] :is(button, [role="button"]):hover,
[class*="q7hbua_"] :is(button, [role="button"]):focus-visible,
[class*="q7hbua_row"]:hover,
[class*="q7hbua_rowTask"]:hover {
  border-radius: 10px !important;
  background-image: linear-gradient(
    180deg,
    rgba(96, 118, 255, 0.30) 0%,
    rgba(58, 84, 255, 0.16) 45%,
    rgba(58, 84, 255, 0.10) 70%,
    rgba(96, 118, 255, 0.20) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.26),
    0 3px 12px rgba(0, 0, 0, 0.18) !important;
}
/* Don't stack a second layer on nested parts. */
[class*="q7hbua_"] :is(button, [role="button"]) :is(button, [role="button"]) {
  background-image: none !important;
  box-shadow: none !important;
}

/* Schedule card in the transcript (ui-schedule ScheduleCreateCard, "QSKnSa_"
   classes): the shipped card paints its own opaque neutral fill through
   --card-fill / --card-hover instead of a theme token, so a schedule_create
   result sat on the artwork as a flat grey box while every other in-chat card
   was glass. Re-point both variables at the deep-navy frosted material so the
   resting fill, the click-anywhere overlay's hover and the transition all
   inherit it, then add the shared sheen. */
[class~="QSKnSa_card"] {
  --card-fill: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.07) 0%,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    rgba(45, 50, 100, 0.52) !important;
  --card-hover: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.10) 0%,
      rgba(255, 255, 255, 0.03) 32%,
      rgba(255, 255, 255, 0.05) 100%
    ),
    rgba(56, 62, 120, 0.62) !important;
  border-color: rgba(150, 170, 255, 0.18) !important;
  -webkit-backdrop-filter: blur(64px) saturate(170%);
  backdrop-filter: blur(64px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.08),
    0 10px 24px rgba(0, 0, 0, 0.22) !important;
}
/* Clock tile keeps the Monet periwinkle tint instead of the stock neutral one. */
[class~="QSKnSa_leading"] {
  border-color: rgba(150, 170, 255, 0.22) !important;
  background: rgba(96, 118, 255, 0.16) !important;
  color: rgba(214, 221, 255, 0.95) !important;
}

/* Restore the sidebar's base glass (lost during earlier CSS surgery):
   new-session button + active nav rows. */
[class~="_2H3hWW_newSession"] {
  border-radius: 10px !important;
  -webkit-backdrop-filter: blur(72px) saturate(150%);
  backdrop-filter: blur(72px) saturate(150%);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0) 26%,
    rgba(255, 255, 255, 0.025) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06),
    0 6px 18px rgba(0, 0, 0, 0.18) !important;
}
[class~="_2H3hWW_newSession"] > * {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
[class*="_2H3hWW_panelRow"][class*="_2H3hWW_panelActive"] {
  border-radius: 10px !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
/* Current conversation row: also catch class-based active states. */
[class*="_2H3hWW_regionArea"] :is(button, [role="treeitem"], [role="option"], a)[class*="_active"],
[class*="_2H3hWW_regionArea"] :is(button, [role="treeitem"], [role="option"], a)[data-state="active"] {
  border-radius: 10px !important;
  background-color: transparent !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}

/* Start-page entries: liquid glass (subtle indigo tint + sheen + rim, no
   outer shadow so the sidebar never casts a dark band). */
[class~="unKlVG_entry"], [class~="unKlVG_entryCell"] {
  -webkit-backdrop-filter: blur(72px) saturate(150%);
  backdrop-filter: blur(72px) saturate(150%);
  background-color: rgba(40, 44, 110, 0.14) !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0) 26%,
    rgba(255, 255, 255, 0.025) 100%
  ) !important;
  border-color: rgba(255, 255, 255, 0.14) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.36),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
  border-radius: 16px;
}
[class~="unKlVG_entryCell"] [class~="unKlVG_entry"],
[class~="unKlVG_entryCell"] * {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
/* Compass: white glyph. */
[class~="unKlVG_hero"], [class~="unKlVG_hero"] svg { color: #ffffff !important; }


/* Structural fallbacks for the right sidebar (attribute-based, independent of
   hashed class names). */
/* Start-page entry buttons inside the empty tab host. */
[data-dockkit-empty] button {
  -webkit-backdrop-filter: blur(72px) saturate(150%) !important;
  backdrop-filter: blur(72px) saturate(150%) !important;
  background: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  border-radius: 16px !important;
}
[data-dockkit-empty] button * {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}
/* Compass + first entry icon tone. */
[data-dockkit-empty] > *:first-child svg {
  color: #ffffff !important;
}
[data-dockkit-empty] button:first-of-type svg {
  color: #2f9bf0 !important;
}

/* Fullscreen right sidebar: transparent panel with a heavy background blur
   (no shadows — the panel must not cast a dark band). */
[data-sidebar-right-panel="fullscreen"] {
  background: transparent !important;
  -webkit-backdrop-filter: blur(52px) saturate(185%) brightness(1.04) !important;
  backdrop-filter: blur(52px) saturate(185%) brightness(1.04) !important;
}
[data-sidebar-right-panel="fullscreen"] [class*="paneBody_"],
[data-sidebar-right-panel="fullscreen"] [class*="emptyTabHost_"],
[data-sidebar-right-panel="fullscreen"] [class*="tabHost_"],
[data-sidebar-right-panel="fullscreen"] [class*="tabCell_"],
[data-sidebar-right-panel="fullscreen"] [class*="pane_"] {
  background: transparent !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

/* Fullscreen right sidebar must cover the composer / status bar. */
[class~="OUqwTW_panel"] {
  z-index: 300 !important;
}
[class~="OUqwTW_panel"][data-sidebar-right-panel="fullscreen"] {
  z-index: 320 !important;
}
/* Workspace-files icon tone: force a blue monochrome tint (works for the
   coloured file-type glyph as well). */
[class*="unKlVG_guide"] > :first-child [class~="unKlVG_entryIcon"] {
  filter: grayscale(1) brightness(1.9) sepia(1) hue-rotate(175deg) saturate(4) !important;
}

/* All start-page entry icons: the same blue monochrome tone (filter only on
   the icon wrapper — applying it to descendants too stacked twice and washed
   the folder/browser glyphs out to white). */
[class*="unKlVG_entryIcon"] {
  filter: brightness(0.72) sepia(1) saturate(6) hue-rotate(178deg) brightness(1.25) !important;
}

/* Markdown code blocks: replace the pure-black surface with the Monet indigo
   ink, keeping enough contrast for the syntax colours. */
body[data-ds-dark-theme] {
  --dsw-alias-markdown-code-block: rgba(16, 19, 52, 0.82) !important;
  --dsw-alias-markdown-code-block-bg: rgba(16, 19, 52, 0.82) !important;
  --dsw-alias-markdown-code-inline: rgba(120, 132, 255, 0.14) !important;
  --dsw-specific-code-block: rgba(16, 19, 52, 0.82) !important;
}
[class*="_body_74oxc_"] pre,
.markdown pre {
  border-radius: 12px !important;
}

/* Code surfaces: defeat any remaining pure-black backgrounds regardless of
   which component renders them. */
body[data-ds-dark-theme] pre,
body[data-ds-dark-theme] [class*="codeBlock"],
body[data-ds-dark-theme] [class*="code-block"],
body[data-ds-dark-theme] [class*="CodeBlock"],
body[data-ds-dark-theme] [class*="_code"],
body[data-ds-dark-theme] [class*="syntax"] {
  background: rgba(16, 19, 52, 0.82) !important;
  background-color: rgba(16, 19, 52, 0.82) !important;
}
body[data-ds-dark-theme] pre,
body[data-ds-dark-theme] [class*="codeBlock"],
body[data-ds-dark-theme] [class*="CodeBlock"] {
  border-radius: 12px !important;
  box-shadow: inset 0 1px 0 rgba(140, 150, 255, 0.10) !important;
}

/* Settings left nav: the selected grey block becomes liquid glass. */
[class~="wCInkW_navCell"] {
  border-radius: 10px !important;
}
[class~="wCInkW_navCell"]:hover,
[class~="wCInkW_navCell"][class~="wCInkW_active"] {
  background-color: transparent !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
[class~="wCInkW_navCell"] * {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

/* ===== Self-drawn title-bar menus =====================================
   The desktop preload opens native (Chromium-drawn, grey, square) popup
   menus for 「应用 / 编辑」. The plugin intercepts those buttons and paints
   the same deep-navy frosted glass used by every other secondary menu, so
   the title bar finally matches the rest of the theme. */
.swt-menu {
  position: fixed;
  z-index: 1400;
  min-width: 216px;
  max-width: 340px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(45, 50, 100, 0.90);
  -webkit-backdrop-filter: blur(84px) saturate(180%);
  backdrop-filter: blur(84px) saturate(180%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.12),
    0 18px 40px rgba(0, 0, 0, 0.34);
  opacity: 0;
  transform: translateY(-4px) scale(0.985);
  transform-origin: top left;
  transition: opacity 90ms ease, transform 120ms cubic-bezier(0.2, 0.9, 0.3, 1.15);
  will-change: opacity, transform;
}
.swt-menu.is-open {
  opacity: 1;
  transform: none;
}
.swt-menu-item {
  display: flex;
  align-items: center;
  gap: 26px;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  margin: 0;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #f1f2ff);
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  cursor: default;
  outline: none;
}
.swt-menu-item:hover,
.swt-menu-item.is-active,
.swt-menu-item:focus-visible {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18);
  color: var(--dsw-alias-label-primary, #f1f2ff);
}
.swt-menu-key {
  margin-left: auto;
  color: var(--dsw-alias-label-tertiary, #9ba1d9);
  font-size: 12px;
  letter-spacing: 0.01em;
}
.swt-menu-sep {
  height: 1px;
  margin: 5px 10px;
  background: rgba(160, 168, 255, 0.16);
}

/* ===== Settings sections: About / Exit ================================ */
.sws-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0 10px;
}
.sws-card {
  border-radius: 16px;
  padding: 18px 20px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.055) 0%,
      rgba(255, 255, 255, 0) 34%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    rgba(24, 27, 70, 0.44);
  -webkit-backdrop-filter: blur(60px) saturate(160%);
  backdrop-filter: blur(60px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.20);
}
.sws-wordmark {
  font-size: 26px;
  line-height: 34px;
  font-weight: 600;
  letter-spacing: 0.005em;
  color: #ffffff;
}
.sws-tagline {
  margin-top: 6px;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-tertiary, #9ba1d9);
}
.sws-rows {
  overflow: hidden;
  border-radius: 14px;
  background: rgba(24, 27, 70, 0.34);
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.12);
}
.sws-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 13px 16px;
}
.sws-row + .sws-row {
  border-top: 0.5px solid rgba(160, 168, 255, 0.14);
}
.sws-row-label {
  flex: none;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary, #c4c9f2);
}
.sws-row-value {
  margin-left: auto;
  font-size: 13px;
  color: var(--dsw-alias-label-primary, #f1f2ff);
  text-align: right;
}
.sws-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  color: var(--dsw-alias-label-primary, #f1f2ff);
}
.sws-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 21px;
  color: var(--dsw-alias-label-secondary, #c4c9f2);
}
.sws-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.sws-btn {
  appearance: none;
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: rgba(58, 84, 255, 0.82);
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.20),
    0 4px 14px rgba(0, 0, 0, 0.18);
}
.sws-btn:hover:not(:disabled) {
  background: rgba(80, 108, 255, 0.92);
}
.sws-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Settings -> 背景 -> 压暗 */
.sws-dim { margin-top: 16px; padding: 12px 14px 13px; border-radius: 12px; background: rgba(255, 255, 255, 0.04); box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.1); }
.sws-dim-head { display: flex; align-items: center; gap: 10px; }
.sws-dim-value { margin-left: auto; font-size: 12px; font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-primary, #f1f2ff); }
.sws-dim-control { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
.sws-dim-range { flex: 1; height: 18px; margin: 0; accent-color: #4d6bff; cursor: pointer; }
.sws-dim-input { appearance: none; width: 58px; height: 28px; padding: 0 8px; border: 0; border-radius: 8px; background: rgba(255, 255, 255, 0.06); box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.14); color: var(--dsw-alias-label-primary, #f1f2ff); font: inherit; font-size: 12px; font-variant-numeric: tabular-nums; text-align: right; }
.sws-dim-unit { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary, #9ba1d9); }
.sws-dim-note { margin-top: 8px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary, #9ba1d9); }

/* ===== Whale tail replaces every spinning loader =====================
   The official running indicator in the Chat is an APNG whale tail masked
   with currentColor. Reuse the exact same asset for every ring spinner in
   the UI (attachment, settings account/general, CoT translation) so the
   theme has one loading language instead of blue circles. */
[class*="_spinner"] {
  -webkit-mask: url("${WHALE_TAIL}") center center / contain no-repeat !important;
  mask: url("${WHALE_TAIL}") center center / contain no-repeat !important;
  background: currentColor !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  animation: none !important;
  display: inline-block !important;
  vertical-align: middle !important;
  flex: none;
  position: relative;
}
[class*="_spinner"] > * {
  display: none !important;
}
[class*="_spinner"]::before,
[class*="_spinner"]::after {
  display: none !important;
  content: none !important;
}
@media (prefers-reduced-motion: reduce) {
  [class*="_spinner"] {
    -webkit-mask-image: url("${WHALE_STILL}") !important;
    mask-image: url("${WHALE_STILL}") !important;
  }
}

/* ===== ask_user_question card ========================================
   The stock card paints --dsw-specific-input-major, which this theme thins
   to 10% alpha, so the question window read as a hole in the wallpaper and
   did not match the settings panel. Give it the same deep-navy frosted
   glass, and unify its rows with the rest of the theme. */
[class~="mAtvLq_card"],
[class~="P2izSq_card"] {
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0) 34%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    rgba(20, 22, 60, 0.42) !important;
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(0.94);
  backdrop-filter: blur(40px) saturate(180%) brightness(0.94);
  border-radius: 18px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 0 0 0.5px rgba(170, 178, 255, 0.16),
    0 18px 44px rgba(0, 0, 0, 0.34) !important;
}
[class~="mAtvLq_eyebrow"] {
  color: rgba(170, 176, 235, 0.85) !important;
}
[class~="mAtvLq_option"] {
  border-radius: 10px !important;
}
[class~="mAtvLq_option"]:hover:not(:disabled),
[class~="mAtvLq_option"][class~="mAtvLq_optionSelected"] {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
[class~="mAtvLq_option"][class~="mAtvLq_optionSelected"] {
  border-color: rgba(160, 168, 255, 0.42) !important;
}
[class~="mAtvLq_number"] {
  background: rgba(150, 160, 255, 0.14) !important;
  border-radius: 7px !important;
}
[class~="mAtvLq_customRow"] {
  border-radius: 10px !important;
}
[class~="mAtvLq_customRow"]:hover,
[class~="mAtvLq_customRow"]:focus-within {
  background: rgba(150, 160, 255, 0.09) !important;
}
[class~="mAtvLq_customBlock"] {
  background: rgba(10, 12, 36, 0.62) !important;
  border-color: rgba(160, 168, 255, 0.22) !important;
  border-radius: 12px !important;
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  backdrop-filter: blur(24px) saturate(160%);
}
[class~="mAtvLq_customBlock"]:focus-within {
  border-color: var(--dsw-alias-state-business-primary, #8b82f5) !important;
}
[class~="mAtvLq_footerActions"] button {
  border-radius: 10px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
}
[class~="mAtvLq_footerActions"] > button:first-of-type {
  background: rgba(150, 160, 255, 0.10) !important;
  color: var(--dsw-alias-label-primary) !important;
}
[class~="mAtvLq_footerActions"] > button:first-of-type:hover:not(:disabled) {
  background: rgba(150, 160, 255, 0.18) !important;
}
[class~="mAtvLq_footerActions"] > button:last-of-type {
  background: rgba(58, 84, 255, 0.82) !important;
  color: #ffffff !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.20),
    0 4px 14px rgba(0, 0, 0, 0.18) !important;
}
[class~="mAtvLq_footerActions"] > button:last-of-type:hover:not(:disabled) {
  background: rgba(80, 108, 255, 0.92) !important;
}
[class~="mAtvLq_footerActions"] > button:last-of-type:disabled {
  background: rgba(58, 84, 255, 0.32) !important;
  color: rgba(255, 255, 255, 0.55) !important;
}

/* ===== Plugins page (ui-plugin-manager) & Automation page (ui-schedule) ====
   Both pages paint their row highlights and pills with the bare interactive
   token, which reads as flat grey-blue blocks over the artwork. Use the same
   liquid-glass row/pill recipe as the sidebar and secondary menus, and give
   their buttons a glass sheen without changing the brand hue. */
[class~="fO69Vq_cardLink"]:hover,
[class~="fO69Vq_row"]:hover,
[class~="fO69Vq_rowOpen"]:hover,
[class~="S0jZwq_row"]:hover,
[class~="S0jZwq_selectedRow"] {
  border-radius: 12px !important;
  background-color: transparent !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
/* Rows must not stack a second glass layer on their inner lines/buttons. */
[class~="fO69Vq_cardLink"] [class~="fO69Vq_cardOpen"]:hover,
[class~="fO69Vq_row"] :is([class~="fO69Vq_rowLine"], [class~="fO69Vq_rowMain"]):hover,
[class~="S0jZwq_row"] [class~="S0jZwq_rowContent"]:hover {
  background-image: none !important;
  box-shadow: none !important;
}

/* Plugins page: split "添加插件" button (primary + dropdown half). */
:is(
  [class~="fO69Vq_addButton"],
  [class~="fO69Vq_addPrimary"],
  [class~="fO69Vq_addMore"]
) {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.30) 0%,
    rgba(255, 255, 255, 0.05) 44%,
    rgba(255, 255, 255, 0) 56%,
    rgba(0, 0, 0, 0.10) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.25),
    0 6px 16px rgba(30, 32, 110, 0.30) !important;
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  backdrop-filter: blur(14px) saturate(160%);
}
:is(
  [class~="fO69Vq_addButton"],
  [class~="fO69Vq_addPrimary"],
  [class~="fO69Vq_addMore"]
):hover:not(:disabled) {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.30),
    0 8px 20px rgba(40, 44, 140, 0.38) !important;
}

/* Automation page: primary "新建" + secondary empty-state action. */
[class~="S0jZwq_newButton"] {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.30) 0%,
    rgba(255, 255, 255, 0.05) 44%,
    rgba(255, 255, 255, 0) 56%,
    rgba(0, 0, 0, 0.10) 100%
  ) !important;
  border-radius: 14px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.25),
    0 6px 16px rgba(30, 32, 110, 0.30) !important;
}
[class~="S0jZwq_emptyAction"] {
  background-color: rgba(150, 160, 255, 0.10) !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.02) 48%,
    rgba(255, 255, 255, 0.06) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16) !important;
}
[class~="S0jZwq_emptyAction"]:hover:not(:disabled) {
  background-color: rgba(150, 160, 255, 0.18) !important;
}

/* Automation page: filter pills ("全部 / 已开启 / 已结束"). */
[class~="S0jZwq_filterTab"] {
  border-radius: 12px !important;
}
[class~="S0jZwq_filterTab"]:hover,
[class~="S0jZwq_filterTab"][class~="S0jZwq_filterTabActive"] {
  background-color: transparent !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
  color: var(--dsw-alias-label-primary, #f1f2ff) !important;
}

/* Automation page: search field sits on the artwork — give it a glass bed. */
[class~="S0jZwq_searchField"] {
  background: rgba(14, 16, 44, 0.42) !important;
  border-color: rgba(160, 168, 255, 0.18) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.10) !important;
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  backdrop-filter: blur(24px) saturate(150%);
}
[class~="S0jZwq_searchField"]:focus-within {
  border-color: rgba(139, 130, 245, 0.60) !important;
}

/* ===== Monet switches + icon-button highlights ========================
   The stock Switch paints a flat border token / brand fill, and small icon
   buttons (refresh, clear, detail actions) hover with the bare interactive
   token. Give both the liquid-glass treatment: Monet periwinkle gradient on
   the checked track, a glass thumb, and a frosted rim on icon hover. */
[class~="_switch_1ik0f_5"] {
  background: rgba(120, 128, 200, 0.20) !important;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  backdrop-filter: blur(12px) saturate(160%);
  transition: background 140ms ease, box-shadow 140ms ease;
}
[class~="_switch_1ik0f_5"][aria-checked="true"] {
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.28) 0%,
      rgba(255, 255, 255, 0.04) 45%,
      rgba(255, 255, 255, 0) 60%,
      rgba(0, 0, 0, 0.08) 100%
    ),
    linear-gradient(135deg, #6b62e8 0%, #8b82f5 55%, #a99fff 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.30),
    0 2px 10px rgba(107, 98, 232, 0.42) !important;
}
[class~="_switch_1ik0f_5"]:hover:not(:disabled) {
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.26),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.22),
    0 0 0 3px rgba(139, 130, 245, 0.10) !important;
}
[class~="_thumb_1ik0f_33"] {
  background:
    radial-gradient(circle at 35% 28%, #ffffff 0%, #eef0ff 48%, #d3d7ff 100%) !important;
  box-shadow:
    0 1px 2px rgba(6, 8, 24, 0.35),
    0 0 0 0.5px rgba(255, 255, 255, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
}
:is(
  [class~="fO69Vq_iconButton"],
  [class~="S0jZwq_detailIconButton"],
  [class~="S0jZwq_searchClear"]
):hover:not(:disabled) {
  background-color: transparent !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.18) !important;
  border-radius: 10px !important;
  color: var(--dsw-alias-label-primary, #f1f2ff) !important;
}

/* Generic tooltips (role="tooltip") float over the artwork too — give them a
   small navy glass bubble instead of the stock grey box. */
[role="tooltip"] {
  background: rgba(30, 34, 78, 0.92) !important;
  -webkit-backdrop-filter: blur(40px) saturate(160%);
  backdrop-filter: blur(40px) saturate(160%);
  border-radius: 8px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.12),
    0 10px 24px rgba(0, 0, 0, 0.30) !important;
}

/* ===== Composer dock readings (turns / tok/s / cache hit) =============
   These 12px pills sit directly on the artwork under the composer, and
   label-tertiary vanishes whenever the wallpaper turns bright. Give every
   reading a faint glass chip with a dark bed, brighter text and a shadow
   so it stays legible on any part of the artwork. */
[class*="iq1doa_pill"] {
  color: var(--dsw-alias-label-secondary, #c4c9f2) !important;
  background: rgba(8, 10, 30, 0.34) !important;
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border-radius: 8px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.10) !important;
  text-shadow: 0 1px 2px rgba(3, 5, 16, 0.65);
  font-weight: 500;
  letter-spacing: 0.01em;
}
[class*="iq1doa_pill"] svg {
  opacity: 0.9;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
}
[class*="iq1doa_sep"] {
  color: rgba(165, 172, 225, 0.45) !important;
  text-shadow: 0 1px 2px rgba(3, 5, 16, 0.55);
}
button[class*="iq1doa_pill"]:hover,
button[class*="iq1doa_pill"][aria-expanded="true"] {
  background: rgba(20, 24, 64, 0.58) !important;
  color: var(--dsw-alias-label-primary, #f1f2ff) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16) !important;
}

/* Context meter (ring + percentage, right of the dock pills) has the same
   readability problem: same glass chip treatment and a visible ring. */
[class~="_2WTFBq_trigger"] {
  color: var(--dsw-alias-label-secondary, #c4c9f2) !important;
  background: rgba(8, 10, 30, 0.34) !important;
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border-radius: 8px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.10) !important;
  text-shadow: 0 1px 2px rgba(3, 5, 16, 0.65);
  font-weight: 500;
}
[class~="_2WTFBq_trigger"]:hover,
[class~="_2WTFBq_trigger"][aria-expanded="true"] {
  background: rgba(20, 24, 64, 0.58) !important;
  color: var(--dsw-alias-label-primary, #f1f2ff) !important;
}
[class~="_2WTFBq_track"] {
  stroke: rgba(170, 178, 235, 0.34) !important;
}
[class~="_2WTFBq_fill"] {
  stroke: var(--dsw-alias-brand-primary, #8b82f5) !important;
}

/* ===== Stable skin layer: runtime-tagged anchors ======================
   installTagger() marks the components that carry the theme's identity with
   data-sws-* attributes. The rules below reproduce the hashed rules through
   those hooks, so a DSH class-hash rebuild degrades to "fewer niceties"
   instead of "half-painted theme". Keep values in sync with the hash rules. */
[data-sws-composer] {
  -webkit-backdrop-filter: blur(72px) saturate(150%) brightness(1.0);
  backdrop-filter: blur(72px) saturate(150%) brightness(1.0);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0.025) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    inset 0 -1px 0 rgba(255, 255, 255, 0.07),
    0 16px 36px rgba(0, 0, 0, 0.22) !important;
}
body[data-ds-dark-theme] [data-sws-composer] {
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0.02) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.38),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06),
    0 16px 36px rgba(0, 0, 0, 0.26) !important;
}
[data-sws-send],
[data-sws-add] {
  -webkit-backdrop-filter: blur(18px) saturate(170%);
  backdrop-filter: blur(18px) saturate(170%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.40), inset 0 0 0 0.5px rgba(255, 255, 255, 0.20), 0 4px 14px rgba(0, 0, 0, 0.18) !important;
}
[data-sws-send] {
  background: rgba(58, 84, 255, 0.82) !important;
  color: #ffffff !important;
}
[data-sws-send]:hover:not(:disabled) {
  background: rgba(80, 108, 255, 0.92) !important;
}
[data-sws-chip] {
  border-radius: 8px !important;
  transition: background-color 0.14s ease, box-shadow 0.14s ease, color 0.14s ease;
}
[data-sws-chip]:hover,
[data-sws-chip][aria-expanded="true"] {
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 38%, rgba(255, 255, 255, 0.02) 62%, rgba(255, 255, 255, 0.10) 100%) !important;
  background-color: rgba(16, 18, 48, 0.30) !important;
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  backdrop-filter: blur(20px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 6px 16px rgba(0, 0, 0, 0.22) !important;
  color: var(--dsw-alias-label-primary, #f1f2ff) !important;
}


/* ===== Step 1: settings / modal dialog (rc3 semantic container) =======
   Scoped under the modal panel itself, so nothing outside a dialog changes. */
[data-shortcut-modal] {
  background-color: rgba(22, 24, 58, 0.92) !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.035) 0%,
    rgba(255, 255, 255, 0) 34%,
    rgba(255, 255, 255, 0.015) 100%
  ) !important;
  -webkit-backdrop-filter: blur(28px) saturate(140%);
  backdrop-filter: blur(28px) saturate(140%);
  border-radius: 16px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14),
    0 28px 80px rgba(0, 0, 0, 0.50) !important;
}
/* The dialog is ONE flat surface: its content wrappers must not paint a second
   translucent sheet, and cards only get the faintest navy lift, never glass. */
[data-shortcut-modal] [class*="_content"],
[data-shortcut-modal] [class*="_body"],
[data-shortcut-modal] [class*="_scroll"] {
  background-color: transparent !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
}
[data-shortcut-modal] [class*="_card"],
[data-shortcut-modal] [class*="_field"],
[data-shortcut-modal] [class*="_input"] {
  background-color: rgba(46, 52, 122, 0.26) !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  border-radius: 10px !important;
  box-shadow: inset 0 0 0 0.5px rgba(150, 170, 255, 0.16) !important;
}[data-shortcut-modal] [class*="_row"]:hover,
[data-shortcut-modal] [class*="_option"]:hover {
  border-radius: 10px !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.03) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.07) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
}
[data-shortcut-modal] button[aria-expanded="true"],
[data-shortcut-modal] button[data-state="active"],
[data-shortcut-modal] button[class*="_active"] {
  border-radius: 9px !important;
  background-color: rgba(58, 74, 190, 0.30) !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 46%, rgba(255, 255, 255, 0.05) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(200, 214, 255, 0.36),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.30) !important;
}

/* ===== Step 2: shell surfaces via rc3 semantic hooks ==================
   data-*/role/aria only; no hashed class names. */
[data-sws-hide] { display: none !important; }
/* The palette is locked to dark; keep rc3's light/dark chooser out of the
   dialog even when React re-renders it (structure match, no hashed classes).
   Only while the shell is really dark: on a light host the chooser must stay
   reachable, or the user has no way to switch the appearance back to dark. */
body[data-ds-dark-theme] [data-shortcut-modal] :is(div, section):has(> [class*="_cubeRow"]) { display: none !important; }
/* One thin translucent fill over the artwork, exactly like the v1.1.0 sidebar:
   no blur, so the wallpaper stays recognisable instead of flattening out. */
[data-sws-sidebar] {
  background-color: rgba(10, 12, 26, 0.24) !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: inset -0.5px 0 0 rgba(255, 255, 255, 0.10) !important;
}
[data-sws-newsession] {
  background-color: rgba(56, 72, 196, 0.26) !important;
  border-radius: 10px !important;
  -webkit-backdrop-filter: blur(72px) saturate(150%);
  backdrop-filter: blur(72px) saturate(150%);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0.025) 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34), inset 0 0 0 0.5px rgba(255, 255, 255, 0.14), inset 0 -1px 0 rgba(255, 255, 255, 0.06), 0 6px 18px rgba(0, 0, 0, 0.18) !important;
}
[data-sws-newsession] > * { background: transparent !important; background-image: none !important; box-shadow: none !important; border-color: transparent !important; }
[data-sws-newsession]:hover,
[data-sws-newsession]:active,
[data-sws-newsession]:focus-visible {
  background-color: rgba(70, 88, 220, 0.34) !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 46%, rgba(255, 255, 255, 0.08) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 6px 18px rgba(0, 0, 0, 0.18) !important;
}
[data-sws-nav-item], [data-sws-row] { border-radius: 10px !important; }
[data-sws-nav-item]:hover, [data-sws-nav-item][aria-expanded="true"], [data-sws-nav-item][data-state="active"],
[data-sws-row]:hover, [data-sws-row][aria-selected="true"], [data-sws-row][aria-current="true"], [data-sws-row][data-active="true"], [data-sws-row][data-state="active"], [data-sws-row][data-selected="true"] {
  border-radius: 10px !important;
  background-color: transparent !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0.02) 62%, rgba(255, 255, 255, 0.08) 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.40), inset 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 2px 8px rgba(0, 0, 0, 0.18) !important;
}
[data-sws-row] [data-sws-row], [data-sws-nav-item] [data-sws-nav-item] { background-image: none !important; box-shadow: none !important; }
[data-sws-account] { border-radius: 12px !important; }
[data-sws-account]:hover { background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0.05) 100%) !important; }
[data-sws-titlebar] { background-color: transparent !important; }

/* ===== Step 3: composer card in the theme's indigo glass =============
   rc3 ships a teal-tinted card; the skin's identity is blue-violet. */
[data-sws-composer] {
  background-color: rgba(50, 64, 196, 0.28) !important;
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 30%),
    radial-gradient(120% 170% at 80% 120%, rgba(146, 92, 255, 0.26) 0%, rgba(146, 92, 255, 0) 62%) !important;
  border-radius: 16px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 18px 44px rgba(0, 0, 0, 0.28) !important;
}
[data-sws-composer] [data-composer-input],
[data-sws-composer] [data-composer-row] {
  background-color: transparent !important;
}

/* ===== Step 8: exactly ONE glass layer in a dialog =====================
   A. the dialog shell is opaque, B. the content pane is the only glass,
   C. every row / card / field inside is flat. */
[data-shortcut-modal] {
  background-color: rgba(20, 22, 52, 1) !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
[data-shortcut-modal] > [class*="_content"] {
  background-color: transparent !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
[data-shortcut-modal] [class*="_card"],
[data-shortcut-modal] [class*="_rowCard"],
[data-shortcut-modal] [class*="_field"],
[data-shortcut-modal] [class*="_input"],
[data-shortcut-modal] [class*="_row"] {
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

/* Sidebar glyphs: one uniform colour, hue carried by --sws-icon-filter. */
[data-sws-nav-item] svg,
[data-sws-newsession] svg,
[data-sws-account] svg,
[data-sws-row] svg {
  filter: var(--sws-icon-filter, none) !important;
}

:root {
  --sws-dim: 0.975; /* 65% = the veil the theme shipped with; 100% is 1.5x */
}

/* Dialog nav: selected row reads as tinted glass, not a grey block. */
[data-shortcut-modal] button[class*="_active"] {
  background-color: rgba(58, 74, 190, 0.42) !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 48%, rgba(255, 255, 255, 0.06) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(200, 214, 255, 0.40),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.34) !important;
}

/* ===== Desktop window chrome: one veil, no second frame tint ==========
   DSH paints the caption band with --dsw-specific-sidebar-fill and the content
   column with --dsw-alias-bg-base, so the band and the column end up one layer
   apart and draw a seam. Neutralise both on the window frame: the window is
   the wallpaper plus the single --sws-dim veil, glass stays where it belongs. */
html[data-windows-titlebar] body {
  --dsw-specific-sidebar-fill: rgba(10, 12, 26, 0) !important;
  --dsw-alias-bg-base: rgba(10, 12, 26, 0) !important;
}
html[data-windows-titlebar] [class*="_frame"]::before {
  background: transparent !important;
}

/* The caption band sits above the AppFrame padding: paint the sidebar's glass
   across its width so the column reads as one surface from the very top. */
#sws-window-band {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sws-sidebar-w, 0px);
  height: var(--dsh-windows-titlebar-height, 40px);
  z-index: 40;
  pointer-events: none;
  background-color: rgba(10, 12, 26, 0.24);
  background-image: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: inset -0.5px 0 0 rgba(255, 255, 255, 0.10);
}
html[data-windows-titlebar] #sws-window-band { display: block; }

/* Dialog content is flat: one opaque shell, no second translucent fill. */
[data-sws-flat] {
  background-color: transparent !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
}

/* ===== Settings content is FLAT, structurally =========================
   Every container inside the dialog content pane loses its fill, blur and
   shadow — no second glass layer can sneak in through a renamed class. Only
   controls and the plugin's own .sws-* panels keep their material. */
[data-shortcut-modal] > [class*="_content"] :is(div, section, ul, li):not([class*="sws-"]) {
  background-color: transparent !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
}
[data-shortcut-modal] > [class*="_content"] :is(div, section, ul, li):not([class*="sws-"]) {
  border-color: rgba(150, 170, 255, 0.10) !important;
}
[data-shortcut-modal] > [class*="_content"] :is(button, select, input, textarea) {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

/* rc3 reuses the brand row as the new-session button (the logo carries
   aria-label 新建会话), so the pill material landed on the logo. Strip it from
   the brand element only — CSS-only, no tagger changes. */
[data-sws-newsession][class*="_brand"],
[data-sws-newsession][class*="_brand"] > * {
  background-color: transparent !important;
  background-image: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
  border-radius: 0 !important;
}

/* The brand lockup is one SVG that contains the HARNESS badge; the unified
   icon filter washes its letters out, so the wordmark keeps its own colours. */
[class*="_brand"] svg,
[class*="_brandName"] svg,
[class*="_brandIdentity"] svg {
  filter: none !important;
}

/* ===== Chat + dock material (rc3 suffixes only) ====================== */
/* The user's own bubble: same indigo glass language as the composer. */
[data-chat-flow] [class*="_userRow"] [class*="_bubble"] {
  background-color: rgba(56, 78, 200, 0.30) !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 40%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  backdrop-filter: blur(28px) saturate(150%);
  border-radius: 14px !important;
  box-shadow:
    inset 0 1px 0 rgba(200, 214, 255, 0.24),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.20),
    0 6px 18px rgba(0, 0, 0, 0.18) !important;
}
/* The right dock is a glass pane, its tiles are glass cards. */
[data-dockkit-pane] {
  background-color: rgba(10, 12, 26, 0.22) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: inset 0.5px 0 0 rgba(255, 255, 255, 0.10) !important;
}
[data-dockkit-pane] [class*="_card"] {
  background-color: rgba(26, 30, 74, 0.34) !important;
  -webkit-backdrop-filter: blur(28px) saturate(140%);
  backdrop-filter: blur(28px) saturate(140%);
  border-radius: 12px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.14) !important;
}

/* Pane fullscreen: the chat composer and the usage dock must not float over
   the dock page. */
html[data-sws-dock-fullscreen] [data-composer-seat],
html[data-sws-dock-fullscreen] [data-composer-dock],
html[data-sws-dock-fullscreen] [data-conversation-region="composer"] {
  display: none !important;
}

/* Dock entries: the cell flattens everything, the button itself is the one
   transparent glass surface; glyphs ride the palette. */
[data-dockkit-pane] [class*="_entryCell"] *,
[data-dockkit-pane] [class*="_moreAnchor"] * {
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
[data-dockkit-pane] [data-sidebar-right-guide-entry],
[data-dockkit-pane] [class*="_moreAnchor"] > * {
  background-color: rgba(24, 28, 70, 0.22) !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 42%, rgba(255, 255, 255, 0.03) 100%) !important;
  border-radius: 14px !important;
  box-shadow:
    inset 0 1px 0 rgba(200, 214, 255, 0.18),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.16),
    0 6px 18px rgba(0, 0, 0, 0.14) !important;
}
[data-dockkit-pane] [data-sidebar-right-guide-entry] svg,
[data-dockkit-pane] [class*="_moreAnchor"] svg {
  filter: grayscale(1) sepia(1) hue-rotate(var(--sws-icon-rotate, 192deg)) saturate(5) brightness(1.0) !important;
}
[data-dockkit-pane] [class*="_hero"] svg {
  filter: brightness(0) invert(1) !important;
}

/* Chat text sits directly on the artwork; a tight shadow keeps 16px CJK
   glyphs crisp without bringing the pane back. */
[data-conversation-region="chat"] [class*="_markdown"] {
  text-shadow: 0 1px 2px rgba(4, 6, 18, 0.55), 0 0 3px rgba(4, 6, 18, 0.28);
}
[data-conversation-region="chat"] [class*="_markdown"] code,
[data-conversation-region="chat"] [class*="_markdown"] pre,
[data-conversation-region="chat"] [class*="_markdown"] pre * {
  text-shadow: none;
}

/* Usage dock: the v1.1.0 glass pill, restored as one capsule. */
[data-composer-dock] {
  margin-top: 2px !important;
  background-color: rgba(50, 64, 196, 0.26) !important;
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 34%),
    radial-gradient(120% 170% at 80% 120%, rgba(146, 92, 255, 0.22) 0%, rgba(146, 92, 255, 0) 62%) !important;
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border-radius: 999px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.18) !important;
}

/* The composer and the usage dock keep their native layout positions: a
   visual lift used to overlap the queue / interjection panels above them. */

/* The composer is lifted visually; give the conversation tail the same
   clearance so the last message never slides under it. */
[data-conversation-region="chat"] [data-chat-flow] {
  padding-bottom: 20px !important;
}

/* Conversation header controls: liquid-glass hover + the same unified icon
   treatment for every glyph, including the file-manager bitmap icon. */
header[data-window-drag] :is(button, [role="button"]):not([class*="_tab"]):hover,
header[data-window-drag] :is(button, [role="button"]):not([class*="_tab"])[aria-expanded="true"] {
  border-radius: 9px !important;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.02) 62%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16) !important;
}
header[data-window-drag] :is(button, [role="button"]) svg,
header[data-window-drag] :is(button, [role="button"]) img {
  filter: var(--sws-icon-filter, none) !important;
}


/* Toolbar icon buttons and primary actions: liquid glass instead of flat fills. */
[class*="_iconButton"]:hover,
[class*="_iconButton"][aria-expanded="true"] {
  border-radius: 9px !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0.02) 62%, rgba(255, 255, 255, 0.08) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16) !important;
}
[class*="_primary_"] {
  background-color: rgba(74, 98, 226, 0.34) !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.02) 46%, rgba(255, 255, 255, 0.08) 100%) !important;
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  backdrop-filter: blur(18px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.20),
    0 6px 18px rgba(0, 0, 0, 0.20) !important;
}
[class*="_primary_"]:hover {
  background-color: rgba(96, 120, 250, 0.46) !important;
}
/* Plugin rows: glass highlight on hover / focus. */
li[class*="_card"]:hover,
li[class*="_card"]:focus-visible {
  background-color: rgba(60, 78, 200, 0.20) !important;
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 72%) !important;
  border-radius: 12px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.16) !important;
}
/* Sharpen text rendering a touch: Windows subpixel smoothing on composited layers. */
body {
  -webkit-font-smoothing: subpixel-antialiased;
}

/* Task pages (自动化任务 etc.): search field and task rows are glass surfaces. */
[class*="_searchField"] {
  background-color: rgba(10, 12, 26, 0.30) !important;
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  border-radius: 12px !important;
  box-shadow:
    inset 0 1px 0 rgba(200, 214, 255, 0.14),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.14) !important;
}
button:has([class*="_rowTitle"]) {
  background-color: rgba(18, 21, 52, 0.34) !important;
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  backdrop-filter: blur(20px) saturate(140%);
  border-radius: 12px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 0.5px rgba(150, 170, 255, 0.14) !important;
}
button:has([class*="_rowTitle"]):hover {
  background-color: rgba(52, 66, 190, 0.30) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 0 0 0.5px rgba(160, 180, 255, 0.28) !important;
}
[class*="_filterTab"]:hover,
[class*="_filterTab"][class*="_filterTabActive"] {
  border-radius: 14px !important;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 44%, rgba(255, 255, 255, 0.08) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
}

/* Settings dialogs are flat: no glass layer anywhere inside them. */
[data-shortcut-modal],
[data-shortcut-modal] * {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

/* Settings dialogs: the selected nav row is a flat tint, no glass at all. */
[data-shortcut-modal] button[class*="_active"] {
  background-color: rgba(96, 116, 230, 0.20) !important;
  background-image: none !important;
  box-shadow: none !important;
}
/* DSH's question / choice card: the composer's glass language. */
[class*="_card"]:has([class*="_options"]) {
  background-color: rgba(50, 64, 196, 0.28) !important;
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 30%),
    radial-gradient(120% 170% at 80% 120%, rgba(146, 92, 255, 0.22) 0%, rgba(146, 92, 255, 0) 62%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  backdrop-filter: blur(28px) saturate(150%);
  border-radius: 16px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 18px 44px rgba(0, 0, 0, 0.28) !important;
}
/* Keep only the card surface and the options panel: rows, the answer field,
   the footer strip and their highlights are flat. */
/* The minimised question bar keeps the same glass as the full card. */
[class*="_cardMinimized"] {
  background-color: rgba(50, 64, 196, 0.28) !important;
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 30%),
    radial-gradient(120% 170% at 80% 120%, rgba(146, 92, 255, 0.20) 0%, rgba(146, 92, 255, 0) 62%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  backdrop-filter: blur(24px) saturate(150%);
  border-radius: 14px !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
    0 14px 36px rgba(0, 0, 0, 0.26) !important;
}
[class*="_option"],
[class*="_optionSelected"],
[class*="_optionCopy"],
[class*="_optionLine"],
[class*="_footer"],
[class*="_footerActions"] {
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}
/* More clearance so the streaming tail never slides under the lifted composer. */
[data-conversation-region="chat"] [data-chat-flow] {
  padding-bottom: 44px !important;
}
[data-conversation-scroll] {
  scroll-padding-bottom: 64px;
}

/* ===== Cosmos canvas: your own photo or video behind the shell ========
   The navigation tabs and every glass surface still float on the same
   liquid-glass film; what changes underneath is the sky itself. */
#sws-cosmos {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: #05060f;
  opacity: 0;
  transition: opacity 700ms ease;
}
#sws-cosmos[data-ready] {
  opacity: 1;
}
body[data-sws-cosmos]::before {
  opacity: 0;
}
#sws-cosmos > img,
#sws-cosmos > video {
  position: absolute;
  inset: -2%;
  width: 104%;
  height: 104%;
  object-fit: cover;
  object-position: center center;
  filter: saturate(1.05) brightness(0.99);
}
#sws-cosmos > img {
  animation: sws-cosmos-drift 72s ease-in-out infinite alternate;
}
#sws-cosmos::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 100% at 50% 30%, rgba(6, 8, 22, calc(0.08 * var(--sws-dim))) 0%, rgba(4, 5, 14, calc(0.52 * var(--sws-dim))) 100%),
    linear-gradient(180deg, rgba(7, 9, 22, calc(0.34 * var(--sws-dim))) 0%, rgba(7, 9, 22, calc(0.2 * var(--sws-dim))) 44%, rgba(7, 9, 22, calc(0.46 * var(--sws-dim))) 100%);
}
@keyframes sws-cosmos-drift {
  from { transform: scale(1.01) translate3d(0, 0, 0); }
  to { transform: scale(1.09) translate3d(0, -1.4%, 0); }
}
@media (prefers-reduced-motion: reduce) {
  #sws-cosmos > img {
    animation: none !important;
  }
}

/* Settings → 背景 */
.sws-bg-preview-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
}
.sws-bg-preview {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 116px;
  height: 66px;
  overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(140deg, #1b1f4d, #0b0d24);
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.18), 0 6px 16px rgba(0, 0, 0, 0.24);
}
.sws-bg-media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sws-bg-default {
  font-size: 11px;
  letter-spacing: 0.14em;
  color: #9ba1d9;
}
.sws-bg-facts {
  min-width: 0;
}
.sws-bg-name {
  margin-top: 3px;
  overflow: hidden;
  font-size: 13px;
  color: var(--dsw-alias-label-primary, #f1f2ff);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sws-bg-note {
  margin-top: 3px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary, #9ba1d9);
}
.sws-bg-drop {
  margin-top: 14px;
  padding: 18px 16px;
  border: 1px dashed rgba(150, 160, 255, 0.34);
  border-radius: 12px;
  background: rgba(20, 23, 60, 0.28);
  text-align: center;
  transition: background 160ms ease, border-color 160ms ease;
}
.sws-bg-drop-hover {
  border-color: rgba(150, 168, 255, 0.78);
  background: rgba(58, 84, 255, 0.22);
}
.sws-bg-drop-title {
  font-size: 13px;
  color: #e6e8ff;
}
.sws-bg-drop-note {
  margin-top: 4px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary, #9ba1d9);
}
.sws-btn-ghost {
  background: rgba(120, 132, 255, 0.16);
  box-shadow: inset 0 0 0 0.5px rgba(160, 170, 255, 0.28);
}
.sws-btn-ghost:hover:not(:disabled) {
  background: rgba(120, 132, 255, 0.28);
}
.sws-bg-progress {
  margin-top: 12px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #c4c9f2);
}
.sws-bg-error {
  margin-top: 10px;
  font-size: 12px;
  color: #ffb3c0;
}

`;

    function NebulaWallpaper() {
      return h('style', { 'data-dsh-plugin': 'star-wallpaper' }, THEME_CSS);
    }

    /* ===== Compatibility guard =========================================
       The stylesheet targets class names from one DSH web-client build. A DSH
       upgrade re-hashes them and the hashed layer goes inert all at once.
       Fingerprint the shell instead of trusting it: report the result in
       Settings -> About and window.__SWS_COMPAT__, and degrade the status
       honestly instead of silently painting half a theme. Never throw: a
       theme must not be able to take the host down. */
    const THEME_VERSION = '1.2.1';
    const COMPAT = (() => {
      const state = {
        theme: THEME_VERSION,
        dsh: '',
        level: 'unknown',
        required: 0,
        requiredMatched: 0,
        optional: 0,
        optionalMatched: 0,
        slotsOk: 0,
        slotsTotal: 0,
        desktop: false,
        degraded: false,
      };
      // The required anchors are visible on every session state (welcome or
      // conversation); the optional ones only inside a conversation.
      const ANCHORS = [
        ['sidebar', 'nav[aria-label="全局面板"], [data-sws-sidebar], [class*="_2H3hWW_"]', true],
        ['composer', '[data-sws-composer], [data-composer-card="true"], [class*="RlGAzG_"]', true],
        ['account chip', '[data-sws-account], [aria-label="账号菜单"], [class*="ET65mq_"]', true],
        ['session header', '[data-conversation-region="chat"], [class*="Dc7zOa_"]', false],
        ['usage dock', '[data-dockkit-surface], [class*="iq1doa_"]', false],
      ];
      const has = (selector) => {
        try { return !!document.querySelector(selector); } catch { return false; }
      };
      const probe = () => {
        try {
          let required = 0;
          let requiredMatched = 0;
          let optional = 0;
          let optionalMatched = 0;
          for (const entry of ANCHORS) {
            const ok = has(entry[1]);
            if (entry[2]) {
              required += 1;
              if (ok) requiredMatched += 1;
            } else {
              optional += 1;
              if (ok) optionalMatched += 1;
            }
          }
          state.required = required;
          state.requiredMatched = requiredMatched;
          state.optional = optional;
          state.optionalMatched = optionalMatched;
          state.desktop = !!window.dshDesktop || has('[data-windows-menu]');
          try {
            const release = readRelease();
            state.dsh = release.version || '';
          } catch {}
          const forced = window.__SWS_FORCE_COMPAT__;
          let level;
          if (forced === 'full' || forced === 'partial' || forced === 'base') level = forced;
          else if (requiredMatched >= required) level = 'full';
          else if (requiredMatched >= 2) level = 'partial';
          else level = document.body ? 'base' : 'unknown';
          if (!forced && level === 'full' && state.slotsTotal > 0 && state.slotsOk < state.slotsTotal) level = 'partial';
          state.level = level;
          state.degraded = level === 'base';
          try {
            document.body.setAttribute('data-sws-compat', level);
            document.body.toggleAttribute('data-sws-degraded', state.degraded);
          } catch {}
          window.__SWS_COMPAT__ = state;
          const line = '[star-wallpaper] DSH ' + (state.dsh || 'unknown') + ' · compat ' + level +
            ' · anchors ' + requiredMatched + '/' + required;
          if (level === 'full') console.info(line);
          else console.info(line + ' · 主题已降级，建议更新主题插件');
        } catch {}
      };
      const recordSlot = (ok) => {
        state.slotsTotal += 1;
        if (ok) state.slotsOk += 1;
      };
      return { state, probe, recordSlot, has };
    })();
    const runCompatProbe = () => COMPAT.probe();

    /* ===== Stable anchor tagger ========================================
       Adds data-sws-* attributes to the components the stable skin paints.
       The first pass scans the whole shell; afterwards only the subtrees React
       adds are inspected. A streaming conversation used to re-query the whole
       document on every mutation, so this keeps the same coverage with work
       proportional to what actually changed. */
    const EDITOR_SELECTOR =
      '[contenteditable]:not([contenteditable="false"]), [data-lexical-editor="true"]';
    const TAGGED = [
      ['[aria-label="发送消息"]', 'data-sws-send'],
      ['[aria-label="添加文件或调用指令"]', 'data-sws-add'],
      ['[class*="EBLgjq_trigger"], [aria-label="智能体团队"]', 'data-sws-chip'],
      ['[class*="b06baG_label"]', 'data-sws-chip'],
      ['[class*="foD-wG_trigger"]', 'data-sws-chip'],
      ['[class*="oXE0lW_trigger"], [class*="oXE0lW_switcherTrigger"]', 'data-sws-chip'],
      ['[class*="dzXS4q_button"]', 'data-sws-chip'],
      ['[class*="Dc7zOa_headerUtilities"] button', 'data-sws-chip'],
      ['[class*="Dc7zOa_headerCorner"] button', 'data-sws-chip'],
      /* rc3 semantic hooks: data-*, role and aria labels instead of hashes */
      ['nav[aria-label="全局面板"] button', 'data-sws-nav-item'],
      ['[aria-label="新建会话"]', 'data-sws-newsession'],
      ['[role="treeitem"]', 'data-sws-row'],
      ['[aria-label="账号菜单"]', 'data-sws-account'],
      ['[data-composer-card="true"]', 'data-sws-composer'],
      ['[data-window-drag]', 'data-sws-titlebar'],
    ];
    /* A burst this large is cheaper to answer with one full pass than with
       dozens of scoped queries. */
    const TAG_FULL_SCAN_LIMIT = 24;

    function mark(node, attribute) {
      if (node.hasAttribute(attribute)) return;
      node.setAttribute(attribute, '');
    }
    function tagIn(root, selector, attribute) {
      try {
        if (root.matches(selector)) mark(root, attribute);
        for (const node of root.querySelectorAll(selector)) mark(node, attribute);
      } catch {}
    }
    function tagComposerIn(root) {
      try {
        const editors = [];
        if (root.matches(EDITOR_SELECTOR)) editors.push(root);
        for (const node of root.querySelectorAll(EDITOR_SELECTOR)) editors.push(node);
        for (const editor of editors) {
          let card = null;
          try {
            card = editor.closest('[class*="RlGAzG_card"], [class*="_card_"]');
          } catch {}
          if (!card) {
            let parent = editor.parentElement;
            for (let i = 0; parent && i < 6; i += 1, parent = parent.parentElement) {
              if (parent.querySelector('[aria-label="发送消息"]')) { card = parent; break; }
            }
          }
          if (card) mark(card, 'data-sws-composer');
        }
      } catch {}
    }
    function tagSubtree(root) {
      for (const entry of TAGGED) tagIn(root, entry[0], entry[1]);
      tagComposerIn(root);
      tagSidebarColumn(root);
      tagAppearanceChooser(root);
      tagFlatSurfaces(root);
      markDockFullscreen();
    }
    function runTaggers() {
      try {
        const root = document.body || document.documentElement;
        if (!root) return;
        tagComposerIn(root);
        tagSidebarColumn(root);
        tagAppearanceChooser(root);
        tagFlatSurfaces(root);
        markDockFullscreen();
        for (const entry of TAGGED) tagIn(root, entry[0], entry[1]);
      } catch {}
    }
    function tagSidebarColumn(root) {
      try {
        const navs = [];
        if (root.matches && root.matches('nav[aria-label="全局面板"]')) navs.push(root);
        for (const node of root.querySelectorAll('nav[aria-label="全局面板"]')) navs.push(node);
        for (const nav of navs) {
          /* Prefer the AppFrame column (full height) over the nav block; the
             suffix survives DSH's class-hash rebuild. */
          let column = null;
          try { column = nav.closest('[class*="_sidebarCol"]'); } catch {}
          if (column === null || column === undefined) {
            let parent = nav.parentElement;
            for (let i = 0; parent && i < 6; i += 1, parent = parent.parentElement) {
              const rect = parent.getBoundingClientRect();
              if (rect.width >= 240 && rect.width <= 360 && rect.height >= window.innerHeight * 0.82) { column = parent; break; }
            }
          }
          if (column) {
            mark(column, 'data-sws-sidebar');
            try {
              document.documentElement.style.setProperty('--sws-sidebar-w', Math.round(column.getBoundingClientRect().width) + 'px');
            } catch {}
          }
        }
      } catch {}
      try {
        if (!document.documentElement.hasAttribute('data-windows-titlebar')) return;
        if (document.getElementById('sws-window-band')) return;
        const band = document.createElement('div');
        band.id = 'sws-window-band';
        (document.body || document.documentElement).append(band);
      } catch {}
    }
    function installDockFullscreenWatch() {
      /* The observer above batches DOM work; the pane toggle must repaint the
         stray composer/usage dock on the very next frame, not 180ms later. */
      let frame = 0;
      const apply = () => {
        if (frame !== 0) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          markDockFullscreen();
        });
      };
      markDockFullscreen();
      let observer = null;
      try {
        observer = new MutationObserver(apply);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sidebar-right-mode'] });
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-sidebar-right-mode'] });
      } catch {}
      try { document.addEventListener('click', apply, true); } catch {}
      try { window.addEventListener('resize', apply); } catch {}
      return () => {
        try { if (observer) observer.disconnect(); } catch {}
        try { document.removeEventListener('click', apply, true); } catch {}
        try { window.removeEventListener('resize', apply); } catch {}
      };
    }    function markDockFullscreen() {
      /* rc3's pane fullscreen keeps the chat composer and the usage dock on
         screen, floating over the pane. Detect the layout (no clicks) and let
         CSS hide those two strays. */
      try {
        const exit = document.querySelector('button[aria-label="退出全屏"]');
        const pane = document.querySelector('[data-dockkit-pane]');
        const wide = pane !== null && pane.getBoundingClientRect().width >= window.innerWidth * 0.85;
        document.documentElement.toggleAttribute('data-sws-dock-fullscreen', !!(exit || wide));
      } catch {}
    }    function tagFlatSurfaces(root) {
      /* Whatever rc3 paints inside a dialog (sections, field groups, cards with
         their own class-hash suffixes) gets flattened here: the dialog is one
         opaque surface, its content is transparent, nothing gets a second
         translucent fill. Runs on mutations, so newly mounted panes follow. */
      try {
        const dialogs = [];
        if (root.matches && root.matches('[data-shortcut-modal]')) dialogs.push(root);
        if (root.querySelectorAll) dialogs.push(...root.querySelectorAll('[data-shortcut-modal]'));
        for (const dialog of dialogs) {
          for (const el of dialog.querySelectorAll('*')) {
            const tag = el.tagName;
            if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'SVG' || tag === 'IMG') continue;
            if (el.hasAttribute('data-sws-sidebar')) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width < 160 || rect.height < 32) continue;
            const cs = getComputedStyle(el);
            const bg = cs.backgroundColor || '';
            const alphaMatch = /rgba?\([^)]*,\s*([0-9.]+)\s*\)/.exec(bg);
            const hasFill = alphaMatch ? Number(alphaMatch[1]) > 0.02 : (bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)');
            if (hasFill || cs.backgroundImage !== 'none' || (cs.backdropFilter && cs.backdropFilter !== 'none')) {
              if (!el.hasAttribute('data-sws-flat')) el.setAttribute('data-sws-flat', '');
            }
          }
        }
      } catch {}
    }
    function tagAppearanceChooser(root) {
      /* The skin locks the palette to dark; rc3 draws the stock chooser again
         because the old hash rules are gone. Hide the group that offers
         light / dark / follow-system, whatever its class names are.

         The lock only holds while the page really is dark. A fresh profile
         whose appearance preference still resolves to light (a light desktop
         with the "system" default, or a profile patch overriding the bundle's
         dark default) must keep the chooser visible — otherwise the user is
         trapped on a palette this skin cannot render and has no way to switch. */
      try {
        if (!document.body || !document.body.hasAttribute('data-ds-dark-theme')) return;
        const labels = ['浅色', '深色', '跟随系统'];
        const flat = (s) => String(s || '').replace(/\s+/g, '');
        const nodes = [];
        if (root.querySelectorAll) nodes.push(...root.querySelectorAll('button, [role="tab"], [role="radio"], span, div'));
        if (root.matches && root.matches('button, [role="tab"], [role="radio"], span, div')) nodes.push(root);
        for (const node of nodes) {
          if (!labels.includes(flat(node.textContent))) continue;
          let parent = node.parentElement;
          for (let i = 0; parent && i < 5; i += 1, parent = parent.parentElement) {
            const all = flat(parent.textContent);
            if (all.includes('外观') && all.includes('浅色') && all.includes('深色') && all.includes('跟随系统')) {
              mark(parent, 'data-sws-hide');
              break;
            }
          }
        }
      } catch {}
    }
    function installTagger() {
      let timer = 0;
      let pending = [];
      const flush = () => {
        timer = 0;
        if (pending.length === 0) return;
        if (pending.length > TAG_FULL_SCAN_LIMIT) {
          pending = [];
          runTaggers();
          return;
        }
        const roots = pending;
        pending = [];
        for (const root of roots) if (root.isConnected) tagSubtree(root);
      };
      const schedule = () => {
        if (timer) return;
        timer = setTimeout(flush, 180);
      };
      runTaggers();
      setTimeout(runTaggers, 900);
      setTimeout(runTaggers, 2800);
      let observer = null;
      try {
        observer = new MutationObserver((records) => {
          for (const record of records) {
            for (const node of record.addedNodes) {
              if (node.nodeType === 1) pending.push(node);
            }
          }
          if (pending.length > 0) schedule();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      } catch {}
      return () => {
        try { if (observer) observer.disconnect(); } catch {}
        if (timer) clearTimeout(timer);
        pending = [];
      };
    }

    /* ===== Greeting overlay: a card kept for short inputs ==========
       Deliberately hidden: no Settings entry, no visible control. Typing a
       name (or its full pinyin, or its last two characters) in the composer
       and sending renders the card below. Only SHA-256
       digests of the accepted inputs ship in this repository: no name, no
       pinyin, and no reversible encoding. */
    /* One blessing per name, ever: the digest list is grouped three entries per
       name (full name, pinyin, name without surname), and a group that already
       surfaced its card is remembered. A cookie carries that ledger across
       ports, so restarting the app on a new port does not replay it. */
    const GREET_GROUPS_PER_NAME = 3;
    const GREET_DONE_KEY = 'dsh-star-wallpaper:greet-done';
    const GREET_DONE_VERSION = 'v3';
    const GREET_DONE_ROUTE = '/star-wallpaper/greet-state';
    const GREET_SALT = 'himeko-starry-night/' + String.fromCharCode(101, 103, 103) + '/v1';
    const GREET_DIGEST_BLOB =
      '613ca050f79389128eb883891e4c6304bb3f6d82b9c6320c1fdf8d781dfee0abab6256a7cdcbf17cb2a9dc4b4bbaf77eedd7c86e867d768352a5f9c8863570706b53b2620f32be39e6b08ae5b4092106d1a489c0286b1d2b3488d95aac17067940ab70e099f6ae5460fe55df4e9184ac180580292b3c869efaff4817cb1264b8592b399476017bf20fcebe96544a2acf76b149543ed6b404f29db2d28ca600ff097e682dcdfd043644f997760c1b7fe958798833438799071c2189dc2503831ec1a91d9596a6ef5407854ca41fa2a2c0739190299151c82183e5cb94616fc02966ab66a7f7977e5741df60a6d5cd1754180c6acc14111de022746031cc38d587b55aaf5d7b4d2d0b4cc14f4dc6d3cc290042903661ed747bc3caade67229fd5a96507ced9d917bd687ad0219cd0acd02b60ca4f59dc956c7da21dfb6321bf747f63aa3fd06442a2da5c1407a7c82fbd69540d8834c42430f159ea00ddb6c0d343e84712b63845ff78fb52f0ebcd1235c36a8294cb41ca02905701218e8f4339a2febadb7f58f5f976fdafbfd901f0bc09c4de4454a9c8454880f1027cafacc1edd79095993bd632cd4aab4f0d01999e432c437fc3c5a672e9d3edc5c963670d18782a5b8d9db9f7f30c660380a8197a4f7a7d9539764eeb11a126f177743533334369746a4ddf74895e983bc441d25897409a35842476c110657876905a0bc278c9fc2c2fef10cf9a12475e33baa01426b499fa3a3c518ff81421ec234031772395366a4adee1400a41cafc8d874e052d47038b841591cf31f5748af6e6319b5037a3e590e01fb868cb6408b3a4de337ee9b3c08c07a757ae4ff859c9f00828df255d78c25747639adf6a81def95ea8243c0283313f4157bfb9398ba1053677512a2cd31f35632f4e7c07354e7520570c21c1990410aa4a3ebbe3f7d7c1dcbc049727b14c5dd14a2c40a6a53971be65ad8446f98abcea57f61d5ce7534448ecf52c0b9ecdaf52794c9d48814c6446ac52715e5f93c577effe275086af54873272a23485c6b1ef43a66be89403bdc65c4dcb34dce9c32e2f42098f46240fbe0bd98a4f77a2c605464ac257219778b90b6d68e87dc50f20862b4109c83342cc6f5766964583c214e26237dff95c92f39d61aa964f56eccc70fdd648693d8611d62da197ff511acc9c5f62b6015c38ce91dd3dbf6a1df7bebed9da66196aeb8d0a75284d52bd7dc1f62296244cd1bf22ad90e6867f03f420a332ddbe3ba10dbe7409a1522fe04dfd3c145b346d39f24d6c9cbff8695c378aaf94e8e9b24d9a2c054aa88d781618933f78df0fc31b0d89e83583dbbc9ee6455c752182495a946756a';
    const GREET_DIGESTS = GREET_DIGEST_BLOB.match(/.{64}/g) || [];
    function readGreetDoneLocal() {
      try {
        const parsed = JSON.parse(localStorage.getItem(GREET_DONE_KEY) ?? '[]');
        return Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)) : [];
      } catch {
        return [];
      }
    }
    function writeGreetDoneLocal(list) {
      try {
        localStorage.setItem(GREET_DONE_KEY, JSON.stringify(list));
      } catch {}
    }
    /* The ledger is local-first: the browser storage always answers, and the
       Host-side copy (same file across restarts) is merged in when it is
       reachable. Both are just group indexes — never a name. */
    async function loadGreetDone() {
      const local = readGreetDoneLocal();
      try {
        const response = await fetch(GREET_DONE_ROUTE, { cache: 'no-store' });
        if (!response.ok) return local;
        const parsed = await response.json();
        if (!Array.isArray(parsed)) return local;
        const merged = new Set(local);
        for (const value of parsed) {
          if (Number.isInteger(value)) merged.add(value);
        }
        return Array.from(merged);
      } catch {
        return local;
      }
    }
    function saveGreetDone(list) {
      writeGreetDoneLocal(list);
      try {
        fetch(GREET_DONE_ROUTE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(list),
        }).catch(() => {});
      } catch {}
    }
    const GREET_TEXT = [
      '很久很久以后，或许会突然意识到，谁对谁错，何是何非，',
      '由爱生疑，由疑生恨，或者难以释怀的背弃，无法谅解的谎言。',
      '生命中会突然刺痛我的，使我感到遗憾、伤痛的，不论是一首歌曲、',
      '一张照片，或一个我再也无法见到的人，事过境迁，我心中留下的，',
      '或许还是那句话：',
    ].join('\n');
    const GREET_BLESS = '我总是祝福着你。';
    /* The ambient track lives in the package and is served by the Host half
       (see index.js) instead of riding the boot bundle: the 626 KB MP3 used to
       be inlined as 835 KB of base64 in this script and parsed on every start.
       The element is created only when the card opens. */
    const AMBIENT_URL = '/star-wallpaper/ambient.mp3';
    let ambientAudio;
    let ambientAudioFailed = false;
    function ambientAudioElement() {
      if (ambientAudio !== undefined) return ambientAudio;
      if (ambientAudioFailed) return null;
      try {
        ambientAudio = new Audio(AMBIENT_URL);
        ambientAudio.loop = true;
        ambientAudio.preload = 'auto';
        ambientAudio.volume = 0.55;
      } catch {
        ambientAudioFailed = true;
        return null;
      }
      return ambientAudio;
    }

    /* ===== Cosmos canvas: a photo or a video of your own as the sky ====
       The nebula is where the journey starts, not where it ends. A file
       chosen in Settings → 背景 is written by the Host half to
       ~/.dsh/star-wallpaper/background and served back from the same
       origin, so nothing is uploaded anywhere and no artwork rides the
       boot bundle. A picture drifts slowly; a video simply breathes. */
    const COSMOS_ROUTE = '/star-wallpaper/background';
    const COSMOS_META_ROUTE = '/star-wallpaper/background-meta';
    let cosmosMeta = { has: false };
    let cosmosLayer = null;
    let cosmosMedia = null;
    let cosmosMediaKey = '';
    const cosmosListeners = new Set();
    const COSMOS_SETTINGS_ROUTE = '/star-wallpaper/settings';
    const DIM_DEFAULT = 65;
    const DIM_SAVE_DELAY = 400;
    const DIM_STORAGE_KEY = 'sws-star-wallpaper-dim';
    let dimLevel = DIM_DEFAULT;
    let dimSaveTimer = null;
    const dimListeners = new Set();
    /* 65% is the old maximum (1.5x the base veil); 100% is 1.5x of that. */
    function dimFactor(level) { return (Math.max(0, Math.min(100, level)) / 65) * 1.5; }
    function applyDimLevel(level, persist = true) {
      const number = Number(level);
      dimLevel = Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : DIM_DEFAULT;
      try { document.documentElement.style.setProperty('--sws-dim', String(dimFactor(dimLevel))); } catch {}
      try { localStorage.setItem(DIM_STORAGE_KEY, String(dimLevel)); } catch {}
      if (persist) scheduleDimSave();
      for (const listener of Array.from(dimListeners)) { try { listener(); } catch {} }
    }
    function subscribeDim(listener) { dimListeners.add(listener); return () => { dimListeners.delete(listener); }; }
    function scheduleDimSave() {
      if (dimSaveTimer !== null) clearTimeout(dimSaveTimer);
      dimSaveTimer = setTimeout(() => { dimSaveTimer = null; saveDimLevel(dimLevel); }, DIM_SAVE_DELAY);
    }
    async function saveDimLevel(level) {
      try { await fetch(COSMOS_SETTINGS_ROUTE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dim: level }) }); } catch {}
    }
    function restoreDimLevel() {
      let level = DIM_DEFAULT;
      try {
        const raw = localStorage.getItem(DIM_STORAGE_KEY);
        const stored = raw === null ? NaN : Number(raw);
        if (Number.isFinite(stored) && stored >= 0 && stored <= 100) level = Math.round(stored);
      } catch {}
      applyDimLevel(level, false);
    }
    async function loadDimLevel() {
      try {
        const response = await fetch(COSMOS_SETTINGS_ROUTE, { cache: 'no-store' });
        if (!response.ok) return;
        const parsed = await response.json();
        const dim = parsed && parsed.ok === true && parsed.settings ? parsed.settings.dim : undefined;
        if (Number.isFinite(Number(dim))) applyDimLevel(Number(dim), false);
      } catch {}
    }

    /* ===== Palette: the theme colour follows the canvas ================
       The skin writes its colours as literal rgba() triples. They are
       collected once and handed out as `--sws-p-<r>-<g>-<b>` tokens; when the
       user's own picture is on the canvas the tokens' hue is rotated by the
       picture's dominant hue — lightness and saturation stay untouched, so
       contrast never depends on the photo. Warm/green status colours and
       near-neutral greys keep their literal values. */
    const PALETTE_HUE_MIN = 185;
    const PALETTE_HUE_MAX = 290;
    const PALETTE_MIN_SATURATION = 0.12;
    const THEME_BASE_HUE = 232;
    const SEED_BASE_CHROMA = 45;
    const SEED_MIN_COVERAGE = 40;
    const paletteColors = new Map();

    function rgbToHsl(r, g, b) {
      const red = r / 255;
      const green = g / 255;
      const blue = b / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const lightness = (max + min) / 2;
      const delta = max - min;
      if (delta === 0) return [0, 0, lightness];
      const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      let hue;
      if (max === red) hue = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6;
      else if (max === green) hue = ((blue - red) / delta + 2) / 6;
      else hue = ((red - green) / delta + 4) / 6;
      return [hue * 360, saturation, lightness];
    }
    function hueToRgb(x, y, h) {
      let value = h;
      if (value < 0) value += 1;
      if (value > 1) value -= 1;
      if (value < 1 / 6) return x + (y - x) * 6 * value;
      if (value < 1 / 2) return y;
      if (value < 2 / 3) return x + (y - x) * (2 / 3 - value) * 6;
      return x;
    }
    function hslToRgb(h, s, l) {
      const hue = (((h % 360) + 360) % 360) / 360;
      if (s === 0) {
        const value = Math.round(l * 255);
        return [value, value, value];
      }
      const y = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const x = 2 * l - y;
      return [
        Math.round(hueToRgb(x, y, hue + 1 / 3) * 255),
        Math.round(hueToRgb(x, y, hue) * 255),
        Math.round(hueToRgb(x, y, hue - 1 / 3) * 255),
      ];
    }

    /* ===== CIELAB: the perceptual space the seed mapping works in ======== */
    function srgbToLinear(value) {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    }
    function linearToSrgb(value) {
      const channel = Math.min(1, Math.max(0, value));
      return channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
    }
    function rgbToLab(r, g, b) {
      const lr = srgbToLinear(r);
      const lg = srgbToLinear(g);
      const lb = srgbToLinear(b);
      let x = (lr * 0.4124 + lg * 0.3576 + lb * 0.1805) / 0.95047;
      let y = lr * 0.2126 + lg * 0.7152 + lb * 0.0722;
      let z = (lr * 0.0193 + lg * 0.1192 + lb * 0.9505) / 1.08883;
      const f = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
      x = f(x); y = f(y); z = f(z);
      return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
    }
    function labToRgb(l, a, b) {
      const y = (l + 16) / 116;
      const x = y + a / 500;
      const z = y - b / 200;
      const inv = (v) => { const cube = v * v * v; return cube > 0.008856 ? cube : (v - 16 / 116) / 7.787; };
      const X = inv(x) * 0.95047;
      const Y = inv(y);
      const Z = inv(z) * 1.08883;
      const rl = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
      const gl = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
      const bl = X * 0.0557 + Y * -0.204 + Z * 1.057;
      return [
        Math.round(linearToSrgb(rl) * 255),
        Math.round(linearToSrgb(gl) * 255),
        Math.round(linearToSrgb(bl) * 255),
      ];
    }
    function rgbToLch(r, g, b) {
      const lab = rgbToLab(r, g, b);
      return [lab[0], Math.hypot(lab[1], lab[2]), (((Math.atan2(lab[2], lab[1]) * 180) / Math.PI) + 360) % 360];
    }
    function lchToRgb(l, c, hue) {
      const radians = (hue * Math.PI) / 180;
      return labToRgb(l, c * Math.cos(radians), c * Math.sin(radians));
    }

    function tokenizePalette(css) {
      const defaults = [];
      const tokenized = css.replace(/rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([0-9]*\.?[0-9]+)\)/g, (match, red, green, blue, alpha) => {
        const r = Number(red);
        const g = Number(green);
        const b = Number(blue);
        if (r > 255 || g > 255 || b > 255) return match;
        const hsl = rgbToHsl(r, g, b);
        if (hsl[1] < PALETTE_MIN_SATURATION || hsl[0] < PALETTE_HUE_MIN || hsl[0] > PALETTE_HUE_MAX) return match;
        const name = '--sws-p-' + r + '-' + g + '-' + b;
        if (!paletteColors.has(name)) {
          paletteColors.set(name, [r, g, b]);
          defaults.push(name + ': ' + r + ', ' + g + ', ' + b + ';');
        }
        return 'rgba(var(' + name + '), ' + alpha + ')';
      });
      return tokenized + '\nhtml {\n  ' + defaults.join('\n  ') + '\n}\n';
    }
    const THEME_CSS = tokenizePalette(CSS);

    /* ===== Material-style dynamic colour ================================
       The wallpaper becomes a seed: the area-weighted mean hue and chroma of
       its saturated pixels in CIELAB. The skin palette keeps every token's
       tone (L*) and takes the seed's hue, with chroma scaled by the seed's
       intensity — the same idea as Material's dynamic tonal mapping. */
    let paletteSeed = null;
    function applyCosmosSeed(seed) {
      try {
        const root = document.documentElement;
        if (root === null) return;
        if (!seed || !Number.isFinite(seed.hue)) {
          for (const name of paletteColors.keys()) root.style.removeProperty(name);
          root.style.removeProperty('--sws-icon-filter');
          root.style.removeProperty('--sws-icon-filter-color');
          root.style.removeProperty('--sws-icon-rotate');
          paletteSeed = null;
          return;
        }
        const chroma = Number.isFinite(seed.chroma) ? seed.chroma : SEED_BASE_CHROMA;
        const ratio = Math.min(1.7, Math.max(0.45, chroma / SEED_BASE_CHROMA));
        for (const [name, rgb] of paletteColors) {
          const lch = rgbToLch(rgb[0], rgb[1], rgb[2]);
          const next = lchToRgb(lch[0], Math.min(110, Math.max(2, lch[1] * ratio)), seed.hue);
          root.style.setProperty(name, next[0] + ', ' + next[1] + ', ' + next[2]);
        }
        const iconHue = ((seed.hue % 360) + 360) % 360;
        const rotate = (((iconHue - 40) % 360) + 360) % 360;
        const saturate = Math.min(6, Math.max(2.6, 2.2 + chroma / 24));
        root.style.setProperty(
          '--sws-icon-filter',
          'grayscale(1) brightness(1.85) sepia(1) hue-rotate(' + Math.round(rotate) + 'deg) saturate(' + saturate.toFixed(2) + ')',
        );
        root.style.setProperty(
          '--sws-icon-filter-color',
          'grayscale(1) sepia(1) hue-rotate(' + Math.round(rotate) + 'deg) saturate(' + Math.min(6, saturate + 0.8).toFixed(2) + ') brightness(1.02)',
        );
        root.style.setProperty('--sws-icon-rotate', Math.round(rotate) + 'deg');
        paletteSeed = seed;
      } catch {}
    }
    function sampleMediaSeed(media) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return null;
        context.drawImage(media, 0, 0, 96, 96);
        const pixels = context.getImageData(0, 0, 96, 96).data;
        let x = 0;
        let y = 0;
        let chromaSum = 0;
        let count = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          if (pixels[index + 3] < 200) continue;
          const lab = rgbToLab(pixels[index], pixels[index + 1], pixels[index + 2]);
          if (lab[0] < 5 || lab[0] > 96) continue;
          const chroma = Math.hypot(lab[1], lab[2]);
          if (chroma < 8) continue;
          const hue = Math.atan2(lab[2], lab[1]);
          x += Math.cos(hue);
          y += Math.sin(hue);
          chromaSum += chroma;
          count += 1;
        }
        if (count < SEED_MIN_COVERAGE) return null;
        if (x === 0 && y === 0) return null;
        return {
          hue: (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360,
          chroma: chromaSum / count,
          coverage: count,
        };
      } catch {
        return null;
      }
    }
    let defaultWallpaperSeedDone = false;
    function sampleDefaultWallpaperSeed() {
      try {
        if (defaultWallpaperSeedDone) return;
        defaultWallpaperSeedDone = true;
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          try { applyCosmosSeed(sampleMediaSeed(image)); } catch {}
        };
        image.src = typeof WALLPAPER === 'string' ? WALLPAPER : '';
      } catch {}
    }
    function sampleCosmosHue(media) {
      if (media !== cosmosMedia) return;
      applyCosmosSeed(sampleMediaSeed(media));
    }

    function cosmosSnapshot() {
      return {
        has: cosmosMeta.has === true,
        kind: typeof cosmosMeta.kind === 'string' ? cosmosMeta.kind : '',
        name: typeof cosmosMeta.name === 'string' ? cosmosMeta.name : '',
        size: Number.isFinite(cosmosMeta.size) ? cosmosMeta.size : 0,
        version: Number.isFinite(cosmosMeta.version) ? cosmosMeta.version : 0,
        mime: typeof cosmosMeta.mime === 'string' ? cosmosMeta.mime : '',
      };
    }
    function cosmosSource(meta) {
      const version = meta && Number.isFinite(meta.version) ? String(meta.version) : '1';
      return COSMOS_ROUTE + '?v=' + encodeURIComponent(version);
    }
    function subscribeCosmos(listener) {
      cosmosListeners.add(listener);
      return () => {
        cosmosListeners.delete(listener);
      };
    }
    function emitCosmos() {
      for (const listener of Array.from(cosmosListeners)) {
        try { listener(); } catch {}
      }
    }
    function formatMediaSize(size) {
      if (!Number.isFinite(size) || size <= 0) return '';
      if (size >= 1024 * 1024 * 1024) return (size / (1024 ** 3)).toFixed(2) + ' GB';
      if (size >= 1024 * 1024) return (size / (1024 ** 2)).toFixed(1) + ' MB';
      return Math.max(1, Math.round(size / 1024)) + ' KB';
    }
    function cosmosReducedMotion() {
      try {
        return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {
        return false;
      }
    }
    function ensureCosmosLayer() {
      if (cosmosLayer !== null && cosmosLayer.isConnected) return cosmosLayer;
      if (!document.body) return null;
      try {
        const layer = document.createElement('div');
        layer.id = 'sws-cosmos';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);
        cosmosLayer = layer;
        cosmosMedia = null;
        cosmosMediaKey = '';
        return layer;
      } catch {
        return null;
      }
    }
    function cleanCosmosMedia() {
      const media = cosmosMedia;
      cosmosMedia = null;
      if (media === null) return;
      try {
        if (media.tagName === 'VIDEO') media.pause();
      } catch {}
      try {
        media.removeAttribute('src');
        media.remove();
      } catch {}
    }
    function mountCosmosMedia() {
      const layer = ensureCosmosLayer();
      if (layer === null) return;
      const meta = cosmosSnapshot();
      try {
        if (meta.has) document.body.setAttribute('data-sws-cosmos', meta.kind);
        else document.body.removeAttribute('data-sws-cosmos');
      } catch {}
      if (!meta.has) {
        cleanCosmosMedia();
        cosmosMediaKey = '';
        applyCosmosSeed(null);
        try {
          layer.removeAttribute('data-ready');
          layer.removeAttribute('data-kind');
        } catch {}
        return;
      }
      const key = meta.kind + ':' + String(meta.version);
      try { layer.setAttribute('data-kind', meta.kind); } catch {}
      if (cosmosMediaKey === key && cosmosMedia !== null) return;
      try { layer.removeAttribute('data-ready'); } catch {}
      cleanCosmosMedia();
      cosmosMediaKey = key;
      const source = cosmosSource(meta);
      const reduced = cosmosReducedMotion();
      let media;
      try {
        if (meta.kind === 'video') {
          media = document.createElement('video');
          media.muted = true;
          media.defaultMuted = true;
          media.loop = true;
          media.playsInline = true;
          media.preload = 'auto';
          media.autoplay = !reduced;
          media.setAttribute('muted', '');
          media.setAttribute('loop', '');
          media.setAttribute('playsinline', '');
          media.setAttribute('disablepictureinpicture', '');
          media.addEventListener('loadeddata', () => {
            try { layer.setAttribute('data-ready', ''); } catch {}
            sampleCosmosHue(media);
            setTimeout(() => sampleCosmosHue(media), 1200);
          });
          media.addEventListener('error', () => {
            try { layer.removeAttribute('data-ready'); } catch {}
            applyCosmosSeed(null);
          });
        } else {
          media = document.createElement('img');
          media.alt = '';
          media.setAttribute('aria-hidden', 'true');
          media.decoding = 'async';
          media.addEventListener('load', () => {
            try { layer.setAttribute('data-ready', ''); } catch {}
            sampleCosmosHue(media);
          });
          media.addEventListener('error', () => {
            try { layer.removeAttribute('data-ready'); } catch {}
            applyCosmosSeed(null);
          });
        }
        media.src = source;
        layer.appendChild(media);
        cosmosMedia = media;
        if (meta.kind === 'video' && !reduced) {
          const playing = media.play();
          if (playing && typeof playing.catch === 'function') playing.catch(() => {});
        }
        if (meta.kind !== 'video' && media.complete && media.naturalWidth > 0) {
          layer.setAttribute('data-ready', '');
        }
      } catch {
        cleanCosmosMedia();
      }
    }
    async function loadCosmosMeta() {
      try {
        const response = await fetch(COSMOS_META_ROUTE, { cache: 'no-store' });
        if (!response.ok) return;
        const parsed = await response.json();
        if (!parsed || typeof parsed !== 'object' || !parsed.meta || typeof parsed.meta !== 'object') return;
        cosmosMeta = parsed.meta;
        mountCosmosMedia();
        emitCosmos();
        if (cosmosMeta.has !== true) sampleDefaultWallpaperSeed();
        else defaultWallpaperSeedDone = false;
      } catch {}
    }
    function uploadCosmosFile(file, onProgress) {
      return new Promise((resolve) => {
        let settled = false;
        const finish = (result) => {
          if (settled) return;
          settled = true;
          resolve(result);
        };
        let request;
        try {
          request = new XMLHttpRequest();
        } catch {
          finish({ ok: false, error: 'network' });
          return;
        }
        try {
          request.open('POST', COSMOS_ROUTE, true);
          request.setRequestHeader('Content-Type', 'application/octet-stream');
          request.setRequestHeader('X-SWS-Name', encodeURIComponent(String(file.name || '')));
        } catch {
          finish({ ok: false, error: 'network' });
          return;
        }
        request.upload.onprogress = (event) => {
          try {
            if (event.lengthComputable && typeof onProgress === 'function') onProgress(event.loaded / event.total);
          } catch {}
        };
        request.onload = () => {
          let body = null;
          try { body = JSON.parse(request.responseText || '{}'); } catch {}
          if (request.status >= 200 && request.status < 300 && body && body.ok === true) {
            if (body.meta && typeof body.meta === 'object') {
              cosmosMeta = body.meta;
              mountCosmosMedia();
              emitCosmos();
            }
            finish({ ok: true });
            return;
          }
          finish({ ok: false, error: body && typeof body.error === 'string' ? body.error : 'store-failed' });
        };
        request.onerror = () => finish({ ok: false, error: 'network' });
        request.onabort = () => finish({ ok: false, error: 'network' });
        try {
          request.send(file);
        } catch {
          finish({ ok: false, error: 'network' });
        }
      });
    }
    async function clearCosmos() {
      try {
        const response = await fetch(COSMOS_ROUTE, { method: 'DELETE' });
        let body = null;
        try { body = await response.json(); } catch {}
        cosmosMeta = { has: false };
        mountCosmosMedia();
        emitCosmos();
        defaultWallpaperSeedDone = false;
        sampleDefaultWallpaperSeed();
        return { ok: response.ok && (!body || body.ok !== false) };
      } catch {
        return { ok: false, error: 'network' };
      }
    }
    function installCosmos() {
      let disposed = false;
      const start = () => {
        if (disposed) return;
        restoreDimLevel();
        loadDimLevel();
        ensureCosmosLayer();
        mountCosmosMedia();
        loadCosmosMeta();
      };
      if (document.body) start();
      else {
        try { document.addEventListener('DOMContentLoaded', start, { once: true }); } catch {}
      }
      const onVisibility = () => {
        if (disposed) return;
        const media = cosmosMedia;
        if (media === null || media.tagName !== 'VIDEO') return;
        try {
          if (document.hidden) media.pause();
          else {
            const playing = media.play();
            if (playing && typeof playing.catch === 'function') playing.catch(() => {});
          }
        } catch {}
      };
      try { document.addEventListener('visibilitychange', onVisibility); } catch {}
      return () => {
        disposed = true;
        try { document.removeEventListener('visibilitychange', onVisibility); } catch {}
        cleanCosmosMedia();
        cosmosMediaKey = '';
        applyCosmosSeed(null);
        try { if (cosmosLayer) cosmosLayer.remove(); } catch {}
        cosmosLayer = null;
        try { document.body.removeAttribute('data-sws-cosmos'); } catch {}
      };
    }

    function normalizeGreetText(value) {
      return String(value ?? '')
        .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
        .replace(/\s+/g, '')
        .replace(/[^\p{L}\p{N}]/gu, '')
        .toLowerCase();
    }

    /* A name counts wherever it appears in a short message, so the whole text
       is checked window by window. Only digests ship: no trigger word is
       recoverable from this file. */
    async function greetMatch(value) {
      const normalized = normalizeGreetText(value);
      if (normalized === '') return [];
      const subtle = typeof crypto === 'undefined' ? undefined : crypto.subtle;
      if (subtle === undefined) return [];
      const chars = Array.from(normalized);
      if (chars.length > 160) return [];
      const encoder = new TextEncoder();
      const tried = new Set();
      const groups = new Set();
      const longest = Math.min(24, chars.length);
      for (let length = 2; length <= longest; length += 1) {
        for (let start = 0; start + length <= chars.length; start += 1) {
          const window = chars.slice(start, start + length).join('');
          if (tried.has(window)) continue;
          tried.add(window);
          const data = encoder.encode(`${GREET_SALT}\u0000${window}`);
          const hash = await subtle.digest('SHA-256', data);
          const hex = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
          const index = GREET_DIGESTS.indexOf(hex);
          if (index !== -1) groups.add(Math.floor(index / GREET_GROUPS_PER_NAME));
        }
      }
      return Array.from(groups);
    }
    function GreetingOverlay() {
      const [visible, setVisible] = React.useState(false);
      const visibleRef = React.useRef(false);
      visibleRef.current = visible;
      const audioRef = React.useRef(null);
      React.useEffect(() => {
        /* One-time reset per shipped revision: never boot with a cooldown
           timestamp left over from an earlier build. */
        try {
          if (localStorage.getItem('dsh-star-wallpaper:greet-done-version') !== GREET_DONE_VERSION) {
            localStorage.removeItem(GREET_DONE_KEY);
            localStorage.setItem('dsh-star-wallpaper:greet-done-version', GREET_DONE_VERSION);
          }
        } catch {}
        const COMPOSER_SELECTOR =
          '[contenteditable]:not([contenteditable="false"]), [data-lexical-editor="true"], [role="textbox"], textarea';
        let checking = false;
        const fire = (groups) => {
          if (visibleRef.current) return;
          if (!Array.isArray(groups) || groups.length === 0) return;
          loadGreetDone()
            .then((done) => {
              if (visibleRef.current) return;
              const fresh = groups.filter((group) => !done.includes(group));
              if (fresh.length === 0) return;
              saveGreetDone([...done, ...fresh]);
              setVisible(true);
            })
            .catch(() => {});
        };
        const textOf = (node) => {
          if (node === null || node === undefined) return '';
          if (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
            return String(node.value ?? '').trim();
          }
          return String(node.innerText || node.textContent || '').trim();
        };
        const composerText = () => {
          for (const editable of document.querySelectorAll(COMPOSER_SELECTOR)) {
            if (editable.closest('[role="dialog"]') !== null) continue;
            const text = textOf(editable);
            if (text !== '') return text;
          }
          /* Fallback: the focused editable, wherever the composer put it. */
          const active = document.activeElement;
          if (active instanceof Element) {
            const text = textOf(active.closest(COMPOSER_SELECTOR) ?? active);
            if (text !== '') return text;
          }
          return '';
        };
        const checkOnSend = () => {
          if (visibleRef.current || checking) return;
          const text = composerText();
          if (text === '') return;
          checking = true;
          greetMatch(text)
            .then((groups) => {
              checking = false;
              if (groups.length !== 0) fire(groups);
            })
            .catch(() => {
              checking = false;
            });
        };
        const onKey = (event) => {
          if (event.key === 'Escape') setVisible(false);
          if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
          const active = document.activeElement;
          if (!(active instanceof Element) || active.closest(COMPOSER_SELECTOR) === null) return;
          checkOnSend();
        };
        const onPointer = (event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          if (target.closest('[class~="RlGAzG_primary"], [type="submit"]') === null) return;
          checkOnSend();
        };
        /* Typing the name is enough. Waiting for the send key was fragile: an
           IME swallows the first Enter, and composers disagree about where the
           caret lives. Both paths stay wired. */
        let inputTimer = null;
        const scheduleCheck = (delay) => {
          if (inputTimer !== null) clearTimeout(inputTimer);
          inputTimer = setTimeout(() => {
            inputTimer = null;
            checkOnSend();
          }, delay);
        };
        const isComposerNode = (node) => node instanceof Element && node.closest(COMPOSER_SELECTOR) !== null;
        const onInput = (event) => {
          if (visibleRef.current) return;
          if (!isComposerNode(event.target)) return;
          scheduleCheck(260);
        };
        /* A paste inserts through the editor's own model and can arrive without
           an input event the page sees, so nudge the check again afterwards. */
        const onPasteLike = (event) => {
          if (visibleRef.current) return;
          if (!isComposerNode(event.target)) return;
          scheduleCheck(180);
          scheduleCheck(620);
        };
        const onCompositionEnd = (event) => {
          if (visibleRef.current) return;
          if (!isComposerNode(event.target)) return;
          scheduleCheck(120);
        };
        document.addEventListener('input', onInput, true);
        document.addEventListener('beforeinput', onPasteLike, true);
        document.addEventListener('paste', onPasteLike, true);
        document.addEventListener('compositionend', onCompositionEnd, true);
        document.addEventListener('keydown', onKey, true);
        document.addEventListener('pointerdown', onPointer, true);
        return () => {
          if (inputTimer !== null) clearTimeout(inputTimer);
          document.removeEventListener('input', onInput, true);
          document.removeEventListener('beforeinput', onPasteLike, true);
          document.removeEventListener('paste', onPasteLike, true);
          document.removeEventListener('compositionend', onCompositionEnd, true);
          document.removeEventListener('keydown', onKey, true);
          document.removeEventListener('pointerdown', onPointer, true);
        };
      }, []);
      React.useEffect(() => {
        if (!visible) {
          const audio = audioRef.current;
          if (audio !== null && audio !== undefined) {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch {}
          }
          return undefined;
        }
        const audio = ambientAudioElement();
        if (audio === null) return undefined;
        audioRef.current = audio;
        try {
          audio.currentTime = 0;
        } catch {}
        const played = audio.play();
        if (played !== undefined && typeof played.catch === 'function') played.catch(() => {});
        return () => {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch {}
        };
      }, [visible]);
      if (!visible) return null;
      return h(
        'div',
        { className: 'swt-greeting-backdrop', onClick: () => setVisible(false) },
        h(
          'div',
          { className: 'swt-greeting-card', onClick: (event) => event.stopPropagation() },
          h('span', { className: 'swt-greeting-star', style: { left: '12%', top: '18%' } }),
          h('span', { className: 'swt-greeting-star', style: { left: '82%', top: '12%', animationDelay: '1.2s' } }),
          h('span', { className: 'swt-greeting-star', style: { left: '70%', top: '78%', animationDelay: '2.4s' } }),
          h(
            'button',
            {
              className: 'swt-greeting-close',
              type: 'button',
              'aria-label': '关闭',
              onClick: () => setVisible(false),
            },
            '×',
          ),
          h('p', { className: 'swt-greeting-text' }, GREET_TEXT),
          h('p', { className: 'swt-greeting-bless' }, GREET_BLESS),
          h('p', { className: 'swt-greeting-sig' }, "HIMEKO'S STARRY NIGHT"),
        ),
      );
    }

    /* The Windows title-bar menu buttons ("应用" / "编辑") are built by the
       desktop preload inside a shadow root, so the page stylesheet cannot see
       them. Their hover/expanded paint uses the shared interactive token, but
       the preload's own rule keeps a flat grey pill; inject the same liquid
       glass row material the rest of the theme uses directly into that shadow
       root. No DOM behaviour is touched — visual only. */
    const MENU_BAR_STYLE = `
      button {
        border-radius: 9px !important;
      }
      button:hover, button[aria-expanded="true"] {
        background-image: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.14) 0%,
          rgba(255, 255, 255, 0.04) 40%,
          rgba(255, 255, 255, 0.02) 62%,
          rgba(255, 255, 255, 0.08) 100%
        ) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.40),
          inset 0 0 0 0.5px rgba(255, 255, 255, 0.16),
          0 2px 8px rgba(0, 0, 0, 0.18) !important;
        color: var(--dsw-alias-label-primary) !important;
      }
    `;

    function styleMenuBar() {
      const host = document.querySelector('[data-windows-menu]');
      const root = host && host.shadowRoot;
      if (!root) return false;
      if (root.querySelector('style[data-dsh-plugin="star-wallpaper-menubar"]')) return true;
      const style = document.createElement('style');
      style.setAttribute('data-dsh-plugin', 'star-wallpaper-menubar');
      style.textContent = MENU_BAR_STYLE;
      root.append(style);
      return true;
    }

    /* Re-announce the palette once the stylesheet is live so the desktop
       preload re-samples its caption probe (the transparent probe above turns
       the native title-bar overlay transparent without waiting for the next
       theme toggle). */
    function refreshCaptionProbe() {
      try {
        const body = document.body;
        if (!body) return;
        body.style.setProperty('--dsw-caption-probe-tick', '1');
        body.style.removeProperty('--dsw-caption-probe-tick');
      } catch {}
    }

    /* ------------------------------------------------------------------
       Self-drawn title-bar menus.
       The desktop preload owns the 「应用 / 编辑」 buttons (inside a shadow
       root) and, on click, shells out to a native Electron popup menu that
       no page CSS can reach. Intercept those clicks in the capture phase
       before the preload handler runs, suppress the native popup, and draw
       the same deep-navy frosted glass every other secondary menu uses.
       ------------------------------------------------------------------ */
    const tr = (zh, en) =>
      String(document.documentElement.lang || 'zh').toLowerCase().startsWith('en') ? en : zh;

    let openMenuState = null;
    const boundMenuHosts = new WeakSet();

    function rememberFocusState() {
      try {
        const el = document.activeElement;
        const state = {
          el: el instanceof HTMLElement ? el : null,
          start: null,
          end: null,
          direction: null,
          ranges: [],
        };
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          state.start = el.selectionStart;
          state.end = el.selectionEnd;
          state.direction = el.selectionDirection ?? null;
        }
        const selection = document.getSelection();
        if (selection) {
          for (let index = 0; index < selection.rangeCount; index += 1) {
            state.ranges.push(selection.getRangeAt(index).cloneRange());
          }
        }
        return state;
      } catch {
        return null;
      }
    }

    function restoreFocusState(state) {
      if (!state) return;
      try {
        const el = state.el;
        if (el && el.isConnected && typeof el.focus === 'function') {
          el.focus({ preventScroll: true });
          if (
            (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
            state.start !== null &&
            state.start !== undefined
          ) {
            el.setSelectionRange(state.start, state.end ?? state.start, state.direction ?? undefined);
            return;
          }
        }
        const selection = document.getSelection();
        if (selection && state.ranges.length > 0) {
          selection.removeAllRanges();
          for (const range of state.ranges) selection.addRange(range);
        }
      } catch {}
    }

    function runEditCommand(command, remembered) {
      restoreFocusState(remembered);
      try {
        document.execCommand(command, false);
      } catch {}
    }

    function runEditSelectAll(remembered) {
      restoreFocusState(remembered);
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        try {
          el.select();
          return;
        } catch {}
      }
      try {
        document.execCommand('selectAll', false);
      } catch {}
    }

    function runEditPaste(remembered) {
      const read = navigator.clipboard && typeof navigator.clipboard.readText === 'function'
        ? navigator.clipboard.readText().catch(() => '')
        : Promise.resolve('');
      Promise.resolve(read).then((text) => {
        restoreFocusState(remembered);
        const el = document.activeElement;
        const editable =
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          (el instanceof HTMLElement && el.isContentEditable);
        if (editable && typeof text === 'string' && text.length > 0) {
          try {
            document.execCommand('insertText', false, text);
            return;
          } catch {}
        }
        try {
          document.execCommand('paste', false);
        } catch {}
      });
    }

    function menuEntries(kind) {
      if (kind === 'application') {
        return [
          {
            label: tr('检查更新…', 'Check for Updates…'),
            run: () => {
              const api = window.dshDesktop;
              if (api && api.updates && typeof api.updates.open === 'function') {
                Promise.resolve(api.updates.open()).catch(() => {});
              }
            },
          },
        ];
      }
      return [
        { label: tr('撤销', 'Undo'), key: 'Ctrl+Z', run: (state) => runEditCommand('undo', state) },
        { label: tr('重做', 'Redo'), key: 'Ctrl+Y', run: (state) => runEditCommand('redo', state) },
        { separator: true },
        { label: tr('剪切', 'Cut'), key: 'Ctrl+X', run: (state) => runEditCommand('cut', state) },
        { label: tr('复制', 'Copy'), key: 'Ctrl+C', run: (state) => runEditCommand('copy', state) },
        { label: tr('粘贴', 'Paste'), key: 'Ctrl+V', run: (state) => runEditPaste(state) },
        { label: tr('删除', 'Delete'), key: '', run: (state) => runEditCommand('delete', state) },
        { separator: true },
        { label: tr('全选', 'Select All'), key: 'Ctrl+A', run: (state) => runEditSelectAll(state) },
      ];
    }

    function closeMenu() {
      const state = openMenuState;
      if (!state) return;
      openMenuState = null;
      state.menu.classList.remove('is-open');
      if (state.anchor) state.anchor.setAttribute('aria-expanded', 'false');
      document.removeEventListener('pointerdown', state.onPointerDown, true);
      document.removeEventListener('keydown', state.onKeyDown, true);
      window.removeEventListener('blur', state.onWindowBlur);
      window.removeEventListener('resize', state.onWindowBlur);
      setTimeout(() => state.menu.remove(), 150);
    }

    function openMenu(host, kind, anchor) {
      closeMenu();
      const remembered = rememberFocusState();
      const menu = document.createElement('div');
      menu.className = 'swt-menu';
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', kind === 'application' ? tr('应用', 'Application') : tr('编辑', 'Edit'));

      const entries = [];
      const buttons = [];
      let activeIndex = -1;

      const setActive = (index) => {
        activeIndex = index;
        buttons.forEach((button, buttonIndex) => {
          button.classList.toggle('is-active', buttonIndex === activeIndex);
        });
      };
      const moveActive = (delta) => {
        if (buttons.length === 0) return;
        const base = activeIndex < 0 ? (delta > 0 ? -1 : 0) : activeIndex;
        const next = (base + delta + buttons.length) % buttons.length;
        setActive(next);
      };
      const activate = (entry) => {
        closeMenu();
        try {
          entry.run(remembered);
        } catch (error) {
          console.warn('star-wallpaper: title-bar menu action failed', error);
        }
      };

      for (const entry of menuEntries(kind)) {
        if (entry.separator) {
          const separator = document.createElement('div');
          separator.className = 'swt-menu-sep';
          separator.setAttribute('role', 'separator');
          menu.appendChild(separator);
          continue;
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'swt-menu-item';
        button.setAttribute('role', 'menuitem');
        button.tabIndex = -1;
        const label = document.createElement('span');
        label.textContent = entry.label;
        button.appendChild(label);
        if (entry.key) {
          const key = document.createElement('span');
          key.className = 'swt-menu-key';
          key.textContent = entry.key;
          button.appendChild(key);
        }
        button.addEventListener('pointerdown', (event) => event.preventDefault());
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          activate(entry);
        });
        menu.appendChild(button);
        entries.push(entry);
        buttons.push(button);
      }

      document.body.appendChild(menu);
      const rect = anchor.getBoundingClientRect();
      const width = menu.offsetWidth;
      let left = Math.round(rect.left);
      if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
      menu.style.left = left + 'px';
      menu.style.top = Math.round(rect.bottom + 6) + 'px';
      requestAnimationFrame(() => {
        if (openMenuState && openMenuState.menu === menu) menu.classList.add('is-open');
      });
      anchor.setAttribute('aria-expanded', 'true');

      const onPointerDown = (event) => {
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        if (path.includes(menu) || path.includes(host)) return;
        closeMenu();
      };
      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closeMenu();
          return;
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          event.stopPropagation();
          moveActive(1);
          return;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          event.stopPropagation();
          moveActive(-1);
          return;
        }
        if (event.key === 'Home') {
          event.preventDefault();
          event.stopPropagation();
          setActive(0);
          return;
        }
        if (event.key === 'End') {
          event.preventDefault();
          event.stopPropagation();
          setActive(buttons.length - 1);
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          if (activeIndex >= 0 && entries[activeIndex]) {
            event.preventDefault();
            event.stopPropagation();
            activate(entries[activeIndex]);
          }
          return;
        }
        if (event.key === 'Tab') closeMenu();
      };
      const onWindowBlur = () => closeMenu();

      document.addEventListener('pointerdown', onPointerDown, true);
      document.addEventListener('keydown', onKeyDown, true);
      window.addEventListener('blur', onWindowBlur);
      window.addEventListener('resize', onWindowBlur);

      openMenuState = { host, kind, anchor, menu, remembered, onPointerDown, onKeyDown, onWindowBlur };
    }

    function menuButtonFrom(host, event) {
      const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
      for (const node of path) {
        if (
          node instanceof HTMLElement &&
          node.tagName === 'BUTTON' &&
          node.getAttribute('role') === 'menuitem' &&
          node.getRootNode() === host.shadowRoot
        ) {
          return node;
        }
      }
      return null;
    }

    function menuKindFor(host, button) {
      const buttons = host.shadowRoot
        ? Array.from(host.shadowRoot.querySelectorAll('button[role="menuitem"]'))
        : [];
      return buttons.indexOf(button) === 0 ? 'application' : 'edit';
    }

    function bindMenuHost(host) {
      if (!host || !host.shadowRoot || boundMenuHosts.has(host)) return;
      boundMenuHosts.add(host);
      const swallow = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      host.addEventListener('pointerdown', (event) => {
        if (menuButtonFrom(host, event)) swallow(event);
      }, true);
      host.addEventListener('mousedown', (event) => {
        if (menuButtonFrom(host, event)) swallow(event);
      }, true);
      host.addEventListener('click', (event) => {
        const button = menuButtonFrom(host, event);
        if (!button) return;
        swallow(event);
        if (openMenuState && openMenuState.anchor === button) {
          closeMenu();
          return;
        }
        openMenu(host, menuKindFor(host, button), button);
      }, true);
      host.addEventListener('keydown', (event) => {
        const button = menuButtonFrom(host, event);
        if (!button) return;
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          swallow(event);
          openMenu(host, menuKindFor(host, button), button);
        }
      }, true);
    }

    /* ------------------------------------------------------------------
       Settings sections: 「关于」 and 「退出」 moved out of the title bar.
       ------------------------------------------------------------------ */
    function readRelease() {
      try {
        const boot = window.__DSH_BOOT__;
        const release = boot && typeof boot === 'object' ? boot.release : undefined;
        if (release && typeof release.version === 'string' && release.version !== '') {
          return {
            version: release.version,
            commit: typeof release.commit === 'string' ? release.commit : '',
          };
        }
      } catch {}
      return { version: '', commit: '' };
    }

    function compatText() {
      const state = COMPAT.state;
      if (state.level === 'full') return tr('完整（UI 指纹匹配）', 'Full (UI fingerprint matched)');
      if (state.level === 'partial') return tr('部分适配（已降级）', 'Partial (degraded)');
      if (state.level === 'base') return tr('基础模式（仅壁纸与变量，建议更新主题）', 'Base only (wallpaper + tokens; update the theme)');
      return tr('检测中…', 'Checking…');
    }

    function BackgroundSection() {
      const [snapshot, setSnapshot] = React.useState(cosmosSnapshot);
      const [progress, setProgress] = React.useState(-1);
      const [error, setError] = React.useState('');
      const [hover, setHover] = React.useState(false);
      const [dim, setDim] = React.useState(dimLevel);
      const imageInput = React.useRef(null);
      const videoInput = React.useRef(null);
      React.useEffect(() => subscribeCosmos(() => setSnapshot(cosmosSnapshot())), []);
      React.useEffect(() => subscribeDim(() => setDim(dimLevel)), []);
      React.useEffect(() => {
        loadCosmosMeta();
      }, []);
      const reason = (code) => {
        if (code === 'too-large') {
          return tr('这个文件太大了，换个小一些的（上限 512 MB）。', 'That file is too large — the limit is 512 MB.');
        }
        if (code === 'unsupported') {
          return tr(
            '这个格式读不了，试试 JPG / PNG / WebP / GIF / AVIF，或 MP4 / WebM。',
            'Unsupported format — try JPG / PNG / WebP / GIF / AVIF, MP4 or WebM.',
          );
        }
        if (code === 'network') {
          return tr(
            '本机服务没有应答，请确认在桌面端或 dsh web 里运行。',
            'The local service did not answer — run the desktop app or dsh web.',
          );
        }
        return tr('没能设置背景，再试一次看看。', 'Could not set the background — try again.');
      };
      const busy = progress >= 0;
      const accept = async (file) => {
        if (!file) return;
        const type = String(file.type || '');
        if (type !== '' && !/^(image|video)\//.test(type)) {
          setError(reason('unsupported'));
          return;
        }
        setProgress(0);
        setError('');
        const result = await uploadCosmosFile(file, (fraction) => {
          setProgress(Math.max(1, Math.min(100, Math.round(fraction * 100))));
        });
        setProgress(-1);
        if (!result.ok) setError(reason(result.error));
      };
      const fromInput = (event) => {
        const input = event.currentTarget;
        const file = input.files && input.files[0];
        try { input.value = ''; } catch {}
        accept(file);
      };
      const preview = snapshot.has
        ? snapshot.kind === 'video'
          ? h('video', {
              className: 'sws-bg-media',
              src: cosmosSource(snapshot),
              muted: true,
              playsInline: true,
              preload: 'metadata',
            })
          : h('img', { className: 'sws-bg-media', src: cosmosSource(snapshot), alt: '' })
        : h('div', { className: 'sws-bg-default' }, tr('星云', 'Nebula'));
      const current = snapshot.has
        ? (snapshot.kind === 'video' ? tr('视频 · ', 'Video · ') : tr('照片 · ', 'Photo · ')) + snapshot.name
        : tr('默认星云（莫奈取色）', 'Default nebula (Monet palette)');
      return h(
        'div',
        { className: 'sws-page' },
        h(
          'div',
          { className: 'sws-card' },
          h('div', { className: 'sws-title' }, tr('星辰画布', 'Cosmos canvas')),
          h(
            'div',
            { className: 'sws-desc' },
            tr(
              '星空是启程的地方，不是尽头。放一张照片，或一段会呼吸的影像，让窗外换成你想去的宇宙。',
              'The starry sky is where the journey starts, not where it ends. Set a photo — or a living video — and let the window open onto the cosmos you want to reach.',
            ),
          ),
          h(
            'div',
            { className: 'sws-bg-preview-row' },
            h('div', { className: 'sws-bg-preview' }, preview),
            h(
              'div',
              { className: 'sws-bg-facts' },
              h('div', { className: 'sws-row-label' }, tr('当前背景', 'Current background')),
              h('div', { className: 'sws-bg-name', title: current }, current),
              h(
                'div',
                { className: 'sws-bg-note' },
                snapshot.has
                  ? formatMediaSize(snapshot.size) + ' · ' + tr('只保存在本机', 'stored on this machine only')
                  : tr('姬子的星云 · 莫奈取色', "Himeko's nebula · Monet palette"),
              ),
            ),
          ),
          h(
            'div',
            {
              className: 'sws-bg-drop' + (hover ? ' sws-bg-drop-hover' : ''),
              onDragOver: (event) => {
                event.preventDefault();
                if (!busy) setHover(true);
              },
              onDragLeave: () => setHover(false),
              onDrop: (event) => {
                event.preventDefault();
                setHover(false);
                if (busy) return;
                const files = event.dataTransfer && event.dataTransfer.files;
                if (files && files.length > 0) accept(files[0]);
              },
            },
            h('div', { className: 'sws-bg-drop-title' }, tr('把照片或视频拖到这里', 'Drop a photo or video here')),
            h(
              'div',
              { className: 'sws-bg-drop-note' },
              tr(
                'JPG / PNG / WebP / GIF / AVIF · MP4 / WebM，最大 512 MB',
                'JPG / PNG / WebP / GIF / AVIF · MP4 / WebM, up to 512 MB',
              ),
            ),
          ),
          h(
            'div',
            { className: 'sws-actions' },
            h(
              'button',
              {
                type: 'button',
                className: 'sws-btn',
                disabled: busy,
                onClick: () => imageInput.current && imageInput.current.click(),
              },
              tr('选择照片…', 'Choose a photo…'),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'sws-btn sws-btn-ghost',
                disabled: busy,
                onClick: () => videoInput.current && videoInput.current.click(),
              },
              tr('选择视频…', 'Choose a video…'),
            ),
            snapshot.has
              ? h(
                  'button',
                  {
                    type: 'button',
                    className: 'sws-btn sws-btn-ghost',
                    disabled: busy,
                    onClick: () => {
                      clearCosmos();
                    },
                  },
                  tr('恢复星云', 'Back to the nebula'),
                )
              : null,
          ),
          h('div', { className: 'sws-dim' },
            h('div', { className: 'sws-dim-head' },
              h('span', { className: 'sws-row-label' }, tr('压暗', 'Dimming')),
              h('span', { className: 'sws-dim-value' }, dim + '%'),
            ),
            h('div', { className: 'sws-dim-control' },
              h('input', { className: 'sws-dim-range', type: 'range', min: 0, max: 100, step: 1, value: dim, onChange: (event) => applyDimLevel(Number(event.currentTarget.value)) }),
              h('input', { className: 'sws-dim-input', type: 'number', min: 0, max: 100, step: 1, value: dim, onChange: (event) => {
                const raw = event.currentTarget.value;
                if (raw === '') return;
                const number = Number(raw);
                if (Number.isFinite(number)) applyDimLevel(number);
              } }),
              h('span', { className: 'sws-dim-unit' }, '%'),
            ),
            h('div', { className: 'sws-dim-note' }, tr('0% 不压暗；65% 约等于原先最深的默认，100% 再深约 1.5 倍。', '0% leaves the picture untouched; 65% matches the old maximum, 100% is about 1.5x deeper.')),
          ),          h('input', { ref: imageInput, type: 'file', accept: 'image/*', style: { display: 'none' }, onChange: fromInput }),
          h('input', { ref: videoInput, type: 'file', accept: 'video/*', style: { display: 'none' }, onChange: fromInput }),
          busy
            ? h('div', { className: 'sws-bg-progress' }, tr('正在写入本机… ', 'Saving on this machine… ') + progress + '%')
            : null,
          error !== '' ? h('div', { className: 'sws-bg-error' }, error) : null,
        ),
      );
    }
    function AboutSection() {
      const release = readRelease();
      const [busy, setBusy] = React.useState(false);
      const checkForUpdates = () => {
        const api = window.dshDesktop;
        if (!api || !api.updates || typeof api.updates.open !== 'function') return;
        setBusy(true);
        Promise.resolve(api.updates.open())
          .catch(() => {})
          .finally(() => setBusy(false));
      };
      const row = (label, value) =>
        h(
          'div',
          { className: 'sws-row', key: label },
          h('span', { className: 'sws-row-label' }, label),
          h('span', { className: 'sws-row-value' }, value),
        );
      return h(
        'div',
        { className: 'sws-page' },
        h(
          'div',
          { className: 'sws-card' },
          h('div', { className: 'sws-wordmark' }, 'DeepSeek Harness'),
          h(
            'div',
            { className: 'sws-tagline' },
            tr('探索未至之境', 'Explore the uncharted'),
          ),
        ),
        h(
          'div',
          { className: 'sws-rows' },
          [
            release.version
              ? row(
                  tr('版本', 'Version'),
                  release.commit ? `${release.version} (${release.commit.slice(0, 7)})` : release.version,
                )
              : null,
            row(tr('主题', 'Theme'), tr('姬子的星月夜 · ' + THEME_VERSION, "Himeko's Starry Night · " + THEME_VERSION)),
            row(tr('兼容状态', 'Compatibility'), compatText()),
            row(
              tr('界面锚点', 'UI anchors'),
              '必需 ' + COMPAT.state.requiredMatched + ' / ' + COMPAT.state.required +
                ' · 可选 ' + COMPAT.state.optionalMatched + ' / ' + COMPAT.state.optional +
                (COMPAT.state.slotsTotal ? ' · 扩展 ' + COMPAT.state.slotsOk + ' / ' + COMPAT.state.slotsTotal : ''),
            ),
            (() => {
              const canvas = cosmosSnapshot();
              return row(
                tr('壁纸', 'Wallpaper'),
                canvas.has
                  ? tr('自定义 · ', 'Custom · ') + (canvas.kind === 'video' ? tr('视频', 'Video') : tr('照片', 'Photo'))
                  : tr('星云 · 莫奈取色', 'Nebula · Monet palette'),
              );
            })(),
          ].filter(Boolean),
        ),
        h(
          'div',
          { className: 'sws-card' },
          h('div', { className: 'sws-title' }, tr('检查更新', 'Check for updates')),
          h('div', { className: 'sws-desc' }, tr('从桌面端获取最新版本。', 'Get the latest desktop release.')),
          h(
            'div',
            { className: 'sws-actions' },
            h(
              'button',
              { type: 'button', className: 'sws-btn', disabled: busy, onClick: checkForUpdates },
              busy ? tr('检查中…', 'Checking…') : tr('检查更新', 'Check for updates'),
            ),
          ),
        ),
      );
    }

    function ExitSection() {
      const closeWindow = () => {
        try {
          window.close();
        } catch {}
      };
      return h(
        'div',
        { className: 'sws-page' },
        h(
          'div',
          { className: 'sws-card' },
          h('div', { className: 'sws-title' }, tr('退出 DeepSeek Harness', 'Quit DeepSeek Harness')),
          h(
            'div',
            { className: 'sws-desc' },
            tr(
              '点击下面的按钮会完全退出 DeepSeek Harness，正在进行的任务会被中断。请先确认没有需要保留的运行中任务或未发送内容。',
              'The button below fully quits DeepSeek Harness; running tasks are interrupted. Make sure nothing important is still running or unsaved first.',
            ),
          ),
          h(
            'div',
            { className: 'sws-actions' },
            h('button', { type: 'button', className: 'sws-btn', onClick: closeWindow }, tr('退出 DeepSeek Harness', 'Quit DeepSeek Harness')),
          ),
        ),
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        // Lock the dark palette: the wallpaper is designed for it, and the
        // light/dark chooser is hidden by the stylesheet below.
        const theme = ctx.get('theme');
        if (theme) {
          const lockDark = () => {
            try {
              if (theme.getTheme().preference !== 'dark') theme.setTheme('dark');
            } catch {}
          };
          lockDark();
          ctx.on('theme/change', lockDark);
        }
        // Compatibility probe. Fail-soft: a moved DSH build degrades the
        // theme status, never the host.
        try {
          runCompatProbe();
          setTimeout(runCompatProbe, 400);
          setTimeout(runCompatProbe, 2000);
        } catch {}
        // Stable anchor tagging: data-sws-* survives class-hash rebuilds and
        // keeps the most visible glass surfaces themed when the hashed layer
        // goes stale. Fail-soft; disposed with the plugin.
        let stopTagger = null;
        try { stopTagger = installTagger(); } catch {}
        let stopDockWatch = null;
        try { stopDockWatch = installDockFullscreenWatch(); } catch {}
        ctx.on('dispose', () => { try { if (stopDockWatch) stopDockWatch(); } catch {} });
        /* Dialogs mount after boot; rescan for a while so late sections
           (the appearance chooser) still get their semantic tags. */
        let rescanTimer = null;
        try {
          let ticks = 0;
          rescanTimer = setInterval(() => {
            ticks += 1;
            try { runTaggers(); } catch {}
            if (ticks > 24) { clearInterval(rescanTimer); rescanTimer = null; }
          }, 1500);
        } catch {}
        ctx.on('dispose', () => { try { if (rescanTimer) clearInterval(rescanTimer); } catch {} });
        ctx.on('dispose', () => { try { if (stopTagger) stopTagger(); } catch {} });
        /* The cosmos canvas: the user's own photo or video, mounted behind the
           shell and kept in sync with the Host-side canvas routes. */
        let stopCosmos = null;
        try { stopCosmos = installCosmos(); } catch {}
        ctx.on('dispose', () => { try { if (stopCosmos) stopCosmos(); } catch {} });
        // Title-bar menu glass, caption overlay, and the self-drawn menus.
        const ensureMenuBar = () => {
          const host = document.querySelector('[data-windows-menu]');
          if (!host || !host.shadowRoot) return false;
          styleMenuBar();
          bindMenuHost(host);
          return true;
        };
        const startMenuBar = () => {
          if (ensureMenuBar()) return;
          let tries = 0;
          const timer = setInterval(() => {
            tries += 1;
            if (ensureMenuBar() || tries > 120) clearInterval(timer);
          }, 250);
        };
        startMenuBar();
        setTimeout(refreshCaptionProbe, 120);
        setTimeout(refreshCaptionProbe, 1500);
        const menuObserver = new MutationObserver(() => ensureMenuBar());
        try {
          menuObserver.observe(document.body, { childList: true });
        } catch {}
        ctx.on('dispose', () => menuObserver.disconnect());
        ctx.on('dispose', () => closeMenu());
        // 「关于」 and 「退出」 live in Settings now, right below Agent 预设.
        // Register every slot through one fallback: a renamed/removed slot in a
        // future DSH build must only drop that extension, not the whole theme.
        const registerSlot = (slot, options, component) => {
          try {
            ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, ...options }, component));
            COMPAT.recordSlot(true);
          } catch (error) {
            COMPAT.recordSlot(false);
            try {
              console.info('[star-wallpaper] slot ' + slot + ' unavailable: ' + (error && error.message ? error.message : error));
            } catch {}
          }
        };
        registerSlot('settings.section', { id: 'star-background', order: 20, label: () => tr('背景', 'Background') }, BackgroundSection);
        registerSlot('settings.section', { id: 'star-about', order: 21, label: () => tr('关于', 'About') }, AboutSection);
        registerSlot('settings.section', { id: 'star-exit', order: 22, label: () => tr('退出', 'Exit') }, ExitSection);
        registerSlot('shell.overlay', { id: 'star-wallpaper', order: -100 }, NebulaWallpaper);
        registerSlot('shell.overlay', { id: 'star-greeting', order: -99 }, GreetingOverlay);
      },
    };
  },
});
