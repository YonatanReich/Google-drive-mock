const User = require('../models/User');

// recieve the request and checks if theres a id number. if so - does 'next' fuction.
const validateUserId = (req, res, next) => {

    // taking the id from the header.
    const userId = req.headers['user-id'];

    // if there's no ID - returns 401 error
    if (!userId) {
        return res.status(401).json({ error: "Missing user id" });
    }

    // checking if the ID exists in the user's database.
    const user = User.GetUserDetailsById(userId);
    if (!user) {
        return res.status(401).json({
            message: "User not found in database"
        });
    }

    req.userId = userId;

    // if everything of - calls the next funciton.
    next();
};

module.exports = { validateUserId };