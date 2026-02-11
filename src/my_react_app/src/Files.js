import { useState, useRef, useEffect } from 'react';
import './styles/Files.css';
import './styles/global.css';
import NewFile from './components/NewFile.js';

import Sidebar from './components/Sidebar.js';
import Topbar from './components/Topbar.js';
import FileList from './components/FileList.js';
import { getFiles, getTrashFiles, deleteFile, restoreFile } from './services/api.js';

import FileBrowser from './components/FileBrowser.js';
import ShareModal from './components/ShareModal';
import Settings from "./components/Settings";
import FileDetailsModal from './components/FileDetailsModal';

function Files({ token, setToken, user, setUser }) {
    const [page, setPage] = useState('files');
    const [searchQuery, setSearchQuery] = useState('');
    const [newMenuOpen, setNewMenuOpen] = useState(false);
    const fileInputRef = useRef();
    const [creatingFile, setCreatingFile] = useState(false);
    const [files, setFiles] = useState([]);
    const [view, setView] = useState('list');
    const [theme, setTheme] = useState('light');
    const [editingFileId, setEditingFileId] = useState(null);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [sharingFile, setSharingFile] = useState(null);
    const [recentFiles, setRecentFiles] = useState([]);
    const [recentVisibleFiles, setRecentVisibleFiles] = useState([]);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [viewingFileDetails, setViewingFileDetails] = useState(null);
    const handleSearch = (query) => setSearchQuery(query);
    const [trashFiles, setTrashFiles] = useState([]);

    const handleNavigate = (newPage) => {
        setPage(newPage);
        setCurrentFolderId(null);
        setEditingFileId(null);
    };
    const toggleNewMenu = () => setNewMenuOpen(!newMenuOpen);
    const handleCreateFile = () => {
        setCreatingFile(true);
    };

    const getVisibleFiles = (fileList) => {
        if (currentFolderId === null) {
            return fileList.filter(f => !f.parentID);
        } else {
            return fileList.filter(f => String(f.parentID) === String(currentFolderId));
        }
    };

    const visibleFiles = (() => {
        if (page === 'trash') return trashFiles;
        let activeFiles = [];

        if (page === 'recent') {
            activeFiles = [...files, ...sharedFiles]
                .filter(f => !f.isFolder)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 15);
        } else if (page === 'shared') {
            activeFiles = sharedFiles.filter(f => !f.parentID);
        } else if (page === 'starred') {
            activeFiles = files.filter(f => f.isStarred);
        } else {
            activeFiles = getVisibleFiles(files);
        }
        return activeFiles.filter(f => !trashFiles.find(t => t.id === f.id));
    })();





    //Get files for files page
    useEffect(() => {
        if (!token || page !== 'files') return;

        const url = currentFolderId
            ? `http://localhost:3000/api/files?parentId=${currentFolderId}`
            : `http://localhost:3000/api/files`;

        fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const filesWithNames = data.map(f => ({
                    ...f,
                    name: f.name || f.id
                }));

                setFiles(prev => {
                    const combined = [...prev];
                    data.forEach(newFile => {
                        if (!combined.find(f => f.id === newFile.id)) {
                            combined.push(newFile);
                        }
                    });
                    return combined;
                });
            })
            .catch(err => console.error("Failed to fetch files", err));

    }, [token, page, currentFolderId]);

    //Get files for trash page
    useEffect(() => {
        if (!token || page !== 'trash') return;

        getTrashFiles(token)
            .then(data => {
                const filesWithNames = data.map(f => ({
                    ...f,
                    name: f.name || f.id
                }));

                setTrashFiles(filesWithNames);
            })
            .catch(err => {
                console.error("Failed to load trash files", err);
            });

    }, [token, page]);

    //Get files for shared page
    useEffect(() => {
        if (!token || page !== 'shared') return;
        console.log("Fetching shared files...");
        fetch('http://localhost:3000/api/files/shared-with-me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Raw shared data from server:", data);

                const normalizedFiles = data.map(f => ({
                    ...f,
                    name: f.name || f.fileName,
                    content: f.content || "",
                    id: String(f.id)
                }));

                setSharedFiles(normalizedFiles);
            })
            .catch(err => console.error("Failed to fetch shared files", err));
    }, [token, page]);

    //Get files for recent page
    useEffect(() => {
        if (page !== 'recent') return;

        const sorted = [...recentFiles]
            .filter(f => !f.isFolder) // Keep only files
            .sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return dateB - dateA; // Newest first
            });
        console.log("Sorted Recent Files:", sorted.map(f => ({ name: f.name, time: f.timestamp })));
        setRecentVisibleFiles(sorted);
    }, [page, recentFiles]);

    //File click 
    const handleFileClick = async (file) => {
        if (page === 'trash') return;
        if (file.isFolder) {
            console.log("Opening Shared Folder:", file.id);
            setCurrentFolderId(file.id);
            return;
        }

        // Determine which URL to use based on the current page
        const fetchUrl = page === 'shared'
            ? `http://localhost:3000/api/files/shared-file/${file.id}`
            : `http://localhost:3000/api/files/${file.id}`;

        try {
            const response = await fetch(fetchUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Could not fetch file');

            const fullFile = await response.json();
            console.log("Full file data from server:", fullFile);
            //If it's shared, update the sharedFiles state so NewFile can find the content
            if (page === 'shared') {
                setSharedFiles(prev => prev.map(f => f.id === fullFile.id ? fullFile : f));
            } else {
                setFiles(prev => prev.map(f => f.id === fullFile.id ? fullFile : f));
            }

            setEditingFileId(fullFile.id);
            setCreatingFile(true);
        } catch (err) {
            console.error("Failed to fetch file content", err);
        }
    };

    //Dark mode light mode
    const handleSetTheme = (newTheme) => {
        setTheme(newTheme);
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${newTheme}-theme`);
    };

    //Logout
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setCurrentFolderId(null);
    };
    // delete file (move to trash)
    const handleDelete = async (file) => {
        const isPermanent = page === 'trash';
        const confirmMsg = isPermanent
            ? `Are you sure you want to PERMANENTLY delete ${file.name}? This cannot be undone.`
            : `Are you sure you want to move ${file.name} to the trash?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            await deleteFile(file.id, token);
            if (isPermanent) {
                setTrashFiles(prev => prev.filter(f => f.id !== file.id));
            } else {
                const fileToDelete = files.find(f => f.id === file.id);

                setFiles(prev => prev.filter(f => f.id !== file.id));

                if (fileToDelete) {
                    setTrashFiles(prev => [{ ...fileToDelete, isDeleted: true }, ...prev]);
                }
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    // restore file from trash
    const handleRestore = async (file) => {
        try {
            await restoreFile(file.id, token);
            setTrashFiles(prev => prev.filter(f => f.id !== file.id));
            setFiles(prev => [{ ...file, isDeleted: false }, ...prev]);
        } catch (err) {
            console.error("Failed to restore", err);
        }
    };



    // Triggers when "New Folder" is clicked in the Sidebar
    const handleCreateFolder = () => {
        setFolderName(''); // Reset name
        setIsCreatingFolder(true); // Open modal
    };

    // Triggers when the user clicks "Create" inside the modal
    const submitFolderCreation = () => {
        if (!folderName.trim()) {
            alert("Please enter a folder name");
            return;
        }

        fetch('http://localhost:3000/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: folderName,
                isFolder: true,
                parentID: currentFolderId || null
            }),
        })
            .then(res => res.json())
            .then(data => {
                const folderWithName = {
                    ...data,
                    name: folderName,
                    isFolder: true,
                    parentID: currentFolderId,
                    // for backup
                    ownerId: data.ownerID || data.owner,
                    parentId: data.parentID || currentFolderId
                };
                setFiles(prev => [folderWithName, ...prev]);
                setIsCreatingFolder(false); // Close modal
                setNewMenuOpen(false); // Close sidebar menu
            })
            .catch(err => console.error('Folder creation error:', err));
    };

    const handleViewDetails = (file) => {
        setViewingFileDetails(file);
    };

    // update existing file
    const updateFile = async (id, { name, content }) => {
        // Determine if the file we are editing is a shared one
        const isShared = sharedFiles.some(f => f.id === id);

        const url = isShared
            ? `http://localhost:3000/api/files/shared-file/${id}`
            : `http://localhost:3000/api/files/${id}`;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, content }),
            });

            if (response.status === 403) {
                alert("You do not have permission to edit this file (View Only)");
                return;
            }

            if (!response.ok) throw new Error('Update failed');

            // Update the correct state array
            if (isShared) {
                setSharedFiles(prev => prev.map(f => f.id === id ? { ...f, name, content } : f));
            } else {
                setFiles(prev => prev.map(f => f.id === id ? { ...f, name, content } : f));
            }
            //Saving it to recent files
            setRecentFiles(prev => [
                { ...prev.find(f => f.id === id) || { id, name }, action: 'updated', timestamp: new Date().toISOString() },
                ...prev.filter(f => f.id !== id) // remove duplicates
            ]);
            setEditingFileId(null);
            setCreatingFile(false);
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    // create new file
    const saveNewFile = ({ name, content }) => {
        console.log("Creating new file:" + name)
        fetch('http://localhost:3000/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, content, isFolder: false, parentID: currentFolderId || null }),
        })

            .then(res => {
                if (!res.ok) throw new Error('Failed to create file');
                return res.json();
            })
            .then(data => {
                console.log("New file:" + data)
                const fileWithName = {
                    ...data,
                    name: name,
                    content: content,
                    parentID: currentFolderId,
                    // for backup
                    ownerId: data.owner || data.ownerID,
                    parentId: currentFolderId || data.parentID
                };

                setFiles(prev => [fileWithName, ...prev]);
                //Saving it to recent page
                setRecentFiles(prev => [
                    { ...fileWithName, action: 'created', timestamp: new Date().toISOString() },
                    ...prev
                ]);
                setCreatingFile(false);
            })
            .catch(err => console.error("Creation Error:", err));
    };

    const handleUpload = () => {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = '.png' || '.jpg';
        try {
            picker.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const MAX_SIZE = 0.5 * 1024 * 1024;
                if (file.size > MAX_SIZE) {
                    alert("Image too large.");
                    return;
                }
                const reader = new FileReader();

                reader.onload = () => {
                    const base64Image = reader.result;

                    saveNewFile({
                        name: file.name,
                        content: base64Image
                    });

                    setNewMenuOpen(false);
                };

                reader.onerror = (err) => console.error("FileReader error:", err);
                reader.readAsDataURL(file);
            };

            picker.click();
        }
        catch {
            alert("Image too large");
        }
    };

    // upload file to server
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            fetch('http://localhost:3000/api/files/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('File uploaded:', data);
                    setNewMenuOpen(false);
                });
        }
    };
    //Tracks the directory 
    const getDirectoryPath = () => {
        const path = [];
        let tempId = currentFolderId;

        while (tempId) {
            const folder = files.find(f => f.id === tempId);
            if (folder) {
                path.unshift(folder);
                tempId = folder.parentID;
            } else {
                break;
            }
        }
        return path;
    };

    const handleShareFile = async (fileId, targetUsername, access) => {
        try {
            // Lookup ID first
            const resUser = await fetch(`http://localhost:3000/api/users/by-username/${targetUsername}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!resUser.ok) throw new Error('User not found');
            const userData = await resUser.json();
            const targetUserId = userData.id;

            // Then call share endpoint
            const response = await fetch(`http://localhost:3000/api/files/${fileId}/permissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ targetUserId, access }),
            });

            if (!response.ok) throw new Error('Failed to share file');
            const data = await response.json();

            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, permissions: [...(f.permissions || []), data] } : f));
            setSharedFiles(prev => prev.map(f => f.id === fileId ? { ...f, permissions: [...(f.permissions || []), data] } : f));

            console.log('File shared:', data);
            alert(`File shared with ${targetUsername} as ${access}`);
        } catch (err) {
            console.error('Share error:', err);
            alert(err.message || 'Failed to share file');
        }
    };
    const handleRenameFolder = async (folder) => {
        const newName = prompt(`Rename folder "${folder.name}" to:`, folder.name);

        if (!newName || newName.trim() === "" || newName === folder.name) return;

        try {
            const response = await fetch(`http://localhost:3000/api/files/${folder.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newName.trim() }),
            });

            if (!response.ok) throw new Error('Failed to rename folder');

            setFiles(prev => prev.map(f =>
                f.id === folder.id ? { ...f, name: newName.trim() } : f
            ));

        } catch (err) {
            console.error("Rename Error:", err);
            alert("Could not rename folder.");
        }
    }
    const handleToggleStar = async (file) => {
        const isStarred = !file.isStarred;

        setFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, isStarred: isStarred } : f
        ));

        setSharedFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, isStarred: isStarred } : f
        ));

        setRecentFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, isStarred: isStarred } : f
        ));

        setTrashFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, isStarred: isStarred } : f
        ));
    };

    //To see the amount of files/folders updated
    console.log(files);
    console.log(user);
    //Builds the page
    return (
        <div className="files-page">
            <Topbar
                user={user}
                onSearch={handleSearch}
                onLogout={handleLogout}
                onSetTheme={handleSetTheme}
                currentTheme={theme}
                setUser={setUser}
            />
            <div className="files-main">
                <Sidebar
                    onNavigate={(target) => {
                        handleNavigate(target);
                        if (target === 'files') {
                            setCurrentFolderId(null);
                        }
                    }}
                    onNewFile={toggleNewMenu}
                    newMenuOpen={newMenuOpen}
                    handleCreateFile={handleCreateFile}
                    handleCreateFolder={handleCreateFolder}
                    handleUpload={handleUpload}
                />

                <div className="files-content">
                    {(page === 'files' || page === 'trash') && (
                        <>
                            <div className="file-panel-header">
                                {page === 'trash' && <h2>🗑️ Trash</h2>}
                                <div className="view-toggle">
                                    <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>📄 List</button>
                                    <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>🗂️ Grid</button>
                                </div>
                            </div>
                            <FileBrowser
                                currentFolderId={currentFolderId}
                                setCurrentFolderId={setCurrentFolderId}
                                files={files}
                                visibleFiles={visibleFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                page={page}
                                user={user}
                                token={token}
                                setToken={setToken}
                                setUser={setUser}
                            />

                            <FileList
                                files={visibleFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                                isTrash={page === 'trash'}
                                onShare={(file) => setSharingFile(file)}
                                onStar={handleToggleStar}
                                isRecent={false}
                                onViewDetails={handleViewDetails}
                                onRenameFolder={handleRenameFolder}
                            />
                        </>
                    )}

                    {page === 'starred' && (
                        <div className="starred-view">
                            <FileBrowser
                                currentFolderId={currentFolderId}
                                setCurrentFolderId={setCurrentFolderId}
                                files={files}
                                visibleFiles={recentVisibleFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                page={page}
                            />
                            <FileList
                                files={visibleFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                onDelete={handleDelete}
                                onStar={handleToggleStar}
                                isTrash={false}
                                isRecent={false}
                                onRenameFolder={handleRenameFolder}
                                onViewDetails={handleViewDetails}
                            />
                        </div>
                    )}
                    {page === 'recent' && (
                        <div className="recent-view">
                            <FileBrowser
                                currentFolderId={currentFolderId}
                                setCurrentFolderId={() => { }}
                                files={recentVisibleFiles}
                                visibleFiles={recentVisibleFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                page={page}
                                user={user}
                                token={token}
                                setToken={setToken}
                                setUser={setUser}
                            />
                            <FileList
                                files={recentVisibleFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                                isTrash={false}
                                onShare={(file) => setSharingFile(file)}
                                onStar={handleToggleStar}
                                isRecent={true}
                                onRenameFolder={handleRenameFolder}
                                onViewDetails={handleViewDetails}
                            />
                        </div>
                    )}
                    {page === 'shared' && (
                        <div className="shared-view">
                            <FileBrowser
                                currentFolderId={null}
                                setCurrentFolderId={setCurrentFolderId}
                                files={sharedFiles}
                                visibleFiles={sharedFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                page={page}
                                user={user}
                                token={token}
                                setToken={setToken}
                                setUser={setUser}
                            />
                            <FileList
                                files={sharedFiles}
                                searchQuery={searchQuery}
                                view={view}
                                onFileClick={handleFileClick}
                                onShare={(file) => setSharingFile(file)}
                                onStar={handleToggleStar}
                                onDelete={() => { }}
                                isRecent={false}
                                onViewDetails={handleViewDetails}
                            />
                        </div>
                    )}
                    {page === 'settings' && <Settings token={token} user={user} />}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />

            {sharingFile && (
                <ShareModal
                    file={sharingFile}
                    onClose={() => setSharingFile(null)}
                    onShareSubmit={handleShareFile}
                    token={token}
                    user={user}
                />
            )}

            {creatingFile && (() => {
                const currentFile = files.find(f => String(f.id) === String(editingFileId)) ||
                    sharedFiles.find(f => String(f.id) === String(editingFileId));

                const isImage = currentFile && (
                    currentFile.name?.toLowerCase().endsWith('.png') ||
                    currentFile.name?.toLowerCase().endsWith('.jpg') ||
                    currentFile.name?.toLowerCase().endsWith('.jpeg') ||
                    currentFile.content?.startsWith('data:image')
                );

                return isImage ? (
                    <div className="folder-modal-overlay">
                        <div className="folder-modal-card shadow-lg" style={{ maxWidth: '600px', width: '90%' }}>
                            <div className="folder-modal-header">
                                <h3 style={{ margin: 0 }}>{currentFile.name}</h3>
                            </div>
                            <div className="folder-modal-body" style={{ textAlign: 'center', padding: '20px' }}>
                                <img
                                    src={currentFile.content}
                                    alt={currentFile.name}
                                    style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '4px' }}
                                />
                            </div>
                            <div className="folder-modal-footer">
                                <button
                                    className="folder-btn-secondary"
                                    onClick={() => {
                                        setCreatingFile(false);
                                        setEditingFileId(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <NewFile
                        onSave={(data) => {
                            if (editingFileId) {
                                updateFile(editingFileId, data);
                            } else {
                                saveNewFile(data);
                            }
                        }}
                        onClose={() => {
                            setCreatingFile(false);
                            setEditingFileId(null);
                        }}
                        initialData={
                            files.find(f => String(f.id) === String(editingFileId)) ||
                            sharedFiles.find(f => String(f.id) === String(editingFileId))
                        }
                        isReadOnly={(() => {
                            if (page !== 'shared') return false;

                            const sharedFile = sharedFiles.find(f => String(f.id) === String(editingFileId));
                            console.log("My User ID:", user?.Id);
                            console.log("File Permissions Array:", sharedFile?.permissions);

                            const myPermission = sharedFile?.permissions?.find(p =>
                                String(p.userId).trim().toLowerCase() === String(user?.Id).trim().toLowerCase()
                            );

                            return myPermission?.access === 'viewer';
                        })()}
                    />
                );
            })()}
            {isCreatingFolder && (
                <div className="folder-modal-overlay">
                    <div className="folder-modal-card shadow-lg">
                        <div className="folder-modal-header">
                            <input
                                type="text"
                                className="folder-modal-input"
                                placeholder="Untitled folder"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && submitFolderCreation()}
                            />
                        </div>
                        <div className="folder-modal-body">

                        </div>
                        <div className="folder-modal-footer">
                            <button className="folder-btn-secondary" onClick={() => setIsCreatingFolder(false)}>
                                Cancel
                            </button>
                            <button className="folder-btn-primary" onClick={submitFolderCreation}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {viewingFileDetails && (
                <FileDetailsModal
                    file={viewingFileDetails}
                    onClose={() => setViewingFileDetails(null)}
                    currentUser={user}
                />
            )}
        </div>
    );
}

export default Files;