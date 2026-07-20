const express = require("express");

const router = express.Router();

const Expense = require("../models/Expense");

// ========================
// Get All Expenses
// ========================
router.get("/", async (req, res) => {

    try {

        const expenses = await Expense.find();

        res.json(expenses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// ========================
// Add Expense
// ========================
router.post("/", async (req, res) => {

    try {

        const expense = await Expense.create(req.body);

        res.status(201).json({
            message: "Expense Added Successfully",
            data: expense
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// ========================
// Update Expense
// ========================
router.put("/:id", async (req, res) => {

    console.log("ID:", req.params.id);
    console.log("Body:", req.body);

    try {

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        console.log("Updated Expense:", updatedExpense);

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found."
            });
        }

        res.json({
            message: "Expense Updated Successfully",
            data: updatedExpense
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }

});

// ========================
// Delete Expense
// ========================
router.delete("/:id", async (req, res) => {

    try {

        const deletedExpense = await Expense.findByIdAndDelete(
            req.params.id
        );

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found."
            });
        }

        res.json({
            message: "Expense Deleted Successfully",
            data: deletedExpense
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;