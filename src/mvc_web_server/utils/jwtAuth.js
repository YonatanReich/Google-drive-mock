const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt.js');
const User = require('../models/User');

const isLoggedIn = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: "Token required" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const data = jwt.verify(token, jwtSecret);

        const user = await User.findById(data.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.userId = data.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = isLoggedIn;