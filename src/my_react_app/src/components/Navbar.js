import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

function Navbar({ setToken }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <h2>My Drive</h2>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;
