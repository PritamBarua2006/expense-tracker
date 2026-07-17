const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory database
const expenses = [];

// ========================
// Home Route
// ========================
app.get("/", (req, res) => {
    res.send("Expense Tracker Backend is Running 🚀");
});

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
// Get All Expenses
// ========================
app.get("/expenses", (req, res) => {
    res.status(200).json(expenses);
});

// ========================
// Add Expense
// ========================
app.post("/expenses", (req, res) => {

    const expense = req.body;

    // Basic validation
    if (
        !expense.title ||
        !expense.category ||
        !expense.amount ||
        !expense.payment ||
        !expense.date
    ) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    expenses.push(expense);

    res.status(201).json({
        message: "Expense Added Successfully",
        data: expense
    });

});

// ========================
// Update Expense
// ========================
app.put("/expenses/:id", (req, res) => {

    const index = Number(req.params.id);

    if (index < 0 || index >= expenses.length) {
        return res.status(404).json({
            message: "Expense not found."
        });
    }

    expenses[index] = req.body;

    res.json({
        message: "Expense Updated Successfully",
        data: expenses[index]
    });

});

// ========================
// Delete Expense
// ========================
app.delete("/expenses/:id", (req, res) => {

    const index = Number(req.params.id);

    if (index < 0 || index >= expenses.length) {
        return res.status(404).json({
            message: "Expense not found."
        });
    }

    const deletedExpense = expenses.splice(index, 1);

    res.json({
        message: "Expense Deleted Successfully",
        data: deletedExpense[0]
    });

});

// ========================
// Start Server
// ========================
const PORT = 3000;

console.log("Server file loaded successfully");

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});