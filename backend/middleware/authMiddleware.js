const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Store decoded user information in request object
            req.user = decoded;

            // Continue to the next middleware/controller
            next();

        } catch (error) {
            return res.status(401).json({
                message: "Not authorized. Invalid token."
            });
        }
    }

    // If no token is provided
    if (!token) {
        return res.status(401).json({
            message: "Not authorized. No token provided."
        });
    }
};

module.exports = {
    protect
};