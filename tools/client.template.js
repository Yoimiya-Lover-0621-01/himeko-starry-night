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
    linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.40) 46%, rgba(255, 255, 255, 0.50) 100%),
    url("${WALLPAPER}");
  background-position: center center, 50% center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: saturate(1.3) brightness(1.01);
}
body[data-ds-dark-theme]::before {
  background-image:
    linear-gradient(180deg, rgba(7, 9, 20, 0.22) 0%, rgba(7, 9, 20, 0.12) 46%, rgba(7, 9, 20, 0.38) 100%),
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
/* ===== Easter egg: a quiet letter, surfaced only by chosen words ========
   The trigger words are never shipped: they live in localStorage and are
   edited in Settings → 彩蛋. This stylesheet only paints the card when the
   overlay component decides to open. */
.swt-egg-backdrop {
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
  animation: swt-egg-fade 0.55s ease both;
}
.swt-egg-card {
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
  animation: swt-egg-rise 0.6s cubic-bezier(0.22, 0.9, 0.25, 1) both;
}
.swt-egg-star {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(230, 232, 255, 0.8);
  animation: swt-egg-twinkle 4.5s ease-in-out infinite;
}
.swt-egg-text {
  margin: 0;
  font-size: 15px;
  line-height: 2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: pre-wrap;
  color: #dfe3ff;
}
.swt-egg-bless {
  margin: 22px 0 0;
  text-align: center;
  font-size: 17px;
  letter-spacing: 0.22em;
  color: #dcd6ff;
  text-shadow: 0 0 18px rgba(170, 160, 255, 0.35);
}
.swt-egg-sig {
  margin: 20px 0 0;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.34em;
  color: rgba(160, 166, 210, 0.58);
}
.swt-egg-close {
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
.swt-egg-close:hover {
  color: #f1f2ff;
  background: rgba(255, 255, 255, 0.10);
}
@keyframes swt-egg-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes swt-egg-rise {
  from { opacity: 0; transform: translateY(14px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes swt-egg-twinkle {
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
/* Delivered-file cards: the stock fill is a solid opaque black; make them glass. */
body[data-ds-dark-theme] [class~="flL80G_root"] {
  --deliverable-fill: rgba(255, 255, 255, 0.07) !important;
  --deliverable-hover: rgba(255, 255, 255, 0.14) !important;
}
body:not([data-ds-dark-theme]) [class~="flL80G_root"] {
  --deliverable-fill: rgba(255, 255, 255, 0.40) !important;
  --deliverable-hover: rgba(255, 255, 255, 0.60) !important;
}
[class~="flL80G_file"] {
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  backdrop-filter: blur(30px) saturate(150%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 0 0.5px rgba(255, 255, 255, 0.14) !important;
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

`;

    function NebulaWallpaper() {
      return h('style', { 'data-dsh-plugin': 'star-wallpaper' }, CSS);
    }

    /* ===== Compatibility guard =========================================
       The stylesheet targets class names from one DSH web-client build. A DSH
       upgrade re-hashes them and the hashed layer goes inert all at once.
       Fingerprint the shell instead of trusting it: report the result in
       Settings -> About and window.__SWS_COMPAT__, and degrade the status
       honestly instead of silently painting half a theme. Never throw: a
       theme must not be able to take the host down. */
    const THEME_VERSION = '1.0.1';
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
        ['sidebar', '[class*="_2H3hWW_"]', true],
        ['composer', '[class*="RlGAzG_"]', true],
        ['account chip', '[class*="ET65mq_"]', true],
        ['session header', '[class*="Dc7zOa_"]', false],
        ['usage dock', '[class*="iq1doa_"]', false],
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
       It never touches layout or React state; a debounced MutationObserver
       re-applies attributes React may drop during reconciliation. */
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
    ];
    function tagWith(selector, attribute) {
      try {
        for (const node of document.querySelectorAll(selector)) node.setAttribute(attribute, '');
      } catch {}
    }
    function tagComposerCard() {
      try {
        const editor = document.querySelector('[contenteditable]:not([contenteditable="false"]), [data-lexical-editor="true"]');
        if (!editor) return;
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
        if (card) card.setAttribute('data-sws-composer', '');
      } catch {}
    }
    function runTaggers() {
      tagComposerCard();
      for (const entry of TAGGED) tagWith(entry[0], entry[1]);
      tagWith('[role="dialog"]', 'data-sws-dialog');
      tagWith('[role="menu"]', 'data-sws-menu');
      tagWith('[class*="_bubble"], [class*="bubble"]', 'data-sws-bubble');
    }
    function installTagger() {
      let timer = 0;
      const schedule = () => {
        if (timer) return;
        timer = setTimeout(() => { timer = 0; runTaggers(); }, 180);
      };
      schedule();
      setTimeout(runTaggers, 900);
      setTimeout(runTaggers, 2800);
      let observer = null;
      try {
        observer = new MutationObserver(schedule);
        observer.observe(document.body, { childList: true, subtree: true });
      } catch {}
      return () => {
        try { if (observer) observer.disconnect(); } catch {}
        if (timer) clearTimeout(timer);
      };
    }

    /* ===== Easter egg: a letter kept for three-character names ==========
       Deliberately hidden: no Settings entry, no visible control. Typing a
       name (or its full pinyin, or its last two characters) in the composer
       and sending greets the reader with the letter below. Only SHA-256
       digests of the accepted inputs ship in this repository: no name, no
       pinyin, and no reversible encoding. */
    const EGG_LAST_KEY = 'dsh-star-wallpaper:egg-last';
    const EGG_COOLDOWN_MS = 30 * 60 * 1000;
    const EGG_SALT = 'himeko-starry-night/egg/v1';
    const EGG_DIGEST_BLOB =
      '613ca050f79389128eb883891e4c6304bb3f6d82b9c6320c1fdf8d781dfee0abab6256a7cdcbf17cb2a9dc4b4bbaf77eedd7c86e867d768352a5f9c8863570706b53b2620f32be39e6b08ae5b4092106d1a489c0286b1d2b3488d95aac17067940ab70e099f6ae5460fe55df4e9184ac180580292b3c869efaff4817cb1264b8592b399476017bf20fcebe96544a2acf76b149543ed6b404f29db2d28ca600ff097e682dcdfd043644f997760c1b7fe958798833438799071c2189dc2503831ec1a91d9596a6ef5407854ca41fa2a2c0739190299151c82183e5cb94616fc02966ab66a7f7977e5741df60a6d5cd1754180c6acc14111de022746031cc38d587b55aaf5d7b4d2d0b4cc14f4dc6d3cc290042903661ed747bc3caade67229fd5a96507ced9d917bd687ad0219cd0acd02b60ca4f59dc956c7da21dfb6321bf747f63aa3fd06442a2da5c1407a7c82fbd69540d8834c42430f159ea00ddb6c0d343e84712b63845ff78fb52f0ebcd1235c36a8294cb41ca02905701218e8f4339a2febadb7f58f5f976fdafbfd901f0bc09c4de4454a9c8454880f1027cafacc1edd79095993bd632cd4aab4f0d01999e432c437fc3c5a672e9d3edc5c963670d18782a5b8d9db9f7f30c660380a8197a4f7a7d9539764eeb11a126f177743533334369746a4ddf74895e983bc441d25897409a35842476c110657876905a0bc278c9fc2c2fef10cf9a12475e33baa01426b499fa3a3c518ff81421ec234031772395366a4adee1400a41cafc8d874e052d47038b841591cf31f5748af6e6319b5037a3e590e01fb868cb6408b3a4de337ee9b3c08c07a757ae4ff859c9f00828df255d78c25747639adf6a81def95ea8243c0283313f4157bfb9398ba1053677512a2cd31f35632f4e7c07354e7520570c21c1990410aa4a3ebbe3f7d7c1dcbc049727b14c5dd14a2c40a6a53971be65ad8446f98abcea57f61d5ce7534448ecf52c0b9ecdaf52794c9d48814c6446ac52715e5f93c577effe275086af54873272a23485c6b1ef43a66be89403bdc65c4dcb34dce9c32e2f42098f46240fbe0bd98a4f77a2c605464ac257219778b90b6d68e87dc50f20862b4109c83342cc6f5766964583c214e26237dff95c92f39d61aa964f56eccc70fdd648693d8611d62da197ff511acc9c5f62b6015c38ce91dd3dbf6a1df7bebed9da66196aeb8d0a75284d52bd7dc1f62296244cd1bf22ad90e6867f03f420a332ddbe3ba10dbe7409a1522fe04dfd3c145b346d39f24d6c9cbff8695c378aaf94e8e9b24d9a2c054aa88d781618933f78df0fc31b0d89e83583dbbc9ee6455c752182495a946756a';
    const EGG_DIGESTS = EGG_DIGEST_BLOB.match(/.{64}/g) || [];
    const EGG_TEXT = [
      '很久很久以后，或许会突然意识到，谁对谁错，何是何非，',
      '由爱生疑，由疑生恨，或者难以释怀的背弃，无法谅解的谎言。',
      '生命中会突然刺痛我的，使我感到遗憾、伤痛的，不论是一首歌曲、',
      '一张照片，或一个我再也无法见到的人，事过境迁，我心中留下的，',
      '或许还是那句话：',
    ].join('\n');
    const EGG_BLESS = '我总是祝福着你。';
    const EGG_BGM = '__EGG_BGM_DATA_URI__';

    function normalizeEggText(value) {
      return String(value ?? '')
        .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
        .replace(/\s+/g, '')
        .replace(/[^\p{L}\p{N}]/gu, '')
        .toLowerCase();
    }

    async function eggDigest(value) {
      const normalized = normalizeEggText(value);
      if (normalized === '') return '';
      const subtle = typeof crypto === 'undefined' ? undefined : crypto.subtle;
      if (subtle === undefined) return '';
      const data = new TextEncoder().encode(`${EGG_SALT}\u0000${normalized}`);
      const hash = await subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    function EasterEgg() {
      const [visible, setVisible] = React.useState(false);
      const visibleRef = React.useRef(false);
      visibleRef.current = visible;
      const audioRef = React.useRef(null);
      React.useEffect(() => {
        /* One-time reset per shipped revision: never boot with a cooldown
           timestamp left over from an earlier build. */
        try {
          if (localStorage.getItem('dsh-star-wallpaper:egg-reset:v2') !== '1') {
            localStorage.removeItem(EGG_LAST_KEY);
            localStorage.setItem('dsh-star-wallpaper:egg-reset:v2', '1');
          }
        } catch {}
        const COMPOSER_SELECTOR =
          '[contenteditable]:not([contenteditable="false"]), [data-lexical-editor="true"]';
        let checking = false;
        const fire = () => {
          if (visibleRef.current) return;
          const now = Date.now();
          let last = 0;
          try {
            last = Number(localStorage.getItem(EGG_LAST_KEY) ?? '0');
          } catch {}
          if (Number.isFinite(last) && now - last < EGG_COOLDOWN_MS) return;
          try {
            localStorage.setItem(EGG_LAST_KEY, String(now));
          } catch {}
          setVisible(true);
        };
        const composerText = () => {
          for (const editable of document.querySelectorAll(COMPOSER_SELECTOR)) {
            if (editable.closest('[role="dialog"]') !== null) continue;
            const text = (editable.innerText || editable.textContent || '').trim();
            if (text !== '') return text;
          }
          return '';
        };
        const checkOnSend = () => {
          if (visibleRef.current || checking) return;
          const text = composerText();
          if (text === '') return;
          checking = true;
          eggDigest(text)
            .then((hex) => {
              checking = false;
              if (hex !== '' && EGG_DIGESTS.includes(hex)) fire();
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
        document.addEventListener('keydown', onKey, true);
        document.addEventListener('pointerdown', onPointer, true);
        return () => {
          document.removeEventListener('keydown', onKey, true);
          document.removeEventListener('pointerdown', onPointer, true);
        };
      }, []);
      React.useEffect(() => {
        if (!visible) {
          const audio = audioRef.current;
          if (audio !== null) {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch {}
          }
          return;
        }
        let audio = audioRef.current;
        if (audio === null) {
          audio = new Audio(EGG_BGM);
          audio.loop = true;
          audio.preload = 'auto';
          audioRef.current = audio;
        }
        audio.volume = 0.55;
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
        { className: 'swt-egg-backdrop', onClick: () => setVisible(false) },
        h(
          'div',
          { className: 'swt-egg-card', onClick: (event) => event.stopPropagation() },
          h('span', { className: 'swt-egg-star', style: { left: '12%', top: '18%' } }),
          h('span', { className: 'swt-egg-star', style: { left: '82%', top: '12%', animationDelay: '1.2s' } }),
          h('span', { className: 'swt-egg-star', style: { left: '70%', top: '78%', animationDelay: '2.4s' } }),
          h(
            'button',
            {
              className: 'swt-egg-close',
              type: 'button',
              'aria-label': '关闭',
              onClick: () => setVisible(false),
            },
            '×',
          ),
          h('p', { className: 'swt-egg-text' }, EGG_TEXT),
          h('p', { className: 'swt-egg-bless' }, EGG_BLESS),
          h('p', { className: 'swt-egg-sig' }, "HIMEKO'S STARRY NIGHT"),
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
            row(tr('壁纸', 'Wallpaper'), tr('星云 · 莫奈取色', 'Nebula · Monet palette')),
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
        ctx.on('dispose', () => { try { if (stopTagger) stopTagger(); } catch {} });
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
        registerSlot('settings.section', { id: 'star-about', order: 21, label: () => tr('关于', 'About') }, AboutSection);
        registerSlot('settings.section', { id: 'star-exit', order: 22, label: () => tr('退出', 'Exit') }, ExitSection);
        registerSlot('shell.overlay', { id: 'star-wallpaper', order: -100 }, NebulaWallpaper);
        registerSlot('shell.overlay', { id: 'star-egg', order: -99 }, EasterEgg);
      },
    };
  },
});
