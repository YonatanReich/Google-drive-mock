import React, { useRef, useEffect, useState } from 'react';
import '../styles/ShareModal.css';

function ShareModal({ file, token, onClose, onShareSubmit, user }) {
    const userRef = useRef();
    const accessRef = useRef();
    const [permissions, setPermissions] = useState([]); // Local state for permissions
    const [ownerName, setOwnerName] = useState("Loading...");
    const [userCapabilities, setUserCapabilities] = useState({ access: 'viewer', canEdit: false, canShare: false });
    const canShare = userCapabilities.canShare;
    const isOwner = userCapabilities.access === 'owner';
    const displayedOwnerName = isOwner ? "You" : (file.owner || file.ownerName || "Owner");

    console.log("FILE", file);

    useEffect(() => {

        // Reset owner name when file changes so you don't see the old owner
        setOwnerName("Loading...");

        // 1. Fetch my specific capabilities (for the Share button/Delete button)
        fetch(`http://localhost:3000/api/files/${file.id}/my-permission`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUserCapabilities(data))
            .catch(err => console.error("Error fetching my-permissions:", err));

        // 2. Fetch the full list to find the owner's name
        fetch(`http://localhost:3000/api/files/${file.id}/permissions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const perms = data.permissions || [];
                setPermissions(perms);
                const ownerObj = perms.find(p => p.access === 'owner');
                if (ownerObj) {
                    const isMe = ownerObj.username === user.username;
                    setOwnerName(isMe ? `${ownerObj.username} (You)` : ownerObj.username);
                }
            })
            .catch(err => {
                console.error("Error fetching permissions list:", err);
                setOwnerName("Unknown Owner");
            });
    }, [file.id, token, user.username]);


    const handleShareClick = async () => {
        const username = userRef.current.value;
        const access = accessRef.current.value;

        if (!username) return;

        const newPermission = await onShareSubmit(file.id, username, access);

        if (newPermission) {
            setPermissions(prev => [...prev, newPermission]);
            userRef.current.value = '';
        }
    };

    const handleDeletePermission = async (pId) => {
        if (!window.confirm("Are you sure you want to remove this user's access?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/files/${file.id}/permissions/${pId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setPermissions(prev => prev.filter(p => p.pId !== pId));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to delete permission");
            }
        } catch (err) {
            console.error("Delete Permission Error:", err);
        }
    };
    if (!file) return null;

    return (
        <div className="share-modal-backdrop" onClick={onClose}>
            {/* stopPropagation prevents closing when clicking inside the white box */}
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Share "{file.name}"</h3>
                {canShare ? (
                    <div className="modal-body">
                        <p className='model-input'>Enter the Username to share with:</p>
                        <div className="input-row">
                            <input ref={userRef} className='modal-input' type="text" placeholder="Enter username..." />
                            <select ref={accessRef} className='drop-menu'>
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="view-only-info">
                        <p>You have view-only access to this file.</p>
                    </div>
                )}
                <div className="permissions-section">
                    <h4>People with access</h4>
                    <div className="permissions-list">
                        {/* Static Owner Row */}
                        <div className="permission-item">
                            <div className="user-icon">👤</div>
                            <div className="user-details">
                                <span className="user-name">{displayedOwnerName}</span>
                            </div>
                            <span className="access-label owner">Owner</span>
                        </div>
                        {permissions
                            .filter(perm => perm.access !== 'owner' && String(perm.userId) !== String(file.ownerID))
                            .map((perm, index) => (
                                <div key={index} className="permission-item">
                                    <div className="user-icon">👤</div>
                                    <div className="user-details">
                                        <span className="user-name">
                                            {perm.username}
                                        </span>
                                    </div>
                                    <span className={`access-label ${perm.access}`}>
                                        {perm.access}
                                    </span>
                                    {isOwner && (
                                        <button className="delete-perm-btn" onClick={() => handleDeletePermission(perm.pId)}>
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Close</button>
                    {canShare && (
                        <button className="share-btn" onClick={handleShareClick}>
                            Share
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShareModal;