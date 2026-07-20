require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const Expense = require("./models/Expense");

const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
    
// Connect to MongoDB
console.log(require("./config/db"));
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/expenses", expenseRoutes);

// ========================
// Home Route
// ========================

// ========================
// About Route
// ========================
app.get("/about", (req, res) => {
    res.send("This is my first Express server");
});

// ========================
// Contact Route
// ========================
app.get("/contact", (req, res) => {
    res.send("Contact API coming soon.");
});


// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 3000;

console.log("Server file loaded successfully");

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});