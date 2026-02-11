import React, { useState, useEffect, useRef } from 'react';
import '../styles/FileItem.css';
import '../styles/global.css';
import '../styles/FileActionMenu.css';

function FileItem({ file, view, onClick, onShare, onStar, onDelete, onRestore, isTrash, onViewDetails, onRenameFolder }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu if user clicks anywhere else
    useEffect(() => {
        const closeMenu = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', closeMenu);
        return () => document.removeEventListener('mousedown', closeMenu);
    }, []);

    return (
        <div className={`file-item ${view}`} onClick={() => onClick(file)}>
            <div className="file-icon">{file.isFolder ? '📁' : '📄'}</div>
            <div className="file-name">{file.name || 'Untitled'}</div>
            {file.isFolder && (
                <span
                    className="rename-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRenameFolder(file);
                    }}
                    title="Rename Folder"
                >
                    ✏️
                </span>
            )}
            <div className="file-actions" ref={menuRef}>
                {!isTrash && (
                    <button
                        className={`star-btn ${file.isStarred ? 'starred' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onStar(file);
                        }}
                    >
                        {file.isStarred ? ' ★' : '☆'}
                    </button>
                )}
                <button
                    className="dots-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}
                >
                    ⋮
                </button>
                {menuOpen && (
                    <div className="file-menu" onClick={(e) => e.stopPropagation()}>
                        {!isTrash && (
                            <>
                                <button onClick={() => { onShare?.(file); setMenuOpen(false); }}>🔗 Share</button>
                                <button onClick={() => { onStar?.(file); setMenuOpen(false); }}>⭐ Star</button>
                                <button onClick={() => { onViewDetails?.(file); setMenuOpen(false); }}>ℹ️ View Details</button>
                                <button
                                    onClick={() => { onDelete?.(file); setMenuOpen(false); }}
                                    className="delete-option"
                                >
                                    🗑️ Delete
                                </button>
                            </>
                        )}

                        {isTrash && (
                            <>
                                <button onClick={() => { onRestore?.(file); setMenuOpen(false); }}>♻️ Restore</button>
                                <button onClick={() => { onViewDetails?.(file); setMenuOpen(false); }}>ℹ️ View Details</button>
                                <button
                                    onClick={() => { onDelete?.(file); setMenuOpen(false); }}
                                    className="delete-option"
                                >
                                    🗑️ Delete Permanently
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileItem;
