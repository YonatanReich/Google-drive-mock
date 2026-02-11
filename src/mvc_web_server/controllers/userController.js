const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt.js');

exports.register = async (req, res) => {
    const { userFirstName,
        userLastName,
        username,
        userEmail,
        userPassword,
        userImage,
        userDateOfBirth,
        userPhoneNumber } = req.body
    // Validate what error and print if any are needed here
    if (!username || !userEmail || !userPassword || !userFirstName || !userDateOfBirth || !userPhoneNumber) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }
    try {
        //check theres no duplicate usernames
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists",
                username: username
            });
        }
        //create the new user
        const newUser = new User({
            userFirstName,
            userLastName,
            username,
            userEmail,
            userPassword,
            userDateOfBirth,
            userPhoneNumber,
            userImage: userImage || null
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, jwtSecret, { expiresIn: '1h' });

        //send the correct response
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                name: `${newUser.userFirstName} ${newUser.userLastName || ''}`.trim(),
                profileImg: newUser.userImage
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error signing up user" });
    }
}

//get user details
exports.getUserDetails = (req, res) => {
    const IdToCheck = req.params.id
    const userToFind = User.GetUserDetailsById(IdToCheck)
    if (!userToFind) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(userToFind)
}

exports.getUserByUsername = async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            id: user._id,
            username: user.username,
            firstName: user.userFirstName,
            lastName: user.userLastName,
            email: user.userEmail,
            phoneNumber: user.userPhoneNumber
        });
    } catch (err) {
        console.error("Get User by Username Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateMySettings = (req, res) => {
    try {
        const username = req.params.username;

        const user = User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { firstName, lastName, phoneNumber } = req.body;

        if (firstName !== undefined) user.userFirstName = firstName;
        if (lastName !== undefined) user.userLastName = lastName;
        if (phoneNumber !== undefined) user.userPhoneNumber = phoneNumber;

        // Save updated user back to the map
        user.save();

        res.json({ message: "Settings updated" });
    } catch (err) {
        console.error("Update Settings Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateSettingsById = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, phoneNumber, userImage } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (firstName) user.userFirstName = firstName;
        if (lastName) user.userLastName = lastName;
        if (phoneNumber !== undefined) user.userPhoneNumber = phoneNumber;
        if (userImage !== undefined) {
            user.userImage = userImage;
        }

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Error updating settings" });
    }
};
exports.getMySettings = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.json({
            success: true,
            firstName: user.userFirstName || "",
            lastName: user.userLastName || "",
            email: user.userEmail || "",
            phoneNumber: user.userPhoneNumber || "",
            userImage: user.userImage || null
        });
    } catch (err) {
        console.error("Get My Settings Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};