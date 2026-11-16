const MENU = [
  { id: "margherita", name: "Margherita", price: 9.5,
    desc: "San Marzano DOP tomato, fior di latte from Agerola, fresh basil, extra-virgin olive oil.",
    tags: [["classic", ""], ["vegetarian", "tag-veg"]] },
  { id: "marinara", name: "Marinara", price: 8.5,
    desc: "San Marzano tomato, garlic, oregano, extra-virgin olive oil. No cheese — the oven's test.",
    tags: [["classic", ""], ["vegan", "tag-veg"]] },
  { id: "diavola", name: "Diavola", price: 12.5,
    desc: "Spicy salami, mozzarella, tomato, a ribbon of chilli honey.",
    tags: [["spicy", "tag-hot"]] },
  { id: "quattro", name: "Quattro Formaggi", price: 13.0,
    desc: "Mozzarella, gorgonzola, talegio, parmesan, a ribbon of honey. A white pizza.",
    tags: [["vegetarian", "tag-veg"]] },
  { id: "prosciutto", name: "Prosciutto e Rucola", price: 14.5,
    desc: "Baked plain, then 18-month prosciutto crudo, fresh rocket and shaved parmesan.",
    tags: [["popular", ""]] },
  { id: "funghi", name: "Funghi", price: 11.5,
    desc: "Roasted chestnut mushrooms, mozzarella, thyme, parsley oil.",
    tags: [["vegetarian", "tag-veg"]] },
  { id: "capricciosa", name: "Capricciosa", price: 13.5,
    desc: "Artichoke, mushroom, ham, black olives, mozzarella, tomato.",
    tags: [] },
  { id: "tonno", name: "Tonno e Cipolla", price: 13.5,
    desc: "Tuna, red onion, capers, mozzarella, lemon zest.",
    tags: [] },
  { id: "salsiccia", name: "Salsiccia", price: 14.0,
    desc: "Crumbled fennel sausage, roasted red pepper, spring onion, smoked scamorza.",
    tags: [["popular", ""]] },
  { id: "bufalina", name: "Bufalina", price: 15.0,
    desc: "Buffalo mozzarella from Campania, burst cherry tomatoes, basil pesto.",
    tags: [] },
  { id: "ortolana", name: "Ortolana", price: 12.0,
    desc: "Grilled courgette and aubergine, roasted pepper, smoked ricotta.",
    tags: [["vegetarian", "tag-veg"]] },
  { id: "insalata", name: "Insalata del Forno", price: 8.0,
    desc: "Rocket, cherry tomatoes, shaved parmesan, lemon dressing.",
    tags: [["side", ""], ["vegetarian", "tag-veg"]] },
];

const EURO = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const money = (n) => EURO.format(n);

const grid = document.getElementById("menu");
const listEl = document.getElementById("order-list");
const totalEl = document.getElementById("order-total");
const countEl = document.getElementById("order-count");
const checkoutBtn = document.getElementById("checkout");
const clearBtn = document.getElementById("clear-order");
const confirmEl = document.getElementById("order-confirm");
const scontrinoNo = document.getElementById("scontrino-no");

const order = new Map();

/* ---------- the menu ---------- */
MENU.forEach((item, i) => {
  const card = document.createElement("article");
  card.className = "pizza reveal";
  card.innerHTML = `
    <div class="pizza-photo">
      <img src="./images/${item.id}.jpg" alt="${item.name} pizza" loading="lazy" />
      <span class="pizza-num">${String(i + 1).padStart(2, "0")}</span>
    </div>
    <div class="pizza-body">
      <div class="pizza-head">
        <h3>${item.name}</h3>
        <span class="pizza-price">${money(item.price)}</span>
      </div>
      <p class="pizza-desc">${item.desc}</p>
      <div class="pizza-tags">
        ${item.tags.map(([t, cls]) => `<span class="tag ${cls}">${t}</span>`).join("")}
      </div>
      <button class="btn" type="button" data-add="${item.id}">Add</button>
    </div>
  `;
  grid.appendChild(card);
});

/* ---------- reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- theme toggle ---------- */
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function theme() {
  return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(t) {
  root.setAttribute("data-theme", t);
  try { localStorage.setItem("fornea-theme", t); } catch (e) {}
  const dark = t === "dark";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

themeToggle.addEventListener("click", () => {
  applyTheme(theme() === "dark" ? "light" : "dark");
});

applyTheme(theme());

/* ---------- receipt ---------- */
scontrinoNo.textContent = `n. ${String(Math.floor(1000 + Math.random() * 9000))}`;

function render() {
  const items = [...order.entries()];

  listEl.innerHTML = "";

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "order-empty";
    li.id = "order-empty";
    li.textContent = "Your box is empty.";
    listEl.appendChild(li);
  }

  items.forEach(([id, qty]) => {
    const item = MENU.find((m) => m.id === id);
    const li = document.createElement("li");
    li.className = "order-item";
    li.innerHTML = `
      <span>
        <span class="order-item-name">${item.name}</span>
        <span class="order-item-price">${money(item.price * qty)}</span>
      </span>
      <span class="qty">
        <button type="button" data-dec="${id}" aria-label="Remove one ${item.name}">−</button>
        <span aria-live="polite">${qty}</span>
        <button type="button" data-inc="${id}" aria-label="Add one ${item.name}">+</button>
      </span>
    `;
    listEl.appendChild(li);
  });

  const count = items.reduce((sum, [, q]) => sum + q, 0);
  const total = items.reduce((sum, [id, q]) => {
    const item = MENU.find((m) => m.id === id);
    return sum + item.price * q;
  }, 0);

  totalEl.textContent = money(total);
  countEl.textContent = `${count} item${count === 1 ? "" : "s"}`;
  checkoutBtn.disabled = count === 0;
  clearBtn.disabled = count === 0;
}

grid.addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  order.set(id, (order.get(id) || 0) + 1);
  confirmEl.hidden = true;
  render();
});

listEl.addEventListener("click", (e) => {
  const inc = e.target.dataset.inc;
  const dec = e.target.dataset.dec;
  if (inc) {
    order.set(inc, order.get(inc) + 1);
  } else if (dec) {
    const next = order.get(dec) - 1;
    if (next <= 0) order.delete(dec);
    else order.set(dec, next);
  } else {
    return;
  }
  confirmEl.hidden = true;
  render();
});

clearBtn.addEventListener("click", () => {
  order.clear();
  confirmEl.hidden = true;
  render();
});

checkoutBtn.addEventListener("click", () => {
  const count = [...order.values()].reduce((a, b) => a + b, 0);
  confirmEl.textContent =
    `Thanks! ${count} item${count === 1 ? "" : "s"} (${totalEl.textContent}) reserved. `
    + "Show this screen at the counter — cash or card.";
  confirmEl.hidden = false;
});

/* ---------- chrome ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

const burger = document.querySelector(".burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

render();
