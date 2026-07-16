const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Expense Tracker Backend is Running 🚀");
});

app.get("/about", (req, res) => {
    res.send("This is my first Express server");
});

app.get("/contact", (req, res) => {
    res.send("Contact API coming soon.");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
