const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this path is correct
const asyncHandler = require("express-async-handler");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
            
            req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

// Middleware to check if user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as admin" });
    }
};

module.exports = { protect, admin };
