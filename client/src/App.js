import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Authorization from './pages/Authorization';
import Activate from './pages/Activate';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import EditResource from './pages/EditResource';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    return (
        <Router>
            <div>
                <nav style={{ background: '#333', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Ресурсний Центр</h2>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Каталог</Link>

                        {isAuthenticated ? (
                            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Профіль</Link>
                        ) : (
                            <Link to="/authorization" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Авторизація</Link>
                        )}
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Catalog />} />
                    <Route path="/authorization" element={<Authorization />} />
                    <Route path="/activate/:link" element={<Activate />} />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <Profile /> : <Navigate to="/authorization" replace />}
                    />
                    <Route
                        path="/admin"
                        element={userRole === 'admin' ? <Admin /> : <Navigate to="/" replace />}
                    />
                    <Route
                        path="/admin/edit/:id"
                        element={userRole === 'admin' ? <EditResource /> : <Navigate to="/" replace />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;