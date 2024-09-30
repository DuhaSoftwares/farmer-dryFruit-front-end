const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//stat expres and dotenv
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON requests
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic Route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
