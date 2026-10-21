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

/* Standalone popovers/dialogs (agent team, registry pickers, schedule menu):
   same deep-navy frosted glass as the other secondary menus. */
:is(
  [class*="Xt1eiG_panel"],
  [class*="_2WTFBq_panel"],
  [class*="CVUQCW_panel"],
  [class*="_VovcG_panel"],
  [class*="fO69Vq_registry"],
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

`;

    function NebulaWallpaper() {
      return h('style', { 'data-dsh-plugin': 'star-wallpaper' }, CSS);
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
            tr('探索未竟之境', 'Explore the uncharted'),
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
            row(tr('主题', 'Theme'), tr('姬子的星月夜 · 1.0.0', "Himeko's Starry Night · 1.0.0")),
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
              '关闭窗口后，应用会继续在系统托盘中运行，正在进行的任务不会中断。要完全退出，请右键系统托盘中的 DeepSeek Harness 图标并选择「退出」。',
              'Closing the window keeps the app running in the system tray so running tasks continue. To quit completely, right-click the DeepSeek Harness tray icon and choose Quit.',
            ),
          ),
          h(
            'div',
            { className: 'sws-actions' },
            h('button', { type: 'button', className: 'sws-btn', onClick: closeWindow }, tr('关闭窗口', 'Close window')),
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
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'star-about',
          order: 21,
          label: () => tr('关于', 'About'),
        }, AboutSection));
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'star-exit',
          order: 22,
          label: () => tr('退出', 'Exit'),
        }, ExitSection));
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'star-wallpaper',
          order: -100,
        }, NebulaWallpaper));
      },
    };
  },
});
