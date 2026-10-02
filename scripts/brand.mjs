// Shared, embedded theme for the portable HTML views. No network or font assets.
// Source: 26folio/project-spine/10-design-system.md; reconciled against
// 26folio/src/app/globals.css @theme on 2026-09-10 (the current canonical tokens).
// Keep distribution self-contained; installed brand fonts use local() with fallbacks.
export const brandCSS = `
@font-face{font-family:"General Sans";src:local("General Sans");font-display:swap}
@font-face{font-family:"Clash Display";src:local("Clash Display");font-display:swap}
@font-face{font-family:"JetBrains Mono";src:local("JetBrains Mono");font-display:swap}
:root{color-scheme:dark;--bg:#1a1411;--surface:#241c18;--surface-2:#2e2420;--line:#3a2e28;--line-strong:#4a3a32;--ink:#f8dfe7;--muted:#c9a6b0;--soft-ink:#e9c8d3;--rose:#ec8ca0;--caramel:#c99368;--peach:#f0a98a;--success:#7fb89a;--amber:#e3b34e;--danger:#d65a4f;--font-sans:"General Sans",system-ui,-apple-system,"Segoe UI",sans-serif;--font-display:"Clash Display","General Sans",system-ui,sans-serif;--font-mono:"JetBrains Mono",ui-monospace,Consolas,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 var(--font-sans)}h1,h2,h3{font-family:var(--font-display);text-wrap:balance}a{color:var(--rose);text-underline-offset:.2em}button,input,select{font:inherit;color:inherit;border-radius:0}button{cursor:pointer}button:disabled{cursor:default}*:focus-visible{outline:2px solid var(--rose);outline-offset:3px}::selection{background:var(--caramel);color:var(--bg)}[hidden]{display:none!important}.skip-link{position:absolute;left:16px;top:-100px;z-index:20;background:var(--rose);color:var(--bg);padding:10px}.skip-link:focus{top:8px}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important}}
`;
