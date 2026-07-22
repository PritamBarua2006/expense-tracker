const Expense = require("../models/Expense");

// Get All Expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({user: req.user.id});
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Expense
const addExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json({
            message: "Expense Added Successfully",
            data: expense
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Expense
const updateExpense = async (req, res) => {
    try {

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found."
            });
        }

        if (updatedExpense.user.toString() !== req.user.id) {
    return res.status(403).json({
        message: "Access denied."
    });
}

        res.json({
            message: "Expense Updated Successfully",
            data: updatedExpense
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    try {

        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found."
            });
        }

        if (deletedExpense.user.toString() !== req.user.id) {
    return res.status(403).json({
        message: "Access denied."
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
};

module.exports = {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
};