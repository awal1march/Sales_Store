const express = require("express");
const router = express.Router();

const payment = require("../controllers/paymentController");
const db = require("../db");

// ======================
// PAYMENT ROUTES
// ======================

// ADD PAYMENT
router.post("/add", payment.addPayment);

// GET ALL PAYMENTS
router.get("/all", payment.getPayments);

// DELETE PAYMENT
router.delete("/delete/:id", payment.deletePayment);

// ADD INSTALLMENT
router.post("/pay-small", payment.addPartialPayment);

// ======================
// CANCEL PAYMENT (FIXED + SAFE)
// ======================
router.post("/cancel", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Payment ID required" });
  }

  try {
    const paymentRow = db.prepare(
      "SELECT * FROM payments WHERE id = ?"
    ).get(id);

    if (!paymentRow) {
      return res.status(404).json({ message: "Payment not found" });
    }

    db.prepare(`
      UPDATE payments 
      SET status = 'cancelled'
      WHERE id = ?
    `).run(id);

    res.json({ message: "Payment cancelled successfully" });

  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ message: "Error cancelling payment" });
  }
});

module.exports = router;