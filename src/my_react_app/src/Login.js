import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/global.css';

function Login({ setToken, setUser }) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        setError('');

        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }

        try {
            // NOTE: If you created the api.js wrapper, use that instead of fetch
            const res = await fetch('http://localhost:3000/api/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/files');
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Server error. Is the backend running?");
        }
    };

    return (
        // 1. Outer Page Background (Dark Gray #1A1A1A)
        <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#1A1A1A' }}>

            {/* 2. The Card (Darker Black #0F0F0F) */}
            <div className="card shadow-lg p-4" style={{ width: '1000px', borderRadius: '16px', backgroundColor: '#0F0F0F', color: 'white' }}>

                {/* 3. The Grid Row (REQUIRED for columns to sit side-by-side) */}
                <div className="row g-0">

                    {/* Left Column: Logo & Title */}
                    <div className="col-md-5 d-flex flex-column align-items-start justify-content-start">
                        <img
                            src="/first_logo.png"
                            alt="Logo"
                            style={{ width: '100px', marginBottom: '10px' }}
                        />
                        <h2 className="mb-0 fw-bold">Sign in</h2>
                    </div>
                    {/* Right Column: Inputs */}
                    <div className="col-md-7 ps-md-5">
                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold"></label>
                            <input
                                type="text"
                                className="form-control form-control-lg bg-transparent text-white border-secondary fs-6"
                                placeholder="Enter username"
                                ref={usernameRef}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary small fw-bold"></label>
                            <input
                                type="password"
                                className="form-control form-control-lg bg-transparent text-white border-secondary fs-6"
                                placeholder="Enter password"
                                ref={passwordRef}
                            />
                        </div>

                        {error && <p className="text-danger small text-center">{error}</p>}

                        <button
                            onClick={handleLogin}
                            className="btn btn-primary w-100 btn-lg mb-3"
                            style={{ backgroundColor: '#1a73e8', borderColor: '#1a73e8' }}
                        >
                            Login
                        </button>

                        <p className="text-center mt-3 text-secondary">
                            Don't have an account? <Link to="/signup" className="text-decoration-none text-primary">Sign up here</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;