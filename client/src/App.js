import React, { useState } from 'react';
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
    const [apiType, setApiType] = useState('rest');

    return (
        <Router>
            <div>
                <nav className="bg-black px-8 py-4 text-white flex justify-between items-center sticky top-0 z-[999] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">

                    <div className="flex-1">
                        <Link to="/" className="text-white no-underline">
                            <h2 className="m-0 text-[25px] font-bold">Gym Resource Centre</h2>
                        </Link>
                    </div>

                    <div className="flex gap-2.5 justify-center flex-1">
                        <button
                            onClick={() => setApiType('rest')}
                            className={`px-4 py-1.5 border-2 border-[#007bff] rounded-[20px] font-bold cursor-pointer transition-colors duration-300 ${apiType === 'rest' ? 'bg-[#007bff] text-white' : 'bg-transparent text-[#007bff]'}`}>
                            REST API
                        </button>
                        <button
                            onClick={() => setApiType('graphql')}
                            className={`px-4 py-1.5 border-2 border-[#e535ab] rounded-[20px] font-bold cursor-pointer transition-colors duration-300 ${apiType === 'graphql' ? 'bg-[#e535ab] text-white' : 'bg-transparent text-[#e535ab]'}`}>
                            GraphQL
                        </button>
                    </div>

                    <div className="flex gap-5 justify-end flex-1 items-center">
                        {userRole === 'admin' && (
                            <Link to="/admin" className="px-4 py-1.5 bg-[#28a745] text-white rounded-[20px] no-underline font-bold flex items-center gap-1.5 transition-colors duration-200 border-2 border-[#28a745] text-[18px]">
                                Add Exercise
                            </Link>
                        )}

                        <Link to="/" className="text-white no-underline font-bold text-[18px]">Catalog</Link>

                        {isAuthenticated ? (
                            <Link to="/profile" className="text-white no-underline font-bold text-[18px]">Profile</Link>
                        ) : (
                            <Link to="/authorization" className="text-white no-underline font-bold text-[18px]">Authorization</Link>
                        )}
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Catalog apiType={apiType} />} />
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