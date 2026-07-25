console.log("db.js loaded");

const mongoose = require("mongoose");

async function connectDB() {
    try {
        //console.log("MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

    } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error cause:", error.cause);

    process.exit(1);
}
}

module.exports = connectDB;