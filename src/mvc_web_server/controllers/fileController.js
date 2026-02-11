const File = require('../models/File');
const Client = require('../services/Client');
const User = require('../models/User');
const path = require('path');
const mongoose = require('mongoose');

//File methods
exports.getMyFiles = async (req, res) => {
    try {
        const userId = req.userId;
        const { parentId, inTrash } = req.query;

        let query = {
            $or: [
                { ownerID: userId },
                { "permissions.userId": userId }
            ]
        };
        console.log("Query Params:", req.query);
        if (inTrash === 'true') {
            query.inTrash = true;
        } else {
            query.inTrash = false;

            const targetParentId = (!parentId || parentId === 'null' || parentId === 'undefined')
                ? null
                : parentId;
            query.parentID = targetParentId;
        }

        const files = await File.find(query);

        const responseFiles = files.map(file => ({
            id: file._id,
            name: file.name,
            ownerId: file.ownerID,
            parentId: file.parentID,
            isFolder: file.isFolder,
            inTrash: file.inTrash,
            permissions: file.permissions,
            dateOfCreation: file.dateOfCreation,
            owner: file.ownerID,
            isStarred: file.isStarred || false,
            origin: file.origin
        }));

        res.json(responseFiles);

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.postFile = async (req, res) => {
    // Default isFolder to false if undefined
    const { name, content, isFolder = false, parentID = null, origin } = req.body;
    const ownerId = req.userId;

    // Validation: Filename is always required
    if (!name) {
        return res.status(400).json({
            message: "Please provide a name"
        });
    }

    // Validation: Content is required ONLY for files (not folders)
    if (!isFolder && !content) {
        return res.status(400).json({
            message: "Please provide content"
        });
    }
    // Validation: Folders should not have content
    if (isFolder && content) {
        return res.status(400).json({
            message: "Folder must not have content provided"
        });
    }

    try {
        const newFile = new File({
            name: name,
            ownerID: ownerId,
            parentID: parentID,
            isFolder: isFolder,
            inTrash: false,
            origin: origin
        });

        const uniqueFileId = newFile._id.toString();

        if (!isFolder) {
            const result = await Client.uploadfile(uniqueFileId, content);

            if (!result.includes("201")) {
                return res.status(500).json({
                    message: "Error saving file to CPP storage"
                });
            }
        }

        // Save the Metadata to MongoDB
        await newFile.save();

        // Send response
        return res.status(201).json({
            message: isFolder ? "Folder created successfully" : "File uploaded successfully",
            id: uniqueFileId,
            name: newFile.name,
            ownerID: newFile.ownerID,
            isFolder: newFile.isFolder,
            parentID: newFile.parentID,
            dateOfCreation: newFile.createdAt, // If using timestamps
            inTrash: false
        });

    } catch (error) {
        console.error("Create File Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteFile = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.userId;

    try {
        const file = await File.findOne({ _id: fileId, ownerID: userId });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        if (file.inTrash === false) {
            file.inTrash = true;
            file.dateOfModification = new Date();
            await file.save();

            return res.status(200).json({
                success: true,
                message: "File moved to trash successfully"
            });
        }

        console.log("File is already in Trash, proceeding to hard delete..");

        const CPPresult = await Client.deleteFile(file._id);

        await File.deleteOne({ _id: file._id });

        return res.status(200).json({
            success: true,
            message: "File deleted permanently"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getFile = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.userId;

    try {
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        let contentFromCPP = '';
        try {
            contentFromCPP = await Client.getFile(fileId);
        } catch (cppErr) {
            console.error("C++ Fetch Error:", cppErr);
        }
        return res.status(200).json({
            success: true,
            data: {
                id: file.id || file._id,
                name: file.name,
                content: contentFromCPP || '',
                isFolder: file.isFolder,
                parentID: file.parentID,
                ownerID: file.ownerID,
                inTrash: file.inTrash,
                origin: file.origin,
                dateOfCreation: file.dateOfCreation,
                isStarred: file.isStarred,
            }
        });

    } catch (error) {
        console.error("Get File Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.updateFile = async (req, res) => {
    const fileName = req.params.id;
    const userId = req.userId;
    const { content, name, ownerID, parentID, isStarred } = req.body;

    try {
        const file = await File.findOne({
            _id: fileName,
            $or: [
                { ownerID: userId },
                { "permissions.userId": userId }
            ]
        });

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }
        if (typeof isStarred !== 'undefined') {
            file.isStarred = isStarred;
        }
        if (content) {
            const fileIDForCPP = file.id || file._id;
            await Client.updateFile(fileIDForCPP, content);
        }

        if (name) file.name = name;

        if (ownerID) {
            if (User.findById(ownerID)) {
                file.addPermission(userId, 'editor');
                file.ownerID = ownerID;
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        }

        if (parentID) {
            file.parentID = parentID;
        }

        file.dateOfModification = new Date();

        await file.save();

        return res.status(200).json({
            message: "File updated successfully",
            id: file._id,
            isStarred: file.isStarred,
            name: file.name,
            inTrash: file.inTrash
        });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get list of files/folders in root directory (that are not in Trash)
exports.getFilesList = async (req, res) => {
    const userId = req.userId; // user if after validation

    try {
        // get the files that userid owns or has permission to
        const files = File.findRootFilesByOwner(userId);
        const response = files.map(f => ({
            ...f,
            ownerId: f.ownerID,
            parentId: f.parentID
        }));

        return res.status(200).json(response);
        // error - return 500
    } catch (error) {
        console.error("Error getting files list", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get list of Trash files/folders in root directory - that are in Trash)
exports.getTrashFilesList = async (req, res) => {
    const userId = req.userId; // user if after validation

    try {
        // get the files that userid owns or has permission to
        const files = File.findTrashFilesByOwner(userId);
        // return the files list
        const response = files.map(f => ({
            ...f,
            ownerId: f.ownerID,
            parentId: f.parentID
        }));

        return res.status(200).json(response);
        // error - return 500
    } catch (error) {
        console.error("Error getting files list", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Restore file from Trash

exports.restoreFile = async (req, res) => {
    const fileId = req.params.id; // Using ID for precision
    const userId = req.userId;

    try {
        const file = await File.findOne({ _id: fileId, ownerID: userId });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        if (!file.inTrash) {
            return res.status(400).json({ message: "File is not in trash" });
        }

        file.inTrash = false;
        file.dateOfModification = new Date();
        await file.save();

        return res.status(200).json({
            success: true,
            message: "File restored successfully"
        });

    } catch (error) {
        console.error("Restore Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//perm delete all files
exports.emptyTrash = async (req, res) => {
    const userId = req.userId;

    try {
        const trashedFiles = await File.find({ ownerID: userId, inTrash: true });

        if (trashedFiles.length === 0) {
            return res.status(200).json({ message: "Trash is already empty" });
        }

        for (const file of trashedFiles) {
            try {
                await Client.deleteFile(file._id);
            } catch (err) {
                console.error(`Failed to delete file ${file._id} from storage:`, err);
            }
        }

        await File.deleteMany({ ownerID: userId, inTrash: true });

        return res.status(200).json({
            success: true,
            message: "Trash emptied successfully"
        });

    } catch (error) {
        console.error("Empty Trash Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getStarredFiles = async (req, res) => {
    try {
        const userId = req.userId;
        const query = {
            $or: [
                { ownerID: userId },
                { "permissions.userId": userId }
            ],
            inTrash: false,
            isStarred: true
        };

        const files = await File.find(query);
        res.json(files.map(file => ({
            id: file._id,
            name: file.name,
            isStarred: true,
            isFolder: file.isFolder,
            ownerId: file.ownerID
        })));
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
//Search function
exports.searchFiles = async (req, res) => {
    const query = req.params.query;
    const userId = req.userId;
    if (!query) return res.status(400).json({
        message: "Missing query"
    });

    try {
        const foundFiles = new Map();

        const localFiles = await File.searchByName(query, userId);

        localFiles.forEach(file => {
            const id = file.id || file._id.toString();
            foundFiles.set(id, file);
        });
        console.log("Found files:" + foundFiles);
        try {
            const cppSearchResult = await Client.search(query);

            if (Array.isArray(cppSearchResult)) {
                const lowerQuery = query.toLowerCase();

                for (const fileId of cppSearchResult) {
                    if (fileId === '200' || fileId === 'OK' || !fileId.trim()) continue;

                    if (foundFiles.has(fileId)) continue;

                    const file = File.findById(fileId);
                    if (!file) continue;
                    const hasPermission = (file.ownerID === userId) ||
                        (file.permissions && file.permissions.includes(userId));

                    if (!hasPermission) {
                        continue;
                    }

                    if (!fileId.includes(query)) {
                        console.log(`DEBUG: Content match found for ${fileId}`);
                        foundFiles.set(fileId, file);
                        continue;
                    }

                    try {
                        const content = await Client.getFile(fileId);

                        if (content && content.toLowerCase().includes(lowerQuery)) {
                            foundFiles.set(fileId, file);
                        }
                    } catch (err) {
                        console.error(`Content verification failed for ${fileId}`, err);
                    }
                }
            }
        } catch (cppError) {
            console.error("C++ backend Search Error:", cppError);
        }
        console.log("Found files:" + foundFiles);
        const results = Array.from(foundFiles.values());
        return res.status(200).json({ success: true, data: results });

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//Permission methods

exports.getFilePermissions = async (req, res) => {

    const fileId = req.params.id;

    try {
        //Find the file in your Node.js model DB
        const file = File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        const perms = file.getPermissions();

        //Return permissions
        return res.status(200).json(perms);

    } catch (error) {
        console.error("Get Permissions Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.postFilePermission = async (req, res) => {
    const fileId = req.params.id;
    try {
        const { targetUsername, access } = req.body;

        const targetUser = await User.findOne({ username: targetUsername });
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const file = await File.findById(fileId);
        if (!file) return res.status(404).json({ message: "File not found" });

        const newPerm = file.addPermission(targetUser._id, access);

        if (file.isFolder) {
            applyPermissionRecursively(fileId, targetUser._id, access);
        }

        await file.save();
        return res.status(201).json(newPerm);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateFilePermission = (req, res) => {
    try {
        //get arguemnts
        const { id, pId } = req.params;
        const { access } = req.body;

        //permissions doesnt exist
        if (!access) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const file = File.findById(id);
        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        //Update permission by ID and content
        const updatedPerm = file.updatePermission(pId, access);
        if (!updatedPerm) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        return res.status(200).json(updatedPerm);

    } catch (error) {
        //send error if failed
        console.error("Update Permission Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


exports.deleteFilePermission = (req, res) => {
    try {
        //get arguments
        const { id, pId } = req.params;
        const currentUserId = req.userId;

        //find file
        const file = File.findById(id);
        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }
        if (file.ownerID !== currentUserId) {
            return res.status(403).json({
                message: "Unauthorized: Only the owner can manage permissions"
            });
        }

        //delete permissions by id
        const deleted = file.deletePermission(pId);
        if (!deleted) {
            return res.status(404).json({
                message: "Permission not found"
            });
        }

        //return response
        return res.status(200).json({
            message: "Permission deleted"
        });
    } catch (error) {
        //return error
        console.error("Delete Permission Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
const applyPermissionRecursively = async (parentId, targetUserId, access) => {
    console.log("Applying permissions recursively");

    const children = await File.find({ parentID: parentId });

    for (const child of children) {
        child.addPermission(targetUserId, access);
        await child.save();

        if (child.isFolder) {
            await applyPermissionRecursively(child._id, targetUserId, access);
        }
    }
};

exports.getFilePermissionsWName = async (req, res) => {
    const fileId = req.params.id;

    try {
        const file = File.findById(fileId);
        if (!file) return res.status(404).json({ message: "File not found" });

        const ownerUser = User.GetUserDetailsById(file.ownerID);
        const ownerName = ownerUser ? ownerUser.username : "Unknown Owner";

        const rawPerms = file.getPermissions();
        const hydratedPerms = rawPerms.map(perm => {
            const u = User.GetUserDetailsById(perm.userId);
            return { ...perm, username: u ? u.username : "Unknown User" };
        });

        return res.status(200).json({
            ownerName: ownerName,
            permissions: hydratedPerms
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

exports.getMyFilePermission = (req, res) => {
    const fileId = req.params.id;
    const userId = req.userId;

    try {
        const file = File.findById(fileId);
        if (!file) return res.status(404).json({ message: "File not found" });

        if (String(file.ownerID) === String(userId)) {
            return res.json({ access: 'owner', canEdit: true, canShare: true });
        }
        const perm = file.permissions.find(p => String(p.userId) === String(userId));
        console.log(perm);
        if (perm) {
            return res.json({
                access: perm.access,
                canEdit: perm.access === 'editor',
                canShare: perm.access === 'editor'
            });
        }
        return res.status(403).json({ access: 'none', canEdit: false });

    } catch (error) {
        res.status(500).json({ message: "Error checking permissions" });
    }
};
//New methods for shared with me page
exports.getSharedFiles = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            console.log("failed to find user:" + userId);
            return res.status(401).json({ message: "User not identified" });
        }
        const sharedFiles = await File.find({
            ownerID: { $ne: userId },
            "permissions.userId": userId,
            inTrash: false
        });
        console.log("got shared files: " + sharedFiles.length)
        const responseFiles = sharedFiles.map(file => ({
            id: file._id,
            name: file.name,
            ownerId: file.ownerID,
            parentId: file.parentID,
            isFolder: file.isFolder,
            inTrash: file.inTrash,
            permissions: file.permissions,
            dateOfCreation: file.dateOfCreation,
            isStarred: file.isStarred || false,
        }));

        return res.json(responseFiles);

    } catch (err) {
        console.error("Error fetching shared files:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// get files only owned by me
exports.getOwnedFiles = async (req, res) => {
    try {
        const userId = req.userId;
        const { parentId } = req.query;

        let query = {
            ownerID: userId,
            inTrash: false
        };

        const targetParentId = (!parentId || parentId === 'null') ? null : parentId;
        query.parentID = targetParentId;

        const ownedFiles = await File.find(query);

        console.log("got owned files: " + ownedFiles.length)
        const responseFiles = ownedFiles.map(file => ({
            id: file._id,
            name: file.name,
            ownerId: file.ownerID,
            parentId: file.parentID,
            isFolder: file.isFolder,
            inTrash: file.inTrash,
            permissions: file.permissions,
            dateOfCreation: file.dateOfCreation,
            isStarred: file.isStarred || false,
        }));

        return res.json(responseFiles);
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

exports.getSharedFileContent = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.userId;

    try {
        const file = File.fileDB.get(fileId);
        if (!file) return res.status(404).json({ message: "File not found" });

        const hasPermission = file.permissions?.some(p => p.userId === userId);
        if (!hasPermission) return res.status(403).json({ message: "Access denied" });

        const contentFromCPP = await Client.getFile(file.id);

        console.log("Content received from CPP server:", contentFromCPP);

        // Client.getFile returns content as a string, not an object
        return res.status(200).json({
            id: file.id,
            name: file.name,
            content: contentFromCPP || "", // contentFromCPP is already a string
            isFolder: file.isFolder,
            permissions: file.permissions
        });

    } catch (error) {
        console.error("Shared Get Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateSharedFile = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.userId;
    const { name, content } = req.body;

    try {
        const file = File.fileDB.get(fileId);
        if (!file) return res.status(404).json({ message: "File not found" });

        // CHECK PERMISSION
        const permission = file.permissions?.find(p => p.userId === userId);

        if (!permission || permission.access !== 'editor') {
            return res.status(403).json({
                message: "Permission denied: You only have viewing access."
            });
        }

        file.name = name || file.name;
        file.content = content || file.content;

        await Client.updateFile(fileId, content);

        res.status(200).json({ message: "File updated successfully", file });
    } catch (error) {
        console.error("Shared Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

