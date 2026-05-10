const socket = io();

/* =========================
   🌐 GLOBAL STATE
========================= */

let STATE = {
  products: [],
  orders: []
};

let currentProduct = null;

/* =========================
   🧠 STATE SYNC
========================= */

socket.on("state:update", (state) => {
  STATE = state;
  render();
});

/* =========================
   🧪 GENERATE PRODUCT
========================= */

async function generate() {
  const prompt = document.getElementById("prompt").value;

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ prompt })
  });

  currentProduct = await res.json();
}

/* =========================
   🛒 ORDER PRODUCT
========================= */

async function order() {
  if (!currentProduct) return;

  await fetch("/api/order", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ product: currentProduct })
  });
}

/* =========================
   🧾 RENDER UI
========================= */

function render() {
  const productBox = document.getElementById("product");
  const orderBox = document.getElementById("orders");

  if (currentProduct) {
    productBox.innerHTML = `
      <h3>${currentProduct.name}</h3>
      <p>$${currentProduct.price}</p>
      <small>${currentProduct.status}</small>
    `;
  }

  orderBox.innerHTML = STATE.orders.map(o => `
    <div>
      🧾 ${o.product.name} → <b>${o.status}</b>
    </div>
  `).join("");
}

/* ========================= */
render();