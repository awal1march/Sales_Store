
const db = require("../db");

// ======================
// ADD PAYMENT
// ======================
exports.addPayment = (req, res) => {
  try {
    const { customer_name, item, total_amount } = req.body;

    if (!customer_name || !item || !total_amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    db.prepare(`
      INSERT INTO payments (customer_name, item, total_amount, paid_amount, status, created_at)
      VALUES (?, ?, ?, 0, 'pending', datetime('now'))
    `).run(customer_name, item, total_amount);

    res.json({ message: "Payment added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding payment" });
  }
};

// ======================
// GET PAYMENTS
// ======================
exports.getPayments = (req, res) => {
  try {
    const data = db.prepare(`
      SELECT * FROM payments
      ORDER BY created_at DESC
    `).all();

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

// ======================
// DELETE PAYMENT (soft-safe version recommended)
// ======================
exports.deletePayment = (req, res) => {
  const { id } = req.params;

  try {
    const result = db.prepare(
      "DELETE FROM payments WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting payment" });
  }
};

// ======================
// ADD PARTIAL PAYMENT (INSTALLMENT)
// ======================
exports.addPartialPayment = (req, res) => {
  try {
    const { id, amount } = req.body;

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