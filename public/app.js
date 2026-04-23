const API = "https://sales-store-5a8r.onrender.com";

let cachedData = [];

// ======================
// LOGIN
// ======================
function login() {
  if (
    document.getElementById("username").value === "admin" &&
    document.getElementById("password").value === "1234"
  ) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadPayments();
  } else {
    alert("Wrong login");
  }
}

// ======================
// ADD PAYMENT
// ======================
async function addPayment() {
  const customer = document.getElementById("customer").value;
  const item = document.getElementById("item").value;
  const amount = document.getElementById("amount").value;

  if (!customer || !item || !amount) return alert("Fill all");

  await fetch(API + "/payments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: customer,
      item,
      total_amount: parseFloat(amount),
      date: new Date().toISOString()
    })
  });

  loadPayments();
}

// ======================
// LOAD PAYMENTS (🔥 FIXED UI)
// ======================
async function loadPayments() {
  const res = await fetch(API + "/payments/all");
  let data = await res.json();

  cachedData = data;

  const search = document.getElementById("search").value.toLowerCase();

  if (search) {
    data = data.filter(p =>
      p.customer_name.toLowerCase().includes(search)
    );
  }

  let totalSales = 0;
  let totalPaid = 0;

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach((p, i) => {

    const paid = p.paid_amount || 0;
    const total = p.total_amount || 0;
    const balance = total - paid;

    const status = paid >= total ? "completed" : "pending";

    totalSales += total;
    totalPaid += paid;

    list.innerHTML += `
      <li>
        <strong>${i + 1}. ${p.customer_name}</strong><br>
        Item: ${p.item}<br>

        💰 Paid: ${paid} / ${total}<br>
        🔥 Balance: ${balance}<br>

        📌 Status: ${status === "completed"
          ? "<span style='color:green;'>✔ COMPLETED</span>"
          : "<span style='color:orange;'>PENDING</span>"
        }<br><br>

        ${status !== "completed" ? `
          <button onclick="paySmall(${p.id})">Add Payment</button>
          <button onclick="deletePayment(${p.id})">❌ Delete</button>
        ` : `
          <span style="color:green;">✔ Fully Paid</span>
        `}
      </li>
    `;
  });

  document.getElementById("totalSales").innerText = totalSales;
  document.getElementById("totalPaid").innerText = totalPaid;
  document.getElementById("totalBalance").innerText = totalSales - totalPaid;
}

// ======================
// DELETE PAYMENT
// ======================
async function deletePayment(id) {
  if (!confirm("Delete this payment?")) return;

  await fetch(`${API}/payments/delete/${id}`, {
    method: "DELETE"
  });

  loadPayments();
}

// ======================
// INSTALLMENT PAYMENT
// ======================
async function paySmall(id) {
  const amount = prompt("Enter installment:");
  if (!amount || isNaN(amount)) return alert("Invalid amount");

  await fetch(API + "/payments/pay-small", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      amount: parseFloat(amount)
    })
  });

  loadPayments();
}

// ======================
// DARK MODE
// ======================
function toggleDark() {
  document.body.classList.toggle("dark");
}

// ======================
// EXPORT CSV
// ======================
function exportCSV() {
  let csv = "Customer,Item,Amount,Paid\n";

  cachedData.forEach(p => {
    csv += `${p.customer_name},${p.item},${p.total_amount},${p.paid_amount || 0}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "payments.csv";
  a.click();
}

// ======================
// DAILY REPORT
// ======================
function dailyReport() {
  const today = new Date().toDateString();

  let total = 0;

  cachedData.forEach(p => {
    if (p.date && new Date(p.date).toDateString() === today) {
      total += p.total_amount || 0;
    }
  });

  alert("Today's total sales: " + total);
}