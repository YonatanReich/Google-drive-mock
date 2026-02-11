const mongoose = require("mongoose");
const crypto = require("crypto");

const PermissionSchema = new mongoose.Schema({
    pId: { type: String, default: () => crypto.randomUUID() },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    access: { type: String } // "viewer" or "editor"
});

const FileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentID: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    isFolder: { type: Boolean, default: false },
    permissions: { type: [PermissionSchema], default: [] },
    dateOfCreation: { type: Date, default: Date.now },
    dateOfModification: { type: Date, default: Date.now },
    inTrash: { type: Boolean, default: false },
    cppFileId: { type: String },// optional?
    isStarred: {
        type: Boolean,
        default: false
    },
    origin: { type: String, enum: ['manual', 'upload', 'scan'], default: 'manual' }
});


//Permission methods
FileSchema.methods.getPermissions = function () {
    return this.permissions;
};

FileSchema.methods.addPermission = function (userId, access) {
    const permission = {
        pId: crypto.randomUUID(),
        userId,
        access
    };
    this.permissions.push(permission);
    return permission;
};

FileSchema.methods.getPermission = function (pId) {
    return this.permissions.find(p => p.pId === pId);
};

FileSchema.methods.updatePermission = async function (pId, newAccess) {
    const perm = this.permissions.find(p => p.pId === pId);
    if (!perm) return null;

    perm.access = newAccess;
    await this.save();
    return perm;
};

FileSchema.methods.deletePermission = async function (pId) {
    const index = this.permissions.findIndex(p => p.pId === pId);
    if (index === -1) return false;

    this.permissions.splice(index, 1);
    await this.save();
    return true;
};


//Trash methods

FileSchema.methods.moveToTrash = async function () {
    this.inTrash = true;
    this.dateOfModification = new Date();
    return this.save();
};

FileSchema.methods.restoreFromTrash = async function () {
    this.inTrash = false;
    this.dateOfModification = new Date();
    return this.save();
};

FileSchema.methods.getInTrashStatus = function () {
    return this.inTrash;
};


FileSchema.statics.findTrashFilesByOwner = function (ownerId) {
    return this.find({
        $and: [
            { inTrash: true },
            {
                $or: [
                    { ownerID: ownerId },
                    { "permissions.userId": ownerId }
                ]
            }
        ]
    });
};


//other file methods
FileSchema.methods.rename = async function (newName) {
    this.name = newName;
    this.dateOfModification = new Date();
    return this.save();
};

FileSchema.statics.findRootFilesByOwner = function (ownerID) {
    return this.find({ ownerID });
};

FileSchema.statics.findById = function (id) {
    return this.findOne({ _id: id });
};

FileSchema.statics.deleteById = function (id) {
    return this.deleteOne({ _id: id });
};

FileSchema.statics.findByRealNameAndOwner = function (fileName, ownerId) {
    return this.findOne({ name: fileName, ownerID: ownerId });
};


FileSchema.statics.searchByName = function (query, userId) {
    return this.find({
        name: { $regex: query, $options: "i" },
        $or: [
            { ownerID: userId },
            { "permissions.userId": userId }
        ]
    });
};

FileSchema.statics.findAllFilesByOwner = function (ownerId) {
    return this.find({
        $or: [
            { ownerID: ownerId },
            { "permissions.userId": ownerId }
        ]
    });
};

module.exports = mongoose.model("File", FileSchema);