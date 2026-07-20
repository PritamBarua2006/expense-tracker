console.log("db.js loaded");


const mongoose = require("mongoose");

async function connectDB() {

    try {

        await mongoose.connect(
            "mongodb://localhost:27017/expenseTracker"
        );

        console.log("✅ MongoDB Connected");

    } catch (error) {

        console.log(error);
        process.exit(1);

    }

}

module.exports = connectDB;