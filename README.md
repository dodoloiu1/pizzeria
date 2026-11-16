# Fornea — Neapolitan Pizzeria

A single-page site for a fictional wood-fired pizzeria in Rome, in the visual
language of a real neighbourhood trattoria: editorial serif type, paper and
terracotta palette, a printed-menu layout, a receipt-styled order pad, and a
light/dark theme toggle.

No build step, no dependencies. Everything is plain HTML, CSS and JavaScript.

## Run it

Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
```

## Theming

The toggle in the header switches between light and dark. The choice is stored
in `localStorage`; on first visit the site follows `prefers-color-scheme`. An
inline script in `<head>` applies the theme before first paint, so there is no
flash of the wrong theme.

## Sections

- **Hero** — headline, two house shots, a "Verace Pizza Napoletana" stamp, and a
  scrolling strip of the house credentials.
- **The Menu** — the twelve dishes, each with its own photograph.
- **The Oven** — the oven and the 48-hour dough, on a dark panel.
- **Order** — a working order pad styled as an Italian *scontrino*: quantities,
  running total, pickup reservation.
- **Find Us** — address and opening hours.

## Photos

`images/` holds one photograph per dish, generated with Google Stitch from a
per-dish prompt (commercial food photography art direction: dark slate, warm
side light, shallow depth of field). They are generated assets, not stock
photography.

## Deploy

Hosted on GitHub Pages from the `main` branch, root path:
https://dodoloiu1.github.io/pizzeria/

## Files

- `index.html` — page markup + pre-paint theme script
- `styles.css` — design tokens (light/dark), layout, responsive rules
- `script.js` — menu data, order pad, theme toggle, scroll reveals
- `images/*.jpg` — generated dish photography
