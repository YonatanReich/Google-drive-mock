import React from 'react';
import '../styles/FileActionMenu.css';

function FileActionMenu({ onOpen, onDelete, onRestore, isTrash }) {
    return (
        <div 
            className="file-action-menu"
            onClick={(e) => e.stopPropagation()} // prevent closing parent
        >
            {/* show restore if in trash, otherwise open */}
            {isTrash ? (
                 <div className="menu-option" onClick={onRestore}>
                    ♻️ Restore
                </div>
            ) : (
                <div className="menu-option" onClick={onOpen}>
                    📂 Open
                </div>
            )}

            <div style={{ height: '1px', background: '#eee', margin: '5px 0' }}></div>

            {/* delete text changes based on location */}
            <div className="menu-option delete" onClick={onDelete} style={{ color: 'red' }}>
                {isTrash ? '🗑️ Delete Forever' : '🗑️ Move to Trash'}
            </div>
        </div>
    );
}

export default FileActionMenu;