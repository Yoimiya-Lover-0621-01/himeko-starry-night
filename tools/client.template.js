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

`;

    function NebulaWallpaper() {
      return h('style', { 'data-dsh-plugin': 'star-wallpaper' }, CSS);
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
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'star-wallpaper',
          order: -100,
        }, NebulaWallpaper));
      },
    };
  },
});
