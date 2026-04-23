const express = require("express");
const router = express.Router();

const payment = require("../controllers/paymentController"); 
const db = require("../db"); // your sqlite connection

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
// CANCEL PAYMENT (NEW)
// ======================
router.post("/cancel", (req, res) => {
  const { id } = req.body;

  try {
    db.prepare(`
      UPDATE payments 
      SET status = 'cancelled' 
      WHERE id = ?
    `).run(id);

    res.json({ message: "Cancelled successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cancelling payment" });
  }
});

module.exports = router;
