const API = "http://localhost:3000";

// SAVE PAYMENT
async function addPayment() {
  const customerName = document.getElementById("customer").value;
  const item = document.getElementById("item").value;
  const amount = document.getElementById("amount").value;

  const res = await fetch(API + "/payments/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customer_name: customerName,
      item,
      total_amount: Number(amount)
    })
  });

  const data = await res.json();
  alert(data.message);
}

// DELETE
async function deletePayment(id) {
  const ok = confirm("Delete this payment?");
  if (!ok) return;

  const res = await fetch(
    `http://localhost:3000/payments/delete/${id}`,
    { method: "DELETE" }
  );

  const data = await res.json();
  alert(data.message);
  loadPayments();
}

// LOAD
async function loadPayments() {
  const res = await fetch(API + "/payments/all");
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {
    list.innerHTML += `
      <li>
        ${p.customer_name} - ${p.item}<br>
        Paid: ${p.paid_amount ?? 0} / ${p.total_amount ?? 0}<br>
        Status: ${p.status ?? "pending"}<br>

        <button onclick="paySmall(${p.id})">Add Payment</button>
        <button onclick="deletePayment(${p.id})">❌ Delete</button>
      </li>
    `;
  });
}

// SMALL PAYMENT
async function paySmall(id) {
  const amount = prompt("Enter amount paid:");
  if (!amount) return;

  const res = await fetch(API + "/payments/pay-small", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id,
      amount: Number(amount)
    })
  });

  const data = await res.json();
  alert(data.message);

  loadPayments();
}