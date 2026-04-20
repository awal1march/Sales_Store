const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payments", paymentRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000 🚀");
});