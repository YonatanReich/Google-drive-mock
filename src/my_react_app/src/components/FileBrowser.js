import React from 'react';
import "../styles/FileBrowser.css";
import { useEffect, useState } from 'react';

function FileBrowser({
    currentFolderId,
    setCurrentFolderId,
    files,
    visibleFiles,
    searchQuery,
    view,
    onFileClick,
    page,
    user,
    token,
    setUser
}) {

    const [form, setForm] = useState({ firstName: "" });

    useEffect(() => {
        const fetchUserData = async () => {
            // 1. Safety Check: Ensure user and username exist before fetching
            if (!user || !user.username) return;

            try {
                // 2. Use the WORKING route from your Settings page
                const res = await fetch(`http://localhost:3000/api/users/settings/${user.username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();

                // 3. Update state with the firstName property returned by getMySettings
                setForm({ firstName: data.firstName || "" });
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };

        fetchUserData();
    }, [token]); // 4. Re-run when user data or token is provided
    console.log(form);
    // Logic for the Directory Path
    const getDirectoryPath = () => {
        const path = [];
        let tempId = currentFolderId;
        while (tempId) {
            const folder = files.find(f => String(f.id) === String(tempId));
            if (folder) {
                path.unshift(folder);
                tempId = folder.parentID;
            } else { break; }
        }
        return path;
    };

    const handleBack = () => {
        const allFiles = [...files];
        const current = allFiles.find(f => String(f.id) === String(currentFolderId));
        setCurrentFolderId(current ? current.parentID : null);
    };

    return (
        <>
            <div className="file-panel-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {currentFolderId && (
                        <button className="back-btn" onClick={handleBack}>
                            ⬅️ Back
                        </button>
                    )}
                    <h2>
                        {
                            page === "files"
                                ? `Hi ${form.firstName}, Welcome to Drive`
                                : page === "recent"
                                    ? "Recent Files"
                                    : page === "shared"
                                        ? "Shared with me"
                                        : page === "starred"
                                            ? "Starred"
                                            : ""
                        }
                    </h2 >
                </div >
            </div >

            <div className="directory-bar">
                <span className="path-link" onClick={() => setCurrentFolderId(null)}>
                    🏠
                </span>
                {getDirectoryPath().map((folder) => (
                    <span key={folder.id}>
                        <span className="path-slash">/</span>
                        <span
                            className="path-link"
                            onClick={() => setCurrentFolderId(folder.id)}
                        >
                            {folder.name}
                        </span>
                    </span>
                ))}
            </div>
        </>
    );
}

export default FileBrowser;