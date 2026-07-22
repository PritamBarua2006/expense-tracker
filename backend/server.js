require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");

const authRoutes = require("./routes/authRoutes");


const app = express();


    
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/expenses", expenseRoutes);
app.use("/auth", authRoutes);

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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});