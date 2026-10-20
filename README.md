# Dust & Lead 🤠

A pixel-art Old West action game that runs in the browser. No build step, no dependencies, no assets:
every sprite, sound and piece of music is generated in code.

**Play locally:** open `index.html` in a browser (or run `python3 -m http.server` and visit http://localhost:8000).
**Play online:** enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Controls
| Action | Keyboard / mouse | Touch |
|---|---|---|
| Move | WASD / arrows | left stick |
| Aim + shoot | mouse + click / Space | right stick |
| Reload | R | automatic |
| Dead Eye (slow motion) | Q / Shift: then **hold fire to mark** targets (up to 6), **release to execute** | EYE button, hold/release right stick |
| Context action (loot, rob, buy, mount) | E | big action button |
| Ride / dismount horse. Far away: **whistles** and the horse gallops to you | F | HRS button |
| Pause | P / Esc (auto-pauses when the tab loses focus) | tap to resume |
| Weapons | 1 revolver, 2 shotgun, 3 dynamite, C cycle | GUN button |
| Music on/off | M | MUS button |

## Features
Large scrolling map with towns, rail line and outposts · waves, bosses, bounty hunters, riflemen and dynamite throwers ·
Honor and Wanted systems · shop between waves · looting and hunting · bank and gold-train heists ·
random events (wagon ambush, duel, merchant) · day/night cycle and weather · missions, checkpoints and tutorial hints ·
procedural music ·
**Red Dead–inspired:** Dead Eye mark & execute (also detonates red barrels), named WANTED outlaws with bounties (gold dot on the map), fame ranks (Drifter → Outlaw → Gunslinger → Legend), horse whistle, low-health red vignette.

## Project layout
```
index.html          page + script order
css/style.css       page styling
js/core.js          canvas setup, palette, helpers, baked world drawing
js/sprites.js       characters, barrels, pickups, hearts
js/data.js          obstacles, global state, shop, loot, animals
js/heist.js         bank + train heists, enemy factory
js/atmosphere.js    day/night, weather, sky lighting
js/story.js         saves, random events, missions, tutorial
js/actions-ai.js    context action, cover, enemy types and AI
js/audio.js         music and ambience (Web Audio)
js/game.js          init, collision, spawning, damage, update loop, camera
js/render.js        draw(): world, lighting, HUD, menus
js/input.js         input, main loop, resize, bootstrap (loads last)
```

## Important
These are classic scripts that share one global scope, **so the order of the `<script>` tags in `index.html` matters**.
