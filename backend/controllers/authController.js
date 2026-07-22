const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists."
            });

        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully.",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log("Email entered:", email);
console.log("Password entered:", password);

        const user = await User.findOne({ email });

        console.log(user);

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password matched:", isMatch);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
    {
        id: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

res.status(200).json({
    message: "Login successful.",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    }
});

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports ={
    registerUser,
    loginUser
};