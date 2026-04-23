const API = "https://sales-store-5a8r.onrender.com";

let cachedData = []; // store data for export/report

// LOGIN
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

// ADD PAYMENT
async function addPayment() {
  const customer = document.getElementById("customer").value;
  const item = document.getElementById("item").value;
  const amount = document.getElementById("amount").value;

  if (!customer || !item || !amount) return alert("Fill all");

  await fetch(API + "/payments/add", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      customer_name: customer,
      item,
      total_amount: parseFloat(amount),
      date: new Date().toISOString()
    })
  });

  loadPayments();
}

// LOAD
async function loadPayments() {
  const res = await fetch(API + "/payments/all");
  let data = await res.json();

  cachedData = data; // save for export/report

  const search = document.getElementById("search").value.toLowerCase();
  if (search) {
    data = data.filter(p =>
      p.customer_name.toLowerCase().includes(search)
    );
  }

  let totalSales = 0, totalPaid = 0;

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach((p, i) => {
    totalSales += p.total_amount || 0;
    totalPaid += p.paid_amount || 0;

    list.innerHTML += `
      <li>
        <strong>${i+1}. ${p.customer_name}</strong><br>
        ${p.item} - ${p.total_amount}<br>
        Paid: ${p.paid_amount ?? 0}<br>
      </li>
    `;
  });

  document.getElementById("totalSales").innerText = totalSales;
  document.getElementById("totalPaid").innerText = totalPaid;
  document.getElementById("totalBalance").innerText = totalSales - totalPaid;
}

// 🌙 DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// 📊 EXPORT CSV (Excel)
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

// 📅 DAILY REPORT
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