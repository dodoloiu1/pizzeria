# Fornea — Pizzeria

A small static site for a fictional wood-fired pizzeria: menu, an "order ahead"
box with a running total, and opening hours. No build step, no dependencies.

## Run it

Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
```

## Deploy

Hosted on GitHub Pages from the `main` branch (root path).

## Files

- `index.html` — single page markup
- `styles.css` — design tokens, layout, responsive rules
- `script.js` — renders the menu from a data array and handles the order box
