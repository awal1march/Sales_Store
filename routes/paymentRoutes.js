const router = require("express").Router();
const payment = require("../controllers/paymentController");


router.post("/add", payment.addPayment);
router.get("/all", payment.getPayments);
router.delete("/delete/:id", payment.deletePayment);
router.post("/pay-small", payment.addPartialPayment);

module.exports = router;