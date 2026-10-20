# Dust & Lead 🤠

A pixel-art Old West action game that runs in the browser. No build step, no dependencies, no assets:
every sprite, sound and piece of music is generated in code.

**Play locally:** open `index.html` in a browser.
**Play online:** enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Controls
- Move: WASD / left stick
- Aim + shoot: mouse + click / right stick
- Reload: R (automatic when empty)
- Dead Eye: Q / EYE button
- Context action (loot, rob, buy): E / big action button
- Ride horse: F / HRS button
- Weapons: 1 revolver, 2 shotgun, 3 dynamite, C cycle
- Music on/off: M / MUS button

## Important
The scripts share one global scope, so the order of the `<script>` tags in `index.html` matters.
