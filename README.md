# Fornea — Pizzeria Napoletana

A single-page site for a fictional wood-fired pizzeria in Rome, in the visual
language of a real neighbourhood trattoria: editorial serif type, paper and
terracotta palette, a printed-menu layout and a receipt-styled order pad.

No build step, no dependencies. Everything is plain HTML, CSS and JavaScript.

## Run it

Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
```

## Sections

- **Hero** — headline, two house shots, a "Verace Pizza Napoletana" stamp, and a
  scrolling strip of the house credentials.
- **La Carta** — the twelve dishes, each with its own photograph.
- **Il Forno** — the oven and the 48-hour dough, on a dark panel.
- **Ordina** — a working order pad styled as an Italian *scontrino*: quantities,
  running total, pickup reservation.
- **La Sede** — address and opening hours.

## Photos

`images/` holds one photograph per dish, generated with Google Stitch from a
per-dish prompt (commercial food photography art direction: dark slate, warm
side light, shallow depth of field). They are generated assets, not stock
photography.

## Deploy

Hosted on GitHub Pages from the `main` branch, root path:
https://dodoloiu1.github.io/pizzeria/

## Files

- `index.html` — page markup
- `styles.css` — design tokens, layout, responsive rules
- `script.js` — menu data, order pad, scroll reveals
- `images/*.jpg` — generated dish photography
