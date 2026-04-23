// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// const paymentRoutes = require("./routes/paymentRoutes");
// app.use("/payments", paymentRoutes);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT} 🚀`);
// });

const express = require("express");
const cors = require("cors");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ======================
// ROUTES
// ======================
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payments", paymentRoutes);

// ======================
// HEALTH CHECK (Render friendly)
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running 🚀",
    status: "OK"
  });
});

// ======================
// ERROR HANDLING (IMPORTANT)
// ======================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});