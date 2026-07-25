const Budget = require("../models/Budget");

// Get current month's budget
const getBudget = async (req, res) => {

    try {

        const today = new Date();

        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const budget = await Budget.findOne({
            user: req.user.id,
            month,
            year
        });

        if (!budget) {
            return res.status(200).json({
                amount: 0
            });
        }

        res.status(200).json(budget);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// Create or Update current month's budget
const setBudget = async (req, res) => {

    try {

        const { amount } = req.body;

        const today = new Date();

        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        let budget = await Budget.findOne({
            user: req.user.id,
            month,
            year
        });

        if (budget) {

            budget.amount = amount;

            await budget.save();

            return res.status(200).json(budget);

        }

        budget = await Budget.create({

            user: req.user.id,
            month,
            year,
            amount

        });

        res.status(201).json(budget);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    getBudget,
    setBudget
};