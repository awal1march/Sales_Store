
const db = require("../db");

// ======================
// ADD PAYMENT
// ======================
exports.addPayment = (req, res) => {
  const { customer_name, item, total_amount } = req.body;

  db.prepare(`
    INSERT INTO payments (customer_name, item, total_amount, paid_amount, status)
    VALUES (?, ?, ?, 0, 'pending')
  `).run(customer_name, item, total_amount);

  res.json({ message: "Payment added successfully" });
};

// ======================
// GET PAYMENTS
// ======================
exports.getPayments = (req, res) => {
  const data = db.prepare(`
    SELECT * FROM payments ORDER BY created_at DESC
  `).all();

  res.json(data);
};

// ======================
// DELETE PAYMENT
// ======================
exports.deletePayment = (req, res) => {
  const { id } = req.params;

  const result = db.prepare(
    "DELETE FROM payments WHERE id = ?"
  ).run(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json({ message: "Payment deleted successfully" });
};

// ======================
// ADD PARTIAL PAYMENT
// ======================
exports.addPartialPayment = (req, res) => {
  const { id, amount } = req.body;

  try {
    const payment = db.prepare(
      "SELECT * FROM payments WHERE id = ?"
    ).get(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const currentPaid = payment.paid_amount || 0;
    const total = payment.total_amount || 0;

    const newPaid = currentPaid + Number(amount);

    let status = "pending";

    if (newPaid >= total) {
      status = "completed";
    }

    db.prepare(`
      UPDATE payments
      SET paid_amount = ?, status = ?
      WHERE id = ?
    `).run(newPaid, status, id);

    res.json({
      message: "Payment updated successfully",
      paid: newPaid,
      status
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      message: "Error updating payment",
      error: err.message
    });
  }
};