const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

//checks if use exists by username and password
exports.doesUserExist = async (req, res) => {
    //gets arguemnts
    const { username, password } = req.body

    //makes sure both arguments were provided
    if (!username) {
        return res.status(400).json({
            message: "Please provide a username"
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "Please provide a password"
        });
    }

    //searches for the user and sends the correct reponse
    const user = await User.findOne({ username: username, userPassword: password });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username },
        jwtSecret
    );

    res.status(201).json({
        token,
        user: {
            id: user.id,
            username: user.username,
            name: `${user.userFirstName} ${user.userLastName || ''}`.trim()
        }
    });
}