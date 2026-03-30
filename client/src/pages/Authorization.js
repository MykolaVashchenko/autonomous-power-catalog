import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Authorization() {
    const location = useLocation();
    const initialEmail = location.state?.prefilledEmail || '';

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email || !password) {
            return setError('Please fill in all fields');
        }

        if (isLogin) {
            try {
                const response = await axios.post('/api/auth/login', { email, password });
                setMessage(response.data.message);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userEmail', response.data.user.email);
                localStorage.setItem('userRole', response.data.user.role);

                setEmail('');
                setPassword('');

                window.location.href = '/profile';
            } catch (err) {
                setError(err.response?.data?.message || 'Login error');
            }
        } else {
            try {
                const response = await axios.post('/api/auth/register', { email, password });
                setMessage(response.data.message);
                setEmail('');
                setPassword('');
            } catch (err) {
                setError(err.response?.data?.message || 'Registration error');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 rounded-xl bg-white shadow-lg">
            <h2 className="text-center mb-6 text-gray-900 text-2xl font-bold tracking-tight">
                {isLogin ? 'Log In' : 'Sign Up'}
            </h2>

            {error && (
                <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm font-medium text-center">
                    {error}
                </div>
            )}
            {message && (
                <div className="mb-5 p-3 bg-green-50 border-l-4 border-green-600 text-green-700 text-sm font-medium text-center">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
                />

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
                />

                <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 select-none">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black cursor-pointer"
                    />
                    Show password
                </label>

                <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-black text-white rounded-md font-bold text-sm uppercase tracking-widest transition-all hover:bg-gray-800 active:scale-95 shadow-md"
                >
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-100 pt-6">
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setMessage('');
                        setError('');
                    }}
                    className="text-sm text-gray-500 hover:text-black font-medium transition-colors underline underline-offset-4"
                >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
            </div>
        </div>
    );
}

export default Authorization;