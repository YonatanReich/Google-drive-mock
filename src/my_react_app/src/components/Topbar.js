import '../styles/Topbar.css';
import '../styles/global.css';
import { useRef, useState } from 'react';

function Topbar({ user, onSearch, onLogout, onSetTheme, currentTheme, setUser }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const profileInputRef = useRef(null);
    const defaultIcon = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(e.target.elements.search.value);
    };

    // Corrected Image Change Logic
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    
    reader.onloadend = () => {
        const base64String = reader.result;
        
       
        const updatedUser = { ...user, profileImg: base64String };
        
        
        setUser(updatedUser);
        
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        
        setIsProfileModalOpen(false);
    };

    reader.readAsDataURL(file);
};

    const handleDeletePicture = () => {
        const updatedUser = { ...user, profileImg: null };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsProfileModalOpen(false);
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <img src="./first_logo.png" alt="logo" className="topbar-logo" />
                <h2 className="topbar-title">Drive</h2>
            </div>

            <form onSubmit={handleSearch} className="topbar-search-form">
                <input type="text" name="search" placeholder="Search files..." className="topbar-search" />
                <button type="submit" className="topbar-search-button">🔎︎</button>
            </form>

            <div className="topbar-user">
                <div className="theme-toggle">
                    <button className={`light ${currentTheme === 'light' ? 'active' : ''}`} onClick={() => onSetTheme('light')}>☀️</button>
                    <button className={`dark ${currentTheme === 'dark' ? 'active' : ''}`} onClick={() => onSetTheme('dark')}>🌙</button>
                </div>
                
                <button className="topbar-button" onClick={onLogout}>👋 Logout</button>

                <img
                    src={user.profileImg || defaultIcon}
                    alt="profile"
                    className="topbar-user-image shadow-sm"
                    style={{ cursor: 'pointer', borderRadius: '50%', width: '80px', height: '80px', objectFit: 'cover' }}
                    onClick={() => setIsProfileModalOpen(true)}
                />
            </div>

            {isProfileModalOpen && (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 9999 }}>
        <div className="modal-dialog modal-dialog-centered profile-modal-container">
            <div className="modal-content border-0 shadow rounded-4 p-3 bg-dark text-white">
                <div className="modal-header border-0 pb-0 d-flex justify-content-center position-relative">
    <h5 className="modal-title fs-4 fw-bold text-center w-100">
        Choose your Profile Picture
    </h5>
    
    <button 
        type="button" 
        className="btn-close btn-close-white position-absolute end-0 me-3" 
        onClick={() => setIsProfileModalOpen(false)}
        aria-label="Close"
    ></button>
</div>
                
                <div className="modal-body py-4 d-flex flex-column align-items-center">
                    <img 
                        src={user?.profileImg || defaultIcon} 
                        alt="Profile" 
                        className="rounded-circle border border-secondary border-3 mb-4"
                        style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                    />
                    
                    
                    <input 
                        type="file" 
                        ref={profileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                    
                    <div className="d-flex justify-content-center gap-3">
                        <button 
                            className="btn btn-primary rounded-pill px-4" 
                            onClick={() => profileInputRef.current.click()} 
                        >
                            🔄 Change
                        </button>
                        <button className="btn btn-outline-danger rounded-pill px-4" onClick={handleDeletePicture}>
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
}

export default Topbar;