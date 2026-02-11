import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Signup from './Signup.js';
import Login from './Login.js';
import Files from './Files.js';
import './styles/global.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Restore session
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup setToken={setToken} setUser={setUser} />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />

        <Route
          path="/files"
          element={
            token ? (
              <Files
                token={token}
                setToken={setToken}
                user={user}
                setUser={setUser}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
