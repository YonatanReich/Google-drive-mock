const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    userImage: { type: String, default: null },
    userDateOfBirth: { type: Date, required: true },
    userPhoneNumber: { type: String, default: null }
});

UserSchema.statics.getUserDetailsById = function (id) {
    return this.findById(id);
};

UserSchema.statics.findUserByUsernameAndPassword = function (username, password) {
    return this.findOne({ username, userPassword: password });
};

UserSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};

module.exports = mongoose.model("User", UserSchema);
