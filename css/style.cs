:root{--bg:#e8bd68;--ink:#3a2438;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);color-scheme:light}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#2a1b2c;--ink:#f6e3b4;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#2a1b2c;--ink:#f6e3b4;color-scheme:dark}
html,body{height:100%;margin:0;background:var(--bg);color:var(--ink);overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none}
body{display:flex;align-items:center;justify-content:center}
canvas{image-rendering:pixelated;display:block}
