const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController.js');
const isLoggedIn = require('../utils/jwtAuth.js');


// route for searching files (does't need a id)
router.get('/search/:query', fileController.searchFiles);

// route for getting Trash files list
router.get('/trash', isLoggedIn, fileController.getTrashFilesList);
//file sharing methods
router.get('/shared-with-me', isLoggedIn, fileController.getSharedFiles);
router.get('/owned', isLoggedIn, fileController.getOwnedFiles);
router.get('/shared-file/:id', isLoggedIn, fileController.getSharedFileContent);
router.patch('/shared-file/:id', isLoggedIn, fileController.updateSharedFile);
router.get('/', isLoggedIn, fileController.getMyFiles);
router.get('/:id/my-permission', isLoggedIn, fileController.getMyFilePermission);
router.delete('/trash/empty', isLoggedIn, fileController.emptyTrash);
router.get('/starred', isLoggedIn, fileController.getStarredFiles);

// route for commands that doesn't use a file id
router.route('/')
    // every command starts with id validation    
    .all(isLoggedIn)

    // route for posting a file
    .post(fileController.postFile)

    // route for GET (all) files list
    .get(fileController.getFilesList);


// route for restoring a file from Trash
router.post('/:id/restore', isLoggedIn, fileController.restoreFile);

// route for commands that use a file id
router.route('/:id')
    // every command starts with id validation    
    .all(isLoggedIn)

    // route for GET file
    .get(fileController.getFile)

    // route for PATCH file
    .patch(fileController.updateFile)

    // route for DELETE file
    .delete(fileController.deleteFile);


// route for commands that use a file id and permissions
router.route('/:id/permissions')
    // every command starts with id validation    
    .all(isLoggedIn)

    //get file permissions
    .get(fileController.getFilePermissions)

    //post file permissions
    .post(fileController.postFilePermission);

router.route('/:id/permissionsName')
    //get permissions with username
    .get(fileController.getFilePermissionsWName);

router.route('/:id/permissions/:pId')

    // every command starts with id validation    
    .all(isLoggedIn)

    //Update permission
    .patch(fileController.updateFilePermission)

    //Delete permission
    .delete(fileController.deleteFilePermission);


module.exports = router;