// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use("/api/auth", require("./routes/auth"));


// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// // Routes here...
// app.get("/", (req, res) => {
//   res.send("API running...");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== CORS =====
// Allow requests from frontend (React)
app.use(cors({
  origin: "http://localhost:3002", // your React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ===== Body Parser =====
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", require("./routes/auth"));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ===== Test Route =====
app.get("/", (req, res) => {
  res.send("API running...");
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
