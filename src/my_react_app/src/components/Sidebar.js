import { useState } from 'react';
import '../styles/Sidebar.css';
import '../styles/global.css';

function Sidebar({ onNavigate, handleCreateFile, handleCreateFolder, handleUpload }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="sidebar">
            <h3>My Drive</h3>

            {/* + New button */}
            <button className="sidebar-new-button" onClick={toggleMenu}>
                + New
            </button>

            {/* Dropdown menu as part of sidebar */}
            {menuOpen && (
                <div className="new-menu">
                    <button onClick={handleCreateFile}>📄 Create File</button>
                    <button onClick={handleCreateFolder}>📁 Create Folder</button>
                    <button onClick={handleUpload}>⬆️ Upload Image</button>
                </div>
            )}

            {/* Sidebar navigation */}
            <ul className="sidebar-menu">
                <li onClick={() => onNavigate('files')}>🗂️ Files</li>
                <li onClick={() => onNavigate('starred')}>⭐ Starred</li>
                <li onClick={() => onNavigate('recent')}>🕰️ Recent</li>
                <li onClick={() => onNavigate('shared')}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                </svg> Shared with me</li>
                <li onClick={() => onNavigate('trash')}>🚛 Trash</li>
                <li onClick={() => onNavigate('settings')}>⚙️ Settings</li>
            </ul>
        </div>
    );
}

export default Sidebar;
