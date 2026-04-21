const API = "https://sales-store.onrender.com";

// SAVE PAYMENT
async function addPayment() {
  const customerName = document.getElementById("customer").value;
  const item = document.getElementById("item").value;
  const amount = document.getElementById("amount").value;

  if (!customerName || !item || !amount) {
    return alert("Please fill all fields");
  }

  try {
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

    loadPayments(); // refresh after adding

  } catch (err) {
    console.error(err);
    alert("Error adding payment");
  }
}

// DELETE
async function deletePayment(id) {
  const ok = confirm("Delete this payment?");
  if (!ok) return;

  try {
    const res = await fetch(
      `${API}/payments/delete/${id}`, // ✅ FIXED (no localhost)
      { method: "DELETE" }
    );

    const data = await res.json();
    alert(data.message);

    loadPayments();

  } catch (err) {
    console.error(err);
    alert("Error deleting payment");
  }
}

// LOAD
async function loadPayments() {
  try {
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

  } catch (err) {
    console.error(err);
    alert("Error loading payments");
  }
}

// SMALL PAYMENT
async function paySmall(id) {
  const amount = prompt("Enter amount paid:");
  if (!amount) return;

  try {
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

  } catch (err) {
    console.error(err);
    alert("Error updating payment");
  }
}