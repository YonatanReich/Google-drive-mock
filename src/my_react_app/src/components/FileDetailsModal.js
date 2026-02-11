import React from 'react';
import '../styles/FileDetailsModal.css';

function FileDetailsModal({ file, onClose, currentUser }) {

    if (!file) return null;

    // Helper to format dates nicely
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper to display owner nicely
    const getOwnerDisplay = () => {
        // If the viewer is the owner
        if (currentUser && (file.ownerID === currentUser.id || file.owner === currentUser.id)) {
            return "You";
        }
        // Otherwise show the ID (In a real app, we would fetch the username)
        return file.ownerID || file.owner || "Unknown";
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{file.isFolder ? '📁' : '📄'} File Details</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="detail-row">
                        <span className="label">Name:</span>
                        <span className="value">{file.name}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Type:</span>
                        <span className="value">{file.isFolder ? 'Folder' : 'File'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Owner:</span>
                        <span className="value">{getOwnerDisplay()}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Created:</span>
                        <span className="value">{formatDate(file.dateOfCreation)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Modified:</span>
                        <span className="value">{formatDate(file.dateOfModification)}</span>
                    </div>

                    {/* Permissions Section */}
                    <div className="permissions-section">
                        <span className="label">Shared with:</span>
                        <div className="permissions-list">
                            {file.permissions && file.permissions.length > 0 ? (
                                file.permissions.map((perm, index) => (
                                    <div key={index} className="perm-tag">
                                        User: {perm.userId?.substring(0, 8)}... ({perm.access})
                                    </div>
                                ))
                            ) : (
                                <span className="value text-muted">Private (Only you)</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="secondary-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default FileDetailsModal;