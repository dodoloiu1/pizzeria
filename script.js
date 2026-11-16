const MENU = [
  { id: "margherita", name: "Margherita", price: 9.5,
    desc: "Pomodoro San Marzano DOP, fior di latte di Agerola, basilico fresco, olio extravergine.",
    tags: [["classica", ""], ["vegetariana", "tag-veg"]] },
  { id: "marinara", name: "Marinara", price: 8.5,
    desc: "Pomodoro San Marzano, aglio, origano, olio extravergine. Senza formaggio: la prova del forno.",
    tags: [["classica", ""], ["vegana", "tag-veg"]] },
  { id: "diavola", name: "Diavola", price: 12.5,
    desc: "Salame piccante, mozzarella, pomodoro, un filo di miele al peperoncino.",
    tags: [["piccante", "tag-hot"]] },
  { id: "quattro", name: "Quattro Formaggi", price: 13.0,
    desc: "Mozzarella, gorgonzola, taleggio, parmigiano, un filo di miele. Pizza bianca.",
    tags: [["vegetariana", "tag-veg"]] },
  { id: "prosciutto", name: "Prosciutto e Rucola", price: 14.5,
    desc: "Cotta bianca, poi prosciutto crudo 18 mesi, rucola fresca e scaglie di parmigiano.",
    tags: [["piace molto", ""]] },
  { id: "funghi", name: "Funghi", price: 11.5,
    desc: "Funghetti castagna arrostiti, mozzarella, timo, olio al prezzemolo.",
    tags: [["vegetariana", "tag-veg"]] },
  { id: "capricciosa", name: "Capricciosa", price: 13.5,
    desc: "Carciofi, funghi, prosciutto cotto, olive nere, mozzarella, pomodoro.",
    tags: [] },
  { id: "tonno", name: "Tonno e Cipolla", price: 13.5,
    desc: "Tonno, cipolla rossa, capperi, mozzarella, scorza di limone.",
    tags: [] },
  { id: "salsiccia", name: "Salsiccia", price: 14.0,
    desc: "Salsiccia al finocchietto, peperoni arrostiti, cipollotto, scamorza affumicata.",
    tags: [["piace molto", ""]] },
  { id: "bufalina", name: "Bufalina", price: 15.0,
    desc: "Mozzarella di bufala campana, pomodorini confit, pesto di basilico.",
    tags: [] },
  { id: "ortolana", name: "Ortolana", price: 12.0,
    desc: "Zucchine e melanzane alla griglia, peperoni arrostiti, ricotta affumicata.",
    tags: [["vegetariana", "tag-veg"]] },
  { id: "insalata", name: "Insalata del Forno", price: 8.0,
    desc: "Rucola, pomodorini, scaglie di parmigiano, dressing al limone. Servita nel pistonino.",
    tags: [["contorno", ""], ["vegetariana", "tag-veg"]] },
];

const EURO = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
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

/* ---------- la carta ---------- */
MENU.forEach((item, i) => {
  const card = document.createElement("article");
  card.className = "pizza reveal";
  card.innerHTML = `
    <div class="pizza-photo">
      <img src="./images/${item.id}.jpg" alt="Pizza ${item.name}" loading="lazy" />
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
      <button class="btn" type="button" data-add="${item.id}">Aggiungi</button>
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

/* ---------- scontrino ---------- */
scontrinoNo.textContent = `n. ${String(Math.floor(1000 + Math.random() * 9000))}`;

function render() {
  const items = [...order.entries()];

  listEl.innerHTML = "";

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "order-empty";
    li.id = "order-empty";
    li.textContent = "La cassa è vuota.";
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
        <button type="button" data-dec="${id}" aria-label="Togli una ${item.name}">−</button>
        <span aria-live="polite">${qty}</span>
        <button type="button" data-inc="${id}" aria-label="Aggiungi una ${item.name}">+</button>
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
  countEl.textContent = `${count} articol${count === 1 ? "o" : "i"}`;
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
    `Grazie! ${count} articol${count === 1 ? "o" : "i"} (${totalEl.textContent}) riservati. `
    + "Mostra questa schermata al banco — pagamento in contanti o carta.";
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
