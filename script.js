const MENU = [
  { id: "margherita", name: "Margherita", price: 9.5, desc: "San Marzano tomato, fior di latte, basil, extra-virgin olive oil.", tags: ["vegetarian", "classic"] },
  { id: "marinara", name: "Marinara", price: 8.5, desc: "Tomato, garlic, oregano, olive oil. No cheese — the oven's test.", tags: ["vegan", "classic"] },
  { id: "diavola", name: "Diavola", price: 12.5, desc: "Spicy salami, tomato, mozzarella, chilli honey.", tags: ["spicy"] },
  { id: "quattro", name: "Quattro Formaggi", price: 13.0, desc: "Mozzarella, gorgonzola, taleggio, parmesan, a drop of honey.", tags: ["vegetarian"] },
  { id: "prosciutto", name: "Prosciutto e Rucola", price: 14.5, desc: "Cooked plain, then 18-month prosciutto, rocket, shaved parmesan.", tags: ["popular"] },
  { id: "funghi", name: "Funghi", price: 11.5, desc: "Roasted chestnut mushrooms, thyme, mozzarella, parsley oil.", tags: ["vegetarian"] },
  { id: "capricciosa", name: "Capricciosa", price: 13.5, desc: "Artichoke, mushroom, ham, olives, tomato, mozzarella.", tags: [] },
  { id: "tonno", name: "Tonno e Cipolla", price: 13.5, desc: "Tuna, red onion, capers, mozzarella, lemon zest.", tags: [] },
  { id: "salsiccia", name: "Salsiccia", price: 14.0, desc: "Fennel sausage, roasted peppers, spring onion, smoked scamorza.", tags: ["popular"] },
  { id: "bufalina", name: "Bufalina", price: 15.0, desc: "Buffalo mozzarella, cherry tomato, basil pesto.", tags: [] },
  { id: "ortolana", name: "Ortolana", price: 12.0, desc: "Grilled courgette, aubergine, pepper, smoked ricotta.", tags: ["vegetarian"] },
  { id: "insalata", name: "Insalata del Forno", price: 8.0, desc: "Rocket, cherry tomato, shaved parmesan, lemon dressing.", tags: ["side", "vegetarian"] },
];

const EURO = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const money = (n) => EURO.format(n);

const grid = document.getElementById("menu-grid");
const listEl = document.getElementById("order-list");
const totalEl = document.getElementById("order-total");
const countEl = document.getElementById("order-count");
const checkoutBtn = document.getElementById("checkout");
const clearBtn = document.getElementById("clear-order");
const confirmEl = document.getElementById("order-confirm");
const emptyEl = document.getElementById("order-empty");

const order = new Map();

/* ---------- menu ---------- */
MENU.forEach((item) => {
  const card = document.createElement("li");
  card.className = "card";
  card.innerHTML = `
    <div class="card-top">
      <h3>${item.name}</h3>
      <span class="price">${money(item.price)}</span>
    </div>
    <p class="desc">${item.desc}</p>
    ${item.tags.length ? `<div class="tags">${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
    <button class="btn btn-small" type="button" data-add="${item.id}">Add to box</button>
  `;
  grid.appendChild(card);
});

/* ---------- ordering ---------- */
function render() {
  const items = [...order.entries()];

  listEl.innerHTML = "";

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "order-empty";
    li.id = "order-empty";
    li.textContent = "Your box is empty — add something from the menu.";
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
  const total = totalEl.textContent;
  confirmEl.textContent = `Thanks! ${count} item${count === 1 ? "" : "s"} (${total}) reserved — show this screen at the counter.`;
  confirmEl.hidden = false;
});

/* ---------- chrome ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

render();
